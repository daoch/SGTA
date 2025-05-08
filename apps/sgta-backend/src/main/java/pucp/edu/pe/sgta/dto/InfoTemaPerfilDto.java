package pucp.edu.pe.sgta.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class InfoTemaPerfilDto {
    private Integer id;
    private String titulo;
    private String estudiante;//Los estudiantes los saco aparte
    private String anio;//De finalizacion, puede ser null si está en progreso
    private String estado;
}
