// logic/handlePatients.ts
import { patientService } from '../services/patientService';

export const registerPatientLogic = async (formData: any) => {
  try {
    const dataForBackend = {
      nombre_p: formData.nombre.trim(),
      apellido_pat: formData.apPaterno.trim(),
      apellido_mat: formData.apMaterno.trim(),
      fecha_nacimiento: formData.fechaNacimiento.toISOString().split('T')[0],
      nombre_sexo: formData.sexo,
      curp: formData.curp.trim().toUpperCase(),
      domicilio: formData.domicilio.trim(),
      nombre_estado_civil: formData.estadoCivil,
      correo: formData.correo.trim().toLowerCase(),
      ocupacion: formData.ocupacion.trim(),
      telefono: formData.telefono.trim(),
      contacto_emergencia: formData.contactoEmergencia.trim(),
      nombre_tipo_sangre: formData.tipoSangre
    };

    const response = await patientService.registrarPaciente(dataForBackend);
    return response; // Retorna el éxito directamente del servicio
    
  } catch (error: any) {
    console.error("[DevOps Exception] Error al registrar paciente en API:", error);

    // ⚡ EXTRAEMOS EL MENSAJE REAL DEL BACKEND (Ej: "La CURP ya está registrada")
    if (error.response && error.response.data) {
      return {
        ok: false,
        mensaje: error.response.data.mensaje || error.response.data.error || "Datos inválidos procesados por el servidor."
      };
    }

    return { ok: false, mensaje: "Error de comunicación con el servidor. Revisa el túnel." };
  }
};