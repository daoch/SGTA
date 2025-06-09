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

@Service
public class ReportingServiceImpl implements IReportService {

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
    public DetalleTesistaDTO getDetalleTesista(String cognitoSub) {
        Integer tesistaId = usuarioService.findByCognitoId(cognitoSub).getId();
        List<Object[]> res = detalleTesistaRepository.getDetalleTesista(tesistaId);
        if (res.isEmpty()) return null;
        Object[] r = res.get(0);
        return DetalleTesistaDTO.builder()
            .tesistaId((Integer) r[0])
            .nombres((String) r[1])
            .primerApellido((String) r[2])
            .segundoApellido((String) r[3])
            .correoElectronico((String) r[4])
            .nivelEstudios((String) r[5])
            .codigoPucp((String) r[6])
            .temaId((Integer) r[7])
            .tituloTema((String) r[8])
            .resumenTema((String) r[9])
            .metodologia((String) r[10])
            .objetivos((String) r[11])
            .areaConocimiento((String) r[12])
            .subAreaConocimiento((String) r[13])
            .asesorNombre((String) r[14])
            .asesorCorreo((String) r[15])
            .coasesorNombre((String) r[16])
            .coasesorCorreo((String) r[17])
            .cicloId((Integer) r[18])
            .cicloNombre((String) r[19])
            .fechaInicioCiclo(
                r[20] != null
                  ? ((Date) r[20]).toLocalDate()
                  : null)
            .fechaFinCiclo(
                r[21] != null
                  ? ((Date) r[21]).toLocalDate()
                  : null)
            .etapaFormativaId((Integer) r[22])
            .etapaFormativaNombre((String) r[23])
            .faseActual((String) r[24])
            .entregableId((Integer) r[25])
            .entregableNombre((String) r[26])
            .entregableActividadEstado((String) r[27])
            .entregableEnvioEstado((String) r[28])
            .entregableFechaInicio(
                r[29] != null
                  ? ((Timestamp) r[29]).toLocalDateTime().atZone(ZoneId.systemDefault())
                  : null)
            .entregableFechaFin(
                r[30] != null
                  ? ((Timestamp) r[30]).toLocalDateTime().atZone(ZoneId.systemDefault())
                  : null)
            .build();
    }

    @Override
    public List<HitoCronogramaDTO> getHitosCronogramaTesista(String cognitoSub) {
        Integer tesistaId = usuarioService.findByCognitoId(cognitoSub).getId();
        List<Object[]> results = hitoCronogramaRepository.getHitosCronogramaTesista(tesistaId);
        return results.stream()
                      .map(r -> HitoCronogramaDTO.builder()
                          .hitoId((Integer) r[0])
                          .nombre((String) r[1])
                          .descripcion((String) r[2])
                          .fechaInicio(
                              r[3] != null
                                ? ((Timestamp) r[3]).toLocalDateTime()
                                                   .atZone(ZoneId.systemDefault())
                                : null)
                          .fechaFin(
                              r[4] != null
                                ? ((Timestamp) r[4]).toLocalDateTime()
                                                   .atZone(ZoneId.systemDefault())
                                : null)
                          .entregableEnvioEstado((String) r[5])
                          .entregableActividadEstado((String) r[6])
                          .esEvaluable((Boolean) r[7])
                          .temaId((Integer) r[8])
                          .temaTitulo((String) r[9])
                          .build())
                      .collect(Collectors.toList());
    }

    @Override
    public List<HistorialReunionDTO> getHistorialReuniones(String cognitoSub) {
        Integer tesistaId = usuarioService.findByCognitoId(cognitoSub).getId();
        List<Object[]> results = historialReunionRepository.getHistorialReuniones(tesistaId);
        return results.stream()
                      .map(r -> HistorialReunionDTO.builder()
                          .fecha(((Date) r[0]).toLocalDate())
                          .duracion((String) r[1])
                          .notas((String) r[2])
                          .build())
                      .collect(Collectors.toList());
    }

    @Override
    public List<EntregableEstudianteDto> getEntregablesEstudiante(String cognitoSub) {
        Integer usuarioId = usuarioService.findByCognitoId(cognitoSub).getId();
        UsuarioXTema ut = usuarioXTemaRepository
            .findByUsuarioId(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no tiene tema asignado"));
        int temaId = ut.getTema().getId();

        return entregableXTemaRepository.findByTemaIdWithEntregable(temaId).stream()
            .map(et -> {
                int exId = et.getEntregableXTemaId();
                Double notaGlobal = et.getNotaEntregable() != null
                    ? et.getNotaEntregable().doubleValue()
                    : null;
                boolean esEvaluable      = et.getEntregable().isEsEvaluable();
                String estadoEntregable  = et.getEntregable().getEstadoStr();
                String estadoXTema       = et.getEstado().name();

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
    public List<EntregableCriteriosDetalleDto> getEntregablesConCriterios(String cognitoSub) {
        Integer usuarioId = usuarioService.findByCognitoId(cognitoSub).getId();
        List<Object[]> results = entregablesCriteriosRepository.getEntregablesConCriterios(usuarioId);

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
