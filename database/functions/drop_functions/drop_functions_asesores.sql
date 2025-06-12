-- Procedimientos
DROP PROCEDURE IF EXISTS aprobar_solicitud_cambio_asesor_coordinador(TEXT, INTEGER);
DROP PROCEDURE IF EXISTS rechazar_solicitud_cambio_asesor_coordinador(TEXT, INTEGER);
DROP PROCEDURE IF EXISTS rechazar_solicitud_cambio_asesor_asesor(TEXT, INTEGER);
DROP PROCEDURE IF EXISTS aprobar_solicitud_cambio_asesor_asesor(TEXT, INTEGER);
DROP PROCEDURE IF EXISTS procesar_solicitud_cambio(INTEGER, TEXT, INTEGER, BOOLEAN);

-- Funciones
DROP FUNCTION IF EXISTS obtener_temas_por_alumno(INTEGER);
DROP FUNCTION IF EXISTS puede_usuario_cambiar_solicitud(INTEGER, TEXT, INTEGER);
DROP FUNCTION IF EXISTS obtener_detalle_usuario_solicitud_cambio_asesor(INTEGER, INTEGER);
DROP FUNCTION IF EXISTS obtener_detalle_solicitud_cambio_asesor(INTEGER);
DROP FUNCTION IF EXISTS listar_resumen_solicitud_cambio_asesor_coordinador(TEXT);
DROP FUNCTION IF EXISTS listar_resumen_solicitud_cambio_asesor_usuario(INTEGER, TEXT);
DROP FUNCTION IF EXISTS cantidad_coordinador_por_carrera_tema(INTEGER);
DROP FUNCTION IF EXISTS obtener_coordinador_por_carrera_usuario(INTEGER);
DROP FUNCTION IF EXISTS es_profesor_asesor(INTEGER);
DROP FUNCTION IF EXISTS es_usuario_alumno(INTEGER);
DROP FUNCTION IF EXISTS validar_tema_existe_cambiar_asesor_posible(INTEGER);
DROP FUNCTION IF EXISTS obtener_lista_directorio_asesores_alumno(INTEGER, TEXT, BOOLEAN, INT[], INT[]);
DROP FUNCTION IF EXISTS obtener_proyectos_usuario_involucrado(INTEGER);
DROP FUNCTION IF EXISTS obtener_tesistas_tema(INTEGER);
DROP FUNCTION IF EXISTS obtener_numero_tesistas_asesor(INTEGER);
DROP FUNCTION IF EXISTS obtener_temas_usuario_asesor(INTEGER);
DROP FUNCTION IF EXISTS desactivar_usuario_areas(INTEGER, INTEGER[]);
DROP FUNCTION IF EXISTS asignar_usuario_areas(INTEGER, INTEGER[]);
DROP FUNCTION IF EXISTS desactivar_usuario_sub_areas(INTEGER, INTEGER[]);
DROP FUNCTION IF EXISTS asignar_usuario_sub_areas(INTEGER, INTEGER[]);
DROP FUNCTION IF EXISTS obtener_carreras_activas_por_usuario(INTEGER);
DROP FUNCTION obtener_perfil_usuario(TEXT);