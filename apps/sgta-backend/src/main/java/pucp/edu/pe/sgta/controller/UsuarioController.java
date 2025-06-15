package pucp.edu.pe.sgta.controller;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.NoSuchElementException;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.web.server.ResponseStatusException;
import pucp.edu.pe.sgta.dto.*;
import pucp.edu.pe.sgta.dto.asesores.*;
import pucp.edu.pe.sgta.model.UsuarioXCarrera;
import pucp.edu.pe.sgta.service.inter.CarreraService;
import pucp.edu.pe.sgta.service.inter.JwtService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;
import pucp.edu.pe.sgta.service.inter.UsuarioXCarreraService;
import pucp.edu.pe.sgta.util.TipoUsuarioEnum;

@RestController

@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private CarreraService carreraService;

    @Autowired
    JwtService jwtService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioXCarreraService usuarioXCarreraService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody UsuarioRegistroDto user) {

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
    //Otros lo usan
    @GetMapping("/getPerfilAsesor")
    public PerfilAsesorDto getPerfilAsesor(@RequestParam(name = "id") Integer id) {
        return this.usuarioService.getPerfilAsesor(id);
    }

    @PutMapping("/updatePerfilAsesor")
    public void updatePerfilAsesor(@RequestBody PerfilAsesorDto dto) {
        usuarioService.updatePerfilAsesor(dto);
    }
    //Nuevo

    @GetMapping("/getPerfilUsuario")
    public PerfilUsuarioDto getPerfilUsuario(HttpServletRequest request, @RequestParam(name = "idUsuario",required = false) Integer idUsuario) {
        String cognitoId;

        if (idUsuario != null) {
            // Si se proporciona idUsuario, obtén el cognitoId desde el servicio o ignóralo si no es necesario
            cognitoId = usuarioService.obtenerCognitoPorId(idUsuario);
        } else {
            cognitoId = jwtService.extractSubFromRequest(request);
        }

        return usuarioService.getPerfilUsuario(cognitoId);
    }
    @PutMapping("/updatePerfilUsuario")
    public void updatePerfilAsesor(@RequestBody PerfilUsuarioDto dto) {
        usuarioService.updatePerfilUsuario(dto);
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
     * @param request         HttpServletRequest para obtener el ID del usuario
     * @return Lista de usuarios con sus roles
     */
    @GetMapping("/professors-with-roles")
    public ResponseEntity<List<UsuarioConRolDto>> getProfessorsWithRoles(
            @RequestParam(required = false, defaultValue = "Todos") String rolNombre,
            @RequestParam(required = false) String terminoBusqueda, HttpServletRequest request) {
        String cognitoId = jwtService.extractSubFromRequest(request);
        try {
            List<UsuarioConRolDto> usuarios = usuarioService.getProfessorsWithRoles(rolNombre, terminoBusqueda, cognitoId);
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

    @GetMapping("/carreras")
    public ResponseEntity<List<CarreraDto>> listarCarreras(
            HttpServletRequest request) {

        String usuarioId = jwtService.extractSubFromRequest(request); 
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
    /**
     Api usada por un ALUMNO para ver que asesores existen en su carrera
     */
    @GetMapping("/asesor-directory-by-filters")
    public ResponseEntity<Page<PerfilAsesorDto>> getDirectorioDeAsesoresPorFiltros(
            @ModelAttribute FiltrosDirectorioAsesores filtros,
            @RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
            @RequestParam(name = "order", defaultValue = "true") Boolean order
            //HttpServletRequest request
    ) {
        Page<PerfilAsesorDto> asesores = usuarioService.getDirectorioDeAsesoresPorFiltros(filtros,page,order);
        return new ResponseEntity<>(asesores, HttpStatus.OK);
    }

    @PostMapping(value = "/carga-masiva", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> cargarUsuarios(@RequestPart("archivo") MultipartFile archivo,
                                                 @RequestPart UsuarioRegistroDto datosExtra) {
        try {
            usuarioService.procesarArchivoUsuarios(archivo, datosExtra);
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
    public ResponseEntity<String> updateUsuario(@PathVariable Integer id, @RequestBody UsuarioRegistroDto usuarioDto) {
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

    @PutMapping("/reactivar/{id}")
    public ResponseEntity<String> reactivarUsuario(@PathVariable Integer id) {
        try {
            usuarioService.reactivarUsuario(id);
            return new ResponseEntity<>("Usuario reactivado exitosamente", HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>("Usuario no encontrado: " + e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al reactivar el usuario: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/detalle-tema-alumno")
    public ResponseEntity<AlumnoTemaDto> getDetalleTemaAlumno(HttpServletRequest request) {
        try {
            String idUsuario = jwtService.extractSubFromRequest(request);
            AlumnoTemaDto tema = usuarioService.getAlumnoTema(idUsuario);
            return ResponseEntity.ok(tema);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }

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

    @GetMapping("/findByStudentsForReviewer")
    public ResponseEntity<List<AlumnoReporteDto>> findByStudentsForReviewer(HttpServletRequest request, 
            @RequestParam(required = false) String cadenaBusqueda) {
        try {
            String usuarioId = jwtService.extractSubFromRequest(request);
            List<AlumnoReporteDto> alumnos = usuarioService.findByStudentsForReviewer(usuarioId, cadenaBusqueda);
            return ResponseEntity.ok(alumnos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/getProfesoresActivos")
    public List<DocentesDTO> getProfesoresActivos() {
        try {
            List<DocentesDTO> docentes = usuarioService.getProfesores();
            return docentes;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error al obtener profesores activos: " + e.getMessage());
        }
    }

    @GetMapping("/listarRevisoresPorCarrera")
    public List<UsuarioRolRevisorDto> lsitarRevisoresPorCarrera(HttpServletRequest request){
        String coordinadorId = jwtService.extractSubFromRequest(request);
        UsuarioXCarrera usuarioXCarrera = usuarioXCarreraService.getCarreraPrincipalCoordinador(coordinadorId);
        return usuarioService.listarRevisoresPorCarrera(usuarioXCarrera.getCarrera().getId());
    }

}
