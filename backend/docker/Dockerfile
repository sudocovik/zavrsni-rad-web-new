FROM php:8-fpm-alpine3.14 as build-dependencies

COPY --from=composer:2.1.5 /usr/bin/composer /usr/bin/composer

WORKDIR /dependencies

COPY ./composer.json ./composer.json
COPY ./composer.lock ./composer.lock

RUN composer install --no-autoloader --no-scripts --no-interaction

FROM php:8-fpm-alpine3.14 as build-artifact

WORKDIR /app

COPY --from=build-dependencies /dependencies/vendor ./vendor
COPY --from=build-dependencies /usr/bin/composer /usr/bin/composer

COPY ./bootstrap ./bootstrap
COPY ./config ./config
COPY ./public ./public
COPY ./resources/lang ./resources/lang
COPY ./resources/views ./resources/views
COPY ./routes ./routes
COPY --chown=www-data ./storage/framework ./storage/framework
COPY ./composer.json ./composer.json
COPY ./composer.lock ./composer.lock
COPY ./artisan ./artisan
COPY ./app ./app

RUN composer dump-autoload --optimize --no-interaction

FROM php:8-fpm-alpine3.14 as runtime

RUN docker-php-ext-install pdo pdo_mysql

WORKDIR /app

COPY --from=build-artifact /app .
