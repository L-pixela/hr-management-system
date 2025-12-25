// Test script for Performance Service
const axios = require('axios');

const BASE_URL = 'http://localhost';
let authToken = '';

async function test() {
  console.log('🧪 Testing Performance Service Integration\n');

  try {
    // 1. Register a test user
    console.log('1️⃣  Registering test user...');
    await axios.post(`${BASE_URL}/auth/register`, {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    }).catch(() => console.log('   (User already exists, continuing...)'));

    // 2. Login
    console.log('2️⃣  Logging in...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    authToken = loginRes.data.accessToken;
    console.log('   ✅ Login successful, token received\n');

    // 3. Create a performance record
    console.log('3️⃣  Creating performance record...');
    const createRes = await axios.post(
      `${BASE_URL}/performance`,
      {
        employeeId: 'EMP001',
        score: 85,
        comment: 'Excellent work on Q4 project deliverables. Exceeded expectations in team collaboration.',
        reviewedBy: 'MGR001',
        status: 'draft'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    const performanceId = createRes.data.data._id;
    console.log('   ✅ Performance record created:', performanceId);
    console.log('   📊 Score:', createRes.data.data.score);
    console.log('   👤 Employee:', createRes.data.data.employeeId, '\n');

    // 4. Get all performance records
    console.log('4️⃣  Fetching all performance records...');
    const allRes = await axios.get(`${BASE_URL}/performance`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('   ✅ Found', allRes.data.count, 'performance record(s)\n');

    // 5. Get performance by employee ID
    console.log('5️⃣  Fetching performance for EMP001...');
    const empRes = await axios.get(`${BASE_URL}/performance/employee/EMP001`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('   ✅ Found', empRes.data.count, 'record(s) for EMP001\n');

    // 6. Update performance record
    console.log('6️⃣  Updating performance record...');
    await axios.put(
      `${BASE_URL}/performance/${performanceId}`,
      {
        score: 90,
        status: 'approved'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('   ✅ Performance record updated to score: 90, status: approved\n');

    // 7. Get updated record
    console.log('7️⃣  Fetching updated record...');
    const getRes = await axios.get(`${BASE_URL}/performance/${performanceId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('   ✅ Current score:', getRes.data.data.score);
    console.log('   ✅ Current status:', getRes.data.data.status, '\n');

    // 8. Delete performance record
    console.log('8️⃣  Deleting performance record...');
    await axios.delete(`${BASE_URL}/performance/${performanceId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('   ✅ Performance record deleted\n');

    console.log('🎉 All tests passed! Performance service is working correctly! \n');
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    process.exit(1);
  }
}

test();
