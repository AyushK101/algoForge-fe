import { ICache } from '@/lib/cache/cache';
import { InMemoryCache } from '@/lib/cache/in-memory-cache';
import { RedisCache } from '@/lib/cache/redis-cache';

const redisUrl = process.env.REDIS_URL;
// console.log({redisUrl});
export class Cache implements ICache {
  private static instance: Cache;
  private delegate: ICache;

  private constructor() {
    if (redisUrl) {
      this.delegate = RedisCache.getInstance(redisUrl);
    } else {
      this.delegate = InMemoryCache.getInstance();
    }
  }

  static getInstance(): Cache {
    if (!this.instance) {
      this.instance = new Cache();
    }
    return this.instance;
  }

  async set(
    type: string,
    args: string[],
    value: any,
    expirySeconds: number = parseInt(process.env.CACHE_EXPIRE_S || '1000', 10),
  ): Promise<void> {
    return this.delegate.set(type, args, value, expirySeconds);
  }

  async get(type: string, args: string[]): Promise<any> {
    return this.delegate.get(type, args);
  }

  async evict(type: string, args: string[]): Promise<null> {
    return this.delegate.evict(type, args);
  }
}

//!for redis server with redisUrl
export const cache = Cache.getInstance();
