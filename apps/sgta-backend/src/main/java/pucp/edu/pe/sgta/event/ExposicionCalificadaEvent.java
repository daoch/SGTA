package pucp.edu.pe.sgta.event;

import pucp.edu.pe.sgta.model.ExposicionXTema;

public class ExposicionCalificadaEvent {
    private final ExposicionXTema exposicionXTema;

    public ExposicionCalificadaEvent(ExposicionXTema exposicionXTema) {
        this.exposicionXTema = exposicionXTema;
    }

    public ExposicionXTema getExposicionXTema() {
        return exposicionXTema;
    }
}
