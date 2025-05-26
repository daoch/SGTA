-- ================================
-- INSERT: Nuevos alumnos
-- Se agregan nuevos usuarios con tipo 'alumno' (tipo_usuario_id = 2)
-- ================================
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

    -- ================================
    -- Nuevos usuarios profesores sin asignación a temas todavía
    -- tipo_usuario_id = 1 para profesores
    -- ================================
    (1, 'P004', 'Miguel', 'Ramírez', 'Flores', 'miguel.ramirez@pucp.edu.pe', 'Postgrado', 'secret15', 'Profesor de matemática', NULL, NULL, NULL, TRUE, NOW(), NOW()),
    (1, 'P005', 'Clara', 'Morales', 'López', 'clara.morales@pucp.edu.pe', 'Postgrado', 'secret16', 'Profesora de física', NULL, NULL, NULL, TRUE, NOW(), NOW()),
    (1, 'P006', 'Felipe', 'Suárez', 'Cano', 'felipe.suarez@pucp.edu.pe', 'Doctorado', 'secret17', 'Profesor de computación', NULL, NULL, NULL, TRUE, NOW(), NOW());

-- ================================
-- INSERT: Proyectos existentes
-- Se crean dos proyectos para asignar usuarios después
-- ================================
INSERT INTO proyecto (titulo, descripcion, estado)
VALUES
    ('Sistema de Monitoreo Ambiental', 'Desarrollo de sensores conectados para medir la calidad del aire.', 'EN_PROCESO'),
    ('Plataforma de Tutoría Académica', 'Aplicación web para gestionar sesiones de tutoría entre estudiantes y profesores.', 'EN_PROCESO');

-- ================================
-- INSERT: Asociación usuarios-proyecto
-- Asigna usuarios a proyectos, indicando líderes de proyecto
-- ================================
-- Proyecto 1: Sistema de Monitoreo Ambiental
INSERT INTO usuario_proyecto (usuario_id, proyecto_id, lider_proyecto)
VALUES
    (1, 1, TRUE),  -- Juan Pérez es líder
    (5, 1, FALSE), -- Ana Martínez es miembro
    (12, 2, FALSE), -- Sandra Chávez es miembro
    (13, 2, FALSE), -- Manuel López es miembro
    (14, 2, FALSE); -- Elena Gutiérrez es miembro

-- Proyecto 2: Plataforma de Tutoría Académica
INSERT INTO usuario_proyecto (usuario_id, proyecto_id, lider_proyecto)
VALUES
    (3, 2, TRUE),  -- Luis Ramírez es líder
    (7, 2, FALSE), -- Laura González es miembro
    (9, 1, FALSE),  -- Diego Sánchez es miembro
    (10, 1, FALSE), -- Lucía Torres es miembro
    (11, 1, FALSE); -- Pedro Valdez es miembro

-- ================================
-- INSERT: Asociación usuarios-tema-rol
-- Asigna roles específicos en temas para los usuarios
-- Los números de rol son:
-- 1 = Asesor, 4 = Alumno, 5 = Coasesor
-- ================================

-- Tema 2
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (1, 2, 1, TRUE, TRUE),   -- Usuario 1 es asesor
    (10, 2, 4, TRUE, TRUE);  -- Usuario 10 es alumno

-- Tema 3
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (3, 3, 1, TRUE, TRUE),   -- Asesor
    (4, 3, 5, TRUE, FALSE),  -- Coasesor
    (11, 3, 4, TRUE, TRUE);  -- Alumno

-- Tema 4
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (4, 4, 1, TRUE, TRUE),   -- Asesor
    (12, 4, 4, TRUE, TRUE);  -- Alumno

-- Tema 5
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (5, 5, 1, TRUE, TRUE),   -- Asesor
    (6, 5, 5, TRUE, FALSE),  -- Coasesor
    (13, 5, 4, TRUE, TRUE);  -- Alumno

-- Tema 6
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (1, 6, 1, TRUE, TRUE),   -- Asesor
    (14, 6, 4, TRUE, TRUE);  -- Alumno

-- Tema 7
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (5, 7, 1, TRUE, TRUE),   -- Asesor
    (7, 7, 5, TRUE, FALSE),  -- Coasesor
    (14, 7, 4, TRUE, TRUE);  -- Alumno

-- Tema 8
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (3, 8, 1, TRUE, TRUE),   -- Asesor
    (12, 8, 4, TRUE, TRUE);  -- Alumno

-- Tema 9
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (4, 9, 1, TRUE, TRUE),   -- Asesor
    (5, 9, 5, TRUE, FALSE),  -- Coasesor
    (13, 9, 4, TRUE, TRUE);  -- Alumno

-- Tema 10
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (6, 10, 1, TRUE, TRUE),  -- Asesor
    (10, 10, 4, TRUE, TRUE); -- Alumno

-- Tema 11
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (7, 11, 1, TRUE, TRUE),  -- Asesor
    (5, 11, 5, TRUE, FALSE), -- Coasesor
    (9, 11, 4, TRUE, TRUE);  -- Alumno

-- Tema 12
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (1, 12, 1, TRUE, TRUE),  -- Asesor
    (14, 12, 4, TRUE, TRUE); -- Alumno

-- ================================
-- INSERT: Asociación usuarios-rol
-- Se asignan roles a los usuarios basados en lo que tienen en usuario_tema
-- Se incluyen roles Asesor (1), Alumno (4), Coasesor (5) según correspondan
-- También se agregan roles Asesor para profesores sin temas asignados
-- ================================
INSERT INTO usuario_rol (usuario_id, rol_id, activo, fecha_creacion, fecha_modificacion)
VALUES
    -- Roles de usuarios que participan en temas
    (1, 1, TRUE, NOW(), NOW()),    -- Usuario 1: Asesor
    (3, 1, TRUE, NOW(), NOW()),    -- Usuario 3: Asesor
    (4, 1, TRUE, NOW(), NOW()),    -- Usuario 4: Asesor
    (4, 5, TRUE, NOW(), NOW()),    -- Usuario 4: Coasesor
    (5, 1, TRUE, NOW(), NOW()),    -- Usuario 5: Asesor
    (5, 5, TRUE, NOW(), NOW()),    -- Usuario 5: Coasesor
    (6, 1, TRUE, NOW(), NOW()),    -- Usuario 6: Asesor
    (7, 1, TRUE, NOW(), NOW()),    -- Usuario 7: Asesor
    (7, 5, TRUE, NOW(), NOW()),    -- Usuario 7: Coasesor
    (9, 4, TRUE, NOW(), NOW()),    -- Usuario 9: Alumno
    (10, 4, TRUE, NOW(), NOW()),   -- Usuario 10: Alumno
    (11, 4, TRUE, NOW(), NOW()),   -- Usuario 11: Alumno
    (12, 4, TRUE, NOW(), NOW()),   -- Usuario 12: Alumno
    (13, 4, TRUE, NOW(), NOW()),   -- Usuario 13: Alumno
    (14, 4, TRUE, NOW(), NOW()),   -- Usuario 14: Alumno

    -- Roles de profesores sin asignación a temas (solo Asesor)
    (15, 1, TRUE, NOW(), NOW()),   -- Nuevo prof. Miguel Ramírez
    (16, 1, TRUE, NOW(), NOW()),   -- Nuevo prof. Clara Morales
    (17, 1, TRUE, NOW(), NOW());   -- Nuevo prof. Felipe Suárez

-- ================================
-- ACTUALIZACIÓN ESTADOS DE LOS TEMAS
-- Se actualiza estado_tema_id en función de la paridad del tema_id
-- tema_id par => estado_tema_id = 10
-- tema_id impar => estado_tema_id = 12
-- ================================
UPDATE tema SET estado_tema_id = 10 WHERE tema_id % 2 = 0;
UPDATE tema SET estado_tema_id = 12 WHERE tema_id % 2 = 1;
