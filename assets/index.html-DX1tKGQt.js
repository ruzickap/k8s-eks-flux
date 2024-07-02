import{_ as i,c as p,a as s,b as a,w as e,d as t,r,o as c,e as l}from"./app-DVraMtkj.js";const o={},u=s("h1",{id:"applications",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#applications"},[s("span",null,"Applications")])],-1),d={class:"table-of-contents"},v=t(`<h2 id="applications-definitions" tabindex="-1"><a class="header-anchor" href="#applications-definitions"><span>Applications definitions</span></a></h2><h3 id="amazon-efs-csi-driver" tabindex="-1"><a class="header-anchor" href="#amazon-efs-csi-driver"><span>Amazon EFS CSI Driver</span></a></h3><p>Install <a href="https://github.com/kubernetes-sigs/aws-efs-csi-driver" target="_blank" rel="noopener noreferrer">Amazon EFS CSI Driver</a>, which supports ReadWriteMany PVC. Details can be found here: <a href="https://aws.amazon.com/blogs/containers/introducing-efs-csi-dynamic-provisioning/" target="_blank" rel="noopener noreferrer">Introducing Amazon EFS CSI dynamic provisioning</a></p><p><a href="https://github.com/kubernetes-sigs/aws-efs-csi-driver" target="_blank" rel="noopener noreferrer">Amazon EFS CSI Driver</a></p><ul><li><a href="https://github.com/kubernetes-sigs/aws-efs-csi-driver/tree/master/charts/aws-efs-csi-driver" target="_blank" rel="noopener noreferrer">aws-efs-csi-driver</a></li><li><a href="https://github.com/kubernetes-sigs/aws-efs-csi-driver/blob/master/charts/aws-efs-csi-driver/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/aws-efs-csi-driver</span>
<span class="line"></span>
<span class="line">flux create helmrelease aws-efs-csi-driver <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;aws-efs-csi-driver&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/aws-efs-csi-driver.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;aws-efs-csi-driver&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;2.2.2&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/aws-efs-csi-driver-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/aws-efs-csi-driver/aws-efs-csi-driver-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/aws-efs-csi-driver/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/aws-efs-csi-driver&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/aws-efs-csi-driver</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-efs-csi-driver/aws-efs-csi-driver-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line">flux create kustomization aws-efs-csi-driver <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/aws-efs-csi-driver/aws-efs-csi-driver-kustomization&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-efs-csi-driver/aws-efs-csi-driver-kustomization.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-efs-csi-driver/aws-efs-csi-driver-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-efs-csi-driver/aws-efs-csi-driver-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: aws-efs-csi-driver</span>
<span class="line">resources:</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/aws-efs-csi-driver</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: aws-efs-csi-driver-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>aws-efs-csi-driver-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-efs-csi-driver/aws-efs-csi-driver-kustomization/aws-efs-csi-driver-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">controller:</span>
<span class="line">  serviceAccount:</span>
<span class="line">    create: <span class="token boolean">false</span></span>
<span class="line">    name: efs-csi-controller-sa</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-efs-csi-driver/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-efs-csi-driver&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- aws-efs-csi-driver$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource aws-efs-csi-driver <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Change the tags on the Cluster level, because they will be different on every cluster and it needs to be &quot;set&quot; form TAGS bash variable:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;name: aws-efs-csi-driver$&#39;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token function">cat</span> <span class="token operator">&gt;&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">- |-</span>
<span class="line">  apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">  kind: Kustomization</span>
<span class="line">  metadata:</span>
<span class="line">    name: aws-efs-csi-driver</span>
<span class="line">    namespace: flux-system</span>
<span class="line">  spec:</span>
<span class="line">    patches:</span>
<span class="line">      - target:</span>
<span class="line">          kind: HelmRelease</span>
<span class="line">          name: aws-efs-csi-driver</span>
<span class="line">          namespace: aws-efs-csi-driver</span>
<span class="line">        patch: |-</span>
<span class="line">          apiVersion: helm.toolkit.fluxcd.io/v2beta1</span>
<span class="line">          kind: HelmRelease</span>
<span class="line">          metadata:</span>
<span class="line">            name: not-used</span>
<span class="line">          spec:</span>
<span class="line">            values:</span>
<span class="line">              controller:</span>
<span class="line">                serviceAccount:</span>
<span class="line">                  create: false</span>
<span class="line">                  name: efs-csi-controller-sa</span>
<span class="line">                tags:</span>
<span class="line">                  Name: \\<span class="token variable">\${CLUSTER_NAME}</span></span>
<span class="line">                  Cluster: \\<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">                  <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">\${TAGS}</span>&quot;</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">&quot;s/ /<span class="token entity" title="\\\\">\\\\</span>n                  /g; s/=/: /g&quot;</span><span class="token variable">)</span></span></span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="crossplane-aws" tabindex="-1"><a class="header-anchor" href="#crossplane-aws"><span>Crossplane AWS</span></a></h3><h4 id="get-kms-key" tabindex="-1"><a class="header-anchor" href="#get-kms-key"><span>Get KMS key</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-kms-key-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-kms-key-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: cp-aws-kms-key-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">    - name: crossplane-providerconfig</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: <span class="token string">&quot;./clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-kms-key-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key&quot;</span></span>
<span class="line">  prune: <span class="token boolean">true</span></span>
<span class="line">  sourceRef:</span>
<span class="line">    kind: GitRepository</span>
<span class="line">    name: flux-system</span>
<span class="line">    namespace: flux-system</span>
<span class="line">  wait: <span class="token boolean">true</span></span>
<span class="line">  postBuild:</span>
<span class="line">    substituteFrom:</span>
<span class="line">    - kind: Secret</span>
<span class="line">      name: cluster-apps-substitutefrom-secret</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-kms-key-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key/cp-aws-kms-key-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kms.aws.crossplane.io/v1alpha1</span>
<span class="line">kind: Key</span>
<span class="line">metadata:</span>
<span class="line">  name: cp-aws-kms-key-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key</span>
<span class="line">  annotations:</span>
<span class="line">    crossplane.io/external-name: <span class="token variable">\${AWS_KMS_KEY_ARN}</span></span>
<span class="line">spec:</span>
<span class="line">  forProvider:</span>
<span class="line">    region: <span class="token variable">\${AWS_DEFAULT_REGION}</span></span>
<span class="line">  providerConfigRef:</span>
<span class="line">    name: aws-provider</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- crossplane-aws$&#39;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span></span>
<span class="line">    <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">      kustomize edit <span class="token function">add</span> resource crossplane-aws <span class="token operator">&amp;&amp;</span></span>
<span class="line">      <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span></span>
<span class="line">  <span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="crate-secret-in-amazon-secret-manager" tabindex="-1"><a class="header-anchor" href="#crate-secret-in-amazon-secret-manager"><span>Crate secret in Amazon Secret Manager</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-asm-secret-key&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-asm-secret-key.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: cp-aws-asm-secret-key</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  decryption:</span>
<span class="line">    provider: sops</span>
<span class="line">  dependsOn:</span>
<span class="line">    - name: cp-aws-kms-key-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: <span class="token string">&quot;./clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-asm-secret-key&quot;</span></span>
<span class="line">  prune: <span class="token boolean">true</span></span>
<span class="line">  sourceRef:</span>
<span class="line">    kind: GitRepository</span>
<span class="line">    name: flux-system</span>
<span class="line">    namespace: flux-system</span>
<span class="line">  wait: <span class="token boolean">true</span></span>
<span class="line">  postBuild:</span>
<span class="line">    substituteFrom:</span>
<span class="line">    - kind: Secret</span>
<span class="line">      name: cluster-apps-substitutefrom-secret</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-asm-secret-key/cp-aws-asm-secret-key.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  kubectl create secret generic cp-aws-asm-secret-key <span class="token parameter variable">-n</span> crossplane-system --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span>username<span class="token operator">=</span>myuser --from-literal<span class="token operator">=</span>password<span class="token operator">=</span>mytest12345 <span class="token punctuation">\\</span></span>
<span class="line">    <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-asm-secret-key/cp-aws-asm-secret-key.yaml&quot;</span></span>
<span class="line">  sops <span class="token parameter variable">--encrypt</span> --in-place <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-asm-secret-key/cp-aws-asm-secret-key.yaml&quot;</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;name: cp-aws-asm-secret-key$&#39;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token function">cat</span> <span class="token operator">&gt;&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">- |-</span>
<span class="line">  apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">  kind: Kustomization</span>
<span class="line">  metadata:</span>
<span class="line">    name: cp-aws-asm-secret-key</span>
<span class="line">    namespace: flux-system</span>
<span class="line">  spec:</span>
<span class="line">    patches:</span>
<span class="line">      - target:</span>
<span class="line">          group: secretsmanager.aws.crossplane.io</span>
<span class="line">          kind: Secret</span>
<span class="line">          name: cp-aws-asm-secret-key</span>
<span class="line">        patch: |-</span>
<span class="line">          apiVersion: secretsmanager.aws.crossplane.io/v1alpha1</span>
<span class="line">          kind: Secret</span>
<span class="line">          metadata:</span>
<span class="line">            name: not-used</span>
<span class="line">          spec:</span>
<span class="line">            forProvider:</span>
<span class="line">              tags:</span>
<span class="line">                - key: Cluster</span>
<span class="line">                  value: \\<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">                <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">\${TAGS}</span>&quot;</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">&quot;s/ /<span class="token entity" title="\\\\">\\\\</span>n                - key: /g; s/^/- key: /g; s/=/<span class="token entity" title="\\n">\\n</span>                  value: /g&quot;</span><span class="token variable">)</span></span></span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-asm-secret-key/asm-secretsmanager-secret-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: secretsmanager.aws.crossplane.io/v1alpha1</span>
<span class="line">kind: Secret</span>
<span class="line">metadata:</span>
<span class="line">  name: cp-aws-asm-secret-key</span>
<span class="line">spec:</span>
<span class="line">  providerConfigRef:</span>
<span class="line">    name: aws-provider</span>
<span class="line">  forProvider:</span>
<span class="line">    region: <span class="token variable">\${AWS_DEFAULT_REGION}</span></span>
<span class="line">    description: <span class="token string">&quot;Secret for <span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span></span>
<span class="line">    kmsKeyIDRef:</span>
<span class="line">      name: cp-aws-kms-key-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key</span>
<span class="line">    forceDeleteWithoutRecovery: <span class="token boolean">true</span></span>
<span class="line">    stringSecretRef:</span>
<span class="line">      name: cp-aws-asm-secret-key</span>
<span class="line">      namespace: crossplane-system</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&quot;\\- cp-aws-asm-secret-key.yaml$&quot;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span></span>
<span class="line">    <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">      kustomize edit <span class="token function">add</span> resource cp-aws-asm-secret-key.yaml <span class="token operator">&amp;&amp;</span></span>
<span class="line">      <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span></span>
<span class="line">  <span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="istio" tabindex="-1"><a class="header-anchor" href="#istio"><span>Istio</span></a></h3><p><a href="https://istio.io/" target="_blank" rel="noopener noreferrer">Istio</a></p><h4 id="jaeger" tabindex="-1"><a class="header-anchor" href="#jaeger"><span>Jaeger</span></a></h4><p><a href="https://www.jaegertracing.io/" target="_blank" rel="noopener noreferrer">Jaeger</a></p><ul><li><a href="https://artifacthub.io/packages/helm/jaegertracing/jaeger-operator" target="_blank" rel="noopener noreferrer">jaeger-operator</a></li><li><a href="https://github.com/jaegertracing/helm-charts/blob/main/charts/jaeger-operator/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/jaeger-operator</span>
<span class="line"></span>
<span class="line">kubectl create namespace jaeger-operator --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/jaeger-operator/jaeger-operator-namespace.yaml</span>
<span class="line"></span>
<span class="line">flux create helmrelease jaeger-operator <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;jaeger-operator&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/jaegertracing.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;jaeger-operator&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;2.27.1&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--crds</span><span class="token operator">=</span><span class="token string">&quot;CreateReplace&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/jaeger-operator-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/jaeger-operator/jaeger-operator-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/jaeger-operator/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/base/jaeger-operator&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/jaeger-operator</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-operator/jaeger-operator-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line">flux create kustomization jaeger-operator <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/jaeger-operator/jaeger-operator-kustomization&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-operator/jaeger-operator-kustomization.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-operator/jaeger-operator-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-operator/jaeger-operator-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: jaeger-operator</span>
<span class="line">resources:</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/jaeger-operator</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: jaeger-operator-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>jaeger-operator-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-operator/jaeger-operator-kustomization/jaeger-operator-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">rbac:</span>
<span class="line">  clusterRole: <span class="token boolean">true</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-operator/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-operator&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- jaeger-operator$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource jaeger-operator <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="deploy-jaeger-using-operator" tabindex="-1"><a class="header-anchor" href="#deploy-jaeger-using-operator"><span>Deploy Jaeger using operator</span></a></h4><p><a href="https://www.jaegertracing.io/" target="_blank" rel="noopener noreferrer">Jaeger</a></p><ul><li><a href="https://www.jaegertracing.io/docs/latest/operator/" target="_blank" rel="noopener noreferrer">Jaeger Operator</a></li></ul><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-controlplane/jaeger-controlplane-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line">kubectl create namespace jaeger-system --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-controlplane/jaeger-controlplane-kustomization/jaeger-controlplane-namespace.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-controlplane/jaeger-controlplane-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: jaeger-controlplane</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">  - name: jaeger-operator</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-controlplane/jaeger-controlplane-kustomization</span>
<span class="line">  prune: true</span>
<span class="line">  sourceRef:</span>
<span class="line">    kind: GitRepository</span>
<span class="line">    name: flux-system</span>
<span class="line">    namespace: flux-system</span>
<span class="line">  wait: true</span>
<span class="line">  postBuild:</span>
<span class="line">    substituteFrom:</span>
<span class="line">    - kind: Secret</span>
<span class="line">      name: cluster-apps-substitutefrom-secret</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-controlplane/jaeger-controlplane-kustomization/jaeger-controlplane-jaeger.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: jaegertracing.io/v1</span>
<span class="line">kind: Jaeger</span>
<span class="line">metadata:</span>
<span class="line">  name: jaeger-controlplane</span>
<span class="line">  namespace: jaeger-system</span>
<span class="line">spec:</span>
<span class="line">  strategy: AllInOne</span>
<span class="line">  allInOne:</span>
<span class="line">    image: jaegertracing/all-in-one:1.28</span>
<span class="line">    options:</span>
<span class="line">      log-level: debug</span>
<span class="line">  storage:</span>
<span class="line">    type: memory</span>
<span class="line">    options:</span>
<span class="line">      memory:</span>
<span class="line">        max-traces: <span class="token number">100000</span></span>
<span class="line">  ingress:</span>
<span class="line">    enabled: <span class="token boolean">true</span></span>
<span class="line">    ingressClassName: nginx</span>
<span class="line">    annotations:</span>
<span class="line">      nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth</span>
<span class="line">      nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd<span class="token operator">=</span><span class="token punctuation">\\</span><span class="token variable">$scheme</span>://<span class="token punctuation">\\</span><span class="token variable">$host</span><span class="token punctuation">\\</span><span class="token variable">$request_uri</span></span>
<span class="line">    hosts:</span>
<span class="line">      - jaeger.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">    tls:</span>
<span class="line">      - hosts:</span>
<span class="line">        - jaeger.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-controlplane/jaeger-controlplane-kustomization/jaeger-controlplane-rolebinding.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">kind: RoleBinding</span>
<span class="line">apiVersion: rbac.authorization.k8s.io/v1</span>
<span class="line">metadata:</span>
<span class="line">  name: jaeger-controlplane-in-jaeger-system</span>
<span class="line">  namespace: jaeger-system</span>
<span class="line">subjects:</span>
<span class="line">  - kind: ServiceAccount</span>
<span class="line">    name: jaeger-operator</span>
<span class="line">    namespace: jaeger-operator</span>
<span class="line">roleRef:</span>
<span class="line">  kind: Role</span>
<span class="line">  name: jaeger-operator</span>
<span class="line">  apiGroup: rbac.authorization.k8s.io</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-controlplane/jaeger-controlplane-kustomization/jaeger-controlplane-podmonitor.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">apiVersion: monitoring.coreos.com/v1</span>
<span class="line">kind: PodMonitor</span>
<span class="line">metadata:</span>
<span class="line">  name: tracing</span>
<span class="line">  namespace: jaeger-system</span>
<span class="line">spec:</span>
<span class="line">  podMetricsEndpoints:</span>
<span class="line">  - interval: 5s</span>
<span class="line">    port: &quot;admin-http&quot;</span>
<span class="line">  selector:</span>
<span class="line">    matchLabels:</span>
<span class="line">      app: jaeger</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-controlplane/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-controlplane&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- jaeger-controlplane$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource jaeger-controlplane <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="istio-operator" tabindex="-1"><a class="header-anchor" href="#istio-operator"><span>istio-operator</span></a></h4><p><a href="https://istio.io/latest/docs/setup/install/operator/" target="_blank" rel="noopener noreferrer">Istio Operator</a></p><ul><li><a href="https://github.com/istio/istio/tree/master/manifests/charts/istio-operator" target="_blank" rel="noopener noreferrer">istio-operator</a></li><li><a href="https://github.com/istio/istio/blob/master/manifests/charts/istio-operator/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Set Istio version:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">ISTIO_VERSION</span><span class="token operator">=</span><span class="token string">&quot;1.12.0&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Add HelmRepository file to <code>infrastructure/sources</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> infrastructure/sources/istio-operator-git.yaml <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">apiVersion: source.toolkit.fluxcd.io/v1beta1</span>
<span class="line">kind: GitRepository</span>
<span class="line">metadata:</span>
<span class="line">  name: istio-operator</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  interval: 1h</span>
<span class="line">  timeout: 5m</span>
<span class="line">  ref:</span>
<span class="line">    tag: <span class="token variable">\${ISTIO_VERSION}</span></span>
<span class="line">  url: https://github.com/istio/istio</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token parameter variable">-f</span> infrastructure/sources/kustomization.yaml <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token function">rm</span> infrastructure/sources/kustomization.yaml</span>
<span class="line"><span class="token builtin class-name">cd</span> infrastructure/sources <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/istio-operator</span>
<span class="line"></span>
<span class="line">kubectl create namespace istio-operator --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/istio-operator/istio-operator-namespace.yaml</span>
<span class="line"></span>
<span class="line">flux create helmrelease istio-operator <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;istio-operator&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/istio-operator.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;manifests/charts/istio-operator&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--crds</span><span class="token operator">=</span><span class="token string">&quot;CreateReplace&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/istio-operator-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/istio-operator/istio-operator-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/istio-operator/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/base/istio-operator&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/istio-operator</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-operator/istio-operator-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line">flux create kustomization istio-operator <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/istio-operator/istio-operator-kustomization&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-operator/istio-operator-kustomization.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-operator/istio-operator-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-operator/istio-operator-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: istio-operator</span>
<span class="line">resources:</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/istio-operator</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: istio-operator-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>istio-operator-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-operator/istio-operator-kustomization/istio-operator-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">hub: docker.io/istio</span>
<span class="line">tag: <span class="token variable">\${ISTIO_VERSION}</span></span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-operator/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-operator&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- istio-operator$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource istio-operator <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="deploy-istio-using-operator" tabindex="-1"><a class="header-anchor" href="#deploy-istio-using-operator"><span>Deploy Istio using operator</span></a></h4><p><a href="https://istio.io" target="_blank" rel="noopener noreferrer">Istio</a></p><ul><li><a href="https://istio.io/latest/docs/reference/config/istio.operator.v1alpha1/" target="_blank" rel="noopener noreferrer">Istio CRD</a></li></ul><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-controlplane/istio-controlplane-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line">kubectl create namespace istio-system --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-controlplane/istio-controlplane-kustomization/istio-controlplane-namespace.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;https://raw.githubusercontent.com/istio/istio/<span class="token variable">\${ISTIO_VERSION}</span>/samples/addons/extras/prometheus-operator.yaml&quot;</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-controlplane/istio-controlplane-kustomization/istio-controlplane-prometheus.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-controlplane/istio-controlplane-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: istio-controlplane</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">  - name: jaeger-controlplane</span>
<span class="line">  - name: istio-operator</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-controlplane/istio-controlplane-kustomization</span>
<span class="line">  prune: true</span>
<span class="line">  sourceRef:</span>
<span class="line">    kind: GitRepository</span>
<span class="line">    name: flux-system</span>
<span class="line">    namespace: flux-system</span>
<span class="line">  wait: true</span>
<span class="line">  postBuild:</span>
<span class="line">    substituteFrom:</span>
<span class="line">    - kind: Secret</span>
<span class="line">      name: cluster-apps-substitutefrom-secret</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-controlplane/istio-controlplane-kustomization/istio-controlplane-istiooperator.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: install.istio.io/v1alpha1</span>
<span class="line">kind: IstioOperator</span>
<span class="line">metadata:</span>
<span class="line">  namespace: istio-system</span>
<span class="line">  name: istio-controlplane</span>
<span class="line">spec:</span>
<span class="line">  profile: default</span>
<span class="line">  meshConfig:</span>
<span class="line">    enableTracing: <span class="token boolean">true</span></span>
<span class="line">    enableAutoMtls: <span class="token boolean">true</span></span>
<span class="line">    defaultConfig:</span>
<span class="line">      tracing:</span>
<span class="line">        zipkin:</span>
<span class="line">          address: <span class="token string">&quot;jaeger-controlplane-collector-headless.jaeger-system.svc.cluster.local:9411&quot;</span></span>
<span class="line">        sampling: <span class="token number">100</span></span>
<span class="line">      sds:</span>
<span class="line">        enabled: <span class="token boolean">true</span></span>
<span class="line">  components:</span>
<span class="line">    egressGateways:</span>
<span class="line">      - name: istio-egressgateway</span>
<span class="line">        enabled: <span class="token boolean">true</span></span>
<span class="line">    ingressGateways:</span>
<span class="line">      - name: istio-ingressgateway</span>
<span class="line">        enabled: <span class="token boolean">true</span></span>
<span class="line">        k8s:</span>
<span class="line">          serviceAnnotations:</span>
<span class="line">            service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp</span>
<span class="line">            service.beta.kubernetes.io/aws-load-balancer-type: nlb</span>
<span class="line">            service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: <span class="token string">&quot;<span class="token variable">\${TAGS_INLINE}</span>&quot;</span></span>
<span class="line">    pilot:</span>
<span class="line">      k8s:</span>
<span class="line">        <span class="token comment"># Reduce resource requirements for local testing. This is NOT recommended for the real use cases</span></span>
<span class="line">        resources:</span>
<span class="line">          limits:</span>
<span class="line">            cpu: 200m</span>
<span class="line">            memory: 128Mi</span>
<span class="line">          requests:</span>
<span class="line">            cpu: 100m</span>
<span class="line">            memory: 64Mi</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-controlplane/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-controlplane&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- istio-controlplane$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource istio-controlplane <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="keycloak" tabindex="-1"><a class="header-anchor" href="#keycloak"><span>Keycloak</span></a></h4><blockquote><p>I was not able to make Keycloak working with local Dex, because Dex is not using valid certificates (Let&#39;s Encrypt staging).</p></blockquote><p><a href="https://www.keycloak.org/" target="_blank" rel="noopener noreferrer">Keycloak</a></p><ul><li><a href="https://artifacthub.io/packages/helm/bitnami/keycloak" target="_blank" rel="noopener noreferrer">Keycloak</a></li><li><a href="https://github.com/bitnami/charts/blob/master/bitnami/keycloak/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/keycloak</span>
<span class="line"></span>
<span class="line">kubectl create namespace keycloak --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/base/keycloak/keycloak-namespace.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> infrastructure/base/keycloak/keycloak-helmrelease.yaml <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">apiVersion: helm.toolkit.fluxcd.io/v2beta1</span>
<span class="line">kind: HelmRelease</span>
<span class="line">metadata:</span>
<span class="line">  name: keycloak</span>
<span class="line">  namespace: keycloak</span>
<span class="line">spec:</span>
<span class="line">  chart:</span>
<span class="line">    spec:</span>
<span class="line">      chart: keycloak</span>
<span class="line">      sourceRef:</span>
<span class="line">        kind: HelmRepository</span>
<span class="line">        name: bitnami</span>
<span class="line">        namespace: flux-system</span>
<span class="line">      version: 5.2.8</span>
<span class="line">  timeout: 10m</span>
<span class="line">  interval: 5m</span>
<span class="line">  valuesFrom:</span>
<span class="line">  - kind: ConfigMap</span>
<span class="line">    name: keycloak-values</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/keycloak/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/base/keycloak&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/keycloak</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/keycloak/keycloak-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/keycloak/keycloak-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: keycloak</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">    - name: kube-prometheus-stack</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/keycloak/keycloak-kustomization</span>
<span class="line">  prune: <span class="token boolean">true</span></span>
<span class="line">  sourceRef:</span>
<span class="line">    kind: GitRepository</span>
<span class="line">    name: flux-system</span>
<span class="line">    namespace: flux-system</span>
<span class="line">  wait: <span class="token boolean">true</span></span>
<span class="line">  postBuild:</span>
<span class="line">    substituteFrom:</span>
<span class="line">    - kind: Secret</span>
<span class="line">      name: cluster-apps-substitutefrom-secret</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/keycloak/keycloak-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/keycloak/keycloak-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: keycloak</span>
<span class="line">resources:</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/keycloak</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: keycloak-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>keycloak-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/keycloak/keycloak-kustomization/keycloak-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">global:</span>
<span class="line">  storageClass: <span class="token string">&quot;gp3&quot;</span></span>
<span class="line">clusterDomain: <span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">auth:</span>
<span class="line">  adminUser: admin</span>
<span class="line">  adminPassword: <span class="token variable">\${MY_PASSWORD}</span></span>
<span class="line">  managementUser: manager</span>
<span class="line">  managementPassword: <span class="token variable">\${MY_PASSWORD}</span></span>
<span class="line">proxyAddressForwarding: <span class="token boolean">true</span></span>
<span class="line"><span class="token comment"># https://stackoverflow.com/questions/51616770/keycloak-restricting-user-management-to-certain-groups-while-enabling-manage-us</span></span>
<span class="line">extraStartupArgs: <span class="token string">&quot;-Dkeycloak.profile.feature.admin_fine_grained_authz=enabled&quot;</span></span>
<span class="line">keycloakConfigCli:</span>
<span class="line">  enabled: <span class="token boolean">true</span></span>
<span class="line">  configuration:</span>
<span class="line">    myrealm.yaml: <span class="token operator">|</span></span>
<span class="line">      realm: myrealm</span>
<span class="line">      enabled: <span class="token boolean">true</span></span>
<span class="line">      displayName: My Realm</span>
<span class="line">      rememberMe: <span class="token boolean">true</span></span>
<span class="line">      userManagedAccessAllowed: <span class="token boolean">true</span></span>
<span class="line">      smtpServer:</span>
<span class="line">        from: myrealm-keycloak@<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">        fromDisplayName: Keycloak</span>
<span class="line">        host: mailhog.mailhog.svc.cluster.local</span>
<span class="line">        port: <span class="token number">1025</span></span>
<span class="line">      clients:</span>
<span class="line">      <span class="token comment"># https://oauth2-proxy.github.io/oauth2-proxy/docs/configuration/oauth_provider/#keycloak-auth-provider</span></span>
<span class="line">      - clientId: oauth2-proxy-keycloak.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">        name: oauth2-proxy-keycloak.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">        description: <span class="token string">&quot;OAuth2 Proxy for Keycloak&quot;</span></span>
<span class="line">        secret: <span class="token variable">\${MY_PASSWORD}</span></span>
<span class="line">        redirectUris:</span>
<span class="line">        - <span class="token string">&quot;https://oauth2-proxy-keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/callback&quot;</span></span>
<span class="line">        protocolMappers:</span>
<span class="line">        - name: groupMapper</span>
<span class="line">          protocol: openid-connect</span>
<span class="line">          protocolMapper: oidc-group-membership-mapper</span>
<span class="line">          config:</span>
<span class="line">            userinfo.token.claim: <span class="token string">&quot;true&quot;</span></span>
<span class="line">            id.token.claim: <span class="token string">&quot;true&quot;</span></span>
<span class="line">            access.token.claim: <span class="token string">&quot;true&quot;</span></span>
<span class="line">            claim.name: <span class="token function">groups</span></span>
<span class="line">            full.path: <span class="token string">&quot;true&quot;</span></span>
<span class="line">      identityProviders:</span>
<span class="line">      <span class="token comment"># https://ultimatesecurity.pro/post/okta-oidc/</span></span>
<span class="line">      - alias: keycloak-oidc-okta</span>
<span class="line">        displayName: <span class="token string">&quot;Okta&quot;</span></span>
<span class="line">        providerId: keycloak-oidc</span>
<span class="line">        trustEmail: <span class="token boolean">true</span></span>
<span class="line">        config:</span>
<span class="line">          clientId: <span class="token variable">\${OKTA_CLIENT_ID}</span></span>
<span class="line">          clientSecret: <span class="token variable">\${OKTA_CLIENT_SECRET}</span></span>
<span class="line">          tokenUrl: <span class="token string">&quot;<span class="token variable">\${OKTA_ISSUER}</span>/oauth2/default/v1/token&quot;</span></span>
<span class="line">          authorizationUrl: <span class="token string">&quot;<span class="token variable">\${OKTA_ISSUER}</span>/oauth2/default/v1/authorize&quot;</span></span>
<span class="line">          defaultScope: <span class="token string">&quot;openid profile email&quot;</span></span>
<span class="line">          syncMode: IMPORT</span>
<span class="line">      users:</span>
<span class="line">      - username: myuser1</span>
<span class="line">        email: myuser1@<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">        enabled: <span class="token boolean">true</span></span>
<span class="line">        firstName: My Firstname <span class="token number">1</span></span>
<span class="line">        lastName: My Lastname <span class="token number">1</span></span>
<span class="line">        groups:</span>
<span class="line">          - group-admins</span>
<span class="line">        credentials:</span>
<span class="line">        - type: password</span>
<span class="line">          value: <span class="token variable">\${MY_PASSWORD}</span></span>
<span class="line">      - username: myuser2</span>
<span class="line">        email: myuser2@<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">        enabled: <span class="token boolean">true</span></span>
<span class="line">        firstName: My Firstname <span class="token number">2</span></span>
<span class="line">        lastName: My Lastname <span class="token number">2</span></span>
<span class="line">        groups:</span>
<span class="line">          - group-admins</span>
<span class="line">        credentials:</span>
<span class="line">        - type: password</span>
<span class="line">          value: <span class="token variable">\${MY_PASSWORD}</span></span>
<span class="line">      - username: myuser3</span>
<span class="line">        email: myuser3@<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">        enabled: <span class="token boolean">true</span></span>
<span class="line">        firstName: My Firstname <span class="token number">3</span></span>
<span class="line">        lastName: My Lastname <span class="token number">3</span></span>
<span class="line">        groups:</span>
<span class="line">          - group-users</span>
<span class="line">        credentials:</span>
<span class="line">        - type: password</span>
<span class="line">          value: <span class="token variable">\${MY_PASSWORD}</span></span>
<span class="line">      - username: myuser4</span>
<span class="line">        email: myuser4@<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">        enabled: <span class="token boolean">true</span></span>
<span class="line">        firstName: My Firstname <span class="token number">4</span></span>
<span class="line">        lastName: My Lastname <span class="token number">4</span></span>
<span class="line">        groups:</span>
<span class="line">          - group-users</span>
<span class="line">          - group-test</span>
<span class="line">        credentials:</span>
<span class="line">        - type: password</span>
<span class="line">          value: <span class="token variable">\${MY_PASSWORD}</span></span>
<span class="line">      groups:</span>
<span class="line">      - name: group-users</span>
<span class="line">      - name: group-admins</span>
<span class="line">      - name: group-test</span>
<span class="line">service:</span>
<span class="line">  type: ClusterIP</span>
<span class="line">ingress:</span>
<span class="line">  enabled: <span class="token boolean">true</span></span>
<span class="line">  hostname: keycloak.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">  ingressClassName: nginx</span>
<span class="line">  extraTls:</span>
<span class="line">  - hosts:</span>
<span class="line">    - keycloak.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">metrics:</span>
<span class="line">  enabled: <span class="token boolean">true</span></span>
<span class="line">  serviceMonitor:</span>
<span class="line">    enabled: <span class="token boolean">true</span></span>
<span class="line">postgresql:</span>
<span class="line">  postgresqlPassword: <span class="token variable">\${MY_PASSWORD}</span></span>
<span class="line">  persistence:</span>
<span class="line">    enabled: <span class="token boolean">true</span></span>
<span class="line">    size: 1Gi</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/keycloak/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/keycloak&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- keycloak$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource keycloak <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="kiali" tabindex="-1"><a class="header-anchor" href="#kiali"><span>Kiali</span></a></h4><p><a href="https://github.com/kiali/kiali-operator" target="_blank" rel="noopener noreferrer">Kiali Operator</a></p><ul><li><a href="https://github.com/kiali/helm-charts/tree/master/kiali-operator" target="_blank" rel="noopener noreferrer">kiali-operator</a></li><li><a href="https://github.com/kiali/helm-charts/blob/master/kiali-operator/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/kiali-operator</span>
<span class="line"></span>
<span class="line">kubectl create namespace kiali-operator --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/base/kiali-operator/kiali-operator-namespace.yaml&quot;</span></span>
<span class="line"></span>
<span class="line">flux create helmrelease kiali-operator <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;kiali-operator&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/kiali.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;kiali-operator&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;1.44.0&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--crds</span><span class="token operator">=</span><span class="token string">&quot;CreateReplace&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/kiali-operator/kiali-operator-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/kiali-operator/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/base/kiali-operator&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/kiali-operator</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-operator/kiali-operator-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line">flux create kustomization kiali-operator <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/kiali-operator/kiali-operator-kustomization&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-operator/kiali-operator-kustomization.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-operator/kiali-operator-kustomization/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span></span>
<span class="line">    <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-operator/kiali-operator-kustomization&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">      kustomize create <span class="token parameter variable">--resources</span> <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/kiali-operator <span class="token operator">&amp;&amp;</span></span>
<span class="line">      <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span></span>
<span class="line">  <span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-operator/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-operator&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- kiali-operator$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource kiali-operator <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="deploy-kiali-using-operator" tabindex="-1"><a class="header-anchor" href="#deploy-kiali-using-operator"><span>Deploy Kiali using operator</span></a></h4><p><a href="https://kiali.io/" target="_blank" rel="noopener noreferrer">Kiali</a></p><ul><li><a href="https://github.com/kiali/kiali-operator/blob/master/deploy/kiali/kiali_cr.yaml" target="_blank" rel="noopener noreferrer">Kiali CRD</a></li></ul><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-controlplane/kiali-controlplane-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-controlplane/kiali-controlplane-kustomization/kiali-controlplane-secret.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: v1</span>
<span class="line">kind: Secret</span>
<span class="line">metadata:</span>
<span class="line">  name: kiali</span>
<span class="line">  namespace: istio-system</span>
<span class="line">data:</span>
<span class="line">  oidc-secret: <span class="token variable">\${MY_PASSWORD_BASE64}</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-controlplane/kiali-controlplane-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: kiali-controlplane</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">  - name: istio-controlplane</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-controlplane/kiali-controlplane-kustomization</span>
<span class="line">  prune: true</span>
<span class="line">  sourceRef:</span>
<span class="line">    kind: GitRepository</span>
<span class="line">    name: flux-system</span>
<span class="line">    namespace: flux-system</span>
<span class="line">  wait: true</span>
<span class="line">  postBuild:</span>
<span class="line">    substituteFrom:</span>
<span class="line">    - kind: Secret</span>
<span class="line">      name: cluster-apps-substitutefrom-secret</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-controlplane/kiali-controlplane-kustomization/kiali-controlplane-kiali.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kiali.io/v1alpha1</span>
<span class="line">kind: Kiali</span>
<span class="line">metadata:</span>
<span class="line">  namespace: istio-system</span>
<span class="line">  name: kiali-controlplane</span>
<span class="line">spec:</span>
<span class="line">  istio_namespace: istio-system</span>
<span class="line">  auth:</span>
<span class="line">    strategy: openid</span>
<span class="line">    openid:</span>
<span class="line">      client_id: kiali.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">      disable_rbac: <span class="token boolean">true</span></span>
<span class="line">      insecure_skip_verify_tls: <span class="token boolean">true</span></span>
<span class="line">      issuer_uri: <span class="token string">&quot;https://dex.<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span></span>
<span class="line">      username_claim: email</span>
<span class="line">  deployment:</span>
<span class="line">    namespace: istio-system</span>
<span class="line">    ingress:</span>
<span class="line">      enabled: <span class="token boolean">true</span></span>
<span class="line">      override_yaml:</span>
<span class="line">        spec:</span>
<span class="line">          ingressClassName: nginx</span>
<span class="line">          rules:</span>
<span class="line">          - host: kiali.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">            http:</span>
<span class="line">              paths:</span>
<span class="line">              - path: /</span>
<span class="line">                pathType: ImplementationSpecific</span>
<span class="line">                backend:</span>
<span class="line">                  service:</span>
<span class="line">                    name: kiali</span>
<span class="line">                    port:</span>
<span class="line">                      number: <span class="token number">20001</span></span>
<span class="line">            tls:</span>
<span class="line">            - hosts:</span>
<span class="line">              - kiali.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">  external_services:</span>
<span class="line">    grafana:</span>
<span class="line">      is_core_component: <span class="token boolean">true</span></span>
<span class="line">      url: <span class="token string">&quot;https://grafana.<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span></span>
<span class="line">      in_cluster_url: <span class="token string">&quot;http://kube-prometheus-stack-grafana.kube-prometheus-stack.svc.cluster.local:80&quot;</span></span>
<span class="line">    prometheus:</span>
<span class="line">      is_core_component: <span class="token boolean">true</span></span>
<span class="line">      url: http://kube-prometheus-stack-prometheus.kube-prometheus-stack.svc.cluster.local:9090</span>
<span class="line">    tracing:</span>
<span class="line">      is_core_component: <span class="token boolean">true</span></span>
<span class="line">      url: https://jaeger.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">      in_cluster_url: http://jaeger-controlplane-query.jaeger-system.svc.cluster.local:16686</span>
<span class="line">  server:</span>
<span class="line">    web_fqdn: kiali.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">    web_root: /</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-controlplane/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-controlplane&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- kiali-controlplane$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource kiali-controlplane <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="kuard" tabindex="-1"><a class="header-anchor" href="#kuard"><span>kuard</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kuard-secretproviderclass&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kuard-secretproviderclass.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: kuard-secretproviderclass</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">    - name: secrets-store-csi-driver-provider-aws</span>
<span class="line">    - name: cp-aws-kms-key-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: <span class="token string">&quot;./clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kuard-secretproviderclass&quot;</span></span>
<span class="line">  prune: <span class="token boolean">true</span></span>
<span class="line">  sourceRef:</span>
<span class="line">    kind: GitRepository</span>
<span class="line">    name: flux-system</span>
<span class="line">    namespace: flux-system</span>
<span class="line">  wait: <span class="token boolean">true</span></span>
<span class="line">  postBuild:</span>
<span class="line">    substituteFrom:</span>
<span class="line">    - kind: Secret</span>
<span class="line">      name: cluster-apps-substitutefrom-secret</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kuard-secretproviderclass/kuard-secretproviderclass.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: secrets-store.csi.x-k8s.io/v1alpha1</span>
<span class="line">kind: SecretProviderClass</span>
<span class="line">metadata:</span>
<span class="line">  name: kuard-asm-eks-<span class="token variable">\${CLUSTER_NAME}</span>-secrets</span>
<span class="line">  namespace: kuard</span>
<span class="line">spec:</span>
<span class="line">  provider: aws</span>
<span class="line">  parameters:</span>
<span class="line">    objects: <span class="token operator">|</span></span>
<span class="line">      - objectName: <span class="token string">&quot;cp-aws-asm-secret-key&quot;</span></span>
<span class="line">        objectType: <span class="token string">&quot;secretsmanager&quot;</span></span>
<span class="line">  secretObjects:</span>
<span class="line">  - secretName: <span class="token string">&quot;cp-aws-asm-secret-key&quot;</span></span>
<span class="line">    type: Opaque</span>
<span class="line">    data:</span>
<span class="line">    - objectName: <span class="token string">&quot;cp-aws-asm-secret-key&quot;</span></span>
<span class="line">      key: username</span>
<span class="line">    - objectName: <span class="token string">&quot;cp-aws-asm-secret-key&quot;</span></span>
<span class="line">      key: password</span>
<span class="line">EOF</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kuard-manifests&quot;</span></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kuard-manifests.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: kuard-manifests</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">    - name: kuard-secretproviderclass</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: <span class="token string">&quot;./clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kuard-manifests&quot;</span></span>
<span class="line">  prune: <span class="token boolean">true</span></span>
<span class="line">  sourceRef:</span>
<span class="line">    kind: GitRepository</span>
<span class="line">    name: flux-system</span>
<span class="line">    namespace: flux-system</span>
<span class="line">  wait: <span class="token boolean">true</span></span>
<span class="line">  postBuild:</span>
<span class="line">    substituteFrom:</span>
<span class="line">    - kind: Secret</span>
<span class="line">      name: cluster-apps-substitutefrom-secret</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line">kubectl create <span class="token function">service</span> clusterip kuard <span class="token parameter variable">--namespace</span> kuard <span class="token parameter variable">--tcp</span><span class="token operator">=</span><span class="token number">8080</span>:8080 --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kuard-manifests/kuard-service.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kuard-manifests/kuard-deployment.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: apps/v1</span>
<span class="line">kind: Deployment</span>
<span class="line">metadata:</span>
<span class="line">  name: kuard-deployment</span>
<span class="line">  namespace: kuard</span>
<span class="line">  labels:</span>
<span class="line">    app: kuard</span>
<span class="line">spec:</span>
<span class="line">  replicas: <span class="token number">1</span></span>
<span class="line">  selector:</span>
<span class="line">    matchLabels:</span>
<span class="line">      app: kuard</span>
<span class="line">  template:</span>
<span class="line">    metadata:</span>
<span class="line">      labels:</span>
<span class="line">        app: kuard</span>
<span class="line">    spec:</span>
<span class="line">      serviceAccountName: kuard-sa</span>
<span class="line">      affinity:</span>
<span class="line">        podAntiAffinity:</span>
<span class="line">          requiredDuringSchedulingIgnoredDuringExecution:</span>
<span class="line">          - topologyKey: <span class="token string">&quot;kubernetes.io/hostname&quot;</span></span>
<span class="line">            labelSelector:</span>
<span class="line">              matchLabels:</span>
<span class="line">                app: kuard</span>
<span class="line">      volumes:</span>
<span class="line">      - name: secrets-store-inline</span>
<span class="line">        csi:</span>
<span class="line">          driver: secrets-store.csi.k8s.io</span>
<span class="line">          readOnly: <span class="token boolean">true</span></span>
<span class="line">          volumeAttributes:</span>
<span class="line">            secretProviderClass: kuard-asm-eks-<span class="token variable">\${CLUSTER_NAME}</span>-secrets</span>
<span class="line">      containers:</span>
<span class="line">      - name: kuard-deployment</span>
<span class="line">        image: gcr.io/kuar-demo/kuard-amd64:v0.10.0-green</span>
<span class="line">        resources:</span>
<span class="line">          requests:</span>
<span class="line">            cpu: 100m</span>
<span class="line">            memory: <span class="token string">&quot;64Mi&quot;</span></span>
<span class="line">          limits:</span>
<span class="line">            cpu: 100m</span>
<span class="line">            memory: <span class="token string">&quot;64Mi&quot;</span></span>
<span class="line">        ports:</span>
<span class="line">        - containerPort: <span class="token number">8080</span></span>
<span class="line">        volumeMounts:</span>
<span class="line">        - name: secrets-store-inline</span>
<span class="line">          mountPath: <span class="token string">&quot;/mnt/secrets-store&quot;</span></span>
<span class="line">          readOnly: <span class="token boolean">true</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line">kubectl create ingress <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--annotation</span><span class="token operator">=</span><span class="token string">&quot;nginx.ingress.kubernetes.io/auth-signin=https://oauth2-proxy.\\<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd=\\<span class="token variable">$scheme</span>://\\<span class="token variable">$host</span>\\<span class="token variable">$request_uri</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--annotation</span><span class="token operator">=</span><span class="token string">&quot;nginx.ingress.kubernetes.io/auth-url=https://oauth2-proxy.\\<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span> kuard kuard <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--class</span><span class="token operator">=</span>nginx <span class="token parameter variable">--rule</span><span class="token operator">=</span><span class="token string">&quot;kuard.<span class="token variable">\${CLUSTER_FQDN}</span>/*=kuard:8080,tls&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-o</span> yaml --dry-run<span class="token operator">=</span>client <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kuard-manifests/kuard-ingress.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&quot;\\- kuard$&quot;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span></span>
<span class="line">    <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">      kustomize edit <span class="token function">add</span> resource kuard <span class="token operator">&amp;&amp;</span></span>
<span class="line">      <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span></span>
<span class="line">  <span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="kubed" tabindex="-1"><a class="header-anchor" href="#kubed"><span>kubed</span></a></h3><p><a href="https://appscode.com/products/kubed/" target="_blank" rel="noopener noreferrer">kubed</a></p><ul><li><a href="https://artifacthub.io/packages/helm/appscode/kubed" target="_blank" rel="noopener noreferrer">kubed</a></li><li><a href="https://github.com/kubeops/config-syncer/blob/2310687a9ee63ba22ef272cbaaef8f7f89314183/charts/kubed/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/kubed</span>
<span class="line"></span>
<span class="line">kubectl create namespace kubed --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/kubed/kubed-namespace.yaml</span>
<span class="line"></span>
<span class="line">flux create helmrelease kubed <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;kubed&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/appscode.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;kubed&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;v0.12.0&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/kubed/kubed-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/kubed/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/base/kubed&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/kubed</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubed/kubed-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line">flux create kustomization kubed <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubed/kubed-kustomization&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubed/kubed-kustomization.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubed/kubed-kustomization/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span></span>
<span class="line">    <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubed/kubed-kustomization&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">      kustomize create <span class="token parameter variable">--resources</span> <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/kubed <span class="token operator">&amp;&amp;</span></span>
<span class="line">      <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span></span>
<span class="line">  <span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubed/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubed&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- kubed$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource kubed <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="kubernetes-dashboard" tabindex="-1"><a class="header-anchor" href="#kubernetes-dashboard"><span>kubernetes-dashboard</span></a></h3><p><a href="https://github.com/kubernetes/dashboard" target="_blank" rel="noopener noreferrer">kubernetes-dashboard</a></p><ul><li><a href="https://artifacthub.io/packages/helm/k8s-dashboard/kubernetes-dashboard" target="_blank" rel="noopener noreferrer">kubernetes-dashboard</a></li><li><a href="https://github.com/kubernetes/dashboard/blob/d27d62127573e775b122976eccbc2c8aa94f5f84/charts/helm-chart/kubernetes-dashboard/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/kubernetes-dashboard</span>
<span class="line"></span>
<span class="line">kubectl create namespace kubernetes-dashboard --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/kubernetes-dashboard/kubernetes-dashboard-namespace.yaml</span>
<span class="line"></span>
<span class="line">flux create helmrelease kubernetes-dashboard <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;kubernetes-dashboard&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/kubernetes-dashboard.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;kubernetes-dashboard&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;5.0.5&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/kubernetes-dashboard-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/kubernetes-dashboard/kubernetes-dashboard-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/kubernetes-dashboard/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/base/kubernetes-dashboard&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/kubernetes-dashboard</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubernetes-dashboard/kubernetes-dashboard-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubernetes-dashboard/kubernetes-dashboard-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: kubernetes-dashboard</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">    - name: kube-prometheus-stack</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: <span class="token string">&quot;./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubernetes-dashboard/kubernetes-dashboard-kustomization&quot;</span></span>
<span class="line">  prune: <span class="token boolean">true</span></span>
<span class="line">  sourceRef:</span>
<span class="line">    kind: GitRepository</span>
<span class="line">    name: flux-system</span>
<span class="line">    namespace: flux-system</span>
<span class="line">  wait: <span class="token boolean">true</span></span>
<span class="line">  postBuild:</span>
<span class="line">    substituteFrom:</span>
<span class="line">    - kind: Secret</span>
<span class="line">      name: cluster-apps-substitutefrom-secret</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubernetes-dashboard/kubernetes-dashboard-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubernetes-dashboard/kubernetes-dashboard-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: kubernetes-dashboard</span>
<span class="line">resources:</span>
<span class="line">  - kubernetes-dashboard-clusterrolebinding.yaml</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/kubernetes-dashboard</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: kubernetes-dashboard-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>kubernetes-dashboard-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubernetes-dashboard/kubernetes-dashboard-kustomization/kubernetes-dashboard-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">extraArgs:</span>
<span class="line">  - --enable-skip-login</span>
<span class="line">  - --enable-insecure-login</span>
<span class="line">  - --disable-settings-authorizer</span>
<span class="line">protocolHttp: <span class="token boolean">true</span></span>
<span class="line">ingress:</span>
<span class="line">  enabled: <span class="token boolean">true</span></span>
<span class="line">  annotations:</span>
<span class="line">     nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth</span>
<span class="line">     nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd<span class="token operator">=</span><span class="token variable">$scheme</span>://<span class="token variable">$host</span><span class="token variable">$request_uri</span></span>
<span class="line">  className: <span class="token string">&quot;nginx&quot;</span></span>
<span class="line">  hosts:</span>
<span class="line">    - kubernetes-dashboard.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">  tls:</span>
<span class="line">    - hosts:</span>
<span class="line">      - kubernetes-dashboard.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">settings:</span>
<span class="line">  clusterName: <span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">  itemsPerPage: <span class="token number">50</span></span>
<span class="line">metricsScraper:</span>
<span class="line">  enabled: <span class="token boolean">true</span></span>
<span class="line">serviceAccount:</span>
<span class="line">  name: kubernetes-dashboard-admin</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line">kubectl create clusterrolebinding kubernetes-dashboard-admin <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--clusterrole</span><span class="token operator">=</span>cluster-admin <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--serviceaccount</span><span class="token operator">=</span>kubernetes-dashboard:kubernetes-dashboard-admin <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">-o</span> yaml --dry-run<span class="token operator">=</span>client <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubernetes-dashboard/kubernetes-dashboard-kustomization/kubernetes-dashboard-clusterrolebinding.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubernetes-dashboard/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubernetes-dashboard&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- kubernetes-dashboard$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource kubernetes-dashboard <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="kyverno" tabindex="-1"><a class="header-anchor" href="#kyverno"><span>Kyverno</span></a></h3><p><a href="https://kyverno.io/" target="_blank" rel="noopener noreferrer">Kyverno</a></p><ul><li><p><a href="https://artifacthub.io/packages/helm/kyverno/kyverno" target="_blank" rel="noopener noreferrer">kyverno</a></p></li><li><p><a href="https://github.com/kyverno/kyverno/blob/main/charts/kyverno/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></p></li><li><p><a href="https://artifacthub.io/packages/helm/kyverno/kyverno-policies" target="_blank" rel="noopener noreferrer">kyverno-policies</a></p></li><li><p><a href="https://github.com/kyverno/kyverno/blob/main/charts/kyverno-policies/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></p></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/kyverno</span>
<span class="line"></span>
<span class="line">kubectl create namespace kyverno --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/kyverno/kyverno-namespace.yaml</span>
<span class="line"></span>
<span class="line">flux create helmrelease kyverno <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;kyverno&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/kyverno.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;kyverno&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;v2.1.3&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/kyverno-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/kyverno/kyverno-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/kyverno/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/base/kyverno&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/kyverno-policies</span>
<span class="line"></span>
<span class="line">flux create helmrelease kyverno-policies <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;kyverno&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --depends-on<span class="token operator">=</span><span class="token string">&quot;kyverno&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/kyverno.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;kyverno-policies&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;v2.1.3&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/kyverno-policies/kyverno-policies-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/kyverno-policies/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/base/kyverno-policies&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/crossplane</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno/kyverno-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line">flux create kustomization kyverno <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --depends-on<span class="token operator">=</span><span class="token string">&quot;kube-prometheus-stack&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/kyverno/kyverno-kustomization&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno/kyverno-kustomization.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno/kyverno-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno/kyverno-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: kyverno</span>
<span class="line">resources:</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/kyverno</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: kyverno-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>kyverno-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno/kyverno-kustomization/kyverno-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">serviceMonitor:</span>
<span class="line">  enabled: <span class="token boolean">true</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- kyverno$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource kyverno <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno-policies/kyverno-policies-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line">flux create kustomization kyverno-policies <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --depends-on<span class="token operator">=</span><span class="token string">&quot;kyverno&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/kyverno-policies/kyverno-policies-kustomization&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno-policies/kyverno-policies-kustomization.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno-policies/kyverno-policies-kustomization/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span></span>
<span class="line">    <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno-policies/kyverno-policies-kustomization&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">      kustomize create <span class="token parameter variable">--resources</span> <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/kyverno-policies <span class="token operator">&amp;&amp;</span></span>
<span class="line">      <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span></span>
<span class="line">  <span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno-policies/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno-policies&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- kyverno-policies$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource kyverno-policies <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="oauth2-proxy-keycloak" tabindex="-1"><a class="header-anchor" href="#oauth2-proxy-keycloak"><span>OAuth2 Proxy - Keycloak</span></a></h3><p><a href="https://oauth2-proxy.github.io/oauth2-proxy/" target="_blank" rel="noopener noreferrer">oauth2-proxy</a></p><ul><li><a href="https://artifacthub.io/packages/helm/oauth2-proxy/oauth2-proxy" target="_blank" rel="noopener noreferrer">oauth2-proxy</a></li><li><a href="https://github.com/oauth2-proxy/manifests/blob/main/helm/oauth2-proxy/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/oauth2-proxy-keycloak</span>
<span class="line"></span>
<span class="line">kubectl create namespace oauth2-proxy-keycloak --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/oauth2-proxy-keycloak/oauth2-proxy-keycloak-namespace.yaml</span>
<span class="line"></span>
<span class="line">flux create helmrelease oauth2-proxy-keycloak <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;oauth2-proxy-keycloak&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/oauth2-proxy.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;oauth2-proxy&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;5.0.6&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/oauth2-proxy-keycloak-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/oauth2-proxy-keycloak/oauth2-proxy-keycloak-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/oauth2-proxy-keycloak/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/base/oauth2-proxy-keycloak&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/oauth2-proxy-keycloak</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy-keycloak/oauth2-proxy-keycloak-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy-keycloak/oauth2-proxy-keycloak-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: oauth2-proxy-keycloak</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">  - name: kube-prometheus-stack</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy-keycloak/oauth2-proxy-keycloak-kustomization</span>
<span class="line">  prune: <span class="token boolean">true</span></span>
<span class="line">  sourceRef:</span>
<span class="line">    kind: GitRepository</span>
<span class="line">    name: flux-system</span>
<span class="line">    namespace: flux-system</span>
<span class="line">  wait: <span class="token boolean">true</span></span>
<span class="line">  postBuild:</span>
<span class="line">    substituteFrom:</span>
<span class="line">    - kind: Secret</span>
<span class="line">      name: cluster-apps-substitutefrom-secret</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy-keycloak/oauth2-proxy-keycloak-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy-keycloak/oauth2-proxy-keycloak-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: oauth2-proxy-keycloak</span>
<span class="line">resources:</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/oauth2-proxy-keycloak</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: oauth2-proxy-keycloak-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>oauth2-proxy-keycloak-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy-keycloak/oauth2-proxy-keycloak-kustomization/oauth2-proxy-keycloak-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">config:</span>
<span class="line">  clientID: oauth2-proxy-keycloak.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">  clientSecret: <span class="token variable">\${MY_PASSWORD}</span></span>
<span class="line">  cookieSecret: <span class="token variable">\${MY_COOKIE_SECRET}</span></span>
<span class="line">  configFile: <span class="token operator">|</span>-</span>
<span class="line">    email_domains <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token string">&quot;*&quot;</span> <span class="token punctuation">]</span></span>
<span class="line">    upstreams <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token string">&quot;file:///dev/null&quot;</span> <span class="token punctuation">]</span></span>
<span class="line">    whitelist_domains <span class="token operator">=</span> <span class="token string">&quot;.<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span></span>
<span class="line">    cookie_domains <span class="token operator">=</span> <span class="token string">&quot;.<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span></span>
<span class="line">    provider <span class="token operator">=</span> <span class="token string">&quot;keycloak&quot;</span></span>
<span class="line">    login_url <span class="token operator">=</span> <span class="token string">&quot;https://keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>/auth/realms/myrealm/protocol/openid-connect/auth&quot;</span></span>
<span class="line">    redeem_url <span class="token operator">=</span> <span class="token string">&quot;https://keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>/auth/realms/myrealm/protocol/openid-connect/token&quot;</span></span>
<span class="line">    profile_url <span class="token operator">=</span> <span class="token string">&quot;https://keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>/auth/realms/myrealm/protocol/openid-connect/userinfo&quot;</span></span>
<span class="line">    validate_url <span class="token operator">=</span> <span class="token string">&quot;https://keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>/auth/realms/myrealm/protocol/openid-connect/userinfo&quot;</span></span>
<span class="line">    scope <span class="token operator">=</span> <span class="token string">&quot;openid email profile&quot;</span></span>
<span class="line">    ssl_insecure_skip_verify <span class="token operator">=</span> <span class="token string">&quot;true&quot;</span></span>
<span class="line">    insecure_oidc_skip_issuer_verification <span class="token operator">=</span> <span class="token string">&quot;true&quot;</span></span>
<span class="line">ingress:</span>
<span class="line">  enabled: <span class="token boolean">true</span></span>
<span class="line">  className: nginx</span>
<span class="line">  hosts:</span>
<span class="line">    - oauth2-proxy-keycloak.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">  tls:</span>
<span class="line">    - hosts:</span>
<span class="line">      - oauth2-proxy-keycloak.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">metrics:</span>
<span class="line">  servicemonitor:</span>
<span class="line">    enabled: <span class="token boolean">true</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy-keycloak/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy-keycloak&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- oauth2-proxy-keycloak$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource oauth2-proxy-keycloak <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="podinfo" tabindex="-1"><a class="header-anchor" href="#podinfo"><span>podinfo</span></a></h3><p><a href="https://github.com/stefanprodan/podinfo" target="_blank" rel="noopener noreferrer">podinfo</a></p><ul><li><a href="https://artifacthub.io/packages/helm/podinfo/podinfo" target="_blank" rel="noopener noreferrer">podinfo</a></li><li><a href="https://github.com/stefanprodan/podinfo/blob/master/charts/podinfo/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/podinfo</span>
<span class="line"></span>
<span class="line">kubectl create namespace podinfo --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/podinfo/podinfo-namespace.yaml</span>
<span class="line"></span>
<span class="line">flux create helmrelease podinfo <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;podinfo&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/podinfo.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;podinfo&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;6.0.3&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/podinfo-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/podinfo/podinfo-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/podinfo/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/base/podinfo&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/podinfo</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/podinfo/podinfo-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/podinfo/podinfo-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: podinfo</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">    - name: kube-prometheus-stack</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: <span class="token string">&quot;./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/podinfo/podinfo-kustomization&quot;</span></span>
<span class="line">  prune: <span class="token boolean">true</span></span>
<span class="line">  sourceRef:</span>
<span class="line">    kind: GitRepository</span>
<span class="line">    name: flux-system</span>
<span class="line">    namespace: flux-system</span>
<span class="line">  wait: <span class="token boolean">true</span></span>
<span class="line">  postBuild:</span>
<span class="line">    substituteFrom:</span>
<span class="line">    - kind: Secret</span>
<span class="line">      name: cluster-apps-substitutefrom-secret</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/podinfo/podinfo-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/podinfo/podinfo-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: podinfo</span>
<span class="line">resources:</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/podinfo</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: podinfo-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>podinfo-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/podinfo/podinfo-kustomization/podinfo-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">ingress:</span>
<span class="line">  enabled: <span class="token boolean">true</span></span>
<span class="line">  className: nginx</span>
<span class="line">  annotations:</span>
<span class="line">    nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy-keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth</span>
<span class="line">    nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy-keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd<span class="token operator">=</span><span class="token variable">$scheme</span>://<span class="token variable">$host</span><span class="token variable">$request_uri</span></span>
<span class="line">  hosts:</span>
<span class="line">    - host: podinfo.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">      paths:</span>
<span class="line">        - path: /</span>
<span class="line">          pathType: ImplementationSpecific</span>
<span class="line">  tls:</span>
<span class="line">    - hosts:</span>
<span class="line">      - podinfo.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">serviceMonitor:</span>
<span class="line">  enabled: <span class="token boolean">true</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/podinfo/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/podinfo&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- podinfo$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource podinfo <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="polaris" tabindex="-1"><a class="header-anchor" href="#polaris"><span>Polaris</span></a></h3><p>Add Polaris to the single K8s cluster.</p><p><a href="https://www.fairwinds.com/polaris" target="_blank" rel="noopener noreferrer">Polaris</a></p><ul><li><a href="https://artifacthub.io/packages/helm/fairwinds-stable/polaris" target="_blank" rel="noopener noreferrer">polaris</a></li><li><a href="https://github.com/FairwindsOps/charts/blob/master/stable/polaris/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Add <code>HelmRepository</code> for polaris to &quot;cluster level&quot;:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">flux create <span class="token builtin class-name">source</span> helm <span class="token string">&quot;fairwinds-stable&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--url</span><span class="token operator">=</span><span class="token string">&quot;https://charts.fairwinds.com/stable&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span>1h <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/sources/fairwinds-stable.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- fairwinds-stable.yaml$&#39;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/sources/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span></span>
<span class="line">    <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/sources/&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">      kustomize edit <span class="token function">add</span> resource fairwinds-stable.yaml <span class="token operator">&amp;&amp;</span></span>
<span class="line">      <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span></span>
<span class="line">  <span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;cluster level&quot; application definition:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-pv</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/polaris&quot;</span></span>
<span class="line"></span>
<span class="line">kubectl create namespace polaris --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/polaris/polaris-namespace.yaml&quot;</span></span>
<span class="line"></span>
<span class="line">flux create helmrelease polaris <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;polaris&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/fairwinds-stable.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;polaris&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;4.2.3&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/polaris-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/polaris/polaris-helmrelease.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/polaris/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/polaris/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: polaris</span>
<span class="line">resources:</span>
<span class="line">  - polaris-namespace.yaml</span>
<span class="line">  - polaris-helmrelease.yaml</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: polaris-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>polaris-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/polaris/polaris-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">dashboard:</span>
<span class="line">  ingress:</span>
<span class="line">    enabled: <span class="token boolean">true</span></span>
<span class="line">    annotations:</span>
<span class="line">      nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth</span>
<span class="line">      nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd<span class="token operator">=</span><span class="token variable">$scheme</span>://<span class="token variable">$host</span><span class="token variable">$request_uri</span></span>
<span class="line">    hosts:</span>
<span class="line">      - polaris.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">    tls:</span>
<span class="line">      - hosts:</span>
<span class="line">        - polaris.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- polaris$&#39;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource polaris <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="policy-reporter" tabindex="-1"><a class="header-anchor" href="#policy-reporter"><span>Policy Reporter</span></a></h3><p><a href="https://github.com/kyverno/policy-reporter/wiki" target="_blank" rel="noopener noreferrer">Policy Reporter</a></p><ul><li><a href="https://github.com/kyverno/policy-reporter/tree/main/charts/policy-reporter" target="_blank" rel="noopener noreferrer">policy-reporter</a></li><li><a href="https://github.com/kyverno/policy-reporter/blob/main/charts/policy-reporter/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/policy-reporter</span>
<span class="line"></span>
<span class="line">kubectl create namespace policy-reporter --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/policy-reporter/policy-reporter-namespace.yaml</span>
<span class="line"></span>
<span class="line">flux create helmrelease policy-reporter <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;policy-reporter&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/policy-reporter.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;policy-reporter&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;2.1.1&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/policy-reporter-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/policy-reporter/policy-reporter-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/policy-reporter/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/base/policy-reporter&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/cert-manager</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/policy-reporter/policy-reporter-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/policy-reporter/policy-reporter-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: policy-reporter</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">  - name: kyverno</span>
<span class="line">  - name: kube-prometheus-stack</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/policy-reporter/policy-reporter-kustomization</span>
<span class="line">  prune: <span class="token boolean">true</span></span>
<span class="line">  sourceRef:</span>
<span class="line">    kind: GitRepository</span>
<span class="line">    name: flux-system</span>
<span class="line">    namespace: flux-system</span>
<span class="line">  wait: <span class="token boolean">true</span></span>
<span class="line">  postBuild:</span>
<span class="line">    substituteFrom:</span>
<span class="line">    - kind: Secret</span>
<span class="line">      name: cluster-apps-substitutefrom-secret</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/policy-reporter/policy-reporter-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/policy-reporter/policy-reporter-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: policy-reporter</span>
<span class="line">resources:</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/policy-reporter</span>
<span class="line">  - policy-reporter-ingress.yaml</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: policy-reporter-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>policy-reporter-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/policy-reporter/policy-reporter-kustomization/policy-reporter-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">ui:</span>
<span class="line">  enabled: <span class="token boolean">true</span></span>
<span class="line">kyvernoPlugin:</span>
<span class="line">  enabled: <span class="token boolean">true</span></span>
<span class="line">monitoring:</span>
<span class="line">  enabled: <span class="token boolean">true</span></span>
<span class="line">  namespace: policy-reporter</span>
<span class="line">global:</span>
<span class="line">  plugins:</span>
<span class="line">    keyverno: <span class="token boolean">true</span></span>
<span class="line">target:</span>
<span class="line">  slack:</span>
<span class="line">    webhook: <span class="token string">&quot;<span class="token variable">\${SLACK_INCOMING_WEBHOOK_URL}</span>&quot;</span></span>
<span class="line">    minimumPriority: <span class="token string">&quot;critical&quot;</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/policy-reporter/policy-reporter-kustomization/policy-reporter-ingress.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: networking.k8s.io/v1</span>
<span class="line">kind: Ingress</span>
<span class="line">metadata:</span>
<span class="line">  annotations:</span>
<span class="line">    nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd<span class="token operator">=</span><span class="token variable">$scheme</span>://<span class="token variable">$host</span><span class="token variable">$request_uri</span></span>
<span class="line">    nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth</span>
<span class="line">  name: policy-reporter</span>
<span class="line">  namespace: policy-reporter</span>
<span class="line">spec:</span>
<span class="line">  ingressClassName: nginx</span>
<span class="line">  rules:</span>
<span class="line">  - host: policy-reporter.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">    http:</span>
<span class="line">      paths:</span>
<span class="line">      - backend:</span>
<span class="line">          service:</span>
<span class="line">            name: policy-reporter-ui</span>
<span class="line">            port:</span>
<span class="line">              number: <span class="token number">8080</span></span>
<span class="line">        path: /</span>
<span class="line">        pathType: Prefix</span>
<span class="line">  tls:</span>
<span class="line">  - hosts:</span>
<span class="line">    - policy-reporter.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/policy-reporter/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/policy-reporter&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- policy-reporter$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource policy-reporter <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="rancher" tabindex="-1"><a class="header-anchor" href="#rancher"><span>Rancher</span></a></h3><p><a href="https://rancher.com/" target="_blank" rel="noopener noreferrer">Rancher</a></p><ul><li><a href="https://github.com/rancher/rancher/tree/master/chart" target="_blank" rel="noopener noreferrer">rancher</a></li><li><a href="https://github.com/rancher/rancher/blob/master/chart/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/rancher</span>
<span class="line"></span>
<span class="line">flux create helmrelease rancher <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;cattle-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--timeout</span><span class="token operator">=</span><span class="token string">&quot;10m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/rancher-latest.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;rancher&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;2.6.3&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/rancher-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/rancher/rancher-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/rancher/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/base/rancher&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/rancher</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/rancher/rancher-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/rancher/rancher-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: rancher</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">    - name: kubed</span>
<span class="line">    - name: cert-manager-certificate</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/rancher/rancher-kustomization</span>
<span class="line">  prune: <span class="token boolean">true</span></span>
<span class="line">  sourceRef:</span>
<span class="line">    kind: GitRepository</span>
<span class="line">    name: flux-system</span>
<span class="line">    namespace: flux-system</span>
<span class="line">  wait: <span class="token boolean">true</span></span>
<span class="line">  postBuild:</span>
<span class="line">    substituteFrom:</span>
<span class="line">    - kind: Secret</span>
<span class="line">      name: cluster-apps-substitutefrom-secret</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/rancher/rancher-kustomization/rancher-namespace.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: v1</span>
<span class="line">kind: Namespace</span>
<span class="line">metadata:</span>
<span class="line">  name: cattle-system</span>
<span class="line">  labels:</span>
<span class="line">    cert-manager-cert-<span class="token variable">\${LETSENCRYPT_ENVIRONMENT}</span><span class="token builtin class-name">:</span> copy</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/rancher/rancher-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/rancher/rancher-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: cattle-system</span>
<span class="line">resources:</span>
<span class="line">  - rancher-namespace.yaml</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/rancher</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: rancher-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>rancher-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/rancher/rancher-kustomization/rancher-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">hostname: rancher.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">ingress:</span>
<span class="line">  extraAnnotations:</span>
<span class="line">    nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth</span>
<span class="line">    nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd<span class="token operator">=</span><span class="token variable">$scheme</span>://<span class="token variable">$host</span><span class="token variable">$request_uri</span></span>
<span class="line">  tls:</span>
<span class="line">    source: secret</span>
<span class="line">    secretName: ingress-cert-<span class="token variable">\${LETSENCRYPT_ENVIRONMENT}</span></span>
<span class="line">replicas: <span class="token number">1</span></span>
<span class="line">bootstrapPassword: <span class="token variable">\${MY_PASSWORD}</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/rancher/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/rancher&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- rancher$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource rancher <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="secrets-store-csi-driver" tabindex="-1"><a class="header-anchor" href="#secrets-store-csi-driver"><span>Secrets Store CSI driver</span></a></h3><p><a href="https://secrets-store-csi-driver.sigs.k8s.io/" target="_blank" rel="noopener noreferrer">secrets-store-csi-driver</a></p><ul><li><a href="https://github.com/kubernetes-sigs/secrets-store-csi-driver/tree/master/charts/secrets-store-csi-driver" target="_blank" rel="noopener noreferrer">secrets-store-csi-driver</a></li><li><a href="https://github.com/kubernetes-sigs/secrets-store-csi-driver/blob/master/charts/secrets-store-csi-driver/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/secrets-store-csi-driver</span>
<span class="line"></span>
<span class="line">kubectl create namespace secrets-store-csi-driver --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/secrets-store-csi-driver/secrets-store-csi-driver-namespace.yaml</span>
<span class="line"></span>
<span class="line">flux create helmrelease secrets-store-csi-driver <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;secrets-store-csi-driver&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/secrets-store-csi-driver.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;secrets-store-csi-driver&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;1.0.0&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--crds</span><span class="token operator">=</span><span class="token string">&quot;CreateReplace&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/secrets-store-csi-driver/secrets-store-csi-driver-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/secrets-store-csi-driver/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/base/secrets-store-csi-driver&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/crossplane</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-pv</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/secrets-store-csi-driver&quot;</span>/secrets-store-csi-driver-<span class="token punctuation">{</span>kustomization,kustomization-provider-aws<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">flux create kustomization secrets-store-csi-driver <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/secrets-store-csi-driver/secrets-store-csi-driver-kustomization&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/secrets-store-csi-driver/secrets-store-csi-driver-kustomization.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/secrets-store-csi-driver/secrets-store-csi-driver-kustomization/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span></span>
<span class="line">    <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/secrets-store-csi-driver/secrets-store-csi-driver-kustomization&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">      kustomize create <span class="token parameter variable">--resources</span> <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/secrets-store-csi-driver <span class="token operator">&amp;&amp;</span></span>
<span class="line">      <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span></span>
<span class="line">  <span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">flux create kustomization secrets-store-csi-driver-provider-aws <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --depends-on<span class="token operator">=</span><span class="token string">&quot;secrets-store-csi-driver&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/secrets-store-csi-driver/secrets-store-csi-driver-kustomization-provider-aws&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/secrets-store-csi-driver/secrets-store-csi-driver-kustomization-provider-aws.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/secrets-store-csi-driver/secrets-store-csi-driver-kustomization-provider-aws/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: secrets-store-csi-driver</span>
<span class="line">resources:</span>
<span class="line">  - https://raw.githubusercontent.com/aws/secrets-store-csi-driver-provider-aws/807d3cea12264c518e2a5007d6009cee159c2917/deployment/aws-provider-installer.yaml <span class="token comment"># DevSkim: ignore DS117838</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/secrets-store-csi-driver/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/secrets-store-csi-driver&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- secrets-store-csi-driver$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource secrets-store-csi-driver <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="velero" tabindex="-1"><a class="header-anchor" href="#velero"><span>Velero</span></a></h3><p><a href="https://velero.io/" target="_blank" rel="noopener noreferrer">Velero</a></p><ul><li><a href="https://artifacthub.io/packages/helm/vmware-tanzu/velero" target="_blank" rel="noopener noreferrer">velero</a></li><li><a href="https://github.com/vmware-tanzu/helm-charts/blob/main/charts/velero/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/velero</span>
<span class="line"></span>
<span class="line">flux create helmrelease velero <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;velero&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/vmware-tanzu.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;velero&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;2.27.1&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--crds</span><span class="token operator">=</span><span class="token string">&quot;CreateReplace&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/velero-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/velero/velero-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/velero/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/base/velero&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/velero</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/velero/velero-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/velero/velero-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: velero</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">    - name: kube-prometheus-stack</span>
<span class="line">    - name: external-snapshotter</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/velero/velero-kustomization</span>
<span class="line">  prune: <span class="token boolean">true</span></span>
<span class="line">  sourceRef:</span>
<span class="line">    kind: GitRepository</span>
<span class="line">    name: flux-system</span>
<span class="line">    namespace: flux-system</span>
<span class="line">  wait: <span class="token boolean">true</span></span>
<span class="line">  postBuild:</span>
<span class="line">    substituteFrom:</span>
<span class="line">    - kind: Secret</span>
<span class="line">      name: cluster-apps-substitutefrom-secret</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/velero/velero-kustomization/velero-volumesnapshotclass.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: snapshot.storage.k8s.io/v1</span>
<span class="line">kind: VolumeSnapshotClass</span>
<span class="line">metadata:</span>
<span class="line">  name: velero-csi-ebs-snapclass</span>
<span class="line">  labels:</span>
<span class="line">    velero.io/csi-volumesnapshot-class: <span class="token string">&quot;true&quot;</span></span>
<span class="line">driver: ebs.csi.aws.com</span>
<span class="line">deletionPolicy: Delete</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/velero/velero-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/velero/velero-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: velero</span>
<span class="line">resources:</span>
<span class="line">  - velero-volumesnapshotclass.yaml</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/velero</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: velero-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>velero-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/velero/velero-kustomization/velero-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">initContainers:</span>
<span class="line">  - name: velero-plugin-for-aws</span>
<span class="line">    image: velero/velero-plugin-for-aws:v1.3.0</span>
<span class="line">    volumeMounts:</span>
<span class="line">      - mountPath: /target</span>
<span class="line">        name: plugins</span>
<span class="line">  - name: velero-plugin-for-csi</span>
<span class="line">    image: velero/velero-plugin-for-csi:v0.2.0</span>
<span class="line">    volumeMounts:</span>
<span class="line">      - mountPath: /target</span>
<span class="line">        name: plugins</span>
<span class="line">metrics:</span>
<span class="line">  serviceMonitor:</span>
<span class="line">    enabled: <span class="token boolean">true</span></span>
<span class="line">configuration:</span>
<span class="line">  provider: aws</span>
<span class="line">  backupStorageLocation:</span>
<span class="line">    bucket: <span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">    prefix: velero</span>
<span class="line">    config:</span>
<span class="line">      region: <span class="token variable">\${AWS_DEFAULT_REGION}</span></span>
<span class="line">      <span class="token comment"># Not working...</span></span>
<span class="line">      <span class="token comment"># kmsKeyId:</span></span>
<span class="line">  volumeSnapshotLocation:</span>
<span class="line">    name: aws</span>
<span class="line">    config:</span>
<span class="line">      region: <span class="token variable">\${AWS_DEFAULT_REGION}</span></span>
<span class="line">  features: EnableCSI</span>
<span class="line">  defaultResticPruneFrequency: 71h</span>
<span class="line">serviceAccount:</span>
<span class="line">  server:</span>
<span class="line">    create: <span class="token boolean">false</span></span>
<span class="line">    name: velero</span>
<span class="line">credentials:</span>
<span class="line">  useSecret: <span class="token boolean">false</span></span>
<span class="line">schedules:</span>
<span class="line">  <span class="token comment"># https://doc.crds.dev/github.com/vmware-tanzu/velero/velero.io/Backup/v1@v1.5.1</span></span>
<span class="line">  my-backup-all:</span>
<span class="line">    disabled: <span class="token boolean">false</span></span>
<span class="line">    schedule: <span class="token string">&quot;0 */8 * * *&quot;</span></span>
<span class="line">    useOwnerReferencesInBackup: <span class="token boolean">true</span></span>
<span class="line">    template:</span>
<span class="line">      ttl: 48h</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/velero/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/velero&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- velero$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd<span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource velero <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="flux" tabindex="-1"><a class="header-anchor" href="#flux"><span>Flux</span></a></h2><p>Commit changes to git repository:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span></span>
<span class="line"><span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;[<span class="token variable">\${CLUSTER_NAME}</span>] Add applications&quot;</span> <span class="token operator">||</span> <span class="token boolean">true</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span><span class="token function">git</span> push <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span><span class="token file-descriptor important">&amp;1</span><span class="token variable">)</span></span>&quot;</span> <span class="token operator">=~</span> ^Everything<span class="token punctuation">\\</span> up-to-date <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  flux reconcile <span class="token builtin class-name">source</span> <span class="token function">git</span> flux-system</span>
<span class="line">  <span class="token function">sleep</span> <span class="token number">10</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Go back to the main directory:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Check Flux errors:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">kubectl <span class="token function">wait</span> <span class="token parameter variable">--timeout</span><span class="token operator">=</span>30m <span class="token parameter variable">--for</span><span class="token operator">=</span>condition<span class="token operator">=</span>ready kustomizations.kustomize.toolkit.fluxcd.io <span class="token parameter variable">-n</span> flux-system cluster-apps</span>
<span class="line">flux logs <span class="token parameter variable">--level</span><span class="token operator">=</span>error --all-namespaces</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>Check <code>helmreleases</code>, <code>helmrepositories</code>, <code>kustomizations</code>, ...</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">kubectl get pods <span class="token parameter variable">-A</span></span>
<span class="line">kubectl get helmreleases.helm.toolkit.fluxcd.io <span class="token parameter variable">-A</span></span>
<span class="line">kubectl get helmrepositories.source.toolkit.fluxcd.io <span class="token parameter variable">-A</span></span>
<span class="line">kubectl get kustomizations.kustomize.toolkit.fluxcd.io <span class="token parameter variable">-A</span></span>
<span class="line">helm <span class="token function">ls</span> <span class="token parameter variable">-A</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Export command for kubeconfig:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;export KUBECONFIG=<span class="token entity" title="\\&quot;">\\&quot;</span>\\<span class="token variable">\${<span class="token environment constant">PWD</span>}</span>/tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/kubeconfig-<span class="token variable">\${CLUSTER_NAME}</span>.conf<span class="token entity" title="\\&quot;">\\&quot;</span>&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div>`,148);function m(k,b){const n=r("router-link");return c(),p("div",null,[u,s("nav",d,[s("ul",null,[s("li",null,[a(n,{to:"#applications-definitions"},{default:e(()=>[l("Applications definitions")]),_:1}),s("ul",null,[s("li",null,[a(n,{to:"#amazon-efs-csi-driver"},{default:e(()=>[l("Amazon EFS CSI Driver")]),_:1})]),s("li",null,[a(n,{to:"#crossplane-aws"},{default:e(()=>[l("Crossplane AWS")]),_:1})]),s("li",null,[a(n,{to:"#istio"},{default:e(()=>[l("Istio")]),_:1})]),s("li",null,[a(n,{to:"#kuard"},{default:e(()=>[l("kuard")]),_:1})]),s("li",null,[a(n,{to:"#kubed"},{default:e(()=>[l("kubed")]),_:1})]),s("li",null,[a(n,{to:"#kubernetes-dashboard"},{default:e(()=>[l("kubernetes-dashboard")]),_:1})]),s("li",null,[a(n,{to:"#kyverno"},{default:e(()=>[l("Kyverno")]),_:1})]),s("li",null,[a(n,{to:"#oauth2-proxy-keycloak"},{default:e(()=>[l("OAuth2 Proxy - Keycloak")]),_:1})]),s("li",null,[a(n,{to:"#podinfo"},{default:e(()=>[l("podinfo")]),_:1})]),s("li",null,[a(n,{to:"#polaris"},{default:e(()=>[l("Polaris")]),_:1})]),s("li",null,[a(n,{to:"#policy-reporter"},{default:e(()=>[l("Policy Reporter")]),_:1})]),s("li",null,[a(n,{to:"#rancher"},{default:e(()=>[l("Rancher")]),_:1})]),s("li",null,[a(n,{to:"#secrets-store-csi-driver"},{default:e(()=>[l("Secrets Store CSI driver")]),_:1})]),s("li",null,[a(n,{to:"#velero"},{default:e(()=>[l("Velero")]),_:1})])])]),s("li",null,[a(n,{to:"#flux"},{default:e(()=>[l("Flux")]),_:1})])])]),v])}const f=i(o,[["render",m],["__file","index.html.vue"]]),h=JSON.parse('{"path":"/part-04/","title":"Applications","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"Applications definitions","slug":"applications-definitions","link":"#applications-definitions","children":[{"level":3,"title":"Amazon EFS CSI Driver","slug":"amazon-efs-csi-driver","link":"#amazon-efs-csi-driver","children":[]},{"level":3,"title":"Crossplane AWS","slug":"crossplane-aws","link":"#crossplane-aws","children":[]},{"level":3,"title":"Istio","slug":"istio","link":"#istio","children":[]},{"level":3,"title":"kuard","slug":"kuard","link":"#kuard","children":[]},{"level":3,"title":"kubed","slug":"kubed","link":"#kubed","children":[]},{"level":3,"title":"kubernetes-dashboard","slug":"kubernetes-dashboard","link":"#kubernetes-dashboard","children":[]},{"level":3,"title":"Kyverno","slug":"kyverno","link":"#kyverno","children":[]},{"level":3,"title":"OAuth2 Proxy - Keycloak","slug":"oauth2-proxy-keycloak","link":"#oauth2-proxy-keycloak","children":[]},{"level":3,"title":"podinfo","slug":"podinfo","link":"#podinfo","children":[]},{"level":3,"title":"Polaris","slug":"polaris","link":"#polaris","children":[]},{"level":3,"title":"Policy Reporter","slug":"policy-reporter","link":"#policy-reporter","children":[]},{"level":3,"title":"Rancher","slug":"rancher","link":"#rancher","children":[]},{"level":3,"title":"Secrets Store CSI driver","slug":"secrets-store-csi-driver","link":"#secrets-store-csi-driver","children":[]},{"level":3,"title":"Velero","slug":"velero","link":"#velero","children":[]}]},{"level":2,"title":"Flux","slug":"flux","link":"#flux","children":[]}],"git":{"updatedTime":1719720548000},"filePathRelative":"part-04/README.md"}');export{f as comp,h as data};
