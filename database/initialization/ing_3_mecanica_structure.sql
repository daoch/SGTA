INSERT INTO etapa_formativa (carrera_id,
                             nombre,
                             creditaje_por_tema,
                             duracion_exposicion)
    VALUES -- mecánica
           (3, 'Proyecto de tesis 1', 4.5, INTERVAL '20 minutes'),
           (3, 'Proyecto de tesis 2', 4.0, INTERVAL '20 minutes');


INSERT INTO area_conocimiento (carrera_id,
                               nombre,
                               descripcion)
    VALUES (3, 'Diseño Mecánico', 'Diseño y análisis de sistemas mecánicos'),
           (3, 'Termodinámica', 'Estudio de la energía y sus transformaciones'),
           (3, 'Mecánica de Fluidos', 'Análisis del comportamiento de fluidos'),
           (3, 'Manufactura', 'Procesos de fabricación y producción'),
           (3, 'Robótica', 'Diseño y control de sistemas robóticos');


INSERT INTO sub_area_conocimiento (area_conocimiento_id,
                                   nombre,
                                   descripcion)
    VALUES (9, 'Elementos de máquinas', 'Diseño de componentes mecánicos'),
           (9, 'Análisis por elementos finitos', 'Simulación de sistemas mecánicos'),
           (10, 'Transferencia de calor', 'Estudio de mecanismos de transferencia de calor'),
           (10, 'Energías renovables', 'Aplicación de energías limpias en sistemas térmicos'),
           (11, 'Dinámica de fluidos', 'Análisis de flujo de fluidos en sistemas mecánicos'),
           (11, 'Turbomáquinas', 'Diseño y análisis de máquinas hidráulicas y térmicas'),
           (12, 'Procesos de manufactura', 'Estudio de técnicas de fabricación'),
           (12, 'Control de calidad', 'Gestión de calidad en procesos de manufactura'),
           (13, 'Sistemas de control', 'Diseño y análisis de sistemas de control robótico'),
           (13, 'Inteligencia artificial en robótica', 'Aplicación de IA en sistemas robóticos');

-- 3: a301, a302, a303, a304, a305, a306, a307, a308, una sala virtual

WITH salas AS (SELECT sala_exposicion_id, nombre, tipo_sala_exposicion
                   FROM sala_exposicion)
INSERT
    INTO etapa_formativa_x_sala_exposicion (etapa_formativa_id,
                                            sala_exposicion_id)
-- Informática (etapa_formativa_id = 1)
SELECT 5, sala_exposicion_id
    FROM salas
    WHERE (nombre LIKE 'A3%' OR nombre = 'SALA VIRTUAL 001');

