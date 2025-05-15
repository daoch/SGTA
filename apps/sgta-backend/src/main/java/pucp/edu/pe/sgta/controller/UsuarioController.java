package pucp.edu.pe.sgta.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sgta.dto.asesores.PerfilAsesorDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.dto.asesores.UsuarioFotoDto;
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

	@GetMapping("findByTipoUsuarioAndCarrera")
    public List<UsuarioDto> getByTipoYCarrera(
            @RequestParam String tipoUsuarioNombre,
            @RequestParam(required = false) Integer carreraId,
			@RequestParam(required = false) String cadenaBusqueda
    ) {
        return usuarioService.findUsuariosByRolAndCarrera(
            tipoUsuarioNombre, carreraId, cadenaBusqueda
        );
    }
	@GetMapping("/findById")
	public UsuarioDto findById(@RequestParam("idUsuario") Integer idUsuario) {

		return this.usuarioService.findUsuarioById(idUsuario);
	}

	@GetMapping("/getPerfilAsesor")
	public PerfilAsesorDto getPerfilAsesor(@RequestParam(name = "id") Integer id) {
		return this.usuarioService.getPerfilAsesor(id);
	}
	@PutMapping("/updatePerfilAsesor")
	public void updatePerfilAsesor(@RequestBody PerfilAsesorDto dto) {
		usuarioService.updatePerfilAsesor(dto);
	}

	@PutMapping("/uploadFoto")
	public void uploadFoto(@RequestParam("idUsuario") Integer idUsuario, @RequestParam("file") MultipartFile file) {
		usuarioService.uploadFoto(idUsuario, file);
	}

	@GetMapping("/getFotoUsuario")
	public UsuarioFotoDto getFotoUsuario(@RequestParam("idUsuario") Integer idUsuario) {
		return usuarioService.getUsuarioFoto(idUsuario);
	}

	@GetMapping("/getIdByCorreo")
	public Integer getIdByCorreo(@RequestParam("correoUsuario") String correo) {
		return usuarioService.getIdByCorreo(correo);
	}
}
