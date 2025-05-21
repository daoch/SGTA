-- TIPOS

INSERT INTO tipo_usuario (nombre,
                          activo,
                          fecha_creacion,
                          fecha_modificacion)
    VALUES ('profesor', TRUE, now(), now()),
           ('alumno', TRUE, now(), now()),
           ('coordinador', TRUE, now(), now()),
           ('administrador', TRUE, now(), now());


INSERT INTO tipo_dedicacion (iniciales, descripcion)
    VALUES ('TC', 'Tiempo completo'),
           ('TPC', 'Tiempo parcial convencional'),
           ('TPA', 'Tiempo parcial por asignaturas');


INSERT INTO tipo_solicitud (nombre,
                            descripcion,
                            activo,
                            fecha_creacion,
                            fecha_modificacion)
    VALUES ('Aprobación de tema (por coordinador)', 'Solicitud para que el coordinador apruebe el tema', TRUE, now(), now());


INSERT INTO tipo_notificacion (nombre,
                               descripcion,
                               prioridad,
                               activo,
                               fecha_creacion,
                               fecha_modificacion)
    VALUES ('informativa', 'Mensaje informativo para el usuario', 0, TRUE, now(), now()),
           ('advertencia', 'Señal de posible problema o riesgo', 1, TRUE, now(), now()),
           ('recordatorio', 'Recordatorio de acción pendiente', 2, TRUE, now(), now()),
           ('error', 'Notificación de error crítico', 3, TRUE, now(), now());


-- ENTIDADES FIJAS

INSERT INTO rol (nombre,
                 descripcion,
                 activo,
                 fecha_creacion,
                 fecha_modificacion)
    VALUES ('Asesor', 'Asesora a estudiantes en sus proyectos', TRUE, now(), now()),
           ('Jurado', 'Evalúa y califica exposiciones', TRUE, now(), now()),
           ('Revisor', '', TRUE, now(), now()),
           ('Tesista', 'Estudiante realizando tesis de grado o proyecto de fin de carrera', TRUE, now(), now()),
           ('Coasesor', 'Cosesora a estudiantes en sus proyectos', TRUE, now(), now());

INSERT INTO estado_planificacion (nombre,
                                  activo,
                                  fecha_creacion,
                                  fecha_modificacion)
    VALUES ('Sin planificar', TRUE, now(), now()),
           ('Planificacion inicial', TRUE, now(), now()),
           ('Fase 1', TRUE, now(), now()),
           ('Fase 2', TRUE, now(), now()),
           ('Cierre de planificación', TRUE, now(), now());
