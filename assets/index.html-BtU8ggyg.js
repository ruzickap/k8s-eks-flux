import{_ as i,c as p,a as s,b as a,w as e,d as t,r as c,o,e as l}from"./app-DVraMtkj.js";const r={},u=s("h1",{id:"base-applications",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#base-applications"},[s("span",null,"Base Applications")])],-1),d={class:"table-of-contents"},v=t(`<h2 id="flux-dis-advantages" tabindex="-1"><a class="header-anchor" href="#flux-dis-advantages"><span>Flux (dis)advantages</span></a></h2><ul><li><code>dependsOn</code> can not be used between <code>HelmRelease</code> and <code>Kustomization</code>: <a href="https://github.com/fluxcd/kustomize-controller/issues/242" target="_blank" rel="noopener noreferrer">HelmRelease, Kustomization DependsOn</a>. Due to <a href="https://github.com/fluxcd/flux2/discussions/730" target="_blank" rel="noopener noreferrer">https://github.com/fluxcd/flux2/discussions/730</a>, <a href="https://github.com/fluxcd/flux2/discussions/1010" target="_blank" rel="noopener noreferrer">https://github.com/fluxcd/flux2/discussions/1010</a> it is necessary to &quot;pack&quot; <code>HelmRelease</code> inside &quot;flux <code>Kustomization</code>&quot; to be able to do dependency using <code>dependsOn</code> later... This &quot;forces&quot; you to use &quot;flux <code>Kustomization</code>&quot; almost everywhere where you are using &quot;dependencies&quot;</li><li><a href="https://fluxcd.io/docs/components/helm/helmreleases/" target="_blank" rel="noopener noreferrer">HelmReleases</a> are compatible with Helm (<code>helm ls -A</code> works fine)</li><li><a href="https://fluxcd.io/flux/components/kustomize/kustomization/#post-build-variable-substitution" target="_blank" rel="noopener noreferrer">Post build variable substitution</a> is really handy and easy to use in case you do not want to use too much <a href="https://fluxcd.io/flux/components/kustomize/kustomization/#post-build-variable-substitution" target="_blank" rel="noopener noreferrer">patching</a></li><li>Changing values inside patches which are use <code>|-</code> is not possible, because it is a block of &quot;text&quot; and not &quot;structure&quot;</li></ul><h2 id="solution-requirements-for-flux" tabindex="-1"><a class="header-anchor" href="#solution-requirements-for-flux"><span>Solution requirements for Flux</span></a></h2><ul><li><code>HelmRepositories</code> must be installed in <code>flux-system</code> namespace and separated, because definitions there are shared by multiple <code>HelmReleases</code></li><li><code>HelmRepositories</code> must be installed before <code>HelmReleases</code> (<code>dependsOn</code>) to prevent generating errors in Flux log</li><li>I want to define flexible cluster &quot;infrastructure groups&quot; (<code>prod</code>, <code>dev</code>, <code>mygroup</code>, <code>myteam</code>): <ul><li>It should be possible to define infrastructure group containing various applications</li><li>It should also help you to easily manage groups of clusters because their definitions will be in the specific directory (like <code>infrastructure/dev</code>)</li><li><a href="https://fluxcd.io/flux/components/kustomize/kustomization/#post-build-variable-substitution" target="_blank" rel="noopener noreferrer">Variables</a> should be used per cluster (<code>clusters/dev/kube1/cluster-apps-substitutefrom-secret.yaml</code>)</li></ul></li><li><code>HelmRepository</code> / <code>HelmReleases</code> can be defined per &quot;cluster&quot;: <ul><li><code>clusters/dev/kube1/sources/fairwinds-stable.yaml</code></li><li><code>clusters/dev/kube1/cluster-apps/polaris/polaris-helmrelease.yaml</code></li></ul></li></ul><h3 id="naming-convention-and-directory-structure" tabindex="-1"><a class="header-anchor" href="#naming-convention-and-directory-structure"><span>Naming convention and directory structure</span></a></h3><p>Most of the applications installed to K8s cluster are using Helm charts. Therefore you need Flux objects <code>HelmRepositories</code> and <code>HelmReleases</code> where <code>HelmRepositories</code> needs to be installed first.</p><ul><li><code>HelmRepositories</code> are separated from app definition, because they may be shared by multiple applications (like <code>bitnami</code> and <code>external-dns</code> + <code>metrics-server</code>). <code>HelmRepositories</code> are installed first to prevent flux from logging errors...</li><li>Applications can be installed on multiple levels <ul><li><strong>Apps level</strong> - not used</li><li><strong>Infrastructure level</strong> - configuration for specific group of K8s servers. Usually contains objects, patches, certificates, which are applied to multiple clusters (different objects for &quot;dev&quot; and &quot;prod&quot; clusters)</li><li><strong>Cluster level</strong> - specific app configurations, <code>HelmReleases</code> / <code>HelmRepositories</code> for single cluster. Usually contains variables like <code>CLUSTER_FQDN</code>, <code>CLUSTER_NAME</code>, <code>MY_PASSWORD</code>, <code>LETSENCRYPT_ENVIRONMENT</code> ...</li></ul></li></ul><h4 id="cluster-level" tabindex="-1"><a class="header-anchor" href="#cluster-level"><span>Cluster level</span></a></h4><p>Cluster level directory <code>/clusters/</code> contains individual cluster definitions.</p><ul><li><code>clusters/\${ENVIRONMENT}/\${CLUSTER_FQDN}</code><ul><li><code>sources.yaml</code> - main &quot;flux Kustomization&quot; pointing do the <code>./sources</code> where are the <code>HelmRepository</code> definitions for cluster</li><li><code>sources/kustomization.yaml</code> - list of all &quot;enabled HelmRepositories&quot;</li><li><code>sources/fairwinds-stable.yaml</code> - HelmRepository file</li><li><code>cluster-apps.yaml</code> - main &quot;flux Kustomization&quot; pointing to <code>./clusters/dev/kube1.k8s.mylabs.dev/cluster-apps</code></li><li><code>cluster-apps/kustomization.yaml</code> - kustomization file containing patches, app directories and <code>./infrastructure/dev</code></li><li><code>cluster-apps-substitutefrom-secret.yaml</code> - encrypted variables used in <code>postBuild.substituteFrom</code> flux Kustomization sections</li><li><code>cluster-apps/polaris/polaris-namespace</code> - application namespace</li><li><code>cluster-apps/polaris/polaris-helmrelease</code> - <code>HelmRelease</code> file</li><li><code>flux-system/gotk-patches.yaml,kustomization.yaml</code> - files configuring Flux to work with SOPS (decryption)</li></ul></li></ul><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre class="language-text"><code><span class="line">clusters</span>
<span class="line">└── dev</span>
<span class="line">    └── kube1.k8s.mylabs.dev</span>
<span class="line">        ├── cluster-apps</span>
<span class="line">        │   ├── kustomization.yaml</span>
<span class="line">        │   └── polaris</span>
<span class="line">        │       ├── kustomization.yaml</span>
<span class="line">        │       ├── polaris-helmrelease.yaml</span>
<span class="line">        │       └── polaris-namespace.yaml</span>
<span class="line">        ├── cluster-apps-substitutefrom-secret.yaml</span>
<span class="line">        ├── cluster-apps.yaml</span>
<span class="line">        ├── flux-system</span>
<span class="line">        │   ├── gotk-components.yaml</span>
<span class="line">        │   ├── gotk-patches.yaml</span>
<span class="line">        │   ├── gotk-sync.yaml</span>
<span class="line">        │   └── kustomization.yaml</span>
<span class="line">        ├── kustomization.yaml</span>
<span class="line">        ├── sources</span>
<span class="line">        │   ├── fairwinds-stable.yaml</span>
<span class="line">        │   └── kustomization.yaml</span>
<span class="line">        └── sources.yaml</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="infrastructure-level" tabindex="-1"><a class="header-anchor" href="#infrastructure-level"><span>Infrastructure level</span></a></h4><p>Infrastructure level contain applications or patches located in <code>base</code> directory. All definitions in infrastructure level are applied to all servers in that &quot;group&quot;. Infrastructure also contains the <code>sources</code> directory where you can find &quot;common&quot; HelmRepositories. Usually there are &quot;groups&quot; (directories) like <code>prd</code>, <code>dev</code>, <code>stg</code>, ...</p><ul><li><code>infrastructure</code> - directory containing &quot;infrastructure level&quot; definitions <ul><li><code>sources/kustomization.yaml</code> - globally allowed HelmRepositories</li><li><code>sources/bitnami-helmrepository.yaml</code> - HelmRepository file</li><li><code>base</code> - base application directory <ul><li><code>dex</code> - &quot;base&quot; dex directory containing HelmRelease, and namespace manifests</li></ul></li></ul></li><li><code>infrastructure/\${ENVIRONMENT}</code><ul><li><code>kustomization.yaml</code> - list of all enabled &quot;infrastructure dev level&quot; apps</li><li><code>dex</code> - directory containing values for HelmRelease</li></ul></li></ul><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre class="language-text"><code><span class="line">infrastructure</span>
<span class="line">├── base</span>
<span class="line">│   ├── cert-manager</span>
<span class="line">│   │   ├── cert-manager-helmrelease.yaml</span>
<span class="line">│   │   └── kustomization.yaml</span>
<span class="line">│   ├── dex</span>
<span class="line">│   │   ├── dex-helmrelease.yaml</span>
<span class="line">│   │   ├── dex-namespace.yaml</span>
<span class="line">│   │   └── kustomization.yaml</span>
<span class="line">│   ├── external-dns</span>
<span class="line">│   │   ├── external-dns-helmrelease.yaml</span>
<span class="line">│   │   └── kustomization.yaml</span>
<span class="line">│   ├── external-snapshotter</span>
<span class="line">│   │   └── kustomization.yaml</span>
<span class="line">│   └── secrets-store-csi-driver</span>
<span class="line">│       ├── kustomization.yaml</span>
<span class="line">│       ├── secrets-store-csi-driver-helmrelease.yaml</span>
<span class="line">│       └── secrets-store-csi-driver-namespace.yaml</span>
<span class="line">├── dev</span>
<span class="line">│   ├── cert-manager</span>
<span class="line">│   │   ├── cert-manager-kustomization-certificate</span>
<span class="line">│   │   │   └── cert-manager-certificate.yaml</span>
<span class="line">│   │   ├── cert-manager-kustomization-certificate.yaml</span>
<span class="line">│   │   ├── cert-manager-kustomization-clusterissuer</span>
<span class="line">│   │   │   ├── cert-manager-clusterissuer-letsencrypt-production-dns.yaml</span>
<span class="line">│   │   │   └── cert-manager-clusterissuer-letsencrypt-staging-dns.yaml</span>
<span class="line">│   │   ├── cert-manager-kustomization-clusterissuer.yaml</span>
<span class="line">│   │   ├── cert-manager-kustomization</span>
<span class="line">│   │   │   ├── cert-manager-values.yaml</span>
<span class="line">│   │   │   ├── kustomization.yaml</span>
<span class="line">│   │   │   └── kustomizeconfig.yaml</span>
<span class="line">│   │   ├── cert-manager-kustomization.yaml</span>
<span class="line">│   │   └── kustomization.yaml</span>
<span class="line">│   ├── crossplane</span>
<span class="line">│   │   ├── crossplane-kustomization</span>
<span class="line">│   │   │   └── kustomization.yaml</span>
<span class="line">│   │   ├── crossplane-kustomization.yaml</span>
<span class="line">│   │   ├── crossplane-kustomization-provider</span>
<span class="line">│   │   │   ├── crossplane-controllerconfig-aws.yaml</span>
<span class="line">│   │   │   └── crossplane-provider-aws.yaml</span>
<span class="line">│   │   ├── crossplane-kustomization-provider.yaml</span>
<span class="line">│   │   ├── crossplane-kustomization-providerconfig</span>
<span class="line">│   │   │   └── crossplane-providerconfig-aws.yaml</span>
<span class="line">│   │   ├── crossplane-kustomization-providerconfig.yaml</span>
<span class="line">│   │   └── kustomization.yaml</span>
<span class="line">│   ├── dex</span>
<span class="line">│   │   ├── dex-values.yaml</span>
<span class="line">│   │   ├── kustomization.yaml</span>
<span class="line">│   │   └── kustomizeconfig.yaml</span>
<span class="line">│   ├── external-dns</span>
<span class="line">│   │   ├── external-dns-kustomization</span>
<span class="line">│   │   │   ├── external-dns-values.yaml</span>
<span class="line">│   │   │   ├── kustomization.yaml</span>
<span class="line">│   │   │   └── kustomizeconfig.yaml</span>
<span class="line">│   │   ├── external-dns-kustomization.yaml</span>
<span class="line">│   │   └── kustomization.yaml</span>
<span class="line">│   ├── external-snapshotter</span>
<span class="line">│   │   ├── external-snapshotter-kustomization</span>
<span class="line">│   │   │   └── kustomization.yaml</span>
<span class="line">│   │   ├── external-snapshotter-kustomization.yaml</span>
<span class="line">│   │   └── kustomization.yaml</span>
<span class="line">│   ├── kustomization.yaml</span>
<span class="line">│   └── secrets-store-csi-driver</span>
<span class="line">│       ├── kustomization.yaml</span>
<span class="line">│       ├── secrets-store-csi-driver-kustomization</span>
<span class="line">│       │   └── kustomization.yaml</span>
<span class="line">│       ├── secrets-store-csi-driver-kustomization.yaml</span>
<span class="line">│       ├── secrets-store-csi-driver-provider-aws</span>
<span class="line">│       │   └── kustomization.yaml</span>
<span class="line">│       └── secrets-store-csi-driver-provider-aws.yaml</span>
<span class="line">└── sources</span>
<span class="line">    ├── bitnami-helmrepository.yaml</span>
<span class="line">    ├── crossplane-stable-helmrepository.yaml</span>
<span class="line">    ├── dex-helmrepository.yaml</span>
<span class="line">    ├── jetstack-helmrepository.yaml</span>
<span class="line">    ├── kustomization.yaml</span>
<span class="line">    └── secrets-store-csi-driver-helmrepository.yaml</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="create-basic-flux-structure-in-git-repository" tabindex="-1"><a class="header-anchor" href="#create-basic-flux-structure-in-git-repository"><span>Create basic Flux structure in git repository</span></a></h2><p>Clone initial git repository created by <code>eksctl</code> used by Flux:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token parameter variable">-d</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  <span class="token function">git</span> <span class="token parameter variable">-C</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>&quot;</span> pull <span class="token parameter variable">-r</span></span>
<span class="line"><span class="token keyword">else</span></span>
<span class="line">  <span class="token function">git</span> clone <span class="token string">&quot;https://<span class="token variable">\${GITHUB_TOKEN}</span>@github.com/<span class="token variable">\${GITHUB_USER}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>.git&quot;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>&quot;</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Create initial git repository structure:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>&quot;</span>/infrastructure/<span class="token punctuation">{</span>base,dev,sources<span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Set <code>user.name</code> and <code>user.email</code> for git (if not already configured)</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">git</span> config user.name <span class="token operator">||</span> <span class="token function">git</span> config <span class="token parameter variable">--global</span> user.name <span class="token string">&quot;<span class="token variable">\${GITHUB_USER}</span>&quot;</span></span>
<span class="line"><span class="token function">git</span> config user.email <span class="token operator">||</span> <span class="token function">git</span> config <span class="token parameter variable">--global</span> user.email <span class="token string">&quot;<span class="token variable">\${MY_EMAIL}</span>&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>Go to the &quot;git directory&quot;:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token builtin class-name">cd</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>&quot;</span> <span class="token operator">||</span> <span class="token builtin class-name">exit</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="manage-kubernetes-secrets-with-mozilla-sops-and-amazon-secret-manager" tabindex="-1"><a class="header-anchor" href="#manage-kubernetes-secrets-with-mozilla-sops-and-amazon-secret-manager"><span>Manage Kubernetes secrets with Mozilla SOPS and Amazon Secret Manager</span></a></h2><p>Configure the Git directory for encryption:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> .sops.yaml <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">echo</span> <span class="token string">&quot;creation_rules:&quot;</span> <span class="token operator">&gt;</span> .sops.yaml</span>
<span class="line"></span>
<span class="line"><span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&quot;<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span> .sops.yaml <span class="token operator">||</span> <span class="token function">cat</span> <span class="token operator">&gt;&gt;</span> .sops.yaml <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">  - path_regex: clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/.*</span>
<span class="line">    encrypted_regex: ^(data)$</span>
<span class="line">    kms: <span class="token variable">\${AWS_KMS_KEY_ARN}</span></span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Add SOPS configuration to git repository and sync it with Flux:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/flux-system/gotk-patches.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  <span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/flux-system/gotk-patches.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: flux-system</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  decryption:</span>
<span class="line">    provider: sops</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line">  <span class="token punctuation">(</span></span>
<span class="line">    <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/flux-system&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">      kustomize edit <span class="token function">add</span> patch <span class="token parameter variable">--path</span> gotk-patches.yaml <span class="token operator">&amp;&amp;</span></span>
<span class="line">      <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span></span>
<span class="line">  <span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">  <span class="token function">git</span> <span class="token function">add</span> .sops.yaml <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/flux-system&quot;</span></span>
<span class="line">  <span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;[<span class="token variable">\${CLUSTER_NAME}</span>] Add SOPS configuration&quot;</span></span>
<span class="line">  <span class="token function">git</span> push</span>
<span class="line">  flux reconcile <span class="token builtin class-name">source</span> <span class="token function">git</span> flux-system</span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="helmrepositories" tabindex="-1"><a class="header-anchor" href="#helmrepositories"><span>HelmRepositories</span></a></h2><p>Create <code>HelmRepository</code> definitions...</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token builtin class-name">declare</span> <span class="token parameter variable">-A</span> <span class="token assign-left variable">HELMREPOSITORIES</span><span class="token operator">=</span><span class="token punctuation">(</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;appscode&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://charts.appscode.com/stable/&quot;</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;autoscaler&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://kubernetes.github.io/autoscaler&quot;</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;aws-ebs-csi-driver&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://kubernetes-sigs.github.io/aws-ebs-csi-driver/&quot;</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;aws-efs-csi-driver&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://kubernetes-sigs.github.io/aws-efs-csi-driver/&quot;</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;bitnami&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://charts.bitnami.com/bitnami&quot;</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;codecentric&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://codecentric.github.io/helm-charts&quot;</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;crossplane-stable&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://charts.crossplane.io/stable&quot;</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;dex&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://charts.dexidp.io&quot;</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;ingress-nginx&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://kubernetes.github.io/ingress-nginx&quot;</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;jaegertracing&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://jaegertracing.github.io/helm-charts&quot;</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;jetstack&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://charts.jetstack.io&quot;</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;kiali&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://kiali.org/helm-charts&quot;</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;kubernetes-dashboard&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://kubernetes.github.io/dashboard/&quot;</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;kyverno&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://kyverno.github.io/kyverno/&quot;</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;oauth2-proxy&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://oauth2-proxy.github.io/manifests&quot;</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;podinfo&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://stefanprodan.github.io/podinfo&quot;</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;policy-reporter&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://kyverno.github.io/policy-reporter&quot;</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;prometheus-community&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://prometheus-community.github.io/helm-charts&quot;</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;rancher-latest&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://releases.rancher.com/server-charts/latest&quot;</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;secrets-store-csi-driver&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts&quot;</span></span>
<span class="line">  <span class="token punctuation">[</span><span class="token string">&quot;vmware-tanzu&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;https://vmware-tanzu.github.io/helm-charts&quot;</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">for</span> <span class="token for-or-select variable">HELMREPOSITORY</span> <span class="token keyword">in</span> <span class="token string">&quot;<span class="token variable">\${<span class="token operator">!</span>HELMREPOSITORIES<span class="token punctuation">[</span>@<span class="token punctuation">]</span>}</span>&quot;</span><span class="token punctuation">;</span> <span class="token keyword">do</span></span>
<span class="line">  flux create <span class="token builtin class-name">source</span> helm <span class="token string">&quot;<span class="token variable">\${HELMREPOSITORY}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    <span class="token parameter variable">--url</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${HELMREPOSITORIES<span class="token punctuation">[</span>\${HELMREPOSITORY}</span>]}&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    <span class="token parameter variable">--interval</span><span class="token operator">=</span>1h <span class="token punctuation">\\</span></span>
<span class="line">    <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/sources/<span class="token variable">\${HELMREPOSITORY}</span>-helmrepository.yaml&quot;</span></span>
<span class="line"><span class="token keyword">done</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Due to this issue: https://github.com/kubernetes-sigs/kustomize/issues/2803</span></span>
<span class="line"><span class="token comment"># you need to CD to the directory first and then go back</span></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token parameter variable">-f</span> infrastructure/sources/kustomization.yaml <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token function">rm</span> infrastructure/sources/kustomization.yaml</span>
<span class="line"><span class="token builtin class-name">cd</span> infrastructure/sources <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="clusters" tabindex="-1"><a class="header-anchor" href="#clusters"><span>Clusters</span></a></h2><p>Create <code>cluster-apps</code>, <code>sources</code> and initial <code>kustomization.yaml</code> under cluster directory <code>clusters/\${ENVIRONMENT}/\${CLUSTER_FQDN}</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-pv</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span>/<span class="token punctuation">{</span>cluster-apps,sources<span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>It is necessary to split <code>HelmRepository</code> and <code>HelmRelease</code>, otherwise there are many errors in flux logs. <code>HelmRepository</code> should be always installed before <code>HelmRelease</code> using <code>dependsOn</code>.</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">flux create kustomization sources <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/sources&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/sources.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/sources/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span></span>
<span class="line">    <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/sources/&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">      kustomize create <span class="token parameter variable">--resources</span> <span class="token string">&quot;../../../../infrastructure/sources&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">      <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span></span>
<span class="line">  <span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Use <code>cluster-apps</code> &quot;flux kustomization&quot; definition to use <code>dependsOn</code> to wait for &quot;HelmRepositories&quot;.</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: cluster-apps</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">    - name: sources</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: ./clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps</span>
<span class="line">  prune: true</span>
<span class="line">  sourceRef:</span>
<span class="line">    kind: GitRepository</span>
<span class="line">    name: flux-system</span>
<span class="line">    namespace: flux-system</span>
<span class="line">  wait: true</span>
<span class="line">  timeout: 15m</span>
<span class="line">  postBuild:</span>
<span class="line">    substituteFrom:</span>
<span class="line">    - kind: Secret</span>
<span class="line">      name: cluster-apps-substitutefrom-secret</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span></span>
<span class="line">    <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">      kustomize create <span class="token parameter variable">--resources</span> <span class="token string">&quot;../../../../infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">      <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span></span>
<span class="line">  <span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps-substitutefrom-secret.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  kubectl create secret generic cluster-apps-substitutefrom-secret <span class="token parameter variable">-n</span> flux-system --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;AWS_ACCOUNT_ID=<span class="token variable">\${AWS_ACCOUNT_ID}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;AWS_DEFAULT_REGION=<span class="token variable">\${AWS_DEFAULT_REGION}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;AWS_KMS_KEY_ARN=<span class="token variable">\${AWS_KMS_KEY_ARN}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;CLUSTER_FQDN=<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;CLUSTER_NAME=<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;ENVIRONMENT=dev&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;LETSENCRYPT_ENVIRONMENT=staging&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;MY_COOKIE_SECRET=<span class="token variable">\${MY_COOKIE_SECRET}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;MY_EMAIL=<span class="token variable">\${MY_EMAIL}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;MY_GITHUB_ORG_NAME=<span class="token variable">\${MY_GITHUB_ORG_NAME}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID=<span class="token variable">\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET=<span class="token variable">\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;MY_GITHUB_WEBHOOK_TOKEN_BASE64=<span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token parameter variable">-n</span> <span class="token string">&quot;<span class="token variable">\${MY_GITHUB_WEBHOOK_TOKEN}</span>&quot;</span> <span class="token operator">|</span> base64 <span class="token parameter variable">--wrap</span><span class="token operator">=</span><span class="token number">0</span><span class="token variable">)</span></span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;MY_PASSWORD=<span class="token variable">\${MY_PASSWORD}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;MY_PASSWORD_BASE64=<span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token parameter variable">-n</span> <span class="token string">&quot;<span class="token variable">\${MY_PASSWORD}</span>&quot;</span> <span class="token operator">|</span> base64 <span class="token parameter variable">--wrap</span><span class="token operator">=</span><span class="token number">0</span><span class="token variable">)</span></span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;OKTA_CLIENT_ID=<span class="token variable">\${OKTA_CLIENT_ID}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;OKTA_CLIENT_SECRET=<span class="token variable">\${OKTA_CLIENT_SECRET}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;OKTA_ISSUER=<span class="token variable">\${OKTA_ISSUER}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;SLACK_CHANNEL=<span class="token variable">\${SLACK_CHANNEL}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;SLACK_INCOMING_WEBHOOK_URL_BASE64=<span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token parameter variable">-n</span> <span class="token string">&quot;<span class="token variable">\${SLACK_INCOMING_WEBHOOK_URL}</span>&quot;</span> <span class="token operator">|</span> base64 <span class="token parameter variable">--wrap</span><span class="token operator">=</span><span class="token number">0</span><span class="token variable">)</span></span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;SLACK_INCOMING_WEBHOOK_URL=<span class="token variable">\${SLACK_INCOMING_WEBHOOK_URL}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --from-literal<span class="token operator">=</span><span class="token string">&quot;TAGS_INLINE=<span class="token variable">\${TAGS<span class="token operator">/</span><span class="token operator">/</span> <span class="token operator">/</span><span class="token operator">,</span>}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps-substitutefrom-secret.yaml&quot;</span></span>
<span class="line">  sops <span class="token parameter variable">--encrypt</span> --in-place <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps-substitutefrom-secret.yaml&quot;</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span></span>
<span class="line">    <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">      kustomize create <span class="token parameter variable">--resources</span> <span class="token string">&quot;flux-system,sources.yaml,cluster-apps-substitutefrom-secret.yaml,cluster-apps.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">      <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span></span>
<span class="line">  <span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="create-initial-apps-dev-group-definitions" tabindex="-1"><a class="header-anchor" href="#create-initial-apps-dev-group-definitions"><span>Create initial Apps dev group definitions</span></a></h2><p>Create initial <code>kustomization.yaml</code> where all the group application will have their record:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--resources</span> <span class="token string">&quot;../sources&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="base-applications-definitions" tabindex="-1"><a class="header-anchor" href="#base-applications-definitions"><span>Base Applications definitions</span></a></h2><h3 id="amazon-elastic-block-store-ebs-csi-driver" tabindex="-1"><a class="header-anchor" href="#amazon-elastic-block-store-ebs-csi-driver"><span>Amazon Elastic Block Store (EBS) CSI driver</span></a></h3><p><a href="https://github.com/kubernetes-sigs/aws-ebs-csi-driver" target="_blank" rel="noopener noreferrer">Amazon Elastic Block Store (EBS) CSI driver</a></p><ul><li><a href="https://github.com/kubernetes-sigs/aws-ebs-csi-driver/tree/master/charts/aws-ebs-csi-driver" target="_blank" rel="noopener noreferrer">aws-ebs-csi-driver</a></li><li><a href="https://github.com/kubernetes-sigs/aws-ebs-csi-driver/blob/master/charts/aws-ebs-csi-driver/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/aws-ebs-csi-driver</span>
<span class="line"></span>
<span class="line">flux create helmrelease aws-ebs-csi-driver <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;aws-ebs-csi-driver&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/aws-ebs-csi-driver.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;aws-ebs-csi-driver&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;2.6.2&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/aws-ebs-csi-driver-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/aws-ebs-csi-driver/aws-ebs-csi-driver-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/aws-ebs-csi-driver/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/aws-ebs-csi-driver&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/aws-ebs-csi-driver</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line">flux create kustomization aws-ebs-csi-driver <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --depends-on<span class="token operator">=</span><span class="token string">&quot;external-snapshotter&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: aws-ebs-csi-driver</span>
<span class="line">resources:</span>
<span class="line">  - gp2-non-default-class.yaml</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/aws-ebs-csi-driver</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: aws-ebs-csi-driver-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>aws-ebs-csi-driver-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization/aws-ebs-csi-driver-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">controller:</span>
<span class="line">  serviceAccount:</span>
<span class="line">    create: <span class="token boolean">false</span></span>
<span class="line">    name: ebs-csi-controller-sa</span>
<span class="line">storageClasses:</span>
<span class="line">- name: gp3</span>
<span class="line">  annotations:</span>
<span class="line">    storageclass.kubernetes.io/is-default-class: <span class="token string">&quot;true&quot;</span></span>
<span class="line">  parameters:</span>
<span class="line">    encrypted: <span class="token string">&quot;true&quot;</span></span>
<span class="line">    <span class="token comment"># Not working :-(</span></span>
<span class="line">    <span class="token comment"># kmskeyid: \${AWS_KMS_KEY_ARN}</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization/gp2-non-default-class.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: storage.k8s.io/v1</span>
<span class="line">kind: StorageClass</span>
<span class="line">metadata:</span>
<span class="line">  annotations:</span>
<span class="line">    storageclass.kubernetes.io/is-default-class: <span class="token string">&quot;false&quot;</span></span>
<span class="line">  name: gp2</span>
<span class="line">parameters:</span>
<span class="line">  fsType: ext4</span>
<span class="line">  type: gp2</span>
<span class="line">provisioner: kubernetes.io/aws-ebs</span>
<span class="line">reclaimPolicy: Delete</span>
<span class="line">volumeBindingMode: WaitForFirstConsumer</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- aws-ebs-csi-driver$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource aws-ebs-csi-driver <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Change the &quot;aws-ebs-csi-driver tags&quot; on the Cluster level, because they will be different for every cluster and it needs to be &quot;set&quot; form <code>TAGS</code> bash variable:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;name: aws-ebs-csi-driver$&#39;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token function">cat</span> <span class="token operator">&gt;&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">patchesStrategicMerge:</span>
<span class="line">- |-</span>
<span class="line">  apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">  kind: Kustomization</span>
<span class="line">  metadata:</span>
<span class="line">    name: aws-ebs-csi-driver</span>
<span class="line">    namespace: flux-system</span>
<span class="line">  spec:</span>
<span class="line">    patches:</span>
<span class="line">      - target:</span>
<span class="line">          kind: HelmRelease</span>
<span class="line">          name: aws-ebs-csi-driver</span>
<span class="line">          namespace: aws-ebs-csi-driver</span>
<span class="line">        patch: |-</span>
<span class="line">          apiVersion: helm.toolkit.fluxcd.io/v2beta1</span>
<span class="line">          kind: HelmRelease</span>
<span class="line">          metadata:</span>
<span class="line">            name: not-used</span>
<span class="line">          spec:</span>
<span class="line">            values:</span>
<span class="line">              controller:</span>
<span class="line">                k8sTagClusterId: <span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">                extraVolumeTags:</span>
<span class="line">                  Name: <span class="token variable">\${GITHUB_USER}</span>-\\<span class="token variable">\${CLUSTER_NAME}</span></span>
<span class="line">                  Cluster: \\<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">                  <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">\${TAGS}</span>&quot;</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">&quot;s/ /<span class="token entity" title="\\\\">\\\\</span>n                  /g; s/=/: /g&quot;</span><span class="token variable">)</span></span></span>
<span class="line">EOF</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="crossplane" tabindex="-1"><a class="header-anchor" href="#crossplane"><span>Crossplane</span></a></h3><p><a href="https://crossplane.io/" target="_blank" rel="noopener noreferrer">Crossplane</a></p><ul><li><a href="https://github.com/crossplane/crossplane" target="_blank" rel="noopener noreferrer">crossplane</a></li><li><a href="https://github.com/crossplane/crossplane/blob/770ea1cfe73068ea012a50541740fdda783da308/cluster/charts/crossplane/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/crossplane</span>
<span class="line"></span>
<span class="line">kubectl create namespace crossplane-system --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/crossplane/crossplane-namespace.yaml</span>
<span class="line"></span>
<span class="line">flux create helmrelease crossplane <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;crossplane-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/crossplane-stable.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;crossplane&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;1.5.1&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/crossplane/crossplane-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/crossplane/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/crossplane&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/crossplane</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-pv</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane&quot;</span>/crossplane-<span class="token punctuation">{</span>kustomization,kustomization-provider,kustomization-providerconfig<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">flux create kustomization crossplane <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span></span>
<span class="line">    <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">      kustomize create <span class="token parameter variable">--resources</span> <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/crossplane <span class="token operator">&amp;&amp;</span></span>
<span class="line">      <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span></span>
<span class="line">  <span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization-provider.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: crossplane-provider</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">    - name: crossplane</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: <span class="token string">&quot;./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization-provider&quot;</span></span>
<span class="line">  prune: <span class="token boolean">true</span></span>
<span class="line">  wait: <span class="token boolean">true</span></span>
<span class="line">  sourceRef:</span>
<span class="line">    kind: GitRepository</span>
<span class="line">    name: flux-system</span>
<span class="line">    namespace: flux-system</span>
<span class="line">  postBuild:</span>
<span class="line">    substituteFrom:</span>
<span class="line">    - kind: Secret</span>
<span class="line">      name: cluster-apps-substitutefrom-secret</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization-provider/crossplane-provider-aws.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: pkg.crossplane.io/v1</span>
<span class="line">kind: Provider</span>
<span class="line">metadata:</span>
<span class="line">  name: provider-aws</span>
<span class="line">  namespace: crossplane-system</span>
<span class="line">spec:</span>
<span class="line">  package: crossplane/provider-aws:v0.22.0</span>
<span class="line">  controllerConfigRef:</span>
<span class="line">    name: aws-config</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization-provider/crossplane-controllerconfig-aws.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: pkg.crossplane.io/v1alpha1</span>
<span class="line">kind: ControllerConfig</span>
<span class="line">metadata:</span>
<span class="line">  name: aws-config</span>
<span class="line">  namespace: crossplane-system</span>
<span class="line">  annotations:</span>
<span class="line">    eks.amazonaws.com/role-arn: arn:aws:iam::<span class="token variable">\${AWS_ACCOUNT_ID}</span>:role/crossplane-provider-aws-<span class="token variable">\${CLUSTER_NAME}</span></span>
<span class="line">spec:</span>
<span class="line">  podSecurityContext:</span>
<span class="line">    fsGroup: <span class="token number">2000</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line">flux create kustomization crossplane-providerconfig <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --depends-on<span class="token operator">=</span><span class="token string">&quot;crossplane-provider&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization-providerconfig&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization-providerconfig.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization-providerconfig/crossplane-providerconfig-aws.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: aws.crossplane.io/v1beta1</span>
<span class="line">kind: ProviderConfig</span>
<span class="line">metadata:</span>
<span class="line">  name: aws-provider</span>
<span class="line">  namespace: crossplane-system</span>
<span class="line">spec:</span>
<span class="line">  credentials:</span>
<span class="line">    source: InjectedIdentity</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- crossplane$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource crossplane <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="csi-snapshotter" tabindex="-1"><a class="header-anchor" href="#csi-snapshotter"><span>CSI Snapshotter</span></a></h3><p>Details about EKS and <code>external-snapshotter</code> can be found here: <a href="https://aws.amazon.com/blogs/containers/using-ebs-snapshots-for-persistent-storage-with-your-eks-cluster" target="_blank" rel="noopener noreferrer">Using EBS Snapshots for persistent storage with your EKS cluster</a></p><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/external-snapshotter</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> infrastructure/base/external-snapshotter/kustomization.yaml <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">resources:</span>
<span class="line">  - https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/v4.2.1/client/config/crd/snapshot.storage.k8s.io_volumesnapshotclasses.yaml</span>
<span class="line">  - https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/v4.2.1/client/config/crd/snapshot.storage.k8s.io_volumesnapshotcontents.yaml</span>
<span class="line">  - https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/v4.2.1/client/config/crd/snapshot.storage.k8s.io_volumesnapshots.yaml</span>
<span class="line">  - https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/v4.2.1/deploy/kubernetes/snapshot-controller/rbac-snapshot-controller.yaml</span>
<span class="line">  - https://raw.githubusercontent.com/kubernetes-csi/external-snapshotter/v4.2.1/deploy/kubernetes/snapshot-controller/setup-snapshot-controller.yaml</span>
<span class="line">EOF</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/external-snapshotter</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter/external-snapshotter-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line">flux create kustomization external-snapshotter <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter/external-snapshotter-kustomization&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter/external-snapshotter-kustomization.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter/external-snapshotter-kustomization/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span></span>
<span class="line">    <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter/external-snapshotter-kustomization&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">      kustomize create <span class="token parameter variable">--resources</span> <span class="token string">&quot;../../../base/external-snapshotter&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">      <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span></span>
<span class="line">  <span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- external-snapshotter$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource external-snapshotter <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="kubernetes-metrics-server" tabindex="-1"><a class="header-anchor" href="#kubernetes-metrics-server"><span>Kubernetes Metrics Server</span></a></h3><p><a href="https://github.com/kubernetes-sigs/metrics-server" target="_blank" rel="noopener noreferrer">Kubernetes Metrics Server</a></p><ul><li><a href="https://artifacthub.io/packages/helm/bitnami/metrics-server" target="_blank" rel="noopener noreferrer">metrics-server</a></li><li><a href="https://github.com/bitnami/charts/blob/master/bitnami/metrics-server/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/metrics-server</span>
<span class="line"></span>
<span class="line">kubectl create namespace metrics-server --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/metrics-server/metrics-server-namespace.yaml</span>
<span class="line"></span>
<span class="line">flux create helmrelease metrics-server <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;metrics-server&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/bitnami.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;metrics-server&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;5.10.12&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/metrics-server-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/metrics-server/metrics-server-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/metrics-server/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/metrics-server&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/metrics-server</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/metrics-server&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/metrics-server/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/metrics-server/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: metrics-server</span>
<span class="line">resources:</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/metrics-server</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: metrics-server-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>metrics-server-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/metrics-server/metrics-server-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiService:</span>
<span class="line">  create: <span class="token boolean">true</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- metrics-server$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource metrics-server <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="kube-prometheus-stack" tabindex="-1"><a class="header-anchor" href="#kube-prometheus-stack"><span>kube-prometheus-stack</span></a></h3><p><a href="https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack" target="_blank" rel="noopener noreferrer">kube-prometheus-stack</a></p><ul><li><a href="https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack" target="_blank" rel="noopener noreferrer">kube-prometheus-stack</a></li><li><a href="https://github.com/prometheus-community/helm-charts/blob/main/charts/kube-prometheus-stack/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/kube-prometheus-stack</span>
<span class="line"></span>
<span class="line">kubectl create namespace kube-prometheus-stack --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/kube-prometheus-stack/kube-prometheus-stack-namespace.yaml</span>
<span class="line"></span>
<span class="line">flux create helmrelease kube-prometheus-stack <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;kube-prometheus-stack&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/prometheus-community.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;kube-prometheus-stack&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;27.0.0&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--crds</span><span class="token operator">=</span><span class="token string">&quot;CreateReplace&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/kube-prometheus-stack-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/kube-prometheus-stack/kube-prometheus-stack-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/kube-prometheus-stack/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/kube-prometheus-stack&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/kube-prometheus-stack</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kube-prometheus-stack/kube-prometheus-stack-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kube-prometheus-stack/kube-prometheus-stack-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: kube-prometheus-stack</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">    - name: aws-ebs-csi-driver</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kube-prometheus-stack/kube-prometheus-stack-kustomization</span>
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
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kube-prometheus-stack/kube-prometheus-stack-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kube-prometheus-stack/kube-prometheus-stack-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: kube-prometheus-stack</span>
<span class="line">resources:</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/kube-prometheus-stack</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: kube-prometheus-stack-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>kube-prometheus-stack-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kube-prometheus-stack/kube-prometheus-stack-kustomization/kube-prometheus-stack-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">defaultRules:</span>
<span class="line">  rules:</span>
<span class="line">    etcd: <span class="token boolean">false</span></span>
<span class="line">    kubernetesSystem: <span class="token boolean">false</span></span>
<span class="line">    kubeScheduler: <span class="token boolean">false</span></span>
<span class="line">additionalPrometheusRulesMap:</span>
<span class="line">  <span class="token comment"># Flux rule: https://toolkit.fluxcd.io/guides/monitoring/</span></span>
<span class="line">  rule-name:</span>
<span class="line">    groups:</span>
<span class="line">    - name: GitOpsToolkit</span>
<span class="line">      rules:</span>
<span class="line">      - alert: ReconciliationFailure</span>
<span class="line">        expr: max<span class="token punctuation">(</span>gotk_reconcile_condition<span class="token punctuation">{</span>status<span class="token operator">=</span><span class="token string">&quot;False&quot;</span>,type<span class="token operator">=</span><span class="token string">&quot;Ready&quot;</span><span class="token punctuation">}</span><span class="token punctuation">)</span> by <span class="token punctuation">(</span>namespace, name, kind<span class="token punctuation">)</span> + on<span class="token punctuation">(</span>namespace, name, kind<span class="token punctuation">)</span> <span class="token punctuation">(</span>max<span class="token punctuation">(</span>gotk_reconcile_condition<span class="token punctuation">{</span>status<span class="token operator">=</span><span class="token string">&quot;Deleted&quot;</span><span class="token punctuation">}</span><span class="token punctuation">)</span> by <span class="token punctuation">(</span>namespace, name, kind<span class="token punctuation">))</span> * <span class="token number">2</span> <span class="token operator">==</span> <span class="token number">1</span></span>
<span class="line">        for: 10m</span>
<span class="line">        labels:</span>
<span class="line">          severity: page</span>
<span class="line">        annotations:</span>
<span class="line">          summary: <span class="token string">&#39;{{ $labels.kind }} {{ $labels.namespace }}/{{ $labels.name }} reconciliation has been failing for more than ten minutes.&#39;</span></span>
<span class="line">alertmanager:</span>
<span class="line">  config:</span>
<span class="line">    global:</span>
<span class="line">      slack_api_url: <span class="token variable">\${SLACK_INCOMING_WEBHOOK_URL}</span></span>
<span class="line">      smtp_smarthost: <span class="token string">&quot;mailhog.mailhog.svc.cluster.local:1025&quot;</span></span>
<span class="line">      smtp_from: <span class="token string">&quot;alertmanager@<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span></span>
<span class="line">    route:</span>
<span class="line">      group_by: <span class="token punctuation">[</span><span class="token string">&quot;alertname&quot;</span>, <span class="token string">&quot;job&quot;</span><span class="token punctuation">]</span></span>
<span class="line">      receiver: slack-notifications</span>
<span class="line">      routes:</span>
<span class="line">        - match:</span>
<span class="line">            severity: warning</span>
<span class="line">          continue: <span class="token boolean">true</span></span>
<span class="line">          receiver: slack-notifications</span>
<span class="line">        - match:</span>
<span class="line">            severity: warning</span>
<span class="line">          receiver: email-notifications</span>
<span class="line">    receivers:</span>
<span class="line">      - name: <span class="token string">&quot;email-notifications&quot;</span></span>
<span class="line">        email_configs:</span>
<span class="line">        - to: <span class="token string">&quot;notification@<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span></span>
<span class="line">          require_tls: <span class="token boolean">false</span></span>
<span class="line">      - name: <span class="token string">&quot;slack-notifications&quot;</span></span>
<span class="line">        slack_configs:</span>
<span class="line">          - channel: <span class="token string">&quot;#<span class="token variable">\${SLACK_CHANNEL}</span>&quot;</span></span>
<span class="line">            send_resolved: True</span>
<span class="line">            icon_url: <span class="token string">&quot;https://avatars3.githubusercontent.com/u/3380462&quot;</span></span>
<span class="line">            title: <span class="token string">&#39;{{ template &quot;slack.cp.title&quot; . }}&#39;</span></span>
<span class="line">            text: <span class="token string">&#39;{{ template &quot;slack.cp.text&quot; . }}&#39;</span></span>
<span class="line">            footer: <span class="token string">&quot;https://<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span></span>
<span class="line">            actions:</span>
<span class="line">              - type: button</span>
<span class="line">                text: <span class="token string">&#39;Runbook :blue_book:&#39;</span></span>
<span class="line">                url: <span class="token string">&#39;{{ (index .Alerts 0).Annotations.runbook_url }}&#39;</span></span>
<span class="line">              - type: button</span>
<span class="line">                text: <span class="token string">&#39;Query :mag:&#39;</span></span>
<span class="line">                url: <span class="token string">&#39;{{ (index .Alerts 0).GeneratorURL }}&#39;</span></span>
<span class="line">              - type: button</span>
<span class="line">                text: <span class="token string">&#39;Silence :no_bell:&#39;</span></span>
<span class="line">                url: <span class="token string">&#39;{{ template &quot;__alert_silence_link&quot; . }}&#39;</span></span>
<span class="line">    templates:</span>
<span class="line">      - <span class="token string">&quot;/etc/alertmanager/config/cp-slack-templates.tmpl&quot;</span></span>
<span class="line">  templateFiles:</span>
<span class="line">    cp-slack-templates.tmpl: <span class="token operator">|</span>-</span>
<span class="line">      <span class="token punctuation">{</span><span class="token punctuation">{</span> define <span class="token string">&quot;slack.cp.title&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">[</span><span class="token punctuation">{</span><span class="token punctuation">{</span> .Status <span class="token operator">|</span> toUpper -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token keyword">if</span> eq .Status <span class="token string">&quot;firing&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>:<span class="token punctuation">{</span><span class="token punctuation">{</span> .Alerts.Firing <span class="token operator">|</span> len <span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">{</span><span class="token punctuation">{</span>- end -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">]</span> <span class="token punctuation">{</span><span class="token punctuation">{</span> template <span class="token string">&quot;__alert_severity_prefix_title&quot;</span> <span class="token builtin class-name">.</span> <span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token punctuation">{</span><span class="token punctuation">{</span> .CommonLabels.alertname <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">{</span><span class="token punctuation">{</span>- end <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">{</span><span class="token punctuation">{</span>/* The <span class="token builtin class-name">test</span> to display <span class="token keyword">in</span> the alert */<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">{</span><span class="token punctuation">{</span> define <span class="token string">&quot;slack.cp.text&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">{</span><span class="token punctuation">{</span> range .Alerts <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">            *Alert:* <span class="token punctuation">{</span><span class="token punctuation">{</span> .Annotations.message<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">            *Details:*</span>
<span class="line">            <span class="token punctuation">{</span><span class="token punctuation">{</span> range .Labels.SortedPairs <span class="token punctuation">}</span><span class="token punctuation">}</span> - *<span class="token punctuation">{</span><span class="token punctuation">{</span> .Name <span class="token punctuation">}</span><span class="token punctuation">}</span>:* <span class="token variable"><span class="token variable">\`</span><span class="token punctuation">{</span><span class="token punctuation">{</span> .Value <span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token variable">\`</span></span></span>
<span class="line">            <span class="token punctuation">{</span><span class="token punctuation">{</span> end <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">            *-----*</span>
<span class="line">          <span class="token punctuation">{</span><span class="token punctuation">{</span> end <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">{</span><span class="token punctuation">{</span>- end <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">{</span><span class="token punctuation">{</span> define <span class="token string">&quot;__alert_silence_link&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">{</span><span class="token punctuation">{</span> .ExternalURL <span class="token punctuation">}</span><span class="token punctuation">}</span>/<span class="token comment">#/silences/new?filter=%7B</span></span>
<span class="line">        <span class="token punctuation">{</span><span class="token punctuation">{</span>- range .CommonLabels.SortedPairs -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">          <span class="token punctuation">{</span><span class="token punctuation">{</span>- <span class="token keyword">if</span> ne .Name <span class="token string">&quot;alertname&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">{</span><span class="token punctuation">{</span>- .Name <span class="token punctuation">}</span><span class="token punctuation">}</span>%3D<span class="token string">&quot;{{- .Value -}}&quot;</span>%2C%20</span>
<span class="line">          <span class="token punctuation">{</span><span class="token punctuation">{</span>- end -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">{</span><span class="token punctuation">{</span>- end -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">          alertname%3D<span class="token string">&quot;{{ .CommonLabels.alertname }}&quot;</span>%7D</span>
<span class="line">      <span class="token punctuation">{</span><span class="token punctuation">{</span>- end <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">{</span><span class="token punctuation">{</span> define <span class="token string">&quot;__alert_severity_prefix&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">          <span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token keyword">if</span> ne .Status <span class="token string">&quot;firing&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">          :white_check_mark:</span>
<span class="line">          <span class="token punctuation">{</span><span class="token punctuation">{</span>- <span class="token keyword">else</span> <span class="token keyword">if</span> eq .Labels.severity <span class="token string">&quot;critical&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">          :fire:</span>
<span class="line">          <span class="token punctuation">{</span><span class="token punctuation">{</span>- <span class="token keyword">else</span> <span class="token keyword">if</span> eq .Labels.severity <span class="token string">&quot;warning&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">          :warning:</span>
<span class="line">          <span class="token punctuation">{</span><span class="token punctuation">{</span>- <span class="token keyword">else</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">          :question:</span>
<span class="line">          <span class="token punctuation">{</span><span class="token punctuation">{</span>- end <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">{</span><span class="token punctuation">{</span>- end <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">{</span><span class="token punctuation">{</span> define <span class="token string">&quot;__alert_severity_prefix_title&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">          <span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token keyword">if</span> ne .Status <span class="token string">&quot;firing&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">          :white_check_mark:</span>
<span class="line">          <span class="token punctuation">{</span><span class="token punctuation">{</span>- <span class="token keyword">else</span> <span class="token keyword">if</span> eq .CommonLabels.severity <span class="token string">&quot;critical&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">          :fire:</span>
<span class="line">          <span class="token punctuation">{</span><span class="token punctuation">{</span>- <span class="token keyword">else</span> <span class="token keyword">if</span> eq .CommonLabels.severity <span class="token string">&quot;warning&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">          :warning:</span>
<span class="line">          <span class="token punctuation">{</span><span class="token punctuation">{</span>- <span class="token keyword">else</span> <span class="token keyword">if</span> eq .CommonLabels.severity <span class="token string">&quot;info&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">          :information_source:</span>
<span class="line">          <span class="token punctuation">{</span><span class="token punctuation">{</span>- <span class="token keyword">else</span> <span class="token keyword">if</span> eq .CommonLabels.status_icon <span class="token string">&quot;information&quot;</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">          :information_source:</span>
<span class="line">          <span class="token punctuation">{</span><span class="token punctuation">{</span>- <span class="token keyword">else</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">          :question:</span>
<span class="line">          <span class="token punctuation">{</span><span class="token punctuation">{</span>- end <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">{</span><span class="token punctuation">{</span>- end <span class="token punctuation">}</span><span class="token punctuation">}</span></span>
<span class="line">  ingress:</span>
<span class="line">    enabled: <span class="token boolean">true</span></span>
<span class="line">    ingressClassName: nginx</span>
<span class="line">    annotations:</span>
<span class="line">      nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth</span>
<span class="line">      nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd<span class="token operator">=</span><span class="token variable">$scheme</span>://<span class="token variable">$host</span><span class="token variable">$request_uri</span></span>
<span class="line">    hosts:</span>
<span class="line">      - alertmanager.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">    paths: <span class="token punctuation">[</span><span class="token string">&quot;/&quot;</span><span class="token punctuation">]</span></span>
<span class="line">    pathType: ImplementationSpecific</span>
<span class="line">    tls:</span>
<span class="line">      - hosts:</span>
<span class="line">        - alertmanager.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line"><span class="token comment"># https://github.com/grafana/helm-charts/blob/main/charts/grafana/values.yaml</span></span>
<span class="line">grafana:</span>
<span class="line">  ingress:</span>
<span class="line">    enabled: <span class="token boolean">true</span></span>
<span class="line">    ingressClassName: nginx</span>
<span class="line">    annotations:</span>
<span class="line">      nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth</span>
<span class="line">      nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd<span class="token operator">=</span><span class="token variable">$scheme</span>://<span class="token variable">$host</span><span class="token variable">$request_uri</span></span>
<span class="line">    hosts:</span>
<span class="line">      - grafana.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">    paths: <span class="token punctuation">[</span><span class="token string">&quot;/&quot;</span><span class="token punctuation">]</span></span>
<span class="line">    pathType: ImplementationSpecific</span>
<span class="line">    tls:</span>
<span class="line">      - hosts:</span>
<span class="line">        - grafana.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">  dashboardProviders:</span>
<span class="line">    dashboardproviders.yaml:</span>
<span class="line">      apiVersion: <span class="token number">1</span></span>
<span class="line">      providers:</span>
<span class="line">        - name: <span class="token string">&quot;default&quot;</span></span>
<span class="line">          orgId: <span class="token number">1</span></span>
<span class="line">          folder: <span class="token string">&quot;&quot;</span></span>
<span class="line">          type: <span class="token function">file</span></span>
<span class="line">          disableDeletion: <span class="token boolean">false</span></span>
<span class="line">          editable: <span class="token boolean">true</span></span>
<span class="line">          options:</span>
<span class="line">            path: /var/lib/grafana/dashboards/default</span>
<span class="line">  dashboards:</span>
<span class="line">    default:</span>
<span class="line">      k8s-cluster-summary:</span>
<span class="line">        gnetId: <span class="token number">8685</span></span>
<span class="line">        revision: <span class="token number">1</span></span>
<span class="line">        datasource: Prometheus</span>
<span class="line">      node-exporter-full:</span>
<span class="line">        gnetId: <span class="token number">1860</span></span>
<span class="line">        revision: <span class="token number">24</span></span>
<span class="line">        datasource: Prometheus</span>
<span class="line">      prometheus-2-0-overview:</span>
<span class="line">        gnetId: <span class="token number">3662</span></span>
<span class="line">        revision: <span class="token number">2</span></span>
<span class="line">        datasource: Prometheus</span>
<span class="line">      stians-disk-graphs:</span>
<span class="line">        gnetId: <span class="token number">9852</span></span>
<span class="line">        revision: <span class="token number">1</span></span>
<span class="line">        datasource: Prometheus</span>
<span class="line">      kubernetes-apiserver:</span>
<span class="line">        gnetId: <span class="token number">12006</span></span>
<span class="line">        revision: <span class="token number">1</span></span>
<span class="line">        datasource: Prometheus</span>
<span class="line">      ingress-nginx:</span>
<span class="line">        gnetId: <span class="token number">9614</span></span>
<span class="line">        revision: <span class="token number">1</span></span>
<span class="line">        datasource: Prometheus</span>
<span class="line">      ingress-nginx2:</span>
<span class="line">        gnetId: <span class="token number">11875</span></span>
<span class="line">        revision: <span class="token number">1</span></span>
<span class="line">        datasource: Prometheus</span>
<span class="line">      istio-mesh:</span>
<span class="line">        gnetId: <span class="token number">7639</span></span>
<span class="line">        revision: <span class="token number">101</span></span>
<span class="line">        datasource: Prometheus</span>
<span class="line">      istio-performance:</span>
<span class="line">        gnetId: <span class="token number">11829</span></span>
<span class="line">        revision: <span class="token number">101</span></span>
<span class="line">        datasource: Prometheus</span>
<span class="line">      istio-service:</span>
<span class="line">        gnetId: <span class="token number">7636</span></span>
<span class="line">        revision: <span class="token number">101</span></span>
<span class="line">        datasource: Prometheus</span>
<span class="line">      istio-workload:</span>
<span class="line">        gnetId: <span class="token number">7630</span></span>
<span class="line">        revision: <span class="token number">101</span></span>
<span class="line">        datasource: Prometheus</span>
<span class="line">      istio-control-plane:</span>
<span class="line">        gnetId: <span class="token number">7645</span></span>
<span class="line">        revision: <span class="token number">101</span></span>
<span class="line">        datasource: Prometheus</span>
<span class="line">      jaeger:</span>
<span class="line">        gnetId: <span class="token number">10001</span></span>
<span class="line">        revision: <span class="token number">2</span></span>
<span class="line">        datasource: Prometheus</span>
<span class="line">      <span class="token comment"># https://github.com/fluxcd/flux2/blob/main/manifests/monitoring/grafana/dashboards/cluster.json</span></span>
<span class="line">      gitops-toolkit-control-plane:</span>
<span class="line">        url: https://raw.githubusercontent.com/fluxcd/flux2/c98cd106218b0fdead155bd9a0b0a5666e5c3e15/manifests/monitoring/grafana/dashboards/control-plane.json</span>
<span class="line">        datasource: Prometheus</span>
<span class="line">      gitops-toolkit-cluster:</span>
<span class="line">        url: https://raw.githubusercontent.com/fluxcd/flux2/80cf5fa7291242f87458a426fccb57abfd8c66ee/manifests/monitoring/grafana/dashboards/cluster.json</span>
<span class="line">        datasource: Prometheus</span>
<span class="line">      kyverno-policy-report:</span>
<span class="line">        gnetId: <span class="token number">13995</span></span>
<span class="line">        revision: <span class="token number">4</span></span>
<span class="line">        datasource: Prometheus</span>
<span class="line">      kyverno-policy-reports:</span>
<span class="line">        gnetId: <span class="token number">13968</span></span>
<span class="line">        revision: <span class="token number">2</span></span>
<span class="line">        datasource: Prometheus</span>
<span class="line">      external-dns:</span>
<span class="line">        gnetId: <span class="token number">15038</span></span>
<span class="line">        revision: <span class="token number">1</span></span>
<span class="line">        datasource: Prometheus</span>
<span class="line">      kubernetes-monitor:</span>
<span class="line">        gnetId: <span class="token number">15398</span></span>
<span class="line">        revision: <span class="token number">5</span></span>
<span class="line">        datasource: Prometheus</span>
<span class="line">      cluster-autoscaler-stats:</span>
<span class="line">        gnetId: <span class="token number">12623</span></span>
<span class="line">        revision: <span class="token number">1</span></span>
<span class="line">        datasource: Prometheus</span>
<span class="line">      kubernetes-addons-velero-stats:</span>
<span class="line">        gnetId: <span class="token number">11055</span></span>
<span class="line">        revision: <span class="token number">2</span></span>
<span class="line">        datasource: Prometheus</span>
<span class="line">  grafana.ini:</span>
<span class="line">    server:</span>
<span class="line">      root_url: https://grafana.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">    <span class="token comment"># Using oauth2-proxy instead of default Grafana Oauth</span></span>
<span class="line">    auth.anonymous:</span>
<span class="line">      enabled: <span class="token boolean">true</span></span>
<span class="line">      org_role: Admin</span>
<span class="line">  smtp:</span>
<span class="line">    enabled: <span class="token boolean">true</span></span>
<span class="line">    host: <span class="token string">&quot;mailhog.mailhog.svc.cluster.local:1025&quot;</span></span>
<span class="line">    from_address: grafana@<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">kubeControllerManager:</span>
<span class="line">  enabled: <span class="token boolean">false</span></span>
<span class="line">kubeEtcd:</span>
<span class="line">  enabled: <span class="token boolean">false</span></span>
<span class="line">kubeScheduler:</span>
<span class="line">  enabled: <span class="token boolean">false</span></span>
<span class="line">kubeProxy:</span>
<span class="line">  enabled: <span class="token boolean">false</span></span>
<span class="line">prometheusOperator:</span>
<span class="line">  tls:</span>
<span class="line">    enabled: <span class="token boolean">false</span></span>
<span class="line">  admissionWebhooks:</span>
<span class="line">    enabled: <span class="token boolean">false</span></span>
<span class="line">prometheus:</span>
<span class="line">  ingress:</span>
<span class="line">    enabled: <span class="token boolean">true</span></span>
<span class="line">    ingressClassName: nginx</span>
<span class="line">    annotations:</span>
<span class="line">      nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth</span>
<span class="line">      nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd<span class="token operator">=</span><span class="token variable">$scheme</span>://<span class="token variable">$host</span><span class="token variable">$request_uri</span></span>
<span class="line">    paths: <span class="token punctuation">[</span><span class="token string">&quot;/&quot;</span><span class="token punctuation">]</span></span>
<span class="line">    pathType: ImplementationSpecific</span>
<span class="line">    hosts:</span>
<span class="line">      - prometheus.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">    tls:</span>
<span class="line">      - hosts:</span>
<span class="line">        - prometheus.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">  prometheusSpec:</span>
<span class="line">    externalLabels:</span>
<span class="line">      cluster: <span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">    externalUrl: https://prometheus.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">    ruleSelectorNilUsesHelmValues: <span class="token boolean">false</span></span>
<span class="line">    serviceMonitorSelectorNilUsesHelmValues: <span class="token boolean">false</span></span>
<span class="line">    podMonitorSelectorNilUsesHelmValues: <span class="token boolean">false</span></span>
<span class="line">    retention: 7d</span>
<span class="line">    retentionSize: 1GB</span>
<span class="line">    walCompression: <span class="token boolean">true</span></span>
<span class="line">    externalLabels:</span>
<span class="line">      cluster: <span class="token string">&quot;<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span></span>
<span class="line">    storageSpec:</span>
<span class="line">      volumeClaimTemplate:</span>
<span class="line">        spec:</span>
<span class="line">          storageClassName: gp3</span>
<span class="line">          accessModes: <span class="token punctuation">[</span><span class="token string">&quot;ReadWriteOnce&quot;</span><span class="token punctuation">]</span></span>
<span class="line">          resources:</span>
<span class="line">            requests:</span>
<span class="line">              storage: 2Gi</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kube-prometheus-stack/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kube-prometheus-stack&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- kube-prometheus-stack$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource kube-prometheus-stack <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="cert-manager" tabindex="-1"><a class="header-anchor" href="#cert-manager"><span>cert-manager</span></a></h3><p><a href="https://cert-manager.io/" target="_blank" rel="noopener noreferrer">cert-manager</a></p><ul><li><a href="https://artifacthub.io/packages/helm/jetstack/cert-manager" target="_blank" rel="noopener noreferrer">cert-manager</a></li><li><a href="https://github.com/jetstack/cert-manager/blob/master/deploy/charts/cert-manager/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/cert-manager</span>
<span class="line"></span>
<span class="line">flux create helmrelease cert-manager <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;cert-manager&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/jetstack.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;cert-manager&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;v1.6.1&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/cert-manager-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/cert-manager/cert-manager-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/cert-manager/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/cert-manager&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/cert-manager</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager&quot;</span>/cert-manager-<span class="token punctuation">{</span>kustomization,kustomization-clusterissuer,kustomization-certificate<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">flux create kustomization cert-manager <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --depends-on<span class="token operator">=</span><span class="token string">&quot;kube-prometheus-stack&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: cert-manager</span>
<span class="line">resources:</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/cert-manager</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: cert-manager-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>cert-manager-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization/cert-manager-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">installCRDs: <span class="token boolean">true</span></span>
<span class="line">serviceAccount:</span>
<span class="line">  create: <span class="token boolean">false</span></span>
<span class="line">  name: cert-manager</span>
<span class="line">extraArgs:</span>
<span class="line">  - --cluster-resource-namespace<span class="token operator">=</span>cert-manager</span>
<span class="line">  - --enable-certificate-owner-ref<span class="token operator">=</span>true</span>
<span class="line">prometheus:</span>
<span class="line">  servicemonitor:</span>
<span class="line">    enabled: <span class="token boolean">true</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization-clusterissuer.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: cert-manager-clusterissuer</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">    - name: cert-manager</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: <span class="token string">&quot;./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization-clusterissuer&quot;</span></span>
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
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization-clusterissuer/cert-manager-clusterissuer-letsencrypt-staging-dns.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: cert-manager.io/v1</span>
<span class="line">kind: ClusterIssuer</span>
<span class="line">metadata:</span>
<span class="line">  name: letsencrypt-staging-dns</span>
<span class="line">  namespace: cert-manager</span>
<span class="line">spec:</span>
<span class="line">  acme:</span>
<span class="line">    server: https://acme-staging-v02.api.letsencrypt.org/directory</span>
<span class="line">    email: <span class="token variable">\${MY_EMAIL}</span></span>
<span class="line">    privateKeySecretRef:</span>
<span class="line">      name: letsencrypt-staging-dns</span>
<span class="line">    solvers:</span>
<span class="line">      - selector:</span>
<span class="line">          dnsZones:</span>
<span class="line">            - <span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">        dns01:</span>
<span class="line">          route53:</span>
<span class="line">            region: <span class="token variable">\${AWS_DEFAULT_REGION}</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization-clusterissuer/cert-manager-clusterissuer-letsencrypt-production-dns.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: cert-manager.io/v1</span>
<span class="line">kind: ClusterIssuer</span>
<span class="line">metadata:</span>
<span class="line">  name: letsencrypt-production-dns</span>
<span class="line">  namespace: cert-manager</span>
<span class="line">spec:</span>
<span class="line">  acme:</span>
<span class="line">    server: https://acme-v02.api.letsencrypt.org/directory</span>
<span class="line">    email: <span class="token variable">\${MY_EMAIL}</span></span>
<span class="line">    privateKeySecretRef:</span>
<span class="line">      name: letsencrypt-production-dns</span>
<span class="line">    solvers:</span>
<span class="line">      - selector:</span>
<span class="line">          dnsZones:</span>
<span class="line">            - <span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">        dns01:</span>
<span class="line">          route53:</span>
<span class="line">            region: <span class="token variable">\${AWS_DEFAULT_REGION}</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization-certificate.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: cert-manager-certificate</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">    - name: cert-manager-clusterissuer</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: <span class="token string">&quot;./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization-certificate&quot;</span></span>
<span class="line">  prune: <span class="token boolean">true</span></span>
<span class="line">  sourceRef:</span>
<span class="line">    kind: GitRepository</span>
<span class="line">    name: flux-system</span>
<span class="line">    namespace: flux-system</span>
<span class="line">  wait: <span class="token boolean">true</span></span>
<span class="line">  timeout: 10m</span>
<span class="line">  postBuild:</span>
<span class="line">    substituteFrom:</span>
<span class="line">    - kind: Secret</span>
<span class="line">      name: cluster-apps-substitutefrom-secret</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization-certificate/cert-manager-certificate.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: cert-manager.io/v1</span>
<span class="line">kind: Certificate</span>
<span class="line">metadata:</span>
<span class="line">  name: ingress-cert-<span class="token variable">\${LETSENCRYPT_ENVIRONMENT}</span></span>
<span class="line">  namespace: cert-manager</span>
<span class="line">spec:</span>
<span class="line">  secretName: ingress-cert-<span class="token variable">\${LETSENCRYPT_ENVIRONMENT}</span></span>
<span class="line">  secretTemplate:</span>
<span class="line">    annotations:</span>
<span class="line">      kubed.appscode.com/sync: cert-manager-cert-<span class="token variable">\${LETSENCRYPT_ENVIRONMENT}</span><span class="token operator">=</span>copy</span>
<span class="line">  issuerRef:</span>
<span class="line">    name: letsencrypt-<span class="token variable">\${LETSENCRYPT_ENVIRONMENT}</span>-dns</span>
<span class="line">    kind: ClusterIssuer</span>
<span class="line">  commonName: <span class="token string">&quot;*.<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span></span>
<span class="line">  dnsNames:</span>
<span class="line">    - <span class="token string">&quot;*.<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span></span>
<span class="line">    - <span class="token string">&quot;<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- cert-manager$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource cert-manager <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="cluster-autoscaler" tabindex="-1"><a class="header-anchor" href="#cluster-autoscaler"><span>cluster-autoscaler</span></a></h3><p><a href="https://github.com/kubernetes/autoscaler" target="_blank" rel="noopener noreferrer">cluster-autoscaler</a></p><ul><li><a href="https://artifacthub.io/packages/helm/cluster-autoscaler/cluster-autoscaler" target="_blank" rel="noopener noreferrer">cluster-autoscaler</a></li><li><a href="https://github.com/kubernetes/autoscaler/blob/master/charts/cluster-autoscaler/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/cluster-autoscaler</span>
<span class="line"></span>
<span class="line">flux create helmrelease cluster-autoscaler <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;cluster-autoscaler&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/autoscaler.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;cluster-autoscaler&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;9.11.0&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/cluster-autoscaler-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/cluster-autoscaler/cluster-autoscaler-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/cluster-autoscaler/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/cluster-autoscaler&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/cluster-autoscaler</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cluster-autoscaler/cluster-autoscaler-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cluster-autoscaler/cluster-autoscaler-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: cluster-autoscaler</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">    - name: kube-prometheus-stack</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cluster-autoscaler/cluster-autoscaler-kustomization</span>
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
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cluster-autoscaler/cluster-autoscaler-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cluster-autoscaler/cluster-autoscaler-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: cluster-autoscaler</span>
<span class="line">resources:</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/cluster-autoscaler</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: cluster-autoscaler-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>cluster-autoscaler-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cluster-autoscaler/cluster-autoscaler-kustomization/cluster-autoscaler-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">autoDiscovery:</span>
<span class="line">  clusterName: <span class="token variable">\${CLUSTER_NAME}</span></span>
<span class="line">awsRegion: <span class="token variable">\${AWS_DEFAULT_REGION}</span></span>
<span class="line"><span class="token comment"># Required to fix IMDSv2 issue: https://github.com/kubernetes/autoscaler/issues/3592</span></span>
<span class="line">extraArgs:</span>
<span class="line">  aws-use-static-instance-list: <span class="token boolean">true</span></span>
<span class="line">rbac:</span>
<span class="line">  serviceAccount:</span>
<span class="line">    create: <span class="token boolean">false</span></span>
<span class="line">    name: cluster-autoscaler</span>
<span class="line">serviceMonitor:</span>
<span class="line">  enabled: <span class="token boolean">true</span></span>
<span class="line">  namespace: kube-prometheus-stack</span>
<span class="line">prometheusRule:</span>
<span class="line">  enabled: <span class="token boolean">true</span></span>
<span class="line">  namespace: kube-prometheus-stack</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cluster-autoscaler/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cluster-autoscaler&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- cluster-autoscaler$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource cluster-autoscaler <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="dex" tabindex="-1"><a class="header-anchor" href="#dex"><span>Dex</span></a></h3><p><a href="https://dexidp.io/" target="_blank" rel="noopener noreferrer">Dex</a></p><ul><li><a href="https://artifacthub.io/packages/helm/dex/dex" target="_blank" rel="noopener noreferrer">dex</a></li><li><a href="https://github.com/dexidp/helm-charts/blob/master/charts/dex/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/dex</span>
<span class="line"></span>
<span class="line">kubectl create namespace dex --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/dex/dex-namespace.yaml</span>
<span class="line"></span>
<span class="line">flux create helmrelease dex <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;dex&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/dex.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;dex&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;0.6.3&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/dex-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/dex/dex-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/dex/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/dex&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/dex</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/dex&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/dex/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/dex/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: dex</span>
<span class="line">resources:</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/dex</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: dex-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>dex-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/dex/dex-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">ingress:</span>
<span class="line">  enabled: <span class="token boolean">true</span></span>
<span class="line">  className: nginx</span>
<span class="line">  annotations:</span>
<span class="line">    nginx.ingress.kubernetes.io/ssl-redirect: <span class="token string">&quot;false&quot;</span></span>
<span class="line">  hosts:</span>
<span class="line">    - host: dex.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">      paths:</span>
<span class="line">        - path: /</span>
<span class="line">          pathType: ImplementationSpecific</span>
<span class="line">  tls:</span>
<span class="line">    - hosts:</span>
<span class="line">      - dex.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">config:</span>
<span class="line">  issuer: https://dex.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">  storage:</span>
<span class="line">    type: kubernetes</span>
<span class="line">    config:</span>
<span class="line">      inCluster: <span class="token boolean">true</span></span>
<span class="line">  oauth2:</span>
<span class="line">    skipApprovalScreen: <span class="token boolean">true</span></span>
<span class="line">  connectors:</span>
<span class="line">    - type: github</span>
<span class="line">      id: github</span>
<span class="line">      name: GitHub</span>
<span class="line">      config:</span>
<span class="line">        clientID: <span class="token variable">\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID}</span></span>
<span class="line">        clientSecret: <span class="token variable">\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET}</span></span>
<span class="line">        redirectURI: https://dex.<span class="token variable">\${CLUSTER_FQDN}</span>/callback</span>
<span class="line">        orgs:</span>
<span class="line">          - name: <span class="token variable">\${MY_GITHUB_ORG_NAME}</span></span>
<span class="line">    - type: oidc</span>
<span class="line">      id: okta</span>
<span class="line">      name: Okta</span>
<span class="line">      config:</span>
<span class="line">        issuer: <span class="token variable">\${OKTA_ISSUER}</span></span>
<span class="line">        clientID: <span class="token variable">\${OKTA_CLIENT_ID}</span></span>
<span class="line">        clientSecret: <span class="token variable">\${OKTA_CLIENT_SECRET}</span></span>
<span class="line">        redirectURI: https://dex.<span class="token variable">\${CLUSTER_FQDN}</span>/callback</span>
<span class="line">        scopes:</span>
<span class="line">          - openid</span>
<span class="line">          - profile</span>
<span class="line">          - email</span>
<span class="line">        getUserInfo: <span class="token boolean">true</span></span>
<span class="line">  staticClients:</span>
<span class="line">    - id: kiali.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">      redirectURIs:</span>
<span class="line">        - https://kiali.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">      name: Kiali</span>
<span class="line">      secret: <span class="token variable">\${MY_PASSWORD}</span></span>
<span class="line">    - id: oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">      redirectURIs:</span>
<span class="line">        - https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/callback</span>
<span class="line">      name: OAuth2 Proxy</span>
<span class="line">      secret: <span class="token variable">\${MY_PASSWORD}</span></span>
<span class="line">  enablePasswordDB: <span class="token boolean">false</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- dex$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource dex <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="externaldns" tabindex="-1"><a class="header-anchor" href="#externaldns"><span>ExternalDNS</span></a></h3><p><a href="https://github.com/kubernetes-sigs/external-dns" target="_blank" rel="noopener noreferrer">ExternalDNS</a></p><ul><li><a href="https://artifacthub.io/packages/helm/bitnami/external-dns" target="_blank" rel="noopener noreferrer">external-dns</a></li><li><a href="https://github.com/bitnami/charts/blob/master/bitnami/external-dns/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/external-dns</span>
<span class="line"></span>
<span class="line">flux create helmrelease external-dns <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;external-dns&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/bitnami.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;external-dns&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;6.0.2&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/external-dns-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/external-dns/external-dns-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/external-dns/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/external-dns&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/external-dns</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-dns/external-dns-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-dns/external-dns-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: external-dns</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">    - name: ingress-nginx</span>
<span class="line">    - name: kube-prometheus-stack</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-dns/external-dns-kustomization</span>
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
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-dns/external-dns-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-dns/external-dns-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: external-dns</span>
<span class="line">resources:</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/external-dns</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: external-dns-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>external-dns-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-dns/external-dns-kustomization/external-dns-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">aws:</span>
<span class="line">  region: <span class="token variable">\${AWS_DEFAULT_REGION}</span></span>
<span class="line">domainFilters:</span>
<span class="line">  - <span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">interval: 20s</span>
<span class="line">policy: <span class="token function">sync</span></span>
<span class="line">serviceAccount:</span>
<span class="line">  create: <span class="token boolean">false</span></span>
<span class="line">  name: external-dns</span>
<span class="line">metrics:</span>
<span class="line">  enabled: <span class="token boolean">true</span></span>
<span class="line">  serviceMonitor:</span>
<span class="line">    enabled: <span class="token boolean">true</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-dns/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-dns&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- external-dns$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource external-dns <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="flux-provides-alerts-receivers-and-monitoring" tabindex="-1"><a class="header-anchor" href="#flux-provides-alerts-receivers-and-monitoring"><span>Flux provides, alerts, receivers and monitoring</span></a></h3><p><a href="https://fluxcd.io/" target="_blank" rel="noopener noreferrer">flux</a></p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux&quot;</span>/flux-<span class="token punctuation">{</span>kustomization-provider,kustomization-alert,kustomization-receiver,kustomization-podmonitor<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-provider.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: flux-provider</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-provider</span>
<span class="line">  prune: <span class="token boolean">true</span></span>
<span class="line">  sourceRef:</span>
<span class="line">    kind: GitRepository</span>
<span class="line">    name: flux-system</span>
<span class="line">  wait: <span class="token boolean">true</span></span>
<span class="line">  postBuild:</span>
<span class="line">    substituteFrom:</span>
<span class="line">    - kind: Secret</span>
<span class="line">      name: cluster-apps-substitutefrom-secret</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line">flux create alert-provider slack <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--type</span><span class="token operator">=</span>slack <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--channel</span><span class="token operator">=</span><span class="token string">&quot;\\<span class="token variable">\${SLACK_CHANNEL}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --secret-ref<span class="token operator">=</span>slack-url <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-provider/flux-provider-slack.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-provider/flux-provider-slack-url-secret.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: v1</span>
<span class="line">kind: Secret</span>
<span class="line">metadata:</span>
<span class="line">  name: slack-url</span>
<span class="line">  namespace: flux-system</span>
<span class="line">data:</span>
<span class="line">  address: <span class="token variable">\${SLACK_INCOMING_WEBHOOK_URL_BASE64}</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line">flux create kustomization flux-alert <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --depends-on<span class="token operator">=</span><span class="token string">&quot;flux-provider&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-alert&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-alert.yaml&quot;</span></span>
<span class="line"></span>
<span class="line">flux create alert alert-slack <span class="token punctuation">\\</span></span>
<span class="line">  --event-severity<span class="token operator">=</span>error <span class="token punctuation">\\</span></span>
<span class="line">  --event-source<span class="token operator">=</span><span class="token string">&quot;GitRepository/*,Kustomization/*,HelmRepository/*,HelmChart/*,HelmRelease/*&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --provider-ref<span class="token operator">=</span>slack <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-alert/flux-alert-slack.yaml&quot;</span></span>
<span class="line"></span>
<span class="line">flux create kustomization flux-podmonitor <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --depends-on<span class="token operator">=</span><span class="token string">&quot;kube-prometheus-stack&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--path</span><span class="token operator">=</span><span class="token string">&quot;./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-podmonitor&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--prune</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--wait</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-podmonitor.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-podmonitor/flux-podmonitor.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: monitoring.coreos.com/v1</span>
<span class="line">kind: PodMonitor</span>
<span class="line">metadata:</span>
<span class="line">  name: flux-system</span>
<span class="line">  namespace: flux-system</span>
<span class="line">  labels:</span>
<span class="line">    app.kubernetes.io/part-of: flux</span>
<span class="line">spec:</span>
<span class="line">  namespaceSelector:</span>
<span class="line">    matchNames:</span>
<span class="line">      - flux-system</span>
<span class="line">  selector:</span>
<span class="line">    matchExpressions:</span>
<span class="line">      - key: app</span>
<span class="line">        operator: In</span>
<span class="line">        values:</span>
<span class="line">          - helm-controller</span>
<span class="line">          - source-controller</span>
<span class="line">          - kustomize-controller</span>
<span class="line">          - notification-controller</span>
<span class="line">          - image-automation-controller</span>
<span class="line">          - image-reflector-controller</span>
<span class="line">  podMetricsEndpoints:</span>
<span class="line">    - port: http-prom</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-receiver.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: flux-receiver</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  <span class="token comment"># Dependency is required to prevent errors like:</span></span>
<span class="line">  <span class="token comment"># Ingress/flux-system/flux-github-receiver dry-run failed, reason: InternalError, error: Internal error occurred: failed calling webhook &quot;validate.nginx.ingress.kubernetes.io&quot;: Post &quot;https://ingress-nginx-controller-admission.ingress-nginx.svc:443/networking/v1/ingresses?timeout=10s&quot;: x509: certificate signed by unknown authority</span></span>
<span class="line">  dependsOn:</span>
<span class="line">    - name: ingress-nginx</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-receiver</span>
<span class="line">  prune: <span class="token boolean">true</span></span>
<span class="line">  sourceRef:</span>
<span class="line">    kind: GitRepository</span>
<span class="line">    name: flux-system</span>
<span class="line">  wait: <span class="token boolean">true</span></span>
<span class="line">  postBuild:</span>
<span class="line">    substituteFrom:</span>
<span class="line">    - kind: Secret</span>
<span class="line">      name: cluster-apps-substitutefrom-secret</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-receiver/flux-receiver-github-webhook-token-secret.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: v1</span>
<span class="line">kind: Secret</span>
<span class="line">metadata:</span>
<span class="line">  name: github-webhook-token</span>
<span class="line">  namespace: flux-system</span>
<span class="line">data:</span>
<span class="line">  token: <span class="token variable">\${MY_GITHUB_WEBHOOK_TOKEN_BASE64}</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line">flux create receiver github-receiver <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--type</span><span class="token operator">=</span>github <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--event</span><span class="token operator">=</span>ping <span class="token parameter variable">--event</span><span class="token operator">=</span>push <span class="token punctuation">\\</span></span>
<span class="line">  --secret-ref<span class="token operator">=</span>github-webhook-token <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--resource</span><span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-receiver/flux-receiver-github.yaml&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-receiver/flux-receiver-github-ingress.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">apiVersion: networking.k8s.io/v1</span>
<span class="line">kind: Ingress</span>
<span class="line">metadata:</span>
<span class="line">  name: flux-github-receiver</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  ingressClassName: nginx</span>
<span class="line">  rules:</span>
<span class="line">  - host: flux-receiver.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">    http:</span>
<span class="line">      paths:</span>
<span class="line">      - backend:</span>
<span class="line">          service:</span>
<span class="line">            name: webhook-receiver</span>
<span class="line">            port:</span>
<span class="line">              name: http</span>
<span class="line">        path: /</span>
<span class="line">        pathType: Prefix</span>
<span class="line">  tls:</span>
<span class="line">  - hosts:</span>
<span class="line">    - flux-receiver.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- flux$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource flux <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="ingress-nginx" tabindex="-1"><a class="header-anchor" href="#ingress-nginx"><span>ingress-nginx</span></a></h3><p><a href="https://kubernetes.github.io/ingress-nginx/" target="_blank" rel="noopener noreferrer">ingress-nginx</a></p><ul><li><a href="https://artifacthub.io/packages/helm/ingress-nginx/ingress-nginx" target="_blank" rel="noopener noreferrer">ingress-nginx</a></li><li><a href="https://github.com/kubernetes/ingress-nginx/blob/master/charts/ingress-nginx/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/ingress-nginx</span>
<span class="line"></span>
<span class="line">kubectl create namespace ingress-nginx --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/ingress-nginx/ingress-nginx-namespace.yaml</span>
<span class="line"></span>
<span class="line">flux create helmrelease ingress-nginx <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;ingress-nginx&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/ingress-nginx.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;ingress-nginx&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;4.0.13&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/ingress-nginx-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/ingress-nginx/ingress-nginx-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/ingress-nginx/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/ingress-nginx&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/ingress-nginx</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/ingress-nginx/ingress-nginx-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/ingress-nginx/ingress-nginx-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: ingress-nginx</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">    - name: kube-prometheus-stack</span>
<span class="line">    - name: cert-manager-certificate</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/ingress-nginx/ingress-nginx-kustomization</span>
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
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/ingress-nginx/ingress-nginx-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/ingress-nginx/ingress-nginx-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: ingress-nginx</span>
<span class="line">resources:</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/ingress-nginx</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: ingress-nginx-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>ingress-nginx-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/ingress-nginx/ingress-nginx-kustomization/ingress-nginx-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">controller:</span>
<span class="line">  ingressClassResource:</span>
<span class="line">    default: <span class="token boolean">true</span></span>
<span class="line">  extraArgs:</span>
<span class="line">    default-ssl-certificate: <span class="token string">&quot;cert-manager/ingress-cert-<span class="token variable">\${LETSENCRYPT_ENVIRONMENT}</span>&quot;</span></span>
<span class="line">  service:</span>
<span class="line">    annotations:</span>
<span class="line">      service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp</span>
<span class="line">      service.beta.kubernetes.io/aws-load-balancer-type: nlb</span>
<span class="line">      service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: <span class="token string">&quot;<span class="token variable">\${TAGS_INLINE}</span>&quot;</span></span>
<span class="line">  metrics:</span>
<span class="line">    enabled: <span class="token boolean">true</span></span>
<span class="line">    serviceMonitor:</span>
<span class="line">      enabled: <span class="token boolean">true</span></span>
<span class="line">    prometheusRule:</span>
<span class="line">      enabled: <span class="token boolean">true</span></span>
<span class="line">      rules:</span>
<span class="line">        - alert: NGINXConfigFailed</span>
<span class="line">          expr: count<span class="token punctuation">(</span>nginx_ingress_controller_config_last_reload_successful <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token number">0</span></span>
<span class="line">          for: 1s</span>
<span class="line">          labels:</span>
<span class="line">            severity: critical</span>
<span class="line">          annotations:</span>
<span class="line">            description: bad ingress config - nginx config <span class="token builtin class-name">test</span> failed</span>
<span class="line">            summary: uninstall the latest ingress changes to allow config reloads to resume</span>
<span class="line">        - alert: NGINXCertificateExpiry</span>
<span class="line">          expr: <span class="token punctuation">(</span>avg<span class="token punctuation">(</span>nginx_ingress_controller_ssl_expire_time_seconds<span class="token punctuation">)</span> by <span class="token punctuation">(</span>host<span class="token punctuation">)</span> - time<span class="token punctuation">(</span><span class="token punctuation">))</span> <span class="token operator">&lt;</span> <span class="token number">604800</span></span>
<span class="line">          for: 1s</span>
<span class="line">          labels:</span>
<span class="line">            severity: critical</span>
<span class="line">          annotations:</span>
<span class="line">            description: ssl certificate<span class="token punctuation">(</span>s<span class="token punctuation">)</span> will expire <span class="token keyword">in</span> <span class="token function">less</span> <span class="token keyword">then</span> a week</span>
<span class="line">            summary: renew expiring certificates to avoid downtime</span>
<span class="line">        - alert: NGINXTooMany500s</span>
<span class="line">          expr: <span class="token number">100</span> * <span class="token punctuation">(</span> sum<span class="token punctuation">(</span> nginx_ingress_controller_requests<span class="token punctuation">{</span>status<span class="token operator">=~</span><span class="token string">&quot;5.+&quot;</span><span class="token punctuation">}</span> <span class="token punctuation">)</span> / sum<span class="token punctuation">(</span>nginx_ingress_controller_requests<span class="token punctuation">)</span> <span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token number">5</span></span>
<span class="line">          for: 1m</span>
<span class="line">          labels:</span>
<span class="line">            severity: warning</span>
<span class="line">          annotations:</span>
<span class="line">            description: Too many 5XXs</span>
<span class="line">            summary: More than <span class="token number">5</span>% of all requests returned 5XX, this requires your attention</span>
<span class="line">        - alert: NGINXTooMany400s</span>
<span class="line">          expr: <span class="token number">100</span> * <span class="token punctuation">(</span> sum<span class="token punctuation">(</span> nginx_ingress_controller_requests<span class="token punctuation">{</span>status<span class="token operator">=~</span><span class="token string">&quot;4.+&quot;</span><span class="token punctuation">}</span> <span class="token punctuation">)</span> / sum<span class="token punctuation">(</span>nginx_ingress_controller_requests<span class="token punctuation">)</span> <span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token number">5</span></span>
<span class="line">          for: 1m</span>
<span class="line">          labels:</span>
<span class="line">            severity: warning</span>
<span class="line">          annotations:</span>
<span class="line">            description: Too many 4XXs</span>
<span class="line">            summary: More than <span class="token number">5</span>% of all requests returned 4XX, this requires your attention</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/ingress-nginx/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/ingress-nginx&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- ingress-nginx$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource ingress-nginx <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="mailhog" tabindex="-1"><a class="header-anchor" href="#mailhog"><span>MailHog</span></a></h3><p><a href="https://github.com/mailhog/MailHog" target="_blank" rel="noopener noreferrer">mailhog</a></p><ul><li><a href="https://artifacthub.io/packages/helm/codecentric/mailhog" target="_blank" rel="noopener noreferrer">mailhog</a></li><li><a href="https://github.com/codecentric/helm-charts/blob/master/charts/mailhog/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/mailhog</span>
<span class="line"></span>
<span class="line">kubectl create namespace mailhog --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/mailhog/mailhog-namespace.yaml</span>
<span class="line"></span>
<span class="line">flux create helmrelease mailhog <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;mailhog&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/codecentric.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;mailhog&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;5.0.2&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/mailhog-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/mailhog/mailhog-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/mailhog/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/mailhog&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/mailhog</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/mailhog&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/mailhog/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/mailhog/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: mailhog</span>
<span class="line">resources:</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/mailhog</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: mailhog-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>mailhog-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/mailhog/mailhog-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">ingress:</span>
<span class="line">  enabled: <span class="token boolean">true</span></span>
<span class="line">  ingressClassName: nginx</span>
<span class="line">  annotations:</span>
<span class="line">    nginx.ingress.kubernetes.io/auth-url: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/auth</span>
<span class="line">    nginx.ingress.kubernetes.io/auth-signin: https://oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span>/oauth2/start?rd<span class="token operator">=</span><span class="token variable">$scheme</span>://<span class="token variable">$host</span><span class="token variable">$request_uri</span></span>
<span class="line">  hosts:</span>
<span class="line">    - host: mailhog.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">      paths:</span>
<span class="line">        - path: <span class="token string">&quot;/&quot;</span></span>
<span class="line">          pathType: Prefix</span>
<span class="line">  tls:</span>
<span class="line">    - hosts:</span>
<span class="line">      - mailhog.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- mailhog$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource mailhog <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="oauth2-proxy" tabindex="-1"><a class="header-anchor" href="#oauth2-proxy"><span>OAuth2 Proxy</span></a></h3><p><a href="https://oauth2-proxy.github.io/oauth2-proxy/" target="_blank" rel="noopener noreferrer">oauth2-proxy</a></p><ul><li><a href="https://artifacthub.io/packages/helm/oauth2-proxy/oauth2-proxy" target="_blank" rel="noopener noreferrer">oauth2-proxy</a></li><li><a href="https://github.com/oauth2-proxy/manifests/blob/main/helm/oauth2-proxy/values.yaml" target="_blank" rel="noopener noreferrer">default values.yaml</a></li></ul><p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> infrastructure/base/oauth2-proxy</span>
<span class="line"></span>
<span class="line">kubectl create namespace oauth2-proxy --dry-run<span class="token operator">=</span>client <span class="token parameter variable">-o</span> yaml <span class="token operator">&gt;</span> infrastructure/base/oauth2-proxy/oauth2-proxy-namespace.yaml</span>
<span class="line"></span>
<span class="line">flux create helmrelease oauth2-proxy <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;oauth2-proxy&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--interval</span><span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--source</span><span class="token operator">=</span><span class="token string">&quot;HelmRepository/oauth2-proxy.flux-system&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--chart</span><span class="token operator">=</span><span class="token string">&quot;oauth2-proxy&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --chart-version<span class="token operator">=</span><span class="token string">&quot;5.0.6&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/oauth2-proxy-values&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--export</span> <span class="token operator">&gt;</span> infrastructure/base/oauth2-proxy/oauth2-proxy-helmrelease.yaml</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/base/oauth2-proxy/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/base/oauth2-proxy&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/oauth2-proxy</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-vp</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy/oauth2-proxy-kustomization&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy/oauth2-proxy-kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.toolkit.fluxcd.io/v1beta2</span>
<span class="line">kind: Kustomization</span>
<span class="line">metadata:</span>
<span class="line">  name: oauth2-proxy</span>
<span class="line">  namespace: flux-system</span>
<span class="line">spec:</span>
<span class="line">  dependsOn:</span>
<span class="line">  - name: kube-prometheus-stack</span>
<span class="line">  interval: 5m</span>
<span class="line">  path: ./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy/oauth2-proxy-kustomization</span>
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
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy/oauth2-proxy-kustomization/kustomizeconfig.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">nameReference:</span>
<span class="line">- kind: ConfigMap</span>
<span class="line">  version: v1</span>
<span class="line">  fieldSpecs:</span>
<span class="line">  - path: spec/valuesFrom/name</span>
<span class="line">    kind: HelmRelease</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy/oauth2-proxy-kustomization/kustomization.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">apiVersion: kustomize.config.k8s.io/v1beta1</span>
<span class="line">kind: Kustomization</span>
<span class="line">namespace: oauth2-proxy</span>
<span class="line">resources:</span>
<span class="line">  - <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/oauth2-proxy</span>
<span class="line">configMapGenerator:</span>
<span class="line">  - name: oauth2-proxy-values</span>
<span class="line">    files:</span>
<span class="line">      - <span class="token assign-left variable">values.yaml</span><span class="token operator">=</span>oauth2-proxy-values.yaml</span>
<span class="line">configurations:</span>
<span class="line">  - kustomizeconfig.yaml</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy/oauth2-proxy-kustomization/oauth2-proxy-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">config:</span>
<span class="line">  clientID: oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">  clientSecret: <span class="token variable">\${MY_PASSWORD}</span></span>
<span class="line">  cookieSecret: <span class="token variable">\${MY_COOKIE_SECRET}</span></span>
<span class="line">  configFile: <span class="token operator">|</span>-</span>
<span class="line">    email_domains <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token string">&quot;*&quot;</span> <span class="token punctuation">]</span></span>
<span class="line">    upstreams <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token string">&quot;file:///dev/null&quot;</span> <span class="token punctuation">]</span></span>
<span class="line">    whitelist_domains <span class="token operator">=</span> <span class="token string">&quot;.<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span></span>
<span class="line">    cookie_domains <span class="token operator">=</span> <span class="token string">&quot;.<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span></span>
<span class="line">    provider <span class="token operator">=</span> <span class="token string">&quot;oidc&quot;</span></span>
<span class="line">    oidc_issuer_url <span class="token operator">=</span> <span class="token string">&quot;https://dex.<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span></span>
<span class="line">    ssl_insecure_skip_verify <span class="token operator">=</span> <span class="token string">&quot;true&quot;</span></span>
<span class="line">    insecure_oidc_skip_issuer_verification <span class="token operator">=</span> <span class="token string">&quot;true&quot;</span></span>
<span class="line">    skip_oidc_discovery <span class="token operator">=</span> <span class="token string">&quot;true&quot;</span></span>
<span class="line">    login_url <span class="token operator">=</span> <span class="token string">&quot;https://dex.<span class="token variable">\${CLUSTER_FQDN}</span>/auth&quot;</span></span>
<span class="line">    redeem_url <span class="token operator">=</span> <span class="token string">&quot;https://dex.<span class="token variable">\${CLUSTER_FQDN}</span>/token&quot;</span></span>
<span class="line">    oidc_jwks_url <span class="token operator">=</span> <span class="token string">&quot;https://dex.<span class="token variable">\${CLUSTER_FQDN}</span>/keys&quot;</span></span>
<span class="line">ingress:</span>
<span class="line">  enabled: <span class="token boolean">true</span></span>
<span class="line">  className: nginx</span>
<span class="line">  hosts:</span>
<span class="line">    - oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">  tls:</span>
<span class="line">    - hosts:</span>
<span class="line">      - oauth2-proxy.<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">metrics:</span>
<span class="line">  servicemonitor:</span>
<span class="line">    enabled: <span class="token boolean">true</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create <span class="token parameter variable">--autodetect</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token operator">!</span> <span class="token function">grep</span> <span class="token parameter variable">-q</span> <span class="token string">&#39;\\- oauth2-proxy$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span></span>
<span class="line">  <span class="token punctuation">(</span>cd <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource oauth2-proxy <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="flux" tabindex="-1"><a class="header-anchor" href="#flux"><span>Flux</span></a></h2><p>Commit changes to git repository and &quot;refresh&quot; flux. Wait for receiver and then configure the GitHub repository to send Webhooks to Flux:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token assign-left variable">GITHUB_WEBHOOKS</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token parameter variable">-H</span> <span class="token string">&quot;Authorization: token <span class="token variable">$GITHUB_TOKEN</span>&quot;</span> <span class="token string">&quot;https://api.github.com/repos/<span class="token variable">\${GITHUB_USER}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>/hooks&quot;</span> <span class="token operator">|</span> jq <span class="token string">&quot;.[].config.url&quot;</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token string">&quot;<span class="token variable">\${GITHUB_WEBHOOKS}</span>&quot;</span> <span class="token operator">=~</span> <span class="token variable">\${CLUSTER_FQDN}</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  <span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span></span>
<span class="line">  <span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;[<span class="token variable">\${CLUSTER_NAME}</span>] Initial core applications commit&quot;</span> <span class="token operator">||</span> <span class="token boolean">true</span></span>
<span class="line">  <span class="token function">git</span> push</span>
<span class="line">  flux reconcile <span class="token builtin class-name">source</span> <span class="token function">git</span> flux-system</span>
<span class="line">  <span class="token function">sleep</span> <span class="token number">100</span></span>
<span class="line">  kubectl <span class="token function">wait</span> <span class="token parameter variable">--timeout</span><span class="token operator">=</span>20m <span class="token parameter variable">--for</span><span class="token operator">=</span>condition<span class="token operator">=</span>ready kustomizations.kustomize.toolkit.fluxcd.io <span class="token parameter variable">-n</span> flux-system flux-receiver</span>
<span class="line">  <span class="token assign-left variable">FLUX_RECEIVER_URL</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>kubectl <span class="token parameter variable">-n</span> flux-system get receiver github-receiver <span class="token parameter variable">-o</span> <span class="token assign-left variable">jsonpath</span><span class="token operator">=</span><span class="token string">&quot;{.status.url}&quot;</span><span class="token variable">)</span></span></span>
<span class="line">  <span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token parameter variable">-H</span> <span class="token string">&quot;Authorization: token <span class="token variable">$GITHUB_TOKEN</span>&quot;</span> <span class="token parameter variable">-X</span> POST <span class="token parameter variable">-d</span> <span class="token string">&quot;{<span class="token entity" title="\\&quot;">\\&quot;</span>active<span class="token entity" title="\\&quot;">\\&quot;</span>: true, <span class="token entity" title="\\&quot;">\\&quot;</span>events<span class="token entity" title="\\&quot;">\\&quot;</span>: [<span class="token entity" title="\\&quot;">\\&quot;</span>push<span class="token entity" title="\\&quot;">\\&quot;</span>], <span class="token entity" title="\\&quot;">\\&quot;</span>config<span class="token entity" title="\\&quot;">\\&quot;</span>: {<span class="token entity" title="\\&quot;">\\&quot;</span>url<span class="token entity" title="\\&quot;">\\&quot;</span>: <span class="token entity" title="\\&quot;">\\&quot;</span>https://flux-receiver.<span class="token variable">\${CLUSTER_FQDN}</span><span class="token variable">\${FLUX_RECEIVER_URL}</span><span class="token entity" title="\\&quot;">\\&quot;</span>, <span class="token entity" title="\\&quot;">\\&quot;</span>content_type<span class="token entity" title="\\&quot;">\\&quot;</span>: <span class="token entity" title="\\&quot;">\\&quot;</span>json<span class="token entity" title="\\&quot;">\\&quot;</span>, <span class="token entity" title="\\&quot;">\\&quot;</span>secret<span class="token entity" title="\\&quot;">\\&quot;</span>: <span class="token entity" title="\\&quot;">\\&quot;</span><span class="token variable">\${MY_GITHUB_WEBHOOK_TOKEN}</span><span class="token entity" title="\\&quot;">\\&quot;</span>, <span class="token entity" title="\\&quot;">\\&quot;</span>insecure_ssl<span class="token entity" title="\\&quot;">\\&quot;</span>: <span class="token entity" title="\\&quot;">\\&quot;</span>1<span class="token entity" title="\\&quot;">\\&quot;</span>}}&quot;</span> <span class="token string">&quot;https://api.github.com/repos/<span class="token variable">\${GITHUB_USER}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>/hooks&quot;</span> <span class="token operator">|</span> jq</span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Due to the way how Crossplane installs the providers it is not possible to specify the name of the <code>ServiceAccount</code> in advance. Therefore you need to get the details about <code>ServiceAccount</code> created by Crossplane and use eksctl to create IRSA:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span>eksctl get iamserviceaccount <span class="token parameter variable">--cluster</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token parameter variable">--namespace</span> crossplane-system <span class="token parameter variable">-o</span> yaml<span class="token variable">)</span></span>&quot;</span> <span class="token operator">==</span> <span class="token string">&quot;null&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  kubectl <span class="token function">wait</span> <span class="token parameter variable">--timeout</span><span class="token operator">=</span>10m <span class="token parameter variable">--for</span><span class="token operator">=</span>condition<span class="token operator">=</span>ready kustomizations crossplane-provider <span class="token parameter variable">-n</span> flux-system</span>
<span class="line">  kubectl <span class="token function">wait</span> <span class="token parameter variable">--timeout</span><span class="token operator">=</span>10m <span class="token parameter variable">--for</span><span class="token operator">=</span>condition<span class="token operator">=</span>Healthy provider.pkg.crossplane.io provider-aws</span>
<span class="line">  <span class="token assign-left variable">CROSSPLANE_PROVIDER_AWS_SERVICE_ACCOUNT_NAME</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>kubectl get serviceaccounts <span class="token parameter variable">-n</span> crossplane-system <span class="token parameter variable">-o</span><span class="token operator">=</span>custom-columns<span class="token operator">=</span>NAME:.metadata.name <span class="token operator">|</span> <span class="token function">grep</span> provider-aws<span class="token variable">)</span></span></span>
<span class="line">  eksctl create iamserviceaccount <span class="token parameter variable">--cluster</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token parameter variable">--name</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CROSSPLANE_PROVIDER_AWS_SERVICE_ACCOUNT_NAME}</span>&quot;</span> <span class="token parameter variable">--namespace</span><span class="token operator">=</span><span class="token string">&quot;crossplane-system&quot;</span> --role-name<span class="token operator">=</span><span class="token string">&quot;crossplane-provider-aws-<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> --role-only --attach-policy-arn<span class="token operator">=</span><span class="token string">&quot;arn:aws:iam::aws:policy/AdministratorAccess&quot;</span> <span class="token parameter variable">--tags</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${TAGS<span class="token operator">/</span><span class="token operator">/</span> <span class="token operator">/</span><span class="token operator">,</span>}</span>&quot;</span> <span class="token parameter variable">--approve</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,137);function m(k,b){const n=c("router-link");return o(),p("div",null,[u,s("nav",d,[s("ul",null,[s("li",null,[a(n,{to:"#flux-dis-advantages"},{default:e(()=>[l("Flux (dis)advantages")]),_:1})]),s("li",null,[a(n,{to:"#solution-requirements-for-flux"},{default:e(()=>[l("Solution requirements for Flux")]),_:1}),s("ul",null,[s("li",null,[a(n,{to:"#naming-convention-and-directory-structure"},{default:e(()=>[l("Naming convention and directory structure")]),_:1})])])]),s("li",null,[a(n,{to:"#create-basic-flux-structure-in-git-repository"},{default:e(()=>[l("Create basic Flux structure in git repository")]),_:1})]),s("li",null,[a(n,{to:"#manage-kubernetes-secrets-with-mozilla-sops-and-amazon-secret-manager"},{default:e(()=>[l("Manage Kubernetes secrets with Mozilla SOPS and Amazon Secret Manager")]),_:1})]),s("li",null,[a(n,{to:"#helmrepositories"},{default:e(()=>[l("HelmRepositories")]),_:1})]),s("li",null,[a(n,{to:"#clusters"},{default:e(()=>[l("Clusters")]),_:1})]),s("li",null,[a(n,{to:"#create-initial-apps-dev-group-definitions"},{default:e(()=>[l("Create initial Apps dev group definitions")]),_:1})]),s("li",null,[a(n,{to:"#base-applications-definitions"},{default:e(()=>[l("Base Applications definitions")]),_:1}),s("ul",null,[s("li",null,[a(n,{to:"#amazon-elastic-block-store-ebs-csi-driver"},{default:e(()=>[l("Amazon Elastic Block Store (EBS) CSI driver")]),_:1})]),s("li",null,[a(n,{to:"#crossplane"},{default:e(()=>[l("Crossplane")]),_:1})]),s("li",null,[a(n,{to:"#csi-snapshotter"},{default:e(()=>[l("CSI Snapshotter")]),_:1})]),s("li",null,[a(n,{to:"#kubernetes-metrics-server"},{default:e(()=>[l("Kubernetes Metrics Server")]),_:1})]),s("li",null,[a(n,{to:"#kube-prometheus-stack"},{default:e(()=>[l("kube-prometheus-stack")]),_:1})]),s("li",null,[a(n,{to:"#cert-manager"},{default:e(()=>[l("cert-manager")]),_:1})]),s("li",null,[a(n,{to:"#cluster-autoscaler"},{default:e(()=>[l("cluster-autoscaler")]),_:1})]),s("li",null,[a(n,{to:"#dex"},{default:e(()=>[l("Dex")]),_:1})]),s("li",null,[a(n,{to:"#externaldns"},{default:e(()=>[l("ExternalDNS")]),_:1})]),s("li",null,[a(n,{to:"#flux-provides-alerts-receivers-and-monitoring"},{default:e(()=>[l("Flux provides, alerts, receivers and monitoring")]),_:1})]),s("li",null,[a(n,{to:"#ingress-nginx"},{default:e(()=>[l("ingress-nginx")]),_:1})]),s("li",null,[a(n,{to:"#mailhog"},{default:e(()=>[l("MailHog")]),_:1})]),s("li",null,[a(n,{to:"#oauth2-proxy"},{default:e(()=>[l("OAuth2 Proxy")]),_:1})])])]),s("li",null,[a(n,{to:"#flux"},{default:e(()=>[l("Flux")]),_:1})])])]),v])}const h=i(r,[["render",m],["__file","index.html.vue"]]),f=JSON.parse('{"path":"/part-03/","title":"Base Applications","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"Flux (dis)advantages","slug":"flux-dis-advantages","link":"#flux-dis-advantages","children":[]},{"level":2,"title":"Solution requirements for Flux","slug":"solution-requirements-for-flux","link":"#solution-requirements-for-flux","children":[{"level":3,"title":"Naming convention and directory structure","slug":"naming-convention-and-directory-structure","link":"#naming-convention-and-directory-structure","children":[]}]},{"level":2,"title":"Create basic Flux structure in git repository","slug":"create-basic-flux-structure-in-git-repository","link":"#create-basic-flux-structure-in-git-repository","children":[]},{"level":2,"title":"Manage Kubernetes secrets with Mozilla SOPS and Amazon Secret Manager","slug":"manage-kubernetes-secrets-with-mozilla-sops-and-amazon-secret-manager","link":"#manage-kubernetes-secrets-with-mozilla-sops-and-amazon-secret-manager","children":[]},{"level":2,"title":"HelmRepositories","slug":"helmrepositories","link":"#helmrepositories","children":[]},{"level":2,"title":"Clusters","slug":"clusters","link":"#clusters","children":[]},{"level":2,"title":"Create initial Apps dev group definitions","slug":"create-initial-apps-dev-group-definitions","link":"#create-initial-apps-dev-group-definitions","children":[]},{"level":2,"title":"Base Applications definitions","slug":"base-applications-definitions","link":"#base-applications-definitions","children":[{"level":3,"title":"Amazon Elastic Block Store (EBS) CSI driver","slug":"amazon-elastic-block-store-ebs-csi-driver","link":"#amazon-elastic-block-store-ebs-csi-driver","children":[]},{"level":3,"title":"Crossplane","slug":"crossplane","link":"#crossplane","children":[]},{"level":3,"title":"CSI Snapshotter","slug":"csi-snapshotter","link":"#csi-snapshotter","children":[]},{"level":3,"title":"Kubernetes Metrics Server","slug":"kubernetes-metrics-server","link":"#kubernetes-metrics-server","children":[]},{"level":3,"title":"kube-prometheus-stack","slug":"kube-prometheus-stack","link":"#kube-prometheus-stack","children":[]},{"level":3,"title":"cert-manager","slug":"cert-manager","link":"#cert-manager","children":[]},{"level":3,"title":"cluster-autoscaler","slug":"cluster-autoscaler","link":"#cluster-autoscaler","children":[]},{"level":3,"title":"Dex","slug":"dex","link":"#dex","children":[]},{"level":3,"title":"ExternalDNS","slug":"externaldns","link":"#externaldns","children":[]},{"level":3,"title":"Flux provides, alerts, receivers and monitoring","slug":"flux-provides-alerts-receivers-and-monitoring","link":"#flux-provides-alerts-receivers-and-monitoring","children":[]},{"level":3,"title":"ingress-nginx","slug":"ingress-nginx","link":"#ingress-nginx","children":[]},{"level":3,"title":"MailHog","slug":"mailhog","link":"#mailhog","children":[]},{"level":3,"title":"OAuth2 Proxy","slug":"oauth2-proxy","link":"#oauth2-proxy","children":[]}]},{"level":2,"title":"Flux","slug":"flux","link":"#flux","children":[]}],"git":{"updatedTime":1719720548000},"filePathRelative":"part-03/README.md"}');export{h as comp,f as data};
