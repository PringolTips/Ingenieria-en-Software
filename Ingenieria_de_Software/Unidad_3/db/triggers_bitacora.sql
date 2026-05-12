SET search_path TO digiclin;
-- hacer las tablas bitacora automaticamente
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'digiclin'
          AND table_type = 'BASE TABLE'
          AND table_name NOT LIKE '%_bitacora' ESCAPE '\'
    LOOP
        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS digiclin.%I_bitacora (
                id_%I_bitacora BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                LIKE digiclin.%I,
                accion_bitacora CHAR(1) NOT NULL CHECK (accion_bitacora IN (''A'', ''B'', ''C'')),
                usuario_bitacora VARCHAR(100) NOT NULL DEFAULT current_user,
                fecha_bitacora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );',
            r.table_name,
            r.table_name,
            r.table_name
        );
    END LOOP;
END;
$$;


-- Función general para insertar en la tabla bitácora correspondiente
CREATE OR REPLACE FUNCTION digiclin.fn_bitacora_general()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
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
$$;

--triggers automaticos

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'digiclin'
          AND table_type = 'BASE TABLE'
          AND table_name NOT LIKE '%_bitacora'ESCAPE '\'
    LOOP
        -- INSERT = AFTER
        EXECUTE format(
            'DROP TRIGGER IF EXISTS trg_%I_ai ON digiclin.%I;',
            r.table_name,
            r.table_name
        );

        EXECUTE format(
            'CREATE TRIGGER trg_%I_ai
             AFTER INSERT ON digiclin.%I
             FOR EACH ROW
             EXECUTE FUNCTION digiclin.fn_bitacora_general();',
            r.table_name,
            r.table_name
        );

        -- UPDATE = AFTER
        EXECUTE format(
            'DROP TRIGGER IF EXISTS trg_%I_au ON digiclin.%I;',
            r.table_name,
            r.table_name
        );

        EXECUTE format(
            'CREATE TRIGGER trg_%I_au
             AFTER UPDATE ON digiclin.%I
             FOR EACH ROW
             EXECUTE FUNCTION digiclin.fn_bitacora_general();',
            r.table_name,
            r.table_name
        );

        -- DELETE = BEFORE
        EXECUTE format(
            'DROP TRIGGER IF EXISTS trg_%I_bd ON digiclin.%I;',
            r.table_name,
            r.table_name
        );

        EXECUTE format(
            'CREATE TRIGGER trg_%I_bd
             BEFORE DELETE ON digiclin.%I
             FOR EACH ROW
             EXECUTE FUNCTION digiclin.fn_bitacora_general();',
            r.table_name,
            r.table_name
        );
    END LOOP;
END;
$$;