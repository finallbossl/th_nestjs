import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

interface Cache {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  reset(): Promise<void>;
}

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    const value = await this.cacheManager.get<T>(key);
    this.logger.debug(`GET ${key} -> ${value !== undefined ? 'FOUND' : 'MISS'}`);
    return value;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const ttlMs = ttlSeconds ? ttlSeconds * 1000 : undefined;
    await this.cacheManager.set(key, value, ttlMs);
    this.logger.debug(`SET ${key} (ttl=${ttlSeconds ?? 'default'}s)`);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
    this.logger.debug(`DEL ${key}`);
  }

  async reset(): Promise<void> {
    await this.cacheManager.reset();
    this.logger.warn('CACHE RESET');
  }

  async has(key: string): Promise<boolean> {
    return (await this.get(key)) !== undefined;
  }

  createKey(prefix: string, ...parts: (string | number)[]): string {
    return `${prefix}:${parts.join(':')}`;
  }

  /**
   * Test Redis thật (không phải in-memory)
   */
  async isRedisActive(): Promise<boolean> {
    try {
      const key = '__redis_ping__';
      const value = Date.now().toString();

      await this.set(key, value, 2);
      const result = await this.get(key);

      return result === value;
    } catch (e) {
      this.logger.error('Redis not active', e);
      return false;
    }
  }

  /**
   * Chỉ dùng để debug / dev
   */
  async getAllKeys(pattern = '*'): Promise<string[]> {
    try {
      const { createClient } = await import('redis');

      const client = createClient({
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: Number(process.env.REDIS_PORT || 6379),
        },
        password: process.env.REDIS_PASSWORD || undefined,
      });

      await client.connect();
      const keys = await client.keys(pattern);
      await client.disconnect();

      return keys;
    } catch (e) {
      this.logger.warn(`Cannot read keys from Redis: ${e.message}`);
      return [];
    }
  }
}
