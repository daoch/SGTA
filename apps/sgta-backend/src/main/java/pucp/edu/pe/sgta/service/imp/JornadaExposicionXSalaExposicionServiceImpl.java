package pucp.edu.pe.sgta.service.imp;

import java.util.List;

import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.JornadaExposicionXSalaExposicionDto;
import pucp.edu.pe.sgta.mapper.JornadaExposicionXSalaExposicionMapper;
import pucp.edu.pe.sgta.model.JornadaExposicionXSalaExposicion;
import pucp.edu.pe.sgta.repository.JornadaExposicionXSalaExposicionRepository;
import pucp.edu.pe.sgta.service.inter.JornadaExposicionXSalaExposicionService;

@Service
public class JornadaExposicionXSalaExposicionServiceImpl implements JornadaExposicionXSalaExposicionService {
    private final JornadaExposicionXSalaExposicionRepository jornadaExposicionXSalaExposicionRepository;

    public JornadaExposicionXSalaExposicionServiceImpl(
            JornadaExposicionXSalaExposicionRepository jornadaExposicionXSalaExposicionRepository) {
        this.jornadaExposicionXSalaExposicionRepository = jornadaExposicionXSalaExposicionRepository;
    }

    @Override
    public List<JornadaExposicionXSalaExposicionDto> getAll() {
        return List.of();
    }

    @Override
    public JornadaExposicionXSalaExposicionDto findById(Integer id) {
        JornadaExposicionXSalaExposicion jornadaExposicionXSalaExposicion = jornadaExposicionXSalaExposicionRepository
                .findById(id).orElse(null);
        if (jornadaExposicionXSalaExposicion != null) {
            return JornadaExposicionXSalaExposicionMapper.toDto(jornadaExposicionXSalaExposicion);
        }
        return null;
    }

    @Override
    public void create(JornadaExposicionXSalaExposicionDto dto) {

    }

    @Override
    public void update(JornadaExposicionXSalaExposicionDto dto) {

    }

    @Override
    public void delete(Integer id) {

    }
}
