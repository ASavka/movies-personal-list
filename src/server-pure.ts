import http from 'http';
import { config } from './config';
import Logger from './logger';
import { v4 as uuid } from 'uuid';

const PORT = config.APP_PORT;
const ENV = config.ENV;

http
  .createServer((req, res) => {
    const requestId = req.headers['x-request-id'] || uuid();
    const requestData = `${req.method} ${req.headers.host} ${req.url} ${requestId}`;

    if (req.method == 'POST') {
      const chunks: Buffer[] = [];
      let body: Record<string, unknown> | null = null;
      req
        .on('data', (data) => {
          chunks.push(data);
        })
        .on('end', () => {
          const rawBody = Buffer.concat(chunks).toString();
          body = JSON.parse(rawBody);
          Logger.info(`${requestData} - Number of chunks: ${chunks.length}`);
          res.end(rawBody);
        });

      // Commented code below is less verbose and more clear, so I don't understand why Buffer complexity is needed
      // Verified on big json {"size" : "16Mb", "lines" : "519977"}
      //
      // let data = '';
      // req.on('data', (chunk) => {
      //   data += chunk;
      // });
      // req.on('end', () => {
      //   console.log(JSON.parse(data));
      //   res.end(data);
      // });
    }
    if (req.method == 'GET') {
      Logger.info(` ${requestData}`);
      res.write(`${requestData}`);
      res.end();
    }
  })
  .listen(PORT, () => {
    Logger.info(
      `Pure http Server is running here 👉 http://localhost:${PORT}. Env is ${ENV}`
    );
  });

process.on('uncaughtException', (err, origin) => {
  Logger.error(`'There was an uncaught error ${err}`);
  Logger.error(`'Origin: ', ${origin}`);
});

process.on('unhandledRejection', (reason) => {
  Logger.error(reason);
});
