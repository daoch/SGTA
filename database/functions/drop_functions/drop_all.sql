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

DROP FUNCTION IF EXISTS get_estado_exposicion_by_id_exposicion (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS obtener_jurados_por_tema (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS obtener_exposiciones_por_etapa_formativa_por_tema (INTEGER, INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_propuestas_del_tesista_con_usuarios (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_propuestas_del_tesista_con_usuarios (TEXT) CASCADE;

DROP FUNCTION IF EXISTS listar_postulaciones_del_tesista_con_usuarios (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_postulaciones_del_tesista_con_usuarios (TEXT) CASCADE;

DROP FUNCTION IF EXISTS listar_asesores_por_subarea_conocimiento CASCADE;

DROP FUNCTION IF EXISTS obtener_sub_areas_por_carrera_usuario (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS obtener_sub_areas_por_carrera_usuario (TEXT) CASCADE;

DROP FUNCTION IF EXISTS aprobar_postulacion_propuesta_general_tesista (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS rechazar_postulacion_propuesta_general_tesista (TEXT) CASCADE;

DROP FUNCTION IF EXISTS listar_asesores_por_subarea_conocimiento_v2 CASCADE;

DROP FUNCTION IF EXISTS obtener_usuarios_por_tipo_carrera_y_busqueda CASCADE;

DROP FUNCTION IF EXISTS obtener_carreras_por_usuario CASCADE;

DROP FUNCTION IF EXISTS listar_temas_por_estado_y_carrera (TEXT, INTEGER);

DROP PROCEDURE IF EXISTS actualizar_estado_tema (integer, TEXT);

DROP FUNCTION IF EXISTS actualizar_estado_tema (integer, TEXT);

DROP FUNCTION IF EXISTS get_advisor_distribution_by_coordinator_and_ciclov2 (INTEGER, VARCHAR) CASCADE;

DROP FUNCTION IF EXISTS listar_etapas_formativas_simple () CASCADE;

DROP FUNCTION IF EXISTS obtener_detalle_etapa_formativa (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS obtener_historial_ciclos_etapa_formativa (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS get_topic_area_stats_by_user_and_ciclo (integer, varchar) CASCADE;

DROP FUNCTION IF EXISTS get_topic_area_trends_by_user (integer) CASCADE;

DROP FUNCTION IF EXISTS listar_tesistas_por_asesor (integer) CASCADE;

DROP FUNCTION IF EXISTS obtener_detalle_tesista (integer) CASCADE;

--vestigios?

DROP FUNCTION IF EXISTS actualizar_bloque_exposicion_siguientes_fases (jsonb) CASCADE;

DROP FUNCTION IF EXISTS obtener_etapas_formativas_por_tema_simple (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS obtener_exposiciones_por_etapa_formativa (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS terminar_planificacion (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS obtener_lista_directorio_asesores_alumno (
    INTEGER,
    TEXT,
    BOOLEAN,
    INTEGER[],
    INTEGER[]
) CASCADE;

DROP FUNCTION IF EXISTS sala_ocupada_en_rango (
    integer,
    timestamptz,
    timestamptz
);

DROP FUNCTION IF EXISTS obtener_exposiciones_por_usuario (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS aprobar_postulacion_propuesta_general_tesista(p_tema_id INTEGER, p_asesor_id INTEGER, p_tesista_id INTEGER) CASCADE;

DROP FUNCTION IF EXISTS aprobar_postulacion_propuesta_general_tesista(p_tema_id INTEGER, p_asesor_id INTEGER, p_tesista_id TEXT) CASCADE;

DROP FUNCTION IF EXISTS atender_solicitud_resumen(p_solicitud_id INTEGER, p_summary TEXT, p_response TEXT) CASCADE;

DROP FUNCTION IF EXISTS atender_solicitud_titulo(p_solicitud_id INTEGER, p_title VARCHAR, p_response TEXT) CASCADE;

DROP FUNCTION IF EXISTS buscar_tema_por_id(p_tema_id INTEGER) CASCADE;

DROP FUNCTION IF EXISTS calcular_progreso_alumno(p_alumno_id INTEGER) CASCADE;

DROP PROCEDURE IF EXISTS desactivar_tema_y_desasignar_usuarios(p_tema_id INTEGER) CASCADE;

DROP FUNCTION IF EXISTS get_solicitudes_by_tema(input_tema_id INTEGER, offset_val INTEGER, limit_val INTEGER) CASCADE;

DROP FUNCTION IF EXISTS get_solicitudes_by_tema_count(input_tema_id INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_bloque_con_sala(_exposicion_id INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_historial_reuniones_por_tesista(p_tesista_id INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_postulaciones_del_tesista_con_usuarios(p_tesista_id INTEGER, p_tipo_post INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_postulaciones_del_tesista_con_usuarios(p_tesista_id TEXT, p_tipo_post INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_temas_propuestos_al_asesor(p_asesor_id INTEGER, p_titulo TEXT, p_limit INTEGER, p_offset INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_temas_propuestos_por_subarea_conocimiento(p_subareas_ids INTEGER[], p_asesor_id INTEGER, p_titulo TEXT, p_limit INTEGER, p_offset INTEGER) CASCADE;

DROP FUNCTION IF EXISTS rechazar_postulacion_propuesta_general_tesista(p_tema_id INTEGER, p_asesor_id INTEGER, p_tesista_id INTEGER) CASCADE;

DROP FUNCTION IF EXISTS rechazar_postulacion_propuesta_general_tesista(p_tema_id INTEGER, p_asesor_id INTEGER, p_tesista_id TEXT) CASCADE;

DROP FUNCTION IF EXISTS rechazar_postulaciones_propuesta_general_tesista(p_tesista_id INTEGER) CASCADE;

DROP PROCEDURE IF EXISTS terminar_planificacion(idexposicion INTEGER, idetapaformativa INTEGER) CASCADE;


--


DROP FUNCTION IF EXISTS validar_tema_existe_cambiar_asesor_posible(INTEGER) CASCADE;

DROP FUNCTION IF EXISTS es_usuario_alumno(INTEGER) CASCADE;

DROP FUNCTION IF EXISTS es_profesor_asesor(INTEGER) CASCADE;

DROP FUNCTION IF EXISTS obtener_coordinador_por_carrera_usuario(INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_resumen_solicitud_cambio_asesor_usuario(INTEGER, TEXT) CASCADE;

DROP FUNCTION IF EXISTS obtener_detalle_solicitud_cambio_asesor(INTEGER) CASCADE;

DROP FUNCTION IF EXISTS obtener_detalle_usuario_solicitud_cambio_asesor(INTEGER, INTEGER) CASCADE;

DROP FUNCTION IF EXISTS puede_usuario_cambiar_solicitud(INTEGER, TEXT, INTEGER) CASCADE;

DROP PROCEDURE IF EXISTS procesar_solicitud_cambio(INTEGER, TEXT, INTEGER, BOOLEAN) CASCADE;

DROP FUNCTION IF EXISTS listar_areas_por_tema(INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_hitos_cronograma_tesista(INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listarciclosconetapas() CASCADE;

DROP FUNCTION IF EXISTS listar_temas_por_usuario_rol_estado(INTEGER, TEXT, TEXT, INTEGER, INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_temas_por_estado_y_carrera(TEXT, INTEGER, INTEGER, INTEGER) CASCADE;

DROP FUNCTION IF EXISTS contar_postulaciones(INTEGER) CASCADE;

DROP FUNCTION IF EXISTS listar_temas_libres_con_usuarios(TEXT, INTEGER, INTEGER, TEXT) CASCADE;

DROP FUNCTION IF EXISTS postular_tesista_tema_libre(INTEGER, TEXT, TEXT) CASCADE;

DROP FUNCTION IF EXISTS tiene_rol_en_tema(INTEGER, INTEGER, TEXT) CASCADE;

--

DROP FUNCTION IF EXISTS listar_etapas_formativas_alumno;
DROP FUNCTION IF EXISTS obtener_entregables_alumno;
DROP FUNCTION IF EXISTS listar_documentos_x_entregable;
DROP FUNCTION IF EXISTS entregar_entregable;

DROP FUNCTION IF EXISTS listar_entregables_x_etapa_formativa_x_ciclo;
DROP FUNCTION IF EXISTS listar_criterios_entregable_x_entregable;
DROP FUNCTION IF EXISTS listar_exposiciones_x_etapa_formativa_x_ciclo;
DROP FUNCTION IF EXISTS listar_criterios_exposicion_x_exposicion;
DROP FUNCTION IF EXISTS listar_entregables_por_usuario;
DROP FUNCTION IF EXISTS listar_exposiciones_por_usuario;
DROP FUNCTION IF EXISTS listar_entregables_con_envio_x_etapa_formativa_x_ciclo;

DROP FUNCTION IF EXISTS listar_etapas_formativas_simple CASCADE;
DROP FUNCTION IF EXISTS obtener_detalle_etapa_formativa CASCADE;
DROP FUNCTION IF EXISTS obtener_historial_ciclos_etapa_formativa CASCADE;

DROP FUNCTION IF EXISTS listar_temas_libres_postulados_alumno(TEXT) CASCADE;


DROP FUNCTION IF EXISTS obtener_profesores () CASCADE;

DROP FUNCTION IF EXISTS obtener_documentos_asesor (INTEGER) CASCADE;

DROP FUNCTION IF EXISTS obtener_exposiciones_por_usuario (INTEGER) CASCADE;
