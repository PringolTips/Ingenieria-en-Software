const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuario.controller');
const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/rol.middleware');

router.get('/activos', verificarToken, usuarioController.obtenerActivos);

router.get('/correo/:correo', verificarToken, usuarioController.obtenerUsuarioPorCorreo);

router.get('/', verificarToken, usuarioController.obtenerUsuarios);


router.put(
  '/perfil/actualizar',
  verificarToken,
  usuarioController.actualizarMiPerfil
);

router.put(
  '/:nombre_usuario/inhabilitar',
  verificarToken,
  verificarRol('Admin'),
  usuarioController.inhabilitarUsuario
);

router.put(
  '/:nombre_usuario/habilitar',
  verificarToken,
  verificarRol('Admin'),
  usuarioController.habilitarUsuario
);

router.get('/:nombre_usuario', verificarToken, usuarioController.obtenerUsuarioPorNombre);

router.post(
  '/',
  verificarToken,
  verificarRol('Admin'),
  usuarioController.crearUsuario
);

router.put(
  '/:nombre_usuario',
  verificarToken,
  verificarRol('Admin'),
  usuarioController.actualizarUsuario
);


router.delete(
  '/:nombre_usuario',
  verificarToken,
  verificarRol('Admin'),
  usuarioController.eliminarUsuario
);

module.exports = router;