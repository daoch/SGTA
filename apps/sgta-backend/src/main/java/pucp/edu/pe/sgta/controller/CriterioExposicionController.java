package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.CriterioExposicionDto;
import pucp.edu.pe.sgta.service.inter.CriterioExposicionService;

import java.util.List;

@RestController
@RequestMapping("/criterio-exposicion")
public class CriterioExposicionController {

	@Autowired
	private CriterioExposicionService criterioExposicionService;

	@GetMapping("/exposicion/{exposicionId}")
	public List<CriterioExposicionDto> listarCriteriosExposicionXExposicion(@PathVariable Integer exposicionId) {
		return criterioExposicionService.listarCriteriosExposicionXExposicion(exposicionId);
	}

	@PostMapping("exposicion/{exposicionId}")
	public Integer create(@PathVariable Integer exposicionId, @RequestBody CriterioExposicionDto dto) {
		return criterioExposicionService.create(exposicionId, dto);
	}

	@PutMapping("/update")
	public void update(@RequestBody CriterioExposicionDto dto) {
		criterioExposicionService.update(dto);
	}

	@PutMapping("/delete")
	public void delete(@RequestBody Integer criterioExposicionId) {
		criterioExposicionService.delete(criterioExposicionId);
	}

	@GetMapping("/getAll")
	public List<CriterioExposicionDto> getAll() {
		return criterioExposicionService.getAll();
	}

	@GetMapping("/{id}")
	public CriterioExposicionDto findById(@PathVariable Integer id) {
		return criterioExposicionService.findById(id);
	}

}