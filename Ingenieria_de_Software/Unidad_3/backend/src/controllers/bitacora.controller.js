const bitacoraService = require('../services/bitacora.service');

const obtenerBitacoraPacientes = async (req, res, next) => {
  try {
    const { limit } = req.query;

    const data = await bitacoraService.listarBitacoraPacientes(limit);

    res.json({
      ok: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

const obtenerBitacoraExpedientes = async (req, res, next) => {
  try {
    const { limit } = req.query;

    const data = await bitacoraService.listarBitacoraExpedientes(limit);

    res.json({
      ok: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerBitacoraPacientes,
  obtenerBitacoraExpedientes
};