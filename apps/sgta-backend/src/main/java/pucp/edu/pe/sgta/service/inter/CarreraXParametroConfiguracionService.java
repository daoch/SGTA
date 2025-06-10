package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.CarreraXParametroConfiguracionDto;
import java.util.List;

public interface CarreraXParametroConfiguracionService {

    void updateCarreraXParametroConfiguracion(CarreraXParametroConfiguracionDto carreraXParametroConfiguracionDto);

    List<CarreraXParametroConfiguracionDto> getParametrosPorCarrera(String idCognito);
}
