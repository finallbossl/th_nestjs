import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RedisService } from '../redis/redis.service';

// Kiểu User dựa theo Prisma schema
type PrismaUser = {
  id: number;
  name: string;
  email: string;
};

@Injectable()
export class UserService {
  private readonly CACHE_TTL = 3600; // 1 giờ

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Lấy danh sách users (có cache)
   */
  async findAll(): Promise<PrismaUser[]> {
    const cacheKey = this.redis.createKey('users', 'all');

    // 1️⃣ Check cache
    const cached = await this.redis.get<PrismaUser[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // 2️⃣ Query DB
    const users = await this.prisma.user.findMany();

    // 3️⃣ Save cache
    await this.redis.set(cacheKey, users, this.CACHE_TTL);

    return users;
  }

  /**
   * Lấy user theo ID (có cache)
   */
  async findOne(id: number): Promise<PrismaUser> {
    const cacheKey = this.redis.createKey('user', id);

    // 1️⃣ Check cache
    const cached = await this.redis.get<PrismaUser>(cacheKey);
    if (cached) {
      return cached;
    }

    // 2️⃣ Query DB
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // 3️⃣ Save cache
    await this.redis.set(cacheKey, user, this.CACHE_TTL);

    return user;
  }

  /**
   * Tạo user mới
   */
  async create(data: { name: string; email: string }): Promise<PrismaUser> {
    // 1️⃣ Create DB
    const user = await this.prisma.user.create({
      data,
    });

    // 2️⃣ Invalidate cache list
    await this.redis.del(this.redis.createKey('users', 'all'));

    // 3️⃣ Cache user mới
    await this.redis.set(
      this.redis.createKey('user', user.id),
      user,
      this.CACHE_TTL,
    );

    return user;
  }

  /**
   * Update user
   */
  async update(
    id: number,
    data: Partial<{ name: string; email: string }>,
  ): Promise<PrismaUser> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    // Invalidate cache
    await this.invalidateUserCache(id);

    return user;
  }

  /**
   * Delete user
   */
  async remove(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });

    // Invalidate cache
    await this.invalidateUserCache(id);
  }

  /**
   * Xóa cache user
   */
  private async invalidateUserCache(userId?: number): Promise<void> {
    // Xóa list
    await this.redis.del(this.redis.createKey('users', 'all'));

    // Xóa detail
    if (userId) {
      await this.redis.del(this.redis.createKey('user', userId));
    }
  }
}
