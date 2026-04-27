const authService = require('../services/auth.service');

const login = async (req, res, next) => {
  try {
    const { correo, password } = req.body;

    const data = await authService.login({ correo, password });

    res.json({
      ok: true,
      mensaje: 'Login correcto',
      data
    });
  } catch (error) {
    next(error);
  }
};

const perfil = async (req, res, next) => {
  try {
    const nombre_usuario = req.usuario.nombre_usuario;

    const data = await authService.verificarPerfil(nombre_usuario);

    res.json({
      ok: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

const cambiarPassword = async (req, res, next) => {
  try {
    const { correo } = req.body;

    const resultado = await authService.cambiarPassword(
      correo,
      req.body
    );

    res.json({
      ok: true,
      mensaje: 'Contraseña actualizada correctamente',
      data: resultado
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  perfil,
  cambiarPassword
};