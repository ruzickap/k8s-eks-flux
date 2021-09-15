#!/usr/bin/env bash

set -eu

test -d tools || ( echo -e "\n*** Run in top level of git repository\n"; exit 1 )

(
while IFS= read -r HELM_LINE ; do
  echo "* ${HELM_LINE}" >&2
  HELM_REPOSITORY_NAME=$( echo "${HELM_LINE}" | cut -f 3 -d " ")
  HELM_REPOSITORY_URL=$( echo "${HELM_LINE}" | cut -f 5 -d " ")
  HELM_CHART_NAME=$( echo "${HELM_LINE}" | cut -f 7 -d " ")
  HELM_CHART_VERSION=$( echo "${HELM_LINE}" | cut -f 9 -d " ")
  if [[ ! -f "${HOME}/Library/Caches/helm/repository/${HELM_REPOSITORY_NAME}-charts.txt" ]] ; then
    helm repo add --force-update "${HELM_REPOSITORY_NAME}" "${HELM_REPOSITORY_URL}" > /dev/null
  fi
  LATEST_HELM_CHART_VERSION=$(helm search repo "${HELM_REPOSITORY_NAME}/${HELM_CHART_NAME}" --output json | jq -r ".[0].version")
  if [[ "${LATEST_HELM_CHART_VERSION}" != "${HELM_CHART_VERSION}" ]]; then
    echo "HelmChart: ${HELM_REPOSITORY_NAME}/${HELM_CHART_NAME} | Current: ${HELM_CHART_VERSION} | Latest version: ${LATEST_HELM_CHART_VERSION}"
  fi
done < <(grep -R --no-filename -A1 '^kind: HelmRelease' docs/part* | grep ^# | sort)
) | column -s \| -t
