import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserGrpcController } from './user.grpc.controller';
@Module({
  controllers: [UserController, UserGrpcController],
  providers: [UserResolver, UserService],
})
export class UserModule {}
