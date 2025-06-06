package pucp.edu.pe.sgta.dto;

import java.time.OffsetDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EntregableCriteriosDetalleDto {
    private Integer entregableId;
    private String entregableNombre;
    private OffsetDateTime fechaEnvio;
    private Double notaGlobal;
    private String estadoEntrega;
    private List<CriterioEntregableDetalleDto> criterios;
} 