package pucp.edu.pe.sgta.service.imp;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pucp.edu.pe.sgta.dto.*;
import pucp.edu.pe.sgta.dto.asesores.InfoTemaPerfilDto;
import pucp.edu.pe.sgta.dto.asesores.PerfilAsesorDto;
import pucp.edu.pe.sgta.dto.asesores.TemaConAsesorDto;
import pucp.edu.pe.sgta.dto.asesores.TemaResumenDto;
import pucp.edu.pe.sgta.dto.exposiciones.ExposicionTemaMiembrosDto;
import pucp.edu.pe.sgta.dto.exposiciones.MiembroExposicionDto;
import pucp.edu.pe.sgta.exception.CustomException;
import pucp.edu.pe.sgta.mapper.TemaMapper;
import pucp.edu.pe.sgta.mapper.UsuarioMapper;
import pucp.edu.pe.sgta.model.*;
import pucp.edu.pe.sgta.repository.*;
import pucp.edu.pe.sgta.service.inter.*;
import pucp.edu.pe.sgta.util.AccionSolicitudEnum;
import pucp.edu.pe.sgta.util.EstadoSolicitudEnum;
import pucp.edu.pe.sgta.util.EstadoTemaEnum;
import pucp.edu.pe.sgta.util.RolEnum;
import pucp.edu.pe.sgta.util.RolSolicitudEnum;
import pucp.edu.pe.sgta.util.TipoUsuarioEnum;
import java.io.IOException;
import java.sql.SQLException;
import java.time.*;
import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class TemaServiceImpl implements TemaService {

	private final TemaRepository temaRepository;

	private final UsuarioService usuarioService;

	private final SubAreaConocimientoService subAreaConocimientoService;

	private final UsuarioXTemaRepository usuarioXTemaRepository;

	private final SubAreaConocimientoXTemaRepository subAreaConocimientoXTemaRepository;

	private final RolRepository rolRepository;

	private final Logger logger = Logger.getLogger(TemaServiceImpl.class.getName());

	private final EstadoTemaRepository estadoTemaRepository;

	private final UsuarioXCarreraRepository usuarioCarreraRepository;

	private final CarreraRepository carreraRepository;

	private final HistorialTemaService historialTemaService;

	private final UsuarioRepository usuarioRepository;

	private final ExposicionXTemaRepository exposicionXTemaRepository;

	private final JornadaExposicionRepository jornadaExposicionRepository;

	private final JornadaExposicionXSalaExposicionRepository jornadaExposicionXSalaExposicionRepository;

	private final UsuarioXTemaRepository usuarioTemaRepository;

	private final ObjectMapper objectMapper = new ObjectMapper(); // for JSON conversion
	private final CarreraServiceImpl carreraServiceImpl;

	private final TipoSolicitudRepository tipoSolicitudRepository;

	private final SolicitudRepository solicitudRepository;

	private final UsuarioXSolicitudRepository usuarioXSolicitudRepository;

	private final AreaConocimientoService areaConocimientoService;

    private EstadoSolicitudRepository estadoSolicitudRepository;

	private RolSolicitudRepository rolSolicitudRepository;

	private AccionSolicitudRepository accionSolicitudRepository;

	@PersistenceContext
	private EntityManager entityManager;

	public TemaServiceImpl(TemaRepository temaRepository, UsuarioXTemaRepository usuarioXTemaRepository,
			UsuarioService usuarioService, SubAreaConocimientoService subAreaConocimientoService,
			SubAreaConocimientoXTemaRepository subAreaConocimientoXTemaRepository, RolRepository rolRepository,
			EstadoTemaRepository estadoTemaRepository, UsuarioXCarreraRepository usuarioCarreraRepository,
			CarreraRepository carreraRepository, HistorialTemaService historialTemaService,
			UsuarioRepository usuarioRepository, CarreraServiceImpl carreraServiceImpl,
			ExposicionService exposicionService,
			ExposicionXTemaRepository exposicionXTemaRepository,
			JornadaExposicionRepository jornadaExposicionRepository, ExposicionRepository exposicionRepository,
			JornadaExposicionXSalaExposicionRepository jornadaExposicionXSalaExposicionRepository,
			UsuarioXTemaRepository usuarioTemaRepository, TipoSolicitudRepository tipoSolicitudRepository,
			SolicitudRepository solicitudRepository,
			UsuarioXSolicitudRepository usuarioXSolicitudRepository, AreaConocimientoService areaConocimientoService,
			EstadoSolicitudRepository estadoSolicitudRepository, RolSolicitudRepository rolSolicitudRepository,
			AccionSolicitudRepository accionSolicitudRepository) {
		this.temaRepository = temaRepository;
		this.usuarioXTemaRepository = usuarioXTemaRepository;
		this.subAreaConocimientoXTemaRepository = subAreaConocimientoXTemaRepository;
		this.subAreaConocimientoService = subAreaConocimientoService;
		this.usuarioService = usuarioService;
		this.rolRepository = rolRepository;
		this.estadoTemaRepository = estadoTemaRepository;
		this.usuarioCarreraRepository = usuarioCarreraRepository;
		this.carreraRepository = carreraRepository;
		this.historialTemaService = historialTemaService;
		this.usuarioRepository = usuarioRepository;
		this.exposicionXTemaRepository = exposicionXTemaRepository;
		this.jornadaExposicionRepository = jornadaExposicionRepository;
		this.jornadaExposicionXSalaExposicionRepository = jornadaExposicionXSalaExposicionRepository;
		this.usuarioTemaRepository = usuarioTemaRepository;
		this.tipoSolicitudRepository = tipoSolicitudRepository;
		this.solicitudRepository = solicitudRepository;
		this.usuarioXSolicitudRepository = usuarioXSolicitudRepository;
		this.carreraServiceImpl = carreraServiceImpl;
		this.areaConocimientoService = areaConocimientoService;
		this.estadoSolicitudRepository = estadoSolicitudRepository;
		this.rolSolicitudRepository = rolSolicitudRepository;
		this.accionSolicitudRepository = accionSolicitudRepository;
	}

	@Override
	public List<TemaDto> getAll() {
		List<Tema> temas = temaRepository.findAll();
		List<TemaDto> temasDto = temas.stream().map(TemaMapper::toDto).toList(); // we map
																					// to
																					// DTO
		return temasDto;
	}

	@Override
	public TemaDto findById(Integer id) {
		Tema tema = temaRepository.findById(id).orElse(null);
		if (tema != null) {
			return TemaMapper.toDto(tema);
		}
		return null;
	}

	private void saveHistorialTemaChange(Tema tema, String titulo, String resumen, String description) {
		HistorialTemaDto historialTemaDto = new HistorialTemaDto();
		historialTemaDto.setId(null);
		historialTemaDto.setTitulo(titulo);
		historialTemaDto.setResumen(resumen);
		historialTemaDto.setDescripcionCambio(description);
		historialTemaDto.setEstadoTemaId(tema.getEstadoTema().getId());
		if (tema.getId() == null) {
			throw new RuntimeException("El tema no tiene ID asignado para crear cambio en historial.");
		}
		historialTemaDto.setTema(TemaMapper.toDto(tema));
		historialTemaDto.setFechaCreacion(OffsetDateTime.now());
		historialTemaDto.setFechaModificacion(OffsetDateTime.now());
		historialTemaDto.setActivo(true);
		historialTemaService.save(historialTemaDto);
	}

	@Transactional
	@Override
	public void createTemaPropuesta(TemaDto dto, String idUsuarioCreador, Integer tipoPropuesta) {

		dto.setId(null);

		Tema tema = null;
		if (tipoPropuesta == 1) {
			tema = prepareNewTema(dto, EstadoTemaEnum.PROPUESTO_DIRECTO);
		} else { // only works if tipoPropuesta == 0 always (default value)
			tema = prepareNewTema(dto, EstadoTemaEnum.PROPUESTO_GENERAL);
		}

		UsuarioDto usuarioDto = usuarioService.findByCognitoId(idUsuarioCreador);

		if (usuarioDto == null) {
			throw new RuntimeException("Usuario no encontrado con Cognito ID: " + idUsuarioCreador);
		}

		/////////////////////// se tiene que modificar si se puede elegir carrera,
		/////////////////////// pararía como parámetro/////
		var relaciones = usuarioCarreraRepository.findByUsuarioIdAndActivoTrue(usuarioDto.getId());
		if (relaciones.isEmpty()) {
			throw new RuntimeException("El usuario no tiene ninguna carrera activa.");
		}
		// tomamos la primera
		Integer carreraId = relaciones.get(0).getCarrera().getId();
		// opcionalmente cargamos la entidad completa
		Carrera carrera = carreraRepository.findById(carreraId)
				.orElseThrow(() -> new RuntimeException("Carrera no encontrada con id " + carreraId));
		tema.setCarrera(carrera);
		/////////////////////////////////////////////////////////////////////////////////////////////////////

		List<UsuarioXTema> temaRelations = usuarioXTemaRepository.findByUsuarioIdAndActivoTrue(usuarioDto.getId());
		for (UsuarioXTema ux : temaRelations) {
			Tema temaAux = temaRepository.findById(ux.getTema().getId())
					.orElseThrow(() -> new RuntimeException("Tema no encontrado con ID: " + ux.getTema().getId()));
			if (temaAux.getEstadoTema().getNombre().equals(EstadoTemaEnum.INSCRITO.name())) {
				throw new RuntimeException("El usuario ya tiene un tema inscrito.");
			}
		}

		// Save the Tema first to generate its ID. We assume the tema has an
		// areaEspecializacion
		temaRepository.save(tema);

		// Start historial tema
		saveHistorialTemaChange(tema, dto.getTitulo(), dto.getResumen(), "Creación de propuesta");

		// 1) Subáreas de conocimiento
		saveSubAreas(tema, dto.getSubareas());
		// 2) Save Creador
		saveUsuarioXTema(tema, usuarioDto.getId(), RolEnum.Tesista.name(), false, true);
		// 3) Save Asesor (Propuesta Directa)
		if (tipoPropuesta == 1) {
			if (dto.getCoasesores() == null || dto.getCoasesores().isEmpty()) {
				throw new RuntimeException("No se ha proporcionado un asesor para la propuesta directa.");
			}
			saveUsuarioXTema(tema, dto.getCoasesores().get(0).getId(), RolEnum.Asesor.name(), false, false);
		}
		// 4) Save cotesistas
		saveUsuariosInvolucrados(tema, usuarioDto.getId(), dto.getTesistas(), RolEnum.Tesista.name(), false, false); // Save
																														// cotesistas

	}

	@Transactional
	@Override
	public void update(TemaDto dto) {
		Tema tema = TemaMapper.toEntity(dto);
		temaRepository.save(tema);
	}

	@Override
	public void delete(Integer id) {
		Tema tema = temaRepository.findById(id).orElse(null);
		if (tema != null) {
			tema.setActivo(false);
			temaRepository.save(tema); // Set activo to false instead of deleting
		}
	}

	@Override
	public List<TemaDto> findByUsuario(Integer idUsuario) {
		List<UsuarioXTema> relations = usuarioXTemaRepository.findByUsuarioIdAndActivoTrue(idUsuario);

		if (!relations.isEmpty()) {
			return relations.stream().map(ux -> TemaMapper.toDto(ux.getTema())).collect(Collectors.toList());
		}
		return List.of(); // Return an empty list if no relations found

	}

	private void validarTipoUsurio(Integer usuarioId, String tipoUsuario) {
		boolean ok = usuarioRepository
				.existsByIdAndTipoUsuarioNombre(usuarioId, tipoUsuario);
		if (!ok) {
			throw new ResponseStatusException(
					HttpStatus.FORBIDDEN,
					"El usuario con id " + usuarioId + " no es un " + tipoUsuario);
		}
	}

	private void validarExistenciaListaUsuarios(List<?> tesistas) {
		if (tesistas == null || tesistas.isEmpty()) {
			// Opción A: usar tu CustomException (se mapea a 400 Bad Request)
			throw new CustomException("Debe haber al menos un tesista y un asesor.");
		}
	}

	private void validarUnicidadUsuarios(List<UsuarioDto> usuarios, String rol) {
		if (usuarios == null)
			return;
		Set<Integer> vistos = new HashSet<>();
		for (UsuarioDto u : usuarios) {
			if (u.getId() == null) {
				throw new CustomException("Id nulo en la lista de " + rol);
			}
			if (!vistos.add(u.getId())) {
				throw new CustomException(
						"El usuario con id " + u.getId() +
								" está repetido en la lista de " + rol);
			}
		}
	}

	private void validarTesistasSinTemaAsignado(List<UsuarioDto> tesistas) {
		for (UsuarioDto t : tesistas) {
			Integer tesistaId = t.getId();
			boolean yaAsignado = usuarioXTemaRepository
					.existsByUsuarioIdAndRolNombreAndActivoTrueAndAsignadoTrue(
							tesistaId,
							"Tesista" // o el nombre exacto de tu rol
					);
			if (yaAsignado) {
				throw new CustomException(
						"El tesista con id " + tesistaId +
								" ya tiene un tema asignado");
			}
		}
	}

	private void validarUsuarioExiste(Integer usuarioId) {
		if (usuarioId == null) {
			throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST,
					"El ID de usuario no puede ser nulo");
		}
		if (!usuarioRepository.existsByIdAndActivoTrue(usuarioId)) {
			throw new ResponseStatusException(
					HttpStatus.NOT_FOUND,
					"Usuario con id " + usuarioId + " no existe");
		}
	}

	private void validarDtoTemaNoNulo(TemaDto dto) {
		if (dto == null) {
			throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST,
					"El DTO no puede ser nulo");
		}
	}

	private void validacionesInscripcionTema(TemaDto dto, Integer idUsuarioCreador) {

		validarDtoTemaNoNulo(dto); // validar que el DTO no sea nulo
		validarExistenciaListaUsuarios(dto.getTesistas());
		validarExistenciaListaUsuarios(dto.getCoasesores()); // validar que hay al menos un tesista
		validarUsuarioExiste(idUsuarioCreador);
		validarTipoUsurio(idUsuarioCreador, TipoUsuarioEnum.profesor.name()); // validar que la inscripción la haga un
																				// profesor
		// validarUnicidadUsuarios(dto.getTesistas(), RolEnum.Tesista.name()); //
		// validar que no se repiten los tesistas

		for (UsuarioDto u : dto.getTesistas()) {
			validarUsuarioExiste(u.getId());
			validarTipoUsurio(u.getId(), TipoUsuarioEnum.alumno.name()); // validar que los tesistas sean alumnos
		}

		// validarUnicidadUsuarios(dto.getCoasesores(), RolEnum.Coasesor.name()); //
		// validar que no se repiten los coasesores
		for (UsuarioDto u : dto.getCoasesores()) {
			validarUsuarioExiste(u.getId());
			validarTipoUsurio(u.getId(), TipoUsuarioEnum.profesor.name()); // validar que los coasesores sean profesores
		}
		validarTesistasSinTemaAsignado(dto.getTesistas()); // validar que los tesistas no tengan tema asignado
	}

	@Override
	@Transactional
	public void eliminarPropuestasTesista(Integer idUsuario) {
		// Asegura que cualquier insert/update previo esté flushed
		entityManager.flush();
		// Invoca la función en DB
		entityManager.createNativeQuery(
				"SELECT eliminar_propuestas_tesista(:uid)")
				.setParameter("uid", idUsuario)
				.getSingleResult(); // el valor de retorno es VOID, sólo dispara la función
	}

	@Transactional
	@Override
	public void createInscripcionTema(TemaDto dto, String idUsuario) {

		
		UsuarioDto usuarioDto = usuarioService.findByCognitoId(idUsuario);
		Integer idUsuarioCreador = usuarioDto.getId();
		validacionesInscripcionTema(dto, idUsuarioCreador);
		dto.setId(null);
		// Prepara y guarda el tema con estado INSCRITO
		Tema tema = prepareNewTema(dto, EstadoTemaEnum.INSCRITO);
		/////////////////////// se tiene que modificar si se puede elegir carrera,
		/////////////////////// pararía como parámetro/////
		var relaciones = usuarioCarreraRepository.findByUsuarioIdAndActivoTrue(idUsuarioCreador);
		if (relaciones.isEmpty()) {
			throw new RuntimeException("El usuario no tiene ninguna carrera activa.");
		}
		// tomamos la primera
		Integer carreraId = relaciones.get(0).getCarrera().getId();
		// opcionalmente cargamos la entidad completa
		Carrera carrera = carreraRepository.findById(carreraId)
				.orElseThrow(() -> new RuntimeException("Carrera no encontrada con id " + carreraId));
		tema.setCarrera(carrera);
		/////////////////////////////////////////////////////////////////////////////////////////////////////
		temaRepository.save(tema);

		saveHistorialTemaChange(tema, dto.getTitulo(), dto.getResumen(), "Inscripción de tema");
		// 1) Asesor del tema (rol "Asesor", asignado = true)
		saveUsuarioXTema(tema, idUsuarioCreador, RolEnum.Asesor.name(), true, true);
		// 2) Subáreas de conocimiento
		saveSubAreas(tema, dto.getSubareas());

		// 3) Coasesores
		saveUsuariosInvolucrados(tema, idUsuarioCreador,
				dto.getCoasesores(), RolEnum.Coasesor.name(), true, false);
		// 4) Estudiantes
		saveUsuariosInvolucrados(tema, idUsuarioCreador,
				dto.getTesistas(), RolEnum.Tesista.name(), true, false);
		// 5) Eliminar postulaciones anteriores del usuario
		entityManager.flush();
		for (UsuarioDto u : dto.getTesistas()) {
			System.out.println("Eliminando postulaciones de usuario: " + u.getId());
			eliminarPostulacionesTesista(u.getId());
			eliminarPropuestasTesista(u.getId());
		}
		// 6) Generar y enviar la solicitud de aprobación
		crearSolicitudAprobacionTema(tema);
	}

	@Override
	public void crearSolicitudCambioDeTitulo(String idUsuario,
											String comentario,
											Integer temaId){
		UsuarioDto usuarioDto = usuarioService.findByCognitoId(idUsuario);
		Integer idUsuarioCreador = usuarioDto.getId();
		crearSolicitudTemaCoordinador(
				temaRepository.findById(temaId)
						.orElseThrow(() -> new EntityNotFoundException("Tema no encontrado con ID: " + temaId)),
				idUsuarioCreador,
				comentario,
				"Solicitud de cambio de título"
		);
	}

	@Override
	public void crearSolicitudCambioDeResumen(String idUsuario,
											String comentario,
											Integer temaId){
		UsuarioDto usuarioDto = usuarioService.findByCognitoId(idUsuario);
		Integer idUsuarioCreador = usuarioDto.getId();
		crearSolicitudTemaCoordinador(
				temaRepository.findById(temaId)
						.orElseThrow(() -> new EntityNotFoundException("Tema no encontrado con ID: " + temaId)),
				idUsuarioCreador,
				comentario,
				"Solicitud de cambio de resumen"
		);
	}

	private void crearSolicitudTemaCoordinador(Tema tema, 
											Integer idUsuarioCreador, 
											String comentario,
											String tipoSolicitudNombre) {
		//Validar que el usuario es el coordinador de la carrera
		
		// 1) Obtener el tipo de solicitud
		TipoSolicitud tipoSolicitud = tipoSolicitudRepository
				.findByNombre(tipoSolicitudNombre)
				.orElseThrow(() -> new RuntimeException(
						"Tipo de solicitud no configurado: " + tipoSolicitudNombre));

		EstadoSolicitud estadoSolicitud = estadoSolicitudRepository
                .findByNombre(EstadoSolicitudEnum.PENDIENTE.name())
                .orElseThrow(() -> new RuntimeException("Estado de solicitud no encontrado"));

		// 2) Construir y guardar la solicitud
		Solicitud solicitud = new Solicitud();
		solicitud.setDescripcion(comentario != null ? comentario : tipoSolicitudNombre);
		solicitud.setTipoSolicitud(tipoSolicitud);
		solicitud.setTema(tema);
		//solicitud.setEstado(0); // Ajusta según tu convención (p.ej. 0 = PENDIENTE)
		solicitud.setEstadoSolicitud(estadoSolicitud);
		Solicitud savedSolicitud = solicitudRepository.save(solicitud);

		RolSolicitud rolRemitente = rolSolicitudRepository
                .findByNombre(RolSolicitudEnum.REMITENTE.name()).
				orElseThrow(() -> new RuntimeException("Rol destinatario no encontrado"));
		AccionSolicitud accionPendiente = accionSolicitudRepository
                .findByNombre(AccionSolicitudEnum.PENDIENTE_ACCION.name())
                .orElseThrow(() -> new RuntimeException("Accion pendiente_aprobacion no encontrado"));

		// 3) Crear la relación UsuarioXSolicitud
		Usuario usuario = usuarioRepository.findById(idUsuarioCreador)
				.orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + idUsuarioCreador));
		UsuarioXSolicitud usuarioXSolicitud = new UsuarioXSolicitud();
		usuarioXSolicitud.setUsuario(usuario);
		usuarioXSolicitud.setSolicitud(savedSolicitud);
		//usuarioXSolicitud.setDestinatario(false); // o false según tu lógica
		//usuarioXSolicitud.setAprobado(false);
		//usuarioXSolicitud.setSolicitudCompletada(false);
		usuarioXSolicitud.setComentario(comentario);
		usuarioXSolicitud.setRolSolicitud(rolRemitente);
		usuarioXSolicitud.setAccionSolicitud(accionPendiente);

		usuarioXSolicitudRepository.save(usuarioXSolicitud);
	}
	/**
	 * Crea una solicitud de aprobación de tema y la asigna a todos los
	 * coordinadores
	 * activos de la carrera asociada.
	 *
	 * @param tema Tema recién creado al que se asociará la solicitud.
	 */
	private void crearSolicitudAprobacionTema(Tema tema) {
		// 1) Obtener el tipo de solicitud
		TipoSolicitud tipoSolicitud = tipoSolicitudRepository
				.findByNombre("Aprobación de tema (por coordinador)")
				.orElseThrow(() -> new RuntimeException(
						"Tipo de solicitud no configurado: Aprobación de tema (por coordinador)"));

		// Estado solicitud
        EstadoSolicitud estadoSolicitud = estadoSolicitudRepository
                .findByNombre(EstadoSolicitudEnum.PENDIENTE.name())
                .orElseThrow(() -> new RuntimeException("Estado de solicitud no encontrado"));
		// 2) Construir y guardar la solicitud
		Solicitud solicitud = new Solicitud();
		solicitud.setDescripcion("Solicitud de aprobación de tema por coordinador");
		solicitud.setTipoSolicitud(tipoSolicitud);
		solicitud.setTema(tema);
		solicitud.setEstadoSolicitud(estadoSolicitud); // Ajusta según tu convención (p.ej. 0 = PENDIENTE)
		Solicitud savedSolicitud = solicitudRepository.save(solicitud);

		RolSolicitud rolDestinatario = rolSolicitudRepository
                .findByNombre(RolSolicitudEnum.DESTINATARIO.name()).
				orElseThrow(() -> new RuntimeException("Rol destinatario no encontrado"));
		AccionSolicitud accionPendiente = accionSolicitudRepository
                .findByNombre(AccionSolicitudEnum.PENDIENTE_ACCION.name())
                .orElseThrow(() -> new RuntimeException("Accion pendiente_aprobacion no encontrado"));

		// 3) Buscar los usuarios-coordinador de la carrera del tema
		List<UsuarioXSolicitud> asignaciones = usuarioCarreraRepository
				.findByCarreraIdAndActivoTrue(tema.getCarrera().getId()).stream()
				.map(rel -> rel.getUsuario())
				.filter(u -> TipoUsuarioEnum.coordinador.name().equalsIgnoreCase(u.getTipoUsuario().getNombre()))
				.map(coord -> {
					UsuarioXSolicitud us = new UsuarioXSolicitud();
					us.setUsuario(coord);
					us.setSolicitud(savedSolicitud);
					//us.setDestinatario(true);
					us.setRolSolicitud(rolDestinatario);
					//us.setAprobado(false);
					us.setAccionSolicitud(accionPendiente);
					//us.setSolicitudCompletada(false);
					return us;
				})
				.collect(Collectors.toList());

		if (asignaciones.isEmpty()) {
			throw new RuntimeException(
					"No hay coordinador activo para la carrera con id " + tema.getCarrera().getId());
		}

		// 4) Guardar todas las asignaciones de la solicitud
		usuarioXSolicitudRepository.saveAll(asignaciones);
	}

	/**
	 * Crea y persiste un vínculo UsuarioXTema para el tema dado.
	 * 
	 * @param tema      Tema al que asociar el usuario
	 * @param idUsuario ID del usuario a asociar
	 * @param rolNombre Nombre del rol (ej. "Creador", "Asesor", etc.)
	 * @param asignado  Flag si ya está asignado o pendiente
	 */
	private void saveUsuarioXTema(Tema tema,
			Integer idUsuario,
			String rolNombre,
			Boolean asignado,
			Boolean creador) {
		UsuarioDto uDto = usuarioService.findUsuarioById(idUsuario);
		if (uDto == null) {
			throw new RuntimeException("Usuario no encontrado: " + idUsuario);
		}

		Rol rol = rolRepository.findByNombre(rolNombre)
				.orElseThrow(() -> new RuntimeException("Rol '" + rolNombre + "' no encontrado"));

		UsuarioXTema ux = new UsuarioXTema();
		ux.setTema(tema);
		ux.setUsuario(UsuarioMapper.toEntity(uDto));
		ux.setRol(rol);
		ux.setAsignado(asignado);
		ux.setCreador(creador);
		ux.setActivo(true);
		ux.setFechaCreacion(OffsetDateTime.now());

		usuarioXTemaRepository.save(ux);
	}

	// Prepara la entidad Tema a partir del DTO y asigna el estado dado.
	private Tema prepareNewTema(TemaDto dto, EstadoTemaEnum estadoEnum) {
		Tema tema = TemaMapper.toEntity(dto);
		EstadoTema estado = estadoTemaRepository.findByNombre(estadoEnum.name())
				.orElseThrow(() -> new RuntimeException("EstadoTema '" + estadoEnum.name() + "' no encontrado"));
		tema.setEstadoTema(estado);
		return tema;
	}

	/**
	 * Guarda las subáreas de conocimiento asociadas al tema.
	 */
	private void saveSubAreas(Tema tema, List<SubAreaConocimientoDto> subareas) {
		if (subareas == null || subareas.isEmpty()) {
			throw new RuntimeException("No subAreaConocimiento proporcionadas");
		}
		Boolean found = false;
		for (SubAreaConocimientoDto s : subareas) {
			SubAreaConocimientoDto saDto = subAreaConocimientoService.findById(s.getId());
			if (saDto == null) {
				logger.warning("Subárea no encontrada: " + s.getId());
				continue;
			}
			found = true;
			SubAreaConocimientoXTema sat = new SubAreaConocimientoXTema();
			sat.setTemaId(tema.getId());
			sat.setSubAreaConocimientoId(s.getId());
			sat.setFechaCreacion(OffsetDateTime.now());
			subAreaConocimientoXTemaRepository.save(sat);
		}
		if (!found) {
			throw new RuntimeException("Ninguna subárea válida encontrada");
		}
	}

	private void saveUsuariosInvolucrados(Tema tema,
			Integer idUsuarioCreador,
			List<UsuarioDto> involucrados,
			String rolNombre,
			Boolean asignado,
			Boolean creador) {
		if (involucrados == null)
			return;

		Set<Integer> idsProcesados = new HashSet<>();

		for (UsuarioDto usuario : involucrados) {
			if (usuario.getId().equals(idUsuarioCreador)) {
				logger.warning("Omitiendo creador en involucrados: " + usuario.getId());
				continue;
			}
			UsuarioDto invDto = usuarioService.findUsuarioById(usuario.getId());
			if (invDto == null) {
				logger.warning("Usuario involucrado no encontrado: " + usuario.getId());
				continue;
			}
			if (idsProcesados.contains(usuario.getId())) {
				logger.warning("Usuario duplicado en involucrados: " + usuario.getId());
				continue;
			}
			saveUsuarioXTema(tema, usuario.getId(), rolNombre, asignado, creador);
			idsProcesados.add(usuario.getId());
		}
	}

	@Override
	public List<TemaDto> listarTemasPropuestosAlAsesor(String asesorId, String titulo, Integer limit, Integer offset) {
		UsuarioDto usuDto = usuarioService.findByCognitoId(asesorId);

		String sql = "SELECT * FROM listar_temas_propuestos_al_asesor(:asesorId, :titulo, :limit, :offset)";

		List<Object[]> resultados = entityManager
				.createNativeQuery(sql)
				.setParameter("asesorId", usuDto.getId())
				.setParameter("titulo", titulo != null ? titulo : "")
				.setParameter("limit", limit != null ? limit : 10)
				.setParameter("offset", offset != null ? offset : 0)
				.getResultList();
		List<TemaDto> lista = new ArrayList<>();

		for (Object[] fila : resultados) {
			TemaDto dto = new TemaDto();
			dto.setSubareas(new ArrayList<>());
			dto.setCoasesores(new ArrayList<>());
			dto.setTesistas(new ArrayList<>());

			dto.setId((Integer) fila[0]); // tema_id
			dto.setTitulo((String) fila[1]); // titulo

			// Subáreas
			Integer[] subareaArray = (Integer[]) fila[3];
			if (subareaArray != null) {
				for (Integer subareaId : subareaArray) {
					SubAreaConocimientoDto subarea = new SubAreaConocimientoDto();
					subarea.setId(subareaId);
					dto.getSubareas().add(subarea);
				}
			}

			// Resumen, metodología, etc.
			dto.setResumen((String) fila[6]);
			dto.setMetodologia((String) fila[7]);
			dto.setObjetivos((String) fila[8]);
			dto.setPortafolioUrl((String) fila[9]);
			dto.setActivo((Boolean) fila[10]);

			dto.setFechaLimite(fila[11] != null ? ((Instant) fila[11]).atOffset(ZoneOffset.UTC) : null);
			dto.setFechaCreacion(fila[12] != null ? ((Instant) fila[12]).atOffset(ZoneOffset.UTC) : null);
			dto.setFechaModificacion(fila[13] != null ? ((Instant) fila[13]).atOffset(ZoneOffset.UTC) : null);

			// Tesista creador
			Integer idCreador = (Integer) fila[14]; // id_creador
			String nombreCreador = (String) fila[15]; // nombre_creador
			if (idCreador != null) {
				UsuarioDto tesistaCreador = new UsuarioDto();
				tesistaCreador.setId(idCreador);
				tesistaCreador.setNombres(nombreCreador);
				dto.getTesistas().add(tesistaCreador); // Primer tesista: el creador
			}

			// Co-tesistas
			Integer[] idCoTesistas = (Integer[]) fila[16]; // ids_cotesistas
			String[] nombresCoTesistas = (String[]) fila[17]; // nombres_cotesistas

			if (idCoTesistas != null && nombresCoTesistas != null) {
				for (int i = 0; i < idCoTesistas.length; i++) {
					UsuarioDto cotesista = new UsuarioDto();
					cotesista.setId(idCoTesistas[i]);
					cotesista.setNombres(nombresCoTesistas[i]);
					dto.getTesistas().add(cotesista); // agregar co-tesistas
				}
			}

			lista.add(dto);
		}

		return lista;
	}

	@Override
	public List<TemaDto> listarTemasPorUsuarioRolEstado(String usuarioId,
			String rolNombre,
			String estadoNombre, Integer limit, Integer offset) {

		UsuarioDto usuDto = usuarioService.findByCognitoId(usuarioId);
		List<Object[]> rows = temaRepository.listarTemasPorUsuarioRolEstado(
				usuDto.getId(), rolNombre, estadoNombre, limit, offset);

		Map<Integer, TemaDto> dtoMap = new LinkedHashMap<>();

		for (Object[] r : rows) {
			Integer temaId = (Integer) r[0];

			TemaDto dto = dtoMap.get(temaId);
			if (dto == null) {
				dto = TemaDto.builder()
						.id((Integer) r[0])
						.codigo((String) r[1])
						.titulo((String) r[2])
						.resumen((String) r[3])
						.metodologia((String) r[4])
						.objetivos((String) r[5])
						.portafolioUrl((String) r[6])
						.activo((Boolean) r[7])
						.fechaLimite(r[8] != null
								? ((Instant) r[8]).atOffset(ZoneOffset.UTC)
								: null)
						.fechaCreacion(r[9] != null
								? ((Instant) r[9]).atOffset(ZoneOffset.UTC)
								: null)
						.fechaModificacion(r[10] != null
								? ((Instant) r[10]).atOffset(ZoneOffset.UTC)
								: null)
						.requisitos((String) r[11])
						.carrera(
								CarreraDto.builder()
										.id((Integer) r[12]) // carrera_id
										.nombre((String) r[13]) // carrera_nombre
										.build())
						.area(new ArrayList<>())
						.estadoTemaNombre(estadoNombre)
						.subareas(new ArrayList<>())
						.build();
				// Asignar el área de conocimiento al DTO
				//dto.getArea().add(areaDto);
				dtoMap.put(temaId, dto);
			}

		} 

		// Ahora convierto el map en lista y completo cantPostulaciones
		List<TemaDto> temas = new ArrayList<>(dtoMap.values());
		for (TemaDto t : temas) {
			// Llamada a la función contar_postulaciones
			System.err.println("Contando postulaciones para el tema: " + t.getId());
			Integer count = ((Number) entityManager.createNativeQuery(
					"SELECT contar_postulaciones(:temaId)")
					.setParameter("temaId", t.getId())
					.getSingleResult()).intValue();
			System.out.println("Cantidad de postulaciones para el tema " + t.getId() + ": " + count);
			t.setCantPostulaciones(count);

			List<Object[]> areasRows = entityManager.createNativeQuery(
					"SELECT * FROM listar_areas_por_tema(:temaId)")
				.setParameter("temaId", t.getId())
				.getResultList();

			// Construir DTOs de área y agregarlos al tema
			for (Object[] row : areasRows) {
				AreaConocimientoDto area = AreaConocimientoDto.builder()
					.id((Integer) row[0])     // area_conocimiento_id
					.nombre((String) row[2])  // nombre de la área
					.build();
				t.getArea().add(area);
			}
		}
		return temas;
	}

	@Override
	public List<UsuarioDto> listarUsuariosPorTemaYRol(Integer temaId, String rolNombre) {
		List<Object[]> rows = temaRepository.listarUsuariosPorTemaYRol(temaId, rolNombre);
		List<UsuarioDto> resultados = new ArrayList<>();
		for (Object[] r : rows) {
			UsuarioDto u = UsuarioDto.builder()
					.id((Integer) r[0])
					.nombres((String) r[1])
					.primerApellido((String) r[2])
					.segundoApellido((String) r[3])
					.correoElectronico((String) r[4])
					.activo((Boolean) r[5])
					.fechaCreacion(
							r[6] != null
									? ((Instant) r[6]).atOffset(ZoneOffset.UTC)
									: null)
					.asignado((Boolean) r[7]) // we identify if the asesor is assigned or not
					.rechazado((Boolean) r[8])
					.codigoPucp((String) r[9])
					.creador((Boolean) r[10])
					.comentario((String) r[11])
					.build();
			u.setRol(rolNombre);
			resultados.add(u);
		}
		return resultados;
	}

	@Override
	public List<SubAreaConocimientoDto> listarSubAreasPorTema(Integer temaId) {
		List<Object[]> rows = temaRepository.listarSubAreasPorTema(temaId);
		List<SubAreaConocimientoDto> resultados = new ArrayList<>();
		for (Object[] r : rows) {
			SubAreaConocimientoDto sa = SubAreaConocimientoDto.builder()
					.id((Integer) r[0])
					.nombre((String) r[1])
					.build();
			resultados.add(sa);
		}
		return resultados;
	}

	@Override
	public List<TemaDto> listarTemasPorUsuarioEstadoYRol(String asesorId, String rolNombre, String estadoNombre
														, Integer limit, Integer offset) {
		// primero cargo los temas con estado INSCRITO y rol Asesor
		List<TemaDto> temas = listarTemasPorUsuarioRolEstado(
				asesorId,
				rolNombre,
				estadoNombre, 
				limit, 
				offset);

		// por cada tema cargo coasesores, tesistas y subáreas
		for (TemaDto t : temas) {
			List<UsuarioDto> asesores = listarUsuariosPorTemaYRol(
					t.getId(),
					RolEnum.Asesor.name());
			// 2) Obtengo a los coasesores (o la lista base que ya tenías)
			List<UsuarioDto> coasesores = listarUsuariosPorTemaYRol(
					t.getId(),
					RolEnum.Coasesor.name());

			// 3) Combino: Asesor primero, luego coasesores, sin duplicados
			List<UsuarioDto> combinado = new ArrayList<>();
			if (!asesores.isEmpty()) {
				combinado.addAll(asesores);
			}
			for (UsuarioDto u : coasesores) {
				// evitamos volver a añadir al mismo usuario si coincide con el asesor
				if (asesores.stream().noneMatch(a -> a.getId().equals(u.getId()))) {
					combinado.add(u);
				}
			}

			t.setCoasesores(combinado);
			t.setTesistas(
					listarUsuariosPorTemaYRol(t.getId(), RolEnum.Tesista.name()));
			t.setSubareas(
					listarSubAreasPorTema(t.getId()));
		}

		return temas;
	}

	@Override
	public List<TemaDto> listarTemasPropuestosPorSubAreaConocimiento(
			List<Integer> subareaIds,
			String asesorId,
			String titulo,
			Integer limit, // Agregar parámetro para el límite
			Integer offset // Agregar parámetro para el offset
	) {

		UsuarioDto usuDto = usuarioService.findByCognitoId(asesorId);

		String sql = "SELECT * FROM listar_temas_propuestos_por_subarea_conocimiento(:subareas,:asesorId,:titulo,:limit,:offset)";
		Integer[] subareaArray = subareaIds.toArray(new Integer[0]);

		List<Object[]> resultados = entityManager
				.createNativeQuery(sql)
				.setParameter("subareas", subareaArray)
				.setParameter("asesorId", usuDto.getId())
				.setParameter("titulo", titulo)
				.setParameter("limit", limit) // Establecer parámetro limit
				.setParameter("offset", offset) // Establecer parámetro offset
				.getResultList();

		List<TemaDto> lista = new ArrayList<>();
		SubAreaConocimientoDto subareaAux = null;
		UsuarioDto usuarioAux = null;
		for (Object[] fila : resultados) {
			TemaDto dto = new TemaDto();
			List<SubAreaConocimientoDto> subareasDto = new ArrayList<>();
			List<UsuarioDto> alumnosDto = new ArrayList<>();
			dto.setId((Integer) fila[0]); // tema_id
			dto.setTitulo((String) fila[1]); // titulo

			for (Integer subareaId : (Integer[]) fila[2]) {
				subareaAux = new SubAreaConocimientoDto(); // subarea
				subareaAux.setId(subareaId);
				subareasDto.add(subareaAux); // subarea_id
			}
			for (Integer alumnoId : (Integer[]) fila[3]) {
				usuarioAux = new UsuarioDto(); // alumno
				usuarioAux.setId(alumnoId);
				alumnosDto.add(usuarioAux); // alumnos_id[]
			}
			dto.setSubareas(subareasDto); // subareas_id[]
			dto.setTesistas(alumnosDto); // alumnos_id[]
			dto.setResumen((String) fila[4]); // descripcion
			dto.setMetodologia((String) fila[5]); // metodologia
			dto.setObjetivos((String) fila[6]); // objetivo
			dto.setPortafolioUrl((String) fila[7]); // recurso
			dto.setActivo((Boolean) fila[8]); // activo
			dto.setFechaLimite(fila[9] != null ? ((Instant) fila[9]).atOffset(ZoneOffset.UTC) : null);
			dto.setFechaCreacion(fila[10] != null ? ((Instant) fila[10]).atOffset(ZoneOffset.UTC) : null);
			dto.setFechaModificacion(fila[11] != null ? ((Instant) fila[11]).atOffset(ZoneOffset.UTC) : null);
			dto.setCantPostulaciones((Integer) fila[12]);
			lista.add(dto);
		}

		return lista;
	}

	@Transactional
	public void postularAsesorTemaPropuestoGeneral(Integer alumnoId, String asesorId, Integer temaId,
			String comentario) {

		UsuarioDto usuDto = usuarioService.findByCognitoId(asesorId);

		entityManager
				.createNativeQuery("SELECT postular_asesor_a_tema(:alumnoId, :asesorId, :temaId, :comentario)")
				.setParameter("alumnoId", alumnoId)
				.setParameter("asesorId", usuDto.getId())
				.setParameter("temaId", temaId)
				.setParameter("comentario", comentario)
				.getSingleResult();
	}

	@Transactional
	public void enlazarTesistasATemaPropuestDirecta(Integer[] usuariosId, Integer temaId, String profesorId,
			String comentario) {

		UsuarioDto usuDto = usuarioService.findByCognitoId(profesorId);

		entityManager.createNativeQuery(
				"SELECT  enlazar_tesistas_tema_propuesta_directa(:usuariosId, :temaId, :profesorId, :comentario)")
				.setParameter("usuariosId", usuariosId)
				.setParameter("temaId", temaId)
				.setParameter("profesorId", usuDto.getId())
				.setParameter("comentario", comentario)
				.getSingleResult();
	}

	public void rechazarTemaPropuestaDirecta(Integer alumnoId, String comentario, Integer temaId) {
		entityManager
				.createNativeQuery("SELECT rechazar_tema(:alumnoId, :comentario, :temaId)")
				.setParameter("alumnoId", alumnoId)
				.setParameter("comentario", comentario)
				.setParameter("temaId", temaId)
				.getSingleResult();
	}

	@Override
	public List<TemaConAsesorJuradoDTO> listarTemasCicloActualXEtapaFormativa(Integer etapaFormativaId,Integer expoId) {

		List<Object[]> temas = temaRepository.listarTemasCicloActualXEtapaFormativa(etapaFormativaId,expoId);
		Map<Integer, TemaConAsesorJuradoDTO> mapaTemas = new LinkedHashMap<>();

		for (Object[] fila : temas) {
			Integer temaId = (Integer) fila[0];
			String codigo = (String) fila[1];
			String titulo = (String) fila[2];

			Integer usuarioId = (Integer) fila[3];
			String nombres = (String) fila[4];
			String apellidos = (String) fila[5];
			Integer rolId = (Integer) fila[6];
			String rolNombre = (String) fila[7];

			// Si el tema no ha sido creado aún en el mapa, se crea
			TemaConAsesorJuradoDTO dto = mapaTemas.get(temaId);
			if (dto == null) {
				dto = new TemaConAsesorJuradoDTO();
				dto.setId(temaId);
				dto.setCodigo(codigo);
				dto.setTitulo(titulo);
				dto.setUsuarios(new ArrayList<>());
				List<AreaConocimientoDto> areas = areaConocimientoService.getAllByTemaId(temaId);
				dto.setAreasConocimiento(areas);
				mapaTemas.put(temaId, dto);
			}

			// Crear el usuario y agregarlo a la lista
			UsarioRolDto usuarioDto = new UsarioRolDto();
			usuarioDto.setIdUsario(usuarioId);
			usuarioDto.setNombres(nombres);
			usuarioDto.setApellidos(apellidos);

			RolDto rolDto = new RolDto();
			rolDto.setId(rolId);
			rolDto.setNombre(rolNombre);

			usuarioDto.setRol(rolDto);

			dto.getUsuarios().add(usuarioDto);
		}

		// Convertir el mapa a lista
		List<TemaConAsesorJuradoDTO> resultado = new ArrayList<>(mapaTemas.values());
		return resultado;
	}

	public List<TemaDto> listarPropuestasPorTesista(String tesistaId) {
		String sql = "SELECT * " +
				"  FROM listar_propuestas_del_tesista_con_usuarios(:p_tesista_id)";
		Query query = entityManager.createNativeQuery(sql)
				.setParameter("p_tesista_id", tesistaId);

		@SuppressWarnings("unchecked")
		List<Object[]> rows = query.getResultList();
		List<TemaDto> proposals = new ArrayList<>(rows.size());

		for (Object[] row : rows) {
			// --- map basic columns ---
			TemaDto dto = TemaDto.builder()
					.id(((Number) row[0]).intValue()) // tema_id
					.titulo((String) row[1]) // titulo
					.resumen((String) row[4]) // descripcion
					.metodologia((String) row[5]) // metodologia
					.objetivos((String) row[6]) // objetivo
					.portafolioUrl((String) row[7]) // recurso / portafolioUrl
					.activo((Boolean) row[8]) // activo
					.build();

			// --- map timestamps (Instant → OffsetDateTime UTC) ---
			dto.setFechaLimite(toOffsetDateTime(row[9]));
			dto.setFechaCreacion(toOffsetDateTime(row[10]));
			dto.setFechaModificacion(toOffsetDateTime(row[11]));

			// --- parse and set sub-areas ---
			String subareasCsv = (String) row[2];
			Integer[] subareaIds = extractSqlIntArray(row[3]);
			dto.setSubareas(parseSubAreas(subareasCsv, subareaIds));

			dto.setEstadoTemaNombre((String) row[12]); // we set the estado tema
			// --- parse usuarios JSONB into UsuarioDto list ---
			String usuariosJson = row[13] != null ? row[13].toString() : "[]";
			List<UsuarioDto> allUsers = parseUsuariosJson(usuariosJson);

			// split into tesistas vs. co-advisors
			dto.setTesistas(filterByRole(allUsers, RolEnum.Tesista.name()));
			dto.setCoasesores(filterByRoleExcept(allUsers, RolEnum.Tesista.name()));

			// --- calculate postulaciones: count Tesista with asignado=false ---
			if (EstadoTemaEnum.PROPUESTO_GENERAL.name()
					.equals(dto.getEstadoTemaNombre())) {
				dto.setCantPostulaciones(calculatePostulaciones(allUsers));
			}

			proposals.add(dto);
		}

		return proposals;
	}

	private OffsetDateTime toOffsetDateTime(Object instantObj) {
		if (instantObj == null) {
			return null;
		}
		return ((Instant) instantObj).atOffset(ZoneOffset.UTC);
	}

	/**
	 * Extracts an Integer[] from a java.sql.Array, or returns empty array if null.
	 */
	private Integer[] extractSqlIntArray(Object sqlArrayObj) {
		if (sqlArrayObj == null) {
			return new Integer[0];
		}

		// Case 1: Already an Integer[]
		if (sqlArrayObj instanceof Integer[]) {
			return (Integer[]) sqlArrayObj;
		}

		// Case 2: A JDBC java.sql.Array
		if (sqlArrayObj instanceof java.sql.Array) {
			try {
				Object array = ((java.sql.Array) sqlArrayObj).getArray();
				if (array instanceof Integer[]) {
					return (Integer[]) array;
				}
				if (array instanceof Object[]) {
					Object[] objs = (Object[]) array;
					Integer[] result = new Integer[objs.length];
					for (int i = 0; i < objs.length; i++) {
						result[i] = objs[i] != null ? Integer.parseInt(objs[i].toString()) : null;
					}
					return result;
				}
			} catch (Exception e) {
				throw new RuntimeException("Failed to extract Integer[] from SQL Array", e);
			}
		}

		// Unsupported type
		throw new IllegalArgumentException("Unsupported array type: " + sqlArrayObj.getClass());
	}

	/**
	 * Build a list of SubAreaConocimientoDto by zipping names and IDs.
	 * Expects namesCsv like "Mining, Logistics" and a parallel array of IDs.
	 */
	private List<SubAreaConocimientoDto> parseSubAreas(String namesCsv, Integer[] ids) {
		List<SubAreaConocimientoDto> list = new ArrayList<>();
		if (namesCsv == null || ids.length == 0) {
			return list;
		}
		String[] names = namesCsv.split("\\s*,\\s*");
		for (int i = 0; i < Math.min(names.length, ids.length); i++) {
			list.add(SubAreaConocimientoDto.builder()
					.id(ids[i])
					.nombre(names[i])
					.build());
		}
		return list;
	}

	/**
	 * Parse the 'usuarios' JSONB into a list of UsuarioDto.
	 */
	private List<UsuarioDto> parseUsuariosJson(String json) {
		try {
			List<Map<String, Object>> users = objectMapper.readValue(
					json, new TypeReference<List<Map<String, Object>>>() {
					});
			List<UsuarioDto> dtos = new ArrayList<>(users.size());
			for (Map<String, Object> m : users) {
				dtos.add(UsuarioDto.builder()
						.id(((Number) m.get("usuario_id")).intValue())
						.nombres(m.get("nombre_completo") != null ? ((String) m.get("nombre_completo")).split(" ")[0]
								: null)
						.primerApellido(
								m.get("nombre_completo") != null ? ((String) m.get("nombre_completo")).split(" ")[1]
										: null)
						.rol((String) m.get("rol"))
						.rechazado((Boolean) m.get("rechazado"))
						.creador((Boolean) m.get("creador"))
						.asignado((Boolean) m.get("asignado"))
						.comentario((String) m.get("comentario"))
						.build());
			}
			return dtos;
		} catch (IOException e) {
			throw new RuntimeException("Failed to parse usuarios JSON", e);
		}
	}

	/** Returns only those users whose role equals the given roleName. */
	private List<UsuarioDto> filterByRole(List<UsuarioDto> all, String roleName) {
		List<UsuarioDto> filtered = new ArrayList<>();
		for (UsuarioDto u : all) {
			if (roleName.equals(u.getRol())) {
				filtered.add(u);
			}
		}
		return filtered;
	}

	/** Returns users whose role is _not_ the given roleName. */
	private List<UsuarioDto> filterByRoleExcept(List<UsuarioDto> all, String excludedRole) {
		List<UsuarioDto> filtered = new ArrayList<>();
		for (UsuarioDto u : all) {
			if (!excludedRole.equals(u.getRol())) {
				filtered.add(u);
			}
		}
		return filtered;
	}

	/**
	 * Calculate postulations: number of users with role Tesista and asignado=false.
	 */
	private Integer calculatePostulaciones(List<UsuarioDto> usuarios) {
		int count = 0;
		for (UsuarioDto u : usuarios) {
			if (RolEnum.Asesor.name().equals(u.getRol()) && Boolean.FALSE.equals(u.getAsignado())) {
				count++;
			}
		}
		return count;
	}

	@Override
	public List<TemaDto> listarPostulacionesAMisPropuestas(String tesistaId, Integer tipoPost) {
		String sql = "SELECT * " +
				"  FROM listar_postulaciones_del_tesista_con_usuarios(:p_tesista_id, :p_tipo_post)";
		Query query = entityManager.createNativeQuery(sql)
				.setParameter("p_tesista_id", tesistaId)
				.setParameter("p_tipo_post", tipoPost);

		@SuppressWarnings("unchecked")
		List<Object[]> rows = query.getResultList();
		List<TemaDto> proposals = new ArrayList<>(rows.size());

		for (Object[] row : rows) {
			// --- map basic columns ---
			TemaDto dto = TemaDto.builder()
					.id(((Number) row[0]).intValue()) // tema_id
					.titulo((String) row[1]) // titulo
					.resumen((String) row[4]) // descripcion
					.metodologia((String) row[5]) // metodologia
					.objetivos((String) row[6]) // objetivo
					.portafolioUrl((String) row[7]) // recurso / portafolioUrl
					.activo((Boolean) row[8]) // activo
					.build();

			// --- map timestamps (Instant → OffsetDateTime UTC) ---
			dto.setFechaLimite(toOffsetDateTime(row[9]));
			dto.setFechaCreacion(toOffsetDateTime(row[10]));
			dto.setFechaModificacion(toOffsetDateTime(row[11]));

			// --- parse and set sub-areas ---
			String subareasCsv = (String) row[2];
			Integer[] subareaIds = extractSqlIntArray(row[3]);
			dto.setSubareas(parseSubAreas(subareasCsv, subareaIds));

			dto.setEstadoTemaNombre((String) row[12]); // we set the estado tema
			// --- parse usuarios JSONB into UsuarioDto list ---
			String usuariosJson = row[13] != null ? row[13].toString() : "[]";
			List<UsuarioDto> allUsers = parseUsuariosJson(usuariosJson);

			// split into tesistas vs. co-advisors
			dto.setTesistas(filterByRole(allUsers, RolEnum.Tesista.name()));
			dto.setCoasesores(filterByRoleExcept(allUsers, RolEnum.Tesista.name()));

			if (EstadoTemaEnum.PROPUESTO_GENERAL.name()
					.equals(dto.getEstadoTemaNombre())) {
				dto.setCantPostulaciones(calculatePostulaciones(allUsers));
			}

			proposals.add(dto);
		}

		return proposals;
	}

	@Override
	public List<InfoTemaPerfilDto> listarTemasAsesorInvolucrado(Integer asesorId) {
		List<InfoTemaPerfilDto> temas = new ArrayList<>();
		List<Object[]> resultQuery = temaRepository.listarTemasAsesorInvolucrado(asesorId);

		for (Object[] t : resultQuery) {
			InfoTemaPerfilDto dto = new InfoTemaPerfilDto();
			dto.setIdTesis((Integer) t[0]);
			dto.setTitulo((String) t[1]);
			String estado = (String) t[2];
			switch (estado) {
				case "EN_PROGRESO":
					estado = "en_proceso";
					break;
				case "FINALIZADO":
					estado = "finalizada";
					break;
				default:
					estado = null;
					break;
			}
			dto.setEstado(estado);
			dto.setAnio((String) t[3]);

			// Agregar a los tesistas
			List<Object[]> resultTesistasQuery = usuarioXTemaRepository.listarTesistasTema(dto.getIdTesis());
			List<String> tesistas = new ArrayList<>();
			for (Object[] tesista : resultTesistasQuery) {
				String nombreTesista = (String) tesista[0] + " " + (String) tesista[1];
				tesistas.add(nombreTesista);
			}
			dto.setEstudiantes(String.join(" - ", tesistas));

			// Añadir el nivel

			temas.add(dto);
		}
		return temas;
	}

	@Override
	public void eliminarPostulacionesTesista(Integer idUsuario) {
		entityManager
				.createNativeQuery("SELECT eliminar_postulaciones_tesista(:uid)")
				.setParameter("uid", idUsuario)
				.getSingleResult();
	}

	@Transactional
	@Override
	public void rechazarPostulacionAPropuestaGeneral(Integer idTema, Integer idAsesor, String idTesista) {
		String sql = "SELECT rechazar_postulacion_propuesta_general_tesista(:p_tema_id, :p_asesor_id, :p_tesista_id)";

		entityManager.createNativeQuery(sql)
				.setParameter("p_tema_id", idTema)
				.setParameter("p_asesor_id", idAsesor)
				.setParameter("p_tesista_id", idTesista)
				.getSingleResult();

	}

	@Transactional
	@Override
	public void aprobarPostulacionAPropuestaGeneral(Integer idTema, Integer idAsesor, String idTesista) {
		UsuarioDto dto = usuarioService.findByCognitoId(idTesista);
		if (dto == null) {
			logger.severe("No se encontró el usuario con ID: " + idTesista);
			return;
		}

		String sql = "SELECT aprobar_postulacion_propuesta_general_tesista(:p_tema_id, :p_asesor_id, :p_tesista_id)";

		entityManager.createNativeQuery(sql)
				.setParameter("p_tema_id", idTema)
				.setParameter("p_asesor_id", idAsesor)
				.setParameter("p_tesista_id", idTesista)
				.getSingleResult();
		entityManager.flush();
		logger.info("Eliminando postulaciones a propuesta de usuario: " + idTesista + " START");
		String queryRechazo = "SELECT rechazar_postulaciones_propuesta_general_tesista(:uid)";

		entityManager.createNativeQuery(queryRechazo)
				.setParameter("uid", idTesista)
				.getSingleResult();
		logger.info("Eliminando postulaciones a propuesta de usuario: " + idTesista + " FINISH");
		logger.info("Eliminando postulaciones de usuario: " + idTesista);

		eliminarPropuestasTesista(dto.getId());
		eliminarPostulacionesTesista(dto.getId());
		entityManager.flush();

	}

	@Override
	public void updateTituloResumenTemaSolicitud(Integer idTema, String titulo, String resumen) {
		// Get the tema from the repository
		Tema tema = temaRepository.findById(idTema)
				.orElseThrow(() -> new RuntimeException("Tema no encontrado con ID: " + idTema));

		// Update the title and summary
		String oldTitulo = tema.getTitulo();
		String oldResumen = tema.getResumen();

		// Only update if there are changes
		boolean hasChanges = false;

		if (titulo != null && !titulo.isEmpty() && !titulo.equals(oldTitulo)) {
			tema.setTitulo(titulo);
			hasChanges = true;
		}

		if (resumen != null && !resumen.isEmpty() && !resumen.equals(oldResumen)) {
			tema.setResumen(resumen);
			hasChanges = true;
		}

		if (hasChanges) {
			// Save the updated tema
			temaRepository.save(tema);

			// Create a description of changes
			StringBuilder changeDescription = new StringBuilder("Actualización de ");
			if (titulo != null && !titulo.isEmpty() && !titulo.equals(oldTitulo)) {
				changeDescription.append("título");
				if (resumen != null && !resumen.isEmpty() && !resumen.equals(oldResumen)) {
					changeDescription.append(" y resumen");
				}
			} else if (resumen != null && !resumen.isEmpty() && !resumen.equals(oldResumen)) {
				changeDescription.append("resumen");
			}
			// Record the changes in the tema history
			saveHistorialTemaChange(tema, titulo, resumen, changeDescription.toString());
		}
	}

	@Override
	@Transactional
	public void updateTituloTemaSolicitud(Integer solicitudId, String titulo, String respuesta) {
		// Get the solicitud and related information
		// This would be implemented to call a procedure that updates a specific
		// usuario_solicitud
		// register for title change requests

		try {
			// Call the stored procedure that handles the solicitud and updates
			// usuario_solicitud
			entityManager
					.createNativeQuery("SELECT atender_solicitud_titulo(:solicitudId, :titulo, :respuesta)")
					.setParameter("solicitudId", solicitudId)
					.setParameter("titulo", titulo)
					.setParameter("respuesta", respuesta)
					.getSingleResult();

			// Log successful processing
			Logger.getLogger(TemaServiceImpl.class.getName()).info("Processed title change request " + solicitudId);
		} catch (Exception e) {
			Logger.getLogger(TemaServiceImpl.class.getName())
					.severe("Error processing title change request " + solicitudId + ": " + e.getMessage());
			throw new RuntimeException("Failed to process title change request", e);
		}
	}

	@Override
	@Transactional
	public void updateResumenTemaSolicitud(Integer solicitudId, String resumen, String respuesta) {
		// Get the solicitud and related information
		// This would be implemented to call a procedure that updates a specific
		// usuario_solicitud
		// register for summary change requests

		try {
			// Call the stored procedure that handles the solicitud and updates
			// usuario_solicitud
			entityManager
					.createNativeQuery("SELECT atender_solicitud_resumen(:solicitudId, :resumen, :respuesta)")
					.setParameter("solicitudId", solicitudId)
					.setParameter("resumen", resumen)
					.setParameter("respuesta", respuesta)
					.getSingleResult();

			// Log successful processing
			Logger.getLogger(TemaServiceImpl.class.getName()).info("Processed summary change request " + solicitudId);
		} catch (Exception e) {
			Logger.getLogger(TemaServiceImpl.class.getName())
					.severe("Error processing summary change request " + solicitudId + ": " + e.getMessage());
			throw new RuntimeException("Failed to process summary change request", e);
		}
	}

	@Override
	public void crearTemaLibre(TemaDto dto, String asesorId) {

		UsuarioDto usuDto = usuarioService.findByCognitoId(asesorId);

		try {
			// Obtener IDs de subáreas y coasesores
			Integer[] subareaIds = dto.getSubareas() != null
					? dto.getSubareas().stream().map(sa -> sa.getId()).toArray(Integer[]::new)
					: null;

			Integer[] coasesorIds = dto.getCoasesores() != null
					? dto.getCoasesores().stream().map(user -> user.getId()).toArray(Integer[]::new)
					: null;

			// Insertar el ID del asesor actual (usuDto) en la posición 0
			Integer[] coasesoresConAsesor = new Integer[coasesorIds.length + 1];
			coasesoresConAsesor[0] = usuDto.getId();
			System.arraycopy(coasesorIds, 0, coasesoresConAsesor, 1, coasesorIds.length);

			// Validar asesor/coasesores
			if (coasesoresConAsesor == null || coasesorIds.length < 1) {
				throw new IllegalArgumentException("Debe haber al menos un asesor (en coasesores).");
			}

			// Llamada a la función de base de datos
			entityManager.createNativeQuery(
					"SELECT crear_tema_libre(:titulo, :resumen, :metodologia, :objetivos, :carreraId, :fechaLimite, :requisitos, :subareaIds, :coasesorIds)")
					.setParameter("titulo", dto.getTitulo())
					.setParameter("resumen", dto.getResumen())
					.setParameter("metodologia", dto.getMetodologia())
					.setParameter("objetivos", dto.getObjetivos())
					.setParameter("carreraId", dto.getCarrera() != null ? dto.getCarrera().getId() : null)
					.setParameter("fechaLimite",
							dto.getFechaLimite() != null ? dto.getFechaLimite().toLocalDate() : null)
					.setParameter("requisitos", dto.getRequisitos() != null ? dto.getRequisitos() : "")
					.setParameter("subareaIds", subareaIds)
					.setParameter("coasesorIds", coasesoresConAsesor)
					.getSingleResult();

			logger.info("Tema creado exitosamente: " + dto.getTitulo());
		} catch (Exception e) {
			logger.severe("Error al crear tema: " + e.getMessage());
			throw new RuntimeException("No se pudo crear el tema", e);
		}
	}

	@Override
	public TemaDto buscarTemaPorId(Integer idTema) throws SQLException {
		String sql = "SELECT * FROM buscar_tema_por_id(:idTema)";

		Object[] result = (Object[]) entityManager
				.createNativeQuery(sql)
				.setParameter("idTema", idTema)
				.getSingleResult();

		TemaDto dto = new TemaDto();
		dto.setId(idTema);
		dto.setCodigo((String) result[0]);
		dto.setTitulo((String) result[1]);
		dto.setResumen((String) result[2]);
		dto.setMetodologia((String) result[3]);
		dto.setObjetivos((String) result[4]);
		java.sql.Date sqlDate = (java.sql.Date) result[5]; // fecha_limite
		if (sqlDate != null) {
			LocalDate localDate = sqlDate.toLocalDate();
			OffsetDateTime offsetDateTime = localDate.atStartOfDay(ZoneOffset.UTC).toOffsetDateTime();
			dto.setFechaLimite(offsetDateTime);
		} else {
			dto.setFechaLimite(null);
		}
		dto.setRequisitos((String) result[6]);
		dto.setEstadoTemaNombre((String) result[12]);

		// Asegurar listas no sean null
		if (dto.getSubareas() == null) {
			dto.setSubareas(new ArrayList<>());
		}
		if (dto.getCoasesores() == null) {
			dto.setCoasesores(new ArrayList<>());
		}
		if (dto.getCarrera() == null) {
			dto.setCarrera(new CarreraDto());
		}
		if (dto.getTesistas() == null) {
			dto.setTesistas(new ArrayList<>());
		}

		// Asesor
		Integer asesorId = (Integer) result[7];

		// Subareas
		Integer[] subareaArray = (Integer[]) result[8];
		if (subareaArray != null) {
			for (Integer subareaId : subareaArray) {
				// SubAreaConocimientoDto subarea = new SubAreaConocimientoDto();
				SubAreaConocimientoDto subarea = subAreaConocimientoService.findById(subareaId);
				dto.getSubareas().add(subarea);
			}
		}

		// Coasesores
		Integer[] coasesoresArray = (Integer[]) result[9];

		// Lista final coasesores con asesor primero
		if (asesorId != null) {
			UsuarioDto asesorDto = usuarioService.findUsuarioById(asesorId);
			asesorDto.setId(asesorId);
			dto.getCoasesores().add(asesorDto);
		}
		if (coasesoresArray != null) {
			for (Integer coasesorId : coasesoresArray) {
				UsuarioDto coasesorDto = usuarioService.findUsuarioById(coasesorId);
				coasesorDto.setId(coasesorId);
				dto.getCoasesores().add(coasesorDto);
			}
		}
		Integer carreraId = (Integer) result[10];
		if (carreraId != null) {
			CarreraDto carreraDTO = carreraServiceImpl.findById(carreraId);
			dto.setCarrera(carreraDTO);
		}

		// Tesistas
		Integer[] tesistasArray = (Integer[]) result[11];
		if (tesistasArray != null) {
			for (Integer tesistaId : tesistasArray) {
				UsuarioDto tesistaDto = usuarioService.findUsuarioById(tesistaId);
				tesistaDto.setId(tesistaId);
				dto.getTesistas().add(tesistaDto);
			}
		}

		return dto;
	}

	@Override
	public List<TemaDto> listarTemasLibres(String titulo, Integer limit, Integer offset, String usuarioId, Boolean myOwn) {
		if (myOwn == null) {
			myOwn = false; // Default to false if not specified
		}

		@SuppressWarnings("unchecked")
		List<Object[]> resultados = new ArrayList<>();
		
		if (myOwn){
			String sql = "SELECT * FROM listar_temas_libres_postulados_alumno(:usuarioId)";
			
			resultados = entityManager
					.createNativeQuery(sql)
					.setParameter("usuarioId", usuarioId)
					.getResultList();
		}
		else{
			String sql = "SELECT * FROM listar_temas_libres_con_usuarios(:titulo, :limit, :offset, :usuarioId)";

			resultados = entityManager
					.createNativeQuery(sql)
					.setParameter("titulo",  titulo  != null ? titulo  : "")
					.setParameter("limit",   limit   != null ? limit   : 10)
					.setParameter("offset",  offset  != null ? offset  : 0)
					.setParameter("usuarioId", usuarioId)
					.getResultList();
		}

		

		List<TemaDto> lista = new ArrayList<>();
		for (Object[] fila : resultados) {
			TemaDto dto = new TemaDto();
			dto.setSubareas(new ArrayList<>());
			dto.setCoasesores(new ArrayList<>());
			dto.setTesistas(new ArrayList<>());
			dto.setArea(new ArrayList<>());
			// 0: tema_id
			dto.setId(((Number) fila[0]).intValue());

			// 1: codigo (si quieres guardarlo en el DTO, puedes añadir dto.setCodigo(...))
			dto.setCodigo((String) fila[1]);

			// 2: titulo
			dto.setTitulo((String) fila[2]);

			// 3: resumen
			dto.setResumen((String) fila[3]);

			// 4: metodologia
			dto.setMetodologia((String) fila[4]);

			// 5: objetivos
			dto.setObjetivos((String) fila[5]);

			// 6: requisitos
			dto.setRequisitos((String) fila[6]);

			// 7: portafolio_url
			dto.setPortafolioUrl((String) fila[7]);

			// 8, 9, 10: fechas (TIMESTAMPTZ → Instant → OffsetDateTime)
			dto.setFechaLimite(toOffsetDateTime(fila[8]));
			dto.setFechaCreacion(toOffsetDateTime(fila[9]));
			dto.setFechaModificacion(toOffsetDateTime(fila[10]));

			// 11, 12: carrera
			if (fila[11] != null && fila[12] != null) {
				CarreraDto carrera = new CarreraDto();
				carrera.setId(((Number) fila[11]).intValue());
				carrera.setNombre((String) fila[12]);
				dto.setCarrera(carrera);
			}

			// 13: subareas_ids  (java.sql.Array → Integer[])
			Integer[] subareaIds = extractSqlIntArray(fila[13]);

			// 14: subareas_nombres (String[])
			String[] subareasNombres = (String[]) fila[14];

			if (subareaIds != null && subareasNombres != null) {
				for (int i = 0; i < subareaIds.length && i < subareasNombres.length; i++) {
					SubAreaConocimientoDto subarea = new SubAreaConocimientoDto();
					subarea.setId(subareaIds[i]);
					subarea.setNombre(subareasNombres[i]);
					dto.getSubareas().add(subarea);
				}
			}

			// 15: usuarios JSONB  → String con JSON
			String usuariosJsonStr = fila[15] != null ? fila[15].toString() : "[]";
			List<UsuarioDto> allUsers = parseUsuariosJson(usuariosJsonStr);

			dto.setCoasesores(filterByRoleExcept(allUsers, RolEnum.Tesista.name()));

			dto.setTesistas(filterByRole(allUsers, RolEnum.Tesista.name()));

			// 16: estado_tema_nombre
			dto.setEstadoTemaNombre((String) fila[16]);

			// 17, 18: área / subárea_principal
			if (fila[17] != null && fila[18] != null) {
				AreaConocimientoDto areaDto = new AreaConocimientoDto();
				areaDto.setId(((Number) fila[17]).intValue());
				areaDto.setNombre((String) fila[18]);
				dto.getArea().add(areaDto);
			}

			dto.setCantPostulaciones((Integer) fila[19]);

			lista.add(dto);
		}

		return lista;
	}

	@Override
	@Transactional
	public List<TemaDto> listarTemasPorEstadoYCarrera(String estadoNombre,
													 Integer carreraId,
													 Integer limit,
													 Integer offset) {
		String sql = "SELECT * FROM listar_temas_por_estado_y_carrera(:estado, :carreraId, :limit, :offset)";
		@SuppressWarnings("unchecked")
		List<Object[]> rows = entityManager.createNativeQuery(sql)
				.setParameter("estado", estadoNombre)
				.setParameter("carreraId", carreraId)
				.setParameter("limit", limit)
				.setParameter("offset", offset)
				.getResultList();

		Map<Integer, TemaDto> dtoMap = new LinkedHashMap<>();

		for (Object[] r : rows) {
			int temaId = ((Number) r[0]).intValue();

			TemaDto dto = dtoMap.get(temaId);
			if (dto == null) {
				dto = TemaDto.builder()
						.id(((Number) r[0]).intValue())
						.codigo((String) r[1])
						.titulo((String) r[2])
						.resumen((String) r[3])
						.metodologia((String) r[4])
						.objetivos((String) r[5])
						.portafolioUrl((String) r[6])
						.requisitos((String) r[7])
						.estadoTemaNombre((String) r[8])
						.fechaLimite(toOffsetDateTime(r[9]))
						.fechaCreacion(toOffsetDateTime(r[10]))
						.fechaModificacion(toOffsetDateTime(r[11]))
						.carrera(
								CarreraDto.builder()
										.id(((Number) r[12]).intValue())
										.nombre((String) r[13])
										.build())
						.area(new ArrayList<>())
						.subareas(new ArrayList<>())
						.build();

				dtoMap.put(temaId, dto);
			}

			//dto.getArea().add(areaDto);
		}

		List<TemaDto> resultados = new ArrayList<>(dtoMap.values());

		// por cada tema cargo coasesores, tesistas y subáreas
		for (TemaDto t : resultados) {
			List<UsuarioDto> asesores = listarUsuariosPorTemaYRol(
					t.getId(),
					RolEnum.Asesor.name());
			// 2) Obtengo a los coasesores (o la lista base que ya tenías)
			List<UsuarioDto> coasesores = listarUsuariosPorTemaYRol(
					t.getId(),
					RolEnum.Coasesor.name());

			// 3) Combino: Asesor primero, luego coasesores, sin duplicados
			List<UsuarioDto> combinado = new ArrayList<>();
			if (!asesores.isEmpty()) {
				combinado.addAll(asesores);
			}
			for (UsuarioDto u : coasesores) {
				// evitamos volver a añadir al mismo usuario si coincide con el asesor
				if (asesores.stream().noneMatch(a -> a.getId().equals(u.getId()))) {
					combinado.add(u);
				}
			}

			List<Object[]> subareasRows = entityManager.createNativeQuery(
					"SELECT * FROM listar_subareas_por_tema(:temaId)")
					.setParameter("temaId", t.getId())
					.getResultList();

			// Construir subáreas
			for (Object[] row : subareasRows) {
				SubAreaConocimientoDto subArea = SubAreaConocimientoDto.builder()
						.id((Integer) row[0])      // sub_area_id
						.nombre((String) row[1])   // sub_area_nombre
						.build();
				t.getSubareas().add(subArea);
			}

			List<Object[]> areasRows = entityManager.createNativeQuery(
					"SELECT * FROM listar_areas_por_tema(:temaId)")
				.setParameter("temaId", t.getId())
				.getResultList();

			// Construir DTOs de área y agregarlos al tema
			for (Object[] row : areasRows) {
				AreaConocimientoDto area = AreaConocimientoDto.builder()
					.id((Integer) row[0])     // area_conocimiento_id
					.nombre((String) row[2])  // nombre de la área
					.build();
				t.getArea().add(area);
			}

			t.setCoasesores(combinado);
			t.setTesistas(
					listarUsuariosPorTemaYRol(t.getId(), RolEnum.Tesista.name()));
			t.setSubareas(
					listarSubAreasPorTema(t.getId()));
		}

		return resultados;
	}

	private void validarCoordinadorYEstado(
			Integer temaId,
			String nuevoEstadoNombre,
			Integer usuarioId) {
		validarTipoUsurio(usuarioId, TipoUsuarioEnum.coordinador.name());
		estadoTemaRepository.findByNombre(nuevoEstadoNombre)
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND,
						"EstadoTema '" + nuevoEstadoNombre + "' no existe"));
		//validarEstadoTema(temaId, EstadoTemaEnum.INSCRITO.name());
	}

	private Tema actualizarTemaYHistorial(
			Integer temaId,
			String nuevoEstadoNombre,
			String comentario) {
		Tema tema = temaRepository.findById(temaId)
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND,
						"Tema con id " + temaId + " no encontrado"));
		temaRepository.actualizarEstadoTema(temaId, nuevoEstadoNombre);
		saveHistorialTemaChange(
				tema,
				tema.getTitulo(),
				tema.getResumen(),
				comentario == null ? "" : comentario);
		return tema;
	}

	private Solicitud cargarSolicitud(Integer temaId) {
		return solicitudRepository
				.findByTipoSolicitudNombreAndTemaIdAndActivoTrue(
						"Aprobación de tema (por coordinador)",
						temaId)
				.orElseThrow(() -> new RuntimeException(
						"No existe solicitud de aprobación para el tema " + temaId));
	}

	private UsuarioXSolicitud actualizarUsuarioXSolicitud(
			Integer solicitudId,
			Integer usuarioId,
			String nuevoEstadoNombre,
			String comentario) {
		UsuarioXSolicitud uxs = usuarioXSolicitudRepository
				.findFirstBySolicitudIdAndUsuarioIdAndActivoTrue(solicitudId, usuarioId)
				.orElseThrow(() -> new RuntimeException(
						"No hay registro en usuario_solicitud para la solicitud "
								+ solicitudId + " y usuario " + usuarioId));

		RolSolicitud rolDestinatario = rolSolicitudRepository
		.findByNombre(RolSolicitudEnum.DESTINATARIO.name()).
		orElseThrow(() -> new RuntimeException("Rol destinatario no encontrado"));
		// AccionSolicitud accionPendiente = accionSolicitudRepository
		// .findByNombre(AccionSolicitudEnum.PENDIENTE_ACCION.name())
		// .orElseThrow(() -> new RuntimeException("Accion pendiente_aprobacion no encontrado"));
		AccionSolicitud accionAprobado = accionSolicitudRepository
		.findByNombre(AccionSolicitudEnum.APROBADO.name())
		.orElseThrow(() -> new RuntimeException("Accion APROBADO no encontrado"));
		AccionSolicitud accionRechazado = accionSolicitudRepository
		.findByNombre(AccionSolicitudEnum.RECHAZADO.name())
		.orElseThrow(() -> new RuntimeException("Accion RECHAZADO no encontrado"));

		uxs.setComentario(comentario);
		switch (nuevoEstadoNombre.toUpperCase()) {
			case "REGISTRADO":
				uxs.setRolSolicitud(rolDestinatario);
				uxs.setAccionSolicitud(accionAprobado);
				break;
			case "RECHAZADO":
				uxs.setRolSolicitud(rolDestinatario);
				uxs.setAccionSolicitud(accionRechazado);
				break;
			case "OBSERVADO":
				uxs.setRolSolicitud(rolDestinatario);
				uxs.setAccionSolicitud(accionRechazado);
				break;
			default:
				// opcional
		}
		uxs.setFechaModificacion(OffsetDateTime.now());
		return usuarioXSolicitudRepository.save(uxs);
	}

	private void actualizarSolicitud(
			Solicitud solicitud,
			String nuevoEstadoNombre,
			String comentario) {
		switch (nuevoEstadoNombre.toUpperCase()) {
			case "REGISTRADO":
				EstadoSolicitud estadoSolicitud = estadoSolicitudRepository
						.findByNombre(EstadoSolicitudEnum.ACEPTADA.name())
						.orElseThrow(() -> new RuntimeException("Estado de solicitud no encontrado"));
				solicitud.setEstadoSolicitud(estadoSolicitud);
				break;
			case "RECHAZADO":
				EstadoSolicitud estadoSolicitudR = estadoSolicitudRepository
						.findByNombre(EstadoSolicitudEnum.RECHAZADA.name())
						.orElseThrow(() -> new RuntimeException("Estado de solicitud no encontrado"));
				solicitud.setEstadoSolicitud(estadoSolicitudR);
				break;
			case "OBSERVADO":
				EstadoSolicitud estadoSolicitudO = estadoSolicitudRepository
						.findByNombre(EstadoSolicitudEnum.PENDIENTE.name())
						.orElseThrow(() -> new RuntimeException("Estado de solicitud no encontrado"));
				solicitud.setEstadoSolicitud(estadoSolicitudO);
				break;
			default:
				// opcional
		}
		
		solicitud.setRespuesta(comentario);
		solicitud.setFechaModificacion(OffsetDateTime.now());
		solicitudRepository.save(solicitud);
	}

	/**
	 * Recupera el tema y valida que su estado actual coincida con el esperado.
	 *
	 * @param temaId         Id del tema
	 * @param estadoEsperado Nombre del estado que debe tener el tema (p.ej.
	 *                       "INSCRITO")
	 * @return tema La entidad Tema ya validada
	 * @throws ResponseStatusException 404 si no existe el tema, 400 si no está en
	 *                                 el estado esperado
	 */
	private Tema validarEstadoTema(Integer temaId, String estadoEsperado) {
		Tema tema = temaRepository.findById(temaId)
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND,
						"Tema con id " + temaId + " no encontrado"));
		String estadoActual = tema.getEstadoTema().getNombre();
		if (!estadoEsperado.equalsIgnoreCase(estadoActual)) {
			throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST,
					"Operación inválida: el tema debe estar en estado '" + estadoEsperado +
							"', pero está en '" + estadoActual + "'");
		}
		return tema;
	}

	@Transactional
	@Override
	public void cambiarEstadoTemaCoordinador(
			Integer temaId,
			String nuevoEstadoNombre,
			String coordinadorId,
			String comentario) {

		UsuarioDto usuDto = usuarioService.findByCognitoId(coordinadorId);
		Integer usuarioId = usuDto.getId();
		validarCoordinadorYEstado(temaId, nuevoEstadoNombre, usuarioId);

		actualizarTemaYHistorial(temaId, nuevoEstadoNombre, comentario);

		Solicitud solicitud = cargarSolicitud(temaId);

		actualizarUsuarioXSolicitud(
				solicitud.getId(),
				usuarioId,
				nuevoEstadoNombre,
				comentario);

		actualizarSolicitud(solicitud, nuevoEstadoNombre, comentario);
		if (EstadoTemaEnum.RECHAZADO.name().equalsIgnoreCase(nuevoEstadoNombre)) {
			desasignarUsuariosDeTema(temaId);
		}
	}

	private void desasignarUsuariosDeTema(Integer temaId) {
		List<UsuarioXTema> lista = usuarioXTemaRepository
				.findByTemaIdAndActivoTrue(temaId); // ajusta el finder según tu repo

		for (UsuarioXTema uxt : lista) {
			uxt.setAsignado(false);
			uxt.setFechaModificacion(OffsetDateTime.now());
		}
		usuarioXTemaRepository.saveAll(lista);
	}

	@Override
	public List<ExposicionTemaMiembrosDto> listarExposicionXTemaId(Integer temaId) {
		List<ExposicionTemaMiembrosDto> resultado = new ArrayList<>();
		List<ExposicionXTema> exposicionXTemas = exposicionXTemaRepository.findByTemaIdAndActivoTrue(temaId);

		for (ExposicionXTema exposicionXTema : exposicionXTemas) {
			Exposicion exposicion = exposicionXTema.getExposicion();

			// Obtener TODAS las jornadas activas para esta exposición
			List<JornadaExposicion> jornadas = jornadaExposicionRepository
					.findByExposicionIdAndActivoTrue(exposicion.getId());

			for (JornadaExposicion jornada : jornadas) {
				OffsetDateTime datetimeInicio = jornada.getDatetimeInicio();

				// Obtener la sala de la jornada
				List<JornadaExposicionXSalaExposicion> jornadaXSalaList = jornadaExposicionXSalaExposicionRepository
						.findByJornadaExposicionIdAndActivoTrue(jornada.getId());

				String salaNombre = jornadaXSalaList.stream()
						.map(j -> j.getSalaExposicion().getNombre())
						.collect(Collectors.joining(", ")); // o usar solo la primera si quieres

				// Estado planificación
				String estado = exposicion.getEstadoPlanificacion().getNombre();

				// Etapa formativa
				EtapaFormativa etapa = exposicion.getEtapaFormativaXCiclo().getEtapaFormativa();
				Integer idEtapaFormativa = etapa.getId();
				String nombreEtapaFormativa = etapa.getNombre();

				// Miembros del tema
				List<UsuarioXTema> usuarioTemas = usuarioTemaRepository.findByTemaIdAndActivoTrue(temaId);
				List<MiembroExposicionDto> miembros = usuarioTemas.stream().map(ut -> {
					MiembroExposicionDto miembro = new MiembroExposicionDto();
					miembro.setId_persona(ut.getUsuario().getId());
					miembro.setNombre(ut.getUsuario().getNombres());
					miembro.setTipo(ut.getRol().getNombre());
					return miembro;
				}).toList();

				// Crear DTO
				ExposicionTemaMiembrosDto dto = new ExposicionTemaMiembrosDto();
				dto.setId_exposicion(exposicion.getId());
				dto.setFechahora(datetimeInicio);
				dto.setSala(salaNombre);
				dto.setEstado(estado);
				dto.setId_etapa_formativa(idEtapaFormativa);
				dto.setNombre_etapa_formativa(nombreEtapaFormativa);
				dto.setTitulo(""); // Puedes completar esto si tienes el título
				dto.setMiembros(miembros);

				resultado.add(dto);
			}
		}

		return resultado;
	}

	@Transactional
	public void eliminarTemaCoordinador(Integer temaId, String coordinadorId) {
		// 1) Validación EXTERNA al procedure:
		// Comprueba que usuarioId sea coordinador
		UsuarioDto usuDto = usuarioService.findByCognitoId(coordinadorId);
		Integer usuarioId = usuDto.getId();
		validarTipoUsurio(usuarioId, TipoUsuarioEnum.coordinador.name());

		// 2) Obtener la carrera del tema y validar que el usuario esté activo en esa
		// carrera
		Tema tema = temaRepository.findById(temaId)
				.orElseThrow(() -> new EntityNotFoundException("Tema no encontrado: " + temaId));
		Integer carreraId = tema.getCarrera().getId();

		boolean pertenece = usuarioCarreraRepository
				.existsByUsuarioIdAndCarreraIdAndActivo(usuarioId, carreraId, true);
		if (!pertenece) {
			throw new AccessDeniedException(
					"El usuario no pertenece a la carrera del tema: " + carreraId);
		}
		// 3) Llamas al procedure puro, que sólo hace los UPDATEs
		temaRepository.desactivarTemaYDesasignarUsuarios(temaId);
	}

	@Override
	public TemaConAsesorDto obtenerTemaActivoPorAlumno(Integer idAlumno) {
		try {
			// Ejecutar la función que devuelve el tema actual y el ID del asesor
			Object[] result = (Object[]) entityManager
					.createNativeQuery("SELECT * FROM obtener_temas_por_alumno(:idAlumno)")
					.setParameter("idAlumno", idAlumno)
					.getSingleResult();

			// Mapear a TemaActual
			TemaResumenDto tema = new TemaResumenDto();
			tema.setId((Integer) result[0]);
			tema.setTitulo((String) result[1]);
			tema.setAreas((String) result[3]);

			// Obtener el perfil del asesor
			Integer idAsesor = (Integer) result[4];
			PerfilAsesorDto asesorDto = usuarioService.getPerfilAsesor(idAsesor);

			// Retornar combinado en TemaConAsesorDto
			TemaConAsesorDto respuesta = new TemaConAsesorDto();
			respuesta.setTemaActual(tema);
			respuesta.setAsesorActual(asesorDto);

			return respuesta;

		} catch (NoResultException e) {
			// Si el alumno no tiene tema activo, retornar null o manejarlo con una
			// excepción custom
			return null;
		}
	}

	@Transactional
	public void postularTemaLibre(Integer temaId, String tesistaId, String comentario) {
		try {
			// Call the PostgreSQL function to handle the postulation
			entityManager.createNativeQuery("SELECT postular_tesista_tema_libre(:temaId, :tesistaId, :comentario)")
					.setParameter("temaId", temaId)
					.setParameter("tesistaId", tesistaId)
					.setParameter("comentario", comentario)
					.getSingleResult();
			
			logger.info("Tesista " + tesistaId + " successfully applied to tema libre " + temaId);
		} catch (Exception e) {
			logger.severe("Error applying tesista " + tesistaId + " to tema libre " + temaId + ": " + e.getMessage());
			throw new RuntimeException("No se pudo postular al tema libre", e);
		}
	}

	private void validarRolAsignadoAtema(Integer usuarioId, Integer temaId, String rolNombre) {
		boolean esAsesor = usuarioXTemaRepository
			.verificarUsuarioRolEnTema(
				usuarioId,
				temaId,
				rolNombre
			);

		if (!esAsesor) {
			throw new ResponseStatusException(
				HttpStatus.FORBIDDEN,
				"El usuario con ID " + usuarioId + " no es " + rolNombre +" del tema con ID " + temaId
			);
		}
	}

	@Override
	@Transactional
	public void inscribirTemaPreinscrito(Integer temaId, String idUsuario){
		// Validar que el usuario sea coordinador
		UsuarioDto usuDto = usuarioService.findByCognitoId(idUsuario);

		validarRolAsignadoAtema(usuDto.getId(), temaId, RolEnum.Asesor.name());
		// Validar que el tema esté en estado PREINSCRITO
		Tema tema = validarEstadoTema(temaId, EstadoTemaEnum.PREINSCRITO.name());

		TemaDto dto = null;
		try {
			dto = buscarTemaPorId(temaId);
		} catch (SQLException e) {
			throw new RuntimeException("Error al buscar el tema por ID: " + temaId, e);
		}

		// Actualizar el estado del tema a INSCRITO
		temaRepository.actualizarEstadoTema(temaId, EstadoTemaEnum.INSCRITO.name());

		for (UsuarioDto u : dto.getTesistas()) {
			System.out.println("Eliminando postulaciones de usuario: " + u.getId());
			eliminarPostulacionesTesista(u.getId());
			eliminarPropuestasTesista(u.getId());
		}

		// Guardar el historial del cambio de estado
		saveHistorialTemaChange(
				tema,
				tema.getTitulo(),
				tema.getResumen(),
				"Inscripción de tema por Asesor");
		crearSolicitudAprobacionTema(tema);
	}

	@Override
	public List<TemaDto> listarPostuladosTemaLibre(
			String busqueda,
			String estado,
			LocalDate fechaLimite,
			Integer limit,
			Integer offset,
			String usuarioId
	){
		UsuarioDto usuDto = usuarioService.findByCognitoId(usuarioId);

		String sql = "SELECT * FROM listar_postulaciones_alumnos_tema_libre(:asesorId, :busqueda, :estado, :fechaLimite, :limit, :offset)";

		@SuppressWarnings("unchecked")
		List<Object[]> resultados = entityManager
				.createNativeQuery(sql)
				.setParameter("asesorId", usuDto.getId())
				.setParameter("busqueda", busqueda != null ? busqueda : "")
				.setParameter("estado", estado != null ? estado : "")
				.setParameter("fechaLimite", fechaLimite != null ? java.sql.Date.valueOf(fechaLimite) : null)
				.setParameter("limit", limit != null ? limit : 10)
				.setParameter("offset", offset != null ? offset : 0)
				.getResultList();


		List<TemaDto> lista = new ArrayList<>();

		for (Object[] fila : resultados) {
			TemaDto dto = new TemaDto();

			dto=findById((Integer) fila[0]);

			dto.setTitulo((String) fila[1]);

			// Crear UsuarioDto para el tesista
			dto.setTesistas(new ArrayList<>());
			dto.setSubareas(new ArrayList<>());
			int tesistaId = (Integer) fila[5];
			UsuarioDto tesista = usuarioService.findUsuarioById(tesistaId);
			tesista.setComentario((String) fila[3]);
			dto.getTesistas().add(tesista);

			dto.setEstadoUsuarioTema((String) fila[6]);

			dto.setTesistas(Collections.singletonList(tesista));

			dto.setFechaLimite(fila[7] != null
					? ((java.sql.Date) fila[7]).toLocalDate().atStartOfDay().atOffset(ZoneOffset.UTC)
					: null);

			Integer[] subareaArray = (Integer[]) fila[8];
			if (subareaArray != null) {
				for (Integer subareaId : subareaArray) {

					dto.getSubareas().add(subAreaConocimientoService.findById(subareaId));
				}
			}

			//    (a) Traer la lista de asesores asignados al tema
			List<UsuarioDto> asesores = listarUsuariosPorTemaYRol(dto.getId(), RolEnum.Asesor.name());

			//    (b) Traer la lista de coasesores asignados al tema
			List<UsuarioDto> coasesoresDirectos = listarUsuariosPorTemaYRol(dto.getId(), RolEnum.Coasesor.name());

			//    (c) Combinar: primero el (o los) asesor(es), luego los coasesores sin duplicados
			List<UsuarioDto> combinado = new ArrayList<>();
			if (!asesores.isEmpty()) {
				combinado.addAll(asesores);
			}
			for (UsuarioDto u : coasesoresDirectos) {
				boolean yaAgregado = asesores.stream().anyMatch(a -> a.getId().equals(u.getId()));
				if (!yaAgregado) {
					combinado.add(u);
				}
			}
			dto.setCoasesores(combinado);

			lista.add(dto);
		}

		return lista;
	}



	@Transactional
	public void aceptarPostulacionAlumno(Integer temaId, Integer idTesista, String idAsesor, String comentario) {
		// 1) Validar que quien llama sea el asesor asignado al tema
		UsuarioDto usuDto = usuarioService.findByCognitoId(idAsesor);

		// 2) Validar que el tema esté en el estado correcto para aceptar postulaciones
		Tema tema = validarEstadoTema(temaId, EstadoTemaEnum.PROPUESTO_LIBRE.name());

		boolean yaAsignado = usuarioXTemaRepository
				.existsByUsuarioIdAndRolNombreAndActivoTrueAndAsignadoTrue(
						idTesista,
						"Tesista" // o el nombre exacto de tu rol
				);
		if (yaAsignado) {
			throw new CustomException(
					"El tesista con id " + idTesista + " ya tiene un tema asignado");
		}

		// 3) Buscar el registro de UsuarioXTema para ese tesista y tema
		UsuarioXTema usuarioXTema = usuarioXTemaRepository
				.findByTemaIdAndUsuarioIdAndActivoTrue(temaId, idTesista)
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND,
						"No existe postulación de ese tesista al tema " + temaId
				));

		// 4) Obtener el Rol “Tesista” desde la tabla de roles
		Rol rolTesista = rolRepository.findByNombre(RolEnum.Tesista.name())
				.orElseThrow(() -> new RuntimeException("Rol 'Tesista' no encontrado"));

		// 5) Actualizar el registro: asignado = true, cambiar el rol a Tesista
		usuarioXTema.setAsignado(true);
		usuarioXTema.setRol(rolTesista);
		usuarioXTema.setFechaModificacion(OffsetDateTime.now());

		usuarioXTemaRepository.save(usuarioXTema);

		List<UsuarioXTema> asesores = usuarioXTemaRepository
					.findByTemaIdAndRolNombreAndActivoTrue(temaId, RolEnum.Asesor.name());
		if (asesores.isEmpty()) {
			throw new RuntimeException("No se encontró registro de Asesor para el tema " + temaId);
		}
		UsuarioXTema registroAsesor = asesores.get(0);
		registroAsesor.setAsignado(true);
		registroAsesor.setFechaModificacion(OffsetDateTime.now());
		usuarioXTemaRepository.save(registroAsesor);

		// 7) Marcar a TODOS los coasesores como asignados = true
		List<UsuarioXTema> registrosCoasesores = usuarioXTemaRepository
				.findByTemaIdAndRolNombreAndActivoTrue(temaId, RolEnum.Coasesor.name());
		OffsetDateTime ahora = OffsetDateTime.now();
		for (UsuarioXTema coase : registrosCoasesores) {
			coase.setAsignado(true);
			coase.setFechaModificacion(ahora);
		}
		usuarioXTemaRepository.saveAll(registrosCoasesores);


		temaRepository.actualizarEstadoTema(temaId, EstadoTemaEnum.INSCRITO.name());
		saveHistorialTemaChange(tema, tema.getTitulo(), tema.getResumen(), comentario != null ? comentario : "Aceptación de postulante");

		// 6) (Opcional) Eliminar postulaciones previas de ese alumno a otros temas
		eliminarPostulacionesTesista(idTesista);
		eliminarPropuestasTesista(idTesista);

		// 7) Desactivar todas las demás postulaciones (asignado = false) de este mismo tema
		eliminarPostulacionesTema(temaId);
	}


	private void eliminarPostulacionesTema(Integer idTema) {
		// 1) Obtener todos los registros de usuario–tema para ese tema donde asignado = false y activo = true
		List<UsuarioXTema> postulacionesPendientes = usuarioXTemaRepository
				.findByTemaIdAndAsignadoFalseAndActivoTrue(idTema);

		if (postulacionesPendientes.isEmpty()) {
			return; // no hay nada que desactivar
		}

		// 2) Marcar cada registro como inactivo
		OffsetDateTime ahora = OffsetDateTime.now();
		for (UsuarioXTema ux : postulacionesPendientes) {
			ux.setActivo(false);
			ux.setFechaModificacion(ahora);
		}

		// 3) Guardar todos los cambios en lote
		usuarioXTemaRepository.saveAll(postulacionesPendientes);
	}


	@Override
	@Transactional
	public void rechazarPostulacionAlumno(Integer temaId, Integer idTesista, String idAsesor, String comentario) {
		// 1) (Opcional) Validar que quien llama tenga permiso: p.ej. sea Asesor del tema
		UsuarioDto usuDto = usuarioService.findByCognitoId(idAsesor);
		//validarRolAsignadoAtema(usuDto.getId(), temaId, RolEnum.Asesor.name());

		// 2) Buscar el registro de UsuarioXTema correspondiente
		UsuarioXTema registro = usuarioXTemaRepository
				.findByTemaIdAndUsuarioIdAndActivoTrue(temaId, idTesista)
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND,
						"No existe postulación para el tesista " + idTesista + " en el tema " + temaId
				));

		// 3) Marcarlo como rechazado
		registro.setRechazado(true);
		registro.setFechaModificacion(OffsetDateTime.now());
		registro.setComentario(comentario != null ? comentario : "Postulación rechazada por el asesor");
		usuarioXTemaRepository.save(registro);
	}

	@Override
	public void eliminarPostulacionTemaLibre(Integer temaId, String idUsuario) {

		UsuarioDto usuDto = usuarioService.findByCognitoId(idUsuario);
		if(usuDto == null){
			throw new ResponseStatusException(
				HttpStatus.NOT_FOUND,
				"Usuario no encontrado con ID: " + idUsuario
			);
		}
		Optional<UsuarioXTema> asignacionOpt = usuarioXTemaRepository
				.findByUsuarioIdAndTemaIdAndRolIdAndActivoTrue(usuDto.getId(), temaId, 4); // Rol Tesista

		if (asignacionOpt.isEmpty()) {
			logger.severe("No se encontró una asignación de tesista para el tema con ID: " + temaId);
			throw new ResponseStatusException(
				HttpStatus.NOT_FOUND,
				"No se encontró una asignación de tesista para el tema con ID: " + temaId
			);
		} else{
			UsuarioXTema asignacion = asignacionOpt.get();
			usuarioXTemaRepository.softDeleteById(asignacion.getId());
			logger.info("Postulación eliminada para el tesista con ID: " + usuDto.getId() + " en el tema con ID: " + temaId);
		}
	}

	@Override
	public List<TemaPorAsociarDto> listarTemasPorAsociarPorCarrera(Integer carreraId) {

		List<Object[]> result = temaRepository.listarTemasPorAsociarPorCarrera(carreraId);
		List<TemaPorAsociarDto> temas = new ArrayList<>();

		for (Object[] row : result) {
			TemaPorAsociarDto dto = new TemaPorAsociarDto();
			dto.setId((Integer) row[0]); // tema_id
			dto.setCodigo((String) row[1]); // tema_codigo
			dto.setTitulo((String) row[2]); // tema_titulo
			dto.setEstadoTemaNombre((String) row[3]); // estado_tema_nombre
			CarreraLiteDto carrera = new CarreraLiteDto();
			carrera.setId(((Integer) row[4])); // carrera_id
			carrera.setNombre((String) row[5]); // carrera_nombre
			dto.setCarrera(carrera); // Set carrera
			dto.setTesistas(new ArrayList<>());
			temas.add(dto);
		}

		// por cada tema cargo coasesores, tesistas y subáreas
		for (TemaPorAsociarDto tema : temas) {
			List<UsuarioDto> tesistas = listarUsuariosPorTemaYRol(tema.getId(), RolEnum.Tesista.name());
			List<TesistaLiteDto> tesistasLite = tesistas.stream()
					.map(tesista -> {
						TesistaLiteDto lite = new TesistaLiteDto();
						lite.setId(tesista.getId());
						lite.setCodigoPucp(tesista.getCodigoPucp());
						lite.setNombres(tesista.getNombres());
						lite.setPrimerApellido(tesista.getPrimerApellido());
						lite.setSegundoApellido(tesista.getSegundoApellido());
						return lite;
					})
					.collect(Collectors.toList());
			tema.setTesistas(tesistasLite);
		}

		return temas;
	}

	public void asociarTemaACurso(Integer cursoId, Integer temaId){
		temaRepository.asociarTemaACurso(cursoId, temaId);
	}

	@Override
    @Transactional
    public List<TemaDto> listarTemasPorUsuarioTituloAreaCarreraEstadoFecha(
            String usuarioCognitoId,
            String titulo,
            Integer areaId,
            Integer carreraId,
            String estadoNombre,
            LocalDate fechaCreacionDesde,
            LocalDate fechaCreacionHasta,
            Integer limit,
            Integer offset
    ) {
        // 1) Obtener ID interno del usuario a partir del Cognito ID
        UsuarioDto usuDto = usuarioService.findByCognitoId(usuarioCognitoId);
        if (usuDto == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Usuario no encontrado con Cognito ID: " + usuarioCognitoId
            );
        }
        Integer usuarioId = usuDto.getId();

        // 2) Llamar al repositorio nativo
        List<Object[]> filas = temaRepository.listarTemasPorUsuarioTituloAreaCarreraEstadoFecha(
                usuarioId,
                (titulo != null ? titulo : ""),
                areaId,
                carreraId,
                (estadoNombre != null ? estadoNombre : ""),
                fechaCreacionDesde,
                fechaCreacionHasta,
                (limit != null ? limit : 10),
                (offset != null ? offset : 0)
        );

        // 3) Mapear cada Object[] a TemaDto
        List<TemaDto> resultados = new ArrayList<>(filas.size());
        for (Object[] row : filas) {
            TemaDto dto = TemaDto.builder()
                    .id(((Number) row[0]).intValue())         // tema_id
                    .codigo((String) row[1])                   // codigo
                    .titulo((String) row[2])                   // titulo
                    .resumen((String) row[3])                  // resumen
                    .metodologia((String) row[4])              // metodologia
                    .objetivos((String) row[5])                // objetivos
                    .portafolioUrl((String) row[6])            // portafolio_url
                    .requisitos((String) row[7])               // requisitos
                    .activo((Boolean) row[8])                  // activo
                    .build();

            // Fecha límite
            if (row[9] != null) {
                Instant instLim = (row[9] instanceof Instant)
                        ? (Instant) row[9]
                        : ((java.sql.Timestamp) row[9]).toInstant();
                dto.setFechaLimite(instLim.atOffset(ZoneOffset.UTC));
            }

            // Fecha creación
            if (row[10] != null) {
                Instant instCre = (row[10] instanceof Instant)
                        ? (Instant) row[10]
                        : ((java.sql.Timestamp) row[10]).toInstant();
                dto.setFechaCreacion(instCre.atOffset(ZoneOffset.UTC));
            }

            // Fecha modificación
            if (row[11] != null) {
                Instant instMod = (row[11] instanceof Instant)
                        ? (Instant) row[11]
                        : ((java.sql.Timestamp) row[11]).toInstant();
                dto.setFechaModificacion(instMod.atOffset(ZoneOffset.UTC));
            }

            // Carrera
            if (row[12] != null && row[13] != null) {
                CarreraDto carreraDto = new CarreraDto();
                carreraDto.setId(((Number) row[12]).intValue());
                carreraDto.setNombre((String) row[13]);
                dto.setCarrera(carreraDto);
            }

            // Áreas (IDs y nombres)
            Integer[] areaIdsArr     = (Integer[]) row[14];
            String[]  areaNombresArr = (String[])  row[15];
            List<AreaConocimientoDto> listaAreas = new ArrayList<>();
            if (areaIdsArr != null && areaNombresArr != null) {
                for (int i = 0; i < areaIdsArr.length; i++) {
                    AreaConocimientoDto a = new AreaConocimientoDto();
                    a.setId(areaIdsArr[i]);
                    a.setNombre(areaNombresArr[i]);
                    listaAreas.add(a);
                }
            }
            dto.setArea(listaAreas);

            // Subáreas (IDs y nombres)
            Integer[] subareaIdsArr     = (Integer[]) row[16];
            String[]  subareaNombresArr = (String[])   row[17];
            List<SubAreaConocimientoDto> listaSub = new ArrayList<>();
            if (subareaIdsArr != null && subareaNombresArr != null) {
                for (int i = 0; i < subareaIdsArr.length; i++) {
                    SubAreaConocimientoDto s = new SubAreaConocimientoDto();
                    s.setId(subareaIdsArr[i]);
                    s.setNombre(subareaNombresArr[i]);
                    listaSub.add(s);
                }
            }
            dto.setSubareas(listaSub);

            resultados.add(dto);
        }

        return resultados;
    }

}