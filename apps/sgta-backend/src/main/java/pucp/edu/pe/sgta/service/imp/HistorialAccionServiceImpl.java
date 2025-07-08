package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pucp.edu.pe.sgta.model.HistorialAccion;
import pucp.edu.pe.sgta.repository.HistorialAccionRepository;
import pucp.edu.pe.sgta.service.inter.HistorialAccionService;

@Service
public class HistorialAccionServiceImpl implements HistorialAccionService {

    private final HistorialAccionRepository historialAccionRepository;

    public HistorialAccionServiceImpl(HistorialAccionRepository historialAccionRepository) {
        this.historialAccionRepository = historialAccionRepository;
    }
    
    @Override
    @Transactional
    public void registrarAccion(String idCognito, String accion) {
        HistorialAccion h = new HistorialAccion();
        h.setIdCognito(idCognito);
        h.setAccion(accion);
        // fechaCreacion se setea automáticamente por DEFAULT CURRENT_TIMESTAMP
        historialAccionRepository.save(h);
    }
}
