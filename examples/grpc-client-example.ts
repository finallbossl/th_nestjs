/**
 * Example gRPC Client for testing inter-service communication
 * 
 * Usage:
 * 1. Install dependencies: npm install @grpc/grpc-js @grpc/proto-loader
 * 2. Compile: npx ts-node examples/grpc-client-example.ts
 */

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';

// Load User proto
const userProtoPath = join(__dirname, '../proto/user.proto');
const userPackageDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(userPackageDefinition).user as any;

// Load Product proto
const productProtoPath = join(__dirname, '../proto/product.proto');
const productPackageDefinition = protoLoader.loadSync(productProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const productProto = grpc.loadPackageDefinition(
  productPackageDefinition,
).product as any;

// Create clients
const userClient = new userProto.UserService(
  'localhost:5000',
  grpc.credentials.createInsecure(),
);

const productClient = new productProto.ProductService(
  'localhost:5000',
  grpc.credentials.createInsecure(),
);

// Example: Get all users
console.log('=== Getting all users ===');
userClient.FindAll({}, (error: any, response: any) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Users:', JSON.stringify(response.users, null, 2));
});

// Example: Get user by ID
console.log('\n=== Getting user by ID ===');
userClient.FindOne({ id: 1 }, (error: any, response: any) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('User:', JSON.stringify(response, null, 2));
});

// Example: Create user
console.log('\n=== Creating user ===');
userClient.Create(
  { name: 'John Doe', email: 'john@example.com' },
  (error: any, response: any) => {
    if (error) {
      console.error('Error:', error);
      return;
    }
    console.log('Created user:', JSON.stringify(response, null, 2));
  },
);

// Example: Get all products
console.log('\n=== Getting all products ===');
productClient.FindAll({}, (error: any, response: any) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Products:', JSON.stringify(response.products, null, 2));
});

// Example: Get products by category
console.log('\n=== Getting products by category ===');
productClient.FindAll({ categoryId: 1 }, (error: any, response: any) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Products:', JSON.stringify(response.products, null, 2));
});

// Example: Create product
console.log('\n=== Creating product ===');
productClient.Create(
  {
    name: 'Gaming Laptop',
    description: 'High performance gaming laptop',
    price: 1500,
    stock: 10,
    categoryId: 1,
  },
  (error: any, response: any) => {
    if (error) {
      console.error('Error:', error);
      return;
    }
    console.log('Created product:', JSON.stringify(response, null, 2));
  },
);
