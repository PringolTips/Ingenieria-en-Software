const db = require('../config/db');

const ejecutarConUsuarioBitacora = async (usuarioAutenticado = {}, operacion) => {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      `SELECT set_config('digiclin.id_usuario', $1, true)`,
      [String(usuarioAutenticado.id_usuario || '')]
    );

    await client.query(
      `SELECT set_config('digiclin.nombre_usuario', $1, true)`,
      [String(usuarioAutenticado.nombre_usuario || '')]
    );

    await client.query(
      `SELECT set_config('digiclin.nombre_rol', $1, true)`,
      [String(usuarioAutenticado.nombre_rol || '')]
    );

    const resultado = await operacion(client);

    await client.query('COMMIT');

    return resultado;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  ejecutarConUsuarioBitacora
};