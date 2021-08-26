# Create EKS cluster

[[toc]]

## Create Amazon EKS

Create temporary directory for files used for creating/configuring/ EKS Cluster:

```bash
mkdir -p "tmp/${CLUSTER_FQDN}"
```

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
availabilityZones:
  - ${AWS_DEFAULT_REGION}a
  - ${AWS_DEFAULT_REGION}b
iam:
  withOIDC: true
managedNodeGroups:
  - name: managed-ng-1
    amiFamily: Bottlerocket
    instanceType: t3.medium
    instancePrefix: ${GITHUB_USER}
    desiredCapacity: 2
    minSize: 2
    maxSize: 5
    volumeSize: 30
    ssh:
      enableSsm: true
    tags: *tags
    volumeEncrypted: true
    disableIMDSv1: true
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
fi
```

Add add the user or role to the aws-auth ConfigMap. This is handy if you are
using different user for CLI operations and different user/role for accessing
the AWS Console to see EKS Workloads in Cluster's tab.

```bash
if ! eksctl get iamidentitymapping --cluster="${CLUSTER_NAME}" --region="${AWS_DEFAULT_REGION}" --arn=${AWS_CONSOLE_ADMIN_ROLE_ARN} &> /dev/null ; then
  eksctl create iamidentitymapping --cluster="${CLUSTER_NAME}" --region="${AWS_DEFAULT_REGION}" --arn="${AWS_CONSOLE_ADMIN_ROLE_ARN}" --group system:masters --username admin
fi

if ! eksctl get iamidentitymapping --cluster="${CLUSTER_NAME}" --region="${AWS_DEFAULT_REGION}" --arn=${AWS_USER_ROLE_ARN} &> /dev/null ; then
  eksctl create iamidentitymapping --cluster="${CLUSTER_NAME}" --region="${AWS_DEFAULT_REGION}" --arn="${AWS_USER_ROLE_ARN}" --group system:masters --username admin
fi
```

Check the nodes+pods:

```bash
kubectl get nodes,pods -o wide --all-namespaces
```
