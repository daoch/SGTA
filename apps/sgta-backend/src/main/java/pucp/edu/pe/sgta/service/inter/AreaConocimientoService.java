package pucp.edu.pe.sgta.service.inter;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.InfoAreaConocimientoDto;

import java.util.List;

@Service
public interface AreaConocimientoService {
    List<InfoAreaConocimientoDto> listarInfoPorNombre(String nombre);
}
