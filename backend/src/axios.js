import axios from 'axios';
import { useAuthStore } from './stores/AuthStore';

const axiosClient = axios.create({
    // baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
    baseURL: "http://localhost:8000/api"
})

axiosClient.interceptors.request.use((config) => {
    // Set the Content-Type for FormData
    if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
    } else {
        config.headers['Content-Type'] = 'application/json'; // Default content type
    }

    // Add Authorization header if token exists
    const authStore = useAuthStore();
    if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`
    }

    return config;
}, error => {
    return PromiseRejectionEvent.reject(error)
});

export default axiosClient;