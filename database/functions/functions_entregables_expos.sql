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
    bloque_horario_exposicion_id INTEGER
)
AS
$$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        e.exposicion_id,
        e.nombre::TEXT,
        e.descripcion::TEXT,
        b.datetime_inicio,
        b.datetime_fin,
        b.bloque_horario_exposicion_id
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

CREATE OR REPLACE FUNCTION listar_etapa_formativa_x_ciclo_x_id(
    etapaXCicloId INTEGER
)
RETURNS TABLE (
    etapa_formativa_id INTEGER,
    nombre_etapa_formativa TEXT,
    creditaje_por_tema NUMERIC,
    duracion_exposicion TEXT,
    ciclo_id INTEGER,
    nombre_ciclo VARCHAR(255),
    etapa_formativa_x_ciclo_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        ef.etapa_formativa_id,
        ef.nombre AS nombre_etapa_formativa,
        ef.creditaje_por_tema,
        ef.duracion_exposicion::TEXT AS duracion_exposicion,
        c.ciclo_id,
        c.nombre AS nombre_ciclo,
        efc.etapa_formativa_x_ciclo_id
    FROM etapa_formativa_x_ciclo efc
    JOIN etapa_formativa ef ON efc.etapa_formativa_id = ef.etapa_formativa_id
    JOIN ciclo c ON efc.ciclo_id = c.ciclo_id
    WHERE efc.etapa_formativa_x_ciclo_id = etapaXCicloId;
END;
$$;

CREATE OR REPLACE FUNCTION listar_reuniones_por_asesor(asesorId INTEGER)
RETURNS TABLE (
    reunion_id INTEGER,
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
    SELECT DISTINCT
        r.reunion_id,
		r.titulo::TEXT,
		r.descripcion::TEXT,
		r.fecha_hora_inicio,
		r.fecha_hora_fin,
		r.activo::TEXT
    FROM
        reunion r
		JOIN usuario_reunion ur ON r.reunion_id = ur.reunion_id
    WHERE
        ur.usuario_id = asesorId
		AND r.activo = true;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_tesistas_por_reunion(reunionId INTEGER)
RETURNS TABLE (
    tesista_id INTEGER,
    nombre TEXT,
    tema TEXT
)
AS
$$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        u.usuario_id,
		CONCAT(u.nombres, ' ', u.primer_apellido, ' ', u.segundo_apellido),
		t.titulo::TEXT
    FROM
        usuario_reunion ur
		JOIN usuario u ON u.usuario_id = ur.usuario_id
		JOIN usuario_tema ut ON u.usuario_id = ut.usuario_id
		JOIN tema t ON ut.tema_id = t.tema_id
    WHERE
        ur.reunion_id = reunionId
		AND ut.rol_id = 4
		AND ut.activo = true
		AND t.activo = true;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_tesistas_por_asesor_lite(usuarioId INTEGER)
RETURNS TABLE (
    tesista_id INTEGER,
    nombre TEXT,
    tema TEXT
)
AS
$$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        ut_tesista.usuario_id,
        CONCAT(u.nombres, ' ', u.primer_apellido, ' ', u.segundo_apellido),
        t.titulo::TEXT
    FROM usuario_tema ut_asesor
    JOIN usuario_tema ut_tesista ON ut_asesor.tema_id = ut_tesista.tema_id
    JOIN usuario u ON u.usuario_id = ut_tesista.usuario_id
    JOIN tema t ON t.tema_id = ut_tesista.tema_id
    WHERE
        ut_asesor.usuario_id = usuarioId
        AND ut_asesor.rol_id = 1                      -- Asesor
        AND ut_asesor.rechazado = FALSE
        AND ut_asesor.activo = TRUE
        AND ut_tesista.rol_id = 4                    -- Tesista
        AND ut_tesista.rechazado = FALSE
        AND ut_tesista.activo = TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_tesistas_por_exposicion(exposicionId INTEGER)More actions
RETURNS TABLE (
    tesista_id INTEGER,
    nombre TEXT,
    tema TEXT
)
AS
$$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        u.usuario_id,
        CONCAT(u.nombres, ' ', u.primer_apellido, ' ', u.segundo_apellido),
        t.titulo::TEXT
    FROM usuario u
    JOIN usuario_tema ut ON ut.usuario_id = u.usuario_id
    JOIN tema t ON t.tema_id = ut.tema_id
	JOIN exposicion_x_tema et ON et.tema_id = t.tema_id
	JOIN bloque_horario_exposicion bhe ON bhe.exposicion_x_tema_id = et.exposicion_x_tema_id
    WHERE
        bhe.bloque_horario_exposicion_id = exposicionId
        AND ut.rol_id = 4
        AND ut.rechazado = FALSE
        AND ut.activo = TRUE;
END;
$$ LANGUAGE plpgsql;
        
CREATE OR REPLACE FUNCTION obtener_asesor_por_alumno(p_alumno_id INTEGER)
RETURNS TABLE (
    usuario_id INTEGER,
    nombres VARCHAR,
    primer_apellido VARCHAR,
    segundo_apellido VARCHAR
) AS $$
DECLARE
    v_tema_id INTEGER;
BEGIN
    -- 1. Buscar el tema_id del alumno con rol Tesista, asignado y activo
    SELECT ut.tema_id INTO v_tema_id
    FROM usuario_tema ut
    JOIN rol r ON ut.rol_id = r.rol_id
    WHERE ut.usuario_id = p_alumno_id
      AND r.nombre = 'Tesista'
      AND ut.asignado = TRUE
      AND ut.activo = TRUE
    LIMIT 1;

    -- 2. Buscar los datos del Asesor para ese tema_id, asignado y activo
    RETURN QUERY
    SELECT
        u.usuario_id,
        u.nombres,
        u.primer_apellido,
        u.segundo_apellido
    FROM usuario_tema ut
    JOIN rol r ON ut.rol_id = r.rol_id
    JOIN usuario u ON ut.usuario_id = u.usuario_id
    WHERE ut.tema_id = v_tema_id
      AND r.nombre = 'Asesor'
      AND ut.asignado = TRUE
      AND ut.activo = TRUE
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;