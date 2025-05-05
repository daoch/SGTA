package pucp.edu.pe.sgta.service.imp;


import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.AreaConocimientoDto;
import pucp.edu.pe.sgta.mapper.AreaConocimientoMapper;
import pucp.edu.pe.sgta.mapper.SubAreaConocimientoMapper;
import pucp.edu.pe.sgta.model.AreaConocimiento;
import pucp.edu.pe.sgta.model.SubAreaConocimiento;
import pucp.edu.pe.sgta.repository.AreaConocimientoRepository;
import pucp.edu.pe.sgta.service.inter.AreaConocimientoService;

@Service
public class AreaConocimientoServiceImpl implements AreaConocimientoService {

    private final AreaConocimientoRepository areaConocimientoRepository;

    public AreaConocimientoServiceImpl(AreaConocimientoRepository areaConocimientoRepository) {
        this.areaConocimientoRepository = areaConocimientoRepository;
    }

    @Override
    public AreaConocimientoDto findById(Integer id) {
        AreaConocimiento areaConocimiento = areaConocimientoRepository.findById(id).orElse(null);
        if (areaConocimiento != null) {
            return AreaConocimientoMapper.toDto(areaConocimiento);
        }
        return null;
    }

}
