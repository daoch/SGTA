package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.ExposicionDto;
import java.util.List;

public interface ExposicionService {
    List<ExposicionDto> getAll();

    ExposicionDto findById(Integer id);

    void create(ExposicionDto dto);

    void update(ExposicionDto dto);

    void delete(Integer id);

}
