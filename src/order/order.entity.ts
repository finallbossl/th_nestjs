import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import { OrderItem } from './order-item.entity';

@ObjectType()
export class Order {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => User)
  user: User;

  @Field()
  status: string;

  @Field(() => Float)
  total: number;

  @Field(() => [OrderItem])
  orderItems: OrderItem[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
