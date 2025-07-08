package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.UsuarioRolRevisorDto;
import pucp.edu.pe.sgta.repository.EtapaFormativaXCicloXUsuarioRolRepository;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaXCicloXUsuarioRolService;

import java.util.ArrayList;
import java.util.List;

@Service
public class EtapaFormativaXCicloXUsuarioRolServiceImpl implements EtapaFormativaXCicloXUsuarioRolService {

    private final EtapaFormativaXCicloXUsuarioRolRepository etapaFormativaXCicloXUsuarioRolRepository;

    public EtapaFormativaXCicloXUsuarioRolServiceImpl(EtapaFormativaXCicloXUsuarioRolRepository etapaFormativaXCicloXUsuarioRolRepository) {
        this.etapaFormativaXCicloXUsuarioRolRepository = etapaFormativaXCicloXUsuarioRolRepository;
    }

    public void asignarRevisor(Integer cursoId, Integer revisorId) {
        etapaFormativaXCicloXUsuarioRolRepository.asignarRevisor(cursoId, revisorId);
        etapaFormativaXCicloXUsuarioRolRepository.asociarTemasARevisor(cursoId, revisorId);
    }

    public List<UsuarioRolRevisorDto> listarRevisoresXCarreraCicloActivo(Integer carreraId) {
        List<Object[]> result = etapaFormativaXCicloXUsuarioRolRepository.listarRevisoresXCarreraCicloActivo(carreraId);
        List<UsuarioRolRevisorDto> revisores = new ArrayList<>();

        for (Object[] row : result) {
            UsuarioRolRevisorDto dto = new UsuarioRolRevisorDto();
            dto.setId((Integer) row[0]); // tema_id
            dto.setUsuarioId((Integer) row[1]); // usuario_id
            dto.setCodigoPucp((String) row[2]); // codigo_pucp
            dto.setNombres((String) row[3]); // nombres
            dto.setPrimerApellido((String) row[4]); // primer_apellido
            dto.setSegundoApellido((String) row[5]); // segundo_apellido
            dto.setCorreoElectronico((String) row[6]); // correo_electronico
            dto.setRolId((Integer) row[7]); // rol_id
            dto.setRolNombre((String) row[8]); // rol_nombre
            dto.setCarreraId((Integer) row[9]); // carrera_id
            dto.setCarreraNombre((String) row[10]); // carrera_nombre
            dto.setEtapaFormativaXCicloId((Integer) row[11]); // etapa_formativa_x_ciclo_id
            revisores.add(dto);
        }
        return revisores;
    }
}
