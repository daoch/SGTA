package pucp.edu.pe.sgta.service.imp;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.ExposicionDto;
import pucp.edu.pe.sgta.dto.ExposicionEstudianteDTO;
import pucp.edu.pe.sgta.dto.ExposicionNombreDTO;
import pucp.edu.pe.sgta.dto.ExposicionSinInicializarDTO;
import pucp.edu.pe.sgta.dto.ListExposicionXCoordinadorDTO;
import pucp.edu.pe.sgta.dto.exposiciones.MiembroExposicionDto;
import pucp.edu.pe.sgta.mapper.ExposicionMapper;
import pucp.edu.pe.sgta.model.EstadoPlanificacion;
import pucp.edu.pe.sgta.model.EtapaFormativaXCiclo;
import pucp.edu.pe.sgta.model.Exposicion;
import pucp.edu.pe.sgta.model.UsuarioXTema;
import pucp.edu.pe.sgta.repository.ExposicionRepository;
import pucp.edu.pe.sgta.repository.UsuarioXTemaRepository;
import pucp.edu.pe.sgta.service.inter.ExposicionService;

import java.util.ArrayList;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExposicionServiceImpl implements ExposicionService {
    private final ExposicionRepository exposicionRepository;
    private final UsuarioXTemaRepository usuarioXTemaRepository;

    public ExposicionServiceImpl(ExposicionRepository exposicionRepository,
            UsuarioXTemaRepository usuarioXTemaRepository) {
        this.exposicionRepository = exposicionRepository;
        this.usuarioXTemaRepository = usuarioXTemaRepository;
    }

    @Override
    public List<ExposicionDto> listarExposicionesXEtapaFormativaXCiclo(Integer etapaFormativaXCicloId) {

        List<Object[]> resultados = exposicionRepository
                .listarExposicionesXEtapaFormativaXCiclo(etapaFormativaXCicloId);
        return resultados.stream()
                .map(resultado -> new ExposicionDto(
                        ((Number) resultado[0]).intValue(), // id
                        ((Number) resultado[1]).intValue(), // id etapa formativa x ciclo
                        (String) resultado[2], // nombre
                        (String) resultado[3], // descripcion
                        ((Number) resultado[4]).intValue() // id estado planificacion
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<ExposicionDto> getAll() {
        List<Exposicion> exposiciones = exposicionRepository.findAll();
        return exposiciones.stream().map(ExposicionMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public ExposicionDto findById(Integer id) {
        return exposicionRepository.findById(id)
                .map(ExposicionMapper::toDto)
                .orElse(null);
    }

    @Transactional
    @Override
    public Integer create(Integer etapaFormativaXCicloId, ExposicionDto dto) {
        dto.setId(null);
        Exposicion exposicion = ExposicionMapper.toEntity(dto);
        EtapaFormativaXCiclo efc = new EtapaFormativaXCiclo();
        efc.setId(etapaFormativaXCicloId);
        exposicion.setEtapaFormativaXCiclo(efc);
        exposicion.setFechaCreacion(OffsetDateTime.now());

        exposicionRepository.save(exposicion);
        return exposicion.getId();
    }

    @Transactional
    @Override
    public void update(ExposicionDto dto) {
        Exposicion exposicionToUpdate = exposicionRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Exposicion no encontrada con ID: " + dto.getId()));

        exposicionToUpdate.setNombre(dto.getNombre());

        EstadoPlanificacion estadoPlanificacion = new EstadoPlanificacion();
        estadoPlanificacion.setId(dto.getEstadoPlanificacionId());
        exposicionToUpdate.setEstadoPlanificacion(estadoPlanificacion);

        exposicionToUpdate.setDescripcion(dto.getDescripcion());
        exposicionToUpdate.setFechaModificacion(OffsetDateTime.now());
        exposicionRepository.save(exposicionToUpdate);
    }

    @Override
    public void delete(Integer id) {
        Exposicion exposicionToDelete = exposicionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exposicion no encontrada con ID: " + id));

        exposicionToDelete.setActivo(false);
        exposicionToDelete.setFechaModificacion(OffsetDateTime.now());
        exposicionRepository.save(exposicionToDelete);
    }

    @Override
    public List<ExposicionNombreDTO> listarExposicionXCicloActualEtapaFormativa(Integer etapaFormativaId) {
        List<Object[]> expos = exposicionRepository.listarExposicionXCicloActualEtapaFormativa(etapaFormativaId);

        List<ExposicionNombreDTO> expoList = new ArrayList<>();

        for (Object[] obj : expos) {
            ExposicionNombreDTO dto = new ExposicionNombreDTO();
            dto.setId((Integer) obj[0]);
            dto.setNombre((String) obj[1]);
            expoList.add(dto);
        }

        return expoList;
    }

    @Override
    public List<ListExposicionXCoordinadorDTO> listarExposicionesInicializadasXCoordinador(Integer coordinadorId) {
        List<Object[]> resultados = exposicionRepository.listarExposicionesInicializadasXCoordinador(coordinadorId);
        return resultados.stream()
                .map(resultado -> new ListExposicionXCoordinadorDTO(
                        ((Number) resultado[0]).intValue(), // exposicionId
                        (String) resultado[1], // nombre
                        (String) resultado[2], // descripcion
                        ((Number) resultado[3]).intValue(), // etapaFormativaId
                        (String) resultado[4], // etapaFormativaNombre
                        ((Number) resultado[5]).intValue(), // cicloId
                        (String) resultado[6], // cicloNombre
                        ((Number) resultado[7]).intValue(), // estadoPlanificacionId
                        (String) resultado[8] // estadoPlanificacionNombre
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<ExposicionSinInicializarDTO> listarExposicionesSinInicializarByEtapaFormativaEnCicloActual(
            Integer etapaFormativaId) {
        List<Object[]> expos = exposicionRepository
                .listarExposicionesSinInicializarByEtapaFormativaEnCicloActual(etapaFormativaId);

        List<ExposicionSinInicializarDTO> expoList = new ArrayList<>();

        for (Object[] obj : expos) {
            ExposicionSinInicializarDTO dto = new ExposicionSinInicializarDTO();
            dto.setExposicionId((Integer) obj[0]);
            dto.setNombre((String) obj[1]);
            dto.setInicializada((Boolean) obj[2]);
            expoList.add(dto);
        }

        return expoList;
    }

    @Override
    public List<ExposicionEstudianteDTO> findExposicionesEstudianteById(Integer usuarioId) {
        List<Object[]> exposiciones = exposicionRepository.obtener_exposiciones_por_usuario(usuarioId);
        List<ExposicionEstudianteDTO> exposicionesEstudiante = new ArrayList<>();

        for (Object[] obj : exposiciones) {
            ExposicionEstudianteDTO dto = new ExposicionEstudianteDTO();
            dto.setExposicionId((Integer) obj[0]);
            dto.setTemaId((Integer) obj[1]);
            dto.setEstado((String) obj[2]);
            dto.setLinkExposicion((String) obj[3]);
            dto.setLinkGrabacion((String) obj[4]);

            Instant instantInicio = (Instant) obj[5];
            OffsetDateTime datetimeInicio = instantInicio.atOffset(ZoneOffset.UTC);

            Instant instantFin = (Instant) obj[6];
            OffsetDateTime datetimeFin = instantFin.atOffset(ZoneOffset.UTC);

            dto.setDatetimeInicio(datetimeInicio);
            dto.setDatetimeFin(datetimeFin);

            dto.setSala((String) obj[7]);
            dto.setTitulo((String) obj[8]);
            dto.setEtapaFormativa((String) obj[9]);
            dto.setCiclo((String) obj[10]);
            dto.setTipoExposicion((String) obj[11]);
            dto.setEstudianteId(usuarioId);

            List<UsuarioXTema> usuarioTemas = usuarioXTemaRepository.findByTemaIdAndActivoTrue(dto.getTemaId());
            List<MiembroExposicionDto> miembros = usuarioTemas.stream()
                    .filter(ut -> !ut.getRol().getNombre().equals("Tesista")).map(ut -> {
                        MiembroExposicionDto miembro = new MiembroExposicionDto();
                        miembro.setId_persona(ut.getUsuario().getId());
                        miembro.setNombre(ut.getUsuario().getNombres() + " " + ut.getUsuario().getPrimerApellido());
                        miembro.setTipo(ut.getRol().getNombre());
                        return miembro;
                    }).toList();
            dto.setMiembrosJurado(miembros);
            exposicionesEstudiante.add(dto);
        }

        return exposicionesEstudiante;
    }
}
