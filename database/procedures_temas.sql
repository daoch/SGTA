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
        t.titulo::TEXT,  -- Conversión explícita a TEXT
        string_agg(DISTINCT sac.nombre, ', ') AS subareas,
        array_agg(DISTINCT sac.sub_area_conocimiento_id) AS subarea_ids,
        (u_alumno.nombres || ' ' || u_alumno.primer_apellido) AS alumno,
        array_agg(DISTINCT u_alumno.usuario_id) AS usuario_id_alumno,
        t.resumen::TEXT,  -- Conversión explícita a TEXT si necesario
        t.metodologia::TEXT,  -- Conversión explícita a TEXT si necesario
        t.objetivo::TEXT,  -- Conversión explícita a TEXT si necesario
        r.documento_url::TEXT,  -- Conversión explícita a TEXT
        t.activo,
        t.fecha_limite,
        t.fecha_creacion,
        t.fecha_modificacion
    FROM public.tema t
    INNER JOIN public.usuario_tema ut_asesor 
        ON ut_asesor.tema_id = t.tema_id AND ut_asesor.rol_id = 1
    INNER JOIN public.usuario u_asesor 
        ON u_asesor.usuario_id = ut_asesor.usuario_id
    INNER JOIN public.usuario_tema ut_alumno 
        ON ut_alumno.tema_id = t.tema_id AND ut_alumno.rol_id = 2
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
        u_asesor.usuario_id = p_asesor_id
        AND t.activo = true
        AND et.estado_tema_id = 1
    GROUP BY 
        t.tema_id, t.titulo, t.resumen, t.metodologia, t.objetivo, 
        u_alumno.nombres, u_alumno.primer_apellido, r.documento_url;
END;
$$ LANGUAGE plpgsql;