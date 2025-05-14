package pucp.edu.pe.sgta.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pucp.edu.pe.sgta.dto.EtapaFormativaDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaNombreDTO;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaService;

@RestController
@RequestMapping("/etapas-formativas")
public class EtapaFormativaController {
    @Autowired
    EtapaFormativaService etapaFormativaService;

    @GetMapping("/listarPorInicializarByCoordinador/{corodinador_id}")
    public List<EtapaFormativaNombreDTO> obtenerPorInicializarPorCoordinador(
            @PathVariable("corodinador_id") Integer usuarioId) {
        return etapaFormativaService.findToInitializeByCoordinador(usuarioId);
    }

    // @GetMapping("/listarActivasNombre")
    // public List<EtapaFormativaNombreDTO> obtenerEtapasFormativasActivasNombre() {
    // return etapaFormativaService.findAllActivasNombre();
    // }

    @GetMapping("/listarActivas")
    public List<EtapaFormativaDto> obtenerEtapasFormativasActivas() {
        return etapaFormativaService.findAllActivas();
    }

    @GetMapping("/listarActivasPorCoordinador/{coordinador_id}")
    public List<EtapaFormativaDto> obtenerEtapasFormativasActivasPorCoordinador(
            @PathVariable("coordinador_id") Integer coordinadorId) {
        return etapaFormativaService.findAllActivasByCoordinador(coordinadorId);
    }
}
