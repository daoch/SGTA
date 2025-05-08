package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExposicionDto {

    private Integer id;

    private Integer etapaFormativaXCicloId;

    private String nombre;

    private String descripcion;

    private Integer estadoPlanificacionId;
}
