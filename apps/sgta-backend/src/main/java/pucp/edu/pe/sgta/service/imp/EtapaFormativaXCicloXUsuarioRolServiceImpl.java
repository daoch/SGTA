package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.repository.EtapaFormativaXCicloXUsuarioRolRepository;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaXCicloXUsuarioRolService;

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
}
