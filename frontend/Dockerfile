FROM node:16.7-alpine3.14 AS production-artifact

WORKDIR /build

# no package-lock.json because of https://github.com/npm/cli/issues/2117
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

RUN npm install --no-fund --no-save

COPY babel.config.js ./babel.config.js
COPY vue.config.js ./vue.config.js

COPY public ./public
COPY src ./src

RUN ["npm", "run", "build", "--", "--dest=./artifact", "--modern"]

FROM nginx:1.21-alpine as production-server

COPY --from=production-artifact /build/artifact /usr/share/nginx/html