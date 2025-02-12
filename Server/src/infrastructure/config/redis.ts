import { createClient} from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD!,
    socket: {
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT!),
        reconnectStrategy: (retries: number) => {
          console.error(`Redis connection lost. Retrying attempt: ${retries}`);
          return Math.min(retries * 100, 3000); // Exponential backoff (max 3s)
        },
    }
});

redisClient.on('connect', () => {
    console.log('Connected to Redis...');
});

redisClient.on('error', (err) => {
    console.error(`Error connecting to Redis: ${err}`);
});

export default redisClient;