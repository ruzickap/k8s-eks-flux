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
  --chart-version="2.2.0" \
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
                  Name: ${GITHUB_USER}-\${CLUSTER_NAME}
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
* [default values.yaml](https://github.com/kubernetes/dashboard/blob/master/aio/deploy/helm-chart/kubernetes-dashboard/values.yaml)

Define "base level" application definition in `infrastructure`:

```bash
mkdir -vp infrastructure/base/kubernetes-dashboard

kubectl create namespace kubernetes-dashboard --dry-run=client -o yaml > infrastructure/base/kubernetes-dashboard/kubernetes-dashboard-namespace.yaml

flux create helmrelease kubernetes-dashboard \
  --namespace="kubernetes-dashboard" \
  --interval="5m" \
  --source="HelmRepository/kubernetes-dashboard.flux-system" \
  --chart="kubernetes-dashboard" \
  --chart-version="5.0.4" \
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

cat << \EOF |
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
flux create helmrelease polaris \
  --namespace="polaris" \
  --interval="5m" \
  --source="HelmRepository/fairwinds-stable.flux-system" \
  --chart="polaris" \
  --chart-version="4.2.1" \
  --values="/dev/stdin" \
  --export > "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/polaris/polaris-helmrelease.yaml"

[[ ! -s "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/polaris/kustomization.yaml" ]] && \
( cd "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/cluster-apps/polaris" && kustomize create --autodetect && cd - || exit )

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
  --chart-version="1.12.6" \
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
  interval: 5m0s
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
    minimumPriority: "warning"
EOF

kubectl create ingress \
  --annotation="nginx.ingress.kubernetes.io/auth-signin=https://oauth2-proxy.\${CLUSTER_FQDN}/oauth2/start?rd=\$scheme://\$host\$request_uri" \
  --annotation="nginx.ingress.kubernetes.io/auth-url=https://oauth2-proxy.\${CLUSTER_FQDN}/oauth2/auth" \
  --namespace policy-reporter policy-reporter \
  --class=nginx --rule="policy-reporter.${CLUSTER_FQDN}/*=policy-reporter-ui:8080,tls" \
  -o yaml --dry-run=client > "infrastructure/${ENVIRONMENT}/policy-reporter/policy-reporter-kustomization/policy-reporter-ingress.yaml"

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
  --source="HelmRepository/rancher-latest.flux-system" \
  --chart="rancher" \
  --chart-version="2.6.2" \
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
  interval: 5m0s
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

## Flux

Commit changes to git repository:

```bash
git add .
git commit -m "[${CLUSTER_NAME}] Add applications" || true
git push
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
