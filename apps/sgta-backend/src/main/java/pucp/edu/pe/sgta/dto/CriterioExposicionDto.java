package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CriterioExposicionDto {
    private Integer id;

    private Integer exposicionId;

    private String nombre;

    private String descripcion;

    private BigDecimal notaMaxima;
}
