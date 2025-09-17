# Preview Watch Infrastructure Notes

## Uptime Monitoring
A lightweight uptime system has been added.

### Components
- `infrastructure/monitor/uptime_check.sh`: Probes backend (`/health`) and frontend (`/`).
- `infrastructure/systemd/preview-watch-frontend.service`: Ensures Next.js stays running.
- `infrastructure/systemd/preview-watch-uptime.service`: Runs a single probe execution.
- `infrastructure/systemd/preview-watch-uptime.timer`: Triggers probe every minute.
- Log output: `infrastructure/monitor/uptime.log`.

### Install (as root)
```bash
# Copy or link systemd units
cp infrastructure/systemd/preview-watch-frontend.service /etc/systemd/system/
cp infrastructure/systemd/preview-watch-uptime.service /etc/systemd/system/
cp infrastructure/systemd/preview-watch-uptime.timer /etc/systemd/system/

# Reload & enable
systemctl daemon-reload
systemctl enable --now preview-watch-frontend.service
systemctl enable --now preview-watch-uptime.timer

# Check status
systemctl status preview-watch-frontend.service
systemctl list-timers preview-watch-uptime.timer
```

### Optional Webhook Alert
Set environment variables in the uptime service (edit the service or export globally):
```
export WEBHOOK_URL="https://hooks.slack.com/services/XXXX/YYY/ZZZ"
export MAX_FAILS_BEFORE_ALERT=3
```
Adjust `User=` inside `preview-watch-uptime.service` if you prefer non-root.

### Auto-Restarts
- Frontend: If two consecutive failures and port 3000 closed, the script restarts the frontend systemd service.
- Backend: Currently only logs; add php-fpm or queue restart logic as needed.

### To View Logs
```bash
tail -f infrastructure/monitor/uptime.log
```

### Future Enhancements
- Integrate with Prometheus pushgateway.
- Add disk / SSL expiry checks.
- Add pruning of old backups & log rotation for frontend log.

## Application Health & Self-Test

- Health API: `GET /api/health` (HTTP 200 when healthy; 503 if DB or APP_KEY problem). Use this for external monitors.
- Artisan self test: `php artisan app:self-test --json` (exits non-zero on failure). Added command file `app/Console/Commands/SelfTest.php`.
- Shell wrapper: `monitor/self_test.sh` returns JSON and proper exit code for systemd timers or cron.

### Systemd Queue & Scheduler
Provided units:
- `infrastructure/systemd/preview-watch-backend-queue.service` (runs `queue:work`).
- `infrastructure/systemd/preview-watch-backend-scheduler.service` (runs `schedule:work`).

Install:
```bash
sudo cp infrastructure/systemd/preview-watch-backend-queue.service /etc/systemd/system/
sudo cp infrastructure/systemd/preview-watch-backend-scheduler.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now preview-watch-backend-queue.service
sudo systemctl enable --now preview-watch-backend-scheduler.service
```

### Optional Self-Test Timer
Create service `/etc/systemd/system/preview-watch-selftest.service`:
```
[Unit]
Description=Preview Watch Self Test

[Service]
Type=oneshot
WorkingDirectory=/home/developerhiteshsaini/preview.watch
ExecStart=/home/developerhiteshsaini/preview.watch/monitor/self_test.sh
```
Create timer `/etc/systemd/system/preview-watch-selftest.timer`:
```
[Unit]
Description=Run self test every 5 minutes

[Timer]
OnBootSec=2m
OnUnitActiveSec=5m

[Install]
WantedBy=timers.target
```
Enable:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now preview-watch-selftest.timer
```

## Queue Driver Upgrade (Redis)
For higher throughput / lower latency:
1. Install Redis + PHP extension: `sudo apt install redis-server php-redis`.
2. Set in `.env`:
```
QUEUE_CONNECTION=redis
CACHE_DRIVER=redis
SESSION_DRIVER=redis
```
3. Restart queue worker: `sudo systemctl restart preview-watch-backend-queue.service`.

## Troubleshooting Quick Commands
```bash
php artisan config:clear && php artisan cache:clear
php artisan migrate --force
curl -s https://preview.watch/api/health | jq .
php artisan app:self-test
tail -n 50 storage/logs/laravel.log
```

## Metrics Endpoint
- Prometheus format: `GET /api/metrics` exposes gauges: `app_info`, `app_key_present`, `db_up`, `db_latency_ms`, `cache_up`, `cache_latency_ms`, `queue_up`, `app_timestamp_seconds`.
- Scrape example (Prometheus `scrape_configs`):
```
- job_name: 'preview_watch'
	metrics_path: /api/metrics
	scheme: https
	static_configs:
		- targets: ['preview.watch']
```

## Log Rotation
- Config template: `infrastructure/logrotate/preview-watch`.
- Install:
```bash
sudo cp infrastructure/logrotate/preview-watch /etc/logrotate.d/preview-watch
sudo logrotate -d /etc/logrotate.d/preview-watch  # dry run
```

## Backup Pruning
- Script: `monitor/backup_prune.sh` keeps last 7 daily, 4 weekly, 6 monthly backups (by filename date pattern `backup_...YYYYMMDD_HHMMSS`).
- Dry run (show deletions without removing):
```bash
grep -q 'rm -f' monitor/backup_prune.sh # verify exists
```
- Cron example:
```
0 3 * * * /home/developerhiteshsaini/preview.watch/monitor/backup_prune.sh /home/developerhiteshsaini/preview.watch >> /var/log/preview-watch-backup-prune.log 2>&1
```

## CI/CD
### Workflows
- `ci.yml`: On push/PR to `main` builds backend & frontend, runs tests/migrations in ephemeral MySQL, packages artifacts (stored under Actions artifacts).
- `deploy.yml`: Manual trigger; downloads artifacts for specified commit SHA and deploys via SSH using provided secrets.

### Required GitHub Secrets
| Secret | Purpose |
| ------ | ------- |
| `DEPLOY_HOST` | Target server host/IP |
| `DEPLOY_PORT` | SSH port (optional, default 22) |
| `DEPLOY_USER` | SSH user (deploy) |
| `DEPLOY_SSH_KEY` | Private key for SSH auth |
| `DEPLOY_APP_DIR` | Absolute path of app on server |

### Local Packaging
```bash
bash scripts/package_release.sh
ls releases/
```

### Local Restore
```bash
bash scripts/restore_release.sh releases/frontend_build_<TS>.tar.gz releases/backend_build_<TS>.tar.gz
php artisan migrate --force
sudo systemctl restart preview-watch-frontend preview-watch-backend-queue.service preview-watch-backend-scheduler.service
```

### Suggested Symlink Layout (Future Enhancement)
```
/var/www/preview.watch/
	releases/<sha>/
	current -> releases/<sha>
	shared/.env
```
Deploy step would then update symlink and restart services for near-zero downtime.

### Rollback
Point `current` back to prior release (if using symlinks) then restart services.

### Security Notes
- Never commit `.env`.
- Use least privilege DB user.
- Consider adding a secret scan job (e.g., gitleaks) in CI later.

### Future CI Enhancements
- Add caching of Composer dependencies.
- Add frontend lint & type check steps.
- Add Slack / webhook notification post deploy.
- Add Prometheus push of build metadata.
