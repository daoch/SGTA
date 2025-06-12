--DROP FUNCTION obtener_documentos_asesor(int4);
CREATE
OR REPLACE FUNCTION sgtadb.obtener_documentos_asesor(asesorid integer) RETURNS TABLE(
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
OR REPLACE FUNCTION sgtadb.obtener_revision_documento_por_id(revision_id_input integer) RETURNS TABLE(
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
OR REPLACE FUNCTION sgtadb.crear_revisiones(entregableXTemaId integer) RETURNS void LANGUAGE plpgsql AS $ $ DECLARE version_id INT;

asesor_id INT;

v_tema_id INT;

v_link_archivo TEXT;

BEGIN -- 1. Obtener el tema_id relacionado
SELECT
    ext.tema_id INTO v_tema_id
FROM
    entregable_x_tema ext
WHERE
    ext.entregable_x_tema_id = entregableXTemaId
    AND ext.activo = true;

IF v_tema_id IS NULL THEN RAISE NOTICE 'No se encontró tema asociado al entregable_x_tema_id=%',
entregableXTemaId;

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
    vd.entregable_x_tema_id = entregableXTemaId LOOP -- 3. Iterar sobre los asesores asignados al tema
    FOR asesor_id IN
SELECT
    ut.usuario_id
FROM
    usuario_tema ut
WHERE
    ut.tema_id = v_tema_id
    AND ut.rol_id = 1 -- Asesor
    AND ut.asignado = true LOOP -- 4. Insertar revisión
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
        asesor_id,
        'por_aprobar',
        true,
        NOW(),
        NOW(),
        NOW(),
        v_link_archivo
    );

END LOOP;

END LOOP;

END;

$ $;

;

CREATE
OR REPLACE FUNCTION obtener_detalles_entregable_y_tema(
    p_entregable_id INTEGER,
    p_tema_id INTEGER
) RETURNS TABLE (
    nombre_tema VARCHAR,
    nombre_entregable VARCHAR,
    estado enum_estado_entrega,
    fecha_envio TIMESTAMPTZ,
    fecha_fin TIMESTAMPTZ
) AS $ $ BEGIN RETURN QUERY
SELECT
    t.titulo AS nombre_tema,
    e.nombre AS nombre_entregable,
    ext.estado,
    ext.fecha_envio,
    e.fecha_fin
FROM
    entregable_x_tema ext
    JOIN tema t ON t.tema_id = ext.tema_id
    JOIN entregable e ON e.entregable_id = ext.entregable_id
WHERE
    ext.entregable_id = p_entregable_id
    AND ext.tema_id = p_tema_id;

END;

$ $ LANGUAGE plpgsql;

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

CREATE OR REPLACE FUNCTION obtener_observaciones_por_entregable_y_tema(
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
    revision_id INTEGER,
    usuario_id INTEGER,
    nombres VARCHAR,
    primer_apellido VARCHAR,
    segundo_apellido VARCHAR,
    roles_usuario TEXT,
    corregido BOOLEAN
) AS
$$
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
        r.revision_documento_id,
        u.usuario_id,
        u.nombres,
        u.primer_apellido,
        u.segundo_apellido,
        (
            SELECT STRING_AGG(CAST(ut.rol_id AS TEXT), ',')
            FROM usuario_tema ut
            WHERE ut.usuario_id = u.usuario_id
              AND ut.tema_id = p_tema_id
              AND ut.activo = TRUE
        ),
        o.corregido
    FROM entregable_x_tema et
    JOIN version_documento vd ON vd.entregable_x_tema_id = et.entregable_x_tema_id
    JOIN revision_documento r ON r.version_documento_id = vd.version_documento_id
    JOIN observacion o ON o.revision_id = r.revision_documento_id
    JOIN usuario u ON u.usuario_id = r.usuario_id
    WHERE et.entregable_id = p_entregable_id
      AND et.tema_id = p_tema_id
      AND vd.activo = TRUE
      AND r.activo = TRUE
      AND o.activo = TRUE;
END;
$$ LANGUAGE plpgsql;
