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
mkdir -vp apps/base/aws-efs-csi-driver/helmrelease
yq e '.resources += ["aws-efs-csi-driver"]' -i apps/base/kustomization.yaml
cat > apps/base/aws-efs-csi-driver/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - aws-efs-csi-driver.yaml
EOF

flux create kustomization aws-efs-csi-driver \
  --namespace="aws-efs-csi-driver" \
  --interval="10m" \
  --path="./apps/base/aws-efs-csi-driver/helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/aws-efs-csi-driver.aws-efs-csi-driver" \
  --export > apps/base/aws-efs-csi-driver/aws-efs-csi-driver.yaml

cat > apps/base/aws-efs-csi-driver/helmrelease/aws-efs-csi-driver.yaml << \EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
# | aws-efs-csi-driver | 2.1.6 | aws-efs-csi-driver | https://kubernetes-sigs.github.io/aws-efs-csi-driver/
metadata:
  name: aws-efs-csi-driver
  namespace: aws-efs-csi-driver
spec:
  chart:
    spec:
      chart: aws-efs-csi-driver
      sourceRef:
        kind: HelmRepository
        name: aws-efs-csi-driver
        namespace: flux-system
      version: 2.1.6
  interval: 1h0m0s
  values:
    controller:
      serviceAccount:
        create: false
        name: efs-csi-controller-sa
EOF

yq e '.patchesStrategicMerge += ["aws-efs-csi-driver-helmrelease-values.yaml"]' -i "apps/${ENVIRONMENT}/base/kustomization.yaml"
cat > "apps/${ENVIRONMENT}/base/aws-efs-csi-driver-helmrelease-values.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: aws-efs-csi-driver
  namespace: aws-efs-csi-driver
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

yq eval-all ". as \$item ireduce ({}; . * \$item )" -i "clusters/${ENVIRONMENT}/${CLUSTER_FQDN}/apps-base.yaml" - << EOF
spec:
  patchesJson6902:
    - target:
        group: kustomize.toolkit.fluxcd.io
        kind: Kustomization
        name: aws-efs-csi-driver
        namespace: aws-efs-csi-driver
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
mkdir -vp apps/base/kubed/helmrelease
yq e '.resources += ["kubed"]' -i apps/base/kustomization.yaml
cat > apps/base/kubed/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace-kubed.yaml
  - kubed.yaml
EOF

cat > apps/base/kubed/namespace-kubed.yaml << \EOF
apiVersion: v1
kind: Namespace
metadata:
  name: kubed
EOF

flux create kustomization kubed \
  --namespace="kubed" \
  --interval="10m" \
  --path="./apps/base/kubed/helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/kubed.kubed" \
  --export > apps/base/kubed/kubed.yaml

cat > apps/base/kubed/helmrelease/kubed.yaml << \EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
# | kubed | v0.12.0 | appscode | https://charts.appscode.com/stable/
metadata:
  name: kubed
  namespace: kubed
spec:
  chart:
    spec:
      chart: kubed
      sourceRef:
        kind: HelmRepository
        name: appscode
        namespace: flux-system
      version: v0.12.0
  interval: 1h0m0s
EOF
```

### Kyverno

[Kyverno](https://kyverno.io/)

* [kyverno](https://artifacthub.io/packages/helm/kyverno/kyverno)
* [default values.yaml](https://github.com/kyverno/kyverno/blob/main/charts/kyverno/values.yaml):

```bash
mkdir -vp apps/base/kyverno/{kyverno-crds,kyverno}-helmrelease
yq e '.resources += ["kyverno"]' -i apps/base/kustomization.yaml
cat > apps/base/kyverno/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace-kyverno.yaml
  - kyverno-crds.yaml
  - kyverno.yaml
EOF

cat > apps/base/kyverno/namespace-kyverno.yaml << \EOF
apiVersion: v1
kind: Namespace
metadata:
  name: kyverno
EOF

flux create kustomization kyverno-crds \
  --namespace="kyverno" \
  --interval="10m" \
  --path="./apps/base/kyverno/kyverno-crds-helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/kyverno-crds.kyverno" \
  --export > apps/base/kyverno/kyverno-crds.yaml

cat > apps/base/kyverno/kyverno-crds-helmrelease/kyverno.yaml << \EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
# | kyverno-crds | v2.0.3 | kyverno | https://kyverno.github.io/kyverno/
metadata:
  name: kyverno-crds
  namespace: kyverno
spec:
  chart:
    spec:
      chart: kyverno-crds
      sourceRef:
        kind: HelmRepository
        name: kyverno
        namespace: flux-system
      version: v2.0.3
  interval: 1h0m0s
EOF

flux create kustomization kyverno \
  --namespace="kyverno" \
  --interval="10m" \
  --depends-on="kyverno-crds" \
  --path="./apps/base/kyverno/kyverno-helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/kyverno.kyverno" \
  --export > apps/base/kyverno/kyverno.yaml

cat > apps/base/kyverno/kyverno-helmrelease/kyverno.yaml << \EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
# | kyverno | v2.0.3 | kyverno | https://kyverno.github.io/kyverno/
metadata:
  name: kyverno
  namespace: kyverno
spec:
  chart:
    spec:
      chart: kyverno
      sourceRef:
        kind: HelmRepository
        name: kyverno
        namespace: flux-system
      version: v2.0.3
  interval: 1h0m0s
EOF

yq e '.patchesStrategicMerge += ["kyverno-helmrelease-values.yaml"]' -i "apps/${ENVIRONMENT}/base/kustomization.yaml"
cat > "apps/${ENVIRONMENT}/base/kyverno-helmrelease-values.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: kyverno
  namespace: kyverno
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
```

### Rancher

[Rancher](https://rancher.com/)

* [rancher](https://github.com/rancher/rancher/tree/master/chart)
* [default values.yaml](https://github.com/rancher/rancher/blob/master/chart/values.yaml):

```bash
mkdir -vp apps/base/rancher/helmrelease
yq e '.resources += ["rancher"]' -i apps/base/kustomization.yaml
cat > apps/base/rancher/kustomization.yaml << \EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace-rancher.yaml
  - rancher.yaml
EOF

cat > apps/base/rancher/namespace-rancher.yaml << \EOF
apiVersion: v1
kind: Namespace
metadata:
  name: cattle-system
  labels:
    cert-manager-cert-${LETSENCRYPT_ENVIRONMENT}: copy
EOF

cat > apps/base/rancher/rancher.yaml << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: rancher
  namespace: cattle-system
spec:
  interval: 5m
  dependsOn:
    - name: kubed
      namespace: kubed
    - name: cert-manager-certificate
      namespace: cert-manager
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  healthChecks:
    - apiVersion: helm.toolkit.fluxcd.io/v2beta1
      kind: HelmRelease
      name: rancher
      namespace: cattle-system
  path: "./apps/base/rancher/helmrelease"
  prune: true
  validation: client
EOF

flux create kustomization rancher \
  --namespace="cattle-system" \
  --interval="10m" \
  --depends-on="kubed/kubed,cert-manager/cert-manager-certificate" \
  --path="./apps/base/rancher/helmrelease" \
  --prune="true" \
  --source="GitRepository/flux-system.flux-system" \
  --validation="client" \
  --health-check="HelmRelease/rancher.cattle-system" \
  --export > apps/base/rancher/rancher.yaml

cat > apps/base/rancher/helmrelease/rancher.yaml << \EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
# | rancher | 2.6.0 | rancher-latest | https://releases.rancher.com/server-charts/latest
metadata:
  name: rancher
  namespace: cattle-system
spec:
  chart:
    spec:
      chart: rancher
      sourceRef:
        kind: HelmRepository
        name: rancher-latest
        namespace: flux-system
      version: 2.6.0
  interval: 1h0m0s
  values:
    hostname: rancher.cluster-fqdn
EOF

yq e '.patchesStrategicMerge += ["rancher-helmrelease-values.yaml"]' -i "apps/${ENVIRONMENT}/base/kustomization.yaml"
cat > "apps/${ENVIRONMENT}/base/rancher-helmrelease-values.yaml" << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: rancher
  namespace: cattle-system
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
