# Applications

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
mkdir -vp tmp/${CLUSTER_FQDN}/${GITHUB_FLUX_REPOSITORY}/apps/{helmrelease,helmrepository,prd,dev,mygroup}
cd tmp/${CLUSTER_FQDN}/${GITHUB_FLUX_REPOSITORY}/
```

## HelmRepository

Create `HelmRepository` definitions

### crossplane-stable

```bash
mkdir -vp apps/helmrepository/crossplane-stable
cat > apps/helmrepository/crossplane-stable/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - crossplane-stable.yaml
EOF

cat > apps/helmrepository/crossplane-stable/crossplane-stable.yaml << EOF
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: HelmRepository
metadata:
  name: crossplane-stable
  namespace: flux-system
spec:
  interval: 1h
  url: https://charts.crossplane.io/stable
EOF
```

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

## HelmReleases

Create `HelmReleases` definitions:

### Crossplane

```bash
mkdir -vp apps/helmrelease/crossplane
cat > apps/helmrelease/crossplane/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace.yaml
  - crossplane.yaml
EOF

cat > apps/helmrelease/crossplane/namespace.yaml << EOF
apiVersion: v1
kind: Namespace
metadata:
  name: crossplane-system
EOF

cat > apps/helmrelease/crossplane/crossplane.yaml << EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: crossplane
  namespace: crossplane-system
spec:
  interval: 1m
  chart:
    spec:
      chart: crossplane
      version: 1.2.1
      sourceRef:
        kind: HelmRepository
        name: crossplane-stable
        namespace: flux-system
EOF
```

### AWS Load Balancer Controller

```bash
mkdir -vp apps/helmrelease/aws-load-balancer-controller
cat > apps/helmrelease/aws-load-balancer-controller/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace.yaml
  - aws-load-balancer-controller.yaml
EOF

cat > apps/helmrelease/aws-load-balancer-controller/namespace.yaml << EOF
apiVersion: v1
kind: Namespace
metadata:
  name: aws-load-balancer-controller
EOF

cat > apps/helmrelease/aws-load-balancer-controller/aws-load-balancer-controller.yaml << EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: aws-load-balancer-controller
  namespace: aws-load-balancer-controller
spec:
  releaseName: aws-load-balancer-controller
  chart:
    spec:
      chart: aws-load-balancer-controller
      sourceRef:
        kind: HelmRepository
        name: eks
        namespace: flux-system
      version: 1.2.6
  interval: 1h0m0s
  values:
    clusterName: ${CLUSTER_NAME}
    enableShield: false
    enableWaf: false
    enableWafv2: false
    defaultTags:
      $(echo "${TAGS}" | sed "s/ /\\n      /g; s/=/: /g")
EOF
```

### Amazon EFS CSI Driver

```bash
mkdir -vp apps/helmrelease/aws-efs-csi-driver
cat > apps/helmrelease/aws-efs-csi-driver/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace.yaml
  - aws-efs-csi-driver.yaml
EOF

cat > apps/helmrelease/aws-efs-csi-driver/namespace.yaml << EOF
apiVersion: v1
kind: Namespace
metadata:
  name: aws-efs-csi-driver
EOF

cat > apps/helmrelease/aws-efs-csi-driver/aws-efs-csi-driver.yaml << EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: aws-efs-csi-driver
  namespace: aws-efs-csi-driver
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
EOF
```

### Amazon Elastic Block Store (EBS) CSI driver

```bash
mkdir -vp apps/helmrelease/aws-ebs-csi-driver
cat > apps/helmrelease/aws-ebs-csi-driver/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace.yaml
  - aws-ebs-csi-driver.yaml
EOF

cat > apps/helmrelease/aws-ebs-csi-driver/namespace.yaml << EOF
apiVersion: v1
kind: Namespace
metadata:
  name: aws-ebs-csi-driver
EOF

cat > apps/helmrelease/aws-ebs-csi-driver/aws-ebs-csi-driver.yaml << EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: aws-ebs-csi-driver
  namespace: aws-ebs-csi-driver
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
    storageClasses:
    - name: gp3
      annotations:
        storageclass.kubernetes.io/is-default-class: "true"
      parameters:
        encrypted: "true"
EOF
```

### Kubernetes Metrics Server

```bash
mkdir -vp apps/helmrelease/metrics-server
cat > apps/helmrelease/metrics-server/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace.yaml
  - metrics-server.yaml
EOF

cat > apps/helmrelease/metrics-server/namespace.yaml << EOF
apiVersion: v1
kind: Namespace
metadata:
  name: metrics-server
EOF

cat > apps/helmrelease/metrics-server/metrics-server.yaml << EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
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
      version: 5.9.2
  interval: 1h0m0s
  values:
    apiService:
      create: true
EOF
```

### Prometheus Adapter for Kubernetes Metrics APIs

```bash
mkdir -vp apps/helmrelease/prometheus-adapter
cat > apps/helmrelease/prometheus-adapter/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace.yaml
  - prometheus-adapter.yaml
EOF

cat > apps/helmrelease/prometheus-adapter/namespace.yaml << EOF
apiVersion: v1
kind: Namespace
metadata:
  name: prometheus-adapter
EOF

cat > apps/helmrelease/prometheus-adapter/prometheus-adapter.yaml << EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: prometheus-adapter
  namespace: prometheus-adapter
spec:
  releaseName: prometheus-adapter
  chart:
    spec:
      chart: prometheus-adapter
      sourceRef:
        kind: HelmRepository
        name: prometheus-community
        namespace: flux-system
      version: 2.16.0
  interval: 1h0m0s
EOF
```

## Apps dev group

Create application group called `dev` which will contain all the
`HelmRepository` and `HelmRelease` used by this group.

```bash
mkdir -vp apps/dev/helmrepository
cat > apps/dev/helmrepository/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../helmrepository/crossplane-stable
  - ../../helmrepository/eks
  - ../../helmrepository/aws-ebs-csi-driver
  - ../../helmrepository/aws-efs-csi-driver
  - ../../helmrepository/bitnami
  - ../../helmrepository/prometheus-community
EOF

mkdir -vp apps/dev/helmrelease
cat > apps/dev/helmrelease/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../helmrelease/crossplane
  - ../../helmrelease/aws-load-balancer-controller
  - ../../helmrelease/aws-efs-csi-driver
  - ../../helmrelease/aws-ebs-csi-driver
  - ../../helmrelease/metrics-server
  - ../../helmrelease/prometheus-adapter
patchesStrategicMerge:
  - helmrelease.yaml
EOF

cat > apps/dev/helmrelease/helmrelease.yaml << EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: prometheus-adapter
  namespace: prometheus-adapter
spec:
  chart:
    spec:
      version: 2.15.2
EOF
```

## Clusters

It is necessary to split `HelmRepository` and `HelmRelease`, otherwise there
are many errors in flux logs. `HelmRepository` should be always installed
before `HelmRelease` using `dependsOn`.

```bash
mkdir -pv clusters/dev/${CLUSTER_FQDN}
cat > clusters/dev/${CLUSTER_FQDN}/apps-helmrepository.yaml << EOF
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
  path: "./apps/dev/helmrepository"
  prune: true
  validation: client
EOF

cat > clusters/dev/${CLUSTER_FQDN}/apps-helmrelease.yaml << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: apps-helmrelease
  namespace: flux-system
spec:
  interval: 5m0s
  dependsOn:
    - name: apps-helmrepository
  sourceRef:
    kind: GitRepository
    name: flux-system
  path: "./apps/dev/helmrelease"
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
git commit -m "Initial applications commit"
git push
flux reconcile source git flux-system
sleep 120
```

Check Flux errors:

```bash
flux logs --level=error --all-namespaces
```

Check `helmreleases`, `helmrepositories`, `kustomizations`, ...

```bash
kubectl get pods -A
kubectl get helmreleases.helm.toolkit.fluxcd.io -A
kubectl get helmrepositories.source.toolkit.fluxcd.io -A
kubectl get kustomizations.kustomize.toolkit.fluxcd.io -A
```
