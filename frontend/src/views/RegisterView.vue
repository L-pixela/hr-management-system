<template>
  <div class="auth-container">
    <h1 class="logo">
      HR System <span class="tag">Portal</span>
    </h1>
    <div class="card">
      <div class="tabs">
        <button
          class="tab"
          @click="$router.push('/login')"
        >
          Login
        </button>
        <button class="tab active">
          Register
        </button>
      </div>

      <form
        class="auth-form"
        @submit.prevent="handleRegister"
      >
        <div class="form-group">
          <label for="reg-username">Username</label>
          <input
            id="reg-username"
            v-model="form.username"
            name="username"
            type="text"
            required
          >
        </div>
        <div class="form-group">
          <label for="reg-email">Email</label>
          <input
            id="reg-email"
            v-model="form.email"
            name="email"
            type="email"
            required
          >
        </div>
        <div class="form-group">
          <label for="reg-password">Password</label>
          <input
            id="reg-password"
            v-model="form.password"
            name="password"
            type="password"
            required
          >
        </div>
        <div class="form-group">
          <label for="reg-role">Role</label>
          <select
            id="reg-role"
            v-model="form.role"
            name="role"
            class="form-select"
          >
            <option value="user">
              User
            </option>
            <option value="admin">
              Admin
            </option>
          </select>
        </div>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="loading"
        >
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>
        <div
          v-if="error"
          class="message error"
        >
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import client from '../api/client';

const router = useRouter();
const form = reactive({ username: '', email: '', password: '', role: 'user' });
const error = ref('');
const loading = ref(false);

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  try {
    await client.post('/auth/register', form);
    alert('Registration successful! Please login.');
    router.push('/login');
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Reuse styles from LoginView - simplified for brevity */
.auth-container { max-width: 400px; margin: 10vh auto; }
.logo { text-align: center; margin-bottom: 2rem; font-size: 1.5rem; }
.tag { font-size: 0.75rem; background: #e0e7ff; color: #4f46e5; padding: 2px 6px; border-radius: 4px; vertical-align: middle; }
.card { background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 2rem; }
.tabs { display: flex; border-bottom: 1px solid #e5e7eb; margin-bottom: 1.5rem; }
.tab { flex: 1; padding: 0.75rem; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; color: #6b7280; font-weight: 500; }
.tab.active { border-color: #4f46e5; color: #4f46e5; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; font-size: 0.875rem; margin-bottom: 0.25rem; color: #6b7280; }
.form-group input, .form-select { width: 100%; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 6px; box-sizing: border-box; }
.btn { width: 100%; padding: 0.5rem; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; }
.message { margin-top: 1rem; text-align: center; font-size: 0.875rem; }
.message.error { color: #ef4444; }
</style>
