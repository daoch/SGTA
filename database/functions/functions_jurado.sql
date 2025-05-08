CREATE OR REPLACE FUNCTION obtener_etapas_formativas_por_usuario(p_usuario_id INTEGER)
RETURNS TABLE (
    etapa_formativa_id INTEGER,
    nombre TEXT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ef.etapa_formativa_id,
        ef.nombre
    FROM usuario u 
    INNER JOIN usuario_carrera uc 
        ON uc.usuario_id = u.usuario_id
    INNER JOIN carrera c 
        ON c.carrera_id = uc.carrera_id
    LEFT JOIN etapa_formativa ef 
        ON c.carrera_id = ef.carrera_id
    LEFT JOIN etapa_formativa_x_ciclo efxc 
        ON efxc.etapa_formativa_id = ef.etapa_formativa_id
    LEFT JOIN ciclo c2 
        ON c2.ciclo_id = efxc.ciclo_id
        AND c2.activo = true
    WHERE u.usuario_id = p_usuario_id;
END;
$$ LANGUAGE plpgsql STABLE;


CREATE OR REPLACE FUNCTION listar_exposicion_x_ciclo_actual_etapa_formativa(
	etapa_id integer
)
RETURNS TABLE(
	exposicion_id integer,
    nombre text 
   
) AS $$
BEGIN
    RETURN QUERY
 	SELECT 
	e.exposicion_id,
    e.nombre 
    FROM exposicion e
    inner JOIN etapa_formativa_x_ciclo efc on efc.etapa_formativa_x_ciclo_id = e.etapa_formativa_x_ciclo_id
    inner JOIN ciclo c on efc.ciclo_id = c.ciclo_id
    inner join etapa_formativa ef on ef.etapa_formativa_id = efc.etapa_formativa_id
    where c.activo =  true and ef.etapa_formativa_id = etapa_id and e.activo =true;
  
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_etapa_formativa_x_sala_exposicion(p_etapa_formativa_id integer)
RETURNS TABLE(
    etapa_formativa_x_sala_id integer,
    etapa_formativa_id integer,
    sala_exposicion_id integer,
    nombre_sala_exposicion text,
    nombre_etapa_formativa text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        efxse.etapa_formativa_x_sala_id,
        efxse.etapa_formativa_id,
        efxse.sala_exposicion_id,
        se.nombre AS nombre_sala_exposicion,
        ef.nombre AS nombre_etapa_formativa
    FROM etapa_formativa_x_sala_exposicion efxse
    JOIN etapa_formativa ef ON ef.etapa_formativa_id = efxse.etapa_formativa_id
    JOIN sala_exposicion se ON se.sala_exposicion_id = efxse.sala_exposicion_id
    WHERE efxse.etapa_formativa_id = p_etapa_formativa_id 
    AND efxse.activo = true
    AND ef.activo = true
    AND se.activo = true;
END;
$$ LANGUAGE plpgsql;