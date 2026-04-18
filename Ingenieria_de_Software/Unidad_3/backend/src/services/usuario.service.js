const db = require('../config/db');
const bcrypt = require('bcrypt');

const listarActivos = async () => {
  const res = await db.query('SELECT * FROM vw_usuarios_activos');
  return res.rows;
};

const crearUsuario = async (usuarioObj) => {
  const password_hash = await bcrypt.hash(usuarioObj.password, 10);

  await db.query('CALL sp_crear_usuario($1, $2, $3, $4, $5, $6)', [
    usuarioObj.nombre_usuario,
    usuarioObj.correo,
    password_hash,
    usuarioObj.nombre_rol,
    usuarioObj.nombre_estatus,
    usuarioObj.debe_cambiar_password ?? true
  ]);

  const res = await db.query(
    'SELECT * FROM vw_usuario WHERE nombre_usuario = $1',
    [usuarioObj.nombre_usuario]
  );

  return res.rows[0];
};

module.exports = {
  listarActivos,
  crearUsuario
};