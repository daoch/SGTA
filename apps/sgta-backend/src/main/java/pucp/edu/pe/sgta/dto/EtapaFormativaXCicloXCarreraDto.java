package pucp.edu.pe.sgta.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EtapaFormativaXCicloXCarreraDto {
    private Integer id;
    private Integer etapaFormativaId;
    private String etapaFormativaNombre;
    private Integer cicloId;
    private String cicloNombre;
}
