-- Active: 1748374313012@@localhost@5432@postgres@public
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
    titulo  varchar,
    usuario_id integer,
     nombres varchar,
  apellidos varchar,
  rol_id integer,
  rol_nombre varchar
    
) AS $$
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
returns void as $$
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

		update exposicion_x_tema 
		set estado_exposicion = 'esperando_respuesta'
		where exposicion_x_tema_id = et_id;

    end loop;
end;
$$ language plpgsql;

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

CREATE OR REPLACE FUNCTION obtener_usuarios_con_temass()
 RETURNS TABLE(usuario_id integer, codigo_pucp character varying, nombres character varying, primer_apellido character varying, segundo_apellido character varying, correo_electronico character varying, nivel_estudios character varying, cantidad_temas_asignados bigint, tema_activo boolean, fecha_asignacion timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT DISTINCT ON (u.usuario_id)
        u.usuario_id,
        u.codigo_pucp,
        u.nombres,
        u.primer_apellido,
        u.segundo_apellido,
        u.correo_electronico,
        u.nivel_estudios,
        COUNT(ut.tema_id) OVER (PARTITION BY u.usuario_id) AS cantidad_temas_asignados,
        ut.activo AS tema_activo,
        ut.fecha_creacion AS fecha_asignacion
    FROM usuario u
    JOIN usuario_tema ut ON u.usuario_id = ut.usuario_id
    JOIN tema t ON ut.tema_id = t.tema_id
    WHERE ut.rol_id = 2 AND ut.activo = true
    ORDER BY u.usuario_id, ut.prioridad;
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

CREATE OR REPLACE FUNCTION listar_entregables_x_etapa_formativa_x_ciclo(etapaformativaxcicloid integer)
    RETURNS TABLE(id integer, etapa_formativa_x_ciclo_id integer, nombre character varying, descripcion text, fecha_inicio timestamp with time zone, fecha_fin timestamp with time zone, estado enum_estado_actividad, es_evaluable boolean)
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
    SELECT
        e.entregable_id AS id,
        e.etapa_formativa_x_ciclo_id,
        e.nombre,
        e.descripcion,
        e.fecha_inicio,
        e.fecha_fin,
        e.estado AS estado,
        e.es_evaluable
    FROM entregable e
    INNER JOIN etapa_formativa_x_ciclo efc ON e.etapa_formativa_x_ciclo_id = efc.etapa_formativa_x_ciclo_id
    WHERE efc.etapa_formativa_x_ciclo_id = etapaFormativaXCicloId
      AND e.activo = TRUE;
END;
$$;

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
	and c.carrera_id in(select uc.usuario_carrera_id
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
	ciclo text
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
	ciclo.nombre::text
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
WHERE ut.usuario_id = p_usuario_id
AND ext.estado_exposicion IN ('programada', 'calificada', 'completada');
END;
$$ LANGUAGE plpgsql;