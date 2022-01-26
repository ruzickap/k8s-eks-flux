#!/usr/bin/env bash

if [ -n "${GH_TOKEN_K8S_EKS+x}" ]; then
  export GITHUB_TOKEN="${GH_TOKEN_K8S_EKS}"
fi

set -euxo pipefail

docker run -it --rm \
  -e AWS_ACCESS_KEY_ID \
  -e AWS_SECRET_ACCESS_KEY \
  -e AWS_SESSION_TOKEN \
  -e CLUSTER_NAME="kube2" \
  -e GITHUB_TOKEN \
  -e MY_COOKIE_SECRET \
  -e MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID_KUBE1 \
  -e MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID_KUBE2 \
  -e MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET_KUBE1 \
  -e MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET_KUBE2 \
  -e MY_GITHUB_WEBHOOK_TOKEN \
  -e MY_PASSWORD \
  -e OKTA_CLIENT_ID \
  -e OKTA_CLIENT_SECRET \
  -e OKTA_ISSUER \
  -e SLACK_INCOMING_WEBHOOK_URL \
  -v "${PWD}:/mnt" \
  -w /mnt \
  ubuntu ./create-k8s-eks-flux.sh
