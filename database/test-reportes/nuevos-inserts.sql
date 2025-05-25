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
-- Verificar qué ID tiene la relación para el tema 2 en exposicion_x_tema
INSERT INTO control_exposicion_usuario(exposicion_x_tema_id, usuario_x_tema_id, estado_exposicion_usuario, asistio, fecha_creacion)
VALUES
    (
        (SELECT exposicion_x_tema_id
         FROM exposicion_x_tema
         WHERE tema_id = 2 AND exposicion_id = 1),  -- Buscar el ID correcto
        (SELECT usuario_tema_id
         FROM usuario_tema
         WHERE usuario_id = 2 AND tema_id = 2),
        'esperando_respuesta', TRUE, NOW()
    );
------------------------------------------------    

-- 1. Primero vamos a crear algunos hitos en la tabla entregable
-- Estos son los hitos maestros o plantillas
INSERT INTO entregable (
    etapa_formativa_x_ciclo_id,
    nombre,
    descripcion,
    fecha_inicio,
    fecha_fin,
    estado,
    es_evaluable,
    maximo_documentos,
    extensiones_permitidas,
    peso_maximo_documento,
    activo
) VALUES
-- Hito 1: Plan de tesis
(
    1, -- etapa_formativa_x_ciclo_id (asegúrate que este ID exista)
    'Plan de Tesis',
    'Documento inicial con el planteamiento del problema, objetivos y metodología',
    '2025-08-15 08:00:00+00',
    '2025-09-01 23:59:00+00',
    'no_iniciado',
    TRUE,
    2,
    'pdf,docx',
    15,
    TRUE
),
-- Hito 2: Marco teórico
(
    1,
    'Marco Teórico',
    'Desarrollo del marco teórico y estado del arte',
    '2025-09-05 08:00:00+00',
    '2025-09-25 23:59:00+00',
    'no_iniciado',
    TRUE,
    2,
    'pdf,docx',
    20,
    TRUE
),
-- Hito 3: Desarrollo preliminar
(
    1,
    'Desarrollo Preliminar',
    'Avances iniciales del desarrollo o implementación',
    '2025-10-01 08:00:00+00',
    '2025-10-15 23:59:00+00',
    'no_iniciado',
    TRUE,
    3,
    'pdf,docx,zip',
    25,
    TRUE
),
-- Hito 4: Implementación
(
    1,
    'Implementación',
    'Desarrollo completo de la solución propuesta',
    '2025-10-20 08:00:00+00',
    '2025-11-10 23:59:00+00',
    'no_iniciado',
    TRUE,
    5,
    'pdf,docx,zip,rar',
    30,
    TRUE
),
-- Hito 5: Documentación final
(
    1,
    'Documentación Final',
    'Documento final de tesis con todos los capítulos completos',
    '2025-11-15 08:00:00+00',
    '2025-12-05 23:59:00+00',
    'no_iniciado',
    TRUE,
    2,
    'pdf',
    50,
    TRUE
);

-- 2. Ahora asociamos estos hitos a temas específicos
-- Supongamos que queremos asignar todos los hitos al tema con ID 2 y al tema con ID 3
INSERT INTO entregable_x_tema (
    entregable_id,
    tema_id,
    estado,
    activo,
    fecha_creacion,
    fecha_modificacion
)
-- Para el tema 2 (IA Aplicada)
SELECT
    e.entregable_id,
    2, -- tema_id = 2 (IA Aplicada)
    'no_enviado'::enum_estado_entrega, -- Estado inicial
    TRUE,
    NOW(),
    NOW()
FROM entregable e
WHERE e.nombre IN ('Plan de Tesis', 'Marco Teórico', 'Desarrollo Preliminar', 'Implementación', 'Documentación Final')
UNION ALL
-- Para el tema 3 (ML No Estructurados)
SELECT
    e.entregable_id,
    3, -- tema_id = 3 (ML No Estructurados)
    'no_enviado'::enum_estado_entrega, -- Estado inicial
    TRUE,
    NOW(),
    NOW()
FROM entregable e
WHERE e.nombre IN ('Plan de Tesis', 'Marco Teórico', 'Desarrollo Preliminar', 'Implementación', 'Documentación Final');

-- 3. Simulemos que algunos hitos ya han sido entregados para el tema 2
UPDATE entregable_x_tema
SET estado = 'enviado_a_tiempo'::enum_estado_entrega,
    fecha_modificacion = NOW()
WHERE tema_id = 2
AND entregable_id IN (
    SELECT entregable_id
    FROM entregable
    WHERE nombre IN ('Plan de Tesis', 'Marco Teórico')
);

-- 4. Simulemos un entregable tardío para el tema 3
UPDATE entregable_x_tema
SET estado = 'enviado_tarde'::enum_estado_entrega,
    fecha_modificacion = NOW()
WHERE tema_id = 3
AND entregable_id IN (
    SELECT entregable_id
    FROM entregable
    WHERE nombre = 'Plan de Tesis'
);