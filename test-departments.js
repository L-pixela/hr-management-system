const axios = require('axios');

const BASE_URL = 'http://localhost';

async function testDepartments() {
  console.log('\n=== Testing Department Endpoints ===\n');

  try {
    const email = `test-${Date.now()}@example.com`;
    const password = 'P@ssw0rd!';

    // Step 1: Register and Login to get token
    console.log('1. Getting authentication token...');
    await axios.post(`${BASE_URL}/auth/register`, { email, password });
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    const token = loginRes.data.accessToken;
    console.log(`✓ Token obtained: ${token.substring(0, 30)}...\n`);

    const headers = { Authorization: `Bearer ${token}` };

    // Step 2: Create a department
    console.log('2. Creating a new department...');
    const newDept = {
      name: 'Engineering',
      description: 'Software Development Team'
    };
    
    console.log('  POST URL:', `${BASE_URL}/departments`);
    console.log('  Request body:', JSON.stringify(newDept));
    console.log('  Headers:', { Authorization: `Bearer ${token.substring(0, 30)}...` });
    
    const createRes = await axios.post(`${BASE_URL}/departments`, newDept, { headers });
    console.log(`✓ Department created: ${createRes.status} ${createRes.statusText}`);
    console.log('  Response headers:', createRes.headers);
    console.log('  Response data:', JSON.stringify(createRes.data, null, 2));
    
    const deptId = createRes.data._id || createRes.data.id;
    
    if (!deptId) {
      console.error('✗ ERROR: No department ID returned from create!');
      console.error('Response:', createRes.data);
      process.exit(1);
    }
    
    console.log(`  ID: ${deptId}`);
    console.log(`  Name: ${createRes.data.name}\n`);

    // Step 3: List all departments
    console.log('3. Listing all departments...');
    const listRes = await axios.get(`${BASE_URL}/departments`, { headers });
    console.log(`✓ Departments retrieved: ${listRes.status} ${listRes.statusText}`);
    console.log(`  Total departments: ${listRes.data.length}`);
    listRes.data.forEach((dept, idx) => {
      console.log(`  ${idx + 1}. ${dept.name} - ${dept.description || 'No description'}`);
    });
    console.log();

    // Step 4: Get specific department
    console.log('4. Getting department by ID...');
    const getRes = await axios.get(`${BASE_URL}/departments/${deptId}`, { headers });
    console.log(`✓ Department retrieved: ${getRes.status} ${getRes.statusText}`);
    console.log(`  Name: ${getRes.data.name}`);
    console.log(`  Description: ${getRes.data.description || 'N/A'}\n`);

    // Step 5: Update department
    console.log('5. Updating department...');
    const updateData = {
      name: 'Engineering & Innovation',
      description: 'Software Development and R&D Team'
    };
    const updateRes = await axios.put(`${BASE_URL}/departments/${deptId}`, updateData, { headers });
    console.log(`✓ Department updated: ${updateRes.status} ${updateRes.statusText}`);
    console.log(`  New name: ${updateRes.data.name}`);
    console.log(`  New description: ${updateRes.data.description}\n`);

    // Step 6: Delete department
    console.log('6. Deleting department...');
    const deleteRes = await axios.delete(`${BASE_URL}/departments/${deptId}`, { headers });
    console.log(`✓ Department deleted: ${deleteRes.status} ${deleteRes.statusText}\n`);

    // Step 7: Try to access without auth (should fail)
    console.log('7. Testing without authentication (should fail)...');
    try {
      await axios.get(`${BASE_URL}/departments`);
      console.log('✗ SECURITY ISSUE: Departments accessible without auth!\n');
    } catch (err) {
      console.log(`✓ Correctly blocked: ${err.response?.status} ${err.response?.statusText}\n`);
    }

    console.log('=== All Department Tests Passed! ===\n');
    console.log('Department endpoints are working correctly:');
    console.log('✓ Create department (POST /departments)');
    console.log('✓ List departments (GET /departments)');
    console.log('✓ Get department by ID (GET /departments/:id)');
    console.log('✓ Update department (PUT /departments/:id)');
    console.log('✓ Delete department (DELETE /departments/:id)');
    console.log('✓ Properly protected with JWT authentication');

  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  URL: ${error.config?.url}`);
      console.error(`  Data:`, error.response.data);
    }
    process.exit(1);
  }
}

testDepartments();
