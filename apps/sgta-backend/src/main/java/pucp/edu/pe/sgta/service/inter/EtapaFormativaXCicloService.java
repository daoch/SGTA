package pucp.edu.pe.sgta.service.inter;

import java.util.List;

import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloXCarreraDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloTesistaDto;
import pucp.edu.pe.sgta.dto.UpdateEtapaFormativaRequest;
import pucp.edu.pe.sgta.dto.PageResponseDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaXCicloPageRequestDto;
import pucp.edu.pe.sgta.service.imp.EtapaFormativaXCicloXUsuarioRolServiceImpl;


public interface EtapaFormativaXCicloService {
    List<EtapaFormativaXCicloDto> getAll();

    EtapaFormativaXCicloDto findById(Integer id);

    EtapaFormativaXCicloDto create(String usuarioCognito, EtapaFormativaXCicloDto dto);

    void update(EtapaFormativaXCicloDto dto);

    void delete(String usuarioCognito, Integer id);

    List<EtapaFormativaXCicloDto> getAllByCarreraId(String idCognito);

    List<EtapaFormativaXCicloDto> getAllByCarreraIdAndCicloId(Integer carreraId, Integer cicloId);

    EtapaFormativaXCicloDto actualizarEstadoRelacion(String usuarioCognito, Integer relacionId, UpdateEtapaFormativaRequest request);

    List<EtapaFormativaXCicloXCarreraDto> listarEtapasFormativasXCicloXCarrera(Integer carreraId);

    EtapaFormativaXCicloDto getEtapaFormativaXCicloByEtapaId(Integer etapaXCicloId);

    List<EtapaFormativaXCicloTesistaDto> listarEtapasFormativasXCicloTesista(String idCognito);

    PageResponseDto<EtapaFormativaXCicloDto> getAllByCarreraIdPaginated(String idCognito, EtapaFormativaXCicloPageRequestDto request);
}
