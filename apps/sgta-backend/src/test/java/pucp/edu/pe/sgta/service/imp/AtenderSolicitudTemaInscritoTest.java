package pucp.edu.pe.sgta.service.imp;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;

import pucp.edu.pe.sgta.dto.temas.SolicitudTemaDto;

import java.time.LocalDate;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
class AtenderSolicitudTemaInscritoTest {

    @Mock
    private EntityManager entityManager;

    @Mock
    private Query query;

    @InjectMocks
    private SolicitudServiceImpl solicitudService;

    @Test
    @Transactional
    void testAtenderSolicitudTemaInscritoWithFullData() {
        // Arrange
        SolicitudTemaDto.Tema tema = new SolicitudTemaDto.Tema("New Title", "New Summary");
        SolicitudTemaDto.Tesista tesista = new SolicitudTemaDto.Tesista(1, "Student", "Name", tema);
        
        SolicitudTemaDto.RequestChange requestChange = new SolicitudTemaDto.RequestChange();
        requestChange.setId(123);
        requestChange.setRegisterTime(LocalDate.now());
        requestChange.setStatus("pending");
        requestChange.setResponse("Request approved");
        requestChange.setStudents(Collections.singletonList(tesista));
        
        SolicitudTemaDto solicitudTemaDto = new SolicitudTemaDto();
        solicitudTemaDto.setChangeRequests(Collections.singletonList(requestChange));
        
        when(entityManager.createNativeQuery(anyString())).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);
        when(query.getSingleResult()).thenReturn(0);

        // Act
        solicitudService.atenderSolicitudTemaInscrito(solicitudTemaDto);
        
        // Assert
        verify(entityManager).createNativeQuery("SELECT atender_solicitud_tema_inscrito(:solicitudId, :title, :summary, :response)");
        verify(query).setParameter("solicitudId", 123);
        verify(query).setParameter("title", "New Title");
        verify(query).setParameter("summary", "New Summary");
        verify(query).setParameter("response", "Request approved");
    }
    
    @Test
    @Transactional
    void testAtenderSolicitudTemaInscritoWithOnlyTitle() {
        // Arrange
        SolicitudTemaDto.Tema tema = new SolicitudTemaDto.Tema("New Title", null);
        SolicitudTemaDto.Tesista tesista = new SolicitudTemaDto.Tesista(1, "Student", "Name", tema);
        
        SolicitudTemaDto.RequestChange requestChange = new SolicitudTemaDto.RequestChange();
        requestChange.setId(123);
        requestChange.setRegisterTime(LocalDate.now());
        requestChange.setStatus("pending");
        requestChange.setResponse("Only title updated");
        requestChange.setStudents(Collections.singletonList(tesista));
        
        SolicitudTemaDto solicitudTemaDto = new SolicitudTemaDto();
        solicitudTemaDto.setChangeRequests(Collections.singletonList(requestChange));
        
        when(entityManager.createNativeQuery(anyString())).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);
        when(query.getSingleResult()).thenReturn(0);

        // Act
        solicitudService.atenderSolicitudTemaInscrito(solicitudTemaDto);
          // Assert
        verify(entityManager).createNativeQuery("SELECT atender_solicitud_tema_inscrito(:solicitudId, :title, :summary, :response)");
        verify(query).setParameter("solicitudId", 123);
        verify(query).setParameter("title", "New Title");
        verify(query).setParameter("summary", null);
        verify(query).setParameter("response", "Only title updated");
    }
    
    @Test
    @Transactional
    void testAtenderSolicitudTemaInscritoWithOnlySummary() {
        // Arrange
        SolicitudTemaDto.Tema tema = new SolicitudTemaDto.Tema(null, "New Summary");
        SolicitudTemaDto.Tesista tesista = new SolicitudTemaDto.Tesista(1, "Student", "Name", tema);
        
        SolicitudTemaDto.RequestChange requestChange = new SolicitudTemaDto.RequestChange();
        requestChange.setId(123);
        requestChange.setRegisterTime(LocalDate.now());
        requestChange.setStatus("pending");
        requestChange.setResponse("Only summary updated");
        requestChange.setStudents(Collections.singletonList(tesista));
        
        SolicitudTemaDto solicitudTemaDto = new SolicitudTemaDto();
        solicitudTemaDto.setChangeRequests(Collections.singletonList(requestChange));
        
        when(entityManager.createNativeQuery(anyString())).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);
        when(query.getSingleResult()).thenReturn(0);

        // Act
        solicitudService.atenderSolicitudTemaInscrito(solicitudTemaDto);
          // Assert
        verify(entityManager).createNativeQuery("SELECT atender_solicitud_tema_inscrito(:solicitudId, :title, :summary, :response)");
        verify(query).setParameter("solicitudId", 123);
        verify(query).setParameter("title", null);
        verify(query).setParameter("summary", "New Summary");
        verify(query).setParameter("response", "Only summary updated");
    }
      @Test
    @Transactional
    void testAtenderSolicitudTemaInscritoWithNoTopicData() {
        // Arrange
        SolicitudTemaDto.RequestChange requestChange = new SolicitudTemaDto.RequestChange();
        requestChange.setId(123);
        requestChange.setRegisterTime(LocalDate.now());
        requestChange.setStatus("pending");
        requestChange.setResponse("No topic updates");
        requestChange.setStudents(Collections.emptyList());
        
        SolicitudTemaDto solicitudTemaDto = new SolicitudTemaDto();
        solicitudTemaDto.setChangeRequests(Collections.singletonList(requestChange));
        
        when(entityManager.createNativeQuery(anyString())).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);
        when(query.getSingleResult()).thenReturn(0);

        // Act
        solicitudService.atenderSolicitudTemaInscrito(solicitudTemaDto);
          // Assert
        verify(entityManager).createNativeQuery("SELECT atender_solicitud_tema_inscrito(:solicitudId, :title, :summary, :response)");
        verify(query).setParameter("solicitudId", 123);
        verify(query).setParameter("title", null);
        verify(query).setParameter("summary", null);
        verify(query).setParameter("response", "No topic updates");
    }
}
