-- Archivo de datos de prueba para el entorno de desarrollo
-- Activa con spring.sql.init.mode=always y spring.profiles.active=dev

-- Verificar si ya existen los tipos de usuario
INSERT INTO tipo_usuario (nombre, activo, fecha_creacion)
SELECT 'estudiante', true, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tipo_usuario WHERE nombre = 'estudiante');

INSERT INTO tipo_usuario (nombre, activo, fecha_creacion)
SELECT 'profesor', true, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM tipo_usuario WHERE nombre = 'profesor');

-- Obtener IDs de los tipos de usuario
DO $$
DECLARE
    estudiante_id INTEGER;
    profesor_id INTEGER;
BEGIN
    SELECT tipo_usuario_id INTO estudiante_id FROM tipo_usuario WHERE nombre = 'estudiante';
    SELECT tipo_usuario_id INTO profesor_id FROM tipo_usuario WHERE nombre = 'profesor';

    -- Insertar usuarios si no existen
    -- Contraseña hasheada: $2a$10$yAQqGIGw7NEqX9.D6YlZeO7BQ2jcJUIP51fkGP4TK3OXL/HW5hHPq (equivalente a 'password')
    
    -- Estudiantes
    INSERT INTO usuario (tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido, 
                        correo_electronico, contrasena, activo, fecha_creacion)
    SELECT estudiante_id, '20180123', 'Carlos', 'Mendoza', 'López', 
           'carlos.mendoza@pucp.edu.pe', '$2a$10$yAQqGIGw7NEqX9.D6YlZeO7BQ2jcJUIP51fkGP4TK3OXL/HW5hHPq', true, CURRENT_TIMESTAMP
    WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE codigo_pucp = '20180123');
    
    INSERT INTO usuario (tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido, 
                        correo_electronico, contrasena, activo, fecha_creacion)
    SELECT estudiante_id, '20190456', 'Ana', 'García', 'Ríos', 
           'ana.garcia@pucp.edu.pe', '$2a$10$yAQqGIGw7NEqX9.D6YlZeO7BQ2jcJUIP51fkGP4TK3OXL/HW5hHPq', true, CURRENT_TIMESTAMP
    WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE codigo_pucp = '20190456');
    
    INSERT INTO usuario (tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido, 
                        correo_electronico, contrasena, activo, fecha_creacion)
    SELECT estudiante_id, '20180789', 'Luis', 'Rodríguez', 'Vega', 
           'luis.rodriguez@pucp.edu.pe', '$2a$10$yAQqGIGw7NEqX9.D6YlZeO7BQ2jcJUIP51fkGP4TK3OXL/HW5hHPq', true, CURRENT_TIMESTAMP
    WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE codigo_pucp = '20180789');
    
    -- Profesor
    INSERT INTO usuario (tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido, 
                        correo_electronico, contrasena, activo, fecha_creacion)
    SELECT profesor_id, '19950001', 'Mario', 'Santos', 'Pérez', 
           'mario.santos@pucp.edu.pe', '$2a$10$yAQqGIGw7NEqX9.D6YlZeO7BQ2jcJUIP51fkGP4TK3OXL/HW5hHPq', true, CURRENT_TIMESTAMP
    WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE codigo_pucp = '19950001');

END $$;

-- Crear estado de tema para poder crear temas
INSERT INTO estado_tema (nombre, descripcion, activo, fecha_creacion)
SELECT 'PROPUESTA', 'Tema en estado de propuesta', true, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM estado_tema WHERE nombre = 'PROPUESTA');

-- Obtener ID del estado de tema
DO $$
DECLARE
    v_estado_tema_id INTEGER;
BEGIN
    SELECT estado_tema_id INTO v_estado_tema_id FROM estado_tema WHERE nombre = 'PROPUESTA';

    -- Insertar temas solo si la tabla está vacía
    IF (SELECT COUNT(*) FROM tema) = 0 THEN
        -- Insertar temas si la tabla está vacía
        INSERT INTO tema (titulo, codigo, resumen, estado_tema_id, activo, fecha_creacion)
        VALUES ('Implementación de algoritmos de aprendizaje profundo para detección de objetos en tiempo real', 
               'TEMA-001', 
               'Resumen del tema de implementación de algoritmos de aprendizaje profundo', 
               v_estado_tema_id, 
               true, 
               CURRENT_TIMESTAMP);
        
        INSERT INTO tema (titulo, codigo, resumen, estado_tema_id, activo, fecha_creacion)
        VALUES ('Desarrollo de un sistema de monitoreo de calidad del aire utilizando IoT', 
               'TEMA-002', 
               'Resumen del tema de desarrollo de un sistema de monitoreo de calidad del aire', 
               v_estado_tema_id, 
               true, 
               CURRENT_TIMESTAMP);
        
        INSERT INTO tema (titulo, codigo, resumen, estado_tema_id, activo, fecha_creacion)
        VALUES ('Análisis comparativo de frameworks de desarrollo web para aplicaciones de alta concurrencia', 
               'TEMA-003', 
               'Resumen del tema de análisis comparativo de frameworks de desarrollo web', 
               v_estado_tema_id, 
               true, 
               CURRENT_TIMESTAMP);
    END IF;

    -- Resetear la secuencia después de insertar los temas
    PERFORM setval(pg_get_serial_sequence('tema', 'tema_id'), COALESCE((SELECT MAX(tema_id) FROM tema), 1), true);
END $$;

-- Insertar documentos y versiones para cada tema
DO $$
DECLARE
    doc_id INTEGER;
    version_id INTEGER;
    profesor_id INTEGER;
    tema1_id INTEGER;
    tema2_id INTEGER;
    tema3_id INTEGER;
BEGIN
    -- Obtener IDs necesarios
    SELECT usuario_id INTO profesor_id FROM usuario WHERE codigo_pucp = '19950001';
    SELECT tema_id INTO tema1_id FROM tema WHERE codigo = 'TEMA-001';
    SELECT tema_id INTO tema2_id FROM tema WHERE codigo = 'TEMA-002';
    SELECT tema_id INTO tema3_id FROM tema WHERE codigo = 'TEMA-003';
    
    -- Primer documento y su versión
    INSERT INTO documento (nombre_documento, fecha_subida, ultima_version, activo, fecha_creacion)
    SELECT 'Documento del tema 1', CURRENT_DATE - INTERVAL '15 days', 1, true, CURRENT_TIMESTAMP
    WHERE NOT EXISTS (SELECT 1 FROM documento WHERE nombre_documento = 'Documento del tema 1')
    RETURNING documento_id INTO doc_id;
    
    IF doc_id IS NOT NULL THEN
        INSERT INTO version_documento (documento_id, fecha_ultima_subida, numero_version, link_archivo_subido, activo, fecha_creacion)
        VALUES (doc_id, CURRENT_TIMESTAMP - INTERVAL '15 days', 1, 'https://example.com/doc1.pdf', true, CURRENT_TIMESTAMP)
        RETURNING version_documento_id INTO version_id;
        
        INSERT INTO revision_documento (usuario_id, version_documento_id, fecha_limite_revision, fecha_revision, 
                                      estado_revision, link_archivo_revision, activo, fecha_creacion)
        VALUES (profesor_id, version_id, CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE, 
               'completada', 'https://example.com/rev1.pdf', true, CURRENT_TIMESTAMP - INTERVAL '10 days');
    END IF;
    
    -- Segundo documento y su versión
    INSERT INTO documento (nombre_documento, fecha_subida, ultima_version, activo, fecha_creacion)
    SELECT 'Documento del tema 2', CURRENT_DATE - INTERVAL '15 days', 1, true, CURRENT_TIMESTAMP
    WHERE NOT EXISTS (SELECT 1 FROM documento WHERE nombre_documento = 'Documento del tema 2')
    RETURNING documento_id INTO doc_id;
    
    IF doc_id IS NOT NULL THEN
        INSERT INTO version_documento (documento_id, fecha_ultima_subida, numero_version, link_archivo_subido, activo, fecha_creacion)
        VALUES (doc_id, CURRENT_TIMESTAMP - INTERVAL '15 days', 1, 'https://example.com/doc2.pdf', true, CURRENT_TIMESTAMP)
        RETURNING version_documento_id INTO version_id;
        
        INSERT INTO revision_documento (usuario_id, version_documento_id, fecha_limite_revision, fecha_revision, 
                                      estado_revision, link_archivo_revision, activo, fecha_creacion)
        VALUES (profesor_id, version_id, CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE, 
               'en_proceso', NULL, true, CURRENT_TIMESTAMP - INTERVAL '10 days');
    END IF;
    
    -- Tercer documento y su versión
    INSERT INTO documento (nombre_documento, fecha_subida, ultima_version, activo, fecha_creacion)
    SELECT 'Documento del tema 3', CURRENT_DATE - INTERVAL '15 days', 1, true, CURRENT_TIMESTAMP
    WHERE NOT EXISTS (SELECT 1 FROM documento WHERE nombre_documento = 'Documento del tema 3')
    RETURNING documento_id INTO doc_id;
    
    IF doc_id IS NOT NULL THEN
        INSERT INTO version_documento (documento_id, fecha_ultima_subida, numero_version, link_archivo_subido, activo, fecha_creacion)
        VALUES (doc_id, CURRENT_TIMESTAMP - INTERVAL '15 days', 1, 'https://example.com/doc3.pdf', true, CURRENT_TIMESTAMP)
        RETURNING version_documento_id INTO version_id;
        
        INSERT INTO revision_documento (usuario_id, version_documento_id, fecha_limite_revision, fecha_revision, 
                                      estado_revision, link_archivo_revision, activo, fecha_creacion)
        VALUES (profesor_id, version_id, CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE, 
               'pendiente', NULL, true, CURRENT_TIMESTAMP - INTERVAL '10 days');
    END IF;
END $$; 