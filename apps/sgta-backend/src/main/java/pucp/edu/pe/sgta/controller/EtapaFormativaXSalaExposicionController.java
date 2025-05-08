package pucp.edu.pe.sgta.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pucp.edu.pe.sgta.dto.EtapaFormativaXSalaExposicionConEtapaFormativaDTO;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaXSalaExposicionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController

@RequestMapping("/etapaFormativaXSalaExposicion")
public class EtapaFormativaXSalaExposicionController {
    @Autowired
    EtapaFormativaXSalaExposicionService etapaFormativaXSalaExposicionService;

    @GetMapping("/listarEtapaFormativaXSalaExposicionByEtapaFormativa/{etapaFormativaId}")
    public List<EtapaFormativaXSalaExposicionConEtapaFormativaDTO> listarEtapasFormativasXSalaExposicion(
            @PathVariable Integer etapaFormativaId) {
        return etapaFormativaXSalaExposicionService.listarEtapasFormativasXSalaExposicion(etapaFormativaId);
    }

}
