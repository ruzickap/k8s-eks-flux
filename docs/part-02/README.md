# Create additional AWS structure

[[toc]]

## Create EFS, Route53

Create CloudFormation template containing policies for Route53, S3 access
(Harbor, Velero) and Domain.

Put new domain `CLUSTER_FQDN` to the Route 53 and configure the DNS delegation
from the `BASE_DOMAIN`.

Create EFS which will be used by Amazon EKS cluster, Route53 entries:

```bash
cat > "tmp/${CLUSTER_FQDN}/cf-route53-efs.yml" << \EOF
AWSTemplateFormatVersion: 2010-09-09
Description: Route53 entries ; EFS, mount points and security groups for EKS

Parameters:

  BaseDomain:
    Description: "Base domain where cluster domains + their subdomains will live. Ex: k8s.mylabs.dev"
    Type: String

  ClusterName:
    Description: "K8s Cluster name. Ex: kube1"
    Type: String

  ClusterFQDN:
    Description: "Cluster domain where all necessary app subdomains will live (subdomain of BaseDomain). Ex: kube1.k8s.mylabs.dev"
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

  MountTargetSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      VpcId:
        Fn::ImportValue:
          Fn::Sub: "${ClusterName}-amazon-eks-vpc-private-subnets-kms-VpcId"
      GroupName: !Sub "${ClusterName}-efs-sg"
      GroupDescription: Security group for mount target
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 2049
          ToPort: 2049
          CidrIp:
            Fn::ImportValue:
              Fn::Sub: "${ClusterName}-amazon-eks-vpc-private-subnets-kms-VpcCidrBlock"
      Tags:
        - Key: Name
          Value: !Sub "${ClusterName}-efs-sg"

  FileSystemDrupal:
    Type: AWS::EFS::FileSystem
    DeletionPolicy: Delete
    UpdateReplacePolicy: Retain
    Properties:
      Encrypted: true
      FileSystemTags:
      - Key: Name
        Value: !Sub "${ClusterName}-efs-drupal"
      KmsKeyId:
        Fn::ImportValue:
          Fn::Sub: "${ClusterName}-amazon-eks-vpc-private-subnets-kms-KMSKeyId"

  MountTargetAZ1:
    Type: AWS::EFS::MountTarget
    Properties:
      FileSystemId:
        Ref: FileSystemDrupal
      SubnetId:
        Fn::Select:
        - 0
        - Fn::Split:
          - ","
          - Fn::ImportValue: !Sub "${ClusterName}-amazon-eks-vpc-private-subnets-kms-SubnetsIdsPrivate"
      SecurityGroups:
      - Ref: MountTargetSecurityGroup

  MountTargetAZ2:
    Type: AWS::EFS::MountTarget
    Properties:
      FileSystemId:
        Ref: FileSystemDrupal
      SubnetId:
        Fn::Select:
        - 1
        - Fn::Split:
          - ","
          - Fn::ImportValue: !Sub "${ClusterName}-amazon-eks-vpc-private-subnets-kms-SubnetsIdsPrivate"
      SecurityGroups:
      - Ref: MountTargetSecurityGroup

  AccessPointDrupal1:
    Type: AWS::EFS::AccessPoint
    Properties:
      FileSystemId: !Ref FileSystemDrupal
      # Set proper uid/gid: https://github.com/bitnami/bitnami-docker-drupal/blob/02f7e41c88eee96feb90c8b7845ee7aeb5927c38/9/debian-10/Dockerfile#L49
      PosixUser:
        Uid: "1001"
        Gid: "1001"
      RootDirectory:
        CreationInfo:
          OwnerGid: "1001"
          OwnerUid: "1001"
          Permissions: "700"
        Path: "/drupal1"
      AccessPointTags:
        - Key: Name
          Value: !Sub "${ClusterName}-drupal1-ap"

  AccessPointDrupal2:
    Type: AWS::EFS::AccessPoint
    Properties:
      FileSystemId: !Ref FileSystemDrupal
      # Set proper uid/gid: https://github.com/bitnami/bitnami-docker-drupal/blob/02f7e41c88eee96feb90c8b7845ee7aeb5927c38/9/debian-10/Dockerfile#L49
      PosixUser:
        Uid: "1001"
        Gid: "1001"
      RootDirectory:
        CreationInfo:
          OwnerGid: "1001"
          OwnerUid: "1001"
          Permissions: "700"
        Path: "/drupal2"
      AccessPointTags:
        - Key: Name
          Value: !Sub "${ClusterName}-drupal2-ap"

  FileSystemMyuser1:
    Type: AWS::EFS::FileSystem
    DeletionPolicy: Delete
    UpdateReplacePolicy: Retain
    Properties:
      Encrypted: true
      FileSystemTags:
      - Key: Name
        Value: !Sub "${ClusterName}-myuser1"
      KmsKeyId:
        Fn::ImportValue:
          Fn::Sub: "${ClusterName}-amazon-eks-vpc-private-subnets-kms-KMSKeyId"

  MountTargetAZ1Myuser1:
    Type: AWS::EFS::MountTarget
    Properties:
      FileSystemId:
        Ref: FileSystemMyuser1
      SubnetId:
        Fn::Select:
        - 0
        - Fn::Split:
          - ","
          - Fn::ImportValue: !Sub "${ClusterName}-amazon-eks-vpc-private-subnets-kms-SubnetsIdsPrivate"
      SecurityGroups:
      - Ref: MountTargetSecurityGroup

  MountTargetAZ2Myuser1:
    Type: AWS::EFS::MountTarget
    Properties:
      FileSystemId:
        Ref: FileSystemMyuser1
      SubnetId:
        Fn::Select:
        - 1
        - Fn::Split:
          - ","
          - Fn::ImportValue: !Sub "${ClusterName}-amazon-eks-vpc-private-subnets-kms-SubnetsIdsPrivate"
      SecurityGroups:
      - Ref: MountTargetSecurityGroup

  AccessPointMyuser1:
    Type: AWS::EFS::AccessPoint
    Properties:
      FileSystemId: !Ref FileSystemMyuser1
      # Set proper uid/gid: https://github.com/bitnami/bitnami-docker-drupal/blob/02f7e41c88eee96feb90c8b7845ee7aeb5927c38/9/debian-10/Dockerfile#L49
      RootDirectory:
        CreationInfo:
          OwnerGid: "1000"
          OwnerUid: "1000"
          Permissions: "700"
        Path: "/myuser1"
      AccessPointTags:
        - Key: Name
          Value: !Sub "${ClusterName}-myuser1"

  FileSystemMyuser2:
    Type: AWS::EFS::FileSystem
    DeletionPolicy: Delete
    UpdateReplacePolicy: Retain
    Properties:
      Encrypted: true
      FileSystemTags:
      - Key: Name
        Value: !Sub "${ClusterName}-myuser2"
      KmsKeyId:
        Fn::ImportValue:
          Fn::Sub: "${ClusterName}-amazon-eks-vpc-private-subnets-kms-KMSKeyId"

  MountTargetAZ1Myuser2:
    Type: AWS::EFS::MountTarget
    Properties:
      FileSystemId:
        Ref: FileSystemMyuser2
      SubnetId:
        Fn::Select:
        - 0
        - Fn::Split:
          - ","
          - Fn::ImportValue: !Sub "${ClusterName}-amazon-eks-vpc-private-subnets-kms-SubnetsIdsPrivate"
      SecurityGroups:
      - Ref: MountTargetSecurityGroup

  MountTargetAZ2Myuser2:
    Type: AWS::EFS::MountTarget
    Properties:
      FileSystemId:
        Ref: FileSystemMyuser2
      SubnetId:
        Fn::Select:
        - 1
        - Fn::Split:
          - ","
          - Fn::ImportValue: !Sub "${ClusterName}-amazon-eks-vpc-private-subnets-kms-SubnetsIdsPrivate"
      SecurityGroups:
      - Ref: MountTargetSecurityGroup

  AccessPointMyuser2:
    Type: AWS::EFS::AccessPoint
    Properties:
      FileSystemId: !Ref FileSystemMyuser2
      # Set proper uid/gid: https://github.com/bitnami/bitnami-docker-drupal/blob/02f7e41c88eee96feb90c8b7845ee7aeb5927c38/9/debian-10/Dockerfile#L49
      RootDirectory:
        CreationInfo:
          OwnerGid: "1000"
          OwnerUid: "1000"
          Permissions: "700"
        Path: "/myuser2"
      AccessPointTags:
        - Key: Name
          Value: !Sub "${ClusterName}-myuser2"

Outputs:

  FileSystemIdDrupal:
    Description: Id of Elastic File System
    Value:
      Ref: FileSystemDrupal

  AccessPointIdDrupal1:
    Description: EFS AccessPoint ID for Drupal1
    Value:
      Ref: AccessPointDrupal1

  AccessPointIdDrupal2:
    Description: EFS AccessPoint2 ID for Drupal2
    Value:
      Ref: AccessPointDrupal2

  FileSystemIdMyuser1:
    Description: Id of Elastic File System Myuser1
    Value:
      Ref: FileSystemMyuser1

  AccessPointIdMyuser1:
    Description: EFS AccessPoint2 ID for Myuser1
    Value:
      Ref: AccessPointMyuser1

  FileSystemIdMyuser2:
    Description: ID of Elastic File System Myuser2
    Value:
      Ref: FileSystemMyuser2

  AccessPointIdMyuser2:
    Description: EFS AccessPoint2 ID for Myuser2
    Value:
      Ref: AccessPointMyuser2
EOF

if ! aws cloudformation describe-stacks --stack-name "${CLUSTER_NAME}-route53-efs" ; then
  CLOUDFORMATION_ACTION='create-stack'
else
  CLOUDFORMATION_ACTION='update-stack'
fi

# shellcheck disable=SC2001
eval aws cloudformation "${CLOUDFORMATION_ACTION}" \
  --parameters "ParameterKey=BaseDomain,ParameterValue=${BASE_DOMAIN} ParameterKey=ClusterName,ParameterValue=${CLUSTER_NAME} ParameterKey=ClusterFQDN,ParameterValue=${CLUSTER_FQDN}" \
  --stack-name "${CLUSTER_NAME}-route53-efs" \
  --template-body "file://tmp/${CLUSTER_FQDN}/cf-route53-efs.yml" \
  --tags "$(echo "${TAGS}" | sed  -e 's/\([^ =]*\)=\([^ ]*\)/Key=\1,Value=\2/g')" || true
```

## Create Amazon EKS

![EKS](https://raw.githubusercontent.com/aws-samples/eks-workshop/65b766c494a5b4f5420b2912d8373c4957163541/static/images/3-service-animated.gif
"EKS")

Create [Amazon EKS](https://aws.amazon.com/eks/) in AWS by using [eksctl](https://eksctl.io/).

![eksctl](https://raw.githubusercontent.com/weaveworks/eksctl/c365149fc1a0b8d357139cbd6cda5aee8841c16c/logo/eksctl.png
"eksctl")

Create the Amazon EKS cluster with Calico using `eksctl`:

```bash
cat > "tmp/${CLUSTER_FQDN}/eksctl.yaml" << EOF
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
        name: aws-load-balancer-controller-sa
        namespace: kube-system
      wellKnownPolicies:
        awsLoadBalancerController: true
    - metadata:
        name: cert-manager
        namespace: cert-manager
      wellKnownPolicies:
        certManager: true
    - metadata:
        name: ebs-csi-controller-sa
        namespace: kube-system
      wellKnownPolicies:
        ebsCSIController: true
    - metadata:
        name: efs-csi-controller-sa
        namespace: kube-system
      wellKnownPolicies:
        efsCSIController: true
    - metadata:
        name: grafana
        namespace: kube-prometheus-stack
      attachPolicyARNs:
        - arn:aws:iam::aws:policy/AmazonPrometheusQueryAccess
        - arn:aws:iam::aws:policy/CloudWatchReadOnlyAccess
      attachPolicy:
        Version: 2012-10-17
        Statement:
        - Sid: AllowReadingTagsInstancesRegionsFromEC2
          Effect: Allow
          Action:
          - ec2:DescribeTags
          - ec2:DescribeInstances
          - ec2:DescribeRegions
          Resource: "*"
        - Sid: AllowReadingResourcesForTags
          Effect: Allow
          Action: tag:GetResources
          Resource: "*"
    - metadata:
        name: kube-prometheus-stack-prometheus
        namespace: kube-prometheus-stack
      attachPolicyARNs:
        - arn:aws:iam::aws:policy/AmazonPrometheusQueryAccess
        - arn:aws:iam::aws:policy/AmazonPrometheusRemoteWriteAccess
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
    instancePrefix: ${GITHUB_USER}
    desiredCapacity: 2
    minSize: 2
    maxSize: 5
    volumeSize: 30
    tags: *tags
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
      branch: "master"
      path: "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}"
EOF

if ! eksctl get clusters --name="${CLUSTER_NAME}" &> /dev/null ; then
  eksctl create cluster --config-file "tmp/${CLUSTER_FQDN}/eksctl.yaml" --kubeconfig "${KUBECONFIG}"
else
  eksctl utils write-kubeconfig --cluster="${CLUSTER_NAME}"
fi
```

Add add the user or role to the aws-auth ConfigMap. This is handy if you are
using different user for CLI operations and different user/role for accessing
the AWS Console to see EKS Workloads in Cluster's tab.

```bash
if ! eksctl get iamidentitymapping --cluster="${CLUSTER_NAME}" --arn="${AWS_CONSOLE_ADMIN_ROLE_ARN}" &> /dev/null && [[ -n ${AWS_CONSOLE_ADMIN_ROLE_ARN+x} ]] ; then
  eksctl create iamidentitymapping --cluster="${CLUSTER_NAME}" --arn="${AWS_CONSOLE_ADMIN_ROLE_ARN}" --group system:masters --username admin
fi

if ! eksctl get iamidentitymapping --cluster="${CLUSTER_NAME}" --arn="${AWS_USER_ROLE_ARN}" &> /dev/null && [[ -n ${AWS_USER_ROLE_ARN+x} ]] ; then
  eksctl create iamidentitymapping --cluster="${CLUSTER_NAME}" --arn="${AWS_USER_ROLE_ARN}" --group system:masters --username admin
fi
```

## Post installation tasks

Change TTL=60 of SOA + NS records for new domain
(it can not be done in CloudFormation):

```bash
aws cloudformation wait stack-create-complete --stack-name "${CLUSTER_NAME}-route53-efs"
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name==\`${CLUSTER_FQDN}.\`].Id" --output text)
RESOURCE_RECORD_SET_SOA=$(aws route53 --output json list-resource-record-sets --hosted-zone-id "${HOSTED_ZONE_ID}" --query "(ResourceRecordSets[?Type == \`SOA\`])[0]" | sed "s/\"TTL\":.*/\"TTL\": 60,/")
RESOURCE_RECORD_SET_NS=$(aws route53 --output json list-resource-record-sets --hosted-zone-id "${HOSTED_ZONE_ID}" --query "(ResourceRecordSets[?Type == \`NS\`])[0]" | sed "s/\"TTL\":.*/\"TTL\": 60,/")
cat << EOF | aws route53 --output json change-resource-record-sets --hosted-zone-id "${HOSTED_ZONE_ID}" --change-batch=file:///dev/stdin
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
```

Get the variables form CloudFormation:

```bash
aws cloudformation describe-stacks --stack-name "${CLUSTER_NAME}-route53-efs" > "tmp/${CLUSTER_FQDN}/${CLUSTER_NAME}-route53-efs.json"
AWS_EFS_FS_ID_DRUPAL=$(jq -r ".Stacks[0].Outputs[] | select(.OutputKey==\"FileSystemIdDrupal\") .OutputValue" "tmp/${CLUSTER_FQDN}/${CLUSTER_NAME}-route53-efs.json")
# AWS_EFS_AP_ID_DRUPAL1=$(jq -r ".Stacks[0].Outputs[] | select(.OutputKey==\"AccessPointIdDrupal1\") .OutputValue" "tmp/${CLUSTER_FQDN}/${CLUSTER_NAME}-route53-efs.json")
# AWS_EFS_AP_ID_DRUPAL2=$(jq -r ".Stacks[0].Outputs[] | select(.OutputKey==\"AccessPointIdDrupal2\") .OutputValue" "tmp/${CLUSTER_FQDN}/${CLUSTER_NAME}-route53-efs.json")
AWS_EFS_FS_ID_MYUSER1=$(jq -r ".Stacks[0].Outputs[] | select(.OutputKey==\"FileSystemIdMyuser1\") .OutputValue" "tmp/${CLUSTER_FQDN}/${CLUSTER_NAME}-route53-efs.json")
AWS_EFS_AP_ID_MYUSER1=$(jq -r ".Stacks[0].Outputs[] | select(.OutputKey==\"AccessPointIdMyuser1\") .OutputValue" "tmp/${CLUSTER_FQDN}/${CLUSTER_NAME}-route53-efs.json")
AWS_EFS_FS_ID_MYUSER2=$(jq -r ".Stacks[0].Outputs[] | select(.OutputKey==\"FileSystemIdMyuser2\") .OutputValue" "tmp/${CLUSTER_FQDN}/${CLUSTER_NAME}-route53-efs.json")
AWS_EFS_AP_ID_MYUSER2=$(jq -r ".Stacks[0].Outputs[] | select(.OutputKey==\"AccessPointIdMyuser2\") .OutputValue" "tmp/${CLUSTER_FQDN}/${CLUSTER_NAME}-route53-efs.json")
```
