package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.InfoAreaConocimientoDto;
import pucp.edu.pe.sgta.mapper.InfoAreaConocimientoMapper;
import pucp.edu.pe.sgta.mapper.InfoSubAreaConocimientoMapper;
import pucp.edu.pe.sgta.repository.AreaConocimientoRespository;
import pucp.edu.pe.sgta.service.inter.AreaConocimientoService;

import java.util.List;

@Service
public class AreaConocimientoServiceImpl implements AreaConocimientoService {
    private final AreaConocimientoRespository areaConocimientoRespository;

    public AreaConocimientoServiceImpl(AreaConocimientoRespository areaConocimientoRespository) {
        this.areaConocimientoRespository = areaConocimientoRespository;
    }

    @Override
    public List<InfoAreaConocimientoDto> listarInfoPorNombre(String nombre) {
        return areaConocimientoRespository.findByNombreContainingIgnoreCaseAndActivoIsTrue(nombre)
                .stream()
                .map(InfoAreaConocimientoMapper::toDto)
                .toList();
    }
}
