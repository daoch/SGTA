package pucp.edu.pe.sgta.dto.temas;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EtapaFormativaTemaDto {
    private Integer id;
    private String nombre;
    private List<ExposicionTemaDto> exposiciones;
}
