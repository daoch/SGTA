package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TemaConAsesorDto {
    private TemaResumenDto temaActual;
    private PerfilAsesorDto asesorActual;

    public TemaConAsesorDto() {}

    public TemaConAsesorDto(TemaResumenDto temaActual, PerfilAsesorDto asesorActual) {
        this.temaActual = temaActual;
        this.asesorActual = asesorActual;
    }
}
