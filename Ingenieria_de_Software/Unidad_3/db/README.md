# Base de Datos DIGICLIN

## Archivos

- `schema.sql`: estructura de la base de datos (tablas, relaciones, constraints)
- `seed.sql`: datos iniciales del sistema
- `views.sql`: vistas para consultas frecuentes
- `procedures.sql`: procedimientos almacenados (CRUD)
- `queries.sql`: consultas base del sistema (SELECT con filtros y JOINs)
- `triggers_bitacora.sql`: creación automática de tablas bitácora y triggers de auditoría

---

## Cómo ejecutar

1. Abrir pgAdmin.
2. Conectarse a la base de datos `digiclin`.
3. Abrir Query Tool.
4. Ejecutar primero el contenido de `schema.sql`.
5. Ejecutar después el contenido de `seed.sql`.
6. Ejecutar después el contenido de `views.sql`.
7. Ejecutar después el contenido de `procedures.sql`.
8. Ejecutar después el contenido de `queries.sql`.
9. Ejecutar finalmente el contenido de `triggers_bitacora.sql`.

---

## Tablas principales

- `usuario`: gestión de usuarios del sistema
- `rol`: roles de usuario (Admin, Médico, Enfermero, Director, Administrativo)
- `paciente`: información de pacientes
- `expediente_clinico`: consultas médicas
- `tratamiento`: tratamientos asociados a expedientes

---

## Consultas principales

El archivo `queries.sql` contiene consultas utilizadas por el sistema:

- Listar usuarios con rol y estatus
- Buscar usuario por correo
- Buscar pacientes por nombre o apellido
- Consultar expedientes con paciente, médico y diagnóstico
- Consultar tratamientos por expediente

Estas consultas utilizan filtros (`WHERE`) y relaciones (`JOINs`).

---

## Bitácoras y triggers
El archivo `triggers_bitacora.sql` crea automáticamente una tabla bitácora por cada tabla principal del esquema `digiclin`.

Cada tabla bitácora almacena:
- Los mismos campos de la tabla original
- `accion_bitacora`
  - `A` = Alta (`INSERT`)
  - `B` = Baja (`DELETE`)
  - `C` = Cambio (`UPDATE`)
- `usuario_bitacora`
- `fecha_bitacora`

Los triggers se crean automáticamente para cada tabla:
- `AFTER INSERT`
- `AFTER UPDATE`
- `BEFORE DELETE`
Las tablas bitácora no contienen triggers para evitar referencias circulares.
