const pacienteService = require('../services/paciente.service');

const obtenerPacientes = async (req, res, next) => {
  try {
    const rol = req.usuario.nombre_rol;
    const pacientes = await pacienteService.listarTodos(rol);

    res.json({ ok: true, data: pacientes });
  } catch (error) {
    next(error);
  }
};

const obtenerPacientesActivos = async (req, res, next) => {
  try {
    const rol = req.usuario.nombre_rol;
    const pacientes = await pacienteService.listarActivos(rol);

    res.json({ ok: true, data: pacientes });
  } catch (error) {
    next(error);
  }
};

const obtenerPacientesInactivos = async (req, res, next) => {
  try {
    const rol = req.usuario.nombre_rol;
    const pacientes = await pacienteService.listarInactivos(rol);

    res.json({ ok: true, data: pacientes });
  } catch (error) {
    next(error);
  }
};

const obtenerPacientePorCurp = async (req, res, next) => {
  try {
    const { curp } = req.params;
    const rol = req.usuario.nombre_rol;

    const paciente = await pacienteService.obtenerPorCurp(curp, rol);

    res.json({ ok: true, data: paciente });
  } catch (error) {
    next(error);
  }
};

const obtenerPacientesPorNombre = async (req, res, next) => {
  try {
    const { nombre } = req.query;
    const rol = req.usuario.nombre_rol;

    const pacientes = await pacienteService.buscarPorNombre(nombre, rol);

    res.json({ ok: true, data: pacientes });
  } catch (error) {
    next(error);
  }
};

const crearPaciente = async (req, res, next) => {
  try {
    const data = await pacienteService.crearPaciente(req.body || {});

    res.status(201).json({
      ok: true,
      mensaje: 'Paciente registrado correctamente',
      data
    });
  } catch (error) {
    next(error);
  }
};

const actualizarPaciente = async (req, res, next) => {
  try {
    const { curp } = req.params;

    const data = await pacienteService.actualizarPaciente({
      curp,
      ...req.body
    });

    res.json({
      ok: true,
      mensaje: 'Paciente actualizado correctamente',
      data
    });
  } catch (error) {
    next(error);
  }
};

const corregirCurpPaciente = async (req, res, next) => {
  try {
    const { curp } = req.params;
    const { nuevo_curp } = req.body;

    const data = await pacienteService.corregirCurpPaciente({
      curp_actual: curp,
      nuevo_curp
    });

    res.json({
      ok: true,
      mensaje: 'CURP corregida correctamente',
      data
    });
  } catch (error) {
    next(error);
  }
};

const inhabilitarPaciente = async (req, res, next) => {
  try {
    const { curp } = req.params;

    const data = await pacienteService.inhabilitarPaciente(curp);

    res.json({
      ok: true,
      mensaje: 'Paciente inhabilitado correctamente',
      data
    });
  } catch (error) {
    next(error);
  }
};

const habilitarPaciente = async (req, res, next) => {
  try {
    const { curp } = req.params;

    const data = await pacienteService.habilitarPaciente(curp);

    res.json({
      ok: true,
      mensaje: 'Paciente habilitado correctamente',
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerPacientes,
  obtenerPacientesActivos,
  obtenerPacientesInactivos,
  obtenerPacientePorCurp,
  obtenerPacientesPorNombre,
  crearPaciente,
  actualizarPaciente,
  corregirCurpPaciente,
  inhabilitarPaciente,
  habilitarPaciente
};