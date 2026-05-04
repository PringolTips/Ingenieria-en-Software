import api from './api';

export const patientService = {
  // Registrar un nuevo paciente (RF-01)
  // Requiere: nombre, apellidos, fecha_nacimiento, CURP, etc.
  async registrarPaciente(patientData: any) {
    const response = await api.post('/api/pacientes', patientData);
    return response.data;
  },

  // Consultar pacientes por nombre, ID o CURP (RF-02)
  async buscarPacientes(criterio: string) {
    const response = await api.get(`/api/pacientes/buscar?query=${criterio}`);
    return response.data;
  },

  // Registrar un expediente clínico asociado (RF-05)
  async registrarExpediente(expedienteData: any) {
    const response = await api.post('/api/expedientes', expedienteData);
    return response.data;
  }
};