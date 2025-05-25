package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.RestriccionExposicionDto;
import pucp.edu.pe.sgta.mapper.RestriccionExposicionMapper;
import pucp.edu.pe.sgta.model.RestriccionExposicion;
import pucp.edu.pe.sgta.repository.RestriccionExposicionRepository;
import pucp.edu.pe.sgta.service.inter.RestriccionExposicionService;

import java.util.List;

@Service
public class RestriccionExposicionServiceImpl implements RestriccionExposicionService {

	private final RestriccionExposicionRepository restriccionExposicionRepository;

	public RestriccionExposicionServiceImpl(RestriccionExposicionRepository restriccionExposicionRepository) {
		this.restriccionExposicionRepository = restriccionExposicionRepository;
	}

	@Override
	public List<RestriccionExposicionDto> getAll() {
		return List.of();
	}

	@Override
	public RestriccionExposicionDto findById(Integer id) {
		RestriccionExposicion restriccionExposicion = restriccionExposicionRepository.findById(id).orElse(null);
		if (restriccionExposicion != null) {
			return RestriccionExposicionMapper.toDto(restriccionExposicion);
		}
		return null;
	}

	@Override
	public void create(RestriccionExposicionDto dto) {

	}

	@Override
	public void update(RestriccionExposicionDto dto) {

	}

	@Override
	public void delete(Integer id) {

	}

}
