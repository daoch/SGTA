INSERT INTO
    sub_area_conocimiento (
        area_conocimiento_id,
        nombre,
        descripcion
    )
VALUES (
        1,
        'Visión por computadora',
        'Estudio de algoritmos para procesar e interpretar imágenes y videos'
    ),
    (
        1,
        'Sistemas distribuidos',
        'Diseño y análisis de sistemas que operan en múltiples nodos'
    ),
    (
        5,
        'Criptografía aplicada',
        'Uso de técnicas criptográficas para proteger datos e información'
    ),
    (
        5,
        'Seguridad en redes',
        'Protección de redes informáticas contra accesos no autorizados'
    ),
    (
        5,
        'Análisis forense digital',
        'Investigación y recuperación de datos en incidentes de seguridad'
    );

INSERT INTO
    sub_area_conocimiento_tema (
        sub_area_conocimiento_id,
        tema_id
    )
VALUES (1, 2),
    (2, 2),
    (7, 10),
    (8, 10),
    (9, 10);

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
        enlace_linkedin,
        enlace_repositorio,
        disponibilidad,
        tipo_disponibilidad
    )
VALUES (
        2,
        'A006',
        'Luis',
        'García',
        'Ramírez',
        'luis.garcia@pucp.edu.pe',
        'Pregrado',
        'secret1',
        'Estudiante de ingeniería informática',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        2,
        'A002',
        'María',
        'Fernández',
        'Soto',
        'maria.fernandez@pucp.edu.pe',
        'Pregrado',
        'secret1',
        'Estudiante de ciencia de datos',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        2,
        'A003',
        'Carlos',
        'Vargas',
        'Delgado',
        'carlos.vargas@pucp.edu.pe',
        'Pregrado',
        'secret1',
        'Estudiante de software e innovación',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        2,
        'A004',
        'Ana',
        'Ríos',
        'Salinas',
        'ana.rios@pucp.edu.pe',
        'Pregrado',
        'secret1',
        'Estudiante de tecnologías digitales',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        2,
        'A005',
        'Diego',
        'Morales',
        'Huerta',
        'diego.morales@pucp.edu.pe',
        'Pregrado',
        'secret1',
        'Estudiante de sistemas inteligentes',
        NULL,
        NULL,
        NULL,
        NULL
    );

INSERT INTO
    usuario_tema (usuario_id, tema_id, rol_id)
VALUES (10, 10, 4),
    (11, 10, 4),
    (12, 2, 4),
    (13, 2, 4);

UPDATE sgta.usuario
SET
    tipo_dedicacion_id = 1
WHERE
    tipo_usuario_id = 1

UPDATE sgta.usuario
SET
    tipo_dedicacion_id = 1
WHERE
    tipo_usuario_id = 3

INSERT INTO
    etapa_formativa_x_ciclo_x_tema (
        etapa_formativa_x_ciclo_id,
        tema_id
    )
VALUES (1, 10);



-- +++++++++++++++++++++++++++++++++++++++++++++++++++
-- ++NUEVOS INSERTS BLOQUE JORNADA JORNADAXSALA+++++++
-- +++++++++++++++++++++++++++++++++++++++++++++++++++

INSERT INTO jornada_exposicion (exposicion_id,
                                datetime_inicio,
                                datetime_fin,
                                activo,
                                fecha_creacion,
                                fecha_modificacion)
    VALUES (1, '2025-05-12 17:00:00', '2025-05-12 20:00:00', TRUE, NOW(), NOW()),
           (1, '2025-05-14 17:00:00', '2025-05-14 20:00:00', TRUE, NOW(), NOW());


INSERT INTO jornada_exposicion_x_sala_exposicion (jornada_exposicion_id,
                                                  sala_exposicion_id,
                                                  activo,
                                                  fecha_creacion,
                                                  fecha_modificacion)
    VALUES (1, 1, TRUE, NOW(), NOW()),
           (1, 2, TRUE, NOW(), NOW()),
           (1, 3, TRUE, NOW(), NOW()),
           (2, 1, TRUE, NOW(), NOW()),
           (2, 2, TRUE, NOW(), NOW()),
           (2, 3, TRUE, NOW(), NOW());


-- 20 minutos de duración de exposición por sala

WITH RECURSIVE
    series AS (SELECT 0 AS n
               UNION ALL
               SELECT n + 1
                   FROM series
                   WHERE n < 8),
    parametros AS (SELECT jornada_exposicion_x_sala_id,
                          CASE
                              WHEN jornada_exposicion_x_sala_id <= 3
                                  THEN
                                  TIMESTAMP WITH TIME ZONE '2025-05-12 17:00:00' +
                                  (s.n * INTERVAL '20 minutes')
                              ELSE
                                  TIMESTAMP WITH TIME ZONE '2025-05-14 17:00:00' +
                                  (s.n * INTERVAL '20 minutes')
                              END AS hora_inicio
                       FROM (SELECT UNNEST(ARRAY [1,2,3,4,5,6]) AS jornada_exposicion_x_sala_id) j
                                CROSS JOIN series s),
    bloques AS (SELECT jornada_exposicion_x_sala_id,
                       hora_inicio,
                       hora_inicio + INTERVAL '20 minutes' AS hora_fin
                    FROM parametros)
INSERT
    INTO bloque_horario_exposicion (jornada_exposicion_x_sala_id,
                                    datetime_inicio,
                                    datetime_fin)
SELECT jornada_exposicion_x_sala_id,
       hora_inicio,
       hora_fin
    FROM bloques
    ORDER BY jornada_exposicion_x_sala_id, hora_inicio;


-- expo parcial: exposiciones por tema: 1 al 11; bloques horario: 1 al 27
-- expo final: exposiciones por tema: 12 al 22; bloques horario: 28 al 54

UPDATE bloque_horario_exposicion
SET exposicion_x_tema_id = CASE bloque_horario_exposicion_id
                               WHEN 1  THEN 1
                               WHEN 4  THEN 2
                               WHEN 7  THEN 3
                               WHEN 10 THEN 4
                               WHEN 13 THEN 5
                               WHEN 16 THEN 6
                               WHEN 19 THEN 7
                               WHEN 22 THEN 8
                               WHEN 24 THEN 9
                               WHEN 25 THEN 10
                               WHEN 27 THEN 11
                               ELSE exposicion_x_tema_id
    END
    WHERE bloque_horario_exposicion_id IN (1, 4, 7, 10, 13, 16, 19, 22, 24, 25, 27);

-- Actualizar control_exposicion_usuario 23-34 a aceptado
UPDATE control_exposicion_usuario
SET estado_exposicion_usuario = 'aceptado'
    WHERE control_exposicion_usuario_id IN (23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34);

-- Actualizar estado exposicion_x_tema a programada

UPDATE exposicion_x_tema
SET estado_exposicion = 'programada'
    WHERE exposicion_x_tema_id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);

UPDATE exposicion_x_tema
SET estado_exposicion = 'completada'
    WHERE exposicion_x_tema_id IN (4, 5, 6);


INSERT INTO revision_criterio_x_exposicion(exposicion_x_tema_id,
                                           criterio_exposicion_id,
                                           usuario_id,
                                           nota,
                                           revisado,
                                           observacion)
    VALUES (1, 1, 6, 3, TRUE, 'Excelente manejo de voz y ritmo durante la presentación'),
           (1, 2, 6, 4, TRUE, 'Demostró conocimiento profundo del tema y respondió todas las preguntas'),
           (1, 3, 6, 3, TRUE, 'Diapositivas bien estructuradas y apoyo visual apropiado'),
           (1, 4, 6, 3, TRUE, 'Presentación clara y bien organizada'),
           (1, 5, 6, 2, TRUE, 'Se ajustó perfectamente al tiempo asignado'),
           (1, 6, 6, 5, TRUE, 'Respondió todas las preguntas con seguridad y precisión'),

           (1, 1, 11, 2.5, TRUE, 'Debe mejorar el volumen de voz en algunas secciones'),
           (1, 2, 11, 3.5, TRUE, 'Buen manejo del tema pero puede profundizar más'),
           (1, 3, 11, 2.5, TRUE, 'Las diapositivas necesitan mejor diseño visual'),
           (1, 4, 11, 2.5, TRUE, 'La transición entre temas puede ser más fluida'),
           (1, 5, 11, 2.0, TRUE, 'Se excedió ligeramente del tiempo asignado'),
           (1, 6, 11, 4.0, TRUE, 'Buenas respuestas aunque algunas fueron algo imprecisas'),

           (2, 1, 10, 3.0, TRUE, 'Muy buena proyección de voz y entonación'),
           (2, 2, 10, 4.0, TRUE, 'Excelente dominio y comprensión del tema'),
           (2, 3, 10, 3.0, TRUE, 'Material visual de alta calidad y bien utilizado'),
           (2, 4, 10, 3.0, TRUE, 'Estructura lógica y coherente de la presentación'),
           (2, 5, 10, 2.0, TRUE, 'Excelente manejo del tiempo asignado'),
           (2, 6, 10, 5.0, TRUE, 'Respuestas completas y bien fundamentadas'),

           (2, 1, 11, 2.5, TRUE, 'Debe mejorar la claridad en la pronunciación'),
           (2, 2, 11, 3.5, TRUE, 'Conocimiento adecuado pero puede expandir conceptos'),
           (2, 3, 11, 2.5, TRUE, 'El material de apoyo necesita más ejemplos'),
           (2, 4, 11, 2.5, TRUE, 'Algunos temas necesitan mejor conexión'),
           (2, 5, 11, 0.5, TRUE, 'Se excedió considerablemente del tiempo'),
           (2, 6, 11, 4.0, TRUE, 'Respondió bien pero algunas respuestas fueron breves'),

           (3, 1, 7, 3.0, TRUE, 'Excelente modulación y claridad al hablar'),
           (3, 2, 7, 4.0, TRUE, 'Dominio excepcional del tema presentado'),
           (3, 3, 7, 3.0, TRUE, 'Presentación visual profesional y efectiva'),
           (3, 4, 7, 3.0, TRUE, 'Excelente organización y estructura'),
           (3, 5, 7, 2.0, TRUE, 'Control perfecto del tiempo asignado'),
           (3, 6, 7, 5.0, TRUE, 'Respuestas completas y bien argumentadas'),

           (3, 1, 10, 2.5, TRUE, 'Debe trabajar en mantener un tono más constante'),
           (3, 2, 10, 3.5, TRUE, 'Buen conocimiento pero puede mejorar ejemplos'),
           (3, 3, 10, 2.5, TRUE, 'Las diapositivas necesitan mejor organización'),
           (3, 4, 10, 2.5, TRUE, 'La secuencia de temas puede ser más clara'),
           (3, 5, 10, 1.0, TRUE, 'No logró cubrir todo el contenido en el tiempo'),
           (3, 6, 10, 4.0, TRUE, 'Buenas respuestas aunque algunas poco desarrolladas');

-- Modificar la nota final de la exposicion

UPDATE exposicion_x_tema
SET nota_final = (SELECT AVG(promedio_usuario)
                      FROM (SELECT usuario_id, SUM(nota) AS promedio_usuario
                                FROM revision_criterio_x_exposicion
                                WHERE exposicion_x_tema_id = exposicion_x_tema.exposicion_x_tema_id
                                GROUP BY usuario_id) promedios_por_usuario)
    WHERE exposicion_x_tema_id IN (1, 2, 3);

UPDATE exposicion_x_tema
SET estado_exposicion = 'calificada'
    WHERE exposicion_x_tema_id IN (1, 2, 3);