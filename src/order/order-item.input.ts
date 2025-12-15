import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class OrderItemInput {
  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  quantity: number;
}
