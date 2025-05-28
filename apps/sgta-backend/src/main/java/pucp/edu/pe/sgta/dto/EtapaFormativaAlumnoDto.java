package pucp.edu.pe.sgta.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EtapaFormativaAlumnoDto {
    private Integer etapaFormativaId;
    private String etapaFormativaNombre;
    private Integer cicloId;
    private String cicloNombre;
    private Integer temaId;
    private String temaTitulo;
    private String temaResumen;
}
