## Local cluster

Provisioning (or mocking) local cluster on development machine is done using [`k3d`](https://k3d.io/).

`k3d` uses `Docker` to create a node and control plane but the `Dockerfile` located at `cluster/` directory is not a *Docker-in-Docker* (*dind*) but *'Docker-through-Docker'* (*dtd*) (came up with the name, not official - unlike *dind*).

This means that `docker` CLI tool is available to container but actual Docker Engine resides on host machine.
Containers started with *dind* are not visible on host machine after executing `docker ps` unlike containers started with *dtd*.
*Docker-through-Docker* is possible after mounting `docker.sock` (found at `/var/run`) from host machine to the container file-system.

Operating the cluster is done with `Makefile` sitting next to this file.
The current working directory should be this directory (`local/`) and only then it's possible to successfully execute `make` targets.

### Start the cluster
To start the cluster run `make start`.
If the cluster does not exist it will be created first, and then started.

*Note: cluster is 'never' stopped. Rebooting will start the cluster automatically.
Only if you explicitly stop the cluster reboot will not start the cluster.*

### Stop the cluster
To stop the cluster run `make stop`.
All Kubernetes manifests applied against cluster will remain in the cluster but have no effect (nodes are only stopped, not destroyed).
If the cluster does not exist `k3d` will show some errors but no action has to be done nor any side effects occur.

### Destroy the cluster
To fully destroy the cluster run `make destroy`.
This will stop all the nodes (Docker containers) and remove them.
Kubernetes manifests will be deleted and re-creating the cluster means all the manifests have to be re-applied.