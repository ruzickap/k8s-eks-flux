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

cat > apps/base/aws-efs-csi-driver/aws-efs-csi-driver.yaml << \EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta1
kind: Kustomization
metadata:
  name: aws-efs-csi-driver
  namespace: aws-efs-csi-driver
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
      namespace: aws-efs-csi-driver
  path: "./apps/base/aws-efs-csi-driver/helmrelease"
  prune: true
  validation: client
EOF

cat > apps/base/aws-efs-csi-driver/helmrelease/aws-efs-csi-driver.yaml << \EOF
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
# | aws-efs-csi-driver | 2.1.6 | aws-efs-csi-driver | https://kubernetes-sigs.github.io/aws-efs-csi-driver/
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
        name: aws-ebs-csi-driver
        namespace: aws-ebs-csi-driver
      patch:
        - op: add
          path: /spec/patchesStrategicMerge/0/spec/values/controller/extraVolumeTags
          value:
            Name: ${GITHUB_USER}-${CLUSTER_NAME}
            Cluster: ${CLUSTER_FQDN}
            $(echo "${TAGS}" | sed "s/ /\\n            /g; s/=/: /g")
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
