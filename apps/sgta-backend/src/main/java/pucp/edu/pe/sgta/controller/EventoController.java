package pucp.edu.pe.sgta.controller;
import java.util.List;

import pucp.edu.pe.sgta.dto.EventoDto;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

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
    @GetMapping("/usuario")
    public ResponseEntity<List<EventoDto>> listarEventosXUsuario(HttpServletRequest request) {
        String id = jwtService.extractSubFromRequest(request);
        List<EventoDto> eventos = eventoService.listarEventosXUsuario(id);
        return ResponseEntity.ok(eventos);
    }
}
