-----------------------------------
--|    ESTRUCTURA DE CARRERA    |--
-----------------------------------

INSERT INTO etapa_formativa (carrera_id,
                             nombre,
                             creditaje_por_tema,
                             duracion_exposicion)
    VALUES -- informática
           (1, 'Proyecto de fin de carrera 1', 4.5, INTERVAL '20 minutes'),
           (1, 'Proyecto de fin de carrera 2', 4.0, INTERVAL '20 minutes'),

-- ver y evaluar https://dl.acm.org/ccs

INSERT INTO area_conocimiento (carrera_id,
                               nombre,
                               descripcion)
    VALUES (1, 'Ciencias de la Computación', 'Disciplina de teorías y sistemas computacionales'),
           (1, 'Sistemas de Información', 'Estudio de sistemas para gestión de información'),
           (1, 'Ciberseguridad', 'Protección de activos digitales ante amenazas');


INSERT INTO sub_area_conocimiento (area_conocimiento_id,
                                   nombre,
                                   descripcion)
    VALUES (1, 'Procesamiento de lenguaje natural', 'Técnicas para análisis y generación de texto'),
           (1, 'Aprendizaje por reforzamiento', 'Métodos basados en recompensas y agentes'),
           (1, 'Procesamiento de imágenes', 'Algoritmos para interpretación de imágenes'),
           (1, 'Visión computacional', 'Análisis de imágenes y videos para tareas específicas'),
           (1, 'Machine Learning', 'Modelos computacionales de regresión y clasificación'),

           (2, 'Sistemas de gestión de bases de datos', 'Diseño y administración de bases de datos'),
           (2, 'Sistemas distribuidos', 'Arquitecturas y protocolos para sistemas distribuidos'),
           (2, 'Redes de computadoras', 'Interconexión y comunicación entre computadoras'),
           (2, 'Desarrollo de software', 'Metodologías y herramientas para desarrollo de software'),
           (2, 'Ingeniería de requisitos', 'Recopilación y análisis de requisitos de software'),

           (3, 'Seguridad en redes', 'Protección de redes y sistemas ante ataques'),
           (3, 'Criptografía', 'Técnicas para asegurar la información mediante cifrado'),
           (3, 'Seguridad en aplicaciones web', 'Protección de aplicaciones web contra vulnerabilidades'),
           (3, 'Seguridad en sistemas operativos', 'Protección de sistemas operativos ante amenazas'),
           (3, 'Análisis forense digital', 'Investigación de incidentes de seguridad digital');

-- 1: v201, v202, v205 v206,v207, v208, tres salas virtuales

WITH salas AS (SELECT sala_exposicion_id, nombre, tipo_sala_exposicion
                   FROM sala_exposicion)
INSERT
    INTO etapa_formativa_x_sala_exposicion (etapa_formativa_id,
                                            sala_exposicion_id)

SELECT 1, sala_exposicion_id
    FROM salas
    WHERE nombre IN ('V201', 'V202', 'V205', 'V206', 'V207', 'V208',
                     'SALA VIRTUAL 001', 'SALA VIRTUAL 002', 'SALA VIRTUAL 003');

INSERT
    INTO etapa_formativa_x_sala_exposicion (etapa_formativa_id,
                                            sala_exposicion_id)
SELECT 2, sala_exposicion_id
    FROM salas
    WHERE nombre IN ('V201', 'V202', 'V205',
                     'SALA VIRTUAL 001', 'SALA VIRTUAL 002');



-----------------------------------
--| PARÁMETROS DE CONFIGURACIÓN |--
-----------------------------------


INSERT INTO carrera_parametro_configuracion (carrera_id,
                                             parametro_configuracion_id,
                                             valor,
                                             etapa_formativa_id)
SELECT 1,
       p.parametro_configuracion_id,
       v.valor,
       1
    FROM parametro_configuracion p
             JOIN (VALUES ('antiplagio', 'false'),
                          ('turnitin', 'false'),
                          ('modalidad_delimitacion_tema', 'propuesta'),
                          ('fecha_limite_asesor', '2025-06-30T00:00:00Z'),
                          ('LimXasesor', 3), --8
                          ('ActivarLimiteAsesor', TRUE),
                          ('TiempoLimiteRevisar', 5),
                          ('CantidadTesisXJurado', 4),
                          ('Cantidad Jurados', 3),
                          ('Tiempo Limite Jurado', 15),
                          ('Peso Asesor', 20),
                          ('Limite Propuestas Alumno', 2),
                          ('Limite Postulaciones Alumno', 2))
                        AS v(nombre, valor) ON p.nombre = v.nombre;


