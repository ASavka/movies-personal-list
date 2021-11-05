import express, { Request, Response, Application } from 'express';
import config from './config';

const app: Application = express();
const PORT = config.APP_PORT;
const ENV = config.ENV;

app.get('/', (req: Request, res: Response): void => {
  res.send('Hello TypeScript with Node.js!');
});

app.post('/hello', (req: Request, res: Response): void => {
  const { headers, method, url } = req;
  let body: Record<string, unknown> | null = null;

  req
    .on('error', (error) => {
      console.error(error);
      res.end(error);
    })
    .on('data', (data) => {
      body = JSON.parse(data.toString());
    })
    .on('end', () => {
      console.log(body);
      const responseBody = { headers, method, url, body };
      res.send(responseBody);
    });
});

app.listen(PORT, (): void => {
  console.log(
    `Server is running here 👉 http://localhost:${PORT}. Env is ${ENV}`
  );
});
