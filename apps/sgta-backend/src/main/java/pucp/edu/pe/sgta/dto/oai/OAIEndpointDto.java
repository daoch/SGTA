package pucp.edu.pe.sgta.dto.oai;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAIEndpointDto {
    private String endpoint;
    private String description;
    private Boolean active;
}
