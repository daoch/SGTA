package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.CarreraXParametroConfiguracionDto;
import java.util.List;

public interface CarreraXParametroConfiguracionService {

    void updateCarreraXParametroConfiguracion(String usuarioCognito, CarreraXParametroConfiguracionDto carreraXParametroConfiguracionDto);

    List<CarreraXParametroConfiguracionDto> getParametrosPorCarrera(String idCognito);

    List<CarreraXParametroConfiguracionDto> getParametrosPorAlumno(String idCognito);

    List<CarreraXParametroConfiguracionDto> getParametrosPorCarreraYEtapaFormativa(String idCognito, Integer etapaFormativaId);

    Boolean assertParametroLimiteNumericoPorNombreCarrera(String nombreParametro, Integer carreraId, Integer usuarioId);

}
