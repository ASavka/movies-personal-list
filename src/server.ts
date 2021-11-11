import express, { Request, Response, Application, NextFunction } from 'express';
import { config } from './config';
import logger from './logger';
import { v4 as uuid } from 'uuid';

const app: Application = express();
const PORT = config.APP_PORT;
const ENV = config.ENV;

app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] || uuid();
  logger.info(`${req.method}  ${req.path}  ${req.query.foo}   ${requestId}`);
  res.set('X-Request-ID', requestId);
  next();
});

app.use(express.json());

app.get('/', (req: Request, res: Response): void => {
  res.send('I am empty page');
});

app.get('/hello', (req: Request, res: Response): void => {
  res.send('Hello TypeScript with Node.js!');
});

app.post('/post', (req: Request, res: Response): void => {
  res.json(req.body);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(404).send(err.message);
  logger.error(`${req.method} - ${err.message} - ${req.originalUrl}`);
});

app.listen(PORT, (): void => {
  logger.info(
    `Server is running here 👉 http://localhost:${PORT}. Env is ${ENV}`
  );
});
