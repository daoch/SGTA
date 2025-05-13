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
    duracion_exposicion INTERVAL,
    activo BOOLEAN,
	carrera_id INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ef.etapa_formativa_id,
        ef.nombre,
        ef.creditaje_por_tema,
        ef.duracion_exposicion,
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

CREATE OR REPLACE FUNCTION listar_exposiciones_sin_inicializar_cicloactual_por_etapa_forma( --tiva. No debe pasar los 63 caracteres, por eso se corta.
	p_etapa_formativa_id integer
)
RETURNS TABLE(
	exposicion_id integer,
    nombre text,
    inicializado boolean
) AS $$
BEGIN
    RETURN QUERY
SELECT 
	e.exposicion_id,
    e.nombre,
    CASE 
        WHEN ep.nombre <> 'Sin planificar' THEN true
        ELSE false
    END AS inicializado
FROM exposicion e
inner join estado_planificacion ep 
	on ep.estado_planificacion_id = e.estado_planificacion_id 
inner JOIN etapa_formativa_x_ciclo efc 
	on efc.etapa_formativa_x_ciclo_id = e.etapa_formativa_x_ciclo_id
inner JOIN ciclo c 
	on efc.ciclo_id = c.ciclo_id
inner join etapa_formativa ef 
	on ef.etapa_formativa_id = efc.etapa_formativa_id
where c.activo = true 
	and e.activo = true
	and ef.etapa_formativa_id = p_etapa_formativa_id;
  
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION listar_bloques_horario_por_exposicion(p_exposicion_id INTEGER)
RETURNS TABLE (
	bloque_horario_exposicion_id INTEGER,
	jornada_exposicion_x_sala_id INTEGER,
	exposicion_x_tema_id INTEGER,
	es_bloque_reservado BOOLEAN,
	es_bloque_bloqueado BOOLEAN,
	datetime_inicio TIMESTAMPTZ,
	datetime_fin TIMESTAMPTZ,
	sala_nombre TEXT,
	tema_id INTEGER,
	codigo TEXT,
	titulo TEXT
)
AS $$
BEGIN
RETURN QUERY
SELECT
	bhe.bloque_horario_exposicion_id,
	bhe.jornada_exposicion_x_sala_id,
	bhe.exposicion_x_tema_id,
	bhe.es_bloque_reservado,
	bhe.es_bloque_bloqueado,
	bhe.datetime_inicio,
	bhe.datetime_fin,
	se.nombre ,
	t.tema_id,
	t.codigo::TEXT,
	t.titulo::TEXT
FROM bloque_horario_exposicion bhe
INNER JOIN jornada_exposicion_x_sala_exposicion jexse
	ON jexse.jornada_exposicion_x_sala_id = bhe.jornada_exposicion_x_sala_id
INNER JOIN jornada_exposicion je
	ON je.jornada_exposicion_id = jexse.jornada_exposicion_id
INNER JOIN exposicion e
	ON e.exposicion_id = je.exposicion_id
INNER JOIN sala_exposicion se
	ON jexse.sala_exposicion_id = se.sala_exposicion_id
left join exposicion_x_tema et
	on bhe.exposicion_x_tema_id = et.exposicion_x_tema_id
left join tema t
	on t.tema_id = et.tema_id
WHERE bhe.activo = true
	AND je.exposicion_id = p_exposicion_id;
END;
$$ LANGUAGE plpgsql STABLE;


CREATE OR REPLACE FUNCTION actualizar_exposicon_tema_bloque_exposicion(bloques_json jsonb)
RETURNS void AS $$
DECLARE
    bloque jsonb;
    id_bloque INTEGER;
    id_jornada_exposicion_sala INTEGER;
    id_exposicion INTEGER;
    id_tema INTEGER;
    codigo_tema TEXT;
    titulo_tema TEXT;
  et_id INTEGER; 
BEGIN
    
    FOR bloque IN SELECT * FROM jsonb_array_elements(bloques_json)
    LOOP
        
        id_bloque := (bloque->>'idBloque')::INTEGER;
        id_jornada_exposicion_sala := (bloque->>'idJornadaExposicionSala')::INTEGER;
        id_exposicion := (bloque->>'idExposicion')::INTEGER;

       
        id_tema := (bloque->'expo'->>'id')::INTEGER;
        codigo_tema := bloque->'expo'->>'codigo';
        titulo_tema := bloque->'expo'->>'titulo';

       	select exposicion_x_tema_id into et_id
		from exposicion_x_tema et
		where et.tema_id = id_tema and et.exposicion_id = id_exposicion;
    
        UPDATE bloque_horario_exposicion 
        SET 
            exposicion_x_tema_id = et_id,  
            es_bloque_reservado = true,
            fecha_modificacion = now()
        WHERE bloque_horario_exposicion_id = id_bloque;

    
        UPDATE exposicion_x_tema et
        SET estado_exposicion = 'esperando_respuesta'
        WHERE et.tema_id = id_tema AND et.exposicion_id = id_exposicion;
    END LOOP;
END;
$$ LANGUAGE plpgsql;


CREATE FUNCTION obtener_ciclo_etapa_por_tema(p_tema_id integer)
    RETURNS TABLE(ciclo_id integer, ciclo_nombre text, etapa_formativa_id integer, etapa_formativa_nombre text)
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT
        c.ciclo_id,
        CONCAT(c.anio, '-', c.semestre) AS ciclo_nombre,
        ef.etapa_formativa_id,
        efm.nombre AS etapa_formativa_nombre
    FROM etapa_formativa_x_ciclo_x_tema efct
    JOIN etapa_formativa_x_ciclo ef ON efct.etapa_formativa_x_ciclo_id = ef.etapa_formativa_x_ciclo_id
    JOIN ciclo c ON ef.ciclo_id = c.ciclo_id
    JOIN etapa_formativa efm ON ef.etapa_formativa_id = efm.etapa_formativa_id
    WHERE efct.tema_id = p_tema_id
      AND efct.activo = true
      AND ef.activo = true
      AND c.activo = true;
END;
$$;

ALTER FUNCTION obtener_ciclo_etapa_por_tema(INTEGER) OWNER TO postgres;



CREATE FUNCTION obtener_area_conocimiento_jurado(usuario_id_param integer)
    RETURNS TABLE(usuario_id integer, area_conocimiento_id integer, area_conocimiento_nombre character varying)
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT
        u.usuario_id,
		ac.area_conocimiento_id AS area_conocimiento_id,
        ac.nombre AS area_conocimiento_nombre
    FROM
        usuario u
    JOIN
        usuario_area_conocimiento uac ON u.usuario_id = uac.usuario_id
    JOIN
        area_conocimiento ac ON uac.area_conocimiento_id = ac.area_conocimiento_id
    WHERE
        u.usuario_id = usuario_id_param
    ORDER BY
        ac.nombre;
END;
$$;

ALTER FUNCTION obtener_area_conocimiento_jurado(INTEGER) OWNER TO postgres;

CREATE OR REPLACE FUNCTION listar_etapas_formativas_activas_by_coordinador(p_coordinador_id INTEGER)
RETURNS TABLE(
    etapa_formativa_id INTEGER,
    nombre TEXT,
    creditage_por_tema NUMERIC(6,2),
    duracion_exposicion INTERVAL,
    activo BOOLEAN,
	carrera_id INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ef.etapa_formativa_id,
        ef.nombre,
        ef.creditaje_por_tema,
        ef.duracion_exposicion,
        ef.activo,
        ef.carrera_id
    FROM etapa_formativa ef
    inner join carrera c 
        on c.carrera_id = ef.carrera_id 
    inner join usuario_carrera uc 
        on uc.carrera_id = c.carrera_id
    inner join usuario u 
        on u.usuario_id = uc.usuario_id 
    inner join tipo_usuario tu 
        on tu.tipo_usuario_id = u.tipo_usuario_id 
        and tu.nombre = 'coordinador'
    WHERE ef.activo = true
        and u.usuario_id = p_coordinador_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_etapa_formativa_by_id(p_id_etapa_formativa integer)
RETURNS TABLE (
    etapa_formativa_id integer,
    nombre text,
    creditaje_por_tema numeric,
    duracion_exposicion interval,
    activo bool,
    carrera_id integer
)
AS $$
BEGIN
    RETURN QUERY
    select 
	ef.etapa_formativa_id ,
	ef.nombre ,
	ef.creditaje_por_tema ,
	ef.duracion_exposicion ,
	ef.activo ,
	ef.carrera_id 
from etapa_formativa ef 
where ef.etapa_formativa_id = p_id_etapa_formativa;
END;
$$ LANGUAGE plpgsql;