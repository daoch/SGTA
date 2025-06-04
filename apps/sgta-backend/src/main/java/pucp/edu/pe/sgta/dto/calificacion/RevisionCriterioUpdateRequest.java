package pucp.edu.pe.sgta.dto.calificacion;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RevisionCriterioUpdateRequest {
    private Integer id;
    private BigDecimal calificacion;
    private String observacion;
}
