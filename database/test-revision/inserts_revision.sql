
-- Insert Revisión 

INSERT INTO usuario_tema (
    usuario_id,
    tema_id,
    rol_id,
    asignado,
    rechazado,
    creador,
    prioridad,
    comentario,
    activo,
    fecha_creacion,
    fecha_modificacion
)
VALUES (
    10,       -- Tu usuario_id
    41,       -- Tema
    1,        -- Rol de asesor
    TRUE,     -- asignado
    FALSE,    -- rechazado
    TRUE,     -- creador
    NULL,     -- prioridad
    NULL,     -- comentario
    TRUE,     -- activo
    NOW(),    -- fecha_creacion
    NOW()     -- fecha_modificacion
);

UPDATE version_documento
SET entregable_x_tema_id = 26
WHERE version_documento_id = 1;

UPDATE revision_documento
SET estado_revision = 'por_aprobar'
WHERE revision_documento_id = 5;

