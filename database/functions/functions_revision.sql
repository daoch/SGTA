--DROP FUNCTION obtener_documentos_asesor(int4);

SET search_path TO sgtadb;

CREATE OR REPLACE FUNCTION sgtadb.obtener_documentos_asesor(asesorid integer)
 RETURNS TABLE(revision_id integer, tema text, entregable text, estudiante text, codigo text, curso text, fecha_carga timestamp with time zone, estado_revision text, entrega_a_tiempo boolean, fecha_limite timestamp with time zone, similitud double precision, ia double precision)
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
        rd.fecha_limite_revision::TIMESTAMP WITH TIME zone,
        vd.porcentaje_similitud,
        vd.porcentaje_ia
    FROM usuario_tema ut_asesor
    JOIN tema t ON ut_asesor.tema_id = t.tema_id
    JOIN usuario_tema ut_estudiante 
    	ON ut_estudiante.tema_id = t.tema_id 
    	AND ut_estudiante.rol_id = 4 -- Solo tesistas
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
      AND e.activo = TRUE
      AND rd.usuario_id=asesorid;
END;
$function$
;

--DROP FUNCTION IF EXISTS sgtadb.obtener_revision_documento_por_id(int4);

CREATE OR REPLACE FUNCTION obtener_revision_documento_por_id(revision_id_input integer)
RETURNS TABLE(
    revision_id integer,
    tema text,
    entregable text,
    estudiante text,
    codigo text,
    curso text,
    fecha_carga timestamp with time zone,
    estado_revision text,
    entrega_a_tiempo boolean,
    fecha_limite timestamp with time zone
) LANGUAGE plpgsql AS $ function $ BEGIN RETURN QUERY
SELECT
    rd.revision_documento_id AS revision_id,
    t.titulo :: TEXT AS tema,
    e.nombre :: TEXT AS entregable,
    (
        u.nombres || ' ' || u.primer_apellido || ' ' || u.segundo_apellido
    ) :: TEXT AS estudiante,
    u.codigo_pucp :: TEXT AS codigo,
    ef.nombre :: TEXT AS curso,
    vd.fecha_ultima_subida,
    rd.estado_revision :: TEXT AS estado_revision,
    CASE
        WHEN rd.fecha_limite_revision IS NOT NULL
        AND vd.fecha_ultima_subida :: DATE <= rd.fecha_limite_revision THEN TRUE
        ELSE FALSE
    END AS entrega_a_tiempo,
    rd.fecha_limite_revision :: TIMESTAMP WITH TIME ZONE
FROM
    usuario_tema ut_asesor
    JOIN tema t ON ut_asesor.tema_id = t.tema_id
    JOIN usuario_tema ut_estudiante ON ut_estudiante.tema_id = t.tema_id
    AND ut_estudiante.rol_id = 4 -- ✅ SOLO alumnos
    JOIN usuario u ON u.usuario_id = ut_estudiante.usuario_id
    JOIN entregable_x_tema ext ON ext.tema_id = t.tema_id
    JOIN entregable e ON e.entregable_id = ext.entregable_id
    JOIN etapa_formativa_x_ciclo efc ON e.etapa_formativa_x_ciclo_id = efc.etapa_formativa_x_ciclo_id
    JOIN etapa_formativa ef ON ef.etapa_formativa_id = efc.etapa_formativa_id
    JOIN version_documento vd ON vd.entregable_x_tema_id = ext.entregable_x_tema_id
    LEFT JOIN revision_documento rd ON rd.version_documento_id = vd.version_documento_id
WHERE
    ut_asesor.usuario_id = asesorid
    AND ut_asesor.rol_id IN (1, 5)
    AND vd.activo = TRUE
    AND ext.activo = TRUE
    AND e.activo = TRUE
    AND rd.usuario_id = asesorid;

END;

$ function $;

--DROP FUNCTION IF EXISTS sgtadb.obtener_revision_documento_por_id(int4);
CREATE
OR REPLACE FUNCTION obtener_revision_documento_por_id(revision_id_input integer) RETURNS TABLE(
    revision_id integer,
    tema text,
    entregable text,
    estudiante text,
    codigo text,
    curso text,
    fechaEntrega timestamp with time zone,
    fechaLimiteEntrega timestamp with time zone,
    fechaRevision timestamp with time zone,
    fechaLimiteRevision timestamp with time zone,
    estado_revision text,
    entrega_a_tiempo boolean,
    url_descarga text
) LANGUAGE plpgsql AS $ function $ BEGIN RETURN QUERY
SELECT
    rd.revision_documento_id AS revision_id,
    t.titulo :: TEXT AS tema,
    e.nombre :: TEXT AS entregable,
    (
        u.nombres || ' ' || u.primer_apellido || ' ' || u.segundo_apellido
    ) :: TEXT AS estudiante,
    u.codigo_pucp :: TEXT AS codigo,
    ef.nombre :: TEXT AS curso,
    vd.fecha_ultima_subida AS fechaEntrega,
    e.fecha_fin AS fechaLimiteEntrega,
    rd.fecha_modificacion AS fechaRevision,
    e.fecha_fin AS fechaLimiteRevision,
    rd.estado_revision :: TEXT AS estado_revision,
    CASE
        WHEN rd.fecha_limite_revision IS NOT NULL
        AND vd.fecha_ultima_subida :: DATE <= rd.fecha_limite_revision THEN TRUE
        ELSE FALSE
    END AS entrega_a_tiempo,
    vd.link_archivo_subido :: TEXT AS url_descarga
FROM
    revision_documento rd
    JOIN version_documento vd ON rd.version_documento_id = vd.version_documento_id
    JOIN entregable_x_tema ext ON vd.entregable_x_tema_id = ext.entregable_x_tema_id
    JOIN entregable e ON ext.entregable_id = e.entregable_id
    JOIN tema t ON ext.tema_id = t.tema_id
    JOIN usuario_tema ut ON t.tema_id = ut.tema_id
    AND ut.creador = TRUE
    JOIN usuario u ON ut.usuario_id = u.usuario_id
    JOIN etapa_formativa_x_ciclo efc ON e.etapa_formativa_x_ciclo_id = efc.etapa_formativa_x_ciclo_id
    JOIN etapa_formativa ef ON efc.etapa_formativa_id = ef.etapa_formativa_id
WHERE
    rd.revision_documento_id = revision_id_input
LIMIT
    1;

END;

$ function $;

DROP FUNCTION IF EXISTS obtener_observaciones_por_entregable_y_tema;

CREATE
OR REPLACE FUNCTION obtener_observaciones_por_entregable_y_tema(
    p_entregable_id INTEGER,
    p_tema_id INTEGER
) RETURNS TABLE (
    observacion_id INTEGER,
    comentario TEXT,
    contenido TEXT,
    numero_pagina_inicio INTEGER,
    numero_pagina_fin INTEGER,
    fecha_creacion TIMESTAMPTZ,
    tipo_observacion_id INTEGER,
    revision_id INTEGER,
    usuario_id INTEGER,
    nombres VARCHAR,
    primer_apellido VARCHAR,
    segundo_apellido VARCHAR,
    roles_usuario TEXT
) AS $ $ BEGIN RETURN QUERY
SELECT
    o.observacion_id,
    o.comentario,
    o.contenido,
    o.numero_pagina_inicio,
    o.numero_pagina_fin,
    o.fecha_creacion,
    o.tipo_observacion_id,
    r.revision_documento_id,
    u.usuario_id,
    u.nombres,
    u.primer_apellido,
    u.segundo_apellido,
    (
        SELECT
            STRING_AGG(CAST(ut.rol_id AS TEXT), ',')
        FROM
            usuario_tema ut
        WHERE
            ut.usuario_id = u.usuario_id
            AND ut.tema_id = p_tema_id
            AND ut.activo = TRUE
    )
FROM
    entregable_x_tema et
    JOIN version_documento vd ON vd.entregable_x_tema_id = et.entregable_x_tema_id
    JOIN revision_documento r ON r.version_documento_id = vd.version_documento_id
    JOIN observacion o ON o.revision_id = r.revision_documento_id
    JOIN usuario u ON u.usuario_id = r.usuario_id
WHERE
    et.entregable_id = p_entregable_id
    AND et.tema_id = p_tema_id
    AND vd.activo = TRUE
    AND r.activo = TRUE
    AND o.activo = TRUE;

END;

$ $ LANGUAGE plpgsql;

-- DROP FUNCTION sgtadb.crear_revisiones(int4);

CREATE OR REPLACE FUNCTION sgtadb.crear_revisiones(entregablextemaid integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$ 
DECLARE 
    version_id INT;
    v_tema_id INT;
    v_link_archivo TEXT;
    user_id INT;
BEGIN 
    -- 1. Obtener el tema_id relacionado
    SELECT ext.tema_id INTO v_tema_id
    FROM entregable_x_tema ext
    WHERE ext.entregable_x_tema_id = entregablextemaid
      AND ext.activo = true;

    IF v_tema_id IS NULL THEN 
        RAISE NOTICE 'No se encontró tema asociado al entregable_x_tema_id=%', entregablextemaid;
        RETURN;
    END IF;

    -- 2. Iterar sobre las versiones del documento asociadas al entregable_x_tema
    -- CAMBIO: Agregado filtro WHERE vd.documento_principal = TRUE
    FOR version_id, v_link_archivo IN
        SELECT vd.version_documento_id, vd.link_archivo_subido
        FROM version_documento vd
        WHERE vd.entregable_x_tema_id = entregablextemaid 
          AND vd.documento_principal = TRUE
    LOOP 
        -- 3. Iterar sobre los usuarios únicos (asesores y coasesores) asignados al tema
        FOR user_id IN
            SELECT DISTINCT ut.usuario_id
            FROM usuario_tema ut
            WHERE ut.tema_id = v_tema_id
              AND ut.rol_id IN (1, 2) -- Asesor y Coasesor
              AND ut.asignado = true 
        LOOP 
            -- 4. Verificar si ya existe una revisión para ese usuario y versión
            IF NOT EXISTS (
                SELECT 1
                FROM revision_documento
                WHERE version_documento_id = version_id
                  AND usuario_id = user_id
            ) THEN 
                -- 5. Insertar revisión
                INSERT INTO revision_documento (
                    version_documento_id,
                    usuario_id,
                    estado_revision,
                    activo,
                    fecha_creacion,
                    fecha_modificacion,
                    fecha_revision,
                    link_archivo_revision
                )
                VALUES (
                    version_id,
                    user_id,
                    'por_aprobar',
                    true,
                    NOW(),
                    NOW(),
                    NOW(),
                    v_link_archivo
                );
            END IF;
        END LOOP;
    END LOOP;
END;
$function$
;

DROP FUNCTION IF EXISTS obtener_detalles_entregable_y_tema;
CREATE OR REPLACE FUNCTION obtener_detalles_entregable_y_tema(
    p_entregable_id INTEGER,
    p_tema_id INTEGER
) RETURNS TABLE (
    entregable_x_tema_id INTEGER,
    nombre_tema VARCHAR,
    nombre_entregable VARCHAR,
    estado enum_estado_revision,
    fecha_envio TIMESTAMPTZ,
    fecha_fin TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ext.entregable_x_tema_id,
        t.titulo AS nombre_tema,
        e.nombre AS nombre_entregable,
        rd.estado_revision AS estado,
        ext.fecha_envio,
        e.fecha_fin
    FROM
        entregable_x_tema ext
    JOIN tema t ON t.tema_id = ext.tema_id
    JOIN entregable e ON e.entregable_id = ext.entregable_id
    LEFT JOIN version_documento vd ON vd.entregable_x_tema_id = ext.entregable_x_tema_id
    LEFT JOIN revision_documento rd ON rd.version_documento_id = vd.version_documento_id
    WHERE
        ext.entregable_id = p_entregable_id
        AND ext.tema_id = p_tema_id;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION obtener_alumnos_por_revision(revision_id INTEGER) RETURNS TABLE (
    usuario_id INTEGER,
    nombres VARCHAR(100),
    primer_apellido VARCHAR(100),
    segundo_apellido VARCHAR(100),
    codigo_pucp VARCHAR(100),
    correo VARCHAR(255)
) LANGUAGE plpgsql AS $ $ BEGIN RETURN QUERY
SELECT
    ut.usuario_id,
    u.nombres,
    u.primer_apellido,
    u.segundo_apellido,
    u.codigo_pucp,
    u.correo_electronico
FROM
    revision_documento rd
    JOIN version_documento vd ON vd.version_documento_id = rd.version_documento_id
    JOIN entregable_x_tema et ON et.entregable_x_tema_id = vd.entregable_x_tema_id
    JOIN tema t ON t.tema_id = et.tema_id
    JOIN usuario_tema ut ON ut.tema_id = t.tema_id
    JOIN usuario u ON u.usuario_id = ut.usuario_id
WHERE
    rd.revision_documento_id = revision_id
    AND ut.rol_id = 4
    AND ut.activo = TRUE
    AND u.activo = TRUE;

END;

$ $;

CREATE
OR REPLACE FUNCTION obtener_observaciones_por_entregable_y_tema(
    p_entregable_id INTEGER,
    p_tema_id INTEGER
) RETURNS TABLE (
    observacion_id INTEGER,
    comentario TEXT,
    contenido TEXT,
    numero_pagina_inicio INTEGER,
    numero_pagina_fin INTEGER,
    fecha_creacion TIMESTAMPTZ,
    tipo_observacion_id INTEGER,
    revision_id INTEGER,
    usuario_id INTEGER,
    nombres VARCHAR,
    primer_apellido VARCHAR,
    segundo_apellido VARCHAR,
    roles_usuario TEXT,
    corregido BOOLEAN
) AS $ $ BEGIN RETURN QUERY
SELECT
    o.observacion_id,
    o.comentario,
    o.contenido,
    o.numero_pagina_inicio,
    o.numero_pagina_fin,
    o.fecha_creacion,
    o.tipo_observacion_id,
    r.revision_documento_id,
    u.usuario_id,
    u.nombres,
    u.primer_apellido,
    u.segundo_apellido,
    (
        SELECT
            STRING_AGG(CAST(ut.rol_id AS TEXT), ',')
        FROM
            usuario_tema ut
        WHERE
            ut.usuario_id = u.usuario_id
            AND ut.tema_id = p_tema_id
            AND ut.activo = TRUE
    ),
    o.corregido
FROM
    entregable_x_tema et
    JOIN version_documento vd ON vd.entregable_x_tema_id = et.entregable_x_tema_id
    JOIN revision_documento r ON r.version_documento_id = vd.version_documento_id
    JOIN observacion o ON o.revision_id = r.revision_documento_id
    JOIN usuario u ON u.usuario_id = r.usuario_id
WHERE
    et.entregable_id = p_entregable_id
    AND et.tema_id = p_tema_id
    AND vd.activo = TRUE
    AND r.activo = TRUE
    AND o.activo = TRUE;

END;

$ $ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS actualizar_corregido_por_estado_revision(INTEGER);
CREATE OR REPLACE FUNCTION actualizar_corregido_por_estado_revision(entregable_x_tema_id_param INTEGER)
RETURNS VOID AS
$$
DECLARE
    -- Variable para contar las revisiones con estado 'revisado'
    revisiones_revisado INTEGER;
    -- Variable para contar el total de revisiones relacionadas
    total_revisiones INTEGER;
BEGIN
    -- Contamos cuántas revisiones tienen el estado 'revisado'
    SELECT COUNT(*)
    INTO revisiones_revisado
    FROM revision_documento rd
    JOIN version_documento vd ON rd.version_documento_id = vd.version_documento_id
    WHERE vd.entregable_x_tema_id = entregable_x_tema_id_param
      AND rd.estado_revision = 'revisado';

    -- Contamos el total de revisiones relacionadas con el entregable_x_tema_id
    SELECT COUNT(*)
    INTO total_revisiones
    FROM revision_documento rd
    JOIN version_documento vd ON rd.version_documento_id = vd.version_documento_id
    WHERE vd.entregable_x_tema_id = entregable_x_tema_id_param;

    -- Si el número de revisiones con estado 'revisado' es igual al total de revisiones
    IF revisiones_revisado = total_revisiones THEN
        -- Actualizamos la columna 'corregido' a 'true' en la tabla entregable_x_tema
        UPDATE entregable_x_tema
        SET corregido = TRUE
        WHERE entregable_x_tema_id = entregable_x_tema_id_param;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION crear_revisiones_jurado(entregablextemaid INTEGER)
RETURNS void LANGUAGE plpgsql AS
$$
DECLARE
    v_tema_id INT;
    v_entregable_id INT;
    version_id INT;
    v_link_archivo TEXT;
    user_id INT;
    exposicion_count INT;
BEGIN
    -- 1. Obtener tema y entregable relacionados
    SELECT ext.tema_id, ext.entregable_id INTO v_tema_id, v_entregable_id
    FROM entregable_x_tema ext
    WHERE ext.entregable_x_tema_id = entregablextemaid
      AND ext.activo = true;

    IF v_tema_id IS NULL OR v_entregable_id IS NULL THEN
        RAISE NOTICE 'No se encontró tema o entregable para entregable_x_tema_id = %', entregablextemaid;
        RETURN;
    END IF;

    -- 2. Verificar que el entregable esté asociado a al menos una exposición
    SELECT COUNT(*) INTO exposicion_count
    FROM exposicion
    WHERE entregable_id = v_entregable_id;

    IF exposicion_count = 0 THEN
        RAISE NOTICE 'El entregable_id % no tiene exposiciones asociadas.', v_entregable_id;
        RETURN;
    END IF;

    -- 3. Iterar sobre versiones del entregable_x_tema
    FOR version_id, v_link_archivo IN
        SELECT vd.version_documento_id, vd.link_archivo_subido
        FROM version_documento vd
        WHERE vd.entregable_x_tema_id = entregablextemaid
    LOOP
        -- 4. Iterar sobre jurados asignados al tema
        FOR user_id IN
            SELECT DISTINCT ut.usuario_id
            FROM usuario_tema ut
            WHERE ut.tema_id = v_tema_id
              AND ut.rol_id = 2  -- Jurado
              AND ut.asignado = true
        LOOP
            -- 5. Verificar si el jurado también es asesor o coasesor
            IF EXISTS (
                SELECT 1
                FROM usuario_tema
                WHERE tema_id = v_tema_id
                  AND usuario_id = user_id
                  AND rol_id IN (1, 5) -- Asesor o Coasesor
                  AND asignado = true
            ) THEN
                CONTINUE; -- Saltar este usuario
            END IF;

            -- 6. Verificar si ya existe una revisión para ese usuario y versión
            IF NOT EXISTS (
                SELECT 1
                FROM revision_documento
                WHERE version_documento_id = version_id
                  AND usuario_id = user_id
            ) THEN
                -- 7. Insertar la revisión
                INSERT INTO revision_documento (
                    version_documento_id,
                    usuario_id,
                    estado_revision,
                    activo,
                    fecha_creacion,
                    fecha_modificacion,
                    fecha_revision,
                    link_archivo_revision
                )
                VALUES (
                    version_id,
                    user_id,
                    'por_aprobar',
                    true,
                    NOW(),
                    NOW(),
                    NOW(),
                    v_link_archivo
                );
            END IF;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION obtener_documentos_jurado(juradoid integer)
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
        rd.fecha_limite_revision::TIMESTAMP WITH TIME ZONE
    FROM usuario_tema ut_jurado
    JOIN tema t ON ut_jurado.tema_id = t.tema_id
    JOIN usuario_tema ut_estudiante 
        ON ut_estudiante.tema_id = t.tema_id 
        AND ut_estudiante.rol_id = 4 -- solo estudiantes
    JOIN usuario u ON u.usuario_id = ut_estudiante.usuario_id
    JOIN entregable_x_tema ext ON ext.tema_id = t.tema_id
    JOIN entregable e ON e.entregable_id = ext.entregable_id
    JOIN etapa_formativa_x_ciclo efc ON e.etapa_formativa_x_ciclo_id = efc.etapa_formativa_x_ciclo_id
    JOIN etapa_formativa ef ON ef.etapa_formativa_id = efc.etapa_formativa_id
    JOIN version_documento vd ON vd.entregable_x_tema_id = ext.entregable_x_tema_id
    LEFT JOIN revision_documento rd ON rd.version_documento_id = vd.version_documento_id
    WHERE ut_jurado.usuario_id = juradoid
      AND ut_jurado.rol_id = 2
      AND vd.activo = TRUE
      AND ext.activo = TRUE
      AND e.activo = TRUE
      AND rd.usuario_id = juradoid;
END;
$$ LANGUAGE plpgsql;


drop function if exists insertar_actualizar_criterio_entregable_id;
CREATE OR REPLACE FUNCTION sgtadb.insertar_actualizar_criterio_entregable_id(p_revision_criterio_entregable_id integer,p_entregable_x_tema_id integer,p_criterio_entregable_id integer, p_revision_documento_id integer,p_usuario_id integer,p_nota numeric,p_observacion text)
returns VOID LANGUAGE plpgsql 
AS $function$
	
BEGIN	
 	IF p_revision_criterio_entregable_id IS NULL THEN
		INSERT INTO revision_criterio_entregable (entregable_x_tema_id,criterio_entregable_id,revision_documento_id,usuario_id,nota,observacion,activo)
		VALUES (p_entregable_x_tema_id,p_criterio_entregable_id, p_revision_documento_id,p_usuario_id ,p_nota,p_observacion, TRUE );
	ELSE
        UPDATE revision_criterio_entregable rce
        SET entregable_x_tema_id = p_entregable_x_tema_id,
            criterio_entregable_id = p_criterio_entregable_id,
            revision_documento_id = p_revision_documento_id,
            usuario_id = p_usuario_id,
            nota = p_nota,
            observacion = p_observacion
        WHERE rce.revision_criterio_entregable_id = p_revision_criterio_entregable_id;
    END IF;

	UPDATE entregable_x_tema ext
	SET nota_entregable = tmp.notaFinal
	FROM (
	    SELECT entregable_x_tema_id, AVG(nota) AS notaFinal
	    FROM (
	        SELECT revision_documento_id, entregable_x_tema_id, SUM(COALESCE(nota, 0)) AS nota
	        FROM revision_criterio_entregable
	        WHERE entregable_x_tema_id = p_entregable_x_tema_id
	        GROUP BY revision_documento_id, entregable_x_tema_id
	    ) sub
	    GROUP BY entregable_x_tema_id
	) tmp
	WHERE ext.entregable_x_tema_id = tmp.entregable_x_tema_id;
END;
$function$
;

--DROP FUNCTION sgtadb.obtener_documentos_revisor(int4);

CREATE OR REPLACE FUNCTION sgtadb.obtener_documentos_revisor(revisorid integer)
 RETURNS TABLE(revision_id integer, tema text, entregable text, estudiante text, codigo text, curso text, fecha_carga timestamp with time zone, estado_revision text, entrega_a_tiempo boolean, fecha_limite timestamp with time zone, similitud double precision, ia double precision)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        rd.revision_documento_id AS revision_id,
        t.titulo::text AS tema,
        e.nombre::text AS entregable,
        (u_est.nombres || ' ' || u_est.primer_apellido || ' ' || COALESCE(u_est.segundo_apellido, ''))::text AS estudiante,
        u_est.codigo_pucp::text AS codigo,
        ef.nombre::text AS curso,
        vd.fecha_ultima_subida,
        rd.estado_revision::text AS estado_revision,
        CASE 
            WHEN rd.fecha_limite_revision IS NOT NULL 
                 AND vd.fecha_ultima_subida::date <= rd.fecha_limite_revision THEN TRUE
            ELSE FALSE
        END AS entrega_a_tiempo,
        rd.fecha_limite_revision::timestamp with time zone,
        vd.porcentaje_similitud,
        vd.porcentaje_ia
    FROM revision_documento rd
    JOIN version_documento vd ON vd.version_documento_id = rd.version_documento_id
    JOIN entregable_x_tema ext ON ext.entregable_x_tema_id = vd.entregable_x_tema_id
    JOIN entregable e ON e.entregable_id = ext.entregable_id
    JOIN tema t ON t.tema_id = ext.tema_id
    JOIN usuario_tema ut_est ON ut_est.tema_id = t.tema_id AND ut_est.rol_id = 4 AND ut_est.asignado = TRUE
    JOIN usuario u_est ON u_est.usuario_id = ut_est.usuario_id
    JOIN etapa_formativa_x_ciclo efc ON e.etapa_formativa_x_ciclo_id = efc.etapa_formativa_x_ciclo_id
    JOIN etapa_formativa ef ON ef.etapa_formativa_id = efc.etapa_formativa_id
    WHERE rd.usuario_id = revisorid
      AND EXISTS (
          SELECT 1
          FROM usuario_tema ut_rev
          WHERE ut_rev.usuario_id = revisorid
            AND ut_rev.rol_id = 3
            AND ut_rev.asignado = TRUE
      )
      AND rd.estado_revision IN ('pendiente', 'en_proceso', 'completada')
      AND rd.activo = TRUE
      AND vd.activo = TRUE
      AND ext.activo = TRUE
      AND e.activo = TRUE
      AND rd.fecha_revision <= NOW()
    ORDER BY rd.fecha_creacion DESC;
END;
$function$
;

-- DROP FUNCTION sgtadb.crear_revisiones_revisores(int4);

CREATE OR REPLACE FUNCTION sgtadb.crear_revisiones_revisores(entregablextemaid integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    version_id INT;
    v_tema_id INT;
    v_link_archivo TEXT;
    user_id INT;
    v_fecha_revision TIMESTAMP;
BEGIN
    -- 1. Obtener el tema_id y fecha_fin (como fecha_revision) del entregable
    SELECT ext.tema_id, e.fecha_fin
    INTO v_tema_id, v_fecha_revision
    FROM entregable_x_tema ext
    JOIN entregable e ON e.entregable_id = ext.entregable_id
    WHERE ext.entregable_x_tema_id = entregablextemaid
      AND ext.activo = TRUE;

    IF v_tema_id IS NULL THEN
        RAISE NOTICE 'No se encontró tema asociado al entregable_x_tema_id=%', entregablextemaid;
        RETURN;
    END IF;

    -- 2. Iterar sobre las versiones del documento asociadas al entregable_x_tema
    -- CAMBIO: Agregado filtro WHERE vd.documento_principal = TRUE
    FOR version_id, v_link_archivo IN
        SELECT vd.version_documento_id, vd.link_archivo_subido
        FROM version_documento vd
        WHERE vd.entregable_x_tema_id = entregablextemaid
          AND vd.documento_principal = TRUE
    LOOP
        -- 3. Iterar sobre los revisores asignados al tema (rol_id = 3)
        FOR user_id IN
            SELECT DISTINCT ut.usuario_id
            FROM usuario_tema ut
            WHERE ut.tema_id = v_tema_id
              AND ut.rol_id = 3
              AND ut.asignado = TRUE
        LOOP
            -- 4. Verificar si ya existe una revisión para ese usuario y versión
            IF NOT EXISTS (
                SELECT 1
                FROM revision_documento
                WHERE version_documento_id = version_id
                  AND usuario_id = user_id
            ) THEN
                -- 5. Insertar revisión con estado 'pendiente' y fecha_revision = fecha_fin del entregable
                INSERT INTO revision_documento (
                    version_documento_id,
                    usuario_id,
                    estado_revision,
                    activo,
                    fecha_creacion,
                    fecha_modificacion,
                    fecha_revision,
                    link_archivo_revision
                )
                VALUES (
                    version_id,
                    user_id,
                    'pendiente',
                    TRUE,
                    NOW(),
                    NOW(),
                    v_fecha_revision,
                    v_link_archivo
                );
            END IF;
        END LOOP;
    END LOOP;
END;
$function$
;

DROP FUNCTION IF EXISTS listar_revision_criterio_por_entregable_x_tema;

CREATE OR REPLACE FUNCTION sgtadb.listar_revision_criterio_por_entregable_x_tema(
    p_entregable_x_tema_id integer
)
RETURNS TABLE (
    entregable_x_tema_id integer,
    criterio_entregable_id integer,
    usuario_id integer,
    nombre_completo_usuario text,
    revision_documento_id integer,
    nota numeric,
    observacion text,
    entregable_id integer,
    nombre_criterio text,
    nota_maxima numeric,
    descripcion_criterio text
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        rce.entregable_x_tema_id,
        rce.criterio_entregable_id,
        rce.usuario_id,
        CONCAT(u.nombres, ' ', u.primer_apellido, ' ', u.segundo_apellido)::text AS nombre_completo_usuario,
        rce.revision_documento_id,
        rce.nota,
        rce.observacion,
        ce.entregable_id,
        ce.nombre::text AS nombre_criterio,
        ce.nota_maxima,
        ce.descripcion::text AS descripcion_criterio
    FROM
        revision_criterio_entregable rce
    INNER JOIN usuario u ON rce.usuario_id = u.usuario_id
    INNER JOIN criterio_entregable ce ON rce.criterio_entregable_id = ce.criterio_entregable_id
    WHERE
        rce.entregable_x_tema_id = p_entregable_x_tema_id
        AND rce.activo = true
        AND ce.activo = true
        AND u.usuario_id IS NOT NULL
    ORDER BY
        ce.criterio_entregable_id;
END;
$$;
DROP FUNCTION IF EXISTS asignar_revision_jurado;
CREATE OR REPLACE FUNCTION asignar_revision_jurado(tema_id_in INTEGER, usuario_id_in INTEGER)
RETURNS VOID AS
$$
DECLARE
    entregable RECORD;
    version RECORD;
    estado_previo enum_estado_revision;
    fecha_revision_previa TIMESTAMP;
BEGIN
    FOR entregable IN
        SELECT ext.entregable_x_tema_id, ext.entregable_id
        FROM entregable_x_tema ext
        WHERE ext.tema_id = tema_id_in
          AND ext.activo = true
          AND EXISTS (
              SELECT 1 FROM exposicion e
              WHERE e.entregable_id = ext.entregable_id
                AND e.activo = true
          )
    LOOP
        -- Buscar la versión activa que sea documento principal
        SELECT vd.version_documento_id, vd.link_archivo_subido
        INTO version
        FROM version_documento vd
        WHERE vd.entregable_x_tema_id = entregable.entregable_x_tema_id
          AND vd.activo = true
          AND vd.documento_principal = true
        LIMIT 1;

        -- Si no hay versión activa principal, pasar al siguiente entregable
        IF version.version_documento_id IS NULL THEN
            CONTINUE;
        END IF;

        -- Verificar si ya existe una revisión activa para este usuario y versión
        IF NOT EXISTS (
            SELECT 1 FROM revision_documento rd
            WHERE rd.usuario_id = usuario_id_in
              AND rd.version_documento_id = version.version_documento_id
              AND rd.activo = true
        ) THEN
            -- Obtener estado y fecha_revision de alguna revisión previa activa
            SELECT estado_revision, fecha_revision INTO estado_previo, fecha_revision_previa
            FROM revision_documento
            WHERE version_documento_id = version.version_documento_id
              AND estado_revision IN ('por_aprobar'::enum_estado_revision, 'aprobado'::enum_estado_revision)
              AND activo = true
            LIMIT 1;

            -- Insertar la nueva revisión
            INSERT INTO revision_documento (
                usuario_id,
                version_documento_id,
                fecha_revision,
                estado_revision,
                link_archivo_revision,
                activo,
                fecha_creacion,
                fecha_modificacion
            ) VALUES (
                usuario_id_in,
                version.version_documento_id,
                COALESCE(fecha_revision_previa, NOW()),
                COALESCE(estado_previo, 'por_aprobar'::enum_estado_revision),
                version.link_archivo_subido,
                true,
                NOW(),
                NOW()
            );
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;