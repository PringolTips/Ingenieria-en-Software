import api from './api';

export const patientService = {
  async obtenerPacientes() {
    const res = await api.get('/api/pacientes');
    return res.data;
  },

  async obtenerPacientesInactivos() {
    const res = await api.get('/api/pacientes/inactivos');
    return res.data;
  },

  async registrarPaciente(data: any) {
    const res = await api.post('/api/pacientes', data);
    return res.data;
  },

  async inhabilitarPaciente(curp: string) {
    console.log(`[DevOps] Solicitando inhabilitación de: ${curp}`);
    const res = await api.put(`/api/pacientes/${curp}/inhabilitar`);
    return res.data;
  },

  async habilitarPaciente(curp: string) {
    console.log(`[DevOps] Solicitando habilitación de: ${curp}`);
    const res = await api.put(`/api/pacientes/${curp}/habilitar`);
    return res.data;
  }
};