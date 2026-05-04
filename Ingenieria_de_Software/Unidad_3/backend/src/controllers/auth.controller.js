const authService = require('../services/auth.service');

const login = async (req, res, next) => {
  try {
    const { identificador, correo, password } = req.body;

    const data = await authService.login({
      identificador: identificador || correo,
      password
    });

    res.json({
      ok: true,
      mensaje: data.usuario.debe_cambiar_password
        ? 'Debe cambiar su contraseña'
        : 'Login correcto',
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
    const resultado = await authService.cambiarPassword(req.body);

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