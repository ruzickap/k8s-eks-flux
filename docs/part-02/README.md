# Create additional AWS structure

[[toc]]

## Create Route53

Create CloudFormation template containing policies for Route53, S3 access
(Harbor, Velero) and Domain.

Put new domain `CLUSTER_FQDN` to the Route 53 and configure the DNS delegation
from the `BASE_DOMAIN`.

Create Route53 zone:

```bash
cat > "tmp/${CLUSTER_FQDN}/cf-route53.yml" << \EOF
AWSTemplateFormatVersion: 2010-09-09
Description: Route53 entries

Parameters:

  BaseDomain:
    Description: "Base domain where cluster domains + their subdomains will live. Ex: k8s.mylabs.dev"
    Type: String

  ClusterFQDN:
    Description: "Cluster FQDN. (domain for all applications) Ex: kube1.k8s.mylabs.dev"
    Type: String

Resources:

  HostedZone:
    Type: AWS::Route53::HostedZone
    Properties:
      Name: !Ref ClusterFQDN

  RecordSet:
    Type: AWS::Route53::RecordSet
    Properties:
      HostedZoneName: !Sub "${BaseDomain}."
      Name: !Ref ClusterFQDN
      Type: NS
      TTL: 60
      ResourceRecords: !GetAtt HostedZone.NameServers

  S3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      AccessControl: Private
      BucketName: !Sub "${ClusterFQDN}"
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
EOF

if [[ $(aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE --query "StackSummaries[?starts_with(StackName, \`${CLUSTER_NAME}-route53\`) == \`true\`].StackName" --output text) == "" ]]; then
  # shellcheck disable=SC2001
  eval aws cloudformation "create-stack" \
    --parameters "ParameterKey=BaseDomain,ParameterValue=${BASE_DOMAIN} ParameterKey=ClusterFQDN,ParameterValue=${CLUSTER_FQDN}" \
    --stack-name "${CLUSTER_NAME}-route53" \
    --template-body "file://tmp/${CLUSTER_FQDN}/cf-route53.yml" \
    --tags "$(echo "${TAGS}" | sed -e 's/\([^ =]*\)=\([^ ]*\)/Key=\1,Value=\2/g')" || true
fi
```

## Create Amazon EKS

![EKS](https://raw.githubusercontent.com/aws-samples/eks-workshop/65b766c494a5b4f5420b2912d8373c4957163541/static/images/3-service-animated.gif
"EKS")

Create [Amazon EKS](https://aws.amazon.com/eks/) in AWS by using [eksctl](https://eksctl.io/).

![eksctl](https://raw.githubusercontent.com/weaveworks/eksctl/c365149fc1a0b8d357139cbd6cda5aee8841c16c/logo/eksctl.png
"eksctl")

Create the Amazon EKS cluster with Calico using `eksctl`:

```bash
cat > "tmp/${CLUSTER_FQDN}/eksctl-${CLUSTER_NAME}.yaml" << EOF
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: ${CLUSTER_NAME}
  region: ${AWS_DEFAULT_REGION}
  version: "1.21"
  tags: &tags
$(echo "${TAGS}" | sed "s/ /\\n    /g; s/^/    /g; s/=/: /g")
iam:
  withOIDC: true
  serviceAccounts:
    - metadata:
        name: aws-load-balancer-controller
        namespace: aws-load-balancer
      wellKnownPolicies:
        awsLoadBalancerController: true
    - metadata:
        name: cert-manager
        namespace: cert-manager
      wellKnownPolicies:
        certManager: true
    - metadata:
        name: cluster-autoscaler
        namespace: cluster-autoscaler
      wellKnownPolicies:
        autoScaler: true
    - metadata:
        name: external-dns
        namespace: external-dns
      wellKnownPolicies:
        externalDNS: true
    - metadata:
        name: ebs-csi-controller-sa
        namespace: aws-ebs-csi-driver
      wellKnownPolicies:
        ebsCSIController: true
    - metadata:
        name: efs-csi-controller-sa
        namespace: aws-efs-csi-driver
      wellKnownPolicies:
        efsCSIController: true
    - metadata:
        name: kustomize-controller
        namespace: flux-system
      attachPolicy:
        Version: 2012-10-17
        Statement:
        - Sid: FluxKMS
          Effect: Allow
          Action:
            - kms:Encrypt
            - kms:Decrypt
            - kms:ReEncrypt*
            - kms:GenerateDataKey*
            - kms:DescribeKey
          Resource:
          - ${AWS_KMS_KEY_ARN}
    - metadata:
        name: kuard-sa
        namespace: kuard
      attachPolicy:
        Version: 2012-10-17
        Statement:
        - Sid: AllowSecretManagerAccess
          Effect: Allow
          Action:
          - secretsmanager:GetSecretValue
          Resource:
          - arn:*:secretsmanager:*:*:secret:*
        - Sid: AllowKMSAccess
          Effect: Allow
          Action:
          - kms:Decrypt
          Resource:
          - ${AWS_KMS_KEY_ARN}
          Condition:
            StringLike:
              kms:ViaService:
                - secretsmanager.*.amazonaws.com
    - metadata:
        name: velero
        namespace: velero
      attachPolicy:
        Version: 2012-10-17
        Statement:
        - Effect: Allow
          Action:
          - s3:ListBucket
          Resource:
          - arn:aws:s3:::${CLUSTER_FQDN}
        - Effect: Allow
          Action:
          - s3:PutObject
          - s3:GetObject
          - s3:DeleteObject
          - s3:ListMultipartUploadParts
          - s3:AbortMultipartUpload
          Resource:
          - arn:aws:s3:::${CLUSTER_FQDN}/*
vpc:
  id: "${AWS_VPC_ID}"
  subnets:
    private:
      ${AWS_DEFAULT_REGION}a:
          id: "${AWS_PRIVATESUBNETID1}"
      ${AWS_DEFAULT_REGION}b:
          id: "${AWS_PRIVATESUBNETID2}"
    public:
      ${AWS_DEFAULT_REGION}a:
          id: "${AWS_PUBLICSUBNETID1}"
      ${AWS_DEFAULT_REGION}b:
          id: "${AWS_PUBLICSUBNETID2}"
managedNodeGroups:
  - name: managed-ng-1
    amiFamily: Bottlerocket
    instanceType: t3.large
    desiredCapacity: 3
    minSize: 2
    maxSize: 5
    volumeSize: 30
    tags:
      <<: *tags
      compliance:na:defender: bottlerocket
    volumeEncrypted: true
    volumeKmsKeyID: ${AWS_KMS_KEY_ID}
    disableIMDSv1: true
secretsEncryption:
  keyARN: ${AWS_KMS_KEY_ARN}
gitops:
  flux:
    gitProvider: github
    flags:
      owner: "${GITHUB_USER}"
      repository: "${GITHUB_FLUX_REPOSITORY}"
      personal: "true"
      private: "false"
      branch: "main"
      path: "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}"
EOF

if [[ ! -s "${KUBECONFIG}" ]]; then
  if ! eksctl get clusters --name="${CLUSTER_NAME}" &> /dev/null; then
    eksctl create cluster --config-file "tmp/${CLUSTER_FQDN}/eksctl-${CLUSTER_NAME}.yaml" --kubeconfig "${KUBECONFIG}"
  else
    eksctl utils write-kubeconfig --cluster="${CLUSTER_NAME}" --kubeconfig "${KUBECONFIG}"
  fi
fi
```

Add add the user or role to the aws-auth ConfigMap. This is handy if you are
using different user for CLI operations and different user/role for accessing
the AWS Console to see EKS Workloads in Cluster's tab.

```bash
if [[ -n ${AWS_CONSOLE_ADMIN_ROLE_ARN+x} ]] && ! eksctl get iamidentitymapping --cluster="${CLUSTER_NAME}" --arn="${AWS_CONSOLE_ADMIN_ROLE_ARN}" &> /dev/null; then
  eksctl create iamidentitymapping --cluster="${CLUSTER_NAME}" --arn="${AWS_CONSOLE_ADMIN_ROLE_ARN}" --group system:masters --username admin
fi

if [[ -n ${AWS_USER_ROLE_ARN+x} ]] && ! eksctl get iamidentitymapping --cluster="${CLUSTER_NAME}" --arn="${AWS_USER_ROLE_ARN}" &> /dev/null; then
  eksctl create iamidentitymapping --cluster="${CLUSTER_NAME}" --arn="${AWS_USER_ROLE_ARN}" --group system:masters --username admin
fi
```

## Post installation tasks

Change TTL=60 of SOA + NS records for new domain
(it can not be done in CloudFormation):

```bash
if [[ ! -s "tmp/${CLUSTER_FQDN}/route53-hostedzone-ttl.yml" ]]; then
  aws cloudformation wait stack-create-complete --stack-name "${CLUSTER_NAME}-route53"
  HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name==\`${CLUSTER_FQDN}.\`].Id" --output text)
  RESOURCE_RECORD_SET_SOA=$(aws route53 --output json list-resource-record-sets --hosted-zone-id "${HOSTED_ZONE_ID}" --query "(ResourceRecordSets[?Type == \`SOA\`])[0]" | sed "s/\"TTL\":.*/\"TTL\": 60,/")
  RESOURCE_RECORD_SET_NS=$(aws route53 --output json list-resource-record-sets --hosted-zone-id "${HOSTED_ZONE_ID}" --query "(ResourceRecordSets[?Type == \`NS\`])[0]" | sed "s/\"TTL\":.*/\"TTL\": 60,/")
  cat << EOF | jq > "tmp/${CLUSTER_FQDN}/route53-hostedzone-ttl.yml"
{
    "Comment": "Update record to reflect new TTL for SOA and NS records",
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet":
${RESOURCE_RECORD_SET_SOA}
        },
        {
            "Action": "UPSERT",
            "ResourceRecordSet":
${RESOURCE_RECORD_SET_NS}
        }
    ]
}
EOF
  aws route53 change-resource-record-sets --output json --hosted-zone-id "${HOSTED_ZONE_ID}" --change-batch="file://tmp/${CLUSTER_FQDN}/route53-hostedzone-ttl.yml"
fi
```
