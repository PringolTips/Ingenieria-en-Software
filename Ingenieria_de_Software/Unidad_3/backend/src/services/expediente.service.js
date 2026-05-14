const db = require('../config/db');

const validarId = (valor, nombreCampo) => {
  const numero = Number(valor);

  if (!valor || Number.isNaN(numero)) {
    const error = new Error(`${nombreCampo} debe ser un número válido`);
    error.statusCode = 400;
    throw error;
  }

  return numero;
};

const listarTodos = async () => {
  const res = await db.query('SELECT * FROM digiclin.vw_expedientes');
  return res.rows;
};

const listarAbiertos = async () => {
  const res = await db.query('SELECT * FROM digiclin.vw_expedientes_abiertos');
  return res.rows;
};

const listarArchivados = async () => {
  const res = await db.query('SELECT * FROM digiclin.vw_expedientes_archivados');
  return res.rows;
};

const obtenerPorId = async (id_expediente) => {
  const id = validarId(id_expediente, 'id_expediente');

  const res = await db.query(
    `SELECT *
     FROM digiclin.vw_expedientes
     WHERE id_expediente = $1::integer`,
    [id]
  );

  if (res.rows.length === 0) {
    const error = new Error('Expediente no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return res.rows[0];
};

const obtenerPorPaciente = async (curp) => {
  if (!curp) {
    const error = new Error('La CURP es obligatoria');
    error.statusCode = 400;
    throw error;
  }

  const res = await db.query(
    `SELECT *
     FROM digiclin.vw_expedientes
     WHERE UPPER(TRIM(curp)) = UPPER(TRIM($1::varchar))`,
    [curp]
  );

  return res.rows;
};

const obtenerPorIdUsuarioCreador = async (id_usuario) => {
  const id = validarId(id_usuario, 'id_usuario');

  const res = await db.query(
    'SELECT * FROM digiclin.fn_expedientes_por_Id_usuario($1::integer)',
    [id]
  );

  return res.rows;
};

const obtenerPorNombreUsuarioCreador = async (nombre_usuario) => {
  if (!nombre_usuario) {
    const error = new Error('El nombre_usuario es obligatorio');
    error.statusCode = 400;
    throw error;
  }

  const res = await db.query(
    'SELECT * FROM digiclin.fn_expedientes_por_nombre_usuario($1::varchar)',
    [nombre_usuario]
  );

  return res.rows;
};

const crearExpediente = async (expedienteObj = {}) => {
  const camposFaltantes = [];

  if (!expedienteObj.id_paciente) camposFaltantes.push('id_paciente');
  if (!expedienteObj.id_medico) camposFaltantes.push('id_medico');
  if (!expedienteObj.id_diagnostico) camposFaltantes.push('id_diagnostico');
  if (!expedienteObj.fecha_consulta) camposFaltantes.push('fecha_consulta');
  if (!expedienteObj.motivo) camposFaltantes.push('motivo');

  if (camposFaltantes.length > 0) {
    const error = new Error('Faltan campos obligatorios');
    error.statusCode = 400;
    error.campos = camposFaltantes;
    throw error;
  }

  try {
    await db.query(
      `CALL digiclin.sp_crear_expediente(
        $1::integer,
        $2::integer,
        $3::integer,
        $4::timestamp,
        $5::varchar,
        $6::varchar,
        $7::varchar,
        $8::varchar,
        $9::numeric,
        $10::numeric,
        $11::numeric,
        $12::numeric,
        $13::numeric,
        $14::numeric,
        $15::numeric,
        $16::varchar
      )`,
      [
        Number(expedienteObj.id_paciente),
        Number(expedienteObj.id_medico),
        Number(expedienteObj.id_diagnostico),
        expedienteObj.fecha_consulta,
        expedienteObj.motivo,
        expedienteObj.antecedentes_personales || null,
        expedienteObj.antecedentes_familiares || null,
        expedienteObj.presion_arterial || null,
        expedienteObj.frecuencia_cardiaca || null,
        expedienteObj.frecuencia_respiratoria || null,
        expedienteObj.temperatura || null,
        expedienteObj.saturacion_oxigeno || null,
        expedienteObj.peso || null,
        expedienteObj.talla_cintura || null,
        expedienteObj.altura || null,
        expedienteObj.observaciones || null
      ]
    );
  } catch (err) {
    const error = new Error(err.message || 'Error al crear expediente');
    error.statusCode = 400;
    throw error;
  }

  const res = await db.query(
    `SELECT *
     FROM digiclin.vw_expedientes
     WHERE id_paciente = $1::integer
     ORDER BY id_expediente DESC
     LIMIT 1`,
    [Number(expedienteObj.id_paciente)]
  );

  return res.rows[0];
};

const actualizarExpediente = async (expedienteObj = {}) => {
  const id = validarId(expedienteObj.id_expediente, 'id_expediente');

  const camposFaltantes = [];

  if (!expedienteObj.id_paciente) camposFaltantes.push('id_paciente');
  if (!expedienteObj.id_medico) camposFaltantes.push('id_medico');
  if (!expedienteObj.id_diagnostico) camposFaltantes.push('id_diagnostico');
  if (!expedienteObj.fecha_consulta) camposFaltantes.push('fecha_consulta');
  if (!expedienteObj.motivo) camposFaltantes.push('motivo');

  if (camposFaltantes.length > 0) {
    const error = new Error('Faltan campos obligatorios');
    error.statusCode = 400;
    error.campos = camposFaltantes;
    throw error;
  }

  try {
    await db.query(
      `CALL digiclin.sp_actualizar_expediente(
        $1::integer,
        $2::integer,
        $3::integer,
        $4::integer,
        $5::timestamp,
        $6::varchar,
        $7::varchar,
        $8::varchar,
        $9::varchar,
        $10::numeric,
        $11::numeric,
        $12::numeric,
        $13::numeric,
        $14::numeric,
        $15::numeric,
        $16::numeric,
        $17::varchar
      )`,
      [
        id,
        Number(expedienteObj.id_paciente),
        Number(expedienteObj.id_medico),
        Number(expedienteObj.id_diagnostico),
        expedienteObj.fecha_consulta,
        expedienteObj.motivo,
        expedienteObj.antecedentes_personales || null,
        expedienteObj.antecedentes_familiares || null,
        expedienteObj.presion_arterial || null,
        expedienteObj.frecuencia_cardiaca || null,
        expedienteObj.frecuencia_respiratoria || null,
        expedienteObj.temperatura || null,
        expedienteObj.saturacion_oxigeno || null,
        expedienteObj.peso || null,
        expedienteObj.talla_cintura || null,
        expedienteObj.altura || null,
        expedienteObj.observaciones || null
      ]
    );
  } catch (err) {
    const error = new Error(err.message || 'Error al actualizar expediente');
    error.statusCode = 400;
    throw error;
  }

  return await obtenerPorId(id);
};

const archivarExpediente = async (id_expediente) => {
  const id = validarId(id_expediente, 'id_expediente');

  try {
    await db.query(
      'CALL digiclin.sp_archivar_expediente($1::integer)',
      [id]
    );
  } catch (err) {
    const error = new Error(err.message || 'Error al archivar expediente');
    error.statusCode = 400;
    throw error;
  }

  return await obtenerPorId(id);
};

module.exports = {
  listarTodos,
  listarAbiertos,
  listarArchivados,
  obtenerPorId,
  obtenerPorPaciente,
  obtenerPorIdUsuarioCreador,
  obtenerPorNombreUsuarioCreador,
  crearExpediente,
  actualizarExpediente,
  archivarExpediente
};