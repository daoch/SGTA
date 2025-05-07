package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.PerfilAsesorDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.service.inter.UsuarioService;

@RestController

@RequestMapping("/usuario")
public class UsuarioController {

	@Autowired
	private UsuarioService usuarioService;

	@PostMapping("/create")
	public void create(@RequestBody UsuarioDto dto) {
		this.usuarioService.createUsuario(dto);
	}

	@GetMapping("/getPerfilAsesor")
	public PerfilAsesorDto getPerfilAsesor(@RequestParam(name = "id") Integer id) {
		return this.usuarioService.getPerfilAsesor(id);
	}
	@PutMapping("/updatePerfilAsesor")
	public void updatePerfilAsesor(@RequestBody PerfilAsesorDto dto) {
		usuarioService.updatePerfilAsesor(dto);
	}

}
