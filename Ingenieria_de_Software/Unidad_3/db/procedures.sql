--PROCEDURE  crear usuario activo
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


--PROCEDURE usuario cambia contraseña
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

-- PROCEDURE admin resetea contraseña
CREATE OR REPLACE PROCEDURE digiclin.sp_resetear_password_usuario(
    p_nombre_usuario VARCHAR,
    p_password_hash VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE digiclin.usuario
    SET password_hash = p_password_hash,
        debe_cambiar_password = true
    WHERE nombre_usuario = p_nombre_usuario;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario no encontrado';
    END IF;
END;
$$;

--PROCEDURE crear paciente
CREATE OR REPLACE PROCEDURE digiclin.sp_crear_paciente(
    p_nombre_p VARCHAR,
    p_apellido_pat VARCHAR,
    p_apellido_mat VARCHAR,
    p_fecha_nacimiento DATE,
    p_nombre_sexo VARCHAR,
    p_curp VARCHAR,
    p_domicilio VARCHAR,
    p_nombre_estado_civil VARCHAR,
    p_correo VARCHAR,
    p_ocupacion VARCHAR,
    p_telefono VARCHAR,
    p_contacto_emergencia VARCHAR,
    p_nombre_tipo_sangre VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_sexo INTEGER;
    v_id_estado_civil INTEGER;
    v_id_tipo_sangre INTEGER;
    v_id_estatus INTEGER;
BEGIN
    SELECT id_sexo
    INTO v_id_sexo
    FROM digiclin.sexo
    WHERE LOWER(TRIM(nombre)) = LOWER(TRIM(p_nombre_sexo));

    IF v_id_sexo IS NULL THEN
        RAISE EXCEPTION 'El sexo "%" no existe', p_nombre_sexo;
    END IF;

    IF p_nombre_estado_civil IS NOT NULL AND TRIM(p_nombre_estado_civil) <> '' THEN
        SELECT id_estado_civil
        INTO v_id_estado_civil
        FROM digiclin.estado_civil
        WHERE LOWER(TRIM(nombre)) = LOWER(TRIM(p_nombre_estado_civil));

        IF v_id_estado_civil IS NULL THEN
            RAISE EXCEPTION 'El estado civil "%" no existe', p_nombre_estado_civil;
        END IF;
    END IF;

    IF p_nombre_tipo_sangre IS NOT NULL AND TRIM(p_nombre_tipo_sangre) <> '' THEN
        SELECT id_tipo_sangre
        INTO v_id_tipo_sangre
        FROM digiclin.tipo_sangre
        WHERE LOWER(TRIM(tipo)) = LOWER(TRIM(p_nombre_tipo_sangre));

        IF v_id_tipo_sangre IS NULL THEN
            RAISE EXCEPTION 'El tipo de sangre "%" no existe', p_nombre_tipo_sangre;
        END IF;
    END IF;

    SELECT id_estatus_paciente
    INTO v_id_estatus
    FROM digiclin.estatus_paciente
    WHERE LOWER(TRIM(nombre_estatus)) = LOWER('Activo');

    IF v_id_estatus IS NULL THEN
        RAISE EXCEPTION 'Estatus Activo no existe';
    END IF;

    INSERT INTO digiclin.paciente (
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
        id_tipo_sangre,
        id_estatus_paciente
    )
    VALUES (
        p_nombre_p,
        p_apellido_pat,
        p_apellido_mat,
        p_fecha_nacimiento,
        v_id_sexo,
        UPPER(TRIM(p_curp)),
        p_domicilio,
        v_id_estado_civil,
        p_correo,
        p_ocupacion,
        p_telefono,
        p_contacto_emergencia,
        v_id_tipo_sangre,
        v_id_estatus
    );
END;
$$;

--PROCEDURE inhabilitar paciente
CREATE OR REPLACE PROCEDURE digiclin.sp_inhabilitar_paciente(
    p_curp VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_estatus INTEGER;
BEGIN
    SELECT id_estatus_paciente
    INTO v_id_estatus
    FROM digiclin.estatus_paciente
    WHERE LOWER(TRIM(nombre_estatus)) = LOWER('Inactivo');

    IF v_id_estatus IS NULL THEN
        RAISE EXCEPTION 'Estatus Inactivo no existe';
    END IF;

    UPDATE digiclin.paciente
    SET id_estatus_paciente = v_id_estatus
    WHERE UPPER(TRIM(curp)) = UPPER(TRIM(p_curp));

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Paciente no encontrado';
    END IF;
END;
$$;