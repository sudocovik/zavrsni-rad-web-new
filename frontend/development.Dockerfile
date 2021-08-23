FROM node:16.1.0-alpine3.11

USER node

ENV NPM_CONFIG_PREFIX=~/.npm-global
ENV PATH="~/.npm-global/bin:${PATH}"

WORKDIR /app

RUN npm install -g @vue/cli