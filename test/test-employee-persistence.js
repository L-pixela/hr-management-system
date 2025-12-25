const axios = require('axios');

const BASE_URL = 'http://localhost';

async function testEmployeeCreation() {
    try {
        console.log('1. Registering/Logging in User...');
        let token;
        try {
            const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'test@admin.com',
                password: 'password123'
            });
            token = loginRes.data.accessToken;
            console.log('✅ Logged in successfully');
        } catch (e) {
            console.log('Login failed, trying registration...');
            await axios.post(`${BASE_URL}/auth/register`, {
                username: 'Test Admin',
                email: 'test@admin.com',
                password: 'password123',
                role: 'admin'
            });
            const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'test@admin.com',
                password: 'password123'
            });
            token = loginRes.data.accessToken;
            console.log('✅ Registered and logged in');
        }

        const headers = { Authorization: `Bearer ${token}` };

        console.log('\n2. Creating Department...');
        const deptRes = await axios.post(`${BASE_URL}/departments`, {
            name: 'Testing Dept ' + Date.now(),
            description: 'Created by test script'
        }, { headers });
        const deptId = deptRes.data._id;
        console.log(`✅ Department created: ${deptId}`);

        console.log('\n3. Creating Employee...');
        const empData = {
            name: 'Test Employee',
            email: `test.emp.${Date.now()}@example.com`,
            position: 'Developer',
            department: deptId
        };

        try {
            const empRes = await axios.post(`${BASE_URL}/employees`, empData, { headers });
            console.log(`✅ Employee created: ${empRes.data._id}`);
            console.log('Response data:', empRes.data);
        } catch (error) {
            console.error('❌ Failed to create employee:', error.response?.data || error.message);
            return;
        }

        console.log('\n4. Verifying Employee in List...');
        const listRes = await axios.get(`${BASE_URL}/employees`, { headers });
        const found = listRes.data.find(e => e.email === empData.email);

        if (found) {
            console.log('✅ SUCCESS: Employee found in list!');
            console.log('Employee Record:', found);
        } else {
            console.error('❌ FAILURE: Employee created but not found in list.');
            console.log('List count:', listRes.data.length);
        }

    } catch (error) {
        console.error('Test Failed:', error.response?.data || error.message);
    }
}

testEmployeeCreation();
