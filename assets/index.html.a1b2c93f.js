import{_ as o,r as l,o as c,c as i,a as s,b as a,w as t,F as u,d as n,e as r}from"./app.36393f6e.js";const b={},m=s("h1",{id:"base-applications",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#base-applications","aria-hidden":"true"},"#"),n(" Base Applications")],-1),k={class:"table-of-contents"},d=n("Flux (dis)advantages"),g=n("Solution requirements for Flux"),h=n("Naming convention and directory structure"),f=n("Create basic Flux structure in git repository"),v=n("Manage Kubernetes secrets with Mozilla SOPS and Amazon Secret Manager"),q=n("HelmRepositories"),_=n("Clusters"),E=n("Create initial Apps dev group definitions"),N=n("Base Applications definitions"),y=n("Amazon Elastic Block Store (EBS) CSI driver"),x=n("Crossplane"),R=n("CSI Snapshotter"),O=n("Kubernetes Metrics Server"),T=n("kube-prometheus-stack"),$=n("cert-manager"),I=n("cluster-autoscaler"),z=n("Dex"),M=n("ExternalDNS"),S=n("Flux provides, alerts, receivers and monitoring"),F=n("ingress-nginx"),C=n("MailHog"),V=n("OAuth2 Proxy"),w=n("Flux"),U=s("h2",{id:"flux-dis-advantages",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#flux-dis-advantages","aria-hidden":"true"},"#"),n(" Flux (dis)advantages")],-1),L=s("code",null,"dependsOn",-1),D=n(" can not be used between "),A=s("code",null,"HelmRelease",-1),H=n(" and "),G=s("code",null,"Kustomization",-1),K=n(": "),Q={href:"https://github.com/fluxcd/kustomize-controller/issues/242",target:"_blank",rel:"noopener noreferrer"},B=n("HelmRelease, Kustomization DependsOn"),P=n(". Due to "),Y={href:"https://github.com/fluxcd/flux2/discussions/730",target:"_blank",rel:"noopener noreferrer"},W=n("https://github.com/fluxcd/flux2/discussions/730"),X=n(", "),j={href:"https://github.com/fluxcd/flux2/discussions/1010",target:"_blank",rel:"noopener noreferrer"},Z=n("https://github.com/fluxcd/flux2/discussions/1010"),J=n(' it is necessary to "pack" '),ss=s("code",null,"HelmRelease",-1),ns=n(' inside "flux '),as=s("code",null,"Kustomization",-1),es=n('" to be able to do dependency using '),ps=s("code",null,"dependsOn",-1),ts=n(' later... This "forces" you to use "flux '),rs=s("code",null,"Kustomization",-1),ls=n('" almost everywhere where you are using "dependencies"'),os={href:"https://fluxcd.io/docs/components/helm/helmreleases/",target:"_blank",rel:"noopener noreferrer"},cs=n("HelmReleases"),is=n(" are compatible with Helm ("),us=s("code",null,"helm ls -A",-1),bs=n(" works fine)"),ms={href:"https://fluxcd.io/docs/components/kustomize/kustomization/#variable-substitution",target:"_blank",rel:"noopener noreferrer"},ks=n("Variable substitution"),ds=n(" is really handy and easy to use in case you do not want to use too much "),gs={href:"https://fluxcd.io/docs/components/kustomize/kustomization/#variable-substitution",target:"_blank",rel:"noopener noreferrer"},hs=n("patching"),fs=s("li",null,[n("Changing values inside patches which are use "),s("code",null,"|-"),n(' is not possible, because it is a block of "text" and not "structure"')],-1),vs=s("h2",{id:"solution-requirements-for-flux",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#solution-requirements-for-flux","aria-hidden":"true"},"#"),n(" Solution requirements for Flux")],-1),qs=s("li",null,[s("code",null,"HelmRepositories"),n(" must be installed in "),s("code",null,"flux-system"),n(" namespace and separated, because definitions there are shared by multiple "),s("code",null,"HelmReleases")],-1),_s=s("li",null,[s("code",null,"HelmRepositories"),n(" must be installed before "),s("code",null,"HelmReleases"),n(" ("),s("code",null,"dependsOn"),n(") to prevent generating errors in Flux log")],-1),Es=n('I want to define flexible cluster "infrastructure groups" ('),Ns=s("code",null,"prod",-1),ys=n(", "),xs=s("code",null,"dev",-1),Rs=n(", "),Os=s("code",null,"mygroup",-1),Ts=n(", "),$s=s("code",null,"myteam",-1),Is=n("): "),zs=s("li",null,"It should be possible to define infrastructure group containing various applications",-1),Ms=s("li",null,[n("It should also help you to easily manage groups of clusters because their definitions will be in the specific directory (like "),s("code",null,"infrastructure/dev"),n(")")],-1),Ss={href:"https://fluxcd.io/docs/components/kustomize/kustomization/#variable-substitution",target:"_blank",rel:"noopener noreferrer"},Fs=n("Variables"),Cs=n(" should be used per cluster ("),Vs=s("code",null,"clusters/dev/kube1/cluster-apps-substitutefrom-secret.yaml",-1),ws=n(")"),Us=s("li",null,[s("code",null,"HelmRepository"),n(" / "),s("code",null,"HelmReleases"),n(' can be defined per "cluster": '),s("ul",null,[s("li",null,[s("code",null,"clusters/dev/kube1/sources/fairwinds-stable.yaml")]),s("li",null,[s("code",null,"clusters/dev/kube1/cluster-apps/polaris/polaris-helmrelease.yaml")])])],-1),Ls=r(`<h3 id="naming-convention-and-directory-structure" tabindex="-1"><a class="header-anchor" href="#naming-convention-and-directory-structure" aria-hidden="true">#</a> Naming convention and directory structure</h3><p>Most of the applications installed to K8s cluster are using Helm charts. Therefore you need Flux objects <code>HelmRepositories</code> and <code>HelmReleases</code> where <code>HelmRepositories</code> needs to be installed first.</p><ul><li><code>HelmRepositories</code> are separated from app definition, because they may be shared by multiple applications (like <code>bitnami</code> and <code>external-dns</code> + <code>metrics-server</code>). <code>HelmRepositories</code> are installed first to prevent flux from logging errors...</li><li>Applications can be installed on multiple levels <ul><li><strong>Apps level</strong> - not used</li><li><strong>Infrastructure level</strong> - configuration for specific group of K8s servers. Usually contains objects, patches, certificates, which are applied to multiple clusters (different objects for &quot;dev&quot; and &quot;prod&quot; clusters)</li><li><strong>Cluster level</strong> - specific app configurations, <code>HelmReleases</code> / <code>HelmRepositories</code> for single cluster. Usually contains variables like <code>CLUSTER_FQDN</code>, <code>CLUSTER_NAME</code>, <code>MY_PASSWORD</code>, <code>LETSENCRYPT_ENVIRONMENT</code> ...</li></ul></li></ul><h4 id="cluster-level" tabindex="-1"><a class="header-anchor" href="#cluster-level" aria-hidden="true">#</a> Cluster level</h4><p>Cluster level directory <code>/clusters/</code> contains individual cluster definitions.</p><ul><li><code>clusters/\${ENVIRONMENT}/\${CLUSTER_FQDN}</code><ul><li><code>sources.yaml</code> - main &quot;flux Kustomization&quot; pointing do the <code>./sources</code> where are the <code>HelmRepository</code> definitions for cluster</li><li><code>sources/kustomization.yaml</code> - list of all &quot;enabled HelmRepositories&quot;</li><li><code>sources/fairwinds-stable.yaml</code> - HelmRepository file</li><li><code>cluster-apps.yaml</code> - main &quot;flux Kustomization&quot; pointing to <code>./clusters/dev/kube1.k8s.mylabs.dev/cluster-apps</code></li><li><code>cluster-apps/kustomization.yaml</code> - kustomization file containing patches, app directories and <code>./infrastructure/dev</code></li><li><code>cluster-apps-substitutefrom-secret.yaml</code> - encrypted variables used in <code>postBuild.substituteFrom</code> flux Kustomization sections</li><li><code>cluster-apps/polaris/polaris-namespace</code> - application namespace</li><li><code>cluster-apps/polaris/polaris-helmrelease</code> - <code>HelmRelease</code> file</li><li><code>flux-system/gotk-patches.yaml,kustomization.yaml</code> - files configuring Flux to work with SOPS (decryption)</li></ul></li></ul><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>clusters
\u2514\u2500\u2500 dev
    \u2514\u2500\u2500 kube1.k8s.mylabs.dev
        \u251C\u2500\u2500 cluster-apps
        \u2502   \u251C\u2500\u2500 kustomization.yaml
        \u2502   \u2514\u2500\u2500 polaris
        \u2502       \u251C\u2500\u2500 kustomization.yaml
        \u2502       \u251C\u2500\u2500 polaris-helmrelease.yaml
        \u2502       \u2514\u2500\u2500 polaris-namespace.yaml
        \u251C\u2500\u2500 cluster-apps-substitutefrom-secret.yaml
        \u251C\u2500\u2500 cluster-apps.yaml
        \u251C\u2500\u2500 flux-system
        \u2502   \u251C\u2500\u2500 gotk-components.yaml
        \u2502   \u251C\u2500\u2500 gotk-patches.yaml
        \u2502   \u251C\u2500\u2500 gotk-sync.yaml
        \u2502   \u2514\u2500\u2500 kustomization.yaml
        \u251C\u2500\u2500 kustomization.yaml
        \u251C\u2500\u2500 sources
        \u2502   \u251C\u2500\u2500 fairwinds-stable.yaml
        \u2502   \u2514\u2500\u2500 kustomization.yaml
        \u2514\u2500\u2500 sources.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br></div></div><h4 id="infrastructure-level" tabindex="-1"><a class="header-anchor" href="#infrastructure-level" aria-hidden="true">#</a> Infrastructure level</h4><p>Infrastructure level contain applications or patches located in <code>base</code> directory. All definitions in infrastructure level are applied to all servers in that &quot;group&quot;. Infrastructure also contains the <code>sources</code> directory where you can find &quot;common&quot; HelmRepositories. Usually there are &quot;groups&quot; (directories) like <code>prd</code>, <code>dev</code>, <code>stg</code>, ...</p><ul><li><code>infrastructure</code> - directory containing &quot;infrastructure level&quot; definitions <ul><li><code>sources/kustomization.yaml</code> - globally allowed HelmRepositories</li><li><code>sources/bitnami-helmrepository.yaml</code> - HelmRepository file</li><li><code>base</code> - base application directory <ul><li><code>dex</code> - &quot;base&quot; dex directory containing HelmRelease, and namespace manifests</li></ul></li></ul></li><li><code>infrastructure/\${ENVIRONMENT}</code><ul><li><code>kustomization.yaml</code> - list of all enabled &quot;infrastructure dev level&quot; apps</li><li><code>dex</code> - directory containing values for HelmRelease</li></ul></li></ul><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>infrastructure
\u251C\u2500\u2500 base
\u2502   \u251C\u2500\u2500 cert-manager
\u2502   \u2502   \u251C\u2500\u2500 cert-manager-helmrelease.yaml
\u2502   \u2502   \u2514\u2500\u2500 kustomization.yaml
\u2502   \u251C\u2500\u2500 dex
\u2502   \u2502   \u251C\u2500\u2500 dex-helmrelease.yaml
\u2502   \u2502   \u251C\u2500\u2500 dex-namespace.yaml
\u2502   \u2502   \u2514\u2500\u2500 kustomization.yaml
\u2502   \u251C\u2500\u2500 external-dns
\u2502   \u2502   \u251C\u2500\u2500 external-dns-helmrelease.yaml
\u2502   \u2502   \u2514\u2500\u2500 kustomization.yaml
\u2502   \u251C\u2500\u2500 external-snapshotter
\u2502   \u2502   \u2514\u2500\u2500 kustomization.yaml
\u2502   \u2514\u2500\u2500 secrets-store-csi-driver
\u2502       \u251C\u2500\u2500 kustomization.yaml
\u2502       \u251C\u2500\u2500 secrets-store-csi-driver-helmrelease.yaml
\u2502       \u2514\u2500\u2500 secrets-store-csi-driver-namespace.yaml
\u251C\u2500\u2500 dev
\u2502   \u251C\u2500\u2500 cert-manager
\u2502   \u2502   \u251C\u2500\u2500 cert-manager-kustomization-certificate
\u2502   \u2502   \u2502   \u2514\u2500\u2500 cert-manager-certificate.yaml
\u2502   \u2502   \u251C\u2500\u2500 cert-manager-kustomization-certificate.yaml
\u2502   \u2502   \u251C\u2500\u2500 cert-manager-kustomization-clusterissuer
\u2502   \u2502   \u2502   \u251C\u2500\u2500 cert-manager-clusterissuer-letsencrypt-production-dns.yaml
\u2502   \u2502   \u2502   \u2514\u2500\u2500 cert-manager-clusterissuer-letsencrypt-staging-dns.yaml
\u2502   \u2502   \u251C\u2500\u2500 cert-manager-kustomization-clusterissuer.yaml
\u2502   \u2502   \u251C\u2500\u2500 cert-manager-kustomization
\u2502   \u2502   \u2502   \u251C\u2500\u2500 cert-manager-values.yaml
\u2502   \u2502   \u2502   \u251C\u2500\u2500 kustomization.yaml
\u2502   \u2502   \u2502   \u2514\u2500\u2500 kustomizeconfig.yaml
\u2502   \u2502   \u251C\u2500\u2500 cert-manager-kustomization.yaml
\u2502   \u2502   \u2514\u2500\u2500 kustomization.yaml
\u2502   \u251C\u2500\u2500 crossplane
\u2502   \u2502   \u251C\u2500\u2500 crossplane-kustomization
\u2502   \u2502   \u2502   \u2514\u2500\u2500 kustomization.yaml
\u2502   \u2502   \u251C\u2500\u2500 crossplane-kustomization.yaml
\u2502   \u2502   \u251C\u2500\u2500 crossplane-kustomization-provider
\u2502   \u2502   \u2502   \u251C\u2500\u2500 crossplane-controllerconfig-aws.yaml
\u2502   \u2502   \u2502   \u2514\u2500\u2500 crossplane-provider-aws.yaml
\u2502   \u2502   \u251C\u2500\u2500 crossplane-kustomization-provider.yaml
\u2502   \u2502   \u251C\u2500\u2500 crossplane-kustomization-providerconfig
\u2502   \u2502   \u2502   \u2514\u2500\u2500 crossplane-providerconfig-aws.yaml
\u2502   \u2502   \u251C\u2500\u2500 crossplane-kustomization-providerconfig.yaml
\u2502   \u2502   \u2514\u2500\u2500 kustomization.yaml
\u2502   \u251C\u2500\u2500 dex
\u2502   \u2502   \u251C\u2500\u2500 dex-values.yaml
\u2502   \u2502   \u251C\u2500\u2500 kustomization.yaml
\u2502   \u2502   \u2514\u2500\u2500 kustomizeconfig.yaml
\u2502   \u251C\u2500\u2500 external-dns
\u2502   \u2502   \u251C\u2500\u2500 external-dns-kustomization
\u2502   \u2502   \u2502   \u251C\u2500\u2500 external-dns-values.yaml
\u2502   \u2502   \u2502   \u251C\u2500\u2500 kustomization.yaml
\u2502   \u2502   \u2502   \u2514\u2500\u2500 kustomizeconfig.yaml
\u2502   \u2502   \u251C\u2500\u2500 external-dns-kustomization.yaml
\u2502   \u2502   \u2514\u2500\u2500 kustomization.yaml
\u2502   \u251C\u2500\u2500 external-snapshotter
\u2502   \u2502   \u251C\u2500\u2500 external-snapshotter-kustomization
\u2502   \u2502   \u2502   \u2514\u2500\u2500 kustomization.yaml
\u2502   \u2502   \u251C\u2500\u2500 external-snapshotter-kustomization.yaml
\u2502   \u2502   \u2514\u2500\u2500 kustomization.yaml
\u2502   \u251C\u2500\u2500 kustomization.yaml
\u2502   \u2514\u2500\u2500 secrets-store-csi-driver
\u2502       \u251C\u2500\u2500 kustomization.yaml
\u2502       \u251C\u2500\u2500 secrets-store-csi-driver-kustomization
\u2502       \u2502   \u2514\u2500\u2500 kustomization.yaml
\u2502       \u251C\u2500\u2500 secrets-store-csi-driver-kustomization.yaml
\u2502       \u251C\u2500\u2500 secrets-store-csi-driver-provider-aws
\u2502       \u2502   \u2514\u2500\u2500 kustomization.yaml
\u2502       \u2514\u2500\u2500 secrets-store-csi-driver-provider-aws.yaml
\u2514\u2500\u2500 sources
    \u251C\u2500\u2500 bitnami-helmrepository.yaml
    \u251C\u2500\u2500 crossplane-stable-helmrepository.yaml
    \u251C\u2500\u2500 dex-helmrepository.yaml
    \u251C\u2500\u2500 jetstack-helmrepository.yaml
    \u251C\u2500\u2500 kustomization.yaml
    \u2514\u2500\u2500 secrets-store-csi-driver-helmrepository.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br></div></div><hr><h2 id="create-basic-flux-structure-in-git-repository" tabindex="-1"><a class="header-anchor" href="#create-basic-flux-structure-in-git-repository" aria-hidden="true">#</a> Create basic Flux structure in git repository</h2><p>Clone initial git repository created by <code>eksctl</code> used by Flux:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> -d <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token punctuation">;</span> <span class="token keyword">then</span>
  <span class="token function">git</span> -C <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>&quot;</span> pull -r
<span class="token keyword">else</span>
  <span class="token function">git</span> clone <span class="token string">&quot;https://<span class="token variable">\${GITHUB_TOKEN}</span>@github.com/<span class="token variable">\${GITHUB_USER}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>.git&quot;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>&quot;</span>
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>Create initial git repository structure:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>&quot;</span>/infrastructure/<span class="token punctuation">{</span>base,dev,sources<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>Set <code>user.name</code> and <code>user.email</code> for git (if not already configured)</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">git</span> config user.name  <span class="token operator">||</span> <span class="token function">git</span> config --global user.name  <span class="token string">&quot;<span class="token variable">\${GITHUB_USER}</span>&quot;</span>
<span class="token function">git</span> config user.email <span class="token operator">||</span> <span class="token function">git</span> config --global user.email <span class="token string">&quot;<span class="token variable">\${MY_EMAIL}</span>&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>Go to the &quot;git directory&quot;:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>&quot;</span> <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="manage-kubernetes-secrets-with-mozilla-sops-and-amazon-secret-manager" tabindex="-1"><a class="header-anchor" href="#manage-kubernetes-secrets-with-mozilla-sops-and-amazon-secret-manager" aria-hidden="true">#</a> Manage Kubernetes secrets with Mozilla SOPS and Amazon Secret Manager</h2><p>Configure the Git directory for encryption:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s .sops.yaml <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">echo</span> <span class="token string">&quot;creation_rules:&quot;</span> <span class="token operator">&gt;</span> .sops.yaml

<span class="token function">grep</span> -q <span class="token string">&quot;<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span> .sops.yaml <span class="token operator">||</span> <span class="token function">cat</span> <span class="token operator">&gt;&gt;</span> .sops.yaml <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
  - path_regex: clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/.*
    encrypted_regex: ^(data)$
    kms: <span class="token variable">\${AWS_KMS_KEY_ARN}</span>
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>Add SOPS configuration to git repository and sync it with Flux:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/flux-system/gotk-patches.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
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
    <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/flux-system&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    kustomize edit <span class="token function">add</span> patch --path gotk-patches.yaml <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
  <span class="token punctuation">)</span>

  <span class="token function">git</span> <span class="token function">add</span> .sops.yaml <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/flux-system&quot;</span>
  <span class="token function">git</span> commit -m <span class="token string">&quot;[<span class="token variable">\${CLUSTER_NAME}</span>] Add SOPS configuration&quot;</span>
  <span class="token function">git</span> push
  flux reconcile <span class="token builtin class-name">source</span> <span class="token function">git</span> flux-system
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><h2 id="helmrepositories" tabindex="-1"><a class="header-anchor" href="#helmrepositories" aria-hidden="true">#</a> HelmRepositories</h2><p>Create <code>HelmRepository</code> definitions...</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token builtin class-name">declare</span> -A <span class="token assign-left variable">HELMREPOSITORIES</span><span class="token operator">=</span><span class="token punctuation">(</span>
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
    --url<span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${HELMREPOSITORIES<span class="token punctuation">[</span>\${HELMREPOSITORY}</span>]}&quot;</span> <span class="token punctuation">\\</span>
    --interval<span class="token operator">=</span>1h <span class="token punctuation">\\</span>
    --export <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/sources/<span class="token variable">\${HELMREPOSITORY}</span>-helmrepository.yaml&quot;</span>
<span class="token keyword">done</span>

<span class="token comment"># Due to this issue: https://github.com/kubernetes-sigs/kustomize/issues/2803</span>
<span class="token comment"># you need to CD to the directory first and then go back</span>
<span class="token punctuation">[</span><span class="token punctuation">[</span> -f infrastructure/sources/kustomization.yaml <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token function">rm</span> infrastructure/sources/kustomization.yaml
<span class="token builtin class-name">cd</span> infrastructure/sources <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br></div></div><h2 id="clusters" tabindex="-1"><a class="header-anchor" href="#clusters" aria-hidden="true">#</a> Clusters</h2><p>Create <code>cluster-apps</code>, <code>sources</code> and initial <code>kustomization.yaml</code> under cluster directory <code>clusters/\${ENVIRONMENT}/\${CLUSTER_FQDN}</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -pv <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span>/<span class="token punctuation">{</span>cluster-apps,sources<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>It is necessary to split <code>HelmRepository</code> and <code>HelmRelease</code>, otherwise there are many errors in flux logs. <code>HelmRepository</code> should be always installed before <code>HelmRelease</code> using <code>dependsOn</code>.</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>flux create kustomization sources <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --path<span class="token operator">=</span><span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/sources&quot;</span> <span class="token punctuation">\\</span>
  --prune<span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --wait <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/sources.yaml&quot;</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/sources/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
  <span class="token punctuation">(</span>
    <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/sources/&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    kustomize create --resources <span class="token string">&quot;../../../../infrastructure/sources&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
  <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>Use <code>cluster-apps</code> &quot;flux kustomization&quot; definition to use <code>dependsOn</code> to wait for &quot;HelmRepositories&quot;.</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
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

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
  <span class="token punctuation">(</span>
    <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    kustomize create --resources <span class="token string">&quot;../../../../infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
  <span class="token punctuation">)</span>

<span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps-substitutefrom-secret.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token punctuation">;</span> <span class="token keyword">then</span>
  kubectl create secret generic cluster-apps-substitutefrom-secret -n flux-system --dry-run<span class="token operator">=</span>client -o yaml <span class="token punctuation">\\</span>
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
    --from-literal<span class="token operator">=</span><span class="token string">&quot;MY_GITHUB_WEBHOOK_TOKEN_BASE64=<span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> -n <span class="token string">&quot;<span class="token variable">\${MY_GITHUB_WEBHOOK_TOKEN}</span>&quot;</span> <span class="token operator">|</span> base64 --wrap<span class="token operator">=</span><span class="token number">0</span><span class="token variable">)</span></span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;MY_PASSWORD=<span class="token variable">\${MY_PASSWORD}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;MY_PASSWORD_BASE64=<span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> -n <span class="token string">&quot;<span class="token variable">\${MY_PASSWORD}</span>&quot;</span> <span class="token operator">|</span> base64 --wrap<span class="token operator">=</span><span class="token number">0</span><span class="token variable">)</span></span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;OKTA_CLIENT_ID=<span class="token variable">\${OKTA_CLIENT_ID}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;OKTA_CLIENT_SECRET=<span class="token variable">\${OKTA_CLIENT_SECRET}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;OKTA_ISSUER=<span class="token variable">\${OKTA_ISSUER}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;SLACK_CHANNEL=<span class="token variable">\${SLACK_CHANNEL}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;SLACK_INCOMING_WEBHOOK_URL_BASE64=<span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> -n <span class="token string">&quot;<span class="token variable">\${SLACK_INCOMING_WEBHOOK_URL}</span>&quot;</span> <span class="token operator">|</span> base64 --wrap<span class="token operator">=</span><span class="token number">0</span><span class="token variable">)</span></span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;SLACK_INCOMING_WEBHOOK_URL=<span class="token variable">\${SLACK_INCOMING_WEBHOOK_URL}</span>&quot;</span> <span class="token punctuation">\\</span>
    --from-literal<span class="token operator">=</span><span class="token string">&quot;TAGS_INLINE=<span class="token variable">\${TAGS<span class="token operator">/</span><span class="token operator">/</span> <span class="token operator">/</span><span class="token operator">,</span>}</span>&quot;</span> <span class="token punctuation">\\</span>
    <span class="token operator">&gt;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps-substitutefrom-secret.yaml&quot;</span>
  sops --encrypt --in-place <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps-substitutefrom-secret.yaml&quot;</span>
<span class="token keyword">fi</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
  <span class="token punctuation">(</span>
    <span class="token builtin class-name">cd</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    kustomize create --resources <span class="token string">&quot;flux-system,sources.yaml,cluster-apps-substitutefrom-secret.yaml,cluster-apps.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
  <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br></div></div><h2 id="create-initial-apps-dev-group-definitions" tabindex="-1"><a class="header-anchor" href="#create-initial-apps-dev-group-definitions" aria-hidden="true">#</a> Create initial Apps dev group definitions</h2><p>Create initial <code>kustomization.yaml</code> where all the group application will have their record:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --resources <span class="token string">&quot;../sources&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h2 id="base-applications-definitions" tabindex="-1"><a class="header-anchor" href="#base-applications-definitions" aria-hidden="true">#</a> Base Applications definitions</h2><h3 id="amazon-elastic-block-store-ebs-csi-driver" tabindex="-1"><a class="header-anchor" href="#amazon-elastic-block-store-ebs-csi-driver" aria-hidden="true">#</a> Amazon Elastic Block Store (EBS) CSI driver</h3>`,41),Ds={href:"https://github.com/kubernetes-sigs/aws-ebs-csi-driver",target:"_blank",rel:"noopener noreferrer"},As=n("Amazon Elastic Block Store (EBS) CSI driver"),Hs={href:"https://github.com/kubernetes-sigs/aws-ebs-csi-driver/tree/master/charts/aws-ebs-csi-driver",target:"_blank",rel:"noopener noreferrer"},Gs=n("aws-ebs-csi-driver"),Ks={href:"https://github.com/kubernetes-sigs/aws-ebs-csi-driver/blob/master/charts/aws-ebs-csi-driver/values.yaml",target:"_blank",rel:"noopener noreferrer"},Qs=n("default values.yaml"),Bs=r(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/aws-ebs-csi-driver

flux create helmrelease aws-ebs-csi-driver <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;aws-ebs-csi-driver&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/aws-ebs-csi-driver.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;aws-ebs-csi-driver&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;2.6.2&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/aws-ebs-csi-driver-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/aws-ebs-csi-driver/aws-ebs-csi-driver-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/aws-ebs-csi-driver/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/aws-ebs-csi-driver&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/aws-ebs-csi-driver</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization&quot;</span>

flux create kustomization aws-ebs-csi-driver <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --depends-on<span class="token operator">=</span><span class="token string">&quot;external-snapshotter&quot;</span> <span class="token punctuation">\\</span>
  --path<span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization&quot;</span> <span class="token punctuation">\\</span>
  --prune<span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --wait <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver/aws-ebs-csi-driver-kustomization.yaml&quot;</span>

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
      - values.yaml<span class="token operator">=</span>aws-ebs-csi-driver-values.yaml
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
    <span class="token comment"># TODO XXXX !!!! this is not working :-(</span>
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

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/aws-ebs-csi-driver&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- aws-ebs-csi-driver$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource aws-ebs-csi-driver <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br></div></div><p>Change the &quot;aws-ebs-csi-driver tags&quot; on the Cluster level, because they will be different for every cluster and it needs to be &quot;set&quot; form <code>TAGS</code> bash variable:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;name: aws-ebs-csi-driver$&#39;</span> <span class="token string">&quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>/cluster-apps/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br></div></div><h3 id="crossplane" tabindex="-1"><a class="header-anchor" href="#crossplane" aria-hidden="true">#</a> Crossplane</h3>`,7),Ps={href:"https://crossplane.io/",target:"_blank",rel:"noopener noreferrer"},Ys=n("Crossplane"),Ws={href:"https://github.com/crossplane/crossplane",target:"_blank",rel:"noopener noreferrer"},Xs=n("crossplane"),js={href:"https://github.com/crossplane/crossplane/blob/master/cluster/charts/crossplane/values.yaml.tmpl",target:"_blank",rel:"noopener noreferrer"},Zs=n("default values.yaml"),Js=r(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/crossplane

kubectl create namespace crossplane-system --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> infrastructure/base/crossplane/crossplane-namespace.yaml

flux create helmrelease crossplane <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;crossplane-system&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/crossplane-stable.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;crossplane&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;1.5.1&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/crossplane/crossplane-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/crossplane/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/crossplane&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/crossplane</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -pv <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane&quot;</span>/crossplane-<span class="token punctuation">{</span>kustomization,kustomization-provider,kustomization-providerconfig<span class="token punctuation">}</span>

flux create kustomization crossplane <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --path<span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization&quot;</span> <span class="token punctuation">\\</span>
  --prune<span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --wait <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization.yaml&quot;</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
  <span class="token punctuation">(</span>
    <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    kustomize create --resources <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/<span class="token punctuation">..</span>/base/crossplane <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
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
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --depends-on<span class="token operator">=</span><span class="token string">&quot;crossplane-provider&quot;</span> <span class="token punctuation">\\</span>
  --path<span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization-providerconfig&quot;</span> <span class="token punctuation">\\</span>
  --prune<span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --wait <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/crossplane-kustomization-providerconfig.yaml&quot;</span>

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

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/crossplane&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- crossplane$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource crossplane <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br></div></div><h3 id="csi-snapshotter" tabindex="-1"><a class="header-anchor" href="#csi-snapshotter" aria-hidden="true">#</a> CSI Snapshotter</h3>`,5),sn=n("Details about EKS and "),nn=s("code",null,"external-snapshotter",-1),an=n(" can be found here: "),en={href:"https://aws.amazon.com/blogs/containers/using-ebs-snapshots-for-persistent-storage-with-your-eks-cluster",target:"_blank",rel:"noopener noreferrer"},pn=n("Using EBS Snapshots for persistent storage with your EKS cluster"),tn=r(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/external-snapshotter

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
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/external-snapshotter</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter/external-snapshotter-kustomization&quot;</span>

flux create kustomization external-snapshotter <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --path<span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter/external-snapshotter-kustomization&quot;</span> <span class="token punctuation">\\</span>
  --prune<span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --wait <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter/external-snapshotter-kustomization.yaml&quot;</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter/external-snapshotter-kustomization/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
  <span class="token punctuation">(</span>
    <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter/external-snapshotter-kustomization&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    kustomize create --resources <span class="token string">&quot;../../../base/external-snapshotter&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
    <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span>
  <span class="token punctuation">)</span>

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-snapshotter&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- external-snapshotter$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource external-snapshotter <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><h3 id="kubernetes-metrics-server" tabindex="-1"><a class="header-anchor" href="#kubernetes-metrics-server" aria-hidden="true">#</a> Kubernetes Metrics Server</h3>`,5),rn={href:"https://github.com/kubernetes-sigs/metrics-server",target:"_blank",rel:"noopener noreferrer"},ln=n("Kubernetes Metrics Server"),on={href:"https://artifacthub.io/packages/helm/bitnami/metrics-server",target:"_blank",rel:"noopener noreferrer"},cn=n("metrics-server"),un={href:"https://github.com/bitnami/charts/blob/master/bitnami/metrics-server/values.yaml",target:"_blank",rel:"noopener noreferrer"},bn=n("default values.yaml"),mn=r(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/metrics-server

kubectl create namespace metrics-server --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> infrastructure/base/metrics-server/metrics-server-namespace.yaml

flux create helmrelease metrics-server <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;metrics-server&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/bitnami.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;metrics-server&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;5.10.12&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/metrics-server-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/metrics-server/metrics-server-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/metrics-server/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/metrics-server&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/metrics-server</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/metrics-server&quot;</span>

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
      - values.yaml<span class="token operator">=</span>metrics-server-values.yaml
configurations:
  - kustomizeconfig.yaml
EOF

<span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/metrics-server/metrics-server-values.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
apiService:
  create: <span class="token boolean">true</span>
EOF

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- metrics-server$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource metrics-server <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br></div></div><h3 id="kube-prometheus-stack" tabindex="-1"><a class="header-anchor" href="#kube-prometheus-stack" aria-hidden="true">#</a> kube-prometheus-stack</h3>`,5),kn={href:"https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack",target:"_blank",rel:"noopener noreferrer"},dn=n("kube-prometheus-stack"),gn={href:"https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack",target:"_blank",rel:"noopener noreferrer"},hn=n("kube-prometheus-stack"),fn={href:"https://github.com/prometheus-community/helm-charts/blob/main/charts/kube-prometheus-stack/values.yaml",target:"_blank",rel:"noopener noreferrer"},vn=n("default values.yaml"),qn=r(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/kube-prometheus-stack

kubectl create namespace kube-prometheus-stack --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> infrastructure/base/kube-prometheus-stack/kube-prometheus-stack-namespace.yaml

flux create helmrelease kube-prometheus-stack <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;kube-prometheus-stack&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/prometheus-community.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;kube-prometheus-stack&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;27.0.0&quot;</span> <span class="token punctuation">\\</span>
  --crds<span class="token operator">=</span><span class="token string">&quot;CreateReplace&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/kube-prometheus-stack-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/kube-prometheus-stack/kube-prometheus-stack-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/kube-prometheus-stack/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/kube-prometheus-stack&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/kube-prometheus-stack</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kube-prometheus-stack/kube-prometheus-stack-kustomization&quot;</span>

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
      - values.yaml<span class="token operator">=</span>kube-prometheus-stack-values.yaml
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

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kube-prometheus-stack/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kube-prometheus-stack&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- kube-prometheus-stack$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource kube-prometheus-stack <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br><span class="line-number">126</span><br><span class="line-number">127</span><br><span class="line-number">128</span><br><span class="line-number">129</span><br><span class="line-number">130</span><br><span class="line-number">131</span><br><span class="line-number">132</span><br><span class="line-number">133</span><br><span class="line-number">134</span><br><span class="line-number">135</span><br><span class="line-number">136</span><br><span class="line-number">137</span><br><span class="line-number">138</span><br><span class="line-number">139</span><br><span class="line-number">140</span><br><span class="line-number">141</span><br><span class="line-number">142</span><br><span class="line-number">143</span><br><span class="line-number">144</span><br><span class="line-number">145</span><br><span class="line-number">146</span><br><span class="line-number">147</span><br><span class="line-number">148</span><br><span class="line-number">149</span><br><span class="line-number">150</span><br><span class="line-number">151</span><br><span class="line-number">152</span><br><span class="line-number">153</span><br><span class="line-number">154</span><br><span class="line-number">155</span><br><span class="line-number">156</span><br><span class="line-number">157</span><br><span class="line-number">158</span><br><span class="line-number">159</span><br><span class="line-number">160</span><br><span class="line-number">161</span><br><span class="line-number">162</span><br><span class="line-number">163</span><br><span class="line-number">164</span><br><span class="line-number">165</span><br><span class="line-number">166</span><br><span class="line-number">167</span><br><span class="line-number">168</span><br><span class="line-number">169</span><br><span class="line-number">170</span><br><span class="line-number">171</span><br><span class="line-number">172</span><br><span class="line-number">173</span><br><span class="line-number">174</span><br><span class="line-number">175</span><br><span class="line-number">176</span><br><span class="line-number">177</span><br><span class="line-number">178</span><br><span class="line-number">179</span><br><span class="line-number">180</span><br><span class="line-number">181</span><br><span class="line-number">182</span><br><span class="line-number">183</span><br><span class="line-number">184</span><br><span class="line-number">185</span><br><span class="line-number">186</span><br><span class="line-number">187</span><br><span class="line-number">188</span><br><span class="line-number">189</span><br><span class="line-number">190</span><br><span class="line-number">191</span><br><span class="line-number">192</span><br><span class="line-number">193</span><br><span class="line-number">194</span><br><span class="line-number">195</span><br><span class="line-number">196</span><br><span class="line-number">197</span><br><span class="line-number">198</span><br><span class="line-number">199</span><br><span class="line-number">200</span><br><span class="line-number">201</span><br><span class="line-number">202</span><br><span class="line-number">203</span><br><span class="line-number">204</span><br><span class="line-number">205</span><br><span class="line-number">206</span><br><span class="line-number">207</span><br><span class="line-number">208</span><br><span class="line-number">209</span><br><span class="line-number">210</span><br><span class="line-number">211</span><br><span class="line-number">212</span><br><span class="line-number">213</span><br><span class="line-number">214</span><br><span class="line-number">215</span><br><span class="line-number">216</span><br><span class="line-number">217</span><br><span class="line-number">218</span><br><span class="line-number">219</span><br><span class="line-number">220</span><br><span class="line-number">221</span><br><span class="line-number">222</span><br><span class="line-number">223</span><br><span class="line-number">224</span><br><span class="line-number">225</span><br><span class="line-number">226</span><br><span class="line-number">227</span><br><span class="line-number">228</span><br><span class="line-number">229</span><br><span class="line-number">230</span><br><span class="line-number">231</span><br><span class="line-number">232</span><br><span class="line-number">233</span><br><span class="line-number">234</span><br><span class="line-number">235</span><br><span class="line-number">236</span><br><span class="line-number">237</span><br><span class="line-number">238</span><br><span class="line-number">239</span><br><span class="line-number">240</span><br><span class="line-number">241</span><br><span class="line-number">242</span><br><span class="line-number">243</span><br><span class="line-number">244</span><br><span class="line-number">245</span><br><span class="line-number">246</span><br><span class="line-number">247</span><br><span class="line-number">248</span><br><span class="line-number">249</span><br><span class="line-number">250</span><br><span class="line-number">251</span><br><span class="line-number">252</span><br><span class="line-number">253</span><br><span class="line-number">254</span><br><span class="line-number">255</span><br><span class="line-number">256</span><br><span class="line-number">257</span><br><span class="line-number">258</span><br><span class="line-number">259</span><br><span class="line-number">260</span><br><span class="line-number">261</span><br><span class="line-number">262</span><br><span class="line-number">263</span><br><span class="line-number">264</span><br><span class="line-number">265</span><br><span class="line-number">266</span><br><span class="line-number">267</span><br><span class="line-number">268</span><br><span class="line-number">269</span><br><span class="line-number">270</span><br><span class="line-number">271</span><br><span class="line-number">272</span><br><span class="line-number">273</span><br><span class="line-number">274</span><br><span class="line-number">275</span><br><span class="line-number">276</span><br><span class="line-number">277</span><br><span class="line-number">278</span><br><span class="line-number">279</span><br><span class="line-number">280</span><br><span class="line-number">281</span><br><span class="line-number">282</span><br><span class="line-number">283</span><br><span class="line-number">284</span><br><span class="line-number">285</span><br><span class="line-number">286</span><br><span class="line-number">287</span><br><span class="line-number">288</span><br><span class="line-number">289</span><br><span class="line-number">290</span><br><span class="line-number">291</span><br><span class="line-number">292</span><br><span class="line-number">293</span><br><span class="line-number">294</span><br><span class="line-number">295</span><br><span class="line-number">296</span><br><span class="line-number">297</span><br><span class="line-number">298</span><br><span class="line-number">299</span><br><span class="line-number">300</span><br><span class="line-number">301</span><br><span class="line-number">302</span><br><span class="line-number">303</span><br><span class="line-number">304</span><br><span class="line-number">305</span><br><span class="line-number">306</span><br><span class="line-number">307</span><br><span class="line-number">308</span><br><span class="line-number">309</span><br><span class="line-number">310</span><br><span class="line-number">311</span><br><span class="line-number">312</span><br><span class="line-number">313</span><br><span class="line-number">314</span><br><span class="line-number">315</span><br><span class="line-number">316</span><br><span class="line-number">317</span><br><span class="line-number">318</span><br><span class="line-number">319</span><br><span class="line-number">320</span><br><span class="line-number">321</span><br><span class="line-number">322</span><br><span class="line-number">323</span><br><span class="line-number">324</span><br><span class="line-number">325</span><br><span class="line-number">326</span><br><span class="line-number">327</span><br><span class="line-number">328</span><br><span class="line-number">329</span><br><span class="line-number">330</span><br><span class="line-number">331</span><br><span class="line-number">332</span><br><span class="line-number">333</span><br><span class="line-number">334</span><br><span class="line-number">335</span><br><span class="line-number">336</span><br><span class="line-number">337</span><br><span class="line-number">338</span><br><span class="line-number">339</span><br><span class="line-number">340</span><br><span class="line-number">341</span><br><span class="line-number">342</span><br><span class="line-number">343</span><br><span class="line-number">344</span><br><span class="line-number">345</span><br><span class="line-number">346</span><br><span class="line-number">347</span><br><span class="line-number">348</span><br><span class="line-number">349</span><br><span class="line-number">350</span><br><span class="line-number">351</span><br></div></div><h3 id="cert-manager" tabindex="-1"><a class="header-anchor" href="#cert-manager" aria-hidden="true">#</a> cert-manager</h3>`,5),_n={href:"https://cert-manager.io/",target:"_blank",rel:"noopener noreferrer"},En=n("cert-manager"),Nn={href:"https://artifacthub.io/packages/helm/jetstack/cert-manager",target:"_blank",rel:"noopener noreferrer"},yn=n("cert-manager"),xn={href:"https://github.com/jetstack/cert-manager/blob/master/deploy/charts/cert-manager/values.yaml",target:"_blank",rel:"noopener noreferrer"},Rn=n("default values.yaml"),On=r(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/cert-manager

flux create helmrelease cert-manager <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;cert-manager&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/jetstack.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;cert-manager&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;v1.6.1&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/cert-manager-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/cert-manager/cert-manager-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/cert-manager/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/cert-manager&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/cert-manager</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager&quot;</span>/cert-manager-<span class="token punctuation">{</span>kustomization,kustomization-clusterissuer,kustomization-certificate<span class="token punctuation">}</span>

flux create kustomization cert-manager <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --depends-on<span class="token operator">=</span><span class="token string">&quot;kube-prometheus-stack&quot;</span> <span class="token punctuation">\\</span>
  --path<span class="token operator">=</span><span class="token string">&quot;./infrastructure/\\<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization&quot;</span> <span class="token punctuation">\\</span>
  --prune<span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --wait <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/cert-manager-kustomization.yaml&quot;</span>

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
      - values.yaml<span class="token operator">=</span>cert-manager-values.yaml
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

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cert-manager&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- cert-manager$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource cert-manager <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br><span class="line-number">126</span><br><span class="line-number">127</span><br><span class="line-number">128</span><br><span class="line-number">129</span><br><span class="line-number">130</span><br><span class="line-number">131</span><br><span class="line-number">132</span><br><span class="line-number">133</span><br><span class="line-number">134</span><br><span class="line-number">135</span><br><span class="line-number">136</span><br><span class="line-number">137</span><br><span class="line-number">138</span><br><span class="line-number">139</span><br><span class="line-number">140</span><br><span class="line-number">141</span><br><span class="line-number">142</span><br><span class="line-number">143</span><br><span class="line-number">144</span><br><span class="line-number">145</span><br><span class="line-number">146</span><br><span class="line-number">147</span><br><span class="line-number">148</span><br><span class="line-number">149</span><br><span class="line-number">150</span><br><span class="line-number">151</span><br><span class="line-number">152</span><br><span class="line-number">153</span><br><span class="line-number">154</span><br><span class="line-number">155</span><br><span class="line-number">156</span><br><span class="line-number">157</span><br><span class="line-number">158</span><br><span class="line-number">159</span><br><span class="line-number">160</span><br><span class="line-number">161</span><br></div></div><h3 id="cluster-autoscaler" tabindex="-1"><a class="header-anchor" href="#cluster-autoscaler" aria-hidden="true">#</a> cluster-autoscaler</h3>`,5),Tn={href:"https://github.com/kubernetes/autoscaler",target:"_blank",rel:"noopener noreferrer"},$n=n("cluster-autoscaler"),In={href:"https://artifacthub.io/packages/helm/cluster-autoscaler/cluster-autoscaler",target:"_blank",rel:"noopener noreferrer"},zn=n("cluster-autoscaler"),Mn={href:"https://github.com/kubernetes/autoscaler/blob/master/charts/cluster-autoscaler/values.yaml",target:"_blank",rel:"noopener noreferrer"},Sn=n("default values.yaml"),Fn=r(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/cluster-autoscaler

flux create helmrelease cluster-autoscaler <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;cluster-autoscaler&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/autoscaler.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;cluster-autoscaler&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;9.11.0&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/cluster-autoscaler-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/cluster-autoscaler/cluster-autoscaler-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/cluster-autoscaler/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/cluster-autoscaler&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/cluster-autoscaler</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cluster-autoscaler/cluster-autoscaler-kustomization&quot;</span>

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
      - values.yaml<span class="token operator">=</span>cluster-autoscaler-values.yaml
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

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cluster-autoscaler/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/cluster-autoscaler&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- cluster-autoscaler$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource cluster-autoscaler <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br></div></div><h3 id="dex" tabindex="-1"><a class="header-anchor" href="#dex" aria-hidden="true">#</a> Dex</h3>`,5),Cn={href:"https://dexidp.io/",target:"_blank",rel:"noopener noreferrer"},Vn=n("Dex"),wn={href:"https://artifacthub.io/packages/helm/dex/dex",target:"_blank",rel:"noopener noreferrer"},Un=n("dex"),Ln={href:"https://github.com/dexidp/helm-charts/blob/master/charts/dex/values.yaml",target:"_blank",rel:"noopener noreferrer"},Dn=n("default values.yaml"),An=r(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/dex

kubectl create namespace dex --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> infrastructure/base/dex/dex-namespace.yaml

flux create helmrelease dex <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;dex&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/dex.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;dex&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;0.6.3&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/dex-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/dex/dex-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/dex/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/dex&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/dex</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/dex&quot;</span>

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
      - values.yaml<span class="token operator">=</span>dex-values.yaml
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

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- dex$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource dex <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br></div></div><h3 id="externaldns" tabindex="-1"><a class="header-anchor" href="#externaldns" aria-hidden="true">#</a> ExternalDNS</h3>`,5),Hn={href:"https://github.com/kubernetes-sigs/external-dns",target:"_blank",rel:"noopener noreferrer"},Gn=n("ExternalDNS"),Kn={href:"https://artifacthub.io/packages/helm/bitnami/external-dns",target:"_blank",rel:"noopener noreferrer"},Qn=n("external-dns"),Bn={href:"https://github.com/bitnami/charts/blob/master/bitnami/external-dns/values.yaml",target:"_blank",rel:"noopener noreferrer"},Pn=n("default values.yaml"),Yn=r(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/external-dns

flux create helmrelease external-dns <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;external-dns&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/bitnami.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;external-dns&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;6.0.2&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/external-dns-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/external-dns/external-dns-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/external-dns/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/external-dns&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/external-dns</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-dns/external-dns-kustomization&quot;</span>

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
      - values.yaml<span class="token operator">=</span>external-dns-values.yaml
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

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-dns/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/external-dns&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- external-dns$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource external-dns <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br></div></div><h3 id="flux-provides-alerts-receivers-and-monitoring" tabindex="-1"><a class="header-anchor" href="#flux-provides-alerts-receivers-and-monitoring" aria-hidden="true">#</a> Flux provides, alerts, receivers and monitoring</h3>`,5),Wn={href:"https://fluxcd.io/",target:"_blank",rel:"noopener noreferrer"},Xn=n("flux"),jn=r(`<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux&quot;</span>/flux-<span class="token punctuation">{</span>kustomization-provider,kustomization-alert,kustomization-receiver,kustomization-podmonitor<span class="token punctuation">}</span>

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
  --type<span class="token operator">=</span>slack <span class="token punctuation">\\</span>
  --channel<span class="token operator">=</span><span class="token string">&quot;\\<span class="token variable">\${SLACK_CHANNEL}</span>&quot;</span> <span class="token punctuation">\\</span>
  --secret-ref<span class="token operator">=</span>slack-url <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-provider/flux-provider-slack.yaml&quot;</span>

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
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --depends-on<span class="token operator">=</span><span class="token string">&quot;flux-provider&quot;</span> <span class="token punctuation">\\</span>
  --path<span class="token operator">=</span><span class="token string">&quot;./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-alert&quot;</span> <span class="token punctuation">\\</span>
  --prune<span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --wait <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-alert.yaml&quot;</span>

flux create alert alert-slack <span class="token punctuation">\\</span>
  --event-severity<span class="token operator">=</span>error <span class="token punctuation">\\</span>
  --event-source<span class="token operator">=</span><span class="token string">&quot;GitRepository/*,Kustomization/*,HelmRepository/*,HelmChart/*,HelmRelease/*&quot;</span> <span class="token punctuation">\\</span>
  --provider-ref<span class="token operator">=</span>slack <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-alert/flux-alert-slack.yaml&quot;</span>

flux create kustomization flux-podmonitor <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --depends-on<span class="token operator">=</span><span class="token string">&quot;kube-prometheus-stack&quot;</span> <span class="token punctuation">\\</span>
  --path<span class="token operator">=</span><span class="token string">&quot;./infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-podmonitor&quot;</span> <span class="token punctuation">\\</span>
  --prune<span class="token operator">=</span><span class="token string">&quot;true&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --wait <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-podmonitor.yaml&quot;</span>

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
  --type<span class="token operator">=</span>github <span class="token punctuation">\\</span>
  --event<span class="token operator">=</span>ping --event<span class="token operator">=</span>push <span class="token punctuation">\\</span>
  --secret-ref<span class="token operator">=</span>github-webhook-token <span class="token punctuation">\\</span>
  --resource<span class="token operator">=</span><span class="token string">&quot;GitRepository/flux-system&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/flux-kustomization-receiver/flux-receiver-github.yaml&quot;</span>

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

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/flux&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- flux$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource flux <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br><span class="line-number">126</span><br><span class="line-number">127</span><br><span class="line-number">128</span><br><span class="line-number">129</span><br><span class="line-number">130</span><br><span class="line-number">131</span><br><span class="line-number">132</span><br><span class="line-number">133</span><br><span class="line-number">134</span><br><span class="line-number">135</span><br><span class="line-number">136</span><br><span class="line-number">137</span><br><span class="line-number">138</span><br><span class="line-number">139</span><br><span class="line-number">140</span><br><span class="line-number">141</span><br><span class="line-number">142</span><br><span class="line-number">143</span><br><span class="line-number">144</span><br><span class="line-number">145</span><br><span class="line-number">146</span><br><span class="line-number">147</span><br><span class="line-number">148</span><br><span class="line-number">149</span><br><span class="line-number">150</span><br><span class="line-number">151</span><br><span class="line-number">152</span><br><span class="line-number">153</span><br><span class="line-number">154</span><br><span class="line-number">155</span><br><span class="line-number">156</span><br><span class="line-number">157</span><br><span class="line-number">158</span><br><span class="line-number">159</span><br></div></div><h3 id="ingress-nginx" tabindex="-1"><a class="header-anchor" href="#ingress-nginx" aria-hidden="true">#</a> ingress-nginx</h3>`,2),Zn={href:"https://kubernetes.github.io/ingress-nginx/",target:"_blank",rel:"noopener noreferrer"},Jn=n("ingress-nginx"),sa={href:"https://artifacthub.io/packages/helm/ingress-nginx/ingress-nginx",target:"_blank",rel:"noopener noreferrer"},na=n("ingress-nginx"),aa={href:"https://github.com/kubernetes/ingress-nginx/blob/master/charts/ingress-nginx/values.yaml",target:"_blank",rel:"noopener noreferrer"},ea=n("default values.yaml"),pa=r(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/ingress-nginx

kubectl create namespace ingress-nginx --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> infrastructure/base/ingress-nginx/ingress-nginx-namespace.yaml

flux create helmrelease ingress-nginx <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;ingress-nginx&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/ingress-nginx.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;ingress-nginx&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;4.0.13&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/ingress-nginx-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/ingress-nginx/ingress-nginx-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/ingress-nginx/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/ingress-nginx&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/ingress-nginx</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/ingress-nginx/ingress-nginx-kustomization&quot;</span>

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
      - values.yaml<span class="token operator">=</span>ingress-nginx-values.yaml
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

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/ingress-nginx/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/ingress-nginx&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- ingress-nginx$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource ingress-nginx <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br></div></div><h3 id="mailhog" tabindex="-1"><a class="header-anchor" href="#mailhog" aria-hidden="true">#</a> MailHog</h3>`,5),ta={href:"https://github.com/mailhog/MailHog",target:"_blank",rel:"noopener noreferrer"},ra=n("mailhog"),la={href:"https://artifacthub.io/packages/helm/codecentric/mailhog",target:"_blank",rel:"noopener noreferrer"},oa=n("mailhog"),ca={href:"https://github.com/codecentric/helm-charts/blob/master/charts/mailhog/values.yaml",target:"_blank",rel:"noopener noreferrer"},ia=n("default values.yaml"),ua=r(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/mailhog

kubectl create namespace mailhog --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> infrastructure/base/mailhog/mailhog-namespace.yaml

flux create helmrelease mailhog <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;mailhog&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/codecentric.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;mailhog&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;5.0.2&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/mailhog-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/mailhog/mailhog-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/mailhog/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/mailhog&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/mailhog</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/mailhog&quot;</span>

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
      - values.yaml<span class="token operator">=</span>mailhog-values.yaml
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

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- mailhog$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource mailhog <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br></div></div><h3 id="oauth2-proxy" tabindex="-1"><a class="header-anchor" href="#oauth2-proxy" aria-hidden="true">#</a> OAuth2 Proxy</h3>`,5),ba={href:"https://oauth2-proxy.github.io/oauth2-proxy/",target:"_blank",rel:"noopener noreferrer"},ma=n("oauth2-proxy"),ka={href:"https://artifacthub.io/packages/helm/oauth2-proxy/oauth2-proxy",target:"_blank",rel:"noopener noreferrer"},da=n("oauth2-proxy"),ga={href:"https://github.com/oauth2-proxy/manifests/blob/main/helm/oauth2-proxy/values.yaml",target:"_blank",rel:"noopener noreferrer"},ha=n("default values.yaml"),fa=r(`<p>Define &quot;base level&quot; application definition in <code>infrastructure</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp infrastructure/base/oauth2-proxy

kubectl create namespace oauth2-proxy --dry-run<span class="token operator">=</span>client -o yaml <span class="token operator">&gt;</span> infrastructure/base/oauth2-proxy/oauth2-proxy-namespace.yaml

flux create helmrelease oauth2-proxy <span class="token punctuation">\\</span>
  --namespace<span class="token operator">=</span><span class="token string">&quot;oauth2-proxy&quot;</span> <span class="token punctuation">\\</span>
  --interval<span class="token operator">=</span><span class="token string">&quot;5m&quot;</span> <span class="token punctuation">\\</span>
  --source<span class="token operator">=</span><span class="token string">&quot;HelmRepository/oauth2-proxy.flux-system&quot;</span> <span class="token punctuation">\\</span>
  --chart<span class="token operator">=</span><span class="token string">&quot;oauth2-proxy&quot;</span> <span class="token punctuation">\\</span>
  --chart-version<span class="token operator">=</span><span class="token string">&quot;5.0.6&quot;</span> <span class="token punctuation">\\</span>
  --values-from<span class="token operator">=</span><span class="token string">&quot;ConfigMap/oauth2-proxy-values&quot;</span> <span class="token punctuation">\\</span>
  --export <span class="token operator">&gt;</span> infrastructure/base/oauth2-proxy/oauth2-proxy-helmrelease.yaml

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/base/oauth2-proxy/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/base/oauth2-proxy&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>Define &quot;infrastructure level&quot; application definition in <code>infrastructure/\${ENVIRONMENT}/oauth2-proxy</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -vp <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy/oauth2-proxy-kustomization&quot;</span>

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
      - values.yaml<span class="token operator">=</span>oauth2-proxy-values.yaml
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

<span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy/kustomization.yaml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/oauth2-proxy&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize create --autodetect <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>

<span class="token operator">!</span> <span class="token function">grep</span> -q <span class="token string">&#39;\\- oauth2-proxy$&#39;</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>/kustomization.yaml&quot;</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\\</span>
<span class="token punctuation">(</span> <span class="token builtin class-name">cd</span> <span class="token string">&quot;infrastructure/<span class="token variable">\${ENVIRONMENT}</span>&quot;</span> <span class="token operator">&amp;&amp;</span> kustomize edit <span class="token function">add</span> resource oauth2-proxy <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">cd</span> - <span class="token operator">||</span> <span class="token builtin class-name">exit</span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br></div></div><h2 id="flux" tabindex="-1"><a class="header-anchor" href="#flux" aria-hidden="true">#</a> Flux</h2><p>Commit changes to git repository and &quot;refresh&quot; flux. Wait for receiver and then configure the GitHub repository to send Webhooks to Flux:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token assign-left variable">GITHUB_WEBHOOKS</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">curl</span> -s -H <span class="token string">&quot;Authorization: token <span class="token variable">$GITHUB_TOKEN</span>&quot;</span> <span class="token string">&quot;https://api.github.com/repos/<span class="token variable">\${GITHUB_USER}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>/hooks&quot;</span> <span class="token operator">|</span> jq <span class="token string">&quot;.[].config.url&quot;</span><span class="token variable">)</span></span>
<span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token string">&quot;<span class="token variable">\${GITHUB_WEBHOOKS}</span>&quot;</span> <span class="token operator">=~</span> <span class="token variable">\${CLUSTER_FQDN}</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
  <span class="token function">git</span> <span class="token function">add</span> <span class="token builtin class-name">.</span>
  <span class="token function">git</span> commit -m <span class="token string">&quot;[<span class="token variable">\${CLUSTER_NAME}</span>] Initial core applications commit&quot;</span> <span class="token operator">||</span> <span class="token boolean">true</span>
  <span class="token function">git</span> push
  flux reconcile <span class="token builtin class-name">source</span> <span class="token function">git</span> flux-system
  <span class="token function">sleep</span> <span class="token number">100</span>
  kubectl <span class="token function">wait</span> --timeout<span class="token operator">=</span>20m --for<span class="token operator">=</span>condition<span class="token operator">=</span>ready kustomizations.kustomize.toolkit.fluxcd.io -n flux-system flux-receiver
  <span class="token assign-left variable">FLUX_RECEIVER_URL</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>kubectl -n flux-system get receiver github-receiver -o <span class="token assign-left variable">jsonpath</span><span class="token operator">=</span><span class="token string">&quot;{.status.url}&quot;</span><span class="token variable">)</span></span>
  <span class="token function">curl</span> -s -H <span class="token string">&quot;Authorization: token <span class="token variable">$GITHUB_TOKEN</span>&quot;</span> -X POST -d <span class="token string">&quot;{<span class="token entity" title="\\&quot;">\\&quot;</span>active<span class="token entity" title="\\&quot;">\\&quot;</span>: true, <span class="token entity" title="\\&quot;">\\&quot;</span>events<span class="token entity" title="\\&quot;">\\&quot;</span>: [<span class="token entity" title="\\&quot;">\\&quot;</span>push<span class="token entity" title="\\&quot;">\\&quot;</span>], <span class="token entity" title="\\&quot;">\\&quot;</span>config<span class="token entity" title="\\&quot;">\\&quot;</span>: {<span class="token entity" title="\\&quot;">\\&quot;</span>url<span class="token entity" title="\\&quot;">\\&quot;</span>: <span class="token entity" title="\\&quot;">\\&quot;</span>https://flux-receiver.<span class="token variable">\${CLUSTER_FQDN}</span><span class="token variable">\${FLUX_RECEIVER_URL}</span><span class="token entity" title="\\&quot;">\\&quot;</span>, <span class="token entity" title="\\&quot;">\\&quot;</span>content_type<span class="token entity" title="\\&quot;">\\&quot;</span>: <span class="token entity" title="\\&quot;">\\&quot;</span>json<span class="token entity" title="\\&quot;">\\&quot;</span>, <span class="token entity" title="\\&quot;">\\&quot;</span>secret<span class="token entity" title="\\&quot;">\\&quot;</span>: <span class="token entity" title="\\&quot;">\\&quot;</span><span class="token variable">\${MY_GITHUB_WEBHOOK_TOKEN}</span><span class="token entity" title="\\&quot;">\\&quot;</span>, <span class="token entity" title="\\&quot;">\\&quot;</span>insecure_ssl<span class="token entity" title="\\&quot;">\\&quot;</span>: <span class="token entity" title="\\&quot;">\\&quot;</span>1<span class="token entity" title="\\&quot;">\\&quot;</span>}}&quot;</span> <span class="token string">&quot;https://api.github.com/repos/<span class="token variable">\${GITHUB_USER}</span>/<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>/hooks&quot;</span> <span class="token operator">|</span> jq
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>Due to the way how Crossplane installs the providers it is not possible to specify the name of the <code>ServiceAccount</code> in advance. Therefore you need to get the details about <code>ServiceAccount</code> created by Crossplane and use eksctl to create IRSA:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span> eksctl get iamserviceaccount --cluster<span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> --namespace crossplane-system -o yaml <span class="token variable">)</span></span>&quot;</span> <span class="token operator">==</span> <span class="token string">&quot;null&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token punctuation">;</span> <span class="token keyword">then</span>
  kubectl <span class="token function">wait</span> --timeout<span class="token operator">=</span>10m --for<span class="token operator">=</span>condition<span class="token operator">=</span>ready kustomizations crossplane-provider -n flux-system
  kubectl <span class="token function">wait</span> --timeout<span class="token operator">=</span>10m --for<span class="token operator">=</span>condition<span class="token operator">=</span>Healthy provider.pkg.crossplane.io provider-aws
  <span class="token assign-left variable">CROSSPLANE_PROVIDER_AWS_SERVICE_ACCOUNT_NAME</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>kubectl get serviceaccounts -n crossplane-system -o<span class="token operator">=</span>custom-columns<span class="token operator">=</span>NAME:.metadata.name <span class="token operator">|</span> <span class="token function">grep</span> provider-aws<span class="token variable">)</span></span>
  eksctl create iamserviceaccount --cluster<span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> --name<span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CROSSPLANE_PROVIDER_AWS_SERVICE_ACCOUNT_NAME}</span>&quot;</span> --namespace<span class="token operator">=</span><span class="token string">&quot;crossplane-system&quot;</span> --role-name<span class="token operator">=</span><span class="token string">&quot;crossplane-provider-aws-<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> --role-only --attach-policy-arn<span class="token operator">=</span><span class="token string">&quot;arn:aws:iam::aws:policy/AdministratorAccess&quot;</span> --tags<span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${TAGS<span class="token operator">/</span><span class="token operator">/</span> <span class="token operator">/</span><span class="token operator">,</span>}</span>&quot;</span> --approve
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div>`,9);function va(qa,_a){const p=l("RouterLink"),e=l("ExternalLinkIcon");return c(),i(u,null,[m,s("nav",k,[s("ul",null,[s("li",null,[a(p,{to:"#flux-dis-advantages"},{default:t(()=>[d]),_:1})]),s("li",null,[a(p,{to:"#solution-requirements-for-flux"},{default:t(()=>[g]),_:1}),s("ul",null,[s("li",null,[a(p,{to:"#naming-convention-and-directory-structure"},{default:t(()=>[h]),_:1})])])]),s("li",null,[a(p,{to:"#create-basic-flux-structure-in-git-repository"},{default:t(()=>[f]),_:1})]),s("li",null,[a(p,{to:"#manage-kubernetes-secrets-with-mozilla-sops-and-amazon-secret-manager"},{default:t(()=>[v]),_:1})]),s("li",null,[a(p,{to:"#helmrepositories"},{default:t(()=>[q]),_:1})]),s("li",null,[a(p,{to:"#clusters"},{default:t(()=>[_]),_:1})]),s("li",null,[a(p,{to:"#create-initial-apps-dev-group-definitions"},{default:t(()=>[E]),_:1})]),s("li",null,[a(p,{to:"#base-applications-definitions"},{default:t(()=>[N]),_:1}),s("ul",null,[s("li",null,[a(p,{to:"#amazon-elastic-block-store-ebs-csi-driver"},{default:t(()=>[y]),_:1})]),s("li",null,[a(p,{to:"#crossplane"},{default:t(()=>[x]),_:1})]),s("li",null,[a(p,{to:"#csi-snapshotter"},{default:t(()=>[R]),_:1})]),s("li",null,[a(p,{to:"#kubernetes-metrics-server"},{default:t(()=>[O]),_:1})]),s("li",null,[a(p,{to:"#kube-prometheus-stack"},{default:t(()=>[T]),_:1})]),s("li",null,[a(p,{to:"#cert-manager"},{default:t(()=>[$]),_:1})]),s("li",null,[a(p,{to:"#cluster-autoscaler"},{default:t(()=>[I]),_:1})]),s("li",null,[a(p,{to:"#dex"},{default:t(()=>[z]),_:1})]),s("li",null,[a(p,{to:"#externaldns"},{default:t(()=>[M]),_:1})]),s("li",null,[a(p,{to:"#flux-provides-alerts-receivers-and-monitoring"},{default:t(()=>[S]),_:1})]),s("li",null,[a(p,{to:"#ingress-nginx"},{default:t(()=>[F]),_:1})]),s("li",null,[a(p,{to:"#mailhog"},{default:t(()=>[C]),_:1})]),s("li",null,[a(p,{to:"#oauth2-proxy"},{default:t(()=>[V]),_:1})])])]),s("li",null,[a(p,{to:"#flux"},{default:t(()=>[w]),_:1})])])]),U,s("ul",null,[s("li",null,[L,D,A,H,G,K,s("a",Q,[B,a(e)]),P,s("a",Y,[W,a(e)]),X,s("a",j,[Z,a(e)]),J,ss,ns,as,es,ps,ts,rs,ls]),s("li",null,[s("a",os,[cs,a(e)]),is,us,bs]),s("li",null,[s("a",ms,[ks,a(e)]),ds,s("a",gs,[hs,a(e)])]),fs]),vs,s("ul",null,[qs,_s,s("li",null,[Es,Ns,ys,xs,Rs,Os,Ts,$s,Is,s("ul",null,[zs,Ms,s("li",null,[s("a",Ss,[Fs,a(e)]),Cs,Vs,ws])])]),Us]),Ls,s("p",null,[s("a",Ds,[As,a(e)])]),s("ul",null,[s("li",null,[s("a",Hs,[Gs,a(e)])]),s("li",null,[s("a",Ks,[Qs,a(e)])])]),Bs,s("p",null,[s("a",Ps,[Ys,a(e)])]),s("ul",null,[s("li",null,[s("a",Ws,[Xs,a(e)])]),s("li",null,[s("a",js,[Zs,a(e)])])]),Js,s("p",null,[sn,nn,an,s("a",en,[pn,a(e)])]),tn,s("p",null,[s("a",rn,[ln,a(e)])]),s("ul",null,[s("li",null,[s("a",on,[cn,a(e)])]),s("li",null,[s("a",un,[bn,a(e)])])]),mn,s("p",null,[s("a",kn,[dn,a(e)])]),s("ul",null,[s("li",null,[s("a",gn,[hn,a(e)])]),s("li",null,[s("a",fn,[vn,a(e)])])]),qn,s("p",null,[s("a",_n,[En,a(e)])]),s("ul",null,[s("li",null,[s("a",Nn,[yn,a(e)])]),s("li",null,[s("a",xn,[Rn,a(e)])])]),On,s("p",null,[s("a",Tn,[$n,a(e)])]),s("ul",null,[s("li",null,[s("a",In,[zn,a(e)])]),s("li",null,[s("a",Mn,[Sn,a(e)])])]),Fn,s("p",null,[s("a",Cn,[Vn,a(e)])]),s("ul",null,[s("li",null,[s("a",wn,[Un,a(e)])]),s("li",null,[s("a",Ln,[Dn,a(e)])])]),An,s("p",null,[s("a",Hn,[Gn,a(e)])]),s("ul",null,[s("li",null,[s("a",Kn,[Qn,a(e)])]),s("li",null,[s("a",Bn,[Pn,a(e)])])]),Yn,s("p",null,[s("a",Wn,[Xn,a(e)])]),jn,s("p",null,[s("a",Zn,[Jn,a(e)])]),s("ul",null,[s("li",null,[s("a",sa,[na,a(e)])]),s("li",null,[s("a",aa,[ea,a(e)])])]),pa,s("p",null,[s("a",ta,[ra,a(e)])]),s("ul",null,[s("li",null,[s("a",la,[oa,a(e)])]),s("li",null,[s("a",ca,[ia,a(e)])])]),ua,s("p",null,[s("a",ba,[ma,a(e)])]),s("ul",null,[s("li",null,[s("a",ka,[da,a(e)])]),s("li",null,[s("a",ga,[ha,a(e)])])]),fa],64)}var Na=o(b,[["render",va],["__file","index.html.vue"]]);export{Na as default};
