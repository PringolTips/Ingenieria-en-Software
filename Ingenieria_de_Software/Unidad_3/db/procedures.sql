--PROCEDURE crear_usuario
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

--PROCEDURE actualizar_usuario
SET search_path TO digiclin;

CREATE OR REPLACE PROCEDURE digiclin.sp_actualizar_usuario(
    p_nombre_usuario_actual VARCHAR,
    p_nuevo_nombre_usuario VARCHAR,
    p_correo VARCHAR,
    p_password_hash VARCHAR,
    p_nombre_rol VARCHAR,
    p_nombre_estatus VARCHAR,
    p_debe_cambiar_password BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_rol INTEGER;
    v_id_estatus INTEGER;
BEGIN
    v_id_rol := NULL;
    v_id_estatus := NULL;

    IF p_nombre_rol IS NOT NULL THEN
        SELECT id_rol INTO v_id_rol
        FROM digiclin.rol
        WHERE nombre_rol = p_nombre_rol;

        IF v_id_rol IS NULL THEN
            RAISE EXCEPTION 'El rol no existe: %', p_nombre_rol;
        END IF;
    END IF;

    IF p_nombre_estatus IS NOT NULL THEN
        SELECT id_estatus_usuario INTO v_id_estatus
        FROM digiclin.estatus_usuario
        WHERE nombre_estatus = p_nombre_estatus;

        IF v_id_estatus IS NULL THEN
            RAISE EXCEPTION 'El estatus no existe: %', p_nombre_estatus;
        END IF;
    END IF;

    UPDATE digiclin.usuario
    SET
        nombre_usuario = COALESCE(p_nuevo_nombre_usuario, nombre_usuario),
        correo = COALESCE(p_correo, correo),
        password_hash = COALESCE(p_password_hash, password_hash),
        id_rol = COALESCE(v_id_rol, id_rol),
        id_estatus_usuario = COALESCE(v_id_estatus, id_estatus_usuario),
        debe_cambiar_password = COALESCE(p_debe_cambiar_password, debe_cambiar_password)
    WHERE nombre_usuario = p_nombre_usuario_actual;
END;
$$;
-- PROCEDURE eliminar usuario
SET search_path TO digiclin;

CREATE OR REPLACE PROCEDURE sp_eliminar_usuario(
    IN p_id_usuario INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM digiclin.usuario
    WHERE nombre_usuario = p_nombre_usuario;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario no encontrado: %', p_nombre_usuario;
    END IF;
END;

-- PROCEDURE  cambiar_password_usuario      
CREATE OR REPLACE PROCEDURE digiclin.sp_cambiar_password_usuario(
    p_nombre_usuario VARCHAR,
    p_password_hash_nuevo VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE digiclin.usuario
    SET password_hash = p_password_hash_nuevo,
        debe_cambiar_password = FALSE
    WHERE nombre_usuario = p_nombre_usuario;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario no encontrado: %', p_nombre_usuario;
    END IF;
END;
$$;