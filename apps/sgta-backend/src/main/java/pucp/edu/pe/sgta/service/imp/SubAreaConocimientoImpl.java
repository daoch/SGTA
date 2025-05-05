package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.SubAreaConocimientoDto;
import pucp.edu.pe.sgta.mapper.SubAreaConocimientoMapper;
import pucp.edu.pe.sgta.model.SubAreaConocimiento;
import pucp.edu.pe.sgta.repository.SubAreaConocimientoRepository;
import pucp.edu.pe.sgta.service.inter.SubAreaConocimientoService;

import java.util.List;

@Service
public class SubAreaConocimientoImpl implements SubAreaConocimientoService {

	private final SubAreaConocimientoRepository subAreaConocimientoRepository;

	public SubAreaConocimientoImpl(SubAreaConocimientoRepository subAreaConocimientoRepository) {
		this.subAreaConocimientoRepository = subAreaConocimientoRepository;
	}

	@Override
	public List<SubAreaConocimientoDto> getAll() {
		List<SubAreaConocimiento> subAreasConocimiento = subAreaConocimientoRepository.findAllByActivoTrue();
		List<SubAreaConocimientoDto> dtos = subAreasConocimiento.stream()
				.map(SubAreaConocimientoMapper::toDto)
				.toList();
		return dtos;
	}

	@Override
	public SubAreaConocimientoDto findById(Integer id) {
		SubAreaConocimiento subAreaConocimiento = subAreaConocimientoRepository.findById(id).orElse(null);
		if (subAreaConocimiento != null) {
			return SubAreaConocimientoMapper.toDto(subAreaConocimiento);
		}
		return null;
	}

	@Override
	public void create(SubAreaConocimientoDto dto) {
		SubAreaConocimiento subAreaConocimiento = SubAreaConocimientoMapper.toEntity(dto);
		subAreaConocimientoRepository.save(subAreaConocimiento);
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

}
