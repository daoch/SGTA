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

CREATE
OR REPLACE FUNCTION crear_revisiones(entregablextemaid integer) RETURNS void LANGUAGE plpgsql AS $ function $ DECLARE version_id INT;

v_tema_id INT;

v_link_archivo TEXT;

user_id INT;

BEGIN -- 1. Obtener el tema_id relacionado
SELECT
    ext.tema_id INTO v_tema_id
FROM
    entregable_x_tema ext
WHERE
    ext.entregable_x_tema_id = entregablextemaid
    AND ext.activo = true;

IF v_tema_id IS NULL THEN RAISE NOTICE 'No se encontró tema asociado al entregable_x_tema_id=%',
entregablextemaid;

RETURN;

END IF;

-- 2. Iterar sobre las versiones del documento asociadas al entregable_x_tema
FOR version_id,
v_link_archivo IN
SELECT
    vd.version_documento_id,
    vd.link_archivo_subido
FROM
    version_documento vd
WHERE
    vd.entregable_x_tema_id = entregablextemaid LOOP -- 3. Iterar sobre los usuarios únicos (asesores y coasesores) asignados al tema
    FOR user_id IN
SELECT
    DISTINCT ut.usuario_id
FROM
    usuario_tema ut
WHERE
    ut.tema_id = v_tema_id
    AND ut.rol_id IN (1, 2) -- Asesor y Coasesor
    AND ut.asignado = true LOOP -- 4. Verificar si ya existe una revisión para ese usuario y versión
    IF NOT EXISTS (
        SELECT
            1
        FROM
            revision_documento
        WHERE
            version_documento_id = version_id
            AND usuario_id = user_id
    ) THEN -- 5. Insertar revisión
INSERT INTO
    revision_documento (
        version_documento_id,
        usuario_id,
        estado_revision,
        activo,
        fecha_creacion,
        fecha_modificacion,
        fecha_revision,
        link_archivo_revision
    )
VALUES
    (
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

$ function $;

DROP FUNCTION IF EXISTS obtener_detalles_entregable_y_tema;
CREATE OR REPLACE FUNCTION obtener_detalles_entregable_y_tema(
    p_entregable_id INTEGER,
    p_tema_id INTEGER
) RETURNS TABLE (
    nombre_tema VARCHAR,
    nombre_entregable VARCHAR,
    estado enum_estado_revision,
    fecha_envio TIMESTAMPTZ,
    fecha_fin TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.titulo AS nombre_tema,
        e.nombre AS nombre_entregable,
        rd.estado_revision AS estado,  -- Obtener el estado desde revision_documento
        ext.fecha_envio,
        e.fecha_fin
    FROM
        entregable_x_tema ext
    JOIN tema t ON t.tema_id = ext.tema_id
    JOIN entregable e ON e.entregable_id = ext.entregable_id
    LEFT JOIN version_documento vd ON vd.entregable_x_tema_id = ext.entregable_x_tema_id  -- Corrección aquí
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


CREATE OR REPLACE FUNCTION sgtadb.crear_revisiones_revisores(entregablextemaid INTEGER)
RETURNS VOID
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
    FOR version_id, v_link_archivo IN
        SELECT vd.version_documento_id, vd.link_archivo_subido
        FROM version_documento vd
        WHERE vd.entregable_x_tema_id = entregablextemaid
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
$function$;

CREATE OR REPLACE FUNCTION sgtadb.obtener_documentos_revisor(revisorid integer)
 RETURNS TABLE(
    revision_id integer,
    estudiante_id integer,
    estudiante_nombres varchar,
    estudiante_apellidos varchar,
    estudiante_codigo varchar,
    revisor_id integer,
    revisor_nombres varchar,
    revisor_apellidos varchar,
    revisor_codigo varchar,
    tema_id integer,
    titulo_tema varchar,
    documento_id integer,
    nombre_documento varchar,
    version_documento_id integer,
    fecha_entrega timestamp with time zone,
    fecha_limite_revision timestamp with time zone,
    fecha_revision timestamp with time zone,
    estado_revision varchar,
    link_archivo_revision varchar,
    fecha_envio_entregable timestamp with time zone,
    fecha_fin_entregable timestamp with time zone,
    etapa_formativa_id integer,
    nombre_curso varchar,
    numero_observaciones integer
)
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        rd.revision_documento_id,
        u_estudiante.usuario_id AS estudiante_id,
        u_estudiante.nombres,
        u_estudiante.primer_apellido,
        u_estudiante.codigo_pucp,
        u_revisor.usuario_id AS revisor_id,
        u_revisor.nombres,
        u_revisor.primer_apellido,
        u_revisor.codigo_pucp,
        t.tema_id,
        t.titulo,
        d.documento_id,
        d.nombre_documento,
        vd.version_documento_id,
        vd.fecha_ultima_subida,
        rd.fecha_limite_revision::timestamp with time zone,
        rd.fecha_revision::timestamp with time zone,
        rd.estado_revision::text,
        rd.link_archivo_revision,
        ext.fecha_envio,
        e.fecha_fin,
        ef.etapa_formativa_id,
        ef.nombre,
        (
            SELECT COUNT(*) 
            FROM observacion o 
            WHERE o.revision_id = rd.revision_documento_id 
              AND o.activo = TRUE
        ) AS numero_observaciones
    FROM revision_documento rd
    JOIN version_documento vd ON vd.version_documento_id = rd.version_documento_id
    JOIN entregable_x_tema ext ON ext.entregable_x_tema_id = vd.entregable_x_tema_id
    JOIN entregable e ON e.entregable_id = ext.entregable_id
    JOIN tema t ON t.tema_id = ext.tema_id
    JOIN usuario_tema ut_estudiante ON ut_estudiante.tema_id = t.tema_id AND ut_estudiante.rol_id = 4 AND ut_estudiante.asignado = TRUE
    JOIN usuario u_estudiante ON u_estudiante.usuario_id = ut_estudiante.usuario_id
    JOIN usuario u_revisor ON u_revisor.usuario_id = rd.usuario_id
    JOIN documento d ON d.documento_id = vd.documento_id
    JOIN etapa_formativa_x_ciclo efc ON efc.etapa_formativa_x_ciclo_id = e.etapa_formativa_x_ciclo_id
    JOIN etapa_formativa ef ON ef.etapa_formativa_id = efc.etapa_formativa_id
    WHERE rd.usuario_id = revisorid
      AND rd.activo = TRUE
      AND rd.fecha_revision <= NOW()
    ORDER BY rd.fecha_creacion DESC;
END;
$function$;

