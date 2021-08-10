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
start:
	$(COMMAND) start

.PHONY: stop
stop:
	$(COMMAND) stop

.PHONY: destroy
destroy:
	$(COMMAND) destroy

