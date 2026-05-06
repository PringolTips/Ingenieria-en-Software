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
