package pucp.edu.pe.sgta.dto;

import java.sql.Timestamp;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JornadaExposicionXSalaExposicionListadoDTO {
    private Integer jornadaExposicionId;
    private Timestamp datetimeInicio;
    private Timestamp datetimeFin;
    private List<SalaExposicionJornadaDTO> salasExposicion;
}
