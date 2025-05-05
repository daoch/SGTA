package pucp.edu.pe.sgta.service.imp;

import jakarta.persistence.EntityNotFoundException;
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

import java.util.List;
import java.util.Optional;

@Service
public class SubAreaConocimientoServiceImpl implements SubAreaConocimientoService {

	private final SubAreaConocimientoRepository subAreaConocimientoRepository;
	private final AreaConocimientoRepository areaConocimientoRepository;

	public SubAreaConocimientoServiceImpl(SubAreaConocimientoRepository subAreaConocimientoRepository, AreaConocimientoRepository areaConocimientoRepository) {
		this.subAreaConocimientoRepository = subAreaConocimientoRepository;
        this.areaConocimientoRepository = areaConocimientoRepository;
    }

	@Override
	public List<SubAreaConocimientoDto> getAll() {
		return List.of();
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
	public void create(SubAreaConocimientoDto dto) {

	}

	@Override
	public void update(SubAreaConocimientoDto dto) {

	}

	@Override
	public void delete(Integer id) {

	}

}
