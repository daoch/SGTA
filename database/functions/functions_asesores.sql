SET search_path TO sgtadb;

--OBTENER LISTA DE CARRERAS POR ID DEL ASESOR
CREATE OR REPLACE FUNCTION obtener_carreras_activas_por_usuario(p_usuario_id INTEGER)
RETURNS SETOF Carrera AS $$
BEGIN
    RETURN QUERY
	Select c.* from Carrera as c
	where c.activo = true
	and c.carrera_id in(select uc.carrera_id
						from usuario_carrera as uc
						where uc.usuario_id = p_usuario_id
						and uc.activo = true);
END;
$$ LANGUAGE plpgsql;
--agregar relacion usuario-sub_areas
CREATE OR REPLACE FUNCTION asignar_usuario_sub_areas(
    p_usuario_id INTEGER,
    p_lista_ids INTEGER[]
)
RETURNS VOID AS $$
DECLARE
    id_sac INTEGER;
BEGIN
    FOREACH id_sac IN ARRAY p_lista_ids LOOP
        -- Primero intentamos actualizar si ya existía
        UPDATE usuario_sub_area_conocimiento
        SET activo = TRUE,
            fecha_modificacion = CURRENT_TIMESTAMP
        WHERE usuario_id = p_usuario_id
          AND sub_area_conocimiento_id = id_sac;

        -- Si no existía, insertamos
        IF NOT FOUND THEN
            INSERT INTO usuario_sub_area_conocimiento (
                usuario_id,
                sub_area_conocimiento_id,
                activo,
                fecha_creacion,
				fecha_modificacion
            ) VALUES (
                p_usuario_id,
                id_sac,
                TRUE,
                CURRENT_TIMESTAMP,
				CURRENT_TIMESTAMP
            );
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;


-- Eliminar relacion usuario_sub_areas
CREATE OR REPLACE FUNCTION desactivar_usuario_sub_areas(
    p_usuario_id INTEGER,
    p_lista_ids INTEGER[]
)
RETURNS VOID AS $$
BEGIN
    UPDATE usuario_sub_area_conocimiento
    SET activo = FALSE,
        fecha_modificacion = CURRENT_TIMESTAMP
    WHERE usuario_id = p_usuario_id
      AND sub_area_conocimiento_id = ANY(p_lista_ids);
END;
$$ LANGUAGE plpgsql;


--agregar relacion usuario-areas
CREATE OR REPLACE FUNCTION asignar_usuario_areas(
    p_usuario_id INTEGER,
    p_lista_ids INTEGER[]
)
RETURNS VOID AS $$
DECLARE
    id_ac INTEGER;
BEGIN
    FOREACH id_ac IN ARRAY p_lista_ids LOOP
        -- Primero intentamos actualizar si ya existía
        UPDATE usuario_area_conocimiento
        SET activo = TRUE,
            fecha_modificacion = CURRENT_TIMESTAMP
        WHERE usuario_id = p_usuario_id
          AND area_conocimiento_id = id_ac;

        -- Si no existía, insertamos
        IF NOT FOUND THEN
            INSERT INTO usuario_area_conocimiento (
                usuario_id,
                area_conocimiento_id,
                activo,
                fecha_creacion,
				fecha_modificacion
            ) VALUES (
                p_usuario_id,
                id_ac,
                TRUE,
                CURRENT_TIMESTAMP,
				CURRENT_TIMESTAMP
            );
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
-- Eliminar relacion usuario_areas
CREATE OR REPLACE FUNCTION desactivar_usuario_areas(
    p_usuario_id INTEGER,
    p_lista_ids INTEGER[]
)
RETURNS VOID AS $$
BEGIN
    UPDATE usuario_area_conocimiento
    SET activo = FALSE,
        fecha_modificacion = CURRENT_TIMESTAMP
    WHERE usuario_id = p_usuario_id
      AND area_conocimiento_id = ANY(p_lista_ids);
END;
$$ LANGUAGE plpgsql;

-- Obtener # de alumnos
CREATE OR REPLACE FUNCTION obtener_numero_tesistas_asesor(
    p_usuario_id INTEGER
)
RETURNS TABLE (
    total INTEGER
) AS $$
BEGIN
    RETURN QUERY
	SELECT
		count(*)::Integer AS total
	FROM
		usuario_tema ut_tesista
		inner join rol r_tesista on ut_tesista.rol_id = r_tesista.rol_id
	WHERE
		lower(r_tesista.nombre) = 'tesista'
		and ut_tesista.activo = TRUE
		and ut_tesista.asignado = TRUE
		and ut_tesista.tema_id in (SELECT
		        t.tema_id
		    FROM tema t
		    INNER JOIN usuario_tema ut_asesor ON ut_asesor.tema_id = t.tema_id
		    INNER JOIN rol r_asesor ON ut_asesor.rol_id = r_asesor.rol_id
		    INNER JOIN estado_tema et ON t.estado_tema_id = et.estado_tema_id
		    -- Confirmar que sea asesor o coasesor activo y asignado
		    WHERE ut_asesor.usuario_id = p_usuario_id
		      AND LOWER(r_asesor.nombre) IN ('asesor', 'coasesor')
		      AND ut_asesor.activo = TRUE
			  AND ut_asesor.asignado = TRUE
			-- Confirmar que el tema esté activo
		      AND t.activo = TRUE
			--  AND t.terminado = TRUE
		      AND LOWER(et.nombre) = 'en_progreso');
END;
$$ LANGUAGE plpgsql;

-- Obtener teistas
CREATE OR REPLACE FUNCTION obtener_tesistas_tema(
    p_tema_id INTEGER
)
RETURNS TABLE (
    nombres TEXT,
	primer_apellido TEXT
) AS $$
BEGIN
    RETURN QUERY
	SELECT
		u.nombres::text,
		u.primer_apellido::text
	FROM
		usuario_tema ut_tesista
		inner join rol r_tesista on ut_tesista.rol_id = r_tesista.rol_id
		inner join usuario u on ut_tesista.usuario_id = u.usuario_id
	WHERE
		lower(r_tesista.nombre) = 'tesista'
		and ut_tesista.activo = TRUE
		and ut_tesista.asignado = TRUE
		and ut_tesista.tema_id = p_tema_id;
END;
$$ LANGUAGE plpgsql;

-- listar proyectos usuario involucrado
CREATE OR REPLACE FUNCTION obtener_proyectos_usuario_involucrado(
    p_usuario_id INTEGER
)
RETURNS TABLE (
    proyecto_id INTEGER,
    titulo VARCHAR,
    anio_inicio VARCHAR,
	estado VARCHAR,
    participantes INTEGER
) AS $$
BEGIN
    RETURN QUERY
	select
		p.proyecto_id,
		p.titulo,
		extract(year from p.fecha_creacion)::bigint::varchar as anio_inicio,
		p.estado,
		count(case when up.activo then 1 end)::int as participantes
	from
		proyecto p
		left join
		usuario_proyecto up ON up.proyecto_id = p.proyecto_id
	where
		p.activo = true
		and p.proyecto_id in (select
									upi.proyecto_id
								from
									usuario_proyecto upi
								where
									upi.usuario_id = p_usuario_id
									and upi.activo = true)
	group by
		p.proyecto_id, p.titulo, extract(year from p.fecha_creacion), p.estado;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION obtener_lista_directorio_asesores_alumno(
    p_usuario_id INTEGER,
    p_busqueda TEXT,
    p_activo BOOLEAN,
    p_areas INT[],
    p_subareas INT[]
)
RETURNS TABLE (
    usuario_id INTEGER,
    nombres TEXT,
    primer_apellido TEXT,
    carrera_nombre TEXT,
    correo_electronico TEXT,
    biografia TEXT,
    foto_perfil BYTEA,
    valor TEXT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT 
        u.usuario_id,
        u.nombres::TEXT,
        u.primer_apellido::TEXT,
        c.nombre::TEXT AS carrera_nombre,
        u.correo_electronico::TEXT,
        u.biografia,
        u.foto_perfil,
        cpc.valor
    FROM usuario u
    JOIN usuario_rol ur ON ur.usuario_id = u.usuario_id
    JOIN rol r ON r.rol_id = ur.rol_id
    JOIN usuario_carrera uc ON uc.usuario_id = u.usuario_id
    JOIN carrera c ON uc.carrera_id = c.carrera_id
    JOIN parametro_configuracion pc ON pc.nombre = 'LimXasesor'
    JOIN carrera_parametro_configuracion cpc ON 
        cpc.parametro_configuracion_id = pc.parametro_configuracion_id
        AND cpc.carrera_id = c.carrera_id
    LEFT JOIN usuario_area_conocimiento uac ON uac.usuario_id = u.usuario_id
    LEFT JOIN area_conocimiento ac ON ac.area_conocimiento_id = uac.area_conocimiento_id
    LEFT JOIN usuario_sub_area_conocimiento usac ON usac.usuario_id = u.usuario_id
    LEFT JOIN sub_area_conocimiento sac ON sac.sub_area_conocimiento_id = usac.sub_area_conocimiento_id
    WHERE lower(r.nombre) = 'asesor'
      AND uc.carrera_id = (
          SELECT carrera_id
          FROM usuario_carrera cuc
          WHERE cuc.usuario_id = p_usuario_id
          LIMIT 1
      )
      AND (
        p_activo IS FALSE
        OR (p_activo IS TRUE AND u.activo = TRUE)
      )
	  AND (
       -- Caso 1: ambas listas vacías → traer todo
      (cardinality(p_areas) = 0 AND cardinality(p_subareas) = 0)

      -- Caso 2: solo áreas tiene valores → filtrar por área
      OR (cardinality(p_areas) > 0 AND cardinality(p_subareas) = 0 AND uac.area_conocimiento_id = ANY(p_areas))

      -- Caso 3: solo subáreas tiene valores → filtrar por subárea
      OR (cardinality(p_subareas) > 0 AND cardinality(p_areas) = 0 AND usac.sub_area_conocimiento_id = ANY(p_subareas))

      -- Caso 4: ambas tienen valores → filtrar por cualquiera
      OR (cardinality(p_areas) > 0 AND cardinality(p_subareas) > 0 AND (
        uac.area_conocimiento_id = ANY(p_areas) OR usac.sub_area_conocimiento_id = ANY(p_subareas)
      ))
     )
      AND (
        CONCAT(u.nombres, ' ', u.primer_apellido, ' ', u.segundo_apellido) ILIKE '%' || p_busqueda || '%'
        OR ac.nombre ILIKE '%' || p_busqueda || '%'
        OR sac.nombre ILIKE '%' || p_busqueda || '%'
      );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validar_tema_existe_cambiar_asesor_posible(p_tema_id INTEGER)
RETURNS BOOLEAN AS
$$
DECLARE
    v_existe BOOLEAN;
BEGIN
    SELECT COUNT(*) > 0 INTO v_existe
    FROM tema t
    INNER JOIN estado_tema et ON et.estado_tema_id = t.estado_tema_id
    WHERE t.tema_id = p_tema_id
      AND et.nombre IN ('INSCRITO', 'REGISTRADO', 'EN_PROGRESO', 'PAUSADO')
	  AND t.activo = TRUE;

    RETURN v_existe;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION es_usuario_alumno(p_usuario_id INTEGER)
RETURNS BOOLEAN AS
$$
DECLARE
    v_es_alumno BOOLEAN;
BEGIN
    SELECT COUNT(*) > 0 INTO v_es_alumno
    FROM usuario u
    INNER JOIN tipo_usuario tu ON u.tipo_usuario_id = tu.tipo_usuario_id
    WHERE u.usuario_id = p_usuario_id
      AND LOWER(tu.nombre) = 'alumno';

    RETURN v_es_alumno;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION es_profesor_asesor(p_usuario_id INTEGER)
RETURNS BOOLEAN AS
$$
DECLARE
    v_es_valido BOOLEAN;
BEGIN
    SELECT COUNT(*) > 0 INTO v_es_valido
    FROM usuario u
    INNER JOIN tipo_usuario tu ON u.tipo_usuario_id = tu.tipo_usuario_id
    INNER JOIN usuario_rol ur ON u.usuario_id = ur.usuario_id
    INNER JOIN rol r ON r.rol_id = ur.rol_id
    WHERE u.usuario_id = p_usuario_id
      AND LOWER(tu.nombre) = 'profesor'
      AND LOWER(r.nombre) = 'asesor';

    RETURN v_es_valido;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION obtener_coordinador_por_carrera_usuario(p_usuario_id INTEGER)
RETURNS INTEGER
LANGUAGE sql AS
$$
    SELECT COALESCE((
        SELECT u.usuario_id
        FROM usuario u
        INNER JOIN usuario_carrera uc ON uc.usuario_id = u.usuario_id
        INNER JOIN tipo_usuario tu ON tu.tipo_usuario_id = u.tipo_usuario_id
        WHERE tu.nombre = 'coordinador'
          AND uc.carrera_id = (
              SELECT uc2.carrera_id
              FROM usuario_carrera uc2
              WHERE uc2.usuario_id = p_usuario_id
              LIMIT 1
          )
        LIMIT 1
    ), -1);
$$;

CREATE OR REPLACE FUNCTION cantidad_coordinador_por_carrera_tema(p_tema_id INT)
RETURNS INT AS $$
DECLARE
	v_cantidad INT;
BEGIN
	SELECT COUNT(1)
	INTO v_cantidad
	FROM usuario_carrera uc
	JOIN carrera c ON uc.carrera_id = c.carrera_id
	WHERE uc.carrera_id = (
		SELECT c2.carrera_id
		FROM tema t
		JOIN carrera c2 ON t.carrera_id = c2.carrera_id
		WHERE t.tema_id = p_tema_id
		AND c2.activo = TRUE
	)
	AND uc.es_coordinador = TRUE
	ANd uc.activo = TRUE;

	RETURN v_cantidad;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_resumen_solicitud_cambio_asesor_usuario(
    p_usuario_id INTEGER,
    p_roles_control TEXT[]
)
RETURNS TABLE (
    solicitud_id INTEGER,
    fecha_creacion TIMESTAMP WITH TIME ZONE,
    tema_id INTEGER,
    titulo TEXT,
    estado_nombre TEXT,
    nombre_alumno TEXT,
    apellido_alumno TEXT,
    correo_alumno TEXT,
    nombre_asesor_actual TEXT,
    apellido_asesor_actual TEXT,
    nombre_asesor_entrada TEXT,
    apellido_asesor_entrada TEXT,
	estado_accion TEXT
)
LANGUAGE sql
AS $$
    SELECT
        s.solicitud_id,
        s.fecha_creacion,
        t.tema_id,
        t.titulo,
        es.nombre,
        us_remitente.nombres AS nombre_alumno,
        us_remitente.primer_apellido AS apellido_alumno,
        us_remitente.correo_electronico AS correo_alumno,
        us_asesor_actual.nombres AS nombre_asesor_actual,
        us_asesor_actual.primer_apellido AS apellido_asesor_actual,
        us_asesor_entrada.nombres AS nombre_asesor_entrada,
        us_asesor_entrada.primer_apellido AS apellido_asesor_entrada,
		accion.nombre AS estado_accion
    FROM
        solicitud s
        INNER JOIN tema t ON t.tema_id = s.tema_id
        INNER JOIN estado_solicitud es ON es.estado_solicitud_id = s.estado_solicitud
		INNER JOIN tipo_solicitud ts ON s.tipo_solicitud_id = ts.tipo_solicitud_id

        LEFT JOIN LATERAL (
            SELECT u.nombres, u.correo_electronico, u.primer_apellido
            FROM usuario_solicitud us
            JOIN usuario u ON u.usuario_id = us.usuario_id
            JOIN rol_solicitud rs ON rs.rol_solicitud_id = us.rol_solicitud
            WHERE us.solicitud_id = s.solicitud_id
              AND rs.nombre = 'REMITENTE'
            LIMIT 1
        ) us_remitente ON true

        LEFT JOIN LATERAL (
            SELECT u.nombres, u.primer_apellido
            FROM usuario_solicitud us
            JOIN usuario u ON u.usuario_id = us.usuario_id
            JOIN rol_solicitud rs ON rs.rol_solicitud_id = us.rol_solicitud
            WHERE us.solicitud_id = s.solicitud_id
              AND rs.nombre = 'ASESOR_ACTUAL'
            LIMIT 1
        ) us_asesor_actual ON true

        LEFT JOIN LATERAL (
            SELECT u.nombres, u.primer_apellido
            FROM usuario_solicitud us
            JOIN usuario u ON u.usuario_id = us.usuario_id
            JOIN rol_solicitud rs ON rs.rol_solicitud_id = us.rol_solicitud
            WHERE us.solicitud_id = s.solicitud_id
              AND rs.nombre = 'ASESOR_ENTRADA'
            LIMIT 1
        ) us_asesor_entrada ON true
		LEFT JOIN LATERAL (
	    	SELECT acs.nombre
	    	FROM usuario_solicitud us
			JOIN rol_solicitud rs on rs.rol_solicitud_id = us.rol_solicitud
	    	JOIN accion_solicitud acs on acs.accion_solicitud_id = us.accion_solicitud
	    	WHERE us.solicitud_id = s.solicitud_id
	      		AND us.usuario_id = p_usuario_id
		  		and rs.nombre = ANY(p_roles_control)
	    	LIMIT 1
		) accion ON true

    WHERE
	s.solicitud_id IN (
        SELECT us_control.solicitud_id
        FROM usuario_solicitud us_control
        INNER JOIN rol_solicitud rs_control ON us_control.rol_solicitud = rs_control.rol_solicitud_id
        WHERE us_control.usuario_id = p_usuario_id
          AND rs_control.nombre = ANY(p_roles_control)
    )
	AND ts.nombre = 'Cambio de asesor (por asesor)'
	ORDER BY s.fecha_creacion DESC
	;
$$;

CREATE OR REPLACE FUNCTION listar_resumen_solicitud_cambio_asesor_coordinador(p_cognito_id TEXT)
RETURNS TABLE (
    solicitud_id INTEGER,
    fecha_creacion TIMESTAMP WITH TIME ZONE,
    tema_id INTEGER,
    titulo TEXT,
    estado_nombre TEXT,
    nombre_alumno TEXT,
    apellido_alumno TEXT,
    correo_alumno TEXT,
    nombre_asesor_actual TEXT,
    apellido_asesor_actual TEXT,
    nombre_asesor_entrada TEXT,
    apellido_asesor_entrada TEXT,
	estado_accion TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.solicitud_id,
        s.fecha_creacion,
        t.tema_id,
        t.titulo::TEXT,
        es.nombre::TEXT,
        us_remitente.nombres::TEXT AS nombre_alumno,
        us_remitente.primer_apellido::TEXT AS apellido_alumno,
        us_remitente.correo_electronico::TEXT AS correo_alumno,
        us_asesor_actual.nombres::TEXT AS nombre_asesor_actual,
        us_asesor_actual.primer_apellido::TEXT AS apellido_asesor_actual,
        us_asesor_entrada.nombres::TEXT AS nombre_asesor_entrada,
        us_asesor_entrada.primer_apellido::TEXT AS apellido_asesor_entrada,
		accion.nombre::TEXT AS estado_accion
    FROM
        solicitud s
        INNER JOIN tema t ON t.tema_id = s.tema_id
        INNER JOIN carrera c ON c.carrera_id = t.carrera_id
        INNER JOIN estado_solicitud es ON es.estado_solicitud_id = s.estado_solicitud
        INNER JOIN tipo_solicitud ts ON s.tipo_solicitud_id = ts.tipo_solicitud_id

        -- Remitente
        LEFT JOIN LATERAL (
            SELECT u.nombres, u.correo_electronico, u.primer_apellido
            FROM usuario_solicitud us
            JOIN usuario u ON u.usuario_id = us.usuario_id
            JOIN rol_solicitud rs ON rs.rol_solicitud_id = us.rol_solicitud
            WHERE us.solicitud_id = s.solicitud_id
              AND rs.nombre = 'REMITENTE'
            LIMIT 1
        ) us_remitente ON true

        -- Asesor actual
        LEFT JOIN LATERAL (
            SELECT u.nombres, u.primer_apellido
            FROM usuario_solicitud us
            JOIN usuario u ON u.usuario_id = us.usuario_id
            JOIN rol_solicitud rs ON rs.rol_solicitud_id = us.rol_solicitud
            WHERE us.solicitud_id = s.solicitud_id
              AND rs.nombre = 'ASESOR_ACTUAL'
            LIMIT 1
        ) us_asesor_actual ON true

        -- Asesor de entrada
        LEFT JOIN LATERAL (
            SELECT u.nombres, u.primer_apellido
            FROM usuario_solicitud us
            JOIN usuario u ON u.usuario_id = us.usuario_id
            JOIN rol_solicitud rs ON rs.rol_solicitud_id = us.rol_solicitud
            WHERE us.solicitud_id = s.solicitud_id
              AND rs.nombre = 'ASESOR_ENTRADA'
            LIMIT 1
        ) us_asesor_entrada ON true

        -- Acción en base al estado
        LEFT JOIN LATERAL (
            SELECT 
                CASE 
                    WHEN es.nombre = 'PENDIENTE' THEN 'PENDIENTE_ACCION'
                    WHEN es.nombre IN ('APROBADA', 'CANCELADA') THEN 'SIN_ACCION'
                END AS nombre
        ) accion ON true

    WHERE
        ts.nombre = 'Cambio de asesor (por asesor)'
        AND t.carrera_id IN (
            SELECT uc.carrera_id
            FROM usuario u
            JOIN usuario_carrera uc ON uc.usuario_id = u.usuario_id
            WHERE u.id_cognito = p_cognito_id
			AND uc.es_coordinador = TRUE
        )
	ORDER BY s.fecha_creacion DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION obtener_detalle_solicitud_cambio_asesor(p_solicitud_id INTEGER)
RETURNS TABLE (
    solicitud_id INTEGER,
    fecha_creacion TIMESTAMP WITH TIME ZONE,
    estado_nombre TEXT,
    descripcion TEXT,
    tema_id INTEGER,
    titulo TEXT,
    remitente_id INTEGER,
    asesor_actual_id INTEGER,
    asesor_entrada_id INTEGER,
    destinatario_id INTEGER,
    fecha_resolucion TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql AS
$$
    SELECT
        s.solicitud_id,
        s.fecha_creacion,
        es.nombre,
        s.descripcion,
        t.tema_id,
        t.titulo,
        us_remitente.usuario_id AS remitente_id,
        us_asesor_actual.usuario_id AS asesor_actual_id,
        us_asesor_entrada.usuario_id AS asesor_entrada_id,
        us_destinatario.usuario_id AS destinatario_id,
        s.fecha_resolucion
    FROM
        solicitud s
        INNER JOIN tema t ON t.tema_id = s.tema_id
        INNER JOIN estado_solicitud es ON es.estado_solicitud_id = s.estado_solicitud
        LEFT JOIN LATERAL (
            SELECT u.usuario_id
            FROM usuario_solicitud us
            JOIN usuario u ON u.usuario_id = us.usuario_id
            JOIN rol_solicitud rs ON rs.rol_solicitud_id = us.rol_solicitud
            WHERE us.solicitud_id = s.solicitud_id AND rs.nombre = 'REMITENTE'
            LIMIT 1
        ) us_remitente ON true
        LEFT JOIN LATERAL (
            SELECT u.usuario_id
            FROM usuario_solicitud us
            JOIN usuario u ON u.usuario_id = us.usuario_id
            JOIN rol_solicitud rs ON rs.rol_solicitud_id = us.rol_solicitud
            WHERE us.solicitud_id = s.solicitud_id AND rs.nombre = 'ASESOR_ACTUAL'
            LIMIT 1
        ) us_asesor_actual ON true
        LEFT JOIN LATERAL (
            SELECT u.usuario_id
            FROM usuario_solicitud us
            JOIN usuario u ON u.usuario_id = us.usuario_id
            JOIN rol_solicitud rs ON rs.rol_solicitud_id = us.rol_solicitud
            WHERE us.solicitud_id = s.solicitud_id AND rs.nombre = 'ASESOR_ENTRADA'
            LIMIT 1
        ) us_asesor_entrada ON true
        LEFT JOIN LATERAL (
            SELECT u.usuario_id
            FROM usuario_solicitud us
            JOIN usuario u ON u.usuario_id = us.usuario_id
            JOIN rol_solicitud rs ON rs.rol_solicitud_id = us.rol_solicitud
            WHERE us.solicitud_id = s.solicitud_id AND rs.nombre = 'DESTINATARIO'
            LIMIT 1
        ) us_destinatario ON true
    WHERE
        s.solicitud_id = p_solicitud_id;
$$;

CREATE OR REPLACE FUNCTION obtener_detalle_usuario_solicitud_cambio_asesor(
    p_usuario_id INTEGER,
    p_solicitud_id INTEGER,
    p_nombre_rol TEXT
)
RETURNS TABLE (
    usuario_id INTEGER,
    nombres TEXT,
    primer_apellido TEXT,
	correo_electronico TEXT,
    foto_perfil TEXT,
    nombre_rol TEXT,
    nombre_accion TEXT,
    fecha_accion TIMESTAMP WITH TIME ZONE,
    comentario TEXT
)
LANGUAGE sql AS
$$
    SELECT
        u.usuario_id,
        u.nombres,
        u.primer_apellido,
		u.correo_electronico,
        u.foto_perfil,
        rs.nombre AS nombre_rol,
        acs.nombre AS nombre_accion,
        us.fecha_accion,
        us.comentario
    FROM
        usuario u
        INNER JOIN usuario_solicitud us ON us.usuario_id = u.usuario_id
        INNER JOIN rol_solicitud rs ON rs.rol_solicitud_id = us.rol_solicitud
        INNER JOIN accion_solicitud acs ON acs.accion_solicitud_id = us.accion_solicitud
    WHERE
        us.usuario_id = p_usuario_id
        AND us.solicitud_id = p_solicitud_id
		AND rs.nombre = p_nombre_rol
	;
$$;

CREATE OR REPLACE FUNCTION puede_usuario_cambiar_solicitud(
    p_usuario_id INTEGER,
    p_nombre_rol TEXT,
    p_solicitud_id INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql AS
$$
DECLARE
    v_existe BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM usuario_solicitud us
        INNER JOIN rol_solicitud rs ON us.rol_solicitud = rs.rol_solicitud_id
		INNER JOIN accion_solicitud acs ON acs.accion_solicitud_id = us.accion_solicitud
		INNER JOIN solicitud s on s.solicitud_id = us.solicitud_id
		INNER JOIN estado_solicitud es on es.estado_solicitud_id = s.estado_solicitud
        WHERE us.usuario_id = p_usuario_id
          AND us.solicitud_id = p_solicitud_id
          AND rs.nombre = p_nombre_rol
          AND acs.nombre = 'PENDIENTE_ACCION'
		  AND es.nombre = 'PENDIENTE'
    ) INTO v_existe;

    RETURN v_existe;
END;
$$;
-- A ELIMINAR
CREATE OR REPLACE PROCEDURE procesar_solicitud_cambio(
    p_usuario_id INTEGER,
    p_nombre_rol TEXT,
    p_solicitud_id INTEGER,
    p_aprobar BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_accion_id INTEGER;
    v_rol_id INTEGER;
    v_estado_id INTEGER;
    v_tema_id INTEGER;
    v_asesor_actual_id INTEGER;
    v_asesor_entrada_id INTEGER;

    -- Campos replicables de usuario_tema
    v_id_tema INTEGER;
    v_id_rol INTEGER;
    v_tipo_rechazo_tema_id INTEGER;
    v_asignado BOOLEAN;
    v_rechazado BOOLEAN;
    v_creador BOOLEAN;
    v_prioridad INTEGER;
	V_comentario TEXT;
	
BEGIN
    -- Obtener el ID del rol_solicitud
    SELECT rol_solicitud_id INTO v_rol_id
    FROM rol_solicitud
    WHERE nombre = p_nombre_rol;

    IF v_rol_id IS NULL THEN
        RAISE EXCEPTION 'Rol % no encontrado', p_nombre_rol;
    END IF;

    -- Obtener el tema_id desde la solicitud
    SELECT tema_id INTO v_tema_id
    FROM solicitud
    WHERE solicitud_id = p_solicitud_id;

    -- Aprobación
    IF p_aprobar THEN
        SELECT accion_solicitud_id INTO v_accion_id
        FROM accion_solicitud
        WHERE nombre = 'APROBADO';

        UPDATE usuario_solicitud
        SET accion_solicitud = v_accion_id,
            fecha_accion = CURRENT_TIMESTAMP
        WHERE usuario_id = p_usuario_id
          AND solicitud_id = p_solicitud_id
          AND rol_solicitud = v_rol_id;

        IF p_nombre_rol = 'DESTINATARIO' THEN
            -- Cambiar estado a ACEPTADA
            SELECT estado_solicitud_id INTO v_estado_id
            FROM estado_solicitud
            WHERE nombre = 'ACEPTADA';

            UPDATE solicitud
            SET estado_solicitud = v_estado_id,
                fecha_resolucion = CURRENT_TIMESTAMP
            WHERE solicitud_id = p_solicitud_id;

            -- Obtener ID del ASESOR_ACTUAL
            SELECT us.usuario_id INTO v_asesor_actual_id
            FROM usuario_solicitud us
            INNER JOIN rol_solicitud rs ON rs.rol_solicitud_id = us.rol_solicitud
            WHERE us.solicitud_id = p_solicitud_id
              AND rs.nombre = 'ASESOR_ACTUAL'
            LIMIT 1;

            -- Obtener ID del ASESOR_ENTRADA
            SELECT us.usuario_id INTO v_asesor_entrada_id
            FROM usuario_solicitud us
            INNER JOIN rol_solicitud rs ON rs.rol_solicitud_id = us.rol_solicitud
            WHERE us.solicitud_id = p_solicitud_id
              AND rs.nombre = 'ASESOR_ENTRADA'
            LIMIT 1;

            -- Obtener datos de la fila actual en usuario_tema (del asesor actual)
            SELECT tema_id, rol_id, tipo_rechazo_tema_id, asignado, rechazado, creador, prioridad, comentario
            INTO v_id_tema, v_id_rol, v_tipo_rechazo_tema_id, v_asignado, v_rechazado, v_creador, v_prioridad, v_comentario
            FROM usuario_tema
            WHERE usuario_id = v_asesor_actual_id
              AND tema_id = v_tema_id
              AND activo = true
            LIMIT 1;

            -- Desactivar al asesor actual
            UPDATE usuario_tema
            SET activo = false,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE usuario_id = v_asesor_actual_id
              AND tema_id = v_tema_id
              AND activo = true;

            -- Insertar nueva fila para asesor de entrada
            INSERT INTO usuario_tema (
                usuario_id,
				tema_id, rol_id, tipo_rechazo_tema_id, asignado, rechazado, creador, prioridad, comentario,
				activo,
                fecha_creacion,
                fecha_modificacion
            ) VALUES (
                v_asesor_entrada_id,
				v_id_tema, v_id_rol, v_tipo_rechazo_tema_id, v_asignado, v_rechazado, v_creador, v_prioridad, v_comentario,
                true,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            );
        END IF;

    -- Rechazo
    ELSE
        SELECT accion_solicitud_id INTO v_accion_id
        FROM accion_solicitud
        WHERE nombre = 'RECHAZADO';

        UPDATE usuario_solicitud
        SET accion_solicitud = v_accion_id,
            fecha_accion = CURRENT_TIMESTAMP
        WHERE usuario_id = p_usuario_id
          AND solicitud_id = p_solicitud_id
          AND rol_solicitud = v_rol_id;
		  
    -- Si el rechazo lo hizo el ASESOR_ACTUAL, marcar al DESTINATARIO como SIN_ACCION
	    IF p_nombre_rol = 'ASESOR_ACTUAL' THEN
	        -- Obtener ID de acción SIN_ACCION
	        SELECT accion_solicitud_id INTO v_accion_id
	        FROM accion_solicitud
	        WHERE nombre = 'SIN_ACCION';
	
	        -- Obtener rol_id de DESTINATARIO
	        SELECT rol_solicitud_id INTO v_rol_id
	        FROM rol_solicitud
	        WHERE nombre = 'DESTINATARIO';
	
	        UPDATE usuario_solicitud
	        SET accion_solicitud = v_accion_id,
	            fecha_accion = CURRENT_TIMESTAMP
	        WHERE solicitud_id = p_solicitud_id
	          AND rol_solicitud = v_rol_id;
	    END IF;
		
        SELECT estado_solicitud_id INTO v_estado_id
        FROM estado_solicitud
        WHERE nombre = 'RECHAZADA';

        UPDATE solicitud
        SET estado_solicitud = v_estado_id,
            fecha_resolucion = CURRENT_TIMESTAMP
        WHERE solicitud_id = p_solicitud_id;
    END IF;

END;
$$;
--
CREATE OR REPLACE PROCEDURE aprobar_solicitud_cambio_asesor_asesor(
    p_id_cognito TEXT,
    p_solicitud_id INTEGER,
    p_comentario TEXT,
    p_rol TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_usuario_id INTEGER;
    v_accion_id INTEGER;
    v_rol_id INTEGER;
BEGIN
    -- Obtener usuario_id desde id_cognito
    SELECT usuario_id INTO v_usuario_id
    FROM usuario
    WHERE id_cognito = p_id_cognito;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario con id_cognito % no encontrado', p_id_cognito;
    END IF;

    -- Obtener el rol_solicitud_id correspondiente a 'ASESOR_ENTRADA' o 'ASESOR_ACTUAL'
    SELECT rol_solicitud_id INTO v_rol_id
    FROM rol_solicitud
    WHERE nombre = p_rol;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Rol % no encontrado', P_ROL;
    END IF;

    -- Obtener acción "APROBADO"
    SELECT accion_solicitud_id INTO v_accion_id
    FROM accion_solicitud
    WHERE nombre = 'APROBADO';

    -- Actualizar la acción en usuario_solicitud
    UPDATE usuario_solicitud
    SET accion_solicitud = v_accion_id,
        fecha_accion = CURRENT_TIMESTAMP,
        comentario = p_comentario
    WHERE usuario_id = v_usuario_id
      AND solicitud_id = p_solicitud_id
      AND rol_solicitud = v_rol_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No se encontró registro en usuario_solicitud para el usuario %, solicitud %, y rol %', v_usuario_id, p_solicitud_id, p_rol;
    END IF;

END;
$$;
--
CREATE OR REPLACE PROCEDURE rechazar_solicitud_cambio_asesor_asesor(
    p_id_cognito TEXT,
    p_solicitud_id INTEGER,
    p_comentario TEXT,
    p_rol TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_usuario_id INTEGER;
    v_accion_rechazado_id INTEGER;
    v_accion_sin_accion_id INTEGER;
    v_rol_id INTEGER;
    v_estado_rechazada_id INTEGER;
	v_accion_pendiente_id INTEGER;
BEGIN
    -- Obtener usuario_id desde id_cognito
    SELECT usuario_id INTO v_usuario_id
    FROM usuario
    WHERE id_cognito = p_id_cognito;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario con id_cognito % no encontrado', p_id_cognito;
    END IF;

	SELECT accion_solicitud_id INTO v_accion_pendiente_id
	FROM accion_solicitud
	WHERE nombre = 'PENDIENTE_ACCION';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Accion PENDIENTE_ACCION no encontrada';
    END IF;

    -- Obtener ID del rol del usuario que actúa
    SELECT rol_solicitud_id INTO v_rol_id
    FROM rol_solicitud
    WHERE nombre = p_rol;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Rol % no encontrado', p_rol;
    END IF;

    -- Obtener ID de acción RECHAZADO
    SELECT accion_solicitud_id INTO v_accion_rechazado_id
    FROM accion_solicitud
    WHERE nombre = 'RECHAZADO';

    -- Obtener ID de acción SIN_ACCIÓN
    SELECT accion_solicitud_id INTO v_accion_sin_accion_id
    FROM accion_solicitud
    WHERE nombre = 'SIN_ACCION';

-- 1. Actualizar al usuario que rechaza
	UPDATE usuario_solicitud
	SET accion_solicitud = v_accion_rechazado_id,
	    fecha_accion = CURRENT_TIMESTAMP,
	    comentario = p_comentario
	WHERE usuario_id = v_usuario_id
	  AND solicitud_id = p_solicitud_id
	  AND rol_solicitud = v_rol_id
	  AND accion_solicitud = v_accion_pendiente_id;
	
	IF NOT FOUND THEN
	    RAISE EXCEPTION 'No se encontró registro en usuario_solicitud para el usuario %, solicitud %, y rol %', v_usuario_id, p_solicitud_id, p_rol;
	END IF;
	
	-- 2. Si el que rechaza es ASESOR_ACTUAL, actualizar al ASESOR_ENTRADA a SIN_ACCIÓN (si aún no actuó)
	IF p_rol = 'ASESOR_ACTUAL' THEN
	    UPDATE usuario_solicitud us
	    SET accion_solicitud = v_accion_sin_accion_id,
	        fecha_accion = CURRENT_TIMESTAMP
	    WHERE us.solicitud_id = p_solicitud_id
	      AND us.accion_solicitud = v_accion_pendiente_id
	      AND us.rol_solicitud = (
	            SELECT rol_solicitud_id FROM rol_solicitud WHERE nombre = 'ASESOR_ENTRADA'
	        );
	END IF;

    -- Cambiar estado de la solicitud a RECHAZADA
    SELECT estado_solicitud_id INTO v_estado_rechazada_id
    FROM estado_solicitud
    WHERE nombre = 'RECHAZADA';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Estado RECHAZADA no encontrado';
    END IF;

    UPDATE solicitud
    SET estado_solicitud = v_estado_rechazada_id,
        fecha_resolucion = CURRENT_TIMESTAMP
    WHERE solicitud_id = p_solicitud_id;

END;
$$;

--
CREATE OR REPLACE PROCEDURE rechazar_solicitud_cambio_asesor_coordinador(
    p_id_cognito TEXT,
    p_solicitud_id INTEGER,
    p_comentario TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_usuario_id INTEGER;
    v_rol_id INTEGER;
    v_accion_id INTEGER;
    v_estado_id INTEGER;
    v_tema_id INTEGER;
    v_carrera_id INTEGER;
    v_existente INTEGER;
	v_accion_pendiente_id INTEGER;
BEGIN
    -- 1. Obtener usuario_id desde id_cognito
    SELECT usuario_id INTO v_usuario_id
    FROM usuario
    WHERE id_cognito = p_id_cognito;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario con id_cognito % no encontrado', p_id_cognito;
    END IF;

    -- 2. Obtener tema_id desde solicitud
    SELECT tema_id INTO v_tema_id
    FROM solicitud
    WHERE solicitud_id = p_solicitud_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Solicitud con ID % no encontrada', p_solicitud_id;
    END IF;

    -- 3. Obtener carrera_id desde tema
    SELECT carrera_id INTO v_carrera_id
    FROM tema
    WHERE tema_id = v_tema_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Tema asociado con ID % no encontrado', v_tema_id;
    END IF;

    -- 4. Verificar que el usuario sea coordinador de esa carrera
    PERFORM 1
    FROM usuario_carrera
    WHERE usuario_id = v_usuario_id
      AND carrera_id = v_carrera_id
      AND es_coordinador = TRUE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El usuario % no es coordinador de la carrera %', v_usuario_id, v_carrera_id;
    END IF;

    -- 5. Obtener rol_solicitud_id de 'DESTINATARIO'
    SELECT rol_solicitud_id INTO v_rol_id
    FROM rol_solicitud
    WHERE nombre = 'DESTINATARIO';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Rol DESTINATARIO no encontrado';
    END IF;

    -- 6. Verificar que no haya un registro previo con rol DESTINATARIO
    SELECT COUNT(*) INTO v_existente
    FROM usuario_solicitud
    WHERE solicitud_id = p_solicitud_id
      AND rol_solicitud = v_rol_id;

    IF v_existente > 0 THEN
        RAISE EXCEPTION 'La solicitud ya ha sido respondida por un asesor';
    END IF;

	-- 6.1. Obtener la accion pendiente accion
	SELECT accion_solicitud_id INTO v_accion_pendiente_id
	FROM accion_solicitud
	WHERE nombre = 'PENDIENTE_ACCION';

    -- 7. Obtener accion_solicitud_id de 'RECHAZADO'
    SELECT accion_solicitud_id INTO v_accion_id
    FROM accion_solicitud
    WHERE nombre = 'RECHAZADO';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Acción RECHAZADO no encontrada';
    END IF;

	-- 7.1. Actualizar (hacer bypass de alguna accion que aún no se realiza
		-- Si algun asesor aún no aprueba y el coordinador lo aprobó
	UPDATE usuario_solicitud
	SET accion_solicitud = v_accion_id,
	    comentario = 'Rechazado por el coordinador',
	    fecha_accion = CURRENT_TIMESTAMP
	WHERE solicitud_id = p_solicitud_id
	  AND accion_solicitud = v_accion_pendiente_id
	  AND rol_solicitud IN (
	        SELECT rol_solicitud_id
	        FROM rol_solicitud
	        WHERE nombre IN ('ASESOR_ACTUAL', 'ASESOR_ENTRADA')
	  );

    -- 8. Insertar en usuario_solicitud
    INSERT INTO usuario_solicitud (
        usuario_id,
        solicitud_id,
        rol_solicitud,
        accion_solicitud,
        comentario,
        fecha_accion
    ) VALUES (
        v_usuario_id,
        p_solicitud_id,
        v_rol_id,
        v_accion_id,
        p_comentario,
        CURRENT_TIMESTAMP
    );

    -- 9. Cambiar estado de la solicitud a 'RECHAZADA'
    SELECT estado_solicitud_id INTO v_estado_id
    FROM estado_solicitud
    WHERE nombre = 'RECHAZADA';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Estado RECHAZADA no encontrado';
    END IF;

    UPDATE solicitud
    SET estado_solicitud = v_estado_id,
        fecha_resolucion = CURRENT_TIMESTAMP
    WHERE solicitud_id = p_solicitud_id;

END;
$$;
--
CREATE OR REPLACE PROCEDURE aprobar_solicitud_cambio_asesor_coordinador(
    p_id_cognito TEXT,
    p_solicitud_id INTEGER,
    p_comentario TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_usuario_id INTEGER;
    v_rol_id_destinatario INTEGER;
    v_accion_id INTEGER;
    v_estado_id INTEGER;
    v_tema_id INTEGER;
    v_carrera_id INTEGER;
    v_existente INTEGER;
    v_asesor_actual_id INTEGER;
    v_asesor_entrada_id INTEGER;
	v_accion_pendiente_id INTEGER;
    -- Campos replicables de usuario_tema
    v_id_tema INTEGER;
    v_id_rol INTEGER;
    v_tipo_rechazo_tema_id INTEGER;
    v_asignado BOOLEAN;
    v_rechazado BOOLEAN;
    v_prioridad INTEGER;
    v_comentario TEXT;
BEGIN
    -- 1. Obtener usuario_id desde id_cognito
    SELECT usuario_id INTO v_usuario_id
    FROM usuario
    WHERE id_cognito = p_id_cognito;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario con id_cognito % no encontrado', p_id_cognito;
    END IF;

    -- 2. Obtener tema_id desde solicitud
    SELECT tema_id INTO v_tema_id
    FROM solicitud
    WHERE solicitud_id = p_solicitud_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Solicitud con ID % no encontrada', p_solicitud_id;
    END IF;

    -- 3. Obtener carrera_id desde tema
    SELECT carrera_id INTO v_carrera_id
    FROM tema
    WHERE tema_id = v_tema_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Tema con ID % no encontrado', v_tema_id;
    END IF;

    -- 4. Verificar que el usuario es coordinador de esa carrera
    PERFORM 1
    FROM usuario_carrera
    WHERE usuario_id = v_usuario_id
      AND carrera_id = v_carrera_id
      AND es_coordinador = TRUE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El usuario % no es coordinador de la carrera %', v_usuario_id, v_carrera_id;
    END IF;

    -- 5. Obtener rol_solicitud_id de 'DESTINATARIO'
    SELECT rol_solicitud_id INTO v_rol_id_destinatario
    FROM rol_solicitud
    WHERE nombre = 'DESTINATARIO';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Rol DESTINATARIO no encontrado';
    END IF;

    -- 6. Verificar que no exista ya una respuesta del destinatario
    SELECT COUNT(*) INTO v_existente
    FROM usuario_solicitud
    WHERE solicitud_id = p_solicitud_id
      AND rol_solicitud = v_rol_id_destinatario;

    IF v_existente > 0 THEN
        RAISE EXCEPTION 'La solicitud ya ha sido respondida por un asesor';
    END IF;

	-- 6.1. Obtener la accion pendiente accion
	SELECT accion_solicitud_id INTO v_accion_pendiente_id
	FROM accion_solicitud
	WHERE nombre = 'PENDIENTE_ACCION';

    -- 7. Obtener accion_solicitud_id de 'APROBADO'
    SELECT accion_solicitud_id INTO v_accion_id
    FROM accion_solicitud
    WHERE nombre = 'APROBADO';

	-- 7.1. Actualizar (hacer bypass de alguna accion que aún no se realiza
		-- Si algun asesor aún no aprueba y el coordinador lo aprobó
	UPDATE usuario_solicitud
	SET accion_solicitud = v_accion_id,
	    comentario = 'Aprobado por el coordinador',
	    fecha_accion = CURRENT_TIMESTAMP
	WHERE solicitud_id = p_solicitud_id
	  AND accion_solicitud = v_accion_pendiente_id
	  AND rol_solicitud IN (
	        SELECT rol_solicitud_id
	        FROM rol_solicitud
	        WHERE nombre IN ('ASESOR_ACTUAL', 'ASESOR_ENTRADA')
	  );

    -- 8. Insertar usuario_solicitud como DESTINATARIO
    INSERT INTO usuario_solicitud (
        usuario_id,
        solicitud_id,
        rol_solicitud,
        accion_solicitud,
        comentario,
        fecha_accion
    ) VALUES (
        v_usuario_id,
        p_solicitud_id,
        v_rol_id_destinatario,
        v_accion_id,
        p_comentario,
        CURRENT_TIMESTAMP
    );

    -- 9. Cambiar estado de la solicitud a 'ACEPTADA'
    SELECT estado_solicitud_id INTO v_estado_id
    FROM estado_solicitud
    WHERE nombre = 'ACEPTADA';

    UPDATE solicitud
    SET estado_solicitud = v_estado_id,
        fecha_resolucion = CURRENT_TIMESTAMP
    WHERE solicitud_id = p_solicitud_id;

    -- 10. Obtener ASESOR_ACTUAL
    SELECT us.usuario_id INTO v_asesor_actual_id
    FROM usuario_solicitud us
    JOIN rol_solicitud rs ON rs.rol_solicitud_id = us.rol_solicitud
    WHERE us.solicitud_id = p_solicitud_id
      AND rs.nombre = 'ASESOR_ACTUAL'
    LIMIT 1;

    -- 11. Obtener ASESOR_ENTRADA
    SELECT us.usuario_id INTO v_asesor_entrada_id
    FROM usuario_solicitud us
    JOIN rol_solicitud rs ON rs.rol_solicitud_id = us.rol_solicitud
    WHERE us.solicitud_id = p_solicitud_id
      AND rs.nombre = 'ASESOR_ENTRADA'
    LIMIT 1;

    -- 12. Obtener datos del asesor actual en usuario_tema
    SELECT tema_id, rol_id, tipo_rechazo_tema_id, asignado, rechazado, prioridad, comentario
    INTO v_id_tema, v_id_rol, v_tipo_rechazo_tema_id, v_asignado, v_rechazado, v_prioridad, v_comentario
    FROM usuario_tema
    WHERE usuario_id = v_asesor_actual_id
      AND tema_id = v_tema_id
      AND activo = true
    LIMIT 1;

    -- 13. Desactivar fila de usuario_tema del asesor actual
    UPDATE usuario_tema
    SET activo = false,
        fecha_modificacion = CURRENT_TIMESTAMP
    WHERE usuario_id = v_asesor_actual_id
      AND tema_id = v_tema_id
      AND activo = true;

    -- 14. Insertar nueva fila para el asesor de entrada
    INSERT INTO usuario_tema (
        usuario_id,
        tema_id,
        rol_id,
        tipo_rechazo_tema_id,
        asignado,
        rechazado,
        prioridad,
        comentario,
        activo,
        fecha_creacion,
        fecha_modificacion
    ) VALUES (
        v_asesor_entrada_id,
        v_id_tema,
        v_id_rol,
        v_tipo_rechazo_tema_id,
        v_asignado,
        v_rechazado,
        v_prioridad,
        v_comentario,
        true,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

END;
$$;
--
CREATE OR REPLACE FUNCTION obtener_temas_por_alumno(p_id_alumno INTEGER)
RETURNS TABLE (
  idTema INTEGER,
  titulo TEXT,
  estado TEXT,
  areasTematicas TEXT,
  idAsesor INTEGER[],
  lista_rol TEXT[],
  idCreador INTEGER
) AS $$
BEGIN
  RETURN QUERY
SELECT
    t.tema_id AS "idTema",
    t.titulo::TEXT,
    et.nombre::TEXT,
    STRING_AGG(DISTINCT ac.nombre, ', ')::TEXT AS "areasTematicas",
    ARRAY_AGG(DISTINCT ut_asesor.usuario_id order by ut_asesor.usuario_id) AS "idAsesor",
	ARRAY_AGG(r.nombre::TEXT order by ut_asesor.usuario_id),
	tabla_creador.usuario_id
  FROM tema t
  JOIN estado_tema et ON t.estado_tema_id = et.estado_tema_id
  JOIN usuario_tema uta ON uta.tema_id = t.tema_id
  left JOIN usuario_tema ut_asesor ON ut_asesor.tema_id = t.tema_id AND (ut_asesor.rol_id = 1 OR ut_asesor.rol_id = 5) AND ut_asesor.activo = TRUE
  left join rol r on r.rol_id = ut_asesor.rol_id
  left JOIN sub_area_conocimiento_tema tsac ON tsac.tema_id = t.tema_id 
  left JOIN sub_area_conocimiento sac ON sac.sub_area_conocimiento_id = tsac.sub_area_conocimiento_id
  left JOIN area_conocimiento ac ON ac.area_conocimiento_id = sac.area_conocimiento_id
  left join lateral(
  	select 
		ut1.usuario_id
	from
		usuario_tema ut1
	where
		ut1.tema_id = t.tema_id
		and creador = true
  ) tabla_creador on true
  WHERE et.nombre IN ('INSCRITO', 'REGISTRADO', 'EN_PROGRESO', 'PAUSADO')
  AND uta.usuario_id = p_id_alumno
  AND uta.rol_id = 4
  AND uta.activo = TRUE
  AND t.activo = TRUE
  GROUP BY t.tema_id, t.titulo, et.nombre, tabla_creador.usuario_id;
END;
$$ LANGUAGE plpgsql;
--
CREATE OR REPLACE FUNCTION obtener_perfil_usuario(p_usuario_id INTEGER)
RETURNS TABLE (
	usuario_id INTEGER,
	nombres TEXT,
	primer_apellido TEXT,
	correo_electronico TEXT,
	enlace_linkedin TEXT,
	enlace_repositorio TEXT,
	biografia TEXT,
	foto_perfil BYTEA,
	lista_carreras_id INTEGER[],
	lista_carreras TEXT[],
	limite_tesistas_carrera TEXT[],
	es_asesor BOOLEAN
) AS $$
BEGIN
	RETURN QUERY
	SELECT
		u.usuario_id,
		u.nombres::TEXT,
		u.primer_apellido::TEXT,
		u.correo_electronico::TEXT,
		u.enlace_linkedin::TEXT,
		u.enlace_repositorio::TEXT,
		u.biografia,
		u.foto_perfil,
		ARRAY_AGG(c.carrera_id ORDER BY c.carrera_id) AS lista_carreras_id,
		ARRAY_AGG(c.nombre::TEXT ORDER BY c.carrera_id) AS lista_carreras,
		ARRAY_AGG(cpc.valor ORDER BY c.carrera_id) AS limite_tesistas_carrera,
		(tu.nombre = 'profesor' or tu.nombre = 'administrador') as es_profesor
	FROM
		usuario u
		join tipo_usuario tu on tu.tipo_usuario_id = u.tipo_usuario_id
		JOIN usuario_carrera uc ON u.usuario_id = uc.usuario_id
		JOIN carrera c ON uc.carrera_id = c.carrera_id
		JOIN carrera_parametro_configuracion cpc ON cpc.carrera_id = c.carrera_id
		JOIN parametro_configuracion pc ON pc.parametro_configuracion_id = cpc.parametro_configuracion_id
	WHERE
		u.usuario_id = p_usuario_id
		AND pc.nombre = 'LimXasesor'
		AND u.activo = true
		AND uc.activo = true
		AND c.activo = true
		AND cpc.activo = true
		AND pc.activo = true
	GROUP BY
		u.usuario_id,
		u.nombres,
		u.primer_apellido,
		u.correo_electronico,
		u.enlace_linkedin,
		u.enlace_repositorio,
		u.biografia,
		u.foto_perfil,
		tu.nombre
;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_sub_areas_conocimiento_perfil_por_usuario(p_usuario_id INTEGER)
RETURNS TABLE (
    sub_area_conocimiento_id INTEGER,
    sub_area_nombre TEXT,
    area_conocimiento_id INTEGER,
    area_nombre TEXT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        sac.sub_area_conocimiento_id,
        sac.nombre::TEXT AS sub_area_nombre,
        ac.area_conocimiento_id,
        ac.nombre::TEXT AS area_nombre
    FROM
        sub_area_conocimiento sac
        JOIN usuario_sub_area_conocimiento usac
            ON sac.sub_area_conocimiento_id = usac.sub_area_conocimiento_id
        JOIN area_conocimiento ac
            ON sac.area_conocimiento_id = ac.area_conocimiento_id
    WHERE
        usac.usuario_id = p_usuario_id
        AND usac.activo = true
        AND sac.activo = true;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION listar_areas_conocimiento_perfil_por_usuario(p_usuario_id INTEGER)
RETURNS TABLE (
    area_conocimiento_id INTEGER,
    nombre TEXT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        ac.area_conocimiento_id,
        ac.nombre::TEXT
    FROM
        area_conocimiento ac
        JOIN usuario_area_conocimiento uac
            ON ac.area_conocimiento_id = uac.area_conocimiento_id
    WHERE
        uac.usuario_id = p_usuario_id
        AND ac.activo = true
        AND uac.activo = true;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION listar_enlaces_usuario(p_usuario_id INTEGER)
RETURNS TABLE (
    enlace_usuario_id INTEGER,
    plataforma TEXT,
    enlace TEXT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        eu.enlace_usuario_id,
        eu.plataforma::TEXT,
        eu.enlace::TEXT
    FROM
        enlace_usuario eu
    WHERE
        eu.usuario_id = p_usuario_id
        AND eu.activo = true;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION obtener_id_cognito_por_usuario(p_usuario_id INTEGER)
RETURNS TEXT
AS $$
BEGIN
    RETURN (
        SELECT u.id_cognito
        FROM usuario u
        WHERE u.usuario_id = p_usuario_id
    );
END;
$$ LANGUAGE plpgsql STABLE;
--
CREATE OR REPLACE FUNCTION obtener_temas_usuario_asesor(p_usuario_id INTEGER)
RETURNS TABLE (
    tema_id INTEGER,
    titulo_tema TEXT,
    anio_finalizacion TEXT,
    etapa_formativa TEXT,
    nombre_ciclo TEXT,
    estado_tema TEXT,
    proyecto_id INTEGER,
    titulo_proyecto TEXT,
    rol_asesor TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH temas_del_asesor AS (
        SELECT
            t.tema_id,
			upper(r.nombre) AS rol_asesor
        FROM
            tema t
            JOIN usuario_tema ut ON ut.tema_id = t.tema_id
            JOIN rol r ON ut.rol_id = r.rol_id
            JOIN estado_tema et ON t.estado_tema_id = et.estado_tema_id
        WHERE
            ut.usuario_id = p_usuario_id
            AND ut.activo = TRUE
            AND ut.asignado = TRUE
            AND LOWER(r.nombre) IN ('asesor', 'coasesor')
            AND t.activo = TRUE
            AND UPPER(et.nombre) IN ('EN_PROGRESO', 'FINALIZADO')
    )
    SELECT DISTINCT ON (efcxt.tema_id)
        efcxt.tema_id,
        t.titulo::TEXT AS titulo_tema,
        EXTRACT(YEAR FROM t.fecha_finalizacion)::BIGINT::TEXT AS anio_finalizacion,
        ef.nombre::TEXT AS etapa_formativa,
        c.nombre::TEXT AS nombre_ciclo,
        et.nombre::TEXT AS estado_tema,
        p.proyecto_id,
        p.titulo::TEXT AS titulo_proyecto,
		ta.rol_asesor::TEXT
    FROM
        etapa_formativa_x_ciclo_x_tema efcxt
        JOIN etapa_formativa_x_ciclo efc ON efc.etapa_formativa_x_ciclo_id = efcxt.etapa_formativa_x_ciclo_id
        JOIN ciclo c ON c.ciclo_id = efc.ciclo_id
        JOIN etapa_formativa ef ON ef.etapa_formativa_id = efc.etapa_formativa_id
        JOIN tema t ON t.tema_id = efcxt.tema_id
        JOIN estado_tema et ON t.estado_tema_id = et.estado_tema_id
        LEFT JOIN proyecto p ON p.proyecto_id = t.proyecto_id
        JOIN temas_del_asesor ta ON ta.tema_id = t.tema_id
    WHERE
        efcxt.activo IS TRUE
    ORDER BY
        efcxt.tema_id,
        c.fecha_inicio DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION obtener_usuario_id_por_cognito_id(p_cognito_id TEXT)
RETURNS INTEGER
AS $$
BEGIN
    RETURN (
        SELECT u.usuario_id
        FROM usuario u
        WHERE u.id_cognito = p_cognito_id
    );
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION obtener_solicitudes_cese_tema_resumen(
    p_usuario_id INTEGER,
    p_roles TEXT[]
)
RETURNS TABLE (
    solicitud_id INTEGER,
    tema_id INTEGER,
    titulo TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE,
    estado_solicitud TEXT,
    alumno_nombres TEXT,
    alumno_apellido TEXT,
    alumno_correo TEXT,
    asesor_nombres TEXT,
    asesor_apellido TEXT,
    nombre_accion TEXT
) AS
$$
BEGIN
  RETURN QUERY
  WITH temas_involucrado AS (
    SELECT ut.tema_id
    FROM usuario_tema ut
    JOIN rol r ON ut.rol_id = r.rol_id
    WHERE ut.usuario_id = p_usuario_id
      AND ut.activo = true
      AND r.nombre = ANY(p_roles)
  )
  SELECT 
    s.solicitud_id,
    t.tema_id,
    t.titulo::text,
    s.fecha_creacion,
    es.nombre::text AS estado_solicitud,
    us_remitente.nombres::text AS alumno_nombres,
    us_remitente.primer_apellido::text AS alumno_apellido,
    us_remitente.correo_electronico::text AS alumno_correo,
    us_asesor_actual.nombres::text AS asesor_nombres,
    us_asesor_actual.primer_apellido::text AS asesor_apellido,
    COALESCE(us_usuario_propio.nombre::text, 'SIN_ACCION') AS nombre_accion
  FROM
    usuario_solicitud us
    JOIN solicitud s ON s.solicitud_id = us.solicitud_id
    JOIN tipo_solicitud ts ON s.tipo_solicitud_id = ts.tipo_solicitud_id
    JOIN estado_solicitud es ON es.estado_solicitud_id = s.estado_solicitud
    JOIN tema t ON t.tema_id = s.tema_id
    JOIN temas_involucrado ti ON t.tema_id = ti.tema_id

    LEFT JOIN LATERAL (
        SELECT u.nombres, u.correo_electronico, u.primer_apellido
        FROM usuario_solicitud us2
        JOIN usuario u ON u.usuario_id = us2.usuario_id
        JOIN rol_solicitud rs ON rs.rol_solicitud_id = us2.rol_solicitud
        WHERE us2.solicitud_id = s.solicitud_id
          AND rs.nombre = 'REMITENTE'
        LIMIT 1
    ) us_remitente ON true

    LEFT JOIN LATERAL (
        SELECT u.nombres, u.primer_apellido
        FROM usuario_tema ut
        JOIN usuario u ON u.usuario_id = ut.usuario_id
        JOIN rol r ON r.rol_id = ut.rol_id
        WHERE ut.activo = true
          AND ut.asignado = true
          AND r.nombre = 'Asesor'
          AND ut.tema_id = t.tema_id
        LIMIT 1
    ) us_asesor_actual ON true

    LEFT JOIN LATERAL (
        SELECT as2.nombre
        FROM usuario_solicitud us3
        JOIN accion_solicitud as2 ON as2.accion_solicitud_id = us3.accion_solicitud
        WHERE us3.usuario_id = p_usuario_id
          AND us3.solicitud_id = s.solicitud_id
        LIMIT 1
    ) us_usuario_propio ON true

  WHERE
    ts.nombre = 'Cese de tema';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION obtener_detalle_solicitud_cese(
    p_solicitud_id INTEGER
)
RETURNS TABLE (
    solicitud_id INTEGER,
    fecha_creacion TIMESTAMP WITH TIME ZONE,
    estado_nombre TEXT,
    descripcion TEXT,
    tema_id INTEGER,
    titulo TEXT,
    fecha_resolucion TIMESTAMP WITH TIME ZONE,
    remitente_id INTEGER,
    coordinador_id INTEGER,
    asesor_actual_id INTEGER
)
LANGUAGE sql
AS $$
    SELECT
        s.solicitud_id,
        s.fecha_creacion,
        es.nombre::TEXT,
        s.descripcion::TEXT,
        t.tema_id,
        t.titulo::TEXT,
        s.fecha_resolucion,
        remitente.usuario_id,
        coordinador.usuario_id,
        asesor_actual.usuario_id
    FROM solicitud s
    JOIN estado_solicitud es 
        ON s.estado_solicitud = es.estado_solicitud_id
    JOIN tema t 
        ON t.tema_id = s.tema_id
    LEFT JOIN LATERAL (
        SELECT u.usuario_id
        FROM usuario_solicitud us
        JOIN usuario u ON u.usuario_id = us.usuario_id
        JOIN rol_solicitud rs ON rs.rol_solicitud_id = us.rol_solicitud
        WHERE us.solicitud_id = s.solicitud_id AND rs.nombre = 'REMITENTE'
        LIMIT 1
    ) remitente ON true
    LEFT JOIN LATERAL (
        SELECT u.usuario_id
        FROM usuario_solicitud us
        JOIN usuario u ON u.usuario_id = us.usuario_id
        JOIN rol_solicitud rs ON rs.rol_solicitud_id = us.rol_solicitud
        WHERE us.solicitud_id = s.solicitud_id AND rs.nombre = 'DESTINATARIO'
        LIMIT 1
    ) coordinador ON true
    LEFT JOIN LATERAL (
        SELECT u.usuario_id
        FROM usuario_tema ut
        JOIN usuario u ON u.usuario_id = ut.usuario_id
        JOIN rol r ON r.rol_id = ut.rol_id
        WHERE ut.activo = true
          AND ut.asignado = true
          AND r.nombre = 'Asesor'
          AND ut.tema_id = t.tema_id
        LIMIT 1
    ) asesor_actual ON true
    WHERE s.solicitud_id = p_solicitud_id;
$$;

CREATE OR REPLACE FUNCTION obtener_perfil_asesor_cese(
    p_usuario_id INTEGER
)
RETURNS TABLE (
    usuario_id INTEGER,
    nombres TEXT,
    primer_apellido TEXT,
    correo_electronico TEXT,
    foto_perfil BYTEA
)
LANGUAGE sql
AS $$
    SELECT
        u.usuario_id,
        u.nombres::TEXT,
        u.primer_apellido::TEXT,
        u.correo_electronico::TEXT,
        u.foto_perfil
    FROM usuario u
    WHERE u.usuario_id = p_usuario_id;
$$;

CREATE OR REPLACE PROCEDURE procesar_estado_tema_retiro_alumno(
    p_id_alumno INTEGER,
    p_id_tema INTEGER,
    p_id_creador INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_estado_id INTEGER;
    v_num_alumnos INTEGER;
BEGIN
    -- Contar cuántos alumnos/tesistas hay en el tema
    SELECT COUNT(*) INTO v_num_alumnos
    FROM usuario_tema ut
    JOIN rol r ON r.rol_id = ut.rol_id
    WHERE ut.tema_id = p_id_tema
      AND r.nombre IN ('Tesista', 'Alumno')
      AND ut.activo = true
	  AND ut.asignado = true
;

    -- CASO 1: único alumno y NO es creador
    IF v_num_alumnos = 1 AND p_id_alumno != p_id_creador THEN
        SELECT estado_tema_id INTO v_estado_id
        FROM estado_tema WHERE nombre = 'PROPUESTO_LIBRE';

        UPDATE tema
        SET estado_tema_id = v_estado_id,
            fecha_modificacion = CURRENT_TIMESTAMP
        WHERE tema_id = p_id_tema;

        UPDATE usuario_tema
        SET activo = false
        WHERE usuario_id = p_id_alumno AND tema_id = p_id_tema;

    -- CASO 2: único alumno y ES creador
    ELSIF v_num_alumnos = 1 AND p_id_alumno = p_id_creador THEN
        SELECT estado_tema_id INTO v_estado_id
        FROM estado_tema WHERE nombre = 'VENCIDO';

        UPDATE tema
        SET estado_tema_id = v_estado_id,
            fecha_modificacion = CURRENT_TIMESTAMP
        WHERE tema_id = p_id_tema;

        UPDATE usuario_tema
        SET activo = false
        WHERE usuario_id != p_id_alumno AND tema_id = p_id_tema;

    -- CASO 3: varios alumnos y NO es creador
    ELSIF v_num_alumnos > 1 AND p_id_alumno != p_id_creador THEN
        UPDATE usuario_tema
        SET activo = false
        WHERE usuario_id = p_id_alumno AND tema_id = p_id_tema;

    -- CASO 4: varios alumnos y ES creador
    ELSIF v_num_alumnos > 1 AND p_id_alumno = p_id_creador THEN
        UPDATE usuario_tema
        SET activo = false
        WHERE usuario_id = p_id_alumno AND tema_id = p_id_tema;
    END IF;
END;
$$;


