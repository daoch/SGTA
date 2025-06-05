-- Asegúrate de estar en el schema correcto si no lo has hecho globalmente
SET search_path TO sgtadb;

ALTER TABLE sgtadb.notificacion
ADD COLUMN IF NOT EXISTS enlace_redireccion VARCHAR(500);

-- Comentario sobre la nueva columna (opcional, pero bueno para documentación)
COMMENT ON COLUMN sgtadb.notificacion.enlace_redireccion IS 'Enlace URL opcional para redirigir al usuario al hacer clic en la notificación (ej. a una página específica de la aplicación).';

SELECT 'Columna enlace_redireccion añadida/verificada en la tabla notificacion.' AS resultado;