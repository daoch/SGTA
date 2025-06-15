-- Tabla usuario
INSERT INTO usuario (usuario_id,codigo_pucp, id_cognito, nombres, primer_apellido, segundo_apellido,correo_electronico, tipo_usuario_id)
VALUES
(45,'20191203' ,'113b2550-7041-70f2-169a-a9846094d7ab', 'Cesar', 'Loli', 'Gonzalez','clolig@pucp.edu.pe', 2),
(46,'20202085' ,'212b05f0-f081-70a0-ff19-a1160d2fb842', 'Andrea', 'Acosta', 'Muñoz','c.acosta@pucp.edu.pe', 2),
(47, '20201122','c1ab0580-9021-70fc-0f79-c837dee6d9fb', 'Renzo', 'Iwamoto', 'Kanashiro','renzo.iwamoto@pucp.edu.pe', 1),
(48, '20141929','418b15c0-5081-704c-6627-20e0ea7f61ba', 'Luis', 'Mesajil', 'Mesajil','luis.mesajil@pucp.edu.pe', 1),
(49, '20201923','d16bd510-8061-705d-20e6-712e94e57482', 'Martha', 'Chavez', 'Cruz','a20201923@pucp.edu.pe', 1),
(50, '20193541','915bc5a0-0071-703c-e61a-a8276d386221', 'Jahir', 'Davila', 'Uribe','jahir.davila@pucp.edu.pe', 1);

-- Tabla usuario_carrera
INSERT INTO usuario_carrera (usuario_id, carrera_id, es_coordinador)
VALUES
(45, 1, false),
(46, 1, false),
(47, 1, false),
(48, 1, true),
(49, 1, false),
(50, 1, false);

-- Tabla usuario_area_conocimiento
INSERT INTO usuario_area_conocimiento (usuario_id, area_conocimiento_id)
VALUES
(47, 1),
(48, 1),
(49, 1),
(50, 1);

-- Tabla usuario_sub_area_conocimiento
INSERT INTO usuario_sub_area_conocimiento (usuario_id, sub_area_conocimiento_id)
VALUES
(47, 1),
(48, 1),
(49, 1),
(50, 1);

--
WITH matched_temas AS (
  SELECT
    t.tema_id AS tema_id,
    CASE
      WHEN LOWER(t.titulo) ILIKE '%lenguaje natural%' OR LOWER(t.resumen) ILIKE '%lenguaje natural%' THEN 1
      WHEN LOWER(t.titulo) ILIKE '%reforzamiento%' OR LOWER(t.resumen) ILIKE '%reforzamiento%' THEN 2
      WHEN LOWER(t.titulo) ILIKE '%imagen%' OR LOWER(t.resumen) ILIKE '%imagen%' THEN 3
      WHEN LOWER(t.titulo) ILIKE '%visión%' OR LOWER(t.resumen) ILIKE '%visión%' THEN 4
      WHEN LOWER(t.titulo) ILIKE '%machine learning%' OR LOWER(t.resumen) ILIKE '%machine learning%' OR
           LOWER(t.titulo) ILIKE '%deep learning%' OR LOWER(t.resumen) ILIKE '%deep learning%' THEN 5
      WHEN LOWER(t.titulo) ILIKE '%base de datos%' OR LOWER(t.resumen) ILIKE '%base de datos%' THEN 6
      WHEN LOWER(t.titulo) ILIKE '%sistema distribuido%' OR LOWER(t.resumen) ILIKE '%sistema distribuido%' THEN 7
      WHEN LOWER(t.titulo) ILIKE '%red%' OR LOWER(t.resumen) ILIKE '%red%' THEN 8
      WHEN LOWER(t.titulo) ILIKE '%software%' OR LOWER(t.resumen) ILIKE '%software%' THEN 9
      WHEN LOWER(t.titulo) ILIKE '%requisito%' OR LOWER(t.resumen) ILIKE '%requisito%' THEN 10
      WHEN (LOWER(t.titulo) ILIKE '%seguridad%' OR LOWER(t.resumen) ILIKE '%seguridad%')
           AND (LOWER(t.titulo) ILIKE '%red%' OR LOWER(t.resumen) ILIKE '%red%') THEN 11
      WHEN LOWER(t.titulo) ILIKE '%criptografía%' OR LOWER(t.resumen) ILIKE '%criptografía%' THEN 12
      ELSE NULL
    END AS sub_area_conocimiento_id
  FROM tema t
  WHERE t.carrera_id = 1
  and t.estado_tema_id = 12
)
INSERT INTO sub_area_conocimiento_tema (tema_id, sub_area_conocimiento_id)
SELECT tema_id, sub_area_conocimiento_id
FROM matched_temas
WHERE sub_area_conocimiento_id IS NOT null
ON CONFLICT DO NOTHING;