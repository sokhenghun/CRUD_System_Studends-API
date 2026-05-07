FROM php:8.2-cli-alpine

WORKDIR /var/www/html

RUN apk add --no-cache \
    bash \
    git \
    unzip \
    libzip-dev \
    oniguruma-dev \
    icu-dev \
    && docker-php-ext-install \
    bcmath \
    intl \
    pdo_mysql \
    zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-interaction \
    --prefer-dist

COPY . .

# Build-time only: artisan (e.g. package:discover) needs APP_KEY; Railway env overrides at runtime.
RUN cp .env.example .env \
    && php artisan key:generate --force \
    && composer dump-autoload --optimize --classmap-authoritative --no-dev \
    && mkdir -p storage/framework/{cache,sessions,views} bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && rm -f .env

EXPOSE 8080

# Note: route:cache is omitted because routes/web.php uses a closure (unsupported by route caching).
CMD ["sh", "-c", "php artisan config:cache && php artisan view:cache && php -S 0.0.0.0:${PORT:-8080} -t public public/index.php"]
