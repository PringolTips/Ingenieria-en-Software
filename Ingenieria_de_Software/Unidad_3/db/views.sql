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

