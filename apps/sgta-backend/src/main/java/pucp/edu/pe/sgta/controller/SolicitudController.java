package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pucp.edu.pe.sgta.dto.temas.SolicitudTemaDto;
import pucp.edu.pe.sgta.service.inter.SolicitudService;

@RestController

@RequestMapping("/solicitudes")
public class SolicitudController {

    @Autowired
    private SolicitudService solicitudService;

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

    @PatchMapping("/aprobarSolicitudCambioAsesor")
    public ResponseEntity<Object> aprobarSolicitudCambioAsesor(
            @RequestParam(name = "idSolicitud") Integer idSolicitud,
            @RequestParam(name = "idUsuario") Integer idUsuario,
            @RequestParam(name = "rolSolicitud") String rolSolictud) {
        solicitudService.aprobarRechazarSolicitudCambioAsesor(idSolicitud, idUsuario, rolSolictud, true);
        return ResponseEntity.ok(null);
    }

    @PatchMapping("/rechazarSolicitudCambioAsesor")
    public ResponseEntity<Object> rechazarSolicitudCambioAsesor(
            @RequestParam(name = "idSolicitud") Integer idSolicitud,
            @RequestParam(name = "idUsuario") Integer idUsuario,
            @RequestParam(name = "rolSolicitud") String rolSolictud) {
        solicitudService.aprobarRechazarSolicitudCambioAsesor(idSolicitud, idUsuario, rolSolictud, false);
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
