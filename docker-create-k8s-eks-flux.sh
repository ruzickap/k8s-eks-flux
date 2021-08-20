#!/usr/bin/env bash

set -euxo pipefail

docker run -it --rm \
  -e CLUSTER_NAME="kube3" \
  -e AWS_ACCESS_KEY_ID \
  -e AWS_SECRET_ACCESS_KEY \
  -e GITHUB_TOKEN \
  -v "${PWD}:/mnt" \
  -w /mnt \
  ubuntu \
  bash -eu -c " \
    ./create-k8s-eks-flux.sh ;\
  "