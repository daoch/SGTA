-- 1. Catálogos básicos ya los tienes cargados
--    tipo_usuario, tipo_dedicacion, unidad_academica, carrera, estado_tema, rol

-- 2. Usuarios y Temas (suponiendo IDs existentes)
--    usuario_id = 1 (Juan), 2 (María), …
--    tema_id    = 2 (IA Aplicada), 3 (ML No Estructurados), …

-- 3. Poblamos usuario_tema
INSERT INTO usuario_tema(usuario_id, tema_id, rol_id, asignado, creador, fecha_creacion, fecha_modificacion)
VALUES
    (1, 2,  (SELECT rol_id FROM rol WHERE nombre = 'Asesor'),   TRUE, FALSE, NOW(), NOW()),
    (2, 2,  (SELECT rol_id FROM rol WHERE nombre = 'Tesista'), TRUE, TRUE,  NOW(), NOW()),
    (3, 3,  (SELECT rol_id FROM rol WHERE nombre = 'Revisor'), TRUE, FALSE, NOW(), NOW());

-- 4. Creamos un ciclo y vinculamos etapa_formativa (ya definido)
INSERT INTO ciclo(semestre, anio, fecha_inicio, fecha_fin, activo, fecha_creacion, fecha_modificacion)
VALUES('2',2025,'2025-08-01','2025-12-20',TRUE,NOW(),NOW());
-- Supongamos etapa_formativa_x_ciclo_id = 1

-- 5. Exposiciones y su unión a temas
INSERT INTO exposicion (
    etapa_formativa_x_ciclo_id,
    estado_planificacion_id,
    nombre,
    descripcion
) VALUES (
             1,
             (SELECT estado_planificacion_id FROM estado_planificacion LIMIT 1),
             'Exposición Parcial',
             'Exposición parcial del proyecto'
         );

INSERT INTO exposicion_x_tema(exposicion_id, tema_id, estado_exposicion, activo, fecha_creacion)
VALUES(1, 2, 'sin_programar', TRUE, NOW());
-- Supongamos exposicion_x_tema_id = 1

-- 6. Finalmente, control_exposicion_usuario
INSERT INTO control_exposicion_usuario(exposicion_x_tema_id, usuario_x_tema_id, estado_exposicion_usuario, asistio, fecha_creacion)
VALUES
    (
        1,                                        -- exposicion_x_tema_id
        (SELECT usuario_tema_id                    -- usuario_x_tema_id
         FROM usuario_tema
         WHERE usuario_id = 2 AND tema_id = 2),
        'esperando_respuesta', TRUE, NOW()
    );
