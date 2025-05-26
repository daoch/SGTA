-- Tablas de usuarios y roles (hijas primero)
DROP TABLE IF EXISTS usuario_rol					  CASCADE;
DROP TABLE IF EXISTS usuario_proyecto                 CASCADE;
DROP TABLE IF EXISTS grupo_investigacion_proyecto     CASCADE;
DROP TABLE IF EXISTS usuario_grupo_investigacion      CASCADE;
DROP TABLE IF EXISTS tipo_usuario_permiso             CASCADE;
DROP TABLE IF EXISTS usuario_sub_area_conocimiento    CASCADE;
DROP TABLE IF EXISTS usuario_area_conocimiento    	  CASCADE;
DROP TABLE IF EXISTS sub_area_conocimiento_tema       CASCADE;
DROP TABLE IF EXISTS usuario_tema                     CASCADE;
DROP TABLE IF EXISTS usuario_solicitud                CASCADE;
DROP TABLE IF EXISTS solicitud                        CASCADE;
DROP TABLE IF EXISTS tipo_solicitud                   CASCADE;
DROP TABLE IF EXISTS notificacion                     CASCADE;
DROP TABLE IF EXISTS permiso                          CASCADE;
DROP TABLE IF EXISTS tipo_notificacion                CASCADE;
DROP TABLE IF EXISTS modulo                           CASCADE;
DROP TABLE IF EXISTS usuario_carrera                  CASCADE;
DROP TABLE IF EXISTS usuario_reunion                  CASCADE;
DROP TABLE IF EXISTS reunion                          CASCADE;

-- Tablas académicas y de configuración
DROP TABLE IF EXISTS carrera_parametro_configuracion   CASCADE;
DROP TABLE IF EXISTS parametro_configuracion           CASCADE;
DROP TABLE IF EXISTS carrera                           CASCADE;
DROP TABLE IF EXISTS unidad_academica                  CASCADE;
DROP TABLE IF EXISTS usuario                           CASCADE;
DROP TABLE IF EXISTS tipo_usuario                      CASCADE;

-- Tablas de gestión de temas y proyectos
DROP TABLE IF EXISTS usuario_grupo_investigacion       CASCADE;  -- si no está repetida
DROP TABLE IF EXISTS proyecto                          CASCADE;
DROP TABLE IF EXISTS grupo_investigacion                CASCADE;
DROP TABLE IF EXISTS grupo_investigacion_proyecto       CASCADE;
DROP TABLE IF EXISTS rol                                CASCADE;
DROP TABLE IF EXISTS area_conocimiento                  CASCADE;
DROP TABLE IF EXISTS sub_area_conocimiento               CASCADE;
DROP TABLE IF EXISTS recurso                            CASCADE;
DROP TABLE IF EXISTS tema                               CASCADE;
DROP TABLE IF EXISTS historial_tema                     CASCADE;
DROP TABLE IF EXISTS estado_tema                        CASCADE;
DROP TABLE IF EXISTS tipo_rechazo_tema CASCADE;


-- Tablas de exposiciones
DROP TABLE IF EXISTS restriccion_exposicion               CASCADE;
DROP TABLE IF EXISTS etapa_formativa_x_sala_exposicion   CASCADE;
DROP TABLE IF EXISTS control_exposicion_usuario           CASCADE;
DROP TABLE IF EXISTS revision_criterio_x_exposicion       CASCADE;
DROP TABLE IF EXISTS criterio_exposicion                  CASCADE;
DROP TABLE IF EXISTS exposicion_x_tema                    CASCADE;
DROP TABLE IF EXISTS bloque_horario_exposicion           CASCADE;
DROP TABLE IF EXISTS jornada_exposicion_x_sala_exposicion CASCADE;
DROP TABLE IF EXISTS jornada_exposicion                   CASCADE;
DROP TABLE IF EXISTS exposicion                           CASCADE;
DROP TABLE IF EXISTS tipo_exposicion_x_ef_x_c             CASCADE;
DROP TABLE IF EXISTS etapa_formativa_x_ciclo              CASCADE;
DROP TABLE IF EXISTS etapa_formativa_x_ciclo_x_tema       CASCADE;
DROP TABLE IF EXISTS sala_exposicion                      CASCADE;
DROP TABLE IF EXISTS tipo_exposicion                      CASCADE;
DROP TABLE IF EXISTS estado_planificacion                 CASCADE;
DROP TABLE IF EXISTS etapa_formativa                      CASCADE;
DROP TABLE IF EXISTS ciclo                                CASCADE;

-- Tablas de revisiones y entregables
DROP TABLE IF EXISTS observacion                          CASCADE;
DROP TABLE IF EXISTS tipo_observacion                     CASCADE;
DROP TABLE IF EXISTS revision_criterio_entregable         CASCADE;
DROP TABLE IF EXISTS entregable_x_tema                    CASCADE;
DROP TABLE IF EXISTS criterio_entregable                  CASCADE;
DROP TABLE IF EXISTS usuario_documento                    CASCADE;
DROP TABLE IF EXISTS version_documento                    CASCADE;
DROP TABLE IF EXISTS revision_documento                   CASCADE;
DROP TABLE IF EXISTS documento                            CASCADE;
DROP TABLE IF EXISTS entregable                           CASCADE;

-- Finalmente, los ENUMs
DROP TYPE IF EXISTS enum_estado_exposicion              CASCADE;
DROP TYPE IF EXISTS enum_estado_usuario_exposicion       CASCADE;
DROP TYPE IF EXISTS enum_tipo_sala_exposicion           CASCADE;
DROP TYPE IF EXISTS enum_estado_entrega                 CASCADE;
DROP TYPE IF EXISTS enum_estado_actividad                CASCADE;
DROP TYPE IF EXISTS enum_estado_revision                CASCADE;
DROP TYPE IF EXISTS enum_tipo_dato                      CASCADE;

DROP TABLE IF EXISTS tipo_dedicacion cascade;

DROP TABLE IF EXISTS criterio_entregable_preset cascade;

DROP TABLE IF EXISTS criterio_exposicion_preset cascade;
