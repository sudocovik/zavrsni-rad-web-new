.PHONY: build
build:
	docker build -t ghcr.io/covik/box-app-backend:latest -f docker/Dockerfile .
	docker build -t ghcr.io/covik/box-app-backend-webserver:latest -f docker/webserver.Dockerfile .

.PHONY: push
push:
	docker push ghcr.io/covik/box-app-backend:latest
	docker push ghcr.io/covik/box-app-backend-webserver:latest
