# Hướng dẫn Test Redis

## Các endpoint test Redis

Sau khi ứng dụng khởi động, bạn có thể test Redis qua các endpoint sau:

### 1. Kiểm tra trạng thái Redis
```bash
GET http://localhost:3000/api/redis/status
```
Trả về:
- `redisActive`: true/false - Redis có đang hoạt động không
- `totalKeys`: Số lượng keys trong Redis
- `keys`: Danh sách tất cả keys

### 2. Test set/get cơ bản
```bash
POST http://localhost:3000/api/redis/test
Content-Type: application/json

{
  "key": "test:key",
  "value": "test-value-123"
}
```

### 3. Test key users:all cụ thể
```bash
GET http://localhost:3000/api/redis/test/users-all
```

### 4. Set giá trị vào cache
```bash
POST http://localhost:3000/api/redis/set
Content-Type: application/json

{
  "key": "users:all",
  "value": [{"id": 1, "name": "Test", "email": "test@test.com"}],
  "ttl": 3600
}
```

### 5. Lấy giá trị từ cache
```bash
GET http://localhost:3000/api/redis/get/users:all
```

### 6. Xem tất cả keys
```bash
GET http://localhost:3000/api/redis/keys/*
```

### 7. Xóa một key
```bash
DELETE http://localhost:3000/api/redis/del/users:all
```

### 8. Xóa tất cả cache
```bash
POST http://localhost:3000/api/redis/flush
```

## Test qua Redis CLI

Sau khi gọi API để tạo cache, kiểm tra trong Redis CLI:

```bash
redis-cli

# Xem tất cả keys
KEYS *

# Lấy giá trị của key users:all
GET "users:all"

# Xem type của key
TYPE "users:all"

# Xem TTL của key
TTL "users:all"
```

## Test flow hoàn chỉnh

1. **Khởi động ứng dụng**: `npm run start:dev`

2. **Test Redis status**:
   ```bash
   curl http://localhost:3000/api/redis/status
   ```

3. **Gọi API users để tạo cache**:
   ```bash
   curl http://localhost:3000/api/users
   ```

4. **Kiểm tra trong Redis CLI**:
   ```bash
   redis-cli
   KEYS *
   GET "users:all"
   ```

5. **Test qua endpoint**:
   ```bash
   curl http://localhost:3000/api/redis/get/users:all
   ```

## Lưu ý

- Nếu `redisActive: false`, ứng dụng đang dùng in-memory cache
- Keys trong Redis sẽ được serialize thành JSON string
- TTL mặc định là 3600 giây (1 giờ)
- Kiểm tra logs của ứng dụng để xem các thao tác GET/SET
