import api from './api';

export const userService = {
  // Obtener todos los usuarios activos (RF-10)
  async obtenerActivos() {
    const response = await api.get('/api/usuarios/activos');
    return response.data;
  },

  // Obtener un usuario específico por su nombre
  async obtenerPorNombre(nombreUsuario: string) {
    const response = await api.get(`/api/usuarios/${nombreUsuario}`);
    return response.data;
  },

  // Crear un nuevo usuario (Médico, Enfermero, etc.) (RF-09)
  async crearUsuario(userData: any) {
    const response = await api.post('/api/usuarios', userData);
    return response.data;
  },

  // Eliminar/Desactivar usuario (RF-10)
  async eliminarUsuario(nombreUsuario: string) {
    const response = await api.delete(`/api/usuarios/${nombreUsuario}`);
    return response.data;
  }
};