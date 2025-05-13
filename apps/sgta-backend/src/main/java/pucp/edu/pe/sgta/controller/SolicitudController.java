package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
}
