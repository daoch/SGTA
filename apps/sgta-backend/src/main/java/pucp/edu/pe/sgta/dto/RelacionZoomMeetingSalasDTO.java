package pucp.edu.pe.sgta.dto;

import java.sql.Timestamp;
import java.time.OffsetDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pucp.edu.pe.sgta.model.ZoomMeetingResponse;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RelacionZoomMeetingSalasDTO {
    private Integer jornadaExposicionId;
    private Integer salaExposicionId;
    private String nombreSala;
    private OffsetDateTime datetimeInicio;
    private OffsetDateTime datetimeFin;
    private ZoomMeetingResponse zoomMeetingResponse;
}
