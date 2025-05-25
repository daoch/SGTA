// Archivo: src/main/java/pucp/edu/pe/sgta/dto/UpdateEtapaFormativaRequest.java
package pucp.edu.pe.sgta.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class UpdateEtapaFormativaRequest {
    private String estado;
    // Getters y Setters
    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}