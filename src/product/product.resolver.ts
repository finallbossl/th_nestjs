import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Float,
} from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Product], { name: 'products' })
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Query(() => Product, { name: 'product' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Mutation(() => Product)
  async createProduct(
    @Args('name') name: string,
    @Args('price', { type: () => Float }) price: number,
    @Args('description', { nullable: true }) description?: string,
    @Args('stock', { type: () => Int, nullable: true, defaultValue: 0 })
    stock?: number,
    @Args('categoryId', { type: () => Int, nullable: true })
    categoryId?: number,
  ): Promise<Product> {
    return this.productService.create({
      name,
      description,
      price,
      stock,
      categoryId,
    });
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('id', { type: () => Int }) id: number,
    @Args('name', { nullable: true }) name?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('price', { type: () => Float, nullable: true }) price?: number,
    @Args('stock', { type: () => Int, nullable: true }) stock?: number,
    @Args('categoryId', { type: () => Int, nullable: true })
    categoryId?: number,
  ): Promise<Product> {
    return this.productService.update(id, {
      name,
      description,
      price,
      stock,
      categoryId,
    });
  }

  @Mutation(() => Product)
  async removeProduct(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Product> {
    return this.productService.remove(id);
  }
}
