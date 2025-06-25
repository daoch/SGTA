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
public class EtapaFormativaXCicloTesistaDto {
    
    private Integer id;
    private Integer etapaFormativaId;
    private String etapaFormativaNombre;
    private Integer cicloId;
    private String cicloNombre;
    private Integer carreraId;
    private String carreraNombre;
    private Boolean activo;
    private String estado;
} 