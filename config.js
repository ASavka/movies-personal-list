const args = require('minimist')(process.argv.slice(2));

module.exports = {
  APP_PORT: process.env.APP_PORT || 8787,
  ENV: args['app_env'] || 'test',
};
