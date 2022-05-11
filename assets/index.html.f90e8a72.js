import{_ as o,r as l,o as c,c as i,a as s,b as a,w as r,F as u,d as n,e as p}from"./app.36393f6e.js";const b={},m=s("h1",{id:"applications",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#applications","aria-hidden":"true"},"#"),n(" Applications")],-1),k={class:"table-of-contents"},d=n("Applications definitions"),g=n("Amazon EFS CSI Driver"),v=n("Crossplane AWS"),f=n("Istio"),h=n("kuard"),q=n("kubed"),y=n("kubernetes-dashboard"),N=n("Kyverno"),E=n("OAuth2 Proxy - Keycloak"),_=n("podinfo"),R=n("Polaris"),O=n("Policy Reporter"),$=n("Rancher"),x=n("Secrets Store CSI driver"),T=n("Velero"),z=n("Flux"),M=s("h2",{id:"applications-definitions",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#applications-definitions","aria-hidden":"true"},"#"),n(" Applications definitions")],-1),I=s("h3",{id:"amazon-efs-csi-driver",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#amazon-efs-csi-driver","aria-hidden":"true"},"#"),n(" Amazon EFS CSI Driver")],-1),V=n("Install "),F={href:"https://github.com/kubernetes-sigs/aws-efs-csi-driver",target:"_blank",rel:"noopener noreferrer"},S=n("Amazon EFS CSI Driver"),w=n(", which supports ReadWriteMany PVC. Details can be found here: "),C={href:"https://aws.amazon.com/blogs/containers/introducing-efs-csi-dynamic-provisioning/",target:"_blank",rel:"noopener noreferrer"},D=n("Introducing Amazon EFS CSI dynamic provisioning"),L={href:"https://github.com/kubernetes-sigs/aws-efs-csi-driver",target:"_blank",rel:"noopener noreferrer"},U=n("Amazon EFS CSI Driver"),Q={href:"https://github.com/kubernetes-sigs/aws-efs-csi-driver/tree/master/charts/aws-efs-csi-driver",target:"_blank",rel:"noopener noreferrer"},j=n("aws-efs-csi-driver"),A={href:"https://github.com/kubernetes-sigs/aws-efs-csi-driver/blob/master/charts/aws-efs-csi-driver/values.yaml",target:"_blank",rel:"noopener noreferrer"},K=n("default values.yaml"),G=p(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/aws-efs-csi-driver

flux create helmrelease aws-efs-csi-driver <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;aws-efs-csi-driver&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/aws-efs-csi-driver.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;aws-efs-csi-driver&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;2.2.2&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/aws-efs-csi-driver-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/aws-efs-csi-driver/aws-efs-csi-driver-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/aws-efs-csi-driver/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/aws-efs-csi-driver&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/aws-efs-csi-driver</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-efs-csi-driver/aws-efs-csi-driver-kustomization&quot;</span>

flux create kustomization aws-efs-csi-driver <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --path<span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/aws-efs-csi-driver/aws-efs-csi-driver-kustomization&quot;</span> <span class="token punctuation">\\</span>
  --prune<span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --wait <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-efs-csi-driver/aws-efs-csi-driver-kustomization.yaml&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-efs-csi-driver/aws-efs-csi-driver-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-efs-csi-driver/aws-efs-csi-driver-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: aws-efs-csi-driver
resources:
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/aws-efs-csi-driver
configMapGenerator:
  - name: aws-efs-csi-driver-values
    files:
      - values.yaml<span class="token operator">=</span>aws-efs-csi-driver-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-efs-csi-driver/aws-efs-csi-driver-kustomization/aws-efs-csi-driver-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
controller:
  serviceAccount:
    create: <span class="token boolean">false</span>
    name: efs-csi-controller-sa
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-efs-csi-driver/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-efs-csi-driver&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- aws-efs-csi-driver$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource aws-efs-csi-driver <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br></div></div><p>Change the tags on the Cluster level, because they will be different on every cluster and it needs to be &quot;set&quot; form TAGS bash variable:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;name: aws-efs-csi-driver$&#39;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token function">cat</span> <span class="token operator">&gt;&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
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
                  Name: \\<span class="token variable">\${CLUSTER_NAME}</span>
                  Cluster: \\<span class="token variable">\${CLUSTER_FQDN}</span>
                  <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">\${TAGS}</span>&quot;</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">&quot;s/ /<span class="token entity" title="\\\\">\\\\</span>n                  /g; s/=/: /g&quot;</span><span class="token variable">)</span></span>
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br></div></div><h3 id="crossplane-aws" tabindex="-1"><a class="header-anchor" href="#crossplane-aws" aria-hidden="true">#</a> Crossplane AWS</h3><h4 id="get-kms-key" tabindex="-1"><a class="header-anchor" href="#get-kms-key" aria-hidden="true">#</a> Get KMS key</h4><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-kms-key-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-kms-key-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: cp-aws-kms-key-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key
  namespace: flux-system
spec:
  dependsOn:
    - name: crossplane-providerconfig
  interval: 5m
  path: <span class="token string">&quot;./clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-kms-key-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key&quot;</span>
  prune: <span class="token boolean">true</span>
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: <span class="token boolean">true</span>
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-kms-key-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key/cp-aws-kms-key-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kms.aws.crossplane.io/v1alpha1
kind: Key
metadata:
  name: cp-aws-kms-key-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key
  annotations:
    crossplane.io/external-name: <span class="token variable">\${AWS_KMS_KEY_ARN}</span>
spec:
  forProvider:
    region: <span class="token variable">\${AWS_DEFAULT_REGION}</span>
  providerConfigRef:
    name: aws-provider
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- crossplane-aws$&#39;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
  <span class="token punctuation">(</span>
    <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    kustomize edit <span class="token function">add</span> resource crossplane-aws <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
  <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br></div></div><h4 id="crate-secret-in-amazon-secret-manager" tabindex="-1"><a class="header-anchor" href="#crate-secret-in-amazon-secret-manager" aria-hidden="true">#</a> Crate secret in Amazon Secret Manager</h4><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-asm-secret-key&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-asm-secret-key.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: cp-aws-asm-secret-key
  namespace: flux-system
spec:
  decryption:
    provider: sops
  dependsOn:
    - name: cp-aws-kms-key-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key
  interval: 5m
  path: <span class="token string">&quot;./clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-asm-secret-key&quot;</span>
  prune: <span class="token boolean">true</span>
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: <span class="token boolean">true</span>
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

<span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-asm-secret-key/cp-aws-asm-secret-key.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token punctuation">;</span> <span class="token keyword">then</span>
  kubectl create secret generic cp-aws-asm-secret-key -n crossplane-system --dry-run<span class="token operator">=</span>client -o yaml <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span>username<span class="token operator">=</span>myuser --from-literal<span class="token operator">=</span>password<span class="token operator">=</span>mytest12345 <span class="token punctuation">\\</span>
    <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-asm-secret-key/cp-aws-asm-secret-key.yaml&quot;</span>
  sops --encrypt --in-place <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-asm-secret-key/cp-aws-asm-secret-key.yaml&quot;</span>
<span class="token keyword">fi</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;name: cp-aws-asm-secret-key$&#39;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token function">cat</span> <span class="token operator">&gt;&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
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
                  value: \\<span class="token variable">\${CLUSTER_FQDN}</span>
                <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">\${TAGS}</span>&quot;</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">&quot;s/ /<span class="token entity" title="\\\\">\\\\</span>n                - key: /g; s/^/- key: /g; s/=/<span class="token entity" title="\\n">\\n</span>                  value: /g&quot;</span><span class="token variable">)</span></span>
EOF</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/cp-aws-asm-secret-key/asm-secretsmanager-secret-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: secretsmanager.aws.crossplane.io/v1alpha1
kind: Secret
metadata:
  name: cp-aws-asm-secret-key
spec:
  providerConfigRef:
    name: aws-provider
  forProvider:
    region: <span class="token variable">\${AWS_DEFAULT_REGION}</span>
    description: <span class="token string">&quot;Secret for <span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span>
    kmsKeyIDRef:
      name: cp-aws-kms-key-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key
    forceDeleteWithoutRecovery: <span class="token boolean">true</span>
    stringSecretRef:
      name: cp-aws-asm-secret-key
      namespace: crossplane-system
EOF

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&quot;\\- cp-aws-asm-secret-key.yaml$&quot;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
  <span class="token punctuation">(</span>
    <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/crossplane-aws&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    kustomize edit <span class="token function">add</span> resource cp-aws-asm-secret-key.yaml <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
  <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br></div></div><h3 id="istio" tabindex="-1"><a class="header-anchor" href="#istio" aria-hidden="true">#</a> Istio</h3>`,12),P={href:"https://istio.io/",target:"_blank",rel:"noopener noreferrer"},H=n("Istio"),B=s("h4",{id:"jaeger",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#jaeger","aria-hidden":"true"},"#"),n(" Jaeger")],-1),W={href:"https://www.jaegertracing.io/",target:"_blank",rel:"noopener noreferrer"},Y=n("Jaeger"),J={href:"https://artifacthub.io/packages/helm/jaegertracing/jaeger-operator",target:"_blank",rel:"noopener noreferrer"},X=n("jaeger-operator"),Z={href:"https://github.com/jaegertracing/helm-charts/blob/main/charts/jaeger-operator/values.yaml",target:"_blank",rel:"noopener noreferrer"},ss=n("default values.yaml"),ns=p(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/jaeger-operator

kubectl create namespace jaeger-operator --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> infrastructure/base/jaeger-operator/jaeger-operator-namespace.yaml

flux create helmrelease jaeger-operator <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;jaeger-operator&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/jaegertracing.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;jaeger-operator&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;2.27.1&quot;</span> <span class="token punctuation">\\</span>
  --crds<span class="token operator">=</span><span class="token string">&quot;CreateReplace&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/jaeger-operator-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/jaeger-operator/jaeger-operator-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/jaeger-operator/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/jaeger-operator&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/jaeger-operator</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-operator/jaeger-operator-kustomization&quot;</span>

flux create kustomization jaeger-operator <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --path<span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/jaeger-operator/jaeger-operator-kustomization&quot;</span> <span class="token punctuation">\\</span>
  --prune<span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --wait <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-operator/jaeger-operator-kustomization.yaml&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-operator/jaeger-operator-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-operator/jaeger-operator-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: jaeger-operator
resources:
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/jaeger-operator
configMapGenerator:
  - name: jaeger-operator-values
    files:
      - values.yaml<span class="token operator">=</span>jaeger-operator-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-operator/jaeger-operator-kustomization/jaeger-operator-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
rbac:
  clusterRole: <span class="token boolean">true</span>
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-operator/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-operator&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- jaeger-operator$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource jaeger-operator <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br></div></div><h4 id="deploy-jaeger-using-operator" tabindex="-1"><a class="header-anchor" href="#deploy-jaeger-using-operator" aria-hidden="true">#</a> Deploy Jaeger using operator</h4>`,5),as={href:"https://www.jaegertracing.io/",target:"_blank",rel:"noopener noreferrer"},es=n("Jaeger"),ps={href:"https://www.jaegertracing.io/docs/latest/operator/",target:"_blank",rel:"noopener noreferrer"},ts=n("Jaeger Operator"),rs=p(`<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-controlplane/jaeger-controlplane-kustomization&quot;</span>

kubectl create namespace jaeger-system --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-controlplane/jaeger-controlplane-kustomization/jaeger-controlplane-namespace.yaml&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-controlplane/jaeger-controlplane-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: jaeger-controlplane
  namespace: flux-system
spec:
  dependsOn:
  - name: jaeger-operator
  interval: 5m
  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-controlplane/jaeger-controlplane-kustomization
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
EOF</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-controlplane/jaeger-controlplane-kustomization/jaeger-controlplane-jaeger.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
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
        max-traces: <span class="token number">100000</span>
  ingress:
    enabled: <span class="token boolean">true</span>
    ingressClassName: nginx
    annotations:
      nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth
      nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd<span class="token operator">=</span><span class="token punctuation">\\</span><span class="token variable">$scheme</span>://<span class="token punctuation">\\</span><span class="token variable">$host</span><span class="token punctuation">\\</span><span class="token variable">$request_uri</span>
    hosts:
      - jaeger.<span class="token variable">\${CLUSTER_FQDN}</span>
    tls:
      - hosts:
        - jaeger.<span class="token variable">\${CLUSTER_FQDN}</span>
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-controlplane/jaeger-controlplane-kustomization/jaeger-controlplane-rolebinding.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
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
EOF</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-controlplane/jaeger-controlplane-kustomization/jaeger-controlplane-podmonitor.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
apiVersion: monitoring.coreos.com/v1
kind: PodMonitor
metadata:
  name: tracing
  namespace: jaeger-system
spec:
  podMetricsEndpoints:
  - interval: 5s
    port: &quot;admin-http&quot;
  selector:
    matchLabels:
      app: jaeger
EOF</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-controlplane/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/jaeger-controlplane&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- jaeger-controlplane$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource jaeger-controlplane <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br></div></div><h4 id="istio-operator" tabindex="-1"><a class="header-anchor" href="#istio-operator" aria-hidden="true">#</a> istio-operator</h4>`,2),ls={href:"https://istio.io/latest/docs/setup/install/operator/",target:"_blank",rel:"noopener noreferrer"},os=n("Istio Operator"),cs={href:"https://github.com/istio/istio/tree/master/manifests/charts/istio-operator",target:"_blank",rel:"noopener noreferrer"},is=n("istio-operator"),us={href:"https://github.com/istio/istio/blob/master/manifests/charts/istio-operator/values.yaml",target:"_blank",rel:"noopener noreferrer"},bs=n("default values.yaml"),ms=p(`<p>Set Istio version:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token builtin class-name">export</span> <span class="token assign-left variable">ISTIO_VERSION</span><span class="token operator">=</span><span class="token string">&quot;1.12.0&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>Add HelmRepository file to <code>infrastructure/sources</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">&gt;</span> infrastructure/sources/istio-operator-git.yaml <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: GitRepository
metadata:
  name: istio-operator
  namespace: flux-system
spec:
  interval: 1h
  timeout: 5m
  ref:
    tag: <span class="token variable">\${ISTIO_VERSION}</span>
  url: https://github.com/istio/istio
EOF</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> -f infrastructure/sources/kustomization.yaml <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token function">rm</span> infrastructure/sources/kustomization.yaml
<span class="token builtin class-name">cd</span> infrastructure/sources <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/istio-operator

kubectl create namespace istio-operator --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> infrastructure/base/istio-operator/istio-operator-namespace.yaml

flux create helmrelease istio-operator <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;istio-operator&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;GitRepository/istio-operator.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;manifests/charts/istio-operator&quot;</span> <span class="token punctuation">\\</span>
  --crds<span class="token operator">=</span><span class="token string">&quot;CreateReplace&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/istio-operator-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/istio-operator/istio-operator-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/istio-operator/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/istio-operator&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/istio-operator</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-operator/istio-operator-kustomization&quot;</span>

flux create kustomization istio-operator <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --path<span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/istio-operator/istio-operator-kustomization&quot;</span> <span class="token punctuation">\\</span>
  --prune<span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --wait <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-operator/istio-operator-kustomization.yaml&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-operator/istio-operator-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-operator/istio-operator-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: istio-operator
resources:
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/istio-operator
configMapGenerator:
  - name: istio-operator-values
    files:
      - values.yaml<span class="token operator">=</span>istio-operator-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-operator/istio-operator-kustomization/istio-operator-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
hub: docker.io/istio
tag: <span class="token variable">\${ISTIO_VERSION}</span>
EOF</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-operator/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-operator&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- istio-operator$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource istio-operator <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br></div></div><h4 id="deploy-istio-using-operator" tabindex="-1"><a class="header-anchor" href="#deploy-istio-using-operator" aria-hidden="true">#</a> Deploy Istio using operator</h4>`,9),ks={href:"https://istio.io",target:"_blank",rel:"noopener noreferrer"},ds=n("Istio"),gs={href:"https://istio.io/latest/docs/reference/config/istio.operator.v1alpha1/",target:"_blank",rel:"noopener noreferrer"},vs=n("Istio CRD"),fs=p(`<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-controlplane/istio-controlplane-kustomization&quot;</span>

kubectl create namespace istio-system --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-controlplane/istio-controlplane-kustomization/istio-controlplane-namespace.yaml&quot;</span>

<span class="token function">curl</span> -s <span class="token string">&quot;https://raw.githubusercontent.com/istio/istio/<span class="token variable">\${ISTIO_VERSION}</span>/samples/addons/extras/prometheus-operator.yaml&quot;</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-controlplane/istio-controlplane-kustomization/istio-controlplane-prometheus.yaml&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-controlplane/istio-controlplane-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
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
  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-controlplane/istio-controlplane-kustomization
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
EOF</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-controlplane/istio-controlplane-kustomization/istio-controlplane-istiooperator.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  namespace: istio-system
  name: istio-controlplane
spec:
  profile: default
  meshConfig:
    enableTracing: <span class="token boolean">true</span>
    enableAutoMtls: <span class="token boolean">true</span>
    defaultConfig:
      tracing:
        zipkin:
          address: <span class="token string">&quot;jaeger-controlplane-collector-headless.jaeger-system.svc.cluster.local:9411&quot;</span>
        sampling: <span class="token number">100</span>
      sds:
        enabled: <span class="token boolean">true</span>
  components:
    egressGateways:
      - name: istio-egressgateway
        enabled: <span class="token boolean">true</span>
    ingressGateways:
      - name: istio-ingressgateway
        enabled: <span class="token boolean">true</span>
        k8s:
          serviceAnnotations:
            service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp
            service.beta.kubernetes.io/aws-load-balancer-type: nlb
            service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: <span class="token string">&quot;<span class="token variable">\${TAGS_INLINE}</span>&quot;</span>
    pilot:
      k8s:
        <span class="token comment"># Reduce resource requirements for local testing. This is NOT recommended for the real use cases</span>
        resources:
          limits:
            cpu: 200m
            memory: 128Mi
          requests:
            cpu: 100m
            memory: 64Mi
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-controlplane/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/istio-controlplane&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- istio-controlplane$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource istio-controlplane <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br></div></div><h4 id="keycloak" tabindex="-1"><a class="header-anchor" href="#keycloak" aria-hidden="true">#</a> Keycloak</h4><blockquote><p>I was not able to make Keycloak working with local Dex, because Dex is not using valid certificates (Let&#39;s Encrypt staging).</p></blockquote>`,3),hs={href:"https://www.keycloak.org/",target:"_blank",rel:"noopener noreferrer"},qs=n("Keycloak"),ys={href:"https://artifacthub.io/packages/helm/bitnami/keycloak",target:"_blank",rel:"noopener noreferrer"},Ns=n("Keycloak"),Es={href:"https://github.com/bitnami/charts/blob/master/bitnami/keycloak/values.yaml",target:"_blank",rel:"noopener noreferrer"},_s=n("default values.yaml"),Rs=p(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/keycloak

kubectl create namespace keycloak --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/base/keycloak/keycloak-namespace.yaml&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> infrastructure/base/keycloak/keycloak-helmrelease.yaml <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
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
EOF</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/keycloak/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/keycloak&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/keycloak</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/keycloak/keycloak-kustomization&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/keycloak/keycloak-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: keycloak
  namespace: flux-system
spec:
  dependsOn:
    - name: kube-prometheus-stack
  interval: 5m
  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/keycloak/keycloak-kustomization
  prune: <span class="token boolean">true</span>
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: <span class="token boolean">true</span>
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/keycloak/keycloak-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/keycloak/keycloak-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: keycloak
resources:
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/keycloak
configMapGenerator:
  - name: keycloak-values
    files:
      - values.yaml<span class="token operator">=</span>keycloak-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/keycloak/keycloak-kustomization/keycloak-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
global:
  storageClass: <span class="token string">&quot;gp3&quot;</span>
clusterDomain: <span class="token variable">\${CLUSTER_FQDN}</span>
auth:
  adminUser: admin
  adminPassword: <span class="token variable">\${MY_PASSWORD}</span>
  managementUser: manager
  managementPassword: <span class="token variable">\${MY_PASSWORD}</span>
proxyAddressForwarding: <span class="token boolean">true</span>
<span class="token comment"># https://stackoverflow.com/questions/51616770/keycloak-restricting-user-management-to-certain-groups-while-enabling-manage-us</span>
extraStartupArgs: <span class="token string">&quot;-Dkeycloak.profile.feature.admin_fine_grained_authz=enabled&quot;</span>
keycloakConfigCli:
  enabled: <span class="token boolean">true</span>
  configuration:
    myrealm.yaml: <span class="token operator">|</span>
      realm: myrealm
      enabled: <span class="token boolean">true</span>
      displayName: My Realm
      rememberMe: <span class="token boolean">true</span>
      userManagedAccessAllowed: <span class="token boolean">true</span>
      smtpServer:
        from: myrealm-keycloak@<span class="token variable">\${CLUSTER_FQDN}</span>
        fromDisplayName: Keycloak
        host: mailhog.mailhog.svc.cluster.local
        port: <span class="token number">1025</span>
      clients:
      <span class="token comment"># https://oauth2-proxy.github.io/oauth2-proxy/docs/configuration/oauth_provider/#keycloak-auth-provider</span>
      - clientId: oauth2-proxy-keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>
        name: oauth2-proxy-keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>
        description: <span class="token string">&quot;OAuth2 Proxy for Keycloak&quot;</span>
        secret: <span class="token variable">\${MY_PASSWORD}</span>
        redirectUris:
        - <span class="token string">&quot;https://oauth2-proxy-keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/callback&quot;</span>
        protocolMappers:
        - name: groupMapper
          protocol: openid-connect
          protocolMapper: oidc-group-membership-mapper
          config:
            userinfo.token.claim: <span class="token string">&quot;true&quot;</span>
            id.token.claim: <span class="token string">&quot;true&quot;</span>
            access.token.claim: <span class="token string">&quot;true&quot;</span>
            claim.name: <span class="token function">groups</span>
            full.path: <span class="token string">&quot;true&quot;</span>
      identityProviders:
      <span class="token comment"># https://ultimatesecurity.pro/post/okta-oidc/</span>
      - alias: keycloak-oidc-okta
        displayName: <span class="token string">&quot;Okta&quot;</span>
        providerId: keycloak-oidc
        trustEmail: <span class="token boolean">true</span>
        config:
          clientId: <span class="token variable">\${OKTA_CLIENT_ID}</span>
          clientSecret: <span class="token variable">\${OKTA_CLIENT_SECRET}</span>
          tokenUrl: <span class="token string">&quot;<span class="token variable">\${OKTA_ISSUER}</span>/oauth2/default/v1/token&quot;</span>
          authorizationUrl: <span class="token string">&quot;<span class="token variable">\${OKTA_ISSUER}</span>/oauth2/default/v1/authorize&quot;</span>
          defaultScope: <span class="token string">&quot;openid profile email&quot;</span>
          syncMode: IMPORT
      users:
      - username: myuser1
        email: myuser1@<span class="token variable">\${CLUSTER_FQDN}</span>
        enabled: <span class="token boolean">true</span>
        firstName: My Firstname <span class="token number">1</span>
        lastName: My Lastname <span class="token number">1</span>
        groups:
          - group-admins
        credentials:
        - type: password
          value: <span class="token variable">\${MY_PASSWORD}</span>
      - username: myuser2
        email: myuser2@<span class="token variable">\${CLUSTER_FQDN}</span>
        enabled: <span class="token boolean">true</span>
        firstName: My Firstname <span class="token number">2</span>
        lastName: My Lastname <span class="token number">2</span>
        groups:
          - group-admins
        credentials:
        - type: password
          value: <span class="token variable">\${MY_PASSWORD}</span>
      - username: myuser3
        email: myuser3@<span class="token variable">\${CLUSTER_FQDN}</span>
        enabled: <span class="token boolean">true</span>
        firstName: My Firstname <span class="token number">3</span>
        lastName: My Lastname <span class="token number">3</span>
        groups:
          - group-users
        credentials:
        - type: password
          value: <span class="token variable">\${MY_PASSWORD}</span>
      - username: myuser4
        email: myuser4@<span class="token variable">\${CLUSTER_FQDN}</span>
        enabled: <span class="token boolean">true</span>
        firstName: My Firstname <span class="token number">4</span>
        lastName: My Lastname <span class="token number">4</span>
        groups:
          - group-users
          - group-test
        credentials:
        - type: password
          value: <span class="token variable">\${MY_PASSWORD}</span>
      groups:
      - name: group-users
      - name: group-admins
      - name: group-test
service:
  type: ClusterIP
ingress:
  enabled: <span class="token boolean">true</span>
  hostname: keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>
  ingressClassName: nginx
  extraTls:
  - hosts:
    - keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>
metrics:
  enabled: <span class="token boolean">true</span>
  serviceMonitor:
    enabled: <span class="token boolean">true</span>
postgresql:
  postgresqlPassword: <span class="token variable">\${MY_PASSWORD}</span>
  persistence:
    enabled: <span class="token boolean">true</span>
    size: 1Gi
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/keycloak/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/keycloak&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- keycloak$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource keycloak <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br><span class="line-number">126</span><br><span class="line-number">127</span><br><span class="line-number">128</span><br><span class="line-number">129</span><br><span class="line-number">130</span><br><span class="line-number">131</span><br><span class="line-number">132</span><br><span class="line-number">133</span><br><span class="line-number">134</span><br><span class="line-number">135</span><br><span class="line-number">136</span><br><span class="line-number">137</span><br><span class="line-number">138</span><br><span class="line-number">139</span><br><span class="line-number">140</span><br><span class="line-number">141</span><br><span class="line-number">142</span><br><span class="line-number">143</span><br><span class="line-number">144</span><br><span class="line-number">145</span><br><span class="line-number">146</span><br><span class="line-number">147</span><br><span class="line-number">148</span><br><span class="line-number">149</span><br><span class="line-number">150</span><br><span class="line-number">151</span><br><span class="line-number">152</span><br><span class="line-number">153</span><br><span class="line-number">154</span><br><span class="line-number">155</span><br><span class="line-number">156</span><br><span class="line-number">157</span><br><span class="line-number">158</span><br><span class="line-number">159</span><br><span class="line-number">160</span><br><span class="line-number">161</span><br><span class="line-number">162</span><br><span class="line-number">163</span><br><span class="line-number">164</span><br><span class="line-number">165</span><br><span class="line-number">166</span><br><span class="line-number">167</span><br><span class="line-number">168</span><br><span class="line-number">169</span><br><span class="line-number">170</span><br><span class="line-number">171</span><br><span class="line-number">172</span><br><span class="line-number">173</span><br><span class="line-number">174</span><br><span class="line-number">175</span><br><span class="line-number">176</span><br></div></div><h4 id="kiali" tabindex="-1"><a class="header-anchor" href="#kiali" aria-hidden="true">#</a> Kiali</h4>`,5),Os={href:"https://github.com/kiali/kiali-operator",target:"_blank",rel:"noopener noreferrer"},$s=n("Kiali Operator"),xs={href:"https://github.com/kiali/helm-charts/tree/master/kiali-operator",target:"_blank",rel:"noopener noreferrer"},Ts=n("kiali-operator"),zs={href:"https://github.com/kiali/helm-charts/blob/master/kiali-operator/values.yaml",target:"_blank",rel:"noopener noreferrer"},Ms=n("default values.yaml"),Is=p(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/kiali-operator

kubectl create namespace kiali-operator --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/base/kiali-operator/kiali-operator-namespace.yaml&quot;</span>

flux create helmrelease kiali-operator <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;kiali-operator&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/kiali.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;kiali-operator&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;1.44.0&quot;</span> <span class="token punctuation">\\</span>
  --crds<span class="token operator">=</span><span class="token string">&quot;CreateReplace&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/kiali-operator/kiali-operator-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/kiali-operator/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/kiali-operator&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/kiali-operator</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-operator/kiali-operator-kustomization&quot;</span>

flux create kustomization kiali-operator <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --path<span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/kiali-operator/kiali-operator-kustomization&quot;</span> <span class="token punctuation">\\</span>
  --prune<span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --wait <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-operator/kiali-operator-kustomization.yaml&quot;</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-operator/kiali-operator-kustomization/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
  <span class="token punctuation">(</span>
    <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-operator/kiali-operator-kustomization&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    kustomize create --resources <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/kiali-operator <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
  <span class="token punctuation">)</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-operator/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-operator&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- kiali-operator$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource kiali-operator <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><h4 id="deploy-kiali-using-operator" tabindex="-1"><a class="header-anchor" href="#deploy-kiali-using-operator" aria-hidden="true">#</a> Deploy Kiali using operator</h4>`,5),Vs={href:"https://kiali.io/",target:"_blank",rel:"noopener noreferrer"},Fs=n("Kiali"),Ss={href:"https://github.com/kiali/kiali-operator/blob/master/deploy/kiali/kiali_cr.yaml",target:"_blank",rel:"noopener noreferrer"},ws=n("Kiali CRD"),Cs=p(`<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-controlplane/kiali-controlplane-kustomization&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-controlplane/kiali-controlplane-kustomization/kiali-controlplane-secret.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: v1
kind: Secret
metadata:
  name: kiali
  namespace: istio-system
data:
  oidc-secret: <span class="token variable">\${MY_PASSWORD_BASE64}</span>
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-controlplane/kiali-controlplane-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: kiali-controlplane
  namespace: flux-system
spec:
  dependsOn:
  - name: istio-controlplane
  interval: 5m
  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-controlplane/kiali-controlplane-kustomization
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
EOF</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-controlplane/kiali-controlplane-kustomization/kiali-controlplane-kiali.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
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
      client_id: kiali.<span class="token variable">\${CLUSTER_FQDN}</span>
      disable_rbac: <span class="token boolean">true</span>
      insecure_skip_verify_tls: <span class="token boolean">true</span>
      issuer_uri: <span class="token string">&quot;https://dex.<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span>
      username_claim: email
  deployment:
    namespace: istio-system
    ingress:
      enabled: <span class="token boolean">true</span>
      override_yaml:
        spec:
          ingressClassName: nginx
          rules:
          - host: kiali.<span class="token variable">\${CLUSTER_FQDN}</span>
            http:
              paths:
              - path: /
                pathType: ImplementationSpecific
                backend:
                  service:
                    name: kiali
                    port:
                      number: <span class="token number">20001</span>
            tls:
            - hosts:
              - kiali.<span class="token variable">\${CLUSTER_FQDN}</span>
  external_services:
    grafana:
      is_core_component: <span class="token boolean">true</span>
      url: <span class="token string">&quot;https://grafana.<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span>
      in_cluster_url: <span class="token string">&quot;http://kube-prometheus-stack-grafana.kube-prometheus-stack.svc.cluster.local:80&quot;</span>
    prometheus:
      is_core_component: <span class="token boolean">true</span>
      url: http://kube-prometheus-stack-prometheus.kube-prometheus-stack.svc.cluster.local:9090
    tracing:
      is_core_component: <span class="token boolean">true</span>
      url: https://jaeger.<span class="token variable">\${CLUSTER_FQDN}</span>
      in_cluster_url: http://jaeger-controlplane-query.jaeger-system.svc.cluster.local:16686
  server:
    web_fqdn: kiali.<span class="token variable">\${CLUSTER_FQDN}</span>
    web_root: /
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-controlplane/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kiali-controlplane&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- kiali-controlplane$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource kiali-controlplane <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br></div></div><h3 id="kuard" tabindex="-1"><a class="header-anchor" href="#kuard" aria-hidden="true">#</a> kuard</h3><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kuard-secretproviderclass&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kuard-secretproviderclass.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: kuard-secretproviderclass
  namespace: flux-system
spec:
  dependsOn:
    - name: secrets-store-csi-driver-provider-aws
    - name: cp-aws-kms-key-eks-<span class="token variable">\${CLUSTER_NAME}</span>-key
  interval: 5m
  path: <span class="token string">&quot;./clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kuard-secretproviderclass&quot;</span>
  prune: <span class="token boolean">true</span>
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: <span class="token boolean">true</span>
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kuard-secretproviderclass/kuard-secretproviderclass.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: secrets-store.csi.x-k8s.io/v1alpha1
kind: SecretProviderClass
metadata:
  name: kuard-asm-eks-<span class="token variable">\${CLUSTER_NAME}</span>-secrets
  namespace: kuard
spec:
  provider: aws
  parameters:
    objects: <span class="token operator">|</span>
      - objectName: <span class="token string">&quot;cp-aws-asm-secret-key&quot;</span>
        objectType: <span class="token string">&quot;secretsmanager&quot;</span>
  secretObjects:
  - secretName: <span class="token string">&quot;cp-aws-asm-secret-key&quot;</span>
    type: Opaque
    data:
    - objectName: <span class="token string">&quot;cp-aws-asm-secret-key&quot;</span>
      key: username
    - objectName: <span class="token string">&quot;cp-aws-asm-secret-key&quot;</span>
      key: password
EOF
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br></div></div><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kuard-manifests&quot;</span>
<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kuard-manifests.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: kuard-manifests
  namespace: flux-system
spec:
  dependsOn:
    - name: kuard-secretproviderclass
  interval: 5m
  path: <span class="token string">&quot;./clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kuard-manifests&quot;</span>
  prune: <span class="token boolean">true</span>
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: <span class="token boolean">true</span>
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

kubectl create <span class="token function">service</span> clusterip kuard --namespace kuard --tcp<span class="token operator">=</span><span class="token number">8080</span>:8080 --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kuard-manifests/kuard-service.yaml&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kuard-manifests/kuard-deployment.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kuard-deployment
  namespace: kuard
  labels:
    app: kuard
spec:
  replicas: <span class="token number">1</span>
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
          - topologyKey: <span class="token string">&quot;kubernetes.io/hostname&quot;</span>
            labelSelector:
              matchLabels:
                app: kuard
      volumes:
      - name: secrets-store-inline
        csi:
          driver: secrets-store.csi.k8s.io
          readOnly: <span class="token boolean">true</span>
          volumeAttributes:
            secretProviderClass: kuard-asm-eks-<span class="token variable">\${CLUSTER_NAME}</span>-secrets
      containers:
      - name: kuard-deployment
        image: gcr.io/kuar-demo/kuard-amd64:v0.10.0-green
        resources:
          requests:
            cpu: 100m
            memory: <span class="token string">&quot;64Mi&quot;</span>
          limits:
            cpu: 100m
            memory: <span class="token string">&quot;64Mi&quot;</span>
        ports:
        - containerPort: <span class="token number">8080</span>
        volumeMounts:
        - name: secrets-store-inline
          mountPath: <span class="token string">&quot;/mnt/secrets-store&quot;</span>
          readOnly: <span class="token boolean">true</span>
EOF

kubectl create ingress <span class="token punctuation">\\</span>
  --annotation<span class="token operator">=</span><span class="token string">&quot;nginx.ingress.kubernetes.io/auth-signin=https://oauth2-proxy.\\<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd=\\<span class="token variable">$scheme</span>://\\<span class="token variable">$host</span>\\<span class="token variable">$request_uri</span>&quot;</span> <span class="token punctuation">\\</span>
  --annotation<span class="token operator">=</span><span class="token string">&quot;nginx.ingress.kubernetes.io/auth-url=https://oauth2-proxy.\\<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth&quot;</span> <span class="token punctuation">\\</span>
  --namespace kuard kuard <span class="token punctuation">\\</span>
  --class<span class="token operator">=</span>nginx --rule<span class="token operator">=</span><span class="token string">&quot;kuard.<span class="token variable">\${CLUSTER_FQDN}</span>/*=kuard:8080,tls&quot;</span> <span class="token punctuation">\\</span>
  -o yaml --dry-run<span class="token operator">=</span>client <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kuard-manifests/kuard-ingress.yaml&quot;</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kuard&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&quot;\\- kuard$&quot;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
  <span class="token punctuation">(</span>
    <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    kustomize edit <span class="token function">add</span> resource kuard <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
  <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br></div></div><h3 id="kubed" tabindex="-1"><a class="header-anchor" href="#kubed" aria-hidden="true">#</a> kubed</h3>`,5),Ds={href:"https://appscode.com/products/kubed/",target:"_blank",rel:"noopener noreferrer"},Ls=n("kubed"),Us={href:"https://artifacthub.io/packages/helm/appscode/kubed",target:"_blank",rel:"noopener noreferrer"},Qs=n("kubed"),js={href:"https://github.com/appscode/kubed/blob/master/charts/kubed/values.yaml",target:"_blank",rel:"noopener noreferrer"},As=n("default values.yaml"),Ks=p(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/kubed

kubectl create namespace kubed --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> infrastructure/base/kubed/kubed-namespace.yaml

flux create helmrelease kubed <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;kubed&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/appscode.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;kubed&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;v0.12.0&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/kubed/kubed-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/kubed/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/kubed&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/kubed</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubed/kubed-kustomization&quot;</span>

flux create kustomization kubed <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --path<span class="token operator">=</span><span class="token string">&quot;./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubed/kubed-kustomization&quot;</span> <span class="token punctuation">\\</span>
  --prune<span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --wait <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubed/kubed-kustomization.yaml&quot;</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubed/kubed-kustomization/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
  <span class="token punctuation">(</span>
    <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubed/kubed-kustomization&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    kustomize create --resources <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/kubed <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
  <span class="token punctuation">)</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubed/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubed&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- kubed$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource kubed <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><h3 id="kubernetes-dashboard" tabindex="-1"><a class="header-anchor" href="#kubernetes-dashboard" aria-hidden="true">#</a> kubernetes-dashboard</h3>`,5),Gs={href:"https://github.com/kubernetes/dashboard",target:"_blank",rel:"noopener noreferrer"},Ps=n("kubernetes-dashboard"),Hs={href:"https://artifacthub.io/packages/helm/k8s-dashboard/kubernetes-dashboard",target:"_blank",rel:"noopener noreferrer"},Bs=n("kubernetes-dashboard"),Ws={href:"https://github.com/kubernetes/dashboard/blob/master/aio/deploy/helm-chart/kubernetes-dashboard/values.yaml",target:"_blank",rel:"noopener noreferrer"},Ys=n("default values.yaml"),Js=p(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/kubernetes-dashboard

kubectl create namespace kubernetes-dashboard --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> infrastructure/base/kubernetes-dashboard/kubernetes-dashboard-namespace.yaml

flux create helmrelease kubernetes-dashboard <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;kubernetes-dashboard&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/kubernetes-dashboard.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;kubernetes-dashboard&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;5.0.5&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/kubernetes-dashboard-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/kubernetes-dashboard/kubernetes-dashboard-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/kubernetes-dashboard/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/kubernetes-dashboard&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/kubernetes-dashboard</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubernetes-dashboard/kubernetes-dashboard-kustomization&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubernetes-dashboard/kubernetes-dashboard-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: kubernetes-dashboard
  namespace: flux-system
spec:
  dependsOn:
    - name: kube-prometheus-stack
  interval: 5m
  path: <span class="token string">&quot;./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubernetes-dashboard/kubernetes-dashboard-kustomization&quot;</span>
  prune: <span class="token boolean">true</span>
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: <span class="token boolean">true</span>
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubernetes-dashboard/kubernetes-dashboard-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubernetes-dashboard/kubernetes-dashboard-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: kubernetes-dashboard
resources:
  - kubernetes-dashboard-clusterrolebinding.yaml
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/kubernetes-dashboard
configMapGenerator:
  - name: kubernetes-dashboard-values
    files:
      - values.yaml<span class="token operator">=</span>kubernetes-dashboard-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubernetes-dashboard/kubernetes-dashboard-kustomization/kubernetes-dashboard-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
extraArgs:
  - --enable-skip-login
  - --enable-insecure-login
  - --disable-settings-authorizer
protocolHttp: <span class="token boolean">true</span>
ingress:
  enabled: <span class="token boolean">true</span>
  annotations:
     nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth
     nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd<span class="token operator">=</span><span class="token variable">$scheme</span>://<span class="token variable">$host</span><span class="token variable">$request_uri</span>
  className: <span class="token string">&quot;nginx&quot;</span>
  hosts:
    - kubernetes-dashboard.<span class="token variable">\${CLUSTER_FQDN}</span>
  tls:
    - hosts:
      - kubernetes-dashboard.<span class="token variable">\${CLUSTER_FQDN}</span>
settings:
  clusterName: <span class="token variable">\${CLUSTER_FQDN}</span>
  itemsPerPage: <span class="token number">50</span>
metricsScraper:
  enabled: <span class="token boolean">true</span>
serviceAccount:
  name: kubernetes-dashboard-admin
EOF

kubectl create clusterrolebinding kubernetes-dashboard-admin <span class="token punctuation">\\</span>
  --clusterrole<span class="token operator">=</span>cluster-admin <span class="token punctuation">\\</span>
  --serviceaccount<span class="token operator">=</span>kubernetes-dashboard:kubernetes-dashboard-admin <span class="token punctuation">\\</span>
  -o yaml --dry-run<span class="token operator">=</span>client <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubernetes-dashboard/kubernetes-dashboard-kustomization/kubernetes-dashboard-clusterrolebinding.yaml&quot;</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubernetes-dashboard/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kubernetes-dashboard&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- kubernetes-dashboard$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource kubernetes-dashboard <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br></div></div><h3 id="kyverno" tabindex="-1"><a class="header-anchor" href="#kyverno" aria-hidden="true">#</a> Kyverno</h3>`,5),Xs={href:"https://kyverno.io/",target:"_blank",rel:"noopener noreferrer"},Zs=n("Kyverno"),sn={href:"https://artifacthub.io/packages/helm/kyverno/kyverno",target:"_blank",rel:"noopener noreferrer"},nn=n("kyverno"),an={href:"https://github.com/kyverno/kyverno/blob/main/charts/kyverno/values.yaml",target:"_blank",rel:"noopener noreferrer"},en=n("default values.yaml"),pn={href:"https://artifacthub.io/packages/helm/kyverno/kyverno-policies",target:"_blank",rel:"noopener noreferrer"},tn=n("kyverno-policies"),rn={href:"https://github.com/kyverno/kyverno/blob/main/charts/kyverno-policies/values.yaml",target:"_blank",rel:"noopener noreferrer"},ln=n("default values.yaml"),on=p(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/kyverno

kubectl create namespace kyverno --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> infrastructure/base/kyverno/kyverno-namespace.yaml

flux create helmrelease kyverno <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;kyverno&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/kyverno.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;kyverno&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;v2.1.3&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/kyverno-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/kyverno/kyverno-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/kyverno/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/kyverno&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token function">mkdir</span> -vp infrastructure/base/kyverno-policies

flux create helmrelease kyverno-policies <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;kyverno&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --depends-on<span class="token operator">=</span><span class="token string">&quot;kyverno&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/kyverno.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;kyverno-policies&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;v2.1.3&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/kyverno-policies/kyverno-policies-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/kyverno-policies/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/kyverno-policies&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/crossplane</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno/kyverno-kustomization&quot;</span>

flux create kustomization kyverno <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --depends-on<span class="token operator">=</span><span class="token string">&quot;kube-prometheus-stack&quot;</span> <span class="token punctuation">\\</span>
  --path<span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/kyverno/kyverno-kustomization&quot;</span> <span class="token punctuation">\\</span>
  --prune<span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --wait <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno/kyverno-kustomization.yaml&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno/kyverno-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno/kyverno-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: kyverno
resources:
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/kyverno
configMapGenerator:
  - name: kyverno-values
    files:
      - values.yaml<span class="token operator">=</span>kyverno-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno/kyverno-kustomization/kyverno-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
serviceMonitor:
  enabled: <span class="token boolean">true</span>
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- kyverno$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource kyverno <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno-policies/kyverno-policies-kustomization&quot;</span>

flux create kustomization kyverno-policies <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --depends-on<span class="token operator">=</span><span class="token string">&quot;kyverno&quot;</span> <span class="token punctuation">\\</span>
  --path<span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/kyverno-policies/kyverno-policies-kustomization&quot;</span> <span class="token punctuation">\\</span>
  --prune<span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --wait <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno-policies/kyverno-policies-kustomization.yaml&quot;</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno-policies/kyverno-policies-kustomization/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
  <span class="token punctuation">(</span>
    <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno-policies/kyverno-policies-kustomization&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    kustomize create --resources <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/kyverno-policies <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    <span class="token builtin class-name">cd</span> -  <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
  <span class="token punctuation">)</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno-policies/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kyverno-policies&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- kyverno-policies$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource kyverno-policies <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br></div></div><h3 id="oauth2-proxy-keycloak" tabindex="-1"><a class="header-anchor" href="#oauth2-proxy-keycloak" aria-hidden="true">#</a> OAuth2 Proxy - Keycloak</h3>`,5),cn={href:"https://oauth2-proxy.github.io/oauth2-proxy/",target:"_blank",rel:"noopener noreferrer"},un=n("oauth2-proxy"),bn={href:"https://artifacthub.io/packages/helm/oauth2-proxy/oauth2-proxy",target:"_blank",rel:"noopener noreferrer"},mn=n("oauth2-proxy"),kn={href:"https://github.com/oauth2-proxy/manifests/blob/main/helm/oauth2-proxy/values.yaml",target:"_blank",rel:"noopener noreferrer"},dn=n("default values.yaml"),gn=p(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/oauth2-proxy-keycloak

kubectl create namespace oauth2-proxy-keycloak --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> infrastructure/base/oauth2-proxy-keycloak/oauth2-proxy-keycloak-namespace.yaml

flux create helmrelease oauth2-proxy-keycloak <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;oauth2-proxy-keycloak&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/oauth2-proxy.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;oauth2-proxy&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;5.0.6&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/oauth2-proxy-keycloak-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/oauth2-proxy-keycloak/oauth2-proxy-keycloak-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/oauth2-proxy-keycloak/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/oauth2-proxy-keycloak&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/oauth2-proxy-keycloak</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy-keycloak/oauth2-proxy-keycloak-kustomization&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy-keycloak/oauth2-proxy-keycloak-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: oauth2-proxy-keycloak
  namespace: flux-system
spec:
  dependsOn:
  - name: kube-prometheus-stack
  interval: 5m
  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy-keycloak/oauth2-proxy-keycloak-kustomization
  prune: <span class="token boolean">true</span>
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: <span class="token boolean">true</span>
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy-keycloak/oauth2-proxy-keycloak-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy-keycloak/oauth2-proxy-keycloak-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: oauth2-proxy-keycloak
resources:
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/oauth2-proxy-keycloak
configMapGenerator:
  - name: oauth2-proxy-keycloak-values
    files:
      - values.yaml<span class="token operator">=</span>oauth2-proxy-keycloak-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy-keycloak/oauth2-proxy-keycloak-kustomization/oauth2-proxy-keycloak-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
config:
  clientID: oauth2-proxy-keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>
  clientSecret: <span class="token variable">\${MY_PASSWORD}</span>
  cookieSecret: <span class="token variable">\${MY_COOKIE_SECRET}</span>
  configFile: <span class="token operator">|</span>-
    email_domains <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token string">&quot;*&quot;</span> <span class="token punctuation">]</span>
    upstreams <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token string">&quot;file:///dev/null&quot;</span> <span class="token punctuation">]</span>
    whitelist_domains <span class="token operator">=</span> <span class="token string">&quot;.<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span>
    cookie_domains <span class="token operator">=</span> <span class="token string">&quot;.<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span>
    provider <span class="token operator">=</span> <span class="token string">&quot;keycloak&quot;</span>
    login_url <span class="token operator">=</span> <span class="token string">&quot;https://keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>/auth/realms/myrealm/protocol/openid-connect/auth&quot;</span>
    redeem_url <span class="token operator">=</span> <span class="token string">&quot;https://keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>/auth/realms/myrealm/protocol/openid-connect/token&quot;</span>
    profile_url <span class="token operator">=</span> <span class="token string">&quot;https://keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>/auth/realms/myrealm/protocol/openid-connect/userinfo&quot;</span>
    validate_url <span class="token operator">=</span> <span class="token string">&quot;https://keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>/auth/realms/myrealm/protocol/openid-connect/userinfo&quot;</span>
    scope <span class="token operator">=</span> <span class="token string">&quot;openid email profile&quot;</span>
    ssl_insecure_skip_verify <span class="token operator">=</span> <span class="token string">&quot;true&quot;</span>
    insecure_oidc_skip_issuer_verification <span class="token operator">=</span> <span class="token string">&quot;true&quot;</span>
ingress:
  enabled: <span class="token boolean">true</span>
  className: nginx
  hosts:
    - oauth2-proxy-keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>
  tls:
    - hosts:
      - oauth2-proxy-keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>
metrics:
  servicemonitor:
    enabled: <span class="token boolean">true</span>
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy-keycloak/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy-keycloak&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- oauth2-proxy-keycloak$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource oauth2-proxy-keycloak <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br></div></div><h3 id="podinfo" tabindex="-1"><a class="header-anchor" href="#podinfo" aria-hidden="true">#</a> podinfo</h3>`,5),vn={href:"https://github.com/stefanprodan/podinfo",target:"_blank",rel:"noopener noreferrer"},fn=n("podinfo"),hn={href:"https://artifacthub.io/packages/helm/podinfo/podinfo",target:"_blank",rel:"noopener noreferrer"},qn=n("podinfo"),yn={href:"https://github.com/stefanprodan/podinfo/blob/master/charts/podinfo/values.yaml",target:"_blank",rel:"noopener noreferrer"},Nn=n("default values.yaml"),En=p(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/podinfo

kubectl create namespace podinfo --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> infrastructure/base/podinfo/podinfo-namespace.yaml

flux create helmrelease podinfo <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;podinfo&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/podinfo.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;podinfo&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;6.0.3&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/podinfo-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/podinfo/podinfo-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/podinfo/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/podinfo&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/podinfo</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/podinfo/podinfo-kustomization&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/podinfo/podinfo-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: podinfo
  namespace: flux-system
spec:
  dependsOn:
    - name: kube-prometheus-stack
  interval: 5m
  path: <span class="token string">&quot;./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/podinfo/podinfo-kustomization&quot;</span>
  prune: <span class="token boolean">true</span>
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: <span class="token boolean">true</span>
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/podinfo/podinfo-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/podinfo/podinfo-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: podinfo
resources:
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/podinfo
configMapGenerator:
  - name: podinfo-values
    files:
      - values.yaml<span class="token operator">=</span>podinfo-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/podinfo/podinfo-kustomization/podinfo-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
ingress:
  enabled: <span class="token boolean">true</span>
  className: nginx
  annotations:
    nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy-keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth
    nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy-keycloak.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd<span class="token operator">=</span><span class="token variable">$scheme</span>://<span class="token variable">$host</span><span class="token variable">$request_uri</span>
  hosts:
    - host: podinfo.<span class="token variable">\${CLUSTER_FQDN}</span>
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls:
    - hosts:
      - podinfo.<span class="token variable">\${CLUSTER_FQDN}</span>
serviceMonitor:
  enabled: <span class="token boolean">true</span>
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/podinfo/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/podinfo&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- podinfo$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource podinfo <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br></div></div><h3 id="polaris" tabindex="-1"><a class="header-anchor" href="#polaris" aria-hidden="true">#</a> Polaris</h3><p>Add Polaris to the single K8s cluster.</p>`,6),_n={href:"https://www.fairwinds.com/polaris",target:"_blank",rel:"noopener noreferrer"},Rn=n("Polaris"),On={href:"https://artifacthub.io/packages/helm/fairwinds-stable/polaris",target:"_blank",rel:"noopener noreferrer"},$n=n("polaris"),xn={href:"https://github.com/FairwindsOps/charts/blob/master/stable/polaris/values.yaml",target:"_blank",rel:"noopener noreferrer"},Tn=n("default values.yaml"),zn=p(`<p>Add <code>HelmRepository</code> for polaris to &quot;cluster level&quot;:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>flux create <span class="token builtin class-name">source</span> helm <span class="token string">&quot;fairwinds-stable&quot;</span> <span class="token punctuation">\\</span>
  --url<span class="token operator">=</span><span class="token string">&quot;https://charts.fairwinds.com/stable&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span>1h <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/sources/fairwinds-stable.yaml&quot;</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- fairwinds-stable.yaml$&#39;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/sources/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
  <span class="token punctuation">(</span>
    <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/sources/&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    kustomize edit <span class="token function">add</span> resource fairwinds-stable.yaml <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    <span class="token builtin class-name">cd</span> -  <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
  <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>Define &quot;cluster level&quot; application definition:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -pv <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/polaris&quot;</span>

kubectl create namespace polaris --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/polaris/polaris-namespace.yaml&quot;</span>

flux create helmrelease polaris <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;polaris&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/fairwinds-stable.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;polaris&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;4.2.3&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/polaris-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/polaris/polaris-helmrelease.yaml&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/polaris/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/polaris/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: polaris
resources:
  - polaris-namespace.yaml
  - polaris-helmrelease.yaml
configMapGenerator:
  - name: polaris-values
    files:
      - values.yaml<span class="token operator">=</span>polaris-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/polaris/polaris-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
dashboard:
  ingress:
    enabled: <span class="token boolean">true</span>
    annotations:
      nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth
      nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd<span class="token operator">=</span><span class="token variable">$scheme</span>://<span class="token variable">$host</span><span class="token variable">$request_uri</span>
    hosts:
      - polaris.<span class="token variable">\${CLUSTER_FQDN}</span>
    tls:
      - hosts:
        - polaris.<span class="token variable">\${CLUSTER_FQDN}</span>
EOF

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- polaris$&#39;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource polaris <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br></div></div><h3 id="policy-reporter" tabindex="-1"><a class="header-anchor" href="#policy-reporter" aria-hidden="true">#</a> Policy Reporter</h3>`,5),Mn={href:"https://github.com/kyverno/policy-reporter/wiki",target:"_blank",rel:"noopener noreferrer"},In=n("Policy Reporter"),Vn={href:"https://github.com/kyverno/policy-reporter/tree/main/charts/policy-reporter",target:"_blank",rel:"noopener noreferrer"},Fn=n("policy-reporter"),Sn={href:"https://github.com/kyverno/policy-reporter/blob/main/charts/policy-reporter/values.yaml",target:"_blank",rel:"noopener noreferrer"},wn=n("default values.yaml"),Cn=p(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/policy-reporter

kubectl create namespace policy-reporter --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> infrastructure/base/policy-reporter/policy-reporter-namespace.yaml

flux create helmrelease policy-reporter <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;policy-reporter&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/policy-reporter.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;policy-reporter&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;2.1.1&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/policy-reporter-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/policy-reporter/policy-reporter-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/policy-reporter/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/policy-reporter&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/cert-manager</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/policy-reporter/policy-reporter-kustomization&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/policy-reporter/policy-reporter-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
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
  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/policy-reporter/policy-reporter-kustomization
  prune: <span class="token boolean">true</span>
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: <span class="token boolean">true</span>
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/policy-reporter/policy-reporter-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/policy-reporter/policy-reporter-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: policy-reporter
resources:
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/policy-reporter
  - policy-reporter-ingress.yaml
configMapGenerator:
  - name: policy-reporter-values
    files:
      - values.yaml<span class="token operator">=</span>policy-reporter-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/policy-reporter/policy-reporter-kustomization/policy-reporter-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
ui:
  enabled: <span class="token boolean">true</span>
kyvernoPlugin:
  enabled: <span class="token boolean">true</span>
monitoring:
  enabled: <span class="token boolean">true</span>
  namespace: policy-reporter
global:
  plugins:
    keyverno: <span class="token boolean">true</span>
target:
  slack:
    webhook: <span class="token string">&quot;<span class="token variable">\${SLACK_INCOMING_WEBHOOK_URL}</span>&quot;</span>
    minimumPriority: <span class="token string">&quot;critical&quot;</span>
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/policy-reporter/policy-reporter-kustomization/policy-reporter-ingress.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd<span class="token operator">=</span><span class="token variable">$scheme</span>://<span class="token variable">$host</span><span class="token variable">$request_uri</span>
    nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth
  name: policy-reporter
  namespace: policy-reporter
spec:
  ingressClassName: nginx
  rules:
  - host: policy-reporter.<span class="token variable">\${CLUSTER_FQDN}</span>
    http:
      paths:
      - backend:
          service:
            name: policy-reporter-ui
            port:
              number: <span class="token number">8080</span>
        path: /
        pathType: Prefix
  tls:
  - hosts:
    - policy-reporter.<span class="token variable">\${CLUSTER_FQDN}</span>
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/policy-reporter/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/policy-reporter&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- policy-reporter$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource policy-reporter <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br></div></div><h3 id="rancher" tabindex="-1"><a class="header-anchor" href="#rancher" aria-hidden="true">#</a> Rancher</h3>`,5),Dn={href:"https://rancher.com/",target:"_blank",rel:"noopener noreferrer"},Ln=n("Rancher"),Un={href:"https://github.com/rancher/rancher/tree/master/chart",target:"_blank",rel:"noopener noreferrer"},Qn=n("rancher"),jn={href:"https://github.com/rancher/rancher/blob/master/chart/values.yaml",target:"_blank",rel:"noopener noreferrer"},An=n("default values.yaml"),Kn=p(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/rancher

flux create helmrelease rancher <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;cattle-system&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --timeout<span class="token operator">=</span><span class="token string">&quot;10m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/rancher-latest.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;rancher&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;2.6.3&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/rancher-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/rancher/rancher-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/rancher/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/rancher&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/rancher</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/rancher/rancher-kustomization&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/rancher/rancher-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
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
  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/rancher/rancher-kustomization
  prune: <span class="token boolean">true</span>
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: <span class="token boolean">true</span>
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/rancher/rancher-kustomization/rancher-namespace.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: v1
kind: Namespace
metadata:
  name: cattle-system
  labels:
    cert-manager-cert-<span class="token variable">\${LETSENCRYPT_ENVIRONMENT}</span><span class="token builtin class-name">:</span> copy
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/rancher/rancher-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/rancher/rancher-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: cattle-system
resources:
  - rancher-namespace.yaml
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/rancher
configMapGenerator:
  - name: rancher-values
    files:
      - values.yaml<span class="token operator">=</span>rancher-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/rancher/rancher-kustomization/rancher-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
hostname: rancher.<span class="token variable">\${CLUSTER_FQDN}</span>
ingress:
  extraAnnotations:
    nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth
    nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd<span class="token operator">=</span><span class="token variable">$scheme</span>://<span class="token variable">$host</span><span class="token variable">$request_uri</span>
  tls:
    source: secret
    secretName: ingress-cert-<span class="token variable">\${LETSENCRYPT_ENVIRONMENT}</span>
replicas: <span class="token number">1</span>
bootstrapPassword: <span class="token variable">\${MY_PASSWORD}</span>
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/rancher/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/rancher&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- rancher$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource rancher <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br></div></div><h3 id="secrets-store-csi-driver" tabindex="-1"><a class="header-anchor" href="#secrets-store-csi-driver" aria-hidden="true">#</a> Secrets Store CSI driver</h3>`,5),Gn={href:"https://secrets-store-csi-driver.sigs.k8s.io/",target:"_blank",rel:"noopener noreferrer"},Pn=n("secrets-store-csi-driver"),Hn={href:"https://github.com/kubernetes-sigs/secrets-store-csi-driver/tree/master/charts/secrets-store-csi-driver",target:"_blank",rel:"noopener noreferrer"},Bn=n("secrets-store-csi-driver"),Wn={href:"https://github.com/kubernetes-sigs/secrets-store-csi-driver/blob/master/charts/secrets-store-csi-driver/values.yaml",target:"_blank",rel:"noopener noreferrer"},Yn=n("default values.yaml"),Jn=p(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/secrets-store-csi-driver

kubectl create namespace secrets-store-csi-driver --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> infrastructure/base/secrets-store-csi-driver/secrets-store-csi-driver-namespace.yaml

flux create helmrelease secrets-store-csi-driver <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;secrets-store-csi-driver&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/secrets-store-csi-driver.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;secrets-store-csi-driver&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;1.0.0&quot;</span> <span class="token punctuation">\\</span>
  --crds<span class="token operator">=</span><span class="token string">&quot;CreateReplace&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/secrets-store-csi-driver/secrets-store-csi-driver-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/secrets-store-csi-driver/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/secrets-store-csi-driver&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/crossplane</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -pv <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/secrets-store-csi-driver&quot;</span>/secrets-store-csi-driver-<span class="token punctuation">{</span>kustomization,kustomization-provider-aws<span class="token punctuation">}</span>

flux create kustomization secrets-store-csi-driver <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --path<span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/secrets-store-csi-driver/secrets-store-csi-driver-kustomization&quot;</span> <span class="token punctuation">\\</span>
  --prune<span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --wait <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/secrets-store-csi-driver/secrets-store-csi-driver-kustomization.yaml&quot;</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/secrets-store-csi-driver/secrets-store-csi-driver-kustomization/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
  <span class="token punctuation">(</span>
    <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/secrets-store-csi-driver/secrets-store-csi-driver-kustomization&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    kustomize create --resources <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/secrets-store-csi-driver <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
  <span class="token punctuation">)</span>

flux create kustomization secrets-store-csi-driver-provider-aws <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --depends-on<span class="token operator">=</span><span class="token string">&quot;secrets-store-csi-driver&quot;</span> <span class="token punctuation">\\</span>
  --path<span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/secrets-store-csi-driver/secrets-store-csi-driver-kustomization-provider-aws&quot;</span> <span class="token punctuation">\\</span>
  --prune<span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --wait <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/secrets-store-csi-driver/secrets-store-csi-driver-kustomization-provider-aws.yaml&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/secrets-store-csi-driver/secrets-store-csi-driver-kustomization-provider-aws/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: secrets-store-csi-driver
resources:
  - https://raw.githubusercontent.com/aws/secrets-store-csi-driver-provider-aws/807d3cea12264c518e2a5007d6009cee159c2917/deployment/aws-provider-installer.yaml
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/secrets-store-csi-driver/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/secrets-store-csi-driver&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- secrets-store-csi-driver$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource secrets-store-csi-driver <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br></div></div><h3 id="velero" tabindex="-1"><a class="header-anchor" href="#velero" aria-hidden="true">#</a> Velero</h3>`,5),Xn={href:"https://velero.io/",target:"_blank",rel:"noopener noreferrer"},Zn=n("Velero"),sa={href:"https://artifacthub.io/packages/helm/vmware-tanzu/velero",target:"_blank",rel:"noopener noreferrer"},na=n("velero"),aa={href:"https://github.com/vmware-tanzu/helm-charts/blob/main/charts/velero/values.yaml",target:"_blank",rel:"noopener noreferrer"},ea=n("default values.yaml"),pa=p(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/velero

flux create helmrelease velero <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;velero&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/vmware-tanzu.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;velero&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;2.27.1&quot;</span> <span class="token punctuation">\\</span>
  --crds<span class="token operator">=</span><span class="token string">&quot;CreateReplace&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/velero-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/velero/velero-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/velero/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/velero&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/velero</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/velero/velero-kustomization&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/velero/velero-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
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
  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/velero/velero-kustomization
  prune: <span class="token boolean">true</span>
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: <span class="token boolean">true</span>
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/velero/velero-kustomization/velero-volumesnapshotclass.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotClass
metadata:
  name: velero-csi-ebs-snapclass
  labels:
    velero.io/csi-volumesnapshot-class: <span class="token string">&quot;true&quot;</span>
driver: ebs.csi.aws.com
deletionPolicy: Delete
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/velero/velero-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/velero/velero-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: velero
resources:
  - velero-volumesnapshotclass.yaml
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/velero
configMapGenerator:
  - name: velero-values
    files:
      - values.yaml<span class="token operator">=</span>velero-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/velero/velero-kustomization/velero-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
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
    enabled: <span class="token boolean">true</span>
configuration:
  provider: aws
  backupStorageLocation:
    bucket: <span class="token variable">\${CLUSTER_FQDN}</span>
    prefix: velero
    config:
      region: <span class="token variable">\${AWS_DEFAULT_REGION}</span>
      <span class="token comment"># kmsKeyId: TODO !!!! xxxxx</span>
  volumeSnapshotLocation:
    name: aws
    config:
      region: <span class="token variable">\${AWS_DEFAULT_REGION}</span>
  features: EnableCSI
  defaultResticPruneFrequency: 71h
serviceAccount:
  server:
    create: <span class="token boolean">false</span>
    name: velero
credentials:
  useSecret: <span class="token boolean">false</span>
schedules:
  <span class="token comment"># https://doc.crds.dev/github.com/vmware-tanzu/velero/velero.io/Backup/v1@v1.5.1</span>
  my-backup-all:
    disabled: <span class="token boolean">false</span>
    schedule: <span class="token string">&quot;0 */8 * * *&quot;</span>
    useOwnerReferencesInBackup: <span class="token boolean">true</span>
    template:
      ttl: 48h
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/velero/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/velero&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- velero$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource velero <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br></div></div><h2 id="flux" tabindex="-1"><a class="header-anchor" href="#flux" aria-hidden="true">#</a> Flux</h2><p>Commit changes to git repository:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>
<span class="token function">git</span> commit -m <span class="token string">&quot;[<span class="token variable">\${CLUSTER_NAME}</span>] Add applications&quot;</span> <span class="token operator">||</span> <span class="token boolean">true</span>
<span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span><span class="token function">git</span> push <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span><span class="token file-descriptor important">&amp;1</span><span class="token variable">)</span></span>&quot;</span> <span class="token operator">=~</span> ^Everything<span class="token punctuation">\\</span> up-to-date <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token punctuation">;</span> <span class="token keyword">then</span>
  flux reconcile <span class="token builtin class-name">source</span> <span class="token function">git</span> flux-system
  <span class="token function">sleep</span> <span class="token number">10</span>
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>Go back to the main directory:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>Check Flux errors:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>kubectl <span class="token function">wait</span> --timeout<span class="token operator">=</span>30m --for<span class="token operator">=</span>condition<span class="token operator">=</span>ready kustomizations.kustomize.toolkit.fluxcd.io -n flux-system cluster-apps
flux logs --level<span class="token operator">=</span>error --all-namespaces
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>Check <code>helmreleases</code>, <code>helmrepositories</code>, <code>kustomizations</code>, ...</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>kubectl get pods -A
kubectl get helmreleases.helm.toolkit.fluxcd.io -A
kubectl get helmrepositories.source.toolkit.fluxcd.io -A
kubectl get kustomizations.kustomize.toolkit.fluxcd.io -A
helm <span class="token function">ls</span> -A
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>Export command for kubeconfig:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token builtin class-name">echo</span> <span class="token string">&quot;export KUBECONFIG=<span class="token entity" title="\\&quot;">\\&quot;</span>\\<span class="token variable">\${<span class="token environment constant">PWD</span>}</span>/tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/kubeconfig-<span class="token variable">\${CLUSTER_NAME}</span>.conf<span class="token entity" title="\\&quot;">\\&quot;</span>&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div>`,15);function ta(ra,la){const t=l("RouterLink"),e=l("ExternalLinkIcon");return c(),i(u,null,[m,s("nav",k,[s("ul",null,[s("li",null,[a(t,{to:"#applications-definitions"},{default:r(()=>[d]),_:1}),s("ul",null,[s("li",null,[a(t,{to:"#amazon-efs-csi-driver"},{default:r(()=>[g]),_:1})]),s("li",null,[a(t,{to:"#crossplane-aws"},{default:r(()=>[v]),_:1})]),s("li",null,[a(t,{to:"#istio"},{default:r(()=>[f]),_:1})]),s("li",null,[a(t,{to:"#kuard"},{default:r(()=>[h]),_:1})]),s("li",null,[a(t,{to:"#kubed"},{default:r(()=>[q]),_:1})]),s("li",null,[a(t,{to:"#kubernetes-dashboard"},{default:r(()=>[y]),_:1})]),s("li",null,[a(t,{to:"#kyverno"},{default:r(()=>[N]),_:1})]),s("li",null,[a(t,{to:"#oauth2-proxy-keycloak"},{default:r(()=>[E]),_:1})]),s("li",null,[a(t,{to:"#podinfo"},{default:r(()=>[_]),_:1})]),s("li",null,[a(t,{to:"#polaris"},{default:r(()=>[R]),_:1})]),s("li",null,[a(t,{to:"#policy-reporter"},{default:r(()=>[O]),_:1})]),s("li",null,[a(t,{to:"#rancher"},{default:r(()=>[$]),_:1})]),s("li",null,[a(t,{to:"#secrets-store-csi-driver"},{default:r(()=>[x]),_:1})]),s("li",null,[a(t,{to:"#velero"},{default:r(()=>[T]),_:1})])])]),s("li",null,[a(t,{to:"#flux"},{default:r(()=>[z]),_:1})])])]),M,I,s("p",null,[V,s("a",F,[S,a(e)]),w,s("a",C,[D,a(e)])]),s("p",null,[s("a",L,[U,a(e)])]),s("ul",null,[s("li",null,[s("a",Q,[j,a(e)])]),s("li",null,[s("a",A,[K,a(e)])])]),G,s("p",null,[s("a",P,[H,a(e)])]),B,s("p",null,[s("a",W,[Y,a(e)])]),s("ul",null,[s("li",null,[s("a",J,[X,a(e)])]),s("li",null,[s("a",Z,[ss,a(e)])])]),ns,s("p",null,[s("a",as,[es,a(e)])]),s("ul",null,[s("li",null,[s("a",ps,[ts,a(e)])])]),rs,s("p",null,[s("a",ls,[os,a(e)])]),s("ul",null,[s("li",null,[s("a",cs,[is,a(e)])]),s("li",null,[s("a",us,[bs,a(e)])])]),ms,s("p",null,[s("a",ks,[ds,a(e)])]),s("ul",null,[s("li",null,[s("a",gs,[vs,a(e)])])]),fs,s("p",null,[s("a",hs,[qs,a(e)])]),s("ul",null,[s("li",null,[s("a",ys,[Ns,a(e)])]),s("li",null,[s("a",Es,[_s,a(e)])])]),Rs,s("p",null,[s("a",Os,[$s,a(e)])]),s("ul",null,[s("li",null,[s("a",xs,[Ts,a(e)])]),s("li",null,[s("a",zs,[Ms,a(e)])])]),Is,s("p",null,[s("a",Vs,[Fs,a(e)])]),s("ul",null,[s("li",null,[s("a",Ss,[ws,a(e)])])]),Cs,s("p",null,[s("a",Ds,[Ls,a(e)])]),s("ul",null,[s("li",null,[s("a",Us,[Qs,a(e)])]),s("li",null,[s("a",js,[As,a(e)])])]),Ks,s("p",null,[s("a",Gs,[Ps,a(e)])]),s("ul",null,[s("li",null,[s("a",Hs,[Bs,a(e)])]),s("li",null,[s("a",Ws,[Ys,a(e)])])]),Js,s("p",null,[s("a",Xs,[Zs,a(e)])]),s("ul",null,[s("li",null,[s("p",null,[s("a",sn,[nn,a(e)])])]),s("li",null,[s("p",null,[s("a",an,[en,a(e)])])]),s("li",null,[s("p",null,[s("a",pn,[tn,a(e)])])]),s("li",null,[s("p",null,[s("a",rn,[ln,a(e)])])])]),on,s("p",null,[s("a",cn,[un,a(e)])]),s("ul",null,[s("li",null,[s("a",bn,[mn,a(e)])]),s("li",null,[s("a",kn,[dn,a(e)])])]),gn,s("p",null,[s("a",vn,[fn,a(e)])]),s("ul",null,[s("li",null,[s("a",hn,[qn,a(e)])]),s("li",null,[s("a",yn,[Nn,a(e)])])]),En,s("p",null,[s("a",_n,[Rn,a(e)])]),s("ul",null,[s("li",null,[s("a",On,[$n,a(e)])]),s("li",null,[s("a",xn,[Tn,a(e)])])]),zn,s("p",null,[s("a",Mn,[In,a(e)])]),s("ul",null,[s("li",null,[s("a",Vn,[Fn,a(e)])]),s("li",null,[s("a",Sn,[wn,a(e)])])]),Cn,s("p",null,[s("a",Dn,[Ln,a(e)])]),s("ul",null,[s("li",null,[s("a",Un,[Qn,a(e)])]),s("li",null,[s("a",jn,[An,a(e)])])]),Kn,s("p",null,[s("a",Gn,[Pn,a(e)])]),s("ul",null,[s("li",null,[s("a",Hn,[Bn,a(e)])]),s("li",null,[s("a",Wn,[Yn,a(e)])])]),Jn,s("p",null,[s("a",Xn,[Zn,a(e)])]),s("ul",null,[s("li",null,[s("a",sa,[na,a(e)])]),s("li",null,[s("a",aa,[ea,a(e)])])]),pa],64)}var ca=o(b,[["render",ta],["__file","index.html.vue"]]);export{ca as default};
