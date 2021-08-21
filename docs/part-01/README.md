# Create initial AWS structure

[[toc]]

## Requirements

If you would like to follow this documents and it's task you will need to set up
few environment variables.

The `LETSENCRYPT_ENVIRONMENT` variable should be one of:

* `staging` - Let’s Encrypt will create testing certificate (not valid)
* `production` - Let’s Encrypt will create valid certificate (use with care)

`BASE_DOMAIN` contains DNS records for all your Kubernetes clusters. The cluster
names will look like `CLUSTER_NAME`.`BASE_DOMAIN` (`kube1.k8s.mylabs.dev`).

```bash
# Hostname / FQDN definitions
export BASE_DOMAIN=${BASE_DOMAIN:-k8s.mylabs.dev}
export CLUSTER_NAME=${CLUSTER_NAME:-kube2}
export CLUSTER_FQDN="${CLUSTER_NAME}.${BASE_DOMAIN}"
export KUBECONFIG=${PWD}/tmp/${CLUSTER_FQDN}/kubeconfig-${CLUSTER_NAME}.conf
export MY_EMAIL="petr.ruzicka@gmail.com"
# Flux GitHub repository
export GITHUB_USER="ruzickap"
export GITHUB_FLUX_REPOSITORY="k8s-eks-flux-${CLUSTER_NAME}-repo"
# AWS Region
export AWS_DEFAULT_REGION="eu-west-1"
# Tags used to tag the AWS resources
export TAGS="Owner=${MY_EMAIL} Environment=Dev Group=Cloud_Native Squad=Cloud_Container_Platform"
echo -e "${MY_EMAIL} | ${CLUSTER_NAME} | ${BASE_DOMAIN} | ${CLUSTER_FQDN}\n${TAGS}"
```

You will need to configure AWS CLI: [https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)

```shell
export AWS_ACCESS_KEY_ID="AxxxxxxxxxxxxxxxxxxY"
export AWS_SECRET_ACCESS_KEY="txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxh"
```

Verify if all the necessary variables were set:

```bash
: "${AWS_ACCESS_KEY_ID?}"
: "${AWS_SECRET_ACCESS_KEY?}"
: "${GITHUB_TOKEN?}"
```

## Prepare the local working environment

::: tip
You can skip these steps if you have all the required software already
installed.
:::

Install necessary software:

```bash
if command -v apt-get &> /dev/null; then
  apt update -qq
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq curl git sudo unzip > /dev/null
fi
```

Install [AWS IAM Authenticator for Kubernetes](https://github.com/kubernetes-sigs/aws-iam-authenticator):

```bash
if ! command -v aws-iam-authenticator &> /dev/null; then
  # https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html
  sudo curl -s -Lo /usr/local/bin/aws-iam-authenticator "https://amazon-eks.s3.us-west-2.amazonaws.com/1.19.6/2021-01-05/bin/$(uname | sed "s/./\L&/g")/amd64/aws-iam-authenticator"
  sudo chmod a+x /usr/local/bin/aws-iam-authenticator
fi
```

Install [kubectl](https://github.com/kubernetes/kubectl) binary:

```bash
if ! command -v kubectl &> /dev/null; then
  # https://github.com/kubernetes/kubectl/releases
  sudo curl -s -Lo /usr/local/bin/kubectl "https://storage.googleapis.com/kubernetes-release/release/v1.21.1/bin/$(uname | sed "s/./\L&/g" )/amd64/kubectl"
  sudo chmod a+x /usr/local/bin/kubectl
fi
```

Install [eksctl](https://eksctl.io/):

```bash
if ! command -v eksctl &> /dev/null; then
  # https://github.com/weaveworks/eksctl/releases
  curl -s -L "https://github.com/weaveworks/eksctl/releases/download/0.62.0/eksctl_$(uname)_amd64.tar.gz" | sudo tar xz -C /usr/local/bin/
fi
```

Install [flux](https://toolkit.fluxcd.io/):

```bash
if ! command -v flux &> /dev/null; then
  curl -s https://fluxcd.io/install.sh | sudo bash
fi
```

## Configure AWS Route 53 Domain delegation

Create DNS zone (`BASE_DOMAIN`):

```shell
aws route53 create-hosted-zone --output json \
  --name "${BASE_DOMAIN}" \
  --caller-reference "$(date)" \
  --hosted-zone-config="{\"Comment\": \"Created by ${MY_EMAIL}\", \"PrivateZone\": false}" | jq
```

Use your domain registrar to change the nameservers for your zone (for example
`mylabs.dev`) to use the Amazon Route 53 nameservers. Here is the way how you
can find out the the Route 53 nameservers:

```shell
NEW_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name==\`${BASE_DOMAIN}.\`].Id" --output text)
NEW_ZONE_NS=$(aws route53 get-hosted-zone --output json --id "${NEW_ZONE_ID}" --query "DelegationSet.NameServers")
NEW_ZONE_NS1=$(echo "${NEW_ZONE_NS}" | jq -r ".[0]")
NEW_ZONE_NS2=$(echo "${NEW_ZONE_NS}" | jq -r ".[1]")
```

Create the NS record in `k8s.mylabs.dev` (`BASE_DOMAIN`) for proper zone
delegation. This step depends on your domain registrar - I'm using CloudFlare
and using Ansible to automate it:

```shell
ansible -m cloudflare_dns -c local -i "localhost," localhost -a "zone=mylabs.dev record=${BASE_DOMAIN} type=NS value=${NEW_ZONE_NS1} solo=true proxied=no account_email=${CLOUDFLARE_EMAIL} account_api_token=${CLOUDFLARE_API_KEY}"
ansible -m cloudflare_dns -c local -i "localhost," localhost -a "zone=mylabs.dev record=${BASE_DOMAIN} type=NS value=${NEW_ZONE_NS2} solo=false proxied=no account_email=${CLOUDFLARE_EMAIL} account_api_token=${CLOUDFLARE_API_KEY}"
```

Output:

```text
localhost | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": true,
    "result": {
        "record": {
            "content": "ns-885.awsdns-46.net",
            "created_on": "2020-11-13T06:25:32.18642Z",
            "id": "dxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxb",
            "locked": false,
            "meta": {
                "auto_added": false,
                "managed_by_apps": false,
                "managed_by_argo_tunnel": false,
                "source": "primary"
            },
            "modified_on": "2020-11-13T06:25:32.18642Z",
            "name": "k8s.mylabs.dev",
            "proxiable": false,
            "proxied": false,
            "ttl": 1,
            "type": "NS",
            "zone_id": "2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxe",
            "zone_name": "mylabs.dev"
        }
    }
}
localhost | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": true,
    "result": {
        "record": {
            "content": "ns-1692.awsdns-19.co.uk",
            "created_on": "2020-11-13T06:25:37.605605Z",
            "id": "9xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxb",
            "locked": false,
            "meta": {
                "auto_added": false,
                "managed_by_apps": false,
                "managed_by_argo_tunnel": false,
                "source": "primary"
            },
            "modified_on": "2020-11-13T06:25:37.605605Z",
            "name": "k8s.mylabs.dev",
            "proxiable": false,
            "proxied": false,
            "ttl": 1,
            "type": "NS",
            "zone_id": "2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxe",
            "zone_name": "mylabs.dev"
        }
    }
}
```
