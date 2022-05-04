// App
import { app } from './app';

const DEFAULT_PORT = 8000;

let port = DEFAULT_PORT;

const envPort = process.env.PORT;
if (envPort) {
  port = parseInt(envPort, 10);
}

app.listen(port, () => {
  console.log(`[server]: Service listening on port: ${port}`);
});
