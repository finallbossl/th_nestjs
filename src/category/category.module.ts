import { Module } from '@nestjs/common';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
import { CategoryGrpcController } from './category.grpc.controller';
@Module({
  controllers: [CategoryGrpcController],
  providers: [CategoryResolver, CategoryService],
})
export class CategoryModule {}
