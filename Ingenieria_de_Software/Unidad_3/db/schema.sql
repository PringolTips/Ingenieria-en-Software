--TABLAS CATÁLOGOS 
CREATE SCHEMA IF NOT EXISTS digiclin;
SET search_path TO digiclin;

CREATE TABLE rol (
    id_rol INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(150)
);

CREATE TABLE estatus_usuario (
    id_estatus_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_estatus VARCHAR(30) NOT NULL UNIQUE,
    descripcion VARCHAR(150)
);

CREATE TABLE estatus_expediente (
    id_estatus_expediente INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_estatus VARCHAR(30) NOT NULL UNIQUE,
    descripcion VARCHAR(150)
);

CREATE TABLE especialidad (
    id_especialidad INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    descripcion VARCHAR(150)
);

CREATE TABLE sexo (
    id_sexo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE tipo_sangre (
    id_tipo_sangre INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE estado_civil (
    id_estado_civil INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE alergia (
    id_alergia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(300)
);

CREATE TABLE enfermedad_cronica (
    id_enfermedad INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(300)
);

CREATE TABLE certificacion (
    id_certificacion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(300)
);

CREATE TABLE medicamento (
    id_medicamento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    presentacion VARCHAR(100),
    descripcion VARCHAR(300)
);

CREATE TABLE tipo_tratamiento (
    id_tipo_tratamiento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    descripcion VARCHAR(200)
);


--TABLAS DE USUARIOS
SET search_path TO digiclin;

CREATE TABLE usuario (
    id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_rol INTEGER NOT NULL,
    id_estatus_usuario INTEGER NOT NULL,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    debe_cambiar_password BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol) REFERENCES rol(id_rol),
    CONSTRAINT fk_usuario_estatus
        FOREIGN KEY (id_estatus_usuario) REFERENCES estatus_usuario(id_estatus_usuario)
);

CREATE TABLE personal_medico (
    id_personal_medico INTEGER PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    CONSTRAINT fk_personal_medico_usuario
        FOREIGN KEY (id_personal_medico) REFERENCES usuario(id_usuario)
);

CREATE TABLE medico (
    id_medico INTEGER PRIMARY KEY,
    id_especialidad INTEGER NOT NULL,
    CONSTRAINT fk_medico_personal
        FOREIGN KEY (id_medico) REFERENCES personal_medico(id_personal_medico),
    CONSTRAINT fk_medico_especialidad
        FOREIGN KEY (id_especialidad) REFERENCES especialidad(id_especialidad)
);

CREATE TABLE enfermero (
    id_enfermero INTEGER PRIMARY KEY,
    CONSTRAINT fk_enfermero_personal
        FOREIGN KEY (id_enfermero) REFERENCES personal_medico(id_personal_medico)
);

CREATE TABLE enfermero_certificacion (
    id_enfermero INTEGER NOT NULL,
    id_certificacion INTEGER NOT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_enfermero_certificacion PRIMARY KEY (id_enfermero, id_certificacion),
    CONSTRAINT fk_enf_cert_enfermero
        FOREIGN KEY (id_enfermero) REFERENCES enfermero(id_enfermero),
    CONSTRAINT fk_enf_cert_certificacion
        FOREIGN KEY (id_certificacion) REFERENCES certificacion(id_certificacion)
);

CREATE TABLE director (
    id_director INTEGER PRIMARY KEY,
    plaza VARCHAR(100) NOT NULL UNIQUE,
    CONSTRAINT fk_director_usuario
        FOREIGN KEY (id_director) REFERENCES usuario(id_usuario)
);


-- TABLA PACIENTE Y RELACIONADAS
SET search_path TO digiclin;

CREATE TABLE paciente (
    id_paciente INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_p VARCHAR(60) NOT NULL,
    apellido_pat VARCHAR(60) NOT NULL,
    apellido_mat VARCHAR(60),
    fecha_nacimiento DATE NOT NULL,
    id_sexo INTEGER NOT NULL,
    curp VARCHAR(18) NOT NULL UNIQUE,
    domicilio VARCHAR(200),
    id_estado_civil INTEGER,
    correo VARCHAR(100),
    ocupacion VARCHAR(80),
    telefono VARCHAR(20),
    contacto_emergencia VARCHAR(100),
    id_tipo_sangre INTEGER,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_paciente_sexo
        FOREIGN KEY (id_sexo) REFERENCES sexo(id_sexo),
    CONSTRAINT fk_paciente_estado_civil
        FOREIGN KEY (id_estado_civil) REFERENCES estado_civil(id_estado_civil),
    CONSTRAINT fk_paciente_tipo_sangre
        FOREIGN KEY (id_tipo_sangre) REFERENCES tipo_sangre(id_tipo_sangre)
);

CREATE TABLE paciente_alergia (
    id_paciente INTEGER NOT NULL,
    id_alergia INTEGER NOT NULL,
    observaciones VARCHAR(300),
    CONSTRAINT pk_paciente_alergia PRIMARY KEY (id_paciente, id_alergia),
    CONSTRAINT fk_paciente_alergia_paciente
        FOREIGN KEY (id_paciente) REFERENCES paciente(id_paciente),
    CONSTRAINT fk_paciente_alergia_alergia
        FOREIGN KEY (id_alergia) REFERENCES alergia(id_alergia)
);

CREATE TABLE paciente_enfermedad (
    id_paciente INTEGER NOT NULL,
    id_enfermedad INTEGER NOT NULL,
    observaciones VARCHAR(300),
    CONSTRAINT pk_paciente_enfermedad PRIMARY KEY (id_paciente, id_enfermedad),
    CONSTRAINT fk_paciente_enfermedad_paciente
        FOREIGN KEY (id_paciente) REFERENCES paciente(id_paciente),
    CONSTRAINT fk_paciente_enfermedad_enfermedad
        FOREIGN KEY (id_enfermedad) REFERENCES enfermedad_cronica(id_enfermedad)
);

--TABLA DIAGNÓSTICO, EXPEDIENTE Y TRATAMIENTO 
SET search_path TO digiclin;

CREATE TABLE diagnostico (
    id_diagnostico INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo_cie VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(4000)
);

CREATE TABLE expediente_clinico (
    id_expediente INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_medico INTEGER NOT NULL,
    id_diagnostico INTEGER NOT NULL,
    id_estatus_expediente INTEGER NOT NULL,
    fecha_consulta TIMESTAMP NOT NULL,
    motivo VARCHAR(4000) NOT NULL,
    antecedentes_personales VARCHAR(4000),
    antecedentes_familiares VARCHAR(4000),
    presion_arterial VARCHAR(20),
    frecuencia_cardiaca NUMERIC(5,2),
    frecuencia_respiratoria NUMERIC(5,2),
    temperatura NUMERIC(4,1),
    saturacion_oxigeno NUMERIC(5,2),
    peso NUMERIC(6,2),
    talla_cintura NUMERIC(6,2),
    altura NUMERIC(6,2),
    observaciones VARCHAR(4000),
    CONSTRAINT fk_expediente_paciente
        FOREIGN KEY (id_paciente) REFERENCES paciente(id_paciente),
    CONSTRAINT fk_expediente_medico
        FOREIGN KEY (id_medico) REFERENCES medico(id_medico),
    CONSTRAINT fk_expediente_diagnostico
        FOREIGN KEY (id_diagnostico) REFERENCES diagnostico(id_diagnostico),
    CONSTRAINT fk_expediente_estatus
        FOREIGN KEY (id_estatus_expediente) REFERENCES estatus_expediente(id_estatus_expediente),
    CONSTRAINT ck_expediente_fc
        CHECK (frecuencia_cardiaca IS NULL OR frecuencia_cardiaca > 0),
    CONSTRAINT ck_expediente_fr
        CHECK (frecuencia_respiratoria IS NULL OR frecuencia_respiratoria > 0),
    CONSTRAINT ck_expediente_temp
        CHECK (temperatura IS NULL OR (temperatura >= 0 AND temperatura < 80)),
    CONSTRAINT ck_expediente_saturacion
        CHECK (saturacion_oxigeno IS NULL OR (saturacion_oxigeno >= 0 AND saturacion_oxigeno <= 100)),
    CONSTRAINT ck_expediente_peso
        CHECK (peso IS NULL OR peso > 0),
    CONSTRAINT ck_expediente_talla_cintura
        CHECK (talla_cintura IS NULL OR talla_cintura > 0),
    CONSTRAINT ck_expediente_altura
        CHECK (altura IS NULL OR altura > 0)
);

CREATE TABLE tratamiento (
    id_tratamiento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_expediente INTEGER NOT NULL,
    id_tipo_tratamiento INTEGER NOT NULL,
    id_medicamento INTEGER,
    indicacion VARCHAR(4000),
    dosis VARCHAR(100),
    frecuencia VARCHAR(100),
    duracion VARCHAR(100),
    observaciones VARCHAR(1000),
    CONSTRAINT fk_tratamiento_expediente
        FOREIGN KEY (id_expediente) REFERENCES expediente_clinico(id_expediente),
    CONSTRAINT fk_tratamiento_tipo
        FOREIGN KEY (id_tipo_tratamiento) REFERENCES tipo_tratamiento(id_tipo_tratamiento),
    CONSTRAINT fk_tratamiento_medicamento
        FOREIGN KEY (id_medicamento) REFERENCES medicamento(id_medicamento)
);

-- TABLA HISTORIAL, AUDITORÍA E ÍNDICES 
SET search_path TO digiclin;

CREATE TABLE historial_expediente (
    id_historial INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_expediente INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tipo_accion VARCHAR(30) NOT NULL,
    campo_modificado VARCHAR(100),
    valor_anterior VARCHAR(4000),
    valor_nuevo VARCHAR(4000),
    motivo_cambio VARCHAR(500),
    CONSTRAINT fk_historial_expediente
        FOREIGN KEY (id_expediente) REFERENCES expediente_clinico(id_expediente),
    CONSTRAINT fk_historial_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    CONSTRAINT ck_historial_tipo_accion
        CHECK (tipo_accion IN ('CREACION', 'MODIFICACION', 'ARCHIVADO', 'CONSULTA'))
);

CREATE TABLE auditoria (
    id_auditoria INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tabla_afectada VARCHAR(50) NOT NULL,
    id_registro_afectado INTEGER NOT NULL,
    accion VARCHAR(20) NOT NULL,
    id_usuario INTEGER NOT NULL,
    fecha_evento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valor_anterior VARCHAR(4000),
    valor_nuevo VARCHAR(4000),
    descripcion_evento VARCHAR(1000),
    CONSTRAINT fk_auditoria_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    CONSTRAINT ck_auditoria_accion
        CHECK (accion IN ('INSERT', 'UPDATE', 'DELETE', 'CONSULTA'))
);

-- Indices
CREATE INDEX idx_paciente_nombre
    ON paciente (apellido_pat, apellido_mat, nombre_p);

CREATE INDEX idx_expediente_paciente
    ON expediente_clinico (id_paciente);

CREATE INDEX idx_expediente_medico
    ON expediente_clinico (id_medico);

CREATE INDEX idx_expediente_diagnostico
    ON expediente_clinico (id_diagnostico);

CREATE INDEX idx_expediente_fecha
    ON expediente_clinico (fecha_consulta);