package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.RestriccionExposicionDto;
import java.util.List;

public interface RestriccionExposicionService {

    List<RestriccionExposicionDto> getAll();

    RestriccionExposicionDto findById(Integer id);

    void create(RestriccionExposicionDto dto);

    void update(RestriccionExposicionDto dto);

    void delete(Integer id);

}
