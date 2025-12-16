import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('api/redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  /**
   * Test Redis connection và xem có đang dùng Redis thật hay in-memory cache
   */
  @Get('status')
  async getStatus() {
    const isActive = await this.redisService.isRedisActive();
    const allKeys = await this.redisService.getAllKeys('*');
    
    return {
      redisActive: isActive,
      totalKeys: allKeys.length,
      keys: allKeys,
      message: isActive 
        ? 'Redis is active and working correctly' 
        : 'Using in-memory cache (Redis not available)',
    };
  }

  /**
   * Test set/get một key
   */
  @Post('test')
  async testRedis(@Body() body: { key?: string; value?: string }) {
    const testKey = body.key || 'test:key';
    const testValue = body.value || `test-value-${Date.now()}`;
    
    // Set value
    await this.redisService.set(testKey, testValue, 60);
    
    // Get value
    const retrieved = await this.redisService.get<string>(testKey);
    
    return {
      success: true,
      setKey: testKey,
      setValue: testValue,
      retrievedValue: retrieved,
      match: retrieved === testValue,
      message: retrieved === testValue 
        ? 'Redis test passed: value stored and retrieved correctly' 
        : 'Redis test failed: value mismatch',
    };
  }

  /**
   * Lấy giá trị từ cache theo key
   */
  @Get('get/:key')
  async getValue(@Param('key') key: string) {
    const value = await this.redisService.get(key);
    const exists = await this.redisService.has(key);
    
    return {
      key,
      exists,
      value: value || null,
      message: exists ? 'Key found' : 'Key not found',
    };
  }

  /**
   * Set giá trị vào cache
   */
  @Post('set')
  async setValue(
    @Body() body: { key: string; value: any; ttl?: number },
  ) {
    await this.redisService.set(body.key, body.value, body.ttl || 3600);
    
    // Verify
    const retrieved = await this.redisService.get(body.key);
    
    return {
      success: true,
      key: body.key,
      value: body.value,
      ttl: body.ttl || 3600,
      verified: retrieved !== undefined,
      message: 'Value set successfully',
    };
  }

  /**
   * Xóa một key
   */
  @Delete('del/:key')
  async deleteKey(@Param('key') key: string) {
    const existed = await this.redisService.has(key);
    await this.redisService.del(key);
    const stillExists = await this.redisService.has(key);
    
    return {
      success: true,
      key,
      existed,
      deleted: !stillExists,
      message: existed 
        ? (stillExists ? 'Failed to delete key' : 'Key deleted successfully')
        : 'Key did not exist',
    };
  }

  /**
   * Lấy tất cả keys với pattern
   */
  @Get('keys')
  async getAllKeys(@Query('pattern') pattern?: string) {
    const keys = await this.redisService.getAllKeys(pattern || '*');

    return {
      pattern: pattern || '*',
      count: keys.length,
      keys,
    };
  }

  /**
   * Test users:all key cụ thể
   */
  @Get('test/users-all')
  async testUsersAll() {
    const key = 'users:all';
    const exists = await this.redisService.has(key);
    const value = await this.redisService.get(key);
    
    // Nếu không có, thử set một giá trị test
    if (!exists) {
      await this.redisService.set(key, { test: true, message: 'This is a test' }, 60);
      const newValue = await this.redisService.get(key);
      
      return {
        key,
        initiallyExists: false,
        testValueSet: true,
        testValue: newValue,
        message: 'Key did not exist, test value has been set',
      };
    }
    
    return {
      key,
      exists: true,
      value,
      message: 'Key exists in cache',
    };
  }

  /**
   * Xóa tất cả cache
   */
  @Post('flush')
  async flushAll() {
    await this.redisService.reset();
    
    return {
      success: true,
      message: 'All cache cleared',
    };
  }
}
