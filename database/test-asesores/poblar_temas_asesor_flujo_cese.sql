-- Asegúrate de trabajar en el schema correcto
SET search_path TO sgtadb;

DO $$
DECLARE
    v_asesor_usuario_id INT;
    v_rol_asesor_id INT;
    v_carrera_inf_id INT;
    v_estado_tema_activo_id INT;

    v_tema_id_1 INT;
    v_tema_id_2 INT;
    v_tema_id_3 INT;

    -- IDs de estudiantes de ejemplo (asegúrate que existan o créalos si es necesario)
    -- Si no tienes estudiantes específicos o no quieres crear la relación tema-tesista ahora, puedes omitir esa parte.
    v_estudiante_id_1 INT;
    v_estudiante_id_2 INT;
    v_estudiante_id_3 INT;
    v_rol_tesista_id INT;

BEGIN
    -- 1. Obtener IDs necesarios
    SELECT usuario_id INTO v_asesor_usuario_id
    FROM usuario WHERE id_cognito = 'c12b25a0-70a1-7054-e5e4-e367abfbc07c' LIMIT 1;

    SELECT rol_id INTO v_rol_asesor_id
    FROM rol WHERE nombre = 'Asesor' LIMIT 1;

    SELECT carrera_id INTO v_carrera_inf_id
    FROM carrera WHERE codigo = 'INF' LIMIT 1;

    SELECT estado_tema_id INTO v_estado_tema_activo_id
    FROM estado_tema WHERE nombre = 'EN_PROGRESO' LIMIT 1; -- O 'INSCRITO', 'REGISTRADO', el que uses para temas activos

    -- Opcional: Obtener IDs de estudiantes y rol tesista si quieres asignarles temas
    SELECT usuario_id INTO v_estudiante_id_1 FROM usuario WHERE correo_electronico = 'juan.perez@example.com' LIMIT 1;
    SELECT usuario_id INTO v_estudiante_id_2 FROM usuario WHERE correo_electronico = 'luisa.martinez@example.com' LIMIT 1; -- Asume que creaste a Luisa
    SELECT usuario_id INTO v_estudiante_id_3 FROM usuario WHERE correo_electronico = 'sofia.gonzales@example.com' LIMIT 1; -- Asume que creaste a Sofia
    SELECT rol_id INTO v_rol_tesista_id FROM rol WHERE nombre = 'Tesista' LIMIT 1;


    -- Validar que se encontraron los IDs básicos
    IF v_asesor_usuario_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró el usuario asesor con el id_cognito especificado.';
    END IF;
    IF v_rol_asesor_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró el rol de Asesor.';
    END IF;
    IF v_carrera_inf_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró la carrera INF.';
    END IF;
    IF v_estado_tema_activo_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró el estado de tema activo (ej. EN_PROGRESO).';
    END IF;

    RAISE NOTICE 'Asesor ID: %, Rol Asesor ID: %, Carrera INF ID: %, Estado Tema Activo ID: %',
        v_asesor_usuario_id, v_rol_asesor_id, v_carrera_inf_id, v_estado_tema_activo_id;

    -- 2. Crear/Asegurar Temas de Ejemplo
    -- Tema 1
    INSERT INTO tema (codigo, titulo, resumen, estado_tema_id, carrera_id, fecha_limite, activo)
    VALUES ('TEMA_RICARDO_01', 'Investigación Avanzada en IA para SGTA', 'Un estudio profundo sobre nuevas técnicas de IA aplicables al SGTA.', v_estado_tema_activo_id, v_carrera_inf_id, '2025-06-30', TRUE)
    ON CONFLICT (codigo) DO UPDATE SET titulo = EXCLUDED.titulo -- Actualiza algo si ya existe por código
    RETURNING tema_id INTO v_tema_id_1;
    RAISE NOTICE 'Tema 1 (TEMA_RICARDO_01) ID: %', v_tema_id_1;

    -- Tema 2
    INSERT INTO tema (codigo, titulo, resumen, estado_tema_id, carrera_id, fecha_limite, activo)
    VALUES ('TEMA_RICARDO_02', 'Análisis de Escalabilidad de Microservicios en la Nube', 'Evaluación de arquitecturas para SGTA basadas en microservicios.', v_estado_tema_activo_id, v_carrera_inf_id, '2025-07-15', TRUE)
    ON CONFLICT (codigo) DO UPDATE SET titulo = EXCLUDED.titulo
    RETURNING tema_id INTO v_tema_id_2;
    RAISE NOTICE 'Tema 2 (TEMA_RICARDO_02) ID: %', v_tema_id_2;

    -- Tema 3 (Un tema que podría NO asesorar Ricardo para probar el filtro)
    -- INSERT INTO tema (codigo, titulo, resumen, estado_tema_id, carrera_id, fecha_limite, activo)
    -- VALUES ('TEMA_OTRO_03', 'Impacto Social de las Redes Neuronales', 'Estudio ético y social.', v_estado_tema_activo_id, v_carrera_inf_id, '2025-08-01', TRUE)
    -- RETURNING tema_id INTO v_tema_id_3;
    -- RAISE NOTICE 'Tema 3 (TEMA_OTRO_03) ID: %', v_tema_id_3;


    -- 3. Asignar a Ricardo Meléndez como ASESOR a estos temas
    -- Asegurarse de que no existan ya relaciones activas duplicadas.
    IF v_tema_id_1 IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM usuario_tema WHERE usuario_id = v_asesor_usuario_id AND tema_id = v_tema_id_1 AND rol_id = v_rol_asesor_id AND activo = TRUE) THEN
            INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador, activo)
            VALUES (v_asesor_usuario_id, v_tema_id_1, v_rol_asesor_id, TRUE, FALSE, TRUE);
            RAISE NOTICE 'Ricardo Meléndez asignado como asesor al Tema ID: %', v_tema_id_1;
        ELSE
            RAISE NOTICE 'Ricardo Meléndez YA ESTABA asignado como asesor activo al Tema ID: %', v_tema_id_1;
        END IF;

        -- Opcional: Asignar un estudiante a este tema
        IF v_estudiante_id_1 IS NOT NULL AND v_rol_tesista_id IS NOT NULL THEN
             IF NOT EXISTS (SELECT 1 FROM usuario_tema WHERE usuario_id = v_estudiante_id_1 AND tema_id = v_tema_id_1 AND rol_id = v_rol_tesista_id AND activo = TRUE) THEN
                INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador, activo)
                VALUES (v_estudiante_id_1, v_tema_id_1, v_rol_tesista_id, TRUE, TRUE, TRUE);
                RAISE NOTICE 'Estudiante ID % asignado como tesista al Tema ID: %', v_estudiante_id_1, v_tema_id_1;
            END IF;
        END IF;
    END IF;

    IF v_tema_id_2 IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM usuario_tema WHERE usuario_id = v_asesor_usuario_id AND tema_id = v_tema_id_2 AND rol_id = v_rol_asesor_id AND activo = TRUE) THEN
            INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador, activo)
            VALUES (v_asesor_usuario_id, v_tema_id_2, v_rol_asesor_id, TRUE, FALSE, TRUE);
            RAISE NOTICE 'Ricardo Meléndez asignado como asesor al Tema ID: %', v_tema_id_2;
        ELSE
            RAISE NOTICE 'Ricardo Meléndez YA ESTABA asignado como asesor activo al Tema ID: %', v_tema_id_2;
        END IF;
        -- Opcional: Asignar otro estudiante a este tema
        IF v_estudiante_id_2 IS NOT NULL AND v_rol_tesista_id IS NOT NULL THEN
            IF NOT EXISTS (SELECT 1 FROM usuario_tema WHERE usuario_id = v_estudiante_id_2 AND tema_id = v_tema_id_2 AND rol_id = v_rol_tesista_id AND activo = TRUE) THEN
                INSERT INTO usuario_tema (usuario_id, tema_id, rol_id, asignado, creador, activo)
                VALUES (v_estudiante_id_2, v_tema_id_2, v_rol_tesista_id, TRUE, TRUE, TRUE);
                RAISE NOTICE 'Estudiante ID % asignado como tesista al Tema ID: %', v_estudiante_id_2, v_tema_id_2;
            END IF;
        END IF;
    END IF;

    -- No asignamos a Ricardo al TEMA_OTRO_03 para probar que no aparece en su lista.

    RAISE NOTICE 'Script de asignación de temas para Ricardo Meléndez completado.';

END $$;