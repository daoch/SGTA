-- 0) Habilitar pg_trgm para los índices Gin-trgm
CREATE EXTENSION IF NOT EXISTS pg_trgm;


-- 1) Índices sobre tablas de roles y estados

CREATE INDEX IF NOT EXISTS idx_rol_lower_nombre
  ON rol (LOWER(nombre));

CREATE INDEX IF NOT EXISTS idx_estado_tema_lower_nombre
  ON estado_tema (LOWER(nombre));


-- 2) Índices en "tema"

CREATE INDEX IF NOT EXISTS idx_tema_estado_activo_fecha
  ON tema (estado_tema_id, activo, fecha_creacion DESC);

CREATE INDEX IF NOT EXISTS idx_tema_titulo_trgm
  ON tema USING gin (titulo gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_tema_carrera_id
  ON tema (carrera_id);

CREATE INDEX IF NOT EXISTS idx_tema_codigo
  ON tema (codigo);


-- 3) Índices en "usuario_tema"

CREATE INDEX IF NOT EXISTS idx_ut_tema_rol_activo_rechazado_asignado
  ON usuario_tema (tema_id, rol_id, activo, rechazado, asignado);

CREATE INDEX IF NOT EXISTS idx_ut_usuario_tema
  ON usuario_tema (usuario_id, tema_id);

CREATE INDEX IF NOT EXISTS idx_ut_tema_rol_activo_asignado
  ON usuario_tema (tema_id, rol_id, activo, asignado);

-- (Opcional, si quieres un índice parcial específico para "activo = true AND asignado = false")
CREATE INDEX IF NOT EXISTS idx_ut_tema_rol_activo_notasignado_partial
  ON usuario_tema (tema_id, rol_id)
  WHERE activo = true AND asignado = false;


-- 4) Índices en "sub_area_conocimiento_tema"

CREATE INDEX IF NOT EXISTS idx_sact_tema_id
  ON sub_area_conocimiento_tema (tema_id);

CREATE INDEX IF NOT EXISTS idx_sact_sub_area_id_tema_id
  ON sub_area_conocimiento_tema (sub_area_conocimiento_id, tema_id);


-- 5) Índices en "usuario_sub_area_conocimiento"

CREATE INDEX IF NOT EXISTS idx_usac_usuario_id
  ON usuario_sub_area_conocimiento (usuario_id);

CREATE INDEX IF NOT EXISTS idx_usac_sub_area_id
  ON usuario_sub_area_conocimiento (sub_area_conocimiento_id);


-- 6) Índices en "usuario_carrera"

CREATE INDEX IF NOT EXISTS idx_uc_usuario_id
  ON usuario_carrera (usuario_id);

CREATE INDEX IF NOT EXISTS idx_uc_carrera_id
  ON usuario_carrera (carrera_id);

-- (Opcional: si filtras muchas veces por activo)
CREATE INDEX IF NOT EXISTS idx_uc_activo
  ON usuario_carrera (activo);


-- 7) Índices en "usuario"

CREATE INDEX IF NOT EXISTS idx_usuario_id_cognito
  ON usuario (id_cognito);

CREATE INDEX IF NOT EXISTS idx_usuario_activo
  ON usuario (activo);


-- 8) Índices en "sub_area_conocimiento"

CREATE INDEX IF NOT EXISTS idx_sac_area_id
  ON sub_area_conocimiento (area_conocimiento_id);

CREATE INDEX IF NOT EXISTS idx_sac_activo
  ON sub_area_conocimiento (activo);


-- 9) Índices en "area_conocimiento"

CREATE INDEX IF NOT EXISTS idx_ac_carrera_id
  ON area_conocimiento (carrera_id);

CREATE INDEX IF NOT EXISTS idx_ac_activo
  ON area_conocimiento (activo);


-- 10) Índices en "solicitud" y "usuario_solicitud"

CREATE INDEX IF NOT EXISTS idx_solicitud_tema_id
  ON solicitud (tema_id);

CREATE INDEX IF NOT EXISTS idx_usuario_solicitud_solicitud_id_destinatario
  ON usuario_solicitud (solicitud_id, destinatario);


-- 11) Índice en "recurso"

CREATE INDEX IF NOT EXISTS idx_recurso_tema_activo
  ON recurso (tema_id, activo);


-- 12) Índice en "historial_tema"

CREATE INDEX IF NOT EXISTS idx_historial_tema_tema_fecha_activo
  ON historial_tema (tema_id, activo, fecha_creacion);


-- 13) Índice trigram en "usuario.nombres" (si usas ILIKE '%...%')

CREATE INDEX IF NOT EXISTS idx_usuario_nombres_trgm
  ON usuario USING gin (nombres gin_trgm_ops);
