const expedienteService = require('../services/expediente.service');

const obtenerExpedientes = async (req, res, next) => {
  try {
    const data = await expedienteService.listarTodos();
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
};

const obtenerAbiertos = async (req, res, next) => {
  try {
    const data = await expedienteService.listarAbiertos();
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
};

const obtenerArchivados = async (req, res, next) => {
  try {
    const data = await expedienteService.listarArchivados();
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
};

const obtenerPorId = async (req, res, next) => {
  try {
    const { id_expediente } = req.params;
    const data = await expedienteService.obtenerPorId(id_expediente);
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
};

const obtenerPorPaciente = async (req, res, next) => {
  try {
    const { curp } = req.params;
    const data = await expedienteService.obtenerPorPaciente(curp);
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
};

const obtenerPorIdUsuarioCreador = async (req, res, next) => {
  try {
    const { id_usuario } = req.params;

    const data = await expedienteService.obtenerPorIdUsuarioCreador(id_usuario);

    res.json({
      ok: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

const obtenerPorNombreUsuarioCreador = async (req, res, next) => {
  try {
    const { nombre_usuario } = req.params;

    const data = await expedienteService.obtenerPorNombreUsuarioCreador(nombre_usuario);

    res.json({
      ok: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

const crearExpediente = async (req, res, next) => {
  try {
    const data = await expedienteService.crearExpediente(
      req.body || {},
      req.usuario
    );

    res.status(201).json({
      ok: true,
      mensaje: 'Expediente creado correctamente',
      data
    });
  } catch (error) {
    next(error);
  }
};

const actualizarExpediente = async (req, res, next) => {
  try {
    const { id_expediente } = req.params;

    const data = await expedienteService.actualizarExpediente({
      id_expediente,
      ...req.body
    });

    res.json({
      ok: true,
      mensaje: 'Expediente actualizado correctamente',
      data
    });
  } catch (error) {
    next(error);
  }
};

const archivarExpediente = async (req, res, next) => {
  try {
    const { id_expediente } = req.params;

    const data = await expedienteService.archivarExpediente(id_expediente);

    res.json({
      ok: true,
      mensaje: 'Expediente archivado correctamente',
      data
    });
  } catch (error) {
    next(error);
  }
};

const desarchivarExpediente = async (req, res, next) => {
  try {
    const { id_expediente } = req.params;

    const data = await expedienteService.desarchivarExpediente(id_expediente);

    res.json({
      ok: true,
      mensaje: 'Expediente desarchivado correctamente',
      data
    });
  } catch (error) {
    next(error);
  }
};



module.exports = {
  obtenerExpedientes,
  obtenerAbiertos,
  obtenerArchivados,
  obtenerPorId,
  obtenerPorPaciente,
  obtenerPorIdUsuarioCreador,
  obtenerPorNombreUsuarioCreador,
  crearExpediente,
  actualizarExpediente,
  archivarExpediente,
  desarchivarExpediente
};