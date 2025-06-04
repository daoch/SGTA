package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.NotificacionDto;
import pucp.edu.pe.sgta.model.Notificacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificacionService {

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

    /**
     * Obtiene las notificaciones paginadas para un usuario.
     * @param usuarioId ID del usuario.
     * @param pageable Información de paginación.
     * @return Página de notificaciones.
     */
    Page<Notificacion> getNotificacionesParaUsuario(Integer usuarioId, Pageable pageable);

    /**
     * Obtiene las notificaciones no leídas paginadas para un usuario.
     * @param usuarioId ID del usuario.
     * @param pageable Información de paginación.
     * @return Página de notificaciones no leídas.
     */
    Page<Notificacion> getNotificacionesNoLeidasParaUsuario(Integer usuarioId, Pageable pageable);

    /**
     * Cuenta las notificaciones no leídas para un usuario.
     * @param usuarioId ID del usuario.
     * @return Número de notificaciones no leídas.
     */
    long countNotificacionesNoLeidasParaUsuario(Integer usuarioId);

    /**
     * Marca una notificación como leída.
     * @param notificacionId ID de la notificación.
     * @param usuarioCognitoSub del usuario (para validar que es su notificación).
     * @return La notificación actualizada.
     * @throws ResourceNotFoundException si la notificación no existe o no pertenece al usuario.
     * @throws IllegalStateException si la notificación ya estaba leída.
     */
    NotificacionDto marcarNotificacionComoLeida(Integer notificacionId, String usuarioCognitoSub);

    /**
     * Marca todas las notificaciones no leídas de un usuario como leídas.
     * @param usuarioId ID del usuario.
     * @return Número de notificaciones marcadas como leídas.
     */
    int marcarTodasComoLeidas(Integer usuarioId);

    public long countNotificacionesNoLeidasByUsuarioCognitoSub(String usuarioCognitoSub);

    public int marcarTodasComoLeidasByUsuarioCognitoSub(String usuarioCognitoSub);

    public Page<NotificacionDto> findAllByUsuarioCognitoSub(String usuarioCognitoSub, Boolean soloNoLeidas, Pageable pageable);

}