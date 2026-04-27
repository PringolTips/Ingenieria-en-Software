SET search_path TO digiclin;

-- Insert tablas catalogo

INSERT INTO rol (nombre_rol, descripcion) 
VALUES
('Admin', 'Administrador del sistema'),
('Medico', 'Usuario médico'),
('Enfermero', 'Usuario enfermero'),
('Director', 'Director de la clínica'),
('Administrativo', 'Personal administrativo')
ON CONFLICT (nombre_rol) DO NOTHING;

INSERT INTO estatus_usuario (nombre_estatus, descripcion)
VALUES
('Activo', 'Usuario activo'),
('Inactivo', 'Usuario inactivo'),
('Bloqueado', 'Usuario bloqueado')
ON CONFLICT (nombre_estatus) DO NOTHING;

INSERT INTO estatus_expediente (nombre_estatus, descripcion) 
VALUES
('Abierto', 'Expediente abierto'),
('Cerrado', 'Expediente cerrado'),
('Archivado', 'Expediente archivado')
ON CONFLICT (nombre_estatus) DO NOTHING;

INSERT INTO especialidad (nombre, descripcion) 
VALUES
('Medicina General', 'Atención médica general'),
('Pediatría', 'Atención médica infantil'),
('Cardiología', 'Atención cardiovascular')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO sexo (nombre) 
VALUES
('Masculino'),
('Femenino'),
('Otro')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO tipo_sangre (tipo) 
VALUES
('A+'), ('O+'), ('B+')
ON CONFLICT (tipo) DO NOTHING;

INSERT INTO estado_civil (nombre) VALUES
('Soltero'),
('Casado'),
('Divorciado')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO alergia (nombre, descripcion) VALUES
('Penicilina', 'Alergia a penicilina'),
('Polen', 'Alergia ambiental'),
('Lactosa', 'Intolerancia a lactosa')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO enfermedad_cronica (nombre, descripcion) 
VALUES
('Diabetes', 'Enfermedad metabólica'),
('Hipertensión', 'Presión arterial elevada'),
('Asma', 'Enfermedad respiratoria')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO certificacion (nombre, descripcion) 
VALUES
('RCP Básico', 'Reanimación cardiopulmonar'),
('Primeros Auxilios', 'Atención inicial'),
('Soporte Vital Básico', 'Capacitación BLS')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO medicamento (nombre, presentacion, descripcion) 
VALUES
('Paracetamol', 'Tabletas 500 mg', 'Analgésico'),
('Ibuprofeno', 'Tabletas 400 mg', 'Antiinflamatorio'),
('Amoxicilina', 'Cápsulas 500 mg', 'Antibiótico')
ON CONFLICT  DO NOTHING;

INSERT INTO tipo_tratamiento (nombre, descripcion) 
VALUES
('Farmacológico', 'Tratamiento con medicamentos'),
('No farmacológico', 'Tratamiento sin medicamentos'),
('Terapia', 'Tratamiento terapéutico')
ON CONFLICT (nombre) DO NOTHING;



-- USUARIOS EXISTENTES DE PRUEBA


INSERT INTO usuario (
    id_rol,
    id_estatus_usuario,
    nombre_usuario,
    correo,
    password_hash,
    debe_cambiar_password,
    fecha_creacion
)
VALUES
(
    (SELECT id_rol FROM rol WHERE nombre_rol = 'Admin'),
    (SELECT id_estatus_usuario FROM estatus_usuario WHERE nombre_estatus = 'Activo'),
    'Luis',
    'admin1@digiclin.com',
    '$2b$10$e5ELFFIlYC4XpzbypVJdr.K/5p0YZzD8ALQiEwDZv0Nho3QKfLnWq',
    false,
    '2026-04-19 00:50:17.54241'
),
(
    (SELECT id_rol FROM rol WHERE nombre_rol = 'Enfermero'),
    (SELECT id_estatus_usuario FROM estatus_usuario WHERE nombre_estatus = 'Inactivo'),
    'Karla',
    'Karlonga22@digiclin.com',
    '$2b$10$9de5ixEzYjGOVQQwAj7FnOB6u2IYuJ/0wOu4I/LkqOwzx1gCZIOd.',
    true,
    '2026-04-19 02:19:40.681686'
),
(
    (SELECT id_rol FROM rol WHERE nombre_rol = 'Enfermero'),
    (SELECT id_estatus_usuario FROM estatus_usuario WHERE nombre_estatus = 'Activo'),
    'Sol',
    'Sol@digiclin.com',
    '$2b$10$2qtWr.Vg54CMCVFJzIDMN.bcj.7Y5aNnl925BEFo5Q.R1yPHxIYCG',
    false,
    '2026-04-19 07:42:09.159406'
),
(
    (SELECT id_rol FROM rol WHERE nombre_rol = 'Medico'),
    (SELECT id_estatus_usuario FROM estatus_usuario WHERE nombre_estatus = 'Activo'),
    'Jose',
    'Jose@digiclin.com',
    '$2b$10$tQoF5tuTLdbxcfy6mQMsQOY05b20/cwQWyZKncJa9g7SAfsat9DRK',
    true,
    '2026-04-19 21:28:13.408489'
),
(
    (SELECT id_rol FROM rol WHERE nombre_rol = 'Medico'),
    (SELECT id_estatus_usuario FROM estatus_usuario WHERE nombre_estatus = 'Activo'),
    'Pringol',
    'Pringol@digiclin.com',
    '$2b$10$4O3DzZsB8TElKT8Z3DbaDergrhjffipdPKoTiEq3fmCQAcGEpmdrK',
    true,
    '2026-04-25 00:31:37.388213'
)
ON CONFLICT (correo) DO NOTHING;





-- PERSONAL MÉDICO


INSERT INTO personal_medico (id_personal_medico, cedula)
VALUES
(
    (SELECT id_usuario FROM usuario WHERE nombre_usuario = 'Jose'),
    'MED-0001'
),
(
    (SELECT id_usuario FROM usuario WHERE nombre_usuario = 'Pringol'),
    'MED-0002'
),
(
    (SELECT id_usuario FROM usuario WHERE nombre_usuario = 'Sol'),
    'ENF-0001'
)
ON CONFLICT (cedula) DO NOTHING;


INSERT INTO medico (id_medico, id_especialidad)
VALUES
(
    (SELECT id_usuario FROM usuario WHERE nombre_usuario = 'Jose'),
    (SELECT id_especialidad FROM especialidad WHERE nombre = 'Medicina General')
),
(
    (SELECT id_usuario FROM usuario WHERE nombre_usuario = 'Pringol'),
    (SELECT id_especialidad FROM especialidad WHERE nombre = 'Cardiología')
)
ON CONFLICT (id_medico) DO NOTHING;

INSERT INTO enfermero (id_enfermero)
VALUES
(
    (SELECT id_usuario FROM usuario WHERE nombre_usuario = 'Sol')
)
ON CONFLICT (id_enfermero) DO NOTHING;

INSERT INTO enfermero_certificacion (id_enfermero, id_certificacion)
VALUES
(
    (SELECT id_usuario FROM usuario WHERE nombre_usuario = 'Sol'),
    (SELECT id_certificacion FROM certificacion WHERE nombre = 'RCP Básico')
),
(
    (SELECT id_usuario FROM usuario WHERE nombre_usuario = 'Sol'),
    (SELECT id_certificacion FROM certificacion WHERE nombre = 'Primeros Auxilios')
),
(
    (SELECT id_usuario FROM usuario WHERE nombre_usuario = 'Sol'),
    (SELECT id_certificacion FROM certificacion WHERE nombre = 'Soporte Vital Básico')
)
ON CONFLICT (id_enfermero, id_certificacion) DO NOTHING;



-- PACIENTES


INSERT INTO paciente (
    nombre_p,
    apellido_pat,
    apellido_mat,
    fecha_nacimiento,
    id_sexo,
    curp,
    domicilio,
    id_estado_civil,
    correo,
    ocupacion,
    telefono,
    contacto_emergencia,
    id_tipo_sangre
)
VALUES
(
    'Ana',
    'López',
    'Ramírez',
    '1998-04-12',
    (SELECT id_sexo FROM sexo WHERE nombre = 'Femenino'),
    'LORA980412MDFPNA01',
    'Querétaro Centro',
    (SELECT id_estado_civil FROM estado_civil WHERE nombre = 'Soltero'),
    'ana.lopez@correo.com',
    'Estudiante',
    '4421111111',
    'María Ramírez',
    (SELECT id_tipo_sangre FROM tipo_sangre WHERE tipo = 'A+')
),
(
    'Carlos',
    'Hernández',
    'Pérez',
    '1985-09-20',
    (SELECT id_sexo FROM sexo WHERE nombre = 'Masculino'),
    'HEPC850920HDFRRL02',
    'El Marqués, Querétaro',
    (SELECT id_estado_civil FROM estado_civil WHERE nombre = 'Casado'),
    'carlos.hernandez@correo.com',
    'Ingeniero',
    '4422222222',
    'Laura Pérez',
    (SELECT id_tipo_sangre FROM tipo_sangre WHERE tipo = 'O+')
),
(
    'Sofía',
    'Martínez',
    'Gómez',
    '2001-01-15',
    (SELECT id_sexo FROM sexo WHERE nombre = 'Femenino'),
    'MAGS010115MDFRRF03',
    'Juriquilla, Querétaro',
    (SELECT id_estado_civil FROM estado_civil WHERE nombre = 'Soltero'),
    'sofia.martinez@correo.com',
    'Diseñadora',
    '4423333333',
    'Pedro Gómez',
    (SELECT id_tipo_sangre FROM tipo_sangre WHERE tipo = 'B+')
)
ON CONFLICT (curp) DO NOTHING;



-- PACIENTE - ALERGIAS


INSERT INTO paciente_alergia (id_paciente, id_alergia, observaciones)
VALUES
(
    (SELECT id_paciente FROM paciente WHERE curp = 'LORA980412MDFPNA01'),
    (SELECT id_alergia FROM alergia WHERE nombre = 'Penicilina'),
    'Reacción leve en piel'
),
(
    (SELECT id_paciente FROM paciente WHERE curp = 'HEPC850920HDFRRL02'),
    (SELECT id_alergia FROM alergia WHERE nombre = 'Polen'),
    'Alergia estacional'
),
(
    (SELECT id_paciente FROM paciente WHERE curp = 'MAGS010115MDFRRF03'),
    (SELECT id_alergia FROM alergia WHERE nombre = 'Lactosa'),
    'Evitar lácteos'
)
ON CONFLICT (id_paciente, id_alergia) DO NOTHING;




-- PACIENTE - ENFERMEDADES CRÓNICAS


INSERT INTO paciente_enfermedad (id_paciente, id_enfermedad, observaciones)
VALUES
(
    (SELECT id_paciente FROM paciente WHERE curp = 'LORA980412MDFPNA01'),
    (SELECT id_enfermedad FROM enfermedad_cronica WHERE nombre = 'Asma'),
    'Controlado con inhalador'
),
(
    (SELECT id_paciente FROM paciente WHERE curp = 'HEPC850920HDFRRL02'),
    (SELECT id_enfermedad FROM enfermedad_cronica WHERE nombre = 'Hipertensión'),
    'Seguimiento mensual'
),
(
    (SELECT id_paciente FROM paciente WHERE curp = 'MAGS010115MDFRRF03'),
    (SELECT id_enfermedad FROM enfermedad_cronica WHERE nombre = 'Diabetes'),
    'Control con dieta'
)
ON CONFLICT (id_paciente, id_enfermedad) DO NOTHING;




-- DIAGNÓSTICOS

INSERT INTO diagnostico (codigo_cie, nombre, descripcion)
VALUES
('J00', 'Resfriado común', 'Infección viral leve de vías respiratorias superiores'),
('I10', 'Hipertensión esencial', 'Presión arterial elevada de forma persistente'),
('E11', 'Diabetes tipo 2', 'Diabetes mellitus no insulinodependiente')
ON CONFLICT (codigo_cie) DO NOTHING;



-- EXPEDIENTES CLÍNICOS


INSERT INTO expediente_clinico (
    id_paciente,
    id_medico,
    id_diagnostico,
    id_estatus_expediente,
    fecha_consulta,
    motivo,
    antecedentes_personales,
    antecedentes_familiares,
    presion_arterial,
    frecuencia_cardiaca,
    frecuencia_respiratoria,
    temperatura,
    saturacion_oxigeno,
    peso,
    talla_cintura,
    altura,
    observaciones
)
VALUES
(
    (SELECT id_paciente FROM paciente WHERE curp = 'LORA980412MDFPNA01'),
    (SELECT id_usuario FROM usuario WHERE nombre_usuario = 'Jose'),
    (SELECT id_diagnostico FROM diagnostico WHERE codigo_cie = 'J00'),
    (SELECT id_estatus_expediente FROM estatus_expediente WHERE nombre_estatus = 'Abierto'),
    CURRENT_TIMESTAMP,
    'Dolor de garganta, congestión nasal y fiebre leve',
    'Asma controlada',
    'Madre con alergias respiratorias',
    '120/80',
    75,
    18,
    36.8,
    98,
    60.5,
    72.0,
    1.65,
    'Paciente estable'
),
(
    (SELECT id_paciente FROM paciente WHERE curp = 'HEPC850920HDFRRL02'),
    (SELECT id_usuario FROM usuario WHERE nombre_usuario = 'Pringol'),
    (SELECT id_diagnostico FROM diagnostico WHERE codigo_cie = 'I10'),
    (SELECT id_estatus_expediente FROM estatus_expediente WHERE nombre_estatus = 'Abierto'),
    CURRENT_TIMESTAMP,
    'Revisión por presión arterial elevada',
    'Hipertensión diagnosticada previamente',
    'Padre con hipertensión',
    '140/90',
    82,
    19,
    36.5,
    97,
    82.0,
    90.0,
    1.75,
    'Requiere seguimiento'
),
(
    (SELECT id_paciente FROM paciente WHERE curp = 'MAGS010115MDFRRF03'),
    (SELECT id_usuario FROM usuario WHERE nombre_usuario = 'Jose'),
    (SELECT id_diagnostico FROM diagnostico WHERE codigo_cie = 'E11'),
    (SELECT id_estatus_expediente FROM estatus_expediente WHERE nombre_estatus = 'Cerrado'),
    CURRENT_TIMESTAMP,
    'Control metabólico y revisión general',
    'Diabetes tipo 2 en control',
    'Abuela materna con diabetes',
    '118/78',
    70,
    17,
    36.7,
    99,
    58.0,
    68.0,
    1.60,
    'Control adecuado'
);




-- TRATAMIENTOS

INSERT INTO tratamiento (
    id_expediente,
    id_tipo_tratamiento,
    id_medicamento,
    indicacion,
    dosis,
    frecuencia,
    duracion,
    observaciones
)
VALUES
(
    (
        SELECT id_expediente
        FROM expediente_clinico
        WHERE id_paciente = (SELECT id_paciente FROM paciente WHERE curp = 'LORA980412MDFPNA01')
        LIMIT 1
    ),
    (SELECT id_tipo_tratamiento FROM tipo_tratamiento WHERE nombre = 'Farmacológico'),
    (SELECT id_medicamento FROM medicamento WHERE nombre = 'Paracetamol'),
    'Tomar en caso de fiebre o dolor',
    '500 mg',
    'Cada 8 horas',
    '3 días',
    'No exceder dosis indicada'
),
(
    (
        SELECT id_expediente
        FROM expediente_clinico
        WHERE id_paciente = (SELECT id_paciente FROM paciente WHERE curp = 'HEPC850920HDFRRL02')
        LIMIT 1
    ),
    (SELECT id_tipo_tratamiento FROM tipo_tratamiento WHERE nombre = 'No farmacológico'),
    NULL,
    'Reducir consumo de sal y realizar actividad física',
    NULL,
    'Diario',
    '30 días',
    'Controlar presión arterial'
),
(
    (
        SELECT id_expediente
        FROM expediente_clinico
        WHERE id_paciente = (SELECT id_paciente FROM paciente WHERE curp = 'MAGS010115MDFRRF03')
        LIMIT 1
    ),
    (SELECT id_tipo_tratamiento FROM tipo_tratamiento WHERE nombre = 'Terapia'),
    NULL,
    'Plan alimenticio y seguimiento nutricional',
    NULL,
    'Semanal',
    '2 meses',
    'Revisar niveles de glucosa'
);


-- VALIDACIONES


SELECT COUNT(*) AS total_roles FROM rol;
SELECT COUNT(*) AS total_estatus_usuario FROM estatus_usuario;
SELECT COUNT(*) AS total_estatus_expediente FROM estatus_expediente;
SELECT COUNT(*) AS total_especialidades FROM especialidad;
SELECT COUNT(*) AS total_sexo FROM sexo;
SELECT COUNT(*) AS total_tipo_sangre FROM tipo_sangre;
SELECT COUNT(*) AS total_estado_civil FROM estado_civil;
SELECT COUNT(*) AS total_alergias FROM alergia;
SELECT COUNT(*) AS total_enfermedades FROM enfermedad_cronica;
SELECT COUNT(*) AS total_certificaciones FROM certificacion;
SELECT COUNT(*) AS total_medicamentos FROM medicamento;
SELECT COUNT(*) AS total_tipo_tratamiento FROM tipo_tratamiento;
SELECT COUNT(*) AS total_usuarios FROM usuario;
SELECT COUNT(*) AS total_personal_medico FROM personal_medico;
SELECT COUNT(*) AS total_medicos FROM medico;
SELECT COUNT(*) AS total_enfermeros FROM enfermero;
SELECT COUNT(*) AS total_pacientes FROM paciente;
SELECT COUNT(*) AS total_paciente_alergia FROM paciente_alergia;
SELECT COUNT(*) AS total_paciente_enfermedad FROM paciente_enfermedad;
SELECT COUNT(*) AS total_diagnosticos FROM diagnostico;
SELECT COUNT(*) AS total_expedientes FROM expediente_clinico;
SELECT COUNT(*) AS total_tratamientos FROM tratamiento;