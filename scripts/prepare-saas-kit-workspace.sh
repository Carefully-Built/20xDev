#!/usr/bin/env bash

set -euo pipefail

SAAS_KIT_DIR="${SAAS_KIT_WORKSPACE_DIR:-../carefully-built-saas-kit}"
SAAS_KIT_REPO="${SAAS_KIT_REPO:-https://github.com/AlessandroDodi/carefully-built-saas-kit.git}"

if [ ! -d "$SAAS_KIT_DIR/.git" ]; then
  rm -rf "$SAAS_KIT_DIR"
  git clone --depth=1 "$SAAS_KIT_REPO" "$SAAS_KIT_DIR"
fi

(
  cd "$SAAS_KIT_DIR"
  bun install --frozen-lockfile --linker=hoisted
  bun run --sequential --filter './packages/*' build
)
