const usuarioService = require('../services/usuario.service');

const obtenerUsuarios = async (req, res, next) => {
  try {
    const usuarios = await usuarioService.listarTodos();
    res.json({
      ok: true,
      data: usuarios
    });
  } catch (error) {
    next(error);
  }
};
const obtenerActivos = async (req, res, next) => {
  try {
    const usuarios = await usuarioService.listarActivos();
    res.json({ ok: true, data: usuarios });
  } catch (error) {
    next(error);
  }
};

const obtenerUsuarioPorNombre = async (req, res, next) => {
  try {
    const { nombre_usuario } = req.params;
    const usuario = await usuarioService.obtenerUsuarioPorNombre(nombre_usuario);
    res.json({ ok: true, data: usuario });
  } catch (error) {
    next(error);
  }
};

const crearUsuario = async (req, res, next) => {
  try {
    const data = await usuarioService.crearUsuario(req.body);
    res.status(201).json({
      ok: true,
      mensaje: 'Usuario creado correctamente',
      data
    });
  } catch (error) {
    next(error);
  }
};

const actualizarUsuario = async (req, res, next) => {
  try {
    const { nombre_usuario } = req.params;
    const data = await usuarioService.actualizarUsuario({
      nombre_usuario_actual: nombre_usuario,
      ...req.body
    });
    res.json({
      ok: true,
      mensaje: 'Usuario actualizado correctamente',
      data
    });
  } catch (error) {
    next(error);
  }
};

const eliminarUsuario = async (req, res, next) => {
  try {
    const { nombre_usuario } = req.params;
    const data = await usuarioService.eliminarUsuario(nombre_usuario);
    res.json({
      ok: true,
      mensaje: 'Usuario eliminado correctamente',
      data
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  obtenerUsuarios,
  obtenerActivos,
  obtenerUsuarioPorNombre,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};