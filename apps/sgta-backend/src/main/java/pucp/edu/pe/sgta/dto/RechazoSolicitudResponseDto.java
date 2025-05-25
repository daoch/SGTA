package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RechazoSolicitudResponseDto {

	private Integer idRequest;

	private String response;

	private String status;

	private List<AsignacionDto> assignations;

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class AsignacionDto {

		private Integer idStudent;

		private Integer idAssessor;

	}

}
