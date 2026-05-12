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
  const camposFaltantes = [];

  if (!pacienteObj.nombre_p) camposFaltantes.push('nombre_p');
  if (!pacienteObj.apellido_pat) camposFaltantes.push('apellido_pat');
  if (!pacienteObj.apellido_mat) camposFaltantes.push('apellido_mat');
  if (!pacienteObj.fecha_nacimiento) camposFaltantes.push('fecha_nacimiento');
  if (!pacienteObj.nombre_sexo) camposFaltantes.push('nombre_sexo');
  if (!pacienteObj.curp) camposFaltantes.push('curp');
  if (!pacienteObj.domicilio) camposFaltantes.push('domicilio');
  if (!pacienteObj.telefono) camposFaltantes.push('telefono');
  if (!pacienteObj.contacto_emergencia) camposFaltantes.push('contacto_emergencia');

  if (camposFaltantes.length > 0) {
    const error = new Error('Faltan campos obligatorios');
    error.statusCode = 400;
    error.campos = camposFaltantes;
    throw error;
  }

  if (!validarFormatoCurp(pacienteObj.curp)) {
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
        pacienteObj.nombre_p,
        pacienteObj.apellido_pat,
        pacienteObj.apellido_mat,
        pacienteObj.fecha_nacimiento,
        pacienteObj.nombre_sexo,
        normalizarCurp(pacienteObj.curp),
        pacienteObj.domicilio,
        pacienteObj.nombre_estado_civil || null,
        pacienteObj.correo || null,
        pacienteObj.ocupacion || null,
        pacienteObj.telefono,
        pacienteObj.contacto_emergencia,
        pacienteObj.nombre_tipo_sangre || null
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
    [normalizarCurp(pacienteObj.curp)]
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
        normalizarCurp(pacienteObj.curp),
        pacienteObj.nombre_p || null,
        pacienteObj.apellido_pat || null,
        pacienteObj.apellido_mat || null,
        pacienteObj.fecha_nacimiento || null,
        pacienteObj.nombre_sexo || null,
        pacienteObj.domicilio || null,
        pacienteObj.nombre_estado_civil || null,
        pacienteObj.correo || null,
        pacienteObj.ocupacion || null,
        pacienteObj.telefono || null,
        pacienteObj.contacto_emergencia || null,
        pacienteObj.nombre_tipo_sangre || null
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
    [normalizarCurp(pacienteObj.curp)]
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