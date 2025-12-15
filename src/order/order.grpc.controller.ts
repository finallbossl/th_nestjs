import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OrderService } from './order.service';

interface FindOneRequest {
  id: number;
}

interface FindByUserRequest {
  userId: number;
}

interface CreateOrderRequest {
  userId: number;
  items: Array<{ productId: number; quantity: number }>;
}

interface UpdateStatusRequest {
  id: number;
  status: string;
}

interface RemoveRequest {
  id: number;
}

interface OrderResponse {
  id: number;
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  status: string;
  total: number;
  orderItems: Array<{
    id: number;
    orderId: number;
    productId: number;
    product: {
      id: number;
      name: string;
      description?: string;
      price: number;
      stock: number;
    };
    quantity: number;
    price: number;
  }>;
}

interface OrdersResponse {
  orders: OrderResponse[];
}

@Controller()
export class OrderGrpcController {
  constructor(private readonly orderService: OrderService) {}

  @GrpcMethod('OrderService', 'FindAll')
  async findAll(): Promise<OrdersResponse> {
    const orders = await this.orderService.findAll();
    return {
      orders: orders.map((order) => ({
        id: order.id,
        userId: order.userId,
        user: {
          id: order.user.id,
          name: order.user.name,
          email: order.user.email,
        },
        status: order.status,
        total: order.total,
        orderItems: order.orderItems.map((item) => ({
          id: item.id,
          orderId: item.orderId,
          productId: item.productId,
          product: {
            id: item.product.id,
            name: item.product.name,
            description: item.product.description,
            price: item.product.price,
            stock: item.product.stock,
          },
          quantity: item.quantity,
          price: item.price,
        })),
      })),
    };
  }

  @GrpcMethod('OrderService', 'FindOne')
  async findOne(data: FindOneRequest): Promise<OrderResponse> {
    const order = await this.orderService.findOne(data.id);
    return {
      id: order.id,
      userId: order.userId,
      user: {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email,
      },
      status: order.status,
      total: order.total,
      orderItems: order.orderItems.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          stock: item.product.stock,
        },
        quantity: item.quantity,
        price: item.price,
      })),
    };
  }

  @GrpcMethod('OrderService', 'FindByUser')
  async findByUser(data: FindByUserRequest): Promise<OrdersResponse> {
    const orders = await this.orderService.findByUser(data.userId);
    return {
      orders: orders.map((order) => ({
        id: order.id,
        userId: order.userId,
        user: {
          id: order.user.id,
          name: order.user.name,
          email: order.user.email,
        },
        status: order.status,
        total: order.total,
        orderItems: order.orderItems.map((item) => ({
          id: item.id,
          orderId: item.orderId,
          productId: item.productId,
          product: {
            id: item.product.id,
            name: item.product.name,
            description: item.product.description,
            price: item.product.price,
            stock: item.product.stock,
          },
          quantity: item.quantity,
          price: item.price,
        })),
      })),
    };
  }

  @GrpcMethod('OrderService', 'Create')
  async create(data: CreateOrderRequest): Promise<OrderResponse> {
    const order = await this.orderService.create({
      userId: data.userId,
      items: data.items,
    });
    return {
      id: order.id,
      userId: order.userId,
      user: {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email,
      },
      status: order.status,
      total: order.total,
      orderItems: order.orderItems.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          stock: item.product.stock,
        },
        quantity: item.quantity,
        price: item.price,
      })),
    };
  }

  @GrpcMethod('OrderService', 'UpdateStatus')
  async updateStatus(data: UpdateStatusRequest): Promise<OrderResponse> {
    const order = await this.orderService.updateStatus(data.id, data.status);
    return {
      id: order.id,
      userId: order.userId,
      user: {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email,
      },
      status: order.status,
      total: order.total,
      orderItems: order.orderItems.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          stock: item.product.stock,
        },
        quantity: item.quantity,
        price: item.price,
      })),
    };
  }

  @GrpcMethod('OrderService', 'Remove')
  async remove(data: RemoveRequest): Promise<OrderResponse> {
    const order = await this.orderService.remove(data.id);
    return {
      id: order.id,
      userId: order.userId,
      user: {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email,
      },
      status: order.status,
      total: order.total,
      orderItems: order.orderItems.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          stock: item.product.stock,
        },
        quantity: item.quantity,
        price: item.price,
      })),
    };
  }
}
