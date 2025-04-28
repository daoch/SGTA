-- Tabla unidad_academica
CREATE TABLE unidad_academica (
    unidad_academica_id    SERIAL PRIMARY KEY,
    nombre                 VARCHAR(100) NOT NULL,
    descripcion            TEXT,
    activo                 BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion     TIMESTAMP WITH TIME ZONE
);

-- Tabla carrera (depende de unidad_academica)
CREATE TABLE carrera (
    carrera_id             SERIAL PRIMARY KEY,
    unidad_academica_id    INTEGER      NOT NULL,
	codigo                 VARCHAR(20)  NOT NULL,
    nombre                 VARCHAR(100) NOT NULL,
    descripcion            TEXT,
    activo                 BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion     TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_unidad_academica 
        FOREIGN KEY (unidad_academica_id)
        REFERENCES unidad_academica (unidad_academica_id)
        ON DELETE RESTRICT
);


-- Tipo Usuario
CREATE TABLE tipo_usuario (
    tipo_usuario_id        SERIAL PRIMARY KEY,
    nombre                 VARCHAR(100) NOT NULL,
    activo                 BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion     TIMESTAMP WITH TIME ZONE
);
-- 3. Tabla usuario
CREATE TABLE usuario (
    usuario_id             SERIAL PRIMARY KEY,
	tipo_usuario_id        INTEGER NOT NULL,
	codigo_PUCP            VARCHAR(20),
    nombres                VARCHAR(100) NOT NULL,
    primer_apellido        VARCHAR(100) NOT NULL,
	segundo_apellido       VARCHAR(100) NOT NULL,
    correo_electronico     VARCHAR(255) UNIQUE NOT NULL,
	nivel_estudios         VARCHAR(25), 
    contrasena             VARCHAR(255) NOT NULL,
	bigrafia               TEXT,
	foto_perfil            BYTEA,
	disponibilidad         TEXT,
	tipo_disponibilidad    TEXT,
    activo                 BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion     TIMESTAMP WITH TIME ZONE,
	

    CONSTRAINT fk_tipo_usuario
        FOREIGN KEY (tipo_usuario_id)
	REFERENCES tipo_usuario (tipo_usuario_id)
	ON DELETE RESTRICT
);

-- 4. Tabla usuario_carrera (M:N entre usuario y carrera)
CREATE TABLE usuario_carrera (
    usuario_carrera_id     SERIAL PRIMARY KEY,
    usuario_id             INTEGER   NOT NULL,
    carrera_id             INTEGER   NOT NULL,
    activo                 BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion     TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_usuario 
        FOREIGN KEY (usuario_id)
        REFERENCES usuario (usuario_id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_carrera 
        FOREIGN KEY (carrera_id)
        REFERENCES carrera (carrera_id)
        ON DELETE RESTRICT
);

CREATE TABLE estado_tema (
    estado_tema_id       SERIAL PRIMARY KEY,
    nombre               VARCHAR(100)             NOT NULL,
    descripcion          TEXT,
    activo               BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion   TIMESTAMP WITH TIME ZONE
);


-- 1) TEMA
CREATE TABLE tema (
    tema_id                  SERIAL PRIMARY KEY,
	codigo                   VARCHAR UNIQUE    NOT NULL,
    titulo                   VARCHAR(255)      NOT NULL,
    resumen                  TEXT,
    portafolio_url           VARCHAR(255),
    estado_tema_id           INTEGER      NOT NULL,
    activo                   BOOLEAN           NOT NULL DEFAULT TRUE,
    fecha_creacion           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion       TIMESTAMP WITH TIME ZONE,

	CONSTRAINT fk_estado_tema
		FOREIGN KEY (estado_tema_id)
		REFERENCES estado_tema (estado_tema_id)
		ON DELETE RESTRICT
);

-- 2) HISTORIAL_TEMA (depende de tema)
CREATE TABLE historial_tema (
    historial_tema_id        SERIAL PRIMARY KEY,
    tema_id                  INTEGER           NOT NULL,
    titulo                   VARCHAR(255)      NOT NULL,
    resumen                  TEXT,
    descripcion_cambio       TEXT,
    estado_tema_id           INTEGER           NOT NULL,            
    activo                   BOOLEAN           NOT NULL DEFAULT TRUE,
    fecha_creacion           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion       TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_tema
        FOREIGN KEY (tema_id)
        REFERENCES tema (tema_id)
        ON DELETE RESTRICT
);

-- 3) ROL
CREATE TABLE rol (
    rol_id                   SERIAL PRIMARY KEY,
    nombre                   VARCHAR(100)      NOT NULL,
    descripcion              TEXT,
    activo                   BOOLEAN           NOT NULL DEFAULT TRUE,
    fecha_creacion           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion       TIMESTAMP WITH TIME ZONE
);

-- 4) TIPO_SOLICITUD
CREATE TABLE tipo_solicitud (
    tipo_solicitud_id        SERIAL PRIMARY KEY,
    nombre                   VARCHAR(100)      NOT NULL,
    descripcion              TEXT,
    activo                   BOOLEAN           NOT NULL DEFAULT TRUE,
    fecha_creacion           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion       TIMESTAMP WITH TIME ZONE
);

-- 5) SOLICITUD (depende de tipo_solicitud)
CREATE TABLE solicitud (
    solicitud_id             SERIAL PRIMARY KEY,
    descripcion              TEXT,
    tipo_solicitud_id        INTEGER           NOT NULL,
    activo                   BOOLEAN           NOT NULL DEFAULT TRUE,
    fecha_creacion           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion       TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_solicitud_tipo
        FOREIGN KEY (tipo_solicitud_id)
        REFERENCES tipo_solicitud (tipo_solicitud_id)
        ON DELETE RESTRICT
);

-- 6) USUARIO_SOLICITUD (M:N entre usuario y solicitud)
CREATE TABLE usuario_solicitud (
    usuario_solicitud_id     SERIAL PRIMARY KEY,
    usuario_id               INTEGER           NOT NULL,
    solicitud_id             INTEGER           NOT NULL,
	solicitud_completada     BOOLEAN           NOT NULL DEFAULT FALSE,
    aprovado                 BOOLEAN           NOT NULL DEFAULT FALSE,
    comentario               TEXT,
    destinatario             BOOLEAN           NOT NULL DEFAULT FALSE,
    activo                   BOOLEAN           NOT NULL DEFAULT TRUE,
    fecha_creacion           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion       TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario (usuario_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_solicitud
        FOREIGN KEY (solicitud_id)
        REFERENCES solicitud (solicitud_id)
        ON DELETE CASCADE
);

-- 7) USUARIO_TEMA (M:N entre usuario, tema y rol)
CREATE TABLE usuario_tema (
    usuario_tema_id          SERIAL PRIMARY KEY,
    usuario_id               INTEGER           NOT NULL,
    tema_id                  INTEGER           NOT NULL,
    rol_id                   INTEGER           NOT NULL,    
    asignado                 BOOLEAN           NOT NULL DEFAULT FALSE,
    prioridad                INTEGER,
    activo                   BOOLEAN           NOT NULL DEFAULT TRUE,
    fecha_creacion           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion       TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario (usuario_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tema
        FOREIGN KEY (tema_id)
        REFERENCES tema (tema_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_rol
        FOREIGN KEY (rol_id)
        REFERENCES rol (rol_id)
        ON DELETE RESTRICT
);

-- 8) AREA_CONOCIMIENTO
CREATE TABLE area_conocimiento (
    area_conocimiento_id     SERIAL PRIMARY KEY,
    nombre                   VARCHAR(100)      NOT NULL,
    descripcion              TEXT,
    activo                   BOOLEAN           NOT NULL DEFAULT TRUE,
    fecha_creacion           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion       TIMESTAMP WITH TIME ZONE
);

-- 9) SUB_AREA_CONOCIMIENTO (depende de area_conocimiento)
CREATE TABLE sub_area_conocimiento (
    sub_area_conocimiento_id SERIAL PRIMARY KEY,
    area_conocimiento_id     INTEGER           NOT NULL,
    nombre                   VARCHAR(100)      NOT NULL,
    descripcion              TEXT,
    activo                   BOOLEAN           NOT NULL DEFAULT TRUE,
    fecha_creacion           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion       TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_area_conocimiento
        FOREIGN KEY (area_conocimiento_id)
        REFERENCES area_conocimiento (area_conocimiento_id)
        ON DELETE RESTRICT
);

-- 10) SUB_AREA_CONOCIMIENTO_TEMA (M:N entre sub_area_conocimiento y tema)
CREATE TABLE sub_area_conocimiento_tema (
    sub_area_conocimiento_id INTEGER           NOT NULL,
    tema_id                  INTEGER           NOT NULL,
    activo                   BOOLEAN           NOT NULL DEFAULT TRUE,
    fecha_creacion           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (sub_area_conocimiento_id, tema_id),

    CONSTRAINT fk_sact_sac
        FOREIGN KEY (sub_area_conocimiento_id)
        REFERENCES sub_area_conocimiento (sub_area_conocimiento_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_sact_tema
        FOREIGN KEY (tema_id)
        REFERENCES tema (tema_id)
        ON DELETE CASCADE
);

-- 11) USUARIO_SUB_AREA_CONOCIMIENTO (M:N entre usuario y sub_area_conocimiento)
CREATE TABLE usuario_sub_area_conocimiento (
    usuario_sub_area_conocimiento_id  SERIAL PRIMARY KEY,
    usuario_id                        INTEGER           NOT NULL,
    sub_area_conocimiento_id          INTEGER           NOT NULL,
    activo                            BOOLEAN           NOT NULL DEFAULT TRUE,
    fecha_creacion                    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion                TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_usac_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario (usuario_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_usac_sac
        FOREIGN KEY (sub_area_conocimiento_id)
        REFERENCES sub_area_conocimiento (sub_area_conocimiento_id)
        ON DELETE RESTRICT
);
-- 3) MODULO
CREATE TABLE modulo (
    modulo_id             SERIAL PRIMARY KEY,
    nombre                VARCHAR(100)        NOT NULL,
    descripcion           TEXT,
    activo                BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion    TIMESTAMP WITH TIME ZONE
);

-- 1) PERMISO
CREATE TABLE permiso (
    permiso_id            SERIAL PRIMARY KEY,
	modulo_id             INTEGER NOT NULL,
    nombre                VARCHAR(100)             NOT NULL,
    descripcion           TEXT,
    activo                BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion    TIMESTAMP WITH TIME ZONE,

	CONSTRAINT fk_modulo
	FOREIGN KEY (modulo_id)
	REFERENCES modulo (modulo_id)
	ON DELETE RESTRICT
);


-- 4) TIPO_NOTIFICACION
CREATE TABLE tipo_notificacion (
    tipo_notificacion_id  SERIAL PRIMARY KEY,
    nombre                VARCHAR(100)        NOT NULL,
    descripcion           TEXT,
    prioridad             INTEGER             NOT NULL DEFAULT 0,
    activo                BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion    TIMESTAMP WITH TIME ZONE
);

-- 5) TIPO_USUARIO_PERMISO (relación M:N entre tipo_usuario y permiso)
CREATE TABLE tipo_usuario_permiso (
    tipo_usua_permiso_id  SERIAL    PRIMARY KEY,
    tipo_usuario_id       INTEGER   NOT NULL,
    permiso_id            INTEGER   NOT NULL,
    activo                BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion    TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_tup_tipo_usuario
        FOREIGN KEY (tipo_usuario_id)
        REFERENCES tipo_usuario (tipo_usuario_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tup_permiso
        FOREIGN KEY (permiso_id)
        REFERENCES permiso (permiso_id)
        ON DELETE CASCADE
);

-- 6) NOTIFICACION
CREATE TABLE notificacion (
    notificacion_id       SERIAL PRIMARY KEY,
    mensaje               TEXT               NOT NULL,
    canal                 VARCHAR(50)        NOT NULL,
    fecha_creacion        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura         TIMESTAMP WITH TIME ZONE,
    activo                BOOLEAN            NOT NULL DEFAULT TRUE,
    modulo_id             INTEGER   NOT NULL,
    tipo_notificacion_id  INTEGER   NOT NULL,
    usuario_id            INTEGER   NOT NULL,  -- debe existir tabla usuario(usuario_id)    
    fecha_modificacion    TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_not_modulo
        FOREIGN KEY (modulo_id)
        REFERENCES modulo (modulo_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_not_tipo_notificacion
        FOREIGN KEY (tipo_notificacion_id)
        REFERENCES tipo_notificacion (tipo_notificacion_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_not_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario (usuario_id)
        ON DELETE CASCADE
);

-- 1) Tabla grupo_investigacion
CREATE TABLE grupo_investigacion (
    grupo_investigacion_id   SERIAL PRIMARY KEY,
    nombre                   VARCHAR(100)             NOT NULL,
    descripcion              TEXT,
    activo                   BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion       TIMESTAMP WITH TIME ZONE
);

-- 2) Tabla usuario_grupo_investigacion (asigna usuarios a grupos)  
CREATE TABLE usuario_grupo_investigacion (
    usuario_grupo_investigacion_id  SERIAL PRIMARY KEY,
    usuario_id                      INTEGER           NOT NULL,
    grupo_investigacion_id          INTEGER           NOT NULL,
    activo                   		 BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion           		 TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion       		 TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_ugi_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario (usuario_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_ugi_grupo
        FOREIGN KEY (grupo_investigacion_id)
        REFERENCES grupo_investigacion (grupo_investigacion_id)
        ON DELETE CASCADE
);

-- 1) Tabla proyecto
CREATE TABLE proyecto (
    proyecto_id           SERIAL PRIMARY KEY,
    titulo                VARCHAR(255)          NOT NULL,
    descripcion           TEXT,
    estado                VARCHAR(50)           NOT NULL,
    activo                BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion    TIMESTAMP WITH TIME ZONE
);

-- 2) Tabla usuario_proyecto (relación M:N entre usuario y proyecto)
CREATE TABLE usuario_proyecto (
    usuario_proyecto_id   SERIAL PRIMARY KEY,
    usuario_id            INTEGER              NOT NULL,
    proyecto_id           INTEGER              NOT NULL,
	lider_proyecto        BOOLEAN   NOT NULL DEFAULT FALSE,
    activo                BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion    TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_up_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario (usuario_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_up_proyecto
        FOREIGN KEY (proyecto_id)
        REFERENCES proyecto (proyecto_id)
        ON DELETE CASCADE
);


-- 3) Tabla grupo_investigacion_proyecto (relaciona grupos con proyectos)  
CREATE TABLE grupo_investigacion_proyecto (
    grupo_investigacion_proyecto_id SERIAL PRIMARY KEY,
    grupo_investigacion_id          INTEGER           NOT NULL,
    proyecto_id                     INTEGER           NOT NULL,
    activo                   BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion       TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT fk_gip_grupo
        FOREIGN KEY (grupo_investigacion_id)
        REFERENCES grupo_investigacion (grupo_investigacion_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_gip_proyecto
        FOREIGN KEY (proyecto_id)
        REFERENCES proyecto (proyecto_id)
        ON DELETE CASCADE
);

-- 1) Tabla parametro_configuracion
CREATE TABLE parametro_configuracion (
    parametro_configuracion_id  SERIAL PRIMARY KEY,
    nombre                      VARCHAR(100)             NOT NULL,
    descripcion                 TEXT,
    modulo_id                   INTEGER                  NOT NULL,
    activo                      BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion          TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_pc_modulo
        FOREIGN KEY (modulo_id)
        REFERENCES modulo (modulo_id)
        ON DELETE RESTRICT
);

-- 2) Tabla carrera_parametro_configuracion (M:N entre carrera y parametro_configuracion)
CREATE TABLE carrera_parametro_configuracion (
    carrera_parametro_configuracion_id  SERIAL PRIMARY KEY,
    estado                              VARCHAR(50)             NOT NULL,
    cantidad                            INTEGER                 NOT NULL,
    activo                              BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion                      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion                  TIMESTAMP WITH TIME ZONE,

    carrera_id                          INTEGER   NOT NULL,
    parametro_configuracion_id          INTEGER   NOT NULL,
	-- si agregan el fk de etapa_formativa, no le pongan NOT NULL

    CONSTRAINT fk_cpc_carrera
        FOREIGN KEY (carrera_id)
        REFERENCES carrera (carrera_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_cpc_parametro_configuracion
        FOREIGN KEY (parametro_configuracion_id)
        REFERENCES parametro_configuracion (parametro_configuracion_id)
        ON DELETE CASCADE
);
