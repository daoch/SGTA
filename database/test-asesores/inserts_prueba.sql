-- Más alumnos
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
    (2, 'A007', 'Elena', 'Gutiérrez', 'Salazar', 'elena.gutierrez@pucp.edu.pe', 'Pregrado', 'secret14', 'Estudiante de IA', NULL, 'Vie 8-12', 'Presencial', TRUE, NOW(), NOW());
-- 2 proyectos
INSERT INTO proyecto (titulo, descripcion, estado)
VALUES
    ('Sistema de Monitoreo Ambiental', 'Desarrollo de sensores conectados para medir la calidad del aire.', 'EN_PROCESO'),
    ('Plataforma de Tutoría Académica', 'Aplicación web para gestionar sesiones de tutoría entre estudiantes y profesores.', 'EN_PROCESO');
-- usuario_proyecto
-- Proyecto 1: Sistema de Monitoreo Ambiental
INSERT INTO usuario_proyecto (usuario_id, proyecto_id, lider_proyecto)
VALUES
    (1, 1, TRUE),  -- Juan Pérez
    (5, 1, FALSE), -- Ana Martínez
	(12, 2, FALSE), -- Sandra Chávez
    (13, 2, FALSE), -- Manuel López
    (14, 2, FALSE); -- Elena Gutiérrez

-- Proyecto 2: Plataforma de Tutoría Académica
INSERT INTO usuario_proyecto (usuario_id, proyecto_id, lider_proyecto)
VALUES
    (3, 2, TRUE),  -- Luis Ramírez
    (7, 2, FALSE), -- Laura González
    (9, 1, FALSE),  -- Diego Sánchez
    (10, 1, FALSE), -- Lucía Torres
    (11, 1, FALSE); -- Pedro Valdez

-- Tema 2: Asesor (1), Alumno (10)
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (1, 2, 1, TRUE, TRUE),   -- asesor
    (10, 2, 4, TRUE, TRUE);  -- alumno

-- Tema 3: Asesor (3), Coasesor (3), Alumno (11)
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (3, 3, 1, TRUE, TRUE),   -- asesor
    (3, 3, 5, TRUE, FALSE),  -- coasesor
    (11, 3, 4, TRUE, TRUE);  -- alumno

-- Tema 4: Asesor (4), Alumno (12)
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (4, 4, 1, TRUE, TRUE),
    (12, 4, 4, TRUE, TRUE);

-- Tema 5: Asesor (5), Coasesor (6), Alumno (13)
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (5, 5, 1, TRUE, TRUE),
    (6, 5, 5, TRUE, FALSE),
    (13, 5, 4, TRUE, TRUE);

-- Tema 6: Asesor (1), Alumno (14)
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (1, 6, 1, TRUE, TRUE),
    (14, 6, 4, TRUE, TRUE);

-- Tema 7: Asesor (5), Coasesor (7), Alumno (14)
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (5, 7, 1, TRUE, TRUE),
    (7, 7, 5, TRUE, FALSE),
    (14, 7, 4, TRUE, TRUE);

-- Tema 8: Asesor (3), Alumno (12)
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (3, 8, 1, TRUE, TRUE),
    (12, 8, 4, TRUE, TRUE);

-- Tema 9: Asesor (4), Coasesor (5), Alumno (13)
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (4, 9, 1, TRUE, TRUE),
    (5, 9, 5, TRUE, FALSE),
    (13, 9, 4, TRUE, TRUE);

-- Tema 10: Asesor (6), Alumno (9)
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (6, 10, 1, TRUE, TRUE),
    (10, 10, 4, TRUE, TRUE);

-- Tema 11: Asesor (7), Coasesor (5), Alumno (19)
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (7, 11, 1, TRUE, TRUE),
    (5, 11, 5, TRUE, FALSE),
    (9, 11, 4, TRUE, TRUE);

-- Tema 12: Asesor (1), Alumno (14)
INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador)
VALUES
    (1, 12, 1, TRUE, TRUE),
    (14, 12, 4, TRUE, TRUE);
