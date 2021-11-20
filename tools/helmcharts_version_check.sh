#!/usr/bin/env bash

set -euo pipefail

test -d tools || ( echo -e "\n*** Run in top level of git repository\n"; exit 1 )

eval "$(sed -n '/^declare -A HELMREPOSITORIES/,/)/p' docs/part-03/README.md)"

for HELMREPOSITORY in "${!HELMREPOSITORIES[@]}"; do
  if [[ ! -f "${HOME}/Library/Caches/helm/repository/${HELMREPOSITORY}-charts.txt" ]] ; then
    helm repo add "${HELMREPOSITORY}" "${HELMREPOSITORIES[${HELMREPOSITORY}]}"
  fi
done

helm repo update

while IFS= read -r HELM_LINE ; do
  HELM_REPOSITORY_NAME=$( echo "${HELM_LINE}" | awk -F'[/.]' '/--source=/ { print $2 }' )
  if [[ -n "${HELM_REPOSITORY_NAME}" ]]; then
    echo -n "* ${HELM_REPOSITORY_NAME} | " >&2
    HELM_REPOSITORY_NAMES+=("${HELM_REPOSITORY_NAME}")
  fi

  HELM_CHART_NAME=$( echo "${HELM_LINE}" | awk -F \" '/--chart=/ { print $2 }' )
  if [[ -n "${HELM_CHART_NAME}" ]]; then
    echo -n "${HELM_CHART_NAME} | " >&2
    HELM_CHART_NAMES+=("${HELM_CHART_NAME}")
  fi

  HELM_CHART_VERSION=$( echo "${HELM_LINE}" | awk -F \" '/--chart-version=/ { print $2 }' )
  if [[ -n "${HELM_CHART_VERSION}" ]]; then
    echo "${HELM_CHART_VERSION}" >&2
    HELM_CHART_VERSIONS+=("${HELM_CHART_VERSION}")
  fi
done < <(grep -R --no-filename -A7 '^flux create helmrelease' docs/part*)

echo "--------------------------------------------------------------------------------"

(
for i in "${!HELM_CHART_NAMES[@]}"; do
  helm search repo "${HELM_REPOSITORY_NAMES[i]}/${HELM_CHART_NAMES[i]}" --output json > /tmp/latest_helm_chart
  LATEST_HELM_CHART_VERSION=$(jq -r ".[0].version" /tmp/latest_helm_chart)
  LATEST_HELM_CHART_APP_VERSION=$(jq -r ".[0].app_version" /tmp/latest_helm_chart)
  if [[ "${LATEST_HELM_CHART_VERSION}" != "${HELM_CHART_VERSIONS[i]}" ]]; then
    echo "chart=\"${HELM_CHART_NAMES[i]}\" ; Current: ${HELM_CHART_VERSIONS[i]} ; Latest version: ${LATEST_HELM_CHART_VERSION} (${LATEST_HELM_CHART_APP_VERSION})"
  fi
done
) | column -s \; -t
