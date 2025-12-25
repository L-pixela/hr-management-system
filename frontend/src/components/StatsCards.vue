<template>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon blue">
        👥
      </div>
      <div class="stat-info">
        <div class="stat-label">
          Total Employees
        </div>
        <div class="stat-value">
          {{ employeeCount }}
        </div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon green">
        🏢
      </div>
      <div class="stat-info">
        <div class="stat-label">
          Departments
        </div>
        <div class="stat-value">
          {{ departmentCount }}
        </div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon purple">
        ⭐
      </div>
      <div class="stat-info">
        <div class="stat-label">
          Performance Reviews
        </div>
        <div class="stat-value">
          {{ performanceCount }}
        </div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon orange">
        📈
      </div>
      <div class="stat-info">
        <div class="stat-label">
          Active Status
        </div>
        <div class="stat-value">
          100%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  employeeCount: {
    type: Number,
    default: 0
  },
  departmentCount: {
    type: Number,
    default: 0
  },
  performanceCount: {
    type: Number,
    default: 0
  }
});
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.blue { background: #dbeafe; }
.stat-icon.green { background: #d1fae5; }
.stat-icon.purple { background: #e9d5ff; }
.stat-icon.orange { background: #fed7aa; }

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
}
</style>
