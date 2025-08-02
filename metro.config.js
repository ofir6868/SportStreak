const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add gesture handler to the resolver and ensure proper module resolution
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-gesture-handler': require.resolve('react-native-gesture-handler'),
};

// Ensure gesture handler is properly resolved
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

module.exports = config; 