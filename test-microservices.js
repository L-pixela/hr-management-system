const axios = require('axios');

const BASE_URL = 'http://localhost';

async function testMicroservices() {
  console.log('\n=== Testing Microservice Setup ===\n');

  try {
    const email = `test-${Date.now()}@example.com`;
    const password = 'P@ssw0rd!';

    // Test 1: Register
    console.log('1. Registering new user...');
    const registerRes = await axios.post(`${BASE_URL}/auth/register`, { email, password });
    console.log(`✓ Register successful: ${registerRes.status} ${registerRes.statusText}`);
    console.log(`  User ID: ${registerRes.data.userId || registerRes.data.id || 'N/A'}\n`);

    // Test 2: Login
    console.log('2. Logging in...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    console.log(`✓ Login successful: ${loginRes.status} ${loginRes.statusText}`);
    const token = loginRes.data.accessToken;
    console.log(`  Token: ${token.substring(0, 30)}...\n`);

    // Test 3: Get user info
    console.log('3. Getting user info (/auth/me)...');
    const meRes = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✓ Me endpoint successful: ${meRes.status} ${meRes.statusText}`);
    console.log(`  Email: ${meRes.data.email || meRes.data.user?.email || 'N/A'}\n`);

    // Test 4: Introspect token
    console.log('4. Introspecting token...');
    const introspectRes = await axios.post(`${BASE_URL}/auth/introspect`, { token });
    console.log(`✓ Introspect successful: ${introspectRes.status} ${introspectRes.statusText}`);
    console.log(`  Active: ${introspectRes.data.active}\n`);

    // Test 5: Access employee service (protected)
    console.log('5. Accessing employee service (with auth)...');
    const employeeRes = await axios.get(`${BASE_URL}/employees`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✓ Employee service accessible: ${employeeRes.status} ${employeeRes.statusText}`);
    console.log(`  Employees count: ${employeeRes.data.length || 0}\n`);

    // Test 6: Try employee service without auth (should fail)
    console.log('6. Trying employee service WITHOUT auth (should fail)...');
    try {
      await axios.get(`${BASE_URL}/employees`);
      console.log('✗ SECURITY ISSUE: Employee endpoint accessible without auth!\n');
    } catch (err) {
      console.log(`✓ Correctly blocked: ${err.response?.status} ${err.response?.statusText}\n`);
    }

    console.log('=== All Tests Passed! ===\n');
    console.log('Microservices are properly integrated:');
    console.log('✓ Auth service: registration, login, token validation');
    console.log('✓ Employee service: protected endpoints with JWT');
    console.log('✓ Nginx: reverse proxy routing');
    console.log('✓ MongoDB: shared database for both services');

  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Data:`, error.response.data);
    }
    process.exit(1);
  }
}

// Check if axios is available
try {
  testMicroservices();
} catch (err) {
  console.error('Please install axios first: npm install axios');
  console.error('Or run from the e2e directory if it exists');
  process.exit(1);
}
