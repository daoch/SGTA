package pucp.edu.pe.sgta.controller;

import java.util.List;
import java.util.NoSuchElementException;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.web.server.ResponseStatusException;
import pucp.edu.pe.sgta.dto.asesores.FiltrosDirectorioAsesores;
import pucp.edu.pe.sgta.dto.asesores.PerfilAsesorDto;
import pucp.edu.pe.sgta.dto.asesores.UsuarioConRolDto;
import pucp.edu.pe.sgta.dto.asesores.UsuarioFotoDto;
import pucp.edu.pe.sgta.dto.CarreraDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.service.inter.CarreraService;
import pucp.edu.pe.sgta.service.inter.JwtService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;
import pucp.edu.pe.sgta.dto.AlumnoTemaDto;

@RestController

@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private CarreraService carreraService;

    @Autowired
    JwtService jwtService;

	@Autowired
	private UsuarioService usuarioService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody UsuarioDto user) {

        try {
            usuarioService.createUsuario(user);
            return ResponseEntity.ok("Usuario procesado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar el usuario: " + e.getMessage());
        }

    }

    @GetMapping("/findByTipoUsuarioAndCarrera")
    public List<UsuarioDto> getByTipoYCarrera(
            @RequestParam String tipoUsuarioNombre,
            @RequestParam(required = false) Integer carreraId,
            @RequestParam(required = false) String cadenaBusqueda) {
        return usuarioService.findUsuariosByRolAndCarrera(
                tipoUsuarioNombre, carreraId, cadenaBusqueda);
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
     * @param rolNombre       Rol por el que filtrar (opcional, "Todos" por defecto)
     * @param terminoBusqueda Término para buscar por nombre, correo o código
     *                        (opcional)
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

    @GetMapping("/{id}/carreras")
    public ResponseEntity<List<CarreraDto>> listarCarreras(
            @PathVariable("id") Integer usuarioId) {

        List<CarreraDto> carreras = carreraService.listarCarrerasPorUsuario(usuarioId);

        if (carreras.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(carreras);
    }

    @GetMapping("/findByCodigo")
    public UsuarioDto findByCodigo(@RequestParam("codigo") String codigo) {
        return this.usuarioService.findUsuarioByCodigo(codigo);
    }

    @GetMapping("/asesor-directory-by-filters")
    public ResponseEntity<List<PerfilAsesorDto>> getDirectorioDeAsesoresPorFiltros(
            @ModelAttribute FiltrosDirectorioAsesores filtros) {
        List<PerfilAsesorDto> asesores = usuarioService.getDirectorioDeAsesoresPorFiltros(filtros);
        return new ResponseEntity<>(asesores, HttpStatus.OK);

        // try {
        // List<PerfilAsesorDto> asesores =
        // usuarioService.getDirectorioDeAsesoresPorFiltros(filtros);
        // return new ResponseEntity<>(asesores, HttpStatus.OK);
        // } catch (Exception e) {
        // return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        // }
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

    @GetMapping("/find_all")
    public ResponseEntity<List<UsuarioDto>> findAllUsuarios() {
        try {
            List<UsuarioDto> usuarios = usuarioService.findAllUsuarios();
            return new ResponseEntity<>(usuarios, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUsuario(@PathVariable Integer id) {
        try {
            usuarioService.deleteUsuario(id);
            return new ResponseEntity<>("Usuario eliminado exitosamente", HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Usuario no encontrado: " + e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar el usuario: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateUsuario(@PathVariable Integer id, @RequestBody UsuarioDto usuarioDto) {
        try {
            usuarioService.updateUsuario(id, usuarioDto);
            return new ResponseEntity<>("Usuario actualizado exitosamente", HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Usuario no encontrado: " + e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar el usuario: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/detalle-tema-alumno/{idUsuario}")
    public ResponseEntity<AlumnoTemaDto> getDetalleTemaAlumno(@PathVariable("idUsuario") Integer idUsuario) {
        try {
            AlumnoTemaDto tema = usuarioService.getAlumnoTema(idUsuario);
            return ResponseEntity.ok(tema);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }

{/*
    //Probando lo del Id_Token
    @GetMapping("/detalle-tema-alumno/{idUsuario}")
    public ResponseEntity<AlumnoTemaDto> getDetalleTemaAlumno(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Obtén el username (o email, o sub) desde el token
            Integer idUsuario = Integer.parseInt(userDetails.getUsername());
            // Si necesitas el id, búscalo en tu base de datos usando el username/email
            AlumnoTemaDto tema = usuarioService.getAlumnoTema(idUsuario);
            return ResponseEntity.ok(tema);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
*/}




    
    @GetMapping("/getAsesoresBySubArea")
    public List<UsuarioDto> getAsesoresBySubArea(@RequestParam(name = "idSubArea") Integer idSubArea) {
        return this.usuarioService.getAsesoresBySubArea(idSubArea);
    }

    @GetMapping("/getInfoUsuarioLogueado")
    public UsuarioDto getInfoUsuarioLogueado(HttpServletRequest request) {
        try {
            String usuarioId = jwtService.extractSubFromRequest(request);
            return this.usuarioService.findByCognitoId(usuarioId);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        }
    }


}



