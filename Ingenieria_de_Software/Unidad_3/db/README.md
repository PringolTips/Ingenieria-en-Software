## Base de Datos DIGICLIN

### Archivos

* `schema.sql`: estructura de la base de datos (tablas, relaciones, constraints)
* `seed.sql`: datos iniciales del sistema
* `views.sql`: vistas para consultas
* `procedures.sql`: procedimientos almacenados (CRUD)

### Cómo ejecutar

1. Abrir pgAdmin.
2. Conectarse a la base de datos `digiclin`.
3. Abrir Query Tool.
4. Ejecutar primero el contenido de `schema.sql`.
5. Ejecutar después el contenido de `seed.sql`.
6. Ejecutar después el contenido de `views.sql`.
7. Ejecutar finalmente el contenido de `procedures.sql`.

### Tablas principales

* `usuario`: gestión de usuarios del sistema
* `rol`: roles de usuario (Admin, Médico, Enfermero,Director, Administrativo)
* `paciente`: información de pacientes
* `expediente_clinico`: consultas médicas
* `tratamiento`: tratamientos asociados a expedientes
