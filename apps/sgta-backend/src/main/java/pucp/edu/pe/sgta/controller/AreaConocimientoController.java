package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.AreaConocimientoDto;
import pucp.edu.pe.sgta.dto.SubAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.service.inter.AreaConocimientoService;
import pucp.edu.pe.sgta.service.inter.TemaService;

import java.util.List;
import java.util.Map;

@RestController

@RequestMapping("/areaConocimiento")
public class AreaConocimientoController {

    @Autowired
    private AreaConocimientoService areaConocimientoService;

    @GetMapping("/listarPorUsuario") // finds a topic by id
    public List<AreaConocimientoDto> listarPorUsuario(@RequestParam(name = "usuarioId") Integer usuarioId) {
        return areaConocimientoService.listarPorUsuario(usuarioId);
    }

}
