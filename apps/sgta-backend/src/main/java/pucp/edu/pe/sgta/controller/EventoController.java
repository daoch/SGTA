package pucp.edu.pe.sgta.controller;
import java.util.List;

import pucp.edu.pe.sgta.dto.EventoDto;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;

import pucp.edu.pe.sgta.service.inter.EventoService;
import jakarta.servlet.http.HttpServletRequest;
import pucp.edu.pe.sgta.service.inter.JwtService;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    @Autowired
    EventoService eventoService;

    @Autowired
    JwtService jwtService;

    @GetMapping("/tesista")
    public ResponseEntity<List<EventoDto>> listarEventosXTesista(HttpServletRequest request) {
        String id = jwtService.extractSubFromRequest(request);
        List<EventoDto> eventos = eventoService.listarEventosXTesista(id);
        return ResponseEntity.ok(eventos);
    }

    @GetMapping("/asesor")
    public ResponseEntity<List<EventoDto>> listarEventosXAsesor(HttpServletRequest request) {
        String id = jwtService.extractSubFromRequest(request);
        List<EventoDto> eventos = eventoService.listarEventosXAsesor(id);
        return ResponseEntity.ok(eventos);
    }

    
}
