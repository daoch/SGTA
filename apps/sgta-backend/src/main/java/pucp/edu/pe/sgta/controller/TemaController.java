package pucp.edu.pe.sgta.controller;

import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import pucp.edu.pe.sgta.dto.TemaConAsesorJuradoDTO;
import pucp.edu.pe.sgta.dto.TemaPorAsociarDto;
import pucp.edu.pe.sgta.dto.TemaSimilarDto;
import pucp.edu.pe.sgta.dto.asesores.InfoTemaPerfilDto;
import pucp.edu.pe.sgta.dto.asesores.TemaConAsesorDto;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.dto.exposiciones.ExposicionTemaMiembrosDto;
import pucp.edu.pe.sgta.dto.temas.TemasComprometidosDto;
import pucp.edu.pe.sgta.dto.TemaSimilarityResult;
import pucp.edu.pe.sgta.service.inter.JwtService;
import pucp.edu.pe.sgta.service.inter.SimilarityService;
import pucp.edu.pe.sgta.service.inter.TemaService;
import pucp.edu.pe.sgta.dto.UsuarioTemaDto;

import java.sql.SQLException;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@RestController

@RequestMapping("/temas")
public class TemaController {
	// Constants for response keys
	private static final String ERROR_KEY = "error";
	private static final String DETAILS_KEY = "details";
	private static final String AUTH_TOKEN_REQUIRED_MESSAGE = "Token de autenticación requerido";

	@Autowired
	TemaService temaService;

	@Autowired
	JwtService jwtService;

	@Autowired
	SimilarityService similarityService;

	@GetMapping("/findByUser") // finds topics by user
	public List<TemaDto> findByUser(@RequestParam(name = "idUsuario") Integer idUsuario) {
		return temaService.findByUsuario(idUsuario);
	}

	@GetMapping("/findById") // finds a topic by id
	public TemaDto findById(@RequestParam(name = "idTema") Integer idTema) {
		return temaService.findById(idTema);
	}

	@PostMapping("/createPropuesta")
	public Integer createTema(@RequestBody TemaDto dto,
			@RequestParam(name = "tipoPropuesta", defaultValue = "0") Integer tipoPropuesta,
			HttpServletRequest request) {
		try {
			String idUsuarioCreador = jwtService.extractSubFromRequest(request);
			return temaService.createTemaPropuesta(dto, idUsuarioCreador, tipoPropuesta);
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}
	}

	@PostMapping("/createInscripcion") // Inscripcion de tema oficial por asesor
	public Integer createInscripcion(
			@RequestBody @Valid TemaDto dto,
			HttpServletRequest request
	// @RequestParam(name = "idUsuarioCreador") Integer idUsuarioCreador
	) {
		String idUsuarioCreador = jwtService.extractSubFromRequest(request);
		return temaService.createInscripcionTema(dto, idUsuarioCreador);
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
			// System.err.println("Usuario ID: " + usuarioId);
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

	@GetMapping("/listarTemasCicloActualXEtapaFormativa/{etapaFormativaId}/{exposicionId}")
	public List<TemaConAsesorJuradoDTO> listarTemasCicloActualXEtapaFormativa(
			@PathVariable("etapaFormativaId") Integer etapaFormativaId, @PathVariable("exposicionId") Integer exposicionId ) {
		return temaService.listarTemasCicloActualXEtapaFormativa(etapaFormativaId,exposicionId);
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
	@PostMapping("/findSimilar")
	public List<TemaSimilarityResult> findSimilarTemas(
			@RequestBody TemaDto tema,
			@RequestParam(value = "threshold", required = false) Double threshold) {
		if (threshold != null) {
			return similarityService.findSimilarTemas(tema, threshold);
		}
		return similarityService.findSimilarTemas(tema);
	}

	@GetMapping("/similarity/threshold")
	public Map<String, Double> getSimilarityThreshold() {
		return Map.of("threshold", similarityService.getDefaultThreshold());
	}

	@PutMapping("/similarity/threshold")
	public ResponseEntity<Void> setSimilarityThreshold(@RequestParam Double threshold) {
		similarityService.setDefaultThreshold(threshold);
		return ResponseEntity.ok().build();
	}


	@GetMapping("/listarMisPostulacionesTemaLibre")
	public List<TemaDto> listarMisPostulacionesTemaLibre(HttpServletRequest request) {
		try {
			String tesistaId = jwtService.extractSubFromRequest(request);
			return temaService.listarTemasLibres("", 0, 0, tesistaId, true);
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

	@GetMapping("/porUsuarioTituloAreaCarreraEstadoFecha")
	public List<TemaDto> listarPorUsuarioTituloAreaCarreraEstadoFecha(
			@RequestParam(value = "titulo", required = false) String titulo,
			@RequestParam(value = "areaId", required = false) Integer areaId,
			@RequestParam(value = "carreraId", required = false) Integer carreraId,
			@RequestParam(value = "estadoNombre", required = false) String estadoNombre,
			@RequestParam(value = "fechaCreacionDesde", required = false) String fechaCreacionDesdeStr,
			@RequestParam(value = "fechaCreacionHasta", required = false) String fechaCreacionHastaStr,
			@RequestParam(value = "limit", defaultValue = "10") Integer limit,
			@RequestParam(value = "offset", defaultValue = "0") Integer offset,
			HttpServletRequest request
	) {
		// Convertimos null a cadenas vacías cuando corresponda
		String filtroTitulo = (titulo == null ? "" : titulo);
		String filtroEstado = (estadoNombre == null ? "" : estadoNombre);

		// Parseo de fechas (formato "yyyy-MM-dd")
		LocalDate fechaDesde = null;
		LocalDate fechaHasta = null;
		if (fechaCreacionDesdeStr != null && !fechaCreacionDesdeStr.isBlank()) {
			fechaDesde = LocalDate.parse(fechaCreacionDesdeStr);
		}
		if (fechaCreacionHastaStr != null && !fechaCreacionHastaStr.isBlank()) {
			fechaHasta = LocalDate.parse(fechaCreacionHastaStr);
		}

		String usuarioCognitoId = jwtService.extractSubFromRequest(request);
		return temaService.listarTemasPorUsuarioTituloAreaCarreraEstadoFecha(
				usuarioCognitoId,
				filtroTitulo,
				areaId,
				carreraId,
				filtroEstado,
				fechaDesde,
				fechaHasta,
				limit,
				offset
		);
	}

	@GetMapping("/filtradoCompleto")
	public List<TemaDto> filtrarCompleto(
			@RequestParam(value = "titulo",                   required = false) String titulo,
			@RequestParam(value = "estadoNombre",             required = false) String estadoNombre,
			@RequestParam(value = "carreraId",                required = false) Integer carreraId,
			@RequestParam(value = "areaId",                   required = false) Integer areaId,
			@RequestParam(value = "nombreUsuario",            required = false) String nombreUsuario,
			@RequestParam(value = "primerApellidoUsuario",    required = false) String primerApellidoUsuario,
			@RequestParam(value = "segundoApellidoUsuario",   required = false) String segundoApellidoUsuario,
			@RequestParam(value = "limit",   defaultValue = "10") Integer limit,
			@RequestParam(value = "offset",  defaultValue = "0")  Integer offset
	) {
		// Convertir posibles nulls a cadenas vacías (para que la función SQL los trate como "no filtro")
		String filtroTitulo          = (titulo                  == null ? "" : titulo);
		String filtroEstado          = (estadoNombre            == null ? "" : estadoNombre);
		String filtroNombreUsuario   = (nombreUsuario           == null ? "" : nombreUsuario);
		String filtroPrimerApellido  = (primerApellidoUsuario   == null ? "" : primerApellidoUsuario);
		String filtroSegundoApellido = (segundoApellidoUsuario  == null ? "" : segundoApellidoUsuario);

		return temaService.listarTemasFiltradoCompleto(
				filtroTitulo,
				filtroEstado,
				carreraId,
				areaId,
				filtroNombreUsuario,
				filtroPrimerApellido,
				filtroSegundoApellido,
				limit,
				offset
		);
	}


	@PostMapping("/guardarSimilitudes")
    public ResponseEntity<Void> guardarSimilitudes(
            @RequestBody List<TemaSimilarDto> similitudes,
            HttpServletRequest request) {
        try {
            String cognitoId = jwtService.extractSubFromRequest(request);
            temaService.guardarSimilitudes(cognitoId, similitudes);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (RuntimeException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }


    }

	@GetMapping("/{temaId}/similares")
    public List<TemaDto> listarSimilares(@PathVariable Integer temaId) {
        return temaService.listarTemasSimilares(temaId);
    }
	@PostMapping("/initializeFaiss")
	public ResponseEntity<Map<String, Object>> initializeFaissIndex(HttpServletRequest request) {		try {
			// Verify user has proper authorization
			String sub = jwtService.extractSubFromRequest(request);
			if (sub == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of(ERROR_KEY, AUTH_TOKEN_REQUIRED_MESSAGE));
			}

			// Delegate to service layer
			Map<String, Object> result = similarityService.initializeFaissIndexWithResponse();

			// Return appropriate HTTP status based on service result
			if (Boolean.TRUE.equals(result.get("success"))) {
				return ResponseEntity.ok(result);
			} else {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
			}

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(Map.of(
					ERROR_KEY, "Error al inicializar el índice FAISS",
					DETAILS_KEY, e.getMessage()
				));
		}
	}

	@GetMapping("/faissStatus")
	public ResponseEntity<Map<String, Object>> getFaissStatus() {
		try {
			// Delegate to service layer
			Map<String, Object> result = similarityService.getFaissStatus();

			// Return appropriate HTTP status based on service result
			if (Boolean.TRUE.equals(result.get("success"))) {
				return ResponseEntity.ok(result);
			} else {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
			}

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(Map.of(
					ERROR_KEY, "Error al obtener el estado de FAISS",
					DETAILS_KEY, e.getMessage()
				));
		}
	}

	@PostMapping("/clearFaiss")
	public ResponseEntity<Map<String, Object>> clearFaissIndex(HttpServletRequest request) {		try{
			String sub = jwtService.extractSubFromRequest(request);
			if (sub == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(Map.of(ERROR_KEY, AUTH_TOKEN_REQUIRED_MESSAGE));
			}
			Map<String, Object> result = similarityService.clearFaissIndex();
			if (Boolean.TRUE.equals(result.get("success"))) {
				return ResponseEntity.ok(result);
			} else {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of(
							ERROR_KEY, "Error al inicializar el índice FAISS",
							DETAILS_KEY, e.getMessage()
					));
		}
	}

	@DeleteMapping("/faiss/topics/{temaId}")
	public ResponseEntity<Map<String, Object>> removeTemaFromFaissIndex(@PathVariable Integer temaId, HttpServletRequest request) {
		try {
			// Verify user has proper authorization
			String sub = jwtService.extractSubFromRequest(request);
			if (sub == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of(ERROR_KEY, AUTH_TOKEN_REQUIRED_MESSAGE));
			}

			Map<String, Object> result = similarityService.removeTemaFromFaissIndex(temaId);
			return ResponseEntity.ok(result);
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(Map.of(
					ERROR_KEY, "Error al remover el tema del índice FAISS",
					DETAILS_KEY, e.getMessage()
				));
		}
	}

	@GetMapping("/contarPostuladosAlumnosTemaLibreAsesor")
	public Integer contarPostuladosAlumnosTemaLibreAsesor(
			@RequestParam(required = false) String busqueda,
			@RequestParam(required = false) String estado,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaLimite,
			HttpServletRequest request
	) {
		try {
			String usuarioId = jwtService.extractSubFromRequest(request);
			return temaService.contarPostuladosAlumnosTemaLibreAsesor(busqueda, estado, fechaLimite, usuarioId);
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), e);
		}
	}

	@GetMapping("/verificarTemasComprometidosTesista")
	public ResponseEntity<List<TemasComprometidosDto>> verificarTemasComprometidosTesista(
			HttpServletRequest request) {
		try {
			String usuarioSubId = jwtService.extractSubFromRequest(request);
			if (usuarioSubId == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(null);
			}
			
			List<TemasComprometidosDto> temasComprometidos = temaService.contarTemasComprometidos(usuarioSubId);
			return ResponseEntity.ok(temasComprometidos);
			
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Error al verificar temas comprometidos: " + e.getMessage());
		}
	}

	@PostMapping("/aceptarPropuestaCotesista")
	public ResponseEntity<Void> aceptarPropuestaCotesista(
			@RequestParam("temaId") Integer temaId,
			@RequestParam("accion") Integer action, // 0 para aceptar, 1 para rechazar
			HttpServletRequest request) {
		try {
			String usuarioId = jwtService.extractSubFromRequest(request);
			temaService.aceptarPropuestaCotesista(temaId, usuarioId, action);
			return ResponseEntity.ok().build();
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}
	}

	@GetMapping("/listarPropuestasPorCotesista")
	public List<TemaDto> listarPropuestasPorCotesista(HttpServletRequest request) {
		try {
			String tesistaId = jwtService.extractSubFromRequest(request);
			return temaService.listarPropuestasPorCotesista(tesistaId);
		} catch (RuntimeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
		}
	}
	
}




