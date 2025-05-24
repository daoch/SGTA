package pucp.edu.pe.sgta.dto.exposiciones;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExposicionTemaMiembrosDto {
    private Integer id_exposicion;
    private OffsetDateTime fechahora;
    private String sala;
    private String estado;
    private Integer id_etapa_formativa;
    private String nombre_etapa_formativa;
    private String titulo;
    private Integer ciclo_id;
    private Integer ciclo_anio;
    private String ciclo_semestre;
    private List<MiembroExposicionDto> miembros;
}
