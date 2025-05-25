package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.CriterioEntregableDto;
import pucp.edu.pe.sgta.model.CriterioEntregable;
import pucp.edu.pe.sgta.service.inter.CriterioEntregableService;

import java.util.List;

@RestController
@RequestMapping("/criterio-entregable")

public class CriterioEntregableController {

	@Autowired
	CriterioEntregableService criterioEntregableService;

	@GetMapping("/entregable/{entregableId}")
	public List<CriterioEntregableDto> listarCriteriosEntregableXEntregable(@PathVariable Integer entregableId) {
		return criterioEntregableService.listarCriteriosEntregableXEntregable(entregableId);
	}

	@PostMapping("/entregable/{entregableId}")
	public int crearCriterioEntregable(@PathVariable Integer entregableId,
			@RequestBody CriterioEntregableDto criterioEntregableDto) {
		return criterioEntregableService.crearCriterioEntregable(entregableId, criterioEntregableDto);
	}

	@PutMapping("/update")
	public void update(@RequestBody CriterioEntregableDto criterioEntregableDto) {
		criterioEntregableService.update(criterioEntregableDto);
	}

	@PutMapping("/delete")
	public void delete(@RequestBody Integer criterioEntregableId) {
		criterioEntregableService.delete(criterioEntregableId);
	}

	@GetMapping("/{id}")
	public CriterioEntregable findById(@PathVariable int id) {
		return criterioEntregableService.findById(id);
	}

}
