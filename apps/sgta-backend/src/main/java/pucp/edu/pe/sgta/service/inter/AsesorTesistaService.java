package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.AsesorTesistaDto;

import java.util.List;

public interface AsesorTesistaService {
    List<AsesorTesistaDto> findAsesorTesista(String carrera);
}
