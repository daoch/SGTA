package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pucp.edu.pe.sgta.dto.JornadaExposicionXSalaExposicionListadoDTO;
import pucp.edu.pe.sgta.service.inter.JornadaExposicionXSalaExposicionService;

import java.util.List;

@RestController
@RequestMapping("/jornada-exposcion-salas")
public class JornadaExposicionXSalaExposicionController {
    @Autowired
    JornadaExposicionXSalaExposicionService jornadaExposicionXSalaExposicionService;

    @GetMapping("/listar-jornadas-salas/{exposicionId}")
    public List<JornadaExposicionXSalaExposicionListadoDTO> listarJornadasExposicionSalas(
            @PathVariable("exposicionId") Integer exposicionId) {
        return jornadaExposicionXSalaExposicionService.listarJornadasExposicionSalas(exposicionId);
    }
}
