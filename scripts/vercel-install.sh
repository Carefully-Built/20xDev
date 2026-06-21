#!/usr/bin/env bash
set -euo pipefail

KIT_DIR="../carefully-built-saas-kit"

if [ ! -d "$KIT_DIR/.git" ]; then
  rm -rf "$KIT_DIR"
  git clone --depth=1 https://github.com/AlessandroDodi/carefully-built-saas-kit.git "$KIT_DIR"
fi

(
  cd "$KIT_DIR"
  bun install --frozen-lockfile --linker=hoisted
  bun run build:vercel
)

bun install --frozen-lockfile --linker=hoisted
