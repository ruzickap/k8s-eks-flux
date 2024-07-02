import{_ as i,c,a as s,b as a,w as e,d as p,r as t,o,e as l}from"./app-DVraMtkj.js";const d={},r=s("h1",{id:"examples-and-tests",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#examples-and-tests"},[s("span",null,"Examples and tests")])],-1),v={class:"table-of-contents"},u=p(`<p>Check the EKS nodes:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">kubectl get nodes <span class="token parameter variable">-o</span><span class="token operator">=</span>custom-columns<span class="token operator">=</span>NODE:.metadata.name,ARCH:.status.nodeInfo.architecture,OS-Image:.status.nodeInfo.osImage,OS:.status.nodeInfo.operatingSystem</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="backup-keycloak-using-csi-volume-snapshotting" tabindex="-1"><a class="header-anchor" href="#backup-keycloak-using-csi-volume-snapshotting"><span>Backup Keycloak using CSI Volume Snapshotting</span></a></h2><p>Install <a href="https://velero.io/" target="_blank" rel="noopener noreferrer">velero</a>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token keyword">if</span> <span class="token operator">!</span> <span class="token builtin class-name">command</span> <span class="token parameter variable">-v</span> velero <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  <span class="token comment"># https://github.com/vmware-tanzu/velero/releases/</span></span>
<span class="line">  <span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token parameter variable">-L</span> <span class="token string">&quot;https://github.com/vmware-tanzu/velero/releases/download/v1.7.1/velero-v1.7.1-linux-amd64.tar.gz&quot;</span> <span class="token operator">|</span> <span class="token function">sudo</span> <span class="token function">tar</span> xzf - <span class="token parameter variable">-C</span> /usr/local/bin <span class="token parameter variable">--wildcards</span> --strip-components <span class="token number">1</span> <span class="token string">&quot;velero-*-linux-amd64/velero&quot;</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Wait for velero and Keycloak to be fully ready:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">kubectl <span class="token function">wait</span> <span class="token parameter variable">--timeout</span><span class="token operator">=</span>10m <span class="token parameter variable">--for</span><span class="token operator">=</span>condition<span class="token operator">=</span>ready <span class="token parameter variable">-n</span> flux-system kustomizations keycloak velero</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>This example showing Velero backup using snapshots <code>features: EnableCSI</code>:</p><p>Run backup of <code>keycloak</code> namespace:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">velero backup create backup-keycloak <span class="token parameter variable">--ttl</span> 24h --include-namespaces<span class="token operator">=</span>keycloak <span class="token parameter variable">--wait</span></span>
<span class="line"><span class="token function">sleep</span> <span class="token number">50</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>Output:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre class="language-text"><code><span class="line">Backup request &quot;backup-keycloak&quot; submitted successfully.</span>
<span class="line">Waiting for backup to complete. You may safely press ctrl-c to stop waiting - your backup will continue in the background.</span>
<span class="line">....................................................</span>
<span class="line">Backup completed with status: Completed. You may check for more information using the commands \`velero backup describe backup-keycloak\` and \`velero backup logs backup-keycloak\`</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Check the backups:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">velero get backups</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Output:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre class="language-text"><code><span class="line">NAME                                  STATUS      ERRORS   WARNINGS   CREATED                         EXPIRES   STORAGE LOCATION   SELECTOR</span>
<span class="line">backup-keycloak                       Completed   0        1          2021-12-15 21:08:09 +0100 CET   23h       default            &lt;none&gt;</span>
<span class="line">velero-my-backup-all-20211215190046   Completed   0        2          2021-12-15 20:00:47 +0100 CET   1d        default            &lt;none&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>See the details of the <code>backup-keycloak</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">velero backup describe backup-keycloak <span class="token parameter variable">--details</span> <span class="token parameter variable">--features</span><span class="token operator">=</span>EnableCSI</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Output:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre class="language-text"><code><span class="line">Name:         backup-keycloak</span>
<span class="line">Namespace:    velero</span>
<span class="line">Labels:       velero.io/storage-location=default</span>
<span class="line">Annotations:  velero.io/source-cluster-k8s-gitversion=v1.21.2-eks-06eac09</span>
<span class="line">              velero.io/source-cluster-k8s-major-version=1</span>
<span class="line">              velero.io/source-cluster-k8s-minor-version=21+</span>
<span class="line"></span>
<span class="line">Phase:  Completed</span>
<span class="line"></span>
<span class="line">Errors:    0</span>
<span class="line">Warnings:  1</span>
<span class="line"></span>
<span class="line">Namespaces:</span>
<span class="line">  Included:  keycloak</span>
<span class="line">  Excluded:  &lt;none&gt;</span>
<span class="line"></span>
<span class="line">Resources:</span>
<span class="line">  Included:        *</span>
<span class="line">  Excluded:        &lt;none&gt;</span>
<span class="line">  Cluster-scoped:  auto</span>
<span class="line"></span>
<span class="line">Label selector:  &lt;none&gt;</span>
<span class="line"></span>
<span class="line">Storage Location:  default</span>
<span class="line"></span>
<span class="line">Velero-Native Snapshot PVs:  auto</span>
<span class="line"></span>
<span class="line">TTL:  24h0m0s</span>
<span class="line"></span>
<span class="line">Hooks:  &lt;none&gt;</span>
<span class="line"></span>
<span class="line">Backup Format Version:  1.1.0</span>
<span class="line"></span>
<span class="line">Started:    2021-12-15 21:08:09 +0100 CET</span>
<span class="line">Completed:  2021-12-15 21:08:57 +0100 CET</span>
<span class="line"></span>
<span class="line">Expiration:  2021-12-16 21:08:04 +0100 CET</span>
<span class="line"></span>
<span class="line">Total items to be backed up:  116</span>
<span class="line">Items backed up:              116</span>
<span class="line"></span>
<span class="line">Resource List:</span>
<span class="line">  apiextensions.k8s.io/v1/CustomResourceDefinition:</span>
<span class="line">    - apps.catalog.cattle.io</span>
<span class="line">    - helmreleases.helm.toolkit.fluxcd.io</span>
<span class="line">    - policyreports.wgpolicyk8s.io</span>
<span class="line">    - servicemonitors.monitoring.coreos.com</span>
<span class="line">  apps/v1/ControllerRevision:</span>
<span class="line">    - keycloak/keycloak-7459d6979c</span>
<span class="line">    - keycloak/keycloak-postgresql-7cb8b5cd68</span>
<span class="line">  apps/v1/StatefulSet:</span>
<span class="line">    - keycloak/keycloak</span>
<span class="line">    - keycloak/keycloak-postgresql</span>
<span class="line">  catalog.cattle.io/v1/App:</span>
<span class="line">    - keycloak/keycloak</span>
<span class="line">  discovery.k8s.io/v1/EndpointSlice:</span>
<span class="line">    - keycloak/keycloak-957wx</span>
<span class="line">    - keycloak/keycloak-headless-ljcmt</span>
<span class="line">    - keycloak/keycloak-metrics-tzlm4</span>
<span class="line">    - keycloak/keycloak-postgresql-7fckt</span>
<span class="line">    - keycloak/keycloak-postgresql-headless-c8rdw</span>
<span class="line">  extensions/v1beta1/Ingress:</span>
<span class="line">    - keycloak/keycloak</span>
<span class="line">  helm.toolkit.fluxcd.io/v2beta1/HelmRelease:</span>
<span class="line">    - keycloak/keycloak</span>
<span class="line">  monitoring.coreos.com/v1/ServiceMonitor:</span>
<span class="line">    - keycloak/keycloak</span>
<span class="line">  networking.k8s.io/v1/Ingress:</span>
<span class="line">    - keycloak/keycloak</span>
<span class="line">  rbac.authorization.k8s.io/v1/Role:</span>
<span class="line">    - keycloak/crossplane-admin</span>
<span class="line">    - keycloak/crossplane-edit</span>
<span class="line">    - keycloak/crossplane-view</span>
<span class="line">  snapshot.storage.k8s.io/v1/VolumeSnapshot:</span>
<span class="line">    - keycloak/velero-data-keycloak-postgresql-0-twj92</span>
<span class="line">  snapshot.storage.k8s.io/v1/VolumeSnapshotClass:</span>
<span class="line">    - velero-csi-ebs-snapclass</span>
<span class="line">  snapshot.storage.k8s.io/v1/VolumeSnapshotContent:</span>
<span class="line">    - snapcontent-578fc8db-dabe-43d0-9925-2b38ff0bf0f2</span>
<span class="line">  v1/ConfigMap:</span>
<span class="line">    - keycloak/istio-ca-root-cert</span>
<span class="line">    - keycloak/keycloak-env-vars</span>
<span class="line">    - keycloak/keycloak-keycloak-config-cli-configmap</span>
<span class="line">    - keycloak/keycloak-values-m72979dtm6</span>
<span class="line">    - keycloak/kube-root-ca.crt</span>
<span class="line">  v1/Endpoints:</span>
<span class="line">    - keycloak/keycloak</span>
<span class="line">    - keycloak/keycloak-headless</span>
<span class="line">    - keycloak/keycloak-metrics</span>
<span class="line">    - keycloak/keycloak-postgresql</span>
<span class="line">    - keycloak/keycloak-postgresql-headless</span>
<span class="line">  v1/Event:</span>
<span class="line">    - keycloak/data-keycloak-postgresql-0.16c105e9880bcd1e</span>
<span class="line">    - keycloak/data-keycloak-postgresql-0.16c105e98f408e05</span>
<span class="line">    - keycloak/data-keycloak-postgresql-0.16c105e98f9c07fa</span>
<span class="line">    - keycloak/data-keycloak-postgresql-0.16c105ea5a9bdef9</span>
<span class="line">    - keycloak/data-keycloak-postgresql-0.16c106475732d2c4</span>
<span class="line">    - keycloak/data-keycloak-postgresql-0.16c106479cf25294</span>
<span class="line">    - keycloak/data-keycloak-postgresql-0.16c10647bd573771</span>
<span class="line">    - keycloak/data-keycloak-postgresql-0.16c10648a864fa10</span>
<span class="line">    - keycloak/keycloak-0.16c105e98ca3d375</span>
<span class="line">    - keycloak/keycloak-0.16c105e99d7aaac8</span>
<span class="line">    - keycloak/keycloak-0.16c105e9a38941d6</span>
<span class="line">    - keycloak/keycloak-0.16c105e9ab97ec4d</span>
<span class="line">    - keycloak/keycloak-0.16c105f2dc8a9941</span>
<span class="line">    - keycloak/keycloak-0.16c1060110efb56d</span>
<span class="line">    - keycloak/keycloak-0.16c1063da93d4d5d</span>
<span class="line">    - keycloak/keycloak-0.16c106478b845269</span>
<span class="line">    - keycloak/keycloak-0.16c106479c4a53dc</span>
<span class="line">    - keycloak/keycloak-0.16c10647ac233371</span>
<span class="line">    - keycloak/keycloak-0.16c10647b82b1d48</span>
<span class="line">    - keycloak/keycloak-0.16c10650dc6f39e6</span>
<span class="line">    - keycloak/keycloak-0.16c1066164616855</span>
<span class="line">    - keycloak/keycloak-keycloak-config-cli-bpsds.16c10668f3c0f9f3</span>
<span class="line">    - keycloak/keycloak-keycloak-config-cli-bpsds.16c10669163935c4</span>
<span class="line">    - keycloak/keycloak-keycloak-config-cli-bpsds.16c106691a3e66e4</span>
<span class="line">    - keycloak/keycloak-keycloak-config-cli-bpsds.16c106692233b224</span>
<span class="line">    - keycloak/keycloak-keycloak-config-cli-zqxhv.16c1060ab3a5469d</span>
<span class="line">    - keycloak/keycloak-keycloak-config-cli-zqxhv.16c1060ae37bdc7d</span>
<span class="line">    - keycloak/keycloak-keycloak-config-cli-zqxhv.16c1060e280953f2</span>
<span class="line">    - keycloak/keycloak-keycloak-config-cli-zqxhv.16c1060ea80d12dd</span>
<span class="line">    - keycloak/keycloak-keycloak-config-cli-zqxhv.16c1060eaf88a74b</span>
<span class="line">    - keycloak/keycloak-keycloak-config-cli.16c1060ab3392ba7</span>
<span class="line">    - keycloak/keycloak-keycloak-config-cli.16c10612b448761b</span>
<span class="line">    - keycloak/keycloak-keycloak-config-cli.16c10668f3945051</span>
<span class="line">    - keycloak/keycloak-keycloak-config-cli.16c1066bbe040ed6</span>
<span class="line">    - keycloak/keycloak-postgresql-0.16c105ea7c9a3dcf</span>
<span class="line">    - keycloak/keycloak-postgresql-0.16c105eb0e1359e5</span>
<span class="line">    - keycloak/keycloak-postgresql-0.16c105ec6f11dd26</span>
<span class="line">    - keycloak/keycloak-postgresql-0.16c105ec7631ff10</span>
<span class="line">    - keycloak/keycloak-postgresql-0.16c105ec875f7afa</span>
<span class="line">    - keycloak/keycloak-postgresql-0.16c1063da1b8cef2</span>
<span class="line">    - keycloak/keycloak-postgresql-0.16c1063e55e9e15f</span>
<span class="line">    - keycloak/keycloak-postgresql-0.16c1063e564d7591</span>
<span class="line">    - keycloak/keycloak-postgresql-0.16c10647ce7dce58</span>
<span class="line">    - keycloak/keycloak-postgresql-0.16c10648c1dd7ca3</span>
<span class="line">    - keycloak/keycloak-postgresql-0.16c1064952548726</span>
<span class="line">    - keycloak/keycloak-postgresql-0.16c1064c952a575f</span>
<span class="line">    - keycloak/keycloak-postgresql-0.16c1064c9b9573c3</span>
<span class="line">    - keycloak/keycloak-postgresql-0.16c1064ca185c11c</span>
<span class="line">    - keycloak/keycloak-postgresql.16c105e987fe6dbf</span>
<span class="line">    - keycloak/keycloak-postgresql.16c105e98bae6fce</span>
<span class="line">    - keycloak/keycloak.16c105e591234a28</span>
<span class="line">    - keycloak/keycloak.16c105e62dc0f059</span>
<span class="line">    - keycloak/keycloak.16c105e98a55c140</span>
<span class="line">    - keycloak/keycloak.16c105e98df14fd2</span>
<span class="line">    - keycloak/keycloak.16c1061422b763f7</span>
<span class="line">    - keycloak/keycloak.16c10647a9688517</span>
<span class="line">    - keycloak/keycloak.16c10647a9d06266</span>
<span class="line">    - keycloak/keycloak.16c106484e815ed1</span>
<span class="line">    - keycloak/keycloak.16c1066d2ff25528</span>
<span class="line">    - keycloak/velero-data-keycloak-postgresql-0-pnrrd.16c10627ce82207d</span>
<span class="line">    - keycloak/velero-data-keycloak-postgresql-0-pnrrd.16c10627ee0b0688</span>
<span class="line">    - keycloak/velero-data-keycloak-postgresql-0-pnrrd.16c1062c726edfb2</span>
<span class="line">  v1/Namespace:</span>
<span class="line">    - keycloak</span>
<span class="line">  v1/PersistentVolume:</span>
<span class="line">    - pvc-4a83ef9b-6a42-44bf-a4fc-405fac3bc893</span>
<span class="line">  v1/PersistentVolumeClaim:</span>
<span class="line">    - keycloak/data-keycloak-postgresql-0</span>
<span class="line">  v1/Pod:</span>
<span class="line">    - keycloak/keycloak-0</span>
<span class="line">    - keycloak/keycloak-postgresql-0</span>
<span class="line">  v1/Secret:</span>
<span class="line">    - keycloak/default-token-gb8gs</span>
<span class="line">    - keycloak/default-token-ltjh5</span>
<span class="line">    - keycloak/keycloak</span>
<span class="line">    - keycloak/keycloak-postgresql</span>
<span class="line">    - keycloak/keycloak-token-dxpxs</span>
<span class="line">    - keycloak/sh.helm.release.v1.keycloak.v1</span>
<span class="line">    - keycloak/sh.helm.release.v1.keycloak.v2</span>
<span class="line">  v1/Service:</span>
<span class="line">    - keycloak/keycloak</span>
<span class="line">    - keycloak/keycloak-headless</span>
<span class="line">    - keycloak/keycloak-metrics</span>
<span class="line">    - keycloak/keycloak-postgresql</span>
<span class="line">    - keycloak/keycloak-postgresql-headless</span>
<span class="line">  v1/ServiceAccount:</span>
<span class="line">    - keycloak/default</span>
<span class="line">    - keycloak/keycloak</span>
<span class="line">  wgpolicyk8s.io/v1alpha2/PolicyReport:</span>
<span class="line">    - keycloak/polr-ns-keycloak</span>
<span class="line"></span>
<span class="line">Velero-Native Snapshots: &lt;none included&gt;</span>
<span class="line"></span>
<span class="line">CSI Volume Snapshots:</span>
<span class="line">Snapshot Content Name: snapcontent-578fc8db-dabe-43d0-9925-2b38ff0bf0f2</span>
<span class="line">  Storage Snapshot ID: snap-0dfd3b233f5ee6734</span>
<span class="line">  Snapshot Size (bytes): 1073741824</span>
<span class="line">  Ready to use: true</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>List all the <code>VolumeSnapshot</code> objects:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">kubectl get volumesnapshots <span class="token parameter variable">-n</span> keycloak</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Output:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre class="language-text"><code><span class="line">NAME                                      READYTOUSE   SOURCEPVC                    SOURCESNAPSHOTCONTENT   RESTORESIZE   SNAPSHOTCLASS              SNAPSHOTCONTENT                                    CREATIONTIME   AGE</span>
<span class="line">velero-data-keycloak-postgresql-0-twj92   true         data-keycloak-postgresql-0                           1Gi           velero-csi-ebs-snapclass   snapcontent-578fc8db-dabe-43d0-9925-2b38ff0bf0f2   64s            65s</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>Check the <code>VolumeSnapshot</code> details:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">kubectl describe volumesnapshots <span class="token parameter variable">-n</span> keycloak <span class="token parameter variable">--selector</span><span class="token operator">=</span>velero.io/backup-name<span class="token operator">=</span>backup-keycloak</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Output:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre class="language-text"><code><span class="line">Name:         velero-data-keycloak-postgresql-0-twj92</span>
<span class="line">Namespace:    keycloak</span>
<span class="line">Labels:       velero.io/backup-name=backup-keycloak</span>
<span class="line">Annotations:  &lt;none&gt;</span>
<span class="line">API Version:  snapshot.storage.k8s.io/v1</span>
<span class="line">Kind:         VolumeSnapshot</span>
<span class="line">Metadata:</span>
<span class="line">  Creation Timestamp:  2021-12-15T20:08:51Z</span>
<span class="line">  Finalizers:</span>
<span class="line">    snapshot.storage.kubernetes.io/volumesnapshot-as-source-protection</span>
<span class="line">    snapshot.storage.kubernetes.io/volumesnapshot-bound-protection</span>
<span class="line">  Generate Name:  velero-data-keycloak-postgresql-0-</span>
<span class="line">  Generation:     1</span>
<span class="line">  Managed Fields:</span>
<span class="line">    API Version:  snapshot.storage.k8s.io/v1beta1</span>
<span class="line">    Fields Type:  FieldsV1</span>
<span class="line">    fieldsV1:</span>
<span class="line">      f:metadata:</span>
<span class="line">        f:generateName:</span>
<span class="line">        f:labels:</span>
<span class="line">          .:</span>
<span class="line">          f:velero.io/backup-name:</span>
<span class="line">      f:spec:</span>
<span class="line">        .:</span>
<span class="line">        f:source:</span>
<span class="line">          .:</span>
<span class="line">          f:persistentVolumeClaimName:</span>
<span class="line">        f:volumeSnapshotClassName:</span>
<span class="line">    Manager:      velero-plugin-for-csi</span>
<span class="line">    Operation:    Update</span>
<span class="line">    Time:         2021-12-15T20:08:51Z</span>
<span class="line">    API Version:  snapshot.storage.k8s.io/v1</span>
<span class="line">    Fields Type:  FieldsV1</span>
<span class="line">    fieldsV1:</span>
<span class="line">      f:metadata:</span>
<span class="line">        f:finalizers:</span>
<span class="line">          .:</span>
<span class="line">          v:&quot;snapshot.storage.kubernetes.io/volumesnapshot-as-source-protection&quot;:</span>
<span class="line">          v:&quot;snapshot.storage.kubernetes.io/volumesnapshot-bound-protection&quot;:</span>
<span class="line">      f:status:</span>
<span class="line">        .:</span>
<span class="line">        f:boundVolumeSnapshotContentName:</span>
<span class="line">        f:creationTime:</span>
<span class="line">        f:readyToUse:</span>
<span class="line">        f:restoreSize:</span>
<span class="line">    Manager:         snapshot-controller</span>
<span class="line">    Operation:       Update</span>
<span class="line">    Time:            2021-12-15T20:08:52Z</span>
<span class="line">  Resource Version:  76955</span>
<span class="line">  UID:               578fc8db-dabe-43d0-9925-2b38ff0bf0f2</span>
<span class="line">Spec:</span>
<span class="line">  Source:</span>
<span class="line">    Persistent Volume Claim Name:  data-keycloak-postgresql-0</span>
<span class="line">  Volume Snapshot Class Name:      velero-csi-ebs-snapclass</span>
<span class="line">Status:</span>
<span class="line">  Bound Volume Snapshot Content Name:  snapcontent-578fc8db-dabe-43d0-9925-2b38ff0bf0f2</span>
<span class="line">  Creation Time:                       2021-12-15T20:08:52Z</span>
<span class="line">  Ready To Use:                        true</span>
<span class="line">  Restore Size:                        1Gi</span>
<span class="line">Events:</span>
<span class="line">  Type    Reason            Age   From                 Message</span>
<span class="line">  ----    ------            ----  ----                 -------</span>
<span class="line">  Normal  CreatingSnapshot  66s   snapshot-controller  Waiting for a snapshot keycloak/velero-data-keycloak-postgresql-0-twj92 to be created by the CSI driver.</span>
<span class="line">  Normal  SnapshotCreated   65s   snapshot-controller  Snapshot keycloak/velero-data-keycloak-postgresql-0-twj92 was successfully created by the CSI driver.</span>
<span class="line">  Normal  SnapshotReady     53s   snapshot-controller  Snapshot keycloak/velero-data-keycloak-postgresql-0-twj92 is ready to use.</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Get the <code>VolumeSnapshotContent</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">kubectl get volumesnapshotcontent <span class="token parameter variable">--selector</span><span class="token operator">=</span>velero.io/backup-name<span class="token operator">=</span>backup-keycloak</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Output:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre class="language-text"><code><span class="line">NAME                                               READYTOUSE   RESTORESIZE   DELETIONPOLICY   DRIVER            VOLUMESNAPSHOTCLASS        VOLUMESNAPSHOT                            VOLUMESNAPSHOTNAMESPACE   AGE</span>
<span class="line">snapcontent-578fc8db-dabe-43d0-9925-2b38ff0bf0f2   true         1073741824    Delete           ebs.csi.aws.com   velero-csi-ebs-snapclass   velero-data-keycloak-postgresql-0-twj92   keycloak                  66s</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">kubectl describe volumesnapshotcontent <span class="token parameter variable">--selector</span><span class="token operator">=</span>velero.io/backup-name<span class="token operator">=</span>backup-keycloak</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Output:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre class="language-text"><code><span class="line">Name:         snapcontent-578fc8db-dabe-43d0-9925-2b38ff0bf0f2</span>
<span class="line">Namespace:</span>
<span class="line">Labels:       velero.io/backup-name=backup-keycloak</span>
<span class="line">Annotations:  &lt;none&gt;</span>
<span class="line">API Version:  snapshot.storage.k8s.io/v1</span>
<span class="line">Kind:         VolumeSnapshotContent</span>
<span class="line">Metadata:</span>
<span class="line">  Creation Timestamp:  2021-12-15T20:08:51Z</span>
<span class="line">  Finalizers:</span>
<span class="line">    snapshot.storage.kubernetes.io/volumesnapshotcontent-bound-protection</span>
<span class="line">  Generation:  1</span>
<span class="line">  Managed Fields:</span>
<span class="line">    API Version:  snapshot.storage.k8s.io/v1</span>
<span class="line">    Fields Type:  FieldsV1</span>
<span class="line">    fieldsV1:</span>
<span class="line">      f:metadata:</span>
<span class="line">        f:finalizers:</span>
<span class="line">          .:</span>
<span class="line">          v:&quot;snapshot.storage.kubernetes.io/volumesnapshotcontent-bound-protection&quot;:</span>
<span class="line">      f:spec:</span>
<span class="line">        .:</span>
<span class="line">        f:deletionPolicy:</span>
<span class="line">        f:driver:</span>
<span class="line">        f:source:</span>
<span class="line">          .:</span>
<span class="line">          f:volumeHandle:</span>
<span class="line">        f:volumeSnapshotClassName:</span>
<span class="line">        f:volumeSnapshotRef:</span>
<span class="line">          .:</span>
<span class="line">          f:apiVersion:</span>
<span class="line">          f:kind:</span>
<span class="line">          f:name:</span>
<span class="line">          f:namespace:</span>
<span class="line">          f:resourceVersion:</span>
<span class="line">          f:uid:</span>
<span class="line">    Manager:      snapshot-controller</span>
<span class="line">    Operation:    Update</span>
<span class="line">    Time:         2021-12-15T20:08:51Z</span>
<span class="line">    API Version:  snapshot.storage.k8s.io/v1beta1</span>
<span class="line">    Fields Type:  FieldsV1</span>
<span class="line">    fieldsV1:</span>
<span class="line">      f:metadata:</span>
<span class="line">        f:labels:</span>
<span class="line">          .:</span>
<span class="line">          f:velero.io/backup-name:</span>
<span class="line">    Manager:      velero-plugin-for-csi</span>
<span class="line">    Operation:    Update</span>
<span class="line">    Time:         2021-12-15T20:08:56Z</span>
<span class="line">    API Version:  snapshot.storage.k8s.io/v1beta1</span>
<span class="line">    Fields Type:  FieldsV1</span>
<span class="line">    fieldsV1:</span>
<span class="line">      f:status:</span>
<span class="line">        .:</span>
<span class="line">        f:creationTime:</span>
<span class="line">        f:readyToUse:</span>
<span class="line">        f:restoreSize:</span>
<span class="line">        f:snapshotHandle:</span>
<span class="line">    Manager:         csi-snapshotter</span>
<span class="line">    Operation:       Update</span>
<span class="line">    Time:            2021-12-15T20:09:02Z</span>
<span class="line">  Resource Version:  76946</span>
<span class="line">  UID:               b37cece5-6775-4e1d-a555-76c3df730347</span>
<span class="line">Spec:</span>
<span class="line">  Deletion Policy:  Delete</span>
<span class="line">  Driver:           ebs.csi.aws.com</span>
<span class="line">  Source:</span>
<span class="line">    Volume Handle:             vol-0c161d8a582759e52</span>
<span class="line">  Volume Snapshot Class Name:  velero-csi-ebs-snapclass</span>
<span class="line">  Volume Snapshot Ref:</span>
<span class="line">    API Version:       snapshot.storage.k8s.io/v1</span>
<span class="line">    Kind:              VolumeSnapshot</span>
<span class="line">    Name:              velero-data-keycloak-postgresql-0-twj92</span>
<span class="line">    Namespace:         keycloak</span>
<span class="line">    Resource Version:  76730</span>
<span class="line">    UID:               578fc8db-dabe-43d0-9925-2b38ff0bf0f2</span>
<span class="line">Status:</span>
<span class="line">  Creation Time:    1639598932074000000</span>
<span class="line">  Ready To Use:     true</span>
<span class="line">  Restore Size:     1073741824</span>
<span class="line">  Snapshot Handle:  snap-0dfd3b233f5ee6734</span>
<span class="line">Events:             &lt;none&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Check the snapshots in AWS:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token assign-left variable">AWS_SNAPSHOT_ID</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>velero backup describe backup-keycloak <span class="token parameter variable">--details</span> <span class="token parameter variable">--features</span><span class="token operator">=</span>EnableCSI <span class="token operator">|</span> <span class="token function">sed</span> <span class="token parameter variable">-n</span> <span class="token string">&#39;s/.*Storage Snapshot ID: \\(.*\\)/\\1/p&#39;</span><span class="token variable">)</span></span></span>
<span class="line">aws ec2 describe-snapshots --snapshot-ids <span class="token string">&quot;<span class="token variable">\${AWS_SNAPSHOT_ID}</span>&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>Output:</p><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json" data-title="json"><pre class="language-json"><code><span class="line"><span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">&quot;Snapshots&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">        <span class="token punctuation">{</span></span>
<span class="line">            <span class="token property">&quot;Description&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Created by AWS EBS CSI driver for volume vol-0c161d8a582759e52&quot;</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">&quot;Encrypted&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">&quot;KmsKeyId&quot;</span><span class="token operator">:</span> <span class="token string">&quot;arn:aws:kms:eu-central-1:729560437327:key/a753d4d9-5006-4bea-8351-34092cd7b34e&quot;</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">&quot;OwnerId&quot;</span><span class="token operator">:</span> <span class="token string">&quot;729560437327&quot;</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">&quot;Progress&quot;</span><span class="token operator">:</span> <span class="token string">&quot;100%&quot;</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">&quot;SnapshotId&quot;</span><span class="token operator">:</span> <span class="token string">&quot;snap-0dfd3b233f5ee6734&quot;</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">&quot;StartTime&quot;</span><span class="token operator">:</span> <span class="token string">&quot;2021-12-15T20:08:52.074000+00:00&quot;</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">&quot;State&quot;</span><span class="token operator">:</span> <span class="token string">&quot;completed&quot;</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">&quot;VolumeId&quot;</span><span class="token operator">:</span> <span class="token string">&quot;vol-0c161d8a582759e52&quot;</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">&quot;VolumeSize&quot;</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">&quot;Tags&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">                <span class="token punctuation">{</span></span>
<span class="line">                    <span class="token property">&quot;Key&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Cluster&quot;</span><span class="token punctuation">,</span></span>
<span class="line">                    <span class="token property">&quot;Value&quot;</span><span class="token operator">:</span> <span class="token string">&quot;kube1.k8s.mylabs.dev&quot;</span></span>
<span class="line">                <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">                <span class="token punctuation">{</span></span>
<span class="line">                    <span class="token property">&quot;Key&quot;</span><span class="token operator">:</span> <span class="token string">&quot;ebs.csi.aws.com/cluster&quot;</span><span class="token punctuation">,</span></span>
<span class="line">                    <span class="token property">&quot;Value&quot;</span><span class="token operator">:</span> <span class="token string">&quot;true&quot;</span></span>
<span class="line">                <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">                <span class="token punctuation">{</span></span>
<span class="line">                    <span class="token property">&quot;Key&quot;</span><span class="token operator">:</span> <span class="token string">&quot;kubernetes.io/cluster/kube1.k8s.mylabs.dev&quot;</span><span class="token punctuation">,</span></span>
<span class="line">                    <span class="token property">&quot;Value&quot;</span><span class="token operator">:</span> <span class="token string">&quot;owned&quot;</span></span>
<span class="line">                <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">                <span class="token punctuation">{</span></span>
<span class="line">                    <span class="token property">&quot;Key&quot;</span><span class="token operator">:</span> <span class="token string">&quot;CSIVolumeSnapshotName&quot;</span><span class="token punctuation">,</span></span>
<span class="line">                    <span class="token property">&quot;Value&quot;</span><span class="token operator">:</span> <span class="token string">&quot;snapshot-578fc8db-dabe-43d0-9925-2b38ff0bf0f2&quot;</span></span>
<span class="line">                <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">                <span class="token punctuation">{</span></span>
<span class="line">                    <span class="token property">&quot;Key&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Environment&quot;</span><span class="token punctuation">,</span></span>
<span class="line">                    <span class="token property">&quot;Value&quot;</span><span class="token operator">:</span> <span class="token string">&quot;dev&quot;</span></span>
<span class="line">                <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">                <span class="token punctuation">{</span></span>
<span class="line">                    <span class="token property">&quot;Key&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Name&quot;</span><span class="token punctuation">,</span></span>
<span class="line">                    <span class="token property">&quot;Value&quot;</span><span class="token operator">:</span> <span class="token string">&quot;ruzickap-kube1&quot;</span></span>
<span class="line">                <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">                <span class="token punctuation">{</span></span>
<span class="line">                    <span class="token property">&quot;Key&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Group&quot;</span><span class="token punctuation">,</span></span>
<span class="line">                    <span class="token property">&quot;Value&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Cloud_Native&quot;</span></span>
<span class="line">                <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">                <span class="token punctuation">{</span></span>
<span class="line">                    <span class="token property">&quot;Key&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Owner&quot;</span><span class="token punctuation">,</span></span>
<span class="line">                    <span class="token property">&quot;Value&quot;</span><span class="token operator">:</span> <span class="token string">&quot;petr.ruzicka@gmail.com&quot;</span></span>
<span class="line">                <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">                <span class="token punctuation">{</span></span>
<span class="line">                    <span class="token property">&quot;Key&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Squad&quot;</span><span class="token punctuation">,</span></span>
<span class="line">                    <span class="token property">&quot;Value&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Cloud_Container_Platform&quot;</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token property">&quot;StorageTier&quot;</span><span class="token operator">:</span> <span class="token string">&quot;standard&quot;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>See the files in S3 bucket:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">aws s3 <span class="token function">ls</span> <span class="token parameter variable">--recursive</span> <span class="token string">&quot;s3://<span class="token variable">\${CLUSTER_FQDN}</span>/velero/&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Output:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre class="language-text"><code><span class="line">2021-12-15 21:08:58        751 velero/backups/backup-keycloak/backup-keycloak-csi-volumesnapshotcontents.json.gz</span>
<span class="line">2021-12-15 21:08:58        567 velero/backups/backup-keycloak/backup-keycloak-csi-volumesnapshots.json.gz</span>
<span class="line">2021-12-15 21:08:58      12472 velero/backups/backup-keycloak/backup-keycloak-logs.gz</span>
<span class="line">2021-12-15 21:08:58         29 velero/backups/backup-keycloak/backup-keycloak-podvolumebackups.json.gz</span>
<span class="line">2021-12-15 21:08:58       1344 velero/backups/backup-keycloak/backup-keycloak-resource-list.json.gz</span>
<span class="line">2021-12-15 21:08:58         29 velero/backups/backup-keycloak/backup-keycloak-volumesnapshots.json.gz</span>
<span class="line">2021-12-15 21:08:58     285689 velero/backups/backup-keycloak/backup-keycloak.tar.gz</span>
<span class="line">2021-12-15 21:08:58       2164 velero/backups/backup-keycloak/velero-backup.json</span>
<span class="line">2021-12-15 20:02:41       2841 velero/backups/velero-my-backup-all-20211215190046/velero-backup.json</span>
<span class="line">2021-12-15 20:02:42        949 velero/backups/velero-my-backup-all-20211215190046/velero-my-backup-all-20211215190046-csi-volumesnapshotcontents.json.gz</span>
<span class="line">2021-12-15 20:02:42        709 velero/backups/velero-my-backup-all-20211215190046/velero-my-backup-all-20211215190046-csi-volumesnapshots.json.gz</span>
<span class="line">2021-12-15 20:02:41     138637 velero/backups/velero-my-backup-all-20211215190046/velero-my-backup-all-20211215190046-logs.gz</span>
<span class="line">2021-12-15 20:02:42         29 velero/backups/velero-my-backup-all-20211215190046/velero-my-backup-all-20211215190046-podvolumebackups.json.gz</span>
<span class="line">2021-12-15 20:02:42      36008 velero/backups/velero-my-backup-all-20211215190046/velero-my-backup-all-20211215190046-resource-list.json.gz</span>
<span class="line">2021-12-15 20:02:42         29 velero/backups/velero-my-backup-all-20211215190046/velero-my-backup-all-20211215190046-volumesnapshots.json.gz</span>
<span class="line">2021-12-15 20:02:41    7672082 velero/backups/velero-my-backup-all-20211215190046/velero-my-backup-all-20211215190046.tar.gz</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="delete-restore-keycloak-using-csi-volume-snapshotting" tabindex="-1"><a class="header-anchor" href="#delete-restore-keycloak-using-csi-volume-snapshotting"><span>Delete + Restore Keycloak using CSI Volume Snapshotting</span></a></h2><p>Check the <code>keycloak</code> namespace and it&#39;s objects:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">kubectl get <span class="token parameter variable">-n</span> keycloak configmap,helmrelease,ingress,pvc,pod,secret,svc,statefulset,volumesnapshot</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Output:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre class="language-text"><code><span class="line">NAME                                               DATA   AGE</span>
<span class="line">configmap/istio-ca-root-cert                       1      6m47s</span>
<span class="line">configmap/keycloak-env-vars                        13     6m6s</span>
<span class="line">configmap/keycloak-keycloak-config-cli-configmap   1      6m6s</span>
<span class="line">configmap/keycloak-values-m72979dtm6               1      6m6s</span>
<span class="line">configmap/kube-root-ca.crt                         1      6m47s</span>
<span class="line"></span>
<span class="line">NAME                                          READY   STATUS                             AGE</span>
<span class="line">helmrelease.helm.toolkit.fluxcd.io/keycloak   True    Release reconciliation succeeded   6m5s</span>
<span class="line"></span>
<span class="line">NAME                                 CLASS   HOSTS                           ADDRESS                                                                            PORTS     AGE</span>
<span class="line">ingress.networking.k8s.io/keycloak   nginx   keycloak.kube1.k8s.mylabs.dev   aefab38aac442424293f32d19a1abba8-bcefcbb2484170a1.elb.eu-central-1.amazonaws.com   80, 443   6m5s</span>
<span class="line"></span>
<span class="line">NAME                                               STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE</span>
<span class="line">persistentvolumeclaim/data-keycloak-postgresql-0   Bound    pvc-4a83ef9b-6a42-44bf-a4fc-405fac3bc893   1Gi        RWO            gp3            6m7s</span>
<span class="line"></span>
<span class="line">NAME                        READY   STATUS    RESTARTS   AGE</span>
<span class="line">pod/keycloak-0              1/1     Running   0          6m6s</span>
<span class="line">pod/keycloak-postgresql-0   1/1     Running   0          6m6s</span>
<span class="line"></span>
<span class="line">NAME                                    TYPE                                  DATA   AGE</span>
<span class="line">secret/default-token-gb8gs              kubernetes.io/service-account-token   3      6m7s</span>
<span class="line">secret/default-token-ltjh5              kubernetes.io/service-account-token   3      6m46s</span>
<span class="line">secret/keycloak                         Opaque                                2      6m6s</span>
<span class="line">secret/keycloak-postgresql              Opaque                                2      6m7s</span>
<span class="line">secret/keycloak-token-dxpxs             kubernetes.io/service-account-token   3      6m6s</span>
<span class="line">secret/sh.helm.release.v1.keycloak.v1   helm.sh/release.v1                    1      6m6s</span>
<span class="line">secret/sh.helm.release.v1.keycloak.v2   helm.sh/release.v1                    1      5m37s</span>
<span class="line"></span>
<span class="line">NAME                                   TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE</span>
<span class="line">service/keycloak                       ClusterIP   10.100.182.109   &lt;none&gt;        80/TCP,443/TCP   6m6s</span>
<span class="line">service/keycloak-headless              ClusterIP   None             &lt;none&gt;        80/TCP           6m6s</span>
<span class="line">service/keycloak-metrics               ClusterIP   10.100.3.80      &lt;none&gt;        9990/TCP         6m6s</span>
<span class="line">service/keycloak-postgresql            ClusterIP   10.100.10.220    &lt;none&gt;        5432/TCP         6m6s</span>
<span class="line">service/keycloak-postgresql-headless   ClusterIP   None             &lt;none&gt;        5432/TCP         6m6s</span>
<span class="line"></span>
<span class="line">NAME                                   READY   AGE</span>
<span class="line">statefulset.apps/keycloak              1/1     6m6s</span>
<span class="line">statefulset.apps/keycloak-postgresql   1/1     6m6s</span>
<span class="line"></span>
<span class="line">NAME                                                                             READYTOUSE   SOURCEPVC                    SOURCESNAPSHOTCONTENT   RESTORESIZE   SNAPSHOTCLASS              SNAPSHOTCONTENT                                    CREATIONTIME   AGE</span>
<span class="line">volumesnapshot.snapshot.storage.k8s.io/velero-data-keycloak-postgresql-0-twj92   true         data-keycloak-postgresql-0                           1Gi           velero-csi-ebs-snapclass   snapcontent-578fc8db-dabe-43d0-9925-2b38ff0bf0f2   78s            79s</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Remove Keycloak objects from <code>keycloak</code> namespace - simulate unfortunate deletion objects:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">kubectl delete helmrelease <span class="token parameter variable">-n</span> keycloak keycloak</span>
<span class="line">kubectl delete <span class="token parameter variable">-n</span> keycloak pvc,configmap,secret <span class="token parameter variable">--all</span></span>
<span class="line"><span class="token function">sleep</span> <span class="token number">5</span></span>
<span class="line">kubectl get <span class="token parameter variable">-n</span> keycloak configmap,helmrelease,ingress,pvc,pod,secret,svc,statefulset,volumesnapshot</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Output:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre class="language-text"><code><span class="line">NAME                           DATA   AGE</span>
<span class="line">configmap/istio-ca-root-cert   1      37s</span>
<span class="line">configmap/kube-root-ca.crt     1      37s</span>
<span class="line"></span>
<span class="line">NAME                         TYPE                                  DATA   AGE</span>
<span class="line">secret/default-token-78b2g   kubernetes.io/service-account-token   3      36s</span>
<span class="line"></span>
<span class="line">NAME                                                                             READYTOUSE   SOURCEPVC                    SOURCESNAPSHOTCONTENT   RESTORESIZE   SNAPSHOTCLASS              SNAPSHOTCONTENT                                    CREATIONTIME   AGE</span>
<span class="line">volumesnapshot.snapshot.storage.k8s.io/velero-data-keycloak-postgresql-0-twj92   true         data-keycloak-postgresql-0                           1Gi           velero-csi-ebs-snapclass   snapcontent-578fc8db-dabe-43d0-9925-2b38ff0bf0f2   2m10s          2m11s</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Restore objects in <code>keycloak</code> namespace:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">velero restore create restore-keycloak --from-backup backup-keycloak --include-namespaces keycloak <span class="token parameter variable">--wait</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Output:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre class="language-text"><code><span class="line">Restore request &quot;restore-keycloak&quot; submitted successfully.</span>
<span class="line">Waiting for restore to complete. You may safely press ctrl-c to stop waiting - your restore will continue in the background.</span>
<span class="line">.....</span>
<span class="line">Restore completed with status: Completed. You may check for more information using the commands \`velero restore describe restore-keycloak\` and \`velero restore logs restore-keycloak\`.</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Get recovery list:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">velero restore get</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Output:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre class="language-text"><code><span class="line">NAME               BACKUP            STATUS      STARTED                         COMPLETED                       ERRORS   WARNINGS   CREATED                         SELECTOR</span>
<span class="line">restore-keycloak   backup-keycloak   Completed   2021-12-15 21:11:03 +0100 CET   2021-12-15 21:11:07 +0100 CET   0        3          2021-12-15 21:11:02 +0100 CET   &lt;none&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>Get the details about recovery:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">velero restore describe restore-keycloak</span>
<span class="line">kubectl <span class="token function">wait</span> <span class="token parameter variable">--timeout</span><span class="token operator">=</span>10m <span class="token parameter variable">--namespace</span> keycloak <span class="token parameter variable">--for</span><span class="token operator">=</span>condition<span class="token operator">=</span>Ready helmrelease keycloak</span>
<span class="line">kubectl get <span class="token parameter variable">-n</span> keycloak configmap,helmrelease,ingress,pvc,pod,secret,svc,statefulset,volumesnapshot</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Output:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre class="language-text"><code><span class="line">Name:         restore-keycloak</span>
<span class="line">Namespace:    velero</span>
<span class="line">Labels:       &lt;none&gt;</span>
<span class="line">Annotations:  &lt;none&gt;</span>
<span class="line"></span>
<span class="line">Phase:                       Completed</span>
<span class="line">Total items to be restored:  47</span>
<span class="line">Items restored:              47</span>
<span class="line"></span>
<span class="line">Started:    2021-12-15 21:11:03 +0100 CET</span>
<span class="line">Completed:  2021-12-15 21:11:07 +0100 CET</span>
<span class="line"></span>
<span class="line">Warnings:</span>
<span class="line">  Velero:     &lt;none&gt;</span>
<span class="line">  Cluster:    &lt;none&gt;</span>
<span class="line">  Namespaces:</span>
<span class="line">    keycloak:  could not restore, volumesnapshots.snapshot.storage.k8s.io &quot;velero-data-keycloak-postgresql-0-twj92&quot; already exists. Warning: the in-cluster version is different than the backed-up version.</span>
<span class="line">               could not restore, apps.catalog.cattle.io &quot;keycloak&quot; already exists. Warning: the in-cluster version is different than the backed-up version.</span>
<span class="line">               could not restore, ingresses.networking.k8s.io &quot;keycloak&quot; already exists. Warning: the in-cluster version is different than the backed-up version.</span>
<span class="line"></span>
<span class="line">Backup:  backup-keycloak</span>
<span class="line"></span>
<span class="line">Namespaces:</span>
<span class="line">  Included:  keycloak</span>
<span class="line">  Excluded:  &lt;none&gt;</span>
<span class="line"></span>
<span class="line">Resources:</span>
<span class="line">  Included:        *</span>
<span class="line">  Excluded:        nodes, events, events.events.k8s.io, backups.velero.io, restores.velero.io, resticrepositories.velero.io</span>
<span class="line">  Cluster-scoped:  auto</span>
<span class="line"></span>
<span class="line">Namespace mappings:  &lt;none&gt;</span>
<span class="line"></span>
<span class="line">Label selector:  &lt;none&gt;</span>
<span class="line"></span>
<span class="line">Restore PVs:  auto</span>
<span class="line"></span>
<span class="line">Preserve Service NodePorts:  auto</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Delete the backup</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">velero backup delete backup-keycloak <span class="token parameter variable">--confirm</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Output:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre class="language-text"><code><span class="line">Request to delete backup &quot;backup-keycloak&quot; submitted successfully.</span>
<span class="line">The backup will be fully deleted after all associated data (disk snapshots, backup files, restores) are removed.</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div>`,68);function k(m,b){const n=t("router-link");return o(),c("div",null,[r,s("nav",v,[s("ul",null,[s("li",null,[a(n,{to:"#backup-keycloak-using-csi-volume-snapshotting"},{default:e(()=>[l("Backup Keycloak using CSI Volume Snapshotting")]),_:1})]),s("li",null,[a(n,{to:"#delete-restore-keycloak-using-csi-volume-snapshotting"},{default:e(()=>[l("Delete + Restore Keycloak using CSI Volume Snapshotting")]),_:1})])])]),u])}const y=i(d,[["render",k],["__file","index.html.vue"]]),h=JSON.parse('{"path":"/part-workloads-01/","title":"Examples and tests","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"Backup Keycloak using CSI Volume Snapshotting","slug":"backup-keycloak-using-csi-volume-snapshotting","link":"#backup-keycloak-using-csi-volume-snapshotting","children":[]},{"level":2,"title":"Delete + Restore Keycloak using CSI Volume Snapshotting","slug":"delete-restore-keycloak-using-csi-volume-snapshotting","link":"#delete-restore-keycloak-using-csi-volume-snapshotting","children":[]}],"git":{"updatedTime":1719720548000},"filePathRelative":"part-workloads-01/README.md"}');export{y as comp,h as data};
