const express = require('express');
const router = express.Router();

const pacienteController = require('../controllers/paciente.controller');
const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/rol.middleware');

router.get(
  '/',
  verificarToken,
  verificarRol('Medico', 'Enfermero', 'Administrativo', 'Director'),
  pacienteController.obtenerPacientes
);

router.get(
  '/activos',
  verificarToken,
  verificarRol('Medico', 'Enfermero', 'Administrativo', 'Director'),
  pacienteController.obtenerPacientesActivos
);

router.get(
  '/inactivos',
  verificarToken,
  verificarRol('Medico','Director', 'Administrativo'),
  pacienteController.obtenerPacientesInactivos
);

router.get(
  '/buscar/nombre',
  verificarToken,
  verificarRol('Medico', 'Enfermero', 'Administrativo', 'Director'),
  pacienteController.obtenerPacientesPorNombre
);

router.post(
  '/',
  verificarToken,
  verificarRol('Medico', 'Enfermero','Director'),
  pacienteController.crearPaciente
);

router.put(
  '/:curp/inhabilitar',
  verificarToken,
  verificarRol('Medico','Director', 'Administrativo'),
  pacienteController.inhabilitarPaciente
);

router.put(
  '/:curp/habilitar',
  verificarToken,
  verificarRol('Medico','Director', 'Administrativo'),
  pacienteController.habilitarPaciente
);


router.put(
  '/:curp/corregir-curp',
  verificarToken,
  verificarRol('Medico','Director', 'Administrativo'),
  pacienteController.corregirCurpPaciente
);


router.put(
  '/:curp',
  verificarToken,
  verificarRol('Medico','Director', 'Administrativo'),
  pacienteController.actualizarPaciente
);

router.get(
  '/:curp',
  verificarToken,
  verificarRol('Medico', 'Enfermero', 'Administrativo', 'Director', 'Admin'),
  pacienteController.obtenerPacientePorCurp
);

module.exports = router;