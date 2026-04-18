--- READ VIEW ACTIVOS ----
SET search_path TO digiclin;

CREATE OR REPLACE VIEW vw_usuarios_activos AS
SELECT
    u.id_usuario,
    u.nombre_usuario,
    u.correo,
    u.password_hash,
    u.debe_cambiar_password,
    u.fecha_creacion,
    u.id_rol,
    r.nombre_rol,
    u.id_estatus_usuario,
    eu.nombre_estatus
FROM usuario u
INNER JOIN rol r
    ON u.id_rol = r.id_rol
INNER JOIN estatus_usuario eu
    ON u.id_estatus_usuario = eu.id_estatus_usuario
WHERE eu.nombre_estatus = 'ACTIVO';

----READ VIEW UNO----
SET search_path TO digiclin;

CREATE OR REPLACE VIEW vw_usuario AS
SELECT
    u.id_usuario,
    u.nombre_usuario,
    u.correo,
    u.password_hash,
    u.debe_cambiar_password,
    u.fecha_creacion,
    u.id_rol,
    r.nombre_rol,
    u.id_estatus_usuario,
    eu.nombre_estatus
FROM usuario u
INNER JOIN rol r
    ON u.id_rol = r.id_rol
INNER JOIN estatus_usuario eu
    ON u.id_estatus_usuario = eu.id_estatus_usuario;


----CREAR PROCEDURE----
SET search_path TO digiclin;

CREATE OR REPLACE PROCEDURE sp_crear_usuario(
    IN p_nombre_usuario VARCHAR(50),
    IN p_correo VARCHAR(100),
    IN p_password_hash VARCHAR(255),
    IN p_nombre_rol VARCHAR(50),
    IN p_nombre_estatus VARCHAR(30),
    IN p_debe_cambiar_password BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_rol INTEGER;
    v_id_estatus INTEGER;
BEGIN
    SELECT id_rol INTO v_id_rol
    FROM rol
    WHERE nombre_rol = p_nombre_rol;

    SELECT id_estatus_usuario INTO v_id_estatus
    FROM estatus_usuario
    WHERE nombre_estatus = p_nombre_estatus;

    INSERT INTO usuario (
        id_rol,
        id_estatus_usuario,
        nombre_usuario,
        correo,
        password_hash,
        debe_cambiar_password
    )
    VALUES (
        v_id_rol,
        v_id_estatus,
        p_nombre_usuario,
        p_correo,
        p_password_hash,
        p_debe_cambiar_password
    );
END;
$$;

----UPDATE PROCEDURE----
SET search_path TO digiclin;

CREATE OR REPLACE PROCEDURE sp_actualizar_usuario(
    IN p_id_usuario INTEGER,
    IN p_nombre_usuario VARCHAR(50),
    IN p_correo VARCHAR(100),
    IN p_password_hash VARCHAR(255),
    IN p_nombre_rol VARCHAR(50),
    IN p_nombre_estatus VARCHAR(30),
    IN p_debe_cambiar_password BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_rol INTEGER;
    v_id_estatus INTEGER;
BEGIN
    SELECT id_rol INTO v_id_rol
    FROM rol
    WHERE nombre_rol = p_nombre_rol;

    SELECT id_estatus_usuario INTO v_id_estatus
    FROM estatus_usuario
    WHERE nombre_estatus = p_nombre_estatus;

    UPDATE usuario
    SET
        id_rol = v_id_rol,
        id_estatus_usuario = v_id_estatus,
        nombre_usuario = p_nombre_usuario,
        correo = p_correo,
        password_hash = p_password_hash,
        debe_cambiar_password = p_debe_cambiar_password
    WHERE id_usuario = p_id_usuario;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
END;
$$;
---- DELETE PROCEDURE---
SET search_path TO digiclin;

CREATE OR REPLACE PROCEDURE sp_eliminar_usuario(
    IN p_id_usuario INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM usuario
    WHERE id_usuario = p_id_usuario;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
END;
$$;
