------------------------------------
--|   OPERACIÓN: EXPOSICIONES    |--
------------------------------------

INSERT INTO exposicion(etapa_formativa_x_ciclo_id,
                       estado_planificacion_id,
                       activo,
                       nombre,
                       descripcion,
                       fecha_creacion)
    VALUES (1, 5, TRUE, 'Exposicion parcial', 'Exposicion parcial del proyecto', NOW()),
           (1, 1, TRUE, 'Exposicion final', 'Exposicion final del proyecto', NOW());


INSERT INTO criterio_exposicion(exposicion_id,
                                nombre,
                                descripcion,
                                nota_maxima,
                                activo,
                                fecha_creacion)
    VALUES (1, 'Entonación', 'El alumno tiene una correcta entonación durante toda la exposición', 3.0, TRUE, NOW()),
           (1, 'Dominio del tema', 'Demuestra conocimiento profundo y comprensión del tema presentado', 4.0, TRUE, NOW()),
           (1, 'Material de apoyo', 'Las diapositivas y recursos visuales son claros y apoyan efectivamente la presentación', 3.0, TRUE, NOW()),
           (1, 'Organización', 'La presentación sigue una estructura lógica y coherente', 3.0, TRUE, NOW()),
           (1, 'Tiempo', 'Se ajusta al tiempo asignado para la presentación', 2.0, TRUE, NOW()),
           (1, 'Respuesta a preguntas', 'Responde las preguntas del jurado de manera clara y precisa', 5.0, TRUE, NOW());

-----------------------------------
--|   OPERACIÓN: ENTREGABLES    |--
-----------------------------------

INSERT INTO entregable (etapa_formativa_x_ciclo_id,
                        nombre,
                        descripcion,
                        fecha_inicio,
                        fecha_fin,
                        estado,
                        es_evaluable,
                        maximo_documentos,
                        extensiones_permitidas,
                        peso_maximo_documento,
                        activo)
    VALUES (1, 'Informe de avance 1', 'Primer entregable con criterios básicos.', '2025-05-10 08:00:00+00', '2025-05-20 23:59:00+00', 'terminado', TRUE, 3, 'pdf,docx', 10, TRUE),
           (1, 'Presentación final', 'Entrega de presentación en PowerPoint o PDF.', '2025-06-01 08:00:00+00', '2025-06-15 23:59:00+00', 'no_iniciado', FALSE, 1, 'pdf,pptx', 15, TRUE),
           (1, 'Anexos del proyecto', 'Material adicional del proyecto: códigos, gráficos, etc.', '2025-05-15 08:00:00+00', '2025-05-30 23:59:00+00', 'no_iniciado', TRUE, 5, 'pdf,zip,rar', 25, TRUE);


INSERT INTO criterio_entregable (entregable_id,
                                 nombre,
                                 nota_maxima,
                                 descripcion)
    VALUES (1, 'Originalidad del contenido', 4.00, 'Se evalúa la capacidad de presentar ideas propias y enfoques creativos en el entregable.'),
           (1, 'Claridad y coherencia en la redacción', 5.00, 'Se evalúa la claridad, coherencia y cohesión del contenido entregado.'),
           (1, 'Cumplimiento de requisitos', 6.00, 'Se verifica que el entregable cumpla con todos los requisitos solicitados.'),
           (1, 'Presentación del contenido', 2.00, 'Se evalúa el formato, uso adecuado de gráficos, y presentación ordenada del entregable.'),
           (1, 'Análisis crítico', 3.00, 'Se mide la capacidad para interpretar y argumentar los resultados con pensamiento crítico.'),

           (2, 'Originalidad del contenido', 4.00, 'Se evalúa la capacidad de presentar ideas propias y enfoques creativos en el entregable.'),
           (2, 'Claridad y coherencia en la redacción', 5.00, 'Se evalúa la claridad, coherencia y cohesión del contenido entregado.'),
           (2, 'Cumplimiento de requisitos', 6.00, 'Se verifica que el entregable cumpla con todos los requisitos solicitados.'),
           (2, 'Presentación del contenido', 2.00, 'Se evalúa el formato, uso adecuado de gráficos, y presentación ordenada del entregable.'),
           (2, 'Análisis crítico', 3.00, 'Se mide la capacidad para interpretar y argumentar los resultados con pensamiento crítico.');

--(3, 'Amplitud del contenido', 4.00, 'Se evalúa la profundidad y amplitud del contenido presentado en el entregable.'),
--(3, 'Claridad y coherencia en la redacción', 5.00, 'Se evalúa la claridad, coherencia y cohesión del contenido entregado.'),
--(3, 'Cumplimiento de requisitos', 6.00, 'Se verifica que el entregable cumpla con todos los requisitos solicitados.'),
--(3, 'Presentación del contenido', 2.00, 'Se evalúa el formato, uso adecuado de gráficos, y presentación ordenada del entregable.'),
--(3, 'Análisis crítico', 3.00, 'Se mide la capacidad para interpretar y argumentar los resultados con pensamiento crítico.');


--------------------------------------
--|     USUARIOS PARTICIPANTES     |--
--------------------------------------

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
        -- Nuevos alumnos
        (2, 'ALU0001', 'María', 'Gómez', 'Torres', 'maria.gomez@pucp.edu.pe', 'Pregrado', 'secret2', 'Estudiante de sistemas', NULL, 'Mar-Jue 14-18', 'Híbrido', TRUE, NOW(), NOW()),
        (2, 'ALU0002', 'Diego', 'Fernández', 'García', 'diego.fernandez@pucp.edu.pe', 'Pregrado', 'secret7', 'Estudiante de IA', NULL, 'Lun-Vie 14-18', 'Híbrido', TRUE, NOW(), NOW()),
        (2, 'ALU0003', 'Sofía', 'Lima', 'Huertas', 'sofia.lima@pucp.edu.pe', 'Pregrado', 'secret8', 'Estudiante de Data Science', NULL, 'Mar-Jue 10-12', 'Remoto', TRUE, NOW(), NOW()),
        (2, 'ALU0004', 'Andrea', 'Muñoz', 'Castro', 'andrea.munoz@pucp.edu.pe', 'Pregrado', 'secret9', 'Estudiante de Ciencias de la Computación', NULL, 'Lun-Vie 9-13', 'Híbrido', TRUE, NOW(), NOW()),
        (2, 'ALU0005', 'Roberto', 'Vargas', 'Mendoza', 'roberto.vargas@pucp.edu.pe', 'Pregrado', 'secret10', 'Estudiante de Sistemas', NULL, 'Mar-Jue 14-18', 'Presencial', TRUE, NOW(), NOW()),
        (2, 'ALU0006', 'Carmen', 'Ruiz', 'Palacios', 'carmen.ruiz@pucp.edu.pe', 'Pregrado', 'secret11', 'Estudiante de Ciberseguridad', NULL, 'Mie-Vie 10-14', 'Remoto', TRUE, NOW(), NOW()),
        (2, 'ALU0007', 'Miguel', 'Torres', 'Silva', 'miguel.torres@pucp.edu.pe', 'Pregrado', 'secret12', 'Estudiante de Machine Learning', NULL, 'Lun-Mie 13-17', 'Híbrido', TRUE, NOW(), NOW()),
        (2, 'ALU0008', 'Patricia', 'Flores', 'Campos', 'patricia.flores@pucp.edu.pe', 'Pregrado', 'secret13', 'Estudiante de Redes', NULL, 'Mar-Jue 9-13', 'Presencial', TRUE, NOW(), NOW()),
        (2, 'ALU0009', 'Fernando', 'Luna', 'Ríos', 'fernando.luna@pucp.edu.pe', 'Pregrado', 'secret14', 'Estudiante de Software', NULL, 'Lun-Vie 14-18', 'Remoto', TRUE, NOW(), NOW()),
        (2, 'ALU0010', 'Valeria', 'Paz', 'Guerra', 'valeria.paz@pucp.edu.pe', 'Pregrado', 'secret15', 'Estudiante de Bases de Datos', NULL, 'Mie-Vie 9-13', 'Híbrido', TRUE, NOW(), NOW()),
        (2, 'ALU0011', 'Ricardo', 'Mora', 'Santos', 'ricardo.mora@pucp.edu.pe', 'Pregrado', 'secret16', 'Estudiante de IoT', NULL, 'Lun-Jue 10-14', 'Presencial', TRUE, NOW(), NOW()),
        (2, 'ALU0012', 'Laura', 'Vega', 'Luna', 'laura.vega@pucp.edu.pe', 'Pregrado', 'secret17', 'Estudiante de Desarrollo Web', NULL, 'Mar-Vie 13-17', 'Remoto', TRUE, NOW(), NOW()),
        (2, 'ALU0013', 'Gabriel', 'Rojas', 'Paredes', 'gabriel.rojas@pucp.edu.pe', 'Pregrado', 'secret18', 'Estudiante de Cloud Computing', NULL, 'Lun-Mie 9-13', 'Híbrido', TRUE, NOW(), NOW()),
        (2, 'ALU0014', 'Diana', 'Cruz', 'Medina', 'diana.cruz@pucp.edu.pe', 'Pregrado', 'secret19', 'Estudiante de DevOps', NULL, 'Mar-Jue 14-18', 'Presencial', TRUE, NOW(), NOW()),
        (2, 'ALU0015', 'Javier', 'Paredes', 'León', 'javier.paredes@pucp.edu.pe', 'Pregrado', 'secret20', 'Estudiante de IA', NULL, 'Mie-Vie 10-14', 'Remoto', TRUE, NOW(), NOW()),
        (2, 'ALU0016', 'Marcela', 'Santos', 'Vargas', 'marcela.santos@pucp.edu.pe', 'Pregrado', 'secret21', 'Estudiante de Blockchain', NULL, 'Lun-Jue 13-17', 'Híbrido', TRUE, NOW(), NOW()),
        (2, 'ALU0017', 'Hugo', 'Reyes', 'Mendoza', 'hugo.reyes@pucp.edu.pe', 'Pregrado', 'secret22', 'Estudiante de Data Science', NULL, 'Mar-Vie 9-13', 'Presencial', TRUE, NOW(), NOW()),
        (2, 'ALU0018', 'Carolina', 'Castro', 'Ruiz', 'carolina.castro@pucp.edu.pe', 'Pregrado', 'secret23', 'Estudiante de Sistemas Distribuidos', NULL, 'Lun-Mie 14-18', 'Remoto', TRUE, NOW(), NOW()),
        (2, 'ALU0019', 'Paolo', 'Ore', 'Ventura', 'ore.paolo@pucp.edu.pe', 'Pregrado', 'secretPaolo123', 'Estudiante de Comunicaciones.', NULL, 'Lun-Vie 10-18', 'Remoto', TRUE, NOW(), NOW());

--asignar carrera 1

INSERT INTO usuario_carrera (usuario_id,
                             carrera_id,
                             activo,
                             fecha_creacion,
                             fecha_modificacion)
SELECT u.usuario_id,
       1,
       TRUE,
       NOW(),
       NOW()
    FROM usuario u
    WHERE u.codigo_pucp IN (
                            'ALU0001', 'ALU0002', 'ALU0003', 'ALU0004', 'ALU0005',
                            'ALU0006', 'ALU0007', 'ALU0008', 'ALU0009', 'ALU0010',
                            'ALU0011', 'ALU0012', 'ALU0013', 'ALU0014', 'ALU0015',
                            'ALU0016', 'ALU0017', 'ALU0018', 'ALU0019'
        );

--------------------------------------
--|       TEMAS PARTICIPANTES      |--
--------------------------------------

INSERT INTO tema (codigo,
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
                  fecha_modificacion)
    VALUES ('TEMA-001', 'Inteligencia Artificial Aplicada', 'Exploración de aplicaciones de IA en distintos campos como la medicina y la logística.', 'Investigación de campo y análisis de caso.', 'Estudiar aplicaciones de IA en entornos reales y su impacto.', 'https://www.example.com/ai-aplicada', 6, NULL, 1, '2024-12-01 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           ('TEMA-002', 'Machine Learning para Datos No Estructurados', 'Uso de algoritmos de ML para datos no estructurados como imágenes y texto.', 'Clustering y análisis de patrones.', 'Aplicar técnicas de aprendizaje automático a datos no estructurados.', 'https://www.example.com/ml-no-estructurados', 6, NULL, 1, '2024-12-15 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           ('TEMA-003', 'Redes Neuronales Profundas', 'Estudio de redes neuronales profundas y su uso en la clasificación de datos complejos.', 'Capacitación en redes neuronales y aprendizaje profundo.', 'Explorar arquitecturas avanzadas de redes neuronales para clasificación de datos.', 'https://www.example.com/redes-neuronales', 6, NULL, 1, '2024-12-10 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           ('TEMA-004', 'Big Data y Análisis Predictivo', 'Aplicación de técnicas de big data para realizar predicciones de comportamiento en grandes volúmenes de datos.', 'Análisis exploratorio y técnicas predictivas.', 'Utilizar Big Data para predecir tendencias en diversos sectores.', 'https://www.example.com/bigdata-predictivo', 6, NULL, 1, '2024-12-20 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           ('TEMA-005', 'Automatización en la Industria 4.0', 'Exploración de sistemas automatizados y su integración en la industria moderna.', 'Simulación y análisis de sistemas automatizados.', 'Implementar soluciones de automatización en procesos industriales.', 'https://www.example.com/industria-4-0', 6, NULL, 1, '2024-12-05 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           ('TEMA-006', 'Blockchain y su Aplicación en Logística', 'Estudio del uso de blockchain para mejorar la trazabilidad en cadenas de suministro.', 'Investigación y análisis de caso de blockchain.', 'Explorar cómo blockchain puede mejorar la seguridad y transparencia en la logística.', 'https://www.example.com/blockchain-logistica', 6, NULL, 1, '2024-12-12 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           ('TEMA-007', 'Ciberseguridad en la Era Digital', 'Estudio de las amenazas digitales actuales y las mejores prácticas de ciberseguridad.', 'Estudio de vulnerabilidades y técnicas de defensa.', 'Mejorar las habilidades de ciberseguridad en un entorno digital cambiante.', 'https://www.example.com/ciberseguridad-digital', 6, NULL, 1, '2024-12-18 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           ('TEMA-008', 'Desarrollo de Software Ágil', 'Implementación de metodologías ágiles en el desarrollo de software.', 'Técnicas de desarrollo ágil y Scrum.', 'Optimizar el ciclo de desarrollo de software mediante metodologías ágiles.', 'https://www.example.com/software-agil', 6, NULL, 1, '2024-12-25 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           ('TEMA-009', 'Internet de las Cosas (IoT)', 'Exploración de dispositivos conectados y su impacto en la vida cotidiana.', 'Análisis de datos y conectividad.', 'Investigar cómo IoT transforma industrias y hogares.', 'https://www.example.com/iot', 6, NULL, 1, '2024-12-30 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           ('TEMA-010', 'Tecnologías Emergentes en Medicina', 'Exploración de nuevas tecnologías como la IA y la robótica en el ámbito médico.', 'Investigación sobre aplicaciones tecnológicas en el sector salud.', 'Estudiar cómo las tecnologías emergentes pueden transformar el sector médico.', 'https://www.example.com/tecnologias-medicina', 6, NULL, 1, '2025-01-05 00:00:00.000000 +00:00', NULL, TRUE, '2025-05-08 21:24:41.930919 +00:00', '2025-05-08 21:24:41.930919 +00:00'),
           ('TEMA-011', 'Detección de depresión en estudiantes de Ingeniería Electrónica: Un caso de estudio', 'Este tema propone aplicar técnicas de visión por computadora para detectar informáticos deprimidos.', '', '', 'https://miuniversidad.edu/repos/tema003', 6, NULL, 1, '2025-05-10 10:00:00.000000 +00:00', NULL, TRUE, '2025-05-01 10:00:00.000000 +00:00', '2025-05-01 10:00:00.000000 +00:00');


--Historial

INSERT INTO historial_tema (tema_id,
                            titulo,
                            resumen,
                            descripcion_cambio,
                            estado_tema_id,
                            activo,
                            fecha_creacion,
                            fecha_modificacion)
    VALUES (6, 'Blockchain y su Aplicación en Logística - v1', 'Estudio del uso de blockchain para mejorar la trazabilidad en cadenas de suministro.', 'Propuesta inicial de tesis', 1, TRUE, NOW(), NOW()),
           (6, 'Blockchain y su Aplicación en Logística - v2', 'Estudio del uso de blockchain para mejorar la trazabilidad en cadenas de suministro.', 'Actualización del tema para estudiante de pregrado', 8, TRUE, NOW(), NOW()),
           (11, 'Detección de depresión en estudiantes de Ingeniería Electrónica: Un caso de estudio – v1', 'Propuesta inicial de tesis', 'Creación del tema para estudiante de pregrado', 1, TRUE, NOW(), NOW());

--Subareas

INSERT INTO sub_area_conocimiento_tema (tema_id, sub_area_conocimiento_id)
    VALUES (1, 1),
           (2, 5),
           (3, 2),
           (4, 5),
           (5, 8),
           (6, 13),
           (7, 12),
           (8, 9),
           (9, 8),
           (10, 3),
           (11, 2);

--Tesistas

INSERT INTO usuario_tema (usuario_id, tema_id, rol_id)
SELECT u.usuario_id,
       CASE u.codigo_pucp
           WHEN 'ALU0001' THEN 1 --ia aplicada
           WHEN 'ALU0002' THEN 2 --ml para datos
           WHEN 'ALU0003' THEN 3 --rn profundas
           WHEN 'ALU0004' THEN 4 --big data
           WHEN 'ALU0005' THEN 5 --automatizacion
           WHEN 'ALU0006' THEN 6 --blockchain
           WHEN 'ALU0007' THEN 7 --ciberseguridad
           WHEN 'ALU0008' THEN 8 --desarrollo agil
           WHEN 'ALU0009' THEN 9 --iot
           WHEN 'ALU0010' THEN 10 --tecnologias emergentes
           WHEN 'ALU0019' THEN 11 --deteccion de depresion
           END AS tema_id,
       4       AS rol_id -- Rol de Tesista
    FROM usuario u
    WHERE u.codigo_pucp IN
          ('ALU0001', 'ALU0002', 'ALU0003', 'ALU0004', 'ALU0005', 'ALU0006', 'ALU0007', 'ALU0008', 'ALU0009', 'ALU0010',
           'ALU0019');

--Asesores

INSERT INTO usuario_tema (usuario_id, tema_id, rol_id)
    VALUES (5, 1, 1),
           (5, 2, 1),
           (4, 3, 1),
           (7, 4, 1),
           (11, 5, 1),
           (3, 6, 1),
           (8, 7, 1),
           (9, 8, 1),
           (10, 9, 1),
           (3, 10, 1),
           (4, 11, 1);

--Jurados

INSERT INTO usuario_tema (usuario_id, tema_id, rol_id)
    VALUES (6, 1, 2),
           (11, 1, 2),

           (11, 2, 2),
           (10, 2, 2),

           (7, 3, 2),
           (10, 3, 2),

           (8, 4, 2),
           (3, 4, 2),

           (8, 5, 2),
           (1, 5, 2),

           (7, 6, 2),
           (9, 6, 2),

           (1, 7, 2),
           (3, 7, 2),

           (12, 8, 2),
           (5, 8, 2),

           (2, 9, 2),
           (6, 9, 2),

           (12, 10, 2),
           (9, 10, 2),

           (6, 11, 2),
           (5, 11, 2);

--RESTO DE TABLAS CRUZADAS




--solicitudes


INSERT INTO solicitud (descripcion,
                       tipo_solicitud_id,
                       tema_id,
                       estado) -- estado = 1 ("PENDIENTE"
    VALUES ('Solicitud de aprobación de tema de tesis', 1, 11, 2),
           ('Solicito acceso a la plataforma DRL', 1, 1, 1);


INSERT INTO usuario_solicitud (usuario_id,
                               solicitud_id,
                               solicitud_completada,
                               aprobado,
                               comentario,
                               destinatario,
                               activo,
                               fecha_creacion,
                               fecha_modificacion)
    VALUES (33, 1, TRUE, TRUE, 'Solicitud aprobada', FALSE, TRUE, NOW(), NOW()),
           (1, 2, FALSE, FALSE, 'En revisión', FALSE, TRUE, NOW(), NOW());


-- notificaciones

INSERT INTO notificacion (mensaje,
                          canal,
                          modulo_id,
                          tipo_notificacion_id,
                          usuario_id,
                          activo,
                          fecha_creacion,
                          fecha_modificacion)
    VALUES ('Bienvenido al sistema', 'Email', 1, 1, 1, TRUE, NOW(), NOW()),
           ('Tu tema de tesis está en revisión', 'Email', 2, 2, 33, TRUE, NOW(), NOW()),
           ('Tu proyecto fue aprobado', 'SMS', 2, 2, 1, TRUE, NOW(), NOW());


--reuniones

INSERT INTO reunion (titulo,
                     fecha_hora_inicio,
                     fecha_hora_fin,
                     descripcion,
                     disponible,
                     url,
                     fecha_creacion,
                     fecha_modificacion,
                     activo)
    VALUES ('Reunión de inducción', '2025-06-01 10:00:00', '2025-06-01 11:00:00', 'Reunión de bienvenida para nuevos estudiantes', 1, 'https://meet.example.com/reunion-induccion', NOW(), NOW(), TRUE),
           ('Primera reunion', '2025-06-10 16:00:00', '2025-06-10 17:00:00', 'Primera reunion', 1, 'presencial', NOW(), NOW(), TRUE),
           ('Segunda reunion', '2025-06-17 16:00:00', '2025-06-17 17:00:00', 'Segunda reunion', 2, 'presencial', NOW(), NOW(), TRUE);


INSERT INTO usuario_reunion (reunion_id,
                             usuario_id,
                             estado_asistencia,
                             estado_detalle,
                             fecha_creacion,
                             fecha_modificacion,
                             activo)
    VALUES (1, 5, 'Asistió', 'Asistió', NOW(), NOW(), TRUE),
           (1, 23, 'No asistió', 'No asistió', NOW(), NOW(), TRUE),
           (2, 4, 'Pendiente', 'Pendiente', NOW(), NOW(), TRUE),
           (2, 24, 'Pendiente', 'Pendiente', NOW(), NOW(), TRUE),
           (3, 7, 'Pendiente', 'Pendiente', NOW(), NOW(), TRUE),
           (3, 25, 'Pendiente', 'Pendiente', NOW(), NOW(), TRUE);

-- +++++++++++++++++++++++++++++++++++++++++++++++++++
-- ++NUEVOS INSERTS BLOQUE JORNADA JORNADAXSALA+++++++
-- +++++++++++++++++++++++++++++++++++++++++++++++++++

-- 20 minutos de duración de exposición por sala



-- expo parcial: exposiciones por tema: 1 al 11; bloques horario: 1 al 27
-- expo final: exposiciones por tema: 12 al 22; bloques horario: 28 al 54
