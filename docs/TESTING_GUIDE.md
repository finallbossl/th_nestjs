# Hướng dẫn Test các chức năng hệ thống

## Mục lục
1. [Test GraphQL API](#test-graphql-api)
2. [Test RESTful API](#test-restful-api)
3. [Test gRPC](#test-grpc)
4. [Test Redis Caching](#test-redis-caching)

---

## Test GraphQL API

### 1. Sử dụng GraphQL Playground (Dễ nhất)

#### Truy cập Playground
```
http://localhost:3000/graphql
```

#### Test Queries

##### Lấy tất cả Users
```graphql
query {
  users {
    id
    name
    email
  }
}
```

##### Lấy User theo ID
```graphql
query {
  user(id: 1) {
    id
    name
    email
    orders {
      id
      status
      total
    }
  }
}
```

##### Tạo User mới
```graphql
mutation {
  createUser(name: "John Doe", email: "john@example.com") {
    id
    name
    email
  }
}
```

##### Lấy tất cả Products
```graphql
query {
  products {
    id
    name
    price
    stock
    category {
      id
      name
      slug
    }
  }
}
```

##### Lấy Products theo Category
```graphql
query {
  products(categoryId: 1) {
    id
    name
    price
    category {
      name
    }
  }
}
```

##### Tạo Product
```graphql
mutation {
  createProduct(
    name: "Gaming Laptop"
    price: 1500
    description: "High performance gaming laptop"
    stock: 10
    categoryId: 1
  ) {
    id
    name
    price
    stock
  }
}
```

##### Lấy tất cả Categories
```graphql
query {
  categories {
    id
    name
    slug
    products {
      id
      name
      price
    }
  }
}
```

##### Tạo Order
```graphql
mutation {
  createOrder(
    userId: 1
    items: [
      { productId: 1, quantity: 2 }
      { productId: 2, quantity: 1 }
    ]
  ) {
    id
    status
    total
    user {
      name
      email
    }
    orderItems {
      quantity
      price
      product {
        name
        price
      }
    }
  }
}
```

### 2. Sử dụng cURL

```bash
# Query Users
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ users { id name email } }"
  }'

# Mutation Create User
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createUser(name: \"John Doe\", email: \"john@example.com\") { id name email } }"
  }'
```

### 3. Sử dụng Postman

1. Tạo request mới
2. Method: `POST`
3. URL: `http://localhost:3000/graphql`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
```json
{
  "query": "{ users { id name email } }"
}
```

---

## Test RESTful API

### 1. User Endpoints

#### GET - Lấy tất cả Users
```bash
curl http://localhost:3000/api/users
```

#### GET - Lấy User theo ID
```bash
curl http://localhost:3000/api/users/1
```

#### POST - Tạo User mới
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com"
  }'
```

### 2. Product Endpoints

#### GET - Lấy tất cả Products
```bash
curl http://localhost:3000/api/products
```

#### GET - Lấy Products theo Category
```bash
curl http://localhost:3000/api/products?categoryId=1
```

#### GET - Lấy Product theo ID
```bash
curl http://localhost:3000/api/products/1
```

#### POST - Tạo Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse",
    "price": 29.99,
    "stock": 50,
    "categoryId": 1
  }'
```

#### PUT - Cập nhật Product
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Product Name",
    "price": 99.99
  }'
```

#### DELETE - Xóa Product
```bash
curl -X DELETE http://localhost:3000/api/products/1
```

### 3. Sử dụng Postman Collection

Tạo collection với các requests:
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `GET /api/products`
- `GET /api/products?categoryId=:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

---

## Test gRPC

### 1. Sử dụng gRPC Client Example

File example đã có sẵn: `examples/grpc-client-example.ts`

#### Chạy example
```bash
# Cài đặt dependencies nếu chưa có
npm install @grpc/grpc-js @grpc/proto-loader ts-node --save-dev

# Chạy example
npx ts-node examples/grpc-client-example.ts
```

### 2. Sử dụng BloomRPC (GUI Tool)

#### Cài đặt BloomRPC
- Tải từ: https://github.com/uw-labs/bloomrpc/releases
- Hoặc cài qua: `npm install -g bloomrpc`

#### Sử dụng
1. Mở BloomRPC
2. Import proto files từ thư mục `proto/`:
   - `proto/user.proto`
   - `proto/product.proto`
   - `proto/category.proto`
   - `proto/order.proto`
3. Kết nối đến: `localhost:5000`
4. Test các methods:
   - `UserService.FindAll`
   - `UserService.FindOne`
   - `UserService.Create`
   - `ProductService.FindAll`
   - `ProductService.Create`

### 3. Sử dụng grpcurl (Command Line)

#### Cài đặt grpcurl
```bash
# Windows (scoop)
scoop install grpcurl

# Hoặc tải từ: https://github.com/fullstorydev/grpcurl/releases
```

#### Test Commands

##### List Services
```bash
grpcurl -plaintext localhost:5000 list
```

##### List Methods của UserService
```bash
grpcurl -plaintext localhost:5000 list user.UserService
```

##### Call FindAll Users
```bash
grpcurl -plaintext -d '{}' localhost:5000 user.UserService/FindAll
```

##### Call FindOne User
```bash
grpcurl -plaintext -d '{"id": 1}' localhost:5000 user.UserService/FindOne
```

##### Call Create User
```bash
grpcurl -plaintext -d '{
  "name": "Test User",
  "email": "test@example.com"
}' localhost:5000 user.UserService/Create
```

##### Call FindAll Products
```bash
grpcurl -plaintext -d '{}' localhost:5000 product.ProductService/FindAll
```

##### Call Create Product
```bash
grpcurl -plaintext -d '{
  "name": "Test Product",
  "price": 99.99,
  "stock": 10,
  "categoryId": 1
}' localhost:5000 product.ProductService/Create
```

### 4. Tạo Custom gRPC Client

Tạo file `test-grpc.ts`:

```typescript
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';

// Load proto
const protoPath = join(__dirname, 'proto/user.proto');
const packageDefinition = protoLoader.loadSync(protoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition).user as any;
const client = new proto.UserService(
  'localhost:5000',
  grpc.credentials.createInsecure(),
);

// Test FindAll
client.FindAll({}, (error: any, response: any) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Users:', JSON.stringify(response, null, 2));
});

// Test Create
client.Create(
  { name: 'Test User', email: 'test@example.com' },
  (error: any, response: any) => {
    if (error) {
      console.error('Error:', error);
      return;
    }
    console.log('Created:', JSON.stringify(response, null, 2));
  },
);
```

---

## Test Redis Caching

### 1. Kiểm tra Redis đang chạy

```bash
# Kiểm tra kết nối
redis-cli ping
# Nếu trả về "PONG" thì Redis đang chạy
```

### 2. Test Cache hoạt động

#### Bước 1: Xóa cache hiện tại
```bash
redis-cli FLUSHALL
```

#### Bước 2: Gọi API lần đầu (sẽ query database)
```bash
# Gọi REST API
curl http://localhost:3000/api/users

# Hoặc GraphQL
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ users { id name email } }"}'
```

#### Bước 3: Kiểm tra cache đã được tạo
```bash
# Xem tất cả keys trong Redis
redis-cli KEYS "*"
docker exec -it redis-server redis-cli FLUSHALL
docker exec -it redis-server redis-cli KEYS "*"
docker exec -it redis-server redis-cli GET users:all


# Xem giá trị của một key
redis-cli GET "users:all"
```

#### Bước 4: Gọi API lần 2 (sẽ lấy từ cache)
```bash
# Gọi lại API - lần này sẽ nhanh hơn vì lấy từ cache
curl http://localhost:3000/api/users
```

#### Bước 5: Monitor Redis commands
```bash
# Mở terminal khác và chạy
redis-cli MONITOR

# Sau đó gọi API, bạn sẽ thấy các commands Redis được thực thi
```

### 3. Test Cache Invalidation

#### Tạo User mới
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "New User", "email": "new@example.com"}'
```

#### Kiểm tra cache đã bị xóa
```bash
# Cache "users:all" sẽ bị xóa khi tạo user mới
redis-cli KEYS "*"
```

### 4. Test Cache với Products

```bash
# Lấy products
curl http://localhost:3000/api/products

# Kiểm tra cache
redis-cli GET "products:all"

# Lấy products theo category
curl "http://localhost:3000/api/products?categoryId=1"

# Kiểm tra cache category
redis-cli GET "products:category:1"
```

### 5. Sử dụng Redis CLI để debug

```bash
# Xem tất cả keys
redis-cli KEYS "*"

# Xem thông tin về một key
redis-cli TTL "users:all"  # Xem thời gian còn lại
redis-cli TYPE "users:all" # Xem kiểu dữ liệu

# Xem memory usage
redis-cli INFO memory

# Xem số lượng keys
redis-cli DBSIZE
```

### 6. Test Cache Performance

Tạo script test: `test-cache-performance.js`

```javascript
const http = require('http');

function makeRequest() {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    http.get('http://localhost:3000/api/users', (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const duration = Date.now() - start;
        resolve({ duration, data: JSON.parse(data) });
      });
    }).on('error', reject);
  });
}

async function test() {
  console.log('Test 1: First request (from database)');
  const result1 = await makeRequest();
  console.log(`Duration: ${result1.duration}ms`);

  console.log('\nTest 2: Second request (from cache)');
  const result2 = await makeRequest();
  console.log(`Duration: ${result2.duration}ms`);
  console.log(`Speed improvement: ${((result1.duration - result2.duration) / result1.duration * 100).toFixed(2)}%`);
}

test();
```

Chạy:
```bash
node test-cache-performance.js
```

---

## Test Tổng hợp (Integration Test)

### Script test tất cả: `test-all.sh`

```bash
#!/bin/bash

echo "=== Testing GraphQL ==="
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ users { id name email } }"}'

echo -e "\n\n=== Testing RESTful API ==="
curl http://localhost:3000/api/users

echo -e "\n\n=== Testing gRPC ==="
grpcurl -plaintext -d '{}' localhost:5000 user.UserService/FindAll

echo -e "\n\n=== Testing Redis Cache ==="
redis-cli KEYS "*"
```

### Hoặc tạo file PowerShell: `test-all.ps1`

```powershell
Write-Host "=== Testing GraphQL ===" -ForegroundColor Green
Invoke-RestMethod -Uri "http://localhost:3000/graphql" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"query": "{ users { id name email } }"}'

Write-Host "`n=== Testing RESTful API ===" -ForegroundColor Green
Invoke-RestMethod -Uri "http://localhost:3000/api/users"

Write-Host "`n=== Testing Redis Cache ===" -ForegroundColor Green
docker exec redis-server redis-cli KEYS "*"
```

---

## Tools khuyến nghị

1. **GraphQL Playground**: Built-in tại `http://localhost:3000/graphql`
2. **Postman**: Test RESTful API và GraphQL
3. **BloomRPC**: Test gRPC (GUI)
4. **grpcurl**: Test gRPC (CLI)
5. **Redis CLI**: Test Redis cache
6. **Insomnia**: Alternative cho Postman

---

## Troubleshooting

### GraphQL không hoạt động
- Kiểm tra server đã chạy: `http://localhost:3000/graphql`
- Kiểm tra log server có lỗi không

### RESTful API trả về 404
- Kiểm tra route prefix: `/api/users` (không phải `/users`)
- Kiểm tra controller đã được đăng ký trong module

### gRPC không kết nối được
- Kiểm tra gRPC server đã start: log sẽ hiển thị `gRPC Server: 0.0.0.0:5000`
- Kiểm tra proto files có trong thư mục `proto/`
- Sử dụng `grpcurl list localhost:5000` để kiểm tra

### Redis cache không hoạt động
- Kiểm tra Redis đã chạy: `redis-cli ping`
- Kiểm tra log server có thông báo "Redis connection established"
- Nếu không có Redis, app sẽ fallback về in-memory cache
