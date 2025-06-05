SET search_path TO sgtadb;

-- 1) Tipo de usuario y dedicacion

INSERT INTO tipo_usuario (nombre,
                          activo,
                          fecha_creacion,
                          fecha_modificacion)
    VALUES ('profesor', TRUE, NOW(), NOW()),
           ('alumno', TRUE, NOW(), NOW()),
           ('coordinador', TRUE, NOW(), NOW()),
           ('administrador', TRUE, NOW(), NOW());


INSERT INTO tipo_dedicacion (iniciales, descripcion)
    VALUES ('TC', 'Tiempo completo'),
           ('TPC', 'Tiempo parcial convencional'),
           ('TPA', 'Tiempo parcial por asignaturas');

-- 2) Rol

INSERT INTO rol (nombre,
             descripcion,
             activo,
             fecha_creacion,
             fecha_modificacion)
VALUES ('Asesor', 'Asesora a estudiantes en sus proyectos', TRUE, NOW(), NOW()),
       ('Jurado', 'Está presente, evalúa y califica exposiciones', TRUE, NOW(), NOW()),
       ('Revisor', 'Califica exposiciones y entregables', TRUE, NOW(), NOW()),
       ('Tesista', 'Estudiante realizando tesis de grado o proyecto de fin de carrera', TRUE, NOW(), NOW()),
       ('Coasesor', 'Cosesora a estudiantes en sus proyectos', TRUE, NOW(), NOW()),
       ('Alumno', 'Alumno de la universidad', TRUE, NOW(), NOW());


-- 3) Estado de tema

INSERT INTO estado_tema (nombre,
                         descripcion,
                         activo,
                         fecha_creacion,
                         fecha_modificacion)
    VALUES ('PROPUESTO_LIBRE', 'Tema propuesto por asesor para que los alumnos postulen', TRUE, NOW(), NOW()),
           ('PROPUESTO_GENERAL', 'Tema propuesto por estudiante o estudiantes en general a una subárea de conocimiento', TRUE, NOW(), NOW()),
           ('PROPUESTO_DIRECTO', 'Tema propuesto por estudiante directamente a un profesor (no visible a otros profesores)', TRUE, NOW(), NOW()),
           ('PREINSCRITO', 'Tema propuesto por estudiante que cuenta con asesor aceptado', TRUE, NOW(), NOW()),
           ('INSCRITO', 'Tema inscrito con asesor con detalles formalizados', TRUE, NOW(), NOW()),
           ('REGISTRADO', 'Tema inscrito aceptado por comité de tesis', TRUE, NOW(), NOW()),
           ('RECHAZADO', 'Tema propuesto por estudiante que ha sido rechazado', TRUE, NOW(), NOW()),
           ('OBSERVADO', 'Tema inscrito con observaciones pendientes del comité de tesis', TRUE, NOW(), NOW()),
           ('VENCIDO', 'Tema propuesto por asesor o estudiantes que pasó su fecha de vencimiento definida', TRUE, NOW(), NOW()),
           ('EN_PROGRESO', 'Tema registrado en progreso', TRUE, NOW(), NOW()),
           ('PAUSADO', 'Tema que ha sido registrado e iniciado, pero no está en progreso actualmente', TRUE, NOW(), NOW()),
           ('FINALIZADO', 'Tema que ha sido registrado y ha finalizado su proceso de evaluación', TRUE, NOW(), NOW());


-- 4) Unidad académica

INSERT INTO unidad_academica (nombre, descripcion)
    VALUES ('Facultad de Ciencias e Ingeniería', 'Unidad encargada de carreras de ingeniería');


-- 5) Carrera  (unidad_academica_id = 1)

INSERT INTO carrera (unidad_academica_id,
                     codigo,
                     nombre,
                     descripcion,
                     activo,
                     fecha_creacion,
                     fecha_modificacion)
    VALUES (1, 'INF', 'Ingeniería Informática', 'Carrera de software y sistemas', TRUE, NOW(), NOW()),
           (1, 'CIV', 'Ingeniería Civil', 'Carrera de construcción y estructuras', TRUE, NOW(), NOW()),
           (1, 'MEC', 'Ingeniería Mecánica', 'Carrera de diseño y manufactura de máquinas', TRUE, NOW(), NOW()),
           (1, 'IND', 'Ingeniería Industrial', 'Carrera de optimización de procesos', TRUE, NOW(), NOW());


-- 6) Grupo de investigación

INSERT INTO grupo_investigacion (nombre,
                                 descripcion,
                                 activo,
                                 fecha_creacion,
                                 fecha_modificacion)
    VALUES ('Grupo de Inteligencia Artificial PUCP', 'Investigación en IA y aprendizaje automático', TRUE, NOW(), NOW()),
           ('Grupo de Investigación HCI-DUXAIT-PUCP', 'Investigación que contribuya en las áreas de la Interacción Humano-Computador (HCI) y en el Desarrollo Tecnológico e Innovación', TRUE, NOW(), NOW());


-- 7) Módulo

INSERT INTO modulo (nombre,
                descripcion,
                activo,
                fecha_creacion,
                fecha_modificacion)
VALUES ('Temas', 'Gestión de propuestas y temas de investigación', TRUE, NOW(), NOW()),
       ('Asesores', 'Administración de asesores asignados', TRUE, NOW(), NOW()),
       ('Jurados', 'Administración de jurados de evaluación', TRUE, NOW(), NOW()),
       ('Revisión', 'Control y seguimiento de revisiones', TRUE, NOW(), NOW()),
       ('Reportes', 'Generación de informes y estadísticas', TRUE, NOW(), NOW());


-- 8) Área de conocimiento (ahora incluye carrera_id)

INSERT INTO area_conocimiento (carrera_id,
                               nombre,
                               descripcion,
                               activo,
                               fecha_creacion,
                               fecha_modificacion)
    VALUES (1, 'Ciencias de la Computación', 'Disciplina de teorías y sistemas computacionales', TRUE, NOW(), NOW()),
           (1, 'Sistemas de Información', 'Estudio de sistemas para gestión de información', TRUE, NOW(), NOW()),
           (1, 'Ciberseguridad', 'Protección de activos digitales ante amenazas', TRUE, NOW(), NOW());


-- 9) Sub-área de conocimiento (área_conocimiento_id = 1)

INSERT INTO sub_area_conocimiento (area_conocimiento_id,
                                   nombre,
                                   descripcion,
                                   activo,
                                   fecha_creacion,
                                   fecha_modificacion)
    VALUES (1, 'Procesamiento de lenguaje natural', 'Técnicas para análisis y generación de texto', TRUE, NOW(), NOW()),
           (1, 'Aprendizaje por reforzamiento', 'Métodos basados en recompensas y agentes', TRUE, NOW(), NOW()),
           (1, 'Procesamiento de imágenes', 'Algoritmos para interpretación de imágenes', TRUE, NOW(), NOW()),
           (1, 'Visión computacional', 'Análisis de imágenes y videos para tareas específicas', TRUE, NOW(), NOW()),
           (1, 'Machine Learning', 'Modelos computacionales de regresión y clasificación', TRUE, NOW(), NOW()),
           (2, 'Sistemas de gestión de bases de datos', 'Diseño y administración de bases de datos', TRUE, NOW(), NOW()),
           (2, 'Sistemas distribuidos', 'Arquitecturas y protocolos para sistemas distribuidos', TRUE, NOW(), NOW()),
           (2, 'Redes de computadoras', 'Interconexión y comunicación entre computadoras', TRUE, NOW(), NOW()),
           (2, 'Desarrollo de software', 'Metodologías y herramientas para desarrollo de software', TRUE, NOW(), NOW()),
           (2, 'Ingeniería de requisitos', 'Recopilación y análisis de requisitos de software', TRUE, NOW(), NOW()),
           (3, 'Seguridad en redes', 'Protección de redes y sistemas ante ataques', TRUE, NOW(), NOW()),
           (3, 'Criptografía', 'Técnicas para asegurar la información mediante cifrado', TRUE, NOW(), NOW()),
           (3, 'Seguridad en aplicaciones web', 'Protección de aplicaciones web contra vulnerabilidades', TRUE, NOW(), NOW()),
           (3, 'Seguridad en sistemas operativos', 'Protección de sistemas operativos ante amenazas', TRUE, NOW(), NOW()),
           (3, 'Análisis forense digital', 'Investigación de incidentes de seguridad digital', TRUE, NOW(), NOW());


-- 10) Tipo de solicitud

INSERT INTO tipo_solicitud(nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
    VALUES ('Aprobación de tema (por coordinador)', 'Solicitud para que el coordinador apruebe el tema', TRUE, NOW(), NOW()),
           ('Cambio de asesor (por asesor)', 'Solicitud para que el coordinador apruebe el cambio de asesores', TRUE, NOW(), NOW());

-- 11) Tipo de notificación

INSERT INTO tipo_notificacion (nombre,
                               descripcion,
                               prioridad,
                               activo,
                               fecha_creacion,
                               fecha_modificacion)
    VALUES ('informativa', 'Mensaje informativo para el usuario', 0, TRUE, NOW(), NOW()),
           ('advertencia', 'Señal de posible problema o riesgo', 1, TRUE, NOW(), NOW()),
           ('recordatorio', 'Recordatorio de acción pendiente', 2, TRUE, NOW(), NOW()),
           ('error', 'Notificación de error crítico', 3, TRUE, NOW(), NOW());

--12) Tipo de observación

INSERT INTO tipo_observacion (nombre_tipo)
    VALUES ('Contenido'),
           ('Similitud'),
           ('Citado'),
           ('Inteligencia Artificial');

-- 13) Tipo de rechazo tema

INSERT INTO tipo_rechazo_tema (nombre, descripcion)
    VALUES ('Inconsistencia en objetivos',
            'Los objetivos planteados no guardan coherencia con la metodología propuesta.'),
           ('Falta de viabilidad técnica',
            'El proyecto propuesto no puede ser llevado a cabo con los recursos o conocimientos disponibles.'),
           ('Duplicación de tema',
            'El tema ya ha sido aprobado previamente por otro estudiante.'),
           ('Contenido insuficiente',
            'El planteamiento del problema o la justificación no es suficientemente sólido.'),
           ('Fuera del alcance académico',
            'El tema no se ajusta al perfil de la carrera o a los objetivos del curso.'),
           ('Propuesta incompleta',
            'El formulario fue entregado sin todos los campos requeridos.'),
           ('Problemas éticos o legales',
            'La propuesta presenta conflictos éticos o legales que impiden su aprobación.');

--13) Más entidades fijas

INSERT INTO rol_solicitud (nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
    VALUES ('REMITENTE', 'Usuario que inicia la solicitud', TRUE, NOW(), NOW()),
           ('DESTINATARIO', 'Usuario al que está dirigida la solicitud', TRUE, NOW(), NOW()),
           ('ASESOR_ACTUAL', 'Asesor vigente del usuario', TRUE, NOW(), NOW()),
           ('ASESOR_ENTRADA', 'Asesor saliente del usuario', TRUE, NOW(), NOW());

INSERT INTO accion_solicitud (nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
    VALUES ('SIN_ACCION', 'Sin acción tomada aún', TRUE, NOW(), NOW()),
           ('PENDIENTE_ACCION', 'En espera de una acción', TRUE, NOW(), NOW()),
           ('APROBADO', 'Solicitud aprobada', TRUE, NOW(), NOW()),
           ('RECHAZADO', 'Solicitud rechazada', TRUE, NOW(), NOW());

INSERT INTO estado_solicitud (nombre, descripcion, activo, fecha_creacion, fecha_modificacion)
    VALUES ('PENDIENTE', 'La solicitud está en proceso de evaluación', TRUE, NOW(), NOW()),
           ('ACEPTADA', 'La solicitud ha sido aceptada', TRUE, NOW(), NOW()),
           ('RECHAZADA', 'La solicitud ha sido rechazada', TRUE, NOW(), NOW());


INSERT INTO
    usuario (
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
    -- Profesor
    (
        1,
        'P001',
        'Juan',
        'Pérez',
        'Lopez',
        'juan.perez@pucp.edu.pe',
        'Doctorado',
        'secret1',
        'Profesor de IA',
        NULL,
        'Lun-Vie 9-12',
        'Presencial',
        TRUE,
        NOW(),
        NOW()
    ),
    -- Alumno
    (
        2,
        'A001',
        'María',
        'Gómez',
        'Torres',
        'maria.gomez@pucp.edu.pe',
        'Pregrado',
        'secret2',
        'Estudiante de sistemas',
        NULL,
        'Mar-Jue 14-18',
        'Híbrido',
        TRUE,
        NOW(),
        NOW()
    ),
    -- Coordinador
    (
        3,
        'C001',
        'Luis',
        'Ramírez',
        'Díaz',
        'luis.ramirez@pucp.edu.pe',
        'Maestría',
        'secret3',
        'Coord. de tesis',
        NULL,
        NULL,
        NULL,
        TRUE,
        NOW(),
        NOW()
    ),
    -- Administrador
    (
        4,
        'AD01',
        'Carla',
        'Vega',
        'Reyna',
        'carla.vega@pucp.edu.pe',
        'Administración',
        'secret4',
        'Admin. del sistema',
        NULL,
        NULL,
        NULL,
        TRUE,
        NOW(),
        NOW()
    ),
    -- Nuevos profesores
    (
        1,
        'P002',
        'Ana',
        'Martínez',
        'Rojas',
        'ana.martinez@pucp.edu.pe',
        'Doctorado',
        'secret5',
        'Profesora de Sistemas',
        NULL,
        'Mar-Vie 10-13',
        'Presencial',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        1,
        'P003',
        'Carlos',
        'Sánchez',
        'Mendoza',
        'carlos.sanchez@pucp.edu.pe',
        'Maestría',
        'secret6',
        'Profesor de Redes',
        NULL,
        'Lun-Mié 8-11',
        'Presencial',
        TRUE,
        NOW(),
        NOW()
    );

INSERT INTO
    usuario (
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
    (
        2,
        'A002',
        'Diego',
        'Fernández',
        'García',
        'diego.fernandez@pucp.edu.pe',
        'Pregrado',
        'secret7',
        'Estudiante de IA',
        NULL,
        'Lun-Vie 14-18',
        'Híbrido',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        2,
        'A003',
        'Sofía',
        'Lima',
        'Huertas',
        'sofia.lima@pucp.edu.pe',
        'Pregrado',
        'secret8',
        'Estudiante de Data Science',
        NULL,
        'Mar-Jue 10-12',
        'Remoto',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        2,
        'A004',
        'Andrea',
        'Muñoz',
        'Castro',
        'andrea.munoz@pucp.edu.pe',
        'Pregrado',
        'secret9',
        'Estudiante de Ciencias de la Computación',
        NULL,
        'Lun-Vie 9-13',
        'Híbrido',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        2,
        'A005',
        'Roberto',
        'Vargas',
        'Mendoza',
        'roberto.vargas@pucp.edu.pe',
        'Pregrado',
        'secret10',
        'Estudiante de Sistemas',
        NULL,
        'Mar-Jue 14-18',
        'Presencial',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        2,
        'A006',
        'Carmen',
        'Ruiz',
        'Palacios',
        'carmen.ruiz@pucp.edu.pe',
        'Pregrado',
        'secret11',
        'Estudiante de Ciberseguridad',
        NULL,
        'Mie-Vie 10-14',
        'Remoto',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        2,
        'A007',
        'Miguel',
        'Torres',
        'Silva',
        'miguel.torres@pucp.edu.pe',
        'Pregrado',
        'secret12',
        'Estudiante de Machine Learning',
        NULL,
        'Lun-Mie 13-17',
        'Híbrido',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        2,
        'A008',
        'Patricia',
        'Flores',
        'Campos',
        'patricia.flores@pucp.edu.pe',
        'Pregrado',
        'secret13',
        'Estudiante de Redes',
        NULL,
        'Mar-Jue 9-13',
        'Presencial',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        2,
        'A009',
        'Fernando',
        'Luna',
        'Ríos',
        'fernando.luna@pucp.edu.pe',
        'Pregrado',
        'secret14',
        'Estudiante de Software',
        NULL,
        'Lun-Vie 14-18',
        'Remoto',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        2,
        'A010',
        'Valeria',
        'Paz',
        'Guerra',
        'valeria.paz@pucp.edu.pe',
        'Pregrado',
        'secret15',
        'Estudiante de Bases de Datos',
        NULL,
        'Mie-Vie 9-13',
        'Híbrido',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        2,
        'A011',
        'Ricardo',
        'Mora',
        'Santos',
        'ricardo.mora@pucp.edu.pe',
        'Pregrado',
        'secret16',
        'Estudiante de IoT',
        NULL,
        'Lun-Jue 10-14',
        'Presencial',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        2,
        'A012',
        'Laura',
        'Vega',
        'Luna',
        'laura.vega@pucp.edu.pe',
        'Pregrado',
        'secret17',
        'Estudiante de Desarrollo Web',
        NULL,
        'Mar-Vie 13-17',
        'Remoto',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        2,
        'A013',
        'Gabriel',
        'Rojas',
        'Paredes',
        'gabriel.rojas@pucp.edu.pe',
        'Pregrado',
        'secret18',
        'Estudiante de Cloud Computing',
        NULL,
        'Lun-Mie 9-13',
        'Híbrido',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        2,
        'A014',
        'Diana',
        'Cruz',
        'Medina',
        'diana.cruz@pucp.edu.pe',
        'Pregrado',
        'secret19',
        'Estudiante de DevOps',
        NULL,
        'Mar-Jue 14-18',
        'Presencial',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        2,
        'A015',
        'Javier',
        'Paredes',
        'León',
        'javier.paredes@pucp.edu.pe',
        'Pregrado',
        'secret20',
        'Estudiante de IA',
        NULL,
        'Mie-Vie 10-14',
        'Remoto',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        2,
        'A016',
        'Marcela',
        'Santos',
        'Vargas',
        'marcela.santos@pucp.edu.pe',
        'Pregrado',
        'secret21',
        'Estudiante de Blockchain',
        NULL,
        'Lun-Jue 13-17',
        'Híbrido',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        2,
        'A017',
        'Hugo',
        'Reyes',
        'Mendoza',
        'hugo.reyes@pucp.edu.pe',
        'Pregrado',
        'secret22',
        'Estudiante de Data Science',
        NULL,
        'Mar-Vie 9-13',
        'Presencial',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        2,
        'A018',
        'Carolina',
        'Castro',
        'Ruiz',
        'carolina.castro@pucp.edu.pe',
        'Pregrado',
        'secret23',
        'Estudiante de Sistemas Distribuidos',
        NULL,
        'Lun-Mie 14-18',
        'Remoto',
        TRUE,
        NOW(),
        NOW()
    );

-- Asignar todos los nuevos estudiantes a la carrera de Ingeniería Informática (carrera_id = 1)

-- Profesores reales
INSERT INTO
    usuario (
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
        tipo_dedicacion_id,
        activo,
        fecha_creacion,
        fecha_modificacion
    )
VALUES (
        1,
        'P090',
        'Edwin Rafael',
        'Villanueva',
        'Talavera',
        'e.villanueva00@pucp.edu.pe',
        'Doctorado',
        'edwinpass',
        'Profesor de Inteligencia Artificial',
        NULL,
        'Mar-Vie 10-13',
        'Presencial',
        1,
        TRUE,
        NOW(),
        NOW()
    ),
    (
        1,
        'P091',
        'César Armando',
        'Beltrán',
        'Castañón',
        'c.beltran00@pucp.edu.pe',
        'Maestría',
        'cesarpass',
        'Profesor de Machine Learning',
        NULL,
        'Lun-Mié 8-11',
        'Presencial',
        1,
        TRUE,
        NOW(),
        NOW()
    );

INSERT INTO
    usuario (
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
        tipo_dedicacion_id,
        activo,
        fecha_creacion,
        fecha_modificacion
    )
VALUES (
        1,
        'P092',
        'Luis Fernando',
        'Muroya',
        'Tokushima',
        'l.muroya00@pucp.edu.pe',
        'Doctorado',
        'luispass',
        'Profesor de Procesamiento de Lenguaje Natural',
        NULL,
        'Mar-Vie 10-13',
        'Presencial',
        1,
        TRUE,
        NOW(),
        NOW()
    ),
    (
        1,
        'P093',
        'Héctor Erasmo',
        'Gómez',
        'Montoya',
        'h.gomez00@pucp.edu.pe',
        'Maestría',
        'hectorpass',
        'Profesor de Procesamiento de Lenguaje Natural',
        NULL,
        'Lun-Mié 8-11',
        'Presencial',
        1,
        TRUE,
        NOW(),
        NOW()
    ),
    (
        1,
        'P094',
        'Manuel Francisco',
        'Tupia',
        'Anticona',
        'm.tupia00@pucp.edu.pe',
        'Doctorado',
        'manuelpass',
        'Profesor de Gobierno y gestión de TI',
        NULL,
        'Mar-Vie 10-13',
        'Presencial',
        1,
        TRUE,
        NOW(),
        NOW()
    ),
    (
        1,
        'P095',
        'Eder Ramiro',
        'Quispe',
        'Vilchez',
        'e.quispe00@pucp.edu.pe',
        'Maestría',
        'ederpass',
        'Profesor de Experiencia de Usuario',
        NULL,
        'Lun-Mié 8-11',
        'Presencial',
        1,
        TRUE,
        NOW(),
        NOW()
    ),
    (
        1,
        'P096',
        'Layla',
        'Hirsh',
        'Martinez',
        'l.hirsh00@pucp.edu.pe',
        'Doctorado',
        'laylapass',
        'Profesora de Inteligencia Artificial',
        NULL,
        'Mar-Vie 10-13',
        'Presencial',
        1,
        TRUE,
        NOW(),
        NOW()
    ),
    (
        1,
        'P097',
        'Rony',
        'Cueva',
        'Moscoso',
        'r.cueva00@pucp.edu.pe',
        'Maestría',
        'ronypass',
        'Profesor de Algoritmia',
        NULL,
        'Lun-Mié 8-11',
        'Presencial',
        1,
        TRUE,
        NOW(),
        NOW()
    );

--Profesores adicionales todos informatica
INSERT INTO
    usuario (
        tipo_usuario_id,
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
        activo,
        fecha_creacion,
        fecha_modificacion
    )
VALUES (
        (
            SELECT tipo_usuario_id
            FROM tipo_usuario
            WHERE
                LOWER(nombre) = 'profesor'
            LIMIT 1
        ),
        'PROF001',
        'Julio',
        'Ramírez',
        'Lozano',
        'julio.ramirez@pucp.edu.pe',
        'Maestría',
        'hashed_password_1',
        'Docente con experiencia en ingeniería de software y arquitectura empresarial.',
        'Lunes-Viernes 08:00-12:00',
        'presencial',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        (
            SELECT tipo_usuario_id
            FROM tipo_usuario
            WHERE
                LOWER(nombre) = 'profesor'
            LIMIT 1
        ),
        'PROF002',
        'Elena',
        'Torres',
        'Mendoza',
        'elena.torres@pucp.edu.pe',
        'Doctorado',
        'hashed_password_2',
        'Investigadora en inteligencia artificial con publicaciones en aprendizaje automático.',
        'Martes-Jueves 10:00-14:00',
        'presencial',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        (
            SELECT tipo_usuario_id
            FROM tipo_usuario
            WHERE
                LOWER(nombre) = 'profesor'
            LIMIT 1
        ),
        'PROF003',
        'Ricardo',
        'Salas',
        'Gutiérrez',
        'ricardo.salas@pucp.edu.pe',
        'Maestría',
        'hashed_password_3',
        'Especialista en redes y ciberseguridad, con 10 años de experiencia docente.',
        'Lunes-Miércoles 13:00-17:00',
        'presencial',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        (
            SELECT tipo_usuario_id
            FROM tipo_usuario
            WHERE
                LOWER(nombre) = 'profesor'
            LIMIT 1
        ),
        'PROF004',
        'Carla',
        'Reyes',
        'Fernández',
        'carla.reyes@pucp.edu.pe',
        'Doctorado',
        'hashed_password_4',
        'Profesora enfocada en bases de datos y minería de datos en entornos empresariales.',
        'Martes-Viernes 09:00-13:00',
        'presencial',
        TRUE,
        NOW(),
        NOW()
    );
-- 2) Relación usuario_carrera (cada usuario con su carrera)
INSERT INTO
    usuario_carrera (
        usuario_id,
        carrera_id,
        activo,
        fecha_creacion,
        fecha_modificacion
    )
VALUES
    -- Juan Pérez enseña en Ingeniería Mecánica (carrera_id = 3)
    (1, 3, TRUE, NOW(), NOW()),
    -- María Gómez estudia Ingeniería Informática (carrera_id = 1)
    (2, 1, TRUE, NOW(), NOW()),
    -- Luis Ramírez coordina Ingeniería Informática (carrera_id = 1)
    (3, 1, TRUE, NOW(), NOW()),
    -- Carla Vega administra Ingeniería Industrial (carrera_id = 4)
    (4, 4, TRUE, NOW(), NOW()),
    -- Ana Martínez enseña en Ingeniería Informática (carrera_id = 1)
    (5, 1, TRUE, NOW(), NOW()),
    -- Carlos Sánchez enseña en Ingeniería Informática (carrera_id = 1)
    (6, 1, TRUE, NOW(), NOW()),
    -- Diego Fernández estudia Ingeniería Informática (carrera_id = 1)
    (7, 1, TRUE, NOW(), NOW()),
    -- Sofía Lima estudia Ingeniería Informática (carrera_id = 1)
    (8, 1, TRUE, NOW(), NOW());

INSERT INTO
    usuario_carrera (
        usuario_id,
        carrera_id,
        activo,
        fecha_creacion,
        fecha_modificacion
    )
SELECT u.usuario_id, 1, TRUE, NOW(), NOW()
FROM usuario u
WHERE
    u.codigo_pucp IN (
        'P092',
        'P093',
        'P094',
        'P095',
        'P096',
        'P097'
    );

UPDATE usuario
SET
    tipo_dedicacion_id = 1
WHERE
    tipo_usuario_id = 1;

UPDATE usuario
SET
    tipo_dedicacion_id = 1
WHERE
    tipo_usuario_id = 3;

-- 3) Relación usuario_grupo_investigacion (asignar a todos al Grupo IA PUCP, id = 1)
INSERT INTO
    usuario_grupo_investigacion (
        usuario_id,
        grupo_investigacion_id,
        activo,
        fecha_creacion,
        fecha_modificacion
    )
VALUES (1, 1, TRUE, NOW(), NOW()),
    (2, 1, TRUE, NOW(), NOW()),
    (3, 1, TRUE, NOW(), NOW()),
    (4, 1, TRUE, NOW(), NOW());

SELECT * FROM unidad_academica;

SELECT * FROM rol;

SELECT * FROM tipo_usuario;

SELECT * FROM estado_tema;

SELECT * FROM usuario;

-- Relacion Etapa formativa x ciclo

INSERT INTO
    etapa_formativa (
        nombre,
        creditaje_por_tema,
        duracion_exposicion,
        activo,
        fecha_creacion,
        fecha_modificacion,
        carrera_id
    )
VALUES (
        'Proyecto de fin de carrera 1',
        4.5,
        INTERVAL '20 minutes',
        TRUE,
        NOW(),
        NOW(),
        1
    ),
    (
        'Proyecto de fin de carrera 2',
        4.0,
        INTERVAL '20 minutes',
        TRUE,
        NOW(),
        NOW(),
        1
    );

INSERT INTO
    sala_exposicion (
        sala_exposicion_id,
        nombre,
        activo,
        tipo_sala_exposicion,
        fecha_creacion,
        fecha_modificacion
    )
VALUES
    -- Salas presenciales
    (
        1,
        'V201',
        TRUE,
        'presencial',
        NOW(),
        NOW()
    ),
    (
        2,
        'V202',
        TRUE,
        'presencial',
        NOW(),
        NOW()
    ),
    (
        3,
        'V203',
        TRUE,
        'presencial',
        NOW(),
        NOW()
    ),
    (
        4,
        'V204',
        TRUE,
        'presencial',
        NOW(),
        NOW()
    ),
    -- Salas virtuales
    (
        5,
        'SALA VIRTUAL 001',
        TRUE,
        'virtual',
        NOW(),
        NOW()
    ),
    (
        6,
        'SALA VIRTUAL 002',
        TRUE,
        'virtual',
        NOW(),
        NOW()
    ),
    (
        7,
        'SALA VIRTUAL 003',
        TRUE,
        'virtual',
        NOW(),
        NOW()
    );

INSERT INTO
    etapa_formativa_x_sala_exposicion (
        etapa_formativa_id,
        sala_exposicion_id,
        activo,
        fecha_creacion,
        fecha_modificacion
    )
VALUES (1, 1, TRUE, NOW(), NOW()),
    (1, 2, TRUE, NOW(), NOW()),
    (1, 3, TRUE, NOW(), NOW()),
    (1, 5, TRUE, NOW(), NOW()),
    (2, 1, TRUE, NOW(), NOW()),
    (2, 2, TRUE, NOW(), NOW()),
    (2, 6, TRUE, NOW(), NOW()),
    (2, 7, TRUE, NOW(), NOW());

INSERT INTO
    ciclo (
        semestre,
        anio,
        fecha_inicio,
        fecha_fin,
        activo,
        fecha_creacion,
        fecha_modificacion
    )
VALUES (
        '1',
        2025,
        '2025-03-21',
        '2025-07-15',
        TRUE,
        NOW(),
        NOW()
    );

INSERT INTO
    etapa_formativa_x_ciclo (
        etapa_formativa_id,
        ciclo_id,
        estado,
        activo,
        fecha_creacion,
        fecha_modificacion
    )
VALUES (
        1,
        1,
        'En Curso',
        TRUE,
        NOW(),
        NOW()
    );

-- Entregables //AHÍ YA COMIENZA LA DUDA

INSERT INTO
    entregable (
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
VALUES (
        1,
        'Informe de avance 1',
        'Primer entregable con criterios básicos.',
        '2025-05-10 08:00:00+00',
        '2025-05-20 23:59:00+00',
        'no_iniciado',
        TRUE,
        3,
        'pdf,docx',
        10,
        TRUE
    ),
    (
        1,
        'Presentación final',
        'Entrega de presentación en PowerPoint o PDF.',
        '2025-06-01 08:00:00+00',
        '2025-06-15 23:59:00+00',
        'no_iniciado',
        FALSE,
        1,
        'pdf,pptx',
        15,
        TRUE
    ),
    (
        1,
        'Anexos del proyecto',
        'Material adicional del proyecto: códigos, gráficos, etc.',
        '2025-05-15 08:00:00+00',
        '2025-05-30 23:59:00+00',
        'no_iniciado',
        TRUE,
        5,
        'pdf,zip,rar',
        25,
        TRUE
    );

-- Exposiciones

INSERT INTO
    estado_planificacion (
        nombre,
        activo,
        fecha_creacion,
        fecha_modificacion
    )
VALUES (
        'Sin planificar',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'Planificacion inicial',
        TRUE,
        NOW(),
        NOW()
    ),
    ('Fase 1', TRUE, NOW(), NOW()),
    ('Fase 2', TRUE, NOW(), NOW()),
    (
        'Cierre de planificacion',
        TRUE,
        NOW(),
        NOW()
    );

INSERT INTO
    exposicion (
        etapa_formativa_x_ciclo_id,
        estado_planificacion_id,
        activo,
        nombre,
        descripcion,
        fecha_creacion
    )
VALUES (
        1,
        1,
        TRUE,
        'Exposicion parcial',
        'Exposicion parcial del proyecto',
        NOW()
    ),
    (
        1,
        1,
        TRUE,
        'Exposicion final',
        'Exposicion final del proyecto',
        NOW()
    );

INSERT INTO
    criterio_exposicion (
        exposicion_id,
        nombre,
        descripcion,
        nota_maxima,
        activo,
        fecha_creacion
    )
VALUES (
        1,
        'Entonacion',
        'El alumno tiene una correcta entonacion durante toda la exposicion',
        3.5,
        TRUE,
        NOW()
    );

INSERT INTO
    jornada_exposicion (
        exposicion_id,
        datetime_inicio,
        datetime_fin,
        activo,
        fecha_creacion,
        fecha_modificacion
    )
VALUES (
        1,
        '2025-05-12 17:00:00',
        '2025-05-12 20:00:00',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        1,
        '2025-05-14 17:00:00',
        '2025-05-14 20:00:00',
        TRUE,
        NOW(),
        NOW()
    );

INSERT INTO
    jornada_exposicion_x_sala_exposicion (
        jornada_exposicion_id,
        sala_exposicion_id,
        activo,
        fecha_creacion,
        fecha_modificacion
    )
VALUES (1, 1, TRUE, NOW(), NOW()),
    (1, 2, TRUE, NOW(), NOW()),
    (1, 3, TRUE, NOW(), NOW()),
    (1, 4, TRUE, NOW(), NOW());

-- Parametros de configuración

WITH
    nuevo_parametro AS (
        INSERT INTO
            parametro_configuracion (
                nombre,
                descripcion,
                modulo_id,
                activo,
                fecha_creacion,
                fecha_modificacion,
                tipo
            )
        VALUES (
                'antiplagio',
                'Configure la opcion de revision antiplagio',
                4,
                TRUE,
                NOW(),
                NOW(),
                'booleano'
            )
        RETURNING
            parametro_configuracion_id
    )
INSERT INTO
    carrera_parametro_configuracion (
        carrera_id,
        parametro_configuracion_id,
        valor,
        activo,
        fecha_creacion,
        fecha_modificacion,
        etapa_formativa_id
    )
SELECT
    1,
    parametro_configuracion_id,
    'false',
    TRUE,
    NOW(),
    NOW(),
    1
FROM nuevo_parametro;

WITH
    nuevo_parametro AS (
        INSERT INTO
            parametro_configuracion (
                nombre,
                descripcion,
                modulo_id,
                activo,
                fecha_creacion,
                fecha_modificacion,
                tipo
            )
        VALUES (
                'turnitin',
                'Configure la opcion de revision turnitin',
                4,
                TRUE,
                NOW(),
                NOW(),
                'booleano'
            )
        RETURNING
            parametro_configuracion_id
    )
INSERT INTO
    carrera_parametro_configuracion (
        carrera_id,
        parametro_configuracion_id,
        valor,
        activo,
        fecha_creacion,
        fecha_modificacion,
        etapa_formativa_id
    )
SELECT
    1,
    parametro_configuracion_id,
    'false',
    TRUE,
    NOW(),
    NOW(),
    1
FROM nuevo_parametro;

WITH
    nuevo_parametro AS (
        INSERT INTO
            parametro_configuracion (
                nombre,
                descripcion,
                modulo_id,
                activo,
                fecha_creacion,
                fecha_modificacion,
                tipo
            )
        VALUES (
                'modalidad_delimitacion_tema',
                'Define delimitación de tema de tesis',
                1,
                TRUE,
                NOW(),
                NOW(),
                'string'
            )
        RETURNING
            parametro_configuracion_id
    )
INSERT INTO
    carrera_parametro_configuracion (
        carrera_id,
        parametro_configuracion_id,
        valor,
        activo,
        fecha_creacion,
        fecha_modificacion,
        etapa_formativa_id
    )
SELECT
    1,
    parametro_configuracion_id,
    'propuesta',
    TRUE,
    NOW(),
    NOW(),
    1
FROM nuevo_parametro;

WITH
    nuevo_parametro AS (
        INSERT INTO
            parametro_configuracion (
                nombre,
                descripcion,
                modulo_id,
                activo,
                fecha_creacion,
                fecha_modificacion,
                tipo
            )
        VALUES (
                'fecha_limite_asesor',
                'Establece la fecha máxima para cambios de asesor',
                2,
                TRUE,
                NOW(),
                NOW(),
                'date'
            )
        RETURNING
            parametro_configuracion_id
    )
INSERT INTO
    carrera_parametro_configuracion (
        carrera_id,
        parametro_configuracion_id,
        valor,
        activo,
        fecha_creacion,
        fecha_modificacion,
        etapa_formativa_id
    )
SELECT
    1,
    parametro_configuracion_id,
    '2025-06-30T00:00:00Z',
    TRUE,
    NOW(),
    NOW(),
    1
FROM nuevo_parametro;

-- Limite de tesistas por asesor
WITH nuevo_parametro AS (
    INSERT INTO parametro_configuracion (
        nombre,
        descripcion,
        modulo_id,
        activo,
        fecha_creacion,
        fecha_modificacion,
        tipo
    ) VALUES (
        'LimXasesor',
        'Numero de limites por asesor',
        2,
        TRUE,
        NOW(),
        NOW(),
        'integer'
    )
    RETURNING parametro_configuracion_id
)
INSERT INTO carrera_parametro_configuracion (
    carrera_id,
    parametro_configuracion_id,
    valor,
    activo,
    fecha_creacion,
    fecha_modificacion,
    etapa_formativa_id
)
SELECT
    1,
    parametro_configuracion_id,
    3,
    TRUE,
    NOW(),
    NOW(),
    1
FROM nuevo_parametro;

--Switch para activar el limite de asesores
WITH nuevo_parametro AS (
    INSERT INTO parametro_configuracion (
        nombre,
        descripcion,
        modulo_id,
        activo,
        fecha_creacion,
        fecha_modificacion,
        tipo
    ) VALUES (
        'ActivarLimiteAsesor',
        'Configure la opcion de editar el numero de tesistas por asesor',
        2,
        TRUE,
        NOW(),
        NOW(),
        'booleano'
    )
    RETURNING parametro_configuracion_id
)
INSERT INTO carrera_parametro_configuracion (
    carrera_id,
    parametro_configuracion_id,
    valor,
    activo,
    fecha_creacion,
    fecha_modificacion,
    etapa_formativa_id
)
SELECT
    1,
    parametro_configuracion_id,
    true,
    TRUE,
    NOW(),
    NOW(),
    1
FROM nuevo_parametro;

-- Tiempo limite para revisar
WITH nuevo_parametro AS (
    INSERT INTO parametro_configuracion (
        nombre,
        descripcion,
        modulo_id,
        activo,
        fecha_creacion,
        fecha_modificacion,
        tipo
    ) VALUES (
        'TiempoLimiteRevisar',
        'Configure la opcion de editar el tiempo limite (dias) para revisar el avance',
        2,
        TRUE,
        NOW(),
        NOW(),
        'integer'
    )
    RETURNING parametro_configuracion_id
)
INSERT INTO carrera_parametro_configuracion (
    carrera_id,
    parametro_configuracion_id,
    valor,
    activo,
    fecha_creacion,
    fecha_modificacion,
    etapa_formativa_id
)
SELECT
    1,
    parametro_configuracion_id,
    5,
    TRUE,
    NOW(),
    NOW(),
    1
FROM nuevo_parametro;

-- Cantidad tesis en simultaneo asignadas a un jurado
WITH nuevo_parametro AS (
    INSERT INTO parametro_configuracion (
        nombre,
        descripcion,
        modulo_id,
        activo,
        fecha_creacion,
        fecha_modificacion,
        tipo
    ) VALUES (
        'CantidadTesisXJurado',
        'Configure el numero maximo de tesis que puede tener asignadas un jurado de forma simultanea',
        3,
        TRUE,
        NOW(),
        NOW(),
        'integer'
    )
    RETURNING parametro_configuracion_id
)
INSERT INTO carrera_parametro_configuracion (
    carrera_id,
    parametro_configuracion_id,
    valor,
    activo,
    fecha_creacion,
    fecha_modificacion,
    etapa_formativa_id
)
SELECT
    1,
    parametro_configuracion_id,
    4,
    TRUE,
    NOW(),
    NOW(),
    1
FROM nuevo_parametro;


-----------------------------------------

/* NUEVOS */

INSERT INTO
    tema (
        titulo,
        resumen,
        metodologia,
        objetivos,
        portafolio_url,
        estado_tema_id,
        proyecto_id,
        carrera_id,
        fecha_limite,
        fecha_finalizacion,
        activo,
        fecha_creacion,
        fecha_modificacion
    )
VALUES (
        'Inteligencia Artificial Aplicada',
        'Exploración de aplicaciones de IA en distintos campos como la medicina y la logística.',
        'Investigación de campo y análisis de caso.',
        'Estudiar aplicaciones de IA en entornos reales y su impacto.',
        'https://www.example.com/ai-aplicada',
        3,
        NULL,
        1,
        '2024-12-01 00:00:00+00',
        NULL,
        TRUE,
        '2025-05-08 21:24:41+00',
        '2025-05-08 21:24:41+00'
    ),
    (
        'Machine Learning para Datos No Estructurados',
        'Uso de algoritmos de ML para datos no estructurados como imágenes y texto.',
        'Clustering y análisis de patrones.',
        'Aplicar técnicas de aprendizaje automático a datos no estructurados.',
        'https://www.example.com/ml-no-estructurados',
        3,
        NULL,
        1,
        '2024-12-15 00:00:00+00',
        NULL,
        TRUE,
        '2025-05-08 21:24:41+00',
        '2025-05-08 21:24:41+00'
    ),
    (
        'Redes Neuronales Profundas',
        'Estudio de redes neuronales profundas y su uso en la clasificación de datos complejos.',
        'Capacitación en redes neuronales y aprendizaje profundo.',
        'Explorar arquitecturas avanzadas de redes neuronales para clasificación de datos.',
        'https://www.example.com/redes-neuronales',
        3,
        NULL,
        1,
        '2024-12-10 00:00:00+00',
        NULL,
        TRUE,
        '2025-05-08 21:24:41+00',
        '2025-05-08 21:24:41+00'
    ),
    (
        'Big Data y Análisis Predictivo',
        'Aplicación de técnicas de big data para realizar predicciones de comportamiento en grandes volúmenes de datos.',
        'Análisis exploratorio y técnicas predictivas.',
        'Utilizar Big Data para predecir tendencias en diversos sectores.',
        'https://www.example.com/bigdata-predictivo',
        3,
        NULL,
        1,
        '2024-12-20 00:00:00+00',
        NULL,
        TRUE,
        '2025-05-08 21:24:41+00',
        '2025-05-08 21:24:41+00'
    ),
    (
        'Automatización en la Industria 4.0',
        'Exploración de sistemas automatizados y su integración en la industria moderna.',
        'Simulación y análisis de sistemas automatizados.',
        'Implementar soluciones de automatización en procesos industriales.',
        'https://www.example.com/industria-4-0',
        3,
        NULL,
        1,
        '2024-12-05 00:00:00+00',
        NULL,
        TRUE,
        '2025-05-08 21:24:41+00',
        '2025-05-08 21:24:41+00'
    ),
    (
        'Blockchain y su Aplicación en Logística',
        'Estudio del uso de blockchain para mejorar la trazabilidad en cadenas de suministro.',
        'Investigación y análisis de caso de blockchain.',
        'Explorar cómo blockchain puede mejorar la seguridad y transparencia en la logística.',
        'https://www.example.com/blockchain-logistica',
        3,
        NULL,
        1,
        '2024-12-12 00:00:00+00',
        NULL,
        TRUE,
        '2025-05-08 21:24:41+00',
        '2025-05-08 21:24:41+00'
    ),
    (
        'Ciberseguridad en la Era Digital',
        'Estudio de las amenazas digitales actuales y las mejores prácticas de ciberseguridad.',
        'Estudio de vulnerabilidades y técnicas de defensa.',
        'Mejorar las habilidades de ciberseguridad en un entorno digital cambiante.',
        'https://www.example.com/ciberseguridad-digital',
        3,
        NULL,
        1,
        '2024-12-18 00:00:00+00',
        NULL,
        TRUE,
        '2025-05-08 21:24:41+00',
        '2025-05-08 21:24:41+00'
    ),
    (
        'Desarrollo de Software Ágil',
        'Implementación de metodologías ágiles en el desarrollo de software.',
        'Técnicas de desarrollo ágil y Scrum.',
        'Optimizar el ciclo de desarrollo de software mediante metodologías ágiles.',
        'https://www.example.com/software-agil',
        3,
        NULL,
        1,
        '2024-12-25 00:00:00+00',
        NULL,
        TRUE,
        '2025-05-08 21:24:41+00',
        '2025-05-08 21:24:41+00'
    ),
    (
        'Internet de las Cosas (IoT)',
        'Exploración de dispositivos conectados y su impacto en la vida cotidiana.',
        'Análisis de datos y conectividad.',
        'Investigar cómo IoT transforma industrias y hogares.',
        'https://www.example.com/iot',
        3,
        NULL,
        1,
        '2024-12-30 00:00:00+00',
        NULL,
        TRUE,
        '2025-05-08 21:24:41+00',
        '2025-05-08 21:24:41+00'
    ),
    (
        'Tecnologías Emergentes en Medicina',
        'Exploración de nuevas tecnologías como la IA y la robótica en el ámbito médico.',
        'Investigación sobre aplicaciones tecnológicas en el sector salud.',
        'Estudiar cómo las tecnologías emergentes pueden transformar el sector médico.',
        'https://www.example.com/tecnologias-medicina',
        3,
        NULL,
        1,
        '2025-01-05 00:00:00+00',
        NULL,
        TRUE,
        '2025-05-08 21:24:41+00',
        '2025-05-08 21:24:41+00'
    ),
    (
        'Detección de depresión en estudiantes de Ingeniería Electrónica: Un caso de estudio',
        'Este tema propone aplicar técnicas de visión por computadora para detectar informáticos deprimidos.',
        NULL,
        NULL,
        'https://miuniversidad.edu/repos/tema003',
        3,
        NULL,
        1,
        '2025-05-10 10:00:00+00',
        NULL,
        TRUE,
        '2025-05-01 10:00:00+00',
        '2025-05-01 10:00:00+00'
    ),
    (
        'Machine Learning para Datos No Estructurados',
        'Uso de algoritmos de ML para datos no estructurados como imágenes y texto.',
        'Clustering y análisis de patrones.',
        'Aplicar técnicas de aprendizaje automático a datos no estructurados.',
        'https://www.example.com/ml-no-estructurados',
        3,
        NULL,
        1,
        '2024-12-15 00:00:00+00',
        NULL,
        TRUE,
        '2025-05-08 21:24:41+00',
        '2025-05-08 21:24:41+00'
    ),
    (
        'Redes Neuronales Profundas',
        'Estudio de redes neuronales profundas y su uso en la clasificación de datos complejos.',
        'Capacitación en redes neuronales y aprendizaje profundo.',
        'Explorar arquitecturas avanzadas de redes neuronales para clasificación de datos.',
        'https://www.example.com/redes-neuronales',
        3,
        NULL,
        1,
        '2024-12-10 00:00:00+00',
        NULL,
        TRUE,
        '2025-05-08 21:24:41+00',
        '2025-05-08 21:24:41+00'
    ),
    (
        'Big Data y Análisis Predictivo',
        'Aplicación de técnicas de big data para realizar predicciones de comportamiento en grandes volúmenes de datos.',
        'Análisis exploratorio y técnicas predictivas.',
        'Utilizar Big Data para predecir tendencias en diversos sectores.',
        'https://www.example.com/bigdata-predictivo',
        3,
        NULL,
        1,
        '2024-12-20 00:00:00+00',
        NULL,
        TRUE,
        '2025-05-08 21:24:41+00',
        '2025-05-08 21:24:41+00'
    ),
    (
        'Automatización en la Industria 4.0',
        'Exploración de sistemas automatizados y su integración en la industria moderna.',
        'Simulación y análisis de sistemas automatizados.',
        'Implementar soluciones de automatización en procesos industriales.',
        'https://www.example.com/industria-4-0',
        3,
        NULL,
        1,
        '2024-12-05 00:00:00+00',
        NULL,
        TRUE,
        '2025-05-08 21:24:41+00',
        '2025-05-08 21:24:41+00'
    ),
    (
        'Blockchain y su Aplicación en Logística',
        'Estudio del uso de blockchain para mejorar la trazabilidad en cadenas de suministro.',
        'Investigación y análisis de caso de blockchain.',
        'Explorar cómo blockchain puede mejorar la seguridad y transparencia en la logística.',
        'https://www.example.com/blockchain-logistica',
        3,
        NULL,
        1,
        '2024-12-12 00:00:00+00',
        NULL,
        TRUE,
        '2025-05-08 21:24:41+00',
        '2025-05-08 21:24:41+00'
    ),
    (
        'Ciberseguridad en la Era Digital',
        'Estudio de las amenazas digitales actuales y las mejores prácticas de ciberseguridad.',
        'Estudio de vulnerabilidades y técnicas de defensa.',
        'Mejorar las habilidades de ciberseguridad en un entorno digital cambiante.',
        'https://www.example.com/ciberseguridad-digital',
        3,
        NULL,
        1,
        '2024-12-18 00:00:00+00',
        NULL,
        TRUE,
        '2025-05-08 21:24:41+00',
        '2025-05-08 21:24:41+00'
    ),
    (
        'Desarrollo de Software Ágil',
        'Implementación de metodologías ágiles en el desarrollo de software.',
        'Técnicas de desarrollo ágil y Scrum.',
        'Optimizar el ciclo de desarrollo de software mediante metodologías ágiles.',
        'https://www.example.com/software-agil',
        3,
        NULL,
        1,
        '2024-12-25 00:00:00+00',
        NULL,
        TRUE,
        '2025-05-08 21:24:41+00',
        '2025-05-08 21:24:41+00'
    ),
    (
        'Internet de las Cosas (IoT)',
        'Exploración de dispositivos conectados y su impacto en la vida cotidiana.',
        'Análisis de datos y conectividad.',
        'Investigar cómo IoT transforma industrias y hogares.',
        'https://www.example.com/iot',
        3,
        NULL,
        1,
        '2024-12-30 00:00:00+00',
        NULL,
        TRUE,
        '2025-05-08 21:24:41+00',
        '2025-05-08 21:24:41+00'
    ),
    (
        'Tecnologías Emergentes en Medicina',
        'Exploración de nuevas tecnologías como la IA y la robótica en el ámbito médico.',
        'Investigación sobre aplicaciones tecnológicas en el sector salud.',
        'Estudiar cómo las tecnologías emergentes pueden transformar el sector médico.',
        'https://www.example.com/tecnologias-medicina',
        3,
        NULL,
        1,
        '2025-01-05 00:00:00+00',
        NULL,
        TRUE,
        '2025-05-08 21:24:41+00',
        '2025-05-08 21:24:41+00'
    ),
    (
        'Detección de depresión en estudiantes de Ingeniería Electrónica: Un caso de estudio',
        'Este tema propone aplicar técnicas de visión por computadora para detectar informáticos deprimidos.',
        NULL,
        NULL,
        'https://miuniversidad.edu/repos/tema003',
        3,
        NULL,
        1,
        '2025-05-10 10:00:00+00',
        NULL,
        TRUE,
        '2025-05-01 10:00:00+00',
        '2025-05-01 10:00:00+00'
    );

INSERT INTO
    etapa_formativa_x_ciclo_x_tema (
        etapa_formativa_x_ciclo_id,
        tema_id,
        aprobado,
        fecha_modificacion
    )
VALUES (1, 2, TRUE, NOW()),
    (1, 3, TRUE, NOW()),
    (1, 4, TRUE, NOW());

-- Agregamos areas de conocimiento
insert into
    usuario_area_conocimiento (
        usuario_id,
        area_conocimiento_id,
        activo,
        fecha_creacion,
        fecha_modificacion
    ) (
        select
            usuario_id,
            area_conocimiento_id,
            true,
            now(),
            now()
        from usuario
            join area_conocimiento on area_conocimiento.nombre = 'ciberseguridad'
        where
            codigo_pucp in ('P003', 'PROF001', 'PROF003')
        union
        select
            usuario_id,
            area_conocimiento_id,
            true,
            now(),
            now()
        from usuario
            join area_conocimiento on area_conocimiento.nombre = 'sistemas de información'
        where
            codigo_pucp in ('P002', 'PROF001', 'PROF004')
        union
        select
            usuario_id,
            area_conocimiento_id,
            true,
            now(),
            now()
        from usuario
            join area_conocimiento on area_conocimiento.nombre = 'ciencias de la computación'
        where
            codigo_pucp in ('PROF002', 'PROF004')
    );

-- Agregamos sub areas de conocimiento

INSERT INTO
    usuario_sub_area_conocimiento (
        usuario_id,
        sub_area_conocimiento_id,
        activo
    )
VALUES (6, 11, true);

INSERT INTO
    usuario_sub_area_conocimiento (
        usuario_id,
        sub_area_conocimiento_id,
        activo
    )
VALUES (6, 12, true);

INSERT INTO
    usuario_sub_area_conocimiento (
        usuario_id,
        sub_area_conocimiento_id,
        activo
    )
VALUES (6, 14, true);

INSERT INTO
    usuario_sub_area_conocimiento (
        usuario_id,
        sub_area_conocimiento_id,
        activo
    )
VALUES (9, 7, true);

INSERT INTO
    usuario_sub_area_conocimiento (
        usuario_id,
        sub_area_conocimiento_id,
        activo
    )
VALUES (9, 6, true);

INSERT INTO
    usuario_sub_area_conocimiento (
        usuario_id,
        sub_area_conocimiento_id,
        activo
    )
VALUES (9, 14, true);

INSERT INTO
    usuario_sub_area_conocimiento (
        usuario_id,
        sub_area_conocimiento_id,
        activo
    )
VALUES (9, 15, true);

INSERT INTO
    usuario_sub_area_conocimiento (
        usuario_id,
        sub_area_conocimiento_id,
        activo
    )
VALUES (9, 11, true);

INSERT INTO
    usuario_sub_area_conocimiento (
        usuario_id,
        sub_area_conocimiento_id,
        activo
    )
VALUES (10, 5, true);

INSERT INTO
    usuario_sub_area_conocimiento (
        usuario_id,
        sub_area_conocimiento_id,
        activo
    )
VALUES (10, 4, true);

INSERT INTO
    usuario_sub_area_conocimiento (
        usuario_id,
        sub_area_conocimiento_id,
        activo
    )
VALUES (11, 11, true);

INSERT INTO
    usuario_sub_area_conocimiento (
        usuario_id,
        sub_area_conocimiento_id,
        activo
    )
VALUES (11, 14, true);

INSERT INTO
    usuario_sub_area_conocimiento (
        usuario_id,
        sub_area_conocimiento_id,
        activo
    )
VALUES (12, 1, true);

INSERT INTO
    usuario_sub_area_conocimiento (
        usuario_id,
        sub_area_conocimiento_id,
        activo
    )
VALUES (12, 3, true);

INSERT INTO
    usuario_sub_area_conocimiento (
        usuario_id,
        sub_area_conocimiento_id,
        activo
    )
VALUES (12, 6, true);

INSERT INTO
    usuario_sub_area_conocimiento (
        usuario_id,
        sub_area_conocimiento_id,
        activo
    )
VALUES (12, 10, true);

INSERT INTO
    usuario_sub_area_conocimiento (
        usuario_id,
        sub_area_conocimiento_id,
        activo
    )
VALUES (12, 7, true);

-- Agregamos rol de asesor a los profesores
insert into
    usuario_rol (
        usuario_id,
        rol_id,
        activo,
        fecha_creacion,
        fecha_modificacion
    ) (
        select usuario.usuario_id, rol.rol_id, TRUE, now(), now()
        from
            usuario
            inner join tipo_usuario on tipo_usuario.tipo_usuario_id = usuario.tipo_usuario_id
            inner join usuario_carrera on usuario_carrera.usuario_id = usuario.usuario_id
            join rol on rol.nombre = 'Asesor'
        where
            tipo_usuario.nombre like 'profesor'
            and usuario_carrera.carrera_id = 1
    );

-- Parametros para asesores
INSERT INTO
    parametro_configuracion (
        parametro_configuracion_id,
        activo,
        descripcion,
        fecha_creacion,
        fecha_modificacion,
        nombre,
        tipo,
        modulo_id
    )
VALUES (
        12,
        true,
        'Numero de limites por asesor',
        NOW(),
        NOW(),
        'LimXasesor',
        'integer',
        1
    );

INSERT INTO
    carrera_parametro_configuracion (
        carrera_parametro_configuracion_id,
        activo,
        fecha_creacion,
        fecha_modificacion,
        valor,
        carrera_id,
        parametro_configuracion_id,
        etapa_formativa_id
    )
VALUES (
        11,
        true,
        NOW(),
        NOW(),
        '8',
        1,
        12,
        1
    );

-- Asignar temas a los estudiantes A004-A008
INSERT INTO
    usuario_tema (usuario_id, tema_id, rol_id)
SELECT
    u.usuario_id,
    CASE u.codigo_pucp
        WHEN 'A004' THEN 3 -- Tema: Machine Learning para Datos No Estructurados
        WHEN 'A005' THEN 4 -- Tema: Redes Neuronales Profundas
        WHEN 'A006' THEN 5 -- Tema: Big Data y Análisis Predictivo
        WHEN 'A007' THEN 6 -- Tema: Automatización en la Industria 4.0
        WHEN 'A008' THEN 7 -- Tema: Blockchain y su Aplicación en Logística
    END as tema_id,
    4 as rol_id -- Rol de Tesista
FROM usuario u
WHERE
    u.codigo_pucp IN (
        'A004',
        'A005',
        'A006',
        'A007',
        'A008'
    );

INSERT INTO
    usuario (
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
    -- Nuevo usuario Paolo Ore
    (
        2,                                 -- tipo_usuario_id = Alumno
        'A004',                            -- código PUCP
        'Paolo',                           -- nombres
        'Ore',                             -- primer_apellido
        'Ventura',                         -- segundo_apellido
        'ore.paolo@pucp.edu.pe',           -- correo_electronico
        'Pregrado',                        -- nivel_estudios
        'secretPaolo123',                  -- contrasena (en texto plano como en el ejemplo)
        'Estudiante de Comunicaciones.',   -- biografia
        NULL,                              -- foto_perfil
        'Lun-Vie 10-18',                   -- disponibilidad
        'Remoto',                          -- tipo_disponibilidad
        TRUE,                              -- activo
        NOW(),                             -- fecha_creacion
        NOW()                              -- fecha_modificacion
    );

--select * from usuario

INSERT INTO usuario_tema (
    usuario_id,
    tema_id,
    rol_id
)
SELECT
    u.usuario_id,
    CASE u.codigo_pucp
        WHEN 'A004' THEN 3 -- Tema: Machine Learning para Datos No Estructurados
        WHEN 'A005' THEN 4 -- Tema: Redes Neuronales Profundas
        WHEN 'A006' THEN 5 -- Tema: Big Data y Análisis Predictivo
        WHEN 'A007' THEN 6 -- Tema: Automatización en la Industria 4.0
        WHEN 'A008' THEN 7 -- Tema: Blockchain y su Aplicación en Logística
    END AS tema_id,
    2 AS rol_id           -- rol de Tesista
FROM usuario u
WHERE u.nombres = 'Paolo' and primer_apellido='Ore';

--tema_id obtenido es 3
--select * from usuario_tema
--DELETE FROM entregable_x_tema;

INSERT INTO entregable_x_tema (entregable_id, tema_id, estado, fecha_envio)
VALUES (1, 3, DEFAULT, DATE '2025-03-01'); -- Estado por defecto: 'no_enviado'

-- Registro 2 (entregable_id = 2)
INSERT INTO entregable_x_tema (entregable_id, tema_id, estado, fecha_envio)
VALUES (2, 3, 'enviado_a_tiempo', DATE '2025-02-01');

-- Registro 3 (entregable_id = 3)
INSERT INTO entregable_x_tema (entregable_id, tema_id, estado, fecha_envio)
VALUES (3, 3, 'enviado_tarde',  DATE '2025-01-01');


--INSERT INTO entregable_x_tema (entregable_id, tema_id, estado, fecha_envio)
--VALUES (3, 3, 'enviado_a_tiempo',  DATE '2025-05-01');

--INSERT INTO entregable_x_tema (entregable_id, tema_id, estado, fecha_envio)
--VALUES (3, 3, DEFAULT,  DATE '2025-06-01');

--select * from entregable_x_tema

--select * from entregable

INSERT INTO criterio_entregable (
    entregable_id,
    nombre,
    nota_maxima,
    descripcion
) VALUES
    (1, 'Claridad en la redacción', 20.00, 'Se evalúa la claridad, coherencia y cohesión del contenido entregado.'),
    (2, 'Cumplimiento de requisitos', 20.00, 'Se verifica que el entregable cumpla con todos los requisitos solicitados.'),
	(3, 'Originalidad del contenido', 20.00, 'Se evalúa la capacidad de presentar ideas propias y enfoques creativos en el entregable.'),
	(1, 'Presentación visual', 20.00, 'Se evalúa el formato, uso adecuado de gráficos, y presentación ordenada del entregable.'),
    (2, 'Análisis crítico', 20.00, 'Se mide la capacidad para interpretar y argumentar los resultados con pensamiento crítico.');


--select * from criterio_entregable

INSERT INTO revision_criterio_entregable (
    entregable_x_tema_id,
    criterio_entregable_id,
    usuario_id,
    nota,
    observacion
) VALUES
    (1, 1, 36, 17.00, NULL),
    (2, 2, 36, 10.00, NULL),
	(3, 3, 36, 19.00, NULL);


INSERT INTO parametro_configuracion (
    nombre,
    descripcion,
    modulo_id,
    activo,
    fecha_creacion,
    fecha_modificacion,
    tipo
) VALUES (
    'Cantidad Jurados',
    'cantidad maxima de jurados por tesis',
    1,
    true,
    NOW(),       -- Fecha de creación actual
    NOW(),        -- Fecha de modificación actual
    'integer'
);


INSERT INTO carrera_parametro_configuracion (
    carrera_id,
    parametro_configuracion_id,
    valor,
    activo,
    fecha_creacion,
    fecha_modificacion,
    etapa_formativa_id
) VALUES (
    1,  -- ID de la carrera
    (
        SELECT parametro_configuracion_id
        FROM parametro_configuracion
        WHERE nombre = 'Cantidad Jurados'
        LIMIT 1
    ),
    3,      -- Valor de la configuración
    true,   -- Estado activo
    NOW(),  -- Fecha de creación
    NOW(),  -- Fecha de modificación
    1       -- ID de etapa formativa
);


------------------------------------------------------------------------------------------------------


INSERT INTO parametro_configuracion (
    nombre,
    descripcion,
    modulo_id,
    activo,
    fecha_creacion,
    fecha_modificacion,
    tipo
) VALUES (
    'Tiempo Limite Jurado',
    'Tiempo limite para que jurado revise entregables',
    1,
    true,
    NOW(),       -- Fecha de creación actual
    NOW(),        -- Fecha de modificación actual
    'integer'
);

INSERT INTO carrera_parametro_configuracion (
    carrera_id,
    parametro_configuracion_id,
    valor,
    activo,
    fecha_creacion,
    fecha_modificacion,
    etapa_formativa_id
) VALUES (
    1,                            -- ID de la carrera asociada (ejemplo: 1)
    (
        SELECT parametro_configuracion_id
        FROM parametro_configuracion
        WHERE nombre = 'Tiempo Limite Jurado'
        LIMIT 1
    ),                            -- ID del parametro_configuracion asociado (ejemplo: 1)
    15,                            -- Valor de la configuración
    true,                         -- Estado activo
    NOW(),                        -- Fecha de creación actual
    NOW(),                         -- Fecha de modificación actual
    1
);

