import minimist from 'minimist';

let args = minimist(process.argv.slice(2));

export default {
  APP_PORT: process.env.APP_PORT || 8787,
  ENV: args['app_env'] || 'test',
};
