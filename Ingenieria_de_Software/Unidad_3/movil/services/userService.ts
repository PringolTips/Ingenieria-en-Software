// services/userService.ts
import api from './api';

export const userService = {
  // RF-09: Actualización general (Nombre, Correo, Contraseña)
  async actualizarUsuario(nombreUsuarioOriginal: string, userData: any) {
    const response = await api.put(`/api/v1/usuarios/${nombreUsuarioOriginal}`, userData);
    return response.data;
  },

  // RF-10: Inhabilitar siguiendo el estándar de pacientes
  async inhabilitarUsuario(nombreUsuario: string) {
    const response = await api.put(`/api/v1/usuarios/${nombreUsuario}/inhabilitar`);
    return response.data;
  },

  // Reactivación de cuenta
  async activarUsuario(nombreUsuario: string) {
    const response = await api.put(`/api/v1/usuarios/${nombreUsuario}/habilitar`);
    return response.data;
  }
};