import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  // URL actual del túnel de Cloudflare para el prototipo
  baseURL: 'https://adjacent-genius-appointments-zshops.trycloudflare.com', 
  timeout: 15000, 
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  // RNF-05: Solo inyectamos token si no es la ruta de login
  if (token && !config.url?.includes('/api/auth/login')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;