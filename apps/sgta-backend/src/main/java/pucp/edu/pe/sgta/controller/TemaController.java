package pucp.edu.pe.sgta.controller;

import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import pucp.edu.pe.sgta.dto.TemaConAsesorJuradoDTO;
import pucp.edu.pe.sgta.dto.TemaPorAsociarDto;
import pucp.edu.pe.sgta.dto.asesores.InfoTemaPerfilDto;
import pucp.edu.pe.sgta.dto.asesores.TemaConAsesorDto;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.dto.exposiciones.ExposicionTemaMiembrosDto;
import pucp.edu.pe.sgta.service.inter.JwtService;
import pucp.edu.pe.sgta.service.inter.TemaService;
import pucp.edu.pe.sgta.dto.UsuarioTemaDto;

import java.sql.SQLException;
import java.time.LocalDate;
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
			@RequestBody @Valid TemaDto dto,
			HttpServletRequest request
	// @RequestParam(name = "idUsuarioCreador") Integer idUsuarioCreador
	) {
		String idUsuarioCreador = jwtService.extractSubFromRequest(request);
		temaService.createInscripcionTema(dto, idUsuarioCreador);
	}

	@PutMapping("/update") // updates a topic
	public void update(@RequestBody TemaDto dto) {
		temaService.update(dto);
	}

	@GetMapping("/listarTemasPropuestosAlAsesor")
	public List<TemaDto> listarTemasPropuestosAlAsesor(
			@RequestParam(required = false) String titulo, // Parámetro opcional de título
			@RequestParam(defaultValue = "10") Integer limit, // Parámetro de límite, con valor por defecto de 10
			@RequestParam(defaultValue = "0") Integer offset, // Parámetro de desplazamiento, con valor por defecto de 0
			HttpServletRequest request) {
		try {
			String asesorId = jwtService.extractSubFromRequest(request);
			return temaService.listarTemasPropuestosAlAsesor(asesorId, titulo, limit, offset);
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}

	}

	@GetMapping("/listarTemasPropuestosPorSubAreaConocimiento")
	public List<TemaDto> listarTemasPropuestosPorSubAreaConocimiento(
			@RequestParam List<Integer> subareaIds,
			@RequestParam(name = "titulo", required = false) String titulo,
			@RequestParam(value = "limit", defaultValue = "10") Integer limit,
			@RequestParam(value = "offset", defaultValue = "0") Integer offset,
			HttpServletRequest request) {
		try {
			String asesorId = jwtService.extractSubFromRequest(request);
			return temaService.listarTemasPropuestosPorSubAreaConocimiento(subareaIds, asesorId, titulo, limit, offset);
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}
	}

	@PostMapping("/postularAsesorTemaPropuestoGeneral")
	public void postularAsesorTemaPropuestoGeneral(
			@RequestParam(name = "idAlumno") Integer idAlumno,
			@RequestParam(name = "idTema") Integer idTema,
			@RequestParam(name = "comentario") String comentario,
			HttpServletRequest request) {

		try {
			String asesorId = jwtService.extractSubFromRequest(request);
			temaService.postularAsesorTemaPropuestoGeneral(idAlumno, asesorId, idTema, comentario);

		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}

	}

	@PostMapping("/enlazarTesistasATemaPropuestDirecta")
	public void enlazarTesistasATemaPropuestDirecta(@RequestBody Map<String, Object> body, HttpServletRequest request) {

		try {
			String profesorId = jwtService.extractSubFromRequest(request);
			List<Integer> usuariosIdList = (List<Integer>) body.get("usuariosId");
			Integer[] usuariosId = usuariosIdList.toArray(new Integer[0]);
			Integer temaId = (Integer) body.get("temaId");
			String comentario = (String) body.getOrDefault("comentario", ""); // por defecto vacío

			temaService.enlazarTesistasATemaPropuestDirecta(usuariosId, temaId, profesorId, comentario);

		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}

	}

	@GetMapping("/listarTemasPorUsuarioRolEstado")
	public List<TemaDto> listarTemasPorUsuarioRolEstado(
			@RequestParam("rolNombre") String rolNombre,
			@RequestParam("estadoNombre") String estadoNombre,
			@RequestParam(defaultValue = "10") Integer limit, 
			@RequestParam(defaultValue = "0") Integer offset,
			HttpServletRequest request) {
		try {
			String usuarioId = jwtService.extractSubFromRequest(request);
			//System.err.println("Usuario ID: " + usuarioId);
			return temaService.listarTemasPorUsuarioEstadoYRol(usuarioId, rolNombre, estadoNombre, limit, offset);
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}
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

	@GetMapping("/listarTemasCicloActualXEtapaFormativa/{etapaFormativaId}")
	public List<TemaConAsesorJuradoDTO> listarTemasCicloActualXEtapaFormativa(
			@PathVariable("etapaFormativaId") Integer etapaFormativaId) {
		return temaService.listarTemasCicloActualXEtapaFormativa(etapaFormativaId);
	}

	@PostMapping("/deleteTema") // deletes a topic
	public void deleteTema(@RequestBody Integer idTema) {
		temaService.delete(idTema);
	}

	@PostMapping("/aprobarPostulacionAPropuesta")
	public void aprobarPostulacionAPropuestaGeneral(@RequestParam("asesorId") Integer asesorId,
			@RequestParam("temaId") Integer temaId,
			HttpServletRequest request) {
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
			HttpServletRequest request) {
		try {
			String alumnoId = jwtService.extractSubFromRequest(request);
			temaService.rechazarPostulacionAPropuestaGeneral(temaId, asesorId, alumnoId);
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}
	}

	@PostMapping("/crearTemaLibre")
	public void crearTemaLibre(@Valid @RequestBody TemaDto dto, HttpServletRequest request) {
		try {
			String asesorId = jwtService.extractSubFromRequest(request);
			temaService.crearTemaLibre(dto, asesorId);
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}

	}

	@GetMapping("/buscarTemaPorId")
	public TemaDto buscarTemaPorId(@RequestParam(name = "idTema") Integer idTema) throws SQLException {
		return temaService.buscarTemaPorId(idTema);
	}

	@GetMapping("/listarTemasPorCarrera/{carreraId}/{estado}")
	public List<TemaDto> buscarPorEstadoYCarrera(
			@PathVariable("estado") String estado,
			@PathVariable("carreraId") Integer carreraId,
			@RequestParam(name = "limit", defaultValue = "10") Integer limit,
			@RequestParam(name = "offset", defaultValue = "0") Integer offset) {
		return temaService.listarTemasPorEstadoYCarrera(estado, carreraId, limit, offset);	
	}

	@PatchMapping("/CambiarEstadoTemaPorCoordinador")
	@SuppressWarnings("unchecked")
	public ResponseEntity<Void> actualizarEstadoTema(
			@RequestBody Map<String, Object> body,
			HttpServletRequest request) {
		String coordinadorId = jwtService.extractSubFromRequest(request);
		Map<String, Object> temaMap = (Map<String, Object>) body.get("tema");
		Map<String, Object> solMap = (Map<String, Object>) body.get("usuarioSolicitud");

		Integer id = (Integer) temaMap.get("id");
		String estado = (String) temaMap.get("estadoTemaNombre");
		String comentario = (String) solMap.get("comentario");

		temaService.cambiarEstadoTemaCoordinador(id, estado, coordinadorId, comentario);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/listarExposiciones/{temaId}")
	public List<ExposicionTemaMiembrosDto> listarExposicionXTemaId(@PathVariable Integer temaId) {
		return temaService.listarExposicionXTemaId(temaId);
	}

	/**
	 * Desactiva un tema y desasigna todos sus usuarios.
	 * Sólo puede invocarlo un coordinador activo del tema.
	 */
	@PatchMapping("/{temaId}/eliminar")
	public ResponseEntity<Void> cerrarTema(
			@PathVariable("temaId") Integer temaId,
			HttpServletRequest request) {

		String coordinadorId = jwtService.extractSubFromRequest(request);
		// este método primero valida que sea coordinador y luego llama al procedure
		temaService.eliminarTemaCoordinador(temaId, coordinadorId);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/listarTemaActivoConAsesor/{idAlumno}")
	public ResponseEntity<TemaConAsesorDto> listarTemas(@PathVariable Integer idAlumno) {
		TemaConAsesorDto temas = temaService.obtenerTemaActivoPorAlumno(idAlumno);
		return ResponseEntity.ok(temas);
	}
	@GetMapping("/listarTemasLibres")
	public List<TemaDto> listarTemasLibres(
			@RequestParam(name = "titulo", required = false) String titulo,
			@RequestParam(name = "limit", defaultValue = "10") Integer limit,
			@RequestParam(name = "offset", defaultValue = "0") Integer offset,
			HttpServletRequest request) {
		try {
			String usuarioId = jwtService.extractSubFromRequest(request);
			return temaService.listarTemasLibres(titulo, limit, offset, usuarioId, false);
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}
	}

	@PostMapping("/solicitud/cambio-resumen/{temaId}")
    public ResponseEntity<String> crearSolicitudCambioDeResumen(
            @PathVariable Integer temaId,
            @RequestBody Map<String, Object> body,
            HttpServletRequest request) {

		String coordinadorId = jwtService.extractSubFromRequest(request);        

		Map<String, Object> solMap = (Map<String, Object>) body.get("usuarioSolicitud");

		String comentario = (String) solMap.get("comentario");
	    temaService.crearSolicitudCambioDeResumen(coordinadorId, comentario, temaId);

        return ResponseEntity.ok("Solicitud de cambio de resumen creada correctamente.");
    }

    @PostMapping("/solicitud/cambio-titulo/{temaId}")
    public ResponseEntity<String> crearSolicitudCambioDeTitulo(
            @PathVariable Integer temaId,
           @RequestBody Map<String, Object> body,
            HttpServletRequest request) {

		String coordinadorId = jwtService.extractSubFromRequest(request);  
		Map<String, Object> solMap = (Map<String, Object>) body.get("usuarioSolicitud");

		String comentario = (String) solMap.get("comentario");
        temaService.crearSolicitudCambioDeTitulo(coordinadorId, comentario, temaId);

        return ResponseEntity.ok("Solicitud de cambio de título creada correctamente.");
    }

	@PostMapping("/postularTemaLibre")
	public void postularTemaLibre(@RequestParam("temaId") Integer temaId,
        @RequestParam("comentario") String comentario,
		 HttpServletRequest request) {
		try {
			String tesistaId = jwtService.extractSubFromRequest(request);
			temaService.postularTemaLibre(temaId, tesistaId, comentario);
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}
	}

	@PutMapping("/inscribirTemaPrenscrito/{temaId}")
    public ResponseEntity<String> inscribirTemaPrenscrito(
            @PathVariable Integer temaId,
            HttpServletRequest request) {

		String asesorId = jwtService.extractSubFromRequest(request);  

        temaService.inscribirTemaPreinscrito(temaId, asesorId);

        return ResponseEntity.ok("Inscripción de tema preinscrito exitoso.");
    }

	@GetMapping("/listarPostuladosTemaLibre")
	public List<TemaDto> listarPostuladosTemaLibre(
			@RequestParam(required = false) String busqueda,
			@RequestParam(required = false) String estado,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaLimite,
			@RequestParam(defaultValue = "10") Integer limit,
			@RequestParam(defaultValue = "0") Integer offset,
			HttpServletRequest request
	) {
		try {
			String usuarioId = jwtService.extractSubFromRequest(request);
			return temaService.listarPostuladosTemaLibre(busqueda, estado, fechaLimite, limit, offset, usuarioId);
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}
	}


	@GetMapping("/listarMisPostulacionesTemaLibre")
	public List<TemaDto> listarMisPostulacionesTemaLibre(HttpServletRequest request) {
		try {
			String tesistaId = jwtService.extractSubFromRequest(request);
			return temaService.listarTemasLibres("",0,0 , tesistaId, true);
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}
	}

	@PostMapping("/eliminarPostulacionTemaLibre")
	public ResponseEntity<Void> eliminarPostulacionTemaLibre(
			@RequestParam("temaId") Integer temaId,
			HttpServletRequest request) {
		try {
			String tesistaId = jwtService.extractSubFromRequest(request);
			temaService.eliminarPostulacionTemaLibre(temaId, tesistaId);
			return ResponseEntity.noContent().build();
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}
	}

	@PutMapping("/aceptarPostulacionAlumnoTemaLibre")
	public void aceptarPostulacionAlumnoTemaLibre(
		@RequestBody UsuarioTemaDto usuarioTemaDto,
		HttpServletRequest request) {
		try {
			String asesorId = jwtService.extractSubFromRequest(request);
			temaService.aceptarPostulacionAlumno(usuarioTemaDto.getTemaId(), 
												usuarioTemaDto.getUsuarioId(), 
												asesorId,
												usuarioTemaDto.getComentario());
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}
	}

	@PutMapping("/rechazarPostulacionAlumnoTemaLibre")
	public void rechazarPostulacionAlumnoTemaLibre(
		@RequestBody UsuarioTemaDto usuarioTemaDto,
		HttpServletRequest request) {
		try {
			String asesorId = jwtService.extractSubFromRequest(request);
			temaService.rechazarPostulacionAlumno(usuarioTemaDto.getTemaId(), 
												usuarioTemaDto.getUsuarioId(), 
												asesorId,
												usuarioTemaDto.getComentario());
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}
	}

	@GetMapping("/listarTemasPorAsociarPorCarrera/{carreraId}")
	public List<TemaPorAsociarDto> listarTemasPorAsociarPorCarrera(@PathVariable("carreraId") Integer carreraId) {
		return temaService.listarTemasPorAsociarPorCarrera(carreraId);
	}

	@PostMapping("/asociar-tema-curso/curso/{cursoId}/tema/{temaId}")
	public void asociarTemaACurso(@PathVariable Integer cursoId, @PathVariable Integer temaId){
		temaService.asociarTemaACurso(cursoId, temaId);
	}

}

