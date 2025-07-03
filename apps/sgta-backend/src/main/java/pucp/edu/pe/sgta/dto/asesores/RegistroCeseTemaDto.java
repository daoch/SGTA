package pucp.edu.pe.sgta.dto.asesores;


import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegistroCeseTemaDto {
    Integer solicitudId;
    @NotNull
    Integer creadorId;
    @NotNull
    Integer temaId;
    @NotNull
    String estadoTema;
    @NotNull
    String motivo;
    @NotNull
    Integer asesorId;
}
