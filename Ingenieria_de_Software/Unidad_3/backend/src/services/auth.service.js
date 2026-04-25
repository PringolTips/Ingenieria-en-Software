const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async ({ correo, password }) => {
  if (!correo || !password) {
    const camposFaltantes = [];
    if (!correo) camposFaltantes.push('correo');
    if (!password) camposFaltantes.push('password');

    const error = new Error('Faltan campos obligatorios');
    error.statusCode = 400;
    error.campos = camposFaltantes;
    throw error;
  }

  const res = await db.query(
    'SELECT * FROM vw_usuario_login WHERE correo = $1',
    [correo]
  );

  if (res.rows.length === 0) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  const usuario = res.rows[0];

  const passwordValido = await bcrypt.compare(password, usuario.password_hash);

  if (!passwordValido) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  if (
    usuario.nombre_estatus &&
    usuario.nombre_estatus.toLowerCase() !== 'activo'
  ) {
    const error = new Error('Usuario inactivo');
    error.statusCode = 403;
    throw error;
  }

  const token = jwt.sign(
    {
      nombre_usuario: usuario.nombre_usuario,
      correo: usuario.correo,
      nombre_rol: usuario.nombre_rol
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return {
    token,
    usuario: {
      nombre_usuario: usuario.nombre_usuario,
      correo: usuario.correo,
      nombre_rol: usuario.nombre_rol,
      nombre_estatus: usuario.nombre_estatus,
      debe_cambiar_password: usuario.debe_cambiar_password
    }
  };
};

const verificarPerfil = async (nombre_usuario) => {
  const res = await db.query(
    'SELECT * FROM vw_usuario_login WHERE nombre_usuario = $1',
    [nombre_usuario]
  );

  if (res.rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const usuario = res.rows[0];

  return {
    nombre_usuario: usuario.nombre_usuario,
    correo: usuario.correo,
    nombre_rol: usuario.nombre_rol,
    nombre_estatus: usuario.nombre_estatus,
    debe_cambiar_password: usuario.debe_cambiar_password
  };
};

const cambiarPassword = async (
  nombre_usuario,
  { password_actual, password_nueva, confirmar_password_nueva }
) => {
  if (!password_actual || !password_nueva || !confirmar_password_nueva) {
    const camposFaltantes = [];

    if (!password_actual) camposFaltantes.push('password_actual');
    if (!password_nueva) camposFaltantes.push('password_nueva');
    if (!confirmar_password_nueva) {
      camposFaltantes.push('confirmar_password_nueva');
    }

    const error = new Error('Faltan campos obligatorios');
    error.statusCode = 400;
    error.campos = camposFaltantes;
    throw error;
  }

  if (password_nueva !== confirmar_password_nueva) {
    const error = new Error(
      'La nueva contraseña y su confirmación no coinciden'
    );
    error.statusCode = 400;
    throw error;
  }

  if (password_nueva.length < 8) {
    const error = new Error(
      'La nueva contraseña debe tener al menos 8 caracteres'
    );
    error.statusCode = 400;
    throw error;
  }

  const res = await db.query(
    'SELECT * FROM digiclin.vw_usuario_login WHERE nombre_usuario = $1::varchar',
    [nombre_usuario]
  );

  if (res.rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const usuario = res.rows[0];

  const coincide = await bcrypt.compare(
    password_actual,
    usuario.password_hash
  );

  if (!coincide) {
    const error = new Error('La contraseña actual es incorrecta');
    error.statusCode = 401;
    throw error;
  }

  const nuevoHash = await bcrypt.hash(password_nueva, 10);

  await db.query(
    'CALL digiclin.sp_cambiar_password_usuario($1::varchar, $2::varchar)',
    [nombre_usuario, nuevoHash]
  );

  return {
    nombre_usuario: usuario.nombre_usuario,
    correo: usuario.correo
  };
};

module.exports = {
  login,
  verificarPerfil,
  cambiarPassword
};