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


