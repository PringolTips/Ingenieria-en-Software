import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

const handleLogin = async (correo: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { correo, password });

    if (response.data.ok) {
      const { token, usuario } = response.data.data;

      // Guardar Token cifrado (RNF-05) [cite: 452, 455]
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userRole', usuario.nombre_rol);
      // RF-09: Cambio de contraseña obligatorio en primer inicio [cite: 405]
      if (usuario.debe_cambiar_password) {
        router.replace('/change-password');
      } else {
        // RF-12: Redirección según Rol [cite: 431, 432]
        // IMPORTANTE: Asegúrate de que los nombres coincidan con tu Backend
        if (usuario.nombre_rol === 'Admin') {
          router.replace('/(admin)/dashboard');
        } else if (usuario.nombre_rol === 'Medico') {
          router.replace('/(medico)/dashboard');
        } else if (usuario.nombre_rol === 'Enfermero') {
          router.replace('/(enfermero)/dashboard');
        } else {
          // Si el rol es Director o Administrativo (según SRS [cite: 386, 387]),
          // mándalos a una ruta que SÍ exista, por ejemplo el index de tabs
          router.replace('/(tabs)'); 
        }
      }
    }
  } catch (error: any) {
    // RNF-09: Gestión de errores [cite: 460]
    alert("Error: Credenciales inválidas o cuenta bloqueada.");
  }
};

export default handleLogin;