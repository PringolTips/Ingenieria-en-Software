// services/patientService.ts
import api from './api';

export const patientService = {
  // ⚡ ACTUALIZADO: Apunta al nuevo endpoint limpio de activos del Backend
  async obtenerPacientes() {
    const res = await api.get('/api/v1/pacientes/activos');
    return res.data;
  },

  // ⚡ ACTUALIZADO: Apunta al nuevo endpoint limpio de inactivos del Backend
  async obtenerPacientesInactivos() {
    const res = await api.get('/api/v1/pacientes/inactivos');
    return res.data;
  },

  // ⚡ NUEVO: Consulta directa e individual por CURP (Trae el correo y datos completos)
  async obtenerPacientePorCurp(curp: string) {
    const res = await api.get(`/api/v1/pacientes/${curp}`);
    return res.data;
  },

  async registrarPaciente(data: any) {
    const res = await api.post('/api/v1/pacientes', data);
    return res.data;
  },

  async inhabilitarPaciente(curp: string) {
    console.log(`[DevOps] Solicitando inhabilitación de: ${curp}`);
    const res = await api.put(`/api/v1/pacientes/${curp}/inhabilitar`);
    return res.data;
  },

  async habilitarPaciente(curp: string) {
    console.log(`[DevOps] Solicitando habilitación de: ${curp}`);
    const res = await api.put(`/api/v1/pacientes/${curp}/habilitar`);
    return res.data;
  }
};