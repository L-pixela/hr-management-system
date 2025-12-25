<template>
  <div class="dashboard-layout">
    <Sidebar
      v-model:active-tab="activeTab"
      :user="user"
      @logout="logout"
    />

    <main class="main-content">
      <header class="page-header">
        <h2>{{ getTabTitle }}</h2>
      </header>

      <!-- Overview Tab -->
      <div
        v-if="activeTab === 'overview'"
        class="tab-content"
      >
        <StatsCards
          :employee-count="employees.length"
          :department-count="departments.length"
          :performance-count="performanceCount"
        />

        <div class="overview-content">
          <div class="card">
            <div class="card-header">
              <h3>Recent Employees</h3>
            </div>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-if="employees.length === 0"
                  >
                    <td
                      colspan="3"
                      class="empty-cell"
                    >
                      No employees found
                    </td>
                  </tr>
                  <tr
                    v-for="emp in employees.slice(0, 5)"
                    v-else
                    :key="emp._id"
                  >
                    <td>{{ emp.name }}</td>
                    <td>{{ emp.position }}</td>
                    <td>{{ emp.department?.name || 'N/A' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3>Departments Overview</h3>
            </div>
            <div class="list-group">
              <div
                v-if="departments.length === 0"
                class="empty-state"
              >
                No departments created yet
              </div>
              <div
                v-for="dept in departments"
                v-else
                :key="dept._id"
                class="list-item"
              >
                <div class="dept-icon">🏢</div>
                <div class="item-info">
                  <h4>{{ dept.name }}</h4>
                  <p>{{ dept.description || 'No description' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Employees Tab -->
      <div
        v-if="activeTab === 'employees'"
        class="tab-content"
      >
        <div class="content-header">
          <button
            class="btn btn-primary"
            @click="showEmpModal = true"
          >
            <span>+ Add Employee</span>
          </button>
        </div>

        <div class="card">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-if="employees.length === 0"
                >
                  <td
                    colspan="5"
                    class="empty-cell"
                  >
                    No employees found. Click "Add Employee" to create one.
                  </td>
                </tr>
                <tr
                  v-for="emp in employees"
                  v-else
                  :key="emp._id"
                >
                  <td>
                    <strong>{{ emp.name }}</strong>
                  </td>
                  <td>{{ emp.email }}</td>
                  <td>{{ emp.position }}</td>
                  <td>
                    <span class="badge">{{ emp.department?.name || 'N/A' }}</span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button
                        class="btn-action btn-edit"
                        @click="editEmp(emp)"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        class="btn-action btn-delete"
                        @click="deleteEmp(emp._id)"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Departments Tab -->
      <div
        v-if="activeTab === 'departments'"
        class="tab-content"
      >
        <div class="content-header">
          <button
            class="btn btn-primary"
            @click="showDeptModal = true"
          >
            <span>+ Add Department</span>
          </button>
        </div>

        <div class="departments-grid">
          <div
            v-if="departments.length === 0"
            class="empty-state-card"
          >
            <div class="empty-icon">🏢</div>
            <h3>No Departments Yet</h3>
            <p>Create your first department to get started</p>
          </div>
          <div
            v-for="dept in departments"
            v-else
            :key="dept._id"
            class="dept-card"
          >
            <div class="dept-card-header">
              <div class="dept-icon-large">🏢</div>
              <div class="dept-actions">
                <button
                  class="btn-icon btn-edit-icon"
                  @click="editDept(dept)"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  class="btn-icon btn-danger"
                  @click="deleteDept(dept._id)"
                  title="Delete"
                >
                  ×
                </button>
              </div>
            </div>
            <h3>{{ dept.name }}</h3>
            <p>{{ dept.description || 'No description available' }}</p>
            <div class="dept-stats">
              <span>{{ getEmployeeCountByDept(dept._id) }} employees</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Tab -->
      <div
        v-if="activeTab === 'performance'"
        class="tab-content"
      >
        <div class="content-header">
          <button
            class="btn btn-primary"
            @click="showPerfModal = true"
          >
            + Add Performance Review
          </button>
        </div>

        <!-- Filters -->
        <div class="filters-section card">
          <div class="filter-group">
            <label for="employeeFilter">Employee:</label>
            <select
              id="employeeFilter"
              v-model="perfFilters.employeeId"
              @change="fetchPerformances"
            >
              <option value="">
                All Employees
              </option>
              <option
                v-for="emp in employees"
                :key="emp._id"
                :value="emp._id"
              >
                {{ emp.name }} - {{ emp.position }}
              </option>
            </select>
          </div>
          <div class="filter-group">
            <label for="statusFilter">Status:</label>
            <select
              id="statusFilter"
              v-model="perfFilters.status"
              @change="fetchPerformances"
            >
              <option value="">
                All
              </option>
              <option value="draft">
                Draft
              </option>
              <option value="submitted">
                Submitted
              </option>
              <option value="approved">
                Approved
              </option>
            </select>
          </div>
        </div>

        <!-- Performance Records List -->
        <div class="performance-list">
          <div
            v-if="perfLoading"
            class="loading"
          >
            Loading performance records...
          </div>
          <div
            v-else-if="performances.length === 0"
            class="empty-state"
          >
            No performance records found
          </div>
          <div
            v-for="perf in performances"
            v-else
            :key="perf._id"
            class="performance-card card"
          >
            <div class="card-header">
              <div class="performance-info">
                <h3>{{ getEmployeeById(perf.employeeId)?.name || perf.employeeId }}</h3>
                <span :class="['status-badge', `status-${perf.status}`]">
                  {{ perf.status }}
                </span>
              </div>
              <div class="performance-actions">
                <button
                  class="btn btn-sm btn-outline"
                  @click="editPerformance(perf)"
                >
                  Edit
                </button>
                <button
                  class="btn btn-sm btn-text text-danger"
                  @click="deletePerformance(perf._id)"
                >
                  Delete
                </button>
              </div>
            </div>
            <div class="card-body">
              <div class="performance-details">
                <div class="detail-item">
                  <strong>Employee:</strong>
                  <span>{{ getEmployeeById(perf.employeeId)?.name || 'Unknown' }}</span>
                </div>
                <div
                  v-if="getEmployeeById(perf.employeeId)?.position"
                  class="detail-item"
                >
                  <strong>Position:</strong>
                  <span>{{ getEmployeeById(perf.employeeId)?.position }}</span>
                </div>
                <div class="detail-item">
                  <strong>Score:</strong>
                  <span class="score-badge">{{ perf.score }}/100</span>
                </div>
                <div class="detail-item">
                  <strong>Review Date:</strong>
                  {{ formatDate(perf.reviewDate) }}
                </div>
                <div class="detail-item">
                  <strong>Reviewed By:</strong>
                  {{ perf.reviewedBy }}
                </div>
              </div>
              <div
                v-if="perf.comment"
                class="performance-comment"
              >
                <strong>Comments:</strong>
                <p>{{ perf.comment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <DepartmentModal
      :show="showDeptModal"
      :error="modalError"
      :department="editingDept"
      @close="closeDeptModal"
      @submit="saveDept"
    />

    <EmployeeModal
      :show="showEmpModal"
      :departments="departments"
      :error="modalError"
      :employee="editingEmp"
      @close="closeEmpModal"
      @submit="saveEmp"
    />

    <!-- Performance Modal -->
    <div
      v-if="showPerfModal || editingPerformance"
      class="modal-overlay"
      @click.self="closePerfModal"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingPerformance ? 'Edit' : 'Create' }} Performance Review</h3>
          <button
            class="btn btn-text"
            @click="closePerfModal"
          >
            ×
          </button>
        </div>
        <form @submit.prevent="submitPerformance">
          <div class="form-group">
            <label for="employeeId">Employee *</label>
            <select
              id="employeeId"
              v-model="perfFormData.employeeId"
              class="form-select"
              required
              :disabled="editingPerformance !== null"
            >
              <option value="">
                Select an employee
              </option>
              <option
                v-for="emp in employees"
                :key="emp._id"
                :value="emp._id"
              >
                {{ emp.name }} - {{ emp.position }} ({{ emp.department?.name || 'No Dept' }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="score">Performance Score (0-100) *</label>
            <input
              id="score"
              v-model.number="perfFormData.score"
              type="number"
              min="0"
              max="100"
              required
              placeholder="85"
            >
          </div>
          <div class="form-group">
            <label for="reviewedBy">Reviewed By *</label>
            <select
              id="reviewedBy"
              v-model="perfFormData.reviewedBy"
              class="form-select"
              required
            >
              <option value="">
                Select reviewer
              </option>
              <option
                v-for="emp in availableReviewers"
                :key="emp._id"
                :value="emp.name"
              >
                {{ emp.name }} - {{ emp.position }}
              </option>
            </select>
            <small
              v-if="perfFormData.employeeId"
              style="color: #64748b; font-size: 0.75rem; margin-top: 0.25rem; display: block;"
            >
              The selected employee is excluded from reviewers
            </small>
          </div>
          <div class="form-group">
            <label for="comment">Comments</label>
            <textarea
              id="comment"
              v-model="perfFormData.comment"
              rows="4"
              placeholder="Performance feedback..."
            />
          </div>
          <div class="form-group">
            <label for="status">Status *</label>
            <select
              id="status"
              v-model="perfFormData.status"
              class="form-select"
              required
            >
              <option value="draft">
                Draft
              </option>
              <option value="submitted">
                Submitted
              </option>
              <option value="approved">
                Approved
              </option>
            </select>
          </div>
          <div
            v-if="perfFormError"
            class="message error"
          >
            {{ perfFormError }}
          </div>
          <div
            v-if="perfSuccessMessage"
            class="message success"
          >
            {{ perfSuccessMessage }}
          </div>
          <div class="modal-actions">
            <button
              type="button"
              class="btn btn-outline"
              @click="closePerfModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
            >
              {{ editingPerformance ? 'Update' : 'Create' }} Review
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmDialog
      :show="showConfirm"
      :title="confirmConfig.title"
      :message="confirmConfig.message"
      :type="confirmConfig.type"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="handleConfirm"
      @cancel="cancelConfirm"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import client from '../api/client';
import Sidebar from '../components/Sidebar.vue';
import StatsCards from '../components/StatsCards.vue';
import DepartmentModal from '../components/DepartmentModal.vue';
import EmployeeModal from '../components/EmployeeModal.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';

const router = useRouter();
const user = ref(null);
const activeTab = ref(router.currentRoute.value.query.tab || 'overview');
const showDeptModal = ref(false);
const showEmpModal = ref(false);
const editingDept = ref(null);
const editingEmp = ref(null);
const departments = ref([]);
const employees = ref([]);
const performanceCount = ref(0);
const modalError = ref('');
const isLoading = ref(false);

// Performance-specific refs
const performances = ref([]);
const showPerfModal = ref(false);
const editingPerformance = ref(null);
const perfLoading = ref(false);
const perfFormError = ref('');
const perfSuccessMessage = ref('');
const perfFilters = ref({
  employeeId: '',
  status: ''
});
const perfFormData = ref({
  employeeId: '',
  score: null,
  comment: '',
  reviewedBy: '',
  status: 'draft'
});

// Confirmation dialog state
const showConfirm = ref(false);
const confirmConfig = ref({
  title: '',
  message: '',
  type: 'danger',
  onConfirm: null
});

const userInitials = computed(() => {
  if (!user.value?.username) return '?';
  return user.value.username.substring(0, 2).toUpperCase();
});

const getTabTitle = computed(() => {
  const titles = {
    overview: 'Dashboard Overview',
    employees: 'Employee Management',
    departments: 'Department Management',
    performance: 'Performance Reviews'
  };
  return titles[activeTab.value] || 'Dashboard';
});

const getEmployeeCountByDept = (deptId) => {
  return employees.value.filter(emp => emp.department?._id === deptId).length;
};

const getEmployeeById = (employeeId) => {
  return employees.value.find(emp => emp._id === employeeId);
};

// Filter employees for reviewer dropdown - exclude selected employee
const availableReviewers = computed(() => {
  if (!perfFormData.value.employeeId) {
    return employees.value;
  }
  return employees.value.filter(emp => emp._id !== perfFormData.value.employeeId);
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Watch for tab changes to load performance data
watch(activeTab, (newTab) => {
  if (newTab === 'performance') {
    fetchPerformances();
  }
});

onMounted(async () => {
  // Check if token exists before making requests
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found on mount, redirecting to login');
    router.push('/login');
    return;
  }

  try {
    const meRes = await client.get('/auth/me');
    user.value = meRes.data;
    await loadData();
    await loadPerformanceCount();
  } catch (e) {
    console.error('Error loading dashboard data:', e);
    // Auth interceptor handles 401 redirect
    if (e.response?.status === 401) {
      router.push('/login');
    }
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

const loadPerformanceCount = async () => {
  try {
    const res = await client.get('/performance');
    performanceCount.value = res.data.data?.length || res.data.count || 0;
  } catch (err) {
    performanceCount.value = 0;
  }
};

const navigateToPerformance = () => {
  router.push('/performance');
};

const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

// Watch for modal open to clear errors
watch(showDeptModal, (newVal) => {
  if (newVal) {
    modalError.value = '';
  }
});

watch(showEmpModal, (newVal) => {
  if (newVal) {
    modalError.value = '';
  }
});

const createDept = async (formData) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    modalError.value = '';
    await client.post('/departments', formData);
    showDeptModal.value = false;
    editingDept.value = null;
    await loadData();
  } catch (err) {
    modalError.value = err.response?.data?.message || 'Failed to create department';
  } finally {
    isLoading.value = false;
  }
};

const saveDept = async (formData) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    modalError.value = '';
    
    if (editingDept.value) {
      // Update existing department
      await client.put(`/departments/${editingDept.value._id}`, formData);
    } else {
      // Create new department
      await client.post('/departments', formData);
    }
    
    closeDeptModal();
    await loadData();
  } catch (err) {
    modalError.value = err.response?.data?.message || `Failed to ${editingDept.value ? 'update' : 'create'} department`;
  } finally {
    isLoading.value = false;
  }
};

const editDept = (dept) => {
  editingDept.value = dept;
  showDeptModal.value = true;
};

const closeDeptModal = () => {
  showDeptModal.value = false;
  editingDept.value = null;
  modalError.value = '';
};

const createEmp = async (formData) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    modalError.value = '';
    await client.post('/employees', formData);
    showEmpModal.value = false;
    editingEmp.value = null;
    await loadData();
  } catch (err) {
    modalError.value = err.response?.data?.message || 'Failed to create employee';
  } finally {
    isLoading.value = false;
  }
};

const saveEmp = async (formData) => {
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    modalError.value = '';
    
    if (editingEmp.value) {
      // Update existing employee
      await client.put(`/employees/${editingEmp.value._id}`, formData);
    } else {
      // Create new employee
      await client.post('/employees', formData);
    }
    
    closeEmpModal();
    await loadData();
  } catch (err) {
    modalError.value = err.response?.data?.message || `Failed to ${editingEmp.value ? 'update' : 'create'} employee`;
  } finally {
    isLoading.value = false;
  }
};

const editEmp = (emp) => {
  editingEmp.value = emp;
  showEmpModal.value = true;
};

const closeEmpModal = () => {
  showEmpModal.value = false;
  editingEmp.value = null;
  modalError.value = '';
};

const deleteDept = (id) => {
  showConfirmDialog(
    'Delete Department',
    'Are you sure you want to delete this department? This action cannot be undone.',
    async () => {
      try {
        await client.delete(`/departments/${id}`);
        await loadData();
      } catch (error) {
        console.error('Error deleting department:', error);
        alert(error.response?.data?.message || 'Failed to delete department');
      }
    }
  );
};

const deleteEmp = (id) => {
  showConfirmDialog(
    'Delete Employee',
    'Are you sure you want to delete this employee? This action cannot be undone.',
    async () => {
      try {
        await client.delete(`/employees/${id}`);
        await loadData();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert(error.response?.data?.message || 'Failed to delete employee');
      }
    }
  );
};

// Performance methods
const fetchPerformances = async () => {
  perfLoading.value = true;
  try {
    const params = {};
    if (perfFilters.value.employeeId) params.employeeId = perfFilters.value.employeeId;
    if (perfFilters.value.status) params.status = perfFilters.value.status;

    const response = await client.get('/performance', { params });
    performances.value = response.data.data || [];
  } catch (error) {
    console.error('Error fetching performances:', error);
    alert('Failed to load performance records');
  } finally {
    perfLoading.value = false;
  }
};

const submitPerformance = async () => {
  try {
    perfFormError.value = '';
    perfSuccessMessage.value = '';
    
    if (editingPerformance.value) {
      // Update existing
      await client.put(`/performance/${editingPerformance.value._id}`, perfFormData.value);
      perfSuccessMessage.value = 'Performance record updated successfully';
    } else {
      // Create new
      await client.post('/performance', perfFormData.value);
      perfSuccessMessage.value = 'Performance record created successfully';
    }
    
    // Close modal after a short delay to show success message
    setTimeout(() => {
      closePerfModal();
      fetchPerformances();
      loadPerformanceCount();
    }, 1500);
  } catch (error) {
    console.error('Error saving performance:', error);
    perfFormError.value = error.response?.data?.message || 'Failed to save performance record';
  }
};

const deletePerformance = (id) => {
  showConfirmDialog(
    'Delete Performance Review',
    'Are you sure you want to delete this performance review? This action cannot be undone.',
    async () => {
      try {
        await client.delete(`/performance/${id}`);
        fetchPerformances();
        loadPerformanceCount();
      } catch (error) {
        console.error('Error deleting performance:', error);
        alert(error.response?.data?.message || 'Failed to delete performance record');
      }
    }
  );
};

const editPerformance = (perf) => {
  editingPerformance.value = perf;
  perfFormData.value = {
    employeeId: perf.employeeId,
    score: perf.score,
    comment: perf.comment || '',
    reviewedBy: perf.reviewedBy,
    status: perf.status
  };
};

const closePerfModal = () => {
  showPerfModal.value = false;
  editingPerformance.value = null;
  perfFormError.value = '';
  perfSuccessMessage.value = '';
  perfFormData.value = {
    employeeId: '',
    score: null,
    comment: '',
    reviewedBy: '',
    status: 'draft'
  };
};

// Confirmation dialog helpers
const showConfirmDialog = (title, message, onConfirm) => {
  confirmConfig.value = {
    title,
    message,
    type: 'danger',
    onConfirm
  };
  showConfirm.value = true;
};

const handleConfirm = async () => {
  if (confirmConfig.value.onConfirm) {
    await confirmConfig.value.onConfirm();
  }
  cancelConfirm();
};

const cancelConfirm = () => {
  showConfirm.value = false;
  confirmConfig.value = {
    title: '',
    message: '',
    type: 'danger',
    onConfirm: null
  };
};
</script>

<style scoped>
* { box-sizing: border-box; }

.dashboard-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  height: 100vh;
  background: #f5f7fa;
}

.main-content {
  overflow-y: auto;
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.tab-content {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.overview-content {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 2fr 1fr;
}

/* Card Styles */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.card-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.content-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

/* Table Styles */
.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f8fafc;
}

.data-table th {
  text-align: left;
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-table td {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  color: #334155;
}

.data-table tbody tr:hover {
  background: #f8fafc;
}

.empty-cell {
  text-align: center;
  color: #94a3b8;
  padding: 2rem !important;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Departments Grid */
.departments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.dept-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.dept-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dept-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.dept-icon-large {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
}

.dept-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.dept-card p {
  margin: 0 0 1rem 0;
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
}

.dept-stats {
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #3b82f6;
  font-weight: 500;
}

/* List Group */
.list-group {
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.dept-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
}

.item-info p {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Empty States */
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
}

.empty-state-card {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state-card h3 {
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  font-size: 1.5rem;
}

.empty-state-card p {
  margin: 0;
  color: #64748b;
}

/* Buttons */
.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-danger:hover {
  background: #fee2e2;
  color: #dc2626;
}

.btn-action {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.btn-delete {
  color: #dc2626;
  border-color: #fecaca;
}

.btn-delete:hover {
  background: #fee2e2;
  border-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);
}

.btn-edit {
  color: #2563eb;
  border-color: #bfdbfe;
}

.btn-edit:hover {
  background: #dbeafe;
  border-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.dept-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-edit-icon {
  color: #2563eb;
}

.btn-edit-icon:hover {
  background: #dbeafe;
  color: #1e40af;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
}

.form-group input,
.form-group textarea,
.form-group select,
.form-select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Modal Styles */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-in;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 480px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-content h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .overview-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }
  
  .departments-grid {
    grid-template-columns: 1fr;
  }
}

/* Performance Tab Styles */
.filters-section {
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
}

.filter-group label {
  font-weight: 500;
  font-size: 0.875rem;
  color: #64748b;
}

.filter-group select {
  padding: 0.625rem 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9375rem;
  transition: all 0.2s;
}

.filter-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.performance-list {
  display: grid;
  gap: 1rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  font-size: 1.125rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
  font-size: 1.125rem;
}

.performance-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.performance-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.performance-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.performance-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.performance-info h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.status-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-draft {
  background: #f1f5f9;
  color: #475569;
}

.status-submitted {
  background: #dbeafe;
  color: #1e40af;
}

.status-approved {
  background: #dcfce7;
  color: #166534;
}

.performance-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.card-body {
  padding: 1.5rem;
}

.performance-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item strong {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-item span {
  font-size: 0.9375rem;
  color: #1e293b;
}

.score-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%);
  color: #1e40af;
  border-radius: 9999px;
  font-weight: 600;
}

.performance-comment {
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.performance-comment strong {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.performance-comment p {
  margin: 0;
  color: #475569;
  line-height: 1.6;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-in;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.message {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.message.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.message.success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.btn-sm {
  padding: 0.375rem 0.875rem;
  font-size: 0.875rem;
}

.btn-outline {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.btn-outline:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.text-danger {
  color: #dc2626 !important;
}

.btn-text:hover {
  background: #f8fafc;
}
</style>
