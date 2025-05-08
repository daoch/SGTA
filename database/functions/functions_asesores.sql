--OBTENER LISTA DE CARRERAS POR ID DEL ASESOR
CREATE OR REPLACE FUNCTION obtener_carreras_activas_por_usuario(p_usuario_id INTEGER)
RETURNS SETOF Carrera AS $$
BEGIN
    RETURN QUERY
	Select c.* from Carrera as c
	where c.activo = true
	and c.carrera_id in(select uc.usuario_carrera_id
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

--Obtener los temas en los que haya participado un asesor
CREATE OR REPLACE FUNCTION obtener_temas_usuario_asesor(
    p_usuario_id INTEGER
)
RETURNS TABLE (
    tema_id INTEGER,
    titulo VARCHAR,
    estado_nombre VARCHAR,
    fecha_finalizacion TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.tema_id,
        t.titulo,
        et.nombre AS estado_nombre,
        t.fecha_finalizacion
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
		u.nombres,
		u.primer_apellido
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