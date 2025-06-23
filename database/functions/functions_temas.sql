SET search_path TO sgtadb;

CREATE OR REPLACE FUNCTION listar_temas_propuestos_por_subarea_conocimiento(
	p_subareas_ids integer[],
	p_asesor_id integer,
	p_titulo text DEFAULT ''::text,
	p_limit integer DEFAULT 10,
	p_offset integer DEFAULT 0)
RETURNS TABLE(
	tema_id integer,
	titulo text,
	subareas_id integer[],
	alumnos_id integer[],
	descripcion text,
	metodologia text,
	objetivo text,
	recurso text,
	activo boolean,
	fecha_limite timestamp with time zone,
	fecha_creacion timestamp with time zone,
	fecha_modificacion timestamp with time zone,
	postulaciones_count integer
)
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
		t.fecha_modificacion,
		(
			SELECT COUNT(1)::INTEGER
			FROM usuario_tema ut3
			WHERE ut3.tema_id = t.tema_id
			AND ut3.rol_id = (
				SELECT rol_id FROM rol WHERE nombre ILIKE 'Asesor' LIMIT 1
			)
			and asignado = false
		) AS postulaciones_count
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
  p_estado_nombre TEXT,
  p_limit INT ,
  p_offset INT
)
RETURNS TABLE (
  tema_id            INT,
  codigo             TEXT,
  titulo             TEXT,
  resumen            TEXT,
  metodologia         TEXT,
  objetivos          TEXT,
  portafolio_url     TEXT,
  activo             BOOLEAN,
  fecha_limite       TIMESTAMPTZ,
  fecha_creacion     TIMESTAMPTZ,
  fecha_modificacion TIMESTAMPTZ,
  requisitos         TEXT,
  carrera_id         INT,      -- nuevo
  carrera_nombre     TEXT    -- nombre de la carrera
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.tema_id,
    t.codigo::text,
    t.titulo::text,
    t.resumen::text,
    t.metodologia::text,
    t.objetivos::text,
    t.portafolio_url::text,
    t.activo,
    t.fecha_limite,
    t.fecha_creacion,
    t.fecha_modificacion,
    t.requisitos::text,
    c.carrera_id,                       -- columna 12
    c.nombre::text      AS carrera_nombre   -- columna 13
  FROM tema t
    JOIN estado_tema est   ON t.estado_tema_id = est.estado_tema_id
    JOIN usuario_tema ut   ON ut.tema_id      = t.tema_id
    JOIN rol r             ON ut.rol_id       = r.rol_id
    JOIN usuario u         ON ut.usuario_id   = u.usuario_id
    JOIN carrera c         ON t.carrera_id    = c.carrera_id

  WHERE
    u.activo
    AND r.nombre   ILIKE p_rol_nombre
    AND est.nombre ILIKE p_estado_nombre
    AND u.usuario_id = p_usuario_id
    AND t.activo = TRUE
    AND c.activo = TRUE
  ORDER BY t.fecha_creacion DESC
  LIMIT p_limit OFFSET p_offset;
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
    codigo_pucp TEXT,
    creador BOOLEAN,
    comentario TEXT
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
      u.codigo_pucp::text,
      ut.creador,
      ut.comentario::text
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
    RETURNS TABLE(area_id integer, area_nombre text, descripcion text,carrera_area integer)
    LANGUAGE 'sql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
    SELECT ac.area_conocimiento_id,ac.nombre,ac.descripcion,ac.carrera_id
    FROM usuario_area_conocimiento usac
    JOIN area_conocimiento ac ON usac.area_conocimiento_id = ac.area_conocimiento_id
    WHERE usac.usuario_id = p_usuario_id and usac.activo = true;
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
	p_alumno_id integer,
	p_comentario text,
	p_tema_id integer)
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
    -- Actualiza el estado del tema a "RECHAZADO"
    UPDATE tema
    SET estado_tema_id = (
        SELECT estado_tema_id
        FROM estado_tema
        WHERE nombre ILIKE 'RECHAZADO'
        LIMIT 1
    )
    WHERE tema_id = p_tema_id;
    -- Actualiza el comentario del alumno con rol "Tesista"
    UPDATE usuario_tema
    SET comentario = p_comentario , rechazado = true
    WHERE usuario_id = p_alumno_id
      AND tema_id = p_tema_id
      AND rol_id = (
        SELECT rol_id
        FROM rol
        WHERE nombre ILIKE 'Tesista'
        LIMIT 1
    );

	SELECT estado_tema_id, titulo, resumen
    INTO estado_actual_id, titulo_tema, resumen_tema
    FROM tema
    WHERE tema_id = p_tema_id;

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
        CONCAT('Se rechazó el tema'),
        estado_actual_id,
        true,
        now(),
        now());

END;
$BODY$;

CREATE OR REPLACE FUNCTION eliminar_propuestas_tesista(p_usuario_id INTEGER)
RETURNS VOID AS
$$
DECLARE
  v_rol_tesista     INTEGER;
  v_estado_directo  INTEGER;
  v_estado_general  INTEGER;
  rec               RECORD;
  cnt_tesistas      INTEGER;
BEGIN
  -- 1) Obtiene el ID de rol Tesista y los IDs de estado PROPUESTO_DIRECTO y PROPUESTO_GENERAL
  SELECT rol_id           INTO v_rol_tesista
    FROM rol
   WHERE nombre = 'Tesista';

  SELECT estado_tema_id   INTO v_estado_directo
    FROM estado_tema
   WHERE nombre = 'PROPUESTO_DIRECTO';

  SELECT estado_tema_id   INTO v_estado_general
    FROM estado_tema
   WHERE nombre = 'PROPUESTO_GENERAL';

  -- 2) Recorre cada tema en PROPUESTO_DIRECTO o PROPUESTO_GENERAL
  --    donde el usuario sea Tesista, no asignado y activo
  FOR rec IN
    SELECT ut.tema_id
      FROM usuario_tema ut
      JOIN tema t ON ut.tema_id = t.tema_id
     WHERE ut.usuario_id    = p_usuario_id
       AND ut.rol_id        = v_rol_tesista
       AND ut.asignado      = FALSE
       AND ut.activo        = TRUE
       AND t.estado_tema_id IN (v_estado_directo, v_estado_general)
  LOOP
    -- 3) Cuenta cuántos tesistas activos y no asignados hay en ese tema
    SELECT COUNT(*)
      INTO cnt_tesistas
    FROM usuario_tema
    WHERE tema_id   = rec.tema_id
      AND rol_id    = v_rol_tesista
      AND asignado  = FALSE
      AND activo    = TRUE;

    IF cnt_tesistas > 1 THEN
      -- 4a) Si hay más de un tesista: desactiva solo este usuario_tema
      UPDATE usuario_tema
         SET activo = FALSE,
             fecha_modificacion = CURRENT_TIMESTAMP
       WHERE tema_id    = rec.tema_id
         AND usuario_id = p_usuario_id
         AND rol_id     = v_rol_tesista
         AND asignado   = FALSE
         AND activo     = TRUE;
    ELSE
      -- 4b) Si solo queda este tesista: desactiva todos los usuario_tema no asignados
      UPDATE usuario_tema
         SET activo = FALSE,
             fecha_modificacion = CURRENT_TIMESTAMP
       WHERE tema_id  = rec.tema_id
         AND asignado = FALSE
         AND activo   = TRUE;
      --    y desactiva también el tema
      UPDATE tema
         SET activo = FALSE,
             fecha_modificacion = CURRENT_TIMESTAMP
       WHERE tema_id = rec.tema_id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Función que elimina postulaciones de un tesista a temas en PROPUESTO_LIBRE

CREATE OR REPLACE FUNCTION eliminar_postulaciones_tesista(p_usuario_id INTEGER)
RETURNS void AS
$$
DECLARE
  rec                      RECORD;
  v_estado_tema_libre_id   INTEGER;
  v_rol_id_tesista         INTEGER;
BEGIN
  -- 1) Obtener IDs
  SELECT rol_id
    INTO v_rol_id_tesista
  FROM rol
  WHERE nombre ILIKE 'Tesista'
  LIMIT 1;

  SELECT estado_tema_id
    INTO v_estado_tema_libre_id
  FROM estado_tema
  WHERE nombre ILIKE 'PROPUESTO_LIBRE'
  LIMIT 1;

  -- 2) Recorrer los temas del usuario en PROPUESTO_LIBRE
  FOR rec IN
    SELECT ut.tema_id, ut.usuario_id
      FROM usuario_tema ut
      JOIN tema t ON ut.tema_id = t.tema_id
     WHERE ut.usuario_id    = p_usuario_id
       AND ut.rol_id        = v_rol_id_tesista
       AND ut.asignado      = FALSE
       AND ut.activo        = TRUE
       AND t.estado_tema_id = v_estado_tema_libre_id
  LOOP
    -- 3) Desactivar el registro
    UPDATE usuario_tema
       SET activo            = FALSE,
           fecha_modificacion = CURRENT_TIMESTAMP
     WHERE usuario_id = rec.usuario_id
       AND tema_id    = rec.tema_id
       AND rol_id     = v_rol_id_tesista
       AND asignado   = FALSE
       AND activo     = TRUE;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION obtener_usuarios_por_estado(activo_param BOOLEAN)
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

CREATE OR REPLACE FUNCTION obtener_usuarios_por_area_conocimiento(area_conocimiento_id_param INTEGER)
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

CREATE OR REPLACE FUNCTION obtener_usuarios_con_temass()
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

CREATE OR REPLACE FUNCTION obtener_usuarios_con_temas()
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

CREATE OR REPLACE FUNCTION obtener_area_conocimiento(usuario_id_param INTEGER)
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

CREATE OR REPLACE FUNCTION generar_codigo_tema()
RETURNS TRIGGER AS $$
DECLARE
    v_codigo_carrera TEXT;
BEGIN
    SELECT c.codigo INTO v_codigo_carrera
    FROM carrera c
    WHERE c.carrera_id = NEW.carrera_id;

    -- Ahora que tema_id ya existe, podemos usarlo directamente
    UPDATE tema
    SET codigo = v_codigo_carrera || lpad(NEW.tema_id::TEXT, 6, '0')
    WHERE tema_id = NEW.tema_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_generar_codigo_tema
AFTER INSERT ON tema
FOR EACH ROW
EXECUTE FUNCTION generar_codigo_tema();

CREATE OR REPLACE FUNCTION listar_propuestas_del_tesista_con_usuarios(
    p_tesista_id TEXT
)
RETURNS TABLE(
    tema_id            INTEGER,
    titulo             TEXT,
    subareas           TEXT,
    subarea_ids        INTEGER[],
    descripcion        TEXT,
    metodologia         TEXT,
    objetivo           TEXT,
    recurso            TEXT,
    activo             BOOLEAN,
    fecha_limite       TIMESTAMPTZ,
    fecha_creacion     TIMESTAMPTZ,
    fecha_modificacion TIMESTAMPTZ,
    estado_tema_nombre TEXT,
    usuarios           JSONB
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_uid INTEGER;
BEGIN
    -- Obtener el usuario_id desde el id cognito
    SELECT u.usuario_id
    INTO v_uid
    FROM usuario u
    WHERE u.id_cognito = p_tesista_id;

    RETURN QUERY
    SELECT
        t.tema_id,
        t.titulo::text,
        string_agg(DISTINCT sac.nombre::text, ', ')           AS subareas,
        array_agg(DISTINCT sac.sub_area_conocimiento_id)      AS subarea_ids,
        t.resumen::text                                      AS descripcion,
        t.metodologia::text,
        t.objetivos::text,
        r.documento_url::text                                AS recurso,
        t.activo,
        t.fecha_limite,
        t.fecha_creacion,
        t.fecha_modificacion,
        et.nombre::text,
        (
          SELECT jsonb_agg(jsonb_build_object(
            'usuario_id', u.usuario_id,
            'nombre_completo', u.nombres || ' ' || u.primer_apellido,
            'rol',            rl.nombre,
            'creador',        ut.creador,
            'asignado',       ut.asignado,
            'rechazado',      ut.rechazado
          ))
          FROM usuario_tema ut
          JOIN usuario         u  ON u.usuario_id = ut.usuario_id
          JOIN rol             rl ON rl.rol_id     = ut.rol_id
          WHERE ut.tema_id = t.tema_id
            AND rl.nombre ILIKE ANY(ARRAY['Tesista','Asesor','Coasesor','Alumno'])
        ) AS usuarios
    FROM tema t
    JOIN usuario_tema ut_tesista
      ON ut_tesista.tema_id    = t.tema_id
     AND ut_tesista.usuario_id = v_uid
     AND ut_tesista.rol_id     = (
         SELECT rol_id FROM rol WHERE nombre ILIKE 'Tesista' LIMIT 1
     )
    LEFT JOIN estado_tema et
      ON et.estado_tema_id = t.estado_tema_id
    LEFT JOIN sub_area_conocimiento_tema sact
      ON sact.tema_id = t.tema_id
    LEFT JOIN sub_area_conocimiento sac
      ON sac.sub_area_conocimiento_id = sact.sub_area_conocimiento_id
    LEFT JOIN recurso r
      ON r.tema_id = t.tema_id AND r.activo = TRUE
    WHERE t.activo = TRUE
      AND et.nombre ILIKE ANY(ARRAY['PROPUESTO_GENERAL','PROPUESTO_DIRECTO','PREINSCRITO'])
    GROUP BY
      t.tema_id, t.titulo, t.resumen, t.metodologia, t.objetivos,
      r.documento_url, t.activo, t.fecha_limite, t.fecha_creacion, t.fecha_modificacion, et.nombre;
END;
$$;

CREATE OR REPLACE FUNCTION listar_postulaciones_del_tesista_con_usuarios(
    p_tesista_id TEXT,       -- ahora es el cognito_id
    p_tipo_post  INTEGER     -- 0 = GENERAL, 1 = DIRECTO
)
RETURNS TABLE(
    tema_id            INTEGER,
    titulo             TEXT,
    subareas           TEXT,
    subarea_ids        INTEGER[],
    descripcion        TEXT,
    metodologia         TEXT,
    objetivo           TEXT,
    recurso            TEXT,
    activo             BOOLEAN,
    fecha_limite       TIMESTAMPTZ,
    fecha_creacion     TIMESTAMPTZ,
    fecha_modificacion TIMESTAMPTZ,
    estado_tema_nombre TEXT,
    usuarios           JSONB
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_uid INTEGER;
BEGIN
    -- Obtener el usuario_id a partir del cognito_id
    SELECT usuario_id
    INTO v_uid
    FROM usuario
    WHERE id_cognito = p_tesista_id;

    RETURN QUERY
    SELECT
        t.tema_id,
        t.titulo::text                                        AS titulo,
        string_agg(DISTINCT sac.nombre::text, ', ')           AS subareas,
        array_agg(DISTINCT sac.sub_area_conocimiento_id)      AS subarea_ids,
        t.resumen::text                                       AS descripcion,
        t.metodologia::text,
        t.objetivos::text,
        r.documento_url::text                                 AS recurso,
        t.activo,
        t.fecha_limite,
        t.fecha_creacion,
        t.fecha_modificacion,
        et_current.nombre::text                               AS estado_tema_nombre,
        (
          SELECT jsonb_agg(
                   jsonb_build_object(
                     'usuario_id',      u.usuario_id,
                     'nombre_completo', u.nombres || ' ' || u.primer_apellido,
                     'rol',             rl.nombre,
                     'comentario',      ut.comentario,
                     'creador',         ut.creador,
                     'rechazado',       ut.rechazado,
                     'asignado',        ut.asignado
                   )
                 )
          FROM usuario_tema ut
          JOIN usuario         u  ON u.usuario_id = ut.usuario_id
          JOIN rol             rl ON rl.rol_id     = ut.rol_id
          WHERE ut.tema_id = t.tema_id
            AND rl.nombre ILIKE ANY(ARRAY['Tesista','Asesor','Coasesor'])
        ) AS usuarios
    FROM tema t
    JOIN usuario_tema ut_tesista
      ON ut_tesista.tema_id    = t.tema_id
     AND ut_tesista.usuario_id = v_uid
     AND ut_tesista.rol_id     = (
         SELECT rol_id FROM rol
         WHERE nombre ILIKE 'Tesista'
         LIMIT 1
     )
     AND ut_tesista.creador = true

    LEFT JOIN estado_tema et_current
      ON et_current.estado_tema_id = t.estado_tema_id

    LEFT JOIN LATERAL (
      SELECT ht.estado_tema_id
      FROM historial_tema ht
      WHERE ht.tema_id = t.tema_id
        AND ht.activo = true
      ORDER BY ht.fecha_creacion ASC
      LIMIT 1
    ) init_ht ON TRUE

    LEFT JOIN estado_tema et_init
      ON et_init.estado_tema_id = init_ht.estado_tema_id

    LEFT JOIN sub_area_conocimiento_tema sact
      ON sact.tema_id = t.tema_id
    LEFT JOIN sub_area_conocimiento sac
      ON sac.sub_area_conocimiento_id = sact.sub_area_conocimiento_id

    LEFT JOIN recurso r
      ON r.tema_id = t.tema_id
     AND r.activo = TRUE

    WHERE t.activo = TRUE
      AND (
        (p_tipo_post = 0 AND et_init.nombre ILIKE 'PROPUESTO_GENERAL')
     OR (p_tipo_post = 1 AND et_init.nombre ILIKE 'PROPUESTO_DIRECTO')
      )

    GROUP BY
      t.tema_id,
      t.titulo,
      t.resumen,
      t.metodologia,
      t.objetivos,
      r.documento_url,
      t.activo,
      t.fecha_limite,
      t.fecha_creacion,
      t.fecha_modificacion,
      et_current.nombre;
END;
$$;

CREATE OR REPLACE FUNCTION listar_asesores_por_subarea_conocimiento(
    p_subarea_id INTEGER
)
RETURNS TABLE(
    usuario_id        INTEGER,
    nombre_completo   TEXT,
    correo_electronico TEXT
)
LANGUAGE SQL
AS $$
SELECT DISTINCT
    u.usuario_id,
    u.nombres || ' ' || u.primer_apellido    AS nombre_completo,
    u.correo_electronico
FROM usuario_sub_area_conocimiento usac
  JOIN usuario u
    ON u.usuario_id = usac.usuario_id
  JOIN tipo_usuario tu
    ON tu.tipo_usuario_id = u.tipo_usuario_id
  JOIN usuario_rol ur ON ur.usuario_id = usac.usuario_id
WHERE usac.sub_area_conocimiento_id = p_subarea_id
  AND usac.activo = TRUE
  AND tu.nombre ILIKE 'profesor'
  AND ur.rol_id = (
         SELECT rol_id
           FROM rol
          WHERE nombre ILIKE 'Asesor'
          LIMIT 1
       )
$$;

CREATE OR REPLACE FUNCTION obtener_sub_areas_por_carrera_usuario(
    p_usuario_id TEXT
)
RETURNS TABLE(
    sub_area_conocimiento_id INTEGER,
    area_conocimiento_id     INTEGER,
    nombre                   TEXT,
    descripcion              TEXT,
    activo                   BOOLEAN
)
LANGUAGE SQL
AS $$
SELECT DISTINCT
    sac.sub_area_conocimiento_id,
    sac.area_conocimiento_id,
    sac.nombre::TEXT      AS nombre,
    sac.descripcion::TEXT AS descripcion,
    sac.activo
FROM usuario_carrera usac
JOIN usuario u
  ON u.usuario_id = usac.usuario_id
 AND u.id_cognito = p_usuario_id
 AND u.activo = TRUE
JOIN area_conocimiento ac
  ON ac.carrera_id = usac.carrera_id
 AND ac.activo = TRUE
JOIN sub_area_conocimiento sac
  ON sac.area_conocimiento_id = ac.area_conocimiento_id
 AND sac.activo = TRUE
WHERE usac.activo = TRUE
ORDER BY nombre;
$$;

--ALTER FUNCTION obtener_sub_areas_por_carrera_usuario(INTEGER) OWNER TO postgres;

CREATE OR REPLACE FUNCTION aprobar_postulacion_propuesta_general_tesista(
    p_tema_id    INT,
    p_asesor_id  INT,
    p_tesista_id TEXT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    estado_preinscrito_id  INTEGER;
    v_uid                  INTEGER;
BEGIN
    -- Obtener el usuario_id a partir del id_cognito
    SELECT usuario_id
    INTO v_uid
    FROM usuario
    WHERE id_cognito = p_tesista_id;

    -- Solo proceder si el tesista es el creador de este tema
    IF EXISTS (
        SELECT 1
        FROM usuario_tema ut
        JOIN rol r ON r.rol_id = ut.rol_id
        WHERE ut.tema_id = p_tema_id
          AND ut.usuario_id = v_uid
          AND ut.creador = TRUE
          AND r.nombre ILIKE 'Tesista'
    ) THEN
        -- Marcar al asesor como asignado
        UPDATE usuario_tema ut
        SET asignado = TRUE
        FROM rol r
        WHERE ut.tema_id = p_tema_id
          AND ut.usuario_id = p_asesor_id
          AND ut.rol_id = r.rol_id
          AND r.nombre ILIKE 'Asesor';
    END IF;

    -- Obtener el ID de estado 'PREINSCRITO'
    SELECT estado_tema_id
    INTO estado_preinscrito_id
    FROM estado_tema
    WHERE nombre ILIKE 'PREINSCRITO'
    LIMIT 1;

    -- Actualizar el estado del tema
    UPDATE tema
    SET estado_tema_id = estado_preinscrito_id
    WHERE tema_id = p_tema_id;
END;
$$;

--ALTER FUNCTION aprobar_postulacion_propuesta_general_tesista(INTEGER, INTEGER, INTEGER) OWNER TO doadmin;

CREATE OR REPLACE FUNCTION rechazar_postulacion_propuesta_general_tesista(
    p_tema_id    INT,
    p_asesor_id  INT,
    p_tesista_id TEXT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_uid INTEGER;
BEGIN
    -- Obtener el usuario_id a partir del cognito_id
    SELECT usuario_id
    INTO v_uid
    FROM usuario
    WHERE id_cognito = p_tesista_id;

    -- Solo proceder si el tesista es el creador de este tema
    IF EXISTS (
        SELECT 1
        FROM usuario_tema ut
        JOIN rol r ON r.rol_id = ut.rol_id
        WHERE ut.tema_id = p_tema_id
          AND ut.usuario_id = v_uid
          AND ut.creador = TRUE
          AND r.nombre ILIKE 'Tesista'
    ) THEN
        -- Marcar al asesor como rechazado
        UPDATE usuario_tema ut
        SET rechazado = TRUE
        FROM rol r
        WHERE ut.tema_id = p_tema_id
          AND ut.usuario_id = p_asesor_id
          AND ut.rol_id = r.rol_id
          AND r.nombre ILIKE 'Asesor';
    END IF;
END;
$$;

-- ALTER FUNCTION rechazar_postulacion_propuesta_general_tesista(INTEGER, INTEGER, INTEGER) OWNER TO postgres;

CREATE OR REPLACE FUNCTION listar_asesores_por_subarea_conocimiento_v2(
	p_subarea_id integer)
    RETURNS TABLE(usuario_id integer, nombre_completo text, correo_electronico text)
    LANGUAGE 'sql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
SELECT DISTINCT
    u.usuario_id,
    u.nombres || ' ' || u.primer_apellido    AS nombre_completo,
    u.correo_electronico
FROM usuario_sub_area_conocimiento usac
  JOIN usuario u
    ON u.usuario_id = usac.usuario_id
  JOIN tipo_usuario tu
    ON tu.tipo_usuario_id = u.tipo_usuario_id
WHERE usac.sub_area_conocimiento_id = p_subarea_id
  AND usac.activo = TRUE
  AND tu.nombre ILIKE 'profesor'
$BODY$;

ALTER FUNCTION listar_asesores_por_subarea_conocimiento_v2(integer)
    OWNER TO postgres;

CREATE OR REPLACE FUNCTION obtener_usuarios_por_tipo_carrera_y_busqueda(
    p_tipo_usuario     TEXT,
    p_carrera_id       INT,
    p_cadena_busqueda  TEXT
)
RETURNS TABLE(
    usuario_id            INT,
    tipo_usuario_id       INT,
    codigo_pucp           VARCHAR,
    nombres               VARCHAR,
    primer_apellido       VARCHAR,
    segundo_apellido      VARCHAR,
    correo_electronico    VARCHAR,
    nivel_estudios        VARCHAR,
    contrasena            VARCHAR,
    biografia             TEXT,
    enlace_linkedin       VARCHAR,
    enlace_repositorio    VARCHAR,
    disponibilidad        TEXT,
    tipo_disponibilidad   TEXT,
    tipo_dedicacion_id    INT,
    activo                BOOLEAN,
    fecha_creacion        TIMESTAMPTZ,
    fecha_modificacion    TIMESTAMPTZ,
    tipo_usuario_nombre   VARCHAR,
    asignado              BOOLEAN
)
LANGUAGE SQL
STABLE
AS $$
    SELECT
      u.usuario_id,
      u.tipo_usuario_id,
      u.codigo_pucp,
      u.nombres,
      u.primer_apellido,
      u.segundo_apellido,
      u.correo_electronico,
      u.nivel_estudios,
      u.contrasena,
      u.biografia,
      u.enlace_linkedin,
      u.enlace_repositorio,
      u.disponibilidad,
      u.tipo_disponibilidad,
      u.tipo_dedicacion_id,
      u.activo,
      u.fecha_creacion,
      u.fecha_modificacion,
      tu.nombre,
      EXISTS (
          SELECT 1
          FROM usuario_tema ut
          WHERE ut.usuario_id = u.usuario_id
            AND ut.activo = TRUE
            AND ut.asignado = TRUE
      ) AS asignado
    FROM usuario u
    JOIN usuario_carrera uc
      ON u.usuario_id = uc.usuario_id
     AND uc.activo
    JOIN tipo_usuario tu
      ON u.tipo_usuario_id = tu.tipo_usuario_id
    WHERE u.activo
      AND tu.nombre ILIKE p_tipo_usuario
      AND uc.carrera_id = p_carrera_id
      AND (
           u.nombres             ILIKE '%' || p_cadena_busqueda || '%'
        OR u.primer_apellido     ILIKE '%' || p_cadena_busqueda || '%'
        OR u.segundo_apellido    ILIKE '%' || p_cadena_busqueda || '%'
        OR u.codigo_pucp         ILIKE '%' || p_cadena_busqueda || '%'
        OR u.correo_electronico  ILIKE '%' || p_cadena_busqueda || '%'
      );
$$;

CREATE OR REPLACE FUNCTION obtener_carreras_por_usuario(
    p_usuario_id INT
)
RETURNS SETOF carrera
LANGUAGE SQL
STABLE
AS $$
    SELECT c.*
      FROM carrera c
      JOIN usuario_carrera uc
        ON c.carrera_id = uc.carrera_id
     WHERE uc.usuario_id = p_usuario_id
       AND uc.activo
       AND c.activo
    ORDER BY c.nombre;
$$;

CREATE OR REPLACE FUNCTION listar_temas_por_estado_y_carrera(
  p_estado_nombre TEXT,
  p_carrera_id    INTEGER,
  p_limit         INTEGER DEFAULT 100,
  p_offset        INTEGER DEFAULT 0
)
RETURNS TABLE (
  tema_id            INTEGER,
  codigo             TEXT,
  titulo             TEXT,
  resumen            TEXT,
  metodologia         TEXT,
  objetivos          TEXT,
  portafolio_url     TEXT,    -- nuevo
  requisitos         TEXT,    -- nuevo
  estado_nombre      TEXT,
  fecha_limite       TIMESTAMPTZ,
  fecha_creacion     TIMESTAMPTZ,
  fecha_modificacion TIMESTAMPTZ,
  carrera_id         INT,     -- nuevo
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
      t.resumen::text,
      t.metodologia::text,
      t.objetivos::text,
      t.portafolio_url::text,
      t.requisitos::text,
      et.nombre::text       AS estado_nombre,
      t.fecha_limite,
      t.fecha_creacion,
      t.fecha_modificacion,
      c.carrera_id,
      c.nombre::text        AS carrera_nombre
    FROM tema t
      JOIN estado_tema et
        ON t.estado_tema_id = et.estado_tema_id
      JOIN carrera c
        ON t.carrera_id = c.carrera_id
    WHERE
      t.carrera_id = p_carrera_id
      AND et.nombre ILIKE p_estado_nombre
      AND t.activo = TRUE
    ORDER BY t.fecha_creacion DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$;

CREATE OR REPLACE PROCEDURE actualizar_estado_tema(
  p_tema_id           INTEGER,
  p_nuevo_estado_nombre TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE tema
  SET estado_tema_id = (
    SELECT estado_tema_id
    FROM estado_tema
    WHERE nombre ILIKE p_nuevo_estado_nombre
    LIMIT 1
  )
  WHERE tema_id = p_tema_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_solicitudes_by_tema(
    input_tema_id INTEGER,
    offset_val INTEGER,
    limit_val INTEGER
)
RETURNS TABLE (
    solicitud_id INTEGER,
    fecha_creacion DATE,
    estado INTEGER,
    descripcion TEXT,
    respuesta TEXT,
    fecha_modificacion DATE,
    tipo_solicitud_id INTEGER,
    tipo_solicitud_nombre VARCHAR,
    tipo_solicitud_descripcion TEXT,
    usuario_id INTEGER,
    usuario_nombres VARCHAR,
    usuario_primer_apellido VARCHAR,
    usuario_segundo_apellido VARCHAR,
    usuario_correo VARCHAR,
    solicitud_completada BOOLEAN
) AS $$
BEGIN
    RETURN QUERY    SELECT
        s.solicitud_id,
        s.fecha_creacion::DATE,
        s.estado,
        s.descripcion,
        s.respuesta,
        s.fecha_modificacion::DATE,
        ts.tipo_solicitud_id,
        ts.nombre,
        ts.descripcion,
        u.usuario_id,
        u.nombres,
        u.primer_apellido,
        u.segundo_apellido,
        u.correo_electronico,
        uxs.solicitud_completada    FROM solicitud s
    INNER JOIN tipo_solicitud ts ON s.tipo_solicitud_id = ts.tipo_solicitud_id
    INNER JOIN usuario_solicitud uxs ON s.solicitud_id = uxs.solicitud_id --AND uxs.destinatario = true
    INNER JOIN rol_solicitud rs ON uxs.rol_solicitud = rs.rol_solicitud_id AND rs.nombre = 'REMITENTE'
    INNER JOIN usuario u ON uxs.usuario_id = u.usuario_id
    WHERE s.tema_id = input_tema_id
    AND uxs.activo = TRUE
	  AND s.activo= TRUE
    ORDER BY s.fecha_creacion DESC
    OFFSET offset_val
    LIMIT limit_val;
END;
$$ LANGUAGE plpgsql;

-- Function to count solicitudes by tema
CREATE OR REPLACE FUNCTION get_solicitudes_by_tema_count(input_tema_id INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM solicitud s
        WHERE s.tema_id = input_tema_id
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION atender_solicitud_titulo(
    p_solicitud_id   INTEGER,
    p_title          VARCHAR,
    p_response       TEXT
) RETURNS INTEGER
LANGUAGE plpgsql AS
$$
DECLARE
    v_tema_id                INTEGER;
    v_current_estado         INTEGER;
    v_accion_aprobado_id     INTEGER;
    v_accion_pendiente_id    INTEGER;
    v_rol_destinatario_id    INTEGER;
    v_rol_remitente_id       INTEGER;
    v_estado_pendiente_id    INTEGER;
BEGIN
    IF p_solicitud_id IS NULL THEN
        RAISE EXCEPTION 'Solicitud ID cannot be null';
    END IF;

    -- Obtener IDs necesarios
    SELECT accion_solicitud_id INTO v_accion_aprobado_id
      FROM accion_solicitud WHERE nombre = 'APROBADO';

    SELECT accion_solicitud_id INTO v_accion_pendiente_id
      FROM accion_solicitud WHERE nombre = 'PENDIENTE_ACCION';

    SELECT rol_solicitud_id INTO v_rol_destinatario_id
      FROM rol_solicitud WHERE nombre = 'DESTINATARIO';

    SELECT rol_solicitud_id INTO v_rol_remitente_id
      FROM rol_solicitud WHERE nombre = 'REMITENTE';

    SELECT estado_solicitud_id INTO v_estado_pendiente_id
    FROM estado_solicitud WHERE nombre = 'PENDIENTE';

    -- Bloquear solicitud
    SELECT tema_id, estado
      INTO v_tema_id, v_current_estado
      FROM solicitud
     WHERE solicitud_id = p_solicitud_id
       FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No existe solicitud %', p_solicitud_id;
    END IF;

    IF v_current_estado <> v_estado_pendiente_id THEN
        RAISE EXCEPTION 'SOLICITUD %d no esta en estado PENDIENTE', p_solicitud_id;
    END IF;

    -- Actualizar título y solicitud
    UPDATE tema
       SET titulo             = COALESCE(p_title, titulo),
           fecha_modificacion = NOW()
     WHERE tema_id = v_tema_id;

    UPDATE solicitud
       SET respuesta          = p_response,
           fecha_modificacion = NOW()
     WHERE solicitud_id = p_solicitud_id;

    -- ✅ Actualizar DESTINATARIO (alumno o asesor) a APROBADO + comentario
    UPDATE usuario_solicitud
       SET solicitud_completada = TRUE,
           accion_solicitud  = v_accion_aprobado_id,
           comentario           = p_response,
           fecha_modificacion   = NOW()
     WHERE solicitud_id = p_solicitud_id
       AND rol_solicitud = v_rol_destinatario_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró usuario_solicitud DESTINATARIO para solicitud %', p_solicitud_id;
    END IF;

    -- 🔄 Actualizar REMITENTE (coordinador) a PENDIENTE_ACCION
    UPDATE usuario_solicitud
       SET accion_solicitud  = v_accion_pendiente_id,
           comentario           = p_response,
           fecha_modificacion   = NOW()
     WHERE solicitud_id = p_solicitud_id
       AND rol_solicitud = v_rol_remitente_id;

    RETURN v_current_estado;
END;
$$;


CREATE OR REPLACE FUNCTION atender_solicitud_resumen(
    p_solicitud_id   INTEGER,
    p_summary        TEXT,
    p_response       TEXT
) RETURNS INTEGER
LANGUAGE plpgsql AS
$$
DECLARE
    v_tema_id                INTEGER;
    v_current_estado         INTEGER;
    v_accion_aprobado_id     INTEGER;
    v_accion_pendiente_id    INTEGER;
    v_rol_destinatario_id    INTEGER;
    v_rol_remitente_id       INTEGER;
    v_estado_pendiente_id    INTEGER;
BEGIN
    IF p_solicitud_id IS NULL THEN
        RAISE EXCEPTION 'Solicitud ID cannot be null';
    END IF;

    -- Obtener IDs necesarios
    SELECT accion_solicitud_id INTO v_accion_aprobado_id
      FROM accion_solicitud WHERE nombre = 'APROBADO';

    SELECT accion_solicitud_id INTO v_accion_pendiente_id
      FROM accion_solicitud WHERE nombre = 'PENDIENTE_ACCION';

    SELECT rol_solicitud_id INTO v_rol_destinatario_id
      FROM rol_solicitud WHERE nombre = 'DESTINATARIO';

    SELECT rol_solicitud_id INTO v_rol_remitente_id
      FROM rol_solicitud WHERE nombre = 'REMITENTE';

    SELECT estado_solicitud_id INTO v_estado_pendiente_id
    FROM estado_solicitud WHERE nombre = 'PENDIENTE';

    -- Bloquear solicitud
    SELECT tema_id, estado
      INTO v_tema_id, v_current_estado
      FROM solicitud
     WHERE solicitud_id = p_solicitud_id
       FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No existe solicitud %', p_solicitud_id;
    END IF;

    IF v_current_estado <> v_estado_pendiente_id THEN
        RAISE EXCEPTION 'SOLICITUD %d no esta en estado PENDIENTE', p_solicitud_id;
    END IF;

    -- Actualizar resumen y solicitud
    UPDATE tema
       SET resumen            = COALESCE(p_summary, resumen),
           fecha_modificacion = NOW()
     WHERE tema_id = v_tema_id;

    UPDATE solicitud
       SET respuesta          = p_response,
           fecha_modificacion = NOW()
     WHERE solicitud_id = p_solicitud_id;

    -- ✅ Actualizar DESTINATARIO (alumno o asesor) a APROBADO + comentario
    UPDATE usuario_solicitud
       SET solicitud_completada = TRUE,
           accion_solicitud  = v_accion_aprobado_id,
           comentario           = p_response,
           fecha_modificacion   = NOW()
     WHERE solicitud_id = p_solicitud_id
       AND rol_solicitud = v_rol_destinatario_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró usuario_solicitud DESTINATARIO para solicitud %', p_solicitud_id;
    END IF;

    -- 🔄 Actualizar REMITENTE (coordinador) a PENDIENTE_ACCION + comentario
    UPDATE usuario_solicitud
       SET accion_solicitud  = v_accion_pendiente_id,
           comentario           = p_response,
           fecha_modificacion   = NOW()
     WHERE solicitud_id = p_solicitud_id
       AND rol_solicitud = v_rol_remitente_id;

    RETURN v_current_estado;
END;
$$;

CREATE OR REPLACE FUNCTION rechazar_postulaciones_propuesta_general_tesista(
    p_tesista_id INT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_tema_id INT;
    v_rol_asesor_id INT;
BEGIN
    -- 1) Verifico que el tesista existe y es creador del tema
    SELECT ut.tema_id
      INTO v_tema_id
    FROM usuario_tema ut
    JOIN rol r ON r.rol_id = ut.rol_id
    WHERE ut.usuario_id = p_tesista_id
      AND ut.creador = TRUE
      AND r.nombre ILIKE 'Tesista';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El usuario % no es tesista creador de ningún tema', p_tesista_id;
    END IF;

    -- 2) Obtengo el rol_id de “Asesor”
    SELECT rol_id
      INTO v_rol_asesor_id
    FROM rol
    WHERE nombre ILIKE 'Asesor';

    -- 3) Marco como rechazados todos los asesores de ese tema
    --    excepto al confirmado y excepto al propio tesista
    UPDATE usuario_tema
       SET rechazado = TRUE,
           fecha_modificacion = NOW()
     WHERE rol_id         = v_rol_asesor_id
       AND tema_id        = v_tema_id
       AND asignado       = FALSE;
END;
$$;

CREATE OR REPLACE PROCEDURE desactivar_tema_y_desasignar_usuarios(
  IN p_tema_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- 1) Desactivar el tema
  UPDATE tema
     SET activo = FALSE
   WHERE tema_id = p_tema_id;

  -- 2) Desasignar y desactivar todos los registros de usuario_tema
  UPDATE usuario_tema
     SET asignado = FALSE,
         activo   = FALSE
   WHERE tema_id = p_tema_id;

   UPDATE solicitud
      SET activo = FALSE
    WHERE tema_id = p_tema_id;

   UPDATE usuario_solicitud
      SET activo = FALSE
    WHERE solicitud_id IN (
        SELECT solicitud_id
        FROM solicitud
        WHERE tema_id = p_tema_id
    );
END;
$$;

CREATE OR REPLACE FUNCTION buscar_tema_por_id(p_tema_id INT)
RETURNS TABLE (
    codigo TEXT,
    titulo TEXT,
    resumen TEXT,
    metodologia TEXT,
    objetivos TEXT,
    fecha_limite DATE,
    requisitos TEXT,
    asesor INTEGER,
    subareas_id INTEGER[],
    asesores_id INTEGER[],
    carrera INTEGER,
    tesistas_id INTEGER[],      -- Nuevo campo para tesistas
    estado_nombre TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.codigo::TEXT,
        t.titulo::TEXT,
        t.resumen::TEXT,
        t.metodologia::TEXT,
        t.objetivos::TEXT,
        t.fecha_limite::DATE,
        t.requisitos,
        (
            SELECT ut.usuario_id
            FROM usuario_tema ut
            WHERE ut.tema_id = t.tema_id
              AND ut.rol_id = (SELECT rol_id FROM rol WHERE nombre = 'Asesor')
            LIMIT 1
        ) AS asesor,
        ARRAY(
            SELECT DISTINCT sct.sub_area_conocimiento_id
            FROM sub_area_conocimiento_tema sct
            WHERE sct.tema_id = t.tema_id
        ) AS subareas_id,
        ARRAY(
            SELECT DISTINCT ut.usuario_id
            FROM usuario_tema ut
            WHERE ut.tema_id = t.tema_id
              AND ut.rol_id = (SELECT rol_id FROM rol WHERE nombre = 'Coasesor')
        ) AS asesores_id,
        t.carrera_id,
        ARRAY(
            SELECT DISTINCT ut.usuario_id
            FROM usuario_tema ut
            WHERE ut.tema_id = t.tema_id
              AND ut.rol_id = (SELECT rol_id FROM rol WHERE nombre = 'Tesista')
        ) AS tesistas_id,
        et.nombre::TEXT AS estado_nombre
    FROM tema t
    LEFT JOIN estado_tema et
      ON t.estado_tema_id = et.estado_tema_id
    WHERE t.tema_id = p_tema_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION contar_postulaciones(p_tema_id INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  v_estado  TEXT;
  v_rol_id  INT;
  v_count   INT;
BEGIN
  -- 1) Recupero el nombre del estado del tema
  SELECT et.nombre
    INTO v_estado
    FROM tema t
    JOIN estado_tema et
      ON t.estado_tema_id = et.estado_tema_id
   WHERE t.tema_id = p_tema_id;

  -- 2) Según el estado elijo el rol que me interesa
  IF v_estado ILIKE 'PROPUESTO_GENERAL' THEN
    SELECT rol_id
      INTO v_rol_id
      FROM rol
     WHERE nombre ILIKE 'Asesor'
     LIMIT 1;
  ELSIF v_estado ILIKE 'PROPUESTO_LIBRE' THEN
    SELECT rol_id
      INTO v_rol_id
      FROM rol
     WHERE nombre ILIKE 'Tesista'
     LIMIT 1;
  ELSE
    -- otros estados: no contamos postulaciones
    RETURN 0;
  END IF;

  -- 3) Cuento en usuario_tema con los filtros que pediste
  SELECT COUNT(*)
    INTO v_count
    FROM usuario_tema ut
   WHERE ut.tema_id   = p_tema_id
     AND ut.rol_id    = v_rol_id
     AND ut.activo    = TRUE
     AND ut.rechazado = FALSE
     AND ut.asignado  = FALSE;

  RETURN v_count;
END;
$$;

CREATE OR REPLACE FUNCTION listar_temas_libres_con_usuarios(
    p_titulo TEXT DEFAULT '',
    p_limit  INTEGER DEFAULT 10,
    p_offset INTEGER DEFAULT 0,
    p_usuario_cognito_id TEXT DEFAULT NULL
)
RETURNS TABLE(
    tema_id            INTEGER,
    codigo             TEXT,
    titulo             TEXT,
    resumen            TEXT,
    metodologia         TEXT,
    objetivos          TEXT,
    requisitos         TEXT,
    portafolio_url     TEXT,
    fecha_limite       TIMESTAMPTZ,
    fecha_creacion     TIMESTAMPTZ,
    fecha_modificacion TIMESTAMPTZ,
    carrera_id         INTEGER,
    carrera_nombre     TEXT,
    subareas_ids       INTEGER[],
    subareas_nombres   TEXT[],
    usuarios           JSONB,
    estado_tema_nombre TEXT,
    area_id            INTEGER,
    area_nombre        TEXT,
    postulaciones      INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_usuario_id INTEGER;
BEGIN
    -- Convertir Cognito ID a usuario_id interno
    IF p_usuario_cognito_id IS NOT NULL THEN
        SELECT u.usuario_id
        INTO   v_usuario_id
        FROM   usuario u
        WHERE  u.id_cognito = p_usuario_cognito_id
          AND  u.activo = TRUE;
    END IF;

    RETURN QUERY
    SELECT
        t.tema_id,
        t.codigo::text,
        t.titulo::text,
        t.resumen::text,
        t.metodologia::text,
        t.objetivos::text,
        t.requisitos::text,
        t.portafolio_url::text,
        t.fecha_limite,
        t.fecha_creacion,
        t.fecha_modificacion,
        c.carrera_id,
        c.nombre::text          AS carrera_nombre,

        -- ARRAY_AGG de subáreas (IDs y nombres)
        COALESCE(
            ARRAY_AGG(DISTINCT sac.sub_area_conocimiento_id ORDER BY sac.sub_area_conocimiento_id)
                FILTER (WHERE sac.sub_area_conocimiento_id IS NOT NULL),
            ARRAY[]::INTEGER[]
        ) AS subareas_ids,
        COALESCE(
            ARRAY_AGG(DISTINCT sac.nombre::text ORDER BY sac.nombre::text)
                FILTER (WHERE sac.nombre IS NOT NULL),
            ARRAY[]::TEXT[]
        ) AS subareas_nombres,

        -- JSONB de usuarios (Asesor + Coasesores)
        (
            SELECT jsonb_agg(
                     jsonb_build_object(
                       'usuario_id',      u2.usuario_id,
                       'nombre_completo', u2.nombres || ' ' || u2.primer_apellido,
                       'rol',             rl2.nombre,
                       'comentario',      ut2.comentario,
                       'creador',         ut2.creador
                     )
                   )
            FROM   usuario_tema ut2
            JOIN   usuario   u2  ON u2.usuario_id = ut2.usuario_id
            JOIN   rol       rl2 ON rl2.rol_id     = ut2.rol_id
            WHERE  ut2.tema_id = t.tema_id
              AND  rl2.nombre ILIKE ANY (ARRAY['Asesor','Coasesor'])
        ) AS usuarios,

        et.nombre::text          AS estado_tema_nombre,
        ac.area_conocimiento_id  AS area_id,
        ac.nombre::text          AS area_nombre,

        -- Conteo de postulaciones: solo rol = 'Tesista' y asignado = FALSE
        (
            SELECT COUNT(*)::INTEGER
            FROM   usuario_tema utp
            JOIN   rol rlp ON utp.rol_id = rlp.rol_id
            WHERE  utp.tema_id  = t.tema_id
              AND  rlp.nombre   = 'Tesista'
              AND  utp.asignado = FALSE
        ) AS postulaciones

    FROM tema t
    INNER JOIN estado_tema et ON t.estado_tema_id = et.estado_tema_id
    LEFT JOIN carrera c     ON t.carrera_id = c.carrera_id

    -- Join a subáreas y de allí a área de conocimiento
    LEFT JOIN sub_area_conocimiento_tema sact
           ON t.tema_id = sact.tema_id
    LEFT JOIN sub_area_conocimiento sac
           ON sact.sub_area_conocimiento_id = sac.sub_area_conocimiento_id
    LEFT JOIN area_conocimiento ac
           ON sac.area_conocimiento_id = ac.area_conocimiento_id

    WHERE
        t.activo = TRUE
        AND et.nombre = 'PROPUESTO_LIBRE'
        AND (p_titulo = '' OR t.titulo ILIKE '%' || p_titulo || '%')
        AND (
            v_usuario_id IS NULL
            OR t.carrera_id IN (
                SELECT uc.carrera_id
                FROM usuario_carrera uc
                WHERE uc.usuario_id = v_usuario_id
                  AND uc.activo = TRUE
            )
        )

    GROUP BY
        t.tema_id,
        t.codigo,
        t.titulo,
        t.resumen,
        t.metodologia,
        t.objetivos,
        t.requisitos,
        t.portafolio_url,
        t.fecha_limite,
        t.fecha_creacion,
        t.fecha_modificacion,
        c.carrera_id,
        c.nombre,
        et.nombre,
        ac.area_conocimiento_id,
        ac.nombre

    ORDER BY t.fecha_creacion DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$;

CREATE OR REPLACE FUNCTION postular_tesista_tema_libre(
    p_tema_id     INTEGER,
    p_tesista_id  TEXT,
    p_comentario TEXT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_usuario_id      INTEGER;
    v_tema_estado     TEXT;
    v_rol_tesista_id  INTEGER;
    v_existing_count  INTEGER;
BEGIN
    -- 1. Convertir Cognito ID a usuario_id interno
    SELECT u.usuario_id
    INTO   v_usuario_id
    FROM   usuario u
    WHERE  u.id_cognito = p_tesista_id
      AND  u.activo = TRUE;

    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuario no encontrado o inactivo con Cognito ID: %', p_tesista_id;
    END IF;

    -- 2. Validar que el tema exista, esté activo y en estado PROPUESTO_LIBRE
    SELECT et.nombre
    INTO   v_tema_estado
    FROM   tema t
    JOIN   estado_tema et
      ON   t.estado_tema_id = et.estado_tema_id
    WHERE  t.tema_id = p_tema_id
      AND  t.activo = TRUE;

    IF v_tema_estado IS NULL THEN
        RAISE EXCEPTION 'Tema no encontrado o inactivo con ID: %', p_tema_id;
    END IF;

    IF v_tema_estado != 'PROPUESTO_LIBRE' THEN
        RAISE EXCEPTION 'El tema debe estar en estado PROPUESTO_LIBRE, pero está en estado: %', v_tema_estado;
    END IF;

    -- 3. Obtener rol_id correspondiente a "Tesista"
    SELECT r.rol_id
    INTO   v_rol_tesista_id
    FROM   rol r
    WHERE  r.nombre = 'Tesista'
      AND  r.activo = TRUE
    LIMIT  1;

    IF v_rol_tesista_id IS NULL THEN
        RAISE EXCEPTION 'Rol "Tesista" no encontrado o inactivo';
    END IF;

    -- 4. Verificar si el tesista ya está postulado a este tema
    SELECT COUNT(*)
    INTO   v_existing_count
    FROM   usuario_tema ut
    WHERE  ut.tema_id   = p_tema_id
      AND  ut.usuario_id = v_usuario_id
      AND  ut.rol_id     = v_rol_tesista_id
      AND  ut.activo     = TRUE;

    IF v_existing_count > 0 THEN
        RAISE EXCEPTION 'El tesista ya está postulado a este tema';
    END IF;

    -- 5. Verificar si el tesista ya tiene un tema asignado (asignado = TRUE)
    SELECT COUNT(*)
    INTO   v_existing_count
    FROM   usuario_tema ut
    JOIN   rol r
      ON   ut.rol_id = r.rol_id
    WHERE  ut.usuario_id = v_usuario_id
      AND  r.nombre = 'Tesista'
      AND  ut.asignado = TRUE
      AND  ut.activo   = TRUE;

    IF v_existing_count > 0 THEN
        RAISE EXCEPTION 'El tesista ya tiene un tema asignado';
    END IF;

    -- 6. Insertar la postulación en usuario_tema (activo y fechas por default)
    INSERT INTO usuario_tema (
        tema_id,
        usuario_id,
        rol_id,
        asignado,
        creador,
        rechazado,
        comentario
    ) VALUES (
        p_tema_id,
        v_usuario_id,
        v_rol_tesista_id,
        FALSE,  -- asignado = FALSE (pendiente)
        FALSE,  -- creador = FALSE
        FALSE,   -- rechazado = FALSE
        p_comentario
    );

END;
$$;

CREATE OR REPLACE FUNCTION tiene_rol_en_tema(
    p_usuario_id  INTEGER,
    p_tema_id     INTEGER,
    p_rol_nombre  TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_tiene BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
          FROM usuario_tema ut
          JOIN rol          r  ON ut.rol_id = r.rol_id
         WHERE ut.usuario_id = p_usuario_id
           AND ut.tema_id    = p_tema_id
           AND r.nombre      = p_rol_nombre
           AND ut.activo     = TRUE
           AND ut.asignado   = TRUE
    ) INTO v_tiene;

    RETURN v_tiene;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_temas_libres_postulados_alumno(
    p_usuario_cognito_id TEXT
)
RETURNS TABLE(
    tema_id            INTEGER,
    codigo             TEXT,
    titulo             TEXT,
    resumen            TEXT,
    metodologia         TEXT,
    objetivos          TEXT,
    requisitos         TEXT,
    portafolio_url     TEXT,
    fecha_limite       TIMESTAMPTZ,
    fecha_creacion     TIMESTAMPTZ,
    fecha_modificacion TIMESTAMPTZ,
    carrera_id         INTEGER,
    carrera_nombre     TEXT,
    subareas_ids       INTEGER[],
    subareas_nombres   TEXT[],
    usuarios           JSONB,
    estado_tema_nombre TEXT,
    area_id            INTEGER,
    area_nombre        TEXT,
    postulaciones      INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_usuario_id     INTEGER;
    v_rol_tesista_id INTEGER;
BEGIN
    -- 1. Convertir Cognito ID a usuario_id interno
    IF p_usuario_cognito_id IS NULL THEN
        RETURN;
    END IF;

    SELECT u.usuario_id
    INTO   v_usuario_id
    FROM   usuario u
    WHERE  u.id_cognito = p_usuario_cognito_id
      AND  u.activo = TRUE;

    IF v_usuario_id IS NULL THEN
        RETURN;
    END IF;

    -- 2. Obtener rol_id correspondiente a "Tesista"
    SELECT r.rol_id
    INTO   v_rol_tesista_id
    FROM   rol r
    WHERE  r.nombre = 'Tesista'
      AND  r.activo = TRUE
    LIMIT  1;

    IF v_rol_tesista_id IS NULL THEN
        RETURN;
    END IF;

    -- 3. Devolver los mismos campos que listar_temas_libres_con_usuarios,
    --    pero solo para los temas a los que este usuario (tesista) ya se postuló.
    RETURN QUERY
    SELECT
        t.tema_id,
        t.codigo::text,
        t.titulo::text,
        t.resumen::text,
        t.metodologia::text,
        t.objetivos::text,
        t.requisitos::text,
        t.portafolio_url::text,
        t.fecha_limite,
        t.fecha_creacion,
        t.fecha_modificacion,
        c.carrera_id,
        c.nombre::text          AS carrera_nombre,

        -- ARRAY_AGG de subáreas
        COALESCE(
            ARRAY_AGG(DISTINCT sac.sub_area_conocimiento_id ORDER BY sac.sub_area_conocimiento_id)
                FILTER (WHERE sac.sub_area_conocimiento_id IS NOT NULL),
            ARRAY[]::INTEGER[]
        ) AS subareas_ids,
        COALESCE(
            ARRAY_AGG(DISTINCT sac.nombre::text ORDER BY sac.nombre::text)
                FILTER (WHERE sac.nombre IS NOT NULL),
            ARRAY[]::TEXT[]
        ) AS subareas_nombres,

        -- JSONB de usuarios (Asesor + Coasesores)
        (
            SELECT jsonb_agg(
                     jsonb_build_object(
                       'usuario_id',      u2.usuario_id,
                       'nombre_completo', u2.nombres || ' ' || u2.primer_apellido,
                       'rol',             rl2.nombre,
                       'comentario',      ut2.comentario,
                       'creador',         ut2.creador,
                       'rechazado',       ut2.rechazado
                     )
                   )
            FROM   usuario_tema ut2
            JOIN   usuario   u2  ON u2.usuario_id = ut2.usuario_id
            JOIN   rol       rl2 ON rl2.rol_id     = ut2.rol_id
            WHERE  ut2.tema_id = t.tema_id
              AND  (rl2.nombre ILIKE ANY (ARRAY['Asesor','Coasesor'])
               -- Incluir solo el Tesista que coincide con mi usuario
              OR (rl2.nombre ILIKE 'Tesista' AND ut2.usuario_id = v_usuario_id))
        ) AS usuarios,

        et.nombre::text          AS estado_tema_nombre,
        ac.area_conocimiento_id  AS area_id,
        ac.nombre::text          AS area_nombre,

        -- Conteo de postulaciones (rol = 'Tesista', asignado = FALSE)
        (
            SELECT COUNT(*)::INTEGER
            FROM   usuario_tema utp
            JOIN   rol        rlp ON utp.rol_id = rlp.rol_id
            WHERE  utp.tema_id  = t.tema_id
              AND  rlp.nombre   = 'Tesista'
              AND  utp.asignado = FALSE
              AND  utp.activo   = TRUE
        ) AS postulaciones

    FROM tema t
    INNER JOIN estado_tema et ON t.estado_tema_id = et.estado_tema_id
    LEFT JOIN carrera c     ON t.carrera_id = c.carrera_id

    -- Join a subáreas y de allí a área de conocimiento
    LEFT JOIN sub_area_conocimiento_tema sact 
           ON t.tema_id = sact.tema_id
    LEFT JOIN sub_area_conocimiento sac 
           ON sact.sub_area_conocimiento_id = sac.sub_area_conocimiento_id
    LEFT JOIN area_conocimiento ac 
           ON sac.area_conocimiento_id = ac.area_conocimiento_id

    -- Solo incluir los temas a los que el tesista ya se postuló (rol "Tesista", activo)
    INNER JOIN usuario_tema ut_exist
        ON ut_exist.tema_id   = t.tema_id
       AND ut_exist.usuario_id = v_usuario_id
       AND ut_exist.rol_id     = v_rol_tesista_id
       AND ut_exist.activo     = TRUE

    WHERE
        t.activo = TRUE
        AND et.nombre = 'PROPUESTO_LIBRE'
        -- Mantener el mismo filtro de carrera que en listar_temas_libres_con_usuarios
        AND t.carrera_id IN (
            SELECT uc.carrera_id
            FROM   usuario_carrera uc
            WHERE  uc.usuario_id = v_usuario_id
              AND  uc.activo = TRUE
        )

    GROUP BY
        t.tema_id,
        t.codigo,
        t.titulo,
        t.resumen,
        t.metodologia,
        t.objetivos,
        t.requisitos,
        t.portafolio_url,
        t.fecha_limite,
        t.fecha_creacion,
        t.fecha_modificacion,
        c.carrera_id,
        c.nombre,
        et.nombre,
        ac.area_conocimiento_id,
        ac.nombre

    ORDER BY t.fecha_creacion DESC;
END;
$$;

CREATE OR REPLACE FUNCTION crear_tema_libre(p_titulo text, p_resumen text, p_metodologia text, p_objetivos text, p_carrera_id integer, p_fecha_limite date, p_requisitos text, p_sub_areas_conocimiento_ids integer[], p_coasesores_ids integer[])
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_tema_id INT;
    v_now TIMESTAMP := NOW();
    v_asesor_id INT;
    v_coasesores INT[];
    v_rol_asesor_id INT;
    v_rol_coasesor_id INT;
    v_estado_tema_id INT;
BEGIN
    -- Validar que haya al menos un asesor
    IF array_length(p_coasesores_ids, 1) < 1 THEN
        RAISE EXCEPTION 'Debe haber al menos un usuario: el asesor';
    END IF;

    -- Obtener los rol_id por nombre
    SELECT rol_id INTO v_rol_asesor_id FROM rol WHERE LOWER(nombre) = 'asesor' LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el rol con nombre "Asesor"';
    END IF;

    SELECT rol_id INTO v_rol_coasesor_id FROM rol WHERE LOWER(nombre) = 'coasesor' LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el rol con nombre "Coasesor"';
    END IF;

    -- Obtener el estado_tema_id para 'PROPUESTO_LIBRE'
    SELECT estado_tema_id INTO v_estado_tema_id FROM estado_tema WHERE nombre = 'PROPUESTO_LIBRE' LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró el estado_tema con nombre "PROPUESTO_LIBRE"';
    END IF;

    -- Separar asesor y coasesores
    v_asesor_id := p_coasesores_ids[1];
   
    -- Evitar que el asesor esté también como coasesor
    v_coasesores := ARRAY(
        SELECT unnest(p_coasesores_ids[2:array_length(p_coasesores_ids, 1)])
        EXCEPT SELECT p_coasesores_ids[1]
    );

    -- Insertar el tema
    INSERT INTO tema (
        titulo, resumen, metodologia, objetivos, carrera_id,
        fecha_limite, requisitos, activo, fecha_creacion, fecha_modificacion,
        estado_tema_id
    )
    VALUES (
        p_titulo, p_resumen, p_metodologia, p_objetivos, p_carrera_id,
        p_fecha_limite, p_requisitos, TRUE, v_now, v_now,
        v_estado_tema_id
    )
    RETURNING tema_id INTO v_tema_id;

    -- Insertar subáreas
    IF p_sub_areas_conocimiento_ids IS NOT NULL THEN
        INSERT INTO sub_area_conocimiento_tema (
            sub_area_conocimiento_id, tema_id, activo, fecha_creacion, fecha_modificacion
        )
        SELECT unnest(p_sub_areas_conocimiento_ids), v_tema_id, TRUE, v_now, v_now;
    END IF;

    -- Insertar asesor
    INSERT INTO usuario_tema (
        usuario_id, tema_id, rol_id, asignado, rechazado, creador, activo, fecha_creacion, fecha_modificacion
    )
    VALUES (
        v_asesor_id, v_tema_id, v_rol_asesor_id, FALSE, FALSE, TRUE, TRUE, v_now, v_now
    );

    -- Insertar coasesores
    IF v_coasesores IS NOT NULL THEN
        INSERT INTO usuario_tema (
            usuario_id, tema_id, rol_id, asignado, rechazado, creador, activo, fecha_creacion, fecha_modificacion
        )
        SELECT
            unnest(v_coasesores), v_tema_id, v_rol_coasesor_id, FALSE, FALSE, FALSE, TRUE, v_now, v_now;
    END IF;

    
    RETURN v_tema_id;
END;
$function$
;


CREATE OR REPLACE FUNCTION obtener_temas_por_alumno(p_id_alumno INTEGER)
    RETURNS TABLE
            (
                idtema         INTEGER,
                titulo         TEXT,
                estado         TEXT,
                areastematicas TEXT,
                idasesor       INTEGER
            )
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
        SELECT t.tema_id                                  AS "idTema",
               t.titulo::TEXT,
               et.nombre::TEXT,
               STRING_AGG(DISTINCT at.nombre, ', ')::TEXT AS "areasTematicas",
               u.usuario_id                               AS "idAsesor"
            FROM tema t
                     JOIN estado_tema et ON t.estado_tema_id = et.estado_tema_id
                     JOIN usuario_tema uta ON uta.tema_id = t.tema_id
                     LEFT JOIN LATERAL (
                SELECT u2.usuario_id
                    FROM usuario_tema ut
                             JOIN usuario u2 ON u2.usuario_id = ut.usuario_id
                    WHERE ut.tema_id = t.tema_id
                      AND ut.rol_id = 1
                      AND ut.activo = TRUE
                    LIMIT 1
                ) u ON TRUE
                     LEFT JOIN sub_area_conocimiento_tema tsac ON tsac.tema_id = t.tema_id
                     LEFT JOIN sub_area_conocimiento sac ON sac.sub_area_conocimiento_id = tsac.sub_area_conocimiento_id
                     LEFT JOIN area_conocimiento at ON at.area_conocimiento_id = sac.area_conocimiento_id
            WHERE et.nombre IN ('INSCRITO', 'REGISTRADO', 'EN_PROGRESO', 'PAUSADO')
              AND uta.usuario_id = p_id_alumno
              AND uta.rol_id = 4
              AND uta.activo = TRUE
            GROUP BY t.tema_id, t.titulo, et.nombre, u.usuario_id;
END;
$$;

CREATE OR REPLACE FUNCTION listar_postulaciones_alumnos_tema_libre(
    p_asesor_id integer,
    p_busqueda text DEFAULT ''::text,
    p_estado text DEFAULT ''::text,
    p_fecha_limite date DEFAULT NULL::date,
    p_limit integer DEFAULT 10,
    p_offset integer DEFAULT 0)
    RETURNS TABLE(tema_id integer, titulo text, area text, codigo text, estudiante text, estudiante_id integer, estado text, fecha_limite date, subareas integer[]) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
    v_estado_tema_id INT;
    v_rol_id INT;
    v_temas_ids INT[];
BEGIN
    -- Obtener ID del estado 'PROPUESTO_LIBRE' y rol 'Tesista'
    SELECT estado_tema_id INTO v_estado_tema_id FROM estado_tema WHERE nombre = 'PROPUESTO_LIBRE';
    SELECT rol_id INTO v_rol_id FROM rol WHERE nombre = 'Tesista';

    -- Obtener lista de tema_id propuestos por el asesor
    SELECT ARRAY(
        SELECT t.tema_id 
        FROM usuario_tema ut
        JOIN tema t ON t.tema_id = ut.tema_id
        WHERE t.estado_tema_id = v_estado_tema_id
          AND ut.usuario_id = p_asesor_id 
          AND ut.creador = true 
          AND ut.rol_id = (SELECT rol_id FROM rol WHERE nombre = 'Asesor')
    ) INTO v_temas_ids;

    RETURN QUERY
    SELECT 
        t.tema_id,
        t.titulo::TEXT,
        string_agg(DISTINCT sa.nombre::TEXT, ', ') AS area,
        ut.comentario::TEXT AS codigo,
        u.nombres::TEXT AS estudiante,
        u.usuario_id AS estudiante_id,
        CASE 
            WHEN ut.asignado THEN 'Aprobado'
            WHEN ut.rechazado THEN 'Rechazado'
            ELSE 'Pendiente'
        END::TEXT AS estado,
        t.fecha_limite::DATE,
        ARRAY(
            SELECT DISTINCT sact2.sub_area_conocimiento_id
            FROM sub_area_conocimiento_tema sact2
            WHERE sact2.tema_id = t.tema_id
        ) AS subareas
    FROM usuario_tema ut
    JOIN tema t ON ut.tema_id = t.tema_id
    JOIN usuario u ON ut.usuario_id = u.usuario_id
    LEFT JOIN sub_area_conocimiento_tema sact ON sact.tema_id = t.tema_id
    LEFT JOIN sub_area_conocimiento sa ON sa.sub_area_conocimiento_id = sact.sub_area_conocimiento_id
    WHERE t.estado_tema_id = v_estado_tema_id
      AND ut.rol_id = v_rol_id
      AND t.tema_id = ANY(v_temas_ids)
      AND t.activo = true
      AND (
          p_busqueda IS NULL OR p_busqueda = '' 
          OR t.titulo ILIKE '%' || p_busqueda || '%'
          OR u.nombres ILIKE '%' || p_busqueda || '%'
      )
      AND (
          p_estado IS NULL OR p_estado = '' 
          OR (p_estado = 'Pendiente' AND NOT ut.asignado AND NOT ut.rechazado)
          OR (p_estado = 'Aprobado' AND ut.asignado)
          OR (p_estado = 'Rechazado' AND ut.rechazado)
      )
      AND (
          p_fecha_limite IS NULL OR t.fecha_limite = p_fecha_limite
      )
      AND ut.activo = true
    GROUP BY t.tema_id, t.titulo, ut.comentario, u.nombres, u.usuario_id, ut.asignado, ut.rechazado, t.fecha_limite
    LIMIT p_limit OFFSET p_offset;
END;
$BODY$;

CREATE OR REPLACE FUNCTION listar_temas_por_usuario_titulo_area_carrera_estado_fecha(
    p_usuario_id                INT,
    p_titulo                    TEXT    DEFAULT '',  
    p_area_id                   INT     DEFAULT NULL,
    p_carrera_id                INT     DEFAULT NULL,
    p_estado_nombre             TEXT    DEFAULT '',
    p_fecha_creacion_desde      DATE    DEFAULT NULL,
    p_fecha_creacion_hasta      DATE    DEFAULT NULL,
    p_rol                        TEXT    DEFAULT '',
    p_limit                     INT     DEFAULT 10,
    p_offset                    INT     DEFAULT 0
)
RETURNS TABLE(
    tema_id             INTEGER,       --  0
    codigo              TEXT,          --  1
    titulo              TEXT,          --  2
    resumen             TEXT,          --  3
    metodologia          TEXT,         --  4
    objetivos           TEXT,          --  5
    portafolio_url      TEXT,          --  6
    requisitos          TEXT,          --  7
    activo              BOOLEAN,       --  8
    fecha_limite        TIMESTAMPTZ,   --  9
    fecha_creacion      TIMESTAMPTZ,   -- 10
    fecha_modificacion  TIMESTAMPTZ,   -- 11
    carrera_id          INTEGER,       -- 12
    carrera_nombre      TEXT,          -- 13
    area_ids            INTEGER[],     -- 14
    area_nombres        TEXT[],        -- 15
    subarea_ids         INTEGER[],     -- 16
    subarea_nombres     TEXT[],        -- 17
    asesor_ids          INTEGER[],     -- 18  (IDs de Asesor + Coasesores)
    asesor_nombres      TEXT[],        -- 19  (nombres completos)
    asesor_codigos      TEXT[],        -- 20  (códigos PUCP)
    asesor_roles        TEXT[],        -- 21  (roles: “Asesor” o “Coasesor”)
    tesista_ids         INTEGER[],     -- 22
    tesista_nombres     TEXT[],        -- 23
    estado_nombre       TEXT,          -- 24
    postulaciones_count INTEGER,       -- 25
    asesor_asignado BOOLEAN[],  -- 26
    tesista_asignado BOOLEAN[]  -- 27
)
LANGUAGE SQL
STABLE
AS $func$
    SELECT
      -- 1..14: columnas básicas del tema y la carrera
      t.tema_id,
      t.codigo::TEXT,
      t.titulo::TEXT,
      t.resumen::TEXT,
      t.metodologia::TEXT,
      t.objetivos::TEXT,
      t.portafolio_url::TEXT,
      t.requisitos::TEXT,
      t.activo,
      t.fecha_limite,
      t.fecha_creacion,
      t.fecha_modificacion,
      c.carrera_id,
      c.nombre::TEXT AS carrera_nombre,

      -- 15) IDs de áreas (DISTINCT, ordenadas por ID)
      COALESCE(
        ARRAY_AGG(DISTINCT ac.area_conocimiento_id ORDER BY ac.area_conocimiento_id)
        FILTER (WHERE ac.area_conocimiento_id IS NOT NULL),
        ARRAY[]::INTEGER[]
      ) AS area_ids,

      -- 16) Nombres de esas áreas (DISTINCT, ordenados alfabéticamente)
      COALESCE(
        ARRAY_AGG(DISTINCT ac.nombre::TEXT ORDER BY ac.nombre::TEXT)
        FILTER (WHERE ac.nombre IS NOT NULL),
        ARRAY[]::TEXT[]
      ) AS area_nombres,

      -- 17) IDs de subáreas (DISTINCT, ordenadas por ID)
      COALESCE(
        ARRAY_AGG(DISTINCT sac.sub_area_conocimiento_id ORDER BY sac.sub_area_conocimiento_id)
        FILTER (WHERE sac.sub_area_conocimiento_id IS NOT NULL),
        ARRAY[]::INTEGER[]
      ) AS subarea_ids,

      -- 18) Nombres de esas subáreas (DISTINTNT, ordenados alfabéticamente)
      COALESCE(
        ARRAY_AGG(DISTINCT sac.nombre::TEXT ORDER BY sac.nombre::TEXT)
        FILTER (WHERE sac.nombre IS NOT NULL),
        ARRAY[]::TEXT[]
      ) AS subarea_nombres,

      -- 19) IDs de Asesor + Coasesores (activo = TRUE, asignado = TRUE), Asesor primero
      COALESCE(
        (
          SELECT ARRAY(
            SELECT utc.usuario_id
              FROM usuario_tema AS utc
              JOIN rol            AS rc ON rc.rol_id = utc.rol_id
             WHERE utc.tema_id = t.tema_id
               AND utc.activo   = TRUE
               AND utc.rechazado = FALSE
               AND rc.nombre IN ('Asesor','Coasesor')
             ORDER BY 
               CASE WHEN rc.nombre ILIKE 'Asesor' THEN 0 ELSE 1 END,
               utc.usuario_id
          )
        ),
        ARRAY[]::INTEGER[]
      ) AS asesor_ids,

      -- 20) Nombres completos de Asesor + Coasesores (activo = TRUE, asignado = TRUE), Asesor primero
      COALESCE(
        (
          SELECT ARRAY(
            SELECT (uco.nombres || ' ' || uco.primer_apellido || ' ' || uco.segundo_apellido)::TEXT
              FROM usuario_tema AS utc2
              JOIN rol            AS rc2 ON rc2.rol_id = utc2.rol_id
              JOIN usuario        AS uco ON uco.usuario_id = utc2.usuario_id
             WHERE utc2.tema_id = t.tema_id
               AND utc2.activo   = TRUE
               AND utc2.rechazado = FALSE
               AND rc2.nombre IN ('Asesor','Coasesor')
             ORDER BY 
               CASE WHEN rc2.nombre ILIKE 'Asesor' THEN 0 ELSE 1 END,
               utc2.usuario_id
          )
        ),
        ARRAY[]::TEXT[]
      ) AS asesor_nombres,

      -- 21) Códigos PUCP de Asesor + Coasesores (activo = TRUE, asignado = TRUE), Asesor primero
      COALESCE(
        (
          SELECT ARRAY(
            SELECT uco.codigo_pucp::TEXT
              FROM usuario_tema AS utc3
              JOIN rol            AS rc3 ON rc3.rol_id = utc3.rol_id
              JOIN usuario        AS uco ON uco.usuario_id = utc3.usuario_id
             WHERE utc3.tema_id = t.tema_id
               AND utc3.activo   = TRUE
               AND utc3.rechazado = FALSE
               AND rc3.nombre IN ('Asesor','Coasesor')
             ORDER BY 
               CASE WHEN rc3.nombre ILIKE 'Asesor' THEN 0 ELSE 1 END,
               utc3.usuario_id
          )
        ),
        ARRAY[]::TEXT[]
      ) AS asesor_codigos,

      -- 22) Roles de Asesor + Coasesores (activo = TRUE, asignado = TRUE), Asesor primero
      COALESCE(
        (
          SELECT ARRAY(
            SELECT rc4.nombre::TEXT
              FROM usuario_tema AS utc4
              JOIN rol            AS rc4 ON rc4.rol_id = utc4.rol_id
             WHERE utc4.tema_id = t.tema_id
               AND utc4.activo   = TRUE
               AND utc4.rechazado = FALSE
               AND rc4.nombre IN ('Asesor','Coasesor')
             ORDER BY 
               CASE WHEN rc4.nombre ILIKE 'Asesor' THEN 0 ELSE 1 END,
               utc4.usuario_id
          )
        ),
        ARRAY[]::TEXT[]
      ) AS asesor_roles,

      -- 23) IDs de Tesistas (activo = TRUE, asignado = TRUE), ordenados por usuario_id
      COALESCE(
        (
          SELECT ARRAY(
            SELECT utt.usuario_id
              FROM usuario_tema AS utt
              JOIN rol            AS rt ON rt.rol_id = utt.rol_id
             WHERE utt.tema_id = t.tema_id
               AND utt.activo   = TRUE
               AND utt.rechazado = FALSE
               AND rt.nombre ILIKE 'Tesista'
             ORDER BY utt.usuario_id
          )
        ),
        ARRAY[]::INTEGER[]
      ) AS tesista_ids,

      -- 24) Nombres completos de Tesistas (activo = TRUE, asignado = TRUE), ordenados alfabéticamente
      COALESCE(
        (
          SELECT ARRAY(
            SELECT (ute.nombres || ' ' || ute.primer_apellido || ' ' || ute.segundo_apellido)::TEXT
              FROM usuario_tema AS utt2
              JOIN rol            AS rt2 ON rt2.rol_id = utt2.rol_id
              JOIN usuario        AS ute ON ute.usuario_id = utt2.usuario_id
             WHERE utt2.tema_id = t.tema_id
               AND utt2.activo   = TRUE
               AND utt2.rechazado = FALSE
               AND rt2.nombre ILIKE 'Tesista'
             ORDER BY utt2.usuario_id
          )
        ),
        ARRAY[]::TEXT[]
      ) AS tesista_nombres,

      -- 25) Nombre del estado del tema
      et.nombre AS estado_nombre,

      -- 26) Conteo dinámico de postulaciones (según estado)
      CASE
        WHEN et.nombre ILIKE 'PROPUESTO_GENERAL' THEN
          (
            SELECT COUNT(*)
              FROM usuario_tema ut2
              JOIN rol          r2 ON r2.rol_id = ut2.rol_id
             WHERE ut2.tema_id   = t.tema_id
               AND r2.nombre ILIKE 'Asesor'
               AND ut2.activo     = TRUE
               AND ut2.rechazado  = FALSE
               AND ut2.asignado   = FALSE
          )
        WHEN et.nombre ILIKE 'PROPUESTO_LIBRE' THEN
          (
            SELECT COUNT(*)
              FROM usuario_tema ut2
              JOIN rol          r2 ON r2.rol_id = ut2.rol_id
             WHERE ut2.tema_id   = t.tema_id
               AND r2.nombre ILIKE 'Tesista'
               AND ut2.activo     = TRUE
               AND ut2.rechazado  = FALSE
               AND ut2.asignado   = FALSE
          )
        ELSE 0
      END AS postulaciones_count,

      COALESCE((
      SELECT ARRAY(
        SELECT utc.asignado
          FROM usuario_tema utc
          JOIN rol rc ON rc.rol_id = utc.rol_id
        WHERE utc.tema_id = t.tema_id
          AND utc.activo   = TRUE
          AND utc.rechazado = FALSE
          AND rc.nombre IN ('Asesor','Coasesor')
        ORDER BY CASE WHEN rc.nombre ILIKE 'Asesor' THEN 0 ELSE 1 END, utc.usuario_id
      )
    ), ARRAY[]::BOOLEAN[]) AS asesor_asignado,

    COALESCE((
      SELECT ARRAY(
        SELECT utt.asignado
          FROM usuario_tema utt
          JOIN rol rt ON rt.rol_id = utt.rol_id
        WHERE utt.tema_id = t.tema_id
          AND utt.activo   = TRUE
          AND utt.rechazado = FALSE
          AND rt.nombre ILIKE 'Tesista'
        ORDER BY utt.usuario_id
      )
    ), ARRAY[]::BOOLEAN[]) AS tesista_asignado


    FROM tema AS t

    -- 1) Filtrar por que el usuario participe en este tema (activo = TRUE)
    INNER JOIN usuario_tema AS ut_filter
      ON ut_filter.tema_id    = t.tema_id
     AND ut_filter.usuario_id = p_usuario_id
     AND ut_filter.activo     = TRUE
     AND ut_filter.rechazado  = FALSE

    -- 2) JOIN a carrera activa
    INNER JOIN carrera AS c
      ON t.carrera_id = c.carrera_id
     AND c.activo = TRUE

    -- 3) LEFT JOIN a estado_tema (para devolver y filtrar por et.nombre)
    LEFT JOIN estado_tema AS et
      ON t.estado_tema_id = et.estado_tema_id

    -- 4) LEFT JOIN a sub-áreas y áreas (para los arreglos de áreas/subáreas)
    LEFT JOIN sub_area_conocimiento_tema AS sact
      ON sact.tema_id = t.tema_id
      AND sact.activo = TRUE
    LEFT JOIN sub_area_conocimiento   AS sac
      ON sac.sub_area_conocimiento_id = sact.sub_area_conocimiento_id
     AND sac.activo = TRUE
    LEFT JOIN area_conocimiento       AS ac
      ON ac.area_conocimiento_id = sac.area_conocimiento_id
     AND ac.activo = TRUE

    WHERE
      -- Solo temas activos
      t.activo = TRUE

      -- Filtro por título (ILIKE)
      AND (
        p_titulo = ''
        OR t.titulo ILIKE '%' || p_titulo || '%'
      )

      -- Filtro por área (si p_area_id NO es NULL)
      AND (
        p_area_id IS NULL
        OR EXISTS (
          SELECT 1
            FROM sub_area_conocimiento_tema AS s2
            JOIN sub_area_conocimiento       AS sac2
              ON sac2.sub_area_conocimiento_id = s2.sub_area_conocimiento_id
           WHERE s2.tema_id = t.tema_id
             AND sac2.area_conocimiento_id = p_area_id
             AND s2.activo = TRUE
             AND sac2.activo = TRUE
        )
      )

      -- Filtro por carrera (si p_carrera_id NO es NULL)
      AND (
        p_carrera_id IS NULL
        OR t.carrera_id = p_carrera_id
      )

      -- Filtro por estado (si p_estado_nombre <> '')
      AND (
        p_estado_nombre = ''
        OR et.nombre ILIKE p_estado_nombre
      )

      -- Filtro por fecha de creación ≥ p_fecha_creacion_desde
      AND (
        p_fecha_creacion_desde IS NULL
        OR t.fecha_creacion::DATE >= p_fecha_creacion_desde
      )

      -- Filtro por fecha de creación ≤ p_fecha_creacion_hasta
      AND (
        p_fecha_creacion_hasta IS NULL
        OR t.fecha_creacion::DATE <= p_fecha_creacion_hasta
      )

      AND (
           p_rol = ''
        OR EXISTS (
            SELECT 1
              FROM usuario_tema ut
              JOIN rol         r  ON r.rol_id = ut.rol_id
             WHERE ut.tema_id = t.tema_id
               AND ut.usuario_id = p_usuario_id
               AND ut.activo     = TRUE
               AND ut.rechazado   = FALSE
               AND r.nombre ILIKE p_rol
          )
      )

    GROUP BY
      t.tema_id,
      t.codigo,
      t.titulo,
      t.resumen,
      t.metodologia,
      t.objetivos,
      t.portafolio_url,
      t.requisitos,
      t.activo,
      t.fecha_limite,
      t.fecha_creacion,
      t.fecha_modificacion,
      c.carrera_id,
      c.nombre,
      et.nombre

    ORDER BY t.fecha_creacion DESC
    LIMIT   p_limit
    OFFSET  p_offset;
$func$;






CREATE OR REPLACE FUNCTION listar_temas_filtrado_completo(
    p_titulo                TEXT    DEFAULT '',
    p_estado_nombre         TEXT    DEFAULT '',
    p_carrera_id            INT     DEFAULT NULL,
    p_area_id               INT     DEFAULT NULL,
    p_nombre_usuario        TEXT    DEFAULT '',
    p_primer_apellido       TEXT    DEFAULT '',
    p_segundo_apellido      TEXT    DEFAULT '',
    p_limit                 INT     DEFAULT 10,
    p_offset                INT     DEFAULT 0
)
RETURNS TABLE(
    tema_id              INTEGER,       --  0
    codigo               TEXT,          --  1
    titulo               TEXT,          --  2
    resumen              TEXT,          --  3
    metodologia          TEXT,          --  4
    objetivos            TEXT,          --  5
    portafolio_url       TEXT,          --  6
    requisitos           TEXT,          --  7
    activo               BOOLEAN,       --  8
    fecha_limite         TIMESTAMPTZ,   --  9
    fecha_creacion       TIMESTAMPTZ,   -- 10
    fecha_modificacion   TIMESTAMPTZ,   -- 11
    carrera_id           INTEGER,       -- 12
    carrera_nombre       TEXT,          -- 13
    area_ids             INTEGER[],     -- 14
    area_nombres         TEXT[],        -- 15
    subarea_ids          INTEGER[],     -- 16
    subarea_nombres      TEXT[],        -- 17
    asesor_ids           INTEGER[],     -- 18
    asesor_nombres       TEXT[],        -- 19
    asesor_codigos       TEXT[],        -- 20
    asesor_roles         TEXT[],        -- 21
    tesista_ids          INTEGER[],     -- 22
    tesista_nombres      TEXT[],        -- 23
    cant_postulaciones   INTEGER,       -- 24
    estado_nombre        TEXT,           -- 25
    asesor_asignado      BOOLEAN[],     -- 26
    tesista_asignado     BOOLEAN[]      -- 27
)
LANGUAGE SQL
STABLE
AS $func$
    SELECT
      -- 1..14: columnas básicas del tema y carrera
      t.tema_id,
      t.codigo::TEXT,
      t.titulo::TEXT,
      t.resumen::TEXT,
      t.metodologia::TEXT,
      t.objetivos::TEXT,
      t.portafolio_url::TEXT,
      t.requisitos::TEXT,
      t.activo,
      t.fecha_limite,
      t.fecha_creacion,
      t.fecha_modificacion,
      c.carrera_id,
      c.nombre::TEXT AS carrera_nombre,

      -- 15) IDs de áreas (DISTINCT, ordenados por ID)
      COALESCE(
        ARRAY_AGG(DISTINCT ac.area_conocimiento_id ORDER BY ac.area_conocimiento_id)
        FILTER (WHERE ac.area_conocimiento_id IS NOT NULL),
        ARRAY[]::INTEGER[]
      ) AS area_ids,

      -- 16) Nombres de esas áreas (DISTINCT, ordenados alfabéticamente)
      COALESCE(
        ARRAY_AGG(DISTINCT ac.nombre::TEXT ORDER BY ac.nombre::TEXT)
        FILTER (WHERE ac.nombre IS NOT NULL),
        ARRAY[]::TEXT[]
      ) AS area_nombres,

      -- 17) IDs de subáreas (DISTINCT, ordenados por ID)
      COALESCE(
        ARRAY_AGG(DISTINCT sac.sub_area_conocimiento_id ORDER BY sac.sub_area_conocimiento_id)
        FILTER (WHERE sac.sub_area_conocimiento_id IS NOT NULL),
        ARRAY[]::INTEGER[]
      ) AS subarea_ids,

      -- 18) Nombres de esas subáreas (DISTINCT, ordenados alfabéticamente)
      COALESCE(
        ARRAY_AGG(DISTINCT sac.nombre::TEXT ORDER BY sac.nombre::TEXT)
        FILTER (WHERE sac.nombre IS NOT NULL),
        ARRAY[]::TEXT[]
      ) AS subarea_nombres,

      -- 19) IDs de Asesor + Coasesores (actor = activo = TRUE y asignado = TRUE), “Asesor” primero
      COALESCE(
        (
          SELECT ARRAY(
            SELECT utc.usuario_id
              FROM usuario_tema AS utc
              JOIN rol            AS rc ON rc.rol_id = utc.rol_id
             WHERE utc.tema_id = t.tema_id
               AND utc.activo     = TRUE
               AND utc.rechazado   = FALSE
               AND rc.nombre IN ('Asesor','Coasesor')
             ORDER BY 
               CASE WHEN rc.nombre ILIKE 'Asesor' THEN 0 ELSE 1 END,
               utc.usuario_id
          )
        ),
        ARRAY[]::INTEGER[]
      ) AS asesor_ids,

      -- 20) Nombres completos de Asesor + Coasesores (activo = TRUE y asignado = TRUE), “Asesor” primero
      COALESCE(
        (
          SELECT ARRAY(
            SELECT (uco.nombres || ' ' || uco.primer_apellido || ' ' || uco.segundo_apellido)::TEXT
              FROM usuario_tema AS utc2
              JOIN rol       AS rc2 ON rc2.rol_id = utc2.rol_id
              JOIN usuario   AS uco ON uco.usuario_id = utc2.usuario_id
             WHERE utc2.tema_id = t.tema_id
               AND utc2.activo     = TRUE
               AND utc2.rechazado   = FALSE
               AND rc2.nombre IN ('Asesor','Coasesor')
             ORDER BY 
               CASE WHEN rc2.nombre ILIKE 'Asesor' THEN 0 ELSE 1 END,
               utc2.usuario_id
          )
        ),
        ARRAY[]::TEXT[]
      ) AS asesor_nombres,

      -- 21) Códigos PUCP de Asesor + Coasesores (activo = TRUE y asignado = TRUE), “Asesor” primero
      COALESCE(
        (
          SELECT ARRAY(
            SELECT uco.codigo_pucp::TEXT
              FROM usuario_tema AS utc3
              JOIN rol       AS rc3 ON rc3.rol_id = utc3.rol_id
              JOIN usuario   AS uco ON uco.usuario_id = utc3.usuario_id
             WHERE utc3.tema_id = t.tema_id
               AND utc3.activo     = TRUE
               AND utc3.rechazado   = FALSE
               AND rc3.nombre IN ('Asesor','Coasesor')
             ORDER BY 
               CASE WHEN rc3.nombre ILIKE 'Asesor' THEN 0 ELSE 1 END,
               utc3.usuario_id
          )
        ),
        ARRAY[]::TEXT[]
      ) AS asesor_codigos,

      -- 22) Roles (“Asesor” o “Coasesor”) (activo = TRUE y asignado = TRUE), “Asesor” primero
      COALESCE(
        (
          SELECT ARRAY(
            SELECT rc4.nombre::TEXT
              FROM usuario_tema AS utc4
              JOIN rol       AS rc4 ON rc4.rol_id = utc4.rol_id
             WHERE utc4.tema_id = t.tema_id
               AND utc4.activo     = TRUE
               AND utc4.rechazado   = FALSE
               AND rc4.nombre IN ('Asesor','Coasesor')
             ORDER BY 
               CASE WHEN rc4.nombre ILIKE 'Asesor' THEN 0 ELSE 1 END,
               utc4.usuario_id
          )
        ),
        ARRAY[]::TEXT[]
      ) AS asesor_roles,

      -- 23) IDs de Tesistas (activo = TRUE, asignado = TRUE), ordenados por usuario_id
      COALESCE(
        (
          SELECT ARRAY(
            SELECT utt.usuario_id
              FROM usuario_tema AS utt
              JOIN rol       AS rt ON rt.rol_id = utt.rol_id
             WHERE utt.tema_id = t.tema_id
               AND utt.activo     = TRUE
               AND utt.rechazado   = FALSE
               AND rt.nombre ILIKE 'Tesista'
             ORDER BY utt.usuario_id
          )
        ),
        ARRAY[]::INTEGER[]
      ) AS tesista_ids,

      -- 24) Nombres completos de Tesistas (activo = TRUE, asignado = TRUE), ordenados alfabéticamente
      COALESCE(
        (
          SELECT ARRAY(
            SELECT (ute.nombres || ' ' || ute.primer_apellido || ' ' || ute.segundo_apellido)::TEXT
              FROM usuario_tema AS utt2
              JOIN rol       AS rt2 ON rt2.rol_id = utt2.rol_id
              JOIN usuario   AS ute ON ute.usuario_id = utt2.usuario_id
             WHERE utt2.tema_id = t.tema_id
               AND utt2.activo     = TRUE
               AND utt2.RECHAZADO   = FALSE
               AND rt2.nombre ILIKE 'Tesista'
             ORDER BY utt2.usuario_id
          )
        ),
        ARRAY[]::TEXT[]
      ) AS tesista_nombres,

      -- 25) Cantidad de postulaciones (usa la función contar_postulaciones)
      contar_postulaciones(t.tema_id) AS cant_postulaciones,

      -- 26) Nombre del estado
      et.nombre AS estado_nombre,

      COALESCE((
      SELECT ARRAY(
        SELECT utc.asignado
          FROM usuario_tema utc
          JOIN rol rc ON rc.rol_id = utc.rol_id
        WHERE utc.tema_id = t.tema_id
          AND utc.activo   = TRUE
          AND utc.rechazado = FALSE
          AND rc.nombre IN ('Asesor','Coasesor')
        ORDER BY CASE WHEN rc.nombre ILIKE 'Asesor' THEN 0 ELSE 1 END, utc.usuario_id
      )
    ), ARRAY[]::BOOLEAN[]) AS asesor_asignado,

    COALESCE((
      SELECT ARRAY(
        SELECT utt.asignado
          FROM usuario_tema utt
          JOIN rol rt ON rt.rol_id = utt.rol_id
        WHERE utt.tema_id = t.tema_id
          AND utt.activo   = TRUE
          AND utt.rechazado = FALSE
          AND rt.nombre ILIKE 'Tesista'
        ORDER BY utt.usuario_id
      )
    ), ARRAY[]::BOOLEAN[]) AS tesista_asignado

    FROM tema AS t

    -- 1) JOIN a carrera activa
    INNER JOIN carrera     AS c
      ON t.carrera_id = c.carrera_id
     AND c.activo = TRUE

    -- 2) LEFT JOIN a estado_tema (para filtrar p_estado_nombre y devolver et.nombre)
    LEFT JOIN estado_tema  AS et
      ON t.estado_tema_id = et.estado_tema_id

    -- 3) LEFT JOIN a sub-áreas y áreas (para los arreglos de áreas/subáreas)
    LEFT JOIN sub_area_conocimiento_tema AS sact
      ON sact.tema_id = t.tema_id
    LEFT JOIN sub_area_conocimiento        AS sac
      ON sac.sub_area_conocimiento_id = sact.sub_area_conocimiento_id
     AND sac.activo = TRUE
    LEFT JOIN area_conocimiento            AS ac
      ON ac.area_conocimiento_id = sac.area_conocimiento_id
     AND ac.activo = TRUE

    WHERE
      -- Solo temas activos
      t.activo = TRUE

      -- Filtro por título (ILIKE %…%)
      AND (
        p_titulo = ''
        OR t.titulo ILIKE '%' || p_titulo || '%'
      )

      -- Filtro por estado
      AND (
        p_estado_nombre = ''
        OR et.nombre ILIKE p_estado_nombre
      )

      -- Filtro por carrera
      AND (
        p_carrera_id IS NULL
        OR t.carrera_id = p_carrera_id
      )

      -- Filtro por área
      AND (
        p_area_id IS NULL
        OR EXISTS (
          SELECT 1
            FROM sub_area_conocimiento_tema AS s2
            JOIN sub_area_conocimiento        AS sac2
              ON sac2.sub_area_conocimiento_id = s2.sub_area_conocimiento_id
             AND sac2.activo = TRUE
           WHERE s2.tema_id = t.tema_id
             AND sac2.area_conocimiento_id = p_area_id
             --AND s2.activo = TRUE
        )
      )

      -- Filtro por nombre de usuario (Asesor, Coasesor o Tesista)
      AND (
        p_nombre_usuario = ''
        OR EXISTS (
          SELECT 1
            FROM usuario_tema AS utf
            JOIN usuario        AS uf
              ON uf.usuario_id = utf.usuario_id
             AND uf.activo = TRUE
             AND utf.rechazado = FALSE
           WHERE utf.tema_id = t.tema_id
             AND uf.nombres ILIKE '%' || p_nombre_usuario || '%'
             AND utf.activo = TRUE
        )
      )

      -- Filtro por primer apellido de usuario
      AND (
        p_primer_apellido = ''
        OR EXISTS (
          SELECT 1
            FROM usuario_tema AS utf
            JOIN usuario        AS uf
              ON uf.usuario_id = utf.usuario_id
             AND uf.activo = TRUE
             AND utf.rechazado = FALSE
           WHERE utf.tema_id = t.tema_id
             AND uf.primer_apellido ILIKE '%' || p_primer_apellido || '%'
             AND utf.activo = TRUE
        )
      )

      -- Filtro por segundo apellido de usuario
      AND (
        p_segundo_apellido = ''
        OR EXISTS (
          SELECT 1
            FROM usuario_tema AS utf
            JOIN usuario        AS uf
              ON uf.usuario_id = utf.usuario_id
             AND uf.activo = TRUE
             AND utf.rechazado = FALSE
           WHERE utf.tema_id = t.tema_id
             AND uf.segundo_apellido ILIKE '%' || p_segundo_apellido || '%'
             AND utf.activo = TRUE
        )
      )

    GROUP BY
      t.tema_id,
      t.codigo,
      t.titulo,
      t.resumen,
      t.metodologia,
      t.objetivos,
      t.portafolio_url,
      t.requisitos,
      t.activo,
      t.fecha_limite,
      t.fecha_creacion,
      t.fecha_modificacion,
      c.carrera_id,
      c.nombre,
      et.nombre

    ORDER BY t.fecha_creacion DESC
    LIMIT   p_limit
    OFFSET  p_offset;
$func$;



CREATE OR REPLACE FUNCTION listar_areas_por_tema(
	_tema_id integer)
    RETURNS TABLE(area_conocimiento_id integer, carrera_id integer, nombre text, descripcion text, activo boolean, fecha_creacion timestamp with time zone, fecha_modificacion timestamp with time zone) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

BEGIN
  RETURN QUERY
    SELECT DISTINCT
      ac.area_conocimiento_id,
	  ac.carrera_id,
      ac.nombre::text,
      ac.descripcion::text,
      ac.activo,
      ac.fecha_creacion,
      ac.fecha_modificacion
    FROM area_conocimiento ac
    INNER JOIN sub_area_conocimiento sac 
      ON sac.area_conocimiento_id = ac.area_conocimiento_id 
    INNER JOIN sub_area_conocimiento_tema sact 
      ON sact.sub_area_conocimiento_id = sac.sub_area_conocimiento_id 
    INNER JOIN tema t 
      ON t.tema_id = sact.tema_id
    WHERE t.tema_id = _tema_id;
END;

CREATE OR REPLACE FUNCTION es_coordinador_activo(
    p_usuario_id  integer,
    p_carrera_id  integer
) RETURNS boolean
AS $$
DECLARE
    v_count integer;
BEGIN
    SELECT COUNT(*) 
      INTO v_count
    FROM usuario_carrera
    WHERE usuario_id     = p_usuario_id
      AND carrera_id     = p_carrera_id
      AND activo         = TRUE
      AND es_coordinador = TRUE;

    RETURN v_count > 0;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION guardar_similitudes_tema(
    p_tema_id             INTEGER,
    p_usuario_id          INTEGER,
    p_tema_relacion_ids   INTEGER[],
    p_porcentajes         NUMERIC[]
) RETURNS VOID AS
$$
DECLARE
    i        INTEGER;
    v_rel_id INTEGER;
    v_pct    NUMERIC;
BEGIN
    -- 0) Desactivar todas las similitudes previas de este tema
    UPDATE tema_similar
       SET activo = FALSE,
           fecha_modificacion = CURRENT_TIMESTAMP
     WHERE tema_id = p_tema_id;

    -- 1) Validar que los arrays tengan la misma longitud
    IF array_length(p_tema_relacion_ids, 1) IS DISTINCT FROM
       array_length(p_porcentajes, 1) THEN
        RAISE EXCEPTION
            'Los arrays de relaciones y porcentajes deben tener la misma longitud';
    END IF;

    -- 2) Recorremos los arrays e insertamos cada nueva relación
    FOR i IN 1 .. array_length(p_tema_relacion_ids, 1) LOOP
        v_rel_id := p_tema_relacion_ids[i];
        v_pct    := p_porcentajes[i];

        -- Validaciones básicas
        IF v_rel_id = p_tema_id THEN
            RAISE EXCEPTION
                'No se puede relacionar un tema consigo mismo: %', p_tema_id;
        END IF;
        IF v_pct < 0 OR v_pct > 100 THEN
            RAISE EXCEPTION
                'Porcentaje fuera de rango [0..100]: %', v_pct;
        END IF;

        INSERT INTO tema_similar (
            tema_id,
            tema_relacion_id,
            usuario_id,
            porcentaje_similitud,
            activo,
            fecha_creacion,
            fecha_modificacion
        ) VALUES (
            p_tema_id,
            v_rel_id,
            p_usuario_id,
            v_pct,
            TRUE,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION procesar_inscripcion_items(
    p_tema_id        INTEGER,
    p_usuario_id     INTEGER,
    p_subarea_ids    INTEGER[],
    p_coasesor_ids   INTEGER[],
    p_tesista_ids    INTEGER[]
) RETURNS VOID
LANGUAGE plpgsql AS $$
DECLARE
    v_rol_asesor     INTEGER;
    v_rol_coasesor   INTEGER;
    v_rol_tesista    INTEGER;
    v_item_id        INTEGER;
BEGIN
    -- 0) Validar que el usuario exista y esté activo
    PERFORM 1
      FROM usuario
     WHERE usuario_id = p_usuario_id
       AND activo IS TRUE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario % no existe o está inactivo', p_usuario_id;
    END IF;

    -- 1) Obtener los IDs de rol
    SELECT rol_id INTO v_rol_asesor   FROM rol WHERE nombre = 'Asesor'   LIMIT 1;
    SELECT rol_id INTO v_rol_coasesor FROM rol WHERE nombre = 'Coasesor' LIMIT 1;
    SELECT rol_id INTO v_rol_tesista  FROM rol WHERE nombre = 'Tesista'  LIMIT 1;

    -- 2) Insertar al asesor (asignado=true, creador=true)
    INSERT INTO usuario_tema
      (usuario_id, tema_id, rol_id, asignado, creador, activo, fecha_creacion)
    VALUES
      (p_usuario_id, p_tema_id, v_rol_asesor, TRUE, TRUE, TRUE, NOW());

    -- 3) Asociar subáreas de conocimiento
    FOREACH v_item_id IN ARRAY p_subarea_ids LOOP
        INSERT INTO sub_area_conocimiento_tema
          (sub_area_conocimiento_id, tema_id, activo, fecha_creacion)
        VALUES
          (v_item_id, p_tema_id, TRUE, NOW());
    END LOOP;

    -- 4) Insertar coasesores (asignado=true, creador=false)
    FOREACH v_item_id IN ARRAY p_coasesor_ids LOOP
        INSERT INTO usuario_tema
          (usuario_id, tema_id, rol_id, asignado, creador, activo, fecha_creacion)
        VALUES
          (v_item_id, p_tema_id, v_rol_coasesor, TRUE, FALSE, TRUE, NOW());
    END LOOP;

    -- 5) Insertar tesistas (asignado=true, creador=false)
    FOREACH v_item_id IN ARRAY p_tesista_ids LOOP
        INSERT INTO usuario_tema
          (usuario_id, tema_id, rol_id, asignado, creador, activo, fecha_creacion)
        VALUES
          (v_item_id, p_tema_id, v_rol_tesista, TRUE, FALSE, TRUE, NOW());
    END LOOP;

    -- 6) Limpiar postulaciones y propuestas anteriores
    FOREACH v_item_id IN ARRAY p_tesista_ids LOOP
        PERFORM eliminar_postulaciones_tesista(v_item_id);
        PERFORM eliminar_propuestas_tesista(v_item_id);
    END LOOP;
END;
$$;



CREATE OR REPLACE FUNCTION crear_solicitud_aprobacion_temaV2(p_tema_id INT) 
  RETURNS VOID 
AS
$$
DECLARE
    v_tipo_solicitud_id      INT;
    v_estado_solicitud_id    INT;
    v_rol_destinatario_id    INT;
    v_rol_remitente_id       INT;
    v_accion_pendiente_id    INT;
    v_accion_sin_id          INT;
    v_rol_asesor_id          INT;
    v_rol_tesista_id         INT;
    v_solicitud_id           INT;
BEGIN
    -- 1) Obtener IDs de catálogos
    SELECT tipo_solicitud_id
      INTO v_tipo_solicitud_id
      FROM tipo_solicitud
     WHERE nombre = 'Aprobación de tema (por coordinador)';

    SELECT estado_solicitud_id
      INTO v_estado_solicitud_id
      FROM estado_solicitud
     WHERE nombre = 'PENDIENTE';

    SELECT rol_solicitud_id
      INTO v_rol_destinatario_id
      FROM rol_solicitud
     WHERE nombre = 'DESTINATARIO';

    SELECT rol_solicitud_id
      INTO v_rol_remitente_id
      FROM rol_solicitud
     WHERE nombre = 'REMITENTE';

    -- Acción “pendiente” para coordinadores
    SELECT accion_solicitud_id
      INTO v_accion_pendiente_id
      FROM accion_solicitud
     WHERE nombre = 'PENDIENTE_ACCION';

    -- Acción “sin acción” para remitentes
    SELECT accion_solicitud_id
      INTO v_accion_sin_id
      FROM accion_solicitud
     WHERE nombre = 'SIN_ACCION';

    -- Rol Asesor
    SELECT rol_id
      INTO v_rol_asesor_id
      FROM rol
     WHERE nombre = 'Asesor';

    -- Rol Tesista
    SELECT rol_id
      INTO v_rol_tesista_id
      FROM rol
     WHERE nombre = 'Tesista';

     IF EXISTS (
        SELECT 1 FROM solicitud
         WHERE tipo_solicitud_id = v_tipo_solicitud_id
           AND tema_id           = p_tema_id
           AND estado_solicitud  = v_estado_solicitud_id
           AND activo            = TRUE
    ) THEN
        RAISE EXCEPTION 'Ya existe una solicitud de aprobación PENDIENTE activa para el tema %', p_tema_id;
    END IF;

    -- 2) Insertar la solicitud principal
    INSERT INTO solicitud(
        descripcion,
        tipo_solicitud_id,
        tema_id,
        estado_solicitud,
        estado,
        activo
    ) VALUES (
        'Solicitud de aprobación de tema por coordinador',
        v_tipo_solicitud_id,
        p_tema_id,
        v_estado_solicitud_id,
        1,
        TRUE
    )
    RETURNING solicitud_id INTO v_solicitud_id;

    -- 3) Destinatarios: coordinadores con acción pendiente
    INSERT INTO usuario_solicitud(
        usuario_id,
        solicitud_id,
        rol_solicitud,
        accion_solicitud
    )
    SELECT
        uc.usuario_id,
        v_solicitud_id,
        v_rol_destinatario_id,
        v_accion_pendiente_id
    FROM usuario_carrera uc
    WHERE uc.carrera_id     = (SELECT carrera_id FROM tema WHERE tema_id = p_tema_id)
      AND uc.es_coordinador = TRUE
      AND uc.activo         = TRUE;

    -- 4a) Remitente: Asesor, sin acción
    INSERT INTO usuario_solicitud(
        usuario_id,
        solicitud_id,
        rol_solicitud,
        accion_solicitud,
        activo
    )
    SELECT
        ut.usuario_id,
        v_solicitud_id,
        v_rol_remitente_id,
        v_accion_sin_id,
        TRUE
    FROM usuario_tema ut
    WHERE ut.tema_id  = p_tema_id
      AND ut.activo   = TRUE
      AND ut.asignado = TRUE
      AND ut.rol_id   = v_rol_asesor_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No hay Asesor activo/asignado para el tema %', p_tema_id;
    END IF;

    -- 4b) Remitente: Tesista, sin acción
    INSERT INTO usuario_solicitud(
        usuario_id,
        solicitud_id,
        rol_solicitud,
        accion_solicitud,
        activo
    )
    SELECT
        ut.usuario_id,
        v_solicitud_id,
        v_rol_remitente_id,
        v_accion_sin_id,
        TRUE
    FROM usuario_tema ut
    WHERE ut.tema_id = p_tema_id
      AND ut.activo  = TRUE
      AND ut.rol_id  = v_rol_tesista_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No hay Tesista activo para el tema %', p_tema_id;
    END IF;
END;
$$ 
LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION listar_temas_similares(
    p_tema_id INTEGER
)
RETURNS TABLE(
    id                   INTEGER,
    codigo               VARCHAR,
    titulo               VARCHAR,
    resumen              TEXT,
    objetivos            TEXT,
    metodologia          TEXT,
    requisitos           TEXT,
    portafolioUrl        VARCHAR,
    activo               BOOLEAN,
    fechaLimite          TIMESTAMPTZ,
    fechaFinalizacion    TIMESTAMPTZ,
    fechaCreacion        TIMESTAMPTZ,
    fechaModificacion    TIMESTAMPTZ,
    estadoTemaNombre     VARCHAR,
    porcentajeSimilitud  NUMERIC(5,2)
)
LANGUAGE sql
AS $$
    SELECT
      t.tema_id                  AS id,
      t.codigo                   AS codigo,
      t.titulo                   AS titulo,
      t.resumen                  AS resumen,
      t.objetivos                AS objetivos,
      t.metodologia              AS metodologia,
      t.requisitos               AS requisitos,
      t.portafolio_url           AS portafolioUrl,
      t.activo                   AS activo,
      t.fecha_limite             AS fechaLimite,
      t.fecha_finalizacion       AS fechaFinalizacion,
      t.fecha_creacion           AS fechaCreacion,
      t.fecha_modificacion       AS fechaModificacion,
      et.nombre                  AS estadoTemaNombre,
      ts.porcentaje_similitud    AS porcentajeSimilitud
    FROM tema_similar ts
    JOIN tema t
      ON t.tema_id = ts.tema_relacion_id
    JOIN estado_tema et
      ON et.estado_tema_id = t.estado_tema_id
    WHERE ts.tema_id  = p_tema_id
      AND ts.activo    = TRUE
      AND t.activo     = TRUE
$$;



CREATE OR REPLACE FUNCTION listar_temas_finalizados()
RETURNS TABLE (
    tema_id INTEGER,
    titulo TEXT,
    resumen TEXT,
    objetivos TEXT,
    estado_nombre TEXT,
    fecha_finalizacion TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.tema_id::INTEGER,
        t.titulo::TEXT,
        t.resumen::TEXT,
        t.objetivos::TEXT,
        et.nombre::TEXT AS estado_nombre,
        t.fecha_finalizacion::TIMESTAMPTZ
    FROM tema t
    INNER JOIN estado_tema et ON et.estado_tema_id = t.estado_tema_id
    WHERE et.nombre ILIKE 'FINALIZADO';
END;
$$;

CREATE OR REPLACE FUNCTION contar_temas_comprometidos(p_usuario_sub_id TEXT)
RETURNS TABLE (
    comprometido INT,
    estado_nombre TEXT
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_usuario_id INT;
BEGIN
    -- Obtener el usuario_id desde el sub de Cognito
    SELECT u.usuario_id
      INTO v_usuario_id
      FROM usuario u
     WHERE u.id_cognito = p_usuario_sub_id
     LIMIT 1;

    -- Si no existe el usuario, devolver 0 y NULL
    IF v_usuario_id IS NULL THEN
        RETURN QUERY SELECT 0, NULL::TEXT;
        RETURN;
    END IF;

    -- Consultar si tiene temas comprometidos
    RETURN QUERY
    SELECT
        CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END AS comprometido,
        MAX(et.nombre) AS estado_nombre
    FROM tema t
    JOIN usuario_tema ut ON ut.tema_id = t.tema_id
    JOIN estado_tema et  ON t.estado_tema_id = et.estado_tema_id
    WHERE ut.usuario_id = v_usuario_id
      AND ut.activo = TRUE
      AND t.activo = TRUE
      AND et.nombre IN ('PRE_INSCRITO', 'INSCRITO', 'PAUSADO', 'EN_PROGRESO', 'REGISTRADO', 'OBSERVADO');
END;
$$;

CREATE OR REPLACE FUNCTION rechazar_propuesta_cotesista(p_tema_id INTEGER, p_id_cognito TEXT)
RETURNS TEXT AS $$
DECLARE
    v_usuario_id INTEGER;
    v_updated INTEGER;
BEGIN
    SELECT usuario_id INTO v_usuario_id FROM usuario WHERE id_cognito = p_id_cognito AND activo = TRUE;
    IF v_usuario_id IS NULL THEN
        RETURN 'ERROR: Usuario no encontrado para id_cognito ' || p_id_cognito;
    END IF;

    UPDATE usuario_tema
    SET rechazado = TRUE
    WHERE usuario_id = v_usuario_id
      AND tema_id = p_tema_id
      AND activo = TRUE
      AND creador IS NOT TRUE
      AND rol_id NOT IN (SELECT rol_id FROM rol WHERE nombre = 'Tesista');

    GET DIAGNOSTICS v_updated = ROW_COUNT;
    IF v_updated = 0 THEN
        RETURN 'ERROR: No se encontró relación usuario-tema activa';
    END IF;

    RETURN 'OK';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION aceptar_propuesta_cotesista(p_tema_id INTEGER, p_id_cognito TEXT)
RETURNS TEXT AS $$
DECLARE
    v_usuario_id INTEGER;
    v_updated INTEGER;
BEGIN
    SELECT usuario_id INTO v_usuario_id FROM usuario WHERE id_cognito = p_id_cognito AND activo = TRUE;
    IF v_usuario_id IS NULL THEN
        RETURN 'ERROR: Usuario no encontrado para id_cognito ' || p_id_cognito;
    END IF;

    UPDATE usuario_tema
    SET rol_id = (SELECT rol_id FROM rol WHERE nombre = 'Tesista')
    WHERE usuario_id = v_usuario_id
      AND tema_id = p_tema_id
      AND activo = TRUE
      AND creador IS NOT TRUE;

    GET DIAGNOSTICS v_updated = ROW_COUNT;
    IF v_updated = 0 THEN
        RETURN 'ERROR: No se encontró relación usuario-tema activa';
    END IF;

    RETURN 'OK';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_propuestas_del_cotesista_con_usuarios(
    p_tesista_id TEXT
)
RETURNS TABLE(
    tema_id            INTEGER,
    titulo             TEXT,
    subareas           TEXT,
    subarea_ids        INTEGER[],
    descripcion        TEXT,
    metodologia         TEXT,
    objetivo           TEXT,
    recurso            TEXT,
    activo             BOOLEAN,
    fecha_limite       TIMESTAMPTZ,
    fecha_creacion     TIMESTAMPTZ,
    fecha_modificacion TIMESTAMPTZ,
    estado_tema_nombre TEXT,
    usuarios           JSONB
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_uid INTEGER;
BEGIN
    -- Obtener el usuario_id desde el id cognito
    SELECT u.usuario_id
    INTO v_uid
    FROM usuario u
    WHERE u.id_cognito = p_tesista_id;

    RETURN QUERY
    SELECT
        t.tema_id,
        t.titulo::text,
        string_agg(DISTINCT sac.nombre::text, ', ')           AS subareas,
        array_agg(DISTINCT sac.sub_area_conocimiento_id)      AS subarea_ids,
        t.resumen::text                                      AS descripcion,
        t.metodologia::text,
        t.objetivos::text,
        r.documento_url::text                                AS recurso,
        t.activo,
        t.fecha_limite,
        t.fecha_creacion,
        t.fecha_modificacion,
        et.nombre::text,
        (
          SELECT jsonb_agg(jsonb_build_object(
            'usuario_id', u.usuario_id,
            'nombre_completo', u.nombres || ' ' || u.primer_apellido,
            'rol',            rl.nombre,
            'creador',        ut.creador,
            'asignado',       ut.asignado,
            'rechazado',      ut.rechazado
          ))
          FROM usuario_tema ut
          JOIN usuario         u  ON u.usuario_id = ut.usuario_id
          JOIN rol             rl ON rl.rol_id     = ut.rol_id
          WHERE ut.tema_id = t.tema_id
            AND rl.nombre ILIKE ANY(ARRAY['Tesista','Asesor','Coasesor','Alumno'])
        ) AS usuarios
    FROM tema t
    JOIN usuario_tema ut_tesista
      ON ut_tesista.tema_id    = t.tema_id
     AND ut_tesista.usuario_id = v_uid
     AND ut_tesista.rol_id     = (
         SELECT rol_id FROM rol WHERE nombre ILIKE 'Alumno' LIMIT 1
     )
     AND ut_tesista.creador IS NOT TRUE
     AND ut_tesista.rechazado IS NOT TRUE
     AND ut_tesista.activo = true
    LEFT JOIN estado_tema et
      ON et.estado_tema_id = t.estado_tema_id
    LEFT JOIN sub_area_conocimiento_tema sact
      ON sact.tema_id = t.tema_id
    LEFT JOIN sub_area_conocimiento sac
      ON sac.sub_area_conocimiento_id = sact.sub_area_conocimiento_id
    LEFT JOIN recurso r
      ON r.tema_id = t.tema_id AND r.activo = TRUE
    WHERE t.activo = TRUE
      AND et.nombre ILIKE ANY(ARRAY['PROPUESTO_GENERAL','PROPUESTO_DIRECTO'])
    GROUP BY
      t.tema_id, t.titulo, t.resumen, t.metodologia, t.objetivos,
      r.documento_url, t.activo, t.fecha_limite, t.fecha_creacion, t.fecha_modificacion, et.nombre;
END;
$$;



CREATE OR REPLACE FUNCTION listar_historial_tema_completo(p_tema_id INTEGER)
  RETURNS TABLE(
    historial_tema_id    INTEGER,
    tema_id              INTEGER,
    codigo               TEXT,
    titulo               TEXT,
    resumen              TEXT,
    metodologia           TEXT,
    objetivos            TEXT,
    descripcion_cambio   TEXT,
    portafolio_url       TEXT,
    estado_tema_nombre   TEXT,
    proyecto_id          INTEGER,
    carrera_id           INTEGER,
    subareas_snapshot    TEXT,
    asesores_snapshot    TEXT,
    tesistas_snapshot    TEXT,
    activo               BOOLEAN,
    fecha_limite         TIMESTAMPTZ,
    fecha_finalizacion   TIMESTAMPTZ,
    fecha_creacion       TIMESTAMPTZ,
    fecha_modificacion   TIMESTAMPTZ
  )
LANGUAGE SQL
AS $func$
  SELECT
    ht.historial_tema_id,
    ht.tema_id,
    ht.codigo,
    ht.titulo,
    ht.resumen,
    ht.metodologia,
    ht.objetivos,
    ht.descripcion_cambio,
    ht.portafolio_url,
    et.nombre        AS estado_tema_nombre,
    ht.proyecto_id,
    ht.carrera_id,
    ht.subareas_snapshot,
    ht.asesores_snapshot,
    ht.tesistas_snapshot,
    ht.activo,
    ht.fecha_limite,
    ht.fecha_finalizacion,
    ht.fecha_creacion,
    ht.fecha_modificacion
  FROM historial_tema ht
  LEFT JOIN estado_tema et
    ON et.estado_tema_id = ht.estado_tema_id
  WHERE ht.tema_id = p_tema_id
    AND ht.activo = TRUE
  ORDER BY ht.fecha_creacion DESC;
$func$;


CREATE OR REPLACE FUNCTION validar_parametro_por_nombre_carrera(
    p_nombre_parametro TEXT,
    p_carrera_id INTEGER,
    p_usuario_id INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    limite INTEGER;
    cantidad INTEGER;
BEGIN
    -- Get the limit for the parameter and career

    SELECT cp.valor::INTEGER INTO limite
    FROM carrera_parametro_configuracion cp
    JOIN parametro_configuracion p ON p.parametro_configuracion_id = cp.parametro_configuracion_id
    WHERE p.nombre = p_nombre_parametro
      AND cp.carrera_id = p_carrera_id
      AND cp.activo = TRUE
    LIMIT 1;

    IF limite IS NULL THEN
        RETURN TRUE; -- No limit set, allow by default
    END IF;

    -- Count the postulaciones
    IF p_nombre_parametro = 'Limite Postulaciones Alumno' THEN
        SELECT COUNT(*) INTO cantidad
        FROM usuario_tema ut
        JOIN tema t on t.tema_id = ut.tema_id
        JOIN estado_tema et ON et.estado_tema_id = t.estado_tema_id
        WHERE et.nombre = 'PROPUESTO_LIBRE'
        AND ut.usuario_id = p_usuario_id
        AND ut.activo = true;
    ELSEIF p_nombre_parametro = 'Limite Propuestas Alumno' THEN
    -- Count the proposals
        SELECT COUNT(*) INTO cantidad
        FROM usuario_tema ut
        JOIN tema t on t.tema_id = ut.tema_id
        JOIN estado_tema et ON et.estado_tema_id = t.estado_tema_id
        WHERE (et.nombre = 'PROPUESTO_DIRECTO' or et.nombre = 'PROPUESTO_GENERAL')
        AND ut.usuario_id = p_usuario_id
        AND ut.activo = true;
    ELSE
        RETURN TRUE;
    END IF;
    
    RETURN cantidad < limite;
END;
$$ LANGUAGE plpgsql;









CREATE OR REPLACE FUNCTION crear_solicitud_tema_coordinador(
    p_tema_id               INTEGER,
    p_id_usuario_creador    INTEGER,
    p_comentario            TEXT,
    p_tipo_solicitud_nombre TEXT
) RETURNS VOID AS $$
DECLARE
    v_tipo_solicitud_id        INTEGER;
    v_estado_solicitud_id      INTEGER;
    v_rol_remitente_id         INTEGER;
    v_rol_destinatario_id      INTEGER;
    v_accion_pendiente_id      INTEGER;
    v_sin_accion_pendiente_id  INTEGER;
    v_rol_asesor_id            INTEGER;
    v_rol_tesista_id           INTEGER;
    v_solicitud_id             INTEGER;
    v_descripcion              TEXT := COALESCE(p_comentario, p_tipo_solicitud_nombre);
    rec_usuario                RECORD;
BEGIN
    -- 1) Obtener IDs de catálogos
    SELECT ts.tipo_solicitud_id
      INTO v_tipo_solicitud_id
      FROM tipo_solicitud ts
     WHERE ts.nombre = p_tipo_solicitud_nombre;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Tipo de solicitud no configurado: %', p_tipo_solicitud_nombre;
    END IF;

    SELECT es.estado_solicitud_id
      INTO v_estado_solicitud_id
      FROM estado_solicitud es
     WHERE es.nombre = 'PENDIENTE';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Estado de solicitud PENDIENTE no encontrado';
    END IF;

    SELECT rs.rol_solicitud_id
      INTO v_rol_remitente_id
      FROM rol_solicitud rs
     WHERE rs.nombre = 'REMITENTE';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Rol REMITENTE no encontrado';
    END IF;

    SELECT rs.rol_solicitud_id
      INTO v_rol_destinatario_id
      FROM rol_solicitud rs
     WHERE rs.nombre = 'DESTINATARIO';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Rol DESTINATARIO no encontrado';
    END IF;

    SELECT a.accion_solicitud_id
      INTO v_accion_pendiente_id
      FROM accion_solicitud a
     WHERE a.nombre = 'PENDIENTE_ACCION';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Acción PENDIENTE_ACCION no encontrada';
    END IF;

    SELECT a.accion_solicitud_id
      INTO v_sin_accion_pendiente_id
      FROM accion_solicitud a
     WHERE a.nombre = 'SIN_ACCION';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Acción SIN_ACCION no encontrada';
    END IF;

    -- Nuevos: roles Asesor y Tesista
    SELECT r.rol_id
      INTO v_rol_asesor_id
      FROM rol r
     WHERE r.nombre = 'Asesor';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Rol Asesor no encontrado';
    END IF;

    SELECT r.rol_id
      INTO v_rol_tesista_id
      FROM rol r
     WHERE r.nombre = 'Tesista';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Rol Tesista no encontrado';
    END IF;

    -- 2) Insertar la solicitud
    INSERT INTO solicitud (
        descripcion,
        tipo_solicitud_id,
        tema_id,
        estado_solicitud,
        activo,
        fecha_creacion,
        estado
    ) VALUES (
        v_descripcion,
        v_tipo_solicitud_id,
        p_tema_id,
        v_estado_solicitud_id,
        TRUE,
        NOW(),
        1
    )
    RETURNING solicitud_id INTO v_solicitud_id;

    -- 3) Enlazar al creador (rol REMITENTE)
    INSERT INTO usuario_solicitud (
        usuario_id,
        solicitud_id,
        comentario,
        rol_solicitud,
        accion_solicitud,
        activo,
        fecha_creacion
    ) VALUES (
        p_id_usuario_creador,
        v_solicitud_id,
        v_descripcion,
        v_rol_remitente_id,
        v_sin_accion_pendiente_id,
        TRUE,
        NOW()
    );

    -- 4) Enlazar solo a los usuarios asignados con rol Tesista o Asesor
    FOR rec_usuario IN
        SELECT ut.usuario_id
          FROM usuario_tema ut
         WHERE ut.tema_id   = p_tema_id
           AND ut.activo    = TRUE
           AND ut.asignado  = TRUE
           AND ut.rol_id   IN (v_rol_asesor_id, v_rol_tesista_id)
    LOOP
        INSERT INTO usuario_solicitud (
            usuario_id,
            solicitud_id,
            comentario,
            rol_solicitud,
            accion_solicitud,
            activo,
            fecha_creacion
        ) VALUES (
            rec_usuario.usuario_id,
            v_solicitud_id,
            NULL,
            v_rol_destinatario_id,
            v_accion_pendiente_id,
            TRUE,
            NOW()
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION procesar_reenvio_solicitud_aprobacion_tema(p_tema_id INTEGER)
RETURNS VOID AS
$$
DECLARE
    v_estado_pendiente_id    INTEGER;
    v_rol_remitente_id       INTEGER;
    v_rol_destinatario_id    INTEGER;
    v_accion_pendiente_id    INTEGER;
    v_accion_aprobado_id     INTEGER;
BEGIN
    -- 1) IDs de catálogo
    SELECT estado_solicitud_id INTO v_estado_pendiente_id
      FROM estado_solicitud
     WHERE nombre = 'PENDIENTE';

    SELECT rol_solicitud_id INTO v_rol_remitente_id
      FROM rol_solicitud
     WHERE nombre = 'REMITENTE';

    SELECT rol_solicitud_id INTO v_rol_destinatario_id
      FROM rol_solicitud
     WHERE nombre = 'DESTINATARIO';

    SELECT accion_solicitud_id INTO v_accion_pendiente_id
      FROM accion_solicitud
     WHERE nombre = 'PENDIENTE_ACCION';

    SELECT accion_solicitud_id INTO v_accion_aprobado_id
      FROM accion_solicitud
     WHERE nombre = 'APROBADO';

    -- 2) Remitentes → PENDIENTE_ACCION, sólo tipos que comienzan con 'Solicitud de cambio'
    UPDATE usuario_solicitud us
       SET accion_solicitud = v_accion_pendiente_id
      FROM solicitud s
      JOIN tipo_solicitud ts
        ON s.tipo_solicitud_id = ts.tipo_solicitud_id
     WHERE us.solicitud_id      = s.solicitud_id
       AND s.tema_id            = p_tema_id
       AND s.estado_solicitud   = v_estado_pendiente_id
       AND s.activo             = TRUE
       AND us.activo            = TRUE
       AND us.rol_solicitud     = v_rol_remitente_id
       AND ts.nombre LIKE 'Solicitud de cambio%';

    -- 3) Destinatarios → APROBADO, mismo filtro de tipo
    UPDATE usuario_solicitud us
       SET accion_solicitud = v_accion_aprobado_id
      FROM solicitud s
      JOIN tipo_solicitud ts
        ON s.tipo_solicitud_id = ts.tipo_solicitud_id
     WHERE us.solicitud_id      = s.solicitud_id
       AND s.tema_id            = p_tema_id
       AND s.estado_solicitud   = v_estado_pendiente_id
       AND s.activo             = TRUE
       AND us.activo            = TRUE
       AND us.rol_solicitud     = v_rol_destinatario_id
       AND ts.nombre LIKE 'Solicitud de cambio%';

END;
$$ LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION obtener_solicitud_por_tipo_y_tema(
    p_tipo_solicitud_nombre TEXT,
    p_tema_id                INTEGER
)
RETURNS TABLE (
    solicitud_id            INTEGER,
    tipo_solicitud_nombre   TEXT,
    tema_id                 INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
      s.solicitud_id,
      ts.nombre::text      AS tipo_solicitud_nombre,
      s.tema_id
    FROM solicitud s
    JOIN tipo_solicitud ts
      ON s.tipo_solicitud_id = ts.tipo_solicitud_id
    JOIN estado_solicitud es
      ON s.estado_solicitud  = es.estado_solicitud_id
    WHERE ts.nombre    = p_tipo_solicitud_nombre
      AND s.tema_id    = p_tema_id
      AND es.nombre    = 'PENDIENTE'
      AND s.activo     = TRUE;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION listar_solicitudes_con_usuarios(
    p_tema_id   INTEGER,
    p_offset    INTEGER,
    p_limit     INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    resultado JSON;
BEGIN
    SELECT COALESCE(JSON_AGG(item), '[]'::JSON)
    INTO   resultado
    FROM (
        SELECT
            s.solicitud_id,
            s.descripcion,
            ts.nombre            AS tipo_solicitud,
            es.nombre            AS estado_solicitud,
            s.fecha_creacion,                       -- agregado
            s.fecha_modificacion,                   -- agregado
            (
                SELECT COALESCE(JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'usuario_solicitud_id', us2.usuario_solicitud_id,
                        'usuario_id',           us2.usuario_id,
                        'nombres',              u2.nombres,
                        'primer_apellido',      u2.primer_apellido,
                        'segundo_apellido',     u2.segundo_apellido,
                        'codigo',               u2.codigo_pucp,
                        'accion_solicitud',     a.nombre,
                        'rol_solicitud',        rs.nombre,
                        'comentario',           us2.comentario,
                        'fecha_creacion',       us2.fecha_creacion,     -- agregado
                        'fecha_modificacion',   us2.fecha_modificacion  -- agregado
                    )
                ), '[]'::JSON)
                FROM usuario_solicitud us2
                JOIN usuario          u2  ON us2.usuario_id      = u2.usuario_id
                JOIN accion_solicitud a   ON us2.accion_solicitud = a.accion_solicitud_id
                JOIN rol_solicitud   rs   ON us2.rol_solicitud    = rs.rol_solicitud_id
                WHERE us2.solicitud_id = s.solicitud_id
                  AND us2.activo       = TRUE
            ) AS usuarios
        FROM solicitud s
        JOIN tipo_solicitud   ts ON s.tipo_solicitud_id = ts.tipo_solicitud_id
        JOIN estado_solicitud es ON s.estado_solicitud  = es.estado_solicitud_id
        WHERE s.tema_id = p_tema_id
          AND s.activo   = TRUE
        ORDER BY s.fecha_creacion DESC
        OFFSET p_offset
        LIMIT  p_limit
    ) AS item;

    RETURN resultado;
END;
$$;




CREATE OR REPLACE FUNCTION listar_solicitudes_pendientes_por_usuario(
    p_usuario_id INTEGER,
    p_offset     INTEGER,
    p_limit      INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_estado_pendiente INTEGER;
    v_accion_pendiente INTEGER;
    resultado          JSON;
BEGIN
    -- 1) Obtener los IDs de catálogo
    SELECT estado_solicitud_id
      INTO v_estado_pendiente
      FROM estado_solicitud
     WHERE nombre = 'PENDIENTE';

    SELECT accion_solicitud_id
      INTO v_accion_pendiente
      FROM accion_solicitud
     WHERE nombre = 'PENDIENTE_ACCION';

    -- 2) Construir el JSON
    SELECT COALESCE(JSON_AGG(item), '[]'::JSON)
    INTO   resultado
    FROM (
        SELECT
            s.solicitud_id,
            s.descripcion,
            ts.nombre      AS tipo_solicitud,
            es.nombre      AS estado_solicitud,
            s.tema_id,
            s.fecha_creacion,
            s.fecha_modificacion,          -- agregado
            (
                -- Todos los registros de usuario_solicitud activos para esta solicitud,
                -- incluyendo datos del usuario
                SELECT COALESCE(JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'usuario_solicitud_id', us2.usuario_solicitud_id,
                        'usuario_id',           us2.usuario_id,
                        'nombres',              u2.nombres,
                        'primer_apellido',      u2.primer_apellido,
                        'segundo_apellido',     u2.segundo_apellido,
                        'codigo',               u2.codigo_pucp,
                        'accion_solicitud',     a.nombre,
                        'rol_solicitud',        rs.nombre,
                        'comentario',           us2.comentario,
                        'fecha_creacion',       us2.fecha_creacion,
                        'fecha_modificacion',   us2.fecha_modificacion
                    )
                ), '[]'::JSON)
                FROM usuario_solicitud us2
                JOIN usuario          u2  ON us2.usuario_id      = u2.usuario_id
                JOIN accion_solicitud a   ON us2.accion_solicitud = a.accion_solicitud_id
                JOIN rol_solicitud   rs   ON us2.rol_solicitud    = rs.rol_solicitud_id
                WHERE us2.solicitud_id = s.solicitud_id
                  AND us2.activo       = TRUE
            ) AS usuarios
        FROM solicitud s
        JOIN tipo_solicitud   ts ON s.tipo_solicitud_id = ts.tipo_solicitud_id
        JOIN estado_solicitud es ON s.estado_solicitud  = es.estado_solicitud_id
        JOIN usuario_solicitud us ON us.solicitud_id     = s.solicitud_id
        WHERE s.activo             = TRUE
          AND s.estado_solicitud   = v_estado_pendiente
          AND us.usuario_id        = p_usuario_id
          AND us.activo            = TRUE
          AND us.accion_solicitud  = v_accion_pendiente
        GROUP BY
            s.solicitud_id,
            s.descripcion,
            ts.nombre,
            es.nombre,
            s.tema_id,
            s.fecha_creacion,
            s.fecha_modificacion   -- agregado al GROUP BY
        ORDER BY s.fecha_creacion DESC
        OFFSET p_offset
        LIMIT  p_limit
    ) AS item;

    RETURN resultado;
END;
$$;


CREATE OR REPLACE PROCEDURE rechazar_solicitudes_cambio_por_tema(
    p_tema_id INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_estado_pendiente   INTEGER;
    v_estado_rechazado   INTEGER;
    v_accion_rechazado   INTEGER;
BEGIN
    -- 1) Cargar IDs de catálogo
    SELECT estado_solicitud_id
      INTO v_estado_pendiente
      FROM estado_solicitud
     WHERE nombre = 'PENDIENTE';

    SELECT estado_solicitud_id
      INTO v_estado_rechazado
      FROM estado_solicitud
     WHERE nombre = 'RECHAZADA';

    SELECT accion_solicitud_id
      INTO v_accion_rechazado
      FROM accion_solicitud
     WHERE nombre = 'RECHAZADO';

    -- 2) Rechazar las solicitudes de tipo "Solicitud de cambio%" pendientes
    UPDATE solicitud s
       SET estado_solicitud   = v_estado_rechazado,
           fecha_modificacion = NOW()
      FROM tipo_solicitud ts
     WHERE s.tipo_solicitud_id = ts.tipo_solicitud_id
       AND ts.nombre LIKE 'Solicitud de cambio%'
       AND s.tema_id            = p_tema_id
       AND s.estado_solicitud   = v_estado_pendiente
       AND s.activo             = TRUE;

    -- 3) Marcar como RECHAZADO las acciones de usuario_solicitud de esas solicitudes
    UPDATE usuario_solicitud us
       SET accion_solicitud   = v_accion_rechazado,
           fecha_modificacion = NOW()
      FROM solicitud s
     WHERE us.solicitud_id    = s.solicitud_id
       AND s.tipo_solicitud_id IN (
           SELECT tipo_solicitud_id
             FROM tipo_solicitud
            WHERE nombre LIKE 'Solicitud de cambio%'
       )
       AND s.tema_id            = p_tema_id
       AND s.estado_solicitud   = v_estado_rechazado
       AND s.activo             = TRUE
       AND us.activo            = TRUE;
END;
$$;


-- PROCEDURE para aprobar todas las solicitudes de cambio de un tema
CREATE OR REPLACE PROCEDURE aprobar_solicitudes_cambio_por_tema(
    p_tema_id INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_estado_pendiente   INTEGER;
    v_estado_aprobado    INTEGER;
    v_accion_aprobado    INTEGER;
BEGIN
    -- 1) Cargar IDs de catálogo
    SELECT estado_solicitud_id
      INTO v_estado_pendiente
      FROM estado_solicitud
     WHERE nombre = 'PENDIENTE';

    SELECT estado_solicitud_id
      INTO v_estado_aprobado
      FROM estado_solicitud
     WHERE nombre = 'ACEPTADA';

    SELECT accion_solicitud_id
      INTO v_accion_aprobado
      FROM accion_solicitud
     WHERE nombre = 'APROBADO';

    -- 2) Aprobar las solicitudes de tipo "Solicitud de cambio%" pendientes
    UPDATE solicitud s
       SET estado_solicitud   = v_estado_aprobado,
           fecha_modificacion = NOW()
      FROM tipo_solicitud ts
     WHERE s.tipo_solicitud_id = ts.tipo_solicitud_id
       AND ts.nombre LIKE 'Solicitud de cambio%'
       AND s.tema_id            = p_tema_id
       AND s.estado_solicitud   = v_estado_pendiente
       AND s.activo             = TRUE;

    -- 3) Marcar como APROBADO las acciones de usuario_solicitud de esas solicitudes
    UPDATE usuario_solicitud us
       SET accion_solicitud   = v_accion_aprobado,
           fecha_modificacion = NOW()
      FROM solicitud s
     WHERE us.solicitud_id    = s.solicitud_id
       AND s.tipo_solicitud_id IN (
           SELECT tipo_solicitud_id
             FROM tipo_solicitud
            WHERE nombre LIKE 'Solicitud de cambio%'
       )
       AND s.tema_id            = p_tema_id
       AND s.estado_solicitud   = v_estado_aprobado
       AND s.activo             = TRUE
       AND us.activo            = TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION eliminar_tema_completo(
    p_tema_id INTEGER
) RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- 1) Borrar registros en control_exposicion_usuario que dependan
    --    de exposiciones o usuario_tema de este tema
    DELETE FROM control_exposicion_usuario
     WHERE exposicion_x_tema_id IN (
               SELECT exposicion_x_tema_id
                 FROM exposicion_x_tema
                WHERE tema_id = p_tema_id
           )
        OR usuario_x_tema_id IN (
               SELECT usuario_tema_id
                 FROM usuario_tema
                WHERE tema_id = p_tema_id
           );

    -- 2) Borrar filas de exposicion_x_tema vinculadas al tema
    DELETE FROM exposicion_x_tema
     WHERE tema_id = p_tema_id;

    -- 3) Borrar detalles en usuario_solicitud asociados a solicitudes de este tema
    DELETE FROM usuario_solicitud
     WHERE solicitud_id IN (
               SELECT solicitud_id
                 FROM solicitud
                WHERE tema_id = p_tema_id
           );

    -- 4) Borrar las propias solicitudes que apunten a este tema
    DELETE FROM solicitud
     WHERE tema_id = p_tema_id;

    -- 5) Borrar recursos directamente asociados al tema
    DELETE FROM recurso
     WHERE tema_id = p_tema_id;

    -- 6) Borrar historial de cambios de este tema
    DELETE FROM historial_tema
     WHERE tema_id = p_tema_id;

    -- 7) Borrar relaciones entre subáreas y el tema
    DELETE FROM sub_area_conocimiento_tema
     WHERE tema_id = p_tema_id;

    -- 8) Borrar asignaciones en usuario_tema para este tema
    DELETE FROM usuario_tema
     WHERE tema_id = p_tema_id;

    -- 9) Borrar entregables asociados al tema
    DELETE FROM entregable_x_tema
     WHERE tema_id = p_tema_id;

    -- 10) Finalmente, borrar el registro del tema en sí
    DELETE FROM tema
     WHERE tema_id = p_tema_id;

    RAISE NOTICE 'Se ha eliminado el tema % y todas sus dependencias.', p_tema_id;
END;
$$;

CREATE OR REPLACE FUNCTION validar_tesistas_sin_tema_asignado(
    p_tesistas   INTEGER[],
    p_carrera_id INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    tesista_id   INTEGER;
    conflicto    INTEGER;
BEGIN
    FOREACH tesista_id IN ARRAY p_tesistas LOOP
        -- Contamos los registros que violan las reglas
        SELECT COUNT(*) INTO conflicto
        FROM usuario_tema ut
        JOIN tema t
          ON ut.tema_id = t.tema_id
        JOIN estado_tema et
          ON t.estado_tema_id = et.estado_tema_id
        WHERE ut.usuario_id   = tesista_id
          AND ut.activo       = TRUE
          AND ut.asignado     = TRUE
          AND t.activo        = TRUE
          AND t.carrera_id    = p_carrera_id
          AND et.nombre       NOT IN ('FINALIZADO','VENCIDO','PAUSADO');

        IF conflicto > 0 THEN
            RAISE EXCEPTION
                'El tesista % ya está asignado a un tema en otra carrera y en estado no permitido',
                tesista_id;
        END IF;
    END LOOP;
END;
$$;


-- DROP FUNCTION sgtadb.atender_solicitud_alumno_objetivos(int4, int4, text);

CREATE OR REPLACE FUNCTION atender_solicitud_alumno_objetivos(p_solicitud_id integer, p_coordinador_id integer, p_response text)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_tema_id                INTEGER;
    v_current_estado         INTEGER;
    v_accion_aprobado_id     INTEGER;
    v_accion_pendiente_id    INTEGER;
    v_rol_destinatario_id    INTEGER;
    v_rol_remitente_id       INTEGER;
    v_estado_pendiente_id    INTEGER;
	v_objetivos_nuevo TEXT;
	v_estado_solicitud_aceptada  INTEGER;
BEGIN
    IF p_solicitud_id IS NULL THEN
        RAISE EXCEPTION 'Solicitud ID cannot be null';
    END IF;
    -- Obtener IDs necesarios
    SELECT accion_solicitud_id INTO v_accion_aprobado_id
      FROM accion_solicitud WHERE nombre = 'APROBADO';

    SELECT accion_solicitud_id INTO v_accion_pendiente_id
      FROM accion_solicitud WHERE nombre = 'PENDIENTE_ACCION';

    SELECT rol_solicitud_id INTO v_rol_destinatario_id
      FROM rol_solicitud WHERE nombre = 'DESTINATARIO';

    SELECT rol_solicitud_id INTO v_rol_remitente_id
      FROM rol_solicitud WHERE nombre = 'REMITENTE';

    SELECT estado_solicitud_id INTO v_estado_pendiente_id
    FROM estado_solicitud WHERE nombre = 'PENDIENTE';

	SELECT estado_solicitud_id INTO v_estado_solicitud_aceptada
    FROM estado_solicitud WHERE nombre = 'ACEPTADA';

    -- Bloquear solicitud
    SELECT tema_id, estado
      INTO v_tema_id, v_current_estado
      FROM solicitud
     WHERE solicitud_id = p_solicitud_id
       FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No existe solicitud %', p_solicitud_id;
    END IF;

    IF v_current_estado <> v_estado_pendiente_id THEN
        RAISE EXCEPTION 'SOLICITUD %d no esta en estado PENDIENTE', p_solicitud_id;
    END IF;

	select split_part(comentario, '|@@|', 1) into v_objetivos_nuevo 
	from usuario_solicitud
	where solicitud_id = p_solicitud_id 
	  and usuario_id = p_coordinador_id 
	  and rol_solicitud = v_rol_destinatario_id;

    -- Actualizar resumen y solicitud
    UPDATE tema
       SET objetivos            = v_objetivos_nuevo,
           fecha_modificacion = NOW()
     WHERE tema_id = v_tema_id;

    UPDATE solicitud
       SET respuesta          = p_response,
           fecha_modificacion = NOW(),
		   estado_solicitud = v_estado_solicitud_aceptada
     WHERE solicitud_id = p_solicitud_id;

    -- ✅ Actualizar DESTINATARIO (alumno o asesor) a APROBADO + comentario
    UPDATE usuario_solicitud
       SET solicitud_completada = TRUE,
           accion_solicitud  = v_accion_aprobado_id,
           comentario           = p_response,
           fecha_modificacion   = NOW()
     WHERE solicitud_id = p_solicitud_id
       AND rol_solicitud = v_rol_destinatario_id
		AND usuario_id = p_coordinador_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró usuario_solicitud DESTINATARIO para solicitud %', p_solicitud_id;
    END IF;

--borramos las otras solicitudes a los otros coordinadores
	update usuario_solicitud
		set activo = false
		 WHERE solicitud_id = p_solicitud_id
       AND rol_solicitud = v_rol_destinatario_id;

    -- 🔄 Actualizar REMITENTE (coordinador) a PENDIENTE_ACCION + comentario
    UPDATE usuario_solicitud
       SET accion_solicitud  = v_accion_pendiente_id,
           comentario           = p_response,
           fecha_modificacion   = NOW()
     WHERE solicitud_id = p_solicitud_id
       AND rol_solicitud = v_rol_remitente_id;

    RETURN v_current_estado;
END;
$function$
;

-- DROP FUNCTION sgtadb.atender_solicitud_alumno_resumen(int4, int4, text);

CREATE OR REPLACE FUNCTION atender_solicitud_alumno_resumen(p_solicitud_id integer, p_coordinador_id integer, p_response text)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_tema_id                INTEGER;
    v_current_estado         INTEGER;
    v_accion_aprobado_id     INTEGER;
    v_accion_pendiente_id    INTEGER;
    v_rol_destinatario_id    INTEGER;
    v_rol_remitente_id       INTEGER;
    v_estado_pendiente_id    INTEGER;
	v_resumen_nuevo TEXT;
	v_estado_solicitud_aceptada  INTEGER;
BEGIN
    IF p_solicitud_id IS NULL THEN
        RAISE EXCEPTION 'Solicitud ID cannot be null';
    END IF;
    -- Obtener IDs necesarios
    SELECT accion_solicitud_id INTO v_accion_aprobado_id
      FROM accion_solicitud WHERE nombre = 'APROBADO';

    SELECT accion_solicitud_id INTO v_accion_pendiente_id
      FROM accion_solicitud WHERE nombre = 'PENDIENTE_ACCION';

    SELECT rol_solicitud_id INTO v_rol_destinatario_id
      FROM rol_solicitud WHERE nombre = 'DESTINATARIO';

    SELECT rol_solicitud_id INTO v_rol_remitente_id
      FROM rol_solicitud WHERE nombre = 'REMITENTE';

    SELECT estado_solicitud_id INTO v_estado_pendiente_id
    FROM estado_solicitud WHERE nombre = 'PENDIENTE';

	SELECT estado_solicitud_id INTO v_estado_solicitud_aceptada
    FROM estado_solicitud WHERE nombre = 'ACEPTADA';

    -- Bloquear solicitud
    SELECT tema_id, estado
      INTO v_tema_id, v_current_estado
      FROM solicitud
     WHERE solicitud_id = p_solicitud_id
       FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No existe solicitud %', p_solicitud_id;
    END IF;

    IF v_current_estado <> v_estado_pendiente_id THEN
        RAISE EXCEPTION 'SOLICITUD %d no esta en estado PENDIENTE', p_solicitud_id;
    END IF;

	select split_part(comentario, '|@@|', 1) into v_resumen_nuevo 
	from usuario_solicitud
	where solicitud_id = p_solicitud_id 
	  and usuario_id = p_coordinador_id 
	  and rol_solicitud = v_rol_destinatario_id;

    -- Actualizar resumen y solicitud
    UPDATE tema
       SET resumen            = v_resumen_nuevo,
           fecha_modificacion = NOW()
     WHERE tema_id = v_tema_id;

    UPDATE solicitud
       SET respuesta          = p_response,
           fecha_modificacion = NOW(),
		   estado_solicitud = v_estado_solicitud_aceptada
     WHERE solicitud_id = p_solicitud_id;

    -- ✅ Actualizar DESTINATARIO (alumno o asesor) a APROBADO + comentario
    UPDATE usuario_solicitud
       SET solicitud_completada = TRUE,
           accion_solicitud  = v_accion_aprobado_id,
           comentario           = p_response,
           fecha_modificacion   = NOW()
     WHERE solicitud_id = p_solicitud_id
       AND rol_solicitud = v_rol_destinatario_id
		AND usuario_id = p_coordinador_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró usuario_solicitud DESTINATARIO para solicitud %', p_solicitud_id;
    END IF;

--borramos las otras solicitudes a los otros coordinadores
	update usuario_solicitud
		set activo = false
		 WHERE solicitud_id = p_solicitud_id
       AND rol_solicitud = v_rol_destinatario_id;

    -- 🔄 Actualizar REMITENTE (coordinador) a PENDIENTE_ACCION + comentario
    UPDATE usuario_solicitud
       SET accion_solicitud  = v_accion_pendiente_id,
           comentario           = p_response,
           fecha_modificacion   = NOW()
     WHERE solicitud_id = p_solicitud_id
       AND rol_solicitud = v_rol_remitente_id;

    RETURN v_current_estado;
END;
$function$
;

-- DROP FUNCTION sgtadb.atender_solicitud_alumno_subarea(int4, int4, text);

CREATE OR REPLACE FUNCTION atender_solicitud_alumno_subarea(p_solicitud_id integer, p_coordinador_id integer, p_response text)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_tema_id INTEGER;
    v_current_estado INTEGER;
    v_subareas_nuevas TEXT[];
    v_area_actual_id INTEGER;
    v_area_nueva_id INTEGER;
    v_subarea_id INTEGER;
    v_area_subarea INTEGER;
    v_rol_destinatario_id INTEGER;
    v_existe_subarea BOOLEAN;
BEGIN
    -- Validar entrada
    IF p_solicitud_id IS NULL THEN
        RAISE EXCEPTION 'Solicitud ID no puede ser NULL';
    END IF;

    -- Obtener el tema asociado a la solicitud
    SELECT tema_id, estado INTO v_tema_id, v_current_estado
    FROM solicitud
    WHERE solicitud_id = p_solicitud_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No existe la solicitud %', p_solicitud_id;
    END IF;

    -- Obtener ID de rol DESTINATARIO
    SELECT rol_solicitud_id INTO v_rol_destinatario_id
    FROM rol_solicitud
    WHERE nombre = 'DESTINATARIO';

    -- Inactivar todas las subáreas del tema
    UPDATE sub_area_conocimiento_tema
    SET activo = FALSE
    WHERE tema_id = v_tema_id;

    -- Obtener subáreas nuevas desde el comentario del coordinador
    SELECT string_to_array(split_part(comentario, '|@@|', 2), ',')
    INTO v_subareas_nuevas
    FROM usuario_solicitud
    WHERE solicitud_id = p_solicitud_id
      AND usuario_id = p_coordinador_id
      AND rol_solicitud = v_rol_destinatario_id;

    IF v_subareas_nuevas IS NULL OR array_length(v_subareas_nuevas, 1) = 0 THEN
        RAISE EXCEPTION 'No se encontraron subáreas nuevas en el comentario.';
    END IF;

    -- Procesar las subáreas nuevas
    FOREACH v_subarea_id IN ARRAY v_subareas_nuevas LOOP
        
        -- Verificar si ya existe una entrada inactiva
        SELECT EXISTS (
            SELECT 1
            FROM sub_area_conocimiento_tema
            WHERE tema_id = v_tema_id AND subarea_id = v_subarea_id::INTEGER
        ) INTO v_existe_subarea;

        IF v_existe_subarea THEN
            -- Reactivar si ya existe
            UPDATE sub_area_conocimiento_tema
            SET activo = TRUE,fecha_modificacion = now()
            WHERE tema_id = v_tema_id AND subarea_id = v_subarea_id::INTEGER;
        ELSE
            -- Insertar nueva si no existe
            INSERT INTO sub_area_conocimiento_tema (tema_id, subarea_id, activo,fecha_creacion,fecha_modificacion)
            VALUES (v_tema_id, v_subarea_id::INTEGER, TRUE,now(),now());
        END IF;
    END LOOP;

    -- Si el área cambió, actualizar el tema
    IF v_area_nueva_id IS NOT NULL AND v_area_actual_id IS DISTINCT FROM v_area_nueva_id THEN
        UPDATE tema
        SET area_id = v_area_nueva_id,
            fecha_modificacion = NOW()
        WHERE tema_id = v_tema_id;
    END IF;


	 UPDATE solicitud
       SET respuesta          = p_response,
           fecha_modificacion = NOW(),
		   estado_solicitud = v_estado_solicitud_aceptada
     WHERE solicitud_id = p_solicitud_id;

    -- ✅ Actualizar DESTINATARIO (alumno o asesor) a APROBADO + comentario
    UPDATE usuario_solicitud
       SET solicitud_completada = TRUE,
           accion_solicitud  = v_accion_aprobado_id,
           comentario           = p_response,
           fecha_modificacion   = NOW()
     WHERE solicitud_id = p_solicitud_id
       AND rol_solicitud = v_rol_destinatario_id
		AND usuario_id = p_coordinador_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró usuario_solicitud DESTINATARIO para solicitud %', p_solicitud_id;
    END IF;

--borramos las otras solicitudes a los otros coordinadores
	update usuario_solicitud
		set activo = false
		 WHERE solicitud_id = p_solicitud_id
       AND rol_solicitud = v_rol_destinatario_id;

    -- 🔄 Actualizar REMITENTE (coordinador) a PENDIENTE_ACCION + comentario
    UPDATE usuario_solicitud
       SET accion_solicitud  = v_accion_pendiente_id,
           comentario           = p_response,
           fecha_modificacion   = NOW()
     WHERE solicitud_id = p_solicitud_id
       AND rol_solicitud = v_rol_remitente_id;

    RETURN v_current_estado;
END;
$function$
;


-- DROP FUNCTION sgtadb.atender_solicitud_alumno_titulo(int4, int4, text);

CREATE OR REPLACE FUNCTION tender_solicitud_alumno_titulo(p_solicitud_id integer, p_coordinador_id integer, p_response text)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_tema_id                INTEGER;
    v_current_estado         INTEGER;
    v_accion_aprobado_id     INTEGER;
    v_accion_pendiente_id    INTEGER;
    v_rol_destinatario_id    INTEGER;
    v_rol_remitente_id       INTEGER;
    v_estado_pendiente_id    INTEGER;
	v_titulo_nuevo TEXT;
	v_estado_solicitud_aceptada  INTEGER;
BEGIN
    IF p_solicitud_id IS NULL THEN
        RAISE EXCEPTION 'Solicitud ID cannot be null';
    END IF;
    -- Obtener IDs necesarios
    SELECT accion_solicitud_id INTO v_accion_aprobado_id
      FROM accion_solicitud WHERE nombre = 'APROBADO';

    SELECT accion_solicitud_id INTO v_accion_pendiente_id
      FROM accion_solicitud WHERE nombre = 'PENDIENTE_ACCION';

    SELECT rol_solicitud_id INTO v_rol_destinatario_id
      FROM rol_solicitud WHERE nombre = 'DESTINATARIO';

    SELECT rol_solicitud_id INTO v_rol_remitente_id
      FROM rol_solicitud WHERE nombre = 'REMITENTE';

    SELECT estado_solicitud_id INTO v_estado_pendiente_id
    FROM estado_solicitud WHERE nombre = 'PENDIENTE';

	SELECT estado_solicitud_id INTO v_estado_solicitud_aceptada
    FROM estado_solicitud WHERE nombre = 'ACEPTADA';

    -- Bloquear solicitud
    SELECT tema_id, estado
      INTO v_tema_id, v_current_estado
      FROM solicitud
     WHERE solicitud_id = p_solicitud_id
       FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No existe solicitud %', p_solicitud_id;
    END IF;

    IF v_current_estado <> v_estado_pendiente_id THEN
        RAISE EXCEPTION 'SOLICITUD %d no esta en estado PENDIENTE', p_solicitud_id;
    END IF;

	select split_part(comentario, '|@@|', 1) into v_titulo_nuevo 
	from usuario_solicitud
	where solicitud_id = p_solicitud_id 
	  and usuario_id = p_coordinador_id 
	  and rol_solicitud = v_rol_destinatario_id;

    -- Actualizar resumen y solicitud
    UPDATE tema
       SET titulo            = v_titulo_nuevo,
           fecha_modificacion = NOW()
     WHERE tema_id = v_tema_id;

    UPDATE solicitud
       SET respuesta          = p_response,
           fecha_modificacion = NOW(),
		   estado_solicitud = v_estado_solicitud_aceptada
     WHERE solicitud_id = p_solicitud_id;

    -- ✅ Actualizar DESTINATARIO (alumno o asesor) a APROBADO + comentario
    UPDATE usuario_solicitud
       SET solicitud_completada = TRUE,
           accion_solicitud  = v_accion_aprobado_id,
           comentario           = p_response,
           fecha_modificacion   = NOW()
     WHERE solicitud_id = p_solicitud_id
       AND rol_solicitud = v_rol_destinatario_id
		AND usuario_id = p_coordinador_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró usuario_solicitud DESTINATARIO para solicitud %', p_solicitud_id;
    END IF;

--borramos las otras solicitudes a los otros coordinadores
	update usuario_solicitud
		set activo = false
		 WHERE solicitud_id = p_solicitud_id
       AND rol_solicitud = v_rol_destinatario_id;

    -- 🔄 Actualizar REMITENTE (coordinador) a PENDIENTE_ACCION + comentario
    UPDATE usuario_solicitud
       SET accion_solicitud  = v_accion_pendiente_id,
           comentario           = p_response,
           fecha_modificacion   = NOW()
     WHERE solicitud_id = p_solicitud_id
       AND rol_solicitud = v_rol_remitente_id;

    RETURN v_current_estado;
END;
$function$
;