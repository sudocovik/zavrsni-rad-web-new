IMAGE=ghcr.io/covik/box-app-frontend:latest

.PHONY: build
build:
	docker build -t ${IMAGE} .

.PHONY: push
push:
	docker push ${IMAGE}