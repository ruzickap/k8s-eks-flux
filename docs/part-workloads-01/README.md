# Examples and tests

[[toc]]

Check the EKS nodes:

```bash
kubectl get nodes -o=custom-columns=NODE:.metadata.name,ARCH:.status.nodeInfo.architecture,OS-Image:.status.nodeInfo.osImage,OS:.status.nodeInfo.operatingSystem
```

## Backup Keycloak using CSI Volume Snapshotting

Install [velero](https://velero.io/):

```bash
if ! command -v velero &> /dev/null; then
  # https://github.com/vmware-tanzu/velero/releases/
  curl -s -L "https://github.com/vmware-tanzu/velero/releases/download/v1.7.1/velero-v1.7.1-linux-amd64.tar.gz" | sudo tar xzf - -C /usr/local/bin --wildcards --strip-components 1 "velero-*-linux-amd64/velero"
fi
```

Wait for velero and Keycloak to be fully ready:

```bash
kubectl wait --timeout=10m --for=condition=ready -n flux-system kustomizations keycloak velero
```

This example showing Velero backup using snapshots `features: EnableCSI`:

Run backup of `keycloak` namespace:

```bash
velero backup create backup-keycloak --ttl 24h --include-namespaces=keycloak --wait
sleep 50
```

Output:

```text
Backup request "backup-keycloak" submitted successfully.
Waiting for backup to complete. You may safely press ctrl-c to stop waiting - your backup will continue in the background.
....................................................
Backup completed with status: Completed. You may check for more information using the commands `velero backup describe backup-keycloak` and `velero backup logs backup-keycloak`
```

Check the backups:

```bash
velero get backups
```

Output:

```text
NAME                                  STATUS      ERRORS   WARNINGS   CREATED                         EXPIRES   STORAGE LOCATION   SELECTOR
backup-keycloak                       Completed   0        1          2021-12-15 21:08:09 +0100 CET   23h       default            <none>
velero-my-backup-all-20211215190046   Completed   0        2          2021-12-15 20:00:47 +0100 CET   1d        default            <none>
```

See the details of the `backup-keycloak`:

```bash
velero backup describe backup-keycloak --details --features=EnableCSI
```

Output:

```text
Name:         backup-keycloak
Namespace:    velero
Labels:       velero.io/storage-location=default
Annotations:  velero.io/source-cluster-k8s-gitversion=v1.21.2-eks-06eac09
              velero.io/source-cluster-k8s-major-version=1
              velero.io/source-cluster-k8s-minor-version=21+

Phase:  Completed

Errors:    0
Warnings:  1

Namespaces:
  Included:  keycloak
  Excluded:  <none>

Resources:
  Included:        *
  Excluded:        <none>
  Cluster-scoped:  auto

Label selector:  <none>

Storage Location:  default

Velero-Native Snapshot PVs:  auto

TTL:  24h0m0s

Hooks:  <none>

Backup Format Version:  1.1.0

Started:    2021-12-15 21:08:09 +0100 CET
Completed:  2021-12-15 21:08:57 +0100 CET

Expiration:  2021-12-16 21:08:04 +0100 CET

Total items to be backed up:  116
Items backed up:              116

Resource List:
  apiextensions.k8s.io/v1/CustomResourceDefinition:
    - apps.catalog.cattle.io
    - helmreleases.helm.toolkit.fluxcd.io
    - policyreports.wgpolicyk8s.io
    - servicemonitors.monitoring.coreos.com
  apps/v1/ControllerRevision:
    - keycloak/keycloak-7459d6979c
    - keycloak/keycloak-postgresql-7cb8b5cd68
  apps/v1/StatefulSet:
    - keycloak/keycloak
    - keycloak/keycloak-postgresql
  catalog.cattle.io/v1/App:
    - keycloak/keycloak
  discovery.k8s.io/v1/EndpointSlice:
    - keycloak/keycloak-957wx
    - keycloak/keycloak-headless-ljcmt
    - keycloak/keycloak-metrics-tzlm4
    - keycloak/keycloak-postgresql-7fckt
    - keycloak/keycloak-postgresql-headless-c8rdw
  extensions/v1beta1/Ingress:
    - keycloak/keycloak
  helm.toolkit.fluxcd.io/v2beta1/HelmRelease:
    - keycloak/keycloak
  monitoring.coreos.com/v1/ServiceMonitor:
    - keycloak/keycloak
  networking.k8s.io/v1/Ingress:
    - keycloak/keycloak
  rbac.authorization.k8s.io/v1/Role:
    - keycloak/crossplane-admin
    - keycloak/crossplane-edit
    - keycloak/crossplane-view
  snapshot.storage.k8s.io/v1/VolumeSnapshot:
    - keycloak/velero-data-keycloak-postgresql-0-twj92
  snapshot.storage.k8s.io/v1/VolumeSnapshotClass:
    - velero-csi-ebs-snapclass
  snapshot.storage.k8s.io/v1/VolumeSnapshotContent:
    - snapcontent-578fc8db-dabe-43d0-9925-2b38ff0bf0f2
  v1/ConfigMap:
    - keycloak/istio-ca-root-cert
    - keycloak/keycloak-env-vars
    - keycloak/keycloak-keycloak-config-cli-configmap
    - keycloak/keycloak-values-m72979dtm6
    - keycloak/kube-root-ca.crt
  v1/Endpoints:
    - keycloak/keycloak
    - keycloak/keycloak-headless
    - keycloak/keycloak-metrics
    - keycloak/keycloak-postgresql
    - keycloak/keycloak-postgresql-headless
  v1/Event:
    - keycloak/data-keycloak-postgresql-0.16c105e9880bcd1e
    - keycloak/data-keycloak-postgresql-0.16c105e98f408e05
    - keycloak/data-keycloak-postgresql-0.16c105e98f9c07fa
    - keycloak/data-keycloak-postgresql-0.16c105ea5a9bdef9
    - keycloak/data-keycloak-postgresql-0.16c106475732d2c4
    - keycloak/data-keycloak-postgresql-0.16c106479cf25294
    - keycloak/data-keycloak-postgresql-0.16c10647bd573771
    - keycloak/data-keycloak-postgresql-0.16c10648a864fa10
    - keycloak/keycloak-0.16c105e98ca3d375
    - keycloak/keycloak-0.16c105e99d7aaac8
    - keycloak/keycloak-0.16c105e9a38941d6
    - keycloak/keycloak-0.16c105e9ab97ec4d
    - keycloak/keycloak-0.16c105f2dc8a9941
    - keycloak/keycloak-0.16c1060110efb56d
    - keycloak/keycloak-0.16c1063da93d4d5d
    - keycloak/keycloak-0.16c106478b845269
    - keycloak/keycloak-0.16c106479c4a53dc
    - keycloak/keycloak-0.16c10647ac233371
    - keycloak/keycloak-0.16c10647b82b1d48
    - keycloak/keycloak-0.16c10650dc6f39e6
    - keycloak/keycloak-0.16c1066164616855
    - keycloak/keycloak-keycloak-config-cli-bpsds.16c10668f3c0f9f3
    - keycloak/keycloak-keycloak-config-cli-bpsds.16c10669163935c4
    - keycloak/keycloak-keycloak-config-cli-bpsds.16c106691a3e66e4
    - keycloak/keycloak-keycloak-config-cli-bpsds.16c106692233b224
    - keycloak/keycloak-keycloak-config-cli-zqxhv.16c1060ab3a5469d
    - keycloak/keycloak-keycloak-config-cli-zqxhv.16c1060ae37bdc7d
    - keycloak/keycloak-keycloak-config-cli-zqxhv.16c1060e280953f2
    - keycloak/keycloak-keycloak-config-cli-zqxhv.16c1060ea80d12dd
    - keycloak/keycloak-keycloak-config-cli-zqxhv.16c1060eaf88a74b
    - keycloak/keycloak-keycloak-config-cli.16c1060ab3392ba7
    - keycloak/keycloak-keycloak-config-cli.16c10612b448761b
    - keycloak/keycloak-keycloak-config-cli.16c10668f3945051
    - keycloak/keycloak-keycloak-config-cli.16c1066bbe040ed6
    - keycloak/keycloak-postgresql-0.16c105ea7c9a3dcf
    - keycloak/keycloak-postgresql-0.16c105eb0e1359e5
    - keycloak/keycloak-postgresql-0.16c105ec6f11dd26
    - keycloak/keycloak-postgresql-0.16c105ec7631ff10
    - keycloak/keycloak-postgresql-0.16c105ec875f7afa
    - keycloak/keycloak-postgresql-0.16c1063da1b8cef2
    - keycloak/keycloak-postgresql-0.16c1063e55e9e15f
    - keycloak/keycloak-postgresql-0.16c1063e564d7591
    - keycloak/keycloak-postgresql-0.16c10647ce7dce58
    - keycloak/keycloak-postgresql-0.16c10648c1dd7ca3
    - keycloak/keycloak-postgresql-0.16c1064952548726
    - keycloak/keycloak-postgresql-0.16c1064c952a575f
    - keycloak/keycloak-postgresql-0.16c1064c9b9573c3
    - keycloak/keycloak-postgresql-0.16c1064ca185c11c
    - keycloak/keycloak-postgresql.16c105e987fe6dbf
    - keycloak/keycloak-postgresql.16c105e98bae6fce
    - keycloak/keycloak.16c105e591234a28
    - keycloak/keycloak.16c105e62dc0f059
    - keycloak/keycloak.16c105e98a55c140
    - keycloak/keycloak.16c105e98df14fd2
    - keycloak/keycloak.16c1061422b763f7
    - keycloak/keycloak.16c10647a9688517
    - keycloak/keycloak.16c10647a9d06266
    - keycloak/keycloak.16c106484e815ed1
    - keycloak/keycloak.16c1066d2ff25528
    - keycloak/velero-data-keycloak-postgresql-0-pnrrd.16c10627ce82207d
    - keycloak/velero-data-keycloak-postgresql-0-pnrrd.16c10627ee0b0688
    - keycloak/velero-data-keycloak-postgresql-0-pnrrd.16c1062c726edfb2
  v1/Namespace:
    - keycloak
  v1/PersistentVolume:
    - pvc-4a83ef9b-6a42-44bf-a4fc-405fac3bc893
  v1/PersistentVolumeClaim:
    - keycloak/data-keycloak-postgresql-0
  v1/Pod:
    - keycloak/keycloak-0
    - keycloak/keycloak-postgresql-0
  v1/Secret:
    - keycloak/default-token-gb8gs
    - keycloak/default-token-ltjh5
    - keycloak/keycloak
    - keycloak/keycloak-postgresql
    - keycloak/keycloak-token-dxpxs
    - keycloak/sh.helm.release.v1.keycloak.v1
    - keycloak/sh.helm.release.v1.keycloak.v2
  v1/Service:
    - keycloak/keycloak
    - keycloak/keycloak-headless
    - keycloak/keycloak-metrics
    - keycloak/keycloak-postgresql
    - keycloak/keycloak-postgresql-headless
  v1/ServiceAccount:
    - keycloak/default
    - keycloak/keycloak
  wgpolicyk8s.io/v1alpha2/PolicyReport:
    - keycloak/polr-ns-keycloak

Velero-Native Snapshots: <none included>

CSI Volume Snapshots:
Snapshot Content Name: snapcontent-578fc8db-dabe-43d0-9925-2b38ff0bf0f2
  Storage Snapshot ID: snap-0dfd3b233f5ee6734
  Snapshot Size (bytes): 1073741824
  Ready to use: true
```

List all the `VolumeSnapshot` objects:

```bash
kubectl get volumesnapshots -n keycloak
```

Output:

```text
NAME                                      READYTOUSE   SOURCEPVC                    SOURCESNAPSHOTCONTENT   RESTORESIZE   SNAPSHOTCLASS              SNAPSHOTCONTENT                                    CREATIONTIME   AGE
velero-data-keycloak-postgresql-0-twj92   true         data-keycloak-postgresql-0                           1Gi           velero-csi-ebs-snapclass   snapcontent-578fc8db-dabe-43d0-9925-2b38ff0bf0f2   64s            65s
```

Check the `VolumeSnapshot` details:

```bash
kubectl describe volumesnapshots  -n keycloak --selector=velero.io/backup-name=backup-keycloak
```

Output:

```text
Name:         velero-data-keycloak-postgresql-0-twj92
Namespace:    keycloak
Labels:       velero.io/backup-name=backup-keycloak
Annotations:  <none>
API Version:  snapshot.storage.k8s.io/v1
Kind:         VolumeSnapshot
Metadata:
  Creation Timestamp:  2021-12-15T20:08:51Z
  Finalizers:
    snapshot.storage.kubernetes.io/volumesnapshot-as-source-protection
    snapshot.storage.kubernetes.io/volumesnapshot-bound-protection
  Generate Name:  velero-data-keycloak-postgresql-0-
  Generation:     1
  Managed Fields:
    API Version:  snapshot.storage.k8s.io/v1beta1
    Fields Type:  FieldsV1
    fieldsV1:
      f:metadata:
        f:generateName:
        f:labels:
          .:
          f:velero.io/backup-name:
      f:spec:
        .:
        f:source:
          .:
          f:persistentVolumeClaimName:
        f:volumeSnapshotClassName:
    Manager:      velero-plugin-for-csi
    Operation:    Update
    Time:         2021-12-15T20:08:51Z
    API Version:  snapshot.storage.k8s.io/v1
    Fields Type:  FieldsV1
    fieldsV1:
      f:metadata:
        f:finalizers:
          .:
          v:"snapshot.storage.kubernetes.io/volumesnapshot-as-source-protection":
          v:"snapshot.storage.kubernetes.io/volumesnapshot-bound-protection":
      f:status:
        .:
        f:boundVolumeSnapshotContentName:
        f:creationTime:
        f:readyToUse:
        f:restoreSize:
    Manager:         snapshot-controller
    Operation:       Update
    Time:            2021-12-15T20:08:52Z
  Resource Version:  76955
  UID:               578fc8db-dabe-43d0-9925-2b38ff0bf0f2
Spec:
  Source:
    Persistent Volume Claim Name:  data-keycloak-postgresql-0
  Volume Snapshot Class Name:      velero-csi-ebs-snapclass
Status:
  Bound Volume Snapshot Content Name:  snapcontent-578fc8db-dabe-43d0-9925-2b38ff0bf0f2
  Creation Time:                       2021-12-15T20:08:52Z
  Ready To Use:                        true
  Restore Size:                        1Gi
Events:
  Type    Reason            Age   From                 Message
  ----    ------            ----  ----                 -------
  Normal  CreatingSnapshot  66s   snapshot-controller  Waiting for a snapshot keycloak/velero-data-keycloak-postgresql-0-twj92 to be created by the CSI driver.
  Normal  SnapshotCreated   65s   snapshot-controller  Snapshot keycloak/velero-data-keycloak-postgresql-0-twj92 was successfully created by the CSI driver.
  Normal  SnapshotReady     53s   snapshot-controller  Snapshot keycloak/velero-data-keycloak-postgresql-0-twj92 is ready to use.
```

Get the `VolumeSnapshotContent`:

```bash
kubectl get volumesnapshotcontent --selector=velero.io/backup-name=backup-keycloak
```

Output:

```text
NAME                                               READYTOUSE   RESTORESIZE   DELETIONPOLICY   DRIVER            VOLUMESNAPSHOTCLASS        VOLUMESNAPSHOT                            VOLUMESNAPSHOTNAMESPACE   AGE
snapcontent-578fc8db-dabe-43d0-9925-2b38ff0bf0f2   true         1073741824    Delete           ebs.csi.aws.com   velero-csi-ebs-snapclass   velero-data-keycloak-postgresql-0-twj92   keycloak                  66s
```

```bash
kubectl describe volumesnapshotcontent --selector=velero.io/backup-name=backup-keycloak
```

Output:

```text
Name:         snapcontent-578fc8db-dabe-43d0-9925-2b38ff0bf0f2
Namespace:
Labels:       velero.io/backup-name=backup-keycloak
Annotations:  <none>
API Version:  snapshot.storage.k8s.io/v1
Kind:         VolumeSnapshotContent
Metadata:
  Creation Timestamp:  2021-12-15T20:08:51Z
  Finalizers:
    snapshot.storage.kubernetes.io/volumesnapshotcontent-bound-protection
  Generation:  1
  Managed Fields:
    API Version:  snapshot.storage.k8s.io/v1
    Fields Type:  FieldsV1
    fieldsV1:
      f:metadata:
        f:finalizers:
          .:
          v:"snapshot.storage.kubernetes.io/volumesnapshotcontent-bound-protection":
      f:spec:
        .:
        f:deletionPolicy:
        f:driver:
        f:source:
          .:
          f:volumeHandle:
        f:volumeSnapshotClassName:
        f:volumeSnapshotRef:
          .:
          f:apiVersion:
          f:kind:
          f:name:
          f:namespace:
          f:resourceVersion:
          f:uid:
    Manager:      snapshot-controller
    Operation:    Update
    Time:         2021-12-15T20:08:51Z
    API Version:  snapshot.storage.k8s.io/v1beta1
    Fields Type:  FieldsV1
    fieldsV1:
      f:metadata:
        f:labels:
          .:
          f:velero.io/backup-name:
    Manager:      velero-plugin-for-csi
    Operation:    Update
    Time:         2021-12-15T20:08:56Z
    API Version:  snapshot.storage.k8s.io/v1beta1
    Fields Type:  FieldsV1
    fieldsV1:
      f:status:
        .:
        f:creationTime:
        f:readyToUse:
        f:restoreSize:
        f:snapshotHandle:
    Manager:         csi-snapshotter
    Operation:       Update
    Time:            2021-12-15T20:09:02Z
  Resource Version:  76946
  UID:               b37cece5-6775-4e1d-a555-76c3df730347
Spec:
  Deletion Policy:  Delete
  Driver:           ebs.csi.aws.com
  Source:
    Volume Handle:             vol-0c161d8a582759e52
  Volume Snapshot Class Name:  velero-csi-ebs-snapclass
  Volume Snapshot Ref:
    API Version:       snapshot.storage.k8s.io/v1
    Kind:              VolumeSnapshot
    Name:              velero-data-keycloak-postgresql-0-twj92
    Namespace:         keycloak
    Resource Version:  76730
    UID:               578fc8db-dabe-43d0-9925-2b38ff0bf0f2
Status:
  Creation Time:    1639598932074000000
  Ready To Use:     true
  Restore Size:     1073741824
  Snapshot Handle:  snap-0dfd3b233f5ee6734
Events:             <none>
```

Check the snapshots in AWS:

```bash
AWS_SNAPSHOT_ID=$(velero backup describe backup-keycloak --details --features=EnableCSI | sed -n 's/.*Storage Snapshot ID: \(.*\)/\1/p')
aws ec2 describe-snapshots --snapshot-ids "${AWS_SNAPSHOT_ID}"
```

Output:

```json
{
    "Snapshots": [
        {
            "Description": "Created by AWS EBS CSI driver for volume vol-0c161d8a582759e52",
            "Encrypted": true,
            "KmsKeyId": "arn:aws:kms:eu-central-1:729560437327:key/a753d4d9-5006-4bea-8351-34092cd7b34e",
            "OwnerId": "729560437327",
            "Progress": "100%",
            "SnapshotId": "snap-0dfd3b233f5ee6734",
            "StartTime": "2021-12-15T20:08:52.074000+00:00",
            "State": "completed",
            "VolumeId": "vol-0c161d8a582759e52",
            "VolumeSize": 1,
            "Tags": [
                {
                    "Key": "Cluster",
                    "Value": "kube1.k8s.mylabs.dev"
                },
                {
                    "Key": "ebs.csi.aws.com/cluster",
                    "Value": "true"
                },
                {
                    "Key": "kubernetes.io/cluster/kube1.k8s.mylabs.dev",
                    "Value": "owned"
                },
                {
                    "Key": "CSIVolumeSnapshotName",
                    "Value": "snapshot-578fc8db-dabe-43d0-9925-2b38ff0bf0f2"
                },
                {
                    "Key": "Environment",
                    "Value": "dev"
                },
                {
                    "Key": "Name",
                    "Value": "ruzickap-kube1"
                },
                {
                    "Key": "Group",
                    "Value": "Cloud_Native"
                },
                {
                    "Key": "Owner",
                    "Value": "petr.ruzicka@gmail.com"
                },
                {
                    "Key": "Squad",
                    "Value": "Cloud_Container_Platform"
                }
            ],
            "StorageTier": "standard"
        }
    ]
}
```

See the files in S3 bucket:

```bash
aws s3 ls --recursive "s3://${CLUSTER_FQDN}/velero/"
```

Output:

```text
2021-12-15 21:08:58        751 velero/backups/backup-keycloak/backup-keycloak-csi-volumesnapshotcontents.json.gz
2021-12-15 21:08:58        567 velero/backups/backup-keycloak/backup-keycloak-csi-volumesnapshots.json.gz
2021-12-15 21:08:58      12472 velero/backups/backup-keycloak/backup-keycloak-logs.gz
2021-12-15 21:08:58         29 velero/backups/backup-keycloak/backup-keycloak-podvolumebackups.json.gz
2021-12-15 21:08:58       1344 velero/backups/backup-keycloak/backup-keycloak-resource-list.json.gz
2021-12-15 21:08:58         29 velero/backups/backup-keycloak/backup-keycloak-volumesnapshots.json.gz
2021-12-15 21:08:58     285689 velero/backups/backup-keycloak/backup-keycloak.tar.gz
2021-12-15 21:08:58       2164 velero/backups/backup-keycloak/velero-backup.json
2021-12-15 20:02:41       2841 velero/backups/velero-my-backup-all-20211215190046/velero-backup.json
2021-12-15 20:02:42        949 velero/backups/velero-my-backup-all-20211215190046/velero-my-backup-all-20211215190046-csi-volumesnapshotcontents.json.gz
2021-12-15 20:02:42        709 velero/backups/velero-my-backup-all-20211215190046/velero-my-backup-all-20211215190046-csi-volumesnapshots.json.gz
2021-12-15 20:02:41     138637 velero/backups/velero-my-backup-all-20211215190046/velero-my-backup-all-20211215190046-logs.gz
2021-12-15 20:02:42         29 velero/backups/velero-my-backup-all-20211215190046/velero-my-backup-all-20211215190046-podvolumebackups.json.gz
2021-12-15 20:02:42      36008 velero/backups/velero-my-backup-all-20211215190046/velero-my-backup-all-20211215190046-resource-list.json.gz
2021-12-15 20:02:42         29 velero/backups/velero-my-backup-all-20211215190046/velero-my-backup-all-20211215190046-volumesnapshots.json.gz
2021-12-15 20:02:41    7672082 velero/backups/velero-my-backup-all-20211215190046/velero-my-backup-all-20211215190046.tar.gz
```

## Delete + Restore Keycloak using CSI Volume Snapshotting

Check the `keycloak` namespace and it's objects:

```bash
kubectl get -n keycloak configmap,helmrelease,ingress,pvc,pod,secret,svc,statefulset,volumesnapshot
```

Output:

```text
NAME                                               DATA   AGE
configmap/istio-ca-root-cert                       1      6m47s
configmap/keycloak-env-vars                        13     6m6s
configmap/keycloak-keycloak-config-cli-configmap   1      6m6s
configmap/keycloak-values-m72979dtm6               1      6m6s
configmap/kube-root-ca.crt                         1      6m47s

NAME                                          READY   STATUS                             AGE
helmrelease.helm.toolkit.fluxcd.io/keycloak   True    Release reconciliation succeeded   6m5s

NAME                                 CLASS   HOSTS                           ADDRESS                                                                            PORTS     AGE
ingress.networking.k8s.io/keycloak   nginx   keycloak.kube1.k8s.mylabs.dev   aefab38aac442424293f32d19a1abba8-bcefcbb2484170a1.elb.eu-central-1.amazonaws.com   80, 443   6m5s

NAME                                               STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
persistentvolumeclaim/data-keycloak-postgresql-0   Bound    pvc-4a83ef9b-6a42-44bf-a4fc-405fac3bc893   1Gi        RWO            gp3            6m7s

NAME                        READY   STATUS    RESTARTS   AGE
pod/keycloak-0              1/1     Running   0          6m6s
pod/keycloak-postgresql-0   1/1     Running   0          6m6s

NAME                                    TYPE                                  DATA   AGE
secret/default-token-gb8gs              kubernetes.io/service-account-token   3      6m7s
secret/default-token-ltjh5              kubernetes.io/service-account-token   3      6m46s
secret/keycloak                         Opaque                                2      6m6s
secret/keycloak-postgresql              Opaque                                2      6m7s
secret/keycloak-token-dxpxs             kubernetes.io/service-account-token   3      6m6s
secret/sh.helm.release.v1.keycloak.v1   helm.sh/release.v1                    1      6m6s
secret/sh.helm.release.v1.keycloak.v2   helm.sh/release.v1                    1      5m37s

NAME                                   TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
service/keycloak                       ClusterIP   10.100.182.109   <none>        80/TCP,443/TCP   6m6s
service/keycloak-headless              ClusterIP   None             <none>        80/TCP           6m6s
service/keycloak-metrics               ClusterIP   10.100.3.80      <none>        9990/TCP         6m6s
service/keycloak-postgresql            ClusterIP   10.100.10.220    <none>        5432/TCP         6m6s
service/keycloak-postgresql-headless   ClusterIP   None             <none>        5432/TCP         6m6s

NAME                                   READY   AGE
statefulset.apps/keycloak              1/1     6m6s
statefulset.apps/keycloak-postgresql   1/1     6m6s

NAME                                                                             READYTOUSE   SOURCEPVC                    SOURCESNAPSHOTCONTENT   RESTORESIZE   SNAPSHOTCLASS              SNAPSHOTCONTENT                                    CREATIONTIME   AGE
volumesnapshot.snapshot.storage.k8s.io/velero-data-keycloak-postgresql-0-twj92   true         data-keycloak-postgresql-0                           1Gi           velero-csi-ebs-snapclass   snapcontent-578fc8db-dabe-43d0-9925-2b38ff0bf0f2   78s            79s
```

Remove Keycloak objects from `keycloak` namespace - simulate unfortunate
deletion objects:

```bash
kubectl delete helmrelease -n keycloak keycloak
kubectl delete -n keycloak pvc,configmap,secret --all
sleep 5
kubectl get -n keycloak configmap,helmrelease,ingress,pvc,pod,secret,svc,statefulset,volumesnapshot
```

Output:

```text
NAME                           DATA   AGE
configmap/istio-ca-root-cert   1      37s
configmap/kube-root-ca.crt     1      37s

NAME                         TYPE                                  DATA   AGE
secret/default-token-78b2g   kubernetes.io/service-account-token   3      36s

NAME                                                                             READYTOUSE   SOURCEPVC                    SOURCESNAPSHOTCONTENT   RESTORESIZE   SNAPSHOTCLASS              SNAPSHOTCONTENT                                    CREATIONTIME   AGE
volumesnapshot.snapshot.storage.k8s.io/velero-data-keycloak-postgresql-0-twj92   true         data-keycloak-postgresql-0                           1Gi           velero-csi-ebs-snapclass   snapcontent-578fc8db-dabe-43d0-9925-2b38ff0bf0f2   2m10s          2m11s
```

Restore objects in `keycloak` namespace:

```bash
velero restore create restore-keycloak --from-backup backup-keycloak --include-namespaces keycloak --wait
```

Output:

```text
Restore request "restore-keycloak" submitted successfully.
Waiting for restore to complete. You may safely press ctrl-c to stop waiting - your restore will continue in the background.
.....
Restore completed with status: Completed. You may check for more information using the commands `velero restore describe restore-keycloak` and `velero restore logs restore-keycloak`.
```

Get recovery list:

```bash
velero restore get
```

Output:

```text
NAME               BACKUP            STATUS      STARTED                         COMPLETED                       ERRORS   WARNINGS   CREATED                         SELECTOR
restore-keycloak   backup-keycloak   Completed   2021-12-15 21:11:03 +0100 CET   2021-12-15 21:11:07 +0100 CET   0        3          2021-12-15 21:11:02 +0100 CET   <none>
```

Get the details about recovery:

```bash
velero restore describe restore-keycloak
kubectl wait --timeout=10m --namespace flux-system --for=condition=Ready kustomization keycloak
kubectl get -n keycloak configmap,helmrelease,ingress,pvc,pod,secret,svc,statefulset,volumesnapshot
```

Output:

```text
Name:         restore-keycloak
Namespace:    velero
Labels:       <none>
Annotations:  <none>

Phase:                       Completed
Total items to be restored:  47
Items restored:              47

Started:    2021-12-15 21:11:03 +0100 CET
Completed:  2021-12-15 21:11:07 +0100 CET

Warnings:
  Velero:     <none>
  Cluster:    <none>
  Namespaces:
    keycloak:  could not restore, volumesnapshots.snapshot.storage.k8s.io "velero-data-keycloak-postgresql-0-twj92" already exists. Warning: the in-cluster version is different than the backed-up version.
               could not restore, apps.catalog.cattle.io "keycloak" already exists. Warning: the in-cluster version is different than the backed-up version.
               could not restore, ingresses.networking.k8s.io "keycloak" already exists. Warning: the in-cluster version is different than the backed-up version.

Backup:  backup-keycloak

Namespaces:
  Included:  keycloak
  Excluded:  <none>

Resources:
  Included:        *
  Excluded:        nodes, events, events.events.k8s.io, backups.velero.io, restores.velero.io, resticrepositories.velero.io
  Cluster-scoped:  auto

Namespace mappings:  <none>

Label selector:  <none>

Restore PVs:  auto

Preserve Service NodePorts:  auto
```

Delete the backup

```bash
velero backup delete backup-keycloak --confirm
```

Output:

```text
Request to delete backup "backup-keycloak" submitted successfully.
The backup will be fully deleted after all associated data (disk snapshots, backup files, restores) are removed.
```
