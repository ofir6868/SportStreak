const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add fallbacks for gesture handler components on web
  config.resolve.alias = {
    ...config.resolve.alias,
    // Provide fallbacks for gesture handler components that don't work on web
    'react-native-gesture-handler/lib/module/components/GestureButtons': false,
    'react-native-gesture-handler/lib/module/components/touchables': false,
    'react-native-gesture-handler/lib/module/components/GestureComponents': false,
  };

  // Add fallback modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    // Provide empty modules for gesture handler components that fail on web
    'react-native-gesture-handler/lib/module/components/GestureButtons': false,
    'react-native-gesture-handler/lib/module/components/touchables': false,
    'react-native-gesture-handler/lib/module/components/GestureComponents': false,
  };

  return config;
}; 