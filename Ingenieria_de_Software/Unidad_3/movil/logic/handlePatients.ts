import { Alert } from 'react-native';
import { patientService } from '../services/patientService';

// Validación de formato CURP oficial
export const validateCURP = (curp: string) => {
  const re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
  return re.test(curp.toUpperCase());
};

export const fetchPatients = async (query: string, setResults: (data: any) => void, setLoading: (val: boolean) => void) => {
  if (!query) return;
  setLoading(true);
  try {
    const data = await patientService.buscarPacientes(query); // RF-02
    setResults(data);
  } catch (error) {
    console.error("Error al buscar pacientes:", error);
  } finally {
    setLoading(false);
  }
};

// Nueva función para el RF-01: Registro de Pacientes
export const handleRegisterPatient = async (formData: any, setLoading: (v: boolean) => void) => {
  if (!validateCURP(formData.curp)) {
    Alert.alert("Error de Formato", "La CURP ingresada no es válida.");
    return false;
  }

  setLoading(true);
  try {
    const res = await patientService.registrarPaciente(formData);
    if (res.ok) {
      Alert.alert("Éxito", "Paciente registrado y expediente iniciado."); // Evento de respuesta
      return true;
    }
  } catch (error: any) {
    const msg = error.response?.data?.mensaje || "Error al registrar paciente.";
    Alert.alert("Error", msg);
    return false;
  } finally {
    setLoading(false);
  }
};