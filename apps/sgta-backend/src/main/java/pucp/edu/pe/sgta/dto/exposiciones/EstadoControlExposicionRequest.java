package pucp.edu.pe.sgta.dto.exposiciones;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pucp.edu.pe.sgta.util.EstadoExposicionUsuario;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EstadoControlExposicionRequest {

    private Integer exposicionTemaId;
    private Integer juradoId;
    private EstadoExposicionUsuario estadoExposicionUsuario;

}
