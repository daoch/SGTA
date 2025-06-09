----------------------------------
--|           TIPOS            |--
----------------------------------

INSERT INTO tipo_usuario (nombre)
    VALUES ('profesor'),
           ('alumno'),
         --('coordinador'),
           ('administrador');


INSERT INTO tipo_dedicacion (iniciales, descripcion)
    VALUES ('TC', 'Tiempo completo'),
           ('TPC', 'Tiempo parcial convencional'),
           ('TPA', 'Tiempo parcial por asignaturas');


INSERT INTO tipo_solicitud (nombre,
                            descripcion)
    VALUES ('Aprobación de tema (por coordinador)', 'Solicitud para que el coordinador apruebe el tema'),
           ('Solicitud de cambio de título', 'Modificar el título del tema'),
           ('Solicitud de cambio de resumen', 'Modificar el resumen del tema'),
           ('Cambio de asesor (por asesor)', 'Solicitud para que el coordinador apruebe el cambio de asesores');


INSERT INTO tipo_notificacion (nombre,
                               descripcion,
                               prioridad)
    VALUES ('informativa', 'Mensaje informativo para el usuario', 0),
           ('advertencia', 'Señal de posible problema o riesgo', 1),
           ('recordatorio', 'Recordatorio de acción pendiente', 2),
           ('error', 'Notificación de error crítico', 3);


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
--|          ESTADOS           |--
----------------------------------

INSERT INTO estado_planificacion (nombre)
    VALUES ('Sin planificar'),
           ('Planificacion inicial'),
           ('Fase 1'),
           ('Fase 2'),
           ('Cierre de planificacion');


INSERT INTO estado_tema (nombre,
                         descripcion)
    VALUES ('PROPUESTO_LIBRE', 'Tema propuesto por asesor para que los alumnos postulen'),
           ('PROPUESTO_GENERAL', 'Tema propuesto por estudiante o estudiantes en general a una subárea de conocimiento'),
           ('PROPUESTO_DIRECTO', 'Tema propuesto por estudiante directamente a un profesor (no visible a otros profesores)'),
           ('PREINSCRITO', 'Tema propuesto por estudiante que cuenta con asesor aceptado'),
           ('INSCRITO', 'Tema inscrito con asesor con detalles formalizados'),
           ('REGISTRADO', 'Tema inscrito aceptado por comité de tesis'),
           ('RECHAZADO', 'Tema propuesto por estudiante que ha sido rechazado'),
           ('OBSERVADO', 'Tema inscrito con observaciones pendientes del comité de tesis'),
           ('VENCIDO', 'Tema propuesto por asesor o estudiantes que pasó su fecha de vencimiento definida'),
           ('EN_PROGRESO', 'Tema registrado en progreso'),
           ('PAUSADO', 'Tema que ha sido registrado e iniciado, pero no está en progreso actualmente'),
           ('FINALIZADO', 'Tema que ha sido registrado y ha finalizado su proceso de evaluación');


INSERT INTO estado_solicitud (nombre, descripcion)
    VALUES ('PENDIENTE', 'La solicitud está en proceso de evaluación'),
           ('ACEPTADA', 'La solicitud ha sido aceptada'),
           ('RECHAZADA', 'La solicitud ha sido rechazada');

----------------------------------
--|      ENTIDADES FIJAS       |--
----------------------------------

INSERT INTO rol (nombre,
                 descripcion)
    VALUES ('Asesor', 'Asesora a estudiantes en sus proyectos'),
           ('Jurado', 'Está presente, evalúa y califica exposiciones'),
           ('Revisor', 'Califica exposiciones y entregables'),
           ('Tesista', 'Estudiante realizando tesis de grado o proyecto de fin de carrera'),
           ('Coasesor', 'Cosesora a estudiantes en sus proyectos'),
           ('Alumno', 'Alumno de la universidad');


INSERT INTO rol_solicitud (nombre, descripcion)
    VALUES ('REMITENTE', 'Usuario que inicia la solicitud'),
           ('DESTINATARIO', 'Usuario al que está dirigida la solicitud'),
           ('ASESOR_ACTUAL', 'Asesor vigente del usuario'),
           ('ASESOR_ENTRADA', 'Asesor saliente del usuario');


INSERT INTO accion_solicitud (nombre, descripcion)
    VALUES ('SIN_ACCION', 'Sin acción tomada aún'),
           ('PENDIENTE_ACCION', 'En espera de una acción'),
           ('APROBADO', 'Solicitud aprobada'),
           ('RECHAZADO', 'Solicitud rechazada');


INSERT INTO modulo (nombre,
                    descripcion)
    VALUES ('Temas', 'Gestión de propuestas y temas de investigación'),
           ('Asesores', 'Administración de asesores asignados'),
           ('Jurados', 'Administración de jurados de evaluación'),
           ('Revisión', 'Control y seguimiento de revisiones'),
           ('Reportes', 'Generación de informes y estadísticas');

------------------------------------------------
--|   INFRAESTRUCTURA INFORMATIVA PRINCIPAL  |--
------------------------------------------------

INSERT INTO unidad_academica (nombre,
                              descripcion)
    VALUES ('Facultad de Ciencias e Ingeniería', 'Unidad encargada de carreras de ingeniería');

--Solo los registros activos serán para FACI - INFORMÁTICA

INSERT INTO carrera (unidad_academica_id,
                     codigo,
                     nombre,
                     descripcion)
    VALUES (1, 'INF', 'Ingeniería Informática', 'Carrera de software y sistemas'),
           (1, 'CIV', 'Ingeniería Civil', 'Carrera de construcción y estructuras'),
           (1, 'MEC', 'Ingeniería Mecánica', 'Carrera de diseño y manufactura de máquinas'),
           (1, 'IND', 'Ingeniería Industrial', 'Carrera de optimización de procesos');


INSERT INTO etapa_formativa (nombre,
                             creditaje_por_tema,
                             duracion_exposicion,
                             activo)
    VALUES ('Proyecto de fin de carrera 1', 4.5, INTERVAL '20 minutes', 1),
           ('Proyecto de fin de carrera 2', 4.0, INTERVAL '20 minutes', 1);

-- ver y evaluar https://dl.acm.org/ccs

INSERT INTO area_conocimiento (carrera_id,
                               nombre,
                               descripcion)
    VALUES (1, 'Ciencias de la Computación', 'Disciplina de teorías y sistemas computacionales'),
           (1, 'Sistemas de Información', 'Estudio de sistemas para gestión de información'),
           (1, 'Ciberseguridad', 'Protección de activos digitales ante amenazas');


INSERT INTO sub_area_conocimiento (area_conocimiento_id,
                                   nombre,
                                   descripcion
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


INSERT INTO sala_exposicion (sala_exposicion_id,
                             nombre,
                             tipo_sala_exposicion)
    VALUES
        -- Salas presenciales
        (1, 'V201',  'presencial'),
        (2, 'V202',  'presencial'),
        (3, 'V203',  'presencial'),
        (4, 'V204',  'presencial'),
        -- Salas virtuales
        (5, 'SALA VIRTUAL 001', 'virtual'),
        (6, 'SALA VIRTUAL 002', 'virtual'),
        (7, 'SALA VIRTUAL 003', 'virtual');

-------------------------------------------------
--|   INFRAESTRUCTURA INFORMATIVA SECUNDARIA  |--
-------------------------------------------------


INSERT INTO grupo_investigacion (nombre,
                                 descripcion)
    VALUES ('Grupo de Inteligencia Artificial PUCP', 'Investigación en IA y aprendizaje automático'),
           ('Grupo de Investigación HCI-DUXAIT-PUCP', 'Investigación que contribuya en las áreas de la Interacción Humano-Computador (HCI) y en el Desarrollo Tecnológico e Innovación');


INSERT INTO proyecto (titulo, descripcion, estado)
    VALUES ('Sistema de Monitoreo Ambiental', 'Desarrollo de sensores conectados para medir la calidad del aire.', 'EN_PROCESO'),
           ('Plataforma de Tutoría Académica', 'Aplicación web para gestionar sesiones de tutoría entre estudiantes y profesores.', 'EN_PROCESO'),
           ('Simulador de Tráfico Urbano','Simulación de flujo vehicular','EN_PROCESO'),
           ('Sistema de Gestión de Inventarios','Aplicación para controlar inventarios en tiempo real','EN_PROCESO');

