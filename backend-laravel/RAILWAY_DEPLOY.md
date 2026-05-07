# Railway deployment guide (Laravel API)

## 1) Required environment variables in Railway

Set these variables in your Railway service:

- `APP_NAME=Laravel`
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_KEY=base64:...` (generate locally with `php artisan key:generate --show`)
- `APP_URL=https://your-service.up.railway.app`
- `LOG_CHANNEL=stack`
- `LOG_LEVEL=info`
- `DB_CONNECTION=mysql`
- `DB_HOST=...`
- `DB_PORT=3306`
- `DB_DATABASE=...`
- `DB_USERNAME=...`
- `DB_PASSWORD=...`

## 2) Build and run

Railway reads:

- `Dockerfile`
- `railway.toml`

The container starts the app with:

- `php -S 0.0.0.0:$PORT -t public public/index.php`

## 3) Database migration after deploy

Run migration in Railway shell:

```bash
php artisan migrate --force
```

## 4) Optional cache warmup

```bash
php artisan optimize
```
