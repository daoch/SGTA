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
     * Get records by set with pagination support
     */    @GetMapping("/records/set/{setSpec}")
    public ResponseEntity<Map<String, Object>> getRecordsBySet(
            @PathVariable String setSpec,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer offset,
            @RequestParam(required = false, defaultValue = "false") Boolean includeTotalCount,
            @RequestParam(required = false, defaultValue = "oai_dc") String metadataPrefix,
            HttpServletRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate token and extract user ID
            jwtService.extractSubFromRequest(request);
            
            // Get records by set with pagination
            Map<String, Object> result = oaiService.getRecordsBySet(setSpec, limit, offset, includeTotalCount, metadataPrefix);
            
            response.put(SUCCESS_KEY, true);
            response.putAll(result);
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
     * Get record count for a specific set
     */
    @GetMapping("/records/count/{setSpec}")
    public ResponseEntity<Map<String, Object>> getRecordCount(
            @PathVariable String setSpec,
            @RequestParam(required = false, defaultValue = "oai_dc") String metadataPrefix,
            @RequestParam(required = false, defaultValue = "false") Boolean forceRefresh,
            HttpServletRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate token and extract user ID
            jwtService.extractSubFromRequest(request);
            
            // Get record count
            Map<String, Object> countResult = oaiService.getRecordCount(setSpec, metadataPrefix, forceRefresh);
            
            response.put(SUCCESS_KEY, true);
            response.putAll(countResult);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        } catch (Exception e) {
            response.put(ERROR_KEY, "Error al obtener conteo de registros OAI");
            response.put(DETAILS_KEY, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Start asynchronous import of records as temas
     */
    @PostMapping("/import/async")
    public ResponseEntity<Map<String, Object>> startAsyncImport(
            @RequestParam String setSpec,
            @RequestParam Integer carreraId,
            @RequestParam(required = false, defaultValue = "oai_dc") String metadataPrefix,
            HttpServletRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate token and extract user ID
            jwtService.extractSubFromRequest(request);
            
            // Start async import
            Map<String, Object> importResult = oaiService.startAsyncImport(setSpec, carreraId, metadataPrefix);
            
            response.put(SUCCESS_KEY, true);
            response.putAll(importResult);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        } catch (Exception e) {
            response.put(ERROR_KEY, "Error al iniciar importación asíncrona");
            response.put(DETAILS_KEY, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Get status of asynchronous import task
     */
    @GetMapping("/import/status/{taskId}")
    public ResponseEntity<Map<String, Object>> getAsyncImportStatus(
            @PathVariable String taskId,
            HttpServletRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate token and extract user ID
            jwtService.extractSubFromRequest(request);
            
            // Get import status
            Map<String, Object> statusResult = oaiService.getAsyncImportStatus(taskId);
            
            response.put(SUCCESS_KEY, true);
            response.putAll(statusResult);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());
        } catch (Exception e) {
            response.put(ERROR_KEY, "Error al obtener estado de importación");
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
