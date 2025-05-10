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
    INNER JOIN etapa_formativa ef 
        ON c.carrera_id = ef.carrera_id
    INNER JOIN etapa_formativa_x_ciclo efxc 
        ON efxc.etapa_formativa_id = ef.etapa_formativa_id
    INNER JOIN ciclo c2 
        ON c2.ciclo_id = efxc.ciclo_id
        AND c2.activo = true
    WHERE u.usuario_id = p_usuario_id and ef.etapa_formativa_id is not null;
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

CREATE OR REPLACE FUNCTION listarCiclosOrdenadosPorFecha()
RETURNS TABLE(
    ciclo_id integer,
    semestre text,
    anio integer,
	fecha_inicio date,
	fecha_fin date,
	activo boolean,
	fecha_creacion TIMESTAMP WITH TIME ZONE,
	fecha_modificacion TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.ciclo_id,
        c.semestre::TEXT,
        c.anio,
		c.fecha_inicio,
		c.fecha_fin,
		c.activo,
		c.fecha_creacion,
		c.fecha_modificacion
    FROM ciclo c
    WHERE c.activo = true
    ORDER BY c.anio DESC, c.semestre DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listarEtapasFormativasActivas()
RETURNS TABLE(
    etapa_formativa_id INTEGER,
    nombre TEXT,
    creditage_por_tema NUMERIC(6,2),
    duracion_exposicion TEXT,
    activo BOOLEAN,
	carrera_id INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ef.etapa_formativa_id,
        ef.nombre,
        ef.creditaje_por_tema,
        ef.duracion_exposicion::TEXT,
        ef.activo,
		ef.carrera_id
    FROM etapa_formativa ef
    WHERE ef.activo = true;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_temas_ciclo_actual_x_etapa_formativa(
	etapa_id integer
)
RETURNS TABLE(
	tema_id integer,
    codigo  varchar,
    titulo  varchar   
) AS $$
BEGIN
    RETURN QUERY
 	SELECT 
		t.tema_id,
		t.codigo,
		t.titulo    
    FROM tema t
    inner join etapa_formativa_x_ciclo_x_tema  efct on t.tema_id = efct.tema_id 
	inner join etapa_formativa_x_ciclo efc on efc.etapa_formativa_x_ciclo_id = efct.etapa_formativa_x_ciclo_id
	inner join etapa_formativa ef on ef.etapa_formativa_id = efc.etapa_formativa_id
	inner join ciclo c on c.ciclo_id = efc.ciclo_id
	where c.activo = true and  ef.etapa_formativa_id = etapa_id ;  
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION listar_jornadas_exposicion_salas(
	etapa_id integer
)
RETURNS TABLE(
	jornada_exposicion_id integer,
    datetime_inicio timestamp with time zone,
    datetime_fin timestamp with time zone,
 
    sala_exposicion_id integer,
    nombre_sala  text
) AS $$
BEGIN
    RETURN QUERY
 	SELECT 
	  j.jornada_exposicion_id,
	  j.datetime_inicio,
	  j.datetime_fin,	
	  s.sala_exposicion_id,
	  s.nombre 
	FROM jornada_exposicion j
	inner join exposicion e on e.exposicion_id = j.exposicion_id 
	inner join etapa_formativa_x_ciclo efc on efc.etapa_formativa_x_ciclo_id = e.etapa_formativa_x_ciclo_id
	inner join etapa_formativa ef on ef.etapa_formativa_id = efc.etapa_formativa_id
	inner join ciclo  c  on  c.ciclo_id = efc.ciclo_id
	LEFT JOIN jornada_exposicion_x_sala_exposicion js ON j.jornada_exposicion_id = js.jornada_exposicion_id
	LEFT JOIN sala_exposicion s ON js.sala_exposicion_id = s.sala_exposicion_id
	where c.activo = true  and ef.etapa_formativa_id = etapa_id
	and s.activo = true and j.activo = true and efc.activo = true and ef.activo = true
	ORDER BY j.jornada_exposicion_id; 
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_exposiciones_por_coordinador(p_coordinador_id INTEGER)
RETURNS TABLE (
	exposicion_id INTEGER,
    nombre TEXT,
    descripcion TEXT,
    etapa_formativa_id INTEGER,
    etapa_formativa_nombre TEXT,
    ciclo_id INTEGER,
    ciclo_nombre TEXT,
    estado_planificacion_id INTEGER,
    estado_planificacion_nombre TEXT
)
AS $$
BEGIN
return query
select 
    e.exposicion_id,
    e.nombre::TEXT,
    e.descripcion::TEXT,
    ef.etapa_formativa_id,
    ef.nombre::TEXT AS etapa_formativa_nombre,
    efxc.ciclo_id,
    c2.nombre::TEXT AS ciclo_nombre,
    e.estado_planificacion_id,
    ep.nombre::TEXT AS estado_planificacion_nombre
from exposicion e
inner join estado_planificacion ep 
	on ep.estado_planificacion_id = e.estado_planificacion_id 
	and ep.nombre <> 'Sin planificar'
inner join etapa_formativa_x_ciclo efxc 
	on efxc.etapa_formativa_x_ciclo_id = e.etapa_formativa_x_ciclo_id 
inner join ciclo c2 
	on c2.ciclo_id = efxc.ciclo_id 
inner join etapa_formativa ef 
	on ef.etapa_formativa_id = efxc.ciclo_id 
inner join carrera c 
	on c.carrera_id = ef.carrera_id 
inner join usuario_carrera uc 
	on uc.carrera_id = c.carrera_id 
inner join usuario u
	on u.usuario_id = uc.usuario_id 
inner join tipo_usuario tu 
	on tu.tipo_usuario_id = u.tipo_usuario_id 
	and tu.nombre = 'coordinador'
where u.usuario_id = p_coordinador_id;
END;
$$ LANGUAGE plpgsql STABLE;