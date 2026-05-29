// services/recordService.ts
import api from './api';

export const recordService = {
  async obtenerPorPaciente(curp: string) {
    const res = await api.get(`/api/v1/expedientes/paciente/${curp}`);
    return res.data;
  },

  async obtenerAbiertos() {
    const res = await api.get('/api/v1/expedientes/abiertos');
    return res.data;
  },

  async obtenerArchivados() {
    const res = await api.get('/api/v1/expedientes/archivados');
    return res.data;
  },

  async crearExpediente(data: any) {
    const res = await api.post('/api/v1/expedientes', data);
    return res.data;
  },

  async actualizarExpediente(idExpediente: number, data: any) {
    const res = await api.put(`/api/v1/expedientes/${idExpediente}`, data);
    return res.data;
  },

  async archivarExpediente(idExpediente: number) {
    const res = await api.put(`/api/v1/expedientes/${idExpediente}/archivar`);
    return res.data;
  },

  async desarchivarExpediente(idExpediente: number) {
    const res = await api.put(`/api/v1/expedientes/${idExpediente}/desarchivar`);
    return res.data;
  },

  // ⚡ NUEVOS ENDPOINTS DE BÚSQUEDA AVANZADA DESDE POSTMAN
  async buscarPorIdPaciente(idPaciente: number) {
    const res = await api.get(`/api/v1/expedientes/buscar/paciente/${idPaciente}`);
    return res.data;
  },

  async buscarPorFechaConsulta(fecha: string) {
    const res = await api.get(`/api/v1/expedientes/buscar/fecha?fecha_consulta=${fecha}`);
    return res.data;
  },

  async buscarPorRangoFechas(fechaInicio: string, fechaFin: string) {
    const res = await api.get(`/api/v1/expedientes/buscar/fechas?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`);
    return res.data;
  }
};