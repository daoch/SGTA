package pucp.edu.pe.sgta.dto.exposiciones;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pucp.edu.pe.sgta.util.EstadoExposicion;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EstadoExposicionJuradoRequest {

    private Integer exposicionTemaId;
    private EstadoExposicion estadoExposicion;
}
