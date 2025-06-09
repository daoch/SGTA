package pucp.edu.pe.sgta.dto.calificacion;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pucp.edu.pe.sgta.dto.RevisionCriterioExposicionDto;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExposicionCalificacionJuradoDTO {
    private Integer usuario_id;
    private String nombres;
    private String observaciones_finales;
    private List<CriteriosCalificacionDto> criterios;
    private List<RevisionCriterioExposicionDto> exposiciones;
    private Boolean calificado;
}