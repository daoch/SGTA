package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import pucp.edu.pe.sgta.dto.asesores.InfoTemaPerfilDto;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.dto.exposiciones.ExposicionTemaMiembrosDto;
import pucp.edu.pe.sgta.service.inter.JwtService;
import pucp.edu.pe.sgta.service.inter.TemaService;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@RestController

@RequestMapping("/temas")
public class TemaController {

	@Autowired
	TemaService temaService;

	@Autowired
	JwtService jwtService;

	@GetMapping("/findByUser") // finds topics by user
	public List<TemaDto> findByUser(@RequestParam(name = "idUsuario") Integer idUsuario) {
		return temaService.findByUsuario(idUsuario);
	}

	@GetMapping("/findById") // finds a topic by id
	public TemaDto findById(@RequestParam(name = "idTema") Integer idTema) {
		return temaService.findById(idTema);
	}  
	
	
	@PostMapping("/createPropuesta")
    public void createTema(@RequestBody TemaDto dto,
						   @RequestParam(name = "tipoPropuesta", defaultValue = "0") Integer tipoPropuesta,
						   HttpServletRequest request) {
		try {
			String idUsuarioCreador = jwtService.extractSubFromRequest(request);
			temaService.createTemaPropuesta(dto, idUsuarioCreador, tipoPropuesta);
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}
    }

    @PostMapping("/createInscripcion") // Inscripcion de tema oficial por asesor
    public void createInscripcion(
            @RequestBody @Valid TemaDto dto
            //@RequestParam(name = "idUsuarioCreador") Integer idUsuarioCreador
			) {
        temaService.createInscripcionTema(dto);
    }

	@PutMapping("/update") // updates a topic
	public void update(@RequestBody TemaDto dto) {
		temaService.update(dto);
	}

	@GetMapping("/listarTemasPropuestosAlAsesor/{asesorId}")
	public List<TemaDto> listarTemasPropuestosAlAsesor(
			@PathVariable Integer asesorId,
			@RequestParam(required = false) String titulo, // Parámetro opcional de título
			@RequestParam(defaultValue = "10") Integer limit, // Parámetro de límite, con valor por defecto de 10
			@RequestParam(defaultValue = "0") Integer offset // Parámetro de desplazamiento, con valor por defecto de 0
	) {

		return temaService.listarTemasPropuestosAlAsesor(asesorId, titulo, limit, offset);
	}


	@GetMapping("/listarTemasPropuestosPorSubAreaConocimiento")
	public List<TemaDto> listarTemasPropuestosPorSubAreaConocimiento(
			@RequestParam List<Integer> subareaIds,
			@RequestParam(name = "asesorId") Integer asesorId,
			@RequestParam(name = "titulo", required = false) String titulo,
			@RequestParam(value = "limit", defaultValue = "10") Integer limit,
			@RequestParam(value = "offset", defaultValue = "0") Integer offset
	) {

		return temaService.listarTemasPropuestosPorSubAreaConocimiento(subareaIds, asesorId, titulo, limit, offset);
	}



	@PostMapping("/postularAsesorTemaPropuestoGeneral")
	public void postularAsesorTemaPropuestoGeneral(
			@RequestParam(name = "idAlumno") Integer idAlumno,
			@RequestParam(name = "idAsesor") Integer idAsesor,
			@RequestParam(name = "idTema") Integer idTema,
			@RequestParam(name = "comentario") String comentario) {

		temaService.postularAsesorTemaPropuestoGeneral(idAlumno, idAsesor, idTema, comentario);


	}

	@PostMapping("/enlazarTesistasATemaPropuestDirecta")
	public void enlazarTesistasATemaPropuestDirecta(@RequestBody Map<String, Object> body) {

		List<Integer> usuariosIdList = (List<Integer>) body.get("usuariosId");
		Integer[] usuariosId = usuariosIdList.toArray(new Integer[0]);
		Integer temaId = (Integer) body.get("temaId");
		Integer profesorId = (Integer) body.get("profesorId");
		String comentario = (String) body.getOrDefault("comentario", ""); // por defecto vacío

		temaService.enlazarTesistasATemaPropuestDirecta(usuariosId, temaId, profesorId, comentario);
	}

    @GetMapping("/listarTemasPorUsuarioRolEstado/{usuarioId}")
    public List<TemaDto> listarTemasPorUsuarioRolEstado(
            @PathVariable("usuarioId") Integer usuarioId,
            @RequestParam("rolNombre")   String rolNombre,
            @RequestParam("estadoNombre")String estadoNombre) {
        return temaService.listarTemasPorUsuarioEstadoYRol(usuarioId, rolNombre, estadoNombre);
    }

	@PostMapping("/rechazarTemaPropuestaDirecta")
	public void rechazarTema(
			@RequestParam("alumnoId") Integer alumnoId,
			@RequestParam("comentario") String comentario,
			@RequestParam("temaId") Integer temaId) {

		temaService.rechazarTemaPropuestaDirecta(alumnoId, comentario, temaId);

	}

	@GetMapping("/listarPropuestasPorTesista")
	public List<TemaDto> listarPropuestasPorTesista(HttpServletRequest request) {
		try {
			String tesistaId = jwtService.extractSubFromRequest(request);
			return temaService.listarPropuestasPorTesista(tesistaId);
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}
	}
	@GetMapping("/listarPostulacionesDirectasAMisPropuestas")
	public List<TemaDto> listarPostulacionesDirectasAMisPropuestas(HttpServletRequest request) {
		try {
			String tesistaId = jwtService.extractSubFromRequest(request);
			return temaService.listarPostulacionesAMisPropuestas(tesistaId, 1);
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}
	}

	@GetMapping("/listarTemasAsesorInvolucrado/{asesorId}")
	public List<InfoTemaPerfilDto> listarTemasAsesorInvolucrado(@PathVariable("asesorId") Integer asesorId) {
		return temaService.listarTemasAsesorInvolucrado(asesorId);
	}
		@GetMapping("/listarPostulacionesGeneralesAMisPropuestas")
	public List<TemaDto> listarPostulacionesGeneralesAMisPropuestas(HttpServletRequest request) {
		try {
			String tesistaId = jwtService.extractSubFromRequest(request);
			return temaService.listarPostulacionesAMisPropuestas(tesistaId, 0);
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}
	}

	@PostMapping("/deleteTema") // deletes a topic
	public void deleteTema(@RequestBody Integer idTema) {
		temaService.delete(idTema);
	}

	@PostMapping("/aprobarPostulacionAPropuesta")
	public void aprobarPostulacionAPropuestaGeneral(@RequestParam("asesorId") Integer asesorId,
													@RequestParam("temaId") Integer temaId,
													HttpServletRequest request){
		try {
			String alumnoId = jwtService.extractSubFromRequest(request);
			temaService.aprobarPostulacionAPropuestaGeneral(temaId, asesorId, alumnoId);
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}
	}

	@PostMapping("/rechazarPostulacionAPropuesta")
	public void rechazarPostulacionAPropuestaGeneral(@RequestParam("asesorId") Integer asesorId,
													@RequestParam("temaId") Integer temaId,
													HttpServletRequest request){
		try {
			String alumnoId = jwtService.extractSubFromRequest(request);
			temaService.rechazarPostulacionAPropuestaGeneral(temaId, asesorId, alumnoId);
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}
	}

	@PostMapping("/crearTemaLibre")
	public void crearTemaLibre(@Valid @RequestBody TemaDto dto) {
		temaService.crearTemaLibre(dto);
	}

	@GetMapping("/buscarTemaPorId")
	public TemaDto buscarTemaPorId(@RequestParam(name = "idTema") Integer idTema) throws SQLException {
		return temaService.buscarTemaPorId(idTema);
	}
	
	@GetMapping("/listarTemasPorCarrera/{carreraId}/{estado}")
	public List<TemaDto> buscarPorEstadoYCarrera(
			@PathVariable("estado") String estado,
			@PathVariable("carreraId") Integer carreraId) {
		return temaService.listarTemasPorEstadoYCarrera(estado, carreraId);
	}	

	@PatchMapping("/CambiarEstadoTemaPorCoordinador")
	@SuppressWarnings("unchecked")
	public ResponseEntity<Void> actualizarEstadoTema(
	@RequestBody Map<String,Object> body
	) {
		Map<String,Object> temaMap = (Map<String,Object>) body.get("tema");
		Map<String,Object> solMap  = (Map<String,Object>) body.get("usuarioSolicitud");

		Integer id        = (Integer) temaMap.get("id");
		String  estado    = (String)  temaMap.get("estadoTemaNombre");
		Integer usuarioId = (Integer) solMap.get("usuarioId");
		String  comentario= (String)  solMap.get("comentario");

		temaService.cambiarEstadoTemaCoordinador(id, estado, usuarioId, comentario);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/listarExposiciones/{temaId}")
	public List<ExposicionTemaMiembrosDto> listarExposicionXTemaId(@PathVariable Integer temaId){
		return temaService.listarExposicionXTemaId(temaId);
	}

	    /**
     * Desactiva un tema y desasigna todos sus usuarios.
     * Sólo puede invocarlo un coordinador activo del tema.
     */
    @PatchMapping("/{temaId}/eliminar")
    public ResponseEntity<Void> cerrarTema(
            @PathVariable("temaId") Integer temaId,
            @RequestParam("usuarioId") Integer usuarioId) {

        // este método primero valida que sea coordinador y luego llama al procedure
        temaService.eliminarTemaCoordinador(temaId, usuarioId);
        return ResponseEntity.noContent().build();
    }

}


