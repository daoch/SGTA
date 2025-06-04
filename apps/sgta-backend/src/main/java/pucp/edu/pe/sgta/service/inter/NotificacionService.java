package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.NotificacionDto;
import pucp.edu.pe.sgta.dto.OverdueAlertDto;

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
} 