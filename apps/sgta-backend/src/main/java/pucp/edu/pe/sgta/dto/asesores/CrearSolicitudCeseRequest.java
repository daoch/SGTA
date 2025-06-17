package pucp.edu.pe.sgta.dto.asesores;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CrearSolicitudCeseRequest {

    @NotNull(message = "El ID del tema es obligatorio.")
    private Integer temaId;

    @NotBlank(message = "El motivo es obligatorio.")
    @Size(min = 10, max = 1000, message = "El motivo debe tener entre 10 y 1000 caracteres.")
    private String motivo;

    // Getters y Setters
    public Integer getTemaId() {
        return temaId;
    }

    public void setTemaId(Integer temaId) {
        this.temaId = temaId;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
}
