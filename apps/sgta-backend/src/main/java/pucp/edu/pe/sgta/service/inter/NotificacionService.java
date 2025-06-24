package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.NotificacionDto;
import pucp.edu.pe.sgta.dto.OverdueAlertDto;
import pucp.edu.pe.sgta.model.Notificacion;

import java.util.List;

public interface NotificacionService {

    /**
     * Obtiene las notificaciones no leídas de un usuario para un módulo específico
     */
    List<NotificacionDto> getUnreadNotifications(Integer usuarioId, Integer moduloId);

    /**
     * Obtiene todas las notificaciones no leídas de un usuario
     */
    List<NotificacionDto> getAllUnreadNotifications(Integer usuarioId);

    /**
     * Obtiene todas las notificaciones (leídas y no leídas) de un usuario para un módulo específico
     */
    List<NotificacionDto> getAllNotifications(Integer usuarioId, Integer moduloId);

    /**
     * Obtiene todas las notificaciones (leídas y no leídas) de un usuario
     */
    List<NotificacionDto> getAllNotifications(Integer usuarioId);

    /**
     * Cuenta las notificaciones no leídas de un usuario para un módulo específico
     */
    int countUnreadNotifications(Integer usuarioId, Integer moduloId);

    /**
     * Cuenta todas las notificaciones no leídas de un usuario
     */
    int countAllUnreadNotifications(Integer usuarioId);

    /**
     * Marca una notificación como leída
     */
    void markAsRead(Integer notificacionId, Integer usuarioId);

    /**
     * Obtiene un resumen de entregables vencidos para un usuario
     */
    OverdueAlertDto getOverdueSummary(Integer usuarioId);

    /**
     * Crea una notificación de recordatorio para un entregable
     */
    void crearNotificacionRecordatorio(Integer usuarioId, String nombreEntregable, 
                                     String fechaVencimiento, int diasRestantes);

    /**
     * Crea una notificación de error por entregable vencido
     */
    void crearNotificacionError(Integer usuarioId, String nombreEntregable, 
                              String fechaVencimiento, int diasAtraso);

    /**
     * Genera recordatorios automáticos para entregables próximos a vencer
     */
    void generarRecordatoriosAutomaticos();

    /**
     * Genera alertas automáticas para entregables vencidos
     */
    void generarAlertasVencidos();

    /**
     * Crea y guarda una nueva notificación para un usuario.
     *
     * @param usuarioDestinatarioId ID del usuario que recibirá la notificación.
     * @param moduloNombre Nombre del módulo que origina la notificación (ej. "SOLICITUDES_CESE").
     * @param tipoNotificacionNombre Nombre del tipo de notificación (ej. "NUEVA_SOLICITUD", "RECORDATORIO").
     * @param mensaje El contenido del mensaje de la notificación.
     * @param canal Por qué canal se enviará/mostrará (ej. "SISTEMA", "EMAIL").
     * @param enlaceRedireccion (Opcional) Un enlace URL para que el usuario sea redirigido al hacer clic.
     * @return La entidad Notificacion creada y guardada.
     */
    Notificacion crearNotificacionParaUsuario(
            Integer usuarioDestinatarioId,
            String moduloNombre,
            String tipoNotificacionNombre,
            String mensaje,
            String canal,
            String enlaceRedireccion
    );
} 