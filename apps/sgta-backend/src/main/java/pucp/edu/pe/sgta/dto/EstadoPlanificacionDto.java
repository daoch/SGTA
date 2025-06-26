package pucp.edu.pe.sgta.dto;

import java.time.OffsetDateTime;

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
public class EstadoPlanificacionDto {
    private Integer id;
    private String nombre;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaModificacion;
    private Boolean activo;
}
