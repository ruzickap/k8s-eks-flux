import{_ as o,r,o as c,c as i,a as n,b as a,w as l,F as u,d as s,e as p}from"./app.36393f6e.js";const b={},m=n("h1",{id:"create-initial-aws-structure",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#create-initial-aws-structure","aria-hidden":"true"},"#"),s(" Create initial AWS structure")],-1),k={class:"table-of-contents"},d=s("Requirements"),_=s("Prepare the local working environment"),q=s("Configure AWS Route 53 Domain delegation"),v=s("Create networking for Amazon EKS"),g=p(`<h2 id="requirements" tabindex="-1"><a class="header-anchor" href="#requirements" aria-hidden="true">#</a> Requirements</h2><p>If you would like to follow this documents and it&#39;s task you will need to set up few environment variables.</p><p><code>BASE_DOMAIN</code> (<code>k8s.mylabs.dev</code>) contains DNS records for all your Kubernetes clusters. The cluster names will look like <code>CLUSTER_NAME</code>.<code>BASE_DOMAIN</code> (<code>kube1.k8s.mylabs.dev</code>).</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># Hostname / FQDN definitions</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">BASE_DOMAIN</span><span class="token operator">=</span><span class="token variable">\${BASE_DOMAIN<span class="token operator">:-</span>k8s.mylabs.dev}</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">CLUSTER_NAME</span><span class="token operator">=</span><span class="token variable">\${CLUSTER_NAME<span class="token operator">:-</span>kube1}</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">CLUSTER_FQDN</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>.<span class="token variable">\${BASE_DOMAIN}</span>&quot;</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">KUBECONFIG</span><span class="token operator">=</span><span class="token variable">\${<span class="token environment constant">PWD</span>}</span>/tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/kubeconfig-<span class="token variable">\${CLUSTER_NAME}</span>.conf
<span class="token builtin class-name">export</span> <span class="token assign-left variable">MY_EMAIL</span><span class="token operator">=</span><span class="token string">&quot;petr.ruzicka@gmail.com&quot;</span>
<span class="token comment"># GitHub Organization + Team where are the users who will have the admin access</span>
<span class="token comment"># to K8s resources (Grafana). Only users in GitHub organization</span>
<span class="token comment"># (MY_GITHUB_ORG_NAME) will be able to access the apps via ingress.</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">MY_GITHUB_ORG_NAME</span><span class="token operator">=</span><span class="token string">&quot;ruzickap-org&quot;</span>
<span class="token comment"># Set dev, prd, stg or eny other environment</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">ENVIRONMENT</span><span class="token operator">=</span><span class="token string">&quot;dev&quot;</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">LETSENCRYPT_ENVIRONMENT</span><span class="token operator">=</span><span class="token string">&quot;staging&quot;</span>
<span class="token comment"># * &quot;production&quot; - valid certificates signed by Lets Encrypt &quot;&quot;</span>
<span class="token comment"># * &quot;staging&quot; - not trusted certs signed by Lets Encrypt &quot;Fake LE Intermediate X1&quot;</span>
<span class="token comment"># Flux GitHub repository</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">GITHUB_USER</span><span class="token operator">=</span><span class="token string">&quot;ruzickap&quot;</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">GITHUB_FLUX_REPOSITORY</span><span class="token operator">=</span><span class="token string">&quot;k8s-eks-flux-repo&quot;</span>
<span class="token assign-left variable">MY_GITHUB_WEBHOOK_TOKEN</span><span class="token operator">=</span><span class="token variable">\${MY_GITHUB_WEBHOOK_TOKEN<span class="token operator">:-</span>$(head -c 12 <span class="token operator">/</span>dev<span class="token operator">/</span>urandom | md5sum | cut -d &quot; &quot; -f1)}</span>
<span class="token builtin class-name">export</span> MY_GITHUB_WEBHOOK_TOKEN
<span class="token assign-left variable">MY_COOKIE_SECRET</span><span class="token operator">=</span><span class="token variable">\${MY_COOKIE_SECRET<span class="token operator">:-</span>$(head -c 32 <span class="token operator">/</span>dev<span class="token operator">/</span>urandom | base64)}</span>
<span class="token builtin class-name">export</span> MY_COOKIE_SECRET
<span class="token builtin class-name">export</span> <span class="token assign-left variable">SLACK_CHANNEL</span><span class="token operator">=</span><span class="token string">&quot;mylabs&quot;</span>
<span class="token comment"># AWS Region</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">AWS_DEFAULT_REGION</span><span class="token operator">=</span><span class="token string">&quot;eu-central-1&quot;</span>
<span class="token comment"># Disable pager for AWS CLI</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">AWS_PAGER</span><span class="token operator">=</span><span class="token string">&quot;&quot;</span>
<span class="token comment"># Tags used to tag the AWS resources</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">TAGS</span><span class="token operator">=</span><span class="token string">&quot;Owner=<span class="token variable">\${MY_EMAIL}</span> Environment=<span class="token variable">\${ENVIRONMENT}</span> Group=Cloud_Native Squad=Cloud_Container_Platform&quot;</span>
<span class="token builtin class-name">echo</span> -e <span class="token string">&quot;<span class="token variable">\${MY_EMAIL}</span> | <span class="token variable">\${CLUSTER_NAME}</span> | <span class="token variable">\${BASE_DOMAIN}</span> | <span class="token variable">\${CLUSTER_FQDN}</span><span class="token entity" title="\\n">\\n</span><span class="token variable">\${TAGS}</span>&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br></div></div>`,4),x=s("You will need to configure "),h={href:"https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html",target:"_blank",rel:"noopener noreferrer"},S=s("AWS CLI"),f=s(" and other secrets/variables."),E=p(`<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token comment"># AWS Credentials</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">AWS_ACCESS_KEY_ID</span><span class="token operator">=</span><span class="token string">&quot;xxxxxxxxxxxxxxxxxx&quot;</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">AWS_SECRET_ACCESS_KEY</span><span class="token operator">=</span><span class="token string">&quot;xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&quot;</span>
<span class="token comment">#export AWS_SESSION_TOKEN=&quot;.....&quot;</span>
<span class="token comment"># Common password</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">MY_PASSWORD</span><span class="token operator">=</span><span class="token string">&quot;xxxx&quot;</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">GITHUB_TOKEN</span><span class="token operator">=</span><span class="token string">&quot;xxxxx&quot;</span>
<span class="token comment"># Slack incoming webhook</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">SLACK_INCOMING_WEBHOOK_URL</span><span class="token operator">=</span><span class="token string">&quot;https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK&quot;</span>
<span class="token comment"># GitHub Organization OAuth Apps credentials</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID</span><span class="token operator">=</span><span class="token string">&quot;3xxxxxxxxxxxxxxxxxx3&quot;</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET</span><span class="token operator">=</span><span class="token string">&quot;7xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx8&quot;</span>
<span class="token comment"># Okta configuration</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">OKTA_ISSUER</span><span class="token operator">=</span><span class="token string">&quot;https://exxxxxxx-xxxxx-xx.okta.com&quot;</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">OKTA_CLIENT_ID</span><span class="token operator">=</span><span class="token string">&quot;0xxxxxxxxxxxxxxxxxx7&quot;</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">OKTA_CLIENT_SECRET</span><span class="token operator">=</span><span class="token string">&quot;1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxH&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p>Verify if all the necessary variables were set:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token keyword">case</span> <span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token keyword">in</span>
  kube1<span class="token punctuation">)</span>
    <span class="token assign-left variable">MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID</span><span class="token operator">=</span><span class="token variable">\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID<span class="token operator">:-</span>\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID_KUBE1}</span><span class="token punctuation">}</span>
    <span class="token assign-left variable">MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET</span><span class="token operator">=</span><span class="token variable">\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET<span class="token operator">:-</span>\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET_KUBE1}</span><span class="token punctuation">}</span>
  <span class="token punctuation">;</span><span class="token punctuation">;</span>
  kube2<span class="token punctuation">)</span>
    <span class="token assign-left variable">MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID</span><span class="token operator">=</span><span class="token variable">\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID<span class="token operator">:-</span>\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID_KUBE2}</span><span class="token punctuation">}</span>
    <span class="token assign-left variable">MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET</span><span class="token operator">=</span><span class="token variable">\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET<span class="token operator">:-</span>\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET_KUBE2}</span><span class="token punctuation">}</span>
  <span class="token punctuation">;</span><span class="token punctuation">;</span>
  *<span class="token punctuation">)</span>
    <span class="token builtin class-name">echo</span> <span class="token string">&quot;Unsupported cluster name: <span class="token variable">\${CLUSTER_NAME}</span> !&quot;</span>
    <span class="token builtin class-name">exit</span> <span class="token number">1</span>
  <span class="token punctuation">;</span><span class="token punctuation">;</span>
<span class="token keyword">esac</span>

<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${AWS_ACCESS_KEY_ID?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${AWS_DEFAULT_REGION?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${AWS_SECRET_ACCESS_KEY?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${BASE_DOMAIN?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${CLUSTER_FQDN?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${ENVIRONMENT?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${GITHUB_FLUX_REPOSITORY?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${GITHUB_TOKEN?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${GITHUB_USER?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${KUBECONFIG?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${LETSENCRYPT_ENVIRONMENT?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${MY_COOKIE_SECRET?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${MY_EMAIL?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${MY_GITHUB_ORG_NAME?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${MY_GITHUB_WEBHOOK_TOKEN?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${MY_PASSWORD?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${OKTA_CLIENT_ID?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${OKTA_CLIENT_SECRET?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${OKTA_ISSUER?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${SLACK_CHANNEL?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${SLACK_INCOMING_WEBHOOK_URL?}</span>&quot;</span>
<span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${TAGS?}</span>&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br></div></div><h2 id="prepare-the-local-working-environment" tabindex="-1"><a class="header-anchor" href="#prepare-the-local-working-environment" aria-hidden="true">#</a> Prepare the local working environment</h2><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>You can skip these steps if you have all the required software already installed.</p></div><p>Install necessary software:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token keyword">if</span> <span class="token builtin class-name">command</span> -v <span class="token function">apt-get</span> <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span>
  <span class="token function">apt</span> update -qq
  <span class="token assign-left variable">DEBIAN_FRONTEND</span><span class="token operator">=</span>noninteractive <span class="token function">apt-get</span> <span class="token function">install</span> -y -qq <span class="token function">curl</span> <span class="token function">git</span> jq <span class="token function">sudo</span> <span class="token function">unzip</span> <span class="token operator">&gt;</span> /dev/null
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div>`,7),A=s("Install "),y={href:"https://aws.amazon.com/cli/",target:"_blank",rel:"noopener noreferrer"},T=s("AWS CLI"),C=s(" binary:"),N=p(`<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token keyword">if</span> <span class="token operator">!</span> <span class="token builtin class-name">command</span> -v aws <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span>
  <span class="token function">curl</span> -sL <span class="token string">&quot;https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip&quot;</span> -o <span class="token string">&quot;/tmp/awscliv2.zip&quot;</span>
  <span class="token function">unzip</span> -q -o /tmp/awscliv2.zip -d /tmp/
  <span class="token function">sudo</span> /tmp/aws/install
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div>`,1),I=s("Install "),R={href:"https://github.com/kubernetes-sigs/aws-iam-authenticator",target:"_blank",rel:"noopener noreferrer"},w=s("AWS IAM Authenticator for Kubernetes"),P=s(":"),O=p(`<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token keyword">if</span> <span class="token operator">!</span> <span class="token builtin class-name">command</span> -v aws-iam-authenticator <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span>
  <span class="token comment"># https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html</span>
  <span class="token function">sudo</span> <span class="token function">curl</span> -s -Lo /usr/local/bin/aws-iam-authenticator <span class="token string">&quot;https://amazon-eks.s3.us-west-2.amazonaws.com/1.21.2/2021-07-05/bin/<span class="token variable"><span class="token variable">$(</span><span class="token function">uname</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">&quot;s/./\\L&amp;/g&quot;</span><span class="token variable">)</span></span>/amd64/aws-iam-authenticator&quot;</span>
  <span class="token function">sudo</span> <span class="token function">chmod</span> a+x /usr/local/bin/aws-iam-authenticator
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div>`,1),D=s("Install "),$={href:"https://github.com/kubernetes/kubectl",target:"_blank",rel:"noopener noreferrer"},K=s("kubectl"),U=s(" binary:"),G=p(`<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token keyword">if</span> <span class="token operator">!</span> <span class="token builtin class-name">command</span> -v kubectl <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span>
  <span class="token comment"># https://github.com/kubernetes/kubectl/releases</span>
  <span class="token function">sudo</span> <span class="token function">curl</span> -s -Lo /usr/local/bin/kubectl <span class="token string">&quot;https://storage.googleapis.com/kubernetes-release/release/v1.21.7/bin/<span class="token variable"><span class="token variable">$(</span><span class="token function">uname</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">&quot;s/./\\L&amp;/g&quot;</span> <span class="token variable">)</span></span>/amd64/kubectl&quot;</span>
  <span class="token function">sudo</span> <span class="token function">chmod</span> a+x /usr/local/bin/kubectl
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div>`,1),M=s("Install "),L={href:"https://eksctl.io/",target:"_blank",rel:"noopener noreferrer"},V=s("eksctl"),B=s(":"),W=p(`<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token keyword">if</span> <span class="token operator">!</span> <span class="token builtin class-name">command</span> -v eksctl <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span>
  <span class="token comment"># https://github.com/weaveworks/eksctl/releases</span>
  <span class="token function">curl</span> -s -L <span class="token string">&quot;https://github.com/weaveworks/eksctl/releases/download/v0.75.0/eksctl_<span class="token variable"><span class="token variable">$(</span><span class="token function">uname</span><span class="token variable">)</span></span>_amd64.tar.gz&quot;</span> <span class="token operator">|</span> <span class="token function">sudo</span> <span class="token function">tar</span> xz -C /usr/local/bin/
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div>`,1),z=s("Install "),F={href:"https://toolkit.fluxcd.io/",target:"_blank",rel:"noopener noreferrer"},H=s("flux"),Y=s(":"),Z=p(`<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token keyword">if</span> <span class="token operator">!</span> <span class="token builtin class-name">command</span> -v flux <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span>
  <span class="token comment"># https://github.com/fluxcd/flux2/releases</span>
  <span class="token builtin class-name">export</span> <span class="token assign-left variable">FLUX_VERSION</span><span class="token operator">=</span><span class="token number">0.24</span>.1
  <span class="token function">curl</span> -s https://fluxcd.io/install.sh <span class="token operator">|</span> <span class="token function">sudo</span> -E <span class="token function">bash</span>
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div>`,1),Q=s("Install "),j={href:"https://helm.sh/",target:"_blank",rel:"noopener noreferrer"},X=s("Helm"),J=s(":"),ss=p(`<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token keyword">if</span> <span class="token operator">!</span> <span class="token builtin class-name">command</span> -v helm <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span>
  <span class="token comment"># https://github.com/helm/helm/releases</span>
  <span class="token function">curl</span> -s https://raw.githubusercontent.com/helm/helm/master/scripts/get <span class="token operator">|</span> <span class="token function">bash</span> -s -- --version v3.7.1
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div>`,1),ns=s("Install "),as={href:"https://github.com/mozilla/sops",target:"_blank",rel:"noopener noreferrer"},es=s("Mozilla SOPS"),ps=s(":"),ts=p(`<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token keyword">if</span> <span class="token operator">!</span> <span class="token builtin class-name">command</span> -v sops <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span>
  <span class="token comment"># https://github.com/mozilla/sops/releases</span>
  <span class="token function">curl</span> -sL <span class="token string">&quot;https://github.com/mozilla/sops/releases/download/v3.7.1/sops_3.7.1_amd64.deb&quot;</span> -o /tmp/sops_amd64.deb
  <span class="token function">apt</span> <span class="token function">install</span> -y /tmp/sops_amd64.deb <span class="token operator">&gt;</span> /dev/null
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div>`,1),ls=s("Install "),rs={href:"https://kustomize.io/",target:"_blank",rel:"noopener noreferrer"},os=s("kustomize"),cs=s(":"),is=p(`<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token keyword">if</span> <span class="token operator">!</span> <span class="token builtin class-name">command</span> -v kustomize <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span>
  <span class="token comment"># https://github.com/kubernetes-sigs/kustomize/releases</span>
  <span class="token function">curl</span> -s <span class="token string">&quot;https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh&quot;</span> <span class="token operator">|</span> <span class="token function">sudo</span> <span class="token function">bash</span> -s <span class="token number">4.4</span>.1 /usr/local/bin/
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h2 id="configure-aws-route-53-domain-delegation" tabindex="-1"><a class="header-anchor" href="#configure-aws-route-53-domain-delegation" aria-hidden="true">#</a> Configure AWS Route 53 Domain delegation</h2><blockquote><p>This should be done only once.</p></blockquote><p>Create DNS zone (<code>BASE_DOMAIN</code>):</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>aws route53 create-hosted-zone --output json <span class="token punctuation">\\</span>
  --name <span class="token string">&quot;<span class="token variable">\${BASE_DOMAIN}</span>&quot;</span> <span class="token punctuation">\\</span>
  --caller-reference <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span><span class="token function">date</span><span class="token variable">)</span></span>&quot;</span> <span class="token punctuation">\\</span>
  --hosted-zone-config<span class="token operator">=</span><span class="token string">&quot;{<span class="token entity" title="\\&quot;">\\&quot;</span>Comment<span class="token entity" title="\\&quot;">\\&quot;</span>: <span class="token entity" title="\\&quot;">\\&quot;</span>Created by <span class="token variable">\${MY_EMAIL}</span><span class="token entity" title="\\&quot;">\\&quot;</span>, <span class="token entity" title="\\&quot;">\\&quot;</span>PrivateZone<span class="token entity" title="\\&quot;">\\&quot;</span>: false}&quot;</span> <span class="token operator">|</span> jq
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>Use your domain registrar to change the nameservers for your zone (for example <code>mylabs.dev</code>) to use the Amazon Route 53 nameservers. Here is the way how you can find out the the Route 53 nameservers:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token assign-left variable">NEW_ZONE_ID</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>aws route53 list-hosted-zones --query <span class="token string">&quot;HostedZones[?Name==\\<span class="token variable"><span class="token variable">\`</span>$<span class="token punctuation">{</span>BASE_DOMAIN<span class="token punctuation">}</span>.<span class="token punctuation">\\</span><span class="token variable">\`</span></span>].Id&quot;</span> --output text<span class="token variable">)</span></span>
<span class="token assign-left variable">NEW_ZONE_NS</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>aws route53 get-hosted-zone --output json --id <span class="token string">&quot;<span class="token variable">\${NEW_ZONE_ID}</span>&quot;</span> --query <span class="token string">&quot;DelegationSet.NameServers&quot;</span><span class="token variable">)</span></span>
<span class="token assign-left variable">NEW_ZONE_NS1</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">\${NEW_ZONE_NS}</span>&quot;</span> <span class="token operator">|</span> jq -r <span class="token string">&quot;.[0]&quot;</span><span class="token variable">)</span></span>
<span class="token assign-left variable">NEW_ZONE_NS2</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">\${NEW_ZONE_NS}</span>&quot;</span> <span class="token operator">|</span> jq -r <span class="token string">&quot;.[1]&quot;</span><span class="token variable">)</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>Create the NS record in <code>k8s.mylabs.dev</code> (<code>BASE_DOMAIN</code>) for proper zone delegation. This step depends on your domain registrar - I&#39;m using CloudFlare and using Ansible to automate it:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>ansible -m cloudflare_dns -c <span class="token builtin class-name">local</span> -i <span class="token string">&quot;localhost,&quot;</span> localhost -a <span class="token string">&quot;zone=mylabs.dev record=<span class="token variable">\${BASE_DOMAIN}</span> type=NS value=<span class="token variable">\${NEW_ZONE_NS1}</span> solo=true proxied=no account_email=<span class="token variable">\${CLOUDFLARE_EMAIL}</span> account_api_token=<span class="token variable">\${CLOUDFLARE_API_KEY}</span>&quot;</span>
ansible -m cloudflare_dns -c <span class="token builtin class-name">local</span> -i <span class="token string">&quot;localhost,&quot;</span> localhost -a <span class="token string">&quot;zone=mylabs.dev record=<span class="token variable">\${BASE_DOMAIN}</span> type=NS value=<span class="token variable">\${NEW_ZONE_NS2}</span> solo=false proxied=no account_email=<span class="token variable">\${CLOUDFLARE_EMAIL}</span> account_api_token=<span class="token variable">\${CLOUDFLARE_API_KEY}</span>&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>Output:</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>localhost | CHANGED =&gt; {
    &quot;ansible_facts&quot;: {
        &quot;discovered_interpreter_python&quot;: &quot;/usr/bin/python&quot;
    },
    &quot;changed&quot;: true,
    &quot;result&quot;: {
        &quot;record&quot;: {
            &quot;content&quot;: &quot;ns-885.awsdns-46.net&quot;,
            &quot;created_on&quot;: &quot;2020-11-13T06:25:32.18642Z&quot;,
            &quot;id&quot;: &quot;dxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxb&quot;,
            &quot;locked&quot;: false,
            &quot;meta&quot;: {
                &quot;auto_added&quot;: false,
                &quot;managed_by_apps&quot;: false,
                &quot;managed_by_argo_tunnel&quot;: false,
                &quot;source&quot;: &quot;primary&quot;
            },
            &quot;modified_on&quot;: &quot;2020-11-13T06:25:32.18642Z&quot;,
            &quot;name&quot;: &quot;k8s.mylabs.dev&quot;,
            &quot;proxiable&quot;: false,
            &quot;proxied&quot;: false,
            &quot;ttl&quot;: 1,
            &quot;type&quot;: &quot;NS&quot;,
            &quot;zone_id&quot;: &quot;2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxe&quot;,
            &quot;zone_name&quot;: &quot;mylabs.dev&quot;
        }
    }
}
localhost | CHANGED =&gt; {
    &quot;ansible_facts&quot;: {
        &quot;discovered_interpreter_python&quot;: &quot;/usr/bin/python&quot;
    },
    &quot;changed&quot;: true,
    &quot;result&quot;: {
        &quot;record&quot;: {
            &quot;content&quot;: &quot;ns-1692.awsdns-19.co.uk&quot;,
            &quot;created_on&quot;: &quot;2020-11-13T06:25:37.605605Z&quot;,
            &quot;id&quot;: &quot;9xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxb&quot;,
            &quot;locked&quot;: false,
            &quot;meta&quot;: {
                &quot;auto_added&quot;: false,
                &quot;managed_by_apps&quot;: false,
                &quot;managed_by_argo_tunnel&quot;: false,
                &quot;source&quot;: &quot;primary&quot;
            },
            &quot;modified_on&quot;: &quot;2020-11-13T06:25:37.605605Z&quot;,
            &quot;name&quot;: &quot;k8s.mylabs.dev&quot;,
            &quot;proxiable&quot;: false,
            &quot;proxied&quot;: false,
            &quot;ttl&quot;: 1,
            &quot;type&quot;: &quot;NS&quot;,
            &quot;zone_id&quot;: &quot;2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxe&quot;,
            &quot;zone_name&quot;: &quot;mylabs.dev&quot;
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br></div></div><h2 id="create-networking-for-amazon-eks" tabindex="-1"><a class="header-anchor" href="#create-networking-for-amazon-eks" aria-hidden="true">#</a> Create networking for Amazon EKS</h2><p>Details with examples are described on these links:</p>`,13),us={href:"https://aws.amazon.com/blogs/opensource/introducing-fine-grained-iam-roles-service-accounts/",target:"_blank",rel:"noopener noreferrer"},bs=s("https://aws.amazon.com/blogs/opensource/introducing-fine-grained-iam-roles-service-accounts/"),ms={href:"https://cert-manager.io/docs/configuration/acme/dns01/route53/",target:"_blank",rel:"noopener noreferrer"},ks=s("https://cert-manager.io/docs/configuration/acme/dns01/route53/"),ds={href:"https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/aws.md",target:"_blank",rel:"noopener noreferrer"},_s=s("https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/aws.md"),qs=p('<p>Create temporary directory for files used for creating/configuring EKS Cluster and it&#39;s components:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -p <span class="token string">&quot;tmp/<span class="token variable">${CLUSTER_FQDN}</span>&quot;</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div>',2),vs=s("Create CloudFormation template with Networking and KMS key for Amazon EKS. The template was taken from "),gs={href:"https://docs.aws.amazon.com/eks/latest/userguide/create-public-private-vpc.html",target:"_blank",rel:"noopener noreferrer"},xs=s("Creating a VPC for your Amazon EKS cluster"),hs=s(":"),Ss=p(`<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/cf-amazon-eks-vpc-private-subnets-kms.yml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
AWSTemplateFormatVersion: <span class="token string">&#39;2010-09-09&#39;</span>
Description: <span class="token string">&#39;Amazon EKS VPC with Private and Public subnets and KMS key&#39;</span>

Parameters:

  VpcBlock:
    Type: String
    Default: <span class="token number">192.168</span>.0.0/16
    Description: The CIDR range <span class="token keyword">for</span> the VPC. This should be a valid private <span class="token punctuation">(</span>RFC <span class="token number">1918</span><span class="token punctuation">)</span> CIDR range.

  PublicSubnet01Block:
    Type: String
    Default: <span class="token number">192.168</span>.0.0/18
    Description: CidrBlock <span class="token keyword">for</span> public subnet 01 within the VPC

  PublicSubnet02Block:
    Type: String
    Default: <span class="token number">192.168</span>.64.0/18
    Description: CidrBlock <span class="token keyword">for</span> public subnet 02 within the VPC

  PrivateSubnet01Block:
    Type: String
    Default: <span class="token number">192.168</span>.128.0/18
    Description: CidrBlock <span class="token keyword">for</span> private subnet 01 within the VPC

  PrivateSubnet02Block:
    Type: String
    Default: <span class="token number">192.168</span>.192.0/18
    Description: CidrBlock <span class="token keyword">for</span> private subnet 02 within the VPC

  ClusterFQDN:
    Description: <span class="token string">&quot;Cluster domain where all necessary app subdomains will live (subdomain of BaseDomain). Ex: kube1.k8s.mylabs.dev&quot;</span>
    Type: String

  ClusterName:
    Description: <span class="token string">&quot;K8s Cluster name. Ex: kube1&quot;</span>
    Type: String

Metadata:
  AWS::CloudFormation::Interface:
    ParameterGroups:
      -
        Label:
          default: <span class="token string">&quot;Worker Network Configuration&quot;</span>
        Parameters:
          - VpcBlock
          - PublicSubnet01Block
          - PublicSubnet02Block
          - PrivateSubnet01Block
          - PrivateSubnet02Block

  cfn-lint:
    config:
      ignore_checks:
        - W3005
      configure_rules:
        E3012:
          strict: False

Resources:

  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: <span class="token operator">!</span>Ref VpcBlock
      EnableDnsSupport: <span class="token boolean">true</span>
      EnableDnsHostnames: <span class="token boolean">true</span>
      Tags:
      - Key: Name
        Value: <span class="token operator">!</span>Sub <span class="token string">&#39;\${ClusterFQDN}-VPC&#39;</span>

  InternetGateway:
    Type: <span class="token string">&quot;AWS::EC2::InternetGateway&quot;</span>

  VPCGatewayAttachment:
    Type: <span class="token string">&quot;AWS::EC2::VPCGatewayAttachment&quot;</span>
    Properties:
      InternetGatewayId: <span class="token operator">!</span>Ref InternetGateway
      VpcId: <span class="token operator">!</span>Ref VPC

  PublicRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: <span class="token operator">!</span>Ref VPC
      Tags:
      - Key: Name
        Value: Public Subnets
      - Key: Network
        Value: Public

  PrivateRouteTable01:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: <span class="token operator">!</span>Ref VPC
      Tags:
      - Key: Name
        Value: Private Subnet AZ1
      - Key: Network
        Value: Private01

  PrivateRouteTable02:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: <span class="token operator">!</span>Ref VPC
      Tags:
      - Key: Name
        Value: Private Subnet AZ2
      - Key: Network
        Value: Private02

  PublicRoute:
    DependsOn: VPCGatewayAttachment
    Type: AWS::EC2::Route
    Properties:
      RouteTableId: <span class="token operator">!</span>Ref PublicRouteTable
      DestinationCidrBlock: <span class="token number">0.0</span>.0.0/0
      GatewayId: <span class="token operator">!</span>Ref InternetGateway

  PrivateRoute01:
    DependsOn:
    - VPCGatewayAttachment
    - NatGateway01
    Type: AWS::EC2::Route
    Properties:
      RouteTableId: <span class="token operator">!</span>Ref PrivateRouteTable01
      DestinationCidrBlock: <span class="token number">0.0</span>.0.0/0
      NatGatewayId: <span class="token operator">!</span>Ref NatGateway01

  PrivateRoute02:
    DependsOn:
    - VPCGatewayAttachment
    - NatGateway02
    Type: AWS::EC2::Route
    Properties:
      RouteTableId: <span class="token operator">!</span>Ref PrivateRouteTable02
      DestinationCidrBlock: <span class="token number">0.0</span>.0.0/0
      NatGatewayId: <span class="token operator">!</span>Ref NatGateway02

  NatGateway01:
    DependsOn:
    - NatGatewayEIP1
    - PublicSubnet01
    - VPCGatewayAttachment
    Type: AWS::EC2::NatGateway
    Properties:
      AllocationId: <span class="token operator">!</span>GetAtt <span class="token string">&#39;NatGatewayEIP1.AllocationId&#39;</span>
      SubnetId: <span class="token operator">!</span>Ref PublicSubnet01
      Tags:
      - Key: Name
        Value: <span class="token operator">!</span>Sub <span class="token string">&#39;\${ClusterFQDN}-NatGatewayAZ1&#39;</span>

  NatGateway02:
    DependsOn:
    - NatGatewayEIP2
    - PublicSubnet02
    - VPCGatewayAttachment
    Type: AWS::EC2::NatGateway
    Properties:
      AllocationId: <span class="token operator">!</span>GetAtt <span class="token string">&#39;NatGatewayEIP2.AllocationId&#39;</span>
      SubnetId: <span class="token operator">!</span>Ref PublicSubnet02
      Tags:
      - Key: Name
        Value: <span class="token operator">!</span>Sub <span class="token string">&#39;\${ClusterFQDN}-NatGatewayAZ2&#39;</span>

  NatGatewayEIP1:
    DependsOn:
    - VPCGatewayAttachment
    Type: <span class="token string">&#39;AWS::EC2::EIP&#39;</span>
    Properties:
      Domain: vpc

  NatGatewayEIP2:
    DependsOn:
    - VPCGatewayAttachment
    Type: <span class="token string">&#39;AWS::EC2::EIP&#39;</span>
    Properties:
      Domain: vpc

  PublicSubnet01:
    Type: AWS::EC2::Subnet
    Metadata:
      Comment: Subnet 01
    Properties:
      MapPublicIpOnLaunch: <span class="token boolean">true</span>
      AvailabilityZone:
        Fn::Select:
        - <span class="token string">&#39;0&#39;</span>
        - Fn::GetAZs:
            Ref: AWS::Region
      CidrBlock:
        Ref: PublicSubnet01Block
      VpcId:
        Ref: VPC
      Tags:
      - Key: Name
        Value: <span class="token operator">!</span>Sub <span class="token string">&quot;<span class="token variable">\${ClusterFQDN}</span>-PublicSubnet01&quot;</span>
      - Key: kubernetes.io/role/elb
        Value: <span class="token number">1</span>

  PublicSubnet02:
    Type: AWS::EC2::Subnet
    Metadata:
      Comment: Subnet 02
    Properties:
      MapPublicIpOnLaunch: <span class="token boolean">true</span>
      AvailabilityZone:
        Fn::Select:
        - <span class="token string">&#39;1&#39;</span>
        - Fn::GetAZs:
            Ref: AWS::Region
      CidrBlock:
        Ref: PublicSubnet02Block
      VpcId:
        Ref: VPC
      Tags:
      - Key: Name
        Value: <span class="token operator">!</span>Sub <span class="token string">&quot;<span class="token variable">\${ClusterFQDN}</span>-PublicSubnet02&quot;</span>
      - Key: kubernetes.io/role/elb
        Value: <span class="token number">1</span>

  PrivateSubnet01:
    Type: AWS::EC2::Subnet
    Metadata:
      Comment: Subnet 03
    Properties:
      AvailabilityZone:
        Fn::Select:
        - <span class="token string">&#39;0&#39;</span>
        - Fn::GetAZs:
            Ref: AWS::Region
      CidrBlock:
        Ref: PrivateSubnet01Block
      VpcId:
        Ref: VPC
      Tags:
      - Key: Name
        Value: <span class="token operator">!</span>Sub <span class="token string">&quot;<span class="token variable">\${ClusterFQDN}</span>-PrivateSubnet01&quot;</span>
      - Key: kubernetes.io/role/internal-elb
        Value: <span class="token number">1</span>
      <span class="token comment"># Needed for Karpenter</span>
      - Key: <span class="token operator">!</span>Sub <span class="token string">&quot;kubernetes.io/cluster/<span class="token variable">\${ClusterName}</span>&quot;</span>
        Value: <span class="token string">&quot;&quot;</span>

  PrivateSubnet02:
    Type: AWS::EC2::Subnet
    Metadata:
      Comment: Private Subnet 02
    Properties:
      AvailabilityZone:
        Fn::Select:
        - <span class="token string">&#39;1&#39;</span>
        - Fn::GetAZs:
            Ref: AWS::Region
      CidrBlock:
        Ref: PrivateSubnet02Block
      VpcId:
        Ref: VPC
      Tags:
      - Key: Name
        Value: <span class="token operator">!</span>Sub <span class="token string">&quot;<span class="token variable">\${ClusterFQDN}</span>-PrivateSubnet02&quot;</span>
      - Key: kubernetes.io/role/internal-elb
        Value: <span class="token number">1</span>
      <span class="token comment"># Needed for Karpenter</span>
      - Key: <span class="token operator">!</span>Sub <span class="token string">&quot;kubernetes.io/cluster/<span class="token variable">\${ClusterName}</span>&quot;</span>
        Value: <span class="token string">&quot;&quot;</span>

  PublicSubnet01RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: <span class="token operator">!</span>Ref PublicSubnet01
      RouteTableId: <span class="token operator">!</span>Ref PublicRouteTable

  PublicSubnet02RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: <span class="token operator">!</span>Ref PublicSubnet02
      RouteTableId: <span class="token operator">!</span>Ref PublicRouteTable

  PrivateSubnet01RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: <span class="token operator">!</span>Ref PrivateSubnet01
      RouteTableId: <span class="token operator">!</span>Ref PrivateRouteTable01

  PrivateSubnet02RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: <span class="token operator">!</span>Ref PrivateSubnet02
      RouteTableId: <span class="token operator">!</span>Ref PrivateRouteTable02

  KMSAlias:
    Type: AWS::KMS::Alias
    Properties:
      AliasName: <span class="token operator">!</span>Sub <span class="token string">&quot;alias/eks-<span class="token variable">\${ClusterName}</span>&quot;</span>
      TargetKeyId: <span class="token operator">!</span>Ref KMSKey

  KMSKey:
    Type: AWS::KMS::Key
    Properties:
      Description: <span class="token operator">!</span>Sub <span class="token string">&quot;KMS key for secrets related to <span class="token variable">\${ClusterFQDN}</span>&quot;</span>
      EnableKeyRotation: <span class="token boolean">true</span>
      PendingWindowInDays: <span class="token number">7</span>
      KeyPolicy:
        Version: <span class="token string">&quot;2012-10-17&quot;</span>
        Id: <span class="token operator">!</span>Sub <span class="token string">&quot;eks-key-policy-<span class="token variable">\${ClusterName}</span>&quot;</span>
        Statement:
        - Sid: Enable IAM User Permissions
          Effect: Allow
          Principal:
            AWS: <span class="token operator">!</span>Sub <span class="token string">&quot;arn:aws:iam::<span class="token variable">\${AWS<span class="token operator">:</span><span class="token operator">:</span>AccountId}</span>:root&quot;</span>
          Action: kms:*
          Resource: <span class="token string">&quot;*&quot;</span>
        <span class="token comment"># https://docs.aws.amazon.com/autoscaling/ec2/userguide/key-policy-requirements-EBS-encryption.html</span>
        - Sid: Allow use of the key
          Effect: Allow
          Principal:
            AWS: <span class="token operator">!</span>Sub <span class="token string">&quot;arn:aws:iam::<span class="token variable">\${AWS<span class="token operator">:</span><span class="token operator">:</span>AccountId}</span>:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling&quot;</span>
          Action:
          - kms:Encrypt
          - kms:Decrypt
          - kms:ReEncrypt*
          - kms:GenerateDataKey*
          - kms:DescribeKey
          Resource: <span class="token string">&quot;*&quot;</span>
        - Sid: Allow attachment of persistent resources
          Effect: Allow
          Principal:
            AWS: <span class="token operator">!</span>Sub <span class="token string">&quot;arn:aws:iam::<span class="token variable">\${AWS<span class="token operator">:</span><span class="token operator">:</span>AccountId}</span>:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling&quot;</span>
          Action:
          - kms:CreateGrant
          Resource: <span class="token string">&quot;*&quot;</span>
          Condition:
            Bool:
              kms:GrantIsForAWSResource: <span class="token boolean">true</span>

Outputs:

  SubnetIds:
    Description: Subnets IDs <span class="token keyword">in</span> the VPC
    Value: <span class="token operator">!</span>Join <span class="token punctuation">[</span> <span class="token string">&quot;,&quot;</span>, <span class="token punctuation">[</span> <span class="token operator">!</span>Ref PublicSubnet01, <span class="token operator">!</span>Ref PublicSubnet02, <span class="token operator">!</span>Ref PrivateSubnet01, <span class="token operator">!</span>Ref PrivateSubnet02 <span class="token punctuation">]</span> <span class="token punctuation">]</span>

  SubnetsIdsPrivate:
    Description: Private Subnets IDs <span class="token keyword">in</span> the VPC
    Value: <span class="token operator">!</span>Join <span class="token punctuation">[</span> <span class="token string">&quot;,&quot;</span>, <span class="token punctuation">[</span> <span class="token operator">!</span>Ref PrivateSubnet01, <span class="token operator">!</span>Ref PrivateSubnet02 <span class="token punctuation">]</span> <span class="token punctuation">]</span>
    Export:
      Name:
        <span class="token string">&#39;Fn::Sub&#39;</span><span class="token builtin class-name">:</span> <span class="token string">&#39;\${AWS::StackName}-SubnetsIdsPrivate&#39;</span>

  PrivateSubnetId1:
    Description: A reference to the private subnet <span class="token keyword">in</span> the 1st Availability Zone
    Value: <span class="token operator">!</span>Ref PrivateSubnet01

  PrivateSubnetId2:
    Description: A reference to the private subnet <span class="token keyword">in</span> the 2nd Availability Zone
    Value: <span class="token operator">!</span>Ref PrivateSubnet02

  PublicSubnetId1:
    Description: A reference to the public subnet <span class="token keyword">in</span> the 1st Availability Zone
    Value: <span class="token operator">!</span>Ref PublicSubnet01

  PublicSubnetId2:
    Description: A reference to the public subnet <span class="token keyword">in</span> the 1st Availability Zone
    Value: <span class="token operator">!</span>Ref PublicSubnet02

  VpcId:
    Description: The VPC Id
    Value: <span class="token operator">!</span>Ref VPC
    Export:
      Name:
        <span class="token string">&#39;Fn::Sub&#39;</span><span class="token builtin class-name">:</span> <span class="token string">&#39;\${AWS::StackName}-VpcId&#39;</span>

  VpcCidrBlock:
    Description: The VPC CIDR
    Value: <span class="token operator">!</span>GetAtt VPC.CidrBlock
    Export:
      Name:
        <span class="token string">&#39;Fn::Sub&#39;</span><span class="token builtin class-name">:</span> <span class="token string">&#39;\${AWS::StackName}-VpcCidrBlock&#39;</span>

  KMSKeyArn:
    Description: The ARN of the created KMS Key
    Value: <span class="token operator">!</span>GetAtt KMSKey.Arn

  KMSKeyId:
    Description: The ID of the created KMS Key to encrypt EKS related services
    Value: <span class="token operator">!</span>Ref KMSKey
    Export:
      Name:
        <span class="token string">&#39;Fn::Sub&#39;</span><span class="token builtin class-name">:</span> <span class="token string">&#39;\${AWS::StackName}-KMSKeyId&#39;</span>
EOF

<span class="token builtin class-name">eval</span> aws cloudformation deploy <span class="token punctuation">\\</span>
  --parameter-overrides <span class="token string">&quot;ClusterFQDN=<span class="token variable">\${CLUSTER_FQDN}</span> ClusterName=<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token punctuation">\\</span>
  --stack-name <span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>-amazon-eks-vpc-private-subnets-kms&quot;</span> <span class="token punctuation">\\</span>
  --template-file <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/cf-amazon-eks-vpc-private-subnets-kms.yml&quot;</span> <span class="token punctuation">\\</span>
  --tags <span class="token string">&quot;<span class="token variable">\${TAGS}</span>&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br><span class="line-number">126</span><br><span class="line-number">127</span><br><span class="line-number">128</span><br><span class="line-number">129</span><br><span class="line-number">130</span><br><span class="line-number">131</span><br><span class="line-number">132</span><br><span class="line-number">133</span><br><span class="line-number">134</span><br><span class="line-number">135</span><br><span class="line-number">136</span><br><span class="line-number">137</span><br><span class="line-number">138</span><br><span class="line-number">139</span><br><span class="line-number">140</span><br><span class="line-number">141</span><br><span class="line-number">142</span><br><span class="line-number">143</span><br><span class="line-number">144</span><br><span class="line-number">145</span><br><span class="line-number">146</span><br><span class="line-number">147</span><br><span class="line-number">148</span><br><span class="line-number">149</span><br><span class="line-number">150</span><br><span class="line-number">151</span><br><span class="line-number">152</span><br><span class="line-number">153</span><br><span class="line-number">154</span><br><span class="line-number">155</span><br><span class="line-number">156</span><br><span class="line-number">157</span><br><span class="line-number">158</span><br><span class="line-number">159</span><br><span class="line-number">160</span><br><span class="line-number">161</span><br><span class="line-number">162</span><br><span class="line-number">163</span><br><span class="line-number">164</span><br><span class="line-number">165</span><br><span class="line-number">166</span><br><span class="line-number">167</span><br><span class="line-number">168</span><br><span class="line-number">169</span><br><span class="line-number">170</span><br><span class="line-number">171</span><br><span class="line-number">172</span><br><span class="line-number">173</span><br><span class="line-number">174</span><br><span class="line-number">175</span><br><span class="line-number">176</span><br><span class="line-number">177</span><br><span class="line-number">178</span><br><span class="line-number">179</span><br><span class="line-number">180</span><br><span class="line-number">181</span><br><span class="line-number">182</span><br><span class="line-number">183</span><br><span class="line-number">184</span><br><span class="line-number">185</span><br><span class="line-number">186</span><br><span class="line-number">187</span><br><span class="line-number">188</span><br><span class="line-number">189</span><br><span class="line-number">190</span><br><span class="line-number">191</span><br><span class="line-number">192</span><br><span class="line-number">193</span><br><span class="line-number">194</span><br><span class="line-number">195</span><br><span class="line-number">196</span><br><span class="line-number">197</span><br><span class="line-number">198</span><br><span class="line-number">199</span><br><span class="line-number">200</span><br><span class="line-number">201</span><br><span class="line-number">202</span><br><span class="line-number">203</span><br><span class="line-number">204</span><br><span class="line-number">205</span><br><span class="line-number">206</span><br><span class="line-number">207</span><br><span class="line-number">208</span><br><span class="line-number">209</span><br><span class="line-number">210</span><br><span class="line-number">211</span><br><span class="line-number">212</span><br><span class="line-number">213</span><br><span class="line-number">214</span><br><span class="line-number">215</span><br><span class="line-number">216</span><br><span class="line-number">217</span><br><span class="line-number">218</span><br><span class="line-number">219</span><br><span class="line-number">220</span><br><span class="line-number">221</span><br><span class="line-number">222</span><br><span class="line-number">223</span><br><span class="line-number">224</span><br><span class="line-number">225</span><br><span class="line-number">226</span><br><span class="line-number">227</span><br><span class="line-number">228</span><br><span class="line-number">229</span><br><span class="line-number">230</span><br><span class="line-number">231</span><br><span class="line-number">232</span><br><span class="line-number">233</span><br><span class="line-number">234</span><br><span class="line-number">235</span><br><span class="line-number">236</span><br><span class="line-number">237</span><br><span class="line-number">238</span><br><span class="line-number">239</span><br><span class="line-number">240</span><br><span class="line-number">241</span><br><span class="line-number">242</span><br><span class="line-number">243</span><br><span class="line-number">244</span><br><span class="line-number">245</span><br><span class="line-number">246</span><br><span class="line-number">247</span><br><span class="line-number">248</span><br><span class="line-number">249</span><br><span class="line-number">250</span><br><span class="line-number">251</span><br><span class="line-number">252</span><br><span class="line-number">253</span><br><span class="line-number">254</span><br><span class="line-number">255</span><br><span class="line-number">256</span><br><span class="line-number">257</span><br><span class="line-number">258</span><br><span class="line-number">259</span><br><span class="line-number">260</span><br><span class="line-number">261</span><br><span class="line-number">262</span><br><span class="line-number">263</span><br><span class="line-number">264</span><br><span class="line-number">265</span><br><span class="line-number">266</span><br><span class="line-number">267</span><br><span class="line-number">268</span><br><span class="line-number">269</span><br><span class="line-number">270</span><br><span class="line-number">271</span><br><span class="line-number">272</span><br><span class="line-number">273</span><br><span class="line-number">274</span><br><span class="line-number">275</span><br><span class="line-number">276</span><br><span class="line-number">277</span><br><span class="line-number">278</span><br><span class="line-number">279</span><br><span class="line-number">280</span><br><span class="line-number">281</span><br><span class="line-number">282</span><br><span class="line-number">283</span><br><span class="line-number">284</span><br><span class="line-number">285</span><br><span class="line-number">286</span><br><span class="line-number">287</span><br><span class="line-number">288</span><br><span class="line-number">289</span><br><span class="line-number">290</span><br><span class="line-number">291</span><br><span class="line-number">292</span><br><span class="line-number">293</span><br><span class="line-number">294</span><br><span class="line-number">295</span><br><span class="line-number">296</span><br><span class="line-number">297</span><br><span class="line-number">298</span><br><span class="line-number">299</span><br><span class="line-number">300</span><br><span class="line-number">301</span><br><span class="line-number">302</span><br><span class="line-number">303</span><br><span class="line-number">304</span><br><span class="line-number">305</span><br><span class="line-number">306</span><br><span class="line-number">307</span><br><span class="line-number">308</span><br><span class="line-number">309</span><br><span class="line-number">310</span><br><span class="line-number">311</span><br><span class="line-number">312</span><br><span class="line-number">313</span><br><span class="line-number">314</span><br><span class="line-number">315</span><br><span class="line-number">316</span><br><span class="line-number">317</span><br><span class="line-number">318</span><br><span class="line-number">319</span><br><span class="line-number">320</span><br><span class="line-number">321</span><br><span class="line-number">322</span><br><span class="line-number">323</span><br><span class="line-number">324</span><br><span class="line-number">325</span><br><span class="line-number">326</span><br><span class="line-number">327</span><br><span class="line-number">328</span><br><span class="line-number">329</span><br><span class="line-number">330</span><br><span class="line-number">331</span><br><span class="line-number">332</span><br><span class="line-number">333</span><br><span class="line-number">334</span><br><span class="line-number">335</span><br><span class="line-number">336</span><br><span class="line-number">337</span><br><span class="line-number">338</span><br><span class="line-number">339</span><br><span class="line-number">340</span><br><span class="line-number">341</span><br><span class="line-number">342</span><br><span class="line-number">343</span><br><span class="line-number">344</span><br><span class="line-number">345</span><br><span class="line-number">346</span><br><span class="line-number">347</span><br><span class="line-number">348</span><br><span class="line-number">349</span><br><span class="line-number">350</span><br><span class="line-number">351</span><br><span class="line-number">352</span><br><span class="line-number">353</span><br><span class="line-number">354</span><br><span class="line-number">355</span><br><span class="line-number">356</span><br><span class="line-number">357</span><br><span class="line-number">358</span><br><span class="line-number">359</span><br><span class="line-number">360</span><br><span class="line-number">361</span><br><span class="line-number">362</span><br><span class="line-number">363</span><br><span class="line-number">364</span><br><span class="line-number">365</span><br><span class="line-number">366</span><br><span class="line-number">367</span><br><span class="line-number">368</span><br><span class="line-number">369</span><br><span class="line-number">370</span><br><span class="line-number">371</span><br><span class="line-number">372</span><br><span class="line-number">373</span><br><span class="line-number">374</span><br><span class="line-number">375</span><br><span class="line-number">376</span><br><span class="line-number">377</span><br><span class="line-number">378</span><br><span class="line-number">379</span><br><span class="line-number">380</span><br><span class="line-number">381</span><br><span class="line-number">382</span><br><span class="line-number">383</span><br><span class="line-number">384</span><br><span class="line-number">385</span><br><span class="line-number">386</span><br><span class="line-number">387</span><br><span class="line-number">388</span><br><span class="line-number">389</span><br><span class="line-number">390</span><br><span class="line-number">391</span><br><span class="line-number">392</span><br><span class="line-number">393</span><br><span class="line-number">394</span><br><span class="line-number">395</span><br><span class="line-number">396</span><br></div></div><p>Get the variables form CloudFormation:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>aws cloudformation describe-stacks --stack-name <span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>-amazon-eks-vpc-private-subnets-kms&quot;</span> <span class="token operator">&gt;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${CLUSTER_NAME}</span>-amazon-eks-vpc-private-subnets-kms.json&quot;</span>
<span class="token assign-left variable">AWS_VPC_ID</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jq -r <span class="token string">&quot;.Stacks[0].Outputs[] | select(.OutputKey==<span class="token entity" title="\\&quot;">\\&quot;</span>VpcId<span class="token entity" title="\\&quot;">\\&quot;</span>) .OutputValue&quot;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${CLUSTER_NAME}</span>-amazon-eks-vpc-private-subnets-kms.json&quot;</span><span class="token variable">)</span></span>
<span class="token assign-left variable">AWS_PUBLICSUBNETID1</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jq -r <span class="token string">&quot;.Stacks[0].Outputs[] | select(.OutputKey==<span class="token entity" title="\\&quot;">\\&quot;</span>PublicSubnetId1<span class="token entity" title="\\&quot;">\\&quot;</span>) .OutputValue&quot;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${CLUSTER_NAME}</span>-amazon-eks-vpc-private-subnets-kms.json&quot;</span><span class="token variable">)</span></span>
<span class="token assign-left variable">AWS_PUBLICSUBNETID2</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jq -r <span class="token string">&quot;.Stacks[0].Outputs[] | select(.OutputKey==<span class="token entity" title="\\&quot;">\\&quot;</span>PublicSubnetId2<span class="token entity" title="\\&quot;">\\&quot;</span>) .OutputValue&quot;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${CLUSTER_NAME}</span>-amazon-eks-vpc-private-subnets-kms.json&quot;</span><span class="token variable">)</span></span>
<span class="token assign-left variable">AWS_PRIVATESUBNETID1</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jq -r <span class="token string">&quot;.Stacks[0].Outputs[] | select(.OutputKey==<span class="token entity" title="\\&quot;">\\&quot;</span>PrivateSubnetId1<span class="token entity" title="\\&quot;">\\&quot;</span>) .OutputValue&quot;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${CLUSTER_NAME}</span>-amazon-eks-vpc-private-subnets-kms.json&quot;</span><span class="token variable">)</span></span>
<span class="token assign-left variable">AWS_PRIVATESUBNETID2</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jq -r <span class="token string">&quot;.Stacks[0].Outputs[] | select(.OutputKey==<span class="token entity" title="\\&quot;">\\&quot;</span>PrivateSubnetId2<span class="token entity" title="\\&quot;">\\&quot;</span>) .OutputValue&quot;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${CLUSTER_NAME}</span>-amazon-eks-vpc-private-subnets-kms.json&quot;</span><span class="token variable">)</span></span>
<span class="token assign-left variable">AWS_KMS_KEY_ARN</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jq -r <span class="token string">&quot;.Stacks[0].Outputs[] | select(.OutputKey==<span class="token entity" title="\\&quot;">\\&quot;</span>KMSKeyArn<span class="token entity" title="\\&quot;">\\&quot;</span>) .OutputValue&quot;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${CLUSTER_NAME}</span>-amazon-eks-vpc-private-subnets-kms.json&quot;</span><span class="token variable">)</span></span>
<span class="token assign-left variable">AWS_KMS_KEY_ID</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jq -r <span class="token string">&quot;.Stacks[0].Outputs[] | select(.OutputKey==<span class="token entity" title="\\&quot;">\\&quot;</span>KMSKeyId<span class="token entity" title="\\&quot;">\\&quot;</span>) .OutputValue&quot;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${CLUSTER_NAME}</span>-amazon-eks-vpc-private-subnets-kms.json&quot;</span><span class="token variable">)</span></span>
<span class="token assign-left variable">AWS_ACCOUNT_ID</span><span class="token operator">=</span><span class="token variable">\${AWS_ACCOUNT_ID<span class="token operator">:-</span>$(aws sts get-caller-identity --query Account --output text)}</span>
<span class="token builtin class-name">export</span> AWS_ACCOUNT_ID
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div>`,3);function fs(Es,As){const t=r("RouterLink"),e=r("ExternalLinkIcon");return c(),i(u,null,[m,n("nav",k,[n("ul",null,[n("li",null,[a(t,{to:"#requirements"},{default:l(()=>[d]),_:1})]),n("li",null,[a(t,{to:"#prepare-the-local-working-environment"},{default:l(()=>[_]),_:1})]),n("li",null,[a(t,{to:"#configure-aws-route-53-domain-delegation"},{default:l(()=>[q]),_:1})]),n("li",null,[a(t,{to:"#create-networking-for-amazon-eks"},{default:l(()=>[v]),_:1})])])]),g,n("p",null,[x,n("a",h,[S,a(e)]),f]),E,n("p",null,[A,n("a",y,[T,a(e)]),C]),N,n("p",null,[I,n("a",R,[w,a(e)]),P]),O,n("p",null,[D,n("a",$,[K,a(e)]),U]),G,n("p",null,[M,n("a",L,[V,a(e)]),B]),W,n("p",null,[z,n("a",F,[H,a(e)]),Y]),Z,n("p",null,[Q,n("a",j,[X,a(e)]),J]),ss,n("p",null,[ns,n("a",as,[es,a(e)]),ps]),ts,n("p",null,[ls,n("a",rs,[os,a(e)]),cs]),is,n("ul",null,[n("li",null,[n("a",us,[bs,a(e)])]),n("li",null,[n("a",ms,[ks,a(e)])]),n("li",null,[n("a",ds,[_s,a(e)])])]),qs,n("p",null,[vs,n("a",gs,[xs,a(e)]),hs]),Ss],64)}var Ts=o(b,[["render",fs],["__file","index.html.vue"]]);export{Ts as default};
