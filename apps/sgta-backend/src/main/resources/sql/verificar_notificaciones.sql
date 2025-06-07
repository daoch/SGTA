-- Script de verificación para el sistema de notificaciones
-- HU07: Sistema de recordatorios automáticos para entregables

-- 1. Verificar que las tablas existen y tienen la estructura correcta
\echo '=== VERIFICACIÓN DE ESTRUCTURA DE TABLAS ==='

-- Verificar tabla entregable_x_tema
SELECT 'Estructura de entregable_x_tema:' as info;
\d entregable_x_tema;

-- Verificar tabla entregable
SELECT 'Estructura de entregable:' as info;
\d entregable;

-- Verificar tabla notificacion
SELECT 'Estructura de notificacion:' as info;
\d notificacion;

-- Verificar enum_estado_entrega
SELECT 'Valores del enum_estado_entrega:' as info;
SELECT enumlabel FROM pg_enum WHERE enumtypid = 'enum_estado_entrega'::regtype ORDER BY enumsortorder;

-- 2. Verificar que existen los módulos y tipos de notificación necesarios
\echo '=== VERIFICACIÓN DE DATOS MAESTROS ==='

-- Verificar módulo Reportes
SELECT 'Módulo Reportes:' as info;
SELECT modulo_id, nombre, descripcion, activo 
FROM modulo 
WHERE nombre = 'Reportes';

-- Verificar tipos de notificación
SELECT 'Tipos de notificación:' as info;
SELECT tipo_notificacion_id, nombre, descripcion, prioridad, activo 
FROM tipo_notificacion 
WHERE nombre IN ('informativa', 'advertencia', 'recordatorio', 'error')
ORDER BY prioridad;

-- 3. Verificar que hay datos de prueba (opcional)
\echo '=== DATOS DE PRUEBA (si existen) ==='

-- Contar entregables
SELECT 'Total de entregables:' as info, COUNT(*) as total
FROM entregable 
WHERE activo = true;

-- Contar entregables x tema
SELECT 'Total de entregable_x_tema:' as info, COUNT(*) as total
FROM entregable_x_tema 
WHERE activo = true;

-- Entregables próximos a vencer (próximos 7 días)
SELECT 'Entregables próximos a vencer (7 días):' as info, COUNT(*) as total
FROM entregable e
WHERE e.fecha_fin BETWEEN NOW() AND NOW() + INTERVAL '7 days'
  AND e.activo = true;

-- Entregables vencidos no enviados
SELECT 'Entregables vencidos no enviados:' as info, COUNT(*) as total
FROM entregable_x_tema ext
JOIN entregable e ON ext.entregable_id = e.entregable_id
WHERE ext.activo = true
  AND ext.estado = 'no_enviado'
  AND e.fecha_fin < NOW();

-- 4. Verificar relaciones importantes
\echo '=== VERIFICACIÓN DE RELACIONES ==='

-- Usuarios con rol Tesista
SELECT 'Usuarios con rol Tesista:' as info, COUNT(*) as total
FROM usuario_tema ut
JOIN rol r ON ut.rol_id = r.rol_id
WHERE ut.activo = true
  AND r.nombre = 'Tesista';

-- Temas activos con tesistas
SELECT 'Temas activos con tesistas:' as info, COUNT(DISTINCT ut.tema_id) as total
FROM usuario_tema ut
JOIN rol r ON ut.rol_id = r.rol_id
WHERE ut.activo = true
  AND r.nombre = 'Tesista';

\echo '=== VERIFICACIÓN COMPLETADA ==='; 