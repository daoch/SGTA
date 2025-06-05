package pucp.edu.pe.sgta.dto.calificacion;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CriteriosCalificacionDto {
    private Integer id;
    private String titulo;
    private String descripcion;
    private BigDecimal calificacion;
    private BigDecimal nota_maxima;
    private String observacion;
}
