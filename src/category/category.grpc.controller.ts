import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CategoryService } from './category.service';

interface FindOneRequest {
  id: number;
}

interface FindBySlugRequest {
  slug: string;
}

interface CreateCategoryRequest {
  name: string;
  slug: string;
}

interface UpdateCategoryRequest {
  id: number;
  name?: string;
  slug?: string;
}

interface RemoveRequest {
  id: number;
}

interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  products?: Array<{
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
  }>;
}

interface CategoriesResponse {
  categories: CategoryResponse[];
}

@Controller()
export class CategoryGrpcController {
  constructor(private readonly categoryService: CategoryService) {}

  @GrpcMethod('CategoryService', 'FindAll')
  async findAll(): Promise<CategoriesResponse> {
    const categories = await this.categoryService.findAll();
    return {
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        products: category.products?.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description ?? undefined,
          price: product.price,
          stock: product.stock,
        })),
      })),
    };
  }

  @GrpcMethod('CategoryService', 'FindOne')
  async findOne(data: FindOneRequest): Promise<CategoryResponse> {
    const category = await this.categoryService.findOne(data.id);
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      products: category.products?.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description ?? undefined,
        price: product.price,
        stock: product.stock,
      })),
    };
  }

  @GrpcMethod('CategoryService', 'FindBySlug')
  async findBySlug(data: FindBySlugRequest): Promise<CategoryResponse> {
    const category = await this.categoryService.findBySlug(data.slug);
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      products: category.products?.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description ?? undefined,
        price: product.price,
        stock: product.stock,
      })),
    };
  }

  @GrpcMethod('CategoryService', 'Create')
  async create(data: CreateCategoryRequest): Promise<CategoryResponse> {
    const category = await this.categoryService.create(data);
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      products: category.products?.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description ?? undefined,
        price: product.price,
        stock: product.stock,
      })),
    };
  }

  @GrpcMethod('CategoryService', 'Update')
  async update(data: UpdateCategoryRequest): Promise<CategoryResponse> {
    const { id, ...updateData } = data;
    const category = await this.categoryService.update(id, updateData);
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      products: category.products?.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description ?? undefined,
        price: product.price,
        stock: product.stock,
      })),
    };
  }

  @GrpcMethod('CategoryService', 'Remove')
  async remove(data: RemoveRequest): Promise<CategoryResponse> {
    const category = await this.categoryService.remove(data.id);
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      products: category.products?.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description ?? undefined,
        price: product.price,
        stock: product.stock,
      })),
    };
  }
}
