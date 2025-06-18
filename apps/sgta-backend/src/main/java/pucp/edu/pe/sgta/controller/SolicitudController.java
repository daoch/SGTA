package pucp.edu.pe.sgta.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties.Jwt;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.server.ResponseStatusException;

import pucp.edu.pe.sgta.dto.SolicitudCeseDto;
import pucp.edu.pe.sgta.dto.asesores.RejectSolicitudRequestDto;
import pucp.edu.pe.sgta.dto.asesores.SolicitudCeseDetalleDto;
import pucp.edu.pe.sgta.dto.temas.SolicitudTemaDto;
import pucp.edu.pe.sgta.service.inter.JwtService;
import pucp.edu.pe.sgta.service.inter.SolicitudService;
import org.springframework.http.HttpStatus;

@RestController

@RequestMapping("/solicitudes")
public class SolicitudController {

    @Autowired
    private SolicitudService solicitudService;
    @Autowired
    private JwtService jwtService;

    @GetMapping("/listSolicitudesByTema/{id}")
    public ResponseEntity<SolicitudTemaDto> getSolicitudesByTema(
            @PathVariable Integer id,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        return ResponseEntity.ok(solicitudService.findAllSolicitudesByTema(id, page, size));
    }

    @PostMapping("/atenderSolicitudTemaInscrito")
    public ResponseEntity<Void> atenderSolicitudTemaInscrito(@RequestBody SolicitudTemaDto solicitudAtendida) {
        try {
            solicitudService.atenderSolicitudTemaInscrito(solicitudAtendida);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/registrarSolicitudCambioAsesor")
    public ResponseEntity<Object> registrarSolicitudCambioAsesor(
            @RequestBody pucp.edu.pe.sgta.dto.asesores.SolicitudCambioAsesorDto solicitud) {

        solicitud = solicitudService.registrarSolicitudCambioAsesor(solicitud);
        return ResponseEntity.ok(solicitud);
    }

    @GetMapping("/listarResumenSolicitudCambioAsesorUsuario")
    public ResponseEntity<Object> listarResumenSolicitudCambioAsesorUsuario(
            @RequestParam(name = "idUsuario") Integer idUsuario,
            @RequestParam(name = "rolSolicitud") String rolSolicitud) {

        return ResponseEntity.ok(solicitudService.listarResumenSolicitudCambioAsesorUsuario(idUsuario, rolSolicitud));
    }

    @GetMapping("/listarDetalleSolicitudCambioAsesorUsuario")
    public ResponseEntity<Object> listarDetalleSolicitudCambioAsesorUsuario(
            @RequestParam(name = "idSolicitud") Integer idSolicitud) {

        return ResponseEntity.ok(solicitudService.listarDetalleSolicitudCambioAsesorUsuario(idSolicitud));
    }

    @GetMapping("/listarResumenSolicitudCambioAsesorCoordinador")
    public ResponseEntity<Object> listarResumenSolicitudCambioAsesorCoordinador(
            HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        return ResponseEntity.ok(solicitudService.listarResumenSolicitudCambioAsesorCoordinador(cognitoId));
    }

    @PatchMapping("/aprobarSolicitudCambioAsesorAsesor")
    public ResponseEntity<Object> aprobarSolicitudCambioAsesorAsesor(
            @RequestParam(name = "idSolicitud") Integer idSolicitud,
            @RequestParam(name = "comentario") String comentario,
            HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        solicitudService.aprobarRechazarSolicitudCambioAsesorAsesor(idSolicitud, cognitoId, comentario, true);
        return ResponseEntity.ok(null);
    }

    @PatchMapping("/rechazarSolicitudCambioAsesorAsesor")
    public ResponseEntity<Object> rechazarSolicitudCambioAsesorAsesor(
            @RequestParam(name = "idSolicitud") Integer idSolicitud,
            @RequestParam(name = "comentario") String comentario,
            HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        solicitudService.aprobarRechazarSolicitudCambioAsesorAsesor(idSolicitud, cognitoId, comentario, false);
        return ResponseEntity.ok(null);
    }

    @PatchMapping("/aprobarSolicitudCambioAsesorCoordinador")
    public ResponseEntity<Object> aprobarSolicitudCambioAsesorCoordinador(
            @RequestParam(name = "idSolicitud") Integer idSolicitud,
            @RequestParam(name = "comentario") String comentario,
            HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        solicitudService.aprobarRechazarSolicitudCambioAsesorCoordinador(idSolicitud, cognitoId, comentario, true);
        return ResponseEntity.ok(null);
    }

    @PatchMapping("/rechazarSolicitudCambioAsesorCoordinador")
    public ResponseEntity<Object> rechazarSolicitudCambioAsesorCoordinador(
            @RequestParam(name = "idSolicitud") Integer idSolicitud,
            @RequestParam(name = "comentario") String comentario,
            HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        solicitudService.aprobarRechazarSolicitudCambioAsesorCoordinador(idSolicitud, cognitoId, comentario, false);
        return ResponseEntity.ok(null);
    }

    // Solicitudes de Cese de Asesoría

    @GetMapping("/coordinador/my-cessation-requests") // Nueva ruta más semántica
    public ResponseEntity<SolicitudCeseDto> getMyCessationRequestsAsCoordinator(
            @AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt, // Spring Security inyecta el JWT del usuario autenticado
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {

        String cognitoSub = jwt.getSubject(); // 'sub' (ID de usuario) de Cognito
        // El servicio ahora usará este 'cognitoSub' para encontrar al usuario y sus solicitudes.
        SolicitudCeseDto result = solicitudService.findAllSolicitudesCeseByCoordinatorCognitoSub(cognitoSub, page, size, status);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{solicitudId}/reject")
    public ResponseEntity<Void> rejectSolicitudCese(
            @AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt,
            @PathVariable Integer solicitudId,
            @RequestBody RejectSolicitudRequestDto payload, // Usar el DTO
            @RequestHeader("Authorization") String authorizationHeader) {
        String cognitoSub = jwt.getSubject(); // 'sub' (ID de usuario) de Cognito
        solicitudService.rejectSolicitudCese(solicitudId, payload.getResponseText(), cognitoSub);

        // Podrías devolver la solicitud actualizada si el frontend la necesita inmediatamente,
        // pero un 200 OK o 204 No Content suele ser suficiente si el frontend hace refetch.
        return ResponseEntity.ok().build();
    }

    @GetMapping("/cessation-requests/{solicitudId}/details")
    public ResponseEntity<SolicitudCeseDetalleDto> getSolicitudCeseDetails(
            @AuthenticationPrincipal org.springframework.security.oauth2.jwt.Jwt jwt,
            @PathVariable Integer solicitudId,
            @RequestHeader("Authorization") String authorizationHeader) {

        String cognitoSub = jwt.getSubject();
        SolicitudCeseDetalleDto detalleDto = solicitudService.findSolicitudCeseDetailsById(solicitudId, cognitoSub);
        return ResponseEntity.ok(detalleDto);
    }
}
