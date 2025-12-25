<template>
  <div
    v-if="show"
    class="modal"
    @click.self="$emit('close')"
  >
    <div class="modal-content">
      <h3>{{ editMode ? 'Edit' : 'Add' }} Department</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="dept-name">Name</label>
          <input
            id="dept-name"
            v-model="formData.name"
            name="name"
            required
          >
        </div>
        <div class="form-group">
          <label for="dept-desc">Description</label>
          <textarea
            id="dept-desc"
            v-model="formData.description"
            name="description"
          />
        </div>
        <div
          v-if="error"
          class="message error"
        >
          {{ error }}
        </div>
        <div class="modal-actions">
          <button
            type="button"
            class="btn btn-text"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-primary"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  department: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'submit']);

const formData = reactive({ name: '', description: '' });
const editMode = computed(() => props.department !== null);

watch(() => props.show, (newVal) => {
  if (newVal && props.department) {
    // Edit mode - populate form
    formData.name = props.department.name;
    formData.description = props.department.description || '';
  } else if (!newVal) {
    // Reset form when closing
    formData.name = '';
    formData.description = '';
  }
});

const handleSubmit = () => {
  emit('submit', { ...formData });
};
</script>

<style scoped>
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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
.form-group textarea {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-text {
  background: transparent;
  color: #64748b;
}

.btn-text:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.message {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.message.error {
  background: #fee2e2;
  color: #dc2626;
}
</style>
