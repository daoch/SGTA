package pucp.edu.pe.sgta.controller; // Ajustado a tu paquete

// SLF4J Logger (el estándar con Spring Boot)
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import pucp.edu.pe.sgta.dto.asesores.AsesorDisponibleDto; // Asegúrate que la ruta al DTO sea correcta
import pucp.edu.pe.sgta.dto.asesores.ReasignacionPendienteDto;
import pucp.edu.pe.sgta.service.inter.SolicitudService;

import java.util.List;
// import java.util.Map; // Si devuelves un Map en algún momento
// import pe.edu.pucp.sgta.dto.request.AprobarSolicitudRequestDto; // Si mueves otros endpoints aquí
// import pe.edu.pucp.sgta.dto.request.RechazarSolicitudRequestDto;
// import pe.edu.pucp.sgta.dto.request.ProponerNuevoAsesorRequestDto;
// import pe.edu.pucp.sgta.dto.response.SolicitudActualizadaDto;
// import pe.edu.pucp.sgta.exception.BusinessRuleException;
// import pe.edu.pucp.sgta.exception.ResourceNotFoundException;
// import pe.edu.pucp.sgta.service.CoordinadorSolicitudService; // Si tienes otros servicios
// import pe.edu.pucp.sgta.service.TemaService;
// import jakarta.validation.Valid;
// import org.springframework.web.bind.annotation.*; // Si añades POST, PathVariable, etc.


@RestController
@RequestMapping("/coordinador") // Ruta base general para acciones de coordinador
public class SolicitudAsesorController {

    // Usar org.slf4j.Logger
    private static final Logger log = LoggerFactory.getLogger(SolicitudAsesorController.class);

    @Autowired
    private SolicitudService solicitudService;
    // @Autowired
    // private TemaService temaService;


    /**
     * Endpoint para que el coordinador busque asesores disponibles para reasignación.
     * Permite paginación y filtros opcionales.
     */
//     @GetMapping("/asesores-disponibles")
//     public ResponseEntity<Page<AsesorDisponibleDto>> buscarAsesoresDisponibles(
//             @AuthenticationPrincipal Jwt jwt,
//             @RequestParam(required = false) String searchTerm,
//             @RequestParam(required = false) List<Integer> areaConocimientoIds,
//             @PageableDefault(size = 10, sort = "primerApellido", direction = Sort.Direction.ASC) Pageable pageable
//     ) {
//         if (jwt == null) {
//             log.warn("Intento de GET /asesores-disponibles sin autenticación (JWT nulo).");
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         }
//         String coordinadorCognitoSub = jwt.getSubject();
//         if (coordinadorCognitoSub == null || coordinadorCognitoSub.trim().isEmpty()) {
//             log.error("El token JWT para GET /asesores-disponibles no contiene el claim 'sub'.");
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         }

//         // CORRECCIÓN: Asegurar que el log.info() coincida con los tipos de los argumentos
//         // Si areaConocimientoIds es null, su .toString() podría dar problemas o no ser lo que quieres.
//         // Es mejor formatear la lista o pasarla como está si el logger lo maneja bien.
//         // El logger de SLF4J maneja bien los parámetros {}
//         log.info("Coordinador CognitoSub {} buscando asesores disponibles con searchTerm: '{}', areas: {}, page: {}, size: {}",
//                 coordinadorCognitoSub, // Argumento adicional para el primer {}
//                 searchTerm,
//                 areaConocimientoIds, // SLF4J lo manejará como una colección
//                 pageable.getPageNumber(),
//                 pageable.getPageSize());

//         try {
//             Page<AsesorDisponibleDto> asesores = solicitudService.buscarAsesoresDisponibles(
//                     coordinadorCognitoSub,
//                     searchTerm,
//                     areaConocimientoIds,
//                     pageable
//             );
//             return ResponseEntity.ok(asesores);
//         } catch (Exception e) {
//             // CORRECCIÓN: Usar e.getMessage() y el objeto 'e' para el stacktrace
//             log.error("Error al buscar asesores disponibles para coordinador {}: {}", coordinadorCognitoSub, e.getMessage(), e);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                     .body(Page.empty());
//         }
//     }

//     @GetMapping("/solicitudes-cese/reasignaciones-pendientes")
//     public ResponseEntity<Page<ReasignacionPendienteDto>> getReasignacionesPendientes(
//             @AuthenticationPrincipal Jwt jwt,
//             @RequestParam(required = false) String searchTerm, // Filtro opcional por título de tema, nombre de asesor original, etc.
//             @PageableDefault(size = 10, sort = "fechaResolucion", direction = Sort.Direction.DESC) Pageable pageable
//             // El sort podría ser por fecha_modificacion de la solicitud original si esa refleja mejor la "última acción"
//     ) {
//         if (jwt == null) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); }
//         String coordinadorCognitoSub = jwt.getSubject();
//         if (coordinadorCognitoSub == null || coordinadorCognitoSub.trim().isEmpty()) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); }

//         log.info("Coordinador CognitoSub {} solicitando lista de reasignaciones pendientes. Page: {}, Size: {}, Search: '{}'",
//                 coordinadorCognitoSub, pageable.getPageNumber(), pageable.getPageSize(), searchTerm);

//         try {
//             Page<ReasignacionPendienteDto> reasignaciones = solicitudService.findReasignacionesPendientes(
//                     coordinadorCognitoSub,
//                     searchTerm,
//                     pageable
//             );
//             return ResponseEntity.ok(reasignaciones);
//         } catch (Exception e) {
//             log.error("Error al obtener reasignaciones pendientes para coordinador {}: {}", coordinadorCognitoSub, e.getMessage(), e);
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Page.empty(pageable));
//         }
//     }

    // --- Aquí irían los otros endpoints que ya tenías para aprobar, rechazar, proponer ---
    // Ejemplo (si decides moverlos aquí):
    /*
    @PostMapping("/solicitudes-cese/{solicitudId}/aprobar")
    public ResponseEntity<?> aprobarSolicitudCese(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Integer solicitudId,
            @Valid @RequestBody AprobarSolicitudRequestDto requestDto
    ) { ... }

    @PostMapping("/solicitudes-cese/{solicitudId}/rechazar")
    public ResponseEntity<?> rechazarSolicitudCese(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Integer solicitudId,
            @Valid @RequestBody RechazarSolicitudRequestDto requestDto
    ) { ... }

    @PostMapping("/solicitudes-cese/{solicitudDeCeseId}/proponer-reasignacion")
    public ResponseEntity<?> proponerReasignacionAsesor(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Integer solicitudDeCeseId,
            @Valid @RequestBody ProponerNuevoAsesorRequestDto requestDto
    ) { ... }
    */
}