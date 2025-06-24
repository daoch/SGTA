SET search_path = sgtadb

DROP FUNCTION IF EXISTS listar_etapas_formativas_alumno;
DROP FUNCTION IF EXISTS obtener_entregables_alumno;
DROP FUNCTION IF EXISTS listar_documentos_x_entregable;
DROP FUNCTION IF EXISTS entregar_entregable;
DROP FUNCTION IF EXISTS listar_criterio_entregable_x_revisionID;

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
    comentario TEXT,
	entregable_x_tema_id INTEGER
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
        et.comentario,
		et.entregable_x_tema_id
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
    WHERE v.entregable_x_tema_id = p_entregable_x_tema_id AND v.activo = TRUE AND d.activo = TRUE;
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
        fecha_envio = CURRENT_TIMESTAMP,
        comentario = p_comentario,
        estado = p_estado::enum_estado_entrega,
        fecha_modificacion = CURRENT_TIMESTAMP
    WHERE entregable_x_tema_id = p_entregable_x_tema_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_temas_por_asociar_por_carrera(
  p_carrera_id    INTEGER
)
RETURNS TABLE (
  tema_id            INTEGER,
  codigo             TEXT,
  titulo             TEXT,
  estado_nombre      TEXT,
  carrera_id         INT,
  carrera_nombre     TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
    SELECT
      t.tema_id,
      t.codigo::text,
      t.titulo::text,
      et.nombre::text       AS estado_nombre,
      c.carrera_id,
      c.nombre::text        AS carrera_nombre
    FROM tema t
      JOIN estado_tema et
        ON t.estado_tema_id = et.estado_tema_id
      JOIN carrera c
        ON t.carrera_id = c.carrera_id
    WHERE
      t.carrera_id = p_carrera_id
      AND et.nombre IN ('REGISTRADO', 'EN_PROGRESO', 'PAUSADO')
      AND t.activo = TRUE
    ORDER BY t.fecha_creacion DESC;
END;
$$;

CREATE OR REPLACE FUNCTION listar_etapas_formativas_x_ciclo_x_carrera(
  p_carrera_id INTEGER
)
RETURNS TABLE (
  etapa_formativa_x_ciclo_id INTEGER,
  etapa_formativa_id INTEGER,
  etapa_formativa_nombre TEXT,
  ciclo_id INTEGER,
  ciclo_nombre VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
    SELECT
      efc.etapa_formativa_x_ciclo_id,
      ef.etapa_formativa_id,
      ef.nombre AS etapa_formativa_nombre,
      c.ciclo_id,
      c.nombre AS ciclo_nombre
    FROM etapa_formativa_x_ciclo efc
    INNER JOIN etapa_formativa ef ON efc.etapa_formativa_id = ef.etapa_formativa_id
    INNER JOIN ciclo c ON efc.ciclo_id = c.ciclo_id
    WHERE ef.carrera_id = p_carrera_id AND efc.activo = true AND ef.activo = true AND c.activo = true
    ORDER BY c.anio DESC, c.semestre DESC, ef.nombre;
END;
$$;

CREATE OR REPLACE FUNCTION asociar_tema_a_curso(
    p_curso_id INTEGER, -- etapa_formativa_x_ciclo_id
    p_tema_id INTEGER   -- tema_id
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_entregable RECORD;
    v_exposicion RECORD;
    v_etapa_formativa_x_ciclo_x_tema_id INTEGER;
    v_estado_en_progreso_id INTEGER;
    v_exposicion_x_tema_id INTEGER;
    v_criterio RECORD;
    v_asesor_id INTEGER;
    v_jurado RECORD;
    v_revisor RECORD;
BEGIN
    -- 0. Obtener el id del estado 'EN_PROGRESO'
    SELECT estado_tema_id INTO v_estado_en_progreso_id
    FROM estado_tema
    WHERE UPPER(nombre) = 'EN_PROGRESO'
    LIMIT 1;

    -- 1. Insertar en etapa_formativa_x_ciclo_x_tema
    INSERT INTO etapa_formativa_x_ciclo_x_tema (etapa_formativa_x_ciclo_id, tema_id, aprobado)
    VALUES (p_curso_id, p_tema_id, TRUE)
    RETURNING etapa_formativa_x_ciclo_x_tema_id INTO v_etapa_formativa_x_ciclo_x_tema_id;

    -- 2. Buscar entregables activos para el curso dado
    FOR v_entregable IN
        SELECT entregable_id
        FROM entregable
        WHERE etapa_formativa_x_ciclo_id = p_curso_id
          AND activo = TRUE
    LOOP
        -- 3. Insertar en entregable_x_tema
        INSERT INTO entregable_x_tema (entregable_id, tema_id, activo)
        VALUES (v_entregable.entregable_id, p_tema_id, TRUE);
    END LOOP;

    -- 4. Buscar exposiciones activas para el curso
    FOR v_exposicion IN
        SELECT exposicion_id
        FROM exposicion
        WHERE etapa_formativa_x_ciclo_id = p_curso_id
          AND activo = TRUE
    LOOP
        -- 5. Insertar en exposicion_x_tema
        INSERT INTO exposicion_x_tema (exposicion_id, tema_id, activo)
        VALUES (v_exposicion.exposicion_id, p_tema_id, TRUE)
        RETURNING exposicion_x_tema_id INTO v_exposicion_x_tema_id;

        -- 6. Obtener el primer usuario asesor asignado y activo para el tema
        SELECT ut.usuario_id INTO v_asesor_id
        FROM usuario_tema ut
        JOIN rol r ON ut.rol_id = r.rol_id
        WHERE ut.tema_id = p_tema_id
          AND r.nombre = 'Asesor'
          AND ut.asignado = TRUE
          AND ut.activo = TRUE
        LIMIT 1;

        -- 7. Por cada criterio de la exposición, insertar en revision_criterio_x_exposicion solo si hay asesor
        IF v_asesor_id IS NOT NULL THEN
            FOR v_criterio IN
                SELECT criterio_exposicion_id
                FROM criterio_exposicion
                WHERE exposicion_id = v_exposicion.exposicion_id
            LOOP
                INSERT INTO revision_criterio_x_exposicion (
                    exposicion_x_tema_id,
                    criterio_exposicion_id,
                    usuario_id
                ) VALUES (
                    v_exposicion_x_tema_id,
                    v_criterio.criterio_exposicion_id,
                    v_asesor_id
                );
            END LOOP;
        END IF;

        -- 8. Insertar en revision_criterio_x_exposicion para cada jurado
        FOR v_jurado IN
            SELECT ut.usuario_id
            FROM usuario_tema ut
            JOIN rol r ON ut.rol_id = r.rol_id
            WHERE ut.tema_id = p_tema_id
              AND r.nombre = 'Jurado'
              AND ut.activo = TRUE
        LOOP
            FOR v_criterio IN
                SELECT criterio_exposicion_id
                FROM criterio_exposicion
                WHERE exposicion_id = v_exposicion.exposicion_id
            LOOP
                INSERT INTO revision_criterio_x_exposicion (
                    exposicion_x_tema_id,
                    criterio_exposicion_id,
                    usuario_id
                ) VALUES (
                    v_exposicion_x_tema_id,
                    v_criterio.criterio_exposicion_id,
                    v_jurado.usuario_id
                );
            END LOOP;
        END LOOP;
    END LOOP;

    -- 9. Insertar revisores en usuario_tema
    FOR v_revisor IN
        SELECT ur.usuario_id, ur.rol_id
        FROM etapa_formativa_x_ciclo_x_usuario_rol efc_ur
        JOIN usuario_rol ur ON efc_ur.usuario_rol_id = ur.usuario_rol_id
        WHERE efc_ur.etapa_formativa_x_ciclo_id = p_curso_id
    LOOP
        INSERT INTO usuario_tema (
            usuario_id,
            tema_id,
            rol_id
        ) VALUES (
            v_revisor.usuario_id,
            p_tema_id,
            v_revisor.rol_id
        );
    END LOOP;

    -- 10. Cambiar el estado del tema a EN_PROGRESO
    IF v_estado_en_progreso_id IS NOT NULL THEN
        UPDATE tema
        SET estado_tema_id = v_estado_en_progreso_id
        WHERE tema_id = p_tema_id;
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION borrar_documento(p_documento_id INTEGER)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Desactivar el documento
  UPDATE documento
  SET activo = FALSE
  WHERE documento_id = p_documento_id;

  -- Desactivar todas las versiones asociadas a ese documento
  UPDATE version_documento
  SET activo = FALSE
  WHERE documento_id = p_documento_id;
END;
$$;

CREATE OR REPLACE FUNCTION asignar_revisor(
    p_curso_id INTEGER,
    p_usuario_rol_id INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    existe INTEGER;
BEGIN
    SELECT 1 INTO existe
    FROM etapa_formativa_x_ciclo_x_usuario_rol
    WHERE etapa_formativa_x_ciclo_id = p_curso_id
      AND usuario_rol_id = p_usuario_rol_id;

    IF existe IS NOT NULL THEN
        RAISE EXCEPTION 'Ya existe un revisor con usuario_rol_id=% para el curso etapa_formativa_x_ciclo_id=%', p_usuario_rol_id, p_curso_id;
    END IF;

    INSERT INTO etapa_formativa_x_ciclo_x_usuario_rol (
        etapa_formativa_x_ciclo_id,
        usuario_rol_id
    ) VALUES (
        p_curso_id,
        p_usuario_rol_id
    );
END;
$$;

CREATE OR REPLACE FUNCTION listar_revisores_por_carrera(p_carrera_id INTEGER)
RETURNS TABLE (
    usuario_rol_id INTEGER,
    usuarioId INTEGER,
    codigoPucp VARCHAR,
    nombres VARCHAR,
    primerApellido VARCHAR,
    segundoApellido VARCHAR,
    correoElectronico VARCHAR,
    rolId INTEGER,
    rolNombre VARCHAR,
    carreraId INTEGER,
    carreraNombre VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ur.usuario_rol_id,
        u.usuario_id AS usuarioId,
        u.codigo_pucp AS codigoPucp,
        u.nombres,
        u.primer_apellido AS primerApellido,
        u.segundo_apellido AS segundoApellido,
        u.correo_electronico AS correoElectronico,
        r.rol_id AS rolId,
        r.nombre AS rolNombre,
        c.carrera_id AS carreraId,
        c.nombre AS carreraNombre
    FROM usuario u
    JOIN usuario_rol ur ON ur.usuario_id = u.usuario_id
    JOIN rol r ON r.rol_id = ur.rol_id
    JOIN usuario_carrera uc ON uc.usuario_id = u.usuario_id
    JOIN carrera c ON c.carrera_id = uc.carrera_id
    WHERE r.nombre = 'Revisor'
      AND uc.carrera_id = p_carrera_id
      AND u.activo = TRUE
      AND ur.activo = TRUE
      AND uc.activo = TRUE
      AND c.activo = TRUE;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION sgtadb.listar_criterio_entregable_x_revisionID(revision_entregable_id integer)
 RETURNS TABLE(revision_documento_id integer,usuario_id integer,entregable_x_tema_id integer, entregable_id integer ,descripcion_entregable text, criterio_entregable_id integer, descripcion_criterio text, nombre_criterio text,nota_maxima numeric )
 LANGUAGE plpgsql
AS $function$
declare
	
BEGIN	
	
    RETURN QUERY
 	select 
    	rev.revision_documento_id,
    	rev.usuario_id,
		ext.entregable_x_tema_id as entregable_x_tema_id,
    	e.entregable_id,
    	e.descripcion::text as descripcion_entregable,
    	ce.criterio_entregable_id,
    	ce.descripcion::text as descripcion_criterio,
    	ce.nombre::text as nombre_criterio,
    	ce.nota_maxima
    from revision_documento rev
    inner join version_documento ver
    on rev.version_documento_id = ver.version_documento_id
    inner join entregable_x_tema ext 
    on ext.entregable_x_tema_id = ver.entregable_x_tema_id
    inner join entregable e 
    on e.entregable_id =ext.entregable_id
    inner join criterio_entregable ce 
    on ce.entregable_id =e.entregable_id
    where rev.revision_documento_id =revision_entregable_id
	and rev.activo = true
    and e.activo = true
    and ce.activo =true
	order by ce.fecha_creacion;  
END;
$function$
;