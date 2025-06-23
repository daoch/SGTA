SET search_path TO sgtadb;

DROP FUNCTION IF EXISTS listar_etapas_formativas_simple CASCADE;
DROP FUNCTION IF EXISTS obtener_detalle_etapa_formativa CASCADE;
DROP FUNCTION IF EXISTS obtener_historial_ciclos_etapa_formativa CASCADE;

-- Función para obtener listado simple de etapas formativas
CREATE OR REPLACE FUNCTION listar_etapas_formativas_simple()
    RETURNS TABLE
            (
                id              INTEGER,
                nombre          TEXT,
                carrera_nombre  TEXT,
                estado          TEXT
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
        SELECT ef.etapa_formativa_id,
               ef.nombre::TEXT,
               c.nombre::TEXT as carrera_nombre,
               CASE
                   WHEN EXISTS (
                       SELECT 1
                       FROM etapa_formativa_x_ciclo efc
                       WHERE efc.etapa_formativa_id = ef.etapa_formativa_id
                         AND efc.activo = true
                   ) THEN 
                       (SELECT efc.estado::TEXT
                        FROM etapa_formativa_x_ciclo efc
                        WHERE efc.etapa_formativa_id = ef.etapa_formativa_id
                          AND efc.activo = true
                        ORDER BY efc.etapa_formativa_x_ciclo_id DESC
                        LIMIT 1)
                   ELSE 'Por Asignar'::TEXT
                   END as estado
        FROM etapa_formativa ef
                 JOIN carrera c ON ef.carrera_id = c.carrera_id
        WHERE ef.activo = true
        ORDER BY ef.nombre;
END;
$$;

-- Función para obtener detalle de una etapa formativa
CREATE OR REPLACE FUNCTION obtener_detalle_etapa_formativa(p_etapa_id INTEGER)
    RETURNS TABLE
            (
                id                  INTEGER,
                nombre              TEXT,
                carrera_nombre      TEXT,
                carrera_id          INTEGER,
                creditaje_por_tema  NUMERIC(6,2),
                activo              BOOLEAN,
                ciclo_actual        TEXT,
                estado_actual       TEXT,
                duracion_exposicion INTERVAL
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
        SELECT ef.etapa_formativa_id,
               ef.nombre::TEXT,
               c.nombre::TEXT as carrera_nombre,
               c.carrera_id,
               ef.creditaje_por_tema,
               ef.activo,
               (SELECT (ciclo.anio || ' ' || ciclo.semestre)::TEXT
                FROM etapa_formativa_x_ciclo efc
                         JOIN ciclo ON efc.ciclo_id = ciclo.ciclo_id
                WHERE efc.etapa_formativa_id = ef.etapa_formativa_id
                  AND efc.activo = true
                ORDER BY ciclo.anio DESC, ciclo.semestre DESC
                LIMIT 1) as ciclo_actual,
               CASE
                   WHEN EXISTS (
                       SELECT 1
                       FROM etapa_formativa_x_ciclo efc
                       WHERE efc.etapa_formativa_id = ef.etapa_formativa_id
                         AND efc.activo = true
                   ) THEN 
                       (SELECT efc.estado::TEXT
                        FROM etapa_formativa_x_ciclo efc
                        WHERE efc.etapa_formativa_id = ef.etapa_formativa_id
                          AND efc.activo = true
                        ORDER BY efc.etapa_formativa_x_ciclo_id DESC
                        LIMIT 1)
                   ELSE 'Por Asignar'::TEXT
                   END as estado_actual,
               ef.duracion_exposicion
        FROM etapa_formativa ef
                 JOIN carrera c ON ef.carrera_id = c.carrera_id
        WHERE ef.etapa_formativa_id = p_etapa_id;
END;
$$;

-- Función para obtener historial de ciclos de una etapa formativa
CREATE OR REPLACE FUNCTION obtener_historial_ciclos_etapa_formativa(p_etapa_id INTEGER)
    RETURNS TABLE
            (
                id      INTEGER,
                ciclo   TEXT,
                estado  TEXT
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
        SELECT efc.etapa_formativa_x_ciclo_id,
               (ciclo.anio || ' ' || ciclo.semestre)::TEXT as ciclo,
               efc.estado::TEXT
        FROM etapa_formativa_x_ciclo efc
                 JOIN ciclo ON efc.ciclo_id = ciclo.ciclo_id
        WHERE efc.etapa_formativa_id = p_etapa_id
        ORDER BY ciclo.anio DESC, ciclo.semestre DESC;
END;
$$;

-- Función para listar etapas formativas x ciclo del tesista según la carrera de su último tema inscrito
CREATE OR REPLACE FUNCTION listar_etapas_formativas_x_ciclo_tesista(p_usuario_id INTEGER)
    RETURNS TABLE
            (
                id                      INTEGER,
                etapa_formativa_id      INTEGER,
                etapa_formativa_nombre  TEXT,
                ciclo_id                INTEGER,
                ciclo_nombre            TEXT,
                carrera_id              INTEGER,
                carrera_nombre          TEXT,
                activo                  BOOLEAN,
                estado                  TEXT
            )
    LANGUAGE plpgsql
AS
$$
DECLARE
    v_carrera_id INTEGER;
BEGIN
    -- Obtener la carrera del último tema en el que está inscrito el tesista
    SELECT t.carrera_id INTO v_carrera_id
    FROM usuario_tema ut
    JOIN tema t ON ut.tema_id = t.tema_id
    JOIN rol r ON ut.rol_id = r.rol_id
    WHERE ut.usuario_id = p_usuario_id
      AND r.nombre = 'Tesista'
      AND ut.activo = true
      AND ut.asignado = true
      AND t.activo = true
    ORDER BY ut.fecha_creacion DESC
    LIMIT 1;

    -- Si no se encuentra carrera, retornar vacío
    IF v_carrera_id IS NULL THEN
        RETURN;
    END IF;

    -- Retornar las etapas formativas x ciclo de esa carrera
    RETURN QUERY
    SELECT 
        efc.etapa_formativa_x_ciclo_id,
        ef.etapa_formativa_id,
        ef.nombre::TEXT as etapa_formativa_nombre,
        c.ciclo_id,
        (c.anio || ' - ' || c.semestre)::TEXT as ciclo_nombre,
        car.carrera_id,
        car.nombre::TEXT as carrera_nombre,
        efc.activo,
        efc.estado::TEXT
    FROM etapa_formativa_x_ciclo efc
    JOIN etapa_formativa ef ON efc.etapa_formativa_id = ef.etapa_formativa_id
    JOIN ciclo c ON efc.ciclo_id = c.ciclo_id
    JOIN carrera car ON ef.carrera_id = car.carrera_id
    WHERE ef.carrera_id = v_carrera_id
      AND efc.activo = true
      AND ef.activo = true
      AND c.activo = true
    ORDER BY c.anio DESC, c.semestre DESC, ef.nombre;
END;
$$;


