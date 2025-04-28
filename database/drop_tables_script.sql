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
