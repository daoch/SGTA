CREATE OR REPLACE FUNCTION get_advisor_distribution_by_coordinator_and_ciclo(
    p_usuario_id    INTEGER,
    p_ciclo_nombre  VARCHAR
)
  RETURNS TABLE(
    teacher_name   VARCHAR,
    area_name      VARCHAR,
    advisor_count  BIGINT
  )
  LANGUAGE plpgsql
  COST 100
  VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_carrera_id  INTEGER;
    v_ciclo_id    INTEGER;
    v_semestre    VARCHAR;
    v_anio        INTEGER;
BEGIN
    v_anio     := split_part(p_ciclo_nombre,'-',1)::INT;
    v_semestre := split_part(p_ciclo_nombre,'-',2);

    SELECT carrera_id
      INTO v_carrera_id
      FROM usuario_carrera
     WHERE usuario_id = p_usuario_id
       AND activo
     LIMIT 1;

    SELECT ciclo_id
      INTO v_ciclo_id
      FROM ciclo
     WHERE semestre = v_semestre
       AND anio     = v_anio
       AND activo
     LIMIT 1;

    RETURN QUERY
    SELECT
      -- casteo explícito a VARCHAR
      CAST(
        CONCAT(u.nombres,' ',
               u.primer_apellido,' ',
               COALESCE(u.segundo_apellido,''))
      AS VARCHAR)                                             AS teacher_name,

      CAST(ac.nombre AS VARCHAR)                              AS area_name,

      COUNT(DISTINCT t.tema_id)                               AS advisor_count

    FROM usuario                    u
    JOIN usuario_tema               ut  ON ut.usuario_id = u.usuario_id
                                       AND ut.activo
    JOIN rol                        r   ON r.rol_id    = ut.rol_id
                                       AND r.nombre   = 'Asesor'
    JOIN tema                       t   ON t.tema_id   = ut.tema_id
                                       AND t.activo
    JOIN sub_area_conocimiento_tema sact ON sact.tema_id = t.tema_id
                                       AND sact.activo
    JOIN sub_area_conocimiento     sac  ON sac.sub_area_conocimiento_id = sact.sub_area_conocimiento_id
                                       AND sac.activo
    JOIN area_conocimiento         ac   ON ac.area_conocimiento_id   = sac.area_conocimiento_id
                                       AND ac.activo
    JOIN usuario_carrera           ucP  ON ucP.usuario_id = u.usuario_id
                                       AND ucP.carrera_id = v_carrera_id
                                       AND ucP.activo
    LEFT JOIN exposicion_x_tema     ext ON ext.tema_id    = t.tema_id
                                       AND ext.activo
    LEFT JOIN exposicion            e   ON e.exposicion_id = ext.exposicion_id
                                       AND e.activo
    LEFT JOIN etapa_formativa_x_ciclo efc ON efc.etapa_formativa_x_ciclo_id = e.etapa_formativa_x_ciclo_id
                                       AND efc.activo
    LEFT JOIN ciclo                 ci  ON ci.ciclo_id    = efc.ciclo_id
                                       AND ci.activo

    WHERE (ci.ciclo_id = v_ciclo_id OR ci.ciclo_id IS NULL)

    GROUP BY teacher_name, area_name
    ORDER BY advisor_count DESC;
END;
$BODY$;

ALTER FUNCTION get_advisor_distribution_by_coordinator_and_ciclo(integer, varchar)
  OWNER TO postgres;

-------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_juror_distribution_by_coordinator_and_ciclo(
    p_usuario_id    INTEGER,
    p_ciclo_nombre  VARCHAR
)
  RETURNS TABLE(
    teacher_name  VARCHAR,
    area_name     VARCHAR,
    juror_count   BIGINT
  )
  LANGUAGE plpgsql
  COST 100
  VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_carrera_id  INTEGER;
    v_ciclo_id    INTEGER;
    v_semestre    VARCHAR;
    v_anio        INTEGER;
BEGIN
    -- 1) Parseo de año y semestre
    v_anio     := split_part(p_ciclo_nombre,'-',1)::INT;
    v_semestre := split_part(p_ciclo_nombre,'-',2);

    -- 2) Carrera del coordinador
    SELECT carrera_id
      INTO v_carrera_id
      FROM usuario_carrera
     WHERE usuario_id = p_usuario_id
       AND activo
     LIMIT 1;

    -- 3) Ciclo meta
    SELECT ciclo_id
      INTO v_ciclo_id
      FROM ciclo
     WHERE semestre = v_semestre
       AND anio     = v_anio
       AND activo
     LIMIT 1;

    -- 4) Consulta principal
    RETURN QUERY
    SELECT
      -- Nombre completo del jurado, casteado a VARCHAR
      CAST(
        CONCAT(u.nombres,' ',
               u.primer_apellido,' ',
               COALESCE(u.segundo_apellido,''))
      AS VARCHAR)                                             AS teacher_name,

      -- Nombre de área de conocimiento, casteado a VARCHAR
      CAST(ac.nombre AS VARCHAR)                              AS area_name,

      -- Conteo de temas distintos en los que actuó como jurado este ciclo
      COUNT(DISTINCT t.tema_id)                               AS juror_count

    FROM usuario                    u
    JOIN usuario_tema               ut  ON ut.usuario_id    = u.usuario_id
                                        AND ut.activo
    JOIN rol                        r   ON r.rol_id         = ut.rol_id
                                        AND r.nombre        = 'Jurado'
    JOIN tema                       t   ON t.tema_id        = ut.tema_id
                                        AND t.activo
    JOIN sub_area_conocimiento_tema sact ON sact.tema_id     = t.tema_id
                                        AND sact.activo
    JOIN sub_area_conocimiento     sac  ON sac.sub_area_conocimiento_id = sact.sub_area_conocimiento_id
                                        AND sac.activo
    JOIN area_conocimiento         ac   ON ac.area_conocimiento_id     = sac.area_conocimiento_id
                                        AND ac.activo
    JOIN usuario_carrera           ucP  ON ucP.usuario_id    = u.usuario_id
                                        AND ucP.carrera_id   = v_carrera_id
                                        AND ucP.activo

    -- Unir con exposiciones para filtrar por ciclo o incluir temas no expuestos
    LEFT JOIN exposicion_x_tema     ext ON ext.tema_id        = t.tema_id
                                        AND ext.activo
    LEFT JOIN exposicion            e   ON e.exposicion_id    = ext.exposicion_id
                                        AND e.activo
    LEFT JOIN etapa_formativa_x_ciclo efc ON efc.etapa_formativa_x_ciclo_id = e.etapa_formativa_x_ciclo_id
                                        AND efc.activo
    LEFT JOIN ciclo                 ci  ON ci.ciclo_id        = efc.ciclo_id
                                        AND ci.activo

    WHERE (ci.ciclo_id = v_ciclo_id OR ci.ciclo_id IS NULL)

    GROUP  BY teacher_name, area_name
    ORDER  BY juror_count DESC;
END;
$BODY$;

ALTER FUNCTION get_juror_distribution_by_coordinator_and_ciclo(integer, varchar)
  OWNER TO postgres;

-------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_advisor_performance_by_user(
    p_usuario_id     INTEGER,
    p_ciclo_nombre   VARCHAR
)
  RETURNS TABLE(
    advisor_name           VARCHAR,
    area_name              VARCHAR,
    performance_percentage NUMERIC,
    total_students         INTEGER
  )
  LANGUAGE plpgsql
  COST 100
  VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_carrera_id INTEGER;
    v_ciclo_id   INTEGER;
    v_semestre   VARCHAR;
    v_anio       INTEGER;
BEGIN
    -- 1) Carrera del coordinador
    SELECT carrera_id
      INTO v_carrera_id
      FROM usuario_carrera
     WHERE usuario_id = p_usuario_id
       AND activo     = TRUE
     LIMIT 1;

    IF v_carrera_id IS NULL THEN
        RAISE EXCEPTION 'El usuario % no tiene carrera activa.', p_usuario_id;
    END IF;

    -- 2) Ciclo: año y semestre
    v_anio     := split_part(p_ciclo_nombre,'-',1)::INT;
    v_semestre := split_part(p_ciclo_nombre,'-',2);

    SELECT ciclo_id
      INTO v_ciclo_id
      FROM ciclo
     WHERE anio     = v_anio
       AND semestre = v_semestre
       AND activo   = TRUE
     LIMIT 1;

    IF v_ciclo_id IS NULL THEN
        RAISE EXCEPTION 'El ciclo % no existe o está inactivo.', p_ciclo_nombre;
    END IF;

    -- 3) Pipeline de datos y cálculos
    RETURN QUERY
    WITH advisor_topics AS (
      SELECT
        u.usuario_id,
        CAST(CONCAT(u.nombres,' ',u.primer_apellido,' ',COALESCE(u.segundo_apellido,'')) AS VARCHAR) AS advisor_name,
        ac.nombre AS area_name,
        t.tema_id
      FROM usuario             u
      JOIN usuario_tema        ut  ON ut.usuario_id = u.usuario_id AND ut.activo
      JOIN rol                 r   ON r.rol_id      = ut.rol_id    AND r.nombre = 'Asesor'
      JOIN tema                t   ON t.tema_id     = ut.tema_id   AND t.activo AND t.carrera_id = v_carrera_id
      JOIN sub_area_conocimiento_tema sact 
                                ON sact.tema_id    = t.tema_id   AND sact.activo
      JOIN sub_area_conocimiento     sac
                                ON sac.sub_area_conocimiento_id = sact.sub_area_conocimiento_id AND sac.activo
      JOIN area_conocimiento         ac
                                ON ac.area_conocimiento_id      = sac.area_conocimiento_id      AND ac.activo
      WHERE u.activo
    ),

    topic_deliveries AS (
      SELECT
        at.usuario_id,
        at.advisor_name,
        at.area_name,
        at.tema_id,
        COUNT(et.entregable_x_tema_id)                                        AS total_deliverables,
        COUNT(*) FILTER (WHERE et.estado <> 'no_enviado')                     AS submitted_deliverables
      FROM advisor_topics AS at
      LEFT JOIN entregable_x_tema   et  ON et.tema_id       = at.tema_id AND et.activo
      LEFT JOIN entregable          e   ON e.entregable_id  = et.entregable_id AND e.activo
      LEFT JOIN etapa_formativa_x_ciclo efc 
                                      ON efc.etapa_formativa_x_ciclo_id = e.etapa_formativa_x_ciclo_id
                                      AND efc.activo AND efc.ciclo_id = v_ciclo_id
      GROUP BY at.usuario_id, at.advisor_name, at.area_name, at.tema_id
    )

    SELECT
      td.advisor_name,
      td.area_name,
      ROUND(
        (SUM(td.submitted_deliverables)::NUMERIC
         / NULLIF(SUM(td.total_deliverables),0)
        ) * 100
      , 2) AS performance_percentage,
      CAST(COUNT(DISTINCT td.tema_id) AS INTEGER) AS total_students
    FROM topic_deliveries AS td
    GROUP BY td.usuario_id, td.advisor_name, td.area_name
    ORDER BY performance_percentage DESC, total_students DESC;
END;
$BODY$;

ALTER FUNCTION get_advisor_performance_by_user(integer, varchar)
  OWNER TO postgres;


-------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_topic_area_stats_by_user_and_ciclo(
    p_usuario_id     INTEGER,
    p_ciclo_nombre   VARCHAR
)
  RETURNS TABLE(
    area_name   VARCHAR,
    topic_count BIGINT
  )
  LANGUAGE plpgsql
  COST 100
  VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_carrera_id INTEGER;
    v_ciclo_id   INTEGER;
    v_semestre   VARCHAR;
    v_anio       INTEGER;
BEGIN
    -- 1) Parsear año y semestre
    v_anio     := split_part(p_ciclo_nombre,'-',1)::INT;
    v_semestre := split_part(p_ciclo_nombre,'-',2);

    -- 2) Obtener carrera del coordinador
    SELECT carrera_id
      INTO v_carrera_id
      FROM usuario_carrera
     WHERE usuario_id = p_usuario_id
       AND activo      = TRUE
     LIMIT 1;

    IF v_carrera_id IS NULL THEN
        RAISE EXCEPTION 'El usuario % no tiene carrera activa asignada', p_usuario_id;
    END IF;

    -- 3) Obtener ciclo
    SELECT ciclo_id
      INTO v_ciclo_id
      FROM ciclo
     WHERE semestre = v_semestre
       AND anio     = v_anio
       AND activo   = TRUE
     LIMIT 1;

    IF v_ciclo_id IS NULL THEN
        RAISE EXCEPTION 'El ciclo % no existe o está inactivo', p_ciclo_nombre;
    END IF;

    -- 4) Conteo de temas por área, filtrando por ciclo o incluyendo no expuestos
    RETURN QUERY
    SELECT
      CAST(ac.nombre AS VARCHAR)       AS area_name,
      COUNT(DISTINCT t.tema_id)        AS topic_count
    FROM area_conocimiento              ac
    JOIN sub_area_conocimiento          sac  ON sac.area_conocimiento_id           = ac.area_conocimiento_id
                                             AND sac.activo
    JOIN sub_area_conocimiento_tema     sact ON sact.sub_area_conocimiento_id       = sac.sub_area_conocimiento_id
                                             AND sact.activo
    JOIN tema                           t    ON t.tema_id                         = sact.tema_id
                                             AND t.activo
                                             AND t.carrera_id = v_carrera_id
    LEFT JOIN exposicion_x_tema         ext  ON ext.tema_id                        = t.tema_id
                                             AND ext.activo
    LEFT JOIN exposicion                e    ON e.exposicion_id                   = ext.exposicion_id
                                             AND e.activo
    LEFT JOIN etapa_formativa_x_ciclo   efc  ON efc.etapa_formativa_x_ciclo_id     = e.etapa_formativa_x_ciclo_id
                                             AND efc.activo
    LEFT JOIN ciclo                     ci   ON ci.ciclo_id                       = efc.ciclo_id
                                             AND ci.activo
    WHERE ac.activo
      AND (ci.ciclo_id = v_ciclo_id OR ci.ciclo_id IS NULL)
    GROUP BY ac.nombre
    ORDER BY topic_count DESC;
END;
$BODY$;

ALTER FUNCTION get_topic_area_stats_by_user_and_ciclo(integer, varchar)
  OWNER TO postgres;

-------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_topic_area_trends_by_user(
    p_usuario_id  INTEGER
)
  RETURNS TABLE(
    area_name   VARCHAR,
    year        INTEGER,
    topic_count BIGINT
  )
  LANGUAGE plpgsql
  COST 100
  VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_carrera_id INTEGER;
BEGIN
    -- 1) Obtener la carrera del coordinador
    SELECT carrera_id
      INTO v_carrera_id
      FROM usuario_carrera
     WHERE usuario_id = p_usuario_id
       AND activo      = TRUE
     LIMIT 1;

    IF v_carrera_id IS NULL THEN
        RAISE EXCEPTION 'El usuario % no tiene carrera activa asignada', p_usuario_id;
    END IF;

    -- 2) Construir la serie tema–año
    RETURN QUERY
    WITH tema_years AS (
      SELECT DISTINCT
        t.tema_id,
        COALESCE(
          ci.anio,
          EXTRACT(YEAR FROM t.fecha_creacion)::INTEGER
        ) AS year
      FROM tema t
      -- si el tema estuvo en exposiciones activas, tomar el año del ciclo
      LEFT JOIN exposicion_x_tema    ext ON ext.tema_id = t.tema_id AND ext.activo
      LEFT JOIN exposicion           e   ON e.exposicion_id = ext.exposicion_id AND e.activo
      LEFT JOIN etapa_formativa_x_ciclo efc ON efc.etapa_formativa_x_ciclo_id = e.etapa_formativa_x_ciclo_id
                                           AND efc.activo
      LEFT JOIN ciclo                ci  ON ci.ciclo_id = efc.ciclo_id AND ci.activo
      WHERE t.activo
        AND t.carrera_id = v_carrera_id
    )
    SELECT
      CAST(ac.nombre AS VARCHAR)    AS area_name,
      ty.year                        AS year,
      COUNT(DISTINCT t.tema_id)      AS topic_count
    FROM area_conocimiento              ac
    JOIN sub_area_conocimiento          sac  ON sac.area_conocimiento_id       = ac.area_conocimiento_id
                                            AND sac.activo
    JOIN sub_area_conocimiento_tema     sact ON sact.sub_area_conocimiento_id   = sac.sub_area_conocimiento_id
                                            AND sact.activo
    JOIN tema                           t    ON t.tema_id                     = sact.tema_id
                                            AND t.activo
                                            AND t.carrera_id = v_carrera_id
    JOIN tema_years                     ty   ON ty.tema_id                    = t.tema_id
    WHERE ac.activo
    GROUP BY ac.nombre, ty.year
    ORDER BY ty.year, ac.nombre;
END;
$BODY$;

ALTER FUNCTION get_topic_area_trends_by_user(integer)
  OWNER TO postgres;

