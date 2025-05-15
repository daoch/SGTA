CREATE OR REPLACE FUNCTION listar_temas_propuestos_por_subarea_conocimiento(
	p_subareas_ids integer[],
	p_asesor_id integer)
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
        AND NOT EXISTS (
            SELECT 1
            FROM usuario_tema ut
            WHERE ut.tema_id = t.tema_id
              AND ut.usuario_id = p_asesor_id
        )
    GROUP BY
        t.tema_id, t.titulo, t.resumen, t.metodologia, t.objetivos, 
        r.documento_url, t.activo, t.fecha_limite, t.fecha_creacion, t.fecha_modificacion;
END;
$BODY$;



CREATE OR REPLACE FUNCTION listar_temas_propuestos_al_asesor(
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
    codigo_pucp TEXT,
    creador BOOLEAN
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
      ut.creador
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


DROP TRIGGER IF EXISTS trigger_generar_codigo_tema ON tema;

CREATE TRIGGER trigger_generar_codigo_tema
AFTER INSERT ON tema
FOR EACH ROW
EXECUTE FUNCTION generar_codigo_tema();

CREATE OR REPLACE FUNCTION listar_propuestas_del_tesista_con_usuarios(
    p_tesista_id INTEGER
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
SET search_path = sgtadb, public
AS $$
BEGIN
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
            'asignado',       ut.asignado
          ))
          FROM usuario_tema ut
          JOIN usuario         u  ON u.usuario_id = ut.usuario_id
          JOIN rol             rl ON rl.rol_id     = ut.rol_id
          WHERE ut.tema_id = t.tema_id
            AND rl.nombre ILIKE ANY(ARRAY['Tesista','Asesor','Coasesor'])
        ) AS usuarios
    FROM tema t
    JOIN usuario_tema ut_tesista
      ON ut_tesista.tema_id    = t.tema_id
     AND ut_tesista.usuario_id = p_tesista_id
     AND ut_tesista.rol_id     = (
         SELECT rol_id FROM rol WHERE nombre ILIKE 'Tesista' LIMIT 1
     )
     AND ut_tesista.creador = true
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

ALTER FUNCTION listar_propuestas_del_tesista_con_usuarios(INTEGER) OWNER TO postgres;

CREATE OR REPLACE FUNCTION listar_postulaciones_del_tesista_con_usuarios(
    p_tesista_id INTEGER,
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
    estado_tema_nombre TEXT,    -- current state name
    usuarios           JSONB
)
LANGUAGE plpgsql
SET search_path = sgtadb, public
AS $$
BEGIN
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
                     'comentario', ut.comentario,
                     'creador',         ut.creador,
                     'rechazado',         ut.rechazado,
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

    -- only those temas where this tesista was assigned as Tesista
    JOIN usuario_tema ut_tesista
      ON ut_tesista.tema_id    = t.tema_id
     AND ut_tesista.usuario_id = p_tesista_id
     AND ut_tesista.rol_id     = (
         SELECT rol_id FROM rol
          WHERE nombre ILIKE 'Tesista'
          LIMIT 1
     )
    AND ut_tesista.creador = true
    -- current estado
    LEFT JOIN estado_tema et_current
      ON et_current.estado_tema_id = t.estado_tema_id

    -- initial (creation) estado from historial_tema
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

    -- sub-areas
    LEFT JOIN sub_area_conocimiento_tema sact
      ON sact.tema_id = t.tema_id
    LEFT JOIN sub_area_conocimiento sac
      ON sac.sub_area_conocimiento_id = sact.sub_area_conocimiento_id

    -- recurso (active only)
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

ALTER FUNCTION listar_postulaciones_del_tesista_con_usuarios(INTEGER) OWNER TO postgres;

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
  -- Ensure the user has the "Asesor" role on at least one tema
  JOIN usuario_tema ut
    ON ut.usuario_id = u.usuario_id
   AND ut.rol_id = (
         SELECT rol_id
           FROM rol
          WHERE nombre ILIKE 'Asesor'
          LIMIT 1
       )
WHERE usac.sub_area_conocimiento_id = p_subarea_id
  AND usac.activo = TRUE
  AND tu.nombre ILIKE 'profesor'
$$;

ALTER FUNCTION listar_postulaciones_del_tesista_con_usuarios(INTEGER) OWNER TO postgres;

CREATE OR REPLACE FUNCTION sgtadb.obtener_sub_areas_por_carrera_usuario(
    p_usuario_id INTEGER
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
JOIN area_conocimiento ac
  ON ac.carrera_id = usac.carrera_id
 AND ac.activo = TRUE
JOIN sub_area_conocimiento sac
  ON sac.area_conocimiento_id = ac.area_conocimiento_id
 AND sac.activo = TRUE
WHERE usac.usuario_id = p_usuario_id
  AND usac.activo = TRUE
ORDER BY nombre;
$$;

ALTER FUNCTION obtener_sub_areas_por_carrera_usuario(INTEGER) OWNER TO postgres;

CREATE OR REPLACE FUNCTION aprobar_postulacion_propuesta_general_tesista(
    p_tema_id    INT,
    p_asesor_id  INT,
    p_tesista_id INT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only proceed if the tesista is the creator of this topic
    IF EXISTS (
        SELECT 1
        FROM usuario_tema ut
        JOIN rol r ON r.rol_id = ut.rol_id
        WHERE ut.tema_id = p_tema_id
          AND ut.usuario_id = p_tesista_id
          AND ut.creador = TRUE
          AND r.nombre ILIKE 'Tesista'
    ) THEN
        -- Perform the update to mark the advisor as assigned
        UPDATE usuario_tema ut
        SET asignado = TRUE
        FROM rol r
        WHERE ut.tema_id = p_tema_id
          AND ut.usuario_id = p_asesor_id
          AND ut.rol_id = r.rol_id
          AND r.nombre ILIKE 'Asesor';
    END IF;

    -- Get the estado_tema_id for the tema 
    SELECT estado_tema_id INTO estado_preinscrito_id FROM estado_tema WHERE nombre ILIKE 'PREINSCRITO' LIMIT 1;

	  -- Update estado_tema_id
    UPDATE tema 
    SET estado_tema_id = estado_preinscrito_id
    WHERE tema_id = p_tema_id;
END;
$$;

ALTER FUNCTION aprobar_postulacion_propuesta_general_tesista(INTEGER, INTEGER, INTEGER) OWNER TO postgres;

CREATE OR REPLACE FUNCTION rechazar_postulacion_propuesta_general_tesista(
    p_tema_id    INT,
    p_asesor_id  INT,
    p_tesista_id INT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only proceed if the tesista is the creator of this topic
    IF EXISTS (
        SELECT 1
        FROM usuario_tema ut
        JOIN rol r ON r.rol_id = ut.rol_id
        WHERE ut.tema_id = p_tema_id
          AND ut.usuario_id = p_tesista_id
          AND ut.creador = TRUE
          AND r.nombre ILIKE 'Tesista'
    ) THEN
        -- Perform the update to mark the advisor as rejected
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

ALTER FUNCTION rechazar_postulacion_propuesta_general_tesista(INTEGER, INTEGER, INTEGER) OWNER TO postgres;

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