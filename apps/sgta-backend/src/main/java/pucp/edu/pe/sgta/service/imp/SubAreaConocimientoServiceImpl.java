package pucp.edu.pe.sgta.service.imp;

import jakarta.persistence.*;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.asesores.InfoAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.asesores.InfoSubAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.AreaConocimientoDto;
import pucp.edu.pe.sgta.dto.SubAreaConocimientoDto;
import pucp.edu.pe.sgta.mapper.InfoSubAreaConocimientoMapper;
import pucp.edu.pe.sgta.mapper.AreaConocimientoMapper;
import pucp.edu.pe.sgta.mapper.SubAreaConocimientoMapper;
import pucp.edu.pe.sgta.model.AreaConocimiento;
import pucp.edu.pe.sgta.model.SubAreaConocimiento;
import pucp.edu.pe.sgta.repository.AreaConocimientoRepository;
import pucp.edu.pe.sgta.repository.CarreraRepository;
import pucp.edu.pe.sgta.repository.SubAreaConocimientoRepository;
import pucp.edu.pe.sgta.service.inter.SubAreaConocimientoService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.context.ApplicationEventPublisher;
import pucp.edu.pe.sgta.event.AuditoriaEvent;
import java.time.OffsetDateTime;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class SubAreaConocimientoServiceImpl implements SubAreaConocimientoService {

	private final CarreraRepository carreraRepository;
	@PersistenceContext
	private EntityManager entityManager;
	private final SubAreaConocimientoRepository subAreaConocimientoRepository;
	private final AreaConocimientoRepository areaConocimientoRepository;
	private final AreaConocimientoServiceImpl areaConocimientoServiceImpl;

	private final UsuarioService usuarioService;
	@Autowired
    private ApplicationEventPublisher eventPublisher;

	public SubAreaConocimientoServiceImpl(SubAreaConocimientoRepository subAreaConocimientoRepository,
			AreaConocimientoRepository areaConocimientoRepository,
			CarreraRepository carreraRepository,
			AreaConocimientoServiceImpl areaConocimientoServiceImpl,
			UsuarioService usuarioService) {
		this.subAreaConocimientoRepository = subAreaConocimientoRepository;
		this.areaConocimientoRepository = areaConocimientoRepository;
		this.carreraRepository = carreraRepository;
		this.areaConocimientoServiceImpl = areaConocimientoServiceImpl;
		this.usuarioService = usuarioService;
	}

	@Override
	public List<SubAreaConocimientoDto> getAll() {
		List<SubAreaConocimiento> subAreasConocimiento = subAreaConocimientoRepository.findAllByActivoTrue();

		// retornar la lista de subáreas de conocimiento como DTOs con el área de
		// conocimiento
		List<SubAreaConocimientoDto> dtos = new ArrayList<>();
		for (SubAreaConocimiento subArea : subAreasConocimiento) {
			AreaConocimiento area = areaConocimientoRepository.findById(subArea.getAreaConocimiento().getId())
					.orElseThrow(() -> new EntityNotFoundException(
							"Área de conocimiento no encontrada con id: " + subArea.getAreaConocimiento().getId()));

			AreaConocimientoDto areaDto = AreaConocimientoMapper.toDto(area);
			SubAreaConocimientoDto dto = SubAreaConocimientoMapper.toDto(subArea, areaDto);
			dtos.add(dto);
		}

		return dtos;
	}

	@Override
	public SubAreaConocimientoDto findById(Integer id) {
		SubAreaConocimiento subArea = subAreaConocimientoRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Subárea no encontrada con id: " + id));

		AreaConocimiento area = areaConocimientoRepository.findById(subArea.getAreaConocimiento().getId())
				.orElseThrow(() -> new EntityNotFoundException(
						"Área de conocimiento no encontrada con id: " + subArea.getAreaConocimiento().getId()));

		AreaConocimientoDto areaDto = AreaConocimientoMapper.toDto(area);

		return SubAreaConocimientoMapper.toDto(subArea, areaDto);
	}

	@Override
	public SubAreaConocimientoDto create(String idCognito, SubAreaConocimientoDto dto) {
		if (dto.getAreaConocimiento() == null || dto.getAreaConocimiento().getId() == null) {
			throw new IllegalArgumentException("El área de conocimiento es requerida");
		}

		// fecha Creacion
		dto.setFechaCreacion(java.time.OffsetDateTime.now());
		AreaConocimiento areaConocimiento = new AreaConocimiento();
		areaConocimiento.setId(dto.getAreaConocimiento().getId());

		// Seteamos el area de conocimiento en el dto
		SubAreaConocimiento subAreaConocimiento = SubAreaConocimientoMapper.toEntity(dto);
		subAreaConocimiento.setAreaConocimiento(areaConocimiento);
		SubAreaConocimiento savedSubArea = subAreaConocimientoRepository.save(subAreaConocimiento);

		// Obtenemos el área de conocimiento completa para el DTO
		AreaConocimiento area = areaConocimientoRepository.findById(savedSubArea.getAreaConocimiento().getId())
				.orElseThrow(() -> new EntityNotFoundException(
						"Área de conocimiento no encontrada con id: " + savedSubArea.getAreaConocimiento().getId()));
		AreaConocimientoDto areaDto = AreaConocimientoMapper.toDto(area);

		eventPublisher.publishEvent(
                new AuditoriaEvent(
                        this,
                        idCognito,
                        OffsetDateTime.now(),
                        "Creó una nueva subárea de conocimiento " + savedSubArea.getNombre() + " con ID: " + savedSubArea.getId()
                )
        );

		return SubAreaConocimientoMapper.toDto(savedSubArea, areaDto);
	}

	@Override
	public List<SubAreaConocimientoDto> listarPorUsuario(Integer usuarioId) {

		String sql = "SELECT * FROM obtener_sub_areas_por_usuario(:usuarioId)";

		Query query = entityManager.createNativeQuery(sql);
		query.setParameter("usuarioId", usuarioId);

		List<Object[]> resultados = query.getResultList();

		List<SubAreaConocimientoDto> dtos = new ArrayList<>();
		for (Object[] row : resultados) {
			// Crear entidad simulada de SubAreaConocimiento
			SubAreaConocimiento sac = new SubAreaConocimiento();
			sac.setId((Integer) row[0]);
			// sac.setAreaConocimiento((Integer) row[1]); // si existe deeste campo en la
			// entidad
			sac.setNombre((String) row[2]);
			sac.setDescripcion((String) row[3]);
			sac.setActivo((Boolean) row[4]);

			// Crear DTO de área (aunque sea solo con el ID)
			AreaConocimiento area = areaConocimientoRepository.findById((Integer) row[1])
					.orElseThrow(() -> new EntityNotFoundException(
							"Área de conocimiento no encontrada con id: " + (Integer) row[1]));

			AreaConocimientoDto areaDto = AreaConocimientoMapper.toDto(area);
			// Mapear con el método toDto existente
			SubAreaConocimientoDto dto = SubAreaConocimientoMapper.toDto(sac, areaDto);
			dtos.add(dto);
		}

		return dtos;
	}

	@Override
	public void update(SubAreaConocimientoDto dto) {

	}

	@Override
	public void delete(Integer id) {
		SubAreaConocimiento subAreaConocimiento = subAreaConocimientoRepository.findById(id).orElse(null);
		if (subAreaConocimiento != null) {
			subAreaConocimiento.setActivo(false);
			subAreaConocimientoRepository.save(subAreaConocimiento);
		}
	}

	@Override
	public List<SubAreaConocimientoDto> getAllByArea(Integer idArea) {
		List<SubAreaConocimiento> subAreasConocimiento = subAreaConocimientoRepository
				.findAllByAreaConocimientoIdAndActivoTrue(idArea);

		// Obtenemos el área de conocimiento una sola vez
		AreaConocimiento area = areaConocimientoRepository.findById(idArea)
				.orElseThrow(() -> new EntityNotFoundException("Área de conocimiento no encontrada con id: " + idArea));
		AreaConocimientoDto areaDto = AreaConocimientoMapper.toDto(area);

		// Mapeamos cada subárea con el área de conocimiento
		List<SubAreaConocimientoDto> dtos = subAreasConocimiento.stream()
				.map(subArea -> SubAreaConocimientoMapper.toDto(subArea, areaDto))
				.toList();
		return dtos;
	}

	@Override
	public List<InfoSubAreaConocimientoDto> listarInfoPorNombre(String nombre) {
		return subAreaConocimientoRepository.findByNombreContainingIgnoreCaseAndActivoIsTrue(nombre)
				.stream()
				.map(InfoSubAreaConocimientoMapper::toDto)
				.toList();
	}

	@Override
	public List<SubAreaConocimientoDto> listarPorCarreraDeUsuario(String usuarioId) {
		String sql = "SELECT sub_area_conocimiento_id, area_conocimiento_id, nombre, descripcion, activo " +
				"  FROM obtener_sub_areas_por_carrera_usuario(:p_usuario_id)";
		Query query = entityManager.createNativeQuery(sql)
				.setParameter("p_usuario_id", usuarioId);

		@SuppressWarnings("unchecked")
		List<Object[]> rows = query.getResultList();

		List<SubAreaConocimientoDto> result = new ArrayList<>(rows.size());
		for (Object[] row : rows) {
			AreaConocimientoDto areaConocimiento = new AreaConocimientoDto();
			areaConocimiento.setId(((Number) row[1]).intValue());
			SubAreaConocimientoDto dto = SubAreaConocimientoDto.builder()
					.id(((Number) row[0]).intValue())
					.areaConocimiento(areaConocimiento)
					.nombre((String) row[2])
					.descripcion((String) row[3])
					.activo((Boolean) row[4])
					.build();
			result.add(dto);
		}

		return result;
	}

	@Override
	public List<InfoSubAreaConocimientoDto> listarPorCarrerasUsuarioParaPerfil(Integer idUsuario) {
		List<Integer> idAreasUsuario = areaConocimientoServiceImpl.listarPorCarrerasUsuarioParaPerfil(idUsuario)
				.stream()
				.map(InfoAreaConocimientoDto::getIdArea)
				.toList();
		return subAreaConocimientoRepository.findAllByAreaConocimientoIdInAndActivoTrue(idAreasUsuario)
				.stream()
				.map(InfoSubAreaConocimientoMapper::toDto)
				.toList();
	}

	public List<SubAreaConocimientoDto> findAllByIds(Collection<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
		return subAreaConocimientoRepository.findAllById(ids).stream()
			.map(ent -> SubAreaConocimientoDto.builder()
				.id(ent.getId())
				.nombre(ent.getNombre())
				.build()
			)
			.collect(Collectors.toList());
    }

}
