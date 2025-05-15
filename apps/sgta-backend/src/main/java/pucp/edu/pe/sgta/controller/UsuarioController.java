package pucp.edu.pe.sgta.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.asesores.PerfilAsesorDto;
import pucp.edu.pe.sgta.dto.CarreraDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.service.inter.CarreraService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;

@RestController

@RequestMapping("/usuario")
public class UsuarioController {

	@Autowired
	private UsuarioService usuarioService;
	@Autowired
	private CarreraService carreraService;

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

	@GetMapping("/{id}/carreras")
    public ResponseEntity<List<CarreraDto>> listarCarreras(
            @PathVariable("id") Integer usuarioId) {

        List<CarreraDto> carreras = carreraService.listarCarrerasPorUsuario(usuarioId);

        if (carreras.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(carreras);
    }
	@GetMapping("/getAsesoresBySubArea")
	public List<UsuarioDto> getAsesoresBySubArea(@RequestParam(name = "idSubArea") Integer idSubArea) {
		return this.usuarioService.getAsesoresBySubArea(idSubArea);
	}

	@GetMapping("/findByCodigo")
	public UsuarioDto findByCodigo(@RequestParam("codigo") String codigo) {
		return this.usuarioService.findUsuarioByCodigo(codigo);
	}

}
