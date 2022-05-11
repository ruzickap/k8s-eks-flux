import{_ as o,r as l,o as c,c as i,a as s,b as a,w as p,F as u,d as n,e as r}from"./app.36393f6e.js";const b={},m=s("h1",{id:"create-additional-aws-structure",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#create-additional-aws-structure","aria-hidden":"true"},"#"),n(" Create additional AWS structure")],-1),k={class:"table-of-contents"},d=n("Create Route53"),S=n("Create Amazon EKS"),_=n("Post installation tasks"),q=r(`<h2 id="create-route53" tabindex="-1"><a class="header-anchor" href="#create-route53" aria-hidden="true">#</a> Create Route53</h2><p>Create CloudFormation template containing policies for Route53, S3 access (Harbor, Velero) and Domain.</p><p>Put new domain <code>CLUSTER_FQDN</code> to the Route 53 and configure the DNS delegation from the <code>BASE_DOMAIN</code>.</p><p>Create Route53 zone:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/cf-route53.yml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token punctuation">\\</span>EOF
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

<span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token variable"><span class="token variable">$(</span>aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE --query <span class="token string">&quot;StackSummaries[?starts_with(StackName, \\<span class="token variable"><span class="token variable">\`</span>$<span class="token punctuation">{</span>CLUSTER_NAME<span class="token punctuation">}</span>-route53<span class="token punctuation">\\</span><span class="token variable">\`</span></span>) == \\<span class="token variable"><span class="token variable">\`</span>true<span class="token punctuation">\\</span><span class="token variable">\`</span></span>].StackName&quot;</span> --output text<span class="token variable">)</span></span> <span class="token operator">==</span> <span class="token string">&quot;&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
  <span class="token comment"># shellcheck disable=SC2001</span>
  <span class="token builtin class-name">eval</span> aws cloudformation <span class="token string">&quot;create-stack&quot;</span> <span class="token punctuation">\\</span>
    --parameters <span class="token string">&quot;ParameterKey=BaseDomain,ParameterValue=<span class="token variable">\${BASE_DOMAIN}</span> ParameterKey=ClusterFQDN,ParameterValue=<span class="token variable">\${CLUSTER_FQDN}</span>&quot;</span> <span class="token punctuation">\\</span>
    --stack-name <span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>-route53&quot;</span> <span class="token punctuation">\\</span>
    --template-body <span class="token string">&quot;file://tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/cf-route53.yml&quot;</span> <span class="token punctuation">\\</span>
    --tags <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">\${TAGS}</span>&quot;</span> <span class="token operator">|</span> <span class="token function">sed</span>  -e <span class="token string">&#39;s/\\([^ =]*\\)=\\([^ ]*\\)/Key=\\1,Value=\\2/g&#39;</span><span class="token variable">)</span></span>&quot;</span> <span class="token operator">||</span> <span class="token boolean">true</span>
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br></div></div><h2 id="create-amazon-eks" tabindex="-1"><a class="header-anchor" href="#create-amazon-eks" aria-hidden="true">#</a> Create Amazon EKS</h2><p><img src="https://raw.githubusercontent.com/aws-samples/eks-workshop/65b766c494a5b4f5420b2912d8373c4957163541/static/images/3-service-animated.gif" alt="EKS" title="EKS"></p>`,7),v=n("Create "),E={href:"https://aws.amazon.com/eks/",target:"_blank",rel:"noopener noreferrer"},g=n("Amazon EKS"),h=n(" in AWS by using "),R={href:"https://eksctl.io/",target:"_blank",rel:"noopener noreferrer"},A=n("eksctl"),f=n("."),N=r(`<p><img src="https://raw.githubusercontent.com/weaveworks/eksctl/c365149fc1a0b8d357139cbd6cda5aee8841c16c/logo/eksctl.png" alt="eksctl" title="eksctl"></p><p>Create the Amazon EKS cluster with Calico using <code>eksctl</code>:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">&gt;</span> <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/eksctl-<span class="token variable">\${CLUSTER_NAME}</span>.yaml&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
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

<span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;<span class="token variable">\${KUBECONFIG}</span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token punctuation">;</span> <span class="token keyword">then</span>
  <span class="token keyword">if</span>  <span class="token operator">!</span> eksctl get clusters --name<span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> <span class="token operator">&amp;&gt;</span> /dev/null <span class="token punctuation">;</span> <span class="token keyword">then</span>
    eksctl create cluster --config-file <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/eksctl-<span class="token variable">\${CLUSTER_NAME}</span>.yaml&quot;</span> --kubeconfig <span class="token string">&quot;<span class="token variable">\${KUBECONFIG}</span>&quot;</span>
  <span class="token keyword">else</span>
    eksctl utils write-kubeconfig --cluster<span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> --kubeconfig <span class="token string">&quot;<span class="token variable">\${KUBECONFIG}</span>&quot;</span>
  <span class="token keyword">fi</span>
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br><span class="line-number">126</span><br><span class="line-number">127</span><br><span class="line-number">128</span><br><span class="line-number">129</span><br><span class="line-number">130</span><br><span class="line-number">131</span><br><span class="line-number">132</span><br><span class="line-number">133</span><br><span class="line-number">134</span><br><span class="line-number">135</span><br><span class="line-number">136</span><br><span class="line-number">137</span><br><span class="line-number">138</span><br><span class="line-number">139</span><br><span class="line-number">140</span><br><span class="line-number">141</span><br><span class="line-number">142</span><br><span class="line-number">143</span><br><span class="line-number">144</span><br><span class="line-number">145</span><br><span class="line-number">146</span><br><span class="line-number">147</span><br><span class="line-number">148</span><br></div></div><p>Add add the user or role to the aws-auth ConfigMap. This is handy if you are using different user for CLI operations and different user/role for accessing the AWS Console to see EKS Workloads in Cluster&#39;s tab.</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> -n <span class="token variable">\${AWS_CONSOLE_ADMIN_ROLE_ARN+x}</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span> eksctl get iamidentitymapping --cluster<span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> --arn<span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${AWS_CONSOLE_ADMIN_ROLE_ARN}</span>&quot;</span> <span class="token operator">&amp;&gt;</span> /dev/null <span class="token punctuation">;</span> <span class="token keyword">then</span>
  eksctl create iamidentitymapping --cluster<span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> --arn<span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${AWS_CONSOLE_ADMIN_ROLE_ARN}</span>&quot;</span> --group system:masters --username admin
<span class="token keyword">fi</span>

<span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> -n <span class="token variable">\${AWS_USER_ROLE_ARN+x}</span> <span class="token punctuation">]</span><span class="token punctuation">]</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span> eksctl get iamidentitymapping --cluster<span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> --arn<span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${AWS_USER_ROLE_ARN}</span>&quot;</span> <span class="token operator">&amp;&gt;</span> /dev/null <span class="token punctuation">;</span> <span class="token keyword">then</span>
  eksctl create iamidentitymapping --cluster<span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>&quot;</span> --arn<span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${AWS_USER_ROLE_ARN}</span>&quot;</span> --group system:masters --username admin
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h2 id="post-installation-tasks" tabindex="-1"><a class="header-anchor" href="#post-installation-tasks" aria-hidden="true">#</a> Post installation tasks</h2><p>Change TTL=60 of SOA + NS records for new domain (it can not be done in CloudFormation):</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token keyword">if</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> <span class="token operator">!</span> -s <span class="token string">&quot;tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/route53-hostedzone-ttl.yml&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
  aws cloudformation <span class="token function">wait</span> stack-create-complete --stack-name <span class="token string">&quot;<span class="token variable">\${CLUSTER_NAME}</span>-route53&quot;</span>
  <span class="token assign-left variable">HOSTED_ZONE_ID</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>aws route53 list-hosted-zones --query <span class="token string">&quot;HostedZones[?Name==\\<span class="token variable"><span class="token variable">\`</span>$<span class="token punctuation">{</span>CLUSTER_FQDN<span class="token punctuation">}</span>.<span class="token punctuation">\\</span><span class="token variable">\`</span></span>].Id&quot;</span> --output text<span class="token variable">)</span></span>
  <span class="token assign-left variable">RESOURCE_RECORD_SET_SOA</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>aws route53 --output json list-resource-record-sets --hosted-zone-id <span class="token string">&quot;<span class="token variable">\${HOSTED_ZONE_ID}</span>&quot;</span> --query <span class="token string">&quot;(ResourceRecordSets[?Type == \\<span class="token variable"><span class="token variable">\`</span>SOA<span class="token punctuation">\\</span><span class="token variable">\`</span></span>])[0]&quot;</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">&quot;s/<span class="token entity" title="\\&quot;">\\&quot;</span>TTL<span class="token entity" title="\\&quot;">\\&quot;</span>:.*/<span class="token entity" title="\\&quot;">\\&quot;</span>TTL<span class="token entity" title="\\&quot;">\\&quot;</span>: 60,/&quot;</span><span class="token variable">)</span></span>
  <span class="token assign-left variable">RESOURCE_RECORD_SET_NS</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>aws route53 --output json list-resource-record-sets --hosted-zone-id <span class="token string">&quot;<span class="token variable">\${HOSTED_ZONE_ID}</span>&quot;</span> --query <span class="token string">&quot;(ResourceRecordSets[?Type == \\<span class="token variable"><span class="token variable">\`</span>NS<span class="token punctuation">\\</span><span class="token variable">\`</span></span>])[0]&quot;</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">&quot;s/<span class="token entity" title="\\&quot;">\\&quot;</span>TTL<span class="token entity" title="\\&quot;">\\&quot;</span>:.*/<span class="token entity" title="\\&quot;">\\&quot;</span>TTL<span class="token entity" title="\\&quot;">\\&quot;</span>: 60,/&quot;</span><span class="token variable">)</span></span>
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
  aws route53 change-resource-record-sets --output json --hosted-zone-id <span class="token string">&quot;<span class="token variable">\${HOSTED_ZONE_ID}</span>&quot;</span> --change-batch<span class="token operator">=</span><span class="token string">&quot;file://tmp/<span class="token variable">\${CLUSTER_FQDN}</span>/route53-hostedzone-ttl.yml&quot;</span>
<span class="token keyword">fi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div>`,8);function y(C,T){const e=l("RouterLink"),t=l("ExternalLinkIcon");return c(),i(u,null,[m,s("nav",k,[s("ul",null,[s("li",null,[a(e,{to:"#create-route53"},{default:p(()=>[d]),_:1})]),s("li",null,[a(e,{to:"#create-amazon-eks"},{default:p(()=>[S]),_:1})]),s("li",null,[a(e,{to:"#post-installation-tasks"},{default:p(()=>[_]),_:1})])])]),q,s("p",null,[v,s("a",E,[g,a(t)]),h,s("a",R,[A,a(t)]),f]),N],64)}var $=o(b,[["render",y],["__file","index.html.vue"]]);export{$ as default};
