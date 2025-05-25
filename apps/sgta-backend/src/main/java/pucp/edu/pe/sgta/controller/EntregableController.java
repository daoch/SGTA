package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.EntregableDto;
import pucp.edu.pe.sgta.service.inter.EntregableService;

import java.util.List;

@RestController
@RequestMapping("/entregable")

public class EntregableController {

	@Autowired
	EntregableService entregableService;

	@GetMapping("/etapa-formativa-x-ciclo/{etapaFormativaXCicloId}")
	public List<EntregableDto> listarEntregablesXEtapaFormativaXCiclo(@PathVariable Integer etapaFormativaXCicloId) {
		return entregableService.listarEntregablesXEtapaFormativaXCiclo(etapaFormativaXCicloId);
	}

	@PostMapping("/etapa-formativa-x-ciclo/{etapaFormativaXCicloId}")
	public Integer create(@PathVariable Integer etapaFormativaXCicloId, @RequestBody EntregableDto entregableDto) {
		return entregableService.create(etapaFormativaXCicloId, entregableDto);
	}

	@PutMapping("/update")
	public void update(@RequestBody EntregableDto entregableDto) {
		entregableService.update(entregableDto);
	}

	@PutMapping("/delete")
	public void delete(@RequestBody Integer entregableId) {
		entregableService.delete(entregableId);
	}

	@GetMapping("/getAll") // Obtiene la lista de entregables
	public List<EntregableDto> getAll() {
		return entregableService.getAll();
	}

	@GetMapping("/{id}")
	public EntregableDto findById(@PathVariable Integer id) {
		return entregableService.findById(id);
	}

}
