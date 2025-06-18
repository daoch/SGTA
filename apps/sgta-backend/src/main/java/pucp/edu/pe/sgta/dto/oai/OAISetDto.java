package pucp.edu.pe.sgta.dto.oai;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAISetDto {
    private String setSpec;
    private String setName;
    private String setDescription;
}
