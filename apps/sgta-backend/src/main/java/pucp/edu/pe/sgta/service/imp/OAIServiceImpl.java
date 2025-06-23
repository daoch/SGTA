package pucp.edu.pe.sgta.service.imp;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import pucp.edu.pe.sgta.dto.CarreraDto;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.dto.oai.OAIEndpointDto;
import pucp.edu.pe.sgta.dto.oai.OAIRecordDto;
import pucp.edu.pe.sgta.dto.oai.OAISetDto;
import pucp.edu.pe.sgta.model.EstadoTema;
import pucp.edu.pe.sgta.model.Carrera;
import pucp.edu.pe.sgta.model.SubAreaConocimiento;
import pucp.edu.pe.sgta.model.AreaConocimiento;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.model.Ciclo;
import pucp.edu.pe.sgta.model.Tema;
import pucp.edu.pe.sgta.model.TipoUsuario;
import pucp.edu.pe.sgta.model.UsuarioXTema;
import pucp.edu.pe.sgta.model.EtapaFormativaXCicloXTema;
import pucp.edu.pe.sgta.model.EtapaFormativaXCiclo;
import pucp.edu.pe.sgta.model.EtapaFormativa;
import pucp.edu.pe.sgta.model.Rol;
import pucp.edu.pe.sgta.repository.EstadoTemaRepository;
import pucp.edu.pe.sgta.repository.CarreraRepository;
import pucp.edu.pe.sgta.repository.SubAreaConocimientoRepository;
import pucp.edu.pe.sgta.repository.AreaConocimientoRepository;
import pucp.edu.pe.sgta.repository.UsuarioRepository;
import pucp.edu.pe.sgta.repository.CicloRepository;
import pucp.edu.pe.sgta.repository.TemaRepository;
import pucp.edu.pe.sgta.repository.TipoUsuarioRepository;
import pucp.edu.pe.sgta.repository.UsuarioXTemaRepository;
import pucp.edu.pe.sgta.repository.EtapaFormativaXCicloXTemaRepository;
import pucp.edu.pe.sgta.repository.EtapaFormativaXCicloRepository;
import pucp.edu.pe.sgta.repository.EtapaFormativaRepository;
import pucp.edu.pe.sgta.repository.RolRepository;
import pucp.edu.pe.sgta.service.inter.OAIService;
import pucp.edu.pe.sgta.service.inter.TemaService;
import pucp.edu.pe.sgta.util.RolEnum;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;
import org.springframework.scheduling.annotation.Async;

@Service
public class OAIServiceImpl implements OAIService {

    private static final Logger logger = Logger.getLogger(OAIServiceImpl.class.getName());

    // Constants for OAI integration
    private static final String ERROR_KEY = "error";
    private static final String MESSAGE_KEY = "message";
    private static final String DATA_KEY = "data";
    private static final String ENDPOINT_KEY = "oai_base_url";
    private static final String SETS_KEY = "sets";
    private static final String RECORDS_KEY = "records";
    private static final String IMPORTED_KEY = "imported";
    private static final String FAILED_KEY = "failed";
    private static final String IDENTIFIER_KEY = "identifier";
    private static final String CREATOR_KEY = "creator";
    private static final String CONTRIBUTOR_KEY = "contributor";
    private static final String SET_SPEC_KEY = "setSpec";
    private static final String OAI_PMH_IDENTIFIER = "OAI-PMH";    
    private final RestTemplate restTemplate;
    private final TemaService temaService;
    private final EstadoTemaRepository estadoTemaRepository;
    private final CarreraRepository carreraRepository;
    private final SubAreaConocimientoRepository subAreaConocimientoRepository;
    private final AreaConocimientoRepository areaConocimientoRepository;
    private final UsuarioRepository usuarioRepository;
    private final TipoUsuarioRepository tipoUsuarioRepository;
    private final CicloRepository cicloRepository;    private final UsuarioXTemaRepository usuarioXTemaRepository;
    private final EtapaFormativaXCicloXTemaRepository etapaFormativaXCicloXTemaRepository;
    private final EtapaFormativaXCicloRepository etapaFormativaXCicloRepository;    private final EtapaFormativaRepository etapaFormativaRepository;
    private final RolRepository rolRepository;
    private final TemaRepository temaRepository;

    @Value("${sbert.microservice.url:http://localhost:8000}")
    private String sbertServiceUrl;

    private String currentOAIEndpoint = null;
    
    // In-memory storage for async tasks (in production, use Redis or database)
    private final Map<String, AsyncImportTask> asyncImportTasks = new ConcurrentHashMap<>();    public OAIServiceImpl(RestTemplate restTemplate, TemaService temaService, 
                         EstadoTemaRepository estadoTemaRepository, CarreraRepository carreraRepository,
                         SubAreaConocimientoRepository subAreaConocimientoRepository,
                         AreaConocimientoRepository areaConocimientoRepository,
                         UsuarioRepository usuarioRepository, TipoUsuarioRepository tipoUsuarioRepository,
                         CicloRepository cicloRepository, UsuarioXTemaRepository usuarioXTemaRepository,
                         EtapaFormativaXCicloXTemaRepository etapaFormativaXCicloXTemaRepository,
                         EtapaFormativaXCicloRepository etapaFormativaXCicloRepository,
                         EtapaFormativaRepository etapaFormativaRepository,
                         RolRepository rolRepository,
                         TemaRepository temaRepository) {
        this.restTemplate = restTemplate;
        this.temaService = temaService;
        this.estadoTemaRepository = estadoTemaRepository;
        this.carreraRepository = carreraRepository;
        this.subAreaConocimientoRepository = subAreaConocimientoRepository;
        this.areaConocimientoRepository = areaConocimientoRepository;
        this.usuarioRepository = usuarioRepository;
        this.tipoUsuarioRepository = tipoUsuarioRepository;
        this.cicloRepository = cicloRepository;
        this.usuarioXTemaRepository = usuarioXTemaRepository;
        this.etapaFormativaXCicloXTemaRepository = etapaFormativaXCicloXTemaRepository;        this.etapaFormativaXCicloRepository = etapaFormativaXCicloRepository;
        this.etapaFormativaRepository = etapaFormativaRepository;
        this.rolRepository = rolRepository;
        this.temaRepository = temaRepository;
    }@Override
    public Map<String, Object> configureOAIEndpoint(String endpoint) {
        try {
            if (logger.isLoggable(java.util.logging.Level.INFO)) {
                logger.info("Configuring OAI-PMH endpoint: " + endpoint);
            }

            // Validate the endpoint by making a test request
            if (!isValidOAIEndpoint(endpoint)) {
                return Map.of(
                    ERROR_KEY, "Invalid OAI-PMH endpoint or endpoint is not accessible"
                );
            }

            // Set the endpoint via SBERT service
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> requestBody = Map.of(ENDPOINT_KEY, endpoint);
            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

            String configEndpoint = sbertServiceUrl + "/oai/config/endpoint";
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                configEndpoint,
                HttpMethod.PUT,
                request,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<String, Object> responseBody = response.getBody();

            if ( responseBody != null ) {
                this.currentOAIEndpoint = endpoint;
                if (logger.isLoggable(java.util.logging.Level.INFO)) {
                    logger.info("Successfully configured OAI endpoint: " + endpoint);
                }
                
                return Map.of(
                    MESSAGE_KEY, "OAI-PMH endpoint configured successfully",
                    ENDPOINT_KEY, endpoint
                );
            } else {
                return Map.of(
                    ERROR_KEY, "Failed to configure OAI-PMH endpoint",
                    DATA_KEY, responseBody
                );
            }

        } catch (Exception e) {
            logger.severe("Error configuring OAI endpoint: " + e.getMessage());
            return Map.of(
                ERROR_KEY, "Error configuring OAI-PMH endpoint",
                MESSAGE_KEY, e.getMessage()
            );
        }
    }

    @Override
    public OAIEndpointDto getCurrentOAIEndpoint() {
        try {
            String getEndpoint = sbertServiceUrl + "/oai/config/endpoint";
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                getEndpoint,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<String, Object> responseBody = response.getBody();

            if (responseBody != null) {
                String endpoint = (String) responseBody.get("current_oai_base_url");
                this.currentOAIEndpoint = endpoint;
                
                return new OAIEndpointDto(
                    endpoint,
                        (String) responseBody.get("message"),
                    endpoint != null && !endpoint.isEmpty()
                );
            }

            return new OAIEndpointDto(null, "No OAI-PMH endpoint configured", false);

        } catch (Exception e) {
            logger.warning("Error getting current OAI endpoint: " + e.getMessage());
            return new OAIEndpointDto(null, "Error retrieving OAI endpoint: " + e.getMessage(), false);
        }
    }

    @Override
    public List<OAISetDto> getOAISets() {
        try {
            if (currentOAIEndpoint == null) {
                getCurrentOAIEndpoint(); // Try to load current endpoint
            }

            String getSetsEndpoint = sbertServiceUrl + "/oai/sets";
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                getSetsEndpoint,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<String, Object> responseBody = response.getBody();

            if (responseBody != null && responseBody.containsKey(SETS_KEY)) {
                @SuppressWarnings("unchecked")
                List<Map<String, String>> setsData = (List<Map<String, String>>) responseBody.get(SETS_KEY);
                  return setsData.stream()
                    .map(setData -> new OAISetDto(
                        setData.get(SET_SPEC_KEY),
                        setData.get("setName"),
                        setData.get("setDescription")
                    ))
                    .toList();
            }

            logger.warning("No sets found in OAI response");
            return Collections.emptyList();

        } catch (Exception e) {
            logger.severe("Error retrieving OAI sets: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    public List<OAIRecordDto> getRecordsBySet(String setSpec) {
        // Legacy method - calls the new paginated method without pagination
        Map<String, Object> result = getRecordsBySet(setSpec, null, null, false, "oai_dc");
        @SuppressWarnings("unchecked")
        List<OAIRecordDto> records = (List<OAIRecordDto>) result.get(RECORDS_KEY);
        return records != null ? records : Collections.emptyList();
    }

    @Override
    public Map<String, Object> getRecordsBySet(String setSpec, Integer limit, Integer offset, Boolean includeTotalCount, String metadataPrefix) {
        try {
            if (currentOAIEndpoint == null) {
                getCurrentOAIEndpoint(); // Try to load current endpoint
            }

            StringBuilder urlBuilder = new StringBuilder(sbertServiceUrl + "/oai/records/set/" + setSpec);
            List<String> params = new ArrayList<>();
            
            if (limit != null) {
                params.add("limit=" + limit);
            }
            if (offset != null) {
                params.add("offset=" + offset);
            }
            if (includeTotalCount != null && includeTotalCount) {
                params.add("include_total_count=true");
            }
            if (metadataPrefix != null && !metadataPrefix.equals("oai_dc")) {
                params.add("metadata_prefix=" + metadataPrefix);
            }
            
            if (!params.isEmpty()) {
                urlBuilder.append("?").append(String.join("&", params));
            }

            String getRecordsEndpoint = urlBuilder.toString();
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                getRecordsEndpoint,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<String, Object> responseBody = response.getBody();
            Map<String, Object> result = new HashMap<>();
            
            if (responseBody != null && responseBody.containsKey(RECORDS_KEY)) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> recordsData = (List<Map<String, Object>>) responseBody.get(RECORDS_KEY);
                
                List<OAIRecordDto> records = recordsData.stream()
                    .map(this::mapToOAIRecord)
                    .toList();
                
                result.put(RECORDS_KEY, records);
                result.put("total_records_harvested", responseBody.get("total_records_harvested"));
                
                // Include pagination metadata if available
                if (responseBody.containsKey("total_available")) {
                    result.put("total_available", responseBody.get("total_available"));
                }
                if (responseBody.containsKey("has_more")) {
                    result.put("has_more", responseBody.get("has_more"));
                }
                if (responseBody.containsKey("offset")) {
                    result.put("offset", responseBody.get("offset"));
                }
                if (responseBody.containsKey("limit")) {
                    result.put("limit", responseBody.get("limit"));
                }
                
                return result;
            }

            if (logger.isLoggable(java.util.logging.Level.WARNING)) {
                logger.warning("No records found for set: " + setSpec);
            }
            
            result.put(RECORDS_KEY, Collections.emptyList());
            result.put("total_records_harvested", 0);
            return result;

        } catch (Exception e) {
            logger.severe("Error retrieving records for set " + setSpec + ": " + e.getMessage());
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put(RECORDS_KEY, Collections.emptyList());
            errorResult.put(ERROR_KEY, e.getMessage());
            return errorResult;
        }
    }

    @Override
    public Map<String, Object> importRecordsAsTemas(String setSpec, Integer carreraId) {
        try {
            if (logger.isLoggable(java.util.logging.Level.INFO)) {
                logger.info("Starting import of records from set: " + setSpec + " for carrera: " + carreraId);
            }

            // Validate carrera exists
            Optional<Carrera> carreraOpt = carreraRepository.findById(carreraId);
            if (carreraOpt.isEmpty()) {
                return Map.of(
                    ERROR_KEY, "Carrera not found with ID: " + carreraId
                );
            }

            // Get FINALIZADO state
            Optional<EstadoTema> estadoFinalizadoOpt = estadoTemaRepository.findByNombre("FINALIZADO");
            if (estadoFinalizadoOpt.isEmpty()) {
                return Map.of(
                    ERROR_KEY, "FINALIZADO state not found. Please ensure the database is properly initialized."
                );
            }

            // Get records from the set
            List<OAIRecordDto> records = getRecordsBySet(setSpec);
            if (records.isEmpty()) {
                return Map.of(
                    MESSAGE_KEY, "No records found in set: " + setSpec,
                    IMPORTED_KEY, 0,
                    FAILED_KEY, 0
                );
            }

            Carrera carrera = carreraOpt.get();
            
            int importedCount = 0;
            int failedCount = 0;
            List<String> errors = new ArrayList<>();

            for (OAIRecordDto oaiRecord : records) {
                ImportResult result = importSingleRecord(oaiRecord, carrera.getId());
                if (result.isSuccess()) {
                    importedCount++;
                    if (logger.isLoggable(java.util.logging.Level.INFO)) {
                        logger.info("Successfully imported tema with ID: " + result.getTemaId() + 
                                   " from record: " + oaiRecord.getIdentifier());
                    }
                } else {
                    failedCount++;
                    errors.add(result.getErrorMessage());
                }
            }

            if (logger.isLoggable(java.util.logging.Level.INFO)) {
                logger.info("Import completed. Imported: " + importedCount + ", Failed: " + failedCount);
            }

            Map<String, Object> result = new HashMap<>();
            result.put(MESSAGE_KEY, "Import process completed");
            result.put(IMPORTED_KEY, importedCount);
            result.put(FAILED_KEY, failedCount);
            result.put("totalRecords", records.size());
            result.put(SET_SPEC_KEY, setSpec);
            result.put("carreraId", carreraId);
            
            if (!errors.isEmpty()) {
                result.put("errors", errors);
            }

            return result;

        } catch (Exception e) {
            logger.severe("Error during import process: " + e.getMessage());
            return Map.of(
                ERROR_KEY, "Error during import process",
                MESSAGE_KEY, e.getMessage()
            );
        }
    }

    @Override
    public Map<String, Object> getRecordCount(String setSpec, String metadataPrefix, Boolean forceRefresh) {
        try {
            if (currentOAIEndpoint == null) {
                getCurrentOAIEndpoint(); // Try to load current endpoint
            }

            StringBuilder urlBuilder = new StringBuilder(sbertServiceUrl + "/oai/records/count/" + setSpec);
            List<String> params = new ArrayList<>();
            
            if (metadataPrefix != null && !metadataPrefix.equals("oai_dc")) {
                params.add("metadata_prefix=" + metadataPrefix);
            }
            if (forceRefresh != null && forceRefresh) {
                params.add("force_refresh=true");
            }
            
            if (!params.isEmpty()) {
                urlBuilder.append("?").append(String.join("&", params));
            }

            String getCountEndpoint = urlBuilder.toString();
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                getCountEndpoint,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null) {
                return responseBody;
            }

            return Map.of(
                ERROR_KEY, "Failed to get record count for set: " + setSpec
            );

        } catch (Exception e) {
            logger.severe("Error getting record count for set " + setSpec + ": " + e.getMessage());
            return Map.of(
                ERROR_KEY, "Error getting record count",
                MESSAGE_KEY, e.getMessage()
            );
        }
    }

    @Override
    public Map<String, Object> startAsyncImport(String setSpec, Integer carreraId, String metadataPrefix) {
        try {
            if (logger.isLoggable(java.util.logging.Level.INFO)) {
                logger.info("Starting async import of records from set: " + setSpec + " for carrera: " + carreraId);
            }

            // Validate carrera exists first
            Optional<Carrera> carreraOpt = carreraRepository.findById(carreraId);
            if (carreraOpt.isEmpty()) {
                return Map.of(
                    ERROR_KEY, "Carrera not found with ID: " + carreraId
                );
            }

            // Get FINALIZADO state
            Optional<EstadoTema> estadoFinalizadoOpt = estadoTemaRepository.findByNombre("FINALIZADO");
            if (estadoFinalizadoOpt.isEmpty()) {
                return Map.of(
                    ERROR_KEY, "FINALIZADO state not found. Please ensure the database is properly initialized."
                );
            }

            // Generate a unique task ID
            String taskId = java.util.UUID.randomUUID().toString();
            
            // Create async task info
            AsyncImportTask task = new AsyncImportTask(
                taskId, setSpec, carreraId, metadataPrefix, "queued", 
                OffsetDateTime.now(), null, null, 0.0, 0, 0, null, null, null
            );
            
            // Store task in memory (in production, use Redis or database)
            asyncImportTasks.put(taskId, task);
            
            // Start async processing
            processAsyncImportInBackground(taskId, setSpec, carreraId, metadataPrefix);
            
            return Map.of(
                "success", true,
                MESSAGE_KEY, "Import task started successfully",
                "task_id", taskId,
                "status", "queued"
            );

        } catch (Exception e) {
            logger.severe("Error starting async import for set " + setSpec + ": " + e.getMessage());
            return Map.of(
                ERROR_KEY, "Error starting async import",
                MESSAGE_KEY, e.getMessage()
            );
        }
    }

    @Override
    public Map<String, Object> getAsyncImportStatus(String taskId) {
        try {
            AsyncImportTask task = asyncImportTasks.get(taskId);
            if (task == null) {
                return Map.of(
                    ERROR_KEY, "Task not found with ID: " + taskId
                );
            }
            
            Map<String, Object> taskInfo = new HashMap<>();
            taskInfo.put("task_id", task.getTaskId());
            taskInfo.put("set_spec", task.getSetSpec());
            taskInfo.put("carrera_id", task.getCarreraId());
            taskInfo.put("metadata_prefix", task.getMetadataPrefix());
            taskInfo.put("status", task.getStatus());
            taskInfo.put("created_at", task.getCreatedAt().toString());
            if (task.getStartedAt() != null) {
                taskInfo.put("started_at", task.getStartedAt().toString());
            }
            if (task.getCompletedAt() != null) {
                taskInfo.put("completed_at", task.getCompletedAt().toString());
            }
            taskInfo.put("progress", task.getProgress());
            taskInfo.put("imported_count", task.getImportedCount());
            taskInfo.put("processed_records", task.getProcessedRecords());
            if (task.getTotalRecords() != null) {
                taskInfo.put("total_records", task.getTotalRecords());
            }
            if (task.getMessage() != null) {
                taskInfo.put(MESSAGE_KEY, task.getMessage());
            }
            if (task.getError() != null) {
                taskInfo.put(ERROR_KEY, task.getError());
            }
            
            return Map.of(
                "success", true,
                "task_info", taskInfo
            );

        } catch (Exception e) {
            logger.severe("Error getting async import status for task " + taskId + ": " + e.getMessage());
            return Map.of(
                ERROR_KEY, "Error getting import status",
                MESSAGE_KEY, e.getMessage()
            );
        }
    }

    @Override
    public Map<String, Object> getOAIStatistics() {
        try {
            OAIEndpointDto currentEndpoint = getCurrentOAIEndpoint();
            List<OAISetDto> sets = getOAISets();

            Map<String, Object> statistics = new HashMap<>();
            statistics.put("endpointConfigured", currentEndpoint.getDescription());
            statistics.put("currentEndpoint", currentEndpoint.getEndpoint());
            statistics.put("totalSets", sets.size());
            statistics.put("availableSets", sets);
            statistics.put("lastUpdated", OffsetDateTime.now());

            return Map.of(
                DATA_KEY, statistics
            );

        } catch (Exception e) {
            logger.severe("Error getting OAI statistics: " + e.getMessage());
            return Map.of(
                ERROR_KEY, "Error retrieving OAI statistics",
                MESSAGE_KEY, e.getMessage()
            );
        }
    }    // Helper methods

    private ImportResult importSingleRecord(OAIRecordDto oaiRecord, Integer carreraId) {
        try {
            TemaDto temaDto = mapOAIRecordToTema(oaiRecord, carreraId);
            // Create the tema with FINALIZADO status
            Integer temaId = temaService.createTemaFromOAI(temaDto, carreraId);
            
            if (temaId != null) {
                // Get the created tema
                Optional<Tema> temaOpt = temaRepository.findById(temaId);
                if (temaOpt.isPresent()) {
                    Tema tema = temaOpt.get();
                    
                    // Create all related entities using OAI data
                    createRelatedEntitiesFromOAI(tema, oaiRecord, carreraId);
                }
                
                return new ImportResult(true, temaId, null);
            } else {
                return new ImportResult(false, null, "Failed to create tema from record: " + oaiRecord.getIdentifier());
            }
            
        } catch (Exception e) {
            String errorMsg = "Error importing record " + oaiRecord.getIdentifier() + ": " + e.getMessage();
            if (logger.isLoggable(java.util.logging.Level.WARNING)) {
                logger.warning(errorMsg);
            }
            return new ImportResult(false, null, errorMsg);
        }
    }
    
    private void createRelatedEntitiesFromOAI(Tema tema, OAIRecordDto oaiRecord, Integer carreraId) {
        try {
            if (oaiRecord.getMetadata() == null) {
                return;
            }
            
            OAIRecordDto.OAIMetadataDto metadata = oaiRecord.getMetadata();
            
            // 1. Create Ciclo based on fecha_finalizacion from OAI date
            if (metadata.getDate() != null) {
                Ciclo ciclo = createOrGetCicloFromOAIDate(metadata.getDate());
                if (ciclo != null) {
                    createEtapaFormativaXCicloXTema(tema, ciclo);
                }
            }
            
            // 2. Create SubAreaConocimiento from OAI subjects
            if (metadata.getSubject() != null && !metadata.getSubject().isEmpty()) {
                for (String subject : metadata.getSubject()) {
                    // Skip URLs (like OCDE classifications)
                    if (!subject.startsWith("http")) {
                        SubAreaConocimiento subArea = createOrGetSubAreaConocimientoFromOAI(subject, carreraId);
                        if (subArea != null) {
                            createTemaSubAreaConocimientoRelation(tema, subArea);
                        }
                    }
                }
            }
            
            // 3. Create usuarios from OAI creators (tesistas)
            if (metadata.getCreator() != null && !metadata.getCreator().isEmpty()) {
                for (String creatorName : metadata.getCreator()) {
                    Usuario tesista = createOrGetUsuarioFromOAIName(creatorName, "alumno");
                    if (tesista != null) {
                        createUsuarioXTemaRelation(tema, tesista, "Tesista");
                    }
                }
            }
            
            // 4. Create usuarios from OAI contributors (asesores)
            if (metadata.getContributor() != null && !metadata.getContributor().isEmpty()) {
                for (int i = 0; i < metadata.getContributor().size(); i++) {
                    String contributorName = metadata.getContributor().get(i);
                    String roleName = (i == 0) ? "Asesor" : "Coasesor";
                    
                    Usuario asesor = createOrGetUsuarioFromOAIName(contributorName, roleName);
                    if (asesor != null) {
                        createUsuarioXTemaRelation(tema, asesor, roleName);
                    }
                }
            }
            
        } catch (Exception e) {
            logger.warning("Error creating related entities for tema " + tema.getId() + ": " + e.getMessage());
        }
    }
      private Ciclo createOrGetCicloFromOAIDate(String oaiDate) {
        try {
            // OAI date format: "2023-11-28T19:37:03Z"
            OffsetDateTime fechaFinalizacion = OffsetDateTime.parse(oaiDate);
            int year = fechaFinalizacion.getYear();
            int month = fechaFinalizacion.getMonthValue();
            
            // Determine semester: 1-6 = first half (1), 7-12 = second half (2)
            String semestre = (month <= 6) ? "1" : "2";
            
            // Try to find existing ciclo by year and semester manually
            List<Ciclo> existingCiclos = cicloRepository.findAll();
            for (Ciclo ciclo : existingCiclos) {
                if (ciclo.getAnio().equals(year) && ciclo.getSemestre().equals(semestre)) {
                    return ciclo;
                }
            }
            
            // Create new ciclo
            Ciclo nuevoCiclo = new Ciclo();
            nuevoCiclo.setSemestre(semestre);
            nuevoCiclo.setAnio(year);
            nuevoCiclo.setActivo(true);
            
            // Set semester dates
            if (semestre.equals("1")) {
                nuevoCiclo.setFechaInicio(java.time.LocalDate.of(year, 3, 1));
                nuevoCiclo.setFechaFin(java.time.LocalDate.of(year, 7, 31));
            } else {
                nuevoCiclo.setFechaInicio(java.time.LocalDate.of(year, 8, 1));
                nuevoCiclo.setFechaFin(java.time.LocalDate.of(year, 12, 31));
            }
            
            return cicloRepository.save(nuevoCiclo);
            
        } catch (Exception e) {
            logger.warning("Error creating ciclo from OAI date " + oaiDate + ": " + e.getMessage());
            return null;
        }
    }
      private SubAreaConocimiento createOrGetSubAreaConocimientoFromOAI(String subjectName, Integer carreraId) {
        try {
            if (subjectName == null || subjectName.trim().isEmpty()) {
                return null;
            }
            
            String normalizedName = subjectName.trim();
            
            // Try to find existing SubAreaConocimiento by name using existing method
            List<SubAreaConocimiento> existing = subAreaConocimientoRepository.findByNombreContainingIgnoreCaseAndActivoIsTrue(normalizedName);
            if (!existing.isEmpty()) {
                return existing.get(0);
            }
            
            // Get carrera to determine area
            Optional<Carrera> carreraOpt = carreraRepository.findById(carreraId);
            if (carreraOpt.isEmpty()) {
                return null;
            }
            
            Carrera carrera = carreraOpt.get();
            
            // Find or create AreaConocimiento based on carrera
            AreaConocimiento areaConocimiento = createOrGetAreaConocimientoFromCarrera(carrera);
            if (areaConocimiento == null) {
                return null;
            }
            
            // Create new SubAreaConocimiento
            SubAreaConocimiento nuevaSubArea = new SubAreaConocimiento();
            nuevaSubArea.setNombre(normalizedName);
            nuevaSubArea.setDescripcion("Área de conocimiento extraída de registro OAI-PMH");
            nuevaSubArea.setAreaConocimiento(areaConocimiento);
            nuevaSubArea.setActivo(true);
            
            return subAreaConocimientoRepository.save(nuevaSubArea);
            
        } catch (Exception e) {
            logger.warning("Error creating SubAreaConocimiento from OAI subject " + subjectName + ": " + e.getMessage());
            return null;
        }
    }    private AreaConocimiento createOrGetAreaConocimientoFromCarrera(Carrera carrera) {
        try {
            String areaName = "Área de " + carrera.getNombre();
            
            // Try to find existing area by searching all areas linked to this carrera
            List<AreaConocimiento> allAreas = areaConocimientoRepository.findAll();
            for (AreaConocimiento area : allAreas) {
                if (area.getCarrera() != null && area.getCarrera().getId().equals(carrera.getId())) {
                    return area;
                }
            }
            
            // Create new AreaConocimiento
            AreaConocimiento nuevaArea = new AreaConocimiento();
            nuevaArea.setNombre(areaName);
            nuevaArea.setDescripcion("Área de conocimiento para " + carrera.getNombre());
            nuevaArea.setCarrera(carrera); // Set the carrera entity, not carrera_id
            nuevaArea.setActivo(true);
            
            return areaConocimientoRepository.save(nuevaArea);
            
        } catch (Exception e) {
            logger.warning("Error creating AreaConocimiento for carrera " + carrera.getNombre() + ": " + e.getMessage());
            return null;
        }
    }
      private Usuario createOrGetUsuarioFromOAIName(String fullName, String expectedRole) {
        try {
            if (fullName == null || fullName.trim().isEmpty()) {
                return null;
            }
            
            // Parse OAI name format: "Apellido, Nombre" or "Apellido Apellido, Nombre Nombre"
            String[] nameParts = parseOAIFullName(fullName.trim());
            String nombres = nameParts[0];
            String primerApellido = nameParts[1];
            String segundoApellido = nameParts[2];
            
            // Check if usuario already exists by searching all users
            List<Usuario> allUsers = usuarioRepository.findAll();
            for (Usuario user : allUsers) {
                if (user.getNombres().equalsIgnoreCase(nombres) && 
                    user.getPrimerApellido().equalsIgnoreCase(primerApellido) &&
                    (segundoApellido.isEmpty() || user.getSegundoApellido().equalsIgnoreCase(segundoApellido))) {
                    return user;
                }
            }
            
            // Get appropriate TipoUsuario for the role
            Optional<TipoUsuario> tipoUsuarioOpt = tipoUsuarioRepository.findByNombre(expectedRole);
            if (tipoUsuarioOpt.isEmpty()) {
                logger.warning("TipoUsuario not found: " + expectedRole);
                return null;
            }
            
            // Create new usuario with OAI data
            Usuario nuevoUsuario = new Usuario();
            nuevoUsuario.setNombres(nombres);
            nuevoUsuario.setPrimerApellido(primerApellido);
            nuevoUsuario.setSegundoApellido(segundoApellido);
            nuevoUsuario.setCorreoElectronico(generateEmailFromOAIName(nombres, primerApellido));
            nuevoUsuario.setContrasena("imported_from_oai"); // Default password
            nuevoUsuario.setTipoUsuario(tipoUsuarioOpt.get());
            nuevoUsuario.setActivo(true);
            
            return usuarioRepository.save(nuevoUsuario);
            
        } catch (Exception e) {
            logger.warning("Error creating Usuario from OAI name " + fullName + ": " + e.getMessage());
            return null;
        }
    }
    
    private String[] parseOAIFullName(String fullName) {
        String nombres = "";
        String primerApellido = "";
        String segundoApellido = "";
        
        if (fullName.contains(",")) {
            // Format: "Apellido1 Apellido2, Nombre1 Nombre2"
            String[] parts = fullName.split(",", 2);
            String apellidosPart = parts[0].trim();
            String nombresPart = parts.length > 1 ? parts[1].trim() : "";
            
            // Split apellidos
            String[] apellidos = apellidosPart.split("\\s+");
            primerApellido = apellidos[0];
            segundoApellido = apellidos.length > 1 ? apellidos[1] : "";
            
            // Use nombres part
            nombres = nombresPart;
        } else {
            // Fallback: assume "Nombre Apellido" format
            String[] parts = fullName.split("\\s+");
            if (parts.length >= 2) {
                nombres = parts[0];
                primerApellido = parts[1];
                segundoApellido = parts.length > 2 ? parts[2] : "";
            } else {
                nombres = fullName;
                primerApellido = "Apellido";
                segundoApellido = "";
            }
        }
        
        return new String[]{nombres, primerApellido, segundoApellido};
    }
    
    private String generateEmailFromOAIName(String nombres, String primerApellido) {
        String baseEmail = (nombres.toLowerCase() + "." + primerApellido.toLowerCase())
            .replaceAll("[^a-z.]", "")
            .replaceAll("\\.+", ".");
        return baseEmail + "@pucp.edu.pe";
    }    
    
    private void createUsuarioXTemaRelation(Tema tema, Usuario usuario, String roleName) {
        try {
            // Check if relationship already exists by searching existing relations
            Optional<UsuarioXTema> existingRelation = usuarioXTemaRepository.findByTemaIdAndUsuarioIdAndActivoTrue(tema.getId(), usuario.getId());
            if (existingRelation.isPresent()) {
                return;
            }
            
            // Convert roleName to proper RolEnum format if needed
            String normalizedRoleName = normalizeRoleName(roleName);
            
            // Find the Rol entity by name
            Rol rol = rolRepository.findByNombre(normalizedRoleName)
                .orElseThrow(() -> new RuntimeException("Rol '" + normalizedRoleName + "' no encontrado"));
            
            UsuarioXTema usuarioTema = new UsuarioXTema();
            usuarioTema.setTema(tema);
            usuarioTema.setUsuario(usuario);
            usuarioTema.setRol(rol);
            usuarioTema.setAsignado(true);
            usuarioTema.setRechazado(false);
            usuarioTema.setCreador(roleName.equals("Tesista"));
            usuarioTema.setActivo(true);
            usuarioTema.setFechaCreacion(OffsetDateTime.now());
            
            usuarioXTemaRepository.save(usuarioTema);
            
        } catch (Exception e) {
            logger.warning("Error creating UsuarioXTema relation: " + e.getMessage());
        }
    }
    
    /**
     * Normalizes role names to match the RolEnum values
     */
    private String normalizeRoleName(String roleName) {
        if (roleName == null) return "Tesista";
        
        switch (roleName.toUpperCase()) {
            case "TESISTA":
                return RolEnum.Tesista.name();
            case "ASESOR":
                return RolEnum.Asesor.name();
            case "COASESOR":
                return RolEnum.Coasesor.name();
            case "JURADO":
                return RolEnum.Jurado.name();
            case "REVISOR":
                return RolEnum.Revisor.name();
            case "ALUMNO":
                return RolEnum.Alumno.name();
            default:
                return RolEnum.Tesista.name(); // Default fallback
        }
    }
    
    private void createTemaSubAreaConocimientoRelation(Tema tema, SubAreaConocimiento subArea) {
        try {
            // This would require a TemaXSubAreaConocimiento entity and repository
            // Since it's not clear if this exists, we'll just log for now
            logger.info("Would create TemaXSubAreaConocimiento relation for tema " + tema.getId() + " and subarea " + subArea.getId());
        } catch (Exception e) {
            logger.warning("Error creating TemaXSubAreaConocimiento relation: " + e.getMessage());
        }
    }    
    
    private void createEtapaFormativaXCicloXTema(Tema tema, Ciclo ciclo) {
        try {
            // First, ensure all existing etapas formativas have corresponding EtapaFormativaXCiclo entries for this ciclo
            ensureEtapaFormativaXCicloEntriesExist(ciclo, tema);
            
            // Find the best EtapaFormativaXCiclo for this ciclo (prefer final/sustentacion stages)
            List<EtapaFormativaXCiclo> allEtapaFormativas = etapaFormativaXCicloRepository.findAll();
            EtapaFormativaXCiclo etapaFormativaCiclo = null;
            EtapaFormativaXCiclo fallbackEtapa = null;
            
            for (EtapaFormativaXCiclo efc : allEtapaFormativas) {
                if (efc.getCiclo().getId().equals(ciclo.getId()) && Boolean.TRUE.equals(efc.getActivo())) {
                    fallbackEtapa = efc; // Any active etapa for this ciclo
                    
                    // Prefer final stages for OAI imported theses
                    String etapaNombre = efc.getEtapaFormativa().getNombre();
                    if (etapaNombre != null) {
                        String nombreLower = etapaNombre.toLowerCase();
                        if (nombreLower.contains("finalizacion") || 
                            nombreLower.contains("sustentacion") ||
                            nombreLower.contains("final") ||
                            nombreLower.contains("defensa")) {
                            etapaFormativaCiclo = efc;
                            break;
                        }
                    }
                }
            }
            
            // Use the preferred etapa or fallback
            if (etapaFormativaCiclo == null) {
                etapaFormativaCiclo = fallbackEtapa;
            }
            
            // If still no etapa formativa exists for this ciclo, create a placeholder one
            if (etapaFormativaCiclo == null) {
                etapaFormativaCiclo = createPlaceholderEtapaFormativaXCiclo(ciclo);
                if (etapaFormativaCiclo == null) {
                    logger.warning("Could not create placeholder EtapaFormativaXCiclo for ciclo " + ciclo.getId());
                    return;
                }
            }
            
            // Check if relationship already exists
            List<EtapaFormativaXCicloXTema> allRelations = etapaFormativaXCicloXTemaRepository.findAll();
            for (EtapaFormativaXCicloXTema relation : allRelations) {
                if (relation.getTema().getId().equals(tema.getId()) && 
                    relation.getEtapaFormativaXCiclo().getId().equals(etapaFormativaCiclo.getId())) {
                    return; // Already exists
                }
            }
            
            EtapaFormativaXCicloXTema relacion = new EtapaFormativaXCicloXTema();
            relacion.setTema(tema);
            relacion.setEtapaFormativaXCiclo(etapaFormativaCiclo);
            relacion.setAprobado(true); // OAI temas are already finished/approved
            relacion.setActivo(true);
            
            etapaFormativaXCicloXTemaRepository.save(relacion);
            
        } catch (Exception e) {
            logger.warning("Error creating EtapaFormativaXCicloXTema relation: " + e.getMessage());
        }
    }
      /**
     * Ensures that for each existing EtapaFormativa of the carrera, there is a corresponding
     * EtapaFormativaXCiclo entry for the given ciclo.
     */
    private void ensureEtapaFormativaXCicloEntriesExist(Ciclo ciclo, Tema tema) {
        try {
            // Get the carrera directly from the tema
            Carrera carrera = tema.getCarrera();
            
            if (carrera == null) {
                logger.warning("Cannot determine carrera for tema " + tema.getId() + " to ensure etapa formativa entries");
                return;
            }
            
            // Get all etapas formativas
            List<EtapaFormativa> allEtapasFormativas = etapaFormativaRepository.findAll();
            List<EtapaFormativaXCiclo> existingEtapasCiclo = etapaFormativaXCicloRepository.findAll();
            
            // For each etapa formativa, check if there's a corresponding EtapaFormativaXCiclo for this ciclo
            for (EtapaFormativa etapa : allEtapasFormativas) {
                if (!Boolean.TRUE.equals(etapa.getActivo())) {
                    continue; // Skip inactive etapas
                }
                
                // Check if EtapaFormativaXCiclo already exists for this etapa and ciclo
                boolean exists = false;
                for (EtapaFormativaXCiclo efc : existingEtapasCiclo) {
                    if (efc.getEtapaFormativa().getId().equals(etapa.getId()) &&
                        efc.getCiclo().getId().equals(ciclo.getId())) {
                        exists = true;
                        break;
                    }
                }
                
                // If it doesn't exist, create it
                if (!exists) {
                    EtapaFormativaXCiclo newEtapaCiclo = new EtapaFormativaXCiclo();
                    newEtapaCiclo.setEtapaFormativa(etapa);
                    newEtapaCiclo.setCiclo(ciclo);
                    newEtapaCiclo.setEstado("En Curso"); // Default state for newly created entries
                    newEtapaCiclo.setActivo(true);
                    
                    etapaFormativaXCicloRepository.save(newEtapaCiclo);
                    String cicloDescription = ciclo.getAnio() + "-" + ciclo.getSemestre();
                    logger.info("Created missing EtapaFormativaXCiclo for etapa " + etapa.getNombre() + " and ciclo " + cicloDescription);
                }
            }
            
        } catch (Exception e) {
            logger.warning("Error ensuring EtapaFormativaXCiclo entries exist: " + e.getMessage());
        }
    }

    
      private EtapaFormativaXCiclo createPlaceholderEtapaFormativaXCiclo(Ciclo ciclo) {
        try {
            // Find or create a generic "Finalización" etapa formativa
            List<EtapaFormativa> allEtapas = etapaFormativaRepository.findAll();
            EtapaFormativa finalizacionEtapa = null;
            
            for (EtapaFormativa etapa : allEtapas) {
                if (etapa.getNombre() != null && 
                    (etapa.getNombre().toLowerCase().contains("finalizacion") || 
                     etapa.getNombre().toLowerCase().contains("sustentacion") ||
                     etapa.getNombre().toLowerCase().contains("final"))) {
                    finalizacionEtapa = etapa;
                    break;
                }
            }
            
            // If no suitable etapa formativa exists, create one
            if (finalizacionEtapa == null) {
                finalizacionEtapa = new EtapaFormativa();
                finalizacionEtapa.setNombre("Finalización de Tesis");
                finalizacionEtapa.setActivo(true);
                // Set creditaje as BigDecimal
                finalizacionEtapa.setCreditajePorTema(new java.math.BigDecimal("0.0"));
                finalizacionEtapa = etapaFormativaRepository.save(finalizacionEtapa);
            }
            
            // Create EtapaFormativaXCiclo
            EtapaFormativaXCiclo etapaFormativaCiclo = new EtapaFormativaXCiclo();
            etapaFormativaCiclo.setEtapaFormativa(finalizacionEtapa);
            etapaFormativaCiclo.setCiclo(ciclo);
            etapaFormativaCiclo.setEstado("Finalizado"); //Finished
            etapaFormativaCiclo.setActivo(true);
            
            return etapaFormativaXCicloRepository.save(etapaFormativaCiclo);
            
        } catch (Exception e) {
            logger.warning("Error creating placeholder EtapaFormativaXCiclo: " + e.getMessage());
            return null;
        }
    }

    private boolean isValidOAIEndpoint(String endpoint) {
        try {
            // Test the endpoint with a simple Identify request
            String identifyUrl = endpoint + "?verb=Identify";
            ResponseEntity<String> response = restTemplate.getForEntity(identifyUrl, String.class);
            
            String responseBody = response.getBody();
            return response.getStatusCode().is2xxSuccessful() && 
                   responseBody != null;
                   
        } catch (Exception e) {
            logger.warning("Invalid OAI endpoint " + endpoint + ": " + e.getMessage());
            return false;
        }
    }

    private OAIRecordDto mapToOAIRecord(Map<String, Object> recordData) {
        OAIRecordDto oaiRecord = new OAIRecordDto();
        oaiRecord.setIdentifier((String) recordData.get(IDENTIFIER_KEY));
        oaiRecord.setDatestamp((String) recordData.get("datestamp"));
          @SuppressWarnings("unchecked")
        List<String> setSpecs = (List<String>) recordData.get(SET_SPEC_KEY);
        oaiRecord.setSetSpec(setSpecs != null ? setSpecs : Collections.emptyList());

        // Map metadata
        @SuppressWarnings("unchecked")
        Map<String, Object> metadataMap = (Map<String, Object>) recordData.get("metadata");
        if (metadataMap != null) {
            OAIRecordDto.OAIMetadataDto metadata = new OAIRecordDto.OAIMetadataDto();
            List<String> titles = (List<String>) metadataMap.get("title");
            if (titles != null && !titles.isEmpty()) {
                metadata.setTitle(titles.get(0)); //we retrieve the first title if multiple exist
            }
            List<String> descriptions = (List<String>) metadataMap.get("description");
            metadata.setDescription(descriptions != null && !descriptions.isEmpty() ? descriptions.get(0) : null);

            List<String> publishers = (List<String>) metadataMap.get("publisher");
            metadata.setPublisher(publishers != null && !publishers.isEmpty() ? publishers.get(0) : null);

            List<String> dates = (List<String>) metadataMap.get("date");
            metadata.setDate(dates != null && !dates.isEmpty() ? dates.get(0) : null);

            List<String> types = (List<String>) metadataMap.get("type");
            metadata.setType(types != null && !types.isEmpty() ? types.get(0) : null);

            List<String> formats = (List<String>) metadataMap.get("format");
            metadata.setFormat(formats != null && !formats.isEmpty() ? formats.get(0) : null);

            List<String> identifiers = (List<String>) metadataMap.get(IDENTIFIER_KEY);
            metadata.setIdentifier(identifiers != null && !identifiers.isEmpty() ? identifiers.get(0) : null);

            List<String> sources = (List<String>) metadataMap.get("source");
            metadata.setSource(sources != null && !sources.isEmpty() ? sources.get(0) : null);

            List<String> languages = (List<String>) metadataMap.get("language");
            metadata.setLanguage(languages != null && !languages.isEmpty() ? languages.get(0) : null);

            List<String> relations = (List<String>) metadataMap.get("relation");
            metadata.setRelation(relations != null && !relations.isEmpty() ? relations.get(0) : null);

            List<String> coverages = (List<String>) metadataMap.get("coverage");
            metadata.setCoverage(coverages != null && !coverages.isEmpty() ? coverages.get(0) : null);

            List<String> rights = (List<String>) metadataMap.get("rights");
            metadata.setRights(rights != null && !rights.isEmpty() ? rights.get(0) : null);

            @SuppressWarnings("unchecked")
            List<String> creators = (List<String>) metadataMap.get(CREATOR_KEY);
            metadata.setCreator(creators != null ? creators : Collections.emptyList());

            @SuppressWarnings("unchecked")
            List<String> subjects = (List<String>) metadataMap.get("subject");
            metadata.setSubject(subjects != null ? subjects : Collections.emptyList());

            @SuppressWarnings("unchecked")
            List<String> contributors = (List<String>) metadataMap.get(CONTRIBUTOR_KEY);
            metadata.setContributor(contributors != null ? contributors : Collections.emptyList());

            oaiRecord.setMetadata(metadata);
        }

        return oaiRecord;
    }

    private TemaDto mapOAIRecordToTema(OAIRecordDto oaiRecord, Integer carreraId) {
        TemaDto tema = new TemaDto();
        
        // Map basic fields
        if (oaiRecord.getMetadata() != null) {
            OAIRecordDto.OAIMetadataDto metadata = oaiRecord.getMetadata();
            
            tema.setTitulo(metadata.getTitle() != null ? metadata.getTitle() : "Imported Topic");
            tema.setResumen(metadata.getDescription() != null ? metadata.getDescription() : "");

            // Set identifier if available
            if (metadata.getIdentifier() != null) {
                tema.setPortafolioUrl(metadata.getIdentifier());
            }


            OffsetDateTime odt = OffsetDateTime.parse(metadata.getDate());
            tema.setFechaFinalizacion(odt);
        }

        // Set carrera using CarreraDto
        CarreraDto carreraDto = new CarreraDto();
        carreraDto.setId(carreraId);
        tema.setCarrera(carreraDto);
        
        // Set as active
        tema.setActivo(true);
        
        // Set creation time
        tema.setFechaCreacion(OffsetDateTime.now());
        return tema;
    }

    @Async
    protected void processAsyncImportInBackground(String taskId, String setSpec, Integer carreraId, String metadataPrefix) {
        AsyncImportTask task = asyncImportTasks.get(taskId);
        if (task == null) {
            return;
        }
        
        try {
            // Update status to running
            task.setStatus("running");
            task.setStartedAt(OffsetDateTime.now());
            
            if (logger.isLoggable(java.util.logging.Level.INFO)) {
                logger.info("Starting background import for task: " + taskId);
            }
            
            // Get records from Python microservice in batches
            Map<String, Object> recordCountResult = getRecordCount(setSpec, metadataPrefix, false);
            Integer totalRecords = (Integer) recordCountResult.get("total_count");
            
            if (totalRecords != null && totalRecords > 0) {
                task.setTotalRecords(totalRecords);
                
                int batchSize = 50;
                int offset = 0;
                int importedCount = 0;
                List<String> errors = new ArrayList<>();
                
                while (offset < totalRecords) {
                    // Get batch of records
                    Map<String, Object> batchResult = getRecordsBySet(setSpec, batchSize, offset, false, metadataPrefix);
                    @SuppressWarnings("unchecked")
                    List<OAIRecordDto> batchRecords = (List<OAIRecordDto>) batchResult.get(RECORDS_KEY);
                    
                    if (batchRecords == null || batchRecords.isEmpty()) {
                        break;
                    }
                    
                    // Process each record in the batch
                    for (OAIRecordDto oaiRecord : batchRecords) {
                        ImportResult result = importSingleRecord(oaiRecord, carreraId);
                        if (result.isSuccess()) {
                            importedCount++;
                        } else {
                            errors.add(result.getErrorMessage());
                        }
                        
                        // Update progress
                        task.setProcessedRecords(task.getProcessedRecords() + 1);
                        task.setImportedCount(importedCount);
                        task.setProgress((double) task.getProcessedRecords() / totalRecords * 100);
                    }
                    
                    offset += batchSize;
                    
                    // Small delay to prevent overwhelming the system
                    Thread.sleep(100);
                }
                
                // Task completed successfully
                task.setStatus("completed");
                task.setCompletedAt(OffsetDateTime.now());
                task.setProgress(100.0);
                task.setMessage("Successfully imported " + importedCount + " records as temas");
                
                if (!errors.isEmpty() && logger.isLoggable(java.util.logging.Level.WARNING)) {
                    logger.warning("Import task " + taskId + " completed with " + errors.size() + " errors");
                }
                
            } else {
                task.setStatus("completed");
                task.setCompletedAt(OffsetDateTime.now());
                task.setProgress(100.0);
                task.setMessage("No records found to import");
            }
            
        } catch (Exception e) {
            logger.severe("Async import task " + taskId + " failed: " + e.getMessage());
            task.setStatus("failed");
            task.setCompletedAt(OffsetDateTime.now());
            task.setError(e.getMessage());
            task.setMessage("Import failed: " + e.getMessage());
        }
    }
    
    // Inner class for async import task tracking
    @Getter
    @Setter
    private static class AsyncImportTask {
        private String taskId;
        private String setSpec;
        private Integer carreraId;
        private String metadataPrefix;
        private String status;
        private OffsetDateTime createdAt;
        private OffsetDateTime startedAt;
        private OffsetDateTime completedAt;
        private Double progress;
        private Integer importedCount;
        private Integer processedRecords;
        private Integer totalRecords;
        private String message;
        private String error;
        
        public AsyncImportTask(String taskId, String setSpec, Integer carreraId, String metadataPrefix,
                             String status, OffsetDateTime createdAt, OffsetDateTime startedAt, 
                             OffsetDateTime completedAt, Double progress, Integer importedCount, 
                             Integer processedRecords, Integer totalRecords, String message, String error) {
            this.taskId = taskId;
            this.setSpec = setSpec;
            this.carreraId = carreraId;
            this.metadataPrefix = metadataPrefix;
            this.status = status;
            this.createdAt = createdAt;
            this.startedAt = startedAt;
            this.completedAt = completedAt;
            this.progress = progress;
            this.importedCount = importedCount;
            this.processedRecords = processedRecords;
            this.totalRecords = totalRecords;
            this.message = message;
            this.error = error;
        }
    }

    // Inner class for import results
    private static class ImportResult {
        private final boolean success;
        private final Integer temaId;
        private final String errorMessage;

        public ImportResult(boolean success, Integer temaId, String errorMessage) {
            this.success = success;
            this.temaId = temaId;
            this.errorMessage = errorMessage;
        }

        public boolean isSuccess() {
            return success;
        }

        public Integer getTemaId() {
            return temaId;
        }

        public String getErrorMessage() {
            return errorMessage;
        }
    }
}
