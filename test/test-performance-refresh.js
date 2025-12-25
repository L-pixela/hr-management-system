const axios = require('axios');

const BASE_URL = 'http://localhost';

async function testPerformanceRefresh() {
  console.log('🔍 Testing Performance Tab Refresh Issue...\n');

  try {
    // Step 0: Register user first (ignore errors if already exists)
    console.log('0️⃣ Creating test user...');
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123'
      });
      console.log('✅ User created\n');
    } catch (err) {
      console.log('ℹ️  User might already exist, continuing...\n');
    }

    // Step 1: Login to get token
    console.log('1️⃣ Logging in...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'testuser@example.com',
      password: 'password123'
    });
    
    const token = loginRes.data.accessToken;
    console.log('✅ Login successful');
    console.log('Token received:', token.substring(0, 20) + '...\n');

    // Step 2: Test /auth/me endpoint (called on mount)
    console.log('2️⃣ Testing /auth/me endpoint (simulating page refresh)...');
    try {
      const userRes = await axios.get(`${BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ /auth/me successful');
      console.log('User data:', JSON.stringify(userRes.data, null, 2), '\n');
    } catch (error) {
      console.error('❌ /auth/me failed!');
      console.error('Status:', error.response?.status);
      console.error('Error:', error.response?.data);
      console.error('Headers sent:', error.config.headers);
      return;
    }

    // Step 3: Test /employees endpoint (called on mount)
    console.log('3️⃣ Testing /employees endpoint...');
    try {
      const empRes = await axios.get(`${BASE_URL}/employees`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ /employees successful');
      console.log('Employees count:', empRes.data?.length || 0, '\n');
    } catch (error) {
      console.error('❌ /employees failed!');
      console.error('Status:', error.response?.status);
      console.error('Error:', error.response?.data, '\n');
    }

    // Step 4: Test /performance endpoint (called on mount)
    console.log('4️⃣ Testing /performance endpoint...');
    try {
      const perfRes = await axios.get(`${BASE_URL}/performance`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✅ /performance successful');
      console.log('Performance records:', perfRes.data.count || 0, '\n');
    } catch (error) {
      console.error('❌ /performance failed!');
      console.error('Status:', error.response?.status);
      console.error('Error:', error.response?.data);
      
      // Check if it's a token issue
      if (error.response?.status === 401) {
        console.error('\n🔴 TOKEN ISSUE DETECTED!');
        console.error('The performance service is rejecting the token');
        console.error('Response:', JSON.stringify(error.response.data, null, 2));
      }
      return;
    }

    console.log('✅ All endpoints working! No token issues found.');
    console.log('\n💡 If you\'re still seeing issues in the browser:');
    console.log('   1. Open browser DevTools (F12)');
    console.log('   2. Go to Application tab > Local Storage');
    console.log('   3. Verify token exists after refresh');
    console.log('   4. Check Network tab for failed requests');
    console.log('   5. Look at request headers for Authorization header');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testPerformanceRefresh();
