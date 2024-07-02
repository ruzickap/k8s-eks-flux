import{_ as i,c as p,a as s,b as a,w as e,d as t,r as c,o as r,e as l}from"./app-DVraMtkj.js";const o={},d=s("h1",{id:"create-additional-aws-structure",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#create-additional-aws-structure"},[s("span",null,"Create additional AWS structure")])],-1),u={class:"table-of-contents"},v=t(`<h2 id="create-route53" tabindex="-1"><a class="header-anchor" href="#create-route53"><span>Create Route53</span></a></h2><p>Create CloudFormation template containing policies for Route53, S3 access (Harbor, Velero) and Domain.</p><p>Put new domain <code>CLUSTER_FQDN</code> to the Route 53 and configure the DNS delegation from the <code>BASE_DOMAIN</code>.</p><p>Create Route53 zone:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/cf-route53.yml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF</span>
<span class="line">AWSTemplateFormatVersion: <span class="token number">2010</span>-09-09</span>
<span class="line">Description: Route53 entries</span>
<span class="line"></span>
<span class="line">Parameters:</span>
<span class="line"></span>
<span class="line">  BaseDomain:</span>
<span class="line">    Description: <span class="token string">&quot;Base domain where cluster domains + their subdomains will live. Ex: k8s.mylabs.dev&quot;</span></span>
<span class="line">    Type: String</span>
<span class="line"></span>
<span class="line">  ClusterFQDN:</span>
<span class="line">    Description: <span class="token string">&quot;Cluster FQDN. (domain for all applications) Ex: kube1.k8s.mylabs.dev&quot;</span></span>
<span class="line">    Type: String</span>
<span class="line"></span>
<span class="line">Resources:</span>
<span class="line"></span>
<span class="line">  HostedZone:</span>
<span class="line">    Type: AWS::Route53::HostedZone</span>
<span class="line">    Properties:</span>
<span class="line">      Name: <span class="token operator">!</span>Ref ClusterFQDN</span>
<span class="line"></span>
<span class="line">  RecordSet:</span>
<span class="line">    Type: AWS::Route53::RecordSet</span>
<span class="line">    Properties:</span>
<span class="line">      HostedZoneName: <span class="token operator">!</span>Sub <span class="token string">&quot;<span class="token variable">\${BaseDomain}</span>.&quot;</span></span>
<span class="line">      Name: <span class="token operator">!</span>Ref ClusterFQDN</span>
<span class="line">      Type: NS</span>
<span class="line">      TTL: <span class="token number">60</span></span>
<span class="line">      ResourceRecords: <span class="token operator">!</span>GetAtt HostedZone.NameServers</span>
<span class="line"></span>
<span class="line">  S3Bucket:</span>
<span class="line">    Type: AWS::S3::Bucket</span>
<span class="line">    Properties:</span>
<span class="line">      AccessControl: Private</span>
<span class="line">      BucketName: <span class="token operator">!</span>Sub <span class="token string">&quot;<span class="token variable">\${ClusterFQDN}</span>&quot;</span></span>
<span class="line">      BucketEncryption:</span>
<span class="line">        ServerSideEncryptionConfiguration:</span>
<span class="line">          - ServerSideEncryptionByDefault:</span>
<span class="line">              SSEAlgorithm: AES256</span>
<span class="line">EOF</span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token variable"><span class="token variable">$(</span>aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE <span class="token parameter variable">--query</span> <span class="token string">&quot;StackSummaries[?starts_with(StackName, \\<span class="token variable"><span class="token variable">\`</span>$<span class="token punctuation">{</span>CLUSTER_NAME<span class="token punctuation">}</span>-route53<span class="token punctuation">\\</span><span class="token variable">\`</span></span>) == \\<span class="token variable"><span class="token variable">\`</span>true<span class="token punctuation">\\</span><span class="token variable">\`</span></span>].StackName&quot;</span> <span class="token parameter variable">--output</span> text<span class="token variable">)</span></span> <span class="token operator">==</span> <span class="token string">&quot;&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  <span class="token comment"># shellcheck disable=SC2001</span></span>
<span class="line">  <span class="token builtin class-name">eval</span> aws cloudformation <span class="token string">&quot;create-stack&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    <span class="token parameter variable">--parameters</span> <span class="token string">&quot;ParameterKey=BaseDomain,ParameterValue=<span class="token variable">\${BASE_DOMAIN}</span> ParameterKey=ClusterFQDN,ParameterValue=<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --stack-name <span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>-route53&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    --template-body <span class="token string">&quot;file://tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/cf-route53.yml&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    <span class="token parameter variable">--tags</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">\${TAGS}</span>&quot;</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token parameter variable">-e</span> <span class="token string">&#39;s/\\([^ =]*\\)=\\([^ ]*\\)/Key=\\1,Value=\\2/g&#39;</span><span class="token variable">)</span></span>&quot;</span> <span class="token operator">||</span> <span class="token boolean">true</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="create-amazon-eks" tabindex="-1"><a class="header-anchor" href="#create-amazon-eks"><span>Create Amazon EKS</span></a></h2><p><img src="https://raw.githubusercontent.com/aws-samples/eks-workshop/65b766c494a5b4f5420b2912d8373c4957163541/static/images/3-service-animated.gif" alt="EKS" title="EKS"></p><p>Create <a href="https://aws.amazon.com/eks/" target="_blank" rel="noopener noreferrer">Amazon EKS</a> in AWS by using <a href="https://eksctl.io/" target="_blank" rel="noopener noreferrer">eksctl</a>.</p><p><img src="https://raw.githubusercontent.com/weaveworks/eksctl/c365149fc1a0b8d357139cbd6cda5aee8841c16c/logo/eksctl.png" alt="eksctl" title="eksctl"></p><p>Create the Amazon EKS cluster with Calico using <code>eksctl</code>:</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/eksctl-<span class="token variable">\${CLUSTER_NAME}</span>.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">apiVersion: eksctl.io/v1alpha5</span>
<span class="line">kind: ClusterConfig</span>
<span class="line">metadata:</span>
<span class="line">  name: <span class="token variable">\${CLUSTER_NAME}</span></span>
<span class="line">  region: <span class="token variable">\${AWS_DEFAULT_REGION}</span></span>
<span class="line">  version: &quot;1.21&quot;</span>
<span class="line">  tags: &amp;tags</span>
<span class="line"><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">\${TAGS}</span>&quot;</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">&quot;s/ /<span class="token entity" title="\\\\">\\\\</span>n    /g; s/^/    /g; s/=/: /g&quot;</span><span class="token variable">)</span></span></span>
<span class="line">iam:</span>
<span class="line">  withOIDC: true</span>
<span class="line">  serviceAccounts:</span>
<span class="line">    - metadata:</span>
<span class="line">        name: aws-load-balancer-controller</span>
<span class="line">        namespace: aws-load-balancer</span>
<span class="line">      wellKnownPolicies:</span>
<span class="line">        awsLoadBalancerController: true</span>
<span class="line">    - metadata:</span>
<span class="line">        name: cert-manager</span>
<span class="line">        namespace: cert-manager</span>
<span class="line">      wellKnownPolicies:</span>
<span class="line">        certManager: true</span>
<span class="line">    - metadata:</span>
<span class="line">        name: cluster-autoscaler</span>
<span class="line">        namespace: cluster-autoscaler</span>
<span class="line">      wellKnownPolicies:</span>
<span class="line">        autoScaler: true</span>
<span class="line">    - metadata:</span>
<span class="line">        name: external-dns</span>
<span class="line">        namespace: external-dns</span>
<span class="line">      wellKnownPolicies:</span>
<span class="line">        externalDNS: true</span>
<span class="line">    - metadata:</span>
<span class="line">        name: ebs-csi-controller-sa</span>
<span class="line">        namespace: aws-ebs-csi-driver</span>
<span class="line">      wellKnownPolicies:</span>
<span class="line">        ebsCSIController: true</span>
<span class="line">    - metadata:</span>
<span class="line">        name: efs-csi-controller-sa</span>
<span class="line">        namespace: aws-efs-csi-driver</span>
<span class="line">      wellKnownPolicies:</span>
<span class="line">        efsCSIController: true</span>
<span class="line">    - metadata:</span>
<span class="line">        name: kustomize-controller</span>
<span class="line">        namespace: flux-system</span>
<span class="line">      attachPolicy:</span>
<span class="line">        Version: 2012-10-17</span>
<span class="line">        Statement:</span>
<span class="line">        - Sid: FluxKMS</span>
<span class="line">          Effect: Allow</span>
<span class="line">          Action:</span>
<span class="line">            - kms:Encrypt</span>
<span class="line">            - kms:Decrypt</span>
<span class="line">            - kms:ReEncrypt*</span>
<span class="line">            - kms:GenerateDataKey*</span>
<span class="line">            - kms:DescribeKey</span>
<span class="line">          Resource:</span>
<span class="line">          - <span class="token variable">\${AWS_KMS_KEY_ARN}</span></span>
<span class="line">    - metadata:</span>
<span class="line">        name: kuard-sa</span>
<span class="line">        namespace: kuard</span>
<span class="line">      attachPolicy:</span>
<span class="line">        Version: 2012-10-17</span>
<span class="line">        Statement:</span>
<span class="line">        - Sid: AllowSecretManagerAccess</span>
<span class="line">          Effect: Allow</span>
<span class="line">          Action:</span>
<span class="line">          - secretsmanager:GetSecretValue</span>
<span class="line">          Resource:</span>
<span class="line">          - arn:*:secretsmanager:*:*:secret:*</span>
<span class="line">        - Sid: AllowKMSAccess</span>
<span class="line">          Effect: Allow</span>
<span class="line">          Action:</span>
<span class="line">          - kms:Decrypt</span>
<span class="line">          Resource:</span>
<span class="line">          - <span class="token variable">\${AWS_KMS_KEY_ARN}</span></span>
<span class="line">          Condition:</span>
<span class="line">            StringLike:</span>
<span class="line">              kms:ViaService:</span>
<span class="line">                - secretsmanager.*.amazonaws.com</span>
<span class="line">    - metadata:</span>
<span class="line">        name: velero</span>
<span class="line">        namespace: velero</span>
<span class="line">      attachPolicy:</span>
<span class="line">        Version: 2012-10-17</span>
<span class="line">        Statement:</span>
<span class="line">        - Effect: Allow</span>
<span class="line">          Action:</span>
<span class="line">          - s3:ListBucket</span>
<span class="line">          Resource:</span>
<span class="line">          - arn:aws:s3:::<span class="token variable">\${CLUSTER_FQDN}</span></span>
<span class="line">        - Effect: Allow</span>
<span class="line">          Action:</span>
<span class="line">          - s3:PutObject</span>
<span class="line">          - s3:GetObject</span>
<span class="line">          - s3:DeleteObject</span>
<span class="line">          - s3:ListMultipartUploadParts</span>
<span class="line">          - s3:AbortMultipartUpload</span>
<span class="line">          Resource:</span>
<span class="line">          - arn:aws:s3:::<span class="token variable">\${CLUSTER_FQDN}</span>/*</span>
<span class="line">vpc:</span>
<span class="line">  id: &quot;<span class="token variable">\${AWS_VPC_ID}</span>&quot;</span>
<span class="line">  subnets:</span>
<span class="line">    private:</span>
<span class="line">      <span class="token variable">\${AWS_DEFAULT_REGION}</span>a:</span>
<span class="line">          id: &quot;<span class="token variable">\${AWS_PRIVATESUBNETID1}</span>&quot;</span>
<span class="line">      <span class="token variable">\${AWS_DEFAULT_REGION}</span>b:</span>
<span class="line">          id: &quot;<span class="token variable">\${AWS_PRIVATESUBNETID2}</span>&quot;</span>
<span class="line">    public:</span>
<span class="line">      <span class="token variable">\${AWS_DEFAULT_REGION}</span>a:</span>
<span class="line">          id: &quot;<span class="token variable">\${AWS_PUBLICSUBNETID1}</span>&quot;</span>
<span class="line">      <span class="token variable">\${AWS_DEFAULT_REGION}</span>b:</span>
<span class="line">          id: &quot;<span class="token variable">\${AWS_PUBLICSUBNETID2}</span>&quot;</span>
<span class="line">managedNodeGroups:</span>
<span class="line">  - name: managed-ng-1</span>
<span class="line">    amiFamily: Bottlerocket</span>
<span class="line">    instanceType: t3.large</span>
<span class="line">    desiredCapacity: 3</span>
<span class="line">    minSize: 2</span>
<span class="line">    maxSize: 5</span>
<span class="line">    volumeSize: 30</span>
<span class="line">    tags:</span>
<span class="line">      &lt;&lt;: *tags</span>
<span class="line">      compliance:na:defender: bottlerocket</span>
<span class="line">    volumeEncrypted: true</span>
<span class="line">    volumeKmsKeyID: <span class="token variable">\${AWS_KMS_KEY_ID}</span></span>
<span class="line">    disableIMDSv1: true</span>
<span class="line">secretsEncryption:</span>
<span class="line">  keyARN: <span class="token variable">\${AWS_KMS_KEY_ARN}</span></span>
<span class="line">gitops:</span>
<span class="line">  flux:</span>
<span class="line">    gitProvider: github</span>
<span class="line">    flags:</span>
<span class="line">      owner: &quot;<span class="token variable">\${GITHUB_USER}</span>&quot;</span>
<span class="line">      repository: &quot;<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>&quot;</span>
<span class="line">      personal: &quot;true&quot;</span>
<span class="line">      private: &quot;false&quot;</span>
<span class="line">      branch: &quot;main&quot;</span>
<span class="line">      path: &quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span>
<span class="line">EOF</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;<span class="token variable">\${KUBECONFIG}</span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  <span class="token keyword">if</span> <span class="token operator">!</span> eksctl get clusters <span class="token parameter variable">--name</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">    eksctl create cluster --config-file <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/eksctl-<span class="token variable">\${CLUSTER_NAME}</span>.yaml&quot;</span> <span class="token parameter variable">--kubeconfig</span> <span class="token string">&quot;<span class="token variable">\${KUBECONFIG}</span>&quot;</span></span>
<span class="line">  <span class="token keyword">else</span></span>
<span class="line">    eksctl utils write-kubeconfig <span class="token parameter variable">--cluster</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token parameter variable">--kubeconfig</span> <span class="token string">&quot;<span class="token variable">\${KUBECONFIG}</span>&quot;</span></span>
<span class="line">  <span class="token keyword">fi</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Add add the user or role to the aws-auth ConfigMap. This is handy if you are using different user for CLI operations and different user/role for accessing the AWS Console to see EKS Workloads in Cluster&#39;s tab.</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token parameter variable">-n</span> <span class="token variable">\${AWS_CONSOLE_ADMIN_ROLE_ARN+x}</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span> eksctl get iamidentitymapping <span class="token parameter variable">--cluster</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token parameter variable">--arn</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${AWS_CONSOLE_ADMIN_ROLE_ARN}</span>&quot;</span> <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  eksctl create iamidentitymapping <span class="token parameter variable">--cluster</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token parameter variable">--arn</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${AWS_CONSOLE_ADMIN_ROLE_ARN}</span>&quot;</span> <span class="token parameter variable">--group</span> system:masters <span class="token parameter variable">--username</span> admin</span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token parameter variable">-n</span> <span class="token variable">\${AWS_USER_ROLE_ARN+x}</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span> eksctl get iamidentitymapping <span class="token parameter variable">--cluster</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token parameter variable">--arn</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${AWS_USER_ROLE_ARN}</span>&quot;</span> <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  eksctl create iamidentitymapping <span class="token parameter variable">--cluster</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token parameter variable">--arn</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${AWS_USER_ROLE_ARN}</span>&quot;</span> <span class="token parameter variable">--group</span> system:masters <span class="token parameter variable">--username</span> admin</span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="post-installation-tasks" tabindex="-1"><a class="header-anchor" href="#post-installation-tasks"><span>Post installation tasks</span></a></h2><p>Change TTL=60 of SOA + NS records for new domain (it can not be done in CloudFormation):</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/route53-hostedzone-ttl.yml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">  aws cloudformation <span class="token function">wait</span> stack-create-complete --stack-name <span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>-route53&quot;</span></span>
<span class="line">  <span class="token assign-left variable">HOSTED_ZONE_ID</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>aws route53 list-hosted-zones <span class="token parameter variable">--query</span> <span class="token string">&quot;HostedZones[?Name==\\<span class="token variable"><span class="token variable">\`</span>$<span class="token punctuation">{</span>CLUSTER_FQDN<span class="token punctuation">}</span>.<span class="token punctuation">\\</span><span class="token variable">\`</span></span>].Id&quot;</span> <span class="token parameter variable">--output</span> text<span class="token variable">)</span></span></span>
<span class="line">  <span class="token assign-left variable">RESOURCE_RECORD_SET_SOA</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>aws route53 <span class="token parameter variable">--output</span> json list-resource-record-sets --hosted-zone-id <span class="token string">&quot;<span class="token variable">\${HOSTED_ZONE_ID}</span>&quot;</span> <span class="token parameter variable">--query</span> <span class="token string">&quot;(ResourceRecordSets[?Type == \\<span class="token variable"><span class="token variable">\`</span>SOA<span class="token punctuation">\\</span><span class="token variable">\`</span></span>])[0]&quot;</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">&quot;s/<span class="token entity" title="\\&quot;">\\&quot;</span>TTL<span class="token entity" title="\\&quot;">\\&quot;</span>:.*/<span class="token entity" title="\\&quot;">\\&quot;</span>TTL<span class="token entity" title="\\&quot;">\\&quot;</span>: 60,/&quot;</span><span class="token variable">)</span></span></span>
<span class="line">  <span class="token assign-left variable">RESOURCE_RECORD_SET_NS</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>aws route53 <span class="token parameter variable">--output</span> json list-resource-record-sets --hosted-zone-id <span class="token string">&quot;<span class="token variable">\${HOSTED_ZONE_ID}</span>&quot;</span> <span class="token parameter variable">--query</span> <span class="token string">&quot;(ResourceRecordSets[?Type == \\<span class="token variable"><span class="token variable">\`</span>NS<span class="token punctuation">\\</span><span class="token variable">\`</span></span>])[0]&quot;</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">&quot;s/<span class="token entity" title="\\&quot;">\\&quot;</span>TTL<span class="token entity" title="\\&quot;">\\&quot;</span>:.*/<span class="token entity" title="\\&quot;">\\&quot;</span>TTL<span class="token entity" title="\\&quot;">\\&quot;</span>: 60,/&quot;</span><span class="token variable">)</span></span></span>
<span class="line">  <span class="token function">cat</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF<span class="token bash punctuation"> <span class="token operator">|</span> jq <span class="token operator">&gt;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/route53-hostedzone-ttl.yml&quot;</span></span></span>
<span class="line">{</span>
<span class="line">    &quot;Comment&quot;: &quot;Update record to reflect new TTL for SOA and NS records&quot;,</span>
<span class="line">    &quot;Changes&quot;: [</span>
<span class="line">        {</span>
<span class="line">            &quot;Action&quot;: &quot;UPSERT&quot;,</span>
<span class="line">            &quot;ResourceRecordSet&quot;:</span>
<span class="line"><span class="token variable">\${RESOURCE_RECORD_SET_SOA}</span></span>
<span class="line">        },</span>
<span class="line">        {</span>
<span class="line">            &quot;Action&quot;: &quot;UPSERT&quot;,</span>
<span class="line">            &quot;ResourceRecordSet&quot;:</span>
<span class="line"><span class="token variable">\${RESOURCE_RECORD_SET_NS}</span></span>
<span class="line">        }</span>
<span class="line">    ]</span>
<span class="line">}</span>
<span class="line">EOF</span></span>
<span class="line">  aws route53 change-resource-record-sets <span class="token parameter variable">--output</span> json --hosted-zone-id <span class="token string">&quot;<span class="token variable">\${HOSTED_ZONE_ID}</span>&quot;</span> --change-batch<span class="token operator">=</span><span class="token string">&quot;file://tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/route53-hostedzone-ttl.yml&quot;</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,16);function m(b,k){const n=c("router-link");return r(),p("div",null,[d,s("nav",u,[s("ul",null,[s("li",null,[a(n,{to:"#create-route53"},{default:e(()=>[l("Create Route53")]),_:1})]),s("li",null,[a(n,{to:"#create-amazon-eks"},{default:e(()=>[l("Create Amazon EKS")]),_:1})]),s("li",null,[a(n,{to:"#post-installation-tasks"},{default:e(()=>[l("Post installation tasks")]),_:1})])])]),v])}const g=i(o,[["render",m],["__file","index.html.vue"]]),q=JSON.parse('{"path":"/part-02/","title":"Create additional AWS structure","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"Create Route53","slug":"create-route53","link":"#create-route53","children":[]},{"level":2,"title":"Create Amazon EKS","slug":"create-amazon-eks","link":"#create-amazon-eks","children":[]},{"level":2,"title":"Post installation tasks","slug":"post-installation-tasks","link":"#post-installation-tasks","children":[]}],"git":{"updatedTime":1719720548000},"filePathRelative":"part-02/README.md"}');export{g as comp,q as data};
