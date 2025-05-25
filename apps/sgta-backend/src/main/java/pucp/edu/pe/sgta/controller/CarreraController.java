package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.CarreraDto;
import pucp.edu.pe.sgta.service.inter.CarreraService;

import java.util.List;

@RestController
@RequestMapping("/carrera")
public class CarreraController {

	@Autowired
	private CarreraService carreraService;

	@GetMapping("/listar")
	public List<CarreraDto> listCarreras() {
		return carreraService.getAll();
	}

	@GetMapping("/list-active")
	public List<CarreraDto> listActiveCarreras() {
		return carreraService.getAllActive();
	}

	@GetMapping("/list-by-usuario")
	public List<CarreraDto> listCarrerasByUsuario(@RequestParam(name = "usuarioId") Integer usuarioId) {
		return carreraService.getCarrerasByUsuario(usuarioId);
	}

	@GetMapping("/get/{id}")
	public CarreraDto getCarreraById(@PathVariable Integer id) {
		return carreraService.findById(id);
	}

}