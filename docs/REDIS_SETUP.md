# Hướng dẫn cài đặt và chạy Redis

## Cách 1: Sử dụng WSL2 (Windows Subsystem for Linux) - Khuyến nghị

### Bước 1: Cài đặt WSL2
```powershell
# Mở PowerShell với quyền Administrator
wsl --install
```

### Bước 2: Khởi động lại máy tính

### Bước 3: Cài đặt Redis trong WSL2
```bash
# Mở Ubuntu terminal (hoặc distro Linux bạn đã cài)
sudo apt update
sudo apt install redis-server -y
```

### Bước 4: Khởi động Redis
```bash
# Khởi động Redis server
sudo service redis-server start

# Kiểm tra Redis đã chạy chưa
redis-cli ping
# Nếu trả về "PONG" thì Redis đã chạy thành công
```

### Bước 5: Cấu hình Redis tự động khởi động
```bash
sudo systemctl enable redis-server
```

---

## Cách 2: Sử dụng Docker (Dễ nhất)

### Bước 1: Cài đặt Docker Desktop
Tải và cài đặt từ: https://www.docker.com/products/docker-desktop

### Bước 2: Chạy Redis container
```powershell
# Chạy Redis container
docker run -d --name redis-server -p 6379:6379 redis:latest

# Kiểm tra Redis đã chạy chưa
docker ps
```

### Bước 3: Kiểm tra kết nối
```powershell
# Sử dụng redis-cli trong container
docker exec -it redis-server redis-cli ping
# Nếu trả về "PONG" thì Redis đã chạy thành công
```

### Bước 4: Dừng Redis (khi cần)
```powershell
docker stop redis-server
```

### Bước 5: Khởi động lại Redis
```powershell
docker start redis-server
```

---

## Cách 3: Sử dụng Memurai (Redis cho Windows)

### Bước 1: Tải Memurai
Tải từ: https://www.memurai.com/get-memurai

### Bước 2: Cài đặt Memurai
Chạy file installer và làm theo hướng dẫn

### Bước 3: Khởi động Memurai
Memurai sẽ tự động chạy như một Windows service

### Bước 4: Kiểm tra
```powershell
# Sử dụng redis-cli (có trong Memurai)
redis-cli ping
```

---

## Cách 4: Sử dụng Redis từ source code (Nâng cao)

### Bước 1: Cài đặt Visual Studio Build Tools
Tải từ: https://visualstudio.microsoft.com/downloads/

### Bước 2: Clone Redis repository
```powershell
git clone https://github.com/microsoftarchive/redis.git
cd redis
```

### Bước 3: Build Redis
```powershell
# Mở Developer Command Prompt for VS
msbuild redis.sln /p:Configuration=Release
```

### Bước 4: Chạy Redis
```powershell
cd Release
.\redis-server.exe
```

---

## Kiểm tra Redis đã chạy

### Sử dụng redis-cli
```powershell
# Kết nối đến Redis
redis-cli

# Trong redis-cli, chạy:
ping
# Nếu trả về "PONG" thì Redis đã chạy

# Xem thông tin server
info

# Thoát
exit
```

### Sử dụng PowerShell
```powershell
# Kiểm tra port 6379 có đang lắng nghe không
Test-NetConnection -ComputerName localhost -Port 6379
```

---

## Cấu hình trong .env

Sau khi Redis đã chạy, cập nhật file `.env`:

```env
# Redis Configuration
REDIS_ENABLED=true
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TTL=3600
```

---

## Troubleshooting

### Lỗi: "ECONNREFUSED"
- **Nguyên nhân**: Redis server chưa được khởi động
- **Giải pháp**: Khởi động Redis server theo một trong các cách trên

### Lỗi: "Port 6379 already in use"
- **Nguyên nhân**: Port 6379 đã được sử dụng bởi ứng dụng khác
- **Giải pháp**: 
  - Tắt ứng dụng đang dùng port 6379
  - Hoặc đổi port Redis trong `.env`: `REDIS_PORT=6380`

### Redis không tự động khởi động
- **WSL2**: Chạy `sudo systemctl enable redis-server`
- **Docker**: Thêm `--restart always` khi chạy container
- **Memurai**: Đã tự động chạy như Windows service

---

## Lệnh hữu ích

### Xem tất cả keys trong Redis
```bash
redis-cli KEYS "*"
```

### Xóa tất cả keys
```bash
redis-cli FLUSHALL
```

### Xem thông tin memory
```bash
redis-cli INFO memory
```

### Monitor Redis commands
```bash
redis-cli MONITOR
```


