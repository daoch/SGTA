package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.ExposicionDto;
import pucp.edu.pe.sgta.dto.ExposicionEstudianteDTO;
import pucp.edu.pe.sgta.dto.ExposicionNombreDTO;
import pucp.edu.pe.sgta.dto.ExposicionSinInicializarDTO;
import pucp.edu.pe.sgta.dto.ListExposicionXCoordinadorDTO;

import java.util.List;

public interface ExposicionService {
    List<ExposicionDto> getAll();

    List<ExposicionDto> listarExposicionesXEtapaFormativaXCiclo(Integer etapaFormativaXCicloId);

    ExposicionDto findById(Integer id);

    Integer create(Integer etapaFormativaXCicloId, ExposicionDto dto, String cognitoId);

    void update(ExposicionDto dto, String cognitoId);

    void delete(Integer id, String cognitoId);

    List<ExposicionNombreDTO> listarExposicionXCicloActualEtapaFormativa(Integer etapaFormativaId);

    List<ListExposicionXCoordinadorDTO> listarExposicionesInicializadasXCoordinador(Integer coordinadorId);

    List<ExposicionSinInicializarDTO> listarExposicionesSinInicializarByEtapaFormativaEnCicloActual(
            Integer etapaFormativaId);

    List<ExposicionEstudianteDTO> findExposicionesEstudianteById(Integer usuarioId);

    byte[] exportarExcel(Integer usuarioId);
}
