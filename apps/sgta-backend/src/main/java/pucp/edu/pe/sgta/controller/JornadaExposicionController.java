package pucp.edu.pe.sgta.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pucp.edu.pe.sgta.dto.IniatilizeJornadasExposicionCreateDTO;
import pucp.edu.pe.sgta.service.inter.JornadaExposicionOrchestratorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import pucp.edu.pe.sgta.service.inter.JwtService;

@RestController
@RequestMapping("/jornada-exposicion")
public class JornadaExposicionController {

    @Autowired
    private JornadaExposicionOrchestratorService jornadaExposicionOrchestratorService;

    @Autowired
    JwtService jwtService;

    @PostMapping("/initialize")
    public ResponseEntity<?> initializeJornadasExposicion(@RequestBody IniatilizeJornadasExposicionCreateDTO dto,
                                                          HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        return jornadaExposicionOrchestratorService.initializeJornadasExposicion(dto, cognitoId);
    }
}
