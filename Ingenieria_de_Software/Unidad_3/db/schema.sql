--
-- PostgreSQL database dump
--



-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.3

-- Started on 2026-05-18 21:45:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 16483)
-- Name: digiclin; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA digiclin;


ALTER SCHEMA digiclin OWNER TO postgres;

--
-- TOC entry 368 (class 1255 OID 17150)
-- Name: fn_bitacora_general(); Type: FUNCTION; Schema: digiclin; Owner: postgres
--

CREATE FUNCTION digiclin.fn_bitacora_general() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    v_accion CHAR(1);
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_accion := 'A';

        EXECUTE format(
            'INSERT INTO digiclin.%I_bitacora OVERRIDING SYSTEM VALUE
             SELECT nextval(pg_get_serial_sequence(''digiclin.%I_bitacora'', ''id_%I_bitacora'')),
                    ($1).*, %L, current_user, CURRENT_TIMESTAMP',
            TG_TABLE_NAME,
            TG_TABLE_NAME,
            TG_TABLE_NAME,
            v_accion
        )
        USING NEW;

        RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN
        v_accion := 'C';

        EXECUTE format(
            'INSERT INTO digiclin.%I_bitacora OVERRIDING SYSTEM VALUE
             SELECT nextval(pg_get_serial_sequence(''digiclin.%I_bitacora'', ''id_%I_bitacora'')),
                    ($1).*, %L, current_user, CURRENT_TIMESTAMP',
            TG_TABLE_NAME,
            TG_TABLE_NAME,
            TG_TABLE_NAME,
            v_accion
        )
        USING NEW;

        RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN
        v_accion := 'B';

        EXECUTE format(
            'INSERT INTO digiclin.%I_bitacora OVERRIDING SYSTEM VALUE
             SELECT nextval(pg_get_serial_sequence(''digiclin.%I_bitacora'', ''id_%I_bitacora'')),
                    ($1).*, %L, current_user, CURRENT_TIMESTAMP',
            TG_TABLE_NAME,
            TG_TABLE_NAME,
            TG_TABLE_NAME,
            v_accion
        )
        USING OLD;

        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$_$;


ALTER FUNCTION digiclin.fn_bitacora_general() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 270 (class 1259 OID 16727)
-- Name: diagnostico; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.diagnostico (
    id_diagnostico integer NOT NULL,
    codigo_cie character varying(20) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(4000)
);


ALTER TABLE digiclin.diagnostico OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16501)
-- Name: estatus_expediente; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.estatus_expediente (
    id_estatus_expediente integer NOT NULL,
    nombre_estatus character varying(30) NOT NULL,
    descripcion character varying(150)
);


ALTER TABLE digiclin.estatus_expediente OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 16737)
-- Name: expediente_clinico; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.expediente_clinico (
    id_expediente integer NOT NULL,
    id_paciente integer NOT NULL,
    id_medico integer NOT NULL,
    id_diagnostico integer NOT NULL,
    id_estatus_expediente integer NOT NULL,
    fecha_consulta timestamp without time zone NOT NULL,
    motivo character varying(4000) NOT NULL,
    antecedentes_personales character varying(4000),
    antecedentes_familiares character varying(4000),
    presion_arterial character varying(20),
    frecuencia_cardiaca numeric(5,2),
    frecuencia_respiratoria numeric(5,2),
    temperatura numeric(4,1),
    saturacion_oxigeno numeric(5,2),
    peso numeric(6,2),
    talla_cintura numeric(6,2),
    altura numeric(6,2),
    observaciones character varying(4000),
    CONSTRAINT ck_expediente_altura CHECK (((altura IS NULL) OR (altura > (0)::numeric))),
    CONSTRAINT ck_expediente_fc CHECK (((frecuencia_cardiaca IS NULL) OR (frecuencia_cardiaca > (0)::numeric))),
    CONSTRAINT ck_expediente_fr CHECK (((frecuencia_respiratoria IS NULL) OR (frecuencia_respiratoria > (0)::numeric))),
    CONSTRAINT ck_expediente_peso CHECK (((peso IS NULL) OR (peso > (0)::numeric))),
    CONSTRAINT ck_expediente_saturacion CHECK (((saturacion_oxigeno IS NULL) OR ((saturacion_oxigeno >= (0)::numeric) AND (saturacion_oxigeno <= (100)::numeric)))),
    CONSTRAINT ck_expediente_talla_cintura CHECK (((talla_cintura IS NULL) OR (talla_cintura > (0)::numeric))),
    CONSTRAINT ck_expediente_temp CHECK (((temperatura IS NULL) OR ((temperatura >= (0)::numeric) AND (temperatura < (80)::numeric))))
);


ALTER TABLE digiclin.expediente_clinico OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 16671)
-- Name: paciente; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.paciente (
    id_paciente integer NOT NULL,
    nombre_p character varying(60) NOT NULL,
    apellido_pat character varying(60) NOT NULL,
    apellido_mat character varying(60),
    fecha_nacimiento date NOT NULL,
    id_sexo integer NOT NULL,
    curp character varying(18) NOT NULL,
    domicilio character varying(200),
    id_estado_civil integer,
    correo character varying(100),
    ocupacion character varying(80),
    telefono character varying(20),
    contacto_emergencia character varying(100),
    id_tipo_sangre integer,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id_estatus_paciente integer NOT NULL
);


ALTER TABLE digiclin.paciente OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 16584)
-- Name: usuario; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.usuario (
    id_usuario integer NOT NULL,
    id_rol integer NOT NULL,
    id_estatus_usuario integer NOT NULL,
    nombre_usuario character varying(50) NOT NULL,
    correo character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    debe_cambiar_password boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE digiclin.usuario OWNER TO postgres;

--
-- TOC entry 337 (class 1259 OID 17231)
-- Name: vw_expedientes; Type: VIEW; Schema: digiclin; Owner: postgres
--

CREATE VIEW digiclin.vw_expedientes AS
 SELECT e.id_expediente,
    e.fecha_consulta,
    e.motivo,
    e.antecedentes_personales,
    e.antecedentes_familiares,
    e.presion_arterial,
    e.frecuencia_cardiaca,
    e.frecuencia_respiratoria,
    e.temperatura,
    e.saturacion_oxigeno,
    e.peso,
    e.talla_cintura,
    e.altura,
    e.observaciones,
    p.id_paciente,
    (((((p.nombre_p)::text || ' '::text) || (p.apellido_pat)::text) || ' '::text) || (COALESCE(p.apellido_mat, ''::character varying))::text) AS nombre_paciente,
    p.curp,
    p.telefono AS telefono_paciente,
    p.correo AS correo_paciente,
    u.id_usuario AS id_medico,
    u.nombre_usuario AS nombre_medico,
    d.id_diagnostico,
    d.codigo_cie,
    d.nombre AS diagnostico,
    d.descripcion AS descripcion_diagnostico,
    ee.id_estatus_expediente,
    ee.nombre_estatus AS estatus_expediente
   FROM ((((digiclin.expediente_clinico e
     JOIN digiclin.paciente p ON ((e.id_paciente = p.id_paciente)))
     JOIN digiclin.usuario u ON ((e.id_medico = u.id_usuario)))
     JOIN digiclin.diagnostico d ON ((e.id_diagnostico = d.id_diagnostico)))
     JOIN digiclin.estatus_expediente ee ON ((e.id_estatus_expediente = ee.id_estatus_expediente)));


ALTER VIEW digiclin.vw_expedientes OWNER TO postgres;

--
-- TOC entry 346 (class 1255 OID 17262)
-- Name: fn_expedientes_por_id_usuario(integer); Type: FUNCTION; Schema: digiclin; Owner: postgres
--

CREATE FUNCTION digiclin.fn_expedientes_por_id_usuario(p_id_usuario integer) RETURNS SETOF digiclin.vw_expedientes
    LANGUAGE sql
    AS $$
    SELECT *
    FROM digiclin.vw_expedientes
    WHERE id_medico = p_id_usuario;
$$;


ALTER FUNCTION digiclin.fn_expedientes_por_id_usuario(p_id_usuario integer) OWNER TO postgres;

--
-- TOC entry 347 (class 1255 OID 17263)
-- Name: fn_expedientes_por_nombre_usuario(character varying); Type: FUNCTION; Schema: digiclin; Owner: postgres
--

CREATE FUNCTION digiclin.fn_expedientes_por_nombre_usuario(p_nombre_usuario character varying) RETURNS SETOF digiclin.vw_expedientes
    LANGUAGE sql
    AS $$
    SELECT *
    FROM digiclin.vw_expedientes
    WHERE LOWER(TRIM(nombre_medico)) = LOWER(TRIM(p_nombre_usuario));
$$;


ALTER FUNCTION digiclin.fn_expedientes_por_nombre_usuario(p_nombre_usuario character varying) OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 16533)
-- Name: estado_civil; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.estado_civil (
    id_estado_civil integer NOT NULL,
    nombre character varying(30) NOT NULL
);


ALTER TABLE digiclin.estado_civil OWNER TO postgres;

--
-- TOC entry 281 (class 1259 OID 16862)
-- Name: estatus_paciente; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.estatus_paciente (
    id_estatus_paciente integer NOT NULL,
    nombre_estatus character varying(30) NOT NULL
);


ALTER TABLE digiclin.estatus_paciente OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16517)
-- Name: sexo; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.sexo (
    id_sexo integer NOT NULL,
    nombre character varying(10) NOT NULL
);


ALTER TABLE digiclin.sexo OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16525)
-- Name: tipo_sangre; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.tipo_sangre (
    id_tipo_sangre integer NOT NULL,
    tipo character varying(10) NOT NULL
);


ALTER TABLE digiclin.tipo_sangre OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 16879)
-- Name: vw_paciente; Type: VIEW; Schema: digiclin; Owner: postgres
--

CREATE VIEW digiclin.vw_paciente AS
 SELECT p.id_paciente,
    p.nombre_p,
    p.apellido_pat,
    p.apellido_mat,
    concat_ws(' '::text, p.nombre_p, p.apellido_pat, p.apellido_mat) AS nombre_completo,
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
   FROM ((((digiclin.paciente p
     JOIN digiclin.sexo s ON ((p.id_sexo = s.id_sexo)))
     LEFT JOIN digiclin.estado_civil ec ON ((p.id_estado_civil = ec.id_estado_civil)))
     LEFT JOIN digiclin.tipo_sangre ts ON ((p.id_tipo_sangre = ts.id_tipo_sangre)))
     JOIN digiclin.estatus_paciente ep ON ((p.id_estatus_paciente = ep.id_estatus_paciente)));


ALTER VIEW digiclin.vw_paciente OWNER TO postgres;

--
-- TOC entry 344 (class 1255 OID 16891)
-- Name: fn_obtener_paciente_por_curp(character varying); Type: FUNCTION; Schema: digiclin; Owner: postgres
--

CREATE FUNCTION digiclin.fn_obtener_paciente_por_curp(p_curp character varying) RETURNS SETOF digiclin.vw_paciente
    LANGUAGE sql
    AS $$
    SELECT *
    FROM digiclin.vw_paciente
    WHERE UPPER(TRIM(curp)) = UPPER(TRIM(p_curp));
$$;


ALTER FUNCTION digiclin.fn_obtener_paciente_por_curp(p_curp character varying) OWNER TO postgres;

--
-- TOC entry 375 (class 1255 OID 17273)
-- Name: sp_actualizar_expediente(integer, integer, integer, timestamp without time zone, character varying, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, character varying); Type: PROCEDURE; Schema: digiclin; Owner: postgres
--

CREATE PROCEDURE digiclin.sp_actualizar_expediente(IN p_id_expediente integer, IN p_id_paciente integer, IN p_id_diagnostico integer, IN p_fecha_consulta timestamp without time zone, IN p_motivo character varying, IN p_antecedentes_personales character varying, IN p_antecedentes_familiares character varying, IN p_presion_arterial character varying, IN p_frecuencia_cardiaca numeric, IN p_frecuencia_respiratoria numeric, IN p_temperatura numeric, IN p_saturacion_oxigeno numeric, IN p_peso numeric, IN p_talla_cintura numeric, IN p_altura numeric, IN p_observaciones character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_estatus_actual VARCHAR;
BEGIN
    SELECT ee.nombre_estatus
    INTO v_estatus_actual
    FROM digiclin.expediente_clinico e
    INNER JOIN digiclin.estatus_expediente ee
        ON e.id_estatus_expediente = ee.id_estatus_expediente
    WHERE e.id_expediente = p_id_expediente;

    IF v_estatus_actual IS NULL THEN
        RAISE EXCEPTION 'No existe expediente con id = %', p_id_expediente;
    END IF;

    IF LOWER(TRIM(v_estatus_actual)) = LOWER('Archivado') THEN
        RAISE EXCEPTION 'No se puede actualizar un expediente archivado';
    END IF;

    UPDATE digiclin.expediente_clinico
    SET
        id_paciente = COALESCE(p_id_paciente, id_paciente),
        id_diagnostico = COALESCE(p_id_diagnostico, id_diagnostico),
        fecha_consulta = COALESCE(p_fecha_consulta, fecha_consulta),
        motivo = COALESCE(NULLIF(TRIM(p_motivo), ''), motivo),
        antecedentes_personales = COALESCE(NULLIF(TRIM(p_antecedentes_personales), ''), antecedentes_personales),
        antecedentes_familiares = COALESCE(NULLIF(TRIM(p_antecedentes_familiares), ''), antecedentes_familiares),
        presion_arterial = COALESCE(NULLIF(TRIM(p_presion_arterial), ''), presion_arterial),
        frecuencia_cardiaca = COALESCE(p_frecuencia_cardiaca, frecuencia_cardiaca),
        frecuencia_respiratoria = COALESCE(p_frecuencia_respiratoria, frecuencia_respiratoria),
        temperatura = COALESCE(p_temperatura, temperatura),
        saturacion_oxigeno = COALESCE(p_saturacion_oxigeno, saturacion_oxigeno),
        peso = COALESCE(p_peso, peso),
        talla_cintura = COALESCE(p_talla_cintura, talla_cintura),
        altura = COALESCE(p_altura, altura),
        observaciones = COALESCE(NULLIF(TRIM(p_observaciones), ''), observaciones)
    WHERE id_expediente = p_id_expediente;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No existe expediente con id = %', p_id_expediente;
    END IF;
END;
$$;


ALTER PROCEDURE digiclin.sp_actualizar_expediente(IN p_id_expediente integer, IN p_id_paciente integer, IN p_id_diagnostico integer, IN p_fecha_consulta timestamp without time zone, IN p_motivo character varying, IN p_antecedentes_personales character varying, IN p_antecedentes_familiares character varying, IN p_presion_arterial character varying, IN p_frecuencia_cardiaca numeric, IN p_frecuencia_respiratoria numeric, IN p_temperatura numeric, IN p_saturacion_oxigeno numeric, IN p_peso numeric, IN p_talla_cintura numeric, IN p_altura numeric, IN p_observaciones character varying) OWNER TO postgres;

--
-- TOC entry 348 (class 1255 OID 16844)
-- Name: sp_actualizar_mi_perfil(character varying, character varying, character varying); Type: PROCEDURE; Schema: digiclin; Owner: postgres
--

CREATE PROCEDURE digiclin.sp_actualizar_mi_perfil(IN p_nombre_usuario_actual character varying, IN p_nuevo_nombre_usuario character varying, IN p_correo character varying)
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


ALTER PROCEDURE digiclin.sp_actualizar_mi_perfil(IN p_nombre_usuario_actual character varying, IN p_nuevo_nombre_usuario character varying, IN p_correo character varying) OWNER TO postgres;

--
-- TOC entry 370 (class 1255 OID 17253)
-- Name: sp_actualizar_paciente(character varying, character varying, character varying, character varying, date, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying); Type: PROCEDURE; Schema: digiclin; Owner: postgres
--

CREATE PROCEDURE digiclin.sp_actualizar_paciente(IN p_curp character varying, IN p_nombre_p character varying, IN p_apellido_pat character varying, IN p_apellido_mat character varying, IN p_fecha_nacimiento date, IN p_nombre_sexo character varying, IN p_domicilio character varying, IN p_nombre_estado_civil character varying, IN p_correo character varying, IN p_ocupacion character varying, IN p_telefono character varying, IN p_contacto_emergencia character varying, IN p_nombre_tipo_sangre character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_id_sexo INTEGER;
    v_id_estado_civil INTEGER;
    v_id_tipo_sangre INTEGER;
BEGIN
    IF p_curp IS NULL OR TRIM(p_curp) = '' THEN
        RAISE EXCEPTION 'La CURP es obligatoria';
    END IF;

    IF p_nombre_sexo IS NOT NULL AND TRIM(p_nombre_sexo) <> '' THEN
        SELECT id_sexo
        INTO v_id_sexo
        FROM digiclin.sexo
        WHERE LOWER(TRIM(nombre)) = LOWER(TRIM(p_nombre_sexo));

        IF v_id_sexo IS NULL THEN
            RAISE EXCEPTION 'El sexo "%" no existe', p_nombre_sexo;
        END IF;
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

    UPDATE digiclin.paciente
    SET
        nombre_p = COALESCE(NULLIF(TRIM(p_nombre_p), ''), nombre_p),
        apellido_pat = COALESCE(NULLIF(TRIM(p_apellido_pat), ''), apellido_pat),
        apellido_mat = COALESCE(NULLIF(TRIM(p_apellido_mat), ''), apellido_mat),
        fecha_nacimiento = COALESCE(p_fecha_nacimiento, fecha_nacimiento),
        id_sexo = COALESCE(v_id_sexo, id_sexo),
        domicilio = COALESCE(NULLIF(TRIM(p_domicilio), ''), domicilio),
        id_estado_civil = COALESCE(v_id_estado_civil, id_estado_civil),
        correo = COALESCE(NULLIF(TRIM(p_correo), ''), correo),
        ocupacion = COALESCE(NULLIF(TRIM(p_ocupacion), ''), ocupacion),
        telefono = COALESCE(NULLIF(TRIM(p_telefono), ''), telefono),
        contacto_emergencia = COALESCE(NULLIF(TRIM(p_contacto_emergencia), ''), contacto_emergencia),
        id_tipo_sangre = COALESCE(v_id_tipo_sangre, id_tipo_sangre)
    WHERE UPPER(TRIM(curp)) = UPPER(TRIM(p_curp));

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No existe un paciente con CURP = %', p_curp;
    END IF;
END;
$$;


ALTER PROCEDURE digiclin.sp_actualizar_paciente(IN p_curp character varying, IN p_nombre_p character varying, IN p_apellido_pat character varying, IN p_apellido_mat character varying, IN p_fecha_nacimiento date, IN p_nombre_sexo character varying, IN p_domicilio character varying, IN p_nombre_estado_civil character varying, IN p_correo character varying, IN p_ocupacion character varying, IN p_telefono character varying, IN p_contacto_emergencia character varying, IN p_nombre_tipo_sangre character varying) OWNER TO postgres;

--
-- TOC entry 351 (class 1255 OID 16859)
-- Name: sp_actualizar_usuario(character varying, character varying, character varying); Type: PROCEDURE; Schema: digiclin; Owner: postgres
--

CREATE PROCEDURE digiclin.sp_actualizar_usuario(IN p_nombre_usuario_actual character varying, IN p_nuevo_nombre_usuario character varying, IN p_correo character varying)
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


ALTER PROCEDURE digiclin.sp_actualizar_usuario(IN p_nombre_usuario_actual character varying, IN p_nuevo_nombre_usuario character varying, IN p_correo character varying) OWNER TO postgres;

--
-- TOC entry 372 (class 1255 OID 17260)
-- Name: sp_archivar_expediente(integer); Type: PROCEDURE; Schema: digiclin; Owner: postgres
--

CREATE PROCEDURE digiclin.sp_archivar_expediente(IN p_id_expediente integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_id_archivado INTEGER;
BEGIN
    SELECT id_estatus_expediente
    INTO v_id_archivado
    FROM digiclin.estatus_expediente
    WHERE LOWER(TRIM(nombre_estatus)) = LOWER('Archivado');

    IF v_id_archivado IS NULL THEN
        RAISE EXCEPTION 'No existe el estatus Archivado';
    END IF;

    UPDATE digiclin.expediente_clinico
    SET id_estatus_expediente = v_id_archivado
    WHERE id_expediente = p_id_expediente;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No existe expediente con id = %', p_id_expediente;
    END IF;
END;
$$;


ALTER PROCEDURE digiclin.sp_archivar_expediente(IN p_id_expediente integer) OWNER TO postgres;

--
-- TOC entry 345 (class 1255 OID 16843)
-- Name: sp_cambiar_password_usuario(character varying, character varying); Type: PROCEDURE; Schema: digiclin; Owner: postgres
--

CREATE PROCEDURE digiclin.sp_cambiar_password_usuario(IN p_nombre_usuario character varying, IN p_password_hash_nuevo character varying)
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


ALTER PROCEDURE digiclin.sp_cambiar_password_usuario(IN p_nombre_usuario character varying, IN p_password_hash_nuevo character varying) OWNER TO postgres;

--
-- TOC entry 369 (class 1255 OID 17252)
-- Name: sp_corregir_curp_paciente(character varying, character varying); Type: PROCEDURE; Schema: digiclin; Owner: postgres
--

CREATE PROCEDURE digiclin.sp_corregir_curp_paciente(IN p_curp_actual character varying, IN p_nuevo_curp character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF p_curp_actual IS NULL OR TRIM(p_curp_actual) = '' THEN
        RAISE EXCEPTION 'La CURP actual es obligatoria';
    END IF;

    IF p_nuevo_curp IS NULL OR TRIM(p_nuevo_curp) = '' THEN
        RAISE EXCEPTION 'La nueva CURP es obligatoria';
    END IF;

    IF LENGTH(TRIM(p_nuevo_curp)) <> 18 THEN
        RAISE EXCEPTION 'La nueva CURP debe tener 18 caracteres';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM digiclin.paciente
        WHERE UPPER(TRIM(curp)) = UPPER(TRIM(p_nuevo_curp))
          AND UPPER(TRIM(curp)) <> UPPER(TRIM(p_curp_actual))
    ) THEN
        RAISE EXCEPTION 'Ya existe un paciente con la CURP %', p_nuevo_curp;
    END IF;

    UPDATE digiclin.paciente
    SET curp = UPPER(TRIM(p_nuevo_curp))
    WHERE UPPER(TRIM(curp)) = UPPER(TRIM(p_curp_actual));

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Paciente no encontrado con CURP %', p_curp_actual;
    END IF;
END;
$$;


ALTER PROCEDURE digiclin.sp_corregir_curp_paciente(IN p_curp_actual character varying, IN p_nuevo_curp character varying) OWNER TO postgres;

--
-- TOC entry 371 (class 1255 OID 17258)
-- Name: sp_crear_expediente(integer, integer, integer, timestamp without time zone, character varying, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, character varying); Type: PROCEDURE; Schema: digiclin; Owner: postgres
--

CREATE PROCEDURE digiclin.sp_crear_expediente(IN p_id_paciente integer, IN p_id_medico integer, IN p_id_diagnostico integer, IN p_fecha_consulta timestamp without time zone, IN p_motivo character varying, IN p_antecedentes_personales character varying, IN p_antecedentes_familiares character varying, IN p_presion_arterial character varying, IN p_frecuencia_cardiaca numeric, IN p_frecuencia_respiratoria numeric, IN p_temperatura numeric, IN p_saturacion_oxigeno numeric, IN p_peso numeric, IN p_talla_cintura numeric, IN p_altura numeric, IN p_observaciones character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_id_abierto INTEGER;
BEGIN
    SELECT id_estatus_expediente
    INTO v_id_abierto
    FROM digiclin.estatus_expediente
    WHERE LOWER(TRIM(nombre_estatus)) = LOWER('Abierto');

    IF v_id_abierto IS NULL THEN
        RAISE EXCEPTION 'No existe el estatus Abierto';
    END IF;

    INSERT INTO digiclin.expediente_clinico (
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
    VALUES (
        p_id_paciente,
        p_id_medico,
        p_id_diagnostico,
        v_id_abierto,
        p_fecha_consulta,
        p_motivo,
        p_antecedentes_personales,
        p_antecedentes_familiares,
        p_presion_arterial,
        p_frecuencia_cardiaca,
        p_frecuencia_respiratoria,
        p_temperatura,
        p_saturacion_oxigeno,
        p_peso,
        p_talla_cintura,
        p_altura,
        p_observaciones
    );
END;
$$;


ALTER PROCEDURE digiclin.sp_crear_expediente(IN p_id_paciente integer, IN p_id_medico integer, IN p_id_diagnostico integer, IN p_fecha_consulta timestamp without time zone, IN p_motivo character varying, IN p_antecedentes_personales character varying, IN p_antecedentes_familiares character varying, IN p_presion_arterial character varying, IN p_frecuencia_cardiaca numeric, IN p_frecuencia_respiratoria numeric, IN p_temperatura numeric, IN p_saturacion_oxigeno numeric, IN p_peso numeric, IN p_talla_cintura numeric, IN p_altura numeric, IN p_observaciones character varying) OWNER TO postgres;

--
-- TOC entry 373 (class 1255 OID 17265)
-- Name: sp_crear_expediente_desde_usuario(integer, integer, integer, timestamp without time zone, character varying, character varying, character varying, character varying, numeric, numeric, numeric, numeric, numeric, numeric, numeric, character varying, integer); Type: PROCEDURE; Schema: digiclin; Owner: postgres
--

CREATE PROCEDURE digiclin.sp_crear_expediente_desde_usuario(IN p_id_usuario integer, IN p_id_paciente integer, IN p_id_diagnostico integer, IN p_fecha_consulta timestamp without time zone, IN p_motivo character varying, IN p_antecedentes_personales character varying, IN p_antecedentes_familiares character varying, IN p_presion_arterial character varying, IN p_frecuencia_cardiaca numeric, IN p_frecuencia_respiratoria numeric, IN p_temperatura numeric, IN p_saturacion_oxigeno numeric, IN p_peso numeric, IN p_talla_cintura numeric, IN p_altura numeric, IN p_observaciones character varying, INOUT p_id_expediente_generado integer DEFAULT NULL::integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_id_medico INTEGER;
    v_id_abierto INTEGER;
BEGIN
    SELECT m.id_medico
    INTO v_id_medico
    FROM digiclin.medico m
    INNER JOIN digiclin.personal_medico pm
        ON m.id_medico = pm.id_personal_medico
    WHERE pm.id_personal_medico = p_id_usuario;

    IF v_id_medico IS NULL THEN
        RAISE EXCEPTION 'El usuario autenticado no está registrado como médico';
    END IF;

    SELECT id_estatus_expediente
    INTO v_id_abierto
    FROM digiclin.estatus_expediente
    WHERE LOWER(TRIM(nombre_estatus)) = LOWER('Abierto');

    IF v_id_abierto IS NULL THEN
        RAISE EXCEPTION 'No existe el estatus Abierto';
    END IF;

    INSERT INTO digiclin.expediente_clinico (
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
    VALUES (
        p_id_paciente,
        v_id_medico,
        p_id_diagnostico,
        v_id_abierto,
        p_fecha_consulta,
        p_motivo,
        p_antecedentes_personales,
        p_antecedentes_familiares,
        p_presion_arterial,
        p_frecuencia_cardiaca,
        p_frecuencia_respiratoria,
        p_temperatura,
        p_saturacion_oxigeno,
        p_peso,
        p_talla_cintura,
        p_altura,
        p_observaciones
    )
    RETURNING id_expediente INTO p_id_expediente_generado;
END;
$$;


ALTER PROCEDURE digiclin.sp_crear_expediente_desde_usuario(IN p_id_usuario integer, IN p_id_paciente integer, IN p_id_diagnostico integer, IN p_fecha_consulta timestamp without time zone, IN p_motivo character varying, IN p_antecedentes_personales character varying, IN p_antecedentes_familiares character varying, IN p_presion_arterial character varying, IN p_frecuencia_cardiaca numeric, IN p_frecuencia_respiratoria numeric, IN p_temperatura numeric, IN p_saturacion_oxigeno numeric, IN p_peso numeric, IN p_talla_cintura numeric, IN p_altura numeric, IN p_observaciones character varying, INOUT p_id_expediente_generado integer) OWNER TO postgres;

--
-- TOC entry 367 (class 1255 OID 16888)
-- Name: sp_crear_paciente(character varying, character varying, character varying, date, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying); Type: PROCEDURE; Schema: digiclin; Owner: postgres
--

CREATE PROCEDURE digiclin.sp_crear_paciente(IN p_nombre_p character varying, IN p_apellido_pat character varying, IN p_apellido_mat character varying, IN p_fecha_nacimiento date, IN p_nombre_sexo character varying, IN p_curp character varying, IN p_domicilio character varying, IN p_nombre_estado_civil character varying, IN p_correo character varying, IN p_ocupacion character varying, IN p_telefono character varying, IN p_contacto_emergencia character varying, IN p_nombre_tipo_sangre character varying)
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


ALTER PROCEDURE digiclin.sp_crear_paciente(IN p_nombre_p character varying, IN p_apellido_pat character varying, IN p_apellido_mat character varying, IN p_fecha_nacimiento date, IN p_nombre_sexo character varying, IN p_curp character varying, IN p_domicilio character varying, IN p_nombre_estado_civil character varying, IN p_correo character varying, IN p_ocupacion character varying, IN p_telefono character varying, IN p_contacto_emergencia character varying, IN p_nombre_tipo_sangre character varying) OWNER TO postgres;

--
-- TOC entry 374 (class 1255 OID 17272)
-- Name: sp_crear_usuario(character varying, character varying, character varying, character varying, character varying, character varying); Type: PROCEDURE; Schema: digiclin; Owner: postgres
--

CREATE PROCEDURE digiclin.sp_crear_usuario(IN p_nombre_usuario character varying, IN p_correo character varying, IN p_password_hash character varying, IN p_nombre_rol character varying, IN p_cedula character varying DEFAULT NULL::character varying, IN p_nombre_especialidad character varying DEFAULT NULL::character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_id_usuario INTEGER;
    v_id_rol INTEGER;
    v_nombre_rol VARCHAR;
    v_id_estatus INTEGER;
    v_id_especialidad INTEGER;
BEGIN
    SELECT id_rol, nombre_rol
    INTO v_id_rol, v_nombre_rol
    FROM digiclin.rol
    WHERE LOWER(TRIM(nombre_rol)) = LOWER(TRIM(p_nombre_rol));

    IF v_id_rol IS NULL THEN
        RAISE EXCEPTION 'El rol "%" no existe', p_nombre_rol;
    END IF;

    SELECT id_estatus_usuario
    INTO v_id_estatus
    FROM digiclin.estatus_usuario
    WHERE LOWER(TRIM(nombre_estatus)) = LOWER('Activo');

    IF v_id_estatus IS NULL THEN
        RAISE EXCEPTION 'No existe el estatus Activo';
    END IF;

    IF LOWER(TRIM(v_nombre_rol)) = LOWER('Medico') THEN
        IF p_cedula IS NULL OR TRIM(p_cedula) = '' THEN
            RAISE EXCEPTION 'La cédula es obligatoria para usuarios con rol Medico';
        END IF;

        IF p_nombre_especialidad IS NULL OR TRIM(p_nombre_especialidad) = '' THEN
            RAISE EXCEPTION 'La especialidad es obligatoria para usuarios con rol Medico';
        END IF;

        SELECT id_especialidad
        INTO v_id_especialidad
        FROM digiclin.especialidad
        WHERE LOWER(TRIM(nombre)) = LOWER(TRIM(p_nombre_especialidad));

        IF v_id_especialidad IS NULL THEN
            RAISE EXCEPTION 'La especialidad "%" no existe', p_nombre_especialidad;
        END IF;
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
    )
    RETURNING id_usuario INTO v_id_usuario;

    IF LOWER(TRIM(v_nombre_rol)) = LOWER('Medico') THEN
        INSERT INTO digiclin.personal_medico (
            id_personal_medico,
            cedula
        )
        VALUES (
            v_id_usuario,
            TRIM(p_cedula)
        );

        INSERT INTO digiclin.medico (
            id_medico,
            id_especialidad
        )
        VALUES (
            v_id_usuario,
            v_id_especialidad
        );
    END IF;
END;
$$;


ALTER PROCEDURE digiclin.sp_crear_usuario(IN p_nombre_usuario character varying, IN p_correo character varying, IN p_password_hash character varying, IN p_nombre_rol character varying, IN p_cedula character varying, IN p_nombre_especialidad character varying) OWNER TO postgres;

--
-- TOC entry 366 (class 1255 OID 17264)
-- Name: sp_desarchivar_expediente(integer); Type: PROCEDURE; Schema: digiclin; Owner: postgres
--

CREATE PROCEDURE digiclin.sp_desarchivar_expediente(IN p_id_expediente integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_id_abierto INTEGER;
BEGIN
    SELECT id_estatus_expediente
    INTO v_id_abierto
    FROM digiclin.estatus_expediente
    WHERE LOWER(TRIM(nombre_estatus)) = LOWER('Abierto');

    UPDATE digiclin.expediente_clinico
    SET id_estatus_expediente = v_id_abierto
    WHERE id_expediente = p_id_expediente;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No existe expediente con id = %', p_id_expediente;
    END IF;
END;
$$;


ALTER PROCEDURE digiclin.sp_desarchivar_expediente(IN p_id_expediente integer) OWNER TO postgres;

--
-- TOC entry 343 (class 1255 OID 16833)
-- Name: sp_eliminar_usuario(character varying); Type: PROCEDURE; Schema: digiclin; Owner: digiclin_app
--

CREATE PROCEDURE digiclin.sp_eliminar_usuario(IN p_nombre_usuario character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM digiclin.usuario
    WHERE nombre_usuario = p_nombre_usuario;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario no encontrado: %', p_nombre_usuario;
    END IF;
END;
$$;


ALTER PROCEDURE digiclin.sp_eliminar_usuario(IN p_nombre_usuario character varying) OWNER TO digiclin_app;

--
-- TOC entry 365 (class 1255 OID 16890)
-- Name: sp_habilitar_paciente(character varying); Type: PROCEDURE; Schema: digiclin; Owner: postgres
--

CREATE PROCEDURE digiclin.sp_habilitar_paciente(IN p_curp character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_id_estatus INTEGER;
BEGIN
    SELECT id_estatus_paciente
    INTO v_id_estatus
    FROM digiclin.estatus_paciente
    WHERE LOWER(TRIM(nombre_estatus)) = LOWER('Activo');

    IF v_id_estatus IS NULL THEN
        RAISE EXCEPTION 'Estatus Activo no existe';
    END IF;

    UPDATE digiclin.paciente
    SET id_estatus_paciente = v_id_estatus
    WHERE UPPER(TRIM(curp)) = UPPER(TRIM(p_curp));

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Paciente no encontrado';
    END IF;
END;
$$;


ALTER PROCEDURE digiclin.sp_habilitar_paciente(IN p_curp character varying) OWNER TO postgres;

--
-- TOC entry 350 (class 1255 OID 16848)
-- Name: sp_habilitar_usuario(character varying); Type: PROCEDURE; Schema: digiclin; Owner: postgres
--

CREATE PROCEDURE digiclin.sp_habilitar_usuario(IN p_nombre_usuario character varying)
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


ALTER PROCEDURE digiclin.sp_habilitar_usuario(IN p_nombre_usuario character varying) OWNER TO postgres;

--
-- TOC entry 353 (class 1255 OID 16889)
-- Name: sp_inhabilitar_paciente(character varying); Type: PROCEDURE; Schema: digiclin; Owner: postgres
--

CREATE PROCEDURE digiclin.sp_inhabilitar_paciente(IN p_curp character varying)
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


ALTER PROCEDURE digiclin.sp_inhabilitar_paciente(IN p_curp character varying) OWNER TO postgres;

--
-- TOC entry 349 (class 1255 OID 16847)
-- Name: sp_inhabilitar_usuario(character varying); Type: PROCEDURE; Schema: digiclin; Owner: postgres
--

CREATE PROCEDURE digiclin.sp_inhabilitar_usuario(IN p_nombre_usuario character varying)
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


ALTER PROCEDURE digiclin.sp_inhabilitar_usuario(IN p_nombre_usuario character varying) OWNER TO postgres;

--
-- TOC entry 352 (class 1255 OID 16860)
-- Name: sp_resetear_password_usuario(character varying, character varying); Type: PROCEDURE; Schema: digiclin; Owner: postgres
--

CREATE PROCEDURE digiclin.sp_resetear_password_usuario(IN p_nombre_usuario character varying, IN p_password_hash character varying)
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


ALTER PROCEDURE digiclin.sp_resetear_password_usuario(IN p_nombre_usuario character varying, IN p_password_hash character varying) OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 16541)
-- Name: alergia; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.alergia (
    id_alergia integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(300)
);


ALTER TABLE digiclin.alergia OWNER TO postgres;

--
-- TOC entry 296 (class 1259 OID 16944)
-- Name: alergia_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.alergia_bitacora (
    id_alergia_bitacora bigint NOT NULL,
    id_alergia integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(300),
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT alergia_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.alergia_bitacora OWNER TO postgres;

--
-- TOC entry 295 (class 1259 OID 16943)
-- Name: alergia_bitacora_id_alergia_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.alergia_bitacora ALTER COLUMN id_alergia_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.alergia_bitacora_id_alergia_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 248 (class 1259 OID 16540)
-- Name: alergia_id_alergia_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.alergia ALTER COLUMN id_alergia ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.alergia_id_alergia_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 253 (class 1259 OID 16557)
-- Name: certificacion; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.certificacion (
    id_certificacion integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(300)
);


ALTER TABLE digiclin.certificacion OWNER TO postgres;

--
-- TOC entry 314 (class 1259 OID 17029)
-- Name: certificacion_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.certificacion_bitacora (
    id_certificacion_bitacora bigint NOT NULL,
    id_certificacion integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(300),
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT certificacion_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.certificacion_bitacora OWNER TO postgres;

--
-- TOC entry 313 (class 1259 OID 17028)
-- Name: certificacion_bitacora_id_certificacion_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.certificacion_bitacora ALTER COLUMN id_certificacion_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.certificacion_bitacora_id_certificacion_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 252 (class 1259 OID 16556)
-- Name: certificacion_id_certificacion_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.certificacion ALTER COLUMN id_certificacion ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.certificacion_id_certificacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 334 (class 1259 OID 17131)
-- Name: diagnostico_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.diagnostico_bitacora (
    id_diagnostico_bitacora bigint NOT NULL,
    id_diagnostico integer NOT NULL,
    codigo_cie character varying(20) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(4000),
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT diagnostico_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.diagnostico_bitacora OWNER TO postgres;

--
-- TOC entry 333 (class 1259 OID 17130)
-- Name: diagnostico_bitacora_id_diagnostico_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.diagnostico_bitacora ALTER COLUMN id_diagnostico_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.diagnostico_bitacora_id_diagnostico_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 269 (class 1259 OID 16726)
-- Name: diagnostico_id_diagnostico_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.diagnostico ALTER COLUMN id_diagnostico ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.diagnostico_id_diagnostico_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 264 (class 1259 OID 16658)
-- Name: director; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.director (
    id_director integer NOT NULL,
    plaza character varying(100) NOT NULL
);


ALTER TABLE digiclin.director OWNER TO postgres;

--
-- TOC entry 316 (class 1259 OID 17040)
-- Name: director_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.director_bitacora (
    id_director_bitacora bigint NOT NULL,
    id_director integer NOT NULL,
    plaza character varying(100) NOT NULL,
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT director_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.director_bitacora OWNER TO postgres;

--
-- TOC entry 315 (class 1259 OID 17039)
-- Name: director_bitacora_id_director_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.director_bitacora ALTER COLUMN id_director_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.director_bitacora_id_director_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 251 (class 1259 OID 16549)
-- Name: enfermedad_cronica; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.enfermedad_cronica (
    id_enfermedad integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(300)
);


ALTER TABLE digiclin.enfermedad_cronica OWNER TO postgres;

--
-- TOC entry 322 (class 1259 OID 17069)
-- Name: enfermedad_cronica_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.enfermedad_cronica_bitacora (
    id_enfermedad_cronica_bitacora bigint NOT NULL,
    id_enfermedad integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(300),
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT enfermedad_cronica_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.enfermedad_cronica_bitacora OWNER TO postgres;

--
-- TOC entry 321 (class 1259 OID 17068)
-- Name: enfermedad_cronica_bitacora_id_enfermedad_cronica_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.enfermedad_cronica_bitacora ALTER COLUMN id_enfermedad_cronica_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.enfermedad_cronica_bitacora_id_enfermedad_cronica_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 250 (class 1259 OID 16548)
-- Name: enfermedad_cronica_id_enfermedad_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.enfermedad_cronica ALTER COLUMN id_enfermedad ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.enfermedad_cronica_id_enfermedad_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 262 (class 1259 OID 16632)
-- Name: enfermero; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.enfermero (
    id_enfermero integer NOT NULL
);


ALTER TABLE digiclin.enfermero OWNER TO postgres;

--
-- TOC entry 310 (class 1259 OID 17011)
-- Name: enfermero_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.enfermero_bitacora (
    id_enfermero_bitacora bigint NOT NULL,
    id_enfermero integer NOT NULL,
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT enfermero_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.enfermero_bitacora OWNER TO postgres;

--
-- TOC entry 309 (class 1259 OID 17010)
-- Name: enfermero_bitacora_id_enfermero_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.enfermero_bitacora ALTER COLUMN id_enfermero_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.enfermero_bitacora_id_enfermero_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 263 (class 1259 OID 16642)
-- Name: enfermero_certificacion; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.enfermero_certificacion (
    id_enfermero integer NOT NULL,
    id_certificacion integer NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE digiclin.enfermero_certificacion OWNER TO postgres;

--
-- TOC entry 312 (class 1259 OID 17020)
-- Name: enfermero_certificacion_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.enfermero_certificacion_bitacora (
    id_enfermero_certificacion_bitacora bigint NOT NULL,
    id_enfermero integer NOT NULL,
    id_certificacion integer NOT NULL,
    fecha_registro timestamp without time zone NOT NULL,
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT enfermero_certificacion_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.enfermero_certificacion_bitacora OWNER TO postgres;

--
-- TOC entry 311 (class 1259 OID 17019)
-- Name: enfermero_certificacion_bitac_id_enfermero_certificacion_bi_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.enfermero_certificacion_bitacora ALTER COLUMN id_enfermero_certificacion_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.enfermero_certificacion_bitac_id_enfermero_certificacion_bi_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 241 (class 1259 OID 16509)
-- Name: especialidad; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.especialidad (
    id_especialidad integer NOT NULL,
    nombre character varying(80) NOT NULL,
    descripcion character varying(150)
);


ALTER TABLE digiclin.especialidad OWNER TO postgres;

--
-- TOC entry 308 (class 1259 OID 17002)
-- Name: especialidad_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.especialidad_bitacora (
    id_especialidad_bitacora bigint NOT NULL,
    id_especialidad integer NOT NULL,
    nombre character varying(80) NOT NULL,
    descripcion character varying(150),
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT especialidad_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.especialidad_bitacora OWNER TO postgres;

--
-- TOC entry 307 (class 1259 OID 17001)
-- Name: especialidad_bitacora_id_especialidad_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.especialidad_bitacora ALTER COLUMN id_especialidad_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.especialidad_bitacora_id_especialidad_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 240 (class 1259 OID 16508)
-- Name: especialidad_id_especialidad_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.especialidad ALTER COLUMN id_especialidad ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.especialidad_id_especialidad_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 292 (class 1259 OID 16926)
-- Name: estado_civil_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.estado_civil_bitacora (
    id_estado_civil_bitacora bigint NOT NULL,
    id_estado_civil integer NOT NULL,
    nombre character varying(30) NOT NULL,
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT estado_civil_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.estado_civil_bitacora OWNER TO postgres;

--
-- TOC entry 291 (class 1259 OID 16925)
-- Name: estado_civil_bitacora_id_estado_civil_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.estado_civil_bitacora ALTER COLUMN id_estado_civil_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.estado_civil_bitacora_id_estado_civil_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 246 (class 1259 OID 16532)
-- Name: estado_civil_id_estado_civil_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.estado_civil ALTER COLUMN id_estado_civil ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.estado_civil_id_estado_civil_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 298 (class 1259 OID 16955)
-- Name: estatus_expediente_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.estatus_expediente_bitacora (
    id_estatus_expediente_bitacora bigint NOT NULL,
    id_estatus_expediente integer NOT NULL,
    nombre_estatus character varying(30) NOT NULL,
    descripcion character varying(150),
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT estatus_expediente_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.estatus_expediente_bitacora OWNER TO postgres;

--
-- TOC entry 297 (class 1259 OID 16954)
-- Name: estatus_expediente_bitacora_id_estatus_expediente_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.estatus_expediente_bitacora ALTER COLUMN id_estatus_expediente_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.estatus_expediente_bitacora_id_estatus_expediente_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 238 (class 1259 OID 16500)
-- Name: estatus_expediente_id_estatus_expediente_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.estatus_expediente ALTER COLUMN id_estatus_expediente ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.estatus_expediente_id_estatus_expediente_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 336 (class 1259 OID 17142)
-- Name: estatus_paciente_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.estatus_paciente_bitacora (
    id_estatus_paciente_bitacora bigint NOT NULL,
    id_estatus_paciente integer NOT NULL,
    nombre_estatus character varying(30) NOT NULL,
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT estatus_paciente_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.estatus_paciente_bitacora OWNER TO postgres;

--
-- TOC entry 335 (class 1259 OID 17141)
-- Name: estatus_paciente_bitacora_id_estatus_paciente_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.estatus_paciente_bitacora ALTER COLUMN id_estatus_paciente_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.estatus_paciente_bitacora_id_estatus_paciente_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 280 (class 1259 OID 16861)
-- Name: estatus_paciente_id_estatus_paciente_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.estatus_paciente ALTER COLUMN id_estatus_paciente ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.estatus_paciente_id_estatus_paciente_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 237 (class 1259 OID 16493)
-- Name: estatus_usuario; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.estatus_usuario (
    id_estatus_usuario integer NOT NULL,
    nombre_estatus character varying(30) NOT NULL,
    descripcion character varying(150)
);


ALTER TABLE digiclin.estatus_usuario OWNER TO postgres;

--
-- TOC entry 302 (class 1259 OID 16975)
-- Name: estatus_usuario_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.estatus_usuario_bitacora (
    id_estatus_usuario_bitacora bigint NOT NULL,
    id_estatus_usuario integer NOT NULL,
    nombre_estatus character varying(30) NOT NULL,
    descripcion character varying(150),
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT estatus_usuario_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.estatus_usuario_bitacora OWNER TO postgres;

--
-- TOC entry 301 (class 1259 OID 16974)
-- Name: estatus_usuario_bitacora_id_estatus_usuario_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.estatus_usuario_bitacora ALTER COLUMN id_estatus_usuario_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.estatus_usuario_bitacora_id_estatus_usuario_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 236 (class 1259 OID 16492)
-- Name: estatus_usuario_id_estatus_usuario_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.estatus_usuario ALTER COLUMN id_estatus_usuario ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.estatus_usuario_id_estatus_usuario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 332 (class 1259 OID 17120)
-- Name: expediente_clinico_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.expediente_clinico_bitacora (
    id_expediente_clinico_bitacora bigint NOT NULL,
    id_expediente integer NOT NULL,
    id_paciente integer NOT NULL,
    id_medico integer NOT NULL,
    id_diagnostico integer NOT NULL,
    id_estatus_expediente integer NOT NULL,
    fecha_consulta timestamp without time zone NOT NULL,
    motivo character varying(4000) NOT NULL,
    antecedentes_personales character varying(4000),
    antecedentes_familiares character varying(4000),
    presion_arterial character varying(20),
    frecuencia_cardiaca numeric(5,2),
    frecuencia_respiratoria numeric(5,2),
    temperatura numeric(4,1),
    saturacion_oxigeno numeric(5,2),
    peso numeric(6,2),
    talla_cintura numeric(6,2),
    altura numeric(6,2),
    observaciones character varying(4000),
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT expediente_clinico_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.expediente_clinico_bitacora OWNER TO postgres;

--
-- TOC entry 331 (class 1259 OID 17119)
-- Name: expediente_clinico_bitacora_id_expediente_clinico_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.expediente_clinico_bitacora ALTER COLUMN id_expediente_clinico_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.expediente_clinico_bitacora_id_expediente_clinico_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 271 (class 1259 OID 16736)
-- Name: expediente_clinico_id_expediente_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.expediente_clinico ALTER COLUMN id_expediente ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.expediente_clinico_id_expediente_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 255 (class 1259 OID 16565)
-- Name: medicamento; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.medicamento (
    id_medicamento integer NOT NULL,
    nombre character varying(100) NOT NULL,
    presentacion character varying(100),
    descripcion character varying(300)
);


ALTER TABLE digiclin.medicamento OWNER TO postgres;

--
-- TOC entry 300 (class 1259 OID 16964)
-- Name: medicamento_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.medicamento_bitacora (
    id_medicamento_bitacora bigint NOT NULL,
    id_medicamento integer NOT NULL,
    nombre character varying(100) NOT NULL,
    presentacion character varying(100),
    descripcion character varying(300),
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT medicamento_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.medicamento_bitacora OWNER TO postgres;

--
-- TOC entry 299 (class 1259 OID 16963)
-- Name: medicamento_bitacora_id_medicamento_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.medicamento_bitacora ALTER COLUMN id_medicamento_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.medicamento_bitacora_id_medicamento_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 254 (class 1259 OID 16564)
-- Name: medicamento_id_medicamento_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.medicamento ALTER COLUMN id_medicamento ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.medicamento_id_medicamento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 261 (class 1259 OID 16617)
-- Name: medico; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.medico (
    id_medico integer NOT NULL,
    id_especialidad integer NOT NULL
);


ALTER TABLE digiclin.medico OWNER TO postgres;

--
-- TOC entry 306 (class 1259 OID 16993)
-- Name: medico_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.medico_bitacora (
    id_medico_bitacora bigint NOT NULL,
    id_medico integer NOT NULL,
    id_especialidad integer NOT NULL,
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT medico_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.medico_bitacora OWNER TO postgres;

--
-- TOC entry 305 (class 1259 OID 16992)
-- Name: medico_bitacora_id_medico_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.medico_bitacora ALTER COLUMN id_medico_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.medico_bitacora_id_medico_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 267 (class 1259 OID 16696)
-- Name: paciente_alergia; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.paciente_alergia (
    id_paciente integer NOT NULL,
    id_alergia integer NOT NULL,
    observaciones character varying(300)
);


ALTER TABLE digiclin.paciente_alergia OWNER TO postgres;

--
-- TOC entry 324 (class 1259 OID 17080)
-- Name: paciente_alergia_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.paciente_alergia_bitacora (
    id_paciente_alergia_bitacora bigint NOT NULL,
    id_paciente integer NOT NULL,
    id_alergia integer NOT NULL,
    observaciones character varying(300),
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT paciente_alergia_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.paciente_alergia_bitacora OWNER TO postgres;

--
-- TOC entry 323 (class 1259 OID 17079)
-- Name: paciente_alergia_bitacora_id_paciente_alergia_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.paciente_alergia_bitacora ALTER COLUMN id_paciente_alergia_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.paciente_alergia_bitacora_id_paciente_alergia_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 318 (class 1259 OID 17049)
-- Name: paciente_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.paciente_bitacora (
    id_paciente_bitacora bigint NOT NULL,
    id_paciente integer NOT NULL,
    nombre_p character varying(60) NOT NULL,
    apellido_pat character varying(60) NOT NULL,
    apellido_mat character varying(60),
    fecha_nacimiento date NOT NULL,
    id_sexo integer NOT NULL,
    curp character varying(18) NOT NULL,
    domicilio character varying(200),
    id_estado_civil integer,
    correo character varying(100),
    ocupacion character varying(80),
    telefono character varying(20),
    contacto_emergencia character varying(100),
    id_tipo_sangre integer,
    fecha_registro timestamp without time zone NOT NULL,
    id_estatus_paciente integer NOT NULL,
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT paciente_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.paciente_bitacora OWNER TO postgres;

--
-- TOC entry 317 (class 1259 OID 17048)
-- Name: paciente_bitacora_id_paciente_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.paciente_bitacora ALTER COLUMN id_paciente_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.paciente_bitacora_id_paciente_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 268 (class 1259 OID 16711)
-- Name: paciente_enfermedad; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.paciente_enfermedad (
    id_paciente integer NOT NULL,
    id_enfermedad integer NOT NULL,
    observaciones character varying(300)
);


ALTER TABLE digiclin.paciente_enfermedad OWNER TO postgres;

--
-- TOC entry 320 (class 1259 OID 17060)
-- Name: paciente_enfermedad_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.paciente_enfermedad_bitacora (
    id_paciente_enfermedad_bitacora bigint NOT NULL,
    id_paciente integer NOT NULL,
    id_enfermedad integer NOT NULL,
    observaciones character varying(300),
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT paciente_enfermedad_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.paciente_enfermedad_bitacora OWNER TO postgres;

--
-- TOC entry 319 (class 1259 OID 17059)
-- Name: paciente_enfermedad_bitacora_id_paciente_enfermedad_bitacor_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.paciente_enfermedad_bitacora ALTER COLUMN id_paciente_enfermedad_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.paciente_enfermedad_bitacora_id_paciente_enfermedad_bitacor_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 265 (class 1259 OID 16670)
-- Name: paciente_id_paciente_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.paciente ALTER COLUMN id_paciente ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.paciente_id_paciente_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 260 (class 1259 OID 16605)
-- Name: personal_medico; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.personal_medico (
    id_personal_medico integer NOT NULL,
    cedula character varying(20) NOT NULL
);


ALTER TABLE digiclin.personal_medico OWNER TO postgres;

--
-- TOC entry 304 (class 1259 OID 16984)
-- Name: personal_medico_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.personal_medico_bitacora (
    id_personal_medico_bitacora bigint NOT NULL,
    id_personal_medico integer NOT NULL,
    cedula character varying(20) NOT NULL,
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT personal_medico_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.personal_medico_bitacora OWNER TO postgres;

--
-- TOC entry 303 (class 1259 OID 16983)
-- Name: personal_medico_bitacora_id_personal_medico_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.personal_medico_bitacora ALTER COLUMN id_personal_medico_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.personal_medico_bitacora_id_personal_medico_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 235 (class 1259 OID 16485)
-- Name: rol; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.rol (
    id_rol integer NOT NULL,
    nombre_rol character varying(50) NOT NULL,
    descripcion character varying(150)
);


ALTER TABLE digiclin.rol OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 16908)
-- Name: rol_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.rol_bitacora (
    id_rol_bitacora bigint NOT NULL,
    id_rol integer NOT NULL,
    nombre_rol character varying(50) NOT NULL,
    descripcion character varying(150),
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT rol_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.rol_bitacora OWNER TO postgres;

--
-- TOC entry 287 (class 1259 OID 16907)
-- Name: rol_bitacora_id_rol_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.rol_bitacora ALTER COLUMN id_rol_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.rol_bitacora_id_rol_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 234 (class 1259 OID 16484)
-- Name: rol_id_rol_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.rol ALTER COLUMN id_rol ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.rol_id_rol_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 290 (class 1259 OID 16917)
-- Name: sexo_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.sexo_bitacora (
    id_sexo_bitacora bigint NOT NULL,
    id_sexo integer NOT NULL,
    nombre character varying(10) NOT NULL,
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT sexo_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.sexo_bitacora OWNER TO postgres;

--
-- TOC entry 289 (class 1259 OID 16916)
-- Name: sexo_bitacora_id_sexo_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.sexo_bitacora ALTER COLUMN id_sexo_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.sexo_bitacora_id_sexo_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 242 (class 1259 OID 16516)
-- Name: sexo_id_sexo_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.sexo ALTER COLUMN id_sexo ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.sexo_id_sexo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 294 (class 1259 OID 16935)
-- Name: tipo_sangre_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.tipo_sangre_bitacora (
    id_tipo_sangre_bitacora bigint NOT NULL,
    id_tipo_sangre integer NOT NULL,
    tipo character varying(10) NOT NULL,
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT tipo_sangre_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.tipo_sangre_bitacora OWNER TO postgres;

--
-- TOC entry 293 (class 1259 OID 16934)
-- Name: tipo_sangre_bitacora_id_tipo_sangre_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.tipo_sangre_bitacora ALTER COLUMN id_tipo_sangre_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.tipo_sangre_bitacora_id_tipo_sangre_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 244 (class 1259 OID 16524)
-- Name: tipo_sangre_id_tipo_sangre_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.tipo_sangre ALTER COLUMN id_tipo_sangre ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.tipo_sangre_id_tipo_sangre_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 257 (class 1259 OID 16573)
-- Name: tipo_tratamiento; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.tipo_tratamiento (
    id_tipo_tratamiento integer NOT NULL,
    nombre character varying(80) NOT NULL,
    descripcion character varying(200)
);


ALTER TABLE digiclin.tipo_tratamiento OWNER TO postgres;

--
-- TOC entry 328 (class 1259 OID 17100)
-- Name: tipo_tratamiento_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.tipo_tratamiento_bitacora (
    id_tipo_tratamiento_bitacora bigint NOT NULL,
    id_tipo_tratamiento integer NOT NULL,
    nombre character varying(80) NOT NULL,
    descripcion character varying(200),
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT tipo_tratamiento_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.tipo_tratamiento_bitacora OWNER TO postgres;

--
-- TOC entry 327 (class 1259 OID 17099)
-- Name: tipo_tratamiento_bitacora_id_tipo_tratamiento_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.tipo_tratamiento_bitacora ALTER COLUMN id_tipo_tratamiento_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.tipo_tratamiento_bitacora_id_tipo_tratamiento_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 256 (class 1259 OID 16572)
-- Name: tipo_tratamiento_id_tipo_tratamiento_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.tipo_tratamiento ALTER COLUMN id_tipo_tratamiento ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.tipo_tratamiento_id_tipo_tratamiento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 274 (class 1259 OID 16772)
-- Name: tratamiento; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.tratamiento (
    id_tratamiento integer NOT NULL,
    id_expediente integer NOT NULL,
    id_tipo_tratamiento integer NOT NULL,
    id_medicamento integer,
    indicacion character varying(4000),
    dosis character varying(100),
    frecuencia character varying(100),
    duracion character varying(100),
    observaciones character varying(1000)
);


ALTER TABLE digiclin.tratamiento OWNER TO postgres;

--
-- TOC entry 326 (class 1259 OID 17089)
-- Name: tratamiento_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.tratamiento_bitacora (
    id_tratamiento_bitacora bigint NOT NULL,
    id_tratamiento integer NOT NULL,
    id_expediente integer NOT NULL,
    id_tipo_tratamiento integer NOT NULL,
    id_medicamento integer,
    indicacion character varying(4000),
    dosis character varying(100),
    frecuencia character varying(100),
    duracion character varying(100),
    observaciones character varying(1000),
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT tratamiento_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.tratamiento_bitacora OWNER TO postgres;

--
-- TOC entry 325 (class 1259 OID 17088)
-- Name: tratamiento_bitacora_id_tratamiento_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.tratamiento_bitacora ALTER COLUMN id_tratamiento_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.tratamiento_bitacora_id_tratamiento_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 273 (class 1259 OID 16771)
-- Name: tratamiento_id_tratamiento_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.tratamiento ALTER COLUMN id_tratamiento ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.tratamiento_id_tratamiento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 330 (class 1259 OID 17109)
-- Name: usuario_bitacora; Type: TABLE; Schema: digiclin; Owner: postgres
--

CREATE TABLE digiclin.usuario_bitacora (
    id_usuario_bitacora bigint NOT NULL,
    id_usuario integer NOT NULL,
    id_rol integer NOT NULL,
    id_estatus_usuario integer NOT NULL,
    nombre_usuario character varying(50) NOT NULL,
    correo character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    debe_cambiar_password boolean NOT NULL,
    fecha_creacion timestamp without time zone NOT NULL,
    accion_bitacora character(1) NOT NULL,
    usuario_bitacora character varying(100) DEFAULT CURRENT_USER NOT NULL,
    fecha_bitacora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT usuario_bitacora_accion_bitacora_check CHECK ((accion_bitacora = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar])))
);


ALTER TABLE digiclin.usuario_bitacora OWNER TO postgres;

--
-- TOC entry 329 (class 1259 OID 17108)
-- Name: usuario_bitacora_id_usuario_bitacora_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.usuario_bitacora ALTER COLUMN id_usuario_bitacora ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.usuario_bitacora_id_usuario_bitacora_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 258 (class 1259 OID 16583)
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: digiclin; Owner: postgres
--

ALTER TABLE digiclin.usuario ALTER COLUMN id_usuario ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME digiclin.usuario_id_usuario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 340 (class 1259 OID 17246)
-- Name: vw_expediente; Type: VIEW; Schema: digiclin; Owner: postgres
--

CREATE VIEW digiclin.vw_expediente AS
 SELECT id_expediente,
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
    observaciones,
    id_paciente,
    nombre_paciente,
    curp,
    telefono_paciente,
    correo_paciente,
    id_medico,
    nombre_medico,
    id_diagnostico,
    codigo_cie,
    diagnostico,
    descripcion_diagnostico,
    id_estatus_expediente,
    estatus_expediente
   FROM digiclin.vw_expedientes;


ALTER VIEW digiclin.vw_expediente OWNER TO postgres;

--
-- TOC entry 338 (class 1259 OID 17236)
-- Name: vw_expedientes_abiertos; Type: VIEW; Schema: digiclin; Owner: postgres
--

CREATE VIEW digiclin.vw_expedientes_abiertos AS
 SELECT id_expediente,
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
    observaciones,
    id_paciente,
    nombre_paciente,
    curp,
    telefono_paciente,
    correo_paciente,
    id_medico,
    nombre_medico,
    id_diagnostico,
    codigo_cie,
    diagnostico,
    descripcion_diagnostico,
    id_estatus_expediente,
    estatus_expediente
   FROM digiclin.vw_expedientes
  WHERE ((estatus_expediente)::text = 'Abierto'::text);


ALTER VIEW digiclin.vw_expedientes_abiertos OWNER TO postgres;

--
-- TOC entry 339 (class 1259 OID 17241)
-- Name: vw_expedientes_archivados; Type: VIEW; Schema: digiclin; Owner: postgres
--

CREATE VIEW digiclin.vw_expedientes_archivados AS
 SELECT id_expediente,
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
    observaciones,
    id_paciente,
    nombre_paciente,
    curp,
    telefono_paciente,
    correo_paciente,
    id_medico,
    nombre_medico,
    id_diagnostico,
    codigo_cie,
    diagnostico,
    descripcion_diagnostico,
    id_estatus_expediente,
    estatus_expediente
   FROM digiclin.vw_expedientes
  WHERE ((estatus_expediente)::text = 'Archivado'::text);


ALTER VIEW digiclin.vw_expedientes_archivados OWNER TO postgres;

--
-- TOC entry 279 (class 1259 OID 16854)
-- Name: vw_expedientes_detalle; Type: VIEW; Schema: digiclin; Owner: postgres
--

CREATE VIEW digiclin.vw_expedientes_detalle AS
 SELECT e.id_expediente,
    p.id_paciente,
    (((((p.nombre_p)::text || ' '::text) || (p.apellido_pat)::text) || ' '::text) || (COALESCE(p.apellido_mat, ''::character varying))::text) AS paciente,
    u.nombre_usuario AS medico,
    d.codigo_cie,
    d.nombre AS diagnostico,
    ee.nombre_estatus,
    e.fecha_consulta,
    e.motivo,
    e.observaciones
   FROM ((((digiclin.expediente_clinico e
     JOIN digiclin.paciente p ON ((e.id_paciente = p.id_paciente)))
     JOIN digiclin.usuario u ON ((e.id_medico = u.id_usuario)))
     JOIN digiclin.diagnostico d ON ((e.id_diagnostico = d.id_diagnostico)))
     JOIN digiclin.estatus_expediente ee ON ((e.id_estatus_expediente = ee.id_estatus_expediente)));


ALTER VIEW digiclin.vw_expedientes_detalle OWNER TO postgres;

--
-- TOC entry 286 (class 1259 OID 16902)
-- Name: vw_paciente_administrativo; Type: VIEW; Schema: digiclin; Owner: postgres
--

CREATE VIEW digiclin.vw_paciente_administrativo AS
 SELECT p.id_paciente,
    p.nombre_p,
    p.apellido_pat,
    p.apellido_mat,
    concat_ws(' '::text, p.nombre_p, p.apellido_pat, p.apellido_mat) AS nombre_completo,
    p.curp,
    p.fecha_nacimiento,
    (EXTRACT(year FROM age((CURRENT_DATE)::timestamp with time zone, (p.fecha_nacimiento)::timestamp with time zone)))::integer AS edad,
    p.telefono,
    p.correo,
    ep.id_estatus_paciente,
    ep.nombre_estatus,
    p.fecha_registro
   FROM (digiclin.paciente p
     JOIN digiclin.estatus_paciente ep ON ((p.id_estatus_paciente = ep.id_estatus_paciente)));


ALTER VIEW digiclin.vw_paciente_administrativo OWNER TO postgres;

--
-- TOC entry 284 (class 1259 OID 16892)
-- Name: vw_paciente_completo; Type: VIEW; Schema: digiclin; Owner: postgres
--

CREATE VIEW digiclin.vw_paciente_completo AS
 SELECT p.id_paciente,
    p.nombre_p,
    p.apellido_pat,
    p.apellido_mat,
    concat_ws(' '::text, p.nombre_p, p.apellido_pat, p.apellido_mat) AS nombre_completo,
    p.fecha_nacimiento,
    (EXTRACT(year FROM age((CURRENT_DATE)::timestamp with time zone, (p.fecha_nacimiento)::timestamp with time zone)))::integer AS edad,
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
   FROM ((((digiclin.paciente p
     JOIN digiclin.sexo s ON ((p.id_sexo = s.id_sexo)))
     LEFT JOIN digiclin.estado_civil ec ON ((p.id_estado_civil = ec.id_estado_civil)))
     LEFT JOIN digiclin.tipo_sangre ts ON ((p.id_tipo_sangre = ts.id_tipo_sangre)))
     JOIN digiclin.estatus_paciente ep ON ((p.id_estatus_paciente = ep.id_estatus_paciente)));


ALTER VIEW digiclin.vw_paciente_completo OWNER TO postgres;

--
-- TOC entry 285 (class 1259 OID 16897)
-- Name: vw_paciente_enfermero; Type: VIEW; Schema: digiclin; Owner: postgres
--

CREATE VIEW digiclin.vw_paciente_enfermero AS
 SELECT p.id_paciente,
    p.nombre_p,
    p.apellido_pat,
    p.apellido_mat,
    concat_ws(' '::text, p.nombre_p, p.apellido_pat, p.apellido_mat) AS nombre_completo,
    p.fecha_nacimiento,
    (EXTRACT(year FROM age((CURRENT_DATE)::timestamp with time zone, (p.fecha_nacimiento)::timestamp with time zone)))::integer AS edad,
    s.id_sexo,
    s.nombre AS nombre_sexo,
    p.curp,
    p.telefono,
    p.contacto_emergencia,
    ts.id_tipo_sangre,
    ts.tipo AS nombre_tipo_sangre,
    ep.id_estatus_paciente,
    ep.nombre_estatus
   FROM (((digiclin.paciente p
     JOIN digiclin.sexo s ON ((p.id_sexo = s.id_sexo)))
     LEFT JOIN digiclin.tipo_sangre ts ON ((p.id_tipo_sangre = ts.id_tipo_sangre)))
     JOIN digiclin.estatus_paciente ep ON ((p.id_estatus_paciente = ep.id_estatus_paciente)));


ALTER VIEW digiclin.vw_paciente_enfermero OWNER TO postgres;

--
-- TOC entry 341 (class 1259 OID 17254)
-- Name: vw_paciente_identificador; Type: VIEW; Schema: digiclin; Owner: postgres
--

CREATE VIEW digiclin.vw_paciente_identificador AS
 SELECT id_paciente,
    concat_ws(' '::text, nombre_p, apellido_pat, apellido_mat) AS nombre_completo,
    upper(TRIM(BOTH FROM curp)) AS curp
   FROM digiclin.paciente;


ALTER VIEW digiclin.vw_paciente_identificador OWNER TO postgres;

--
-- TOC entry 278 (class 1259 OID 16849)
-- Name: vw_pacientes_detalle; Type: VIEW; Schema: digiclin; Owner: postgres
--

CREATE VIEW digiclin.vw_pacientes_detalle AS
 SELECT p.id_paciente,
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
   FROM (((digiclin.paciente p
     JOIN digiclin.sexo s ON ((p.id_sexo = s.id_sexo)))
     LEFT JOIN digiclin.estado_civil ec ON ((p.id_estado_civil = ec.id_estado_civil)))
     LEFT JOIN digiclin.tipo_sangre ts ON ((p.id_tipo_sangre = ts.id_tipo_sangre)));


ALTER VIEW digiclin.vw_pacientes_detalle OWNER TO postgres;

--
-- TOC entry 276 (class 1259 OID 16818)
-- Name: vw_usuario; Type: VIEW; Schema: digiclin; Owner: postgres
--

CREATE VIEW digiclin.vw_usuario AS
 SELECT u.nombre_usuario,
    u.correo,
    u.debe_cambiar_password,
    u.fecha_creacion,
    r.nombre_rol,
    eu.nombre_estatus
   FROM ((digiclin.usuario u
     JOIN digiclin.rol r ON ((u.id_rol = r.id_rol)))
     JOIN digiclin.estatus_usuario eu ON ((u.id_estatus_usuario = eu.id_estatus_usuario)));


ALTER VIEW digiclin.vw_usuario OWNER TO postgres;

--
-- TOC entry 277 (class 1259 OID 16839)
-- Name: vw_usuario_delete; Type: VIEW; Schema: digiclin; Owner: digiclin_app
--

CREATE VIEW digiclin.vw_usuario_delete AS
 SELECT u.nombre_usuario,
    u.correo,
    r.nombre_rol
   FROM (digiclin.usuario u
     JOIN digiclin.rol r ON ((u.id_rol = r.id_rol)));


ALTER VIEW digiclin.vw_usuario_delete OWNER TO digiclin_app;

--
-- TOC entry 342 (class 1259 OID 17266)
-- Name: vw_usuario_login; Type: VIEW; Schema: digiclin; Owner: postgres
--

CREATE VIEW digiclin.vw_usuario_login AS
 SELECT u.id_usuario,
    u.nombre_usuario,
    u.correo,
    u.password_hash,
    u.debe_cambiar_password,
    r.nombre_rol,
    eu.nombre_estatus
   FROM ((digiclin.usuario u
     JOIN digiclin.rol r ON ((u.id_rol = r.id_rol)))
     JOIN digiclin.estatus_usuario eu ON ((u.id_estatus_usuario = eu.id_estatus_usuario)));


ALTER VIEW digiclin.vw_usuario_login OWNER TO postgres;

--
-- TOC entry 275 (class 1259 OID 16813)
-- Name: vw_usuarios_activos; Type: VIEW; Schema: digiclin; Owner: postgres
--

CREATE VIEW digiclin.vw_usuarios_activos AS
 SELECT u.nombre_usuario,
    u.correo,
    u.debe_cambiar_password,
    u.fecha_creacion,
    r.nombre_rol,
    eu.nombre_estatus
   FROM ((digiclin.usuario u
     JOIN digiclin.rol r ON ((u.id_rol = r.id_rol)))
     JOIN digiclin.estatus_usuario eu ON ((u.id_estatus_usuario = eu.id_estatus_usuario)))
  WHERE ((eu.nombre_estatus)::text = 'Activo'::text);


ALTER VIEW digiclin.vw_usuarios_activos OWNER TO postgres;

--
-- TOC entry 283 (class 1259 OID 16884)
-- Name: vw_usuarios_inactivos; Type: VIEW; Schema: digiclin; Owner: postgres
--

CREATE VIEW digiclin.vw_usuarios_inactivos AS
 SELECT nombre_usuario,
    correo,
    debe_cambiar_password,
    fecha_creacion,
    nombre_rol,
    nombre_estatus
   FROM digiclin.vw_usuario
  WHERE (lower((nombre_estatus)::text) = lower('Inactivo'::text));


ALTER VIEW digiclin.vw_usuarios_inactivos OWNER TO postgres;

--
-- TOC entry 4673 (class 2606 OID 16953)
-- Name: alergia_bitacora alergia_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.alergia_bitacora
    ADD CONSTRAINT alergia_bitacora_pkey PRIMARY KEY (id_alergia_bitacora);


--
-- TOC entry 4607 (class 2606 OID 16547)
-- Name: alergia alergia_nombre_key; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.alergia
    ADD CONSTRAINT alergia_nombre_key UNIQUE (nombre);


--
-- TOC entry 4609 (class 2606 OID 16545)
-- Name: alergia alergia_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.alergia
    ADD CONSTRAINT alergia_pkey PRIMARY KEY (id_alergia);


--
-- TOC entry 4691 (class 2606 OID 17038)
-- Name: certificacion_bitacora certificacion_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.certificacion_bitacora
    ADD CONSTRAINT certificacion_bitacora_pkey PRIMARY KEY (id_certificacion_bitacora);


--
-- TOC entry 4615 (class 2606 OID 16563)
-- Name: certificacion certificacion_nombre_key; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.certificacion
    ADD CONSTRAINT certificacion_nombre_key UNIQUE (nombre);


--
-- TOC entry 4617 (class 2606 OID 16561)
-- Name: certificacion certificacion_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.certificacion
    ADD CONSTRAINT certificacion_pkey PRIMARY KEY (id_certificacion);


--
-- TOC entry 4711 (class 2606 OID 17140)
-- Name: diagnostico_bitacora diagnostico_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.diagnostico_bitacora
    ADD CONSTRAINT diagnostico_bitacora_pkey PRIMARY KEY (id_diagnostico_bitacora);


--
-- TOC entry 4653 (class 2606 OID 16735)
-- Name: diagnostico diagnostico_codigo_cie_key; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.diagnostico
    ADD CONSTRAINT diagnostico_codigo_cie_key UNIQUE (codigo_cie);


--
-- TOC entry 4655 (class 2606 OID 16733)
-- Name: diagnostico diagnostico_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.diagnostico
    ADD CONSTRAINT diagnostico_pkey PRIMARY KEY (id_diagnostico);


--
-- TOC entry 4693 (class 2606 OID 17047)
-- Name: director_bitacora director_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.director_bitacora
    ADD CONSTRAINT director_bitacora_pkey PRIMARY KEY (id_director_bitacora);


--
-- TOC entry 4641 (class 2606 OID 16662)
-- Name: director director_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.director
    ADD CONSTRAINT director_pkey PRIMARY KEY (id_director);


--
-- TOC entry 4643 (class 2606 OID 16664)
-- Name: director director_plaza_key; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.director
    ADD CONSTRAINT director_plaza_key UNIQUE (plaza);


--
-- TOC entry 4699 (class 2606 OID 17078)
-- Name: enfermedad_cronica_bitacora enfermedad_cronica_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.enfermedad_cronica_bitacora
    ADD CONSTRAINT enfermedad_cronica_bitacora_pkey PRIMARY KEY (id_enfermedad_cronica_bitacora);


--
-- TOC entry 4611 (class 2606 OID 16555)
-- Name: enfermedad_cronica enfermedad_cronica_nombre_key; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.enfermedad_cronica
    ADD CONSTRAINT enfermedad_cronica_nombre_key UNIQUE (nombre);


--
-- TOC entry 4613 (class 2606 OID 16553)
-- Name: enfermedad_cronica enfermedad_cronica_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.enfermedad_cronica
    ADD CONSTRAINT enfermedad_cronica_pkey PRIMARY KEY (id_enfermedad);


--
-- TOC entry 4687 (class 2606 OID 17018)
-- Name: enfermero_bitacora enfermero_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.enfermero_bitacora
    ADD CONSTRAINT enfermero_bitacora_pkey PRIMARY KEY (id_enfermero_bitacora);


--
-- TOC entry 4689 (class 2606 OID 17027)
-- Name: enfermero_certificacion_bitacora enfermero_certificacion_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.enfermero_certificacion_bitacora
    ADD CONSTRAINT enfermero_certificacion_bitacora_pkey PRIMARY KEY (id_enfermero_certificacion_bitacora);


--
-- TOC entry 4637 (class 2606 OID 16636)
-- Name: enfermero enfermero_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.enfermero
    ADD CONSTRAINT enfermero_pkey PRIMARY KEY (id_enfermero);


--
-- TOC entry 4685 (class 2606 OID 17009)
-- Name: especialidad_bitacora especialidad_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.especialidad_bitacora
    ADD CONSTRAINT especialidad_bitacora_pkey PRIMARY KEY (id_especialidad_bitacora);


--
-- TOC entry 4591 (class 2606 OID 16515)
-- Name: especialidad especialidad_nombre_key; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.especialidad
    ADD CONSTRAINT especialidad_nombre_key UNIQUE (nombre);


--
-- TOC entry 4593 (class 2606 OID 16513)
-- Name: especialidad especialidad_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.especialidad
    ADD CONSTRAINT especialidad_pkey PRIMARY KEY (id_especialidad);


--
-- TOC entry 4669 (class 2606 OID 16933)
-- Name: estado_civil_bitacora estado_civil_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.estado_civil_bitacora
    ADD CONSTRAINT estado_civil_bitacora_pkey PRIMARY KEY (id_estado_civil_bitacora);


--
-- TOC entry 4603 (class 2606 OID 16539)
-- Name: estado_civil estado_civil_nombre_key; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.estado_civil
    ADD CONSTRAINT estado_civil_nombre_key UNIQUE (nombre);


--
-- TOC entry 4605 (class 2606 OID 16537)
-- Name: estado_civil estado_civil_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.estado_civil
    ADD CONSTRAINT estado_civil_pkey PRIMARY KEY (id_estado_civil);


--
-- TOC entry 4675 (class 2606 OID 16962)
-- Name: estatus_expediente_bitacora estatus_expediente_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.estatus_expediente_bitacora
    ADD CONSTRAINT estatus_expediente_bitacora_pkey PRIMARY KEY (id_estatus_expediente_bitacora);


--
-- TOC entry 4587 (class 2606 OID 16507)
-- Name: estatus_expediente estatus_expediente_nombre_estatus_key; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.estatus_expediente
    ADD CONSTRAINT estatus_expediente_nombre_estatus_key UNIQUE (nombre_estatus);


--
-- TOC entry 4589 (class 2606 OID 16505)
-- Name: estatus_expediente estatus_expediente_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.estatus_expediente
    ADD CONSTRAINT estatus_expediente_pkey PRIMARY KEY (id_estatus_expediente);


--
-- TOC entry 4713 (class 2606 OID 17149)
-- Name: estatus_paciente_bitacora estatus_paciente_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.estatus_paciente_bitacora
    ADD CONSTRAINT estatus_paciente_bitacora_pkey PRIMARY KEY (id_estatus_paciente_bitacora);


--
-- TOC entry 4661 (class 2606 OID 16868)
-- Name: estatus_paciente estatus_paciente_nombre_estatus_key; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.estatus_paciente
    ADD CONSTRAINT estatus_paciente_nombre_estatus_key UNIQUE (nombre_estatus);


--
-- TOC entry 4663 (class 2606 OID 16866)
-- Name: estatus_paciente estatus_paciente_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.estatus_paciente
    ADD CONSTRAINT estatus_paciente_pkey PRIMARY KEY (id_estatus_paciente);


--
-- TOC entry 4679 (class 2606 OID 16982)
-- Name: estatus_usuario_bitacora estatus_usuario_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.estatus_usuario_bitacora
    ADD CONSTRAINT estatus_usuario_bitacora_pkey PRIMARY KEY (id_estatus_usuario_bitacora);


--
-- TOC entry 4583 (class 2606 OID 16499)
-- Name: estatus_usuario estatus_usuario_nombre_estatus_key; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.estatus_usuario
    ADD CONSTRAINT estatus_usuario_nombre_estatus_key UNIQUE (nombre_estatus);


--
-- TOC entry 4585 (class 2606 OID 16497)
-- Name: estatus_usuario estatus_usuario_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.estatus_usuario
    ADD CONSTRAINT estatus_usuario_pkey PRIMARY KEY (id_estatus_usuario);


--
-- TOC entry 4709 (class 2606 OID 17129)
-- Name: expediente_clinico_bitacora expediente_clinico_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.expediente_clinico_bitacora
    ADD CONSTRAINT expediente_clinico_bitacora_pkey PRIMARY KEY (id_expediente_clinico_bitacora);


--
-- TOC entry 4657 (class 2606 OID 16750)
-- Name: expediente_clinico expediente_clinico_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.expediente_clinico
    ADD CONSTRAINT expediente_clinico_pkey PRIMARY KEY (id_expediente);


--
-- TOC entry 4677 (class 2606 OID 16973)
-- Name: medicamento_bitacora medicamento_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.medicamento_bitacora
    ADD CONSTRAINT medicamento_bitacora_pkey PRIMARY KEY (id_medicamento_bitacora);


--
-- TOC entry 4619 (class 2606 OID 16571)
-- Name: medicamento medicamento_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.medicamento
    ADD CONSTRAINT medicamento_pkey PRIMARY KEY (id_medicamento);


--
-- TOC entry 4683 (class 2606 OID 17000)
-- Name: medico_bitacora medico_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.medico_bitacora
    ADD CONSTRAINT medico_bitacora_pkey PRIMARY KEY (id_medico_bitacora);


--
-- TOC entry 4635 (class 2606 OID 16621)
-- Name: medico medico_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.medico
    ADD CONSTRAINT medico_pkey PRIMARY KEY (id_medico);


--
-- TOC entry 4701 (class 2606 OID 17087)
-- Name: paciente_alergia_bitacora paciente_alergia_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.paciente_alergia_bitacora
    ADD CONSTRAINT paciente_alergia_bitacora_pkey PRIMARY KEY (id_paciente_alergia_bitacora);


--
-- TOC entry 4695 (class 2606 OID 17058)
-- Name: paciente_bitacora paciente_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.paciente_bitacora
    ADD CONSTRAINT paciente_bitacora_pkey PRIMARY KEY (id_paciente_bitacora);


--
-- TOC entry 4645 (class 2606 OID 16680)
-- Name: paciente paciente_curp_key; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.paciente
    ADD CONSTRAINT paciente_curp_key UNIQUE (curp);


--
-- TOC entry 4697 (class 2606 OID 17067)
-- Name: paciente_enfermedad_bitacora paciente_enfermedad_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.paciente_enfermedad_bitacora
    ADD CONSTRAINT paciente_enfermedad_bitacora_pkey PRIMARY KEY (id_paciente_enfermedad_bitacora);


--
-- TOC entry 4647 (class 2606 OID 16678)
-- Name: paciente paciente_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.paciente
    ADD CONSTRAINT paciente_pkey PRIMARY KEY (id_paciente);


--
-- TOC entry 4681 (class 2606 OID 16991)
-- Name: personal_medico_bitacora personal_medico_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.personal_medico_bitacora
    ADD CONSTRAINT personal_medico_bitacora_pkey PRIMARY KEY (id_personal_medico_bitacora);


--
-- TOC entry 4631 (class 2606 OID 16611)
-- Name: personal_medico personal_medico_cedula_key; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.personal_medico
    ADD CONSTRAINT personal_medico_cedula_key UNIQUE (cedula);


--
-- TOC entry 4633 (class 2606 OID 16609)
-- Name: personal_medico personal_medico_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.personal_medico
    ADD CONSTRAINT personal_medico_pkey PRIMARY KEY (id_personal_medico);


--
-- TOC entry 4639 (class 2606 OID 16647)
-- Name: enfermero_certificacion pk_enfermero_certificacion; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.enfermero_certificacion
    ADD CONSTRAINT pk_enfermero_certificacion PRIMARY KEY (id_enfermero, id_certificacion);


--
-- TOC entry 4649 (class 2606 OID 16700)
-- Name: paciente_alergia pk_paciente_alergia; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.paciente_alergia
    ADD CONSTRAINT pk_paciente_alergia PRIMARY KEY (id_paciente, id_alergia);


--
-- TOC entry 4651 (class 2606 OID 16715)
-- Name: paciente_enfermedad pk_paciente_enfermedad; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.paciente_enfermedad
    ADD CONSTRAINT pk_paciente_enfermedad PRIMARY KEY (id_paciente, id_enfermedad);


--
-- TOC entry 4665 (class 2606 OID 16915)
-- Name: rol_bitacora rol_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.rol_bitacora
    ADD CONSTRAINT rol_bitacora_pkey PRIMARY KEY (id_rol_bitacora);


--
-- TOC entry 4579 (class 2606 OID 16491)
-- Name: rol rol_nombre_rol_key; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.rol
    ADD CONSTRAINT rol_nombre_rol_key UNIQUE (nombre_rol);


--
-- TOC entry 4581 (class 2606 OID 16489)
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id_rol);


--
-- TOC entry 4667 (class 2606 OID 16924)
-- Name: sexo_bitacora sexo_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.sexo_bitacora
    ADD CONSTRAINT sexo_bitacora_pkey PRIMARY KEY (id_sexo_bitacora);


--
-- TOC entry 4595 (class 2606 OID 16523)
-- Name: sexo sexo_nombre_key; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.sexo
    ADD CONSTRAINT sexo_nombre_key UNIQUE (nombre);


--
-- TOC entry 4597 (class 2606 OID 16521)
-- Name: sexo sexo_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.sexo
    ADD CONSTRAINT sexo_pkey PRIMARY KEY (id_sexo);


--
-- TOC entry 4671 (class 2606 OID 16942)
-- Name: tipo_sangre_bitacora tipo_sangre_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.tipo_sangre_bitacora
    ADD CONSTRAINT tipo_sangre_bitacora_pkey PRIMARY KEY (id_tipo_sangre_bitacora);


--
-- TOC entry 4599 (class 2606 OID 16529)
-- Name: tipo_sangre tipo_sangre_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.tipo_sangre
    ADD CONSTRAINT tipo_sangre_pkey PRIMARY KEY (id_tipo_sangre);


--
-- TOC entry 4601 (class 2606 OID 16531)
-- Name: tipo_sangre tipo_sangre_tipo_key; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.tipo_sangre
    ADD CONSTRAINT tipo_sangre_tipo_key UNIQUE (tipo);


--
-- TOC entry 4705 (class 2606 OID 17107)
-- Name: tipo_tratamiento_bitacora tipo_tratamiento_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.tipo_tratamiento_bitacora
    ADD CONSTRAINT tipo_tratamiento_bitacora_pkey PRIMARY KEY (id_tipo_tratamiento_bitacora);


--
-- TOC entry 4621 (class 2606 OID 16579)
-- Name: tipo_tratamiento tipo_tratamiento_nombre_key; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.tipo_tratamiento
    ADD CONSTRAINT tipo_tratamiento_nombre_key UNIQUE (nombre);


--
-- TOC entry 4623 (class 2606 OID 16577)
-- Name: tipo_tratamiento tipo_tratamiento_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.tipo_tratamiento
    ADD CONSTRAINT tipo_tratamiento_pkey PRIMARY KEY (id_tipo_tratamiento);


--
-- TOC entry 4703 (class 2606 OID 17098)
-- Name: tratamiento_bitacora tratamiento_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.tratamiento_bitacora
    ADD CONSTRAINT tratamiento_bitacora_pkey PRIMARY KEY (id_tratamiento_bitacora);


--
-- TOC entry 4659 (class 2606 OID 16778)
-- Name: tratamiento tratamiento_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.tratamiento
    ADD CONSTRAINT tratamiento_pkey PRIMARY KEY (id_tratamiento);


--
-- TOC entry 4707 (class 2606 OID 17118)
-- Name: usuario_bitacora usuario_bitacora_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.usuario_bitacora
    ADD CONSTRAINT usuario_bitacora_pkey PRIMARY KEY (id_usuario_bitacora);


--
-- TOC entry 4625 (class 2606 OID 16594)
-- Name: usuario usuario_correo_key; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.usuario
    ADD CONSTRAINT usuario_correo_key UNIQUE (correo);


--
-- TOC entry 4627 (class 2606 OID 16592)
-- Name: usuario usuario_nombre_usuario_key; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.usuario
    ADD CONSTRAINT usuario_nombre_usuario_key UNIQUE (nombre_usuario);


--
-- TOC entry 4629 (class 2606 OID 16590)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4759 (class 2620 OID 17163)
-- Name: alergia trg_alergia_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_alergia_ai AFTER INSERT ON digiclin.alergia FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4760 (class 2620 OID 17164)
-- Name: alergia trg_alergia_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_alergia_au AFTER UPDATE ON digiclin.alergia FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4761 (class 2620 OID 17165)
-- Name: alergia trg_alergia_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_alergia_bd BEFORE DELETE ON digiclin.alergia FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4765 (class 2620 OID 17190)
-- Name: certificacion trg_certificacion_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_certificacion_ai AFTER INSERT ON digiclin.certificacion FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4766 (class 2620 OID 17191)
-- Name: certificacion trg_certificacion_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_certificacion_au AFTER UPDATE ON digiclin.certificacion FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4767 (class 2620 OID 17192)
-- Name: certificacion trg_certificacion_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_certificacion_bd BEFORE DELETE ON digiclin.certificacion FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4801 (class 2620 OID 17220)
-- Name: diagnostico trg_diagnostico_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_diagnostico_ai AFTER INSERT ON digiclin.diagnostico FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4802 (class 2620 OID 17221)
-- Name: diagnostico trg_diagnostico_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_diagnostico_au AFTER UPDATE ON digiclin.diagnostico FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4803 (class 2620 OID 17222)
-- Name: diagnostico trg_diagnostico_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_diagnostico_bd BEFORE DELETE ON digiclin.diagnostico FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4789 (class 2620 OID 17193)
-- Name: director trg_director_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_director_ai AFTER INSERT ON digiclin.director FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4790 (class 2620 OID 17194)
-- Name: director trg_director_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_director_au AFTER UPDATE ON digiclin.director FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4791 (class 2620 OID 17195)
-- Name: director trg_director_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_director_bd BEFORE DELETE ON digiclin.director FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4762 (class 2620 OID 17202)
-- Name: enfermedad_cronica trg_enfermedad_cronica_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_enfermedad_cronica_ai AFTER INSERT ON digiclin.enfermedad_cronica FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4763 (class 2620 OID 17203)
-- Name: enfermedad_cronica trg_enfermedad_cronica_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_enfermedad_cronica_au AFTER UPDATE ON digiclin.enfermedad_cronica FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4764 (class 2620 OID 17204)
-- Name: enfermedad_cronica trg_enfermedad_cronica_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_enfermedad_cronica_bd BEFORE DELETE ON digiclin.enfermedad_cronica FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4783 (class 2620 OID 17184)
-- Name: enfermero trg_enfermero_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_enfermero_ai AFTER INSERT ON digiclin.enfermero FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4784 (class 2620 OID 17185)
-- Name: enfermero trg_enfermero_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_enfermero_au AFTER UPDATE ON digiclin.enfermero FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4785 (class 2620 OID 17186)
-- Name: enfermero trg_enfermero_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_enfermero_bd BEFORE DELETE ON digiclin.enfermero FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4786 (class 2620 OID 17187)
-- Name: enfermero_certificacion trg_enfermero_certificacion_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_enfermero_certificacion_ai AFTER INSERT ON digiclin.enfermero_certificacion FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4787 (class 2620 OID 17188)
-- Name: enfermero_certificacion trg_enfermero_certificacion_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_enfermero_certificacion_au AFTER UPDATE ON digiclin.enfermero_certificacion FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4788 (class 2620 OID 17189)
-- Name: enfermero_certificacion trg_enfermero_certificacion_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_enfermero_certificacion_bd BEFORE DELETE ON digiclin.enfermero_certificacion FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4747 (class 2620 OID 17181)
-- Name: especialidad trg_especialidad_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_especialidad_ai AFTER INSERT ON digiclin.especialidad FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4748 (class 2620 OID 17182)
-- Name: especialidad trg_especialidad_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_especialidad_au AFTER UPDATE ON digiclin.especialidad FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4749 (class 2620 OID 17183)
-- Name: especialidad trg_especialidad_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_especialidad_bd BEFORE DELETE ON digiclin.especialidad FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4756 (class 2620 OID 17157)
-- Name: estado_civil trg_estado_civil_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_estado_civil_ai AFTER INSERT ON digiclin.estado_civil FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4757 (class 2620 OID 17158)
-- Name: estado_civil trg_estado_civil_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_estado_civil_au AFTER UPDATE ON digiclin.estado_civil FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4758 (class 2620 OID 17159)
-- Name: estado_civil trg_estado_civil_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_estado_civil_bd BEFORE DELETE ON digiclin.estado_civil FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4744 (class 2620 OID 17166)
-- Name: estatus_expediente trg_estatus_expediente_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_estatus_expediente_ai AFTER INSERT ON digiclin.estatus_expediente FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4745 (class 2620 OID 17167)
-- Name: estatus_expediente trg_estatus_expediente_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_estatus_expediente_au AFTER UPDATE ON digiclin.estatus_expediente FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4746 (class 2620 OID 17168)
-- Name: estatus_expediente trg_estatus_expediente_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_estatus_expediente_bd BEFORE DELETE ON digiclin.estatus_expediente FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4810 (class 2620 OID 17223)
-- Name: estatus_paciente trg_estatus_paciente_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_estatus_paciente_ai AFTER INSERT ON digiclin.estatus_paciente FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4811 (class 2620 OID 17224)
-- Name: estatus_paciente trg_estatus_paciente_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_estatus_paciente_au AFTER UPDATE ON digiclin.estatus_paciente FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4812 (class 2620 OID 17225)
-- Name: estatus_paciente trg_estatus_paciente_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_estatus_paciente_bd BEFORE DELETE ON digiclin.estatus_paciente FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4741 (class 2620 OID 17172)
-- Name: estatus_usuario trg_estatus_usuario_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_estatus_usuario_ai AFTER INSERT ON digiclin.estatus_usuario FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4742 (class 2620 OID 17173)
-- Name: estatus_usuario trg_estatus_usuario_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_estatus_usuario_au AFTER UPDATE ON digiclin.estatus_usuario FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4743 (class 2620 OID 17174)
-- Name: estatus_usuario trg_estatus_usuario_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_estatus_usuario_bd BEFORE DELETE ON digiclin.estatus_usuario FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4804 (class 2620 OID 17217)
-- Name: expediente_clinico trg_expediente_clinico_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_expediente_clinico_ai AFTER INSERT ON digiclin.expediente_clinico FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4805 (class 2620 OID 17218)
-- Name: expediente_clinico trg_expediente_clinico_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_expediente_clinico_au AFTER UPDATE ON digiclin.expediente_clinico FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4806 (class 2620 OID 17219)
-- Name: expediente_clinico trg_expediente_clinico_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_expediente_clinico_bd BEFORE DELETE ON digiclin.expediente_clinico FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4768 (class 2620 OID 17169)
-- Name: medicamento trg_medicamento_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_medicamento_ai AFTER INSERT ON digiclin.medicamento FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4769 (class 2620 OID 17170)
-- Name: medicamento trg_medicamento_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_medicamento_au AFTER UPDATE ON digiclin.medicamento FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4770 (class 2620 OID 17171)
-- Name: medicamento trg_medicamento_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_medicamento_bd BEFORE DELETE ON digiclin.medicamento FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4780 (class 2620 OID 17178)
-- Name: medico trg_medico_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_medico_ai AFTER INSERT ON digiclin.medico FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4781 (class 2620 OID 17179)
-- Name: medico trg_medico_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_medico_au AFTER UPDATE ON digiclin.medico FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4782 (class 2620 OID 17180)
-- Name: medico trg_medico_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_medico_bd BEFORE DELETE ON digiclin.medico FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4792 (class 2620 OID 17196)
-- Name: paciente trg_paciente_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_paciente_ai AFTER INSERT ON digiclin.paciente FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4795 (class 2620 OID 17205)
-- Name: paciente_alergia trg_paciente_alergia_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_paciente_alergia_ai AFTER INSERT ON digiclin.paciente_alergia FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4796 (class 2620 OID 17206)
-- Name: paciente_alergia trg_paciente_alergia_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_paciente_alergia_au AFTER UPDATE ON digiclin.paciente_alergia FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4797 (class 2620 OID 17207)
-- Name: paciente_alergia trg_paciente_alergia_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_paciente_alergia_bd BEFORE DELETE ON digiclin.paciente_alergia FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4793 (class 2620 OID 17197)
-- Name: paciente trg_paciente_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_paciente_au AFTER UPDATE ON digiclin.paciente FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4794 (class 2620 OID 17198)
-- Name: paciente trg_paciente_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_paciente_bd BEFORE DELETE ON digiclin.paciente FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4798 (class 2620 OID 17199)
-- Name: paciente_enfermedad trg_paciente_enfermedad_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_paciente_enfermedad_ai AFTER INSERT ON digiclin.paciente_enfermedad FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4799 (class 2620 OID 17200)
-- Name: paciente_enfermedad trg_paciente_enfermedad_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_paciente_enfermedad_au AFTER UPDATE ON digiclin.paciente_enfermedad FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4800 (class 2620 OID 17201)
-- Name: paciente_enfermedad trg_paciente_enfermedad_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_paciente_enfermedad_bd BEFORE DELETE ON digiclin.paciente_enfermedad FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4777 (class 2620 OID 17175)
-- Name: personal_medico trg_personal_medico_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_personal_medico_ai AFTER INSERT ON digiclin.personal_medico FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4778 (class 2620 OID 17176)
-- Name: personal_medico trg_personal_medico_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_personal_medico_au AFTER UPDATE ON digiclin.personal_medico FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4779 (class 2620 OID 17177)
-- Name: personal_medico trg_personal_medico_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_personal_medico_bd BEFORE DELETE ON digiclin.personal_medico FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4738 (class 2620 OID 17151)
-- Name: rol trg_rol_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_rol_ai AFTER INSERT ON digiclin.rol FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4739 (class 2620 OID 17152)
-- Name: rol trg_rol_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_rol_au AFTER UPDATE ON digiclin.rol FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4740 (class 2620 OID 17153)
-- Name: rol trg_rol_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_rol_bd BEFORE DELETE ON digiclin.rol FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4750 (class 2620 OID 17154)
-- Name: sexo trg_sexo_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_sexo_ai AFTER INSERT ON digiclin.sexo FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4751 (class 2620 OID 17155)
-- Name: sexo trg_sexo_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_sexo_au AFTER UPDATE ON digiclin.sexo FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4752 (class 2620 OID 17156)
-- Name: sexo trg_sexo_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_sexo_bd BEFORE DELETE ON digiclin.sexo FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4753 (class 2620 OID 17160)
-- Name: tipo_sangre trg_tipo_sangre_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_tipo_sangre_ai AFTER INSERT ON digiclin.tipo_sangre FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4754 (class 2620 OID 17161)
-- Name: tipo_sangre trg_tipo_sangre_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_tipo_sangre_au AFTER UPDATE ON digiclin.tipo_sangre FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4755 (class 2620 OID 17162)
-- Name: tipo_sangre trg_tipo_sangre_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_tipo_sangre_bd BEFORE DELETE ON digiclin.tipo_sangre FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4771 (class 2620 OID 17211)
-- Name: tipo_tratamiento trg_tipo_tratamiento_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_tipo_tratamiento_ai AFTER INSERT ON digiclin.tipo_tratamiento FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4772 (class 2620 OID 17212)
-- Name: tipo_tratamiento trg_tipo_tratamiento_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_tipo_tratamiento_au AFTER UPDATE ON digiclin.tipo_tratamiento FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4773 (class 2620 OID 17213)
-- Name: tipo_tratamiento trg_tipo_tratamiento_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_tipo_tratamiento_bd BEFORE DELETE ON digiclin.tipo_tratamiento FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4807 (class 2620 OID 17208)
-- Name: tratamiento trg_tratamiento_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_tratamiento_ai AFTER INSERT ON digiclin.tratamiento FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4808 (class 2620 OID 17209)
-- Name: tratamiento trg_tratamiento_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_tratamiento_au AFTER UPDATE ON digiclin.tratamiento FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4809 (class 2620 OID 17210)
-- Name: tratamiento trg_tratamiento_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_tratamiento_bd BEFORE DELETE ON digiclin.tratamiento FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4774 (class 2620 OID 17214)
-- Name: usuario trg_usuario_ai; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_usuario_ai AFTER INSERT ON digiclin.usuario FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4775 (class 2620 OID 17215)
-- Name: usuario trg_usuario_au; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_usuario_au AFTER UPDATE ON digiclin.usuario FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4776 (class 2620 OID 17216)
-- Name: usuario trg_usuario_bd; Type: TRIGGER; Schema: digiclin; Owner: postgres
--

CREATE TRIGGER trg_usuario_bd BEFORE DELETE ON digiclin.usuario FOR EACH ROW EXECUTE FUNCTION digiclin.fn_bitacora_general();


--
-- TOC entry 4722 (class 2606 OID 16665)
-- Name: director fk_director_usuario; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.director
    ADD CONSTRAINT fk_director_usuario FOREIGN KEY (id_director) REFERENCES digiclin.usuario(id_usuario);


--
-- TOC entry 4720 (class 2606 OID 16653)
-- Name: enfermero_certificacion fk_enf_cert_certificacion; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.enfermero_certificacion
    ADD CONSTRAINT fk_enf_cert_certificacion FOREIGN KEY (id_certificacion) REFERENCES digiclin.certificacion(id_certificacion);


--
-- TOC entry 4721 (class 2606 OID 16648)
-- Name: enfermero_certificacion fk_enf_cert_enfermero; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.enfermero_certificacion
    ADD CONSTRAINT fk_enf_cert_enfermero FOREIGN KEY (id_enfermero) REFERENCES digiclin.enfermero(id_enfermero);


--
-- TOC entry 4719 (class 2606 OID 16637)
-- Name: enfermero fk_enfermero_personal; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.enfermero
    ADD CONSTRAINT fk_enfermero_personal FOREIGN KEY (id_enfermero) REFERENCES digiclin.personal_medico(id_personal_medico);


--
-- TOC entry 4731 (class 2606 OID 16761)
-- Name: expediente_clinico fk_expediente_diagnostico; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.expediente_clinico
    ADD CONSTRAINT fk_expediente_diagnostico FOREIGN KEY (id_diagnostico) REFERENCES digiclin.diagnostico(id_diagnostico);


--
-- TOC entry 4732 (class 2606 OID 16766)
-- Name: expediente_clinico fk_expediente_estatus; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.expediente_clinico
    ADD CONSTRAINT fk_expediente_estatus FOREIGN KEY (id_estatus_expediente) REFERENCES digiclin.estatus_expediente(id_estatus_expediente);


--
-- TOC entry 4733 (class 2606 OID 16756)
-- Name: expediente_clinico fk_expediente_medico; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.expediente_clinico
    ADD CONSTRAINT fk_expediente_medico FOREIGN KEY (id_medico) REFERENCES digiclin.medico(id_medico);


--
-- TOC entry 4734 (class 2606 OID 16751)
-- Name: expediente_clinico fk_expediente_paciente; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.expediente_clinico
    ADD CONSTRAINT fk_expediente_paciente FOREIGN KEY (id_paciente) REFERENCES digiclin.paciente(id_paciente);


--
-- TOC entry 4717 (class 2606 OID 16627)
-- Name: medico fk_medico_especialidad; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.medico
    ADD CONSTRAINT fk_medico_especialidad FOREIGN KEY (id_especialidad) REFERENCES digiclin.especialidad(id_especialidad);


--
-- TOC entry 4718 (class 2606 OID 16622)
-- Name: medico fk_medico_personal; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.medico
    ADD CONSTRAINT fk_medico_personal FOREIGN KEY (id_medico) REFERENCES digiclin.personal_medico(id_personal_medico);


--
-- TOC entry 4727 (class 2606 OID 16706)
-- Name: paciente_alergia fk_paciente_alergia_alergia; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.paciente_alergia
    ADD CONSTRAINT fk_paciente_alergia_alergia FOREIGN KEY (id_alergia) REFERENCES digiclin.alergia(id_alergia);


--
-- TOC entry 4728 (class 2606 OID 16701)
-- Name: paciente_alergia fk_paciente_alergia_paciente; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.paciente_alergia
    ADD CONSTRAINT fk_paciente_alergia_paciente FOREIGN KEY (id_paciente) REFERENCES digiclin.paciente(id_paciente);


--
-- TOC entry 4729 (class 2606 OID 16721)
-- Name: paciente_enfermedad fk_paciente_enfermedad_enfermedad; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.paciente_enfermedad
    ADD CONSTRAINT fk_paciente_enfermedad_enfermedad FOREIGN KEY (id_enfermedad) REFERENCES digiclin.enfermedad_cronica(id_enfermedad);


--
-- TOC entry 4730 (class 2606 OID 16716)
-- Name: paciente_enfermedad fk_paciente_enfermedad_paciente; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.paciente_enfermedad
    ADD CONSTRAINT fk_paciente_enfermedad_paciente FOREIGN KEY (id_paciente) REFERENCES digiclin.paciente(id_paciente);


--
-- TOC entry 4723 (class 2606 OID 16686)
-- Name: paciente fk_paciente_estado_civil; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.paciente
    ADD CONSTRAINT fk_paciente_estado_civil FOREIGN KEY (id_estado_civil) REFERENCES digiclin.estado_civil(id_estado_civil);


--
-- TOC entry 4724 (class 2606 OID 16874)
-- Name: paciente fk_paciente_estatus; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.paciente
    ADD CONSTRAINT fk_paciente_estatus FOREIGN KEY (id_estatus_paciente) REFERENCES digiclin.estatus_paciente(id_estatus_paciente);


--
-- TOC entry 4725 (class 2606 OID 16681)
-- Name: paciente fk_paciente_sexo; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.paciente
    ADD CONSTRAINT fk_paciente_sexo FOREIGN KEY (id_sexo) REFERENCES digiclin.sexo(id_sexo);


--
-- TOC entry 4726 (class 2606 OID 16691)
-- Name: paciente fk_paciente_tipo_sangre; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.paciente
    ADD CONSTRAINT fk_paciente_tipo_sangre FOREIGN KEY (id_tipo_sangre) REFERENCES digiclin.tipo_sangre(id_tipo_sangre);


--
-- TOC entry 4716 (class 2606 OID 16612)
-- Name: personal_medico fk_personal_medico_usuario; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.personal_medico
    ADD CONSTRAINT fk_personal_medico_usuario FOREIGN KEY (id_personal_medico) REFERENCES digiclin.usuario(id_usuario);


--
-- TOC entry 4735 (class 2606 OID 16779)
-- Name: tratamiento fk_tratamiento_expediente; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.tratamiento
    ADD CONSTRAINT fk_tratamiento_expediente FOREIGN KEY (id_expediente) REFERENCES digiclin.expediente_clinico(id_expediente);


--
-- TOC entry 4736 (class 2606 OID 16789)
-- Name: tratamiento fk_tratamiento_medicamento; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.tratamiento
    ADD CONSTRAINT fk_tratamiento_medicamento FOREIGN KEY (id_medicamento) REFERENCES digiclin.medicamento(id_medicamento);


--
-- TOC entry 4737 (class 2606 OID 16784)
-- Name: tratamiento fk_tratamiento_tipo; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.tratamiento
    ADD CONSTRAINT fk_tratamiento_tipo FOREIGN KEY (id_tipo_tratamiento) REFERENCES digiclin.tipo_tratamiento(id_tipo_tratamiento);


--
-- TOC entry 4714 (class 2606 OID 16600)
-- Name: usuario fk_usuario_estatus; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.usuario
    ADD CONSTRAINT fk_usuario_estatus FOREIGN KEY (id_estatus_usuario) REFERENCES digiclin.estatus_usuario(id_estatus_usuario);


--
-- TOC entry 4715 (class 2606 OID 16595)
-- Name: usuario fk_usuario_rol; Type: FK CONSTRAINT; Schema: digiclin; Owner: postgres
--

ALTER TABLE ONLY digiclin.usuario
    ADD CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES digiclin.rol(id_rol);


--
-- TOC entry 4979 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA digiclin; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA digiclin TO digiclin_app;


--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO digiclin_app;


--
-- TOC entry 4981 (class 0 OID 0)
-- Dependencies: 368
-- Name: FUNCTION fn_bitacora_general(); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON FUNCTION digiclin.fn_bitacora_general() TO digiclin_app;


--
-- TOC entry 4982 (class 0 OID 0)
-- Dependencies: 270
-- Name: TABLE diagnostico; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.diagnostico TO digiclin_app;


--
-- TOC entry 4983 (class 0 OID 0)
-- Dependencies: 239
-- Name: TABLE estatus_expediente; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.estatus_expediente TO digiclin_app;


--
-- TOC entry 4984 (class 0 OID 0)
-- Dependencies: 272
-- Name: TABLE expediente_clinico; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.expediente_clinico TO digiclin_app;


--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 266
-- Name: TABLE paciente; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.paciente TO digiclin_app;


--
-- TOC entry 4986 (class 0 OID 0)
-- Dependencies: 259
-- Name: TABLE usuario; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.usuario TO digiclin_app;


--
-- TOC entry 4987 (class 0 OID 0)
-- Dependencies: 337
-- Name: TABLE vw_expedientes; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.vw_expedientes TO digiclin_app;


--
-- TOC entry 4988 (class 0 OID 0)
-- Dependencies: 346
-- Name: FUNCTION fn_expedientes_por_id_usuario(p_id_usuario integer); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON FUNCTION digiclin.fn_expedientes_por_id_usuario(p_id_usuario integer) TO digiclin_app;


--
-- TOC entry 4989 (class 0 OID 0)
-- Dependencies: 347
-- Name: FUNCTION fn_expedientes_por_nombre_usuario(p_nombre_usuario character varying); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON FUNCTION digiclin.fn_expedientes_por_nombre_usuario(p_nombre_usuario character varying) TO digiclin_app;


--
-- TOC entry 4990 (class 0 OID 0)
-- Dependencies: 247
-- Name: TABLE estado_civil; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.estado_civil TO digiclin_app;


--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 281
-- Name: TABLE estatus_paciente; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.estatus_paciente TO digiclin_app;


--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 243
-- Name: TABLE sexo; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.sexo TO digiclin_app;


--
-- TOC entry 4993 (class 0 OID 0)
-- Dependencies: 245
-- Name: TABLE tipo_sangre; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.tipo_sangre TO digiclin_app;


--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 282
-- Name: TABLE vw_paciente; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.vw_paciente TO digiclin_app;


--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 344
-- Name: FUNCTION fn_obtener_paciente_por_curp(p_curp character varying); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON FUNCTION digiclin.fn_obtener_paciente_por_curp(p_curp character varying) TO digiclin_app;


--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 375
-- Name: PROCEDURE sp_actualizar_expediente(IN p_id_expediente integer, IN p_id_paciente integer, IN p_id_diagnostico integer, IN p_fecha_consulta timestamp without time zone, IN p_motivo character varying, IN p_antecedentes_personales character varying, IN p_antecedentes_familiares character varying, IN p_presion_arterial character varying, IN p_frecuencia_cardiaca numeric, IN p_frecuencia_respiratoria numeric, IN p_temperatura numeric, IN p_saturacion_oxigeno numeric, IN p_peso numeric, IN p_talla_cintura numeric, IN p_altura numeric, IN p_observaciones character varying); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON PROCEDURE digiclin.sp_actualizar_expediente(IN p_id_expediente integer, IN p_id_paciente integer, IN p_id_diagnostico integer, IN p_fecha_consulta timestamp without time zone, IN p_motivo character varying, IN p_antecedentes_personales character varying, IN p_antecedentes_familiares character varying, IN p_presion_arterial character varying, IN p_frecuencia_cardiaca numeric, IN p_frecuencia_respiratoria numeric, IN p_temperatura numeric, IN p_saturacion_oxigeno numeric, IN p_peso numeric, IN p_talla_cintura numeric, IN p_altura numeric, IN p_observaciones character varying) TO digiclin_app;


--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 348
-- Name: PROCEDURE sp_actualizar_mi_perfil(IN p_nombre_usuario_actual character varying, IN p_nuevo_nombre_usuario character varying, IN p_correo character varying); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON PROCEDURE digiclin.sp_actualizar_mi_perfil(IN p_nombre_usuario_actual character varying, IN p_nuevo_nombre_usuario character varying, IN p_correo character varying) TO digiclin_app;


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 370
-- Name: PROCEDURE sp_actualizar_paciente(IN p_curp character varying, IN p_nombre_p character varying, IN p_apellido_pat character varying, IN p_apellido_mat character varying, IN p_fecha_nacimiento date, IN p_nombre_sexo character varying, IN p_domicilio character varying, IN p_nombre_estado_civil character varying, IN p_correo character varying, IN p_ocupacion character varying, IN p_telefono character varying, IN p_contacto_emergencia character varying, IN p_nombre_tipo_sangre character varying); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON PROCEDURE digiclin.sp_actualizar_paciente(IN p_curp character varying, IN p_nombre_p character varying, IN p_apellido_pat character varying, IN p_apellido_mat character varying, IN p_fecha_nacimiento date, IN p_nombre_sexo character varying, IN p_domicilio character varying, IN p_nombre_estado_civil character varying, IN p_correo character varying, IN p_ocupacion character varying, IN p_telefono character varying, IN p_contacto_emergencia character varying, IN p_nombre_tipo_sangre character varying) TO digiclin_app;


--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 351
-- Name: PROCEDURE sp_actualizar_usuario(IN p_nombre_usuario_actual character varying, IN p_nuevo_nombre_usuario character varying, IN p_correo character varying); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON PROCEDURE digiclin.sp_actualizar_usuario(IN p_nombre_usuario_actual character varying, IN p_nuevo_nombre_usuario character varying, IN p_correo character varying) TO digiclin_app;


--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 372
-- Name: PROCEDURE sp_archivar_expediente(IN p_id_expediente integer); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON PROCEDURE digiclin.sp_archivar_expediente(IN p_id_expediente integer) TO digiclin_app;


--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 345
-- Name: PROCEDURE sp_cambiar_password_usuario(IN p_nombre_usuario character varying, IN p_password_hash_nuevo character varying); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON PROCEDURE digiclin.sp_cambiar_password_usuario(IN p_nombre_usuario character varying, IN p_password_hash_nuevo character varying) TO digiclin_app;


--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 369
-- Name: PROCEDURE sp_corregir_curp_paciente(IN p_curp_actual character varying, IN p_nuevo_curp character varying); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON PROCEDURE digiclin.sp_corregir_curp_paciente(IN p_curp_actual character varying, IN p_nuevo_curp character varying) TO digiclin_app;


--
-- TOC entry 5003 (class 0 OID 0)
-- Dependencies: 371
-- Name: PROCEDURE sp_crear_expediente(IN p_id_paciente integer, IN p_id_medico integer, IN p_id_diagnostico integer, IN p_fecha_consulta timestamp without time zone, IN p_motivo character varying, IN p_antecedentes_personales character varying, IN p_antecedentes_familiares character varying, IN p_presion_arterial character varying, IN p_frecuencia_cardiaca numeric, IN p_frecuencia_respiratoria numeric, IN p_temperatura numeric, IN p_saturacion_oxigeno numeric, IN p_peso numeric, IN p_talla_cintura numeric, IN p_altura numeric, IN p_observaciones character varying); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON PROCEDURE digiclin.sp_crear_expediente(IN p_id_paciente integer, IN p_id_medico integer, IN p_id_diagnostico integer, IN p_fecha_consulta timestamp without time zone, IN p_motivo character varying, IN p_antecedentes_personales character varying, IN p_antecedentes_familiares character varying, IN p_presion_arterial character varying, IN p_frecuencia_cardiaca numeric, IN p_frecuencia_respiratoria numeric, IN p_temperatura numeric, IN p_saturacion_oxigeno numeric, IN p_peso numeric, IN p_talla_cintura numeric, IN p_altura numeric, IN p_observaciones character varying) TO digiclin_app;


--
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 373
-- Name: PROCEDURE sp_crear_expediente_desde_usuario(IN p_id_usuario integer, IN p_id_paciente integer, IN p_id_diagnostico integer, IN p_fecha_consulta timestamp without time zone, IN p_motivo character varying, IN p_antecedentes_personales character varying, IN p_antecedentes_familiares character varying, IN p_presion_arterial character varying, IN p_frecuencia_cardiaca numeric, IN p_frecuencia_respiratoria numeric, IN p_temperatura numeric, IN p_saturacion_oxigeno numeric, IN p_peso numeric, IN p_talla_cintura numeric, IN p_altura numeric, IN p_observaciones character varying, INOUT p_id_expediente_generado integer); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON PROCEDURE digiclin.sp_crear_expediente_desde_usuario(IN p_id_usuario integer, IN p_id_paciente integer, IN p_id_diagnostico integer, IN p_fecha_consulta timestamp without time zone, IN p_motivo character varying, IN p_antecedentes_personales character varying, IN p_antecedentes_familiares character varying, IN p_presion_arterial character varying, IN p_frecuencia_cardiaca numeric, IN p_frecuencia_respiratoria numeric, IN p_temperatura numeric, IN p_saturacion_oxigeno numeric, IN p_peso numeric, IN p_talla_cintura numeric, IN p_altura numeric, IN p_observaciones character varying, INOUT p_id_expediente_generado integer) TO digiclin_app;


--
-- TOC entry 5005 (class 0 OID 0)
-- Dependencies: 367
-- Name: PROCEDURE sp_crear_paciente(IN p_nombre_p character varying, IN p_apellido_pat character varying, IN p_apellido_mat character varying, IN p_fecha_nacimiento date, IN p_nombre_sexo character varying, IN p_curp character varying, IN p_domicilio character varying, IN p_nombre_estado_civil character varying, IN p_correo character varying, IN p_ocupacion character varying, IN p_telefono character varying, IN p_contacto_emergencia character varying, IN p_nombre_tipo_sangre character varying); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON PROCEDURE digiclin.sp_crear_paciente(IN p_nombre_p character varying, IN p_apellido_pat character varying, IN p_apellido_mat character varying, IN p_fecha_nacimiento date, IN p_nombre_sexo character varying, IN p_curp character varying, IN p_domicilio character varying, IN p_nombre_estado_civil character varying, IN p_correo character varying, IN p_ocupacion character varying, IN p_telefono character varying, IN p_contacto_emergencia character varying, IN p_nombre_tipo_sangre character varying) TO digiclin_app;


--
-- TOC entry 5006 (class 0 OID 0)
-- Dependencies: 374
-- Name: PROCEDURE sp_crear_usuario(IN p_nombre_usuario character varying, IN p_correo character varying, IN p_password_hash character varying, IN p_nombre_rol character varying, IN p_cedula character varying, IN p_nombre_especialidad character varying); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON PROCEDURE digiclin.sp_crear_usuario(IN p_nombre_usuario character varying, IN p_correo character varying, IN p_password_hash character varying, IN p_nombre_rol character varying, IN p_cedula character varying, IN p_nombre_especialidad character varying) TO digiclin_app;


--
-- TOC entry 5007 (class 0 OID 0)
-- Dependencies: 366
-- Name: PROCEDURE sp_desarchivar_expediente(IN p_id_expediente integer); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON PROCEDURE digiclin.sp_desarchivar_expediente(IN p_id_expediente integer) TO digiclin_app;


--
-- TOC entry 5008 (class 0 OID 0)
-- Dependencies: 365
-- Name: PROCEDURE sp_habilitar_paciente(IN p_curp character varying); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON PROCEDURE digiclin.sp_habilitar_paciente(IN p_curp character varying) TO digiclin_app;


--
-- TOC entry 5009 (class 0 OID 0)
-- Dependencies: 350
-- Name: PROCEDURE sp_habilitar_usuario(IN p_nombre_usuario character varying); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON PROCEDURE digiclin.sp_habilitar_usuario(IN p_nombre_usuario character varying) TO digiclin_app;


--
-- TOC entry 5010 (class 0 OID 0)
-- Dependencies: 353
-- Name: PROCEDURE sp_inhabilitar_paciente(IN p_curp character varying); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON PROCEDURE digiclin.sp_inhabilitar_paciente(IN p_curp character varying) TO digiclin_app;


--
-- TOC entry 5011 (class 0 OID 0)
-- Dependencies: 349
-- Name: PROCEDURE sp_inhabilitar_usuario(IN p_nombre_usuario character varying); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON PROCEDURE digiclin.sp_inhabilitar_usuario(IN p_nombre_usuario character varying) TO digiclin_app;


--
-- TOC entry 5012 (class 0 OID 0)
-- Dependencies: 352
-- Name: PROCEDURE sp_resetear_password_usuario(IN p_nombre_usuario character varying, IN p_password_hash character varying); Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON PROCEDURE digiclin.sp_resetear_password_usuario(IN p_nombre_usuario character varying, IN p_password_hash character varying) TO digiclin_app;


--
-- TOC entry 5013 (class 0 OID 0)
-- Dependencies: 249
-- Name: TABLE alergia; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.alergia TO digiclin_app;


--
-- TOC entry 5014 (class 0 OID 0)
-- Dependencies: 296
-- Name: TABLE alergia_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.alergia_bitacora TO digiclin_app;


--
-- TOC entry 5015 (class 0 OID 0)
-- Dependencies: 295
-- Name: SEQUENCE alergia_bitacora_id_alergia_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.alergia_bitacora_id_alergia_bitacora_seq TO digiclin_app;


--
-- TOC entry 5016 (class 0 OID 0)
-- Dependencies: 248
-- Name: SEQUENCE alergia_id_alergia_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.alergia_id_alergia_seq TO digiclin_app;


--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 253
-- Name: TABLE certificacion; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.certificacion TO digiclin_app;


--
-- TOC entry 5018 (class 0 OID 0)
-- Dependencies: 314
-- Name: TABLE certificacion_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.certificacion_bitacora TO digiclin_app;


--
-- TOC entry 5019 (class 0 OID 0)
-- Dependencies: 313
-- Name: SEQUENCE certificacion_bitacora_id_certificacion_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.certificacion_bitacora_id_certificacion_bitacora_seq TO digiclin_app;


--
-- TOC entry 5020 (class 0 OID 0)
-- Dependencies: 252
-- Name: SEQUENCE certificacion_id_certificacion_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.certificacion_id_certificacion_seq TO digiclin_app;


--
-- TOC entry 5021 (class 0 OID 0)
-- Dependencies: 334
-- Name: TABLE diagnostico_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.diagnostico_bitacora TO digiclin_app;


--
-- TOC entry 5022 (class 0 OID 0)
-- Dependencies: 333
-- Name: SEQUENCE diagnostico_bitacora_id_diagnostico_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.diagnostico_bitacora_id_diagnostico_bitacora_seq TO digiclin_app;


--
-- TOC entry 5023 (class 0 OID 0)
-- Dependencies: 269
-- Name: SEQUENCE diagnostico_id_diagnostico_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.diagnostico_id_diagnostico_seq TO digiclin_app;


--
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 264
-- Name: TABLE director; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.director TO digiclin_app;


--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 316
-- Name: TABLE director_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.director_bitacora TO digiclin_app;


--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 315
-- Name: SEQUENCE director_bitacora_id_director_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.director_bitacora_id_director_bitacora_seq TO digiclin_app;


--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 251
-- Name: TABLE enfermedad_cronica; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.enfermedad_cronica TO digiclin_app;


--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 322
-- Name: TABLE enfermedad_cronica_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.enfermedad_cronica_bitacora TO digiclin_app;


--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 321
-- Name: SEQUENCE enfermedad_cronica_bitacora_id_enfermedad_cronica_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.enfermedad_cronica_bitacora_id_enfermedad_cronica_bitacora_seq TO digiclin_app;


--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 250
-- Name: SEQUENCE enfermedad_cronica_id_enfermedad_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.enfermedad_cronica_id_enfermedad_seq TO digiclin_app;


--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 262
-- Name: TABLE enfermero; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.enfermero TO digiclin_app;


--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 310
-- Name: TABLE enfermero_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.enfermero_bitacora TO digiclin_app;


--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 309
-- Name: SEQUENCE enfermero_bitacora_id_enfermero_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.enfermero_bitacora_id_enfermero_bitacora_seq TO digiclin_app;


--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 263
-- Name: TABLE enfermero_certificacion; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.enfermero_certificacion TO digiclin_app;


--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 312
-- Name: TABLE enfermero_certificacion_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.enfermero_certificacion_bitacora TO digiclin_app;


--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 311
-- Name: SEQUENCE enfermero_certificacion_bitac_id_enfermero_certificacion_bi_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.enfermero_certificacion_bitac_id_enfermero_certificacion_bi_seq TO digiclin_app;


--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 241
-- Name: TABLE especialidad; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.especialidad TO digiclin_app;


--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 308
-- Name: TABLE especialidad_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.especialidad_bitacora TO digiclin_app;


--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 307
-- Name: SEQUENCE especialidad_bitacora_id_especialidad_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.especialidad_bitacora_id_especialidad_bitacora_seq TO digiclin_app;


--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 240
-- Name: SEQUENCE especialidad_id_especialidad_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.especialidad_id_especialidad_seq TO digiclin_app;


--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 292
-- Name: TABLE estado_civil_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.estado_civil_bitacora TO digiclin_app;


--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 291
-- Name: SEQUENCE estado_civil_bitacora_id_estado_civil_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.estado_civil_bitacora_id_estado_civil_bitacora_seq TO digiclin_app;


--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 246
-- Name: SEQUENCE estado_civil_id_estado_civil_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.estado_civil_id_estado_civil_seq TO digiclin_app;


--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 298
-- Name: TABLE estatus_expediente_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.estatus_expediente_bitacora TO digiclin_app;


--
-- TOC entry 5045 (class 0 OID 0)
-- Dependencies: 297
-- Name: SEQUENCE estatus_expediente_bitacora_id_estatus_expediente_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.estatus_expediente_bitacora_id_estatus_expediente_bitacora_seq TO digiclin_app;


--
-- TOC entry 5046 (class 0 OID 0)
-- Dependencies: 238
-- Name: SEQUENCE estatus_expediente_id_estatus_expediente_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.estatus_expediente_id_estatus_expediente_seq TO digiclin_app;


--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 336
-- Name: TABLE estatus_paciente_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.estatus_paciente_bitacora TO digiclin_app;


--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 335
-- Name: SEQUENCE estatus_paciente_bitacora_id_estatus_paciente_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.estatus_paciente_bitacora_id_estatus_paciente_bitacora_seq TO digiclin_app;


--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 280
-- Name: SEQUENCE estatus_paciente_id_estatus_paciente_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.estatus_paciente_id_estatus_paciente_seq TO digiclin_app;


--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 237
-- Name: TABLE estatus_usuario; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.estatus_usuario TO digiclin_app;


--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 302
-- Name: TABLE estatus_usuario_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.estatus_usuario_bitacora TO digiclin_app;


--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 301
-- Name: SEQUENCE estatus_usuario_bitacora_id_estatus_usuario_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.estatus_usuario_bitacora_id_estatus_usuario_bitacora_seq TO digiclin_app;


--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 236
-- Name: SEQUENCE estatus_usuario_id_estatus_usuario_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.estatus_usuario_id_estatus_usuario_seq TO digiclin_app;


--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 332
-- Name: TABLE expediente_clinico_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.expediente_clinico_bitacora TO digiclin_app;


--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 331
-- Name: SEQUENCE expediente_clinico_bitacora_id_expediente_clinico_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.expediente_clinico_bitacora_id_expediente_clinico_bitacora_seq TO digiclin_app;


--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 271
-- Name: SEQUENCE expediente_clinico_id_expediente_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.expediente_clinico_id_expediente_seq TO digiclin_app;


--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 255
-- Name: TABLE medicamento; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.medicamento TO digiclin_app;


--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 300
-- Name: TABLE medicamento_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.medicamento_bitacora TO digiclin_app;


--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 299
-- Name: SEQUENCE medicamento_bitacora_id_medicamento_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.medicamento_bitacora_id_medicamento_bitacora_seq TO digiclin_app;


--
-- TOC entry 5060 (class 0 OID 0)
-- Dependencies: 254
-- Name: SEQUENCE medicamento_id_medicamento_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.medicamento_id_medicamento_seq TO digiclin_app;


--
-- TOC entry 5061 (class 0 OID 0)
-- Dependencies: 261
-- Name: TABLE medico; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.medico TO digiclin_app;


--
-- TOC entry 5062 (class 0 OID 0)
-- Dependencies: 306
-- Name: TABLE medico_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.medico_bitacora TO digiclin_app;


--
-- TOC entry 5063 (class 0 OID 0)
-- Dependencies: 305
-- Name: SEQUENCE medico_bitacora_id_medico_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.medico_bitacora_id_medico_bitacora_seq TO digiclin_app;


--
-- TOC entry 5064 (class 0 OID 0)
-- Dependencies: 267
-- Name: TABLE paciente_alergia; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.paciente_alergia TO digiclin_app;


--
-- TOC entry 5065 (class 0 OID 0)
-- Dependencies: 324
-- Name: TABLE paciente_alergia_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.paciente_alergia_bitacora TO digiclin_app;


--
-- TOC entry 5066 (class 0 OID 0)
-- Dependencies: 323
-- Name: SEQUENCE paciente_alergia_bitacora_id_paciente_alergia_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.paciente_alergia_bitacora_id_paciente_alergia_bitacora_seq TO digiclin_app;


--
-- TOC entry 5067 (class 0 OID 0)
-- Dependencies: 318
-- Name: TABLE paciente_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.paciente_bitacora TO digiclin_app;


--
-- TOC entry 5068 (class 0 OID 0)
-- Dependencies: 317
-- Name: SEQUENCE paciente_bitacora_id_paciente_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.paciente_bitacora_id_paciente_bitacora_seq TO digiclin_app;


--
-- TOC entry 5069 (class 0 OID 0)
-- Dependencies: 268
-- Name: TABLE paciente_enfermedad; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.paciente_enfermedad TO digiclin_app;


--
-- TOC entry 5070 (class 0 OID 0)
-- Dependencies: 320
-- Name: TABLE paciente_enfermedad_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.paciente_enfermedad_bitacora TO digiclin_app;


--
-- TOC entry 5071 (class 0 OID 0)
-- Dependencies: 319
-- Name: SEQUENCE paciente_enfermedad_bitacora_id_paciente_enfermedad_bitacor_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.paciente_enfermedad_bitacora_id_paciente_enfermedad_bitacor_seq TO digiclin_app;


--
-- TOC entry 5072 (class 0 OID 0)
-- Dependencies: 265
-- Name: SEQUENCE paciente_id_paciente_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.paciente_id_paciente_seq TO digiclin_app;


--
-- TOC entry 5073 (class 0 OID 0)
-- Dependencies: 260
-- Name: TABLE personal_medico; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.personal_medico TO digiclin_app;


--
-- TOC entry 5074 (class 0 OID 0)
-- Dependencies: 304
-- Name: TABLE personal_medico_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.personal_medico_bitacora TO digiclin_app;


--
-- TOC entry 5075 (class 0 OID 0)
-- Dependencies: 303
-- Name: SEQUENCE personal_medico_bitacora_id_personal_medico_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.personal_medico_bitacora_id_personal_medico_bitacora_seq TO digiclin_app;


--
-- TOC entry 5076 (class 0 OID 0)
-- Dependencies: 235
-- Name: TABLE rol; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.rol TO digiclin_app;


--
-- TOC entry 5077 (class 0 OID 0)
-- Dependencies: 288
-- Name: TABLE rol_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.rol_bitacora TO digiclin_app;


--
-- TOC entry 5078 (class 0 OID 0)
-- Dependencies: 287
-- Name: SEQUENCE rol_bitacora_id_rol_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.rol_bitacora_id_rol_bitacora_seq TO digiclin_app;


--
-- TOC entry 5079 (class 0 OID 0)
-- Dependencies: 234
-- Name: SEQUENCE rol_id_rol_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.rol_id_rol_seq TO digiclin_app;


--
-- TOC entry 5080 (class 0 OID 0)
-- Dependencies: 290
-- Name: TABLE sexo_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.sexo_bitacora TO digiclin_app;


--
-- TOC entry 5081 (class 0 OID 0)
-- Dependencies: 289
-- Name: SEQUENCE sexo_bitacora_id_sexo_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.sexo_bitacora_id_sexo_bitacora_seq TO digiclin_app;


--
-- TOC entry 5082 (class 0 OID 0)
-- Dependencies: 242
-- Name: SEQUENCE sexo_id_sexo_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.sexo_id_sexo_seq TO digiclin_app;


--
-- TOC entry 5083 (class 0 OID 0)
-- Dependencies: 294
-- Name: TABLE tipo_sangre_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.tipo_sangre_bitacora TO digiclin_app;


--
-- TOC entry 5084 (class 0 OID 0)
-- Dependencies: 293
-- Name: SEQUENCE tipo_sangre_bitacora_id_tipo_sangre_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.tipo_sangre_bitacora_id_tipo_sangre_bitacora_seq TO digiclin_app;


--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 244
-- Name: SEQUENCE tipo_sangre_id_tipo_sangre_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.tipo_sangre_id_tipo_sangre_seq TO digiclin_app;


--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 257
-- Name: TABLE tipo_tratamiento; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.tipo_tratamiento TO digiclin_app;


--
-- TOC entry 5087 (class 0 OID 0)
-- Dependencies: 328
-- Name: TABLE tipo_tratamiento_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.tipo_tratamiento_bitacora TO digiclin_app;


--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 327
-- Name: SEQUENCE tipo_tratamiento_bitacora_id_tipo_tratamiento_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.tipo_tratamiento_bitacora_id_tipo_tratamiento_bitacora_seq TO digiclin_app;


--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 256
-- Name: SEQUENCE tipo_tratamiento_id_tipo_tratamiento_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.tipo_tratamiento_id_tipo_tratamiento_seq TO digiclin_app;


--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 274
-- Name: TABLE tratamiento; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT ALL ON TABLE digiclin.tratamiento TO digiclin_app;


--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 326
-- Name: TABLE tratamiento_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.tratamiento_bitacora TO digiclin_app;


--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 325
-- Name: SEQUENCE tratamiento_bitacora_id_tratamiento_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.tratamiento_bitacora_id_tratamiento_bitacora_seq TO digiclin_app;


--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 273
-- Name: SEQUENCE tratamiento_id_tratamiento_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.tratamiento_id_tratamiento_seq TO digiclin_app;


--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 330
-- Name: TABLE usuario_bitacora; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.usuario_bitacora TO digiclin_app;


--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 329
-- Name: SEQUENCE usuario_bitacora_id_usuario_bitacora_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.usuario_bitacora_id_usuario_bitacora_seq TO digiclin_app;


--
-- TOC entry 5096 (class 0 OID 0)
-- Dependencies: 258
-- Name: SEQUENCE usuario_id_usuario_seq; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE digiclin.usuario_id_usuario_seq TO digiclin_app;


--
-- TOC entry 5097 (class 0 OID 0)
-- Dependencies: 340
-- Name: TABLE vw_expediente; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.vw_expediente TO digiclin_app;


--
-- TOC entry 5098 (class 0 OID 0)
-- Dependencies: 338
-- Name: TABLE vw_expedientes_abiertos; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.vw_expedientes_abiertos TO digiclin_app;


--
-- TOC entry 5099 (class 0 OID 0)
-- Dependencies: 339
-- Name: TABLE vw_expedientes_archivados; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.vw_expedientes_archivados TO digiclin_app;


--
-- TOC entry 5100 (class 0 OID 0)
-- Dependencies: 279
-- Name: TABLE vw_expedientes_detalle; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.vw_expedientes_detalle TO digiclin_app;


--
-- TOC entry 5101 (class 0 OID 0)
-- Dependencies: 286
-- Name: TABLE vw_paciente_administrativo; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.vw_paciente_administrativo TO digiclin_app;


--
-- TOC entry 5102 (class 0 OID 0)
-- Dependencies: 284
-- Name: TABLE vw_paciente_completo; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.vw_paciente_completo TO digiclin_app;


--
-- TOC entry 5103 (class 0 OID 0)
-- Dependencies: 285
-- Name: TABLE vw_paciente_enfermero; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.vw_paciente_enfermero TO digiclin_app;


--
-- TOC entry 5104 (class 0 OID 0)
-- Dependencies: 341
-- Name: TABLE vw_paciente_identificador; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.vw_paciente_identificador TO digiclin_app;


--
-- TOC entry 5105 (class 0 OID 0)
-- Dependencies: 278
-- Name: TABLE vw_pacientes_detalle; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.vw_pacientes_detalle TO digiclin_app;


--
-- TOC entry 5106 (class 0 OID 0)
-- Dependencies: 276
-- Name: TABLE vw_usuario; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.vw_usuario TO digiclin_app;


--
-- TOC entry 5107 (class 0 OID 0)
-- Dependencies: 342
-- Name: TABLE vw_usuario_login; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.vw_usuario_login TO digiclin_app;


--
-- TOC entry 5108 (class 0 OID 0)
-- Dependencies: 275
-- Name: TABLE vw_usuarios_activos; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.vw_usuarios_activos TO digiclin_app;


--
-- TOC entry 5109 (class 0 OID 0)
-- Dependencies: 283
-- Name: TABLE vw_usuarios_inactivos; Type: ACL; Schema: digiclin; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE digiclin.vw_usuarios_inactivos TO digiclin_app;


--
-- TOC entry 2387 (class 826 OID 16809)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: digiclin; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA digiclin GRANT SELECT,USAGE ON SEQUENCES TO digiclin_app;


--
-- TOC entry 2388 (class 826 OID 16810)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: digiclin; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA digiclin GRANT ALL ON FUNCTIONS TO digiclin_app;


--
-- TOC entry 2386 (class 826 OID 16808)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: digiclin; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA digiclin GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES TO digiclin_app;


--
-- TOC entry 2385 (class 826 OID 16482)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO digiclin_app;


-- Completed on 2026-05-18 21:46:06

--
-- PostgreSQL database dump complete
--



