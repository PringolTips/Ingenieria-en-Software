--  VIEW usuarios_activos 
SET search_path TO digiclin;
CREATE OR REPLACE VIEW digiclin.vw_usuarios_activos AS
SELECT
    u.nombre_usuario,
    u.correo,
    u.debe_cambiar_password,
    u.fecha_creacion,
    r.nombre_rol,
    eu.nombre_estatus
FROM digiclin.usuario u
JOIN digiclin.rol r
    ON u.id_rol = r.id_rol
JOIN digiclin.estatus_usuario eu
    ON u.id_estatus_usuario = eu.id_estatus_usuario
WHERE eu.nombre_estatus = 'Activo';

--VIEW usuario
SET search_path TO digiclin;
CREATE OR REPLACE VIEW digiclin.vw_usuario AS
SELECT
    u.nombre_usuario,
    u.correo,
    u.debe_cambiar_password,
    u.fecha_creacion,
    r.nombre_rol,
    eu.nombre_estatus
FROM digiclin.usuario u
JOIN digiclin.rol r
    ON u.id_rol = r.id_rol
JOIN digiclin.estatus_usuario eu
    ON u.id_estatus_usuario = eu.id_estatus_usuario;

--VIEW vw_usuario_login

CREATE OR REPLACE VIEW digiclin.vw_usuario_login AS
SELECT
    u.nombre_usuario,
    u.correo,
    u.password_hash,
    u.debe_cambiar_password,
    r.nombre_rol,
    eu.nombre_estatus
FROM digiclin.usuario u
JOIN digiclin.rol r
    ON u.id_rol = r.id_rol
JOIN digiclin.estatus_usuario eu
    ON u.id_estatus_usuario = eu.id_estatus_usuario;


--VIEW usuario_delete
CREATE VIEW digiclin.vw_usuario_delete AS
SELECT
    u.nombre_usuario,
    u.correo,
    r.nombre_rol
FROM digiclin.usuario u
JOIN digiclin.rol r
    ON u.id_rol = r.id_rol;


--VIEW pacientes_detalle

CREATE OR REPLACE VIEW vw_pacientes_detalle AS
SELECT
    p.id_paciente,
    p.nombre_p,
    p.apellido_pat,
    p.apellido_mat,
    p.curp,
    p.telefono,
    p.correo,
    s.nombre AS sexo,
    ec.nombre AS estado_civil,
    ts.tipo AS tipo_sangre,
    p.fecha_registro
FROM paciente p
JOIN sexo s ON p.id_sexo = s.id_sexo
LEFT JOIN estado_civil ec ON p.id_estado_civil = ec.id_estado_civil
LEFT JOIN tipo_sangre ts ON p.id_tipo_sangre = ts.id_tipo_sangre;

--VIEW expedientes_detalle

CREATE OR REPLACE VIEW vw_expedientes_detalle AS
SELECT
    e.id_expediente,
    p.id_paciente,
    p.nombre_p || ' ' || p.apellido_pat || ' ' || COALESCE(p.apellido_mat, '') AS paciente,
    u.nombre_usuario AS medico,
    d.codigo_cie,
    d.nombre AS diagnostico,
    ee.nombre_estatus,
    e.fecha_consulta,
    e.motivo,
    e.observaciones
FROM expediente_clinico e
JOIN paciente p ON e.id_paciente = p.id_paciente
JOIN usuario u ON e.id_medico = u.id_usuario
JOIN diagnostico d ON e.id_diagnostico = d.id_diagnostico
JOIN estatus_expediente ee ON e.id_estatus_expediente = ee.id_estatus_expediente;

--VIEW paciente
CREATE OR REPLACE VIEW digiclin.vw_paciente AS
SELECT
    p.id_paciente,
    p.nombre_p,
    p.apellido_pat,
    p.apellido_mat,
    CONCAT_WS(' ', p.nombre_p, p.apellido_pat, p.apellido_mat) AS nombre_completo,
    p.fecha_nacimiento,
    p.curp,
    p.domicilio,
    p.correo,
    p.ocupacion,
    p.telefono,
    p.contacto_emergencia,
    p.fecha_registro,

    s.id_sexo,
    s.nombre AS nombre_sexo,

    ec.id_estado_civil,
    ec.nombre AS nombre_estado_civil,

    ts.id_tipo_sangre,
    ts.tipo AS nombre_tipo_sangre,

    ep.id_estatus_paciente,
    ep.nombre_estatus

FROM digiclin.paciente p
INNER JOIN digiclin.sexo s
    ON p.id_sexo = s.id_sexo
LEFT JOIN digiclin.estado_civil ec
    ON p.id_estado_civil = ec.id_estado_civil
LEFT JOIN digiclin.tipo_sangre ts
    ON p.id_tipo_sangre = ts.id_tipo_sangre
INNER JOIN digiclin.estatus_paciente ep
    ON p.id_estatus_paciente = ep.id_estatus_paciente;

--VIEW paciente(medico/director)
CREATE OR REPLACE VIEW digiclin.vw_paciente_completo AS
SELECT
    p.id_paciente,
    p.nombre_p,
    p.apellido_pat,
    p.apellido_mat,
    CONCAT_WS(' ', p.nombre_p, p.apellido_pat, p.apellido_mat) AS nombre_completo,

    p.fecha_nacimiento,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.fecha_nacimiento))::INTEGER AS edad,

    s.id_sexo,
    s.nombre AS nombre_sexo,

    p.curp,
    p.domicilio,

    ec.id_estado_civil,
    ec.nombre AS nombre_estado_civil,

    p.correo,
    p.ocupacion,
    p.telefono,
    p.contacto_emergencia,

    ts.id_tipo_sangre,
    ts.tipo AS nombre_tipo_sangre,

    ep.id_estatus_paciente,
    ep.nombre_estatus,

    p.fecha_registro
FROM digiclin.paciente p
INNER JOIN digiclin.sexo s
    ON p.id_sexo = s.id_sexo
LEFT JOIN digiclin.estado_civil ec
    ON p.id_estado_civil = ec.id_estado_civil
LEFT JOIN digiclin.tipo_sangre ts
    ON p.id_tipo_sangre = ts.id_tipo_sangre
INNER JOIN digiclin.estatus_paciente ep
    ON p.id_estatus_paciente = ep.id_estatus_paciente;

--VIEW paciente (enfermero)
CREATE OR REPLACE VIEW digiclin.vw_paciente_enfermero AS
SELECT
    p.id_paciente,
    p.nombre_p,
    p.apellido_pat,
    p.apellido_mat,
    CONCAT_WS(' ', p.nombre_p, p.apellido_pat, p.apellido_mat) AS nombre_completo,

    p.fecha_nacimiento,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.fecha_nacimiento))::INTEGER AS edad,

    s.id_sexo,
    s.nombre AS nombre_sexo,

    p.curp,
    p.telefono,
    p.contacto_emergencia,

    ts.id_tipo_sangre,
    ts.tipo AS nombre_tipo_sangre,

    ep.id_estatus_paciente,
    ep.nombre_estatus
FROM digiclin.paciente p
INNER JOIN digiclin.sexo s
    ON p.id_sexo = s.id_sexo
LEFT JOIN digiclin.tipo_sangre ts
    ON p.id_tipo_sangre = ts.id_tipo_sangre
INNER JOIN digiclin.estatus_paciente ep
    ON p.id_estatus_paciente = ep.id_estatus_paciente;

--VIEW paciente (administrativo)
CREATE OR REPLACE VIEW digiclin.vw_paciente_administrativo AS
SELECT
    p.id_paciente,
    p.nombre_p,
    p.apellido_pat,
    p.apellido_mat,
    CONCAT_WS(' ', p.nombre_p, p.apellido_pat, p.apellido_mat) AS nombre_completo,

    p.curp,
    p.fecha_nacimiento,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.fecha_nacimiento))::INTEGER AS edad,

    p.telefono,
    p.correo,

    ep.id_estatus_paciente,
    ep.nombre_estatus,

    p.fecha_registro
FROM digiclin.paciente p
INNER JOIN digiclin.estatus_paciente ep
    ON p.id_estatus_paciente = ep.id_estatus_paciente;