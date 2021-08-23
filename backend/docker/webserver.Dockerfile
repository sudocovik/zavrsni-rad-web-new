FROM nginx:1.21-alpine

RUN rm -rf /etc/nginx/conf.d/default.conf

COPY ./webserver.conf /etc/nginx/conf.d/app.conf

COPY ./public /app/public
