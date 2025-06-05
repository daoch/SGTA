-- 0) Asegúrate de trabajar en el schema correcto
SET search_path TO sgtadb;

-- ###########################################
-- 0. INSERTAR MI USUARIO (Ricardo Meléndez Olivo)
-- ... (sin cambios) ...
WITH upsert_user AS (
  INSERT INTO usuario (
    tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido, correo_electronico, contrasena, id_cognito, activo
  ) VALUES (
    (SELECT tipo_usuario_id FROM tipo_usuario WHERE LOWER(nombre) = 'coordinador' LIMIT 1),
    'A20200485', 'Ricardo', 'Meléndez', 'Olivo', 'a20200485@pucp.edu.pe', 'hashed_password_segura', 'c12b25a0-70a1-7054-e5e4-e367abfbc07c', TRUE
  ) ON CONFLICT (correo_electronico) DO UPDATE SET
      tipo_usuario_id = EXCLUDED.tipo_usuario_id, codigo_pucp = EXCLUDED.codigo_pucp, nombres = EXCLUDED.nombres, primer_apellido = EXCLUDED.primer_apellido,
      segundo_apellido = EXCLUDED.segundo_apellido, contrasena = EXCLUDED.contrasena, id_cognito = EXCLUDED.id_cognito, activo = EXCLUDED.activo
  RETURNING usuario_id
) SELECT usuario_id FROM upsert_user;

WITH mi_usuario AS (
    SELECT usuario_id FROM usuario WHERE correo_electronico = 'a20200485@pucp.edu.pe' LIMIT 1
), mi_carrera AS (
    SELECT carrera_id FROM carrera WHERE codigo = 'INF' LIMIT 1
)
INSERT INTO usuario_carrera (usuario_id, carrera_id, activo)
SELECT mu.usuario_id, mc.carrera_id, TRUE
FROM mi_usuario mu, mi_carrera mc
WHERE mu.usuario_id IS NOT NULL AND mc.carrera_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- ###########################################
-- 2. USUARIOS DE PRUEBA (sin IDs fijos)
-- ... (se añaden más usuarios) ...
-- Estudiante Juan Perez (ya existente)
WITH stu AS (
  INSERT INTO usuario (tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido, correo_electronico, contrasena, activo)
  VALUES ((SELECT tipo_usuario_id FROM tipo_usuario WHERE LOWER(nombre) = 'alumno' LIMIT 1), '20200001', 'Juan Alberto', 'Pérez', 'Gómez', 'juan.perez@example.com', 'hashed_pass_estu', TRUE)
  ON CONFLICT (correo_electronico) DO UPDATE SET tipo_usuario_id=EXCLUDED.tipo_usuario_id, codigo_pucp=EXCLUDED.codigo_pucp, nombres=EXCLUDED.nombres, primer_apellido=EXCLUDED.primer_apellido, segundo_apellido=EXCLUDED.segundo_apellido, contrasena=EXCLUDED.contrasena, activo=EXCLUDED.activo RETURNING usuario_id
) INSERT INTO usuario_rol (usuario_id, rol_id, activo) SELECT stu.usuario_id, (SELECT rol_id FROM rol WHERE nombre = 'Tesista' LIMIT 1), TRUE FROM stu WHERE stu.usuario_id IS NOT NULL AND (SELECT rol_id FROM rol WHERE nombre = 'Tesista' LIMIT 1) IS NOT NULL ON CONFLICT DO NOTHING;
WITH stu_ref AS (SELECT usuario_id FROM usuario WHERE correo_electronico = 'juan.perez@example.com' LIMIT 1)
INSERT INTO usuario_carrera (usuario_id, carrera_id) SELECT sr.usuario_id, (SELECT carrera_id FROM carrera WHERE codigo = 'INF' LIMIT 1) FROM stu_ref sr WHERE sr.usuario_id IS NOT NULL AND (SELECT carrera_id FROM carrera WHERE codigo = 'INF' LIMIT 1) IS NOT NULL ON CONFLICT DO NOTHING;

-- Asesor Ana Lopez (ya existente)
WITH adv AS (
  INSERT INTO usuario (tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido, correo_electronico, contrasena, activo)
  VALUES ((SELECT tipo_usuario_id FROM tipo_usuario WHERE LOWER(nombre) = 'profesor' LIMIT 1), 'D001', 'Ana María', 'López', 'Fernández', 'ana.lopez@example.com', 'hashed_pass_adv', TRUE)
  ON CONFLICT (correo_electronico) DO UPDATE SET tipo_usuario_id=EXCLUDED.tipo_usuario_id, codigo_pucp=EXCLUDED.codigo_pucp, nombres=EXCLUDED.nombres, primer_apellido=EXCLUDED.primer_apellido, segundo_apellido=EXCLUDED.segundo_apellido, contrasena=EXCLUDED.contrasena, activo=EXCLUDED.activo RETURNING usuario_id
) INSERT INTO usuario_rol (usuario_id, rol_id, activo) SELECT adv.usuario_id, (SELECT rol_id FROM rol WHERE nombre = 'Asesor' LIMIT 1), TRUE FROM adv WHERE adv.usuario_id IS NOT NULL AND (SELECT rol_id FROM rol WHERE nombre = 'Asesor' LIMIT 1) IS NOT NULL ON CONFLICT DO NOTHING;
WITH adv_ref AS (SELECT usuario_id FROM usuario WHERE correo_electronico = 'ana.lopez@example.com' LIMIT 1)
INSERT INTO usuario_carrera (usuario_id, carrera_id) SELECT ar.usuario_id, (SELECT carrera_id FROM carrera WHERE codigo = 'INF' LIMIT 1) FROM adv_ref ar WHERE ar.usuario_id IS NOT NULL AND (SELECT carrera_id FROM carrera WHERE codigo = 'INF' LIMIT 1) IS NOT NULL ON CONFLICT DO NOTHING;

-- Coordinador Carlos Ruiz (ya existente)
WITH coord_user AS (
  INSERT INTO usuario (tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido, correo_electronico, contrasena, activo)
  VALUES ((SELECT tipo_usuario_id FROM tipo_usuario WHERE LOWER(nombre) = 'coordinador' LIMIT 1), 'C001', 'Carlos Alberto', 'Ruiz', 'Torres', 'carlos.ruiz@example.com', 'hashed_pass_coord', TRUE)
  ON CONFLICT (correo_electronico) DO UPDATE SET tipo_usuario_id=EXCLUDED.tipo_usuario_id, codigo_pucp=EXCLUDED.codigo_pucp, nombres=EXCLUDED.nombres, primer_apellido=EXCLUDED.primer_apellido, segundo_apellido=EXCLUDED.segundo_apellido, contrasena=EXCLUDED.contrasena, activo=EXCLUDED.activo RETURNING usuario_id
) INSERT INTO usuario_carrera (usuario_id, carrera_id) SELECT cu.usuario_id, (SELECT carrera_id FROM carrera WHERE codigo = 'INF' LIMIT 1) FROM coord_user cu WHERE cu.usuario_id IS NOT NULL AND (SELECT carrera_id FROM carrera WHERE codigo = 'INF' LIMIT 1) IS NOT NULL ON CONFLICT DO NOTHING;

-- NUEVOS USUARIOS PARA MÁS EJEMPLOS
-- Estudiante 2: Luisa
WITH stu2 AS (
  INSERT INTO usuario (tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido, correo_electronico, contrasena, activo)
  VALUES ((SELECT tipo_usuario_id FROM tipo_usuario WHERE LOWER(nombre) = 'alumno' LIMIT 1), '20200002', 'Luisa', 'Martínez', 'Chávez', 'luisa.martinez@example.com', 'hashed_pass_stu2', TRUE)
  ON CONFLICT (correo_electronico) DO UPDATE SET nombres=EXCLUDED.nombres RETURNING usuario_id
) INSERT INTO usuario_rol (usuario_id, rol_id, activo) SELECT stu2.usuario_id, (SELECT rol_id FROM rol WHERE nombre = 'Tesista' LIMIT 1), TRUE FROM stu2 ON CONFLICT DO NOTHING;
WITH stu2_ref AS (SELECT usuario_id FROM usuario WHERE correo_electronico = 'luisa.martinez@example.com' LIMIT 1)
INSERT INTO usuario_carrera (usuario_id, carrera_id) SELECT s2r.usuario_id, (SELECT carrera_id FROM carrera WHERE codigo = 'INF' LIMIT 1) FROM stu2_ref s2r ON CONFLICT DO NOTHING;

-- Asesor 2: Pedro
WITH adv2 AS (
  INSERT INTO usuario (tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido, correo_electronico, contrasena, activo)
  VALUES ((SELECT tipo_usuario_id FROM tipo_usuario WHERE LOWER(nombre) = 'profesor' LIMIT 1), 'D002', 'Pedro', 'Ramírez', 'Solis', 'pedro.ramirez@example.com', 'hashed_pass_adv2', TRUE)
  ON CONFLICT (correo_electronico) DO UPDATE SET nombres=EXCLUDED.nombres RETURNING usuario_id
) INSERT INTO usuario_rol (usuario_id, rol_id, activo) SELECT adv2.usuario_id, (SELECT rol_id FROM rol WHERE nombre = 'Asesor' LIMIT 1), TRUE FROM adv2 ON CONFLICT DO NOTHING;
WITH adv2_ref AS (SELECT usuario_id FROM usuario WHERE correo_electronico = 'pedro.ramirez@example.com' LIMIT 1)
INSERT INTO usuario_carrera (usuario_id, carrera_id) SELECT a2r.usuario_id, (SELECT carrera_id FROM carrera WHERE codigo = 'INF' LIMIT 1) FROM adv2_ref a2r ON CONFLICT DO NOTHING;

-- Estudiante 3: Sofia
WITH stu3 AS (
  INSERT INTO usuario (tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido, correo_electronico, contrasena, activo)
  VALUES ((SELECT tipo_usuario_id FROM tipo_usuario WHERE LOWER(nombre) = 'alumno' LIMIT 1), '20200003', 'Sofia', 'Gonzales', 'Vega', 'sofia.gonzales@example.com', 'hashed_pass_stu3', TRUE)
  ON CONFLICT (correo_electronico) DO UPDATE SET nombres=EXCLUDED.nombres RETURNING usuario_id
) INSERT INTO usuario_rol (usuario_id, rol_id, activo) SELECT stu3.usuario_id, (SELECT rol_id FROM rol WHERE nombre = 'Tesista' LIMIT 1), TRUE FROM stu3 ON CONFLICT DO NOTHING;
WITH stu3_ref AS (SELECT usuario_id FROM usuario WHERE correo_electronico = 'sofia.gonzales@example.com' LIMIT 1)
INSERT INTO usuario_carrera (usuario_id, carrera_id) SELECT s3r.usuario_id, (SELECT carrera_id FROM carrera WHERE codigo = 'INF' LIMIT 1) FROM stu3_ref s3r ON CONFLICT DO NOTHING;

-- Asesor 3: Laura
WITH adv3 AS (
  INSERT INTO usuario (tipo_usuario_id, codigo_pucp, nombres, primer_apellido, segundo_apellido, correo_electronico, contrasena, activo)
  VALUES ((SELECT tipo_usuario_id FROM tipo_usuario WHERE LOWER(nombre) = 'profesor' LIMIT 1), 'D003', 'Laura', 'Jiménez', 'Paz', 'laura.jimenez@example.com', 'hashed_pass_adv3', TRUE)
  ON CONFLICT (correo_electronico) DO UPDATE SET nombres=EXCLUDED.nombres RETURNING usuario_id
) INSERT INTO usuario_rol (usuario_id, rol_id, activo) SELECT adv3.usuario_id, (SELECT rol_id FROM rol WHERE nombre = 'Asesor' LIMIT 1), TRUE FROM adv3 ON CONFLICT DO NOTHING;
WITH adv3_ref AS (SELECT usuario_id FROM usuario WHERE correo_electronico = 'laura.jimenez@example.com' LIMIT 1)
INSERT INTO usuario_carrera (usuario_id, carrera_id) SELECT a3r.usuario_id, (SELECT carrera_id FROM carrera WHERE codigo = 'INF' LIMIT 1) FROM adv3_ref a3r ON CONFLICT DO NOTHING;


-- ###########################################
-- 4. DATOS MAESTROS SOLICITUDES
-- ... (sin cambios)
INSERT INTO tipo_solicitud (nombre, descripcion, activo, fecha_creacion, fecha_modificacion) VALUES
  ('CAMBIO_ASESOR',   'Solicitud para cambiar de asesor de tesis', TRUE, NOW(), NOW()),
  ('Cese Asesoria',   'Solicitud para que un asesor cese su participación en una tesis', TRUE, NOW(), NOW())
ON CONFLICT DO NOTHING; 
INSERT INTO estado_solicitud (nombre, activo, fecha_creacion, fecha_modificacion) VALUES
  ('PENDIENTE', TRUE, NOW(), NOW()),('EN_REVISION', TRUE, NOW(), NOW()),('APROBADA', TRUE, NOW(), NOW()),('RECHAZADA', TRUE, NOW(), NOW()),('CANCELADA', TRUE, NOW(), NOW())
ON CONFLICT (nombre) DO NOTHING; 
INSERT INTO rol_solicitud (nombre, activo, fecha_creacion, fecha_modificacion) VALUES
  ('SOLICITANTE', TRUE, NOW(), NOW()),('ASESOR_ACTUAL_INVOLUCRADO', TRUE, NOW(), NOW()),('ASESOR_SUGERIDO_INVOLUCRADO', TRUE, NOW(), NOW()),('COORDINADOR_GESTOR', TRUE, NOW(), NOW()),('ESTUDIANTE_AFECTADO', TRUE, NOW(), NOW()),('ASESOR_SOLICITANTE_CESE', TRUE, NOW(), NOW())
ON CONFLICT (nombre) DO NOTHING; 
INSERT INTO accion_solicitud (nombre, activo, fecha_creacion, fecha_modificacion) VALUES
  ('PENDIENTE_ACCION', TRUE, NOW(), NOW()),('ACEPTADO', TRUE, NOW(), NOW()),('RECHAZADO', TRUE, NOW(), NOW()),('INFORMADO', TRUE, NOW(), NOW()),('COMPLETADO_SU_PARTE', TRUE, NOW(), NOW()),('CREADA', TRUE, NOW(), NOW())
ON CONFLICT (nombre) DO NOTHING; 

-- ###########################################
-- BLOQUE PRINCIPAL DO PARA TEMAS Y SOLICITUDES
-- ###########################################
DO $$
DECLARE
    -- IDs Generales
    v_estado_tema_progreso_id INT;
    v_carrera_inf_id INT;
    v_rol_tesista_id INT;
    v_rol_asesor_id INT;
    v_tipo_sol_cese_id INT;
    v_accion_creada_id INT;
    v_accion_informado_id INT;
    v_accion_pendiente_id INT;
    v_rol_sol_asesor_cese_id INT;
    v_rol_sol_estudiante_afectado_id INT;
    v_rol_sol_coordinador_gestor_id INT;

    -- IDs Usuarios
    v_juan_perez_id INT; v_ana_lopez_id INT; v_carlos_ruiz_id INT;
    v_luisa_martinez_id INT; v_pedro_ramirez_id INT;
    v_sofia_gonzales_id INT; v_laura_jimenez_id INT;

    -- IDs Temas
    v_tema_id_t001 INT; v_tema_id_t002 INT; v_tema_id_t003 INT;

    -- IDs Estados Solicitud
    v_estado_sol_pendiente_id INT; v_estado_sol_aprobada_id INT; v_estado_sol_rechazada_id INT;
    
    -- IDs Solicitudes
    v_solicitud_id_1 INT; v_solicitud_id_2 INT; v_solicitud_id_3 INT;

BEGIN
    -- Obtener IDs generales una vez
    SELECT estado_tema_id INTO v_estado_tema_progreso_id FROM estado_tema WHERE nombre = 'EN_PROGRESO' LIMIT 1;
    SELECT carrera_id INTO v_carrera_inf_id FROM carrera WHERE codigo = 'INF' LIMIT 1;
    SELECT rol_id INTO v_rol_tesista_id FROM rol WHERE nombre = 'Tesista' LIMIT 1;
    SELECT rol_id INTO v_rol_asesor_id FROM rol WHERE nombre = 'Asesor' LIMIT 1;
    SELECT tipo_solicitud_id INTO v_tipo_sol_cese_id FROM tipo_solicitud WHERE nombre = 'Cese Asesoria' LIMIT 1;
    SELECT accion_solicitud_id INTO v_accion_creada_id FROM accion_solicitud WHERE nombre = 'CREADA' LIMIT 1;
    SELECT accion_solicitud_id INTO v_accion_informado_id FROM accion_solicitud WHERE nombre = 'INFORMADO' LIMIT 1;
    SELECT accion_solicitud_id INTO v_accion_pendiente_id FROM accion_solicitud WHERE nombre = 'PENDIENTE_ACCION' LIMIT 1;
    SELECT rol_solicitud_id INTO v_rol_sol_asesor_cese_id FROM rol_solicitud WHERE nombre = 'ASESOR_SOLICITANTE_CESE' LIMIT 1;
    SELECT rol_solicitud_id INTO v_rol_sol_estudiante_afectado_id FROM rol_solicitud WHERE nombre = 'ESTUDIANTE_AFECTADO' LIMIT 1;
    SELECT rol_solicitud_id INTO v_rol_sol_coordinador_gestor_id FROM rol_solicitud WHERE nombre = 'COORDINADOR_GESTOR' LIMIT 1;
    SELECT estado_solicitud_id INTO v_estado_sol_pendiente_id FROM estado_solicitud WHERE nombre = 'PENDIENTE' LIMIT 1;
    SELECT estado_solicitud_id INTO v_estado_sol_aprobada_id FROM estado_solicitud WHERE nombre = 'APROBADA' LIMIT 1;
    SELECT estado_solicitud_id INTO v_estado_sol_rechazada_id FROM estado_solicitud WHERE nombre = 'RECHAZADA' LIMIT 1;

    -- Obtener IDs de usuarios
    SELECT usuario_id INTO v_juan_perez_id FROM usuario WHERE correo_electronico = 'juan.perez@example.com' LIMIT 1;
    SELECT usuario_id INTO v_ana_lopez_id FROM usuario WHERE correo_electronico = 'ana.lopez@example.com' LIMIT 1;
    SELECT usuario_id INTO v_carlos_ruiz_id FROM usuario WHERE correo_electronico = 'carlos.ruiz@example.com' LIMIT 1;
    SELECT usuario_id INTO v_luisa_martinez_id FROM usuario WHERE correo_electronico = 'luisa.martinez@example.com' LIMIT 1;
    SELECT usuario_id INTO v_pedro_ramirez_id FROM usuario WHERE correo_electronico = 'pedro.ramirez@example.com' LIMIT 1;
    SELECT usuario_id INTO v_sofia_gonzales_id FROM usuario WHERE correo_electronico = 'sofia.gonzales@example.com' LIMIT 1;
    SELECT usuario_id INTO v_laura_jimenez_id FROM usuario WHERE correo_electronico = 'laura.jimenez@example.com' LIMIT 1;

    -- Verificar dependencias críticas
    IF v_estado_tema_progreso_id IS NULL OR v_carrera_inf_id IS NULL OR v_rol_tesista_id IS NULL OR v_rol_asesor_id IS NULL OR
       v_tipo_sol_cese_id IS NULL OR v_accion_creada_id IS NULL OR v_accion_informado_id IS NULL OR v_accion_pendiente_id IS NULL OR
       v_rol_sol_asesor_cese_id IS NULL OR v_rol_sol_estudiante_afectado_id IS NULL OR v_rol_sol_coordinador_gestor_id IS NULL OR
       v_estado_sol_pendiente_id IS NULL OR v_estado_sol_aprobada_id IS NULL OR v_estado_sol_rechazada_id IS NULL
    THEN
        RAISE EXCEPTION 'Faltan IDs maestros críticos. Revisa los datos base.';
    END IF;


    -- === TEMA 1 (T001) Y SOLICITUD 1 (PENDIENTE) ===
    RAISE NOTICE 'Procesando Tema T001 y Solicitud 1 (Pendiente)';
    BEGIN
        INSERT INTO tema (codigo, titulo, resumen, estado_tema_id, carrera_id, fecha_limite)
        VALUES ('T001', 'Sistema de Gestión de Tesis Académicas (SGTA)', 'Desarrollo de un sistema para la gestión integral de tesis.', v_estado_tema_progreso_id, v_carrera_inf_id, '2024-12-31')
        RETURNING tema_id INTO v_tema_id_t001;
    EXCEPTION WHEN unique_violation THEN SELECT tema_id INTO v_tema_id_t001 FROM tema WHERE codigo = 'T001' ORDER BY fecha_creacion DESC LIMIT 1; END;
    IF v_tema_id_t001 IS NULL THEN SELECT tema_id INTO v_tema_id_t001 FROM tema WHERE codigo = 'T001' ORDER BY fecha_creacion DESC LIMIT 1; END IF;
    RAISE NOTICE 'Tema T001 ID: %', v_tema_id_t001;

    IF v_tema_id_t001 IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM usuario_tema WHERE usuario_id = v_juan_perez_id AND tema_id = v_tema_id_t001 AND rol_id = v_rol_tesista_id) THEN
            INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador) VALUES (v_juan_perez_id, v_tema_id_t001, v_rol_tesista_id, TRUE, TRUE); END IF;
        IF NOT EXISTS (SELECT 1 FROM usuario_tema WHERE usuario_id = v_ana_lopez_id AND tema_id = v_tema_id_t001 AND rol_id = v_rol_asesor_id) THEN
            INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador) VALUES (v_ana_lopez_id, v_tema_id_t001, v_rol_asesor_id, TRUE, FALSE); END IF;

        IF NOT EXISTS (SELECT 1 FROM solicitud WHERE tema_id = v_tema_id_t001 AND tipo_solicitud_id = v_tipo_sol_cese_id AND descripcion = 'La asesora Ana López solicita el cese de su asesoría por motivos personales.') THEN
            INSERT INTO solicitud (descripcion, tipo_solicitud_id, tema_id, estado_solicitud, fecha_creacion, fecha_modificacion, activo, estado, fecha_resolucion)
            VALUES ('La asesora Ana López solicita el cese de su asesoría por motivos personales.', v_tipo_sol_cese_id, v_tema_id_t001, v_estado_sol_pendiente_id, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', TRUE, 1, NULL) -- estado 1 para PENDIENTE (según tu lógica de backend)
            RETURNING solicitud_id INTO v_solicitud_id_1;
        ELSE SELECT solicitud_id INTO v_solicitud_id_1 FROM solicitud WHERE tema_id = v_tema_id_t001 AND tipo_solicitud_id = v_tipo_sol_cese_id AND descripcion = 'La asesora Ana López solicita el cese de su asesoría por motivos personales.' ORDER BY fecha_creacion DESC LIMIT 1; END IF;
        RAISE NOTICE 'Solicitud 1 ID: %', v_solicitud_id_1;

        IF v_solicitud_id_1 IS NOT NULL THEN
            IF NOT EXISTS (SELECT 1 FROM usuario_solicitud WHERE usuario_id = v_ana_lopez_id AND solicitud_id = v_solicitud_id_1 AND rol_solicitud = v_rol_sol_asesor_cese_id) THEN
                INSERT INTO usuario_solicitud VALUES (DEFAULT, v_ana_lopez_id, v_solicitud_id_1, v_accion_creada_id, v_rol_sol_asesor_cese_id, NOW() - INTERVAL '2 days', FALSE, FALSE, FALSE, 'Solicito formalmente mi cese como asesora.', TRUE, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'); END IF;
            IF NOT EXISTS (SELECT 1 FROM usuario_solicitud WHERE usuario_id = v_juan_perez_id AND solicitud_id = v_solicitud_id_1 AND rol_solicitud = v_rol_sol_estudiante_afectado_id) THEN
                INSERT INTO usuario_solicitud VALUES (DEFAULT, v_juan_perez_id, v_solicitud_id_1, v_accion_informado_id, v_rol_sol_estudiante_afectado_id, NOW() - INTERVAL '2 days', FALSE, FALSE, TRUE, 'Notificado sobre la solicitud de cese.', TRUE, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'); END IF;
            IF NOT EXISTS (SELECT 1 FROM usuario_solicitud WHERE usuario_id = v_carlos_ruiz_id AND solicitud_id = v_solicitud_id_1 AND rol_solicitud = v_rol_sol_coordinador_gestor_id) THEN
                INSERT INTO usuario_solicitud VALUES (DEFAULT, v_carlos_ruiz_id, v_solicitud_id_1, v_accion_pendiente_id, v_rol_sol_coordinador_gestor_id, NOW() - INTERVAL '2 days', FALSE, FALSE, TRUE, 'Solicitud pendiente de revisión por coordinación.', TRUE, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'); END IF;
        END IF;
    END IF;


    -- === TEMA 2 (T002) Y SOLICITUD 2 (APROBADA) ===
    RAISE NOTICE 'Procesando Tema T002 y Solicitud 2 (Aprobada)';
    BEGIN
        INSERT INTO tema (codigo, titulo, resumen, estado_tema_id, carrera_id, fecha_limite)
        VALUES ('T002', 'IA para Detección de Fraude', 'Uso de ML para identificar transacciones fraudulentas.', v_estado_tema_progreso_id, v_carrera_inf_id, '2025-01-15')
        RETURNING tema_id INTO v_tema_id_t002;
    EXCEPTION WHEN unique_violation THEN SELECT tema_id INTO v_tema_id_t002 FROM tema WHERE codigo = 'T002' ORDER BY fecha_creacion DESC LIMIT 1; END;
    IF v_tema_id_t002 IS NULL THEN SELECT tema_id INTO v_tema_id_t002 FROM tema WHERE codigo = 'T002' ORDER BY fecha_creacion DESC LIMIT 1; END IF;
    RAISE NOTICE 'Tema T002 ID: %', v_tema_id_t002;

    IF v_tema_id_t002 IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM usuario_tema WHERE usuario_id = v_luisa_martinez_id AND tema_id = v_tema_id_t002 AND rol_id = v_rol_tesista_id) THEN
            INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador) VALUES (v_luisa_martinez_id, v_tema_id_t002, v_rol_tesista_id, TRUE, TRUE); END IF;
        IF NOT EXISTS (SELECT 1 FROM usuario_tema WHERE usuario_id = v_pedro_ramirez_id AND tema_id = v_tema_id_t002 AND rol_id = v_rol_asesor_id) THEN
            INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador) VALUES (v_pedro_ramirez_id, v_tema_id_t002, v_rol_asesor_id, TRUE, FALSE); END IF;

        IF NOT EXISTS (SELECT 1 FROM solicitud WHERE tema_id = v_tema_id_t002 AND tipo_solicitud_id = v_tipo_sol_cese_id AND descripcion = 'Pedro Ramírez solicita cese por carga académica.') THEN
            INSERT INTO solicitud (descripcion, tipo_solicitud_id, tema_id, estado_solicitud, fecha_creacion, fecha_modificacion, activo, estado, respuesta, fecha_resolucion)
            VALUES ('Pedro Ramírez solicita cese por carga académica.', v_tipo_sol_cese_id, v_tema_id_t002, v_estado_sol_aprobada_id, NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day', TRUE, 0, 'Aprobado. Se procederá a reasignar tesista.', NOW() - INTERVAL '1 day') -- estado 0 para APROBADA
            RETURNING solicitud_id INTO v_solicitud_id_2;
        ELSE SELECT solicitud_id INTO v_solicitud_id_2 FROM solicitud WHERE tema_id = v_tema_id_t002 AND tipo_solicitud_id = v_tipo_sol_cese_id AND descripcion = 'Pedro Ramírez solicita cese por carga académica.' ORDER BY fecha_creacion DESC LIMIT 1; END IF;
        RAISE NOTICE 'Solicitud 2 ID: %', v_solicitud_id_2;
        
        IF v_solicitud_id_2 IS NOT NULL THEN
            IF NOT EXISTS (SELECT 1 FROM usuario_solicitud WHERE usuario_id = v_pedro_ramirez_id AND solicitud_id = v_solicitud_id_2 AND rol_solicitud = v_rol_sol_asesor_cese_id) THEN
                 INSERT INTO usuario_solicitud VALUES (DEFAULT, v_pedro_ramirez_id, v_solicitud_id_2, v_accion_creada_id, v_rol_sol_asesor_cese_id, NOW() - INTERVAL '5 days', FALSE, FALSE, FALSE, 'Solicito cese por carga académica.', TRUE, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'); END IF;
            IF NOT EXISTS (SELECT 1 FROM usuario_solicitud WHERE usuario_id = v_carlos_ruiz_id AND solicitud_id = v_solicitud_id_2 AND rol_solicitud = v_rol_sol_coordinador_gestor_id) THEN
                 INSERT INTO usuario_solicitud VALUES (DEFAULT, v_carlos_ruiz_id, v_solicitud_id_2, (SELECT accion_solicitud_id FROM accion_solicitud WHERE nombre = 'ACEPTADO' LIMIT 1), v_rol_sol_coordinador_gestor_id, NOW() - INTERVAL '1 day', FALSE, TRUE, TRUE, 'Aprobado. Coordinación gestionará reasignación.', TRUE, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'); END IF;
        END IF;
    END IF;


    -- === TEMA 3 (T003) Y SOLICITUD 3 (RECHAZADA) ===
    RAISE NOTICE 'Procesando Tema T003 y Solicitud 3 (Rechazada)';
    BEGIN
        INSERT INTO tema (codigo, titulo, resumen, estado_tema_id, carrera_id, fecha_limite)
        VALUES ('T003', 'Desarrollo App Móvil Educativa', 'Creación de app para aprendizaje interactivo.', v_estado_tema_progreso_id, v_carrera_inf_id, '2025-02-01')
        RETURNING tema_id INTO v_tema_id_t003;
    EXCEPTION WHEN unique_violation THEN SELECT tema_id INTO v_tema_id_t003 FROM tema WHERE codigo = 'T003' ORDER BY fecha_creacion DESC LIMIT 1; END;
    IF v_tema_id_t003 IS NULL THEN SELECT tema_id INTO v_tema_id_t003 FROM tema WHERE codigo = 'T003' ORDER BY fecha_creacion DESC LIMIT 1; END IF;
    RAISE NOTICE 'Tema T003 ID: %', v_tema_id_t003;

    IF v_tema_id_t003 IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM usuario_tema WHERE usuario_id = v_sofia_gonzales_id AND tema_id = v_tema_id_t003 AND rol_id = v_rol_tesista_id) THEN
            INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador) VALUES (v_sofia_gonzales_id, v_tema_id_t003, v_rol_tesista_id, TRUE, TRUE); END IF;
        IF NOT EXISTS (SELECT 1 FROM usuario_tema WHERE usuario_id = v_laura_jimenez_id AND tema_id = v_tema_id_t003 AND rol_id = v_rol_asesor_id) THEN
            INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador) VALUES (v_laura_jimenez_id, v_tema_id_t003, v_rol_asesor_id, TRUE, FALSE); END IF;

        IF NOT EXISTS (SELECT 1 FROM solicitud WHERE tema_id = v_tema_id_t003 AND tipo_solicitud_id = v_tipo_sol_cese_id AND descripcion = 'Laura Jiménez pide cese por viaje imprevisto.') THEN
            INSERT INTO solicitud (descripcion, tipo_solicitud_id, tema_id, estado_solicitud, fecha_creacion, fecha_modificacion, activo, estado, respuesta, fecha_resolucion)
            VALUES ('Laura Jiménez pide cese por viaje imprevisto.', v_tipo_sol_cese_id, v_tema_id_t003, v_estado_sol_rechazada_id, NOW() - INTERVAL '3 days', NOW(), TRUE, 2, 'Rechazado. El motivo no justifica el cese en esta etapa del proyecto.', NOW()) -- estado 2 para RECHAZADA
            RETURNING solicitud_id INTO v_solicitud_id_3;
        ELSE SELECT solicitud_id INTO v_solicitud_id_3 FROM solicitud WHERE tema_id = v_tema_id_t003 AND tipo_solicitud_id = v_tipo_sol_cese_id AND descripcion = 'Laura Jiménez pide cese por viaje imprevisto.' ORDER BY fecha_creacion DESC LIMIT 1; END IF;
        RAISE NOTICE 'Solicitud 3 ID: %', v_solicitud_id_3;

        IF v_solicitud_id_3 IS NOT NULL THEN
             IF NOT EXISTS (SELECT 1 FROM usuario_solicitud WHERE usuario_id = v_laura_jimenez_id AND solicitud_id = v_solicitud_id_3 AND rol_solicitud = v_rol_sol_asesor_cese_id) THEN
                 INSERT INTO usuario_solicitud VALUES (DEFAULT, v_laura_jimenez_id, v_solicitud_id_3, v_accion_creada_id, v_rol_sol_asesor_cese_id, NOW() - INTERVAL '3 days', FALSE, FALSE, FALSE, 'Solicito cese por viaje.', TRUE, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'); END IF;
             IF NOT EXISTS (SELECT 1 FROM usuario_solicitud WHERE usuario_id = v_carlos_ruiz_id AND solicitud_id = v_solicitud_id_3 AND rol_solicitud = v_rol_sol_coordinador_gestor_id) THEN
                 INSERT INTO usuario_solicitud VALUES (DEFAULT, v_carlos_ruiz_id, v_solicitud_id_3, (SELECT accion_solicitud_id FROM accion_solicitud WHERE nombre = 'RECHAZADO' LIMIT 1), v_rol_sol_coordinador_gestor_id, NOW(), FALSE, TRUE, TRUE, 'Rechazado. El motivo no justifica el cese.', TRUE, NOW(), NOW()); END IF;
        END IF;
    END IF;

END $$;

-- Fin: todos los datos de prueba han sido insertados/actualizados
SELECT '✅ Población de datos de prueba (con múltiples estados de solicitud) completada.' AS resultado;