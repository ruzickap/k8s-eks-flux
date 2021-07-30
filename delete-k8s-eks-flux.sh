#!/usr/bin/env bash

set -euo pipefail

sed -n "/^\`\`\`bash.*/,/^\`\`\`$/p" docs/part-cleanup/README.md | sed "/^\`\`\`*/d" | bash -euxo pipefail
