package pucp.edu.pe.sgta.service.imp.GoogleCalendarService;

import com.google.api.client.http.HttpRequestInitializer;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import pucp.edu.pe.sgta.dto.GoogleCalendarEvent;
import pucp.edu.pe.sgta.service.inter.GoogleCalendarService.GoogleCalendarService;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.*;

import java.security.GeneralSecurityException;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoogleCalendarServiceImp implements GoogleCalendarService {


    private final HttpServletRequest request;


    @Override
    public void createEvent(GoogleCalendarEvent dto){
        HttpSession session = request.getSession(false);
        if (session == null) throw new RuntimeException("No hay sesión activa");

        String accessToken = (String) session.getAttribute("googleAccessToken");
        if (accessToken == null) throw new RuntimeException("No hay access token en sesión");

        try {
            Calendar calendar = buildCalendarClient(accessToken);

            Event event = new Event()
                    .setSummary(dto.getSummary())
                    .setLocation(dto.getLocation())
                    .setDescription(dto.getDescription());
            // PARSEO DE FECHAS
            OffsetDateTime start = dto.getStartDateTime();
            String startIso = start.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
            DateTime startDateTime = new DateTime(startIso);

            EventDateTime startEvent = new EventDateTime()
                    .setDateTime(startDateTime)
                    .setTimeZone("America/Lima");

            event.setStart(startEvent);


            OffsetDateTime end = dto.getEndDateTime();
            String endIso = end.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
            DateTime endDateTime = new DateTime(endIso);

            EventDateTime endEvent = new EventDateTime()
                    .setDateTime(endDateTime)
                    .setTimeZone("America/Lima");

            event.setEnd(endEvent);

            if (dto.getAttendess() != null && !dto.getAttendess().isEmpty()) {
                List<EventAttendee> attendeeList = dto.getAttendess().stream()
                        .map(email -> new EventAttendee().setEmail(email))
                        .toList();
                event.setAttendees(attendeeList);
            }
            // Crear el evento
            String calendarId = "primary";
            Event createdEvent = calendar.events().insert(calendarId, event).execute();
            System.out.println("Evento creado: " + createdEvent.getHtmlLink());

        } catch (Exception e) {
            throw new RuntimeException("Error al crear evento en Google Calendar: " + e.getMessage(), e);
        }
    }

    private Calendar buildCalendarClient(String accessToken) throws GeneralSecurityException, IOException, java.io.IOException {
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
}
