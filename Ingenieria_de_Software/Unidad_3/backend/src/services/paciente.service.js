const db = require('../config/db');

const normalizarCurp = (curp) => {
  return curp.trim().toUpperCase();
};

const validarFormatoCurp = (curp) => {
  if (!curp) return false;

  const curpNormalizada = normalizarCurp(curp);

  const regexCurp = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;

  return regexCurp.test(curpNormalizada);
};

const crearError = (mensaje, statusCode = 400, campos = null) => {
  const error = new Error(mensaje);
  error.statusCode = statusCode;
  if (campos) error.campos = campos;
  return error;
};

const esCampoEnviado = (valor) => {
  return valor !== undefined && valor !== null && String(valor).trim() !== '';
};

const limpiarTexto = (valor) => {
  if (!esCampoEnviado(valor)) return null;
  return String(valor).trim();
};

const normalizarTexto = (valor) => {
  return String(valor)
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

const validarNombrePersona = (valor, nombreCampo) => {
  if (!esCampoEnviado(valor)) return;

  const texto = limpiarTexto(valor);

  const regex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.'-]+$/;

  if (!regex.test(texto)) {
    throw crearError(`${nombreCampo} no debe contener números ni caracteres no permitidos`);
  }

  if (texto.length > 60) {
    throw crearError(`${nombreCampo} no debe exceder 60 caracteres`);
  }
};

const validarCorreo = (correo) => {
  if (!esCampoEnviado(correo)) return;

  const texto = limpiarTexto(correo);

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(texto)) {
    throw crearError('El correo tiene un formato inválido');
  }

  if (texto.length > 100) {
    throw crearError('El correo no debe exceder 100 caracteres');
  }
};

const validarTelefono = (telefono) => {
  if (!esCampoEnviado(telefono)) return;

  const texto = limpiarTexto(telefono);

  if (!/^\d+$/.test(texto)) {
    throw crearError('El teléfono debe contener solo números');
  }

  if (texto.length !== 10) {
    throw crearError('El teléfono debe tener 10 dígitos');
  }
};

const validarContactoEmergencia = (contactoEmergencia, telefono) => {
  if (!esCampoEnviado(contactoEmergencia)) return;

  const contacto = limpiarTexto(contactoEmergencia);

  if (contacto.length > 100) {
    throw crearError('El contacto de emergencia no debe exceder 100 caracteres');
  }

  if (
    esCampoEnviado(telefono) &&
    normalizarTexto(contacto) === normalizarTexto(telefono)
  ) {
    throw crearError('El contacto de emergencia debe ser diferente al teléfono principal');
  }
};

const normalizarFechaNacimiento = (fechaNacimiento) => {
  if (!esCampoEnviado(fechaNacimiento)) return null;

  const texto = limpiarTexto(fechaNacimiento);

  // Acepta formato YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    return texto;
  }

  // Acepta formato DD/MM/YYYY y lo convierte a YYYY-MM-DD
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
    const [dia, mes, anio] = texto.split('/');
    return `${anio}-${mes}-${dia}`;
  }

  throw crearError('La fecha de nacimiento debe tener formato válido: YYYY-MM-DD o DD/MM/YYYY');
};

const validarFechaNacimiento = (fechaNacimiento) => {
  if (!esCampoEnviado(fechaNacimiento)) return;

  const fechaISO = normalizarFechaNacimiento(fechaNacimiento);
  const fecha = new Date(`${fechaISO}T00:00:00`);

  if (Number.isNaN(fecha.getTime())) {
    throw crearError('La fecha de nacimiento es inválida');
  }

  const hoy = new Date();

  if (fecha > hoy) {
    throw crearError('La fecha de nacimiento no puede ser futura');
  }

  let edad = hoy.getFullYear() - fecha.getFullYear();
  const mes = hoy.getMonth() - fecha.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
    edad--;
  }

  if (edad >= 120) {
    throw crearError('La edad calculada debe ser menor a 120 años');
  }

  return fechaISO;
};

const validarSexo = (sexo) => {
  if (!esCampoEnviado(sexo)) return;

  const permitidos = ['masculino', 'femenino'];
  const valor = normalizarTexto(sexo);

  if (!permitidos.includes(valor)) {
    throw crearError('Sexo solo permite: Masculino o Femenino');
  }
};

const validarEstadoCivil = (estadoCivil) => {
  if (!esCampoEnviado(estadoCivil)) return;

  const permitidos = ['soltero', 'casado', 'divorciado', 'viudo', 'separado'];
  const valor = normalizarTexto(estadoCivil);

  if (!permitidos.includes(valor)) {
    throw crearError('Estado civil solo permite: Soltero, Casado, Divorciado, Viudo o Separado');
  }
};

const validarTipoSangre = (tipoSangre) => {
  if (!esCampoEnviado(tipoSangre)) return;

  const permitidos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  if (!permitidos.includes(String(tipoSangre).trim().toUpperCase())) {
    throw crearError('Tipo de sangre solo permite: A+, A-, B+, B-, AB+, AB-, O+ y O-');
  }
};

const validarLongitudTexto = (valor, nombreCampo, max) => {
  if (!esCampoEnviado(valor)) return;

  if (String(valor).trim().length > max) {
    throw crearError(`${nombreCampo} no debe exceder ${max} caracteres`);
  }
};

const validarDatosPaciente = (pacienteObj = {}, requiereObligatorios = false) => {
  const camposFaltantes = [];

  if (requiereObligatorios) {
    if (!esCampoEnviado(pacienteObj.nombre_p)) camposFaltantes.push('nombre_p');
    if (!esCampoEnviado(pacienteObj.apellido_pat)) camposFaltantes.push('apellido_pat');
    if (!esCampoEnviado(pacienteObj.apellido_mat)) camposFaltantes.push('apellido_mat');
    if (!esCampoEnviado(pacienteObj.fecha_nacimiento)) camposFaltantes.push('fecha_nacimiento');
    if (!esCampoEnviado(pacienteObj.nombre_sexo)) camposFaltantes.push('nombre_sexo');
    if (!esCampoEnviado(pacienteObj.curp)) camposFaltantes.push('curp');
    if (!esCampoEnviado(pacienteObj.domicilio)) camposFaltantes.push('domicilio');
    if (!esCampoEnviado(pacienteObj.telefono)) camposFaltantes.push('telefono');
    if (!esCampoEnviado(pacienteObj.contacto_emergencia)) camposFaltantes.push('contacto_emergencia');
  }

  if (camposFaltantes.length > 0) {
    throw crearError('Faltan campos obligatorios', 400, camposFaltantes);
  }

  validarNombrePersona(pacienteObj.nombre_p, 'nombre_p');
  validarNombrePersona(pacienteObj.apellido_pat, 'apellido_pat');
  validarNombrePersona(pacienteObj.apellido_mat, 'apellido_mat');

  const fechaNormalizada = validarFechaNacimiento(pacienteObj.fecha_nacimiento);

  validarSexo(pacienteObj.nombre_sexo);
  validarEstadoCivil(pacienteObj.nombre_estado_civil);
  validarTipoSangre(pacienteObj.nombre_tipo_sangre);

  validarCorreo(pacienteObj.correo);
  validarTelefono(pacienteObj.telefono);
  validarContactoEmergencia(pacienteObj.contacto_emergencia, pacienteObj.telefono);

  validarLongitudTexto(pacienteObj.domicilio, 'domicilio', 200);
  validarLongitudTexto(pacienteObj.ocupacion, 'ocupacion', 80);

  return {
    ...pacienteObj,
    fecha_nacimiento: fechaNormalizada || pacienteObj.fecha_nacimiento
  };
};

const obtenerVistaPorRol = (rol) => {
  switch (rol) {
    case 'Admin':
    case 'Medico':
    case 'Director':
      return 'digiclin.vw_paciente_completo';

    case 'Enfermero':
      return 'digiclin.vw_paciente_enfermero';

    case 'Administrativo':
      return 'digiclin.vw_paciente_administrativo';

    default: {
      const error = new Error('Rol no autorizado para consultar pacientes');
      error.statusCode = 403;
      throw error;
    }
  }
};

const listarTodos = async (rol) => {
  const vista = obtenerVistaPorRol(rol);
  const res = await db.query(`SELECT * FROM ${vista}`);
  return res.rows;
};

const listarActivos = async (rol) => {
  const vista = obtenerVistaPorRol(rol);

  const res = await db.query(
    `SELECT *
     FROM ${vista}
     WHERE LOWER(nombre_estatus) = LOWER('Activo')`
  );

  return res.rows;
};

const listarInactivos = async (rol) => {
  if (!['Admin', 'Administrativo', 'Director'].includes(rol)) {
    const error = new Error('No tienes permisos para consultar pacientes inactivos');
    error.statusCode = 403;
    throw error;
  }

  const vista = obtenerVistaPorRol(rol);

  const res = await db.query(
    `SELECT *
     FROM ${vista}
     WHERE LOWER(nombre_estatus) = LOWER('Inactivo')`
  );

  return res.rows;
};

const obtenerPorCurp = async (curp, rol) => {
  if (!curp) {
    const error = new Error('La CURP es obligatoria');
    error.statusCode = 400;
    throw error;
  }

  if (!validarFormatoCurp(curp)) {
    const error = new Error('La CURP tiene un formato inválido');
    error.statusCode = 400;
    throw error;
  }

  const vista = obtenerVistaPorRol(rol);

  const res = await db.query(
    `SELECT *
     FROM ${vista}
     WHERE UPPER(TRIM(curp)) = UPPER(TRIM($1::varchar))`,
    [normalizarCurp(curp)]
  );

  if (res.rows.length === 0) {
    const error = new Error('Paciente no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return res.rows[0];
};

const buscarPorNombre = async (nombre, rol) => {
  if (!nombre) {
    const error = new Error('El nombre es obligatorio');
    error.statusCode = 400;
    throw error;
  }

  const vista = obtenerVistaPorRol(rol);
  const busqueda = `%${nombre.trim().replace(/\s+/g, ' ')}%`;

  const res = await db.query(
    `SELECT *
     FROM ${vista}
     WHERE LOWER(nombre_completo) LIKE LOWER($1::varchar)
        OR LOWER(nombre_p) LIKE LOWER($1::varchar)
        OR LOWER(apellido_pat) LIKE LOWER($1::varchar)
        OR LOWER(apellido_mat) LIKE LOWER($1::varchar)`,
    [busqueda]
  );

  return res.rows;
};

const crearPaciente = async (pacienteObj = {}) => {
  const pacienteValidado = validarDatosPaciente(pacienteObj, true);

  if (!validarFormatoCurp(pacienteValidado.curp)) {
    const error = new Error('La CURP tiene un formato inválido');
    error.statusCode = 400;
    throw error;
  }

  try {
    await db.query(
      `CALL digiclin.sp_crear_paciente(
        $1::varchar,
        $2::varchar,
        $3::varchar,
        $4::date,
        $5::varchar,
        $6::varchar,
        $7::varchar,
        $8::varchar,
        $9::varchar,
        $10::varchar,
        $11::varchar,
        $12::varchar,
        $13::varchar
      )`,
      [
        pacienteValidado.nombre_p,
        pacienteValidado.apellido_pat,
        pacienteValidado.apellido_mat,
        pacienteValidado.fecha_nacimiento,
        pacienteValidado.nombre_sexo,
        normalizarCurp(pacienteValidado.curp),
        pacienteValidado.domicilio,
        pacienteValidado.nombre_estado_civil || null,
        pacienteValidado.correo || null,
        pacienteValidado.ocupacion || null,
        pacienteValidado.telefono,
        pacienteValidado.contacto_emergencia,
        pacienteValidado.nombre_tipo_sangre || null
      ]
    );
  } catch (err) {
    if (err.code === '23505') {
      const error = new Error('La CURP ya está registrada');
      error.statusCode = 409;
      throw error;
    }

    const error = new Error(err.message || 'Error al registrar paciente');
    error.statusCode = 400;
    throw error;
  }

  const res = await db.query(
    `SELECT *
     FROM digiclin.vw_paciente_completo
     WHERE UPPER(TRIM(curp)) = UPPER(TRIM($1::varchar))`,
    [normalizarCurp(pacienteValidado.curp)]
  );

  return res.rows[0];
};

const actualizarPaciente = async (pacienteObj = {}) => {
  if (!pacienteObj.curp) {
    const error = new Error('La CURP es obligatoria');
    error.statusCode = 400;
    throw error;
  }

  if (!validarFormatoCurp(pacienteObj.curp)) {
    const error = new Error('La CURP tiene un formato inválido');
    error.statusCode = 400;
    throw error;
  }

  const camposActualizables = [
    'nombre_p',
    'apellido_pat',
    'apellido_mat',
    'fecha_nacimiento',
    'nombre_sexo',
    'domicilio',
    'nombre_estado_civil',
    'correo',
    'ocupacion',
    'telefono',
    'contacto_emergencia',
    'nombre_tipo_sangre'
  ];

  const tieneAlgunCampo = camposActualizables.some(
    (campo) =>
      pacienteObj[campo] !== undefined &&
      pacienteObj[campo] !== null &&
      pacienteObj[campo] !== ''
  );

  if (!tieneAlgunCampo) {
    const error = new Error('Debes enviar al menos un campo para actualizar');
    error.statusCode = 400;
    throw error;
  }

  const pacienteValidado = validarDatosPaciente(pacienteObj, false);

  try {
    await db.query(
      `CALL digiclin.sp_actualizar_paciente(
        $1::varchar,
        $2::varchar,
        $3::varchar,
        $4::varchar,
        $5::date,
        $6::varchar,
        $7::varchar,
        $8::varchar,
        $9::varchar,
        $10::varchar,
        $11::varchar,
        $12::varchar,
        $13::varchar
      )`,
      [
        normalizarCurp(pacienteValidado.curp),
        pacienteValidado.nombre_p || null,
        pacienteValidado.apellido_pat || null,
        pacienteValidado.apellido_mat || null,
        pacienteValidado.fecha_nacimiento || null,
        pacienteValidado.nombre_sexo || null,
        pacienteValidado.domicilio || null,
        pacienteValidado.nombre_estado_civil || null,
        pacienteValidado.correo || null,
        pacienteValidado.ocupacion || null,
        pacienteValidado.telefono || null,
        pacienteValidado.contacto_emergencia || null,
        pacienteValidado.nombre_tipo_sangre || null
      ]
    );
  } catch (err) {
    const error = new Error(err.message || 'Error al actualizar paciente');
    error.statusCode = 400;
    throw error;
  }

  const res = await db.query(
    `SELECT *
     FROM digiclin.vw_paciente_completo
     WHERE UPPER(TRIM(curp)) = UPPER(TRIM($1::varchar))`,
    [normalizarCurp(pacienteValidado.curp)]
  );

  if (res.rows.length === 0) {
    const error = new Error('Paciente no encontrado después de actualizar');
    error.statusCode = 404;
    throw error;
  }

  return res.rows[0];
};

const corregirCurpPaciente = async ({ curp_actual, nuevo_curp }) => {
  if (!curp_actual) {
    const error = new Error('La CURP actual es obligatoria');
    error.statusCode = 400;
    throw error;
  }

  if (!nuevo_curp) {
    const error = new Error('La nueva CURP es obligatoria');
    error.statusCode = 400;
    throw error;
  }

  if (!validarFormatoCurp(curp_actual)) {
    const error = new Error('La CURP actual tiene un formato inválido');
    error.statusCode = 400;
    throw error;
  }

  if (!validarFormatoCurp(nuevo_curp)) {
    const error = new Error('La nueva CURP tiene un formato inválido');
    error.statusCode = 400;
    throw error;
  }

  try {
    await db.query(
      'CALL digiclin.sp_corregir_curp_paciente($1::varchar, $2::varchar)',
      [normalizarCurp(curp_actual), normalizarCurp(nuevo_curp)]
    );
  } catch (err) {
    if (err.code === '23505') {
      const error = new Error('La nueva CURP ya está registrada');
      error.statusCode = 409;
      throw error;
    }

    const error = new Error(err.message || 'Error al corregir CURP');
    error.statusCode = 400;
    throw error;
  }

  const res = await db.query(
    `SELECT *
     FROM digiclin.vw_paciente_identificador
     WHERE UPPER(TRIM(curp)) = UPPER(TRIM($1::varchar))`,
    [normalizarCurp(nuevo_curp)]
  );

  return res.rows[0];
};

const inhabilitarPaciente = async (curp) => {
  if (!curp) {
    const error = new Error('La CURP es obligatoria');
    error.statusCode = 400;
    throw error;
  }

  if (!validarFormatoCurp(curp)) {
    const error = new Error('La CURP tiene un formato inválido');
    error.statusCode = 400;
    throw error;
  }

  try {
    await db.query(
      'CALL digiclin.sp_inhabilitar_paciente($1::varchar)',
      [normalizarCurp(curp)]
    );
  } catch (err) {
    const error = new Error(err.message || 'Error al inhabilitar paciente');
    error.statusCode = 400;
    throw error;
  }

  const res = await db.query(
    `SELECT *
     FROM digiclin.vw_paciente_completo
     WHERE UPPER(TRIM(curp)) = UPPER(TRIM($1::varchar))`,
    [normalizarCurp(curp)]
  );

  return res.rows[0];
};

const habilitarPaciente = async (curp) => {
  if (!curp) {
    const error = new Error('La CURP es obligatoria');
    error.statusCode = 400;
    throw error;
  }

  if (!validarFormatoCurp(curp)) {
    const error = new Error('La CURP tiene un formato inválido');
    error.statusCode = 400;
    throw error;
  }

  try {
    await db.query(
      'CALL digiclin.sp_habilitar_paciente($1::varchar)',
      [normalizarCurp(curp)]
    );
  } catch (err) {
    const error = new Error(err.message || 'Error al habilitar paciente');
    error.statusCode = 400;
    throw error;
  }

  const res = await db.query(
    `SELECT *
     FROM digiclin.vw_paciente_completo
     WHERE UPPER(TRIM(curp)) = UPPER(TRIM($1::varchar))`,
    [normalizarCurp(curp)]
  );

  return res.rows[0];
};

module.exports = {
  listarTodos,
  listarActivos,
  listarInactivos,
  obtenerPorCurp,
  buscarPorNombre,
  crearPaciente,
  actualizarPaciente,
  corregirCurpPaciente,
  inhabilitarPaciente,
  habilitarPaciente
};