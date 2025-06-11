package pucp.edu.pe.sgta.dto.temas;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pucp.edu.pe.sgta.dto.MiembroJuradoSimplificadoDTO;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExposicionTemaDto {
    private Integer id;
    private String nombre;
    private String estadoExposicion;
    private OffsetDateTime datetimeInicio;
    private OffsetDateTime datetimeFin;
    private String salaExposicion;
    private List<MiembroJuradoSimplificadoDTO> miembrosJurado;
}
