const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

// Find the workspace root (parent directory of apps/)
const workspaceRoot = path.resolve(__dirname, '../..');
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// Configure Metro to resolve modules from workspace root and watch workspace packages
config.watchFolders = [
  workspaceRoot,
  path.resolve(workspaceRoot, 'packages'),
  path.resolve(workspaceRoot, 'apps'),
];

config.resolver = {
  ...config.resolver,
  nodeModulesPaths: [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ],
};

module.exports = withNativeWind(config, {
  input: './global.css',
  configPath: './tailwind.config.js',
  projectRoot: projectRoot,
});
