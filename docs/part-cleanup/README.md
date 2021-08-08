# Clean-up

![Clean-up](https://raw.githubusercontent.com/aws-samples/eks-workshop/65b766c494a5b4f5420b2912d8373c4957163541/static/images/cleanup.svg?sanitize=true
"Clean-up")

Install necessary software:

```bash
if command -v apt-get &> /dev/null; then
  apt update -qq
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq less curl gnupg2 jq python3 sudo unzip > /dev/null
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

Install [kubectl](https://github.com/kubernetes/kubectl) binary:

```bash
if ! command -v kubectl &> /dev/null; then
  sudo curl -s -Lo /usr/local/bin/kubectl "https://storage.googleapis.com/kubernetes-release/release/v1.21.1/bin/$(uname | sed "s/./\L&/g" )/amd64/kubectl"
  sudo chmod a+x /usr/local/bin/kubectl
fi
```

Install [AWS IAM Authenticator for Kubernetes](https://github.com/kubernetes-sigs/aws-iam-authenticator):

```bash
if ! command -v aws-iam-authenticator &> /dev/null; then
  sudo curl -s -Lo /usr/local/bin/aws-iam-authenticator "https://amazon-eks.s3.us-west-2.amazonaws.com/1.19.6/2021-01-05/bin/$(uname | sed "s/./\L&/g")/amd64/aws-iam-authenticator"
  sudo chmod a+x /usr/local/bin/aws-iam-authenticator
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
export CLUSTER_NAME=${CLUSTER_NAME:-kube1}
export CLUSTER_FQDN="${CLUSTER_NAME}.${BASE_DOMAIN}"
export AWS_DEFAULT_REGION="eu-west-1"
```

Remove CloudFormation stacks:

```bash
aws cloudformation delete-stack --stack-name "${CLUSTER_NAME}-efs"
aws cloudformation wait stack-delete-complete --stack-name "${CLUSTER_NAME}-efs"
```

Delete CloudFormation stack which created VPC, Subnets, Route53:

```bash
aws cloudformation delete-stack --stack-name "${CLUSTER_NAME}-amazon-eks-vpc-private-subnets-route53"
aws cloudformation wait stack-delete-complete --stack-name "${CLUSTER_NAME}-amazon-eks-vpc-private-subnets-route53"
```

Remove `tmp/${CLUSTER_NAME}` directory:

```bash
rm -rf "tmp/${CLUSTER_NAME}"
```

Clean-up completed:

```bash
echo "Cleanup completed..."
```
