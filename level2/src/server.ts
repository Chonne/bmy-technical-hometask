import express from 'express';
import { sendParsedLogToRedis } from './controllers/logController';
import redis from './lib/redis';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/', sendParsedLogToRedis);

app.on('close', async () => {
  await redis.disconnect();
});

app.listen(port, async () => {
  redis.initClient(process.env.REDIS_HOST);
  await redis.connect();

  console.log(`Server is listening on ${port}`);
});
