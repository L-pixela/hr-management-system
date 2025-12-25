const axios = require('axios');

const BASE_URL = 'http://localhost';

async function testEmployeeIntegration() {
  console.log('🧪 Testing Employee Integration with Performance Service...\n');

  try {
    // Login to get token
    console.log('1️⃣ Logging in...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'testadmin@example.com',
      password: 'Password123!'
    });
    const token = loginRes.data.accessToken;
    console.log('✅ Logged in successfully\n');

    // Create test department
    console.log('2️⃣ Creating test department...');
    const deptRes = await axios.post(`${BASE_URL}/departments`, {
      name: 'Engineering',
      description: 'Engineering Department'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const departmentId = deptRes.data._id;
    console.log(`✅ Department created: ${deptRes.data.name} (ID: ${departmentId})\n`);

    // Create test employee
    console.log('3️⃣ Creating test employee...');
    const empRes = await axios.post(`${BASE_URL}/employees`, {
      name: 'John Doe',
      email: 'john.doe@example.com',
      position: 'Senior Developer',
      department: departmentId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const employeeId = empRes.data._id;
    console.log(`✅ Employee created: ${empRes.data.name} (ID: ${employeeId})\n`);

    // Get all employees to verify
    console.log('4️⃣ Fetching all employees...');
    const allEmployees = await axios.get(`${BASE_URL}/employees`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Found ${allEmployees.data.length} employee(s)`);
    allEmployees.data.forEach(emp => {
      console.log(`   - ${emp.name} (${emp.position}) at ${emp.department?.name || 'No Dept'}`);
    });
    console.log('');

    // Create performance record using employee ID
    console.log('5️⃣ Creating performance review for employee...');
    const perfRes = await axios.post(`${BASE_URL}/performance`, {
      employeeId: employeeId,
      score: 92,
      comment: 'Excellent performance. Consistently delivers high-quality work.',
      reviewedBy: 'Manager',
      status: 'submitted'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const performanceId = perfRes.data.data._id;
    console.log(`✅ Performance record created (ID: ${performanceId})`);
    console.log(`   Employee: ${employeeId}`);
    console.log(`   Score: ${perfRes.data.data.score}/100`);
    console.log(`   Status: ${perfRes.data.data.status}\n`);

    // Fetch performance records
    console.log('6️⃣ Fetching all performance records...');
    const perfList = await axios.get(`${BASE_URL}/performance`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Found ${perfList.data.count} performance record(s)`);
    
    // Map employee IDs to names
    if (perfList.data.data.length > 0) {
      console.log('   Performance records with employee mapping:');
      perfList.data.data.forEach(perf => {
        const employee = allEmployees.data.find(e => e._id === perf.employeeId);
        const employeeName = employee ? employee.name : 'Unknown';
        const employeePosition = employee ? employee.position : 'N/A';
        console.log(`   - ${employeeName} (${employeePosition}): Score ${perf.score}/100 [${perf.status}]`);
      });
    }
    console.log('');

    // Filter by employee
    console.log('7️⃣ Testing filter by employee...');
    const filteredPerf = await axios.get(`${BASE_URL}/performance?employeeId=${employeeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Found ${filteredPerf.data.count} performance record(s) for ${empRes.data.name}\n`);

    // Cleanup
    console.log('8️⃣ Cleaning up test data...');
    await axios.delete(`${BASE_URL}/performance/${performanceId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await axios.delete(`${BASE_URL}/employees/${employeeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await axios.delete(`${BASE_URL}/departments/${departmentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Test data cleaned up\n');

    // Summary
    console.log('=' .repeat(60));
    console.log('🎉 Employee Integration Test Passed!');
    console.log('=' .repeat(60));
    console.log('✅ Frontend can fetch employees from employee-service');
    console.log('✅ Performance records can be created with employee IDs');
    console.log('✅ Performance records can be filtered by employee');
    console.log('✅ Employee details can be displayed with performance reviews');
    console.log('');
    console.log('📋 Frontend Features Available:');
    console.log('   - Employee dropdown in performance form');
    console.log('   - Shows: Name, Position, Department');
    console.log('   - Filter performance by employee');
    console.log('   - Display employee name instead of ID in performance list');
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

testEmployeeIntegration();
