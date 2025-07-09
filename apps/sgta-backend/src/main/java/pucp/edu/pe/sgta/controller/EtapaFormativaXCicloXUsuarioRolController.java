package pucp.edu.pe.sgta.controller;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.UsuarioRolRevisorDto;
import pucp.edu.pe.sgta.model.UsuarioXCarrera;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaXCicloXUsuarioRolService;
import pucp.edu.pe.sgta.service.inter.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import pucp.edu.pe.sgta.service.inter.UsuarioXCarreraService;

import java.util.List;

@RestController
@RequestMapping("/etapaFormativaXCicloXUsuarioRol")
public class EtapaFormativaXCicloXUsuarioRolController {

    @Autowired
    EtapaFormativaXCicloXUsuarioRolService etapaFormativaXCicloXUsuarioRolService;

    @Autowired
    JwtService jwtService;

    @Autowired
    UsuarioXCarreraService usuarioXCarreraService;

    @PostMapping("/asignarRevisor/curso/{cursoId}/revisor/{revisorId}")
    public ResponseEntity<String> asignarRevisor(@PathVariable Integer cursoId, @PathVariable Integer revisorId,
                                                 HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        try {
            etapaFormativaXCicloXUsuarioRolService.asignarRevisor(cursoId, revisorId, cognitoId);
            return ResponseEntity.ok("Revisor asignado correctamente.");
        } catch (Exception e) {
            if (e.getMessage().contains("Ya existe un revisor")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor.");
        }
    }

    @GetMapping("/revisores")
    public List<UsuarioRolRevisorDto> listarRevisoresXCarreraCicloActivo(HttpServletRequest request) {
        String coordinadorId = jwtService.extractSubFromRequest(request);
        UsuarioXCarrera usuarioXCarrera = usuarioXCarreraService.getCarreraPrincipalCoordinador(coordinadorId);
        return etapaFormativaXCicloXUsuarioRolService.listarRevisoresXCarreraCicloActivo(usuarioXCarrera.getCarrera().getId());
    }

}
