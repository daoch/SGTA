package pucp.edu.pe.sgta.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AreaFinalDTO {

	private String teacherName;

	private String areaName;

	private int advisorCount;

	private int jurorCount;

	private int totalCount;

}