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
	  AND	(
	    uac.area_conocimiento_id IS NOT NULL AND uac.area_conocimiento_id = ANY(p_areas)
	    OR
	    usac.sub_area_conocimiento_id IS NOT NULL AND usac.sub_area_conocimiento_id = ANY(p_subareas)
	  )
      AND (
        CONCAT(u.nombres, ' ', u.primer_apellido, ' ', u.segundo_apellido) ILIKE '%' || p_busqueda || '%'
        OR ac.nombre ILIKE '%' || p_busqueda || '%'
        OR sac.nombre ILIKE '%' || p_busqueda || '%'
      );
END;
$$ LANGUAGE plpgsql;
