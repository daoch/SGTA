package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.ExposicionDto;

import pucp.edu.pe.sgta.dto.ExposicionNombreDTO;
import pucp.edu.pe.sgta.dto.ListExposicionXCoordinadorDTO;

import java.util.List;

public interface ExposicionService {
    List<ExposicionDto> getAll();

    List<ExposicionDto> listarExposicionesXEtapaFormativaXCiclo(Integer etapaFormativaXCicloId);

    ExposicionDto findById(Integer id);

    Integer create(Integer etapaFormativaXCicloId, ExposicionDto dto);

    void update(ExposicionDto dto);

    void delete(Integer id);

    List<ExposicionNombreDTO>listarExposicionXCicloActualEtapaFormativa(Integer etapaFormativaId);

    List<ListExposicionXCoordinadorDTO> listarExposicionesInicializadasXCoordinador(Integer coordinadorId);
}
