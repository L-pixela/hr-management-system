# Microservice Integration Test Script
Write-Host "`n=== Testing Microservice Setup ===" -ForegroundColor Cyan

# Test 1: Register new user
Write-Host "`n1. Registering new user..." -ForegroundColor Yellow
$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$email = "test-$timestamp@example.com"
$registerResponse = curl.exe -s -X POST -H "Content-Type: application/json" `
    -d "{`"email`":`"$email`",`"password`":`"P@ssw0rd!`"}" `
    http://localhost/auth/register
Write-Host $registerResponse

# Test 2: Login
Write-Host "`n2. Logging in..." -ForegroundColor Yellow
$loginResponse = curl.exe -s -X POST -H "Content-Type: application/json" `
    -d "{`"email`":`"$email`",`"password`":`"P@ssw0rd!`"}" `
    http://localhost/auth/login
Write-Host $loginResponse

# Extract token
$loginData = $loginResponse | ConvertFrom-Json -ErrorAction SilentlyContinue
if ($loginData.accessToken) {
    $token = $loginData.accessToken
    Write-Host "`nToken received: $($token.Substring(0,20))..." -ForegroundColor Green
    
    # Test 3: Get user info
    Write-Host "`n3. Getting user info (/auth/me)..." -ForegroundColor Yellow
    $meResponse = curl.exe -s -H "Authorization: Bearer $token" http://localhost/auth/me
    Write-Host $meResponse
    
    # Test 4: Introspect token
    Write-Host "`n4. Introspecting token..." -ForegroundColor Yellow
    $introspectResponse = curl.exe -s -X POST -H "Content-Type: application/json" `
        -d "{`"token`":`"$token`"}" `
        http://localhost/auth/introspect
    Write-Host $introspectResponse
    
    # Test 5: Access employee service (protected)
    Write-Host "`n5. Accessing employee service (with auth)..." -ForegroundColor Yellow
    $employeeResponse = curl.exe -s -H "Authorization: Bearer $token" http://localhost/employees
    Write-Host $employeeResponse
} else {
    Write-Host "`nLogin failed - no token received" -ForegroundColor Red
}

# Test 6: Health checks
Write-Host "`n6. Checking service health..." -ForegroundColor Yellow
Write-Host "Nginx: " -NoNewline
curl.exe -s http://localhost/health
Write-Host "`nAuth: " -NoNewline
curl.exe -s http://localhost:4000/health
Write-Host "`nEmployee: " -NoNewline
curl.exe -s http://localhost:4001/health

Write-Host "`n`n=== Test Complete ===" -ForegroundColor Cyan
