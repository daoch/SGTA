package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CriterioEntregableDetalleDto {
    private Integer criterioId;
    private String criterioNombre;
    private Double notaMaxima;
    private Double notaCriterio;
} 