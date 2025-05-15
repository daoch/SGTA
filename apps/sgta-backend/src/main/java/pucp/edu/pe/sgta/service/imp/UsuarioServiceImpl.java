package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sgta.dto.asesores.InfoAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.asesores.InfoSubAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.asesores.PerfilAsesorDto;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import pucp.edu.pe.sgta.dto.TipoUsuarioDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.dto.asesores.UsuarioFotoDto;
import pucp.edu.pe.sgta.mapper.InfoAreaConocimientoMapper;
import pucp.edu.pe.sgta.mapper.InfoSubAreaConocimientoMapper;
import pucp.edu.pe.sgta.mapper.PerfilAsesorMapper;
import pucp.edu.pe.sgta.mapper.UsuarioMapper;
import pucp.edu.pe.sgta.model.*;
import pucp.edu.pe.sgta.repository.*;
import pucp.edu.pe.sgta.service.inter.UsuarioService;
import pucp.edu.pe.sgta.util.Utils;

import java.io.IOException;
import java.util.ArrayList;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.List;

@Service
public class UsuarioServiceImpl implements UsuarioService {

	private final UsuarioRepository usuarioRepository;
	private final UsuarioXSubAreaConocimientoRepository usuarioXSubAreaConocimientoRepository;
	private final SubAreaConocimientoRepository subAreaConocimientoRepository;
	private final AreaConocimientoRepository areaConocimientoRepository;
	private final UsuarioXAreaConocimientoRepository usuarioXAreaConocimientoRepository;
	private final CarreraRepository carreraRepository;
	private final UsuarioXTemaRepository usuarioXTemaRepository;

	@PersistenceContext
    private EntityManager em;

	public UsuarioServiceImpl(UsuarioRepository usuarioRepository
							, UsuarioXSubAreaConocimientoRepository usuarioXSubAreaConocimientoRepository
							, SubAreaConocimientoRepository subAreaConocimientoRepository
							, AreaConocimientoRepository areaConocimientoRepository
							, UsuarioXAreaConocimientoRepository usuarioXAreaConocimientoRepository, CarreraRepository carreraRepository
							,UsuarioXTemaRepository usuarioXTemaRepository) {
		this.usuarioRepository = usuarioRepository;
		this.usuarioXSubAreaConocimientoRepository = usuarioXSubAreaConocimientoRepository;
		this.subAreaConocimientoRepository = subAreaConocimientoRepository;
		this.areaConocimientoRepository = areaConocimientoRepository;
		this.usuarioXAreaConocimientoRepository = usuarioXAreaConocimientoRepository;
		this.carreraRepository = carreraRepository;
		this.usuarioXTemaRepository = usuarioXTemaRepository;
	}

	@Override
	public void createUsuario(UsuarioDto usuarioDto) {
		usuarioDto.setId(null);

		Usuario usuario = UsuarioMapper.toEntity(usuarioDto);

		usuarioRepository.save(usuario);
	}

	@Override
	public UsuarioDto findUsuarioById(Integer id) {
		Usuario usuario = usuarioRepository.findById(id).orElse(null);
		if (usuario != null) {
			return UsuarioMapper.toDto(usuario);
		}
		return null;
	}

	@Override
	public List<UsuarioDto> findAllUsuarios() {
		return List.of();
	}

	@Override
	public void updateUsuario(UsuarioDto usuarioDto) {

	}

	@Override
	public void deleteUsuario(Integer id) {

	}

	@Override
	public PerfilAsesorDto getPerfilAsesor(Integer id){
		//Primero los datos básicos de la entidad
		PerfilAsesorDto tmp;
		Usuario usuario = usuarioRepository.findById(id).orElse(null);
		if (usuario == null) {
			throw new RuntimeException("Usuario no encontrado con ID: " + id);
		}
		tmp = PerfilAsesorMapper.toDto(usuario);
		//Encontramos el nombre de la carrera del Asesor
		List<String> carreras = new ArrayList<>();
		List<Object[]> resultadoQuery = carreraRepository.listarCarrerasPorIdUsusario(id);
		for (Object[] o : resultadoQuery) {
			carreras.add((String) o[3]);
		}

		tmp.setEspecialidad(String.join(" - ",carreras));
		//Luego la consulta de las áreas de conocimiento
		List<InfoAreaConocimientoDto> areas;
		List<Integer> idAreas = usuarioXAreaConocimientoRepository.findAllByUsuario_IdAndActivoIsTrue(id).
				stream()
				.map(UsuarioXAreaConocimiento::getAreaConocimiento)
				.map(AreaConocimiento::getId)
				.toList();
		areas = areaConocimientoRepository.findAllByIdIn(idAreas)
				.stream()
				.map(InfoAreaConocimientoMapper::toDto)
				.toList();
		//Luego la consulta de las areas de conocimiento
		List<InfoSubAreaConocimientoDto> subareas;
		List<Integer> idSubareas = usuarioXSubAreaConocimientoRepository.findAllByUsuario_IdAndActivoIsTrue(id).
									stream()
									.map(UsuarioXSubAreaConocimiento::getSubAreaConocimiento)
									.map(SubAreaConocimiento::getId)
									.toList();
		subareas = subAreaConocimientoRepository.findAllByIdIn(idSubareas)
				.stream()
				.map(InfoSubAreaConocimientoMapper::toDto)
				.toList();

		tmp.setAreasTematicas(areas);
		tmp.setTemasIntereses(subareas);
		//TODO: El numero máximo de estudiantes
		//TODO: La cantidad de alumnos por asesor
		Integer cantTesistas ;
		List<Object[]> tesistas =usuarioXTemaRepository.listarNumeroTesistasAsesor(id);//ASEGURADO sale 1 sola fila
		cantTesistas = (Integer) tesistas.get(0)[0];
		tmp.setTesistasActuales(cantTesistas);

		return tmp;
	}
	@Override
	public void updatePerfilAsesor(PerfilAsesorDto perfilAsesorDto){
		Usuario user = usuarioRepository.findById(perfilAsesorDto.getId()).orElse(null);
		if (user == null) {
			throw new RuntimeException("Usuario no encontrado con ID: " + perfilAsesorDto.getId());
		}
		user.setEnlaceLinkedin(perfilAsesorDto.getLinkedin());
		user.setEnlaceRepositorio(perfilAsesorDto.getRepositorio());
		user.setCorreoElectronico(perfilAsesorDto.getEmail());
		user.setBiografia(perfilAsesorDto.getBiografia());

		usuarioRepository.save(user);
		//Revision areas temáticas
		List<Integer> areasRegistradas = usuarioXAreaConocimientoRepository.findAllByUsuario_IdAndActivoIsTrue(user.getId())
				.stream()
				.map(UsuarioXAreaConocimiento::getAreaConocimiento)
				.map(AreaConocimiento::getId)
				.toList();
		List<Integer> areasActualizadas = perfilAsesorDto.getAreasTematicas()
				.stream()
				.map(InfoAreaConocimientoDto::getIdArea)
				.toList();
			//Id's que no estan registrados (Todos los que entraron - los que ya estaban=
		List<Integer> idNuevos = new ArrayList<>(areasActualizadas);
		idNuevos.removeAll(areasRegistradas);
		usuarioXAreaConocimientoRepository.asignarUsuarioAreas(user.getId(), Utils.convertIntegerListToString(idNuevos));
			//Id's que ya no estan en registrados (Todos los que habian - los que entraron)
		List<Integer> idEliminados = new ArrayList<>(areasRegistradas);
		idEliminados.removeAll(areasActualizadas);
		usuarioXAreaConocimientoRepository.desactivarUsuarioAreas(user.getId(), Utils.convertIntegerListToString(idEliminados));

		//Revision sub areas tematicas
		List<Integer> subAreasRegistradas = usuarioXSubAreaConocimientoRepository.findAllByUsuario_IdAndActivoIsTrue(user.getId())
				.stream()
				.map(UsuarioXSubAreaConocimiento::getSubAreaConocimiento)
				.map(SubAreaConocimiento::getId)
				.toList();
		List<Integer> subAreasActualizadas = perfilAsesorDto.getTemasIntereses()
				.stream()
				.map(InfoSubAreaConocimientoDto::getIdTema)
				.toList();
		//Id's que no estan registrados (Todos los que entraron - los que ya estaban=
		idNuevos = new ArrayList<>(subAreasActualizadas);
		idNuevos.removeAll(subAreasRegistradas);
		usuarioXSubAreaConocimientoRepository.asignarUsuarioSubAreas(user.getId(), Utils.convertIntegerListToString(idNuevos));
		//Id's que ya no estan en registrados (Todos los que habian - los que entraron)
		idEliminados = new ArrayList<>(subAreasRegistradas);
		idEliminados.removeAll(subAreasActualizadas);
		usuarioXSubAreaConocimientoRepository.desactivarUsuarioSubAreas(user.getId(), Utils.convertIntegerListToString(idEliminados));
	}

	@Override
	public void uploadFoto(Integer idUsuario, MultipartFile file) {
		Usuario user = usuarioRepository.findById(idUsuario).orElse(null);
		if (user == null) {
			throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
		}
        try {
            user.setFotoPerfil(file.getBytes());
			usuarioRepository.save(user);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo subir foto del usuario: " + idUsuario);
        }
    }

	@Override
	public UsuarioFotoDto getUsuarioFoto(Integer id) {
		Usuario user = usuarioRepository.findById(id).orElse(null);
		if (user == null) {
			throw new RuntimeException("Usuario no encontrado con ID: " + id);
		}
		UsuarioFotoDto usuarioFotoDto = new UsuarioFotoDto();
		usuarioFotoDto.setIdUsuario(id);

		String fotoBase64 = user.getFotoPerfil() != null? Base64.getEncoder().encodeToString(user.getFotoPerfil()) : null;
		usuarioFotoDto.setFoto(fotoBase64);
		return usuarioFotoDto;
	}

	@Override
	public Integer getIdByCorreo(String correo) {
		Usuario user = usuarioRepository.findByCorreoElectronicoIsLikeIgnoreCase(correo);
		if (user == null) {
			throw new RuntimeException("Usuario no encontrado con CORREO: " + correo);
		}
		return user.getId();
	}

	@Override
	public List<UsuarioDto> findUsuariosByRolAndCarrera(String tipoUsuario, Integer carreraId, String cadenaBusqueda) {
		String sql = """
			SELECT *
			FROM obtener_usuarios_por_tipo_carrera_y_busqueda(:tipo, :carrera, :cadena)
			""";

		@SuppressWarnings("unchecked")
		List<Object[]> rows = em.createNativeQuery(sql)
			.setParameter("tipo", tipoUsuario)
			.setParameter("carrera", carreraId)
			.setParameter("cadena", cadenaBusqueda)
			.getResultList();

		List<UsuarioDto> lista = new ArrayList<>();
		for (Object[] r : rows) {
			// 0..20 según la firma de la función
			// 16 = u_fecha_creacion, 17 = u_fecha_modificacion
			// convierte de Instant o Timestamp a OffsetDateTime
			Instant rawCreacion = (r[16] instanceof Instant
				? (Instant) r[16]
				: ((Timestamp) r[16]).toInstant());
			OffsetDateTime fechaCreacion = rawCreacion.atOffset(ZoneOffset.UTC);

			OffsetDateTime fechaModificacion = null;
			if (r[17] != null) {
				Instant rawMod = (r[17] instanceof Instant
					? (Instant) r[17]
					: ((Timestamp) r[17]).toInstant());
				fechaModificacion = rawMod.atOffset(ZoneOffset.UTC);
			}

			UsuarioDto u = UsuarioDto.builder()
				.id((Integer) r[0])
				.tipoUsuario(
					TipoUsuarioDto.builder()
						.id((Integer) r[1])
						.nombre((String) r[18])
						.activo(true)
						.build()
				)
				.codigoPucp((String) r[2])
				.nombres((String) r[3])
				.primerApellido((String) r[4])
				.segundoApellido((String) r[5])
				.correoElectronico((String) r[6])
				.nivelEstudios((String) r[7])
				.contrasena((String) r[8])
				.biografia((String) r[9])
				.enlaceLinkedin((String) r[10])
				.enlaceRepositorio((String) r[11])
				.disponibilidad((String) r[13])
				.tipoDisponibilidad((String) r[14])
				.activo((Boolean) r[15])
				.fechaCreacion(fechaCreacion)
				.fechaModificacion(fechaModificacion)
				.build();

			lista.add(u);
		}

		return lista;
	}
}
