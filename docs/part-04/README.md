# Applications

[[toc]]

## Applications definitions

### Amazon EFS CSI Driver

Install [Amazon EFS CSI Driver](https://github.com/kubernetes-sigs/aws-efs-csi-driver),
which supports ReadWriteMany PVC. Details can be found here:
[Introducing Amazon EFS CSI dynamic provisioning](https://aws.amazon.com/blogs/containers/introducing-efs-csi-dynamic-provisioning/)

[Amazon EFS CSI Driver](https://github.com/kubernetes-sigs/aws-efs-csi-driver)

* [aws-efs-csi-driver](https://github.com/kubernetes-sigs/aws-efs-csi-driver/tree/master/charts/aws-efs-csi-driver)
* [default values.yaml](https://github.com/kubernetes-sigs/aws-efs-csi-driver/blob/master/charts/aws-efs-csi-driver/values.yaml):

```bash
mkdir -vp apps/aws-efs-csi-driver/aws-efs-csi-driver-helmrelease
cat > apps/aws-efs-csi-driver/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - aws-efs-csi-driver.yaml
EOF

flux create kustomization aws-efs-csi-driver \
  --interval="10m" \
  --path="./apps/aws-efs-csi-driver/aws-efs-csi-driver-helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/aws-efs-csi-driver.aws-efs-csi-driver" \
  --export > apps/aws-efs-csi-driver/aws-efs-csi-driver.yaml

cat << \EOF |
controller:
  serviceAccount:
    create: false
    name: efs-csi-controller-sa
EOF
flux create helmrelease aws-efs-csi-driver \
  --namespace="aws-efs-csi-driver" \
  --interval="10m" \
  --source="HelmRepository/aws-efs-csi-driver.flux-system" \
  --chart="aws-efs-csi-driver" \
  --chart-version="2.2.0" \
  --values="/dev/stdin" \
  --export > apps/aws-efs-csi-driver/aws-efs-csi-driver-helmrelease/aws-efs-csi-driver.yaml

mkdir -vp "groups/${ENVIRONMENT}/apps/aws-efs-csi-driver/"
yq e '.resources += ["aws-efs-csi-driver"]' -i "groups/${ENVIRONMENT}/apps/kustomization.yaml"

cat > "groups/${ENVIRONMENT}/apps/aws-efs-csi-driver/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../../../apps/aws-efs-csi-driver
patchesStrategicMerge:
  - aws-efs-csi-driver-patch.yaml
EOF

cat > "groups/${ENVIRONMENT}/apps/aws-efs-csi-driver/aws-efs-csi-driver-patch.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: aws-efs-csi-driver
  namespace: flux-system
spec:
  patchesStrategicMerge:
    - apiVersion: helm.toolkit.fluxcd.io/v2beta1
      kind: HelmRelease
      metadata:
        name: aws-efs-csi-driver
        namespace: aws-efs-csi-driver
      spec:
        values:
          controller:
            serviceAccount:
              create: false
              name: efs-csi-controller-sa
EOF

yq eval-all 'select(fileIndex == 0) *+ select(fileIndex == 1)' -i "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/apps.yaml" - << EOF
spec:
  patchesJson6902:
    - target:
        group: kustomize.toolkit.fluxcd.io
        kind: Kustomization
        name: aws-efs-csi-driver
      patch:
        - op: add
          path: /spec/patchesStrategicMerge/0/spec/values/controller/tags
          value:
            Name: ${GITHUB_USER}-${CLUSTER_NAME}
            Cluster: ${CLUSTER_FQDN}
            $(echo "${TAGS}" | sed "s/ /\\n            /g; s/=/: /g")
EOF
```

### kubed

[kubed](https://appscode.com/products/kubed/)

* [kubed](https://artifacthub.io/packages/helm/appscode/kubed)
* [default values.yaml](https://github.com/appscode/kubed/blob/master/charts/kubed/values.yaml):

```bash
mkdir -vp apps/kubed/kubed-helmrelease
cat > apps/kubed/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - kubed-namespace.yaml
  - kubed.yaml
EOF

cat > apps/kubed/kubed-namespace.yaml << \EOF
apiVersion: v1
kind: Namespace
metadata:
  name: kubed
EOF

flux create kustomization kubed \
  --interval="10m" \
  --path="./apps/kubed/kubed-helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/kubed.kubed" \
  --export > apps/kubed/kubed.yaml

flux create helmrelease kubed \
  --namespace="kubed" \
  --interval="10m" \
  --source="HelmRepository/appscode.flux-system" \
  --chart="kubed" \
  --chart-version="v0.12.0" \
  --export > apps/kubed/kubed-helmrelease/kubed.yaml

yq e '.resources += ["../../../apps/kubed"]' -i "groups/${ENVIRONMENT}/apps/kustomization.yaml"
```

### Kyverno

[Kyverno](https://kyverno.io/)

* [kyverno](https://artifacthub.io/packages/helm/kyverno/kyverno)
* [default values.yaml](https://github.com/kyverno/kyverno/blob/main/charts/kyverno/values.yaml):

```bash
mkdir -vp apps/kyverno/{kyverno-crds,kyverno}-helmrelease
cat > apps/kyverno/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - kyverno-namespace.yaml
  - kyverno-crds.yaml
  - kyverno.yaml
EOF

cat > apps/kyverno/kyverno-namespace.yaml << \EOF
apiVersion: v1
kind: Namespace
metadata:
  name: kyverno
EOF

flux create kustomization kyverno-crds \
  --interval="10m" \
  --path="./apps/kyverno/kyverno-crds-helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/kyverno-crds.kyverno" \
  --export > apps/kyverno/kyverno-crds.yaml

flux create helmrelease kyverno-crds \
  --namespace="kyverno" \
  --interval="10m" \
  --source="HelmRepository/kyverno.flux-system" \
  --chart="kyverno-crds" \
  --chart-version="v2.0.3" \
  --export > apps/kyverno/kyverno-crds-helmrelease/kyverno-crds.yaml

flux create kustomization kyverno \
  --interval="10m" \
  --depends-on="kyverno-crds" \
  --path="./apps/kyverno/kyverno-helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/kyverno.kyverno" \
  --export > apps/kyverno/kyverno.yaml

flux create helmrelease kyverno \
  --namespace="kyverno" \
  --interval="10m" \
  --source="HelmRepository/kyverno.flux-system" \
  --chart="kyverno" \
  --chart-version="v2.0.3" \
  --export > apps/kyverno/kyverno-helmrelease/kyverno.yaml

mkdir -vp "groups/${ENVIRONMENT}/apps/kyverno/kyverno-policies"
yq e '.resources += ["kyverno"]' -i "groups/${ENVIRONMENT}/apps/kustomization.yaml"

cat > "groups/${ENVIRONMENT}/apps/kyverno/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../../../apps/kyverno
  - kyverno-policies.yaml
patchesStrategicMerge:
  - kyverno-patch.yaml
EOF

cat > "groups/${ENVIRONMENT}/apps/kyverno/kyverno-patch.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: kyverno
  namespace: flux-system
spec:
  patchesStrategicMerge:
    - apiVersion: helm.toolkit.fluxcd.io/v2beta1
      kind: HelmRelease
      metadata:
        name: kyverno
        namespace: kyverno
      spec:
        values:
          serviceMonitor:
            enabled: true
EOF

flux create kustomization kyverno-policies \
  --interval="10m" \
  --depends-on="kyverno" \
  --path="./groups/${ENVIRONMENT}/apps/kyverno/kyverno-policies" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --export > "groups/${ENVIRONMENT}/apps/kyverno/kyverno-policies.yaml"

cat > "groups/${ENVIRONMENT}/apps/kyverno/kyverno-policies/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - github.com/kyverno/policies/pod-security?ref=b872c896271baee0d9e2ef1933579d99ea7a16a6
patches:
  - patch: |-
      - op: replace
        path: /spec/validationFailureAction
        value: audit
    target:
      kind: ClusterPolicy
EOF
```

### Policy Reporter

[Policy Reporter](https://github.com/kyverno/policy-reporter/wiki)

* [policy-reporter](https://github.com/kyverno/policy-reporter/tree/main/charts/policy-reporter)
* [default values.yaml](https://github.com/kyverno/policy-reporter/blob/main/charts/policy-reporter/values.yaml):

```bash
mkdir -vp apps/policy-reporter/policy-reporter-helmrelease
cat > apps/policy-reporter/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - policy-reporter-namespace.yaml
  - policy-reporter.yaml
EOF

cat > apps/policy-reporter/policy-reporter-namespace.yaml << \EOF
apiVersion: v1
kind: Namespace
metadata:
  name: policy-reporter
EOF

flux create kustomization policy-reporter \
  --interval="10m" \
  --path="./apps/policy-reporter/policy-reporter-helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/policy-reporter.policy-reporter" \
  --export > apps/policy-reporter/policy-reporter.yaml

flux create helmrelease policy-reporter \
  --namespace="policy-reporter" \
  --interval="10m" \
  --source="HelmRepository/policy-reporter.flux-system" \
  --chart="policy-reporter" \
  --chart-version="1.9.4" \
  --export > apps/policy-reporter/policy-reporter-helmrelease/policy-reporter.yaml

mkdir -vp "groups/${ENVIRONMENT}/apps/policy-reporter/policy-reporter-ingress"
yq e '.resources += ["policy-reporter"]' -i "groups/${ENVIRONMENT}/apps/kustomization.yaml"

cat > "groups/${ENVIRONMENT}/apps/policy-reporter/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../../../apps/policy-reporter
  - policy-reporter-ingress-kustomization.yaml
patchesStrategicMerge:
  - policy-reporter-patch.yaml
EOF

cat > "groups/${ENVIRONMENT}/apps/policy-reporter/policy-reporter-patch.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: policy-reporter
  namespace: flux-system
spec:
  patchesStrategicMerge:
    - apiVersion: helm.toolkit.fluxcd.io/v2beta1
      kind: HelmRelease
      metadata:
        name: policy-reporter
        namespace: policy-reporter
      spec:
        values:
          ui:
            enabled: true
          kyvernoPlugin:
            enabled: true
          monitoring:
            enabled: false
          global:
            plugins:
              keyverno: true
          target:
            slack:
              webhook: "${SLACK_INCOMING_WEBHOOK_URL}"
              minimumPriority: "warning"
EOF

cat > "groups/${ENVIRONMENT}/apps/policy-reporter/policy-reporter-ingress-kustomization.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: policy-reporter-ingress
  namespace: flux-system
spec:
  dependsOn:
    - name: policy-reporter
  healthChecks:
    - apiVersion: networking.k8s.io/v1
      kind: Ingress
      name: policy-reporter
      namespace: policy-reporter
  interval: 5m
  path: "./groups/${ENVIRONMENT}/apps/policy-reporter/policy-reporter-ingress"
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  validation: client
  postBuild:
    substitute:
      CLUSTER_FQDN: ${CLUSTER_FQDN:=CLUSTER_FQDN}
EOF

cat > "groups/${ENVIRONMENT}/apps/policy-reporter/policy-reporter-ingress/policy-reporter-ingress.yaml" << \EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: policy-reporter
  namespace: policy-reporter
  annotations:
    nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/start?rd=$scheme://$host$request_uri
    nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/auth
spec:
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
        pathType: ImplementationSpecific
  tls:
  - hosts:
    - policy-reporter.${CLUSTER_FQDN}
EOF
```

### Rancher

[Rancher](https://rancher.com/)

* [rancher](https://github.com/rancher/rancher/tree/master/chart)
* [default values.yaml](https://github.com/rancher/rancher/blob/master/chart/values.yaml):

```bash
mkdir -vp apps/rancher/rancher-helmrelease
cat > apps/rancher/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - rancher-namespace.yaml
  - rancher.yaml
EOF

cat > apps/rancher/rancher-namespace.yaml << \EOF
apiVersion: v1
kind: Namespace
metadata:
  name: cattle-system
  labels:
    cert-manager-cert-${LETSENCRYPT_ENVIRONMENT}: copy
EOF

flux create kustomization rancher \
  --interval="10m" \
  --depends-on="kubed,cert-manager-certificate" \
  --path="./apps/rancher/rancher-helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/rancher.cattle-system" \
  --export > apps/rancher/rancher.yaml

cat << \EOF |
hostname: rancher.cluster-fqdn
EOF
flux create helmrelease rancher \
  --namespace="cattle-system" \
  --interval="10m" \
  --source="HelmRepository/rancher-latest.flux-system" \
  --chart="rancher" \
  --chart-version="2.6.0" \
  --values="/dev/stdin" \
  --export > apps/rancher/rancher-helmrelease/rancher.yaml

mkdir -vp "groups/${ENVIRONMENT}/apps/rancher/"
yq e '.resources += ["rancher"]' -i "groups/${ENVIRONMENT}/apps/kustomization.yaml"

cat > "groups/${ENVIRONMENT}/apps/rancher/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../../../apps/rancher
patchesStrategicMerge:
  - rancher-patch.yaml
EOF

cat > "groups/${ENVIRONMENT}/apps/rancher/rancher-patch.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: rancher
  namespace: flux-system
spec:
  patchesStrategicMerge:
    - apiVersion: helm.toolkit.fluxcd.io/v2beta1
      kind: HelmRelease
      metadata:
        name: rancher
        namespace: cattle-system
      spec:
        values:
          hostname: rancher.${CLUSTER_FQDN}
          ingress:
            extraAnnotations:
              nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/auth
              nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.${CLUSTER_FQDN}/oauth2/start?rd=\$scheme://\$host\$request_uri
            tls:
              source: secret
              secretName: ingress-cert-${LETSENCRYPT_ENVIRONMENT}
          replicas: 1
          bootstrapPassword: ${MY_PASSWORD}
EOF
```

### Secrets Store CSI driver

[secrets-store-csi-driver](https://secrets-store-csi-driver.sigs.k8s.io/)

* [secrets-store-csi-driver](https://github.com/kubernetes-sigs/secrets-store-csi-driver/tree/master/charts/secrets-store-csi-driver)
* [default values.yaml](https://github.com/kubernetes-sigs/secrets-store-csi-driver/blob/master/charts/secrets-store-csi-driver/values.yaml):

```bash
mkdir -vp apps/secrets-store-csi-driver/secrets-store-csi-driver-helmrelease
cat > apps/secrets-store-csi-driver/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - secrets-store-csi-driver-namespace.yaml
  - secrets-store-csi-driver.yaml
EOF

cat > apps/secrets-store-csi-driver/secrets-store-csi-driver-namespace.yaml << \EOF
apiVersion: v1
kind: Namespace
metadata:
  name: secrets-store-csi-driver
EOF

flux create kustomization secrets-store-csi-driver \
  --interval="10m" \
  --path="./apps/secrets-store-csi-driver/secrets-store-csi-driver-helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/secrets-store-csi-driver.secrets-store-csi-driver" \
  --export > apps/secrets-store-csi-driver/secrets-store-csi-driver.yaml

flux create helmrelease secrets-store-csi-driver \
  --namespace="secrets-store-csi-driver" \
  --interval="1h" \
  --source="HelmRepository/secrets-store-csi-driver.flux-system" \
  --chart="secrets-store-csi-driver" \
  --chart-version="0.3.0" \
  --export > apps/secrets-store-csi-driver/secrets-store-csi-driver-helmrelease/secrets-store-csi-driver.yaml

mkdir -pv "groups/${ENVIRONMENT}/apps/secrets-store-csi-driver"/secrets-store-csi-driver-provider-aws
yq e '.resources += ["secrets-store-csi-driver"]' -i "groups/${ENVIRONMENT}/apps/kustomization.yaml"

cat > "groups/${ENVIRONMENT}/apps/secrets-store-csi-driver/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../../../apps/secrets-store-csi-driver
  - secrets-store-csi-driver-provider-aws.yaml
patchesStrategicMerge:
  - secrets-store-csi-driver-patch.yaml
EOF

cat > "groups/${ENVIRONMENT}/apps/secrets-store-csi-driver/secrets-store-csi-driver-patch.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: secrets-store-csi-driver
  namespace: flux-system
spec:
  patchesStrategicMerge:
    - apiVersion: helm.toolkit.fluxcd.io/v2beta1
      kind: HelmRelease
      metadata:
        name: secrets-store-csi-driver
        namespace: secrets-store-csi-driver
      spec:
        values:
          syncSecret:
            enabled: true
EOF

flux create kustomization secrets-store-csi-driver-provider-aws \
  --interval="1h" \
  --depends-on="secrets-store-csi-driver" \
  --path="./groups/\${ENVIRONMENT}/apps/secrets-store-csi-driver/secrets-store-csi-driver-provider-aws" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/secrets-store-csi-driver.secrets-store-csi-driver" \
  --export > "groups/${ENVIRONMENT}/apps/secrets-store-csi-driver/secrets-store-csi-driver-provider-aws.yaml"

cat > "groups/${ENVIRONMENT}/apps/secrets-store-csi-driver/secrets-store-csi-driver-provider-aws/kustomization.yaml" << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - https://raw.githubusercontent.com/aws/secrets-store-csi-driver-provider-aws/807d3cea12264c518e2a5007d6009cee159c2917/deployment/aws-provider-installer.yaml
EOF
```

## Flux

Commit changes to git repository and "refresh" flux:

```bash
git add .
git commit -m "Add applications" || true
git push
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
