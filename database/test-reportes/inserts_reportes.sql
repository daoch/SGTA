-- INSERTS PARA REPORTES
-- 1.1 Coordinador (ya existe con usuario_id = 3)

-- 1.2 Asesores (tipo_usuario_id = 1, "profesor")
-- Primero aseguramos la secuencia de usuario
SELECT setval(
    pg_get_serial_sequence('usuario','usuario_id'),
    (SELECT COALESCE(MAX(usuario_id), 1) FROM usuario)
);

-- Insertamos nuevos usuarios solo si no existen
INSERT INTO usuario (
    tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido,
    correo_electronico, nivel_estudios, contrasena, biografia,
    activo, fecha_creacion, fecha_modificacion
)
SELECT 1, 'P002', 'Ana',    'Torres',   'González',  'ana.torres@pucp.edu.pe',   'Doctorado', 'pwd5', 'Asesora IA',   TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE correo_electronico = 'ana.torres@pucp.edu.pe')
UNION ALL
SELECT 1, 'P003', 'Carlos', 'Duarte',   'Ramírez',   'carlos.duarte@pucp.edu.pe', 'Doctorado', 'pwd6', 'Asesor SIC',   TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE correo_electronico = 'carlos.duarte@pucp.edu.pe');

-- Vinculamos los usuarios a la carrera 2
INSERT INTO usuario_carrera (
    usuario_id, carrera_id, activo, fecha_creacion, fecha_modificacion
)
SELECT u.usuario_id, 2, TRUE, NOW(), NOW()
FROM usuario u
WHERE u.correo_electronico IN ('ana.torres@pucp.edu.pe', 'carlos.duarte@pucp.edu.pe', 'luis.ramirez@pucp.edu.pe')
AND NOT EXISTS (
    SELECT 1 FROM usuario_carrera uc
    WHERE uc.usuario_id = u.usuario_id AND uc.carrera_id = 2
);

-- Aseguramos secuencia de temas
SELECT setval(
    pg_get_serial_sequence('tema','tema_id'),
    (SELECT COALESCE(MAX(tema_id), 1) FROM tema)
);

-- 3.1 Temas de ejemplo
INSERT INTO tema (
    codigo, titulo, resumen, metodologia, objetivos,
    estado_tema_id, carrera_id, activo, fecha_creacion, fecha_modificacion
)
SELECT 'T-002', 'Optimización de rutas', 'Resumen Rutas', 'Método X', 'Reducir tiempo de viaje',
     1, 2, TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tema WHERE codigo = 'T-002')
UNION ALL
SELECT 'T-003', 'Análisis de datos', 'Resumen Datos', 'Método Y', 'Mejorar precisión',
     1, 2, TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tema WHERE codigo = 'T-003');

-- Aseguramos secuencia de usuario_tema
SELECT setval(
    pg_get_serial_sequence('usuario_tema','usuario_tema_id'),
    (SELECT COALESCE(MAX(usuario_tema_id), 1) FROM usuario_tema)
);

-- Vinculamos usuarios con temas (rol_id = 1 es "Asesor")
INSERT INTO usuario_tema (
    usuario_id, tema_id, rol_id, asignado, activo, fecha_creacion, fecha_modificacion
)
SELECT
    u.usuario_id,
    t.tema_id,
    1, -- rol_id = 1 (Asesor)
    TRUE, TRUE, NOW(), NOW()
FROM usuario u
JOIN tema t ON
    (u.correo_electronico = 'ana.torres@pucp.edu.pe' AND t.codigo = 'T-002') OR
    (u.correo_electronico = 'carlos.duarte@pucp.edu.pe' AND t.codigo = 'T-003')
WHERE NOT EXISTS (
    SELECT 1 FROM usuario_tema ut
    WHERE ut.usuario_id = u.usuario_id AND ut.tema_id = t.tema_id
);

-- Vinculamos temas con sub-áreas
INSERT INTO sub_area_conocimiento_tema (
    sub_area_conocimiento_id, tema_id, activo, fecha_creacion, fecha_modificacion
)
SELECT 2, t.tema_id, TRUE, NOW(), NOW()
FROM tema t
WHERE t.codigo = 'T-002'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id AND sact.sub_area_conocimiento_id = 2
)
UNION ALL
SELECT 3, t.tema_id, TRUE, NOW(), NOW()
FROM tema t
WHERE t.codigo = 'T-003'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id AND sact.sub_area_conocimiento_id = 3
);

-- Aseguramos secuencia de exposicion_x_tema
SELECT setval(
    pg_get_serial_sequence('exposicion_x_tema','exposicion_x_tema_id'),
    (SELECT COALESCE(MAX(exposicion_x_tema_id), 1) FROM exposicion_x_tema)
);

-- Relacionamos temas con exposición
INSERT INTO exposicion_x_tema (
    exposicion_id, tema_id, estado_exposicion, activo, fecha_creacion, fecha_modificacion
)
SELECT
    1, -- exposicion_id = 1
    t.tema_id,
    'programada',
    TRUE,
    NOW(),
    NOW()
FROM tema t
WHERE t.codigo IN ('T-002', 'T-003')
AND NOT EXISTS (
    SELECT 1 FROM exposicion_x_tema ext
    WHERE ext.tema_id = t.tema_id AND ext.exposicion_id = 1
);

---------------------------------------------------------------------------------------------------------------------------
-- Datos de prueba para get_juror_distribution_by_coordinator_and_ciclo

-- Temas nuevos
INSERT INTO tema (
    codigo, titulo, resumen, metodologia, objetivos,
    estado_tema_id, carrera_id, activo, fecha_creacion, fecha_modificacion
)
SELECT 'TJ-01', 'Estudio de X', 'Resumen X', 'Método A', 'Objetivo A', 1, 2, TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tema WHERE codigo = 'TJ-01')
UNION ALL
SELECT 'TJ-02', 'Investigación Y', 'Resumen Y', 'Método B', 'Objetivo B', 1, 2, TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tema WHERE codigo = 'TJ-02')
UNION ALL
SELECT 'TJ-03', 'Proyecto Z', 'Resumen Z', 'Método C', 'Objetivo C', 1, 2, TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tema WHERE codigo = 'TJ-03');

-- Vinculamos temas con sub-áreas
INSERT INTO sub_area_conocimiento_tema (
    sub_area_conocimiento_id, tema_id, activo, fecha_creacion, fecha_modificacion
)
SELECT 1, t.tema_id, TRUE, NOW(), NOW()
FROM tema t
WHERE t.codigo = 'TJ-01'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id AND sact.sub_area_conocimiento_id = 1
)
UNION ALL
SELECT 2, t.tema_id, TRUE, NOW(), NOW()
FROM tema t
WHERE t.codigo = 'TJ-02'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id AND sact.sub_area_conocimiento_id = 2
)
UNION ALL
SELECT 3, t.tema_id, TRUE, NOW(), NOW()
FROM tema t
WHERE t.codigo = 'TJ-03'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id AND sact.sub_area_conocimiento_id = 3
);

-- Vinculamos temas con exposición
INSERT INTO exposicion_x_tema (
    exposicion_id, tema_id, estado_exposicion, activo, fecha_creacion, fecha_modificacion
)
SELECT
    1,
    t.tema_id,
    'programada',
    TRUE,
    NOW(),
    NOW()
FROM tema t
WHERE t.codigo IN ('TJ-01', 'TJ-02', 'TJ-03')
AND NOT EXISTS (
    SELECT 1 FROM exposicion_x_tema ext
    WHERE ext.tema_id = t.tema_id AND ext.exposicion_id = 1
);

-- Usuarios nuevos con rol "profesor" para actuar como jurados
INSERT INTO usuario (
    tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido,
    correo_electronico, nivel_estudios, contrasena, biografia,
    activo, fecha_creacion, fecha_modificacion
)
SELECT 1, 'P006', 'Mónica', 'Ruiz', 'Valle', 'monica.ruiz@pucp.edu.pe', 'Doctorado', 'pwd9', 'Jurado IA', TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE correo_electronico = 'monica.ruiz@pucp.edu.pe')
UNION ALL
SELECT 1, 'P007', 'Pablo', 'Flores', 'Gonzalez', 'pablo.flores@pucp.edu.pe', 'Doctorado', 'pwd10', 'Jurado Datos', TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE correo_electronico = 'pablo.flores@pucp.edu.pe');

-- Vinculamos jurados con carrera
INSERT INTO usuario_carrera (
    usuario_id, carrera_id, activo, fecha_creacion, fecha_modificacion
)
SELECT u.usuario_id, 2, TRUE, NOW(), NOW()
FROM usuario u
WHERE u.correo_electronico IN ('monica.ruiz@pucp.edu.pe', 'pablo.flores@pucp.edu.pe')
AND NOT EXISTS (
    SELECT 1 FROM usuario_carrera uc
    WHERE uc.usuario_id = u.usuario_id AND uc.carrera_id = 2
);

-- Asignamos rol de jurado a usuarios sobre temas
INSERT INTO usuario_tema (
    usuario_id, tema_id, rol_id, asignado, activo, fecha_creacion, fecha_modificacion
)
SELECT
    u.usuario_id,
    t.tema_id,
    2, -- rol_id = 2 (Jurado)
    TRUE, TRUE, NOW(), NOW()
FROM usuario u
JOIN tema t ON
    (u.correo_electronico = 'monica.ruiz@pucp.edu.pe' AND t.codigo = 'TJ-01') OR
    (u.correo_electronico = 'monica.ruiz@pucp.edu.pe' AND t.codigo = 'TJ-03') OR
    (u.correo_electronico = 'pablo.flores@pucp.edu.pe' AND t.codigo = 'TJ-02') OR
    (u.correo_electronico = 'pablo.flores@pucp.edu.pe' AND t.codigo = 'TJ-03')
WHERE NOT EXISTS (
    SELECT 1 FROM usuario_tema ut
    WHERE ut.usuario_id = u.usuario_id AND ut.tema_id = t.tema_id AND ut.rol_id = 2
);

-- Insertamos un segundo entregable
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
)
SELECT
    1,
    'PLAN PRELIMINAR WAZA 1',
    'Primer entregable con uu básicos.',
    '2025-05-10 08:00:00+00',
    '2025-05-30 23:59:00+00',
    'no_iniciado',
    TRUE,
    3,
    'pdf,docx',
    10,
    TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM entregable
    WHERE nombre = 'Plan preliminar' AND etapa_formativa_x_ciclo_id = 1
);

-- Asignamos entregables a temas
INSERT INTO entregable_x_tema (
    entregable_id, tema_id, estado, activo, fecha_creacion, fecha_modificacion
)
SELECT
    e.entregable_id,
    t.tema_id,
    CASE
        WHEN e.nombre = 'Estado del arte' THEN 'enviado_a_tiempo'::enum_estado_entrega
        ELSE 'no_enviado'::enum_estado_entrega
    END,
    TRUE, NOW(), NOW()
FROM entregable e
JOIN tema t ON t.codigo = 'T-002'
WHERE e.nombre IN ('Estado del arte', 'Plan preliminar')
AND NOT EXISTS (
    SELECT 1 FROM entregable_x_tema ext
    WHERE ext.entregable_id = e.entregable_id AND ext.tema_id = t.tema_id
)
UNION ALL
SELECT
    e.entregable_id,
    t.tema_id,
    'enviado_a_tiempo'::enum_estado_entrega,
    TRUE, NOW(), NOW()
FROM entregable e
JOIN tema t ON t.codigo = 'T-003'
WHERE e.nombre IN ('Estado del arte', 'Plan preliminar')
AND NOT EXISTS (
    SELECT 1 FROM entregable_x_tema ext
    WHERE ext.entregable_id = e.entregable_id AND ext.tema_id = t.tema_id
);


-- DATOS ADICIONALES PARA EL RESTO DE FUNCIONES DE REPORTE
-- ================================================
-- Datos de prueba para get_topic_area_stats_by_user_and_ciclo
-- ================================================

-- Agregamos nuevas sub-áreas bajo "sistemas de información" (area_conocimiento_id = 2)
INSERT INTO sub_area_conocimiento (
    area_conocimiento_id,
    nombre,
    descripcion,
    activo,
    fecha_creacion,
    fecha_modificacion
)
SELECT
    2, 'Gestión de bases de datos', 'Modelado y optimización de bases de datos', TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM sub_area_conocimiento WHERE nombre = 'Gestión de bases de datos')
UNION ALL
SELECT
    2, 'Seguridad informática', 'Protección de sistemas y redes', TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM sub_area_conocimiento WHERE nombre = 'Seguridad informática');

-- Insertamos dos nuevos temas en la misma carrera (carrera_id = 2)
INSERT INTO tema (
    codigo, titulo, resumen, metodologia, objetivos,
    estado_tema_id, carrera_id, activo, fecha_creacion, fecha_modificacion
)
SELECT 'T-004', 'Bases de datos relacionales', 'Resumen BD', 'Método SQL', 'Optimizar queries',
     1, 2, TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tema WHERE codigo = 'T-004')
UNION ALL
SELECT 'T-005', 'Seguridad en redes', 'Resumen Sec', 'Método XYZ', 'Proteger infraestr.',
     1, 2, TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tema WHERE codigo = 'T-005');

-- Mapeamos cada tema a la sub-área correspondiente
INSERT INTO sub_area_conocimiento_tema (
    sub_area_conocimiento_id, tema_id, activo, fecha_creacion, fecha_modificacion
)
SELECT
    s.sub_area_conocimiento_id,
    t.tema_id,
    TRUE, NOW(), NOW()
FROM sub_area_conocimiento s
JOIN tema t ON
    (s.nombre = 'Gestión de bases de datos' AND t.codigo = 'T-004') OR
    (s.nombre = 'Seguridad informática' AND t.codigo = 'T-005')
WHERE NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id AND sact.sub_area_conocimiento_id = s.sub_area_conocimiento_id
);

-- Asociamos ambos temas a la exposición del ciclo 2025-1 (exposicion_id = 1)
INSERT INTO exposicion_x_tema (
    exposicion_id, tema_id, estado_exposicion, activo, fecha_creacion, fecha_modificacion
)
SELECT
    1,
    t.tema_id,
    'programada',
    TRUE,
    NOW(),
    NOW()
FROM tema t
WHERE t.codigo IN ('T-004', 'T-005')
AND NOT EXISTS (
    SELECT 1 FROM exposicion_x_tema ext
    WHERE ext.tema_id = t.tema_id AND ext.exposicion_id = 1
);

-- Insertamos un tercer tema NO expuesto para probar el conteo de "no expuestos"
INSERT INTO tema (
    codigo, titulo, resumen, metodologia, objetivos,
    estado_tema_id, carrera_id, activo, fecha_creacion, fecha_modificacion
)
SELECT 'T-006', 'Big Data Analytics', 'Resumen BD Analytics', 'Método MapReduce', 'Procesar grandes volúmenes',
     1, 2, TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tema WHERE codigo = 'T-006');

INSERT INTO sub_area_conocimiento_tema (
    sub_area_conocimiento_id, tema_id, activo, fecha_creacion, fecha_modificacion
)
SELECT
    s.sub_area_conocimiento_id,
    t.tema_id,
    TRUE, NOW(), NOW()
FROM sub_area_conocimiento s
JOIN tema t ON (s.nombre = 'Gestión de bases de datos' AND t.codigo = 'T-006')
WHERE NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id AND sact.sub_area_conocimiento_id = s.sub_area_conocimiento_id
);

-- ================================================
-- Datos de prueba para get_topic_area_trends_by_user
-- ================================================

-- Ciclos históricos
INSERT INTO ciclo (semestre, anio, fecha_inicio, fecha_fin, activo, fecha_creacion, fecha_modificacion)
SELECT '1', 2023, '2023-03-01'::DATE, '2023-07-31'::DATE, TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM ciclo WHERE semestre = '1' AND anio = 2023)
UNION ALL
SELECT '2', 2024, '2024-08-01'::DATE, '2024-12-31'::DATE, TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM ciclo WHERE semestre = '2' AND anio = 2024);

-- Asociamos la misma etapa_formativa_id=1 a los nuevos ciclos
INSERT INTO etapa_formativa_x_ciclo (etapa_formativa_id, ciclo_id, estado, activo, fecha_creacion, fecha_modificacion)
SELECT
    1,
    c.ciclo_id,
    'En Curso', -- Agregamos valor para el campo estado
    TRUE, NOW(), NOW()
FROM ciclo c
WHERE (c.semestre = '1' AND c.anio = 2023) OR (c.semestre = '2' AND c.anio = 2024)
AND NOT EXISTS (
    SELECT 1 FROM etapa_formativa_x_ciclo efc
    WHERE efc.ciclo_id = c.ciclo_id AND efc.etapa_formativa_id = 1
);

-- Exposiciones para cada ciclo
INSERT INTO exposicion (etapa_formativa_x_ciclo_id, estado_planificacion_id, activo, nombre, descripcion, fecha_creacion)
SELECT
    efc.etapa_formativa_x_ciclo_id,
    1, -- estado_planificacion_id = 1
    TRUE,
    CASE
        WHEN c.anio = 2023 THEN 'Expo 2023-1'
        ELSE 'Expo 2024-2'
    END,
    CASE
        WHEN c.anio = 2023 THEN 'Exposición ciclo 2023-1'
        ELSE 'Exposición ciclo 2024-2'
    END,
    NOW()
FROM etapa_formativa_x_ciclo efc
JOIN ciclo c ON efc.ciclo_id = c.ciclo_id
WHERE (c.semestre = '1' AND c.anio = 2023) OR (c.semestre = '2' AND c.anio = 2024)
AND NOT EXISTS (
    SELECT 1 FROM exposicion e
    WHERE e.etapa_formativa_x_ciclo_id = efc.etapa_formativa_x_ciclo_id
);

-- Temas de 2023 (no expuestos) — fecha de creación fuerza año 2023
INSERT INTO tema (
    codigo, titulo, resumen, metodologia, objetivos,
    estado_tema_id, carrera_id, activo, fecha_creacion, fecha_modificacion
)
SELECT 'T-007', 'Optimización ML', 'Resumen ML', 'Método ML', 'Mejorar modelo',
     1, 2, TRUE, '2023-05-10'::TIMESTAMP WITH TIME ZONE, '2023-05-10'::TIMESTAMP WITH TIME ZONE
WHERE NOT EXISTS (SELECT 1 FROM tema WHERE codigo = 'T-007')
UNION ALL
SELECT 'T-008', 'Visión Computacional', 'Resumen VC', 'Método CV', 'Detectar objetos',
     1, 2, TRUE, '2023-06-15'::TIMESTAMP WITH TIME ZONE, '2023-06-15'::TIMESTAMP WITH TIME ZONE
WHERE NOT EXISTS (SELECT 1 FROM tema WHERE codigo = 'T-008');

-- Mapeamos a sub-áreas
INSERT INTO sub_area_conocimiento_tema (
    sub_area_conocimiento_id, tema_id, activo, fecha_creacion, fecha_modificacion
)
SELECT
    2, -- Aprendizaje por reforzamiento
    t.tema_id,
    TRUE, NOW(), NOW()
FROM tema t
WHERE t.codigo = 'T-007'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id AND sact.sub_area_conocimiento_id = 2
)
UNION ALL
SELECT
    3, -- Procesamiento de imágenes
    t.tema_id,
    TRUE, NOW(), NOW()
FROM tema t
WHERE t.codigo = 'T-008'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id AND sact.sub_area_conocimiento_id = 3
);

-- Temas de 2024 (expuestos en ciclo 2024-2)
INSERT INTO tema (
    codigo, titulo, resumen, metodologia, objetivos,
    estado_tema_id, carrera_id, activo, fecha_creacion, fecha_modificacion
)
SELECT 'T-009', 'Modelado 3D', 'Resumen 3D', 'Método 3D', 'Crear mallas',
     1, 2, TRUE, '2024-09-05'::TIMESTAMP WITH TIME ZONE, '2024-09-05'::TIMESTAMP WITH TIME ZONE
WHERE NOT EXISTS (SELECT 1 FROM tema WHERE codigo = 'T-009')
UNION ALL
SELECT 'T-010', 'Ciberseguridad', 'Resumen CS', 'Método CS', 'Proteger datos',
     1, 2, TRUE, '2024-10-20'::TIMESTAMP WITH TIME ZONE, '2024-10-20'::TIMESTAMP WITH TIME ZONE
WHERE NOT EXISTS (SELECT 1 FROM tema WHERE codigo = 'T-010');

-- Mapeamos a sub-áreas
INSERT INTO sub_area_conocimiento_tema (
    sub_area_conocimiento_id, tema_id, activo, fecha_creacion, fecha_modificacion
)
SELECT
    s.sub_area_conocimiento_id,
    t.tema_id,
    TRUE, NOW(), NOW()
FROM sub_area_conocimiento s
JOIN tema t ON
    (s.nombre = 'Gestión de bases de datos' AND t.codigo = 'T-009') OR
    (s.nombre = 'Seguridad informática' AND t.codigo = 'T-010')
WHERE NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id AND sact.sub_area_conocimiento_id = s.sub_area_conocimiento_id
);

-- Asociamos estos temas a la exposición del ciclo 2024-2
INSERT INTO exposicion_x_tema (
    exposicion_id, tema_id, estado_exposicion, activo, fecha_creacion, fecha_modificacion
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
JOIN tema t ON t.codigo IN ('T-009', 'T-010')
WHERE c.semestre = '2' AND c.anio = 2024
AND NOT EXISTS (
    SELECT 1 FROM exposicion_x_tema ext
    WHERE ext.tema_id = t.tema_id AND ext.exposicion_id = e.exposicion_id
);