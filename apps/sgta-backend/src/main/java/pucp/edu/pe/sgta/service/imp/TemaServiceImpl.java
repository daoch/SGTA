package pucp.edu.pe.sgta.service.imp;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import pucp.edu.pe.sgta.dto.*;
import pucp.edu.pe.sgta.dto.asesores.InfoTemaPerfilDto;
import pucp.edu.pe.sgta.dto.exposiciones.ExposicionTemaMiembrosDto;
import pucp.edu.pe.sgta.dto.exposiciones.MiembroExposicionDto;
import pucp.edu.pe.sgta.exception.CustomException;
import pucp.edu.pe.sgta.mapper.TemaMapper;
import pucp.edu.pe.sgta.mapper.UsuarioMapper;
import pucp.edu.pe.sgta.model.*;
import pucp.edu.pe.sgta.repository.*;
import pucp.edu.pe.sgta.service.inter.*;
import pucp.edu.pe.sgta.util.EstadoTemaEnum;
import pucp.edu.pe.sgta.util.RolEnum;
import pucp.edu.pe.sgta.util.TipoUsuarioEnum;

import java.io.IOException;
import java.sql.Array;
import java.sql.SQLException;
import java.time.*;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
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

	private final ExposicionService exposicionService;

	private final ExposicionXTemaRepository exposicionXTemaRepository;

	private final JornadaExposicionRepository jornadaExposicionRepository;

	private final ExposicionRepository exposicionRepository;

	private final JornadaExposicionXSalaExposicionRepository jornadaExposicionXSalaExposicionRepository;

	private final UsuarioXTemaRepository usuarioTemaRepository;

	private final ObjectMapper objectMapper = new ObjectMapper(); // for JSON conversion
	private final CarreraServiceImpl carreraServiceImpl;

	private final TipoSolicitudRepository        tipoSolicitudRepository;

	private final SolicitudRepository            solicitudRepository;

	private final UsuarioXSolicitudRepository    usuarioXSolicitudRepository;

  	private final SubAreaConocimientoService subAreaService;


	@PersistenceContext
	private EntityManager entityManager;

	public TemaServiceImpl(TemaRepository temaRepository, UsuarioXTemaRepository usuarioXTemaRepository,
			UsuarioService usuarioService, SubAreaConocimientoService subAreaConocimientoService,
			SubAreaConocimientoXTemaRepository subAreaConocimientoXTemaRepository, RolRepository rolRepository,
			EstadoTemaRepository estadoTemaRepository, UsuarioXCarreraRepository usuarioCarreraRepository,
			CarreraRepository carreraRepository, HistorialTemaService historialTemaService,
			UsuarioRepository usuarioRepository, CarreraServiceImpl carreraServiceImpl,  ExposicionService exposicionService,
			ExposicionXTemaRepository exposicionXTemaRepository,
			JornadaExposicionRepository jornadaExposicionRepository, ExposicionRepository exposicionRepository,
			JornadaExposicionXSalaExposicionRepository jornadaExposicionXSalaExposicionRepository,
			UsuarioXTemaRepository usuarioTemaRepository, TipoSolicitudRepository tipoSolicitudRepository, 
			SolicitudRepository solicitudRepository,
			UsuarioXSolicitudRepository usuarioXSolicitudRepository) {
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
		this.exposicionService = exposicionService;
		this.exposicionXTemaRepository = exposicionXTemaRepository;
		this.jornadaExposicionRepository = jornadaExposicionRepository;
		this.exposicionRepository = exposicionRepository;
		this.jornadaExposicionXSalaExposicionRepository = jornadaExposicionXSalaExposicionRepository;
		this.usuarioTemaRepository = usuarioTemaRepository;
		this.tipoSolicitudRepository = tipoSolicitudRepository;
		this.solicitudRepository = solicitudRepository;
		this.usuarioXSolicitudRepository = usuarioXSolicitudRepository;
		this.subAreaService = subAreaConocimientoService;
		this.carreraServiceImpl = carreraServiceImpl;
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

	private void validacionesInscripcionTema(TemaDto dto) {

		validarDtoTemaNoNulo(dto); // validar que el DTO no sea nulo
		validarExistenciaListaUsuarios(dto.getTesistas());
		validarExistenciaListaUsuarios(dto.getCoasesores()); // validar que hay al menos un tesista
		Integer idUsuarioCreador = dto.getCoasesores().get(0).getId();
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
	public void createInscripcionTema(TemaDto dto) {

		validacionesInscripcionTema(dto);
		Integer idUsuarioCreador = dto.getCoasesores().get(0).getId();
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

	    /**
     * Crea una solicitud de aprobación de tema y la asigna a todos los coordinadores
     * activos de la carrera asociada.
     *
     * @param tema Tema recién creado al que se asociará la solicitud.
     */
    private void crearSolicitudAprobacionTema(Tema tema) {
        // 1) Obtener el tipo de solicitud
        TipoSolicitud tipoSolicitud = tipoSolicitudRepository
            .findByNombre("Aprobación de tema (por coordinador)")
            .orElseThrow(() ->
                new RuntimeException("Tipo de solicitud no configurado: Aprobación de tema (por coordinador)"));

        // 2) Construir y guardar la solicitud
        Solicitud solicitud = new Solicitud();
        solicitud.setDescripcion("Solicitud de aprobación de tema por coordinador");
        solicitud.setTipoSolicitud(tipoSolicitud);
        solicitud.setTema(tema);
        solicitud.setEstado(0); // Ajusta según tu convención (p.ej. 0 = PENDIENTE)
        Solicitud savedSolicitud = solicitudRepository.save(solicitud);

        // 3) Buscar los usuarios-coordinador de la carrera del tema
        List<UsuarioXSolicitud> asignaciones = usuarioCarreraRepository
            .findByCarreraIdAndActivoTrue(tema.getCarrera().getId()).stream()
            .map(rel -> rel.getUsuario())
            .filter(u -> TipoUsuarioEnum.coordinador.name().equalsIgnoreCase(u.getTipoUsuario().getNombre()))
            .map(coord -> {
                UsuarioXSolicitud us = new UsuarioXSolicitud();
                us.setUsuario(coord);
                us.setSolicitud(savedSolicitud);
                us.setDestinatario(true);
                us.setAprobado(false);
                us.setSolicitudCompletada(false);
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
			String estadoNombre) {

		UsuarioDto usuDto = usuarioService.findByCognitoId(usuarioId);
		List<Object[]> rows = temaRepository.listarTemasPorUsuarioRolEstado(
				usuDto.getId(), rolNombre, estadoNombre);

		Map<Integer, TemaDto> dtoMap = new LinkedHashMap<>();

		for (Object[] r : rows) {
			Integer temaId = (Integer) r[0];

			// Construye el DTO de área usando los índices corregidos
			AreaConocimientoDto areaDto = AreaConocimientoDto.builder()
				.id    ((Integer) r[14])   // ahora sí es area_id
				.nombre((String ) r[15])   // area_nombre
				.build();

			TemaDto dto = dtoMap.get(temaId);
			if (dto == null) {
				dto = TemaDto.builder()
					.id               ((Integer) r[0])
					.codigo           ((String ) r[1])
					.titulo           ((String ) r[2])
					.resumen          ((String ) r[3])
					.metodologia      ((String ) r[4])
					.objetivos        ((String ) r[5])
					.portafolioUrl    ((String ) r[6])
					.activo           ((Boolean) r[7])
					.fechaLimite      (r[8]  != null
									? ((Instant) r[8]).atOffset(ZoneOffset.UTC)
									: null)
					.fechaCreacion    (r[9]  != null
									? ((Instant) r[9]).atOffset(ZoneOffset.UTC)
									: null)
					.fechaModificacion(r[10] != null
									? ((Instant) r[10]).atOffset(ZoneOffset.UTC)
									: null)
					.requisitos       ((String ) r[11])
					.carrera          (
						CarreraDto.builder()
						.id    ((Integer) r[12])   // carrera_id
						.nombre((String ) r[13])   // carrera_nombre
						.build()
					)
					.area             (new ArrayList<>())
					.estadoTemaNombre (estadoNombre)
					.build();

				dtoMap.put(temaId, dto);
			}

			dto.getArea().add(areaDto);
		}

		return new ArrayList<>(dtoMap.values());
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
	public List<TemaDto> listarTemasPorUsuarioEstadoYRol(String asesorId, String rolNombre, String estadoNombre) {
		// primero cargo los temas con estado INSCRITO y rol Asesor
		List<TemaDto> temas = listarTemasPorUsuarioRolEstado(
				asesorId,
				rolNombre,
				estadoNombre);

        // por cada tema cargo coasesores, tesistas y subáreas
        for (TemaDto t : temas) {
            List<UsuarioDto> asesores = listarUsuariosPorTemaYRol(
				t.getId(),
				RolEnum.Asesor.name()
			);
			// 2) Obtengo a los coasesores (o la lista base que ya tenías)
			List<UsuarioDto> coasesores = listarUsuariosPorTemaYRol(
				t.getId(),
				RolEnum.Coasesor.name()
			);

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
                listarUsuariosPorTemaYRol(t.getId(), RolEnum.Tesista.name())
            );
            t.setSubareas(
                listarSubAreasPorTema(t.getId())
            );
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
	public List<TemaConAsesorJuradoDTO> listarTemasCicloActualXEtapaFormativa(Integer etapaFormativaId) {

		List<Object[]> temas = temaRepository.listarTemasCicloActualXEtapaFormativa(etapaFormativaId);
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
			dto.setEstudiantes(tesistas);

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
	public void crearTemaLibre(TemaDto dto,String asesorId) {

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
			entityManager.createNativeQuery("SELECT crear_tema_libre(:titulo, :resumen, :metodologia, :objetivos, :carreraId, :fechaLimite, :requisitos, :subareaIds, :coasesorIds)")
					.setParameter("titulo", dto.getTitulo())
					.setParameter("resumen", dto.getResumen())
					.setParameter("metodologia", dto.getMetodologia())
					.setParameter("objetivos", dto.getObjetivos())
					.setParameter("carreraId", dto.getCarrera() != null ? dto.getCarrera().getId() : null)
					.setParameter("fechaLimite", dto.getFechaLimite() != null ? dto.getFechaLimite().toLocalDate() : null)
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
		java.sql.Date sqlDate = (java.sql.Date) result[5];  // fecha_limite
		if (sqlDate != null) {
			LocalDate localDate = sqlDate.toLocalDate();
			OffsetDateTime offsetDateTime = localDate.atStartOfDay(ZoneOffset.UTC).toOffsetDateTime();
			dto.setFechaLimite(offsetDateTime);
		} else {
			dto.setFechaLimite(null);
		}
		dto.setRequisitos((String) result[6]);

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
				//SubAreaConocimientoDto subarea = new SubAreaConocimientoDto();
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
	@Transactional
	public List<TemaDto> listarTemasPorEstadoYCarrera(String estadoNombre, Integer carreraId) {
		String sql = "SELECT * FROM listar_temas_por_estado_y_carrera(:estado, :carreraId)";
		@SuppressWarnings("unchecked")
		List<Object[]> rows = entityManager.createNativeQuery(sql)
			.setParameter("estado", estadoNombre)
			.setParameter("carreraId", carreraId)
			.getResultList();

		Map<Integer, TemaDto> dtoMap = new LinkedHashMap<>();

		for (Object[] r : rows) {
			int temaId = ((Number) r[0]).intValue();

			// Área
			AreaConocimientoDto areaDto = AreaConocimientoDto.builder()
				.id    (((Number) r[14]).intValue())
				.nombre((String)  r[15])
				.build();

			TemaDto dto = dtoMap.get(temaId);
			if (dto == null) {
				dto = TemaDto.builder()
					.id               (((Number) r[0]).intValue())
					.codigo           ((String) r[1])
					.titulo           ((String) r[2])
					.resumen          ((String) r[3])
					.metodologia      ((String) r[4])
					.objetivos        ((String) r[5])
					.portafolioUrl    ((String) r[6])
					.requisitos       ((String) r[7])
					.estadoTemaNombre ((String) r[8])
					.fechaLimite      (toOffsetDateTime(r[9]))
					.fechaCreacion    (toOffsetDateTime(r[10]))
					.fechaModificacion(toOffsetDateTime(r[11]))
					.carrera(
					CarreraDto.builder()
						.id    (((Number) r[12]).intValue())
						.nombre((String)  r[13])
						.build()
					)
					.area(new ArrayList<>())
					.build();

				dtoMap.put(temaId, dto);
			}

			dto.getArea().add(areaDto);
		}

		List<TemaDto> resultados = new ArrayList<>(dtoMap.values());

		// por cada tema cargo coasesores, tesistas y subáreas
        for (TemaDto t : resultados) {
            List<UsuarioDto> asesores = listarUsuariosPorTemaYRol(
				t.getId(),
				RolEnum.Asesor.name()
			);
			// 2) Obtengo a los coasesores (o la lista base que ya tenías)
			List<UsuarioDto> coasesores = listarUsuariosPorTemaYRol(
				t.getId(),
				RolEnum.Coasesor.name()
			);

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
                listarUsuariosPorTemaYRol(t.getId(), RolEnum.Tesista.name())
            );
            t.setSubareas(
                listarSubAreasPorTema(t.getId())
            );
        }

		return resultados;
	}




	private void validarCoordinadorYEstado(
		Integer temaId,
		String nuevoEstadoNombre,
		Integer usuarioId
	) {
		validarTipoUsurio(usuarioId, TipoUsuarioEnum.coordinador.name());
		estadoTemaRepository.findByNombre(nuevoEstadoNombre)
			.orElseThrow(() -> new ResponseStatusException(
				HttpStatus.NOT_FOUND,
				"EstadoTema '" + nuevoEstadoNombre + "' no existe"
			));
		validarEstadoTema(temaId, EstadoTemaEnum.INSCRITO.name());
	}

	private Tema actualizarTemaYHistorial(
		Integer temaId,
		String nuevoEstadoNombre,
		String comentario
	) {
		Tema tema = validarEstadoTema(temaId, EstadoTemaEnum.INSCRITO.name());
		temaRepository.actualizarEstadoTema(temaId, nuevoEstadoNombre);
		saveHistorialTemaChange(
			tema,
			tema.getTitulo(),
			tema.getResumen(),
			comentario == null ? "" : comentario
		);
		return tema;
	}

	private Solicitud cargarSolicitud(Integer temaId) {
		return solicitudRepository
			.findByTipoSolicitudNombreAndTemaIdAndActivoTrue(
				"Aprobación de tema (por coordinador)",
				temaId
			)
			.orElseThrow(() -> new RuntimeException(
				"No existe solicitud de aprobación para el tema " + temaId
			));
	}

	private UsuarioXSolicitud actualizarUsuarioXSolicitud(
		Integer solicitudId,
		Integer usuarioId,
		String nuevoEstadoNombre,
		String comentario
	) {
		UsuarioXSolicitud uxs = usuarioXSolicitudRepository
			.findFirstBySolicitudIdAndUsuarioIdAndActivoTrue(solicitudId, usuarioId)
			.orElseThrow(() -> new RuntimeException(
				"No hay registro en usuario_solicitud para la solicitud "
				+ solicitudId + " y usuario " + usuarioId
			));

		uxs.setComentario(comentario);
		switch (nuevoEstadoNombre.toUpperCase()) {
			case "REGISTRADO":
				uxs.setAprobado(true);
				uxs.setSolicitudCompletada(true);
				break;
			case "RECHAZADO":
				uxs.setAprobado(false);
				uxs.setSolicitudCompletada(true);
				break;
			case "OBSERVADO":
				uxs.setAprobado(false);
				uxs.setSolicitudCompletada(true);
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
		String comentario
	) {
		switch (nuevoEstadoNombre.toUpperCase()) {
			case "REGISTRADO":
				solicitud.setEstado(3);
				break;
			case "RECHAZADO":
				solicitud.setEstado(2);
				break;
			case "OBSERVADO":
				solicitud.setEstado(1);
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
	 * @param temaId           Id del tema
	 * @param estadoEsperado   Nombre del estado que debe tener el tema (p.ej. "INSCRITO")
	 * @return tema            La entidad Tema ya validada
	 * @throws ResponseStatusException  404 si no existe el tema, 400 si no está en el estado esperado
	 */
	private Tema validarEstadoTema(Integer temaId, String estadoEsperado) {
		Tema tema = temaRepository.findById(temaId)
			.orElseThrow(() -> new ResponseStatusException(
				HttpStatus.NOT_FOUND,
				"Tema con id " + temaId + " no encontrado"
			));
		String estadoActual = tema.getEstadoTema().getNombre();
		if (!estadoEsperado.equalsIgnoreCase(estadoActual)) {
			throw new ResponseStatusException(
				HttpStatus.BAD_REQUEST,
				"Operación inválida: el tema debe estar en estado '" + estadoEsperado +
				"', pero está en '" + estadoActual + "'"
			);
		}
		return tema;
	}
		
	@Transactional
	@Override
	public void cambiarEstadoTemaCoordinador(
		Integer temaId,
		String nuevoEstadoNombre,
		Integer usuarioId,
		String comentario
	) {
		validarCoordinadorYEstado(temaId, nuevoEstadoNombre, usuarioId);

		actualizarTemaYHistorial(temaId, nuevoEstadoNombre, comentario);

		Solicitud solicitud = cargarSolicitud(temaId);

		actualizarUsuarioXSolicitud(
			solicitud.getId(),
			usuarioId,
			nuevoEstadoNombre,
			comentario
		);

		actualizarSolicitud(solicitud, nuevoEstadoNombre, comentario);
		if (EstadoTemaEnum.RECHAZADO.name().equalsIgnoreCase(nuevoEstadoNombre)) {
			desasignarUsuariosDeTema(temaId);
		}
	}

	private void desasignarUsuariosDeTema(Integer temaId) {
		List<UsuarioXTema> lista = usuarioXTemaRepository
			.findByTemaIdAndActivoTrue(temaId);  // ajusta el finder según tu repo
		
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
	public void eliminarTemaCoordinador(Integer temaId, Integer usuarioId) {
		// 1) Validación EXTERNA al procedure:
		//    Comprueba que usuarioId sea coordinador 
		validarTipoUsurio(usuarioId, TipoUsuarioEnum.coordinador.name());
		
		// 2) Obtener la carrera del tema y validar que el usuario esté activo en esa carrera
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

}