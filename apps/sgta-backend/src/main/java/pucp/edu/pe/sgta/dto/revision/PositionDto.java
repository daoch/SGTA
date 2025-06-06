package pucp.edu.pe.sgta.dto.revision;
import java.util.List;
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
public class PositionDto {
    private ScaledDto boundingRect;
    private List<ScaledDto> rects;
    private int pageNumber;
    private Boolean usePdfCoordinates;
}
