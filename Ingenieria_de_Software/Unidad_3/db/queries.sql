SET search_path TO digiclin;

--Usuarios activos con rol y estatus
SELECT
    u.id_usuario,
    u.nombre_usuario,
    u.correo,
    r.nombre_rol,
    eu.nombre_estatus
FROM usuario u
JOIN rol r ON u.id_rol = r.id_rol
JOIN estatus_usuario eu ON u.id_estatus_usuario = eu.id_estatus_usuario
WHERE eu.nombre_estatus = 'Activo';


--Buscar usuario por correo
SELECT
    u.id_usuario,
    u.nombre_usuario,
    u.correo,
    r.nombre_rol,
    eu.nombre_estatus
FROM usuario u
JOIN rol r ON u.id_rol = r.id_rol
JOIN estatus_usuario eu ON u.id_estatus_usuario = eu.id_estatus_usuario
WHERE u.correo = 'Jose@digiclin.com';


--Buscar pacientes por nombre o apellido
SELECT
    p.id_paciente,
    p.nombre_p,
    p.apellido_pat,
    p.apellido_mat,
    p.curp,
    p.telefono,
    p.correo
FROM paciente p
WHERE p.nombre_p ILIKE '%Ana%'
   OR p.apellido_pat ILIKE '%López%';


--Expedientes con paciente, médico, diagnóstico y estatus
SELECT
    e.id_expediente,
    p.nombre_p || ' ' || p.apellido_pat AS paciente,
    u.nombre_usuario AS medico,
    d.nombre AS diagnostico,
    ee.nombre_estatus,
    e.fecha_consulta,
    e.motivo
FROM expediente_clinico e
JOIN paciente p ON e.id_paciente = p.id_paciente
JOIN usuario u ON e.id_medico = u.id_usuario
JOIN diagnostico d ON e.id_diagnostico = d.id_diagnostico
JOIN estatus_expediente ee ON e.id_estatus_expediente = ee.id_estatus_expediente
WHERE ee.nombre_estatus = 'Abierto';


--Tratamientos por expediente
SELECT
    t.id_tratamiento,
    e.id_expediente,
    p.nombre_p || ' ' || p.apellido_pat AS paciente,
    tt.nombre AS tipo_tratamiento,
    m.nombre AS medicamento,
    t.indicacion,
    t.dosis,
    t.frecuencia,
    t.duracion
FROM tratamiento t
JOIN expediente_clinico e ON t.id_expediente = e.id_expediente
JOIN paciente p ON e.id_paciente = p.id_paciente
JOIN tipo_tratamiento tt ON t.id_tipo_tratamiento = tt.id_tipo_tratamiento
LEFT JOIN medicamento m ON t.id_medicamento = m.id_medicamento;