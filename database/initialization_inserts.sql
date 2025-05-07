-- 1) Tipo de usuario
INSERT INTO tipo_usuario (nombre, activo, fecha_creacion, fecha_modificacion)
VALUES
  ('profesor',      TRUE, NOW(), NOW()),
  ('alumno',        TRUE, NOW(), NOW()),
  ('coordinador',   TRUE, NOW(), NOW()),
  ('administrador', TRUE, NOW(), NOW());

-- 2) Rol
INSERT INTO rol (nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
VALUES
  ('Asesor',    'Asesora a estudiantes en sus proyectos',            TRUE, NOW(), NOW()),
  ('Jurado',    'Evalúa y califica exposiciones',       TRUE, NOW(), NOW()),
  ('Revisor',   '',                TRUE, NOW(), NOW()),
  ('Creador',   'Crea el registro de la propuesta o tema libre',   TRUE, NOW(), NOW()),
  ('Tesista',   'Estudiante realizando tesis de grado o proyecto de fin de carrera',            TRUE, NOW(), NOW()),
  ('Coasesor',   'Cosesora a estudiantes en sus proyectos',            TRUE, NOW(), NOW());

-- 3) Estado de tema
INSERT INTO estado_tema (nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
VALUES
  ('PROPUESTO_LIBRE',    'Tema propuesto por asesor para que los alumnos postulen',                                                                 TRUE, NOW(), NOW()),
  ('PROPUESTO_GENERAL',  'Tema propuesto por estudiante o estudiantes en general a una subárea de conocimiento',                           TRUE, NOW(), NOW()),
  ('PROPUESTO_DIRECTO',  'Tema propuesto por estudiante directamente a un profesor (no visible a otros profesores)',                   TRUE, NOW(), NOW()),
  ('PREINSCRITO',        'Tema propuesto por estudiante que cuenta con asesor aceptado',                                                TRUE, NOW(), NOW()),
  ('INSCRITO',           'Tema inscrito con asesor con detalles formalizados',                                                      TRUE, NOW(), NOW()),
  ('REGISTRADO',         'Tema inscrito aceptado por comité de tesis',                                                          TRUE, NOW(), NOW()),
  ('RECHAZADO',          'Tema propuesto por estudiante que ha sido rechazado',                                                      TRUE, NOW(), NOW()),
  ('OBSERVADO',          'Tema inscrito con observaciones pendientes del comité de tesis',                                           TRUE, NOW(), NOW()),
  ('VENCIDO',            'Tema propuesto por asesor o estudiantes que pasó su fecha de vencimiento definida',                          TRUE, NOW(), NOW()),
  ('EN_PROGRESO',        'Tema registrado en progreso',                          TRUE, NOW(), NOW()),
  ('PAUSADO',            'Tema que ha sido registrado e iniciado, pero no está en progreso actualmente',                          TRUE, NOW(), NOW()),
  ('FINALIZADO',         'Tema que ha sido registrado y ha finalizado su proceso de evaluación',                                   TRUE, NOW(), NOW());

-- 4) Unidad académica
INSERT INTO unidad_academica (nombre, descripcion)
VALUES ('Facultad de Ciencias e Ingeniería', 'Unidad encargada de carreras de ingeniería');

-- 5) Carrera  (unidad_academica_id = 1)
INSERT INTO carrera
  (unidad_academica_id, codigo, nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
VALUES
  (1, 'INF', 'ingeniería informática', 'Carrera de software y sistemas',               TRUE, NOW(), NOW()),
  (1, 'CIV', 'ingeniería civil',      'Carrera de construcción y estructuras',       TRUE, NOW(), NOW()),
  (1, 'MEC', 'ingeniería mecánica',    'Carrera de diseño y manufactura de máquinas', TRUE, NOW(), NOW()),
  (1, 'IND', 'ingeniería industrial',  'Carrera de optimización de procesos',          TRUE, NOW(), NOW());

-- 6) Grupo de investigación
INSERT INTO grupo_investigacion (nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
VALUES
  ('Grupo de Inteligencia Artificial PUCP', 'Investigación en IA y aprendizaje automático', TRUE, NOW(), NOW());

-- 7) Módulo
INSERT INTO modulo (nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
VALUES
  ('Temas',    'Gestión de propuestas y temas de investigación', TRUE, NOW(), NOW()),
  ('Asesores', 'Administración de asesores asignados',          TRUE, NOW(), NOW()),
  ('Jurados',  'Administración de jurados de evaluación',        TRUE, NOW(), NOW()),
  ('Revisión', 'Control y seguimiento de revisiones',           TRUE, NOW(), NOW()),
  ('Reportes', 'Generación de informes y estadísticas',         TRUE, NOW(), NOW());

-- 8) Área de conocimiento (ahora incluye carrera_id)
INSERT INTO area_conocimiento (carrera_id,nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
VALUES
  -- ambas áreas las atribuimos a la carrera INF (carrera_id = 1)
  (1, 'ciencias de la computación', 'Disciplina de teorías y sistemas computacionales', TRUE, NOW(), NOW()),
  (1, 'sistemas de información',    'Estudio de sistemas para gestión de información',       TRUE, NOW(), NOW());

-- 9) Sub-área de conocimiento (área_conocimiento_id = 1)
INSERT INTO sub_area_conocimiento
  (area_conocimiento_id, nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
VALUES
  (1, 'Procesamiento de lenguaje natural', 'Técnicas para análisis y generación de texto', TRUE, NOW(), NOW()),
  (1, 'Aprendizaje por reforzamiento',     'Métodos basados en recompensas y agentes',  TRUE, NOW(), NOW()),
  (1, 'Procesamiento de imágenes',         'Algoritmos para interpretación de imágenes', TRUE, NOW(), NOW());

-- 10) Tipo de solicitud
INSERT INTO tipo_solicitud (nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
VALUES
  ('Aprobación de tema (por coordinador)', 'Solicitud para que el coordinador apruebe el tema', TRUE, NOW(), NOW());

-- 11) Tipo de notificación
INSERT INTO tipo_notificacion
  (nombre, descripcion, prioridad, activo, fecha_creacion, fecha_modificacion)
VALUES
  ('informativa',  'Mensaje informativo para el usuario', 0, TRUE, NOW(), NOW()),
  ('advertencia',  'Señal de posible problema o riesgo',   1, TRUE, NOW(), NOW()),
  ('recordatorio', 'Recordatorio de acción pendiente',     2, TRUE, NOW(), NOW()),
  ('error',        'Notificación de error crítico',        3, TRUE, NOW(), NOW());

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
  (4, 'AD01','Carla',  'Vega',    'Reyna',    'carla.vega@pucp.edu.pe',      'Administración','secret4','Admin. del sistema',   NULL, NULL,           NULL,         TRUE, NOW(), NOW())
;

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
  (4, 4, TRUE, NOW(), NOW())
;

-- 3) Relación usuario_grupo_investigacion (asignar a todos al Grupo IA PUCP, id = 1)
INSERT INTO usuario_grupo_investigacion (
    usuario_id,
    grupo_investigacion_id,
    activo,
    fecha_creacion,
    fecha_modificacion
)
VALUES
  (1, 1, TRUE, NOW(), NOW()),
  (2, 1, TRUE, NOW(), NOW()),
  (3, 1, TRUE, NOW(), NOW()),
  (4, 1, TRUE, NOW(), NOW())
;

select * from unidad_academica;
select * from rol;
select * from tipo_usuario;
select * from estado_tema;
select * from usuario;