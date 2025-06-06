package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlumnoReporteDto {
    private Integer usuarioId;
    private String codigoPucp;
    private String nombres;
    private String primerApellido;
    private String segundoApellido;
    private String temaTitulo;
    private Integer temaId;
    private String asesor;
    private String coasesor;
    private Boolean activo;
} 