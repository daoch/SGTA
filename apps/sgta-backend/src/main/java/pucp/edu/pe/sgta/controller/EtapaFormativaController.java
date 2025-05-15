package pucp.edu.pe.sgta.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import pucp.edu.pe.sgta.dto.EtapaFormativaNombreDTO;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import pucp.edu.pe.sgta.dto.EtapaFormativaDto;

import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/etapas-formativas")
public class EtapaFormativaController {
    @Autowired
    EtapaFormativaService etapaFormativaService;

    @GetMapping("/coordinador/{id}")
    public List<EtapaFormativaNombreDTO> obtenerPorUsuario(@PathVariable("id") Integer usuarioId) {
        return etapaFormativaService.findByCoordinadorId(usuarioId);
    }

    @PostMapping("/update")
    public ResponseEntity<String> actualizarEtapaFormativa(@RequestBody EtapaFormativaDto dto) {
        etapaFormativaService.actualizarEtapa(dto);
        return ResponseEntity.ok("Etapa formativa actualizada exitosamente");
    }

}
