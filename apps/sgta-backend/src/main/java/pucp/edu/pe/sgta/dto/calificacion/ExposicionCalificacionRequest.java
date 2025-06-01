package pucp.edu.pe.sgta.dto.calificacion;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExposicionCalificacionRequest {
    private Integer jurado_id;
    private Integer exposicion_tema_id;
}
