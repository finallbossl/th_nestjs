import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from './user.service';

interface FindOneRequest {
  id: number;
}

interface CreateUserRequest {
  name: string;
  email: string;
}

interface UserResponse {
  id: number;
  name: string;
  email: string;
}

interface UsersResponse {
  users: UserResponse[];
}

@Controller()
export class UserGrpcController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'FindAll')
  async findAll(): Promise<UsersResponse> {
    const users = await this.userService.findAll();
    return {
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })),
    };
  }

  @GrpcMethod('UserService', 'FindOne')
  async findOne(data: FindOneRequest): Promise<UserResponse> {
    const user = await this.userService.findOne(data.id);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  @GrpcMethod('UserService', 'Create')
  async create(data: CreateUserRequest): Promise<UserResponse> {
    const user = await this.userService.create(data);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
