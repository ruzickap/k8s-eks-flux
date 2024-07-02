import{_ as i,c as p,a as s,b as a,w as e,d as t,r as c,o,e as l}from"./app-DVraMtkj.js";const r={},u=s("h1",{id:"create-initial-aws-structure",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#create-initial-aws-structure"},[s("span",null,"Create initial AWS structure")])],-1),d={class:"table-of-contents"},v=t(`<h2 id="requirements" tabindex="-1"><a class="header-anchor" href="#requirements"><span>Requirements</span></a></h2><p>If you would like to follow this documents and it&#39;s task you will need to set up few environment variables.</p><p><code>BASE_DOMAIN</code> (<code>k8s.mylabs.dev</code>) contains DNS records for all your Kubernetes clusters. The cluster names will look like <code>CLUSTER_NAME</code>.<code>BASE_DOMAIN</code> (<code>kube1.k8s.mylabs.dev</code>).</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># Hostname / FQDN definitions</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">BASE_DOMAIN</span><span class="token operator">=</span><span class="token variable">\${BASE_DOMAIN<span class="token operator">:-</span>k8s.mylabs.dev}</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">CLUSTER_NAME</span><span class="token operator">=</span><span class="token variable">\${CLUSTER_NAME<span class="token operator">:-</span>kube1}</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">CLUSTER_FQDN</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>.<span class="token variable">\${BASE_DOMAIN}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">KUBECONFIG</span><span class="token operator">=</span><span class="token variable">\${<span class="token environment constant">PWD</span>}</span>/tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/kubeconfig-<span class="token variable">\${CLUSTER_NAME}</span>.conf</span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">MY_EMAIL</span><span class="token operator">=</span><span class="token string">&quot;petr.ruzicka@gmail.com&quot;</span></span>
<span class="line"><span class="token comment"># GitHub Organization + Team where are the users who will have the admin access</span></span>
<span class="line"><span class="token comment"># to K8s resources (Grafana). Only users in GitHub organization</span></span>
<span class="line"><span class="token comment"># (MY_GITHUB_ORG_NAME) will be able to access the apps via ingress.</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">MY_GITHUB_ORG_NAME</span><span class="token operator">=</span><span class="token string">&quot;ruzickap-org&quot;</span></span>
<span class="line"><span class="token comment"># Set dev, prd, stg or eny other environment</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">ENVIRONMENT</span><span class="token operator">=</span><span class="token string">&quot;dev&quot;</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">LETSENCRYPT_ENVIRONMENT</span><span class="token operator">=</span><span class="token string">&quot;staging&quot;</span></span>
<span class="line"><span class="token comment"># * &quot;production&quot; - valid certificates signed by Lets Encrypt &quot;&quot;</span></span>
<span class="line"><span class="token comment"># * &quot;staging&quot; - not trusted certs signed by Lets Encrypt &quot;Fake LE Intermediate X1&quot;</span></span>
<span class="line"><span class="token comment"># Flux GitHub repository</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">GITHUB_USER</span><span class="token operator">=</span><span class="token string">&quot;ruzickap&quot;</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">GITHUB_FLUX_REPOSITORY</span><span class="token operator">=</span><span class="token string">&quot;k8s-eks-flux-repo&quot;</span></span>
<span class="line"><span class="token assign-left variable">MY_GITHUB_WEBHOOK_TOKEN</span><span class="token operator">=</span><span class="token variable">\${MY_GITHUB_WEBHOOK_TOKEN<span class="token operator">:-</span>$(head -c 12 <span class="token operator">/</span>dev<span class="token operator">/</span>urandom | md5sum | cut -d &quot; &quot; -f1)}</span> <span class="token comment"># DevSkim: ignore DS126858</span></span>
<span class="line"><span class="token builtin class-name">export</span> MY_GITHUB_WEBHOOK_TOKEN</span>
<span class="line"><span class="token assign-left variable">MY_COOKIE_SECRET</span><span class="token operator">=</span><span class="token variable">\${MY_COOKIE_SECRET<span class="token operator">:-</span>$(head -c 32 <span class="token operator">/</span>dev<span class="token operator">/</span>urandom | base64)}</span></span>
<span class="line"><span class="token builtin class-name">export</span> MY_COOKIE_SECRET</span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">SLACK_CHANNEL</span><span class="token operator">=</span><span class="token string">&quot;mylabs&quot;</span></span>
<span class="line"><span class="token comment"># AWS Region</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">AWS_DEFAULT_REGION</span><span class="token operator">=</span><span class="token string">&quot;eu-central-1&quot;</span></span>
<span class="line"><span class="token comment"># Disable pager for AWS CLI</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">AWS_PAGER</span><span class="token operator">=</span><span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token comment"># Tags used to tag the AWS resources</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">TAGS</span><span class="token operator">=</span><span class="token string">&quot;Owner=<span class="token variable">\${MY_EMAIL}</span> Environment=<span class="token variable">\${ENVIRONMENT}</span> Group=Cloud_Native Squad=Cloud_Container_Platform&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;<span class="token variable">\${MY_EMAIL}</span> | <span class="token variable">\${CLUSTER_NAME}</span> | <span class="token variable">\${BASE_DOMAIN}</span> | <span class="token variable">\${CLUSTER_FQDN}</span><span class="token entity" title="\\n">\\n</span><span class="token variable">\${TAGS}</span>&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>You will need to configure <a href="https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html" target="_blank" rel="noopener noreferrer">AWS CLI</a> and other secrets/variables.</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token comment"># AWS Credentials</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">AWS_ACCESS_KEY_ID</span><span class="token operator">=</span><span class="token string">&quot;xxxxxxxxxxxxxxxxxx&quot;</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">AWS_SECRET_ACCESS_KEY</span><span class="token operator">=</span><span class="token string">&quot;xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&quot;</span></span>
<span class="line"><span class="token comment">#export AWS_SESSION_TOKEN=&quot;.....&quot;</span></span>
<span class="line"><span class="token comment"># Common password</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">MY_PASSWORD</span><span class="token operator">=</span><span class="token string">&quot;xxxx&quot;</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">GITHUB_TOKEN</span><span class="token operator">=</span><span class="token string">&quot;xxxxx&quot;</span></span>
<span class="line"><span class="token comment"># Slack incoming webhook</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">SLACK_INCOMING_WEBHOOK_URL</span><span class="token operator">=</span><span class="token string">&quot;https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK&quot;</span></span>
<span class="line"><span class="token comment"># GitHub Organization OAuth Apps credentials</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID</span><span class="token operator">=</span><span class="token string">&quot;3xxxxxxxxxxxxxxxxxx3&quot;</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET</span><span class="token operator">=</span><span class="token string">&quot;7xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx8&quot;</span></span>
<span class="line"><span class="token comment"># Okta configuration</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">OKTA_ISSUER</span><span class="token operator">=</span><span class="token string">&quot;https://exxxxxxx-xxxxx-xx.okta.com&quot;</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">OKTA_CLIENT_ID</span><span class="token operator">=</span><span class="token string">&quot;0xxxxxxxxxxxxxxxxxx7&quot;</span></span>
<span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">OKTA_CLIENT_SECRET</span><span class="token operator">=</span><span class="token string">&quot;1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxH&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Verify if all the necessary variables were set:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token keyword">case</span> <span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token keyword">in</span></span>
<span class="line">  kube1<span class="token punctuation">)</span></span>
<span class="line">    <span class="token assign-left variable">MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID</span><span class="token operator">=</span><span class="token variable">\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID<span class="token operator">:-</span>\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID_KUBE1}</span><span class="token punctuation">}</span></span>
<span class="line">    <span class="token assign-left variable">MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET</span><span class="token operator">=</span><span class="token variable">\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET<span class="token operator">:-</span>\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET_KUBE1}</span><span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">;</span><span class="token punctuation">;</span></span>
<span class="line">  kube2<span class="token punctuation">)</span></span>
<span class="line">    <span class="token assign-left variable">MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID</span><span class="token operator">=</span><span class="token variable">\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID<span class="token operator">:-</span>\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID_KUBE2}</span><span class="token punctuation">}</span></span>
<span class="line">    <span class="token assign-left variable">MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET</span><span class="token operator">=</span><span class="token variable">\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET<span class="token operator">:-</span>\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET_KUBE2}</span><span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">;</span><span class="token punctuation">;</span></span>
<span class="line">  *<span class="token punctuation">)</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;Unsupported cluster name: <span class="token variable">\${CLUSTER_NAME}</span> !&quot;</span></span>
<span class="line">    <span class="token builtin class-name">exit</span> <span class="token number">1</span></span>
<span class="line">    <span class="token punctuation">;</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">esac</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${AWS_ACCESS_KEY_ID?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${AWS_DEFAULT_REGION?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${AWS_SECRET_ACCESS_KEY?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${BASE_DOMAIN?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${CLUSTER_FQDN?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${ENVIRONMENT?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${GITHUB_FLUX_REPOSITORY?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${GITHUB_TOKEN?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${GITHUB_USER?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${KUBECONFIG?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${LETSENCRYPT_ENVIRONMENT?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${MY_COOKIE_SECRET?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${MY_EMAIL?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${MY_GITHUB_ORG_NAME?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_ID?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${MY_GITHUB_ORG_OAUTH_DEX_CLIENT_SECRET?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${MY_GITHUB_WEBHOOK_TOKEN?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${MY_PASSWORD?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${OKTA_CLIENT_ID?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${OKTA_CLIENT_SECRET?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${OKTA_ISSUER?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${SLACK_CHANNEL?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${SLACK_INCOMING_WEBHOOK_URL?}</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">:</span> <span class="token string">&quot;<span class="token variable">\${TAGS?}</span>&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="prepare-the-local-working-environment" tabindex="-1"><a class="header-anchor" href="#prepare-the-local-working-environment"><span>Prepare the local working environment</span></a></h2><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>You can skip these steps if you have all the required software already installed.</p></div><p>Install necessary software:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token keyword">if</span> <span class="token builtin class-name">command</span> <span class="token parameter variable">-v</span> <span class="token function">apt-get</span> <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  <span class="token function">apt</span> update <span class="token parameter variable">-qq</span></span>
<span class="line">  <span class="token assign-left variable">DEBIAN_FRONTEND</span><span class="token operator">=</span>noninteractive <span class="token function">apt-get</span> <span class="token function">install</span> <span class="token parameter variable">-y</span> <span class="token parameter variable">-qq</span> <span class="token function">curl</span> <span class="token function">git</span> jq <span class="token function">sudo</span> <span class="token function">unzip</span> <span class="token operator">&gt;</span> /dev/null</span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Install <a href="https://aws.amazon.com/cli/" target="_blank" rel="noopener noreferrer">AWS CLI</a> binary:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token keyword">if</span> <span class="token operator">!</span> <span class="token builtin class-name">command</span> <span class="token parameter variable">-v</span> aws <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  <span class="token function">curl</span> <span class="token parameter variable">-sL</span> <span class="token string">&quot;https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip&quot;</span> <span class="token parameter variable">-o</span> <span class="token string">&quot;/tmp/awscliv2.zip&quot;</span></span>
<span class="line">  <span class="token function">unzip</span> <span class="token parameter variable">-q</span> <span class="token parameter variable">-o</span> /tmp/awscliv2.zip <span class="token parameter variable">-d</span> /tmp/</span>
<span class="line">  <span class="token function">sudo</span> /tmp/aws/install</span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Install <a href="https://github.com/kubernetes-sigs/aws-iam-authenticator" target="_blank" rel="noopener noreferrer">AWS IAM Authenticator for Kubernetes</a>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token keyword">if</span> <span class="token operator">!</span> <span class="token builtin class-name">command</span> <span class="token parameter variable">-v</span> aws-iam-authenticator <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  <span class="token comment"># https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html</span></span>
<span class="line">  <span class="token function">sudo</span> <span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token parameter variable">-Lo</span> /usr/local/bin/aws-iam-authenticator <span class="token string">&quot;https://amazon-eks.s3.us-west-2.amazonaws.com/1.21.2/2021-07-05/bin/<span class="token variable"><span class="token variable">$(</span><span class="token function">uname</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">&quot;s/./\\L&amp;/g&quot;</span><span class="token variable">)</span></span>/amd64/aws-iam-authenticator&quot;</span></span>
<span class="line">  <span class="token function">sudo</span> <span class="token function">chmod</span> a+x /usr/local/bin/aws-iam-authenticator</span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Install <a href="https://github.com/kubernetes/kubectl" target="_blank" rel="noopener noreferrer">kubectl</a> binary:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token keyword">if</span> <span class="token operator">!</span> <span class="token builtin class-name">command</span> <span class="token parameter variable">-v</span> kubectl <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  <span class="token comment"># https://github.com/kubernetes/kubectl/releases</span></span>
<span class="line">  <span class="token function">sudo</span> <span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token parameter variable">-Lo</span> /usr/local/bin/kubectl <span class="token string">&quot;https://storage.googleapis.com/kubernetes-release/release/v1.21.7/bin/<span class="token variable"><span class="token variable">$(</span><span class="token function">uname</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">&quot;s/./\\L&amp;/g&quot;</span><span class="token variable">)</span></span>/amd64/kubectl&quot;</span></span>
<span class="line">  <span class="token function">sudo</span> <span class="token function">chmod</span> a+x /usr/local/bin/kubectl</span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Install <a href="https://eksctl.io/" target="_blank" rel="noopener noreferrer">eksctl</a>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token keyword">if</span> <span class="token operator">!</span> <span class="token builtin class-name">command</span> <span class="token parameter variable">-v</span> eksctl <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  <span class="token comment"># https://github.com/weaveworks/eksctl/releases</span></span>
<span class="line">  <span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token parameter variable">-L</span> <span class="token string">&quot;https://github.com/weaveworks/eksctl/releases/download/v0.75.0/eksctl_<span class="token variable"><span class="token variable">$(</span><span class="token function">uname</span><span class="token variable">)</span></span>_amd64.tar.gz&quot;</span> <span class="token operator">|</span> <span class="token function">sudo</span> <span class="token function">tar</span> xz <span class="token parameter variable">-C</span> /usr/local/bin/</span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Install <a href="https://toolkit.fluxcd.io/" target="_blank" rel="noopener noreferrer">flux</a>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token keyword">if</span> <span class="token operator">!</span> <span class="token builtin class-name">command</span> <span class="token parameter variable">-v</span> flux <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  <span class="token comment"># https://github.com/fluxcd/flux2/releases</span></span>
<span class="line">  <span class="token builtin class-name">export</span> <span class="token assign-left variable">FLUX_VERSION</span><span class="token operator">=</span><span class="token number">0.24</span>.1</span>
<span class="line">  <span class="token function">curl</span> <span class="token parameter variable">-s</span> https://fluxcd.io/install.sh <span class="token operator">|</span> <span class="token function">sudo</span> <span class="token parameter variable">-E</span> <span class="token function">bash</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Install <a href="https://helm.sh/" target="_blank" rel="noopener noreferrer">Helm</a>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token keyword">if</span> <span class="token operator">!</span> <span class="token builtin class-name">command</span> <span class="token parameter variable">-v</span> helm <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  <span class="token comment"># https://github.com/helm/helm/releases</span></span>
<span class="line">  <span class="token function">curl</span> <span class="token parameter variable">-s</span> https://raw.githubusercontent.com/helm/helm/master/scripts/get <span class="token operator">|</span> <span class="token function">bash</span> <span class="token parameter variable">-s</span> -- <span class="token parameter variable">--version</span> v3.7.1</span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Install <a href="https://github.com/mozilla/sops" target="_blank" rel="noopener noreferrer">Mozilla SOPS</a>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token keyword">if</span> <span class="token operator">!</span> <span class="token builtin class-name">command</span> <span class="token parameter variable">-v</span> sops <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  <span class="token comment"># https://github.com/mozilla/sops/releases</span></span>
<span class="line">  <span class="token function">curl</span> <span class="token parameter variable">-sL</span> <span class="token string">&quot;https://github.com/mozilla/sops/releases/download/v3.7.1/sops_3.7.1_amd64.deb&quot;</span> <span class="token parameter variable">-o</span> /tmp/sops_amd64.deb</span>
<span class="line">  <span class="token function">apt</span> <span class="token function">install</span> <span class="token parameter variable">-y</span> /tmp/sops_amd64.deb <span class="token operator">&gt;</span> /dev/null</span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Install <a href="https://kustomize.io/" target="_blank" rel="noopener noreferrer">kustomize</a>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token keyword">if</span> <span class="token operator">!</span> <span class="token builtin class-name">command</span> <span class="token parameter variable">-v</span> kustomize <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  <span class="token comment"># https://github.com/kubernetes-sigs/kustomize/releases</span></span>
<span class="line">  <span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh&quot;</span> <span class="token operator">|</span> <span class="token function">sudo</span> <span class="token function">bash</span> <span class="token parameter variable">-s</span> <span class="token number">4.4</span>.1 /usr/local/bin/</span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="configure-aws-route-53-domain-delegation" tabindex="-1"><a class="header-anchor" href="#configure-aws-route-53-domain-delegation"><span>Configure AWS Route 53 Domain delegation</span></a></h2><blockquote><p>This should be done only once.</p></blockquote><p>Create DNS zone (<code>BASE_DOMAIN</code>):</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">aws route53 create-hosted-zone <span class="token parameter variable">--output</span> json <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--name</span> <span class="token string">&quot;<span class="token variable">\${BASE_DOMAIN}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --caller-reference <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span><span class="token function">date</span><span class="token variable">)</span></span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --hosted-zone-config<span class="token operator">=</span><span class="token string">&quot;{<span class="token entity" title="\\&quot;">\\&quot;</span>Comment<span class="token entity" title="\\&quot;">\\&quot;</span>: <span class="token entity" title="\\&quot;">\\&quot;</span>Created by <span class="token variable">\${MY_EMAIL}</span><span class="token entity" title="\\&quot;">\\&quot;</span>, <span class="token entity" title="\\&quot;">\\&quot;</span>PrivateZone<span class="token entity" title="\\&quot;">\\&quot;</span>: false}&quot;</span> <span class="token operator">|</span> jq</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Use your domain registrar to change the nameservers for your zone (for example <code>mylabs.dev</code>) to use the Amazon Route 53 nameservers. Here is the way how you can find out the the Route 53 nameservers:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token assign-left variable">NEW_ZONE_ID</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>aws route53 list-hosted-zones <span class="token parameter variable">--query</span> <span class="token string">&quot;HostedZones[?Name==\\<span class="token variable"><span class="token variable">\`</span>$<span class="token punctuation">{</span>BASE_DOMAIN<span class="token punctuation">}</span>.<span class="token punctuation">\\</span><span class="token variable">\`</span></span>].Id&quot;</span> <span class="token parameter variable">--output</span> text<span class="token variable">)</span></span></span>
<span class="line"><span class="token assign-left variable">NEW_ZONE_NS</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>aws route53 get-hosted-zone <span class="token parameter variable">--output</span> json <span class="token parameter variable">--id</span> <span class="token string">&quot;<span class="token variable">\${NEW_ZONE_ID}</span>&quot;</span> <span class="token parameter variable">--query</span> <span class="token string">&quot;DelegationSet.NameServers&quot;</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token assign-left variable">NEW_ZONE_NS1</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">\${NEW_ZONE_NS}</span>&quot;</span> <span class="token operator">|</span> jq <span class="token parameter variable">-r</span> <span class="token string">&quot;.[0]&quot;</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token assign-left variable">NEW_ZONE_NS2</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">\${NEW_ZONE_NS}</span>&quot;</span> <span class="token operator">|</span> jq <span class="token parameter variable">-r</span> <span class="token string">&quot;.[1]&quot;</span><span class="token variable">)</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Create the NS record in <code>k8s.mylabs.dev</code> (<code>BASE_DOMAIN</code>) for proper zone delegation. This step depends on your domain registrar - I&#39;m using CloudFlare and using Ansible to automate it:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">ansible <span class="token parameter variable">-m</span> cloudflare_dns <span class="token parameter variable">-c</span> <span class="token builtin class-name">local</span> <span class="token parameter variable">-i</span> <span class="token string">&quot;localhost,&quot;</span> localhost <span class="token parameter variable">-a</span> <span class="token string">&quot;zone=mylabs.dev record=<span class="token variable">\${BASE_DOMAIN}</span> type=NS value=<span class="token variable">\${NEW_ZONE_NS1}</span> solo=true proxied=no account_email=<span class="token variable">\${CLOUDFLARE_EMAIL}</span> account_api_token=<span class="token variable">\${CLOUDFLARE_API_KEY}</span>&quot;</span></span>
<span class="line">ansible <span class="token parameter variable">-m</span> cloudflare_dns <span class="token parameter variable">-c</span> <span class="token builtin class-name">local</span> <span class="token parameter variable">-i</span> <span class="token string">&quot;localhost,&quot;</span> localhost <span class="token parameter variable">-a</span> <span class="token string">&quot;zone=mylabs.dev record=<span class="token variable">\${BASE_DOMAIN}</span> type=NS value=<span class="token variable">\${NEW_ZONE_NS2}</span> solo=false proxied=no account_email=<span class="token variable">\${CLOUDFLARE_EMAIL}</span> account_api_token=<span class="token variable">\${CLOUDFLARE_API_KEY}</span>&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>Output:</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre class="language-text"><code><span class="line">localhost | CHANGED =&gt; {</span>
<span class="line">    &quot;ansible_facts&quot;: {</span>
<span class="line">        &quot;discovered_interpreter_python&quot;: &quot;/usr/bin/python&quot;</span>
<span class="line">    },</span>
<span class="line">    &quot;changed&quot;: true,</span>
<span class="line">    &quot;result&quot;: {</span>
<span class="line">        &quot;record&quot;: {</span>
<span class="line">            &quot;content&quot;: &quot;ns-885.awsdns-46.net&quot;,</span>
<span class="line">            &quot;created_on&quot;: &quot;2020-11-13T06:25:32.18642Z&quot;,</span>
<span class="line">            &quot;id&quot;: &quot;dxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxb&quot;,</span>
<span class="line">            &quot;locked&quot;: false,</span>
<span class="line">            &quot;meta&quot;: {</span>
<span class="line">                &quot;auto_added&quot;: false,</span>
<span class="line">                &quot;managed_by_apps&quot;: false,</span>
<span class="line">                &quot;managed_by_argo_tunnel&quot;: false,</span>
<span class="line">                &quot;source&quot;: &quot;primary&quot;</span>
<span class="line">            },</span>
<span class="line">            &quot;modified_on&quot;: &quot;2020-11-13T06:25:32.18642Z&quot;,</span>
<span class="line">            &quot;name&quot;: &quot;k8s.mylabs.dev&quot;,</span>
<span class="line">            &quot;proxiable&quot;: false,</span>
<span class="line">            &quot;proxied&quot;: false,</span>
<span class="line">            &quot;ttl&quot;: 1,</span>
<span class="line">            &quot;type&quot;: &quot;NS&quot;,</span>
<span class="line">            &quot;zone_id&quot;: &quot;2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxe&quot;,</span>
<span class="line">            &quot;zone_name&quot;: &quot;mylabs.dev&quot;</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line">localhost | CHANGED =&gt; {</span>
<span class="line">    &quot;ansible_facts&quot;: {</span>
<span class="line">        &quot;discovered_interpreter_python&quot;: &quot;/usr/bin/python&quot;</span>
<span class="line">    },</span>
<span class="line">    &quot;changed&quot;: true,</span>
<span class="line">    &quot;result&quot;: {</span>
<span class="line">        &quot;record&quot;: {</span>
<span class="line">            &quot;content&quot;: &quot;ns-1692.awsdns-19.co.uk&quot;,</span>
<span class="line">            &quot;created_on&quot;: &quot;2020-11-13T06:25:37.605605Z&quot;,</span>
<span class="line">            &quot;id&quot;: &quot;9xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxb&quot;,</span>
<span class="line">            &quot;locked&quot;: false,</span>
<span class="line">            &quot;meta&quot;: {</span>
<span class="line">                &quot;auto_added&quot;: false,</span>
<span class="line">                &quot;managed_by_apps&quot;: false,</span>
<span class="line">                &quot;managed_by_argo_tunnel&quot;: false,</span>
<span class="line">                &quot;source&quot;: &quot;primary&quot;</span>
<span class="line">            },</span>
<span class="line">            &quot;modified_on&quot;: &quot;2020-11-13T06:25:37.605605Z&quot;,</span>
<span class="line">            &quot;name&quot;: &quot;k8s.mylabs.dev&quot;,</span>
<span class="line">            &quot;proxiable&quot;: false,</span>
<span class="line">            &quot;proxied&quot;: false,</span>
<span class="line">            &quot;ttl&quot;: 1,</span>
<span class="line">            &quot;type&quot;: &quot;NS&quot;,</span>
<span class="line">            &quot;zone_id&quot;: &quot;2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxe&quot;,</span>
<span class="line">            &quot;zone_name&quot;: &quot;mylabs.dev&quot;</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="create-networking-for-amazon-eks" tabindex="-1"><a class="header-anchor" href="#create-networking-for-amazon-eks"><span>Create networking for Amazon EKS</span></a></h2><p>Details with examples are described on these links:</p><ul><li><a href="https://aws.amazon.com/blogs/opensource/introducing-fine-grained-iam-roles-service-accounts/" target="_blank" rel="noopener noreferrer">https://aws.amazon.com/blogs/opensource/introducing-fine-grained-iam-roles-service-accounts/</a></li><li><a href="https://cert-manager.io/docs/configuration/acme/dns01/route53/" target="_blank" rel="noopener noreferrer">https://cert-manager.io/docs/configuration/acme/dns01/route53/</a></li><li><a href="https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/aws.md" target="_blank" rel="noopener noreferrer">https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/aws.md</a></li></ul><p>Create temporary directory for files used for creating/configuring EKS Cluster and it&#39;s components:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Create CloudFormation template with Networking and KMS key for Amazon EKS. The template was taken from <a href="https://docs.aws.amazon.com/eks/latest/userguide/create-public-private-vpc.html" target="_blank" rel="noopener noreferrer">Creating a VPC for your Amazon EKS cluster</a>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/cf-amazon-eks-vpc-private-subnets-kms.yml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">AWSTemplateFormatVersion: <span class="token string">&#39;2010-09-09&#39;</span></span>
<span class="line">Description: <span class="token string">&#39;Amazon EKS VPC with Private and Public subnets and KMS key&#39;</span></span>
<span class="line"></span>
<span class="line">Parameters:</span>
<span class="line"></span>
<span class="line">  VpcBlock:</span>
<span class="line">    Type: String</span>
<span class="line">    Default: <span class="token number">192.168</span>.0.0/16</span>
<span class="line">    Description: The CIDR range <span class="token keyword">for</span> the VPC. This should be a valid private <span class="token punctuation">(</span>RFC <span class="token number">1918</span><span class="token punctuation">)</span> CIDR range.</span>
<span class="line"></span>
<span class="line">  PublicSubnet01Block:</span>
<span class="line">    Type: String</span>
<span class="line">    Default: <span class="token number">192.168</span>.0.0/18</span>
<span class="line">    Description: CidrBlock <span class="token keyword">for</span> public subnet 01 within the VPC</span>
<span class="line"></span>
<span class="line">  PublicSubnet02Block:</span>
<span class="line">    Type: String</span>
<span class="line">    Default: <span class="token number">192.168</span>.64.0/18</span>
<span class="line">    Description: CidrBlock <span class="token keyword">for</span> public subnet 02 within the VPC</span>
<span class="line"></span>
<span class="line">  PrivateSubnet01Block:</span>
<span class="line">    Type: String</span>
<span class="line">    Default: <span class="token number">192.168</span>.128.0/18</span>
<span class="line">    Description: CidrBlock <span class="token keyword">for</span> private subnet 01 within the VPC</span>
<span class="line"></span>
<span class="line">  PrivateSubnet02Block:</span>
<span class="line">    Type: String</span>
<span class="line">    Default: <span class="token number">192.168</span>.192.0/18</span>
<span class="line">    Description: CidrBlock <span class="token keyword">for</span> private subnet 02 within the VPC</span>
<span class="line"></span>
<span class="line">  ClusterFQDN:</span>
<span class="line">    Description: <span class="token string">&quot;Cluster domain where all necessary app subdomains will live (subdomain of BaseDomain). Ex: kube1.k8s.mylabs.dev&quot;</span></span>
<span class="line">    Type: String</span>
<span class="line"></span>
<span class="line">  ClusterName:</span>
<span class="line">    Description: <span class="token string">&quot;K8s Cluster name. Ex: kube1&quot;</span></span>
<span class="line">    Type: String</span>
<span class="line"></span>
<span class="line">Metadata:</span>
<span class="line">  AWS::CloudFormation::Interface:</span>
<span class="line">    ParameterGroups:</span>
<span class="line">      -</span>
<span class="line">        Label:</span>
<span class="line">          default: <span class="token string">&quot;Worker Network Configuration&quot;</span></span>
<span class="line">        Parameters:</span>
<span class="line">          - VpcBlock</span>
<span class="line">          - PublicSubnet01Block</span>
<span class="line">          - PublicSubnet02Block</span>
<span class="line">          - PrivateSubnet01Block</span>
<span class="line">          - PrivateSubnet02Block</span>
<span class="line"></span>
<span class="line">  cfn-lint:</span>
<span class="line">    config:</span>
<span class="line">      ignore_checks:</span>
<span class="line">        - W3005</span>
<span class="line">      configure_rules:</span>
<span class="line">        E3012:</span>
<span class="line">          strict: False</span>
<span class="line"></span>
<span class="line">Resources:</span>
<span class="line"></span>
<span class="line">  VPC:</span>
<span class="line">    Type: AWS::EC2::VPC</span>
<span class="line">    Properties:</span>
<span class="line">      CidrBlock: <span class="token operator">!</span>Ref VpcBlock</span>
<span class="line">      EnableDnsSupport: <span class="token boolean">true</span></span>
<span class="line">      EnableDnsHostnames: <span class="token boolean">true</span></span>
<span class="line">      Tags:</span>
<span class="line">      - Key: Name</span>
<span class="line">        Value: <span class="token operator">!</span>Sub <span class="token string">&#39;\${ClusterFQDN}-VPC&#39;</span></span>
<span class="line"></span>
<span class="line">  InternetGateway:</span>
<span class="line">    Type: <span class="token string">&quot;AWS::EC2::InternetGateway&quot;</span></span>
<span class="line"></span>
<span class="line">  VPCGatewayAttachment:</span>
<span class="line">    Type: <span class="token string">&quot;AWS::EC2::VPCGatewayAttachment&quot;</span></span>
<span class="line">    Properties:</span>
<span class="line">      InternetGatewayId: <span class="token operator">!</span>Ref InternetGateway</span>
<span class="line">      VpcId: <span class="token operator">!</span>Ref VPC</span>
<span class="line"></span>
<span class="line">  PublicRouteTable:</span>
<span class="line">    Type: AWS::EC2::RouteTable</span>
<span class="line">    Properties:</span>
<span class="line">      VpcId: <span class="token operator">!</span>Ref VPC</span>
<span class="line">      Tags:</span>
<span class="line">      - Key: Name</span>
<span class="line">        Value: Public Subnets</span>
<span class="line">      - Key: Network</span>
<span class="line">        Value: Public</span>
<span class="line"></span>
<span class="line">  PrivateRouteTable01:</span>
<span class="line">    Type: AWS::EC2::RouteTable</span>
<span class="line">    Properties:</span>
<span class="line">      VpcId: <span class="token operator">!</span>Ref VPC</span>
<span class="line">      Tags:</span>
<span class="line">      - Key: Name</span>
<span class="line">        Value: Private Subnet AZ1</span>
<span class="line">      - Key: Network</span>
<span class="line">        Value: Private01</span>
<span class="line"></span>
<span class="line">  PrivateRouteTable02:</span>
<span class="line">    Type: AWS::EC2::RouteTable</span>
<span class="line">    Properties:</span>
<span class="line">      VpcId: <span class="token operator">!</span>Ref VPC</span>
<span class="line">      Tags:</span>
<span class="line">      - Key: Name</span>
<span class="line">        Value: Private Subnet AZ2</span>
<span class="line">      - Key: Network</span>
<span class="line">        Value: Private02</span>
<span class="line"></span>
<span class="line">  PublicRoute:</span>
<span class="line">    DependsOn: VPCGatewayAttachment</span>
<span class="line">    Type: AWS::EC2::Route</span>
<span class="line">    Properties:</span>
<span class="line">      RouteTableId: <span class="token operator">!</span>Ref PublicRouteTable</span>
<span class="line">      DestinationCidrBlock: <span class="token number">0.0</span>.0.0/0</span>
<span class="line">      GatewayId: <span class="token operator">!</span>Ref InternetGateway</span>
<span class="line"></span>
<span class="line">  PrivateRoute01:</span>
<span class="line">    DependsOn:</span>
<span class="line">    - VPCGatewayAttachment</span>
<span class="line">    - NatGateway01</span>
<span class="line">    Type: AWS::EC2::Route</span>
<span class="line">    Properties:</span>
<span class="line">      RouteTableId: <span class="token operator">!</span>Ref PrivateRouteTable01</span>
<span class="line">      DestinationCidrBlock: <span class="token number">0.0</span>.0.0/0</span>
<span class="line">      NatGatewayId: <span class="token operator">!</span>Ref NatGateway01</span>
<span class="line"></span>
<span class="line">  PrivateRoute02:</span>
<span class="line">    DependsOn:</span>
<span class="line">    - VPCGatewayAttachment</span>
<span class="line">    - NatGateway02</span>
<span class="line">    Type: AWS::EC2::Route</span>
<span class="line">    Properties:</span>
<span class="line">      RouteTableId: <span class="token operator">!</span>Ref PrivateRouteTable02</span>
<span class="line">      DestinationCidrBlock: <span class="token number">0.0</span>.0.0/0</span>
<span class="line">      NatGatewayId: <span class="token operator">!</span>Ref NatGateway02</span>
<span class="line"></span>
<span class="line">  NatGateway01:</span>
<span class="line">    DependsOn:</span>
<span class="line">    - NatGatewayEIP1</span>
<span class="line">    - PublicSubnet01</span>
<span class="line">    - VPCGatewayAttachment</span>
<span class="line">    Type: AWS::EC2::NatGateway</span>
<span class="line">    Properties:</span>
<span class="line">      AllocationId: <span class="token operator">!</span>GetAtt <span class="token string">&#39;NatGatewayEIP1.AllocationId&#39;</span></span>
<span class="line">      SubnetId: <span class="token operator">!</span>Ref PublicSubnet01</span>
<span class="line">      Tags:</span>
<span class="line">      - Key: Name</span>
<span class="line">        Value: <span class="token operator">!</span>Sub <span class="token string">&#39;\${ClusterFQDN}-NatGatewayAZ1&#39;</span></span>
<span class="line"></span>
<span class="line">  NatGateway02:</span>
<span class="line">    DependsOn:</span>
<span class="line">    - NatGatewayEIP2</span>
<span class="line">    - PublicSubnet02</span>
<span class="line">    - VPCGatewayAttachment</span>
<span class="line">    Type: AWS::EC2::NatGateway</span>
<span class="line">    Properties:</span>
<span class="line">      AllocationId: <span class="token operator">!</span>GetAtt <span class="token string">&#39;NatGatewayEIP2.AllocationId&#39;</span></span>
<span class="line">      SubnetId: <span class="token operator">!</span>Ref PublicSubnet02</span>
<span class="line">      Tags:</span>
<span class="line">      - Key: Name</span>
<span class="line">        Value: <span class="token operator">!</span>Sub <span class="token string">&#39;\${ClusterFQDN}-NatGatewayAZ2&#39;</span></span>
<span class="line"></span>
<span class="line">  NatGatewayEIP1:</span>
<span class="line">    DependsOn:</span>
<span class="line">    - VPCGatewayAttachment</span>
<span class="line">    Type: <span class="token string">&#39;AWS::EC2::EIP&#39;</span></span>
<span class="line">    Properties:</span>
<span class="line">      Domain: vpc</span>
<span class="line"></span>
<span class="line">  NatGatewayEIP2:</span>
<span class="line">    DependsOn:</span>
<span class="line">    - VPCGatewayAttachment</span>
<span class="line">    Type: <span class="token string">&#39;AWS::EC2::EIP&#39;</span></span>
<span class="line">    Properties:</span>
<span class="line">      Domain: vpc</span>
<span class="line"></span>
<span class="line">  PublicSubnet01:</span>
<span class="line">    Type: AWS::EC2::Subnet</span>
<span class="line">    Metadata:</span>
<span class="line">      Comment: Subnet 01</span>
<span class="line">    Properties:</span>
<span class="line">      MapPublicIpOnLaunch: <span class="token boolean">true</span></span>
<span class="line">      AvailabilityZone:</span>
<span class="line">        Fn::Select:</span>
<span class="line">        - <span class="token string">&#39;0&#39;</span></span>
<span class="line">        - Fn::GetAZs:</span>
<span class="line">            Ref: AWS::Region</span>
<span class="line">      CidrBlock:</span>
<span class="line">        Ref: PublicSubnet01Block</span>
<span class="line">      VpcId:</span>
<span class="line">        Ref: VPC</span>
<span class="line">      Tags:</span>
<span class="line">      - Key: Name</span>
<span class="line">        Value: <span class="token operator">!</span>Sub <span class="token string">&quot;<span class="token variable">\${ClusterFQDN}</span>-PublicSubnet01&quot;</span></span>
<span class="line">      - Key: kubernetes.io/role/elb</span>
<span class="line">        Value: <span class="token number">1</span></span>
<span class="line"></span>
<span class="line">  PublicSubnet02:</span>
<span class="line">    Type: AWS::EC2::Subnet</span>
<span class="line">    Metadata:</span>
<span class="line">      Comment: Subnet 02</span>
<span class="line">    Properties:</span>
<span class="line">      MapPublicIpOnLaunch: <span class="token boolean">true</span></span>
<span class="line">      AvailabilityZone:</span>
<span class="line">        Fn::Select:</span>
<span class="line">        - <span class="token string">&#39;1&#39;</span></span>
<span class="line">        - Fn::GetAZs:</span>
<span class="line">            Ref: AWS::Region</span>
<span class="line">      CidrBlock:</span>
<span class="line">        Ref: PublicSubnet02Block</span>
<span class="line">      VpcId:</span>
<span class="line">        Ref: VPC</span>
<span class="line">      Tags:</span>
<span class="line">      - Key: Name</span>
<span class="line">        Value: <span class="token operator">!</span>Sub <span class="token string">&quot;<span class="token variable">\${ClusterFQDN}</span>-PublicSubnet02&quot;</span></span>
<span class="line">      - Key: kubernetes.io/role/elb</span>
<span class="line">        Value: <span class="token number">1</span></span>
<span class="line"></span>
<span class="line">  PrivateSubnet01:</span>
<span class="line">    Type: AWS::EC2::Subnet</span>
<span class="line">    Metadata:</span>
<span class="line">      Comment: Subnet 03</span>
<span class="line">    Properties:</span>
<span class="line">      AvailabilityZone:</span>
<span class="line">        Fn::Select:</span>
<span class="line">        - <span class="token string">&#39;0&#39;</span></span>
<span class="line">        - Fn::GetAZs:</span>
<span class="line">            Ref: AWS::Region</span>
<span class="line">      CidrBlock:</span>
<span class="line">        Ref: PrivateSubnet01Block</span>
<span class="line">      VpcId:</span>
<span class="line">        Ref: VPC</span>
<span class="line">      Tags:</span>
<span class="line">      - Key: Name</span>
<span class="line">        Value: <span class="token operator">!</span>Sub <span class="token string">&quot;<span class="token variable">\${ClusterFQDN}</span>-PrivateSubnet01&quot;</span></span>
<span class="line">      - Key: kubernetes.io/role/internal-elb</span>
<span class="line">        Value: <span class="token number">1</span></span>
<span class="line">      <span class="token comment"># Needed for Karpenter</span></span>
<span class="line">      - Key: <span class="token operator">!</span>Sub <span class="token string">&quot;kubernetes.io/cluster/<span class="token variable">\${ClusterName}</span>&quot;</span></span>
<span class="line">        Value: <span class="token string">&quot;&quot;</span></span>
<span class="line"></span>
<span class="line">  PrivateSubnet02:</span>
<span class="line">    Type: AWS::EC2::Subnet</span>
<span class="line">    Metadata:</span>
<span class="line">      Comment: Private Subnet 02</span>
<span class="line">    Properties:</span>
<span class="line">      AvailabilityZone:</span>
<span class="line">        Fn::Select:</span>
<span class="line">        - <span class="token string">&#39;1&#39;</span></span>
<span class="line">        - Fn::GetAZs:</span>
<span class="line">            Ref: AWS::Region</span>
<span class="line">      CidrBlock:</span>
<span class="line">        Ref: PrivateSubnet02Block</span>
<span class="line">      VpcId:</span>
<span class="line">        Ref: VPC</span>
<span class="line">      Tags:</span>
<span class="line">      - Key: Name</span>
<span class="line">        Value: <span class="token operator">!</span>Sub <span class="token string">&quot;<span class="token variable">\${ClusterFQDN}</span>-PrivateSubnet02&quot;</span></span>
<span class="line">      - Key: kubernetes.io/role/internal-elb</span>
<span class="line">        Value: <span class="token number">1</span></span>
<span class="line">      <span class="token comment"># Needed for Karpenter</span></span>
<span class="line">      - Key: <span class="token operator">!</span>Sub <span class="token string">&quot;kubernetes.io/cluster/<span class="token variable">\${ClusterName}</span>&quot;</span></span>
<span class="line">        Value: <span class="token string">&quot;&quot;</span></span>
<span class="line"></span>
<span class="line">  PublicSubnet01RouteTableAssociation:</span>
<span class="line">    Type: AWS::EC2::SubnetRouteTableAssociation</span>
<span class="line">    Properties:</span>
<span class="line">      SubnetId: <span class="token operator">!</span>Ref PublicSubnet01</span>
<span class="line">      RouteTableId: <span class="token operator">!</span>Ref PublicRouteTable</span>
<span class="line"></span>
<span class="line">  PublicSubnet02RouteTableAssociation:</span>
<span class="line">    Type: AWS::EC2::SubnetRouteTableAssociation</span>
<span class="line">    Properties:</span>
<span class="line">      SubnetId: <span class="token operator">!</span>Ref PublicSubnet02</span>
<span class="line">      RouteTableId: <span class="token operator">!</span>Ref PublicRouteTable</span>
<span class="line"></span>
<span class="line">  PrivateSubnet01RouteTableAssociation:</span>
<span class="line">    Type: AWS::EC2::SubnetRouteTableAssociation</span>
<span class="line">    Properties:</span>
<span class="line">      SubnetId: <span class="token operator">!</span>Ref PrivateSubnet01</span>
<span class="line">      RouteTableId: <span class="token operator">!</span>Ref PrivateRouteTable01</span>
<span class="line"></span>
<span class="line">  PrivateSubnet02RouteTableAssociation:</span>
<span class="line">    Type: AWS::EC2::SubnetRouteTableAssociation</span>
<span class="line">    Properties:</span>
<span class="line">      SubnetId: <span class="token operator">!</span>Ref PrivateSubnet02</span>
<span class="line">      RouteTableId: <span class="token operator">!</span>Ref PrivateRouteTable02</span>
<span class="line"></span>
<span class="line">  KMSAlias:</span>
<span class="line">    Type: AWS::KMS::Alias</span>
<span class="line">    Properties:</span>
<span class="line">      AliasName: <span class="token operator">!</span>Sub <span class="token string">&quot;alias/eks-<span class="token variable">\${ClusterName}</span>&quot;</span></span>
<span class="line">      TargetKeyId: <span class="token operator">!</span>Ref KMSKey</span>
<span class="line"></span>
<span class="line">  KMSKey:</span>
<span class="line">    Type: AWS::KMS::Key</span>
<span class="line">    Properties:</span>
<span class="line">      Description: <span class="token operator">!</span>Sub <span class="token string">&quot;KMS key for secrets related to <span class="token variable">\${ClusterFQDN}</span>&quot;</span></span>
<span class="line">      EnableKeyRotation: <span class="token boolean">true</span></span>
<span class="line">      PendingWindowInDays: <span class="token number">7</span></span>
<span class="line">      KeyPolicy:</span>
<span class="line">        Version: <span class="token string">&quot;2012-10-17&quot;</span></span>
<span class="line">        Id: <span class="token operator">!</span>Sub <span class="token string">&quot;eks-key-policy-<span class="token variable">\${ClusterName}</span>&quot;</span></span>
<span class="line">        Statement:</span>
<span class="line">        - Sid: Enable IAM User Permissions</span>
<span class="line">          Effect: Allow</span>
<span class="line">          Principal:</span>
<span class="line">            AWS: <span class="token operator">!</span>Sub <span class="token string">&quot;arn:aws:iam::<span class="token variable">\${AWS<span class="token operator">:</span><span class="token operator">:</span>AccountId}</span>:root&quot;</span></span>
<span class="line">          Action: kms:*</span>
<span class="line">          Resource: <span class="token string">&quot;*&quot;</span></span>
<span class="line">        <span class="token comment"># https://docs.aws.amazon.com/autoscaling/ec2/userguide/key-policy-requirements-EBS-encryption.html</span></span>
<span class="line">        - Sid: Allow use of the key</span>
<span class="line">          Effect: Allow</span>
<span class="line">          Principal:</span>
<span class="line">            AWS: <span class="token operator">!</span>Sub <span class="token string">&quot;arn:aws:iam::<span class="token variable">\${AWS<span class="token operator">:</span><span class="token operator">:</span>AccountId}</span>:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling&quot;</span></span>
<span class="line">          Action:</span>
<span class="line">          - kms:Encrypt</span>
<span class="line">          - kms:Decrypt</span>
<span class="line">          - kms:ReEncrypt*</span>
<span class="line">          - kms:GenerateDataKey*</span>
<span class="line">          - kms:DescribeKey</span>
<span class="line">          Resource: <span class="token string">&quot;*&quot;</span></span>
<span class="line">        - Sid: Allow attachment of persistent resources</span>
<span class="line">          Effect: Allow</span>
<span class="line">          Principal:</span>
<span class="line">            AWS: <span class="token operator">!</span>Sub <span class="token string">&quot;arn:aws:iam::<span class="token variable">\${AWS<span class="token operator">:</span><span class="token operator">:</span>AccountId}</span>:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling&quot;</span></span>
<span class="line">          Action:</span>
<span class="line">          - kms:CreateGrant</span>
<span class="line">          Resource: <span class="token string">&quot;*&quot;</span></span>
<span class="line">          Condition:</span>
<span class="line">            Bool:</span>
<span class="line">              kms:GrantIsForAWSResource: <span class="token boolean">true</span></span>
<span class="line"></span>
<span class="line">Outputs:</span>
<span class="line"></span>
<span class="line">  SubnetIds:</span>
<span class="line">    Description: Subnets IDs <span class="token keyword">in</span> the VPC</span>
<span class="line">    Value: <span class="token operator">!</span>Join <span class="token punctuation">[</span> <span class="token string">&quot;,&quot;</span>, <span class="token punctuation">[</span> <span class="token operator">!</span>Ref PublicSubnet01, <span class="token operator">!</span>Ref PublicSubnet02, <span class="token operator">!</span>Ref PrivateSubnet01, <span class="token operator">!</span>Ref PrivateSubnet02 <span class="token punctuation">]</span> <span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">  SubnetsIdsPrivate:</span>
<span class="line">    Description: Private Subnets IDs <span class="token keyword">in</span> the VPC</span>
<span class="line">    Value: <span class="token operator">!</span>Join <span class="token punctuation">[</span> <span class="token string">&quot;,&quot;</span>, <span class="token punctuation">[</span> <span class="token operator">!</span>Ref PrivateSubnet01, <span class="token operator">!</span>Ref PrivateSubnet02 <span class="token punctuation">]</span> <span class="token punctuation">]</span></span>
<span class="line">    Export:</span>
<span class="line">      Name:</span>
<span class="line">        <span class="token string">&#39;Fn::Sub&#39;</span><span class="token builtin class-name">:</span> <span class="token string">&#39;\${AWS::StackName}-SubnetsIdsPrivate&#39;</span></span>
<span class="line"></span>
<span class="line">  PrivateSubnetId1:</span>
<span class="line">    Description: A reference to the private subnet <span class="token keyword">in</span> the 1st Availability Zone</span>
<span class="line">    Value: <span class="token operator">!</span>Ref PrivateSubnet01</span>
<span class="line"></span>
<span class="line">  PrivateSubnetId2:</span>
<span class="line">    Description: A reference to the private subnet <span class="token keyword">in</span> the 2nd Availability Zone</span>
<span class="line">    Value: <span class="token operator">!</span>Ref PrivateSubnet02</span>
<span class="line"></span>
<span class="line">  PublicSubnetId1:</span>
<span class="line">    Description: A reference to the public subnet <span class="token keyword">in</span> the 1st Availability Zone</span>
<span class="line">    Value: <span class="token operator">!</span>Ref PublicSubnet01</span>
<span class="line"></span>
<span class="line">  PublicSubnetId2:</span>
<span class="line">    Description: A reference to the public subnet <span class="token keyword">in</span> the 1st Availability Zone</span>
<span class="line">    Value: <span class="token operator">!</span>Ref PublicSubnet02</span>
<span class="line"></span>
<span class="line">  VpcId:</span>
<span class="line">    Description: The VPC Id</span>
<span class="line">    Value: <span class="token operator">!</span>Ref VPC</span>
<span class="line">    Export:</span>
<span class="line">      Name:</span>
<span class="line">        <span class="token string">&#39;Fn::Sub&#39;</span><span class="token builtin class-name">:</span> <span class="token string">&#39;\${AWS::StackName}-VpcId&#39;</span></span>
<span class="line"></span>
<span class="line">  VpcCidrBlock:</span>
<span class="line">    Description: The VPC CIDR</span>
<span class="line">    Value: <span class="token operator">!</span>GetAtt VPC.CidrBlock</span>
<span class="line">    Export:</span>
<span class="line">      Name:</span>
<span class="line">        <span class="token string">&#39;Fn::Sub&#39;</span><span class="token builtin class-name">:</span> <span class="token string">&#39;\${AWS::StackName}-VpcCidrBlock&#39;</span></span>
<span class="line"></span>
<span class="line">  KMSKeyArn:</span>
<span class="line">    Description: The ARN of the created KMS Key</span>
<span class="line">    Value: <span class="token operator">!</span>GetAtt KMSKey.Arn</span>
<span class="line"></span>
<span class="line">  KMSKeyId:</span>
<span class="line">    Description: The ID of the created KMS Key to encrypt EKS related services</span>
<span class="line">    Value: <span class="token operator">!</span>Ref KMSKey</span>
<span class="line">    Export:</span>
<span class="line">      Name:</span>
<span class="line">        <span class="token string">&#39;Fn::Sub&#39;</span><span class="token builtin class-name">:</span> <span class="token string">&#39;\${AWS::StackName}-KMSKeyId&#39;</span></span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">eval</span> aws cloudformation deploy <span class="token punctuation">\\</span></span>
<span class="line">  --parameter-overrides <span class="token string">&quot;ClusterFQDN=<span class="token variable">\${CLUSTER_FQDN}</span> ClusterName=<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --stack-name <span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>-amazon-eks-vpc-private-subnets-kms&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  --template-file <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/cf-amazon-eks-vpc-private-subnets-kms.yml&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">  <span class="token parameter variable">--tags</span> <span class="token string">&quot;<span class="token variable">\${TAGS}</span>&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Get the variables form CloudFormation:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line">aws cloudformation describe-stacks --stack-name <span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>-amazon-eks-vpc-private-subnets-kms&quot;</span> <span class="token operator">&gt;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${CLUSTER_NAME}</span>-amazon-eks-vpc-private-subnets-kms.json&quot;</span></span>
<span class="line"><span class="token assign-left variable">AWS_VPC_ID</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jq <span class="token parameter variable">-r</span> <span class="token string">&quot;.Stacks[0].Outputs[] | select(.OutputKey==<span class="token entity" title="\\&quot;">\\&quot;</span>VpcId<span class="token entity" title="\\&quot;">\\&quot;</span>) .OutputValue&quot;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${CLUSTER_NAME}</span>-amazon-eks-vpc-private-subnets-kms.json&quot;</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token assign-left variable">AWS_PUBLICSUBNETID1</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jq <span class="token parameter variable">-r</span> <span class="token string">&quot;.Stacks[0].Outputs[] | select(.OutputKey==<span class="token entity" title="\\&quot;">\\&quot;</span>PublicSubnetId1<span class="token entity" title="\\&quot;">\\&quot;</span>) .OutputValue&quot;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${CLUSTER_NAME}</span>-amazon-eks-vpc-private-subnets-kms.json&quot;</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token assign-left variable">AWS_PUBLICSUBNETID2</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jq <span class="token parameter variable">-r</span> <span class="token string">&quot;.Stacks[0].Outputs[] | select(.OutputKey==<span class="token entity" title="\\&quot;">\\&quot;</span>PublicSubnetId2<span class="token entity" title="\\&quot;">\\&quot;</span>) .OutputValue&quot;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${CLUSTER_NAME}</span>-amazon-eks-vpc-private-subnets-kms.json&quot;</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token assign-left variable">AWS_PRIVATESUBNETID1</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jq <span class="token parameter variable">-r</span> <span class="token string">&quot;.Stacks[0].Outputs[] | select(.OutputKey==<span class="token entity" title="\\&quot;">\\&quot;</span>PrivateSubnetId1<span class="token entity" title="\\&quot;">\\&quot;</span>) .OutputValue&quot;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${CLUSTER_NAME}</span>-amazon-eks-vpc-private-subnets-kms.json&quot;</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token assign-left variable">AWS_PRIVATESUBNETID2</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jq <span class="token parameter variable">-r</span> <span class="token string">&quot;.Stacks[0].Outputs[] | select(.OutputKey==<span class="token entity" title="\\&quot;">\\&quot;</span>PrivateSubnetId2<span class="token entity" title="\\&quot;">\\&quot;</span>) .OutputValue&quot;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${CLUSTER_NAME}</span>-amazon-eks-vpc-private-subnets-kms.json&quot;</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token assign-left variable">AWS_KMS_KEY_ARN</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jq <span class="token parameter variable">-r</span> <span class="token string">&quot;.Stacks[0].Outputs[] | select(.OutputKey==<span class="token entity" title="\\&quot;">\\&quot;</span>KMSKeyArn<span class="token entity" title="\\&quot;">\\&quot;</span>) .OutputValue&quot;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${CLUSTER_NAME}</span>-amazon-eks-vpc-private-subnets-kms.json&quot;</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token assign-left variable">AWS_KMS_KEY_ID</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jq <span class="token parameter variable">-r</span> <span class="token string">&quot;.Stacks[0].Outputs[] | select(.OutputKey==<span class="token entity" title="\\&quot;">\\&quot;</span>KMSKeyId<span class="token entity" title="\\&quot;">\\&quot;</span>) .OutputValue&quot;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/<span class="token variable">\${CLUSTER_NAME}</span>-amazon-eks-vpc-private-subnets-kms.json&quot;</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token assign-left variable">AWS_ACCOUNT_ID</span><span class="token operator">=</span><span class="token variable">\${AWS_ACCOUNT_ID<span class="token operator">:-</span>$(aws sts get-caller-identity --query Account --output text)}</span></span>
<span class="line"><span class="token builtin class-name">export</span> AWS_ACCOUNT_ID</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,47);function b(m,k){const n=c("router-link");return o(),p("div",null,[u,s("nav",d,[s("ul",null,[s("li",null,[a(n,{to:"#requirements"},{default:e(()=>[l("Requirements")]),_:1})]),s("li",null,[a(n,{to:"#prepare-the-local-working-environment"},{default:e(()=>[l("Prepare the local working environment")]),_:1})]),s("li",null,[a(n,{to:"#configure-aws-route-53-domain-delegation"},{default:e(()=>[l("Configure AWS Route 53 Domain delegation")]),_:1})]),s("li",null,[a(n,{to:"#create-networking-for-amazon-eks"},{default:e(()=>[l("Create networking for Amazon EKS")]),_:1})])])]),v])}const q=i(r,[["render",b],["__file","index.html.vue"]]),x=JSON.parse('{"path":"/part-01/","title":"Create initial AWS structure","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"Requirements","slug":"requirements","link":"#requirements","children":[]},{"level":2,"title":"Prepare the local working environment","slug":"prepare-the-local-working-environment","link":"#prepare-the-local-working-environment","children":[]},{"level":2,"title":"Configure AWS Route 53 Domain delegation","slug":"configure-aws-route-53-domain-delegation","link":"#configure-aws-route-53-domain-delegation","children":[]},{"level":2,"title":"Create networking for Amazon EKS","slug":"create-networking-for-amazon-eks","link":"#create-networking-for-amazon-eks","children":[]}],"git":{"updatedTime":1719720548000},"filePathRelative":"part-01/README.md"}');export{q as comp,x as data};
