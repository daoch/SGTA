INSERT INTO etapa_formativa (carrera_id,
                             nombre,
                             creditaje_por_tema,
                             duracion_exposicion)
    VALUES -- industrial
           (4, 'Trabajo de Investigación para Bachillerato', 4.5, INTERVAL '30 minutes'),


INSERT INTO area_conocimiento (carrera_id,
                               nombre,
                               descripcion)
    VALUES (4, 'Gestión de Operaciones', 'Optimización de procesos productivos'),
           (4, 'Logística', 'Gestión de cadenas de suministro'),
           (4, 'Investigación de Operaciones', 'Modelos matemáticos para toma de decisiones'),
           (4, 'Calidad', 'Gestión y control de calidad'),
           (4, 'Ergonomía', 'Diseño de sistemas centrados en el usuario');


INSERT INTO sub_area_conocimiento (area_conocimiento_id,
                                   nombre,
                                   descripcion)
    VALUES (14, 'Planeación de la producción', 'Optimización de procesos productivos'),
           (14, 'Gestión de inventarios', 'Control y manejo de inventarios'),
           (15, 'Transporte y distribución', 'Optimización de redes logísticas'),
           (15, 'Gestión de almacenes', 'Diseño y operación de almacenes'),
           (16, 'Simulación de procesos', 'Modelado y simulación de sistemas industriales'),
           (16, 'Optimización matemática', 'Aplicación de modelos matemáticos en la industria'),
           (17, 'Normas ISO', 'Implementación de estándares de calidad'),
           (17, 'Auditorías de calidad', 'Evaluación de sistemas de calidad'),
           (18, 'Diseño de estaciones de trabajo', 'Optimización de espacios de trabajo'),
           (18, 'Factores humanos', 'Estudio de la interacción entre personas y sistemas');

-- 4: a401, a402, a403, a404, a405, a406, a407, a408, dos salas virtuales

WITH salas AS (SELECT sala_exposicion_id, nombre, tipo_sala_exposicion
                   FROM sala_exposicion)
INSERT
    INTO etapa_formativa_x_sala_exposicion (etapa_formativa_id,
                                            sala_exposicion_id)
SELECT 7, sala_exposicion_id
    FROM salas
    WHERE (nombre LIKE 'A4%' OR nombre IN ('SALA VIRTUAL 001', 'SALA VIRTUAL 002'));


