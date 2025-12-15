import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { Order } from './order.entity';

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    user: true;
    orderItems: {
      include: {
        product: true;
      };
    };
  };
}>;

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  private mapOrder(order: OrderWithRelations): Order {
    return {
      ...order,
      orderItems: order.orderItems.map((item) => ({
        ...item,
        product: {
          ...item.product,
          description: item.product.description ?? undefined,
          categoryId: item.product.categoryId ?? undefined,
        },
      })),
    };
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((order) => this.mapOrder(order));
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.mapOrder(order);
  }

  async findByUser(userId: number): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((order) => this.mapOrder(order));
  }

  async create(data: {
    userId: number;
    items: Array<{ productId: number; quantity: number }>;
  }): Promise<Order> {
    // Lấy thông tin products để tính tổng
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: data.items.map((item) => item.productId) },
      },
    });

    // Tính tổng tiền
    let total = 0;
    const orderItems = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }
      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // Tạo order với orderItems
    const order = await this.prisma.order.create({
      data: {
        userId: data.userId,
        total,
        status: 'pending',
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    return this.mapOrder(order);
  }

  async updateStatus(
    id: number,
    status: string,
  ): Promise<Order> {
    await this.findOne(id); // Kiểm tra order có tồn tại không

    const order = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    return this.mapOrder(order);
  }

  async remove(id: number): Promise<Order> {
    await this.findOne(id); // Kiểm tra order có tồn tại không

    const order = await this.prisma.order.delete({
      where: { id },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    return this.mapOrder(order);
  }
}
