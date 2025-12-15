import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  // Create HTTP application
  const app = await NestFactory.create(AppModule);
  
  // Enable validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Connect gRPC microservice
  // Use process.cwd() to get project root (works in both dev and production)
  const protoPath = join(process.cwd(), 'proto');
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ['user', 'product', 'category', 'order'],
      protoPath: [
        join(protoPath, 'user.proto'),
        join(protoPath, 'product.proto'),
        join(protoPath, 'category.proto'),
        join(protoPath, 'order.proto'),
      ],
      url: process.env.GRPC_URL || '0.0.0.0:5000',
    },
  });

  // Start all microservices
  await app.startAllMicroservices();

  // Start HTTP server
  await app.listen(process.env.PORT ?? 3000);
  
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`GraphQL Playground: http://localhost:${process.env.PORT ?? 3000}/graphql`);
  console.log(`RESTful API: http://localhost:${process.env.PORT ?? 3000}/api`);
  console.log(`gRPC Server: ${process.env.GRPC_URL || '0.0.0.0:5000'}`);
}
bootstrap();
