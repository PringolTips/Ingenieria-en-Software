const db = require('../config/db');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;
const PASSWORD_TEMPORAL = '12345678';

const listarTodos = async () => {
  const res = await db.query('SELECT * FROM digiclin.vw_usuario');
  return res.rows;
};

const listarActivos = async () => {
  const res = await db.query('SELECT * FROM vw_usuarios_activos');
  return res.rows;
};

 const obtenerUsuarioPorNombre = async (nombre_usuario) => {
  const res = await db.query(
    'SELECT * FROM vw_usuario WHERE nombre_usuario = $1',
    [nombre_usuario]
  );

  if (res.rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return res.rows[0];
}; 


const crearUsuario = async (usuarioObj) => {

const camposFaltantes = [];

if (!usuarioObj.nombre_usuario) camposFaltantes.push('nombre_usuario');
if (!usuarioObj.correo) camposFaltantes.push('correo');
if (!usuarioObj.nombre_rol) camposFaltantes.push('nombre_rol');

if (camposFaltantes.length > 0) {
  const error = new Error('Faltan campos obligatorios');
  error.statusCode = 400;
  error.campos = camposFaltantes; 
  throw error;
}

const password_hash = await bcrypt.hash(PASSWORD_TEMPORAL, SALT_ROUNDS);

try {
  await db.query(
    'CALL digiclin.sp_crear_usuario($1, $2, $3, $4)',
    [
      usuarioObj.nombre_usuario,
      usuarioObj.correo,
      password_hash,
      usuarioObj.nombre_rol
    ]
  );
} catch (err) {
  if (err.code === '23505') {
    const error = new Error('El nombre de usuario o correo ya existe');
    error.statusCode = 409;
    throw error;
  }

  if (err.code === '23503') {
    const error = new Error('El rol o estatus no existe');
    error.statusCode = 400;
    throw error;
  }

  throw err;
}

  const res = await db.query(
    'SELECT * FROM vw_usuario WHERE nombre_usuario = $1',
    [usuarioObj.nombre_usuario]
  );

  return res.rows[0];
};

const actualizarUsuario = async ({
  nombre_usuario_actual,
  nuevo_nombre_usuario,
  correo,
  password,
  nombre_rol,
  nombre_estatus,
  debe_cambiar_password
}) => {
  if (!nombre_usuario_actual) {
    const error = new Error('nombre_usuario_actual es obligatorio');
    error.statusCode = 400;
    throw error;
  }

  const limpiarTexto = (valor) => {
    if (valor === undefined || valor === null || valor === '') {
      return null;
    }
    return valor;
  };

  const nuevoNombreLimpio = limpiarTexto(nuevo_nombre_usuario);
  const correoLimpio = limpiarTexto(correo);
  const rolLimpio = limpiarTexto(nombre_rol);
  const estatusLimpio = limpiarTexto(nombre_estatus);

  let password_hash = null;

  if (password !== undefined && password !== null && password !== '') {
    password_hash = await bcrypt.hash(password, 10);
  }

  await db.query(
    'CALL digiclin.sp_actualizar_usuario($1::varchar, $2::varchar, $3::varchar, $4::varchar, $5::varchar, $6::varchar, $7::boolean)',
    [
      nombre_usuario_actual,
      nuevoNombreLimpio,
      correoLimpio,
      password_hash,
      rolLimpio,
      estatusLimpio,
      debe_cambiar_password ?? null
    ]
  );

  const nombreFinal = nuevoNombreLimpio || nombre_usuario_actual;

  const res = await db.query(
    'SELECT * FROM digiclin.vw_usuario WHERE nombre_usuario = $1::varchar',
    [nombreFinal]
  );

  if (res.rows.length === 0) {
    const error = new Error('Usuario no encontrado después de actualizar');
    error.statusCode = 404;
    throw error;
  }

  return res.rows[0];
};

const eliminarUsuario = async (nombre_usuario) => {
  const existente = await db.query(
    'SELECT * FROM digiclin.vw_usuario_delete WHERE nombre_usuario = $1::varchar',
    [nombre_usuario]
  );

  if (existente.rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  await db.query(
    'CALL digiclin.sp_eliminar_usuario($1::varchar)',
    [nombre_usuario]
  );

  return existente.rows[0];
};

const obtenerUsuarioPorCorreo = async (correo) => {
  if (!correo) {
    const error = new Error('El correo es obligatorio');
    error.statusCode = 400;
    throw error;
  }

  const res = await db.query(
    'SELECT * FROM digiclin.vw_usuario WHERE LOWER(correo) = LOWER($1::varchar)',
    [correo.trim()]
  );

  if (res.rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return res.rows[0];
};

const inhabilitarUsuario = async (nombre_usuario) => {
  if (!nombre_usuario) {
    const error = new Error('El nombre_usuario es obligatorio');
    error.statusCode = 400;
    throw error;
  }

  try {
    await db.query(
      'CALL digiclin.sp_inhabilitar_usuario($1::varchar)',
      [nombre_usuario]
    );
  } catch (err) {
    const error = new Error(err.message || 'Error al inhabilitar usuario');
    error.statusCode = 400;
    throw error;
  }

  const res = await db.query(
    'SELECT * FROM digiclin.vw_usuario WHERE nombre_usuario = $1::varchar',
    [nombre_usuario]
  );

  return res.rows[0];
};

const habilitarUsuario = async (nombre_usuario) => {
  if (!nombre_usuario) {
    const error = new Error('El nombre_usuario es obligatorio');
    error.statusCode = 400;
    throw error;
  }

  try {
    await db.query(
      'CALL digiclin.sp_habilitar_usuario($1::varchar)',
      [nombre_usuario]
    );
  } catch (err) {
    const error = new Error(err.message || 'Error al habilitar usuario');
    error.statusCode = 400;
    throw error;
  }

  const res = await db.query(
    'SELECT * FROM digiclin.vw_usuario WHERE nombre_usuario = $1::varchar',
    [nombre_usuario]
  );

  return res.rows[0];
};

const actualizarMiPerfil = async ({
  nombre_usuario_actual,
  nuevo_nombre_usuario,
  correo
}) => {
  if (!nombre_usuario_actual) {
    const error = new Error('No autenticado');
    error.statusCode = 401;
    throw error;
  }

  if (!nuevo_nombre_usuario && !correo) {
    const error = new Error('Debes enviar al menos un campo para actualizar');
    error.statusCode = 400;
    throw error;
  }

  try {
    await db.query(
      'CALL digiclin.sp_actualizar_mi_perfil($1::varchar, $2::varchar, $3::varchar)',
      [
        nombre_usuario_actual,
        nuevo_nombre_usuario || null,
        correo || null
      ]
    );
  } catch (err) {
    if (err.code === '23505') {
      const error = new Error('El nombre de usuario o correo ya existe');
      error.statusCode = 409;
      throw error;
    }

    throw err;
  }

  const nombreFinal = nuevo_nombre_usuario || nombre_usuario_actual;

  const res = await db.query(
    'SELECT * FROM digiclin.vw_usuario WHERE nombre_usuario = $1::varchar',
    [nombreFinal]
  );

  return res.rows[0];
};

module.exports = {
  listarActivos,
  listarTodos,
  obtenerUsuarioPorNombre,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarioPorCorreo,
  inhabilitarUsuario,
  habilitarUsuario,
  actualizarMiPerfil
};