const express = require('express');
const router = express.Router();

const bitacoraController = require('../controllers/bitacora.controller');
const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/rol.middleware');

router.get(
  '/pacientes',
  verificarToken,
  verificarRol('Admin'),
  bitacoraController.obtenerBitacoraPacientes
);

router.get(
  '/expedientes',
  verificarToken,
  verificarRol('Admin'),
  bitacoraController.obtenerBitacoraExpedientes
);

module.exports = router;