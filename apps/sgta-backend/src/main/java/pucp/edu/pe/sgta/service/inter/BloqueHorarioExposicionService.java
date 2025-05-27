package pucp.edu.pe.sgta.service.inter;

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

    boolean updateBlouqesListNextPhase(List<ListBloqueHorarioExposicionSimpleDTO> bloquesList);

    boolean finishPlanning(Integer exposicionId);

    Integer createAll(List<BloqueHorarioExposicionCreateDTO> dtos);
    int bloquearBloque(int idBloque );


    int desbloquearBloque(int idBloque );

    List<ListBloqueHorarioExposicionSimpleDTO> asignarTemasBloques(List<AsignacionBloqueDTO> listaBloquesTemas, DistribucionRequestDTO request);

}
