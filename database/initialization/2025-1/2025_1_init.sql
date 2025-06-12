------------------------------------
--|     INICIO CONFIG: CICLO     |--
------------------------------------

INSERT INTO ciclo (semestre,
                   anio,
                   fecha_inicio,
                   fecha_fin,
                   activo) --defecto false. Se tiene que activar manualmente
    VALUES ('1', 2025, '2025-03-21', '2025-07-15', TRUE);

---- informática
--(1, 'Proyecto de fin de carrera 1', 4.5, INTERVAL '20 minutes'),
--(1, 'Proyecto de fin de carrera 2', 4.0, INTERVAL '20 minutes'),

WITH ciclo_2025_1 AS (SELECT ciclo_id
                          FROM ciclo
                          WHERE anio = 2025
                            AND semestre = '1')
INSERT
    INTO etapa_formativa_x_ciclo (etapa_formativa_id,
                                  ciclo_id,
                                  estado,
                                  activo)
SELECT ef.etapa_formativa_id,
       (SELECT ciclo_id FROM ciclo_2025_1) AS ciclo_id,
       'En Curso'                          AS estado,
       TRUE                                AS activo
    FROM etapa_formativa ef
    WHERE ef.activo = TRUE
      AND ef.carrera_id IN (1, 2, 3, 4)
    ORDER BY ef.etapa_formativa_id;

