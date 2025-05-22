-- 1) Temas propuestos por subárea y asesor
DROP FUNCTION IF EXISTS listar_temas_propuestos_por_subarea_conocimiento(integer[], integer);

-- 2) Temas propuestos al asesor
DROP FUNCTION IF EXISTS listar_temas_propuestos_al_asesor(integer);

-- 3) Temas por usuario, rol y estado
DROP FUNCTION IF EXISTS listar_temas_por_usuario_rol_estado(integer, text, text);

-- 4) Usuarios vinculados a un tema según rol
DROP FUNCTION IF EXISTS listar_usuarios_por_tema_y_rol(integer, text);

-- 5) Subáreas por tema
DROP FUNCTION IF EXISTS listar_subareas_por_tema(integer);

-- 6) Enlazar tesistas a propuesta directa
DROP FUNCTION IF EXISTS enlazar_tesistas_tema_propuesta_directa(integer[], integer, integer, text);

-- 7) Áreas de conocimiento por usuario
DROP FUNCTION IF EXISTS listar_areas_conocimiento_por_usuario(integer);

-- 8) Obtener sub-áreas por usuario
DROP FUNCTION IF EXISTS obtener_sub_areas_por_usuario(integer);

-- 9) Postular asesor a tema
DROP FUNCTION IF EXISTS postular_asesor_a_tema(integer, integer, integer, text);

-- 10) Rechazar tema
DROP FUNCTION IF EXISTS rechazar_tema(integer, text, integer);

-- Eliminar la función que maneja PROPUESTO_DIRECTO y PROPUESTO_GENERAL
DROP FUNCTION IF EXISTS eliminar_propuestas_tesista(INTEGER);

-- Eliminar la función que maneja TEMA_LIBRE
DROP FUNCTION IF EXISTS eliminar_postulaciones_tesista(INTEGER);

DROP TRIGGER IF EXISTS trigger_generar_codigo_tema ON tema;

DROP FUNCTION IF EXISTS generar_codigo_tema();

DROP FUNCTION IF EXISTS listar_propuestas_del_tesista_con_usuarios CASCADE;

DROP FUNCTION IF EXISTS listar_postulaciones_del_tesista_con_usuarios CASCADE;

DROP FUNCTION IF EXISTS listar_asesores_por_subarea_conocimiento CASCADE;

DROP FUNCTION IF EXISTS obtener_sub_areas_por_carrera_usuario CASCADE;

DROP FUNCTION IF EXISTS aprobar_postulacion_propuesta_general_tesista CASCADE;

DROP FUNCTION IF EXISTS rechazar_postulacion_propuesta_general_tesista CASCADE;

DROP FUNCTION IF EXISTS listar_asesores_por_subarea_conocimiento_v2 CASCADE;

DROP FUNCTION IF EXISTS obtener_usuarios_por_tipo_carrera_y_busqueda CASCADE;

DROP FUNCTION IF EXISTS obtener_carreras_por_usuario CASCADE;