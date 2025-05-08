package pucp.edu.pe.sgta.service.imp;

import java.util.List;

import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.JornadaExposicionDto;
import pucp.edu.pe.sgta.mapper.JornadaExposicionMapper;
import pucp.edu.pe.sgta.model.JornadaExposicion;
import pucp.edu.pe.sgta.repository.JornadaExposicionRepository;
import pucp.edu.pe.sgta.service.inter.JornadaExposicionService;

@Service
public class JornadaExposicionServiceImpl implements JornadaExposicionService {
    private final JornadaExposicionRepository jornadaExposicionRepository;

    public JornadaExposicionServiceImpl(JornadaExposicionRepository jornadaExposicionRepository) {
        this.jornadaExposicionRepository = jornadaExposicionRepository;
    }

    @Override
    public List<JornadaExposicionDto> getAll() {
        return List.of();
    }

    @Override
    public JornadaExposicionDto findById(Integer id) {
        JornadaExposicion jornadaExposicion = jornadaExposicionRepository.findById(id).orElse(null);
        if (jornadaExposicion != null) {
            return JornadaExposicionMapper.toDto(jornadaExposicion);
        }
        return null;
    }

    @Override
    public void create(JornadaExposicionDto dto) {

    }

    @Override
    public void update(JornadaExposicionDto dto) {

    }

    @Override
    public void delete(Integer id) {

    }
}
