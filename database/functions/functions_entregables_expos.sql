CREATE OR REPLACE FUNCTION listar_entregables_x_etapa_formativa_x_ciclo(etapaFormativaXCicloId INTEGER)
RETURNS TABLE (
    id INTEGER,
    etapa_formativa_x_ciclo_id INTEGER,
    nombre VARCHAR(150),
    descripcion TEXT,
    fecha_inicio TIMESTAMP WITH TIME ZONE,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    estado enum_estado_actividad,
    es_evaluable BOOLEAN
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
        e.estado AS estado,
        e.es_evaluable
    FROM entregable e
    INNER JOIN etapa_formativa_x_ciclo efc ON e.etapa_formativa_x_ciclo_id = efc.etapa_formativa_x_ciclo_id
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