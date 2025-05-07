package pucp.edu.pe.sgta.dto;

import lombok.*;
import java.time.OffsetDateTime;

import pucp.edu.pe.sgta.model.Carrera;
import pucp.edu.pe.sgta.model.ParametroConfiguracion;
import pucp.edu.pe.sgta.dto.ParametroConfiguracionDto;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarreraXParametroConfiguracionDto {

	private Integer id;

	private Object valor;

	private boolean activo;

	private Integer carreraId;

	private ParametroConfiguracionDto parametroConfiguracion;

}
