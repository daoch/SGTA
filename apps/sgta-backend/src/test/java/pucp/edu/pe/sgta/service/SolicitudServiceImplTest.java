package pucp.edu.pe.sgta.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.AdditionalAnswers;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import pucp.edu.pe.sgta.dto.SolicitudCeseDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudResponseDto;
import pucp.edu.pe.sgta.model.Solicitud;
import pucp.edu.pe.sgta.model.Tema;
import pucp.edu.pe.sgta.model.TipoSolicitud;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.model.UsuarioXSolicitud;
import pucp.edu.pe.sgta.repository.SolicitudRepository;
import pucp.edu.pe.sgta.repository.TemaRepository;
import pucp.edu.pe.sgta.repository.UsuarioRepository;
import pucp.edu.pe.sgta.repository.UsuarioXSolicitudRepository;
import pucp.edu.pe.sgta.service.imp.SolicitudServiceImpl;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SolicitudServiceImplTest {

    @Mock
    private SolicitudRepository solicitudRepository;

    @Mock
    private UsuarioXSolicitudRepository usuarioXSolicitudRepository;

    @InjectMocks
    private SolicitudServiceImpl solicitudService;

    @Mock
    private TemaRepository temaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Test
    public void testFindAllSolicitudesCese_ReturnsPagedResults() {
        // Mock Solicitud
        Solicitud solicitud = new Solicitud();
        solicitud.setId(1);
        solicitud.setEstado(0);
        solicitud.setDescripcion("Solicitud de cese");
        solicitud.setFechaCreacion(OffsetDateTime.of(2024, 5, 1, 12, 0, 0, 0, ZoneOffset.UTC));
        solicitud.setFechaModificacion(OffsetDateTime.of(2024, 5, 2, 12, 0, 0, 0, ZoneOffset.UTC));
        Tema tema = new Tema();
        tema.setTitulo("Título del tema");
        solicitud.setTema(tema);

        // Mock Usuarios
        Usuario asesor = new Usuario();
        asesor.setId(10);
        asesor.setNombres("Juan");
        asesor.setPrimerApellido("Pérez");
        asesor.setCorreoElectronico("juan@pucp.edu.pe");

        Usuario estudiante = new Usuario();
        estudiante.setId(20);
        estudiante.setNombres("Ana");
        estudiante.setPrimerApellido("Gómez");

        // Mock relaciones
        UsuarioXSolicitud relAsesor = new UsuarioXSolicitud();
        relAsesor.setUsuario(asesor);
        relAsesor.setDestinatario(false);

        UsuarioXSolicitud relEstudiante = new UsuarioXSolicitud();
        relEstudiante.setUsuario(estudiante);
        relEstudiante.setDestinatario(true);

        when(solicitudRepository.findByTipoSolicitudId(2)).thenReturn(List.of(solicitud));
        when(usuarioXSolicitudRepository.findBySolicitud(solicitud)).thenReturn(List.of(relAsesor, relEstudiante));

        // Ejecutar
        SolicitudCeseDto resultado = solicitudService.findAllSolicitudesCese(0, 10);

        // Validaciones
        assertNotNull(resultado);
        assertEquals(1, resultado.getRequestTermmination().size());

        assertEquals(1, resultado.getTotalPages());

        var request = resultado.getRequestTermmination().get(0);
        assertEquals("approved", request.getStatus());
        assertEquals("Juan", request.getAssessor().getName());
        assertEquals("Ana", request.getStudents().get(0).getName());
        assertEquals("Título del tema", request.getStudents().get(0).getTopic().getName());
    }

    @Test
    void rechazarSolicitud_conResponsePersonalizado() {
        // Arrange
        Integer solicitudId = 1;
        String customResponse = "No puedo aceptar esta solicitud";

        Solicitud solicitud = new Solicitud();
        solicitud.setId(solicitudId);
        solicitud.setEstado(1);
        solicitud.setActivo(true);
        solicitud.setDescripcion("Solicitud X");
        solicitud.setFechaCreacion(OffsetDateTime.now());
        solicitud.setTema(new Tema());
        solicitud.setTipoSolicitud(new TipoSolicitud());

        when(solicitudRepository.findById(solicitudId)).thenReturn(Optional.of(solicitud));
        when(solicitudRepository.save(any(Solicitud.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        RechazoSolicitudResponseDto resultado = solicitudService.rechazarSolicitud(solicitudId, customResponse);

        // Assert
        assertNotNull(resultado);
        assertEquals("rejected", resultado.getStatus());
        assertEquals(customResponse, resultado.getResponse());
    }
}