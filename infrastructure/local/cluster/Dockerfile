FROM docker:20.10

RUN apk update && apk add curl bash
SHELL ["/bin/bash", "-c"]

RUN curl -s https://raw.githubusercontent.com/rancher/k3d/main/install.sh | bash

WORKDIR /cluster

COPY configuration.yml .
COPY functions.sh ./cluster.sh
RUN chmod +x ./cluster.sh

ENTRYPOINT ["/cluster/cluster.sh"]