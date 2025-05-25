package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudCeseDto {

	private List<RequestTermination> requestTermmination;

	private int totalPages;

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class RequestTermination {

		private int id;

		private LocalDate registerTime;

		private String status;

		private String reason;

		private String response;

		private LocalDate responseTime;

		private Assessor assessor;

		private List<Estudiante> students;

	}

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class Assessor {

		private int id;

		private String name;

		private String lastName;

		private String email;

		private int quantityCurrentProyects;

		private byte[] urlPhoto;

	}

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class Estudiante {

		private int id;

		private String name;

		private String lastName;

		private Tema topic;

	}

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	public static class Tema {

		private String name;

	}

}
