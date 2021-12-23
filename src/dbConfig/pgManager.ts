import { Client } from 'pg';
import { dbConfig } from '../config';
import Logger from '../logger';
import dbInit from '../repository/init';

const client = new Client({
  user: dbConfig.DB_USER,
  password: dbConfig.DB_PASS,
  host: dbConfig.DB_HOST,
  port: dbConfig.DB_PORT,
});

const dbCreate = async () => {
  await client.connect();
  console.log('db_action: ', dbConfig.DB_ACTION);
  switch (dbConfig.DB_ACTION) {
    case 'drop':
      await client.query(`DROP DATABASE ${dbConfig.DB_NAME}`);
      break;
    case 'create':
      await client.query(`CREATE DATABASE ${dbConfig.DB_NAME}`);
      dbInit();
      break;
    default:
      Logger.error('"--db_action=[drop | create]" env paramater is required');
      break;
  }
  await client.end();
};

dbCreate();
