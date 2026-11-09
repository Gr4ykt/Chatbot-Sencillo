#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

MODEL=$(grep -E '^OLLAMA_MODEL=' .env | cut -d= -f2- | tr -d '"' || true)
MODEL=${MODEL:-qwen2.5:1.5b}

docker compose up -d ollama
docker compose exec ollama ollama pull "$MODEL"