#!/usr/bin/env bash
# Simple uptime / health checker for preview.watch stack
# - Checks Laravel API health endpoint
# - Checks Next.js homepage
# - Logs results to infrastructure/monitor/uptime.log
# - Optional: sends webhook notification if consecutive failures exceed threshold

set -euo pipefail
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
LOG_DIR="$BASE_DIR/infrastructure/monitor"
LOG_FILE="$LOG_DIR/uptime.log"
STATE_FILE="$LOG_DIR/uptime_state" # tracks consecutive failure counts
MAX_FAILS_BEFORE_ALERT=${MAX_FAILS_BEFORE_ALERT:-3}
WEBHOOK_URL=${WEBHOOK_URL:-}
DATE_TS="$(date '+%Y-%m-%d %H:%M:%S')"

mkdir -p "$LOG_DIR"
: > /dev/null

consecutive_backend_fails=0
consecutive_frontend_fails=0
if [[ -f "$STATE_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$STATE_FILE" || true
fi

log() {
  echo "[$DATE_TS] $1" >> "$LOG_FILE"
}

probe() {
  local name="$1" url="$2" expect="$3" timeout_sec="${4:-5}" status body
  status=$(curl -k -m "$timeout_sec" -o /tmp/uptime_resp.$$ -s -w '%{http_code}' "$url" || echo '000')
  body=$(head -c 200 /tmp/uptime_resp.$$ 2>/dev/null || true)
  rm -f /tmp/uptime_resp.$$
  if [[ "$status" == "$expect" ]]; then
    log "$name OK ($status)"
    echo "ok"
  else
    log "$name FAIL status=$status body='${body//'/'/}...'"
    echo "fail"
  fi
}

backend_result=$(probe BACKEND http://127.0.0.1:8000/health 200 4)
frontend_result=$(probe FRONTEND https://preview.watch/ 200 6)

if [[ $backend_result == ok ]]; then
  consecutive_backend_fails=0
else
  ((consecutive_backend_fails++))
fi
if [[ $frontend_result == ok ]]; then
  consecutive_frontend_fails=0
else
  ((consecutive_frontend_fails++))
fi

echo "consecutive_backend_fails=$consecutive_backend_fails" > "$STATE_FILE"
echo "consecutive_frontend_fails=$consecutive_frontend_fails" >> "$STATE_FILE"

restart_action_performed=0

# Auto-restart logic (conservative): if frontend fails 2 times consecutively and port 3000 closed, try restart
if [[ $consecutive_frontend_fails -ge 2 ]]; then
  if ! timeout 2 bash -c '</dev/tcp/127.0.0.1/3000' 2>/dev/null; then
    log "Attempting frontend restart (suspected down)"
    systemctl restart preview-watch-frontend.service 2>> "$LOG_FILE" || true
    restart_action_performed=1
  fi
fi
# Backend restart path (add a systemd unit if required later)
if [[ $consecutive_backend_fails -ge 2 ]]; then
  # placeholder: could restart php-fpm or queue workers
  log "Backend reported unhealthy - manual intervention suggested"
fi

# Alert if thresholds exceeded
if [[ -n "$WEBHOOK_URL" ]]; then
  if (( consecutive_backend_fails >= MAX_FAILS_BEFORE_ALERT )) || (( consecutive_frontend_fails >= MAX_FAILS_BEFORE_ALERT )); then
    payload=$(jq -n --arg msg "preview.watch uptime alert: backend_fails=$consecutive_backend_fails frontend_fails=$consecutive_frontend_fails restart=$restart_action_performed" '{text:$msg}')
    curl -s -X POST -H 'Content-Type: application/json' -d "$payload" "$WEBHOOK_URL" >/dev/null 2>&1 || log "Webhook send failed"
  fi
fi

exit 0
