# Applications

[[toc]]

## Applications definitions

### Amazon EFS CSI Driver

Install [Amazon EFS CSI Driver](https://github.com/kubernetes-sigs/aws-efs-csi-driver),
which supports ReadWriteMany PVC. Details can be found here:
[Introducing Amazon EFS CSI dynamic provisioning](https://aws.amazon.com/blogs/containers/introducing-efs-csi-dynamic-provisioning/)

[Amazon EFS CSI Driver](https://github.com/kubernetes-sigs/aws-efs-csi-driver)

* [aws-efs-csi-driver](https://github.com/kubernetes-sigs/aws-efs-csi-driver/tree/master/charts/aws-efs-csi-driver)
* [default values.yaml](https://github.com/kubernetes-sigs/aws-efs-csi-driver/blob/master/charts/aws-efs-csi-driver/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/aws-efs-csi-driver

flux create helmrelease aws-efs-csi-driver \
  --namespace="aws-efs-csi-driver" \
  --interval="5m" \
  --source="HelmRepository/aws-efs-csi-driver.flux-system" \
  --chart="aws-efs-csi-driver" \
  --chart-version="2.2.2" \
  --values-from="ConfigMap/aws-efs-csi-driver-values" \
  --export > infrastructure/base/aws-efs-csi-driver/aws-efs-csi-driver-helmrelease.yaml

[[ ! -s "infrastructure/base/aws-efs-csi-driver/kustomization.yaml" ]] && \
( cd "infrastructure/base/aws-efs-csi-driver" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/aws-efs-csi-driver`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/aws-efs-csi-driver/aws-efs-csi-driver-kustomization"

flux create kustomization aws-efs-csi-driver \
  --interval="5m" \
  --path="./infrastructure/\${ENVIRONMENT}/aws-efs-csi-driver/aws-efs-csi-driver-kustomization" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --wait \
  --export > "infrastructure/${ENVIRONMENT}/aws-efs-csi-driver/aws-efs-csi-driver-kustomization.yaml"

cat > "infrastructure/${ENVIRONMENT}/aws-efs-csi-driver/aws-efs-csi-driver-kustomization/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/aws-efs-csi-driver/aws-efs-csi-driver-kustomization/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: aws-efs-csi-driver
resources:
  - ../../../base/aws-efs-csi-driver
configMapGenerator:
  - name: aws-efs-csi-driver-values
    files:
      - values.yaml=aws-efs-csi-driver-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/aws-efs-csi-driver/aws-efs-csi-driver-kustomization/aws-efs-csi-driver-values.yaml" << \EOF
controller:
  serviceAccount:
    create: false
    name: efs-csi-controller-sa
EOF

[[ ! -s "infrastructure/${ENVIRONMENT}/aws-efs-csi-driver/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/aws-efs-csi-driver" && kustomize create --autodetect && cd - || exit )

! grep -q '\- aws-efs-csi-driver$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource aws-efs-csi-driver && cd - || exit )
```

Change the tags on the Cluster level, because they will be different on every
cluster and it needs to be "set" form TAGS bash variable:

```bash
! grep -q 'name: aws-efs-csi-driver$' "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kustomization.yaml" && \
cat >> "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kustomization.yaml" << EOF
- |-
  apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
  kind: Kustomization
  metadata:
    name: aws-efs-csi-driver
    namespace: flux-system
  spec:
    patches:
      - target:
          kind: HelmRelease
          name: aws-efs-csi-driver
          namespace: aws-efs-csi-driver
        patch: |-
          apiVersion: helm.toolkit.fluxcd.io/v2beta1
          kind: HelmRelease
          metadata:
            name: not-used
          spec:
            values:
              controller:
                serviceAccount:
                  create: false
                  name: efs-csi-controller-sa
                tags:
                  Name: \${CLUSTER_NAME}
                  Cluster: \${CLUSTER_FQDN}
                  $(echo "${TAGS}" | sed "s/ /\\n                  /g; s/=/: /g")
EOF
```

### Crossplane AWS

#### Get KMS key

```bash
mkdir -vp "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/crossplane-aws/cp-aws-kms-key-eks-${CLUSTER_NAME}-key"

cat > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/crossplane-aws/cp-aws-kms-key-eks-${CLUSTER_NAME}-key.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: cp-aws-kms-key-eks-${CLUSTER_NAME}-key
  namespace: flux-system
spec:
  dependsOn:
    - name: crossplane-providerconfig
  interval: 5m
  path: "./clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/crossplane-aws/cp-aws-kms-key-eks-${CLUSTER_NAME}-key"
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

cat > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/crossplane-aws/cp-aws-kms-key-eks-${CLUSTER_NAME}-key/cp-aws-kms-key-eks-${CLUSTER_NAME}-key.yaml" << \EOF
apiVersion: kms.aws.crossplane.io/v1alpha1
kind: Key
metadata:
  name: cp-aws-kms-key-eks-${CLUSTER_NAME}-key
  annotations:
    crossplane.io/external-name: ${AWS_KMS_KEY_ARN}
spec:
  forProvider:
    region: ${AWS_DEFAULT_REGION}
  providerConfigRef:
    name: aws-provider
EOF

[[ ! -s "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/crossplane-aws/kustomization.yaml" ]] && \
( cd "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/crossplane-aws" && kustomize create --autodetect && cd - || exit )

! grep -q '\- crossplane-aws$' "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kustomization.yaml" && \
  (
    cd "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps" && \
    kustomize edit add resource crossplane-aws && \
    cd - || exit
  )
```

#### Crate secret in Amazon Secret Manager

```bash
mkdir -vp "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/crossplane-aws/cp-aws-asm-secret-key"

cat > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/crossplane-aws/cp-aws-asm-secret-key.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: cp-aws-asm-secret-key
  namespace: flux-system
spec:
  decryption:
    provider: sops
  dependsOn:
    - name: cp-aws-kms-key-eks-${CLUSTER_NAME}-key
  interval: 5m
  path: "./clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/crossplane-aws/cp-aws-asm-secret-key"
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

if [[ ! -s "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/crossplane-aws/cp-aws-asm-secret-key/cp-aws-asm-secret-key.yaml" ]] ; then
  kubectl create secret generic cp-aws-asm-secret-key -n crossplane-system --dry-run=client -o yaml \
    --from-literal=username=myuser --from-literal=password=mytest12345 \
    > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/crossplane-aws/cp-aws-asm-secret-key/cp-aws-asm-secret-key.yaml"
  sops --encrypt --in-place "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/crossplane-aws/cp-aws-asm-secret-key/cp-aws-asm-secret-key.yaml"
fi

! grep -q 'name: cp-aws-asm-secret-key$' "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kustomization.yaml" && \
cat >> "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kustomization.yaml" << EOF
- |-
  apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
  kind: Kustomization
  metadata:
    name: cp-aws-asm-secret-key
    namespace: flux-system
  spec:
    patches:
      - target:
          group: secretsmanager.aws.crossplane.io
          kind: Secret
          name: cp-aws-asm-secret-key
        patch: |-
          apiVersion: secretsmanager.aws.crossplane.io/v1alpha1
          kind: Secret
          metadata:
            name: not-used
          spec:
            forProvider:
              tags:
                - key: Cluster
                  value: \${CLUSTER_FQDN}
                $(echo "${TAGS}" | sed "s/ /\\n                - key: /g; s/^/- key: /g; s/=/\n                  value: /g")
EOF

cat > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/crossplane-aws/cp-aws-asm-secret-key/asm-secretsmanager-secret-eks-${CLUSTER_NAME}-key.yaml" << \EOF
apiVersion: secretsmanager.aws.crossplane.io/v1alpha1
kind: Secret
metadata:
  name: cp-aws-asm-secret-key
spec:
  providerConfigRef:
    name: aws-provider
  forProvider:
    region: ${AWS_DEFAULT_REGION}
    description: "Secret for ${CLUSTER_FQDN}"
    kmsKeyIDRef:
      name: cp-aws-kms-key-eks-${CLUSTER_NAME}-key
    forceDeleteWithoutRecovery: true
    stringSecretRef:
      name: cp-aws-asm-secret-key
      namespace: crossplane-system
EOF

! grep -q "\- cp-aws-asm-secret-key.yaml$" "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/crossplane-aws/kustomization.yaml" && \
  (
    cd "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/crossplane-aws" && \
    kustomize edit add resource cp-aws-asm-secret-key.yaml && \
    cd - || exit
  )
```

### Istio

[Istio](https://istio.io/)

#### Jaeger

[Jaeger](https://www.jaegertracing.io/)

* [jaeger-operator](https://artifacthub.io/packages/helm/jaegertracing/jaeger-operator)
* [default values.yaml](https://github.com/jaegertracing/helm-charts/blob/main/charts/jaeger-operator/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/jaeger-operator

kubectl create namespace jaeger-operator --dry-run=client -o yaml > infrastructure/base/jaeger-operator/jaeger-operator-namespace.yaml

flux create helmrelease jaeger-operator \
  --namespace="jaeger-operator" \
  --interval="5m" \
  --source="HelmRepository/jaegertracing.flux-system" \
  --chart="jaeger-operator" \
  --chart-version="2.27.1" \
  --crds="CreateReplace" \
  --values-from="ConfigMap/jaeger-operator-values" \
  --export > infrastructure/base/jaeger-operator/jaeger-operator-helmrelease.yaml

[[ ! -s "infrastructure/base/jaeger-operator/kustomization.yaml" ]] && \
( cd "infrastructure/base/jaeger-operator" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/jaeger-operator`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/jaeger-operator/jaeger-operator-kustomization"

flux create kustomization jaeger-operator \
  --interval="5m" \
  --path="./infrastructure/\${ENVIRONMENT}/jaeger-operator/jaeger-operator-kustomization" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --wait \
  --export > "infrastructure/${ENVIRONMENT}/jaeger-operator/jaeger-operator-kustomization.yaml"

cat > "infrastructure/${ENVIRONMENT}/jaeger-operator/jaeger-operator-kustomization/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/jaeger-operator/jaeger-operator-kustomization/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: jaeger-operator
resources:
  - ../../../base/jaeger-operator
configMapGenerator:
  - name: jaeger-operator-values
    files:
      - values.yaml=jaeger-operator-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/jaeger-operator/jaeger-operator-kustomization/jaeger-operator-values.yaml" << \EOF
rbac:
  clusterRole: true
EOF

[[ ! -s "infrastructure/${ENVIRONMENT}/jaeger-operator/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/jaeger-operator" && kustomize create --autodetect && cd - || exit )

! grep -q '\- jaeger-operator$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource jaeger-operator && cd - || exit )
```

#### Deploy Jaeger using operator

[Jaeger](https://www.jaegertracing.io/)

* [Jaeger Operator](https://www.jaegertracing.io/docs/latest/operator/)

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/jaeger-controlplane/jaeger-controlplane-kustomization"

kubectl create namespace jaeger-system --dry-run=client -o yaml > "infrastructure/${ENVIRONMENT}/jaeger-controlplane/jaeger-controlplane-kustomization/jaeger-controlplane-namespace.yaml"

cat > "infrastructure/${ENVIRONMENT}/jaeger-controlplane/jaeger-controlplane-kustomization.yaml" << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: jaeger-controlplane
  namespace: flux-system
spec:
  dependsOn:
  - name: jaeger-operator
  interval: 5m
  path: ./infrastructure/${ENVIRONMENT}/jaeger-controlplane/jaeger-controlplane-kustomization
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

cat > "infrastructure/${ENVIRONMENT}/jaeger-controlplane/jaeger-controlplane-kustomization/jaeger-controlplane-jaeger.yaml" << \EOF
apiVersion: jaegertracing.io/v1
kind: Jaeger
metadata:
  name: jaeger-controlplane
  namespace: jaeger-system
spec:
  strategy: AllInOne
  allInOne:
    image: jaegertracing/all-in-one:1.28
    options:
      log-level: debug
  storage:
    type: memory
    options:
      memory:
        max-traces: 100000
  ingress:
    enabled: true
    ingressClassName: nginx
    annotations:
      nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/auth
      nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/start?rd=\$scheme://\$host\$request_uri
    hosts:
      - jaeger.${CLUSTER_FQDN}
    tls:
      - hosts:
        - jaeger.${CLUSTER_FQDN}
EOF

cat > "infrastructure/${ENVIRONMENT}/jaeger-controlplane/jaeger-controlplane-kustomization/jaeger-controlplane-rolebinding.yaml" << EOF
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: jaeger-controlplane-in-jaeger-system
  namespace: jaeger-system
subjects:
  - kind: ServiceAccount
    name: jaeger-operator
    namespace: jaeger-operator
roleRef:
  kind: Role
  name: jaeger-operator
  apiGroup: rbac.authorization.k8s.io
EOF

cat > "infrastructure/${ENVIRONMENT}/jaeger-controlplane/jaeger-controlplane-kustomization/jaeger-controlplane-podmonitor.yaml" << EOF
apiVersion: monitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: tracing
  namespace: jaeger-system
spec:
  podMetricsEndpoints:
  - interval: 5s
    port: "admin-http"
  selector:
    matchLabels:
      app: jaeger
EOF

[[ ! -s "infrastructure/${ENVIRONMENT}/jaeger-controlplane/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/jaeger-controlplane" && kustomize create --autodetect && cd - || exit )

! grep -q '\- jaeger-controlplane$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource jaeger-controlplane && cd - || exit )
```

#### istio-operator

[Istio Operator](https://istio.io/latest/docs/setup/install/operator/)

* [istio-operator](https://github.com/istio/istio/tree/master/manifests/charts/istio-operator)
* [default values.yaml](https://github.com/istio/istio/blob/master/manifests/charts/istio-operator/values.yaml)

Set Istio version:

```bash
export ISTIO_VERSION="1.12.0"
```

Add HelmRepository file to `infrastructure/sources`:

```bash
cat > infrastructure/sources/istio-operator-git.yaml << EOF
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: GitRepository
metadata:
  name: istio-operator
  namespace: flux-system
spec:
  interval: 1h
  timeout: 5m
  ref:
    tag: ${ISTIO_VERSION}
  url: https://github.com/istio/istio
EOF

[[ -f infrastructure/sources/kustomization.yaml ]] && rm infrastructure/sources/kustomization.yaml
cd infrastructure/sources && kustomize create --autodetect && cd - || exit
```

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/istio-operator

kubectl create namespace istio-operator --dry-run=client -o yaml > infrastructure/base/istio-operator/istio-operator-namespace.yaml

flux create helmrelease istio-operator \
  --namespace="istio-operator" \
  --interval="5m" \
  --source="GitRepository/istio-operator.flux-system" \
  --chart="manifests/charts/istio-operator" \
  --crds="CreateReplace" \
  --values-from="ConfigMap/istio-operator-values" \
  --export > infrastructure/base/istio-operator/istio-operator-helmrelease.yaml

[[ ! -s "infrastructure/base/istio-operator/kustomization.yaml" ]] && \
( cd "infrastructure/base/istio-operator" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/istio-operator`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/istio-operator/istio-operator-kustomization"

flux create kustomization istio-operator \
  --interval="5m" \
  --path="./infrastructure/\${ENVIRONMENT}/istio-operator/istio-operator-kustomization" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --wait \
  --export > "infrastructure/${ENVIRONMENT}/istio-operator/istio-operator-kustomization.yaml"

cat > "infrastructure/${ENVIRONMENT}/istio-operator/istio-operator-kustomization/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/istio-operator/istio-operator-kustomization/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: istio-operator
resources:
  - ../../../base/istio-operator
configMapGenerator:
  - name: istio-operator-values
    files:
      - values.yaml=istio-operator-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/istio-operator/istio-operator-kustomization/istio-operator-values.yaml" << EOF
hub: docker.io/istio
tag: ${ISTIO_VERSION}
EOF

[[ ! -s "infrastructure/${ENVIRONMENT}/istio-operator/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/istio-operator" && kustomize create --autodetect && cd - || exit )

! grep -q '\- istio-operator$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource istio-operator && cd - || exit )
```

#### Deploy Istio using operator

[Istio](https://istio.io)

* [Istio CRD](https://istio.io/latest/docs/reference/config/istio.operator.v1alpha1/)

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/istio-controlplane/istio-controlplane-kustomization"

kubectl create namespace istio-system --dry-run=client -o yaml > "infrastructure/${ENVIRONMENT}/istio-controlplane/istio-controlplane-kustomization/istio-controlplane-namespace.yaml"

curl -s "https://raw.githubusercontent.com/istio/istio/${ISTIO_VERSION}/samples/addons/extras/prometheus-operator.yaml" > "infrastructure/${ENVIRONMENT}/istio-controlplane/istio-controlplane-kustomization/istio-controlplane-prometheus.yaml"

cat > "infrastructure/${ENVIRONMENT}/istio-controlplane/istio-controlplane-kustomization.yaml" << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: istio-controlplane
  namespace: flux-system
spec:
  dependsOn:
  - name: jaeger-controlplane
  - name: istio-operator
  interval: 5m
  path: ./infrastructure/${ENVIRONMENT}/istio-controlplane/istio-controlplane-kustomization
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

cat > "infrastructure/${ENVIRONMENT}/istio-controlplane/istio-controlplane-kustomization/istio-controlplane-istiooperator.yaml" << \EOF
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  namespace: istio-system
  name: istio-controlplane
spec:
  profile: default
  meshConfig:
    enableTracing: true
    enableAutoMtls: true
    defaultConfig:
      tracing:
        zipkin:
          address: "jaeger-controlplane-collector-headless.jaeger-system.svc.cluster.local:9411"
        sampling: 100
      sds:
        enabled: true
  components:
    egressGateways:
      - name: istio-egressgateway
        enabled: true
    ingressGateways:
      - name: istio-ingressgateway
        enabled: true
        k8s:
          serviceAnnotations:
            service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp
            service.beta.kubernetes.io/aws-load-balancer-type: nlb
            service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: "${TAGS_INLINE}"
    pilot:
      k8s:
        # Reduce resource requirements for local testing. This is NOT recommended for the real use cases
        resources:
          limits:
            cpu: 200m
            memory: 128Mi
          requests:
            cpu: 100m
            memory: 64Mi
EOF

[[ ! -s "infrastructure/${ENVIRONMENT}/istio-controlplane/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/istio-controlplane" && kustomize create --autodetect && cd - || exit )

! grep -q '\- istio-controlplane$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource istio-controlplane && cd - || exit )
```

#### Keycloak

> I was not able to make Keycloak working with local Dex, because Dex is not
> using valid certificates (Let's Encrypt staging).

[Keycloak](https://www.keycloak.org/)

* [Keycloak](https://artifacthub.io/packages/helm/bitnami/keycloak)
* [default values.yaml](https://github.com/bitnami/charts/blob/master/bitnami/keycloak/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/keycloak

kubectl create namespace keycloak --dry-run=client -o yaml > "infrastructure/base/keycloak/keycloak-namespace.yaml"

cat > infrastructure/base/keycloak/keycloak-helmrelease.yaml << EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: keycloak
  namespace: keycloak
spec:
  chart:
    spec:
      chart: keycloak
      sourceRef:
        kind: HelmRepository
        name: bitnami
        namespace: flux-system
      version: 5.2.8
  timeout: 10m
  interval: 5m
  valuesFrom:
  - kind: ConfigMap
    name: keycloak-values
EOF

[[ ! -s "infrastructure/base/keycloak/kustomization.yaml" ]] && \
( cd "infrastructure/base/keycloak" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/keycloak`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/keycloak/keycloak-kustomization"

cat > "infrastructure/${ENVIRONMENT}/keycloak/keycloak-kustomization.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: keycloak
  namespace: flux-system
spec:
  dependsOn:
    - name: kube-prometheus-stack
  interval: 5m
  path: ./infrastructure/${ENVIRONMENT}/keycloak/keycloak-kustomization
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

cat > "infrastructure/${ENVIRONMENT}/keycloak/keycloak-kustomization/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/keycloak/keycloak-kustomization/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: keycloak
resources:
  - ../../../base/keycloak
configMapGenerator:
  - name: keycloak-values
    files:
      - values.yaml=keycloak-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/keycloak/keycloak-kustomization/keycloak-values.yaml" << \EOF
global:
  storageClass: "gp3"
clusterDomain: ${CLUSTER_FQDN}
auth:
  adminUser: admin
  adminPassword: ${MY_PASSWORD}
  managementUser: manager
  managementPassword: ${MY_PASSWORD}
proxyAddressForwarding: true
# https://stackoverflow.com/questions/51616770/keycloak-restricting-user-management-to-certain-groups-while-enabling-manage-us
extraStartupArgs: "-Dkeycloak.profile.feature.admin_fine_grained_authz=enabled"
keycloakConfigCli:
  enabled: true
  configuration:
    myrealm.yaml: |
      realm: myrealm
      enabled: true
      displayName: My Realm
      rememberMe: true
      userManagedAccessAllowed: true
      smtpServer:
        from: myrealm-keycloak@${CLUSTER_FQDN}
        fromDisplayName: Keycloak
        host: mailhog.mailhog.svc.cluster.local
        port: 1025
      clients:
      # https://oauth2-proxy.github.io/oauth2-proxy/docs/configuration/oauth_provider/#keycloak-auth-provider
      - clientId: oauth2-proxy-keycloak.${CLUSTER_FQDN}
        name: oauth2-proxy-keycloak.${CLUSTER_FQDN}
        description: "OAuth2 Proxy for Keycloak"
        secret: ${MY_PASSWORD}
        redirectUris:
        - "https://oauth2-proxy-keycloak.${CLUSTER_FQDN}/oauth2/callback"
        protocolMappers:
        - name: groupMapper
          protocol: openid-connect
          protocolMapper: oidc-group-membership-mapper
          config:
            userinfo.token.claim: "true"
            id.token.claim: "true"
            access.token.claim: "true"
            claim.name: groups
            full.path: "true"
      identityProviders:
      # https://ultimatesecurity.pro/post/okta-oidc/
      - alias: keycloak-oidc-okta
        displayName: "Okta"
        providerId: keycloak-oidc
        trustEmail: true
        config:
          clientId: ${OKTA_CLIENT_ID}
          clientSecret: ${OKTA_CLIENT_SECRET}
          tokenUrl: "${OKTA_ISSUER}/oauth2/default/v1/token"
          authorizationUrl: "${OKTA_ISSUER}/oauth2/default/v1/authorize"
          defaultScope: "openid profile email"
          syncMode: IMPORT
      users:
      - username: myuser1
        email: myuser1@${CLUSTER_FQDN}
        enabled: true
        firstName: My Firstname 1
        lastName: My Lastname 1
        groups:
          - group-admins
        credentials:
        - type: password
          value: ${MY_PASSWORD}
      - username: myuser2
        email: myuser2@${CLUSTER_FQDN}
        enabled: true
        firstName: My Firstname 2
        lastName: My Lastname 2
        groups:
          - group-admins
        credentials:
        - type: password
          value: ${MY_PASSWORD}
      - username: myuser3
        email: myuser3@${CLUSTER_FQDN}
        enabled: true
        firstName: My Firstname 3
        lastName: My Lastname 3
        groups:
          - group-users
        credentials:
        - type: password
          value: ${MY_PASSWORD}
      - username: myuser4
        email: myuser4@${CLUSTER_FQDN}
        enabled: true
        firstName: My Firstname 4
        lastName: My Lastname 4
        groups:
          - group-users
          - group-test
        credentials:
        - type: password
          value: ${MY_PASSWORD}
      groups:
      - name: group-users
      - name: group-admins
      - name: group-test
service:
  type: ClusterIP
ingress:
  enabled: true
  hostname: keycloak.${CLUSTER_FQDN}
  ingressClassName: nginx
  extraTls:
  - hosts:
    - keycloak.${CLUSTER_FQDN}
metrics:
  enabled: true
  serviceMonitor:
    enabled: true
postgresql:
  postgresqlPassword: ${MY_PASSWORD}
  persistence:
    enabled: true
    size: 1Gi
EOF

[[ ! -s "infrastructure/${ENVIRONMENT}/keycloak/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/keycloak" && kustomize create --autodetect && cd - || exit )

! grep -q '\- keycloak$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource keycloak && cd - || exit )
```

#### Kiali

[Kiali Operator](https://github.com/kiali/kiali-operator)

* [kiali-operator](https://github.com/kiali/helm-charts/tree/master/kiali-operator)
* [default values.yaml](https://github.com/kiali/helm-charts/blob/master/kiali-operator/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/kiali-operator

kubectl create namespace kiali-operator --dry-run=client -o yaml > "infrastructure/base/kiali-operator/kiali-operator-namespace.yaml"

flux create helmrelease kiali-operator \
  --namespace="kiali-operator" \
  --interval="5m" \
  --source="HelmRepository/kiali.flux-system" \
  --chart="kiali-operator" \
  --chart-version="1.44.0" \
  --crds="CreateReplace" \
  --export > infrastructure/base/kiali-operator/kiali-operator-helmrelease.yaml

[[ ! -s "infrastructure/base/kiali-operator/kustomization.yaml" ]] && \
( cd "infrastructure/base/kiali-operator" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/kiali-operator`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/kiali-operator/kiali-operator-kustomization"

flux create kustomization kiali-operator \
  --interval="5m" \
  --path="./infrastructure/\${ENVIRONMENT}/kiali-operator/kiali-operator-kustomization" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --wait \
  --export > "infrastructure/${ENVIRONMENT}/kiali-operator/kiali-operator-kustomization.yaml"

[[ ! -s "infrastructure/${ENVIRONMENT}/kiali-operator/kiali-operator-kustomization/kustomization.yaml" ]] && \
  (
    cd "infrastructure/${ENVIRONMENT}/kiali-operator/kiali-operator-kustomization" && \
    kustomize create --resources ../../../base/kiali-operator && \
    cd - || exit
  )

[[ ! -s "infrastructure/${ENVIRONMENT}/kiali-operator/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/kiali-operator" && kustomize create --autodetect && cd - || exit )

! grep -q '\- kiali-operator$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource kiali-operator && cd - || exit )
```

#### Deploy Kiali using operator

[Kiali](https://kiali.io/)

* [Kiali CRD](https://github.com/kiali/kiali-operator/blob/master/deploy/kiali/kiali_cr.yaml)

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/kiali-controlplane/kiali-controlplane-kustomization"

cat > "infrastructure/${ENVIRONMENT}/kiali-controlplane/kiali-controlplane-kustomization/kiali-controlplane-secret.yaml" << \EOF
apiVersion: v1
kind: Secret
metadata:
  name: kiali
  namespace: istio-system
data:
  oidc-secret: ${MY_PASSWORD_BASE64}
EOF

cat > "infrastructure/${ENVIRONMENT}/kiali-controlplane/kiali-controlplane-kustomization.yaml" << EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: kiali-controlplane
  namespace: flux-system
spec:
  dependsOn:
  - name: istio-controlplane
  interval: 5m
  path: ./infrastructure/${ENVIRONMENT}/kiali-controlplane/kiali-controlplane-kustomization
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

cat > "infrastructure/${ENVIRONMENT}/kiali-controlplane/kiali-controlplane-kustomization/kiali-controlplane-kiali.yaml" << \EOF
apiVersion: kiali.io/v1alpha1
kind: Kiali
metadata:
  namespace: istio-system
  name: kiali-controlplane
spec:
  istio_namespace: istio-system
  auth:
    strategy: openid
    openid:
      client_id: kiali.${CLUSTER_FQDN}
      disable_rbac: true
      insecure_skip_verify_tls: true
      issuer_uri: "https://dex.${CLUSTER_FQDN}"
      username_claim: email
  deployment:
    namespace: istio-system
    ingress:
      enabled: true
      override_yaml:
        spec:
          ingressClassName: nginx
          rules:
          - host: kiali.${CLUSTER_FQDN}
            http:
              paths:
              - path: /
                pathType: ImplementationSpecific
                backend:
                  service:
                    name: kiali
                    port:
                      number: 20001
            tls:
            - hosts:
              - kiali.${CLUSTER_FQDN}
  external_services:
    grafana:
      is_core_component: true
      url: "https://grafana.${CLUSTER_FQDN}"
      in_cluster_url: "http://kube-prometheus-stack-grafana.kube-prometheus-stack.svc.cluster.local:80"
    prometheus:
      is_core_component: true
      url: http://kube-prometheus-stack-prometheus.kube-prometheus-stack.svc.cluster.local:9090
    tracing:
      is_core_component: true
      url: https://jaeger.${CLUSTER_FQDN}
      in_cluster_url: http://jaeger-controlplane-query.jaeger-system.svc.cluster.local:16686
  server:
    web_fqdn: kiali.${CLUSTER_FQDN}
    web_root: /
EOF

[[ ! -s "infrastructure/${ENVIRONMENT}/kiali-controlplane/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/kiali-controlplane" && kustomize create --autodetect && cd - || exit )

! grep -q '\- kiali-controlplane$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource kiali-controlplane && cd - || exit )
```

### kuard

```bash
mkdir -vp "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kuard/kuard-secretproviderclass"

cat > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kuard/kuard-secretproviderclass.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: kuard-secretproviderclass
  namespace: flux-system
spec:
  dependsOn:
    - name: secrets-store-csi-driver-provider-aws
    - name: cp-aws-kms-key-eks-${CLUSTER_NAME}-key
  interval: 5m
  path: "./clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kuard/kuard-secretproviderclass"
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

cat > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kuard/kuard-secretproviderclass/kuard-secretproviderclass.yaml" << \EOF
apiVersion: secrets-store.csi.x-k8s.io/v1alpha1
kind: SecretProviderClass
metadata:
  name: kuard-asm-eks-${CLUSTER_NAME}-secrets
  namespace: kuard
spec:
  provider: aws
  parameters:
    objects: |
      - objectName: "cp-aws-asm-secret-key"
        objectType: "secretsmanager"
  secretObjects:
  - secretName: "cp-aws-asm-secret-key"
    type: Opaque
    data:
    - objectName: "cp-aws-asm-secret-key"
      key: username
    - objectName: "cp-aws-asm-secret-key"
      key: password
EOF
```

```bash
mkdir -vp "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kuard/kuard-manifests"
cat > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kuard/kuard-manifests.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: kuard-manifests
  namespace: flux-system
spec:
  dependsOn:
    - name: kuard-secretproviderclass
  interval: 5m
  path: "./clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kuard/kuard-manifests"
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

kubectl create service clusterip kuard --namespace kuard --tcp=8080:8080 --dry-run=client -o yaml > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kuard/kuard-manifests/kuard-service.yaml"

cat > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kuard/kuard-manifests/kuard-deployment.yaml" << \EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kuard-deployment
  namespace: kuard
  labels:
    app: kuard
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kuard
  template:
    metadata:
      labels:
        app: kuard
    spec:
      serviceAccountName: kuard-sa
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - topologyKey: "kubernetes.io/hostname"
            labelSelector:
              matchLabels:
                app: kuard
      volumes:
      - name: secrets-store-inline
        csi:
          driver: secrets-store.csi.k8s.io
          readOnly: true
          volumeAttributes:
            secretProviderClass: kuard-asm-eks-${CLUSTER_NAME}-secrets
      containers:
      - name: kuard-deployment
        image: gcr.io/kuar-demo/kuard-amd64:v0.10.0-green
        resources:
          requests:
            cpu: 100m
            memory: "64Mi"
          limits:
            cpu: 100m
            memory: "64Mi"
        ports:
        - containerPort: 8080
        volumeMounts:
        - name: secrets-store-inline
          mountPath: "/mnt/secrets-store"
          readOnly: true
EOF

kubectl create ingress \
  --annotation="nginx.ingress.kubernetes.io/auth-signin=https://oauth2-proxy.\${CLUSTER_FQDN}/oauth2/start?rd=\$scheme://\$host\$request_uri" \
  --annotation="nginx.ingress.kubernetes.io/auth-url=https://oauth2-proxy.\${CLUSTER_FQDN}/oauth2/auth" \
  --namespace kuard kuard \
  --class=nginx --rule="kuard.${CLUSTER_FQDN}/*=kuard:8080,tls" \
  -o yaml --dry-run=client > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kuard/kuard-manifests/kuard-ingress.yaml"

[[ ! -s "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kuard/kustomization.yaml" ]] && \
( cd "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kuard" && kustomize create --autodetect && cd - || exit )

! grep -q "\- kuard$" "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kustomization.yaml" && \
  (
    cd "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps" && \
    kustomize edit add resource kuard && \
    cd - || exit
  )
```

### kubed

[kubed](https://appscode.com/products/kubed/)

* [kubed](https://artifacthub.io/packages/helm/appscode/kubed)
* [default values.yaml](https://github.com/appscode/kubed/blob/master/charts/kubed/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/kubed

kubectl create namespace kubed --dry-run=client -o yaml > infrastructure/base/kubed/kubed-namespace.yaml

flux create helmrelease kubed \
  --namespace="kubed" \
  --interval="5m" \
  --source="HelmRepository/appscode.flux-system" \
  --chart="kubed" \
  --chart-version="v0.12.0" \
  --export > infrastructure/base/kubed/kubed-helmrelease.yaml

[[ ! -s "infrastructure/base/kubed/kustomization.yaml" ]] && \
( cd "infrastructure/base/kubed" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/kubed`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/kubed/kubed-kustomization"

flux create kustomization kubed \
  --interval="5m" \
  --path="./infrastructure/${ENVIRONMENT}/kubed/kubed-kustomization" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --wait \
  --export > "infrastructure/${ENVIRONMENT}/kubed/kubed-kustomization.yaml"

[[ ! -s "infrastructure/${ENVIRONMENT}/kubed/kubed-kustomization/kustomization.yaml" ]] && \
  (
    cd "infrastructure/${ENVIRONMENT}/kubed/kubed-kustomization" && \
    kustomize create --resources ../../../base/kubed && \
    cd - || exit
  )

[[ ! -s "infrastructure/${ENVIRONMENT}/kubed/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/kubed" && kustomize create --autodetect && cd - || exit )

! grep -q '\- kubed$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource kubed && cd - || exit )
```

### kubernetes-dashboard

[kubernetes-dashboard](https://github.com/kubernetes/dashboard)

* [kubernetes-dashboard](https://artifacthub.io/packages/helm/k8s-dashboard/kubernetes-dashboard)
* [default values.yaml](https://github.com/kubernetes/dashboard/blob/master/charts/helm-chart/kubernetes-dashboard/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/kubernetes-dashboard

kubectl create namespace kubernetes-dashboard --dry-run=client -o yaml > infrastructure/base/kubernetes-dashboard/kubernetes-dashboard-namespace.yaml

flux create helmrelease kubernetes-dashboard \
  --namespace="kubernetes-dashboard" \
  --interval="5m" \
  --source="HelmRepository/kubernetes-dashboard.flux-system" \
  --chart="kubernetes-dashboard" \
  --chart-version="5.0.5" \
  --values-from="ConfigMap/kubernetes-dashboard-values" \
  --export > infrastructure/base/kubernetes-dashboard/kubernetes-dashboard-helmrelease.yaml

[[ ! -s "infrastructure/base/kubernetes-dashboard/kustomization.yaml" ]] && \
( cd "infrastructure/base/kubernetes-dashboard" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/kubernetes-dashboard`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/kubernetes-dashboard/kubernetes-dashboard-kustomization"

cat > "infrastructure/${ENVIRONMENT}/kubernetes-dashboard/kubernetes-dashboard-kustomization.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: kubernetes-dashboard
  namespace: flux-system
spec:
  dependsOn:
    - name: kube-prometheus-stack
  interval: 5m
  path: "./infrastructure/${ENVIRONMENT}/kubernetes-dashboard/kubernetes-dashboard-kustomization"
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

cat > "infrastructure/${ENVIRONMENT}/kubernetes-dashboard/kubernetes-dashboard-kustomization/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/kubernetes-dashboard/kubernetes-dashboard-kustomization/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: kubernetes-dashboard
resources:
  - kubernetes-dashboard-clusterrolebinding.yaml
  - ../../../base/kubernetes-dashboard
configMapGenerator:
  - name: kubernetes-dashboard-values
    files:
      - values.yaml=kubernetes-dashboard-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/kubernetes-dashboard/kubernetes-dashboard-kustomization/kubernetes-dashboard-values.yaml" << \EOF
extraArgs:
  - --enable-skip-login
  - --enable-insecure-login
  - --disable-settings-authorizer
protocolHttp: true
ingress:
  enabled: true
  annotations:
     nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/auth
     nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/start?rd=$scheme://$host$request_uri
  className: "nginx"
  hosts:
    - kubernetes-dashboard.${CLUSTER_FQDN}
  tls:
    - hosts:
      - kubernetes-dashboard.${CLUSTER_FQDN}
settings:
  clusterName: ${CLUSTER_FQDN}
  itemsPerPage: 50
metricsScraper:
  enabled: true
serviceAccount:
  name: kubernetes-dashboard-admin
EOF

kubectl create clusterrolebinding kubernetes-dashboard-admin \
  --clusterrole=cluster-admin \
  --serviceaccount=kubernetes-dashboard:kubernetes-dashboard-admin \
  -o yaml --dry-run=client > "infrastructure/${ENVIRONMENT}/kubernetes-dashboard/kubernetes-dashboard-kustomization/kubernetes-dashboard-clusterrolebinding.yaml"

[[ ! -s "infrastructure/${ENVIRONMENT}/kubernetes-dashboard/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/kubernetes-dashboard" && kustomize create --autodetect && cd - || exit )

! grep -q '\- kubernetes-dashboard$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource kubernetes-dashboard && cd - || exit )
```

### Kyverno

[Kyverno](https://kyverno.io/)

* [kyverno](https://artifacthub.io/packages/helm/kyverno/kyverno)
* [default values.yaml](https://github.com/kyverno/kyverno/blob/main/charts/kyverno/values.yaml)

* [kyverno-policies](https://artifacthub.io/packages/helm/kyverno/kyverno-policies)
* [default values.yaml](https://github.com/kyverno/kyverno/blob/main/charts/kyverno-policies/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/kyverno

kubectl create namespace kyverno --dry-run=client -o yaml > infrastructure/base/kyverno/kyverno-namespace.yaml

flux create helmrelease kyverno \
  --namespace="kyverno" \
  --interval="5m" \
  --source="HelmRepository/kyverno.flux-system" \
  --chart="kyverno" \
  --chart-version="v2.1.3" \
  --values-from="ConfigMap/kyverno-values" \
  --export > infrastructure/base/kyverno/kyverno-helmrelease.yaml

[[ ! -s "infrastructure/base/kyverno/kustomization.yaml" ]] && \
( cd "infrastructure/base/kyverno" && kustomize create --autodetect && cd - || exit )

mkdir -vp infrastructure/base/kyverno-policies

flux create helmrelease kyverno-policies \
  --namespace="kyverno" \
  --interval="5m" \
  --depends-on="kyverno" \
  --source="HelmRepository/kyverno.flux-system" \
  --chart="kyverno-policies" \
  --chart-version="v2.1.3" \
  --export > infrastructure/base/kyverno-policies/kyverno-policies-helmrelease.yaml

[[ ! -s "infrastructure/base/kyverno-policies/kustomization.yaml" ]] && \
( cd "infrastructure/base/kyverno-policies" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/crossplane`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/kyverno/kyverno-kustomization"

flux create kustomization kyverno \
  --interval="5m" \
  --depends-on="kube-prometheus-stack" \
  --path="./infrastructure/\${ENVIRONMENT}/kyverno/kyverno-kustomization" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --wait \
  --export > "infrastructure/${ENVIRONMENT}/kyverno/kyverno-kustomization.yaml"

cat > "infrastructure/${ENVIRONMENT}/kyverno/kyverno-kustomization/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/kyverno/kyverno-kustomization/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: kyverno
resources:
  - ../../../base/kyverno
configMapGenerator:
  - name: kyverno-values
    files:
      - values.yaml=kyverno-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/kyverno/kyverno-kustomization/kyverno-values.yaml" << \EOF
serviceMonitor:
  enabled: true
EOF

[[ ! -s "infrastructure/${ENVIRONMENT}/kyverno/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/kyverno" && kustomize create --autodetect && cd - || exit )

! grep -q '\- kyverno$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource kyverno && cd - || exit )

mkdir -vp "infrastructure/${ENVIRONMENT}/kyverno-policies/kyverno-policies-kustomization"

flux create kustomization kyverno-policies \
  --interval="5m" \
  --depends-on="kyverno" \
  --path="./infrastructure/\${ENVIRONMENT}/kyverno-policies/kyverno-policies-kustomization" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --wait \
  --export > "infrastructure/${ENVIRONMENT}/kyverno-policies/kyverno-policies-kustomization.yaml"

[[ ! -s "infrastructure/${ENVIRONMENT}/kyverno-policies/kyverno-policies-kustomization/kustomization.yaml" ]] && \
  (
    cd "infrastructure/${ENVIRONMENT}/kyverno-policies/kyverno-policies-kustomization" && \
    kustomize create --resources ../../../base/kyverno-policies && \
    cd -  || exit
  )

[[ ! -s "infrastructure/${ENVIRONMENT}/kyverno-policies/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/kyverno-policies" && kustomize create --autodetect && cd - || exit )

! grep -q '\- kyverno-policies$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource kyverno-policies && cd - || exit )
```

### OAuth2 Proxy - Keycloak

[oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/)

* [oauth2-proxy](https://artifacthub.io/packages/helm/oauth2-proxy/oauth2-proxy)
* [default values.yaml](https://github.com/oauth2-proxy/manifests/blob/main/helm/oauth2-proxy/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/oauth2-proxy-keycloak

kubectl create namespace oauth2-proxy-keycloak --dry-run=client -o yaml > infrastructure/base/oauth2-proxy-keycloak/oauth2-proxy-keycloak-namespace.yaml

flux create helmrelease oauth2-proxy-keycloak \
  --namespace="oauth2-proxy-keycloak" \
  --interval="5m" \
  --source="HelmRepository/oauth2-proxy.flux-system" \
  --chart="oauth2-proxy" \
  --chart-version="5.0.6" \
  --values-from="ConfigMap/oauth2-proxy-keycloak-values" \
  --export > infrastructure/base/oauth2-proxy-keycloak/oauth2-proxy-keycloak-helmrelease.yaml

[[ ! -s "infrastructure/base/oauth2-proxy-keycloak/kustomization.yaml" ]] && \
( cd "infrastructure/base/oauth2-proxy-keycloak" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/oauth2-proxy-keycloak`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/oauth2-proxy-keycloak/oauth2-proxy-keycloak-kustomization"

cat > "infrastructure/${ENVIRONMENT}/oauth2-proxy-keycloak/oauth2-proxy-keycloak-kustomization.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: oauth2-proxy-keycloak
  namespace: flux-system
spec:
  dependsOn:
  - name: kube-prometheus-stack
  interval: 5m
  path: ./infrastructure/${ENVIRONMENT}/oauth2-proxy-keycloak/oauth2-proxy-keycloak-kustomization
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

cat > "infrastructure/${ENVIRONMENT}/oauth2-proxy-keycloak/oauth2-proxy-keycloak-kustomization/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/oauth2-proxy-keycloak/oauth2-proxy-keycloak-kustomization/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: oauth2-proxy-keycloak
resources:
  - ../../../base/oauth2-proxy-keycloak
configMapGenerator:
  - name: oauth2-proxy-keycloak-values
    files:
      - values.yaml=oauth2-proxy-keycloak-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/oauth2-proxy-keycloak/oauth2-proxy-keycloak-kustomization/oauth2-proxy-keycloak-values.yaml" << \EOF
config:
  clientID: oauth2-proxy-keycloak.${CLUSTER_FQDN}
  clientSecret: ${MY_PASSWORD}
  cookieSecret: ${MY_COOKIE_SECRET}
  configFile: |-
    email_domains = [ "*" ]
    upstreams = [ "file:///dev/null" ]
    whitelist_domains = ".${CLUSTER_FQDN}"
    cookie_domains = ".${CLUSTER_FQDN}"
    provider = "keycloak"
    login_url = "https://keycloak.${CLUSTER_FQDN}/auth/realms/myrealm/protocol/openid-connect/auth"
    redeem_url = "https://keycloak.${CLUSTER_FQDN}/auth/realms/myrealm/protocol/openid-connect/token"
    profile_url = "https://keycloak.${CLUSTER_FQDN}/auth/realms/myrealm/protocol/openid-connect/userinfo"
    validate_url = "https://keycloak.${CLUSTER_FQDN}/auth/realms/myrealm/protocol/openid-connect/userinfo"
    scope = "openid email profile"
    ssl_insecure_skip_verify = "true"
    insecure_oidc_skip_issuer_verification = "true"
ingress:
  enabled: true
  className: nginx
  hosts:
    - oauth2-proxy-keycloak.${CLUSTER_FQDN}
  tls:
    - hosts:
      - oauth2-proxy-keycloak.${CLUSTER_FQDN}
metrics:
  servicemonitor:
    enabled: true
EOF

[[ ! -s "infrastructure/${ENVIRONMENT}/oauth2-proxy-keycloak/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/oauth2-proxy-keycloak" && kustomize create --autodetect && cd - || exit )

! grep -q '\- oauth2-proxy-keycloak$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource oauth2-proxy-keycloak && cd - || exit )
```

### podinfo

[podinfo](https://github.com/stefanprodan/podinfo)

* [podinfo](https://artifacthub.io/packages/helm/podinfo/podinfo)
* [default values.yaml](https://github.com/stefanprodan/podinfo/blob/master/charts/podinfo/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/podinfo

kubectl create namespace podinfo --dry-run=client -o yaml > infrastructure/base/podinfo/podinfo-namespace.yaml

flux create helmrelease podinfo \
  --namespace="podinfo" \
  --interval="5m" \
  --source="HelmRepository/podinfo.flux-system" \
  --chart="podinfo" \
  --chart-version="6.0.3" \
  --values-from="ConfigMap/podinfo-values" \
  --export > infrastructure/base/podinfo/podinfo-helmrelease.yaml

[[ ! -s "infrastructure/base/podinfo/kustomization.yaml" ]] && \
( cd "infrastructure/base/podinfo" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/podinfo`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/podinfo/podinfo-kustomization"

cat > "infrastructure/${ENVIRONMENT}/podinfo/podinfo-kustomization.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: podinfo
  namespace: flux-system
spec:
  dependsOn:
    - name: kube-prometheus-stack
  interval: 5m
  path: "./infrastructure/${ENVIRONMENT}/podinfo/podinfo-kustomization"
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

cat > "infrastructure/${ENVIRONMENT}/podinfo/podinfo-kustomization/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/podinfo/podinfo-kustomization/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: podinfo
resources:
  - ../../../base/podinfo
configMapGenerator:
  - name: podinfo-values
    files:
      - values.yaml=podinfo-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/podinfo/podinfo-kustomization/podinfo-values.yaml" << \EOF
ingress:
  enabled: true
  className: nginx
  annotations:
    nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy-keycloak.${CLUSTER_FQDN}/oauth2/auth
    nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy-keycloak.${CLUSTER_FQDN}/oauth2/start?rd=$scheme://$host$request_uri
  hosts:
    - host: podinfo.${CLUSTER_FQDN}
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls:
    - hosts:
      - podinfo.${CLUSTER_FQDN}
serviceMonitor:
  enabled: true
EOF

[[ ! -s "infrastructure/${ENVIRONMENT}/podinfo/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/podinfo" && kustomize create --autodetect && cd - || exit )

! grep -q '\- podinfo$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource podinfo && cd - || exit )
```

### Polaris

Add Polaris to the single K8s cluster.

[Polaris](https://www.fairwinds.com/polaris)

* [polaris](https://artifacthub.io/packages/helm/fairwinds-stable/polaris)
* [default values.yaml](https://github.com/FairwindsOps/charts/blob/master/stable/polaris/values.yaml)

Add `HelmRepository` for polaris to "cluster level":

```bash
flux create source helm "fairwinds-stable" \
  --url="https://charts.fairwinds.com/stable" \
  --interval=1h \
  --export > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/sources/fairwinds-stable.yaml"

! grep -q '\- fairwinds-stable.yaml$' "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/sources/kustomization.yaml" && \
  (
    cd "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/sources/" && \
    kustomize edit add resource fairwinds-stable.yaml && \
    cd -  || exit
  )
```

Define "cluster level" application definition:

```bash
mkdir -pv "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/polaris"

kubectl create namespace polaris --dry-run=client -o yaml > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/polaris/polaris-namespace.yaml"

flux create helmrelease polaris \
  --namespace="polaris" \
  --interval="5m" \
  --source="HelmRepository/fairwinds-stable.flux-system" \
  --chart="polaris" \
  --chart-version="4.2.3" \
  --values-from="ConfigMap/polaris-values" \
  --export > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/polaris/polaris-helmrelease.yaml"

cat > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/polaris/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/polaris/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: polaris
resources:
  - polaris-namespace.yaml
  - polaris-helmrelease.yaml
configMapGenerator:
  - name: polaris-values
    files:
      - values.yaml=polaris-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/polaris/polaris-values.yaml" << \EOF
dashboard:
  ingress:
    enabled: true
    annotations:
      nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/auth
      nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/start?rd=$scheme://$host$request_uri
    hosts:
      - polaris.${CLUSTER_FQDN}
    tls:
      - hosts:
        - polaris.${CLUSTER_FQDN}
EOF

! grep -q '\- polaris$' "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/kustomization.yaml" && \
( cd "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps" && kustomize edit add resource polaris && cd - || exit )
```

### Policy Reporter

[Policy Reporter](https://github.com/kyverno/policy-reporter/wiki)

* [policy-reporter](https://github.com/kyverno/policy-reporter/tree/main/charts/policy-reporter)
* [default values.yaml](https://github.com/kyverno/policy-reporter/blob/main/charts/policy-reporter/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/policy-reporter

kubectl create namespace policy-reporter --dry-run=client -o yaml > infrastructure/base/policy-reporter/policy-reporter-namespace.yaml

flux create helmrelease policy-reporter \
  --namespace="policy-reporter" \
  --interval="5m" \
  --source="HelmRepository/policy-reporter.flux-system" \
  --chart="policy-reporter" \
  --chart-version="2.1.1" \
  --values-from="ConfigMap/policy-reporter-values" \
  --export > infrastructure/base/policy-reporter/policy-reporter-helmrelease.yaml

[[ ! -s "infrastructure/base/policy-reporter/kustomization.yaml" ]] && \
( cd "infrastructure/base/policy-reporter" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/cert-manager`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/policy-reporter/policy-reporter-kustomization"

cat > "infrastructure/${ENVIRONMENT}/policy-reporter/policy-reporter-kustomization.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: policy-reporter
  namespace: flux-system
spec:
  dependsOn:
  - name: kyverno
  - name: kube-prometheus-stack
  interval: 5m
  path: ./infrastructure/${ENVIRONMENT}/policy-reporter/policy-reporter-kustomization
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

cat > "infrastructure/${ENVIRONMENT}/policy-reporter/policy-reporter-kustomization/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/policy-reporter/policy-reporter-kustomization/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: policy-reporter
resources:
  - ../../../base/policy-reporter
  - policy-reporter-ingress.yaml
configMapGenerator:
  - name: policy-reporter-values
    files:
      - values.yaml=policy-reporter-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/policy-reporter/policy-reporter-kustomization/policy-reporter-values.yaml" << \EOF
ui:
  enabled: true
kyvernoPlugin:
  enabled: true
monitoring:
  enabled: true
  namespace: policy-reporter
global:
  plugins:
    keyverno: true
target:
  slack:
    webhook: "${SLACK_INCOMING_WEBHOOK_URL}"
    minimumPriority: "critical"
EOF

cat > "infrastructure/${ENVIRONMENT}/policy-reporter/policy-reporter-kustomization/policy-reporter-ingress.yaml" << \EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/start?rd=$scheme://$host$request_uri
    nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/auth
  name: policy-reporter
  namespace: policy-reporter
spec:
  ingressClassName: nginx
  rules:
  - host: policy-reporter.${CLUSTER_FQDN}
    http:
      paths:
      - backend:
          service:
            name: policy-reporter-ui
            port:
              number: 8080
        path: /
        pathType: Prefix
  tls:
  - hosts:
    - policy-reporter.${CLUSTER_FQDN}
EOF

[[ ! -s "infrastructure/${ENVIRONMENT}/policy-reporter/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/policy-reporter" && kustomize create --autodetect && cd - || exit )

! grep -q '\- policy-reporter$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource policy-reporter && cd - || exit )
```

### Rancher

[Rancher](https://rancher.com/)

* [rancher](https://github.com/rancher/rancher/tree/master/chart)
* [default values.yaml](https://github.com/rancher/rancher/blob/master/chart/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/rancher

flux create helmrelease rancher \
  --namespace="cattle-system" \
  --interval="5m" \
  --timeout="10m" \
  --source="HelmRepository/rancher-latest.flux-system" \
  --chart="rancher" \
  --chart-version="2.6.3" \
  --values-from="ConfigMap/rancher-values" \
  --export > infrastructure/base/rancher/rancher-helmrelease.yaml

[[ ! -s "infrastructure/base/rancher/kustomization.yaml" ]] && \
( cd "infrastructure/base/rancher" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/rancher`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/rancher/rancher-kustomization"

cat > "infrastructure/${ENVIRONMENT}/rancher/rancher-kustomization.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: rancher
  namespace: flux-system
spec:
  dependsOn:
    - name: kubed
    - name: cert-manager-certificate
  interval: 5m
  path: ./infrastructure/${ENVIRONMENT}/rancher/rancher-kustomization
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

cat > "infrastructure/${ENVIRONMENT}/rancher/rancher-kustomization/rancher-namespace.yaml" << \EOF
apiVersion: v1
kind: Namespace
metadata:
  name: cattle-system
  labels:
    cert-manager-cert-${LETSENCRYPT_ENVIRONMENT}: copy
EOF

cat > "infrastructure/${ENVIRONMENT}/rancher/rancher-kustomization/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/rancher/rancher-kustomization/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: cattle-system
resources:
  - rancher-namespace.yaml
  - ../../../base/rancher
configMapGenerator:
  - name: rancher-values
    files:
      - values.yaml=rancher-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/rancher/rancher-kustomization/rancher-values.yaml" << \EOF
hostname: rancher.${CLUSTER_FQDN}
ingress:
  extraAnnotations:
    nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/auth
    nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/start?rd=$scheme://$host$request_uri
  tls:
    source: secret
    secretName: ingress-cert-${LETSENCRYPT_ENVIRONMENT}
replicas: 1
bootstrapPassword: ${MY_PASSWORD}
EOF

[[ ! -s "infrastructure/${ENVIRONMENT}/rancher/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/rancher" && kustomize create --autodetect && cd - || exit )

! grep -q '\- rancher$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource rancher && cd - || exit )
```

### Secrets Store CSI driver

[secrets-store-csi-driver](https://secrets-store-csi-driver.sigs.k8s.io/)

* [secrets-store-csi-driver](https://github.com/kubernetes-sigs/secrets-store-csi-driver/tree/master/charts/secrets-store-csi-driver)
* [default values.yaml](https://github.com/kubernetes-sigs/secrets-store-csi-driver/blob/master/charts/secrets-store-csi-driver/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/secrets-store-csi-driver

kubectl create namespace secrets-store-csi-driver --dry-run=client -o yaml > infrastructure/base/secrets-store-csi-driver/secrets-store-csi-driver-namespace.yaml

flux create helmrelease secrets-store-csi-driver \
  --namespace="secrets-store-csi-driver" \
  --interval="5m" \
  --source="HelmRepository/secrets-store-csi-driver.flux-system" \
  --chart="secrets-store-csi-driver" \
  --chart-version="1.0.0" \
  --crds="CreateReplace" \
  --export > infrastructure/base/secrets-store-csi-driver/secrets-store-csi-driver-helmrelease.yaml

[[ ! -s "infrastructure/base/secrets-store-csi-driver/kustomization.yaml" ]] && \
( cd "infrastructure/base/secrets-store-csi-driver" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/crossplane`:

```bash
mkdir -pv "infrastructure/${ENVIRONMENT}/secrets-store-csi-driver"/secrets-store-csi-driver-{kustomization,kustomization-provider-aws}

flux create kustomization secrets-store-csi-driver \
  --interval="5m" \
  --path="./infrastructure/\${ENVIRONMENT}/secrets-store-csi-driver/secrets-store-csi-driver-kustomization" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --wait \
  --export > "infrastructure/${ENVIRONMENT}/secrets-store-csi-driver/secrets-store-csi-driver-kustomization.yaml"

[[ ! -s "infrastructure/${ENVIRONMENT}/secrets-store-csi-driver/secrets-store-csi-driver-kustomization/kustomization.yaml" ]] && \
  (
    cd "infrastructure/${ENVIRONMENT}/secrets-store-csi-driver/secrets-store-csi-driver-kustomization" && \
    kustomize create --resources ../../../base/secrets-store-csi-driver && \
    cd - || exit
  )

flux create kustomization secrets-store-csi-driver-provider-aws \
  --interval="5m" \
  --depends-on="secrets-store-csi-driver" \
  --path="./infrastructure/\${ENVIRONMENT}/secrets-store-csi-driver/secrets-store-csi-driver-kustomization-provider-aws" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --wait \
  --export > "infrastructure/${ENVIRONMENT}/secrets-store-csi-driver/secrets-store-csi-driver-kustomization-provider-aws.yaml"

cat > "infrastructure/${ENVIRONMENT}/secrets-store-csi-driver/secrets-store-csi-driver-kustomization-provider-aws/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: secrets-store-csi-driver
resources:
  - https://raw.githubusercontent.com/aws/secrets-store-csi-driver-provider-aws/807d3cea12264c518e2a5007d6009cee159c2917/deployment/aws-provider-installer.yaml
EOF

[[ ! -s "infrastructure/${ENVIRONMENT}/secrets-store-csi-driver/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/secrets-store-csi-driver" && kustomize create --autodetect && cd - || exit )

! grep -q '\- secrets-store-csi-driver$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource secrets-store-csi-driver && cd - || exit )
```

### Velero

[Velero](https://velero.io/)

* [velero](https://artifacthub.io/packages/helm/vmware-tanzu/velero)
* [default values.yaml](https://github.com/vmware-tanzu/helm-charts/blob/main/charts/velero/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/velero

flux create helmrelease velero \
  --namespace="velero" \
  --interval="5m" \
  --source="HelmRepository/vmware-tanzu.flux-system" \
  --chart="velero" \
  --chart-version="2.27.1" \
  --crds="CreateReplace" \
  --values-from="ConfigMap/velero-values" \
  --export > infrastructure/base/velero/velero-helmrelease.yaml

[[ ! -s "infrastructure/base/velero/kustomization.yaml" ]] && \
( cd "infrastructure/base/velero" && kustomize create --autodetect && cd - || exit )
```

Define "infrastructure level" application definition in
`infrastructure/${ENVIRONMENT}/velero`:

```bash
mkdir -vp "infrastructure/${ENVIRONMENT}/velero/velero-kustomization"

cat > "infrastructure/${ENVIRONMENT}/velero/velero-kustomization.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: velero
  namespace: flux-system
spec:
  dependsOn:
    - name: kube-prometheus-stack
    - name: external-snapshotter
  interval: 5m
  path: ./infrastructure/${ENVIRONMENT}/velero/velero-kustomization
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

cat > "infrastructure/${ENVIRONMENT}/velero/velero-kustomization/velero-volumesnapshotclass.yaml" << \EOF
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotClass
metadata:
  name: velero-csi-ebs-snapclass
  labels:
    velero.io/csi-volumesnapshot-class: "true"
driver: ebs.csi.aws.com
deletionPolicy: Delete
EOF

cat > "infrastructure/${ENVIRONMENT}/velero/velero-kustomization/kustomizeconfig.yaml" << \EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

cat > "infrastructure/${ENVIRONMENT}/velero/velero-kustomization/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: velero
resources:
  - velero-volumesnapshotclass.yaml
  - ../../../base/velero
configMapGenerator:
  - name: velero-values
    files:
      - values.yaml=velero-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

cat > "infrastructure/${ENVIRONMENT}/velero/velero-kustomization/velero-values.yaml" << \EOF
initContainers:
  - name: velero-plugin-for-aws
    image: velero/velero-plugin-for-aws:v1.3.0
    volumeMounts:
      - mountPath: /target
        name: plugins
  - name: velero-plugin-for-csi
    image: velero/velero-plugin-for-csi:v0.2.0
    volumeMounts:
      - mountPath: /target
        name: plugins
metrics:
  serviceMonitor:
    enabled: true
configuration:
  provider: aws
  backupStorageLocation:
    bucket: ${CLUSTER_FQDN}
    prefix: velero
    config:
      region: ${AWS_DEFAULT_REGION}
      # kmsKeyId: TODO !!!! xxxxx
  volumeSnapshotLocation:
    name: aws
    config:
      region: ${AWS_DEFAULT_REGION}
  features: EnableCSI
  defaultResticPruneFrequency: 71h
serviceAccount:
  server:
    create: false
    name: velero
credentials:
  useSecret: false
schedules:
  # https://doc.crds.dev/github.com/vmware-tanzu/velero/velero.io/Backup/v1@v1.5.1
  my-backup-all:
    disabled: false
    schedule: "0 */8 * * *"
    useOwnerReferencesInBackup: true
    template:
      ttl: 48h
EOF

[[ ! -s "infrastructure/${ENVIRONMENT}/velero/kustomization.yaml" ]] && \
( cd "infrastructure/${ENVIRONMENT}/velero" && kustomize create --autodetect && cd - || exit )

! grep -q '\- velero$' "infrastructure/${ENVIRONMENT}/kustomization.yaml" && \
( cd "infrastructure/${ENVIRONMENT}" && kustomize edit add resource velero && cd - || exit )
```

## Flux

Commit changes to git repository:

```bash
git add .
git commit -m "[${CLUSTER_NAME}] Add applications" || true
if [[ ! "$(git push 2>&1)" =~ ^Everything\ up-to-date ]] ; then
  flux reconcile source git flux-system
  sleep 10
fi
```

Go back to the main directory:

```bash
cd - || exit
```

Check Flux errors:

```bash
kubectl wait --timeout=30m --for=condition=ready kustomizations.kustomize.toolkit.fluxcd.io -n flux-system cluster-apps
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
echo "export KUBECONFIG=\"\${PWD}/tmp/${CLUSTER_FQDN}/kubeconfig-${CLUSTER_NAME}.conf\""
```
