# Base de Datos DIGICLIN

## Archivos

- `schema.sql`: estructura completa de la base de datos. Incluye tablas, relaciones, constraints, índices, vistas, funciones, procedimientos almacenados, tablas bitácora y triggers.
- `seed.sql`: datos iniciales del sistema.
- `validation.sql`: script de validación de estructura y registros de la base de datos.

---

## Cómo ejecutar

1. Abrir pgAdmin.
2. Conectarse a la base de datos `digiclin`.
3. Abrir Query Tool.
4. Ejecutar primero el contenido de `schema.sql`.
5. Ejecutar después el contenido de `seed.sql`.
6. Ejecutar finalmente el contenido de `validation.sql`.

---

## Tablas principales

- `usuario`: gestión de usuarios del sistema.
- `rol`: roles de usuario.
- `paciente`: información de pacientes.
- `expediente_clinico`: consultas médicas y expedientes clínicos.
- `tratamiento`: tratamientos asociados a expedientes.
- `diagnostico`: diagnósticos médicos registrados.

---

## Contenido del schema.sql

El archivo `schema.sql` contiene:

- Creación del esquema `digiclin`
- Tablas del modelo relacional
- Llaves primarias y foráneas
- Constraints (`CHECK`, `UNIQUE`, `NOT NULL`, `DEFAULT`)
- Índices
- Vistas
- Funciones
- Procedimientos almacenados
- Tablas bitácora
- Triggers de auditoría

---

## Bitácoras y triggers

El sistema crea automáticamente tablas bitácora para registrar operaciones realizadas sobre las tablas principales.

Cada tabla bitácora almacena:

- Datos originales del registro
- `accion_bitacora`
  - `A` = Alta (`INSERT`)
  - `B` = Baja (`DELETE`)
  - `C` = Cambio (`UPDATE`)
- `usuario_bitacora`
- `fecha_bitacora`

Los triggers registrados son:

- `AFTER INSERT`
- `AFTER UPDATE`
- `BEFORE DELETE`

---

## Procedimientos almacenados

El sistema incluye procedimientos almacenados para operaciones CRUD y lógica del negocio, por ejemplo:

- Gestión de usuarios
- Gestión de pacientes
- Creación y actualización de expedientes clínicos
- Archivado de expedientes clínicos

---

## Vistas

Las vistas permiten simplificar consultas complejas mediante `JOINs` y filtros.

Ejemplos:

- `vw_usuarios_activos`
- `vw_paciente_completo`
- `vw_expedientes`
- `vw_expedientes_abiertos`
- `vw_expedientes_archivados`

---

## Validación

El archivo `validation.sql` permite validar:

- Existencia de tablas
- Existencia de vistas
- Existencia de funciones y procedimientos
- Constraints
- Triggers
- Índices
- Cantidad de registros mediante consultas `COUNT(*)`

Esto permite comprobar que la base de datos fue reconstruida correctamente después de ejecutar los scripts.

---

## Flujo de reconstrucción

1. Ejecutar `validation.sql` para obtener evidencia inicial.
2. Eliminar o recrear la base de datos.
3. Ejecutar `schema.sql`.
4. Ejecutar `seed.sql`.
5. Ejecutar nuevamente `validation.sql`.
6. Comparar resultados de validación.

---

## Notas

- La base de datos puede reconstruirse completamente usando los scripts incluidos.
- Los datos de `seed.sql` respetan las relaciones y llaves foráneas definidas.
- El sistema utiliza PostgreSQL.
- Las credenciales de conexión no se incluyen en el repositorio por seguridad.
