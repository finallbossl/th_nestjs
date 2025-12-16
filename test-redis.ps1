# Script test Redis cho NestJS application
# Chạy script này sau khi ứng dụng đã khởi động: npm run start:dev

$baseUrl = "http://localhost:3000"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Redis Endpoints" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Test Redis Status
Write-Host "1. Testing Redis Status..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/redis/status" -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   Redis Active: $($data.redisActive)" -ForegroundColor $(if ($data.redisActive) { "Green" } else { "Red" })
    Write-Host "   Total Keys: $($data.totalKeys)" -ForegroundColor White
    Write-Host "   Keys: $($data.keys -join ', ')" -ForegroundColor White
    Write-Host "   Message: $($data.message)" -ForegroundColor White
} catch {
    Write-Host "   ERROR: $_" -ForegroundColor Red
}
Write-Host ""

# 2. Test Set/Get
Write-Host "2. Testing Set/Get..." -ForegroundColor Yellow
try {
    $testBody = @{
        key = "test:key"
        value = "test-value-$(Get-Date -Format 'yyyyMMddHHmmss')"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$baseUrl/api/redis/test" -Method POST -Body $testBody -ContentType "application/json" -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   Success: $($data.success)" -ForegroundColor $(if ($data.success) { "Green" } else { "Red" })
    Write-Host "   Match: $($data.match)" -ForegroundColor $(if ($data.match) { "Green" } else { "Red" })
    Write-Host "   Message: $($data.message)" -ForegroundColor White
} catch {
    Write-Host "   ERROR: $_" -ForegroundColor Red
}
Write-Host ""

# 3. Test users:all key
Write-Host "3. Testing users:all key..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/redis/test/users-all" -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   Key: $($data.key)" -ForegroundColor White
    Write-Host "   Exists: $($data.exists)" -ForegroundColor $(if ($data.exists) { "Green" } else { "Yellow" })
    Write-Host "   Message: $($data.message)" -ForegroundColor White
} catch {
    Write-Host "   ERROR: $_" -ForegroundColor Red
}
Write-Host ""

# 4. Set users:all manually
Write-Host "4. Setting users:all manually..." -ForegroundColor Yellow
try {
    $testUsers = @(
        @{ id = 1; name = "Test User 1"; email = "test1@test.com" },
        @{ id = 2; name = "Test User 2"; email = "test2@test.com" }
    )
    
    $setBody = @{
        key = "users:all"
        value = $testUsers
        ttl = 3600
    } | ConvertTo-Json -Depth 10

    $response = Invoke-WebRequest -Uri "$baseUrl/api/redis/set" -Method POST -Body $setBody -ContentType "application/json" -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   Success: $($data.success)" -ForegroundColor $(if ($data.success) { "Green" } else { "Red" })
    Write-Host "   Verified: $($data.verified)" -ForegroundColor $(if ($data.verified) { "Green" } else { "Red" })
} catch {
    Write-Host "   ERROR: $_" -ForegroundColor Red
}
Write-Host ""

# 5. Get users:all
Write-Host "5. Getting users:all..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/redis/get/users:all" -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   Key: $($data.key)" -ForegroundColor White
    Write-Host "   Exists: $($data.exists)" -ForegroundColor $(if ($data.exists) { "Green" } else { "Red" })
    if ($data.exists) {
        Write-Host "   Value: $($data.value | ConvertTo-Json -Compress)" -ForegroundColor White
    }
} catch {
    Write-Host "   ERROR: $_" -ForegroundColor Red
}
Write-Host ""

# 6. Get all keys
Write-Host "6. Getting all keys..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/redis/keys/*" -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   Pattern: $($data.pattern)" -ForegroundColor White
    Write-Host "   Count: $($data.count)" -ForegroundColor White
    Write-Host "   Keys: $($data.keys -join ', ')" -ForegroundColor White
} catch {
    Write-Host "   ERROR: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Bây giờ bạn có thể kiểm tra trong Redis CLI:" -ForegroundColor Yellow
Write-Host "  redis-cli" -ForegroundColor White
Write-Host "  KEYS *" -ForegroundColor White
Write-Host "  GET `"users:all`"" -ForegroundColor White
