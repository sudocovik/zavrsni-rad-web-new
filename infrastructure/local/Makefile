IMAGE_NAME = local-cluster
CONTAINER_NAME = ${IMAGE_NAME}

COMMAND = docker run \
			--rm \
			--name=${CONTAINER_NAME} \
			-v /var/run/docker.sock:/var/run/docker.sock \
			${IMAGE_NAME}

.PHONY: build
build:
	docker build -t ${IMAGE_NAME} ./cluster

.PHONY: start
start: build
	$(COMMAND) start && \
	$(COMMAND) kubeconfig > ./cluster/kubeconfig.yml

.PHONY: stop
stop: build
	$(COMMAND) stop && \
	echo "" > ./cluster/kubeconfig.yml

.PHONY: destroy
destroy: build
	$(COMMAND) destroy && \
	echo "" > ./cluster/kubeconfig.yml

