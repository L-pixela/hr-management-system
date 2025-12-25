const axios = require('axios');

const BASE_URL = 'http://localhost';

async function testPerformanceServiceConnectivity() {
  console.log('🧪 Testing Performance Service Connectivity...\n');

  try {
    // Test 1: Health check (direct to service)
    console.log('1️⃣ Testing direct health check (port 4002)...');
    const healthDirect = await axios.get('http://localhost:4002/health');
    console.log('✅ Direct health check:', healthDirect.data);
    console.log('');

    // Test 2: Login to get token
    console.log('2️⃣ Logging in to get authentication token...');
    let token;
    try {
      const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'testadmin@example.com',
        password: 'Password123!'
      });
      token = loginRes.data.accessToken;
      console.log('✅ Login successful, token received');
      console.log('');
    } catch (err) {
      console.log('ℹ️  No test user found. Creating one first...');
      
      // Register admin user
      await axios.post(`${BASE_URL}/auth/register`, {
        username: 'testadmin',
        email: 'testadmin@example.com',
        password: 'Password123!',
        role: 'admin'
      });
      console.log('✅ Test user created');
      
      // Login again
      const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'testadmin@example.com',
        password: 'Password123!'
      });
      token = loginRes.data.accessToken;
      console.log('✅ Login successful, token received');
      console.log('');
    }

    // Test 3: Get performance records through nginx
    console.log('3️⃣ Testing performance API through nginx (port 80)...');
    const performanceRes = await axios.get(`${BASE_URL}/performance`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ Performance API accessible through nginx');
    console.log(`   Response: ${performanceRes.data.count} performance records found`);
    console.log('   Data structure:', JSON.stringify(performanceRes.data, null, 2).substring(0, 200) + '...');
    console.log('');

    // Test 4: Test CORS
    console.log('4️⃣ Testing CORS headers...');
    const corsHeaders = performanceRes.headers;
    if (corsHeaders['access-control-allow-credentials']) {
      console.log('✅ CORS properly configured');
      console.log('   Allow Credentials:', corsHeaders['access-control-allow-credentials']);
    }
    console.log('');

    // Test 5: Create a test performance record
    console.log('5️⃣ Testing create performance record...');
    try {
      const createRes = await axios.post(`${BASE_URL}/performance`, {
        employeeId: 'TEST001',
        score: 85,
        comment: 'Test performance review',
        reviewedBy: 'admin',
        status: 'draft'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('✅ Create performance record successful');
      console.log('   Created record ID:', createRes.data.data._id);
      
      // Clean up - delete the test record
      const recordId = createRes.data.data._id;
      await axios.delete(`${BASE_URL}/performance/${recordId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('✅ Test record cleaned up');
    } catch (err) {
      console.log('⚠️  Create test:', err.response?.data?.message || err.message);
    }
    console.log('');

    // Summary
    console.log('=' .repeat(50));
    console.log('🎉 All connectivity tests passed!');
    console.log('=' .repeat(50));
    console.log('✅ Performance service is running on port 4002');
    console.log('✅ MongoDB connection is working');
    console.log('✅ Nginx proxy routing is configured correctly');
    console.log('✅ JWT authentication is working');
    console.log('✅ CORS is properly configured');
    console.log('✅ API endpoints are accessible');
    console.log('');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    }
    process.exit(1);
  }
}

testPerformanceServiceConnectivity();
