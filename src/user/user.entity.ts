import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Order } from '../order/order.entity';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => [Order], { nullable: true })
  orders?: Order[];
}
