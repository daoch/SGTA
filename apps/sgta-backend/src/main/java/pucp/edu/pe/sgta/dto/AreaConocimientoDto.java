package pucp.edu.pe.sgta.dto;

//import jakarta.persistence.Column;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
import lombok.*;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AreaConocimientoDto {

    private Integer id;

    private String nombre;

    private String descripcion;

    private boolean activo;

    private OffsetDateTime fechaCreacion;

    private OffsetDateTime fechaModificacion;
}
