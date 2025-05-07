package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.InfoSubAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.InfoTemaPerfilDto;
import pucp.edu.pe.sgta.service.inter.SubAreaConocimientoService;

import java.util.List;

@RestController
@RequestMapping("/subAreasConocimiento")
public class SubAreaConocimientoController {
    @Autowired
    SubAreaConocimientoService subAreaConocimientoService;

    @GetMapping("/listarPorNombre")
    public List<InfoSubAreaConocimientoDto> listarInfoPorNombre(@RequestParam(name = "nombre") String nombre) {
        return subAreaConocimientoService.listarInfoPorNombre(nombre);
    }
}
