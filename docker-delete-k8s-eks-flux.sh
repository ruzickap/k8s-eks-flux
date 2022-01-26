#!/usr/bin/env bash

if [ -n "${GH_TOKEN_K8S_EKS+x}" ]; then
  export GITHUB_TOKEN="${GH_TOKEN_K8S_EKS}"
fi

set -euxo pipefail

docker run -it --rm \
  -e CLUSTER_NAME="kube2" \
  -e AWS_ACCESS_KEY_ID \
  -e AWS_SECRET_ACCESS_KEY \
  -e AWS_SESSION_TOKEN \
  -e GITHUB_TOKEN="${GH_TOKEN_K8S_EKS}" \
  -v "${PWD}:/mnt" \
  -w /mnt \
  ubuntu \
  bash -euo pipefail -c " \
    ./delete-k8s-eks-flux.sh \;
  "
