// logic/handleLogin.ts
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

const handleLogin = async (correo: string, password: string, setLoading: (v: boolean) => void) => {
  setLoading(true);
  try {
    const response = await api.post('/api/auth/login', { 
      correo: correo.trim(), 
      password 
    });

    if (response.data.ok) {
      const { token, usuario } = response.data.data;
      await SecureStore.setItemAsync('userToken', token);

      // Lógica de sesiones para el maestro
      const sessionStr = await SecureStore.getItemAsync('sessionCount') || '0';
      const currentSession = parseInt(sessionStr) + 1;
      await SecureStore.setItemAsync('sessionCount', currentSession.toString());

      // --- EL CAMBIO CLAVE: USAR PUSH ---
      if (currentSession % 2 !== 0) {
        // .push permite que el botón "Atrás" regrese al Login
        router.push('/change-password'); 
      } else {
        const route = usuario.nombre_rol === 'Admin' ? '/(admin)/dashboard' : '/(medico)/dashboard';
        router.push(route);
      }
    }
  } catch (error) {
    alert("Error de credenciales");
  } finally {
    setLoading(false);
  }
};

export default handleLogin;