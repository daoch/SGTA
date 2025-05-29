//package pucp.edu.pe.sgta.service.imp;
//
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.AdditionalAnswers;
//import org.mockito.ArgumentCaptor;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//import pucp.edu.pe.sgta.dto.SolicitudCeseDto;
//import pucp.edu.pe.sgta.dto.AprobarSolicitudCambioAsesorResponseDto;
//import pucp.edu.pe.sgta.dto.AprobarSolicitudResponseDto;
//import pucp.edu.pe.sgta.dto.AprobarSolicitudResponseDto.AprobarAsignacionDto;
//import pucp.edu.pe.sgta.dto.DetalleSolicitudCeseDto;
//import pucp.edu.pe.sgta.dto.RechazoSolicitudCambioAsesorResponseDto;
//import pucp.edu.pe.sgta.dto.RechazoSolicitudResponseDto;
//import pucp.edu.pe.sgta.dto.SolicitudCambioAsesorDto;
//import pucp.edu.pe.sgta.model.Carrera;
//import pucp.edu.pe.sgta.model.EstadoTema;
//import pucp.edu.pe.sgta.model.Solicitud;
//import pucp.edu.pe.sgta.model.SubAreaConocimiento;
//import pucp.edu.pe.sgta.model.SubAreaConocimientoXTema;
//import pucp.edu.pe.sgta.model.Tema;
//import pucp.edu.pe.sgta.model.TipoSolicitud;
//import pucp.edu.pe.sgta.model.Usuario;
//import pucp.edu.pe.sgta.model.UsuarioXCarrera;
//import pucp.edu.pe.sgta.model.UsuarioXSolicitud;
//import pucp.edu.pe.sgta.model.UsuarioXTema;
//import pucp.edu.pe.sgta.repository.EstadoTemaRepository;
//import pucp.edu.pe.sgta.repository.SolicitudRepository;
//import pucp.edu.pe.sgta.repository.SubAreaConocimientoXTemaRepository;
//import pucp.edu.pe.sgta.repository.TemaRepository;
//import pucp.edu.pe.sgta.repository.UsuarioRepository;
//import pucp.edu.pe.sgta.repository.UsuarioXCarreraRepository;
//import pucp.edu.pe.sgta.repository.UsuarioXSolicitudRepository;
//import pucp.edu.pe.sgta.repository.UsuarioXTemaRepository;
//
//import java.time.OffsetDateTime;
//import java.time.ZoneOffset;
//import java.util.List;
//import java.util.Optional;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.argThat;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//public class SolicitudServiceImplTest {
//
//    @Mock
//    private SolicitudRepository solicitudRepository;
//
//    @Mock
//    private UsuarioXSolicitudRepository usuarioXSolicitudRepository;
//
//    @InjectMocks
//    private SolicitudServiceImpl solicitudService;
//
//    @Mock
//    private TemaRepository temaRepository;
//
//    @Mock
//    private UsuarioRepository usuarioRepository;
//
//    @Mock
//    private UsuarioXTemaRepository usuarioXTemaRepository;
//
//    @Mock
//    private SubAreaConocimientoXTemaRepository subAreaConocimientoXTemaRepository;
//
//    @Mock
//    private UsuarioXCarreraRepository usuarioXCarreraRepository;
//
//    @Mock
//    private EstadoTemaRepository estadoTemaRepository;
//
//    @Test
//    public void testFindAllSolicitudesCese_ReturnsPaginatedResults() {
//        int coordinatorId = 1;
//        int page = 0;
//        int size = 2;
//
//        // Carrera del coordinador
//        Carrera carrera = new Carrera();
//        carrera.setId(101);
//        carrera.setNombre("Ingeniería Informática");
//
//        UsuarioXCarrera usuarioXCarrera = new UsuarioXCarrera();
//        usuarioXCarrera.setCarrera(carrera);
//
//        when(usuarioXCarreraRepository.findByUsuarioIdAndActivoTrue(coordinatorId))
//                .thenReturn(List.of(usuarioXCarrera));
//
//        // Solicitud 1 (coincide con carrera)
//        Solicitud solicitud1 = new Solicitud();
//        solicitud1.setId(1001);
//        solicitud1.setDescripcion("Solicitud A");
//        solicitud1.setRespuesta("Respuesta A");
//        solicitud1.setEstado(0); // approved
//        solicitud1.setFechaCreacion(OffsetDateTime.of(2024, 5, 1, 10, 0, 0, 0, ZoneOffset.UTC));
//        solicitud1.setFechaModificacion(OffsetDateTime.of(2024, 5, 2, 10, 0, 0, 0, ZoneOffset.UTC));
//
//        Tema tema1 = new Tema();
//        tema1.setId(1);
//        tema1.setTitulo("Tema A");
//        tema1.setCarrera(carrera);
//        solicitud1.setTema(tema1);
//
//        // Asesor
//        Usuario asesor = new Usuario();
//        asesor.setId(10);
//        asesor.setNombres("Carlos");
//        asesor.setPrimerApellido("Ramírez");
//        asesor.setCorreoElectronico("carlos@pucp.edu.pe");
//
//        UsuarioXTema relAsesor = new UsuarioXTema();
//        relAsesor.setUsuario(asesor);
//
//        // Estudiante
//        Usuario estudiante = new Usuario();
//        estudiante.setId(20);
//        estudiante.setNombres("Lucía");
//        estudiante.setPrimerApellido("Torres");
//
//        UsuarioXTema relEstudiante = new UsuarioXTema();
//        relEstudiante.setUsuario(estudiante);
//
//        when(solicitudRepository.findByTipoSolicitudNombre("Cese Asesoria"))
//                .thenReturn(List.of(solicitud1));
//
//        when(usuarioXTemaRepository.findFirstByTemaIdAndRolNombreAndActivoTrue(1, "Asesor"))
//                .thenReturn(relAsesor);
//
//        when(usuarioXTemaRepository.findByUsuarioIdAndRolNombreAndActivoTrue(10, "Asesor"))
//                .thenReturn(List.of(new UsuarioXTema(), new UsuarioXTema())); // 2 solicitudes asesor
//
//        when(usuarioXTemaRepository.findByTemaIdAndRolNombreAndActivoTrue(1, "Tesista"))
//                .thenReturn(List.of(relEstudiante));
//
//        // Ejecutar método
//        SolicitudCeseDto resultado = solicitudService.findAllSolicitudesCese(coordinatorId, page, size);
//
//        // Validaciones
//        assertNotNull(resultado);
//        assertEquals(1, resultado.getRequestTermmination().size());
//        assertEquals(1, resultado.getTotalPages());
//
//        var request = resultado.getRequestTermmination().get(0);
//        assertEquals(1001, request.getId());
//        assertEquals("Solicitud A", request.getReason());
//        assertEquals("Respuesta A", request.getResponse());
//        assertEquals("approved", request.getStatus());
//
//        var asesorDto = request.getAssessor();
//        assertEquals(10, asesorDto.getId());
//        assertEquals("Carlos", asesorDto.getName());
//        assertEquals("Ramírez", asesorDto.getLastName());
//        assertEquals("carlos@pucp.edu.pe", asesorDto.getEmail());
//        assertEquals(2, asesorDto.getQuantityCurrentProyects());
//
//        var estudianteDto = request.getStudents().get(0);
//        assertEquals(20, estudianteDto.getId());
//        assertEquals("Lucía", estudianteDto.getName());
//        assertEquals("Torres", estudianteDto.getLastName());
//        assertEquals("Tema A", estudianteDto.getTopic().getName());
//    }
//
//    @Test
//    public void testGetDetalleSolicitudCese_ReturnsCorrectDetails() {
//        // Mock Solicitud
//        Solicitud solicitud = new Solicitud();
//        solicitud.setId(1);
//        solicitud.setEstado(0); // approved
//        solicitud.setDescripcion("Solicitud de cese");
//        solicitud.setRespuesta("Respuesta del comité");
//        solicitud.setFechaCreacion(OffsetDateTime.of(2024, 5, 1, 12, 0, 0, 0, ZoneOffset.UTC));
//        solicitud.setFechaModificacion(OffsetDateTime.of(2024, 5, 2, 12, 0, 0, 0, ZoneOffset.UTC));
//
//        Tema tema = new Tema();
//        tema.setId(100);
//        tema.setTitulo("Tema de Tesis");
//        solicitud.setTema(tema);
//
//        // Mock Asesor
//        Usuario asesor = new Usuario();
//        asesor.setId(10);
//        asesor.setNombres("Carlos");
//        asesor.setPrimerApellido("Ramírez");
//        asesor.setCorreoElectronico("carlos@pucp.edu.pe");
//
//        UsuarioXTema relAsesor = new UsuarioXTema();
//        relAsesor.setUsuario(asesor);
//
//        // Mock Estudiante
//        Usuario estudiante = new Usuario();
//        estudiante.setId(20);
//        estudiante.setNombres("Lucía");
//        estudiante.setPrimerApellido("Torres");
//        estudiante.setCorreoElectronico("lucia@pucp.edu.pe");
//
//        UsuarioXTema relEstudiante = new UsuarioXTema();
//        relEstudiante.setUsuario(estudiante);
//
//        // Configurar mocks
//        when(solicitudRepository.findById(1)).thenReturn(Optional.of(solicitud));
//        when(usuarioXTemaRepository.findFirstByTemaIdAndRolNombreAndActivoTrue(100, "Asesor")).thenReturn(relAsesor);
//        when(usuarioXTemaRepository.findByTemaIdAndRolNombreAndActivoTrue(100, "Tesista")).thenReturn(List.of(relEstudiante));
//        when(usuarioXTemaRepository.findByUsuarioIdAndRolNombreAndActivoTrue(10, "asesor")).thenReturn(List.of(new UsuarioXTema(), new UsuarioXTema())); // 2 solicitudes
//
//        // Ejecutar método
//        DetalleSolicitudCeseDto detalle = solicitudService.getDetalleSolicitudCese(1);
//
//        // Validaciones
//        assertNotNull(detalle);
//        assertEquals(1, detalle.getId());
//        assertEquals("approved", detalle.getStatus());
//        assertEquals("Solicitud de cese", detalle.getReason());
//        assertEquals("Respuesta del comité", detalle.getResponse());
//
//        // Validar asesor
//        var asesorDto = detalle.getAssessor();
//        assertEquals(10, asesorDto.getId());
//        assertEquals("Carlos", asesorDto.getName());
//        assertEquals("Ramírez", asesorDto.getLastName());
//        assertEquals("carlos@pucp.edu.pe", asesorDto.getEmail());
//        assertEquals(2, asesorDto.getQuantityCurrentProyects());
//
//        // Validar estudiantes
//        assertEquals(1, detalle.getStudents().size());
//        var estudianteDto = detalle.getStudents().get(0);
//        assertEquals(20, estudianteDto.getId());
//        assertEquals("Lucía", estudianteDto.getName());
//        assertEquals("Torres", estudianteDto.getLastName());
//        assertEquals("lucia@pucp.edu.pe", estudianteDto.getEmail());
//        assertEquals("Tema de Tesis", estudianteDto.getTopic().getName());
//    }
//
//    @Test
//    void rechazarSolicitud_conResponsePersonalizado() {
//        // Arrange
//        Integer solicitudId = 1;
//        String customResponse = "No puedo aceptar esta solicitud";
//
//        Solicitud solicitud = new Solicitud();
//        solicitud.setId(solicitudId);
//        solicitud.setEstado(1);
//        solicitud.setActivo(true);
//        solicitud.setDescripcion("Solicitud X");
//        solicitud.setFechaCreacion(OffsetDateTime.now());
//        solicitud.setTema(new Tema());
//        TipoSolicitud tipoSolicitud = new TipoSolicitud();
//        tipoSolicitud.setNombre("Cese Asesoria");
//        solicitud.setTipoSolicitud(tipoSolicitud);
//
//        when(solicitudRepository.findById(solicitudId)).thenReturn(Optional.of(solicitud));
//        when(solicitudRepository.save(any(Solicitud.class))).thenAnswer(i -> i.getArgument(0));
//
//        // Act
//        RechazoSolicitudResponseDto resultado = solicitudService.rechazarSolicitud(solicitudId, customResponse);
//
//        // Assert
//        assertNotNull(resultado);
//        assertEquals("rejected", resultado.getStatus());
//        assertEquals(customResponse, resultado.getResponse());
//    }
//
//    @Test
//    void testAprobarSolicitud_Success() {
//        // Datos de entrada
//        Integer solicitudId = 1;
//        String respuesta = "Aprobado por el coordinador";
//
//        // Entidades mockeadas
//        Solicitud solicitud = new Solicitud();
//        solicitud.setId(solicitudId);
//        solicitud.setEstado(1); // pendiente
//        solicitud.setRespuesta(null);
//        solicitud.setFechaModificacion(null);
//
//        TipoSolicitud tipo = new TipoSolicitud();
//        tipo.setNombre("Cese Asesoria");
//        solicitud.setTipoSolicitud(tipo);
//
//        Tema tema = new Tema();
//        tema.setId(100);
//        EstadoTema estadoActual = new EstadoTema();
//        estadoActual.setNombre("EN CURSO");
//        tema.setEstadoTema(estadoActual);
//        solicitud.setTema(tema);
//
//        // Mock asesores
//        Usuario asesor = new Usuario();
//        asesor.setId(10);
//        UsuarioXTema relAsesor = new UsuarioXTema();
//        relAsesor.setUsuario(asesor);
//        relAsesor.setTema(tema);
//
//        // Mock tesistas
//        Usuario tesista = new Usuario();
//        tesista.setId(20);
//        UsuarioXTema relTesista = new UsuarioXTema();
//        relTesista.setUsuario(tesista);
//        relTesista.setTema(tema);
//
//        // Mock estado tema "PAUSADO"
//        EstadoTema pausado = new EstadoTema();
//        pausado.setNombre("PAUSADO");
//
//        // Mock repositorios
//        when(solicitudRepository.findById(solicitudId)).thenReturn(Optional.of(solicitud));
//        when(usuarioXTemaRepository.findByTemaIdAndRolNombreAndActivoTrue(100, "Asesor")).thenReturn(List.of(relAsesor));
//        when(usuarioXTemaRepository.findByTemaIdAndRolNombreAndActivoTrue(100, "Tesista")).thenReturn(List.of(relTesista));
//        when(estadoTemaRepository.findByNombre("PAUSADO")).thenReturn(Optional.of(pausado));
//
//        // Ejecutar método
//        AprobarSolicitudResponseDto resultado = solicitudService.aprobarSolicitud(solicitudId, respuesta);
//
//        // Validaciones
//        assertNotNull(resultado);
//        assertEquals(solicitudId, resultado.getIdRequest());
//        assertEquals("approved", resultado.getStatus());
//        assertEquals(respuesta, resultado.getResponse());
//
//        List<AprobarAsignacionDto> asignaciones = resultado.getAssignations();
//        assertEquals(1, asignaciones.size());
//        AprobarAsignacionDto asignacion = asignaciones.get(0);
//        assertEquals(20, asignacion.getIdStudent());
//        assertEquals(10, asignacion.getIdAssessor());
//
//        // Verificar cambios en la solicitud
//        assertEquals(0, solicitud.getEstado()); // aprobado
//        assertEquals(respuesta, solicitud.getRespuesta());
//        assertNotNull(solicitud.getFechaModificacion());
//
//        // Verificar desactivación de asesor
//        verify(usuarioXTemaRepository).save(argThat(rel -> !rel.getActivo()));
//
//        // Verificar actualización de estado del tema
//        verify(temaRepository).save(argThat(t -> t.getEstadoTema().getNombre().equals("PAUSADO")));
//    }
//
//    @Test
//    void testFindAllSolicitudesCambioAsesor_ReturnsPaginatedResults() {
//        // Datos de prueba
//        Solicitud solicitud = new Solicitud();
//        solicitud.setId(1);
//        solicitud.setDescripcion("Cambio de asesor");
//        solicitud.setEstado(1); // pending
//        solicitud.setFechaCreacion(OffsetDateTime.now());
//        solicitud.setFechaModificacion(OffsetDateTime.now());
//
//        Tema tema = new Tema();
//        tema.setId(1);
//        tema.setTitulo("Tema de tesis");
//        solicitud.setTema(tema);
//
//        Usuario asesorUsuario = new Usuario();
//        asesorUsuario.setId(10);
//        asesorUsuario.setNombres("Juan");
//        asesorUsuario.setPrimerApellido("Pérez");
//        asesorUsuario.setCorreoElectronico("juan@pucp.edu.pe");
//
//        Usuario estudianteUsuario = new Usuario();
//        estudianteUsuario.setId(20);
//        estudianteUsuario.setNombres("Ana");
//        estudianteUsuario.setPrimerApellido("López");
//        estudianteUsuario.setCorreoElectronico("ana@pucp.edu.pe");
//
//        UsuarioXSolicitud relAsesor = new UsuarioXSolicitud();
//        relAsesor.setUsuario(asesorUsuario);
//        relAsesor.setDestinatario(false);
//
//        UsuarioXSolicitud relEstudiante = new UsuarioXSolicitud();
//        relEstudiante.setUsuario(estudianteUsuario);
//        relEstudiante.setDestinatario(true);
//
//        SubAreaConocimiento subArea = new SubAreaConocimiento();
//        subArea.setId(100);
//        subArea.setNombre("Inteligencia Artificial");
//
//        SubAreaConocimientoXTema subAreaXTema = new SubAreaConocimientoXTema();
//        subAreaXTema.setSubAreaConocimiento(subArea);
//
//        // Mocks
//        when(solicitudRepository.findByTipoSolicitudNombre("Cambio Asesor"))
//            .thenReturn(List.of(solicitud));
//
//        when(usuarioXSolicitudRepository.findBySolicitud(solicitud))
//            .thenReturn(List.of(relAsesor, relEstudiante));
//
//        when(subAreaConocimientoXTemaRepository.findFirstByTemaIdAndActivoTrue(1))
//            .thenReturn(subAreaXTema);
//
//        // Método a probar
//        SolicitudCambioAsesorDto result = solicitudService.findAllSolicitudesCambioAsesor(0, 10);
//
//        // Verificaciones
//        assertNotNull(result);
//        assertEquals(1, result.getAssesorChangeRequests().size());
//        assertEquals(1, result.getTotalPages());
//        assertEquals("pending", result.getAssesorChangeRequests().get(0).getStatus());
//
//        var estudiante = result.getAssesorChangeRequests().get(0).getStudent();
//        assertNotNull(estudiante);
//        assertEquals("Ana", estudiante.getName());
//        assertEquals("Inteligencia Artificial", estudiante.getTopic().getThematicArea().getName());
//    }
//
//    @Test
//    void testRechazarSolicitudCambioAsesor_SuccessfulRejection() {
//        // Arrange
//        int solicitudId = 1;
//        String responseText = "Motivo de rechazo";
//
//        TipoSolicitud tipoCambioAsesor = new TipoSolicitud();
//        tipoCambioAsesor.setNombre("Cambio Asesor");
//
//        Usuario asesor = new Usuario();
//        asesor.setId(10);
//
//        Usuario tesista = new Usuario();
//        tesista.setId(20);
//
//        Solicitud solicitud = new Solicitud();
//        solicitud.setId(solicitudId);
//        solicitud.setEstado(1); // pendiente
//        solicitud.setTipoSolicitud(tipoCambioAsesor);
//
//        UsuarioXSolicitud relAsesor = new UsuarioXSolicitud();
//        relAsesor.setUsuario(asesor);
//
//        UsuarioXSolicitud relTesista = new UsuarioXSolicitud();
//        relTesista.setUsuario(tesista);
//
//        when(solicitudRepository.findById(solicitudId)).thenReturn(Optional.of(solicitud));
//        when(usuarioXSolicitudRepository.findFirstBySolicitudAndDestinatarioTrue(solicitud)).thenReturn(relAsesor);
//        when(usuarioXSolicitudRepository.findFirstBySolicitudAndDestinatarioFalse(solicitud)).thenReturn(relTesista);
//
//        // Act
//        RechazoSolicitudCambioAsesorResponseDto result =
//                solicitudService.rechazarSolicitudCambioAsesor(solicitudId, responseText);
//
//        // Assert
//        assertNotNull(result);
//        assertEquals(solicitudId, result.getIdRequest());
//        assertEquals("rejected", result.getStatus());
//        assertEquals(responseText, result.getResponse());
//        assertNotNull(result.getAssignation());
//        assertEquals(tesista.getId(), result.getAssignation().getIdStudent());
//        assertEquals(asesor.getId(), result.getAssignation().getIdAssessor());
//
//        verify(solicitudRepository).save(solicitud);
//    }
//
//    @Test
//    void testAprobarSolicitudCambioAsesor_SuccessfulApproval() {
//        // Arrange
//        Integer solicitudId = 1;
//        String responseText = "Aprobado por el coordinador";
//
//        TipoSolicitud tipoCambioAsesor = new TipoSolicitud();
//        tipoCambioAsesor.setNombre("Cambio Asesor");
//
//        Usuario asesor = new Usuario();
//        asesor.setId(10);
//
//        Usuario tesista = new Usuario();
//        tesista.setId(20);
//
//        Solicitud solicitud = new Solicitud();
//        solicitud.setId(solicitudId);
//        solicitud.setEstado(1); // Pendiente
//        solicitud.setTipoSolicitud(tipoCambioAsesor);
//
//        UsuarioXSolicitud relAsesor = new UsuarioXSolicitud();
//        relAsesor.setUsuario(asesor);
//
//        UsuarioXSolicitud relTesista = new UsuarioXSolicitud();
//        relTesista.setUsuario(tesista);
//
//        when(solicitudRepository.findById(solicitudId)).thenReturn(Optional.of(solicitud));
//        when(usuarioXSolicitudRepository.findFirstBySolicitudAndDestinatarioTrue(solicitud)).thenReturn(relAsesor);
//        when(usuarioXSolicitudRepository.findFirstBySolicitudAndDestinatarioFalse(solicitud)).thenReturn(relTesista);
//
//        // Act
//        AprobarSolicitudCambioAsesorResponseDto result =
//                solicitudService.aprobarSolicitudCambioAsesor(solicitudId, responseText);
//
//        // Assert
//        assertNotNull(result);
//        assertEquals(solicitudId, result.getIdRequest());
//        assertEquals("approved", result.getStatus());
//        assertEquals(responseText, result.getResponse());
//        assertNotNull(result.getAssignation());
//        assertEquals(tesista.getId(), result.getAssignation().getIdStudent());
//        assertEquals(asesor.getId(), result.getAssignation().getIdAssessor());
//
//        verify(solicitudRepository).save(solicitud);
//    }
//}
