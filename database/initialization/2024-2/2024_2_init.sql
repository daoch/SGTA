INSERT INTO ciclo (semestre,
                   anio,
                   fecha_inicio,
                   fecha_fin,
                   activo)
    VALUES ('2', 2024, '2024-08-19', '2024-12-18', FALSE);

---- informática
--(1, 'Proyecto de fin de carrera 1', 4.5, INTERVAL '20 minutes'),
--(1, 'Proyecto de fin de carrera 2', 4.0, INTERVAL '20 minutes'),
---- civil
--(2, 'Plan de tesis', 4.5, INTERVAL '30 minutes'),
--(2, 'Trabajo de tesis', 4.0, INTERVAL '30 minutes'),
---- mecánica
--(3, 'Proyecto de tesis 1', 4.5, INTERVAL '20 minutes'),
--(3, 'Proyecto de tesis 2', 4.0, INTERVAL '20 minutes'),
---- industrial
--(4, 'Trabajo de Investigación para Bachillerato', 4.5, INTERVAL '30 minutes'),

WITH ciclo_2024_2 AS (SELECT ciclo_id
                          FROM ciclo
                          WHERE anio = 2024
                            AND semestre = '2')
INSERT
    INTO etapa_formativa_x_ciclo (etapa_formativa_id,
                                  ciclo_id,
                                  estado,
                                  activo)
SELECT ef.etapa_formativa_id,
       (SELECT ciclo_id FROM ciclo_2024_2) AS ciclo_id,
       'Finalizado'                        AS estado,
       TRUE                                AS activo
    FROM etapa_formativa ef
    WHERE ef.activo = FALSE
      AND ef.carrera_id IN (1, 2, 3, 4)
    ORDER BY ef.etapa_formativa_id;