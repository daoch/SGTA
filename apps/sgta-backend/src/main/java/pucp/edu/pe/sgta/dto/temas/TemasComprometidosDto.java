package pucp.edu.pe.sgta.dto.temas;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TemasComprometidosDto {
    private Integer comprometido;
    private String estadoNombre;
}
