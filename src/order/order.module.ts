import { Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { OrderGrpcController } from './order.grpc.controller';
@Module({
  controllers: [OrderGrpcController],
  providers: [OrderResolver, OrderService],
})
export class OrderModule {}
