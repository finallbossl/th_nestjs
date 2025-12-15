import { Resolver, Query, Mutation, Args, Int, Float } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { OrderItemInput } from './order-item.input';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [Order], { name: 'orders' })
  async findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Query(() => Order, { name: 'order' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Query(() => [Order], { name: 'ordersByUser' })
  async findByUser(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<Order[]> {
    return this.orderService.findByUser(userId);
  }

  @Mutation(() => Order)
  async createOrder(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('items', { type: () => [OrderItemInput] }) items: OrderItemInput[],
  ): Promise<Order> {
    return this.orderService.create({
      userId,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });
  }

  @Mutation(() => Order)
  async updateOrderStatus(
    @Args('id', { type: () => Int }) id: number,
    @Args('status') status: string,
  ): Promise<Order> {
    return this.orderService.updateStatus(id, status);
  }

  @Mutation(() => Order)
  async removeOrder(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Order> {
    return this.orderService.remove(id);
  }
}
