package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BloquesNextPhaseRequest {
    private List<ListBloqueHorarioExposicionSimpleDTO> bloquesList;
    private Integer exposicion;
    private Integer origen;
}
