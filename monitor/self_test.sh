#!/usr/bin/env bash
set -euo pipefail
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$BASE_DIR/backend"
cd "$BACKEND_DIR"

PHP_BIN=${PHP_BIN:-/usr/bin/php}
OUT=$($PHP_BIN artisan app:self-test --json || true)
if [[ -z "$OUT" ]]; then
  echo '{"status":"error","reason":"no-output"}'
  exit 2
fi

STATUS=$(echo "$OUT" | grep -o '"db":"error"\|"app_key":"missing"\|"cache":"error"\|"queue":"error"' || true)
if [[ -n "$STATUS" ]]; then
  echo "$OUT"
  exit 1
fi

echo "$OUT"
exit 0
