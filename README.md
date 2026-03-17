# TrapRoyaltiesPro — Production Server

## Server Info
- **Host**: srv1406833.hstgr.cloud (Hostinger VPS)
- **App Root**: /traproyalties-new
- **OS**: Ubuntu 22.04

## Stack
- **Frontend**: Next.js 14 App Router — port 4000 (PM2: traproyalties-next, id 3)
- **Backend**: FastAPI + uvicorn — port 8000 (PM2: fastapi, id 42)
- **DB**: SQLite isrc_mappings.db (primary), PostgreSQL optional
- **Storage**: IDrive e2 S3-compatible (eu-central-2)

## Nginx Configuration
Nginx reverse proxies both services:

```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name traproyaltiespro.com www.traproyaltiespro.com srv1406833.hstgr.cloud;

    # Frontend (Next.js on port 4000)
    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API (FastAPI on port 8000)
    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## PM2 Process Management
```bash
pm2 list                    # show all processes
pm2 restart 3               # restart frontend
pm2 logs 3 --lines 50       # frontend logs
pm2 restart fastapi         # restart backend
```

## Deploy Workflow
```bash
# After file changes:
cd /traproyalties-new/packages/frontend
npm run build
pm2 restart 3

# Backend restart:
pm2 restart fastapi
```

## Key Directories
- Frontend: /traproyalties-new/packages/frontend
- Backend API: /traproyalties-new/api
- PM2 config: /traproyalties-new/ecosystem.config.js
- Nginx config: /etc/nginx/sites-enabled/traproyalties
- SSL certs: /etc/letsencrypt/live/traproyaltiespro.com/

## Backups
Timestamped backups at: /backups/traproyalties-new-YYYYMMDD-HHMMSS/
Full site tarballs at: /backups/traproyalties-full-YYYYMMDD-HHMMSS.tar.gz

## Environment Variables
Stored in /traproyalties-new/packages/frontend/.env.local
Keys: OPENAI_API_KEY, YOUTUBE_API_KEY, DISCOGS_TOKEN, STRIPE_SECRET_KEY, ACRCLOUD_TOKEN
IDrive e2 keys: in ecosystem.config.js (move to .env)
