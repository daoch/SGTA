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
