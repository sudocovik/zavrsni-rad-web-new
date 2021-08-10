#!/bin/bash
set -e

CLUSTER_NAME="final-thesis"

function start_cluster() {
  CLUSTER_EXISTS=0
  [[ "$(k3d cluster list)" =~ $CLUSTER_NAME ]] && CLUSTER_EXISTS=1

  if [ "$CLUSTER_EXISTS" == "0" ]; then
    echo "Creating cluster..."
    k3d cluster create "${CLUSTER_NAME}" -c configuration.yml
  else
    k3d cluster start "${CLUSTER_NAME}"
  fi
}

function stop_cluster() {
    k3d cluster stop "${CLUSTER_NAME}"
}

function destroy_cluster() {
    k3d cluster delete "${CLUSTER_NAME}"
}

COMMAND=${BASH_ARGV[0]}
if [ "$COMMAND" == 'start' ]; then
  start_cluster
elif [ "$COMMAND" == 'stop' ]; then
  stop_cluster
elif [ "$COMMAND" == 'destroy' ]; then
  destroy_cluster
fi