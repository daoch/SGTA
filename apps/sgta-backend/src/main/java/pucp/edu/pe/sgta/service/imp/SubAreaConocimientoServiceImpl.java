package pucp.edu.pe.sgta.service.imp;

import jakarta.persistence.*;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.AreaConocimientoDto;
import pucp.edu.pe.sgta.dto.SubAreaConocimientoDto;
import pucp.edu.pe.sgta.mapper.AreaConocimientoMapper;
import pucp.edu.pe.sgta.mapper.SubAreaConocimientoMapper;
import pucp.edu.pe.sgta.model.AreaConocimiento;
import pucp.edu.pe.sgta.model.SubAreaConocimiento;
import pucp.edu.pe.sgta.repository.AreaConocimientoRepository;
import pucp.edu.pe.sgta.repository.SubAreaConocimientoRepository;
import pucp.edu.pe.sgta.service.inter.SubAreaConocimientoService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SubAreaConocimientoServiceImpl implements SubAreaConocimientoService {

	@PersistenceContext
	private EntityManager entityManager;
	private final SubAreaConocimientoRepository subAreaConocimientoRepository;
	private final AreaConocimientoRepository areaConocimientoRepository;

	public SubAreaConocimientoServiceImpl(SubAreaConocimientoRepository subAreaConocimientoRepository, AreaConocimientoRepository areaConocimientoRepository) {
		this.subAreaConocimientoRepository = subAreaConocimientoRepository;
        this.areaConocimientoRepository = areaConocimientoRepository;
    }

	@Override
	public List<SubAreaConocimientoDto> getAll() {
		List<SubAreaConocimiento> subAreasConocimiento = subAreaConocimientoRepository.findAllByActivoTrue();
		
		//retornar la lista de subáreas de conocimiento como DTOs con el área de conocimiento
		List<SubAreaConocimientoDto> dtos = new ArrayList<>();
		for (SubAreaConocimiento subArea : subAreasConocimiento) {
			AreaConocimiento area = areaConocimientoRepository.findById(subArea.getAreaConocimiento().getId())
					.orElseThrow(() -> new EntityNotFoundException("Área de conocimiento no encontrada con id: " + subArea.getAreaConocimiento().getId()));

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
				.orElseThrow(() -> new EntityNotFoundException("Área de conocimiento no encontrada con id: " + subArea.getAreaConocimiento().getId()));

		AreaConocimientoDto areaDto = AreaConocimientoMapper.toDto(area);

		return SubAreaConocimientoMapper.toDto(subArea, areaDto);
	}

	@Override
	public SubAreaConocimientoDto create(SubAreaConocimientoDto dto) {
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
				.orElseThrow(() -> new EntityNotFoundException("Área de conocimiento no encontrada con id: " + savedSubArea.getAreaConocimiento().getId()));
		AreaConocimientoDto areaDto = AreaConocimientoMapper.toDto(area);
		
		return SubAreaConocimientoMapper.toDto(savedSubArea, areaDto);
	}

	@Override
	public List<SubAreaConocimientoDto> listarPorUsuario(Integer usuarioId) {
		String sql = "SELECT * FROM sgta.obtener_sub_areas_por_usuario(:usuarioId)";

		Query query = entityManager.createNativeQuery(sql);
		query.setParameter("usuarioId", usuarioId);

		List<Object[]> resultados = query.getResultList();

		List<SubAreaConocimientoDto> dtos = new ArrayList<>();
		for (Object[] row : resultados) {
			// Crear entidad simulada de SubAreaConocimiento
			SubAreaConocimiento sac = new SubAreaConocimiento();
			sac.setId((Integer) row[0]);
			//sac.setAreaConocimiento((Integer) row[1]); // si existe este campo en la entidad
			sac.setNombre((String) row[2]);
			sac.setDescripcion((String) row[3]);
			sac.setActivo((Boolean) row[4]);

			// Crear DTO de área (aunque sea solo con el ID)
			AreaConocimiento area = areaConocimientoRepository.findById((Integer) row[1])
					.orElseThrow(() -> new EntityNotFoundException("Área de conocimiento no encontrada con id: " + (Integer) row[1]));

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
		List<SubAreaConocimiento> subAreasConocimiento = subAreaConocimientoRepository.findAllByAreaConocimientoIdAndActivoTrue(idArea);
		
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

}
