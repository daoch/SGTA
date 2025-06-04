package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import pucp.edu.pe.sgta.dto.AprobarSolicitudCambioAsesorRequestDto;
import pucp.edu.pe.sgta.dto.AprobarSolicitudCambioAsesorResponseDto;
import pucp.edu.pe.sgta.dto.AprobarSolicitudRequestDto;
import pucp.edu.pe.sgta.dto.AprobarSolicitudResponseDto;
import pucp.edu.pe.sgta.dto.DetalleSolicitudCeseDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudCambioAsesorRequestDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudCambioAsesorResponseDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudRequestDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudResponseDto;
import pucp.edu.pe.sgta.dto.SolicitudCambioAsesorDto;
import pucp.edu.pe.sgta.dto.SolicitudCeseDto;
import pucp.edu.pe.sgta.dto.asesores.RejectSolicitudRequestDto;
import pucp.edu.pe.sgta.dto.asesores.SolicitudCeseDetalleDto;
import pucp.edu.pe.sgta.dto.temas.SolicitudTemaDto;
import pucp.edu.pe.sgta.service.inter.SolicitudService;

import java.util.List;

@RestController

@RequestMapping("/solicitudes")
public class SolicitudController {
    
    @Autowired
    private SolicitudService solicitudService;

    @GetMapping("/coordinador/my-cessation-requests") // Nueva ruta más semántica
    public ResponseEntity<SolicitudCeseDto> getMyCessationRequestsAsCoordinator(
            @AuthenticationPrincipal Jwt jwt, // Spring Security inyecta el JWT del usuario autenticado
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
            @AuthenticationPrincipal Jwt jwt,
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
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Integer solicitudId,
            @RequestHeader("Authorization") String authorizationHeader) {

        String cognitoSub = jwt.getSubject();
        SolicitudCeseDetalleDto detalleDto = solicitudService.findSolicitudCeseDetailsById(solicitudId, cognitoSub);
        return ResponseEntity.ok(detalleDto);
    }

    @GetMapping("/cessation-requests/{requestId}")
    public ResponseEntity<DetalleSolicitudCeseDto> getDetalleSolicitudesCese(
        @PathVariable Integer requestId) {
        return ResponseEntity.ok(solicitudService.getDetalleSolicitudCese(requestId));
    }

    @GetMapping("/advisor-change-requests")
    public ResponseEntity<SolicitudCambioAsesorDto> getSolicitudesCambioAsesor(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(solicitudService.findAllSolicitudesCambioAsesor(page, size));
    }

    @PostMapping("/advisor-change-requests/{requestId}/reject")
    public ResponseEntity<RechazoSolicitudCambioAsesorResponseDto> rechazarSolicitudCambioAsesor(
        @PathVariable Integer requestId,
        @RequestBody RechazoSolicitudCambioAsesorRequestDto requestDto) {

        RechazoSolicitudCambioAsesorResponseDto response = solicitudService.rechazarSolicitudCambioAsesor(requestId, requestDto.getResponse());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/advisor-change-requests/{requestId}/approve")
    public ResponseEntity<AprobarSolicitudCambioAsesorResponseDto> aprobarSolicitudCambioAsesor(
        @PathVariable Integer requestId,
        @RequestBody AprobarSolicitudCambioAsesorRequestDto requestDto) {

        AprobarSolicitudCambioAsesorResponseDto response = solicitudService.aprobarSolicitudCambioAsesor(requestId, requestDto.getResponse());
        return ResponseEntity.ok(response);
    }

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
}
