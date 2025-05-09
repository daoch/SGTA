
DO
$$
    BEGIN
        CREATE TYPE enum_tipo_dato AS ENUM (
            'string',
            'date',
            'integer',
            'boolean'
            );
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END
$$;

-- Tabla unidad_academica
CREATE TABLE IF NOT EXISTS unidad_academica (
    unidad_academica_id    SERIAL PRIMARY KEY,
    nombre                 VARCHAR(100) NOT NULL,
    descripcion            TEXT,
    activo                 BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion     TIMESTAMP WITH TIME ZONE
);

-- Tabla carrera (depende de unidad_academica)
CREATE TABLE IF NOT EXISTS carrera (
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
CREATE TABLE IF NOT EXISTS tipo_usuario (
    tipo_usuario_id        SERIAL PRIMARY KEY,
    nombre                 VARCHAR(100) NOT NULL,
    activo                 BOOLEAN NOT NULL DEFAULT TRUE,
    tipo_dedicacion        VARCHAR(100),
    fecha_creacion         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion     TIMESTAMP WITH TIME ZONE
);
-- 3. Tabla usuario
CREATE TABLE IF NOT EXISTS usuario (
    usuario_id             SERIAL PRIMARY KEY,
	tipo_usuario_id        INTEGER NOT NULL,
	codigo_PUCP            VARCHAR(20),
    nombres                VARCHAR(100) NOT NULL,
    primer_apellido        VARCHAR(100) NOT NULL,
	segundo_apellido       VARCHAR(100) NOT NULL,
    correo_electronico     VARCHAR(255) UNIQUE NOT NULL,
	nivel_estudios         VARCHAR(25), 
    contrasena             VARCHAR(255) NOT NULL,
	biografia               TEXT,
    enlace_linkedin        VARCHAR(255),
    enlace_repositorio     VARCHAR(255),
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
CREATE TABLE IF NOT EXISTS usuario_carrera (
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

CREATE TABLE IF NOT EXISTS estado_tema (
    estado_tema_id       SERIAL PRIMARY KEY,
    nombre               VARCHAR(100)             NOT NULL,
    descripcion          TEXT,
    activo               BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion   TIMESTAMP WITH TIME ZONE
);


-- 1) Tabla proyecto
CREATE TABLE IF NOT EXISTS proyecto (
    proyecto_id           SERIAL PRIMARY KEY,
    titulo                VARCHAR(255)          NOT NULL,
    descripcion           TEXT,
    estado                VARCHAR(50)           NOT NULL,
    activo                BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion    TIMESTAMP WITH TIME ZONE
);

-- 1) TEMA
CREATE TABLE IF NOT EXISTS tema (
    tema_id                  SERIAL PRIMARY KEY,
	codigo                   VARCHAR(255),
    titulo                   VARCHAR(255)      NOT NULL,
    resumen                  TEXT,
    metodologia              TEXT,
    objetivos                TEXT,
    portafolio_url           VARCHAR(255),
    estado_tema_id           INTEGER      NOT NULL,
    proyecto_id              INTEGER,
    carrera_id               INTEGER,
    fecha_limite             TIMESTAMP WITH TIME ZONE,
    fecha_finalizacion       TIMESTAMP WITH TIME ZONE,
    activo                   BOOLEAN           NOT NULL DEFAULT TRUE,
    fecha_creacion           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion       TIMESTAMP WITH TIME ZONE,

	CONSTRAINT fk_estado_tema
		FOREIGN KEY (estado_tema_id)
		REFERENCES estado_tema (estado_tema_id)
		ON DELETE RESTRICT,
    
    CONSTRAINT fk_proyecto
        FOREIGN KEY (proyecto_id)
        REFERENCES proyecto (proyecto_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_t_carrera
        FOREIGN KEY (carrera_id)
        REFERENCES carrera (carrera_id)
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS recurso (
    recurso_id          SERIAL PRIMARY KEY,
    tema_id             INTEGER           NOT NULL,
    nombre              VARCHAR(255) NOT NULL,
    documento_url                 VARCHAR(500),  -- URL al archivo o recurso
    estado              VARCHAR(100),  -- por ejemplo: 'PUBLICADO', 'PENDIENTE', etc.
    activo              BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion  TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_tema
        FOREIGN KEY (tema_id)
        REFERENCES tema (tema_id)
        ON DELETE RESTRICT
);

-- 2) HISTORIAL_TEMA (depende de tema)
CREATE TABLE IF NOT EXISTS historial_tema (
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
CREATE TABLE IF NOT EXISTS rol (
    rol_id                   SERIAL PRIMARY KEY,
    nombre                   VARCHAR(100)      NOT NULL,
    descripcion              TEXT,
    activo                   BOOLEAN           NOT NULL DEFAULT TRUE,
    fecha_creacion           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion       TIMESTAMP WITH TIME ZONE
);

-- 4) TIPO_SOLICITUD
CREATE TABLE IF NOT EXISTS tipo_solicitud (
    tipo_solicitud_id        SERIAL PRIMARY KEY,
    nombre                   VARCHAR(100)      NOT NULL,
    descripcion              TEXT,
    activo                   BOOLEAN           NOT NULL DEFAULT TRUE,
    fecha_creacion           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion       TIMESTAMP WITH TIME ZONE
);

-- 5) SOLICITUD (depende de tipo_solicitud)
CREATE TABLE IF NOT EXISTS solicitud (
    solicitud_id             SERIAL PRIMARY KEY,
    descripcion              TEXT,
    tipo_solicitud_id        INTEGER           NOT NULL,
    tema_id                  INTEGER           NOT NULL,
    activo                   BOOLEAN           NOT NULL DEFAULT TRUE,
    fecha_creacion           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion       TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_solicitud_tipo
        FOREIGN KEY (tipo_solicitud_id)
        REFERENCES tipo_solicitud (tipo_solicitud_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_s_tema
        FOREIGN KEY (tema_id)
        REFERENCES tema (tema_id)
        ON DELETE RESTRICT
);

-- 6) USUARIO_SOLICITUD (M:N entre usuario y solicitud)
CREATE TABLE IF NOT EXISTS usuario_solicitud (
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
CREATE TABLE IF NOT EXISTS usuario_tema (
    usuario_tema_id          SERIAL PRIMARY KEY,
    usuario_id               INTEGER           NOT NULL,
    tema_id                  INTEGER           NOT NULL,
    rol_id                   INTEGER           NOT NULL,    
    asignado                 BOOLEAN           NOT NULL DEFAULT FALSE,
    rechazado                BOOLEAN           NOT NULL DEFAULT FALSE,
    prioridad                INTEGER,
    comentario               TEXT,
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
CREATE TABLE IF NOT EXISTS area_conocimiento (
    area_conocimiento_id     SERIAL PRIMARY KEY,
    carrera_id               INTEGER           NOT NULL,
    nombre                   VARCHAR(100)      NOT NULL,
    descripcion              TEXT,
    activo                   BOOLEAN           NOT NULL DEFAULT TRUE,
    fecha_creacion           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion       TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_ac_carrera
        FOREIGN KEY (carrera_id)
        REFERENCES carrera (carrera_id)
        ON DELETE RESTRICT
);

-- 9) SUB_AREA_CONOCIMIENTO (depende de area_conocimiento)
CREATE TABLE IF NOT EXISTS sub_area_conocimiento (
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
CREATE TABLE IF NOT EXISTS sub_area_conocimiento_tema (
    sub_area_conocimiento_id INTEGER           NOT NULL,
    tema_id                  INTEGER           NOT NULL,
    activo                   BOOLEAN           NOT NULL DEFAULT TRUE,
    fecha_creacion           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion       TIMESTAMP WITH TIME ZONE,

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
CREATE TABLE IF NOT EXISTS usuario_sub_area_conocimiento (
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
-- 12) USUARIO_AREA_CONOCIMIENTO (M:N entre usuario y area_conocimiento)
CREATE TABLE IF NOT EXISTS usuario_area_conocimiento (
    usuario_area_conocimiento_id      SERIAL 			PRIMARY KEY,
    usuario_id                        INTEGER           NOT NULL,
    area_conocimiento_id              INTEGER           NOT NULL,
    activo                            BOOLEAN           NOT NULL DEFAULT TRUE,
    fecha_creacion                    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion                TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_uac_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario (usuario_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_uac_ac
        FOREIGN KEY (area_conocimiento_id)
        REFERENCES area_conocimiento (area_conocimiento_id)
        ON DELETE RESTRICT
);
-- 3) MODULO
CREATE TABLE IF NOT EXISTS modulo (
    modulo_id             SERIAL PRIMARY KEY,
    nombre                VARCHAR(100)        NOT NULL,
    descripcion           TEXT,
    activo                BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion    TIMESTAMP WITH TIME ZONE
);

-- 1) PERMISO
CREATE TABLE IF NOT EXISTS permiso (
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
CREATE TABLE IF NOT EXISTS tipo_notificacion (
    tipo_notificacion_id  SERIAL PRIMARY KEY,
    nombre                VARCHAR(100)        NOT NULL,
    descripcion           TEXT,
    prioridad             INTEGER             NOT NULL DEFAULT 0,
    activo                BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion    TIMESTAMP WITH TIME ZONE
);

-- 5) TIPO_USUARIO_PERMISO (relación M:N entre tipo_usuario y permiso)
CREATE TABLE IF NOT EXISTS tipo_usuario_permiso (
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
CREATE TABLE IF NOT EXISTS notificacion (
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
CREATE TABLE IF NOT EXISTS grupo_investigacion (
    grupo_investigacion_id   SERIAL PRIMARY KEY,
    nombre                   VARCHAR(100)             NOT NULL,
    descripcion              TEXT,
    activo                   BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion       TIMESTAMP WITH TIME ZONE
);

-- 2) Tabla usuario_grupo_investigacion (asigna usuarios a grupos)  
CREATE TABLE IF NOT EXISTS usuario_grupo_investigacion (
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

-- 2) Tabla usuario_proyecto (relación M:N entre usuario y proyecto)
CREATE TABLE IF NOT EXISTS usuario_proyecto (
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
CREATE TABLE IF NOT EXISTS grupo_investigacion_proyecto (
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

CREATE TABLE IF NOT EXISTS etapa_formativa
(
    etapa_formativa_id  SERIAL PRIMARY KEY,
    nombre              TEXT                     NOT NULL,
    creditaje_por_tema  NUMERIC(6, 2)            NOT NULL,
    duracion_exposicion INTERVAL,
    activo              BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion  TIMESTAMP WITH TIME ZONE,
    carrera_id          INTEGER                  NOT NULL,
    CONSTRAINT fk_area_conocimiento_carrera
    FOREIGN KEY (carrera_id)
    REFERENCES carrera(carrera_id)
);

-- 1) Tabla parametro_configuracion
CREATE TABLE IF NOT EXISTS parametro_configuracion (
    parametro_configuracion_id  SERIAL PRIMARY KEY,
    nombre                      VARCHAR(100)             NOT NULL,
    descripcion                 TEXT,
    modulo_id                   INTEGER                  NOT NULL,
    tipo                        enum_tipo_dato          NOT NULL,
    activo                      BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion          TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_pc_modulo
        FOREIGN KEY (modulo_id)
        REFERENCES modulo (modulo_id)
        ON DELETE RESTRICT
);

-- 2) Tabla carrera_parametro_configuracion (M:N entre carrera y parametro_configuracion)
CREATE TABLE IF NOT EXISTS carrera_parametro_configuracion (
    carrera_parametro_configuracion_id  SERIAL PRIMARY KEY,
    valor                               TEXT      NOT NULL,
    activo                              BOOLEAN   NOT NULL DEFAULT TRUE,
    fecha_creacion                      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion                  TIMESTAMP WITH TIME ZONE,
    carrera_id                          INTEGER   NOT NULL,
    parametro_configuracion_id          INTEGER   NOT NULL,
    etapa_formativa_id                  INTEGER,  -- opcional, puede ser NULL
	-- si agregan el fk de etapa_formativa, no le pongan NOT NULL

    CONSTRAINT fk_cpc_carrera
        FOREIGN KEY (carrera_id)
        REFERENCES carrera (carrera_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_cpc_parametro_configuracion
        FOREIGN KEY (parametro_configuracion_id)
        REFERENCES parametro_configuracion (parametro_configuracion_id)
        ON DELETE CASCADE,
	CONSTRAINT fk_cpc_grupo
		FOREIGN KEY (etapa_formativa_id)
		REFERENCES etapa_formativa (etapa_formativa_id)
		ON DELETE CASCADE
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

CREATE TABLE IF NOT EXISTS ciclo
(
    ciclo_id           SERIAL PRIMARY KEY,
    semestre           VARCHAR(10)              NOT NULL,
    anio               INTEGER                  NOT NULL,
    fecha_inicio       DATE                     NOT NULL,
    fecha_fin          DATE                     NOT NULL,
    activo             BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS etapa_formativa
(
    etapa_formativa_id  SERIAL PRIMARY KEY,
    nombre              TEXT                     NOT NULL,
    creditaje_por_tema  NUMERIC(6, 2),
    duracion_exposicion INTERVAL,
    activo              BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion  TIMESTAMP WITH TIME ZONE,

    carrera_id          INTEGER                  NOT NULL,
    CONSTRAINT fk_area_conocimiento_carrera
        FOREIGN KEY (carrera_id)
        REFERENCES carrera(carrera_id)
);

CREATE TABLE IF NOT EXISTS estado_planificacion
(
    estado_planificacion_id SERIAL PRIMARY KEY,
    nombre                  TEXT                     NOT NULL,
    activo                  BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion      TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS sala_exposicion
(
    sala_exposicion_id   SERIAL PRIMARY KEY,
    nombre               TEXT                      NOT NULL,
    activo               BOOLEAN                   NOT NULL DEFAULT TRUE,
    tipo_sala_exposicion enum_tipo_sala_exposicion NOT NULL DEFAULT 'presencial',
    fecha_creacion       TIMESTAMP WITH TIME ZONE  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion   TIMESTAMP WITH TIME ZONE
);

-- Tablas para el módulo de exposiciones (corregidas)

-- Tabla etapa_formativa_x_ciclo
CREATE TABLE IF NOT EXISTS etapa_formativa_x_ciclo
(
    etapa_formativa_x_ciclo_id SERIAL PRIMARY KEY,
    etapa_formativa_id         INTEGER                  NOT NULL,
    ciclo_id                   INTEGER                  NOT NULL,
    activo                     BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion             TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion         TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_efc_etapa_formativa
        FOREIGN KEY (etapa_formativa_id)
            REFERENCES etapa_formativa (etapa_formativa_id)
            ON DELETE RESTRICT,
    CONSTRAINT fk_efc_ciclo
        FOREIGN KEY (ciclo_id)
            REFERENCES ciclo (ciclo_id)
            ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS etapa_formativa_x_ciclo_x_tema
(
    etapa_formativa_x_ciclo_x_tema_id SERIAL PRIMARY KEY,
    etapa_formativa_x_ciclo_id         INTEGER                  NOT NULL,
    tema_id                            INTEGER                  NOT NULL,
    aprobado                           BOOLEAN,
    activo                             BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion                     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion                 TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_efcxt_efc
        FOREIGN KEY (etapa_formativa_x_ciclo_id)
            REFERENCES etapa_formativa_x_ciclo (etapa_formativa_x_ciclo_id)
            ON DELETE RESTRICT,
    CONSTRAINT fk_efcxt_tema
        FOREIGN KEY (tema_id)
            REFERENCES tema (tema_id)
            ON DELETE RESTRICT
);

-- Tabla exposicion
CREATE TABLE IF NOT EXISTS exposicion
(
    exposicion_id               SERIAL PRIMARY KEY,
    etapa_formativa_x_ciclo_id  INTEGER                  NOT NULL,
    estado_planificacion_id     INTEGER                  NOT NULL,
    activo                      BOOLEAN                  NOT NULL DEFAULT TRUE,
    nombre                      TEXT                     NOT NULL,
    descripcion                 TEXT                     NOT NULL,
    fecha_creacion              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion          TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_texefc_ef_x_c
        FOREIGN KEY (etapa_formativa_x_ciclo_id)
            REFERENCES etapa_formativa_x_ciclo (etapa_formativa_x_ciclo_id)
            ON DELETE RESTRICT,
    CONSTRAINT fk_exp_estado_planificacion
        FOREIGN KEY (estado_planificacion_id)
            REFERENCES estado_planificacion (estado_planificacion_id)
            ON DELETE RESTRICT
);

-- Tabla jornada_exposicion
CREATE TABLE IF NOT EXISTS jornada_exposicion
(
    jornada_exposicion_id SERIAL PRIMARY KEY,
    exposicion_id         INTEGER                  NOT NULL,
    datetime_inicio       TIMESTAMP WITH TIME ZONE NOT NULL,
    datetime_fin          TIMESTAMP WITH TIME ZONE NOT NULL,
    activo                BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion    TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_je_exposicion
        FOREIGN KEY (exposicion_id)
            REFERENCES exposicion (exposicion_id)
            ON DELETE RESTRICT
);

-- Tabla jornada_exposicion_x_sala_exposicion
CREATE TABLE IF NOT EXISTS jornada_exposicion_x_sala_exposicion
(
    jornada_exposicion_x_sala_id SERIAL PRIMARY KEY,
    jornada_exposicion_id        INTEGER                  NOT NULL,
    sala_exposicion_id           INTEGER                  NOT NULL,
    activo                       BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion               TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion           TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_jexs_jornada_exposicion
        FOREIGN KEY (jornada_exposicion_id)
            REFERENCES jornada_exposicion (jornada_exposicion_id)
            ON DELETE RESTRICT,
    CONSTRAINT fk_jexs_sala_exposicion
        FOREIGN KEY (sala_exposicion_id)
            REFERENCES sala_exposicion (sala_exposicion_id)
            ON DELETE RESTRICT
);

-- Tabla bloque_horario_exposicion
CREATE TABLE IF NOT EXISTS bloque_horario_exposicion
(
    bloque_horario_exposicion_id SERIAL PRIMARY KEY,
    jornada_exposicion_x_sala_id INTEGER                  NOT NULL,
    exposicion_x_tema_id         INTEGER,
    es_bloque_reservado          BOOLEAN                  NOT NULL DEFAULT FALSE,
    es_bloque_bloqueado          BOOLEAN                  NOT NULL DEFAULT FALSE,
    datetime_inicio              TIMESTAMP WITH TIME ZONE NOT NULL,
    datetime_fin                 TIMESTAMP WITH TIME ZONE NOT NULL,
    activo                       BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion               TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion           TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_bhe_jornada_exposicion_x_sala
        FOREIGN KEY (jornada_exposicion_x_sala_id)
            REFERENCES jornada_exposicion_x_sala_exposicion (jornada_exposicion_x_sala_id)
            ON DELETE RESTRICT
);

-- Tabla exposicion_x_tema
CREATE TABLE IF NOT EXISTS exposicion_x_tema
(
    exposicion_x_tema_id              SERIAL PRIMARY KEY,
    exposicion_id                     INTEGER                  NOT NULL,
    tema_id                           INTEGER                  NOT NULL,
    bloque_horario_exposicion_id      INTEGER,
    revision_criterio_x_exposicion_id INTEGER,
    link_exposicion                   TEXT,
    link_grabacion                    TEXT,
    estado_exposicion                 enum_estado_exposicion   NOT NULL DEFAULT 'sin_programar',
    nota_final                        NUMERIC(5, 2),
    activo                            BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion                    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion                TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_ext_exposicion
        FOREIGN KEY (exposicion_id)
            REFERENCES exposicion (exposicion_id)
            ON DELETE RESTRICT,
    CONSTRAINT fk_ext_tema
        FOREIGN KEY (tema_id)
            REFERENCES tema (tema_id)
            ON DELETE RESTRICT,
    CONSTRAINT fk_ext_bloque_horario
        FOREIGN KEY (bloque_horario_exposicion_id)
            REFERENCES bloque_horario_exposicion (bloque_horario_exposicion_id)
            ON DELETE RESTRICT
);

-- Tabla criterio_exposicion
CREATE TABLE IF NOT EXISTS criterio_exposicion
(
    criterio_exposicion_id SERIAL PRIMARY KEY,
    exposicion_id          INTEGER                  NOT NULL,
    nombre                 TEXT                     NOT NULL,
    descripcion            TEXT,
    nota_maxima            NUMERIC(5, 2)            NOT NULL,
    activo                 BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion     TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_ce_exposicion
        FOREIGN KEY (exposicion_id)
            REFERENCES exposicion (exposicion_id)
            ON DELETE RESTRICT
);

-- Tabla revision_criterio_x_exposicion
CREATE TABLE IF NOT EXISTS revision_criterio_x_exposicion
(
    revision_criterio_x_exposicion_id SERIAL PRIMARY KEY,
    exposicion_x_tema_id              INTEGER                  NOT NULL,
    criterio_exposicion_id            INTEGER                  NOT NULL,
    usuario_id                        INTEGER                  NOT NULL,
    nota                              NUMERIC(5, 2),
    revisado                          BOOLEAN                  NOT NULL DEFAULT FALSE,
    observacion                       TEXT,
    activo                            BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion                    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion                TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_rcxe_exposicion_x_tema
        FOREIGN KEY (exposicion_x_tema_id)
            REFERENCES exposicion_x_tema (exposicion_x_tema_id)
            ON DELETE RESTRICT,
    CONSTRAINT fk_rcxe_criterio_exposicion
        FOREIGN KEY (criterio_exposicion_id)
            REFERENCES criterio_exposicion (criterio_exposicion_id)
            ON DELETE RESTRICT,
    CONSTRAINT fk_rcxe_usuario
        FOREIGN KEY (usuario_id)
            REFERENCES usuario (usuario_id)
            ON DELETE RESTRICT
);

-- Tabla control_exposicion_usuario
CREATE TABLE IF NOT EXISTS control_exposicion_usuario
(
    control_exposicion_usuario_id SERIAL PRIMARY KEY,
    exposicion_x_tema_id          INTEGER                  NOT NULL,
    usuario_x_tema_id             INTEGER                  NOT NULL,
    estado_exposicion_usuario     enum_estado_usuario_exposicion,
    observaciones_finales_exposicion TEXT,
    asistio                       BOOLEAN,
    activo                        BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion                TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion            TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_ceu_exposicion_x_tema
        FOREIGN KEY (exposicion_x_tema_id)
            REFERENCES exposicion_x_tema (exposicion_x_tema_id)
            ON DELETE RESTRICT,
    CONSTRAINT fk_ceu_usuario_x_tema
        FOREIGN KEY (usuario_x_tema_id)
            REFERENCES usuario_tema (usuario_tema_id)
            ON DELETE RESTRICT
);

-- Tabla etapa_formativa_x_sala_exposicion
CREATE TABLE IF NOT EXISTS etapa_formativa_x_sala_exposicion
(
    etapa_formativa_x_sala_id SERIAL PRIMARY KEY,
    etapa_formativa_id        INTEGER                  NOT NULL,
    sala_exposicion_id        INTEGER                  NOT NULL,
    activo                    BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion        TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_efxs_etapa_formativa
        FOREIGN KEY (etapa_formativa_id)
            REFERENCES etapa_formativa (etapa_formativa_id)
            ON DELETE RESTRICT,
    CONSTRAINT fk_efxs_sala_exposicion
        FOREIGN KEY (sala_exposicion_id)
            REFERENCES sala_exposicion (sala_exposicion_id)
            ON DELETE RESTRICT
);

-- Tabla restriccion_exposicion
CREATE TABLE IF NOT EXISTS restriccion_exposicion
(
    restriccion_exposicion_id SERIAL PRIMARY KEY,
    exposicion_x_tema_id      INTEGER                  NOT NULL,
    datetime_inicio           TIMESTAMP WITH TIME ZONE NOT NULL,
    datetime_fin              TIMESTAMP WITH TIME ZONE NOT NULL,
    activo                    BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion        TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_re_exposicion_x_tema
        FOREIGN KEY (exposicion_x_tema_id)
            REFERENCES exposicion_x_tema (exposicion_x_tema_id)
            ON DELETE RESTRICT
);

--MÓDULO DE REVISIONES

--enums

DO
$$
    BEGIN
        CREATE TYPE enum_estado_revision AS ENUM (
            'pendiente',
            'en_proceso',
            'completada'
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

CREATE TABLE IF NOT EXISTS entregable
(
    entregable_id              SERIAL PRIMARY KEY,
    etapa_formativa_x_ciclo_id INTEGER                  NOT NULL,
    nombre                     VARCHAR(150)             NOT NULL,
    descripcion                TEXT,
    fecha_inicio               TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_fin                  TIMESTAMP WITH TIME ZONE NOT NULL,
    estado                     enum_estado_actividad    NOT NULL DEFAULT 'no_iniciado',
    es_evaluable               BOOLEAN                  NOT NULL DEFAULT FALSE,
    activo                     BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion             TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion         TIMESTAMP WITH TIME ZONE,

    CONSTRAINT check_fechas_entregable CHECK (fecha_fin >= fecha_inicio),
    CONSTRAINT fk_entregable_ef_x_c
        FOREIGN KEY (etapa_formativa_x_ciclo_id)
            REFERENCES etapa_formativa_x_ciclo (etapa_formativa_x_ciclo_id)
            ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS criterio_entregable
(
    criterio_entregable_id SERIAL PRIMARY KEY,
    entregable_id          INTEGER                  NOT NULL,
    nombre                 VARCHAR(100)             NOT NULL,
    nota_maxima            DECIMAL(5, 2),
    descripcion            TEXT,
    activo                 BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion     TIMESTAMP WITH TIME ZONE,

    CONSTRAINT check_nota_maxima CHECK (nota_maxima > 0),
    CONSTRAINT fk_criterio_entregable_entregable
        FOREIGN KEY (entregable_id)
            REFERENCES entregable (entregable_id)
            ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS entregable_x_tema
(
    entregable_x_tema_id            SERIAL PRIMARY KEY,
    entregable_id                   INTEGER,
    tema_id                         INTEGER,
    revision_criterio_entregable_id INTEGER,
    fecha_envio                     DATE,
    comentario                      TEXT,
    estado                          enum_estado_entrega      NOT NULL DEFAULT 'no_enviado',
    activo                          BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion              TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_entregable_x_tema_entregable
        FOREIGN KEY (entregable_id)
            REFERENCES entregable (entregable_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_entregable_x_tema_tema
        FOREIGN KEY (tema_id)
            REFERENCES tema (tema_id)
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS revision_criterio_entregable
(
    revision_criterio_entregable_id   SERIAL PRIMARY KEY,
    entregable_x_tema_id              INTEGER,
    criterio_entregable_id            INTEGER,
    usuario_id                        INTEGER,
    nota                              DECIMAL(5, 2),
    observacion                       TEXT,
    activo                            BOOLEAN                  NOT NULL DEFAULT TRUE,
    fecha_creacion                    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion                TIMESTAMP WITH TIME ZONE,

    CONSTRAINT check_nota CHECK (nota >= 0),
    CONSTRAINT fk_revision_criterio_entregable_x_tema
        FOREIGN KEY (entregable_x_tema_id)
            REFERENCES entregable_x_tema (entregable_x_tema_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_revision_criterio_criterio
        FOREIGN KEY (criterio_entregable_id)
            REFERENCES criterio_entregable (criterio_entregable_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_revision_criterio_usuario
        FOREIGN KEY (usuario_id)
            REFERENCES usuario (usuario_id)
            ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS documento
(
    documento_id       SERIAL PRIMARY KEY,
    nombre_documento   VARCHAR(150)             NOT NULL,
    fecha_subida       DATE,
    ultima_version     INTEGER                  NOT NULL DEFAULT 1,
    activo             BOOLEAN                           DEFAULT TRUE,
    fecha_creacion     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS version_documento
(
    version_documento_id  SERIAL PRIMARY KEY,
    documento_id          INTEGER,
    revision_documento_id INTEGER,
    fecha_ultima_subida   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    numero_version        INTEGER,
    link_archivo_subido   TEXT                     NOT NULL,
    activo                BOOLEAN                           DEFAULT TRUE,
    fecha_creacion        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion    TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_version_documento_documento
        FOREIGN KEY (documento_id)
            REFERENCES documento (documento_id)
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS usuario_documento
(
    usuario_documento_id SERIAL PRIMARY KEY,
    usuario_id           INTEGER,
    documento_id         INTEGER,
    permiso              VARCHAR(50)              NOT NULL,
    activo               BOOLEAN                           DEFAULT TRUE,
    fecha_creacion       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion   TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_usuario_documento_usuario
        FOREIGN KEY (usuario_id)
            REFERENCES usuario (usuario_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_usuario_documento_documento
        FOREIGN KEY (documento_id)
            REFERENCES documento (documento_id)
            ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS revision_documento
(
    revision_documento_id SERIAL PRIMARY KEY,
    usuario_id            INTEGER,
    version_documento_id          INTEGER                  NOT NULL,
    fecha_limite_revision DATE,
    fecha_revision        DATE                     NOT NULL,
    estado_revision       enum_estado_revision     NOT NULL DEFAULT 'pendiente',
    link_archivo_revision TEXT,
    activo                BOOLEAN                           DEFAULT TRUE,
    fecha_creacion        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion    TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_revision_documento_usuario
        FOREIGN KEY (usuario_id)
            REFERENCES usuario (usuario_id)
            ON DELETE RESTRICT,
    CONSTRAINT fk_revision_documento_version_documento
        FOREIGN KEY (version_documento_id)
            REFERENCES version_documento (version_documento_id)
            ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS tipo_observacion
(
    tipo_observacion_id SERIAL PRIMARY KEY,
    nombre_tipo         VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS observacion
(
    observacion_id       SERIAL PRIMARY KEY,
    tipo_observacion_id  INTEGER,
    revision_id          INTEGER,
    usuario_creacion_id  INTEGER,
    numero_pagina_inicio INTEGER,
    numero_pagina_fin    INTEGER,
    comentario           TEXT                     NOT NULL,
    es_automatico        BOOLEAN                  NOT NULL DEFAULT FALSE,
    fecha_creacion       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion   TIMESTAMP WITH TIME ZONE,
    activo               BOOLEAN                           DEFAULT TRUE,

    CONSTRAINT check_numero_pagina
        CHECK (numero_pagina_inicio > 0 AND numero_pagina_fin > 0 AND numero_pagina_inicio <= numero_pagina_fin),
    CONSTRAINT fk_observacion_tipo_observacion
        FOREIGN KEY (tipo_observacion_id)
            REFERENCES tipo_observacion (tipo_observacion_id)
            ON DELETE SET NULL,
    CONSTRAINT fk_observacion_revision_documento
        FOREIGN KEY (revision_id)
            REFERENCES revision_documento (revision_documento_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_observacion_usuario
        FOREIGN KEY (usuario_creacion_id)
            REFERENCES usuario (usuario_id)
            ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS reunion
(
    reunion_id         SERIAL PRIMARY KEY,
    titulo             TEXT,
    fecha_hora_inicio  TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_hora_fin     TIMESTAMP WITH TIME ZONE NOT NULL,
    descripcion        TEXT,
    disponible         INTEGER,
    url                TEXT,
    fecha_creacion     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE,
    activo             BOOLEAN                           DEFAULT TRUE

);


CREATE TABLE IF NOT EXISTS usuario_reunion
(
    usuario_reunion_id SERIAL PRIMARY KEY,
    reunion_id         INTEGER                  NOT NULL,
    usuario_id         INTEGER                  NOT NULL,
    estado_asistencia  VARCHAR(50),
    estado_detalle     VARCHAR(50),
    fecha_creacion     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP WITH TIME ZONE,
    activo             BOOLEAN                           DEFAULT TRUE,

    CONSTRAINT fk_ur_reunion
        FOREIGN KEY (reunion_id)
            REFERENCES reunion (reunion_id)
            ON DELETE CASCADE,
    CONSTRAINT fk_ur_usuario
        FOREIGN KEY (usuario_id)
            REFERENCES usuario (usuario_id)
            ON DELETE CASCADE
);


--Para 1-1

ALTER TABLE entregable_x_tema DROP CONSTRAINT IF EXISTS fk_entregable_x_tema_revision_criterio_entregable;
ALTER TABLE entregable_x_tema
    ADD CONSTRAINT fk_entregable_x_tema_revision_criterio_entregable
        FOREIGN KEY (revision_criterio_entregable_id)
            REFERENCES revision_criterio_entregable (revision_criterio_entregable_id)
            ON DELETE SET NULL;

ALTER TABLE version_documento DROP CONSTRAINT IF EXISTS fk_version_documento_revision_documento;
ALTER TABLE version_documento
    ADD CONSTRAINT fk_version_documento_revision_documento
        FOREIGN KEY (revision_documento_id)
            REFERENCES revision_documento (revision_documento_id)
            ON DELETE CASCADE;

ALTER TABLE bloque_horario_exposicion DROP CONSTRAINT IF EXISTS fk_bhe_exposicion_x_tema;
ALTER TABLE bloque_horario_exposicion
    ADD CONSTRAINT fk_bhe_exposicion_x_tema
        FOREIGN KEY (exposicion_x_tema_id)
            REFERENCES exposicion_x_tema (exposicion_x_tema_id)
            ON DELETE SET NULL;

ALTER TABLE exposicion_x_tema DROP CONSTRAINT IF EXISTS fk_ext_revision_criterio_x_exposicion;
ALTER TABLE exposicion_x_tema
    ADD CONSTRAINT fk_ext_revision_criterio_x_exposicion
        FOREIGN KEY (revision_criterio_x_exposicion_id)
            REFERENCES revision_criterio_x_exposicion (revision_criterio_x_exposicion_id)
            ON DELETE SET NULL;


ALTER TABLE carrera_parametro_configuracion DROP CONSTRAINT IF EXISTS fk_cpc_grupo;
ALTER TABLE carrera_parametro_configuracion
    ADD CONSTRAINT fk_cpc_grupo
        FOREIGN KEY (etapa_formativa_id)
            REFERENCES etapa_formativa (etapa_formativa_id)
            ON DELETE RESTRICT;

-- NECESARIO PARA QUE NO EXISTAN PROBLEMAS CON LOS ENUMS
-- AGREGAR EL CAST PARA LOS DEMAS ENUMS DE SER NECESARIO
CREATE CAST (character varying AS enum_estado_actividad) WITH INOUT AS ASSIGNMENT;
