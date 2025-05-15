-- Asegurarse que existan los roles necesarios
INSERT INTO rol (nombre, descripcion, activo)
SELECT 'estudiante', 'Rol para estudiantes', true
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE nombre = 'estudiante');

INSERT INTO rol (nombre, descripcion, activo)
SELECT 'asesor', 'Rol para asesores o profesores', true
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE nombre = 'asesor');

-- Añadir relaciones usuario_tema
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, activo)
SELECT u.usuario_id, t.tema_id, 
       (SELECT rol_id FROM rol WHERE nombre = 'estudiante'), 
       true
FROM usuario u, tema t
WHERE u.codigo_pucp = '20180123'
AND t.codigo = 'TEMA-001'
AND EXISTS (SELECT 1 FROM rol WHERE nombre = 'estudiante');

-- Añadir más relaciones usuario_tema para otros estudiantes
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, activo)
SELECT u.usuario_id, t.tema_id, 
       (SELECT rol_id FROM rol WHERE nombre = 'estudiante'), 
       true
FROM usuario u, tema t
WHERE u.codigo_pucp = '20190456'
AND t.codigo = 'TEMA-002'
AND EXISTS (SELECT 1 FROM rol WHERE nombre = 'estudiante');

INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, activo)
SELECT u.usuario_id, t.tema_id, 
       (SELECT rol_id FROM rol WHERE nombre = 'estudiante'), 
       true
FROM usuario u, tema t
WHERE u.codigo_pucp = '20180789'
AND t.codigo = 'TEMA-003'
AND EXISTS (SELECT 1 FROM rol WHERE nombre = 'estudiante');

-- Primero, asegúrate de que existe al menos una carrera
INSERT INTO carrera (unidad_academica_id, codigo, nombre, activo)
SELECT 
    (SELECT unidad_academica_id FROM unidad_academica LIMIT 1),
    'INF001', 'Ingeniería Informática', true
WHERE NOT EXISTS (SELECT 1 FROM carrera WHERE codigo = 'INF001');

-- Añadir etapa_formativa con carrera_id
INSERT INTO etapa_formativa (nombre, carrera_id, activo)
VALUES ('Curso Ejemplo', 
        (SELECT carrera_id FROM carrera LIMIT 1), 
        true);

-- Asegurar que existe un ciclo
INSERT INTO ciclo (semestre, anio, fecha_inicio, fecha_fin, activo)
SELECT '2025-1', 2025, CURRENT_DATE, CURRENT_DATE + INTERVAL '4 months', true
WHERE NOT EXISTS (SELECT 1 FROM ciclo WHERE semestre = '2025-1' AND anio = 2025);

-- Resto del script
INSERT INTO etapa_formativa_x_ciclo (etapa_formativa_id, ciclo_id, activo)
SELECT ef.etapa_formativa_id, 
       (SELECT ciclo_id FROM ciclo LIMIT 1), 
       true
FROM etapa_formativa ef
WHERE ef.nombre = 'Curso Ejemplo';

-- Añadir entregable
INSERT INTO entregable (etapa_formativa_x_ciclo_id, nombre, descripcion, fecha_inicio, fecha_fin,
                      maximo_documentos, extensiones_permitidas, peso_maximo_documento, activo)
SELECT efxc.etapa_formativa_x_ciclo_id, 'Entregable 1', 'Descripción', 
       CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days',
       1, 'pdf,doc,docx', 10, true
FROM etapa_formativa_x_ciclo efxc
LIMIT 1;

-- Asegurarse de tener todos los entregables asociados con los temas
INSERT INTO entregable_x_tema (entregable_id, tema_id, fecha_envio, estado, activo)
SELECT e.entregable_id, t.tema_id, CURRENT_DATE, 'enviado_a_tiempo', true
FROM entregable e, tema t
WHERE t.codigo = 'TEMA-001'
LIMIT 1;

INSERT INTO entregable_x_tema (entregable_id, tema_id, fecha_envio, estado, activo)
SELECT e.entregable_id, t.tema_id, CURRENT_DATE, 'enviado_a_tiempo', true
FROM entregable e, tema t
WHERE t.codigo = 'TEMA-002'
LIMIT 1;

INSERT INTO entregable_x_tema (entregable_id, tema_id, fecha_envio, estado, activo)
SELECT e.entregable_id, t.tema_id, CURRENT_DATE, 'enviado_a_tiempo', true
FROM entregable e, tema t
WHERE t.codigo = 'TEMA-003'
LIMIT 1;

-- Añadir relaciones usuario_documento para que cada documento esté asociado con un estudiante
INSERT INTO usuario_documento (usuario_id, documento_id, permiso, activo)
SELECT 
    (SELECT usuario_id FROM usuario WHERE codigo_pucp = '20180123'), 
    1,
    'propietario', 
    true
WHERE EXISTS (SELECT 1 FROM usuario WHERE codigo_pucp = '20180123');

INSERT INTO usuario_documento (usuario_id, documento_id, permiso, activo)
SELECT 
    (SELECT usuario_id FROM usuario WHERE codigo_pucp = '20190456'), 
    2,
    'propietario', 
    true
WHERE EXISTS (SELECT 1 FROM usuario WHERE codigo_pucp = '20190456');

INSERT INTO usuario_documento (usuario_id, documento_id, permiso, activo)
SELECT 
    (SELECT usuario_id FROM usuario WHERE codigo_pucp = '20180789'), 
    3,
    'propietario', 
    true
WHERE EXISTS (SELECT 1 FROM usuario WHERE codigo_pucp = '20180789');