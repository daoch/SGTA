-- =============================================
-- INSERT: Nuevos alumnos y profesores (usuarios)
-- =============================================
SET search_path TO sgtadb;

INSERT INTO usuario (tipo_usuario_id,
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
                     fecha_modificacion)
VALUES
    (2, 'A002', 'Diego', 'Sánchez', 'Ríos', 'diego.sanchez@pucp.edu.pe', 'Pregrado', 'secret9', 'Alumno de ingeniería informática', NULL, 'Lun-Vie 8-12', 'Presencial', TRUE, NOW(), NOW()),
    (2, 'A003', 'Lucía', 'Torres', 'Mejía', 'lucia.torres@pucp.edu.pe', 'Pregrado', 'secret10', 'Estudiante de software', NULL, 'Lun-Mie 13-17', 'Virtual', TRUE, NOW(), NOW()),
    (2, 'A004', 'Pedro', 'Valdez', 'Cruz', 'pedro.valdez@pucp.edu.pe', 'Pregrado', 'secret11', 'Alumno de ciencia de datos', NULL, 'Mar-Jue 9-11', 'Presencial', TRUE, NOW(), NOW()),
    (2, 'A005', 'Sandra', 'Chávez', 'Reyes', 'sandra.chavez@pucp.edu.pe', 'Pregrado', 'secret12', 'Estudiante de telemática', NULL, 'Lun-Vie 10-14', 'Híbrido', TRUE, NOW(), NOW()),
    (2, 'A006', 'Manuel', 'López', 'Delgado', 'manuel.lopez@pucp.edu.pe', 'Pregrado', 'secret13', 'Alumno de redes', NULL, 'Lun-Jue 14-18', 'Virtual', TRUE, NOW(), NOW()),
    (2, 'A007', 'Elena', 'Gutiérrez', 'Salazar', 'elena.gutierrez@pucp.edu.pe', 'Pregrado', 'secret14', 'Estudiante de IA', NULL, 'Vie 8-12', 'Presencial', TRUE, NOW(), NOW()),

    -- Profesores
    (1, 'P004', 'Miguel', 'Ramírez', 'Flores', 'miguel.ramirez@pucp.edu.pe', 'Postgrado', 'secret15', 'Profesor de matemática', NULL, NULL, NULL, TRUE, NOW(), NOW()),
    (1, 'P005', 'Clara', 'Morales', 'López', 'clara.morales@pucp.edu.pe', 'Postgrado', 'secret16', 'Profesora de física', NULL, NULL, NULL, TRUE, NOW(), NOW()),
    (1, 'P006', 'Felipe', 'Suárez', 'Cano', 'felipe.suarez@pucp.edu.pe', 'Doctorado', 'secret17', 'Profesor de computación', NULL, NULL, NULL, TRUE, NOW(), NOW());

-- =============================================
-- INSERT: Proyectos existentes
-- =============================================
INSERT INTO proyecto (titulo, descripcion, estado)
VALUES
    ('Sistema de Monitoreo Ambiental', 'Desarrollo de sensores conectados para medir la calidad del aire.', 'EN_PROCESO'),
    ('Plataforma de Tutoría Académica', 'Aplicación web para gestionar sesiones de tutoría entre estudiantes y profesores.', 'EN_PROCESO');

-- =============================================
-- INSERT: Asociación usuarios-proyecto
-- =============================================
-- Proyecto 1
INSERT INTO usuario_proyecto (usuario_id, proyecto_id, lider_proyecto)
VALUES
    (1, 1, TRUE),
    (5, 1, FALSE),
    (12, 2, FALSE),
    (13, 2, FALSE),
    (14, 2, FALSE);

-- Proyecto 2
INSERT INTO usuario_proyecto (usuario_id, proyecto_id, lider_proyecto)
VALUES
    (3, 2, TRUE),
    (7, 2, FALSE),
    (9, 1, FALSE),
    (10, 1, FALSE),
    (11, 1, FALSE);

-- =============================================
-- INSERT: Asociación usuarios-tema-rol
-- Roles:
-- 1 = Asesor
-- 2 = Jurado
-- 4 = Alumno
-- 5 = Coasesor
-- =============================================

-- Tema 2
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador) VALUES
    (1, 2, 1, TRUE, TRUE),   -- Asesor
    (10, 2, 4, TRUE, TRUE),  -- Alumno
    (15, 2, 2, TRUE, FALSE); -- Jurado (no es asesor/coasesor en tema 2)

-- Tema 3
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador) VALUES
    (3, 3, 1, TRUE, TRUE),   -- Asesor
    (4, 3, 5, TRUE, FALSE),  -- Coasesor
    (11, 3, 4, TRUE, TRUE),  -- Alumno
    (16, 3, 2, TRUE, FALSE); -- Jurado

-- Tema 4
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador) VALUES
    (4, 4, 1, TRUE, TRUE),   -- Asesor
    (12, 4, 4, TRUE, TRUE),  -- Alumno
    (17, 4, 2, TRUE, FALSE); -- Jurado

-- Tema 5
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador) VALUES
    (5, 5, 1, TRUE, TRUE),   -- Asesor
    (6, 5, 5, TRUE, FALSE),  -- Coasesor
    (13, 5, 4, TRUE, TRUE),  -- Alumno
    (7, 5, 2, TRUE, FALSE);  -- Jurado

-- Tema 6
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador) VALUES
    (1, 6, 1, TRUE, TRUE),   -- Asesor
    (14, 6, 4, TRUE, TRUE),  -- Alumno
    (16, 6, 2, TRUE, FALSE); -- Jurado

-- Tema 7
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador) VALUES
    (5, 7, 1, TRUE, TRUE),   -- Asesor
    (7, 7, 5, TRUE, FALSE),  -- Coasesor
    (14, 7, 4, TRUE, TRUE),  -- Alumno
    (16, 7, 2, TRUE, FALSE); -- Jurado (no es asesor ni coasesor)

-- Tema 8
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador) VALUES
    (3, 8, 1, TRUE, TRUE),   -- Asesor
    (12, 8, 4, TRUE, TRUE),  -- Alumno
    (5, 8, 2, TRUE, FALSE);  -- Jurado

-- Tema 9
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador) VALUES
    (4, 9, 1, TRUE, TRUE),   -- Asesor
    (5, 9, 5, TRUE, FALSE),  -- Coasesor
    (13, 9, 4, TRUE, TRUE),  -- Alumno
    (16, 9, 2, TRUE, FALSE); -- Jurado

-- Tema 10
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador) VALUES
    (6, 10, 1, TRUE, TRUE),  -- Asesor
    (10, 10, 4, TRUE, TRUE), -- Alumno
    (7, 10, 2, TRUE, FALSE); -- Jurado

-- Tema 11
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador) VALUES
    (7, 11, 1, TRUE, TRUE),  -- Asesor
    (5, 11, 5, TRUE, FALSE), -- Coasesor
    (9, 11, 4, TRUE, TRUE),  -- Alumno
    (16, 11, 2, TRUE, FALSE);-- Jurado

-- Tema 12
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador) VALUES
    (1, 12, 1, TRUE, TRUE),  -- Asesor
    (14, 12, 4, TRUE, TRUE), -- Alumno
    (17, 12, 2, TRUE, FALSE);-- Jurado

-- =============================================
-- INSERT: Asociación usuarios-rol
-- Roles asignados en general (para que coincida con usuario_tema)
-- Asesor (1), Alumno (4), Coasesor (5), Jurado (2)
-- =============================================
INSERT INTO usuario_rol (usuario_id, rol_id, activo, fecha_creacion, fecha_modificacion)
VALUES
    -- Roles de usuarios en temas
    (1, 1, TRUE, NOW(), NOW()),
    (3, 1, TRUE, NOW(), NOW()),
    (4, 1, TRUE, NOW(), NOW()),
    (4, 5, TRUE, NOW(), NOW()),
    (5, 1, TRUE, NOW(), NOW()),
    (5, 5, TRUE, NOW(), NOW()),
    (6, 1, TRUE, NOW(), NOW()),
    (7, 1, TRUE, NOW(), NOW()),
    (7, 5, TRUE, NOW(), NOW()),
    (9, 4, TRUE, NOW(), NOW()),
    (10, 4, TRUE, NOW(), NOW()),
    (11, 4, TRUE, NOW(), NOW()),
    (12, 4, TRUE, NOW(), NOW()),
    (13, 4, TRUE, NOW(), NOW()),
    (14, 4, TRUE, NOW(), NOW()),

    -- Jurados asignados
    (5, 2, TRUE, NOW(), NOW()),
    (7, 2, TRUE, NOW(), NOW()),
    (15, 2, TRUE, NOW(), NOW()),
    (16, 2, TRUE, NOW(), NOW()),
    (17, 2, TRUE, NOW(), NOW()),

    -- Profesores sin temas asignados con rol Asesor
    (15, 1, TRUE, NOW(), NOW()),
    (16, 1, TRUE, NOW(), NOW()),
    (17, 1, TRUE, NOW(), NOW());

-- =============================================
-- ACTUALIZACIÓN ESTADOS DE LOS TEMAS
-- =============================================
UPDATE tema SET estado_tema_id = 10 WHERE tema_id % 2 = 0;
UPDATE tema SET estado_tema_id = 12 WHERE tema_id % 2 = 1;
