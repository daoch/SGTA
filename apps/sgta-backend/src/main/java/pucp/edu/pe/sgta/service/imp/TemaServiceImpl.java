package pucp.edu.pe.sgta.service.imp;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;

import org.slf4j.LoggerFactory;
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
import pucp.edu.pe.sgta.dto.temas.TemasComprometidosDto;
import pucp.edu.pe.sgta.exception.BusinessRuleException;
import pucp.edu.pe.sgta.exception.CustomException;
import pucp.edu.pe.sgta.exception.ResourceNotFoundException;
import pucp.edu.pe.sgta.mapper.CarreraMapper;
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
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.*;
import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.function.Function;
import org.springframework.jdbc.core.JdbcTemplate;

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

	private TemaSimilarRepository temaSimilarRepository;

	private CarreraXParametroConfiguracionService carreraXParametroConfiguracionService;

	private SubAreaConocimientoXTemaRepository sactRepo;

	private SubAreaConocimientoService subAreaService;

	private final HistorialAccionService historialAccionService;

	@PersistenceContext
	private EntityManager entityManager;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired private UsuarioXCarreraRepository usuarioXCarreraRepository; // Para validar permiso del coordinador
	@Autowired private NotificacionService notificacionService;

	private static final org.slf4j.Logger log = LoggerFactory.getLogger(SolicitudServiceImpl.class);

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
			AccionSolicitudRepository accionSolicitudRepository,
			TemaSimilarRepository temaSimilarRepository,
						   CarreraXParametroConfiguracionService carreraXParametroConfiguracionService,
						   SubAreaConocimientoXTemaRepository sactRepo, SubAreaConocimientoService subAreaService, 
						   HistorialAccionService historialAccionService) {
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
		this.temaSimilarRepository = temaSimilarRepository;
		this.carreraXParametroConfiguracionService = carreraXParametroConfiguracionService;
		this.sactRepo = sactRepo;
		this.subAreaService = subAreaService;
		this.historialAccionService = historialAccionService;
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
			TemaDto dto = TemaMapper.toDto(tema);
			dto.setCoasesores(new ArrayList<>());
			dto.setTesistas(new ArrayList<>());
			listarUsuariosPorTemaYRol(dto.getId(), RolEnum.Tesista.name())
					.forEach(tesista -> dto.getTesistas().add(tesista));
			listarUsuariosPorTemaYRol(dto.getId(), RolEnum.Asesor.name())
					.forEach(tesista -> dto.getCoasesores().add(tesista));
			listarUsuariosPorTemaYRol(dto.getId(), RolEnum.Coasesor.name())
					.forEach(tesista -> dto.getCoasesores().add(tesista));
			dto.setSubareas(listarSubAreasPorTema(dto.getId())); // agregamos las subáreas
			return dto;
		}
		return null;
	}

	

	private void saveHistorialTemaChange(Tema tema, String titulo, String resumen, String description) {
		HistorialTemaDto historialTemaDto = new HistorialTemaDto();
		historialTemaDto.setId(null);
		historialTemaDto.setTitulo(titulo);
		historialTemaDto.setResumen(resumen);
		historialTemaDto.setDescripcionCambio(description);
		historialTemaDto.setEstadoTemaNombre(tema.getEstadoTema().getNombre());
		historialTemaDto.setCodigo(tema.getCodigo());
		historialTemaDto.setMetodologia(tema.getMetodologia());
		historialTemaDto.setObjetivos(tema.getObjetivos());
		historialTemaDto.setPortafolioUrl(tema.getPortafolioUrl());
		historialTemaDto.setFechaLimite(tema.getFechaLimite());
		historialTemaDto.setFechaFinalizacion(tema.getFechaFinalizacion());
		historialTemaDto.setCarrera(tema.getCarrera() != null ? CarreraMapper.toDto(tema.getCarrera()) : null);
		historialTemaDto.setProyectoId(tema.getProyecto() != null ? tema.getProyecto().getId() : null);
		historialTemaDto.setActivo(true);
		historialTemaDto.setFechaCreacion(tema.getFechaCreacion());
		historialTemaDto.setFechaModificacion(tema.getFechaModificacion());
		if (tema.getId() == null) {
			throw new RuntimeException("El tema no tiene ID asignado para crear cambio en historial.");
		}
		historialTemaDto.setTema(TemaMapper.toDto(tema));
		historialTemaDto.setFechaCreacion(OffsetDateTime.now());
		historialTemaDto.setFechaModificacion(OffsetDateTime.now());
		historialTemaDto.setActivo(true);

		// 1) Sub-áreas
        List<Integer> subIds = sactRepo.findSubAreaIdsByTemaId(tema.getId());
        String subareasSnapshot = subAreaService.findAllByIds(subIds).stream()
            .map(s -> s.getId() + "|" + s.getNombre())
            .collect(Collectors.joining(";"));
        historialTemaDto.setSubareasSnapshot(subareasSnapshot);

        // 2) Asesores/Coasesores
        List<Integer> asesorIds = usuarioTemaRepository.findAsesorIdsByTemaId(tema.getId());
        Map<Integer,UsuarioDto> mapaAses = usuarioService.findAllByIds(asesorIds).stream()
            .collect(Collectors.toMap(UsuarioDto::getId, Function.identity()));
        String asesoresSnapshot = asesorIds.stream()
            .map(id -> {
                UsuarioDto u = mapaAses.get(id);
                return id + "|" +
                       u.getNombres() + " " +
                       u.getPrimerApellido() + " " +
                       u.getSegundoApellido();
            })
            .collect(Collectors.joining(";"));
        historialTemaDto.setAsesoresSnapshot(asesoresSnapshot);

        // 3) Tesistas
        List<Integer> tesIds = usuarioTemaRepository.findTesistaIdsByTemaId(tema.getId());
        Map<Integer,UsuarioDto> mapaTes = usuarioService.findAllByIds(tesIds).stream()
            .collect(Collectors.toMap(UsuarioDto::getId, Function.identity()));
        String tesistasSnapshot = tesIds.stream()
            .map(id -> {
                UsuarioDto u = mapaTes.get(id);
                return id + "|" +
                       u.getNombres() + " " +
                       u.getPrimerApellido() + " " +
                       u.getSegundoApellido();
            })
            .collect(Collectors.joining(";"));
        historialTemaDto.setTesistasSnapshot(tesistasSnapshot);
		historialTemaService.save(historialTemaDto);
	}

	@Transactional
	@Override
	public Integer createTemaPropuesta(TemaDto dto, String idUsuarioCreador, Integer tipoPropuesta) {

		dto.setId(null);

		UsuarioDto usuarioDto = usuarioService.findByCognitoId(idUsuarioCreador);

		if (usuarioDto == null) {
			throw new RuntimeException("Usuario no encontrado con Cognito ID: " + idUsuarioCreador);
		}

		//Determine if the user has reached the limit of proposals
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


		/////////////////////////////////////////////////////////////////////////////////////////////////////
		if(!carreraXParametroConfiguracionService.assertParametroLimiteNumericoPorNombreCarrera("Limite Propuestas Alumno",carreraId,  usuarioDto.getId())){
			throw new RuntimeException("El usuario ha alcanzado el límite de propuestas permitidas.");
		}

		Tema tema = null;
		if (tipoPropuesta == 1) {
			tema = prepareNewTema(dto, EstadoTemaEnum.PROPUESTO_DIRECTO);
		} else { // only works if tipoPropuesta == 0 always (default value)
			tema = prepareNewTema(dto, EstadoTemaEnum.PROPUESTO_GENERAL);
		}
		tema.setCarrera(carrera);


		List<UsuarioXTema> temaRelations = usuarioXTemaRepository.findByUsuarioIdAndActivoTrue(usuarioDto.getId());
		for (UsuarioXTema ux : temaRelations) {
			Tema temaAux = temaRepository.findById(ux.getTema().getId())
					.orElseThrow(() -> new RuntimeException("Tema no encontrado con ID: " + ux.getTema().getId()));
			if (temaAux.getEstadoTema().getNombre().equals(EstadoTemaEnum.INSCRITO.name())) {
				throw new RuntimeException("El usuario ya tiene un tema inscrito.");
			}
		}

		//We must check the limit of proposals for each cotesista
		for (UsuarioDto cotesista : dto.getTesistas()) {
			if(cotesista.getId() != usuarioDto.getId() && !carreraXParametroConfiguracionService.assertParametroLimiteNumericoPorNombreCarrera("Limite Propuestas Alumno",carreraId,  cotesista.getId())){
				throw new RuntimeException("El usuario cotesista " + cotesista.getId() + " ha alcanzado el límite de propuestas permitidas.");
			}
		}

		// Save the Tema first to generate its ID. We assume the tema has an
		// areaEspecializacion
		temaRepository.save(tema);


		// 1) Subáreas de conocimiento
		saveSubAreas(tema, dto.getSubareas());
		// 2) Save Creador with asignado true
		saveUsuarioXTema(tema, usuarioDto.getId(), RolEnum.Tesista.name(), false, true);
		// 3) Save Asesor (Propuesta Directa)
		if (tipoPropuesta == 1) {
			if (dto.getCoasesores() == null || dto.getCoasesores().isEmpty()) {
				throw new RuntimeException("No se ha proporcionado un asesor para la propuesta directa.");
			}
			saveUsuarioXTema(tema, dto.getCoasesores().get(0).getId(), RolEnum.Asesor.name(), false, false);
		}
		// 4) Save cotesistas

		saveUsuariosInvolucrados(tema, usuarioDto.getId(), dto.getTesistas(), RolEnum.Alumno.name(), false, false); // Save
		// Start historial tema
		saveHistorialTemaChange(tema, dto.getTitulo(), dto.getResumen(), "Creación de propuesta");

		historialAccionService.registrarAccion(idUsuarioCreador, "Creó el tema con propuesta " + (tipoPropuesta == 1 ? "DIRECTA" : "GENERAL" )+ " con ID: " + tema.getId());

		return tema.getId();// return tema id
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
			List<UsuarioXTema> lista = usuarioXTemaRepository
					.findByTemaIdAndActivoTrue(id);

			for (UsuarioXTema uxt : lista) {
				uxt.setActivo(false);
				uxt.setFechaModificacion(OffsetDateTime.now());
			}
			usuarioXTemaRepository.saveAll(lista);
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

	private void validarTesistasSinTemaAsignado(List<UsuarioDto> tesistas, Integer carreraId) {
		// Prepara el array de IDs
		Integer[] tesistaIds = tesistas.stream()
									.map(UsuarioDto::getId)
									.toArray(Integer[]::new);
		try {
			entityManager.createNativeQuery(
					"SELECT validar_tesistas_sin_tema_asignado(:tesistas, :carreraId)")
				.setParameter("tesistas", tesistaIds)
				.setParameter("carreraId", carreraId)
				.getSingleResult();
		} catch (PersistenceException ex) {
			// Extrae el mensaje de PG (o del cause)
			String pgMessage = ex.getCause() != null
				? ex.getCause().getMessage()
				: ex.getMessage();
			// Lánzala como tu excepción de negocio
			throw new CustomException(pgMessage);
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

		// validarDtoTemaNoNulo(dto); // validar que el DTO no sea nulo
		// validarExistenciaListaUsuarios(dto.getTesistas());
		// validarExistenciaListaUsuarios(dto.getCoasesores()); // validar que hay al
		// menos un tesista
		// validarUsuarioExiste(idUsuarioCreador);
		// validarTipoUsurio(idUsuarioCreador, TipoUsuarioEnum.profesor.name()); //
		// validar que la inscripción la haga un
		// profesor
		// validarUnicidadUsuarios(dto.getTesistas(), RolEnum.Tesista.name()); //
		// validar que no se repiten los tesistas

		// for (UsuarioDto u : dto.getTesistas()) {
		// validarUsuarioExiste(u.getId());
		// validarTipoUsurio(u.getId(), TipoUsuarioEnum.alumno.name()); // validar que
		// los tesistas sean alumnos
		// }

		// validarUnicidadUsuarios(dto.getCoasesores(), RolEnum.Coasesor.name()); //
		// validar que no se repiten los coasesores
		// for (UsuarioDto u : dto.getCoasesores()) {
		// validarUsuarioExiste(u.getId());
		// validarTipoUsurio(u.getId(), TipoUsuarioEnum.profesor.name()); // validar que
		// los coasesores sean profesores
		// }
		validarTesistasSinTemaAsignado(dto.getTesistas(), dto.getCarrera().getId()); // validar que los tesistas no tengan tema asignado
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
	public Integer createInscripcionTema(TemaDto dto, String idUsuario) {

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
		return tema.getId(); // return tema id
	}

	@Override
	public void crearSolicitudCambioDeTitulo(String idUsuario,
			String comentario,
			Integer temaId) {
		UsuarioDto usuarioDto = usuarioService.findByCognitoId(idUsuario);
		Integer idUsuarioCreador = usuarioDto.getId();
		crearSolicitudTemaCoordinadorV2(
				temaRepository.findById(temaId)
						.orElseThrow(() -> new EntityNotFoundException("Tema no encontrado con ID: " + temaId)),
				idUsuarioCreador,
				comentario,
				"Solicitud de cambio de título");
	}

	@Override
	public void crearSolicitudCambioDeResumen(String idUsuario,
			String comentario,
			Integer temaId) {
		UsuarioDto usuarioDto = usuarioService.findByCognitoId(idUsuario);
		Integer idUsuarioCreador = usuarioDto.getId();
		crearSolicitudTemaCoordinadorV2(
				temaRepository.findById(temaId)
						.orElseThrow(() -> new EntityNotFoundException("Tema no encontrado con ID: " + temaId)),
				idUsuarioCreador,
				comentario,
				"Solicitud de cambio de resumen");
	}

	@Transactional
	private void crearSolicitudTemaCoordinadorV2(
			Tema tema,
			Integer idUsuarioCreador,
			String comentario,
			String tipoSolicitudNombre) {
		try {
			entityManager
				.createNativeQuery(
					"SELECT crear_solicitud_tema_coordinador(" +
					"    :p_tema_id, " +
					"    :p_usuario_id, " +
					"    :p_comentario, " +
					"    :p_tipo_solicitud_nombre" +
					")")
				.setParameter("p_tema_id", tema.getId())
				.setParameter("p_usuario_id", idUsuarioCreador)
				.setParameter("p_comentario", comentario)
				.setParameter("p_tipo_solicitud_nombre", tipoSolicitudNombre)
				.getSingleResult();
		} catch (Exception ex) {
			throw new RuntimeException(
				"Error al crear solicitud de '" + tipoSolicitudNombre +
				"' para tema " + tema.getId() + ": " + ex.getMessage(), ex);
		}
	}

	private void crearSolicitudTemaCoordinador(Tema tema,
			Integer idUsuarioCreador,
			String comentario,
			String tipoSolicitudNombre) {
		// Validar que el usuario es el coordinador de la carrera

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
		// solicitud.setEstado(0); // Ajusta según tu convención (p.ej. 0 = PENDIENTE)
		solicitud.setEstadoSolicitud(estadoSolicitud);
		Solicitud savedSolicitud = solicitudRepository.save(solicitud);

		RolSolicitud rolRemitente = rolSolicitudRepository
				.findByNombre(RolSolicitudEnum.REMITENTE.name())
				.orElseThrow(() -> new RuntimeException("Rol destinatario no encontrado"));
		RolSolicitud rolDestinatario = rolSolicitudRepository
				.findByNombre(RolSolicitudEnum.DESTINATARIO.name())
				.orElseThrow(() -> new RuntimeException("Rol destinatario no encontrado"));		
		AccionSolicitud accionPendiente = accionSolicitudRepository
				.findByNombre(AccionSolicitudEnum.PENDIENTE_ACCION.name())
				.orElseThrow(() -> new RuntimeException("Accion pendiente_aprobacion no encontrado"));

		// 3) Crear la relación UsuarioXSolicitud
		Usuario usuario = usuarioRepository.findById(idUsuarioCreador)
				.orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + idUsuarioCreador));
		UsuarioXSolicitud usuarioXSolicitud = new UsuarioXSolicitud();
		usuarioXSolicitud.setUsuario(usuario);
		usuarioXSolicitud.setSolicitud(savedSolicitud);
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
				.findByNombre(RolSolicitudEnum.DESTINATARIO.name())
				.orElseThrow(() -> new RuntimeException("Rol destinatario no encontrado"));
		AccionSolicitud accionPendiente = accionSolicitudRepository
				.findByNombre(AccionSolicitudEnum.PENDIENTE_ACCION.name())
				.orElseThrow(() -> new RuntimeException("Accion pendiente_aprobacion no encontrado"));

		// 3) Buscar los usuarios coordinadores de la carrera del tema
		// - Primero obtenemos todas las relaciones usuario-carrera activas para la
		// misma carrera del tema
		// - Después filtramos solo aquellas donde el campo 'esCoordinador' es verdadero
		// - Para cada relación restante, construimos un objeto UsuarioXSolicitud:
		// * Se establece el usuario coordinador
		// * Se enlaza con la solicitud recién guardada
		// * Se asigna el rol de destinatario y la acción pendiente
		List<UsuarioXSolicitud> asignaciones = usuarioCarreraRepository
				.findByCarreraIdAndActivoTrue(tema.getCarrera().getId()).stream()
				.filter(rel -> Boolean.TRUE.equals(rel.getEsCoordinador()))
				.map(rel -> {
					Usuario coord = rel.getUsuario();
					UsuarioXSolicitud us = new UsuarioXSolicitud();
					us.setUsuario(coord);
					us.setSolicitud(savedSolicitud);
					us.setRolSolicitud(rolDestinatario);
					us.setAccionSolicitud(accionPendiente);
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

	@Transactional
	private void crearSolicitudAprobacionTemaV2(Tema tema) {
		try {
			entityManager
					.createNativeQuery("SELECT crear_solicitud_aprobacion_temaV2(:temaId)")
					.setParameter("temaId", tema.getId())
					.getSingleResult();
		} catch (Exception e) {
			throw new RuntimeException(
					"Error al crear la solicitud de aprobación para el tema "
							+ tema.getId() + ": " + e.getMessage(),
					e);
		}
	}

	@Transactional
	@Override
	public Integer createInscripcionTemaV2(TemaDto dto, String idUsuario, Boolean reinscribir) {
		// 0) Validaciones iniciales y preparación del Tema
		UsuarioDto usuarioDto = usuarioService.findByCognitoId(idUsuario);
		Integer idUsuarioCreador = usuarioDto.getId();
		if (!reinscribir) {
			validacionesInscripcionTema(dto, idUsuarioCreador);
			dto.setId(null);
		}

		Integer temaId = dto.getId();
		Tema tema = null;
		// Prepara y guarda el tema con estado INSCRITO
		if (!reinscribir) {
			tema = prepareNewTema(dto, EstadoTemaEnum.INSCRITO);
			// var relaciones = usuarioCarreraRepository.findByUsuarioIdAndActivoTrue(idUsuarioCreador);
			// if (relaciones.isEmpty()) {
			// 	throw new RuntimeException("El usuario no tiene ninguna carrera activa.");
			// }
			// Integer carreraId = relaciones.get(0).getCarrera().getId();
			// Carrera carrera = carreraRepository.findById(carreraId)
			// 		.orElseThrow(() -> new RuntimeException("Carrera no encontrada con id " + carreraId));
			// tema.setCarrera(carrera);

			temaRepository.save(tema);

			// Historial del cambio
			temaId = tema.getId();
			Integer[] subareaIds = dto.getSubareas().stream()
					.map(SubAreaConocimientoDto::getId)
					.toArray(Integer[]::new);
			Integer[] coasesorIds = dto.getCoasesores().stream()
					.map(UsuarioDto::getId)
					.toArray(Integer[]::new);
			Integer[] tesistaIds = dto.getTesistas().stream()
					.map(UsuarioDto::getId)
					.toArray(Integer[]::new);

			entityManager.createNativeQuery(
							"SELECT procesar_inscripcion_items(" +
									" :temaId, :usuarioId, :subs, :coas, :tes )")
					.setParameter("temaId", temaId)
					.setParameter("usuarioId", idUsuarioCreador)
					.setParameter("subs", subareaIds)
					.setParameter("coas", coasesorIds)
					.setParameter("tes", tesistaIds)
					.getSingleResult(); // función retorna VOID
					historialAccionService.registrarAccion(idUsuario, "Se inscribió el tema con ID: " + temaId);

		}
		else{
			tema = temaRepository.findById(temaId)
					.orElseThrow(() -> new EntityNotFoundException("Tema no encontrado con ID: " + dto.getId()));
			historialAccionService.registrarAccion(idUsuario, "Se reinscribió el tema con ID: " + temaId);
		}
		// 1–5) Delegar a la función PL/pgSQL
		entityManager.flush(); // asegurar que tema.id ya esté asignado
		// 6) Generar y enviar la solicitud de aprobación
		saveHistorialTemaChange(tema, tema.getTitulo(), tema.getResumen(), "Inscripción de tema");
		crearSolicitudAprobacionTemaV2(tema);
		return temaId; // return tema id
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
				// dto.getArea().add(areaDto);
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
						.id((Integer) row[0]) // area_conocimiento_id
						.nombre((String) row[2]) // nombre de la área
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
	public List<TemaDto> listarTemasPorUsuarioEstadoYRol(String asesorId, String rolNombre, String estadoNombre,
			Integer limit, Integer offset) {
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
		Tema aux  = temaRepository.findById(temaId).orElseThrow(() -> new RuntimeException("Tema no encontrado con ID: " + temaId));;

		entityManager
				.createNativeQuery("SELECT postular_asesor_a_tema(:alumnoId, :asesorId, :temaId, :comentario)")
				.setParameter("alumnoId", alumnoId)
				.setParameter("asesorId", usuDto.getId())
				.setParameter("temaId", temaId)
				.setParameter("comentario", comentario)
				.getSingleResult();

		saveHistorialTemaChange(aux,aux.getTitulo(),aux.getResumen(),"El asesor " + usuDto.getNombres() + " postuló al tema");
		historialAccionService.registrarAccion(asesorId, "Postuló a propuesta general con ID: " + temaId);
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
		// FALTA
		// historialAccionService.registrarAccion(idUsuario, "Se reinscribió el tema con ID: " + temaId);
	}

	@Override
	public List<TemaConAsesorJuradoDTO> listarTemasCicloActualXEtapaFormativa(Integer etapaFormativaId,
			Integer expoId) {

		List<Object[]> temas = temaRepository.listarTemasCicloActualXEtapaFormativa(etapaFormativaId, expoId);
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
			String correo = (String) fila[8];

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
			usuarioDto.setCorreo(correo);
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
			dto.setTesistas(
					filterByRole(allUsers, RolEnum.Tesista.name())
							.stream()
							.sorted((a, b) -> Boolean.compare(!Boolean.TRUE.equals(a.getCreador()), !Boolean.TRUE.equals(b.getCreador())))
							.collect(Collectors.toList())
			);
			filterByRoleAndAppend(allUsers, RolEnum.Alumno.name(), dto.getTesistas());
			dto.setCoasesores(filterByRole(allUsers, RolEnum.Asesor.name()));
			filterByRoleAndAppend(allUsers, RolEnum.Coasesor.name(), dto.getCoasesores());
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

	private void filterByRoleAndAppend(List<UsuarioDto> all, String roleName, List<UsuarioDto> target) {
		for (UsuarioDto u : all) {
			if (roleName.equals(u.getRol())) {
				target.add(u);
			}
		}
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
			InfoTemaPerfilDto dto = InfoTemaPerfilDto.fromQuery(t);
			// Agregar a los tesistas
			List<Object[]> resultTesistasQuery = usuarioXTemaRepository.listarTesistasTema(dto.getIdTesis());
			List<String> tesistas = new ArrayList<>();
			for (Object[] tesista : resultTesistasQuery) {
				String nombreTesista = (String) tesista[0] + " " + (String) tesista[1];
				tesistas.add(nombreTesista);
			}
			dto.setEstudiantes(String.join(" - ", tesistas));

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

		historialAccionService.registrarAccion(idTesista, "Se rechazó la postulación al tema con ID: " + idTema + " del asesor con ID: " + idAsesor);
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
				.setParameter("uid", dto.getId())
				.getSingleResult();
		logger.info("Eliminando postulaciones a propuesta de usuario: " + idTesista + " FINISH");
		logger.info("Eliminando postulaciones de usuario: " + idTesista);

		eliminarPropuestasTesista(dto.getId());
		eliminarPostulacionesTesista(dto.getId());
		entityManager.flush();
		historialAccionService.registrarAccion(idTesista, "Se aprobó la postulación al tema con ID: " + idTema + " del asesor con ID: " + idAsesor);
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
		try {
			// Call the stored procedure that handles the solicitud and updates
			// usuario_solicitud
			Number result = (Number) entityManager
					.createNativeQuery("SELECT atender_solicitud_titulo(:solicitudId, :titulo, :respuesta)")
					.setParameter("solicitudId", solicitudId)
					.setParameter("titulo", titulo)
					.setParameter("respuesta", respuesta)
					.getSingleResult();

			int estadoAnterior = result != null ? result.intValue() : -1;

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
	public Integer crearTemaLibre(TemaDto dto, String asesorId) {

        UsuarioDto usuDto = usuarioService.findByCognitoId(asesorId);

        Integer temaId;
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
            temaId = (Integer) entityManager.createNativeQuery(
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
			historialAccionService.registrarAccion(asesorId, "Creó el tema PROPUESTO_LIBRE con ID: " + temaId);

        } catch (Exception e) {
            logger.severe("Error al crear tema: " + e.getMessage());
            throw new RuntimeException("No se pudo crear el tema", e);
        }

        return temaId;
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
		java.sql.Date sqlDate = (java.sql.Date) result[5]; // fecha_creacion
		if (sqlDate != null) {
			LocalDate localDate = sqlDate.toLocalDate();
			OffsetDateTime offsetDateTime = localDate.atStartOfDay(ZoneOffset.UTC).toOffsetDateTime();
			dto.setFechaLimite(offsetDateTime);
		} else {
			dto.setFechaCreacion(null);
		}
		sqlDate = (java.sql.Date) result[6]; // fecha_limite
		if (sqlDate != null) {
			LocalDate localDate = sqlDate.toLocalDate();
			OffsetDateTime offsetDateTime = localDate.atStartOfDay(ZoneOffset.UTC).toOffsetDateTime();
			dto.setFechaLimite(offsetDateTime);
		} else {
			dto.setFechaLimite(null);
		}
		dto.setRequisitos((String) result[7]);
		dto.setEstadoTemaNombre((String) result[13]);

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
		Integer asesorId = (Integer) result[8];

		// Subareas
		Integer[] subareaArray = (Integer[]) result[9];
		if (subareaArray != null) {
			for (Integer subareaId : subareaArray) {
				// SubAreaConocimientoDto subarea = new SubAreaConocimientoDto();
				SubAreaConocimientoDto subarea = subAreaConocimientoService.findById(subareaId);
				dto.getSubareas().add(subarea);
			}
		}

		// Coasesores
		Integer[] coasesoresArray = (Integer[]) result[10];

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
		Integer carreraId = (Integer) result[11];
		if (carreraId != null) {
			CarreraDto carreraDTO = carreraServiceImpl.findById(carreraId);
			dto.setCarrera(carreraDTO);
		}

		// Tesistas
		Integer[] tesistasArray = (Integer[]) result[12];
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
	public List<TemaDto> listarTemasLibres(String titulo, Integer limit, Integer offset, String usuarioId,
			Boolean myOwn) {
		if (myOwn == null) {
			myOwn = false; // Default to false if not specified
		}

		@SuppressWarnings("unchecked")
		List<Object[]> resultados = new ArrayList<>();

		if (myOwn) {
			String sql = "SELECT * FROM listar_temas_libres_postulados_alumno(:usuarioId)";

			resultados = entityManager
					.createNativeQuery(sql)
					.setParameter("usuarioId", usuarioId)
					.getResultList();
		} else {
			String sql = "SELECT * FROM listar_temas_libres_con_usuarios(:titulo, :limit, :offset, :usuarioId)";

			resultados = entityManager
					.createNativeQuery(sql)
					.setParameter("titulo", titulo != null ? titulo : "")
					.setParameter("limit", limit != null ? limit : 10)
					.setParameter("offset", offset != null ? offset : 0)
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

			// 13: subareas_ids (java.sql.Array → Integer[])
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

			// 15: usuarios JSONB → String con JSON
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

			// dto.getArea().add(areaDto);
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
						.id((Integer) row[0]) // sub_area_id
						.nombre((String) row[1]) // sub_area_nombre
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
						.id((Integer) row[0]) // area_conocimiento_id
						.nombre((String) row[2]) // nombre de la área
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

private boolean esCoordinadorActivo(Integer usuarioId, Integer carreraId) {
    // 1) Llamada nativa sin FROM dual
    Object raw = entityManager.createNativeQuery(
            "SELECT es_coordinador_activo(:usuarioId, :carreraId)")
        .setParameter("usuarioId", usuarioId)
        .setParameter("carreraId", carreraId)
        .getSingleResult();

    // 2) Convertir al tipo Boolean de Java
    //    PostgreSQL devolverá un java.lang.Boolean aquí
    return Boolean.TRUE.equals(raw);
}

	private void validarCoordinadorYEstado(
			Integer temaId,
			String nuevoEstadoNombre,
			Integer usuarioId) {
		// falta validar que el usuario es coordinador activo de la carrera del tema
		// 3) Obtener el tema para extraer la carrera
		Tema tema = temaRepository.findById(temaId)
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND,
						"Tema con id " + temaId + " no encontrado"));
		// 4) Verificar coordinador activo usando la función PL/SQL
		boolean esCoordinadorActivo = esCoordinadorActivo(usuarioId, tema.getCarrera().getId());
		if (!esCoordinadorActivo) {
			throw new ResponseStatusException(
					HttpStatus.FORBIDDEN,
					"Usuario con id " + usuarioId + " no es coordinador activo de la carrera " +
					tema.getCarrera().getId());
		}
		estadoTemaRepository.findByNombre(nuevoEstadoNombre)
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND,
						"EstadoTema '" + nuevoEstadoNombre + "' no existe"));
	}

	@Override
	public Tema actualizarTemaYHistorial(
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
				"El coordinador cambió el estado de tema a " + nuevoEstadoNombre);
		return tema;
	}

	private Solicitud cargarSolicitud(Integer temaId) {
		final String tipoNombre = "Aprobación de tema (por coordinador)";
		String sql =
			"SELECT s.* " +
			"  FROM solicitud s " +
			"  JOIN obtener_solicitud_por_tipo_y_tema(:tipoNombre, :temaId) f " +
			"    ON s.solicitud_id = f.solicitud_id";

		try {
			return (Solicitud) entityManager
				.createNativeQuery(sql, Solicitud.class)
				.setParameter("tipoNombre", tipoNombre)
				.setParameter("temaId", temaId)
				.getSingleResult();
		} catch (NoResultException ex) {
			// En lugar de lanzar, devolvemos null
			return null;
		}
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

		//RolSolicitud rolDestinatario = rolSolicitudRepository
		//		.findByNombre(RolSolicitudEnum.DESTINATARIO.name())
		//		.orElseThrow(() -> new RuntimeException("Rol destinatario no encontrado"));
		// AccionSolicitud accionPendiente = accionSolicitudRepository
		// .findByNombre(AccionSolicitudEnum.PENDIENTE_ACCION.name())
		// .orElseThrow(() -> new RuntimeException("Accion pendiente_aprobacion no
		// encontrado"));
		AccionSolicitud accionAprobado = accionSolicitudRepository
				.findByNombre(AccionSolicitudEnum.APROBADO.name())
				.orElseThrow(() -> new RuntimeException("Accion APROBADO no encontrado"));
		AccionSolicitud accionRechazado = accionSolicitudRepository
				.findByNombre(AccionSolicitudEnum.RECHAZADO.name())
				.orElseThrow(() -> new RuntimeException("Accion RECHAZADO no encontrado"));

		uxs.setComentario(comentario);
		switch (nuevoEstadoNombre.toUpperCase()) {
			case "REGISTRADO":
				//uxs.setRolSolicitud(rolDestinatario);
				uxs.setAccionSolicitud(accionAprobado);
				break;
			case "RECHAZADO":
				//uxs.setRolSolicitud(rolDestinatario);
				uxs.setAccionSolicitud(accionRechazado);
				break;
			case "OBSERVADO":
				//uxs.setRolSolicitud(rolDestinatario);
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
						.findByNombre(EstadoSolicitudEnum.RECHAZADA.name())
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

		// 1) Intentamos cargar SIEMPRE la solicitud
		Solicitud solicitud = cargarSolicitud(temaId);

		// 2) Si no existe solicitud, sólo permitimos continuar
		//    cuando el nuevo estado es REGISTRADO o RECHAZADO
		if (solicitud == null) {
			boolean estadoPermitidoSinSolicitud =
				EstadoTemaEnum.REGISTRADO.name().equalsIgnoreCase(nuevoEstadoNombre)
			|| EstadoTemaEnum.RECHAZADO.name().equalsIgnoreCase(nuevoEstadoNombre);
			if (!estadoPermitidoSinSolicitud) {
				throw new RuntimeException(
					"No existe solicitud de aprobación para el tema " + temaId);
			}
		}

		// 3) Si la solicitud existe, actualizamos sus datos
		if (solicitud != null) {
			actualizarUsuarioXSolicitud(
				solicitud.getId(),
				usuarioId,
				nuevoEstadoNombre,
				comentario);
			actualizarSolicitud(solicitud, nuevoEstadoNombre, comentario);
		}

		if (EstadoTemaEnum.RECHAZADO.name().equalsIgnoreCase(nuevoEstadoNombre)
		|| EstadoTemaEnum.OBSERVADO.name().equalsIgnoreCase(nuevoEstadoNombre)) {
			entityManager.createNativeQuery(
					"CALL rechazar_solicitudes_cambio_por_tema(:temaId)")
				.setParameter("temaId", temaId)
				.executeUpdate();
		}

		if (EstadoTemaEnum.REGISTRADO.name().equalsIgnoreCase(nuevoEstadoNombre)) {
			entityManager.createNativeQuery(
					"CALL aprobar_solicitudes_cambio_por_tema(:temaId)")
				.setParameter("temaId", temaId)
				.executeUpdate();
		}


		if (EstadoTemaEnum.RECHAZADO.name().equalsIgnoreCase(nuevoEstadoNombre)) {
			desasignarUsuariosDeTema(temaId);
		}
		historialAccionService.registrarAccion(coordinadorId, "Cambió el estado al tema con ID: " + temaId + " a " + nuevoEstadoNombre);

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
		// validarTipoUsurio(usuarioId, TipoUsuarioEnum.profesor.name());

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
		historialAccionService.registrarAccion(coordinadorId, "Se eliminó el tema con ID: " + temaId);

	}

	@Override
	public TemaConAsesorDto obtenerTemaActivoPorAlumno(Integer idAlumno) {
		try {
			// Ejecutar la función que devuelve el tema actual y el ID del asesor
			List<Object[]> queryRes =  temaRepository.obtenerTemasPorAlumno(idAlumno);
			if(queryRes.isEmpty())
				throw new RuntimeException("No se encontró un tema para el alumno");
			Object[] result = queryRes.get(0);

			// Mapear a TemaActual
			TemaResumenDto tema = new TemaResumenDto();
			tema.setId((Integer) result[0]);
			tema.setTitulo((String) result[1]);
			tema.setEstadoTema((String) result[2]);
			tema.setAreas((String) result[3]);

			// Obtener el perfil del asesor
			Integer[] idAsesoresArray = (Integer[]) result[4];
			List<Integer> idAsesores = Arrays.asList(idAsesoresArray);
			
			List<PerfilAsesorDto> asesoresDto = new ArrayList<>();
			for (Integer idAsesor : idAsesores) {
			PerfilAsesorDto perfil = usuarioService.getPerfilAsesor(idAsesor);
			if (perfil != null) {
				asesoresDto.add(perfil);
				}
			}
			//Agregar la lista de roles
			String[] rolesArray = (String[]) result[5];
			List<String> rolesList = Arrays.stream(rolesArray).toList();
			Integer idCreador = (Integer) result[6];
 			// Retornar combinado en TemaConAsesorDto
			TemaConAsesorDto respuesta = new TemaConAsesorDto();
			respuesta.setTemaActual(tema);
			respuesta.setAsesores(asesoresDto);
			respuesta.setRoles(rolesList);
			respuesta.setIdCreador(idCreador);
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
			UsuarioDto usuarioDto = usuarioService.findByCognitoId(tesistaId);

			if (usuarioDto == null) {
				throw new RuntimeException("Usuario no encontrado con Cognito ID: " + tesistaId);
			}

			var relaciones = usuarioCarreraRepository.findByUsuarioIdAndActivoTrue(usuarioDto.getId());
			if (relaciones.isEmpty()) {
				throw new RuntimeException("El usuario no tiene ninguna carrera activa.");
			}
			// tomamos la primera
			Integer carreraId = relaciones.get(0).getCarrera().getId();
			if(!carreraXParametroConfiguracionService.assertParametroLimiteNumericoPorNombreCarrera("Limite Postulaciones Alumno",carreraId,  usuarioDto.getId())){
				throw new RuntimeException("El usuario ha alcanzado el límite de postulaciones permitidas.");
			}
			// Call the PostgreSQL function to handle the postulation
			entityManager.createNativeQuery("SELECT postular_tesista_tema_libre(:temaId, :tesistaId, :comentario)")
					.setParameter("temaId", temaId)
					.setParameter("tesistaId", tesistaId)
					.setParameter("comentario", comentario)
					.getSingleResult();

			logger.info("Tesista " + tesistaId + " successfully applied to tema libre " + temaId);
			historialAccionService.registrarAccion(tesistaId, "Se postuló al tema con ID: " + temaId);

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
						rolNombre);

		if (!esAsesor) {
			throw new ResponseStatusException(
					HttpStatus.FORBIDDEN,
					"El usuario con ID " + usuarioId + " no es " + rolNombre + " del tema con ID " + temaId);
		}
	}

	@Override
	@Transactional
	public void inscribirTemaPreinscrito(Integer temaId, String idUsuario) {
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
		crearSolicitudAprobacionTemaV2(tema);
		historialAccionService.registrarAccion(idUsuario, "Preinscribió al tema con ID: " + temaId);

	}

	@Override
	public List<TemaDto> listarPostuladosTemaLibre(
			String busqueda,
			String estado,
			LocalDate fechaLimite,
			Integer limit,
			Integer offset,
			String usuarioId) {
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

			dto = findById((Integer) fila[0]);

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

			// (a) Traer la lista de asesores asignados al tema
			List<UsuarioDto> asesores = listarUsuariosPorTemaYRol(dto.getId(), RolEnum.Asesor.name());

			// (b) Traer la lista de coasesores asignados al tema
			List<UsuarioDto> coasesoresDirectos = listarUsuariosPorTemaYRol(dto.getId(), RolEnum.Coasesor.name());

			// (c) Combinar: primero el (o los) asesor(es), luego los coasesores sin
			// duplicados
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

		try {
			// llamamos a la función con un array de 1 elemento
			Integer[] tesistaArray = new Integer[]{ idTesista };
			entityManager.createNativeQuery(
				"SELECT validar_tesistas_sin_tema_asignado(:tesistas, :carreraId)")
			.setParameter("tesistas", tesistaArray)
			.setParameter("carreraId", tema.getCarrera().getId())
			.getSingleResult();
		} catch (PersistenceException ex) {
			// extraemos mensaje y lo convertimos en excepción de negocio
			String msg = ex.getCause() != null ? ex.getCause().getMessage() : ex.getMessage();
			throw new CustomException(msg);
		}
		// boolean yaAsignado = usuarioXTemaRepository
		// 		.existsByUsuarioIdAndRolNombreAndActivoTrueAndAsignadoTrue(
		// 				idTesista,
		// 				"Tesista" // o el nombre exacto de tu rol
		// 		);
		// if (yaAsignado) {
		// 	throw new CustomException(
		// 			"El tesista con id " + idTesista + " ya tiene un tema asignado");
		// }

		
		// 3) Buscar el registro de UsuarioXTema para ese tesista y tema
		UsuarioXTema usuarioXTema = usuarioXTemaRepository
				.findByTemaIdAndUsuarioIdAndActivoTrue(temaId, idTesista)
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND,
						"No existe postulación de ese tesista al tema " + temaId));

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
		saveHistorialTemaChange(tema, tema.getTitulo(), tema.getResumen(),
				"Aceptación de postulante");

		// 6) (Opcional) Eliminar postulaciones previas de ese alumno a otros temas
		eliminarPostulacionesTesista(idTesista);
		eliminarPropuestasTesista(idTesista);

		// 7) Desactivar todas las demás postulaciones (asignado = false) de este mismo
		// tema
		eliminarPostulacionesTema(temaId);
		crearSolicitudAprobacionTemaV2(tema);
		historialAccionService.registrarAccion(idAsesor, "Se aceptó la postulación al tema con ID: " + temaId + " del alumno con ID: " + idTesista);

	}

	private void eliminarPostulacionesTema(Integer idTema) {
		// 1) Obtener todos los registros de usuario–tema para ese tema donde asignado =
		// false y activo = true
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
		// 1) (Opcional) Validar que quien llama tenga permiso: p.ej. sea Asesor del
		// tema
		UsuarioDto usuDto = usuarioService.findByCognitoId(idAsesor);
		// validarRolAsignadoAtema(usuDto.getId(), temaId, RolEnum.Asesor.name());

		// 2) Buscar el registro de UsuarioXTema correspondiente
		UsuarioXTema registro = usuarioXTemaRepository
				.findByTemaIdAndUsuarioIdAndActivoTrue(temaId, idTesista)
				.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND,
						"No existe postulación para el tesista " + idTesista + " en el tema " + temaId));

		// 3) Marcarlo como rechazado
		registro.setRechazado(true);
		registro.setFechaModificacion(OffsetDateTime.now());
		registro.setComentario(comentario != null ? comentario : "Postulación rechazada por el asesor");
		usuarioXTemaRepository.save(registro);
		historialAccionService.registrarAccion(idAsesor, "Se rechazó la postulación al tema con ID: " + temaId + " del alumno con ID: " + idTesista);

	}

	@Override
	public void eliminarPostulacionTemaLibre(Integer temaId, String idUsuario) {

		UsuarioDto usuDto = usuarioService.findByCognitoId(idUsuario);
		if (usuDto == null) {
			throw new ResponseStatusException(
					HttpStatus.NOT_FOUND,
					"Usuario no encontrado con ID: " + idUsuario);
		}
		Optional<UsuarioXTema> asignacionOpt = usuarioXTemaRepository
				.findByUsuarioIdAndTemaIdAndRolIdAndActivoTrue(usuDto.getId(), temaId, 4); // Rol Tesista

		if (asignacionOpt.isEmpty()) {
			logger.severe("No se encontró una asignación de tesista para el tema con ID: " + temaId);
			throw new ResponseStatusException(
					HttpStatus.NOT_FOUND,
					"No se encontró una asignación de tesista para el tema con ID: " + temaId);
		} else {
			UsuarioXTema asignacion = asignacionOpt.get();
			usuarioXTemaRepository.softDeleteById(asignacion.getId());
			logger.info("Postulación eliminada para el tesista con ID: " + usuDto.getId() + " en el tema con ID: "
					+ temaId);
			historialAccionService.registrarAccion(idUsuario, "Eliminó la postulación al tema con ID: " + temaId);

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

	public void asociarTemaACurso(Integer cursoId, Integer temaId) {
		temaRepository.asociarTemaACurso(cursoId, temaId);
	}

	@Override
	@Transactional()
	public List<TemaDto> listarTemasPorUsuarioTituloAreaCarreraEstadoFecha(
			String usuarioCognitoId,
			String titulo,
			Integer areaId,
			Integer carreraId,
			String estadoNombre,
			LocalDate fechaCreacionDesde,
			LocalDate fechaCreacionHasta,
			String rolNombre,
			Integer limit,
			Integer offset) {
		// 1) Traducir Cognito ID a ID interno
		UsuarioDto usuarioDto = usuarioService.findByCognitoId(usuarioCognitoId);
		if (usuarioDto == null) {
			throw new ResponseStatusException(
					HttpStatus.NOT_FOUND,
					"Usuario no encontrado con Cognito ID: " + usuarioCognitoId);
		}
		Integer usuarioId = usuarioDto.getId();

		// 2) Convertir LocalDate a java.sql.Date (pueden ser null)
		java.sql.Date sqlFechaDesde = (fechaCreacionDesde != null)
				? java.sql.Date.valueOf(fechaCreacionDesde)
				: null;
		java.sql.Date sqlFechaHasta = (fechaCreacionHasta != null)
				? java.sql.Date.valueOf(fechaCreacionHasta)
				: null;

		// 3) Normalizar cadenas para evitar null
		String filtroTitulo = (titulo != null ? titulo : "");
		String filtroEstado = (estadoNombre != null ? estadoNombre : "");
		String filtroRol = (rolNombre != null ? rolNombre : "");

		Integer pagLimit = (limit != null ? limit : 10);
		Integer pagOffset = (offset != null ? offset : 0);

		// 4) Llamar al repositorio
		List<Object[]> rows = temaRepository.listarTemasPorUsuarioTituloAreaCarreraEstadoFecha(
				usuarioId,
				filtroTitulo,
				areaId,
				carreraId,
				filtroEstado,
				sqlFechaDesde,
				sqlFechaHasta,
				filtroRol,
				pagLimit,
				pagOffset);

		// 5) Mapear cada fila a TemaDto
		List<TemaDto> resultados = new ArrayList<>(rows.size());
		for (Object[] r : rows) {
			TemaDto dto = new TemaDto();

			// ===== Indices según RETURNS TABLE de la función PL/pgSQL =====
			// 0: tema_id (INTEGER)
			// 1: codigo (TEXT)
			// 2: titulo (TEXT)
			// 3: resumen (TEXT)
			// 4: metodologia (TEXT)
			// 5: objetivos (TEXT)
			// 6: portafolio_url (TEXT)
			// 7: requisitos (TEXT)
			// 8: activo (BOOLEAN)
			// 9: fecha_limite (TIMESTAMPTZ)
			// 10: fecha_creacion (TIMESTAMPTZ)
			// 11: fecha_modificacion (TIMESTAMPTZ)
			// 12: carrera_id (INTEGER)
			// 13: carrera_nombre (TEXT)
			// 14: area_ids (INTEGER[])
			// 15: area_nombres (TEXT[])
			// 16: subarea_ids (INTEGER[])
			// 17: subarea_nombres (TEXT[])
			// 18: asesor_ids (INTEGER[])
			// 19: asesor_nombres (TEXT[])
			// 20: asesor_codigos (TEXT[])
			// 21: asesor_roles (TEXT[])
			// 22: tesista_ids (INTEGER[])
			// 23: tesista_nombres (TEXT[])
			// 24: estado_nombre (TEXT)
			// 25: postulaciones_count (INTEGER)
			// 26: asesores_asignados (BOOLEAN)
			// 27: tesistas_asignados (BOOLEAN)
			// =================================================================

			// 0: tema_id
			dto.setId(((Integer) r[0]).intValue());
			// 1: codigo
			dto.setCodigo((String) r[1]);
			// 2: titulo
			dto.setTitulo((String) r[2]);
			// 3: resumen
			dto.setResumen((String) r[3]);
			// 4: metodologia
			dto.setMetodologia((String) r[4]);
			// 5: objetivos
			dto.setObjetivos((String) r[5]);
			// 6: portafolio_url
			dto.setPortafolioUrl((String) r[6]);
			// 7: requisitos
			dto.setRequisitos((String) r[7]);
			// 8: activo
			dto.setActivo((Boolean) r[8]);

			// 9: fecha_limite (Timestamp → OffsetDateTime)
			if (r[9] != null) {
				Instant inst = (r[9] instanceof Instant)
						? (Instant) r[9]
						: ((java.sql.Timestamp) r[9]).toInstant();
				dto.setFechaLimite(inst.atOffset(ZoneOffset.UTC));
			}

			// 10: fecha_creacion
			if (r[10] != null) {
				Instant inst = (r[10] instanceof Instant)
						? (Instant) r[10]
						: ((java.sql.Timestamp) r[10]).toInstant();
				dto.setFechaCreacion(inst.atOffset(ZoneOffset.UTC));
			}

			// 11: fecha_modificacion
			if (r[11] != null) {
				Instant inst = (r[11] instanceof Instant)
						? (Instant) r[11]
						: ((java.sql.Timestamp) r[11]).toInstant();
				dto.setFechaModificacion(inst.atOffset(ZoneOffset.UTC));
			}

			// 12: carrera_id, 13: carrera_nombre
			if (r[12] != null && r[13] != null) {
				CarreraDto carreraDto = new CarreraDto();
				carreraDto.setId(((Number) r[12]).intValue());
				carreraDto.setNombre((String) r[13]);
				dto.setCarrera(carreraDto);
			}

			// 14: area_ids[], 15: area_nombres[]
			Integer[] areaIdsArr = (Integer[]) r[14];
			String[] areaNombresArr = (String[]) r[15];
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

			// 16: subarea_ids[], 17: subarea_nombres[]
			Integer[] subareaIdsArr = (Integer[]) r[16];
			String[] subareaNombresArr = (String[]) r[17];
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

			// 18: asesor_ids[], 19: asesor_nombres[], 20: asesor_codigos[], 21:
			// asesor_roles[]
			Integer[] asesorIdsArr = (Integer[]) r[18];
			String[] asesorNombresArr = (String[]) r[19];
			String[] asesorCodigosArr = (String[]) r[20];
			String[] asesorRolesArr = (String[]) r[21];
			Boolean[] asesoresAsignados = (Boolean[]) r[26];
			List<UsuarioDto> listaAsesores = new ArrayList<>();
			if (asesorIdsArr != null
					&& asesorNombresArr != null
					&& asesorCodigosArr != null
					&& asesorRolesArr != null) {
				for (int i = 0; i < asesorIdsArr.length; i++) {
					UsuarioDto u = new UsuarioDto();
					u.setId(asesorIdsArr[i]);
					u.setNombres(asesorNombresArr[i]); // “Nombre Apellido1 Apellido2”
					u.setCodigoPucp(asesorCodigosArr[i]); // código PUCP
					u.setRol(asesorRolesArr[i]); // “Asesor” o “Coasesor”
					u.setAsignado(asesoresAsignados[i]); // true/false
					listaAsesores.add(u);
				}
			}
			dto.setCoasesores(listaAsesores);

			// 22: tesista_ids[], 23: tesista_nombres[]
			Integer[] tesistaIdsArr = (Integer[]) r[22];
			String[] tesistaNombresArr = (String[]) r[23];
			List<UsuarioDto> listaTesistas = new ArrayList<>();
			Boolean[] tesistasAsignados = (Boolean[]) r[27];
			if (tesistaIdsArr != null && tesistaNombresArr != null) {
				for (int i = 0; i < tesistaIdsArr.length; i++) {
					UsuarioDto u = new UsuarioDto();
					u.setId(tesistaIdsArr[i]);
					u.setNombres(tesistaNombresArr[i]);
					u.setAsignado(tesistasAsignados[i]);
					listaTesistas.add(u);
				}
			}
			dto.setTesistas(listaTesistas);

			// 24: estado_nombre
			dto.setEstadoTemaNombre((String) r[24]);

			// 25: postulaciones_count
			dto.setCantPostulaciones(((Number) r[25]).intValue());

			resultados.add(dto);
		}

		return resultados;
	}

	@Override
	@Transactional
	public List<TemaDto> listarTemasFiltradoCompleto(
			String titulo,
			String estadoNombre,
			Integer carreraId,
			Integer areaId,
			String nombreUsuario,
			String primerApellidoUsuario,
			String segundoApellidoUsuario,
			Integer limit,
			Integer offset) {
		// 1) Normalizar parámetros para evitar nulls
		String filtroTitulo = (titulo != null ? titulo : "");
		String filtroEstado = (estadoNombre != null ? estadoNombre : "");
		String filtroNombreUsuario = (nombreUsuario != null ? nombreUsuario : "");
		String filtroPrimerApellido = (primerApellidoUsuario != null ? primerApellidoUsuario : "");
		String filtroSegundoApellido = (segundoApellidoUsuario != null ? segundoApellidoUsuario : "");
		Integer filtroCarrera = carreraId; // puede ser null
		Integer filtroArea = areaId; // puede ser null
		Integer pagLimit = (limit != null ? limit : 10);
		Integer pagOffset = (offset != null ? offset : 0);

		// 2) Llamar al repositorio nativo
		List<Object[]> rows = temaRepository.listarTemasFiltradoCompleto(
				filtroTitulo,
				filtroEstado,
				filtroCarrera,
				filtroArea,
				filtroNombreUsuario,
				filtroPrimerApellido,
				filtroSegundoApellido,
				pagLimit,
				pagOffset);

		// 3) Mapear cada Object[] a TemaDto
		List<TemaDto> resultados = new ArrayList<>(rows.size());
		for (Object[] r : rows) {
			TemaDto dto = new TemaDto();

			// 0: tema_id
			dto.setId(((Number) r[0]).intValue());
			// 1: codigo
			dto.setCodigo((String) r[1]);
			// 2: titulo
			dto.setTitulo((String) r[2]);
			// 3: resumen
			dto.setResumen((String) r[3]);
			// 4: metodologia
			dto.setMetodologia((String) r[4]);
			// 5: objetivos
			dto.setObjetivos((String) r[5]);
			// 6: portafolio_url
			dto.setPortafolioUrl((String) r[6]);
			// 7: requisitos
			dto.setRequisitos((String) r[7]);
			// 8: activo
			dto.setActivo((Boolean) r[8]);

			dto.setEstadoTemaNombre((String) r[25]); // 8: estado_tema_nombre

			// 9: fecha_limite
			if (r[9] != null) {
				dto.setFechaLimite(toOffsetDateTime(r[9]));
			}

			// 10: fecha_creacion
			if (r[10] != null) {
				dto.setFechaCreacion(toOffsetDateTime(r[10]));
			}

			// 11: fecha_modificacion
			if (r[11] != null) {
				dto.setFechaModificacion(toOffsetDateTime(r[11]));
			}

			// 12: carrera_id, 13: carrera_nombre
			if (r[12] != null && r[13] != null) {
				CarreraDto carreraDto = new CarreraDto();
				carreraDto.setId(((Number) r[12]).intValue());
				carreraDto.setNombre((String) r[13]);
				dto.setCarrera(carreraDto);
			}

			// 14: area_ids, 15: area_nombres
			List<AreaConocimientoDto> listaAreas = new ArrayList<>();
			Integer[] areaIdsArr = (Integer[]) r[14];
			String[] areaNombresArr = (String[]) r[15];
			if (areaIdsArr != null && areaNombresArr != null) {
				for (int i = 0; i < areaIdsArr.length; i++) {
					AreaConocimientoDto a = new AreaConocimientoDto();
					a.setId(areaIdsArr[i]);
					a.setNombre(areaNombresArr[i]);
					listaAreas.add(a);
				}
			}
			dto.setArea(listaAreas);

			// 16: subarea_ids, 17: subarea_nombres
			List<SubAreaConocimientoDto> listaSub = new ArrayList<>();
			Integer[] subareaIdsArr = (Integer[]) r[16];
			String[] subareaNombresArr = (String[]) r[17];
			if (subareaIdsArr != null && subareaNombresArr != null) {
				for (int i = 0; i < subareaIdsArr.length; i++) {
					SubAreaConocimientoDto s = new SubAreaConocimientoDto();
					s.setId(subareaIdsArr[i]);
					s.setNombre(subareaNombresArr[i]);
					listaSub.add(s);
				}
			}
			dto.setSubareas(listaSub);

			// 18: asesor_ids, 19: asesor_nombres
			List<UsuarioDto> listaAsesores = new ArrayList<>();
			Integer[] asesorIdsArr = (Integer[]) r[18];
			String[] asesorNombresArr = (String[]) r[19];
			String[] asesorCodgio = (String[]) r[20];
			String[] asesorRol = (String[]) r[21];
			Boolean[] asesorAsignadoArr = (Boolean[]) r[26];
			if (asesorIdsArr != null && asesorNombresArr != null) {
				for (int i = 0; i < asesorIdsArr.length; i++) {
					UsuarioDto u = new UsuarioDto();
					u.setId(asesorIdsArr[i]);
					u.setNombres(asesorNombresArr[i]); // nombre completo (Nombres + Apellidos)
					//u.setCodigoPucp(asesorCodgio[i]); // código PUCP
					u.setAsignado(asesorAsignadoArr[i]); // si está asignado o no
					// u.setRol(asesorRol[i]);
					listaAsesores.add(u);
				}
			}
			// si tu DTO distinguía “coasesores” aparte de “asesores”, aquí puedes
			// asignarlos.
			// Pero como el requisito era "mostrar primero al Asesor y luego a los
			// Coasesores",
			// el arreglo 18–19 ya sale con Asesor en la posición 0 (porque en la función
			// SQL
			// agregamos Asesor + Coasesores en ese orden).
			dto.setCoasesores(listaAsesores);

			// 22: tesista_ids, 23: tesista_nombres
			List<UsuarioDto> listaTesistas = new ArrayList<>();
			Integer[] tesistaIdsArr = (Integer[]) r[22];
			String[] tesistaNombresArr = (String[]) r[23];
			Boolean[] tesistaAsignadoArr = (Boolean[]) r[27];
			if (tesistaIdsArr != null && tesistaNombresArr != null) {
				for (int i = 0; i < tesistaIdsArr.length; i++) {
					UsuarioDto u = new UsuarioDto();
					u.setId(tesistaIdsArr[i]);
					u.setNombres(tesistaNombresArr[i]);
					u.setAsignado(tesistaAsignadoArr[i]);
					listaTesistas.add(u);
				}
			}
			dto.setTesistas(listaTesistas);

			// 24: cant_postulaciones
			dto.setCantPostulaciones(((Number) r[24]).intValue());

			resultados.add(dto);
		}

		return resultados;
	}

	@Override
	@Transactional
	public void guardarSimilitudes(String cognitoId, List<TemaSimilarDto> similitudes) {
		// Validar existencia del tema
		Integer temaId = similitudes.get(0).getTema().getId();
		temaRepository.findById(temaId)
				.orElseThrow(() -> new RuntimeException("Tema no encontrado con id: " + temaId));

		// Obtener usuario interno desde Cognito ID
		UsuarioDto usuarioDto = usuarioService.findByCognitoId(cognitoId);
		if (usuarioDto == null) {
			throw new RuntimeException("Usuario no encontrado con Cognito ID: " + cognitoId);
		}
		Integer usuarioId = usuarioDto.getId();

		// Construir arrays para la función SQL
		Integer[] relIds = similitudes.stream()
				.map(dto -> dto.getTemaRelacion().getId())
				.toArray(Integer[]::new);
		BigDecimal[] porcs = similitudes.stream()
				.map(TemaSimilarDto::getPorcentajeSimilitud)
				.toArray(BigDecimal[]::new);

		// Llamar a la función PL/pgSQL
		entityManager.createNativeQuery(
				"SELECT guardar_similitudes_tema(:p_tema_id, :p_usuario_id, :p_rel_ids, :p_porcs)")
				.setParameter("p_tema_id", temaId)
				.setParameter("p_usuario_id", usuarioId)
				.setParameter("p_rel_ids", relIds)
				.setParameter("p_porcs", porcs)
				.getSingleResult();
		historialAccionService.registrarAccion(cognitoId, "Guardó la similitud del tema con ID: " + temaId);

	}

	@Override
	@Transactional
	public List<TemaDto> listarTemasSimilares(Integer temaId) {
		// 1) Validar existencia del tema principal
		temaRepository.findById(temaId)
			.orElseThrow(() -> new RuntimeException("Tema no encontrado con id: " + temaId));

		// 2) Llamar a la función SQL
		@SuppressWarnings("unchecked")
		List<Object[]> rows = entityManager.createNativeQuery(
				"SELECT * FROM listar_temas_similares(:temaId)")
			.setParameter("temaId", temaId)
			.getResultList();

		// 3) Mapear cada fila al DTO
		List<TemaDto> resultados = new ArrayList<>(rows.size());
		for (Object[] r : rows) {
			TemaDto dto = TemaDto.builder()
				.id(((Number) r[0]).intValue())
				.codigo((String) r[1])
				.titulo((String) r[2])
				.resumen((String) r[3])
				.objetivos((String) r[4])
				.metodologia((String) r[5])
				.requisitos((String) r[6])
				.portafolioUrl((String) r[7])
				.activo((Boolean) r[8])
				// Fecha límite
				.fechaLimite(r[9] != null
					? toOffsetDateTime(r[9]).toInstant().atOffset(ZoneOffset.UTC)
					: null)
				// Fecha de finalización
				.fechaFinalizacion(r[10] != null
					? toOffsetDateTime(r[10]).toInstant().atOffset(ZoneOffset.UTC)
					: null)
				// Fecha de creación
				.fechaCreacion(r[11] != null
					? toOffsetDateTime(r[11]).toInstant().atOffset(ZoneOffset.UTC)
					: null)
				// Fecha de modificación
				.fechaModificacion(r[12] != null
					? toOffsetDateTime(r[12]).toInstant().atOffset(ZoneOffset.UTC)
					: null)
				.estadoTemaNombre((String) r[13])
				.porcentajeSimilitud(((BigDecimal) r[14]).doubleValue())
				.build();
			resultados.add(dto);
		}
		return resultados;
	}

	@Override
	public List<TemaDto> listarTemasFinalizados() {
		List<Object[]> resultados = temaRepository.listarTemasFinalizados();

		return resultados.stream().map(row -> {
			TemaDto tema = new TemaDto();
			tema.setId((Integer) row[0]);
			tema.setTitulo((String) row[1]);
			tema.setResumen((String) row[2]);
			tema.setObjetivos((String) row[3]);
			tema.setEstadoTemaNombre((String) row[4]);
			tema.setFechaFinalizacion(row[5] != null ? ((Instant) row[5]).atOffset(ZoneOffset.UTC) : null);
			return tema;
		}).collect(Collectors.toList());
	}

	@Override
	public Integer contarPostuladosAlumnosTemaLibreAsesor(
			String busqueda,
			String estado,
			LocalDate fechaLimite,
			String usuarioId) {
		// Obtener el ID del asesor (ejemplo usando un servicio, puedes adaptarlo)
		UsuarioDto usuDto = usuarioService.findByCognitoId(usuarioId);

		// Consulta SQL
		String sql = "SELECT contar_postulaciones_alumnos_tema_libre(:asesorId, :busqueda, :estado, :fechaLimite)";

		// Ejecutar función y retornar el valor entero
		Number result = (Number) entityManager
				.createNativeQuery(sql)
				.setParameter("asesorId", usuDto.getId())
				.setParameter("busqueda", busqueda != null ? busqueda : "")
				.setParameter("estado", estado != null ? estado : "")
				.setParameter("fechaLimite", fechaLimite != null ? java.sql.Date.valueOf(fechaLimite) : null)
				.getSingleResult();

		return result != null ? result.intValue() : 0;
	}


	@Override
	public List<TemasComprometidosDto> contarTemasComprometidos(String usuarioSubId) {
		String sql = "SELECT * FROM contar_temas_comprometidos(?)";

		return jdbcTemplate.query(sql, new Object[]{usuarioSubId}, (rs, rowNum) ->
			TemasComprometidosDto.builder()
				.comprometido(rs.getInt("comprometido"))
				.estadoNombre(rs.getString("estado_nombre"))
				.build()
		);
	}

	@Override
	public void aceptarPropuestaCotesista(Integer temaId, String usuarioId, Integer action) {
		try{
			if (action == null || (action != 0 && action != 1)) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Acción inválida. Debe ser 0 (aprobar) o 1 (rechazar).");
			}
			String sql = "";
			if (action == 1) {
				sql = "SELECT * FROM rechazar_propuesta_cotesista(:temaId, CAST(:usuarioId AS TEXT))";
			} else{
				// Si la acción es 0, se acepta la propuesta
				sql = "SELECT  * FROM aceptar_propuesta_cotesista(:temaId, CAST(:usuarioId AS TEXT))";
			}
			String result = (String)  entityManager.createNativeQuery(sql)
					.setParameter("temaId", temaId)
					.setParameter("usuarioId", usuarioId)
					.getSingleResult();
			if (result != null && result.startsWith("ERROR:")) {
				throw new ResponseStatusException(HttpStatus.OK, result);
			}
			historialAccionService.registrarAccion(usuarioId, "Se " +  (action == 1 ? "rechazó" : "aprobó") + " la propuesta de cotesista al tema con ID: " + temaId);

		}
		catch (ResponseStatusException e) {
			logger.severe("Error al aceptar propuesta de cotesista: " + e.getMessage());
			throw e;
		} catch (Exception e) {
			logger.severe("Error inesperado al aceptar propuesta de cotesista: " + e.getMessage());
			throw new RuntimeException("Error al aceptar propuesta de cotesista", e);
		}


	}

	@Override
	public List<TemaDto> listarPropuestasPorCotesista(String cotesistaId) {
		String sql = "SELECT * " +
				"  FROM listar_propuestas_del_cotesista_con_usuarios(:p_tesista_id)";
		Query query = entityManager.createNativeQuery(sql)
				.setParameter("p_tesista_id", cotesistaId);

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
			dto.setTesistas(
					filterByRole(allUsers, RolEnum.Tesista.name())
							.stream()
							.sorted((a, b) -> Boolean.compare(!Boolean.TRUE.equals(a.getCreador()), !Boolean.TRUE.equals(b.getCreador())))
							.collect(Collectors.toList())
			);
			filterByRoleAndAppend(allUsers, RolEnum.Alumno.name(), dto.getTesistas());
			dto.setCoasesores(filterByRole(allUsers, RolEnum.Asesor.name()));
			filterByRoleAndAppend(allUsers, RolEnum.Coasesor.name(), dto.getCoasesores());

			// --- calculate postulaciones: count Tesista with asignado=false ---
			if (EstadoTemaEnum.PROPUESTO_GENERAL.name()
					.equals(dto.getEstadoTemaNombre())) {
				dto.setCantPostulaciones(calculatePostulaciones(allUsers));
			}

			proposals.add(dto);
		}

		return proposals;
	}

	@Transactional
	@Override
	public void registrarSolicitudesModificacionTema(Integer temaId, String usuarioId, List<Map<String, Object>> solicitudes) {
		try {
			UsuarioDto usuDto = usuarioService.findByCognitoId(usuarioId);

			Optional<Tema> temaAux = temaRepository.findById(temaId);


			String solicitudesJson = objectMapper.writeValueAsString(solicitudes); // Convierte la lista a JSON

			Query query = entityManager.createNativeQuery(
					"SELECT insertar_solicitudes_modificacion_tema(:temaId, :usuarioId, CAST(:solicitudes AS jsonb))"
			);
			query.setParameter("temaId", temaId);
			query.setParameter("usuarioId", usuDto.getId());
			query.setParameter("solicitudes", solicitudesJson);
			query.getSingleResult();

			for (Map<String, Object> solicitud : solicitudes) {
				Integer tipoSolicitudId = Integer.parseInt(solicitud.get("tipo_solicitud_id").toString());
				Optional<TipoSolicitud> tipoAux = tipoSolicitudRepository.findById(tipoSolicitudId);
				
				saveHistorialTemaChange(temaAux.get(),temaAux.get().getTitulo(),temaAux.get().getResumen(),tipoAux.get().getNombre());
			}

			historialAccionService.registrarAccion(usuarioId, "Registró una solicitud de modificación al tema con ID: " + temaId);

		} catch (JsonProcessingException e) {
			throw new RuntimeException("Error al convertir solicitudes a JSON", e);
		}
    }


	@Override
	public Integer actualizarTemaLibre(TemaDto dto) {
		Integer temaId;

		try {
			// Validar que el temaId esté presente
			if (dto.getId() == null) {
				throw new IllegalArgumentException("Debe proporcionar el ID del tema a actualizar.");
			}

			// Obtener IDs de subáreas (puede ser null)
			Integer[] subareaIds = dto.getSubareas() != null
					? dto.getSubareas().stream().map(sa -> sa.getId()).toArray(Integer[]::new)
					: null;

			Integer[] coasesorIds = dto.getCoasesores() != null
					? dto.getCoasesores().stream().map(user -> user.getId()).toArray(Integer[]::new)
					: null;

			
			temaId = (Integer) entityManager.createNativeQuery(
							"SELECT actualizar_tema_libre(:temaId, :titulo, :resumen, :metodologia, :objetivos, :carreraId, :fechaLimite, :requisitos, :subareaIds, :coasesorIds)")
					.setParameter("temaId", dto.getId())
					.setParameter("titulo", dto.getTitulo())
					.setParameter("resumen", dto.getResumen())
					.setParameter("metodologia", dto.getMetodologia())
					.setParameter("objetivos", dto.getObjetivos())
					.setParameter("carreraId", dto.getCarrera() != null ? dto.getCarrera().getId() : null)
					.setParameter("fechaLimite", dto.getFechaLimite() != null ? dto.getFechaLimite().toLocalDate() : null)
					.setParameter("requisitos", dto.getRequisitos() != null ? dto.getRequisitos() : "")
					.setParameter("subareaIds", subareaIds)
					.setParameter("coasesorIds", coasesorIds)
					.getSingleResult();

			Optional<Tema> auxTema = temaRepository.findById(dto.getId());
            auxTema.ifPresent(tema -> saveHistorialTemaChange(tema, tema.getTitulo(), tema.getResumen(),
                    "Actualizacion del tema"));

			logger.info("Tema actualizado exitosamente: " + dto.getTitulo());
			try{
				historialAccionService.registrarAccion(String.valueOf(dto.getCoasesores().get(0).getId()), "Se actualizó al tema con ID: " + temaId );

			} catch(Exception ex){
				logger.warning("No se pudo registrar la acción de historial: " + ex.getMessage());
			}

		} catch (Exception e) {
			logger.severe("Error al actualizar tema: " + e.getMessage());
			throw new RuntimeException("No se pudo actualizar el tema", e);
		}
		return temaId;
	}


    @Transactional
    @Override
    public void reenvioSolicitudAprobacionTema(TemaDto dto, String usuarioId) {
        // Validar que el tema tenga ID
        if (dto.getId() == null) {
            throw new IllegalArgumentException("El tema debe tener un ID para reenviar la solicitud.");
        }

        // Obtener el usuario interno desde Cognito ID
        UsuarioDto usuDto = usuarioService.findByCognitoId(usuarioId);
        if (usuDto == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Usuario no encontrado con Cognito ID: " + usuarioId);
        }

        try {
            // Buscar la entidad Tema por ID
            Tema tema = temaRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Tema no encontrado con ID: " + dto.getId()));
            entityManager.createNativeQuery(
                            "SELECT procesar_reenvio_solicitud_aprobacion_tema(:temaId)")
                    .setParameter("temaId", tema.getId())
                    .getSingleResult();
            crearSolicitudAprobacionTemaV2(tema);
			historialAccionService.registrarAccion(usuarioId, "Se reenvió la solicitud de aprobación al tema con ID: " + tema.getId());

        } catch (Exception e) {
            logger.severe("Error al reenviar solicitud de aprobación: " + e.getMessage());
            throw new RuntimeException("No se pudo reenviar la solicitud de aprobación del tema", e);
        }

    }


    @Override
    @Transactional
    public String listarSolicitudesConUsuarios(Integer temaId, int offset, int limit) {
        Object result = entityManager
                .createNativeQuery(
                        "SELECT listar_solicitudes_con_usuarios(:temaId, :offset, :limit)")
                .setParameter("temaId", temaId)
                .setParameter("offset", offset)
                .setParameter("limit", limit)
                .getSingleResult();

        // El resultado viene como un objeto PGObject o String; toString() devuelve el JSON
        return result != null ? result.toString() : "[]";
    }

    @Override
    @Transactional()
    public String listarSolicitudesPendientesPorUsuario(String usuarioId, int offset, int limit) {
        // Si tu función espera un INTEGER para p_usuario_id, convierte o parsea según tu modelo:

        UsuarioDto usuDto = usuarioService.findByCognitoId(usuarioId);
        if (usuDto == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Usuario no encontrado con Cognito ID: " + usuarioId);
        }
        Integer uid = usuDto.getId();
        Object result = entityManager.createNativeQuery(
                        "SELECT listar_solicitudes_pendientes_por_usuario(:uid, :off, :lim)")
                .setParameter("uid", uid)
                .setParameter("off", offset)
                .setParameter("lim", limit)
                .getSingleResult();
        return result != null ? result.toString() : "[]";
    }

	@Override
	@Transactional
	public Integer createTemaFromOAI(TemaDto temaDto, Integer carreraId) {
		logger.info("Creating tema from OAI record: " + temaDto.getTitulo());

		try {
			// Validate carrera exists
			Carrera carrera = carreraRepository.findById(carreraId)
				.orElseThrow(() -> new RuntimeException("Carrera not found with id: " + carreraId));

			// Get FINALIZADO state
			EstadoTema estadoFinalizado = estadoTemaRepository.findByNombre("FINALIZADO")
				.orElseThrow(() -> new RuntimeException("Estado FINALIZADO not found"));

			// Create new tema
			Tema tema = TemaMapper.toEntity(temaDto);
			tema.setEstadoTema(estadoFinalizado); //all finalized temas will have this state
			// Save tema
			Tema savedTema = temaRepository.save(tema);

			// Save history entry
			saveHistorialTemaChange(savedTema, savedTema.getTitulo(), savedTema.getResumen(),
				"Tema creado desde importación OAI-PMH");

			logger.info("Tema created successfully from OAI with ID: " + savedTema.getId());
			historialAccionService.registrarAccion("Admin", "Se registró por OAI al tema con ID: " + savedTema.getId());

			return savedTema.getId();

		} catch (Exception e) {
			logger.severe("Error creating tema from OAI: " + e.getMessage());
			throw new RuntimeException("Failed to create tema from OAI record", e);
		}
	}

	public EstadoTemaEnum obtenerEstadoFromString(String valor) {
		EstadoTemaEnum estado;
		try {
			estado = EstadoTemaEnum.valueOf(valor);
		} catch (IllegalArgumentException | NullPointerException e) {
			throw new RuntimeException("No se encontró un estadoTema de nombre " + valor);
		}
		if(! estadoTemaRepository.existsByNombre(estado.name())){
			throw new RuntimeException("No se registró un estadoTema de nombre" + estado.name());
		}
		return estado;
	}

	public Tema validarTemaConEstado(Integer temaId, EstadoTemaEnum estado){
		return temaRepository
				.findTemaByIdAndEstadoTema_Nombre(temaId,estado.name())
				.orElseThrow( () -> new RuntimeException("No se encontró el tema"));
	}
	@Override
	@Transactional()
	public String listarSolicitudesPendientesTemaAlumnos(String usuarioId, int offset, int limit) {
		// Si tu función espera un INTEGER para p_usuario_id, convierte o parsea según tu modelo:

		UsuarioDto usuDto = usuarioService.findByCognitoId(usuarioId);
		if (usuDto == null) {
			throw new ResponseStatusException(
					HttpStatus.NOT_FOUND,
					"Usuario no encontrado con Cognito ID: " + usuarioId);
		}
		Integer uid = usuDto.getId();
		Object result = entityManager.createNativeQuery(
						"SELECT listar_solicitudes_pendientes_tema_alumnos(:uid, :off, :lim)")
				.setParameter("uid", uid)
				.setParameter("off", offset)
				.setParameter("lim", limit)
				.getSingleResult();
		return result != null ? result.toString() : "[]";
	}

	@Transactional
	public void proponerReasignacionParaSolicitudCese(
			Integer solicitudDeCeseOriginalId,
			Integer nuevoAsesorPropuestoId,
			String coordinadorCognitoSub
	) {
		log.info("Coordinador {}: Proponiendo reasignación para solicitud de cese ID {} al nuevo asesor ID {}",
				coordinadorCognitoSub, solicitudDeCeseOriginalId, nuevoAsesorPropuestoId);

		Usuario coordinador = usuarioRepository.findByIdCognito(coordinadorCognitoSub)
				.orElseThrow(() -> new ResourceNotFoundException("Coordinador no encontrado con CognitoSub: " + coordinadorCognitoSub));

		Solicitud solicitudDeCese = solicitudRepository.findById(solicitudDeCeseOriginalId)
				.orElseThrow(() -> new ResourceNotFoundException("Solicitud de cese original no encontrada con ID: " + solicitudDeCeseOriginalId));

		// Validar que el coordinador tenga permiso sobre la carrera de esta solicitud
		validarPermisoCoordinadorSobreSolicitud(coordinador, solicitudDeCese);

		// Validar que la solicitud de cese esté realmente APROBADA
		if (solicitudDeCese.getEstadoSolicitud() == null ||
				!"PREACEPTADA".equalsIgnoreCase(solicitudDeCese.getEstadoSolicitud().getNombre())) {
			throw new BusinessRuleException("Solo se puede proponer reasignación para solicitudes de cese que ya han sido aprobadas. Estado actual: " +
					(solicitudDeCese.getEstadoSolicitud() != null ? solicitudDeCese.getEstadoSolicitud().getNombre() : "NULO"));
		}

		Usuario nuevoAsesorPropuesto = usuarioRepository.findById(nuevoAsesorPropuestoId)
				.orElseThrow(() -> new ResourceNotFoundException("Nuevo asesor propuesto no encontrado con ID: " + nuevoAsesorPropuestoId));

		if (nuevoAsesorPropuesto.getTipoUsuario() == null ||
				!"profesor".equalsIgnoreCase(nuevoAsesorPropuesto.getTipoUsuario().getNombre())) {
			throw new IllegalArgumentException("El usuario ID " + nuevoAsesorPropuestoId + " no es un profesor/asesor válido.");
		}

		Tema temaAfectado = solicitudDeCese.getTema();
		if (temaAfectado == null) { // Debería ser cargado por Solicitud.tema si no es LAZY extremo
			temaAfectado = temaRepository.findById(solicitudDeCese.getTema().getId()) // Fallback por si acaso
					.orElseThrow(() -> new ResourceNotFoundException("Tema asociado a la solicitud no encontrado."));
		}

		EstadoSolicitud estadoReasignacionPendiente = estadoSolicitudRepository
			.findByNombre("PENDIENTE_ACEPTACION_ASESOR")
			.orElseThrow(() -> new ResourceNotFoundException("Estado de solicitud 'PENDIENTE_ACEPTACION_ASESOR' no encontrado."));
		// Completar el TODO: Actualizar la solicitud original

		solicitudDeCese.setEstadoSolicitud(estadoReasignacionPendiente);

		// solicitudDeCese.setFechaModificacion(OffsetDateTime.now()); // Si no tienes @PreUpdate en Solicitud
		solicitudRepository.save(solicitudDeCese);

		log.info("Solicitud de cese ID {} actualizada. Asesor propuesto: ID {}, Estado reasignación: {}",
				solicitudDeCeseOriginalId, nuevoAsesorPropuestoId, solicitudDeCese.getEstadoSolicitud().getNombre());

		historialAccionService.registrarAccion(coordinadorCognitoSub, "Solicitud de cese de asesor para tema " + temaAfectado.getId());

		RolSolicitud rolAsesorNuevo = rolSolicitudRepository
			.findByNombre("ASESOR_ENTRADA")
			.orElseThrow(() -> new ResourceNotFoundException("Rol de solicitud 'ASESOR_ENTRADA' no encontrado."));

		UsuarioXSolicitud usAsesorNuevo = new UsuarioXSolicitud();
            usAsesorNuevo.setSolicitud(solicitudDeCese);
            usAsesorNuevo.setUsuario(nuevoAsesorPropuesto);
            usAsesorNuevo.setRolSolicitud(rolAsesorNuevo);
            usAsesorNuevo.setActivo(true);
            usAsesorNuevo.setDestinatario(true);
            usAsesorNuevo.setFechaAccion(OffsetDateTime.now());
            usAsesorNuevo.setFechaCreacion(OffsetDateTime.now());
            usAsesorNuevo.setFechaModificacion(OffsetDateTime.now());
            usuarioXSolicitudRepository.save(usAsesorNuevo);
		
		// Enviar notificación al nuevo asesor propuesto
		String mensajeNotificacion = String.format(
				"Estimado/a %s %s, se le ha propuesto para asumir la asesoría del tema '%s'. Por favor, revise sus 'Propuestas de Asesoría' en el sistema.",
				nuevoAsesorPropuesto.getNombres(),
				nuevoAsesorPropuesto.getPrimerApellido(),
				temaAfectado.getTitulo()
		);

		// Asume que tienes nombres de módulo y tipo de notificación adecuados en SgtaConstants o BD
		String enlace = "/asesor/propuestas-asesoria"; // Enlace ejemplo a la página del asesor
		notificacionService.crearNotificacionParaUsuario(
				nuevoAsesorPropuestoId,
				"Asesores", // O un módulo específico para "Propuestas de Asesoría"
				"informativa", // O un tipo específico "NuevaPropuestaAsesoria"
				mensajeNotificacion,
				"SISTEMA",
				enlace
		);

		log.info("Notificación de propuesta enviada al asesor ID: {}", nuevoAsesorPropuestoId);
	}

	private void validarPermisoCoordinadorSobreSolicitud(Usuario coordinador, Solicitud solicitud) {
		if (solicitud.getTema() == null || solicitud.getTema().getCarrera() == null) {
			throw new BusinessRuleException("La solicitud no tiene un tema o carrera asociada para validar permisos.");
		}
		Integer carreraDeLaSolicitudId = solicitud.getTema().getCarrera().getId();
		boolean perteneceACarreraDelCoordinador = usuarioXCarreraRepository.findByUsuarioIdAndActivoTrue(coordinador.getId())
				.stream()
				.anyMatch(uc -> uc.getCarrera() != null && uc.getCarrera().getId().equals(carreraDeLaSolicitudId));
		if (!perteneceACarreraDelCoordinador) {
			throw new AccessDeniedException("No tiene permisos para gestionar esta solicitud ya que no pertenece a sus carreras.");
		}
	}

	@Transactional
	@Override
	public void updateSolicitudesCoordinador(String usuarioId, Integer solicitudId,String respuesta) {

		Usuario coordinador = usuarioRepository.findByIdCognito(usuarioId)
				.orElseThrow(() -> new ResourceNotFoundException("Coordinador no encontrado con CognitoSub: " + usuarioId));

		Solicitud solicitud = solicitudRepository.findWithTipoSolicitudById(solicitudId)
				.orElseThrow(() -> new RuntimeException("Solicitud no encontrada con ID: " + solicitudId));

		TipoSolicitud tipo = solicitud.getTipoSolicitud();

		try {
			String query = switch (tipo.getNombre()) {
                case "Solicitud de cambio de resumen" ->
                        "SELECT atender_solicitud_alumno_resumen(:solicitudId,:coordinadorId,:respuesta)";
                case "Solicitud de cambio de título" ->
                        "SELECT atender_solicitud_alumno_titulo(:solicitudId,:coordinadorId,:respuesta)";
                case "Solicitud de cambio de objetivos" -> "SELECT atender_solicitud_alumno_objetivos(:solicitudId,:coordinadorId,:respuesta)";

				case "Solicitud de cambio de subárea academica" -> "SELECT atender_solicitud_alumno_subarea(:solicitudId,:coordinadorId,:respuesta)";

				default -> throw new RuntimeException("Tipo de solicitud no reconocido: " + tipo);
            }; 

            Query nativeQuery = entityManager.createNativeQuery(query)
					.setParameter("solicitudId", solicitudId)
					.setParameter("coordinadorId", coordinador.getId())
					.setParameter("respuesta", respuesta);



            Number result = (Number) nativeQuery.getSingleResult();

			Tema temaAux = temaRepository.findById(solicitud.getTema().getId())
					.orElseThrow(() -> new RuntimeException("Tema no encontrado con ID: " + solicitud.getTema().getId()));

			saveHistorialTemaChange(temaAux, temaAux.getTitulo(), temaAux.getResumen(), "Solicitud de " + tipo.getNombre() + "aprobada" );
			historialAccionService.registrarAccion(usuarioId, "Se aprobó la solicitud del tipo " + tipo.getNombre()  + " del tema con ID: " + solicitud.getTema().getId());

		} catch (Exception e) {
			Logger.getLogger(TemaServiceImpl.class.getName())
					.severe("Error procesando solicitud tipo " + solicitudId + ": " + e.getMessage());
			throw new RuntimeException("Error al procesar la solicitud", e);
		}
	}

	@Override
	public List<UsuarioDto> listarProfesoresPorSubareasConMatch(List<Integer> subareaIds) {
		if (subareaIds == null || subareaIds.isEmpty()) {
			return new ArrayList<>();
		}
		
		Integer[] subareaArray = subareaIds.toArray(new Integer[0]);
		
		String sql = "SELECT usuario_id, nombres, primer_apellido, segundo_apellido, " +
					"correo_electronico, subarea_ids, subarea_nombres " +
					"FROM listar_profesores_por_subareas_con_match(:subareaIds)";
		
		@SuppressWarnings("unchecked")
		List<Object[]> resultados = entityManager
				.createNativeQuery(sql)
				.setParameter("subareaIds", subareaArray)
				.getResultList();
		
		List<UsuarioDto> profesores = new ArrayList<>();
		
		for (Object[] fila : resultados) {
			// Extraer arrays de IDs y nombres de subáreas
			Integer[] subareaIdsArray = (Integer[]) fila[5];
			String[] subareaNombresArray = (String[]) fila[6];
			
			// Construir lista de SubAreaConocimientoDto
			List<SubAreaConocimientoDto> subareasList = new ArrayList<>();
			if (subareaIdsArray != null && subareaNombresArray != null) {
				for (int i = 0; i < subareaIdsArray.length; i++) {
					SubAreaConocimientoDto subarea = SubAreaConocimientoDto.builder()
							.id(subareaIdsArray[i])
							.nombre(subareaNombresArray[i])
							.build();
					subareasList.add(subarea);
				}
			}
			
			UsuarioDto profesor = UsuarioDto.builder()
					.id((Integer) fila[0])
					.nombres((String) fila[1])
					.primerApellido((String) fila[2])
					.segundoApellido((String) fila[3])
					.correoElectronico((String) fila[4])
					.subareas(subareasList) // Ahora con las subáreas pobladas
					.build();
					
			profesores.add(profesor);
		}
		
		return profesores;
	}
}
