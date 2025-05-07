package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.ExposicionDto;
import pucp.edu.pe.sgta.mapper.ExposicionMapper;
import pucp.edu.pe.sgta.model.Exposicion;
import pucp.edu.pe.sgta.repository.ExposicionRepository;
import pucp.edu.pe.sgta.service.inter.ExposicionService;

import java.util.List;

@Service
public class ExposicionServiceImpl implements ExposicionService {
    private final ExposicionRepository exposicionRepository;

    public ExposicionServiceImpl(ExposicionRepository exposicionRepository) {
        this.exposicionRepository = exposicionRepository;
    }

    @Override
    public List<ExposicionDto> getAll() {
        return List.of();
    }

    @Override
    public ExposicionDto findById(Integer id) {
        Exposicion exposicion = exposicionRepository.findById(id).orElse(null);
        if (exposicion != null) {
            return ExposicionMapper.toDto(exposicion);
        }
        return null;
    }

    @Override
    public void create(ExposicionDto dto) {

    }

    @Override
    public void update(ExposicionDto dto) {

    }

    @Override
    public void delete(Integer id) {

    }

}
