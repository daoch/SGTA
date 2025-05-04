-- Script para eliminar todas las tablas del esquema (orden inverso de dependencias)

DROP TABLE IF EXISTS usuario_proyecto CASCADE;
DROP TABLE IF EXISTS grupo_investigacion_proyecto CASCADE;
DROP TABLE IF EXISTS usuario_grupo_investigacion CASCADE;
DROP TABLE IF EXISTS tipo_usuario_permiso CASCADE;
DROP TABLE IF EXISTS usuario_sub_area_conocimiento CASCADE;
DROP TABLE IF EXISTS sub_area_conocimiento_tema CASCADE;
DROP TABLE IF EXISTS usuario_tema CASCADE;
DROP TABLE IF EXISTS usuario_solicitud CASCADE;
DROP TABLE IF EXISTS solicitud CASCADE;
DROP TABLE IF EXISTS tipo_solicitud CASCADE;
DROP TABLE IF EXISTS notificacion CASCADE;
DROP TABLE IF EXISTS permiso CASCADE;
DROP TABLE IF EXISTS tipo_notificacion CASCADE;
DROP TABLE IF EXISTS modulo CASCADE;
DROP TABLE IF EXISTS usuario_carrera CASCADE;
DROP TABLE IF EXISTS carrera CASCADE;
DROP TABLE IF EXISTS unidad_academica CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;
DROP TABLE IF EXISTS tipo_usuario CASCADE;
DROP TABLE IF EXISTS historial_tema CASCADE;
DROP TABLE IF EXISTS tema CASCADE;
DROP TABLE IF EXISTS estado_tema CASCADE;
DROP TABLE IF EXISTS usuario_grupo_investigacion CASCADE;
DROP TABLE IF EXISTS proyecto CASCADE;
DROP TABLE IF EXISTS grupo_investigacion CASCADE;
DROP TABLE IF EXISTS grupo_investigacion_proyecto CASCADE;
DROP TABLE IF EXISTS rol CASCADE;
DROP TABLE IF EXISTS area_conocimiento CASCADE;
DROP TABLE IF EXISTS  sub_area_conocimiento CASCADE;
DROP TABLE IF EXISTS carrera_parametro_configuracion CASCADE;
DROP TABLE IF EXISTS parametro_configuracion          CASCADE;
-- NOTA: Si alguna tabla no existe, IF EXISTS evitará el error.

-- Tablas relacionadas con exposiciones
DROP TABLE IF EXISTS restriccion_exposicion CASCADE;
DROP TABLE IF EXISTS etapa_formativa_x_sala_exposicion CASCADE;
DROP TABLE IF EXISTS control_exposicion_usuario CASCADE;
DROP TABLE IF EXISTS revision_criterio_x_exposicion CASCADE;
DROP TABLE IF EXISTS criterio_exposicion CASCADE;
DROP TABLE IF EXISTS exposicion_x_tema CASCADE;
DROP TABLE IF EXISTS bloque_horario_exposicion CASCADE;
DROP TABLE IF EXISTS jornada_exposicion_x_sala_exposicion CASCADE;
DROP TABLE IF EXISTS jornada_exposicion CASCADE;
DROP TABLE IF EXISTS exposicion CASCADE;
DROP TABLE IF EXISTS tipo_exposicion_x_ef_x_c CASCADE;
DROP TABLE IF EXISTS etapa_formativa_x_ciclo CASCADE;
DROP TABLE IF EXISTS sala_exposicion CASCADE;
DROP TABLE IF EXISTS tipo_exposicion CASCADE;
DROP TABLE IF EXISTS estado_planificacion CASCADE;
DROP TABLE IF EXISTS etapa_formativa CASCADE;
DROP TABLE IF EXISTS ciclo CASCADE;

-- Eliminar tipos enumerados
DROP TYPE IF EXISTS enum_presentation_room_type CASCADE;
DROP TYPE IF EXISTS enum_presentation_user_state CASCADE;
DROP TYPE IF EXISTS enum_presentation_state CASCADE;
