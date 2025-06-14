package pucp.edu.pe.sgta.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AsesorTesistaDto {
    private Long asesorId;
    private String asesorCodigoPucp;
    private String asesorNombre;
    private String asesorPrimerApellido;
    private String asesorSegundoApellido;
    private String asesorEmail;

    private Long tesistaId;
    private String tesistaCodigoPucp;
    private String tesistaNombre;
    private String tesistaPrimerApellido;
    private String tesistaSegundoApellido;
    private String tesistaEmail;

    private Long etapaFormativaId;
    private String etapaFormativaNombre;

    public AsesorTesistaDto(Object[] result) {
        this.asesorId = ((Number) result[0]).longValue();
        this.asesorNombre = (String) result[1];
        this.asesorPrimerApellido = (String) result[2];
        this.asesorSegundoApellido = (String) result[3];
        this.asesorEmail = (String) result[4];
        this.tesistaId = ((Number) result[5]).longValue();
        this.tesistaNombre = (String) result[6];
        this.tesistaPrimerApellido = (String) result[7];
        this.tesistaSegundoApellido = (String) result[8];
        this.tesistaEmail = (String) result[9];
        this.etapaFormativaId = ((Number) result[10]).longValue();
        this.etapaFormativaNombre = (String) result[11];
        this.asesorCodigoPucp = (String) result[12];
        this.tesistaCodigoPucp = (String) result[13];
    }
}
