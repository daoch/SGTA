package pucp.edu.pe.sgta.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
            @RequestBody pucp.edu.pe.sgta.dto.asesores.SolicitudCambioAsesorDto solicitud,
            HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        solicitud = solicitudService.registrarSolicitudCambioAsesor(solicitud, cognitoId);
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
            @RequestParam(name = "rol") String rol,
            HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        solicitudService.aprobarRechazarSolicitudCambioAsesorAsesor(idSolicitud, cognitoId, comentario, rol,true);
        return ResponseEntity.ok(null);
    }

    @PatchMapping("/rechazarSolicitudCambioAsesorAsesor")
    public ResponseEntity<Object> rechazarSolicitudCambioAsesorAsesor(
            @RequestParam(name = "idSolicitud") Integer idSolicitud,
            @RequestParam(name = "comentario") String comentario,
            @RequestParam(name = "rol") String rol,
            HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        solicitudService.aprobarRechazarSolicitudCambioAsesorAsesor(idSolicitud, cognitoId, comentario,rol, false);
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

    @PostMapping("/registrarSolicitudCeseAsesoria")
    public ResponseEntity<Object> registrarSolicitudCeseAsesoria(
            @RequestBody pucp.edu.pe.sgta.dto.asesores.SolicitudCeseAsesoriaDto solicitud) {

        solicitud = solicitudService.registrarSolicitudCeseAsesoria(solicitud);
        return ResponseEntity.ok(solicitud);
    }

    @GetMapping("/listarResumenSolicitudCeseAsesoriaUsuario")
    public ResponseEntity<Object> listarResumenSolicitudCeseAsesoriaUsuario(
            @RequestParam(name = "idUsuario") Integer idUsuario,
            @RequestParam(name = "rolSolicitud") String rolSolicitud) {

        return ResponseEntity.ok(solicitudService.listarResumenSolicitudCeseAsesoriaUsuario(idUsuario, rolSolicitud));
    }

    @GetMapping("/listarDetalleSolicitudCeseAsesoriaUsuario")
    public ResponseEntity<Object> listarDetalleSolicitudCeseAsesoriaUsuario(
            @RequestParam(name = "idSolicitud") Integer idSolicitud) {

        return ResponseEntity.ok(solicitudService.listarDetalleSolicitudCeseAsesoriaUsuario(idSolicitud));
    }

    @PatchMapping("/aprobarSolicitudCeseAsesoria")
    public ResponseEntity<Object> aprobarSolicitudCeseAsesoria(
            @RequestParam(name = "idSolicitud") Integer idSolicitud,
            @RequestParam(name = "idUsuario") Integer idUsuario,
            @RequestParam(name = "rolSolicitud") String rolSolicitud) {
        solicitudService.aprobarRechazarSolicitudCeseAsesoria(idSolicitud, idUsuario, rolSolicitud, true);
        return ResponseEntity.ok(null);
    }

    @PatchMapping("/rechazarSolicitudCeseAsesoria")
    public ResponseEntity<Object> rechazarSolicitudCeseAsesoria(
            @RequestParam(name = "idSolicitud") Integer idSolicitud,
            @RequestParam(name = "idUsuario") Integer idUsuario,
            @RequestParam(name = "rolSolicitud") String rolSolicitud) {
        solicitudService.aprobarRechazarSolicitudCeseAsesoria(idSolicitud, idUsuario, rolSolicitud, false);
        return ResponseEntity.ok(null);
    }
}
