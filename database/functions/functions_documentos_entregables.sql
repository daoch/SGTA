SET search_path = sgtadb

DROP FUNCTION IF EXISTS listar_etapas_formativas_alumno;
DROP FUNCTION IF EXISTS obtener_entregables_alumno;
DROP FUNCTION IF EXISTS listar_documentos_x_entregable;
DROP FUNCTION IF EXISTS entregar_entregable;

CREATE OR REPLACE FUNCTION listar_etapas_formativas_alumno(p_usuario_id INTEGER)
RETURNS TABLE (
    etapa_formativa_id INTEGER,
    etapa_formativa_nombre TEXT,
    ciclo_id INTEGER,
    ciclo_nombre VARCHAR,
    tema_id INTEGER,
    tema_titulo VARCHAR,
    tema_resumen TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ef.etapa_formativa_id,
        ef.nombre AS etapa_formativa_nombre,
        c.ciclo_id,
        c.nombre AS ciclo_nombre,
        t.tema_id,
        t.titulo AS tema_titulo,
        t.resumen AS tema_resumen
    FROM usuario_tema ut
    JOIN etapa_formativa_x_ciclo_x_tema efcxt ON efcxt.tema_id = ut.tema_id
    JOIN etapa_formativa_x_ciclo efc ON efc.etapa_formativa_x_ciclo_id = efcxt.etapa_formativa_x_ciclo_id
    JOIN etapa_formativa ef ON ef.etapa_formativa_id = efc.etapa_formativa_id
    JOIN ciclo c ON c.ciclo_id = efc.ciclo_id
    JOIN tema t ON t.tema_id = ut.tema_id
    WHERE ut.usuario_id = p_usuario_id
      AND ut.asignado = TRUE
      AND ut.rechazado = FALSE
      AND t.estado_tema_id IN (6, 10, 11, 12);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION obtener_entregables_alumno(p_usuario_id INTEGER)
RETURNS TABLE (
    entregable_id INTEGER,
    entregable_nombre VARCHAR,
    entregable_descripcion TEXT,
    entregable_fecha_inicio TIMESTAMP WITH TIME ZONE,
    entregable_fecha_fin TIMESTAMP WITH TIME ZONE,
    entregable_estado TEXT,
    entregable_es_evaluable BOOLEAN,
    entregable_maximo_documentos INTEGER,
    entregable_extensiones_permitidas TEXT,
    entregable_peso_maximo_documento INTEGER,
    etapa_formativa_id INTEGER,
    etapa_formativa_nombre TEXT,
    ciclo_id INTEGER,
    ciclo_nombre VARCHAR,
    ciclo_anio INTEGER,
    ciclo_semestre VARCHAR,
    tema_id INTEGER,
    fecha_envio TIMESTAMP WITH TIME ZONE,
    comentario TEXT,
	entregable_x_tema_id INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.entregable_id,
        e.nombre,
        e.descripcion,
        e.fecha_inicio,
        e.fecha_fin,
        et.estado::text,
        e.es_evaluable,
        e.maximo_documentos,
        e.extensiones_permitidas,
        e.peso_maximo_documento,
        ef.etapa_formativa_id,
        ef.nombre AS etapa_formativa_nombre,
        c.ciclo_id,
        c.nombre AS ciclo_nombre,
        c.anio AS ciclo_anio,
        c.semestre AS ciclo_semestre,
        et.tema_id,
        et.fecha_envio,
        et.comentario,
		et.entregable_x_tema_id
    FROM usuario_tema ut
    JOIN entregable_x_tema et ON et.tema_id = ut.tema_id
    JOIN entregable e ON e.entregable_id = et.entregable_id
    JOIN etapa_formativa_x_ciclo efc ON efc.etapa_formativa_x_ciclo_id = e.etapa_formativa_x_ciclo_id
    JOIN etapa_formativa ef ON ef.etapa_formativa_id = efc.etapa_formativa_id
    JOIN ciclo c ON c.ciclo_id = efc.ciclo_id
    JOIN tema t ON t.tema_id = ut.tema_id
    WHERE ut.usuario_id = p_usuario_id
      AND ut.asignado = TRUE
      AND ut.rechazado = FALSE
      AND t.estado_tema_id IN (6, 10, 11, 12);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_documentos_x_entregable(p_entregable_x_tema_id INTEGER)
RETURNS TABLE (
    documentoId INTEGER,
    nombre_documento VARCHAR,
    fecha_subida TIMESTAMP WITH TIME ZONE,
    link_archivo_subido TEXT,
    entregable_tema_id INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.documento_id AS documentoId,
        d.nombre_documento,
        d.fecha_subida,
        v.link_archivo_subido,
        v.entregable_x_tema_id AS entregable_tema_id
    FROM version_documento v
    JOIN documento d ON d.documento_id = v.documento_id
    WHERE v.entregable_x_tema_id = p_entregable_x_tema_id AND v.activo = TRUE AND d.activo = TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION entregar_entregable(
    p_entregable_x_tema_id INTEGER,
    p_comentario TEXT,
    p_estado TEXT
)
RETURNS VOID AS $$
BEGIN
    UPDATE entregable_x_tema
    SET
        fecha_envio = CURRENT_TIMESTAMP,
        comentario = p_comentario,
        estado = p_estado::enum_estado_entrega,
        fecha_modificacion = CURRENT_TIMESTAMP
    WHERE entregable_x_tema_id = p_entregable_x_tema_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION listar_temas_por_asociar_por_carrera(
  p_carrera_id    INTEGER
)
RETURNS TABLE (
  tema_id            INTEGER,
  codigo             TEXT,
  titulo             TEXT,
  estado_nombre      TEXT,
  carrera_id         INT,
  carrera_nombre     TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
    SELECT
      t.tema_id,
      t.codigo::text,
      t.titulo::text,
      et.nombre::text       AS estado_nombre,
      c.carrera_id,
      c.nombre::text        AS carrera_nombre
    FROM tema t
      JOIN estado_tema et
        ON t.estado_tema_id = et.estado_tema_id
      JOIN carrera c
        ON t.carrera_id = c.carrera_id
    WHERE
      t.carrera_id = p_carrera_id
      AND et.nombre IN ('REGISTRADO', 'EN_PROGRESO', 'PAUSADO')
      AND t.activo = TRUE
    ORDER BY t.fecha_creacion DESC;
END;
$$;

CREATE OR REPLACE FUNCTION listar_etapas_formativas_x_ciclo_x_carrera(
  p_carrera_id INTEGER
)
RETURNS TABLE (
  etapa_formativa_x_ciclo_id INTEGER,
  etapa_formativa_id INTEGER,
  etapa_formativa_nombre TEXT,
  ciclo_id INTEGER,
  ciclo_nombre VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
    SELECT
      efc.etapa_formativa_x_ciclo_id,
      ef.etapa_formativa_id,
      ef.nombre AS etapa_formativa_nombre,
      c.ciclo_id,
      c.nombre AS ciclo_nombre
    FROM etapa_formativa_x_ciclo efc
    INNER JOIN etapa_formativa ef ON efc.etapa_formativa_id = ef.etapa_formativa_id
    INNER JOIN ciclo c ON efc.ciclo_id = c.ciclo_id
    WHERE ef.carrera_id = p_carrera_id AND efc.activo = true AND ef.activo = true AND c.activo = true
    ORDER BY c.anio DESC, c.semestre DESC, ef.nombre;
END;
$$;

CREATE OR REPLACE FUNCTION asociar_tema_a_curso(
    p_curso_id INTEGER, -- etapa_formativa_x_ciclo_id
    p_tema_id INTEGER   -- tema_id
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_entregable RECORD;
	v_exposicion RECORD;
    v_etapa_formativa_x_ciclo_x_tema_id INTEGER;
    v_estado_en_progreso_id INTEGER;
BEGIN
    -- 0. Obtener el id del estado 'EN_PROGRESO'
    SELECT estado_tema_id INTO v_estado_en_progreso_id
    FROM estado_tema
    WHERE UPPER(nombre) = 'EN_PROGRESO'
    LIMIT 1;

    -- 1. Insertar en etapa_formativa_x_ciclo_x_tema
    INSERT INTO etapa_formativa_x_ciclo_x_tema (etapa_formativa_x_ciclo_id, tema_id, aprobado)
    VALUES (p_curso_id, p_tema_id, TRUE)
    RETURNING etapa_formativa_x_ciclo_x_tema_id INTO v_etapa_formativa_x_ciclo_x_tema_id;

    -- 2. Buscar entregables activos para el curso dado
    FOR v_entregable IN
        SELECT entregable_id
        FROM entregable
        WHERE etapa_formativa_x_ciclo_id = p_curso_id
          AND activo = TRUE
    LOOP
        -- 3. Insertar en entregable_x_tema
        INSERT INTO entregable_x_tema (entregable_id, tema_id, activo)
        VALUES (v_entregable.entregable_id, p_tema_id, TRUE);
    END LOOP;

	-- 4. Buscar exposiciones activas para el curso
	FOR v_exposicion IN
        SELECT exposicion_id
        FROM exposicion
        WHERE etapa_formativa_x_ciclo_id = p_curso_id
          AND activo = TRUE
    LOOP
        -- 5. Insertar en exposicion_x_tema
        INSERT INTO exposicion_x_tema (exposicion_id, tema_id, activo)
        VALUES (v_exposicion.exposicion_id, p_tema_id, TRUE);
    END LOOP;
	
    -- 6. Cambiar el estado del tema a EN_PROGRESO
    IF v_estado_en_progreso_id IS NOT NULL THEN
        UPDATE tema
        SET estado_tema_id = v_estado_en_progreso_id
        WHERE tema_id = p_tema_id;
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION borrar_documento(p_documento_id INTEGER)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Desactivar el documento
  UPDATE documento
  SET activo = FALSE
  WHERE documento_id = p_documento_id;

  -- Desactivar todas las versiones asociadas a ese documento
  UPDATE version_documento
  SET activo = FALSE
  WHERE documento_id = p_documento_id;
END;
$$;