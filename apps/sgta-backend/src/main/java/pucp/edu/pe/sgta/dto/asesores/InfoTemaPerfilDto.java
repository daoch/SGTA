package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class InfoTemaPerfilDto {
    private Integer idTesis;
    private String titulo;
    private String estudiantes;//Los estudiantes los saco aparte
    private String anio;//De finalizacion, puede ser null si está en progreso
    private String nivel;//TODO: Cuando se implemente el cambio tema_ciclo_etapa_formativa se considera
    private String estado;
}
