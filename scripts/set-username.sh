#!/usr/bin/env bash
# Usage: scripts/set-username.sh <github-username>
# Replaces the GITHUB_USERNAME placeholder in every listing file. Run once, then commit.
set -euo pipefail
u="${1:?usage: set-username.sh <github-username>}"
[[ "$u" =~ ^[A-Za-z0-9-]+$ ]] || { echo "invalid GitHub username"; exit 1; }
grep -rl --exclude-dir=.git --exclude=set-username.sh --exclude=validate.py --exclude=SUBMIT.md 'GITHUB_USERNAME' . | xargs sed -i "s/GITHUB_USERNAME/$u/g"
echo "Done. Remaining placeholders:"; grep -rn --exclude-dir=.git --exclude=set-username.sh --exclude=validate.py --exclude=SUBMIT.md 'GITHUB_USERNAME' . || echo "none"
