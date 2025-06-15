package pucp.edu.pe.sgta.dto.asesores;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TemaConAsesorDto {
    private TemaResumenDto temaActual;
    private List<PerfilAsesorDto> asesores;

    public TemaConAsesorDto() {}

    public TemaConAsesorDto(TemaResumenDto temaActual, List<PerfilAsesorDto> asesores) {
        this.temaActual = temaActual;
        this.asesores = asesores;
    }
}
