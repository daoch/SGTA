package pucp.edu.pe.sgta.service.inter;

import java.util.List;

import pucp.edu.pe.sgta.dto.TipoExposicionDto;

public interface TipoExposicionService {
    List<TipoExposicionDto> getAll();

    TipoExposicionDto findById(Integer id);

    void create(TipoExposicionDto dto);

    void update(TipoExposicionDto dto);

    void delete(Integer id);
}
