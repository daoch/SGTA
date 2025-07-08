package pucp.edu.pe.sgta.service.inter;


import pucp.edu.pe.sgta.dto.UsuarioRolRevisorDto;
import java.util.List;

public interface EtapaFormativaXCicloXUsuarioRolService {

    void asignarRevisor(Integer cursoId, Integer revisorId);
    List<UsuarioRolRevisorDto> listarRevisoresXCarreraCicloActivo(Integer carreraId);
}
