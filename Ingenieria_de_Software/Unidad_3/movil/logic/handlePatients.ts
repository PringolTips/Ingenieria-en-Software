import { patientService } from '../services/patientService';

export const fetchPatients = async (query: string, setResults: (data: any) => void, setLoading: (val: boolean) => void) => {
  if (!query) return;
  setLoading(true);
  try {
    const data = await patientService.buscarPacientes(query);
    setResults(data);
  } catch (error) {
    console.error("Error al buscar pacientes:", error);
  } finally {
    setLoading(false);
  }
};