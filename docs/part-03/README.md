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
mkdir -vp "tmp/${CLUSTER_FQDN}/${GITHUB_FLUX_REPOSITORY}/clusters/{prd/{k01,k02},dev/{k03,k04},mygroup/{k05,k06}}"
mkdir -vp "tmp/${CLUSTER_FQDN}/${GITHUB_FLUX_REPOSITORY}/apps/{base,helmrepository,prd,dev,mygroup}"
```

Set `user.name` and `user.email` for git:

```bash
git config user.name || git config --global user.name "${GITHUB_USER}"
git config user.email || git config --global user.email "${MY_EMAIL}"
```

Go to the "git directory":

```bash
cd "tmp/${CLUSTER_FQDN}/${GITHUB_FLUX_REPOSITORY}" || exit
```

## Manage Kubernetes secrets with Mozilla SOPS and Amazon Secret Manager

Configure the Git directory for encryption:

```bash
cat > .sops.yaml << EOF
creation_rules:
  - path_regex: .*.yaml
    encrypted_regex: ^(data|stringData|slack_api_url)$
    kms: ${AWS_KMS_KEY_ARN}
EOF
```

Add SOPS configuration to git repository and sync it with Flux:

```bash
if ! grep -q 'gotk-patches.yaml' "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/flux-system/kustomization.yaml" ; then
  cat >> "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/flux-system/kustomization.yaml" << EOF
patchesStrategicMerge:
- gotk-patches.yaml
EOF

  cat > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/flux-system/gotk-patches.yaml" << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: flux-system
  namespace: flux-system
spec:
  decryption:
    provider: sops
EOF

  git add .sops.yaml "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/flux-system"
  git commit -m "Add SOPS configuration"
  git push
  flux reconcile source git flux-system
fi
```

## HelmRepository

Create `HelmRepository` definitions...

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

### jetstack

```bash
mkdir -vp apps/helmrepository/jetstack
cat > apps/helmrepository/jetstack/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - jetstack.yaml
EOF

cat > apps/helmrepository/jetstack/jetstack.yaml << EOF
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: HelmRepository
metadata:
  name: jetstack
  namespace: flux-system
spec:
  interval: 1h
  url: https://charts.jetstack.io
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
  interval: 5m
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
# | eks | https://aws.github.io/eks-charts | aws-load-balancer-controller | 1.2.7
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
mkdir -vp apps/base/aws-efs-csi-driver/{helmrelease,persistentvolume}
cat > apps/base/aws-efs-csi-driver/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - aws-efs-csi-driver.yaml
  - aws-efs-csi-driver-persistentvolume.yaml
EOF

cat > apps/base/aws-efs-csi-driver/aws-efs-csi-driver.yaml << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: aws-efs-csi-driver
  namespace: kube-system
spec:
  interval: 5m
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
cat > apps/base/aws-efs-csi-driver/aws-efs-csi-driver-persistentvolume.yaml << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: aws-efs-csi-driver-persistentvolume
  namespace: kube-system
spec:
  interval: 5m
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
  path: "./apps/base/aws-efs-csi-driver/persistentvolume"
  prune: true
  validation: client
EOF

cat > apps/base/aws-efs-csi-driver/persistentvolume/pv.yaml << EOF
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
  interval: 5m
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
        Name: ${GITHUB_USER}-${CLUSTER_NAME}
        Cluster: ${CLUSTER_FQDN}
        $(echo "${TAGS}" | sed "s/ /\\n        /g; s/=/: /g")
      k8sTagClusterId: ${CLUSTER_FQDN}
      serviceAccount:
        create: false
        name: ebs-csi-controller-sa
    storageClasses:
    - name: gp3
      annotations:
        storageclass.kubernetes.io/is-default-class: "true"
      parameters:
        encrypted: "true"
        # kmsKeyId: "${AWS_KMS_KEY_ARN}" - not working
EOF
```

### external-snapshotter

Details about EKS and `external-snapshotter` can be found here:
[Using EBS Snapshots for persistent storage with your EKS cluster](https://aws.amazon.com/blogs/containers/using-ebs-snapshots-for-persistent-storage-with-your-eks-cluster)

```bash
mkdir -vp apps/base/external-snapshotter/install
cat > apps/base/external-snapshotter/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - external-snapshotter.yaml
EOF

cat > apps/base/external-snapshotter/external-snapshotter.yaml << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: external-snapshotter
  namespace: kube-system
spec:
  interval: 5m
  dependsOn:
    - name: aws-ebs-csi-driver
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  healthChecks:
    - apiVersion: apps/v1
      kind: Deployment
      name: snapshot-controller
      namespace: kube-system
  path: "./apps/base/external-snapshotter/install"
  prune: true
  validation: client
EOF

cat > apps/base/external-snapshotter/install/kustomization.yaml << EOF
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
mkdir -vp apps/base/metrics-server/helmrelease
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
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: metrics-server
  namespace: metrics-server
spec:
  interval: 5m
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  healthChecks:
    - apiVersion: helm.toolkit.fluxcd.io/v1beta1
      kind: HelmRelease
      name: metrics-server
      namespace: metrics-server
  path: "./apps/base/metrics-server/helmrelease"
  prune: true
  validation: client
EOF

cat > apps/base/metrics-server/helmrelease/metrics-server.yaml << EOF
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

### kube-prometheus-stack

[kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack)

* [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack)
* [default values.yaml](https://github.com/prometheus-community/helm-charts/blob/main/charts/kube-prometheus-stack/values.yaml):

```bash
mkdir -vp apps/base/kube-prometheus-stack/helmrelease
cat > apps/base/kube-prometheus-stack/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace.yaml
  - kube-prometheus-stack.yaml
EOF

cat > apps/base/kube-prometheus-stack/namespace.yaml << EOF
apiVersion: v1
kind: Namespace
metadata:
  name: kube-prometheus-stack
EOF

cat > apps/base/kube-prometheus-stack/kube-prometheus-stack.yaml << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: kube-prometheus-stack
  namespace: kube-prometheus-stack
spec:
  interval: 5m
  dependsOn:
    - name: aws-ebs-csi-driver
      namespace: kube-system
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  healthChecks:
    - apiVersion: helm.toolkit.fluxcd.io/v1beta1
      kind: HelmRelease
      name: kube-prometheus-stack
      namespace: kube-prometheus-stack
  path: "./apps/base/kube-prometheus-stack/helmrelease"
  prune: true
  validation: client
EOF

cat > apps/base/kube-prometheus-stack/helmrelease/kube-prometheus-stack.yaml << EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
# | prometheus-community | https://prometheus-community.github.io/helm-charts | kube-prometheus-stack | 18.0.3
metadata:
  name: kube-prometheus-stack
  namespace: kube-prometheus-stack
spec:
  releaseName: kube-prometheus-stack
  chart:
    spec:
      chart: kube-prometheus-stack
      sourceRef:
        kind: HelmRepository
        name: prometheus-community
        namespace: flux-system
      version: 18.0.3
  interval: 1h0m0s
  values:
    defaultRules:
      rules:
        etcd: false
        kubernetesSystem: false
        kubeScheduler: false
    additionalPrometheusRulesMap:
      # Flux rule: https://toolkit.fluxcd.io/guides/monitoring/
      rule-name:
        groups:
        - name: GitOpsToolkit
          rules:
          - alert: ReconciliationFailure
            expr: max(gotk_reconcile_condition{status="False",type="Ready"}) by (namespace, name, kind) + on(namespace, name, kind) (max(gotk_reconcile_condition{status="Deleted"}) by (namespace, name, kind)) * 2 == 1
            for: 10m
            labels:
              severity: page
            annotations:
              summary: "{{ \$labels.kind }} {{ \$labels.namespace }}/{{ \$labels.name }} reconciliation has been failing for more than ten minutes."
    alertmanager:
      config:
        global:
          slack_api_url: "SLACK_INCOMING_WEBHOOK_URL - secret must be overridden from cluster level"
          smtp_smarthost: "mailhog.mailhog.svc.cluster.local:1025"
          smtp_from: "alertmanager@${CLUSTER_FQDN}"
        route:
          group_by: ["alertname", "job"]
          receiver: slack-notifications
          routes:
            - match:
                severity: warning
              continue: true
              receiver: slack-notifications
            - match:
                severity: warning
              receiver: email-notifications
        receivers:
          - name: "email-notifications"
            email_configs:
            - to: "notification@${CLUSTER_FQDN}"
              require_tls: false
          - name: "slack-notifications"
            slack_configs:
              - channel: "#SLACK_CHANNEL - secret must be overridden from cluster level"
                send_resolved: True
                icon_url: "https://avatars3.githubusercontent.com/u/3380462"
                title: "{{ template \"slack.cp.title\" . }}"
                text: "{{ template \"slack.cp.text\" . }}"
                footer: "https://${CLUSTER_FQDN}"
                actions:
                  - type: button
                    text: "Runbook :blue_book:"
                    url: "{{ (index .Alerts 0).Annotations.runbook_url }}"
                  - type: button
                    text: "Query :mag:"
                    url: "{{ (index .Alerts 0).GeneratorURL }}"
                  - type: button
                    text: "Silence :no_bell:"
                    url: "{{ template \"__alert_silence_link\" . }}"
        templates:
          - "/etc/alertmanager/config/cp-slack-templates.tmpl"
      templateFiles:
        cp-slack-templates.tmpl: |-
          {{ define "slack.cp.title" -}}
            [{{ .Status | toUpper -}}
            {{ if eq .Status "firing" }}:{{ .Alerts.Firing | len }}{{- end -}}
            ] {{ template "__alert_severity_prefix_title" . }} {{ .CommonLabels.alertname }}
          {{- end }}
          {{/* The test to display in the alert */}}
          {{ define "slack.cp.text" -}}
            {{ range .Alerts }}
                *Alert:* {{ .Annotations.message}}
                *Details:*
                {{ range .Labels.SortedPairs }} - *{{ .Name }}:* \`{{ .Value }}\`
                {{ end }}
                *-----*
              {{ end }}
          {{- end }}
          {{ define "__alert_silence_link" -}}
            {{ .ExternalURL }}/#/silences/new?filter=%7B
            {{- range .CommonLabels.SortedPairs -}}
              {{- if ne .Name "alertname" -}}
                {{- .Name }}%3D"{{- .Value -}}"%2C%20
              {{- end -}}
            {{- end -}}
              alertname%3D"{{ .CommonLabels.alertname }}"%7D
          {{- end }}
          {{ define "__alert_severity_prefix" -}}
              {{ if ne .Status "firing" -}}
              :white_check_mark:
              {{- else if eq .Labels.severity "critical" -}}
              :fire:
              {{- else if eq .Labels.severity "warning" -}}
              :warning:
              {{- else -}}
              :question:
              {{- end }}
          {{- end }}
          {{ define "__alert_severity_prefix_title" -}}
              {{ if ne .Status "firing" -}}
              :white_check_mark:
              {{- else if eq .CommonLabels.severity "critical" -}}
              :fire:
              {{- else if eq .CommonLabels.severity "warning" -}}
              :warning:
              {{- else if eq .CommonLabels.severity "info" -}}
              :information_source:
              {{- else if eq .CommonLabels.status_icon "information" -}}
              :information_source:
              {{- else -}}
              :question:
              {{- end }}
          {{- end }}
      ingress:
        enabled: true
        annotations:
          nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/auth
          nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/start?rd=\$scheme://\$host\$request_uri
        hosts:
          - alertmanager.${CLUSTER_FQDN}
        paths: ["/"]
        pathType: ImplementationSpecific
        tls:
          - secretName: ingress-cert-${LETSENCRYPT_ENVIRONMENT}
            hosts:
              - alertmanager.${CLUSTER_FQDN}
    # https://github.com/grafana/helm-charts/blob/main/charts/grafana/values.yaml
    grafana:
      serviceAccount:
        create: false
        name: grafana
      ingress:
        enabled: true
        annotations:
          nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/auth
          nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/start?rd=\$scheme://\$host\$request_uri
        hosts:
          - grafana.${CLUSTER_FQDN}
        paths: ["/"]
        pathType: ImplementationSpecific
        tls:
          - secretName: ingress-cert-${LETSENCRYPT_ENVIRONMENT}
            hosts:
              - grafana.${CLUSTER_FQDN}
      plugins:
        - digiapulssi-breadcrumb-panel
        - grafana-piechart-panel
        # Needed for MySQL Instances Overview -> Table Openings details
        - grafana-polystat-panel
      env:
        GF_AUTH_SIGV4_AUTH_ENABLED: true
      datasources:
        datasources.yaml:
          apiVersion: 1
          datasources:
          - name: Loki
            type: loki
            access: proxy
            url: http://loki.loki:3100
          - name: CloudWatch
            type: cloudwatch
            jsonData:
              defaultRegion: ${AWS_DEFAULT_REGION}
      dashboardProviders:
        dashboardproviders.yaml:
          apiVersion: 1
          providers:
            - name: "default"
              orgId: 1
              folder: ""
              type: file
              disableDeletion: false
              editable: true
              options:
                path: /var/lib/grafana/dashboards/default
      dashboards:
        default:
          k8s-cluster-summary:
            gnetId: 8685
            revision: 1
            datasource: Prometheus
          node-exporter-full:
            gnetId: 1860
            revision: 21
            datasource: Prometheus
          prometheus-2-0-overview:
            gnetId: 3662
            revision: 2
            datasource: Prometheus
          stians-disk-graphs:
            gnetId: 9852
            revision: 1
            datasource: Prometheus
          kubernetes-apiserver:
            gnetId: 12006
            revision: 1
            datasource: Prometheus
          ingress-nginx:
            gnetId: 9614
            revision: 1
            datasource: Prometheus
          ingress-nginx2:
            gnetId: 11875
            revision: 1
            datasource: Prometheus
          istio-mesh:
            gnetId: 7639
            revision: 54
            datasource: Prometheus
          istio-performance:
            gnetId: 11829
            revision: 54
            datasource: Prometheus
          istio-service:
            gnetId: 7636
            revision: 54
            datasource: Prometheus
          istio-workload:
            gnetId: 7630
            revision: 54
            datasource: Prometheus
          istio-control-plane:
            gnetId: 7645
            revision: 54
            datasource: Prometheus
          velero-stats:
            gnetId: 11055
            revision: 2
            datasource: Prometheus
          jaeger:
            gnetId: 10001
            revision: 2
            datasource: Prometheus
          loki-promtail:
            gnetId: 10880
            revision: 1
            datasource: Prometheus
          # https://github.com/fluxcd/flux2/blob/main/manifests/monitoring/grafana/dashboards/cluster.json
          gitops-toolkit-control-plane:
            url: https://raw.githubusercontent.com/fluxcd/flux2/9916a5376123b4bcdc0f11999a8f8781ce5ee78c/manifests/monitoring/grafana/dashboards/control-plane.json
            datasource: Prometheus
          gitops-toolkit-cluster:
            url: https://raw.githubusercontent.com/fluxcd/flux2/344a909d19498f1f02b936882b529d84bbd460b8/manifests/monitoring/grafana/dashboards/cluster.json
            datasource: Prometheus
          kyverno-cluster-policy-report:
            gnetId: 13996
            revision: 3
            datasource: Prometheus
          kyverno-policy-report:
            gnetId: 13995
            revision: 3
            datasource: Prometheus
          kyverno-policy-reports:
            gnetId: 13968
            revision: 1
            datasource: Prometheus
          harbor:
            gnetId: 14075
            revision: 2
            datasource: Prometheus
          aws-efs:
            gnetId: 653
            revision: 4
            datasource: CloudWatch
          amazon-rds-os-metrics:
            gnetId: 702
            revision: 1
            datasource: CloudWatch
          aws-rds:
            gnetId: 707
            revision: 5
            datasource: CloudWatch
          aws-rds-opt:
            gnetId: 11698
            revision: 1
            datasource: CloudWatch
          aws-ec2:
            gnetId: 617
            revision: 4
            datasource: CloudWatch
          aws-network-load-balancer:
            gnetId: 12111
            revision: 2
            datasource: CloudWatch
          aws-ebs:
            gnetId: 623
            revision: 4
            datasource: CloudWatch
          CPU_Utilization_Details:
            url: https://raw.githubusercontent.com/percona/grafana-dashboards/1316f80e834f9a3617e196b41617299c13d62421/dashboards/CPU_Utilization_Details.json
            datasource: Prometheus
          Disk_Details:
            url: https://raw.githubusercontent.com/percona/grafana-dashboards/1316f80e834f9a3617e196b41617299c13d62421/dashboards/Disk_Details.json
            datasource: Prometheus
          Memory_Details:
            url: https://raw.githubusercontent.com/percona/grafana-dashboards/1316f80e834f9a3617e196b41617299c13d62421/dashboards/Memory_Details.json
            datasource: Prometheus
          MySQL_Command_Handler_Counters_Compare:
            url: https://raw.githubusercontent.com/percona/grafana-dashboards/1316f80e834f9a3617e196b41617299c13d62421/dashboards/MySQL_Command_Handler_Counters_Compare.json
            datasource: Prometheus
          MySQL_InnoDB_Compression_Details:
            url: https://raw.githubusercontent.com/percona/grafana-dashboards/1316f80e834f9a3617e196b41617299c13d62421/dashboards/MySQL_InnoDB_Compression_Details.json
            datasource: Prometheus
          MySQL_InnoDB_Details:
            url: https://raw.githubusercontent.com/percona/grafana-dashboards/1316f80e834f9a3617e196b41617299c13d62421/dashboards/MySQL_InnoDB_Details.json
            datasource: Prometheus
          MySQL_Instance_Summary:
            url: https://raw.githubusercontent.com/percona/grafana-dashboards/1316f80e834f9a3617e196b41617299c13d62421/dashboards/MySQL_Instance_Summary.json
            datasource: Prometheus
          MySQL_Instances_Compare:
            url: https://raw.githubusercontent.com/percona/grafana-dashboards/1316f80e834f9a3617e196b41617299c13d62421/dashboards/MySQL_Instances_Compare.json
            datasource: Prometheus
          MySQL_Instances_Overview:
            url: https://raw.githubusercontent.com/percona/grafana-dashboards/1316f80e834f9a3617e196b41617299c13d62421/dashboards/MySQL_Instances_Overview.json
            datasource: Prometheus
          MySQL_MyISAM_Aria_Details:
            url: https://raw.githubusercontent.com/percona/grafana-dashboards/1316f80e834f9a3617e196b41617299c13d62421/dashboards/MySQL_MyISAM_Aria_Details.json
            datasource: Prometheus
          Network_Details:
            url: https://raw.githubusercontent.com/percona/grafana-dashboards/1316f80e834f9a3617e196b41617299c13d62421/dashboards/Network_Details.json
            datasource: Prometheus
          Nodes_Compare:
            url: https://raw.githubusercontent.com/percona/grafana-dashboards/1316f80e834f9a3617e196b41617299c13d62421/dashboards/Nodes_Compare.json
            datasource: Prometheus
          Nodes_Overview:
            url: https://raw.githubusercontent.com/percona/grafana-dashboards/1316f80e834f9a3617e196b41617299c13d62421/dashboards/Nodes_Overview.json
            datasource: Prometheus
          Prometheus_Exporters_Overview:
            url: https://raw.githubusercontent.com/percona/grafana-dashboards/1316f80e834f9a3617e196b41617299c13d62421/dashboards/Prometheus_Exporters_Overview.json
            datasource: Prometheus
      grafana.ini:
        server:
          root_url: https://grafana.${CLUSTER_FQDN}
        # Using oauth2-proxy instead of default Grafana Oauth
        auth.anonymous:
          enabled: true
          org_role: Admin
      smtp:
        enabled: true
        host: "mailhog.mailhog.svc.cluster.local:1025"
        from_address: grafana@${CLUSTER_FQDN}
    kubeControllerManager:
      enabled: false
    kubeEtcd:
      enabled: false
    kubeScheduler:
      enabled: false
    kubeProxy:
      enabled: false
    prometheusOperator:
      tls:
        enabled: false
      admissionWebhooks:
        enabled: false
    prometheus:
      serviceAccount:
        create: false
        name: kube-prometheus-stack-prometheus
      ingress:
        enabled: true
        annotations:
          nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/auth
          nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/start?rd=\$scheme://\$host\$request_uri
        paths: ["/"]
        pathType: ImplementationSpecific
        hosts:
          - prometheus.${CLUSTER_FQDN}
        tls:
          - secretName: ingress-cert-${LETSENCRYPT_ENVIRONMENT}
            hosts:
              - prometheus.${CLUSTER_FQDN}
      prometheusSpec:
        externalUrl: https://prometheus.${CLUSTER_FQDN}
        # ruleSelectorNilUsesHelmValues: false
        # serviceMonitorSelectorNilUsesHelmValues: false
        # podMonitorSelectorNilUsesHelmValues: false
        retention: 7d
        retentionSize: 1GB
        walCompression: true
        storageSpec:
          volumeClaimTemplate:
            spec:
              storageClassName: gp3
              accessModes: ["ReadWriteOnce"]
              resources:
                requests:
                  storage: 1Gi
EOF
```

### cert-manager

[cert-manager](https://cert-manager.io/)

* [cert-manager](https://artifacthub.io/packages/helm/jetstack/cert-manager)
* [default values.yaml](https://github.com/jetstack/cert-manager/blob/master/deploy/charts/cert-manager/values.yaml):

```bash
mkdir -vp apps/base/cert-manager/{helmrelease,clusterissuer,certificate}
cat > apps/base/cert-manager/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - cert-manager.yaml
  - cert-manager-clusterissuer.yaml
  - cert-manager-certificate.yaml
EOF

cat > apps/base/cert-manager/cert-manager.yaml << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: cert-manager
  namespace: cert-manager
spec:
  interval: 5m
  dependsOn:
    - name: kube-prometheus-stack
      namespace: kube-prometheus-stack
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  healthChecks:
    - apiVersion: helm.toolkit.fluxcd.io/v1beta1
      kind: HelmRelease
      name: cert-manager
      namespace: cert-manager
  path: "./apps/base/cert-manager/helmrelease"
  prune: true
  validation: client
EOF

cat > apps/base/cert-manager/helmrelease/cert-manager.yaml << EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
# | jetstack | https://charts.jetstack.io | cert-manager | v1.5.3
metadata:
  name: cert-manager
  namespace: cert-manager
spec:
  releaseName: cert-manager
  chart:
    spec:
      chart: cert-manager
      sourceRef:
        kind: HelmRepository
        name: jetstack
        namespace: flux-system
      version: v1.5.3
  interval: 1h0m0s
  install:
    crds: Create
  upgrade:
    crds: CreateReplace
  values:
    installCRDs: true
    serviceAccount:
      create: false
      name: cert-manager
    extraArgs:
      - --enable-certificate-owner-ref=true
    prometheus:
      servicemonitor:
        enabled: true
EOF
```

Add ClusterIssuers for Let's Encrypt staging and production:

```bash
cat > apps/base/cert-manager/cert-manager-clusterissuer.yaml << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: cert-manager-clusterissuer
  namespace: cert-manager
spec:
  interval: 5m
  dependsOn:
    - name: cert-manager
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  healthChecks:
    - apiVersion: cert-manager.io/v1
      kind: ClusterIssuer
      name: letsencrypt-staging-dns
    - apiVersion: cert-manager.io/v1
      kind: ClusterIssuer
      name: letsencrypt-production-dns
  path: "./apps/base/cert-manager/clusterissuer"
  prune: true
  validation: client
EOF

cat > apps/base/cert-manager/clusterissuer/clusterissuer.yaml << EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging-dns
  namespace: cert-manager
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: ${MY_EMAIL}
    privateKeySecretRef:
      name: letsencrypt-staging-dns
    solvers:
      - selector:
          dnsZones:
            - ${CLUSTER_FQDN}
        dns01:
          route53:
            region: ${AWS_DEFAULT_REGION}
---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-production-dns
  namespace: cert-manager
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: ${MY_EMAIL}
    privateKeySecretRef:
      name: letsencrypt-production-dns
    solvers:
      - selector:
          dnsZones:
            - ${CLUSTER_FQDN}
        dns01:
          route53:
            region: ${AWS_DEFAULT_REGION}
EOF
```

Create wildcard certificate using `cert-manager`:

```bash
cat > apps/base/cert-manager/cert-manager-certificate.yaml << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: cert-manager-certificate
  namespace: cert-manager
spec:
  interval: 5m
  dependsOn:
    - name: cert-manager-clusterissuer
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  healthChecks:
    - apiVersion: cert-manager.io/v1
      kind: Certificate
      name: ingress-cert-${LETSENCRYPT_ENVIRONMENT}
      namespace: cert-manager
  path: "./apps/base/cert-manager/certificate"
  prune: true
  validation: client
EOF

cat > apps/base/cert-manager/certificate/certificate.yaml << EOF
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: ingress-cert-${LETSENCRYPT_ENVIRONMENT}
  namespace: cert-manager
spec:
  secretName: ingress-cert-${LETSENCRYPT_ENVIRONMENT}
  secretTemplate:
    annotations:
      kubed.appscode.com/sync: ""
  issuerRef:
    name: letsencrypt-${LETSENCRYPT_ENVIRONMENT}-dns
    kind: ClusterIssuer
  commonName: "*.${CLUSTER_FQDN}"
  dnsNames:
    - "*.${CLUSTER_FQDN}"
    - "${CLUSTER_FQDN}"
EOF
```

## Apps dev group

Create application group called `dev` which will contain all the
`HelmRepository` and `HelmRelease` used by this group.

```bash
mkdir -vp "apps/${ENVIRONMENT}/helmrepository"
cat > "apps/${ENVIRONMENT}/helmrepository/kustomization.yaml" << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../helmrepository/eks
  - ../../helmrepository/aws-ebs-csi-driver
  - ../../helmrepository/aws-efs-csi-driver
  - ../../helmrepository/bitnami
  - ../../helmrepository/prometheus-community
  - ../../helmrepository/jetstack
EOF

mkdir -vp "apps/${ENVIRONMENT}/base"
cat > "apps/${ENVIRONMENT}/base/kustomization.yaml" << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../base/aws-load-balancer-controller
  - ../../base/aws-efs-csi-driver
  - ../../base/aws-ebs-csi-driver
  - ../../base/external-snapshotter
  - ../../base/metrics-server
  - ../../base/kube-prometheus-stack
  - ../../base/cert-manager
patchesStrategicMerge:
  - patches.yaml
EOF

cat > "apps/${ENVIRONMENT}/base/patches.yaml" << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: metrics-server
  namespace: metrics-server
spec:
  patchesStrategicMerge:
    - apiVersion: helm.toolkit.fluxcd.io/v2beta1
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
mkdir -pv "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}"
cat > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/apps-helmrepository.yaml" << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: apps-helmrepository
  namespace: flux-system
spec:
  interval: 5m
  sourceRef:
    kind: GitRepository
    name: flux-system
  path: "./apps/${ENVIRONMENT}/helmrepository"
  prune: true
  validation: client
EOF

cat > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/apps-base.yaml" << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: apps-base
  namespace: flux-system
spec:
  interval: 5m
  dependsOn:
    - name: apps-helmrepository
  sourceRef:
    kind: GitRepository
    name: flux-system
  path: "./apps/${ENVIRONMENT}/base"
  prune: true
  validation: client
  patchesStrategicMerge:
    - apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
      kind: Kustomization
      metadata:
        name: metrics-server
        namespace: metrics-server
      spec:
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
    - apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
      kind: Kustomization
      metadata:
        name: kube-prometheus-stack
        namespace: kube-prometheus-stack
      spec:
        patchesStrategicMerge:
          - apiVersion: helm.toolkit.fluxcd.io/v2beta1
            kind: HelmRelease
            metadata:
              name: kube-prometheus-stack
              namespace: kube-prometheus-stack
            spec:
              chart:
                spec:
                  version: 18.0.3
              values:
                alertmanager:
                  config:
                    global:
                      slack_api_url: ${SLACK_INCOMING_WEBHOOK_URL}
EOF

sops --encrypt --in-place "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/apps-base.yaml"
```

## Flux

Commit changes to git repository and "refresh" flux:

```bash
git add .
git commit -m "Initial applications commit" || true
git push
flux reconcile source git flux-system
```

Go back to the main directory:

```bash
cd - || exit
```

Check Flux errors:

```bash
flux logs --level=error --all-namespaces
```

Check `helmreleases`, `helmrepositories`, `kustomizations`, ...

```shell
kubectl get pods -A
kubectl get helmreleases.helm.toolkit.fluxcd.io -A
kubectl get helmrepositories.source.toolkit.fluxcd.io -A
kubectl get kustomizations.kustomize.toolkit.fluxcd.io -A
helm ls -A
```

Export command for kubeconfig:

```bash
echo "export KUBECONFIG=\"\${PWD}/tmp/${CLUSTER_FQDN}/kubeconfig-${CLUSTER_NAME}.conf\""
```
