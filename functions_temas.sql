CREATE OR REPLACE FUNCTION sgta.enlazar_tesistas_tema_propuesta_directa(
	p_usuarios_id integer[],
	p_tema_id integer,
	p_profesor_id integer,
	p_comentario text)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    i INT;
    tesista_rol_id INT;
    estado_preinscrito_id INT;
BEGIN
    -- Obtener el rol_id del tesista
    SELECT rol_id INTO tesista_rol_id FROM rol WHERE nombre ILIKE 'Tesista' LIMIT 1;

    -- Obtener el estado ID del tema
    SELECT estado_tema_id INTO estado_preinscrito_id FROM estado_tema WHERE nombre ILIKE 'PREINSCRITO' LIMIT 1;

    -- Asignar a cada tesista
    FOR i IN 1 .. array_length(p_usuarios_id, 1) LOOP
        UPDATE usuario_tema 
        SET asignado = true, rol_id = tesista_rol_id,
		 comentario = p_comentario
        WHERE usuario_id = p_usuarios_id[i] AND tema_id = p_tema_id;
    END LOOP;

    -- Asignar al profesor
    UPDATE usuario_tema 
    SET asignado = true 
    WHERE usuario_id = p_profesor_id AND tema_id = p_tema_id;

    -- Actualizar el estado del tema
    UPDATE tema 
    SET estado_tema_id = estado_preinscrito_id
    WHERE tema_id = p_tema_id;
END;
$BODY$;



CREATE OR REPLACE FUNCTION sgta.listar_areas_conocimiento_por_usuario(
	p_usuario_id integer)
    RETURNS TABLE(area_id integer, area_nombre text, descripcion text) 
    LANGUAGE 'sql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
    SELECT DISTINCT  ac.area_conocimiento_id,ac.nombre,ac.descripcion
    FROM usuario_sub_area_conocimiento usac
    JOIN sub_area_conocimiento sac ON usac.sub_area_conocimiento_id = sac.sub_area_conocimiento_id
    JOIN area_conocimiento ac ON sac.area_conocimiento_id = ac.area_conocimiento_id
    WHERE usac.usuario_id = p_usuario_id;
$BODY$;

CREATE OR REPLACE FUNCTION sgta.listar_temas_propuestos_al_asesor(
	p_asesor_id integer)
    RETURNS TABLE(tema_id integer, titulo text, subareas text, subarea_ids integer[], alumno text, usuario_id_alumno integer[], descripcion text, metodologia text, objetivo text, recurso text, activo boolean, fecha_limite timestamp with time zone, fecha_creacion timestamp with time zone, fecha_modificacion timestamp with time zone) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT 
        t.tema_id,
        t.titulo::TEXT,
        string_agg(DISTINCT sac.nombre, ', ') AS subareas,
        array_agg(DISTINCT sac.sub_area_conocimiento_id) AS subarea_ids,
        (u_alumno.nombres || ' ' || u_alumno.primer_apellido) AS alumno,
        array_agg(DISTINCT u_alumno.usuario_id) AS usuario_id_alumno,
        t.resumen::TEXT,
        t.metodologia::TEXT,
        t.objetivos::TEXT,
        r.documento_url::TEXT,
        t.activo,
        t.fecha_limite,
        t.fecha_creacion,
        t.fecha_modificacion
    FROM tema t
    INNER JOIN usuario_tema ut_asesor 
        ON ut_asesor.tema_id = t.tema_id 
        AND ut_asesor.rol_id = (
            SELECT rol_id FROM rol WHERE nombre ILIKE 'Asesor' LIMIT 1
        )
        AND ut_asesor.usuario_id = p_asesor_id
        AND ut_asesor.asignado = false
    INNER JOIN usuario u_asesor 
        ON u_asesor.usuario_id = ut_asesor.usuario_id
    INNER JOIN usuario_tema ut_alumno 
        ON ut_alumno.tema_id = t.tema_id 
        AND ut_alumno.rol_id = (
            SELECT rol_id FROM rol WHERE nombre ILIKE 'Creador' LIMIT 1
        )
    INNER JOIN usuario u_alumno 
        ON u_alumno.usuario_id = ut_alumno.usuario_id
    LEFT JOIN estado_tema et 
        ON t.estado_tema_id = et.estado_tema_id
    LEFT JOIN sub_area_conocimiento_tema sact 
        ON sact.tema_id = t.tema_id
    LEFT JOIN sub_area_conocimiento sac 
        ON sac.sub_area_conocimiento_id = sact.sub_area_conocimiento_id
    LEFT JOIN recurso r 
        ON r.tema_id = t.tema_id AND r.activo = true
    WHERE 
        t.activo = true
        AND et.estado_tema_id = (
            SELECT estado_tema_id 
            FROM estado_tema 
            WHERE nombre ILIKE 'PROPUESTO_DIRECTO'
            LIMIT 1
        )
    GROUP BY 
        t.tema_id, t.titulo, t.resumen, t.metodologia, t.objetivos, 
        u_alumno.nombres, u_alumno.primer_apellido, r.documento_url;
END;
$BODY$;


CREATE OR REPLACE FUNCTION sgta.listar_temas_propuestos_por_subarea_conocimiento(
	p_subareas_ids integer[])
    RETURNS TABLE(tema_id integer, titulo text, subareas_id integer[], alumnos_id integer[], descripcion text, metodologia text, objetivo text, recurso text, activo boolean, fecha_limite timestamp with time zone, fecha_creacion timestamp with time zone, fecha_modificacion timestamp with time zone) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT 
        t.tema_id,
        t.titulo::text, 
        ARRAY(
            SELECT DISTINCT sact2.sub_area_conocimiento_id
            FROM sub_area_conocimiento_tema sact2
            WHERE sact2.tema_id = t.tema_id
        ) AS subareas_id,
        ARRAY( 
            SELECT ut2.usuario_id
            FROM usuario_tema ut2
            WHERE ut2.tema_id = t.tema_id AND ut2.rol_id = (
            	SELECT rol_id FROM rol WHERE nombre ILIKE 'Creador' LIMIT 1
        	)
        ) AS alumnos_id,
        t.resumen::text,
        t.metodologia::text,
        t.objetivos::text,
        r.documento_url::text,
        t.activo,
        t.fecha_limite,
        t.fecha_creacion,
        t.fecha_modificacion
    FROM tema t
    LEFT JOIN estado_tema et ON t.estado_tema_id = et.estado_tema_id
    LEFT JOIN sub_area_conocimiento_tema sact ON sact.tema_id = t.tema_id
    LEFT JOIN recurso r ON r.tema_id = t.tema_id AND r.activo = true
    WHERE 
        t.activo = true
        AND et.estado_tema_id = (
            SELECT estado_tema_id 
            FROM estado_tema 
            WHERE nombre ILIKE 'PROPUESTO_GENERAL'
            LIMIT 1
        )
        AND sact.sub_area_conocimiento_id = ANY(p_subareas_ids)
    GROUP BY 
        t.tema_id, t.titulo, t.resumen, t.metodologia, t.objetivos, 
        r.documento_url, t.activo, t.fecha_limite, t.fecha_creacion, t.fecha_modificacion;
END;
$BODY$;


CREATE OR REPLACE FUNCTION sgta.postular_asesor_a_tema(
	p_alumno_id integer,
	p_asesor_id integer,
	p_tema_id integer,
	p_comentario text)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    INSERT INTO usuario_tema (
        usuario_id,
        tema_id,
        rol_id,
        asignado,
        activo,
        fecha_creacion,
        fecha_modificacion
    )
    VALUES (
        p_asesor_id,
        p_tema_id,
        (SELECT rol_id FROM rol WHERE nombre ILIKE 'Asesor' LIMIT 1),
        false,
        true,
        now(),
        now()
    );

	update usuario_tema 
	set comentario = p_comentario, fecha_modificacion = NOW() 
	where usuario_id = p_alumno_id and tema_id = p_tema_id;
END;
$BODY$;

