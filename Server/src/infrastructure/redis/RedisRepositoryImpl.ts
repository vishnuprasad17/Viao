import { RedisCommandRawReply } from "@redis/client/dist/lib/commands";
import redisClient from "../config/redis";
import { RedisRepository } from "../../domain/interfaces/RedisRepository";

export class RedisRepositoryImpl implements RedisRepository {
  async set(key: string, value: string, token: string): Promise<string | null> {
    return await redisClient.set(`${key}:${value}`, token, {
      EX: 7 * 24 * 60 * 60, // 7 days
    });
  }

  async multi(key: string, value: string): Promise<RedisCommandRawReply> {
    const [storedToken] = await redisClient
        .multi()
        .get(`${key}:${value}`)
        .del(`${key}:${value}`)
        .exec();
    
    return storedToken;
  }
  
  async get(key: string, value: string): Promise<string | null> {
    return await redisClient.get(`${key}:${value}`);
  }

  async del(key: string, value: string): Promise<number> {
    return await redisClient.del(`${key}:${value}`);
  }
}
