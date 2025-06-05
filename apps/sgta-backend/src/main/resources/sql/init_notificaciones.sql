-- Script de inicialización para el sistema de notificaciones
-- HU07: Sistema de recordatorios automáticos para entregables

-- Insertar módulo de Reportes si no existe
INSERT INTO modulo (nombre, descripcion, activo)
SELECT 'Reportes', 'Módulo de reportes y estadísticas del sistema', true
WHERE NOT EXISTS (
    SELECT 1 FROM modulo WHERE nombre = 'Reportes' AND activo = true
);

-- Insertar tipos de notificación si no existen
INSERT INTO tipo_notificacion (nombre, descripcion, prioridad, activo)
SELECT 'informativa', 'Mensaje informativo para el usuario', 0, true
WHERE NOT EXISTS (
    SELECT 1 FROM tipo_notificacion WHERE nombre = 'informativa' AND activo = true
);

INSERT INTO tipo_notificacion (nombre, descripcion, prioridad, activo)
SELECT 'advertencia', 'Señal de posible problema o riesgo', 1, true
WHERE NOT EXISTS (
    SELECT 1 FROM tipo_notificacion WHERE nombre = 'advertencia' AND activo = true
);

INSERT INTO tipo_notificacion (nombre, descripcion, prioridad, activo)
SELECT 'recordatorio', 'Recordatorio de acción pendiente', 2, true
WHERE NOT EXISTS (
    SELECT 1 FROM tipo_notificacion WHERE nombre = 'recordatorio' AND activo = true
);

INSERT INTO tipo_notificacion (nombre, descripcion, prioridad, activo)
SELECT 'error', 'Notificación de error crítico', 3, true
WHERE NOT EXISTS (
    SELECT 1 FROM tipo_notificacion WHERE nombre = 'error' AND activo = true
);

-- Verificar que los datos se insertaron correctamente
SELECT 'Módulos insertados:' as info;
SELECT modulo_id, nombre, descripcion, activo FROM modulo WHERE nombre = 'Reportes';

SELECT 'Tipos de notificación insertados:' as info;
SELECT tipo_notificacion_id, nombre, descripcion, prioridad, activo 
FROM tipo_notificacion 
WHERE nombre IN ('informativa', 'advertencia', 'recordatorio', 'error')
ORDER BY prioridad; 