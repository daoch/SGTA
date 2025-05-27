package pucp.edu.pe.sgta.dto;

import lombok.*;
import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlumnoTemaDto {

    private Integer id;
    private String temaNombre;
    private String asesorNombre;
    private List<String> coasesoresNombre;
    private OffsetDateTime fechaInicio;
    private String areaNombre;
    private String subAreaNombre;
}
