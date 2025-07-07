package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.repository.EtapaFormativaXCicloXUsuarioRolRepository;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaXCicloXUsuarioRolService;
import pucp.edu.pe.sgta.service.inter.HistorialAccionService;

@Service
public class EtapaFormativaXCicloXUsuarioRolServiceImpl implements EtapaFormativaXCicloXUsuarioRolService {

    private final EtapaFormativaXCicloXUsuarioRolRepository etapaFormativaXCicloXUsuarioRolRepository;
    private final HistorialAccionService historialAccionService;

    public EtapaFormativaXCicloXUsuarioRolServiceImpl(EtapaFormativaXCicloXUsuarioRolRepository etapaFormativaXCicloXUsuarioRolRepository,
                                                      HistorialAccionService historialAccionService) {
        this.etapaFormativaXCicloXUsuarioRolRepository = etapaFormativaXCicloXUsuarioRolRepository;
        this.historialAccionService = historialAccionService;
    }

    public void asignarRevisor(Integer cursoId, Integer revisorId, String cognitoId) {
        etapaFormativaXCicloXUsuarioRolRepository.asignarRevisor(cursoId, revisorId);
        historialAccionService.registrarAccion(cognitoId, "Se asignó el revisor " + revisorId + " al curso " + cursoId);
        etapaFormativaXCicloXUsuarioRolRepository.asociarTemasARevisor(cursoId, revisorId);
    }
}
