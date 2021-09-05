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
  curl -s -L "https://github.com/weaveworks/eksctl/releases/download/0.62.0/eksctl_$(uname)_amd64.tar.gz" | sudo tar xz -C /usr/local/bin/
fi
```

Install [AWS CLI](https://aws.amazon.com/cli/) binary:

```bash
if ! command -v aws &> /dev/null; then
  curl -sL "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip"
  unzip -q -o /tmp/awscliv2.zip -d /tmp/
  sudo /tmp/aws/install
fi
```

Set necessary variables and verify if all the necessary variables were set:

```bash
export BASE_DOMAIN=${BASE_DOMAIN:-k8s.mylabs.dev}
export CLUSTER_NAME=${CLUSTER_NAME:-kube2}
export CLUSTER_FQDN="${CLUSTER_NAME}.${BASE_DOMAIN}"
export AWS_DEFAULT_REGION="eu-west-1"
export GITHUB_USER="ruzickap"
export GITHUB_FLUX_REPOSITORY="k8s-eks-flux-${CLUSTER_NAME}-repo"

: "${AWS_ACCESS_KEY_ID?}"
: "${AWS_SECRET_ACCESS_KEY?}"
: "${GITHUB_TOKEN?}"
```

Remove CloudFormation stacks:

```bash
aws cloudformation delete-stack --stack-name "${CLUSTER_NAME}-route53-efs"
```

Remove EKS cluster:

```bash
if eksctl get cluster --name=${CLUSTER_NAME} 2>/dev/null ; then
  eksctl delete cluster --name=${CLUSTER_NAME}
fi
```

Remove GitHub repository created for Flux:

```bash
if ! curl -s -H "Authorization: token ${GITHUB_TOKEN}" "https://api.github.com/repos/${GITHUB_USER}/${GITHUB_FLUX_REPOSITORY}" | grep -q '"message": "Not Found"' ; then
  curl -s -H "Authorization: token ${GITHUB_TOKEN}" -X DELETE "https://api.github.com/repos/${GITHUB_USER}/${GITHUB_FLUX_REPOSITORY}"
fi
```

Delete CloudFormation stack which created VPC, Subnets, Route53:

```bash
aws cloudformation delete-stack --stack-name "${CLUSTER_NAME}-amazon-eks-vpc-private-subnets-kms"
aws cloudformation wait stack-delete-complete --stack-name "${CLUSTER_NAME}-amazon-eks-vpc-private-subnets-kms"
```

Remove `tmp/${CLUSTER_FQDN}` directory:

```bash
rm -rf "tmp/${CLUSTER_FQDN}"
```

Clean-up completed:

```bash
echo "Cleanup completed..."
```
