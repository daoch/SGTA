DROP FUNCTION IF EXISTS obtener_carreras_activas_por_usuario (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS asignar_usuario_sub_areas (INTEGER, INTEGER[]) CASCADE;

DROP FUNCTION IF EXISTS desactivar_usuario_sub_areas (INTEGER, INTEGER[]) CASCADE;

DROP FUNCTION IF EXISTS asignar_usuario_areas (INTEGER, INTEGER[]) CASCADE;

DROP FUNCTION IF EXISTS desactivar_usuario_areas (INTEGER, INTEGER[]) CASCADE;

DROP FUNCTION IF EXISTS obtener_temas_usuario_asesor (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS obtener_numero_tesistas_asesor (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS obtener_tesistas_tema (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_entregables_x_etapa_formativa_x_ciclo (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_criterios_entregable_x_entregable (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_exposiciones_x_etapa_formativa_x_ciclo (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_criterios_exposicion_x_exposicion (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS obtener_etapas_formativas_por_usuario (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_exposicion_x_ciclo_actual_etapa_formativa (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_etapa_formativa_x_sala_exposicion (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listarciclosordenadosporfecha () CASCADE;

DROP FUNCTION IF EXISTS listaretapasformativasactivas () CASCADE;

DROP FUNCTION IF EXISTS listar_temas_ciclo_actual_x_etapa_formativa (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_jornadas_exposicion_salas (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_exposiciones_por_coordinador (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS get_advisor_distribution_by_coordinator_and_ciclo (INTEGER, VARCHAR) CASCADE;

DROP FUNCTION IF EXISTS get_juror_distribution_by_coordinator_and_ciclo (INTEGER, VARCHAR) CASCADE;

DROP FUNCTION IF EXISTS get_advisor_performance_by_user (INTEGER, VARCHAR) CASCADE;

DROP FUNCTION IF EXISTS get_topic_area_stats_by_user_and_ciclo (INTEGER, VARCHAR) CASCADE;

DROP FUNCTION IF EXISTS get_topic_area_trends_by_user (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_temas_propuestos_por_subarea_conocimiento (INTEGER[], INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_temas_propuestos_al_asesor (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_temas_por_usuario_rol_estado (INTEGER, TEXT, TEXT) CASCADE;

DROP FUNCTION IF EXISTS listar_usuarios_por_tema_y_rol (INTEGER, TEXT) CASCADE;

DROP FUNCTION IF EXISTS listar_subareas_por_tema (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS enlazar_tesistas_tema_propuesta_directa (
    INTEGER[],
    INTEGER,
    INTEGER,
    TEXT
) CASCADE;

DROP FUNCTION IF EXISTS listar_areas_conocimiento_por_usuario (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS obtener_sub_areas_por_usuario (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS postular_asesor_a_tema (
    INTEGER,
    INTEGER,
    INTEGER,
    TEXT
) CASCADE;

DROP FUNCTION IF EXISTS rechazar_tema (INTEGER, TEXT, INTEGER) CASCADE;

DROP FUNCTION IF EXISTS obtener_usuarios_por_estado (BOOLEAN) CASCADE;

DROP FUNCTION IF EXISTS obtener_usuarios_por_area_conocimiento (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS obtener_usuarios_con_temass () CASCADE;

DROP FUNCTION IF EXISTS obtener_usuarios_con_temas () CASCADE;

DROP FUNCTION IF EXISTS obtener_area_conocimiento (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS obtener_proyectos_usuario_involucrado (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_exposiciones_sin_inicializar_cicloactual_por_etapa_forma (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_bloques_horario_por_exposicion (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS actualizar_exposicon_tema_bloque_exposicion (jsonb) CASCADE;

DROP FUNCTION IF EXISTS obtener_ciclo_etapa_por_tema (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS obtener_area_conocimiento_jurado (INTEGER) CASCADE;

DROP TRIGGER IF EXISTS trigger_generar_codigo_tema ON tema;

DROP FUNCTION IF EXISTS generar_codigo_tema ();

DROP FUNCTION IF EXISTS listar_etapas_formativas_activas_by_coordinador (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS get_etapa_formativa_by_id (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS eliminar_propuestas_tesista (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS eliminar_postulaciones_tesista (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_etapa_formativa_nombre ();

DROP FUNCTION IF EXISTS obtener_jurados_por_tema (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS obtener_exposiciones_por_etapa_formativa_por_tema (INTEGER, INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_propuestas_del_tesista_con_usuarios CASCADE;

DROP FUNCTION IF EXISTS listar_postulaciones_del_tesista_con_usuarios CASCADE;

DROP FUNCTION IF EXISTS listar_asesores_por_subarea_conocimiento CASCADE;

DROP FUNCTION IF EXISTS obtener_sub_areas_por_carrera_usuario CASCADE;

DROP FUNCTION IF EXISTS aprobar_postulacion_propuesta_general_tesista CASCADE;

DROP FUNCTION IF EXISTS rechazar_postulacion_propuesta_general_tesista CASCADE;

DROP FUNCTION IF EXISTS listar_asesores_por_subarea_conocimiento_v2 CASCADE;

DROP FUNCTION IF EXISTS obtener_usuarios_por_tipo_carrera_y_busqueda CASCADE;

DROP FUNCTION IF EXISTS obtener_carreras_por_usuario CASCADE;

DROP FUNCTION IF EXISTS listar_temas_por_estado_y_carrera(TEXT, INTEGER);

DROP PROCEDURE IF EXISTS actualizar_estado_tema(integer, TEXT);
DROP FUNCTION IF EXISTS actualizar_estado_tema(integer, TEXT);
