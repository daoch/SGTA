-- Active: 1746915573232@@dbsgtajurado.cvxpelnrmqov.us-east-1.rds.amazonaws.com@5432@postgres@sgtadb
-- SET search_path TO sgtadb;

-- Active: 1748374313012@@localhost@5432@postgres@sgtadb
DROP FUNCTION IF EXISTS obtener_etapas_formativas_por_usuario (p_usuario_id INTEGER);

DROP FUNCTION IF EXISTS listar_exposicion_x_ciclo_actual_etapa_formativa (etapa_id integer);

DROP FUNCTION IF EXISTS listar_etapa_formativa_x_sala_exposicion (p_etapa_formativa_id integer);

DROP FUNCTION IF EXISTS listarCiclosOrdenadosPorFecha ();

DROP FUNCTION IF EXISTS listarEtapasFormativasActivas ();

DROP FUNCTION IF EXISTS listar_temas_ciclo_actual_x_etapa_formativa (
    etapa_id integer,
    expo_id integer
);

DROP FUNCTION IF EXISTS listar_jornadas_exposicion_salas (expo_id integer);

DROP FUNCTION IF EXISTS listar_exposiciones_por_coordinador (p_coordinador_id INTEGER);

DROP FUNCTION IF EXISTS listar_exposiciones_por_coordinador_v2 (p_coordinador_id integer);

DROP FUNCTION IF EXISTS listar_exposiciones_sin_inicializar_cicloactual_por_etapa_formativa (p_etapa_formativa_id integer);

DROP FUNCTION IF EXISTS listar_bloques_horario_por_exposicion (p_exposicion_id INTEGER);

DROP FUNCTION IF EXISTS actualizar_exposicon_tema_bloque_exposicion (bloques_json jsonb);

DROP FUNCTION IF EXISTS obtener_ciclo_etapa_por_tema (p_tema_id integer);

DROP FUNCTION IF EXISTS obtener_area_conocimiento_jurado (usuario_id_param integer);

DROP FUNCTION IF EXISTS listar_etapas_formativas_activas_by_coordinador (p_coordinador_id INTEGER);

DROP FUNCTION IF EXISTS get_etapa_formativa_by_id (p_id_etapa_formativa integer);

DROP FUNCTION IF EXISTS get_estado_exposicion_by_id_exposicion (id_exposicion integer);

DROP FUNCTION IF EXISTS actualizar_bloque_exposicion_siguientes_fases (bloques_json jsonb);

DROP FUNCTION IF EXISTS listar_etapa_formativa_nombre ();

DROP FUNCTION IF EXISTS obtener_usuarios_con_temass ();

DROP FUNCTION IF EXISTS obtener_jurados_por_tema (p_tema_id integer);

DROP FUNCTION IF EXISTS obtener_exposiciones_por_etapa_formativa_por_tema (
    p_etapa_formativa_id integer,
    p_tema_id integer
);

DROP FUNCTION IF EXISTS listar_etapa_formativa_nombre ();

DROP FUNCTION IF EXISTS obtener_carreras_activas_por_usuario (p_usuario_id integer);

DROP FUNCTION IF EXISTS obtener_etapas_formativas_por_tema_simple (p_tema_id integer);

DROP FUNCTION IF EXISTS obtener_exposiciones_por_etapa_formativa (p_etapa_formativa_id INTEGER);

DROP FUNCTION IF EXISTS terminar_planificacion (idexposicion INTEGER);

DROP FUNCTION IF EXISTS listar_bloque_con_sala (_exposicion_id INTEGER);

DROP FUNCTION IF EXISTS obtener_exposiciones_por_usuario (p_usuario_id INTEGER);

DROP FUNCTION IF EXISTS listar_areas_por_tema (_tema_id integer);

DROP PROCEDURE IF EXISTS intsertar_control_exposcion (
    idExposicion INT,
    idEtapaFormativa INT
);

DROP FUNCTION IF EXISTS sala_ocupada_en_rango (
    p_sala_id INTEGER,
    p_inicio TIMESTAMPTZ,
    p_fin TIMESTAMPTZ
);

DROP FUNCTION IF EXISTS obtener_profesores ();

DROP FUNCTION IF EXISTS listar_bloques_con_temas_y_usuarios (p_exposicion_id integer);

DROP PROCEDURE IF EXISTS update_estado_exposicion_usuario (
    p_exposicion_id INTEGER,
    p_tema_id INTEGER
);

DROP FUNCTION IF EXISTS obtener_id_carrera_por_id_expo (idexpo INTEGER);

DROP PROCEDURE IF EXISTS llenar_exposicion_x_tema (idexpo INTEGER);

DROP FUNCTION IF EXISTS obtener_miembros_jurado_x_exposicion_tema (
    p_exposicion_x_tema_id INTEGER
);

DROP FUNCTION IF EXISTS obtener_carrera_alumno (p_usuario_id INTEGER);

DROP PROCEDURE IF EXISTS insertar_revision_criterio_exposicion_por_jurado_id_por_tema_id (
    p_tema_id INTEGER,
    p_miembro_jurado_id INTEGER
);

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
	etapa_id integer	,
	expo_id integer
)
RETURNS TABLE(
	tema_id integer,
    codigo  varchar,
    titulo  varchar,
    usuario_id integer,
     nombres varchar,
  apellidos varchar,
  rol_id integer,
  rol_nombre varchar    
) AS $$
declare
	
BEGIN
	
	
    RETURN QUERY
 	SELECT 
		t.tema_id,
		t.codigo,
		t.titulo ,
		u.usuario_id,
		u.nombres,
		u.primer_apellido,
		r.rol_id,
		r.nombre
    FROM tema t
    inner join etapa_formativa_x_ciclo_x_tema  efct on t.tema_id = efct.tema_id 
	inner join etapa_formativa_x_ciclo efc on efc.etapa_formativa_x_ciclo_id = efct.etapa_formativa_x_ciclo_id
	inner join etapa_formativa ef on ef.etapa_formativa_id = efc.etapa_formativa_id
	inner join ciclo c on c.ciclo_id = efc.ciclo_id
	inner join usuario_tema ut on ut.tema_id = t.tema_id
	inner join usuario u on  u.usuario_id = ut.usuario_id
	inner join rol r on r.rol_id = ut.rol_id
	where c.activo = true and  ef.etapa_formativa_id = etapa_id 
	and t.tema_id in  (select po.tema_id from exposicion_x_tema po where po.exposicion_id = expo_id)
	order by t.tema_id;  
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_jornadas_exposicion_salas(
	expo_id integer
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
	where  j.activo and s.activo and j.exposicion_id = expo_id
	and c.activo = true  and e.exposicion_id =expo_id
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
	on ef.etapa_formativa_id = efxc.etapa_formativa_id
inner join carrera c 
	on c.carrera_id = ef.carrera_id 
inner join usuario_carrera uc 
	on uc.carrera_id = c.carrera_id
	and uc.es_coordinador = true
inner join usuario u
	on u.usuario_id = uc.usuario_id 
where u.usuario_id = p_coordinador_id;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION listar_exposiciones_por_coordinador_v2(p_coordinador_id integer)
 RETURNS TABLE(exposicion_id integer, nombre text, descripcion text, etapa_formativa_id integer, etapa_formativa_nombre text, ciclo_id integer, ciclo_nombre text, estado_planificacion_id integer, estado_planificacion_nombre text)
 LANGUAGE plpgsql
 STABLE
AS $function$
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
	on ef.etapa_formativa_id = efxc.etapa_formativa_id
inner join carrera c
	on c.carrera_id = ef.carrera_id
inner join usuario_carrera uc
	on uc.carrera_id = c.carrera_id
	and uc.es_coordinador = true
inner join usuario u
	on u.usuario_id = uc.usuario_id
where u.usuario_id = p_coordinador_id;
END;
$function$;

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
	ep_id integer;
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

		select estado_planificacion_id  into ep_id
		from estado_planificacion where
		nombre = 'Fase 1';
    
        UPDATE bloque_horario_exposicion 
        SET 
            exposicion_x_tema_id = et_id,  
            es_bloque_reservado = true,
            fecha_modificacion = now()
        WHERE bloque_horario_exposicion_id = id_bloque;

    
        UPDATE exposicion_x_tema et
        SET estado_exposicion = 'esperando_respuesta'
        WHERE et.tema_id = id_tema AND et.exposicion_id = id_exposicion;

		update exposicion 
		set estado_planificacion_id = ep_id
		where   exposicion_id  = id_exposicion;
	
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION obtener_ciclo_etapa_por_tema(p_tema_id integer)
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

CREATE OR REPLACE FUNCTION obtener_area_conocimiento_jurado(usuario_id_param integer)
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
        and uc.es_coordinador = true
    inner join usuario u 
        on u.usuario_id = uc.usuario_id
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

CREATE OR REPLACE FUNCTION  get_estado_exposicion_by_id_exposicion(
	id_exposicion integer
)
RETURNS TABLE(
	id_estado_planificacion integer,
    nombre  text,
   	activo bool   	
) AS $$
BEGIN
    RETURN QUERY
 SELECT 
		ep.estado_planificacion_id,
		ep.nombre,
		ep.activo
    FROM estado_planificacion ep
	inner join exposicion e on e.estado_planificacion_id = ep.estado_planificacion_id
	where e.exposicion_id = id_exposicion;	   
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION actualizar_bloque_exposicion_siguientes_fases(bloques_json jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    bloque jsonb;
    id_bloque integer;
    id_jornada_exposicion_sala integer;
    id_exposicion integer;
    id_tema integer;
    codigo_tema text;
    titulo_tema text;
    bloque_reservado boolean;
    bloque_bloqueado boolean;
    et_id integer;
    ep_id integer;
	nombre_estado_actual text;
    nuevo_estado_id integer;
begin
	select (bloques_json->0->>'idExposicion')::integer into id_exposicion;
   update bloque_horario_exposicion
	set exposicion_x_tema_id = null
	where bloque_horario_exposicion_id in (
	    select (bloque->>'idBloque')::integer
	    from jsonb_array_elements(bloques_json) as bloque_json
	);

	select ep.nombre into nombre_estado_actual
    from exposicion e
    inner join estado_planificacion ep on ep.estado_planificacion_id = e.estado_planificacion_id
    where e.exposicion_id = id_exposicion;

    -- Decidir el nuevo estado según el actual
    if nombre_estado_actual = 'Sin planificar' then
        select estado_planificacion_id into nuevo_estado_id
        from estado_planificacion
        where nombre = 'Planificacion inicial';

    elsif nombre_estado_actual = 'Planificacion inicial' then
        select estado_planificacion_id into nuevo_estado_id
        from estado_planificacion
        where nombre = 'Fase 1';

    elsif nombre_estado_actual = 'Fase 1' then
        select estado_planificacion_id into nuevo_estado_id
        from estado_planificacion
        where nombre = 'Fase 2';

    elsif nombre_estado_actual = 'Fase 2' then
        select estado_planificacion_id into nuevo_estado_id
        from estado_planificacion
        where nombre = 'Cierre de planificacion';

   elsif nombre_estado_actual = 'Cierre de planificacion' then
     select estado_planificacion_id into nuevo_estado_id
        from estado_planificacion
        where nombre = 'Cierre de planificacion';

	else
	    raise notice 'Estado desconocido: "%"', nombre_estado_actual;
	    	return;
	end if;

    -- Actualizar el estado de planificación
    update exposicion
    set estado_planificacion_id = nuevo_estado_id
    where exposicion_id = id_exposicion;

    raise notice 'Estado de planificación actualizado a "%"', nombre_estado_actual;

    for bloque in select * from jsonb_array_elements(bloques_json)
    loop

        id_bloque := (bloque->>'idBloque')::integer;
        id_exposicion := (bloque->>'idExposicion')::integer;
        bloque_bloqueado := (bloque->>'bloqueBloqueado')::boolean;

       if bloque ? 'bloqueBloqueado' and bloque->>'bloqueBloqueado' is not null then

			bloque_bloqueado := (bloque->>'bloqueBloqueado')::boolean;

		    update bloque_horario_exposicion
		    set es_bloque_bloqueado = bloque_bloqueado
		    where bloque_horario_exposicion_id = id_bloque;

		end if;

        -- si no hay 'expo' o es null, quitar el tema
        if bloque->'expo' is null or bloque->'expo' = 'null'::jsonb then
            update bloque_horario_exposicion
            set
                exposicion_x_tema_id = null,
                es_bloque_reservado = false,
                fecha_modificacion = now()
            where bloque_horario_exposicion_id = id_bloque;

            raise notice 'Bloque %: se quitó tema', id_bloque;
            continue;
        end if;

        -- extraer id_tema del json
        id_tema := (bloque->'expo'->>'id')::integer;
        if id_tema is null then
            raise notice 'Tema en expo es null para bloque %', id_bloque;
            continue;
        end if;

        -- buscar exposicion_x_tema_id
        begin
            select exposicion_x_tema_id into et_id
            from exposicion_x_tema
            where tema_id = id_tema and exposicion_id = id_exposicion;
        exception when no_data_found then
            raise notice 'No se encontró exposicion_x_tema para tema % y exposicion %', id_tema, id_exposicion;
            continue;
        end;

        -- actualizar el bloque con ese et_id
        update bloque_horario_exposicion
        set
            exposicion_x_tema_id = et_id,
            es_bloque_reservado = true,
            fecha_modificacion = now()
        where bloque_horario_exposicion_id = id_bloque;

        raise notice 'Bloque %: asignado tema %', id_bloque, id_tema;

		if nombre_estado_actual = 'Planificacion inicial' then
			update exposicion_x_tema
			set estado_exposicion = 'esperando_respuesta'
			where exposicion_x_tema_id = et_id;
		end if;

    end loop;
end;
$function$
;

CREATE OR REPLACE FUNCTION listar_etapa_formativa_nombre()
RETURNS TABLE(
    etapa_formativa_id INTEGER,
    nombre TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ef.etapa_formativa_id,
        ef.nombre
    FROM etapa_formativa ef
    WHERE ef.activo = true;
END;
$$ LANGUAGE plpgsql;

-- CREATE OR REPLACE FUNCTION obtener_usuarios_con_temass()
--  RETURNS TABLE(usuario_id integer, codigo_pucp character varying, nombres character varying, primer_apellido character varying, segundo_apellido character varying, correo_electronico character varying, nivel_estudios character varying, cantidad_temas_asignados bigint, tema_activo boolean, fecha_asignacion timestamp with time zone)
--  LANGUAGE plpgsql
-- AS $function$
-- BEGIN
--     RETURN QUERY
--     SELECT DISTINCT ON (u.usuario_id)
--         u.usuario_id,
--         u.codigo_pucp,
--         u.nombres,
--         u.primer_apellido,
--         u.segundo_apellido,
--         u.correo_electronico,
--         u.nivel_estudios,
--         COUNT(ut.tema_id) OVER (PARTITION BY u.usuario_id) AS cantidad_temas_asignados,
--         ut.activo AS tema_activo,
--         ut.fecha_creacion AS fecha_asignacion
--     FROM usuario u
--     JOIN usuario_tema ut ON u.usuario_id = ut.usuario_id
--     JOIN tema t ON ut.tema_id = t.tema_id
--     WHERE ut.rol_id = 2 AND ut.activo = true
--     ORDER BY u.usuario_id, ut.prioridad;
-- END;
-- $function$;

CREATE OR REPLACE FUNCTION obtener_usuarios_con_temass()
 RETURNS TABLE(usuario_id integer, codigo_pucp character varying, nombres character varying, primer_apellido character varying, segundo_apellido character varying, correo_electronico character varying, nivel_estudios character varying, cantidad_temas_asignados bigint, tema_activo boolean, fecha_asignacion timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT *
    FROM (
      SELECT DISTINCT ON (u.usuario_id)
        u.usuario_id,
        u.codigo_pucp,
        u.nombres,
        u.primer_apellido,
        u.segundo_apellido,
        u.correo_electronico,
        u.nivel_estudios,
        COUNT(CASE WHEN ut.activo = true THEN 1 END) OVER (PARTITION BY u.usuario_id) AS cantidad_temas_asignados,
        ut.activo AS tema_activo,
        ut.fecha_creacion AS fecha_asignacion
      FROM usuario u
      LEFT JOIN usuario_tema ut ON u.usuario_id = ut.usuario_id AND ut.rol_id = 2
      LEFT JOIN tema t ON ut.tema_id = t.tema_id
      ORDER BY u.usuario_id, ut.prioridad NULLS LAST
    ) sub
    WHERE sub.cantidad_temas_asignados > 0;

END;

$function$;

CREATE OR REPLACE FUNCTION obtener_jurados_por_tema(p_tema_id integer)
RETURNS TABLE(
    conteo bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT COUNT(*) as conteo
    FROM usuario_tema ut
    WHERE rol_id IN (1, 2, 5)
    AND ut.activo = true
    AND ut.tema_id = p_tema_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION obtener_exposiciones_por_etapa_formativa_por_tema(
    p_etapa_formativa_id integer,
    p_tema_id integer
)
RETURNS TABLE(
    exposicion_id integer,
    exposicion_x_tema_id integer,
    nombre_exposicion text,
    estado_exposicion character varying,
    datetime_inicio timestamp with time zone,
    datetime_fin timestamp with time zone,
    nombre_sala_exposicion text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.exposicion_id,
        ext.exposicion_x_tema_id,
        e.nombre AS nombre_exposicion,
        ext.estado_exposicion::VARCHAR,
        bhe.datetime_inicio,
        bhe.datetime_fin,
        se.nombre AS nombre_sala_exposicion
    FROM exposicion e
    JOIN etapa_formativa_x_ciclo efc 
        ON efc.etapa_formativa_x_ciclo_id = e.etapa_formativa_x_ciclo_id
    JOIN etapa_formativa ef
        ON ef.etapa_formativa_id = efc.etapa_formativa_id
    JOIN exposicion_x_tema ext 
        ON ext.exposicion_id = e.exposicion_id
    JOIN bloque_horario_exposicion bhe 
        ON bhe.exposicion_x_tema_id = ext.exposicion_x_tema_id
    JOIN jornada_exposicion_x_sala_exposicion jexs 
        ON jexs.jornada_exposicion_x_sala_id = bhe.jornada_exposicion_x_sala_id
    JOIN sala_exposicion se 
        ON se.sala_exposicion_id = jexs.sala_exposicion_id
    WHERE ef.etapa_formativa_id = p_etapa_formativa_id
      AND ext.tema_id = p_tema_id
      AND ext.estado_exposicion IN ('programada', 'calificada', 'completada') 
      AND ef.activo = TRUE
      AND e.activo = TRUE
      AND ext.activo = TRUE
      AND bhe.activo = TRUE
      AND jexs.activo = TRUE
      AND se.activo = TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_etapa_formativa_nombre()
    RETURNS TABLE(etapa_formativa_id integer, nombre text)
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT
        ef.etapa_formativa_id,
        ef.nombre
    FROM etapa_formativa ef
    WHERE ef.activo = true;
END;
$$;

CREATE OR REPLACE FUNCTION obtener_carreras_activas_por_usuario(p_usuario_id integer) RETURNS SETOF carrera
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
	Select c.* from Carrera as c
	where c.activo = true
	and c.carrera_id in(select uc.carrera_id
						from usuario_carrera as uc
						where uc.usuario_id = p_usuario_id
						and uc.activo = true);
END;
$$;

CREATE OR REPLACE FUNCTION obtener_etapas_formativas_por_tema_simple(p_tema_id integer)
    RETURNS TABLE(etapa_formativa_id integer, nombre_etapa text)
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        ef.etapa_formativa_id,
        ef.nombre AS nombre_etapa
    FROM exposicion_x_tema ext
    JOIN exposicion e ON ext.exposicion_id = e.exposicion_id
    JOIN etapa_formativa_x_ciclo efxc ON e.etapa_formativa_x_ciclo_id = efxc.etapa_formativa_x_ciclo_id
    JOIN etapa_formativa ef ON efxc.etapa_formativa_id = ef.etapa_formativa_id
    WHERE ext.tema_id = p_tema_id
      AND ext.activo = true
      AND e.activo = true
      AND ef.activo = true;
END;
$$;

CREATE OR REPLACE FUNCTION obtener_exposiciones_por_etapa_formativa(p_etapa_formativa_id integer)
    RETURNS TABLE(exposicion_id integer, nombre_exposicion text, estado_exposicion character varying, datetime_inicio timestamp with time zone, datetime_fin timestamp with time zone, nombre_sala_exposicion text)
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT
        e.exposicion_id,
        e.nombre AS nombre_exposicion,
        ext.estado_exposicion::VARCHAR,
        bhe.datetime_inicio,
        bhe.datetime_fin,
        se.nombre AS nombre_sala_exposicion
    FROM etapa_formativa ef
    JOIN etapa_formativa_x_sala_exposicion efxs
        ON ef.etapa_formativa_id = efxs.etapa_formativa_id
    JOIN sala_exposicion se
        ON efxs.sala_exposicion_id = se.sala_exposicion_id
    JOIN jornada_exposicion_x_sala_exposicion jexs
        ON se.sala_exposicion_id = jexs.sala_exposicion_id
    JOIN jornada_exposicion je
        ON jexs.jornada_exposicion_id = je.jornada_exposicion_id
    JOIN exposicion e
        ON je.exposicion_id = e.exposicion_id
    JOIN exposicion_x_tema ext
        ON ext.exposicion_id = e.exposicion_id
    JOIN bloque_horario_exposicion bhe
        ON bhe.exposicion_x_tema_id = ext.exposicion_x_tema_id
    WHERE ef.etapa_formativa_id = p_etapa_formativa_id
      AND ef.activo = TRUE
      AND efxs.activo = TRUE
      AND jexs.activo = TRUE
      AND e.activo = TRUE
      AND ext.activo = TRUE
      AND bhe.activo = TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION terminar_planificacion(idexposicion integer) RETURNS boolean
    LANGUAGE plpgsql
AS
$$
DECLARE
   id_cierre_planificacion integer;
BEGIN
	select estado_planificacion_id into id_cierre_planificacion
	from estado_planificacion where nombre = 'Cierre de planificacion';

 	update exposicion set estado_planificacion_id = id_cierre_planificacion
	where exposicion_id = idExposicion;

	update exposicion_x_tema set estado_exposicion = 'programada'
	where exposicion_id = idExposicion;


	RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION listar_bloque_con_sala(
	_exposicion_id integer
)
RETURNS TABLE(
	id_bloque integer,
    fecha_ini  timestamptz,
    fecha_fin  timestamptz,
    id_sala integer,
    sala text    
)
AS $$
BEGIN
    RETURN QUERY
 	SELECT 
		b.bloque_horario_exposicion_id as "id_bloque",
		b.datetime_inicio as "fecha_ini",
		b.datetime_fin as "fecha_fin",
		s.sala_exposicion_id as "id_sala",
		s.nombre  as "sala"
    from bloque_horario_exposicion b
	inner join jornada_exposicion_x_sala_exposicion j  on b.jornada_exposicion_x_sala_id = j.jornada_exposicion_x_sala_id
	inner join jornada_exposicion je on je.jornada_exposicion_id = j.jornada_exposicion_id
	inner join sala_exposicion s on s.sala_exposicion_id = j.sala_exposicion_id 
	where b.activo = true and je.exposicion_id = _exposicion_id;
END;
$$ LANGUAGE plpgsql;
-- Para volver a estados

CREATE OR REPLACE FUNCTION obtener_exposiciones_por_usuario(
	p_usuario_id integer
)
RETURNS TABLE(
	exposicion_id integer,
	tema_id integer,
	estado text,
	link_exposicion text,
	link_grabacion text,
	datetime_inicio timestamp with time zone,
	datetime_fin timestamp with time zone,
	sala text,
	titulo text,
	etapa_formativa text,
	ciclo text,
    tipo_exposicion_nombre text,
    nota_final numeric(6,2)
) AS $$
BEGIN 
RETURN QUERY
SELECT
	ext.exposicion_x_tema_id AS exposicion_id,
	ext.tema_id,
	ext.estado_exposicion::text AS estado,
	ext.link_exposicion,
	ext.link_grabacion,
	bhe.datetime_inicio,
	bhe.datetime_fin,
	se.nombre AS sala,
	tema.titulo::text,
	ef.nombre AS etapa_formativa,
	ciclo.nombre::text,
    e.nombre::text AS tipo_exposicion_nombre,
    ext.nota_final
FROM
	usuario_tema ut
	JOIN exposicion_x_tema ext ON ext.tema_id = ut.tema_id
	JOIN bloque_horario_exposicion bhe ON bhe.exposicion_x_tema_id = ext.exposicion_x_tema_id
	JOIN jornada_exposicion_x_sala_exposicion ON jornada_exposicion_x_sala_exposicion.jornada_exposicion_x_sala_id = bhe.jornada_exposicion_x_sala_id
	JOIN sala_exposicion se ON se.sala_exposicion_id = jornada_exposicion_x_sala_exposicion.sala_exposicion_id
	JOIN tema ON tema.tema_id = ut.tema_id
	JOIN etapa_formativa_x_ciclo_x_tema efxct ON efxct.tema_id = tema.tema_id
	JOIN etapa_formativa_x_ciclo efxc ON efxc.etapa_formativa_x_ciclo_id = efxct.etapa_formativa_x_ciclo_id
	JOIN etapa_formativa ef ON ef.etapa_formativa_id = efxc.etapa_formativa_id
	JOIN ciclo ON ciclo.ciclo_id = efxc.ciclo_id
    JOIN exposicion e ON e.exposicion_id = ext.exposicion_id
WHERE ut.usuario_id = p_usuario_id
AND ext.estado_exposicion IN ('programada', 'calificada', 'completada');
END;
$$ LANGUAGE plpgsql;

-- update exposicion
-- set
--     estado_planificacion_id = 2
-- where
--     exposicion_id = 1
--     or exposicion_id = 2;

--update bloque_horario_exposicion
--set
--  exposicion_x_tema_id = null,
--    es_bloque_reservado = false,
--where
--    bloque_horario_exposicion_id >= 1;

-- update exposicion_x_tema set estado_exposicion = 'sin_programar';

CREATE OR REPLACE FUNCTION listar_areas_por_tema(
  _tema_id integer
)
RETURNS TABLE(
  area_conocimiento_id   integer,
  carrera_id             integer,
  nombre                 text,
  descripcion            text,
  activo                 boolean,
  fecha_creacion         timestamptz,
  fecha_modificacion     timestamptz
)
AS $$
BEGIN
  RETURN QUERY
    SELECT DISTINCT
      ac.area_conocimiento_id,
	  ac.carrera_id,
      ac.nombre::text,
      ac.descripcion::text,
      ac.activo,
      ac.fecha_creacion,
      ac.fecha_modificacion
    FROM area_conocimiento ac
    INNER JOIN sub_area_conocimiento sac 
      ON sac.area_conocimiento_id = ac.area_conocimiento_id 
    INNER JOIN sub_area_conocimiento_tema sact 
      ON sact.sub_area_conocimiento_id = sac.sub_area_conocimiento_id 
    INNER JOIN tema t 
      ON t.tema_id = sact.tema_id
    WHERE t.tema_id = _tema_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE intsertar_control_exposcion(
    IN idexposicion integer,
    IN idetapaformativa integer
)
LANGUAGE plpgsql
AS $procedure$
BEGIN
   INSERT INTO control_exposicion_usuario (
        exposicion_x_tema_id,
        usuario_x_tema_id,
        estado_exposicion_usuario,
        fecha_creacion,
        fecha_modificacion
    )
   SELECT
        ext.exposicion_x_tema_id,
        tu.usuario_tema_id,
        'esperando_respuesta',
        NOW(),
        NOW()
   FROM exposicion_x_tema ext
   INNER JOIN usuario_tema tu ON tu.tema_id = ext.tema_id
   INNER JOIN rol r ON tu.rol_id = r.rol_id
   WHERE ext.exposicion_id = idExposicion
     AND tu.activo = TRUE
     AND r.nombre IN ('Asesor', 'Jurado')
	and tu.asignado = true;
END;
$procedure$;

--update exposicion_x_tema set estado_exposicion = 'sin_programar';

CREATE OR REPLACE FUNCTION sala_ocupada_en_rango(
    p_sala_id INTEGER,
    p_inicio TIMESTAMPTZ,
    p_fin TIMESTAMPTZ
) RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    existe_conflicto BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM jornada_exposicion_x_sala_exposicion jxs
        JOIN jornada_exposicion je ON jxs.jornada_exposicion_id = je.jornada_exposicion_id
        WHERE jxs.sala_exposicion_id = p_sala_id
          AND NOT (je.datetime_fin <= p_inicio OR je.datetime_inicio >= p_fin)
    ) INTO existe_conflicto;

    RETURN existe_conflicto;
END;
$$;

CREATE OR REPLACE FUNCTION obtener_profesores()
 RETURNS TABLE(
    id_usuario integer,
    nombres text,
    primer_apellido text,
    segundo_apellido text,
    codigo_pucp text,
    correo_electronico text,
    tipo_dedicacion text,
    cantidad_temas_asignados bigint
)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        u.usuario_id AS id_usuario,
        u.nombres::TEXT,
        u.primer_apellido::TEXT,
        u.segundo_apellido::TEXT,
        u.codigo_pucp::TEXT,
        u.correo_electronico::TEXT,
        td.iniciales::TEXT AS tipo_dedicacion,
        COALESCE(ut.cantidad_temas_asignados, 0) AS cantidad_temas_asignados
    FROM usuario u
    INNER JOIN tipo_usuario tu ON u.tipo_usuario_id = tu.tipo_usuario_id
    INNER JOIN tipo_dedicacion td ON u.tipo_dedicacion_id = td.tipo_dedicacion_id
    LEFT JOIN (
        SELECT usuario_id AS id_usuario, COUNT(*) AS cantidad_temas_asignados
        FROM usuario_tema
        WHERE activo = true
        GROUP BY usuario_id
    ) ut ON u.usuario_id = ut.id_usuario
    WHERE
        tu.nombre = 'profesor'
        AND u.activo = true
    ORDER BY cantidad_temas_asignados ASC;
END;
$function$;

CREATE OR REPLACE FUNCTION listar_bloques_con_temas_y_usuarios(p_exposicion_id integer)
 RETURNS TABLE(bloque_horario_exposicion_id integer, jornada_exposicion_x_sala_id integer, exposicion_x_tema_id integer, es_bloque_reservado boolean, es_bloque_bloqueado boolean, datetime_inicio timestamp with time zone, datetime_fin timestamp with time zone, sala_nombre text, tema_id integer, tema_codigo character varying, tema_titulo character varying, usuario_id integer, nombres character varying, apellidos character varying, rol_id integer, rol_nombre character varying, estado_usuario_expo character varying)
 LANGUAGE plpgsql
 STABLE
AS $function$
DECLARE
    p_etapa_id INTEGER;
BEGIN
	select e.etapa_formativa_id into p_etapa_id 
	from etapa_formativa e 
	inner join etapa_formativa_x_ciclo  efc on efc.etapa_formativa_id =  e.etapa_formativa_id
	inner join exposicion expo on expo.etapa_formativa_x_ciclo_id = efc.etapa_formativa_x_ciclo_id
	where expo.exposicion_id = p_exposicion_id;
RETURN QUERY
 SELECT
        bhe.bloque_horario_exposicion_id,
        bhe.jornada_exposicion_x_sala_id,
        bhe.exposicion_x_tema_id,
        bhe.es_bloque_reservado,
        bhe.es_bloque_bloqueado,
        bhe.datetime_inicio,
        bhe.datetime_fin,
        se.nombre AS sala_nombre,
        t.tema_id,
        t.codigo::VARCHAR,
        t.titulo::VARCHAR,
        u.usuario_id,
        u.nombres,
        u.primer_apellido,
        r.rol_id,
        r.nombre,
        ceu.estado_exposicion_usuario
    FROM bloque_horario_exposicion bhe
    INNER JOIN jornada_exposicion_x_sala_exposicion jexse
        ON jexse.jornada_exposicion_x_sala_id = bhe.jornada_exposicion_x_sala_id
    INNER JOIN jornada_exposicion je
        ON je.jornada_exposicion_id = jexse.jornada_exposicion_id
    INNER JOIN exposicion e
        ON e.exposicion_id = je.exposicion_id
    INNER JOIN sala_exposicion se
        ON jexse.sala_exposicion_id = se.sala_exposicion_id
    LEFT JOIN exposicion_x_tema et
        ON bhe.exposicion_x_tema_id = et.exposicion_x_tema_id
    LEFT JOIN tema t
        ON t.tema_id = et.tema_id
    LEFT JOIN etapa_formativa_x_ciclo_x_tema efct
        ON t.tema_id = efct.tema_id
    LEFT JOIN etapa_formativa_x_ciclo efc
        ON efct.etapa_formativa_x_ciclo_id = efc.etapa_formativa_x_ciclo_id
    LEFT JOIN etapa_formativa ef
        ON ef.etapa_formativa_id = efc.etapa_formativa_id
    LEFT JOIN ciclo c
        ON c.ciclo_id = efc.ciclo_id AND c.activo = TRUE
    LEFT JOIN usuario_tema ut
        ON ut.tema_id = t.tema_id and ut.asignado= true
    LEFT JOIN usuario u
        ON u.usuario_id = ut.usuario_id
    LEFT JOIN rol r
        ON r.rol_id = ut.rol_id
    LEFT JOIN control_exposicion_usuario ceu
	    ON ceu.usuario_x_tema_id = ut.usuario_tema_id
	    AND ceu.exposicion_x_tema_id = et.exposicion_x_tema_id
    WHERE bhe.activo = TRUE
      AND je.exposicion_id = p_exposicion_id
      AND (ef.etapa_formativa_id = p_etapa_id OR ef.etapa_formativa_id IS NULL)

    ORDER BY bhe.bloque_horario_exposicion_id;
END;
$function$
;

CREATE OR REPLACE PROCEDURE update_estado_exposicion_usuario(
    IN p_exposicion_id INTEGER,
    IN p_tema_id INTEGER
)
LANGUAGE plpgsql
AS $$
declare
	 ext_id INTEGER;
BEGIN
	select exposicion_x_tema_id into ext_id from exposicion_x_tema where exposicion_id = p_exposicion_id 
	and tema_id = p_tema_id;

    update control_exposicion_usuario set estado_exposicion_usuario = 'esperando_respuesta'
	where exposicion_x_tema_id =ext_id;
END;
$$;

CREATE OR REPLACE FUNCTION obtener_id_carrera_por_id_expo(idexpo integer)
    RETURNS TABLE(id_carrera integer)
    LANGUAGE plpgsql
AS
$$
begin
	return query
	select c.carrera_id from carrera  c
	inner join etapa_formativa ef on ef.carrera_id = c.carrera_id
	inner join etapa_formativa_x_ciclo efc on efc.etapa_formativa_id = ef.etapa_formativa_id
	inner join exposicion e on  e.etapa_formativa_x_ciclo_id  = efc.etapa_formativa_x_ciclo_id
	where e.exposicion_id =idExpo ;
end
$$;

CREATE OR REPLACE PROCEDURE llenar_exposicion_x_tema(idexpo integer)
    LANGUAGE plpgsql
AS
$$
begin
    INSERT INTO exposicion_x_tema (exposicion_id, tema_id)

    (SELECT idexpo, efct.tema_id
        FROM exposicion e
        INNER JOIN etapa_formativa_x_ciclo efc ON e.etapa_formativa_x_ciclo_id = efc.etapa_formativa_x_ciclo_id
        INNER JOIN etapa_formativa_x_ciclo_x_tema efct ON efc.etapa_formativa_x_ciclo_id = efct.etapa_formativa_x_ciclo_id
        INNER JOIN tema t ON efct.tema_id = t.tema_id
            WHERE e.exposicion_id = idexpo
            -- AND t.estado_tema_id = 10 --  EN_PROGRESO
    );
end
$$;

CREATE OR REPLACE FUNCTION obtener_miembros_jurado_x_exposicion_tema(
    p_exposicion_x_tema_id integer
)
RETURNS TABLE(
    usuario_id integer,
    nombres text,
    primer_apellido text,
    segundo_apellido text,
    rol text
)
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT U.usuario_id, U.nombres::text, U.primer_apellido::text, U.segundo_apellido::text, rol.nombre::text AS rol
    FROM USUARIO U
    JOIN USUARIO_TEMA UT ON UT.usuario_id = U.usuario_id
    JOIN EXPOSICION_X_TEMA EXT ON EXT.tema_id = UT.tema_id
    JOIN ROL ON ROL.rol_id = UT.rol_id
    JOIN CONTROL_EXPOSICION_USUARIO CEU ON CEU.usuario_x_tema_id = UT.usuario_tema_id
    WHERE EXT.exposicion_x_tema_id = p_exposicion_x_tema_id AND U.tipo_usuario_id != 2 AND UT.activo = true AND CEU.exposicion_x_tema_id = p_exposicion_x_tema_id AND rol.nombre IN ('Asesor', 'Jurado');
END
$$;

CREATE OR REPLACE FUNCTION obtener_carrera_alumno(
    p_usuario_id INTEGER
)
RETURNS TABLE (
    carrera_id INTEGER,
    nombre VARCHAR,
    es_coordinador BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        c.carrera_id,
        c.nombre,
        uc.es_coordinador
    FROM usuario_carrera uc
    JOIN carrera c ON uc.carrera_id = c.carrera_id
    WHERE uc.usuario_id = p_usuario_id
    AND uc.activo = true
    LIMIT 1;
END;
$$;

CREATE OR REPLACE PROCEDURE insertar_revision_criterio_exposicion_por_jurado_id_por_tema_id(
    p_tema_id INTEGER,
    p_miembro_jurado_id INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_exposicion RECORD;
    v_criterio RECORD;
    v_exposicion_x_tema_id INTEGER;
BEGIN
    FOR v_exposicion IN
        SELECT exposicion_id
        FROM exposicion
        WHERE etapa_formativa_x_ciclo_id = 
            (SELECT etapa_formativa_x_ciclo_id 
             FROM etapa_formativa_x_ciclo_x_tema 
             WHERE tema_id = p_tema_id 
             ORDER BY etapa_formativa_x_ciclo_id DESC 
             LIMIT 1)
        AND activo = true
    LOOP
        SELECT exposicion_x_tema_id 
        INTO v_exposicion_x_tema_id
        FROM exposicion_x_tema
        WHERE exposicion_id = v_exposicion.exposicion_id
        AND tema_id = p_tema_id;

        FOR v_criterio IN
            SELECT criterio_exposicion_id
            FROM criterio_exposicion
            WHERE exposicion_id = v_exposicion.exposicion_id
        LOOP
            INSERT INTO revision_criterio_x_exposicion (
                exposicion_x_tema_id,
                criterio_exposicion_id,
                usuario_id,
                activo,
                fecha_creacion,
                fecha_modificacion
            ) VALUES (
                v_exposicion_x_tema_id,
                v_criterio.criterio_exposicion_id,
                p_miembro_jurado_id,
                TRUE,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            );
        END LOOP;
    END LOOP;
END

$$;

CREATE OR REPLACE FUNCTION actualizar_bloque_cambiados(bloques_json jsonb)
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
    bloque jsonb;
    usuario jsonb;
    id_exposicion integer;
    var_tema_id integer;
    id_usuario integer;
    usuario_tema_id integer;
    var_exposicion_x_tema_id integer;
BEGIN
    -- Validar y obtener id_exposicion
    SELECT (bloques_json->0->>'idExposicion')::integer INTO id_exposicion;
    IF id_exposicion IS NULL THEN
        RAISE EXCEPTION 'No se pudo obtener el idExposicion del JSON';
    END IF;

    FOR bloque IN SELECT * FROM jsonb_array_elements(bloques_json)
    LOOP
	 	IF bloque->'expo' IS NULL OR bloque->'expo'->>'id' IS NULL THEN
		    CONTINUE;
		END IF;
        var_tema_id := (bloque->'expo'->>'id')::integer;
        IF var_tema_id IS NULL THEN
            RAISE EXCEPTION 'El bloque no contiene un tema válido (expo.id)';
        END IF;

        -- Obtener exposicion_x_tema_id
        SELECT ext.exposicion_x_tema_id INTO var_exposicion_x_tema_id
        FROM exposicion_x_tema ext
        WHERE ext.exposicion_id = id_exposicion AND ext.tema_id = var_tema_id;

        IF var_exposicion_x_tema_id IS NULL THEN
            RAISE EXCEPTION 'No se encontró exposicion_x_tema_id para exposicion_id % y tema_id %', id_exposicion, var_tema_id;
        END IF;

        FOR usuario IN SELECT * FROM jsonb_array_elements(bloque->'expo'->'usuarios')
        LOOP
            id_usuario := (usuario->>'idUsario')::integer;
            IF id_usuario IS NULL THEN
                RAISE EXCEPTION 'Usuario sin idUsario válido en el JSON';
            END IF;

            SELECT tu.usuario_tema_id INTO usuario_tema_id
            FROM usuario_tema tu
            WHERE tu.tema_id = var_tema_id AND tu.usuario_id = id_usuario;

            IF usuario_tema_id IS NULL THEN
                -- Lo ignoramos porque el usuario no pertenece, como dijiste
                CONTINUE;
            END IF;

            -- Actualizar
            UPDATE control_exposicion_usuario
            SET estado_exposicion_usuario = 'esperando_respuesta',
                fecha_modificacion = NOW()
            WHERE exposicion_x_tema_id = var_exposicion_x_tema_id
              AND usuario_x_tema_id = usuario_tema_id;
        END LOOP;
    END LOOP;

    RETURN 'Actualización completada correctamente';

EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Error: ' || SQLERRM;
END;
$function$;

$$;

