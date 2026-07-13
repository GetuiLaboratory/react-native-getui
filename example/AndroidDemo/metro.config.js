const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const getuiRoot = path.resolve(__dirname, '../..');

const config = {
  watchFolders: [getuiRoot],
  resolver: {
    nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
    extraNodeModules: {
      'react-native-getui': getuiRoot,
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
