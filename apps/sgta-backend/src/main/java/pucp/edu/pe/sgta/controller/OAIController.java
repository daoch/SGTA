package pucp.edu.pe.sgta.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import pucp.edu.pe.sgta.dto.oai.OAIEndpointDto;
import pucp.edu.pe.sgta.dto.oai.OAIRecordDto;
import pucp.edu.pe.sgta.dto.oai.OAISetDto;
import pucp.edu.pe.sgta.service.inter.JwtService;
import pucp.edu.pe.sgta.service.inter.OAIService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/oai")
public class OAIController {
      private static final String ERROR_KEY = "error";
    private static final String SUCCESS_KEY = "success";
    private static final String MESSAGE_KEY = "message";
    private static final String DATA_KEY = "data";
    private static final String DETAILS_KEY = "details";
      private final OAIService oaiService;
    private final JwtService jwtService;

    public OAIController(OAIService oaiService, JwtService jwtService) {
        this.oaiService = oaiService;
        this.jwtService = jwtService;
    }
    
    /**
     * Configure OAI endpoint
     */
    @PutMapping("/config/endpoint")
    public ResponseEntity<Map<String, Object>> configureOAIEndpoint(
            @Valid @RequestBody OAIEndpointDto endpointDto,
            HttpServletRequest request) {
          Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate token and extract user ID
            jwtService.extractSubFromRequest(request);
            
            // Configure endpoint - get the result from service
            Map<String, Object> result = oaiService.configureOAIEndpoint(endpointDto.getEndpoint());
            response.put(SUCCESS_KEY, true);
            response.put(MESSAGE_KEY, "Endpoint configurado exitosamente");
            response.put(DATA_KEY, result);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        } catch (Exception e) {
            response.put(ERROR_KEY, "Error al configurar endpoint OAI");
            response.put(DETAILS_KEY, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Get current OAI endpoint
     */    @GetMapping("/config/endpoint")
    public ResponseEntity<Map<String, Object>> getCurrentOAIEndpoint(HttpServletRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate token and extract user ID
            jwtService.extractSubFromRequest(request);
            
            // Get current endpoint
            OAIEndpointDto currentEndpoint = oaiService.getCurrentOAIEndpoint();
            
            response.put(SUCCESS_KEY, true);
            response.put("endpoint", currentEndpoint);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        } catch (Exception e) {
            response.put(ERROR_KEY, "Error al obtener endpoint OAI");
            response.put(DETAILS_KEY, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Get OAI sets
     */    @GetMapping("/sets")
    public ResponseEntity<Map<String, Object>> getOAISets(HttpServletRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate token and extract user ID
            jwtService.extractSubFromRequest(request);
            
            // Get OAI sets
            List<OAISetDto> sets = oaiService.getOAISets();
            
            response.put(SUCCESS_KEY, true);
            response.put("sets", sets);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        } catch (Exception e) {
            response.put(ERROR_KEY, "Error al obtener sets OAI");
            response.put(DETAILS_KEY, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Get records by set
     */    @GetMapping("/records/set/{setSpec}")
    public ResponseEntity<Map<String, Object>> getRecordsBySet(
            @PathVariable String setSpec,
            HttpServletRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate token and extract user ID
            jwtService.extractSubFromRequest(request);
            
            // Get records by set
            List<OAIRecordDto> records = oaiService.getRecordsBySet(setSpec);
            
            response.put(SUCCESS_KEY, true);
            response.put("records", records);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        } catch (Exception e) {
            response.put(ERROR_KEY, "Error al obtener registros OAI");
            response.put(DETAILS_KEY, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Import records as temas
     */    @PostMapping("/import/temas")
    public ResponseEntity<Map<String, Object>> importRecordsAsTemas(
            @RequestParam String setSpec,
            @RequestParam Integer carreraId,
            HttpServletRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate token and extract user ID
            jwtService.extractSubFromRequest(request);
            
            // Import records as temas
            Map<String, Object> importResult = oaiService.importRecordsAsTemas(setSpec, carreraId);
            
            response.put(SUCCESS_KEY, true);
            response.put(MESSAGE_KEY, "Registros importados exitosamente");
            response.put("result", importResult);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        } catch (Exception e) {
            response.put(ERROR_KEY, "Error al importar registros OAI");
            response.put(DETAILS_KEY, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Get OAI statistics
     */    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getOAIStatistics(HttpServletRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate token and extract user ID
            jwtService.extractSubFromRequest(request);
            
            // Get OAI statistics
            Map<String, Object> statistics = oaiService.getOAIStatistics();
            
            response.put(SUCCESS_KEY, true);
            response.put("statistics", statistics);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        } catch (Exception e) {
            response.put(ERROR_KEY, "Error al obtener estadísticas OAI");
            response.put(DETAILS_KEY, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
