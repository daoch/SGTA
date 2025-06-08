package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TemaSimilarityResult {
    private TemaDto tema;
    private Double similarityScore; // 0.0 to 100.0
    private String comparedFields; // indicates which fields were compared
}
