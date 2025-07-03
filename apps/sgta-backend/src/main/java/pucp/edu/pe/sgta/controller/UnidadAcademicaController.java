package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.UnidadAcademicaDto;
import pucp.edu.pe.sgta.service.inter.UnidadAcademicaService;

import java.util.List;

@RestController
@RequestMapping("/unidad-academica")
public class UnidadAcademicaController {

    @Autowired
    private UnidadAcademicaService unidadAcademicaService;



    @GetMapping("/listar")
    public List<UnidadAcademicaDto> listUnidadesAcademicas() {
        return unidadAcademicaService.getAll();
    }
}