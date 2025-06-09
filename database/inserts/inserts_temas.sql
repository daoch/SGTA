-- Tabla usuario
INSERT INTO usuario (usuario_id,codigo_pucp, id_cognito, nombres, primer_apellido, segundo_apellido,correo_electronico, tipo_usuario_id)
VALUES
(45,'20191203' ,'113b2550-7041-70f2-169a-a9846094d7ab', 'Cesar', 'Loli', 'Gonzalez','clolig@pucp.edu.pe', 2),
(46,'20202085' ,'212b05f0-f081-70a0-ff19-a1160d2fb842', 'Andrea', 'Acosta', 'Muñoz','c.acosta@pucp.edu.pe', 2),
(47, '20201122','c1ab0580-9021-70fc-0f79-c837dee6d9fb', 'Renzo', 'Iwamoto', 'Kanashiro','renzo.iwamoto@pucp.edu.pe', 1),
(48, '20141929','418b15c0-5081-704c-6627-20e0ea7f61ba', 'Luis', 'Mesajil', 'Mesajil','luis.mesajil@pucp.edu.pe', 1),
(49, '20201923','d16bd510-8061-705d-20e6-712e94e57482', 'Martha', 'Chavez', 'Cruz','a20201923@pucp.edu.pe', 1),
(50, '20193541','915bc5a0-0071-703c-e61a-a8276d386221', 'Jahir', 'Davila', 'Uribe','jahir.davila@pucp.edu.pe', 1);

-- Tabla usuario_carrera
INSERT INTO usuario_carrera (usuario_id, carrera_id, es_coordinador)
VALUES
(45, 1, false),
(46, 1, false),
(47, 1, false),
(48, 1, true),
(49, 1, false),
(50, 1, false);

-- Tabla usuario_area_conocimiento
INSERT INTO usuario_area_conocimiento (usuario_id, area_conocimiento_id)
VALUES
(47, 1),
(48, 1),
(49, 1),
(50, 1);

-- Tabla usuario_sub_area_conocimiento
INSERT INTO usuario_sub_area_conocimiento (usuario_id, sub_area_conocimiento_id)
VALUES
(47, 1),
(48, 1),
(49, 1),
(50, 1);
