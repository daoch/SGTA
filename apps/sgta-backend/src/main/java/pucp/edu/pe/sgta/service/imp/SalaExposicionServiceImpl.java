package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.service.inter.SalaExposicionService;
import pucp.edu.pe.sgta.dto.SalaExposicionDto;
import pucp.edu.pe.sgta.mapper.SalaExposicionMapper;
import pucp.edu.pe.sgta.model.SalaExposicion;
import pucp.edu.pe.sgta.repository.SalaExposicionRepository;
import java.util.List;

@Service
public class SalaExposicionServiceImpl implements SalaExposicionService {

	private final SalaExposicionRepository salaExposicionRepository;

	public SalaExposicionServiceImpl(SalaExposicionRepository salaExposicionRepository) {
		this.salaExposicionRepository = salaExposicionRepository;
	}

	@Override
	public List<SalaExposicionDto> getAll() {
		return List.of();
	}

	@Override
	public SalaExposicionDto findById(Integer id) {
		SalaExposicion salaExposicion = salaExposicionRepository.findById(id).orElse(null);
		if (salaExposicion != null) {
			return SalaExposicionMapper.tDto(salaExposicion);
		}
		return null;
	}

	@Override
	public void create(SalaExposicionDto dto) {

	}

	@Override
	public void update(SalaExposicionDto dto) {

	}

	@Override
	public void delete(Integer id) {

	}

}
