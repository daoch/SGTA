package pucp.edu.pe.sgta.config;

public final class SgtaConstants {

    // Constructor privado para prevenir instanciación de clase de utilidad
    private SgtaConstants() {}

    // === Nombres de Roles Generales (tabla: rol) ===
    public static final String ROL_NOMBRE_ASESOR = "Asesor";
    public static final String ROL_NOMBRE_TESISTA = "Tesista";
    public static final String ROL_NOMBRE_JURADO = "Jurado";
    public static final String ROL_NOMBRE_COORDINADOR_CARRERA = "Coordinador"; // Si tienes un rol específico en la tabla 'rol' para coordinadores de carrera
    // Si no, la identificación del coordinador es por 'tipo_usuario'.
    // ... otros roles generales que puedas tener ...

    // === Nombres de Tipos de Usuario (tabla: tipo_usuario) ===
    public static final String TIPO_USUARIO_PROFESOR = "profesor"; // Asegúrate que coincida con tu BD
    public static final String TIPO_USUARIO_ALUMNO = "alumno";
    public static final String TIPO_USUARIO_COORDINADOR = "coordinador";
    public static final String TIPO_USUARIO_ADMINISTRADOR = "administrador";


    // === Nombres de Tipos de Solicitud (tabla: tipo_solicitud) ===
    public static final String TIPO_SOLICITUD_NOMBRE_CESE = "Cese Asesoria"; // Como lo ajustamos
    public static final String TIPO_SOLICITUD_CAMBIO_ASESOR = "CAMBIO_ASESOR"; // Si tienes este tipo
    // ... otros tipos de solicitud ...


    // === Nombres de Estados de Solicitud (tabla: estado_solicitud) ===
    public static final String ESTADO_SOLICITUD_PENDIENTE = "PENDIENTE";
    public static final String ESTADO_SOLICITUD_APROBADA = "APROBADA";
    public static final String ESTADO_SOLICITUD_RECHAZADA = "RECHAZADA";
    public static final String ESTADO_SOLICITUD_CANCELADA = "CANCELADA"; // Si lo usas
    public static final String ESTADO_SOLICITUD_EN_REVISION = "EN_REVISION"; // Si lo usas
    // ... otros estados de solicitud ...


    // === Nombres de Roles en Solicitud (tabla: rol_solicitud) ===
    public static final String ROL_SOLICITUD_ASESOR_CESE = "ASESOR_SOLICITANTE_CESE";
    public static final String ROL_SOLICITUD_COORDINADOR_GESTOR = "COORDINADOR_GESTOR";
    public static final String ROL_SOLICITUD_ESTUDIANTE_AFECTADO = "ESTUDIANTE_AFECTADO";
    public static final String ROL_SOLICITUD_ASESOR_PROPUESTO = "ASESOR_PROPUESTO_REASIGNACION"; // Para el nuevo asesor
    // ... otros roles específicos de un flujo de solicitud ...


    // === Nombres de Acciones en Solicitud (tabla: accion_solicitud) ===
    public static final String ACCION_SOLICITUD_CREADA = "CREADA";
    public static final String ACCION_SOLICITUD_PENDIENTE_ACCION = "PENDIENTE_ACCION"; // Para el coordinador/gestor
    public static final String ACCION_SOLICITUD_INFORMADO = "INFORMADO";             // Para el estudiante inicialmente
    public static final String ACCION_SOLICITUD_ACEPTADO_COORDINADOR = "ACEPTADO";    // Decisión del coordinador de aprobar cese
    public static final String ACCION_SOLICITUD_RECHAZADO_COORDINADOR = "RECHAZADO";  // Decisión del coordinador de rechazar cese
    public static final String ACCION_SOLICITUD_PROPUESTA_ENVIADA = "PROPUESTA_REASIGNACION_ENVIADA"; // Cuando el coord. propone a Asesor B
    public static final String ACCION_SOLICITUD_PROPUESTA_ACEPTADA_ASESOR = "PROPUESTA_ASESORIA_ACEPTADA"; // Cuando Asesor B acepta
    public static final String ACCION_SOLICITUD_PROPUESTA_RECHAZADA_ASESOR = "PROPUESTA_ASESORIA_RECHAZADA"; // Cuando Asesor B rechaza
    // ... otras acciones ...
    public static final String ESTADO_REASIGNACION_PENDIENTE_ASESOR = "PENDIENTE_ACEPTACION_ASESOR";
    public static final String ESTADO_SOLICITUD_APROBADA_NOMBRE = "APROBADA"; // Debe coincidir con tu BD

    // === Nombres de Estados de Tema (tabla: estado_tema) ===
    public static final String ESTADO_TEMA_EN_PROGRESO = "EN_PROGRESO"; // O el que uses para temas activos
    // ... otros estados de tema ...


    // === Nombres de Módulos (para Notificaciones - tabla: modulo) ===
    // Estos deben existir en tu tabla `modulo` con estos nombres exactos.
    public static final String MODULO_SOLICITUDES = "Solicitudes"; // Genérico para solicitudes
    public static final String MODULO_SOLICITUDES_CESE = "Asesores"; // Específico si lo tienes
    public static final String MODULO_ASESORIA_TEMA = "Asesores";
    public static final String MODULO_PROPUESTAS_ASESORIA = "PropuestasAsesoria"; // Para el Asesor B
    // ... otros módulos ...


    // === Nombres de Tipos de Notificación (para Notificaciones - tabla: tipo_notificacion) ===
    // Estos deben existir en tu tabla `tipo_notificacion` con estos nombres exactos.
    // Usa los que ya tienes: "informativa", "advertencia", "recordatorio", "error"
    // O crea tipos más específicos si lo deseas para mayor granularidad en el frontend.
    public static final String TIPO_NOTIF_INFORMATIVA = "informativa";
    public static final String TIPO_NOTIF_ADVERTENCIA = "advertencia";
    public static final String TIPO_NOTIF_RECORDATORIO = "recordatorio";
    public static final String TIPO_NOTIF_ERROR = "error";

    // Si creas tipos más específicos en la BD (OPCIONAL):
    // public static final String TIPO_NOTIF_NUEVA_SOLICITUD_CESE_COORD = "NuevaSolicitudCeseCoordinador";
    // public static final String TIPO_NOTIF_INFO_CESE_ESTUDIANTE = "InfoSolicitudCeseEstudiante";
    // public static final String TIPO_NOTIF_SOLICITUD_CESE_APROBADA = "SolicitudCeseAprobada";
    // public static final String TIPO_NOTIF_SOLICITUD_CESE_RECHAZADA = "SolicitudCeseRechazada";
    // public static final String TIPO_NOTIF_NUEVA_PROPUESTA_REASIGNACION_ASESOR = "NuevaPropuestaReasignacionAsesor";


    // === Estados para el Sub-proceso de Reasignación (en Solicitud.estadoReasignacion) ===
    public static final String ESTADO_REASIGNACION_PENDIENTE_PROPUESTA = "PENDIENTE_PROPUESTA_COORDINADOR"; // Después de aprobar cese, antes de proponer asesor
    public static final String ESTADO_REASIGNACION_PENDIENTE_ACEPTACION_ASESOR = "PENDIENTE_ACEPTACION_ASESOR";
    public static final String ESTADO_REASIGNACION_COMPLETADA = "REASIGNACION_COMPLETADA";
    public static final String ESTADO_REASIGNACION_RECHAZADA_POR_ASESOR = "REASIGNACION_RECHAZADA_POR_ASESOR";
    public static final String ESTADO_REASIGNACION_NO_APLICA = "NO_APLICA"; // Ej. si la solicitud de cese fue rechazada

}