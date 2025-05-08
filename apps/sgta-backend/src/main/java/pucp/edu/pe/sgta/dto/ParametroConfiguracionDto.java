package pucp.edu.pe.sgta.dto;

import lombok.*;
import java.time.OffsetDateTime;

import pucp.edu.pe.sgta.util.TipoDatoEnum;
import pucp.edu.pe.sgta.model.Modulo;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParametroConfiguracionDto {

	private Integer id;

	private String nombre;

	private String descripcion;

	private Integer moduloId;

	private Boolean activo;

	private TipoDatoEnum tipoDato;

}
