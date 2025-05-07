package pucp.edu.pe.sgta.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class CicloDto {
    private Integer id;

    private String semestre;

    private Integer anio;

    private LocalDateTime fechaInicio;

    private LocalDateTime fechaFin;

    private boolean activo;

    private LocalDateTime fechaReg;

    private LocalDateTime fechaMod;
}