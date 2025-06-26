package pucp.edu.pe.sgta.service.imp.GoogleService;

import com.google.api.client.http.HttpRequestInitializer;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.GoogleCalendarEvent;
import pucp.edu.pe.sgta.dto.UsarioRolDto;
import pucp.edu.pe.sgta.service.inter.GoogleService.GoogleCalendarService;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.*;

import java.security.GeneralSecurityException;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoogleCalendarServiceImp implements GoogleCalendarService {


    private final HttpServletRequest request;


    @Override
    public Event createEvent(GoogleCalendarEvent dto){

        Event event = new Event();
        event.setSummary(dto.getSummary());
        event.setDescription(dto.getDescription());
        event.setLocation(dto.getLocation());
        List<EventAttendee>attendes = new ArrayList<>();
        for(UsarioRolDto us :dto.getAttendess()){
            EventAttendee attendee = new EventAttendee();
            attendee.setEmail(us.getCorreo());
            attendee.setOptional(false);
            attendes.add(attendee);
        }
        event.setAttendees(attendes);
        OffsetDateTime start = dto.getStart();
        String timeZone = "America/Lima";
        String startIso = start.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        com.google.api.client.util.DateTime googleStartDateTime = new com.google.api.client.util.DateTime(startIso);
        EventDateTime startEvent = new EventDateTime()
                .setDateTime(googleStartDateTime)
                .setTimeZone(timeZone);
        event.setStart(startEvent);

        OffsetDateTime end = dto.getStart();

        String EndIso = end.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        com.google.api.client.util.DateTime googleEndDateTime= new com.google.api.client.util.DateTime(EndIso);
        EventDateTime endEvent = new EventDateTime()
                .setDateTime(googleEndDateTime)
                .setTimeZone(timeZone);
        event.setEnd(endEvent);
        return event;
    }


    @Override
    public Calendar buildCalendarClient(String accessToken) throws GeneralSecurityException, IOException, java.io.IOException {
        HttpRequestInitializer requestInitializer = request -> {
            request.getHeaders().setAuthorization("Bearer " + accessToken);
        };

        return new Calendar.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance(),
                requestInitializer
        )
                .setApplicationName("SGTA")
                .build();
    }

    @Override
    public void sendEvent(String summary, String description, List<UsarioRolDto> attendes, OffsetDateTime start, OffsetDateTime end, String location, Calendar cal) throws java.io.IOException {
        GoogleCalendarEvent dto = new GoogleCalendarEvent();
        dto.setSummary(summary);
        dto.setDescription(description);
        dto.setAttendess(attendes);
        dto.setStart(start);
        dto.setEnd(end);
        dto.setLocation(location);
        Event event =  createEvent(dto);

        var request = cal.events().insert("primary", event);


        request.setSendUpdates("all");
        try{
            request.execute();
        }
        catch (IOException e){
            System.out.println(e.getMessage());
        }

    }
}