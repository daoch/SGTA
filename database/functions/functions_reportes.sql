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
CREATE OR REPLACE FUNCTION listar_tesistas_por_asesor(p_asesor_id INT)
    RETURNS TABLE(
                     tema_id            INT,
                     tesista_id         INT,
                     nombres            VARCHAR(100),
                     primer_apellido    VARCHAR(100),
                     segundo_apellido   VARCHAR(100),
                     correo_electronico VARCHAR(255),
                     -- Nuevos campos para información del entregable
                     entregable_actual_id INT,
                     entregable_actual_nombre VARCHAR(150),
                     entregable_actual_descripcion TEXT,
                     entregable_actual_fecha_inicio TIMESTAMP WITH TIME ZONE,
                     entregable_actual_fecha_fin TIMESTAMP WITH TIME ZONE,
                     entregable_actual_estado VARCHAR,
                     entregable_envio_estado VARCHAR,
                     entregable_envio_fecha DATE
                 ) AS $$
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
        -- Obtener el tema de los tesistas asesorados
        JOIN (
            SELECT ut2.tema_id
            FROM usuario_tema ut2
            JOIN rol r2 ON ut2.rol_id = r2.rol_id AND (r2.nombre = 'Asesor' OR r2.nombre = 'Coasesor')
            WHERE ut2.usuario_id = p_asesor_id AND ut2.activo = TRUE
        ) temas_asesor ON temas_asesor.tema_id = ut.tema_id
        -- Verifica que no haya entregable actual (usando LATERAL para acceder a ut.tema_id)
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
$$ LANGUAGE plpgsql;

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

CREATE OR REPLACE FUNCTION obtener_detalle_tesista(p_tesista_id INT)
RETURNS TABLE (
    -- Datos del tesista
    tesista_id INT,
    nombres VARCHAR,
    primer_apellido VARCHAR,
    segundo_apellido VARCHAR,
    correo_electronico VARCHAR,
    nivel_estudios VARCHAR,
    codigo_pucp VARCHAR,
    -- Datos del tema/proyecto
    tema_id INT,
    titulo_tema VARCHAR,
    resumen_tema TEXT,
    metodologia TEXT,
    objetivos TEXT,
    -- Datos del área de conocimiento
    area_conocimiento VARCHAR,
    sub_area_conocimiento VARCHAR,
    -- Datos del asesor
    asesor_nombre TEXT,
    asesor_correo TEXT,
    -- Datos del coasesor
    coasesor_nombre TEXT,
    coasesor_correo TEXT,
    -- Datos del ciclo académico
    ciclo_id INT,
    ciclo_nombre TEXT,
    fecha_inicio_ciclo DATE,
    fecha_fin_ciclo DATE,
    -- Datos de la etapa formativa
    etapa_formativa_id INT,
    etapa_formativa_nombre TEXT,
    -- Fase actual
    fase_actual VARCHAR,
    -- Información del entregable actual (nuevos campos)
    entregable_id INT,
    entregable_nombre VARCHAR,
    entregable_actividad_estado VARCHAR,
    entregable_envio_estado VARCHAR,
    entregable_fecha_inicio TIMESTAMP WITH TIME ZONE,
    entregable_fecha_fin TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    v_current_date TIMESTAMP WITH TIME ZONE := NOW();
    v_tema_id INT;
    v_current_entregable_id INT;
    v_current_entregable_nombre VARCHAR;
    v_fecha_fin_entregable TIMESTAMP WITH TIME ZONE;
    v_ciclo_actual_id INT;
    v_fase_actual VARCHAR;
    v_next_entregable_nombre VARCHAR;
    v_entregable_actividad_estado VARCHAR;
    v_entregable_envio_estado VARCHAR;
    v_entregable_fecha_inicio TIMESTAMP WITH TIME ZONE;
    v_entregable_fecha_fin TIMESTAMP WITH TIME ZONE;
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

    -- Obtenemos el ciclo actual del tesista
    SELECT efc.ciclo_id INTO v_ciclo_actual_id
    FROM etapa_formativa_x_ciclo efc
    JOIN exposicion e ON e.etapa_formativa_x_ciclo_id = efc.etapa_formativa_x_ciclo_id
    JOIN exposicion_x_tema ext ON ext.exposicion_id = e.exposicion_id
    WHERE ext.tema_id = v_tema_id
      AND efc.activo = TRUE
      AND e.activo = TRUE
      AND ext.activo = TRUE
    ORDER BY efc.fecha_creacion DESC
    LIMIT 1;

    -- Determinamos la fase actual basada en el cronograma de entregables
    SELECT
        e.entregable_id,
        e.nombre,
        e.fecha_fin,
        e.estado::VARCHAR,
        et.estado::VARCHAR,
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
    JOIN etapa_formativa_x_ciclo efc ON efc.etapa_formativa_x_ciclo_id = e.etapa_formativa_x_ciclo_id
    WHERE et.tema_id = v_tema_id
      AND e.fecha_inicio <= v_current_date
      AND e.fecha_fin >= v_current_date
      AND e.activo = TRUE
      AND et.activo = TRUE
      AND efc.activo = TRUE
    ORDER BY e.fecha_fin ASC
    LIMIT 1;

    -- Determinamos la fase actual
    IF v_current_entregable_id IS NOT NULL THEN
        v_fase_actual := 'ENTREGABLE: ' || v_current_entregable_nombre;
    ELSE
        -- Verificar si está fuera del cronograma (después del último entregable)
        SELECT
            e.entregable_id,
            e.nombre,
            e.fecha_fin,
            e.estado::VARCHAR,
            et.estado::VARCHAR,
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
        JOIN etapa_formativa_x_ciclo efc ON efc.etapa_formativa_x_ciclo_id = e.etapa_formativa_x_ciclo_id
        WHERE et.tema_id = v_tema_id
          AND e.activo = TRUE
          AND et.activo = TRUE
          AND efc.activo = TRUE
        ORDER BY e.fecha_fin DESC
        LIMIT 1;

        IF v_current_entregable_id IS NOT NULL AND v_fecha_fin_entregable < v_current_date THEN
            v_fase_actual := 'FINALIZADO - FUERA DE CRONOGRAMA';
        ELSE
            -- Buscamos el próximo entregable programado
            SELECT
                e.nombre,
                e.entregable_id,
                e.estado::VARCHAR,
                et.estado::VARCHAR,
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
            JOIN etapa_formativa_x_ciclo efc ON efc.etapa_formativa_x_ciclo_id = e.etapa_formativa_x_ciclo_id
            WHERE et.tema_id = v_tema_id
              AND e.fecha_inicio > v_current_date
              AND e.activo = TRUE
              AND et.activo = TRUE
              AND efc.activo = TRUE
            ORDER BY e.fecha_inicio ASC
            LIMIT 1;

            IF v_next_entregable_nombre IS NOT NULL THEN
                v_fase_actual := v_next_entregable_nombre;
            ELSE
                v_fase_actual := 'SIN ENTREGABLES PROGRAMADOS';
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
        -- Datos del tema/proyecto
        t.tema_id,
        t.titulo AS titulo_tema,
        t.resumen AS resumen_tema,
        t.metodologia,
        t.objetivos,
        -- Datos del área de conocimiento
        ac.nombre AS area_conocimiento,
        sac.nombre AS sub_area_conocimiento,
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
        c.ciclo_id,
        CONCAT(c.anio, '-', c.semestre) AS ciclo_nombre,
        c.fecha_inicio AS fecha_inicio_ciclo,
        c.fecha_fin AS fecha_fin_ciclo,
        -- Datos de la etapa formativa
        ef.etapa_formativa_id,
        ef.nombre AS etapa_formativa_nombre,
        -- Fase actual
        v_fase_actual AS fase_actual,
        -- Información del entregable actual (nuevos campos)
        v_current_entregable_id AS entregable_id,
        v_current_entregable_nombre AS entregable_nombre,
        v_entregable_actividad_estado AS entregable_actividad_estado,
        v_entregable_envio_estado AS entregable_envio_estado,
        v_entregable_fecha_inicio AS entregable_fecha_inicio,
        v_entregable_fecha_fin AS entregable_fecha_fin
    FROM usuario u
    JOIN usuario_tema ut ON ut.usuario_id = u.usuario_id AND ut.activo = TRUE
    JOIN rol r_tesista ON r_tesista.rol_id = ut.rol_id AND r_tesista.nombre = 'Tesista'
    JOIN tema t ON t.tema_id = ut.tema_id AND t.activo = TRUE
    -- Unión con áreas de conocimiento
    LEFT JOIN sub_area_conocimiento_tema sact ON sact.tema_id = t.tema_id AND sact.activo = TRUE
    LEFT JOIN sub_area_conocimiento sac ON sac.sub_area_conocimiento_id = sact.sub_area_conocimiento_id AND sac.activo = TRUE
    LEFT JOIN area_conocimiento ac ON ac.area_conocimiento_id = sac.area_conocimiento_id AND ac.activo = TRUE
    -- Unión con ciclo y etapa formativa
    LEFT JOIN exposicion_x_tema ext ON ext.tema_id = t.tema_id AND ext.activo = TRUE
    LEFT JOIN exposicion e ON e.exposicion_id = ext.exposicion_id AND e.activo = TRUE
    LEFT JOIN etapa_formativa_x_ciclo efc ON efc.etapa_formativa_x_ciclo_id = e.etapa_formativa_x_ciclo_id AND efc.activo = TRUE
    LEFT JOIN ciclo c ON c.ciclo_id = efc.ciclo_id AND c.activo = TRUE
    LEFT JOIN etapa_formativa ef ON ef.etapa_formativa_id = efc.etapa_formativa_id AND ef.activo = TRUE
    WHERE u.usuario_id = p_tesista_id
      AND t.tema_id = v_tema_id
    GROUP BY
        u.usuario_id,
        u.nombres,
        u.primer_apellido,
        u.segundo_apellido,
        u.correo_electronico,
        u.nivel_estudios,
        u.codigo_pucp,
        t.tema_id,
        t.titulo,
        t.resumen,
        t.metodologia,
        t.objetivos,
        ac.nombre,
        sac.nombre,
        c.ciclo_id,
        c.anio,
        c.semestre,
        c.fecha_inicio,
        c.fecha_fin,
        ef.etapa_formativa_id,
        ef.nombre;
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
