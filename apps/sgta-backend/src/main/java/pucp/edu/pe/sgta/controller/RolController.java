
package pucp.edu.pe.sgta.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.QueryRolResponse;
import pucp.edu.pe.sgta.dto.RolDto;
import pucp.edu.pe.sgta.service.inter.RolService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rol")
public class RolController {

	private final RolService rolService;

	public RolController(RolService rolService) {
		this.rolService = rolService;
	}

	/**
	 * Obtiene todos los roles sin paginación
	 */
	@GetMapping("/all")
	public List<RolDto> getAllRoles() {
		return rolService.findAllRoles();
	}

	/**
	 * Obtiene roles con paginación y opcionalmente filtrados por nombre
	 */
	@GetMapping("/paginated")
	public ResponseEntity<QueryRolResponse> getRolesPaginated(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size, @RequestParam(required = false) String nombre) {

		QueryRolResponse response = rolService.findRolesPaginated(page, size, nombre);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	/**
	 * Obtiene un rol por su ID
	 */
	@GetMapping("/{id}")
	public ResponseEntity<RolDto> getRolById(@PathVariable Integer id) {
		Optional<RolDto> rol = rolService.findRolById(id);

		return rol.map(rolDto -> new ResponseEntity<>(rolDto, HttpStatus.OK))
			.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	/**
	 * Obtiene un rol por su nombre
	 */
	@GetMapping("/nombre/{nombre}")
	public ResponseEntity<RolDto> getRolByNombre(@PathVariable String nombre) {
		Optional<RolDto> rol = rolService.findRolByNombre(nombre);

		return rol.map(rolDto -> new ResponseEntity<>(rolDto, HttpStatus.OK))
			.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}