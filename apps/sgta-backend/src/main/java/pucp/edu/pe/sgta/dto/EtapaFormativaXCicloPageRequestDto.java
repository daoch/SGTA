package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EtapaFormativaXCicloPageRequestDto {
    private int page = 0;
    private int size = 10;
    private String search;
    private String estado;
    private Integer anio;
    private String semestre;
    private String sortBy = "anio";
    private String sortDirection = "desc";
} 