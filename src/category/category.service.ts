import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { Category } from './category.entity';

type CategoryWithProducts = Prisma.CategoryGetPayload<{
  include: { products: true };
}>;

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  private mapCategory(category: CategoryWithProducts): Category {
    return {
      ...category,
      products: category.products.map((product) => ({
        ...product,
        description: product.description ?? undefined,
        categoryId: product.categoryId ?? undefined,
      })),
    };
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      include: { products: true },
      orderBy: { createdAt: 'desc' },
    });
    return categories.map((category) => this.mapCategory(category));
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.mapCategory(category);
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: { products: true },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return this.mapCategory(category);
  }

  async create(data: { name: string; slug: string }): Promise<Category> {
    const category = await this.prisma.category.create({
      data,
      include: { products: true },
    });
    return this.mapCategory(category);
  }

  async update(
    id: number,
    data: { name?: string; slug?: string },
  ): Promise<Category> {
    await this.findOne(id); // Kiểm tra category có tồn tại không

    const category = await this.prisma.category.update({
      where: { id },
      data,
      include: { products: true },
    });
    return this.mapCategory(category);
  }

  async remove(id: number): Promise<Category> {
    await this.findOne(id); // Kiểm tra category có tồn tại không

    const category = await this.prisma.category.delete({
      where: { id },
      include: { products: true },
    });
    return this.mapCategory(category);
  }
}
