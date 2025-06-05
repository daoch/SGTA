-- Asegúrate de estar en el schema correcto si no lo has hecho globalmente
SET search_path TO sgtadb;

ALTER TABLE sgtadb.solicitud
ADD COLUMN IF NOT EXISTS asesor_propuesto_reasignacion_id INTEGER,
ADD COLUMN IF NOT EXISTS estado_reasignacion VARCHAR(50); -- Ajusta el tamaño de VARCHAR si es necesario

-- Añadir la constraint de Foreign Key para asesor_propuesto_reasignacion_id
-- Solo si la columna fue añadida o ya existe y no tiene la FK
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'sgtadb' AND table_name = 'solicitud' AND column_name = 'asesor_propuesto_reasignacion_id'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE table_schema = 'sgtadb' AND table_name = 'solicitud' AND constraint_name = 'fk_solicitud_asesor_propuesto'
    ) THEN
        ALTER TABLE sgtadb.solicitud
        ADD CONSTRAINT fk_solicitud_asesor_propuesto
        FOREIGN KEY (asesor_propuesto_reasignacion_id)
        REFERENCES sgtadb.usuario (usuario_id)
        ON DELETE SET NULL -- O ON DELETE RESTRICT si prefieres que no se pueda borrar un usuario si es asesor propuesto
        ON UPDATE CASCADE;
    END IF;
END $$;

-- Comentario sobre los nuevos campos (opcional, pero bueno para documentación)
COMMENT ON COLUMN sgtadb.solicitud.asesor_propuesto_reasignacion_id IS 'ID del usuario (asesor) que ha sido propuesto para la reasignación de este tema/solicitud.';
COMMENT ON COLUMN sgtadb.solicitud.estado_reasignacion IS 'Estado del proceso de reasignación después de que la solicitud de cese fue aprobada (ej. PENDIENTE_ACEPTACION_ASESOR, REASIGNACION_COMPLETADA, REASIGNACION_RECHAZADA_POR_ASESOR).';

SELECT 'Columnas asesor_propuesto_reasignacion_id y estado_reasignacion añadidas/verificadas en la tabla solicitud.' AS resultado;


--- AGREGAR CAMPO USUARIO_CREADOR A SOLICITUD
-- Asegúrate de estar en el schema correcto
ALTER TABLE sgtadb.solicitud
ADD COLUMN IF NOT EXISTS usuario_creador_id INTEGER;

-- Añadir la constraint de Foreign Key
-- (Solo si la columna fue añadida o ya existe y no tiene la FK, y si la columna usuario_creador_id será NOT NULL en el futuro)
-- Por ahora, para no romper datos existentes, no la hacemos NOT NULL inmediatamente.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'sgtadb' AND table_name = 'solicitud' AND column_name = 'usuario_creador_id'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE table_schema = 'sgtadb' AND table_name = 'solicitud' AND constraint_name = 'fk_solicitud_usuario_creador'
    ) THEN
        ALTER TABLE sgtadb.solicitud
        ADD CONSTRAINT fk_solicitud_usuario_creador
        FOREIGN KEY (usuario_creador_id)
        REFERENCES sgtadb.usuario (usuario_id)
        ON DELETE RESTRICT -- O SET NULL si prefieres, pero RESTRICT es más seguro para un creador
        ON UPDATE CASCADE;
    END IF;
END $$;

-- Una vez que todas las filas existentes tengan un usuario_creador_id válido, puedes hacerla NOT NULL:
-- ALTER TABLE sgtadb.solicitud ALTER COLUMN usuario_creador_id SET NOT NULL;
-- ¡CUIDADO! Esto fallará si hay filas con usuario_creador_id = NULL.
COMMENT ON COLUMN sgtadb.solicitud.usuario_creador_id IS 'ID del usuario que originó/creó la solicitud.';