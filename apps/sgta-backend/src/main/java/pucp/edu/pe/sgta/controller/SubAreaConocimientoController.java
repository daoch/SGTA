package pucp.edu.pe.sgta.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.SubAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.model.SubAreaConocimiento;
import pucp.edu.pe.sgta.service.inter.SubAreaConocimientoService;
import pucp.edu.pe.sgta.service.inter.TemaService;

import java.util.List;
import java.util.Map;

@RestController

@RequestMapping("/subAreaConocimiento")
public class SubAreaConocimientoController {

    @Autowired
    private SubAreaConocimientoService subAreaConocimientoService;

    @GetMapping("/findById") // finds a topic by id
    public SubAreaConocimientoDto findById(@RequestParam(name = "idSubArea") Integer idSubArea) {
        return subAreaConocimientoService.findById(idSubArea);
    }
}
