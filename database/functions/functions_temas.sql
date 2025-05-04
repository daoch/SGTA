CREATE OR REPLACE FUNCTION listar_temas_propuestos_por_subarea_conocimiento(
    p_subareas_ids INT[]
)
RETURNS TABLE (
    tema_id INT,
    titulo TEXT,
    subareas_id INT[],
    alumnos_id INT[],
    descripcion TEXT,
    metodologia TEXT,
    objetivo TEXT,
    recurso TEXT,
    activo BOOLEAN,
    fecha_limite TIMESTAMPTZ,
    fecha_creacion TIMESTAMPTZ,
    fecha_modificacion TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.tema_id,
        t.titulo::text, 
        ARRAY(
            SELECT DISTINCT sact2.sub_area_conocimiento_id
            FROM sub_area_conocimiento_tema sact2
            WHERE sact2.tema_id = t.tema_id
        ) AS subareas_id,
        ARRAY(
            SELECT ut2.usuario_id
            FROM usuario_tema ut2
            WHERE ut2.tema_id = t.tema_id AND ut2.rol_id = 2
        ) AS alumnos_id,
        t.resumen::text,
        t.metodologia::text,
        t.objetivo::text,
        r.documento_url::text,
        t.activo,
        t.fecha_limite,
        t.fecha_creacion,
        t.fecha_modificacion
    FROM public.tema t
    LEFT JOIN estado_tema et ON t.estado_tema_id = et.estado_tema_id
    LEFT JOIN sub_area_conocimiento_tema sact ON sact.tema_id = t.tema_id
    LEFT JOIN recurso r ON r.tema_id = t.tema_id AND r.activo = true
    WHERE 
        t.activo = true
        AND et.estado_tema_id = (
            SELECT estado_tema_id 
            FROM estado_tema 
            WHERE nombre ILIKE 'Propuesto'
            LIMIT 1
        )
        AND sact.sub_area_conocimiento_id = ANY(p_subareas_ids)
    GROUP BY 
        t.tema_id, t.titulo, t.resumen, t.metodologia, t.objetivo, 
        r.documento_url, t.activo, t.fecha_limite, t.fecha_creacion, t.fecha_modificacion;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_temas_propuestos_al_asesor(p_asesor_id INT)
RETURNS TABLE (
    tema_id INT, 
    titulo TEXT,
    subareas TEXT,
    subarea_ids INT[],
    alumno TEXT,
    usuario_id_alumno INT[],
    descripcion TEXT,
    metodologia TEXT,
    objetivo TEXT,
    recurso TEXT,  
    activo BOOLEAN,
    fecha_limite TIMESTAMPTZ,
    fecha_creacion TIMESTAMPTZ,
    fecha_modificacion TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.tema_id,
        t.titulo::TEXT,
        string_agg(DISTINCT sac.nombre, ', ') AS subareas,
        array_agg(DISTINCT sac.sub_area_conocimiento_id) AS subarea_ids,
        (u_alumno.nombres || ' ' || u_alumno.primer_apellido) AS alumno,
        array_agg(DISTINCT u_alumno.usuario_id) AS usuario_id_alumno,
        t.resumen::TEXT,
        t.metodologia::TEXT,
        t.objetivo::TEXT,
        r.documento_url::TEXT,
        t.activo,
        t.fecha_limite,
        t.fecha_creacion,
        t.fecha_modificacion
    FROM public.tema t
    INNER JOIN public.usuario_tema ut_asesor 
        ON ut_asesor.tema_id = t.tema_id 
        AND ut_asesor.rol_id = (
            SELECT rol_id FROM rol WHERE nombre ILIKE 'Asesor' LIMIT 1
        )
        AND ut_asesor.usuario_id = p_asesor_id
        AND ut_asesor.asignado = false
    INNER JOIN public.usuario u_asesor 
        ON u_asesor.usuario_id = ut_asesor.usuario_id
    INNER JOIN public.usuario_tema ut_alumno 
        ON ut_alumno.tema_id = t.tema_id 
        AND ut_alumno.rol_id = (
            SELECT rol_id FROM rol WHERE nombre ILIKE 'Creador' LIMIT 1
        )
    INNER JOIN public.usuario u_alumno 
        ON u_alumno.usuario_id = ut_alumno.usuario_id
    LEFT JOIN public.estado_tema et 
        ON t.estado_tema_id = et.estado_tema_id
    LEFT JOIN public.sub_area_conocimiento_tema sact 
        ON sact.tema_id = t.tema_id
    LEFT JOIN public.sub_area_conocimiento sac 
        ON sac.sub_area_conocimiento_id = sact.sub_area_conocimiento_id
    LEFT JOIN public.recurso r 
        ON r.tema_id = t.tema_id AND r.activo = true
    WHERE 
        t.activo = true
        AND et.estado_tema_id = (
            SELECT estado_tema_id 
            FROM estado_tema 
            WHERE nombre ILIKE 'Propuesto'
            LIMIT 1
        )
    GROUP BY 
        t.tema_id, t.titulo, t.resumen, t.metodologia, t.objetivo, 
        u_alumno.nombres, u_alumno.primer_apellido, r.documento_url;
END;
$$ LANGUAGE plpgsql;

-- 1) Función que lista temas de un usuario según rol y estado
CREATE OR REPLACE FUNCTION listar_temas_por_usuario_rol_estado(
  p_usuario_id    INT,
  p_rol_nombre    TEXT,
  p_estado_nombre TEXT
)
RETURNS TABLE (
  tema_id            INT,
  titulo             TEXT,
  resumen            TEXT,
  metodologia         TEXT,
  objetivos          TEXT,
  portafolio_url     TEXT,
  activo             BOOLEAN,
  fecha_limite       TIMESTAMPTZ,
  fecha_creacion     TIMESTAMPTZ,
  fecha_modificacion TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.tema_id,
    t.titulo::text,
    t.resumen,
    t.metodologia,
    t.objetivos,
    t.portafolio_url::text,
    t.activo,
    t.fecha_limite,
    t.fecha_creacion,
    t.fecha_modificacion
  FROM tema t
  JOIN usuario_tema ut
    ON ut.tema_id = t.tema_id
  JOIN rol r
    ON ut.rol_id = r.rol_id
  JOIN estado_tema et
    ON t.estado_tema_id = et.estado_tema_id
  WHERE
    ut.usuario_id = p_usuario_id
    AND r.nombre ILIKE p_rol_nombre
    AND et.nombre ILIKE p_estado_nombre
    AND t.activo = TRUE;
END;
$$ LANGUAGE plpgsql;


-- 2) Función que lista usuarios vinculados a un tema según rol
CREATE OR REPLACE FUNCTION listar_usuarios_por_tema_y_rol(
    p_tema_id    INT,
    p_rol_nombre TEXT
)
RETURNS TABLE (
    usuario_id         INT,
    nombres            TEXT,
    primer_apellido    TEXT,
    segundo_apellido   TEXT,
    correo_electronico TEXT,
    activo             BOOLEAN,
    fecha_creacion     TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
      u.usuario_id,
      u.nombres::text,
      u.primer_apellido::text,
      u.segundo_apellido::text,
      u.correo_electronico::text,
      u.activo,
      u.fecha_creacion
    FROM usuario u
    JOIN usuario_tema ut
      ON ut.usuario_id = u.usuario_id
    JOIN rol r
      ON ut.rol_id = r.rol_id
    WHERE
      ut.tema_id = p_tema_id
      AND r.nombre ILIKE p_rol_nombre
      AND u.activo = TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_subareas_por_tema(
  p_tema_id INT
)
RETURNS TABLE (
  sub_area_conocimiento_id INT,
  nombre                   TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    sac.sub_area_conocimiento_id,
    sac.nombre::text
  FROM sub_area_conocimiento_tema sact
  JOIN sub_area_conocimiento sac
    ON sac.sub_area_conocimiento_id = sact.sub_area_conocimiento_id
  WHERE
    sact.tema_id = p_tema_id
    AND sac.activo = TRUE;
END;
$$ LANGUAGE plpgsql;

