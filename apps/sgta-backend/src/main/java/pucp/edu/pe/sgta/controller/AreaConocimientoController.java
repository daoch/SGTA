package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.InfoAreaConocimientoDto;
import pucp.edu.pe.sgta.service.inter.AreaConocimientoService;

import java.util.List;

@RestController

@RequestMapping("/areasConocimiento")
public class AreaConocimientoController {

    @Autowired
    AreaConocimientoService areaConocimientoService;

    @GetMapping("/listarPorNombre")
    public List<InfoAreaConocimientoDto> listarInfoPorNombre(@RequestParam(name = "nombre") String nombre) {
        return areaConocimientoService.listarInfoPorNombre(nombre);
    }
}
