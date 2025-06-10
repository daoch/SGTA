package pucp.edu.pe.sgta.event;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import pucp.edu.pe.sgta.model.ExposicionXTema;
import pucp.edu.pe.sgta.repository.ExposicionXTemaRepository;
import pucp.edu.pe.sgta.util.EstadoExposicion;

@Component
public class ExposicionCalificadaListener {
    private final ExposicionXTemaRepository exposicionXTemaRepository;


    public ExposicionCalificadaListener(ExposicionXTemaRepository exposicionXTemaRepository) {
        this.exposicionXTemaRepository = exposicionXTemaRepository;
    }

    @EventListener
    public void manejarExposicionCalificada(ExposicionCalificadaEvent event) {
        ExposicionXTema exposicionXTema = event.getExposicionXTema();
        exposicionXTema.setEstadoExposicion(EstadoExposicion.CALIFICADA);
        exposicionXTemaRepository.save(exposicionXTema);
    }
}
