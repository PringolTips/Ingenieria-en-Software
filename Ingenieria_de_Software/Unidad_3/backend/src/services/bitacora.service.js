const db = require('../config/db');

const validarLimit = (limit) => {
  const numero = Number(limit || 50);

  if (Number.isNaN(numero) || numero <= 0) {
    return 50;
  }

  return Math.min(numero, 200);
};

const listarBitacoraPacientes = async (limit) => {
  const limite = validarLimit(limit);

  const res = await db.query(
    `SELECT *
     FROM digiclin.vw_bitacora_pacientes
     ORDER BY fecha_bitacora DESC
     LIMIT $1::integer`,
    [limite]
  );

  return res.rows;
};

const listarBitacoraExpedientes = async (limit) => {
  const limite = validarLimit(limit);

  const res = await db.query(
    `SELECT *
     FROM digiclin.vw_bitacora_expedientes
     ORDER BY fecha_bitacora DESC
     LIMIT $1::integer`,
    [limite]
  );

  return res.rows;
};

module.exports = {
  listarBitacoraPacientes,
  listarBitacoraExpedientes
};