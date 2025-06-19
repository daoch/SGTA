package pucp.edu.pe.sgta.service.imp;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.ArrayList;

import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.EventoDto;
import pucp.edu.pe.sgta.dto.TesistaCronDto;
import pucp.edu.pe.sgta.model.Reunion;
import pucp.edu.pe.sgta.model.UsuarioXReunion;
import pucp.edu.pe.sgta.repository.EntregableRepository;
import pucp.edu.pe.sgta.repository.ExposicionRepository;
import pucp.edu.pe.sgta.repository.UsuarioXReunionRepository;
import pucp.edu.pe.sgta.service.inter.EventoService;
import pucp.edu.pe.sgta.util.TipoEventoEnum;

import java.util.Optional;

import pucp.edu.pe.sgta.repository.UsuarioRepository;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.repository.AsesorTesistaRepository;

@Service
public class EventoServiceImpl implements EventoService {

    private final UsuarioXReunionRepository usuarioXReunionRepo;
    private final ExposicionRepository exposicionRepo;
    private final EntregableRepository entregableRepo;
    private final UsuarioRepository usuarioRepository;
    private final AsesorTesistaRepository asesorTesistaRepository;

    public EventoServiceImpl(UsuarioXReunionRepository usuarioXReunionRepo, EntregableRepository entregableRepo, ExposicionRepository exposicionRepo, UsuarioRepository usuarioRepository, AsesorTesistaRepository asesorTesistaRepository) {
        this.usuarioXReunionRepo = usuarioXReunionRepo;
        this.entregableRepo = entregableRepo;
        this.exposicionRepo = exposicionRepo;
        this.usuarioRepository = usuarioRepository;
        this.asesorTesistaRepository = asesorTesistaRepository;
    }

    @Override
    public List<EventoDto> listarEventosXTesista(String id) {
        List<EventoDto> eventos = new ArrayList<>();

        Optional<Usuario> usuario = usuarioRepository.findByIdCognito(id);
        if (usuario.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado con ID Cognito: " + id);
        }

        Usuario user = usuario.get();
        Integer usuarioId = user.getId();

        // 1. Reuniones
        List<UsuarioXReunion> reuniones = usuarioXReunionRepo.findByUsuarioIdAndActivoTrue(usuarioId);
        for (UsuarioXReunion ur : reuniones) {
            Reunion reunion = ur.getReunion();
            if (reunion.getActivo()) {
                EventoDto evento = new EventoDto();
                evento.setId(reunion.getId());
                evento.setNombre(reunion.getTitulo());
                evento.setDescripcion(reunion.getDescripcion());
                evento.setTipo(TipoEventoEnum.REUNION);
                evento.setFechaInicio(reunion.getFechaHoraInicio());
                evento.setFechaFin(reunion.getFechaHoraFin());
                evento.setActivo(true);
                
                eventos.add(evento);
            }
        }

        // 2. Entregables
        List<Object[]> entregables = entregableRepo.listarEntregablesXUsuario(usuarioId);
        for (Object[] obj : entregables) {
            Integer entregableId = (Integer) obj[0];
            String nombre = (String) obj[1];
            String descripcion = (String) obj[2];
            OffsetDateTime fechaInicio = OffsetDateTime.ofInstant((Instant) obj[3], ZoneId.systemDefault());
            OffsetDateTime fechaFin = OffsetDateTime.ofInstant((Instant) obj[4], ZoneId.systemDefault());

            EventoDto evento = new EventoDto();
            evento.setId(entregableId);
            evento.setNombre(nombre);
            evento.setDescripcion(descripcion);
            evento.setTipo(TipoEventoEnum.ENTREGABLE);
            evento.setFechaInicio(fechaInicio);
            evento.setFechaFin(fechaFin);
            evento.setActivo(true);

            eventos.add(evento);
        }

        // 3. Exposiciones (si se relacionan a través de la misma EtapaFormativaXCiclo)
        List<Object[]> exposiciones = exposicionRepo.listarExposicionesXUsuario(usuarioId);
        for (Object[] obj : exposiciones) {
            Integer exposicionId = (Integer) obj[0];
            String nombre = (String) obj[1];
            String descripcion = (String) obj[2];
            OffsetDateTime fechaInicio = OffsetDateTime.ofInstant((Instant) obj[3], ZoneId.systemDefault());
            OffsetDateTime fechaFin = OffsetDateTime.ofInstant((Instant) obj[4], ZoneId.systemDefault());

            EventoDto evento = new EventoDto();
            evento.setId(exposicionId);
            evento.setNombre(nombre);
            evento.setDescripcion(descripcion);
            evento.setTipo(TipoEventoEnum.EXPOSICION);
            evento.setFechaInicio(fechaInicio);
            evento.setFechaFin(fechaFin);
            evento.setActivo(true);

            eventos.add(evento);
        }

        return eventos;
    }

    @Override
    public List<EventoDto> listarEventosXAsesor(String id) {
        List<EventoDto> eventos = new ArrayList<>();

        Optional<Usuario> usuario = usuarioRepository.findByIdCognito(id);
        if (usuario.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado con ID Cognito: " + id);
        }

        Usuario user = usuario.get();
        Integer usuarioId = user.getId();

        // 1. Reuniones
        List<Object[]> reuniones = usuarioXReunionRepo.listarReunionesXAsesor(usuarioId);
        for (Object[] obj : reuniones) {
            Integer reunionId = (Integer) obj[0];
            String nombre = (String) obj[1];
            String descripcion = (String) obj[2];
            OffsetDateTime fechaInicio = OffsetDateTime.ofInstant((Instant) obj[3], ZoneId.systemDefault());
            OffsetDateTime fechaFin = OffsetDateTime.ofInstant((Instant) obj[4], ZoneId.systemDefault());

            EventoDto evento = new EventoDto();
            evento.setId(reunionId);
            evento.setNombre(nombre);
            evento.setDescripcion(descripcion);
            evento.setTipo(TipoEventoEnum.REUNION);
            evento.setFechaInicio(fechaInicio);
            evento.setFechaFin(fechaFin);
            evento.setActivo(true);
            
            // Obtener tesistas relacionados a la reunión
            List<Object[]> tesistas = usuarioXReunionRepo.listarTesistasXReunion(reunionId);
            for (Object[] tes : tesistas) {
                Integer tesistaId = (Integer) tes[0];
                String nombreCompleto = (String) tes[1];
                String temaTesis = (String) tes[2];

                TesistaCronDto tesistaDto = new TesistaCronDto();
                tesistaDto.setId(tesistaId);
                tesistaDto.setNombreCompleto(nombreCompleto);
                tesistaDto.setTemaTesis(temaTesis);
                evento.getTesistas().add(tesistaDto);
            }
            eventos.add(evento);
        }

        // 2. Entregables
        List<Object[]> entregables = entregableRepo.listarEntregablesXUsuario(usuarioId);
        for (Object[] obj : entregables) {
            Integer entregableId = (Integer) obj[0];
            String nombre = (String) obj[1];
            String descripcion = (String) obj[2];
            OffsetDateTime fechaInicio = OffsetDateTime.ofInstant((Instant) obj[3], ZoneId.systemDefault());
            OffsetDateTime fechaFin = OffsetDateTime.ofInstant((Instant) obj[4], ZoneId.systemDefault());

            EventoDto evento = new EventoDto();
            evento.setId(entregableId);
            evento.setNombre(nombre);
            evento.setDescripcion(descripcion);
            evento.setTipo(TipoEventoEnum.ENTREGABLE);
            evento.setFechaInicio(fechaInicio);
            evento.setFechaFin(fechaFin);
            evento.setActivo(true);

            // Obtener tesistas relacionados al entregable
            List<Object[]> tesistas = asesorTesistaRepository.listarTesistasXAsesor(usuarioId);
            for (Object[] tes : tesistas) {
                Integer tesistaId = (Integer) tes[0];
                String nombreCompleto = (String) tes[1];
                String temaTesis = (String) tes[2];

                TesistaCronDto tesistaDto = new TesistaCronDto();
                tesistaDto.setId(tesistaId);
                tesistaDto.setNombreCompleto(nombreCompleto);
                tesistaDto.setTemaTesis(temaTesis);
                evento.getTesistas().add(tesistaDto);
            }

            eventos.add(evento);
        }

        // 3. Exposiciones
        List<Object[]> exposiciones = exposicionRepo.listarExposicionesXUsuario(usuarioId);
        for (Object[] obj : exposiciones) {
            Integer exposicionId = (Integer) obj[0];
            String nombre = (String) obj[1];
            String descripcion = (String) obj[2];
            OffsetDateTime fechaInicio = OffsetDateTime.ofInstant((Instant) obj[3], ZoneId.systemDefault());
            OffsetDateTime fechaFin = OffsetDateTime.ofInstant((Instant) obj[4], ZoneId.systemDefault());
            Integer bheId = (Integer) obj[5];

            EventoDto evento = new EventoDto();
            evento.setId(exposicionId);
            evento.setNombre(nombre);
            evento.setDescripcion(descripcion);
            evento.setTipo(TipoEventoEnum.EXPOSICION);
            evento.setFechaInicio(fechaInicio);
            evento.setFechaFin(fechaFin);
            evento.setActivo(true);

            // Obtener tesistas relacionados a la exposición
            List<Object[]> tesistas = exposicionRepo.listarTesistasXExposicion(bheId);
            for (Object[] tes : tesistas) {
                Integer tesistaId = (Integer) tes[0];
                String nombreCompleto = (String) tes[1];
                String temaTesis = (String) tes[2];

                TesistaCronDto tesistaDto = new TesistaCronDto();
                tesistaDto.setId(tesistaId);
                tesistaDto.setNombreCompleto(nombreCompleto);
                tesistaDto.setTemaTesis(temaTesis);
                evento.getTesistas().add(tesistaDto);
            }

            eventos.add(evento);
        }

        return eventos;
    }
}
