import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: 'http://18.220.93.246:3000', // Tu IP de AWS
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor para inyectar el token automáticamente (RNF-05) [cite: 450, 455]
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;