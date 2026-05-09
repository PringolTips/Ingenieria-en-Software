const express = require('express');
const router = express.Router();

const pacienteController = require('../controllers/paciente.controller');
const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/rol.middleware');

router.get(
  '/',
  verificarToken,
  verificarRol('Medico', 'Enfermero', 'Administrativo', 'Director', 'Admin'),
  pacienteController.obtenerPacientes
);

router.get(
  '/activos',
  verificarToken,
  verificarRol('Medico', 'Enfermero', 'Administrativo', 'Director', 'Admin'),
  pacienteController.obtenerPacientesActivos
);

router.get(
  '/inactivos',
  verificarToken,
  verificarRol('Director', 'Administrativo', 'Admin'),
  pacienteController.obtenerPacientesInactivos
);

router.get(
  '/buscar/nombre',
  verificarToken,
  verificarRol('Medico', 'Enfermero', 'Administrativo', 'Director', 'Admin'),
  pacienteController.obtenerPacientesPorNombre
);

router.post(
  '/',
  verificarToken,
  verificarRol('Medico', 'Enfermero','Admin'),
  pacienteController.crearPaciente
);

router.put(
  '/:curp/inhabilitar',
  verificarToken,
  verificarRol('Director', 'Administrativo', 'Admin'),
  pacienteController.inhabilitarPaciente
);

router.put(
  '/:curp/habilitar',
  verificarToken,
  verificarRol('Admin', 'Director', 'Administrativo'),
  pacienteController.habilitarPaciente
);

router.get(
  '/:curp',
  verificarToken,
  verificarRol('Medico', 'Enfermero', 'Administrativo', 'Director', 'Admin'),
  pacienteController.obtenerPacientePorCurp
);

module.exports = router;