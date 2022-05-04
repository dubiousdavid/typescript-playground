// Lib
import { default as express } from 'express';
// App
import { rootRouter } from './router';

const DEFAULT_CLIENT_PORT = 3000;
const clientPort = process.env.CLIENT_PORT || DEFAULT_CLIENT_PORT;
const clientOrigin = `http://localhost:${clientPort}`;

export const app = express();

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', clientOrigin);
  res.setHeader('Vary', 'Origin');
  next();
});

app.use(express.json());

app.use('/', rootRouter);

app.get('/', (_req, res) => {
  res.send({ success: true });
});
