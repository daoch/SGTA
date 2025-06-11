CREATE OR REPLACE FUNCTION get_advisor_distribution_by_coordinator_and_ciclo(
    p_usuario_id    INTEGER,
    p_ciclo_nombre  VARCHAR
)
  RETURNS TABLE(
    teacher_name   VARCHAR,
    area_name      VARCHAR,
    advisor_count  BIGINT,
    tesistas_names TEXT,
    temas_names    TEXT  -- Nuevo campo para mostrar los temas
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
    -- Obtener componentes del ciclo
    v_anio     := split_part(p_ciclo_nombre,'-',1)::INT;
    v_semestre := split_part(p_ciclo_nombre,'-',2);

    -- Obtener carrera del coordinador
    SELECT carrera_id
      INTO v_carrera_id
      FROM usuario_carrera
     WHERE usuario_id = p_usuario_id
       AND activo = TRUE
     LIMIT 1;

    IF v_carrera_id IS NULL THEN
        RAISE EXCEPTION 'El usuario % no tiene carrera activa asignada.', p_usuario_id;
    END IF;

    -- Obtener ID del ciclo solicitado
    SELECT ciclo_id
      INTO v_ciclo_id
      FROM ciclo
     WHERE semestre = v_semestre
       AND anio = v_anio
       AND activo = TRUE
     LIMIT 1;

    IF v_ciclo_id IS NULL THEN
        RAISE EXCEPTION 'El ciclo % no existe o está inactivo.', p_ciclo_nombre;
    END IF;

    -- Query principal
    RETURN QUERY
    WITH ciclo_actual AS (
        -- Seleccionar datos básicos del ciclo
        SELECT
            c.ciclo_id,
            c.anio,
            c.semestre
        FROM ciclo c
        WHERE c.ciclo_id = v_ciclo_id
    ),
    temas_del_ciclo AS (
        -- Identificar los temas activos en este ciclo específico
        SELECT DISTINCT
            t.tema_id,
            t.titulo::VARCHAR AS tema_titulo,
            sact.sub_area_conocimiento_id,
            sac.area_conocimiento_id  -- Añadimos esta columna para poder filtrar posteriormente
        FROM tema t
        JOIN etapa_formativa_x_ciclo_x_tema efcxt ON efcxt.tema_id = t.tema_id
        JOIN etapa_formativa_x_ciclo efc ON efc.etapa_formativa_x_ciclo_id = efcxt.etapa_formativa_x_ciclo_id
        JOIN ciclo_actual ca ON ca.ciclo_id = efc.ciclo_id
        -- Unimos con sub_area_conocimiento_tema para obtener el área asociada al tema
        JOIN sub_area_conocimiento_tema sact ON sact.tema_id = t.tema_id AND sact.activo = TRUE
        JOIN sub_area_conocimiento sac ON sac.sub_area_conocimiento_id = sact.sub_area_conocimiento_id AND sac.activo = TRUE
        WHERE t.activo = TRUE
          AND efc.activo = TRUE
          AND t.carrera_id = v_carrera_id
    ),
    asesores AS (
        -- Obtener asesores filtrando por coincidencia de área
        SELECT DISTINCT
            u.usuario_id,
            CONCAT(u.nombres, ' ', u.primer_apellido, ' ', COALESCE(u.segundo_apellido, ''))::VARCHAR AS teacher_name,
            ut.tema_id,
            tdc.tema_titulo,
            tdc.area_conocimiento_id  -- Mantenemos esta columna para el filtrado
        FROM usuario u
        JOIN usuario_tema ut ON ut.usuario_id = u.usuario_id
                             AND ut.activo = TRUE
                             AND ut.asignado = TRUE
        JOIN rol r ON r.rol_id = ut.rol_id AND (r.nombre = 'Asesor' OR r.nombre = 'Coasesor')
        JOIN temas_del_ciclo tdc ON tdc.tema_id = ut.tema_id
        JOIN usuario_carrera uc ON uc.usuario_id = u.usuario_id
                                AND uc.carrera_id = v_carrera_id
                                AND uc.activo = TRUE
        -- Unimos con usuario_area_conocimiento para verificar que el asesor tenga asignada el área del tema
        JOIN usuario_area_conocimiento uac ON uac.usuario_id = u.usuario_id
                                          AND uac.area_conocimiento_id = tdc.area_conocimiento_id
                                          AND uac.activo = TRUE
        WHERE u.activo = TRUE
    ),
    tesistas AS (
        -- Obtener todos los tesistas por tema
        SELECT
            ut.tema_id,
            ut.usuario_id,
            CONCAT(u.nombres, ' ', u.primer_apellido, ' ', COALESCE(u.segundo_apellido, ''))::VARCHAR AS tesista_name
        FROM usuario u
        JOIN usuario_tema ut ON ut.usuario_id = u.usuario_id
                             AND ut.activo = TRUE
                             AND ut.asignado = TRUE
        JOIN rol r ON r.rol_id = ut.rol_id AND r.nombre = 'Tesista'
        JOIN temas_del_ciclo tdc ON tdc.tema_id = ut.tema_id
        WHERE u.activo = TRUE
    ),
    areas_por_asesor AS (
        -- Obtener áreas de conocimiento de cada asesor
        SELECT
            a.usuario_id,
            ac.area_conocimiento_id,
            ac.nombre::VARCHAR AS area_name
        FROM asesores a
        JOIN usuario_area_conocimiento uac ON uac.usuario_id = a.usuario_id AND uac.activo = TRUE
        JOIN area_conocimiento ac ON ac.area_conocimiento_id = uac.area_conocimiento_id AND ac.activo = TRUE
        -- Filtrar sólo por áreas que coinciden con las del tema
        WHERE ac.area_conocimiento_id = a.area_conocimiento_id
    ),
    tesistas_por_asesor AS (
        -- Asociar tesistas con sus asesores por tema
        SELECT DISTINCT
            a.usuario_id AS asesor_id,
            a.tema_id,
            t.tesista_name
        FROM asesores a
        JOIN tesistas t ON t.tema_id = a.tema_id
    )

    SELECT
        a.teacher_name,
        apa.area_name,
        COUNT(DISTINCT a.tema_id) AS advisor_count,
        STRING_AGG(DISTINCT tpa.tesista_name, '; ' ORDER BY tpa.tesista_name) AS tesistas_names,
        STRING_AGG(DISTINCT a.tema_titulo, '; ' ORDER BY a.tema_titulo) AS temas_names
    FROM asesores a
    JOIN areas_por_asesor apa ON apa.usuario_id = a.usuario_id
    LEFT JOIN tesistas_por_asesor tpa ON tpa.asesor_id = a.usuario_id
    GROUP BY a.usuario_id, a.teacher_name, apa.area_name
    ORDER BY advisor_count DESC, a.teacher_name ASC;
END;
$BODY$;

-------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_juror_distribution_by_coordinator_and_ciclo(
    p_usuario_id    INTEGER,
    p_ciclo_nombre  VARCHAR
)
  RETURNS TABLE(
    teacher_name   VARCHAR,
    area_name      VARCHAR,
    juror_count    BIGINT,
    tesistas_names TEXT,
    temas_names    TEXT
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
    -- Obtener componentes del ciclo
    v_anio     := split_part(p_ciclo_nombre,'-',1)::INT;
    v_semestre := split_part(p_ciclo_nombre,'-',2);

    -- Obtener carrera del coordinador
    SELECT carrera_id
      INTO v_carrera_id
      FROM usuario_carrera
     WHERE usuario_id = p_usuario_id
       AND activo = TRUE
     LIMIT 1;

    IF v_carrera_id IS NULL THEN
        RAISE EXCEPTION 'El usuario % no tiene carrera activa asignada.', p_usuario_id;
    END IF;

    -- Obtener ID del ciclo solicitado
    SELECT ciclo_id
      INTO v_ciclo_id
      FROM ciclo
     WHERE semestre = v_semestre
       AND anio = v_anio
       AND activo = TRUE
     LIMIT 1;

    IF v_ciclo_id IS NULL THEN
        RAISE EXCEPTION 'El ciclo % no existe o está inactivo.', p_ciclo_nombre;
    END IF;

    -- Query principal
    RETURN QUERY
    WITH ciclo_actual AS (
        -- Seleccionar datos básicos del ciclo
        SELECT
            c.ciclo_id,
            c.anio,
            c.semestre
        FROM ciclo c
        WHERE c.ciclo_id = v_ciclo_id
    ),
    temas_del_ciclo AS (
        -- Identificar los temas activos en este ciclo específico
        SELECT DISTINCT
            t.tema_id,
            t.titulo::VARCHAR AS tema_titulo,
            sact.sub_area_conocimiento_id,
            sac.area_conocimiento_id  -- Añadimos esta columna para poder filtrar posteriormente
        FROM tema t
        JOIN etapa_formativa_x_ciclo_x_tema efcxt ON efcxt.tema_id = t.tema_id
        JOIN etapa_formativa_x_ciclo efc ON efc.etapa_formativa_x_ciclo_id = efcxt.etapa_formativa_x_ciclo_id
        JOIN ciclo_actual ca ON ca.ciclo_id = efc.ciclo_id
        -- Unimos con sub_area_conocimiento_tema para obtener el área asociada al tema
        JOIN sub_area_conocimiento_tema sact ON sact.tema_id = t.tema_id AND sact.activo = TRUE
        JOIN sub_area_conocimiento sac ON sac.sub_area_conocimiento_id = sact.sub_area_conocimiento_id AND sac.activo = TRUE
        WHERE t.activo = TRUE
          AND efc.activo = TRUE
          AND t.carrera_id = v_carrera_id
    ),
    jurados AS (
        -- Obtener jurados filtrando por coincidencia de área
        SELECT DISTINCT
            u.usuario_id,
            CONCAT(u.nombres, ' ', u.primer_apellido, ' ', COALESCE(u.segundo_apellido, ''))::VARCHAR AS teacher_name,
            ut.tema_id,
            tdc.tema_titulo,
            tdc.area_conocimiento_id  -- Mantenemos esta columna para el filtrado
        FROM usuario u
        JOIN usuario_tema ut ON ut.usuario_id = u.usuario_id
                             AND ut.activo = TRUE
                             AND ut.asignado = TRUE
        JOIN rol r ON r.rol_id = ut.rol_id AND r.nombre = 'Jurado'
        JOIN temas_del_ciclo tdc ON tdc.tema_id = ut.tema_id
        JOIN usuario_carrera uc ON uc.usuario_id = u.usuario_id
                                AND uc.carrera_id = v_carrera_id
                                AND uc.activo = TRUE
        -- Unimos con usuario_area_conocimiento para verificar que el jurado tenga asignada el área del tema
        JOIN usuario_area_conocimiento uac ON uac.usuario_id = u.usuario_id
                                          AND uac.area_conocimiento_id = tdc.area_conocimiento_id
                                          AND uac.activo = TRUE
        WHERE u.activo = TRUE
    ),
    tesistas AS (
        -- Obtener todos los tesistas por tema
        SELECT
            ut.tema_id,
            ut.usuario_id,
            CONCAT(u.nombres, ' ', u.primer_apellido, ' ', COALESCE(u.segundo_apellido, ''))::VARCHAR AS tesista_name
        FROM usuario u
        JOIN usuario_tema ut ON ut.usuario_id = u.usuario_id
                             AND ut.activo = TRUE
                             AND ut.asignado = TRUE
        JOIN rol r ON r.rol_id = ut.rol_id AND r.nombre = 'Tesista'
        JOIN temas_del_ciclo tdc ON tdc.tema_id = ut.tema_id
        WHERE u.activo = TRUE
    ),
    areas_por_jurado AS (
        -- Obtener áreas de conocimiento de cada jurado
        SELECT
            j.usuario_id,
            ac.area_conocimiento_id,
            ac.nombre::VARCHAR AS area_name
        FROM jurados j
        JOIN usuario_area_conocimiento uac ON uac.usuario_id = j.usuario_id AND uac.activo = TRUE
        JOIN area_conocimiento ac ON ac.area_conocimiento_id = uac.area_conocimiento_id AND ac.activo = TRUE
        -- Filtrar sólo por áreas que coinciden con las del tema
        WHERE ac.area_conocimiento_id = j.area_conocimiento_id
    ),
    tesistas_por_jurado AS (
        -- Asociar tesistas con sus jurados por tema
        SELECT DISTINCT
            j.usuario_id AS jurado_id,
            j.tema_id,
            t.tesista_name
        FROM jurados j
        JOIN tesistas t ON t.tema_id = j.tema_id
    )

    SELECT
        j.teacher_name,
        apj.area_name,
        COUNT(DISTINCT j.tema_id) AS juror_count,
        STRING_AGG(DISTINCT tpj.tesista_name, '; ' ORDER BY tpj.tesista_name) AS tesistas_names,
        STRING_AGG(DISTINCT j.tema_titulo, '; ' ORDER BY j.tema_titulo) AS temas_names
    FROM jurados j
    JOIN areas_por_jurado apj ON apj.usuario_id = j.usuario_id
    LEFT JOIN tesistas_por_jurado tpj ON tpj.jurado_id = j.usuario_id
    GROUP BY j.usuario_id, j.teacher_name, apj.area_name
    ORDER BY juror_count DESC, j.teacher_name ASC;
END;
$BODY$;

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
    WITH temas_ciclo AS (
      -- Obtener los temas activos en el ciclo actual
      SELECT
        t.tema_id,
        t.carrera_id,
        sact.sub_area_conocimiento_id,
        sac.area_conocimiento_id
      FROM tema t
      JOIN etapa_formativa_x_ciclo_x_tema efcxt ON efcxt.tema_id = t.tema_id
      JOIN etapa_formativa_x_ciclo efc ON efc.etapa_formativa_x_ciclo_id = efcxt.etapa_formativa_x_ciclo_id
                                       AND efc.ciclo_id = v_ciclo_id
                                       AND efc.activo = TRUE
      -- Unimos con sub_area_conocimiento_tema para obtener el área asociada al tema
      JOIN sub_area_conocimiento_tema sact ON sact.tema_id = t.tema_id AND sact.activo = TRUE
      JOIN sub_area_conocimiento sac ON sac.sub_area_conocimiento_id = sact.sub_area_conocimiento_id AND sac.activo = TRUE
      WHERE t.activo = TRUE
        AND t.carrera_id = v_carrera_id
    ),
    advisor_topics AS (
      -- Obtener asesores con sus temas filtrando por coincidencia de área
      SELECT
        u.usuario_id,
        CAST(CONCAT(u.nombres,' ',u.primer_apellido,' ',COALESCE(u.segundo_apellido,'')) AS VARCHAR) AS advisor_name,
        ac.nombre AS area_name,
        ac.area_conocimiento_id,
        ut.tema_id
      FROM usuario u
      JOIN usuario_tema ut ON ut.usuario_id = u.usuario_id
                           AND ut.activo = TRUE
                           AND ut.asignado = TRUE
      JOIN rol r ON r.rol_id = ut.rol_id AND (r.nombre = 'Asesor' OR r.nombre = 'Coasesor')
      JOIN temas_ciclo tc ON tc.tema_id = ut.tema_id
      -- Verificar que el asesor tenga asignada el área del tema
      JOIN usuario_area_conocimiento uac ON uac.usuario_id = u.usuario_id
                                        AND uac.area_conocimiento_id = tc.area_conocimiento_id
                                        AND uac.activo = TRUE
      JOIN area_conocimiento ac ON ac.area_conocimiento_id = uac.area_conocimiento_id AND ac.activo = TRUE
      WHERE u.activo = TRUE
    ),
    topic_deliveries AS (
      SELECT
        at.usuario_id,
        at.advisor_name,
        at.area_name,
        at.tema_id,
        COUNT(et.entregable_x_tema_id) AS total_deliverables,
        COUNT(*) FILTER (WHERE et.estado::text != 'no_enviado') AS submitted_deliverables
      FROM advisor_topics AS at
      -- Entregables del tema
      LEFT JOIN entregable_x_tema et ON et.tema_id = at.tema_id AND et.activo = TRUE
      LEFT JOIN entregable e ON e.entregable_id = et.entregable_id
                             AND e.activo = TRUE
      -- Filtrar entregables del ciclo actual
      LEFT JOIN etapa_formativa_x_ciclo efc ON efc.etapa_formativa_x_ciclo_id = e.etapa_formativa_x_ciclo_id
                                           AND efc.ciclo_id = v_ciclo_id
                                           AND efc.activo = TRUE
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
-------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION listar_tesistas_por_asesor(p_asesor_id integer)
    RETURNS TABLE(
        tema_id integer,
        tesista_id integer,
        nombres character varying,
        primer_apellido character varying,
        segundo_apellido character varying,
        correo_electronico character varying,
        -- NUEVAS COLUMNAS AGREGADAS
        titulo_tema character varying,
        etapa_formativa_nombre text,
        carrera character varying,
        -- COLUMNAS EXISTENTES
        entregable_actual_id integer,
        entregable_actual_nombre character varying,
        entregable_actual_descripcion text,
        entregable_actual_fecha_inicio timestamp with time zone,
        entregable_actual_fecha_fin timestamp with time zone,
        entregable_actual_estado character varying,
        entregable_envio_estado character varying,
        entregable_envio_fecha timestamp with time zone
    )
    LANGUAGE plpgsql
AS
$$
DECLARE
    v_current_date TIMESTAMP WITH TIME ZONE := NOW();
BEGIN
    -- Primera consulta: Tesistas con entregables actuales
    RETURN QUERY
        SELECT
            ut.tema_id,
            ut.usuario_id AS tesista_id,
            u.nombres,
            u.primer_apellido,
            u.segundo_apellido,
            u.correo_electronico,
            -- NUEVAS COLUMNAS
            t.titulo AS titulo_tema,
            ef.nombre AS etapa_formativa_nombre,
            COALESCE(car.nombre, 'Sin carrera') AS carrera,
            -- Información del entregable actual
            e.entregable_id,
            e.nombre,
            e.descripcion,
            e.fecha_inicio,
            e.fecha_fin,
            e.estado::VARCHAR,
            et.estado::VARCHAR,
            et.fecha_envio
        FROM usuario_tema ut
        JOIN rol r1 ON ut.rol_id = r1.rol_id AND r1.nombre = 'Tesista'
        JOIN usuario u ON u.usuario_id = ut.usuario_id
        -- JOIN para obtener datos del tema
        JOIN tema t ON t.tema_id = ut.tema_id
        -- JOIN para obtener la carrera del tesista
        LEFT JOIN usuario_carrera uc ON uc.usuario_id = u.usuario_id AND uc.activo = TRUE
        LEFT JOIN carrera car ON car.carrera_id = uc.carrera_id
        -- JOIN para obtener la etapa formativa
        LEFT JOIN etapa_formativa_x_ciclo efc ON efc.etapa_formativa_id = (
            SELECT ef2.etapa_formativa_id
            FROM etapa_formativa ef2
            WHERE ef2.carrera_id = uc.carrera_id
            AND ef2.activo = TRUE
            ORDER BY ef2.fecha_creacion DESC
            LIMIT 1
        ) AND efc.activo = TRUE
        LEFT JOIN etapa_formativa ef ON ef.etapa_formativa_id = efc.etapa_formativa_id
        -- Obtener el tema de los tesistas asesorados
        JOIN (
            SELECT ut2.tema_id
            FROM usuario_tema ut2
            JOIN rol r2 ON ut2.rol_id = r2.rol_id AND (r2.nombre = 'Asesor' OR r2.nombre = 'Coasesor')
            WHERE ut2.usuario_id = p_asesor_id AND ut2.activo = TRUE
        ) temas_asesor ON temas_asesor.tema_id = ut.tema_id
        -- Datos del entregable actual
        LEFT JOIN LATERAL (
            SELECT e.*
            FROM entregable e
            JOIN entregable_x_tema et ON et.entregable_id = e.entregable_id
            WHERE et.tema_id = ut.tema_id
              AND e.fecha_inicio <= v_current_date
              AND e.fecha_fin >= v_current_date
              AND e.activo = TRUE
              AND et.activo = TRUE
            ORDER BY e.fecha_fin ASC
            LIMIT 1
        ) e ON TRUE
        -- Estado del envío del entregable
        LEFT JOIN entregable_x_tema et ON et.tema_id = ut.tema_id AND et.entregable_id = e.entregable_id AND et.activo = TRUE
        WHERE ut.activo = TRUE
        AND e.entregable_id IS NOT NULL;

    -- Segunda consulta: Tesistas sin entregables actuales pero con próximos entregables
    RETURN QUERY
        SELECT
            ut.tema_id,
            ut.usuario_id AS tesista_id,
            u.nombres,
            u.primer_apellido,
            u.segundo_apellido,
            u.correo_electronico,
            -- NUEVAS COLUMNAS
            t.titulo AS titulo_tema,
            ef.nombre AS etapa_formativa_nombre,
            COALESCE(car.nombre, 'Sin carrera') AS carrera,
            -- Información del próximo entregable
            e_next.entregable_id,
            e_next.nombre,
            e_next.descripcion,
            e_next.fecha_inicio,
            e_next.fecha_fin,
            e_next.estado::VARCHAR,
            et_next.estado::VARCHAR,
            et_next.fecha_envio
        FROM usuario_tema ut
        JOIN rol r1 ON ut.rol_id = r1.rol_id AND r1.nombre = 'Tesista'
        JOIN usuario u ON u.usuario_id = ut.usuario_id
        -- JOIN para obtener datos del tema
        JOIN tema t ON t.tema_id = ut.tema_id
        -- JOIN para obtener la carrera del tesista
        LEFT JOIN usuario_carrera uc ON uc.usuario_id = u.usuario_id AND uc.activo = TRUE
        LEFT JOIN carrera car ON car.carrera_id = uc.carrera_id
        -- JOIN para obtener la etapa formativa
        LEFT JOIN etapa_formativa_x_ciclo efc ON efc.etapa_formativa_id = (
            SELECT ef2.etapa_formativa_id
            FROM etapa_formativa ef2
            WHERE ef2.carrera_id = uc.carrera_id
            AND ef2.activo = TRUE
            ORDER BY ef2.fecha_creacion DESC
            LIMIT 1
        ) AND efc.activo = TRUE
        LEFT JOIN etapa_formativa ef ON ef.etapa_formativa_id = efc.etapa_formativa_id
        -- Obtener el tema de los tesistas asesorados
        JOIN (
            SELECT ut2.tema_id
            FROM usuario_tema ut2
            JOIN rol r2 ON ut2.rol_id = r2.rol_id AND (r2.nombre = 'Asesor' OR r2.nombre = 'Coasesor')
            WHERE ut2.usuario_id = p_asesor_id AND ut2.activo = TRUE
        ) temas_asesor ON temas_asesor.tema_id = ut.tema_id
        -- Verifica que no haya entregable actual
        LEFT JOIN LATERAL (
            SELECT e.entregable_id
            FROM entregable e
            JOIN entregable_x_tema et ON et.entregable_id = e.entregable_id
            WHERE et.tema_id = ut.tema_id
              AND e.fecha_inicio <= v_current_date
              AND e.fecha_fin >= v_current_date
              AND e.activo = TRUE
              AND et.activo = TRUE
            LIMIT 1
        ) current_entregable ON TRUE
        -- Datos del próximo entregable
        JOIN LATERAL (
            SELECT e.*
            FROM entregable e
            JOIN entregable_x_tema et ON et.entregable_id = e.entregable_id
            WHERE et.tema_id = ut.tema_id
              AND e.fecha_inicio > v_current_date
              AND e.activo = TRUE
              AND et.activo = TRUE
            ORDER BY e.fecha_inicio ASC
            LIMIT 1
        ) e_next ON TRUE
        -- Estado del envío del entregable
        LEFT JOIN entregable_x_tema et_next ON et_next.tema_id = ut.tema_id AND et_next.entregable_id = e_next.entregable_id AND et_next.activo = TRUE
        WHERE ut.activo = TRUE
        AND current_entregable.entregable_id IS NULL;
END;
$$;

---------------------------------------------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION listar_hitos_cronograma_tesista(p_tesista_id INT)
RETURNS TABLE (
    hito_id INT,
    nombre VARCHAR,
    descripcion TEXT,
    fecha_inicio TIMESTAMP WITH TIME ZONE,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    entregable_envio_estado enum_estado_entrega,
    entregable_actividad_estado VARCHAR,
    es_evaluable BOOLEAN,
    tema_id INT,
    tema_titulo VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.entregable_id AS hito_id,
        e.nombre,
        e.descripcion,
        e.fecha_inicio,
        e.fecha_fin,
        et.estado AS entregable_envio_estado,
        e.estado::VARCHAR AS entregable_actividad_estado,
        e.es_evaluable,
        t.tema_id,
        t.titulo AS tema_titulo
    FROM entregable_x_tema et
    JOIN entregable e ON e.entregable_id = et.entregable_id
    JOIN tema t ON t.tema_id = et.tema_id
    JOIN usuario_tema ut ON ut.tema_id = t.tema_id
    JOIN rol r ON r.rol_id = ut.rol_id AND r.nombre = 'Tesista'
    WHERE ut.usuario_id = p_tesista_id
      AND et.activo = TRUE
      AND e.activo = TRUE
      AND t.activo = TRUE
      AND ut.activo = TRUE
    ORDER BY e.fecha_fin ASC;
END;
$$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION obtener_detalle_tesista(p_tesista_id INTEGER)
RETURNS TABLE(
    tesista_id INTEGER,
    nombres CHARACTER VARYING,
    primer_apellido CHARACTER VARYING,
    segundo_apellido CHARACTER VARYING,
    correo_electronico CHARACTER VARYING,
    nivel_estudios CHARACTER VARYING,
    codigo_pucp CHARACTER VARYING,
    carrera CHARACTER VARYING, -- NUEVO CAMPO AGREGADO
    tema_id INTEGER,
    titulo_tema CHARACTER VARYING,
    resumen_tema TEXT,
    metodologia TEXT,
    objetivos TEXT,
    area_conocimiento CHARACTER VARYING,
    sub_area_conocimiento CHARACTER VARYING,
    asesor_nombre TEXT,
    asesor_correo TEXT,
    coasesor_nombre TEXT,
    coasesor_correo TEXT,
    ciclo_id INTEGER,
    ciclo_nombre CHARACTER VARYING,
    fecha_inicio_ciclo DATE,
    fecha_fin_ciclo DATE,
    etapa_formativa_id INTEGER,
    etapa_formativa_nombre TEXT,
    fase_actual CHARACTER VARYING,
    entregable_id INTEGER,
    entregable_nombre CHARACTER VARYING,
    entregable_actividad_estado CHARACTER VARYING,
    entregable_envio_estado CHARACTER VARYING,
    entregable_fecha_inicio TIMESTAMP WITH TIME ZONE,
    entregable_fecha_fin TIMESTAMP WITH TIME ZONE,
    siguiente_entregable_nombre CHARACTER VARYING,
    siguiente_entregable_fecha_fin TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    v_current_date TIMESTAMP WITH TIME ZONE := NOW();
    v_tema_id INT;
    v_ciclo_id INT;
    v_etapa_formativa_id INT;
    v_efc_id INT;
    v_current_entregable_id INT;
    v_current_entregable_nombre VARCHAR;
    v_fecha_fin_entregable TIMESTAMP WITH TIME ZONE;
    v_fase_actual VARCHAR;
    v_next_entregable_nombre VARCHAR;
    v_entregable_actividad_estado VARCHAR;
    v_entregable_envio_estado VARCHAR;
    v_entregable_fecha_inicio TIMESTAMP WITH TIME ZONE;
    v_entregable_fecha_fin TIMESTAMP WITH TIME ZONE;
    v_siguiente_entregable_nombre VARCHAR;
    v_siguiente_entregable_fecha_fin TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Obtenemos el tema del tesista
    SELECT ut.tema_id INTO v_tema_id
    FROM usuario_tema ut
    JOIN rol r ON r.rol_id = ut.rol_id AND r.nombre = 'Tesista'
    WHERE ut.usuario_id = p_tesista_id AND ut.activo = TRUE
    LIMIT 1;

    IF v_tema_id IS NULL THEN
        RAISE EXCEPTION 'El usuario con ID % no es tesista de ningún tema activo', p_tesista_id;
    END IF;

    -- Obtenemos el ciclo y etapa formativa del tesista usando la relación correcta
    SELECT
        efc.ciclo_id,
        efc.etapa_formativa_id,
        efc.etapa_formativa_x_ciclo_id
    INTO
        v_ciclo_id,
        v_etapa_formativa_id,
        v_efc_id
    FROM etapa_formativa_x_ciclo efc
    JOIN etapa_formativa ef ON ef.etapa_formativa_id = efc.etapa_formativa_id
    JOIN usuario_carrera uc ON uc.carrera_id = ef.carrera_id
    WHERE uc.usuario_id = p_tesista_id
      AND uc.activo = TRUE
      AND efc.activo = TRUE
      AND ef.activo = TRUE
    ORDER BY efc.fecha_creacion DESC
    LIMIT 1;

    -- Si no encuentra por carrera, buscar por tema en etapa_formativa_x_ciclo_x_tema
    IF v_efc_id IS NULL THEN
        SELECT
            efc.ciclo_id,
            efc.etapa_formativa_id,
            efc.etapa_formativa_x_ciclo_id
        INTO
            v_ciclo_id,
            v_etapa_formativa_id,
            v_efc_id
        FROM etapa_formativa_x_ciclo efc
        JOIN etapa_formativa_x_ciclo_x_tema efcxt ON efcxt.etapa_formativa_x_ciclo_id = efc.etapa_formativa_x_ciclo_id
        WHERE efcxt.tema_id = v_tema_id
          AND efc.activo = TRUE
          AND efcxt.activo = TRUE
        ORDER BY efc.fecha_creacion DESC
        LIMIT 1;
    END IF;

    -- NUEVA VALIDACIÓN: Si no hay ciclo asociado (v_ciclo_id es NULL), establecer estados en "EN PAUSA"
    IF v_ciclo_id IS NULL THEN
        v_entregable_actividad_estado := 'EN PAUSA';
        v_entregable_envio_estado := 'EN PAUSA';
        v_fase_actual := 'EN PAUSA - Sin ciclo activo';
    ELSE
        -- Obtenemos el siguiente entregable no enviado
        IF v_efc_id IS NOT NULL THEN
            SELECT e.nombre, e.fecha_fin
            INTO v_siguiente_entregable_nombre, v_siguiente_entregable_fecha_fin
            FROM entregable e
            JOIN entregable_x_tema et ON et.entregable_id = e.entregable_id
            WHERE et.tema_id = v_tema_id
              AND e.etapa_formativa_x_ciclo_id = v_efc_id
              AND et.estado != 'enviado_a_tiempo'
              AND e.fecha_fin > NOW()
              AND e.activo = TRUE
              AND et.activo = TRUE
            ORDER BY e.fecha_fin ASC
            LIMIT 1;
        END IF;

        -- Determinamos la fase actual basada en el cronograma de entregables
        IF v_efc_id IS NOT NULL THEN
            SELECT
                e.entregable_id,
                e.nombre,
                e.fecha_fin,
                COALESCE(e.estado::VARCHAR, 'sin_estado'),
                COALESCE(et.estado::VARCHAR, 'sin_estado'),
                e.fecha_inicio,
                e.fecha_fin
            INTO
                v_current_entregable_id,
                v_current_entregable_nombre,
                v_fecha_fin_entregable,
                v_entregable_actividad_estado,
                v_entregable_envio_estado,
                v_entregable_fecha_inicio,
                v_entregable_fecha_fin
            FROM entregable e
            JOIN entregable_x_tema et ON et.entregable_id = e.entregable_id
            WHERE et.tema_id = v_tema_id
              AND e.etapa_formativa_x_ciclo_id = v_efc_id
              AND e.fecha_inicio <= v_current_date
              AND e.fecha_fin >= v_current_date
              AND e.activo = TRUE
              AND et.activo = TRUE
            ORDER BY e.fecha_fin ASC
            LIMIT 1;
        END IF;

        -- Determinamos la fase actual
        IF v_current_entregable_id IS NOT NULL THEN
            v_fase_actual := 'ENTREGABLE: ' || v_current_entregable_nombre;
        ELSE
            -- Verificar si está fuera del cronograma (después del último entregable)
            IF v_efc_id IS NOT NULL THEN
                SELECT
                    e.entregable_id,
                    e.nombre,
                    e.fecha_fin,
                    COALESCE(e.estado::VARCHAR, 'sin_estado'),
                    COALESCE(et.estado::VARCHAR, 'sin_estado'),
                    e.fecha_inicio,
                    e.fecha_fin
                INTO
                    v_current_entregable_id,
                    v_current_entregable_nombre,
                    v_fecha_fin_entregable,
                    v_entregable_actividad_estado,
                    v_entregable_envio_estado,
                    v_entregable_fecha_inicio,
                    v_entregable_fecha_fin
                FROM entregable e
                JOIN entregable_x_tema et ON et.entregable_id = e.entregable_id
                WHERE et.tema_id = v_tema_id
                  AND e.etapa_formativa_x_ciclo_id = v_efc_id
                  AND e.activo = TRUE
                  AND et.activo = TRUE
                ORDER BY e.fecha_fin DESC
                LIMIT 1;
            END IF;

            IF v_current_entregable_id IS NOT NULL AND v_fecha_fin_entregable < v_current_date THEN
                v_fase_actual := 'FINALIZADO - FUERA DE CRONOGRAMA';
            ELSE
                -- Buscamos el próximo entregable programado
                IF v_efc_id IS NOT NULL THEN
                    SELECT
                        e.nombre,
                        e.entregable_id,
                        COALESCE(e.estado::VARCHAR, 'sin_estado'),
                        COALESCE(et.estado::VARCHAR, 'sin_estado'),
                        e.fecha_inicio,
                        e.fecha_fin
                    INTO
                        v_next_entregable_nombre,
                        v_current_entregable_id,
                        v_entregable_actividad_estado,
                        v_entregable_envio_estado,
                        v_entregable_fecha_inicio,
                        v_entregable_fecha_fin
                    FROM entregable e
                    JOIN entregable_x_tema et ON et.entregable_id = e.entregable_id
                    WHERE et.tema_id = v_tema_id
                      AND e.etapa_formativa_x_ciclo_id = v_efc_id
                      AND e.fecha_inicio > v_current_date
                      AND e.activo = TRUE
                      AND et.activo = TRUE
                    ORDER BY e.fecha_inicio ASC
                    LIMIT 1;
                END IF;

                IF v_next_entregable_nombre IS NOT NULL THEN
                    v_fase_actual := 'PRÓXIMO: ' || v_next_entregable_nombre;
                    v_current_entregable_nombre := v_next_entregable_nombre;
                ELSE
                    v_fase_actual := 'SIN ENTREGABLES PROGRAMADOS';
                END IF;
            END IF;
        END IF;
    END IF;

    -- Consulta principal que retorna todos los datos
    RETURN QUERY
    SELECT
        -- Datos del tesista
        u.usuario_id AS tesista_id,
        u.nombres,
        u.primer_apellido,
        u.segundo_apellido,
        u.correo_electronico,
        u.nivel_estudios,
        u.codigo_pucp,
        -- NUEVO CAMPO: Carrera del usuario
        COALESCE(car.nombre::CHARACTER VARYING, 'Sin carrera'::CHARACTER VARYING) AS carrera,
        -- Datos del tema/proyecto
        t.tema_id,
        t.titulo AS titulo_tema,
        t.resumen AS resumen_tema,
        t.metodologia,
        t.objetivos,
        -- Datos del área de conocimiento
        COALESCE(ac.nombre::CHARACTER VARYING, 'Sin área'::CHARACTER VARYING) AS area_conocimiento,
        COALESCE(sac.nombre::CHARACTER VARYING, 'Sin subárea'::CHARACTER VARYING) AS sub_area_conocimiento,
        -- Datos del asesor (solo rol "Asesor")
        (SELECT string_agg(DISTINCT CONCAT(ua_asesor.nombres, ' ', ua_asesor.primer_apellido, ' ', COALESCE(ua_asesor.segundo_apellido, '')), ', ')
         FROM usuario_tema ut_asesor
         JOIN rol r_asesor ON r_asesor.rol_id = ut_asesor.rol_id AND r_asesor.nombre = 'Asesor'
         JOIN usuario ua_asesor ON ua_asesor.usuario_id = ut_asesor.usuario_id AND ua_asesor.activo = TRUE
         WHERE ut_asesor.tema_id = t.tema_id
           AND ut_asesor.activo = TRUE
           AND ut_asesor.usuario_id != p_tesista_id) AS asesor_nombre,

        (SELECT string_agg(DISTINCT ua_asesor.correo_electronico, ', ')
         FROM usuario_tema ut_asesor
         JOIN rol r_asesor ON r_asesor.rol_id = ut_asesor.rol_id AND r_asesor.nombre = 'Asesor'
         JOIN usuario ua_asesor ON ua_asesor.usuario_id = ut_asesor.usuario_id AND ua_asesor.activo = TRUE
         WHERE ut_asesor.tema_id = t.tema_id
           AND ut_asesor.activo = TRUE
           AND ut_asesor.usuario_id != p_tesista_id) AS asesor_correo,

        -- Datos del coasesor (solo rol "Coasesor")
        (SELECT string_agg(DISTINCT CONCAT(ua_coasesor.nombres, ' ', ua_coasesor.primer_apellido, ' ', COALESCE(ua_coasesor.segundo_apellido, '')), ', ')
         FROM usuario_tema ut_coasesor
         JOIN rol r_coasesor ON r_coasesor.rol_id = ut_coasesor.rol_id AND r_coasesor.nombre = 'Coasesor'
         JOIN usuario ua_coasesor ON ua_coasesor.usuario_id = ut_coasesor.usuario_id AND ua_coasesor.activo = TRUE
         WHERE ut_coasesor.tema_id = t.tema_id
           AND ut_coasesor.activo = TRUE
           AND ut_coasesor.usuario_id != p_tesista_id) AS coasesor_nombre,

        (SELECT string_agg(DISTINCT ua_coasesor.correo_electronico, ', ')
         FROM usuario_tema ut_coasesor
         JOIN rol r_coasesor ON r_coasesor.rol_id = ut_coasesor.rol_id AND r_coasesor.nombre = 'Coasesor'
         JOIN usuario ua_coasesor ON ua_coasesor.usuario_id = ut_coasesor.usuario_id AND ua_coasesor.activo = TRUE
         WHERE ut_coasesor.tema_id = t.tema_id
           AND ut_coasesor.activo = TRUE
           AND ut_coasesor.usuario_id != p_tesista_id) AS coasesor_correo,

        -- Datos del ciclo académico
        v_ciclo_id AS ciclo_id,
        COALESCE(c.nombre::CHARACTER VARYING, 'Sin ciclo'::CHARACTER VARYING) AS ciclo_nombre,
        c.fecha_inicio AS fecha_inicio_ciclo,
        c.fecha_fin AS fecha_fin_ciclo,
        -- Datos de la etapa formativa
        v_etapa_formativa_id AS etapa_formativa_id,
        COALESCE(ef.nombre, 'Sin etapa formativa') AS etapa_formativa_nombre,
        -- Fase actual
        COALESCE(v_fase_actual::CHARACTER VARYING, 'Sin fase definida'::CHARACTER VARYING) AS fase_actual,
        -- Información del entregable actual
        v_current_entregable_id AS entregable_id,
        COALESCE(v_current_entregable_nombre::CHARACTER VARYING, 'Sin entregable'::CHARACTER VARYING) AS entregable_nombre,
        -- APLICAR VALIDACIÓN PARA ESTADOS EN PAUSA
        CASE
            WHEN v_ciclo_id IS NULL THEN 'EN PAUSA'::CHARACTER VARYING
            ELSE COALESCE(v_entregable_actividad_estado::CHARACTER VARYING, 'Sin estado'::CHARACTER VARYING)
        END AS entregable_actividad_estado,
        CASE
            WHEN v_ciclo_id IS NULL THEN 'EN PAUSA'::CHARACTER VARYING
            ELSE COALESCE(v_entregable_envio_estado::CHARACTER VARYING, 'Sin estado'::CHARACTER VARYING)
        END AS entregable_envio_estado,
        v_entregable_fecha_inicio AS entregable_fecha_inicio,
        v_entregable_fecha_fin AS entregable_fecha_fin,
        -- Información del siguiente entregable no enviado
        COALESCE(v_siguiente_entregable_nombre::CHARACTER VARYING, 'Sin siguiente entregable'::CHARACTER VARYING) AS siguiente_entregable_nombre,
        v_siguiente_entregable_fecha_fin AS siguiente_entregable_fecha_fin

    FROM usuario u
    JOIN usuario_tema ut ON ut.usuario_id = u.usuario_id AND ut.activo = TRUE
    JOIN rol r_tesista ON r_tesista.rol_id = ut.rol_id AND r_tesista.nombre = 'Tesista'
    JOIN tema t ON t.tema_id = ut.tema_id AND t.activo = TRUE
    -- Unión con carrera del usuario
    LEFT JOIN usuario_carrera uc ON uc.usuario_id = u.usuario_id AND uc.activo = TRUE
    LEFT JOIN carrera car ON car.carrera_id = uc.carrera_id AND car.activo = TRUE
    -- Unión con áreas de conocimiento
    LEFT JOIN sub_area_conocimiento_tema sact ON sact.tema_id = t.tema_id AND sact.activo = TRUE
    LEFT JOIN sub_area_conocimiento sac ON sac.sub_area_conocimiento_id = sact.sub_area_conocimiento_id AND sac.activo = TRUE
    LEFT JOIN area_conocimiento ac ON ac.area_conocimiento_id = sac.area_conocimiento_id AND ac.activo = TRUE
    -- Unión con ciclo y etapa formativa usando las variables obtenidas
    LEFT JOIN ciclo c ON c.ciclo_id = v_ciclo_id AND c.activo = TRUE
    LEFT JOIN etapa_formativa ef ON ef.etapa_formativa_id = v_etapa_formativa_id AND ef.activo = TRUE

    WHERE u.usuario_id = p_tesista_id AND u.activo = TRUE;

END;
$$ LANGUAGE plpgsql;

-- 1) Creamos/reemplazamos la función que, dado solo el ID de un tesista,
--    recupera todas las reuniones en las que participó junto a su(s) asesor(es).
-- drop function listar_historial_reuniones_por_tesista;
CREATE OR REPLACE FUNCTION listar_historial_reuniones_por_tesista(
    p_tesista_id INT
)
    RETURNS TABLE(
                     fecha    DATE,
                     duracion TEXT,
                     notas    TEXT
                 ) AS $$
BEGIN
    RETURN QUERY

        WITH asesores_del_tema AS (
            -- Encuentra todos los asesores de los temas en los que el tesista participa
            SELECT DISTINCT ut2.usuario_id AS asesor_id
            FROM usuario_tema ut1
                     JOIN rol r1 ON ut1.rol_id = r1.rol_id
                AND r1.nombre = 'Tesista'
                     JOIN usuario_tema ut2 ON ut1.tema_id = ut2.tema_id
                     JOIN rol r2 ON ut2.rol_id = r2.rol_id
                AND r2.nombre = 'Asesor'
            WHERE ut1.usuario_id = p_tesista_id
        )

        SELECT
            r.fecha_hora_inicio::DATE AS fecha,

            CASE
                WHEN EXTRACT(HOUR   FROM (r.fecha_hora_fin - r.fecha_hora_inicio)) = 0
                    THEN EXTRACT(MINUTE FROM (r.fecha_hora_fin - r.fecha_hora_inicio)) || ' minutos'
                WHEN EXTRACT(MINUTE FROM (r.fecha_hora_fin - r.fecha_hora_inicio)) = 0
                    THEN EXTRACT(HOUR   FROM (r.fecha_hora_fin - r.fecha_hora_inicio)) || ' horas'
                ELSE
                    EXTRACT(HOUR   FROM (r.fecha_hora_fin - r.fecha_hora_inicio)) || ' horas '
                        || EXTRACT(MINUTE FROM (r.fecha_hora_fin - r.fecha_hora_inicio)) || ' minutos'
                END AS duracion,

            r.descripcion AS notas

        FROM reunion r

                 -- Confirmamos que el tesista participó
                 JOIN usuario_reunion ut
                      ON ut.reunion_id = r.reunion_id
                          AND ut.usuario_id = p_tesista_id

            -- Confirmamos que al menos uno de sus asesores participó
                 JOIN usuario_reunion ua
                      ON ua.reunion_id = r.reunion_id
                          AND ua.usuario_id IN (SELECT asesor_id FROM asesores_del_tema)

        ORDER BY r.fecha_hora_inicio;
END;
$$ LANGUAGE plpgsql;


-- 2) Ejemplo de uso en DataGrip (le das solo el tesista_id):
--    Al ejecutar, DataGrip te preguntará el valor de "tesista_id".

SELECT * FROM listar_historial_reuniones_por_tesista(2);

CREATE OR REPLACE FUNCTION calcular_progreso_alumno(p_alumno_id INT)
RETURNS TABLE (
    total_entregables INT,
    entregables_enviados INT,
    porcentaje_progreso NUMERIC,
    siguiente_entregable_nombre VARCHAR,
    siguiente_entregable_fecha_fin TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    v_tema_id INT;
BEGIN
    -- 1. Obtener el tema actual del alumno
    SELECT ut.tema_id INTO v_tema_id
    FROM usuario_tema ut
    JOIN rol r ON r.rol_id = ut.rol_id AND r.nombre = 'Tesista'
    WHERE ut.usuario_id = p_alumno_id
    AND ut.activo = true
    ORDER BY ut.fecha_creacion DESC
    LIMIT 1;

    -- 2. Si no se encuentra tema, retornar 0s
    IF v_tema_id IS NULL THEN
        RETURN QUERY SELECT 0::INT, 0::INT, 0::NUMERIC, NULL::VARCHAR, NULL::TIMESTAMP WITH TIME ZONE;
        RETURN;
    END IF;

    -- 3. Calcular las estadísticas y obtener el siguiente entregable no enviado
    RETURN QUERY
    WITH estadisticas AS (
        SELECT 
            COUNT(et.entregable_x_tema_id) as total,
            COUNT(CASE WHEN et.estado = 'enviado_a_tiempo' THEN 1 END) as enviados
        FROM entregable_x_tema et
        WHERE et.tema_id = v_tema_id
        AND et.activo = true
    ),
    siguiente_entregable AS (
        SELECT e.nombre, e.fecha_fin
        FROM entregable e
        JOIN entregable_x_tema et ON et.entregable_id = e.entregable_id
        WHERE et.tema_id = v_tema_id
        AND et.estado != 'enviado_a_tiempo'
        AND e.fecha_fin > NOW()
        AND e.activo = TRUE
        AND et.activo = TRUE
        ORDER BY e.fecha_fin ASC
        LIMIT 1
    )
    SELECT 
        total::INT,
        enviados::INT,
        CASE 
            WHEN total = 0 THEN 0
            ELSE ROUND((enviados::NUMERIC / total::NUMERIC) * 100, 2)
        END as porcentaje,
        se.nombre,
        se.fecha_fin
    FROM estadisticas
    LEFT JOIN siguiente_entregable se ON true;
END;
$$ LANGUAGE plpgsql;


--Funcion necesaria para listar los ciclos con sus etapas formativas asociadas -- crear ciclos
CREATE OR REPLACE FUNCTION listarCiclosConEtapas()
RETURNS TABLE(
    ciclo_id integer,
    semestre text,
    anio integer,
    fecha_inicio date,
    fecha_fin date,
    activo boolean,
    fecha_creacion TIMESTAMP WITH TIME ZONE,
    fecha_modificacion TIMESTAMP WITH TIME ZONE,
    etapas_formativas text[], -- arreglo de nombres de etapas
    cantidad_etapas integer   -- número total de etapas asociadas
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.ciclo_id,
        c.semestre::TEXT,
        c.anio,
        c.fecha_inicio,
        c.fecha_fin,
        c.activo,
        c.fecha_creacion,
        c.fecha_modificacion,
        ARRAY_AGG(ef.nombre ORDER BY ef.nombre) AS etapas_formativas,
        COUNT(ef.etapa_formativa_id)::integer AS cantidad_etapas
    FROM ciclo c
    LEFT JOIN etapa_formativa_x_ciclo efc ON efc.ciclo_id = c.ciclo_id AND efc.activo = true
    LEFT JOIN etapa_formativa ef ON ef.etapa_formativa_id = efc.etapa_formativa_id AND ef.activo = true
    WHERE c.activo = true
    GROUP BY c.ciclo_id, c.semestre, c.anio, c.fecha_inicio, c.fecha_fin, c.activo, c.fecha_creacion, c.fecha_modificacion
    ORDER BY c.anio DESC, c.semestre DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION obtener_carrera_coordinador(
    p_usuario_id INTEGER
)
RETURNS TABLE (
    carrera_id INTEGER,
    nombre VARCHAR,
    es_coordinador BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        c.carrera_id,
        c.nombre,
        uc.es_coordinador
    FROM usuario_carrera uc
    JOIN carrera c ON uc.carrera_id = c.carrera_id
    WHERE uc.usuario_id = p_usuario_id
    AND uc.activo = true
    AND uc.es_coordinador = true
    LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION obtener_alumnos_por_carrera_revisor(
    p_usuario_id INTEGER,
    p_cadena_busqueda VARCHAR
)
RETURNS TABLE (
    usuario_id INTEGER,
    codigo_pucp VARCHAR,
    nombres VARCHAR,
    primer_apellido VARCHAR,
    segundo_apellido VARCHAR,
    tema_titulo VARCHAR,
    tema_id INTEGER,
    asesor VARCHAR,
    coasesor VARCHAR,
    activo BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH carreras_revisor AS (
        -- Obtener las carreras del revisor usando usuario_id
        SELECT DISTINCT c.carrera_id
        FROM usuario_carrera uc 
        JOIN carrera c ON uc.carrera_id = c.carrera_id
        WHERE uc.usuario_id = p_usuario_id
        AND uc.activo = true
    )
    SELECT DISTINCT
        u.usuario_id,
        u.codigo_pucp,
        u.nombres,
        u.primer_apellido,
        u.segundo_apellido,
        t.titulo as tema_titulo,
        t.tema_id,
        CAST((
            SELECT CONCAT(u2.nombres, ' ', u2.primer_apellido, ' ', u2.segundo_apellido)
            FROM usuario_tema ut2
            JOIN usuario u2 ON ut2.usuario_id = u2.usuario_id
            WHERE ut2.tema_id = t.tema_id
            AND ut2.rol_id = 1  -- Rol de asesor
            AND ut2.activo = true
            LIMIT 1
        ) AS VARCHAR) as asesor,
        CAST((
            SELECT CONCAT(u3.nombres, ' ', u3.primer_apellido, ' ', u3.segundo_apellido)
            FROM usuario_tema ut3
            JOIN usuario u3 ON ut3.usuario_id = u3.usuario_id
            WHERE ut3.tema_id = t.tema_id
            AND ut3.rol_id = 5  -- Rol de coasesor
            AND ut3.activo = true
            LIMIT 1
        ) AS VARCHAR) as coasesor,
        u.activo
    FROM usuario u
    JOIN usuario_carrera uc ON u.usuario_id = uc.usuario_id
    JOIN carreras_revisor cr ON uc.carrera_id = cr.carrera_id
    JOIN tipo_usuario tu ON u.tipo_usuario_id = tu.tipo_usuario_id
    JOIN usuario_tema ut ON u.usuario_id = ut.usuario_id
    JOIN tema t ON t.tema_id = ut.tema_id
    WHERE u.activo = true
    AND tu.nombre ILIKE 'alumno'
    AND ut.rol_id = 4  -- Rol de tesista
    AND ut.activo = true
    AND ut.asignado = true
    AND (
        COALESCE(p_cadena_busqueda, '') = '' OR
        u.nombres ILIKE '%' || p_cadena_busqueda || '%'
        OR u.primer_apellido ILIKE '%' || p_cadena_busqueda || '%'
        OR u.segundo_apellido ILIKE '%' || p_cadena_busqueda || '%'
        OR u.codigo_pucp ILIKE '%' || p_cadena_busqueda || '%'
        OR t.titulo ILIKE '%' || p_cadena_busqueda || '%'
    );
END;
$$;
