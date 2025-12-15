import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RedisService } from '../redis/redis.service';

// Define User type based on Prisma schema
type PrismaUser = {
  id: number;
  name: string;
  email: string;
};

@Injectable()
export class UserService {
  private readonly CACHE_TTL = 3600; // 1 hour

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll(): Promise<PrismaUser[]> {
    const cacheKey = this.redis.createKey('users', 'all');

    // Kiểm tra cache trước
    const cached = await this.redis.get<PrismaUser[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Lấy từ database
    const users = await (this.prisma as any).user.findMany();

    // Lưu vào cache
    await this.redis.set(cacheKey, users, this.CACHE_TTL);

    return users;
  }

  async findOne(id: number): Promise<PrismaUser> {
    const cacheKey = this.redis.createKey('user', id);

    // Kiểm tra cache trước
    const cached = await this.redis.get<PrismaUser>(cacheKey);
    if (cached) {
      return cached;
    }

    // Lấy từ database
    const user = await (this.prisma as any).user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    // Lưu vào cache
    await this.redis.set(cacheKey, user, this.CACHE_TTL);

    return user;
  }

  async create(data: { name: string; email: string }): Promise<PrismaUser> {
    // Tạo user mới
    const user = await (this.prisma as any).user.create({
      data,
    });

    // Xóa cache users:all để làm mới danh sách
    await this.redis.del(this.redis.createKey('users', 'all'));

    // Lưu user mới vào cache
    await this.redis.set(
      this.redis.createKey('user', user.id),
      user,
      this.CACHE_TTL,
    );

    return user;
  }

  /**
   * Xóa cache của user khi có thay đổi
   */
  async invalidateUserCache(userId?: number): Promise<void> {
    await this.redis.del(this.redis.createKey('users', 'all'));
    if (userId) {
      await this.redis.del(this.redis.createKey('user', userId));
    }
  }
}