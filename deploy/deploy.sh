#!/bin/bash
# Run this from your LOCAL machine every time you want to deploy
# Usage: bash deploy/deploy.sh

VPS_IP="187.77.93.145"
VPS_HOST="srv1406833.hstgr.cloud"
VPS_USER="root"
APP_DIR="/var/www/traproyalties"
SSH_KEY="$HOME/.ssh/traproyalties_ed25519"
PROJECT_DIR="$(dirname "$(cd "$(dirname "$0")" && pwd)")"

echo "=== Deploying TrapRoyaltiesPro to $VPS_HOST ==="

# Sync project files (exclude node_modules, .next, .git)
rsync -avz --delete \
  -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude '*.log' \
  "$PROJECT_DIR/" "$VPS_USER@$VPS_HOST:$APP_DIR/"

echo "Files synced. Copying env and building on VPS..."

# Copy env.production to .env.local on VPS
scp -i "$SSH_KEY" "$PROJECT_DIR/deploy/env.production" "$VPS_USER@$VPS_HOST:$APP_DIR/.env.local"

# Build and restart on VPS
ssh -i "$SSH_KEY" "$VPS_USER@$VPS_HOST" << 'ENDSSH'
  cd /var/www/traproyalties
  npm install --production=false
  npm run build
  pm2 delete traproyalties 2>/dev/null || true
  pm2 start npm --name "traproyalties" -- start
  pm2 save
ENDSSH

echo ""
echo "=== Deployed! Site running at http://187.77.93.145:3000 ==="
