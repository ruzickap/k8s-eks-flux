import{_ as r,r as l,o as c,c as p,a as s,b as a,w as t,d as n,e as o}from"./app-CPf3PThy.js";const d={},u=s("h1",{id:"create-additional-aws-structure",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#create-additional-aws-structure"},[s("span",null,"Create additional AWS structure")])],-1),v={class:"table-of-contents"},m=o(`<h2 id="create-route53" tabindex="-1"><a class="header-anchor" href="#create-route53"><span>Create Route53</span></a></h2><p>Create CloudFormation template containing policies for Route53, S3 access (Harbor, Velero) and Domain.</p><p>Put new domain <code>CLUSTER_FQDN</code> to the Route 53 and configure the DNS delegation from the <code>BASE_DOMAIN</code>.</p><p>Create Route53 zone:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/cf-route53.yml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
AWSTemplateFormatVersion: <span class="token number">2010</span>-09-09
Description: Route53 entries

Parameters:

  BaseDomain:
    Description: <span class="token string">&quot;Base domain where cluster domains + their subdomains will live. Ex: k8s.mylabs.dev&quot;</span>
    Type: String

  ClusterFQDN:
    Description: <span class="token string">&quot;Cluster FQDN. (domain for all applications) Ex: kube1.k8s.mylabs.dev&quot;</span>
    Type: String

Resources:

  HostedZone:
    Type: AWS::Route53::HostedZone
    Properties:
      Name: <span class="token operator">!</span>Ref ClusterFQDN

  RecordSet:
    Type: AWS::Route53::RecordSet
    Properties:
      HostedZoneName: <span class="token operator">!</span>Sub <span class="token string">&quot;<span class="token variable">\${BaseDomain}</span>.&quot;</span>
      Name: <span class="token operator">!</span>Ref ClusterFQDN
      Type: NS
      TTL: <span class="token number">60</span>
      ResourceRecords: <span class="token operator">!</span>GetAtt HostedZone.NameServers

  S3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      AccessControl: Private
      BucketName: <span class="token operator">!</span>Sub <span class="token string">&quot;<span class="token variable">\${ClusterFQDN}</span>&quot;</span>
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
EOF

<span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token variable"><span class="token variable">$(</span>aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE <span class="token parameter variable">--query</span> <span class="token string">&quot;StackSummaries[?starts_with(StackName, \\<span class="token variable"><span class="token variable">\`</span>$<span class="token punctuation">{</span>CLUSTER_NAME<span class="token punctuation">}</span>-route53<span class="token punctuation">\\</span><span class="token variable">\`</span></span>) == \\<span class="token variable"><span class="token variable">\`</span>true<span class="token punctuation">\\</span><span class="token variable">\`</span></span>].StackName&quot;</span> <span class="token parameter variable">--output</span> text<span class="token variable">)</span></span> <span class="token operator">==</span> <span class="token string">&quot;&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
  <span class="token comment"># shellcheck disable=SC2001</span>
  <span class="token builtin class-name">eval</span> aws cloudformation <span class="token string">&quot;create-stack&quot;</span> <span class="token punctuation">\\</span>
    <span class="token parameter variable">--parameters</span> <span class="token string">&quot;ParameterKey=BaseDomain,ParameterValue=<span class="token variable">\${BASE_DOMAIN}</span> ParameterKey=ClusterFQDN,ParameterValue=<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span> <span class="token punctuation">\\</span>
    --stack-name <span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>-route53&quot;</span> <span class="token punctuation">\\</span>
    --template-body <span class="token string">&quot;file://tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/cf-route53.yml&quot;</span> <span class="token punctuation">\\</span>
    <span class="token parameter variable">--tags</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">\${TAGS}</span>&quot;</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token parameter variable">-e</span> <span class="token string">&#39;s/\\([^ =]*\\)=\\([^ ]*\\)/Key=\\1,Value=\\2/g&#39;</span><span class="token variable">)</span></span>&quot;</span> <span class="token operator">||</span> <span class="token boolean">true</span>
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="create-amazon-eks" tabindex="-1"><a class="header-anchor" href="#create-amazon-eks"><span>Create Amazon EKS</span></a></h2><p><img src="https://raw.githubusercontent.com/aws-samples/eks-workshop/65b766c494a5b4f5420b2912d8373c4957163541/static/images/3-service-animated.gif" alt="EKS" title="EKS"></p>`,7),b={href:"https://aws.amazon.com/eks/",target:"_blank",rel:"noopener noreferrer"},k={href:"https://eksctl.io/",target:"_blank",rel:"noopener noreferrer"},S=o(`<p><img src="https://raw.githubusercontent.com/weaveworks/eksctl/c365149fc1a0b8d357139cbd6cda5aee8841c16c/logo/eksctl.png" alt="eksctl" title="eksctl"></p><p>Create the Amazon EKS cluster with Calico using <code>eksctl</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/eksctl-<span class="token variable">\${CLUSTER_NAME}</span>.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: <span class="token variable">\${CLUSTER_NAME}</span>
  region: <span class="token variable">\${AWS_DEFAULT_REGION}</span>
  version: &quot;1.21&quot;
  tags: &amp;tags
<span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">\${TAGS}</span>&quot;</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">&quot;s/ /<span class="token entity" title="\\\\">\\\\</span>n    /g; s/^/    /g; s/=/: /g&quot;</span><span class="token variable">)</span></span>
iam:
  withOIDC: true
  serviceAccounts:
    - metadata:
        name: aws-load-balancer-controller
        namespace: aws-load-balancer
      wellKnownPolicies:
        awsLoadBalancerController: true
    - metadata:
        name: cert-manager
        namespace: cert-manager
      wellKnownPolicies:
        certManager: true
    - metadata:
        name: cluster-autoscaler
        namespace: cluster-autoscaler
      wellKnownPolicies:
        autoScaler: true
    - metadata:
        name: external-dns
        namespace: external-dns
      wellKnownPolicies:
        externalDNS: true
    - metadata:
        name: ebs-csi-controller-sa
        namespace: aws-ebs-csi-driver
      wellKnownPolicies:
        ebsCSIController: true
    - metadata:
        name: efs-csi-controller-sa
        namespace: aws-efs-csi-driver
      wellKnownPolicies:
        efsCSIController: true
    - metadata:
        name: kustomize-controller
        namespace: flux-system
      attachPolicy:
        Version: 2012-10-17
        Statement:
        - Sid: FluxKMS
          Effect: Allow
          Action:
            - kms:Encrypt
            - kms:Decrypt
            - kms:ReEncrypt*
            - kms:GenerateDataKey*
            - kms:DescribeKey
          Resource:
          - <span class="token variable">\${AWS_KMS_KEY_ARN}</span>
    - metadata:
        name: kuard-sa
        namespace: kuard
      attachPolicy:
        Version: 2012-10-17
        Statement:
        - Sid: AllowSecretManagerAccess
          Effect: Allow
          Action:
          - secretsmanager:GetSecretValue
          Resource:
          - arn:*:secretsmanager:*:*:secret:*
        - Sid: AllowKMSAccess
          Effect: Allow
          Action:
          - kms:Decrypt
          Resource:
          - <span class="token variable">\${AWS_KMS_KEY_ARN}</span>
          Condition:
            StringLike:
              kms:ViaService:
                - secretsmanager.*.amazonaws.com
    - metadata:
        name: velero
        namespace: velero
      attachPolicy:
        Version: 2012-10-17
        Statement:
        - Effect: Allow
          Action:
          - s3:ListBucket
          Resource:
          - arn:aws:s3:::<span class="token variable">\${CLUSTER_FQDN}</span>
        - Effect: Allow
          Action:
          - s3:PutObject
          - s3:GetObject
          - s3:DeleteObject
          - s3:ListMultipartUploadParts
          - s3:AbortMultipartUpload
          Resource:
          - arn:aws:s3:::<span class="token variable">\${CLUSTER_FQDN}</span>/*
vpc:
  id: &quot;<span class="token variable">\${AWS_VPC_ID}</span>&quot;
  subnets:
    private:
      <span class="token variable">\${AWS_DEFAULT_REGION}</span>a:
          id: &quot;<span class="token variable">\${AWS_PRIVATESUBNETID1}</span>&quot;
      <span class="token variable">\${AWS_DEFAULT_REGION}</span>b:
          id: &quot;<span class="token variable">\${AWS_PRIVATESUBNETID2}</span>&quot;
    public:
      <span class="token variable">\${AWS_DEFAULT_REGION}</span>a:
          id: &quot;<span class="token variable">\${AWS_PUBLICSUBNETID1}</span>&quot;
      <span class="token variable">\${AWS_DEFAULT_REGION}</span>b:
          id: &quot;<span class="token variable">\${AWS_PUBLICSUBNETID2}</span>&quot;
managedNodeGroups:
  - name: managed-ng-1
    amiFamily: Bottlerocket
    instanceType: t3.large
    desiredCapacity: 3
    minSize: 2
    maxSize: 5
    volumeSize: 30
    tags:
      &lt;&lt;: *tags
      compliance:na:defender: bottlerocket
    volumeEncrypted: true
    volumeKmsKeyID: <span class="token variable">\${AWS_KMS_KEY_ID}</span>
    disableIMDSv1: true
secretsEncryption:
  keyARN: <span class="token variable">\${AWS_KMS_KEY_ARN}</span>
gitops:
  flux:
    gitProvider: github
    flags:
      owner: &quot;<span class="token variable">\${GITHUB_USER}</span>&quot;
      repository: &quot;<span class="token variable">\${GITHUB_FLUX_REPOSITORY}</span>&quot;
      personal: &quot;true&quot;
      private: &quot;false&quot;
      branch: &quot;main&quot;
      path: &quot;clusters/<span class="token variable">\${ENVIRONMENT}</span>/<span class="token variable">\${CLUSTER_FQDN}</span>&quot;
EOF</span>

<span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;<span class="token variable">\${KUBECONFIG}</span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
  <span class="token keyword">if</span> <span class="token operator">!</span> eksctl get clusters <span class="token parameter variable">--name</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span>
    eksctl create cluster --config-file <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/eksctl-<span class="token variable">\${CLUSTER_NAME}</span>.yaml&quot;</span> <span class="token parameter variable">--kubeconfig</span> <span class="token string">&quot;<span class="token variable">\${KUBECONFIG}</span>&quot;</span>
  <span class="token keyword">else</span>
    eksctl utils write-kubeconfig <span class="token parameter variable">--cluster</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token parameter variable">--kubeconfig</span> <span class="token string">&quot;<span class="token variable">\${KUBECONFIG}</span>&quot;</span>
  <span class="token keyword">fi</span>
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Add add the user or role to the aws-auth ConfigMap. This is handy if you are using different user for CLI operations and different user/role for accessing the AWS Console to see EKS Workloads in Cluster&#39;s tab.</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token parameter variable">-n</span> <span class="token variable">\${AWS_CONSOLE_ADMIN_ROLE_ARN+x}</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span> eksctl get iamidentitymapping <span class="token parameter variable">--cluster</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token parameter variable">--arn</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${AWS_CONSOLE_ADMIN_ROLE_ARN}</span>&quot;</span> <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span>
  eksctl create iamidentitymapping <span class="token parameter variable">--cluster</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token parameter variable">--arn</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${AWS_CONSOLE_ADMIN_ROLE_ARN}</span>&quot;</span> <span class="token parameter variable">--group</span> system:masters <span class="token parameter variable">--username</span> admin
<span class="token keyword">fi</span>

<span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token parameter variable">-n</span> <span class="token variable">\${AWS_USER_ROLE_ARN+x}</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span> eksctl get iamidentitymapping <span class="token parameter variable">--cluster</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token parameter variable">--arn</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${AWS_USER_ROLE_ARN}</span>&quot;</span> <span class="token operator">&amp;&gt;</span> /dev/null<span class="token punctuation">;</span> <span class="token keyword">then</span>
  eksctl create iamidentitymapping <span class="token parameter variable">--cluster</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token parameter variable">--arn</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${AWS_USER_ROLE_ARN}</span>&quot;</span> <span class="token parameter variable">--group</span> system:masters <span class="token parameter variable">--username</span> admin
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="post-installation-tasks" tabindex="-1"><a class="header-anchor" href="#post-installation-tasks"><span>Post installation tasks</span></a></h2><p>Change TTL=60 of SOA + NS records for new domain (it can not be done in CloudFormation):</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-s</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/route53-hostedzone-ttl.yml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
  aws cloudformation <span class="token function">wait</span> stack-create-complete --stack-name <span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>-route53&quot;</span>
  <span class="token assign-left variable">HOSTED_ZONE_ID</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>aws route53 list-hosted-zones <span class="token parameter variable">--query</span> <span class="token string">&quot;HostedZones[?Name==\\<span class="token variable"><span class="token variable">\`</span>$<span class="token punctuation">{</span>CLUSTER_FQDN<span class="token punctuation">}</span>.<span class="token punctuation">\\</span><span class="token variable">\`</span></span>].Id&quot;</span> <span class="token parameter variable">--output</span> text<span class="token variable">)</span></span>
  <span class="token assign-left variable">RESOURCE_RECORD_SET_SOA</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>aws route53 <span class="token parameter variable">--output</span> json list-resource-record-sets --hosted-zone-id <span class="token string">&quot;<span class="token variable">\${HOSTED_ZONE_ID}</span>&quot;</span> <span class="token parameter variable">--query</span> <span class="token string">&quot;(ResourceRecordSets[?Type == \\<span class="token variable"><span class="token variable">\`</span>SOA<span class="token punctuation">\\</span><span class="token variable">\`</span></span>])[0]&quot;</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">&quot;s/<span class="token entity" title="\\&quot;">\\&quot;</span>TTL<span class="token entity" title="\\&quot;">\\&quot;</span>:.*/<span class="token entity" title="\\&quot;">\\&quot;</span>TTL<span class="token entity" title="\\&quot;">\\&quot;</span>: 60,/&quot;</span><span class="token variable">)</span></span>
  <span class="token assign-left variable">RESOURCE_RECORD_SET_NS</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>aws route53 <span class="token parameter variable">--output</span> json list-resource-record-sets --hosted-zone-id <span class="token string">&quot;<span class="token variable">\${HOSTED_ZONE_ID}</span>&quot;</span> <span class="token parameter variable">--query</span> <span class="token string">&quot;(ResourceRecordSets[?Type == \\<span class="token variable"><span class="token variable">\`</span>NS<span class="token punctuation">\\</span><span class="token variable">\`</span></span>])[0]&quot;</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">&quot;s/<span class="token entity" title="\\&quot;">\\&quot;</span>TTL<span class="token entity" title="\\&quot;">\\&quot;</span>:.*/<span class="token entity" title="\\&quot;">\\&quot;</span>TTL<span class="token entity" title="\\&quot;">\\&quot;</span>: 60,/&quot;</span><span class="token variable">)</span></span>
  <span class="token function">cat</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF<span class="token bash punctuation"> <span class="token operator">|</span> jq <span class="token operator">&gt;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/route53-hostedzone-ttl.yml&quot;</span></span>
{
    &quot;Comment&quot;: &quot;Update record to reflect new TTL for SOA and NS records&quot;,
    &quot;Changes&quot;: [
        {
            &quot;Action&quot;: &quot;UPSERT&quot;,
            &quot;ResourceRecordSet&quot;:
<span class="token variable">\${RESOURCE_RECORD_SET_SOA}</span>
        },
        {
            &quot;Action&quot;: &quot;UPSERT&quot;,
            &quot;ResourceRecordSet&quot;:
<span class="token variable">\${RESOURCE_RECORD_SET_NS}</span>
        }
    ]
}
EOF</span>
  aws route53 change-resource-record-sets <span class="token parameter variable">--output</span> json --hosted-zone-id <span class="token string">&quot;<span class="token variable">\${HOSTED_ZONE_ID}</span>&quot;</span> --change-batch<span class="token operator">=</span><span class="token string">&quot;file://tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/route53-hostedzone-ttl.yml&quot;</span>
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8);function q(E,g){const e=l("router-link"),i=l("ExternalLinkIcon");return c(),p("div",null,[u,s("nav",v,[s("ul",null,[s("li",null,[a(e,{to:"#create-route53"},{default:t(()=>[n("Create Route53")]),_:1})]),s("li",null,[a(e,{to:"#create-amazon-eks"},{default:t(()=>[n("Create Amazon EKS")]),_:1})]),s("li",null,[a(e,{to:"#post-installation-tasks"},{default:t(()=>[n("Post installation tasks")]),_:1})])])]),m,s("p",null,[n("Create "),s("a",b,[n("Amazon EKS"),a(i)]),n(" in AWS by using "),s("a",k,[n("eksctl"),a(i)]),n(".")]),S])}const h=r(d,[["render",q],["__file","index.html.vue"]]),R=JSON.parse('{"path":"/part-02/","title":"Create additional AWS structure","lang":"en-US","frontmatter":{},"headers":[{"level":2,"title":"Create Route53","slug":"create-route53","link":"#create-route53","children":[]},{"level":2,"title":"Create Amazon EKS","slug":"create-amazon-eks","link":"#create-amazon-eks","children":[]},{"level":2,"title":"Post installation tasks","slug":"post-installation-tasks","link":"#post-installation-tasks","children":[]}],"git":{"updatedTime":1711264771000},"filePathRelative":"part-02/README.md"}');export{h as comp,R as data};
