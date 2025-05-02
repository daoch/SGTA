-- 1) Tipo de usuario
INSERT INTO sgtadb.tipo_usuario (nombre, activo, fecha_creacion, fecha_modificacion)
VALUES
  ('profesor',      TRUE, NOW(), NOW()),
  ('alumno',        TRUE, NOW(), NOW()),
  ('coordinador',   TRUE, NOW(), NOW()),
  ('administrador', TRUE, NOW(), NOW());

-- 2) Rol
INSERT INTO sgtadb.rol (nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
VALUES
  ('Asesor',    'Asesora a estudiantes en sus proyectos',            TRUE, NOW(), NOW()),
  ('Jurado',    'Evalúa y califica exposiciones',       TRUE, NOW(), NOW()),
  ('Revisor',   '',                TRUE, NOW(), NOW()),
  ('Creador',   'Crea el registro de la propuesta o tema libre',   TRUE, NOW(), NOW()),
  ('Tesista',   'Estudiante realizando tesis de grado o proyecto de fin de carrera',            TRUE, NOW(), NOW());

-- 3) Estado de tema
INSERT INTO sgtadb.estado_tema (nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
VALUES
  ('Libre',     'Tema propuesto por asesor          ',                         TRUE, NOW(), NOW()),
  ('Propuesto', 'Tema propuesto por estudiante o estudientes',                  TRUE, NOW(), NOW()),
  ('Inscrito',  'Tema inscrito con asesor con detalles formalizados',   TRUE, NOW(), NOW()),
  ('Rechazado', 'Tema propuesto por estudiante que ha sido rechazado',          TRUE, NOW(), NOW()),
  ('Observado', 'Tema inscrito con observaciones pendientes del comité de tesis',      TRUE, NOW(), NOW()),
  ('Vencido',   'Tema propuesto por asesor o estudiantes que pasó su fecha de vencimiento definida',                  TRUE, NOW(), NOW());

-- 4) Unidad académica
INSERT INTO sgtadb.unidad_academica (nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
VALUES
  ('facultad de ciencias e ingeniería', 'Unidad encargada de carreras de ingeniería', TRUE, NOW(), NOW());

-- 5) Carrera  (unidad_academica_id = 1)
INSERT INTO sgtadb.carrera
  (unidad_academica_id, codigo, nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
VALUES
  (1, 'INF', 'ingeniería informática', 'Carrera de software y sistemas',               TRUE, NOW(), NOW()),
  (1, 'CIV', 'ingeniería civil',      'Carrera de construcción y estructuras',       TRUE, NOW(), NOW()),
  (1, 'MEC', 'ingeniería mecánica',    'Carrera de diseño y manufactura de máquinas', TRUE, NOW(), NOW()),
  (1, 'IND', 'ingeniería industrial',  'Carrera de optimización de procesos',          TRUE, NOW(), NOW());

-- 6) Grupo de investigación
INSERT INTO sgtadb.grupo_investigacion (nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
VALUES
  ('Grupo de Inteligencia Artificial PUCP', 'Investigación en IA y aprendizaje automático', TRUE, NOW(), NOW());

-- 7) Módulo
INSERT INTO sgtadb.modulo (nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
VALUES
  ('Temas',    'Gestión de propuestas y temas de investigación', TRUE, NOW(), NOW()),
  ('Asesores', 'Administración de asesores asignados',          TRUE, NOW(), NOW()),
  ('Jurados',  'Administración de jurados de evaluación',        TRUE, NOW(), NOW()),
  ('Revisión', 'Control y seguimiento de revisiones',           TRUE, NOW(), NOW()),
  ('Reportes', 'Generación de informes y estadísticas',         TRUE, NOW(), NOW());

-- 8) Área de conocimiento
INSERT INTO sgtadb.area_conocimiento (nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
VALUES
  ('ciencias de la computación', 'Disciplina de teorías y sistemas computacionales',   TRUE, NOW(), NOW()),
  ('sistemas de información',    'Estudio de sistemas para gestión de información', TRUE, NOW(), NOW());

-- 9) Sub-área de conocimiento (área_conocimiento_id = 1)
INSERT INTO sgtadb.sub_area_conocimiento
  (area_conocimiento_id, nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
VALUES
  (1, 'Procesamiento de lenguaje natural', 'Técnicas para análisis y generación de texto', TRUE, NOW(), NOW()),
  (1, 'Aprendizaje por reforzamiento',     'Métodos basados en recompensas y agentes',  TRUE, NOW(), NOW()),
  (1, 'Procesamiento de imágenes',         'Algoritmos para interpretación de imágenes', TRUE, NOW(), NOW());

-- 10) Tipo de solicitud
INSERT INTO sgtadb.tipo_solicitud (nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
VALUES
  ('Aprobación de tema (por coordinador)', 'Solicitud para que el coordinador apruebe el tema', TRUE, NOW(), NOW());

-- 11) Tipo de notificación
INSERT INTO sgtadb.tipo_notificacion
  (nombre, descripcion, prioridad, activo, fecha_creacion, fecha_modificacion)
VALUES
  ('informativa',  'Mensaje informativo para el usuario', 0, TRUE, NOW(), NOW()),
  ('advertencia',  'Señal de posible problema o riesgo',   1, TRUE, NOW(), NOW()),
  ('recordatorio', 'Recordatorio de acción pendiente',     2, TRUE, NOW(), NOW()),
  ('error',        'Notificación de error crítico',        3, TRUE, NOW(), NOW());
