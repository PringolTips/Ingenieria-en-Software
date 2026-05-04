// logic/handlePassword.ts
import { authService } from '../services/authService';

// IMPORTANTE: Usamos "export const" para que el import { ... } funcione
export const processPasswordChange = async (
  form: { current: string; next: string; confirm: string }, 
  setLoading: (v: boolean) => void
) => {
  setLoading(true);
  try {
    // Estructura que pide tu API en AWS
    const payload = {
      password_actual: form.current,
      password_nueva: form.next,
      confirmar_password_nueva: form.confirm
    };

    const result = await authService.cambiarPassword(payload);
    return { success: true, message: result.mensaje || "Contraseña actualizada" };
  } catch (error: any) {
    const msg = error.response?.data?.mensaje || "Error al actualizar en AWS";
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};