module.exports = {
  apps: [{
    name: 'fastapi',
    script: '/root/traproyalties-new/venv/bin/uvicorn',
    args: 'api.main:app --host 0.0.0.0 --port 8000',
    cwd: '/root/traproyalties-new',
    interpreter: 'python3',
    env: {
      IDRIVE_KEY: 'aoyLfrPR4XhBEYBakz91',
      IDRIVE_SECRET: 'L8ebJYCgQuiOJiwUocGb88yQl1QdVe9QUIicUtt',
      IDRIVE_REGION: 'eu-central-2',
      IDRIVE_ENDPOINT: 'https://s3.eu-central-2.idrivee2.com',
      IDRIVE_PRIVATE_BUCKET: 'traproyalties-private',
      IDRIVE_PUBLIC_BUCKET: 'traproyalties-public',
      PYTHONPATH: '/root/traproyalties-new'
    },
    error_file: '/root/.pm2/logs/fastapi-err.log',
    out_file: '/root/.pm2/logs/fastapi-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true
  }]
};
