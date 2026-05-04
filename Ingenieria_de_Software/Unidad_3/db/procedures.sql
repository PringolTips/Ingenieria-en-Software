--PROCEDURE  crea usuario activo
CREATE OR REPLACE PROCEDURE digiclin.sp_crear_usuario(
    p_nombre_usuario VARCHAR,
    p_correo VARCHAR,
    p_password_hash VARCHAR,
    p_nombre_rol VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_rol INTEGER;
    v_id_estatus INTEGER;
BEGIN
    SELECT id_rol INTO v_id_rol
    FROM digiclin.rol
    WHERE nombre_rol = p_nombre_rol;

    IF v_id_rol IS NULL THEN
        RAISE EXCEPTION 'El rol no existe';
    END IF;

    SELECT id_estatus_usuario INTO v_id_estatus
    FROM digiclin.estatus_usuario
    WHERE nombre_estatus = 'Activo';

    IF v_id_estatus IS NULL THEN
        RAISE EXCEPTION 'Estatus Activo no existe';
    END IF;

    INSERT INTO digiclin.usuario (
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
        true
    );
END;
$$;


--PROCEDURE cambia contraseña
CREATE OR REPLACE PROCEDURE digiclin.sp_cambiar_password_usuario(
    p_nombre_usuario VARCHAR,
    p_password_hash VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE digiclin.usuario
    SET password_hash = p_password_hash,
        debe_cambiar_password = false
    WHERE nombre_usuario = p_nombre_usuario;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
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


--PROCEDURE inhabiliar usuario
CREATE OR REPLACE PROCEDURE digiclin.sp_inhabilitar_usuario(
    p_nombre_usuario VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_estatus INTEGER;
BEGIN
    SELECT id_estatus_usuario
    INTO v_id_estatus
    FROM digiclin.estatus_usuario
    WHERE LOWER(nombre_estatus) = LOWER('Inactivo');

    IF v_id_estatus IS NULL THEN
        RAISE EXCEPTION 'Estatus Inactivo no existe';
    END IF;

    UPDATE digiclin.usuario
    SET id_estatus_usuario = v_id_estatus
    WHERE nombre_usuario = p_nombre_usuario;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
END;
$$;

--PROCEDURE habilitar usuario
CREATE OR REPLACE PROCEDURE digiclin.sp_habilitar_usuario(
    p_nombre_usuario VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_estatus INTEGER;
BEGIN
    SELECT id_estatus_usuario
    INTO v_id_estatus
    FROM digiclin.estatus_usuario
    WHERE LOWER(nombre_estatus) = LOWER('Activo');

    IF v_id_estatus IS NULL THEN
        RAISE EXCEPTION 'Estatus Activo no existe';
    END IF;

    UPDATE digiclin.usuario
    SET id_estatus_usuario = v_id_estatus
    WHERE nombre_usuario = p_nombre_usuario;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
END;
$$;

--PROCEDURE actualizar mi perfil
CREATE OR REPLACE PROCEDURE digiclin.sp_actualizar_mi_perfil(
    p_nombre_usuario_actual VARCHAR,
    p_nuevo_nombre_usuario VARCHAR,
    p_correo VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE digiclin.usuario
    SET
        nombre_usuario = COALESCE(p_nuevo_nombre_usuario, nombre_usuario),
        correo = COALESCE(p_correo, correo)
    WHERE nombre_usuario = p_nombre_usuario_actual;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
END;
$$;
