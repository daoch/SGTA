package pucp.edu.pe.sgta.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CriterioEntregableDto {

    private Integer id;
    private String nombre;
    private BigDecimal notaMaxima;
    private String descripcion;

}
