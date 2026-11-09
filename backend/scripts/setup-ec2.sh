#!/usr/bin/env bash
set -euo pipefail

# 2 GB de swap como colchón ante picos de memoria
if ! swapon --show | grep -q '/swapfile'; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

# Docker Engine + plugin Compose (script oficial de Docker)
if ! command -v docker >/dev/null; then
  curl -fsSL https://get.docker.com | sudo sh
  sudo usermod -aG docker "$USER"
fi
sudo systemctl enable --now docker

docker --version
echo "Cierra la sesión SSH y vuelve a entrar para usar docker sin sudo."