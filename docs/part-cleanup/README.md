# Clean-up

![Clean-up](https://raw.githubusercontent.com/aws-samples/eks-workshop/65b766c494a5b4f5420b2912d8373c4957163541/static/images/cleanup.svg?sanitize=true
"Clean-up")

Install necessary software:

```bash
if command -v apt-get &> /dev/null; then
  apt update -qq
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq curl sudo unzip > /dev/null
fi
```

Install [eksctl](https://eksctl.io/):

```bash
if ! command -v eksctl &> /dev/null; then
  curl -s -L "https://github.com/weaveworks/eksctl/releases/download/0.55.0/eksctl_$(uname)_amd64.tar.gz" | sudo tar xz -C /usr/local/bin/
fi
```

Set necessary variables:

```bash
export BASE_DOMAIN=${BASE_DOMAIN:-k8s.mylabs.dev}
export CLUSTER_NAME=${CLUSTER_NAME:-kube2}
export CLUSTER_FQDN="${CLUSTER_NAME}.${BASE_DOMAIN}"
export AWS_DEFAULT_REGION="eu-west-1"
export GITHUB_USER="ruzickap"
export GITHUB_FLUX_REPOSITORY="k8s-eks-flux-${CLUSTER_NAME}-repo"
```

Remove EKS cluster:

```bash
if eksctl get cluster --name=${CLUSTER_NAME} 2>/dev/null ; then
  eksctl delete cluster --wait --name=${CLUSTER_NAME}
fi
```

Remove GitHub repository created for Flux:

```bash
curl -H "Authorization: token ${GITHUB_TOKEN_K8S_EKS}" -X DELETE "https://api.github.com/repos/${GITHUB_USER}/${GITHUB_FLUX_REPOSITORY}"
```

Remove `tmp/${CLUSTER_NAME}` directory:

```bash
rm -rf "tmp/${CLUSTER_NAME}"
```

Clean-up completed:

```bash
echo "Cleanup completed..."
```
