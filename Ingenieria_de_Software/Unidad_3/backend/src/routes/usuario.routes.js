const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuario.controller');
// const verificarToken = require('../middlewares/auth.middleware');

router.get('/activos', usuarioController.obtenerActivos);
router.get('/', usuarioController.obtenerUsuarios);
router.get('/:nombre_usuario', usuarioController.obtenerUsuarioPorNombre);
router.post('/', usuarioController.crearUsuario);
router.put('/:nombre_usuario', usuarioController.actualizarUsuario);
router.delete('/:nombre_usuario', usuarioController.eliminarUsuario);
//router.get('/', verificarToken, usuarioController.obtenerUsuarios); 

module.exports = router;