import axios from 'axios';

// When running in Docker, API calls go through the same nginx gateway
// When running in dev mode (npm run dev), vite proxy handles the routing
const client = axios.create({
    baseURL: '/',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: false
});

// Add a request interceptor to inject the token
client.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add a response interceptor to handle 401s
client.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default client;
