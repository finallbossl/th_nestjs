import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Category } from '../category/category.entity';

@ObjectType()
export class Product {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  stock: number;

  @Field(() => Int, { nullable: true })
  categoryId?: number;

  @Field(() => Category, { nullable: true })
  category?: Category;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
