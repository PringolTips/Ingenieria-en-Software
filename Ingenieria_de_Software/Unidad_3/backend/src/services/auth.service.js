const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;

const validarPasswordNueva = (passwordNueva, nombreUsuario) => {
  if (passwordNueva.length < 8) {
    const error = new Error('La nueva contraseña debe tener al menos 8 caracteres');
    error.statusCode = 400;
    throw error;
  }

  if (!/[a-zA-Z]/.test(passwordNueva)) {
    const error = new Error('La nueva contraseña debe contener al menos una letra');
    error.statusCode = 400;
    throw error;
  }

  if (!/[0-9]/.test(passwordNueva)) {
    const error = new Error('La nueva contraseña debe contener al menos un número');
    error.statusCode = 400;
    throw error;
  }

  if (passwordNueva.toLowerCase() === nombreUsuario.toLowerCase()) {
    const error = new Error('La contraseña no puede ser igual al nombre de usuario');
    error.statusCode = 400;
    throw error;
  }
};

const login = async ({ identificador, password }) => {
  const camposFaltantes = [];

  if (!identificador) camposFaltantes.push('identificador');
  if (!password) camposFaltantes.push('password');

  if (camposFaltantes.length > 0) {
    const error = new Error('Faltan campos obligatorios');
    error.statusCode = 400;
    error.campos = camposFaltantes;
    throw error;
  }

  const res = await db.query(
    `SELECT *
     FROM digiclin.vw_usuario_login
     WHERE LOWER(correo) = LOWER($1::varchar)
        OR LOWER(nombre_usuario) = LOWER($1::varchar)`,
    [identificador.trim()]
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
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      correo: usuario.correo,
      nombre_rol: usuario.nombre_rol
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return {
    token,
    requiere_cambio_password: usuario.debe_cambiar_password,
    usuario: {
      id_usuario: usuario.id_usuario,
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
    `SELECT *
     FROM digiclin.vw_usuario_login
     WHERE nombre_usuario = $1`,
    [nombre_usuario]
  );

  if (res.rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const usuario = res.rows[0];

  return {
    id_usuario: usuario.id_usuario,
    nombre_usuario: usuario.nombre_usuario,
    correo: usuario.correo,
    nombre_rol: usuario.nombre_rol,
    nombre_estatus: usuario.nombre_estatus,
    debe_cambiar_password: usuario.debe_cambiar_password
  };
};

const cambiarPassword = async ({
  identificador,
  correo,
  password_actual,
  password_nueva,
  confirmar_password_nueva
}) => {
  const usuarioIdentificador = identificador || correo;

  const camposFaltantes = [];

  if (!usuarioIdentificador) camposFaltantes.push('identificador');
  if (!password_actual) camposFaltantes.push('password_actual');
  if (!password_nueva) camposFaltantes.push('password_nueva');
  if (!confirmar_password_nueva) camposFaltantes.push('confirmar_password_nueva');

  if (camposFaltantes.length > 0) {
    const error = new Error('Faltan campos obligatorios');
    error.statusCode = 400;
    error.campos = camposFaltantes;
    throw error;
  }

  if (password_nueva !== confirmar_password_nueva) {
    const error = new Error('La nueva contraseña y su confirmación no coinciden');
    error.statusCode = 400;
    throw error;
  }

  const res = await db.query(
    `SELECT *
     FROM digiclin.vw_usuario_login
     WHERE LOWER(correo) = LOWER($1::varchar)
        OR LOWER(nombre_usuario) = LOWER($1::varchar)`,
    [usuarioIdentificador.trim()]
  );

  if (res.rows.length === 0) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const usuario = res.rows[0];

  validarPasswordNueva(password_nueva, usuario.nombre_usuario);

  const coincide = await bcrypt.compare(
    password_actual,
    usuario.password_hash
  );

  if (!coincide) {
    const error = new Error('La contraseña actual es incorrecta');
    error.statusCode = 401;
    throw error;
  }

  const nuevoHash = await bcrypt.hash(password_nueva, SALT_ROUNDS);

  await db.query(
    'CALL digiclin.sp_cambiar_password_usuario($1::varchar, $2::varchar)',
    [usuario.nombre_usuario, nuevoHash]
  );

  return {
    nombre_usuario: usuario.nombre_usuario,
    correo: usuario.correo,
    debe_cambiar_password: false
  };
};

module.exports = {
  login,
  verificarPerfil,
  cambiarPassword
};