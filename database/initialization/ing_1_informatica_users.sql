--------------------------
--| PROFESORES REALES  |--
--------------------------



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
                     tipo_dedicacion_id,
                     activo,
                     fecha_creacion,
                     fecha_modificacion)
    VALUES (1, 'PROF001', 'Johan Paul', 'Baldeón', 'Medrano', 'j.baldeon00@pucp.edu.pe', 'Doctorado', 'johanbpass', 'Profesor de Algoritmos, Gamificación e Implementación', NULL, 'Lun-Vie 9-12', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF002', 'Freddy Alberto', 'Paz', 'Espinoza', 'f.paz00@pucp.edu.pe', 'Maestría', 'freddyppass', 'Profesor de Programación y diseño de interfaces', NULL, 'Mar-Vie 10-13', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF003', 'César Augusto', 'Aguilera', 'Serpa', 'c.aguilera00@pucp.edu.pe', 'Maestría', 'cesarapass', 'Profesor de Base de Datos e Implementación', NULL, 'Lun-Mié 8-11', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF004', 'Edwin Rafael', 'Villanueva', 'Talavera', 'e.villanueva00@pucp.edu.pe', 'Doctorado', 'edwinvpass', 'Profesor de Inteligencia Artificial', NULL, 'Mar-Vie 10-13', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF005', 'César Armando', 'Beltrán', 'Castañón', 'c.beltran00@pucp.edu.pe', 'Maestría', 'cesarbpass', 'Profesor de Machine Learning', NULL, 'Lun-Mié 8-11', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF006', 'Luis Fernando', 'Muroya', 'Tokushima', 'l.muroya00@pucp.edu.pe', 'Doctorado', 'luismpass', 'Profesor de Procesamiento de Lenguaje Natural', NULL, 'Mar-Vie 10-13', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF007', 'Héctor Erasmo', 'Gómez', 'Montoya', 'h.gomez00@pucp.edu.pe', 'Maestría', 'hectorgpass', 'Profesor de Procesamiento de Lenguaje Natural', NULL, 'Lun-Mié 8-11', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF008', 'Manuel Francisco', 'Tupia', 'Anticona', 'm.tupia00@pucp.edu.pe', 'Doctorado', 'manueltpass', 'Profesor de Gobierno y gestión de TI', NULL, 'Mar-Vie 10-13', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF009', 'Eder Ramiro', 'Quispe', 'Vilchez', 'e.quispe00@pucp.edu.pe', 'Maestría', 'ederqpass', 'Profesor de Experiencia de Usuario', NULL, 'Lun-Mié 8-11', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF010', 'Layla', 'Hirsh', 'Martinez', 'l.hirsh00@pucp.edu.pe', 'Doctorado', 'laylahpass', 'Profesora de Inteligencia Artificial', NULL, 'Mar-Vie 10-13', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF011', 'Rony', 'Cueva', 'Moscoso', 'r.cueva00@pucp.edu.pe', 'Maestría', 'ronycpass', 'Profesor de Algoritmia', NULL, 'Lun-Mié 8-11', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF012', 'Luis Alberto', 'Flores', 'García', 'l.flores00@pucp.edu.pe', 'Doctorado', 'luisfpass', 'Profesor de Ingeniería de Software', NULL, 'Mar-Vie 10-13', 'Presencial', 1, TRUE, NOW(), NOW()),

           (1, 'PROF013', 'Julio', 'Ramírez', 'Lozano', 'julio.ramirez@pucp.edu.pe', 'Maestría', 'hashed_password_1', 'Docente con experiencia en ingeniería de software y arquitectura empresarial.', NULL, 'Lunes-Viernes 08:00-12:00', 'presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF014', 'Elena', 'Torres', 'Mendoza', 'elena.torres@pucp.edu.pe', 'Doctorado', 'hashed_password_2', 'Investigadora en inteligencia artificial con publicaciones en aprendizaje automático.', NULL, 'Martes-Jueves 10:00-14:00', 'presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF015', 'Ricardo', 'Salas', 'Gutiérrez', 'ricardo.salas@pucp.edu.pe', 'Maestría', 'hashed_password_3', 'Especialista en redes y ciberseguridad, con 10 años de experiencia docente.', NULL, 'Lunes-Miércoles 13:00-17:00', 'presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF016', 'Carla', 'Reyes', 'Fernández', 'carla.reyes@pucp.edu.pe', 'Doctorado', 'hashed_password_4', 'Profesora enfocada en bases de datos y minería de datos en entornos empresariales.', NULL, 'Martes-Viernes 09:00-13:00', 'presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF017', 'Ana', 'Martínez', 'Rojas', 'ana.martinez@pucp.edu.pe', 'Doctorado', 'secret5', 'Profesora de Sistemas', NULL, 'Mar-Vie 10-13', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF018', 'Carlos', 'Sánchez', 'Mendoza', 'carlos.sanchez@pucp.edu.pe', 'Maestría', 'secret6', 'Profesor de Redes', NULL, 'Lun-Mié 8-11', 'Presencial', 1, TRUE, NOW(), NOW()),
           (1, 'PROF019', 'Juan', 'Pérez', 'Lopez', 'juan.perez@pucp.edu.pe', 'Doctorado', 'secret1', 'Profesor de IA', NULL, 'Lun-Vie 9-12', 'Presencial', 1, TRUE, NOW(), NOW()),

           --Coordinador
           (1, 'COOR001', 'Claudia María del Pilar', 'Zapata', 'del Río', 'claudia.zapata00@pucp.edu.pe', 'Maestría', 'claudiazpass', 'Coordinadora de tesis', NULL, NULL, NULL, 1, TRUE, NOW(), NOW()),
           (1, 'COOR002', 'Luis', 'Ramírez', 'Díaz', 'luis.ramirez@pucp.edu.pe', 'Maestría', 'secret3', 'Coord. de tesis', NULL, NULL, NULL, 1, TRUE, NOW(), NOW()),

           --Administrador
           (3, 'AD01', 'Carla', 'Vega', 'Reyna', 'carla.vega@pucp.edu.pe', 'Administración', 'secret4', 'Admin. del sistema', NULL, NULL, NULL, NULL, TRUE, NOW(), NOW());


--------------------------
--|  ACCESO DEL GRUPO  |--
--------------------------

-- Inserción de alumnos
INSERT INTO usuario (tipo_usuario_id,
                     codigo_pucp,
                     nombres,
                     primer_apellido,
                     segundo_apellido,
                     correo_electronico,
                     nivel_estudios,
                     contrasena,
                     id_cognito)
SELECT (SELECT tipo_usuario_id FROM tipo_usuario WHERE LOWER(nombre) = 'alumno' LIMIT 1),
       v.codigo_pucp,
       v.nombres,
       v.primer_apellido,
       v.segundo_apellido,
       v.correo_electronico,
       v.nivel_estudios,
       v.contrasena,
       v.id_cognito
    FROM (VALUES ('20180530', 'Drew', 'Ames', 'Gomez', 'carlo.ames@pucp.edu.pe', 'Pregrado', 'secretDrew', '415b65c0-a071-70f5-a3d7-7e09e5166a3f'),
                 ('20191088', 'Brando', 'Rojas', 'Romero', 'brando.rojas@pucp.edu.pe', 'Pregrado', 'secretBrando', NULL))
             AS v(codigo_pucp,
                  nombres,
                  primer_apellido,
                  segundo_apellido,
                  correo_electronico,
                  nivel_estudios,
                  contrasena,
                  id_cognito);

-- Inserción de profesores
INSERT INTO usuario (tipo_usuario_id,
                     codigo_pucp,
                     nombres,
                     primer_apellido,
                     segundo_apellido,
                     correo_electronico,
                     nivel_estudios,
                     contrasena,
                     biografia,
                     disponibilidad,
                     tipo_disponibilidad,
                     id_cognito)
SELECT (SELECT tipo_usuario_id FROM tipo_usuario WHERE LOWER(nombre) = 'profesor' LIMIT 1),
       v.codigo_pucp,
       v.nombres,
       v.primer_apellido,
       v.segundo_apellido,
       v.correo_electronico,
       v.nivel_estudios,
       v.contrasena,
       v.biografia,
       v.disponibilidad,
       v.tipo_disponibilidad,
       v.id_cognito
    FROM (VALUES ('20200485', 'Ricardo', 'Melendez', 'Olivo', 'a20200485@pucp.edu.pe', 'Bachiller', 'secretRicardo', 'Profesor de IA y CS', 'Martes-Jueves 10:00-14:00', 'Presencial', NULL),
                 ('20161395', 'Juan', 'de la Cruz', 'Sairitupa', 'juan.delacruz@pucp.edu.pe', 'Magister', 'secretJuan', 'Profesor de ingeniería informática', 'Martes-Jueves 10:00-14:00', 'Virtual', NULL),
                 ('20195952', 'Carlos', 'Sanchez', 'Espinoza', 'mauricio.sanchez@pucp.edu.pe', 'Doctor', 'secretCarlos', 'Profesor de ingeniería informática', 'Martes-Jueves 10:00-14:00', 'Presencial', NULL),
                 ('20181897', 'Angela', 'Llontop', 'Toro', 'angela.llontop@pucp.edu.pe', 'Doctora', 'secretAngela', 'Profesora de ingeniería informática y DBA de BBVA', 'Martes-Jueves 10:00-14:00', 'Presencial', NULL))
             AS v(codigo_pucp,
                  nombres,
                  primer_apellido,
                  segundo_apellido,
                  correo_electronico,
                  nivel_estudios,
                  contrasena,
                  biografia,
                  disponibilidad,
                  tipo_disponibilidad,
                  id_cognito);

---------------
--|  RESTO  |--
---------------

INSERT INTO usuario_carrera (usuario_id,
                             carrera_id,
                             activo,
                             fecha_creacion,
                             fecha_modificacion)
SELECT u.usuario_id, 1, TRUE, NOW(), NOW()
    FROM usuario u;

-- Para los profesores código COOR001 y COOR002, alterar usuario_carrera con es_coordinador = TRUE

UPDATE usuario_carrera
    SET es_coordinador = TRUE,
        fecha_modificacion = NOW()
    WHERE usuario_id IN (SELECT usuario_id
                         FROM usuario
                         WHERE codigo_pucp IN ('COOR001', 'COOR002'));

-- Agregar rol de asesor a los profesores de la carrera de Ingeniería Informática

INSERT INTO usuario_rol (usuario_id,
                         rol_id,
                         activo,
                         fecha_creacion,
                         fecha_modificacion)
    (SELECT usuario.usuario_id, rol.rol_id, TRUE, NOW(), NOW()
         FROM usuario
                  INNER JOIN tipo_usuario ON tipo_usuario.tipo_usuario_id = usuario.tipo_usuario_id
                  INNER JOIN usuario_carrera ON usuario_carrera.usuario_id = usuario.usuario_id
                  JOIN rol ON lower(rol.nombre) = 'asesor'
         WHERE tipo_usuario.nombre LIKE 'profesor'
           AND usuario_carrera.carrera_id = 1);


INSERT INTO usuario_grupo_investigacion (usuario_id,
                                         grupo_investigacion_id,
                                         activo,
                                         fecha_creacion,
                                         fecha_modificacion)
    VALUES (5, 1, TRUE, NOW(), NOW()),
           (6, 1, TRUE, NOW(), NOW()),
           (7, 1, TRUE, NOW(), NOW()),
           (8, 1, TRUE, NOW(), NOW());


INSERT INTO usuario_proyecto (usuario_id,
                              proyecto_id,
                              lider_proyecto)
    VALUES (4, 1, TRUE),
           (12, 2, TRUE),
           (10, 2, FALSE),
           (5, 3, TRUE),
           (7, 3, FALSE),
           (9, 4, TRUE);


INSERT INTO usuario_area_conocimiento (usuario_id, area_conocimiento_id)
    VALUES (1, 2),
           (2, 2),
           (3, 3),
           (4, 1),
           (5, 1),
           (6, 1),
           (7, 1),
           (8, 3),
           (9, 2),
           (10, 1),
           (11, 2),
           (12, 2);


INSERT INTO usuario_sub_area_conocimiento (usuario_id, sub_area_conocimiento_id)
    VALUES (6, 11),
           (6, 12),
           (6, 14),
           (9, 7),
           (9, 6),
           (9, 14),
           (9, 15),
           (9, 11),
           (10, 5),
           (10, 4),
           (11, 11),
           (11, 14),
           (12, 1),
           (12, 3),
           (12, 6),
           (12, 10),
           (12, 7);


--------------------------
--|  ACCESO DEL GRUPO  |--
--------------------------


INSERT INTO usuario_rol (usuario_id,
                         rol_id,
                         activo)
SELECT u.usuario_id,
       r.rol_id,
       TRUE AS activo
    FROM usuario u
             CROSS JOIN
         rol r
             JOIN (VALUES ('20200485'),
                          ('20161395'),
                          ('20195952'),
                          ('20181897')) AS codigos(codigo_pucp)
                  ON u.codigo_pucp = codigos.codigo_pucp
    WHERE u.activo = TRUE
      AND LOWER(r.nombre) = 'asesor'
      AND r.activo = TRUE;