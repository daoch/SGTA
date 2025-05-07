package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RevisionCriterioExposicionDto {
    private Integer id;
    private Integer exposicionXTemaId;
    private Integer criterioExposicionId;
    private Integer usuarioId;
    private BigDecimal nota;
    private boolean revisado;
    private String observacion;
    private boolean activo;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaModificacion;
}
