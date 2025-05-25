package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QueryRolResponse {

	private List<RolDto> roles;

	private int totalPages;

	private long totalElements;

	private int currentPage;

	private int pageSize;

}