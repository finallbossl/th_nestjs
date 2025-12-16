# Script test tất cả các chức năng của hệ thống
# Chạy: .\test-all.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Testing All System Functions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Test GraphQL
Write-Host "`n[1/4] Testing GraphQL API..." -ForegroundColor Yellow
try {
    $graphqlResponse = Invoke-RestMethod -Uri "http://localhost:3000/graphql" `
        -Method Post `
        -ContentType "application/json" `
        -Body '{"query": "{ users { id name email } }"}'
    Write-Host "✓ GraphQL Query successful" -ForegroundColor Green
    Write-Host "  Response: $($graphqlResponse | ConvertTo-Json -Depth 2)" -ForegroundColor Gray
} catch {
    Write-Host "✗ GraphQL Query failed: $_" -ForegroundColor Red
}

# Test RESTful API
Write-Host "`n[2/4] Testing RESTful API..." -ForegroundColor Yellow
try {
    $restResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/users"
    Write-Host "✓ RESTful API successful" -ForegroundColor Green
    Write-Host "  Found $($restResponse.Count) users" -ForegroundColor Gray
} catch {
    Write-Host "✗ RESTful API failed: $_" -ForegroundColor Red
}

# Test gRPC
Write-Host "`n[3/4] Testing gRPC..." -ForegroundColor Yellow
try {
    # Kiểm tra xem grpcurl có sẵn không
    $grpcurlExists = Get-Command grpcurl -ErrorAction SilentlyContinue
    if ($grpcurlExists) {
        $grpcResponse = grpcurl -plaintext -d '{}' localhost:5000 user.UserService/FindAll 2>&1
        Write-Host "✓ gRPC call successful" -ForegroundColor Green
        Write-Host "  Response: $grpcResponse" -ForegroundColor Gray
    } else {
        Write-Host "⚠ grpcurl not found. Install from: https://github.com/fullstorydev/grpcurl/releases" -ForegroundColor Yellow
        Write-Host "  Or use BloomRPC GUI tool" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ gRPC test failed: $_" -ForegroundColor Red
}

# Test Redis Cache
Write-Host "`n[4/4] Testing Redis Cache..." -ForegroundColor Yellow
try {
    # Kiểm tra Redis qua Docker
    $dockerExists = Get-Command docker -ErrorAction SilentlyContinue
    if ($dockerExists) {
        $redisRunning = docker ps --filter "name=redis-server" --format "{{.Names}}" 2>&1
        if ($redisRunning -like "*redis-server*") {
            $redisKeys = docker exec redis-server redis-cli KEYS "*" 2>&1
            Write-Host "✓ Redis is running" -ForegroundColor Green
            if ($redisKeys) {
                Write-Host "  Cache keys found: $($redisKeys.Count) keys" -ForegroundColor Gray
                Write-Host "  Keys: $redisKeys" -ForegroundColor Gray
            } else {
                Write-Host "  No cache keys found (cache might be empty)" -ForegroundColor Gray
            }
        } else {
            Write-Host "⚠ Redis container not running" -ForegroundColor Yellow
            Write-Host "  Start with: docker start redis-server" -ForegroundColor Yellow
        }
    } else {
        # Thử kiểm tra Redis trực tiếp
        $redisCliExists = Get-Command redis-cli -ErrorAction SilentlyContinue
        if ($redisCliExists) {
            $pingResult = redis-cli ping 2>&1
            if ($pingResult -eq "PONG") {
                $redisKeys = redis-cli KEYS "*" 2>&1
                Write-Host "✓ Redis is running" -ForegroundColor Green
                Write-Host "  Cache keys: $redisKeys" -ForegroundColor Gray
            } else {
                Write-Host "⚠ Redis not responding" -ForegroundColor Yellow
            }
        } else {
            Write-Host "⚠ Redis CLI not found. Redis might be running but CLI not installed." -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "✗ Redis test failed: $_" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Testing Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan


