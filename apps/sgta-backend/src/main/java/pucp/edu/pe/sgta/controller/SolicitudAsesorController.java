package pucp.edu.pe.sgta.controller; // Ajustado a tu paquete

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import pucp.edu.pe.sgta.dto.asesores.AsesorTemaActivoDto; // Asumiendo que este DTO está en este paquete
import pucp.edu.pe.sgta.dto.asesores.InvitacionAsesoriaDto;
import pucp.edu.pe.sgta.dto.asesores.MiSolicitudCeseItemDto; // Nuevo DTO
import pucp.edu.pe.sgta.dto.asesores.RechazarInvitacionAsesoriaRequestDto;
import pucp.edu.pe.sgta.exception.BusinessRuleException;
import pucp.edu.pe.sgta.exception.ResourceNotFoundException;
import pucp.edu.pe.sgta.service.inter.SolicitudAsesorService;
import pucp.edu.pe.sgta.service.inter.SolicitudCoordinadorService; // Servicio para lógica de solicitudes de cese del asesor

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/asesor") // Ruta base para endpoints relacionados con el asesor, añadí /api
public class SolicitudAsesorController {

    private static final Logger log = LoggerFactory.getLogger(SolicitudAsesorController.class);

    @Autowired
    private SolicitudAsesorService asesorService; // Para obtener temas activos del asesor

    @Autowired
    private SolicitudCoordinadorService solicitudAsesorService; // Para crear y listar solicitudes de cese del asesor

    /**
     * Endpoint para que el asesor obtenga la lista de temas que actualmente supervisa.
     * Usado para poblar el dropdown en el modal de "Nueva Solicitud de Cese".
     */
    @GetMapping("/mis-temas-activos")
    public ResponseEntity<List<AsesorTemaActivoDto>> getMisTemasActivos(
            @AuthenticationPrincipal Jwt jwt
    ) {
        if (jwt == null) {
            log.warn("Intento de GET /mis-temas-activos sin autenticación (JWT nulo).");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String asesorCognitoSub = jwt.getSubject();
        if (asesorCognitoSub == null || asesorCognitoSub.trim().isEmpty()) {
            log.error("El token JWT para GET /mis-temas-activos no contiene el claim 'sub'.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        log.info("Asesor CognitoSub {} solicitando sus temas activos de asesoría.", asesorCognitoSub);
        try {
            List<AsesorTemaActivoDto> temas = asesorService.findTemasActivosByAsesorCognitoSub(asesorCognitoSub);
            return ResponseEntity.ok(temas);
        } catch (Exception e) {
            log.error("Error al obtener temas activos para asesor {}: {}", asesorCognitoSub, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Endpoint para que el asesor obtenga la lista paginada de las solicitudes de cese
     * que él mismo ha iniciado.
     */
    // @GetMapping("/mis-solicitudes-cese")
    // public ResponseEntity<Page<MiSolicitudCeseItemDto>> getMisSolicitudesDeCese(
    //         @AuthenticationPrincipal Jwt jwt,
    //         @PageableDefault(size = 5, sort = "fechaCreacion", direction = Sort.Direction.DESC) Pageable pageable,
    //         @RequestParam(required = false) String searchTerm
    // ) {
    //     if (jwt == null) {
    //         log.warn("Intento de GET /mis-solicitudes-cese sin autenticación (JWT nulo).");
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    //     }
    //     String asesorCognitoSub = jwt.getSubject();
    //     if (asesorCognitoSub == null || asesorCognitoSub.trim().isEmpty()) {
    //         log.error("El token JWT para GET /mis-solicitudes-cese no contiene el claim 'sub'.");
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    //     }

    //     log.info("Asesor {} pidiendo historial de solicitudes. Page: {}, Size: {}, SearchTerm: {}",
    //             asesorCognitoSub, pageable.getPageNumber(), pageable.getPageSize(), searchTerm);

    //     try {
    //         Page<MiSolicitudCeseItemDto> misSolicitudes =
    //                 solicitudAsesorService.findSolicitudesCeseByAsesor(
    //                         asesorCognitoSub,
    //                         searchTerm == null ? "" : searchTerm.trim(),
    //                         pageable
    //                 );
    //         return ResponseEntity.ok(misSolicitudes);
    //     } catch (Exception e) {
    //         log.error("Error al obtener solicitudes de cese para asesor {}: {}", asesorCognitoSub, e.getMessage(), e);
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    //     }
    // }

    // /**
    //  * NUEVO ENDPOINT: Endpoint para que el asesor (Asesor B) obtenga la lista paginada
    //  * de propuestas de asesoría que le ha enviado un coordinador y están pendientes de su decisión.
    //  */
    @GetMapping("/invitaciones-asesoria")
    public ResponseEntity<Page<InvitacionAsesoriaDto>> getMisInvitacionesDeAsesoria(
            @AuthenticationPrincipal Jwt jwt,
            @PageableDefault(size = 10, sort = "fechaModificacion", direction = Sort.Direction.DESC) Pageable pageable
            // Podrías añadir @RequestParam(required = false) String status si quieres filtrar por un estado de propuesta interno
    ) {
        if (jwt == null) {
            log.warn("Intento de GET /invitaciones-asesoria sin autenticación (JWT nulo).");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String asesorCognitoSub = jwt.getSubject(); // Este es el Asesor B
        if (asesorCognitoSub == null || asesorCognitoSub.trim().isEmpty()) {
            log.error("El token JWT para GET /invitaciones-asesoria no contiene el claim 'sub'.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        log.info("Asesor CognitoSub {} solicitando sus invitaciones de asesoría pendientes. Page: {}, Size: {}",
                asesorCognitoSub, pageable.getPageNumber(), pageable.getPageSize());
        try {
            Page<InvitacionAsesoriaDto> invitaciones = asesorService.findInvitacionesAsesoriaPendientesByAsesor(asesorCognitoSub, pageable);
            return ResponseEntity.ok(invitaciones);
        } catch (Exception e) {
            log.error("Error al obtener invitaciones de asesoría para asesor {}: {}", asesorCognitoSub, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Page.empty(pageable)); // Devuelve Page vacío en error
        }
    }

    // @PostMapping("/invitaciones-asesoria/{solicitudOriginalId}/rechazar")
    // public ResponseEntity<?> rechazarInvitacionAsesoria(
    //         @AuthenticationPrincipal Jwt jwt,
    //         @PathVariable Integer solicitudOriginalId, // ID de la Solicitud de cese original (que contiene la propuesta)
    //         @Valid @RequestBody RechazarInvitacionAsesoriaRequestDto requestDto
    // ) {
    //     if (jwt == null) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado."); }
    //     String asesorCognitoSub = jwt.getSubject(); // Este es el Asesor B (el que está rechazando)
    //     if (asesorCognitoSub == null || asesorCognitoSub.trim().isEmpty()) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido."); }

    //     log.info("Asesor CognitoSub {} rechazando invitación de asesoría para Solicitud ID: {} con motivo: '{}'",
    //             asesorCognitoSub, solicitudOriginalId, requestDto.getMotivoRechazo());
    //     try {
    //         asesorService.rechazarInvitacionDeAsesoria(
    //                 solicitudOriginalId,
    //                 asesorCognitoSub,
    //                 requestDto.getMotivoRechazo()
    //         );
    //         // Para una acción de rechazo, un 200 OK con un mensaje simple o sin cuerpo es común.
    //         return ResponseEntity.ok().body(Map.of("mensaje", "Invitación de asesoría rechazada correctamente."));
    //     } catch (ResourceNotFoundException e) {
    //         log.warn("No se pudo rechazar invitación para Solicitud ID {}: {}", solicitudOriginalId, e.getMessage());
    //         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    //     } catch (BusinessRuleException | IllegalStateException e) {
    //         log.warn("No se pudo rechazar invitación para Solicitud ID {}: {}", solicitudOriginalId, e.getMessage());
    //         return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    //     } catch (AccessDeniedException e) { // Si el asesor no es el propuesto
    //         log.warn("Acceso denegado para asesor {} en propuesta de solicitud {}: {}", asesorCognitoSub, solicitudOriginalId, e.getMessage());
    //         return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
    //     } catch (Exception e) {
    //         log.error("Error inesperado al rechazar invitación para Solicitud ID {}: {}", solicitudOriginalId, e.getMessage(), e);
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al procesar el rechazo.");
    //     }
    // }

    @PostMapping("/invitaciones-asesoria/{solicitudOriginalId}/aceptar")
    public ResponseEntity<?> aceptarInvitacionAsesoria(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Integer solicitudOriginalId // ID de la Solicitud de cese original (que contiene la propuesta)
    ) {
        if (jwt == null) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autenticado."); }
        String asesorCognitoSub = jwt.getSubject(); // Este es el Asesor B (el que está aceptando)
        if (asesorCognitoSub == null || asesorCognitoSub.trim().isEmpty()) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido."); }

        log.info("Asesor CognitoSub {} aceptando invitación de asesoría para Solicitud ID: {}",
                asesorCognitoSub, solicitudOriginalId);
        try {
            asesorService.aceptarInvitacionDeAsesoria(
                    solicitudOriginalId,
                    asesorCognitoSub
            );
            return ResponseEntity.ok().body(Map.of("mensaje", "Invitación de asesoría aceptada y reasignación completada."));
        } catch (ResourceNotFoundException e) {
            log.warn("No se pudo aceptar invitación para Solicitud ID {}: {}", solicitudOriginalId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BusinessRuleException | IllegalStateException e) {
            log.warn("No se pudo aceptar invitación para Solicitud ID {}: {}", solicitudOriginalId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (AccessDeniedException e) {
            log.warn("Acceso denegado para asesor {} al intentar aceptar propuesta de solicitud {}: {}", asesorCognitoSub, solicitudOriginalId, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error inesperado al aceptar invitación para Solicitud ID {}: {}", solicitudOriginalId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al procesar la aceptación.");
        }
    }

    // Aquí irían los endpoints POST para ACEPTAR y RECHAZAR una invitación, usando @PathVariable para el ID de la invitación (solicitudOriginalId)
    // Ejemplo:
    // @PostMapping("/invitaciones-asesoria/{solicitudOriginalId}/aceptar")
    // public ResponseEntity<Void> aceptarInvitacionAsesoria(@AuthenticationPrincipal Jwt jwt, @PathVariable Integer solicitudOriginalId) { ... }

    // Aquí también iría el endpoint POST para crear una nueva solicitud de cese,
    // que ya habíamos definido en AsesorSolicitudController. Lo puedes mover aquí
    // o mantenerlo en un controller separado si AsesorController se vuelve muy grande.
    // Por consistencia, si todas las acciones del asesor relacionadas con cese van aquí,
    // tendría sentido mover el POST aquí también.
    // Ejemplo si lo mueves:
    /*
    @Autowired
    private SolicitudAsesorService solicitudAsesorService; // Ya está arriba

    @PostMapping("/solicitudes-cese") // La ruta sería /api/asesor/solicitudes-cese
    public ResponseEntity<?> crearSolicitudDeCese(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CrearSolicitudCeseRequest request
    ) {
        // ... (lógica del POST que ya tienes en AsesorSolicitudController) ...
        // Asegúrate de ajustar las importaciones (CrearSolicitudCeseRequest, @Valid, @RequestBody, etc.)
    }
    */
}