#!/usr/bin/env node
// Regenerates apps/mobile/.expo/types/router.d.ts after adding/removing route files.
// Expo-router only writes this file from Metro's watcher during `expo start`; pure
// `expo export` and `tsc --noEmit` don't trigger it. Run this script after route
// changes so `pnpm typecheck` sees the latest route table.

const path = require('node:path');
const fs = require('node:fs');

process.env.EXPO_ROUTER_APP_ROOT = path.resolve(__dirname, '..', 'app');

const { regenerateDeclarations } = require('expo-router/build/typed-routes');

const outDir = path.resolve(__dirname, '..', '.expo', 'types');
fs.mkdirSync(outDir, { recursive: true });
regenerateDeclarations(outDir);

// regenerateDeclarations is debounced by 1s — wait for the file write.
setTimeout(() => {
  const file = path.join(outDir, 'router.d.ts');
  if (fs.existsSync(file)) {
    process.stdout.write(`Wrote ${file}\n`);
  } else {
    process.stderr.write(`Expected ${file} to exist after regeneration\n`);
    process.exit(1);
  }
}, 1500);
