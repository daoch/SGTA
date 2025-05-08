package pucp.edu.pe.sgta.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.ExposicionDto;
import pucp.edu.pe.sgta.dto.ExposicionNombreDTO;
import pucp.edu.pe.sgta.service.inter.ExposicionService;

import java.util.List;

@RestController
@RequestMapping("/exposicion")
public class ExposicionController {
    @Autowired
    ExposicionService exposicionService;

    @GetMapping("/etapa-formativa-x-ciclo/{etapaFormativaXCicloId}")
    public List<ExposicionDto> listarExposicionesXEtapaFormativaXCiclo(@PathVariable Integer etapaFormativaXCicloId) {
        return exposicionService.listarExposicionesXEtapaFormativaXCiclo(etapaFormativaXCicloId);
    }

    @PostMapping("/etapa-formativa-x-ciclo/{etapaFormativaXCicloId}")
    public Integer create(@PathVariable Integer etapaFormativaXCicloId, @RequestBody ExposicionDto exposicionDto) {
        return exposicionService.create(etapaFormativaXCicloId, exposicionDto);
    }

    @PutMapping("/update")
    public void update(@RequestBody ExposicionDto exposicionDto) {
        exposicionService.update(exposicionDto);
    }

    @PutMapping("/delete")
    public void delete(@RequestBody Integer exposicionId) {
        exposicionService.delete(exposicionId);
    }

    @GetMapping("/getAll") // Obtiene la lista de entregables
    public List<ExposicionDto> getAll() {
        return exposicionService.getAll();
    }

    @GetMapping("/{id}")
    public ExposicionDto findById(@PathVariable Integer id) {
        return exposicionService.findById(id);
    }


     @GetMapping("/listarExposicionXCicloActualEtapaFormativa")
    public List<ExposicionNombreDTO> listarExposicionXCicloActualEtapaFormativa(@RequestParam("etapaFormativaId") Integer etapaFormativaId){
    return exposicionService.listarExposicionXCicloActualEtapaFormativa(etapaFormativaId);
    }
}
