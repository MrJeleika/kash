module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }]],
    // Worklets plugin must be LAST. Reanimated 4 uses the worklets package
    // directly — `react-native-reanimated/plugin` is the old (v3) name.
    plugins: ['react-native-worklets/plugin'],
  };
};
