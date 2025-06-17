package pucp.edu.pe.sgta.dto.asesores;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RejectSolicitudRequestDto {

    @NotBlank(message = "El motivo del rechazo no puede estar vacío.")
    @Size(max = 1000, message = "El motivo del rechazo no puede exceder los 1000 caracteres.")
    private String responseText;

    // Constructor vacío
    public RejectSolicitudRequestDto() {
    }

    // Constructor con parámetros
    public RejectSolicitudRequestDto(String responseText) {
        this.responseText = responseText;
    }

    // Getter y Setter
    public String getResponseText() {
        return responseText;
    }

    public void setResponseText(String responseText) {
        this.responseText = responseText;
    }
}