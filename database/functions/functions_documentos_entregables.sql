CREATE OR REPLACE FUNCTION listar_etapas_formativas_alumno(p_usuario_id INTEGER)
RETURNS TABLE (
    etapa_formativa_id INTEGER,
    etapa_formativa_nombre TEXT,
    ciclo_id INTEGER,
    ciclo_nombre VARCHAR,
    tema_id INTEGER,
    tema_titulo VARCHAR,
    tema_resumen TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ef.etapa_formativa_id,
        ef.nombre AS etapa_formativa_nombre,
        c.ciclo_id,
        c.nombre AS ciclo_nombre,
        t.tema_id,
        t.titulo AS tema_titulo,
        t.resumen AS tema_resumen
    FROM usuario_tema ut
    JOIN etapa_formativa_x_ciclo_x_tema efcxt ON efcxt.tema_id = ut.tema_id
    JOIN etapa_formativa_x_ciclo efc ON efc.etapa_formativa_x_ciclo_id = efcxt.etapa_formativa_x_ciclo_id
    JOIN etapa_formativa ef ON ef.etapa_formativa_id = efc.etapa_formativa_id
    JOIN ciclo c ON c.ciclo_id = efc.ciclo_id
    JOIN tema t ON t.tema_id = ut.tema_id
    WHERE ut.usuario_id = p_usuario_id
      AND ut.asignado = TRUE
      AND ut.rechazado = FALSE
      AND t.estado_tema_id IN (6, 10, 11, 12);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION obtener_entregables_alumno(p_usuario_id INTEGER)
RETURNS TABLE (
    entregable_id INTEGER,
    entregable_nombre VARCHAR,
    entregable_descripcion TEXT,
    entregable_fecha_inicio TIMESTAMP WITH TIME ZONE,
    entregable_fecha_fin TIMESTAMP WITH TIME ZONE,
    entregable_estado TEXT,
    entregable_es_evaluable BOOLEAN,
    entregable_maximo_documentos INTEGER,
    entregable_extensiones_permitidas TEXT,
    entregable_peso_maximo_documento INTEGER,
    etapa_formativa_id INTEGER,
    etapa_formativa_nombre TEXT,
    ciclo_id INTEGER,
    ciclo_nombre VARCHAR,
    ciclo_anio INTEGER,
    ciclo_semestre VARCHAR,
    tema_id INTEGER,
    fecha_envio TIMESTAMP WITH TIME ZONE,
    comentario TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.entregable_id,
        e.nombre,
        e.descripcion,
        e.fecha_inicio,
        e.fecha_fin,
        et.estado::text,
        e.es_evaluable,
        e.maximo_documentos,
        e.extensiones_permitidas,
        e.peso_maximo_documento,
        ef.etapa_formativa_id,
        ef.nombre AS etapa_formativa_nombre,
        c.ciclo_id,
        c.nombre AS ciclo_nombre,
        c.anio AS ciclo_anio,
        c.semestre AS ciclo_semestre,
        et.tema_id,
        et.fecha_envio,
        et.comentario
    FROM usuario_tema ut
    JOIN entregable_x_tema et ON et.tema_id = ut.tema_id
    JOIN entregable e ON e.entregable_id = et.entregable_id
    JOIN etapa_formativa_x_ciclo efc ON efc.etapa_formativa_x_ciclo_id = e.etapa_formativa_x_ciclo_id
    JOIN etapa_formativa ef ON ef.etapa_formativa_id = efc.etapa_formativa_id
    JOIN ciclo c ON c.ciclo_id = efc.ciclo_id
    JOIN tema t ON t.tema_id = ut.tema_id
    WHERE ut.usuario_id = p_usuario_id
      AND ut.asignado = TRUE
      AND ut.rechazado = FALSE
      AND t.estado_tema_id IN (6, 10, 11, 12);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_documentos_x_entregable(p_entregable_x_tema_id INTEGER)
RETURNS TABLE (
    documentoId INTEGER,
    nombre_documento VARCHAR,
    fecha_subida TIMESTAMP WITH TIME ZONE,
    link_archivo_subido TEXT,
    entregable_tema_id INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.documento_id AS documentoId,
        d.nombre_documento,
        d.fecha_subida,
        v.link_archivo_subido,
        v.entregable_x_tema_id AS entregable_tema_id
    FROM version_documento v
    JOIN documento d ON d.documento_id = v.documento_id
    WHERE v.entregable_x_tema_id = p_entregable_x_tema_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION entregar_entregable(
    p_entregable_x_tema_id INTEGER,
    p_comentario TEXT,
    p_estado TEXT
)
RETURNS VOID AS $$
BEGIN
    UPDATE entregable_x_tema
    SET
        fecha_envio = CURRENT_TIMESTAMP AT TIME ZONE 'America/Lima',
        comentario = p_comentario,
        estado = p_estado::enum_estado_entrega,
        fecha_modificacion = CURRENT_TIMESTAMP AT TIME ZONE 'America/Lima'
    WHERE entregable_x_tema_id = p_entregable_x_tema_id;
END;
$$ LANGUAGE plpgsql;