package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JornadaExposicionXSalaExposicionCreateDTO {
    private Integer id;
    private Integer jornadaExposicionId;
    private Integer salaExposicionId;
}
