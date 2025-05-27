package pucp.edu.pe.sgta.dto.exposiciones;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MiembroExposicionDto {
    private Integer id_persona;
    private String nombre;
    private String tipo;
}
