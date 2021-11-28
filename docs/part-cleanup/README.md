# Clean-up

![Clean-up](https://raw.githubusercontent.com/aws-samples/eks-workshop/65b766c494a5b4f5420b2912d8373c4957163541/static/images/cleanup.svg?sanitize=true
"Clean-up")

Install necessary software:

```bash
if command -v apt-get &> /dev/null; then
  apt update -qq
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq curl jq sudo unzip > /dev/null
fi
```

Install [eksctl](https://eksctl.io/):

```bash
if ! command -v eksctl &> /dev/null; then
  curl -s -L "https://github.com/weaveworks/eksctl/releases/download/v0.71.0/eksctl_$(uname)_amd64.tar.gz" | sudo tar xz -C /usr/local/bin/
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
  sudo curl -s -Lo /usr/local/bin/kubectl "https://storage.googleapis.com/kubernetes-release/release/v1.21.5/bin/$(uname | sed "s/./\L&/g" )/amd64/kubectl"
  sudo chmod a+x /usr/local/bin/kubectl
fi
```

Install [flux](https://toolkit.fluxcd.io/):

```bash
if ! command -v flux &> /dev/null; then
  curl -s https://fluxcd.io/install.sh | sudo bash
fi
```

Set necessary variables and verify if all the necessary variables were set:

```bash
export BASE_DOMAIN=${BASE_DOMAIN:-k8s.mylabs.dev}
export CLUSTER_NAME=${CLUSTER_NAME:-kube1}
export CLUSTER_FQDN="${CLUSTER_NAME}.${BASE_DOMAIN}"
export AWS_DEFAULT_REGION="eu-central-1"
export AWS_PAGER=""
export GITHUB_USER="ruzickap"
export GITHUB_FLUX_REPOSITORY="k8s-eks-flux-repo"
export KUBECONFIG=/tmp/kubeconfig-${CLUSTER_NAME}.conf

: "${AWS_ACCESS_KEY_ID?}"
: "${AWS_DEFAULT_REGION?}"
: "${AWS_SECRET_ACCESS_KEY?}"
: "${BASE_DOMAIN?}"
: "${CLUSTER_FQDN?}"
: "${CLUSTER_NAME?}"
: "${GITHUB_FLUX_REPOSITORY?}"
: "${GITHUB_TOKEN?}"
: "${GITHUB_USER?}"
```

Remove EKS cluster and created components:

```bash
if eksctl get cluster --name="${CLUSTER_NAME}" 2>/dev/null ; then
  eksctl utils write-kubeconfig --cluster="${CLUSTER_NAME}" --kubeconfig "${KUBECONFIG}"
  flux suspend source git -n flux-system --all || true
  kubectl delete secrets.secretsmanager.aws.crossplane.io --timeout=1m -n crossplane-system --wait=true --all || true
  eksctl delete cluster --name="${CLUSTER_NAME}" --force
fi
```

Remove GitHub repository created for Flux:

```bash
if ! curl -s -H "Authorization: token ${GITHUB_TOKEN}" "https://api.github.com/repos/${GITHUB_USER}/${GITHUB_FLUX_REPOSITORY}" | grep -q '"message": "Not Found"' ; then
  curl -s -H "Authorization: token ${GITHUB_TOKEN}" -X DELETE "https://api.github.com/repos/${GITHUB_USER}/${GITHUB_FLUX_REPOSITORY}"
fi
```

Remove Route 53 DNS records from DNS Zone:

```bash
CLUSTER_FQDN_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name==\`${CLUSTER_FQDN}.\`].Id" --output text)
if [[ -n "${CLUSTER_FQDN_ZONE_ID}" ]]; then
  aws route53 list-resource-record-sets --hosted-zone-id "${CLUSTER_FQDN_ZONE_ID}" | jq -c '.ResourceRecordSets[] | select (.Type != "SOA" and .Type != "NS")' |
  while read -r RESOURCERECORDSET; do
    aws route53 change-resource-record-sets \
      --hosted-zone-id "${CLUSTER_FQDN_ZONE_ID}" \
      --change-batch '{"Changes":[{"Action":"DELETE","ResourceRecordSet": '"${RESOURCERECORDSET}"' }]}' \
      --output text --query 'ChangeInfo.Id'
  done
fi
```

Remove CloudFormation stacks:

```bash
aws cloudformation delete-stack --stack-name "${CLUSTER_NAME}-route53"
```

Remove Volumes and Snapshots related to the cluster:

```bash
VOLUMES=$(aws ec2 describe-volumes --filter "Name=tag:Cluster,Values=${CLUSTER_FQDN}" --query 'Volumes[].VolumeId' --output text) && \
for VOLUME in ${VOLUMES}; do
  echo "Removing Volume: ${VOLUME}"
  aws ec2 delete-volume --volume-id "${VOLUME}"
done

SNAPSHOTS=$(aws ec2 describe-snapshots --filter "Name=tag:Cluster,Values=${CLUSTER_FQDN}" --query 'Snapshots[].SnapshotId' --output text) && \
for SNAPSHOT in ${SNAPSHOTS}; do
  echo "Removing Snapshot: ${SNAPSHOT}"
  aws ec2 delete-snapshot --snapshot-id "${SNAPSHOT}"
done
```

Delete entries in Amazon Secret Manager if not done correctly before:

```bash
aws secretsmanager delete-secret --secret-id "cp-aws-asm-secret-eks-${CLUSTER_NAME}-key" --force-delete-without-recovery
```

Remove orphan ELBs (if exists):

```bash
for ELB_ARN in $(aws elbv2 describe-load-balancers --query "LoadBalancers[].LoadBalancerArn" --output=text) ; do
  if [[ -n "$(aws elbv2 describe-tags --resource-arns "${ELB_ARN}" --query "TagDescriptions[].Tags[?Key == \`kubernetes.io/cluster/${CLUSTER_NAME}\`]" --output text)" ]]; then
    echo "Deleting ELB: ${ELB_ARN}"
    aws elbv2 delete-load-balancer --load-balancer-arn "${ELB_ARN}"
  fi
done
```

Delete CloudFormation stack which created VPC, Subnets, Route53, EKS, ...:

```bash
aws cloudformation delete-stack --stack-name "${CLUSTER_NAME}-amazon-eks-vpc-private-subnets-kms"
aws cloudformation wait stack-delete-complete --stack-name "${CLUSTER_NAME}-amazon-eks-vpc-private-subnets-kms"
aws cloudformation wait stack-delete-complete --stack-name "eksctl-${CLUSTER_NAME}-cluster"
```

Remove `tmp/${CLUSTER_FQDN}` directory:

```bash
rm -rf "tmp/${CLUSTER_FQDN}"
```

Clean-up completed:

```bash
echo "Cleanup completed..."
```
