<template>
  <div class="performance-layout">
    <Sidebar
      active-tab="performance"
      :user="user"
      @logout="logout"
      @update:active-tab="navigateToDashboard"
      @navigate-performance="() => {}"
    />

    <main class="main-content">
      <header class="page-header">
        <h2>Performance Management</h2>
        <button
          class="btn btn-primary"
          @click="showCreateModal = true"
        >
          + Add Performance Review
        </button>
      </header>

    <!-- Filters -->
    <div class="filters-section card">
      <div class="filter-group">
        <label for="employeeFilter">Employee:</label>
        <select
          id="employeeFilter"
          v-model="filters.employeeId"
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
          v-model="filters.status"
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
        v-if="loading"
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

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || editingPerformance"
      class="modal-overlay"
      @click.self="closeModal"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingPerformance ? 'Edit' : 'Create' }} Performance Review</h3>
          <button
            class="btn btn-text"
            @click="closeModal"
          >
            ×
          </button>
        </div>
        <form @submit.prevent="submitPerformance">
          <div class="form-group">
            <label for="employeeId">Employee *</label>
            <select
              id="employeeId"
              v-model="formData.employeeId"
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
              v-model.number="formData.score"
              type="number"
              min="0"
              max="100"
              required
              placeholder="85"
            >
          </div>
          <div class="form-group">
            <label for="reviewedBy">Reviewed By *</label>
            <input
              id="reviewedBy"
              v-model="formData.reviewedBy"
              type="text"
              required
              placeholder="e.g., MGR001"
            >
          </div>
          <div class="form-group">
            <label for="status">Status</label>
            <select
              id="status"
              v-model="formData.status"
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
          <div class="form-group">
            <label for="comment">Comments</label>
            <textarea
              id="comment"
              v-model="formData.comment"
              rows="4"
              maxlength="1000"
              placeholder="Enter performance review comments..."
            />
            <small>{{ formData.comment?.length || 0 }}/1000 characters</small>
          </div>
          <div
            v-if="formError"
            class="message error"
          >
            {{ formError }}
          </div>
          <div
            v-if="successMessage"
            class="message success"
          >
            {{ successMessage }}
          </div>
          <div class="modal-actions">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
            >
              {{ editingPerformance ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    </main>
  </div>
</template>

<script>
import apiClient from '../api/client';
import Sidebar from '../components/Sidebar.vue';

export default {
  name: 'PerformanceView',
  components: {
    Sidebar
  },
  data() {
    return {
      user: null,
      performances: [],
      employees: [],
      loading: false,
      showCreateModal: false,
      editingPerformance: null,
      formError: '',
      successMessage: '',
      filters: {
        employeeId: '',
        status: ''
      },
      formData: {
        employeeId: '',
        score: null,
        comment: '',
        reviewedBy: '',
        status: 'draft'
      }
    };
  },
  async mounted() {
    // Check if token exists before making requests
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found on mount, redirecting to login');
      this.$router.push('/login');
      return;
    }

    try {
      await this.fetchUser();
      await this.fetchEmployees();
      this.fetchPerformances();
    } catch (error) {
      console.error('Error during mount:', error);
      // If any critical fetch fails, check token again
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        this.$router.push('/login');
      }
    }
  },
  computed: {
    // Helper to get employee by ID
    getEmployeeById() {
      return (employeeId) => {
        return this.employees.find(emp => emp._id === employeeId);
      };
    }
  },
  methods: {
    async fetchUser() {
      try {
        const response = await apiClient.get('/auth/me');
        this.user = response.data;
      } catch (error) {
        console.error('Error fetching user:', error);
        if (error.response?.status === 401) {
          console.error('Token invalid or expired');
          throw error; // Re-throw to be caught in mounted
        }
      }
    },
    async fetchEmployees() {
      try {
        const response = await apiClient.get('/employees');
        this.employees = response.data || [];
      } catch (error) {
        console.error('Error fetching employees:', error);
        this.employees = [];
      }
    },
    async fetchPerformances() {
      this.loading = true;
      try {
        const params = {};
        if (this.filters.employeeId) params.employeeId = this.filters.employeeId;
        if (this.filters.status) params.status = this.filters.status;

        const response = await apiClient.get('/performance', { params });
        this.performances = response.data.data || [];
      } catch (error) {
        console.error('Error fetching performances:', error);
        alert('Failed to load performance records');
      } finally {
        this.loading = false;
      }
    },

    async submitPerformance() {
      try {
        this.formError = '';
        this.successMessage = '';
        
        if (this.editingPerformance) {
          // Update existing
          await apiClient.put(`/performance/${this.editingPerformance._id}`, this.formData);
          this.successMessage = 'Performance record updated successfully';
        } else {
          // Create new
          await apiClient.post('/performance', this.formData);
          this.successMessage = 'Performance record created successfully';
        }
        
        // Close modal after a short delay to show success message
        setTimeout(() => {
          this.closeModal();
          this.fetchPerformances();
        }, 1500);
      } catch (error) {
        console.error('Error saving performance:', error);
        this.formError = error.response?.data?.message || 'Failed to save performance record';
      }
    },

    async deletePerformance(id) {
      if (!confirm('Are you sure you want to delete this performance record?')) {
        return;
      }
      try {
        await apiClient.delete(`/performance/${id}`);
        this.fetchPerformances();
      } catch (error) {
        console.error('Error deleting performance:', error);
        alert(error.response?.data?.message || 'Failed to delete performance record');
      }
    },

    editPerformance(perf) {
      this.editingPerformance = perf;
      this.formData = {
        employeeId: perf.employeeId,
        score: perf.score,
        comment: perf.comment || '',
        reviewedBy: perf.reviewedBy,
        status: perf.status
      };
    },

    closeModal() {
      this.showCreateModal = false;
      this.editingPerformance = null;
      this.formError = '';
      this.successMessage = '';
      this.formData = {
        employeeId: '',
        score: null,
        comment: '',
        reviewedBy: '',
        status: 'draft'
      };
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },

    navigateToDashboard(tab) {
      this.$router.push({ path: '/', query: { tab } });
    }
  }
};
</script>

<style scoped>
* { box-sizing: border-box; }

.performance-layout {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h2 {
  margin: 0;
  color: #1e293b;
  font-size: 2rem;
  font-weight: 700;
}

/* Card Styles */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

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

.filter-group input,
.filter-group select {
  padding: 0.625rem 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9375rem;
  transition: all 0.2s;
}

.filter-group input:focus,
.filter-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.performance-list {
  display: grid;
  gap: 1rem;
}

.performance-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.performance-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.performance-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.performance-info h3 {
  margin: 0;
  color: #1e293b;
  font-size: 1.125rem;
  font-weight: 600;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-draft {
  background: #f1f5f9;
  color: #64748b;
}

.status-submitted {
  background: #fef3c7;
  color: #92400e;
}

.status-approved {
  background: #d1fae5;
  color: #065f46;
}

.performance-actions {
  display: flex;
  gap: 0.5rem;
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
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.detail-item span {
  color: #1e293b;
  font-weight: 400;
}

.score-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.9375rem;
}

.performance-comment {
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.performance-comment strong {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.performance-comment p {
  margin: 0.5rem 0 0 0;
  color: #475569;
  line-height: 1.6;
  font-size: 0.9375rem;
}

.loading,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
  font-size: 1rem;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
}

form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #1e293b;
  font-size: 0.9375rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-family: inherit;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #64748b;
  font-size: 0.8125rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.message {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
}

.message.error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.message.success {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

/* Button styles */
.btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
  transform: translateY(-1px);
}

.btn-secondary {
  background: #64748b;
  color: white;
}

.btn-secondary:hover {
  background: #475569;
}

.btn-outline {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.btn-outline:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.btn-text {
  background: transparent;
  padding: 0.375rem 0.75rem;
  color: #64748b;
}

.btn-text:hover {
  background: #f8fafc;
  color: #475569;
}

.text-danger {
  color: #ef4444;
}

.text-danger:hover {
  color: #dc2626;
  background: #fef2f2;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
