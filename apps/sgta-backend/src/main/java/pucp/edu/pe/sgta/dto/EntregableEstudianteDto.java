package pucp.edu.pe.sgta.dto;

import java.time.LocalDateTime;

public class EntregableEstudianteDto {
    private String nombreEntregable;
    private String estado;
    private LocalDateTime fechaEnvio;

    public EntregableEstudianteDto() {
        // Constructor vacío requerido por Jackson
    }

    public EntregableEstudianteDto(String nombreEntregable, String estado, LocalDateTime fechaEnvio) {
        this.nombreEntregable = nombreEntregable;
        this.estado = estado;
        this.fechaEnvio = fechaEnvio;
    }

    public String getNombreEntregable() {
        return nombreEntregable;
    }

    public void setNombreEntregable(String nombreEntregable) {
        this.nombreEntregable = nombreEntregable;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaEnvio() {
        return fechaEnvio;
    }

    public void setFechaEnvio(LocalDateTime fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }
}
