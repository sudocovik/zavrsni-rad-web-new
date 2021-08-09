FROM pulumi/pulumi-nodejs:latest AS production

COPY --from=alpine/helm:latest /usr/bin/helm /usr/bin/helm

RUN apt-get update -y && \
    apt-get install -y \
        jq && \
    rm -rf /var/lib/apt/lists/*

ENV PULUMI_HOME /pulumi/home
RUN mkdir ${PULUMI_HOME}

COPY package-lock.json /tmp

RUN pulumi plugin install resource digitalocean $(cat /tmp/package-lock.json | jq --raw-output '.dependencies."@pulumi/digitalocean".version') --exact
RUN pulumi plugin install resource kubernetes $(cat /tmp/package-lock.json | jq --raw-output '.dependencies."@pulumi/kubernetes".version') --exact

RUN rm -f /tmp/package-lock.json && \
    chown -R node:node ${PULUMI_HOME}


FROM production AS local

COPY Pulumi.yaml .
COPY Pulumi.local.yaml .

RUN chown -R node:node /pulumi/projects

USER node
ENV PULUMI_CONFIG_PASSPHRASE=''
RUN pulumi login file://${PULUMI_HOME} --non-interactive && \
    pulumi stack init local --non-interactive && \
    pulumi stack select local --non-interactive
