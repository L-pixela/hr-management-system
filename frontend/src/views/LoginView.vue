<template>
  <div class="auth-container">
    <h1 class="logo">HR System <span class="tag">Portal</span></h1>
    <div class="card">
      <div class="tabs">
        <button class="tab active">Login</button>
        <button class="tab" @click="$router.push('/register')">Register</button>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="login-email">Email</label>
          <input id="login-email" name="email" type="email" v-model="email" placeholder="admin@example.com" required>
        </div>
        <div class="form-group">
          <label for="login-password">Password</label>
          <input id="login-password" name="password" type="password" v-model="password" required>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Signing In...' : 'Sign In' }}
        </button>
        <div v-if="error" class="message error">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import client from '../api/client';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await client.post('/auth/login', {
      email: email.value,
      password: password.value
    });
    localStorage.setItem('token', res.data.accessToken);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Reuse styles from original css */
.auth-container { max-width: 400px; margin: 10vh auto; }
.logo { text-align: center; margin-bottom: 2rem; font-size: 1.5rem; }
.tag { font-size: 0.75rem; background: #e0e7ff; color: #4f46e5; padding: 2px 6px; border-radius: 4px; vertical-align: middle; }
.card { background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 2rem; }
.tabs { display: flex; border-bottom: 1px solid #e5e7eb; margin-bottom: 1.5rem; }
.tab { flex: 1; padding: 0.75rem; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; color: #6b7280; font-weight: 500; }
.tab.active { border-color: #4f46e5; color: #4f46e5; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; font-size: 0.875rem; margin-bottom: 0.25rem; color: #6b7280; }
.form-group input { width: 100%; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 6px; box-sizing: border-box; }
.btn { width: 100%; padding: 0.5rem; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; }
.btn:disabled { opacity: 0.7; cursor: not-allowed; }
.message { margin-top: 1rem; text-align: center; font-size: 0.875rem; }
.message.error { color: #ef4444; }
</style>
