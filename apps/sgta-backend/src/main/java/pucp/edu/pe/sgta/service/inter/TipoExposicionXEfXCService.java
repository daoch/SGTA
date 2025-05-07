package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.TipoExposicionXEfXCDto;
import java.util.List;

public interface TipoExposicionXEfXCService {

    List<TipoExposicionXEfXCDto> getAll();

    TipoExposicionXEfXCDto findById(Integer id);

    void create(TipoExposicionXEfXCDto dto);

    void update(TipoExposicionXEfXCDto dto);

    void delete(Integer id);

}