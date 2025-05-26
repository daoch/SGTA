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


-- Insertar relaciones entre usuarios y áreas de conocimiento
INSERT INTO usuario_area_conocimiento (
    usuario_id,
    area_conocimiento_id,
    activo,
    fecha_creacion,
    fecha_modificacion
)
VALUES
    -- Juan Pérez (profesor) - Asignamos al área de ciencias de la computación <- segundo area de conocimiento asignado
    (1, 1, TRUE, NOW(), NOW()),

    -- Ana Martínez (profesora) - Asignamos al área de sistemas de información  <- segundo area de conocimiento asignado
    (5, 2, TRUE, NOW(), NOW()),

    -- Carlos Sánchez (profesor) - Asignamos al área de ciberseguridad
    (6, 3, TRUE, NOW(), NOW()),

    -- Asignamos algunos profesores a más de un área para mostrar versatilidad
    -- Juan Pérez también trabaja en sistemas de información
    (1, 2, TRUE, NOW(), NOW()),

    -- Ana Martínez también trabaja en ciencias de la computación
    (5, 1, TRUE, NOW(), NOW());


-- Asegurarse de que la columna 'asignado' exista en la tabla usuario_tema
-- Si no existe, ejecutar:
-- ALTER TABLE usuario_tema ADD COLUMN asignado BOOLEAN DEFAULT TRUE;

-- Insertar relaciones entre usuarios y temas
INSERT INTO usuario_tema(
    usuario_id,
    tema_id,
    rol_id,
    asignado,
    activo,
    fecha_creacion,
    fecha_modificacion
)
VALUES
    -- Juan Pérez como asesor del tema "Inteligencia Artificial Aplicada"
    (1, 1, (SELECT rol_id FROM rol WHERE nombre = 'Asesor'), TRUE, TRUE, NOW(), NOW()),

    -- Ana Martínez como asesora del tema "Redes Neuronales Profundas"
    (5, 3, (SELECT rol_id FROM rol WHERE nombre = 'Asesor'), TRUE, TRUE, NOW(), NOW()),

    -- Carlos Sánchez como asesor del tema "Ciberseguridad en la Era Digital"
    (6, 7, (SELECT rol_id FROM rol WHERE nombre = 'Asesor'), TRUE, TRUE, NOW(), NOW()),

    -- Carlos Sánchez como coasesor del tema "Blockchain y su Aplicación en Logística"
    (6, 6, (SELECT rol_id FROM rol WHERE nombre = 'Coasesor'), TRUE, TRUE, NOW(), NOW());

-- Asegurarnos de que los temas estén asociados al ciclo '1-2025'
-- (Asumiendo que el etapa_formativa_x_ciclo_id es 1 para este ciclo)
INSERT INTO etapa_formativa_x_ciclo_x_tema (
    etapa_formativa_x_ciclo_id,
    tema_id,
    aprobado,
    fecha_modificacion
)
SELECT 1, 1, TRUE, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM etapa_formativa_x_ciclo_x_tema
    WHERE etapa_formativa_x_ciclo_id = 1 AND tema_id = 1
);

INSERT INTO etapa_formativa_x_ciclo_x_tema (
    etapa_formativa_x_ciclo_id,
    tema_id,
    aprobado,
    fecha_modificacion
)
SELECT 1, 6, TRUE, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM etapa_formativa_x_ciclo_x_tema
    WHERE etapa_formativa_x_ciclo_id = 1 AND tema_id = 6
);

INSERT INTO etapa_formativa_x_ciclo_x_tema (
    etapa_formativa_x_ciclo_id,
    tema_id,
    aprobado,
    fecha_modificacion
)
SELECT 1, 7, TRUE, NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM etapa_formativa_x_ciclo_x_tema
    WHERE etapa_formativa_x_ciclo_id = 1 AND tema_id = 7
);

-- Crear entregables para los temas asignados al ciclo
-- Para tema 1: Inteligencia Artificial Aplicada
INSERT INTO entregable_x_tema (
    tema_id,
    entregable_id,
    estado,
    activo,
    fecha_creacion,
    fecha_modificacion
)
SELECT 1, 1, 'enviado_a_tiempo'::enum_estado_entrega, TRUE, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM entregable_x_tema
    WHERE tema_id = 1 AND entregable_id = 1
);

INSERT INTO entregable_x_tema (
    tema_id,
    entregable_id,
    estado,
    activo,
    fecha_creacion,
    fecha_modificacion
)
SELECT 1, 2, 'enviado_a_tiempo'::enum_estado_entrega, TRUE, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM entregable_x_tema
    WHERE tema_id = 1 AND entregable_id = 2
);

INSERT INTO entregable_x_tema (
    tema_id,
    entregable_id,
    estado,
    activo,
    fecha_creacion,
    fecha_modificacion
)
SELECT 1, 3, 'no_enviado'::enum_estado_entrega, TRUE, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM entregable_x_tema
    WHERE tema_id = 1 AND entregable_id = 3
);

-- Para tema 2: Machine Learning para Datos No Estructurados
INSERT INTO entregable_x_tema (
    tema_id,
    entregable_id,
    estado,
    activo,
    fecha_creacion,
    fecha_modificacion
)
SELECT 2, 1, 'enviado_a_tiempo'::enum_estado_entrega, TRUE, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM entregable_x_tema
    WHERE tema_id = 2 AND entregable_id = 1
);

INSERT INTO entregable_x_tema (
    tema_id,
    entregable_id,
    estado,
    activo,
    fecha_creacion,
    fecha_modificacion
)
SELECT 2, 2, 'enviado_a_tiempo'::enum_estado_entrega, TRUE, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM entregable_x_tema
    WHERE tema_id = 2 AND entregable_id = 2
);

INSERT INTO entregable_x_tema (
    tema_id,
    entregable_id,
    estado,
    activo,
    fecha_creacion,
    fecha_modificacion
)
SELECT 2, 3, 'enviado_a_tiempo'::enum_estado_entrega, TRUE, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM entregable_x_tema
    WHERE tema_id = 2 AND entregable_id = 3
);

-- Para otros temas
INSERT INTO entregable_x_tema (
    tema_id,
    entregable_id,
    estado,
    activo,
    fecha_creacion,
    fecha_modificacion
)
SELECT 3, 1, 'enviado_a_tiempo'::enum_estado_entrega, TRUE, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM entregable_x_tema
    WHERE tema_id = 3 AND entregable_id = 1
);

INSERT INTO entregable_x_tema (
    tema_id,
    entregable_id,
    estado,
    activo,
    fecha_creacion,
    fecha_modificacion
)
SELECT 3, 2, 'no_enviado'::enum_estado_entrega, TRUE, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM entregable_x_tema
    WHERE tema_id = 3 AND entregable_id = 2
);

INSERT INTO entregable_x_tema (
    tema_id,
    entregable_id,
    estado,
    activo,
    fecha_creacion,
    fecha_modificacion
)
SELECT 7, 1, 'enviado_a_tiempo'::enum_estado_entrega, TRUE, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM entregable_x_tema
    WHERE tema_id = 7 AND entregable_id = 1
);

INSERT INTO entregable_x_tema (
    tema_id,
    entregable_id,
    estado,
    activo,
    fecha_creacion,
    fecha_modificacion
)
SELECT 7, 2, 'enviado_a_tiempo'::enum_estado_entrega, TRUE, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM entregable_x_tema
    WHERE tema_id = 7 AND entregable_id = 2
);

INSERT INTO entregable_x_tema (
    tema_id,
    entregable_id,
    estado,
    activo,
    fecha_creacion,
    fecha_modificacion
)
SELECT 6, 1, 'enviado_a_tiempo'::enum_estado_entrega, TRUE, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM entregable_x_tema
    WHERE tema_id = 6 AND entregable_id = 1
);

INSERT INTO entregable_x_tema (
    tema_id,
    entregable_id,
    estado,
    activo,
    fecha_creacion,
    fecha_modificacion
)
SELECT 6, 3, 'no_enviado'::enum_estado_entrega, TRUE, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM entregable_x_tema
    WHERE tema_id = 6 AND entregable_id = 3
);



INSERT INTO usuario (
    tipo_usuario_id,
    codigo_pucp,
    nombres,
    primer_apellido,
    segundo_apellido,
    correo_electronico,
    nivel_estudios,
    contrasena,
    biografia,
    foto_perfil,
    disponibilidad,
    tipo_disponibilidad,
    activo,
    fecha_creacion,
    fecha_modificacion
)
VALUES

  -- Nuevos alumnos
  (2, 'A008', 'Pepito',    'Flores', 'García',   'pepito.fernandez@pucp.edu.pe', 'Pregrado',    'secret7', 'Estudiante de IA',               NULL, 'Lun-Vie 14-18',    'Híbrido',    TRUE, NOW(), NOW()),
  (2, 'A009', 'Melanie',    'Rojas',     'Huertas',  'melanie.rojas@pucp.edu.pe',      'Pregrado',    'secret8', 'Estudiante de Data Science',     NULL, 'Mar-Jue 10-12',    'Remoto',     TRUE, NOW(), NOW());


INSERT INTO usuario_tema(usuario_id, tema_id, rol_id, asignado, creador, fecha_creacion, fecha_modificacion)
VALUES
    (6, 3,  (SELECT rol_id FROM rol WHERE nombre = 'Tesista'), TRUE, TRUE,  NOW(), NOW()),
    (7, 6,  (SELECT rol_id FROM rol WHERE nombre = 'Tesista'), TRUE, TRUE,  NOW(), NOW()),
    (8, 7,  (SELECT rol_id FROM rol WHERE nombre = 'Tesista'), TRUE, TRUE,  NOW(), NOW()),
    (9, 4,  (SELECT rol_id FROM rol WHERE nombre = 'Tesista'), TRUE, TRUE,  NOW(), NOW());

-- Primero, vamos a crear el insert para asociar cada tema con su sub-área de conocimiento correspondiente
-- Realizamos las asociaciones según la temática de cada título

INSERT INTO sub_area_conocimiento_tema (
    sub_area_conocimiento_id,
    tema_id,
    activo,
    fecha_creacion,
    fecha_modificacion
)
-- Tema 1: Inteligencia Artificial Aplicada -> Procesamiento de lenguaje natural (1)
SELECT
    1, -- Procesamiento de lenguaje natural
    t.tema_id,
    TRUE,
    NOW(),
    NOW()
FROM tema t
WHERE t.titulo = 'Inteligencia Artificial Aplicada'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id
)

UNION ALL

-- Tema 2: Machine Learning para Datos No Estructurados -> Machine Learning (5)
SELECT
    5, -- Machine Learning
    t.tema_id,
    TRUE,
    NOW(),
    NOW()
FROM tema t
WHERE t.titulo = 'Machine Learning para Datos No Estructurados'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id
)

UNION ALL

-- Tema 3: Redes Neuronales Profundas -> Machine Learning (5)
SELECT
    5, -- Machine Learning
    t.tema_id,
    TRUE,
    NOW(),
    NOW()
FROM tema t
WHERE t.titulo = 'Redes Neuronales Profundas'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id
)

UNION ALL

-- Tema 4: Big Data y Análisis Predictivo -> Sistemas de gestión de bases de datos (6)
SELECT
    6, -- Sistemas de gestión de bases de datos
    t.tema_id,
    TRUE,
    NOW(),
    NOW()
FROM tema t
WHERE t.titulo = 'Big Data y Análisis Predictivo'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id
)

UNION ALL

-- Tema 5: Automatización en la Industria 4.0 -> Sistemas distribuidos (7)
SELECT
    7, -- Sistemas distribuidos
    t.tema_id,
    TRUE,
    NOW(),
    NOW()
FROM tema t
WHERE t.titulo = 'Automatización en la Industria 4.0'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id
)

UNION ALL

-- Tema 6: Blockchain y su Aplicación en Logística -> Sistemas distribuidos (7)
SELECT
    7, -- Sistemas distribuidos
    t.tema_id,
    TRUE,
    NOW(),
    NOW()
FROM tema t
WHERE t.titulo = 'Blockchain y su Aplicación en Logística'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id
)

UNION ALL

-- Tema 7: Ciberseguridad en la Era Digital -> Seguridad en redes (11)
SELECT
    11, -- Seguridad en redes
    t.tema_id,
    TRUE,
    NOW(),
    NOW()
FROM tema t
WHERE t.titulo = 'Ciberseguridad en la Era Digital'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id
)

UNION ALL

-- Tema 8: Desarrollo de Software Ágil -> Desarrollo de software (9)
SELECT
    9, -- Desarrollo de software
    t.tema_id,
    TRUE,
    NOW(),
    NOW()
FROM tema t
WHERE t.titulo = 'Desarrollo de Software Ágil'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id
)

UNION ALL

-- Tema 9: Internet de las Cosas (IoT) -> Redes de computadoras (8)
SELECT
    8, -- Redes de computadoras
    t.tema_id,
    TRUE,
    NOW(),
    NOW()
FROM tema t
WHERE t.titulo = 'Internet de las Cosas (IoT)'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id
)

UNION ALL

-- Tema 10: Tecnologías Emergentes en Medicina -> Procesamiento de imágenes (3)
SELECT
    3, -- Procesamiento de imágenes
    t.tema_id,
    TRUE,
    NOW(),
    NOW()
FROM tema t
WHERE t.titulo = 'Tecnologías Emergentes en Medicina'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id
)

UNION ALL

-- Tema 11: Detección de depresión en estudiantes... -> Visión computacional (4)
SELECT
    4, -- Visión computacional
    t.tema_id,
    TRUE,
    NOW(),
    NOW()
FROM tema t
WHERE t.titulo LIKE 'Detección de depresión en estudiantes%'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id
);

-- WAZAAAAA--------------------------------
-- 5. Insertamos nuevos profesores que actuarán como jurados
INSERT INTO usuario (
    tipo_usuario_id,
    codigo_pucp,
    nombres,
    primer_apellido,
    segundo_apellido,
    correo_electronico,
    nivel_estudios,
    contrasena,
    biografia,
    activo,
    fecha_creacion,
    fecha_modificacion
)
-- Profesores para ciencias de la computación (Redes Neuronales)
SELECT
    1,
    'P101',
    'Gabriela',
    'Martínez',
    'Rodríguez',
    'gabriela.martinez@pucp.edu.pe',
    'Doctorado',
    'pwd123',
    'Profesora especialista en machine learning y redes neuronales',
    TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE correo_electronico = 'gabriela.martinez@pucp.edu.pe')

UNION ALL

SELECT
    1,
    'P102',
    'Ricardo',
    'Paredes',
    'Luna',
    'ricardo.paredes@pucp.edu.pe',
    'Doctorado',
    'pwd123',
    'Profesor con experiencia en inteligencia artificial y computación cognitiva',
    TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE correo_electronico = 'ricardo.paredes@pucp.edu.pe')

UNION ALL

-- Profesores para ciberseguridad
SELECT
    1,
    'P103',
    'Eduardo',
    'Vega',
    'Torres',
    'eduardo.vega@pucp.edu.pe',
    'Doctorado',
    'pwd123',
    'Profesor especialista en seguridad informática y criptografía',
    TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE correo_electronico = 'eduardo.vega@pucp.edu.pe')

UNION ALL

SELECT
    1,
    'P104',
    'Sandra',
    'Morales',
    'Quiroz',
    'sandra.morales@pucp.edu.pe',
    'Doctorado',
    'pwd123',
    'Profesora experta en análisis forense digital y seguridad de redes',
    TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE correo_electronico = 'sandra.morales@pucp.edu.pe');

-- 6. Vinculamos los profesores a la carrera
INSERT INTO usuario_carrera (
    usuario_id,
    carrera_id,
    activo,
    fecha_creacion,
    fecha_modificacion
)
SELECT
    u.usuario_id,
    -- Asumimos que los temas pertenecen a la carrera_id=1 según los scripts anteriores
    1,
    TRUE, NOW(), NOW()
FROM usuario u
WHERE u.correo_electronico IN (
    'gabriela.martinez@pucp.edu.pe',
    'ricardo.paredes@pucp.edu.pe',
    'eduardo.vega@pucp.edu.pe',
    'sandra.morales@pucp.edu.pe'
)
AND NOT EXISTS (
    SELECT 1 FROM usuario_carrera uc
    WHERE uc.usuario_id = u.usuario_id AND uc.carrera_id = 2
);

-- 7. Asignamos áreas de conocimiento a los profesores
INSERT INTO usuario_area_conocimiento (
    usuario_id,
    area_conocimiento_id,
    activo,
    fecha_creacion,
    fecha_modificacion
)
-- Profesores de Ciencias de la Computación
SELECT
    u.usuario_id,
    (SELECT area_conocimiento_id FROM area_conocimiento WHERE nombre = 'ciencias de la computación'),
    TRUE, NOW(), NOW()
FROM usuario u
WHERE u.correo_electronico IN ('gabriela.martinez@pucp.edu.pe', 'ricardo.paredes@pucp.edu.pe')
AND NOT EXISTS (
    SELECT 1 FROM usuario_area_conocimiento uac
    WHERE uac.usuario_id = u.usuario_id
    AND uac.area_conocimiento_id = (SELECT area_conocimiento_id FROM area_conocimiento WHERE nombre = 'ciencias de la computación')
)

UNION ALL

-- Profesores de Ciberseguridad
SELECT
    u.usuario_id,
    (SELECT area_conocimiento_id FROM area_conocimiento WHERE nombre = 'ciberseguridad'),
    TRUE, NOW(), NOW()
FROM usuario u
WHERE u.correo_electronico IN ('eduardo.vega@pucp.edu.pe', 'sandra.morales@pucp.edu.pe')
AND NOT EXISTS (
    SELECT 1 FROM usuario_area_conocimiento uac
    WHERE uac.usuario_id = u.usuario_id
    AND uac.area_conocimiento_id = (SELECT area_conocimiento_id FROM area_conocimiento WHERE nombre = 'ciberseguridad')
);

-- 8. Asignamos rol de jurado a los profesores para los temas correspondientes
INSERT INTO usuario_tema (
    usuario_id,
    tema_id,
    rol_id,
    asignado,
    activo,
    fecha_creacion,
    fecha_modificacion
)
-- Profesores de Ciencias de la Computación para Redes Neuronales
SELECT
    u.usuario_id,
    t.tema_id,
    (SELECT rol_id FROM rol WHERE nombre = 'Jurado'),
    TRUE, TRUE, NOW(), NOW()
FROM usuario u
JOIN tema t ON t.titulo = 'Redes Neuronales Profundas'
WHERE u.correo_electronico IN ('gabriela.martinez@pucp.edu.pe', 'ricardo.paredes@pucp.edu.pe')
AND NOT EXISTS (
    SELECT 1 FROM usuario_tema ut
    WHERE ut.usuario_id = u.usuario_id
    AND ut.tema_id = t.tema_id
    AND ut.rol_id = (SELECT rol_id FROM rol WHERE nombre = 'Jurado')
)

UNION ALL

-- Profesores de Ciberseguridad para Ciberseguridad en la Era Digital
SELECT
    u.usuario_id,
    t.tema_id,
    (SELECT rol_id FROM rol WHERE nombre = 'Jurado'),
    TRUE, TRUE, NOW(), NOW()
FROM usuario u
JOIN tema t ON t.titulo = 'Ciberseguridad en la Era Digital'
WHERE u.correo_electronico IN ('eduardo.vega@pucp.edu.pe', 'sandra.morales@pucp.edu.pe')
AND NOT EXISTS (
    SELECT 1 FROM usuario_tema ut
    WHERE ut.usuario_id = u.usuario_id
    AND ut.tema_id = t.tema_id
    AND ut.rol_id = (SELECT rol_id FROM rol WHERE nombre = 'Jurado')
);

-- 9. Verificamos que estos temas estén vinculados a exposiciones del ciclo actual
INSERT INTO exposicion_x_tema (
    exposicion_id,
    tema_id,
    estado_exposicion,
    activo,
    fecha_creacion,
    fecha_modificacion
)
SELECT
    e.exposicion_id,
    t.tema_id,
    'programada',
    TRUE,
    NOW(),
    NOW()
FROM exposicion e
JOIN etapa_formativa_x_ciclo efc ON e.etapa_formativa_x_ciclo_id = efc.etapa_formativa_x_ciclo_id
JOIN ciclo c ON efc.ciclo_id = c.ciclo_id
JOIN tema t ON t.titulo IN ('Redes Neuronales Profundas', 'Ciberseguridad en la Era Digital')
WHERE c.anio = 2025 AND c.semestre = '1'
AND NOT EXISTS (
    SELECT 1 FROM exposicion_x_tema ext
    WHERE ext.tema_id = t.tema_id AND ext.exposicion_id = e.exposicion_id
);
