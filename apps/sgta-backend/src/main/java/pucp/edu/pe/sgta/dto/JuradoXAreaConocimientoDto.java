package pucp.edu.pe.sgta.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JuradoXAreaConocimientoDto {

	@JsonProperty("areas_conocimiento")
	List<JuradoAreaDto> juradoAreaDtos;

}
