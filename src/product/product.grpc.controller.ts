import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductService } from './product.service';

interface FindAllRequest {
  categoryId?: number;
}

interface FindOneRequest {
  id: number;
}

interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  categoryId?: number;
}

interface UpdateProductRequest {
  id: number;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
}

interface RemoveRequest {
  id: number;
}

interface ProductResponse {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId?: number;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

interface ProductsResponse {
  products: ProductResponse[];
}

@Controller()
export class ProductGrpcController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod('ProductService', 'FindAll')
  async findAll(data: FindAllRequest): Promise<ProductsResponse> {
    const products = await this.productService.findAll(data.categoryId);
    return {
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        category: product.category
          ? {
              id: product.category.id,
              name: product.category.name,
              slug: product.category.slug,
            }
          : undefined,
      })),
    };
  }

  @GrpcMethod('ProductService', 'FindOne')
  async findOne(data: FindOneRequest): Promise<ProductResponse> {
    const product = await this.productService.findOne(data.id);
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
          }
        : undefined,
    };
  }

  @GrpcMethod('ProductService', 'Create')
  async create(data: CreateProductRequest): Promise<ProductResponse> {
    const product = await this.productService.create(data);
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
          }
        : undefined,
    };
  }

  @GrpcMethod('ProductService', 'Update')
  async update(data: UpdateProductRequest): Promise<ProductResponse> {
    const { id, ...updateData } = data;
    const product = await this.productService.update(id, updateData);
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
          }
        : undefined,
    };
  }

  @GrpcMethod('ProductService', 'Remove')
  async remove(data: RemoveRequest): Promise<ProductResponse> {
    const product = await this.productService.remove(data.id);
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
          }
        : undefined,
    };
  }
}
