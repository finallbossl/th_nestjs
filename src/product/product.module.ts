import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductGrpcController } from './product.grpc.controller';
@Module({
  controllers: [ProductController, ProductGrpcController],
  providers: [ProductResolver, ProductService],
})
export class ProductModule {}
