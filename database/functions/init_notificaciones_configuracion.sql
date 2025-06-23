-- ===============================================
-- Script de Inicialización de Configuración de Recordatorios
-- Versión: 1.0
-- Fecha: 2024
-- ===============================================

-- Crear configuraciones por defecto para todos los tesistas existentes
-- que no tengan ya una configuración de recordatorios

INSERT INTO configuracion_recordatorio (
    usuario_id,
    activo,
    dias_anticipacion,
    canal_correo,
    canal_sistema,
    fecha_creacion,
    fecha_modificacion
)
SELECT DISTINCT
    u.usuario_id,
    true AS activo,
    ARRAY[7, 3, 1, 0] AS dias_anticipacion, -- 7, 3, 1 días antes y el día de vencimiento
    true AS canal_correo,
    true AS canal_sistema,
    CURRENT_TIMESTAMP AS fecha_creacion,
    CURRENT_TIMESTAMP AS fecha_modificacion
FROM usuario u
INNER JOIN usuario_x_tema ut ON u.usuario_id = ut.usuario_id
INNER JOIN rol r ON ut.rol_id = r.rol_id
WHERE r.nombre = 'Tesista'
  AND ut.activo = true
  AND u.activo = true
  AND NOT EXISTS (
      SELECT 1 
      FROM configuracion_recordatorio cr 
      WHERE cr.usuario_id = u.usuario_id
  );

-- Verificar cuántas configuraciones se crearon
SELECT COUNT(*) as configuraciones_creadas 
FROM configuracion_recordatorio;

-- Mostrar estadísticas por defecto
SELECT 
    'Total tesistas activos' as descripcion,
    COUNT(DISTINCT u.usuario_id) as cantidad
FROM usuario u
INNER JOIN usuario_x_tema ut ON u.usuario_id = ut.usuario_id
INNER JOIN rol r ON ut.rol_id = r.rol_id
WHERE r.nombre = 'Tesista'
  AND ut.activo = true
  AND u.activo = true

UNION ALL

SELECT 
    'Configuraciones de recordatorio existentes' as descripcion,
    COUNT(*) as cantidad
FROM configuracion_recordatorio

UNION ALL

SELECT 
    'Configuraciones activas' as descripcion,
    COUNT(*) as cantidad
FROM configuracion_recordatorio
WHERE activo = true; 