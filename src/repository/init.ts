import { Movie, User } from './models';

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV !== 'test';

const dbInit = () => {
  Movie.sync({ alter: isDev || isTest });
  User.sync({ alter: isDev || isTest });
};

export default dbInit;
