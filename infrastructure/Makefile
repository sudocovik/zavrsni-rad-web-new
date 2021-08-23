.PHONY: pulumi
pulumi:
	docker run -it \
		--rm \
		-u 1000:1000 \
		-v $$(pwd):/pulumi/projects \
		--env-file=pulumi.env \
		$$(docker build --target=production -q .) \
		/bin/bash

.PHONY: local
local:
	docker run -it \
		--rm
		-u 1000:1000 \
		--network host \
		-v $$(pwd):/pulumi/projects \
		$$(docker build --target=local -q .) \
		/bin/bash

.PHONY: clean
clean:
	rm -rf ./local/manifests/*