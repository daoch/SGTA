package pucp.edu.pe.sgta.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.NotificacionDto;
import pucp.edu.pe.sgta.dto.OverdueAlertDto;
import pucp.edu.pe.sgta.service.inter.NotificacionService;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificacionController {

    private final NotificacionService notificacionService;

    /**
     * Obtiene todas las notificaciones no leídas del usuario autenticado
     * GET /api/notifications/unread
     */
    @GetMapping("/unread")
    public ResponseEntity<List<NotificacionDto>> getUnreadNotifications(Authentication authentication) {
        try {
            Integer usuarioId = 12;
            List<NotificacionDto> notificaciones = notificacionService.getAllUnreadNotifications(usuarioId);
            log.info("Usuario {} consultó {} notificaciones no leídas", usuarioId, notificaciones.size());
            return ResponseEntity.ok(notificaciones);
        } catch (Exception e) {
            log.error("Error al obtener notificaciones no leídas: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtiene todas las notificaciones (leídas y no leídas) del usuario autenticado
     * GET /api/notifications/all
     */
    @GetMapping("/all")
    public ResponseEntity<List<NotificacionDto>> getAllNotifications(Authentication authentication) {
        try {
            Integer usuarioId = 12;
            List<NotificacionDto> notificaciones = notificacionService.getAllNotifications(usuarioId);
            log.info("Usuario {} consultó {} notificaciones totales", usuarioId, notificaciones.size());
            return ResponseEntity.ok(notificaciones);
        } catch (Exception e) {
            log.error("Error al obtener todas las notificaciones: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtiene las notificaciones no leídas del usuario para un módulo específico
     * GET /api/notifications/unread/{moduloId}
     */
    @GetMapping("/unread/{moduloId}")
    public ResponseEntity<List<NotificacionDto>> getUnreadNotificationsByModule(
            @PathVariable Integer moduloId,
            Authentication authentication) {
        try {
            Integer usuarioId = 12;
            List<NotificacionDto> notificaciones = notificacionService.getUnreadNotifications(usuarioId, moduloId);
            log.info("Usuario {} consultó {} notificaciones no leídas del módulo {}", 
                    usuarioId, notificaciones.size(), moduloId);
            return ResponseEntity.ok(notificaciones);
        } catch (Exception e) {
            log.error("Error al obtener notificaciones no leídas por módulo: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtiene todas las notificaciones (leídas y no leídas) del usuario para un módulo específico
     * GET /api/notifications/all/{moduloId}
     */
    @GetMapping("/all/{moduloId}")
    public ResponseEntity<List<NotificacionDto>> getAllNotificationsByModule(
            @PathVariable Integer moduloId,
            Authentication authentication) {
        try {
            Integer usuarioId = 12;
            List<NotificacionDto> notificaciones = notificacionService.getAllNotifications(usuarioId, moduloId);
            log.info("Usuario {} consultó {} notificaciones totales del módulo {}", 
                    usuarioId, notificaciones.size(), moduloId);
            return ResponseEntity.ok(notificaciones);
        } catch (Exception e) {
            log.error("Error al obtener todas las notificaciones por módulo: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Cuenta todas las notificaciones no leídas del usuario
     * GET /api/notifications/count-unread
     */
    @GetMapping("/count-unread")
    public ResponseEntity<Map<String, Integer>> countUnreadNotifications(Authentication authentication) {
        try {
            Integer usuarioId = 12;
            int count = notificacionService.countAllUnreadNotifications(usuarioId);
            log.debug("Usuario {} tiene {} notificaciones no leídas", usuarioId, count);
            return ResponseEntity.ok(Map.of("unreadCount", count));
        } catch (Exception e) {
            log.error("Error al contar notificaciones no leídas: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Cuenta las notificaciones no leídas del usuario para un módulo específico
     * GET /api/notifications/count-unread/{moduloId}
     */
    @GetMapping("/count-unread/{moduloId}")
    public ResponseEntity<Map<String, Integer>> countUnreadNotificationsByModule(
            @PathVariable Integer moduloId,
            Authentication authentication) {
        try {
            Integer usuarioId = 12;
            int count = notificacionService.countUnreadNotifications(usuarioId, moduloId);
            log.debug("Usuario {} tiene {} notificaciones no leídas del módulo {}", usuarioId, count, moduloId);
            return ResponseEntity.ok(Map.of("unreadCount", count));
        } catch (Exception e) {
            log.error("Error al contar notificaciones no leídas por módulo: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Marca una notificación como leída
     * POST /api/notifications/mark-read/{notificacionId}
     */
    @PostMapping("/mark-read/{notificacionId}")
    public ResponseEntity<Map<String, String>> markAsRead(
            @PathVariable Integer notificacionId,
            Authentication authentication) {
        try {
            Integer usuarioId = 12;
            notificacionService.markAsRead(notificacionId, usuarioId);
            log.info("Usuario {} marcó como leída la notificación {}", usuarioId, notificacionId);
            return ResponseEntity.ok(Map.of("message", "Notificación marcada como leída"));
        } catch (Exception e) {
            log.error("Error al marcar notificación como leída: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al marcar la notificación como leída"));
        }
    }

    /**
     * Obtiene un resumen de entregables vencidos para mostrar en el módulo de reportes
     * GET /api/notifications/overdue-summary
     */
    @GetMapping("/overdue-summary")
    public ResponseEntity<OverdueAlertDto> getOverdueSummary(Authentication authentication) {
        try {
            Integer usuarioId = 12;
            OverdueAlertDto summary = notificacionService.getOverdueSummary(usuarioId);
            log.info("Usuario {} consultó resumen de vencidos: {} entregables", usuarioId, summary.getTotal());
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            log.error("Error al obtener resumen de entregables vencidos: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Endpoint para testing - fuerza la generación de recordatorios (solo para desarrollo)
     * POST /api/notifications/test/generate-reminders
     */
    @PostMapping("/test/generate-reminders")
    public ResponseEntity<Map<String, String>> testGenerateReminders() {
        try {
            log.info("Ejecutando generación manual de recordatorios para testing");
            notificacionService.generarRecordatoriosAutomaticos();
            notificacionService.generarAlertasVencidos();
            return ResponseEntity.ok(Map.of("message", "Recordatorios generados exitosamente"));
        } catch (Exception e) {
            log.error("Error al generar recordatorios de prueba: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al generar recordatorios"));
        }
    }

    /**
     * Extrae el ID del usuario desde el token de autenticación
     */
    private Integer obtenerUsuarioId(Authentication authentication) {
        // Asumiendo que el nombre del usuario en el token es el ID
        // Esto puede variar según la implementación de seguridad del proyecto
        try {
            return Integer.parseInt(authentication.getName());
        } catch (NumberFormatException e) {
            log.error("No se pudo obtener el ID del usuario desde el token: {}", authentication.getName());
            throw new RuntimeException("Token de usuario inválido");
        }
    }
} 