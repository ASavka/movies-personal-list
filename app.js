const http = require('http');
const config = require('./config');
const PORT = config.APP_PORT;
const ENV = config.ENV;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello world!');
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}. Env is ${ENV}`);
});