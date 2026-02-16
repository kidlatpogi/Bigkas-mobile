// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Supabase's realtime-js bundles `ws` which references Node built-ins
// (stream, events, etc.). React Native has its own WebSocket so these
// modules are never actually executed, but Metro still tries to resolve
// them. Providing empty shims prevents the bundler error.
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  stream: require.resolve('./shims/empty.js'),
  events: require.resolve('./shims/empty.js'),
  crypto: require.resolve('./shims/empty.js'),
  http: require.resolve('./shims/empty.js'),
  https: require.resolve('./shims/empty.js'),
  net: require.resolve('./shims/empty.js'),
  tls: require.resolve('./shims/empty.js'),
  zlib: require.resolve('./shims/empty.js'),
  fs: require.resolve('./shims/empty.js'),
  path: require.resolve('./shims/empty.js'),
  os: require.resolve('./shims/empty.js'),
  url: require.resolve('./shims/empty.js'),
  util: require.resolve('./shims/empty.js'),
  buffer: require.resolve('./shims/empty.js'),
  child_process: require.resolve('./shims/empty.js'),
};

module.exports = config;
