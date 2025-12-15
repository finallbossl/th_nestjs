import { Global, Module, Logger } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from './redis.service';

const logger = new Logger('RedisModule');

@Global() // Làm cho module này global
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const useRedis = process.env.REDIS_ENABLED !== 'false';
        
        if (useRedis) {
          try {
            // Dynamic import để tránh lỗi khi Redis không có
            const { redisStore } = await import('cache-manager-redis-yet');
            
            const store = await redisStore({
              socket: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
              },
              password: process.env.REDIS_PASSWORD,
              ttl: parseInt(process.env.REDIS_TTL || '3600'), // Default 1 hour
            });

            logger.log('Redis connection established successfully');
            return {
              store: () => store,
            };
          } catch (error) {
            logger.warn(
              `Failed to connect to Redis: ${error.message}. Falling back to in-memory cache.`,
            );
            logger.warn(
              'To use Redis caching, please start Redis server: redis-server',
            );
            logger.warn(
              'Or set REDIS_ENABLED=false in .env to disable Redis connection attempts',
            );
          }
        }

        // Fallback to in-memory cache if Redis is not available or disabled
        logger.log('Using in-memory cache');
        return {
          store: 'memory',
          max: 100,
          ttl: parseInt(process.env.REDIS_TTL || '3600'),
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService, CacheModule],
})
export class RedisModule {}
