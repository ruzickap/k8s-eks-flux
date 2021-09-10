#!/usr/bin/env bash

if [ -n "${GH_TOKEN_K8S_EKS+x}" ]; then
  export GITHUB_TOKEN="${GH_TOKEN_K8S_EKS}"
fi

set -euxo pipefail

docker run -it --rm \
  -e CLUSTER_NAME="kube2" \
  -e AWS_ACCESS_KEY_ID \
  -e AWS_SECRET_ACCESS_KEY \
  -e GITHUB_TOKEN \
  -e SLACK_INCOMING_WEBHOOK_URL \
  -e MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID_KUBE1 \
  -e MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET_KUBE1 \
  -e MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID_KUBE2 \
  -e MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET_KUBE2 \
  -e OKTA_ISSUER \
  -e OKTA_CLIENT_ID \
  -e OKTA_CLIENT_SECRET \
  -e MY_PASSWORD \
  -v "${PWD}:/mnt" \
  -w /mnt \
  ubuntu \
  bash -eu -c " \
    ./create-k8s-eks-flux.sh ;\
  "
