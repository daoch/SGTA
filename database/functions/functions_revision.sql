--DROP FUNCTION sgtadb.obtener_documentos_asesor(int4);

CREATE OR REPLACE FUNCTION sgtadb.obtener_documentos_asesor(asesorid integer)
 RETURNS TABLE(
    revision_id INTEGER,
    tema TEXT,
    entregable TEXT,
    estudiante TEXT,
    codigo TEXT,
    curso TEXT,
    fecha_carga TIMESTAMP WITH TIME ZONE,
    estado_revision TEXT,
    entrega_a_tiempo BOOLEAN,
    fecha_limite TIMESTAMP WITH TIME ZONE
 )
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        rd.revision_documento_id AS revision_id,
        t.titulo::TEXT AS tema,
        e.nombre::TEXT AS entregable,
        (u.nombres || ' ' || u.primer_apellido || ' ' || u.segundo_apellido)::TEXT AS estudiante,
        u.codigo_pucp::TEXT AS codigo,
        ef.nombre::TEXT AS curso,
        vd.fecha_ultima_subida,
        rd.estado_revision::TEXT AS estado_revision,
        CASE 
            WHEN rd.fecha_limite_revision IS NOT NULL 
                 AND vd.fecha_ultima_subida::DATE <= rd.fecha_limite_revision THEN TRUE
            ELSE FALSE
        END AS entrega_a_tiempo,
        rd.fecha_limite_revision::TIMESTAMP WITH TIME ZONE  -- ← Aquí el cambio
    FROM usuario_tema ut_asesor
    JOIN tema t ON ut_asesor.tema_id = t.tema_id
    JOIN usuario_tema ut_estudiante 
        ON ut_estudiante.tema_id = t.tema_id 
        AND ut_estudiante.rol_id != ut_asesor.rol_id
    JOIN usuario u ON u.usuario_id = ut_estudiante.usuario_id
    JOIN entregable_x_tema ext ON ext.tema_id = t.tema_id
    JOIN entregable e ON e.entregable_id = ext.entregable_id
    JOIN etapa_formativa_x_ciclo efc ON e.etapa_formativa_x_ciclo_id = efc.etapa_formativa_x_ciclo_id
    JOIN etapa_formativa ef ON ef.etapa_formativa_id = efc.etapa_formativa_id
    JOIN version_documento vd ON vd.entregable_x_tema_id = ext.entregable_x_tema_id
    LEFT JOIN revision_documento rd ON rd.version_documento_id = vd.version_documento_id
    WHERE ut_asesor.usuario_id = asesorid 
      AND ut_asesor.rol_id = 1
      AND vd.activo = TRUE
      AND ext.activo = TRUE
      AND e.activo = TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION sgtadb.obtener_observaciones_por_entregable_y_tema(
    p_entregable_id INTEGER,
    p_tema_id INTEGER
)
RETURNS TABLE (
    observacion_id INTEGER,
    comentario TEXT,
    contenido TEXT,
    numero_pagina_inicio INTEGER,
    numero_pagina_fin INTEGER,
    fecha_creacion TIMESTAMPTZ,
    tipo_observacion_id INTEGER,
    revision_id INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        o.observacion_id,
        o.comentario,
        o.contenido,
        o.numero_pagina_inicio,
        o.numero_pagina_fin,
        o.fecha_creacion,
        o.tipo_observacion_id,
        r.revision_documento_id
    FROM entregable_x_tema et
    JOIN version_documento vd ON vd.entregable_x_tema_id = et.entregable_x_tema_id
    JOIN revision_documento r ON r.version_documento_id = vd.version_documento_id
    JOIN observacion o ON o.revision_id = r.revision_documento_id
    WHERE et.entregable_id = p_entregable_id
      AND et.tema_id = p_tema_id
      AND o.activo = TRUE;
END;
$$ LANGUAGE plpgsql;