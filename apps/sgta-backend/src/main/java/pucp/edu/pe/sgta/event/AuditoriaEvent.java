package pucp.edu.pe.sgta.event;

import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

import java.time.OffsetDateTime;

@Getter
@Setter
public class AuditoriaEvent extends ApplicationEvent {
    private final String idCognito;
    private final OffsetDateTime fechaCreacion;
    private final String accion;

    public AuditoriaEvent(Object source, String idCognito, OffsetDateTime fechaCreacion,String accion) {
        super(source);
        this.idCognito = idCognito;
        this.fechaCreacion = fechaCreacion;
        this.accion = accion;
    }


}
