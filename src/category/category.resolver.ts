import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './category.entity';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [Category], { name: 'categories' })
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Query(() => Category, { name: 'category' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Query(() => Category, { name: 'categoryBySlug' })
  async findBySlug(@Args('slug') slug: string): Promise<Category> {
    return this.categoryService.findBySlug(slug);
  }

  @Mutation(() => Category)
  async createCategory(
    @Args('name') name: string,
    @Args('slug') slug: string,
  ): Promise<Category> {
    return this.categoryService.create({ name, slug });
  }

  @Mutation(() => Category)
  async updateCategory(
    @Args('id', { type: () => Int }) id: number,
    @Args('name', { nullable: true }) name?: string,
    @Args('slug', { nullable: true }) slug?: string,
  ): Promise<Category> {
    return this.categoryService.update(id, { name, slug });
  }

  @Mutation(() => Category)
  async removeCategory(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Category> {
    return this.categoryService.remove(id);
  }
}
