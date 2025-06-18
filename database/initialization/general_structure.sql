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
           ('Cambio de asesor (por asesor)', 'Solicitud para que el coordinador apruebe el cambio de asesores'),
           ('Solicitud de cambio de objetivos', 'Modificar los objetivos del tema'),
           ('Solicitud de cambio de área', 'Modificar el área del tema'),
           ('Solicitud de cambio de subárea', 'Modificar el subárea del tema');


INSERT INTO tipo_notificacion (nombre,
                               descripcion,
                               prioridad)
    VALUES ('informativa', 'Mensaje informativo para el usuario', 0),
           ('advertencia', 'Señal de posible problema o riesgo', 1),
           ('recordatorio', 'Recordatorio de acción pendiente', 2),
           ('error', 'Notificación de error crítico', 3),
           ('informacion', 'Notificaciones informativas generales', 3),
           ('exito', 'Confirmaciones de operaciones exitosas', 4);


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


INSERT INTO estado_tema (nombre, descripcion)
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


-------------------------------------------------
--|     INFRAESTRUCTURA INFORMATIVA FÍSICA    |--
-------------------------------------------------

-- Salas del V
INSERT INTO sala_exposicion (nombre,
                             tipo_sala_exposicion)
    VALUES
        ('V201',  'presencial'),
        ('V202',  'presencial'),
        ('V205',  'presencial'),
        ('V206',  'presencial'),
        ('V207',  'presencial'),
        ('V208',  'presencial');

-- Salas del AXYY (X: 2->7; Y: 1->8)

WITH RECURSIVE salas AS (SELECT 'A201' AS nombre
                         UNION ALL
                         SELECT CASE
                                    WHEN SUBSTRING(nombre, 3)::INT = 8 THEN
                                        'A' || (SUBSTRING(nombre, 2, 1)::INT + 1)::TEXT || '01'
                                    ELSE
                                        'A' || SUBSTRING(nombre, 2, 1) ||
                                        LPAD((SUBSTRING(nombre, 3)::INT + 1)::TEXT, 2, '0')
                                    END
                             FROM salas
                             WHERE SUBSTRING(nombre, 2, 1)::INT <= 7)
INSERT
    INTO sala_exposicion (nombre, tipo_sala_exposicion)
SELECT nombre, 'presencial'
    FROM salas
    WHERE nombre <= 'A708'
    ORDER BY nombre;

-- Salas virtuales

INSERT INTO sala_exposicion (nombre,
                             tipo_sala_exposicion)
    VALUES
        ('SALA VIRTUAL 001', 'virtual'),
        ('SALA VIRTUAL 002', 'virtual'),
        ('SALA VIRTUAL 003', 'virtual');

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

-----------------------------------
--| PARÁMETROS DE CONFIGURACIÓN |--
-----------------------------------


INSERT INTO parametro_configuracion (nombre,
                                     descripcion,
                                     modulo_id,
                                     tipo)
    VALUES ('antiplagio','Configure la opcion de revision antiplagio',4, 'booleano'),
           ('turnitin','Configure la opcion de revision turnitin',4, 'booleano'),
           ('modalidad_delimitacion_tema','Define delimitación de tema de tesis',1, 'string'),
           ('fecha_limite_asesor','Establece la fecha máxima para cambios de asesor',2, 'date'),
           -- Limite de tesistas por asesor
           ('LimXasesor','Numero de limites por asesor',2, 'integer'),
           --Switch para activar el limite de asesores
           ('ActivarLimiteAsesor','Configure la opcion de editar el numero de tesistas por asesor',2, 'booleano'),
           -- Tiempo limite para revisar
           ('TiempoLimiteRevisar','Configure la opcion de editar el tiempo limite (dias) para revisar el avance',2, 'integer'),
           -- Cantidad tesis en simultaneo asignadas a un jurado
           ('CantidadTesisXJurado','Configure el numero maximo de tesis que puede tener asignadas un jurado de forma simultanea',3, 'integer'),

           ('Cantidad Jurados','Cantidad maxima de jurados por tema de tesis',1, 'integer'),
           ('Tiempo Limite Jurado','Tiempo limite para que jurado revise entregables',1, 'integer'),
           ('Peso Asesor','Peso asignado a la calificación del asesor en situaciones de evaluación que involucran la participación del jurado',1, 'integer'),
           ('Limite Propuestas Alumno', 'Define el límite en cantidad de propuestas de tema de un estudiante', 1, 'integer'),
           ('Limite Postulaciones Alumno', 'Define el límite de postulaciones a temas libres que puede realizar un estudiante', 1, 'integer'),
           ('Tiempo Limite Jurado Expo', 'Tiempo limite para que jurado revise las exposiciones',1, 'integer');

