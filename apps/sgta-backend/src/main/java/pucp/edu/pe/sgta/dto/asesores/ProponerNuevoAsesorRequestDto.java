package pucp.edu.pe.sgta.dto.asesores;

import jakarta.validation.constraints.NotNull;

public class ProponerNuevoAsesorRequestDto {

    @NotNull(message = "El ID del nuevo asesor propuesto es obligatorio.")
    private Integer nuevoAsesorPropuestoId;

    // Getters y Setters
    public Integer getNuevoAsesorPropuestoId() {
        return nuevoAsesorPropuestoId;
    }

    public void setNuevoAsesorPropuestoId(Integer nuevoAsesorPropuestoId) {
        this.nuevoAsesorPropuestoId = nuevoAsesorPropuestoId;
    }
}