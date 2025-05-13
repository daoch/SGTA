-- INSERTS PARA REPORTES
-- 1.1 Coordinador (ya existe en tu script original con usuario_id = 3)

-- 1.2 Asesores (tipo_usuario_id = 1, “profesor”), mismos de carrera que el coordinador (carrera_id = 2)
INSERT INTO usuario (
    usuario_id, tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido,
    correo_electronico, nivel_estudios, contrasena, biografia,
    activo, fecha_creacion, fecha_modificacion
) VALUES
      (5,  1, 'P002', 'Ana',    'Torres',   'González',  'ana.torres@pucp.edu.pe',  'Doctorado', 'pwd5', 'Asesora IA',   TRUE, NOW(), NOW()),
      (6,  1, 'P003', 'Carlos', 'Duarte',   'Ramírez',   'carlos.duarte@pucp.edu.pe','Doctorado','pwd6', 'Asesor SIC',   TRUE, NOW(), NOW());
-- El coordinador (3) y los asesores (5,6) comparten carrera_id = 2
INSERT INTO usuario_carrera (usuario_id, carrera_id, activo, fecha_creacion, fecha_modificacion)
VALUES
    (3, 2, TRUE, NOW(), NOW()),  -- coordinador
    (5, 2, TRUE, NOW(), NOW()),  -- Ana Torres
    (6, 2, TRUE, NOW(), NOW());  -- Carlos Duarte
-- 3.1 Dos temas de ejemplo en carrera_id = 2
INSERT INTO tema (
    tema_id, codigo, titulo, resumen, metodologia, objetivos,
    estado_tema_id, carrera_id, activo, fecha_creacion, fecha_modificacion
) VALUES
      (1, 'T-002', 'Optimización de rutas', 'Resumen Rutas', 'Método X', 'Reducir tiempo de viaje',
       1, 2, TRUE, NOW(), NOW()),
      (2, 'T-003', 'Análisis de datos',      'Resumen Datos','Método Y', 'Mejorar precisión',
       1, 2, TRUE, NOW(), NOW());
-- rol_id = 1 es “Asesor”
INSERT INTO usuario_tema (
    usuario_tema_id, usuario_id, tema_id, rol_id,
    asignado, activo, fecha_creacion, fecha_modificacion
) VALUES
      (1, 5, 1, 1, TRUE, TRUE, NOW(), NOW()),  -- Ana → Optimización de rutas
      (2, 6, 2, 1, TRUE, TRUE, NOW(), NOW());  -- Carlos → Análisis de datos
-- Ya existen sub_area_conocimiento_id = 1 (PLN), 2 (Refuerzo), 3 (Proc imágenes)
-- Y area_conocimiento_id = 1 (ciencias de la computación), 2 (sistemas de información)

INSERT INTO sub_area_conocimiento_tema (
    sub_area_conocimiento_id, tema_id, activo, fecha_creacion, fecha_modificacion
) VALUES
      (2, 1, TRUE, NOW(), NOW()),  -- “Aprendizaje por reforzamiento” → Ruta
      (3, 2, TRUE, NOW(), NOW());  -- “Procesamiento de imágenes”  → Datos
-- ciclo_id = 1  → semestre = '1', año = 2025
-- etapa_formativa_x_ciclo_id = 1  → vincula etapa_formativa_id = 1 con ciclo_id = 1
-- Ya existe exposicion_id = 1 para etapa_formativa_x_ciclo_id = 1

-- Relacionamos cada tema con esa exposición:
INSERT INTO exposicion_x_tema (
    exposicion_x_tema_id, exposicion_id, tema_id,
    estado_exposicion, activo, fecha_creacion, fecha_modificacion
) VALUES
      (1, 1, 1, 'programada', TRUE, NOW(), NOW()),  -- Ruta en ciclo 2025-1
      (2, 1, 2, 'programada', TRUE, NOW(), NOW());  -- Datos en ciclo 2025-1

---------------------------------------------------------------------------------------------------------------------------
-- ================================================
-- Datos de prueba para get_juror_distribution_by_coordinator_and_ciclo
-- Ciclo de ejemplo: “2025-1” (ciclo_id = 1)
-- Coordinador: usuario_id = 3 (carrera_id = 2)
-- ================================================

-- 1) Temas nuevos en carrera_id = 2
select*from exposicion_x_tema;

SELECT setval(
               pg_get_serial_sequence('tema','tema_id'),
               (SELECT MAX(tema_id) FROM tema)
       );

INSERT INTO tema (
    codigo, titulo, resumen, metodologia, objetivos,
    estado_tema_id, carrera_id, activo, fecha_creacion, fecha_modificacion
) VALUES
      ('TJ-01', 'Estudio de X',           'Resumen X', 'Método A', 'Objetivo A', 1, 2, TRUE, NOW(), NOW()),
      ('TJ-02', 'Investigación Y',        'Resumen Y', 'Método B', 'Objetivo B', 1, 2, TRUE, NOW(), NOW()),
      ('TJ-03', 'Proyecto Z',             'Resumen Z', 'Método C', 'Objetivo C', 1, 2, TRUE, NOW(), NOW());

-- 2) Mapear cada tema a una sub-área existente (área “ciencias de la computación”)
INSERT INTO sub_area_conocimiento_tema (
    sub_area_conocimiento_id, tema_id, activo, fecha_creacion, fecha_modificacion
) VALUES
      -- TJ-01 → Procesamiento de lenguaje natural (sub_area_conocimiento_id = 1)
      ( 1, (SELECT tema_id FROM tema WHERE codigo = 'TJ-01'), TRUE, NOW(), NOW()),
      -- TJ-02 → Aprendizaje por reforzamiento  (sub_area_conocimiento_id = 2)
      ( 2, (SELECT tema_id FROM tema WHERE codigo = 'TJ-02'), TRUE, NOW(), NOW()),
      -- TJ-03 → Procesamiento de imágenes       (sub_area_conocimiento_id = 3)
      ( 3, (SELECT tema_id FROM tema WHERE codigo = 'TJ-03'), TRUE, NOW(), NOW());

SELECT setval(
               pg_get_serial_sequence('exposicion_x_tema','exposicion_x_tema_id'),
               (SELECT COALESCE(MAX(exposicion_x_tema_id),0) FROM exposicion_x_tema)
       );

-- 3) Asignar los temas a la exposición del ciclo 2025-1 (exposicion_id = 1)
INSERT INTO exposicion_x_tema (
    exposicion_id, tema_id, estado_exposicion, activo, fecha_creacion, fecha_modificacion
) VALUES
      (1, (SELECT tema_id FROM tema WHERE codigo = 'TJ-01'), 'programada', TRUE, NOW(), NOW()),
      (1, (SELECT tema_id FROM tema WHERE codigo = 'TJ-02'), 'programada', TRUE, NOW(), NOW()),
      (1, (SELECT tema_id FROM tema WHERE codigo = 'TJ-03'), 'programada', TRUE, NOW(), NOW());

-- ◼️ Asegurar que nextval('usuario_usuario_id_seq') > cualquier usuario_id existente
SELECT setval(
               pg_get_serial_sequence('usuario','usuario_id'),
               (SELECT COALESCE(MAX(usuario_id), 1) FROM usuario)
       );

-- 4) Usuarios nuevos con rol “profesor” para actuar como jurados
INSERT INTO usuario (
    tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido,
    correo_electronico, nivel_estudios, contrasena, biografia,
    activo, fecha_creacion, fecha_modificacion
) VALUES
      (1, 'P006', 'Mónica', 'Ruiz',   'Valle',   'monica.ruiz@pucp.edu.pe',   'Doctorado', 'pwd9', 'Jurado IA', TRUE, NOW(), NOW()),
      (1, 'P007', 'Pablo',  'Flores', 'Gonzalez','pablo.flores@pucp.edu.pe',   'Doctorado', 'pwd10','Jurado Datos',TRUE, NOW(), NOW());

-- 5) Vincular a los jurados con la misma carrera que el coordinador (carrera_id = 2)
INSERT INTO usuario_carrera (
    usuario_id, carrera_id, activo, fecha_creacion, fecha_modificacion
) VALUES
      ((SELECT usuario_id FROM usuario WHERE correo_electronico = 'monica.ruiz@pucp.edu.pe'), 2, TRUE, NOW(), NOW()),
      ((SELECT usuario_id FROM usuario WHERE correo_electronico = 'pablo.flores@pucp.edu.pe'), 2, TRUE, NOW(), NOW());

SELECT setval(
               pg_get_serial_sequence('usuario_tema','usuario_tema_id'),
               (SELECT COALESCE(MAX(usuario_tema_id),0) FROM usuario_tema)
       );
-- 6) Asignar a los usuarios el rol de “Jurado” (rol_id = 2) sobre los temas
INSERT INTO usuario_tema (
    usuario_id, tema_id, rol_id, asignado, activo, fecha_creacion, fecha_modificacion
) VALUES
      -- Mónica Ruiz Valle evalúa TJ-01 y TJ-03
      (
          (SELECT usuario_id FROM usuario WHERE correo_electronico = 'monica.ruiz@pucp.edu.pe'),
          (SELECT tema_id    FROM tema    WHERE codigo = 'TJ-01'),
          2, TRUE, TRUE, NOW(), NOW()
      ),
      (
          (SELECT usuario_id FROM usuario WHERE correo_electronico = 'monica.ruiz@pucp.edu.pe'),
          (SELECT tema_id    FROM tema    WHERE codigo = 'TJ-03'),
          2, TRUE, TRUE, NOW(), NOW()
      ),
      -- Pablo Flores González evalúa TJ-02 y TJ-03
      (
          (SELECT usuario_id FROM usuario WHERE correo_electronico = 'pablo.flores@pucp.edu.pe'),
          (SELECT tema_id    FROM tema    WHERE codigo = 'TJ-02'),
          2, TRUE, TRUE, NOW(), NOW()
      ),
      (
          (SELECT usuario_id FROM usuario WHERE correo_electronico = 'pablo.flores@pucp.edu.pe'),
          (SELECT tema_id    FROM tema    WHERE codigo = 'TJ-03'),
          2, TRUE, TRUE, NOW(), NOW()
      );

-- Ahora, al ejecutar:
--   SELECT *
--     FROM get_juror_distribution_by_coordinator_and_ciclo(3, '2025-1');
-- obtendrás:

-- | teacher_name      | area_name                    | juror_count |
-- |-------------------|------------------------------|-------------|
-- | Mónica Ruiz Valle | ciencias de la computación   | 2           |
-- | Pablo Flores Gonzalez | ciencias de la computación | 2           |

------------------------------------------------------------------------------------------------------------------------
-- 1) Insertar un segundo entregable para el mismo ciclo/etapa
INSERT INTO entregable (
    etapa_formativa_x_ciclo_id,
    nombre,
    descripcion,
    fecha_inicio,
    fecha_fin,
    es_evaluable,
    activo,
    fecha_creacion,
    fecha_modificacion
) VALUES (
             1,                                  -- etapa_formativa_x_ciclo_id = 1 (ciclo 2025-1)
             'Plan preliminar',                  -- nuevo entregable
             'Primer borrador de la propuesta',
             '2025-04-05',                       -- dentro del rango del ciclo
             '2025-04-15',
             TRUE,
             TRUE,
             NOW(),
             NOW()
         );

-- 2) Asignar ambos entregables a cada tema (entregable_x_tema)
INSERT INTO entregable_x_tema (
    entregable_id,
    tema_id,
    estado,
    activo,
    fecha_creacion,
    fecha_modificacion
) VALUES
      -- Tema T-002 (Ana Torres):
      (
          (SELECT entregable_id FROM entregable WHERE nombre = 'Estado del arte'),
          (SELECT tema_id        FROM tema        WHERE codigo      = 'T-002'),
          'enviado_a_tiempo', TRUE, NOW(), NOW()
      ),
      (
          (SELECT entregable_id FROM entregable WHERE nombre = 'Plan preliminar'),
          (SELECT tema_id        FROM tema        WHERE codigo      = 'T-002'),
          'no_enviado',         TRUE, NOW(), NOW()
      ),

      -- Tema T-003 (Carlos Duarte):
      (
          (SELECT entregable_id FROM entregable WHERE nombre = 'Estado del arte'),
          (SELECT tema_id        FROM tema        WHERE codigo      = 'T-003'),
          'enviado_a_tiempo', TRUE, NOW(), NOW()
      ),
      (
          (SELECT entregable_id FROM entregable WHERE nombre = 'Plan preliminar'),
          (SELECT tema_id        FROM tema        WHERE codigo      = 'T-003'),
          'enviado_a_tiempo', TRUE, NOW(), NOW()
      );
---------------------------------------------------------------------------------------------------------
-- ================================================
-- Datos de prueba para get_topic_area_stats_by_user_and_ciclo
-- Ciclo de ejemplo: “2025-1” (ciclo_id = 1)
-- Coordinador: usuario_id = 3 (carrera_id = 2)
-- ================================================

-- 1) Agregar nuevas sub-áreas bajo “sistemas de información” (area_conocimiento_id = 2)
INSERT INTO sub_area_conocimiento (
    area_conocimiento_id,
    nombre,
    descripcion,
    activo,
    fecha_creacion,
    fecha_modificacion
) VALUES
      (2, 'Gestión de bases de datos', 'Modelado y optimización de bases de datos', TRUE, NOW(), NOW()),
      (2, 'Seguridad informática',     'Protección de sistemas y redes',    TRUE, NOW(), NOW());

-- 2) Insertar dos nuevos temas en la misma carrera (carrera_id = 2)
INSERT INTO tema (
    codigo,
    titulo,
    resumen,
    metodologia,
    objetivos,
    estado_tema_id,
    carrera_id,
    activo,
    fecha_creacion,
    fecha_modificacion
) VALUES
      ('T-004', 'Bases de datos relacionales', 'Resumen BD',    'Método SQL',   'Optimizar queries',     1, 2, TRUE, NOW(), NOW()),
      ('T-005', 'Seguridad en redes',         'Resumen Sec',   'Método XYZ',   'Proteger infraestr.',   1, 2, TRUE, NOW(), NOW());

-- 3) Mapear cada tema a la sub-área correspondiente
INSERT INTO sub_area_conocimiento_tema (
    sub_area_conocimiento_id,
    tema_id,
    activo,
    fecha_creacion,
    fecha_modificacion
) VALUES
      (
          (SELECT sub_area_conocimiento_id
           FROM sub_area_conocimiento
           WHERE nombre = 'Gestión de bases de datos'),
          (SELECT tema_id
           FROM tema
           WHERE codigo = 'T-004'),
          TRUE, NOW(), NOW()
      ),
      (
          (SELECT sub_area_conocimiento_id
           FROM sub_area_conocimiento
           WHERE nombre = 'Seguridad informática'),
          (SELECT tema_id
           FROM tema
           WHERE codigo = 'T-005'),
          TRUE, NOW(), NOW()
      );

-- 4) Asociar ambos temas a la exposición del ciclo 2025-1 (exposicion_id = 1)
INSERT INTO exposicion_x_tema (
    exposicion_id,
    tema_id,
    estado_exposicion,
    activo,
    fecha_creacion,
    fecha_modificacion
) VALUES
      (
          1,
          (SELECT tema_id FROM tema WHERE codigo = 'T-004'),
          'programada',
          TRUE,
          NOW(),
          NOW()
      ),
      (
          1,
          (SELECT tema_id FROM tema WHERE codigo = 'T-005'),
          'programada',
          TRUE,
          NOW(),
          NOW()
      );

-- 5) Insertar un tercer tema NO expuesto para probar el conteo de “no expuestos”
INSERT INTO tema (
    codigo,
    titulo,
    resumen,
    metodologia,
    objetivos,
    estado_tema_id,
    carrera_id,
    activo,
    fecha_creacion,
    fecha_modificacion
) VALUES
    ('T-006', 'Big Data Analytics', 'Resumen BD Analytics', 'Método MapReduce', 'Procesar grandes volúmenes', 1, 2, TRUE, NOW(), NOW());

INSERT INTO sub_area_conocimiento_tema (
    sub_area_conocimiento_id,
    tema_id,
    activo,
    fecha_creacion,
    fecha_modificacion
) VALUES
    (
        (SELECT sub_area_conocimiento_id
         FROM sub_area_conocimiento
         WHERE nombre = 'Gestión de bases de datos'),
        (SELECT tema_id
         FROM tema
         WHERE codigo = 'T-006'),
        TRUE, NOW(), NOW()
    );
--------------------------------------------------------------------------------------------------------------------------------------
-- ================================================
-- Datos de prueba para get_topic_area_trends_by_user
-- Coordinador: usuario_id = 3 (carrera_id = 2)
-- Se crean ciclos 2023-1 (id=2) y 2024-2 (id=3)
-- ================================================

-- 1) Ciclos históricos
INSERT INTO ciclo (semestre, anio, fecha_inicio, fecha_fin, activo, fecha_creacion, fecha_modificacion)
VALUES
    ('1', 2023, '2023-03-01', '2023-07-31', TRUE, NOW(), NOW()),  -- ciclo_id = 2
    ('2', 2024, '2024-08-01', '2024-12-31', TRUE, NOW(), NOW()); -- ciclo_id = 3

-- 2) Asociar la misma etapa_formativa_x_ciclo_id=1 a los nuevos ciclos
--    (reutilizamos etapa_formativa_id = 1 de tu script original)
INSERT INTO etapa_formativa_x_ciclo (etapa_formativa_id, ciclo_id, activo, fecha_creacion, fecha_modificacion)
VALUES
    (1, 2, TRUE, NOW(), NOW()),  -- etapa_formativa_x_ciclo_id = 2 → 2023-1
    (1, 3, TRUE, NOW(), NOW());  -- etapa_formativa_x_ciclo_id = 3 → 2024-2

-- 3) Exposiciones para cada ciclo
INSERT INTO exposicion (etapa_formativa_x_ciclo_id, estado_planificacion_id, activo, nombre, descripcion, fecha_creacion)
VALUES
    (2, 1, TRUE, 'Expo 2023-1', 'Exposición ciclo 2023-1', NOW()),  -- exposicion_id = 2
    (3, 1, TRUE, 'Expo 2024-2', 'Exposición ciclo 2024-2', NOW());  -- exposicion_id = 3

-- 4) Temas de 2023 (no expuestos) — fecha de creación fuerza año 2023
INSERT INTO tema (codigo, titulo, resumen, metodologia, objetivos, estado_tema_id, carrera_id, activo, fecha_creacion, fecha_modificacion)
VALUES
    ('T-007','Optimización ML','Resumen ML','Método ML','Mejorar modelo',1,2,TRUE,'2023-05-10','2023-05-10'),
    ('T-008','Visión Computacional','Resumen VC','Método CV','Detectar objetos',1,2,TRUE,'2023-06-15','2023-06-15');

-- 5) Mapear a sub-áreas
INSERT INTO sub_area_conocimiento_tema (sub_area_conocimiento_id, tema_id, activo, fecha_creacion, fecha_modificacion)
VALUES
    (2, (SELECT tema_id FROM tema WHERE codigo='T-007'), TRUE, NOW(), NOW()),  -- Aprendizaje por reforzamiento
    (3, (SELECT tema_id FROM tema WHERE codigo='T-008'), TRUE, NOW(), NOW());  -- Procesamiento de imágenes

-- 6) Temas de 2024 (expuestos en ciclo 2024-2)
INSERT INTO tema (codigo, titulo, resumen, metodologia, objetivos, estado_tema_id, carrera_id, activo, fecha_creacion, fecha_modificacion)
VALUES
    ('T-009','Modelado 3D','Resumen 3D','Método 3D','Crear mallas',1,2,TRUE,'2024-09-05','2024-09-05'),
    ('T-010','Ciberseguridad','Resumen CS','Método CS','Proteger datos',1,2,TRUE,'2024-10-20','2024-10-20');

-- 7) Mapear a sub-áreas
INSERT INTO sub_area_conocimiento_tema (sub_area_conocimiento_id, tema_id, activo, fecha_creacion, fecha_modificacion)
VALUES
    ((SELECT sub_area_conocimiento_id FROM sub_area_conocimiento WHERE nombre='Gestión de bases de datos'),
     (SELECT tema_id FROM tema WHERE codigo='T-009'),
     TRUE, NOW(), NOW()),
    ((SELECT sub_area_conocimiento_id FROM sub_area_conocimiento WHERE nombre='Seguridad informática'),
     (SELECT tema_id FROM tema WHERE codigo='T-010'),
     TRUE, NOW(), NOW());

-- 8) Asociar estos dos temas a la exposición del ciclo 2024-2
INSERT INTO exposicion_x_tema (exposicion_id, tema_id, estado_exposicion, activo, fecha_creacion, fecha_modificacion)
VALUES
    (3, (SELECT tema_id FROM tema WHERE codigo='T-009'), 'programada', TRUE, NOW(), NOW()),
    (3, (SELECT tema_id FROM tema WHERE codigo='T-010'), 'programada', TRUE, NOW(), NOW());

-- ================================================
-- Con estos datos tu función get_topic_area_trends_by_user(3)
-- devolverá algo similar a:
--
-- | area_name                  | year | topic_count |
-- |----------------------------|------|-------------|
-- | ciencias de la computación | 2023 |           2 |  -- T-007,T-008
-- | sistemas de información    | 2024 |           2 |  -- T-009,T-010
-- | ciencias de la computación | 2025 |           3 |  -- T-002,T-003,T-006 (ya existentes)
-- | sistemas de información    | 2025 |           2 |  -- T-004,T-005 (ya existentes)
-- ================================================

SELECT *
FROM public.get_advisor_distribution_by_coordinator_and_ciclo(3, '2025-1');

SELECT *
FROM public.get_juror_distribution_by_coordinator_and_ciclo(3, '2025-1');

SELECT *
FROM public.get_advisor_performance_by_user(3, '2025-1');

SELECT *
FROM public.get_topic_area_stats_by_user_and_ciclo(3, '2025-1');

SELECT *
FROM public.get_topic_area_trends_by_user(3);