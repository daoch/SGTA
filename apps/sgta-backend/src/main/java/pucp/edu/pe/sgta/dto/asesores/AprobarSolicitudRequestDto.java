package pucp.edu.pe.sgta.dto.asesores;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AprobarSolicitudRequestDto {

    @NotBlank(message = "El comentario de aprobación es obligatorio.")
    @Size(min = 5, max = 500, message = "El comentario debe tener entre 5 y 500 caracteres.")
    private String comentarioAprobacion;

    // Getters y Setters
    public String getComentarioAprobacion() {
        return comentarioAprobacion;
    }

    public void setComentarioAprobacion(String comentarioAprobacion) {
        this.comentarioAprobacion = comentarioAprobacion;
    }
}