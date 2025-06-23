package pucp.edu.pe.sgta.service.imp;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.services.gmail.Gmail;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.*;
import pucp.edu.pe.sgta.mapper.BloqueHorarioExposicionMapper;
import pucp.edu.pe.sgta.model.BloqueHorarioExposicion;
import pucp.edu.pe.sgta.repository.BloqueHorarioExposicionRepository;
import pucp.edu.pe.sgta.repository.ControlExposicionUsuarioTemaRepository;
import pucp.edu.pe.sgta.service.inter.BloqueHorarioExposicionService;
import pucp.edu.pe.sgta.service.inter.GoogleService.GoogleCalendarService;
import pucp.edu.pe.sgta.service.inter.GoogleService.GoogleGmailService;

@Service
public class BloqueHorarioExposicionServiceImpl implements BloqueHorarioExposicionService {

    private final BloqueHorarioExposicionRepository bloqueHorarioExposicionRepository;

    private final HttpServletRequest request;

    private final ControlExposicionUsuarioTemaRepository controlExposicionUsuarioTemaRepository;

    private final GoogleCalendarService googleCalendarService;

    private final GoogleGmailService googleGmailService;

    public BloqueHorarioExposicionServiceImpl(BloqueHorarioExposicionRepository bloqueHorarioExposicionRepository, ControlExposicionUsuarioTemaRepository controlExposicionUsuarioTemaRepository,
                                              GoogleCalendarService googleCalendarService, GoogleGmailService googleGmailService, HttpServletRequest request) {
        this.bloqueHorarioExposicionRepository = bloqueHorarioExposicionRepository;
        this.controlExposicionUsuarioTemaRepository = controlExposicionUsuarioTemaRepository;
        this.googleCalendarService = googleCalendarService;
        this.googleGmailService = googleGmailService;
        this.request = request;
    }

    @Override
    public List<BloqueHorarioExposicionDto> getAll() {
        return List.of();
    }

    @Override
    public BloqueHorarioExposicionDto findById(Integer id) {
        BloqueHorarioExposicion bloqueHorarioExposicion = bloqueHorarioExposicionRepository.findById(id).orElse(null);
        if (bloqueHorarioExposicion != null) {
            return BloqueHorarioExposicionMapper.toDTO(bloqueHorarioExposicion);
        }
        return null;
    }

    @Override
    public BloqueHorarioExposicionDto create(BloqueHorarioExposicionCreateDTO dto) {
        BloqueHorarioExposicion bloqueHorarioExposicion = bloqueHorarioExposicionRepository
                .save(BloqueHorarioExposicionMapper.toEntity(dto));
        return BloqueHorarioExposicionMapper.toDTO(bloqueHorarioExposicion);
    }

    @Override
    public void update(BloqueHorarioExposicionDto dto) {

    }

    @Override
    public void delete(Integer id) {

    }

    @Override
    public List<ListBloqueHorarioExposicionSimpleDTO> listarBloquesHorarioPorExposicion(Integer exposicionId) {
        //List<Object[]> results = bloqueHorarioExposicionRepository.listarBloquesHorarioPorExposicion(exposicionId);
        List<Object[]> results = bloqueHorarioExposicionRepository.listarBloquesHorarioPorExposicionConUsuariosYRespuesta(exposicionId);

        // Asi deberia ser :V
        // return results.stream().map(row -> new ListBloqueHorarioExposicionDTO(
        // (Integer) row[0],
        // (Integer) row[1],
        // (Integer) row[2],
        // (Boolean) row[3],
        // (Boolean) row[4],
        // OffsetDateTime.ofInstant((Instant) row[5], ZoneId.systemDefault()),
        // OffsetDateTime.ofInstant((Instant) row[6], ZoneId.systemDefault()),
        // (String) row[7]
        // )).collect(Collectors.toList());

        // solucion temporal
        DateTimeFormatter fechaFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        DateTimeFormatter horaFormatter = DateTimeFormatter.ofPattern("HH:mm");

        /*return results.stream().map(row -> {
            OffsetDateTime inicio = OffsetDateTime.ofInstant((Instant) row[5], ZoneId.systemDefault());
            OffsetDateTime fin = OffsetDateTime.ofInstant((Instant) row[6], ZoneId.systemDefault());

            String key = inicio.format(fechaFormatter) + "|" + inicio.format(horaFormatter) + "|" + row[7];
            String range = inicio.format(horaFormatter) + " - " + fin.format(horaFormatter);
            Integer idBloque = (Integer) row[0];
            Integer idJornadaExposicionSala = (Integer) row[1];
            Boolean esBloqueReservado = (Boolean) row[3];
            Boolean esBloqueBloqueado = (Boolean) row[4];

            TemaConAsesorJuradoDTO temaConAsesorJuradoDTO = null;
            if ((Integer) row[8] != null) {
                temaConAsesorJuradoDTO = new TemaConAsesorJuradoDTO();
                temaConAsesorJuradoDTO.setId((Integer) row[8]);
                temaConAsesorJuradoDTO.setCodigo((String) row[9]);
                temaConAsesorJuradoDTO.setTitulo((String) row[10]);
                temaConAsesorJuradoDTO.setUsuarios(new ArrayList<UsarioRolDto>());
            }

            return new ListBloqueHorarioExposicionSimpleDTO(key, range, idBloque, idJornadaExposicionSala, exposicionId,
                    temaConAsesorJuradoDTO, esBloqueReservado, esBloqueBloqueado, temaConAsesorJuradoDTO, false);
        }).collect(Collectors.toList());*/

        Map<Integer, List<Object[]>> bloquesAgrupados = results.stream()
                .collect(Collectors.groupingBy(row -> (Integer) row[0])); // Agrupar por idBloque

        List<ListBloqueHorarioExposicionSimpleDTO> listaFinal = new ArrayList<>();

        for (Map.Entry<Integer, List<Object[]>> entry : bloquesAgrupados.entrySet()) {
            List<Object[]> filasBloque = entry.getValue();
            Object[] rowEjemplo = filasBloque.get(0); // todas las filas comparten info base del bloque

            OffsetDateTime inicio = OffsetDateTime.ofInstant((Instant) rowEjemplo[5], ZoneId.systemDefault());
            OffsetDateTime fin = OffsetDateTime.ofInstant((Instant) rowEjemplo[6], ZoneId.systemDefault());

            String fecha = inicio.format(fechaFormatter);
            String hora = inicio.format(horaFormatter) + " - " + fin.format(horaFormatter);

            // Armar lista de usuarios vinculados a ese bloque
            List<UsarioRolDto> usuarios = filasBloque.stream()
                    .filter(row -> row[11] != null) // aseguramos que usuario_id exista
                    .filter(row -> !"Revisor".equalsIgnoreCase((String) row[15])) // ignorar usuarios con rol Revisor
                    .map(row -> new UsarioRolDto(
                            ((Number) row[11]).intValue(),               // idPersona
                            (String) row[12],                             // nombres
                            (String) row[13],                             // apellidos
                            row[14] != null ? ((Number) row[14]).intValue() : null, // rolId
                            (String) row[15],                             // rolNombre
                            (String) row[16]                              // estadoRespuesta
                    ))
                    .distinct()
                    .toList();

            TemaConAsesorJuradoDTO tema = null;
            if (rowEjemplo[8] != null) { // Validamos que el tema_id exista
                tema = new TemaConAsesorJuradoDTO();
                tema.setId(((Number) rowEjemplo[8]).intValue());
                tema.setCodigo((String) rowEjemplo[9]);
                tema.setTitulo((String) rowEjemplo[10]);
                tema.setUsuarios(usuarios);
            } else {
                // En caso no haya tema, puedes asignar usuarios vacíos o null
                //tema = new TemaConAsesorJuradoDTO();
                //tema.setUsuarios(Collections.emptyList());
            }

            ListBloqueHorarioExposicionSimpleDTO dto = new ListBloqueHorarioExposicionSimpleDTO();


            dto.setIdBloque( ((Number) rowEjemplo[0]).intValue());
            dto.setIdJornadaExposicionSala( (Integer) rowEjemplo[1]);
            dto.setEsBloqueReservado((Boolean) rowEjemplo[3]);
            dto.setEsBloqueBloqueado((Boolean) rowEjemplo[4]);
            String key = inicio.format(fechaFormatter) + "|" + inicio.format(horaFormatter) + "|" + (String) rowEjemplo[7];
            String range = inicio.format(horaFormatter) + " - " + fin.format(horaFormatter);
            dto.setKey(key);
            dto.setRange(range);
            dto.setExpo(tema);
            dto.setAnteriorExpo(tema);
            dto.setCambiado(false);

            listaFinal.add(dto);
        }

        return listaFinal;
    }

    @Transactional
    @Override
    public boolean updateBloquesListFirstTime(List<ListBloqueHorarioExposicionSimpleDTO> bloquesList) {

        try {
            List<ListBloqueHorarioExposicionSimpleDTO> filtered = bloquesList.stream()
                    .filter(b -> b.getExpo() != null)
                    .collect(Collectors.toList());

            ObjectMapper mapper = new ObjectMapper();
            String jsonString = mapper.writeValueAsString(filtered);

            bloqueHorarioExposicionRepository.actualizarMasivo(jsonString);

            return true;
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return false;
        }
    }

    @Transactional
    @Override
    public boolean updateBlouqesListNextPhase(List<ListBloqueHorarioExposicionSimpleDTO> bloquesList) {
        /*
        try {

            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            String jsonString = mapper.writeValueAsString(bloquesList);

            bloqueHorarioExposicionRepository.updateBloquesExposicionNextPhase(jsonString);

            System.out.println(bloquesList);
            int i  = 0;
            List<ListBloqueHorarioExposicionSimpleDTO> bloquesCambiado = new ArrayList<>();
            System.out.println("==================================================================");
            for (ListBloqueHorarioExposicionSimpleDTO dto : bloquesList) {
                var expo = dto.getExpo();
                var anteriorExpo = dto.getAnteriorExpo();

                if (
                        expo != null && anteriorExpo == null || expo != null && !expo.getCodigo().equals(anteriorExpo.getCodigo()) || expo == null && anteriorExpo != null
                ){
                    bloquesCambiado.add(dto);
                    System.out.println("BLOQUE : " + dto.getKey());
                    if(expo!=null){
                        System.out.println("TEMA : " + expo.getCodigo());
                    }
                    else{
                        System.out.println("ACTUAL : NULL" );
                    }

                    if(anteriorExpo!=null)
                        System.out.println("ANTERIOR : " + anteriorExpo.getCodigo());
                    else
                        System.out.println("ANTERIOR : NULL" );
                }
            }


            System.out.println("==================================================================");
            String jsonString2 = mapper.writeValueAsString(bloquesCambiado);
            String resultado = bloqueHorarioExposicionRepository.updateBloquesCambidos(jsonString2);

            System.out.println("==================================================================");
            System.out.println("Resultado de la función: " + resultado);


            return true;
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return false;
        }*/
        HttpSession session = request.getSession(false);
        if (session == null) throw new RuntimeException("No hay sesión activa");

        String accessToken = (String) session.getAttribute("googleAccessToken");
        if (accessToken == null) throw new RuntimeException("No hay access token en sesión");

        try {            // === CONFIGURACIÓN DE CORREO ===


            // 1. Construir cliente Gmail
            Gmail gmail = googleGmailService.buildGmailClient(accessToken);

            // 2. Datos del correo
            String destinatario = "a20191810@pucp.edu.pe";
            String asunto = "SGTA - Prueba de correo automático";
            String cuerpoHtml = """
            <h2>Invitación a reunión 📅</h2>
            <p>Has sido invitado a esta reunión.</p>
            <p>Por favor, confirma tu asistencia:</p>
        
            <div style="margin-top: 20px;">
                <a href="https://sgta.pucp.edu.pe/reunion/aceptar" style="
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-right: 10px;
                    display: inline-block;
                ">Sí</a>
        
                <a href="https://sgta.pucp.edu.pe/reunion/rechazar" style="
                    padding: 10px 20px;
                    background-color: #f44336;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    display: inline-block;
                ">No</a>
            </div>
        """;


            // 3. Enviar correo
            googleGmailService.sendEmail(gmail, destinatario, asunto, cuerpoHtml);

            System.out.println("Correo enviado correctamente.");
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }


        return true;


    }

    @Transactional
    @Override
    public boolean finishPlanning(Integer exposicionId) {

        try {
            //Boolean result = bloqueHorarioExposicionRepository.finishPlanning(exposicionId);
            GoogleCalendarEvent event = new GoogleCalendarEvent();

            event.setSummary("HOLA CESAR");
            event.setDescription("PRUEBA");
            // Crear OffsetDateTime del 25 de junio 2025
            OffsetDateTime start = OffsetDateTime.of(2025, 6, 24, 16, 0, 0, 0, ZoneOffset.of("-05:00"));

            OffsetDateTime end = OffsetDateTime.of(2025, 6, 24, 17, 0, 0, 0, ZoneOffset.of("-05:00"));
            event.setStartDateTime(start);
            event.setEndDateTime(end);
            event.setAttendess(new ArrayList<>());
            String correo = "a20191810@pucp.edu.pe";
            event.getAttendess().add(correo);

            googleCalendarService.createEvent(event);
            return true;
            //return Boolean.TRUE.equals(result);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    @Transactional
    public Integer createAll(List<BloqueHorarioExposicionCreateDTO> dtos) {
        List<BloqueHorarioExposicion> entities = dtos.stream()
                .map(BloqueHorarioExposicionMapper::toEntity)
                .collect(Collectors.toList());

        List<BloqueHorarioExposicion> saved = bloqueHorarioExposicionRepository.saveAll(entities);

        return saved.size();
    }

    @Override

    public int bloquearBloque(int idBloque) {
        BloqueHorarioExposicion bloqueHorarioExposicion = bloqueHorarioExposicionRepository.findById(idBloque)
                .orElse(null);
        if (bloqueHorarioExposicion != null) {
            bloqueHorarioExposicion.setEsBloqueBloqueado(true);
            bloqueHorarioExposicionRepository.save(bloqueHorarioExposicion);
            return 1;
        }
        return 0;
    }

    @Override
    public int desbloquearBloque(int idBloque) {
        BloqueHorarioExposicion bloqueHorarioExposicion = bloqueHorarioExposicionRepository.findById(idBloque)
                .orElse(null);
        if (bloqueHorarioExposicion != null) {
            bloqueHorarioExposicion.setEsBloqueBloqueado(false);
            bloqueHorarioExposicionRepository.save(bloqueHorarioExposicion);
            return 1;
        }
        return 0;
    }

    public List<ListBloqueHorarioExposicionSimpleDTO> asignarTemasBloques(List<AsignacionBloqueDTO> listaBloquesTemas,
            DistribucionRequestDTO request) {
        List<ListBloqueHorarioExposicionSimpleDTO> bloques = request.getBloques();
        List<TemaConAsesorJuradoDTO> temas = request.getTemas();
        List<ListBloqueHorarioExposicionSimpleDTO> nuevaLista = new ArrayList<>();

        for (AsignacionBloqueDTO asig : listaBloquesTemas) {
            ListBloqueHorarioExposicionSimpleDTO bloqueElegido = bloques.stream()
                    .filter(b -> b.getIdBloque() == asig.getIdBloque())
                    .findFirst()
                    .orElse(null);

            if (bloqueElegido == null)
                continue;
            TemaConAsesorJuradoDTO temaElegido = temas.stream()
                    .filter(t -> t.getId() == asig.getTema())
                    .findFirst()
                    .orElse(null);

            if (temaElegido == null)
                continue;
            bloqueElegido.setExpo(temaElegido);
        }

        return bloques;
    }

    @Override
    public boolean verificarSalaOcupada(Integer salaId, OffsetDateTime fechaHoraInicio, OffsetDateTime fechaHoraFin) {
        return bloqueHorarioExposicionRepository.verificarSalaOcupada(salaId, fechaHoraInicio, fechaHoraFin);
    }
}
