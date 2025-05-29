package pucp.edu.pe.sgta.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class EstadoControlExposicionActualizadoEvent {
    private final Integer exposicionTemaId;
    private final Integer temaId;

}
