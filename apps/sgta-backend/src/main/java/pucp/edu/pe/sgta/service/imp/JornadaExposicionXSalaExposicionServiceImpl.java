package pucp.edu.pe.sgta.service.imp;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.JornadaExposicionXSalaExposicionCreateDTO;
import pucp.edu.pe.sgta.dto.JornadaExposicionXSalaExposicionDto;
import pucp.edu.pe.sgta.mapper.JornadaExposicionMapper;
import pucp.edu.pe.sgta.mapper.JornadaExposicionXSalaExposicionMapper;
import pucp.edu.pe.sgta.model.JornadaExposicion;
import pucp.edu.pe.sgta.model.JornadaExposicionXSalaExposicion;
import pucp.edu.pe.sgta.repository.JornadaExposicionXSalaExposicionRepository;
import pucp.edu.pe.sgta.service.inter.JornadaExposicionXSalaExposicionService;

@Service
public class JornadaExposicionXSalaExposicionServiceImpl implements JornadaExposicionXSalaExposicionService {
    @Autowired
    JornadaExposicionXSalaExposicionRepository jornadaExposicionXSalaExposicionRepository;

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
    public JornadaExposicionXSalaExposicionDto create(JornadaExposicionXSalaExposicionCreateDTO dto) {
        JornadaExposicionXSalaExposicion jese = jornadaExposicionXSalaExposicionRepository.save(JornadaExposicionXSalaExposicionMapper.toEntity(dto));
        return JornadaExposicionXSalaExposicionMapper.toDto(jese);
    }

    @Override
    public void update(JornadaExposicionXSalaExposicionDto dto) {

    }

    @Override
    public void delete(Integer id) {

    }
}
