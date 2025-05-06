package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.AreaConocimientoDto;
import pucp.edu.pe.sgta.service.inter.AreaConocimientoService;

import java.util.List;

@RestController

@RequestMapping("/areaConocimiento")
public class AreaConocimientoController {

	@Autowired
	AreaConocimientoService areaConocimientoService;

	@PostMapping("/create")
	public AreaConocimientoDto createAreaConocimiento(@RequestBody AreaConocimientoDto dto) {
        return areaConocimientoService.create(dto);
    }

    @GetMapping("/list")
    public List<AreaConocimientoDto> listAreaConocimiento() {
        return areaConocimientoService.getAll();
    }

    @PostMapping("/delete/{id}")
    public void deleteAreaConocimiento(@PathVariable Integer id) {
        areaConocimientoService.delete(id);
    }

    //list areas por carrera
    @GetMapping("/list/{idCarrera}")
    public List<AreaConocimientoDto> listAreaConocimientoByCarrera(@PathVariable Integer idCarrera) {
        return areaConocimientoService.getAllByCarrera(idCarrera);
    }
}
