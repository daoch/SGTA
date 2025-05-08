package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.HistorialTemaDto;

public interface HistorialTemaService {

    public HistorialTemaDto findById(Integer id);
    public void save(HistorialTemaDto historialTemaDto);
}
