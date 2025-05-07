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
