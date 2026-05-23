//api.ts - Configuración de Axios para la comunicación con el backend
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
  // ⚡ COMPATIBILIDAD DEFINITIVA: Si la ruta contiene la palabra 'login',
  // omitimos la inyección de tokens de inmediato para no corromper la petición.
  if (config.url?.includes('login')) {
    return config;
  }

  try {
    const token = await SecureStore.getItemAsync('userToken');
    // RNF-05: Solo inyectamos token si existe en sesiones protegidas
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.log('[DevOps Sync] Error al recuperar credenciales locales:', error);
  }

  return config;
});

export default api;