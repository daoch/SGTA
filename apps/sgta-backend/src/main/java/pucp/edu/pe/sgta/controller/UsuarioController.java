package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

}
