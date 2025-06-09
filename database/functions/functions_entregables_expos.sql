SET search_path TO sgtadb;

DROP FUNCTION IF EXISTS listar_entregables_x_etapa_formativa_x_ciclo;
DROP FUNCTION IF EXISTS listar_criterios_entregable_x_entregable;
DROP FUNCTION IF EXISTS listar_exposiciones_x_etapa_formativa_x_ciclo;
DROP FUNCTION IF EXISTS listar_criterios_exposicion_x_exposicion;
DROP FUNCTION IF EXISTS listar_entregables_por_usuario;
DROP FUNCTION IF EXISTS listar_exposiciones_por_usuario;
DROP FUNCTION IF EXISTS listar_entregables_con_envio_x_etapa_formativa_x_ciclo;

CREATE OR REPLACE FUNCTION listar_entregables_x_etapa_formativa_x_ciclo(etapaFormativaXCicloId INTEGER)
RETURNS TABLE (
    id INTEGER,
    etapa_formativa_x_ciclo_id INTEGER,
    nombre VARCHAR(150),
    descripcion TEXT,
    fecha_inicio TIMESTAMP WITH TIME ZONE,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    estado enum_estado_actividad,
    es_evaluable BOOLEAN,
    maximo_documentos INTEGER,
    extensiones_permitidas TEXT,
    peso_maximo_documento INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.entregable_id AS id,
        e.etapa_formativa_x_ciclo_id,
        e.nombre,
        e.descripcion,
        e.fecha_inicio,
        e.fecha_fin,
        e.estado,
        e.es_evaluable,
        e.maximo_documentos,
        e.extensiones_permitidas,
        e.peso_maximo_documento
    FROM entregable e
    INNER JOIN etapa_formativa_x_ciclo efc 
        ON e.etapa_formativa_x_ciclo_id = efc.etapa_formativa_x_ciclo_id
    WHERE efc.etapa_formativa_x_ciclo_id = etapaFormativaXCicloId
      AND e.activo = TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_criterios_entregable_x_entregable(entregableId INTEGER)
RETURNS TABLE (
    id INTEGER,
    nombre VARCHAR(100),
    nota_maxima NUMERIC(6, 2),
    descripcion TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ce.criterio_entregable_id AS id,
        ce.nombre,
        ce.nota_maxima,
        ce.descripcion
    FROM criterio_entregable ce
    WHERE ce.entregable_id = entregableId
      AND ce.activo = TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_exposiciones_x_etapa_formativa_x_ciclo(etapaFormativaXCicloId INTEGER)
RETURNS TABLE(
    id INTEGER,
    etapa_formativa_x_ciclo_id INTEGER,
    nombre TEXT,
    descripcion TEXT,
    estado_planificacion_id INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.exposicion_id AS id,
        e.etapa_formativa_x_ciclo_id,
        e.nombre,
        e.descripcion,
        e.estado_planificacion_id
    FROM exposicion e
    INNER JOIN etapa_formativa_x_ciclo efc ON e.etapa_formativa_x_ciclo_id = efc.etapa_formativa_x_ciclo_id
    WHERE efc.etapa_formativa_x_ciclo_id = etapaFormativaXCicloId
        AND e.activo = TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_criterios_exposicion_x_exposicion(exposicionId INTEGER)
RETURNS TABLE (
    id INTEGER,
    exposicion_id INTEGER,
    nombre TEXT,
	descripcion TEXT,
    nota_maxima NUMERIC(5, 2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ce.criterio_exposicion_id AS id,
        ce.exposicion_id,
        ce.nombre,
		ce.descripcion,
        ce.nota_maxima
    FROM criterio_exposicion ce
    WHERE ce.exposicion_id = exposicionId
      AND ce.activo = TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_entregables_por_usuario(usuarioId INTEGER)
RETURNS TABLE (
    entregable_id INTEGER,
    nombre TEXT,
    descripcion TEXT,
    fecha_inicio TIMESTAMPTZ,
    fecha_fin TIMESTAMPTZ,
    estado TEXT,
    es_evaluable BOOLEAN
)
AS
$$
BEGIN
    RETURN QUERY
    SELECT
        e.entregable_id,
        e.nombre::TEXT,
        e.descripcion::TEXT,
        e.fecha_inicio,
        e.fecha_fin,
        e.estado::TEXT,
        e.es_evaluable
    FROM
        entregable e
        JOIN etapa_formativa_x_ciclo efc ON e.etapa_formativa_x_ciclo_id = efc.etapa_formativa_x_ciclo_id
        JOIN etapa_formativa_x_ciclo_x_tema efcxt ON efcxt.etapa_formativa_x_ciclo_id = efc.etapa_formativa_x_ciclo_id
        JOIN usuario_tema ut ON ut.tema_id = efcxt.tema_id
    WHERE
        ut.usuario_id = usuarioId
        AND e.activo = TRUE
        AND efcxt.activo = TRUE
        AND ut.activo = TRUE
        AND ut.rechazado = FALSE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_exposiciones_por_usuario(usuarioId INTEGER)
RETURNS TABLE (
    exposicion_id INTEGER,
    nombre TEXT,
    descripcion TEXT,
    fecha_inicio TIMESTAMPTZ,
    fecha_fin TIMESTAMPTZ,
    estado TEXT
)
AS
$$
BEGIN
    RETURN QUERY
    SELECT
        e.exposicion_id,
        e.nombre::TEXT,
        e.descripcion::TEXT,
        b.datetime_inicio,
        b.datetime_fin,
        e.activo::TEXT
    FROM
        exposicion e
		JOIN exposicion_x_tema et ON et.exposicion_id = e.exposicion_id
		JOIN bloque_horario_exposicion b ON b.exposicion_x_tema_id = et.exposicion_x_tema_id
		JOIN usuario_tema ut ON ut.tema_id = et.tema_id
    WHERE
        ut.usuario_id = usuarioId
        AND e.activo = TRUE
        AND et.activo = TRUE
		AND ut.activo = TRUE
        AND b.activo = TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_entregables_con_envio_x_etapa_formativa_x_ciclo(
    etapaFormativaXCicloId INTEGER,
    temaId INTEGER
)
RETURNS TABLE (
    id INTEGER,
    etapa_formativa_x_ciclo_id INTEGER,
    nombre VARCHAR(150),
    descripcion TEXT,
    fecha_inicio TIMESTAMPTZ,
    fecha_fin TIMESTAMPTZ,
    estado enum_estado_actividad,
    es_evaluable BOOLEAN,
    maximo_documentos INTEGER,
    extensiones_permitidas TEXT,
    peso_maximo_documento INTEGER,
    fecha_envio TIMESTAMPTZ  -- ← aquí corregido el nombre
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.entregable_id,
        e.etapa_formativa_x_ciclo_id,
        e.nombre,
        e.descripcion,
        e.fecha_inicio,
        e.fecha_fin,
        e.estado,
        e.es_evaluable,
        e.maximo_documentos,
        e.extensiones_permitidas,
        e.peso_maximo_documento,
        et.fecha_envio::timestamptz
    FROM entregable e
    INNER JOIN etapa_formativa_x_ciclo efc
        ON e.etapa_formativa_x_ciclo_id = efc.etapa_formativa_x_ciclo_id
    LEFT JOIN entregable_x_tema et
        ON et.entregable_id = e.entregable_id AND et.tema_id = temaId
    WHERE efc.etapa_formativa_x_ciclo_id = etapaFormativaXCicloId
      AND e.activo = TRUE;
END;
$$ LANGUAGE plpgsql;