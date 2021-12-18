import { Sequelize } from 'sequelize';
import { dbConfig } from '../config';

const sequelizeConnection = new Sequelize({
  database: dbConfig.DB_NAME,
  username: dbConfig.DB_USER,
  host: dbConfig.DB_HOST,
  port: dbConfig.DB_PORT,
  dialect: 'postgres',
});

export default sequelizeConnection;
