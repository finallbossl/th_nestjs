import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RedisService } from '../redis/redis.service';
import { Product } from './product.entity';

// Define Product type manually to avoid Prisma type issues
type ProductWithCategory = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  categoryId: number | null;
  category: {
    id: number;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class ProductService {
  private readonly CACHE_TTL = 3600; // 1 hour

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  private mapProduct(product: ProductWithCategory): Product {
    return {
      ...product,
      description: product.description ?? undefined,
      categoryId: product.categoryId ?? undefined,
      category: product.category
        ? {
            ...product.category,
          }
        : undefined,
    };
  }

  async findAll(categoryId?: number): Promise<Product[]> {
    const cacheKey = this.redis.createKey(
      'products',
      categoryId ? `category:${categoryId}` : 'all',
    );

    // Kiểm tra cache trước
    const cached = await this.redis.get<Product[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Lấy từ database
    const products = await (this.prisma as any).product.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    const mappedProducts = products.map((p) => this.mapProduct(p));

    // Lưu vào cache
    await this.redis.set(cacheKey, mappedProducts, this.CACHE_TTL);

    return mappedProducts;
  }

  async findOne(id: number): Promise<Product> {
    const cacheKey = this.redis.createKey('product', id);

    // Kiểm tra cache trước
    const cached = await this.redis.get<Product>(cacheKey);
    if (cached) {
      return cached;
    }

    // Lấy từ database
    const product = await (this.prisma as any).product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const mappedProduct = this.mapProduct(product);

    // Lưu vào cache
    await this.redis.set(cacheKey, mappedProduct, this.CACHE_TTL);

    return mappedProduct;
  }

  async create(data: {
    name: string;
    description?: string;
    price: number;
    stock?: number;
    categoryId?: number;
  }): Promise<Product> {
    const product = await (this.prisma as any).product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock ?? 0,
        categoryId: data.categoryId,
      },
      include: { category: true },
    });
    const mappedProduct = this.mapProduct(product);

    // Xóa cache liên quan
    await this.invalidateProductCache(data.categoryId);

    // Lưu product mới vào cache
    await this.redis.set(
      this.redis.createKey('product', product.id),
      mappedProduct,
      this.CACHE_TTL,
    );

    return mappedProduct;
  }

  async update(
    id: number,
    data: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      categoryId?: number;
    },
  ): Promise<Product> {
    const existingProduct = await this.findOne(id); // Kiểm tra product có tồn tại không

    const product = await (this.prisma as any).product.update({
      where: { id },
      data,
      include: { category: true },
    });
    const mappedProduct = this.mapProduct(product);

    // Xóa cache liên quan
    await this.invalidateProductCache(existingProduct.categoryId);
    if (data.categoryId && data.categoryId !== existingProduct.categoryId) {
      await this.invalidateProductCache(data.categoryId);
    }

    // Cập nhật cache của product
    await this.redis.set(
      this.redis.createKey('product', id),
      mappedProduct,
      this.CACHE_TTL,
    );

    return mappedProduct;
  }

  async remove(id: number): Promise<Product> {
    const existingProduct = await this.findOne(id); // Kiểm tra product có tồn tại không

    const product = await (this.prisma as any).product.delete({
      where: { id },
      include: { category: true },
    });
    const mappedProduct = this.mapProduct(product);

    // Xóa cache
    await this.redis.del(this.redis.createKey('product', id));
    await this.invalidateProductCache(existingProduct.categoryId);

    return mappedProduct;
  }

  /**
   * Xóa cache của products khi có thay đổi
   */
  private async invalidateProductCache(categoryId?: number): Promise<void> {
    await this.redis.del(this.redis.createKey('products', 'all'));
    if (categoryId) {
      await this.redis.del(
        this.redis.createKey('products', `category:${categoryId}`),
      );
    }
  }
}
