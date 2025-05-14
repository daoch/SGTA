package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pucp.edu.pe.sgta.dto.AprobarSolicitudRequestDto;
import pucp.edu.pe.sgta.dto.AprobarSolicitudResponseDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudRequestDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudResponseDto;
import pucp.edu.pe.sgta.dto.SolicitudCeseDto;
import pucp.edu.pe.sgta.service.inter.SolicitudService;

@RestController

@RequestMapping("/coordinators")
public class SolicitudController {
    
    @Autowired
    private SolicitudService solicitudService;

    @GetMapping("/cessation-requests")
    public ResponseEntity<SolicitudCeseDto> getSolicitudesCese(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(solicitudService.findAllSolicitudesCese(page, size));
    }

    @PostMapping("/cessation-requests/{requestId}/reject")
    public ResponseEntity<RechazoSolicitudResponseDto> rechazarSolicitud(
        @PathVariable Integer requestId,
        @RequestBody RechazoSolicitudRequestDto requestDto) {

        RechazoSolicitudResponseDto response = solicitudService.rechazarSolicitud(requestId, requestDto.getResponse());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/cessation-requests/{requestId}/approve")
    public ResponseEntity<AprobarSolicitudResponseDto> aprobarSolicitud(
        @PathVariable Integer requestId,
        @RequestBody AprobarSolicitudRequestDto requestDto) {

        AprobarSolicitudResponseDto response = solicitudService.aprobarSolicitud(requestId, requestDto.getResponse());
        return ResponseEntity.ok(response);
    }
}
