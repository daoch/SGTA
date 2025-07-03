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
import pucp.edu.pe.sgta.service.inter.CriterioEntregableService;    
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

import pucp.edu.pe.sgta.dto.RevisionDocumentoDto;
import pucp.edu.pe.sgta.model.RevisionDocumento;
import pucp.edu.pe.sgta.model.VersionXDocumento;
import pucp.edu.pe.sgta.repository.VersionXDocumentoRepository;
import pucp.edu.pe.sgta.repository.RevisionDocumentoRepository;


@Service
public class ReportingServiceImpl implements IReportService {

    private static final Logger logger = LoggerFactory.getLogger(ReportingServiceImpl.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VersionXDocumentoRepository versionXDocumentoRepository;

    @Autowired
    private RevisionDocumentoRepository revisionDocumentoRepository;


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
            EntregablesCriteriosRepository entregablesCriteriosRepository,
            VersionXDocumentoRepository versionXDocumentoRepository) {
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
        this.versionXDocumentoRepository = versionXDocumentoRepository;
    }

    @Override
    public List<TopicAreaStatsDTO> getTopicAreaStatistics(String cognitoSub, String cicloNombre) {
        Integer usuarioId = usuarioService.findByCognitoId(cognitoSub).getId();
        List<Object[]> results = topicAreaStatsRepository
                .getTopicAreaStatsByUserAndCiclo(usuarioId, cicloNombre);
        return results.stream()
                .map(r -> {
                    String etapasFormativasJson = (String) r[2];
                    Map<String, Integer> etapasFormativas = parseEtapasFormativasMap(etapasFormativasJson);
                    return new TopicAreaStatsDTO((String) r[0], ((Number) r[1]).intValue(), etapasFormativas);
                })
                .collect(Collectors.toList());
    }

    private Map<String, Integer> parseEtapasFormativasMap(String jsonStr) {
        Map<String, Integer> result = new HashMap<>();
        if (jsonStr == null || jsonStr.trim().isEmpty() || jsonStr.equals("{}") || jsonStr.equals("null")) {
            return result;
        }
        try {
            // Parsing del JSON simple {"Tesis 1": 10, "Tesis 2": 8}
            String cleanJson = jsonStr.trim();
            if (cleanJson.startsWith("{") && cleanJson.endsWith("}")) {
                cleanJson = cleanJson.substring(1, cleanJson.length() - 1);
                if (!cleanJson.trim().isEmpty()) {
                    String[] pairs = cleanJson.split(",");
                    for (String pair : pairs) {
                        String[] keyValue = pair.split(":");
                        if (keyValue.length == 2) {
                            String key = keyValue[0].trim().replace("\"", "");
                            String value = keyValue[1].trim();
                            try {
                                int count = Integer.parseInt(value);
                                result.put(key, count);
                            } catch (NumberFormatException e) {
                                logger.warn("Invalid number format in JSON: {}", value);
                            }
                        }
                    }
                }
            }
            return result;
        } catch (Exception e) {
            logger.warn("Error parsing etapas formativas JSON: {}", jsonStr, e);
            return result;
        }
    }

    private List<String> parseAreasConocimientoList(String jsonStr) {
        List<String> result = new ArrayList<>();
        if (jsonStr == null || jsonStr.trim().isEmpty() || jsonStr.equals("[]") || jsonStr.equals("null")) {
            return result;
        }
        try {
            // Parsing del JSON array ["Ciencias de la Computación", "Ingeniería de Software"]
            String cleanJson = jsonStr.trim();
            if (cleanJson.startsWith("[") && cleanJson.endsWith("]")) {
                cleanJson = cleanJson.substring(1, cleanJson.length() - 1);
                if (!cleanJson.trim().isEmpty()) {
                    String[] areas = cleanJson.split(",");
                    for (String area : areas) {
                        String cleanArea = area.trim().replace("\"", "");
                        if (!cleanArea.isEmpty()) {
                            result.add(cleanArea);
                        }
                    }
                }
            }
            return result;
        } catch (Exception e) {
            logger.warn("Error parsing areas conocimiento JSON: {}", jsonStr, e);
            return result;
        }
    }

    @Override
    public List<TopicTrendDTO> getTopicTrendsByYear(String cognitoSub) {
        Integer usuarioId = usuarioService.findByCognitoId(cognitoSub).getId();
        List<Object[]> results = topicAreaStatsRepository.getTopicTrendsByUser(usuarioId);
        return results.stream()
                .map(r -> {
                    String etapasFormativasJson = (String) r[3]; // El campo etapas_formativas_json es el índice 3
                    Map<String, Integer> etapasFormativas = parseEtapasFormativasMap(etapasFormativasJson);
                    TopicTrendDTO dto = new TopicTrendDTO((String) r[0], ((Number) r[1]).intValue(), ((Number) r[2]).intValue());
                    dto.setEtapasFormativasCount(etapasFormativas);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<TeacherCountDTO> getAdvisorDistribution(String cognitoSub, String cicloNombre) {
        Integer usuarioId = usuarioService.findByCognitoId(cognitoSub).getId();
        List<Object[]> rows = advisorDistributionRepository
                .getAdvisorDistributionByCoordinatorAndCiclo(usuarioId, cicloNombre);
        return rows.stream()
                .map(r -> {
                    String areasConocimientoJson = (String) r[2]; // Campo areas_conocimiento_json 
                    String etapasFormativasJson = (String) r[6]; // Campo etapas_formativas_json (ahora índice 6)
                    Map<String, Integer> etapasFormativasCount = parseEtapasFormativasMap(etapasFormativasJson);
                    List<String> areasConocimiento = parseAreasConocimientoList(areasConocimientoJson);
                    
                    TeacherCountDTO dto = new TeacherCountDTO((String) r[0], (String) r[1], ((Number) r[3]).intValue());
                    dto.setAreasConocimiento(areasConocimiento);
                    dto.setEtapasFormativasCount(etapasFormativasCount);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<TeacherCountDTO> getJurorDistribution(String cognitoSub, String cicloNombre) {
        Integer usuarioId = usuarioService.findByCognitoId(cognitoSub).getId();
        List<Object[]> rows = jurorDistributionRepository
                .getJurorDistributionByCoordinatorAndCiclo(usuarioId, cicloNombre);
        return rows.stream()
                .map(r -> {
                    String areasConocimientoJson = (String) r[2]; // Campo areas_conocimiento_json 
                    String etapasFormativasJson = (String) r[6]; // Campo etapas_formativas_json (ahora índice 6)
                    Map<String, Integer> etapasFormativasCount = parseEtapasFormativasMap(etapasFormativasJson);
                    List<String> areasConocimiento = parseAreasConocimientoList(areasConocimientoJson);
                    
                    TeacherCountDTO dto = new TeacherCountDTO((String) r[0], (String) r[1], ((Number) r[3]).intValue());
                    dto.setAreasConocimiento(areasConocimiento);
                    dto.setEtapasFormativasCount(etapasFormativasCount);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<AreaFinalDTO> getAreaFinal(String cognitoSub, String cicloNombre) {
        var advisors = getAdvisorDistribution(cognitoSub, cicloNombre);
        var jurors   = getJurorDistribution(cognitoSub, cicloNombre);
        Map<String, AreaFinalDTO.AreaFinalDTOBuilder> map = new HashMap<>();
        
        // Mapas separados para asesores y jurados
        Map<String, Map<String, Integer>> etapasFormativasAsesorPorProfesor = new HashMap<>();
        Map<String, Map<String, Integer>> etapasFormativasJuradoPorProfesor = new HashMap<>();
        Map<String, Set<String>> areasConocimientoPorProfesor = new HashMap<>();
        
        processTeachersEnhanced(advisors, map, true, etapasFormativasAsesorPorProfesor, areasConocimientoPorProfesor);
        processTeachersEnhanced(jurors, map, false, etapasFormativasJuradoPorProfesor, areasConocimientoPorProfesor);
        
        return map.values().stream()
                .map(b -> {
                    AreaFinalDTO d = b.build();
                    d.setTotalCount(d.getAdvisorCount() + d.getJurorCount());
                    
                    String key = d.getTeacherName();  // Solo por profesor, no por área
                    
                    // Configurar múltiples áreas
                    Set<String> areas = areasConocimientoPorProfesor.get(key);
                    d.setAreasConocimiento(areas != null ? new ArrayList<>(areas) : Collections.emptyList());
                    
                    // Configurar contadores separados por etapa formativa
                    d.setEtapasFormativasAsesorCount(
                        etapasFormativasAsesorPorProfesor.getOrDefault(key, Collections.emptyMap())
                    );
                    d.setEtapasFormativasJuradoCount(
                        etapasFormativasJuradoPorProfesor.getOrDefault(key, Collections.emptyMap())
                    );
                    
                    // DEPRECATED: Para compatibilidad
                    d.setAreaName(areas != null && !areas.isEmpty() ? areas.iterator().next() : "Área no definida");
                    
                    // Combinar todas las etapas para compatibilidad
                    Set<String> todasEtapas = new HashSet<>();
                    if (d.getEtapasFormativasAsesorCount() != null) {
                        todasEtapas.addAll(d.getEtapasFormativasAsesorCount().keySet());
                    }
                    if (d.getEtapasFormativasJuradoCount() != null) {
                        todasEtapas.addAll(d.getEtapasFormativasJuradoCount().keySet());
                    }
                    d.setEtapasFormativas(new ArrayList<>(todasEtapas));
                    
                    return d;
                })
                .sorted(Comparator.comparing(AreaFinalDTO::getTeacherName))
                .collect(Collectors.toList());
    }

    private void processTeachers(List<TeacherCountDTO> list,
                                 Map<String, AreaFinalDTO.AreaFinalDTOBuilder> map,
                                 boolean isAdvisor,
                                 Map<String, Set<String>> etapasFormativasPorProfesor) {
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
            
            // Agregar etapas formativas desde el mapa de contadores
            if (t.getEtapasFormativasCount() != null && !t.getEtapasFormativasCount().isEmpty()) {
                etapasFormativasPorProfesor.computeIfAbsent(key, k -> new HashSet<>())
                    .addAll(t.getEtapasFormativasCount().keySet());
            }
        }
    }

    private void processTeachersEnhanced(List<TeacherCountDTO> list,
                                       Map<String, AreaFinalDTO.AreaFinalDTOBuilder> map,
                                       boolean isAdvisor,
                                       Map<String, Map<String, Integer>> etapasFormativasPorProfesor,
                                       Map<String, Set<String>> areasConocimientoPorProfesor) {
        for (var t : list) {
            String name = t.getTeacherName();
            String key = name; // Clave solo por nombre de profesor
            
            // Configurar builder del DTO
            map.computeIfAbsent(key, k -> AreaFinalDTO.builder()
                    .teacherName(name)
                    .advisorCount(0)
                    .jurorCount(0)
                    .totalCount(0));
            
            var b = map.get(key);
            // Necesitamos acumular los valores correctamente
            AreaFinalDTO temp = b.build();
            if (isAdvisor) {
                b.advisorCount(temp.getAdvisorCount() + t.getCount());
            } else {
                b.jurorCount(temp.getJurorCount() + t.getCount());
            }
            
            // Agregar áreas de conocimiento
            if (t.getAreasConocimiento() != null && !t.getAreasConocimiento().isEmpty()) {
                areasConocimientoPorProfesor.computeIfAbsent(key, k -> new HashSet<>())
                    .addAll(t.getAreasConocimiento());
            } else if (t.getAreaName() != null) {
                // Fallback a área simple
                areasConocimientoPorProfesor.computeIfAbsent(key, k -> new HashSet<>())
                    .add(t.getAreaName());
            }
            
            // Agregar etapas formativas específicas (asesor o jurado)
            if (t.getEtapasFormativasCount() != null && !t.getEtapasFormativasCount().isEmpty()) {
                // Agregar/sumar contadores por etapa formativa
                Map<String, Integer> existingCounts = etapasFormativasPorProfesor.getOrDefault(key, new HashMap<>());
                for (Map.Entry<String, Integer> entry : t.getEtapasFormativasCount().entrySet()) {
                    existingCounts.merge(entry.getKey(), entry.getValue(), Integer::sum);
                }
                etapasFormativasPorProfesor.put(key, existingCounts);
            }
        }
    }

    @Override
    public List<AdvisorPerformanceDto> getAdvisorPerformance(String cognitoSub, String cicloNombre) {
        Integer usuarioId = usuarioService.findByCognitoId(cognitoSub).getId();
        List<Object[]> results = advisorPerformanceRepository
                .getAdvisorPerformanceByUser(usuarioId, cicloNombre);
        return results.stream()
                .map(r -> {
                    String etapasFormativasJson = (String) r[4]; // Campo etapas_formativas_json
                    Map<String, Integer> etapasFormativasCount = parseEtapasFormativasMap(etapasFormativasJson);
                    AdvisorPerformanceDto dto = new AdvisorPerformanceDto(
                            (String) r[0], (String) r[1],
                            Optional.ofNullable((Number) r[2]).map(Number::doubleValue).orElse(0.0),
                            ((Number) r[3]).intValue());
                    dto.setEtapasFormativasCount(etapasFormativasCount);
                    return dto;
                })
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
                        .porcentajeEntregablesEnviados(
                                r[17] != null
                                        ? ((java.math.BigDecimal) r[17]).doubleValue()
                                        : 0.0)
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
                
                RevisionDocumentoDto revisionDto = getEstadoRevisionPorEntregable(et.getEntregableXTemaId());
                Integer revisionId = (revisionDto != null) ? revisionDto.getId() : null;
                String estadoRevision = (revisionDto != null) ? revisionDto.getEstadoRevision() : null;


                return new EntregableEstudianteDto(
                    et.getEntregableXTemaId(), 
                    et.getEntregable().getId(),           
                    et.getTema().getId(), 
                    et.getEntregable().getNombre(),
                    estadoEntregable,
                    estadoXTema,
                    et.getFechaEnvio() != null
                        ? et.getFechaEnvio().toLocalDateTime()
                        : null,
                    notaGlobal,
                    esEvaluable,
                    criterios,
                    revisionId,                        
                    estadoRevision   
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
                RevisionDocumentoDto revisionDto = getEstadoRevisionPorEntregable(et.getEntregableXTemaId());
                Integer revisionId = (revisionDto != null) ? revisionDto.getId() : null;
                String estadoRevision = (revisionDto != null) ? revisionDto.getEstadoRevision() : null;
                return new EntregableEstudianteDto(
                    et.getEntregableXTemaId(), 
                    et.getEntregable().getId(),
                    et.getTema().getId(),
                    et.getEntregable().getNombre(),
                    estadoEntregable,
                    estadoXTema,
                    et.getFechaEnvio() != null ? et.getFechaEnvio().toLocalDateTime() : null,
                    notaGlobal,
                    esEvaluable,
                    criterios,
                    revisionId,
                    estadoRevision
                );
            })
            .collect(Collectors.toList());
    }



    @Override
    public List<EntregableCriteriosDetalleDto> getEntregablesConCriterios(String cognitoSub) {

        Integer idUsuario = usuarioService.findByCognitoId(cognitoSub).getId();

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
                    .fechaFin(r[3] != null
                            ? ((java.time.Instant) r[3]).atOffset(java.time.ZoneOffset.UTC)
                            : null)
                    .notaGlobal(r[4] != null
                            ? ((Number) r[4]).doubleValue()
                            : null)
                    .estadoEntrega((String) r[5])
                    .criterios(new ArrayList<>())
                    .etapaFormativaXCicloId(r[10] != null ? (Integer) r[10] : null)
                    .esEvaluable(r[11] != null ? (Boolean) r[11] : null)
                    .build()
            );
            if (r[6] != null) {
                EntregableCriteriosDetalleDto e = map.get(id);
                e.getCriterios().add(
                        CriterioEntregableDetalleDto.builder()
                                .criterioId((Integer) r[6])
                                .criterioNombre((String) r[7])
                                .notaMaxima(r[8] != null
                                        ? ((Number) r[8]).doubleValue()
                                        : null)
                                .notaCriterio(r[9] != null
                                        ? ((Number) r[9]).doubleValue()
                                        : null)
                                .build()
                );
            }
        }
        return new ArrayList<>(map.values());
    }

    @Override
    public RevisionDocumentoDto getEstadoRevisionPorEntregable(Integer entregableXTemaId) {

        // 1) Última versión que pertenece a este entregable-tema
        VersionXDocumento version = versionXDocumentoRepository
                .findTopByEntregableXTema_EntregableXTemaIdOrderByFechaCreacionDesc(entregableXTemaId)
                .orElse(null);

        if (version == null) {
            return null;           // No hay versión o no tiene revisión ligada
        }

        // 2) Revisión asociada a esa versión
        RevisionDocumento revision = revisionDocumentoRepository
                .findTopByVersionDocumento_IdOrderByFechaCreacionDesc(version.getId())
                .orElse(null);

        if (revision == null) {
            return null;
        }

        // 3) Construir y devolver el DTO
        return new RevisionDocumentoDto(
                revision.getId(),
                revision.getUsuario().getId(),
                revision.getVersionDocumento().getId(),
                revision.getFechaLimiteRevision(),
                revision.getFechaRevision(),
                revision.getEstadoRevision().name().toLowerCase(),
                revision.getLinkArchivoRevision(),
                revision.getActivo(),
                revision.getFechaCreacion(),
                revision.getFechaModificacion()
        );
    }


}
