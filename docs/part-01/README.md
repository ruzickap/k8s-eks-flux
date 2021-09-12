# Create initial AWS structure

[[toc]]

## Requirements

If you would like to follow this documents and it's task you will need to set up
few environment variables.

`BASE_DOMAIN` contains DNS records for all your Kubernetes clusters. The cluster
names will look like `CLUSTER_NAME`.`BASE_DOMAIN` (`kube1.k8s.mylabs.dev`).

```bash
# Hostname / FQDN definitions
export BASE_DOMAIN=${BASE_DOMAIN:-k8s.mylabs.dev}
export CLUSTER_NAME=${CLUSTER_NAME:-kube1}
export CLUSTER_FQDN="${CLUSTER_NAME}.${BASE_DOMAIN}"
export KUBECONFIG=${PWD}/tmp/${CLUSTER_FQDN}/kubeconfig-${CLUSTER_NAME}.conf
export MY_EMAIL="petr.ruzicka@gmail.com"
# GitHub Organization + Team where are the users who will have the admin access
# to K8s resources (Grafana). Only users in GitHub organization
# (MY_GITHUB_ORG_NAME) will be able to access the apps via ingress.
export MY_GITHUB_ORG_NAME="ruzickap-org"
# Flux GitHub repository
export GITHUB_USER="ruzickap"
export GITHUB_FLUX_REPOSITORY="k8s-eks-flux-${CLUSTER_NAME}-repo"
export SLACK_CHANNEL="mylabs"
# AWS Region
export AWS_DEFAULT_REGION="eu-west-1"
# Set dev, prd, stg or eny other environment
export ENVIRONMENT=dev
# * "production" - valid certificates signed by Lets Encrypt ""
# * "staging" - not trusted certs signed by Lets Encrypt "Fake LE Intermediate X1"
export LETSENCRYPT_ENVIRONMENT="staging"
# Tags used to tag the AWS resources
export TAGS="Owner=${MY_EMAIL} Environment=${ENVIRONMENT} Group=Cloud_Native Squad=Cloud_Container_Platform compliance:na:defender=bottlerocket"
echo -e "${MY_EMAIL} | ${CLUSTER_NAME} | ${BASE_DOMAIN} | ${CLUSTER_FQDN}\n${TAGS}"
```

You will need to configure AWS CLI: [https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)

```shell
# Common password
export MY_PASSWORD="xxxx"
# AWS Credentials
export AWS_ACCESS_KEY_ID="AxxxxxxxxxxxxxxxxxxY"
export AWS_SECRET_ACCESS_KEY="txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxh"
# Disable pager for AWS CLI
export AWS_PAGER=""
export GITHUB_TOKEN="xxxxx"
# Slack incoming webhook
export SLACK_INCOMING_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
# GitHub Organization OAuth Apps credentials
export MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID="3xxxxxxxxxxxxxxxxxx3"
export MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET="7xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx8"
# Okta configuration
export OKTA_ISSUER="https://exxxxxxx-xxxxx-xx.okta.com"
export OKTA_CLIENT_ID="0xxxxxxxxxxxxxxxxxx7"
export OKTA_CLIENT_SECRET="1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxH"
```

Verify if all the necessary variables were set:

```bash
case "${CLUSTER_NAME}" in
  kube1)
    MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID=${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID:-${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID_KUBE1}}
    MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET=${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET:-${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET_KUBE1}}
  ;;
  kube2)
    MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID=${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID:-${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID_KUBE2}}
    MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET=${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET:-${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET_KUBE2}}
  ;;
  *)
    echo "Unsupported cluster name: ${CLUSTER_NAME} !"
    exit 1
  ;;
esac

: "${AWS_ACCESS_KEY_ID?}"
: "${AWS_SECRET_ACCESS_KEY?}"
: "${GITHUB_TOKEN?}"
: "${SLACK_INCOMING_WEBHOOK_URL?}"
: "${SLACK_CHANNEL?}"
: "${MY_PASSWORD?}"
: "${OKTA_ISSUER?}"
: "${OKTA_CLIENT_ID?}"
: "${OKTA_CLIENT_SECRET?}"
```

## Prepare the local working environment

::: tip
You can skip these steps if you have all the required software already
installed.
:::

Install necessary software:

```bash
if command -v apt-get &> /dev/null; then
  apt update -qq
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq curl git jq sudo unzip > /dev/null
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

Install [AWS IAM Authenticator for Kubernetes](https://github.com/kubernetes-sigs/aws-iam-authenticator):

```bash
if ! command -v aws-iam-authenticator &> /dev/null; then
  # https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html
  sudo curl -s -Lo /usr/local/bin/aws-iam-authenticator "https://amazon-eks.s3.us-west-2.amazonaws.com/1.19.6/2021-01-05/bin/$(uname | sed "s/./\L&/g")/amd64/aws-iam-authenticator"
  sudo chmod a+x /usr/local/bin/aws-iam-authenticator
fi
```

Install [kubectl](https://github.com/kubernetes/kubectl) binary:

```bash
if ! command -v kubectl &> /dev/null; then
  # https://github.com/kubernetes/kubectl/releases
  sudo curl -s -Lo /usr/local/bin/kubectl "https://storage.googleapis.com/kubernetes-release/release/v1.21.1/bin/$(uname | sed "s/./\L&/g" )/amd64/kubectl"
  sudo chmod a+x /usr/local/bin/kubectl
fi
```

Install [eksctl](https://eksctl.io/):

```bash
if ! command -v eksctl &> /dev/null; then
  # https://github.com/weaveworks/eksctl/releases
  curl -s -L "https://github.com/weaveworks/eksctl/releases/download/0.63.0/eksctl_$(uname)_amd64.tar.gz" | sudo tar xz -C /usr/local/bin/
fi
```

Install [flux](https://toolkit.fluxcd.io/):

```bash
if ! command -v flux &> /dev/null; then
  curl -s https://fluxcd.io/install.sh | sudo bash
fi
```

Install [Helm](https://helm.sh/):

```bash
if ! command -v helm &> /dev/null; then
  # https://github.com/helm/helm/releases
  curl -s https://raw.githubusercontent.com/helm/helm/master/scripts/get | bash -s -- --version v3.6.3
fi
```

Install [Mozilla SOPS](https://github.com/mozilla/sops):

```bash
if ! command -v sops &> /dev/null; then
  curl -sL "https://github.com/mozilla/sops/releases/download/v3.7.1/sops_3.7.1_amd64.deb" -o "/tmp/sops_amd64.deb"
  apt install -y /tmp/sops_amd64.deb > /dev/null
fi
```

## Configure AWS Route 53 Domain delegation

> This should be done only once.

Create DNS zone (`BASE_DOMAIN`):

```shell
aws route53 create-hosted-zone --output json \
  --name "${BASE_DOMAIN}" \
  --caller-reference "$(date)" \
  --hosted-zone-config="{\"Comment\": \"Created by ${MY_EMAIL}\", \"PrivateZone\": false}" | jq
```

Use your domain registrar to change the nameservers for your zone (for example
`mylabs.dev`) to use the Amazon Route 53 nameservers. Here is the way how you
can find out the the Route 53 nameservers:

```shell
NEW_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name==\`${BASE_DOMAIN}.\`].Id" --output text)
NEW_ZONE_NS=$(aws route53 get-hosted-zone --output json --id "${NEW_ZONE_ID}" --query "DelegationSet.NameServers")
NEW_ZONE_NS1=$(echo "${NEW_ZONE_NS}" | jq -r ".[0]")
NEW_ZONE_NS2=$(echo "${NEW_ZONE_NS}" | jq -r ".[1]")
```

Create the NS record in `k8s.mylabs.dev` (`BASE_DOMAIN`) for proper zone
delegation. This step depends on your domain registrar - I'm using CloudFlare
and using Ansible to automate it:

```shell
ansible -m cloudflare_dns -c local -i "localhost," localhost -a "zone=mylabs.dev record=${BASE_DOMAIN} type=NS value=${NEW_ZONE_NS1} solo=true proxied=no account_email=${CLOUDFLARE_EMAIL} account_api_token=${CLOUDFLARE_API_KEY}"
ansible -m cloudflare_dns -c local -i "localhost," localhost -a "zone=mylabs.dev record=${BASE_DOMAIN} type=NS value=${NEW_ZONE_NS2} solo=false proxied=no account_email=${CLOUDFLARE_EMAIL} account_api_token=${CLOUDFLARE_API_KEY}"
```

Output:

```text
localhost | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": true,
    "result": {
        "record": {
            "content": "ns-885.awsdns-46.net",
            "created_on": "2020-11-13T06:25:32.18642Z",
            "id": "dxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxb",
            "locked": false,
            "meta": {
                "auto_added": false,
                "managed_by_apps": false,
                "managed_by_argo_tunnel": false,
                "source": "primary"
            },
            "modified_on": "2020-11-13T06:25:32.18642Z",
            "name": "k8s.mylabs.dev",
            "proxiable": false,
            "proxied": false,
            "ttl": 1,
            "type": "NS",
            "zone_id": "2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxe",
            "zone_name": "mylabs.dev"
        }
    }
}
localhost | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": true,
    "result": {
        "record": {
            "content": "ns-1692.awsdns-19.co.uk",
            "created_on": "2020-11-13T06:25:37.605605Z",
            "id": "9xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxb",
            "locked": false,
            "meta": {
                "auto_added": false,
                "managed_by_apps": false,
                "managed_by_argo_tunnel": false,
                "source": "primary"
            },
            "modified_on": "2020-11-13T06:25:37.605605Z",
            "name": "k8s.mylabs.dev",
            "proxiable": false,
            "proxied": false,
            "ttl": 1,
            "type": "NS",
            "zone_id": "2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxe",
            "zone_name": "mylabs.dev"
        }
    }
}
```

## Create networking for Amazon EKS

Details with examples are described on these links:

* [https://aws.amazon.com/blogs/opensource/introducing-fine-grained-iam-roles-service-accounts/](https://aws.amazon.com/blogs/opensource/introducing-fine-grained-iam-roles-service-accounts/)
* [https://cert-manager.io/docs/configuration/acme/dns01/route53/](https://cert-manager.io/docs/configuration/acme/dns01/route53/)
* [https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/aws.md](https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/aws.md)

Create temporary directory for files used for creating/configuring/ EKS Cluster:

```bash
mkdir -p "tmp/${CLUSTER_FQDN}"
```

Create CloudFormation template with Networking for Amazon EKS:

```bash
cat > "tmp/${CLUSTER_FQDN}/cf-amazon-eks-vpc-private-subnets-kms.yml" << \EOF
---
# Taken from https://s3.us-west-2.amazonaws.com/amazon-eks/cloudformation/2020-10-29/amazon-eks-vpc-private-subnets.yaml

AWSTemplateFormatVersion: '2010-09-09'
Description: 'Amazon EKS VPC with Private and Public subnets and KMS key'

Parameters:

  VpcBlock:
    Type: String
    Default: 192.168.0.0/16
    Description: The CIDR range for the VPC. This should be a valid private (RFC 1918) CIDR range.

  PublicSubnet01Block:
    Type: String
    Default: 192.168.0.0/18
    Description: CidrBlock for public subnet 01 within the VPC

  PublicSubnet02Block:
    Type: String
    Default: 192.168.64.0/18
    Description: CidrBlock for public subnet 02 within the VPC

  PrivateSubnet01Block:
    Type: String
    Default: 192.168.128.0/18
    Description: CidrBlock for private subnet 01 within the VPC

  PrivateSubnet02Block:
    Type: String
    Default: 192.168.192.0/18
    Description: CidrBlock for private subnet 02 within the VPC

  ClusterFQDN:
    Description: "Cluster domain where all necessary app subdomains will live (subdomain of BaseDomain). Ex: kube1.k8s.mylabs.dev"
    Type: String

  ClusterName:
    Description: "K8s Cluster name. Ex: kube1"
    Type: String

Metadata:
  AWS::CloudFormation::Interface:
    ParameterGroups:
      -
        Label:
          default: "Worker Network Configuration"
        Parameters:
          - VpcBlock
          - PublicSubnet01Block
          - PublicSubnet02Block
          - PrivateSubnet01Block
          - PrivateSubnet02Block

  cfn-lint:
    config:
      ignore_checks:
        - W3005
      configure_rules:
        E3012:
          strict: False

Resources:

  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: !Ref VpcBlock
      EnableDnsSupport: true
      EnableDnsHostnames: true
      Tags:
      - Key: Name
        Value: !Sub '${ClusterFQDN}-VPC'

  InternetGateway:
    Type: "AWS::EC2::InternetGateway"

  VPCGatewayAttachment:
    Type: "AWS::EC2::VPCGatewayAttachment"
    Properties:
      InternetGatewayId: !Ref InternetGateway
      VpcId: !Ref VPC

  PublicRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC
      Tags:
      - Key: Name
        Value: Public Subnets
      - Key: Network
        Value: Public

  PrivateRouteTable01:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC
      Tags:
      - Key: Name
        Value: Private Subnet AZ1
      - Key: Network
        Value: Private01

  PrivateRouteTable02:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC
      Tags:
      - Key: Name
        Value: Private Subnet AZ2
      - Key: Network
        Value: Private02

  PublicRoute:
    DependsOn: VPCGatewayAttachment
    Type: AWS::EC2::Route
    Properties:
      RouteTableId: !Ref PublicRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId: !Ref InternetGateway

  PrivateRoute01:
    DependsOn:
    - VPCGatewayAttachment
    - NatGateway01
    Type: AWS::EC2::Route
    Properties:
      RouteTableId: !Ref PrivateRouteTable01
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId: !Ref NatGateway01

  PrivateRoute02:
    DependsOn:
    - VPCGatewayAttachment
    - NatGateway02
    Type: AWS::EC2::Route
    Properties:
      RouteTableId: !Ref PrivateRouteTable02
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId: !Ref NatGateway02

  NatGateway01:
    DependsOn:
    - NatGatewayEIP1
    - PublicSubnet01
    - VPCGatewayAttachment
    Type: AWS::EC2::NatGateway
    Properties:
      AllocationId: !GetAtt 'NatGatewayEIP1.AllocationId'
      SubnetId: !Ref PublicSubnet01
      Tags:
      - Key: Name
        Value: !Sub '${ClusterFQDN}-NatGatewayAZ1'

  NatGateway02:
    DependsOn:
    - NatGatewayEIP2
    - PublicSubnet02
    - VPCGatewayAttachment
    Type: AWS::EC2::NatGateway
    Properties:
      AllocationId: !GetAtt 'NatGatewayEIP2.AllocationId'
      SubnetId: !Ref PublicSubnet02
      Tags:
      - Key: Name
        Value: !Sub '${ClusterFQDN}-NatGatewayAZ2'

  NatGatewayEIP1:
    DependsOn:
    - VPCGatewayAttachment
    Type: 'AWS::EC2::EIP'
    Properties:
      Domain: vpc

  NatGatewayEIP2:
    DependsOn:
    - VPCGatewayAttachment
    Type: 'AWS::EC2::EIP'
    Properties:
      Domain: vpc

  PublicSubnet01:
    Type: AWS::EC2::Subnet
    Metadata:
      Comment: Subnet 01
    Properties:
      MapPublicIpOnLaunch: true
      AvailabilityZone:
        Fn::Select:
        - '0'
        - Fn::GetAZs:
            Ref: AWS::Region
      CidrBlock:
        Ref: PublicSubnet01Block
      VpcId:
        Ref: VPC
      Tags:
      - Key: Name
        Value: !Sub "${ClusterFQDN}-PublicSubnet01"
      - Key: kubernetes.io/role/elb
        Value: 1

  PublicSubnet02:
    Type: AWS::EC2::Subnet
    Metadata:
      Comment: Subnet 02
    Properties:
      MapPublicIpOnLaunch: true
      AvailabilityZone:
        Fn::Select:
        - '1'
        - Fn::GetAZs:
            Ref: AWS::Region
      CidrBlock:
        Ref: PublicSubnet02Block
      VpcId:
        Ref: VPC
      Tags:
      - Key: Name
        Value: !Sub "${ClusterFQDN}-PublicSubnet02"
      - Key: kubernetes.io/role/elb
        Value: 1

  PrivateSubnet01:
    Type: AWS::EC2::Subnet
    Metadata:
      Comment: Subnet 03
    Properties:
      AvailabilityZone:
        Fn::Select:
        - '0'
        - Fn::GetAZs:
            Ref: AWS::Region
      CidrBlock:
        Ref: PrivateSubnet01Block
      VpcId:
        Ref: VPC
      Tags:
      - Key: Name
        Value: !Sub "${ClusterFQDN}-PrivateSubnet01"
      - Key: kubernetes.io/role/internal-elb
        Value: 1

  PrivateSubnet02:
    Type: AWS::EC2::Subnet
    Metadata:
      Comment: Private Subnet 02
    Properties:
      AvailabilityZone:
        Fn::Select:
        - '1'
        - Fn::GetAZs:
            Ref: AWS::Region
      CidrBlock:
        Ref: PrivateSubnet02Block
      VpcId:
        Ref: VPC
      Tags:
      - Key: Name
        Value: !Sub "${ClusterFQDN}-PrivateSubnet02"
      - Key: kubernetes.io/role/internal-elb
        Value: 1

  PublicSubnet01RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PublicSubnet01
      RouteTableId: !Ref PublicRouteTable

  PublicSubnet02RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PublicSubnet02
      RouteTableId: !Ref PublicRouteTable

  PrivateSubnet01RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PrivateSubnet01
      RouteTableId: !Ref PrivateRouteTable01

  PrivateSubnet02RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PrivateSubnet02
      RouteTableId: !Ref PrivateRouteTable02

  KMSAlias:
    Type: AWS::KMS::Alias
    Properties:
      AliasName: !Sub "alias/eks-${ClusterName}"
      TargetKeyId: !Ref KMSKey

  KMSKey:
    Type: AWS::KMS::Key
    Properties:
      Description: !Sub "KMS key for secrets related to ${ClusterFQDN}"
      EnableKeyRotation: true
      PendingWindowInDays: 7
      KeyPolicy:
        Version: "2012-10-17"
        Id: !Sub "eks-key-policy-${ClusterName}"
        Statement:
        - Sid: Enable IAM User Permissions
          Effect: Allow
          Principal:
            AWS: !Sub "arn:aws:iam::${AWS::AccountId}:root"
          Action: kms:*
          Resource: "*"
        # https://docs.aws.amazon.com/autoscaling/ec2/userguide/key-policy-requirements-EBS-encryption.html
        - Sid: Allow use of the key
          Effect: Allow
          Principal:
            AWS: !Sub "arn:aws:iam::${AWS::AccountId}:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling"
          Action:
          - kms:Encrypt
          - kms:Decrypt
          - kms:ReEncrypt*
          - kms:GenerateDataKey*
          - kms:DescribeKey
          Resource: "*"
        - Sid: Allow attachment of persistent resources
          Effect: Allow
          Principal:
            AWS: !Sub "arn:aws:iam::${AWS::AccountId}:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling"
          Action:
          - kms:CreateGrant
          Resource: "*"
          Condition:
            Bool:
              kms:GrantIsForAWSResource: true

Outputs:

  SubnetIds:
    Description: Subnets IDs in the VPC
    Value: !Join [ ",", [ !Ref PublicSubnet01, !Ref PublicSubnet02, !Ref PrivateSubnet01, !Ref PrivateSubnet02 ] ]

  SubnetsIdsPrivate:
    Description: Private Subnets IDs in the VPC
    Value: !Join [ ",", [ !Ref PrivateSubnet01, !Ref PrivateSubnet02 ] ]
    Export:
      Name:
        'Fn::Sub': '${AWS::StackName}-SubnetsIdsPrivate'

  PrivateSubnetId1:
    Description: A reference to the private subnet in the 1st Availability Zone
    Value: !Ref PrivateSubnet01

  PrivateSubnetId2:
    Description: A reference to the private subnet in the 2nd Availability Zone
    Value: !Ref PrivateSubnet02

  PublicSubnetId1:
    Description: A reference to the public subnet in the 1st Availability Zone
    Value: !Ref PublicSubnet01

  PublicSubnetId2:
    Description: A reference to the public subnet in the 1st Availability Zone
    Value: !Ref PublicSubnet02

  VpcId:
    Description: The VPC Id
    Value: !Ref VPC
    Export:
      Name:
        'Fn::Sub': '${AWS::StackName}-VpcId'

  VpcCidrBlock:
    Description: The VPC CIDR
    Value: !GetAtt VPC.CidrBlock
    Export:
      Name:
        'Fn::Sub': '${AWS::StackName}-VpcCidrBlock'

  KMSKeyArn:
    Description: The ARN of the created KMS Key
    Value: !GetAtt KMSKey.Arn

  KMSKeyId:
    Description: The ID of the created KMS Key to encrypt EKS related services
    Value: !Ref KMSKey
    Export:
      Name:
        'Fn::Sub': '${AWS::StackName}-KMSKeyId'
EOF

eval aws cloudformation deploy \
  --parameter-overrides "ClusterFQDN=${CLUSTER_FQDN} ClusterName=${CLUSTER_NAME}" \
  --stack-name "${CLUSTER_NAME}-amazon-eks-vpc-private-subnets-kms" \
  --template-file "tmp/${CLUSTER_FQDN}/cf-amazon-eks-vpc-private-subnets-kms.yml" \
  --tags "${TAGS}"
```

Get the variables form CloudFormation:

```bash
aws cloudformation describe-stacks --stack-name "${CLUSTER_NAME}-amazon-eks-vpc-private-subnets-kms" > "tmp/${CLUSTER_FQDN}/${CLUSTER_NAME}-amazon-eks-vpc-private-subnets-kms.json"
AWS_VPC_ID=$(jq -r ".Stacks[0].Outputs[] | select(.OutputKey==\"VpcId\") .OutputValue" "tmp/${CLUSTER_FQDN}/${CLUSTER_NAME}-amazon-eks-vpc-private-subnets-kms.json")
# AWS_VPC_CIDR=$(jq -r ".Stacks[0].Outputs[] | select(.OutputKey==\"VpcCidrBlock\") .OutputValue" "tmp/${CLUSTER_FQDN}/${CLUSTER_NAME}-amazon-eks-vpc-private-subnets-kms.json")
AWS_PUBLICSUBNETID1=$(jq -r ".Stacks[0].Outputs[] | select(.OutputKey==\"PublicSubnetId1\") .OutputValue" "tmp/${CLUSTER_FQDN}/${CLUSTER_NAME}-amazon-eks-vpc-private-subnets-kms.json")
AWS_PUBLICSUBNETID2=$(jq -r ".Stacks[0].Outputs[] | select(.OutputKey==\"PublicSubnetId2\") .OutputValue" "tmp/${CLUSTER_FQDN}/${CLUSTER_NAME}-amazon-eks-vpc-private-subnets-kms.json")
AWS_PRIVATESUBNETID1=$(jq -r ".Stacks[0].Outputs[] | select(.OutputKey==\"PrivateSubnetId1\") .OutputValue" "tmp/${CLUSTER_FQDN}/${CLUSTER_NAME}-amazon-eks-vpc-private-subnets-kms.json")
AWS_PRIVATESUBNETID2=$(jq -r ".Stacks[0].Outputs[] | select(.OutputKey==\"PrivateSubnetId2\") .OutputValue" "tmp/${CLUSTER_FQDN}/${CLUSTER_NAME}-amazon-eks-vpc-private-subnets-kms.json")
AWS_KMS_KEY_ARN=$(jq -r ".Stacks[0].Outputs[] | select(.OutputKey==\"KMSKeyArn\") .OutputValue" "tmp/${CLUSTER_FQDN}/${CLUSTER_NAME}-amazon-eks-vpc-private-subnets-kms.json")
AWS_KMS_KEY_ID=$(jq -r ".Stacks[0].Outputs[] | select(.OutputKey==\"KMSKeyId\") .OutputValue" "tmp/${CLUSTER_FQDN}/${CLUSTER_NAME}-amazon-eks-vpc-private-subnets-kms.json")
```
