package pucp.edu.pe.sgta.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import pucp.edu.pe.sgta.dto.RelacionZoomMeetingSalasDTO;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.model.ZoomAccessTokenResponse;
import pucp.edu.pe.sgta.model.ZoomMeetingResponse;
import pucp.edu.pe.sgta.service.inter.JwtService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;
import pucp.edu.pe.sgta.service.inter.ZoomService;

@RestController
@RequestMapping("/zoom")
public class ZoomController {
    @Autowired
    private ZoomService zoomService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioService usuarioService;

    // API PARA CREAR MASIVAMENTE SALAS DE ZOOM PARA UNA JORNADA EXPOSICION
    @GetMapping("/crear-meetings-jornada-exposicion/{exposicionId}")
    public ResponseEntity<?> crearMeetingsPorJornadaExposicion(
            @PathVariable Integer exposicionId,
            HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        UsuarioDto coordinador = this.usuarioService.findByCognitoId(cognitoId);

        if (coordinador == null) {
            return ResponseEntity.badRequest().body("Coordinador no encontrado");
        }

        System.out.println("Creando meetings para la jornada de exposicion con ID: " + exposicionId);

        List<RelacionZoomMeetingSalasDTO> zoomMeetingResponses = zoomService.crearMeetingsPorJornadaExposicion(
                exposicionId,
                coordinador);

        return ResponseEntity.ok(zoomMeetingResponses);
    }

    // API PARA CREAR UNA REUNIÓN DE ZOOM
    // @PostMapping("/crear-meeting")
    // public ZoomMeetingResponse createMeeting(@RequestBody ZoomMeetingRequest
    // zoomMeetingRequest) {
    // return zoomService.createMeeting(zoomMeetingRequest);
    // }

    // API PARA GENERAR EL TOKEN DE ACCESO
    // @PostMapping("/generar-token-acceso")
    // public ZoomAccessTokenResponse generateAccessToken() {
    // return zoomService.generateAccessToken();
    // }
}
