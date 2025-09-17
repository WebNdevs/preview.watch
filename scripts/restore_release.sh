#!/usr/bin/env bash
set -euo pipefail
# Usage: ./scripts/restore_release.sh <frontend_tar> <backend_tar> [--skip-backend] [--skip-frontend]
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_DIR="$ROOT_DIR/backend"

FRONT_TAR=${1:-}
BACK_TAR=${2:-}
[[ -z "$FRONT_TAR" || -z "$BACK_TAR" ]] && echo "Specify frontend and backend tar files" && exit 1

SKIP_FRONTEND=0; SKIP_BACKEND=0
for arg in "$@"; do
  [[ $arg == --skip-frontend ]] && SKIP_FRONTEND=1
  [[ $arg == --skip-backend ]] && SKIP_BACKEND=1
done

if [ $SKIP_FRONTEND -eq 0 ]; then
  echo "Restoring frontend from $FRONT_TAR"
  cd "$FRONTEND_DIR"
  rm -rf .next/standalone .next/static || true
  tar -xzf "$FRONT_TAR" --strip-components=0
  # Reinstall only production deps to ensure modules present if not standalone
  if [ -d .next/standalone ]; then
    echo "Standalone build detected (no npm install needed)."
  else
    if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi
  fi
fi

if [ $SKIP_BACKEND -eq 0 ]; then
  echo "Restoring backend from $BACK_TAR"
  cd "$BACKEND_DIR"
  tar -xzf "$BACK_TAR" --strip-components=0
  composer install --no-dev --optimize-autoloader
  php artisan optimize || true
fi

echo "Restore complete. Remember to:
1. Provide or verify backend .env
2. Run php artisan migrate --force
3. Restart systemd services (frontend, queue, scheduler, php-fpm)
"