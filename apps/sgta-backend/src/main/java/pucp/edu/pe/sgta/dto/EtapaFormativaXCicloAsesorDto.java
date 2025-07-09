package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtapaFormativaXCicloAsesorDto {
    private Integer etapaFormativaXCicloId;
    private Integer etapaFormativaId;
    private String etapaFormativaNombre;
    private Integer carreraId;
    private String carreraNombre;
    private Integer cicloId;
    private String cicloNombre;
    private Integer cantidadTesistas;
} 