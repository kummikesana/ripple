#!/usr/bin/env bash
# Copies just the client-facing static files into www/, which is the ONLY
# thing Capacitor packages into the native app (capacitor.config.json's
# webDir). The Vercel deployment keeps serving straight from the repo
# root untouched — this is purely a Capacitor-side concern, so the two
# never conflict.
#
# service-worker.js is deliberately left out: a service worker inside a
# wrapped WKWebView is a known source of stale-asset bugs and fights with
# Capacitor's own local asset serving. index.html's own registration call
# already fails silently (caught with .catch) when the file is missing,
# so leaving it out of www/ is enough to disable it for the native build
# without touching any app.js logic.

set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf www
mkdir -p www

cp index.html app.js styles.css manifest.json privacy.html www/
cp icon-192.png icon-512.png apple-touch-icon.png favicon.svg www/

echo "www/ synced ($(ls www | wc -l | tr -d ' ') files, service-worker.js intentionally excluded)"
