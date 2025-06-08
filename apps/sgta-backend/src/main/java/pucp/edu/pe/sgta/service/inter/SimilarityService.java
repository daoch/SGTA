package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.dto.TemaSimilarityResult;

import java.util.List;
import java.util.Map;

public interface SimilarityService {
    
    /**
     * Calculates similarity between a given tema and all existing temas in the database.
     * 
     * @param tema The tema to compare against existing ones
     * @param threshold Minimum similarity score (0-100) to include in results
     * @return List of similarity results above the threshold, ordered by similarity score (highest first)
     */
    List<TemaSimilarityResult> findSimilarTemas(TemaDto tema, Double threshold);
    
    /**
     * Calculates similarity between a given tema and all existing temas in the database
     * using the default threshold.
     * 
     * @param tema The tema to compare against existing ones
     * @return List of similarity results above the default threshold
     */
    List<TemaSimilarityResult> findSimilarTemas(TemaDto tema);
    
    /**
     * Calculates similarity score between two temas.
     * 
     * @param tema1 First tema
     * @param tema2 Second tema
     * @return Similarity score as percentage (0-100)
     */
    Double calculateSimilarity(TemaDto tema1, TemaDto tema2);
    
    /**
     * Gets the current similarity threshold.
     * 
     * @return Current threshold value (0-100)
     */
    Double getDefaultThreshold();
    
    /**
     * Sets the similarity threshold.
     * 
     * @param threshold New threshold value (0-100)
     */
    void setDefaultThreshold(Double threshold);

    /**
     * Adds a tema to the FAISS index for efficient searching.
     * 
     * @param tema The tema to add to the index
     */
    void addTemaToFaissIndex(TemaDto tema);
    
    /**
     * Batch adds multiple temas to the FAISS index.
     * 
     * @param temas List of temas to add to the index
     */
    void addTemasToFaissIndex(List<TemaDto> temas);
    
    /**
     * Initialize the FAISS index with all existing temas from the database.
     */

    /**
     * Initialize FAISS index and return detailed response information.
     * 
     * @return Map containing initialization results including tema count and status
     */
    Map<String, Object> initializeFaissIndexWithResponse();
    
    /**
     * Get FAISS status information including total temas count and configuration.
     * 
     * @return Map containing FAISS status information
     */
    Map<String, Object> getFaissStatus();

    Map<String, Object> clearFaissIndex();

    /**
     * Remove a specific tema from FAISS index
     * @param temaId The ID of the tema to remove
     * @return Map with operation result and status information
     */
    Map<String, Object> removeTemaFromFaissIndex(Integer temaId);

}
