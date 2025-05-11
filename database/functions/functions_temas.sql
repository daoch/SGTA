CREATE OR REPLACE FUNCTION sgta.listar_temas_propuestos_por_subarea_conocimiento(
	p_subareas_ids integer[],
	p_asesor_id integer,
	p_titulo text DEFAULT ''::text,
	p_limit integer DEFAULT 10,
	p_offset integer DEFAULT 0)
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
                SELECT rol_id FROM rol WHERE nombre ILIKE 'Tesista' LIMIT 1
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
        AND NOT EXISTS (
            SELECT 1
            FROM usuario_tema ut
            WHERE ut.tema_id = t.tema_id
              AND ut.usuario_id = p_asesor_id
        )
        AND (
            p_titulo IS NULL OR p_titulo = ''
            OR t.titulo ILIKE '%' || p_titulo || '%'
        )
    GROUP BY
        t.tema_id, t.titulo, t.resumen, t.metodologia, t.objetivos, 
        r.documento_url, t.activo, t.fecha_limite, t.fecha_creacion, t.fecha_modificacion
    ORDER BY t.fecha_creacion DESC
    LIMIT p_limit OFFSET p_offset;  
END;
$BODY$;



CREATE OR REPLACE FUNCTION listar_temas_propuestos_al_asesor(
	p_asesor_id integer,
	p_titulo text DEFAULT NULL::text,
	p_limit integer DEFAULT 10,
	p_offset integer DEFAULT 0)
RETURNS TABLE(
	tema_id integer,
	titulo text,
	subareas text,
	subarea_ids integer[],
	alumno text,
	usuario_id_alumno integer[],
	descripcion text,
	metodologia text,
	objetivo text,
	recurso text,
	activo boolean,
	fecha_limite timestamp with time zone,
	fecha_creacion timestamp with time zone,
	fecha_modificacion timestamp with time zone,
	id_creador integer,
	nombre_creador text,
	ids_cotesistas integer[],
	nombres_cotesistas text[]
) 
LANGUAGE 'plpgsql'
COST 100
VOLATILE PARALLEL UNSAFE
ROWS 1000
AS $BODY$
BEGIN
	RETURN QUERY
	WITH temas_filtrados AS (
		SELECT 
			t.tema_id,
			t.titulo::text,
			t.resumen::text,
			t.metodologia::text,
			t.objetivos::text,
			t.activo,
			t.fecha_limite,
			t.fecha_creacion,
			t.fecha_modificacion,
			(u_alumno.nombres || ' ' || u_alumno.primer_apellido) AS alumno,
			u_alumno.usuario_id AS usuario_id_alumno,
			r.documento_url::text,
			t.tema_id AS id_unico
		FROM tema t
		INNER JOIN usuario_tema ut_asesor 
			ON ut_asesor.tema_id = t.tema_id 
			AND ut_asesor.rol_id = (
				SELECT rol_id FROM rol WHERE nombre ILIKE 'Asesor' LIMIT 1
			)
			AND ut_asesor.usuario_id = p_asesor_id
			AND ut_asesor.asignado = false
		INNER JOIN usuario_tema ut_alumno 
			ON ut_alumno.tema_id = t.tema_id 
			AND ut_alumno.rol_id = (
				SELECT rol_id FROM rol WHERE nombre ILIKE 'Tesista' LIMIT 1
			)
			AND ut_alumno.creador = true
		INNER JOIN usuario u_alumno 
			ON u_alumno.usuario_id = ut_alumno.usuario_id
		LEFT JOIN estado_tema et 
			ON t.estado_tema_id = et.estado_tema_id
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
			AND (p_titulo IS NULL OR p_titulo = '' OR t.titulo ILIKE '%' || p_titulo || '%')
		ORDER BY t.fecha_creacion DESC
		LIMIT p_limit OFFSET p_offset
	)
	SELECT 
		tf.tema_id,
		tf.titulo,
		string_agg(DISTINCT sac.nombre, ', ') AS subareas,
		array_agg(DISTINCT sac.sub_area_conocimiento_id) AS subarea_ids,
		tf.alumno,
		array_agg(DISTINCT tf.usuario_id_alumno) AS usuario_id_alumno,
		tf.resumen,
		tf.metodologia,
		tf.objetivos,
		tf.documento_url,
		tf.activo,
		tf.fecha_limite,
		tf.fecha_creacion,
		tf.fecha_modificacion,

		-- ID del creador
		(
			SELECT ut.usuario_id
			FROM usuario_tema ut
			WHERE ut.tema_id = tf.tema_id
				AND ut.creador = true
				AND ut.rol_id = (SELECT rol_id FROM rol WHERE nombre ILIKE 'Tesista' LIMIT 1)
			LIMIT 1
		) AS id_creador,

		-- Nombre del creador
		(
			SELECT u.nombres || ' ' || u.primer_apellido
			FROM usuario_tema ut
			JOIN usuario u ON u.usuario_id = ut.usuario_id
			WHERE ut.tema_id = tf.tema_id
				AND ut.creador = true
				AND ut.rol_id = (SELECT rol_id FROM rol WHERE nombre ILIKE 'Tesista' LIMIT 1)
			LIMIT 1
		) AS nombre_creador,

		-- IDs de cotesistas
		(
			SELECT array_agg(ut.usuario_id)
			FROM usuario_tema ut
			WHERE ut.tema_id = tf.tema_id
				AND ut.creador = false
				AND ut.rol_id = (SELECT rol_id FROM rol WHERE nombre ILIKE 'Tesista' LIMIT 1)
		) AS ids_cotesistas,

		-- Nombres de cotesistas
		(
			SELECT array_agg(u.nombres || ' ' || u.primer_apellido)
			FROM usuario_tema ut
			JOIN usuario u ON u.usuario_id = ut.usuario_id
			WHERE ut.tema_id = tf.tema_id
				AND ut.creador = false
				AND ut.rol_id = (SELECT rol_id FROM rol WHERE nombre ILIKE 'Tesista' LIMIT 1)
		) AS nombres_cotesistas

	FROM temas_filtrados tf
	LEFT JOIN sub_area_conocimiento_tema sact 
		ON sact.tema_id = tf.id_unico
	LEFT JOIN sub_area_conocimiento sac 
		ON sac.sub_area_conocimiento_id = sact.sub_area_conocimiento_id
	GROUP BY 
		tf.tema_id, tf.titulo, tf.resumen, tf.metodologia, tf.objetivos, 
		tf.alumno, tf.documento_url, tf.activo, tf.fecha_limite, tf.fecha_creacion, tf.fecha_modificacion;
END;
$BODY$;


-- 1) Función que lista temas de un usuario según rol y estado
CREATE OR REPLACE FUNCTION listar_temas_por_usuario_rol_estado(
  p_usuario_id    INT,
  p_rol_nombre    TEXT,
  p_estado_nombre TEXT
)
RETURNS TABLE (
  tema_id            INT,
  titulo             TEXT,
  resumen            TEXT,
  metodologia         TEXT,
  objetivos          TEXT,
  portafolio_url     TEXT,
  activo             BOOLEAN,
  fecha_limite       TIMESTAMPTZ,
  fecha_creacion     TIMESTAMPTZ,
  fecha_modificacion TIMESTAMPTZ,
  codigo			  TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.tema_id,
    t.titulo::text,
    t.resumen,
    t.metodologia,
    t.objetivos,
    t.portafolio_url::text,
    t.activo,
    t.fecha_limite,
    t.fecha_creacion,
    t.fecha_modificacion,
	t.codigo::text
  FROM tema t
  JOIN usuario_tema ut
    ON ut.tema_id = t.tema_id
  JOIN rol r
    ON ut.rol_id = r.rol_id
  JOIN estado_tema et
    ON t.estado_tema_id = et.estado_tema_id
  WHERE
    ut.usuario_id = p_usuario_id
    AND r.nombre ILIKE p_rol_nombre
    AND et.nombre ILIKE p_estado_nombre
    AND t.activo = TRUE;
END;
$$ LANGUAGE plpgsql;


-- 2) Función que lista usuarios vinculados a un tema según rol
CREATE OR REPLACE FUNCTION listar_usuarios_por_tema_y_rol(
    p_tema_id    INT,
    p_rol_nombre TEXT
)
RETURNS TABLE (
    usuario_id         INT,
    nombres            TEXT,
    primer_apellido    TEXT,
    segundo_apellido   TEXT,
    correo_electronico TEXT,
    activo             BOOLEAN,
    fecha_creacion     TIMESTAMPTZ,
    asignado            BOOLEAN,
    rechazado           BOOLEAN,
    codigo_pucp TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
      u.usuario_id,
      u.nombres::text,
      u.primer_apellido::text,
      u.segundo_apellido::text,
      u.correo_electronico::text,
      u.activo,
      u.fecha_creacion,
      ut.asignado,
      ut.rechazado,
      u.codigo_pucp::text
    FROM usuario u
    JOIN usuario_tema ut
      ON ut.usuario_id = u.usuario_id
    JOIN rol r
      ON ut.rol_id = r.rol_id
    WHERE
      ut.tema_id = p_tema_id
      AND r.nombre ILIKE p_rol_nombre
      AND u.activo = TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_subareas_por_tema(
  p_tema_id INT
)
RETURNS TABLE (
  sub_area_conocimiento_id INT,
  nombre                   TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    sac.sub_area_conocimiento_id,
    sac.nombre::text
  FROM sub_area_conocimiento_tema sact
  JOIN sub_area_conocimiento sac
    ON sac.sub_area_conocimiento_id = sact.sub_area_conocimiento_id
  WHERE
    sact.tema_id = p_tema_id
    AND sac.activo = TRUE;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION enlazar_tesistas_tema_propuesta_directa(
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
    tema_titulo TEXT;
    tema_resumen TEXT;
BEGIN
    -- Obtener el rol_id del tesista
    SELECT rol_id INTO tesista_rol_id FROM rol WHERE nombre ILIKE 'Tesista' LIMIT 1;

    -- Obtener el estado ID del tema
    SELECT estado_tema_id INTO estado_preinscrito_id FROM estado_tema WHERE nombre ILIKE 'PREINSCRITO' LIMIT 1;

    -- Obtener el título y resumen del tema
    SELECT titulo, resumen INTO tema_titulo, tema_resumen FROM tema WHERE tema_id = p_tema_id;

    -- Asignar a cada tesista
    FOR i IN 1 .. array_length(p_usuarios_id, 1) LOOP
        UPDATE usuario_tema 
        SET asignado = true,
            rol_id = tesista_rol_id,
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

    -- Insertar en historial_tema con la descripción de la propuesta directa aceptada
    INSERT INTO historial_tema (tema_id, titulo, resumen, descripcion_cambio, estado_tema_id, activo, fecha_creacion, fecha_modificacion)
    VALUES (
        p_tema_id,
        tema_titulo,
        tema_resumen,
        CONCAT('El profesor ', p_profesor_id, ' aceptó propuesta Directa.'),
        estado_preinscrito_id,
        true,
        NOW(),
        NOW()
);
END;
$BODY$;




CREATE OR REPLACE FUNCTION listar_areas_conocimiento_por_usuario(
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



CREATE OR REPLACE FUNCTION obtener_sub_areas_por_usuario(
	p_usuario_id integer)
    RETURNS TABLE(sub_area_conocimiento_id integer, area_conocimiento_id integer, nombre text, descripcion text, activo boolean) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT sac.sub_area_conocimiento_id,sac.area_conocimiento_id, sac.nombre::TEXT, sac.descripcion::TEXT,sac.activo
    FROM sub_area_conocimiento sac
    INNER JOIN usuario_sub_area_conocimiento usac 
        ON usac.sub_area_conocimiento_id = sac.sub_area_conocimiento_id
    INNER JOIN usuario u 
        ON u.usuario_id = usac.usuario_id
    WHERE u.usuario_id = p_usuario_id;
END;
$BODY$;



CREATE OR REPLACE FUNCTION postular_asesor_a_tema(
    p_alumno_id integer,
    p_asesor_id integer,
    p_tema_id integer,
    p_comentario text
)
RETURNS void
LANGUAGE 'plpgsql'
COST 100
VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    estado_actual_id INTEGER;
    titulo_tema TEXT;
    resumen_tema TEXT;
BEGIN
    -- Insertar la relación del asesor con el tema
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

    -- Actualiza comentario del alumno
    UPDATE usuario_tema
    SET comentario = p_comentario, fecha_modificacion = NOW()
    WHERE usuario_id = p_alumno_id AND tema_id = p_tema_id;

    -- Obtener datos del tema para insertar en historial_tema
    SELECT estado_tema_id, titulo, resumen
    INTO estado_actual_id, titulo_tema, resumen_tema
    FROM tema
    WHERE tema_id = p_tema_id;

    -- Insertar en historial_tema
    INSERT INTO historial_tema (
        tema_id,
        titulo,
        resumen,
        descripcion_cambio,
        estado_tema_id,
        activo,
        fecha_creacion,
        fecha_modificacion
    )
    VALUES (
        p_tema_id,
        titulo_tema,
        resumen_tema,
        CONCAT('El asesor ', p_asesor_id, ' postuló al tema'),
        estado_actual_id,
        true,
        now(),
        now());
END;
$BODY$;


CREATE OR REPLACE FUNCTION rechazar_tema(
    p_alumno_id INT,
    p_comentario TEXT,
    p_tema_id INT
)
RETURNS VOID AS
$$
BEGIN
    -- Actualiza el estado del tema a "RECHAZADO"
    UPDATE tema 
    SET estado_tema_id = (
        SELECT estado_tema_id 
        FROM estado_tema 
        WHERE nombre ILIKE 'RECHAZADO'
        LIMIT 1
    )
    WHERE tema_id = p_tema_id;

    -- Actualiza el comentario del alumno con rol "Creador"
    UPDATE usuario_tema 
    SET comentario = p_comentario 
    WHERE usuario_id = p_alumno_id 
      AND tema_id = p_tema_id 
      AND rol_id = (
        SELECT rol_id 
        FROM rol 
        WHERE nombre ILIKE 'Creador'
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql;



CREATE FUNCTION obtener_usuarios_por_estado(activo_param BOOLEAN)
    RETURNS TABLE
            (
                usuario_id               INTEGER,
                codigo_pucp              CHARACTER VARYING,
                nombres                  CHARACTER VARYING,
                primer_apellido          CHARACTER VARYING,
                segundo_apellido         CHARACTER VARYING,
                correo_electronico       CHARACTER VARYING,
                nivel_estudios           CHARACTER VARYING,
                cantidad_temas_asignados INTEGER,
                tema_activo              BOOLEAN,
                fecha_asignacion         TIMESTAMP WITH TIME ZONE
            )
    LANGUAGE plpgsql
AS
$$
BEGIN

    RETURN QUERY
        SELECT DISTINCT ON (u.usuario_id) u.usuario_id,
                                          u.codigo_pucp,
                                          u.nombres,
                                          u.primer_apellido,
                                          u.segundo_apellido,
                                          u.correo_electronico,
                                          u.nivel_estudios,
                                          COUNT(ut.tema_id) OVER (PARTITION BY u.usuario_id)::INT AS cantidad_temas_asignados,
                                          ut.activo                                               AS tema_activo,
                                          ut.fecha_creacion                                       AS fecha_asignacion
            FROM usuario u
                     JOIN
                 usuario_tema ut ON u.usuario_id = ut.usuario_id
                     JOIN
                 tema t ON ut.tema_id = t.tema_id
            WHERE ut.rol_id = 2
              AND u.activo = activo_param
            ORDER BY u.usuario_id, ut.prioridad;
END;
$$;

ALTER FUNCTION obtener_usuarios_por_estado(BOOLEAN) OWNER TO postgres;

CREATE FUNCTION obtener_usuarios_por_area_conocimiento(area_conocimiento_id_param INTEGER)
    RETURNS TABLE
            (
                id                       INTEGER,
                codigo_pucp              CHARACTER VARYING,
                nombres                  CHARACTER VARYING,
                primer_apellido          CHARACTER VARYING,
                segundo_apellido         CHARACTER VARYING,
                correo_electronico       CHARACTER VARYING,
                nivel_estudios           CHARACTER VARYING,
                cantidad_temas_asignados INTEGER,
                tema_activo              BOOLEAN,
                fecha_asignacion         TIMESTAMP WITH TIME ZONE
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
        SELECT DISTINCT ON (u.usuario_id) u.usuario_id                                            AS id,
                                          u.codigo_pucp,
                                          u.nombres,
                                          u.primer_apellido,
                                          u.segundo_apellido,
                                          u.correo_electronico,
                                          u.nivel_estudios,
                                          COUNT(ut.tema_id) OVER (PARTITION BY u.usuario_id)::INT AS cantidad_temas_asignados,
                                          ut.activo                                               AS tema_activo,
                                          ut.fecha_creacion                                       AS fecha_asignacion
            FROM usuario u
                     JOIN
                 usuario_tema ut ON u.usuario_id = ut.usuario_id
                     JOIN
                 tema t ON ut.tema_id = t.tema_id
                     JOIN
                 usuario_area_conocimiento uac ON u.usuario_id = uac.usuario_id
                     JOIN
                 area_conocimiento ac ON uac.area_conocimiento_id = ac.area_conocimiento_id
            WHERE ut.rol_id = 2 -- rol de jurado
              AND ac.area_conocimiento_id = area_conocimiento_id_param
            ORDER BY u.usuario_id, ut.prioridad;
END;
$$;

ALTER FUNCTION obtener_usuarios_por_area_conocimiento(INTEGER) OWNER TO postgres;


CREATE FUNCTION obtener_usuarios_con_temass()
    RETURNS TABLE
            (
                usuario_id               INTEGER,
                codigo_pucp              CHARACTER VARYING,
                nombres                  CHARACTER VARYING,
                primer_apellido          CHARACTER VARYING,
                segundo_apellido         CHARACTER VARYING,
                correo_electronico       CHARACTER VARYING,
                nivel_estudios           CHARACTER VARYING,
                cantidad_temas_asignados BIGINT,
                tema_activo              BOOLEAN,
                fecha_asignacion         TIMESTAMP WITH TIME ZONE
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
        SELECT DISTINCT ON (u.usuario_id) u.usuario_id,
                                          u.codigo_pucp,
                                          u.nombres,
                                          u.primer_apellido,
                                          u.segundo_apellido,
                                          u.correo_electronico,
                                          u.nivel_estudios,
                                          COUNT(ut.tema_id) OVER (PARTITION BY u.usuario_id) AS cantidad_temas_asignados,
                                          ut.activo                                          AS tema_activo,
                                          ut.fecha_creacion                                  AS fecha_asignacion
            FROM usuario u
                     JOIN usuario_tema ut ON u.usuario_id = ut.usuario_id
                     JOIN tema t ON ut.tema_id = t.tema_id
            WHERE ut.rol_id = 2
            ORDER BY u.usuario_id, ut.prioridad;
END;
$$;

ALTER FUNCTION obtener_usuarios_con_temass() OWNER TO postgres;


CREATE FUNCTION obtener_usuarios_con_temas()
    RETURNS TABLE
            (
                usuario_id               INTEGER,
                codigo_pucp              CHARACTER VARYING,
                nombres                  CHARACTER VARYING,
                primer_apellido          CHARACTER VARYING,
                segundo_apellido         CHARACTER VARYING,
                correo_electronico       CHARACTER VARYING,
                nivel_estudios           CHARACTER VARYING,
                cantidad_temas_asignados INTEGER,
                tema_activo              BOOLEAN,
                fecha_asignacion         TIMESTAMP WITHOUT TIME ZONE
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
        SELECT DISTINCT ON (u.usuario_id) u.usuario_id,
                                          u.codigo_pucp,
                                          u.nombres,
                                          u.primer_apellido,
                                          u.segundo_apellido,
                                          u.correo_electronico,
                                          u.nivel_estudios,
                                          COUNT(ut.tema_id) OVER (PARTITION BY u.usuario_id) AS cantidad_temas_asignados,
                                          ut.activo                                          AS tema_activo,
                                          ut.fecha_creacion                                  AS fecha_asignacion
            FROM usuario u
                     JOIN usuario_tema ut ON u.usuario_id = ut.usuario_id
                     JOIN tema t ON ut.tema_id = t.tema_id
            WHERE ut.rol_id = 2
            ORDER BY u.usuario_id, ut.prioridad;
END;
$$;

ALTER FUNCTION obtener_usuarios_con_temas() OWNER TO postgres;


CREATE FUNCTION obtener_area_conocimiento(usuario_id_param INTEGER)
    RETURNS TABLE
            (
                usuario_id               INTEGER,
                area_conocimiento_nombre CHARACTER VARYING
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
        SELECT u.usuario_id,
               ac.nombre AS area_conocimiento_nombre
            FROM usuario u
                     JOIN
                 usuario_area_conocimiento uac ON u.usuario_id = uac.usuario_id
                     JOIN
                 area_conocimiento ac ON uac.area_conocimiento_id = ac.area_conocimiento_id
            WHERE u.usuario_id = usuario_id_param
            ORDER BY ac.nombre;
END;
$$;

ALTER FUNCTION obtener_area_conocimiento(INTEGER) OWNER TO postgres;