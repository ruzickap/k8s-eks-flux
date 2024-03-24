import{_ as r,r as o,o as p,c,a as s,b as a,w as i,d as n,e as l}from"./app-CPf3PThy.js";const u={},d=s("h1",{id:"base-applications",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#base-applications"},[s("span",null,"Base Applications")])],-1),v={class:"table-of-contents"},m=s("h2",{id:"flux-dis-advantages",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#flux-dis-advantages"},[s("span",null,"Flux (dis)advantages")])],-1),k=s("code",null,"dependsOn",-1),b=s("code",null,"HelmRelease",-1),g=s("code",null,"Kustomization",-1),f={href:"https://github.com/fluxcd/kustomize-controller/issues/242",target:"_blank",rel:"noopener noreferrer"},h={href:"https://github.com/fluxcd/flux2/discussions/730",target:"_blank",rel:"noopener noreferrer"},q={href:"https://github.com/fluxcd/flux2/discussions/1010",target:"_blank",rel:"noopener noreferrer"},E=s("code",null,"HelmRelease",-1),N=s("code",null,"Kustomization",-1),y=s("code",null,"dependsOn",-1),x=s("code",null,"Kustomization",-1),_={href:"https://fluxcd.io/docs/components/helm/helmreleases/",target:"_blank",rel:"noopener noreferrer"},R=s("code",null,"helm ls -A",-1),O={href:"https://fluxcd.io/flux/components/kustomize/kustomization/#post-build-variable-substitution",target:"_blank",rel:"noopener noreferrer"},T={href:"https://fluxcd.io/flux/components/kustomize/kustomization/#post-build-variable-substitution",target:"_blank",rel:"noopener noreferrer"},$=s("li",null,[n("Changing values inside patches which are use "),s("code",null,"|-"),n(' is not possible, because it is a block of "text" and not "structure"')],-1),z=s("h2",{id:"solution-requirements-for-flux",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#solution-requirements-for-flux"},[s("span",null,"Solution requirements for Flux")])],-1),I=s("li",null,[s("code",null,"HelmRepositories"),n(" must be installed in "),s("code",null,"flux-system"),n(" namespace and separated, because definitions there are shared by multiple "),s("code",null,"HelmReleases")],-1),M=s("li",null,[s("code",null,"HelmRepositories"),n(" must be installed before "),s("code",null,"HelmReleases"),n(" ("),s("code",null,"dependsOn"),n(") to prevent generating errors in Flux log")],-1),S=s("code",null,"prod",-1),F=s("code",null,"dev",-1),C=s("code",null,"mygroup",-1),V=s("code",null,"myteam",-1),w=s("li",null,"It should be possible to define infrastructure group containing various applications",-1),U=s("li",null,[n("It should also help you to easily manage groups of clusters because their definitions will be in the specific directory (like "),s("code",null,"infrastructure/dev"),n(")")],-1),L={href:"https://fluxcd.io/flux/components/kustomize/kustomization/#post-build-variable-substitution",target:"_blank",rel:"noopener noreferrer"},D=s("code",null,"clusters/dev/kube1/cluster-apps-substitutefrom-secret.yaml",-1),A=s("li",null,[s("code",null,"HelmRepository"),n(" / "),s("code",null,"HelmReleases"),n(' can be defined per "cluster": '),s("ul",null,[s("li",null,[s("code",null,"clusters/dev/kube1/sources/fairwinds-stable.yaml")]),s("li",null,[s("code",null,"clusters/dev/kube1/cluster-apps/polaris/polaris-helmrelease.yaml")])])],-1),H=l(`<h3 id="naming-convention-and-directory-structure" tabindex="-1"><a class="header-anchor" href="#naming-convention-and-directory-structure"><span>Naming convention and directory structure</span></a></h3><p>Most of the applications installed to K8s cluster are using Helm charts. Therefore you need Flux objects <code>HelmRepositories</code> and <code>HelmReleases</code> where <code>HelmRepositories</code> needs to be installed first.</p><ul><li><code>HelmRepositories</code> are separated from app definition, because they may be shared by multiple applications (like <code>bitnami</code> and <code>external-dns</code> + <code>metrics-server</code>). <code>HelmRepositories</code> are installed first to prevent flux from logging errors...</li><li>Applications can be installed on multiple levels <ul><li><strong>Apps level</strong> - not used</li><li><strong>Infrastructure level</strong> - configuration for specific group of K8s servers. Usually contains objects, patches, certificates, which are applied to multiple clusters (different objects for &quot;dev&quot; and &quot;prod&quot; clusters)</li><li><strong>Cluster level</strong> - specific app configurations, <code>HelmReleases</code> / <code>HelmRepositories</code> for single cluster. Usually contains variables like <code>CLUSTER_FQDN</code>, <code>CLUSTER_NAME</code>, <code>MY_PASSWORD</code>, <code>LETSENCRYPT_ENVIRONMENT</code> ...</li></ul></li></ul><h4 id="cluster-level" tabindex="-1"><a class="header-anchor" href="#cluster-level"><span>Cluster level</span></a></h4><p>Cluster level directory <code>/clusters/</code> contains individual cluster definitions.</p><ul><li><code>clusters/\${ENVIRONMENT}/\${CLUSTER_FQDN}</code><ul><li><code>sources.yaml</code> - main &quot;flux Kustomization&quot; pointing do the <code>./sources</code> where are the <code>HelmRepository</code> definitions for cluster</li><li><code>sources/kustomization.yaml</code> - list of all &quot;enabled HelmRepositories&quot;</li><li><code>sources/fairwinds-stable.yaml</code> - HelmRepository file</li><li><code>cluster-apps.yaml</code> - main &quot;flux Kustomization&quot; pointing to <code>./clusters/dev/kube1.k8s.mylabs.dev/cluster-apps</code></li><li><code>cluster-apps/kustomization.yaml</code> - kustomization file containing patches, app directories and <code>./infrastructure/dev</code></li><li><code>cluster-apps-substitutefrom-secret.yaml</code> - encrypted variables used in <code>postBuild.substituteFrom</code> flux Kustomization sections</li><li><code>cluster-apps/polaris/polaris-namespace</code> - application namespace</li><li><code>cluster-apps/polaris/polaris-helmrelease</code> - <code>HelmRelease</code> file</li><li><code>flux-system/gotk-patches.yaml,kustomization.yaml</code> - files configuring Flux to work with SOPS (decryption)</li></ul></li></ul><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>clusters
└── dev
    └── kube1.k8s.mylabs.dev
        ├── cluster-apps
        │   ├── kustomization.yaml
        │   └── polaris
        │       ├── kustomization.yaml
        │       ├── polaris-helmrelease.yaml
        │       └── polaris-namespace.yaml
        ├── cluster-apps-substitutefrom-secret.yaml
        ├── cluster-apps.yaml
        ├── flux-system
        │   ├── gotk-components.yaml
        │   ├── gotk-patches.yaml
        │   ├── gotk-sync.yaml
        │   └── kustomization.yaml
        ├── kustomization.yaml
        ├── sources
        │   ├── fairwinds-stable.yaml
        │   └── kustomization.yaml
        └── sources.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="infrastructure-level" tabindex="-1"><a class="header-anchor" href="#infrastructure-level"><span>Infrastructure level</span></a></h4><p>Infrastructure level contain applications or patches located in <code>base</code> directory. All definitions in infrastructure level are applied to all servers in that &quot;group&quot;. Infrastructure also contains the <code>sources</code> directory where you can find &quot;common&quot; HelmRepositories. Usually there are &quot;groups&quot; (directories) like <code>prd</code>, <code>dev</code>, <code>stg</code>, ...</p><ul><li><code>infrastructure</code> - directory containing &quot;infrastructure level&quot; definitions <ul><li><code>sources/kustomization.yaml</code> - globally allowed HelmRepositories</li><li><code>sources/bitnami-helmrepository.yaml</code> - HelmRepository file</li><li><code>base</code> - base application directory <ul><li><code>dex</code> - &quot;base&quot; dex directory containing HelmRelease, and namespace manifests</li></ul></li></ul></li><li><code>infrastructure/\${ENVIRONMENT}</code><ul><li><code>kustomization.yaml</code> - list of all enabled &quot;infrastructure dev level&quot; apps</li><li><code>dex</code> - directory containing values for HelmRelease</li></ul></li></ul><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>infrastructure
├── base
│   ├── cert-manager
│   │   ├── cert-manager-helmrelease.yaml
│   │   └── kustomization.yaml
│   ├── dex
│   │   ├── dex-helmrelease.yaml
│   │   ├── dex-namespace.yaml
│   │   └── kustomization.yaml
│   ├── external-dns
│   │   ├── external-dns-helmrelease.yaml
│   │   └── kustomization.yaml
│   ├── external-snapshotter
│   │   └── kustomization.yaml
│   └── secrets-store-csi-driver
│       ├── kustomization.yaml
│       ├── secrets-store-csi-driver-helmrelease.yaml
│       └── secrets-store-csi-driver-namespace.yaml
├── dev
│   ├── cert-manager
│   │   ├── cert-manager-kustomization-certificate
│   │   │   └── cert-manager-certificate.yaml
│   │   ├── cert-manager-kustomization-certificate.yaml
│   │   ├── cert-manager-kustomization-clusterissuer
│   │   │   ├── cert-manager-clusterissuer-letsencrypt-production-dns.yaml
│   │   │   └── cert-manager-clusterissuer-letsencrypt-staging-dns.yaml
│   │   ├── cert-manager-kustomization-clusterissuer.yaml
│   │   ├── cert-manager-kustomization
│   │   │   ├── cert-manager-values.yaml
│   │   │   ├── kustomization.yaml
│   │   │   └── kustomizeconfig.yaml
│   │   ├── cert-manager-kustomization.yaml
│   │   └── kustomization.yaml
│   ├── crossplane
│   │   ├── crossplane-kustomization
│   │   │   └── kustomization.yaml
│   │   ├── crossplane-kustomization.yaml
│   │   ├── crossplane-kustomization-provider
│   │   │   ├── crossplane-controllerconfig-aws.yaml
│   │   │   └── crossplane-provider-aws.yaml
│   │   ├── crossplane-kustomization-provider.yaml
│   │   ├── crossplane-kustomization-providerconfig
│   │   │   └── crossplane-providerconfig-aws.yaml
│   │   ├── crossplane-kustomization-providerconfig.yaml
│   │   └── kustomization.yaml
│   ├── dex
│   │   ├── dex-values.yaml
│   │   ├── kustomization.yaml
│   │   └── kustomizeconfig.yaml
│   ├── external-dns
│   │   ├── external-dns-kustomization
│   │   │   ├── external-dns-values.yaml
│   │   │   ├── kustomization.yaml
│   │   │   └── kustomizeconfig.yaml
│   │   ├── external-dns-kustomization.yaml
│   │   └── kustomization.yaml
│   ├── external-snapshotter
│   │   ├── external-snapshotter-kustomization
│   │   │   └── kustomization.yaml
│   │   ├── external-snapshotter-kustomization.yaml
│   │   └── kustomization.yaml
│   ├── kustomization.yaml
│   └── secrets-store-csi-driver
│       ├── kustomization.yaml
│       ├── secrets-store-csi-driver-kustomization
│       │   └── kustomization.yaml
│       ├── secrets-store-csi-driver-kustomization.yaml
│       ├── secrets-store-csi-driver-provider-aws
│       │   └── kustomization.yaml
│       └── secrets-store-csi-driver-provider-aws.yaml
└── sources
    ├── bitnami-helmrepository.yaml
    ├── crossplane-stable-helmrepository.yaml
    ├── dex-helmrepository.yaml
    ├── jetstack-helmrepository.yaml
    ├── kustomization.yaml
    └── secrets-store-csi-driver-helmrepository.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="create-basic-flux-structure-in-git-repository" tabindex="-1"><a class="header-anchor" href="#create-basic-flux-structure-in-git-repository"><span>Create basic Flux structure in git repository</span></a></h2><p>Clone initial git repository created by <code>eksctl</code> used by Flux:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token parameter variable">-d</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
  <span class="token function">git</span> <span class="token parameter variable">-C</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>&quot;</span> pull <span class="token parameter variable">-r</span>
<span class="token keyword">else</span>
  <span class="token function">git</span> clone <span class="token string">&quot;https://<span class="token variable">\${GITHUB_TOKEN}</span>@github.com/<span class="token variable">\${GITHUB_USER}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>.git&quot;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>&quot;</span>
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Create initial git repository structure:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>&quot;</span>/infrastructure/<span class="token punctuation">{</span>base,dev,sources<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Set <code>user.name</code> and <code>user.email</code> for git (if not already configured)</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">git</span> config user.name <span class="token operator">||</span> <span class="token function">git</span> config <span class="token parameter variable">--global</span> user.name <span class="token string">&quot;<span class="token variable">\${GITHUB_USER}</span>&quot;</span>
<span class="token function">git</span> config user.email <span class="token operator">||</span> <span class="token function">git</span> config <span class="token parameter variable">--global</span> user.email <span class="token string">&quot;<span class="token variable">\${MY_EMAIL}</span>&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>Go to the &quot;git directory&quot;:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>&quot;</span> <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="manage-kubernetes-secrets-with-mozilla-sops-and-amazon-secret-manager" tabindex="-1"><a class="header-anchor" href="#manage-kubernetes-secrets-with-mozilla-sops-and-amazon-secret-manager"><span>Manage Kubernetes secrets with Mozilla SOPS and Amazon Secret Manager</span></a></h2><p>Configure the Git directory for encryption:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> .sops.yaml <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">echo</span> <span class="token string">&quot;creation_rules:&quot;</span> <span class="token operator">&gt;</span> .sops.yaml

<span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&quot;<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span> .sops.yaml <span class="token operator">||</span> <span class="token function">cat</span> <span class="token operator">&gt;&gt;</span> .sops.yaml <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
  - path_regex: clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/.*
    encrypted_regex: ^(data)$
    kms: <span class="token variable">\${AWS_KMS_KEY_ARN}</span>
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Add SOPS configuration to git repository and sync it with Flux:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/flux-system/gotk-patches.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
  <span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/flux-system/gotk-patches.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: flux-system
  namespace: flux-system
spec:
  decryption:
    provider: sops
EOF

  <span class="token punctuation">(</span>
    <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/flux-system&quot;</span> <span class="token operator">&amp;&amp;</span>
      kustomize edit <span class="token function">add</span> patch <span class="token parameter variable">--path</span> gotk-patches.yaml <span class="token operator">&amp;&amp;</span>
      <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
  <span class="token punctuation">)</span>

  <span class="token function">git</span> <span class="token function">add</span> .sops.yaml <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/flux-system&quot;</span>
  <span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;[<span class="token variable">\${CLUSTER_NAME}</span>] Add SOPS configuration&quot;</span>
  <span class="token function">git</span> push
  flux reconcile <span class="token builtin class-name">source</span> <span class="token function">git</span> flux-system
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="helmrepositories" tabindex="-1"><a class="header-anchor" href="#helmrepositories"><span>HelmRepositories</span></a></h2><p>Create <code>HelmRepository</code> definitions...</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token builtin class-name">declare</span> <span class="token parameter variable">-A</span> <span class="token assign-left variable">HELMREPOSITORIES</span><span class="token operator">=</span><span class="token punctuation">(</span>
  <span class="token punctuation">[</span><span class="token string">&quot;appscode&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://charts.appscode.com/stable/&quot;</span>
  <span class="token punctuation">[</span><span class="token string">&quot;autoscaler&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://kubernetes.github.io/autoscaler&quot;</span>
  <span class="token punctuation">[</span><span class="token string">&quot;aws-ebs-csi-driver&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://kubernetes-sigs.github.io/aws-ebs-csi-driver/&quot;</span>
  <span class="token punctuation">[</span><span class="token string">&quot;aws-efs-csi-driver&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://kubernetes-sigs.github.io/aws-efs-csi-driver/&quot;</span>
  <span class="token punctuation">[</span><span class="token string">&quot;bitnami&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://charts.bitnami.com/bitnami&quot;</span>
  <span class="token punctuation">[</span><span class="token string">&quot;codecentric&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://codecentric.github.io/helm-charts&quot;</span>
  <span class="token punctuation">[</span><span class="token string">&quot;crossplane-stable&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://charts.crossplane.io/stable&quot;</span>
  <span class="token punctuation">[</span><span class="token string">&quot;dex&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://charts.dexidp.io&quot;</span>
  <span class="token punctuation">[</span><span class="token string">&quot;ingress-nginx&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://kubernetes.github.io/ingress-nginx&quot;</span>
  <span class="token punctuation">[</span><span class="token string">&quot;jaegertracing&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://jaegertracing.github.io/helm-charts&quot;</span>
  <span class="token punctuation">[</span><span class="token string">&quot;jetstack&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://charts.jetstack.io&quot;</span>
  <span class="token punctuation">[</span><span class="token string">&quot;kiali&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://kiali.org/helm-charts&quot;</span>
  <span class="token punctuation">[</span><span class="token string">&quot;kubernetes-dashboard&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://kubernetes.github.io/dashboard/&quot;</span>
  <span class="token punctuation">[</span><span class="token string">&quot;kyverno&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://kyverno.github.io/kyverno/&quot;</span>
  <span class="token punctuation">[</span><span class="token string">&quot;oauth2-proxy&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://oauth2-proxy.github.io/manifests&quot;</span>
  <span class="token punctuation">[</span><span class="token string">&quot;podinfo&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://stefanprodan.github.io/podinfo&quot;</span>
  <span class="token punctuation">[</span><span class="token string">&quot;policy-reporter&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://kyverno.github.io/policy-reporter&quot;</span>
  <span class="token punctuation">[</span><span class="token string">&quot;prometheus-community&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://prometheus-community.github.io/helm-charts&quot;</span>
  <span class="token punctuation">[</span><span class="token string">&quot;rancher-latest&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://releases.rancher.com/server-charts/latest&quot;</span>
  <span class="token punctuation">[</span><span class="token string">&quot;secrets-store-csi-driver&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts&quot;</span>
  <span class="token punctuation">[</span><span class="token string">&quot;vmware-tanzu&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://vmware-tanzu.github.io/helm-charts&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">for</span> <span class="token for-or-select variable">HELMREPOSITORY</span> <span class="token keyword">in</span> <span class="token string">&quot;<span class="token variable">\${<span class="token operator">!</span>HELMREPOSITORIES<span class="token punctuation">[</span>@<span class="token punctuation">]</span>}</span>&quot;</span><span class="token punctuation">;</span> <span class="token keyword">do</span>
  flux create <span class="token builtin class-name">source</span> helm <span class="token string">&quot;<span class="token variable">\${HELMREPOSITORY}</span>&quot;</span> <span class="token punctuation">\\</span>
    <span class="token parameter variable">--url</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${HELMREPOSITORIES<span class="token punctuation">[</span>\${HELMREPOSITORY}</span>]}&quot;</span> <span class="token punctuation">\\</span>
    <span class="token parameter variable">--interval</span><span class="token operator">=</span>1h <span class="token punctuation">\\</span>
    <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/sources/<span class="token variable">\${HELMREPOSITORY}</span>-helmrepository.yaml&quot;</span>
<span class="token keyword">done</span>

<span class="token comment"># Due to this issue: https://github.com/kubernetes-sigs/kustomize/issues/2803</span>
<span class="token comment"># you need to CD to the directory first and then go back</span>
<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token parameter variable">-f</span> infrastructure/sources/kustomization.yaml <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token function">rm</span> infrastructure/sources/kustomization.yaml
<span class="token builtin class-name">cd</span> infrastructure/sources <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="clusters" tabindex="-1"><a class="header-anchor" href="#clusters"><span>Clusters</span></a></h2><p>Create <code>cluster-apps</code>, <code>sources</code> and initial <code>kustomization.yaml</code> under cluster directory <code>clusters/\${ENVIRONMENT}/\${CLUSTER_FQDN}</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-pv</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span>/<span class="token punctuation">{</span>cluster-apps,sources<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>It is necessary to split <code>HelmRepository</code> and <code>HelmRelease</code>, otherwise there are many errors in flux logs. <code>HelmRepository</code> should be always installed before <code>HelmRelease</code> using <code>dependsOn</code>.</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>flux create kustomization sources <span class="token punctuation">\\</span>
  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/sources&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/sources.yaml&quot;</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/sources/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>
    <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/sources/&quot;</span> <span class="token operator">&amp;&amp;</span>
      kustomize create <span class="token parameter variable">--resources</span> <span class="token string">&quot;../../../../infrastructure/sources&quot;</span> <span class="token operator">&amp;&amp;</span>
      <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
  <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Use <code>cluster-apps</code> &quot;flux kustomization&quot; definition to use <code>dependsOn</code> to wait for &quot;HelmRepositories&quot;.</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: cluster-apps
  namespace: flux-system
spec:
  dependsOn:
    - name: sources
  interval: 5m
  path: ./clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps
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
EOF</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>
    <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/&quot;</span> <span class="token operator">&amp;&amp;</span>
      kustomize create <span class="token parameter variable">--resources</span> <span class="token string">&quot;../../../../infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span>
      <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
  <span class="token punctuation">)</span>

<span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps-substitutefrom-secret.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
  kubectl create secret generic cluster-apps-substitutefrom-secret <span class="token parameter variable">-n</span> flux-system --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;AWS_ACCOUNT_ID=<span class="token variable">\${AWS_ACCOUNT_ID}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;AWS_DEFAULT_REGION=<span class="token variable">\${AWS_DEFAULT_REGION}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;AWS_KMS_KEY_ARN=<span class="token variable">\${AWS_KMS_KEY_ARN}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;CLUSTER_FQDN=<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;CLUSTER_NAME=<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;ENVIRONMENT=dev&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;LETSENCRYPT_ENVIRONMENT=staging&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;MY_COOKIE_SECRET=<span class="token variable">\${MY_COOKIE_SECRET}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;MY_EMAIL=<span class="token variable">\${MY_EMAIL}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;MY_GITHUB_ORG_NAME=<span class="token variable">\${MY_GITHUB_ORG_NAME}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID=<span class="token variable">\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET=<span class="token variable">\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;MY_GITHUB_WEBHOOK_TOKEN_BASE64=<span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token parameter variable">-n</span> <span class="token string">&quot;<span class="token variable">\${MY_GITHUB_WEBHOOK_TOKEN}</span>&quot;</span> <span class="token operator">|</span> base64 <span class="token parameter variable">--wrap</span><span class="token operator">=</span><span class="token number">0</span><span class="token variable">)</span></span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;MY_PASSWORD=<span class="token variable">\${MY_PASSWORD}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;MY_PASSWORD_BASE64=<span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token parameter variable">-n</span> <span class="token string">&quot;<span class="token variable">\${MY_PASSWORD}</span>&quot;</span> <span class="token operator">|</span> base64 <span class="token parameter variable">--wrap</span><span class="token operator">=</span><span class="token number">0</span><span class="token variable">)</span></span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;OKTA_CLIENT_ID=<span class="token variable">\${OKTA_CLIENT_ID}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;OKTA_CLIENT_SECRET=<span class="token variable">\${OKTA_CLIENT_SECRET}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;OKTA_ISSUER=<span class="token variable">\${OKTA_ISSUER}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;SLACK_CHANNEL=<span class="token variable">\${SLACK_CHANNEL}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;SLACK_INCOMING_WEBHOOK_URL_BASE64=<span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token parameter variable">-n</span> <span class="token string">&quot;<span class="token variable">\${SLACK_INCOMING_WEBHOOK_URL}</span>&quot;</span> <span class="token operator">|</span> base64 <span class="token parameter variable">--wrap</span><span class="token operator">=</span><span class="token number">0</span><span class="token variable">)</span></span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;SLACK_INCOMING_WEBHOOK_URL=<span class="token variable">\${SLACK_INCOMING_WEBHOOK_URL}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;TAGS_INLINE=<span class="token variable">\${TAGS<span class="token operator">/</span><span class="token operator">/</span> <span class="token operator">/</span><span class="token operator">,</span>}</span>&quot;</span> <span class="token punctuation">\\</span>
    <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps-substitutefrom-secret.yaml&quot;</span>
  sops <span class="token parameter variable">--encrypt</span> --in-place <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps-substitutefrom-secret.yaml&quot;</span>
<span class="token keyword">fi</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>
    <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span> <span class="token operator">&amp;&amp;</span>
      kustomize create <span class="token parameter variable">--resources</span> <span class="token string">&quot;flux-system,sources.yaml,cluster-apps-substitutefrom-secret.yaml,cluster-apps.yaml&quot;</span> <span class="token operator">&amp;&amp;</span>
      <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
  <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="create-initial-apps-dev-group-definitions" tabindex="-1"><a class="header-anchor" href="#create-initial-apps-dev-group-definitions"><span>Create initial Apps dev group definitions</span></a></h2><p>Create initial <code>kustomization.yaml</code> where all the group application will have their record:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--resources</span> <span class="token string">&quot;../sources&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="base-applications-definitions" tabindex="-1"><a class="header-anchor" href="#base-applications-definitions"><span>Base Applications definitions</span></a></h2><h3 id="amazon-elastic-block-store-ebs-csi-driver" tabindex="-1"><a class="header-anchor" href="#amazon-elastic-block-store-ebs-csi-driver"><span>Amazon Elastic Block Store (EBS) CSI driver</span></a></h3>`,41),G={href:"https://github.com/kubernetes-sigs/aws-ebs-csi-driver",target:"_blank",rel:"noopener noreferrer"},K={href:"https://github.com/kubernetes-sigs/aws-ebs-csi-driver/tree/master/charts/aws-ebs-csi-driver",target:"_blank",rel:"noopener noreferrer"},Q={href:"https://github.com/kubernetes-sigs/aws-ebs-csi-driver/blob/master/charts/aws-ebs-csi-driver/values.yaml",target:"_blank",rel:"noopener noreferrer"},B=l(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/aws-ebs-csi-driver

flux create helmrelease aws-ebs-csi-driver <span class="token punctuation">\\</span>
  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;aws-ebs-csi-driver&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/aws-ebs-csi-driver.flux-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;aws-ebs-csi-driver&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;2.6.2&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/aws-ebs-csi-driver-values&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/aws-ebs-csi-driver/aws-ebs-csi-driver-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/aws-ebs-csi-driver/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/aws-ebs-csi-driver&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/aws-ebs-csi-driver</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization&quot;</span>

flux create kustomization aws-ebs-csi-driver <span class="token punctuation">\\</span>
  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --depends-on<span class="token operator">=</span><span class="token string">&quot;external-snapshotter&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization.yaml&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: aws-ebs-csi-driver
resources:
  - gp2-non-default-class.yaml
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/aws-ebs-csi-driver
configMapGenerator:
  - name: aws-ebs-csi-driver-values
    files:
      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>aws-ebs-csi-driver-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization/aws-ebs-csi-driver-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
controller:
  serviceAccount:
    create: <span class="token boolean">false</span>
    name: ebs-csi-controller-sa
storageClasses:
- name: gp3
  annotations:
    storageclass.kubernetes.io/is-default-class: <span class="token string">&quot;true&quot;</span>
  parameters:
    encrypted: <span class="token string">&quot;true&quot;</span>
    <span class="token comment"># Not working :-(</span>
    <span class="token comment"># kmskeyid: \${AWS_KMS_KEY_ARN}</span>
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization/gp2-non-default-class.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  annotations:
    storageclass.kubernetes.io/is-default-class: <span class="token string">&quot;false&quot;</span>
  name: gp2
parameters:
  fsType: ext4
  type: gp2
provisioner: kubernetes.io/aws-ebs
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- aws-ebs-csi-driver$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource aws-ebs-csi-driver <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Change the &quot;aws-ebs-csi-driver tags&quot; on the Cluster level, because they will be different for every cluster and it needs to be &quot;set&quot; form <code>TAGS</code> bash variable:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;name: aws-ebs-csi-driver$&#39;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span>
  <span class="token function">cat</span> <span class="token operator">&gt;&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
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
                k8sTagClusterId: <span class="token variable">\${CLUSTER_FQDN}</span>
                extraVolumeTags:
                  Name: <span class="token variable">\${GITHUB_USER}</span>-\\<span class="token variable">\${CLUSTER_NAME}</span>
                  Cluster: \\<span class="token variable">\${CLUSTER_FQDN}</span>
                  <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">\${TAGS}</span>&quot;</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">&quot;s/ /<span class="token entity" title="\\\\">\\\\</span>n                  /g; s/=/: /g&quot;</span><span class="token variable">)</span></span>
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="crossplane" tabindex="-1"><a class="header-anchor" href="#crossplane"><span>Crossplane</span></a></h3>`,7),P={href:"https://crossplane.io/",target:"_blank",rel:"noopener noreferrer"},Y={href:"https://github.com/crossplane/crossplane",target:"_blank",rel:"noopener noreferrer"},W={href:"https://github.com/crossplane/crossplane/blob/770ea1cfe73068ea012a50541740fdda783da308/cluster/charts/crossplane/values.yaml",target:"_blank",rel:"noopener noreferrer"},X=l(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/crossplane

kubectl create namespace crossplane-system --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/crossplane/crossplane-namespace.yaml

flux create helmrelease crossplane <span class="token punctuation">\\</span>
  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;crossplane-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/crossplane-stable.flux-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;crossplane&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;1.5.1&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/crossplane/crossplane-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/crossplane/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/crossplane&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/crossplane</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-pv</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane&quot;</span>/crossplane-<span class="token punctuation">{</span>kustomization,kustomization-provider,kustomization-providerconfig<span class="token punctuation">}</span>

flux create kustomization crossplane <span class="token punctuation">\\</span>
  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization.yaml&quot;</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>
    <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization&quot;</span> <span class="token operator">&amp;&amp;</span>
      kustomize create <span class="token parameter variable">--resources</span> <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/crossplane <span class="token operator">&amp;&amp;</span>
      <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
  <span class="token punctuation">)</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization-provider.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: crossplane-provider
  namespace: flux-system
spec:
  dependsOn:
    - name: crossplane
  interval: 5m
  path: <span class="token string">&quot;./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization-provider&quot;</span>
  prune: <span class="token boolean">true</span>
  wait: <span class="token boolean">true</span>
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization-provider/crossplane-provider-aws.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
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

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization-provider/crossplane-controllerconfig-aws.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: pkg.crossplane.io/v1alpha1
kind: ControllerConfig
metadata:
  name: aws-config
  namespace: crossplane-system
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::<span class="token variable">\${AWS_ACCOUNT_ID}</span>:role/crossplane-provider-aws-<span class="token variable">\${CLUSTER_NAME}</span>
spec:
  podSecurityContext:
    fsGroup: <span class="token number">2000</span>
EOF

flux create kustomization crossplane-providerconfig <span class="token punctuation">\\</span>
  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --depends-on<span class="token operator">=</span><span class="token string">&quot;crossplane-provider&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization-providerconfig&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization-providerconfig.yaml&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization-providerconfig/crossplane-providerconfig-aws.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: aws.crossplane.io/v1beta1
kind: ProviderConfig
metadata:
  name: aws-provider
  namespace: crossplane-system
spec:
  credentials:
    source: InjectedIdentity
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- crossplane$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource crossplane <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="csi-snapshotter" tabindex="-1"><a class="header-anchor" href="#csi-snapshotter"><span>CSI Snapshotter</span></a></h3>`,5),j=s("code",null,"external-snapshotter",-1),Z={href:"https://aws.amazon.com/blogs/containers/using-ebs-snapshots-for-persistent-storage-with-your-eks-cluster",target:"_blank",rel:"noopener noreferrer"},J=l(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/external-snapshotter

<span class="token function">cat</span> <span class="token operator">&gt;</span> infrastructure/base/external-snapshotter/kustomization.yaml <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/v4.2.1/client/config/crd/snapshot.storage.k8s.io_volumesnapshotclasses.yaml
  - https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/v4.2.1/client/config/crd/snapshot.storage.k8s.io_volumesnapshotcontents.yaml
  - https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/v4.2.1/client/config/crd/snapshot.storage.k8s.io_volumesnapshots.yaml
  - https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/v4.2.1/deploy/kubernetes/snapshot-controller/rbac-snapshot-controller.yaml
  - https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/v4.2.1/deploy/kubernetes/snapshot-controller/setup-snapshot-controller.yaml
EOF
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/external-snapshotter</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter/external-snapshotter-kustomization&quot;</span>

flux create kustomization external-snapshotter <span class="token punctuation">\\</span>
  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter/external-snapshotter-kustomization&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter/external-snapshotter-kustomization.yaml&quot;</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter/external-snapshotter-kustomization/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>
    <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter/external-snapshotter-kustomization&quot;</span> <span class="token operator">&amp;&amp;</span>
      kustomize create <span class="token parameter variable">--resources</span> <span class="token string">&quot;../../../base/external-snapshotter&quot;</span> <span class="token operator">&amp;&amp;</span>
      <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
  <span class="token punctuation">)</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- external-snapshotter$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource external-snapshotter <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="kubernetes-metrics-server" tabindex="-1"><a class="header-anchor" href="#kubernetes-metrics-server"><span>Kubernetes Metrics Server</span></a></h3>`,5),ss={href:"https://github.com/kubernetes-sigs/metrics-server",target:"_blank",rel:"noopener noreferrer"},ns={href:"https://artifacthub.io/packages/helm/bitnami/metrics-server",target:"_blank",rel:"noopener noreferrer"},as={href:"https://github.com/bitnami/charts/blob/master/bitnami/metrics-server/values.yaml",target:"_blank",rel:"noopener noreferrer"},es=l(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/metrics-server

kubectl create namespace metrics-server --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/metrics-server/metrics-server-namespace.yaml

flux create helmrelease metrics-server <span class="token punctuation">\\</span>
  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;metrics-server&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/bitnami.flux-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;metrics-server&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;5.10.12&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/metrics-server-values&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/metrics-server/metrics-server-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/metrics-server/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/metrics-server&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/metrics-server</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/metrics-server&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/metrics-server/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/metrics-server/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: metrics-server
resources:
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/metrics-server
configMapGenerator:
  - name: metrics-server-values
    files:
      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>metrics-server-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/metrics-server/metrics-server-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiService:
  create: <span class="token boolean">true</span>
EOF

<span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- metrics-server$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource metrics-server <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="kube-prometheus-stack" tabindex="-1"><a class="header-anchor" href="#kube-prometheus-stack"><span>kube-prometheus-stack</span></a></h3>`,5),ts={href:"https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack",target:"_blank",rel:"noopener noreferrer"},is={href:"https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack",target:"_blank",rel:"noopener noreferrer"},ls={href:"https://github.com/prometheus-community/helm-charts/blob/main/charts/kube-prometheus-stack/values.yaml",target:"_blank",rel:"noopener noreferrer"},os=l(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/kube-prometheus-stack

kubectl create namespace kube-prometheus-stack --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/kube-prometheus-stack/kube-prometheus-stack-namespace.yaml

flux create helmrelease kube-prometheus-stack <span class="token punctuation">\\</span>
  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;kube-prometheus-stack&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/prometheus-community.flux-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;kube-prometheus-stack&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;27.0.0&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--crds</span><span class="token operator">=</span><span class="token string">&quot;CreateReplace&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/kube-prometheus-stack-values&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/kube-prometheus-stack/kube-prometheus-stack-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/kube-prometheus-stack/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/kube-prometheus-stack&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/kube-prometheus-stack</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kube-prometheus-stack/kube-prometheus-stack-kustomization&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kube-prometheus-stack/kube-prometheus-stack-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: kube-prometheus-stack
  namespace: flux-system
spec:
  dependsOn:
    - name: aws-ebs-csi-driver
  interval: 5m
  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kube-prometheus-stack/kube-prometheus-stack-kustomization
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

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kube-prometheus-stack/kube-prometheus-stack-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kube-prometheus-stack/kube-prometheus-stack-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: kube-prometheus-stack
resources:
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/kube-prometheus-stack
configMapGenerator:
  - name: kube-prometheus-stack-values
    files:
      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>kube-prometheus-stack-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kube-prometheus-stack/kube-prometheus-stack-kustomization/kube-prometheus-stack-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
defaultRules:
  rules:
    etcd: <span class="token boolean">false</span>
    kubernetesSystem: <span class="token boolean">false</span>
    kubeScheduler: <span class="token boolean">false</span>
additionalPrometheusRulesMap:
  <span class="token comment"># Flux rule: https://toolkit.fluxcd.io/guides/monitoring/</span>
  rule-name:
    groups:
    - name: GitOpsToolkit
      rules:
      - alert: ReconciliationFailure
        expr: max<span class="token punctuation">(</span>gotk_reconcile_condition<span class="token punctuation">{</span>status<span class="token operator">=</span><span class="token string">&quot;False&quot;</span>,type<span class="token operator">=</span><span class="token string">&quot;Ready&quot;</span><span class="token punctuation">}</span><span class="token punctuation">)</span> by <span class="token punctuation">(</span>namespace, name, kind<span class="token punctuation">)</span> + on<span class="token punctuation">(</span>namespace, name, kind<span class="token punctuation">)</span> <span class="token punctuation">(</span>max<span class="token punctuation">(</span>gotk_reconcile_condition<span class="token punctuation">{</span>status<span class="token operator">=</span><span class="token string">&quot;Deleted&quot;</span><span class="token punctuation">}</span><span class="token punctuation">)</span> by <span class="token punctuation">(</span>namespace, name, kind<span class="token punctuation">))</span> * <span class="token number">2</span> <span class="token operator">==</span> <span class="token number">1</span>
        for: 10m
        labels:
          severity: page
        annotations:
          summary: <span class="token string">&#39;{{ $labels.kind }} {{ $labels.namespace }}/{{ $labels.name }} reconciliation has been failing for more than ten minutes.&#39;</span>
alertmanager:
  config:
    global:
      slack_api_url: <span class="token variable">\${SLACK_INCOMING_WEBHOOK_URL}</span>
      smtp_smarthost: <span class="token string">&quot;mailhog.mailhog.svc.cluster.local:1025&quot;</span>
      smtp_from: <span class="token string">&quot;alertmanager@<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span>
    route:
      group_by: <span class="token punctuation">[</span><span class="token string">&quot;alertname&quot;</span>, <span class="token string">&quot;job&quot;</span><span class="token punctuation">]</span>
      receiver: slack-notifications
      routes:
        - match:
            severity: warning
          continue: <span class="token boolean">true</span>
          receiver: slack-notifications
        - match:
            severity: warning
          receiver: email-notifications
    receivers:
      - name: <span class="token string">&quot;email-notifications&quot;</span>
        email_configs:
        - to: <span class="token string">&quot;notification@<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span>
          require_tls: <span class="token boolean">false</span>
      - name: <span class="token string">&quot;slack-notifications&quot;</span>
        slack_configs:
          - channel: <span class="token string">&quot;#<span class="token variable">\${SLACK_CHANNEL}</span>&quot;</span>
            send_resolved: True
            icon_url: <span class="token string">&quot;https://avatars3.githubusercontent.com/u/3380462&quot;</span>
            title: <span class="token string">&#39;{{ template &quot;slack.cp.title&quot; . }}&#39;</span>
            text: <span class="token string">&#39;{{ template &quot;slack.cp.text&quot; . }}&#39;</span>
            footer: <span class="token string">&quot;https://<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span>
            actions:
              - type: button
                text: <span class="token string">&#39;Runbook :blue_book:&#39;</span>
                url: <span class="token string">&#39;{{ (index .Alerts 0).Annotations.runbook_url }}&#39;</span>
              - type: button
                text: <span class="token string">&#39;Query :mag:&#39;</span>
                url: <span class="token string">&#39;{{ (index .Alerts 0).GeneratorURL }}&#39;</span>
              - type: button
                text: <span class="token string">&#39;Silence :no_bell:&#39;</span>
                url: <span class="token string">&#39;{{ template &quot;__alert_silence_link&quot; . }}&#39;</span>
    templates:
      - <span class="token string">&quot;/etc/alertmanager/config/cp-slack-templates.tmpl&quot;</span>
  templateFiles:
    cp-slack-templates.tmpl: <span class="token operator">|</span>-
      <span class="token punctuation">{</span><span class="token punctuation">{</span> define <span class="token string">&quot;slack.cp.title&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span>
        <span class="token punctuation">[</span><span class="token punctuation">{</span><span class="token punctuation">{</span> .Status <span class="token operator">|</span> toUpper -<span class="token punctuation">}</span><span class="token punctuation">}</span>
        <span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token keyword">if</span> eq .Status <span class="token string">&quot;firing&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>:<span class="token punctuation">{</span><span class="token punctuation">{</span> .Alerts.Firing <span class="token operator">|</span> len <span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">{</span><span class="token punctuation">{</span>- end -<span class="token punctuation">}</span><span class="token punctuation">}</span>
        <span class="token punctuation">]</span> <span class="token punctuation">{</span><span class="token punctuation">{</span> template <span class="token string">&quot;__alert_severity_prefix_title&quot;</span> <span class="token builtin class-name">.</span> <span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">{</span><span class="token punctuation">{</span> .CommonLabels.alertname <span class="token punctuation">}</span><span class="token punctuation">}</span>
      <span class="token punctuation">{</span><span class="token punctuation">{</span>- end <span class="token punctuation">}</span><span class="token punctuation">}</span>
      <span class="token punctuation">{</span><span class="token punctuation">{</span>/* The <span class="token builtin class-name">test</span> to display <span class="token keyword">in</span> the alert */<span class="token punctuation">}</span><span class="token punctuation">}</span>
      <span class="token punctuation">{</span><span class="token punctuation">{</span> define <span class="token string">&quot;slack.cp.text&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span>
        <span class="token punctuation">{</span><span class="token punctuation">{</span> range .Alerts <span class="token punctuation">}</span><span class="token punctuation">}</span>
            *Alert:* <span class="token punctuation">{</span><span class="token punctuation">{</span> .Annotations.message<span class="token punctuation">}</span><span class="token punctuation">}</span>
            *Details:*
            <span class="token punctuation">{</span><span class="token punctuation">{</span> range .Labels.SortedPairs <span class="token punctuation">}</span><span class="token punctuation">}</span> - *<span class="token punctuation">{</span><span class="token punctuation">{</span> .Name <span class="token punctuation">}</span><span class="token punctuation">}</span>:* <span class="token variable"><span class="token variable">\`</span><span class="token punctuation">{</span><span class="token punctuation">{</span> .Value <span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token variable">\`</span></span>
            <span class="token punctuation">{</span><span class="token punctuation">{</span> end <span class="token punctuation">}</span><span class="token punctuation">}</span>
            *-----*
          <span class="token punctuation">{</span><span class="token punctuation">{</span> end <span class="token punctuation">}</span><span class="token punctuation">}</span>
      <span class="token punctuation">{</span><span class="token punctuation">{</span>- end <span class="token punctuation">}</span><span class="token punctuation">}</span>
      <span class="token punctuation">{</span><span class="token punctuation">{</span> define <span class="token string">&quot;__alert_silence_link&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span>
        <span class="token punctuation">{</span><span class="token punctuation">{</span> .ExternalURL <span class="token punctuation">}</span><span class="token punctuation">}</span>/<span class="token comment">#/silences/new?filter=%7B</span>
        <span class="token punctuation">{</span><span class="token punctuation">{</span>- range .CommonLabels.SortedPairs -<span class="token punctuation">}</span><span class="token punctuation">}</span>
          <span class="token punctuation">{</span><span class="token punctuation">{</span>- <span class="token keyword">if</span> ne .Name <span class="token string">&quot;alertname&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span>
            <span class="token punctuation">{</span><span class="token punctuation">{</span>- .Name <span class="token punctuation">}</span><span class="token punctuation">}</span>%3D<span class="token string">&quot;{{- .Value -}}&quot;</span>%2C%20
          <span class="token punctuation">{</span><span class="token punctuation">{</span>- end -<span class="token punctuation">}</span><span class="token punctuation">}</span>
        <span class="token punctuation">{</span><span class="token punctuation">{</span>- end -<span class="token punctuation">}</span><span class="token punctuation">}</span>
          alertname%3D<span class="token string">&quot;{{ .CommonLabels.alertname }}&quot;</span>%7D
      <span class="token punctuation">{</span><span class="token punctuation">{</span>- end <span class="token punctuation">}</span><span class="token punctuation">}</span>
      <span class="token punctuation">{</span><span class="token punctuation">{</span> define <span class="token string">&quot;__alert_severity_prefix&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span>
          <span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token keyword">if</span> ne .Status <span class="token string">&quot;firing&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span>
          :white_check_mark:
          <span class="token punctuation">{</span><span class="token punctuation">{</span>- <span class="token keyword">else</span> <span class="token keyword">if</span> eq .Labels.severity <span class="token string">&quot;critical&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span>
          :fire:
          <span class="token punctuation">{</span><span class="token punctuation">{</span>- <span class="token keyword">else</span> <span class="token keyword">if</span> eq .Labels.severity <span class="token string">&quot;warning&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span>
          :warning:
          <span class="token punctuation">{</span><span class="token punctuation">{</span>- <span class="token keyword">else</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span>
          :question:
          <span class="token punctuation">{</span><span class="token punctuation">{</span>- end <span class="token punctuation">}</span><span class="token punctuation">}</span>
      <span class="token punctuation">{</span><span class="token punctuation">{</span>- end <span class="token punctuation">}</span><span class="token punctuation">}</span>
      <span class="token punctuation">{</span><span class="token punctuation">{</span> define <span class="token string">&quot;__alert_severity_prefix_title&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span>
          <span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token keyword">if</span> ne .Status <span class="token string">&quot;firing&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span>
          :white_check_mark:
          <span class="token punctuation">{</span><span class="token punctuation">{</span>- <span class="token keyword">else</span> <span class="token keyword">if</span> eq .CommonLabels.severity <span class="token string">&quot;critical&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span>
          :fire:
          <span class="token punctuation">{</span><span class="token punctuation">{</span>- <span class="token keyword">else</span> <span class="token keyword">if</span> eq .CommonLabels.severity <span class="token string">&quot;warning&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span>
          :warning:
          <span class="token punctuation">{</span><span class="token punctuation">{</span>- <span class="token keyword">else</span> <span class="token keyword">if</span> eq .CommonLabels.severity <span class="token string">&quot;info&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span>
          :information_source:
          <span class="token punctuation">{</span><span class="token punctuation">{</span>- <span class="token keyword">else</span> <span class="token keyword">if</span> eq .CommonLabels.status_icon <span class="token string">&quot;information&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span>
          :information_source:
          <span class="token punctuation">{</span><span class="token punctuation">{</span>- <span class="token keyword">else</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span>
          :question:
          <span class="token punctuation">{</span><span class="token punctuation">{</span>- end <span class="token punctuation">}</span><span class="token punctuation">}</span>
      <span class="token punctuation">{</span><span class="token punctuation">{</span>- end <span class="token punctuation">}</span><span class="token punctuation">}</span>
  ingress:
    enabled: <span class="token boolean">true</span>
    ingressClassName: nginx
    annotations:
      nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth
      nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd<span class="token operator">=</span><span class="token variable">$scheme</span>://<span class="token variable">$host</span><span class="token variable">$request_uri</span>
    hosts:
      - alertmanager.<span class="token variable">\${CLUSTER_FQDN}</span>
    paths: <span class="token punctuation">[</span><span class="token string">&quot;/&quot;</span><span class="token punctuation">]</span>
    pathType: ImplementationSpecific
    tls:
      - hosts:
        - alertmanager.<span class="token variable">\${CLUSTER_FQDN}</span>
<span class="token comment"># https://github.com/grafana/helm-charts/blob/main/charts/grafana/values.yaml</span>
grafana:
  ingress:
    enabled: <span class="token boolean">true</span>
    ingressClassName: nginx
    annotations:
      nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth
      nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd<span class="token operator">=</span><span class="token variable">$scheme</span>://<span class="token variable">$host</span><span class="token variable">$request_uri</span>
    hosts:
      - grafana.<span class="token variable">\${CLUSTER_FQDN}</span>
    paths: <span class="token punctuation">[</span><span class="token string">&quot;/&quot;</span><span class="token punctuation">]</span>
    pathType: ImplementationSpecific
    tls:
      - hosts:
        - grafana.<span class="token variable">\${CLUSTER_FQDN}</span>
  dashboardProviders:
    dashboardproviders.yaml:
      apiVersion: <span class="token number">1</span>
      providers:
        - name: <span class="token string">&quot;default&quot;</span>
          orgId: <span class="token number">1</span>
          folder: <span class="token string">&quot;&quot;</span>
          type: <span class="token function">file</span>
          disableDeletion: <span class="token boolean">false</span>
          editable: <span class="token boolean">true</span>
          options:
            path: /var/lib/grafana/dashboards/default
  dashboards:
    default:
      k8s-cluster-summary:
        gnetId: <span class="token number">8685</span>
        revision: <span class="token number">1</span>
        datasource: Prometheus
      node-exporter-full:
        gnetId: <span class="token number">1860</span>
        revision: <span class="token number">24</span>
        datasource: Prometheus
      prometheus-2-0-overview:
        gnetId: <span class="token number">3662</span>
        revision: <span class="token number">2</span>
        datasource: Prometheus
      stians-disk-graphs:
        gnetId: <span class="token number">9852</span>
        revision: <span class="token number">1</span>
        datasource: Prometheus
      kubernetes-apiserver:
        gnetId: <span class="token number">12006</span>
        revision: <span class="token number">1</span>
        datasource: Prometheus
      ingress-nginx:
        gnetId: <span class="token number">9614</span>
        revision: <span class="token number">1</span>
        datasource: Prometheus
      ingress-nginx2:
        gnetId: <span class="token number">11875</span>
        revision: <span class="token number">1</span>
        datasource: Prometheus
      istio-mesh:
        gnetId: <span class="token number">7639</span>
        revision: <span class="token number">101</span>
        datasource: Prometheus
      istio-performance:
        gnetId: <span class="token number">11829</span>
        revision: <span class="token number">101</span>
        datasource: Prometheus
      istio-service:
        gnetId: <span class="token number">7636</span>
        revision: <span class="token number">101</span>
        datasource: Prometheus
      istio-workload:
        gnetId: <span class="token number">7630</span>
        revision: <span class="token number">101</span>
        datasource: Prometheus
      istio-control-plane:
        gnetId: <span class="token number">7645</span>
        revision: <span class="token number">101</span>
        datasource: Prometheus
      jaeger:
        gnetId: <span class="token number">10001</span>
        revision: <span class="token number">2</span>
        datasource: Prometheus
      <span class="token comment"># https://github.com/fluxcd/flux2/blob/main/manifests/monitoring/grafana/dashboards/cluster.json</span>
      gitops-toolkit-control-plane:
        url: https://raw.githubusercontent.com/fluxcd/flux2/c98cd106218b0fdead155bd9a0b0a5666e5c3e15/manifests/monitoring/grafana/dashboards/control-plane.json
        datasource: Prometheus
      gitops-toolkit-cluster:
        url: https://raw.githubusercontent.com/fluxcd/flux2/80cf5fa7291242f87458a426fccb57abfd8c66ee/manifests/monitoring/grafana/dashboards/cluster.json
        datasource: Prometheus
      kyverno-policy-report:
        gnetId: <span class="token number">13995</span>
        revision: <span class="token number">4</span>
        datasource: Prometheus
      kyverno-policy-reports:
        gnetId: <span class="token number">13968</span>
        revision: <span class="token number">2</span>
        datasource: Prometheus
      external-dns:
        gnetId: <span class="token number">15038</span>
        revision: <span class="token number">1</span>
        datasource: Prometheus
      kubernetes-monitor:
        gnetId: <span class="token number">15398</span>
        revision: <span class="token number">5</span>
        datasource: Prometheus
      cluster-autoscaler-stats:
        gnetId: <span class="token number">12623</span>
        revision: <span class="token number">1</span>
        datasource: Prometheus
      kubernetes-addons-velero-stats:
        gnetId: <span class="token number">11055</span>
        revision: <span class="token number">2</span>
        datasource: Prometheus
  grafana.ini:
    server:
      root_url: https://grafana.<span class="token variable">\${CLUSTER_FQDN}</span>
    <span class="token comment"># Using oauth2-proxy instead of default Grafana Oauth</span>
    auth.anonymous:
      enabled: <span class="token boolean">true</span>
      org_role: Admin
  smtp:
    enabled: <span class="token boolean">true</span>
    host: <span class="token string">&quot;mailhog.mailhog.svc.cluster.local:1025&quot;</span>
    from_address: grafana@<span class="token variable">\${CLUSTER_FQDN}</span>
kubeControllerManager:
  enabled: <span class="token boolean">false</span>
kubeEtcd:
  enabled: <span class="token boolean">false</span>
kubeScheduler:
  enabled: <span class="token boolean">false</span>
kubeProxy:
  enabled: <span class="token boolean">false</span>
prometheusOperator:
  tls:
    enabled: <span class="token boolean">false</span>
  admissionWebhooks:
    enabled: <span class="token boolean">false</span>
prometheus:
  ingress:
    enabled: <span class="token boolean">true</span>
    ingressClassName: nginx
    annotations:
      nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth
      nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd<span class="token operator">=</span><span class="token variable">$scheme</span>://<span class="token variable">$host</span><span class="token variable">$request_uri</span>
    paths: <span class="token punctuation">[</span><span class="token string">&quot;/&quot;</span><span class="token punctuation">]</span>
    pathType: ImplementationSpecific
    hosts:
      - prometheus.<span class="token variable">\${CLUSTER_FQDN}</span>
    tls:
      - hosts:
        - prometheus.<span class="token variable">\${CLUSTER_FQDN}</span>
  prometheusSpec:
    externalLabels:
      cluster: <span class="token variable">\${CLUSTER_FQDN}</span>
    externalUrl: https://prometheus.<span class="token variable">\${CLUSTER_FQDN}</span>
    ruleSelectorNilUsesHelmValues: <span class="token boolean">false</span>
    serviceMonitorSelectorNilUsesHelmValues: <span class="token boolean">false</span>
    podMonitorSelectorNilUsesHelmValues: <span class="token boolean">false</span>
    retention: 7d
    retentionSize: 1GB
    walCompression: <span class="token boolean">true</span>
    externalLabels:
      cluster: <span class="token string">&quot;<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span>
    storageSpec:
      volumeClaimTemplate:
        spec:
          storageClassName: gp3
          accessModes: <span class="token punctuation">[</span><span class="token string">&quot;ReadWriteOnce&quot;</span><span class="token punctuation">]</span>
          resources:
            requests:
              storage: 2Gi
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kube-prometheus-stack/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kube-prometheus-stack&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- kube-prometheus-stack$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource kube-prometheus-stack <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="cert-manager" tabindex="-1"><a class="header-anchor" href="#cert-manager"><span>cert-manager</span></a></h3>`,5),rs={href:"https://cert-manager.io/",target:"_blank",rel:"noopener noreferrer"},ps={href:"https://artifacthub.io/packages/helm/jetstack/cert-manager",target:"_blank",rel:"noopener noreferrer"},cs={href:"https://github.com/jetstack/cert-manager/blob/master/deploy/charts/cert-manager/values.yaml",target:"_blank",rel:"noopener noreferrer"},us=l(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/cert-manager

flux create helmrelease cert-manager <span class="token punctuation">\\</span>
  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;cert-manager&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/jetstack.flux-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;cert-manager&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;v1.6.1&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/cert-manager-values&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/cert-manager/cert-manager-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/cert-manager/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/cert-manager&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/cert-manager</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager&quot;</span>/cert-manager-<span class="token punctuation">{</span>kustomization,kustomization-clusterissuer,kustomization-certificate<span class="token punctuation">}</span>

flux create kustomization cert-manager <span class="token punctuation">\\</span>
  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --depends-on<span class="token operator">=</span><span class="token string">&quot;kube-prometheus-stack&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization.yaml&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: cert-manager
resources:
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/cert-manager
configMapGenerator:
  - name: cert-manager-values
    files:
      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>cert-manager-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization/cert-manager-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
installCRDs: <span class="token boolean">true</span>
serviceAccount:
  create: <span class="token boolean">false</span>
  name: cert-manager
extraArgs:
  - --cluster-resource-namespace<span class="token operator">=</span>cert-manager
  - --enable-certificate-owner-ref<span class="token operator">=</span>true
prometheus:
  servicemonitor:
    enabled: <span class="token boolean">true</span>
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization-clusterissuer.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: cert-manager-clusterissuer
  namespace: flux-system
spec:
  dependsOn:
    - name: cert-manager
  interval: 5m
  path: <span class="token string">&quot;./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization-clusterissuer&quot;</span>
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

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization-clusterissuer/cert-manager-clusterissuer-letsencrypt-staging-dns.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging-dns
  namespace: cert-manager
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: <span class="token variable">\${MY_EMAIL}</span>
    privateKeySecretRef:
      name: letsencrypt-staging-dns
    solvers:
      - selector:
          dnsZones:
            - <span class="token variable">\${CLUSTER_FQDN}</span>
        dns01:
          route53:
            region: <span class="token variable">\${AWS_DEFAULT_REGION}</span>
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization-clusterissuer/cert-manager-clusterissuer-letsencrypt-production-dns.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-production-dns
  namespace: cert-manager
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: <span class="token variable">\${MY_EMAIL}</span>
    privateKeySecretRef:
      name: letsencrypt-production-dns
    solvers:
      - selector:
          dnsZones:
            - <span class="token variable">\${CLUSTER_FQDN}</span>
        dns01:
          route53:
            region: <span class="token variable">\${AWS_DEFAULT_REGION}</span>
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization-certificate.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: cert-manager-certificate
  namespace: flux-system
spec:
  dependsOn:
    - name: cert-manager-clusterissuer
  interval: 5m
  path: <span class="token string">&quot;./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization-certificate&quot;</span>
  prune: <span class="token boolean">true</span>
  sourceRef:
    kind: GitRepository
    name: flux-system
    namespace: flux-system
  wait: <span class="token boolean">true</span>
  timeout: 10m
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization-certificate/cert-manager-certificate.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: ingress-cert-<span class="token variable">\${LETSENCRYPT_ENVIRONMENT}</span>
  namespace: cert-manager
spec:
  secretName: ingress-cert-<span class="token variable">\${LETSENCRYPT_ENVIRONMENT}</span>
  secretTemplate:
    annotations:
      kubed.appscode.com/sync: cert-manager-cert-<span class="token variable">\${LETSENCRYPT_ENVIRONMENT}</span><span class="token operator">=</span>copy
  issuerRef:
    name: letsencrypt-<span class="token variable">\${LETSENCRYPT_ENVIRONMENT}</span>-dns
    kind: ClusterIssuer
  commonName: <span class="token string">&quot;*.<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span>
  dnsNames:
    - <span class="token string">&quot;*.<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span>
    - <span class="token string">&quot;<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span>
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- cert-manager$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource cert-manager <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="cluster-autoscaler" tabindex="-1"><a class="header-anchor" href="#cluster-autoscaler"><span>cluster-autoscaler</span></a></h3>`,5),ds={href:"https://github.com/kubernetes/autoscaler",target:"_blank",rel:"noopener noreferrer"},vs={href:"https://artifacthub.io/packages/helm/cluster-autoscaler/cluster-autoscaler",target:"_blank",rel:"noopener noreferrer"},ms={href:"https://github.com/kubernetes/autoscaler/blob/master/charts/cluster-autoscaler/values.yaml",target:"_blank",rel:"noopener noreferrer"},ks=l(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/cluster-autoscaler

flux create helmrelease cluster-autoscaler <span class="token punctuation">\\</span>
  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;cluster-autoscaler&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/autoscaler.flux-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;cluster-autoscaler&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;9.11.0&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/cluster-autoscaler-values&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/cluster-autoscaler/cluster-autoscaler-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/cluster-autoscaler/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/cluster-autoscaler&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/cluster-autoscaler</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cluster-autoscaler/cluster-autoscaler-kustomization&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cluster-autoscaler/cluster-autoscaler-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: cluster-autoscaler
  namespace: flux-system
spec:
  dependsOn:
    - name: kube-prometheus-stack
  interval: 5m
  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cluster-autoscaler/cluster-autoscaler-kustomization
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

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cluster-autoscaler/cluster-autoscaler-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cluster-autoscaler/cluster-autoscaler-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: cluster-autoscaler
resources:
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/cluster-autoscaler
configMapGenerator:
  - name: cluster-autoscaler-values
    files:
      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>cluster-autoscaler-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cluster-autoscaler/cluster-autoscaler-kustomization/cluster-autoscaler-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
autoDiscovery:
  clusterName: <span class="token variable">\${CLUSTER_NAME}</span>
awsRegion: <span class="token variable">\${AWS_DEFAULT_REGION}</span>
<span class="token comment"># Required to fix IMDSv2 issue: https://github.com/kubernetes/autoscaler/issues/3592</span>
extraArgs:
  aws-use-static-instance-list: <span class="token boolean">true</span>
rbac:
  serviceAccount:
    create: <span class="token boolean">false</span>
    name: cluster-autoscaler
serviceMonitor:
  enabled: <span class="token boolean">true</span>
  namespace: kube-prometheus-stack
prometheusRule:
  enabled: <span class="token boolean">true</span>
  namespace: kube-prometheus-stack
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cluster-autoscaler/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cluster-autoscaler&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- cluster-autoscaler$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource cluster-autoscaler <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="dex" tabindex="-1"><a class="header-anchor" href="#dex"><span>Dex</span></a></h3>`,5),bs={href:"https://dexidp.io/",target:"_blank",rel:"noopener noreferrer"},gs={href:"https://artifacthub.io/packages/helm/dex/dex",target:"_blank",rel:"noopener noreferrer"},fs={href:"https://github.com/dexidp/helm-charts/blob/master/charts/dex/values.yaml",target:"_blank",rel:"noopener noreferrer"},hs=l(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/dex

kubectl create namespace dex --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/dex/dex-namespace.yaml

flux create helmrelease dex <span class="token punctuation">\\</span>
  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;dex&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/dex.flux-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;dex&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;0.6.3&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/dex-values&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/dex/dex-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/dex/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/dex&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/dex</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/dex&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/dex/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/dex/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: dex
resources:
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/dex
configMapGenerator:
  - name: dex-values
    files:
      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>dex-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/dex/dex-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
ingress:
  enabled: <span class="token boolean">true</span>
  className: nginx
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: <span class="token string">&quot;false&quot;</span>
  hosts:
    - host: dex.<span class="token variable">\${CLUSTER_FQDN}</span>
      paths:
        - path: /
          pathType: ImplementationSpecific
  tls:
    - hosts:
      - dex.<span class="token variable">\${CLUSTER_FQDN}</span>
config:
  issuer: https://dex.<span class="token variable">\${CLUSTER_FQDN}</span>
  storage:
    type: kubernetes
    config:
      inCluster: <span class="token boolean">true</span>
  oauth2:
    skipApprovalScreen: <span class="token boolean">true</span>
  connectors:
    - type: github
      id: github
      name: GitHub
      config:
        clientID: <span class="token variable">\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID}</span>
        clientSecret: <span class="token variable">\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET}</span>
        redirectURI: https://dex.<span class="token variable">\${CLUSTER_FQDN}</span>/callback
        orgs:
          - name: <span class="token variable">\${MY_GITHUB_ORG_NAME}</span>
    - type: oidc
      id: okta
      name: Okta
      config:
        issuer: <span class="token variable">\${OKTA_ISSUER}</span>
        clientID: <span class="token variable">\${OKTA_CLIENT_ID}</span>
        clientSecret: <span class="token variable">\${OKTA_CLIENT_SECRET}</span>
        redirectURI: https://dex.<span class="token variable">\${CLUSTER_FQDN}</span>/callback
        scopes:
          - openid
          - profile
          - email
        getUserInfo: <span class="token boolean">true</span>
  staticClients:
    - id: kiali.<span class="token variable">\${CLUSTER_FQDN}</span>
      redirectURIs:
        - https://kiali.<span class="token variable">\${CLUSTER_FQDN}</span>
      name: Kiali
      secret: <span class="token variable">\${MY_PASSWORD}</span>
    - id: oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>
      redirectURIs:
        - https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/callback
      name: OAuth2 Proxy
      secret: <span class="token variable">\${MY_PASSWORD}</span>
  enablePasswordDB: <span class="token boolean">false</span>
EOF

<span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- dex$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource dex <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="externaldns" tabindex="-1"><a class="header-anchor" href="#externaldns"><span>ExternalDNS</span></a></h3>`,5),qs={href:"https://github.com/kubernetes-sigs/external-dns",target:"_blank",rel:"noopener noreferrer"},Es={href:"https://artifacthub.io/packages/helm/bitnami/external-dns",target:"_blank",rel:"noopener noreferrer"},Ns={href:"https://github.com/bitnami/charts/blob/master/bitnami/external-dns/values.yaml",target:"_blank",rel:"noopener noreferrer"},ys=l(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/external-dns

flux create helmrelease external-dns <span class="token punctuation">\\</span>
  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;external-dns&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/bitnami.flux-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;external-dns&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;6.0.2&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/external-dns-values&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/external-dns/external-dns-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/external-dns/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/external-dns&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/external-dns</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-dns/external-dns-kustomization&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-dns/external-dns-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
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
  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-dns/external-dns-kustomization
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

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-dns/external-dns-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-dns/external-dns-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: external-dns
resources:
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/external-dns
configMapGenerator:
  - name: external-dns-values
    files:
      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>external-dns-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-dns/external-dns-kustomization/external-dns-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
aws:
  region: <span class="token variable">\${AWS_DEFAULT_REGION}</span>
domainFilters:
  - <span class="token variable">\${CLUSTER_FQDN}</span>
interval: 20s
policy: <span class="token function">sync</span>
serviceAccount:
  create: <span class="token boolean">false</span>
  name: external-dns
metrics:
  enabled: <span class="token boolean">true</span>
  serviceMonitor:
    enabled: <span class="token boolean">true</span>
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-dns/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-dns&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- external-dns$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource external-dns <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="flux-provides-alerts-receivers-and-monitoring" tabindex="-1"><a class="header-anchor" href="#flux-provides-alerts-receivers-and-monitoring"><span>Flux provides, alerts, receivers and monitoring</span></a></h3>`,5),xs={href:"https://fluxcd.io/",target:"_blank",rel:"noopener noreferrer"},_s=l(`<div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux&quot;</span>/flux-<span class="token punctuation">{</span>kustomization-provider,kustomization-alert,kustomization-receiver,kustomization-podmonitor<span class="token punctuation">}</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-provider.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: flux-provider
  namespace: flux-system
spec:
  interval: 5m
  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-provider
  prune: <span class="token boolean">true</span>
  sourceRef:
    kind: GitRepository
    name: flux-system
  wait: <span class="token boolean">true</span>
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

flux create alert-provider slack <span class="token punctuation">\\</span>
  <span class="token parameter variable">--type</span><span class="token operator">=</span>slack <span class="token punctuation">\\</span>
  <span class="token parameter variable">--channel</span><span class="token operator">=</span><span class="token string">&quot;\\<span class="token variable">\${SLACK_CHANNEL}</span>&quot;</span> <span class="token punctuation">\\</span>
  --secret-ref<span class="token operator">=</span>slack-url <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-provider/flux-provider-slack.yaml&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-provider/flux-provider-slack-url-secret.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: v1
kind: Secret
metadata:
  name: slack-url
  namespace: flux-system
data:
  address: <span class="token variable">\${SLACK_INCOMING_WEBHOOK_URL_BASE64}</span>
EOF

flux create kustomization flux-alert <span class="token punctuation">\\</span>
  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --depends-on<span class="token operator">=</span><span class="token string">&quot;flux-provider&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-alert&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-alert.yaml&quot;</span>

flux create alert alert-slack <span class="token punctuation">\\</span>
  --event-severity<span class="token operator">=</span>error <span class="token punctuation">\\</span>
  --event-source<span class="token operator">=</span><span class="token string">&quot;GitRepository/*,Kustomization/*,HelmRepository/*,HelmChart/*,HelmRelease/*&quot;</span> <span class="token punctuation">\\</span>
  --provider-ref<span class="token operator">=</span>slack <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-alert/flux-alert-slack.yaml&quot;</span>

flux create kustomization flux-podmonitor <span class="token punctuation">\\</span>
  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --depends-on<span class="token operator">=</span><span class="token string">&quot;kube-prometheus-stack&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-podmonitor&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-podmonitor.yaml&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-podmonitor/flux-podmonitor.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
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

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-receiver.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: flux-receiver
  namespace: flux-system
spec:
  <span class="token comment"># Dependency is required to prevent errors like:</span>
  <span class="token comment"># Ingress/flux-system/flux-github-receiver dry-run failed, reason: InternalError, error: Internal error occurred: failed calling webhook &quot;validate.nginx.ingress.kubernetes.io&quot;: Post &quot;https://ingress-nginx-controller-admission.ingress-nginx.svc:443/networking/v1/ingresses?timeout=10s&quot;: x509: certificate signed by unknown authority</span>
  dependsOn:
    - name: ingress-nginx
  interval: 5m
  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-receiver
  prune: <span class="token boolean">true</span>
  sourceRef:
    kind: GitRepository
    name: flux-system
  wait: <span class="token boolean">true</span>
  postBuild:
    substituteFrom:
    - kind: Secret
      name: cluster-apps-substitutefrom-secret
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-receiver/flux-receiver-github-webhook-token-secret.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: v1
kind: Secret
metadata:
  name: github-webhook-token
  namespace: flux-system
data:
  token: <span class="token variable">\${MY_GITHUB_WEBHOOK_TOKEN_BASE64}</span>
EOF

flux create receiver github-receiver <span class="token punctuation">\\</span>
  <span class="token parameter variable">--type</span><span class="token operator">=</span>github <span class="token punctuation">\\</span>
  <span class="token parameter variable">--event</span><span class="token operator">=</span>ping <span class="token parameter variable">--event</span><span class="token operator">=</span>push <span class="token punctuation">\\</span>
  --secret-ref<span class="token operator">=</span>github-webhook-token <span class="token punctuation">\\</span>
  <span class="token parameter variable">--resource</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-receiver/flux-receiver-github.yaml&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-receiver/flux-receiver-github-ingress.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: flux-github-receiver
  namespace: flux-system
spec:
  ingressClassName: nginx
  rules:
  - host: flux-receiver.<span class="token variable">\${CLUSTER_FQDN}</span>
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
    - flux-receiver.<span class="token variable">\${CLUSTER_FQDN}</span>
EOF</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- flux$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource flux <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="ingress-nginx" tabindex="-1"><a class="header-anchor" href="#ingress-nginx"><span>ingress-nginx</span></a></h3>`,2),Rs={href:"https://kubernetes.github.io/ingress-nginx/",target:"_blank",rel:"noopener noreferrer"},Os={href:"https://artifacthub.io/packages/helm/ingress-nginx/ingress-nginx",target:"_blank",rel:"noopener noreferrer"},Ts={href:"https://github.com/kubernetes/ingress-nginx/blob/master/charts/ingress-nginx/values.yaml",target:"_blank",rel:"noopener noreferrer"},$s=l(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/ingress-nginx

kubectl create namespace ingress-nginx --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/ingress-nginx/ingress-nginx-namespace.yaml

flux create helmrelease ingress-nginx <span class="token punctuation">\\</span>
  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;ingress-nginx&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/ingress-nginx.flux-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;ingress-nginx&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;4.0.13&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/ingress-nginx-values&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/ingress-nginx/ingress-nginx-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/ingress-nginx/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/ingress-nginx&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/ingress-nginx</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/ingress-nginx/ingress-nginx-kustomization&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/ingress-nginx/ingress-nginx-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
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
  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/ingress-nginx/ingress-nginx-kustomization
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

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/ingress-nginx/ingress-nginx-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/ingress-nginx/ingress-nginx-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: ingress-nginx
resources:
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/ingress-nginx
configMapGenerator:
  - name: ingress-nginx-values
    files:
      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>ingress-nginx-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/ingress-nginx/ingress-nginx-kustomization/ingress-nginx-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
controller:
  ingressClassResource:
    default: <span class="token boolean">true</span>
  extraArgs:
    default-ssl-certificate: <span class="token string">&quot;cert-manager/ingress-cert-<span class="token variable">\${LETSENCRYPT_ENVIRONMENT}</span>&quot;</span>
  service:
    annotations:
      service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp
      service.beta.kubernetes.io/aws-load-balancer-type: nlb
      service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: <span class="token string">&quot;<span class="token variable">\${TAGS_INLINE}</span>&quot;</span>
  metrics:
    enabled: <span class="token boolean">true</span>
    serviceMonitor:
      enabled: <span class="token boolean">true</span>
    prometheusRule:
      enabled: <span class="token boolean">true</span>
      rules:
        - alert: NGINXConfigFailed
          expr: count<span class="token punctuation">(</span>nginx_ingress_controller_config_last_reload_successful <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token number">0</span>
          for: 1s
          labels:
            severity: critical
          annotations:
            description: bad ingress config - nginx config <span class="token builtin class-name">test</span> failed
            summary: uninstall the latest ingress changes to allow config reloads to resume
        - alert: NGINXCertificateExpiry
          expr: <span class="token punctuation">(</span>avg<span class="token punctuation">(</span>nginx_ingress_controller_ssl_expire_time_seconds<span class="token punctuation">)</span> by <span class="token punctuation">(</span>host<span class="token punctuation">)</span> - time<span class="token punctuation">(</span><span class="token punctuation">))</span> <span class="token operator">&lt;</span> <span class="token number">604800</span>
          for: 1s
          labels:
            severity: critical
          annotations:
            description: ssl certificate<span class="token punctuation">(</span>s<span class="token punctuation">)</span> will expire <span class="token keyword">in</span> <span class="token function">less</span> <span class="token keyword">then</span> a week
            summary: renew expiring certificates to avoid downtime
        - alert: NGINXTooMany500s
          expr: <span class="token number">100</span> * <span class="token punctuation">(</span> sum<span class="token punctuation">(</span> nginx_ingress_controller_requests<span class="token punctuation">{</span>status<span class="token operator">=~</span><span class="token string">&quot;5.+&quot;</span><span class="token punctuation">}</span> <span class="token punctuation">)</span> / sum<span class="token punctuation">(</span>nginx_ingress_controller_requests<span class="token punctuation">)</span> <span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token number">5</span>
          for: 1m
          labels:
            severity: warning
          annotations:
            description: Too many 5XXs
            summary: More than <span class="token number">5</span>% of all requests returned 5XX, this requires your attention
        - alert: NGINXTooMany400s
          expr: <span class="token number">100</span> * <span class="token punctuation">(</span> sum<span class="token punctuation">(</span> nginx_ingress_controller_requests<span class="token punctuation">{</span>status<span class="token operator">=~</span><span class="token string">&quot;4.+&quot;</span><span class="token punctuation">}</span> <span class="token punctuation">)</span> / sum<span class="token punctuation">(</span>nginx_ingress_controller_requests<span class="token punctuation">)</span> <span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token number">5</span>
          for: 1m
          labels:
            severity: warning
          annotations:
            description: Too many 4XXs
            summary: More than <span class="token number">5</span>% of all requests returned 4XX, this requires your attention
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/ingress-nginx/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/ingress-nginx&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- ingress-nginx$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource ingress-nginx <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="mailhog" tabindex="-1"><a class="header-anchor" href="#mailhog"><span>MailHog</span></a></h3>`,5),zs={href:"https://github.com/mailhog/MailHog",target:"_blank",rel:"noopener noreferrer"},Is={href:"https://artifacthub.io/packages/helm/codecentric/mailhog",target:"_blank",rel:"noopener noreferrer"},Ms={href:"https://github.com/codecentric/helm-charts/blob/master/charts/mailhog/values.yaml",target:"_blank",rel:"noopener noreferrer"},Ss=l(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/mailhog

kubectl create namespace mailhog --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/mailhog/mailhog-namespace.yaml

flux create helmrelease mailhog <span class="token punctuation">\\</span>
  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;mailhog&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/codecentric.flux-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;mailhog&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;5.0.2&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/mailhog-values&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/mailhog/mailhog-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/mailhog/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/mailhog&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/mailhog</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/mailhog&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/mailhog/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/mailhog/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: mailhog
resources:
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/mailhog
configMapGenerator:
  - name: mailhog-values
    files:
      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>mailhog-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/mailhog/mailhog-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
ingress:
  enabled: <span class="token boolean">true</span>
  ingressClassName: nginx
  annotations:
    nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth
    nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd<span class="token operator">=</span><span class="token variable">$scheme</span>://<span class="token variable">$host</span><span class="token variable">$request_uri</span>
  hosts:
    - host: mailhog.<span class="token variable">\${CLUSTER_FQDN}</span>
      paths:
        - path: <span class="token string">&quot;/&quot;</span>
          pathType: Prefix
  tls:
    - hosts:
      - mailhog.<span class="token variable">\${CLUSTER_FQDN}</span>
EOF

<span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- mailhog$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource mailhog <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="oauth2-proxy" tabindex="-1"><a class="header-anchor" href="#oauth2-proxy"><span>OAuth2 Proxy</span></a></h3>`,5),Fs={href:"https://oauth2-proxy.github.io/oauth2-proxy/",target:"_blank",rel:"noopener noreferrer"},Cs={href:"https://artifacthub.io/packages/helm/oauth2-proxy/oauth2-proxy",target:"_blank",rel:"noopener noreferrer"},Vs={href:"https://github.com/oauth2-proxy/manifests/blob/main/helm/oauth2-proxy/values.yaml",target:"_blank",rel:"noopener noreferrer"},ws=l(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/oauth2-proxy

kubectl create namespace oauth2-proxy --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/oauth2-proxy/oauth2-proxy-namespace.yaml

flux create helmrelease oauth2-proxy <span class="token punctuation">\\</span>
  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;oauth2-proxy&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/oauth2-proxy.flux-system&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;oauth2-proxy&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;5.0.6&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/oauth2-proxy-values&quot;</span> <span class="token punctuation">\\</span>
  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/oauth2-proxy/oauth2-proxy-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/oauth2-proxy/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/oauth2-proxy&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/oauth2-proxy</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy/oauth2-proxy-kustomization&quot;</span>

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy/oauth2-proxy-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: oauth2-proxy
  namespace: flux-system
spec:
  dependsOn:
  - name: kube-prometheus-stack
  interval: 5m
  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy/oauth2-proxy-kustomization
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

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy/oauth2-proxy-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
nameReference:
- kind: ConfigMap
  version: v1
  fieldSpecs:
  - path: spec/valuesFrom/name
    kind: HelmRelease
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy/oauth2-proxy-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: oauth2-proxy
resources:
  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/oauth2-proxy
configMapGenerator:
  - name: oauth2-proxy-values
    files:
      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>oauth2-proxy-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy/oauth2-proxy-kustomization/oauth2-proxy-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
config:
  clientID: oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>
  clientSecret: <span class="token variable">\${MY_PASSWORD}</span>
  cookieSecret: <span class="token variable">\${MY_COOKIE_SECRET}</span>
  configFile: <span class="token operator">|</span>-
    email_domains <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token string">&quot;*&quot;</span> <span class="token punctuation">]</span>
    upstreams <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token string">&quot;file:///dev/null&quot;</span> <span class="token punctuation">]</span>
    whitelist_domains <span class="token operator">=</span> <span class="token string">&quot;.<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span>
    cookie_domains <span class="token operator">=</span> <span class="token string">&quot;.<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span>
    provider <span class="token operator">=</span> <span class="token string">&quot;oidc&quot;</span>
    oidc_issuer_url <span class="token operator">=</span> <span class="token string">&quot;https://dex.<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span>
    ssl_insecure_skip_verify <span class="token operator">=</span> <span class="token string">&quot;true&quot;</span>
    insecure_oidc_skip_issuer_verification <span class="token operator">=</span> <span class="token string">&quot;true&quot;</span>
    skip_oidc_discovery <span class="token operator">=</span> <span class="token string">&quot;true&quot;</span>
    login_url <span class="token operator">=</span> <span class="token string">&quot;https://dex.<span class="token variable">\${CLUSTER_FQDN}</span>/auth&quot;</span>
    redeem_url <span class="token operator">=</span> <span class="token string">&quot;https://dex.<span class="token variable">\${CLUSTER_FQDN}</span>/token&quot;</span>
    oidc_jwks_url <span class="token operator">=</span> <span class="token string">&quot;https://dex.<span class="token variable">\${CLUSTER_FQDN}</span>/keys&quot;</span>
ingress:
  enabled: <span class="token boolean">true</span>
  className: nginx
  hosts:
    - oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>
  tls:
    - hosts:
      - oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>
metrics:
  servicemonitor:
    enabled: <span class="token boolean">true</span>
EOF

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- oauth2-proxy$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span>
  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource oauth2-proxy <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="flux" tabindex="-1"><a class="header-anchor" href="#flux"><span>Flux</span></a></h2><p>Commit changes to git repository and &quot;refresh&quot; flux. Wait for receiver and then configure the GitHub repository to send Webhooks to Flux:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token assign-left variable">GITHUB_WEBHOOKS</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token parameter variable">-H</span> <span class="token string">&quot;Authorization: token <span class="token variable">$GITHUB_TOKEN</span>&quot;</span> <span class="token string">&quot;https://api.github.com/repos/<span class="token variable">\${GITHUB_USER}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>/hooks&quot;</span> <span class="token operator">|</span> jq <span class="token string">&quot;.[].config.url&quot;</span><span class="token variable">)</span></span>
<span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token string">&quot;<span class="token variable">\${GITHUB_WEBHOOKS}</span>&quot;</span> <span class="token operator">=~</span> <span class="token variable">\${CLUSTER_FQDN}</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
  <span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>
  <span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;[<span class="token variable">\${CLUSTER_NAME}</span>] Initial core applications commit&quot;</span> <span class="token operator">||</span> <span class="token boolean">true</span>
  <span class="token function">git</span> push
  flux reconcile <span class="token builtin class-name">source</span> <span class="token function">git</span> flux-system
  <span class="token function">sleep</span> <span class="token number">100</span>
  kubectl <span class="token function">wait</span> <span class="token parameter variable">--timeout</span><span class="token operator">=</span>20m <span class="token parameter variable">--for</span><span class="token operator">=</span>condition<span class="token operator">=</span>ready kustomizations.kustomize.toolkit.fluxcd.io <span class="token parameter variable">-n</span> flux-system flux-receiver
  <span class="token assign-left variable">FLUX_RECEIVER_URL</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>kubectl <span class="token parameter variable">-n</span> flux-system get receiver github-receiver <span class="token parameter variable">-o</span> <span class="token assign-left variable">jsonpath</span><span class="token operator">=</span><span class="token string">&quot;{.status.url}&quot;</span><span class="token variable">)</span></span>
  <span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token parameter variable">-H</span> <span class="token string">&quot;Authorization: token <span class="token variable">$GITHUB_TOKEN</span>&quot;</span> <span class="token parameter variable">-X</span> POST <span class="token parameter variable">-d</span> <span class="token string">&quot;{<span class="token entity" title="\\&quot;">\\&quot;</span>active<span class="token entity" title="\\&quot;">\\&quot;</span>: true, <span class="token entity" title="\\&quot;">\\&quot;</span>events<span class="token entity" title="\\&quot;">\\&quot;</span>: [<span class="token entity" title="\\&quot;">\\&quot;</span>push<span class="token entity" title="\\&quot;">\\&quot;</span>], <span class="token entity" title="\\&quot;">\\&quot;</span>config<span class="token entity" title="\\&quot;">\\&quot;</span>: {<span class="token entity" title="\\&quot;">\\&quot;</span>url<span class="token entity" title="\\&quot;">\\&quot;</span>: <span class="token entity" title="\\&quot;">\\&quot;</span>https://flux-receiver.<span class="token variable">\${CLUSTER_FQDN}</span><span class="token variable">\${FLUX_RECEIVER_URL}</span><span class="token entity" title="\\&quot;">\\&quot;</span>, <span class="token entity" title="\\&quot;">\\&quot;</span>content_type<span class="token entity" title="\\&quot;">\\&quot;</span>: <span class="token entity" title="\\&quot;">\\&quot;</span>json<span class="token entity" title="\\&quot;">\\&quot;</span>, <span class="token entity" title="\\&quot;">\\&quot;</span>secret<span class="token entity" title="\\&quot;">\\&quot;</span>: <span class="token entity" title="\\&quot;">\\&quot;</span><span class="token variable">\${MY_GITHUB_WEBHOOK_TOKEN}</span><span class="token entity" title="\\&quot;">\\&quot;</span>, <span class="token entity" title="\\&quot;">\\&quot;</span>insecure_ssl<span class="token entity" title="\\&quot;">\\&quot;</span>: <span class="token entity" title="\\&quot;">\\&quot;</span>1<span class="token entity" title="\\&quot;">\\&quot;</span>}}&quot;</span> <span class="token string">&quot;https://api.github.com/repos/<span class="token variable">\${GITHUB_USER}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>/hooks&quot;</span> <span class="token operator">|</span> jq
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Due to the way how Crossplane installs the providers it is not possible to specify the name of the <code>ServiceAccount</code> in advance. Therefore you need to get the details about <code>ServiceAccount</code> created by Crossplane and use eksctl to create IRSA:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span>eksctl get iamserviceaccount <span class="token parameter variable">--cluster</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token parameter variable">--namespace</span> crossplane-system <span class="token parameter variable">-o</span> yaml<span class="token variable">)</span></span>&quot;</span> <span class="token operator">==</span> <span class="token string">&quot;null&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
  kubectl <span class="token function">wait</span> <span class="token parameter variable">--timeout</span><span class="token operator">=</span>10m <span class="token parameter variable">--for</span><span class="token operator">=</span>condition<span class="token operator">=</span>ready kustomizations crossplane-provider <span class="token parameter variable">-n</span> flux-system
  kubectl <span class="token function">wait</span> <span class="token parameter variable">--timeout</span><span class="token operator">=</span>10m <span class="token parameter variable">--for</span><span class="token operator">=</span>condition<span class="token operator">=</span>Healthy provider.pkg.crossplane.io provider-aws
  <span class="token assign-left variable">CROSSPLANE_PROVIDER_AWS_SERVICE_ACCOUNT_NAME</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>kubectl get serviceaccounts <span class="token parameter variable">-n</span> crossplane-system <span class="token parameter variable">-o</span><span class="token operator">=</span>custom-columns<span class="token operator">=</span>NAME:.metadata.name <span class="token operator">|</span> <span class="token function">grep</span> provider-aws<span class="token variable">)</span></span>
  eksctl create iamserviceaccount <span class="token parameter variable">--cluster</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token parameter variable">--name</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CROSSPLANE_PROVIDER_AWS_SERVICE_ACCOUNT_NAME}</span>&quot;</span> <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;crossplane-system&quot;</span> --role-name<span class="token operator">=</span><span class="token string">&quot;crossplane-provider-aws-<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> --role-only --attach-policy-arn<span class="token operator">=</span><span class="token string">&quot;arn:aws:iam::aws:policy/AdministratorAccess&quot;</span> <span class="token parameter variable">--tags</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${TAGS<span class="token operator">/</span><span class="token operator">/</span> <span class="token operator">/</span><span class="token operator">,</span>}</span>&quot;</span> <span class="token parameter variable">--approve</span>
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,9);function Us(Ls,Ds){const t=o("router-link"),e=o("ExternalLinkIcon");return p(),c("div",null,[d,s("nav",v,[s("ul",null,[s("li",null,[a(t,{to:"#flux-dis-advantages"},{default:i(()=>[n("Flux (dis)advantages")]),_:1})]),s("li",null,[a(t,{to:"#solution-requirements-for-flux"},{default:i(()=>[n("Solution requirements for Flux")]),_:1}),s("ul",null,[s("li",null,[a(t,{to:"#naming-convention-and-directory-structure"},{default:i(()=>[n("Naming convention and directory structure")]),_:1})])])]),s("li",null,[a(t,{to:"#create-basic-flux-structure-in-git-repository"},{default:i(()=>[n("Create basic Flux structure in git repository")]),_:1})]),s("li",null,[a(t,{to:"#manage-kubernetes-secrets-with-mozilla-sops-and-amazon-secret-manager"},{default:i(()=>[n("Manage Kubernetes secrets with Mozilla SOPS and Amazon Secret Manager")]),_:1})]),s("li",null,[a(t,{to:"#helmrepositories"},{default:i(()=>[n("HelmRepositories")]),_:1})]),s("li",null,[a(t,{to:"#clusters"},{default:i(()=>[n("Clusters")]),_:1})]),s("li",null,[a(t,{to:"#create-initial-apps-dev-group-definitions"},{default:i(()=>[n("Create initial Apps dev group definitions")]),_:1})]),s("li",null,[a(t,{to:"#base-applications-definitions"},{default:i(()=>[n("Base Applications definitions")]),_:1}),s("ul",null,[s("li",null,[a(t,{to:"#amazon-elastic-block-store-ebs-csi-driver"},{default:i(()=>[n("Amazon Elastic Block Store (EBS) CSI driver")]),_:1})]),s("li",null,[a(t,{to:"#crossplane"},{default:i(()=>[n("Crossplane")]),_:1})]),s("li",null,[a(t,{to:"#csi-snapshotter"},{default:i(()=>[n("CSI Snapshotter")]),_:1})]),s("li",null,[a(t,{to:"#kubernetes-metrics-server"},{default:i(()=>[n("Kubernetes Metrics Server")]),_:1})]),s("li",null,[a(t,{to:"#kube-prometheus-stack"},{default:i(()=>[n("kube-prometheus-stack")]),_:1})]),s("li",null,[a(t,{to:"#cert-manager"},{default:i(()=>[n("cert-manager")]),_:1})]),s("li",null,[a(t,{to:"#cluster-autoscaler"},{default:i(()=>[n("cluster-autoscaler")]),_:1})]),s("li",null,[a(t,{to:"#dex"},{default:i(()=>[n("Dex")]),_:1})]),s("li",null,[a(t,{to:"#externaldns"},{default:i(()=>[n("ExternalDNS")]),_:1})]),s("li",null,[a(t,{to:"#flux-provides-alerts-receivers-and-monitoring"},{default:i(()=>[n("Flux provides, alerts, receivers and monitoring")]),_:1})]),s("li",null,[a(t,{to:"#ingress-nginx"},{default:i(()=>[n("ingress-nginx")]),_:1})]),s("li",null,[a(t,{to:"#mailhog"},{default:i(()=>[n("MailHog")]),_:1})]),s("li",null,[a(t,{to:"#oauth2-proxy"},{default:i(()=>[n("OAuth2 Proxy")]),_:1})])])]),s("li",null,[a(t,{to:"#flux"},{default:i(()=>[n("Flux")]),_:1})])])]),m,s("ul",null,[s("li",null,[k,n(" can not be used between "),b,n(" and "),g,n(": "),s("a",f,[n("HelmRelease, Kustomization DependsOn"),a(e)]),n(". Due to "),s("a",h,[n("https://github.com/fluxcd/flux2/discussions/730"),a(e)]),n(", "),s("a",q,[n("https://github.com/fluxcd/flux2/discussions/1010"),a(e)]),n(' it is necessary to "pack" '),E,n(' inside "flux '),N,n('" to be able to do dependency using '),y,n(' later... This "forces" you to use "flux '),x,n('" almost everywhere where you are using "dependencies"')]),s("li",null,[s("a",_,[n("HelmReleases"),a(e)]),n(" are compatible with Helm ("),R,n(" works fine)")]),s("li",null,[s("a",O,[n("Post build variable substitution"),a(e)]),n(" is really handy and easy to use in case you do not want to use too much "),s("a",T,[n("patching"),a(e)])]),$]),z,s("ul",null,[I,M,s("li",null,[n('I want to define flexible cluster "infrastructure groups" ('),S,n(", "),F,n(", "),C,n(", "),V,n("): "),s("ul",null,[w,U,s("li",null,[s("a",L,[n("Variables"),a(e)]),n(" should be used per cluster ("),D,n(")")])])]),A]),H,s("p",null,[s("a",G,[n("Amazon Elastic Block Store (EBS) CSI driver"),a(e)])]),s("ul",null,[s("li",null,[s("a",K,[n("aws-ebs-csi-driver"),a(e)])]),s("li",null,[s("a",Q,[n("default values.yaml"),a(e)])])]),B,s("p",null,[s("a",P,[n("Crossplane"),a(e)])]),s("ul",null,[s("li",null,[s("a",Y,[n("crossplane"),a(e)])]),s("li",null,[s("a",W,[n("default values.yaml"),a(e)])])]),X,s("p",null,[n("Details about EKS and "),j,n(" can be found here: "),s("a",Z,[n("Using EBS Snapshots for persistent storage with your EKS cluster"),a(e)])]),J,s("p",null,[s("a",ss,[n("Kubernetes Metrics Server"),a(e)])]),s("ul",null,[s("li",null,[s("a",ns,[n("metrics-server"),a(e)])]),s("li",null,[s("a",as,[n("default values.yaml"),a(e)])])]),es,s("p",null,[s("a",ts,[n("kube-prometheus-stack"),a(e)])]),s("ul",null,[s("li",null,[s("a",is,[n("kube-prometheus-stack"),a(e)])]),s("li",null,[s("a",ls,[n("default values.yaml"),a(e)])])]),os,s("p",null,[s("a",rs,[n("cert-manager"),a(e)])]),s("ul",null,[s("li",null,[s("a",ps,[n("cert-manager"),a(e)])]),s("li",null,[s("a",cs,[n("default values.yaml"),a(e)])])]),us,s("p",null,[s("a",ds,[n("cluster-autoscaler"),a(e)])]),s("ul",null,[s("li",null,[s("a",vs,[n("cluster-autoscaler"),a(e)])]),s("li",null,[s("a",ms,[n("default values.yaml"),a(e)])])]),ks,s("p",null,[s("a",bs,[n("Dex"),a(e)])]),s("ul",null,[s("li",null,[s("a",gs,[n("dex"),a(e)])]),s("li",null,[s("a",fs,[n("default values.yaml"),a(e)])])]),hs,s("p",null,[s("a",qs,[n("ExternalDNS"),a(e)])]),s("ul",null,[s("li",null,[s("a",Es,[n("external-dns"),a(e)])]),s("li",null,[s("a",Ns,[n("default values.yaml"),a(e)])])]),ys,s("p",null,[s("a",xs,[n("flux"),a(e)])]),_s,s("p",null,[s("a",Rs,[n("ingress-nginx"),a(e)])]),s("ul",null,[s("li",null,[s("a",Os,[n("ingress-nginx"),a(e)])]),s("li",null,[s("a",Ts,[n("default values.yaml"),a(e)])])]),$s,s("p",null,[s("a",zs,[n("mailhog"),a(e)])]),s("ul",null,[s("li",null,[s("a",Is,[n("mailhog"),a(e)])]),s("li",null,[s("a",Ms,[n("default values.yaml"),a(e)])])]),Ss,s("p",null,[s("a",Fs,[n("oauth2-proxy"),a(e)])]),s("ul",null,[s("li",null,[s("a",Cs,[n("oauth2-proxy"),a(e)])]),s("li",null,[s("a",Vs,[n("default values.yaml"),a(e)])])]),ws])}const Hs=r(u,[["render",Us],["__file","index.html.vue"]]),Gs=JSON.parse('{"path":"/part-03/","title":"Base Applications","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"Flux (dis)advantages","slug":"flux-dis-advantages","link":"#flux-dis-advantages","children":[]},{"level":2,"title":"Solution requirements for Flux","slug":"solution-requirements-for-flux","link":"#solution-requirements-for-flux","children":[{"level":3,"title":"Naming convention and directory structure","slug":"naming-convention-and-directory-structure","link":"#naming-convention-and-directory-structure","children":[]}]},{"level":2,"title":"Create basic Flux structure in git repository","slug":"create-basic-flux-structure-in-git-repository","link":"#create-basic-flux-structure-in-git-repository","children":[]},{"level":2,"title":"Manage Kubernetes secrets with Mozilla SOPS and Amazon Secret Manager","slug":"manage-kubernetes-secrets-with-mozilla-sops-and-amazon-secret-manager","link":"#manage-kubernetes-secrets-with-mozilla-sops-and-amazon-secret-manager","children":[]},{"level":2,"title":"HelmRepositories","slug":"helmrepositories","link":"#helmrepositories","children":[]},{"level":2,"title":"Clusters","slug":"clusters","link":"#clusters","children":[]},{"level":2,"title":"Create initial Apps dev group definitions","slug":"create-initial-apps-dev-group-definitions","link":"#create-initial-apps-dev-group-definitions","children":[]},{"level":2,"title":"Base Applications definitions","slug":"base-applications-definitions","link":"#base-applications-definitions","children":[{"level":3,"title":"Amazon Elastic Block Store (EBS) CSI driver","slug":"amazon-elastic-block-store-ebs-csi-driver","link":"#amazon-elastic-block-store-ebs-csi-driver","children":[]},{"level":3,"title":"Crossplane","slug":"crossplane","link":"#crossplane","children":[]},{"level":3,"title":"CSI Snapshotter","slug":"csi-snapshotter","link":"#csi-snapshotter","children":[]},{"level":3,"title":"Kubernetes Metrics Server","slug":"kubernetes-metrics-server","link":"#kubernetes-metrics-server","children":[]},{"level":3,"title":"kube-prometheus-stack","slug":"kube-prometheus-stack","link":"#kube-prometheus-stack","children":[]},{"level":3,"title":"cert-manager","slug":"cert-manager","link":"#cert-manager","children":[]},{"level":3,"title":"cluster-autoscaler","slug":"cluster-autoscaler","link":"#cluster-autoscaler","children":[]},{"level":3,"title":"Dex","slug":"dex","link":"#dex","children":[]},{"level":3,"title":"ExternalDNS","slug":"externaldns","link":"#externaldns","children":[]},{"level":3,"title":"Flux provides, alerts, receivers and monitoring","slug":"flux-provides-alerts-receivers-and-monitoring","link":"#flux-provides-alerts-receivers-and-monitoring","children":[]},{"level":3,"title":"ingress-nginx","slug":"ingress-nginx","link":"#ingress-nginx","children":[]},{"level":3,"title":"MailHog","slug":"mailhog","link":"#mailhog","children":[]},{"level":3,"title":"OAuth2 Proxy","slug":"oauth2-proxy","link":"#oauth2-proxy","children":[]}]},{"level":2,"title":"Flux","slug":"flux","link":"#flux","children":[]}],"git":{"updatedTime":1711264771000},"filePathRelative":"part-03/README.md"}');export{Hs as comp,Gs as data};
