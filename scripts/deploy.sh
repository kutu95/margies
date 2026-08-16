#!/bin/bash
# Run on the Ubuntu host: ~/apps/margies.app/scripts/deploy.sh
set -euo pipefail

APP_ROOT="${APP_ROOT:-$HOME/apps/margies.app}"
cd "$APP_ROOT"

if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
  # shellcheck disable=SC1091
  . "$HOME/.nvm/nvm.sh"
  nvm use
fi

echo "→ Pulling latest code"
git pull --ff-only

echo "→ Installing dependencies"
npm ci

echo "→ Building site"
npm run build

echo "→ Reloading PM2"
mkdir -p logs
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save

echo "✓ Deployed margies.app"
