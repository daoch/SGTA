package pucp.edu.pe.sgta.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.model.CriterioEntregablePreset;
import pucp.edu.pe.sgta.service.inter.CriterioEntregablePresetService;

import java.util.List;

@RestController
@RequestMapping("/criterio-entregable-preset")
public class CriterioEntregablePresetController {

    @Autowired
    CriterioEntregablePresetService criterioEntregablePresetService;

    @GetMapping("/getAll")
    public List<CriterioEntregablePreset> getAll() {
        return criterioEntregablePresetService.getAllActivo();
    }

    @PostMapping("/create")
    public int create(@RequestBody CriterioEntregablePreset criterioEntregablePreset) {
        return criterioEntregablePresetService.create(criterioEntregablePreset);
    }

    @PutMapping("/delete")
    public void delete(@RequestBody Integer criterioEntregablePresetId) {
        criterioEntregablePresetService.delete(criterioEntregablePresetId);
    }
}
