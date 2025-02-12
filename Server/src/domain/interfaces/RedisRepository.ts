import { RedisCommandRawReply } from "@redis/client/dist/lib/commands";

export interface RedisRepository {
    set(key: string, value: string, token: string): Promise<string | null>;
    multi(key: string, value: string): Promise<RedisCommandRawReply>;
    get(key: string, value: string): Promise<string | null>;
    del(key: string, value: string): Promise<number>;
}