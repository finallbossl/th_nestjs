import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Làm cho module này global, tất cả modules khác có thể sử dụng PrismaService
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

