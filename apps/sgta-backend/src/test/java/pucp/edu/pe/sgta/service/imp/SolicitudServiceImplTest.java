package pucp.edu.pe.sgta.service.imp;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.AdditionalAnswers;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import pucp.edu.pe.sgta.dto.SolicitudCeseDto;
import pucp.edu.pe.sgta.dto.AprobarSolicitudCambioAsesorResponseDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudCambioAsesorResponseDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudResponseDto;
import pucp.edu.pe.sgta.dto.SolicitudCambioAsesorDto;
import pucp.edu.pe.sgta.model.Solicitud;
import pucp.edu.pe.sgta.model.SubAreaConocimiento;
import pucp.edu.pe.sgta.model.SubAreaConocimientoXTema;
import pucp.edu.pe.sgta.model.Tema;
import pucp.edu.pe.sgta.model.TipoSolicitud;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.model.UsuarioXSolicitud;
import pucp.edu.pe.sgta.repository.SolicitudRepository;
import pucp.edu.pe.sgta.repository.SubAreaConocimientoXTemaRepository;
import pucp.edu.pe.sgta.repository.TemaRepository;
import pucp.edu.pe.sgta.repository.UsuarioRepository;
import pucp.edu.pe.sgta.repository.UsuarioXSolicitudRepository;
import pucp.edu.pe.sgta.repository.UsuarioXTemaRepository;

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

    @Mock
    private UsuarioXTemaRepository usuarioXTemaRepository;

    @Mock
    private SubAreaConocimientoXTemaRepository subAreaConocimientoXTemaRepository;

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

        when(solicitudRepository.findByTipoSolicitudNombre("Cese Asesoria")).thenReturn(List.of(solicitud));
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
        TipoSolicitud tipoSolicitud = new TipoSolicitud();
        tipoSolicitud.setNombre("Cese Asesoria");
        solicitud.setTipoSolicitud(tipoSolicitud);

        when(solicitudRepository.findById(solicitudId)).thenReturn(Optional.of(solicitud));
        when(solicitudRepository.save(any(Solicitud.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        RechazoSolicitudResponseDto resultado = solicitudService.rechazarSolicitud(solicitudId, customResponse);

        // Assert
        assertNotNull(resultado);
        assertEquals("rejected", resultado.getStatus());
        assertEquals(customResponse, resultado.getResponse());
    }

    @Test
    void aprobarSolicitud_deberiaAprobarSolicitudSiEsValida() {
        // Arrange
        int solicitudId = 1;

        TipoSolicitud tipoCese = new TipoSolicitud();
        tipoCese.setId(2);
        tipoCese.setNombre("Cese Asesoria");

        Solicitud solicitud = new Solicitud();
        solicitud.setId(solicitudId);
        solicitud.setEstado(1); // pendiente
        solicitud.setTipoSolicitud(tipoCese);
        solicitud.setTema(new Tema());

        when(solicitudRepository.findById(solicitudId)).thenReturn(Optional.of(solicitud));

        // Act
        solicitudService.aprobarSolicitud(solicitudId, "response");

        // Assert
        assertEquals(0, solicitud.getEstado()); // aprobado
        verify(solicitudRepository).save(solicitud);
    }

    @Test
    void testFindAllSolicitudesCambioAsesor_ReturnsPaginatedResults() {
        // Datos de prueba
        Solicitud solicitud = new Solicitud();
        solicitud.setId(1);
        solicitud.setDescripcion("Cambio de asesor");
        solicitud.setEstado(1); // pending
        solicitud.setFechaCreacion(OffsetDateTime.now());
        solicitud.setFechaModificacion(OffsetDateTime.now());

        Tema tema = new Tema();
        tema.setId(1);
        tema.setTitulo("Tema de tesis");
        solicitud.setTema(tema);

        Usuario asesorUsuario = new Usuario();
        asesorUsuario.setId(10);
        asesorUsuario.setNombres("Juan");
        asesorUsuario.setPrimerApellido("Pérez");
        asesorUsuario.setCorreoElectronico("juan@pucp.edu.pe");

        Usuario estudianteUsuario = new Usuario();
        estudianteUsuario.setId(20);
        estudianteUsuario.setNombres("Ana");
        estudianteUsuario.setPrimerApellido("López");
        estudianteUsuario.setCorreoElectronico("ana@pucp.edu.pe");

        UsuarioXSolicitud relAsesor = new UsuarioXSolicitud();
        relAsesor.setUsuario(asesorUsuario);
        relAsesor.setDestinatario(false);

        UsuarioXSolicitud relEstudiante = new UsuarioXSolicitud();
        relEstudiante.setUsuario(estudianteUsuario);
        relEstudiante.setDestinatario(true);

        SubAreaConocimiento subArea = new SubAreaConocimiento();
        subArea.setId(100);
        subArea.setNombre("Inteligencia Artificial");

        SubAreaConocimientoXTema subAreaXTema = new SubAreaConocimientoXTema();
        subAreaXTema.setSubAreaConocimiento(subArea);

        // Mocks
        when(solicitudRepository.findByTipoSolicitudNombre("Cambio Asesor"))
            .thenReturn(List.of(solicitud));

        when(usuarioXSolicitudRepository.findBySolicitud(solicitud))
            .thenReturn(List.of(relAsesor, relEstudiante));

        when(subAreaConocimientoXTemaRepository.findFirstByTemaIdAndActivoTrue(1))
            .thenReturn(subAreaXTema);

        // Método a probar
        SolicitudCambioAsesorDto result = solicitudService.findAllSolicitudesCambioAsesor(0, 10);

        // Verificaciones
        assertNotNull(result);
        assertEquals(1, result.getAssesorChangeRequests().size());
        assertEquals(1, result.getTotalPages());
        assertEquals("pending", result.getAssesorChangeRequests().get(0).getStatus());

        var estudiante = result.getAssesorChangeRequests().get(0).getStudent();
        assertNotNull(estudiante);
        assertEquals("Ana", estudiante.getName());
        assertEquals("Inteligencia Artificial", estudiante.getTopic().getThematicArea().getName());
    }

    @Test
    void testRechazarSolicitudCambioAsesor_SuccessfulRejection() {
        // Arrange
        int solicitudId = 1;
        String responseText = "Motivo de rechazo";

        TipoSolicitud tipoCambioAsesor = new TipoSolicitud();
        tipoCambioAsesor.setNombre("Cambio Asesor");

        Usuario asesor = new Usuario();
        asesor.setId(10);

        Usuario tesista = new Usuario();
        tesista.setId(20);

        Solicitud solicitud = new Solicitud();
        solicitud.setId(solicitudId);
        solicitud.setEstado(1); // pendiente
        solicitud.setTipoSolicitud(tipoCambioAsesor);

        UsuarioXSolicitud relAsesor = new UsuarioXSolicitud();
        relAsesor.setUsuario(asesor);

        UsuarioXSolicitud relTesista = new UsuarioXSolicitud();
        relTesista.setUsuario(tesista);

        when(solicitudRepository.findById(solicitudId)).thenReturn(Optional.of(solicitud));
        when(usuarioXSolicitudRepository.findFirstBySolicitudAndDestinatarioTrue(solicitud)).thenReturn(relAsesor);
        when(usuarioXSolicitudRepository.findFirstBySolicitudAndDestinatarioFalse(solicitud)).thenReturn(relTesista);

        // Act
        RechazoSolicitudCambioAsesorResponseDto result =
                solicitudService.rechazarSolicitudCambioAsesor(solicitudId, responseText);

        // Assert
        assertNotNull(result);
        assertEquals(solicitudId, result.getIdRequest());
        assertEquals("rejected", result.getStatus());
        assertEquals(responseText, result.getResponse());
        assertNotNull(result.getAssignation());
        assertEquals(tesista.getId(), result.getAssignation().getIdStudent());
        assertEquals(asesor.getId(), result.getAssignation().getIdAssessor());

        verify(solicitudRepository).save(solicitud);
    }

    @Test
    void testAprobarSolicitudCambioAsesor_SuccessfulApproval() {
        // Arrange
        Integer solicitudId = 1;
        String responseText = "Aprobado por el coordinador";

        TipoSolicitud tipoCambioAsesor = new TipoSolicitud();
        tipoCambioAsesor.setNombre("Cambio Asesor");

        Usuario asesor = new Usuario();
        asesor.setId(10);

        Usuario tesista = new Usuario();
        tesista.setId(20);

        Solicitud solicitud = new Solicitud();
        solicitud.setId(solicitudId);
        solicitud.setEstado(1); // Pendiente
        solicitud.setTipoSolicitud(tipoCambioAsesor);

        UsuarioXSolicitud relAsesor = new UsuarioXSolicitud();
        relAsesor.setUsuario(asesor);

        UsuarioXSolicitud relTesista = new UsuarioXSolicitud();
        relTesista.setUsuario(tesista);

        when(solicitudRepository.findById(solicitudId)).thenReturn(Optional.of(solicitud));
        when(usuarioXSolicitudRepository.findFirstBySolicitudAndDestinatarioTrue(solicitud)).thenReturn(relAsesor);
        when(usuarioXSolicitudRepository.findFirstBySolicitudAndDestinatarioFalse(solicitud)).thenReturn(relTesista);

        // Act
        AprobarSolicitudCambioAsesorResponseDto result =
                solicitudService.aprobarSolicitudCambioAsesor(solicitudId, responseText);

        // Assert
        assertNotNull(result);
        assertEquals(solicitudId, result.getIdRequest());
        assertEquals("approved", result.getStatus());
        assertEquals(responseText, result.getResponse());
        assertNotNull(result.getAssignation());
        assertEquals(tesista.getId(), result.getAssignation().getIdStudent());
        assertEquals(asesor.getId(), result.getAssignation().getIdAssessor());

        verify(solicitudRepository).save(solicitud);
    }
}
