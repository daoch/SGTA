package pucp.edu.pe.sgta.service.imp;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Comparator;
import java.util.HashMap;
import java.util.ArrayList;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.AdvisorPerformanceDto;
import pucp.edu.pe.sgta.dto.AreaFinalDTO;
import pucp.edu.pe.sgta.dto.DetalleTesistaDTO;
import pucp.edu.pe.sgta.dto.HistorialReunionDTO;
import pucp.edu.pe.sgta.dto.HitoCronogramaDTO;
import pucp.edu.pe.sgta.dto.TeacherCountDTO;
import pucp.edu.pe.sgta.dto.TopicAreaStatsDTO;
import pucp.edu.pe.sgta.dto.TopicTrendDTO;
import pucp.edu.pe.sgta.dto.TesistasPorAsesorDTO;
import pucp.edu.pe.sgta.repository.AdvisorDistributionRepository;
import pucp.edu.pe.sgta.repository.AdvisorPerformanceRepository;
import pucp.edu.pe.sgta.repository.DetalleTesistaRepository;
import pucp.edu.pe.sgta.repository.HistorialReunionRepository;
import pucp.edu.pe.sgta.repository.HitoCronogramaRepository;
import pucp.edu.pe.sgta.repository.JurorDistributionRepository;
import pucp.edu.pe.sgta.repository.TopicAreaStatsRepository;
import pucp.edu.pe.sgta.repository.TesistasPorAsesorRepository;
import pucp.edu.pe.sgta.service.inter.IReportService;

import pucp.edu.pe.sgta.dto.EntregableEstudianteDto;
import pucp.edu.pe.sgta.repository.UsuarioXTemaRepository;
import pucp.edu.pe.sgta.repository.EntregableXTemaRepository;
import pucp.edu.pe.sgta.model.UsuarioXTema;
import java.util.Optional;

import pucp.edu.pe.sgta.repository.RevisionCriterioEntregableRepository;

import pucp.edu.pe.sgta.dto.CriterioEntregableDto;
import pucp.edu.pe.sgta.repository.CriterioEntregableRepository;
import pucp.edu.pe.sgta.model.CriterioEntregable;
import java.util.stream.Collectors;
import java.math.BigDecimal;
import pucp.edu.pe.sgta.service.inter.CriterioEntregableService;

import pucp.edu.pe.sgta.dto.EntregableCriteriosDetalleDto;
import pucp.edu.pe.sgta.dto.CriterioEntregableDetalleDto;
import pucp.edu.pe.sgta.repository.EntregablesCriteriosRepository;

@Service
public class ReportingServiceImpl implements IReportService {

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

    private final CriterioEntregableRepository criterioEntregableRepository;

    private final CriterioEntregableService criterioEntregableService;

    private final EntregablesCriteriosRepository entregablesCriteriosRepository;

    public ReportingServiceImpl(
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
            CriterioEntregableRepository criterioEntregableRepository,
            CriterioEntregableService criterioEntregableService,
            EntregablesCriteriosRepository entregablesCriteriosRepository
            ) {
        this.topicAreaStatsRepository = topicAreaStatsRepository;
        this.advisorDistributionRepository = advisorDistributionRepository;
        this.jurorDistributionRepository = jurorDistributionRepository;
        this.advisorPerformanceRepository = advisorPerformanceRepository;
        this.tesistasPorAsesorRepository = tesistasPorAsesorRepository;
        this.detalleTesistaRepository = detalleTesistaRepository;
        this.hitoCronogramaRepository = hitoCronogramaRepository;
        this.historialReunionRepository = historialReunionRepository;

        this.usuarioXTemaRepository = usuarioXTemaRepository;
        this.entregableXTemaRepository = entregableXTemaRepository;
        this.revisionCriterioEntregableRepository = revisionCriterioEntregableRepository;
        this.criterioEntregableRepository = criterioEntregableRepository;
        this.criterioEntregableService = criterioEntregableService;
        this.entregablesCriteriosRepository = entregablesCriteriosRepository;
    }

    @Override
    public List<TopicAreaStatsDTO> getTopicAreaStatistics(Integer usuarioId, String cicloNombre) {
        // Ahora se usa la función que filtra por usuario y ciclo
        List<Object[]> results = topicAreaStatsRepository.getTopicAreaStatsByUserAndCiclo(usuarioId, cicloNombre);
        return results.stream()
                .map(result -> new TopicAreaStatsDTO(
                        (String) result[0], // area_name
                        ((Number) result[1]).intValue() // topic_count
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<TeacherCountDTO> getAdvisorDistribution(Integer usuarioId, String cicloNombre) {
        List<Object[]> rows = advisorDistributionRepository
                .getAdvisorDistributionByCoordinatorAndCiclo(usuarioId, cicloNombre);
        return rows.stream()
                .map(r -> new TeacherCountDTO(
                        (String) r[0], // teacher_name
                        (String) r[1], // area_name
                        ((Number) r[2]).intValue() // advisor_count
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<TeacherCountDTO> getJurorDistribution(Integer usuarioId, String cicloNombre) {
        List<Object[]> rows = jurorDistributionRepository
                .getJurorDistributionByCoordinatorAndCiclo(usuarioId, cicloNombre);
        return rows.stream()
                .map(r -> new TeacherCountDTO(
                        (String) r[0], // teacher_name
                        (String) r[1], // area_name
                        ((Number) r[2]).intValue() // juror_count
                ))
                .collect(Collectors.toList());
    }
    // TODO: Agregar metodos para comparativa de Asesor vs Jurado <-- Talves se
    // pueda hacer con los datos mismos anteriores ya guardados.

    @Override
    public List<AreaFinalDTO> getAreaFinal(Integer usuarioId, String cicloNombre) {
        if (usuarioId == null || cicloNombre == null || cicloNombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El ID de usuario y el ciclo son requeridos");
        }

        // Obtener datos usando los métodos existentes
        List<TeacherCountDTO> advisors = getAdvisorDistribution(usuarioId, cicloNombre);
        List<TeacherCountDTO> jurors = getJurorDistribution(usuarioId, cicloNombre);

        // Mapa para mantener el registro de todos los profesores y sus asignaciones
        Map<String, AreaFinalDTO.AreaFinalDTOBuilder> teacherMap = new HashMap<>();

        // Procesar asesores
        processTeachers(advisors, teacherMap, true);

        // Procesar jurados
        processTeachers(jurors, teacherMap, false);

        // Calcular totales y construir DTOs finales
        return teacherMap.values().stream()
                .map(builder -> {
                    AreaFinalDTO dto = builder.build();
                    int total = dto.getAdvisorCount() + dto.getJurorCount();

                    return AreaFinalDTO.builder()
                            .teacherName(dto.getTeacherName())
                            .areaName(dto.getAreaName())
                            .advisorCount(dto.getAdvisorCount())
                            .jurorCount(dto.getJurorCount())
                            .totalCount(total)
                            .build();
                })
                .sorted(Comparator.comparing(AreaFinalDTO::getAreaName)
                        .thenComparing(AreaFinalDTO::getTeacherName))
                .collect(Collectors.toList());
    }

    private void processTeachers(List<TeacherCountDTO> teachers,
            Map<String, AreaFinalDTO.AreaFinalDTOBuilder> teacherMap,
            boolean isAdvisor) {

        for (TeacherCountDTO teacher : teachers) {

            // 👉 1. Obtenemos los valores directamente del DTO
            String teacherName = teacher.getTeacherName().trim();
            String areaName = teacher.getAreaName().trim();

            if (teacherName.isEmpty() || areaName.isEmpty()) {
                System.err.println("Datos incompletos para profesor: " + teacher);
                continue;
            }

            // 👉 2. Clave única docente-área
            String key = teacherName + "|" + areaName;

            // 👉 3. Insertar o reutilizar builder
            teacherMap.computeIfAbsent(key, k -> AreaFinalDTO.builder()
                    .teacherName(teacherName)
                    .areaName(areaName)
                    .advisorCount(0)
                    .jurorCount(0)
                    .totalCount(0));

            // 👉 4. Actualizar contador correspondiente
            AreaFinalDTO.AreaFinalDTOBuilder builder = teacherMap.get(key);
            if (isAdvisor) {
                builder.advisorCount(teacher.getCount());
            } else {
                builder.jurorCount(teacher.getCount());
            }
        }
    }

    // TODO: Agregar desempeño de asesores por cantidad de tesis avanzadas (en
    // progreso) y comparativa con tesistas totales
    @Override
    public List<AdvisorPerformanceDto> getAdvisorPerformance(Integer usuarioId, String cicloNombre) {
        if (usuarioId == null) {
            throw new IllegalArgumentException("El ID de usuario es requerido");
        }
        if (cicloNombre == null || cicloNombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El ciclo es requerido");
        }

        List<Object[]> results = advisorPerformanceRepository.getAdvisorPerformanceByUser(usuarioId, cicloNombre);
        return results.stream()
                .map(result -> new AdvisorPerformanceDto(
                        (String) result[0], // advisor_name
                        (String) result[1], // area_name
                        Optional.ofNullable((Number) result[2]).map(r -> r.doubleValue()).orElse(0.0d),// performance_percentage
                        ((Number) result[3]).intValue() // total_students
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<TopicTrendDTO> getTopicTrendsByYear(Integer usuarioId) {
        if (usuarioId == null) {
            throw new IllegalArgumentException("El ID de usuario es requerido");
        }

        List<Object[]> results = topicAreaStatsRepository.getTopicTrendsByUser(usuarioId);
        return results.stream()
                .map(result -> new TopicTrendDTO(
                        (String) result[0], // area_name
                        ((Number) result[1]).intValue(), // year
                        ((Number) result[2]).intValue() // topic_count
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<TesistasPorAsesorDTO> getTesistasPorAsesor(Integer asesorId) {
        if (asesorId == null) {
            throw new IllegalArgumentException("El ID del asesor es requerido");
        }

        List<Object[]> results = tesistasPorAsesorRepository.getTesistasPorAsesor(asesorId);
        return results.stream()
                .map(result -> {
                    Object fechaInicio = result[12];
                    Object fechaFin = result[13];

                    return TesistasPorAsesorDTO.builder()
                            .temaId((Integer) result[0])
                            .tesistaId((Integer) result[1])
                            .nombres((String) result[2])
                            .primerApellido((String) result[3])
                            .segundoApellido((String) result[4])
                            .correoElectronico((String) result[5])
                            .tituloTema((String) result[6])
                            .etapaFormativaNombre((String) result[7])
                            .carrera((String) result[8])
                            .entregableActualId((Integer) result[9])
                            .entregableActualNombre((String) result[10])
                            .entregableActualDescripcion((String) result[11])
                            .entregableActualFechaInicio(fechaInicio != null
                                    ? ((Timestamp) fechaInicio).toLocalDateTime().atZone(ZoneId.systemDefault())
                                    : null)
                            .entregableActualFechaFin(fechaFin != null
                                    ? ((Timestamp) fechaFin).toLocalDateTime().atZone(ZoneId.systemDefault())
                                    : null)
                            .entregableActualEstado((String) result[14])
                            .entregableEnvioEstado((String) result[15])
                            .entregableEnvioFecha(
                                    result[16] != null ? new java.util.Date(((Timestamp) result[16]).getTime()) : null)
                            .build();
                })
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

    @Override
    public List<EntregableEstudianteDto> getEntregablesEstudiante(Integer usuarioId) {
        Optional<UsuarioXTema> usuarioTema = usuarioXTemaRepository.findByUsuarioId(usuarioId);
        if (usuarioTema.isEmpty()) {
            throw new RuntimeException("Usuario no tiene tema asignado");
        }

        Integer temaId = usuarioTema.get().getTema().getId();

        return entregableXTemaRepository.findByTemaIdWithEntregable(temaId).stream()
            .map(et -> {
                // 1) Obtener ID de EntregableXTema
                Integer entregableXTemaId = et.getEntregableXTemaId();

                // 2) Obtener la nota global para este EntregableXTema (si existe)
                //    (asumiendo que en tu entidad EntregableXTema ya existe un campo `notaEntregable`)
                Double notaGlobal = et.getNotaEntregable() != null ? et.getNotaEntregable().doubleValue() : null;

                // 3) Obtener esEvaluable desde la entidad Entregable
                boolean esEvaluable = et.getEntregable().isEsEvaluable();

                // 4) Obtener el estado que vive en la tabla "entregable"
                String estadoEntregable = et.getEntregable().getEstadoStr();

                // 5) Obtener el estado que vive en la tabla "entregable_x_tema"
                String estadoEntregaXTema = et.getEstado().name();

                // 6) Construir la lista de criterios para este entregable_x_tema.
                //    Primero obtenemos todos los criterios activos de este entregable.
                List<CriterioEntregableDto> criteriosDtoList = criterioEntregableService
                    .listarCriteriosEntregableXEntregable(et.getEntregable().getId())
                    .stream()
                    .map(critDto -> {
                        // Para cada criterio: buscamos su nota en revision_criterio_entregable (si existe)
                        Optional<BigDecimal> notaOpt = revisionCriterioEntregableRepository
                            .findNotaByEntregableXTemaIdAndCriterioEntregableId(
                                entregableXTemaId,
                                critDto.getId()
                            );

                        // Lo convertimos a Double (o null si no hay nota registrada)
                        Double notaCriterio = notaOpt.map(BigDecimal::doubleValue).orElse(null);

                        // Clonamos el DTO y le seteamos la nota obtenida
                        CriterioEntregableDto copia = new CriterioEntregableDto();
                        copia.setId(critDto.getId());
                        copia.setNombre(critDto.getNombre());
                        copia.setNotaMaxima(critDto.getNotaMaxima());
                        copia.setDescripcion(critDto.getDescripcion());
                        copia.setNota(notaCriterio);
                        return copia;
                    })
                    .collect(Collectors.toList());

                // 7) Construir el DTO final, pasándole T-O-D-O-S los campos en el orden correcto:
                return new EntregableEstudianteDto(
                    et.getEntregable().getNombre(),    // nombreEntregable
                    estadoEntregable,                  // estado (tabla entregable)
                    estadoEntregaXTema,                // estado (tabla entregable_x_tema)
                    et.getFechaEnvio() != null
                        ? et.getFechaEnvio().toLocalDateTime()
                        : null,                       // fechaEnvio
                    notaGlobal,                        // nota (nota_entregable en ent_x_tema)
                    esEvaluable,                       // esEvaluable
                    criteriosDtoList                   // criterios (con su campo nota de cada criterio)
                );
            })
            .collect(Collectors.toList());
    }

    @Override
    public List<EntregableCriteriosDetalleDto> getEntregablesConCriterios(Integer usuarioId) {
        List<Object[]> results = entregablesCriteriosRepository.getEntregablesConCriterios(usuarioId);
        
        // Usar un Map para agrupar los criterios por entregableId
        Map<Integer, EntregableCriteriosDetalleDto> entregablesMap = new HashMap<>();
        
        for (Object[] result : results) {
            Integer entregableId = (Integer) result[0];
            
            // Si el entregable no existe en el map, lo creamos con sus datos básicos
            if (!entregablesMap.containsKey(entregableId)) {
                EntregableCriteriosDetalleDto entregable = EntregableCriteriosDetalleDto.builder()
                    .entregableId(entregableId)
                    .entregableNombre((String) result[1])
                    .fechaEnvio( result[3] != null ?
                        ((java.time.Instant) result[2]).atOffset(java.time.ZoneOffset.UTC) : null
                    )
                    .notaGlobal(result[3] != null ? ((Number) result[3]).doubleValue() : null)
                    .estadoEntrega((String) result[4])
                    .criterios(new ArrayList<>())
                    .build();
                entregablesMap.put(entregableId, entregable);
            }
            
            // Crear y agregar el criterio al entregable si existe
            if (result[5] != null) {
                CriterioEntregableDetalleDto criterio = CriterioEntregableDetalleDto.builder()
                    .criterioId((Integer) result[5])
                    .criterioNombre((String) result[6])
                    .notaMaxima(result[7] != null ? ((Number) result[7]).doubleValue() : null)
                    .notaCriterio(result[8] != null ? ((Number) result[8]).doubleValue() : null)
                    .build();
                entregablesMap.get(entregableId).getCriterios().add(criterio);
            }
        }
        
        // Convertir el map a lista y ordenar por ID de entregable
        return entregablesMap.values()
            .stream()
            .sorted(Comparator.comparing(EntregableCriteriosDetalleDto::getEntregableId))
            .collect(Collectors.toList());
    }

    
}

