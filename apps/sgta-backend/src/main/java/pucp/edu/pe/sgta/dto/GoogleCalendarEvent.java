package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.joda.time.DateTime;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GoogleCalendarEvent {
    private String summary;
    private String description;
    private String location;
    private OffsetDateTime start;
    private OffsetDateTime end;
    private List<UsarioRolDto> attendess;
}
