const db = require('../config/db');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

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
if (!usuarioObj.password) camposFaltantes.push('password');
if (!usuarioObj.nombre_rol) camposFaltantes.push('nombre_rol');
if (!usuarioObj.nombre_estatus) camposFaltantes.push('nombre_estatus');

if (camposFaltantes.length > 0) {
  const error = new Error('Faltan campos obligatorios');
  error.statusCode = 400;
  error.campos = camposFaltantes; 
  throw error;
}

  const password_hash = await bcrypt.hash(usuarioObj.password, SALT_ROUNDS);

  try {
    await db.query('CALL sp_crear_usuario($1, $2, $3, $4, $5, $6)', [
      usuarioObj.nombre_usuario,
      usuarioObj.correo,
      password_hash,
      usuarioObj.nombre_rol,
      usuarioObj.nombre_estatus,
      usuarioObj.debe_cambiar_password ?? true
    ]);
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

  let password_hash = null;

  if (password !== undefined && password !== null && password !== '') {
    password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  }

  try {
    await db.query('CALL sp_actualizar_usuario($1, $2, $3, $4, $5, $6, $7)', [
      nombre_usuario_actual,
      nuevo_nombre_usuario ?? null,
      correo ?? null,
      password_hash,
      nombre_rol ?? null,
      nombre_estatus ?? null,
      debe_cambiar_password ?? null
    ]);
  } catch (err) {
    if (err.code === '23505') {
      const error = new Error('El nuevo nombre de usuario o correo ya existe');
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

  const nombreFinal = nuevo_nombre_usuario || nombre_usuario_actual;

  const res = await db.query(
    'SELECT * FROM vw_usuario WHERE nombre_usuario = $1',
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
    'SELECT * FROM vw_usuario WHERE nombre_usuario = $1',
    [nombre_usuario]
  );

  if (existente.rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  await db.query('CALL sp_eliminar_usuario($1)', [nombre_usuario]);

  return {
    mensaje: 'Usuario eliminado correctamente',
    usuario: existente.rows[0]
  };
};

module.exports = {
  listarActivos,
  obtenerUsuarioPorNombre,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};