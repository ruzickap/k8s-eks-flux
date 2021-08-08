# Create additional AWS structure

[[toc]]

## Create EFS

Create EFS which will be used by Amazon EKS cluster:

```bash
cat > "tmp/${CLUSTER_FQDN}/efs.yml" << \EOF
AWSTemplateFormatVersion: 2010-09-09
Description: Create EFS, mount points, security groups for EKS
Parameters:
  ClusterName:
    Description: "K8s Cluster name. Ex: kube1"
    Type: String
Resources:
  MountTargetSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      VpcId:
        Fn::ImportValue:
          Fn::Sub: "${ClusterName}-amazon-eks-vpc-private-subnets-route53-VpcId"
      GroupName: !Sub "${ClusterName}-efs-sg"
      GroupDescription: Security group for mount target
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 2049
          ToPort: 2049
          CidrIp:
            Fn::ImportValue:
              Fn::Sub: "${ClusterName}-amazon-eks-vpc-private-subnets-route53-VpcCidrBlock"
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
          - Fn::ImportValue: !Sub "${ClusterName}-amazon-eks-vpc-private-subnets-route53-SubnetsIdsPrivate"
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
          - Fn::ImportValue: !Sub "${ClusterName}-amazon-eks-vpc-private-subnets-route53-SubnetsIdsPrivate"
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
          - Fn::ImportValue: !Sub "${ClusterName}-amazon-eks-vpc-private-subnets-route53-SubnetsIdsPrivate"
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
          - Fn::ImportValue: !Sub "${ClusterName}-amazon-eks-vpc-private-subnets-route53-SubnetsIdsPrivate"
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
          - Fn::ImportValue: !Sub "${ClusterName}-amazon-eks-vpc-private-subnets-route53-SubnetsIdsPrivate"
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
          - Fn::ImportValue: !Sub "${ClusterName}-amazon-eks-vpc-private-subnets-route53-SubnetsIdsPrivate"
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

if ! aws cloudformation describe-stacks --stack-name "${CLUSTER_NAME}-efs" ; then
  CLOUDFORMATION_ACTION='create-stack'
else
  CLOUDFORMATION_ACTION='update-stack'
fi

eval aws cloudformation "${CLOUDFORMATION_ACTION}" \
  --parameters "ParameterKey=ClusterName,ParameterValue=${CLUSTER_NAME}" \
  --stack-name "${CLUSTER_NAME}-efs" \
  --template-body "file://tmp/${CLUSTER_FQDN}/efs.yml" \
  --tags "$(echo $TAGS | sed  -e 's/\([^ =]*\)=\([^ ]*\)/Key=\1,Value=\2/g')" || true
```
