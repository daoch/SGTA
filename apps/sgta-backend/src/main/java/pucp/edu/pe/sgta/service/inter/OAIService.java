package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.oai.OAIEndpointDto;
import pucp.edu.pe.sgta.dto.oai.OAIRecordDto;
import pucp.edu.pe.sgta.dto.oai.OAISetDto;

import java.util.List;
import java.util.Map;

public interface OAIService {

    /**
     * Configures the OAI-PMH endpoint URL
     * 
     * @param endpoint The OAI-PMH endpoint URL
     * @return Map containing the configuration result
     */
    Map<String, Object> configureOAIEndpoint(String endpoint);

    /**
     * Gets the current configured OAI-PMH endpoint
     * 
     * @return Current OAI-PMH endpoint configuration
     */
    OAIEndpointDto getCurrentOAIEndpoint();

    /**
     * Retrieves all available sets from the OAI-PMH repository
     * 
     * @return List of OAI sets
     */
    List<OAISetDto> getOAISets();

    /**
     * Retrieves records from a specific set
     * 
     * @param setSpec The set specification to retrieve records from
     * @return List of OAI records from the specified set
     */
    List<OAIRecordDto> getRecordsBySet(String setSpec);

    /**
     * Retrieves records from a specific set with pagination support
     * 
     * @param setSpec The set specification to retrieve records from
     * @param limit Maximum number of records to return
     * @param offset Number of records to skip
     * @param includeTotalCount Whether to include total count in response
     * @param metadataPrefix The metadata prefix to use
     * @return Map containing paginated records and pagination info
     */
    Map<String, Object> getRecordsBySet(String setSpec, Integer limit, Integer offset, Boolean includeTotalCount, String metadataPrefix);

    /**
     * Gets record count for a specific set
     * 
     * @param setSpec The set specification to count records from
     * @param metadataPrefix The metadata prefix to use
     * @param forceRefresh Whether to force a fresh count
     * @return Map containing record count information
     */
    Map<String, Object> getRecordCount(String setSpec, String metadataPrefix, Boolean forceRefresh);

    /**
     * Starts asynchronous import of OAI records as Temas
     * 
     * @param setSpec The set specification to import records from
     * @param carreraId The career ID to associate with imported temas
     * @param metadataPrefix The metadata prefix to use
     * @return Map containing async task information
     */
    Map<String, Object> startAsyncImport(String setSpec, Integer carreraId, String metadataPrefix);

    /**
     * Gets status of asynchronous import task
     * 
     * @param taskId The task ID to check status for
     * @return Map containing task status information
     */
    Map<String, Object> getAsyncImportStatus(String taskId);

    /**
     * Imports OAI records as Temas with FINALIZADO status
     * 
     * @param setSpec The set specification to import records from
     * @param carreraId The career ID to associate with imported temas
     * @return Map containing import results (number of imported topics, errors, etc.)
     */
    Map<String, Object> importRecordsAsTemas(String setSpec, Integer carreraId);

    /**
     * Gets statistics about the OAI service
     * 
     * @return Map containing OAI service statistics
     */
    Map<String, Object> getOAIStatistics();
}
