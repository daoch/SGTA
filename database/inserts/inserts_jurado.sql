INSERT INTO sub_area_conocimiento (area_conocimiento_id, nombre, descripcion)
VALUES
(1, 'Visión por computadora', 'Estudio de algoritmos para procesar e interpretar imágenes y videos'),
(1, 'Sistemas distribuidos', 'Diseño y análisis de sistemas que operan en múltiples nodos'),
(5, 'Criptografía aplicada', 'Uso de técnicas criptográficas para proteger datos e información'),
(5, 'Seguridad en redes', 'Protección de redes informáticas contra accesos no autorizados'),
(5, 'Análisis forense digital', 'Investigación y recuperación de datos en incidentes de seguridad');


INSERT INTO sub_area_conocimiento_tema (sub_area_conocimiento_id, tema_id)
VALUES
(1, 2),
(2, 2),
(7, 10),
(8, 10),
(9, 10);


INSERT INTO usuario (
    tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido,
    correo_electronico, nivel_estudios, contrasena, biografia,
    enlace_linkedin, enlace_repositorio, disponibilidad, tipo_disponibilidad
)
VALUES
(2, 'A006', 'Luis', 'García', 'Ramírez', 'luis.garcia@pucp.edu.pe', 'Pregrado', 'secret1', 'Estudiante de ingeniería informática', NULL, NULL, NULL, NULL),
(2, 'A002', 'María', 'Fernández', 'Soto', 'maria.fernandez@pucp.edu.pe', 'Pregrado', 'secret1', 'Estudiante de ciencia de datos', NULL, NULL, NULL, NULL),
(2, 'A003', 'Carlos', 'Vargas', 'Delgado', 'carlos.vargas@pucp.edu.pe', 'Pregrado', 'secret1', 'Estudiante de software e innovación', NULL, NULL, NULL, NULL),
(2, 'A004', 'Ana', 'Ríos', 'Salinas', 'ana.rios@pucp.edu.pe', 'Pregrado', 'secret1', 'Estudiante de tecnologías digitales', NULL, NULL, NULL, NULL),
(2, 'A005', 'Diego', 'Morales', 'Huerta', 'diego.morales@pucp.edu.pe', 'Pregrado', 'secret1', 'Estudiante de sistemas inteligentes', NULL, NULL, NULL, NULL);

INSERT INTO usuario_tema (usuario_id, tema_id, rol_id)
VALUES
(10, 10, 4),
(11, 10, 4),
(12, 2, 4),
(13, 2, 4);


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