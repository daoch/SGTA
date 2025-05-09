package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RolDto {
    private Integer id;
    private String nombre;
    private String descripcion;
    private Boolean activo;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaModificacion;
}