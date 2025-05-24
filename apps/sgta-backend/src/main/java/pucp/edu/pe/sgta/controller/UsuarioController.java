package pucp.edu.pe.sgta.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pucp.edu.pe.sgta.dto.asesores.PerfilAsesorDto;
import pucp.edu.pe.sgta.dto.asesores.UsuarioConRolDto;
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

	/**
     * HU01: Asignar Rol de Asesor a Profesor
     * 
     * @param userId ID del profesor
     * @return ResponseEntity con mensaje de éxito o error
     */
    @PostMapping("/{userId}/assign-advisor-role")
    public ResponseEntity<?> assignAdvisorRole(@PathVariable Integer userId) {
        try {
            usuarioService.assignAdvisorRoleToUser(userId);
            return new ResponseEntity<>("Rol de Asesor asignado exitosamente", HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al asignar el rol de Asesor: " + e.getMessage(), 
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * HU02: Quitar Rol de Asesor a Profesor (Usuario)
     * 
     * @param userId ID del profesor
     * @return ResponseEntity con mensaje de éxito o error
     */
    @PostMapping("/{userId}/remove-advisor-role")
    public ResponseEntity<?> removeAdvisorRole(@PathVariable Integer userId) {
        try {
            usuarioService.removeAdvisorRoleFromUser(userId);
            return new ResponseEntity<>("Rol de Asesor removido exitosamente", HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al remover el rol de Asesor: " + e.getMessage(), 
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * HU03: Asignar Rol de Jurado a Profesor (Usuario)
     * 
     * @param userId ID del profesor
     * @return ResponseEntity con mensaje de éxito o error
     */
    @PostMapping("/{userId}/assign-jury-role")
    public ResponseEntity<?> assignJuryRole(@PathVariable Integer userId) {
        try {
            usuarioService.assignJuryRoleToUser(userId);
            return new ResponseEntity<>("Rol de Jurado asignado exitosamente", HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al asignar el rol de Jurado: " + e.getMessage(), 
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * HU04: Quitar Rol de Jurado a Profesor (Usuario)
     * 
     * @param userId ID del profesor
     * @return ResponseEntity con mensaje de éxito o error
     */
    @PostMapping("/{userId}/remove-jury-role")
    public ResponseEntity<?> removeJuryRole(@PathVariable Integer userId) {
        try {
            usuarioService.removeJuryRoleFromUser(userId);
            return new ResponseEntity<>("Rol de Jurado removido exitosamente", HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al remover el rol de Jurado: " + e.getMessage(), 
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * HU05: Listar Profesores (Usuarios) con Estado de Roles
     * 
     * @param rolNombre Rol por el que filtrar (opcional, "Todos" por defecto)
     * @param terminoBusqueda Término para buscar por nombre, correo o código (opcional)
     * @return Lista de usuarios con sus roles
     */
    @GetMapping("/professors-with-roles")
    public ResponseEntity<List<UsuarioConRolDto>> getProfessorsWithRoles(
            @RequestParam(required = false, defaultValue = "Todos") String rolNombre,
            @RequestParam(required = false) String terminoBusqueda) {

        try {
            List<UsuarioConRolDto> usuarios = usuarioService.getProfessorsWithRoles(rolNombre, terminoBusqueda);
            return new ResponseEntity<>(usuarios, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
