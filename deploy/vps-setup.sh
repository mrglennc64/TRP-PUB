#!/bin/bash
# Run this ONCE on the VPS to install everything
# Usage: bash vps-setup.sh

set -e

echo "=== TrapRoyaltiesPro VPS Setup ==="

# 1. Update system
apt-get update -y

# 2. Install Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 3. Install PM2
npm install -g pm2

# 4. Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 5. Configure Ollama to bind on all interfaces
mkdir -p /etc/systemd/system/ollama.service.d
cat > /etc/systemd/system/ollama.service.d/override.conf << 'EOF'
[Service]
Environment="OLLAMA_HOST=127.0.0.1:11434"
EOF

systemctl daemon-reload
systemctl enable ollama
systemctl restart ollama

# 6. Wait for Ollama to start
echo "Waiting for Ollama..."
sleep 5

# 7. Pull the model
ollama pull qwen2.5:7b

# 8. Create app directory
mkdir -p /var/www/traproyalties

echo ""
echo "=== VPS setup complete! ==="
echo "Now run deploy.sh from your local machine."
