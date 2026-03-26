# TrapRoyaltiesPro — Production Server

## Server Info
- Hostname: srv1406833.hstgr.cloud
- OS: Ubuntu (Hostinger VPS)
- App root: /traproyalties-new

## Stack
- Frontend: Next.js 14 (PM2 id 3, traproyalties-next, port 4000)
- Backend: FastAPI + uvicorn (PM2 fastapi, port 8000)
- DB: SQLite (isrc_mappings.db)

## PM2 Commands
```
pm2 list
pm2 restart 3          # restart Next.js
pm2 restart fastapi    # restart FastAPI
```

## Deploy Process
1. Transfer files via base64 pipe over SSH (SCP blocked)
2. cd /traproyalties-new/packages/frontend && npm run build
3. pm2 restart 3

## Nginx Config Summary
- Config: /etc/nginx/nginx.conf, /etc/nginx/sites-enabled/
- traproyaltiespro.com → port 4000 (Next.js), SSL via Let's Encrypt
- /graph-api/ → port 5001
- heyroya.se → separate site, same VPS
- ollama → port 8080 (basic auth) → port 11434

### traproyaltiespro.com nginx block:
```nginx
server {
    listen 443 ssl;
    server_name traproyaltiespro.com www.traproyaltiespro.com;
    ssl_certificate /etc/letsencrypt/live/traproyaltiespro.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/traproyaltiespro.com/privkey.pem;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /graph-api/ {
        proxy_pass http://localhost:5001/;
    }
}

server {
    listen 80;
    server_name traproyaltiespro.com www.traproyaltiespro.com;
    return 301 https://$host$request_uri;
}
```

## Key Files
- ecosystem.config.js — PM2 config (IDrive e2 keys hardcoded — move to .env)
- packages/frontend/.env.local — ACRCloud, YouTube, Discogs, Stripe, OpenAI keys
- /tmp/start_fastapi.sh — FastAPI startup script
- /backups/ — timestamped site backups

## Backup Location
Backups stored at: /backups/traproyalties-full-YYYYMMDD-HHMMSS.tar.gz
