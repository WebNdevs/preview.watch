#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TS=$(date +%Y%m%d_%H%M%S)
ART_DIR="$ROOT_DIR/releases"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_DIR="$ROOT_DIR/backend"
mkdir -p "$ART_DIR"

# 1. Frontend build (standalone if possible)
cd "$FRONTEND_DIR"
if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi
npm run build

# Distill frontend runtime subset
FRONT_OUT="$ART_DIR/frontend_build_$TS.tar.gz"
if [ -d .next/standalone ]; then
  tar -czf "$FRONT_OUT" \
    .next/standalone \
    .next/static \
    public \
    package.json \
    package-lock.json || true
else
  tar -czf "$FRONT_OUT" .next public package.json package-lock.json || true
fi

# 2. Backend vendor + code (exclude storage/logs, tests, node_modules if any)
cd "$BACKEND_DIR"
composer install --no-dev --optimize-autoloader
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

BACK_OUT="$ART_DIR/backend_build_$TS.tar.gz"
# Always exclude the .env (kept separately) and storage/app/private stuff
 tar -czf "$BACK_OUT" \
  app bootstrap/config.php composer.json composer.lock artisan \
  config database public/index.php public/storage \
  routes vendor storage/framework/views storage/framework/cache data 2>/dev/null || true

# 3. Manifest file
MANIFEST="$ART_DIR/manifest_$TS.txt"
{
  echo "timestamp=$TS"
  echo "frontend=$FRONT_OUT"
  echo "backend=$BACK_OUT"
  echo "git_commit=$(git -C "$ROOT_DIR" rev-parse HEAD 2>/dev/null || echo unknown)"
} > "$MANIFEST"

echo "Created artifacts:\n$FRONT_OUT\n$BACK_OUT\n$MANIFEST"