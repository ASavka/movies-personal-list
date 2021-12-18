import dotenv from 'dotenv';
import minimist from 'minimist';
import { Dialect } from 'sequelize/dist';

dotenv.config();

let args = minimist(process.argv.slice(2));

interface IConfig {
  APP_PORT: number;
  ENV: string;
}

interface iDBConfig {
  DB_NAME: string;
  DB_USER: string;
  DB_PASS: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_DRIVER: Dialect;
  DB_ACTION: string;
}

export const config: IConfig = {
  APP_PORT: parseInt(process.env.APP_PORT as string, 10) || 8787,
  ENV: args['app_env'] || 'test',
};

export const dbConfig: iDBConfig = {
  DB_NAME: process.env.DB_NAME as string,
  DB_USER: process.env.DB_USER as string,
  DB_PASS: process.env.DB_PASSWORD as string,
  DB_HOST: process.env.DB_HOST as string,
  DB_PORT: parseInt(process.env.DB_PORT as string, 10) || 5432,
  DB_DRIVER: process.env.DB_DRIVER as Dialect,
  DB_ACTION: args['db_action'],
};
