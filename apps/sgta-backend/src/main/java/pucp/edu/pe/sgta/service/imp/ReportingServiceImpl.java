package pucp.edu.pe.sgta.service.imp;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;
import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.*;
import pucp.edu.pe.sgta.model.UsuarioXTema;
import pucp.edu.pe.sgta.repository.*;
import pucp.edu.pe.sgta.service.inter.CriterioEntregableService;    // ← IMPORT añadido
import pucp.edu.pe.sgta.service.inter.IReportService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;

import java.util.NoSuchElementException;


import pucp.edu.pe.sgta.repository.UsuarioRepository;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.mapper.UsuarioMapper;

import org.springframework.beans.factory.annotation.Autowired;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class ReportingServiceImpl implements IReportService {

    private static final Logger logger = LoggerFactory.getLogger(ReportingServiceImpl.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final UsuarioService usuarioService;
    private final TopicAreaStatsRepository topicAreaStatsRepository;
    private final AdvisorDistributionRepository advisorDistributionRepository;
    private final JurorDistributionRepository jurorDistributionRepository;
    private final AdvisorPerformanceRepository advisorPerformanceRepository;
    private final TesistasPorAsesorRepository tesistasPorAsesorRepository;
    private final DetalleTesistaRepository detalleTesistaRepository;
    private final HitoCronogramaRepository hitoCronogramaRepository;
    private final HistorialReunionRepository historialReunionRepository;
    private final UsuarioXTemaRepository usuarioXTemaRepository;
    private final EntregableXTemaRepository entregableXTemaRepository;
    private final RevisionCriterioEntregableRepository revisionCriterioEntregableRepository;
    private final CriterioEntregableService criterioEntregableService;
    private final EntregablesCriteriosRepository entregablesCriteriosRepository;

    public ReportingServiceImpl(
            UsuarioService usuarioService,
            TopicAreaStatsRepository topicAreaStatsRepository,
            AdvisorDistributionRepository advisorDistributionRepository,
            JurorDistributionRepository jurorDistributionRepository,
            AdvisorPerformanceRepository advisorPerformanceRepository,
            TesistasPorAsesorRepository tesistasPorAsesorRepository,
            DetalleTesistaRepository detalleTesistaRepository,
            HitoCronogramaRepository hitoCronogramaRepository,
            HistorialReunionRepository historialReunionRepository,
            UsuarioXTemaRepository usuarioXTemaRepository,
            EntregableXTemaRepository entregableXTemaRepository,
            RevisionCriterioEntregableRepository revisionCriterioEntregableRepository,
            CriterioEntregableService criterioEntregableService,
            EntregablesCriteriosRepository entregablesCriteriosRepository) {
        this.usuarioService                    = usuarioService;
        this.topicAreaStatsRepository          = topicAreaStatsRepository;
        this.advisorDistributionRepository     = advisorDistributionRepository;
        this.jurorDistributionRepository       = jurorDistributionRepository;
        this.advisorPerformanceRepository      = advisorPerformanceRepository;
        this.tesistasPorAsesorRepository       = tesistasPorAsesorRepository;
        this.detalleTesistaRepository          = detalleTesistaRepository;
        this.hitoCronogramaRepository          = hitoCronogramaRepository;
        this.historialReunionRepository        = historialReunionRepository;
        this.usuarioXTemaRepository            = usuarioXTemaRepository;
        this.entregableXTemaRepository         = entregableXTemaRepository;
        this.revisionCriterioEntregableRepository = revisionCriterioEntregableRepository;
        this.criterioEntregableService         = criterioEntregableService;
        this.entregablesCriteriosRepository    = entregablesCriteriosRepository;
    }

    @Override
    public List<TopicAreaStatsDTO> getTopicAreaStatistics(String cognitoSub, String cicloNombre) {
        Integer usuarioId = usuarioService.findByCognitoId(cognitoSub).getId();
        List<Object[]> results = topicAreaStatsRepository
                .getTopicAreaStatsByUserAndCiclo(usuarioId, cicloNombre);
        return results.stream()
                .map(r -> new TopicAreaStatsDTO((String) r[0], ((Number) r[1]).intValue()))
                .collect(Collectors.toList());
    }

    @Override
    public List<TopicTrendDTO> getTopicTrendsByYear(String cognitoSub) {
        Integer usuarioId = usuarioService.findByCognitoId(cognitoSub).getId();
        List<Object[]> results = topicAreaStatsRepository.getTopicTrendsByUser(usuarioId);
        return results.stream()
                .map(r -> new TopicTrendDTO((String) r[0], ((Number) r[1]).intValue(), ((Number) r[2]).intValue()))
                .collect(Collectors.toList());
    }

    @Override
    public List<TeacherCountDTO> getAdvisorDistribution(String cognitoSub, String cicloNombre) {
        Integer usuarioId = usuarioService.findByCognitoId(cognitoSub).getId();
        List<Object[]> rows = advisorDistributionRepository
                .getAdvisorDistributionByCoordinatorAndCiclo(usuarioId, cicloNombre);
        return rows.stream()
                .map(r -> new TeacherCountDTO((String) r[0], (String) r[1], ((Number) r[2]).intValue()))
                .collect(Collectors.toList());
    }

    @Override
    public List<TeacherCountDTO> getJurorDistribution(String cognitoSub, String cicloNombre) {
        Integer usuarioId = usuarioService.findByCognitoId(cognitoSub).getId();
        List<Object[]> rows = jurorDistributionRepository
                .getJurorDistributionByCoordinatorAndCiclo(usuarioId, cicloNombre);
        return rows.stream()
                .map(r -> new TeacherCountDTO((String) r[0], (String) r[1], ((Number) r[2]).intValue()))
                .collect(Collectors.toList());
    }

    @Override
    public List<AreaFinalDTO> getAreaFinal(String cognitoSub, String cicloNombre) {
        var advisors = getAdvisorDistribution(cognitoSub, cicloNombre);
        var jurors   = getJurorDistribution(cognitoSub, cicloNombre);
        Map<String, AreaFinalDTO.AreaFinalDTOBuilder> map = new HashMap<>();
        processTeachers(advisors, map, true);
        processTeachers(jurors,   map, false);
        return map.values().stream()
                .map(b -> {
                    AreaFinalDTO d = b.build();
                    d.setTotalCount(d.getAdvisorCount() + d.getJurorCount());
                    return d;
                })
                .sorted(Comparator.comparing(AreaFinalDTO::getAreaName)
                        .thenComparing(AreaFinalDTO::getTeacherName))
                .collect(Collectors.toList());
    }

    private void processTeachers(List<TeacherCountDTO> list,
                                 Map<String, AreaFinalDTO.AreaFinalDTOBuilder> map,
                                 boolean isAdvisor) {
        for (var t : list) {
            String name = t.getTeacherName(),
                    area = t.getAreaName(),
                    key  = name + "|" + area;
            map.computeIfAbsent(key, k -> AreaFinalDTO.builder()
                    .teacherName(name)
                    .areaName(area)
                    .advisorCount(0)
                    .jurorCount(0)
                    .totalCount(0));
            var b = map.get(key);
            if (isAdvisor) b.advisorCount(t.getCount());
            else           b.jurorCount(t.getCount());
        }
    }

    @Override
    public List<AdvisorPerformanceDto> getAdvisorPerformance(String cognitoSub, String cicloNombre) {
        Integer usuarioId = usuarioService.findByCognitoId(cognitoSub).getId();
        List<Object[]> results = advisorPerformanceRepository
                .getAdvisorPerformanceByUser(usuarioId, cicloNombre);
        return results.stream()
                .map(r -> new AdvisorPerformanceDto(
                        (String) r[0], (String) r[1],
                        Optional.ofNullable((Number) r[2]).map(Number::doubleValue).orElse(0.0),
                        ((Number) r[3]).intValue()))
                .collect(Collectors.toList());
    }

    @Override
    public List<TesistasPorAsesorDTO> getTesistasPorAsesor(String cognitoSub) {
        Integer asesorId = usuarioService.findByCognitoId(cognitoSub).getId();
        List<Object[]> results = tesistasPorAsesorRepository
                .getTesistasPorAsesor(asesorId);
        return results.stream()
                .map(r -> TesistasPorAsesorDTO.builder()
                        .temaId((Integer) r[0])
                        .tesistaId((Integer) r[1])
                        .nombres((String) r[2])
                        .primerApellido((String) r[3])
                        .segundoApellido((String) r[4])
                        .correoElectronico((String) r[5])
                        .tituloTema((String) r[6])
                        .etapaFormativaNombre((String) r[7])
                        .carrera((String) r[8])
                        .entregableActualId((Integer) r[9])
                        .entregableActualNombre((String) r[10])
                        .entregableActualDescripcion((String) r[11])
                        .entregableActualFechaInicio(
                                r[12] != null
                                        ? ((Timestamp) r[12]).toLocalDateTime()
                                        .atZone(ZoneId.systemDefault())
                                        : null)
                        .entregableActualFechaFin(
                                r[13] != null
                                        ? ((Timestamp) r[13]).toLocalDateTime()
                                        .atZone(ZoneId.systemDefault())
                                        : null)
                        .entregableActualEstado((String) r[14])
                        .entregableEnvioEstado((String) r[15])
                        .entregableEnvioFecha(
                                r[16] != null
                                        ? new Date(((Timestamp) r[16]).getTime())
                                        : null)
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public DetalleTesistaDTO getDetalleTesista(Integer tesistaId) {
        if (tesistaId == null) {
            throw new IllegalArgumentException("El ID del tesista es requerido");
        }

        List<Object[]> results = detalleTesistaRepository.getDetalleTesista(tesistaId);
        if (results.isEmpty()) {
            return null;
        }

        Object[] result = results.get(0);
        return DetalleTesistaDTO.builder()
                .tesistaId((Integer) result[0])
                .nombres((String) result[1])
                .primerApellido((String) result[2])
                .segundoApellido((String) result[3])
                .correoElectronico((String) result[4])
                .nivelEstudios((String) result[5])
                .codigoPucp((String) result[6])
                .temaId((Integer) result[7])
                .tituloTema((String) result[8])
                .resumenTema((String) result[9])
                .metodologia((String) result[10])
                .objetivos((String) result[11])
                .areaConocimiento((String) result[12])
                .subAreaConocimiento((String) result[13])
                .asesorNombre((String) result[14])
                .asesorCorreo((String) result[15])
                .coasesorNombre((String) result[16])
                .coasesorCorreo((String) result[17])
                .cicloId((Integer) result[18])
                .cicloNombre((String) result[19])
                .fechaInicioCiclo(result[20] != null ? ((java.sql.Date) result[20]).toLocalDate() : null)
                .fechaFinCiclo(result[21] != null ? ((java.sql.Date) result[21]).toLocalDate() : null)
                .etapaFormativaId((Integer) result[22])
                .etapaFormativaNombre((String) result[23])
                .faseActual((String) result[24])
                .entregableId((Integer) result[25])
                .entregableNombre((String) result[26])
                .entregableActividadEstado((String) result[27])
                .entregableEnvioEstado((String) result[28])
                .entregableFechaInicio(
                        result[29] != null ? ((Timestamp) result[29]).toLocalDateTime().atZone(ZoneId.systemDefault())
                                : null)
                .entregableFechaFin(
                        result[30] != null ? ((Timestamp) result[30]).toLocalDateTime().atZone(ZoneId.systemDefault())
                                : null)
                .build();
    }

    @Override
    public List<HitoCronogramaDTO> getHitosCronogramaTesista(Integer tesistaId) {
        if (tesistaId == null) {
            throw new IllegalArgumentException("El ID del tesista es requerido");
        }

        List<Object[]> results = hitoCronogramaRepository.getHitosCronogramaTesista(tesistaId);
        return results.stream()
                .map(result -> HitoCronogramaDTO.builder()
                        .hitoId((Integer) result[0])
                        .nombre((String) result[1])
                        .descripcion((String) result[2])
                        .fechaInicio(result[3] != null
                                ? ((Timestamp) result[3]).toLocalDateTime().atZone(ZoneId.systemDefault())
                                : null)
                        .fechaFin(result[4] != null
                                ? ((Timestamp) result[4]).toLocalDateTime().atZone(ZoneId.systemDefault())
                                : null)
                        .entregableEnvioEstado((String) result[5])
                        .entregableActividadEstado((String) result[6])
                        .esEvaluable((Boolean) result[7])
                        .temaId((Integer) result[8])
                        .temaTitulo((String) result[9])
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<HistorialReunionDTO> getHistorialReuniones(Integer tesistaId) {
        if (tesistaId == null) {
            throw new IllegalArgumentException("El ID del tesista es requerido");
        }
        List<Object[]> results = historialReunionRepository.getHistorialReuniones(tesistaId);
        return results.stream()
                .map(result -> HistorialReunionDTO.builder()
                        .fecha(((Date) result[0]).toLocalDate())
                        .duracion((String) result[1])
                        .notas((String) result[2])
                        .build())
                .collect(Collectors.toList());
    }


    public UsuarioDto findByCognitoId(String cognitoId) throws NoSuchElementException {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByIdCognito(cognitoId);
        if (usuarioOpt.isPresent()) {
            return UsuarioMapper.toDto(usuarioOpt.get());
        }
        throw new NoSuchElementException("Usuario not found with ID Cognito: " + cognitoId);
    }



    @Override
    public List<EntregableEstudianteDto> getEntregablesEstudiante(String usuarioId) {
        // 1) Resolvemos el usuario interno a partir del Cognito ID
        UsuarioDto usuDto = findByCognitoId(usuarioId);
        if (usuDto == null) {
            throw new RuntimeException("Usuario no encontrado con Cognito ID: " + usuarioId);
        }
        Integer usuarioIdInterno = usuDto.getId();

        // 2) Buscamos sólo los usuario_tema donde activo = true y asignado = true
        List<UsuarioXTema> temas =
            usuarioXTemaRepository.findByUsuarioIdAndActivoTrueAndAsignadoTrue(usuarioIdInterno);

        if (temas.isEmpty()) {
            throw new RuntimeException("Usuario no tiene ningún tema activo y asignado");
        }
        // Nos quedamos con el primero (puedes ordenar antes si quieres prioridad por fecha, etc.)
        UsuarioXTema usuarioTema = temas.get(0);
        Integer temaId = usuarioTema.getTema().getId();

        // 3) Recuperamos y mapeamos los entregables de ese tema
        return entregableXTemaRepository.findByTemaIdWithEntregable(temaId).stream()
                .map(et -> {
                    int exId = et.getEntregableXTemaId();
                    Double notaGlobal = et.getNotaEntregable() != null
                            ? et.getNotaEntregable().doubleValue()
                            : null;
                    boolean esEvaluable      = et.getEntregable().isEsEvaluable();
                    String estadoEntregable  = et.getEntregable().getEstado().name();
                    String estadoXTema       = et.getEstado();

                    List<CriterioEntregableDto> criterios = criterioEntregableService
                            .listarCriteriosEntregableXEntregable(et.getEntregable().getId())
                            .stream()
                            .map(c -> {
                                Double nota = revisionCriterioEntregableRepository
                                        .findNotaByEntregableXTemaIdAndCriterioEntregableId(exId, c.getId())
                                        .map(BigDecimal::doubleValue)
                                        .orElse(null);
                                CriterioEntregableDto copy = new CriterioEntregableDto();
                                copy.setId(c.getId());
                                copy.setNombre(c.getNombre());
                                copy.setDescripcion(c.getDescripcion());
                                copy.setNotaMaxima(c.getNotaMaxima());
                                copy.setNota(nota);
                                return copy;
                            })
                            .collect(Collectors.toList());

                return new EntregableEstudianteDto(
                    et.getEntregable().getNombre(),
                    estadoEntregable,
                    estadoXTema,
                    et.getFechaEnvio() != null
                        ? et.getFechaEnvio().toLocalDateTime()
                        : null,
                    notaGlobal,
                    esEvaluable,
                    criterios
                );
            })
            .collect(Collectors.toList());
    }


    @Override
    public List<EntregableEstudianteDto> getEntregablesEstudianteById(int usuarioId) {
        System.out.println("usuarioId recibido: " + usuarioId);

        // 1) devolvemos sólo la asignación activa+asignada
        List<UsuarioXTema> asignaciones = usuarioXTemaRepository
            .findByUsuarioIdAndActivoTrueAndAsignadoTrue(usuarioId);

        if (asignaciones.isEmpty()) {
            System.out.println("El usuario " + usuarioId + " NO tiene tema activo+asignado.");
            throw new NoSuchElementException(
                "No existe tema activo/asignado para el usuario " + usuarioId
            );
        }

        // ya es un UsuarioXTema, no Optional
        UsuarioXTema asignacion = asignaciones.get(0);

        // accedes directo:
        Integer temaId = asignacion.getTema().getId();
        System.out.println("Tema ID del estudiante: " + temaId);


        var entregables = entregableXTemaRepository.findByTemaIdWithEntregable(temaId);
        System.out.println("Cantidad de entregables encontrados: " + entregables.size());

        return entregables.stream()
            .map(et -> {
                System.out.println("Procesando entregableXTemaId: " + et.getEntregableXTemaId());
                int exId = et.getEntregableXTemaId();

                Double notaGlobal = et.getNotaEntregable() != null
                    ? et.getNotaEntregable().doubleValue()
                    : null;

                boolean esEvaluable = et.getEntregable().isEsEvaluable();
                String estadoEntregable = et.getEntregable().getEstado().name();
                String estadoXTema = et.getEstado();

                List<CriterioEntregableDto> criterios = criterioEntregableService
                    .listarCriteriosEntregableXEntregable(et.getEntregable().getId())
                    .stream()
                    .map(c -> {
                        Double nota = revisionCriterioEntregableRepository
                            .findNotaByEntregableXTemaIdAndCriterioEntregableId(exId, c.getId())
                            .map(BigDecimal::doubleValue)
                            .orElse(null);

                        CriterioEntregableDto copy = new CriterioEntregableDto();
                        copy.setId(c.getId());
                        copy.setNombre(c.getNombre());
                        copy.setDescripcion(c.getDescripcion());
                        copy.setNotaMaxima(c.getNotaMaxima());
                        copy.setNota(nota);
                        return copy;
                    })
                    .collect(Collectors.toList());

                return new EntregableEstudianteDto(
                    et.getEntregable().getNombre(),
                    estadoEntregable,
                    estadoXTema,
                    et.getFechaEnvio() != null ? et.getFechaEnvio().toLocalDateTime() : null,
                    notaGlobal,
                    esEvaluable,
                    criterios
                );
            })
            .collect(Collectors.toList());
    }



    @Override
    public List<EntregableCriteriosDetalleDto> getEntregablesConCriterios(Integer idUsuario) {
        //Integer usuarioId = usuarioService.findByCognitoId(cognitoSub).getId();
        List<Object[]> results = entregablesCriteriosRepository.getEntregablesConCriterios(idUsuario);

        Map<Integer, EntregableCriteriosDetalleDto> map = new LinkedHashMap<>();
        for (Object[] r : results) {
            Integer id = (Integer) r[0];
            map.computeIfAbsent(id, k -> EntregableCriteriosDetalleDto.builder()
                    .entregableId(id)
                    .entregableNombre((String) r[1])
                    .fechaEnvio(r[2] != null
                            ? ((java.time.Instant) r[2]).atOffset(java.time.ZoneOffset.UTC)
                            : null)
                    .notaGlobal(r[3] != null
                            ? ((Number) r[3]).doubleValue()
                            : null)
                    .estadoEntrega((String) r[4])
                    .criterios(new ArrayList<>())
                    .build()
            );
            if (r[5] != null) {
                EntregableCriteriosDetalleDto e = map.get(id);
                e.getCriterios().add(
                        CriterioEntregableDetalleDto.builder()
                                .criterioId((Integer) r[5])
                                .criterioNombre((String) r[6])
                                .notaMaxima(r[7] != null
                                        ? ((Number) r[7]).doubleValue()
                                        : null)
                                .notaCriterio(r[8] != null
                                        ? ((Number) r[8]).doubleValue()
                                        : null)
                                .build()
                );
            }
        }
        return new ArrayList<>(map.values());
    }
}
