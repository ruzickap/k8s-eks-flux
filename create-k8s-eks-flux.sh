#!/usr/bin/env bash

if [ -n "${GITHUB_TOKEN_K8S_EKS+x}" ]; then
  export GITHUB_TOKEN="${GITHUB_TOKEN_K8S_EKS}"
fi

set -euo pipefail

sed -n "/^\`\`\`bash.*/,/^\`\`\`$/p" docs/part-??/README.md | sed "/^\`\`\`*/d" | bash -euxo pipefail
