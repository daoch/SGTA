package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import pucp.edu.pe.sgta.service.inter.JwtService;

import java.util.Map;

@Service
public class JwtServiceImpl implements JwtService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Extracts the JWT token from the Authorization header
     */
    public String extractTokenFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("No valid authorization token provided");
        }
        return authHeader.substring(7); // Remove "Bearer " prefix
    }

    /**
     * Extracts the 'sub' claim from a JWT token
     */
    public String extractSubFromToken(String token) {
        try {
            String[] chunks = token.split("\\.");
            if (chunks.length != 3) {
                throw new RuntimeException("Invalid JWT token format");
            }
            
            // Decode the payload (second part of JWT)
            java.util.Base64.Decoder decoder = java.util.Base64.getUrlDecoder();
            String payload = new String(decoder.decode(chunks[1]));
            
            // Parse JSON to extract claims
            Map<String, Object> claims = objectMapper.readValue(payload, Map.class);
            
            Object subObj = claims.get("sub");
            if (subObj == null) {
                throw new RuntimeException("Subject (sub) not found in token");
            }
            
            return subObj.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract subject from token: " + e.getMessage());
        }
    }

    /**
     * Extracts a specific claim from a JWT token
     */
    public Object extractClaimFromToken(String token, String claimName) {
        try {
            String[] chunks = token.split("\\.");
            if (chunks.length != 3) {
                throw new RuntimeException("Invalid JWT token format");
            }
            
            java.util.Base64.Decoder decoder = java.util.Base64.getUrlDecoder();
            String payload = new String(decoder.decode(chunks[1]));
            
            Map<String, Object> claims = objectMapper.readValue(payload, Map.class);
            return claims.get(claimName);
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract claim '" + claimName + "' from token: " + e.getMessage());
        }
    }

    /**
     * Convenience method to extract subject directly from request
     */
    public String extractSubFromRequest(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        return extractSubFromToken(token);
    }
}
