package pucp.edu.pe.sgta.service.inter;

import java.time.OffsetDateTime;
import java.util.List;

import pucp.edu.pe.sgta.dto.*;

public interface BloqueHorarioExposicionService {
    List<BloqueHorarioExposicionDto> getAll();

    BloqueHorarioExposicionDto findById(Integer id);

    BloqueHorarioExposicionDto create(BloqueHorarioExposicionCreateDTO dto);

    void update(BloqueHorarioExposicionDto dto);

    void delete(Integer id);

    List<ListBloqueHorarioExposicionSimpleDTO> listarBloquesHorarioPorExposicion(Integer exposicionId);

    boolean updateBloquesListFirstTime(List<ListBloqueHorarioExposicionSimpleDTO> bloquesList);

    boolean updateBlouqesListNextPhase(List<ListBloqueHorarioExposicionSimpleDTO> bloquesList,Integer exposicionId,Integer origen);

    boolean finishPlanning(String usuarioCognito, Integer exposicionId);

    Integer createAll(List<BloqueHorarioExposicionCreateDTO> dtos);

    int bloquearBloque(int idBloque);

    int desbloquearBloque(int idBloque);

    List<ListBloqueHorarioExposicionSimpleDTO> asignarTemasBloques(List<AsignacionBloqueDTO> listaBloquesTemas,
            DistribucionRequestDTO request);

    boolean verificarSalaOcupada(Integer salaId, OffsetDateTime inicio, OffsetDateTime fin);

    void crearReunionesZoom(int exposicionId);
}
