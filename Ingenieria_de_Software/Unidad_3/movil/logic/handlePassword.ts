// logic/handlePassword.ts
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export const processPasswordChange = async (
  form: { current: string; next: string; confirm: string }, 
  setLoading: (v: boolean) => void
) => {
  setLoading(true);
  try {
    const email = await SecureStore.getItemAsync('userEmail'); 
    
    const payload = {
      identificador: email, 
      password_actual: form.current,
      password_nueva: form.next,
      confirmar_password_nueva: form.confirm
    };

    // ⚡ RUTA CORREGIDA CON EL PREFIJO OFICIAL DE PRODUCCIÓN DE LA V1
    const response = await api.put('/api/v1/auth/cambiar-password', payload);
    return { success: true, message: response.data.mensaje };
  } catch (error: any) {
    const msg = error.response?.data?.mensaje || "Error en la actualización de la clave de acceso.";
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};