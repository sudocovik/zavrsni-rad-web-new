.PHONY: pulumi
pulumi:
	docker run -it \
		-u 1000:1000 \
		--env-file=pulumi.env \
		-v $$(pwd):/pulumi/projects \
		pulumi/pulumi-nodejs \
		/bin/bash