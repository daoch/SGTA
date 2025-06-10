package pucp.edu.pe.sgta.dto.asesores;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SolicitudCeseAsesoriaDto {
    Integer solicitudId;
    @NotNull
    Integer temaId;
    @NotNull
    Integer alumnoId;
    @NotNull
    Integer asesorActualId;
    @NotBlank
    String  motivo;
}