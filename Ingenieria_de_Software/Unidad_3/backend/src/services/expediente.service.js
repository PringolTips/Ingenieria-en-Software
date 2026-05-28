const db = require('../config/db');
const { ejecutarConUsuarioBitacora } = require('../utils/bitacoraSesion');

const validarId = (valor, nombreCampo) => {
  const numero = Number(valor);

  if (!valor || Number.isNaN(numero)) {
    const error = new Error(`${nombreCampo} debe ser un número válido`);
    error.statusCode = 400;
    throw error;
  }

  return numero;
};

const esCampoEnviado = (valor) => {
  return valor !== undefined && valor !== null && valor !== '';
};

const validarNumeroEnRango = (valor, nombreCampo, min, max) => {
  if (!esCampoEnviado(valor)) return;

  const numero = Number(valor);

  if (Number.isNaN(numero)) {
    const error = new Error(`${nombreCampo} debe ser numérico`);
    error.statusCode = 400;
    throw error;
  }

  if (numero < min || numero > max) {
    const error = new Error(`${nombreCampo} debe estar entre ${min} y ${max}`);
    error.statusCode = 400;
    throw error;
  }
};

const validarLongitudTexto = (valor, nombreCampo, max) => {
  if (!esCampoEnviado(valor)) return;

  if (String(valor).trim().length > max) {
    const error = new Error(`${nombreCampo} no debe exceder ${max} caracteres`);
    error.statusCode = 400;
    throw error;
  }
};

const validarFechaConsulta = (fechaConsulta) => {
  if (!esCampoEnviado(fechaConsulta)) return;

  const fecha = new Date(fechaConsulta);

  if (Number.isNaN(fecha.getTime())) {
    const error = new Error('fecha_consulta tiene un formato inválido');
    error.statusCode = 400;
    throw error;
  }

  const ahora = new Date();

  if (fecha > ahora) {
    const error = new Error('fecha_consulta no puede ser futura');
    error.statusCode = 400;
    throw error;
  }
};

const validarPresionArterial = (presion) => {
  if (!esCampoEnviado(presion)) return;

  const presionTexto = String(presion).trim();
  const regex = /^\d{2,3}\/\d{2,3}$/;

  if (!regex.test(presionTexto)) {
    const error = new Error('presion_arterial debe tener formato sistólica/diastólica, ejemplo: 120/80');
    error.statusCode = 400;
    throw error;
  }

  const [sistolica, diastolica] = presionTexto.split('/').map(Number);

  if (sistolica < 60 || sistolica > 250) {
    const error = new Error('La presión sistólica debe estar entre 60 y 250');
    error.statusCode = 400;
    throw error;
  }

  if (diastolica < 30 || diastolica > 150) {
    const error = new Error('La presión diastólica debe estar entre 30 y 150');
    error.statusCode = 400;
    throw error;
  }

  if (sistolica <= diastolica) {
    const error = new Error('La presión sistólica debe ser mayor que la diastólica');
    error.statusCode = 400;
    throw error;
  }
};

const validarValoresExpediente = (expedienteObj = {}) => {
  validarFechaConsulta(expedienteObj.fecha_consulta);

  validarLongitudTexto(expedienteObj.motivo, 'motivo', 4000);
  validarLongitudTexto(expedienteObj.antecedentes_personales, 'antecedentes_personales', 4000);
  validarLongitudTexto(expedienteObj.antecedentes_familiares, 'antecedentes_familiares', 4000);
  validarLongitudTexto(expedienteObj.observaciones, 'observaciones', 4000);
  validarLongitudTexto(expedienteObj.presion_arterial, 'presion_arterial', 20);

  validarPresionArterial(expedienteObj.presion_arterial);

  validarNumeroEnRango(expedienteObj.frecuencia_cardiaca, 'frecuencia_cardiaca', 30, 220);
  validarNumeroEnRango(expedienteObj.frecuencia_respiratoria, 'frecuencia_respiratoria', 5, 60);
  validarNumeroEnRango(expedienteObj.temperatura, 'temperatura', 30, 45);
  validarNumeroEnRango(expedienteObj.saturacion_oxigeno, 'saturacion_oxigeno', 50, 100);
  validarNumeroEnRango(expedienteObj.peso, 'peso', 0.5, 500);
  validarNumeroEnRango(expedienteObj.talla_cintura, 'talla_cintura', 20, 250);
  validarNumeroEnRango(expedienteObj.altura, 'altura', 0.3, 2.5);
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


const obtenerPorIdPaciente = async (id_paciente) => {
  const id = validarId(id_paciente, 'id_paciente');

  const res = await db.query(
    'SELECT * FROM digiclin.fn_expedientes_por_id_paciente($1::integer)',
    [id]
  );

  return res.rows;
};

const obtenerPorFechaConsulta = async (fecha_consulta) => {
  if (!fecha_consulta) {
    const error = new Error('fecha_consulta es obligatoria');
    error.statusCode = 400;
    throw error;
  }

  const fecha = new Date(`${fecha_consulta}T00:00:00`);

  if (Number.isNaN(fecha.getTime())) {
    const error = new Error('fecha_consulta debe tener formato válido YYYY-MM-DD');
    error.statusCode = 400;
    throw error;
  }

  const res = await db.query(
    'SELECT * FROM digiclin.fn_expedientes_por_fecha_consulta($1::date)',
    [fecha_consulta]
  );

  return res.rows;
};

const obtenerPorRangoFechas = async ({ fecha_inicio, fecha_fin }) => {
  if (!fecha_inicio || !fecha_fin) {
    const error = new Error('fecha_inicio y fecha_fin son obligatorias');
    error.statusCode = 400;
    throw error;
  }

  const inicio = new Date(`${fecha_inicio}T00:00:00`);
  const fin = new Date(`${fecha_fin}T00:00:00`);

  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
    const error = new Error('Las fechas deben tener formato válido YYYY-MM-DD');
    error.statusCode = 400;
    throw error;
  }

  if (inicio > fin) {
    const error = new Error('fecha_inicio no puede ser mayor que fecha_fin');
    error.statusCode = 400;
    throw error;
  }

  const res = await db.query(
    'SELECT * FROM digiclin.fn_expedientes_por_rango_fechas($1::date, $2::date)',
    [fecha_inicio, fecha_fin]
  );

  return res.rows;
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

const valorONull = (valor) => {
  if (valor === undefined || valor === null || valor === '') return null;
  return valor;
};

const numeroONull = (valor) => {
  if (valor === undefined || valor === null || valor === '') return null;
  return Number(valor);
};

const crearExpediente = async (expedienteObj = {}, usuarioAutenticado = {}) => {
  const camposFaltantes = [];

  if (!usuarioAutenticado.id_usuario) camposFaltantes.push('id_usuario_token');
  if (!expedienteObj.id_paciente) camposFaltantes.push('id_paciente');
  if (!expedienteObj.id_diagnostico) camposFaltantes.push('id_diagnostico');
  if (!expedienteObj.motivo) camposFaltantes.push('motivo');

  if (camposFaltantes.length > 0) {
    const error = new Error('Faltan campos obligatorios');
    error.statusCode = 400;
    error.campos = camposFaltantes;
    throw error;
  }

  if (Object.prototype.hasOwnProperty.call(expedienteObj, 'fecha_consulta')) {
    const error = new Error('No debes enviar fecha_consulta; se genera automáticamente');
    error.statusCode = 400;
    throw error;
  }

  validarValoresExpediente(expedienteObj);

  let idExpedienteGenerado = null;

  try {
    await ejecutarConUsuarioBitacora(usuarioAutenticado, async (client) => {
      const res = await client.query(
        `CALL digiclin.sp_crear_expediente_desde_usuario(
          $1::integer,
          $2::integer,
          $3::integer,
          $4::varchar,
          $5::varchar,
          $6::varchar,
          $7::varchar,
          $8::numeric,
          $9::numeric,
          $10::numeric,
          $11::numeric,
          $12::numeric,
          $13::numeric,
          $14::numeric,
          $15::varchar,
          $16::integer
        )`,
        [
          Number(usuarioAutenticado.id_usuario),
          Number(expedienteObj.id_paciente),
          Number(expedienteObj.id_diagnostico),
          expedienteObj.motivo,
          valorONull(expedienteObj.antecedentes_personales),
          valorONull(expedienteObj.antecedentes_familiares),
          valorONull(expedienteObj.presion_arterial),
          numeroONull(expedienteObj.frecuencia_cardiaca),
          numeroONull(expedienteObj.frecuencia_respiratoria),
          numeroONull(expedienteObj.temperatura),
          numeroONull(expedienteObj.saturacion_oxigeno),
          numeroONull(expedienteObj.peso),
          numeroONull(expedienteObj.talla_cintura),
          numeroONull(expedienteObj.altura),
          valorONull(expedienteObj.observaciones),
          null
        ]
      );

      idExpedienteGenerado = res.rows[0]?.p_id_expediente_generado;
    });
  } catch (err) {
    const error = new Error(err.message || 'Error al crear expediente');
    error.statusCode = 400;
    throw error;
  }

  if (!idExpedienteGenerado) {
    return {
      mensaje: 'Expediente creado, pero no se recibió el ID generado'
    };
  }

  return await obtenerPorId(idExpedienteGenerado);
};

const actualizarExpediente = async (expedienteObj = {}, usuarioAutenticado = {}) => {
  const id = validarId(expedienteObj.id_expediente, 'id_expediente');

  if (Object.prototype.hasOwnProperty.call(expedienteObj, 'fecha_consulta')) {
    const error = new Error('No se permite modificar fecha_consulta');
    error.statusCode = 400;
    throw error;
  }

  const camposActualizables = [
    'id_paciente',
    'id_diagnostico',
    'motivo',
    'antecedentes_personales',
    'antecedentes_familiares',
    'presion_arterial',
    'frecuencia_cardiaca',
    'frecuencia_respiratoria',
    'temperatura',
    'saturacion_oxigeno',
    'peso',
    'talla_cintura',
    'altura',
    'observaciones'
  ];

  const tieneAlgunCampo = camposActualizables.some(
    (campo) =>
      expedienteObj[campo] !== undefined &&
      expedienteObj[campo] !== null &&
      expedienteObj[campo] !== ''
  );

  if (!tieneAlgunCampo) {
    const error = new Error('Debes enviar al menos un campo para actualizar');
    error.statusCode = 400;
    throw error;
  }

  validarValoresExpediente(expedienteObj);

  try {
    await ejecutarConUsuarioBitacora(usuarioAutenticado, async (client) => {
      await client.query(
        `CALL digiclin.sp_actualizar_expediente(
          $1::integer,
          $2::integer,
          $3::integer,
          $4::varchar,
          $5::varchar,
          $6::varchar,
          $7::varchar,
          $8::numeric,
          $9::numeric,
          $10::numeric,
          $11::numeric,
          $12::numeric,
          $13::numeric,
          $14::numeric,
          $15::varchar
        )`,
        [
          id,
          expedienteObj.id_paciente ? Number(expedienteObj.id_paciente) : null,
          expedienteObj.id_diagnostico ? Number(expedienteObj.id_diagnostico) : null,
          valorONull(expedienteObj.motivo),
          valorONull(expedienteObj.antecedentes_personales),
          valorONull(expedienteObj.antecedentes_familiares),
          valorONull(expedienteObj.presion_arterial),
          numeroONull(expedienteObj.frecuencia_cardiaca),
          numeroONull(expedienteObj.frecuencia_respiratoria),
          numeroONull(expedienteObj.temperatura),
          numeroONull(expedienteObj.saturacion_oxigeno),
          numeroONull(expedienteObj.peso),
          numeroONull(expedienteObj.talla_cintura),
          numeroONull(expedienteObj.altura),
          valorONull(expedienteObj.observaciones)
        ]
      );
    });
  } catch (err) {
    const error = new Error(err.message || 'Error al actualizar expediente');
    error.statusCode = 400;
    throw error;
  }

  return await obtenerPorId(id);
};

const archivarExpediente = async (id_expediente, usuarioAutenticado = {}) => {
  const id = validarId(id_expediente, 'id_expediente');

  try {
    await ejecutarConUsuarioBitacora(usuarioAutenticado, async (client) => {
      await client.query(
        'CALL digiclin.sp_archivar_expediente($1::integer)',
        [id]
      );
    });
  } catch (err) {
    const error = new Error(err.message || 'Error al archivar expediente');
    error.statusCode = 400;
    throw error;
  }

  return await obtenerPorId(id);
};

const desarchivarExpediente = async (id_expediente, usuarioAutenticado = {}) => {
  const id = validarId(id_expediente, 'id_expediente');

  try {
    await ejecutarConUsuarioBitacora(usuarioAutenticado, async (client) => {
      await client.query(
        'CALL digiclin.sp_desarchivar_expediente($1::integer)',
        [id]
      );
    });
  } catch (err) {
    const error = new Error(err.message || 'Error al desarchivar expediente');
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
  obtenerPorFechaConsulta,
  obtenerPorRangoFechas,
  obtenerPorIdPaciente,
  obtenerPorIdUsuarioCreador,
  obtenerPorNombreUsuarioCreador,
  crearExpediente,
  actualizarExpediente,
  archivarExpediente,
  desarchivarExpediente
};