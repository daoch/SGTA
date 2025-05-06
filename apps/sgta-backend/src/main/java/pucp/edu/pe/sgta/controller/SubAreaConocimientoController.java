package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.SubAreaConocimientoDto;
import pucp.edu.pe.sgta.service.inter.SubAreaConocimientoService;

import java.util.List;

@RestController

@RequestMapping("/subAreaConocimiento")
public class SubAreaConocimientoController {

	@Autowired
	SubAreaConocimientoService subAreaConocimientoService;

	@PostMapping("/create")
	public void createSubAreaConocimiento(@RequestBody SubAreaConocimientoDto dto) {
		subAreaConocimientoService.create(dto);
	}

    @GetMapping("/list")
    public List<SubAreaConocimientoDto> listSubAreaConocimiento() {
        return subAreaConocimientoService.getAll();
    }

    @PostMapping("/delete/{id}")
    public void deleteSubAreaConocimiento(@PathVariable Integer id) {
        subAreaConocimientoService.delete(id);
    }
    

}
