-- 4) Usuario
INSERT INTO usuario (
  tipo_usuario_id,
  codigo_PUCP,
  nombres,
  primer_apellido,
  segundo_apellido,
  correo_electronico,
  contrasena,
  biografia,
  foto_perfil,
  disponibilidad,
  tipo_disponibilidad,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  (1, '2023001', 'Renzo', 'Iwamoto', 'Kanashiro', 'renzo@pucp.edu.pe',
   '$2b$10$abcdefghijklmnopqrstuv',
   'Investigador en IA', NULL, 'Full-time', 'Inmediata',
   TRUE, NOW(), NOW());

-- 5) Usuario–Carrera
INSERT INTO usuario_carrera (
  usuario_id,
  carrera_id,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  (1, 1, TRUE, NOW(), NOW());

-- 6) Estado de Tema  (ya estaba poblado)

-- 7) Tema
INSERT INTO tema (
  codigo,
  titulo,
  resumen,
  portafolio_url,
  estado_tema_id,
  carrera_id,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  ('T001', 'Deep RL en Finanzas', 'Aplicación de DRL al portafolio BVL',
   'https://github.com/renzo/drbvl', 1, 1,
   TRUE, NOW(), NOW());

-- 8) Historial de Tema
INSERT INTO historial_tema (
  tema_id,
  titulo,
  resumen,
  descripcion_cambio,
  estado_tema_id,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  (1, 'Deep RL en Finanzas – v1', 'Resumen inicial',
   'Creación del tema', 1,
   TRUE, NOW(), NOW());

-- 9) Tipo de Solicitud  (ya estaba poblado)

-- 11) Solicitud  (ahora pide tema_id)
INSERT INTO solicitud (
  descripcion,
  tipo_solicitud_id,
  tema_id,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  ('Solicito acceso a la plataforma DRL', 1, 1,
   TRUE, NOW(), NOW());

-- 12) Usuario–Solicitud
INSERT INTO usuario_solicitud (
  usuario_id,
  solicitud_id,
  solicitud_completada,
  aprovado,
  comentario,
  destinatario,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  (1, 1, FALSE, FALSE, 'En revisión', FALSE,
   TRUE, NOW(), NOW());

-- 13) Usuario–Tema
INSERT INTO usuario_tema (
  usuario_id,
  tema_id,
  rol_id,
  asignado,
  prioridad,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  (1, 1, 1, TRUE, 1,
   TRUE, NOW(), NOW());

-- 14) Área de Conocimiento
INSERT INTO area_conocimiento (
  carrera_id,
  nombre,
  descripcion,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  (1, 'Inteligencia Artificial', 'Estudio de agentes inteligentes',
   TRUE, NOW(), NOW());

-- 15) Subárea de Conocimiento
INSERT INTO sub_area_conocimiento (
  area_conocimiento_id,
  nombre,
  descripcion,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  (1, 'Aprendizaje Automático', 'Subárea de IA centrada en aprendizaje de datos',
   TRUE, NOW(), NOW());

-- 16) SubÁrea–Tema
INSERT INTO sub_area_conocimiento_tema (
  sub_area_conocimiento_id,
  tema_id,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  (1, 1,
   TRUE, NOW(), NOW());

-- 17) Usuario–SubÁrea
INSERT INTO usuario_sub_area_conocimiento (
  usuario_id,
  sub_area_conocimiento_id,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  (1, 1,
   TRUE, NOW(), NOW());

-- 18) Módulo
INSERT INTO modulo (
  nombre,
  descripcion,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  ('Usuarios', 'Gestión de usuarios',       TRUE, NOW(), NOW()),
  ('Proyectos','Gestión de proyectos',      TRUE, NOW(), NOW());

-- 19) Permiso
INSERT INTO permiso (
  modulo_id,
  nombre,
  descripcion,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  (1, 'Crear usuario', 'Permite crear un nuevo usuario',  TRUE, NOW(), NOW()),
  (1, 'Editar usuario','Permite modificar usuarios',       TRUE, NOW(), NOW()),
  (2, 'Crear proyecto','Permite crear proyectos',          TRUE, NOW(), NOW());

-- 20) Tipo de Notificación
INSERT INTO tipo_notificacion (
  nombre,
  descripcion,
  prioridad,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  ('Email','Notificación por correo electrónico',1, TRUE, NOW(), NOW()),
  ('SMS',  'Notificación por SMS',             2, TRUE, NOW(), NOW());

-- 21) TipoUsuario–Permiso
INSERT INTO tipo_usuario_permiso (
  tipo_usuario_id,
  permiso_id,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  (1, 1, TRUE, NOW(), NOW()),
  (1, 2, TRUE, NOW(), NOW()),
  (1, 3, TRUE, NOW(), NOW());

-- 22) Notificación
INSERT INTO notificacion (
  mensaje,
  canal,
  modulo_id,
  tipo_notificacion_id,
  usuario_id,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  ('Bienvenido al sistema','Email',1,1,1, TRUE, NOW(), NOW()),
  ('Tu proyecto fue aprobado','SMS',2,2,1, TRUE, NOW(), NOW());

-- 23) Grupo de Investigación
INSERT INTO grupo_investigacion (
  nombre,
  descripcion,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  ('GRIN IA','Grupo de investigación en IA de la PUCP', TRUE, NOW(), NOW());

-- 24) Usuario–GrupoInvestigacion
INSERT INTO usuario_grupo_investigacion (
  usuario_id,
  grupo_investigacion_id,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  (1, 1, TRUE, NOW(), NOW());

-- 25) Proyecto
INSERT INTO proyecto (
  titulo,
  descripcion,
  estado,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  ('Simulador de Tráfico Urbano','Simulación de flujo vehicular','En curso',
   TRUE, NOW(), NOW());

-- 26) Usuario–Proyecto
INSERT INTO usuario_proyecto (
  usuario_id,
  proyecto_id,
  lider_proyecto,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  (1, 1, TRUE, TRUE, NOW(), NOW());

-- 27) GrupoInvestigacion–Proyecto
INSERT INTO grupo_investigacion_proyecto (
  grupo_investigacion_id,
  proyecto_id,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES
  (1, 1, TRUE, NOW(), NOW());


-- No corregido
-- (2) Parametro de configuración
INSERT INTO parametro_configuracion (
  nombre,
  descripcion,
  modulo_id,
  activo,
  fecha_creacion,
  fecha_modificacion
) VALUES (
  'Parámetro Test',
  'Descripción de prueba',
  1,
  TRUE, NOW(), NOW()
);

-- (3) Carrera–Parametro Configuración
INSERT INTO carrera_parametro_configuracion (
  valor,
  activo,
  fecha_creacion,
  fecha_modificacion,
  carrera_id,
  parametro_configuracion_id
) VALUES (
  'activo',
  TRUE, NOW(), NOW(),
  1,
  1
);

-- Para verificar
SELECT * FROM parametro_configuracion;
SELECT * FROM carrera_parametro_configuracion;
