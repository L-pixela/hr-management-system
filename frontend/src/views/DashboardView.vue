<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h2>Welcome, {{ user?.username || 'User' }}</h2>
      <button @click="logout" class="btn btn-secondary">Logout</button>
    </header>

    <div class="grid-layout">
      <!-- Departments Section -->
      <section class="card">
        <div class="card-header">
          <h3>Departments</h3>
          <button @click="showDeptModal = true" class="btn btn-sm btn-outline">+ New</button>
        </div>
        <div class="list-group">
          <div v-if="departments.length === 0" class="list-item">No departments found</div>
          <div v-for="dept in departments" :key="dept._id" class="list-item">
            <div class="item-info">
              <h4>{{ dept.name }}</h4>
              <p>{{ dept.description }}</p>
            </div>
            <button @click="deleteDept(dept._id)" class="btn btn-sm btn-text text-danger">×</button>
          </div>
        </div>
      </section>

      <!-- Employees Section -->
      <section class="card">
        <div class="card-header">
          <h3>Employees</h3>
          <button @click="showEmpModal = true" class="btn btn-sm btn-outline">+ New</button>
        </div>
        <div class="list-group">
          <div v-if="employees.length === 0" class="list-item">No employees found</div>
          <div v-for="emp in employees" :key="emp._id" class="list-item">
            <div class="item-info">
              <h4>{{ emp.name }}</h4>
              <p>{{ emp.position }} • {{ emp.department?.name || 'No Dept' }}</p>
            </div>
            <button @click="deleteEmp(emp._id)" class="btn btn-sm btn-text text-danger">×</button>
          </div>
        </div>
      </section>
    </div>

    <!-- Dept Modal -->
    <div v-if="showDeptModal" class="modal">
      <div class="modal-content">
        <h3>Add Department</h3>
        <form @submit.prevent="createDept">
          <div class="form-group">
            <label for="dept-name">Name</label>
            <input id="dept-name" name="name" v-model="newDept.name" required>
          </div>
          <div class="form-group">
            <label for="dept-desc">Description</label>
            <textarea id="dept-desc" name="description" v-model="newDept.description"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" @click="showDeptModal = false" class="btn btn-text">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Emp Modal -->
    <div v-if="showEmpModal" class="modal">
      <div class="modal-content">
        <h3>Add Employee</h3>
        <form @submit.prevent="createEmp">
          <div class="form-group">
            <label for="emp-name">Name</label>
            <input id="emp-name" name="name" v-model="newEmp.name" required>
          </div>
          <div class="form-group">
            <label for="emp-email">Email</label>
            <input id="emp-email" name="email" type="email" v-model="newEmp.email" required>
          </div>
          <div class="form-group">
            <label for="emp-position">Position</label>
            <input id="emp-position" name="position" v-model="newEmp.position" required>
          </div>
          <div class="form-group">
            <label for="emp-dept">Department</label>
            <select id="emp-dept" name="department" v-model="newEmp.department" required class="form-select">
              <option v-for="d in departments" :key="d._id" :value="d._id">{{ d.name }}</option>
            </select>
          </div>
          <div v-if="modalError" class="message error">{{ modalError }}</div>
          <div class="modal-actions">
            <button type="button" @click="showEmpModal = false; modalError = ''" class="btn btn-text">Cancel</button>
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import client from '../api/client';

const router = useRouter();
const user = ref(null);
const departments = ref([]);
const employees = ref([]);
const showDeptModal = ref(false);
const showEmpModal = ref(false);

const newDept = reactive({ name: '', description: '' });
const newEmp = reactive({ name: '', email: '', position: '', department: '' });
const modalError = ref('');

onMounted(async () => {
  try {
    const meRes = await client.get('/auth/me');
    user.value = meRes.data;
    await loadData();
  } catch (e) {
    // Auth interceptor handles redirect
  }
});

const loadData = async () => {
  const [deptRes, empRes] = await Promise.all([
    client.get('/departments'),
    client.get('/employees')
  ]);
  departments.value = deptRes.data;
  employees.value = empRes.data;
};

const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

const createDept = async () => {
  try {
    modalError.value = '';
    await client.post('/departments', newDept);
    showDeptModal.value = false;
    newDept.name = ''; newDept.description = '';
    await loadData();
  } catch (err) {
    modalError.value = err.response?.data?.message || 'Failed to create department';
  }
};

const createEmp = async () => {
  try {
    modalError.value = '';
    await client.post('/employees', newEmp);
    showEmpModal.value = false;
    newEmp.name = ''; newEmp.email = ''; newEmp.position = ''; newEmp.department = '';
    await loadData();
  } catch (err) {
    modalError.value = err.response?.data?.message || 'Failed to create employee';
  }
};

const deleteDept = async (id) => {
  if (!confirm('Delete?')) return;
  await client.delete(`/departments/${id}`);
  await loadData();
};

const deleteEmp = async (id) => {
  if (!confirm('Delete?')) return;
  await client.delete(`/employees/${id}`);
  await loadData();
};
</script>

<style scoped>
.dashboard-container { max-width: 1000px; margin: 0 auto; padding: 2rem 1rem; }
.dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.grid-layout { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
.card { background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 1.5rem; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb; }
.list-group { display: flex; flex-direction: column; gap: 0.5rem; }
.list-item { padding: 0.75rem; background: #f9fafb; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; }
.item-info h4 { margin: 0; font-size: 0.95rem; font-weight: 500; }
.item-info p { margin: 2px 0 0; font-size: 0.85rem; color: #6b7280; }
.btn { padding: 0.5rem 1rem; border-radius: 6px; border: none; font-weight: 500; cursor: pointer; }
.btn-secondary { background: #e5e7eb; color: #111827; }
.btn-outline { border: 1px solid #4f46e5; color: #4f46e5; background: transparent; padding: 0.25rem 0.5rem; }
.btn-text { background: transparent; color: #ef4444; font-size: 1.25rem; padding: 0 0.5rem; }
.btn-primary { background: #4f46e5; color: white; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 0.25rem; font-size: 0.875rem; }
.form-group input, .form-group textarea, .form-select { width: 100%; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 6px; box-sizing: border-box;}
.modal { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal-content { background: white; padding: 2rem; border-radius: 12px; width: 90%; max-width: 400px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; }
.message { margin-top: 1rem; text-align: center; font-size: 0.875rem; }
.message.error { color: #ef4444; }
</style>
