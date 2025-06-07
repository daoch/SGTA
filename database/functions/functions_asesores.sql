--OBTENER LISTA DE CARRERAS POR ID DEL ASESOR
CREATE OR REPLACE FUNCTION obtener_carreras_activas_por_usuario(p_usuario_id INTEGER)
RETURNS SETOF carrera AS $$
BEGIN
    RETURN QUERY
	Select c.* from carrera as c
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

--Obtener los temas en los que haya participado un asesor se puede traer el último nivel siempre y cuando se complete la relacion tema_ciclo_etepa_formativa
CREATE OR REPLACE FUNCTION obtener_temas_usuario_asesor(
    p_usuario_id INTEGER
)
RETURNS TABLE (
    tema_id INTEGER,
    titulo VARCHAR,
    estado_nombre VARCHAR,
    anio TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.tema_id,
        t.titulo,
        et.nombre AS estado_nombre,
        extract(year from fecha_finalizacion)::bigint::text as anio
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
      AND LOWER(et.nombre) in ('en_progreso', 'finalizado')
	GROUP BY
		t.tema_id, t.titulo, et.nombre, t.fecha_finalizacion
	ORDER BY 
		t.fecha_finalizacion DESC NULLS LAST;
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
      AND et.nombre IN ('PREINSCRITO', 'INSCRITO', 'REGISTRADO', 'EN_PROGRESO', 'PAUSADO')
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

CREATE OR REPLACE FUNCTION listar_resumen_solicitud_cambio_asesor_usuario(
    p_usuario_id INTEGER,
    p_rol_control TEXT
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
		  		and rs.nombre = p_rol_control
	    	LIMIT 1
		) accion ON true

    WHERE s.solicitud_id IN (
        SELECT us_control.solicitud_id
        FROM usuario_solicitud us_control
        INNER JOIN rol_solicitud rs_control ON us_control.rol_solicitud = rs_control.rol_solicitud_id
        WHERE us_control.usuario_id = p_usuario_id
          AND rs_control.nombre = p_rol_control
    );
$$;

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
    p_solicitud_id INTEGER
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
        AND us.solicitud_id = p_solicitud_id;
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

CREATE OR REPLACE FUNCTION obtener_temas_por_alumno(p_id_alumno INTEGER)
RETURNS TABLE (
  idTema INTEGER,
  titulo TEXT,
  estado TEXT,
  areasTematicas TEXT,
  idAsesor INTEGER
) AS $$
BEGIN
  RETURN QUERY
SELECT
    t.tema_id AS "idTema",
    t.titulo::TEXT,
    et.nombre::TEXT,
    STRING_AGG(DISTINCT at.nombre, ', ')::TEXT AS "areasTematicas",
    u.usuario_id AS "idAsesor"
  FROM tema t
  JOIN estado_tema et ON t.estado_tema_id = et.estado_tema_id
  JOIN usuario_tema uta ON uta.tema_id = t.tema_id
    LEFT JOIN LATERAL (
    SELECT u2.usuario_id
    FROM usuario_tema ut
    JOIN usuario u2 ON u2.usuario_id = ut.usuario_id
    WHERE ut.tema_id = t.tema_id AND ut.rol_id = 1 AND ut.activo = TRUE
    LIMIT 1
  ) u ON TRUE
  left JOIN sub_area_conocimiento_tema tsac ON tsac.tema_id = t.tema_id 
  left JOIN sub_area_conocimiento sac ON sac.sub_area_conocimiento_id = tsac.sub_area_conocimiento_id
  left JOIN area_conocimiento at ON at.area_conocimiento_id = sac.area_conocimiento_id
  WHERE et.nombre IN ('INSCRITO', 'REGISTRADO', 'EN_PROGRESO', 'PAUSADO')
  AND uta.usuario_id = p_id_alumno
  AND uta.rol_id = 4
  AND uta.activo = TRUE
  AND t.activo = TRUE
  GROUP BY t.tema_id, t.titulo, et.nombre, u.usuario_id;
END;
$$ LANGUAGE plpgsql;

