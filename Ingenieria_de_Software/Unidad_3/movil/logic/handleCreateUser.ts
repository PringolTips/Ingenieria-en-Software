// logic/handleCreateUser.ts
import { Alert } from 'react-native';
import api from '../services/api';

interface UserPayload {
  nombre_usuario: string;
  correo: string;
  nombre_rol: string;
  cedula?: string;
  especialidad?: string;
}

export const handleCreateUser = async (
  userData: UserPayload, 
  setLoading: (v: boolean) => void
) => {
  // Validaciones previas (RNF-05 y RF-09)
  if (!userData.nombre_usuario || !userData.correo) {
    Alert.alert("Error", "El nombre de usuario y correo son obligatorios.");
    return false;
  }

  // Validación de Cédula si no es Admin
  if (userData.nombre_rol !== 'Admin' && (!userData.cedula || userData.cedula.length < 7)) {
    Alert.alert("Error", "La cédula debe tener entre 7 y 8 dígitos.");
    return false;
  }

  setLoading(true);
  try {
    // Endpoint validado en Thunder Client: /api/usuarios
    const response = await api.post('/api/usuarios', userData);

    if (response.status === 201 || response.data.ok) {
      Alert.alert("Éxito", "Usuario creado correctamente. La contraseña temporal ha sido enviada.");
      return true;
    }
  } catch (error: any) {
    const msg = error.response?.data?.error || "No se pudo crear el usuario.";
    Alert.alert("Error", msg);
    return false;
  } finally {
    setLoading(false);
  }
};