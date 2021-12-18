import express, { Application } from 'express';
import { config } from './config';
import logger from './logger';
import {
  authorization,
  errorHandler,
  requestLogger,
} from './repository/middleware';
import movieRouter from './repository/routes/movie-routes';
import userRouter from './repository/routes/user-routes';

const app: Application = express();
const PORT = config.APP_PORT;
const ENV = config.ENV;

app.use(express.json({ limit: '50mb' }));

app.use(requestLogger);

app.use(authorization);

app.use(movieRouter);

app.use(userRouter);

app.use(errorHandler);

app.listen(PORT, (): void => {
  logger.info(
    `Server is running here 👉 http://localhost:${PORT}. Env is ${ENV}`
  );
});
