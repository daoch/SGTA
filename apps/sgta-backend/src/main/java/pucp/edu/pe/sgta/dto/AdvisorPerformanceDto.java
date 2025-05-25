package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdvisorPerformanceDto {

	private String advisorName;

	private String areaName;

	private Double performancePercentage;

	private Integer totalStudents;

}
