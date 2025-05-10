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

