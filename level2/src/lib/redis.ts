import { RedisClientType, createClient } from 'redis';

let client: RedisClientType;
const listKey = 'logs';

export function initClient(host = 'localhost') {
  client = createClient({
    url: `redis://${host}:6379`,
  });

  client.on('error', (err) => {
    console.error('Redis error: ', err);
  });
}

export async function connect() {
  return client.connect();
}

export async function sendToList(value: any): Promise<number> {
  return client.rPush(
    listKey,
    typeof value === 'string' ? value : JSON.stringify(value),
  );
}

export async function disconnect() {
  return client.disconnect();
}

export default {
  initClient,
  connect,
  sendToList,
  disconnect,
};
