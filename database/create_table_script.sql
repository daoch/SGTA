-- Active: 1748374313012@@localhost@5432@postgres@public
-- Asegúrate de estar en el schema correcto si no lo has hecho globalmente
--SET search_path TO sgtadb;

DO
$$
    BEGIN
        CREATE TYPE enum_tipo_dato AS ENUM (
            'string',
            'date',
            'integer',
            'booleano'
            );
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END
$$;

-- Tabla unidad_academica
CREATE TABLE IF NOT EXISTS unidad_academica (
    unidad_academica_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ALTER TABLE unidad_academica
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- Tabla carrera (depende de unidad_academica)
CREATE TABLE IF NOT EXISTS carrera (
    carrera_id SERIAL PRIMARY KEY,
    unidad_academica_id INTEGER NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_unidad_academica FOREIGN KEY (unidad_academica_id) REFERENCES unidad_academica (unidad_academica_id) ON DELETE RESTRICT
);

-- ALTER TABLE carrera
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- Tipo Usuario
CREATE TABLE IF NOT EXISTS tipo_usuario (
    tipo_usuario_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT tipo_usuario_unico UNIQUE (nombre)
);

-- ALTER TABLE tipo_usuario
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- Tipo Dedicacion

CREATE TABLE IF NOT EXISTS tipo_dedicacion (
    tipo_dedicacion_id SERIAL PRIMARY KEY,
    iniciales VARCHAR(10) NOT NULL,
    descripcion VARCHAR(100) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE
);

-- ALTER TABLE tipo_dedicacion
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- 3. Tabla usuario
CREATE TABLE IF NOT EXISTS usuario (
    usuario_id SERIAL PRIMARY KEY,
    tipo_usuario_id INTEGER NOT NULL,
    codigo_pucp VARCHAR(20),
    nombres VARCHAR(100) NOT NULL,
    primer_apellido VARCHAR(100) NOT NULL,
    segundo_apellido VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(255) UNIQUE NOT NULL,
    nivel_estudios VARCHAR(25),
    contrasena VARCHAR(255) NOT NULL,
    biografia TEXT,
    enlace_linkedin VARCHAR(255),
    enlace_repositorio VARCHAR(255),
    foto_perfil bytea,
    disponibilidad TEXT,
    tipo_disponibilidad TEXT,
    tipo_dedicacion_id INTEGER,
    id_cognito VARCHAR(255),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tipo_usuario FOREIGN KEY (tipo_usuario_id) REFERENCES tipo_usuario (tipo_usuario_id) ON DELETE RESTRICT,
    CONSTRAINT fk_tipo_dedicacion FOREIGN KEY (tipo_dedicacion_id) REFERENCES tipo_dedicacion (tipo_dedicacion_id) ON DELETE RESTRICT
);

-- ALTER TABLE usuario
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- 4. Tabla usuario_carrera (M:N entre usuario y carrera)
CREATE TABLE IF NOT EXISTS usuario_carrera (
    usuario_carrera_id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    carrera_id INTEGER NOT NULL,
    es_coordinador BOOLEAN NOT NULL DEFAULT FALSE,
    refresh_token TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (usuario_id) ON DELETE CASCADE,
    CONSTRAINT fk_carrera FOREIGN KEY (carrera_id) REFERENCES carrera (carrera_id) ON DELETE RESTRICT,
    CONSTRAINT unico_usuario_carrera UNIQUE (usuario_id, carrera_id)
);

-- ALTER TABLE usuario_carrera
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

CREATE TABLE IF NOT EXISTS estado_tema (
    estado_tema_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ALTER TABLE estado_tema
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- Tabla enlaces
CREATE TABLE IF NOT EXISTS enlace_usuario (
    enlace_usuario_id SERIAL PRIMARY KEY,
    plataforma VARCHAR(100) NOT NULL,
    enlace VARCHAR(250) NOT NULL,
    usuario_id INTEGER NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_enlace_usuario_u FOREIGN KEY (usuario_id) REFERENCES usuario (usuario_id) ON DELETE cascade
);

-- ALTER TABLE enlace_usuario
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;


-- 1) Tabla proyecto
CREATE TABLE IF NOT EXISTS proyecto (
    proyecto_id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ALTER TABLE proyecto
--     ADD COLUMN  IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- 1) TEMA
CREATE TABLE IF NOT EXISTS tema (
    tema_id SERIAL PRIMARY KEY,
    codigo VARCHAR(255),
    titulo VARCHAR(255) NOT NULL,
    resumen TEXT,
    metodologia TEXT,
    objetivos TEXT,
    portafolio_url VARCHAR(255),
    estado_tema_id INTEGER NOT NULL,
    proyecto_id INTEGER,
    carrera_id INTEGER,
    fecha_limite TIMESTAMP WITH TIME ZONE,
    fecha_finalizacion TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    requisitos TEXT,
    CONSTRAINT fk_estado_tema FOREIGN KEY (estado_tema_id) REFERENCES estado_tema (estado_tema_id) ON DELETE RESTRICT,
    CONSTRAINT fk_proyecto FOREIGN KEY (proyecto_id) REFERENCES proyecto (proyecto_id) ON DELETE RESTRICT,
    CONSTRAINT fk_t_carrera FOREIGN KEY (carrera_id) REFERENCES carrera (carrera_id) ON DELETE RESTRICT
);

-- ALTER TABLE tema
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

CREATE TABLE IF NOT EXISTS recurso (
    recurso_id SERIAL PRIMARY KEY,
    tema_id INTEGER NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    documento_url VARCHAR(500), -- URL al archivo o recurso
    estado VARCHAR(100), -- por ejemplo: 'PUBLICADO', 'PENDIENTE', etc.
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tema FOREIGN KEY (tema_id) REFERENCES tema (tema_id) ON DELETE RESTRICT
);

-- ALTER TABLE recurso
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- 2) HISTORIAL_TEMA (depende de tema)
CREATE TABLE IF NOT EXISTS historial_tema (
    historial_tema_id SERIAL PRIMARY KEY,
    tema_id INTEGER NOT NULL,
    codigo VARCHAR(255),
    titulo VARCHAR(255) NOT NULL,
    resumen TEXT,
    metodologia TEXT,
    objetivos TEXT,
    descripcion_cambio TEXT,
    portafolio_url VARCHAR(255),
    estado_tema_id INTEGER NOT NULL,
    proyecto_id INTEGER,
    carrera_id INTEGER,
    fecha_limite TIMESTAMP WITH TIME ZONE,
    fecha_finalizacion TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subareas_snapshot      TEXT   DEFAULT '',
    asesores_snapshot      TEXT   DEFAULT '',
    tesistas_snapshot      TEXT   DEFAULT '',
    CONSTRAINT fk_tema FOREIGN KEY (tema_id) REFERENCES tema (tema_id) ON DELETE RESTRICT
);

-- ALTER TABLE historial_tema
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- Agregar clave foránea para estado_tema_id
ALTER TABLE historial_tema
ADD CONSTRAINT fk_historial_tema_estado_tema FOREIGN KEY (estado_tema_id) REFERENCES estado_tema (estado_tema_id) ON DELETE RESTRICT;

-- Agregar clave foránea para proyecto_id
ALTER TABLE historial_tema
ADD CONSTRAINT fk_historial_tema_proyecto FOREIGN KEY (proyecto_id) REFERENCES proyecto (proyecto_id) ON DELETE RESTRICT;

-- Agregar clave foránea para carrera_id
ALTER TABLE historial_tema
ADD CONSTRAINT fk_historial_tema_carrera FOREIGN KEY (carrera_id) REFERENCES carrera (carrera_id) ON DELETE RESTRICT;

CREATE TABLE IF NOT EXISTS tema_similar (
    tema_similar_id SERIAL PRIMARY KEY,
    tema_id INTEGER NOT NULL REFERENCES tema (tema_id) ON DELETE CASCADE,
    tema_relacion_id INTEGER NOT NULL REFERENCES tema (tema_id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES usuario (usuario_id) ON DELETE RESTRICT,
    porcentaje_similitud NUMERIC(5, 2) NOT NULL DEFAULT 0 CHECK (
        porcentaje_similitud >= 0
        AND porcentaje_similitud <= 100
    ),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_temas_distintos CHECK (tema_id <> tema_relacion_id)
);

-- ALTER TABLE tema_similar
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- 3) ROL
CREATE TABLE IF NOT EXISTS rol (
    rol_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT rol_unico UNIQUE (nombre)
);

-- ALTER TABLE rol
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- 4) TIPO_SOLICITUD
CREATE TABLE IF NOT EXISTS tipo_solicitud (
    tipo_solicitud_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- NUEVAS TABLAS MANEJO DE ESTADOS Y ACCIONES EN SOLICITUD

-- ALTER TABLE tipo_solicitud
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- Tabla de roles en la solicitud
CREATE TABLE IF NOT EXISTS rol_solicitud (
    rol_solicitud_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ALTER TABLE rol_solicitud
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- Tabla de estados de solicitud
CREATE TABLE IF NOT EXISTS estado_solicitud (
    estado_solicitud_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ALTER TABLE estado_solicitud
--     ADD COLUMN IF NOT EXISTS  usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- Tabla de acciones sobre la solicitud
CREATE TABLE IF NOT EXISTS accion_solicitud (
    accion_solicitud_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ALTER TABLE accion_solicitud
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- 5) SOLICITUD (depende de tipo_solicitud)
CREATE TABLE IF NOT EXISTS solicitud
(
    solicitud_id       SERIAL PRIMARY KEY,
    descripcion        TEXT,
    tipo_solicitud_id  INTEGER                  NOT NULL,
    tema_id            INTEGER                  NOT NULL,
    -- Nuevas columnas en transición
    estado_solicitud   INTEGER,
    fecha_resolucion   TIMESTAMP WITH TIME ZONE,

-- Columnas antiguas mantenidas por compatibilidad


estado             INTEGER                  NOT NULL,

    activo             BOOLEAN                  NOT NULL DEFAULT TRUE,
    respuesta          TEXT,
    fecha_creacion     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_solicitud_tipo
        FOREIGN KEY (tipo_solicitud_id)
            REFERENCES tipo_solicitud (tipo_solicitud_id)
            ON DELETE RESTRICT,
    CONSTRAINT fk_s_tema
        FOREIGN KEY (tema_id)
            REFERENCES tema (tema_id)
            ON DELETE RESTRICT,
    CONSTRAINT fk_s_es
        FOREIGN KEY (estado_solicitud)
            REFERENCES estado_solicitud (estado_solicitud_id)
            ON DELETE RESTRICT
);


-- ALTER TABLE solicitud
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;
-- Asegúrate de estar en el schema correcto si no lo has hecho globalmente
--SET search_path TO sgtadb;

ALTER TABLE solicitud
ADD COLUMN IF NOT EXISTS asesor_propuesto_reasignacion_id INTEGER,
ADD COLUMN IF NOT EXISTS estado_reasignacion VARCHAR(50);
-- Ajusta el tamaño de VARCHAR si es necesario

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
        ALTER TABLE solicitud
        ADD CONSTRAINT fk_solicitud_asesor_propuesto
        FOREIGN KEY (asesor_propuesto_reasignacion_id)
        REFERENCES usuario (usuario_id)
        ON DELETE SET NULL -- O ON DELETE RESTRICT si prefieres que no se pueda borrar un usuario si es asesor propuesto
        ON UPDATE CASCADE;
    END IF;
END $$;

-- Comentario sobre los nuevos campos (opcional, pero bueno para documentación)
COMMENT ON COLUMN solicitud.asesor_propuesto_reasignacion_id IS 'ID del usuario (asesor) que ha sido propuesto para la reasignación de este tema/solicitud.';

COMMENT ON COLUMN solicitud.estado_reasignacion IS 'Estado del proceso de reasignación después de que la solicitud de cese fue aprobada (ej. PENDIENTE_ACEPTACION_ASESOR, REASIGNACION_COMPLETADA, REASIGNACION_RECHAZADA_POR_ASESOR).';

SELECT 'Columnas asesor_propuesto_reasignacion_id y estado_reasignacion añadidas/verificadas en la tabla solicitud.' AS resultado;

--- AGREGAR CAMPO USUARIO_CREADOR A SOLICITUD
-- Asegúrate de estar en el schema correcto
--SET search_path TO sgtadb; -- Esta línea es redundante si ya la pusiste para el bloque anterior de solicitud, pero no hace daño.

ALTER TABLE solicitud
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
        ALTER TABLE solicitud
        ADD CONSTRAINT fk_solicitud_usuario_creador
        FOREIGN KEY (usuario_creador_id)
        REFERENCES usuario (usuario_id)
        ON DELETE RESTRICT -- O SET NULL si prefieres, pero RESTRICT es más seguro para un creador
        ON UPDATE CASCADE;
    END IF;
END $$;

-- Una vez que todas las filas existentes tengan un usuario_creador_id válido, puedes hacerla NOT NULL:
-- ALTER TABLE solicitud ALTER COLUMN usuario_creador_id SET NOT NULL;
-- ¡CUIDADO! Esto fallará si hay filas con usuario_creador_id = NULL.
COMMENT ON COLUMN solicitud.usuario_creador_id IS 'ID del usuario que originó/creó la solicitud.';

-- (Opcional, pero recomendado para consistencia con los otros bloques)
-- SELECT 'Columna usuario_creador_id añadida/verificada en la tabla solicitud.' AS resultado;

-- 6) USUARIO_SOLICITUD (M:N entre usuario y solicitud)
CREATE TABLE IF NOT EXISTS usuario_solicitud
(
    usuario_solicitud_id SERIAL PRIMARY KEY,
    usuario_id           INTEGER                  NOT NULL,
    solicitud_id         INTEGER                  NOT NULL,

-- Nuevas columnas en transición
accion_solicitud INTEGER,
rol_solicitud INTEGER,
fecha_accion TIMESTAMP WITH TIME ZONE,

-- Columnas antiguas mantenidas por compatibilidad


solicitud_completada BOOLEAN                  NOT NULL DEFAULT FALSE,
    aprobado             BOOLEAN                  NOT NULL DEFAULT FALSE,
    destinatario         BOOLEAN                  NOT NULL DEFAULT FALSE,

    comentario           TEXT,
    activo               BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario
        FOREIGN KEY (usuario_id)
            REFERENCES usuario (usuario_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_solicitud
        FOREIGN KEY (solicitud_id)
            REFERENCES solicitud (solicitud_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_us_as
        FOREIGN KEY (accion_solicitud)
            REFERENCES accion_solicitud (accion_solicitud_id)
            ON DELETE RESTRICT,
    CONSTRAINT fk_us_rs
        FOREIGN KEY (rol_solicitud)
            REFERENCES rol_solicitud (rol_solicitud_id)
            ON DELETE RESTRICT
);

-- ALTER TABLE usuario_solicitud
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

CREATE TABLE IF NOT EXISTS tipo_rechazo_tema (
    tipo_rechazo_tema_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- ALTER TABLE tipo_rechazo_tema
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- 7) USUARIO_TEMA (M:N entre usuario, tema y rol)
CREATE TABLE IF NOT EXISTS usuario_tema (
    usuario_tema_id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    tema_id INTEGER NOT NULL,
    rol_id INTEGER NOT NULL,
    tipo_rechazo_tema_id INTEGER,
    asignado BOOLEAN NOT NULL DEFAULT FALSE,
    rechazado BOOLEAN NOT NULL DEFAULT FALSE,
    creador BOOLEAN NOT NULL DEFAULT FALSE,
    prioridad INTEGER,
    comentario TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (usuario_id) ON DELETE CASCADE,
    CONSTRAINT fk_tema FOREIGN KEY (tema_id) REFERENCES tema (tema_id) ON DELETE CASCADE,
    CONSTRAINT fk_rol FOREIGN KEY (rol_id) REFERENCES rol (rol_id) ON DELETE RESTRICT,
    CONSTRAINT fk_tipo_rechazo_tema FOREIGN KEY (tipo_rechazo_tema_id) REFERENCES tipo_rechazo_tema (tipo_rechazo_tema_id) ON DELETE RESTRICT
);

-- ALTER TABLE usuario_tema
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- 8) AREA_CONOCIMIENTO
CREATE TABLE IF NOT EXISTS area_conocimiento (
    area_conocimiento_id SERIAL PRIMARY KEY,
    carrera_id INTEGER NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ac_carrera FOREIGN KEY (carrera_id) REFERENCES carrera (carrera_id) ON DELETE RESTRICT
);

-- ALTER TABLE area_conocimiento
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- 9) SUB_AREA_CONOCIMIENTO (depende de area_conocimiento)
CREATE TABLE IF NOT EXISTS sub_area_conocimiento (
    sub_area_conocimiento_id SERIAL PRIMARY KEY,
    area_conocimiento_id INTEGER NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_area_conocimiento FOREIGN KEY (area_conocimiento_id) REFERENCES area_conocimiento (area_conocimiento_id) ON DELETE RESTRICT
);

-- ALTER TABLE sub_area_conocimiento
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- 10) SUB_AREA_CONOCIMIENTO_TEMA (M:N entre sub_area_conocimiento y tema)
CREATE TABLE IF NOT EXISTS sub_area_conocimiento_tema (
    sub_area_conocimiento_id INTEGER NOT NULL,
    tema_id INTEGER NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (
        sub_area_conocimiento_id,
        tema_id
    ),
    CONSTRAINT fk_sact_sac FOREIGN KEY (sub_area_conocimiento_id) REFERENCES sub_area_conocimiento (sub_area_conocimiento_id) ON DELETE CASCADE,
    CONSTRAINT fk_sact_tema FOREIGN KEY (tema_id) REFERENCES tema (tema_id) ON DELETE CASCADE
);

-- ALTER TABLE sub_area_conocimiento_tema
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- 11) USUARIO_SUB_AREA_CONOCIMIENTO (M:N entre usuario y sub_area_conocimiento)
CREATE TABLE IF NOT EXISTS usuario_sub_area_conocimiento (
    usuario_sub_area_conocimiento_id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    sub_area_conocimiento_id INTEGER NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usac_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (usuario_id) ON DELETE CASCADE,
    CONSTRAINT fk_usac_sac FOREIGN KEY (sub_area_conocimiento_id) REFERENCES sub_area_conocimiento (sub_area_conocimiento_id) ON DELETE RESTRICT
);

-- ALTER TABLE usuario_sub_area_conocimiento
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- 12) USUARIO_AREA_CONOCIMIENTO (M:N entre usuario y area_conocimiento)
CREATE TABLE IF NOT EXISTS usuario_area_conocimiento (
    usuario_area_conocimiento_id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    area_conocimiento_id INTEGER NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_uac_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (usuario_id) ON DELETE CASCADE,
    CONSTRAINT fk_uac_ac FOREIGN KEY (area_conocimiento_id) REFERENCES area_conocimiento (area_conocimiento_id) ON DELETE RESTRICT
);

-- ALTER TABLE usuario_area_conocimiento
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- USUARIO_ROL
CREATE TABLE IF NOT EXISTS usuario_rol (
    usuario_rol_id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    rol_id INTEGER NOT NULL,
    activo BOOLEAN NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ur_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (usuario_id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_rol FOREIGN KEY (rol_id) REFERENCES rol (rol_id) ON DELETE CASCADE
);

-- ALTER TABLE usuario_rol
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- 3) MODULO
CREATE TABLE IF NOT EXISTS modulo (
    modulo_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 1) PERMISO
CREATE TABLE IF NOT EXISTS permiso (
    permiso_id SERIAL PRIMARY KEY,
    modulo_id INTEGER NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_modulo FOREIGN KEY (modulo_id) REFERENCES modulo (modulo_id) ON DELETE RESTRICT
);

-- 4) TIPO_NOTIFICACION
CREATE TABLE IF NOT EXISTS tipo_notificacion (
    tipo_notificacion_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    prioridad INTEGER NOT NULL DEFAULT 0,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT tipo_notificacion_unico UNIQUE (nombre)
);

-- 5) TIPO_USUARIO_PERMISO (relación M:N entre tipo_usuario y permiso)
CREATE TABLE IF NOT EXISTS tipo_usuario_permiso (
    tipo_usua_permiso_id SERIAL PRIMARY KEY,
    tipo_usuario_id INTEGER NOT NULL,
    permiso_id INTEGER NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tup_tipo_usuario FOREIGN KEY (tipo_usuario_id) REFERENCES tipo_usuario (tipo_usuario_id) ON DELETE CASCADE,
    CONSTRAINT fk_tup_permiso FOREIGN KEY (permiso_id) REFERENCES permiso (permiso_id) ON DELETE CASCADE
);

-- 6) NOTIFICACION
CREATE TABLE IF NOT EXISTS notificacion (
    notificacion_id SERIAL PRIMARY KEY,
    mensaje TEXT NOT NULL,
    canal VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    modulo_id INTEGER NOT NULL,
    tipo_notificacion_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL, -- debe existir tabla usuario(usuario_id)
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_not_modulo FOREIGN KEY (modulo_id) REFERENCES modulo (modulo_id) ON DELETE RESTRICT,
    CONSTRAINT fk_not_tipo_notificacion FOREIGN KEY (tipo_notificacion_id) REFERENCES tipo_notificacion (tipo_notificacion_id) ON DELETE RESTRICT,
    CONSTRAINT fk_not_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (usuario_id) ON DELETE CASCADE
);

-- Asegúrate de estar en el schema correcto si no lo has hecho globalmente
--SET search_path TO sgtadb;

ALTER TABLE notificacion
ADD COLUMN IF NOT EXISTS enlace_redireccion VARCHAR(500);

-- Comentario sobre la nueva columna (opcional, pero bueno para documentación)
COMMENT ON COLUMN notificacion.enlace_redireccion IS 'Enlace URL opcional para redirigir al usuario al hacer clic en la notificación (ej. a una página específica de la aplicación).';

SELECT 'Columna enlace_redireccion añadida/verificada en la tabla notificacion.' AS resultado;

-- 1) Tabla grupo_investigacion
CREATE TABLE IF NOT EXISTS grupo_investigacion (
    grupo_investigacion_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ALTER TABLE grupo_investigacion
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- 2) Tabla usuario_grupo_investigacion (asigna usuarios a grupos)
CREATE TABLE IF NOT EXISTS usuario_grupo_investigacion (
    usuario_grupo_investigacion_id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    grupo_investigacion_id INTEGER NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ugi_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (usuario_id) ON DELETE CASCADE,
    CONSTRAINT fk_ugi_grupo FOREIGN KEY (grupo_investigacion_id) REFERENCES grupo_investigacion (grupo_investigacion_id) ON DELETE CASCADE
);

-- ALTER TABLE usuario_grupo_investigacion
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- 2) Tabla usuario_proyecto (relación M:N entre usuario y proyecto)
CREATE TABLE IF NOT EXISTS usuario_proyecto (
    usuario_proyecto_id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    proyecto_id INTEGER NOT NULL,
    lider_proyecto BOOLEAN NOT NULL DEFAULT FALSE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_up_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (usuario_id) ON DELETE CASCADE,
    CONSTRAINT fk_up_proyecto FOREIGN KEY (proyecto_id) REFERENCES proyecto (proyecto_id) ON DELETE CASCADE
);

-- ALTER TABLE usuario_proyecto
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- 3) Tabla grupo_investigacion_proyecto (relaciona grupos con proyectos)
CREATE TABLE IF NOT EXISTS grupo_investigacion_proyecto (
    grupo_investigacion_proyecto_id SERIAL PRIMARY KEY,
    grupo_investigacion_id INTEGER NOT NULL,
    proyecto_id INTEGER NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_gip_grupo FOREIGN KEY (grupo_investigacion_id) REFERENCES grupo_investigacion (grupo_investigacion_id) ON DELETE CASCADE,
    CONSTRAINT fk_gip_proyecto FOREIGN KEY (proyecto_id) REFERENCES proyecto (proyecto_id) ON DELETE CASCADE
);

-- ALTER TABLE grupo_investigacion_proyecto
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

CREATE TABLE IF NOT EXISTS etapa_formativa (
    etapa_formativa_id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    creditaje_por_tema NUMERIC(6, 2),
    duracion_exposicion INTERVAL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    carrera_id INTEGER NOT NULL,
    CONSTRAINT fk_area_conocimiento_carrera FOREIGN KEY (carrera_id) REFERENCES carrera (carrera_id)
);


-- ALTER TABLE etapa_formativa
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- 1) Tabla parametro_configuracion
CREATE TABLE IF NOT EXISTS parametro_configuracion (
    parametro_configuracion_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    modulo_id INTEGER NOT NULL,
    tipo enum_tipo_dato NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pc_modulo FOREIGN KEY (modulo_id) REFERENCES modulo (modulo_id) ON DELETE RESTRICT
);

-- 2) Tabla carrera_parametro_configuracion (M:N entre carrera y parametro_configuracion)
CREATE TABLE IF NOT EXISTS carrera_parametro_configuracion (
    carrera_parametro_configuracion_id SERIAL PRIMARY KEY,
    valor TEXT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    carrera_id INTEGER NOT NULL,
    parametro_configuracion_id INTEGER NOT NULL,
    etapa_formativa_id INTEGER, -- opcional, puede ser NULL
    -- si agregan el fk de etapa_formativa, no le pongan NOT NULL
    CONSTRAINT fk_cpc_carrera FOREIGN KEY (carrera_id) REFERENCES carrera (carrera_id) ON DELETE CASCADE,
    CONSTRAINT fk_cpc_parametro_configuracion FOREIGN KEY (parametro_configuracion_id) REFERENCES parametro_configuracion (parametro_configuracion_id) ON DELETE CASCADE,
    CONSTRAINT fk_cpc_grupo FOREIGN KEY (etapa_formativa_id) REFERENCES etapa_formativa (etapa_formativa_id) ON DELETE CASCADE
);

--- MODULO DE JURADOS

---enums

DO
$$
    BEGIN
        CREATE TYPE enum_estado_exposicion AS ENUM (
            'sin_programar',
            'esperando_respuesta',
            'esperando_aprobacion',
            'programada',
            'calificada',
            'completada',
            'cancelada'
            );
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END
$$;

DO
$$
    BEGIN
        CREATE TYPE enum_estado_usuario_exposicion AS ENUM (
            'esperando_respuesta',
            'aceptado',
            'rechazado'
            );
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END
$$;

DO
$$
    BEGIN
        CREATE TYPE enum_tipo_sala_exposicion AS ENUM (
            'presencial',
            'virtual'
            );
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END
$$;

--MAESTRAS O SIN REFERENCIAS

CREATE TABLE IF NOT EXISTS ciclo (
    ciclo_id SERIAL PRIMARY KEY,
    semestre VARCHAR(10) NOT NULL,
    anio INTEGER NOT NULL,
    nombre VARCHAR(255) GENERATED ALWAYS AS (
        anio::VARCHAR(255) || '-' || semestre
    ) STORED,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT ciclo_unico UNIQUE (nombre)
);

-- ALTER TABLE ciclo
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

CREATE TABLE IF NOT EXISTS estado_planificacion (
    estado_planificacion_id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sala_exposicion (
    sala_exposicion_id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    tipo_sala_exposicion enum_tipo_sala_exposicion NOT NULL DEFAULT 'presencial', --enum_tipo_sala_exposicion | VARCHAR(255)
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tablas para el módulo de exposiciones (corregidas)

-- Tabla etapa_formativa_x_ciclo
CREATE TABLE IF NOT EXISTS etapa_formativa_x_ciclo (
    etapa_formativa_x_ciclo_id SERIAL PRIMARY KEY,
    etapa_formativa_id INTEGER NOT NULL,
    ciclo_id INTEGER NOT NULL,
    estado TEXT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_efc_etapa_formativa FOREIGN KEY (etapa_formativa_id) REFERENCES etapa_formativa (etapa_formativa_id) ON DELETE RESTRICT,
    CONSTRAINT fk_efc_ciclo FOREIGN KEY (ciclo_id) REFERENCES ciclo (ciclo_id) ON DELETE RESTRICT
);

-- ALTER TABLE etapa_formativa_x_ciclo
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

CREATE TABLE IF NOT EXISTS etapa_formativa_x_ciclo_x_tema (
    etapa_formativa_x_ciclo_x_tema_id SERIAL PRIMARY KEY,
    etapa_formativa_x_ciclo_id INTEGER NOT NULL,
    tema_id INTEGER NOT NULL,
    aprobado BOOLEAN,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_efcxt_efc FOREIGN KEY (etapa_formativa_x_ciclo_id) REFERENCES etapa_formativa_x_ciclo (etapa_formativa_x_ciclo_id) ON DELETE RESTRICT,
    CONSTRAINT fk_efcxt_tema FOREIGN KEY (tema_id) REFERENCES tema (tema_id) ON DELETE RESTRICT,
    CONSTRAINT unica_efxc_x_tema UNIQUE (etapa_formativa_x_ciclo_id, tema_id)
);

-- ALTER TABLE etapa_formativa_x_ciclo_x_tema
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

-- Tabla exposicion
CREATE TABLE IF NOT EXISTS exposicion (
    exposicion_id SERIAL PRIMARY KEY,
    etapa_formativa_x_ciclo_id INTEGER NOT NULL,
    estado_planificacion_id INTEGER NOT NULL,
    entregable_id INTEGER NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_texefc_ef_x_c FOREIGN KEY (etapa_formativa_x_ciclo_id) REFERENCES etapa_formativa_x_ciclo (etapa_formativa_x_ciclo_id) ON DELETE RESTRICT,
    CONSTRAINT fk_exp_estado_planificacion FOREIGN KEY (estado_planificacion_id) REFERENCES estado_planificacion (estado_planificacion_id) ON DELETE RESTRICT,
    CONSTRAINT fk_exp_entregable FOREIGN KEY (entregable_id) REFERENCES entregable (entregable_id) ON DELETE RESTRICT;
);

-- Tabla jornada_exposicion
CREATE TABLE IF NOT EXISTS jornada_exposicion (
    jornada_exposicion_id SERIAL PRIMARY KEY,
    exposicion_id INTEGER NOT NULL,
    datetime_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    datetime_fin TIMESTAMP WITH TIME ZONE NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_je_exposicion FOREIGN KEY (exposicion_id) REFERENCES exposicion (exposicion_id) ON DELETE RESTRICT
);

-- Tabla jornada_exposicion_x_sala_exposicion
CREATE TABLE IF NOT EXISTS jornada_exposicion_x_sala_exposicion (
    jornada_exposicion_x_sala_id SERIAL PRIMARY KEY,
    jornada_exposicion_id INTEGER NOT NULL,
    sala_exposicion_id INTEGER NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_jexs_jornada_exposicion FOREIGN KEY (jornada_exposicion_id) REFERENCES jornada_exposicion (jornada_exposicion_id) ON DELETE RESTRICT,
    CONSTRAINT fk_jexs_sala_exposicion FOREIGN KEY (sala_exposicion_id) REFERENCES sala_exposicion (sala_exposicion_id) ON DELETE RESTRICT
);

-- Tabla bloque_horario_exposicion
CREATE TABLE IF NOT EXISTS bloque_horario_exposicion (
    bloque_horario_exposicion_id SERIAL PRIMARY KEY,
    jornada_exposicion_x_sala_id INTEGER NOT NULL,
    exposicion_x_tema_id INTEGER,
    es_bloque_reservado BOOLEAN NOT NULL DEFAULT FALSE,
    es_bloque_bloqueado BOOLEAN NOT NULL DEFAULT FALSE,
    datetime_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    datetime_fin TIMESTAMP WITH TIME ZONE NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bhe_jornada_exposicion_x_sala FOREIGN KEY (jornada_exposicion_x_sala_id) REFERENCES jornada_exposicion_x_sala_exposicion (jornada_exposicion_x_sala_id) ON DELETE RESTRICT
);

-- Tabla exposicion_x_tema
CREATE TABLE IF NOT EXISTS exposicion_x_tema (
    exposicion_x_tema_id SERIAL PRIMARY KEY,
    exposicion_id INTEGER NOT NULL,
    tema_id INTEGER NOT NULL,
    --bloque_horario_exposicion_id      INTEGER,
    --revision_criterio_x_exposicion_id INTEGER,
    link_exposicion TEXT,
    link_grabacion TEXT,
    estado_exposicion enum_estado_exposicion NOT NULL DEFAULT 'sin_programar', --enum_estado_exposicion | VARCHAR(255)
    nota_final NUMERIC(6, 2),
    fecha_limite_revision DATE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ext_exposicion FOREIGN KEY (exposicion_id) REFERENCES exposicion (exposicion_id) ON DELETE RESTRICT,
    CONSTRAINT fk_ext_tema FOREIGN KEY (tema_id) REFERENCES tema (tema_id) ON DELETE RESTRICT,
    CONSTRAINT unica_exposicion_x_tema UNIQUE (exposicion_id, tema_id)
    --CONSTRAINT fk_ext_bloque_horario
    --    FOREIGN KEY (bloque_horario_exposicion_id)
    --        REFERENCES bloque_horario_exposicion (bloque_horario_exposicion_id)
    --        ON DELETE RESTRICT
);

--ALTER TABLE exposicion_x_tema
--    ADD CONSTRAINT unica_exposicion_x_tema UNIQUE (exposicion_id, tema_id);

-- Tabla criterio_exposicion
CREATE TABLE IF NOT EXISTS criterio_exposicion (
    criterio_exposicion_id SERIAL PRIMARY KEY,
    exposicion_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    nota_maxima NUMERIC(6, 2) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ce_exposicion FOREIGN KEY (exposicion_id) REFERENCES exposicion (exposicion_id) ON DELETE RESTRICT
);

-- Tabla revision_criterio_x_exposicion
CREATE TABLE IF NOT EXISTS revision_criterio_x_exposicion (
    revision_criterio_x_exposicion_id SERIAL PRIMARY KEY,
    exposicion_x_tema_id INTEGER NOT NULL,
    criterio_exposicion_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    nota NUMERIC(6, 2),
    revisado BOOLEAN NOT NULL DEFAULT FALSE,
    observacion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rcxe_exposicion_x_tema FOREIGN KEY (exposicion_x_tema_id) REFERENCES exposicion_x_tema (exposicion_x_tema_id) ON DELETE RESTRICT,
    CONSTRAINT fk_rcxe_criterio_exposicion FOREIGN KEY (criterio_exposicion_id) REFERENCES criterio_exposicion (criterio_exposicion_id) ON DELETE RESTRICT,
    CONSTRAINT fk_rcxe_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (usuario_id) ON DELETE RESTRICT
);

-- Tabla control_exposicion_usuario
CREATE TABLE IF NOT EXISTS control_exposicion_usuario (
    control_exposicion_usuario_id SERIAL PRIMARY KEY,
    exposicion_x_tema_id INTEGER NOT NULL,
    usuario_x_tema_id INTEGER NOT NULL,
    estado_exposicion_usuario VARCHAR(255), --enum_estado_usuario_exposicion
    observaciones_finales_exposicion TEXT,
    asistio BOOLEAN,
    nota_revision NUMERIC(6, 2),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ceu_exposicion_x_tema FOREIGN KEY (exposicion_x_tema_id) REFERENCES exposicion_x_tema (exposicion_x_tema_id) ON DELETE RESTRICT,
    CONSTRAINT fk_ceu_usuario_x_tema FOREIGN KEY (usuario_x_tema_id) REFERENCES usuario_tema (usuario_tema_id) ON DELETE RESTRICT
);

-- Tabla etapa_formativa_x_sala_exposicion
CREATE TABLE IF NOT EXISTS etapa_formativa_x_sala_exposicion (
    etapa_formativa_x_sala_id SERIAL PRIMARY KEY,
    etapa_formativa_id INTEGER NOT NULL,
    sala_exposicion_id INTEGER NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_efxs_etapa_formativa FOREIGN KEY (etapa_formativa_id) REFERENCES etapa_formativa (etapa_formativa_id) ON DELETE RESTRICT,
    CONSTRAINT fk_efxs_sala_exposicion FOREIGN KEY (sala_exposicion_id) REFERENCES sala_exposicion (sala_exposicion_id) ON DELETE RESTRICT
);

-- Tabla restriccion_exposicion
CREATE TABLE IF NOT EXISTS restriccion_exposicion (
    restriccion_exposicion_id SERIAL PRIMARY KEY,
    exposicion_x_tema_id INTEGER NOT NULL,
    datetime_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    datetime_fin TIMESTAMP WITH TIME ZONE NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_re_exposicion_x_tema FOREIGN KEY (exposicion_x_tema_id) REFERENCES exposicion_x_tema (exposicion_x_tema_id) ON DELETE RESTRICT
);

--MÓDULO DE REVISIONES

--enums

DO
$$
    BEGIN
        CREATE TYPE enum_estado_revision AS ENUM (
            'pendiente',
            'en_proceso',
            'completada',
	        'revisado',
	        'aprobado',
            'rechazado',
	        'por_aprobar'
            );
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END
$$;

DO
$$
    BEGIN
        CREATE TYPE enum_estado_entrega AS ENUM (
            'no_enviado',
            'enviado_a_tiempo',
            'enviado_tarde'
            );
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END
$$;

DO
$$
    BEGIN
        CREATE TYPE enum_estado_actividad AS ENUM (
            'no_iniciado',
            'en_proceso',
            'terminado'
            );
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END
$$;

CREATE TABLE IF NOT EXISTS entregable (
    entregable_id SERIAL PRIMARY KEY,
    etapa_formativa_x_ciclo_id INTEGER NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_fin TIMESTAMP WITH TIME ZONE NOT NULL,
    estado enum_estado_actividad NOT NULL DEFAULT 'no_iniciado',
    es_evaluable BOOLEAN NOT NULL DEFAULT FALSE,
    maximo_documentos INTEGER,
    extensiones_permitidas TEXT,
    peso_maximo_documento INTEGER,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_fechas_entregable CHECK (fecha_fin >= fecha_inicio),
    CONSTRAINT fk_entregable_ef_x_c FOREIGN KEY (etapa_formativa_x_ciclo_id) REFERENCES etapa_formativa_x_ciclo (etapa_formativa_x_ciclo_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS criterio_entregable (
    criterio_entregable_id SERIAL PRIMARY KEY,
    entregable_id INTEGER NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    nota_maxima DECIMAL(6, 2),
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_nota_maxima CHECK (nota_maxima > 0),
    CONSTRAINT fk_criterio_entregable_entregable FOREIGN KEY (entregable_id) REFERENCES entregable (entregable_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS entregable_x_tema (
    entregable_x_tema_id SERIAL PRIMARY KEY,
    entregable_id INTEGER,
    tema_id INTEGER,
    fecha_envio TIMESTAMP WITH TIME ZONE,
    nota_entregable NUMERIC(6, 2),
    comentario TEXT,
    estado enum_estado_entrega NOT NULL DEFAULT 'no_enviado',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_entregable_x_tema_entregable FOREIGN KEY (entregable_id) REFERENCES entregable (entregable_id) ON DELETE CASCADE,
    CONSTRAINT fk_entregable_x_tema_tema FOREIGN KEY (tema_id) REFERENCES tema (tema_id) ON DELETE CASCADE
);
ALTER TABLE entregable_x_tema
ADD COLUMN corregido BOOLEAN DEFAULT FALSE;

-- ALTER TABLE entregable_x_tema
--     ADD COLUMN IF NOT EXISTS usuario_creacion     TEXT,
--     ADD COLUMN IF NOT EXISTS usuario_modificacion TEXT;

CREATE TABLE IF NOT EXISTS revision_criterio_entregable (
    revision_criterio_entregable_id SERIAL PRIMARY KEY,
    entregable_x_tema_id INTEGER,
    criterio_entregable_id INTEGER,
	revision_documento_id INTEGER,
    usuario_id INTEGER,
    nota DECIMAL(6, 2),
    observacion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_nota CHECK (nota >= 0),
	CONSTRAINT fk_revision_documento FOREIGN KEY (revision_documento_id) REFERENCES revision_documento(revision_documento_id) ON DELETE CASCADE,
    CONSTRAINT fk_revision_criterio_entregable_x_tema FOREIGN KEY (entregable_x_tema_id) REFERENCES entregable_x_tema (entregable_x_tema_id) ON DELETE CASCADE,
    CONSTRAINT fk_revision_criterio_criterio FOREIGN KEY (criterio_entregable_id) REFERENCES criterio_entregable (criterio_entregable_id) ON DELETE CASCADE,
    CONSTRAINT fk_revision_criterio_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (usuario_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS documento (
    documento_id SERIAL PRIMARY KEY,
    nombre_documento VARCHAR(150) NOT NULL,
    fecha_subida TIMESTAMP WITH TIME ZONE,
    ultima_version INTEGER NOT NULL DEFAULT 1,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS version_documento (
    version_documento_id SERIAL PRIMARY KEY,
    documento_id INTEGER,
    entregable_x_tema_id INTEGER,
    revision_documento_id INTEGER,
    fecha_ultima_subida TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    numero_version INTEGER,
    link_archivo_subido TEXT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    documento_principal BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_version_documento_documento FOREIGN KEY (documento_id) REFERENCES documento (documento_id) ON DELETE CASCADE,
    CONSTRAINT fk_version_documento_entregable_x_tema FOREIGN KEY (entregable_x_tema_id) REFERENCES entregable_x_tema (entregable_x_tema_id) ON DELETE CASCADE
);
    ALTER TABLE version_documento
    ADD COLUMN porcentaje_similitud DOUBLE PRECISION DEFAULT 0.0,
    ADD COLUMN porcentaje_ia DOUBLE PRECISION DEFAULT 0.0,
    ADD COLUMN estado_procesamiento VARCHAR(32) DEFAULT 'PENDING';  
CREATE TABLE IF NOT EXISTS usuario_documento (
    usuario_documento_id SERIAL PRIMARY KEY,
    usuario_id INTEGER,
    documento_id INTEGER,
    permiso VARCHAR(50) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_documento_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (usuario_id) ON DELETE CASCADE,
    CONSTRAINT fk_usuario_documento_documento FOREIGN KEY (documento_id) REFERENCES documento (documento_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS revision_documento (
    revision_documento_id SERIAL PRIMARY KEY,
    usuario_id INTEGER,
    version_documento_id INTEGER NOT NULL,
    fecha_limite_revision DATE,
    fecha_revision DATE NOT NULL,
    estado_revision enum_estado_revision NOT NULL DEFAULT 'pendiente',
    link_archivo_revision TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_revision_documento_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (usuario_id) ON DELETE RESTRICT,
    CONSTRAINT fk_revision_documento_version_documento FOREIGN KEY (version_documento_id) REFERENCES version_documento (version_documento_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS etapa_formativa_x_ciclo_x_usuario_rol (
    etapa_formativa_x_ciclo_x_usuario_rol_id SERIAL PRIMARY KEY,
    etapa_formativa_x_ciclo_id INTEGER NOT NULL,
    usuario_rol_id INTEGER NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_efc_ur_efc FOREIGN KEY (etapa_formativa_x_ciclo_id) REFERENCES etapa_formativa_x_ciclo (etapa_formativa_x_ciclo_id) ON DELETE RESTRICT,
    CONSTRAINT fk_efc_ur_ur FOREIGN KEY (usuario_rol_id) REFERENCES usuario_rol (usuario_rol_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS tipo_observacion (
    tipo_observacion_id SERIAL PRIMARY KEY,
    nombre_tipo VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS observacion (
    observacion_id SERIAL PRIMARY KEY,
    tipo_observacion_id INTEGER,
    revision_id INTEGER,
    usuario_creacion_id INTEGER,
    numero_pagina_inicio INTEGER,
    numero_pagina_fin INTEGER,
    comentario TEXT NOT NULL,
    es_automatico BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT check_numero_pagina CHECK (
        numero_pagina_inicio > 0
        AND numero_pagina_fin > 0
        AND numero_pagina_inicio <= numero_pagina_fin
    ),
    CONSTRAINT fk_observacion_tipo_observacion FOREIGN KEY (tipo_observacion_id) REFERENCES tipo_observacion (tipo_observacion_id) ON DELETE SET NULL,
    CONSTRAINT fk_observacion_revision_documento FOREIGN KEY (revision_id) REFERENCES revision_documento (revision_documento_id) ON DELETE CASCADE,
    CONSTRAINT fk_observacion_usuario FOREIGN KEY (usuario_creacion_id) REFERENCES usuario (usuario_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS observacion_rect (
    observacion_id INT NOT NULL,
    x1 DOUBLE PRECISION,
    y1 DOUBLE PRECISION,
    x2 DOUBLE PRECISION,
    y2 DOUBLE PRECISION,
    width DOUBLE PRECISION,
    height DOUBLE PRECISION,
    page_number INT,
    CONSTRAINT fk_obsrect_obs FOREIGN KEY (observacion_id) REFERENCES observacion (observacion_id) ON DELETE CASCADE
);

ALTER TABLE observacion
ADD COLUMN IF NOT EXISTS bounding_x1 DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS bounding_y1 DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS bounding_x2 DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS bounding_y2 DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS bounding_width DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS bounding_height DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS bounding_page INT,
ADD COLUMN IF NOT EXISTS contenido TEXT NOT NULL;

ALTER TABLE observacion
ADD COLUMN IF NOT EXISTS corregido BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS reunion (
    reunion_id SERIAL PRIMARY KEY,
    titulo TEXT,
    fecha_hora_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_hora_fin TIMESTAMP WITH TIME ZONE NOT NULL,
    descripcion TEXT,
    disponible INTEGER,
    url TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS usuario_reunion (
    usuario_reunion_id SERIAL PRIMARY KEY,
    reunion_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    estado_asistencia VARCHAR(50),
    estado_detalle VARCHAR(50),
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_ur_reunion FOREIGN KEY (reunion_id) REFERENCES reunion (reunion_id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (usuario_id) ON DELETE CASCADE
);

--Para 1-1

ALTER TABLE version_documento
DROP CONSTRAINT IF EXISTS fk_version_documento_revision_documento;

ALTER TABLE version_documento
ADD CONSTRAINT fk_version_documento_revision_documento FOREIGN KEY (revision_documento_id) REFERENCES revision_documento (revision_documento_id) ON DELETE CASCADE;

ALTER TABLE bloque_horario_exposicion
DROP CONSTRAINT IF EXISTS fk_bhe_exposicion_x_tema;

ALTER TABLE bloque_horario_exposicion
ADD CONSTRAINT fk_bhe_exposicion_x_tema FOREIGN KEY (exposicion_x_tema_id) REFERENCES exposicion_x_tema (exposicion_x_tema_id) ON DELETE SET NULL;

--ALTER TABLE exposicion_x_tema
--    DROP CONSTRAINT IF EXISTS fk_ext_revision_criterio_x_exposicion;
--ALTER TABLE exposicion_x_tema
--    ADD CONSTRAINT fk_ext_revision_criterio_x_exposicion
--        FOREIGN KEY (revision_criterio_x_exposicion_id)
--            REFERENCES revision_criterio_x_exposicion (revision_criterio_x_exposicion_id)
--            ON DELETE SET NULL;

ALTER TABLE carrera_parametro_configuracion
DROP CONSTRAINT IF EXISTS fk_cpc_grupo;

ALTER TABLE carrera_parametro_configuracion
ADD CONSTRAINT fk_cpc_grupo FOREIGN KEY (etapa_formativa_id) REFERENCES etapa_formativa (etapa_formativa_id) ON DELETE RESTRICT;
-->**REVISAR**<--

-- TABLAS PARA CRITERIOS DE ENTREGABLES Y EXPOSICIONES PREDEFINIDOS

CREATE TABLE IF NOT EXISTS criterio_entregable_preset (
    criterio_entregable_preset_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    nota_maxima DECIMAL(6, 2),
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS criterio_exposicion_preset (
    criterio_exposicion_preset_id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    nota_maxima NUMERIC(6, 2) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS configuracion_recordatorio (
    configuracion_recordatorio_id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuario(usuario_id) ON DELETE CASCADE,
    activo BOOLEAN NOT NULL DEFAULT TRUE, -- Si el usuario quiere recordatorios automáticos
    dias_anticipacion INTEGER[] NOT NULL, -- Ejemplo: {7,3,1,0}
    canal_correo BOOLEAN NOT NULL DEFAULT TRUE, -- Recibir por correo
    canal_sistema BOOLEAN NOT NULL DEFAULT TRUE, -- Recibir en el sistema (notificación)
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unico_usuario_recordatorio UNIQUE (usuario_id)
);




-- NECESARIO PARA QUE NO EXISTAN PROBLEMAS CON LOS ENUMS
-- AGREGAR EL CAST PARA LOS DEMAS ENUMS DE SER NECESARIO
--DROP CAST IF EXISTS (character varying AS enum_estado_actividad);

--set search_path to sgtadb;

CREATE CAST (
    CHARACTER VARYING AS enum_tipo_dato
)
WITH
    INOUT AS ASSIGNMENT;

CREATE CAST (
    CHARACTER VARYING AS enum_estado_exposicion
)
WITH
    INOUT AS ASSIGNMENT;

CREATE CAST (
    CHARACTER VARYING AS enum_estado_usuario_exposicion
)
WITH
    INOUT AS ASSIGNMENT;

CREATE CAST (
    CHARACTER VARYING AS enum_tipo_sala_exposicion
)
WITH
    INOUT AS ASSIGNMENT;

CREATE CAST (
    CHARACTER VARYING AS enum_estado_revision
)
WITH
    INOUT AS ASSIGNMENT;

CREATE CAST (
    CHARACTER VARYING AS enum_estado_entrega
)
WITH
    INOUT AS ASSIGNMENT;

CREATE CAST (
    CHARACTER VARYING AS enum_estado_actividad
)
WITH
    INOUT AS ASSIGNMENT;

--CREATE CAST (CHARACTER VARYING AS enum_estado_actividad) WITH INOUT AS ASSIGNMENT;

CREATE TABLE IF NOT EXISTS historial_acciones (
    historial_id    BIGSERIAL PRIMARY KEY,        -- identificador único de la fila
    id_cognito      TEXT            NOT NULL,     -- usuario que ejecuta la acción
    fecha_creacion  TIMESTAMP WITH TIME ZONE
                                 NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accion          TEXT            NOT NULL      -- descripción de la acción
);
