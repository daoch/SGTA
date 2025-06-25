package pucp.edu.pe.sgta.dto.coordinador;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateLinkGrabacionRequest {
    private Integer exposicionXTemaId;
    private String nuevoLinkGrabacion;
}
