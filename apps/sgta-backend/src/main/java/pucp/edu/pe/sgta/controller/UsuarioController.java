package pucp.edu.pe.sgta.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sgta.dto.PerfilAsesorDto;
import pucp.edu.pe.sgta.dto.UserInfoDTO;
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

	@GetMapping("/session")
	public ResponseEntity<UserInfoDTO> obtenerInfoUsuarioSesion(@RequestParam String correo) {
		return usuarioService.obtenerInfoPorCorreo(correo)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping("/carga-masiva")
	public ResponseEntity<String> cargarUsuarios(@RequestParam("archivo") MultipartFile archivo) {
		try {
			usuarioService.procesarArchivoUsuarios(archivo);
			return ResponseEntity.ok("Usuarios procesados exitosamente");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error al procesar el archivo: " + e.getMessage());
		}
	}

}
