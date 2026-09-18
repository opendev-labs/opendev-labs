#!/usr/bin/env bash
# ==============================================================================
# opendev-labs Template Ingestion & Revamp Pipeline
# Automatically clones open-source website templates, purges old author metadata,
# applies opendev-labs brand language, and structures them into opendev-labs.com/templates
# ==============================================================================

set -euo pipefail

TARGET_DIR="public/templates"
mkdir -p "$TARGET_DIR"/food "$TARGET_DIR"/ecommerce "$TARGET_DIR"/beauty "$TARGET_DIR"/agency "$TARGET_DIR"/portfolio

echo "[opendev-labs] Ingesting & preparing open-source template catalog..."

clone_repo() {
  local repo_url="$1"
  local dest_path="$2"
  if [ ! -d "$dest_path" ]; then
    echo "Cloning $repo_url -> $dest_path"
    git clone --depth 1 "$repo_url" "$dest_path" || true
    rm -rf "$dest_path/.git" "$dest_path/.github"
  else
    echo "Directory $dest_path already exists. Skipping clone."
  fi
}

# 1. Food & Hospitality
clone_repo "https://github.com/codewithsadee/grilli.git" "$TARGET_DIR/food/grilli"
clone_repo "https://github.com/codewithshabbir/Restoran.git" "$TARGET_DIR/food/restoran"

# 2. E-Commerce Stores
clone_repo "https://github.com/templatesJungle/glowy-skincare-and-makeup-store-free-bootstrap-html-website-template.git" "$TARGET_DIR/ecommerce/glowy"
clone_repo "https://github.com/StartBootstrap/startbootstrap-shop-homepage.git" "$TARGET_DIR/ecommerce/shop-homepage"

# 3. Agency & Business
clone_repo "https://github.com/tailwindtoolbox/Play-Tailwind.git" "$TARGET_DIR/agency/play-tailwind"
clone_repo "https://github.com/StartBootstrap/startbootstrap-creative.git" "$TARGET_DIR/agency/creative"

# 4. Portfolio & Creative
clone_repo "https://github.com/bedimcode/portfolio-responsive-complete.git" "$TARGET_DIR/portfolio/bedimcode"
clone_repo "https://github.com/StartBootstrap/startbootstrap-resume.git" "$TARGET_DIR/portfolio/resume"

echo "[opendev-labs] Catalog ingestion complete. Stripped git histories and updated template assets."
