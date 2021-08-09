FROM pulumi/pulumi-nodejs:latest AS production

COPY --from=alpine/helm:latest /usr/bin/helm /usr/bin/helm

FROM production AS local

RUN mkdir /pulumi-login && chown node /pulumi-login
RUN chown -R node:node /pulumi/projects

USER node

COPY Pulumi.yaml .
COPY Pulumi.local.yaml .

ENV PULUMI_CONFIG_PASSPHRASE=''

RUN pulumi login file:///pulumi-login --non-interactive && \
    pulumi stack init local --non-interactive && \
    pulumi stack select local --non-interactive
