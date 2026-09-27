const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');

const root = path.resolve(__dirname, '..');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  return {
    ...defaultConfig,
    watchFolders: [root],
    resolver: {
      ...defaultConfig.resolver,
      extraNodeModules: new Proxy(
        {},
        {
          get: (target, name) => path.resolve(__dirname, 'node_modules', name),
        }
      ),
    },
  };
})();
