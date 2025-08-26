const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add server configuration
config.server = {
  port: 8081,
  host: 'localhost'
};

module.exports = config; 