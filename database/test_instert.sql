-- 1) Unidad Académica
INSERT INTO unidad_academica (nombre, descripcion)
VALUES
  ('Facultad de Ingeniería', 'Facultad de Ingeniería de la PUCP');

-- 2) Carrera
INSERT INTO carrera (unidad_academica_id, codigo, nombre, descripcion)
VALUES
  (1, 'INF', 'Ingeniería Informática', 'Carrera de Ingeniería Informática');

-- 3) Tipo de Usuario
INSERT INTO tipo_usuario (nombre)
VALUES
  ('Admin'),
  ('Estudiante');

-- 4) Usuario
INSERT INTO usuario (
  tipo_usuario_id,
  codigo_PUCP,
  nombres,
  primer_apellido,
  segundo_apellido,
  correo_electronico,
  contrasena,
  bigrafia,
  foto_perfil,
  disponibilidad,
  tipo_disponibilidad
) VALUES
  (1, '2023001', 'Renzo', 'Iwamoto', 'Kanashiro', 'renzo@pucp.edu.pe',
   '$2b$10$abcdefghijklmnopqrstuv',  -- hash simulado
   'Investigador en IA', NULL, 'Full-time', 'Inmediata');

-- 5) Usuario–Carrera
INSERT INTO usuario_carrera (usuario_id, carrera_id)
VALUES (1, 1);

-- 6) Estado de Tema
INSERT INTO estado_tema (nombre, descripcion)
VALUES
  ('Pendiente', 'Tema pendiente de revisión'),
  ('Aprobado', 'Tema aprobado');

-- 7) Tema
INSERT INTO tema (codigo, titulo, resumen, portafolio_url, estado_tema_id)
VALUES
  ('T001', 'Deep RL en Finanzas', 'Aplicación de DRL al portafolio BVL',
   'https://github.com/renzo/drbvl', 1);

-- 8) Historial de Tema
INSERT INTO historial_tema (
  tema_id, titulo, resumen, descripcion_cambio, estado_tema_id
) VALUES
  (1, 'Deep RL en Finanzas – v1', 'Resumen inicial',
   'Creación del tema', 1);

-- 9) Rol
INSERT INTO rol (nombre, descripcion)
VALUES
  ('Responsable', 'Líder del tema'),
  ('Colaborador', 'Participante en el tema');

-- 10) Tipo de Solicitud
INSERT INTO tipo_solicitud (nombre, descripcion)
VALUES
  ('Acceso', 'Solicitud de acceso al sistema'),
  ('Publicación', 'Solicitud de publicación de contenido');

-- 11) Solicitud
INSERT INTO solicitud (descripcion, tipo_solicitud_id)
VALUES
  ('Solicito acceso a la plataforma DRL', 1);

-- 12) Usuario–Solicitud
INSERT INTO usuario_solicitud (
  usuario_id, solicitud_id, solicitud_completada,
  aprovado, comentario, destinatario
) VALUES
  (1, 1, FALSE, FALSE, 'En revisión', FALSE);

-- 13) Usuario–Tema
INSERT INTO usuario_tema (
  usuario_id, tema_id, rol_id, asignado, prioridad
) VALUES
  (1, 1, 1, TRUE, 1);

-- 14) Área de Conocimiento
INSERT INTO area_conocimiento (nombre, descripcion)
VALUES
  ('Inteligencia Artificial', 'Estudio de agentes inteligentes');

-- 15) Subárea de Conocimiento
INSERT INTO sub_area_conocimiento (
  area_conocimiento_id, nombre, descripcion
) VALUES
  (1, 'Aprendizaje Automático', 'Subárea de IA centrada en aprendizaje de datos');

-- 16) SubÁrea–Tema
INSERT INTO sub_area_conocimiento_tema (sub_area_conocimiento_id, tema_id)
VALUES
  (1, 1);

-- 17) Usuario–SubÁrea
INSERT INTO usuario_sub_area_conocimiento (usuario_id, sub_area_conocimiento_id)
VALUES
  (1, 1);

-- 18) Módulo
INSERT INTO modulo (nombre, descripcion)
VALUES
  ('Usuarios', 'Gestión de usuarios'),
  ('Proyectos', 'Gestión de proyectos');

-- 19) Permiso
INSERT INTO permiso (modulo_id, nombre, descripcion)
VALUES
  (1, 'Crear usuario', 'Permite crear un nuevo usuario'),
  (1, 'Editar usuario', 'Permite modificar usuarios'),
  (2, 'Crear proyecto', 'Permite crear proyectos');

-- 20) Tipo de Notificación
INSERT INTO tipo_notificacion (nombre, descripcion, prioridad)
VALUES
  ('Email', 'Notificación por correo electrónico', 1),
  ('SMS',   'Notificación por SMS',              2);

-- 21) TipoUsuario–Permiso
INSERT INTO tipo_usuario_permiso (tipo_usuario_id, permiso_id)
VALUES
  (1, 1),
  (1, 2),
  (1, 3);

-- 22) Notificación
INSERT INTO notificacion (
  mensaje, canal, modulo_id, tipo_notificacion_id, usuario_id
) VALUES
  ('Bienvenido al sistema', 'Email',  1, 1, 1),
  ('Tu proyecto fue aprobado', 'SMS',  2, 2, 1);

-- 23) Grupo de Investigación
INSERT INTO grupo_investigacion (nombre, descripcion)
VALUES
  ('GRIN IA', 'Grupo de investigación en IA de la PUCP');

-- 24) Usuario–GrupoInvestigacion
INSERT INTO usuario_grupo_investigacion (usuario_id, grupo_investigacion_id)
VALUES
  (1, 1);

-- 25) Proyecto
INSERT INTO proyecto (titulo, descripcion, estado)
VALUES
  ('Simulador de Tráfico Urbano', 'Simulación de flujo vehicular', 'En curso');

-- 26) Usuario–Proyecto
INSERT INTO usuario_proyecto (usuario_id, proyecto_id, lider_proyecto)
VALUES
  (1, 1, TRUE);

-- 27) GrupoInvestigacion–Proyecto
INSERT INTO grupo_investigacion_proyecto (grupo_investigacion_id, proyecto_id)
VALUES
  (1, 1);

-- (2) Insertar en parametro_configuracion
INSERT INTO parametro_configuracion (
  nombre, descripcion, modulo_id
) VALUES (
  'Parámetro Test', 
  'Descripción de prueba', 
  1  -- módulo_id
);

-- (3) Insertar en carrera_parametro_configuracion
INSERT INTO carrera_parametro_configuracion (
  estado,
  cantidad,
  carrera_id,
  parametro_configuracion_id
) VALUES (
  'activo', 
  10,   -- cantidad de ejemplo
  1,    -- carrera_id
  1     -- parametro_configuracion_id
);

-- (4) Verificar contenido
SELECT * FROM parametro_configuracion;
SELECT * FROM carrera_parametro_configuracion;
