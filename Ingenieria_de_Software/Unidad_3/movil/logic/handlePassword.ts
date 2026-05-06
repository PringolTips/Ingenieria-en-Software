// logic/handlePassword.ts (Actualizado)
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export const processPasswordChange = async (
  form: { current: string; next: string; confirm: string }, 
  setLoading: (v: boolean) => void
) => {
  setLoading(true);
  try {
    const email = await SecureStore.getItemAsync('userEmail'); // Guardado en el Login
    
    const payload = {
      identificador: email, // Requerido por tu API[cite: 3]
      password_actual: form.current,
      password_nueva: form.next,
      confirmar_password_nueva: form.confirm
    };

    const response = await api.put('/api/auth/cambiar-password', payload);
    return { success: true, message: response.data.mensaje };
  } catch (error: any) {
    const msg = error.response?.data?.mensaje || "Error en la actualización";
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};