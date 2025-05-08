package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloDto;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaXCicloService;

@RestController
@RequestMapping("/etapa-formativa-x-ciclo")
public class EtapaFormativaXCicloController {

    @Autowired
    private EtapaFormativaXCicloService etapaFormativaXCicloService;

    @GetMapping("/{id}")
    public ResponseEntity<EtapaFormativaXCicloDto> findById(@PathVariable Integer id) {
        EtapaFormativaXCicloDto etapaFormativaXCiclo = etapaFormativaXCicloService.findById(id);
        return ResponseEntity.ok(etapaFormativaXCiclo);
    }
}