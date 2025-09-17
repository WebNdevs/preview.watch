#!/usr/bin/env bash
set -euo pipefail
# Prune SQL and tar.gz backups keeping N daily (7), W weekly (4), M monthly (6)
# Usage: ./monitor/backup_prune.sh /path/to/backups
DIR=${1:-/home/developerhiteshsaini/preview.watch}
KEEP_DAILY=7
KEEP_WEEKLY=4
KEEP_MONTHLY=6

cd "$DIR"
match_files() { ls -1t backup_* 2>/dev/null || true; }
FILES=$(match_files)
[ -z "$FILES" ] && exit 0

# Tag files by date
now_ts=$(date +%s)

declare -A daily weekly monthly
for f in $FILES; do
  # Expect format: backup_preview_watch_live_YYYYMMDD_HHMMSS.sql or .tar.gz
  if [[ $f =~ ([0-9]{8})_([0-9]{6}) ]]; then
    datepart=${BASH_REMATCH[1]}
    y=${datepart:0:4}; m=${datepart:4:2}; d=${datepart:6:2}
    dayKey="$y-$m-$d"
    weekKey="$(date -d "$y-$m-$d" +%G-%V)"
    monthKey="$y-$m"
    daily[$dayKey]="${daily[$dayKey]} $f"
    weekly[$weekKey]="${weekly[$weekKey]} $f"
    monthly[$monthKey]="${monthly[$monthKey]} $f"
  fi
done

# Helper to pick newest file for each bucket
pick_newest() {
  for group in "$@"; do :; done
}

# Collect keep sets
keep=()
# Daily: newest file of each of last KEEP_DAILY days
for day in $(printf '%s\n' "${!daily[@]}" | sort -r | head -n $KEEP_DAILY); do
  newest=$(echo ${daily[$day]} | tr ' ' '\n' | xargs -r ls -1t 2>/dev/null | head -n1)
  [ -n "$newest" ] && keep+=("$newest")
done
# Weekly
for week in $(printf '%s\n' "${!weekly[@]}" | sort -r | head -n $KEEP_WEEKLY); do
  newest=$(echo ${weekly[$week]} | tr ' ' '\n' | xargs -r ls -1t 2>/dev/null | head -n1)
  [ -n "$newest" ] && keep+=("$newest")
done
# Monthly
for month in $(printf '%s\n' "${!monthly[@]}" | sort -r | head -n $KEEP_MONTHLY); do
  newest=$(echo ${monthly[$month]} | tr ' ' '\n' | xargs -r ls -1t 2>/dev/null | head -n1)
  [ -n "$newest" ] && keep+=("$newest")
done

# Deduplicate
keep_sorted=$(printf '%s\n' "${keep[@]}" | sort -u)

# Delete files not in keep set
for f in $FILES; do
  if ! grep -qx "$f" <<<"$keep_sorted"; then
    echo "Pruning $f" >&2
    rm -f -- "$f"
  fi
done

exit 0
