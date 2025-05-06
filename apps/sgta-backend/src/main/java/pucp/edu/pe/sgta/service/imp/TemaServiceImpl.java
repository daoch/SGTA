package pucp.edu.pe.sgta.service.imp;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.SubAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.mapper.TemaMapper;
import pucp.edu.pe.sgta.mapper.UsuarioMapper;
import pucp.edu.pe.sgta.model.*;
import pucp.edu.pe.sgta.repository.*;
import pucp.edu.pe.sgta.service.inter.SubAreaConocimientoService;
import pucp.edu.pe.sgta.service.inter.TemaService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;
import pucp.edu.pe.sgta.util.EstadoTemaEnum;
import pucp.edu.pe.sgta.util.RolEnum;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
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

	@PersistenceContext
	private EntityManager entityManager;

	public TemaServiceImpl(TemaRepository temaRepository, UsuarioXTemaRepository usuarioXTemaRepository,
			UsuarioService usuarioService, SubAreaConocimientoService subAreaConocimientoService,
			SubAreaConocimientoXTemaRepository subAreaConocimientoXTemaRepository, RolRepository rolRepository,
			EstadoTemaRepository estadoTemaRepository, UsuarioXCarreraRepository usuarioCarreraRepository,
			CarreraRepository carreraRepository) {
		this.temaRepository = temaRepository;
		this.usuarioXTemaRepository = usuarioXTemaRepository;
		this.subAreaConocimientoXTemaRepository = subAreaConocimientoXTemaRepository;
		this.subAreaConocimientoService = subAreaConocimientoService;
		this.usuarioService = usuarioService;
		this.rolRepository = rolRepository;
		this.estadoTemaRepository = estadoTemaRepository;
		this.usuarioCarreraRepository = usuarioCarreraRepository;
		this.carreraRepository = carreraRepository;
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

	@Transactional
	@Override
	public void createTemaPropuesta(TemaDto dto, Integer idUsuarioCreador) {
		dto.setId(null);
		Tema tema = TemaMapper.toEntity(dto);
		EstadoTema estadoTema = estadoTemaRepository.findByNombre(EstadoTemaEnum.PROPUESTO_GENERAL.name()).orElse(null);
		boolean foundSubArea = false;

		if (estadoTema == null) {
			logger.severe("Alerta: EstadoTema 'PROPUESTO_GENERAL' no encontrado en la base de datos.");
			throw new RuntimeException("EstadoTema 'PROPUESTO_GENERAL' no encontrado en la base de datos.");
		}
		tema.setEstadoTema(estadoTema);

		// TO DO limit by number of cotesistas and asesores according to global config
		// parameter

		// Create and set up UsuarioXTema

		UsuarioXTema usuarioXTema = new UsuarioXTema();
		usuarioXTema.setId(null);
		usuarioXTema.setTema(tema);

		UsuarioDto usuarioDto = usuarioService.findUsuarioById(idUsuarioCreador);

		if (usuarioDto == null) {
			throw new RuntimeException("Usuario no encontrado con ID: " + idUsuarioCreador);
		}

		// Save the Tema first to generate its ID. We assume the tema has an
		// areaEspecializacion
		temaRepository.save(tema);

		// TO DO Start Historial Tema

		Rol rolaux = rolRepository.findByNombre("Creador").orElse(null);
		if (rolaux == null) {
			logger.severe("Alerta: Rol 'Creador' no encontrado en la base de datos.");
			throw new RuntimeException("Rol 'Creador' no encontrado en la base de datos.");
		}
		usuarioXTema.setUsuario(UsuarioMapper.toEntity(usuarioDto));
		usuarioXTema.setAsignado(true);
		usuarioXTema.setActivo(true);
		usuarioXTema.setFechaCreacion(OffsetDateTime.now());
		usuarioXTema.setRol(rolaux);
		try {
			usuarioXTemaRepository.save(usuarioXTema);
		}
		catch (Exception ex) {
			logger.severe("Error when attempting to save tema's creator: " + ex.getMessage());
			// this RuntimeException will trigger a rollback of the entire transaction
			throw new RuntimeException("UsuarioXTema register not created. Reverting transaction.", ex);
		}
		// Save the subareas of knowledge
		if (dto.getIdSubAreasConocimientoList() == null || dto.getIdSubAreasConocimientoList().isEmpty()) {
			throw new RuntimeException("No subAreaConocimiento provided. Reverting transaction.");
		}

		for (Integer idSubAreaConocimiento : dto.getIdSubAreasConocimientoList()) {
			SubAreaConocimientoXTema subAreaConocimientoXTema = new SubAreaConocimientoXTema();
			subAreaConocimientoXTema.setTemaId(tema.getId());
			SubAreaConocimientoDto subAreaConocimientoDto = subAreaConocimientoService.findById(idSubAreaConocimiento);

			if (subAreaConocimientoDto == null) {
				logger.severe("Alert: SubAreaConocimiento not found with ID: " + idSubAreaConocimiento);
				continue;
			}
			else {
				foundSubArea = true;
			}
			subAreaConocimientoXTema.setSubAreaConocimientoId(idSubAreaConocimiento);
			subAreaConocimientoXTema.setFechaCreacion(OffsetDateTime.now());
			subAreaConocimientoXTemaRepository.save(subAreaConocimientoXTema);
		}

		// validate if at least one subarea was found
		if (!foundSubArea) {
			logger.severe("Alerta: No valid subareaconocimientos provided.");
			throw new RuntimeException("No subAreaConocimiento provided. Reverting transaction.");
		}

		// Add the other users
		for (Integer idUsuarioInvolucrado : dto.getIdUsuarioInvolucradosList()) {
			UsuarioXTema usuarioXTemaInvolucrado = new UsuarioXTema();
			usuarioXTemaInvolucrado.setId(null);
			usuarioXTemaInvolucrado.setTema(tema);

			if (idUsuarioInvolucrado.equals(idUsuarioCreador)) { // In case the same
																	// idcreador is passed
																	// as involucrado
				logger.warning(
						"Alerta: Usuario involucrado no puede ser el creador del tema. ID: " + idUsuarioInvolucrado);
				continue;
			}

			// add rol, FIRST fetch usuario
			UsuarioDto usuarioInvolucradoDto = usuarioService.findUsuarioById(idUsuarioInvolucrado);
			if (usuarioInvolucradoDto == null) {
				logger.severe("Alerta: Usuario no encontrado con ID: " + idUsuarioInvolucrado);
				continue;
			}

			// TO DO ver tipo de usuario
			String nombreTipoUsuario = usuarioInvolucradoDto.getTipoUsuario().getNombre();
			Rol rol = rolRepository.findByNombre(nombreTipoUsuario).orElse(null);

			if (rol == null) {
				logger.severe("Alerta: Rol '" + nombreTipoUsuario + "' not found in database.");
				continue;
			}

			usuarioXTemaInvolucrado.setUsuario(UsuarioMapper.toEntity(usuarioInvolucradoDto));
			usuarioXTemaInvolucrado.setAsignado(false); // Not assigned but part of the
														// propuesta lest he doesn't
														// accept it
			usuarioXTemaInvolucrado.setActivo(true);
			usuarioXTemaInvolucrado.setFechaCreacion(OffsetDateTime.now());

			usuarioXTemaRepository.save(usuarioXTemaInvolucrado);
		}
	}

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

    @Override
    public void createInscripcionTema(TemaDto dto, Integer idUsuarioCreador) {
        dto.setId(null);
        // Prepara y guarda el tema con estado INSCRITO
        Tema tema = prepareNewTema(dto, EstadoTemaEnum.INSCRITO);
/////////////////////// se tiene que modificar si se puede elegir carrera, pararía como parámetro/////
		var relaciones = usuarioCarreraRepository.findByUsuarioIdAndActivoTrue(idUsuarioCreador);
		if(relaciones.isEmpty()) {
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

        // 1) Creador del tema (rol "Creador", asignado = true)
        saveUsuarioXTema(tema, idUsuarioCreador, RolEnum.Creador.name(), true);
        // 1) Asesor del tema (rol "Asesor", asignado = true)
        saveUsuarioXTema(tema, idUsuarioCreador, RolEnum.Asesor.name(), true);

        // 2) Subáreas de conocimiento
        saveSubAreas(tema, dto.getIdSubAreasConocimientoList());

        // 3) Coasesores
        saveUsuariosInvolucrados(tema, idUsuarioCreador,
            dto.getIdCoasesorInvolucradosList(), RolEnum.Coasesor.name(), true);

        // 4) Estudiantes
        saveUsuariosInvolucrados(tema, idUsuarioCreador,
            dto.getIdEstudianteInvolucradosList(), RolEnum.Tesista.name(), true);
    }

    /**
     * Crea y persiste un vínculo UsuarioXTema para el tema dado.
     * @param tema Tema al que asociar el usuario
     * @param idUsuario ID del usuario a asociar
     * @param rolNombre Nombre del rol (ej. "Creador", "Asesor", etc.)
     * @param asignado Flag si ya está asignado o pendiente
     */
    private void saveUsuarioXTema(Tema tema,
                                  Integer idUsuario,
                                  String rolNombre,
                                  boolean asignado) {
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
    private void saveSubAreas(Tema tema, List<Integer> subAreaIds) {
        if (subAreaIds == null || subAreaIds.isEmpty()) {
            throw new RuntimeException("No subAreaConocimiento proporcionadas");
        }
        boolean found = false;
        for (Integer id : subAreaIds) {
            SubAreaConocimientoDto saDto = subAreaConocimientoService.findById(id);
            if (saDto == null) {
                logger.warning("Subárea no encontrada: " + id);
                continue;
            }
            found = true;
            SubAreaConocimientoXTema sat = new SubAreaConocimientoXTema();
            sat.setTemaId(tema.getId());
            sat.setSubAreaConocimientoId(id);
            sat.setFechaCreacion(OffsetDateTime.now());
            subAreaConocimientoXTemaRepository.save(sat);
        }
        if (!found) {
            throw new RuntimeException("Ninguna subárea válida encontrada");
        }
    }

    private void saveUsuariosInvolucrados(Tema tema,
                                          Integer idUsuarioCreador,
                                          List<Integer> involucrados,
                                          String rolNombre,
                                          boolean asignado) {
        if (involucrados == null) return;
        for (Integer idInv : involucrados) {
            if (idInv.equals(idUsuarioCreador)) {
                logger.warning("Omitiendo creador en involucrados: " + idInv);
                continue;
            }
            UsuarioDto invDto = usuarioService.findUsuarioById(idInv);
            if (invDto == null) {
                logger.warning("Usuario involucrado no encontrado: " + idInv);
                continue;
            }
            saveUsuarioXTema(tema, idInv, rolNombre, asignado);
        }
    }

	@Override
	public List<TemaDto> listarTemasPropuestosAlAsesor(Integer asesorId) {
		String sql = "SELECT * FROM listar_temas_propuestos_al_asesor(:asesorId)";

		List<Object[]> resultados = entityManager
				.createNativeQuery(sql)
				.setParameter("asesorId", asesorId)
				.getResultList();

		List<TemaDto> lista = new ArrayList<>();

		for (Object[] fila : resultados) {
			TemaDto dto = new TemaDto(); // Si fila[0] es un Integer
			dto.setId((Integer) fila[0]);  // Si fila[0] es un Integer
			// tema_id
			dto.setTitulo((String) fila[1]);                 // titulo

			// subarea_ids (arreglo de Integer[])
			Integer[] subareaArray = (Integer[]) fila[3];  // fila[3] debe ser un Integer[]
			List<Integer> subareaIds = Arrays.asList(subareaArray);  // Convertimos a lista
			dto.setIdSubAreasConocimientoList(subareaIds);

			// alumno (arreglo de Integer[])
			Integer[] alumnoArray = (Integer[]) fila[5];  // fila[5] debe ser un Integer[]
			List<Integer> alumnoIds = Arrays.asList(alumnoArray);  // Convertimos a lista
			dto.setIdEstudianteInvolucradosList(alumnoIds);

			dto.setResumen((String) fila[6]);  // descripcion
			dto.setMetodologia((String) fila[7]);  // metodologia
			dto.setObjetivos((String) fila[8]);  // objetivo
			dto.setPortafolioUrl((String) fila[9]);  // recurso
			dto.setActivo((Boolean) fila[10]);  // activo

			// Manejar fechas
			dto.setFechaLimite(fila[11] != null ? ((Instant) fila[11]).atOffset(ZoneOffset.UTC) : null);
			dto.setFechaCreacion(fila[12] != null ? ((Instant) fila[12]).atOffset(ZoneOffset.UTC) : null);
			dto.setFechaModificacion(fila[13] != null ? ((Instant) fila[13]).atOffset(ZoneOffset.UTC) : null);

			lista.add(dto);
		}

		return lista;
	}

	@Override
    public List<TemaDto> listarTemasPorUsuarioRolEstado(Integer usuarioId,
                                                       String rolNombre,
                                                       String estadoNombre) {
        List<Object[]> rows = temaRepository.listarTemasPorUsuarioRolEstado(
            usuarioId, rolNombre, estadoNombre
        );
        List<TemaDto> resultados = new ArrayList<>();
        for (Object[] r : rows) {
            TemaDto dto = TemaDto.builder()
                .id((Integer) r[0])
                .titulo((String) r[1])
                .resumen((String) r[2])
                .metodologia((String) r[3])
                .objetivos((String) r[4])
                .portafolioUrl((String) r[5])
                .activo((Boolean) r[6])
                .fechaLimite(
                  r[7] != null
                    ? ((Instant) r[7]).atOffset(ZoneOffset.UTC)
                    : null
                )
                .fechaCreacion(
                  r[8] != null
                    ? ((Instant) r[8]).atOffset(ZoneOffset.UTC)
                    : null
                )
                .fechaModificacion(
                  r[9] != null
                    ? ((Instant) r[9]).atOffset(ZoneOffset.UTC)
                    : null
                )
                .build();
            resultados.add(dto);
        }
        return resultados;
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
                    : null
                )
                .build();
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
    public List<TemaDto> listarTemasPorUsuarioEstadoYRol(Integer asesorId, String rolNombre, String estadoNombre) {
        // primero cargo los temas con estado INSCRITO y rol Asesor
        List<TemaDto> temas = listarTemasPorUsuarioRolEstado(
            asesorId, 
            rolNombre, 
            estadoNombre
        );

        // por cada tema cargo coasesores, tesistas y subáreas
        for (TemaDto t : temas) {
            t.setCoasesores(
                listarUsuariosPorTemaYRol(t.getId(), RolEnum.Coasesor.name())
            );
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
	public List<TemaDto> listarTemasPropuestosPorSubAreaConocimiento(List<Integer> subareaIds) {
		String sql = "SELECT * FROM listar_temas_propuestos_por_subarea_conocimiento(:subareas)";

		// Convertimos la lista a un arreglo para que se interprete como un único parámetro tipo ARRAY
		Integer[] subareaArray = subareaIds.toArray(new Integer[0]);

		List<Object[]> resultados = entityManager
				.createNativeQuery(sql)
				.setParameter("subareas", subareaArray)
				.getResultList();

		List<TemaDto> lista = new ArrayList<>();

		for (Object[] fila : resultados) {
			TemaDto dto = new TemaDto();
			dto.setId((Integer) fila[0]);                        // tema_id
			dto.setTitulo((String) fila[1]);                     // titulo
			dto.setIdSubAreasConocimientoList(Arrays.asList((Integer[]) fila[2])); // subareas_id[]
			dto.setIdEstudianteInvolucradosList(Arrays.asList((Integer[]) fila[3])); // alumnos_id[]
			dto.setResumen((String) fila[4]);                    // descripcion
			dto.setMetodologia((String) fila[5]);                // metodologia
			dto.setObjetivos((String) fila[6]);                  // objetivo
			dto.setPortafolioUrl((String) fila[7]);              // recurso
			dto.setActivo((Boolean) fila[8]);                    // activo
			dto.setFechaLimite(fila[9] != null ? ((Instant) fila[9]).atOffset(ZoneOffset.UTC) : null);
			dto.setFechaCreacion(fila[10] != null ? ((Instant) fila[10]).atOffset(ZoneOffset.UTC) : null);
			dto.setFechaModificacion(fila[11] != null ? ((Instant) fila[11]).atOffset(ZoneOffset.UTC) : null);
			lista.add(dto);
		}

		return lista;
	}

	@Transactional
	public void postularAsesorTemaPropuestoGeneral(Integer alumnoId,Integer asesorId, Integer temaId,String comentario) {
		entityManager
				.createNativeQuery("SELECT postular_asesor_a_tema(:alumnoId, :asesorId, :temaId, :comentario)")
				.setParameter("alumnoId", alumnoId)
				.setParameter("asesorId", asesorId)
				.setParameter("temaId", temaId)
				.setParameter("comentario", comentario)
				.getSingleResult();
	}

	@Transactional
	public void enlazarTesistasATemaPropuestDirecta(Integer[] usuariosId, Integer temaId, Integer profesorId, String comentario) {
		entityManager.createNativeQuery("SELECT  enlazar_tesistas_tema_propuesta_directa(:usuariosId, :temaId, :profesorId, :comentario)")
				.setParameter("usuariosId", usuariosId)
				.setParameter("temaId", temaId)
				.setParameter("profesorId", profesorId)
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









	}