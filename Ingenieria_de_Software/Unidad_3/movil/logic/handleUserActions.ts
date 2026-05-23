// logic/handleUserActions.ts
import { Alert } from 'react-native';
import api from '../services/api';
import { userService } from '../services/userService';

export interface User {
  nombre_usuario: string;
  correo: string;
  nombre_rol: string;
  nombre_estatus: string;
}

export const fetchUsersFromDB = async (): Promise<User[]> => {
  try {
    // Sincronización a v1 global
    const response = await api.get('/api/v1/usuarios');
    if (response.data && response.data.ok) return response.data.data;
    return [];
  } catch (error) { 
    return []; 
  }
};

export const updateUserInDB = async (oldUsername: string, newData: any) => {
  try {
    // ⚡ MAPEO CONTRACTUAL CON TU JSON: 'nuevo_nombre_usuario' y 'correo'
    const dataToSend: any = {
      nuevo_nombre_usuario: newData.nombre_usuario,
      correo: newData.correo
    };

    if (newData.password && newData.password.trim() !== "") {
      dataToSend.contrasena = newData.password; 
    }

    const resUpdate = await userService.actualizarUsuario(oldUsername, dataToSend);
    
    if (resUpdate.ok) {
      const target = newData.nombre_usuario || oldUsername;
      
      if (newData.nombre_estatus === 'Inactivo') {
        await userService.inhabilitarUsuario(target);
      } else if (newData.nombre_estatus === 'Activo') {
        await userService.activarUsuario(target);
      }
      return true;
    }
    return false;
  } catch (error: any) {
    Alert.alert("Error de Modificación", error.response?.data?.mensaje || "No se pudo actualizar la cuenta.");
    return false;
  }
};

// Lógica para restablecer contraseña por defecto en caso de olvido
export const resetUserPasswordInDB = async (username: string) => {
  try {
    // Consume el endpoint del backend para setear la clave base e inicializar bandera
    const response = await api.put(`/api/v1/usuarios/${username}/restablecer`, {});
    return response.data?.ok || response.status === 200;
  } catch (error: any) {
    Alert.alert("Error de Infraestructura", error.response?.data?.mensaje || "No se pudo restablecer el acceso.");
    return false;
  }
};