package pucp.edu.pe.sgta.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.SubAreaConocimientoDto;
import pucp.edu.pe.sgta.mapper.SubAreaConocimientoMapper;
import pucp.edu.pe.sgta.model.SubAreaConocimiento;
import pucp.edu.pe.sgta.repository.SubAreaConocimientoRepository;
import pucp.edu.pe.sgta.service.inter.SubAreaConocimientoService;

import java.util.List;
import java.util.Optional;

@Service
public class SubAreaConocimientoServiceImpl implements SubAreaConocimientoService {

    private final SubAreaConocimientoRepository subAreaConocimientoRepository;

    public SubAreaConocimientoServiceImpl(SubAreaConocimientoRepository subAreaConocimientoRepository) {
        this.subAreaConocimientoRepository = subAreaConocimientoRepository;
    }

    @Override
    public List<SubAreaConocimientoDto> getAll() {
        return List.of();
    }

    @Override
    public SubAreaConocimientoDto findById(Integer id) {
        SubAreaConocimiento subAreaConocimiento =  subAreaConocimientoRepository.findById(id).orElse(null);
        if (subAreaConocimiento != null) {
            return SubAreaConocimientoMapper.toDto(subAreaConocimiento);
        }
        return null;
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
