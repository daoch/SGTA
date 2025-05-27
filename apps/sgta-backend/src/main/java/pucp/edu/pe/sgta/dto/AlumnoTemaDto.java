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
    private String coasesorNombre;
    private String areaNombre;
    private String subAreaNombre;
    
    // Campos para el progreso del alumno
    private Integer totalEntregables;
    private Integer entregablesEnviados;
    private Double porcentajeProgreso;
    
    // Campos para el siguiente entregable no enviado
    private OffsetDateTime siguienteEntregableFechaFin;
    private String siguienteEntregableNombre;
}
