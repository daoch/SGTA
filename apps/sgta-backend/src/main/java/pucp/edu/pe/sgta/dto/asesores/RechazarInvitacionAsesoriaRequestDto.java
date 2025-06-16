package pucp.edu.pe.sgta.dto.asesores;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RechazarInvitacionAsesoriaRequestDto {

    @NotBlank(message = "El motivo del rechazo es obligatorio.")
    @Size(min = 10, max = 500, message = "El motivo del rechazo debe tener entre 10 y 500 caracteres.")
    private String motivoRechazo;

    // Getters y Setters
    public String getMotivoRechazo() {
        return motivoRechazo;
    }

    public void setMotivoRechazo(String motivoRechazo) {
        this.motivoRechazo = motivoRechazo;
    }
}