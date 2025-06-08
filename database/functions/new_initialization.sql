--COMENTAR SI NO LES HACE FALTA
--SET search_path TO sgtadb;

----------------------------------
--|           TIPOS            |--
----------------------------------

INSERT INTO tipo_usuario (nombre,
                          activo,
                          fecha_creacion,
                          fecha_modificacion)
    VALUES ('profesor', TRUE, NOW(), NOW()),
           ('alumno', TRUE, NOW(), NOW()),
           ('coordinador', TRUE, NOW(), NOW()),
           ('administrador', TRUE, NOW(), NOW());


INSERT INTO tipo_dedicacion (iniciales, descripcion)
    VALUES ('TC', 'Tiempo completo'),
           ('TPC', 'Tiempo parcial convencional'),
           ('TPA', 'Tiempo parcial por asignaturas');


INSERT INTO tipo_solicitud (nombre,
                            descripcion,
                            activo,
                            fecha_creacion,
                            fecha_modificacion)
    VALUES ('Aprobación de tema (por coordinador)', 'Solicitud para que el coordinador apruebe el tema', TRUE, NOW(), NOW()),
           ('Solicitud de cambio de título', 'Modificar el título del tema', TRUE, NOW(), NOW()),
           ('Solicitud de cambio de resumen', 'Modificar el resumen del tema', TRUE, NOW(), NOW()),
           ('Cambio de asesor (por asesor)', 'Solicitud para que el coordinador apruebe el cambio de asesores', TRUE, NOW(), NOW());


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


INSERT INTO tipo_rechazo_tema (nombre, descripcion)
    VALUES ('Inconsistencia en objetivos', 'Los objetivos planteados no guardan coherencia con la metodología propuesta.'),
           ('Falta de viabilidad técnica', 'El proyecto propuesto no puede ser llevado a cabo con los recursos o conocimientos disponibles.'),
           ('Duplicación de tema', 'El tema ya ha sido aprobado previamente por otro estudiante.'),
           ('Contenido insuficiente', 'El planteamiento del problema o la justificación no es suficientemente sólido.'),
           ('Fuera del alcance académico', 'El tema no se ajusta al perfil de la carrera o a los objetivos del curso.'),
           ('Propuesta incompleta', 'El formulario fue entregado sin todos los campos requeridos.'),
           ('Problemas éticos o legales', 'La propuesta presenta conflictos éticos o legales que impiden su aprobación.');


INSERT INTO tipo_observacion (nombre_tipo)
    VALUES ('Contenido'),
           ('Similitud'),
           ('Citado'),
           ('Inteligencia Artificial');

----------------------------------
--|      ENTIDADES FIJAS       |--
----------------------------------

INSERT INTO rol (nombre,
                 descripcion,
                 activo,
                 fecha_creacion,
                 fecha_modificacion)
    VALUES ('Asesor', 'Asesora a estudiantes en sus proyectos', TRUE, NOW(), NOW()),
           ('Jurado', 'Está presente, evalúa y califica exposiciones', TRUE, NOW(), NOW()),
           ('Revisor', 'Califica exposiciones y entregables', TRUE, NOW(), NOW()),
           ('Tesista', 'Estudiante realizando tesis de grado o proyecto de fin de carrera', TRUE, NOW(), NOW()),
           ('Coasesor', 'Cosesora a estudiantes en sus proyectos', TRUE, NOW(), NOW()),
           ('Alumno', 'Alumno de la universidad', TRUE, NOW(), NOW());


--ESTADOS

INSERT INTO estado_planificacion (nombre,
                                  activo,
                                  fecha_creacion,
                                  fecha_modificacion)
    VALUES ('Sin planificar', TRUE, NOW(), NOW()),
           ('Planificacion inicial', TRUE, NOW(), NOW()),
           ('Fase 1', TRUE, NOW(), NOW()),
           ('Fase 2', TRUE, NOW(), NOW()),
           ('Cierre de planificacion', TRUE, NOW(), NOW());


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


INSERT INTO rol_solicitud (nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
    VALUES ('REMITENTE', 'Usuario que inicia la solicitud', TRUE, NOW(), NOW()),
           ('DESTINATARIO', 'Usuario al que está dirigida la solicitud', TRUE, NOW(), NOW()),
           ('ASESOR_ACTUAL', 'Asesor vigente del usuario', TRUE, NOW(), NOW()),
           ('ASESOR_ENTRADA', 'Asesor saliente del usuario', TRUE, NOW(), NOW());


INSERT INTO accion_solicitud (nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
    VALUES ('SIN_ACCION', 'Sin acción tomada aún', TRUE, NOW(), NOW()),
           ('PENDIENTE_ACCION', 'En espera de una acción', TRUE, NOW(), NOW()),
           ('APROBADO', 'Solicitud aprobada', TRUE, NOW(), NOW()),
           ('RECHAZADO', 'Solicitud rechazada', TRUE, NOW(), NOW());


INSERT INTO estado_solicitud (nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
    VALUES ('PENDIENTE', 'La solicitud está en proceso de evaluación', TRUE, NOW(), NOW()),
           ('ACEPTADA', 'La solicitud ha sido aceptada', TRUE, NOW(), NOW()),
           ('RECHAZADA', 'La solicitud ha sido rechazada', TRUE, NOW(), NOW());


---------------------------------------
--|  DATOS DE INFRAESTRUCT. TEMAS   |--
---------------------------------------


INSERT INTO unidad_academica (nombre,
                              descripcion)
    VALUES ('Facultad de Ciencias e Ingeniería', 'Unidad encargada de carreras de ingeniería');

--Solo los registros activos serán para FACI - INFORMÁTICA

INSERT INTO carrera (unidad_academica_id,
                     codigo,
                     nombre,
                     descripcion,
                     activo,
                     fecha_creacion,
                     fecha_modificacion)
    VALUES (1, 'INF', 'Ingeniería Informática', 'Carrera de software y sistemas', TRUE, NOW(), NOW()),
           (1, 'CIV', 'Ingeniería Civil', 'Carrera de construcción y estructuras', TRUE, NOW(), NOW()),
           (1, 'MEC', 'Ingeniería Mecánica', 'Carrera de diseño y manufactura de máquinas', TRUE, NOW(), NOW()),
           (1, 'IND', 'Ingeniería Industrial', 'Carrera de optimización de procesos', TRUE, NOW(), NOW());


INSERT INTO grupo_investigacion (nombre,
                                 descripcion,
                                 activo,
                                 fecha_creacion,
                                 fecha_modificacion)
    VALUES ('Grupo de Inteligencia Artificial PUCP', 'Investigación en IA y aprendizaje automático', TRUE, NOW(), NOW()),
           ('Grupo de Investigación HCI-DUXAIT-PUCP', 'Investigación que contribuya en las áreas de la Interacción Humano-Computador (HCI) y en el Desarrollo Tecnológico e Innovación', TRUE, NOW(), NOW());


INSERT INTO proyecto (titulo, descripcion, estado)
    VALUES ('Sistema de Monitoreo Ambiental', 'Desarrollo de sensores conectados para medir la calidad del aire.', 'EN_PROCESO'),
           ('Plataforma de Tutoría Académica', 'Aplicación web para gestionar sesiones de tutoría entre estudiantes y profesores.', 'EN_PROCESO'),
           ('Simulador de Tráfico Urbano','Simulación de flujo vehicular','EN_PROCESO'),
           ('Sistema de Gestión de Inventarios','Aplicación para controlar inventarios en tiempo real','EN_PROCESO');

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

-- ver y evaluar https://dl.acm.org/ccs

INSERT INTO area_conocimiento (carrera_id,
                               nombre,
                               descripcion,
                               activo,
                               fecha_creacion,
                               fecha_modificacion)
    VALUES (1, 'Ciencias de la Computación', 'Disciplina de teorías y sistemas computacionales', TRUE, NOW(), NOW()),
           (1, 'Sistemas de Información', 'Estudio de sistemas para gestión de información', TRUE, NOW(), NOW()),
           (1, 'Ciberseguridad', 'Protección de activos digitales ante amenazas', TRUE, NOW(), NOW());


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

----------------------------------
--|   DATOS PARA OPERACIÓN     |--
----------------------------------


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

--USO DE CICLOS Y OPERATIVA DE EXPOSICIONES

INSERT INTO ciclo (semestre, anio, fecha_inicio, fecha_fin, activo, fecha_creacion, fecha_modificacion)
    VALUES ('1', 2025, '2025-03-21', '2025-07-15', TRUE, NOW(), NOW());


INSERT INTO etapa_formativa_x_ciclo (etapa_formativa_id,
                                     ciclo_id,
                                     estado,
                                     activo,
                                     fecha_creacion,
                                     fecha_modificacion)
    VALUES (1, 1, 'En Curso', TRUE, NOW(), NOW());


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


INSERT INTO exposicion(etapa_formativa_x_ciclo_id,
                       estado_planificacion_id,
                       activo,
                       nombre,
                       descripcion,
                       fecha_creacion)
    VALUES (1, 5, TRUE, 'Exposicion parcial', 'Exposicion parcial del proyecto', NOW()),
           (1, 1, TRUE, 'Exposicion final', 'Exposicion final del proyecto', NOW());


INSERT INTO criterio_exposicion(exposicion_id,
                                nombre,
                                descripcion,
                                nota_maxima,
                                activo,
                                fecha_creacion)
    VALUES (1, 'Entonación', 'El alumno tiene una correcta entonación durante toda la exposición', 3.0, TRUE, NOW()),
           (1, 'Dominio del tema', 'Demuestra conocimiento profundo y comprensión del tema presentado', 4.0, TRUE, NOW()),
           (1, 'Material de apoyo', 'Las diapositivas y recursos visuales son claros y apoyan efectivamente la presentación', 3.0, TRUE, NOW()),
           (1, 'Organización', 'La presentación sigue una estructura lógica y coherente', 3.0, TRUE, NOW()),
           (1, 'Tiempo', 'Se ajusta al tiempo asignado para la presentación', 2.0, TRUE, NOW()),
           (1, 'Respuesta a preguntas', 'Responde las preguntas del jurado de manera clara y precisa', 5.0, TRUE, NOW());


-- OPERATIVA DE ENTREGABLES

INSERT INTO entregable (etapa_formativa_x_ciclo_id,
                        nombre,
                        descripcion,
                        fecha_inicio,
                        fecha_fin,
                        estado,
                        es_evaluable,
                        maximo_documentos,
                        extensiones_permitidas,
                        peso_maximo_documento,
                        activo)
    VALUES (1, 'Informe de avance 1', 'Primer entregable con criterios básicos.', '2025-05-10 08:00:00+00', '2025-05-20 23:59:00+00', 'terminado', TRUE, 3, 'pdf,docx', 10, TRUE),
           (1, 'Presentación final', 'Entrega de presentación en PowerPoint o PDF.', '2025-06-01 08:00:00+00', '2025-06-15 23:59:00+00', 'no_iniciado', FALSE, 1, 'pdf,pptx', 15, TRUE),
           (1, 'Anexos del proyecto', 'Material adicional del proyecto: códigos, gráficos, etc.', '2025-05-15 08:00:00+00', '2025-05-30 23:59:00+00', 'no_iniciado', TRUE, 5, 'pdf,zip,rar', 25, TRUE);


INSERT INTO criterio_entregable (entregable_id,
                                 nombre,
                                 nota_maxima,
                                 descripcion)
    VALUES (1, 'Originalidad del contenido', 4.00, 'Se evalúa la capacidad de presentar ideas propias y enfoques creativos en el entregable.'),
           (1, 'Claridad y coherencia en la redacción', 5.00, 'Se evalúa la claridad, coherencia y cohesión del contenido entregado.'),
           (1, 'Cumplimiento de requisitos', 6.00, 'Se verifica que el entregable cumpla con todos los requisitos solicitados.'),
           (1, 'Presentación del contenido', 2.00, 'Se evalúa el formato, uso adecuado de gráficos, y presentación ordenada del entregable.'),
           (1, 'Análisis crítico', 3.00, 'Se mide la capacidad para interpretar y argumentar los resultados con pensamiento crítico.'),

           (2, 'Originalidad del contenido', 4.00, 'Se evalúa la capacidad de presentar ideas propias y enfoques creativos en el entregable.'),
           (2, 'Claridad y coherencia en la redacción', 5.00, 'Se evalúa la claridad, coherencia y cohesión del contenido entregado.'),
           (2, 'Cumplimiento de requisitos', 6.00, 'Se verifica que el entregable cumpla con todos los requisitos solicitados.'),
           (2, 'Presentación del contenido', 2.00, 'Se evalúa el formato, uso adecuado de gráficos, y presentación ordenada del entregable.'),
           (2, 'Análisis crítico', 3.00, 'Se mide la capacidad para interpretar y argumentar los resultados con pensamiento crítico.');

           --(3, 'Amplitud del contenido', 4.00, 'Se evalúa la profundidad y amplitud del contenido presentado en el entregable.'),
           --(3, 'Claridad y coherencia en la redacción', 5.00, 'Se evalúa la claridad, coherencia y cohesión del contenido entregado.'),
           --(3, 'Cumplimiento de requisitos', 6.00, 'Se verifica que el entregable cumpla con todos los requisitos solicitados.'),
           --(3, 'Presentación del contenido', 2.00, 'Se evalúa el formato, uso adecuado de gráficos, y presentación ordenada del entregable.'),
           --(3, 'Análisis crítico', 3.00, 'Se mide la capacidad para interpretar y argumentar los resultados con pensamiento crítico.');


--------------------------------------
--|     USUARIOS PARTICIPANTES     |--
--------------------------------------

-- Profesores

INSERT INTO usuario (tipo_usuario_id,
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
                     tipo_dedicacion_id,
                     activo,
                     fecha_creacion,
                     fecha_modificacion)
    VALUES (1, 'PROF001', 'Johan Paul', 'Baldeón', 'Medrano', 'j.baldeon00@pucp.edu.pe', 'Doctorado', 'johanbpass', 'Profesor de Algoritmos, Gamificación e Implementación', NULL, 'Lun-Vie 9-12', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF002', 'Freddy Alberto', 'Paz', 'Espinoza', 'f.paz00@pucp.edu.pe', 'Maestría', 'freddyppass', 'Profesor de Programación y diseño de interfaces', NULL, 'Mar-Vie 10-13', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF003', 'César Augusto', 'Aguilera', 'Serpa', 'c.aguilera00@pucp.edu.pe', 'Maestría', 'cesarapass', 'Profesor de Base de Datos e Implementación', NULL, 'Lun-Mié 8-11', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF004', 'Edwin Rafael', 'Villanueva', 'Talavera', 'e.villanueva00@pucp.edu.pe', 'Doctorado', 'edwinvpass', 'Profesor de Inteligencia Artificial', NULL, 'Mar-Vie 10-13', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF005', 'César Armando', 'Beltrán', 'Castañón', 'c.beltran00@pucp.edu.pe', 'Maestría', 'cesarbpass', 'Profesor de Machine Learning', NULL, 'Lun-Mié 8-11', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF006', 'Luis Fernando', 'Muroya', 'Tokushima', 'l.muroya00@pucp.edu.pe', 'Doctorado', 'luismpass', 'Profesor de Procesamiento de Lenguaje Natural', NULL, 'Mar-Vie 10-13', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF007', 'Héctor Erasmo', 'Gómez', 'Montoya', 'h.gomez00@pucp.edu.pe', 'Maestría', 'hectorgpass', 'Profesor de Procesamiento de Lenguaje Natural', NULL, 'Lun-Mié 8-11', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF008', 'Manuel Francisco', 'Tupia', 'Anticona', 'm.tupia00@pucp.edu.pe', 'Doctorado', 'manueltpass', 'Profesor de Gobierno y gestión de TI', NULL, 'Mar-Vie 10-13', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF009', 'Eder Ramiro', 'Quispe', 'Vilchez', 'e.quispe00@pucp.edu.pe', 'Maestría', 'ederqpass', 'Profesor de Experiencia de Usuario', NULL, 'Lun-Mié 8-11', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF010', 'Layla', 'Hirsh', 'Martinez', 'l.hirsh00@pucp.edu.pe', 'Doctorado', 'laylahpass', 'Profesora de Inteligencia Artificial', NULL, 'Mar-Vie 10-13', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF011', 'Rony', 'Cueva', 'Moscoso', 'r.cueva00@pucp.edu.pe', 'Maestría', 'ronycpass', 'Profesor de Algoritmia', NULL, 'Lun-Mié 8-11', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF012', 'Luis Alberto', 'Flores', 'García', 'l.flores00@pucp.edu.pe', 'Doctorado', 'luisfpass', 'Profesor de Ingeniería de Software', NULL, 'Mar-Vie 10-13', 'Presencial', 1, TRUE, NOW(), NOW()),

           (1, 'PROF013', 'Julio', 'Ramírez', 'Lozano', 'julio.ramirez@pucp.edu.pe', 'Maestría', 'hashed_password_1', 'Docente con experiencia en ingeniería de software y arquitectura empresarial.', NULL, 'Lunes-Viernes 08:00-12:00', 'presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF014', 'Elena', 'Torres', 'Mendoza', 'elena.torres@pucp.edu.pe', 'Doctorado', 'hashed_password_2', 'Investigadora en inteligencia artificial con publicaciones en aprendizaje automático.', NULL, 'Martes-Jueves 10:00-14:00', 'presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF015', 'Ricardo', 'Salas', 'Gutiérrez', 'ricardo.salas@pucp.edu.pe', 'Maestría', 'hashed_password_3', 'Especialista en redes y ciberseguridad, con 10 años de experiencia docente.', NULL, 'Lunes-Miércoles 13:00-17:00', 'presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF016', 'Carla', 'Reyes', 'Fernández', 'carla.reyes@pucp.edu.pe', 'Doctorado', 'hashed_password_4', 'Profesora enfocada en bases de datos y minería de datos en entornos empresariales.', NULL, 'Martes-Viernes 09:00-13:00', 'presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF017', 'Ana', 'Martínez', 'Rojas', 'ana.martinez@pucp.edu.pe', 'Doctorado', 'secret5', 'Profesora de Sistemas', NULL, 'Mar-Vie 10-13', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF018', 'Carlos', 'Sánchez', 'Mendoza', 'carlos.sanchez@pucp.edu.pe', 'Maestría', 'secret6', 'Profesor de Redes', NULL, 'Lun-Mié 8-11', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF019', 'Juan', 'Pérez', 'Lopez', 'juan.perez@pucp.edu.pe', 'Doctorado', 'secret1', 'Profesor de IA', NULL, 'Lun-Vie 9-12', 'Presencial', 1, TRUE, NOW(), NOW()),

           --Coordinador
           (3, 'COOR001', 'Claudia María del Pilar', 'Zapata', 'del Río', 'claudia.zapata00@pucp.edu.pe', 'Maestría', 'claudiazpass', 'Coordinadora de tesis', NULL, NULL, NULL, 1, TRUE, NOW(), NOW()),
           (3, 'COOR002', 'Luis', 'Ramírez', 'Díaz', 'luis.ramirez@pucp.edu.pe', 'Maestría', 'secret3', 'Coord. de tesis', NULL, NULL, NULL, 1, TRUE, NOW(), NOW());

-- Alumnos

INSERT INTO usuario (tipo_usuario_id,
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
                     fecha_modificacion)
    VALUES
        -- Nuevos alumnos
        (2, 'ALU0001', 'María', 'Gómez', 'Torres', 'maria.gomez@pucp.edu.pe', 'Pregrado', 'secret2', 'Estudiante de sistemas', NULL, 'Mar-Jue 14-18', 'Híbrido', TRUE, NOW(), NOW()),
        (2, 'ALU0002', 'Diego', 'Fernández', 'García', 'diego.fernandez@pucp.edu.pe', 'Pregrado', 'secret7', 'Estudiante de IA', NULL, 'Lun-Vie 14-18', 'Híbrido', TRUE, NOW(), NOW()),
        (2, 'ALU0003', 'Sofía', 'Lima', 'Huertas', 'sofia.lima@pucp.edu.pe', 'Pregrado', 'secret8', 'Estudiante de Data Science', NULL, 'Mar-Jue 10-12', 'Remoto', TRUE, NOW(), NOW()),
        (2, 'ALU0004', 'Andrea', 'Muñoz', 'Castro', 'andrea.munoz@pucp.edu.pe', 'Pregrado', 'secret9', 'Estudiante de Ciencias de la Computación', NULL, 'Lun-Vie 9-13', 'Híbrido', TRUE, NOW(), NOW()),
        (2, 'ALU0005', 'Roberto', 'Vargas', 'Mendoza', 'roberto.vargas@pucp.edu.pe', 'Pregrado', 'secret10', 'Estudiante de Sistemas', NULL, 'Mar-Jue 14-18', 'Presencial', TRUE, NOW(), NOW()),
        (2, 'ALU0006', 'Carmen', 'Ruiz', 'Palacios', 'carmen.ruiz@pucp.edu.pe', 'Pregrado', 'secret11', 'Estudiante de Ciberseguridad', NULL, 'Mie-Vie 10-14', 'Remoto', TRUE, NOW(), NOW()),
        (2, 'ALU0007', 'Miguel', 'Torres', 'Silva', 'miguel.torres@pucp.edu.pe', 'Pregrado', 'secret12', 'Estudiante de Machine Learning', NULL, 'Lun-Mie 13-17', 'Híbrido', TRUE, NOW(), NOW()),
        (2, 'ALU0008', 'Patricia', 'Flores', 'Campos', 'patricia.flores@pucp.edu.pe', 'Pregrado', 'secret13', 'Estudiante de Redes', NULL, 'Mar-Jue 9-13', 'Presencial', TRUE, NOW(), NOW()),
        (2, 'ALU0009', 'Fernando', 'Luna', 'Ríos', 'fernando.luna@pucp.edu.pe', 'Pregrado', 'secret14', 'Estudiante de Software', NULL, 'Lun-Vie 14-18', 'Remoto', TRUE, NOW(), NOW()),
        (2, 'ALU0010', 'Valeria', 'Paz', 'Guerra', 'valeria.paz@pucp.edu.pe', 'Pregrado', 'secret15', 'Estudiante de Bases de Datos', NULL, 'Mie-Vie 9-13', 'Híbrido', TRUE, NOW(), NOW()),
        (2, 'ALU0011', 'Ricardo', 'Mora', 'Santos', 'ricardo.mora@pucp.edu.pe', 'Pregrado', 'secret16', 'Estudiante de IoT', NULL, 'Lun-Jue 10-14', 'Presencial', TRUE, NOW(), NOW()),
        (2, 'ALU0012', 'Laura', 'Vega', 'Luna', 'laura.vega@pucp.edu.pe', 'Pregrado', 'secret17', 'Estudiante de Desarrollo Web', NULL, 'Mar-Vie 13-17', 'Remoto', TRUE, NOW(), NOW()),
        (2, 'ALU0013', 'Gabriel', 'Rojas', 'Paredes', 'gabriel.rojas@pucp.edu.pe', 'Pregrado', 'secret18', 'Estudiante de Cloud Computing', NULL, 'Lun-Mie 9-13', 'Híbrido', TRUE, NOW(), NOW()),
        (2, 'ALU0014', 'Diana', 'Cruz', 'Medina', 'diana.cruz@pucp.edu.pe', 'Pregrado', 'secret19', 'Estudiante de DevOps', NULL, 'Mar-Jue 14-18', 'Presencial', TRUE, NOW(), NOW()),
        (2, 'ALU0015', 'Javier', 'Paredes', 'León', 'javier.paredes@pucp.edu.pe', 'Pregrado', 'secret20', 'Estudiante de IA', NULL, 'Mie-Vie 10-14', 'Remoto', TRUE, NOW(), NOW()),
        (2, 'ALU0016', 'Marcela', 'Santos', 'Vargas', 'marcela.santos@pucp.edu.pe', 'Pregrado', 'secret21', 'Estudiante de Blockchain', NULL, 'Lun-Jue 13-17', 'Híbrido', TRUE, NOW(), NOW()),
        (2, 'ALU0017', 'Hugo', 'Reyes', 'Mendoza', 'hugo.reyes@pucp.edu.pe', 'Pregrado', 'secret22', 'Estudiante de Data Science', NULL, 'Mar-Vie 9-13', 'Presencial', TRUE, NOW(), NOW()),
        (2, 'ALU0018', 'Carolina', 'Castro', 'Ruiz', 'carolina.castro@pucp.edu.pe', 'Pregrado', 'secret23', 'Estudiante de Sistemas Distribuidos', NULL, 'Lun-Mie 14-18', 'Remoto', TRUE, NOW(), NOW()),
        (2, 'ALU0019', 'Paolo', 'Ore', 'Ventura', 'ore.paolo@pucp.edu.pe', 'Pregrado', 'secretPaolo123', 'Estudiante de Comunicaciones.', NULL, 'Lun-Vie 10-18', 'Remoto', TRUE, NOW(), NOW()),
        --Administrador
        (4, 'AD01', 'Carla', 'Vega', 'Reyna', 'carla.vega@pucp.edu.pe', 'Administración', 'secret4', 'Admin. del sistema', NULL, NULL, NULL, TRUE, NOW(), NOW());

--RESTO DE TABLAS CRUZADAS

INSERT INTO usuario_carrera (usuario_id,
                             carrera_id,
                             activo,
                             fecha_creacion,
                             fecha_modificacion)
SELECT u.usuario_id, 1, TRUE, NOW(), NOW()
    FROM usuario u;


INSERT INTO usuario_grupo_investigacion (usuario_id,
                                         grupo_investigacion_id,
                                         activo,
                                         fecha_creacion,
                                         fecha_modificacion)
    VALUES (5, 1, TRUE, NOW(), NOW()),
           (6, 1, TRUE, NOW(), NOW()),
           (7, 1, TRUE, NOW(), NOW()),
           (8, 1, TRUE, NOW(), NOW());

-- Proyectos:
-- ('Sistema de Monitoreo Ambiental', 'Desarrollo de sensores conectados para medir la calidad del aire.', 'EN_PROCESO'),
-- ('Plataforma de Tutoría Académica', 'Aplicación web para gestionar sesiones de tutoría entre estudiantes y profesores.', 'EN_PROCESO'),
-- ('Simulador de Tráfico Urbano','Simulación de flujo vehicular','EN_PROCESO'),
-- ('Sistema de Gestión de Inventarios','Aplicación para controlar inventarios en tiempo real','EN_PROCESO');


INSERT INTO usuario_proyecto (usuario_id,
                              proyecto_id,
                              lider_proyecto)
    VALUES (4, 1, TRUE),
           (12, 2, TRUE),
           (10, 2, FALSE),
           (5, 3, TRUE),
           (7, 3, FALSE),
           (9, 4, TRUE);


INSERT INTO usuario_area_conocimiento (usuario_id, area_conocimiento_id)
    VALUES (1, 2),
           (2, 2),
           (3, 3),
           (4, 1),
           (5, 1),
           (6, 1),
           (7, 1),
           (8, 3),
           (9, 2),
           (10, 1),
           (11, 2),
           (12, 2);


INSERT INTO usuario_sub_area_conocimiento (usuario_id, sub_area_conocimiento_id)
    VALUES (6, 11),
           (6, 12),
           (6, 14),
           (9, 7),
           (9, 6),
           (9, 14),
           (9, 15),
           (9, 11),
           (10, 5),
           (10, 4),
           (11, 11),
           (11, 14),
           (12, 1),
           (12, 3),
           (12, 6),
           (12, 10),
           (12, 7);

-- Agregar rol de asesor a los profesores de la carrera de Ingeniería Informática

INSERT INTO usuario_rol (usuario_id,
                         rol_id,
                         activo,
                         fecha_creacion,
                         fecha_modificacion)
    (SELECT usuario.usuario_id, rol.rol_id, TRUE, NOW(), NOW()
         FROM usuario
                  INNER JOIN tipo_usuario ON tipo_usuario.tipo_usuario_id = usuario.tipo_usuario_id
                  INNER JOIN usuario_carrera ON usuario_carrera.usuario_id = usuario.usuario_id
                  JOIN rol ON rol.nombre = 'Asesor'
         WHERE tipo_usuario.nombre LIKE 'profesor'
           AND usuario_carrera.carrera_id = 1);


--------------------------------------
--|       TEMAS PARTICIPANTES      |--
--------------------------------------

INSERT INTO tema (codigo,
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
    VALUES ('TEMA-001', 'Inteligencia Artificial Aplicada', 'Exploración de aplicaciones de IA en distintos campos como la medicina y la logística.', 'Investigación de campo y análisis de caso.', 'Estudiar aplicaciones de IA en entornos reales y su impacto.', 'https://www.example.com/ai-aplicada', 6, NULL, 1, '2024-12-01 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           ('TEMA-002', 'Machine Learning para Datos No Estructurados', 'Uso de algoritmos de ML para datos no estructurados como imágenes y texto.', 'Clustering y análisis de patrones.', 'Aplicar técnicas de aprendizaje automático a datos no estructurados.', 'https://www.example.com/ml-no-estructurados', 6, NULL, 1, '2024-12-15 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           ('TEMA-003', 'Redes Neuronales Profundas', 'Estudio de redes neuronales profundas y su uso en la clasificación de datos complejos.', 'Capacitación en redes neuronales y aprendizaje profundo.', 'Explorar arquitecturas avanzadas de redes neuronales para clasificación de datos.', 'https://www.example.com/redes-neuronales', 6, NULL, 1, '2024-12-10 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           ('TEMA-004', 'Big Data y Análisis Predictivo', 'Aplicación de técnicas de big data para realizar predicciones de comportamiento en grandes volúmenes de datos.', 'Análisis exploratorio y técnicas predictivas.', 'Utilizar Big Data para predecir tendencias en diversos sectores.', 'https://www.example.com/bigdata-predictivo', 6, NULL, 1, '2024-12-20 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           ('TEMA-005', 'Automatización en la Industria 4.0', 'Exploración de sistemas automatizados y su integración en la industria moderna.', 'Simulación y análisis de sistemas automatizados.', 'Implementar soluciones de automatización en procesos industriales.', 'https://www.example.com/industria-4-0', 6, NULL, 1, '2024-12-05 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           ('TEMA-006', 'Blockchain y su Aplicación en Logística', 'Estudio del uso de blockchain para mejorar la trazabilidad en cadenas de suministro.', 'Investigación y análisis de caso de blockchain.', 'Explorar cómo blockchain puede mejorar la seguridad y transparencia en la logística.', 'https://www.example.com/blockchain-logistica', 6, NULL, 1, '2024-12-12 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           ('TEMA-007', 'Ciberseguridad en la Era Digital', 'Estudio de las amenazas digitales actuales y las mejores prácticas de ciberseguridad.', 'Estudio de vulnerabilidades y técnicas de defensa.', 'Mejorar las habilidades de ciberseguridad en un entorno digital cambiante.', 'https://www.example.com/ciberseguridad-digital', 6, NULL, 1, '2024-12-18 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           ('TEMA-008', 'Desarrollo de Software Ágil', 'Implementación de metodologías ágiles en el desarrollo de software.', 'Técnicas de desarrollo ágil y Scrum.', 'Optimizar el ciclo de desarrollo de software mediante metodologías ágiles.', 'https://www.example.com/software-agil', 6, NULL, 1, '2024-12-25 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           ('TEMA-009', 'Internet de las Cosas (IoT)', 'Exploración de dispositivos conectados y su impacto en la vida cotidiana.', 'Análisis de datos y conectividad.', 'Investigar cómo IoT transforma industrias y hogares.', 'https://www.example.com/iot', 6, NULL, 1, '2024-12-30 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           ('TEMA-010', 'Tecnologías Emergentes en Medicina', 'Exploración de nuevas tecnologías como la IA y la robótica en el ámbito médico.', 'Investigación sobre aplicaciones tecnológicas en el sector salud.', 'Estudiar cómo las tecnologías emergentes pueden transformar el sector médico.', 'https://www.example.com/tecnologias-medicina', 6, NULL, 1, '2025-01-05 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           ('TEMA-011', 'Detección de depresión en estudiantes de Ingeniería Electrónica: Un caso de estudio', 'Este tema propone aplicar técnicas de visión por computadora para detectar informáticos deprimidos.', '', '', 'https://miuniversidad.edu/repos/tema003', 6, NULL, 1, '2025-05-10 10:00:00.000000 +00:00', NULL, TRUE, '2025-05-01 10:00:00.000000 +00:00', '2025-05-01 10:00:00.000000 +00:00');


--Historial

INSERT INTO historial_tema (tema_id,
                            titulo,
                            resumen,
                            descripcion_cambio,
                            estado_tema_id,
                            activo,
                            fecha_creacion,
                            fecha_modificacion)
    VALUES (6, 'Blockchain y su Aplicación en Logística - v1', 'Estudio del uso de blockchain para mejorar la trazabilidad en cadenas de suministro.', 'Propuesta inicial de tesis', 1, TRUE, NOW(), NOW()),
           (6, 'Blockchain y su Aplicación en Logística - v2', 'Estudio del uso de blockchain para mejorar la trazabilidad en cadenas de suministro.', 'Actualización del tema para estudiante de pregrado', 8, TRUE, NOW(), NOW()),
           (11, 'Detección de depresión en estudiantes de Ingeniería Electrónica: Un caso de estudio – v1', 'Propuesta inicial de tesis', 'Creación del tema para estudiante de pregrado', 1, TRUE, NOW(), NOW());

--Subareas

INSERT INTO sub_area_conocimiento_tema (tema_id, sub_area_conocimiento_id)
    VALUES (1, 1),
           (2, 5),
           (3, 2),
           (4, 5),
           (5, 8),
           (6, 13),
           (7, 12),
           (8, 9),
           (9, 8),
           (10, 3),
           (11, 2);

--Tesistas

INSERT INTO usuario_tema (usuario_id, tema_id, rol_id)
SELECT u.usuario_id,
       CASE u.codigo_pucp
           WHEN 'ALU0001' THEN 1 --ia aplicada
           WHEN 'ALU0002' THEN 2 --ml para datos
           WHEN 'ALU0003' THEN 3 --rn profundas
           WHEN 'ALU0004' THEN 4 --big data
           WHEN 'ALU0005' THEN 5 --automatizacion
           WHEN 'ALU0006' THEN 6 --blockchain
           WHEN 'ALU0007' THEN 7 --ciberseguridad
           WHEN 'ALU0008' THEN 8 --desarrollo agil
           WHEN 'ALU0009' THEN 9 --iot
           WHEN 'ALU0010' THEN 10 --tecnologias emergentes
           WHEN 'ALU0019' THEN 11 --deteccion de depresion
           END AS tema_id,
       4       AS rol_id -- Rol de Tesista
    FROM usuario u
    WHERE u.codigo_pucp IN
          ('ALU0001', 'ALU0002', 'ALU0003', 'ALU0004', 'ALU0005', 'ALU0006', 'ALU0007', 'ALU0008', 'ALU0009', 'ALU0010',
           'ALU0019');

--Asesores

INSERT INTO usuario_tema (usuario_id, tema_id, rol_id)
    VALUES (5, 1, 1),
           (5, 2, 1),
           (4, 3, 1),
           (7, 4, 1),
           (11, 5, 1),
           (3, 6, 1),
           (8, 7, 1),
           (9, 8, 1),
           (10, 9, 1),
           (3, 10, 1),
           (4, 11, 1);

--Jurados

INSERT INTO usuario_tema (usuario_id, tema_id, rol_id)
    VALUES (6, 1, 2),
           (11, 1, 2),

           (11, 2, 2),
           (10, 2, 2),

           (7, 3, 2),
           (10, 3, 2),

           (8, 4, 2),
           (3, 4, 2),

           (8, 5, 2),
           (1, 5, 2),

           (7, 6, 2),
           (9, 6, 2),

           (1, 7, 2),
           (3, 7, 2),

           (12, 8, 2),
           (5, 8, 2),

           (2, 9, 2),
           (6, 9, 2),

           (12, 10, 2),
           (9, 10, 2),

           (6, 11, 2),
           (5, 11, 2);

--RESTO DE TABLAS CRUZADAS

INSERT INTO etapa_formativa_x_ciclo_x_tema (etapa_formativa_x_ciclo_id, tema_id, aprobado, fecha_modificacion)
    VALUES (1, 1, TRUE, NOW()),
           (1, 2, TRUE, NOW()),
           (1, 3, TRUE, NOW()),
           (1, 4, TRUE, NOW()),
           (1, 5, TRUE, NOW()),
           (1, 6, TRUE, NOW()),
           (1, 7, TRUE, NOW()),
           (1, 8, TRUE, NOW()),
           (1, 9, TRUE, NOW()),
           (1, 10, TRUE, NOW()),
           (1, 11, TRUE, NOW());

INSERT INTO exposicion_x_tema (exposicion_id,
                               tema_id)
    VALUES (1, 1),
           (1, 2),
           (1, 3),
           (1, 4),
           (1, 5),
           (1, 6),
           (1, 7),
           (1, 8),
           (1, 9),
           (1, 10),
           (1, 11);


INSERT INTO control_exposicion_usuario (exposicion_x_tema_id,
                                        usuario_x_tema_id)
SELECT et.exposicion_x_tema_id,
       ut.usuario_tema_id
    FROM exposicion_x_tema et
             JOIN usuario_tema ut ON et.tema_id = ut.tema_id
    WHERE et.exposicion_id = 1;

-----------------------------------
--| PARÁMETROS DE CONFIGURACIÓN |--
-----------------------------------


WITH nuevo_parametro AS (
    INSERT INTO parametro_configuracion (
                                         nombre, descripcion, modulo_id, activo, fecha_creacion, fecha_modificacion,
                                         tipo
        ) VALUES ('antiplagio',
                  'Configure la opcion de revision antiplagio',
                  4, TRUE, NOW(), NOW(), 'booleano') RETURNING parametro_configuracion_id)
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
                  4, TRUE, NOW(), NOW(), 'booleano') RETURNING parametro_configuracion_id)
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


-- Limite de tesistas por asesor
WITH nuevo_parametro AS (
    INSERT INTO parametro_configuracion (
                                         nombre,
                                         descripcion,
                                         modulo_id,
                                         activo,
                                         fecha_creacion,
                                         fecha_modificacion,
                                         tipo
        ) VALUES ('LimXasesor',
                  'Numero de limites por asesor',
                  2,
                  TRUE,
                  NOW(),
                  NOW(),
                  'integer')
        RETURNING parametro_configuracion_id)
INSERT
    INTO carrera_parametro_configuracion (carrera_id,
                                          parametro_configuracion_id,
                                          valor,
                                          activo,
                                          fecha_creacion,
                                          fecha_modificacion,
                                          etapa_formativa_id)
SELECT 1,
       parametro_configuracion_id,
       3,
       TRUE,
       NOW(),
       NOW(),
       1
    FROM nuevo_parametro;

--Switch para activar el limite de asesores
WITH nuevo_parametro AS (
    INSERT INTO parametro_configuracion (
                                         nombre,
                                         descripcion,
                                         modulo_id,
                                         activo,
                                         fecha_creacion,
                                         fecha_modificacion,
                                         tipo
        ) VALUES ('ActivarLimiteAsesor',
                  'Configure la opcion de editar el numero de tesistas por asesor',
                  2,
                  TRUE,
                  NOW(),
                  NOW(),
                  'booleano')
        RETURNING parametro_configuracion_id)
INSERT
    INTO carrera_parametro_configuracion (carrera_id,
                                          parametro_configuracion_id,
                                          valor,
                                          activo,
                                          fecha_creacion,
                                          fecha_modificacion,
                                          etapa_formativa_id)
SELECT 1,
       parametro_configuracion_id,
       TRUE,
       TRUE,
       NOW(),
       NOW(),
       1
    FROM nuevo_parametro;

-- Tiempo limite para revisar
WITH nuevo_parametro AS (
    INSERT INTO parametro_configuracion (
                                         nombre,
                                         descripcion,
                                         modulo_id,
                                         activo,
                                         fecha_creacion,
                                         fecha_modificacion,
                                         tipo
        ) VALUES ('TiempoLimiteRevisar',
                  'Configure la opcion de editar el tiempo limite (dias) para revisar el avance',
                  2,
                  TRUE,
                  NOW(),
                  NOW(),
                  'integer')
        RETURNING parametro_configuracion_id)
INSERT
    INTO carrera_parametro_configuracion (carrera_id,
                                          parametro_configuracion_id,
                                          valor,
                                          activo,
                                          fecha_creacion,
                                          fecha_modificacion,
                                          etapa_formativa_id)
SELECT 1,
       parametro_configuracion_id,
       5,
       TRUE,
       NOW(),
       NOW(),
       1
    FROM nuevo_parametro;

-- Cantidad tesis en simultaneo asignadas a un jurado
WITH nuevo_parametro AS (
    INSERT INTO parametro_configuracion (
                                         nombre,
                                         descripcion,
                                         modulo_id,
                                         activo,
                                         fecha_creacion,
                                         fecha_modificacion,
                                         tipo
        ) VALUES ('CantidadTesisXJurado',
                  'Configure el numero maximo de tesis que puede tener asignadas un jurado de forma simultanea',
                  3,
                  TRUE,
                  NOW(),
                  NOW(),
                  'integer')
        RETURNING parametro_configuracion_id)
INSERT
    INTO carrera_parametro_configuracion (carrera_id,
                                          parametro_configuracion_id,
                                          valor,
                                          activo,
                                          fecha_creacion,
                                          fecha_modificacion,
                                          etapa_formativa_id)
SELECT 1,
       parametro_configuracion_id,
       4,
       TRUE,
       NOW(),
       NOW(),
       1
    FROM nuevo_parametro;


INSERT INTO parametro_configuracion (nombre,
                                     descripcion,
                                     modulo_id,
                                     activo,
                                     fecha_creacion,
                                     fecha_modificacion,
                                     tipo)
    VALUES ('Cantidad Jurados',
            'Cantidad maxima de jurados por tema de tesis',
            1,
            TRUE,
            NOW(), -- Fecha de creación actual
            NOW(), -- Fecha de modificación actual
            'integer');

INSERT INTO carrera_parametro_configuracion (carrera_id,
                                             parametro_configuracion_id,
                                             valor,
                                             activo,
                                             fecha_creacion,
                                             fecha_modificacion,
                                             etapa_formativa_id)
    VALUES (1, -- ID de la carrera
            (SELECT parametro_configuracion_id
                 FROM parametro_configuracion
                 WHERE nombre = 'Cantidad Jurados'
                 LIMIT 1),
            3, -- Valor de la configuración
            TRUE, -- Estado activo
            NOW(), -- Fecha de creación
            NOW(), -- Fecha de modificación
            1 -- ID de etapa formativa
           );



INSERT INTO parametro_configuracion (nombre,
                                     descripcion,
                                     modulo_id,
                                     activo,
                                     fecha_creacion,
                                     fecha_modificacion,
                                     tipo)
    VALUES ('Tiempo Limite Jurado',
            'Tiempo limite para que jurado revise entregables',
            1,
            TRUE,
            NOW(), -- Fecha de creación actual
            NOW(), -- Fecha de modificación actual
            'integer');

INSERT INTO carrera_parametro_configuracion (carrera_id,
                                             parametro_configuracion_id,
                                             valor,
                                             activo,
                                             fecha_creacion,
                                             fecha_modificacion,
                                             etapa_formativa_id)
    VALUES (1, -- ID de la carrera asociada (ejemplo: 1)
            (SELECT parametro_configuracion_id
                 FROM parametro_configuracion
                 WHERE nombre = 'Tiempo Limite Jurado'
                 LIMIT 1), -- ID del parametro_configuracion asociado (ejemplo: 1)
            15, -- Valor de la configuración
            TRUE, -- Estado activo
            NOW(), -- Fecha de creación actual
            NOW(), -- Fecha de modificación actual
            1);


INSERT INTO parametro_configuracion (nombre,
                                     descripcion,
                                     modulo_id,
                                     activo,
                                     fecha_creacion,
                                     fecha_modificacion,
                                     tipo)
    VALUES ('Peso Asesor',
            'Peso asignado a la calificación del asesor en situaciones de evaluación que involucran la participación del jurado',
            1,
            TRUE,
            NOW(), -- Fecha de creación actual
            NOW(), -- Fecha de modificación actual
            'integer');

INSERT INTO carrera_parametro_configuracion (carrera_id,
                                             parametro_configuracion_id,
                                             valor,
                                             activo,
                                             fecha_creacion,
                                             fecha_modificacion,
                                             etapa_formativa_id)
    VALUES (1, -- ID de la carrera asociada (ejemplo: 1)
            (SELECT parametro_configuracion_id
                 FROM parametro_configuracion
                 WHERE nombre = 'Peso Asesor'
                 LIMIT 1), -- ID del parametro_configuracion asociado (ejemplo: 1)
            20, -- Valor de la configuración
            TRUE, -- Estado activo
            NOW(), -- Fecha de creación actual
            NOW(), -- Fecha de modificación actual
            1);


--solicitudes


INSERT INTO solicitud (descripcion,
                       tipo_solicitud_id,
                       tema_id,
                       estado) -- estado = 1 ("PENDIENTE"
    VALUES ('Solicitud de aprobación de tema de tesis', 1, 11, 2),
           ('Solicito acceso a la plataforma DRL', 1, 1, 1);


INSERT INTO usuario_solicitud (usuario_id,
                               solicitud_id,
                               solicitud_completada,
                               aprobado,
                               comentario,
                               destinatario,
                               activo,
                               fecha_creacion,
                               fecha_modificacion)
    VALUES (33, 1, TRUE, TRUE, 'Solicitud aprobada', FALSE, TRUE, NOW(), NOW()),
           (1, 2, FALSE, FALSE, 'En revisión', FALSE, TRUE, NOW(), NOW());


-- notificaciones

INSERT INTO notificacion (mensaje,
                          canal,
                          modulo_id,
                          tipo_notificacion_id,
                          usuario_id,
                          activo,
                          fecha_creacion,
                          fecha_modificacion)
    VALUES ('Bienvenido al sistema', 'Email', 1, 1, 1, TRUE, NOW(), NOW()),
           ('Tu tema de tesis está en revisión', 'Email', 2, 2, 33, TRUE, NOW(), NOW()),
           ('Tu proyecto fue aprobado', 'SMS', 2, 2, 1, TRUE, NOW(), NOW());


--reuniones

INSERT INTO reunion (titulo,
                     fecha_hora_inicio,
                     fecha_hora_fin,
                     descripcion,
                     disponible,
                     url,
                     fecha_creacion,
                     fecha_modificacion,
                     activo)
    VALUES ('Reunión de inducción', '2025-06-01 10:00:00', '2025-06-01 11:00:00', 'Reunión de bienvenida para nuevos estudiantes', 1, 'https://meet.example.com/reunion-induccion', NOW(), NOW(), TRUE),
           ('Primera reunion', '2025-06-10 16:00:00', '2025-06-10 17:00:00', 'Primera reunion', 1, 'presencial', NOW(), NOW(), TRUE),
           ('Segunda reunion', '2025-06-17 16:00:00', '2025-06-17 17:00:00', 'Segunda reunion', 2, 'presencial', NOW(), NOW(), TRUE);


INSERT INTO usuario_reunion (reunion_id,
                             usuario_id,
                             estado_asistencia,
                             estado_detalle,
                             fecha_creacion,
                             fecha_modificacion,
                             activo)
    VALUES (1, 5, 'Asistió', 'Asistió', NOW(), NOW(), TRUE),
           (1, 23, 'No asistió', 'No asistió', NOW(), NOW(), TRUE),
           (2, 4, 'Pendiente', 'Pendiente', NOW(), NOW(), TRUE),
           (2, 24, 'Pendiente', 'Pendiente', NOW(), NOW(), TRUE),
           (3, 7, 'Pendiente', 'Pendiente', NOW(), NOW(), TRUE),
           (3, 25, 'Pendiente', 'Pendiente', NOW(), NOW(), TRUE);



-- +++++++++++++++++++++++++++++++++++++++++++++++++++
-- ++NUEVOS INSERTS BLOQUE JORNADA JORNADAXSALA+++++++
-- +++++++++++++++++++++++++++++++++++++++++++++++++++

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
           (2, 1, TRUE, NOW(), NOW()),
           (2, 2, TRUE, NOW(), NOW()),
           (2, 3, TRUE, NOW(), NOW());


-- 20 minutos de duración de exposición por sala

WITH RECURSIVE
    series AS (SELECT 0 AS n
               UNION ALL
               SELECT n + 1
                   FROM series
                   WHERE n < 8),
    parametros AS (SELECT jornada_exposicion_x_sala_id,
                          CASE
                              WHEN jornada_exposicion_x_sala_id <= 3
                                  THEN
                                  TIMESTAMP WITH TIME ZONE '2025-05-12 17:00:00' +
                                  (s.n * INTERVAL '20 minutes')
                              ELSE
                                  TIMESTAMP WITH TIME ZONE '2025-05-14 17:00:00' +
                                  (s.n * INTERVAL '20 minutes')
                              END AS hora_inicio
                       FROM (SELECT UNNEST(ARRAY [1,2,3,4,5,6]) AS jornada_exposicion_x_sala_id) j
                                CROSS JOIN series s),
    bloques AS (SELECT jornada_exposicion_x_sala_id,
                       hora_inicio,
                       hora_inicio + INTERVAL '20 minutes' AS hora_fin
                    FROM parametros)
INSERT
    INTO bloque_horario_exposicion (jornada_exposicion_x_sala_id,
                                    datetime_inicio,
                                    datetime_fin)
SELECT jornada_exposicion_x_sala_id,
       hora_inicio,
       hora_fin
    FROM bloques
    ORDER BY jornada_exposicion_x_sala_id, hora_inicio;


-- expo parcial: exposiciones por tema: 1 al 11; bloques horario: 1 al 27
-- expo final: exposiciones por tema: 12 al 22; bloques horario: 28 al 54

UPDATE bloque_horario_exposicion
SET exposicion_x_tema_id = CASE bloque_horario_exposicion_id
                               WHEN 1  THEN 1
                               WHEN 4  THEN 2
                               WHEN 7  THEN 3
                               WHEN 10 THEN 4
                               WHEN 13 THEN 5
                               WHEN 16 THEN 6
                               WHEN 19 THEN 7
                               WHEN 22 THEN 8
                               WHEN 24 THEN 9
                               WHEN 25 THEN 10
                               WHEN 27 THEN 11
                               ELSE exposicion_x_tema_id
    END
    WHERE bloque_horario_exposicion_id IN (1, 4, 7, 10, 13, 16, 19, 22, 24, 25, 27);

-- Actualizar control_exposicion_usuario 23-34 a aceptado

UPDATE control_exposicion_usuario
SET estado_exposicion_usuario = 'aceptado'
    WHERE control_exposicion_usuario_id IN (23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34);

-- Actualizar estado exposicion_x_tema a completada

UPDATE exposicion_x_tema
SET estado_exposicion = 'completada'
    WHERE exposicion_x_tema_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);

-- Para probar la actualización automática a completada, descomentar la siguiente línea y cambiar arriba el estado a 'programada'
-- UPDATE exposicion_x_tema
-- SET estado_exposicion = 'completada'
--     WHERE exposicion_x_tema_id IN (4, 5, 6);


INSERT INTO revision_criterio_x_exposicion(exposicion_x_tema_id,
                                           criterio_exposicion_id,
                                           usuario_id,
                                           nota,
                                           revisado,
                                           observacion)
    VALUES (1, 1, 6, 3, TRUE, 'Excelente manejo de voz y ritmo durante la presentación'),
           (1, 2, 6, 4, TRUE, 'Demostró conocimiento profundo del tema y respondió todas las preguntas'),
           (1, 3, 6, 3, TRUE, 'Diapositivas bien estructuradas y apoyo visual apropiado'),
           (1, 4, 6, 3, TRUE, 'Presentación clara y bien organizada'),
           (1, 5, 6, 2, TRUE, 'Se ajustó perfectamente al tiempo asignado'),
           (1, 6, 6, 5, TRUE, 'Respondió todas las preguntas con seguridad y precisión'),

           (1, 1, 11, 2.5, TRUE, 'Debe mejorar el volumen de voz en algunas secciones'),
           (1, 2, 11, 3.5, TRUE, 'Buen manejo del tema pero puede profundizar más'),
           (1, 3, 11, 2.5, TRUE, 'Las diapositivas necesitan mejor diseño visual'),
           (1, 4, 11, 2.5, TRUE, 'La transición entre temas puede ser más fluida'),
           (1, 5, 11, 2.0, TRUE, 'Se excedió ligeramente del tiempo asignado'),
           (1, 6, 11, 4.0, TRUE, 'Buenas respuestas aunque algunas fueron algo imprecisas'),

           (2, 1, 10, 3.0, TRUE, 'Muy buena proyección de voz y entonación'),
           (2, 2, 10, 4.0, TRUE, 'Excelente dominio y comprensión del tema'),
           (2, 3, 10, 3.0, TRUE, 'Material visual de alta calidad y bien utilizado'),
           (2, 4, 10, 3.0, TRUE, 'Estructura lógica y coherente de la presentación'),
           (2, 5, 10, 2.0, TRUE, 'Excelente manejo del tiempo asignado'),
           (2, 6, 10, 5.0, TRUE, 'Respuestas completas y bien fundamentadas'),

           (2, 1, 11, 2.5, TRUE, 'Debe mejorar la claridad en la pronunciación'),
           (2, 2, 11, 3.5, TRUE, 'Conocimiento adecuado pero puede expandir conceptos'),
           (2, 3, 11, 2.5, TRUE, 'El material de apoyo necesita más ejemplos'),
           (2, 4, 11, 2.5, TRUE, 'Algunos temas necesitan mejor conexión'),
           (2, 5, 11, 0.5, TRUE, 'Se excedió considerablemente del tiempo'),
           (2, 6, 11, 4.0, TRUE, 'Respondió bien pero algunas respuestas fueron breves'),

           (3, 1, 7, 3.0, TRUE, 'Excelente modulación y claridad al hablar'),
           (3, 2, 7, 4.0, TRUE, 'Dominio excepcional del tema presentado'),
           (3, 3, 7, 3.0, TRUE, 'Presentación visual profesional y efectiva'),
           (3, 4, 7, 3.0, TRUE, 'Excelente organización y estructura'),
           (3, 5, 7, 2.0, TRUE, 'Control perfecto del tiempo asignado'),
           (3, 6, 7, 5.0, TRUE, 'Respuestas completas y bien argumentadas'),

           (3, 1, 10, 2.5, TRUE, 'Debe trabajar en mantener un tono más constante'),
           (3, 2, 10, 3.5, TRUE, 'Buen conocimiento pero puede mejorar ejemplos'),
           (3, 3, 10, 2.5, TRUE, 'Las diapositivas necesitan mejor organización'),
           (3, 4, 10, 2.5, TRUE, 'La secuencia de temas puede ser más clara'),
           (3, 5, 10, 1.0, TRUE, 'No logró cubrir todo el contenido en el tiempo'),
           (3, 6, 10, 4.0, TRUE, 'Buenas respuestas aunque algunas poco desarrolladas');

-- Rellenar revisiones para las exposiciones 4, 5, 6, 7, 8, 9, 10 y 11 en blanco y de los criterios 1 a 6

INSERT INTO revision_criterio_x_exposicion (exposicion_x_tema_id,
                                            criterio_exposicion_id,
                                            usuario_id,
                                            nota,
                                            revisado,
                                            observacion)
    WITH rankedjurados AS (SELECT et.exposicion_x_tema_id,
                                  ce.criterio_exposicion_id,
                                  ut.usuario_id,
                                  ROW_NUMBER() OVER (PARTITION BY et.exposicion_x_tema_id ORDER BY ut.usuario_id) AS rn
                               FROM exposicion_x_tema et
                                        JOIN criterio_exposicion ce ON ce.exposicion_id = et.exposicion_id
                                        JOIN usuario_tema ut ON et.tema_id = ut.tema_id
                               WHERE et.exposicion_x_tema_id IN (2, 3, 4, 5, 6, 7, 8, 10)
                                 AND ce.criterio_exposicion_id BETWEEN 1 AND 6
                                 AND ut.rol_id = 2 -- 2: Jurados 1: Asesores
    )
        SELECT exposicion_x_tema_id,
               criterio_exposicion_id,
               usuario_id,
               NULL AS nota,
               FALSE AS revisado,
               NULL AS observacion
            FROM rankedjurados
            WHERE rn < 7
            ORDER BY exposicion_x_tema_id, criterio_exposicion_id;

-- Modificar la nota final de la exposicion

UPDATE exposicion_x_tema
SET nota_final = (SELECT AVG(promedio_usuario)
                      FROM (SELECT usuario_id, SUM(nota) AS promedio_usuario
                                FROM revision_criterio_x_exposicion
                                WHERE exposicion_x_tema_id = exposicion_x_tema.exposicion_x_tema_id
                                GROUP BY usuario_id) promedios_por_usuario)
    WHERE exposicion_x_tema_id IN (1, 2, 3);

UPDATE exposicion_x_tema
SET estado_exposicion = 'calificada'
    WHERE exposicion_x_tema_id IN (1, 2, 3);

-- LO MISMO PARA LÓGICA DE ENTREGABLES

INSERT INTO entregable_x_tema (entregable_id, tema_id, estado, fecha_envio)
    VALUES (1, 1, DEFAULT, NULL), -- Estado por defecto: 'no_enviado'
           (1, 2, 'enviado_a_tiempo', DATE '2025-05-19'),
           (1, 3, 'enviado_tarde', DATE '2025-05-21'),
           (1, 4, 'enviado_a_tiempo', DATE '2025-05-20'),
           (1, 5, 'enviado_a_tiempo', DATE '2025-05-19'),
           (1, 6, 'enviado_a_tiempo', DATE '2025-05-20'),
           (1, 7, DEFAULT, NULL),
           (1, 8, 'enviado_tarde', DATE '2025-05-21'),
           (1, 9, 'enviado_a_tiempo', DATE '2025-05-18'),
           (1, 10, 'enviado_a_tiempo', DATE '2025-05-19'),
           (1, 11, DEFAULT, NULL);


--(1, 'Originalidad del contenido', 4.00, 'Se evalúa la capacidad de presentar ideas propias y enfoques creativos en el entregable.'),
--(1, 'Claridad y coherencia en la redacción', 5.00, 'Se evalúa la claridad, coherencia y cohesión del contenido entregado.'),
--(1, 'Cumplimiento de requisitos', 6.00, 'Se verifica que el entregable cumpla con todos los requisitos solicitados.'),
--(1, 'Presentación del contenido', 2.00, 'Se evalúa el formato, uso adecuado de gráficos, y presentación ordenada del entregable.'),
--(1, 'Análisis crítico', 3.00, 'Se mide la capacidad para interpretar y argumentar los resultados con pensamiento crítico.'),
--Revisones hechas para 2, 4, 5 y 6

INSERT INTO revision_criterio_entregable (entregable_x_tema_id,
                                           criterio_entregable_id,
                                           usuario_id,
                                           nota,
                                           observacion)
VALUES (2, 1, 5, 4.00, 'Excelente originalidad y enfoque creativo en el contenido.'),
       (2, 2, 5, 5.00, 'Redacción clara y coherente, con buena estructura.'),
       (2, 3, 5, 6.00, 'Cumple con todos los requisitos solicitados.'),
       (2, 4, 5, 2.00, 'Presentación adecuada y uso correcto de gráficos.'),
       (2, 5, 5, 3.00, 'Análisis crítico bien fundamentado.'),

       (4, 1, 7, 3.00, 'Originalidad aceptable pero puede mejorar en algunos aspectos.'),
       (4, 2, 7, 4.00, 'Buena redacción pero con algunas incoherencias menores.'),
       (4, 3, 7, 5.00, 'Cumple con la mayoría de los requisitos pero falta detalle en algunos puntos.'),
       (4, 4, 7, 1.50, 'Presentación correcta pero podría ser más atractiva visualmente.'),
       (4, 5, 7, 2.00, 'Análisis crítico adecuado pero con áreas de mejora.');



-- (3, 3, 'enviado_a_tiempo', DATE '2025-05-01'),
-- (3, 3, DEFAULT, DATE '2025-06-01');


