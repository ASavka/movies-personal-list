import minimist from 'minimist';

let args = minimist(process.argv.slice(2));

interface IConfig {
  APP_PORT: number;
  ENV: string;
}

export const config: IConfig = {
  APP_PORT: parseInt(process.env.APP_PORT as string, 10) || 8787,
  ENV: args['app_env'] || 'test',
};
