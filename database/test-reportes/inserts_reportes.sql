-- SCRIPTS PARA QUE FUNCIONES get_advisor_distribution_by_coordinator_and_ciclo

-- Asegurar que existe el coordinador con usuario_id = 3
INSERT INTO usuario (
    usuario_id, tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido,
    correo_electronico, nivel_estudios, contrasena, biografia,
    activo, fecha_creacion, fecha_modificacion
)
SELECT 3, 3, 'COORD01', 'Luis', 'Ramírez', 'Coordinador', 'luis.ramirez@pucp.edu.pe', 'Doctorado', 'pwd123', 'Coordinador de carrera', TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE usuario_id = 3);

-- Asignar carrera al coordinador
INSERT INTO usuario_carrera (
    usuario_id, carrera_id, activo, fecha_creacion, fecha_modificacion
)
SELECT 3, 1, TRUE, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM usuario_carrera uc
    WHERE uc.usuario_id = 3 AND uc.carrera_id = 1
);

-- Asegurar secuencia de usuario
SELECT setval(
    pg_get_serial_sequence('usuario','usuario_id'),
    (SELECT COALESCE(MAX(usuario_id), 1) FROM usuario)
);

-- Insertar asesores
INSERT INTO usuario (
    tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido,
    correo_electronico, nivel_estudios, contrasena, biografia,
    activo, fecha_creacion, fecha_modificacion
)
SELECT 1, 'P004', 'Ana', 'García', 'Profesor', 'ana.garcia@pucp.edu.pe', 'Doctorado', 'pwd7', 'Asesora IA', TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE correo_electronico = 'ana.garcia@pucp.edu.pe')
UNION ALL
SELECT 1, 'P005', 'Carlos', 'Mendoza', 'López', 'carlos.mendoza@pucp.edu.pe', 'Doctorado', 'pwd8', 'Asesor Sistemas', TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE correo_electronico = 'carlos.mendoza@pucp.edu.pe');

-- Asignar carrera a los asesores
INSERT INTO usuario_carrera (
    usuario_id, carrera_id, activo, fecha_creacion, fecha_modificacion
)
SELECT u.usuario_id, 1, TRUE, NOW(), NOW()
FROM usuario u
WHERE u.correo_electronico IN ('ana.garcia@pucp.edu.pe', 'carlos.mendoza@pucp.edu.pe')
AND NOT EXISTS (
    SELECT 1 FROM usuario_carrera uc
    WHERE uc.usuario_id = u.usuario_id AND uc.carrera_id = 1
);

-- *CRÍTICO: Asignar áreas de conocimiento a los asesores*
INSERT INTO usuario_area_conocimiento (
    usuario_id, area_conocimiento_id, activo, fecha_creacion, fecha_modificacion
)
SELECT u.usuario_id, 1, TRUE, NOW(), NOW() -- Área: Ciencias de la Computación
FROM usuario u
WHERE u.correo_electronico = 'ana.garcia@pucp.edu.pe'
AND NOT EXISTS (
    SELECT 1 FROM usuario_area_conocimiento uac
    WHERE uac.usuario_id = u.usuario_id AND uac.area_conocimiento_id = 1
)
UNION ALL
SELECT u.usuario_id, 2, TRUE, NOW(), NOW() -- Área: Sistemas de Información
FROM usuario u
WHERE u.correo_electronico = 'carlos.mendoza@pucp.edu.pe'
AND NOT EXISTS (
    SELECT 1 FROM usuario_area_conocimiento uac
    WHERE uac.usuario_id = u.usuario_id AND uac.area_conocimiento_id = 2
);

-- Asegurar secuencia de temas
SELECT setval(
    pg_get_serial_sequence('tema','tema_id'),
    (SELECT COALESCE(MAX(tema_id), 1) FROM tema)
);

-- Insertar temas
INSERT INTO tema (
    codigo, titulo, resumen, metodologia, objetivos,
    estado_tema_id, carrera_id, activo, fecha_creacion, fecha_modificacion
)
SELECT 'ADV-001', 'Machine Learning para Diagnóstico', 'Aplicación de ML en medicina', 'Método supervisado', 'Mejorar diagnóstico médico',
     5, 1, TRUE, NOW(), NOW() -- estado_tema_id = 5 (INSCRITO)
WHERE NOT EXISTS (SELECT 1 FROM tema WHERE codigo = 'ADV-001')
UNION ALL
SELECT 'ADV-002', 'Sistema de Gestión Hospitalaria', 'ERP para hospitales', 'Desarrollo ágil', 'Optimizar gestión hospitalaria',
     5, 1, TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tema WHERE codigo = 'ADV-002');

-- Vincular temas con sub-áreas
INSERT INTO sub_area_conocimiento_tema (
    sub_area_conocimiento_id, tema_id, activo, fecha_creacion, fecha_modificacion
)
SELECT 5, t.tema_id, TRUE, NOW(), NOW() -- Sub-área: Machine Learning
FROM tema t
WHERE t.codigo = 'ADV-001'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id AND sact.sub_area_conocimiento_id = 5
)
UNION ALL
SELECT 6, t.tema_id, TRUE, NOW(), NOW() -- Sub-área: Sistemas de gestión de bases de datos
FROM tema t
WHERE t.codigo = 'ADV-002'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id AND sact.sub_area_conocimiento_id = 6
);

-- *CRÍTICO: Vincular temas al ciclo 2025-1*
INSERT INTO etapa_formativa_x_ciclo_x_tema (
    etapa_formativa_x_ciclo_id, tema_id, aprobado, activo, fecha_creacion, fecha_modificacion
)
SELECT 1, t.tema_id, TRUE, TRUE, NOW(), NOW()
FROM tema t
WHERE t.codigo IN ('ADV-001', 'ADV-002')
AND NOT EXISTS (
    SELECT 1 FROM etapa_formativa_x_ciclo_x_tema efcxt
    WHERE efcxt.tema_id = t.tema_id AND efcxt.etapa_formativa_x_ciclo_id = 1
);

-- Asegurar secuencia de usuario_tema
SELECT setval(
    pg_get_serial_sequence('usuario_tema','usuario_tema_id'),
    (SELECT COALESCE(MAX(usuario_tema_id), 1) FROM usuario_tema)
);

-- Asignar asesores a temas (rol_id = 1 es "Asesor")
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
    (u.correo_electronico = 'ana.garcia@pucp.edu.pe' AND t.codigo = 'ADV-001') OR
    (u.correo_electronico = 'carlos.mendoza@pucp.edu.pe' AND t.codigo = 'ADV-002')
WHERE NOT EXISTS (
    SELECT 1 FROM usuario_tema ut
    WHERE ut.usuario_id = u.usuario_id AND ut.tema_id = t.tema_id
);


-- Insertar tesistas
INSERT INTO usuario (
    tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido,
    correo_electronico, nivel_estudios, contrasena, biografia,
    activo, fecha_creacion, fecha_modificacion
)
SELECT 2, 'A001', 'María', 'Fernández', 'Estudiante', 'maria.fernandez@pucp.edu.pe', 'Pregrado', 'pwd9', 'Tesista ML', TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE correo_electronico = 'maria.fernandez@pucp.edu.pe')
UNION ALL
SELECT 2, 'A002', 'José', 'Rodríguez', 'Tesista', 'jose.rodriguez@pucp.edu.pe', 'Pregrado', 'pwd10', 'Tesista Sistemas', TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE correo_electronico = 'jose.rodriguez@pucp.edu.pe');

-- Asignar carrera a tesistas
INSERT INTO usuario_carrera (
    usuario_id, carrera_id, activo, fecha_creacion, fecha_modificacion
)
SELECT u.usuario_id, 1, TRUE, NOW(), NOW()
FROM usuario u
WHERE u.correo_electronico IN ('maria.fernandez@pucp.edu.pe', 'jose.rodriguez@pucp.edu.pe')
AND NOT EXISTS (
    SELECT 1 FROM usuario_carrera uc
    WHERE uc.usuario_id = u.usuario_id AND uc.carrera_id = 1
);

-- Asignar tesistas a temas (rol_id = 4 es "Tesista")
INSERT INTO usuario_tema (
    usuario_id, tema_id, rol_id, asignado, activo, fecha_creacion, fecha_modificacion
)
SELECT
    u.usuario_id,
    t.tema_id,
    4, -- rol_id = 4 (Tesista)
    TRUE, TRUE, NOW(), NOW()
FROM usuario u
JOIN tema t ON
    (u.correo_electronico = 'maria.fernandez@pucp.edu.pe' AND t.codigo = 'ADV-001') OR
    (u.correo_electronico = 'jose.rodriguez@pucp.edu.pe' AND t.codigo = 'ADV-002')
WHERE NOT EXISTS (
    SELECT 1 FROM usuario_tema ut
    WHERE ut.usuario_id = u.usuario_id AND ut.tema_id = t.tema_id AND ut.rol_id = 4
);

-- SCRIPTS ADICIONALES PARA QUE FUNCIONE get_juror_distribution_by_coordinator_and_ciclo

-- 1. Crear usuarios jurados
INSERT INTO usuario (
    tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido,
    correo_electronico, nivel_estudios, contrasena, biografia,
    activo, fecha_creacion, fecha_modificacion
)
SELECT 1, 'P010', 'Elena', 'Vásquez', 'Jurado', 'elena.vasquez@pucp.edu.pe', 'Doctorado', 'pwd11', 'Jurado IA', TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE correo_electronico = 'elena.vasquez@pucp.edu.pe')
UNION ALL
SELECT 1, 'P011', 'Roberto', 'Silva', 'Evaluador', 'roberto.silva@pucp.edu.pe', 'Doctorado', 'pwd12', 'Jurado Sistemas', TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE correo_electronico = 'roberto.silva@pucp.edu.pe')
UNION ALL
SELECT 1, 'P012', 'Patricia', 'Morales', 'Experta', 'patricia.morales@pucp.edu.pe', 'Doctorado', 'pwd13', 'Jurado Ciberseguridad', TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE correo_electronico = 'patricia.morales@pucp.edu.pe');

-- 2. Asignar carrera a los jurados
INSERT INTO usuario_carrera (
    usuario_id, carrera_id, activo, fecha_creacion, fecha_modificacion
)
SELECT u.usuario_id, 1, TRUE, NOW(), NOW()
FROM usuario u
WHERE u.correo_electronico IN ('elena.vasquez@pucp.edu.pe', 'roberto.silva@pucp.edu.pe', 'patricia.morales@pucp.edu.pe')
AND NOT EXISTS (
    SELECT 1 FROM usuario_carrera uc
    WHERE uc.usuario_id = u.usuario_id AND uc.carrera_id = 1
);

-- 3. *CRÍTICO: Asignar áreas de conocimiento a los jurados*
INSERT INTO usuario_area_conocimiento (
    usuario_id, area_conocimiento_id, activo, fecha_creacion, fecha_modificacion
)
SELECT u.usuario_id, 1, TRUE, NOW(), NOW() -- Área: Ciencias de la Computación
FROM usuario u
WHERE u.correo_electronico = 'elena.vasquez@pucp.edu.pe'
AND NOT EXISTS (
    SELECT 1 FROM usuario_area_conocimiento uac
    WHERE uac.usuario_id = u.usuario_id AND uac.area_conocimiento_id = 1
)
UNION ALL
SELECT u.usuario_id, 2, TRUE, NOW(), NOW() -- Área: Sistemas de Información
FROM usuario u
WHERE u.correo_electronico = 'roberto.silva@pucp.edu.pe'
AND NOT EXISTS (
    SELECT 1 FROM usuario_area_conocimiento uac
    WHERE uac.usuario_id = u.usuario_id AND uac.area_conocimiento_id = 2
)
UNION ALL
SELECT u.usuario_id, 3, TRUE, NOW(), NOW() -- Área: Ciberseguridad
FROM usuario u
WHERE u.correo_electronico = 'patricia.morales@pucp.edu.pe'
AND NOT EXISTS (
    SELECT 1 FROM usuario_area_conocimiento uac
    WHERE uac.usuario_id = u.usuario_id AND uac.area_conocimiento_id = 3
);

-- 4. Crear tema adicional para el área de Ciberseguridad
INSERT INTO tema (
    codigo, titulo, resumen, metodologia, objetivos,
    estado_tema_id, carrera_id, activo, fecha_creacion, fecha_modificacion
)
SELECT 'ADV-003', 'Sistema de Detección de Intrusos', 'IDS con Machine Learning', 'Análisis de tráfico', 'Detectar ataques en tiempo real',
     5, 1, TRUE, NOW(), NOW() -- estado_tema_id = 5 (INSCRITO)
WHERE NOT EXISTS (SELECT 1 FROM tema WHERE codigo = 'ADV-003');

-- 5. Vincular tema nuevo con sub-área de Ciberseguridad
INSERT INTO sub_area_conocimiento_tema (
    sub_area_conocimiento_id, tema_id, activo, fecha_creacion, fecha_modificacion
)
SELECT 11, t.tema_id, TRUE, NOW(), NOW() -- Sub-área: Seguridad en redes (id=11)
FROM tema t
WHERE t.codigo = 'ADV-003'
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id AND sact.sub_area_conocimiento_id = 11
);

-- 6. Vincular tema nuevo al ciclo 2025-1
INSERT INTO etapa_formativa_x_ciclo_x_tema (
    etapa_formativa_x_ciclo_id, tema_id, aprobado, activo, fecha_creacion, fecha_modificacion
)
SELECT 1, t.tema_id, TRUE, TRUE, NOW(), NOW()
FROM tema t
WHERE t.codigo = 'ADV-003'
AND NOT EXISTS (
    SELECT 1 FROM etapa_formativa_x_ciclo_x_tema efcxt
    WHERE efcxt.tema_id = t.tema_id AND efcxt.etapa_formativa_x_ciclo_id = 1
);

-- 7. *CRÍTICO: Asignar jurados a los temas (rol_id = 2 es "Jurado")*
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
    (u.correo_electronico = 'elena.vasquez@pucp.edu.pe' AND t.codigo = 'ADV-001') OR
    (u.correo_electronico = 'elena.vasquez@pucp.edu.pe' AND t.codigo = 'ADV-002') OR
    (u.correo_electronico = 'roberto.silva@pucp.edu.pe' AND t.codigo = 'ADV-002') OR
    (u.correo_electronico = 'patricia.morales@pucp.edu.pe' AND t.codigo = 'ADV-003')
WHERE NOT EXISTS (
    SELECT 1 FROM usuario_tema ut
    WHERE ut.usuario_id = u.usuario_id AND ut.tema_id = t.tema_id AND ut.rol_id = 2
);

-- 8. Crear tesista para el tema ADV-003
INSERT INTO usuario (
    tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido,
    correo_electronico, nivel_estudios, contrasena, biografia,
    activo, fecha_creacion, fecha_modificacion
)
SELECT 2, 'A003', 'Andrea', 'González', 'Tesista', 'andrea.gonzalez@pucp.edu.pe', 'Pregrado', 'pwd14', 'Tesista Seguridad', TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE correo_electronico = 'andrea.gonzalez@pucp.edu.pe');

-- 9. Asignar carrera al tesista
INSERT INTO usuario_carrera (
    usuario_id, carrera_id, activo, fecha_creacion, fecha_modificacion
)
SELECT u.usuario_id, 1, TRUE, NOW(), NOW()
FROM usuario u
WHERE u.correo_electronico = 'andrea.gonzalez@pucp.edu.pe'
AND NOT EXISTS (
    SELECT 1 FROM usuario_carrera uc
    WHERE uc.usuario_id = u.usuario_id AND uc.carrera_id = 1
);

-- 10. Asignar tesista al tema ADV-003 (rol_id = 4 es "Tesista")
INSERT INTO usuario_tema (
    usuario_id, tema_id, rol_id, asignado, activo, fecha_creacion, fecha_modificacion
)
SELECT
    u.usuario_id,
    t.tema_id,
    4, -- rol_id = 4 (Tesista)
    TRUE, TRUE, NOW(), NOW()
FROM usuario u
JOIN tema t ON u.correo_electronico = 'andrea.gonzalez@pucp.edu.pe' AND t.codigo = 'ADV-003'
WHERE NOT EXISTS (
    SELECT 1 FROM usuario_tema ut
    WHERE ut.usuario_id = u.usuario_id AND ut.tema_id = t.tema_id AND ut.rol_id = 4
);

-- 11. Asignar asesor al tema ADV-003 para completar el ecosistema
INSERT INTO usuario_tema (
    usuario_id, tema_id, rol_id, asignado, activo, fecha_creacion, fecha_modificacion
)
SELECT
    u.usuario_id,
    t.tema_id,
    1, -- rol_id = 1 (Asesor)
    TRUE, TRUE, NOW(), NOW()
FROM usuario u
JOIN tema t ON u.correo_electronico = 'ana.garcia@pucp.edu.pe' AND t.codigo = 'ADV-003'
WHERE NOT EXISTS (
    SELECT 1 FROM usuario_tema ut
    WHERE ut.usuario_id = u.usuario_id AND ut.tema_id = t.tema_id AND ut.rol_id = 1
);

-- 12. Asignar área de Ciberseguridad al asesor Ana García para que pueda asesorar ADV-003
INSERT INTO usuario_area_conocimiento (
    usuario_id, area_conocimiento_id, activo, fecha_creacion, fecha_modificacion
)
SELECT u.usuario_id, 3, TRUE, NOW(), NOW() -- Área: Ciberseguridad
FROM usuario u
WHERE u.correo_electronico = 'ana.garcia@pucp.edu.pe'
AND NOT EXISTS (
    SELECT 1 FROM usuario_area_conocimiento uac
    WHERE uac.usuario_id = u.usuario_id AND uac.area_conocimiento_id = 3
);

-- SCRIPTS PARA QUE FUNCIONE listar_tesistas_por_asesor(5)

-- 1. Crear asesor con usuario_id = 5
INSERT INTO usuario (
    usuario_id, tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido,
    correo_electronico, nivel_estudios, contrasena, biografia,
    activo, fecha_creacion, fecha_modificacion
)
SELECT 5, 1, 'P015', 'Fernando', 'López', 'Asesor', 'fernando.lopez@pucp.edu.pe', 'Doctorado', 'pwd15', 'Asesor principal', TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE usuario_id = 5);

-- 2. Asegurar secuencia de usuario
SELECT setval(
    pg_get_serial_sequence('usuario','usuario_id'),
    (SELECT COALESCE(MAX(usuario_id), 5) FROM usuario)
);

-- 3. Asignar carrera al asesor
INSERT INTO usuario_carrera (
    usuario_id, carrera_id, activo, fecha_creacion, fecha_modificacion
)
SELECT 5, 1, TRUE, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM usuario_carrera uc
    WHERE uc.usuario_id = 5 AND uc.carrera_id = 1
);

-- 4. Asignar área de conocimiento al asesor
INSERT INTO usuario_area_conocimiento (
    usuario_id, area_conocimiento_id, activo, fecha_creacion, fecha_modificacion
)
SELECT 5, 1, TRUE, NOW(), NOW() -- Área: Ciencias de la Computación
WHERE NOT EXISTS (
    SELECT 1 FROM usuario_area_conocimiento uac
    WHERE uac.usuario_id = 5 AND uac.area_conocimiento_id = 1
);

-- 5. Crear temas para el asesor Fernando López
INSERT INTO tema (
    codigo, titulo, resumen, metodologia, objetivos,
    estado_tema_id, carrera_id, activo, fecha_creacion, fecha_modificacion
)
SELECT 'FER-001', 'Análisis de Sentimientos con NLP', 'Procesamiento de texto para análisis emocional', 'Deep Learning', 'Automatizar análisis de sentimientos',
     5, 1, TRUE, NOW(), NOW() -- estado_tema_id = 5 (INSCRITO)
WHERE NOT EXISTS (SELECT 1 FROM tema WHERE codigo = 'FER-001')
UNION ALL
SELECT 'FER-002', 'Chatbot Inteligente Universitario', 'Bot conversacional para estudiantes', 'Transformers', 'Mejorar atención estudiantil',
     5, 1, TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tema WHERE codigo = 'FER-002');

-- 6. Vincular temas con sub-área de conocimiento
INSERT INTO sub_area_conocimiento_tema (
    sub_area_conocimiento_id, tema_id, activo, fecha_creacion, fecha_modificacion
)
SELECT 1, t.tema_id, TRUE, NOW(), NOW() -- Sub-área: Procesamiento de lenguaje natural
FROM tema t
WHERE t.codigo IN ('FER-001', 'FER-002')
AND NOT EXISTS (
    SELECT 1 FROM sub_area_conocimiento_tema sact
    WHERE sact.tema_id = t.tema_id AND sact.sub_area_conocimiento_id = 1
);

-- 7. Vincular temas al ciclo 2025-1
INSERT INTO etapa_formativa_x_ciclo_x_tema (
    etapa_formativa_x_ciclo_id, tema_id, aprobado, activo, fecha_creacion, fecha_modificacion
)
SELECT 1, t.tema_id, TRUE, TRUE, NOW(), NOW()
FROM tema t
WHERE t.codigo IN ('FER-001', 'FER-002')
AND NOT EXISTS (
    SELECT 1 FROM etapa_formativa_x_ciclo_x_tema efcxt
    WHERE efcxt.tema_id = t.tema_id AND efcxt.etapa_formativa_x_ciclo_id = 1
);

-- 8. Asignar Fernando López como asesor de los temas (rol_id = 1 es "Asesor")
INSERT INTO usuario_tema (
    usuario_id, tema_id, rol_id, asignado, activo, fecha_creacion, fecha_modificacion
)
SELECT
    5, -- usuario_id = 5 (Fernando López)
    t.tema_id,
    1, -- rol_id = 1 (Asesor)
    TRUE, TRUE, NOW(), NOW()
FROM tema t
WHERE t.codigo IN ('FER-001', 'FER-002')
AND NOT EXISTS (
    SELECT 1 FROM usuario_tema ut
    WHERE ut.usuario_id = 5 AND ut.tema_id = t.tema_id AND ut.rol_id = 1
);

-- 9. Crear tesistas para Fernando López
INSERT INTO usuario (
    tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido,
    correo_electronico, nivel_estudios, contrasena, biografia,
    activo, fecha_creacion, fecha_modificacion
)
SELECT 2, 'A010', 'Santiago', 'Vargas', 'Tesista', 'santiago.vargas@pucp.edu.pe', 'Pregrado', 'pwd20', 'Tesista NLP', TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE correo_electronico = 'santiago.vargas@pucp.edu.pe')
UNION ALL
SELECT 2, 'A011', 'Camila', 'Herrera', 'Tesista', 'camila.herrera@pucp.edu.pe', 'Pregrado', 'pwd21', 'Tesista Chatbot', TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE correo_electronico = 'camila.herrera@pucp.edu.pe');

-- 10. Asignar carrera a los tesistas
INSERT INTO usuario_carrera (
    usuario_id, carrera_id, activo, fecha_creacion, fecha_modificacion
)
SELECT u.usuario_id, 1, TRUE, NOW(), NOW()
FROM usuario u
WHERE u.correo_electronico IN ('santiago.vargas@pucp.edu.pe', 'camila.herrera@pucp.edu.pe')
AND NOT EXISTS (
    SELECT 1 FROM usuario_carrera uc
    WHERE uc.usuario_id = u.usuario_id AND uc.carrera_id = 1
);

-- 11. Asignar tesistas a temas (rol_id = 4 es "Tesista")
INSERT INTO usuario_tema (
    usuario_id, tema_id, rol_id, asignado, activo, fecha_creacion, fecha_modificacion
)
SELECT
    u.usuario_id,
    t.tema_id,
    4, -- rol_id = 4 (Tesista)
    TRUE, TRUE, NOW(), NOW()
FROM usuario u
JOIN tema t ON
    (u.correo_electronico = 'santiago.vargas@pucp.edu.pe' AND t.codigo = 'FER-001') OR
    (u.correo_electronico = 'camila.herrera@pucp.edu.pe' AND t.codigo = 'FER-002')
WHERE NOT EXISTS (
    SELECT 1 FROM usuario_tema ut
    WHERE ut.usuario_id = u.usuario_id AND ut.tema_id = t.tema_id AND ut.rol_id = 4
);

-- 12. *CRÍTICO: Crear entregables para que la función tenga datos*
INSERT INTO entregable (
    etapa_formativa_x_ciclo_id, nombre, descripcion,
    fecha_inicio, fecha_fin, estado, es_evaluable,
    activo, fecha_creacion, fecha_modificacion
)
SELECT
    1, -- etapa_formativa_x_ciclo_id = 1 (ciclo 2025-1)
    'Propuesta de Tesis',
    'Documento inicial con planteamiento del problema',
    TIMESTAMP WITH TIME ZONE '2025-05-01 00:00:00',
    TIMESTAMP WITH TIME ZONE '2025-06-15 23:59:59',
    'no_iniciado'::enum_estado_actividad,
    TRUE, -- es_evaluable
    TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM entregable WHERE nombre = 'Propuesta de Tesis')

UNION ALL

SELECT
    1, -- etapa_formativa_x_ciclo_id = 1 (ciclo 2025-1)
    'Marco Teórico',
    'Revisión bibliográfica y fundamentos teóricos',
    TIMESTAMP WITH TIME ZONE '2025-06-16 00:00:00',
    TIMESTAMP WITH TIME ZONE '2025-07-31 23:59:59',
    'no_iniciado'::enum_estado_actividad,
    TRUE, -- es_evaluable
    TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM entregable WHERE nombre = 'Marco Teórico')

UNION ALL

SELECT
    1, -- etapa_formativa_x_ciclo_id = 1 (ciclo 2025-1)
    'Implementación',
    'Desarrollo del prototipo o sistema',
    TIMESTAMP WITH TIME ZONE '2025-08-01 00:00:00',
    TIMESTAMP WITH TIME ZONE '2025-09-30 23:59:59',
    'no_iniciado'::enum_estado_actividad,
    TRUE, -- es_evaluable
    TRUE, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM entregable WHERE nombre = 'Implementación');

-- 13. Asegurar secuencias
SELECT setval(
    pg_get_serial_sequence('entregable','entregable_id'),
    (SELECT COALESCE(MAX(entregable_id), 1) FROM entregable)
);

-- 14. Vincular entregables con los temas de Fernando López
INSERT INTO entregable_x_tema (
    entregable_id, tema_id, estado, activo, fecha_creacion, fecha_modificacion
)
SELECT
    e.entregable_id,
    t.tema_id,
    'no_enviado'::enum_estado_entrega, -- Usar el enum correcto con valor por defecto
    TRUE, NOW(), NOW()
FROM entregable e
CROSS JOIN tema t
WHERE e.nombre IN ('Propuesta de Tesis', 'Marco Teórico', 'Implementación')
AND t.codigo IN ('FER-001', 'FER-002')
AND NOT EXISTS (
    SELECT 1 FROM entregable_x_tema ext
    WHERE ext.entregable_id = e.entregable_id AND ext.tema_id = t.tema_id
);

-- Primero, vamos a crear algunas reuniones para diferentes fechas y horarios
INSERT INTO reunion (reunion_id, fecha_hora_inicio, fecha_hora_fin, descripcion) VALUES
(1001, '2025-05-31 14:00:00', '2025-05-31 15:00:00', 'Revisión de avance del marco teórico'),
(1002, '2025-06-02 10:00:00', '2025-06-02 11:30:00', 'Feedback sobre metodología'),
(1003, '2025-06-05 15:00:00', '2025-06-05 16:00:00', 'Revisión de objetivos específicos'),
(1004, '2025-06-10 11:00:00', '2025-06-10 12:00:00', 'Correcciones del capítulo 1');

-- Ahora, vamos a crear las relaciones entre usuarios y reuniones
-- Para cada reunión, incluimos tanto al tesista (id=7) como al asesor (id=1)
INSERT INTO usuario_reunion (reunion_id, usuario_id) VALUES
-- Primera reunión
(1001, 41),  -- Tesista
(1001, 5),  -- Asesor
-- Segunda reunión
(1002, 41),  -- Tesista
(1002, 5),  -- Asesor
-- Tercera reunión
(1003, 41),  -- Tesista
(1003, 5),  -- Asesor
-- Cuarta reunión
(1004, 41),  -- Tesista
(1004, 5);  -- Asesor