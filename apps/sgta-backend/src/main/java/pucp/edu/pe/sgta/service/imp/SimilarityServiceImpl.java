package pucp.edu.pe.sgta.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.dto.TemaSimilarityResult;
import pucp.edu.pe.sgta.service.inter.SimilarityService;
import pucp.edu.pe.sgta.service.inter.TemaService;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class SimilarityServiceImpl implements SimilarityService {

    private static final Logger logger = Logger.getLogger(SimilarityServiceImpl.class.getName());

    // Constants for FAISS integration
    private static final String TOPIC_ID_PREFIX = "tema_";
    private static final String RESULTS_KEY = "results";
    private static final String TOPICS_ADDED_KEY = "topics_added";
    private static final String TOPIC_ID_KEY = "topic_id";
    private static final String TITLE_KEY = "title";
    private static final String CONTENT_KEY = "content";
    private static final String PREPROCESSED_TEXT_KEY = "preprocessed_text";

    @Autowired
    private TemaService temaService;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${similarity.default-threshold:75.0}")
    private Double defaultThreshold;

    @Value("${similarity.title-weight:0.7}")
    private Double titleWeight;

    @Value("${similarity.description-weight:0.3}")
    private Double descriptionWeight;

    @Value("${sbert.microservice.url:http://localhost:8000}")
    private String sbertServiceUrl;

    @Value("${similarity.use-sbert:true}")
    private Boolean useSbert;

    @Value("${similarity.use-faiss:true}")
    private Boolean useFaiss;

    @Value("${similarity.faiss-threshold:70.0}")
    private Double faissThreshold;

    @Value("${similarity.faiss-top-k:10}")
    private Integer faissTopK;

    // Spanish stopwords set
    private static final Set<String> SPANISH_STOPWORDS = Set.of(
        "a", "al", "algo", "algunas", "algunos", "ante", "antes", "como", "con", "contra", 
        "cual", "cuando", "de", "del", "desde", "donde", "durante", "e", "el", "ella", 
        "ellas", "ellos", "en", "entre", "era", "erais", "eran", "eras", "eres", "es", 
        "esa", "esas", "ese", "eso", "esos", "esta", "estaba", "estabais", "estaban", 
        "estabas", "estad", "estada", "estadas", "estado", "estados", "estamos", "estando", 
        "estar", "estaremos", "estará", "estarán", "estarás", "estaré", "estaréis", 
        "estaría", "estaríais", "estaríamos", "estarían", "estarías", "estas", "este", 
        "estemos", "esto", "estos", "estoy", "estuve", "estuviera", "estuvierais", 
        "estuvieran", "estuvieras", "estuvieron", "estuviese", "estuvieseis", "estuviesen", 
        "estuvieses", "estuvimos", "estuviste", "estuvisteis", "estuvo", "está", "estábamos", 
        "estáis", "están", "estás", "esté", "estéis", "estén", "estés", "fue", "fuera", 
        "fuerais", "fueran", "fueras", "fueron", "fuese", "fueseis", "fuesen", "fueses", 
        "fui", "fuimos", "fuiste", "fuisteis", "ha", "habida", "habidas", "habido", 
        "habidos", "habiendo", "habremos", "habrá", "habrán", "habrás", "habré", "habréis", 
        "habría", "habríais", "habríamos", "habrían", "habrías", "habéis", "había", 
        "habíais", "habíamos", "habían", "habías", "han", "has", "hasta", "hay", "haya", 
        "hayamos", "hayan", "hayas", "hayáis", "he", "hemos", "hube", "hubiera", "hubierais", 
        "hubieran", "hubieras", "hubieron", "hubiese", "hubieseis", "hubiesen", "hubieses", 
        "hubimos", "hubiste", "hubisteis", "hubo", "la", "las", "le", "les", "lo", "los", 
        "me", "mi", "mis", "mucho", "muchos", "muy", "más", "nada", "ni", "no", "nos", 
        "nosotras", "nosotros", "nuestra", "nuestras", "nuestro", "nuestros", "o", "os", 
        "otra", "otras", "otro", "otros", "para", "pero", "poco", "por", "porque", "que", 
        "quien", "quienes", "qué", "se", "sea", "seamos", "sean", "seas", "sentid", 
        "sentida", "sentidas", "sentido", "sentidos", "será", "seremos", "serán", "serás", 
        "seré", "seréis", "sería", "seríais", "seríamos", "serían", "serías", "seáis", 
        "sido", "siendo", "sin", "sobre", "sois", "somos", "son", "soy", "su", "sus", 
        "suya", "suyas", "suyo", "suyos", "sí", "también", "tanto", "te", "tendremos", 
        "tendrá", "tendrán", "tendrás", "tendré", "tendréis", "tendría", "tendríais", 
        "tendríamos", "tendrían", "tendrías", "tened", "tenemos", "tenga", "tengamos", 
        "tengan", "tengas", "tengo", "tengáis", "tenida", "tenidas", "tenido", "tenidos", 
        "teniendo", "tenéis", "tenía", "teníais", "teníamos", "tenían", "tenías", "ti", 
        "tiene", "tienen", "tienes", "todo", "todos", "tu", "tus", "tuve", "tuviera", 
        "tuvierais", "tuvieran", "tuvieras", "tuvieron", "tuviese", "tuvieseis", "tuviesen", 
        "tuvieses", "tuvimos", "tuviste", "tuvisteis", "tuvo", "tuya", "tuyas", "tuyo", 
        "tuyos", "tú", "un", "una", "uno", "unos", "vosotras", "vosotros", "vuestra", 
        "vuestras", "vuestro", "vuestros", "y", "ya", "yo", "él", "éramos"
    );

    @Override
    public List<TemaSimilarityResult> findSimilarTemas(TemaDto tema, Double threshold) {
        if (tema == null) {
            throw new IllegalArgumentException("Tema cannot be null");
        }
        
        if (threshold < 0 || threshold > 100) {
            throw new IllegalArgumentException("Threshold must be between 0 and 100");
        }

        if (Boolean.TRUE.equals(useFaiss)) {
            // Use FAISS for efficient similarity search
            return findSimilarTemasWithFaiss(tema, threshold);
        } else {
            // Fallback to traditional comparison with all temas
            return findSimilarTemasTraditional(tema, threshold);
        }
    }

    /**
     * Efficient similarity search using FAISS service
     */
    private List<TemaSimilarityResult> findSimilarTemasWithFaiss(TemaDto tema, Double threshold) {
        try {
            // Search for similar temas using FAISS
            String combinedText = combineTextForSearch(tema);

            if (tema.getId() == 999999) {
                return searchUsingTempEmbedding(tema, threshold);
            } else{
                addTemaToFaissIndex(tema);
                List<TemaSimilarityResult> faissResults = searchSimilarTemas(combinedText, threshold);
                // Filter out the same tema if it exists - fix the filtering logic
                return faissResults.stream()
                        .filter(result -> {
                            if (tema.getId() == null) {
                                return true; // Keep all results if input tema has no ID
                            }
                            if (result.getTema() == null || result.getTema().getId() == null) {
                                return true; // Keep if result has no ID to compare
                            }
                            return !tema.getId().equals(result.getTema().getId());
                        })
                        .toList();
            }


        } catch (Exception e) {
            logger.warning("FAISS search failed, falling back to traditional method: " + e.getMessage());
            return findSimilarTemasTraditional(tema, threshold);
        }
    }

    /**
     * Search for similar temas using temporary embedding without adding to index
     */
   private List<TemaSimilarityResult> searchUsingTempEmbedding(TemaDto tema, Double threshold) {
       try {
           // Combine and preprocess text for search
           String combinedText = combineTextForSearch(tema);
           String preprocessedQuery = preprocessText(combinedText);

           if (Boolean.TRUE.equals(useFaiss)) {
               logger.info(String.format("Searching with temporary embedding (length: %d)", preprocessedQuery.length()));
           }

           if (threshold < 0 || threshold > 100) {
                throw new IllegalArgumentException("Threshold must be between 0 and 100");
           }

           if (threshold < faissThreshold) {
               logger.warning(String.format("Using temporary embedding search with threshold %.1f%%, which is lower than configured FAISS threshold %.1f%%", threshold, faissThreshold));
           }

           if (threshold == null){
               threshold = faissThreshold;
           }
           // Create URL with query parameters properly encoded
           UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(sbertServiceUrl + "/topics/search-temp")
               .queryParam("query_text", preprocessedQuery)
               .queryParam("top_k", faissTopK)
               .queryParam("threshold", threshold/100); // Convert percentage to decimal

           HttpHeaders headers = new HttpHeaders();
           // Empty body for GET request
           HttpEntity<Void> request = new HttpEntity<>(headers);

           @SuppressWarnings("rawtypes")
           ResponseEntity<Map> response = restTemplate.exchange(
               builder.toUriString(),
               HttpMethod.GET,
               request,
               Map.class
           );

           @SuppressWarnings("unchecked")
           Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
           if (responseBody != null && responseBody.containsKey(RESULTS_KEY)) {
               @SuppressWarnings("unchecked")
               List<Map<String, Object>> results = (List<Map<String, Object>>) responseBody.get(RESULTS_KEY);

               if (Boolean.TRUE.equals(useFaiss)) {
                   logger.info(String.format("Temporary embedding search returned %d similar temas", results.size()));
               }

               return results.stream()
                   .<TemaSimilarityResult>map(this::mapFaissResultToTemaSimilarity)
                   .filter(Objects::nonNull)
                   .collect(Collectors.toList());
           }

       } catch (Exception e) {
           logger.warning("Temporary embedding search failed: " + e.getMessage());
       }

       return new ArrayList<>();
   }
    /**
     * Traditional similarity search (comparing with all temas one by one)
     */
    private List<TemaSimilarityResult> findSimilarTemasTraditional(TemaDto tema, Double threshold) {
        // Get all existing temas from database
        List<TemaDto> allTemas = temaService.getAll();
          // Filter out the same tema if it exists (by ID)
        List<TemaDto> otherTemas = allTemas.stream()
            .filter(t -> tema.getId() == null || !tema.getId().equals(t.getId()))
            .toList();

        List<TemaSimilarityResult> results = new ArrayList<>();
        
        for (TemaDto otherTema : otherTemas) {
            try {
                Double similarity = calculateSimilarity(tema, otherTema);
                
                if (similarity >= threshold) {
                    TemaSimilarityResult result = TemaSimilarityResult.builder()
                        .tema(otherTema)
                        .similarityScore(similarity)
                        .comparedFields("titulo, resumen")
                        .build();
                    results.add(result);
                }
            } catch (Exception e) {
                logger.warning("Error calculating similarity for tema " + otherTema.getId() + ": " + e.getMessage());
            }
        }        // Sort by similarity score (highest first)
        results.sort((a, b) -> Double.compare(b.getSimilarityScore(), a.getSimilarityScore()));
        
        logger.info(String.format("Found %d similar temas above threshold %.1f%%", results.size(), threshold));
        return results;
    }

    @Override
    public List<TemaSimilarityResult> findSimilarTemas(TemaDto tema) {
        return findSimilarTemas(tema, defaultThreshold);
    }

    @Override
    public Double calculateSimilarity(TemaDto tema1, TemaDto tema2) {
        if (tema1 == null || tema2 == null) {
            return 0.0;
        }

        Double titleSimilarity;
        Double descriptionSimilarity;

        if (Boolean.TRUE.equals(useSbert)) {
            // Use SBERT microservice for semantic similarity
            titleSimilarity = calculateSbertSimilarity(tema1.getTitulo(), tema2.getTitulo());
            descriptionSimilarity = calculateSbertSimilarity(tema1.getResumen(), tema2.getResumen());
        } else {
            // Fallback to traditional methods
            titleSimilarity = calculateTextSimilarity(tema1.getTitulo(), tema2.getTitulo());
            descriptionSimilarity = calculateTextSimilarity(tema1.getResumen(), tema2.getResumen());
        }

        // Weighted average of similarities
        Double overallSimilarity = (titleSimilarity * titleWeight) + 
                                 (descriptionSimilarity * descriptionWeight);

        return Math.min(100.0, Math.max(0.0, overallSimilarity));
    }

    @Override
    public Double getDefaultThreshold() {
        return defaultThreshold;
    }

    @Override
    public void setDefaultThreshold(Double threshold) {
        if (threshold < 0 || threshold > 100) {
            throw new IllegalArgumentException("Threshold must be between 0 and 100");
        }
        this.defaultThreshold = threshold;
    }

    /**
     * Calculates semantic similarity using SBERT microservice
     */
    private Double calculateSbertSimilarity(String text1, String text2) {
        if (text1 == null || text2 == null || text1.trim().isEmpty() || text2.trim().isEmpty()) {
            return 0.0;
        }

        try {
            // Construir el body manualmente para evitar problemas de inferencia genérica
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("query", preprocessText(text1));
            requestBody.put("texts", List.of(preprocessText(text2)));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            String endpoint = sbertServiceUrl + "/similarity";
            @SuppressWarnings("unchecked")
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                endpoint,
                HttpMethod.POST,
                request,
                (Class<Map<String, Object>>)(Class<?>)Map.class
            );

            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey(RESULTS_KEY)) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> results = (List<Map<String, Object>>) responseBody.get(RESULTS_KEY);
                if (!results.isEmpty() && results.get(0).containsKey("score")) {
                    Double similarity = ((Number) results.get(0).get("score")).doubleValue();
                    return similarity * 100.0;
                }
            }

        } catch (Exception e) {
            logger.warning("SBERT microservice call failed, falling back to traditional methods: " + e.getMessage());
            return calculateTextSimilarity(text1, text2);
        }

        return 0.0;
    }

    /**
     * Preprocesses text by removing stopwords and normalizing
     */
    private String preprocessText(String text) {
        if (text == null) return "";

        // Normalize text
        String normalized = normalizeText(text);
          // Remove Spanish stopwords
        String[] words = normalized.split("\\s+");
        List<String> filteredWords = Arrays.stream(words)
            .filter(word -> !word.isEmpty() && !SPANISH_STOPWORDS.contains(word))
            .toList();

        return String.join(" ", filteredWords);
    }

    /**
     * Calculates text similarity using a combination of techniques:
     * - Jaccard similarity for word overlap
     * - Cosine similarity for TF-IDF vectors
     * - Levenshtein distance for character-level similarity
     */
    private Double calculateTextSimilarity(String text1, String text2) {
        if (text1 == null || text2 == null) {
            return 0.0;
        }
        
        if (text1.trim().isEmpty() || text2.trim().isEmpty()) {
            return 0.0;
        }

        // Preprocess texts (normalize and remove stopwords)
        String processedText1 = preprocessText(text1);
        String processedText2 = preprocessText(text2);

        // If after preprocessing texts are empty, return 0
        if (processedText1.isEmpty() || processedText2.isEmpty()) {
            return 0.0;
        }

        // Calculate different similarity metrics
        Double jaccardSim = calculateJaccardSimilarity(processedText1, processedText2);
        Double cosineSim = calculateCosineSimilarity(processedText1, processedText2);
        Double levenshteinSim = calculateLevenshteinSimilarity(processedText1, processedText2);

        // Weighted combination of different similarity measures
        Double combinedSimilarity = (jaccardSim * 0.4) + (cosineSim * 0.4) + (levenshteinSim * 0.2);

        return combinedSimilarity * 100.0; // Convert to percentage
    }

    private String normalizeText(String text) {
        if (text == null) return "";
        
        return text.toLowerCase()
            .replaceAll("[^a-záéíóúñü\\s]", "") // Remove special characters, keep Spanish chars
            .replaceAll("\\s+", " ") // Normalize whitespace
            .trim();
    }

    private Double calculateJaccardSimilarity(String text1, String text2) {
        Set<String> words1 = new HashSet<>(Arrays.asList(text1.split("\\s+")));
        Set<String> words2 = new HashSet<>(Arrays.asList(text2.split("\\s+")));

        Set<String> intersection = new HashSet<>(words1);
        intersection.retainAll(words2);

        Set<String> union = new HashSet<>(words1);
        union.addAll(words2);

        if (union.isEmpty()) {
            return 0.0;
        }

        return (double) intersection.size() / union.size();
    }

    private Double calculateCosineSimilarity(String text1, String text2) {
        Map<String, Integer> vector1 = createWordVector(text1);
        Map<String, Integer> vector2 = createWordVector(text2);

        Set<String> commonWords = new HashSet<>(vector1.keySet());
        commonWords.retainAll(vector2.keySet());

        if (commonWords.isEmpty()) {
            return 0.0;
        }

        double dotProduct = 0.0;
        double magnitude1 = 0.0;
        double magnitude2 = 0.0;

        Set<String> allWords = new HashSet<>(vector1.keySet());
        allWords.addAll(vector2.keySet());

        for (String word : allWords) {
            int freq1 = vector1.getOrDefault(word, 0);
            int freq2 = vector2.getOrDefault(word, 0);

            dotProduct += freq1 * freq2;
            magnitude1 += freq1 * freq1;
            magnitude2 += freq2 * freq2;
        }

        if (magnitude1 == 0.0 || magnitude2 == 0.0) {
            return 0.0;
        }

        return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
    }

    private Map<String, Integer> createWordVector(String text) {
        Map<String, Integer> vector = new HashMap<>();
        String[] words = text.split("\\s+");
        
        for (String word : words) {
            if (!word.isEmpty()) {
                vector.put(word, vector.getOrDefault(word, 0) + 1);
            }
        }
        
        return vector;
    }

    private Double calculateLevenshteinSimilarity(String text1, String text2) {
        int maxLength = Math.max(text1.length(), text2.length());
        if (maxLength == 0) {
            return 1.0;
        }
        
        int distance = calculateLevenshteinDistance(text1, text2);
        return 1.0 - ((double) distance / maxLength);
    }

    private int calculateLevenshteinDistance(String s1, String s2) {
        int[][] dp = new int[s1.length() + 1][s2.length() + 1];

        for (int i = 0; i <= s1.length(); i++) {
            dp[i][0] = i;
        }
        for (int j = 0; j <= s2.length(); j++) {
            dp[0][j] = j;
        }

        for (int i = 1; i <= s1.length(); i++) {
            for (int j = 1; j <= s2.length(); j++) {
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(
                        dp[i - 1][j],    // deletion
                        Math.min(
                            dp[i][j - 1],    // insertion
                            dp[i - 1][j - 1] // substitution
                        )
                    );
                }
            }
        }        return dp[s1.length()][s2.length()];
    }

    /**
     * Adds a tema to the FAISS index for efficient searching
     */
    @Override
    public void addTemaToFaissIndex(TemaDto tema) {
        if (!Boolean.TRUE.equals(useFaiss) || tema == null) return;

        try {
            // Combine and preprocess the text content
            String combinedText = combineTextForSearch(tema);
            String preprocessedText = preprocessText(combinedText);
              Map<String, Object> requestBody = Map.of(
                "topics", Arrays.asList(Map.of(
                    TOPIC_ID_KEY, TOPIC_ID_PREFIX + (tema.getId() != null ? tema.getId() : "new"),
                    TITLE_KEY, tema.getTitulo() != null ? tema.getTitulo() : "",
                    CONTENT_KEY, tema.getResumen() != null ? tema.getResumen() : "",
                    PREPROCESSED_TEXT_KEY, preprocessedText
                ))
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            String endpoint = sbertServiceUrl + "/topics/add";
            restTemplate.exchange(endpoint, HttpMethod.POST, request, Map.class);            if (Boolean.TRUE.equals(useFaiss)) {
                logger.info("Added tema " + tema.getId() + " to FAISS index with preprocessed text");
            }

        } catch (Exception e) {
            logger.warning("Failed to add tema to FAISS index: " + e.getMessage());
        }
    }

    /**
     * Batch add multiple temas to FAISS index
     */
    @Override
    public void addTemasToFaissIndex(List<TemaDto> temas) {
        if (!Boolean.TRUE.equals(useFaiss) || temas == null || temas.isEmpty()) return;

        try {
            List<Map<String, Object>> topicMaps = temas.stream()
            .map(tema -> {
                String combinedText = combineTextForSearch(tema);
                String preprocessedText = preprocessText(combinedText);
                  return Map.<String, Object>of(
                    TOPIC_ID_KEY, (Object)(TOPIC_ID_PREFIX + (tema.getId() != null ? tema.getId() : "new_" + UUID.randomUUID())),
                    TITLE_KEY,    (Object)(tema.getTitulo() != null ? tema.getTitulo() : ""),
                    CONTENT_KEY,  (Object)(tema.getResumen() != null ? tema.getResumen() : ""),                    PREPROCESSED_TEXT_KEY, (Object)preprocessedText
                );
            })
            .toList();

            Map<String, Object> requestBody = Map.of("topics", topicMaps);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);            String endpoint = sbertServiceUrl + "/topics/add";
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.exchange(endpoint, HttpMethod.POST, request, Map.class);

            @SuppressWarnings("unchecked")
            Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
            if (responseBody != null && responseBody.containsKey(TOPICS_ADDED_KEY)) {
                Integer topicsAdded = (Integer) responseBody.get(TOPICS_ADDED_KEY);
                if (Boolean.TRUE.equals(useFaiss)) {
                    logger.info(String.format("Added %d temas to FAISS index with preprocessed text", topicsAdded));
                }
            }

        } catch (Exception e) {
            logger.warning("Failed to batch add temas to FAISS index: " + e.getMessage());
        }
    }    /**
     * Search for similar temas using FAISS service with preprocessed text
     */
    private List<TemaSimilarityResult> searchSimilarTemas(String queryText, Double threshold) {
        try {            // Preprocess the query text before sending to FAISS for consistency
            String preprocessedQuery = preprocessText(queryText);
            if (Boolean.TRUE.equals(useFaiss)) {
                logger.info(String.format("Searching FAISS with preprocessed query (length: %d)", preprocessedQuery.length()));
            }
            
            Map<String, Object> requestBody = Map.of(
                "query", preprocessedQuery,
                "top_k", faissTopK,
                "threshold", threshold / 100.0 // Convert percentage to decimal
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            String endpoint = sbertServiceUrl + "/topics/search";
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.exchange(endpoint, HttpMethod.POST, request, Map.class);

            @SuppressWarnings("unchecked")
            Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
            if (responseBody != null && responseBody.containsKey(RESULTS_KEY)) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> results = (List<Map<String, Object>>) responseBody.get(RESULTS_KEY);
                
                if (Boolean.TRUE.equals(useFaiss)) {
                    logger.info(String.format("FAISS returned %d similar temas", results.size()));
                }                return results.stream()
                    .<TemaSimilarityResult>map(this::mapFaissResultToTemaSimilarity)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            }

        } catch (Exception e) {
            logger.warning("FAISS search failed: " + e.getMessage());
        }

        return new ArrayList<>();
    }    /**
     * Maps FAISS search result to TemaSimilarityResult
     */
    private TemaSimilarityResult mapFaissResultToTemaSimilarity(Map<String, Object> faissResult) {
        try {
            String topicId = (String) faissResult.get(TOPIC_ID_KEY);
            String title = (String) faissResult.get(TITLE_KEY);
            String content = (String) faissResult.get(CONTENT_KEY);
            Double score = ((Number) faissResult.get("similarity_score")).doubleValue();            // Extract tema ID from topic_id (format: "tema_123")
            Integer temaId = extractTemaIdFromTopicId(topicId);

            // Try to get full tema from database if we have an ID
            TemaDto tema = null;
            if (temaId != null) {
                tema = temaService.findById(temaId);
            }
            
            // If not found in database, create a minimal DTO
            if (tema == null) {
                tema = TemaDto.builder()
                    .id(temaId)
                    .titulo(title)
                    .resumen(content)
                    .build();
            }

            return TemaSimilarityResult.builder()
                .tema(tema)
                .similarityScore(score * 100.0) // Convert back to percentage
                .comparedFields("titulo, resumen (FAISS)")
                .build();

        } catch (Exception e) {
            logger.warning("Failed to map FAISS result: " + e.getMessage());
            return null;
        }
    }    /**
     * Combines title and description for search query
     */
    private String combineTextForSearch(TemaDto tema) {
        StringBuilder combined = new StringBuilder();
        
        if (tema.getTitulo() != null && !tema.getTitulo().trim().isEmpty()) {
            combined.append(tema.getTitulo());
        }
        
        if (tema.getResumen() != null && !tema.getResumen().trim().isEmpty()) {
            if (combined.length() > 0) {
                combined.append(" ");
            }
            combined.append(tema.getResumen());        }
        
        // Note: Keywords field could be added to TemaDto in the future
        // for improved similarity search accuracy when available
        if (tema.getObjetivos() != null && !tema.getObjetivos().isEmpty()) {
            if (combined.length() > 0) {
                combined.append(" ");
            }
            combined.append(String.join(" ", tema.getObjetivos()));
        }


        return combined.toString();
    }    /**
     * Initialize FAISS index with all existing temas
     */

    /**
     * Initialize FAISS index and return detailed response information.
     */
    @Override
    public Map<String, Object> initializeFaissIndexWithResponse() {
        try {
            if (!Boolean.TRUE.equals(useFaiss)) {
                return Map.of(
                    "success", false,
                    "message", "FAISS está deshabilitado en la configuración",
                    "temasIndexados", 0
                );
            }

            logger.info("Initializing FAISS index with existing temas...");
            List<TemaDto> allTemas = temaService.listarTemasFinalizados();
            
            if (!allTemas.isEmpty()) {
                addTemasToFaissIndex(allTemas);
                logger.info(String.format("FAISS index initialized with %d temas", allTemas.size()));
                
                return Map.of(
                    "success", true,
                    "message", "FAISS index inicializado exitosamente",
                    "temasIndexados", allTemas.size(),
                    "timestamp", java.time.Instant.now().toString()
                );
            } else {
                logger.info("No existing temas found, FAISS index is empty");
                return Map.of(
                    "success", true,
                    "message", "No hay temas disponibles para indexar",
                    "temasIndexados", 0,
                    "timestamp", java.time.Instant.now().toString()
                );
            }
            
        } catch (Exception e) {
            logger.severe("Failed to initialize FAISS index: " + e.getMessage());
            return Map.of(
                "success", false,
                "error", "Error al inicializar el índice FAISS",
                "details", e.getMessage(),
                "temasIndexados", 0
            );
        }
    }

    /**
     * Get FAISS status information including total temas count and configuration.
     */
    @Override
    public Map<String, Object> getFaissStatus() {
        try {
            List<TemaDto> allTemas = temaService.getAll();
            int totalTemas = allTemas.size();
            
            return Map.of(
                "success", true,
                "totalTemas", totalTemas,
                "faissEnabled", Boolean.TRUE.equals(useFaiss),
                "sbertEnabled", Boolean.TRUE.equals(useSbert),
                "defaultThreshold", defaultThreshold,
                "faissTopK", faissTopK,
                "message", "Estado del índice FAISS obtenido exitosamente"
            );
            
        } catch (Exception e) {
            logger.severe("Failed to get FAISS status: " + e.getMessage());
            return Map.of(
                "success", false,
                "error", "Error al obtener el estado de FAISS",                "details", e.getMessage(),
                "totalTemas", 0,
                "faissEnabled", false
            );
        }
    }

    /**
     * Extracts tema ID from FAISS topic_id format (e.g., "tema_123" -> 123)
     */
    private Integer extractTemaIdFromTopicId(String topicId) {
        if (topicId == null || !topicId.startsWith(TOPIC_ID_PREFIX)) {
            return null;
        }
        
        try {
            String idPart = topicId.substring(TOPIC_ID_PREFIX.length());
            return Integer.parseInt(idPart);
        } catch (NumberFormatException e) {
            logger.warning("Failed to extract tema ID from topic_id: " + topicId);
            return null;
        }
    }

    @Override
    public Map<String, Object> clearFaissIndex() {
        try {
            if (!Boolean.TRUE.equals(useFaiss)) {
                return Map.of(
                    "success", false,
                    "message", "FAISS está deshabilitado en la configuración"
                );
            }

            logger.info("Clearing FAISS index...");
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Void> request = new HttpEntity<>(headers);

            String endpoint = sbertServiceUrl + "/topics/clear";
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.exchange(
                endpoint, 
                HttpMethod.POST,  // Changed from DELETE to POST
                request, 
                Map.class
            );

            @SuppressWarnings("unchecked")
            Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
            
            if (responseBody != null && Boolean.TRUE.equals(responseBody.get("success"))) {
                logger.info("FAISS index cleared successfully");
                return Map.of(
                    "success", true,
                    "message", "Índice FAISS limpiado exitosamente",
                    "timestamp", java.time.Instant.now().toString()
                );
            } else {
                return Map.of(
                    "success", false,
                    "message", "Error al limpiar el índice FAISS",
                    "details", responseBody != null ? responseBody.get("message") : "Unknown error"
                );
            }
            
        } catch (Exception e) {
            logger.severe("Failed to clear FAISS index: " + e.getMessage());
            return Map.of(
                "success", false,
                "error", "Error al limpiar el índice FAISS",
                "details", e.getMessage()
            );
        }
    }

    @Override
    public Map<String, Object> removeTemaFromFaissIndex(Integer temaId) {
        try {
            if (!Boolean.TRUE.equals(useFaiss)) {
                return Map.of(
                    "success", false,
                    "message", "FAISS está deshabilitado en la configuración"
                );
            }

            if (temaId == null) {
                return Map.of(
                    "success", false,
                    "message", "ID del tema es requerido"
                );
            }

            logger.info("Removing tema " + temaId + " from FAISS index...");

            // Format topic_id as "tema_<id>"
            String topicId = TOPIC_ID_PREFIX + temaId;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Void> request = new HttpEntity<>(headers);

            String endpoint = sbertServiceUrl + "/topics/" + topicId;
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.exchange(
                endpoint,
                HttpMethod.DELETE,
                request,
                Map.class
            );

            @SuppressWarnings("unchecked")
            Map<String, Object> responseBody = (Map<String, Object>) response.getBody();

            if (responseBody != null && Boolean.TRUE.equals(responseBody.get("success"))) {
                logger.info("Tema " + temaId + " removed from FAISS index successfully");
                return Map.of(
                    "success", true,
                    "message", "Tema removido del índice FAISS exitosamente",
                    "temaId", temaId,
                    "topicId", topicId,
                    "timestamp", java.time.Instant.now().toString()
                );
            } else {
                return Map.of(
                    "success", false,
                    "message", "Error al remover el tema del índice FAISS",
                    "temaId", temaId,
                    "topicId", topicId,
                    "details", responseBody != null ? responseBody.get("message") : "Unknown error"
                );
            }

        } catch (Exception e) {
            logger.severe("Failed to remove tema " + temaId + " from FAISS index: " + e.getMessage());
            return Map.of(
                "success", false,
                "error", "Error al remover el tema del índice FAISS",
                "temaId", temaId,
                "details", e.getMessage()
            );
        }
    }
}
