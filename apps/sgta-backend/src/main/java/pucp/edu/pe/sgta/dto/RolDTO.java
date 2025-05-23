package pucp.edu.pe.sgta.dto;

import java.time.OffsetDateTime;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RolDto {

    private Integer id;
    private String nombre;
    private String descripcion;
    private Boolean activo;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaModificacion;
}
