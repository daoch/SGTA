package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.ExposicionXTemaDto;
import pucp.edu.pe.sgta.mapper.ExposicionXTemaMapper;
import pucp.edu.pe.sgta.model.ExposicionXTema;
import pucp.edu.pe.sgta.repository.ExposicionXTemaRepository;
import pucp.edu.pe.sgta.service.inter.ExposicionXTemaService;

import java.util.List;

@Service
public class ExposicionXTemaServiceImpl implements ExposicionXTemaService {

    private final ExposicionXTemaRepository exposicionXTemaRepository;

    public ExposicionXTemaServiceImpl(ExposicionXTemaRepository exposicionXTemaRepository) {
        this.exposicionXTemaRepository = exposicionXTemaRepository;
    }

    @Override
    public List<ExposicionXTemaDto> getAll() {
        return List.of();
    }

    @Override
    public ExposicionXTemaDto findById(Integer id) {
        ExposicionXTema exposicionXTema = exposicionXTemaRepository.findById(id).orElse(null);
        if (exposicionXTema != null) {
            return ExposicionXTemaMapper.toDto(exposicionXTema);
        }
        return null;
    }

    @Override
    public void create(ExposicionXTemaDto dto) {

    }

    @Override
    public void update(ExposicionXTemaDto dto) {

    }

    @Override
    public void delete(Integer id) {

    }

}
