const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

// Resolve repo root (two levels up from apps/mobile)
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files in the monorepo
config.watchFolders = [workspaceRoot];

// 2. Resolve modules from both app-level and root-level node_modules.
// Hierarchical lookup stays enabled — pnpm symlinks transitive deps under the
// package they belong to, and Metro needs to walk into those scopes to find
// them (e.g. expo-router → @babel/runtime, css-interop helpers).

module.exports = withNativeWind(config, { input: './global.css' });