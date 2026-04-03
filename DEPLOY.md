# TrapRoyaltiesPro — Deployment Guide
Last updated: 2026-03-17

## Server
- **VPS**: srv1406833.hstgr.cloud (178.128.141.228)
- **SSH**: `ssh root@srv1406833.hstgr.cloud` (password: in hPanel)
- **App directory**: `/traproyalties-new/packages/frontend/`
- **PM2 process**: `traproyalties-next` (id 3)

## Nginx
- **Config**: `/etc/nginx/conf.d/traproyalties.conf`
- **Domain**: traproyaltiespro.com → port **4000**
- **SSL**: Let's Encrypt `/etc/letsencrypt/live/traproyaltiespro.com/`

```nginx
server {
    listen 443 ssl;
    server_name traproyaltiespro.com www.traproyaltiespro.com;
    ssl_certificate /etc/letsencrypt/live/traproyaltiespro.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/traproyaltiespro.com/privkey.pem;
    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Deploy Steps
```bash
cd /traproyalties-new/packages/frontend
git pull origin main
npm run build
pm2 restart 3
```

## Passwords
- Live button: `trap` (users) / `stockholm1` (developer)

## GitHub
- Repo: https://github.com/mrglennc64/traproyalties-new.git

## VPS Backups
Located at `/root/traproyalties-backup-YYYYMMDD.tar.gz`
Excludes: node_modules, .next build cache

## heyroya.se (Roya)
- **Nginx config**: `/etc/nginx/conf.d/01-roya-demo.conf` → port 3001
- **Static files**: `/var/www/roya-demo/frontend/`
- **GitHub**: https://github.com/mrglennc64/heyroya.git
