#!/usr/bin/env bash

if [ -n "${GH_TOKEN_K8S_EKS+x}" ]; then
  export GITHUB_TOKEN="${GH_TOKEN_K8S_EKS}"
fi

set -euo pipefail

if [ "$#" -eq 0 ]; then
  sed -n "/^\`\`\`bash.*/,/^\`\`\`$/p" docs/part-??/README.md docs/part-workloads-??/README.md | sed "/^\`\`\`*/d" | bash -euxo pipefail
else
  sed -n "/^\`\`\`bash.*/,/^\`\`\`$/p" docs/part-??/README.md docs/part-workloads-??/README.md | sed "/^\`\`\`*/d"
fi
