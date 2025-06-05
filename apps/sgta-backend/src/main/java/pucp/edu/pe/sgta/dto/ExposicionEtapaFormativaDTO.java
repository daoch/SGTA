package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExposicionEtapaFormativaDTO {
    private Integer exposicionId;
    private String nombreExposicion;
    private Integer etapaFormativaId;
    private String nombreEtapaFormativa;
}
