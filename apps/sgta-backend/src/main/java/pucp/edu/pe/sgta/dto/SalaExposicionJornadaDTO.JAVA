package pucp.edu.pe.sgta.dto;

import java.time.OffsetDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pucp.edu.pe.sgta.util.TipoSalaExposicion;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalaExposicionJornadaDTO {
    private Integer id;
    private String nombre;
  
}
