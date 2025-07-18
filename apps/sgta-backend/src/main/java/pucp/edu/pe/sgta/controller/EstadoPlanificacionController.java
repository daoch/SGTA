package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pucp.edu.pe.sgta.dto.EstadoPlanificacionDto;
import pucp.edu.pe.sgta.service.inter.EstadoPlanificacionService;
import java.util.List;

@RestController
@RequestMapping("/estado-planificacion")
public class EstadoPlanificacionController {

    @Autowired
    EstadoPlanificacionService estadoPlanificacionService;

    @GetMapping("/getByIdExposicion/{exposicionId}")
    public EstadoPlanificacionDto getByIdExposicion(@PathVariable("exposicionId") Integer exposicionId) {
        return estadoPlanificacionService.getByIdExposicion(exposicionId);
    }

    @GetMapping("/getAll")
    public List<EstadoPlanificacionDto> getAll() {
        return estadoPlanificacionService.getAll();
    }
}
