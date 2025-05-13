package pucp.edu.pe.sgta.dto;

import lombok.*;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TipoDedicacionDto {
    private Integer id;
    private String iniciales;
    private String descripcion;
    private Boolean activo;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaModificacion;
}
