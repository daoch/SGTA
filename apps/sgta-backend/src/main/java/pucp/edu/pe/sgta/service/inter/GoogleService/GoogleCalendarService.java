package pucp.edu.pe.sgta.service.inter.GoogleService;

import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import io.jsonwebtoken.io.IOException;
import org.joda.time.DateTime;
import pucp.edu.pe.sgta.dto.GoogleCalendarEvent;
import pucp.edu.pe.sgta.dto.UsarioRolDto;

import java.security.GeneralSecurityException;
import java.time.OffsetDateTime;
import java.util.List;

public interface GoogleCalendarService {
    public Event createEvent(GoogleCalendarEvent event);

    public Calendar buildCalendarClient(String accessToken) throws GeneralSecurityException, IOException, java.io.IOException;



    public void sendEvent(String summary, String description, List<UsarioRolDto> attendes, OffsetDateTime start, OffsetDateTime end, String location, Calendar cal) throws java.io.IOException;
}
