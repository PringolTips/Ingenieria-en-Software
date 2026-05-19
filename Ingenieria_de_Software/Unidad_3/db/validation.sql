-- ============================================================
-- DIAGNÓSTICO COMPLETO DE BASE DE DATOS - PostgreSQL / pgAdmin
-- Proyecto: DIGICLIN
-- Muestra:
-- Tablas, columnas, PK, FK, CHECK, UNIQUE, DEFAULT, NOT NULL,
-- Views, Procedures, Functions, Triggers, Índices y registros.
-- ============================================================

SET app.schema_consulta = 'digiclin';

DROP TABLE IF EXISTS pg_temp.tmp_reporte_bd;

CREATE TEMP TABLE tmp_reporte_bd (
    orden INT,
    seccion TEXT,
    tipo_objeto TEXT,
    objeto TEXT,
    detalle TEXT,
    cantidad BIGINT
);

-- ============================================================
-- 1. RESUMEN GENERAL
-- ============================================================

INSERT INTO tmp_reporte_bd
SELECT 
    10,
    'RESUMEN GENERAL',
    'TABLAS',
    current_setting('app.schema_consulta'),
    'Cantidad total de tablas base',
    COUNT(*)::BIGINT
FROM information_schema.tables
WHERE table_schema = current_setting('app.schema_consulta')
  AND table_type = 'BASE TABLE';

INSERT INTO tmp_reporte_bd
SELECT 
    20,
    'RESUMEN GENERAL',
    'VIEWS',
    current_setting('app.schema_consulta'),
    'Cantidad total de vistas',
    COUNT(*)::BIGINT
FROM information_schema.views
WHERE table_schema = current_setting('app.schema_consulta');

INSERT INTO tmp_reporte_bd
SELECT 
    30,
    'RESUMEN GENERAL',
    'PROCEDURES',
    current_setting('app.schema_consulta'),
    'Cantidad total de procedimientos',
    COUNT(*)::BIGINT
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = current_setting('app.schema_consulta')
  AND p.prokind = 'p';

INSERT INTO tmp_reporte_bd
SELECT 
    40,
    'RESUMEN GENERAL',
    'FUNCTIONS',
    current_setting('app.schema_consulta'),
    'Cantidad total de funciones',
    COUNT(*)::BIGINT
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = current_setting('app.schema_consulta')
  AND p.prokind = 'f';

INSERT INTO tmp_reporte_bd
SELECT 
    50,
    'RESUMEN GENERAL',
    'TRIGGERS',
    current_setting('app.schema_consulta'),
    'Cantidad total de triggers',
    COUNT(*)::BIGINT
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = current_setting('app.schema_consulta')
  AND NOT t.tgisinternal;

INSERT INTO tmp_reporte_bd
SELECT 
    60,
    'RESUMEN GENERAL',
    'PRIMARY KEYS',
    current_setting('app.schema_consulta'),
    'Cantidad total de PK',
    COUNT(*)::BIGINT
FROM pg_constraint con
JOIN pg_class c ON con.conrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = current_setting('app.schema_consulta')
  AND con.contype = 'p';

INSERT INTO tmp_reporte_bd
SELECT 
    70,
    'RESUMEN GENERAL',
    'FOREIGN KEYS',
    current_setting('app.schema_consulta'),
    'Cantidad total de FK',
    COUNT(*)::BIGINT
FROM pg_constraint con
JOIN pg_class c ON con.conrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = current_setting('app.schema_consulta')
  AND con.contype = 'f';

INSERT INTO tmp_reporte_bd
SELECT 
    80,
    'RESUMEN GENERAL',
    'CHECKS',
    current_setting('app.schema_consulta'),
    'Cantidad total de CHECK',
    COUNT(*)::BIGINT
FROM pg_constraint con
JOIN pg_class c ON con.conrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = current_setting('app.schema_consulta')
  AND con.contype = 'c';

INSERT INTO tmp_reporte_bd
SELECT 
    90,
    'RESUMEN GENERAL',
    'UNIQUE',
    current_setting('app.schema_consulta'),
    'Cantidad total de restricciones UNIQUE',
    COUNT(*)::BIGINT
FROM pg_constraint con
JOIN pg_class c ON con.conrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = current_setting('app.schema_consulta')
  AND con.contype = 'u';

INSERT INTO tmp_reporte_bd
SELECT 
    100,
    'RESUMEN GENERAL',
    'NOT NULL',
    current_setting('app.schema_consulta'),
    'Cantidad total de columnas NOT NULL',
    COUNT(*)::BIGINT
FROM information_schema.columns
WHERE table_schema = current_setting('app.schema_consulta')
  AND is_nullable = 'NO';

INSERT INTO tmp_reporte_bd
SELECT 
    110,
    'RESUMEN GENERAL',
    'DEFAULT',
    current_setting('app.schema_consulta'),
    'Cantidad total de columnas con DEFAULT',
    COUNT(*)::BIGINT
FROM information_schema.columns
WHERE table_schema = current_setting('app.schema_consulta')
  AND column_default IS NOT NULL;

INSERT INTO tmp_reporte_bd
SELECT 
    120,
    'RESUMEN GENERAL',
    'ÍNDICES',
    current_setting('app.schema_consulta'),
    'Cantidad total de índices',
    COUNT(*)::BIGINT
FROM pg_indexes
WHERE schemaname = current_setting('app.schema_consulta');


-- ============================================================
-- 2. DETALLE DE TABLAS CON CANTIDAD REAL DE REGISTROS
-- ============================================================

DO $$
DECLARE
    r RECORD;
    v_schema TEXT := current_setting('app.schema_consulta');
    v_total BIGINT;
BEGIN
    FOR r IN
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_schema = v_schema
          AND table_type = 'BASE TABLE'
        ORDER BY table_name
    LOOP
        EXECUTE format(
            'SELECT COUNT(*) FROM %I.%I',
            r.table_schema,
            r.table_name
        )
        INTO v_total;

        INSERT INTO tmp_reporte_bd
        VALUES (
            200,
            'DETALLE - TABLAS',
            'TABLA',
            r.table_name,
            'Tabla base del schema ' || r.table_schema || ' con ' || v_total || ' registros',
            v_total
        );
    END LOOP;
END $$;


-- ============================================================
-- 3. DETALLE DE COLUMNAS
-- ============================================================

INSERT INTO tmp_reporte_bd
SELECT
    300,
    'DETALLE - COLUMNAS',
    'COLUMNA',
    c.table_name || '.' || c.column_name,
    'Tipo: ' || c.data_type ||
    COALESCE(
        CASE 
            WHEN c.character_maximum_length IS NOT NULL 
                THEN '(' || c.character_maximum_length || ')'
            WHEN c.numeric_precision IS NOT NULL 
                THEN '(' || c.numeric_precision || ',' || c.numeric_scale || ')'
            ELSE ''
        END,
        ''
    ) ||
    ' | NOT NULL: ' ||
    CASE 
        WHEN c.is_nullable = 'NO' THEN 'SI'
        ELSE 'NO'
    END ||
    ' | DEFAULT: ' || COALESCE(c.column_default, 'SIN DEFAULT'),
    1::BIGINT
FROM information_schema.columns c
WHERE c.table_schema = current_setting('app.schema_consulta');


-- ============================================================
-- 4. DETALLE DE COLUMNAS NOT NULL
-- ============================================================

INSERT INTO tmp_reporte_bd
SELECT
    400,
    'DETALLE - NOT NULL',
    'NOT NULL',
    c.table_name || '.' || c.column_name,
    'La columna no permite valores NULL',
    1::BIGINT
FROM information_schema.columns c
WHERE c.table_schema = current_setting('app.schema_consulta')
  AND c.is_nullable = 'NO';


-- ============================================================
-- 5. DETALLE DE COLUMNAS CON DEFAULT
-- ============================================================

INSERT INTO tmp_reporte_bd
SELECT
    500,
    'DETALLE - DEFAULT',
    'DEFAULT',
    c.table_name || '.' || c.column_name,
    c.column_default,
    1::BIGINT
FROM information_schema.columns c
WHERE c.table_schema = current_setting('app.schema_consulta')
  AND c.column_default IS NOT NULL;


-- ============================================================
-- 6. DETALLE DE CONSTRAINTS: PK, FK, CHECK, UNIQUE
-- ============================================================

INSERT INTO tmp_reporte_bd
SELECT
    600,
    'DETALLE - CONSTRAINTS',
    CASE con.contype
        WHEN 'p' THEN 'PRIMARY KEY'
        WHEN 'f' THEN 'FOREIGN KEY'
        WHEN 'c' THEN 'CHECK'
        WHEN 'u' THEN 'UNIQUE'
        ELSE con.contype::TEXT
    END,
    cls.relname || '.' || con.conname,
    pg_get_constraintdef(con.oid),
    1::BIGINT
FROM pg_constraint con
JOIN pg_class cls ON con.conrelid = cls.oid
JOIN pg_namespace nsp ON cls.relnamespace = nsp.oid
WHERE nsp.nspname = current_setting('app.schema_consulta')
  AND con.contype IN ('p', 'f', 'c', 'u');


-- ============================================================
-- 7. DETALLE DE VIEWS
-- ============================================================

INSERT INTO tmp_reporte_bd
SELECT
    700,
    'DETALLE - VIEWS',
    'VIEW',
    c.relname,
    pg_get_viewdef(c.oid, true),
    1::BIGINT
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = current_setting('app.schema_consulta')
  AND c.relkind = 'v';


-- ============================================================
-- 8. DETALLE DE PROCEDURES Y FUNCTIONS
-- ============================================================

INSERT INTO tmp_reporte_bd
SELECT
    800,
    'DETALLE - PROCEDURES / FUNCTIONS',
    CASE p.prokind
        WHEN 'p' THEN 'PROCEDURE'
        WHEN 'f' THEN 'FUNCTION'
        ELSE 'RUTINA'
    END,
    p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')',
    pg_get_functiondef(p.oid),
    1::BIGINT
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = current_setting('app.schema_consulta')
  AND p.prokind IN ('p', 'f');


-- ============================================================
-- 9. DETALLE DE TRIGGERS
-- ============================================================

INSERT INTO tmp_reporte_bd
SELECT
    900,
    'DETALLE - TRIGGERS',
    'TRIGGER',
    c.relname || '.' || t.tgname,
    pg_get_triggerdef(t.oid),
    1::BIGINT
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = current_setting('app.schema_consulta')
  AND NOT t.tgisinternal;


-- ============================================================
-- 10. DETALLE DE ÍNDICES
-- ============================================================

INSERT INTO tmp_reporte_bd
SELECT
    1000,
    'DETALLE - ÍNDICES',
    'INDEX',
    i.tablename || '.' || i.indexname,
    i.indexdef,
    1::BIGINT
FROM pg_indexes i
WHERE i.schemaname = current_setting('app.schema_consulta');


-- ============================================================
-- 11. CONTEO DE REGISTROS POR TABLA
-- Esta sección repite el conteo, pero agrupado claramente.
-- ============================================================

DO $$
DECLARE
    r RECORD;
    v_orden INT := 2000;
    v_schema TEXT := current_setting('app.schema_consulta');
BEGIN
    FOR r IN
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_schema = v_schema
          AND table_type = 'BASE TABLE'
        ORDER BY table_name
    LOOP
        v_orden := v_orden + 1;

        EXECUTE format(
            'INSERT INTO tmp_reporte_bd
             SELECT %s, %L, %L, %L, %L, COUNT(*)::BIGINT
             FROM %I.%I',
            v_orden,
            'CONTEO - REGISTROS POR TABLA',
            'REGISTROS',
            r.table_name,
            'Cantidad de filas en la tabla ' || r.table_name,
            r.table_schema,
            r.table_name
        );
    END LOOP;
END $$;


-- ============================================================
-- RESULTADO FINAL
-- ============================================================

SELECT
    seccion,
    tipo_objeto,
    objeto,
    detalle,
    cantidad
FROM tmp_reporte_bd
ORDER BY 
    CASE 
        WHEN seccion = 'RESUMEN GENERAL' THEN 1
        WHEN seccion = 'DETALLE - TABLAS' THEN 2
        WHEN seccion = 'CONTEO - REGISTROS POR TABLA' THEN 3
        ELSE 4
    END,
    orden,
    tipo_objeto,
    objeto;