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

const obtenerUsuarioPorCorreo = async (req, res, next) => {
  try {
    const { correo } = req.params;

    const usuario = await usuarioService.obtenerUsuarioPorCorreo(correo);

    res.json({
      ok: true,
      data: usuario
    });
  } catch (error) {
    next(error);
  }
};

const inhabilitarUsuario = async (req, res, next) => {
  try {
    const { nombre_usuario } = req.params;

    const data = await usuarioService.inhabilitarUsuario(nombre_usuario);

    res.json({
      ok: true,
      mensaje: 'Usuario inhabilitado correctamente',
      data
    });
  } catch (error) {
    next(error);
  }
};

const habilitarUsuario = async (req, res, next) => {
  try {
    const { nombre_usuario } = req.params;

    const data = await usuarioService.habilitarUsuario(nombre_usuario);

    res.json({
      ok: true,
      mensaje: 'Usuario habilitado correctamente',
      data
    });
  } catch (error) {
    next(error);
  }
};

const actualizarMiPerfil = async (req, res, next) => {
  try {
    const nombre_usuario_actual = req.usuario.nombre_usuario;

    const data = await usuarioService.actualizarMiPerfil({
      nombre_usuario_actual,
      ...req.body
    });

    res.json({
      ok: true,
      mensaje: 'Perfil actualizado correctamente',
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
  eliminarUsuario,
  obtenerUsuarioPorCorreo,
  inhabilitarUsuario,
  habilitarUsuario,
  actualizarMiPerfil
};