import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

const handleLogin = async (correo: string, password: string, setLoading: (v: boolean) => void) => {
  setLoading(true);
  try {
    const response = await api.post('/api/auth/login', { 
      correo: correo.trim(), 
      password 
    });

    if (response.data && response.data.ok) {
      const { token, usuario } = response.data.data;

      // REQUERIMIENTO RNF-05: Persistencia segura
      await SecureStore.setItemAsync('userToken', String(token));
      await SecureStore.setItemAsync('userRole', String(usuario.nombre_rol));
      await SecureStore.setItemAsync('userEmail', correo.trim());

      // Lógica de Negocio: El Admin NO cambia contraseña. 
      // Solo se obliga a los roles creados con pass genérica (1-8).
      const forceChange = usuario.nombre_rol === 'Admin' ? false : usuario.debe_cambiar_password;

      return {
        nombre_rol: usuario.nombre_rol,
        debe_cambiar_password: forceChange
      };
    }
    return null; // El servidor respondió pero no hubo éxito
  } catch (error: any) {
    console.error("Error de red/servidor:", error.message);
    return null; // Error de conexión o 401
  } finally {
    setLoading(false);
  }
};

export default handleLogin;