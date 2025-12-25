<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1 class="logo">
        HR System
      </h1>
    </div>
    
    <nav class="sidebar-nav">
      <button
        :class="['nav-item', { active: activeTab === 'overview' }]"
        @click="$emit('update:activeTab', 'overview')"
      >
        <span class="nav-icon">📊</span>
        <span>Overview</span>
      </button>
      <button
        :class="['nav-item', { active: activeTab === 'employees' }]"
        @click="$emit('update:activeTab', 'employees')"
      >
        <span class="nav-icon">👥</span>
        <span>Employees</span>
      </button>
      <button
        :class="['nav-item', { active: activeTab === 'departments' }]"
        @click="$emit('update:activeTab', 'departments')"
      >
        <span class="nav-icon">🏢</span>
        <span>Departments</span>
      </button>
      <button
        :class="['nav-item', { active: activeTab === 'performance' }]"
        @click="$emit('update:activeTab', 'performance')"
      >
        <span class="nav-icon">⭐</span>
        <span>Performance</span>
      </button>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">
          {{ userInitials }}
        </div>
        <div class="user-details">
          <div class="user-name">
            {{ user?.username || 'User' }}
          </div>
          <div class="user-email">
            {{ user?.email || '' }}
          </div>
        </div>
      </div>
      <button
        class="btn-logout"
        title="Logout"
        @click="$emit('logout')"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#ef4444" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  },
  user: {
    type: Object,
    default: null
  }
});

defineEmits(['update:activeTab', 'logout']);

const userInitials = computed(() => {
  if (!props.user?.username) return '?';
  return props.user.username.substring(0, 2).toUpperCase();
});
</script>

<style scoped>
.sidebar {
  background: linear-gradient(180deg, #1e40af 0%, #1e3a8a 100%);
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #fff 0%, #93c5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-left-color: #60a5fa;
}

.nav-icon {
  font-size: 1.25rem;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.user-details {
  min-width: 0;
  flex: 1;
}

.user-name {
  font-weight: 600;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-logout {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.btn-logout:hover {
  background: rgba(239, 68, 68, 0.2);
}
</style>
