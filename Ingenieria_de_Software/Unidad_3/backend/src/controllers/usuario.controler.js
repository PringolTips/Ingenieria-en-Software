const usuarioService = require('../services/usuario.service');

const listarActivos = async (req, res, next) => {
  try {
    const usuarios = await usuarioService.listarActivos();
    res.json({
      ok: true,
      data: usuarios
    });
  } catch (error) {
    next(error);
  }
};

const crearUsuario = async (req, res, next) => {
  try {
    const resultado = await usuarioService.crearUsuario(req.body);
    res.status(201).json({
      ok: true,
      mensaje: 'Usuario creado correctamente',
      data: resultado
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarActivos,
  crearUsuario
};