package pucp.edu.pe.sgta.dto.revision;
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
public class ScaledDto {
    private double x1, y1, x2, y2, width, height;
    private Integer pageNumber;
}
