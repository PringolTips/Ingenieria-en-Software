// services/expedienteService.ts
import api from './api';

export const expedienteService = {
  // RF-11: Obtener el registro detallado de acciones realizadas sobre los expedientes clínicos
  obtenerBitacora: async () => {
    try {
      const response = await api.get('/api/v1/bitacora/expedientes');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};