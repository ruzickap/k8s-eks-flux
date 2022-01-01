# Base Applications

[[toc]]

## Flux (dis)advantages

* `dependsOn` can not be used between `HelmRelease` and `Kustomization`:
  [HelmRelease, Kustomization DependsOn](https://github.com/fluxcd/kustomize-controller/issues/242).
  Due to [https://github.com/fluxcd/flux2/discussions/730](https://github.com/fluxcd/flux2/discussions/730),
  [https://github.com/fluxcd/flux2/discussions/1010](https://github.com/fluxcd/flux2/discussions/1010)
  it is necessary to "pack" `HelmRelease` inside "flux `Kustomization`" to be
  able to do dependency using `dependsOn` later...
  This "forces" you to use "flux `Kustomization`" almost everywhere where you
  are using "dependencies"
* [HelmReleases](https://fluxcd.io/docs/components/helm/helmreleases/) are
  compatible with Helm (`helm ls -A` works fine)
* [Variable substitution](https://fluxcd.io/docs/components/kustomize/kustomization/#variable-substitution)
  is really handy and easy to use in case you do not want to use too much
  [patching](https://fluxcd.io/docs/components/kustomize/kustomization/#variable-substitution)
* Changing values inside patches which are use `|-` is not possible, because
  it is a block of "text" and not "structure"

## Solution requirements for Flux

* `HelmRepositories` must be installed in `flux-system` namespace and separated,
  because definitions there are shared by multiple `HelmReleases`
* `HelmRepositories` must be installed before `HelmReleases` (`dependsOn`)
  to prevent generating errors in Flux log
* I want to define flexible cluster "infrastructure groups"
  (`prod`, `dev`, `mygroup`, `myteam`):
  * It should be possible to define infrastructure group containing various
    applications
  * It should also help you to easily manage groups of clusters because their
    definitions will be in the specific directory (like `infrastructure/dev`)
  * [Variables](https://fluxcd.io/docs/components/kustomize/kustomization/#variable-substitution)
    should be used per cluster (`clusters/dev/kube1/cluster-apps-substitutefrom-secret.yaml`)
* `HelmRepository` / `HelmReleases` can be defined per "cluster":
  * `clusters/dev/kube1/sources/fairwinds-stable.yaml`
  * `clusters/dev/kube1/cluster-apps/polaris/polaris-helmrelease.yaml`

### Naming convention and directory structure

Most of the applications installed to K8s cluster are using Helm charts.
Therefore you need Flux objects `HelmRepositories` and `HelmReleases` where
`HelmRepositories` needs to be installed first.

* `HelmRepositories` are separated from app definition, because they may be
  shared by multiple applications (like `bitnami` and
  `external-dns` + `metrics-server`). `HelmRepositories` are installed first to
  prevent flux from logging errors...
* Applications can be installed on multiple levels
  * **Apps level** - not used
  * **Infrastructure level** - configuration for specific group of K8s
    servers. Usually contains objects, patches, certificates, which are applied
    to multiple clusters (different objects for "dev" and "prod" clusters)
  * **Cluster level** - specific app configurations, `HelmReleases` /
    `HelmRepositories` for single cluster. Usually contains variables like
    `CLUSTER_FQDN`, `CLUSTER_NAME`, `MY_PASSWORD`, `LETSENCRYPT_ENVIRONMENT` ...

#### Cluster level

Cluster level directory `/clusters/` contains individual cluster definitions.

* `clusters/${ENVIRONMENT}/${CLUSTER_FQDN}`
  * `sources.yaml` - main "flux Kustomization" pointing do
    the `./sources` where are the `HelmRepository` definitions for cluster
  * `sources/kustomization.yaml` - list of all "enabled HelmRepositories"
  * `sources/fairwinds-stable.yaml` - HelmRepository file
  * `cluster-apps.yaml` - main "flux Kustomization" pointing to
    `./clusters/dev/kube1.k8s.mylabs.dev/cluster-apps`
  * `cluster-apps/kustomization.yaml` - kustomization file containing patches,
    app directories and `./infrastructure/dev`
  * `cluster-apps-substitutefrom-secret.yaml` - encrypted variables used in
    `postBuild.substituteFrom` flux Kustomization sections
  * `cluster-apps/polaris/polaris-namespace` - application namespace
  * `cluster-apps/polaris/polaris-helmrelease` - `HelmRelease` file
  * `flux-system/gotk-patches.yaml,kustomization.yaml` - files configuring Flux
    to work with SOPS (decryption)

```text
clusters
└── dev
    └── kube1.k8s.mylabs.dev
        ├── cluster-apps
        │   ├── kustomization.yaml
        │   └── polaris
        │       ├── kustomization.yaml
        │       ├── polaris-helmrelease.yaml
        │       └── polaris-namespace.yaml
        ├── cluster-apps-substitutefrom-secret.yaml
        ├── cluster-apps.yaml
        ├── flux-system
        │   ├── gotk-components.yaml
        │   ├── gotk-patches.yaml
        │   ├── gotk-sync.yaml
        │   └── kustomization.yaml
        ├── kustomization.yaml
        ├── sources
        │   ├── fairwinds-stable.yaml
        │   └── kustomization.yaml
        └── sources.yaml
```

#### Infrastructure level

Infrastructure level contain applications or patches located in `base`
directory. All definitions in infrastructure level are applied to all servers
in that "group". Infrastructure also contains the `sources` directory where you
can find "common" HelmRepositories. Usually there are "groups" (directories)
like `prd`, `dev`, `stg`, ...

* `infrastructure` - directory containing "infrastructure level" definitions
  * `sources/kustomization.yaml` - globally allowed HelmRepositories
  * `sources/bitnami-helmrepository.yaml` - HelmRepository file
  * `base` - base application directory
    * `dex` - "base" dex directory containing HelmRelease,
      and namespace manifests
* `infrastructure/${ENVIRONMENT}`
  * `kustomization.yaml` - list of all enabled "infrastructure dev level" apps
  * `dex` - directory containing values for HelmRelease

```text
infrastructure
├── base
│   ├── cert-manager
│   │   ├── cert-manager-helmrelease.yaml
│   │   └── kustomization.yaml
│   ├── dex
│   │   ├── dex-helmrelease.yaml
│   │   ├── dex-namespace.yaml
│   │   └── kustomization.yaml
│   ├── external-dns
│   │   ├── external-dns-helmrelease.yaml
│   │   └── kustomization.yaml
│   ├── external-snapshotter
│   │   └── kustomization.yaml
│   └── secrets-store-csi-driver
│       ├── kustomization.yaml
│       ├── secrets-store-csi-driver-helmrelease.yaml
│       └── secrets-store-csi-driver-namespace.yaml
├── dev
│   ├── cert-manager
│   │   ├── cert-manager-kustomization-certificate
│   │   │   └── cert-manager-certificate.yaml
│   │   ├── cert-manager-kustomization-certificate.yaml
│   │   ├── cert-manager-kustomization-clusterissuer
│   │   │   ├── cert-manager-clusterissuer-letsencrypt-production-dns.yaml
│   │   │   └── cert-manager-clusterissuer-letsencrypt-staging-dns.yaml
│   │   ├── cert-manager-kustomization-clusterissuer.yaml
│   │   ├── cert-manager-kustomization
│   │   │   ├── cert-manager-values.yaml
│   │   │   ├── kustomization.yaml
│   │   │   └── kustomizeconfig.yaml
│   │   ├── cert-manager-kustomization.yaml
│   │   └── kustomization.yaml
│   ├── crossplane
│   │   ├── crossplane-kustomization
│   │   │   └── kustomization.yaml
│   │   ├── crossplane-kustomization.yaml
│   │   ├── crossplane-kustomization-provider
│   │   │   ├── crossplane-controllerconfig-aws.yaml
│   │   │   └── crossplane-provider-aws.yaml
│   │   ├── crossplane-kustomization-provider.yaml
│   │   ├── crossplane-kustomization-providerconfig
│   │   │   └── crossplane-providerconfig-aws.yaml
│   │   ├── crossplane-kustomization-providerconfig.yaml
│   │   └── kustomization.yaml
│   ├── dex
│   │   ├── dex-values.yaml
│   │   ├── kustomization.yaml
│   │   └── kustomizeconfig.yaml
│   ├── external-dns
│   │   ├── external-dns-kustomization
│   │   │   ├── external-dns-values.yaml
│   │   │   ├── kustomization.yaml
│   │   │   └── kustomizeconfig.yaml
│   │   ├── external-dns-kustomization.yaml
│   │   └── kustomization.yaml
│   ├── external-snapshotter
│   │   ├── external-snapshotter-kustomization
│   │   │   └── kustomization.yaml
│   │   ├── external-snapshotter-kustomization.yaml
│   │   └── kustomization.yaml
│   ├── kustomization.yaml
│   └── secrets-store-csi-driver
│       ├── kustomization.yaml
│       ├── secrets-store-csi-driver-kustomization
│       │   └── kustomization.yaml
│       ├── secrets-store-csi-driver-kustomization.yaml
│       ├── secrets-store-csi-driver-provider-aws
│       │   └── kustomization.yaml
│       └── secrets-store-csi-driver-provider-aws.yaml
└── sources
    ├── bitnami-helmrepository.yaml
    ├── crossplane-stable-helmrepository.yaml
    ├── dex-helmrepository.yaml
    ├── jetstack-helmrepository.yaml
    ├── kustomization.yaml
    └── secrets-store-csi-driver-helmrepository.yaml
```

---

## Create basic Flux structure in git repository

Clone initial git repository created by `eksctl` used by Flux:

```bash
if [[ -d "tmp/${CLUSTER_FQDN}/${GITHUB_FLUX_REPOSITORY}" ]] ; then
  git -C "tmp/${CLUSTER_FQDN}/${GITHUB_FLUX_REPOSITORY}" pull -r
else
  git clone "https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${GITHUB_FLUX_REPOSITORY}.git" "tmp/${CLUSTER_FQDN}/${GITHUB_FLUX_REPOSITORY}"
fi
```

Create initial git repository structure:

```bash
mkdir -vp "tmp/${CLUSTER_FQDN}/${GITHUB_FLUX_REPOSITORY}"/infrastructure/{base,dev,sources}
```

Set `user.name` and `user.email` for git (if not already configured)

```bash
git config user.name  || git config --global user.name  "${GITHUB_USER}"
git config user.email || git config --global user.email "${MY_EMAIL}"
```

Go to the "git directory":

```bash
cd "tmp/${CLUSTER_FQDN}/${GITHUB_FLUX_REPOSITORY}" || exit
```

## Manage Kubernetes secrets with Mozilla SOPS and Amazon Secret Manager

Configure the Git directory for encryption:

```bash
[[ ! -s .sops.yaml ]] && echo "creation_rules:" > .sops.yaml

grep -q "${CLUSTER_FQDN}" .sops.yaml || cat >> .sops.yaml << EOF
  - path_regex: clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/.*
    encrypted_regex: ^(data)$
    kms: ${AWS_KMS_KEY_ARN}
EOF
```

Add SOPS configuration to git repository and sync it with Flux:

```bash
if [[ ! -s "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/flux-system/gotk-patches.yaml" ]]; then
  cat > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/flux-system/gotk-patches.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: flux-system
  namespace: flux-system
spec:
  decryption:
    provider: sops
EOF

  (
    cd "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/flux-system" && \
    kustomize edit add patch --path gotk-patches.yaml && \
    cd - || exit
  )

  git add .sops.yaml "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/flux-system"
  git commit -m "[${CLUSTER_NAME}] Add SOPS configuration"
  git push
  flux reconcile source git flux-system
fi
```

## HelmRepositories

Create `HelmRepository` definitions...

```bash
declare -A HELMREPOSITORIES=(
  ["appscode"]="https://charts.appscode.com/stable/"
  ["autoscaler"]="https://kubernetes.github.io/autoscaler"
  ["aws-ebs-csi-driver"]="https://kubernetes-sigs.github.io/aws-ebs-csi-driver/"
  ["aws-efs-csi-driver"]="https://kubernetes-sigs.github.io/aws-efs-csi-driver/"
  ["bitnami"]="https://charts.bitnami.com/bitnami"
  ["codecentric"]="https://codecentric.github.io/helm-charts"
  ["crossplane-stable"]="https://charts.crossplane.io/stable"
  ["dex"]="https://charts.dexidp.io"
  ["ingress-nginx"]="https://kubernetes.github.io/ingress-nginx"
  ["jaegertracing"]="https://jaegertracing.github.io/helm-charts"
  ["jetstack"]="https://charts.jetstack.io"
  ["kiali"]="https://kiali.org/helm-charts"
  ["kubernetes-dashboard"]="https://kubernetes.github.io/dashboard/"
  ["kyverno"]="https://kyverno.github.io/kyverno/"
  ["oauth2-proxy"]="https://oauth2-proxy.github.io/manifests"
  ["podinfo"]="https://stefanprodan.github.io/podinfo"
  ["policy-reporter"]="https://kyverno.github.io/policy-reporter"
  ["prometheus-community"]="https://prometheus-community.github.io/helm-charts"
  ["rancher-latest"]="https://releases.rancher.com/server-charts/latest"
  ["secrets-store-csi-driver"]="https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts"
  ["vmware-tanzu"]="https://vmware-tanzu.github.io/helm-charts"
)

for HELMREPOSITORY in "${!HELMREPOSITORIES[@]}"; do
  flux create source helm "${HELMREPOSITORY}" \
    --url="${HELMREPOSITORIES[${HELMREPOSITORY}]}" \
    --interval=1h \
    --export > "infrastructure/sources/${HELMREPOSITORY}-helmrepository.yaml"
done

# Due to this issue: https://github.com/kubernetes-sigs/kustomize/issues/2803
# you need to CD to the directory first and then go back
[[ -f infrastructure/sources/kustomization.yaml ]] && rm infrastructure/sources/kustomization.yaml
cd infrastructure/sources && kustomize create --autodetect && cd - || exit
```

## Clusters

Create `cluster-apps`, `sources` and initial `kustomization.yaml` under
cluster directory `clusters/${ENVIRONMENT}/${CLUSTER_FQDN}`:

```bash
mkdir -pv "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}"/{cluster-apps,sources}
```

It is necessary to split `HelmRepository` and `HelmRelease`, otherwise there
are many errors in flux logs. `HelmRepository` should be always installed
before `HelmRelease` using `dependsOn`.

```bash
flux create kustomization sources \
  --interval="5m" \
  --path="clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/sources" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --wait \
  --export > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/sources.yaml"

[[ ! -s "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/sources/kustomization.yaml" ]] && \
  (
    cd "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/sources/" && \
    kustomize create --resources "../../../../infrastructure/sources" && \
    cd - || exit
  )
```

Use `cluster-apps` "flux kustomization" definition to use `dependsOn` to wait
for "HelmRepositories".

```bash
cat > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps.yaml" << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: cluster-apps
  namespace: flux-system
spec:
  dependsOn:
    - name: sources
  interval: 5m
  path: ./clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: true
  timeout: 15m
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

[[ ! -s "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kustomization.yaml" ]] && \
  (
    cd "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/" && \
    kustomize create --resources "../../../../infrastructure/${ENVIRONMENT}" && \
    cd - || exit
  )

if [[ ! -s "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps-substitutefrom-secret.yaml" ]] ; then
  kubectl create secret generic cluster-apps-substitutefrom-secret -n flux-system --dry-run=client -o yaml \
    --from-literal="AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID}" \
    --from-literal="AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}" \
    --from-literal="AWS_KMS_KEY_ARN=${AWS_KMS_KEY_ARN}" \
    --from-literal="CLUSTER_FQDN=${CLUSTER_FQDN}" \
    --from-literal="CLUSTER_NAME=${CLUSTER_NAME}" \
    --from-literal="ENVIRONMENT=dev" \
    --from-literal="LETSENCRYPT_ENVIRONMENT=staging" \
    --from-literal="MY_COOKIE_SECRET=${MY_COOKIE_SECRET}" \
    --from-literal="MY_EMAIL=${MY_EMAIL}" \
    --from-literal="MY_GITHUB_ORG_NAME=${MY_GITHUB_ORG_NAME}" \
    --from-literal="MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID=${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID}" \
    --from-literal="MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET=${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET}" \
    --from-literal="MY_GITHUB_WEBHOOK_TOKEN_BASE64=$(echo -n "${MY_GITHUB_WEBHOOK_TOKEN}" | base64 --wrap=0)" \
    --from-literal="MY_PASSWORD=${MY_PASSWORD}" \
    --from-literal="MY_PASSWORD_BASE64=$(echo -n "${MY_PASSWORD}" | base64 --wrap=0)" \
    --from-literal="OKTA_CLIENT_ID=${OKTA_CLIENT_ID}" \
    --from-literal="OKTA_CLIENT_SECRET=${OKTA_CLIENT_SECRET}" \
    --from-literal="OKTA_ISSUER=${OKTA_ISSUER}" \
    --from-literal="SLACK_CHANNEL=${SLACK_CHANNEL}" \
    --from-literal="SLACK_INCOMING_WEBHOOK_URL_BASE64=$(echo -n "${SLACK_INCOMING_WEBHOOK_URL}" | base64 --wrap=0)" \
    --from-literal="SLACK_INCOMING_WEBHOOK_URL=${SLACK_INCOMING_WEBHOOK_URL}" \
    --from-literal="TAGS_INLINE=${TAGS// /,}" \
    > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps-substitutefrom-secret.yaml"
  sops --encrypt --in-place "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps-substitutefrom-secret.yaml"
fi

[[ ! -s "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/kustomization.yaml" ]] && \
  (
    cd "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}" && \
    kustomize create --resources "flux-system,sources.yaml,cluster-apps-substitutefrom-secret.yaml,cluster-apps.yaml" && \
    cd - || exit
  )
```

## Create initial Apps dev group definitions

Create initial `kustomization.yaml` where all the group application will
have their record:

```bash
[[ ! -s "infrastructure/${ENVIRONMENT}/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize create --resources "../sources" && cd - || exit )
```

## Base Applications definitions

### Amazon Elastic Block Store (EBS) CSI driver

[Amazon Elastic Block Store (EBS) CSI driver](https://github.com/kubernetes-sigs/aws-ebs-csi-driver)

* [aws-ebs-csi-driver](https://github.com/kubernetes-sigs/aws-ebs-csi-driver/tree/master/charts/aws-ebs-csi-driver)
* [default values.yaml](https://github.com/kubernetes-sigs/aws-ebs-csi-driver/blob/master/charts/aws-ebs-csi-driver/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/aws-ebs-csi-driver

flux create helmrelease aws-ebs-csi-driver \
  --namespace="aws-ebs-csi-driver" \
  --interval="5m" \
  --source="HelmRepository/aws-ebs-csi-driver.flux-system" \
  --chart="aws-ebs-csi-driver" \
  --chart-version="2.6.2" \
  --values-from="ConfigMap/aws-ebs-csi-driver-values" \
  --export > infrastructure/base/aws-ebs-csi-driver/aws-ebs-csi-driver-helmrelease.yaml

[[ ! -s "infrastructure/base/aws-ebs-csi-driver/kustomization.yaml" ]] && \
( cd "infrastructure/base/aws-ebs-csi-driver" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/aws-ebs-csi-driver`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization"

flux create kustomization aws-ebs-csi-driver \
  --interval="5m" \
  --depends-on="external-snapshotter" \
  --path="./infrastructure/\${ENVIRONMENT}/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --wait \
  --export > "infrastructure/${ENVIRONMENT}/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization.yaml"

cat > "infrastructure/${ENVIRONMENT}/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: aws-ebs-csi-driver
resources:
  - gp2-non-default-class.yaml
  - ../../../base/aws-ebs-csi-driver
configMapGenerator:
  - name: aws-ebs-csi-driver-values
    files:
      - values.yaml=aws-ebs-csi-driver-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization/aws-ebs-csi-driver-values.yaml" << \EOF
controller:
  serviceAccount:
    create: false
    name: ebs-csi-controller-sa
storageClasses:
- name: gp3
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
  parameters:
    encrypted: "true"
    # TODO XXXX !!!! this is not working :-(
    # kmskeyid: ${AWS_KMS_KEY_ARN}
EOF

cat > "infrastructure/${ENVIRONMENT}/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization/gp2-non-default-class.yaml" << \EOF
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  annotations:
    storageclass.kubernetes.io/is-default-class: "false"
  name: gp2
parameters:
  fsType: ext4
  type: gp2
provisioner: kubernetes.io/aws-ebs
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
EOF

[[ ! -s "infrastructure/${ENVIRONMENT}/aws-ebs-csi-driver/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/aws-ebs-csi-driver" && kustomize create --autodetect && cd - || exit )

! grep -q '\- aws-ebs-csi-driver$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource aws-ebs-csi-driver && cd - || exit )
```

Change the "aws-ebs-csi-driver tags" on the Cluster level, because they will be
different for every cluster and it needs to be "set" form `TAGS` bash variable:

```bash
! grep -q 'name: aws-ebs-csi-driver$' "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kustomization.yaml" && \
cat >> "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kustomization.yaml" << EOF
patchesStrategicMerge:
- |-
  apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
  kind: Kustomization
  metadata:
    name: aws-ebs-csi-driver
    namespace: flux-system
  spec:
    patches:
      - target:
          kind: HelmRelease
          name: aws-ebs-csi-driver
          namespace: aws-ebs-csi-driver
        patch: |-
          apiVersion: helm.toolkit.fluxcd.io/v2beta1
          kind: HelmRelease
          metadata:
            name: not-used
          spec:
            values:
              controller:
                k8sTagClusterId: ${CLUSTER_FQDN}
                extraVolumeTags:
                  Name: ${GITHUB_USER}-\${CLUSTER_NAME}
                  Cluster: \${CLUSTER_FQDN}
                  $(echo "${TAGS}" | sed "s/ /\\n                  /g; s/=/: /g")
EOF
```

### Crossplane

[Crossplane](https://crossplane.io/)

* [crossplane](https://github.com/crossplane/crossplane)
* [default values.yaml](https://github.com/crossplane/crossplane/blob/master/cluster/charts/crossplane/values.yaml.tmpl)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/crossplane

kubectl create namespace crossplane-system --dry-run=client -o yaml > infrastructure/base/crossplane/crossplane-namespace.yaml

flux create helmrelease crossplane \
  --namespace="crossplane-system" \
  --interval="5m" \
  --source="HelmRepository/crossplane-stable.flux-system" \
  --chart="crossplane" \
  --chart-version="1.5.1" \
  --export > infrastructure/base/crossplane/crossplane-helmrelease.yaml

[[ ! -s "infrastructure/base/crossplane/kustomization.yaml" ]] && \
( cd "infrastructure/base/crossplane" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/crossplane`:

```bash
mkdir -pv "infrastructure/${ENVIRONMENT}/crossplane"/crossplane-{kustomization,kustomization-provider,kustomization-providerconfig}

flux create kustomization crossplane \
  --interval="5m" \
  --path="./infrastructure/\${ENVIRONMENT}/crossplane/crossplane-kustomization" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --wait \
  --export > "infrastructure/${ENVIRONMENT}/crossplane/crossplane-kustomization.yaml"

[[ ! -s "infrastructure/${ENVIRONMENT}/crossplane/crossplane-kustomization/kustomization.yaml" ]] && \
  (
    cd "infrastructure/${ENVIRONMENT}/crossplane/crossplane-kustomization" && \
    kustomize create --resources ../../../base/crossplane && \
    cd - || exit
  )

cat > "infrastructure/${ENVIRONMENT}/crossplane/crossplane-kustomization-provider.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: crossplane-provider
  namespace: flux-system
spec:
  dependsOn:
    - name: crossplane
  interval: 5m
  path: "./infrastructure/${ENVIRONMENT}/crossplane/crossplane-kustomization-provider"
  prune: true
  wait: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

cat > "infrastructure/${ENVIRONMENT}/crossplane/crossplane-kustomization-provider/crossplane-provider-aws.yaml" << \EOF
apiVersion: pkg.crossplane.io/v1
kind: Provider
metadata:
  name: provider-aws
  namespace: crossplane-system
spec:
  package: crossplane/provider-aws:v0.22.0
  controllerConfigRef:
    name: aws-config
EOF

cat > "infrastructure/${ENVIRONMENT}/crossplane/crossplane-kustomization-provider/crossplane-controllerconfig-aws.yaml" << \EOF
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
EOF

flux create kustomization crossplane-providerconfig \
  --interval="5m" \
  --depends-on="crossplane-provider" \
  --path="./infrastructure/\${ENVIRONMENT}/crossplane/crossplane-kustomization-providerconfig" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --wait \
  --export > "infrastructure/${ENVIRONMENT}/crossplane/crossplane-kustomization-providerconfig.yaml"

cat > "infrastructure/${ENVIRONMENT}/crossplane/crossplane-kustomization-providerconfig/crossplane-providerconfig-aws.yaml" << \EOF
apiVersion: aws.crossplane.io/v1beta1
kind: ProviderConfig
metadata:
  name: aws-provider
  namespace: crossplane-system
spec:
  credentials:
    source: InjectedIdentity
EOF

[[ ! -s "infrastructure/${ENVIRONMENT}/crossplane/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/crossplane" && kustomize create --autodetect && cd - || exit )

! grep -q '\- crossplane$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource crossplane && cd - || exit )
```

### CSI Snapshotter

Details about EKS and `external-snapshotter` can be found here:
[Using EBS Snapshots for persistent storage with your EKS cluster](https://aws.amazon.com/blogs/containers/using-ebs-snapshots-for-persistent-storage-with-your-eks-cluster)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/external-snapshotter

cat > infrastructure/base/external-snapshotter/kustomization.yaml << \EOF
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

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/external-snapshotter`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/external-snapshotter/external-snapshotter-kustomization"

flux create kustomization external-snapshotter \
  --interval="5m" \
  --path="./infrastructure/\${ENVIRONMENT}/external-snapshotter/external-snapshotter-kustomization" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --wait \
  --export > "infrastructure/${ENVIRONMENT}/external-snapshotter/external-snapshotter-kustomization.yaml"

[[ ! -s "infrastructure/${ENVIRONMENT}/external-snapshotter/external-snapshotter-kustomization/kustomization.yaml" ]] && \
  (
    cd "infrastructure/${ENVIRONMENT}/external-snapshotter/external-snapshotter-kustomization" && \
    kustomize create --resources "../../../base/external-snapshotter" && \
    cd - || exit
  )

[[ ! -s "infrastructure/${ENVIRONMENT}/external-snapshotter/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/external-snapshotter" && kustomize create --autodetect && cd - || exit )

! grep -q '\- external-snapshotter$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource external-snapshotter && cd - || exit )
```

### Kubernetes Metrics Server

[Kubernetes Metrics Server](https://kubernetes.io/docs/tasks/debug-application-cluster/resource-metrics-pipeline/)

* [metrics-server](https://artifacthub.io/packages/helm/bitnami/metrics-server)
* [default values.yaml](https://github.com/bitnami/charts/blob/master/bitnami/metrics-server/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/metrics-server

kubectl create namespace metrics-server --dry-run=client -o yaml > infrastructure/base/metrics-server/metrics-server-namespace.yaml

flux create helmrelease metrics-server \
  --namespace="metrics-server" \
  --interval="5m" \
  --source="HelmRepository/bitnami.flux-system" \
  --chart="metrics-server" \
  --chart-version="5.10.12" \
  --values-from="ConfigMap/metrics-server-values" \
  --export > infrastructure/base/metrics-server/metrics-server-helmrelease.yaml

[[ ! -s "infrastructure/base/metrics-server/kustomization.yaml" ]] && \
( cd "infrastructure/base/metrics-server" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/metrics-server`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/metrics-server"

cat > "infrastructure/${ENVIRONMENT}/metrics-server/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/metrics-server/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: metrics-server
resources:
  - ../../base/metrics-server
configMapGenerator:
  - name: metrics-server-values
    files:
      - values.yaml=metrics-server-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/metrics-server/metrics-server-values.yaml" << \EOF
apiService:
  create: true
EOF

! grep -q '\- metrics-server$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource metrics-server && cd - || exit )
```

### kube-prometheus-stack

[kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack)

* [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack)
* [default values.yaml](https://github.com/prometheus-community/helm-charts/blob/main/charts/kube-prometheus-stack/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/kube-prometheus-stack

kubectl create namespace kube-prometheus-stack --dry-run=client -o yaml > infrastructure/base/kube-prometheus-stack/kube-prometheus-stack-namespace.yaml

flux create helmrelease kube-prometheus-stack \
  --namespace="kube-prometheus-stack" \
  --interval="5m" \
  --source="HelmRepository/prometheus-community.flux-system" \
  --chart="kube-prometheus-stack" \
  --chart-version="27.0.0" \
  --crds="CreateReplace" \
  --values-from="ConfigMap/kube-prometheus-stack-values" \
  --export > infrastructure/base/kube-prometheus-stack/kube-prometheus-stack-helmrelease.yaml

[[ ! -s "infrastructure/base/kube-prometheus-stack/kustomization.yaml" ]] && \
( cd "infrastructure/base/kube-prometheus-stack" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/kube-prometheus-stack`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/kube-prometheus-stack/kube-prometheus-stack-kustomization"

cat > "infrastructure/${ENVIRONMENT}/kube-prometheus-stack/kube-prometheus-stack-kustomization.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: kube-prometheus-stack
  namespace: flux-system
spec:
  dependsOn:
    - name: aws-ebs-csi-driver
  interval: 5m
  path: ./infrastructure/${ENVIRONMENT}/kube-prometheus-stack/kube-prometheus-stack-kustomization
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: true
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

cat > "infrastructure/${ENVIRONMENT}/kube-prometheus-stack/kube-prometheus-stack-kustomization/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/kube-prometheus-stack/kube-prometheus-stack-kustomization/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: kube-prometheus-stack
resources:
  - ../../../base/kube-prometheus-stack
configMapGenerator:
  - name: kube-prometheus-stack-values
    files:
      - values.yaml=kube-prometheus-stack-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/kube-prometheus-stack/kube-prometheus-stack-kustomization/kube-prometheus-stack-values.yaml" << \EOF
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
    ingressClassName: nginx
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
    ingressClassName: nginx
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
        revision: 24
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
        revision: 101
        datasource: Prometheus
      istio-performance:
        gnetId: 11829
        revision: 101
        datasource: Prometheus
      istio-service:
        gnetId: 7636
        revision: 101
        datasource: Prometheus
      istio-workload:
        gnetId: 7630
        revision: 101
        datasource: Prometheus
      istio-control-plane:
        gnetId: 7645
        revision: 101
        datasource: Prometheus
      jaeger:
        gnetId: 10001
        revision: 2
        datasource: Prometheus
      # https://github.com/fluxcd/flux2/blob/main/manifests/monitoring/grafana/dashboards/cluster.json
      gitops-toolkit-control-plane:
        url: https://raw.githubusercontent.com/fluxcd/flux2/c98cd106218b0fdead155bd9a0b0a5666e5c3e15/manifests/monitoring/grafana/dashboards/control-plane.json
        datasource: Prometheus
      gitops-toolkit-cluster:
        url: https://raw.githubusercontent.com/fluxcd/flux2/80cf5fa7291242f87458a426fccb57abfd8c66ee/manifests/monitoring/grafana/dashboards/cluster.json
        datasource: Prometheus
      kyverno-policy-report:
        gnetId: 13995
        revision: 4
        datasource: Prometheus
      kyverno-policy-reports:
        gnetId: 13968
        revision: 2
        datasource: Prometheus
      external-dns:
        gnetId: 15038
        revision: 1
        datasource: Prometheus
      kubernetes-monitor:
        gnetId: 15398
        revision: 5
        datasource: Prometheus
      cluster-autoscaler-stats:
        gnetId: 12623
        revision: 1
        datasource: Prometheus
      kubernetes-addons-velero-stats:
        gnetId: 11055
        revision: 2
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
    ingressClassName: nginx
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
    externalLabels:
      cluster: ${CLUSTER_FQDN}
    externalUrl: https://prometheus.${CLUSTER_FQDN}
    ruleSelectorNilUsesHelmValues: false
    serviceMonitorSelectorNilUsesHelmValues: false
    podMonitorSelectorNilUsesHelmValues: false
    retention: 7d
    retentionSize: 1GB
    walCompression: true
    externalLabels:
      cluster: "${CLUSTER_FQDN}"
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: gp3
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 2Gi
EOF

[[ ! -s "infrastructure/${ENVIRONMENT}/kube-prometheus-stack/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/kube-prometheus-stack" && kustomize create --autodetect && cd - || exit )

! grep -q '\- kube-prometheus-stack$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource kube-prometheus-stack && cd - || exit )
```

### cert-manager

[cert-manager](https://cert-manager.io/)

* [cert-manager](https://artifacthub.io/packages/helm/jetstack/cert-manager)
* [default values.yaml](https://github.com/jetstack/cert-manager/blob/master/deploy/charts/cert-manager/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/cert-manager

flux create helmrelease cert-manager \
  --namespace="cert-manager" \
  --interval="5m" \
  --source="HelmRepository/jetstack.flux-system" \
  --chart="cert-manager" \
  --chart-version="v1.6.1" \
  --values-from="ConfigMap/cert-manager-values" \
  --export > infrastructure/base/cert-manager/cert-manager-helmrelease.yaml

[[ ! -s "infrastructure/base/cert-manager/kustomization.yaml" ]] && \
( cd "infrastructure/base/cert-manager" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/cert-manager`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/cert-manager"/cert-manager-{kustomization,kustomization-clusterissuer,kustomization-certificate}

flux create kustomization cert-manager \
  --interval="5m" \
  --depends-on="kube-prometheus-stack" \
  --path="./infrastructure/\${ENVIRONMENT}/cert-manager/cert-manager-kustomization" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --wait \
  --export > "infrastructure/${ENVIRONMENT}/cert-manager/cert-manager-kustomization.yaml"

cat > "infrastructure/${ENVIRONMENT}/cert-manager/cert-manager-kustomization/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/cert-manager/cert-manager-kustomization/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: cert-manager
resources:
  - ../../../base/cert-manager
configMapGenerator:
  - name: cert-manager-values
    files:
      - values.yaml=cert-manager-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/cert-manager/cert-manager-kustomization/cert-manager-values.yaml" << \EOF
installCRDs: true
serviceAccount:
  create: false
  name: cert-manager
extraArgs:
  - --cluster-resource-namespace=cert-manager
  - --enable-certificate-owner-ref=true
prometheus:
  servicemonitor:
    enabled: true
EOF

cat > "infrastructure/${ENVIRONMENT}/cert-manager/cert-manager-kustomization-clusterissuer.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: cert-manager-clusterissuer
  namespace: flux-system
spec:
  dependsOn:
    - name: cert-manager
  interval: 5m
  path: "./infrastructure/${ENVIRONMENT}/cert-manager/cert-manager-kustomization-clusterissuer"
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: true
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

cat > "infrastructure/${ENVIRONMENT}/cert-manager/cert-manager-kustomization-clusterissuer/cert-manager-clusterissuer-letsencrypt-staging-dns.yaml" << \EOF
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

cat > "infrastructure/${ENVIRONMENT}/cert-manager/cert-manager-kustomization-clusterissuer/cert-manager-clusterissuer-letsencrypt-production-dns.yaml" << \EOF
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

cat > "infrastructure/${ENVIRONMENT}/cert-manager/cert-manager-kustomization-certificate.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: cert-manager-certificate
  namespace: flux-system
spec:
  dependsOn:
    - name: cert-manager-clusterissuer
  interval: 5m
  path: "./infrastructure/${ENVIRONMENT}/cert-manager/cert-manager-kustomization-certificate"
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: true
  timeout: 10m
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

cat > "infrastructure/${ENVIRONMENT}/cert-manager/cert-manager-kustomization-certificate/cert-manager-certificate.yaml" << \EOF
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

[[ ! -s "infrastructure/${ENVIRONMENT}/cert-manager/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/cert-manager" && kustomize create --autodetect && cd - || exit )

! grep -q '\- cert-manager$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource cert-manager && cd - || exit )
```

### cluster-autoscaler

[cluster-autoscaler](https://github.com/kubernetes/autoscaler)

* [cluster-autoscaler](https://artifacthub.io/packages/helm/cluster-autoscaler/cluster-autoscaler)
* [default values.yaml](https://github.com/kubernetes/autoscaler/blob/master/charts/cluster-autoscaler/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/cluster-autoscaler

flux create helmrelease cluster-autoscaler \
  --namespace="cluster-autoscaler" \
  --interval="5m" \
  --source="HelmRepository/autoscaler.flux-system" \
  --chart="cluster-autoscaler" \
  --chart-version="9.11.0" \
  --values-from="ConfigMap/cluster-autoscaler-values" \
  --export > infrastructure/base/cluster-autoscaler/cluster-autoscaler-helmrelease.yaml

[[ ! -s "infrastructure/base/cluster-autoscaler/kustomization.yaml" ]] && \
( cd "infrastructure/base/cluster-autoscaler" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/cluster-autoscaler`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/cluster-autoscaler/cluster-autoscaler-kustomization"

cat > "infrastructure/${ENVIRONMENT}/cluster-autoscaler/cluster-autoscaler-kustomization.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: cluster-autoscaler
  namespace: flux-system
spec:
  dependsOn:
    - name: kube-prometheus-stack
  interval: 5m
  path: ./infrastructure/${ENVIRONMENT}/cluster-autoscaler/cluster-autoscaler-kustomization
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: true
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

cat > "infrastructure/${ENVIRONMENT}/cluster-autoscaler/cluster-autoscaler-kustomization/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/cluster-autoscaler/cluster-autoscaler-kustomization/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: cluster-autoscaler
resources:
  - ../../../base/cluster-autoscaler
configMapGenerator:
  - name: cluster-autoscaler-values
    files:
      - values.yaml=cluster-autoscaler-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/cluster-autoscaler/cluster-autoscaler-kustomization/cluster-autoscaler-values.yaml" << \EOF
autoDiscovery:
  clusterName: ${CLUSTER_NAME}
awsRegion: ${AWS_DEFAULT_REGION}
# Required to fix IMDSv2 issue: https://github.com/kubernetes/autoscaler/issues/3592
extraArgs:
  aws-use-static-instance-list: true
rbac:
  serviceAccount:
    create: false
    name: cluster-autoscaler
serviceMonitor:
  enabled: true
  namespace: kube-prometheus-stack
prometheusRule:
  enabled: true
  namespace: kube-prometheus-stack
EOF

[[ ! -s "infrastructure/${ENVIRONMENT}/cluster-autoscaler/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/cluster-autoscaler" && kustomize create --autodetect && cd - || exit )

! grep -q '\- cluster-autoscaler$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource cluster-autoscaler && cd - || exit )
```

### Dex

[Dex](https://dexidp.io/)

* [dex](https://artifacthub.io/packages/helm/dex/dex)
* [default values.yaml](https://github.com/dexidp/helm-charts/blob/master/charts/dex/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/dex

kubectl create namespace dex --dry-run=client -o yaml > infrastructure/base/dex/dex-namespace.yaml

flux create helmrelease dex \
  --namespace="dex" \
  --interval="5m" \
  --source="HelmRepository/dex.flux-system" \
  --chart="dex" \
  --chart-version="0.6.3" \
  --values-from="ConfigMap/dex-values" \
  --export > infrastructure/base/dex/dex-helmrelease.yaml

[[ ! -s "infrastructure/base/dex/kustomization.yaml" ]] && \
( cd "infrastructure/base/dex" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/dex`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/dex"

cat > "infrastructure/${ENVIRONMENT}/dex/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/dex/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: dex
resources:
  - ../../base/dex
configMapGenerator:
  - name: dex-values
    files:
      - values.yaml=dex-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/dex/dex-values.yaml" << \EOF
ingress:
  enabled: true
  className: nginx
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
    - id: kiali.${CLUSTER_FQDN}
      redirectURIs:
        - https://kiali.${CLUSTER_FQDN}
      name: Kiali
      secret: ${MY_PASSWORD}
    - id: oauth2-proxy.${CLUSTER_FQDN}
      redirectURIs:
        - https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/callback
      name: OAuth2 Proxy
      secret: ${MY_PASSWORD}
  enablePasswordDB: false
EOF

! grep -q '\- dex$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource dex && cd - || exit )
```

### ExternalDNS

[ExternalDNS](https://github.com/kubernetes-sigs/external-dns)

* [external-dns](https://artifacthub.io/packages/helm/bitnami/external-dns)
* [default values.yaml](https://github.com/bitnami/charts/blob/master/bitnami/external-dns/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/external-dns

flux create helmrelease external-dns \
  --namespace="external-dns" \
  --interval="5m" \
  --source="HelmRepository/bitnami.flux-system" \
  --chart="external-dns" \
  --chart-version="6.0.2" \
  --values-from="ConfigMap/external-dns-values" \
  --export > infrastructure/base/external-dns/external-dns-helmrelease.yaml

[[ ! -s "infrastructure/base/external-dns/kustomization.yaml" ]] && \
( cd "infrastructure/base/external-dns" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/external-dns`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/external-dns/external-dns-kustomization"

cat > "infrastructure/${ENVIRONMENT}/external-dns/external-dns-kustomization.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: external-dns
  namespace: flux-system
spec:
  dependsOn:
    - name: ingress-nginx
    - name: kube-prometheus-stack
  interval: 5m
  path: ./infrastructure/${ENVIRONMENT}/external-dns/external-dns-kustomization
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: true
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

cat > "infrastructure/${ENVIRONMENT}/external-dns/external-dns-kustomization/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/external-dns/external-dns-kustomization/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: external-dns
resources:
  - ../../../base/external-dns
configMapGenerator:
  - name: external-dns-values
    files:
      - values.yaml=external-dns-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/external-dns/external-dns-kustomization/external-dns-values.yaml" << \EOF
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

[[ ! -s "infrastructure/${ENVIRONMENT}/external-dns/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/external-dns" && kustomize create --autodetect && cd - || exit )

! grep -q '\- external-dns$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource external-dns && cd - || exit )
```

### Flux provides, alerts, receivers and monitoring

[flux](https://fluxcd.io/)

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/flux"/flux-{kustomization-provider,kustomization-alert,kustomization-receiver,kustomization-podmonitor}

cat > "infrastructure/${ENVIRONMENT}/flux/flux-kustomization-provider.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: flux-provider
  namespace: flux-system
spec:
  interval: 5m
  path: ./infrastructure/${ENVIRONMENT}/flux/flux-kustomization-provider
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
  wait: true
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

flux create alert-provider slack \
  --type=slack \
  --channel="\${SLACK_CHANNEL}" \
  --secret-ref=slack-url \
  --export > "infrastructure/${ENVIRONMENT}/flux/flux-kustomization-provider/flux-provider-slack.yaml"

cat > "infrastructure/${ENVIRONMENT}/flux/flux-kustomization-provider/flux-provider-slack-url-secret.yaml" << \EOF
apiVersion: v1
kind: Secret
metadata:
  name: slack-url
  namespace: flux-system
data:
  address: ${SLACK_INCOMING_WEBHOOK_URL_BASE64}
EOF

flux create kustomization flux-alert \
  --interval="5m" \
  --depends-on="flux-provider" \
  --path="./infrastructure/${ENVIRONMENT}/flux/flux-kustomization-alert" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --wait \
  --export > "infrastructure/${ENVIRONMENT}/flux/flux-kustomization-alert.yaml"

flux create alert alert-slack \
  --event-severity=error \
  --event-source="GitRepository/*,Kustomization/*,HelmRepository/*,HelmChart/*,HelmRelease/*" \
  --provider-ref=slack \
  --export > "infrastructure/${ENVIRONMENT}/flux/flux-kustomization-alert/flux-alert-slack.yaml"

flux create kustomization flux-podmonitor \
  --interval="5m" \
  --depends-on="kube-prometheus-stack" \
  --path="./infrastructure/${ENVIRONMENT}/flux/flux-kustomization-podmonitor" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --wait \
  --export > "infrastructure/${ENVIRONMENT}/flux/flux-kustomization-podmonitor.yaml"

cat > "infrastructure/${ENVIRONMENT}/flux/flux-kustomization-podmonitor/flux-podmonitor.yaml" << \EOF
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

cat > "infrastructure/${ENVIRONMENT}/flux/flux-kustomization-receiver.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: flux-receiver
  namespace: flux-system
spec:
  # Dependency is required to prevent errors like:
  # Ingress/flux-system/flux-github-receiver dry-run failed, reason: InternalError, error: Internal error occurred: failed calling webhook "validate.nginx.ingress.kubernetes.io": Post "https://ingress-nginx-controller-admission.ingress-nginx.svc:443/networking/v1/ingresses?timeout=10s": x509: certificate signed by unknown authority
  dependsOn:
    - name: ingress-nginx
  interval: 5m
  path: ./infrastructure/${ENVIRONMENT}/flux/flux-kustomization-receiver
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
  wait: true
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

cat > "infrastructure/${ENVIRONMENT}/flux/flux-kustomization-receiver/flux-receiver-github-webhook-token-secret.yaml" << \EOF
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
  --event=ping --event=push \
  --secret-ref=github-webhook-token \
  --resource="GitRepository/flux-system" \
  --export > "infrastructure/${ENVIRONMENT}/flux/flux-kustomization-receiver/flux-receiver-github.yaml"

cat > "infrastructure/${ENVIRONMENT}/flux/flux-kustomization-receiver/flux-receiver-github-ingress.yaml" << EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: flux-github-receiver
  namespace: flux-system
spec:
  ingressClassName: nginx
  rules:
  - host: flux-receiver.${CLUSTER_FQDN}
    http:
      paths:
      - backend:
          service:
            name: webhook-receiver
            port:
              name: http
        path: /
        pathType: Prefix
  tls:
  - hosts:
    - flux-receiver.${CLUSTER_FQDN}
EOF

[[ ! -s "infrastructure/${ENVIRONMENT}/flux/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/flux" && kustomize create --autodetect && cd - || exit )

! grep -q '\- flux$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource flux && cd - || exit )
```

### ingress-nginx

[ingress-nginx](https://kubernetes.github.io/ingress-nginx/)

* [ingress-nginx](https://artifacthub.io/packages/helm/ingress-nginx/ingress-nginx)
* [default values.yaml](https://github.com/kubernetes/ingress-nginx/blob/master/charts/ingress-nginx/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/ingress-nginx

kubectl create namespace ingress-nginx --dry-run=client -o yaml > infrastructure/base/ingress-nginx/ingress-nginx-namespace.yaml

flux create helmrelease ingress-nginx \
  --namespace="ingress-nginx" \
  --interval="5m" \
  --source="HelmRepository/ingress-nginx.flux-system" \
  --chart="ingress-nginx" \
  --chart-version="4.0.13" \
  --values-from="ConfigMap/ingress-nginx-values" \
  --export > infrastructure/base/ingress-nginx/ingress-nginx-helmrelease.yaml

[[ ! -s "infrastructure/base/ingress-nginx/kustomization.yaml" ]] && \
( cd "infrastructure/base/ingress-nginx" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/ingress-nginx`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/ingress-nginx/ingress-nginx-kustomization"

cat > "infrastructure/${ENVIRONMENT}/ingress-nginx/ingress-nginx-kustomization.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: ingress-nginx
  namespace: flux-system
spec:
  dependsOn:
    - name: kube-prometheus-stack
    - name: cert-manager-certificate
  interval: 5m
  path: ./infrastructure/${ENVIRONMENT}/ingress-nginx/ingress-nginx-kustomization
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: true
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

cat > "infrastructure/${ENVIRONMENT}/ingress-nginx/ingress-nginx-kustomization/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/ingress-nginx/ingress-nginx-kustomization/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: ingress-nginx
resources:
  - ../../../base/ingress-nginx
configMapGenerator:
  - name: ingress-nginx-values
    files:
      - values.yaml=ingress-nginx-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/ingress-nginx/ingress-nginx-kustomization/ingress-nginx-values.yaml" << \EOF
controller:
  ingressClassResource:
    default: true
  extraArgs:
    default-ssl-certificate: "cert-manager/ingress-cert-${LETSENCRYPT_ENVIRONMENT}"
  service:
    annotations:
      service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp
      service.beta.kubernetes.io/aws-load-balancer-type: nlb
      service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: "${TAGS_INLINE}"
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

[[ ! -s "infrastructure/${ENVIRONMENT}/ingress-nginx/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/ingress-nginx" && kustomize create --autodetect && cd - || exit )

! grep -q '\- ingress-nginx$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource ingress-nginx && cd - || exit )
```

### MailHog

[mailhog](https://github.com/mailhog/MailHog)

* [mailhog](https://artifacthub.io/packages/helm/codecentric/mailhog)
* [default values.yaml](https://github.com/codecentric/helm-charts/blob/master/charts/mailhog/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/mailhog

kubectl create namespace mailhog --dry-run=client -o yaml > infrastructure/base/mailhog/mailhog-namespace.yaml

flux create helmrelease mailhog \
  --namespace="mailhog" \
  --interval="5m" \
  --source="HelmRepository/codecentric.flux-system" \
  --chart="mailhog" \
  --chart-version="5.0.2" \
  --values-from="ConfigMap/mailhog-values" \
  --export > infrastructure/base/mailhog/mailhog-helmrelease.yaml

[[ ! -s "infrastructure/base/mailhog/kustomization.yaml" ]] && \
( cd "infrastructure/base/mailhog" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/mailhog`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/mailhog"

cat > "infrastructure/${ENVIRONMENT}/mailhog/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/mailhog/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: mailhog
resources:
  - ../../base/mailhog
configMapGenerator:
  - name: mailhog-values
    files:
      - values.yaml=mailhog-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/mailhog/mailhog-values.yaml" << \EOF
ingress:
  enabled: true
  ingressClassName: nginx
  annotations:
    nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/auth
    nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/start?rd=$scheme://$host$request_uri
  hosts:
    - host: mailhog.${CLUSTER_FQDN}
      paths:
        - path: "/"
          pathType: Prefix
  tls:
    - hosts:
      - mailhog.${CLUSTER_FQDN}
EOF

! grep -q '\- mailhog$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource mailhog && cd - || exit )
```

### OAuth2 Proxy

[oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/)

* [oauth2-proxy](https://artifacthub.io/packages/helm/oauth2-proxy/oauth2-proxy)
* [default values.yaml](https://github.com/oauth2-proxy/manifests/blob/main/helm/oauth2-proxy/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/oauth2-proxy

kubectl create namespace oauth2-proxy --dry-run=client -o yaml > infrastructure/base/oauth2-proxy/oauth2-proxy-namespace.yaml

flux create helmrelease oauth2-proxy \
  --namespace="oauth2-proxy" \
  --interval="5m" \
  --source="HelmRepository/oauth2-proxy.flux-system" \
  --chart="oauth2-proxy" \
  --chart-version="5.0.6" \
  --values-from="ConfigMap/oauth2-proxy-values" \
  --export > infrastructure/base/oauth2-proxy/oauth2-proxy-helmrelease.yaml

[[ ! -s "infrastructure/base/oauth2-proxy/kustomization.yaml" ]] && \
( cd "infrastructure/base/oauth2-proxy" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/oauth2-proxy`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/oauth2-proxy/oauth2-proxy-kustomization"

cat > "infrastructure/${ENVIRONMENT}/oauth2-proxy/oauth2-proxy-kustomization.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: oauth2-proxy
  namespace: flux-system
spec:
  dependsOn:
  - name: kube-prometheus-stack
  interval: 5m
  path: ./infrastructure/${ENVIRONMENT}/oauth2-proxy/oauth2-proxy-kustomization
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: true
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

cat > "infrastructure/${ENVIRONMENT}/oauth2-proxy/oauth2-proxy-kustomization/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/oauth2-proxy/oauth2-proxy-kustomization/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: oauth2-proxy
resources:
  - ../../../base/oauth2-proxy
configMapGenerator:
  - name: oauth2-proxy-values
    files:
      - values.yaml=oauth2-proxy-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/oauth2-proxy/oauth2-proxy-kustomization/oauth2-proxy-values.yaml" << \EOF
config:
  clientID: oauth2-proxy.${CLUSTER_FQDN}
  clientSecret: ${MY_PASSWORD}
  cookieSecret: ${MY_COOKIE_SECRET}
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
  className: nginx
  hosts:
    - oauth2-proxy.${CLUSTER_FQDN}
  tls:
    - hosts:
      - oauth2-proxy.${CLUSTER_FQDN}
metrics:
  servicemonitor:
    enabled: true
EOF

[[ ! -s "infrastructure/${ENVIRONMENT}/oauth2-proxy/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/oauth2-proxy" && kustomize create --autodetect && cd - || exit )

! grep -q '\- oauth2-proxy$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource oauth2-proxy && cd - || exit )
```

## Flux

Commit changes to git repository and "refresh" flux. Wait for receiver and then
configure the GitHub repository to send Webhooks to Flux:

```bash
GITHUB_WEBHOOKS=$(curl -s -H "Authorization: token $GITHUB_TOKEN" "https://api.github.com/repos/${GITHUB_USER}/${GITHUB_FLUX_REPOSITORY}/hooks" | jq ".[].config.url")
if [[ ! "${GITHUB_WEBHOOKS}" =~ ${CLUSTER_FQDN} ]]; then
  git add .
  git commit -m "[${CLUSTER_NAME}] Initial core applications commit" || true
  git push
  flux reconcile source git flux-system
  sleep 100
  kubectl wait --timeout=20m --for=condition=ready kustomizations.kustomize.toolkit.fluxcd.io -n flux-system flux-receiver
  FLUX_RECEIVER_URL=$(kubectl -n flux-system get receiver github-receiver -o jsonpath="{.status.url}")
  curl -s -H "Authorization: token $GITHUB_TOKEN" -X POST -d "{\"active\": true, \"events\": [\"push\"], \"config\": {\"url\": \"https://flux-receiver.${CLUSTER_FQDN}${FLUX_RECEIVER_URL}\", \"content_type\": \"json\", \"secret\": \"${MY_GITHUB_WEBHOOK_TOKEN}\", \"insecure_ssl\": \"1\"}}" "https://api.github.com/repos/${GITHUB_USER}/${GITHUB_FLUX_REPOSITORY}/hooks" | jq
fi
```

Due to the way how Crossplane installs the providers it is not possible to
specify the name of the `ServiceAccount` in advance. Therefore you need to get the
details about `ServiceAccount` created by Crossplane and use eksctl to create
IRSA:

```bash
if [[ "$( eksctl get iamserviceaccount --cluster="${CLUSTER_NAME}" --namespace crossplane-system -o yaml )" == "null" ]] ; then
  kubectl wait --timeout=10m --for=condition=ready kustomizations crossplane-provider -n flux-system
  kubectl wait --timeout=10m --for=condition=Healthy provider.pkg.crossplane.io provider-aws
  CROSSPLANE_PROVIDER_AWS_SERVICE_ACCOUNT_NAME=$(kubectl get serviceaccounts -n crossplane-system -o=custom-columns=NAME:.metadata.name | grep provider-aws)
  eksctl create iamserviceaccount --cluster="${CLUSTER_NAME}" --name="${CROSSPLANE_PROVIDER_AWS_SERVICE_ACCOUNT_NAME}" --namespace="crossplane-system" --role-name="crossplane-provider-aws-${CLUSTER_NAME}" --role-only --attach-policy-arn="arn:aws:iam::aws:policy/AdministratorAccess" --tags="${TAGS// /,}" --approve
fi
```
