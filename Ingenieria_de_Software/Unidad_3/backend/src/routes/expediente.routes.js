const express = require('express');
const router = express.Router();

const expedienteController = require('../controllers/expediente.controller');
const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/rol.middleware');

router.get(
  '/',
  verificarToken,
  verificarRol('Admin', 'Director', 'Medico', 'Enfermero'),
  expedienteController.obtenerExpedientes
);

router.get(
  '/abiertos',
  verificarToken,
  verificarRol('Admin', 'Director', 'Medico', 'Enfermero'),
  expedienteController.obtenerAbiertos
);

router.get(
  '/archivados',
  verificarToken,
  verificarRol('Admin', 'Director'),
  expedienteController.obtenerArchivados
);

router.get(
  '/paciente/:curp',
  verificarToken,
  verificarRol('Admin', 'Director', 'Medico', 'Enfermero'),
  expedienteController.obtenerPorPaciente
);

router.get(
  '/usuario/:id_usuario',
  verificarToken,
  verificarRol('Admin', 'Director', 'Medico', 'Enfermero'),
  expedienteController.obtenerPorIdUsuarioCreador
);

router.get(
  '/usuario/nombre/:nombre_usuario',
  verificarToken,
  verificarRol('Admin', 'Director', 'Medico', 'Enfermero'),
  expedienteController.obtenerPorNombreUsuarioCreador
);

router.post(
  '/',
  verificarToken,
  verificarRol('Admin', 'Medico'),
  expedienteController.crearExpediente
);

router.put(
  '/:id_expediente/archivar',
  verificarToken,
  verificarRol('Admin', 'Director'),
  expedienteController.archivarExpediente
);

router.put(
  '/:id_expediente',
  verificarToken,
  verificarRol('Admin', 'Medico'),
  expedienteController.actualizarExpediente
);

router.get(
  '/:id_expediente',
  verificarToken,
  verificarRol('Admin', 'Director', 'Medico', 'Enfermero'),
  expedienteController.obtenerPorId
);

module.exports = router;