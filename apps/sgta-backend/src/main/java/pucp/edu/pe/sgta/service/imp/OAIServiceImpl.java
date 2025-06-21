package pucp.edu.pe.sgta.service.imp;

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
import pucp.edu.pe.sgta.repository.EstadoTemaRepository;
import pucp.edu.pe.sgta.repository.CarreraRepository;
import pucp.edu.pe.sgta.service.inter.OAIService;
import pucp.edu.pe.sgta.service.inter.TemaService;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CompletableFuture;
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

    @Value("${sbert.microservice.url:http://localhost:8000}")
    private String sbertServiceUrl;

    private String currentOAIEndpoint = null;
    
    // In-memory storage for async tasks (in production, use Redis or database)
    private final Map<String, AsyncImportTask> asyncImportTasks = new ConcurrentHashMap<>();

    public OAIServiceImpl(RestTemplate restTemplate, TemaService temaService, 
                         EstadoTemaRepository estadoTemaRepository, CarreraRepository carreraRepository) {
        this.restTemplate = restTemplate;
        this.temaService = temaService;
        this.estadoTemaRepository = estadoTemaRepository;
        this.carreraRepository = carreraRepository;
    }    @Override
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
        
        // Getters and setters
        public String getTaskId() { return taskId; }
        public String getSetSpec() { return setSpec; }
        public Integer getCarreraId() { return carreraId; }
        public String getMetadataPrefix() { return metadataPrefix; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public OffsetDateTime getCreatedAt() { return createdAt; }
        public OffsetDateTime getStartedAt() { return startedAt; }
        public void setStartedAt(OffsetDateTime startedAt) { this.startedAt = startedAt; }
        public OffsetDateTime getCompletedAt() { return completedAt; }
        public void setCompletedAt(OffsetDateTime completedAt) { this.completedAt = completedAt; }
        public Double getProgress() { return progress; }
        public void setProgress(Double progress) { this.progress = progress; }
        public Integer getImportedCount() { return importedCount; }
        public void setImportedCount(Integer importedCount) { this.importedCount = importedCount; }
        public Integer getProcessedRecords() { return processedRecords; }
        public void setProcessedRecords(Integer processedRecords) { this.processedRecords = processedRecords; }
        public Integer getTotalRecords() { return totalRecords; }
        public void setTotalRecords(Integer totalRecords) { this.totalRecords = totalRecords; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
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
