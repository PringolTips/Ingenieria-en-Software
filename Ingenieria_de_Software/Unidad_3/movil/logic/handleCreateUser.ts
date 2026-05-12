import { Alert } from 'react-native';
import api from '../services/api';

// Interface flexible: Los campos personales son opcionales para el Front móvil
// pero obligatorios en la lógica de negocio si el rol es Médico (RF-09)
export interface UserPayload {
  nombre_usuario: string;
  correo: string;
  nombre_rol: string;
  nombres?: string; 
  apellido_paterno?: string;
  apellido_materno?: string;
}

export const handleCreateUser = async (
  userData: UserPayload, 
  setLoading: (v: boolean) => void
) => {
  // Validación de integridad mínima requerida por el sistema
  if (!userData.nombre_usuario || !userData.correo || !userData.nombre_rol) {
    Alert.alert("Error de Validación", "El ID de usuario, correo y rol son campos obligatorios.");
    return false;
  }

  setLoading(true);
  try {
    // IMPORTANTE: nombre_rol debe ser 'Medico' (sin acento) para el Backend
    const response = await api.post('/api/usuarios', userData);

    if (response.status === 201 || response.data.ok) {
      return true; 
    }
    return false;
  } catch (error: any) {
    // Captura de errores específicos (ej. duplicidad de CURP o id_rol null)
    const errorServer = error.response?.data?.error || error.response?.data?.message;
    const msg = errorServer || "Error de conexión con el servidor de Digiclin.";
    
    Alert.alert("Error del Sistema", msg);
    console.error("Detalle técnico para el equipo:", error.response?.data);
    return false;
  } finally {
    setLoading(false);
  }
};