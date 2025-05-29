package pucp.edu.pe.sgta.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.model.CriterioExposicionPreset;
import pucp.edu.pe.sgta.service.inter.CriterioExposicionPresetService;

import java.util.List;

@RestController
@RequestMapping("/criterio-exposicion-preset")
public class CriterioExposicionPresetController {

    @Autowired
    CriterioExposicionPresetService criterioExposicionPresetService;

    @GetMapping("/getAll")
    public List<CriterioExposicionPreset> getAll() {
        return criterioExposicionPresetService.getAllActivo();
    }

    @PostMapping("/create")
    public int create(@RequestBody CriterioExposicionPreset criterioExposicionPreset) {
        return criterioExposicionPresetService.create(criterioExposicionPreset);
    }

    @PutMapping("/delete")
    public void delete(@RequestBody Integer criterioExposicionPresetId) {
        criterioExposicionPresetService.delete(criterioExposicionPresetId);
    }
}
