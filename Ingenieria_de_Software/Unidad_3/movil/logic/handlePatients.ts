import { patientService } from '../services/patientService';

export const registerPatientLogic = async (formData: any) => {
  try {
    const dataForBackend = {
      nombre_p: formData.nombre,
      apellido_pat: formData.apPaterno,
      apellido_mat: formData.apMaterno,
      fecha_nacimiento: formData.fechaNacimiento.toISOString().split('T')[0],
      nombre_sexo: formData.sexo,
      curp: formData.curp,
      domicilio: formData.domicilio,
      nombre_estado_civil: formData.estadoCivil,
      correo: formData.correo,
      ocupacion: formData.ocupacion,
      telefono: formData.telefono,
      contacto_emergencia: formData.contactoEmergencia,
      nombre_tipo_sangre: formData.tipoSangre
    };

    return await patientService.registrarPaciente(dataForBackend);
  } catch (error) {
    return { ok: false, mensaje: "Error al conectar con el servidor." };
  }
};