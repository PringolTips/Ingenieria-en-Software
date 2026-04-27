const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuario.controller');
const verificarToken = require('../middlewares/auth.middleware');



router.get('/activos', verificarToken, usuarioController.obtenerActivos);
router.get('/correo/:correo', usuarioController.obtenerUsuarioPorCorreo);
router.get('/', verificarToken, usuarioController.obtenerUsuarios);
router.get('/:nombre_usuario', verificarToken, usuarioController.obtenerUsuarioPorNombre);
router.post('/', usuarioController.crearUsuario);
router.put('/:nombre_usuario', usuarioController.actualizarUsuario);
router.delete('/:nombre_usuario', verificarToken, usuarioController.eliminarUsuario);

//router.get('/', verificarToken, usuarioController.obtenerUsuarios); 

module.exports = router;