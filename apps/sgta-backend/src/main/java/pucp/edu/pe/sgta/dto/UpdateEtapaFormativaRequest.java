// Archivo: src/main/java/pucp/edu/pe/sgta/dto/UpdateEtapaFormativaRequest.java
package pucp.edu.pe.sgta.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UpdateEtapaFormativaRequest {
    private String nombre;
    private BigDecimal  creditajePorTema;

    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public BigDecimal getCreditajePorTema() { return creditajePorTema; }
    public void setCreditajePorTema(BigDecimal  creditajePorTema) { this.creditajePorTema = creditajePorTema; }
}