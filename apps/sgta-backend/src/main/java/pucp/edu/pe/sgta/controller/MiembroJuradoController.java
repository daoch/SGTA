package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pucp.edu.pe.sgta.dto.MiembroJuradoDto;
import pucp.edu.pe.sgta.service.inter.AutorService;

import java.util.List;

@RestController
@RequestMapping("/jurado")
public class MiembroJuradoController {

    private final AutorService autorService;

    @Autowired
    public MiembroJuradoController(AutorService autorService) {
        this.autorService = autorService;
    }

    @GetMapping
    public List<MiembroJuradoDto> obtenerUsuarioTemaInfo() {
        return autorService.obtenerUsuarioTemaInfo();
    }

    @GetMapping("/estado/{estado}")
    public List<MiembroJuradoDto> obtenerUsuariosPorEstado(@PathVariable Boolean estado) {
        return autorService.obtenerUsuariosPorEstado(estado);
    }

    @GetMapping("/area/{areaConocimientoId}")
    public List<MiembroJuradoDto> obtenerUsuariosPorAreaConocimiento(
            @PathVariable Integer areaConocimientoId) {
        return autorService.obtenerUsuariosPorAreaConocimiento(areaConocimientoId);
    }

}
