package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.CriterioEntregableDto;
import pucp.edu.pe.sgta.model.CriterioEntregable;
import pucp.edu.pe.sgta.service.inter.CriterioEntregableService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/criterio-entregable")

public class CriterioEntregableController {

    @Autowired
    CriterioEntregableService criterioEntregableService;

    @GetMapping("/entregable/{entregableId}")
    public List<CriterioEntregableDto> listarCriteriosEntregableXEntregable(@PathVariable Integer entregableId) {
        return criterioEntregableService.listarCriteriosEntregableXEntregable(entregableId);
    }

    @PostMapping("/entregable/{entregableId}")
    public int crearCriterioEntregable(@PathVariable Integer entregableId, @RequestBody CriterioEntregableDto criterioEntregableDto) {
        return criterioEntregableService.crearCriterioEntregable(entregableId, criterioEntregableDto);
    }

    @PutMapping("/update")
    public void update(@RequestBody CriterioEntregableDto criterioEntregableDto) {
        criterioEntregableService.update(criterioEntregableDto);
    }

    @PutMapping("/delete")
    public void delete(@RequestBody Integer criterioEntregableId) {
        criterioEntregableService.delete(criterioEntregableId);
    }

    @GetMapping("/{id}")
    public Optional<CriterioEntregable> findById(@PathVariable int id) {
        return criterioEntregableService.findById(id);
    }

    @GetMapping("/revision/{revision_entregable_id}")
    public List<CriterioEntregableDto> listarCriterioEntregableByRevisionEntregableId(@PathVariable int revision_entregable_id) {
        return criterioEntregableService.listar_criterio_entregable_x_revisionID(revision_entregable_id);
    }

}
