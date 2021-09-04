# Applications

[[toc]]

Flux disadvantages:

* `dependsOn` can not be used between `HelmRelease` and `Kustomization`:
  [HelmRelease, Kustomization DependsOn](https://github.com/fluxcd/kustomize-controller/issues/242)

## Create basic Flux structure in git repository

Clone initial git repository created by `eksctl` used by Flux:

```bash
test -d "tmp/${CLUSTER_FQDN}/${GITHUB_FLUX_REPOSITORY}" || git clone "https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${GITHUB_FLUX_REPOSITORY}.git" "tmp/${CLUSTER_FQDN}/${GITHUB_FLUX_REPOSITORY}"
```

Create basic Flux structure in git with following requirements or statements:

* `HelmRepositories` must be installed in `flux-system` namespace and separated,
  because definitions there are shared by multiple `HelmReleases` (apps)
* `HelmRepositories` must be installed before `HelmReleases` (`dependsOn`) to prevent
  generation errors in Flux log
* I want to define "flexible" cluster groups + applications like `prod`, `dev`,
  `mygroup`, `myteam`
  * It should be possible to define application groups containing various
    applications
  * It should also help you to easily manage groups of clusters because their
    definitions will be in the specific directory
* `HelmRepository` definitions should be set based on application group
  or per cluster

Create initial git repository structure which will be used by Flux:

```bash
mkdir -vp tmp/${CLUSTER_FQDN}/${GITHUB_FLUX_REPOSITORY}/clusters/{prd/{k01,k02},dev/{k03,k04},mygroup/{k05,k06}}
mkdir -vp tmp/${CLUSTER_FQDN}/${GITHUB_FLUX_REPOSITORY}/apps/{base,helmrepository,prd,dev,mygroup}
cd tmp/${CLUSTER_FQDN}/${GITHUB_FLUX_REPOSITORY}/
```

## HelmRepository

Create `HelmRepository` definitions

### eks

```bash
mkdir -vp apps/helmrepository/eks
cat > apps/helmrepository/eks/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - eks.yaml
EOF

cat > apps/helmrepository/eks/eks.yaml << EOF
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: HelmRepository
metadata:
  name: eks
  namespace: flux-system
spec:
  interval: 1h
  url: https://aws.github.io/eks-charts
EOF
```

### aws-ebs-csi-driver

```bash
mkdir -vp apps/helmrepository/aws-ebs-csi-driver
cat > apps/helmrepository/aws-ebs-csi-driver/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - aws-ebs-csi-driver.yaml
EOF

cat > apps/helmrepository/aws-ebs-csi-driver/aws-ebs-csi-driver.yaml << EOF
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: HelmRepository
metadata:
  name: aws-ebs-csi-driver
  namespace: flux-system
spec:
  interval: 1h
  url: https://kubernetes-sigs.github.io/aws-ebs-csi-driver/
EOF
```

### aws-efs-csi-driver

```bash
mkdir -vp apps/helmrepository/aws-efs-csi-driver
cat > apps/helmrepository/aws-efs-csi-driver/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - aws-efs-csi-driver.yaml
EOF

cat > apps/helmrepository/aws-efs-csi-driver/aws-efs-csi-driver.yaml << EOF
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: HelmRepository
metadata:
  name: aws-efs-csi-driver
  namespace: flux-system
spec:
  interval: 1h
  url: https://kubernetes-sigs.github.io/aws-efs-csi-driver/
EOF
```

### bitnami

```bash
mkdir -vp apps/helmrepository/bitnami
cat > apps/helmrepository/bitnami/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - bitnami.yaml
EOF

cat > apps/helmrepository/bitnami/bitnami.yaml << EOF
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: HelmRepository
metadata:
  name: bitnami
  namespace: flux-system
spec:
  interval: 1h
  url: https://charts.bitnami.com/bitnami
EOF
```

### prometheus-community

```bash
mkdir -vp apps/helmrepository/prometheus-community
cat > apps/helmrepository/prometheus-community/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - prometheus-community.yaml
EOF

cat > apps/helmrepository/prometheus-community/prometheus-community.yaml << EOF
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: HelmRepository
metadata:
  name: prometheus-community
  namespace: flux-system
spec:
  interval: 1h
  url: https://prometheus-community.github.io/helm-charts
EOF
```

## Basic Applications

> Due to [https://github.com/fluxcd/flux2/discussions/730](https://github.com/fluxcd/flux2/discussions/730),
> [https://github.com/fluxcd/flux2/discussions/1010](https://github.com/fluxcd/flux2/discussions/1010)
> it is necessary to "pack" HelmRelease "inside" Kustomization to be able to do
> dependency using `dependsOn` later...

### AWS Load Balancer Controller

[AWS Load Balancer Controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)

* [aws-load-balancer-controller](https://artifacthub.io/packages/helm/aws/aws-load-balancer-controller)
* [default values.yaml](https://github.com/aws/eks-charts/blob/master/stable/aws-load-balancer-controller/values.yaml).

```bash
mkdir -vp apps/base/aws-load-balancer-controller/helmrelease
cat > apps/base/aws-load-balancer-controller/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - aws-load-balancer-controller.yaml
EOF

cat > apps/base/aws-load-balancer-controller/aws-load-balancer-controller.yaml << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: aws-load-balancer-controller
  namespace: kube-system
spec:
  interval: 5m0s
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  healthChecks:
    - apiVersion: helm.toolkit.fluxcd.io/v1beta1
      kind: HelmRelease
      name: aws-load-balancer-controller
      namespace: kube-system
  path: "./apps/base/aws-load-balancer-controller/helmrelease"
  prune: true
  validation: client
EOF

cat > apps/base/aws-load-balancer-controller/helmrelease/aws-load-balancer-controller.yaml << EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
# | eks | https://aws.github.io/eks-charts | aws-load-balancer-controller | 1.2.6
metadata:
  name: aws-load-balancer-controller
  namespace: kube-system
spec:
  releaseName: aws-load-balancer-controller
  chart:
    spec:
      chart: aws-load-balancer-controller
      sourceRef:
        kind: HelmRepository
        name: eks
        namespace: flux-system
      version: 1.2.7
  interval: 1h0m0s
  values:
    clusterName: ${CLUSTER_NAME}
    serviceAccount:
      create: false
      name: aws-load-balancer-controller-sa
    enableShield: false
    enableWaf: false
    enableWafv2: false
    defaultTags:
      $(echo "${TAGS}" | sed "s/ /\\n      /g; s/=/: /g")
EOF
```

### Amazon EFS CSI Driver

Install [Amazon EFS CSI Driver](https://github.com/kubernetes-sigs/aws-efs-csi-driver),
which supports ReadWriteMany PVC. Details can be found here:
[Introducing Amazon EFS CSI dynamic provisioning](https://aws.amazon.com/blogs/containers/introducing-efs-csi-dynamic-provisioning/)

[Amazon EFS CSI Driver](https://github.com/kubernetes-sigs/aws-efs-csi-driver)

* [aws-efs-csi-driver](https://github.com/kubernetes-sigs/aws-efs-csi-driver/tree/master/charts/aws-efs-csi-driver)
* [default values.yaml](https://github.com/kubernetes-sigs/aws-efs-csi-driver/blob/master/charts/aws-efs-csi-driver/values.yaml):

```bash
mkdir -vp apps/base/aws-efs-csi-driver/{helmrelease,manifests-pv}
cat > apps/base/aws-efs-csi-driver/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - aws-efs-csi-driver.yaml
  - aws-efs-csi-driver-manifests-pv.yaml
EOF

cat > apps/base/aws-efs-csi-driver/aws-efs-csi-driver.yaml << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: aws-efs-csi-driver
  namespace: kube-system
spec:
  interval: 5m0s
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  healthChecks:
    - apiVersion: helm.toolkit.fluxcd.io/v1beta1
      kind: HelmRelease
      name: aws-efs-csi-driver
      namespace: kube-system
  path: "./apps/base/aws-efs-csi-driver/helmrelease"
  prune: true
  validation: client
EOF

cat > apps/base/aws-efs-csi-driver/helmrelease/aws-efs-csi-driver.yaml << EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
# | aws-efs-csi-driver | https://kubernetes-sigs.github.io/aws-efs-csi-driver/ | aws-efs-csi-driver | 2.1.5
metadata:
  name: aws-efs-csi-driver
  namespace: kube-system
spec:
  releaseName: aws-efs-csi-driver
  chart:
    spec:
      chart: aws-efs-csi-driver
      sourceRef:
        kind: HelmRepository
        name: aws-efs-csi-driver
        namespace: flux-system
      version: 2.1.5
  interval: 1h0m0s
  values:
    controller:
      serviceAccount:
        create: false
        name: efs-csi-controller-sa
    storageClasses:
    - name: efs-drupal-dynamic
      parameters:
        provisioningMode: efs-ap
        fileSystemId: "${AWS_EFS_FS_ID_DRUPAL}"
        directoryPerms: "700"
        basePath: "/dynamic_provisioning"
      reclaimPolicy: Delete
    - name: efs-drupal-static
      parameters:
        provisioningMode: efs-ap
        fileSystemId: "${AWS_EFS_FS_ID_DRUPAL}"
        directoryPerms: "700"
      reclaimPolicy: Delete
    - name: efs-myuser1-sc
      parameters:
        provisioningMode: efs-ap
        fileSystemId: "${AWS_EFS_FS_ID_MYUSER1}"
        directoryPerms: "700"
      reclaimPolicy: Delete
    - name: efs-myuser2-sc
      parameters:
        provisioningMode: efs-ap
        fileSystemId: "${AWS_EFS_FS_ID_MYUSER2}"
        directoryPerms: "700"
      reclaimPolicy: Delete
EOF
```

Create `PersistentVolume`s which can be consumed by users (`myuser1`, `myuser2`)
using `PersistentVolumeClaim`:

```bash
cat > apps/base/aws-efs-csi-driver/aws-efs-csi-driver-manifests-pv.yaml << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: aws-efs-csi-driver-manifests-pv
  namespace: kube-system
spec:
  interval: 5m0s
  dependsOn:
    - name: aws-efs-csi-driver
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  healthChecks:
    - apiVersion: v1
      kind: PersistentVolume
      name: efs-myuser1-pv
    - apiVersion: v1
      kind: PersistentVolume
      name: efs-myuser2-pv
  path: "./apps/base/aws-efs-csi-driver/manifests-pv"
  prune: true
  validation: client
EOF

cat > apps/base/aws-efs-csi-driver/manifests-pv/pv.yaml << EOF
apiVersion: v1
kind: PersistentVolume
metadata:
  name: efs-myuser1-pv
spec:
  storageClassName: efs-myuser1-sc
  capacity:
    storage: 1Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Delete
  csi:
    driver: efs.csi.aws.com
    volumeHandle: ${AWS_EFS_FS_ID_MYUSER1}::${AWS_EFS_AP_ID_MYUSER1}
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: efs-myuser2-pv
spec:
  storageClassName: efs-myuser2-sc
  capacity:
    storage: 1Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Delete
  csi:
    driver: efs.csi.aws.com
    volumeHandle: ${AWS_EFS_FS_ID_MYUSER2}::${AWS_EFS_AP_ID_MYUSER2}
EOF
```

### Amazon Elastic Block Store (EBS) CSI driver

[Amazon Elastic Block Store (EBS) CSI driver](https://github.com/kubernetes-sigs/aws-ebs-csi-driver)

* [aws-ebs-csi-driver](https://github.com/kubernetes-sigs/aws-ebs-csi-driver/tree/master/charts/aws-ebs-csi-driver)
* [default values.yaml](https://github.com/kubernetes-sigs/aws-ebs-csi-driver/blob/master/charts/aws-ebs-csi-driver/values.yaml):

```bash
mkdir -vp apps/base/aws-ebs-csi-driver/helmrelease
cat > apps/base/aws-ebs-csi-driver/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - aws-ebs-csi-driver.yaml
EOF

cat > apps/base/aws-ebs-csi-driver/aws-ebs-csi-driver.yaml << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: aws-ebs-csi-driver
  namespace: kube-system
spec:
  interval: 5m0s
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  healthChecks:
    - apiVersion: helm.toolkit.fluxcd.io/v1beta1
      kind: HelmRelease
      name: aws-ebs-csi-driver
      namespace: kube-system
  path: "./apps/base/aws-ebs-csi-driver/helmrelease"
  prune: true
  validation: client
EOF

cat > apps/base/aws-ebs-csi-driver/helmrelease/aws-ebs-csi-driver.yaml << EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
# | aws-ebs-csi-driver | https://kubernetes-sigs.github.io/aws-ebs-csi-driver | aws-ebs-csi-driver | 2.1.0
metadata:
  name: aws-ebs-csi-driver
  namespace: kube-system
spec:
  releaseName: aws-ebs-csi-driver
  chart:
    spec:
      chart: aws-ebs-csi-driver
      sourceRef:
        kind: HelmRepository
        name: aws-ebs-csi-driver
        namespace: flux-system
      version: 2.1.0
  interval: 1h0m0s
  values:
    controller:
      extraVolumeTags:
        Cluster: ${CLUSTER_FQDN}
        $(echo "${TAGS}" | sed "s/ /\\n        /g; s/=/: /g")
      serviceAccount:
        create: false
        name: ebs-csi-controller-sa
    storageClasses:
    - name: gp3
      annotations:
        storageclass.kubernetes.io/is-default-class: "true"
      parameters:
        encrypted: "true"
EOF
```

### external-snapshotter

Details about EKS and `external-snapshotter` can be found here:
[Using EBS Snapshots for persistent storage with your EKS cluster](https://aws.amazon.com/blogs/containers/using-ebs-snapshots-for-persistent-storage-with-your-eks-cluster)

```bash
mkdir -vp apps/base/external-snapshotter
cat > apps/base/external-snapshotter/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/v4.2.1/client/config/crd/snapshot.storage.k8s.io_volumesnapshotclasses.yaml
  - https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/v4.2.1/client/config/crd/snapshot.storage.k8s.io_volumesnapshotcontents.yaml
  - https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/v4.2.1/client/config/crd/snapshot.storage.k8s.io_volumesnapshots.yaml
  - https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/v4.2.1/deploy/kubernetes/snapshot-controller/rbac-snapshot-controller.yaml
  - https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/v4.2.1/deploy/kubernetes/snapshot-controller/setup-snapshot-controller.yaml
EOF
```

### Kubernetes Metrics Server

[Kubernetes Metrics Server](https://kubernetes.io/docs/tasks/debug-application-cluster/resource-metrics-pipeline/)

* [metrics-server](https://artifacthub.io/packages/helm/bitnami/metrics-server)
* [default values.yaml](https://github.com/bitnami/charts/blob/master/bitnami/metrics-server/values.yaml):

```bash
mkdir -vp apps/base/metrics-server
cat > apps/base/metrics-server/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace.yaml
  - metrics-server.yaml
EOF

cat > apps/base/metrics-server/namespace.yaml << EOF
apiVersion: v1
kind: Namespace
metadata:
  name: metrics-server
EOF

cat > apps/base/metrics-server/metrics-server.yaml << EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
# | bitnami | https://charts.bitnami.com/bitnami | metrics-server | 5.9.2
metadata:
  name: metrics-server
  namespace: metrics-server
spec:
  releaseName: metrics-server
  chart:
    spec:
      chart: metrics-server
      sourceRef:
        kind: HelmRepository
        name: bitnami
        namespace: flux-system
      version: 5.9.3
  interval: 1h0m0s
  values:
    apiService:
      create: true
EOF
```

## Apps dev group

Create application group called `dev` which will contain all the
`HelmRepository` and `HelmRelease` used by this group.

```bash
mkdir -vp apps/${ENVIRONMENT}/helmrepository
cat > apps/${ENVIRONMENT}/helmrepository/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../helmrepository/eks
  - ../../helmrepository/aws-ebs-csi-driver
  - ../../helmrepository/aws-efs-csi-driver
  - ../../helmrepository/bitnami
EOF

mkdir -vp apps/${ENVIRONMENT}/base
cat > apps/${ENVIRONMENT}/base/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../base/aws-load-balancer-controller
  - ../../base/aws-efs-csi-driver
  - ../../base/aws-ebs-csi-driver
  - ../../base/external-snapshotter
  - ../../base/metrics-server
patchesStrategicMerge:
  - helmrelease.yaml
EOF

cat > apps/${ENVIRONMENT}/base/helmrelease.yaml << EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: metrics-server
  namespace: metrics-server
spec:
  chart:
    spec:
      version: 5.9.2
EOF
```

## Clusters

It is necessary to split `HelmRepository` and `HelmRelease`, otherwise there
are many errors in flux logs. `HelmRepository` should be always installed
before `HelmRelease` using `dependsOn`.

```bash
mkdir -pv clusters/${ENVIRONMENT}/${CLUSTER_FQDN}
cat > clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/apps-helmrepository.yaml << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: apps-helmrepository
  namespace: flux-system
spec:
  interval: 5m0s
  sourceRef:
    kind: GitRepository
    name: flux-system
  path: "./apps/${ENVIRONMENT}/helmrepository"
  prune: true
  validation: client
EOF

cat > clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/apps-base.yaml << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: apps-base
  namespace: flux-system
spec:
  interval: 5m0s
  dependsOn:
    - name: apps-helmrepository
  sourceRef:
    kind: GitRepository
    name: flux-system
  path: "./apps/${ENVIRONMENT}/base"
  prune: true
  validation: client
  patchesStrategicMerge:
    - apiVersion: helm.toolkit.fluxcd.io/v2beta1
      kind: HelmRelease
      metadata:
        name: metrics-server
        namespace: metrics-server
      spec:
        chart:
          spec:
            version: 5.9.1
EOF
```

## Flux

Set `user.name` and `user.email` for git:

```bash
git config user.name || git config --global user.name "My Name"
git config user.email || git config --global user.email "you@example.com"
```

Commit changes to git repository and "refresh" flux:

```bash
git add .
git commit -m "Initial applications commit" || true
git push
flux reconcile source git flux-system
```

Go back to the main directory:

```bash
cd -
```

Check Flux errors:

```bash
kubectl wait -A --for=condition=Ready --timeout=20m kustomizations.kustomize.toolkit.fluxcd.io --all
kubectl wait -A --for=condition=Ready --timeout=20m helmreleases.helm.toolkit.fluxcd.io --all
flux logs --level=error --all-namespaces
```

Check `helmreleases`, `helmrepositories`, `kustomizations`, ...

```bash
kubectl get pods -A
kubectl get helmreleases.helm.toolkit.fluxcd.io -A
kubectl get helmrepositories.source.toolkit.fluxcd.io -A
kubectl get kustomizations.kustomize.toolkit.fluxcd.io -A
helm ls -A
```

Export command for kubeconfig:

```bash
echo 'export KUBECONFIG="$PWD/tmp/kube2.k8s.mylabs.dev/kubeconfig-kube2.conf"'
```
