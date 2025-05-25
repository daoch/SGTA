-- Function to get solicitudes by tema with pagination
CREATE OR REPLACE FUNCTION get_solicitudes_by_tema(
    tema_id INTEGER,
    offset_val INTEGER,
    limit_val INTEGER
)
RETURNS TABLE (
    solicitud_id INTEGER,
    fecha_creacion DATE,
    estado INTEGER,
    descripcion TEXT,
    respuesta TEXT,
    fecha_modificacion DATE,
    tipo_solicitud_id INTEGER,
    tipo_solicitud_nombre VARCHAR,
    tipo_solicitud_descripcion TEXT,
    usuario_id INTEGER,
    usuario_nombres VARCHAR,
    usuario_primer_apellido VARCHAR,
    usuario_segundo_apellido VARCHAR,
    usuario_correo VARCHAR,
    usuario_foto_perfil VARCHAR
) AS $$
BEGIN
    RETURN QUERY    SELECT 
        s.id,
        s.fecha_creacion::DATE,
        s.estado,
        s.descripcion,
        s.respuesta,
        s.fecha_modificacion::DATE,
        ts.id,
        ts.nombre,
        ts.descripcion,
        u.id,
        u.nombres,
        u.primer_apellido,
        u.segundo_apellido,
        u.correo_electronico,
        u.foto_perfil    FROM solicitud s
    INNER JOIN tipo_solicitud ts ON s.tipo_solicitud_id = ts.id
    INNER JOIN usuario_x_solicitud uxs ON s.id = uxs.solicitud_id AND uxs.destinatario = false
    INNER JOIN usuario u ON uxs.usuario_id = u.id
    WHERE s.tema_id = tema_id
    ORDER BY s.fecha_creacion DESC
    OFFSET offset_val
    LIMIT limit_val;
END;
$$ LANGUAGE plpgsql;

-- Function to count solicitudes by tema
CREATE OR REPLACE FUNCTION get_solicitudes_by_tema_count(tema_id INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM solicitud s
        WHERE s.tema_id = tema_id
    );
END;
$$ LANGUAGE plpgsql;
