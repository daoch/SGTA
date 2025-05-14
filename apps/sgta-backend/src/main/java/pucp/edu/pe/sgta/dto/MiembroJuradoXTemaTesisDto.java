package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MiembroJuradoXTemaTesisDto {
    private Integer id;
    private String titulo;
    private String codigo;
    private String resumen;
    private String rol;
    private List<EstudiantesDto> estudiantes;
    private List<SubAreasConocimientoDto> sub_areas_conocimiento;
    private EtapaFormativaTesisDto etapaFormativaTesis;
    private CicloTesisDto cicloTesis;
    private EstadoTemaDto estadoTema;
}
