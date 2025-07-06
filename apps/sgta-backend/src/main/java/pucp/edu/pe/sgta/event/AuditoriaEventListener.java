package pucp.edu.pe.sgta.event;

import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import pucp.edu.pe.sgta.model.HistorialAccion;
import pucp.edu.pe.sgta.repository.HistorialAccionRepository;

@Component
public class AuditoriaEventListener {

    private final HistorialAccionRepository historialRepository;

    public AuditoriaEventListener(HistorialAccionRepository historialRepository) {
        this.historialRepository = historialRepository;
    }

    @Async
    @EventListener
    public void manejarEventoAuditoria(AuditoriaEvent event) {
        HistorialAccion historial = new HistorialAccion();
        historial.setIdCognito(event.getIdCognito());
        historial.setFechaCreacion(event.getFechaCreacion());
        historial.setAccion(event.getAccion());
        historialRepository.save(historial);
    }
}
