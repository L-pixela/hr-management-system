<template>
  <div class="performance-container">
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
        <label for="employeeFilter">Employee ID:</label>
        <input
          id="employeeFilter"
          v-model="filters.employeeId"
          type="text"
          placeholder="Filter by employee ID"
          @input="fetchPerformances"
        >
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
            <h3>{{ perf.employeeId }}</h3>
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
            <label for="employeeId">Employee ID *</label>
            <input
              id="employeeId"
              v-model="formData.employeeId"
              type="text"
              required
              :disabled="editingPerformance !== null"
              placeholder="e.g., EMP001"
            >
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
  </div>
</template>

<script>
import apiClient from '../api/client';

export default {
  name: 'PerformanceView',
  data() {
    return {
      performances: [],
      loading: false,
      showCreateModal: false,
      editingPerformance: null,
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
  mounted() {
    this.fetchPerformances();
  },
  methods: {
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
        if (this.editingPerformance) {
          // Update existing
          await apiClient.put(`/performance/${this.editingPerformance._id}`, this.formData);
          alert('Performance record updated successfully');
        } else {
          // Create new
          await apiClient.post('/performance', this.formData);
          alert('Performance record created successfully');
        }
        this.closeModal();
        this.fetchPerformances();
      } catch (error) {
        console.error('Error saving performance:', error);
        alert(error.response?.data?.message || 'Failed to save performance record');
      }
    },

    async deletePerformance(id) {
      if (!confirm('Are you sure you want to delete this performance record?')) {
        return;
      }
      try {
        await apiClient.delete(`/performance/${id}`);
        alert('Performance record deleted successfully');
        this.fetchPerformances();
      } catch (error) {
        console.error('Error deleting performance:', error);
        alert('Failed to delete performance record');
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
    }
  }
};
</script>

<style scoped>
.performance-container {
  max-width: 1200px;
  margin: 0 auto;
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
  color: #333;
}

.filters-section {
  padding: 1rem;
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
  font-size: 0.9rem;
  color: #555;
}

.filter-group input,
.filter-group select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
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
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.performance-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.performance-info h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-draft {
  background: #f0f0f0;
  color: #666;
}

.status-submitted {
  background: #fff3cd;
  color: #856404;
}

.status-approved {
  background: #d4edda;
  color: #155724;
}

.performance-actions {
  display: flex;
  gap: 0.5rem;
}

.card-body {
  padding: 1rem;
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
  color: #666;
  font-size: 0.9rem;
}

.score-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #007bff;
  color: white;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
}

.performance-comment {
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.performance-comment p {
  margin: 0.5rem 0 0 0;
  color: #555;
  line-height: 1.6;
}

.loading,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
  font-size: 1.1rem;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
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
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #666;
  font-size: 0.85rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

/* Button styles */
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

.btn-outline {
  background: transparent;
  border: 1px solid #007bff;
  color: #007bff;
}

.btn-outline:hover {
  background: #007bff;
  color: white;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.9rem;
}

.btn-text {
  background: transparent;
  padding: 0.25rem 0.5rem;
}

.text-danger {
  color: #dc3545;
}

.text-danger:hover {
  color: #c82333;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
