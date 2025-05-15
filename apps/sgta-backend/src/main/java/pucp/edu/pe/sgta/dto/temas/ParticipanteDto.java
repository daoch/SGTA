package pucp.edu.pe.sgta.dto.temas;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticipanteDto {
    private Integer id;
    private String nombre;
    private String tipo;
}
