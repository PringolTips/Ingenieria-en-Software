const express = require('express');
const router = express.Router();

const expedienteController = require('../controllers/expediente.controller');
const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/rol.middleware');

router.get(
  '/',
  verificarToken,
  verificarRol('Director', 'Medico', 'Enfermero'),
  expedienteController.obtenerExpedientes
);

router.get(
  '/abiertos',
  verificarToken,
  verificarRol('Director', 'Medico', 'Enfermero'),
  expedienteController.obtenerAbiertos
);

router.get(
  '/archivados',
  verificarToken,
  verificarRol('Director', 'Medico', 'Enfermero'),
  expedienteController.obtenerArchivados
);

router.get(
  '/paciente/:curp',
  verificarToken,
  verificarRol('Director', 'Medico', 'Enfermero'),
  expedienteController.obtenerPorPaciente
);

router.get(
  '/usuario/:id_usuario',
  verificarToken,
  verificarRol('Director', 'Medico', 'Enfermero'),
  expedienteController.obtenerPorIdUsuarioCreador
);

router.get(
  '/usuario/nombre/:nombre_usuario',
  verificarToken,
  verificarRol('Director', 'Medico', 'Enfermero'),
  expedienteController.obtenerPorNombreUsuarioCreador
);

router.post(
  '/',
  verificarToken,
  verificarRol('Medico'),
  expedienteController.crearExpediente
);

router.put(
  '/:id_expediente/archivar',
  verificarToken,
  verificarRol('Medico', 'Director'),
  expedienteController.archivarExpediente
);

router.put(
  '/:id_expediente/desarchivar',
  verificarToken,
  verificarRol('Medico', 'Director'),
  expedienteController.desarchivarExpediente
);

router.put(
  '/:id_expediente',
  verificarToken,
  verificarRol('Medico'),
  expedienteController.actualizarExpediente
);

router.get(
  '/:id_expediente',
  verificarToken,
  verificarRol('Director', 'Medico', 'Enfermero'),
  expedienteController.obtenerPorId
);

module.exports = router;