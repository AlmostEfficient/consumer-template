const { getDefaultConfig } = require('expo/metro-config');
const nodeLibs = require('node-libs-react-native');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  // crypto: require.resolve('react-native-crypto'),
  // buffer: require.resolve('buffer'),
	crypto: require.resolve('react-native-quick-crypto'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('@craftzdog/react-native-buffer'),
	...nodeLibs,
};

module.exports = config;