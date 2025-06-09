package pucp.edu.pe.sgta.service.inter;

import java.util.List;

import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloXCarreraDto;
import pucp.edu.pe.sgta.dto.UpdateEtapaFormativaRequest;


public interface EtapaFormativaXCicloService {
    List<EtapaFormativaXCicloDto> getAll();

    EtapaFormativaXCicloDto findById(Integer id);

    EtapaFormativaXCicloDto create(EtapaFormativaXCicloDto dto);

    void update(EtapaFormativaXCicloDto dto);

    void delete(Integer id);

    List<EtapaFormativaXCicloDto> getAllByCarreraId(Integer id);

    List<EtapaFormativaXCicloDto> getAllByCarreraIdAndCicloId(Integer carreraId, Integer cicloId);

    EtapaFormativaXCicloDto actualizarEstadoRelacion(Integer relacionId, UpdateEtapaFormativaRequest request);

    List<EtapaFormativaXCicloXCarreraDto> listarEtapasFormativasXCicloXCarrera(Integer carreraId);

    EtapaFormativaXCicloDto getEtapaFormativaXCicloByEtapaId(Integer etapaXCicloId);
}
