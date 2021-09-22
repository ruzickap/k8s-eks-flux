# Base Applications

[[toc]]

Flux (dis)advantages:

* `dependsOn` can not be used between `HelmRelease` and `Kustomization`:
  [HelmRelease, Kustomization DependsOn](https://github.com/fluxcd/kustomize-controller/issues/242).
  Due to [https://github.com/fluxcd/flux2/discussions/730](https://github.com/fluxcd/flux2/discussions/730),
  [https://github.com/fluxcd/flux2/discussions/1010](https://github.com/fluxcd/flux2/discussions/1010)
  it is necessary to "pack" HelmRelease "inside" Kustomization to be able to do
  dependency using `dependsOn` later...
  This "forces" you to use `Kustomization` almost everywhere...
* [HelmReleases](https://fluxcd.io/docs/components/helm/helmreleases/) are
  compatible with Helm (`helm ls -A` works fine)
* [Variable substitution](https://fluxcd.io/docs/components/kustomize/kustomization/#variable-substitution)
  is really handy and easy to use in case you do not want to use too much [patches](https://fluxcd.io/docs/components/kustomize/kustomization/#variable-substitution)

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
mkdir -vp "tmp/${CLUSTER_FQDN}/${GITHUB_FLUX_REPOSITORY}"/clusters/{prd/{k01,k02},dev/{k03,k04},mygroup/{k05,k06}}
mkdir -vp "tmp/${CLUSTER_FQDN}/${GITHUB_FLUX_REPOSITORY}"/apps/{base,helmrepository,prd,dev,mygroup}
mkdir -vp "tmp/${CLUSTER_FQDN}/${GITHUB_FLUX_REPOSITORY}/apps/${ENVIRONMENT}"/{base,helmrepository}
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
    encrypted_regex: ^(substitute)$
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

```bash
declare -A HELMREPOSITORIES=(
  ["appscode"]="https://charts.appscode.com/stable/"
  ["aws-ebs-csi-driver"]="https://kubernetes-sigs.github.io/aws-ebs-csi-driver/"
  ["aws-efs-csi-driver"]="https://kubernetes-sigs.github.io/aws-efs-csi-driver/"
  ["bitnami"]="https://charts.bitnami.com/bitnami"
  ["codecentric"]="https://codecentric.github.io/helm-charts"
  ["crossplane-stable"]="https://charts.crossplane.io/stable"
  ["dex"]="https://charts.dexidp.io"
  ["ingress-nginx"]="https://kubernetes.github.io/ingress-nginx"
  ["jetstack"]="https://charts.jetstack.io"
  ["kyverno"]="https://kyverno.github.io/kyverno/"
  ["oauth2-proxy"]="https://oauth2-proxy.github.io/manifests"
  ["policy-reporter"]="https://kyverno.github.io/policy-reporter"
  ["prometheus-community"]="https://prometheus-community.github.io/helm-charts"
  ["rancher-latest"]="https://releases.rancher.com/server-charts/latest"
)

cat > apps/helmrepository/kustomization.yaml << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
EOF

for HELMREPOSITORY in "${!HELMREPOSITORIES[@]}"; do
  echo "${HELMREPOSITORY} : ${HELMREPOSITORIES[${HELMREPOSITORY}]}";
  mkdir -vp "apps/helmrepository/${HELMREPOSITORY}"
  yq e ".resources += [\"${HELMREPOSITORY}\"]" -i apps/helmrepository/kustomization.yaml
  cat > "apps/helmrepository/${HELMREPOSITORY}/kustomization.yaml" << EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ${HELMREPOSITORY}.yaml
EOF
  flux create source helm "${HELMREPOSITORY}" --url="${HELMREPOSITORIES[${HELMREPOSITORY}]}" --interval=1h --export > "apps/helmrepository/${HELMREPOSITORY}/${HELMREPOSITORY}.yaml"
done
```

## Clusters

It is necessary to split `HelmRepository` and `HelmRelease`, otherwise there
are many errors in flux logs. `HelmRepository` should be always installed
before `HelmRelease` using `dependsOn`.

```bash
mkdir -pv "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}"
flux create kustomization apps-helmrepository \
  --interval="10m" \
  --path="./apps/${ENVIRONMENT}/helmrepository" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --export > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/apps-helmrepository.yaml"

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
  postBuild:
    substitute:
      AWS_ACCOUNT_ID: "\"${AWS_ACCOUNT_ID:=AWS_ACCOUNT_ID}\""
      AWS_DEFAULT_REGION: ${AWS_DEFAULT_REGION:=AWS_DEFAULT_REGION}
      AWS_KMS_KEY_ARN: ${AWS_KMS_KEY_ARN:=AWS_KMS_KEY_ARN}
      CLUSTER_FQDN: ${CLUSTER_FQDN:=CLUSTER_FQDN}
      CLUSTER_NAME: ${CLUSTER_NAME:=CLUSTER_NAME}
      COOKIE_SECRET: ${COOKIE_SECRET:=COOKIE_SECRET}
      ENVIRONMENT: ${ENVIRONMENT:=ENVIRONMENT}
      LETSENCRYPT_ENVIRONMENT: ${LETSENCRYPT_ENVIRONMENT:=LETSENCRYPT_ENVIRONMENT}
      MY_EMAIL: ${MY_EMAIL:=MY_EMAIL}
      MY_GITHUB_ORG_NAME: ${MY_GITHUB_ORG_NAME:=MY_GITHUB_ORG_NAME}
      MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID: ${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID:=MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID}
      MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET: ${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET:=MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET}
      MY_GITHUB_WEBHOOK_TOKEN_BASE64: $(echo -n "${MY_GITHUB_WEBHOOK_TOKEN}" | base64 --wrap=0)
      MY_PASSWORD: ${MY_PASSWORD:=MY_PASSWORD}
      OKTA_CLIENT_ID: ${OKTA_CLIENT_ID:=OKTA_CLIENT_ID}
      OKTA_CLIENT_SECRET: ${OKTA_CLIENT_ID:=OKTA_CLIENT_ID}
      OKTA_ISSUER: ${OKTA_ISSUER:=OKTA_ISSUER}
      SLACK_CHANNEL: ${SLACK_CHANNEL:=SLACK_CHANNEL}
      SLACK_INCOMING_WEBHOOK_URL_BASE64: $(echo -n "${SLACK_INCOMING_WEBHOOK_URL}" | base64 --wrap=0)
      SLACK_INCOMING_WEBHOOK_URL: ${SLACK_INCOMING_WEBHOOK_URL:=SLACK_INCOMING_WEBHOOK_URL}
      TAGS_INGRESS_NGINX: ${TAGS// /,}
EOF

sops --encrypt --in-place "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/apps-base.yaml"
```

## Create initial Apps dev group definitions

Create `apps/${ENVIRONMENT}/base/kustomization.yaml` which will contain base
applications:

```bash
cat > "apps/${ENVIRONMENT}/base/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
EOF
```

Create application group called `dev` which will contain all the
`HelmRepository` and `HelmRelease` used by this group.

```bash
cat > "apps/${ENVIRONMENT}/helmrepository/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../helmrepository
EOF
```

## Base Applications definitions

### Amazon Elastic Block Store (EBS) CSI driver

[Amazon Elastic Block Store (EBS) CSI driver](https://github.com/kubernetes-sigs/aws-ebs-csi-driver)

* [aws-ebs-csi-driver](https://github.com/kubernetes-sigs/aws-ebs-csi-driver/tree/master/charts/aws-ebs-csi-driver)
* [default values.yaml](https://github.com/kubernetes-sigs/aws-ebs-csi-driver/blob/master/charts/aws-ebs-csi-driver/values.yaml):

```bash
mkdir -vp apps/base/aws-ebs-csi-driver/helmrelease
cat > apps/base/aws-ebs-csi-driver/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - aws-ebs-csi-driver.yaml
EOF

flux create kustomization aws-ebs-csi-driver \
  --interval="1h" \
  --path="./apps/base/aws-ebs-csi-driver/helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/aws-ebs-csi-driver.aws-ebs-csi-driver" \
  --export > apps/base/aws-ebs-csi-driver/aws-ebs-csi-driver.yaml

cat << \EOF |
controller:
  serviceAccount:
    create: false
    name: ebs-csi-controller-sa
EOF
flux create helmrelease aws-ebs-csi-driver \
  --namespace="aws-ebs-csi-driver" \
  --interval="10m" \
  --source="HelmRepository/aws-ebs-csi-driver.flux-system" \
  --chart="aws-ebs-csi-driver" \
  --chart-version="2.2.1" \
  --values="/dev/stdin" \
  --export > apps/base/aws-ebs-csi-driver/helmrelease/aws-ebs-csi-driver.yaml

mkdir -vp "apps/${ENVIRONMENT}/base/aws-ebs-csi-driver"
yq e '.resources += ["aws-ebs-csi-driver"]' -i "apps/${ENVIRONMENT}/base/kustomization.yaml"

cat > "apps/${ENVIRONMENT}/base/aws-ebs-csi-driver/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../../base/aws-ebs-csi-driver
patchesStrategicMerge:
  - kustomization-patch.yaml
EOF

cat > "apps/${ENVIRONMENT}/base/aws-ebs-csi-driver/kustomization-patch.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: aws-ebs-csi-driver
  namespace: flux-system
spec:
  patchesStrategicMerge:
    - apiVersion: helm.toolkit.fluxcd.io/v2beta1
      kind: HelmRelease
      metadata:
        name: aws-ebs-csi-driver
        namespace: aws-ebs-csi-driver
      spec:
        values:
          controller:
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
EOF
```

Change the tags on the Cluster level, because they will be different on every
cluster and it needs to be "set" form TAGS bash variable:

```bash
yq eval-all 'select(fileIndex == 0) *+ select(fileIndex == 1)' -i "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/apps-base.yaml" - << EOF
spec:
  patchesJson6902:
    - target:
        group: kustomize.toolkit.fluxcd.io
        kind: Kustomization
        name: aws-ebs-csi-driver
      patch:
        - op: add
          path: /spec/patchesStrategicMerge/0/spec/values/controller/extraVolumeTags
          value:
            Name: ${GITHUB_USER}-${CLUSTER_NAME}
            Cluster: ${CLUSTER_FQDN}
            $(echo "${TAGS}" | sed "s/ /\\n            /g; s/=/: /g")
EOF
```

### Crossplane

[Crossplane](https://crossplane.io/)

* [crossplane](https://github.com/crossplane/crossplane)
* [default values.yaml](https://github.com/crossplane/crossplane/blob/master/cluster/charts/crossplane/values.yaml.tmpl):

```bash
mkdir -vp apps/base/crossplane/helmrelease
cat > apps/base/crossplane/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace-crossplane.yaml
  - crossplane.yaml
EOF

cat > apps/base/crossplane/namespace-crossplane.yaml << \EOF
apiVersion: v1
kind: Namespace
metadata:
  name: crossplane-system
EOF

flux create kustomization crossplane \
  --interval="10m" \
  --path="./apps/base/crossplane/helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/crossplane.crossplane-system" \
  --export > apps/base/crossplane/crossplane.yaml

flux create helmrelease crossplane \
  --namespace="crossplane-system" \
  --interval="1h" \
  --source="HelmRepository/crossplane-stable.flux-system" \
  --chart="crossplane" \
  --chart-version="1.4.1" \
  --export > apps/base/crossplane/helmrelease/crossplane.yaml

mkdir -pv "apps/${ENVIRONMENT}/base/crossplane"/{provider,providerconfig}
yq e '.resources += ["crossplane"]' -i "apps/${ENVIRONMENT}/base/kustomization.yaml"

cat > "apps/${ENVIRONMENT}/base/crossplane/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../../base/crossplane
  - provider.yaml
  - providerconfig.yaml
EOF

cat > "apps/${ENVIRONMENT}/base/crossplane/provider.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: crossplane-provider
  namespace: flux-system
spec:
  interval: 5m0s
  dependsOn:
    - name: crossplane
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  healthChecks:
    - apiVersion: pkg.crossplane.io/v1
      kind: Provider
      name: provider-aws
  path: "./apps/${ENVIRONMENT}/base/crossplane/provider"
  prune: true
  validation: client
  postBuild:
    substitute:
      AWS_ACCOUNT_ID: ${AWS_ACCOUNT_ID:=AWS_ACCOUNT_ID}
      CLUSTER_NAME: ${CLUSTER_NAME:=CLUSTER_NAME}
EOF

cat > "apps/${ENVIRONMENT}/base/crossplane/provider/provider-aws.yaml" << \EOF
apiVersion: pkg.crossplane.io/v1alpha1
kind: ControllerConfig
metadata:
  name: aws-config
  namespace: crossplane-system
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::${AWS_ACCOUNT_ID}:role/crossplane-provider-aws-${CLUSTER_NAME}
spec:
  podSecurityContext:
    fsGroup: 2000
---
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-aws
  namespace: crossplane-system
spec:
  package: crossplane/provider-aws:master
  controllerConfigRef:
    name: aws-config
EOF

cat > "apps/${ENVIRONMENT}/base/crossplane/providerconfig.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: crossplane-providerconfig
  namespace: flux-system
spec:
  interval: 5m0s
  dependsOn:
    - name: crossplane-provider
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  healthChecks:
    - apiVersion: aws.crossplane.io/v1beta1
      kind: ProviderConfig
      name: aws-provider
  path: "./apps/${ENVIRONMENT}/base/crossplane/providerconfig"
  prune: true
  validation: client
EOF

cat > "apps/${ENVIRONMENT}/base/crossplane/providerconfig/providerconfig-aws.yaml" << \EOF
apiVersion: aws.crossplane.io/v1beta1
kind: ProviderConfig
metadata:
  name: aws-provider
  namespace: crossplane-system
spec:
  credentials:
    source: InjectedIdentity
EOF
```

### CSI Snapshotter

Details about EKS and `external-snapshotter` can be found here:
[Using EBS Snapshots for persistent storage with your EKS cluster](https://aws.amazon.com/blogs/containers/using-ebs-snapshots-for-persistent-storage-with-your-eks-cluster)

```bash
mkdir -vp apps/base/external-snapshotter/manifests
cat > apps/base/external-snapshotter/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - external-snapshotter.yaml
EOF

flux create kustomization external-snapshotter \
  --interval="10m" \
  --path="./apps/base/external-snapshotter/manifests" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="Deployment/snapshot-controller.kube-system" \
  --export > apps/base/external-snapshotter/external-snapshotter.yaml

cat > apps/base/external-snapshotter/manifests/kustomization.yaml << \EOF
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
cat > apps/base/metrics-server/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace-metrics-server.yaml
  - metrics-server.yaml
EOF

cat > apps/base/metrics-server/namespace-metrics-server.yaml << \EOF
apiVersion: v1
kind: Namespace
metadata:
  name: metrics-server
EOF

flux create kustomization metrics-server \
  --interval="10m" \
  --path="./apps/base/metrics-server/helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/metrics-server.metrics-server" \
  --export > apps/base/metrics-server/metrics-server.yaml

flux create helmrelease metrics-server \
  --namespace="metrics-server" \
  --interval="1h" \
  --source="HelmRepository/bitnami.flux-system" \
  --chart="metrics-server" \
  --chart-version="5.10.1" \
  --export > apps/base/metrics-server/helmrelease/metrics-server.yaml

mkdir -vp apps/${ENVIRONMENT}/base/metrics-server/
yq e '.resources += ["metrics-server"]' -i "apps/${ENVIRONMENT}/base/kustomization.yaml"

cat > "apps/${ENVIRONMENT}/base/metrics-server/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../../base/metrics-server
patchesStrategicMerge:
  - kustomization-patch.yaml
EOF

cat > "apps/${ENVIRONMENT}/base/metrics-server/kustomization-patch.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: metrics-server
  namespace: flux-system
spec:
  patchesStrategicMerge:
    - apiVersion: helm.toolkit.fluxcd.io/v2beta1
      kind: HelmRelease
      metadata:
        name: metrics-server
        namespace: metrics-server
      spec:
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
cat > apps/base/kube-prometheus-stack/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace-kube-prometheus-stack.yaml
  - kube-prometheus-stack.yaml
EOF

cat > apps/base/kube-prometheus-stack/namespace-kube-prometheus-stack.yaml << EOF
apiVersion: v1
kind: Namespace
metadata:
  name: kube-prometheus-stack
EOF

flux create kustomization kube-prometheus-stack \
  --interval="10m" \
  --depends-on="aws-ebs-csi-driver" \
  --path="./apps/base/kube-prometheus-stack/helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/kube-prometheus-stack.kube-prometheus-stack" \
  --export > apps/base/kube-prometheus-stack/kube-prometheus-stack.yaml

flux create helmrelease kube-prometheus-stack \
  --namespace="kube-prometheus-stack" \
  --interval="1h" \
  --source="HelmRepository/prometheus-community.flux-system" \
  --chart="kube-prometheus-stack" \
  --chart-version="18.0.12" \
  --export > apps/base/kube-prometheus-stack/helmrelease/kube-prometheus-stack.yaml

# Disable --crds for now due to bug:
# https://github.com/fluxcd/flux2/issues/1845
# --crds="CreateReplace" \

mkdir -vp apps/${ENVIRONMENT}/base/kube-prometheus-stack
yq e '.resources += ["kube-prometheus-stack"]' -i "apps/${ENVIRONMENT}/base/kustomization.yaml"

cat > "apps/${ENVIRONMENT}/base/kube-prometheus-stack/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../../base/kube-prometheus-stack
patchesStrategicMerge:
  - kustomization-patch.yaml
EOF

cat > "apps/${ENVIRONMENT}/base/kube-prometheus-stack/kustomization-patch.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: kube-prometheus-stack
  namespace: flux-system
spec:
  patchesStrategicMerge:
    - apiVersion: helm.toolkit.fluxcd.io/v2beta1
      kind: HelmRelease
      metadata:
        name: kube-prometheus-stack
        namespace: kube-prometheus-stack
      spec:
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
                    summary: '{{ $labels.kind }} {{ $labels.namespace }}/{{ $labels.name }} reconciliation has been failing for more than ten minutes.'
          alertmanager:
            config:
              global:
                slack_api_url: ${SLACK_INCOMING_WEBHOOK_URL}
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
                    - channel: "#${SLACK_CHANNEL}"
                      send_resolved: True
                      icon_url: "https://avatars3.githubusercontent.com/u/3380462"
                      title: '{{ template "slack.cp.title" . }}'
                      text: '{{ template "slack.cp.text" . }}'
                      footer: "https://${CLUSTER_FQDN}"
                      actions:
                        - type: button
                          text: 'Runbook :blue_book:'
                          url: '{{ (index .Alerts 0).Annotations.runbook_url }}'
                        - type: button
                          text: 'Query :mag:'
                          url: '{{ (index .Alerts 0).GeneratorURL }}'
                        - type: button
                          text: 'Silence :no_bell:'
                          url: '{{ template "__alert_silence_link" . }}'
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
                      {{ range .Labels.SortedPairs }} - *{{ .Name }}:* `{{ .Value }}`
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
                nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/start?rd=$scheme://$host$request_uri
              hosts:
                - alertmanager.${CLUSTER_FQDN}
              paths: ["/"]
              pathType: ImplementationSpecific
              tls:
                - hosts:
                  - alertmanager.${CLUSTER_FQDN}
          # https://github.com/grafana/helm-charts/blob/main/charts/grafana/values.yaml
          grafana:
            ingress:
              enabled: true
              annotations:
                nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/auth
                nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/start?rd=$scheme://$host$request_uri
              hosts:
                - grafana.${CLUSTER_FQDN}
              paths: ["/"]
              pathType: ImplementationSpecific
              tls:
                - hosts:
                  - grafana.${CLUSTER_FQDN}
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
                # https://github.com/fluxcd/flux2/blob/main/manifests/monitoring/grafana/dashboards/cluster.json
                gitops-toolkit-control-plane:
                  url: https://raw.githubusercontent.com/fluxcd/flux2/c98cd106218b0fdead155bd9a0b0a5666e5c3e15/manifests/monitoring/grafana/dashboards/control-plane.json
                  datasource: Prometheus
                gitops-toolkit-cluster:
                  url: https://raw.githubusercontent.com/fluxcd/flux2/3b91e14f6dff0fad024ae44a58b40f76e677bd1c/manifests/monitoring/grafana/dashboards/cluster.json
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
            ingress:
              enabled: true
              annotations:
                nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/auth
                nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/start?rd=$scheme://$host$request_uri
              paths: ["/"]
              pathType: ImplementationSpecific
              hosts:
                - prometheus.${CLUSTER_FQDN}
              tls:
                - hosts:
                  - prometheus.${CLUSTER_FQDN}
            prometheusSpec:
              externalUrl: https://prometheus.${CLUSTER_FQDN}
              ruleSelectorNilUsesHelmValues: false
              serviceMonitorSelectorNilUsesHelmValues: false
              podMonitorSelectorNilUsesHelmValues: false
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
mkdir -vp apps/base/cert-manager/helmrelease
cat > apps/base/cert-manager/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - cert-manager.yaml
EOF

flux create kustomization cert-manager \
  --interval="10m" \
  --depends-on="kube-prometheus-stack" \
  --path="./apps/base/cert-manager/helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/cert-manager.cert-manager" \
  --export > apps/base/cert-manager/cert-manager.yaml

cat << \EOF |
installCRDs: true
serviceAccount:
  create: false
  name: cert-manager
EOF
flux create helmrelease cert-manager \
  --namespace="cert-manager" \
  --interval="1h" \
  --source="HelmRepository/jetstack.flux-system" \
  --chart="cert-manager" \
  --chart-version="v1.5.3" \
  --values="/dev/stdin" \
  --export > apps/base/cert-manager/helmrelease/cert-manager.yaml

mkdir -pv "apps/${ENVIRONMENT}/base/cert-manager"/{clusterissuer,certificate}
yq e '.resources += ["cert-manager"]' -i "apps/${ENVIRONMENT}/base/kustomization.yaml"

cat > "apps/${ENVIRONMENT}/base/cert-manager/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../../base/cert-manager
  - clusterissuer.yaml
  - certificate.yaml
patchesStrategicMerge:
  - kustomization-patch.yaml
EOF

cat > "apps/${ENVIRONMENT}/base/cert-manager/kustomization-patch.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: cert-manager
  namespace: flux-system
spec:
  patchesStrategicMerge:
    - apiVersion: helm.toolkit.fluxcd.io/v2beta1
      kind: HelmRelease
      metadata:
        name: cert-manager
        namespace: cert-manager
      spec:
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

cat > "apps/${ENVIRONMENT}/base/cert-manager/clusterissuer.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: cert-manager-clusterissuer
  namespace: flux-system
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
  path: "./apps/${ENVIRONMENT}/base/cert-manager/clusterissuer"
  prune: true
  validation: client
  postBuild:
    substitute:
      AWS_DEFAULT_REGION: ${AWS_DEFAULT_REGION:=AWS_DEFAULT_REGION}
      CLUSTER_FQDN: ${CLUSTER_FQDN:=CLUSTER_FQDN}
      MY_EMAIL: ${MY_EMAIL:=MY_EMAIL}
EOF

cat > "apps/${ENVIRONMENT}/base/cert-manager/clusterissuer/clusterissuer-letsencrypt-staging-dns.yaml" << \EOF
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
EOF

cat > "apps/${ENVIRONMENT}/base/cert-manager/clusterissuer/clusterissuer-letsencrypt-production-dns.yaml" << \EOF
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

cat > "apps/${ENVIRONMENT}/base/cert-manager/certificate.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: cert-manager-certificate
  namespace: flux-system
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
  path: "./apps/${ENVIRONMENT}/base/cert-manager/certificate"
  prune: true
  validation: client
  postBuild:
    substitute:
      LETSENCRYPT_ENVIRONMENT: ${LETSENCRYPT_ENVIRONMENT:=LETSENCRYPT_ENVIRONMENT}
      CLUSTER_FQDN: ${CLUSTER_FQDN:=CLUSTER_FQDN}
EOF

cat > "apps/${ENVIRONMENT}/base/cert-manager/certificate/certificate.yaml" << \EOF
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: ingress-cert-${LETSENCRYPT_ENVIRONMENT}
  namespace: cert-manager
spec:
  secretName: ingress-cert-${LETSENCRYPT_ENVIRONMENT}
  secretTemplate:
    annotations:
      kubed.appscode.com/sync: cert-manager-cert-${LETSENCRYPT_ENVIRONMENT}=copy
  issuerRef:
    name: letsencrypt-${LETSENCRYPT_ENVIRONMENT}-dns
    kind: ClusterIssuer
  commonName: "*.${CLUSTER_FQDN}"
  dnsNames:
    - "*.${CLUSTER_FQDN}"
    - "${CLUSTER_FQDN}"
EOF
```

### Dex

[Dex](https://dexidp.io/)

* [dex](https://artifacthub.io/packages/helm/dex/dex)
* [default values.yaml](https://github.com/dexidp/helm-charts/blob/master/charts/dex/values.yaml):

```bash
mkdir -vp apps/base/dex/helmrelease
cat > apps/base/dex/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace-dex.yaml
  - dex.yaml
EOF

cat > apps/base/dex/namespace-dex.yaml << \EOF
apiVersion: v1
kind: Namespace
metadata:
  name: dex
EOF

flux create kustomization dex \
  --interval="10m" \
  --path="./apps/base/dex/helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/dex.dex" \
  --export > apps/base/dex/dex.yaml

cat << \EOF |
config:
  issuer: https://dex.${CLUSTER_FQDN:=CLUSTER_FQDN}.com
  storage:
    type: kubernetes
    config:
      inCluster: true
  connectors:
    - type: github
      id: github
      name: GitHub
EOF
flux create helmrelease dex \
  --namespace="dex" \
  --interval="1h" \
  --source="HelmRepository/dex.flux-system" \
  --chart="dex" \
  --chart-version="0.6.3" \
  --values="/dev/stdin" \
  --export > apps/base/dex/helmrelease/dex.yaml

mkdir -vp "apps/${ENVIRONMENT}/base/dex"
yq e '.resources += ["dex"]' -i "apps/${ENVIRONMENT}/base/kustomization.yaml"

cat > "apps/${ENVIRONMENT}/base/dex/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../../base/dex
patchesStrategicMerge:
  - kustomization-patch.yaml
EOF

cat > "apps/${ENVIRONMENT}/base/dex/kustomization-patch.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: dex
  namespace: flux-system
spec:
  patchesStrategicMerge:
    - apiVersion: helm.toolkit.fluxcd.io/v2beta1
      kind: HelmRelease
      metadata:
        name: dex
        namespace: dex
      spec:
        values:
          ingress:
            enabled: true
            annotations:
              nginx.ingress.kubernetes.io/ssl-redirect: "false"
            hosts:
              - host: dex.${CLUSTER_FQDN}
                paths:
                  - path: /
                    pathType: ImplementationSpecific
            tls:
              - hosts:
                - dex.${CLUSTER_FQDN}
          config:
            issuer: https://dex.${CLUSTER_FQDN}
            storage:
              type: kubernetes
              config:
                inCluster: true
            oauth2:
              skipApprovalScreen: true
            connectors:
              - type: github
                id: github
                name: GitHub
                config:
                  clientID: ${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID}
                  clientSecret: ${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET}
                  redirectURI: https://dex.${CLUSTER_FQDN}/callback
                  orgs:
                    - name: ${MY_GITHUB_ORG_NAME}
              - type: oidc
                id: okta
                name: Okta
                config:
                  issuer: ${OKTA_ISSUER}
                  clientID: ${OKTA_CLIENT_ID}
                  clientSecret: ${OKTA_CLIENT_SECRET}
                  redirectURI: https://dex.${CLUSTER_FQDN}/callback
                  scopes:
                    - openid
                    - profile
                    - email
                  getUserInfo: true
            staticClients:
              - id: oauth2-proxy.${CLUSTER_FQDN}
                redirectURIs:
                  - https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/callback
                name: OAuth2 Proxy
                secret: ${MY_PASSWORD}
            enablePasswordDB: false
EOF
```

### ExternalDNS

[ExternalDNS](https://github.com/kubernetes-sigs/external-dns)

* [external-dns](https://artifacthub.io/packages/helm/bitnami/external-dns)
* [default values.yaml](https://github.com/bitnami/charts/blob/master/bitnami/external-dns/values.yaml):

```bash
mkdir -vp apps/base/external-dns/helmrelease
cat > apps/base/external-dns/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - external-dns.yaml
EOF

flux create kustomization external-dns \
  --interval="10m" \
  --depends-on="ingress-nginx" \
  --path="./apps/base/external-dns/helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/external-dns.external-dns" \
  --export > apps/base/external-dns/external-dns.yaml

cat << \EOF |
serviceAccount:
  create: false
  name: external-dns
EOF
flux create helmrelease external-dns \
  --namespace="external-dns" \
  --interval="1h" \
  --source="HelmRepository/bitnami.flux-system" \
  --chart="external-dns" \
  --chart-version="5.4.7" \
  --values="/dev/stdin" \
  --export > apps/base/external-dns/helmrelease/external-dns.yaml

mkdir -vp apps/${ENVIRONMENT}/base/external-dns/
yq e '.resources += ["external-dns"]' -i "apps/${ENVIRONMENT}/base/kustomization.yaml"

cat > "apps/${ENVIRONMENT}/base/external-dns/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../../base/external-dns
patchesStrategicMerge:
  - kustomization-patch.yaml
EOF

cat > "apps/${ENVIRONMENT}/base/external-dns/kustomization-patch.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: external-dns
  namespace: flux-system
spec:
  patchesStrategicMerge:
    - apiVersion: helm.toolkit.fluxcd.io/v2beta1
      kind: HelmRelease
      metadata:
        name: external-dns
        namespace: external-dns
      spec:
        values:
          aws:
            region: ${AWS_DEFAULT_REGION}
          domainFilters:
            - ${CLUSTER_FQDN}
          interval: 20s
          policy: sync
          serviceAccount:
            create: false
            name: external-dns
          metrics:
            enabled: true
            serviceMonitor:
              enabled: true
EOF
```

### Flux provides, alerts, receivers and monitoring

[flux](https://fluxcd.io/)

```bash
mkdir -vp "apps/${ENVIRONMENT}/base/flux"/{providers,alerts,receivers,podmonitor}
yq e '.resources += ["flux"]' -i apps/${ENVIRONMENT}/base/kustomization.yaml
cat > "apps/${ENVIRONMENT}/base/flux/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - flux-providers.yaml
  - flux-alerts.yaml
  - flux-receivers.yaml
  - flux-podmonitor.yaml
EOF

cat > "apps/${ENVIRONMENT}/base/flux/flux-providers.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: flux-providers
  namespace: flux-system
spec:
  interval: 1m
  sourceRef:
    kind: GitRepository
    name: flux-system
  healthChecks:
    - apiVersion: notification.toolkit.fluxcd.io/v1beta1
      kind: Provider
      name: slack
      namespace: flux-system
  path: ./apps/${ENVIRONMENT}/base/flux/providers/
  prune: true
  validation: client
  postBuild:
    substitute:
      SLACK_CHANNEL: ${SLACK_CHANNEL:=SLACK_CHANNEL}
      SLACK_INCOMING_WEBHOOK_URL_BASE64: ${SLACK_INCOMING_WEBHOOK_URL_BASE64}
EOF

flux create alert-provider slack \
  --type=slack \
  --channel="\${SLACK_CHANNEL}" \
  --secret-ref=slack-url \
  --export > "apps/${ENVIRONMENT}/base/flux/providers/provider-slack.yaml"

cat > "apps/${ENVIRONMENT}/base/flux/providers/provider-slack-url-secret.yaml" << \EOF
apiVersion: v1
kind: Secret
metadata:
  name: slack-url
  namespace: flux-system
data:
  address: ${SLACK_INCOMING_WEBHOOK_URL_BASE64}
EOF

cat > "apps/${ENVIRONMENT}/base/flux/flux-alerts.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: flux-alerts
  namespace: flux-system
spec:
  interval: 1m
  dependsOn:
    - name: flux-providers
  sourceRef:
    kind: GitRepository
    name: flux-system
  healthChecks:
    - apiVersion: notification.toolkit.fluxcd.io/v1beta1
      kind: Alert
      name: alert-slack
      namespace: flux-system
  path: ./apps/${ENVIRONMENT}/base/flux/alerts/
  prune: true
  validation: client
EOF

flux create alert alert-slack \
  --event-severity=error \
  --event-source="GitRepository/*,Kustomization/*,HelmRepository/*,HelmChart/*,HelmRelease/*" \
  --provider-ref=slack \
  --export > "apps/${ENVIRONMENT}/base/flux/alerts/alert-slack.yaml"

cat > "apps/${ENVIRONMENT}/base/flux/flux-podmonitor.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: flux-podmonitor
  namespace: flux-system
spec:
  interval: 1m
  dependsOn:
    - name: kube-prometheus-stack
  sourceRef:
    kind: GitRepository
    name: flux-system
  healthChecks:
    - apiVersion: monitoring.coreos.com/v1
      kind: PodMonitor
      name: flux-system
      namespace: flux-system
  path: ./apps/${ENVIRONMENT}/base/flux/podmonitor/
  prune: true
  validation: client
EOF

cat > "apps/${ENVIRONMENT}/base/flux/podmonitor/podmonitor.yaml" << \EOF
apiVersion: monitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: flux-system
  namespace: flux-system
  labels:
    app.kubernetes.io/part-of: flux
spec:
  namespaceSelector:
    matchNames:
      - flux-system
  selector:
    matchExpressions:
      - key: app
        operator: In
        values:
          - helm-controller
          - source-controller
          - kustomize-controller
          - notification-controller
          - image-automation-controller
          - image-reflector-controller
  podMetricsEndpoints:
    - port: http-prom
EOF

cat > "apps/${ENVIRONMENT}/base/flux/flux-receivers.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: flux-receivers
  namespace: flux-system
spec:
  interval: 1m
  sourceRef:
    kind: GitRepository
    name: flux-system
  healthChecks:
    - apiVersion: notification.toolkit.fluxcd.io/v1beta1
      kind: Receiver
      name: github-receiver
      namespace: flux-system
  path: ./apps/${ENVIRONMENT}/base/flux/receivers/
  prune: true
  validation: client
  postBuild:
    substitute:
      MY_GITHUB_WEBHOOK_TOKEN_BASE64: ${MY_GITHUB_WEBHOOK_TOKEN_BASE64}
      CLUSTER_FQDN: ${CLUSTER_FQDN:=CLUSTER_FQDN}
EOF

cat > "apps/${ENVIRONMENT}/base/flux/receivers/receiver-github-webhook-token-secret.yaml" << \EOF
apiVersion: v1
kind: Secret
metadata:
  name: github-webhook-token
  namespace: flux-system
data:
  token: ${MY_GITHUB_WEBHOOK_TOKEN_BASE64}
EOF

flux create receiver github-receiver \
  --type=github \
  --event=ping \
  --event=push \
  --secret-ref=github-webhook-token \
  --resource="GitRepository/flux-system" \
  --export > "apps/${ENVIRONMENT}/base/flux/receivers/receiver-github.yaml"

cat > "apps/${ENVIRONMENT}/base/flux/receivers/receiver-github-ingress.yaml" << \EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: flux-github-receiver
  namespace: flux-system
spec:
  rules:
  - host: flux-receiver.${CLUSTER_FQDN}
    http:
      paths:
      - path: /
        pathType: ImplementationSpecific
        backend:
          service:
            name: webhook-receiver
            port:
              name: http
  tls:
  - hosts:
    - flux-receiver.${CLUSTER_FQDN}
EOF
```

### ingress-nginx

[ingress-nginx](https://kubernetes.github.io/ingress-nginx/)

* [ingress-nginx](https://artifacthub.io/packages/helm/ingress-nginx/ingress-nginx)
* [default values.yaml](https://github.com/kubernetes/ingress-nginx/blob/master/charts/ingress-nginx/values.yaml):

```bash
mkdir -vp apps/base/ingress-nginx/helmrelease
cat > apps/base/ingress-nginx/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace-ingress-nginx.yaml
  - ingress-nginx.yaml
EOF

cat > apps/base/ingress-nginx/namespace-ingress-nginx.yaml << \EOF
apiVersion: v1
kind: Namespace
metadata:
  name: ingress-nginx
EOF

flux create kustomization ingress-nginx \
  --interval="10m" \
  --depends-on="kube-prometheus-stack,cert-manager-certificate" \
  --path="./apps/base/ingress-nginx/helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/ingress-nginx.ingress-nginx" \
  --export > apps/base/ingress-nginx/ingress-nginx.yaml

flux create helmrelease ingress-nginx \
  --namespace="ingress-nginx" \
  --interval="1h" \
  --source="HelmRepository/ingress-nginx.flux-system" \
  --chart="ingress-nginx" \
  --chart-version="3.36.0" \
  --export > apps/base/ingress-nginx/helmrelease/ingress-nginx.yaml

mkdir -vp apps/${ENVIRONMENT}/base/ingress-nginx/
yq e '.resources += ["ingress-nginx"]' -i "apps/${ENVIRONMENT}/base/kustomization.yaml"

cat > "apps/${ENVIRONMENT}/base/ingress-nginx/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../../base/ingress-nginx
patchesStrategicMerge:
  - kustomization-patch.yaml
EOF

cat > "apps/${ENVIRONMENT}/base/ingress-nginx/kustomization-patch.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: ingress-nginx
  namespace: flux-system
spec:
  patchesStrategicMerge:
    - apiVersion: helm.toolkit.fluxcd.io/v2beta1
      kind: HelmRelease
      metadata:
        name: ingress-nginx
        namespace: ingress-nginx
      spec:
        values:
          controller:
            extraArgs:
              default-ssl-certificate: "cert-manager/ingress-cert-${LETSENCRYPT_ENVIRONMENT}"
            service:
              annotations:
                service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp
                service.beta.kubernetes.io/aws-load-balancer-type: nlb
                service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: "${TAGS_INGRESS_NGINX}"
            metrics:
              enabled: true
              serviceMonitor:
                enabled: true
              prometheusRule:
                enabled: true
                rules:
                  - alert: NGINXConfigFailed
                    expr: count(nginx_ingress_controller_config_last_reload_successful == 0) > 0
                    for: 1s
                    labels:
                      severity: critical
                    annotations:
                      description: bad ingress config - nginx config test failed
                      summary: uninstall the latest ingress changes to allow config reloads to resume
                  - alert: NGINXCertificateExpiry
                    expr: (avg(nginx_ingress_controller_ssl_expire_time_seconds) by (host) - time()) < 604800
                    for: 1s
                    labels:
                      severity: critical
                    annotations:
                      description: ssl certificate(s) will expire in less then a week
                      summary: renew expiring certificates to avoid downtime
                  - alert: NGINXTooMany500s
                    expr: 100 * ( sum( nginx_ingress_controller_requests{status=~"5.+"} ) / sum(nginx_ingress_controller_requests) ) > 5
                    for: 1m
                    labels:
                      severity: warning
                    annotations:
                      description: Too many 5XXs
                      summary: More than 5% of all requests returned 5XX, this requires your attention
                  - alert: NGINXTooMany400s
                    expr: 100 * ( sum( nginx_ingress_controller_requests{status=~"4.+"} ) / sum(nginx_ingress_controller_requests) ) > 5
                    for: 1m
                    labels:
                      severity: warning
                    annotations:
                      description: Too many 4XXs
                      summary: More than 5% of all requests returned 4XX, this requires your attention
EOF
```

### MailHog

[mailhog](https://github.com/mailhog/MailHog)

* [mailhog](https://artifacthub.io/packages/helm/codecentric/mailhog)
* [default values.yaml](https://github.com/codecentric/helm-charts/blob/master/charts/mailhog/values.yaml):

```bash
mkdir -vp apps/base/mailhog/helmrelease
cat > apps/base/mailhog/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace-mailhog.yaml
  - mailhog.yaml
EOF

cat > apps/base/mailhog/namespace-mailhog.yaml << \EOF
apiVersion: v1
kind: Namespace
metadata:
  name: mailhog
EOF

flux create kustomization mailhog \
  --interval="10m" \
  --path="./apps/base/mailhog/helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/mailhog.mailhog" \
  --export > apps/base/mailhog/mailhog.yaml

flux create helmrelease mailhog \
  --namespace="mailhog" \
  --interval="1h" \
  --source="HelmRepository/codecentric.flux-system" \
  --chart="mailhog" \
  --chart-version="4.1.0" \
  --export > apps/base/mailhog/helmrelease/mailhog.yaml

mkdir -vp apps/${ENVIRONMENT}/base/mailhog/
yq e '.resources += ["mailhog"]' -i "apps/${ENVIRONMENT}/base/kustomization.yaml"

cat > "apps/${ENVIRONMENT}/base/mailhog/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../../base/mailhog
patchesStrategicMerge:
  - kustomization-patch.yaml
EOF

cat > "apps/${ENVIRONMENT}/base/mailhog/kustomization-patch.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: mailhog
  namespace: flux-system
spec:
  patchesStrategicMerge:
    - apiVersion: helm.toolkit.fluxcd.io/v2beta1
      kind: HelmRelease
      metadata:
        name: mailhog
        namespace: mailhog
      spec:
        values:
          ingress:
            enabled: true
            annotations:
              nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/auth
              nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/start?rd=$scheme://$host$request_uri
            hosts:
              - host: mailhog.${CLUSTER_FQDN}
                paths: ["/"]
            tls:
              - hosts:
                - mailhog.${CLUSTER_FQDN}
EOF
```

### OAuth2 Proxy

[oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/)

* [oauth2-proxy](https://artifacthub.io/packages/helm/oauth2-proxy/oauth2-proxy)
* [default values.yaml](https://github.com/oauth2-proxy/manifests/blob/main/helm/oauth2-proxy/values.yaml):

```bash
mkdir -vp apps/base/oauth2-proxy/helmrelease
cat > apps/base/oauth2-proxy/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace-oauth2-proxy.yaml
  - oauth2-proxy.yaml
EOF

cat > apps/base/oauth2-proxy/namespace-oauth2-proxy.yaml << \EOF
apiVersion: v1
kind: Namespace
metadata:
  name: oauth2-proxy
EOF

flux create kustomization oauth2-proxy \
  --interval="10m" \
  --depends-on="kube-prometheus-stack" \
  --path="./apps/base/oauth2-proxy/helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/oauth2-proxy.oauth2-proxy" \
  --export > apps/base/oauth2-proxy/oauth2-proxy.yaml

flux create helmrelease oauth2-proxy \
  --namespace="oauth2-proxy" \
  --interval="1h" \
  --source="HelmRepository/oauth2-proxy.flux-system" \
  --chart="oauth2-proxy" \
  --chart-version="4.2.1" \
  --export > apps/base/oauth2-proxy/helmrelease/oauth2-proxy.yaml

mkdir -vp apps/${ENVIRONMENT}/base/oauth2-proxy/
yq e '.resources += ["oauth2-proxy"]' -i "apps/${ENVIRONMENT}/base/kustomization.yaml"

cat > "apps/${ENVIRONMENT}/base/oauth2-proxy/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../../base/oauth2-proxy
patchesStrategicMerge:
  - kustomization-patch.yaml
EOF

cat > "apps/${ENVIRONMENT}/base/oauth2-proxy/kustomization-patch.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: oauth2-proxy
  namespace: flux-system
spec:
  patchesStrategicMerge:
    - apiVersion: helm.toolkit.fluxcd.io/v2beta1
      kind: HelmRelease
      metadata:
        name: oauth2-proxy
        namespace: oauth2-proxy
      spec:
        values:
          config:
            clientID: oauth2-proxy.${CLUSTER_FQDN}
            clientSecret: ${MY_PASSWORD}
            cookieSecret: ${COOKIE_SECRET}
            configFile: |-
              email_domains = [ "*" ]
              upstreams = [ "file:///dev/null" ]
              whitelist_domains = ".${CLUSTER_FQDN}"
              cookie_domains = ".${CLUSTER_FQDN}"
              provider = "oidc"
              oidc_issuer_url = "https://dex.${CLUSTER_FQDN}"
              ssl_insecure_skip_verify = "true"
              insecure_oidc_skip_issuer_verification = "true"
              skip_oidc_discovery = "true"
              login_url = "https://dex.${CLUSTER_FQDN}/auth"
              redeem_url = "https://dex.${CLUSTER_FQDN}/token"
              oidc_jwks_url = "https://dex.${CLUSTER_FQDN}/keys"
          ingress:
            enabled: true
            hosts:
              - oauth2-proxy.${CLUSTER_FQDN}
            tls:
              - hosts:
                - oauth2-proxy.${CLUSTER_FQDN}
          metrics:
            servicemonitor:
              enabled: true
EOF
```

## Flux

Commit changes to git repository and "refresh" flux. Wait for receiver and then
configure the GitHub repository to send Webhooks to Flux:

```bash
if [[ $(curl -s -H "Authorization: token $GITHUB_TOKEN" "https://api.github.com/repos/${GITHUB_USER}/${GITHUB_FLUX_REPOSITORY}/hooks" | jq -r) = '[]' ]]; then
  git add .
  git commit -m "Initial core applications commit" || true
  git push
  flux reconcile source git flux-system
  sleep 100
  kubectl wait --timeout=10m --for=condition=ready kustomizations.kustomize.toolkit.fluxcd.io/external-dns -n flux-system
  FLUX_RECEIVER_URL=$(kubectl -n flux-system get receiver github-receiver -o jsonpath="{.status.url}")
  curl -s -H "Authorization: token $GITHUB_TOKEN" -X POST -d "{\"active\": true, \"events\": [\"push\"], \"config\": {\"url\": \"https://flux-receiver.${CLUSTER_FQDN}${FLUX_RECEIVER_URL}\", \"content_type\": \"json\", \"secret\": \"${MY_GITHUB_WEBHOOK_TOKEN}\", \"insecure_ssl\": \"1\"}}" "https://api.github.com/repos/${GITHUB_USER}/${GITHUB_FLUX_REPOSITORY}/hooks" | jq
fi
```

Due to the way how Crossplane installs the providers it is not possible to
specify the name of the `ServiceAccount` in advance. Therefore you need to get the
details about `ServiceAccount` created by Crossplane and use eksctl to create
IRSA:

```bash
if [[ $( eksctl get iamserviceaccount  --cluster "${CLUSTER_NAME}" --namespace crossplane-system -o yaml | yq e ) == "null" ]] ; then
  kubectl wait --timeout=10m --for=condition=ready kustomizations.kustomize.toolkit.fluxcd.io/crossplane-providerconfig -n flux-system
  CROSSPLANE_PROVIDER_AWS_SERVICE_ACCOUNT_NAME=$(kubectl get serviceaccounts -n crossplane-system -o=custom-columns=NAME:.metadata.name | grep provider-aws)
  eksctl create iamserviceaccount --cluster="${CLUSTER_NAME}" --name="${CROSSPLANE_PROVIDER_AWS_SERVICE_ACCOUNT_NAME}" --namespace="crossplane-system" --role-name="crossplane-provider-aws-${CLUSTER_NAME}" --role-only --attach-policy-arn="arn:aws:iam::aws:policy/AdministratorAccess" --tags="${TAGS// /,}" --approve
fi
```
