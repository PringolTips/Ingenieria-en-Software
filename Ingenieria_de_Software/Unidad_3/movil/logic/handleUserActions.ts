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
    const response = await api.get('/api/usuarios');
    if (response.data && response.data.ok) return response.data.data;
    return [];
  } catch (error) { return []; }
};

export const updateUserInDB = async (oldUsername: string, newData: any) => {
  try {
    const dataToSend: any = {
      nombre_usuario: newData.nombre_usuario,
      correo: newData.correo,
      nombre_estatus: newData.nombre_estatus
    };

    // Sinergia con diagrama ER: usar 'contrasena' 
    // Solo se envía si el campo no está vacío para evitar el error 401
    if (newData.password && newData.password.trim() !== "") {
      dataToSend.contrasena = newData.password; 
    }

    const resUpdate = await userService.actualizarUsuario(oldUsername, dataToSend);
    
    if (resUpdate.ok) {
      const target = newData.nombre_usuario || oldUsername;
      
      // Sincronización forzada de estatus (RF-10)
      if (newData.nombre_estatus === 'Inactivo') {
        await userService.inhabilitarUsuario(target);
      } else if (newData.nombre_estatus === 'Activo') {
        await userService.activarUsuario(target);
      }
      return true;
    }
    return false;
  } catch (error: any) {
    Alert.alert("Error", error.response?.data?.mensaje || "Error al actualizar.");
    return false;
  }
};

export const deleteUserFromDB = async (username: string) => {
  try {
    const res = await userService.inhabilitarUsuario(username);
    return res.ok;
  } catch (error) {
    Alert.alert("Error RF-10", "No se pudo inhabilitar.");
    return false;
  }
};