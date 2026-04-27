import api from './api';

export const authService = {
  // Esta función hace el trabajo sucio de ir al servidor
  async cambiarPassword(data: any) {
    // La ruta exacta de tu router de backend
    const response = await api.put('/api/auth/cambiar-password', data);
    return response.data;
  }
};