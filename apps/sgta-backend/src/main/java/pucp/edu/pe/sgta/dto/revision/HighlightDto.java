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
public class HighlightDto {
    private Number id;
    private PositionDto position;
    private ContentDto content;
    private CommentDto comment;
    private boolean corregido;
}
