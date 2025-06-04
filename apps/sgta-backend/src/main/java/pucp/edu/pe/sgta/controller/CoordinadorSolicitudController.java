package pucp.edu.pe.sgta.controller;

import org.springframework.security.access.AccessDeniedException;
import pucp.edu.pe.sgta.dto.asesores.AprobarSolicitudRequestDto; // Nuevo DTO
import pucp.edu.pe.sgta.dto.asesores.ProponerNuevoAsesorRequestDto;
import pucp.edu.pe.sgta.dto.asesores.SolicitudActualizadaDto; // DTO de respuesta (ver más abajo)
import pucp.edu.pe.sgta.exception.BusinessRuleException;
import pucp.edu.pe.sgta.exception.ResourceNotFoundException;
import pucp.edu.pe.sgta.service.inter.CoordinadorSolicitudService; // Servicio para la lógica del coordinador
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pucp.edu.pe.sgta.service.inter.TemaService;

import java.util.Map;

@RestController
@RequestMapping("/coordinador/solicitudes-cese") // Ruta base
public class CoordinadorSolicitudController {

    private static final Logger log = LoggerFactory.getLogger(CoordinadorSolicitudController.class);

    @Autowired
    private CoordinadorSolicitudService coordinadorSolicitudService; // Asume este nombre de servicio

    @Autowired
    private TemaService temaService;

    // ... (endpoint de rechazar si ya lo tienes aquí) ...

    @PostMapping("/{solicitudId}/aprobar")
    public ResponseEntity<?> aprobarSolicitudCese(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Integer solicitudId,
            @Valid @RequestBody AprobarSolicitudRequestDto requestDto
    ) {
        if (jwt == null) { /* ... unauthorized ... */ return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado.");}
        String coordinadorCognitoSub = jwt.getSubject();
        if (coordinadorCognitoSub == null || coordinadorCognitoSub.trim().isEmpty()) { /* ... unauthorized ... */ return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido.");}

        log.info("Coordinador CognitoSub {} aprobando solicitud de cese ID: {}", coordinadorCognitoSub, solicitudId);
        try {
            SolicitudActualizadaDto solicitudActualizada = coordinadorSolicitudService.aprobarSolicitudCese(
                    solicitudId,
                    requestDto.getComentarioAprobacion(),
                    coordinadorCognitoSub
            );
            return ResponseEntity.ok(solicitudActualizada);
        } catch (ResourceNotFoundException e) {
            log.warn("No se pudo aprobar solicitud ID {}: {}", solicitudId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BusinessRuleException | IllegalStateException e) { // IllegalStateException si la solicitud no está PENDIENTE
            log.warn("No se pudo aprobar solicitud ID {}: {}", solicitudId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error inesperado al aprobar solicitud ID {}: {}", solicitudId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al procesar la aprobación.");
        }
    }

    @PostMapping("/{solicitudDeCeseId}/proponer-reasignacion")
    public ResponseEntity<?> proponerReasignacionAsesor(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Integer solicitudDeCeseId,
            @Valid @RequestBody ProponerNuevoAsesorRequestDto requestDto // Usar el DTO simplificado
    ) {
        if (jwt == null) { /* ... */ return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado.");}
        String coordinadorCognitoSub = jwt.getSubject();
        if (coordinadorCognitoSub == null || coordinadorCognitoSub.trim().isEmpty()) { /* ... */ return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido.");}

        log.info("Coordinador CognitoSub {} proponiendo reasignación para solicitud de cese ID {} al nuevo asesor ID: {}",
                coordinadorCognitoSub, solicitudDeCeseId, requestDto.getNuevoAsesorPropuestoId());
        try {
            temaService.proponerReasignacionParaSolicitudCese( // Llamar al método con la nueva firma
                    solicitudDeCeseId,
                    requestDto.getNuevoAsesorPropuestoId(),
                    coordinadorCognitoSub
            );
            return ResponseEntity.ok().body(Map.of("mensaje", "Propuesta de reasignación enviada exitosamente al asesor."));
        } catch (ResourceNotFoundException e) {
            log.warn("No se pudo proponer reasignación para solicitud ID {}: {}", solicitudDeCeseId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BusinessRuleException | IllegalStateException | IllegalArgumentException e) { // IllegalArgumentException para tipo de usuario
            log.warn("No se pudo proponer reasignación para solicitud ID {}: {}", solicitudDeCeseId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (AccessDeniedException e){
            log.warn("Acceso denegado para coordinador {} en solicitud {}: {}", coordinadorCognitoSub, solicitudDeCeseId, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
        catch (Exception e) {
            log.error("Error inesperado al proponer reasignación para solicitud ID {}: {}", solicitudDeCeseId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al procesar la propuesta.");
        }
    }

}