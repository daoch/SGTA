--------------------------
--|     PROFESORES     |--
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
           (3, 'COOR001', 'Claudia María del Pilar', 'Zapata', 'del Río', 'claudia.zapata00@pucp.edu.pe', 'Maestría', 'claudiazpass', 'Coordinadora de tesis', NULL, NULL, NULL, 1, TRUE, NOW(), NOW()),
           (3, 'COOR002', 'Luis', 'Ramírez', 'Díaz', 'luis.ramirez@pucp.edu.pe', 'Maestría', 'secret3', 'Coord. de tesis', NULL, NULL, NULL, 1, TRUE, NOW(), NOW()),

           --Administrador
           (4, 'AD01', 'Carla', 'Vega', 'Reyna', 'carla.vega@pucp.edu.pe', 'Administración', 'secret4', 'Admin. del sistema', NULL, NULL, NULL, NULL, TRUE, NOW(), NOW());


INSERT INTO usuario_carrera (usuario_id,
                             carrera_id,
                             activo,
                             fecha_creacion,
                             fecha_modificacion)
SELECT u.usuario_id, 1, TRUE, NOW(), NOW()
    FROM usuario u;


INSERT INTO usuario_grupo_investigacion (usuario_id,
                                         grupo_investigacion_id,
                                         activo,
                                         fecha_creacion,
                                         fecha_modificacion)
    VALUES (5, 1, TRUE, NOW(), NOW()),
           (6, 1, TRUE, NOW(), NOW()),
           (7, 1, TRUE, NOW(), NOW()),
           (8, 1, TRUE, NOW(), NOW());
