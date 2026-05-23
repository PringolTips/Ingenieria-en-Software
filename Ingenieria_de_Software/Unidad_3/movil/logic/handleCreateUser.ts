// logic/handleCreateUser.ts
import { Alert } from 'react-native';
import api from '../services/api';

export interface UserPayload {
  nombre_usuario: string;
  correo: string;
  nombre_rol: string;
  nombres?: string; 
  apellido_paterno?: string;
  apellido_materno?: string;
  cedula?: string;             // ⚡ REQUERIDO PARA ROL MÉDICO SEGÚN JSON
  nombre_especialidad?: string; // ⚡ REQUERIDO PARA ROL MÉDICO SEGÚN JSON
}

export const handleCreateUser = async (
  userData: UserPayload, 
  setLoading: (v: boolean) => void
) => {
  if (!userData.nombre_usuario || !userData.correo || !userData.nombre_rol) {
    Alert.alert("Error de Validación", "El ID de usuario, correo y rol son campos obligatorios.");
    return false;
  }

  setLoading(true);
  try {
    // ⚡ ENLACE DE INFRAESTRUCTURA CORREGIDO A LA V1 PRODUCTION
    const response = await api.post('/api/v1/usuarios', userData);

    if (response.status === 201 || response.data.ok) {
      return true; 
    }
    return false;
  } catch (error: any) {
    const errorServer = error.response?.data?.error || error.response?.data?.message;
    const msg = errorServer || "Error de conexión con el servidor de Digiclin.";
    
    Alert.alert("Error del Sistema", msg);
    console.error("Detalle técnico para el equipo:", error.response?.data);
    return false;
  } finally {
    setLoading(false);
  }
};