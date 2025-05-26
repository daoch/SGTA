package pucp.edu.pe.sgta.service.imp;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import pucp.edu.pe.sgta.dto.temas.SolicitudTemaDto;
import pucp.edu.pe.sgta.dto.temas.SolicitudTemaDto.RequestChange;
import pucp.edu.pe.sgta.dto.temas.SolicitudTemaDto.Tema;
import pucp.edu.pe.sgta.dto.temas.SolicitudTemaDto.Tesista;

@ExtendWith(MockitoExtension.class)
public class SolicitudTemaInscritoTest {
    
    @Mock
    private EntityManager entityManager;
    
    @Mock
    private Query query;
    
    @InjectMocks
    private SolicitudServiceImpl solicitudService;
    
    private SolicitudTemaDto solicitudDto;
    
    @BeforeEach
    void setUp() {
        // Create a test DTO with request data
        RequestChange requestChange = new RequestChange();
        requestChange.setId(1);
        requestChange.setRegisterTime(LocalDate.now());
        requestChange.setStatus("pending");
        requestChange.setReason("Title: Test Thesis\nSummary: A test thesis summary");
        requestChange.setResponse("Request approved");
        
        // Create a Tesista with Topic data
        Tema topic = new Tema("Sample Title", "Sample Summary");
        Tesista tesista = new Tesista(1, "John", "Doe", topic);
        List<Tesista> tesistaList = new ArrayList<>();
        tesistaList.add(tesista);
        requestChange.setStudents(tesistaList);
        
        List<RequestChange> requestList = new ArrayList<>();
        requestList.add(requestChange);
        
        solicitudDto = new SolicitudTemaDto();
        solicitudDto.setChangeRequests(requestList);
    }
    
    @Test
    void testAtenderSolicitudTemaInscritoWithValidData() {
        // Setup mocks for EntityManager and Query
        when(entityManager.createNativeQuery(anyString())).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);
        when(query.getSingleResult()).thenReturn(0); // Status 0 for approved
        
        // Call the method under test
        assertDoesNotThrow(() -> solicitudService.atenderSolicitudTemaInscrito(solicitudDto));
        
        // Verify the database procedure was called with correct parameters
        verify(entityManager).createNativeQuery(eq("SELECT atender_solicitud_tema_inscrito(:solicitudId, :title, :summary, :response)"));
        verify(query).setParameter("solicitudId", 1);
        verify(query).setParameter("title", "Sample Title");
        verify(query).setParameter("summary", "Sample Summary");
        verify(query).setParameter("response", "Request approved");
        verify(query).getSingleResult();
    }
    
    @Test
    void testAtenderSolicitudTemaInscritoWithNullDto() {
        // Test with null DTO
        Exception exception = assertThrows(RuntimeException.class, () -> 
            solicitudService.atenderSolicitudTemaInscrito(null));
            
        assertEquals("Request doesn't contain valid information", exception.getMessage());
    }
    
    @Test
    void testAtenderSolicitudTemaInscritoWithEmptyRequests() {
        // Test with empty requests list
        SolicitudTemaDto emptyDto = new SolicitudTemaDto();
        emptyDto.setChangeRequests(new ArrayList<>());
        
        Exception exception = assertThrows(RuntimeException.class, () -> 
            solicitudService.atenderSolicitudTemaInscrito(emptyDto));
            
        assertEquals("Request doesn't contain valid information", exception.getMessage());
    }
    
    @Test
    void testAtenderSolicitudTemaInscritoWithDatabaseError() {
        // Setup mocks to simulate a database error
        when(entityManager.createNativeQuery(anyString())).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);
        when(query.getSingleResult()).thenThrow(new RuntimeException("Database error"));
        
        // Call the method and verify it throws an exception
        Exception exception = assertThrows(RuntimeException.class, () -> 
            solicitudService.atenderSolicitudTemaInscrito(solicitudDto));
            
        assertEquals("Failed to process thesis topic request", exception.getMessage());
        
        // Verify interactions
        verify(entityManager).createNativeQuery(anyString());
        verify(query, times(4)).setParameter(anyString(), any());
    }
}
