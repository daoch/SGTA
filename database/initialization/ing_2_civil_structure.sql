INSERT INTO etapa_formativa (carrera_id,
                             nombre,
                             creditaje_por_tema,
                             duracion_exposicion)
    VALUES -- civil
           (2, 'Plan de tesis', 4.5, INTERVAL '30 minutes'),
           (2, 'Trabajo de tesis', 4.0, INTERVAL '30 minutes'),


INSERT INTO area_conocimiento (carrera_id,
                               nombre,
                               descripcion)
    VALUES (2, 'Estructuras', 'Estudio y diseño de estructuras resistentes'),
           (2, 'Hidráulica', 'Análisis y diseño de sistemas hidráulicos'),
           (2, 'Geotecnia', 'Estudio del comportamiento de suelos y rocas'),
           (2, 'Construcción', 'Gestión y técnicas de construcción'),
           (2, 'Transporte', 'Diseño y planificación de sistemas de transporte');


INSERT INTO sub_area_conocimiento (area_conocimiento_id,
                                   nombre,
                                   descripcion)
    VALUES (4, 'Diseño estructural', 'Cálculo y diseño de estructuras de concreto y acero'),
           (4, 'Dinámica estructural', 'Análisis de estructuras sometidas a cargas dinámicas'),
           (4, 'Puentes', 'Diseño y construcción de puentes'),
           (5, 'Hidrología', 'Estudio del ciclo del agua y recursos hídricos'),
           (5, 'Sistemas de drenaje', 'Diseño de sistemas de drenaje pluvial'),
           (6, 'Mecánica de suelos', 'Estudio de propiedades y comportamiento de suelos'),
           (6, 'Cimentaciones', 'Diseño de cimentaciones para estructuras'),
           (7, 'Gestión de proyectos', 'Planificación y control de proyectos de construcción'),
           (7, 'Materiales de construcción', 'Estudio de materiales utilizados en construcción'),
           (8, 'Planeamiento urbano', 'Diseño y planificación de ciudades'),
           (8, 'Ingeniería de tráfico', 'Análisis y diseño de sistemas de tráfico');

-- 2: a201, a202, a203, a204, a205, a206, a207, a208, dos salas virtuales

WITH salas AS (SELECT sala_exposicion_id, nombre, tipo_sala_exposicion
                   FROM sala_exposicion)
INSERT
    INTO etapa_formativa_x_sala_exposicion (etapa_formativa_id,
                                            sala_exposicion_id)
SELECT 3, sala_exposicion_id
    FROM salas
    WHERE (nombre LIKE 'A2%' OR nombre IN ('SALA VIRTUAL 001', 'SALA VIRTUAL 002'));