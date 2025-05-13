-- 1) Tipo de usuario y dedicacion
INSERT INTO tipo_usuario (nombre,
                          activo,
                          fecha_creacion,
                          fecha_modificacion)
    VALUES ('profesor', TRUE, NOW(), NOW()),
           ('alumno', TRUE, NOW(), NOW()),
           ('coordinador', TRUE, NOW(), NOW()),
           ('administrador', TRUE, NOW(), NOW());


INSERT INTO sgta.tipo_dedicacion (iniciales, descripcion)
    VALUES ('TC', 'Tiempo completo'),
           ('TPC', 'Tiempo parcial convencional'),
           ('TPA', 'Tiempo parcial por asignaturas');

-- 2) Rol
INSERT INTO rol (nombre,
                 descripcion,
                 activo,
                 fecha_creacion,
                 fecha_modificacion)
    VALUES ('Asesor', 'Asesora a estudiantes en sus proyectos', TRUE, NOW(), NOW()),
           ('Jurado', 'Evalúa y califica exposiciones', TRUE, NOW(), NOW()),
           ('Revisor', '', TRUE, NOW(), NOW()),
           ('Tesista', 'Estudiante realizando tesis de grado o proyecto de fin de carrera', TRUE, NOW(), NOW()),
           ('Coasesor', 'Cosesora a estudiantes en sus proyectos', TRUE, NOW(), NOW());

-- 3) Estado de tema
INSERT INTO estado_tema (nombre,
                         descripcion,
                         activo,
                         fecha_creacion,
                         fecha_modificacion)
    VALUES ('PROPUESTO_LIBRE', 'Tema propuesto por asesor para que los alumnos postulen', TRUE, NOW(), NOW()),
           ('PROPUESTO_GENERAL', 'Tema propuesto por estudiante o estudiantes en general a una subárea de conocimiento', TRUE, NOW(), NOW()),
           ('PROPUESTO_DIRECTO', 'Tema propuesto por estudiante directamente a un profesor (no visible a otros profesores)', TRUE, NOW(), NOW()),
           ('PREINSCRITO', 'Tema propuesto por estudiante que cuenta con asesor aceptado', TRUE, NOW(), NOW()),
           ('INSCRITO', 'Tema inscrito con asesor con detalles formalizados', TRUE, NOW(), NOW()),
           ('REGISTRADO', 'Tema inscrito aceptado por comité de tesis', TRUE, NOW(), NOW()),
           ('RECHAZADO', 'Tema propuesto por estudiante que ha sido rechazado', TRUE, NOW(), NOW()),
           ('OBSERVADO', 'Tema inscrito con observaciones pendientes del comité de tesis', TRUE, NOW(), NOW()),
           ('VENCIDO', 'Tema propuesto por asesor o estudiantes que pasó su fecha de vencimiento definida', TRUE, NOW(), NOW()),
           ('EN_PROGRESO', 'Tema registrado en progreso', TRUE, NOW(), NOW()),
           ('PAUSADO', 'Tema que ha sido registrado e iniciado, pero no está en progreso actualmente', TRUE, NOW(), NOW()),
           ('FINALIZADO', 'Tema que ha sido registrado y ha finalizado su proceso de evaluación', TRUE, NOW(), NOW());

-- 4) Unidad académica
INSERT INTO unidad_academica (nombre,
                              descripcion)
    VALUES ('Facultad de Ciencias e Ingeniería', 'Unidad encargada de carreras de ingeniería');

-- 5) Carrera  (unidad_academica_id = 1)
INSERT INTO carrera (unidad_academica_id,
                     codigo,
                     nombre,
                     descripcion,
                     activo,
                     fecha_creacion,
                     fecha_modificacion)
    VALUES (1, 'INF', 'ingeniería informática', 'Carrera de software y sistemas', TRUE, NOW(), NOW()),
           (1, 'CIV', 'ingeniería civil', 'Carrera de construcción y estructuras', TRUE, NOW(), NOW()),
           (1, 'MEC', 'ingeniería mecánica', 'Carrera de diseño y manufactura de máquinas', TRUE, NOW(), NOW()),
           (1, 'IND', 'ingeniería industrial', 'Carrera de optimización de procesos', TRUE, NOW(), NOW());

-- 6) Grupo de investigación
INSERT INTO grupo_investigacion (nombre,
                                 descripcion,
                                 activo,
                                 fecha_creacion,
                                 fecha_modificacion)
    VALUES ('Grupo de Inteligencia Artificial PUCP', 'Investigación en IA y aprendizaje automático', TRUE, NOW(), NOW());

-- 7) Módulo
INSERT INTO modulo (nombre,
                    descripcion,
                    activo,
                    fecha_creacion,
                    fecha_modificacion)
    VALUES ('Temas', 'Gestión de propuestas y temas de investigación', TRUE, NOW(), NOW()),
           ('Asesores', 'Administración de asesores asignados', TRUE, NOW(), NOW()),
           ('Jurados', 'Administración de jurados de evaluación', TRUE, NOW(), NOW()),
           ('Revisión', 'Control y seguimiento de revisiones', TRUE, NOW(), NOW()),
           ('Reportes', 'Generación de informes y estadísticas', TRUE, NOW(), NOW());

-- 8) Área de conocimiento (ahora incluye carrera_id)
INSERT INTO area_conocimiento (carrera_id,
                               nombre,
                               descripcion,
                               activo,
                               fecha_creacion,
                               fecha_modificacion)
    VALUES
        -- ambas áreas las atribuimos a la carrera INF (carrera_id = 1)
        (1, 'ciencias de la computación', 'Disciplina de teorías y sistemas computacionales', TRUE, NOW(), NOW()),
        (1, 'sistemas de información', 'Estudio de sistemas para gestión de información', TRUE, NOW(), NOW()),
        (1, 'ciberseguridad', 'Protección de activos digitales ante amenazas', TRUE, NOW(), NOW());

-- 9) Sub-área de conocimiento (área_conocimiento_id = 1)
INSERT INTO sub_area_conocimiento (area_conocimiento_id,
                                   nombre,
                                   descripcion,
                                   activo,
                                   fecha_creacion,
                                   fecha_modificacion)
    VALUES (1, 'Procesamiento de lenguaje natural', 'Técnicas para análisis y generación de texto', TRUE, NOW(), NOW()),
           (1, 'Aprendizaje por reforzamiento', 'Métodos basados en recompensas y agentes', TRUE, NOW(), NOW()),
           (1, 'Procesamiento de imágenes', 'Algoritmos para interpretación de imágenes', TRUE, NOW(), NOW()),
           (1, 'Visión computacional', 'Análisis de imágenes y videos para tareas específicas', TRUE, NOW(), NOW()),
           (1, 'Machine Learning', 'Modelos computacionales de regresión y clasificación', TRUE, NOW(), NOW()),
           (2, 'Sistemas de gestión de bases de datos', 'Diseño y administración de bases de datos', TRUE, NOW(), NOW()),
           (2, 'Sistemas distribuidos', 'Arquitecturas y protocolos para sistemas distribuidos', TRUE, NOW(), NOW()),
           (2, 'Redes de computadoras', 'Interconexión y comunicación entre computadoras', TRUE, NOW(), NOW()),
           (2, 'Desarrollo de software', 'Metodologías y herramientas para desarrollo de software', TRUE, NOW(), NOW()),
           (2, 'Ingeniería de requisitos', 'Recopilación y análisis de requisitos de software', TRUE, NOW(), NOW()),
           (3, 'Seguridad en redes', 'Protección de redes y sistemas ante ataques', TRUE, NOW(), NOW()),
           (3, 'Criptografía', 'Técnicas para asegurar la información mediante cifrado', TRUE, NOW(), NOW()),
           (3, 'Seguridad en aplicaciones web', 'Protección de aplicaciones web contra vulnerabilidades', TRUE, NOW(), NOW()),
           (3, 'Seguridad en sistemas operativos', 'Protección de sistemas operativos ante amenazas', TRUE, NOW(), NOW()),
           (3, 'Análisis forense digital', 'Investigación de incidentes de seguridad digital', TRUE, NOW(), NOW());

-- 10) Tipo de solicitud
INSERT INTO tipo_solicitud (nombre,
                            descripcion,
                            activo,
                            fecha_creacion,
                            fecha_modificacion)
    VALUES ('Aprobación de tema (por coordinador)', 'Solicitud para que el coordinador apruebe el tema', TRUE, NOW(), NOW());

-- 11) Tipo de notificación
INSERT INTO tipo_notificacion (nombre,
                               descripcion,
                               prioridad,
                               activo,
                               fecha_creacion,
                               fecha_modificacion)
    VALUES ('informativa', 'Mensaje informativo para el usuario', 0, TRUE, NOW(), NOW()),
           ('advertencia', 'Señal de posible problema o riesgo', 1, TRUE, NOW(), NOW()),
           ('recordatorio', 'Recordatorio de acción pendiente', 2, TRUE, NOW(), NOW()),
           ('error', 'Notificación de error crítico', 3, TRUE, NOW(), NOW());

-- 1) Usuarios de ejemplo
INSERT INTO usuario (
    tipo_usuario_id,
    codigo_pucp,
    nombres,
    primer_apellido,
    segundo_apellido,
    correo_electronico,
    nivel_estudios,
    contrasena,
    biografia,
    foto_perfil,
    disponibilidad,
    tipo_disponibilidad,
    activo,
    fecha_creacion,
    fecha_modificacion
)
VALUES
    -- Profesor
    (1, 'P001', 'Juan',   'Pérez',   'Lopez',    'juan.perez@pucp.edu.pe',      'Doctorado', 'secret1', 'Profesor de IA', NULL, 'Lun-Vie 9-12', 'Presencial', TRUE, NOW(), NOW()),
    -- Alumno
    (2, 'A001', 'María',  'Gómez',   'Torres',   'maria.gomez@pucp.edu.pe',     'Pregrado',  'secret2', 'Estudiante de sistemas', NULL, 'Mar-Jue 14-18','Híbrido',     TRUE, NOW(), NOW()),
    -- Coordinador
    (3, 'C001', 'Luis',   'Ramírez', 'Díaz',     'luis.ramirez@pucp.edu.pe',     'Maestría',  'secret3', 'Coord. de tesis',        NULL, NULL,           NULL,         TRUE, NOW(), NOW()),
    -- Administrador
    (4, 'AD01','Carla',  'Vega',    'Reyna',    'carla.vega@pucp.edu.pe',      'Administración','secret4','Admin. del sistema',   NULL, NULL,           NULL,         TRUE, NOW(), NOW()),
    -- Nuevos profesores
  (1, 'P002', 'Ana',      'Martínez', 'Rojas',    'ana.martinez@pucp.edu.pe',    'Doctorado',   'secret5', 'Profesora de Sistemas',          NULL, 'Mar-Vie 10-13',    'Presencial', TRUE, NOW(), NOW()),
  (1, 'P003', 'Carlos',   'Sánchez',  'Mendoza',  'carlos.sanchez@pucp.edu.pe',  'Maestría',    'secret6', 'Profesor de Redes',              NULL, 'Lun-Mié 8-11',     'Presencial', TRUE, NOW(), NOW()),

  -- Nuevos alumnos
  (2, 'A002', 'Diego',    'Fernández','García',   'diego.fernandez@pucp.edu.pe', 'Pregrado',    'secret7', 'Estudiante de IA',               NULL, 'Lun-Vie 14-18',    'Híbrido',    TRUE, NOW(), NOW()),
  (2, 'A003', 'Sofía',    'Lima',     'Huertas',  'sofia.lima@pucp.edu.pe',      'Pregrado',    'secret8', 'Estudiante de Data Science',     NULL, 'Mar-Jue 10-12',    'Remoto',     TRUE, NOW(), NOW());


-- 2) Relación usuario_carrera (cada usuario con su carrera)
INSERT INTO usuario_carrera (
    usuario_id,
    carrera_id,
    activo,
    fecha_creacion,
    fecha_modificacion
)
VALUES
    -- Juan Pérez enseña en Ingeniería Mecánica (carrera_id = 3)
    (1, 3, TRUE, NOW(), NOW()),
    -- María Gómez estudia Ingeniería Informática (carrera_id = 1)
    (2, 1, TRUE, NOW(), NOW()),
    -- Luis Ramírez coordina Ingeniería Civil (carrera_id = 2)
    (3, 2, TRUE, NOW(), NOW()),
    -- Carla Vega administra Ingeniería Industrial (carrera_id = 4)
    (4, 4, TRUE, NOW(), NOW()),
        -- Ana Martínez enseña en Ingeniería Informática (carrera_id = 1)
    (5, 1, TRUE, NOW(), NOW()),
    -- Carlos Sánchez enseña en Ingeniería Informática (carrera_id = 1)
    (6, 1, TRUE, NOW(), NOW()),
    -- Diego Fernández estudia Ingeniería Informática (carrera_id = 1)
    (7, 1, TRUE, NOW(), NOW()),
    -- Sofía Lima estudia Ingeniería Informática (carrera_id = 1)
    (8, 1, TRUE, NOW(), NOW())
;

-- 3) Relación usuario_grupo_investigacion (asignar a todos al Grupo IA PUCP, id = 1)
INSERT INTO usuario_grupo_investigacion (usuario_id,
                                         grupo_investigacion_id,
                                         activo,
                                         fecha_creacion,
                                         fecha_modificacion)
    VALUES (1, 1, TRUE, NOW(), NOW()),
           (2, 1, TRUE, NOW(), NOW()),
           (3, 1, TRUE, NOW(), NOW()),
           (4, 1, TRUE, NOW(), NOW());

SELECT *
    FROM unidad_academica;
SELECT *
    FROM rol;
SELECT *
    FROM tipo_usuario;
SELECT *
    FROM estado_tema;
SELECT *
    FROM usuario;


-- Relacion Etapa formativa x ciclo

INSERT INTO etapa_formativa (nombre,
                             creditaje_por_tema,
                             duracion_exposicion,
                             activo,
                             fecha_creacion,
                             fecha_modificacion,
                             carrera_id)
    VALUES ('Proyecto de fin de carrera 1', 4.5, INTERVAL '20 minutes', TRUE, NOW(), NOW(), 1),
           ('Proyecto de fin de carrera 2', 4.0, INTERVAL '20 minutes', TRUE, NOW(), NOW(), 1);

INSERT INTO sala_exposicion (sala_exposicion_id,
                             nombre,
                             activo,
                             tipo_sala_exposicion,
                             fecha_creacion,
                             fecha_modificacion)
    VALUES
        -- Salas presenciales
        (1, 'V201', TRUE, 'presencial', NOW(), NOW()),
        (2, 'V202', TRUE, 'presencial', NOW(), NOW()),
        (3, 'V203', TRUE, 'presencial', NOW(), NOW()),
        (4, 'V204', TRUE, 'presencial', NOW(), NOW()),
        -- Salas virtuales
        (5, 'SALA VIRTUAL 001', TRUE, 'virtual', NOW(), NOW()),
        (6, 'SALA VIRTUAL 002', TRUE, 'virtual', NOW(), NOW()),
        (7, 'SALA VIRTUAL 003', TRUE, 'virtual', NOW(), NOW());

INSERT INTO etapa_formativa_x_sala_exposicion (etapa_formativa_id,
                                               sala_exposicion_id,
                                               activo,
                                               fecha_creacion,
                                               fecha_modificacion)
    VALUES (1, 1, TRUE, NOW(), NOW()),
           (1, 2, TRUE, NOW(), NOW()),
           (1, 3, TRUE, NOW(), NOW()),
           (1, 5, TRUE, NOW(), NOW()),
           (2, 1, TRUE, NOW(), NOW()),
           (2, 2, TRUE, NOW(), NOW()),
           (2, 6, TRUE, NOW(), NOW()),
           (2, 7, TRUE, NOW(), NOW());

INSERT INTO ciclo (semestre, anio, fecha_inicio, fecha_fin, activo, fecha_creacion, fecha_modificacion)
    VALUES ('1', 2025, '2025-03-21', '2025-07-15', TRUE, NOW(), NOW());

INSERT INTO etapa_formativa_x_ciclo (etapa_formativa_id,
                                     ciclo_id,
                                     activo,
                                     fecha_creacion,
                                     fecha_modificacion)
    VALUES (1, 1, TRUE, NOW(), NOW());

-- Entregables

INSERT INTO entregable (etapa_formativa_x_ciclo_id,
                        nombre,
                        descripcion,
                        fecha_inicio,
                        fecha_fin,
                        es_evaluable,
                        activo,
                        fecha_creacion,
                        fecha_modificacion)
    VALUES (1, 'Estado del arte', 'Estado del arte del tema', '2025-04-01', '2025-04-10', TRUE, TRUE, NOW(), NOW()),
           (1, 'Entregable 1', 'Entregable 1 del tema', '2025-05-10', '2025-05-16', TRUE, TRUE, NOW(), NOW());

INSERT INTO criterio_entregable (entregable_id,
                                 nombre,
                                 nota_maxima,
                                 descripcion,
                                 activo,
                                 fecha_creacion,
                                 fecha_modificacion)
    VALUES (1, 'Redaccion', 5, 'Redaccion del documento', TRUE, NOW(), NOW());

-- Exposiciones

INSERT INTO estado_planificacion (nombre,
                                  activo,
                                  fecha_creacion,
                                  fecha_modificacion)
    VALUES ('Sin planificar', TRUE, NOW(), NOW()),
           ('Planificacion inicial', TRUE, NOW(), NOW()),
           ('Fase 1', TRUE, NOW(), NOW()),
           ('Fase 2', TRUE, NOW(), NOW()),
           ('Cierre de planificación', TRUE, NOW(), NOW());

INSERT INTO exposicion(etapa_formativa_x_ciclo_id,
                       estado_planificacion_id,
                       activo,
                       nombre,
                       descripcion,
                       fecha_creacion)
    VALUES (1, 1, TRUE, 'Exposicion parcial', 'Exposicion parcial del proyecto', NOW()),
           (1, 1, TRUE, 'Exposicion final', 'Exposicion final del proyecto', NOW());

INSERT INTO criterio_exposicion(exposicion_id,
                                nombre,
                                descripcion,
                                nota_maxima,
                                activo,
                                fecha_creacion)
    VALUES (1, 'Entonacion', 'El alumno tiene una correcta entonacion durante toda la exposicion', 3.5, TRUE, NOW());

INSERT INTO jornada_exposicion (exposicion_id,
                                datetime_inicio,
                                datetime_fin,
                                activo,
                                fecha_creacion,
                                fecha_modificacion)
    VALUES (1, '2025-05-12 17:00:00', '2025-05-12 20:00:00', TRUE, NOW(), NOW()),
           (1, '2025-05-14 17:00:00', '2025-05-14 20:00:00', TRUE, NOW(), NOW());

INSERT INTO jornada_exposicion_x_sala_exposicion (jornada_exposicion_id,
                                                  sala_exposicion_id,
                                                  activo,
                                                  fecha_creacion,
                                                  fecha_modificacion)
    VALUES (1, 1, TRUE, NOW(), NOW()),
           (1, 2, TRUE, NOW(), NOW()),
           (1, 3, TRUE, NOW(), NOW()),
           (1, 4, TRUE, NOW(), NOW());


/* Parametros de configuración */

WITH nuevo_parametro AS (
    INSERT INTO parametro_configuracion (
                                         nombre, descripcion, modulo_id, activo, fecha_creacion, fecha_modificacion,
                                         tipo
        ) VALUES ('antiplagio',
                  'Configure la opcion de revision antiplagio',
                  4, TRUE, NOW(), NOW(), 'boolean') RETURNING parametro_configuracion_id)
INSERT
    INTO carrera_parametro_configuracion (carrera_id, parametro_configuracion_id, valor, activo, fecha_creacion, fecha_modificacion, etapa_formativa_id)
SELECT 1, parametro_configuracion_id, 'false', TRUE, NOW(), NOW(), 1
    FROM nuevo_parametro;


WITH nuevo_parametro AS (
    INSERT INTO parametro_configuracion (
                                         nombre, descripcion, modulo_id, activo, fecha_creacion, fecha_modificacion,
                                         tipo
        ) VALUES ('turnitin',
                  'Configure la opcion de revision turnitin',
                  4, TRUE, NOW(), NOW(), 'boolean') RETURNING parametro_configuracion_id)
INSERT
    INTO carrera_parametro_configuracion (carrera_id, parametro_configuracion_id, valor, activo, fecha_creacion, fecha_modificacion, etapa_formativa_id)
SELECT 1, parametro_configuracion_id, 'false', TRUE, NOW(), NOW(), 1
    FROM nuevo_parametro;


WITH nuevo_parametro AS (
    INSERT INTO parametro_configuracion (
                                         nombre, descripcion, modulo_id, activo, fecha_creacion, fecha_modificacion,
                                         tipo
        ) VALUES ('modalidad_delimitacion_tema',
                  'Define delimitación de tema de tesis',
                  1, TRUE, NOW(), NOW(), 'string') RETURNING parametro_configuracion_id)
INSERT
    INTO carrera_parametro_configuracion (carrera_id, parametro_configuracion_id, valor, activo, fecha_creacion, fecha_modificacion, etapa_formativa_id)
SELECT 1, parametro_configuracion_id, 'propuesta', TRUE, NOW(), NOW(), 1
    FROM nuevo_parametro;



WITH nuevo_parametro AS (
    INSERT INTO parametro_configuracion (
                                         nombre, descripcion, modulo_id, activo, fecha_creacion, fecha_modificacion,
                                         tipo
        ) VALUES ('fecha_limite_asesor',
                  'Establece la fecha máxima para cambios de asesor',
                  2, TRUE, NOW(), NOW(), 'date') RETURNING parametro_configuracion_id)
INSERT
    INTO carrera_parametro_configuracion (carrera_id, parametro_configuracion_id, valor, activo, fecha_creacion, fecha_modificacion, etapa_formativa_id)
SELECT 1, parametro_configuracion_id, '2025-06-30T00:00:00Z', TRUE, NOW(), NOW(), 1
    FROM nuevo_parametro;

/* NUEVOS */

INSERT INTO tema (tema_id,
                  codigo,
                  titulo,
                  resumen,
                  metodologia,
                  objetivos,
                  portafolio_url,
                  estado_tema_id,
                  proyecto_id,
                  carrera_id,
                  fecha_limite,
                  fecha_finalizacion,
                  activo,
                  fecha_creacion,
                  fecha_modificacion)
    VALUES (2, 'TEMA-002', 'Inteligencia Artificial Aplicada', 'Exploración de aplicaciones de IA en distintos campos como la medicina y la logística.', 'Investigación de campo y análisis de caso.', 'Estudiar aplicaciones de IA en entornos reales y su impacto.', 'https://www.example.com/ai-aplicada', 3, NULL, 1, '2024-12-01 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           (3, 'TEMA-003', 'Machine Learning para Datos No Estructurados', 'Uso de algoritmos de ML para datos no estructurados como imágenes y texto.', 'Clustering y análisis de patrones.', 'Aplicar técnicas de aprendizaje automático a datos no estructurados.', 'https://www.example.com/ml-no-estructurados', 3, NULL, 1, '2024-12-15 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           (4, 'TEMA-004', 'Redes Neuronales Profundas', 'Estudio de redes neuronales profundas y su uso en la clasificación de datos complejos.', 'Capacitación en redes neuronales y aprendizaje profundo.', 'Explorar arquitecturas avanzadas de redes neuronales para clasificación de datos.', 'https://www.example.com/redes-neuronales', 3, NULL, 1, '2024-12-10 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           (5, 'TEMA-005', 'Big Data y Análisis Predictivo', 'Aplicación de técnicas de big data para realizar predicciones de comportamiento en grandes volúmenes de datos.', 'Análisis exploratorio y técnicas predictivas.', 'Utilizar Big Data para predecir tendencias en diversos sectores.', 'https://www.example.com/bigdata-predictivo', 3, NULL, 1, '2024-12-20 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           (6, 'TEMA-006', 'Automatización en la Industria 4.0', 'Exploración de sistemas automatizados y su integración en la industria moderna.', 'Simulación y análisis de sistemas automatizados.', 'Implementar soluciones de automatización en procesos industriales.', 'https://www.example.com/industria-4-0', 3, NULL, 1, '2024-12-05 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           (7, 'TEMA-007', 'Blockchain y su Aplicación en Logística', 'Estudio del uso de blockchain para mejorar la trazabilidad en cadenas de suministro.', 'Investigación y análisis de caso de blockchain.', 'Explorar cómo blockchain puede mejorar la seguridad y transparencia en la logística.', 'https://www.example.com/blockchain-logistica', 3, NULL, 1, '2024-12-12 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           (8, 'TEMA-008', 'Ciberseguridad en la Era Digital', 'Estudio de las amenazas digitales actuales y las mejores prácticas de ciberseguridad.', 'Estudio de vulnerabilidades y técnicas de defensa.', 'Mejorar las habilidades de ciberseguridad en un entorno digital cambiante.', 'https://www.example.com/ciberseguridad-digital', 3, NULL, 1, '2024-12-18 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           (9, 'TEMA-009', 'Desarrollo de Software Ágil', 'Implementación de metodologías ágiles en el desarrollo de software.', 'Técnicas de desarrollo ágil y Scrum.', 'Optimizar el ciclo de desarrollo de software mediante metodologías ágiles.', 'https://www.example.com/software-agil', 3, NULL, 1, '2024-12-25 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           (10, 'TEMA-010', 'Internet de las Cosas (IoT)', 'Exploración de dispositivos conectados y su impacto en la vida cotidiana.', 'Análisis de datos y conectividad.', 'Investigar cómo IoT transforma industrias y hogares.', 'https://www.example.com/iot', 3, NULL, 1, '2024-12-30 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           (11, 'TEMA-011', 'Tecnologías Emergentes en Medicina', 'Exploración de nuevas tecnologías como la IA y la robótica en el ámbito médico.', 'Investigación sobre aplicaciones tecnológicas en el sector salud.', 'Estudiar cómo las tecnologías emergentes pueden transformar el sector médico.', 'https://www.example.com/tecnologias-medicina', 3, NULL, 1, '2025-01-05 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           (12, 'TEMA-012', 'Detección de depresión en estudiantes de Ingeniería Electrónica: Un caso de estudio', 'Este tema propone aplicar técnicas de visión por computadora para detectar informáticos deprimidos.', '', '', 'https://miuniversidad.edu/repos/tema003', 3, NULL, 1, '2025-05-10 10:00:00.000000 +00:00', NULL, TRUE, '2025-05-01 10:00:00.000000 +00:00', '2025-05-01 10:00:00.000000 +00:00');

INSERT INTO etapa_formativa_x_ciclo_x_tema (etapa_formativa_x_ciclo_id, tema_id, aprobado, fecha_modificacion)
    VALUES (1, 2, TRUE, NOW()),
           (1, 3, TRUE, NOW()),
           (1, 4, TRUE, NOW());

