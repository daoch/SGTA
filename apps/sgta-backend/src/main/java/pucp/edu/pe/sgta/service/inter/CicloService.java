package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.CicloConEtapasDTO;
import pucp.edu.pe.sgta.dto.CicloDto;
import pucp.edu.pe.sgta.model.Ciclo;

import java.util.List;

public interface CicloService {

    List<CicloDto> getAll();

    CicloDto findById(Integer id);

    void create(String usuarioCognito,CicloDto dto);

    void update(String usuarioCognito,CicloDto dto);

    void delete(Integer id);

    List<Ciclo> listarCiclosOrdenados();

    List<CicloConEtapasDTO> listarCiclosYetapasFormativas();
    
    List<CicloDto> listarTodosLosCiclos();
}
