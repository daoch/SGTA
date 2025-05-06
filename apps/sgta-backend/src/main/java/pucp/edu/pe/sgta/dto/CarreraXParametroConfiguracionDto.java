package pucp.edu.pe.sgta.dto;

import lombok.*;
import java.time.OffsetDateTime;

import pucp.edu.pe.sgta.model.Carrera;
import pucp.edu.pe.sgta.model.ParametroConfiguracion;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarreraXParametroConfiguracionDto {

	private Integer id;

	private Object valor;

	private boolean activo;

	private Carrera carrera;

	private ParametroConfiguracion parametroConfiguracion;

}
