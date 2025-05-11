package pucp.edu.pe.sgta.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pucp.edu.pe.sgta.dto.ListBloqueHorarioExposicionSimpleDTO;
import pucp.edu.pe.sgta.service.inter.BloqueHorarioExposicionService;

@RestController
@RequestMapping("/bloqueHorarioExposicion")
public class BloqueHorarioExposicionController {
    @Autowired
    private BloqueHorarioExposicionService bloqueHorarioExposicionService;

    @GetMapping("/listarBloquesHorarioExposicionByExposicion/{exposicionId}")
    public List<ListBloqueHorarioExposicionSimpleDTO> listarBloquesHorarioExposicionByExposicion(@PathVariable("exposicionId") Integer exposicionId) {
        return bloqueHorarioExposicionService.listarBloquesHorarioPorExposicion(exposicionId);
    }
}
