package pucp.edu.pe.sgta.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AsesorTesistaDto {
    private Long asesorId;
    private String asesorNombre;
    private String asesorEmail;

    private Long tesistaId;
    private String tesistaNombre;
    private String tesistaEmail;

    private Long etapaFormativaId;
    private String etapaFormativaNombre;

    public AsesorTesistaDto(Object[] result) {
        this.asesorId = ((Number) result[0]).longValue();
        this.asesorNombre = (String) result[1];
        this.asesorEmail = (String) result[2];
        this.tesistaId = ((Number) result[3]).longValue();
        this.tesistaNombre = (String) result[4];
        this.tesistaEmail = (String) result[5];
        this.etapaFormativaId = ((Number) result[6]).longValue();
        this.etapaFormativaNombre = (String) result[7];
    }
}
