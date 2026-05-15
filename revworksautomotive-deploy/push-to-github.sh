#!/usr/bin/env bash
# Run this script once from inside /tmp/revworksautomotive (or wherever you placed the files)
# It initialises a git repo and pushes everything to thapatsta/revworksautomotive

set -e

git init
git add .
git commit -m "Initial deploy: Revworks Automotive site migrated from AIConsulting/revworks"
git branch -M main
git remote add origin https://github.com/thapatsta/revworksautomotive.git
git push -u origin main
