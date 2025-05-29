insert into reunion (reunion_id,titulo,fecha_hora_inicio,fecha_hora_fin,descripcion,disponible,url,fecha_creacion,fecha_modificacion,activo)
values (1,'Primera reunion','2025-06-10 16:00:00','2025-06-10 17:00:00','Primera reunion',1,'presencial',NOW(),NOW(),true),
(2,'Segunda reunion','2025-06-17 16:00:00','2025-06-17 17:00:00','Segunda reunion',2,'presencial',NOW(),NOW(),true);

insert into usuario_reunion (usuario_reunion_id,reunion_id,usuario_id,estado_asistencia,estado_detalle,fecha_creacion,fecha_modificacion,activo)
values (1,1,1,'Pendiente','Pendiente',NOW(),NOW(),true), (2,1,2,'Pendiente','Pendiente',NOW(),NOW(),true),
(3,2,1,'Pendiente','Pendiente',NOW(),NOW(),true), (4,2,2,'Pendiente','Pendiente',NOW(),NOW(),true);

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
  (2, 2, 2, TRUE, 1,
   TRUE, NOW(), NOW());
   
INSERT INTO exposicion_x_tema (exposicion_x_tema_id,exposicion_id,tema_id,activo,fecha_creacion,fecha_modificacion)
VALUES (1,1,2,TRUE,NOW(),NOW());

INSERT INTO bloque_horario_exposicion (bloque_horario_exposicion_id,jornada_exposicion_x_sala_id,exposicion_x_tema_id,es_bloque_reservado,es_bloque_bloqueado,datetime_inicio,datetime_fin,activo,fecha_creacion,fecha_modificacion)
VALUES (1,1,1,TRUE,TRUE,'2025-06-10 17:00:00','2025-06-10 18:00:00',TRUE,NOW(),NOW());