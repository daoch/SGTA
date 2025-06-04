package pucp.edu.pe.sgta.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import pucp.edu.pe.sgta.dto.NotificacionDto; // El DTO que acabamos de definir
import pucp.edu.pe.sgta.service.inter.NotificacionService; // El servicio de notificaciones
import pucp.edu.pe.sgta.exception.ResourceNotFoundException;

import java.util.Map; // Para respuestas simples

@RestController
@RequestMapping("/notificaciones") // Ruta base para todos los endpoints de notificaciones
public class NotificacionController {

    private static final Logger log = LoggerFactory.getLogger(NotificacionController.class);

    @Autowired
    private NotificacionService notificacionService;

    /**
     * Obtiene la lista paginada de todas las notificaciones (leídas y no leídas)
     * para el usuario autenticado.
     */
    @GetMapping
    public ResponseEntity<Page<NotificacionDto>> getMisNotificaciones(
            @AuthenticationPrincipal Jwt jwt,
            // El frontend puede enviar 'leidas=false' para obtener solo las no leídas
            @RequestParam(required = false) Boolean leidas,
            @PageableDefault(size = 15, sort = "fechaCreacion", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        if (jwt == null) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); }
        String usuarioCognitoSub = jwt.getSubject();
        if (usuarioCognitoSub == null || usuarioCognitoSub.trim().isEmpty()) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); }

        log.info("Usuario CognitoSub {} solicitando sus notificaciones. Page: {}, Size: {}, Leidas: {}",
                usuarioCognitoSub, pageable.getPageNumber(), pageable.getPageSize(), leidas);
        try {
            Page<NotificacionDto> notificaciones = notificacionService.findAllByUsuarioCognitoSub(usuarioCognitoSub, leidas, pageable);
            return ResponseEntity.ok(notificaciones);
        } catch (Exception e) {
            log.error("Error al obtener notificaciones para usuario {}: {}", usuarioCognitoSub, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Page.empty(pageable));
        }
    }

    /**
     * Obtiene el conteo de notificaciones no leídas para el usuario autenticado.
     */
    @GetMapping("/count-no-leidas")
    public ResponseEntity<?> getCountMisNotificacionesNoLeidas(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); }
        String usuarioCognitoSub = jwt.getSubject();
        if (usuarioCognitoSub == null || usuarioCognitoSub.trim().isEmpty()) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); }

        log.info("Usuario CognitoSub {} solicitando conteo de notificaciones no leídas.", usuarioCognitoSub);
        try {
            long count = notificacionService.countNotificacionesNoLeidasByUsuarioCognitoSub(usuarioCognitoSub);
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            log.error("Error al obtener conteo de notificaciones no leídas para usuario {}: {}", usuarioCognitoSub, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error al obtener conteo"));
        }
    }

    /**
     * Marca una notificación específica como leída para el usuario autenticado.
     */
    @PostMapping("/{notificacionId}/marcar-leida")
    public ResponseEntity<?> marcarNotificacionComoLeida(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Integer notificacionId
    ) {
        if (jwt == null) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); }
        String usuarioCognitoSub = jwt.getSubject();
        if (usuarioCognitoSub == null || usuarioCognitoSub.trim().isEmpty()) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); }

        log.info("Usuario CognitoSub {} marcando notificación ID {} como leída.", usuarioCognitoSub, notificacionId);
        try {
            NotificacionDto notificacionActualizada = notificacionService.marcarNotificacionComoLeida(notificacionId, usuarioCognitoSub);
            return ResponseEntity.ok(notificacionActualizada);
        } catch (ResourceNotFoundException e) {
            log.warn("Intento de marcar notificación no encontrada ID {} o no perteneciente a usuario {}: {}", notificacionId, usuarioCognitoSub, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) { // Si ya estaba leída
            log.warn("Intento de marcar notificación ID {} como leída, pero ya lo estaba: {}", notificacionId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        catch (Exception e) {
            log.error("Error al marcar notificación ID {} como leída para usuario {}: {}", notificacionId, usuarioCognitoSub, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar la acción.");
        }
    }

    /**
     * Marca todas las notificaciones no leídas del usuario autenticado como leídas.
     */
    @PostMapping("/marcar-todas-leidas")
    public ResponseEntity<?> marcarTodasComoLeidas(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); }
        String usuarioCognitoSub = jwt.getSubject();
        if (usuarioCognitoSub == null || usuarioCognitoSub.trim().isEmpty()) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); }

        log.info("Usuario CognitoSub {} marcando todas sus notificaciones como leídas.", usuarioCognitoSub);
        try {
            int countMarcadas = notificacionService.marcarTodasComoLeidasByUsuarioCognitoSub(usuarioCognitoSub);
            return ResponseEntity.ok(Map.of("message", String.format("%d notificaciones marcadas como leídas.", countMarcadas), "count", countMarcadas));
        } catch (Exception e) {
            log.error("Error al marcar todas las notificaciones como leídas para usuario {}: {}", usuarioCognitoSub, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar la acción.");
        }
    }
}